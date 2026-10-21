/* ===========================================================================
   views/code.js — code lab, auto-tested challenges, and the bug-bounty board
   Execution is sandboxed (see runtime.js): JS in an opaque-origin iframe,
   Python in a Pyodide worker. Nothing is installed; nothing leaves the device.
   =========================================================================== */
(function (A) {
  'use strict';
  const U = A.UI, el = U.el, nav = U.navigate;

  /* ------------------------------------------------------- editor widget */
  function editor(value, lang) {
    const ta = el('textarea', {
      class: 'editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off',
      'aria-label': 'Code editor (' + lang + ')', wrap: 'off'
    });
    ta.value = value || '';
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
      if (e.key === 'Enter') {
        // keep the indentation of the current line, and indent after ':' or '{'
        const s = ta.selectionStart;
        const line = ta.value.slice(0, s).split('\n').pop();
        const indent = (line.match(/^\s*/) || [''])[0];
        const extra = /[:{]\s*$/.test(line) ? '    ' : '';
        if (indent || extra) {
          e.preventDefault();
          const ins = '\n' + indent + extra;
          ta.value = ta.value.slice(0, s) + ins + ta.value.slice(ta.selectionEnd);
          ta.selectionStart = ta.selectionEnd = s + ins.length;
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const btn = ta.closest('.card, .view').querySelector('[data-run]');
        if (btn) btn.click();
      }
    });
    return ta;
  }

  function consoleBox() {
    return el('div', { class: 'console', role: 'log', 'aria-live': 'polite' },
      [el('span', { class: 'sys', text: 'Ready. Output appears here.' })]);
  }

  function paintOutput(box, res, header) {
    box.innerHTML = '';
    const push = (text, cls) => box.appendChild(el('div', { class: cls || '', text }));
    if (header) push(header, 'sys');
    (res.output || '').split('\n').forEach(line => {
      if (!line.trim() && !res.output.trim()) return;
      const cls = /^PASS /.test(line) ? 'pass' : /^FAIL /.test(line) ? 'fail'
        : /ALL TESTS PASSED/.test(line) ? 'pass' : '';
      push(line, cls);
    });
    if (res.error) {
      push('');
      push('✖ ' + res.error, 'err');
    }
    push('');
    push(`— finished in ${res.ms} ms${res.timedOut ? ' (terminated)' : ''}`, 'sys');
    box.scrollTop = box.scrollHeight;
  }

  function runner(opts) {
    // opts: { lang, source, tests, onResult, extraButtons }
    let lang = opts.lang;
    const ta = editor(opts.source, lang);
    const out = consoleBox();
    const status = el('span', { class: 'small muted' });

    const runBtn = el('button', { class: 'btn primary', 'data-run': '1', onClick: go },
      opts.tests ? '▶ Run tests' : '▶ Run');

    async function go() {
      runBtn.disabled = true;
      const label = opts.tests ? 'Running tests…' : 'Running…';
      out.innerHTML = '';
      out.appendChild(el('div', { class: 'sys', text: label }));
      status.textContent = '';
      const onStatus = msg => { status.textContent = msg; };
      let res;
      try {
        res = opts.tests
          ? await A.Runtime.runTests(lang, ta.value, opts.tests, { onStatus })
          : await A.Runtime.run(lang, ta.value, { onStatus });
      } catch (err) {
        res = { ok: false, output: '', error: String(err && err.message || err), ms: 0 };
      }
      paintOutput(out, res, opts.tests ? 'Test harness executed in the sandbox' : null);
      status.textContent = '';
      runBtn.disabled = false;
      if (opts.onResult) opts.onResult(res, ta.value);
    }

    const bar = el('div', { class: 'runbar' }, [
      runBtn,
      opts.langSwitch ? el('div', { class: 'langtab' }, ['python', 'javascript'].map(L =>
        el('button', {
          'aria-pressed': lang === L,
          onClick: e => {
            lang = L;
            [...e.target.parentNode.children].forEach(b => b.setAttribute('aria-pressed', b === e.target));
            ta.setAttribute('aria-label', 'Code editor (' + L + ')');
            if (opts.templates && opts.templates[L] !== undefined && !ta.value.trim()) ta.value = opts.templates[L];
          }
        }, L === 'python' ? 'Python' : 'JavaScript'))) : null,
      opts.reset ? el('button', { class: 'btn sm ghost', onClick: () => { ta.value = opts.source; } }, 'Reset code') : null,
      ...(opts.extraButtons || []),
      status
    ]);

    return { node: el('div', {}, [bar, ta]), console: out, getSource: () => ta.value, setSource: v => { ta.value = v; }, run: go, lang: () => lang };
  }

  /* ================================ LAB ================================ */
  const SNIPPETS = {
    python: `# Sandboxed Python (CPython via WebAssembly). Ctrl/Cmd + Enter runs.
class Stack:
    """LIFO structure — PF-4.2."""
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        return self._items[-1] if self._items else None

    def __len__(self):
        return len(self._items)


s = Stack()
for ch in "([{":
    s.push(ch)
print("size:", len(s), "top:", s.peek())
print("popped:", s.pop())
`,
    javascript: `// Sandboxed JavaScript. Ctrl/Cmd + Enter runs.
function twosComplement(n, bits = 8) {
  if (n >= 0) return n.toString(2).padStart(bits, '0');
  return (Math.pow(2, bits) + n).toString(2);
}

for (const v of [37, -37, 127, -128]) {
  console.log(String(v).padStart(5), '→', twosComplement(v));
}
`
  };

  U.route('lab', () => {
    const view = el('div', { class: 'view' });
    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Inline execution environment' }),
        el('h1', { text: 'Code lab' }),
        el('p', { text: 'Write and run Python or JavaScript with no setup. Code executes inside a browser sandbox on this device — an opaque-origin iframe for JavaScript, a Pyodide WebAssembly worker for Python — with a hard timeout on runaway loops.' })
      ])
    ]));

    const r = runner({
      lang: 'python', source: SNIPPETS.python, langSwitch: true, reset: true,
      templates: SNIPPETS,
      extraButtons: [
        el('button', { class: 'btn sm ghost', onClick: () => { r.setSource(SNIPPETS[r.lang()]); } }, 'Load example')
      ]
    });

    view.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'card' }, [el('h2', { text: 'Editor' }), r.node]),
      el('div', { class: 'card' }, [el('h2', { text: 'Output' }), r.console])
    ]));

    view.appendChild(el('div', { class: 'grid g2' }, [
      el('div', { class: 'card' }, [
        el('h2', { text: 'Challenges' }),
        el('p', { class: 'small muted', text: 'Auto-tested tasks mapped to dot points. Pass every test to bank the XP.' }),
        el('div', { class: 'rows' }, A.Game.CHALLENGES.map(c => {
          const done = (A.State.get().challenges[c.id] || {}).passed;
          return el('button', { class: 'rowitem', onClick: () => nav('challenge/' + c.id) }, [
            el('div', { class: 'lead', text: done ? '✓' : '⌨' }),
            el('div', { class: 'body' }, [el('b', { text: c.title }), el('span', { text: `${c.lang} · ${c.points.join(', ')}` })]),
            el('span', { class: 'chip' + (done ? ' ok' : ''), text: done ? 'Cleared' : '+' + c.xp + ' XP' })
          ]);
        }))
      ]),
      el('div', { class: 'card' }, [
        el('h2', { text: 'Bug bounty board' }),
        el('p', { class: 'small muted', text: 'Broken or vulnerable production code. Patch it until the verification suite passes.' }),
        el('div', { class: 'rows' }, A.Game.BOUNTIES.map(b => {
          const done = A.State.get().bounties.indexOf(b.id) !== -1;
          return el('button', { class: 'rowitem', onClick: () => nav('bounty/' + b.id) }, [
            el('div', { class: 'lead', text: done ? '✓' : '✸' }),
            el('div', { class: 'body' }, [el('b', { text: b.title }), el('span', { text: b.lang })]),
            el('span', { class: 'severity ' + b.severity, text: b.severity })
          ]);
        }))
      ])
    ]));

    return view;
  }, { title: 'Code lab' });

  /* ============================= CHALLENGE ============================= */
  U.route('challenge', (args) => {
    const c = A.Game.challengeById(args[0]);
    if (!c) return el('div', { class: 'card' }, 'Unknown challenge.');
    const saved = A.State.get().challenges[c.id] || {};
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: `Code challenge · ${c.lang} · +${c.xp} XP` }),
        el('h1', { text: c.title }),
        el('p', { html: c.brief })
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('lab') }, '← Code lab')
    ]));

    view.appendChild(el('div', { class: 'card tight' }, [
      el('div', { class: 'eyebrow', style: { marginBottom: '6px' }, text: 'Dot points assessed' }),
      U.pointChips(c.points)
    ]));

    const verdict = el('div');
    const r = runner({
      lang: c.lang, source: saved.code || c.starter, tests: c.tests, reset: true,
      onResult: (res, src) => {
        A.State.recordChallenge(c, src, res.passed);
        verdict.innerHTML = '';
        verdict.appendChild(el('div', {
          class: 'callout ' + (res.passed ? 'tip' : ''),
          html: res.passed
            ? `<b>All tests passed.</b> Evidence recorded against ${c.points.join(', ')}.`
            : `<b>${res.failures || 'Some'} check(s) failing.</b> Read the FAIL lines — each one names the input, what your code returned and what was expected.`
        }));
      }
    });

    view.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'card' }, [el('h2', { text: 'Your solution' }), r.node]),
      el('div', { class: 'card' }, [el('h2', { text: 'Verification' }), r.console, verdict])
    ]));

    view.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: 'Hints' }),
      el('div', {}, c.hints.map((h, i) =>
        el('details', { class: 'acc' }, [
          el('summary', { text: 'Hint ' + (i + 1) }),
          el('div', { html: h })
        ])))
    ]));

    return view;
  }, { title: 'Challenge' });

  /* =============================== BOUNTY ============================== */
  U.route('bounties', () => {
    const view = el('div', { class: 'view' });
    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: 'Vulnerability response' }),
        el('h1', { text: 'Bug bounty board' }),
        el('p', { text: 'Each ticket is real, broken, production-shaped code. Diagnose it, patch it, and prove the patch with the verification suite. Closing a bounty records evidence against the secure-coding dot points.' })
      ])
    ]));
    view.appendChild(el('div', { class: 'grid g2' }, A.Game.BOUNTIES.map(b => {
      const done = A.State.get().bounties.indexOf(b.id) !== -1;
      return el('div', { class: 'card hover', onClick: () => nav('bounty/' + b.id) }, [
        el('div', { class: 'spread' }, [
          el('span', { class: 'severity ' + b.severity, text: b.severity }),
          el('span', { class: 'chip' + (done ? ' ok' : ''), text: done ? '✓ Closed' : '+' + b.xp + ' XP' })
        ]),
        el('h2', { text: b.title, style: { margin: '10px 0 4px' } }),
        el('pre', { style: { fontSize: '11.6px', maxHeight: '112px', overflow: 'hidden', margin: '0 0 10px' }, text: b.report }),
        U.pointChips(b.points)
      ]);
    })));
    return view;
  }, { title: 'Bug bounties', zone: 'y12' });

  U.route('bounty', (args) => {
    const b = A.Game.bountyById(args[0]);
    if (!b) return el('div', { class: 'card' }, 'Unknown bounty.');
    const st = A.State.get();
    const closed = st.bounties.indexOf(b.id) !== -1;
    const view = el('div', { class: 'view' });

    view.appendChild(el('div', { class: 'vhead' }, [
      el('div', {}, [
        el('div', { class: 'eyebrow', text: `Bug bounty · ${b.lang} · +${b.xp} XP` }),
        el('h1', { text: b.title }),
        el('div', { class: 'qmeta', style: { marginTop: '6px' } }, [
          el('span', { class: 'severity ' + b.severity, text: b.severity }),
          closed ? el('span', { class: 'chip ok', text: '✓ Patched & verified' }) : null
        ])
      ]),
      el('button', { class: 'btn ghost', onClick: () => nav('bounties') }, '← Board')
    ]));

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'eyebrow', style: { marginBottom: '7px' }, text: 'Incident ticket' }),
      el('pre', { class: 'wrap', text: b.report, style: { margin: '0 0 12px' } }),
      U.pointChips(b.points)
    ]));

    const debrief = el('div');
    if (closed) debrief.appendChild(el('div', { class: 'callout tip', html: '<b>Debrief. </b>' + b.debrief }));

    const r = runner({
      lang: b.lang, source: st.bountyCode[b.id] || b.starter, tests: b.tests, reset: true,
      onResult: (res, src) => {
        const was = A.State.get().bounties.indexOf(b.id) !== -1;
        A.State.recordBounty(b, src, res.passed);
        debrief.innerHTML = '';
        if (res.passed) {
          debrief.appendChild(el('div', { class: 'callout tip', html: '<b>Bounty closed. </b>' + b.debrief }));
          if (!was) U.toast('BOUNTY CLOSED', b.title, 'quest');
        } else {
          debrief.appendChild(el('div', { class: 'callout', html: `<b>Not yet. </b>${res.failures || 'Some'} verification check(s) still failing — the patch must fix the vulnerability <em>and</em> keep the legitimate behaviour working.` }));
        }
      }
    });

    view.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'card' }, [el('h2', { text: 'Patch' }), r.node]),
      el('div', { class: 'card' }, [el('h2', { text: 'Verification suite' }), r.console, debrief])
    ]));

    return view;
  }, { title: 'Bug bounty', zone: 'y12' });

})(window.APP = window.APP || {});
