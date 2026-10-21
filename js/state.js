/* ===========================================================================
   state.js — single source of truth for learner progress
     · persistence (localStorage, auto-save, versioned)
     · XP, ranks, streaks, assets
     · dot-point mastery model (evidence → raw score → level 0–3)
     · diagnostic event log
     · sync: file export/import + optional HTTP endpoint
   =========================================================================== */
(function (A) {
  'use strict';

  const KEY = 'nesa-se-studyapp-v1';
  const VERSION = 1;

  const blank = () => ({
    v: VERSION,
    profile: { name: '', year: 12, avatar: '◆', created: Date.now(), theme: 'auto' },
    xp: 0,
    streak: { last: null, count: 0, best: 0 },
    lessons: {},        // lessonId -> { at }
    answers: {},        // questionId -> { at, format, correct, ratio, text, marks }
    exams: [],          // { id, title, at, conditions, earned, total, perPoint, durationMs }
    challenges: {},     // challengeId -> { at, code, passed }
    bounties: [],       // [bountyId]
    bountyCode: {},     // bountyId -> last submitted source
    quests: {},         // questId -> { steps: {ref:true}, done, at }
    assets: [],         // [assetId]
    mastery: {},        // pointId -> { raw, score, evidence: [] }
    portfolio: {},      // templateId -> { fields:{}, complete, at }
    uml: [],            // saved diagrams [{id,name,kind,src,at}]
    diagnostics: [],    // [{ at, level, tag, msg }]
    sync: { endpoint: '', token: '', lastPush: null, lastPull: null },
    settings: { reduceMotion: false, mono: false, y12Theme: true, unlockedTheme: null }
  });

  let state = blank();
  const listeners = [];

  /* ----------------------------------------------------------- persistence */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(blank(), parsed);
        // merge nested defaults that may be missing from an older save
        ['profile', 'streak', 'sync', 'settings'].forEach(k => {
          state[k] = Object.assign(blank()[k], state[k] || {});
        });
      }
    } catch (e) {
      console.warn('Could not read saved progress; starting fresh.', e);
      state = blank();
    }
    return state;
  }

  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        logEvent('warn', 'STORE', 'Could not save progress: ' + e.message);
      }
    }, 150);
  }

  function notify() {
    listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  }

  const subscribe = fn => { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); };
  const get = () => state;

  function mutate(fn) {
    fn(state);
    refreshAssets();
    save();
    notify();
  }

  /* ------------------------------------------------------------ diagnostics */
  function logEvent(level, tag, msg) {
    state.diagnostics.unshift({ at: Date.now(), level, tag, msg });
    if (state.diagnostics.length > 400) state.diagnostics.length = 400;
  }

  /* ------------------------------------------------------------------- XP */
  function addXP(amount, reason) {
    const before = A.Game.rankFor(state.xp);
    state.xp += amount;
    const after = A.Game.rankFor(state.xp);
    logEvent('xp', 'XP', `+${amount} XP — ${reason}`);
    if (after.id > before.id) {
      logEvent('ok', 'RANK', `Rank up: ${before.name} → ${after.name} (${after.band})`);
      A.toast && A.toast(`RANK UP — ${after.name}`, `${after.band}: ${after.blurb}`, 'rank');
    }
  }

  /* -------------------------------------------------------------- streaks */
  function touchStreak() {
    const today = new Date().toDateString();
    if (state.streak.last === today) return;
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
    state.streak.last = today;
    state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
    if (state.streak.count > 1) {
      addXP(A.Game.XP.dailyStreak, `${state.streak.count}-day streak`);
    }
  }

  /* ------------------------------------------------------------- MASTERY
     Evidence weights, per dot point. A point reaches level 3 only when it has
     been evidenced by more than one kind of activity.                        */
  const EVIDENCE_WEIGHT = {
    lesson: 1.0,
    mcq: 1.5,
    short: 2.2,      // scaled by criteria ratio
    exam: 2.5,       // scaled by mark ratio
    challenge: 2.5,
    bounty: 3.0,
    portfolio: 2.0
  };

  const LEVELS = ['Not started', 'Introduced', 'Developing', 'Mastered'];

  function levelFor(raw, kinds) {
    if (raw <= 0) return 0;
    if (raw >= 4.5 && kinds >= 2) return 3;
    if (raw >= 2) return 2;
    return 1;
  }

  function recordEvidence(pointIds, kind, ref, ratio) {
    const r = typeof ratio === 'number' ? Math.max(0, Math.min(1, ratio)) : 1;
    (pointIds || []).forEach(pid => {
      if (!A.Syllabus.POINT_INDEX[pid]) return;
      const m = state.mastery[pid] || (state.mastery[pid] = { raw: 0, score: 0, evidence: [] });
      // one entry per (kind, ref) — a repeat replaces rather than stacks
      const existing = m.evidence.find(e => e.kind === kind && e.ref === ref);
      const weight = (EVIDENCE_WEIGHT[kind] || 1) * r;
      if (existing) {
        existing.weight = Math.max(existing.weight, weight);
        existing.at = Date.now();
        existing.ratio = Math.max(existing.ratio ?? 0, r);
      } else {
        m.evidence.push({ kind, ref, weight, ratio: r, at: Date.now() });
      }
      m.raw = m.evidence.reduce((s, e) => s + e.weight, 0);
      m.kinds = new Set(m.evidence.map(e => e.kind)).size;
      const prev = m.score;
      m.score = levelFor(m.raw, m.kinds);
      if (m.score > prev && m.score === 3) {
        logEvent('ok', 'MASTERY', `${pid} reached Mastered`);
      }
    });
  }

  const masteryOf = pid => state.mastery[pid] || { raw: 0, score: 0, evidence: [] };

  function areaProgress(areaId) {
    const pts = A.Syllabus.pointsForArea(areaId);
    if (!pts.length) return { pct: 0, mastered: 0, total: 0, avg: 0 };
    let sum = 0, mastered = 0;
    pts.forEach(p => {
      const s = masteryOf(p).score;
      sum += s; if (s === 3) mastered++;
    });
    return { pct: Math.round((sum / (pts.length * 3)) * 100), mastered, total: pts.length, avg: sum / pts.length };
  }

  function yearProgress(year) {
    const pts = A.Syllabus.pointsForYear(year);
    let sum = 0, started = 0, mastered = 0;
    pts.forEach(p => {
      const s = masteryOf(p).score;
      sum += s; if (s > 0) started++; if (s === 3) mastered++;
    });
    return { pct: pts.length ? Math.round((sum / (pts.length * 3)) * 100) : 0, started, mastered, total: pts.length };
  }

  function outcomeProgress(code) {
    const areas = A.Syllabus.FOCUS_AREAS.filter(a => a.outcomes.indexOf(code) !== -1);
    const pts = areas.reduce((acc, a) => acc.concat(A.Syllabus.pointsForArea(a.id)), []);
    if (!pts.length) return 0;
    const sum = pts.reduce((s, p) => s + masteryOf(p).score, 0);
    return Math.round((sum / (pts.length * 3)) * 100);
  }

  /* --------------------------------------------------------- RECORD ACTIONS */
  function completeLesson(lessonId) {
    const lesson = A.Notes.byId(lessonId);
    if (!lesson) return;
    const first = !state.lessons[lessonId];
    mutate(() => {
      state.lessons[lessonId] = { at: Date.now() };
      recordEvidence(lesson.points, 'lesson', lessonId, 1);
      if (first) addXP(A.Game.XP.lesson, `Completed module: ${lesson.title}`);
      touchStreak();
      logEvent('info', 'LEARN', `Module completed: ${lesson.title}`);
      advanceQuests('lesson', lessonId);
    });
  }

  function recordAnswer(q, result) {
    // result: { correct (mcq) | ratio (short), text, matched: [] }
    mutate(() => {
      const prior = state.answers[q.id];
      const ratio = q.format === 'mcq' ? (result.correct ? 1 : 0) : (result.ratio || 0);
      state.answers[q.id] = {
        at: Date.now(), format: q.format, correct: !!result.correct,
        ratio, text: result.text || '', matched: result.matched || [], marks: q.marks
      };
      recordEvidence(q.points, q.format === 'mcq' ? 'mcq' : 'short', q.id, ratio);
      if (!prior) {
        if (q.format === 'mcq') {
          if (result.correct) addXP(A.Game.XP.mcqCorrect, `Correct: ${q.id}`);
        } else {
          addXP(ratio >= 0.75 ? A.Game.XP.shortStrong : A.Game.XP.shortSubmitted, `Answered ${q.id}`);
        }
      }
      touchStreak();
      const pct = Math.round(ratio * 100);
      logEvent(ratio >= 0.6 ? 'ok' : 'warn', 'QUIZ',
        `${q.id} (${q.area}) — ${pct}% of criteria evidenced · ${q.points.join(', ')}`);
      advanceQuests('question', q.id);
    });
  }

  function recordExam(summary) {
    mutate(() => {
      state.exams.unshift(summary);
      if (state.exams.length > 50) state.exams.length = 50;
      Object.keys(summary.perPoint || {}).forEach(pid => {
        const r = summary.perPoint[pid];
        recordEvidence([pid], 'exam', summary.id + ':' + pid, r.earned / Math.max(1, r.total));
      });
      addXP(A.Game.XP.examComplete, `Completed examination: ${summary.title}`);
      logEvent('info', 'EXAM',
        `${summary.title} — ${summary.earned}/${summary.total} (${Math.round(summary.earned / Math.max(1, summary.total) * 100)}%)` +
        (summary.conditions ? ' · HSC conditions' : ''));
      touchStreak();
      advanceQuests('exam', summary.examKey || summary.id);
    });
  }

  function recordChallenge(ch, source, passed) {
    mutate(() => {
      const first = !(state.challenges[ch.id] && state.challenges[ch.id].passed);
      state.challenges[ch.id] = { at: Date.now(), code: source, passed: passed || (state.challenges[ch.id] || {}).passed };
      if (passed) {
        recordEvidence(ch.points, 'challenge', ch.id, 1);
        if (first) addXP(ch.xp, `Challenge cleared: ${ch.title}`);
        logEvent('ok', 'CODE', `Challenge passed: ${ch.title} · ${ch.points.join(', ')}`);
        advanceQuests('challenge', ch.id);
      }
      touchStreak();
    });
  }

  function recordBounty(b, source, passed) {
    mutate(() => {
      state.bountyCode[b.id] = source;
      if (passed && state.bounties.indexOf(b.id) === -1) {
        state.bounties.push(b.id);
        recordEvidence(b.points, 'bounty', b.id, 1);
        addXP(b.xp, `Bounty closed: ${b.title}`);
        logEvent('ok', 'BOUNTY', `[${b.severity}] ${b.title} — patched and verified`);
        advanceQuests('bounty', b.id);
      }
      touchStreak();
    });
  }

  function savePortfolio(templateId, fields, complete) {
    const tpl = A.Portfolio.byId(templateId);
    mutate(() => {
      const prev = state.portfolio[templateId] || {};
      state.portfolio[templateId] = { fields, complete: !!complete, at: Date.now() };
      if (complete && !prev.complete) {
        recordEvidence(tpl.points, 'portfolio', templateId, 1);
        addXP(A.Game.XP.portfolioArtefact, `Portfolio artefact: ${tpl.title}`);
        logEvent('ok', 'PROJECT', `Artefact completed: ${tpl.title} · ${tpl.points.join(', ')}`);
        advanceQuests('portfolio', templateId);
      }
      touchStreak();
    });
  }

  /* ----------------------------------------------------------------- QUESTS */
  function advanceQuests(kind, ref) {
    A.Game.QUESTS.forEach(q => {
      const match = q.steps.some(s => s.kind === kind && s.ref === ref);
      if (!match) return;
      const prog = state.quests[q.id] || (state.quests[q.id] = { steps: {}, done: false });
      const key = kind + ':' + ref;
      if (!prog.steps[key]) {
        prog.steps[key] = Date.now();
        addXP(A.Game.XP.questStep, `Mission step: ${q.title}`);
      }
      const all = q.steps.every(s => prog.steps[s.kind + ':' + s.ref]);
      if (all && !prog.done) {
        prog.done = true; prog.at = Date.now();
        addXP(q.reward.xp, `Mission complete: ${q.codename}`);
        if (q.reward.asset) grantAsset(q.reward.asset);
        logEvent('ok', 'MISSION', `${q.codename} — COMPLETE`);
        A.toast && A.toast('MISSION COMPLETE', q.codename, 'quest');
      }
    });
  }

  function questProgress(q) {
    const prog = state.quests[q.id] || { steps: {}, done: false };
    const done = q.steps.filter(s => prog.steps[s.kind + ':' + s.ref]).length;
    return { done, total: q.steps.length, complete: !!prog.done, steps: prog.steps };
  }

  /* ----------------------------------------------------------------- ASSETS */
  function grantAsset(id) {
    if (state.assets.indexOf(id) !== -1) return;
    state.assets.push(id);
    const a = A.Game.assetById(id);
    if (a) {
      logEvent('ok', 'UNLOCK', `${a.name} (${a.kind}) unlocked`);
      A.toast && A.toast('UNLOCKED', `${a.icon}  ${a.name} — ${a.desc}`, 'asset');
    }
  }

  function refreshAssets() {
    A.Game.ASSETS.forEach(a => {
      if (a.auto && state.assets.indexOf(a.id) === -1) {
        try { if (a.auto(state)) grantAsset(a.id); } catch (e) { /* ignore */ }
      }
    });
  }

  /* ------------------------------------------------------------ DIAGNOSTICS
     Gap analysis across every dot point, weighted by recent performance.      */
  function gapReport(year) {
    const pts = year ? A.Syllabus.pointsForYear(year) : A.Syllabus.allPoints();
    const rows = pts.map(pid => {
      const m = masteryOf(pid);
      const info = A.Syllabus.POINT_INDEX[pid];
      // performance signal: average ratio across recorded answers touching this point
      const answers = Object.keys(state.answers)
        .map(qid => ({ qid, a: state.answers[qid], q: A.Questions.byId(qid) }))
        .filter(x => x.q && x.q.points.indexOf(pid) !== -1);
      const perf = answers.length
        ? answers.reduce((s, x) => s + (x.a.ratio || 0), 0) / answers.length
        : null;
      let severity = 0;
      if (m.score === 0) severity = 3;
      else if (m.score === 1) severity = 2;
      else if (m.score === 2) severity = 1;
      if (perf !== null && perf < 0.5) severity = Math.min(3, severity + 1);
      return {
        pid, area: info.area, group: info.group, text: info.point.text,
        level: m.score, levelName: LEVELS[m.score], perf, severity,
        attempts: answers.length, evidence: m.evidence || []
      };
    });
    rows.sort((a, b) => b.severity - a.severity || a.pid.localeCompare(b.pid));
    return rows;
  }

  function summary() {
    const rank = A.Game.rankFor(state.xp);
    const next = A.Game.nextRank(state.xp);
    return {
      xp: state.xp, rank, next,
      toNext: next ? next.xp - state.xp : 0,
      pctToNext: next ? Math.round(((state.xp - rank.xp) / (next.xp - rank.xp)) * 100) : 100,
      lessons: Object.keys(state.lessons).length,
      lessonsTotal: A.Notes.LESSONS.length,
      answered: Object.keys(state.answers).length,
      questionsTotal: A.Questions.QUESTIONS.length,
      challenges: Object.values(state.challenges).filter(c => c.passed).length,
      challengesTotal: A.Game.CHALLENGES.length,
      bounties: state.bounties.length,
      bountiesTotal: A.Game.BOUNTIES.length,
      quests: A.Game.QUESTS.filter(q => (state.quests[q.id] || {}).done).length,
      questsTotal: A.Game.QUESTS.length,
      assets: state.assets.length,
      assetsTotal: A.Game.ASSETS.length,
      exams: state.exams.length,
      y11: yearProgress(11),
      y12: yearProgress(12),
      streak: state.streak
    };
  }

  /* -------------------------------------------------------------- SYNC I/O */
  function exportJSON() {
    return JSON.stringify({ app: 'NESA-SE-StudyApp', v: VERSION, exported: new Date().toISOString(), state }, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    const incoming = parsed.state || parsed;
    if (!incoming || typeof incoming !== 'object') throw new Error('Not a valid progress file');
    state = Object.assign(blank(), incoming);
    ['profile', 'streak', 'sync', 'settings'].forEach(k => {
      state[k] = Object.assign(blank()[k], state[k] || {});
    });
    logEvent('ok', 'SYNC', 'Progress imported from file');
    refreshAssets(); save(); notify();
    return true;
  }

  async function pushRemote() {
    const { endpoint, token } = state.sync;
    if (!endpoint) throw new Error('No sync endpoint configured');
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' },
        token ? { Authorization: 'Bearer ' + token } : {}),
      body: exportJSON()
    });
    if (!res.ok) throw new Error('Sync failed: HTTP ' + res.status);
    mutate(() => { state.sync.lastPush = Date.now(); logEvent('ok', 'SYNC', 'Pushed to ' + endpoint); });
    return true;
  }

  async function pullRemote() {
    const { endpoint, token } = state.sync;
    if (!endpoint) throw new Error('No sync endpoint configured');
    const res = await fetch(endpoint, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
    if (!res.ok) throw new Error('Sync failed: HTTP ' + res.status);
    importJSON(await res.text());
    mutate(() => { state.sync.lastPull = Date.now(); logEvent('ok', 'SYNC', 'Pulled from ' + endpoint); });
    return true;
  }

  function reset() {
    state = blank();
    save(); notify();
  }

  A.State = {
    load, save, get, mutate, subscribe, summary, logEvent, addXP,
    completeLesson, recordAnswer, recordExam, recordChallenge, recordBounty, savePortfolio,
    recordEvidence, masteryOf, areaProgress, yearProgress, outcomeProgress, LEVELS,
    questProgress, grantAsset, gapReport,
    exportJSON, importJSON, pushRemote, pullRemote, reset
  };
})(window.APP = window.APP || {});
