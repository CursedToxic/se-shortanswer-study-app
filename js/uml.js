/* ===========================================================================
   uml.js — text-driven UML / modelling tool (SEP-2.8, OOP-1.3)
   A tiny declarative language is parsed into laid-out SVG so students can
   create, version and export class, sequence, use case and flowchart models
   without leaving the app. Diagrams save into the portfolio and export as SVG.
   =========================================================================== */
(function (A) {
  'use strict';

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const W = (s, px) => Math.ceil(String(s).length * px);

  const KINDS = {
    class: {
      label: 'Class diagram',
      example: `class Account
- accountNo : string
- balance : real
+ deposit(amount) : void
+ getBalance() : real

class SavingsAccount : Account
- interestRate : real
+ addInterest() : void

class ChequeAccount : Account
- overdraft : real
+ withdraw(amount) : void`,
      help: 'One <code>class Name</code> per block, optionally <code>: Superclass</code> for inheritance. Member lines start with <code>-</code> (private), <code>+</code> (public) or <code>#</code> (protected).'
    },
    sequence: {
      label: 'Sequence diagram',
      example: `actor Student
actor Browser
actor API
actor Database

Student -> Browser : submit order
Browser -> API : POST /orders
API -> Database : INSERT order
Database --> API : order id
API --> Browser : 201 Created
Browser --> Student : confirmation`,
      help: 'Declare participants with <code>actor Name</code>, then messages as <code>A -&gt; B : label</code>. Use <code>--&gt;</code> for a return/response message.'
    },
    usecase: {
      label: 'Use case diagram',
      example: `actor Student
actor Canteen staff

usecase Browse menu
usecase Place order
usecase Pay for order
usecase Mark order fulfilled

Student -> Browse menu
Student -> Place order
Student -> Pay for order
Canteen staff -> Mark order fulfilled`,
      help: 'Declare <code>actor Name</code> and <code>usecase Name</code>, then associations as <code>Actor -&gt; Use case</code>.'
    },
    flow: {
      label: 'Flowchart',
      example: `start Begin
io Read mark
decision mark >= 50
process Display "Pass"
process Record result
end Finish`,
      help: 'One step per line: <code>start</code>, <code>end</code>, <code>io</code> (parallelogram), <code>process</code> (rectangle), <code>decision</code> (diamond).'
    }
  };

  /* --------------------------------------------------------------- parsing */
  function parse(kind, src) {
    const lines = String(src || '').split('\n').map(l => l.trimEnd());
    if (kind === 'class') {
      const classes = [];
      let cur = null;
      lines.forEach(raw => {
        const line = raw.trim();
        if (!line) return;
        const m = /^class\s+([^:]+?)\s*(?::\s*(.+))?$/i.exec(line);
        if (m) {
          cur = { name: m[1].trim(), parent: (m[2] || '').trim() || null, attrs: [], methods: [] };
          classes.push(cur);
          return;
        }
        if (!cur) return;
        if (/^[-+#]/.test(line)) {
          (line.indexOf('(') !== -1 ? cur.methods : cur.attrs).push(line);
        }
      });
      return { classes };
    }
    const actors = [], usecases = [], links = [];
    lines.forEach(raw => {
      const line = raw.trim();
      if (!line) return;
      let m;
      if ((m = /^actor\s+(.+)$/i.exec(line))) { actors.push(m[1].trim()); return; }
      if ((m = /^usecase\s+(.+)$/i.exec(line))) { usecases.push(m[1].trim()); return; }
      if ((m = /^(.+?)\s*(-->|->)\s*([^:]+?)\s*(?::\s*(.*))?$/.exec(line))) {
        links.push({ from: m[1].trim(), to: m[3].trim(), dashed: m[2] === '-->', label: (m[4] || '').trim() });
        return;
      }
      if ((m = /^(start|end|io|process|decision)\s+(.+)$/i.exec(line))) {
        links.push({ step: m[1].toLowerCase(), text: m[2].trim() });
      }
    });
    return { actors, usecases, links };
  }

  /* ----------------------------------------------------------- SVG helpers */
  const head = (w, h, title) =>
    `<svg xmlns="http://www.w3.org/2000/svg" class="dgm uml" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(title)}">
  <defs>
    <marker id="um-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--dgm-line)"/></marker>
    <marker id="um-tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="var(--dgm-bg)" stroke="var(--dgm-line)" stroke-width="1.2"/></marker>
  </defs>`;

  /* ------------------------------------------------------------ renderers */
  function renderClass(model) {
    const cls = model.classes;
    if (!cls.length) return empty('Add a class to begin.');
    const PAD = 24, GAP = 42, LH = 17;
    // size each box
    cls.forEach(c => {
      const widest = Math.max(
        W(c.name, 8.4) + 30,
        ...c.attrs.concat(c.methods).map(t => W(t, 6.9) + 26), 150);
      c.w = Math.min(300, Math.max(150, widest));
      c.h = 30 + Math.max(1, c.attrs.length) * LH + 10 + Math.max(1, c.methods.length) * LH + 10;
    });
    // rows: parents on row 0, children beneath their parent
    const roots = cls.filter(c => !c.parent || !cls.some(p => p.name === c.parent));
    const rows = [roots];
    let guard = 0;
    while (guard++ < 6) {
      const prev = rows[rows.length - 1];
      const next = cls.filter(c => c.parent && prev.some(p => p.name === c.parent) && !rows.flat().includes(c));
      if (!next.length) break;
      rows.push(next);
    }
    cls.filter(c => !rows.flat().includes(c)).forEach(c => rows[rows.length - 1].push(c));

    const rowW = rows.map(r => r.reduce((s, c) => s + c.w, 0) + GAP * (r.length - 1));
    const width = Math.max(...rowW) + PAD * 2;
    let y = PAD, body = '';
    rows.forEach((row, ri) => {
      let x = (width - rowW[ri]) / 2;
      const rowH = Math.max(...row.map(c => c.h));
      row.forEach(c => {
        c.x = x; c.y = y;
        const aTop = c.y + 30, mTop = aTop + Math.max(1, c.attrs.length) * LH + 10;
        body += `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="8" class="dgm-box"/>
          <text x="${c.x + c.w / 2}" y="${c.y + 20}" class="dgm-t">${esc(c.name)}</text>
          <line x1="${c.x}" y1="${aTop - 4}" x2="${c.x + c.w}" y2="${aTop - 4}" class="dgm-l"/>
          ${(c.attrs.length ? c.attrs : ['(no attributes)']).map((t, i) =>
            `<text x="${c.x + 12}" y="${aTop + 12 + i * LH}" class="dgm-c">${esc(t)}</text>`).join('')}
          <line x1="${c.x}" y1="${mTop - 6}" x2="${c.x + c.w}" y2="${mTop - 6}" class="dgm-l"/>
          ${(c.methods.length ? c.methods : ['(no methods)']).map((t, i) =>
            `<text x="${c.x + 12}" y="${mTop + 10 + i * LH}" class="dgm-c">${esc(t)}</text>`).join('')}`;
        x += c.w + GAP;
      });
      y += rowH + 60;
    });
    // inheritance arrows
    cls.forEach(c => {
      if (!c.parent) return;
      const p = cls.find(x => x.name === c.parent);
      if (!p || p.y === undefined) return;
      const x1 = c.x + c.w / 2, y1 = c.y, x2 = p.x + p.w / 2, y2 = p.y + p.h;
      const mid = (y1 + y2) / 2;
      body += `<path d="M${x1},${y1} L${x1},${mid} L${x2},${mid} L${x2},${y2}" class="dgm-l" fill="none" marker-end="url(#um-tri)"/>`;
    });
    return head(width, y - 20, 'UML class diagram') + body + '</svg>';
  }

  function renderSequence(model) {
    const names = model.actors.length ? model.actors
      : [...new Set(model.links.flatMap(l => [l.from, l.to]).filter(Boolean))];
    if (!names.length) return empty('Declare participants with “actor Name”.');
    const msgs = model.links.filter(l => l.from && l.to);
    const colW = Math.max(150, ...names.map(n => W(n, 8) + 40),
      ...msgs.map(m => W(m.label, 6.4) / 1.6));
    const width = names.length * colW + 40;
    const top = 70, step = 46;
    const height = top + Math.max(1, msgs.length) * step + 50;
    const cx = i => 20 + colW * i + colW / 2;
    let body = '';
    names.forEach((n, i) => {
      const bw = Math.min(colW - 20, W(n, 8) + 28);
      body += `<rect x="${cx(i) - bw / 2}" y="18" width="${bw}" height="34" rx="8" class="dgm-box"/>
        <text x="${cx(i)}" y="40" class="dgm-t">${esc(n)}</text>
        <line x1="${cx(i)}" y1="52" x2="${cx(i)}" y2="${height - 24}" class="dgm-l" stroke-dasharray="4 5"/>`;
    });
    msgs.forEach((m, i) => {
      const a = names.indexOf(m.from), b = names.indexOf(m.to);
      if (a < 0 || b < 0) return;
      const y = top + i * step;
      const x1 = cx(a), x2 = cx(b) + (b > a ? -6 : 6);
      body += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="dgm-l" marker-end="url(#um-arrow)"${m.dashed ? ' stroke-dasharray="6 4"' : ''}/>
        <text x="${(x1 + x2) / 2}" y="${y - 8}" class="dgm-s">${esc(m.label)}</text>`;
    });
    return head(width, height, 'UML sequence diagram') + body + '</svg>';
  }

  function renderUseCase(model) {
    const { actors, usecases, links } = model;
    if (!actors.length && !usecases.length) return empty('Declare an actor and a use case.');
    const rowH = 64;
    const height = Math.max(actors.length, usecases.length) * rowH + 90;
    const width = 700;
    const ax = 80, ux = 470;
    const ay = i => 70 + i * rowH + (Math.max(actors.length, usecases.length) - actors.length) * rowH / 2;
    const uy = i => 70 + i * rowH + (Math.max(actors.length, usecases.length) - usecases.length) * rowH / 2;
    let body = `<rect x="300" y="40" width="370" height="${height - 70}" rx="14" class="dgm-box" fill="none" stroke-dasharray="6 5"/>
      <text x="485" y="62" class="dgm-s">System boundary</text>`;
    actors.forEach((a, i) => {
      const y = ay(i);
      body += `<circle cx="${ax}" cy="${y - 16}" r="9" class="dgm-box"/>
        <path d="M${ax},${y - 7} L${ax},${y + 10} M${ax - 11},${y} L${ax + 11},${y} M${ax},${y + 10} L${ax - 9},${y + 24} M${ax},${y + 10} L${ax + 9},${y + 24}" class="dgm-l" fill="none"/>
        <text x="${ax}" y="${y + 40}" class="dgm-s">${esc(a)}</text>`;
    });
    usecases.forEach((u, i) => {
      const y = uy(i);
      body += `<ellipse cx="${ux}" cy="${y}" rx="${Math.max(80, W(u, 4.6))}" ry="22" class="dgm-box"/>
        <text x="${ux}" y="${y + 5}" class="dgm-t">${esc(u)}</text>`;
    });
    links.filter(l => l.from && l.to).forEach(l => {
      const ai = actors.indexOf(l.from), ui = usecases.indexOf(l.to);
      if (ai < 0 || ui < 0) return;
      body += `<line x1="${ax + 16}" y1="${ay(ai)}" x2="${ux - Math.max(80, W(usecases[ui], 4.6)) - 4}" y2="${uy(ui)}" class="dgm-l dgm-thin"/>`;
    });
    return head(width, height, 'UML use case diagram') + body + '</svg>';
  }

  function renderFlow(model) {
    const steps = model.links.filter(l => l.step);
    if (!steps.length) return empty('Add a step, e.g. “start Begin”.');
    const width = 560, cx = 280;
    const gap = 34;
    let y = 24, body = '';
    const boxes = [];
    steps.forEach(s => {
      const w = Math.min(420, Math.max(190, W(s.text, 8.2) + 60));
      const h = s.step === 'decision' ? 84 : 46;
      boxes.push({ s, y, h, w });
      y += h + gap;
    });
    const height = y + 10;
    boxes.forEach((b, i) => {
      const { s, w, h } = b, top = b.y;
      if (s.step === 'start' || s.step === 'end') {
        body += `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h}" rx="23" class="dgm-box"/>`;
      } else if (s.step === 'io') {
        body += `<path d="M${cx - w / 2 + 16},${top} L${cx + w / 2},${top} L${cx + w / 2 - 16},${top + h} L${cx - w / 2},${top + h} z" class="dgm-box"/>`;
      } else if (s.step === 'decision') {
        body += `<path d="M${cx},${top} L${cx + w / 2},${top + h / 2} L${cx},${top + h} L${cx - w / 2},${top + h / 2} z" class="dgm-box"/>`;
      } else {
        body += `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h}" rx="6" class="dgm-box"/>`;
      }
      body += `<text x="${cx}" y="${top + h / 2 + 5}" class="dgm-t">${esc(s.text)}</text>`;
      if (i < boxes.length - 1) {
        const y1 = top + h, y2 = boxes[i + 1].y;
        body += `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2 - 2}" class="dgm-l" marker-end="url(#um-arrow)"/>`;
        if (s.step === 'decision') {
          body += `<text x="${cx + 16}" y="${(y1 + y2) / 2 + 4}" class="dgm-s" text-anchor="start">Yes</text>
            <path d="M${cx + w / 2},${top + h / 2} L${cx + w / 2 + 50},${top + h / 2} L${cx + w / 2 + 50},${y2 + 70} L${cx + 6},${y2 + 70}" class="dgm-l" fill="none" marker-end="url(#um-arrow)" stroke-dasharray="5 4"/>
            <text x="${cx + w / 2 + 54}" y="${top + h / 2 - 8}" class="dgm-s" text-anchor="start">No</text>`;
        }
      }
    });
    return head(width, height, 'Flowchart') + body + '</svg>';
  }

  const empty = msg => head(400, 90, 'Empty diagram') +
    `<text x="200" y="50" class="dgm-s">${esc(msg)}</text></svg>`;

  function render(kind, src) {
    try {
      const model = parse(kind, src);
      if (kind === 'class') return renderClass(model);
      if (kind === 'sequence') return renderSequence(model);
      if (kind === 'usecase') return renderUseCase(model);
      return renderFlow(model);
    } catch (err) {
      return empty('Could not parse: ' + err.message);
    }
  }

  function exportSVG(kind, src, name) {
    const svg = render(kind, src)
      .replace('class="dgm uml"', 'class="dgm uml" style="background:#ffffff"')
      .replace('<defs>', `<style>
        .dgm-box{fill:#ffffff;stroke:#1d1d1f;stroke-width:1.3}
        .dgm-l{stroke:#1d1d1f;stroke-width:1.3;fill:none}
        .dgm-thin{stroke-width:1}
        .dgm-t{fill:#1d1d1f;font:600 13px ui-sans-serif,system-ui,sans-serif;text-anchor:middle}
        .dgm-c{fill:#1d1d1f;font:12px ui-monospace,monospace}
        .dgm-s{fill:#4a4a4f;font:11px ui-sans-serif,system-ui,sans-serif;text-anchor:middle}
      </style><defs>`);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (name || 'diagram').replace(/[^\w-]+/g, '-') + '.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  A.UML = { KINDS, parse, render, exportSVG };
})(window.APP = window.APP || {});
