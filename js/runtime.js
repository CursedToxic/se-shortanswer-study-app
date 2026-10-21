/* ===========================================================================
   runtime.js — secure, zero-setup inline code execution
     JavaScript : sandboxed <iframe sandbox="allow-scripts"> (unique opaque
                  origin, no DOM/storage/network access to the host page),
                  hard wall-clock timeout, postMessage transport.
     Python     : Pyodide (CPython compiled to WebAssembly) inside a dedicated
                  Web Worker — no DOM access, terminated on timeout.
   Nothing is installed and nothing is sent to a server: every execution runs
   in the learner's own browser sandbox. This is the 'sandboxing' half of
   SSA-2.3 demonstrated in the tool itself.
   =========================================================================== */
(function (A) {
  'use strict';

  const PYODIDE_VERSION = '0.26.4';
  const PYODIDE_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/pyodide.js`;
  const PYODIDE_INDEX = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`;
  const DEFAULT_TIMEOUT = 15000;

  /* ------------------------------------------------------- JavaScript sandbox */
  function runJavaScript(source, timeout) {
    timeout = timeout || DEFAULT_TIMEOUT;
    return new Promise(resolve => {
      const token = 'run' + Math.random().toString(36).slice(2);
      const started = performance.now();
      const out = [];
      let settled = false;

      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none';

      const finish = (res) => {
        if (settled) return;
        settled = true;
        clearTimeout(killer);
        window.removeEventListener('message', onMessage);
        frame.remove();
        resolve(Object.assign({ output: out.join('\n'), ms: Math.round(performance.now() - started) }, res));
      };

      const killer = setTimeout(() => {
        finish({ ok: false, error: `Execution exceeded ${timeout / 1000}s and was terminated. Check for an infinite loop.`, timedOut: true });
      }, timeout);

      function onMessage(e) {
        const d = e.data;
        if (!d || d.token !== token) return;
        if (d.type === 'log') out.push(d.line);
        else if (d.type === 'done') finish({ ok: true });
        else if (d.type === 'error') finish({ ok: false, error: d.error });
      }
      window.addEventListener('message', onMessage);

      /* The learner's source is embedded inside an inline <script> in the
         sandbox document, so any literal "</script>" in it — common in this
         course, where students write and defuse XSS payloads — would close
         the script element early and silently break the sandbox. Escaping
         "</" as "<\/" inside the JS string literal is inert to JavaScript
         but invisible to the HTML parser. */
      const embedded = JSON.stringify(source).replace(/<\//g, '<\\/');

      const harness = `<!doctype html><meta charset="utf-8"><body><script>
(function(){
  var TOKEN = ${JSON.stringify(token)};
  var send = function(msg){ msg.token = TOKEN; parent.postMessage(msg, '*'); };
  var fmt = function(v){
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.name + ': ' + v.message;
    try { return JSON.stringify(v, function(k, val){
      return typeof val === 'function' ? '[Function ' + (val.name||'anonymous') + ']' : val;
    }); } catch (e) { return String(v); }
  };
  var emit = function(){ send({ type:'log', line: Array.prototype.map.call(arguments, fmt).join(' ') }); };
  console.log = console.info = console.debug = emit;
  console.warn = function(){ emit.apply(null, ['[warn]'].concat([].slice.call(arguments))); };
  console.error = function(){ emit.apply(null, ['[error]'].concat([].slice.call(arguments))); };
  window.onerror = function(m, s, l, c, err){ send({ type:'error', error: (err && err.stack) ? String(err.stack).split('\\n')[0] : m }); return true; };
  try {
    (0, eval)(${embedded});
    send({ type: 'done' });
  } catch (err) {
    send({ type: 'error', error: (err && err.name ? err.name + ': ' + err.message : String(err)) });
  }
})();
<\/script></body>`;

      frame.srcdoc = harness;
      document.body.appendChild(frame);
    });
  }

  /* ----------------------------------------------------------- Python worker */
  let pyWorker = null;
  let pyReady = null;
  let pyJobId = 0;
  const pyJobs = new Map();

  function workerSource() {
    return `
let pyodide = null;
let buffer = [];

async function boot() {
  if (pyodide) return pyodide;
  self.importScripts(${JSON.stringify(PYODIDE_URL)});
  pyodide = await self.loadPyodide({
    indexURL: ${JSON.stringify(PYODIDE_INDEX)},
    stdout: line => buffer.push(line),
    stderr: line => buffer.push(line)
  });
  return pyodide;
}

self.onmessage = async (e) => {
  const { id, kind, source } = e.data;
  if (kind === 'boot') {
    try { await boot(); self.postMessage({ id, type: 'ready' }); }
    catch (err) { self.postMessage({ id, type: 'bootfail', error: String(err && err.message || err) }); }
    return;
  }
  if (kind === 'run') {
    buffer = [];
    const t0 = performance.now();
    try {
      await boot();
      await pyodide.runPythonAsync(source);
      self.postMessage({ id, type: 'done', output: buffer.join('\\n'), ms: Math.round(performance.now() - t0) });
    } catch (err) {
      const msg = String(err && err.message || err);
      // Pyodide's traceback starts with its own interpreter frames. Drop those
      // so the learner sees their own code and the exception, not our plumbing.
      const lines = msg.trim().split('\\n');
      const noise = /_pyodide|pyodide\\/_|site-packages|importlib|\\/lib\\/python3|CodeRunner|run_async|eval_code|coroutine\\s*=/;
      // A caret line only means something under a line we kept.
      var dropped = true;
      const mine = lines.filter(function (l) {
        if (!l.trim()) { return false; }
        if (/^\\s*\\^+\\s*$/.test(l)) { return !dropped; }
        dropped = noise.test(l);
        return !dropped;
      });
      const last = lines[lines.length - 1];
      const kept = mine.length ? mine.slice(-5) : lines.slice(-3);
      // the slice can orphan a caret line from the source line it pointed at
      while (kept.length && /^\\s*\\^+\\s*$/.test(kept[0])) kept.shift();
      if (kept[kept.length - 1] !== last) kept.push(last);
      const tail = kept.join('\\n');
      self.postMessage({ id, type: 'error', output: buffer.join('\\n'), error: tail, ms: Math.round(performance.now() - t0) });
    }
  }
};`;
  }

  function spawnWorker() {
    const blob = new Blob([workerSource()], { type: 'text/javascript' });
    const w = new Worker(URL.createObjectURL(blob));
    w.onmessage = e => {
      const job = pyJobs.get(e.data.id);
      if (job) { pyJobs.delete(e.data.id); job(e.data); }
    };
    w.onerror = () => {
      pyJobs.forEach(fn => fn({ type: 'error', error: 'Python worker failed to start.' }));
      pyJobs.clear();
    };
    return w;
  }

  function post(kind, source, timeout) {
    return new Promise(resolve => {
      if (!pyWorker) pyWorker = spawnWorker();
      const id = ++pyJobId;
      let done = false;
      const killer = setTimeout(() => {
        if (done) return;
        done = true;
        pyJobs.delete(id);
        try { pyWorker.terminate(); } catch (e) { /* noop */ }
        pyWorker = null; pyReady = null;
        resolve({ type: 'error', output: '', error: `Execution exceeded ${timeout / 1000}s and the Python sandbox was terminated. Check for an infinite loop.`, timedOut: true });
      }, timeout);
      pyJobs.set(id, data => { if (done) return; done = true; clearTimeout(killer); resolve(data); });
      pyWorker.postMessage({ id, kind, source });
    });
  }

  function preloadPython(onStatus) {
    if (pyReady) return pyReady;
    onStatus && onStatus('Downloading the Python (WebAssembly) runtime — first run only…');
    pyReady = post('boot', '', 120000).then(res => {
      if (res.type === 'ready') { onStatus && onStatus('Python runtime ready.'); return true; }
      pyReady = null;
      throw new Error(res.error || 'Python runtime unavailable. An internet connection is needed the first time it loads.');
    });
    return pyReady;
  }

  async function runPython(source, timeout, onStatus) {
    timeout = timeout || DEFAULT_TIMEOUT;
    try {
      await preloadPython(onStatus);
    } catch (err) {
      return { ok: false, output: '', error: err.message, ms: 0 };
    }
    const res = await post('run', source, timeout);
    return {
      ok: res.type === 'done',
      output: res.output || '',
      error: res.type === 'error' ? res.error : null,
      timedOut: !!res.timedOut,
      ms: res.ms || 0
    };
  }

  /* --------------------------------------------------------------- public API */
  async function run(lang, source, opts) {
    opts = opts || {};
    const t0 = performance.now();
    const res = lang === 'python'
      ? await runPython(source, opts.timeout, opts.onStatus)
      : await runJavaScript(source, opts.timeout);
    res.ms = res.ms || Math.round(performance.now() - t0);
    return res;
  }

  /* Run learner source with a hidden test harness appended and decide pass/fail
     from the sentinel the harness prints. */
  async function runTests(lang, source, tests, opts) {
    const joined = lang === 'python'
      ? source + '\n\n' + tests
      : source + '\n;\n' + tests;
    const res = await run(lang, joined, opts);
    const text = (res.output || '');
    res.passed = res.ok && text.indexOf(A.Game.SENTINEL_OK) !== -1;
    res.output = text.split(A.Game.SENTINEL_OK).join('ALL TESTS PASSED');
    res.checks = (res.output.match(/^(PASS|FAIL) .*/gm) || []);
    res.failures = res.checks.filter(l => l.indexOf('FAIL') === 0).length;
    return res;
  }

  A.Runtime = { run, runTests, preloadPython, PYODIDE_VERSION };
})(window.APP = window.APP || {});
