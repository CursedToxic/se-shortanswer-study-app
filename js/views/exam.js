/* ===========================================================================
   views/exam.js — multi-format question engine and examination simulator
     practice mode     : immediate marking and feedback, hints, sample answers
     conditions mode   : HSC simulation — countdown, reading time, no feedback
                         until the paper is submitted, no sample answers while
                         working, auto-submit when time expires
   Marking: MCQ auto-marked; short/extended marked against published criteria
   using keyword evidence, then reported transparently per criterion.
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, el = U.el, nav = U.navigate;

  const Q = A.Questions;

  /* --------------------------------------------------------- paper builder */
  const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);

  function buildPaper(spec) {
    // spec: { kind:'area'|'year'|'gaps'|'custom', ref, count, conditions }
    let pool = [];
    if (spec.kind === 'area') pool = Q.byArea(spec.ref);
    else if (spec.kind === 'year') pool = Q.byYear(Number(spec.ref));
    else if (spec.kind === 'gaps') {
      const weak = A.State.gapReport(spec.year || null).filter(g => g.severity >= 2).map(g => g.pid);
      pool = Q.QUESTIONS.filter(q => q.points.some(p => weak.indexOf(p) !== -1));
      if (pool.length < 4) pool = Q.QUESTIONS.slice();
    } else pool = Q.QUESTIONS.slice();

    // balance: at least one question from each area present in the pool,
    // and a spread of formats, so a paper demands breadth not luck
    const byArea = {};
    pool.forEach(q => (byArea[q.area] = byArea[q.area] || []).push(q));
    const picked = [];
    Object.keys(byArea).forEach(a => {
      const list = shuffle(byArea[a]);
      picked.push(list[0]);
      if (list[1]) picked.push(list[1]);
    });
    shuffle(pool).forEach(q => { if (picked.indexOf(q) === -1) picked.push(q); });

    const count = Math.min(spec.count || 8, picked.length);
    // order: multiple choice first, then short, then extended — as in the HSC
    const chosen = picked.slice(0, count);
    const rank = { mcq: 0, short: 1, extended: 2 };
    chosen.sort((a, b) => rank[a.format] - rank[b.format] || a.marks - b.marks);
    return chosen;
  }

  const paperMinutes = qs => Math.max(10, Math.round(Q.totalMarks(qs) * 1.8 + 5));

  /* =============================== EXAM HOME =========================== */
  U.route('exam', (args) => {
    if (args[0] === 'area') return startPicker({ kind: 'area', ref: args[1] });
    if (args[0] === 'pick') return startPicker({});
    const view = el('div', { class: 'view' });
    const st = A.State.get();

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Examination' }),
        el('h1', { text: 'Exam centre' }),
        el('p', { text: 'Papers mix multiple choice, short answer and extended response across code snippets, system logs, architecture diagrams and scenarios — the formats the HSC paper actually uses.' })
      ])
    ]));

    const card = (title, desc, chips, onGo, primary) => el('div', { class: 'card hover' }, [
      el('h2', { text: title }),
      el('p', { class: 'small muted', text: desc }),
      el('div', { class: 'qmeta', style: { marginBottom: '12px' } }, chips.map(c => el('span', { class: 'chip', text: c }))),
      el('button', { class: 'btn ' + (primary ? 'primary' : ''), onClick: onGo }, 'Begin →')
    ]);

    view.appendChild(el('div', { class: 'grid g2' }, [
      card('Year 12 trial — HSC conditions', 'A full paper across all four Year 12 focus areas, under simulated examination conditions: countdown clock, reading time, no feedback until you submit.',
        ['12 questions', 'timed', 'no hints'], () => startPaper({ kind: 'year', ref: 12, count: 12, conditions: true }), true),
      card('Year 11 paper — HSC conditions', 'A full Year 11 paper across Programming Fundamentals, the Object-Oriented Paradigm and Programming Mechatronics under examination conditions.',
        ['10 questions', 'timed', 'no hints'], () => startPaper({ kind: 'year', ref: 11, count: 10, conditions: true })),
      card('Targeted revision set', 'Questions chosen from your weakest dot points in the diagnostic report. Marked immediately with full feedback and sample answers.',
        ['6 questions', 'practice mode', 'adaptive'], () => startPaper({ kind: 'gaps', count: 6, conditions: false })),
      card('Focus area practice', 'Choose one focus area and work through its questions with immediate marking, criteria feedback and model answers.',
        ['practice mode', 'all formats'], () => nav('exam/pick'))
    ]));

    if (st.exams.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Results history' }),
        el('div', { class: 'tablewrap' }, [el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Paper', 'Date', 'Mark', '%', 'Conditions'].map(h => el('th', { text: h })))]),
          el('tbody', {}, st.exams.slice(0, 12).map(e => el('tr', {}, [
            el('td', { text: e.title }),
            el('td', { class: 'muted', text: U.fmtDate(e.at) }),
            el('td', { text: `${e.earned}/${e.total}` }),
            el('td', {}, [el('span', {
              class: 'chip ' + (e.earned / e.total >= 0.8 ? 'ok' : e.earned / e.total >= 0.5 ? 'warn' : 'bad'),
              text: Math.round(e.earned / Math.max(1, e.total) * 100) + '%'
            })]),
            el('td', { class: 'muted', text: e.conditions ? 'HSC simulation' : 'practice' })
          ])))
        ])])
      ]));
    }

    return view;
  }, { title: 'Exam centre' });

  function startPicker(pre) {
    const view = el('div', { class: 'view' });
    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [el('div', { class: 'eyebrow', text: 'Examination' }), el('h1', { text: 'Focus area practice' })]),
      el('button', { class: 'btn ghost', onClick: () => nav('exam') }, '← Exam centre')
    ]));
    view.appendChild(el('div', { class: 'grid g2' }, A.Syllabus.FOCUS_AREAS.map(a => {
      const n = Q.byArea(a.id).length;
      return el('div', { class: 'card hover', onClick: () => startPaper({ kind: 'area', ref: a.id, count: n, conditions: false }) }, [
        el('div', { class: 'eyebrow', text: 'Year ' + a.year }),
        el('h2', { text: a.title, style: { margin: '2px 0 6px' } }),
        el('p', { class: 'small muted', text: `${n} questions · ${Q.totalMarks(Q.byArea(a.id))} marks · immediate feedback` }),
        el('button', { class: 'btn sm' }, 'Start →')
      ]);
    })));
    if (pre && pre.ref) setTimeout(() => startPaper({ kind: 'area', ref: pre.ref, count: Q.byArea(pre.ref).length, conditions: false }), 0);
    return view;
  }

  /* ============================== THE PAPER ============================ */
  let session = null;

  function startPaper(spec) {
    const questions = buildPaper(spec);
    if (!questions.length) { U.toast('NO QUESTIONS', 'No questions matched that selection.'); return; }
    const title = spec.kind === 'year' ? `Year ${spec.ref} ${spec.conditions ? 'trial examination' : 'paper'}`
      : spec.kind === 'area' ? A.Syllabus.AREA_INDEX[spec.ref].title + ' practice'
      : spec.kind === 'gaps' ? 'Targeted revision set' : 'Custom paper';
    session = {
      id: 'EX-' + Date.now().toString(36).toUpperCase(),
      title, spec, questions,
      answers: {},        // qid -> { choice | text }
      marked: {},         // qid -> marking result (practice mode marks as you go)
      index: 0,
      conditions: !!spec.conditions,
      minutes: paperMinutes(questions),
      startedAt: null,
      reading: spec.conditions ? 60 : 0,
      submitted: false
    };
    const zone = spec.kind === 'year' ? (Number(spec.ref) === 12 ? 'y12' : 'y11')
      : spec.kind === 'area' ? U.zoneOfArea(spec.ref) : 'y11';
    sessionZone = zone;
    nav('sitting');
  }
  let sessionZone = 'y11';

  U.route('sitting', () => {
    if (!session) {
      return el('div', { class: 'view' }, [el('div', { class: 'card' }, [
        el('h2', { text: 'No paper in progress' }),
        el('p', { class: 'small muted', text: 'A paper is held in memory while you sit it, so reloading the page ends the session. Results you already submitted are kept in your record.' }),
        el('button', { class: 'btn primary', onClick: () => nav('exam') }, 'Exam centre →')
      ])]);
    }
    return session.submitted ? renderResults() : renderSitting();
  }, { title: 'Examination', zone: () => sessionZone });

  function renderSitting() {
    const s = session;
    const view = el('div', { class: 'view' });
    const q = s.questions[s.index];

    /* ---- HUD ---- */
    const clockEl = el('span', { class: 'clock', text: '--:--' });
    const hud = el('div', { class: 'examhud glass' }, [
      el('div', { style: { flex: '1', minWidth: '0' } }, [
        el('div', { class: 'eyebrow', text: s.title + (s.conditions ? ' · EXAMINATION CONDITIONS' : ' · practice') }),
        el('b', { text: `Question ${s.index + 1} of ${s.questions.length}` })
      ]),
      s.conditions ? clockEl : el('span', { class: 'chip', text: Q.totalMarks(s.questions) + ' marks' }),
      el('button', { class: 'btn sm ghost', onClick: () => {
        U.confirmDialog('Leave this paper?', 'Your answers in this paper will be discarded.', () => { session = null; nav('exam'); }, 'Leave');
      } }, 'Exit')
    ]);
    view.appendChild(hud);

    if (s.conditions && !s.startedAt) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Examination conditions' }),
        el('ul', {}, [
          el('li', { text: `${s.questions.length} questions · ${Q.totalMarks(s.questions)} marks · ${s.minutes} minutes working time` }),
          el('li', { text: 'One minute of reading time before the clock starts.' }),
          el('li', { text: 'No marking, hints or sample answers are shown until you submit the whole paper.' }),
          el('li', { text: 'The paper submits automatically when working time expires.' }),
          el('li', { text: 'You may move between questions freely and change any answer before submitting.' })
        ]),
        el('div', { class: 'btnrow' }, [
          el('button', { class: 'btn primary', onClick: () => { s.startedAt = Date.now(); U.render(); } }, 'Begin reading time'),
          el('button', { class: 'btn ghost', onClick: () => { session = null; nav('exam'); } }, 'Cancel')
        ])
      ]));
      return view;
    }

    if (s.conditions) startClock(clockEl);

    /* ---- question ---- */
    view.appendChild(questionCard(q, {
      conditions: s.conditions,
      value: s.answers[q.id],
      marked: s.marked[q.id],
      onAnswer: val => { s.answers[q.id] = val; },
      onMark: result => { s.marked[q.id] = result; }
    }));

    /* ---- navigation ---- */
    const dots = el('div', { class: 'qmeta' }, s.questions.map((qq, i) =>
      el('button', {
        class: 'chip' + (i === s.index ? ' accent' : s.answers[qq.id] !== undefined ? ' ok' : ''),
        title: `Question ${i + 1} · ${qq.marks} marks`,
        onClick: () => { s.index = i; U.render(); }
      }, String(i + 1))));

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('button', { class: 'btn ghost', disabled: s.index === 0, onClick: () => { s.index--; U.render(); } }, '← Previous'),
        dots,
        s.index < s.questions.length - 1
          ? el('button', { class: 'btn primary', onClick: () => { s.index++; U.render(); } }, 'Next →')
          : el('button', { class: 'btn primary', onClick: () => confirmSubmit() }, 'Submit paper')
      ]),
      el('div', { class: 'small muted', style: { marginTop: '10px' },
        text: `${Object.keys(s.answers).length} of ${s.questions.length} answered` }),
      s.index < s.questions.length - 1
        ? el('button', { class: 'btn sm ghost', style: { marginTop: '10px' }, onClick: () => confirmSubmit() }, 'Submit paper now')
        : null
    ]));

    return view;
  }

  let clockTimer = null;
  function startClock(node) {
    clearInterval(clockTimer);
    const s = session;
    const tick = () => {
      if (!session || session.submitted) { clearInterval(clockTimer); return; }
      const elapsed = Date.now() - s.startedAt;
      const readingLeft = s.reading * 1000 - elapsed;
      if (readingLeft > 0) {
        node.textContent = 'READING ' + U.clock(readingLeft);
        node.classList.remove('low');
        return;
      }
      const left = s.minutes * 60000 - (elapsed - s.reading * 1000);
      node.textContent = U.clock(left);
      node.classList.toggle('low', left < 300000);
      if (left <= 0) {
        clearInterval(clockTimer);
        submitPaper(true);
      }
    };
    tick();
    clockTimer = setInterval(tick, 1000);
  }

  function confirmSubmit() {
    const unanswered = session.questions.filter(q => session.answers[q.id] === undefined).length;
    U.confirmDialog('Submit this paper?',
      unanswered ? `${unanswered} question(s) are unanswered and will score zero.` : 'All questions answered. Your paper will be marked and the results recorded.',
      () => submitPaper(false), 'Submit');
  }

  function submitPaper(auto) {
    const s = session;
    if (!s || s.submitted) return;
    clearInterval(clockTimer);
    s.submitted = true;
    s.finishedAt = Date.now();

    let earned = 0, total = 0;
    const perPoint = {};
    s.results = s.questions.map(q => {
      total += q.marks;
      const val = s.answers[q.id];
      let res;
      if (q.format === 'mcq') {
        const correct = val === q.answer;
        res = { correct, marks: correct ? q.marks : 0, ratio: correct ? 1 : 0 };
      } else {
        const m = U.markShort(q, val || '');
        res = Object.assign({ correct: m.ratio >= 0.75 }, m);
      }
      earned += res.marks;
      q.points.forEach(p => {
        perPoint[p] = perPoint[p] || { earned: 0, total: 0 };
        perPoint[p].earned += res.marks;
        perPoint[p].total += q.marks;
      });
      // feed each question into the per-question record too
      A.State.recordAnswer(q, q.format === 'mcq'
        ? { correct: res.correct, text: '' }
        : { ratio: res.ratio, text: val || '', matched: (res.crits || []).filter(c => c.hit).map(c => c.t) });
      return { q, res, answer: val };
    });

    A.State.recordExam({
      id: s.id, examKey: s.spec.kind === 'year' ? 'y' + s.spec.ref + '-full' : s.spec.kind + '-' + (s.spec.ref || ''),
      title: s.title, at: Date.now(), conditions: s.conditions,
      earned, total, perPoint,
      durationMs: s.startedAt ? s.finishedAt - s.startedAt : 0,
      autoSubmitted: !!auto
    });
    s.earned = earned; s.total = total; s.perPoint = perPoint;
    if (auto) U.toast('TIME', 'Working time expired — the paper was submitted automatically.');
    U.render();
  }

  /* ============================== RESULTS ============================== */
  function renderResults() {
    const s = session;
    const pct = Math.round(s.earned / Math.max(1, s.total) * 100);
    const band = pct >= 90 ? 6 : pct >= 78 ? 5 : pct >= 65 ? 4 : pct >= 50 ? 3 : pct >= 35 ? 2 : 1;
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: s.title + (s.conditions ? ' · examination conditions' : '') }),
        el('h1', { text: `${s.earned} / ${s.total}` }),
        el('p', { text: `${pct}% — indicative band ${band}. Band mapping is a guide only: extended responses here are marked against published criteria by keyword evidence, not by a human marker.` })
      ]),
      el('div', { class: 'btnrow' }, [
        el('button', { class: 'btn', onClick: () => nav('diagnostics') }, 'Diagnostic report →'),
        el('button', { class: 'btn ghost', onClick: () => { session = null; nav('exam'); } }, 'Exam centre')
      ])
    ]));

    /* by area */
    const byArea = {};
    s.results.forEach(r => {
      const a = byArea[r.q.area] = byArea[r.q.area] || { earned: 0, total: 0 };
      a.earned += r.res.marks; a.total += r.q.marks;
    });
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Performance by focus area' }),
      el('div', { class: 'grid', style: { gap: '10px' } }, Object.keys(byArea).map(id => {
        const a = byArea[id], p = Math.round(a.earned / a.total * 100);
        return el('div', { class: 'spread', style: { gap: '12px' } }, [
          el('span', { class: 'small', style: { flex: '1' }, text: A.Syllabus.AREA_INDEX[id].title }),
          el('div', { style: { width: '120px' } }, [U.progressBar(p, true)]),
          el('span', { class: 'chip ' + (p >= 75 ? 'ok' : p >= 50 ? 'warn' : 'bad'), text: `${a.earned}/${a.total}` })
        ]);
      }))
    ]));

    /* weakest dot points from this paper */
    const weak = Object.keys(s.perPoint)
      .map(p => ({ p, r: s.perPoint[p].earned / s.perPoint[p].total }))
      .filter(x => x.r < 0.7).sort((a, b) => a.r - b.r).slice(0, 8);
    if (weak.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Dot points to revise' }),
        el('p', { class: 'small muted', text: 'Scored below 70% in this paper. These have been written into your diagnostic log.' }),
        el('div', { class: 'rows' }, weak.map(w =>
          el('button', { class: 'rowitem', onClick: () => nav('point/' + w.p) }, [
            el('div', { class: 'lead', text: Math.round(w.r * 100) + '%' }),
            el('div', { class: 'body' }, [
              el('b', { text: w.p }),
              el('span', { text: A.Syllabus.textOf(w.p) })
            ])
          ])))
      ]));
    }

    /* full marked paper */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Marked paper' }),
      el('p', { class: 'small muted', text: 'Every question with your response, the marking criteria and a model answer.' })
    ]));
    s.results.forEach((r, i) => {
      view.appendChild(questionCard(r.q, {
        reviewing: true, index: i + 1,
        value: r.answer, marked: r.res
      }));
    });

    return view;
  }

  /* ========================= QUESTION COMPONENT ======================== */
  function questionCard(q, opts) {
    opts = opts || {};
    const card = el('div', { class: 'card qcard' });
    const area = A.Syllabus.AREA_INDEX[q.area];

    card.appendChild(el('div', { class: 'qmeta' }, [
      opts.index ? el('span', { class: 'chip accent', text: 'Q' + opts.index }) : null,
      el('span', { class: 'chip', text: q.marks + ' mark' + (q.marks > 1 ? 's' : '') }),
      el('span', { class: 'chip mono', text: q.outcome }),
      el('span', { class: 'chip', text: `Y${area.year} ${area.title}` }),
      el('span', { class: 'chip', text: q.format === 'mcq' ? 'Multiple choice' : q.format === 'short' ? 'Short answer' : 'Extended response' }),
      q.media ? el('span', { class: 'chip', text: { code: 'Code snippet', log: 'System log', diagram: 'Architecture diagram', scenario: 'Scenario' }[q.media.kind] }) : null
    ]));

    if (q.media) card.appendChild(U.renderMedia(q.media));
    card.appendChild(el('div', { class: 'stem', text: q.stem }));

    const feedback = el('div');

    if (q.format === 'mcq') {
      const name = 'q-' + q.id + '-' + Math.random().toString(36).slice(2, 7);
      const opts_ = el('div', { class: 'opts' }, q.options.map((text, i) => {
        const chosen = opts.value === i;
        const lab = el('label', { class: 'opt' }, [
          el('input', { type: 'radio', name, checked: chosen ? true : null, disabled: opts.reviewing ? true : null }),
          el('span', { class: 'key', text: 'ABCD'[i] }),
          el('span', { text })
        ]);
        if (opts.reviewing || (opts.marked && !opts.conditions)) {
          if (i === q.answer) lab.setAttribute('data-state', 'correct');
          else if (chosen) lab.setAttribute('data-state', 'wrong');
        }
        lab.querySelector('input').addEventListener('change', () => {
          if (opts.reviewing) return;
          opts.onAnswer && opts.onAnswer(i);
          if (!opts.conditions) {
            const correct = i === q.answer;
            A.State.recordAnswer(q, { correct });
            opts.onMark && opts.onMark({ correct, marks: correct ? q.marks : 0, ratio: correct ? 1 : 0 });
            [...opts_.children].forEach((c, j) => {
              c.setAttribute('data-state', j === q.answer ? 'correct' : (j === i ? 'wrong' : ''));
            });
            showMcqFeedback(correct);
          }
        });
        return lab;
      }));
      card.appendChild(opts_);

      function showMcqFeedback(correct) {
        feedback.innerHTML = '';
        feedback.appendChild(el('div', { class: 'callout ' + (correct ? 'tip' : 'exam') }, [
          el('b', { text: correct ? 'Correct. ' : 'Not correct. The answer is ' + 'ABCD'[q.answer] + '. ' }),
          el('span', { text: q.why })
        ]));
        feedback.appendChild(U.pointChips(q.points));
      }
      if (opts.reviewing) showMcqFeedback(opts.marked && opts.marked.correct);

    } else {
      const expected = U.EXPECTED_WORDS(q.marks);
      const ta = el('textarea', {
        rows: q.marks >= 5 ? 14 : q.marks >= 4 ? 10 : 6,
        placeholder: `Write your response — roughly ${expected} words for ${q.marks} marks.`,
        'aria-label': 'Your response',
        disabled: opts.reviewing ? true : null
      });
      ta.value = opts.value || '';
      const counter = el('div', { class: 'small muted' });
      const count = () => {
        const w = (ta.value.trim().match(/\S+/g) || []).length;
        counter.textContent = `${w} words · a ${q.marks}-mark response is typically around ${expected}`;
      };
      ta.addEventListener('input', () => { count(); opts.onAnswer && opts.onAnswer(ta.value); });
      count();
      card.appendChild(ta);
      card.appendChild(counter);

      if (!opts.reviewing) {
        card.appendChild(el('div', { class: 'btnrow' }, [
          el('button', {
            class: 'btn', onClick: () => {
              opts.onAnswer && opts.onAnswer(ta.value);
              if (opts.conditions) { U.toast('SAVED', 'Response saved. Marking is released when you submit the paper.'); return; }
              const m = U.markShort(q, ta.value);
              A.State.recordAnswer(q, { ratio: m.ratio, text: ta.value, matched: m.crits.filter(c => c.hit).map(c => c.t) });
              opts.onMark && opts.onMark(m);
              showShortFeedback(m);
            }
          }, opts.conditions ? 'Save response' : 'Mark my response')
        ]));
      }

      function showShortFeedback(m) {
        feedback.innerHTML = '';

        /* headline: marks, band, development */
        feedback.appendChild(el('div', { class: 'markhead' }, [
          el('div', { class: 'markscore' }, [
            el('b', { text: `${m.awardedMarks}/${m.maxMarks}` }),
            el('span', { text: 'marks' })
          ]),
          el('div', { style: { flex: '1', minWidth: '180px' } }, [
            el('div', { class: 'spread', style: { gap: '8px' } }, [
              el('span', { class: 'chip ' + (m.band >= 5 ? 'ok' : m.band >= 3 ? 'warn' : 'bad'), text: m.bandLabel }),
              el('span', { class: 'small muted', text: `${m.words} words · ${m.development}` })
            ]),
            el('div', { class: 'small', style: { marginTop: '5px' }, text: m.bandDescriptor })
          ])
        ]));

        /* criterion-by-criterion rubric */
        feedback.appendChild(el('h3', { text: 'Marking rubric', style: { marginBottom: '6px' } }));
        feedback.appendChild(el('div', { class: 'marking' }, m.criteria.map(c =>
          el('div', { class: 'crit', 'data-hit': c.hit ? '1' : '0' }, [
            el('span', { class: 'mk', text: c.hit ? '✓' : '○' }),
            el('span', { style: { flex: '1' } }, [
              el('span', { text: c.t }),
              el('div', { class: 'small muted', style: { marginTop: '2px' },
                text: `${c.level} · typically Band ${c.band}` })
            ]),
            el('span', { class: 'chip mono', text: `${c.awarded}/${c.marks}` })
          ]))));

        /* what the command verb demanded */
        if (m.structure.length) {
          feedback.appendChild(el('h3', { text: 'Response to the question asked' }));
          feedback.appendChild(el('div', { class: 'small muted', style: { marginBottom: '7px' },
            text: `Command verb${m.verbs.length > 1 ? 's' : ''}: ${m.verbs.join(', ')}` }));
          feedback.appendChild(el('div', { class: 'marking' }, m.structure.map(s =>
            el('div', { class: 'crit', 'data-hit': s.ok ? '1' : '0' }, [
              el('span', { class: 'mk', text: s.ok ? '✓' : '○' }),
              el('span', { style: { flex: '1' } }, [
                el('b', { text: s.label }),
                s.ok ? null : el('div', { class: 'small', style: { marginTop: '2px' }, text: s.message })
              ])
            ]))));
        }

        /* caps actually applied */
        if (m.caps.length) {
          feedback.appendChild(el('div', { class: 'callout', style: { borderLeft: '3px solid var(--warn)' } }, [
            el('b', { text: 'Mark limited by: ' }),
            el('span', { text: m.caps.map(c => `${c.reason} (capped at ${Math.round(c.cap * 100)}%)`).join('; ') + '.' })
          ]));
        }

        /* misconceptions are the most valuable feedback in the whole app */
        m.misconceptions.forEach(mis => {
          feedback.appendChild(el('div', { class: 'callout misconception' }, [
            el('b', { text: '⚠ Misconception · −' + mis.penalty + ' mark. ' }),
            el('span', { html: mis.message })
          ]));
        });

        /* next steps */
        if (m.advice.length) {
          feedback.appendChild(el('h3', { text: 'To improve this response' }));
          feedback.appendChild(el('ul', {}, m.advice.map(a => el('li', { html: a }))));
        }

        feedback.appendChild(el('div', { class: 'callout', style: { marginTop: '12px' } }, [
          el('b', { text: 'How this was marked. ' }),
          el('span', { text: 'Each criterion is weighted by the thinking it demands, and the response is then checked against what the command verb actually requires — a compare question needs comparison, an evaluate question needs a judgement. This is an indication, not a mark: a criterion can be met in words the checker does not recognise. Read the sample below and judge your own work against it honestly.' })
        ]));
        feedback.appendChild(el('details', { class: 'acc' }, [
          el('summary', { text: 'Sample response' }),
          el('div', {}, [el('p', { style: { whiteSpace: 'pre-wrap' }, text: q.sample })])
        ]));
        feedback.appendChild(U.pointChips(q.points));
      }
      if (opts.reviewing && opts.marked) showShortFeedback(opts.marked);
    }

    card.appendChild(feedback);
    return card;
  }

  /* ========================= SINGLE QUESTION =========================== */
  U.route('question', (args) => {
    const q = Q.byId(args[0]);
    if (!q) return el('div', { class: 'card' }, 'Unknown question.');
    const prior = A.State.get().answers[q.id];
    const view = el('div', { class: 'view' });
    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Practice question · ' + q.id }),
        el('h1', { text: A.Syllabus.AREA_INDEX[q.area].title })
      ]),
      el('button', { class: 'btn ghost', onClick: () => history.back() }, '← Back')
    ]));
    view.appendChild(questionCard(q, { value: prior ? (q.format === 'mcq' ? undefined : prior.text) : undefined }));
    return view;
  }, { title: 'Question', zone: a => { const q = Q.byId(a[0]); return q && A.Syllabus.AREA_INDEX[q.area].year === 12 ? 'y12' : 'y11'; } });

  A.Exam = { buildPaper, questionCard, startPaper };
})(window.APP = window.APP || {});
