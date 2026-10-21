/* ===========================================================================
   ui.js — shared UI kit: DOM helpers, router, zone theming, toasts, modals,
   syntax highlighting, question/lesson renderers.
   =========================================================================== */
(function (A) {
  'use strict';

  /* ------------------------------------------------------- DOM helpers */
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) Object.keys(props).forEach(k => {
      const v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    (Array.isArray(children) ? children : children !== undefined ? [children] : [])
      .forEach(c => {
        if (c === null || c === undefined || c === false) return;
        node.appendChild(typeof c === 'object' && c.nodeType ? c : document.createTextNode(String(c)));
      });
    return node;
  }
  const frag = kids => { const f = document.createDocumentFragment(); kids.filter(Boolean).forEach(k => f.appendChild(k)); return f; };
  const esc = s => String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => [...(root || document).querySelectorAll(sel)];
  const fmtDate = ts => new Date(ts).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = ts => new Date(ts).toLocaleTimeString('en-AU', { hour12: false });
  const clock = ms => {
    const t = Math.max(0, Math.round(ms / 1000));
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  };

  /* --------------------------------------------------- syntax highlight */
  const KEYWORDS = {
    python: /\b(def|class|return|if|elif|else|for|while|in|not|and|or|import|from|as|try|except|finally|raise|with|lambda|None|True|False|self|global|nonlocal|pass|break|continue|yield|assert|print|range|len|sum|set|dict|list|int|str|float|bool|max|min|abs|round|isinstance|super|zip|enumerate)\b/g,
    javascript: /\b(function|const|let|var|return|if|else|for|while|of|in|new|class|extends|this|try|catch|finally|throw|async|await|null|undefined|true|false|typeof|instanceof|break|continue|switch|case|default|console|Math|JSON|Object|Array|String|Number|Set|Map|require|export|import)\b/g,
    sql: /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|AND|OR|NOT|NULL|AS|COUNT|AVG|SUM|MIN|MAX|DESC|ASC|LIMIT|DISTINCT)\b/gi,
    text: null
  };

  function highlight(src, lang) {
    let out = esc(src);
    const marks = [];
    const stash = html => { marks.push(html); return '\u0000' + (marks.length - 1) + '\u0000'; };
    // comments & strings first so keywords inside them are not coloured
    if (lang === 'python') {
      out = out.replace(/(#[^\n]*)/g, m => stash('<span style="color:var(--ink-3)">' + m + '</span>'));
    } else if (lang === 'javascript') {
      out = out.replace(/(\/\/[^\n]*)/g, m => stash('<span style="color:var(--ink-3)">' + m + '</span>'));
    } else if (lang === 'sql') {
      out = out.replace(/(--[^\n]*)/g, m => stash('<span style="color:var(--ink-3)">' + m + '</span>'));
    }
    out = out.replace(/(&quot;[^&\n]*?&quot;|'[^'\n]*?'|`[^`]*?`)/g,
      m => stash('<span style="color:var(--ok)">' + m + '</span>'));
    const kw = KEYWORDS[lang];
    if (kw) out = out.replace(kw, m => '<span style="color:var(--accent-2);font-weight:600">' + m + '</span>');
    out = out.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:var(--warn)">$1</span>');
    out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => marks[+i]);
    return out;
  }

  const codeBlock = (src, lang) =>
    el('pre', { class: 'code' }, [el('code', { html: highlight(src, lang || 'text') })]);

  /* ------------------------------------------------------------ toasts */
  function toast(title, body, kind) {
    const host = qs('.toasts') || document.body.appendChild(el('div', { class: 'toasts' }));
    const t = el('div', { class: 'toast glass' }, [
      el('b', { text: title }),
      el('span', { html: esc(body) })
    ]);
    host.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .4s, transform .4s';
      t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 420);
    }, kind === 'rank' || kind === 'quest' ? 6000 : 4200);
  }

  /* ------------------------------------------------------------- modal */
  function modal(title, contentNode, actions) {
    const scrim = el('div', { class: 'scrim', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    const close = () => { document.removeEventListener('keydown', onKey); scrim.remove(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    const box = el('div', { class: 'modal card' }, [
      el('div', { class: 'spread', style: { marginBottom: '12px' } }, [
        el('h2', { text: title, style: { margin: '0' } }),
        el('button', { class: 'btn sm ghost', onClick: close, 'aria-label': 'Close' }, '✕')
      ]),
      contentNode,
      actions ? el('div', { class: 'btnrow', style: { marginTop: '16px' } }, actions) : null
    ]);
    scrim.appendChild(box);
    scrim.addEventListener('click', e => { if (e.target === scrim) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(scrim);
    return { close, box };
  }

  function confirmDialog(title, message, onYes, yesLabel) {
    const m = modal(title, el('p', { text: message }), [
      el('button', { class: 'btn primary', onClick: () => { m.close(); onYes(); } }, yesLabel || 'Confirm'),
      el('button', { class: 'btn ghost', onClick: () => m.close() }, 'Cancel')
    ]);
  }

  /* -------------------------------------------------------------- zone */
  let currentZone = 'y11';
  function setZone(z) {
    if (z === currentZone) return;
    currentZone = z;
    document.documentElement.setAttribute('data-zone', z);
    const meta = qs('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', z === 'y12' ? '#04070c' : '#f4f6fb');
  }
  const zone = () => currentZone;
  const zoneOfArea = id => (A.Syllabus.AREA_INDEX[id] && A.Syllabus.AREA_INDEX[id].year === 12) ? 'y12' : 'y11';

  /* ------------------------------------------------------------ router */
  const routes = {};
  const route = (name, fn, opts) => { routes[name] = Object.assign({ render: fn }, opts || {}); };

  function parseHash() {
    const raw = (location.hash || '#/dashboard').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    return { name: parts[0] || 'dashboard', args: parts.slice(1).map(decodeURIComponent) };
  }

  function navigate(path) { location.hash = '#/' + path.replace(/^\/+/, ''); }

  function render() {
    const { name, args } = parseHash();
    const r = routes[name] || routes.dashboard;
    const main = qs('#main');
    // zone is decided by the route itself
    const z = typeof r.zone === 'function' ? r.zone(args) : (r.zone || 'y11');
    setZone(z);
    main.innerHTML = '';
    let node;
    try {
      node = r.render(args);
    } catch (err) {
      console.error(err);
      node = el('div', { class: 'card' }, [
        el('h2', { text: 'Something went wrong rendering this view' }),
        el('pre', { text: String(err && err.stack || err) })
      ]);
    }
    main.appendChild(node);
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    paintNav(name);
    document.title = (r.title ? r.title + ' · ' : '') + 'SE Ops — NESA Software Engineering 11–12';
  }

  function paintNav(name) {
    qsa('[data-nav]').forEach(a => {
      const on = a.getAttribute('data-nav') === name;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* -------------------------------------------- shared render fragments */
  function masteryDot(pid) {
    const m = A.State.masteryOf(pid);
    return el('i', {
      class: 'dot l' + m.score,
      title: pid + ' — ' + A.State.LEVELS[m.score]
    });
  }

  function pointChip(pid, opts) {
    const info = A.Syllabus.POINT_INDEX[pid];
    if (!info) return el('span', { class: 'chip mono', text: pid });
    const m = A.State.masteryOf(pid);
    return el('button', {
      class: 'chip mono' + (m.score === 3 ? ' ok' : m.score > 0 ? ' accent' : ''),
      title: info.point.text + '  —  ' + A.State.LEVELS[m.score],
      onClick: e => { e.stopPropagation(); navigate('point/' + pid); }
    }, (opts && opts.withText) ? pid + ' · ' + info.point.text.slice(0, 48) + '…' : pid);
  }

  const pointChips = (pids, opts) =>
    el('div', { class: 'qmeta' }, (pids || []).map(p => pointChip(p, opts)));

  function progressBar(pct, thin) {
    return el('div', { class: 'bar' + (thin ? ' thin' : ''), role: 'progressbar',
      'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 },
      [el('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%' } })]);
  }

  function statCard(k, v, s, onClick) {
    return el('div', {
      class: 'card stat hover', style: onClick ? { cursor: 'pointer' } : null,
      onClick: onClick || null
    }, [
      el('div', { class: 'k', text: k }),
      el('div', { class: 'v', text: v }),
      s ? el('div', { class: 's', html: esc(s) }) : null
    ]);
  }

  function areaBadge(areaId) {
    const a = A.Syllabus.AREA_INDEX[areaId];
    if (!a) return el('span');
    return el('span', { class: 'chip' + (a.year === 12 ? ' accent' : ''), text: `Y${a.year} · ${a.title}` });
  }

  /* -------------------------------------------- lesson block renderer */
  function renderBlocks(blocks) {
    return frag(blocks.map(b => {
      switch (b.t) {
        case 'h': return el('h3', { html: esc(b.v) });
        case 'p': return el('p', { html: b.v });
        case 'ul': return el('ul', {}, b.v.map(x => el('li', { html: x })));
        case 'ol': return el('ol', {}, b.v.map(x => el('li', { html: x })));
        case 'code': return codeBlock(b.v, b.lang);
        case 'callout': return el('div', { class: 'callout ' + (b.k || ''), html: (b.k === 'exam' ? '<b>In the exam. </b>' : b.k === 'tip' ? '<b>Tip. </b>' : '') + b.v });
        case 'terms': return el('div', { class: 'terms' }, b.v.map(([t, d]) => el('div', {}, [el('b', { html: t }), el('span', { html: d })])));
        case 'svg': return el('div', { class: 'figure', html: A.diagram(b.v) });
        case 'table': return el('div', { class: 'tablewrap' }, [
          el('table', {}, [
            el('thead', {}, [el('tr', {}, b.head.map(h => el('th', { html: h })))]),
            el('tbody', {}, b.rows.map(r => el('tr', {}, r.map(c => el('td', { html: c })))))
          ])
        ]);
        default: return null;
      }
    }));
  }

  /* --------------------------------------------- question media + marking */
  function renderMedia(media) {
    if (!media) return null;
    if (media.kind === 'code') return codeBlock(media.src, media.lang);
    if (media.kind === 'log') return el('pre', { class: 'code wrap', style: { fontSize: '12.2px' } }, [el('code', { text: media.src })]);
    if (media.kind === 'diagram') return el('div', { class: 'figure', html: A.diagram(media.key) });
    if (media.kind === 'scenario') return el('div', { class: 'callout', html: '<b>Scenario. </b>' + esc(media.text) });
    return null;
  }

  /* Criterion-referenced marking lives in marking.js (rubric weighting plus
     structural analysis of what the command verb demands). This wrapper keeps
     the older `crits` field name so every existing caller keeps working. */
  function markShort(q, text) {
    const r = A.Marking.mark(q, text);
    r.crits = r.criteria;
    return r;
  }

  const EXPECTED_WORDS = marks => A.Marking.expectedWords(marks);

  A.UI = {
    el, frag, esc, qs, qsa, fmtDate, fmtTime, clock, highlight, codeBlock,
    toast, modal, confirmDialog, setZone, zone, zoneOfArea,
    route, render, navigate, parseHash, paintNav,
    masteryDot, pointChip, pointChips, progressBar, statCard, areaBadge,
    renderBlocks, renderMedia, markShort, EXPECTED_WORDS
  };
  A.toast = toast;
})(window.APP = window.APP || {});
