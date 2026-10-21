/* ===========================================================================
   views/project.js — HSC Major Project workspace
     · portfolio artefact templates (mapped to SEP dot points)
     · Agile / Waterfall / WAgile methodology tracking
     · Gantt scheduler with dependencies and progress
     · UML workspace (class, sequence, use case, flowchart) with SVG export
     · user testing records and version-control links
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, el = U.el, nav = U.navigate;

  const store = id => (A.State.get().portfolio[id] || { fields: {}, complete: false });

  /* ============================ PROJECT HOME =========================== */
  U.route('project', () => {
    const view = el('div', { class: 'view' });
    const st = A.State.get();
    const done = A.Portfolio.TEMPLATES.filter(t => (st.portfolio[t.id] || {}).complete).length;

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Software Engineering Project · 30 indicative hours' }),
        el('h1', { text: 'Major project portfolio' }),
        el('p', { text: 'Nine artefact templates covering the whole project life cycle. Each one maps to Software Engineering Project dot points, so a complete portfolio is also a complete evidence trail.' })
      ]),
      el('div', { class: 'btnrow' }, [
        el('button', { class: 'btn', onClick: () => nav('uml') }, '◳ UML workspace'),
        el('button', { class: 'btn primary', onClick: () => exportPortfolio() }, '↓ Export portfolio')
      ])
    ]));

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h2', { text: 'Portfolio completion', style: { margin: 0 } }),
        el('span', { class: 'chip accent', text: `${done}/${A.Portfolio.TEMPLATES.length} artefacts` })
      ]),
      U.progressBar(Math.round(done / A.Portfolio.TEMPLATES.length * 100)),
      el('div', { class: 'small muted', style: { marginTop: '7px' },
        text: 'Marking an artefact complete records evidence against its dot points and awards XP. Everything is stored on this device — export regularly and keep a copy with your project files.' })
    ]));

    const stages = [...new Set(A.Portfolio.TEMPLATES.map(t => t.stage))];
    stages.forEach(stage => {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: stage }),
        el('div', { class: 'rows' }, A.Portfolio.TEMPLATES.filter(t => t.stage === stage).map(t => {
          const s = store(t.id);
          const filled = Object.keys(s.fields || {}).filter(k => {
            const v = s.fields[k];
            return v && (typeof v === 'string' ? v.trim() : (Array.isArray(v) ? v.length : Object.keys(v).length));
          }).length;
          return el('button', { class: 'rowitem', 'data-done': s.complete ? '1' : '0', onClick: () => nav('portfolio/' + t.id) }, [
            el('div', { class: 'lead', text: s.complete ? '✓' : t.icon }),
            el('div', { class: 'body' }, [
              el('b', { text: t.title }),
              el('span', { text: `${t.points.join(', ')} · ${filled}/${t.fields.length} sections started` })
            ]),
            el('span', { class: 'chip' + (s.complete ? ' ok' : ''), text: s.complete ? 'Complete' : 'Open' })
          ]);
        }))
      ]));
    });

    return view;
  }, { title: 'Major project', zone: 'y12' });

  /* ============================== ARTEFACT ============================= */
  U.route('portfolio', (args) => {
    const t = A.Portfolio.byId(args[0]);
    if (!t) return el('div', { class: 'card' }, 'Unknown artefact.');
    const saved = store(t.id);
    const data = JSON.parse(JSON.stringify(saved.fields || {}));
    const view = el('div', { class: 'view' });
    let dirty = false;

    const setVal = (k, v) => { data[k] = v; dirty = true; statusEl.textContent = 'Unsaved changes'; };
    const statusEl = el('span', { class: 'small muted', text: saved.at ? 'Last saved ' + U.fmtDate(saved.at) : 'Not yet saved' });

    const save = complete => {
      A.State.savePortfolio(t.id, data, complete === undefined ? saved.complete : complete);
      dirty = false;
      statusEl.textContent = 'Saved ' + U.fmtTime(Date.now());
      U.toast('SAVED', t.title + (complete ? ' marked complete' : ' saved'));
      if (complete) U.render();
    };

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: t.stage }),
        el('h1', { text: t.title }),
        el('p', { text: t.intro })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('project') }, '← Portfolio')
    ]));

    view.appendChild(el('div', { class: 'card tight' }, [
      el('div', { class: 'eyebrow', style: { marginBottom: '6px' }, text: 'Dot points evidenced by this artefact' }),
      U.pointChips(t.points)
    ]));

    const body = el('div', { class: 'card' });
    const rerenderConditional = () => {
      U.qsa('[data-when]', body).forEach(node => {
        const cond = JSON.parse(node.getAttribute('data-when'));
        const key = Object.keys(cond)[0];
        node.style.display = cond[key].indexOf(data[key]) !== -1 ? '' : 'none';
      });
    };

    t.fields.forEach(f => {
      const wrap = el('div', f.when ? { 'data-when': JSON.stringify(f.when) } : {});
      wrap.appendChild(el('div', { class: 'eyebrow', style: { marginTop: '18px', marginBottom: '6px' }, text: f.label }));
      if (f.help) wrap.appendChild(el('div', { class: 'small muted', style: { marginBottom: '8px' }, html: f.help }));
      wrap.appendChild(fieldControl(f, data[f.id], v => { setVal(f.id, v); if (f.type === 'select') rerenderConditional(); }));
      body.appendChild(wrap);
    });
    rerenderConditional();          // set initial visibility before paint, no flash
    view.appendChild(body);

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        statusEl,
        el('div', { class: 'btnrow' }, [
          el('button', { class: 'btn', onClick: () => save() }, 'Save'),
          el('button', { class: 'btn primary', onClick: () => save(true) }, saved.complete ? '✓ Complete — save again' : 'Save & mark complete'),
          el('button', { class: 'btn sm ghost', onClick: () => exportArtefact(t, data) }, '↓ Export this artefact')
        ])
      ])
    ]));

    window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }, { once: true });
    return view;
  }, { title: 'Artefact', zone: 'y12' });

  /* ---------------------------------------------------- field controls */
  function fieldControl(f, value, onChange) {
    switch (f.type) {
      case 'text':
      case 'url': {
        const i = el('input', { type: f.type === 'url' ? 'url' : 'text', placeholder: f.placeholder || '', 'aria-label': f.label });
        i.value = value || '';
        i.addEventListener('input', () => onChange(i.value));
        return i;
      }
      case 'select': {
        const s = el('select', { 'aria-label': f.label }, [el('option', { value: '' }, '— choose —')]
          .concat(f.options.map(o => el('option', { value: o, selected: value === o ? true : null }, o))));
        s.addEventListener('change', () => onChange(s.value));
        return s;
      }
      case 'textarea': {
        const ta = el('textarea', {
          rows: f.rows || 4, placeholder: f.placeholder || '', 'aria-label': f.label,
          style: f.mono ? { fontFamily: 'var(--font-mono)', fontSize: '13px', whiteSpace: 'pre' } : null
        });
        ta.value = value || '';
        ta.addEventListener('input', () => onChange(ta.value));
        return ta;
      }
      case 'checklist': {
        const checked = value || {};
        return el('div', {}, f.items.map(item =>
          el('label', { class: 'check' }, [
            el('input', {
              type: 'checkbox', checked: checked[item] ? true : null,
              onChange: e => { checked[item] = e.target.checked; onChange(checked); }
            }),
            el('span', { text: item })
          ])));
      }
      case 'table': return tableControl(f, value, onChange);
      case 'gantt': return ganttControl(value, onChange);
      case 'uml': return umlControl(value, onChange);
      default: return el('div', { class: 'muted small', text: 'Unsupported field' });
    }
  }

  function tableControl(f, value, onChange) {
    let rows = Array.isArray(value) && value.length ? value.map(r => r.slice())
      : (f.seed ? f.seed.map(r => r.slice()) : [f.cols.map(() => '')]);
    const host = el('div', { class: 'tablewrap' });

    function paint() {
      host.innerHTML = '';
      const table = el('table', {}, [
        el('thead', {}, [el('tr', {}, f.cols.map(c => el('th', { text: c })).concat([el('th', { text: '' })]))]),
        el('tbody', {}, rows.map((row, ri) => el('tr', {}, f.cols.map((c, ci) => {
          const td = el('td', {});
          const inp = el('textarea', { rows: 1, 'aria-label': `${c} row ${ri + 1}`, style: { minHeight: '34px', padding: '5px 7px' } });
          inp.value = row[ci] || '';
          inp.addEventListener('input', () => {
            row[ci] = inp.value;
            inp.style.height = 'auto'; inp.style.height = Math.min(160, inp.scrollHeight) + 'px';
            onChange(rows);
          });
          td.appendChild(inp);
          return td;
        }).concat([
          el('td', { style: { width: '34px' } }, [
            el('button', {
              class: 'btn sm ghost', title: 'Delete row', 'aria-label': 'Delete row ' + (ri + 1),
              onClick: () => { rows.splice(ri, 1); if (!rows.length) rows.push(f.cols.map(() => '')); onChange(rows); paint(); }
            }, '✕')
          ])
        ]))))
      ]);
      host.appendChild(table);
      host.appendChild(el('button', {
        class: 'btn sm', onClick: () => { rows.push(f.cols.map(() => '')); onChange(rows); paint(); }
      }, '+ Add row'));
    }
    paint();
    onChange(rows);
    return host;
  }

  /* --------------------------------------------------------- Gantt chart */
  function ganttControl(value, onChange) {
    let tasks = Array.isArray(value) && value.length ? value.map(t => Object.assign({}, t)) : [
      { name: 'Requirements definition', start: 0, len: 2, done: 100, dep: '' },
      { name: 'Design & modelling', start: 2, len: 2, done: 60, dep: 'Requirements definition' },
      { name: 'Development', start: 4, len: 5, done: 20, dep: 'Design & modelling' },
      { name: 'Testing & evaluation', start: 8, len: 3, done: 0, dep: 'Development' }
    ];
    const host = el('div');
    const WEEKS = () => Math.max(10, ...tasks.map(t => Number(t.start) + Number(t.len)));

    function paint() {
      host.innerHTML = '';
      const weeks = WEEKS();
      const chart = el('div', { class: 'gantt' });
      chart.appendChild(el('div', { class: 'grow' }, [
        el('span', { class: 'small muted', text: 'Task' }),
        el('div', { class: 'row', style: { gap: '0', justifyContent: 'space-between' } },
          Array.from({ length: weeks }, (_, i) => el('span', { class: 'small muted', style: { flex: '1', textAlign: 'center', fontSize: '10px' }, text: 'W' + (i + 1) })))
      ]));
      tasks.forEach(t => {
        const bar = el('div', {
          class: 'barx',
          style: { left: (t.start / weeks * 100) + '%', width: (t.len / weeks * 100) + '%' },
          title: `${t.name}: week ${Number(t.start) + 1}–${Number(t.start) + Number(t.len)} · ${t.done}% complete` + (t.dep ? ` · after ${t.dep}` : '')
        }, [el('i', { style: { width: (100 - t.done) + '%', left: 'auto', right: '0' } })]);
        chart.appendChild(el('div', { class: 'grow' }, [
          el('span', { class: 'small', text: t.name }),
          el('div', { class: 'track' }, [bar])
        ]));
      });
      host.appendChild(chart);

      const table = el('div', { class: 'tablewrap', style: { marginTop: '14px' } }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, ['Task', 'Start week', 'Duration', '% done', 'Depends on', ''].map(h => el('th', { text: h })))]),
          el('tbody', {}, tasks.map((t, i) => el('tr', {}, [
            inputCell(t.name, v => { t.name = v; commit(); }, 'text'),
            inputCell(t.start, v => { t.start = Math.max(0, +v || 0); commit(true); }, 'number'),
            inputCell(t.len, v => { t.len = Math.max(1, +v || 1); commit(true); }, 'number'),
            inputCell(t.done, v => { t.done = Math.min(100, Math.max(0, +v || 0)); commit(true); }, 'number'),
            inputCell(t.dep || '', v => { t.dep = v; commit(); }, 'text'),
            el('td', {}, [el('button', { class: 'btn sm ghost', onClick: () => { tasks.splice(i, 1); commit(true); } }, '✕')])
          ])))
        ])
      ]);
      host.appendChild(table);
      host.appendChild(el('button', {
        class: 'btn sm',
        onClick: () => { tasks.push({ name: 'New task', start: WEEKS(), len: 1, done: 0, dep: '' }); commit(true); }
      }, '+ Add task'));
    }

    function inputCell(val, cb, type) {
      const i = el('input', { type, style: { padding: '5px 7px' } });
      i.value = val;
      i.addEventListener('change', () => cb(i.value));
      return el('td', { style: type === 'number' ? { width: '92px' } : null }, [i]);
    }

    function commit(repaint) { onChange(tasks); if (repaint) paint(); }
    paint();
    onChange(tasks);
    return host;
  }

  /* ----------------------------------------------------- UML in artefact */
  function umlControl(value, onChange) {
    const state = Object.assign({ kind: 'class', src: A.UML.KINDS.class.example, name: 'System model' }, value || {});
    const host = el('div');

    function paint() {
      host.innerHTML = '';
      const preview = el('div', { class: 'figure', html: A.UML.render(state.kind, state.src) });
      const ta = el('textarea', { rows: 12, class: 'editor', spellcheck: 'false', 'aria-label': 'Diagram source' });
      ta.value = state.src;
      ta.addEventListener('input', () => {
        state.src = ta.value;
        preview.innerHTML = A.UML.render(state.kind, state.src);
        onChange(state);
      });
      const kinds = el('div', { class: 'langtab' }, Object.keys(A.UML.KINDS).map(k =>
        el('button', {
          'aria-pressed': state.kind === k,
          onClick: () => {
            state.kind = k;
            if (!state.src.trim() || confirmSwap()) state.src = A.UML.KINDS[k].example;
            onChange(state); paint();
          }
        }, A.UML.KINDS[k].label.replace(' diagram', ''))));
      const nameInput = el('input', { type: 'text', placeholder: 'Diagram name', style: { maxWidth: '240px' } });
      nameInput.value = state.name;
      nameInput.addEventListener('input', () => { state.name = nameInput.value; onChange(state); });

      host.appendChild(el('div', { class: 'runbar' }, [
        kinds, nameInput,
        el('button', { class: 'btn sm', onClick: () => A.UML.exportSVG(state.kind, state.src, state.name) }, '↓ SVG'),
        el('button', { class: 'btn sm ghost', onClick: () => {
          const lib = A.State.get().uml;
          lib.unshift({ id: 'D' + Date.now().toString(36), name: state.name, kind: state.kind, src: state.src, at: Date.now() });
          A.State.mutate(() => {});
          U.toast('SAVED', 'Diagram added to the UML library');
        } }, 'Save to library')
      ]));
      host.appendChild(el('div', { class: 'small muted', style: { marginBottom: '8px' }, html: A.UML.KINDS[state.kind].help }));
      host.appendChild(el('div', { class: 'lab' }, [ta, preview]));
    }
    const confirmSwap = () => state.src.trim() === '' ||
      Object.keys(A.UML.KINDS).some(k => A.UML.KINDS[k].example === state.src);
    paint();
    return host;
  }

  /* ========================== UML WORKSPACE ============================ */
  U.route('uml', () => {
    const view = el('div', { class: 'view' });
    const st = A.State.get();
    let kind = 'class';
    let src = A.UML.KINDS.class.example;
    let name = 'Untitled model';

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Modelling tools · SEP-2.8, OOP-1.3' }),
        el('h1', { text: 'UML workspace' }),
        el('p', { text: 'Describe the model in text and it is laid out as you type. Class, sequence, use case and flowchart diagrams, exportable as SVG for your portfolio.' })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('project') }, '← Project')
    ]));

    const preview = el('div', { class: 'figure', html: A.UML.render(kind, src) });
    const ta = el('textarea', { rows: 20, class: 'editor', spellcheck: 'false', 'aria-label': 'Diagram source' });
    ta.value = src;
    const helpEl = el('div', { class: 'small muted', style: { marginBottom: '9px' }, html: A.UML.KINDS[kind].help });
    const update = () => { src = ta.value; preview.innerHTML = A.UML.render(kind, src); };
    ta.addEventListener('input', update);

    const nameInput = el('input', { type: 'text', style: { maxWidth: '220px' }, placeholder: 'Diagram name' });
    nameInput.value = name;
    nameInput.addEventListener('input', () => { name = nameInput.value; });

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'runbar' }, [
        el('div', { class: 'langtab' }, Object.keys(A.UML.KINDS).map(k =>
          el('button', {
            'aria-pressed': kind === k,
            onClick: e => {
              kind = k;
              [...e.target.parentNode.children].forEach(b => b.setAttribute('aria-pressed', b === e.target));
              ta.value = A.UML.KINDS[k].example;
              helpEl.innerHTML = A.UML.KINDS[k].help;
              update();
            }
          }, A.UML.KINDS[k].label.replace(' diagram', '')))),
        nameInput,
        el('button', { class: 'btn sm primary', onClick: () => A.UML.exportSVG(kind, src, name) }, '↓ Export SVG'),
        el('button', { class: 'btn sm', onClick: () => {
          A.State.mutate(s => {
            s.uml.unshift({ id: 'D' + Date.now().toString(36), name, kind, src, at: Date.now() });
            A.State.logEvent('ok', 'MODEL', `Diagram saved: ${name} (${kind})`);
          });
          U.toast('SAVED', 'Diagram saved to your library'); U.render();
        } }, 'Save to library')
      ]),
      helpEl,
      el('div', { class: 'lab' }, [ta, preview])
    ]));

    if (st.uml.length) {
      view.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Saved diagrams' }),
        el('div', { class: 'rows' }, st.uml.map(d =>
          el('div', { class: 'rowitem' }, [
            el('div', { class: 'lead', text: '◳' }),
            el('div', { class: 'body' }, [el('b', { text: d.name }), el('span', { text: `${A.UML.KINDS[d.kind] ? A.UML.KINDS[d.kind].label : d.kind} · ${U.fmtDate(d.at)}` })]),
            el('button', { class: 'btn sm', onClick: () => { kind = d.kind; ta.value = d.src; nameInput.value = d.name; name = d.name; update(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }, 'Load'),
            el('button', { class: 'btn sm ghost', onClick: () => A.UML.exportSVG(d.kind, d.src, d.name) }, '↓'),
            el('button', { class: 'btn sm ghost', onClick: () => {
              A.State.mutate(s => { s.uml = s.uml.filter(x => x.id !== d.id); });
              U.render();
            } }, '✕')
          ])))
      ]));
    }

    return view;
  }, { title: 'UML workspace', zone: 'y12' });

  /* ============================== EXPORT =============================== */
  function toMarkdown(t, data) {
    const lines = ['## ' + t.title, '', `*${t.stage} · syllabus: ${t.points.join(', ')}*`, '', t.intro, ''];
    t.fields.forEach(f => {
      const v = data[f.id];
      if (v === undefined || v === null || v === '') return;
      lines.push('### ' + f.label, '');
      if (f.type === 'table' && Array.isArray(v)) {
        lines.push('| ' + f.cols.join(' | ') + ' |');
        lines.push('| ' + f.cols.map(() => '---').join(' | ') + ' |');
        v.forEach(r => lines.push('| ' + f.cols.map((c, i) => String(r[i] || '').replace(/\n/g, ' ')).join(' | ') + ' |'));
      } else if (f.type === 'checklist') {
        Object.keys(v).forEach(k => lines.push(`- [${v[k] ? 'x' : ' '}] ${k}`));
      } else if (f.type === 'gantt' && Array.isArray(v)) {
        lines.push('| Task | Start week | Duration | % done | Depends on |', '| --- | --- | --- | --- | --- |');
        v.forEach(x => lines.push(`| ${x.name} | ${Number(x.start) + 1} | ${x.len} | ${x.done}% | ${x.dep || '—'} |`));
      } else if (f.type === 'uml' && v && v.src) {
        lines.push('```' + v.kind, v.src, '```');
      } else {
        lines.push(String(v));
      }
      lines.push('');
    });
    return lines.join('\n');
  }

  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function exportArtefact(t, data) {
    download(t.id + '-artefact.md', toMarkdown(t, data));
    U.toast('EXPORTED', t.title + ' downloaded as Markdown');
  }

  function exportPortfolio() {
    const st = A.State.get();
    const name = st.profile.name || 'student';
    const parts = [
      '# HSC Software Engineering — Major Project Portfolio',
      '',
      `**Student:** ${name}  `,
      `**Exported:** ${new Date().toLocaleString('en-AU')}  `,
      `**Syllabus:** NESA Software Engineering 11–12 (2022), Software Engineering Project`,
      '', '---', ''
    ];
    A.Portfolio.TEMPLATES.forEach(t => {
      const s = st.portfolio[t.id];
      if (!s || !Object.keys(s.fields || {}).length) return;
      parts.push(toMarkdown(t, s.fields), '---', '');
    });
    if (st.uml.length) {
      parts.push('## Saved models', '');
      st.uml.forEach(d => parts.push(`### ${d.name} (${d.kind})`, '', '```', d.src, '```', ''));
    }
    download('major-project-portfolio.md', parts.join('\n'));
    U.toast('EXPORTED', 'Full portfolio downloaded as Markdown');
  }

  A.Project = { exportPortfolio, download };
})(window.APP = window.APP || {});
