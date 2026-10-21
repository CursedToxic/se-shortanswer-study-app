/* ===========================================================================
   app.js — boot: load state, wire chrome, start the router.
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, qs = U.qs, qsa = U.qsa;

  A.State.load();
  A.applyPrefs();

  /* first run: welcome + name */
  const st = A.State.get();
  if (!st.profile.created || (!st.profile.name && !Object.keys(st.lessons).length && !st.xp)) {
    A.State.mutate(s => {
      s.profile.created = s.profile.created || Date.now();
      A.State.logEvent('info', 'BOOT', 'Study environment initialised — ' + A.Syllabus.totals.points + ' syllabus dot points indexed');
    });
  }

  /* ------------------------------------------------------- chrome sync */
  function paintChrome() {
    const s = A.State.summary();
    const set = (sel, text) => { const n = qs(sel); if (n) n.textContent = text; };
    set('#rail-rank', s.rank.name);
    set('#rail-rank-label', 'Rank ' + s.rank.id + ' · ' + s.rank.band);
    set('#rail-xp', s.next ? `${s.xp.toLocaleString()} XP · ${s.toNext.toLocaleString()} to ${s.next.name}` : `${s.xp.toLocaleString()} XP`);
    set('#m-rank', s.rank.name);
    set('#m-xp', s.xp.toLocaleString() + ' XP');
    const bar = qs('#rail-bar'); if (bar) bar.style.width = s.pctToNext + '%';
    qsa('[data-year]').forEach(b =>
      b.setAttribute('aria-pressed', Number(b.getAttribute('data-year')) === A.State.get().profile.year));
  }

  qsa('[data-year]').forEach(btn => btn.addEventListener('click', () => {
    const year = Number(btn.getAttribute('data-year'));
    A.State.mutate(s => { s.profile.year = year; });
    paintChrome();
    const { name } = U.parseHash();
    if (name === 'syllabus' || name === 'dashboard' || name === 'quests' || name === 'diagnostics') {
      U.navigate(name === 'dashboard' ? 'dashboard' : name + '/' + year);
      U.render();
    } else {
      U.navigate('syllabus/' + year);
    }
  }));

  A.State.subscribe(paintChrome);
  paintChrome();

  /* ------------------------------------------------------------ router */
  window.addEventListener('hashchange', U.render);
  if (!location.hash) location.hash = '#/dashboard';
  U.render();

  /* keyboard shortcuts */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const map = { d: 'dashboard', s: 'syllabus', l: 'lab', e: 'exam', m: 'quests/12', p: 'project', g: 'diagnostics', u: 'profile' };
    if (map[e.key]) { U.navigate(map[e.key]); }
  });

  /* mark the day's visit for the streak counter */
  A.State.mutate(() => {});

  console.log('%cSE Ops', 'font:700 15px system-ui;color:#2f6bff',
    `\n${A.Syllabus.totals.points} dot points · ${A.Notes.LESSONS.length} modules · ${A.Questions.QUESTIONS.length} questions · ${A.Game.CHALLENGES.length} challenges · ${A.Game.BOUNTIES.length} bounties`);
})(window.APP = window.APP || {});
