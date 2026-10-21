/* ===========================================================================
   views/ops.js — missions, profile & unlockables, diagnostics, settings/sync
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, el = U.el, nav = U.navigate;

  const STEP_ROUTE = { lesson: 'lesson/', question: 'question/', challenge: 'challenge/', bounty: 'bounty/', portfolio: 'portfolio/', exam: 'exam' };

  /* ============================== MISSIONS ============================= */
  U.route('quests', (args) => {
    const year = Number(args[0]) === 11 ? 11 : 12;
    const view = el('div', { class: 'view' });
    const s = A.State.summary();

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: year === 12 ? 'Operations · Year 12' : 'Module quests · Year 11' }),
        el('h1', { text: year === 12 ? 'Mission board' : 'Module quests' }),
        el('p', { text: year === 12
          ? 'Narrative operations that chain modules, questions, code challenges and bug bounties into one investigation. Complete every step to close the operation and unlock its asset.'
          : 'Guided quest chains through each Year 11 focus area — learn it, test it, then build it in the code lab.' })
      ]),
      el('div', { class: 'langtab' }, [
        el('button', { 'aria-pressed': year === 11, onClick: () => nav('quests/11') }, 'Year 11'),
        el('button', { 'aria-pressed': year === 12, onClick: () => nav('quests/12') }, 'Year 12')
      ])
    ]));

    A.Game.QUESTS.filter(q => q.year === year).forEach(q => {
      const p = A.State.questProgress(q);
      const locked = q.locked && q.locked.minRank && s.rank.id < q.locked.minRank;
      view.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'spread' }, [
          el('div', {}, [
            el('div', { class: 'eyebrow', text: q.codename }),
            el('h2', { text: q.title, style: { margin: '2px 0 0' } })
          ]),
          el('span', { class: 'chip' + (p.complete ? ' ok' : locked ? ' bad' : ' accent'),
            text: p.complete ? '✓ Complete' : locked ? 'Locked · rank ' + q.locked.minRank : `${p.done}/${p.total} steps` })
        ]),
        el('p', { class: 'small muted', text: q.brief }),
        U.progressBar(Math.round(p.done / p.total * 100), true),
        locked
          ? el('p', { class: 'small muted', style: { marginTop: '12px' },
              text: `Requires rank ${A.Game.RANKS[q.locked.minRank].name} (${A.Game.RANKS[q.locked.minRank].band}). Keep earning XP.` })
          : el('div', { class: 'steps', style: { marginTop: '12px' } }, q.steps.map(step => {
              const key = step.kind + ':' + step.ref;
              const done = !!p.steps[key];
              return el('button', {
                class: 'step', 'data-done': done ? '1' : '0',
                onClick: () => nav(step.kind === 'exam' ? 'exam' : STEP_ROUTE[step.kind] + step.ref)
              }, [
                el('span', { class: 'tick', text: done ? '✓' : '' }),
                el('div', { style: { flex: '1' } }, [
                  el('b', { text: step.label }),
                  el('div', { class: 'small muted', text: step.kind + ' · ' + step.ref })
                ]),
                el('span', { class: 'chip', text: done ? 'Done' : '+' + A.Game.XP.questStep + ' XP' })
              ]);
            })),
        p.complete ? el('div', { class: 'callout tip', style: { marginTop: '12px' }, html: '<b>Debrief. </b>' + q.outro }) : null,
        !locked && !p.complete ? el('div', { class: 'small muted', style: { marginTop: '10px' },
          text: `Reward: ${q.reward.xp} XP` + (q.reward.asset ? ` · unlocks ${A.Game.assetById(q.reward.asset).name}` : '') }) : null
      ]));
    });

    return view;
  }, { title: 'Missions', zone: a => Number(a[0]) === 11 ? 'y11' : 'y12' });

  /* --------------------------- single mission ------------------------- */
  U.route('quest', (args) => {
    const q = A.Game.questById(args[0]);
    if (!q) return el('div', { class: 'card' }, 'Unknown mission.');
    const p = A.State.questProgress(q);
    const s = A.State.summary();
    const locked = q.locked && q.locked.minRank && s.rank.id < q.locked.minRank;
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: q.codename }),
        el('h1', { text: q.title }),
        el('p', { text: q.brief })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('quests/' + q.year) }, '← All missions')
    ]));

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'Objectives', style: { margin: 0 } }),
        el('span', { class: 'chip' + (p.complete ? ' ok' : locked ? ' bad' : ' accent'),
          text: p.complete ? '✓ Complete' : locked ? 'Locked · rank ' + q.locked.minRank : `${p.done}/${p.total} steps` })
      ]),
      U.progressBar(Math.round(p.done / p.total * 100), true),
      locked
        ? el('p', { class: 'small muted', style: { marginTop: '12px' },
            text: `Requires rank ${A.Game.RANKS[q.locked.minRank].name} (${A.Game.RANKS[q.locked.minRank].band}).` })
        : el('div', { class: 'steps', style: { marginTop: '14px' } }, q.steps.map(step => {
            const done = !!p.steps[step.kind + ':' + step.ref];
            return el('button', {
              class: 'step', 'data-done': done ? '1' : '0',
              onClick: () => nav(step.kind === 'exam' ? 'exam' : STEP_ROUTE[step.kind] + step.ref)
            }, [
              el('span', { class: 'tick', text: done ? '✓' : '' }),
              el('div', { style: { flex: '1' } }, [
                el('b', { text: step.label }),
                el('div', { class: 'small muted', text: step.kind + ' · ' + step.ref })
              ]),
              el('span', { class: 'chip', text: done ? 'Done' : '+' + A.Game.XP.questStep + ' XP' })
            ]);
          })),
      el('div', { class: 'small muted', style: { marginTop: '12px' },
        text: `Reward: ${q.reward.xp} XP` + (q.reward.asset ? ` · unlocks ${A.Game.assetById(q.reward.asset).name}` : '') }),
      p.complete ? el('div', { class: 'callout tip', style: { marginTop: '12px' }, html: '<b>Debrief. </b>' + q.outro }) : null
    ]));

    if (q.area) {
      const area = A.Syllabus.AREA_INDEX[q.area];
      view.appendChild(el('div', { class: 'card tight' }, [
        el('div', { class: 'eyebrow', style: { marginBottom: '6px' }, text: 'Focus area' }),
        el('button', { class: 'rowitem', onClick: () => nav('area/' + area.id) }, [
          el('div', { class: 'lead', text: '▤' }),
          el('div', { class: 'body' }, [el('b', { text: area.title }), el('span', { text: `Year ${area.year} · ${A.State.areaProgress(area.id).pct}% mastery` })])
        ])
      ]));
    }

    return view;
  }, { title: 'Mission', zone: a => { const q = A.Game.questById(a[0]); return q && q.year === 11 ? 'y11' : 'y12'; } });

  /* =============================== PROFILE ============================= */
  U.route('profile', () => {
    const st = A.State.get();
    const s = A.State.summary();
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Operator profile' }),
        el('h1', { text: st.profile.name || 'Unnamed operator' }),
        el('p', { text: `${s.rank.name} · ${s.rank.band} · ${s.xp.toLocaleString()} XP` })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('settings') }, 'Settings')
    ]));

    /* rank ladder */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Rank progression' }),
      el('p', { class: 'small muted', text: 'Ranks are earned with XP and mapped to the HSC performance bands as a motivational guide. They are not a predicted mark — only your dot-point mastery and exam results indicate that.' }),
      el('div', { class: 'rows' }, A.Game.RANKS.map(r => {
        const reached = s.xp >= r.xp;
        const current = r.id === s.rank.id;
        return el('div', { class: 'rowitem', style: current ? { borderColor: 'var(--accent)' } : null }, [
          el('div', { class: 'lead', text: reached ? '✓' : '○', style: reached ? { color: 'var(--accent)' } : { opacity: '.4' } }),
          el('div', { class: 'body' }, [
            el('b', { text: `${r.id}. ${r.name}` }),
            el('span', { text: r.blurb })
          ]),
          el('span', { class: 'chip' + (current ? ' accent' : ''), text: r.band }),
          el('span', { class: 'chip mono', text: r.xp.toLocaleString() + ' XP' })
        ]);
      }))
    ]));

    /* milestones */
    view.appendChild(el('div', { class: 'grid g4' }, [
      U.statCard('Modules', `${s.lessons}/${s.lessonsTotal}`, 'completed'),
      U.statCard('Questions', `${s.answered}/${s.questionsTotal}`, 'attempted'),
      U.statCard('Challenges', `${s.challenges}/${s.challengesTotal}`, 'cleared'),
      U.statCard('Missions', `${s.quests}/${s.questsTotal}`, 'complete')
    ]));

    /* unlockables */
    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'Unlockable assets', style: { margin: 0 } }),
        el('span', { class: 'chip accent', text: `${s.assets}/${s.assetsTotal} unlocked` })
      ]),
      el('p', { class: 'small muted', text: 'Badges, profile sigils, ops-centre skins and tools earned through missions, bounties and mastery.' }),
      el('div', { class: 'assets' }, A.Game.ASSETS.map(a => {
        const owned = st.assets.indexOf(a.id) !== -1;
        return el('div', {
          class: 'asset' + (owned ? '' : ' locked'),
          title: owned ? a.desc : 'Locked — ' + a.how
        }, [
          el('div', { class: 'ico', text: a.icon }),
          el('b', { text: a.name }),
          el('span', { text: owned ? a.kind : a.how })
        ]);
      }))
    ]));

    /* mastery heatmap */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Syllabus mastery map' }),
      el('p', { class: 'small muted', text: 'One tile per content dot point. Hover for the dot point and your level.' }),
      ...A.Syllabus.FOCUS_AREAS.map(area => el('div', { style: { marginBottom: '14px' } }, [
        el('div', { class: 'spread', style: { marginBottom: '6px' } }, [
          el('span', { class: 'small', text: `Y${area.year} · ${area.title}` }),
          el('span', { class: 'chip', text: A.State.areaProgress(area.id).pct + '%' })
        ]),
        el('div', { class: 'heat' }, A.Syllabus.pointsForArea(area.id).map(pid => {
          const m = A.State.masteryOf(pid);
          return el('i', {
            'data-l': m.score, tabindex: '0', role: 'button',
            title: `${pid} — ${A.State.LEVELS[m.score]}\n${A.Syllabus.textOf(pid)}`,
            onClick: () => nav('point/' + pid)
          });
        }))
      ])),
      el('div', { class: 'row', style: { marginTop: '6px' } }, [0, 1, 2, 3].map(l =>
        el('span', { class: 'chip' }, [el('i', { class: 'dot l' + l }), ' ' + A.State.LEVELS[l]])))
    ]));

    return view;
  }, { title: 'Profile', zone: () => A.State.get().profile.year === 12 ? 'y12' : 'y11' });

  /* ============================ DIAGNOSTICS ============================ */
  U.route('diagnostics', (args) => {
    const year = Number(args[0]) === 11 ? 11 : Number(args[0]) === 12 ? 12 : null;
    const st = A.State.get();
    const rows = A.State.gapReport(year);
    const view = el('div', { class: 'view' });

    const crit = rows.filter(r => r.severity >= 3);
    const warn = rows.filter(r => r.severity === 2);
    const ok = rows.filter(r => r.severity <= 1);

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'System diagnostics' }),
        el('h1', { text: 'Curriculum gap report' }),
        el('p', { text: 'Every dot point scanned against your evidence and your measured performance. Severity combines how much evidence exists with how well you scored on questions touching that point.' })
      ]),
      el('div', { class: 'langtab' }, [
        el('button', { 'aria-pressed': !year, onClick: () => nav('diagnostics') }, 'All'),
        el('button', { 'aria-pressed': year === 11, onClick: () => nav('diagnostics/11') }, 'Y11'),
        el('button', { 'aria-pressed': year === 12, onClick: () => nav('diagnostics/12') }, 'Y12')
      ])
    ]));

    view.appendChild(el('div', { class: 'grid g4' }, [
      U.statCard('Critical gaps', String(crit.length), 'no evidence recorded'),
      U.statCard('Needs revision', String(warn.length), 'thin or weak evidence'),
      U.statCard('Secure', String(ok.length), 'developing or mastered'),
      U.statCard('Scanned', String(rows.length), year ? `Year ${year} dot points` : 'all dot points')
    ]));

    /* terminal-style scan output */
    const logLines = [];
    logLines.push(['sys', `SCAN INITIATED  ${new Date().toLocaleString('en-AU')}`]);
    logLines.push(['sys', `TARGET: ${year ? 'YEAR ' + year : 'FULL COURSE'} — ${rows.length} dot points`]);
    logLines.push(['sys', '']);
    crit.slice(0, 14).forEach(r => logLines.push(['warn', `[CRITICAL] ${r.pid}  ${r.area.id}  no evidence  ::  ${r.text.slice(0, 74)}`]));
    warn.slice(0, 14).forEach(r => logLines.push(['info', `[REVISE  ] ${r.pid}  ${r.area.id}  ${r.levelName}${r.perf !== null ? ' · ' + Math.round(r.perf * 100) + '% on attempts' : ''}`]));
    if (!crit.length && !warn.length) logLines.push(['ok', '[OK] No gaps detected. Full coverage with developing or better evidence.']);
    logLines.push(['sys', '']);
    logLines.push(['ok', `SCAN COMPLETE — ${crit.length} critical, ${warn.length} to revise, ${ok.length} secure`]);

    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Diagnostic scan' }),
      el('div', { class: 'log' }, logLines.map(([cls, text]) => el('div', { class: cls, text })))
    ]));

    /* actionable table */
    const section = (title, list, note) => list.length ? el('div', { class: 'card' }, [
      el('h2', { text: title }),
      el('p', { class: 'small muted', text: note }),
      el('div', { class: 'rows' }, list.slice(0, 30).map(r =>
        el('button', { class: 'rowitem', onClick: () => nav('point/' + r.pid) }, [
          el('div', { class: 'lead' }, [el('i', { class: 'dot l' + r.level })]),
          el('div', { class: 'body' }, [
            el('b', { text: `${r.pid} — ${r.area.title}` }),
            el('span', { text: r.text })
          ]),
          r.attempts ? el('span', { class: 'chip ' + (r.perf >= 0.7 ? 'ok' : r.perf >= 0.4 ? 'warn' : 'bad'), text: Math.round(r.perf * 100) + '%' }) : null,
          el('span', { class: 'chip', text: r.levelName })
        ])))
    ]) : null;

    view.appendChild(U.frag([
      section('Critical — no evidence recorded', crit, 'Nothing in your record covers these dot points. Start with the linked module.'),
      section('Requires revision', warn, 'Some evidence, but thin or weak. Revisit the content and attempt questions mapped to it.'),
      section('Secure', ok.slice(0, 20), 'Developing or mastered. Keep these warm with occasional practice.')
    ]));

    /* exam trend */
    if (st.exams.length > 1) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Examination trend' }),
        el('div', { class: 'grid', style: { gap: '8px' } }, st.exams.slice(0, 8).reverse().map(e => {
          const pct = Math.round(e.earned / Math.max(1, e.total) * 100);
          return el('div', { class: 'spread', style: { gap: '12px' } }, [
            el('span', { class: 'small', style: { flex: '1' }, text: `${U.fmtDate(e.at)} · ${e.title}` }),
            el('div', { style: { width: '140px' } }, [U.progressBar(pct, true)]),
            el('span', { class: 'chip', text: pct + '%' })
          ]);
        }))
      ]));
    }

    /* full event log */
    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'System log', style: { margin: 0 } }),
        el('button', { class: 'btn sm ghost', onClick: () => {
          const text = st.diagnostics.map(d => `${new Date(d.at).toISOString()}  [${d.tag}] ${d.msg}`).join('\n');
          A.Project.download('diagnostic-log.txt', text, 'text/plain');
        } }, '↓ Export log')
      ]),
      st.diagnostics.length
        ? el('div', { class: 'log', style: { marginTop: '12px' } }, st.diagnostics.map(d => el('div', {}, [
            el('span', { class: 't', text: U.fmtTime(d.at) + '  ' }),
            el('span', { class: d.level, text: `[${d.tag}] ` }),
            el('span', { text: d.msg })
          ])))
        : el('p', { class: 'small muted', text: 'No events recorded yet.' })
    ]));

    return view;
  }, { title: 'Diagnostics', zone: a => Number(a[0]) === 11 ? 'y11' : 'y12' });

  /* ============================== SETTINGS ============================= */
  U.route('settings', () => {
    const st = A.State.get();
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Configuration' }),
        el('h1', { text: 'Settings & sync' })
      ])
    ]));

    /* profile */
    const nameI = el('input', { type: 'text', placeholder: 'Your name' });
    nameI.value = st.profile.name;
    const yearSel = el('select', {}, [11, 12].map(y =>
      el('option', { value: y, selected: st.profile.year === y ? true : null }, 'Year ' + y)));
    const themeSel = el('select', {}, [['auto', 'Match my device'], ['light', 'Always light'], ['dark', 'Always dark']].map(([v, l]) =>
      el('option', { value: v, selected: (st.profile.theme || 'auto') === v ? true : null }, l)));

    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Profile' }),
      el('label', { class: 'fld' }, [el('span', { class: 'lab', text: 'Name' }), nameI]),
      el('label', { class: 'fld' }, [
        el('span', { class: 'lab', text: 'Current year' }),
        el('span', { class: 'help', text: 'Sets your home dashboard. The Year 12 ops-centre skin applies to Year 12 content regardless of this setting.' }),
        yearSel
      ]),
      el('label', { class: 'fld' }, [el('span', { class: 'lab', text: 'Appearance' }), themeSel]),
      el('label', { class: 'check' }, [
        el('input', { type: 'checkbox', checked: st.settings.reduceMotion ? true : null,
          onChange: e => A.State.mutate(s => { s.settings.reduceMotion = e.target.checked; applyPrefs(); }) }),
        el('span', { text: 'Reduce background motion' })
      ]),
      el('button', { class: 'btn primary', onClick: () => {
        A.State.mutate(s => {
          s.profile.name = nameI.value.trim();
          s.profile.year = Number(yearSel.value);
          s.profile.theme = themeSel.value;
        });
        applyPrefs();
        U.toast('SAVED', 'Profile updated'); U.render();
      } }, 'Save profile')
    ]));

    /* sync */
    const epI = el('input', { type: 'url', placeholder: 'https://your-storage.example/se-progress.json' });
    epI.value = st.sync.endpoint || '';
    const tokI = el('input', { type: 'password', placeholder: 'Bearer token (optional)' });
    tokI.value = st.sync.token || '';

    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Progress & cloud sync' }),
      el('p', { class: 'small muted', text: 'Your progress is stored in this browser. Export a file to move between devices, or point the app at an HTTPS endpoint of your own (a storage bucket, a school server, any service accepting GET and PUT of a JSON document) for automatic sync. Nothing is sent anywhere unless you configure an endpoint.' }),
      el('div', { class: 'btnrow', style: { marginBottom: '16px' } }, [
        el('button', { class: 'btn', onClick: () => {
          A.Project.download(`se-progress-${new Date().toISOString().slice(0, 10)}.json`, A.State.exportJSON(), 'application/json');
          U.toast('EXPORTED', 'Progress file downloaded');
        } }, '↓ Export progress file'),
        el('button', { class: 'btn', onClick: () => {
          const inp = el('input', { type: 'file', accept: '.json,application/json' });
          inp.addEventListener('change', () => {
            const file = inp.files[0]; if (!file) return;
            const fr = new FileReader();
            fr.onload = () => {
              try { A.State.importJSON(String(fr.result)); U.toast('IMPORTED', 'Progress restored'); U.render(); }
              catch (err) { U.toast('IMPORT FAILED', err.message); }
            };
            fr.readAsText(file);
          });
          inp.click();
        } }, '↑ Import progress file')
      ]),
      el('label', { class: 'fld' }, [el('span', { class: 'lab', text: 'Sync endpoint (HTTPS)' }), epI]),
      el('label', { class: 'fld' }, [
        el('span', { class: 'lab', text: 'Authorisation token' }),
        el('span', { class: 'help', text: 'Sent as an Authorization: Bearer header. Stored only in this browser.' }),
        tokI
      ]),
      el('div', { class: 'btnrow' }, [
        el('button', { class: 'btn', onClick: () => {
          A.State.mutate(s => { s.sync.endpoint = epI.value.trim(); s.sync.token = tokI.value.trim(); });
          U.toast('SAVED', 'Sync settings saved');
        } }, 'Save endpoint'),
        el('button', { class: 'btn', onClick: () => {
          A.State.pushRemote().then(() => U.toast('SYNCED', 'Progress pushed')).catch(e => U.toast('SYNC FAILED', e.message));
        } }, '↑ Push now'),
        el('button', { class: 'btn', onClick: () => {
          U.confirmDialog('Pull from endpoint?', 'This replaces the progress stored in this browser with the copy on the server.', () => {
            A.State.pullRemote().then(() => { U.toast('SYNCED', 'Progress pulled'); U.render(); }).catch(e => U.toast('SYNC FAILED', e.message));
          }, 'Pull & replace');
        } }, '↓ Pull now')
      ]),
      el('div', { class: 'small muted', style: { marginTop: '10px' },
        text: (st.sync.lastPush ? 'Last push ' + U.fmtDate(st.sync.lastPush) + '. ' : '') +
              (st.sync.lastPull ? 'Last pull ' + U.fmtDate(st.sync.lastPull) + '.' : '') })
    ]));

    /* runtime */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Execution runtime' }),
      el('p', { class: 'small muted', text: `JavaScript runs immediately in a sandboxed iframe. Python runs on Pyodide ${A.Runtime.PYODIDE_VERSION} (CPython compiled to WebAssembly), which downloads once on first use and is then cached by the browser.` }),
      el('button', { class: 'btn', onClick: e => {
        e.target.disabled = true; e.target.textContent = 'Loading…';
        A.Runtime.preloadPython(m => { e.target.textContent = m; })
          .then(() => { e.target.textContent = '✓ Python ready'; })
          .catch(err => { e.target.disabled = false; e.target.textContent = 'Retry'; U.toast('RUNTIME', err.message); });
      } }, 'Preload Python runtime')
    ]));

    /* danger */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Reset' }),
      el('p', { class: 'small muted', text: 'Erases all progress, portfolio content and saved diagrams in this browser. Export first — this cannot be undone.' }),
      el('button', { class: 'btn danger', onClick: () => {
        U.confirmDialog('Erase all progress?', 'Everything stored in this browser will be deleted permanently. Export your progress first if you want to keep it.', () => {
          A.State.reset(); U.toast('RESET', 'All progress erased'); nav('dashboard'); U.render();
        }, 'Erase everything');
      } }, 'Erase all data')
    ]));

    /* about */
    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'About' }),
      el('p', { class: 'small', html: 'Built against the <b>NESA Software Engineering 11–12 (2022) Syllabus</b>. Syllabus outcomes and content dot points are © NSW Education Standards Authority and are reproduced here for personal study use. This app is a study aid, not a NESA product, and its indicative marks and band mappings are not official.' }),
      el('p', { class: 'small muted', text: `${A.Syllabus.totals.points} dot points · ${A.Notes.LESSONS.length} modules · ${A.Questions.QUESTIONS.length} questions · ${A.Game.CHALLENGES.length} challenges · ${A.Game.BOUNTIES.length} bounties · ${A.Portfolio.TEMPLATES.length} portfolio templates` })
    ]));

    return view;
  }, { title: 'Settings', zone: () => A.State.get().profile.year === 12 ? 'y12' : 'y11' });

  function applyPrefs() {
    const st = A.State.get();
    const t = st.profile.theme || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-motion', st.settings.reduceMotion ? 'off' : 'on');
  }
  A.applyPrefs = applyPrefs;

})(window.APP = window.APP || {});
