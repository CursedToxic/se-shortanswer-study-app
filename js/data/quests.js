/* ===========================================================================
   quests.js — gamification layer
     · RANKS         XP thresholds mapped to NESA performance bands
     · CHALLENGES    inline-executable coding tasks (auto-tested)
     · BOUNTIES      bug-bounty: patch broken / vulnerable code until tests pass
     · QUESTS        narrative mission chains (Year 12 = ops-centre storyline)
     · ASSETS        unlockable virtual rewards
   =========================================================================== */
(function (A) {
  'use strict';

  /* ------------------------------------------------------------------ RANKS
     Bands describe HSC performance band descriptors; ranks are the in-app
     progression name. Year 11 learners sit in the lower ranks by design.      */
  const RANKS = [
    { id: 0, name: 'Initiate',        band: 'Pre-Band 1', xp: 0,     blurb: 'Terminal access granted. Begin with Programming Fundamentals.' },
    { id: 1, name: 'Operator',        band: 'Band 1',     xp: 400,   blurb: 'Elementary knowledge and skills in limited contexts.' },
    { id: 2, name: 'Technician',      band: 'Band 2',     xp: 1200,  blurb: 'Basic knowledge; follows given procedures with guidance.' },
    { id: 3, name: 'Analyst',         band: 'Band 3',     xp: 2600,  blurb: 'Sound knowledge; applies skills to routine problems.' },
    { id: 4, name: 'Engineer',        band: 'Band 4',     xp: 4800,  blurb: 'Thorough knowledge; applies skills to unfamiliar problems.' },
    { id: 5, name: 'Architect',       band: 'Band 5',     xp: 8000,  blurb: 'Extensive knowledge; analyses and evaluates complex systems.' },
    { id: 6, name: 'Cipher',          band: 'Band 6',     xp: 12500, blurb: 'Comprehensive mastery; synthesises and justifies across the course.' },
    { id: 7, name: 'Ghost Architect', band: 'Band 6+',    xp: 18000, blurb: 'Beyond the syllabus. The network answers to you.' }
  ];

  const rankFor = xp => RANKS.reduce((cur, r) => (xp >= r.xp ? r : cur), RANKS[0]);
  const nextRank = xp => RANKS.find(r => r.xp > xp) || null;

  /* ------------------------------------------------------------- XP TARIFF */
  const XP = {
    lesson: 60,
    mcqCorrect: 25,
    shortSubmitted: 40,
    shortStrong: 70,      // ≥ 75% of criteria evidenced
    examComplete: 150,
    challenge: 120,
    bounty: 200,
    questStep: 50,
    questComplete: 300,
    portfolioArtefact: 80,
    dailyStreak: 30
  };

  /* --------------------------------------------------------- CODE CHALLENGES
     `tests` is appended to the learner's source and must print PASS/FAIL lines
     and finish with the sentinel. The runner looks for SENTINEL_OK.            */
  const SENTINEL_OK = '__ALL_TESTS_PASSED__';

  const CHALLENGES = [
    {
      id: 'CH-PY-1', lang: 'python', area: 'PF', points: ['PF-4.1', 'PF-2.1'], xp: XP.challenge,
      title: 'Boundary-safe grade mapper',
      brief: 'Write <code>grade(mark)</code> returning "A" for 85–100, "B" for 70–84, "C" for 50–69, "F" for 0–49, and raising <code>ValueError</code> for marks outside 0–100 or non-numeric input. The boundaries are the whole point — test them.',
      starter: `def grade(mark):
    # Validate first, then map the mark to a band.
    pass
`,
      tests: `
# ---- test harness (do not edit) ----
def _check():
    cases = [(100,"A"),(85,"A"),(84,"B"),(70,"B"),(69,"C"),(50,"C"),(49,"F"),(0,"F")]
    ok = True
    for value, expected in cases:
        try:
            actual = grade(value)
        except Exception as e:
            actual = "raised " + type(e).__name__
        passed = actual == expected
        ok = ok and passed
        print(("PASS " if passed else "FAIL ") + f"grade({value}) -> {actual}  expected {expected}")
    for bad in [-1, 101, "x", None]:
        try:
            grade(bad)
            print(f"FAIL grade({bad!r}) should raise ValueError")
            ok = False
        except ValueError:
            print(f"PASS grade({bad!r}) raised ValueError")
        except Exception as e:
            print(f"FAIL grade({bad!r}) raised {type(e).__name__}, expected ValueError")
            ok = False
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      hints: [
        'Validate the type before comparing — <code>isinstance(mark, bool)</code> is True for ints, so exclude bools if you want to be strict.',
        'Order your comparisons from the highest band down so each branch only needs one condition.',
        'Remember 85 is an "A" and 84 is a "B" — use >= not >.'
      ]
    },
    {
      id: 'CH-PY-2', lang: 'python', area: 'PF', points: ['PF-4.2'], xp: XP.challenge,
      title: 'Stack-based bracket validator',
      brief: 'Implement <code>balanced(text)</code> returning True when every <code>( [ {</code> is closed by the matching bracket in the correct order. Use a stack — this is the canonical LIFO application.',
      starter: `def balanced(text):
    pass
`,
      tests: `
def _check():
    cases = [("(a[b]{c})", True), ("([)]", False), ("", True), ("(((", False),
             ("}{", False), ("{[()()]}", True), ("no brackets here", True)]
    ok = True
    for value, expected in cases:
        try:
            actual = balanced(value)
        except Exception as e:
            actual = "raised " + type(e).__name__
        passed = actual == expected
        ok = ok and passed
        print(("PASS " if passed else "FAIL ") + f"balanced({value!r}) -> {actual}  expected {expected}")
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      hints: [
        'Push every opening bracket; on a closing bracket, pop and compare.',
        'A closing bracket when the stack is empty is an immediate False.',
        'At the end the stack must be empty, or some brackets were never closed.'
      ]
    },
    {
      id: 'CH-PY-3', lang: 'python', area: 'OOP', points: ['OOP-1.1', 'OOP-2.1'], xp: XP.challenge,
      title: 'Encapsulated BankAccount',
      brief: 'Build a <code>BankAccount</code> class with a private balance. <code>deposit(amount)</code> and <code>withdraw(amount)</code> must reject non-positive amounts and overdrafts by raising <code>ValueError</code>; <code>get_balance()</code> returns the balance. Then subclass it as <code>SavingsAccount</code> with <code>add_interest(rate)</code>.',
      starter: `class BankAccount:
    def __init__(self, owner, balance=0):
        pass


class SavingsAccount(BankAccount):
    pass
`,
      tests: `
def _check():
    ok = True
    def expect(label, cond):
        nonlocal ok
        ok = ok and cond
        print(("PASS " if cond else "FAIL ") + label)

    a = BankAccount("Nia", 100)
    expect("starting balance is 100", a.get_balance() == 100)
    a.deposit(50)
    expect("deposit(50) -> 150", a.get_balance() == 150)
    a.withdraw(30)
    expect("withdraw(30) -> 120", a.get_balance() == 120)
    for bad in [0, -10]:
        try:
            a.deposit(bad); expect(f"deposit({bad}) rejected", False)
        except ValueError:
            expect(f"deposit({bad}) raises ValueError", True)
    try:
        a.withdraw(99999); expect("overdraft rejected", False)
    except ValueError:
        expect("overdraft raises ValueError", True)
    expect("balance is not a public attribute",
           not any(k == "balance" for k in vars(a)))
    s = SavingsAccount("Kai", 1000)
    s.add_interest(5)
    expect("SavingsAccount inherits deposit", hasattr(s, "deposit"))
    expect("add_interest(5) on 1000 -> 1050", abs(s.get_balance() - 1050) < 0.001)
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      hints: [
        'Name the attribute <code>self.__balance</code> — the double underscore triggers name mangling, so it is not accessible as <code>a.balance</code>.',
        'SavingsAccount should call <code>super().__init__(owner, balance)</code>.',
        'add_interest can reuse deposit() rather than touching the private attribute directly.'
      ]
    },
    {
      id: 'CH-JS-1', lang: 'javascript', area: 'WEB', points: ['SSA-2.7', 'WEB-2.16'], xp: XP.challenge,
      title: 'Escape it before you print it',
      brief: 'Implement <code>escapeHTML(str)</code> that neutralises <code>&amp; &lt; &gt; " \'</code> so untrusted text can be safely inserted into a page. This is the output-encoding half of XSS defence.',
      starter: `function escapeHTML(str) {
  // return a string that is safe to insert into HTML
}
`,
      tests: `
(function () {
  let ok = true;
  const cases = [
    ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'],
    ['Tom & Jerry', 'Tom &amp; Jerry'],
    ['say "hi"', 'say &quot;hi&quot;'],
    ["it's fine", 'it&#39;s fine'],
    ['plain text', 'plain text']
  ];
  for (const [input, expected] of cases) {
    let actual;
    try { actual = escapeHTML(input); } catch (e) { actual = 'threw ' + e.message; }
    const pass = actual === expected;
    ok = ok && pass;
    console.log((pass ? 'PASS ' : 'FAIL ') + JSON.stringify(input) + ' -> ' + JSON.stringify(actual));
  }
  console.log(ok ? '${SENTINEL_OK}' : 'TESTS FAILED');
})();`,
      hints: [
        'Replace <code>&amp;</code> first, otherwise you double-escape the entities you just inserted.',
        'Use a replacement map and a single regex, or chained .replace() calls in the right order.',
        'The apostrophe must become <code>&amp;#39;</code> exactly.'
      ]
    },
    {
      id: 'CH-JS-2', lang: 'javascript', area: 'AUT', points: ['AUT-2.1', 'AUT-1.6'], xp: XP.challenge,
      title: 'Least-squares in JavaScript',
      brief: 'Implement <code>linearRegression(xs, ys)</code> returning <code>{ m, b, predict }</code> — the gradient, intercept and a prediction function for the line of best fit.',
      starter: `function linearRegression(xs, ys) {
  // return { m, b, predict: x => ... }
}
`,
      tests: `
(function () {
  let ok = true;
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  const model = linearRegression([1,2,3,4,5], [3,5,7,9,11]);
  const checks = [
    ['gradient m is 2', near(model.m, 2)],
    ['intercept b is 1', near(model.b, 1)],
    ['predict(10) is 21', near(model.predict(10), 21)]
  ];
  const noisy = linearRegression([0,1,2,3], [1,3,5,8]);
  checks.push(['handles noisy data (m ≈ 2.3)', Math.abs(noisy.m - 2.3) < 0.05]);
  for (const [label, pass] of checks) {
    ok = ok && pass;
    console.log((pass ? 'PASS ' : 'FAIL ') + label);
  }
  console.log(ok ? '${SENTINEL_OK}' : 'TESTS FAILED');
})();`,
      hints: [
        'm = Σ((x−x̄)(y−ȳ)) / Σ((x−x̄)²)',
        'b = ȳ − m·x̄',
        'Return predict as an arrow function closing over m and b.'
      ]
    },
    {
      id: 'CH-PY-4', lang: 'python', area: 'MEC', points: ['MEC-2.1', 'MEC-3.4', 'MEC-3.8'], xp: XP.challenge,
      title: 'Closed-loop controller with a dead band',
      brief: 'Write <code>control(measured, setpoint=22.0, kp=4.0, band=0.3)</code> returning the actuator power 0–100. Inside the dead band return 0; otherwise return <code>kp * error</code> clamped to 0–100. Negative error (too hot) means no heating.',
      starter: `def control(measured, setpoint=22.0, kp=4.0, band=0.3):
    pass
`,
      tests: `
def _check():
    ok = True
    cases = [(22.0, 0), (21.9, 0), (22.4, 0), (18.0, 16.0), (0.0, 88.0), (-5.0, 100), (30.0, 0)]
    for measured, expected in cases:
        try:
            actual = control(measured)
        except Exception as e:
            actual = "raised " + type(e).__name__
        passed = isinstance(actual, (int, float)) and abs(actual - expected) < 0.001
        ok = ok and passed
        print(("PASS " if passed else "FAIL ") + f"control({measured}) -> {actual}  expected {expected}")
    repeat = [control(18.0) for _ in range(5)]
    rep_ok = len(set(repeat)) == 1
    ok = ok and rep_ok
    print(("PASS " if rep_ok else "FAIL ") + "repeatable: same input gives same output")
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      hints: [
        'error = setpoint − measured.',
        'If abs(error) &lt; band, return 0 before doing anything else.',
        'Clamp with <code>max(0, min(100, kp * error))</code> so an over-temperature never drives the heater.'
      ]
    }
  ];

  /* ------------------------------------------------------------- BOUNTIES
     Bug bounty: the code is supplied already broken or vulnerable. The learner
     patches it until the (hidden-from-edit) test harness passes.              */
  const BOUNTIES = [
    {
      id: 'BB-01', lang: 'python', severity: 'HIGH', area: 'PF', points: ['PF-4.7', 'PF-4.5'],
      xp: XP.bounty, title: 'Off-by-one in the averaging routine',
      report: 'TICKET #4417 — Reports Service\nStudents are seeing their reported average mark come out LOW by roughly one mark’s worth. Finance says the same routine under-reports fee averages. Routine has been in production for 11 months. Patch it.',
      starter: `def average_mark(marks):
    total = 0
    for i in range(1, len(marks)):
        total = total + marks[i]
    return total / len(marks)
`,
      tests: `
def _check():
    ok = True
    cases = [([50,60,70,80], 65.0), ([100], 100.0), ([0,0,0], 0.0), ([1,2], 1.5)]
    for data, expected in cases:
        try:
            actual = average_mark(list(data))
        except Exception as e:
            actual = "raised " + type(e).__name__
        passed = isinstance(actual, (int, float)) and abs(actual - expected) < 1e-9
        ok = ok and passed
        print(("PASS " if passed else "FAIL ") + f"average_mark({data}) -> {actual}  expected {expected}")
    try:
        average_mark([])
        print("FAIL empty list should raise ValueError, not divide by zero")
        ok = False
    except ValueError:
        print("PASS empty list raises ValueError")
    except ZeroDivisionError:
        print("FAIL empty list raises ZeroDivisionError — handle it")
        ok = False
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      debrief: 'A logic error: <code>range(1, len(marks))</code> skips index 0, yet the divisor still counts it. Production logic errors are the hardest class to detect because nothing crashes — only a desk check or a test with a known expected value exposes them. The empty-list case is a separate runtime error that defensive code must handle.'
    },
    {
      id: 'BB-02', lang: 'python', severity: 'CRITICAL', area: 'SSA', points: ['SSA-2.7', 'SSA-2.10'],
      xp: XP.bounty, title: 'Injection in the login lookup',
      report: 'TICKET #5102 — SecureNotes Auth\nPEN TEST FINDING: submitting the username  admin\' --  authenticates as admin without a password. Build the query safely and validate input. The fake `db` object below rejects any query containing concatenated user data.',
      starter: `class db:
    """Simulated driver: execute(sql, params) is the safe path."""
    USERS = {"admin": "hash:correct", "nia": "hash:pw2"}
    @staticmethod
    def execute(sql, params=None):
        if params is None:
            raise RuntimeError("UNSAFE: query ran without parameters -> " + sql)
        if "'" in sql or '"' in sql:
            raise RuntimeError("UNSAFE: user data concatenated into SQL -> " + sql)
        name = params[0]
        return [(name, db.USERS[name])] if name in db.USERS else []


def find_user(username):
    sql = "SELECT name, pwhash FROM users WHERE name = '" + str(username) + "'"
    return db.execute(sql)
`,
      tests: `
def _check():
    ok = True
    def expect(label, cond):
        nonlocal ok
        ok = ok and cond
        print(("PASS " if cond else "FAIL ") + label)

    try:
        rows = find_user("nia")
        expect("legitimate lookup returns the user", rows and rows[0][0] == "nia")
    except Exception as e:
        expect("legitimate lookup returns the user (got " + type(e).__name__ + ")", False)

    try:
        rows = find_user("admin' --")
        expect("injection payload returns no user", rows == [])
    except RuntimeError as e:
        expect("injection payload blocked by driver: " + str(e)[:40], False)
    except ValueError:
        expect("injection payload rejected by validation", True)

    try:
        rows = find_user("nope")
        expect("unknown user returns empty list", rows == [])
    except ValueError:
        expect("unknown user returns empty list", True)
    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      debrief: 'The fix is parameterisation: <code>db.execute("SELECT name, pwhash FROM users WHERE name = ?", (username,))</code>. The driver then treats the username strictly as data, so <code>admin\' --</code> is searched for literally and matches nothing. Validation (type, length, allowed characters) is defence in depth, but parameterisation is the control that actually closes the vulnerability — never try to fix injection by filtering quotes.'
    },
    {
      id: 'BB-03', lang: 'javascript', severity: 'HIGH', area: 'SSA', points: ['SSA-2.10', 'SSA-2.7'],
      xp: XP.bounty, title: 'Stored XSS in the comment renderer',
      report: 'TICKET #5310 — Community Feed\nA user posted a comment containing a <script> tag. Every visitor to the page then had their session token POSTed to an external host. renderComment() builds HTML from untrusted input. Patch it so no executable markup survives, while ordinary text still renders.',
      starter: `function renderComment(author, body) {
  return '<div class="c"><b>' + author + '</b>: ' + body + '</div>';
}
`,
      tests: `
(function () {
  let ok = true;
  const expect = (label, cond) => { ok = ok && cond; console.log((cond ? 'PASS ' : 'FAIL ') + label); };

  const evil = renderComment('hacker', '<script>steal(document.cookie)</script>');
  expect('no raw <script> survives', !/<script/i.test(evil));
  expect('script content is escaped', evil.includes('&lt;script&gt;'));

  const attr = renderComment('x" onmouseover="steal()', 'hi');
  expect('attribute-breaking quotes escaped', !attr.includes('onmouseover="steal()"'));

  const img = renderComment('a', '<img src=x onerror=steal()>');
  expect('no raw <img> tag survives', !/<img/i.test(img));

  const plain = renderComment('Nia', 'Great work on the project!');
  expect('ordinary text still renders', plain.includes('Nia') && plain.includes('Great work on the project!'));
  expect('wrapper markup still present', plain.startsWith('<div class="c">'));

  console.log(ok ? '${SENTINEL_OK}' : 'TESTS FAILED');
})();`,
      debrief: 'Stored XSS: the payload is saved once and executes in every subsequent visitor’s browser, which is why it rates higher than reflected XSS. The patch is output encoding — escape <code>&amp; &lt; &gt; " \'</code> on every untrusted value at the point it enters HTML. In production, pair this with a Content-Security-Policy that forbids inline script, and prefer <code>textContent</code> over <code>innerHTML</code> so the browser never parses the value as markup.'
    },
    {
      id: 'BB-04', lang: 'javascript', severity: 'MEDIUM', area: 'SSA', points: ['SSA-2.10', 'SSA-2.9'],
      xp: XP.bounty, title: 'Predictable session identifiers',
      report: 'TICKET #5288 — Session Service\nAn auditor logged in as user 41, changed one character of their session cookie and was served user 42’s account. Session IDs must be unguessable. Fix newSession() — and keep lookups working.',
      starter: `const SESSIONS = {};

function newSession(userId) {
  const id = 'sess-' + userId;      // <-- predictable
  SESSIONS[id] = { userId, created: Date.now() };
  return id;
}

function lookup(id) {
  return SESSIONS[id] || null;
}
`,
      tests: `
(function () {
  let ok = true;
  const expect = (label, cond) => { ok = ok && cond; console.log((cond ? 'PASS ' : 'FAIL ') + label); };

  const a = newSession(41), b = newSession(42), c = newSession(41);
  expect('ids are unique per session', a !== b && a !== c && b !== c);
  expect('id is not built from the user id', !a.startsWith('sess-') && !/^[^0-9]*4[12][^0-9]*$/.test(a));
  expect('id is long enough to resist guessing (>= 24 chars)', a.length >= 24);
  expect('id uses a varied character set', new Set(a.replace(/[^a-z0-9]/gi, '')).size >= 10);
  // consecutive user ids must not produce near-identical session ids
  const differing = (x, y) => {
    let d = Math.abs(x.length - y.length);
    for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) d++;
    return d;
  };
  expect('ids for adjacent user ids are unrelated', differing(a, b) >= 8);
  expect('lookup still resolves the session', lookup(a) && lookup(a).userId === 41);
  expect('unknown id returns null', lookup('sess-9999') === null);

  const ids = new Set();
  for (let i = 0; i < 200; i++) ids.add(newSession(7));
  expect('200 sessions for one user are all distinct', ids.size === 200);

  console.log(ok ? '${SENTINEL_OK}' : 'TESTS FAILED');
})();`,
      debrief: 'Broken session management. A session identifier derived from the user id carries no entropy, so enumeration is trivial. Generate at least 128 bits from a cryptographically secure source (<code>crypto.getRandomValues</code> or <code>crypto.randomUUID()</code>), regenerate the id on login to defeat session fixation, and set the cookie <code>HttpOnly; Secure; SameSite=Strict</code> with an expiry. <code>Math.random()</code> is not a security-grade source, though it will satisfy these tests.'
    },
    {
      id: 'BB-05', lang: 'python', severity: 'HIGH', area: 'SSA', points: ['SSA-2.11', 'SSA-2.7'],
      xp: XP.bounty, title: 'Path traversal in the file download endpoint',
      report: 'TICKET #5419 — Document Service\nA researcher requested ../../etc/passwd through the download endpoint and received it. Restrict reads to the uploads directory and to approved file types, without breaking legitimate filenames.',
      starter: `import posixpath

ALLOWED = {".pdf", ".png", ".txt"}
VIRTUAL_FS = {
    "/srv/uploads/report.pdf": "quarterly report",
    "/srv/uploads/logo.png": "binary",
    "/etc/passwd": "root:x:0:0:SECRET",
}

def read_file(path):
    """Models the real file system: the OS resolves '..' before opening.
    Do not edit this function — fix download() instead."""
    return VIRTUAL_FS.get(posixpath.normpath(path), "not found")

def download(filename):
    return read_file("/srv/uploads/" + filename)
`,
      tests: `
def _check():
    ok = True
    def expect(label, cond):
        nonlocal ok
        ok = ok and cond
        print(("PASS " if cond else "FAIL ") + label)

    try:
        expect("legitimate file still downloads", download("report.pdf") == "quarterly report")
    except Exception as e:
        expect("legitimate file still downloads (raised " + type(e).__name__ + ")", False)

    for payload in ["../../etc/passwd", "..%2f..%2fetc%2fpasswd", "/etc/passwd",
                    "subdir/../../etc/passwd", "....//....//etc/passwd"]:
        try:
            out = download(payload)
            blocked = "SECRET" not in str(out)
        except (ValueError, PermissionError, FileNotFoundError):
            blocked = True
        except Exception:
            blocked = False
        expect("traversal blocked: " + payload, blocked)

    try:
        out = download("script.exe")
        expect("disallowed extension refused", "not found" in str(out).lower() or out is None)
    except (ValueError, PermissionError):
        expect("disallowed extension refused", True)

    print("${SENTINEL_OK}" if ok else "TESTS FAILED")
_check()`,
      debrief: 'Path traversal (a file attack, SSA-2.11). Never build a path by concatenating user input. Take the basename only, reject any input containing separators, dots-dots or encoded equivalents, check the extension against an allow-list, then canonicalise the final path and verify it still sits inside the uploads directory before reading. Storing uploads outside the web root and serving them through this checked endpoint is the correct architecture.'
    }
  ];

  /* ---------------------------------------------------------------- QUESTS
     Step kinds: lesson | question | challenge | bounty | portfolio | exam     */
  const QUESTS = [
    {
      id: 'Q-Y12-01', year: 12, title: 'Cold Boot', codename: 'OPERATION COLD BOOT',
      brief: '03:14. The SecureNotes platform is live with 48 000 users and has never had a security review. You have been granted read access to the architecture and the auth service. Establish what is broken before someone else does.',
      area: 'SSA',
      steps: [
        { kind: 'lesson', ref: 'SSA-L1', label: 'Brief yourself on the six security concepts' },
        { kind: 'question', ref: 'SSA-Q1', label: 'Identify the control in the hospital audit log' },
        { kind: 'question', ref: 'SSA-Q3', label: 'Analyse the SecureNotes architecture (Figure E1)' },
        { kind: 'bounty', ref: 'BB-02', label: 'Patch the injection in the login lookup' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-COLDBOOT' },
      outro: 'Five findings logged, one patched. The architecture diagram is now an incident report. Next time you see a login flow, you will see it the way an attacker does.'
    },
    {
      id: 'Q-Y12-02', year: 12, title: 'Signal Intercept', codename: 'OPERATION SIGNAL INTERCEPT',
      brief: 'Traffic from the council rates portal is crossing the network unencrypted and the accessibility complaints are stacking up. Trace the data path end to end, then harden what you find.',
      area: 'WEB',
      steps: [
        { kind: 'lesson', ref: 'WEB-L1', label: 'Map how data crosses the internet' },
        { kind: 'question', ref: 'WEB-Q2', label: 'Trace a request from keystroke to first byte' },
        { kind: 'lesson', ref: 'WEB-L2', label: 'Study the TLS handshake' },
        { kind: 'question', ref: 'WEB-Q5', label: 'Explain the handshake (Figure)' },
        { kind: 'challenge', ref: 'CH-JS-1', label: 'Ship the output encoder' },
        { kind: 'bounty', ref: 'BB-03', label: 'Kill the stored XSS in the comment feed' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-SIGNAL' },
      outro: 'Channel secured. You can now explain every hop between a keypress and a rendered page — and why each hop needs its own control.'
    },
    {
      id: 'Q-Y12-03', year: 12, title: 'Ghost in the Dataset', codename: 'OPERATION GHOST',
      brief: 'A hiring model is quietly rejecting people. Management call it "the algorithm". You are going to call it what it is, and prove it with the data.',
      area: 'AUT',
      steps: [
        { kind: 'lesson', ref: 'AUT-L1', label: 'Separate AI from ML' },
        { kind: 'lesson', ref: 'AUT-L2', label: 'Build the regression model' },
        { kind: 'challenge', ref: 'CH-JS-2', label: 'Implement least-squares from scratch' },
        { kind: 'question', ref: 'AUT-Q3', label: 'Interpret the regression output' },
        { kind: 'question', ref: 'AUT-Q4', label: 'Investigate bias in the hiring model' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-GHOST' },
      outro: 'You proved a model can be accurate in aggregate and unjust in detail. That distinction is worth a Band 6 paragraph.'
    },
    {
      id: 'Q-Y12-04', year: 12, title: 'Deadline Protocol', codename: 'OPERATION DEADLINE',
      brief: 'Your own major project is the system under test now. Specify it, choose a methodology you can defend, and put the evidence on the record.',
      area: 'SEP',
      steps: [
        { kind: 'lesson', ref: 'SEP-L1', label: 'Identify and define the problem' },
        { kind: 'question', ref: 'SEP-Q5', label: 'Write the canteen requirements' },
        { kind: 'portfolio', ref: 'requirements', label: 'Complete your own requirements artefact' },
        { kind: 'lesson', ref: 'SEP-L2', label: 'Compare Waterfall, Agile and WAgile' },
        { kind: 'question', ref: 'SEP-Q2', label: 'Justify WAgile for the fare app' },
        { kind: 'portfolio', ref: 'methodology', label: 'Record and justify your own methodology' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-DEADLINE' },
      outro: 'Scope defined, approach justified, evidence filed. The project is now a managed system rather than a hope.'
    },
    {
      id: 'Q-Y12-05', year: 12, title: 'Full Spectrum', codename: 'OPERATION FULL SPECTRUM',
      brief: 'Final readiness check. One examination under live conditions, across every Year 12 focus area. No hints, no pausing, no second attempt at a question.',
      area: null,
      locked: { minRank: 3 },
      steps: [
        { kind: 'exam', ref: 'y12-full', label: 'Sit the Year 12 trial under HSC conditions' },
        { kind: 'bounty', ref: 'BB-05', label: 'Close the path traversal before release' }
      ],
      reward: { xp: XP.questComplete + 200, asset: 'AS-SPECTRUM' },
      outro: 'Full spectrum clear. Diagnostics updated — check the gap report for whatever the paper exposed.'
    },

    /* --- Year 11 missions: same mechanics, standard presentation --------- */
    {
      id: 'Q-Y11-01', year: 11, title: 'First Build', codename: 'Module 1 — First Build',
      brief: 'Work through the development steps, design an algorithm, and get your first fully tested function running in the code lab.',
      area: 'PF',
      steps: [
        { kind: 'lesson', ref: 'PF-L1', label: 'Learn the eight development steps' },
        { kind: 'lesson', ref: 'PF-L2', label: 'Design structured algorithms' },
        { kind: 'question', ref: 'PF-Q4', label: 'Desk check the Mystery algorithm' },
        { kind: 'challenge', ref: 'CH-PY-1', label: 'Build the boundary-safe grade mapper' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-FIRSTBUILD' },
      outro: 'You designed before you coded, then proved the boundaries. That order is the whole subject in miniature.'
    },
    {
      id: 'Q-Y11-02', year: 11, title: 'Objects in Motion', codename: 'Module 2 — Objects in Motion',
      brief: 'Move from procedures to objects: model a system with classes, protect its data, and test it properly.',
      area: 'OOP',
      steps: [
        { kind: 'lesson', ref: 'OOP-L1', label: 'Apply the key features of OOP' },
        { kind: 'question', ref: 'OOP-Q2', label: 'Fix the unencapsulated bank account' },
        { kind: 'challenge', ref: 'CH-PY-3', label: 'Build the encapsulated BankAccount' },
        { kind: 'lesson', ref: 'OOP-L3', label: 'Testing methodologies and collaboration' },
        { kind: 'question', ref: 'OOP-Q5', label: 'Evaluate a team’s version control history' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-OBJECTS' },
      outro: 'Encapsulation, inheritance, polymorphism — demonstrated in working code rather than quoted from a glossary.'
    },
    {
      id: 'Q-Y11-03', year: 11, title: 'Closing the Loop', codename: 'Module 3 — Closing the Loop',
      brief: 'Integrate hardware and software: read the sensors, drive the actuators, and make the control loop stable and repeatable.',
      area: 'MEC',
      steps: [
        { kind: 'lesson', ref: 'MEC-L1', label: 'Understand the hardware' },
        { kind: 'lesson', ref: 'MEC-L2', label: 'Open and closed loop control' },
        { kind: 'question', ref: 'MEC-Q3', label: 'Diagnose the chattering heater' },
        { kind: 'challenge', ref: 'CH-PY-4', label: 'Implement the dead-band controller' },
        { kind: 'question', ref: 'MEC-Q2', label: 'Size the battery for the sorter' }
      ],
      reward: { xp: XP.questComplete, asset: 'AS-LOOP' },
      outro: 'Stable, bounded, repeatable. A control algorithm that only works once is not a control algorithm.'
    }
  ];

  /* -------------------------------------------------------- UNLOCKABLE ASSETS
     kind: theme | badge | tool | avatar — unlocked by quest, rank or counter. */
  const ASSETS = [
    { id: 'AS-FIRSTBUILD', kind: 'badge',  name: 'First Build',          icon: '▣', desc: 'Completed your first full mission chain.', how: 'Finish Module 1 — First Build.' },
    { id: 'AS-OBJECTS',    kind: 'badge',  name: 'Class Act',            icon: '◳', desc: 'Modelled and tested a class hierarchy.', how: 'Finish Module 2 — Objects in Motion.' },
    { id: 'AS-LOOP',       kind: 'badge',  name: 'Loop Closed',          icon: '◉', desc: 'Built a stable closed-loop controller.', how: 'Finish Module 3 — Closing the Loop.' },
    { id: 'AS-COLDBOOT',   kind: 'theme',  name: 'Amber CRT',            icon: '▮', desc: 'Amber phosphor skin for the ops centre.', how: 'Complete OPERATION COLD BOOT.' },
    { id: 'AS-SIGNAL',     kind: 'theme',  name: 'Ice Blue',             icon: '❖', desc: 'Cold-channel skin for the ops centre.', how: 'Complete OPERATION SIGNAL INTERCEPT.' },
    { id: 'AS-GHOST',      kind: 'avatar', name: 'Ghost Mask',           icon: '◬', desc: 'Profile sigil for the bias investigation.', how: 'Complete OPERATION GHOST.' },
    { id: 'AS-DEADLINE',   kind: 'tool',   name: 'Gantt Overlay',        icon: '▦', desc: 'Milestone overlay unlocked on the project board.', how: 'Complete OPERATION DEADLINE.' },
    { id: 'AS-SPECTRUM',   kind: 'theme',  name: 'Redline',              icon: '◆', desc: 'High-alert skin. Earned under exam conditions.', how: 'Complete OPERATION FULL SPECTRUM.' },
    { id: 'AS-HUNTER',     kind: 'badge',  name: 'Bounty Hunter',        icon: '✸', desc: 'Three bug bounties closed.', how: 'Close 3 bug bounties.', auto: s => (s.bounties || []).length >= 3 },
    { id: 'AS-ZERODAY',    kind: 'badge',  name: 'Zero Day',             icon: '✺', desc: 'Every bug bounty on the board closed.', how: 'Close all bug bounties.', auto: s => (s.bounties || []).length >= BOUNTIES.length },
    { id: 'AS-CLEANRUN',   kind: 'badge',  name: 'Clean Run',            icon: '✔', desc: 'Finished an exam under HSC conditions without pausing.', how: 'Complete a conditions-mode exam.', auto: s => (s.exams || []).some(e => e.conditions) },
    { id: 'AS-CARTOGRAPH', kind: 'badge',  name: 'Cartographer',         icon: '◍', desc: 'Mastery recorded against 50 syllabus dot points.', how: 'Reach 50 mastered dot points.', auto: s => Object.values(s.mastery || {}).filter(m => m.score >= 2).length >= 50 },
    { id: 'AS-ARCHIVIST',  kind: 'badge',  name: 'Archivist',            icon: '▤', desc: 'Six portfolio artefacts completed.', how: 'Complete 6 portfolio artefacts.', auto: s => Object.values(s.portfolio || {}).filter(v => v && v.complete).length >= 6 },
    { id: 'AS-ARCHITECT',  kind: 'avatar', name: 'Architect Sigil',      icon: '⬡', desc: 'Awarded on reaching the Architect rank.', how: 'Reach rank Architect (Band 5).', auto: s => (s.xp || 0) >= 8000 }
  ];

  const assetById = id => ASSETS.find(a => a.id === id);
  const questById = id => QUESTS.find(q => q.id === id);
  const challengeById = id => CHALLENGES.find(c => c.id === id);
  const bountyById = id => BOUNTIES.find(b => b.id === id);

  A.Game = {
    RANKS, XP, CHALLENGES, BOUNTIES, QUESTS, ASSETS, SENTINEL_OK,
    rankFor, nextRank, assetById, questById, challengeById, bountyById
  };
})(window.APP = window.APP || {});
