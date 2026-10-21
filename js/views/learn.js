/* ===========================================================================
   views/learn.js — dashboard, syllabus map, focus areas, modules, dot points
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, el = U.el, nav = U.navigate;

  /* ============================== DASHBOARD ============================ */
  U.route('dashboard', () => {
    const s = A.State.summary();
    const st = A.State.get();
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'NESA Software Engineering 11–12 (2022)' }),
        el('h1', { text: st.profile.name ? `Welcome back, ${st.profile.name}` : 'Mission control' }),
        el('p', { text: 'Every module, question, challenge and portfolio artefact in this app is mapped to a syllabus dot point. Your mastery is tracked at that level.' })
      ]),
      el('div', { class: 'btnrow' }, [
        el('button', { class: 'btn primary', onClick: () => nav('exam') }, '▶ Start an exam'),
        el('button', { class: 'btn', onClick: () => nav('lab') }, '⌨ Code lab')
      ])
    ]));

    /* rank + XP */
    const rankCard = el('div', { class: 'card' }, [
      el('div', { class: 'row', style: { alignItems: 'center', gap: '18px' } }, [
        el('div', { class: 'ring', style: { '--p': s.pctToNext } }, [el('b', { text: s.rank.id })]),
        el('div', { style: { flex: '1', minWidth: '180px' } }, [
          el('div', { class: 'eyebrow', text: 'Rank ' + s.rank.id + ' · maps to ' + s.rank.band }),
          el('div', { style: { fontSize: '25px', fontWeight: '700', letterSpacing: '-.03em' }, text: s.rank.name }),
          el('div', { class: 'small muted', text: s.rank.blurb }),
          el('div', { style: { marginTop: '10px' } }, [U.progressBar(s.pctToNext)]),
          el('div', { class: 'small muted', style: { marginTop: '5px' },
            text: s.next ? `${s.xp.toLocaleString()} XP · ${s.toNext.toLocaleString()} XP to ${s.next.name} (${s.next.band})`
                         : `${s.xp.toLocaleString()} XP · maximum rank reached` })
        ])
      ])
    ]);

    view.appendChild(el('div', { class: 'grid g2' }, [
      rankCard,
      el('div', { class: 'grid g2', style: { gap: '14px' } }, [
        U.statCard('Dot points mastered', `${s.y11.mastered + s.y12.mastered}`, `of ${A.Syllabus.totals.points} in the syllabus`, () => nav('syllabus')),
        U.statCard('Day streak', String(st.streak.count || 0), `best ${st.streak.best || 0} days`),
        U.statCard('Bounties closed', `${s.bounties}/${s.bountiesTotal}`, 'patched and verified', () => nav('bounties')),
        U.statCard('Exams sat', String(s.exams), s.exams ? 'latest ' + Math.round(st.exams[0].earned / Math.max(1, st.exams[0].total) * 100) + '%' : 'none yet', () => nav('exam'))
      ])
    ]));

    /* year progress */
    const yearCard = y => {
      const p = y === 11 ? s.y11 : s.y12;
      return el('div', { class: 'card hover', onClick: () => nav('syllabus/' + y) }, [
        el('div', { class: 'spread' }, [
          el('h2', { text: `Year ${y}`, style: { margin: 0 } }),
          el('span', { class: 'chip' + (y === 12 ? ' accent' : ''), text: p.pct + '% mastery' })
        ]),
        U.progressBar(p.pct),
        el('div', { class: 'small muted', style: { marginTop: '7px' },
          text: `${p.started}/${p.total} dot points started · ${p.mastered} mastered` }),
        el('div', { class: 'grid', style: { marginTop: '12px', gap: '8px' } },
          A.Syllabus.FOCUS_AREAS.filter(a => a.year === y).map(a => {
            const ap = A.State.areaProgress(a.id);
            return el('div', { class: 'spread', style: { gap: '10px' } }, [
              el('span', { class: 'small', text: a.title, style: { flex: '1' } }),
              el('div', { style: { width: '92px' } }, [U.progressBar(ap.pct, true)]),
              el('span', { class: 'small muted', text: ap.pct + '%', style: { width: '34px', textAlign: 'right' } })
            ]);
          }))
      ]);
    };
    view.appendChild(el('div', { class: 'grid g2' }, [yearCard(11), yearCard(12)]));

    /* recommended next */
    const gaps = A.State.gapReport().filter(g => g.severity >= 2).slice(0, 6);
    const recs = [];
    gaps.forEach(g => {
      const lesson = A.Notes.forPoint(g.pid).find(l => !A.State.get().lessons[l.id]);
      if (lesson && !recs.some(r => r.id === lesson.id)) {
        recs.push({ id: lesson.id, kind: 'Module', title: lesson.title, sub: `${lesson.mins} min · covers ${g.pid}`, go: () => nav('lesson/' + lesson.id), icon: '▤' });
      }
    });
    A.Game.QUESTS.filter(q => !(A.State.get().quests[q.id] || {}).done).slice(0, 2).forEach(q => {
      recs.push({ id: q.id, kind: q.year === 12 ? 'Mission' : 'Module quest', title: q.codename, sub: q.brief.slice(0, 92) + '…', go: () => nav('quest/' + q.id), icon: q.year === 12 ? '◈' : '◆' });
    });
    if (recs.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Recommended next' }),
        el('p', { class: 'small muted', text: 'Chosen from your diagnostic gaps — the dot points with the weakest evidence.' }),
        el('div', { class: 'rows' }, recs.slice(0, 5).map(r =>
          el('button', { class: 'rowitem', onClick: r.go }, [
            el('div', { class: 'lead', text: r.icon }),
            el('div', { class: 'body' }, [el('b', { text: r.title }), el('span', { text: r.sub })]),
            el('span', { class: 'chip', text: r.kind })
          ])))
      ]));
    }

    /* recent log */
    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'Recent activity', style: { margin: 0 } }),
        el('button', { class: 'btn sm ghost', onClick: () => nav('diagnostics') }, 'Full diagnostic log →')
      ]),
      st.diagnostics.length
        ? el('div', { class: 'log', style: { marginTop: '12px', maxHeight: '210px' } },
            st.diagnostics.slice(0, 12).map(d => el('div', {}, [
              el('span', { class: 't', text: U.fmtTime(d.at) + '  ' }),
              el('span', { class: d.level, text: `[${d.tag}] ` }),
              el('span', { text: d.msg })
            ])))
        : el('p', { class: 'small muted', style: { marginTop: '10px' }, text: 'No activity recorded yet. Complete a module or answer a question to begin building your diagnostic record.' })
    ]));

    return view;
  }, { title: 'Dashboard', zone: () => A.State.get().profile.year === 12 ? 'y12' : 'y11' });

  /* ============================== SYLLABUS ============================= */
  U.route('syllabus', (args) => {
    const year = Number(args[0]) === 11 ? 11 : Number(args[0]) === 12 ? 12 : null;
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Syllabus map' }),
        el('h1', { text: year ? `Year ${year} focus areas` : 'Course map' }),
        el('p', { text: `All ${A.Syllabus.totals.points} content dot points from the Software Engineering 11–12 (2022) syllabus, with your evidence against each.` })
      ]),
      el('div', { class: 'langtab' }, [
        el('button', { 'aria-pressed': !year, onClick: () => nav('syllabus') }, 'All'),
        el('button', { 'aria-pressed': year === 11, onClick: () => nav('syllabus/11') }, 'Year 11'),
        el('button', { 'aria-pressed': year === 12, onClick: () => nav('syllabus/12') }, 'Year 12')
      ])
    ]));

    /* outcomes table */
    const outcomes = Object.keys(A.Syllabus.OUTCOMES)
      .filter(c => !year || c.indexOf('SE-' + year) === 0);
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Outcomes' }),
      el('div', { class: 'grid', style: { gap: '9px' } }, outcomes.map(code => {
        const pct = A.State.outcomeProgress(code);
        return el('div', { class: 'spread', style: { gap: '12px', alignItems: 'flex-start' } }, [
          el('div', { style: { flex: '1', minWidth: '0' } }, [
            el('b', { class: 'chip mono', text: code }),
            el('div', { class: 'small', style: { marginTop: '3px' }, text: A.Syllabus.OUTCOMES[code] })
          ]),
          el('div', { style: { width: '110px', flex: 'none' } }, [
            U.progressBar(pct, true),
            el('div', { class: 'small muted', style: { textAlign: 'right', marginTop: '3px' }, text: pct + '%' })
          ])
        ]);
      }))
    ]));

    A.Syllabus.FOCUS_AREAS.filter(a => !year || a.year === year).forEach(area => {
      const p = A.State.areaProgress(area.id);
      view.appendChild(el('div', { class: 'card hover', onClick: () => nav('area/' + area.id) }, [
        el('div', { class: 'spread' }, [
          el('div', {}, [
            el('div', { class: 'eyebrow', text: `Year ${area.year} · ${area.hours} indicative hours` }),
            el('h2', { text: area.title, style: { margin: '2px 0 0' } })
          ]),
          el('span', { class: 'chip accent', text: `${p.mastered}/${p.total} mastered` })
        ]),
        el('p', { class: 'small muted', text: area.blurb }),
        el('div', { class: 'heat' }, A.Syllabus.pointsForArea(area.id).map(pid => {
          const m = A.State.masteryOf(pid);
          return el('i', { 'data-l': m.score, title: `${pid} — ${A.State.LEVELS[m.score]}\n${A.Syllabus.textOf(pid)}` });
        })),
        el('div', { class: 'small muted', style: { marginTop: '10px' }, text: area.outcomes.join(' · ') })
      ]));
    });

    return view;
  }, { title: 'Syllabus', zone: a => Number(a[0]) === 12 ? 'y12' : 'y11' });

  /* ============================ FOCUS AREA ============================= */
  U.route('area', (args) => {
    const area = A.Syllabus.AREA_INDEX[args[0]];
    if (!area) return el('div', { class: 'card' }, 'Unknown focus area.');
    const p = A.State.areaProgress(area.id);
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: `Year ${area.year} · ${area.hours} hours · ${area.outcomes.length} outcomes` }),
        el('h1', { text: area.title }),
        el('p', { text: area.blurb })
      ]),
      el('div', { class: 'btnrow' }, [
        el('button', { class: 'btn', onClick: () => nav('exam/area/' + area.id) }, 'Practice questions'),
        el('button', { class: 'btn ghost', onClick: () => nav('syllabus/' + area.year) }, '← All areas')
      ])
    ]));

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [el('h2', { text: 'Area mastery', style: { margin: 0 } }), el('span', { class: 'chip accent', text: p.pct + '%' })]),
      U.progressBar(p.pct),
      el('div', { class: 'small muted', style: { marginTop: '6px' }, text: `${p.mastered} of ${p.total} dot points mastered · evidence from modules, questions, code challenges and portfolio artefacts` })
    ]));

    /* modules */
    const lessons = A.Notes.byArea(area.id);
    if (lessons.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Learning modules' }),
        el('div', { class: 'rows' }, lessons.map(l => {
          const done = !!A.State.get().lessons[l.id];
          return el('button', { class: 'rowitem', 'data-done': done ? '1' : '0', onClick: () => nav('lesson/' + l.id) }, [
            el('div', { class: 'lead', text: done ? '✓' : '▤' }),
            el('div', { class: 'body' }, [
              el('b', { text: l.title }),
              el('span', { text: `${l.mins} min · ${l.points.length} dot points` })
            ]),
            el('span', { class: 'chip', text: done ? 'Complete' : `+${A.Game.XP.lesson} XP` })
          ]);
        }))
      ]));
    }

    /* content dot points */
    area.groups.forEach(group => {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: group.title }),
        el('div', { class: 'grid', style: { gap: '7px' } }, group.points.map(pt => {
          const m = A.State.masteryOf(pt.id);
          return el('details', { class: 'acc' }, [
            el('summary', {}, [
              el('span', { style: { display: 'flex', gap: '9px', alignItems: 'baseline', flex: '1' } }, [
                U.masteryDot(pt.id),
                el('span', { class: 'chip mono', text: pt.id }),
                el('span', { style: { fontWeight: '500' }, text: pt.text })
              ]),
              el('span', { class: 'chip' + (m.score === 3 ? ' ok' : m.score ? ' accent' : ''), text: A.State.LEVELS[m.score] })
            ]),
            el('div', {}, [
              pt.inc.length ? el('div', {}, [
                el('div', { class: 'eyebrow', style: { marginBottom: '4px' }, text: 'Including' }),
                el('ul', {}, pt.inc.map(i => el('li', { text: i })))
              ]) : null,
              el('div', { class: 'btnrow', style: { marginTop: '8px' } }, [
                el('button', { class: 'btn sm', onClick: () => nav('point/' + pt.id) }, 'Evidence & resources')
              ])
            ])
          ]);
        }))
      ]));
    });

    return view;
  }, { title: 'Focus area', zone: a => U.zoneOfArea(a[0]) });

  /* =============================== LESSON ============================== */
  U.route('lesson', (args) => {
    const l = A.Notes.byId(args[0]);
    if (!l) return el('div', { class: 'card' }, 'Unknown module.');
    const area = A.Syllabus.AREA_INDEX[l.areaId];
    const done = !!A.State.get().lessons[l.id];
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: `Year ${area.year} · ${area.title} · ${l.mins} min` }),
        el('h1', { text: l.title })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('area/' + l.areaId) }, '← ' + area.title)
    ]));

    view.appendChild(el('div', { class: 'card tight' }, [
      el('div', { class: 'eyebrow', style: { marginBottom: '6px' }, text: 'Syllabus dot points taught in this module' }),
      U.pointChips(l.points)
    ]));

    const body = el('div', { class: 'card' });
    body.appendChild(U.renderBlocks(l.body));
    view.appendChild(body);

    const related = l.points.reduce((acc, p) => acc.concat(A.Questions.forPoint(p)), [])
      .filter((q, i, arr) => arr.indexOf(q) === i).slice(0, 5);

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('div', {}, [
          el('h2', { text: done ? 'Module complete' : 'Finished this module?', style: { margin: 0 } }),
          el('p', { class: 'small muted', style: { margin: '3px 0 0' },
            text: done ? 'Evidence recorded against ' + l.points.length + ' dot points.' : `Marking it complete records evidence against ${l.points.length} dot points and awards ${A.Game.XP.lesson} XP.` })
        ]),
        el('button', {
          class: 'btn ' + (done ? 'ghost' : 'primary'),
          onClick: e => { A.State.completeLesson(l.id); U.render(); }
        }, done ? '✓ Completed' : 'Mark complete')
      ]),
      related.length ? el('div', { style: { marginTop: '14px' } }, [
        el('div', { class: 'eyebrow', style: { marginBottom: '7px' }, text: 'Test yourself on this content' }),
        el('div', { class: 'rows' }, related.map(q =>
          el('button', { class: 'rowitem', onClick: () => nav('question/' + q.id) }, [
            el('div', { class: 'lead', text: q.format === 'mcq' ? '◎' : '✎' }),
            el('div', { class: 'body' }, [
              el('b', { text: q.stem.slice(0, 84) + (q.stem.length > 84 ? '…' : '') }),
              el('span', { text: `${q.marks} mark${q.marks > 1 ? 's' : ''} · ${q.outcome}` })
            ]),
            A.State.get().answers[q.id] ? el('span', { class: 'chip ok', text: 'Attempted' }) : null
          ])))
      ]) : null
    ]));

    return view;
  }, { title: 'Module', zone: a => { const l = A.Notes.byId(a[0]); return l ? U.zoneOfArea(l.areaId) : 'y11'; } });

  /* ============================== DOT POINT ============================ */
  U.route('point', (args) => {
    const pid = args[0];
    const info = A.Syllabus.POINT_INDEX[pid];
    if (!info) return el('div', { class: 'card' }, 'Unknown dot point.');
    const m = A.State.masteryOf(pid);
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: `${info.area.title} · ${info.group}` }),
        el('h1', { text: pid }),
        el('p', { text: info.point.text })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('area/' + info.area.id) }, '← ' + info.area.title)
    ]));

    if (info.point.inc.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Including' }),
        el('ul', {}, info.point.inc.map(i => el('li', { text: i })))
      ]));
    }

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'Your evidence', style: { margin: 0 } }),
        el('span', { class: 'chip' + (m.score === 3 ? ' ok' : m.score ? ' accent' : ''), text: A.State.LEVELS[m.score] })
      ]),
      m.evidence.length
        ? el('div', { class: 'tablewrap' }, [el('table', {}, [
            el('thead', {}, [el('tr', {}, ['Kind', 'Reference', 'Score', 'When'].map(h => el('th', { text: h })))]),
            el('tbody', {}, m.evidence.slice().sort((a, b) => b.at - a.at).map(e => el('tr', {}, [
              el('td', { text: e.kind }),
              el('td', {}, [el('code', { text: e.ref })]),
              el('td', { text: Math.round((e.ratio ?? 1) * 100) + '%' }),
              el('td', { class: 'muted', text: U.fmtDate(e.at) })
            ])))
          ])])
        : el('p', { class: 'small muted', text: 'No evidence recorded yet. Complete a module, answer a question or clear a coding challenge that covers this dot point.' })
    ]));

    const lessons = A.Notes.forPoint(pid);
    const questions = A.Questions.forPoint(pid);
    const challenges = A.Game.CHALLENGES.filter(c => c.points.indexOf(pid) !== -1);
    const bounties = A.Game.BOUNTIES.filter(b => b.points.indexOf(pid) !== -1);
    const artefacts = A.Portfolio.TEMPLATES.filter(t => t.points.indexOf(pid) !== -1);

    const section = (title, items, render) => items.length ? el('div', { class: 'card' }, [
      el('h2', { text: title }), el('div', { class: 'rows' }, items.map(render))
    ]) : null;

    view.appendChild(U.frag([
      section('Modules covering this dot point', lessons, l =>
        el('button', { class: 'rowitem', onClick: () => nav('lesson/' + l.id) }, [
          el('div', { class: 'lead', text: A.State.get().lessons[l.id] ? '✓' : '▤' }),
          el('div', { class: 'body' }, [el('b', { text: l.title }), el('span', { text: l.mins + ' min' })])
        ])),
      section('Examination questions', questions, q =>
        el('button', { class: 'rowitem', onClick: () => nav('question/' + q.id) }, [
          el('div', { class: 'lead', text: q.format === 'mcq' ? '◎' : '✎' }),
          el('div', { class: 'body' }, [
            el('b', { text: q.stem.slice(0, 90) + (q.stem.length > 90 ? '…' : '') }),
            el('span', { text: `${q.id} · ${q.marks} marks · ${q.outcome}` })
          ]),
          A.State.get().answers[q.id] ? el('span', { class: 'chip ok', text: Math.round(A.State.get().answers[q.id].ratio * 100) + '%' }) : null
        ])),
      section('Code challenges', challenges, c =>
        el('button', { class: 'rowitem', onClick: () => nav('challenge/' + c.id) }, [
          el('div', { class: 'lead', text: '⌨' }),
          el('div', { class: 'body' }, [el('b', { text: c.title }), el('span', { text: c.lang })])
        ])),
      section('Bug bounties', bounties, b =>
        el('button', { class: 'rowitem', onClick: () => nav('bounty/' + b.id) }, [
          el('div', { class: 'lead', text: '✸' }),
          el('div', { class: 'body' }, [el('b', { text: b.title }), el('span', { text: b.severity })])
        ])),
      section('Portfolio artefacts', artefacts, t =>
        el('button', { class: 'rowitem', onClick: () => nav('portfolio/' + t.id) }, [
          el('div', { class: 'lead', text: t.icon }),
          el('div', { class: 'body' }, [el('b', { text: t.title }), el('span', { text: t.stage })])
        ]))
    ]));

    return view;
  }, { title: 'Dot point', zone: a => { const i = A.Syllabus.POINT_INDEX[a[0]]; return i && i.area.year === 12 ? 'y12' : 'y11'; } });

})(window.APP = window.APP || {});
