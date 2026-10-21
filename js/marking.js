/* ===========================================================================
   marking.js — criterion-referenced marking for written responses
   ---------------------------------------------------------------------------
   Two layers work together:

   1. RUBRIC     Each criterion carries a mark value and a cognitive level
                 (Knowledge → Description → Explanation → Analysis →
                 Judgement), inferred from its own wording unless the question
                 states otherwise. Criteria can require several ideas together
                 (`all`), two ideas in proximity (`near`) or any of a set of
                 alternatives (`kw`).

   2. STRUCTURE  What the command verb in the stem actually demands. "Compare"
                 requires comparative language about two things; "evaluate"
                 and "justify" require a judgement; "explain" requires
                 causation. A response that name-drops the right terms without
                 doing the thing the verb asks is capped below the top bands —
                 which is exactly how a marker would treat it.

   A library of common misconceptions, attached by syllabus dot point, flags
   statements that are actively wrong rather than merely missing.

   Pure logic, no DOM: the UI and the test harness both call mark().
   =========================================================================== */
(function (A) {
  'use strict';

  /* ------------------------------------------------------- cognitive levels */
  const LEVELS = [
    { id: 1, name: 'Knowledge',   band: 2, test: /^(identif|state|name|list|give|recall|include|show|calculat|convert|select|correct|label|write|trace|provide)/i },
    { id: 2, name: 'Description', band: 3, test: /^(describ|outlin|defin|demonstrat|summaris|represent)/i },
    { id: 3, name: 'Explanation', band: 4, test: /^(explain|account|appl|link|relat|address|note|interpret|us(e|es)\b)/i },
    { id: 4, name: 'Analysis',    band: 5, test: /^(compar|distinguis|analys|investigat|diagnos|propos|modif|rewrit|recommend|contrast|examin)/i },
    { id: 5, name: 'Judgement',   band: 6, test: /^(evaluat|justif|judg|assess|reach|conclud|weigh|argu|critique)/i }
  ];

  /* Baseline level implied by the question's own command verb: the criteria of
     an "evaluate" question sit higher than those of an "identify" question
     even when they are worded as noun phrases. */
  const VERB_LEVEL = {
    evaluate: 4, assess: 4, justify: 4, recommend: 4, critically: 4, discuss: 4,
    compare: 4, contrast: 4, distinguish: 4, differentiate: 4, analyse: 4,
    explain: 3, interpret: 3, investigate: 3, apply: 3, design: 3, develop: 3,
    implement: 3, modify: 3, propose: 3, determine: 3, calculate: 2, represent: 2,
    describe: 2, outline: 2, demonstrate: 2, use: 2, identify: 1
  };

  function levelOf(criterion, q) {
    if (criterion.level) return LEVELS.find(l => l.id === criterion.level) || LEVELS[0];
    const t = String(criterion.t || '').trim();
    // 1. an explicit leading verb is the strongest signal
    for (let i = LEVELS.length - 1; i >= 0; i--) if (LEVELS[i].test.test(t)) return LEVELS[i];
    // 2. otherwise look for level-bearing language anywhere in the criterion
    if (/\b(judge|judgement|justif|evaluat|weigh|conclusion|verdict|recommend)/i.test(t)) return LEVELS[4];
    if (/\b(compar|contrast|distinguis|analys|relationship|trade[- ]off|implication|ramification)/i.test(t)) return LEVELS[3];
    if (/\b(explain|because|cause|reason|why|consequence|effects?\b|impacts?\b)/i.test(t)) return LEVELS[2];
    // 3. fall back to what the question itself demands
    if (q) {
      const base = Math.max(1, ...verbsIn(q.stem).map(v => VERB_LEVEL[v.v] || 2));
      return LEVELS[Math.min(LEVELS.length, base) - 1];
    }
    return LEVELS[1];
  }

  /* --------------------------------------------------------- command verbs */
  const VERBS = [
    { v: 'evaluate',    demands: ['judgement', 'bothsides'] },
    { v: 'assess',      demands: ['judgement', 'bothsides'] },
    { v: 'justify',     demands: ['judgement', 'causation'] },
    { v: 'recommend',   demands: ['judgement'] },
    { v: 'discuss',     demands: ['bothsides'] },
    { v: 'critically',  demands: ['judgement', 'bothsides'] },
    { v: 'compare',     demands: ['comparison'] },
    { v: 'contrast',    demands: ['comparison'] },
    { v: 'distinguish', demands: ['comparison'] },
    { v: 'differentiate', demands: ['comparison'] },
    { v: 'analyse',     demands: ['causation'] },
    { v: 'explain',     demands: ['causation'] },
    { v: 'interpret',   demands: [] },
    { v: 'investigate', demands: [] },
    { v: 'describe',    demands: [] },
    { v: 'outline',     demands: [] },
    { v: 'identify',    demands: [] },
    { v: 'determine',   demands: [] },
    { v: 'apply',       demands: [] },
    { v: 'design',      demands: [] },
    { v: 'develop',     demands: [] },
    { v: 'implement',   demands: [] },
    { v: 'modify',      demands: [] },
    { v: 'propose',     demands: [] },
    { v: 'calculate',   demands: [] },
    { v: 'represent',   demands: [] },
    { v: 'use',         demands: [] }
  ];

  function verbsIn(stem) {
    const s = String(stem || '').toLowerCase();
    const found = VERBS.filter(x => new RegExp('\\b' + x.v, 'i').test(s));
    return found.length ? found : [{ v: 'describe', demands: [] }];
  }

  /* ------------------------------------------------- structural signatures */
  const SIGNALS = {
    comparison: {
      re: /\b(whereas|while|in contrast|unlike|compared (?:to|with)|than|both|however|on the other hand|similarly|by contrast|differ|difference|the same|in common|conversely)\b/i,
      label: 'Comparative language',
      missing: 'This question asks you to compare or distinguish, but the response reads as two separate descriptions. Use comparative language — “whereas”, “in contrast”, “both … but” — so the relationship between them is explicit.',
      cap: 0.70
    },
    /* Judgement covers an explicit verdict, a recommendation, and prescriptive
       language — "the fix is to parameterise the query" is a recommendation
       even though the word "recommend" never appears. These signals reward
       the thinking, so they are written generously: wrongly penalising a good
       answer costs the learner far more than crediting a borderline one. */
    judgement: {
      re: /\b(?:overall|on balance|therefore|in conclusion|i would|we should|recommend\w*|should\s+(?:be|use|have|not|also|therefore)?|must\s+(?:be|also|first|therefore|not)?|needs? to|the fix is|the solution is|worth it|worth \w+ing|rather than|outweigh\w*|preferable|conclude|justified|unacceptable|not fit|fit for|fails? to meet|does not (?:meet|satisfy)|best (?:suited|understood|described|option|choice|approach)|well suited|most (?:appropriate|suitable|effective|important)|(?:is|are|was|were)\s+(?:far |much |clearly |simply |genuinely )?(?:better|worse|more \w+|less \w+|inefficient|ineffective|inadequate|insufficient|unacceptable|appropriate|inappropriate|incorrect|correct|right|wrong|unfit|unsafe|dangerous|negligent))\b/i,
      label: 'A stated judgement',
      missing: 'Evaluate, assess, justify and recommend all require a position, not just information. State your verdict or recommendation explicitly and show what it rests on.',
      cap: 0.70
    },
    causation: {
      re: /(?:,\s*so\b)|\b(?:because|since|so that|so\s+(?:it|the|they|that|a|an|any|no|you|we|i|every|each)|as a result|therefore|thus|hence|means\b|meaning|due to|owing to|consequently|leads? to|causes?|caused|resulting in|results? in|which allows|allowing|enabl\w*|in order to|that is why|which is why|why\b)/i,
      label: 'Causal reasoning',
      missing: 'Explain and analyse require you to show why, not only what. Link cause to effect with “because”, “which means”, “as a result”.',
      cap: 0.80
    },
    /* Advisory only: weighing both sides strengthens a judgement, but a
       genuinely one-sided artefact (a broken commit history, a negligent
       breach) has no upside to concede, so this must not cap the mark. */
    bothsides: {
      re: null,
      advisory: true,
      label: 'Both sides weighed',
      missing: 'Where there is a counter-argument, cost or limitation, acknowledging it before you conclude makes a judgement far more convincing.',
      cap: 1,
      custom: text =>
        /\b(?:advantage|benefit|strength|positive|gain|improv|upside|faster|cheaper|value)\w*\b/i.test(text) &&
        /\b(?:disadvantage|limitation|drawback|weakness|risk|cost|however|but|although|trade[- ]off|downside|except)\w*\b/i.test(text)
    },
    /* Advisory: a specific instance counts whether or not it is announced
       with the words "for example". */
    example: {
      re: /\b(?:for example|e\.g\.|such as|for instance|including)\b/i,
      advisory: true,
      label: 'An announced example',
      missing: 'Naming an example explicitly (“for example…”) makes it obvious to a marker that you have supplied one.',
      cap: 1
    }
  };

  /* ------------------------------------------------- misconception library
     Attached by dot point: any question touching that point is checked.
     Each pattern must be something that is actively WRONG, not merely absent,
     and specific enough not to fire on a correct sentence.                   */
  const MISCONCEPTIONS = [
    { id: 'pw-encrypt', points: ['SSA-2.1', 'SSA-2.2', 'SSA-2.3', 'WEB-1.4', 'SSA-2.10'],
      re: /\b(?:encrypt\w*)\s+(?:the|all|user|their)?\s*passwords?\b|\bpasswords?\b[^.]{0,30}?\bencrypted\b/i,
      unless: /\bhash\w*\b[^.]{0,60}\bpassword|\bpasswords?\b[^.]{0,60}\bhash|\brather than (?:being )?encrypt|\bnot encrypted\b/i,
      penalty: 1,
      message: 'Passwords should be <b>hashed with a per-user salt</b> (bcrypt, Argon2), not encrypted. Encryption is reversible, so anyone with the key recovers every password.' },

    { id: 'hash-is-encryption', points: ['WEB-1.4', 'SSA-2.3'],
      re: /\bhashing\s+(?:is|means)\s+(?:a\s+(?:form|type)\s+of\s+)?encryption\b|\bhash\w*\s+can\s+be\s+decrypted\b/i,
      penalty: 1,
      message: 'Hashing is <b>one-way</b> and cannot be reversed; encryption is two-way. A hash is not a form of encryption.' },

    { id: 'client-validation-secure', points: ['SSA-2.7', 'WEB-2.2', 'WEB-2.10'],
      re: /\bclient[- ]side validation\s+(?:is|provides|ensures|makes)\s+\w*\s*secur/i,
      penalty: 1,
      message: 'Client-side validation is a <b>usability</b> feature. It runs on the user’s machine and can be bypassed entirely, so it is never a security control.' },

    { id: 'escape-quotes-sqli', points: ['SSA-2.7', 'WEB-2.13'],
      re: /\b(?:escap\w*|strip\w*|remov\w*|filter\w*)\s+(?:all\s+)?(?:single\s+)?quotes?\b(?![^.]*parameteris)/i,
      penalty: 1,
      message: 'Filtering quotes is not a reliable fix for SQL injection — encodings and alternative syntax defeat it. <b>Parameterised queries</b> are the control, because the driver never parses user data as SQL.' },

    { id: 'https-protects-stored', points: ['WEB-1.3', 'WEB-1.4', 'SSA-2.2'],
      re: /\bhttps\s+(?:encrypts?|protects?|secures?)\s+(?:the\s+)?(?:database|stored data|data at rest)\b/i,
      penalty: 1,
      message: 'HTTPS protects data <b>in transit</b> only. Data at rest in the database needs its own encryption.' },

    { id: 'agile-no-docs', points: ['SEP-2.2', 'SEP-2.1', 'SEP-2.3', 'PF-4.3'],
      re: /\bagile\s+(?:has|means|requires|involves)\s+no\s+(?:documentation|planning|design)\b/i,
      penalty: 1,
      message: 'Agile values working software <i>over</i> comprehensive documentation — it does not abolish it. Agile projects still plan, design and document, just continuously rather than up front.' },

    { id: 'waterfall-no-testing', points: ['SEP-2.1', 'PF-4.3'],
      re: /\bwaterfall\s+(?:has|does)\s+(?:no|not have any)\s+testing\b/i,
      penalty: 1,
      message: 'Waterfall has a dedicated testing and debugging stage. Its weakness is that testing happens <i>late</i>, not that it is absent.' },

    { id: 'ai-equals-ml', points: ['AUT-1.2', 'AUT-1.1'],
      re: /\b(?:ai|artificial intelligence)\s+(?:is|and|means)\s+(?:the same (?:as|thing)|identical|synonymous)\b/i,
      penalty: 1,
      message: 'ML is a <b>subset</b> of AI. A rule-based expert system is AI with no machine learning at all.' },

    { id: 'sign-bit-flip', points: ['PF-3.2'],
      re: /\b(?:flip|chang|switch|set)\w*\s+(?:the\s+)?(?:first|leftmost|left most|sign)\s+bit\b/i,
      penalty: 1,
      message: 'That describes <b>sign–magnitude</b>, not two’s complement. Two’s complement inverts every bit and adds 1.' },

    { id: 'logic-error-compile', points: ['PF-4.7', 'PF-4.5'],
      re: /\blogic error\w*[^.]{0,40}\b(?:compile|syntax|caught by the compiler|detected by the (?:compiler|ide))\b/i,
      penalty: 1,
      message: 'A logic error produces the wrong result while running perfectly. Nothing detects it automatically — only a desk check or a test with a known expected output exposes it.' },

    { id: 'polymorphism-is-inheritance', points: ['OOP-1.1'],
      re: /\bpolymorphism\s+(?:is|means)\s+(?:when\s+)?(?:a\s+)?(?:class\s+)?inherit/i,
      penalty: 1,
      message: 'Inheritance is how a subclass acquires members; <b>polymorphism</b> is one interface behaving differently depending on the object’s actual class. Inheritance enables it but is not the same thing.' },

    { id: 'encapsulation-is-inheritance', points: ['OOP-1.1'],
      re: /\bencapsulation\s+(?:is|means)\s+(?:when\s+)?(?:a\s+)?(?:class\s+)?inherit/i,
      penalty: 1,
      message: 'Encapsulation is bundling data with its methods and restricting direct access. It is unrelated to inheritance.' },

    { id: 'array-mixed-types', points: ['PF-3.5', 'PF-4.2'],
      re: /\barrays?\s+(?:can|may)\s+(?:hold|store|contain)\s+(?:different|mixed|multiple)\s+data\s+types\b/i,
      penalty: 1,
      message: 'An array is <b>homogeneous</b> — every element shares one data type. A <b>record</b> is the structure that groups fields of different types.' },

    { id: 'open-loop-feedback', points: ['MEC-2.2', 'MEC-3.4'],
      re: /\bopen[- ]loop\b[^.]{0,60}\b(?:uses?|has|with)\s+(?:a\s+)?(?:sensor\s+)?feedback\b/i,
      penalty: 1,
      message: 'An open-loop system does <b>not</b> measure its output — the absence of feedback is what defines it.' },

    { id: 'auth-swap', points: ['SSA-2.1', 'WEB-1.4', 'SSA-2.10'],
      re: /\bauthentication\s+(?:is|means|determines|controls|decides)\b[^.]{0,50}?\b(?:permission|allowed to|access to|can do|privileg)/i,
      unless: /\bauthentication\s+(?:is\s+)?(?:the\s+)?(?:process\s+of\s+)?(?:prov|verif|confirm|establish|identif)/i,
      penalty: 1,
      message: 'That defines <b>authorisation</b>. Authentication proves <i>who you are</i>; authorisation decides <i>what you may do</i>.' }
  ];

  /* ----------------------------------------------------------- band scale */
  const BANDS = [
    { band: 6, min: 0.90, label: 'Band 6', descriptor: 'Comprehensive — extensive knowledge, sustained analysis and a justified judgement.' },
    { band: 5, min: 0.78, label: 'Band 5', descriptor: 'Thorough — detailed knowledge with well-supported analysis.' },
    { band: 4, min: 0.65, label: 'Band 4', descriptor: 'Sound — solid knowledge applied with some analysis.' },
    { band: 3, min: 0.50, label: 'Band 3', descriptor: 'Adequate — largely descriptive, with limited analysis.' },
    { band: 2, min: 0.33, label: 'Band 2', descriptor: 'Basic — some relevant knowledge, undeveloped.' },
    { band: 1, min: 0.00, label: 'Band 1', descriptor: 'Elementary — limited relevant knowledge.' }
  ];
  const bandFor = ratio => BANDS.find(b => ratio >= b.min) || BANDS[BANDS.length - 1];

  /* -------------------------------------------------------- mark weighting
     Base one mark per criterion, then any remaining marks go to the criteria
     demanding the highest-order thinking — a judgement criterion in a 6-mark
     question is worth more than a recall criterion. Where a question has more
     criteria than marks, weights scale proportionally.                       */
  function weights(q) {
    const crits = q.criteria || [];
    const n = crits.length;
    if (!n) return [];
    const lv = crits.map(c => levelOf(c, q));
    const w = crits.map(() => 1);
    let remainder = (q.marks || n) - n;
    if (remainder > 0) {
      const order = crits.map((_, i) => i).sort((a, b) => lv[b].id - lv[a].id || a - b);
      for (let i = 0; remainder > 0; i = (i + 1) % order.length, remainder--) w[order[i]] += 1;
    }
    /* Convert relative weights into displayed marks in half-mark units, using
       largest-remainder allocation so the parts always add up to the whole —
       naive rounding makes four criteria on a 3-mark question show as 4. */
    const total = w.reduce((s, x) => s + x, 0);
    const marksTotal = q.marks || n;
    let halves = marksTotal * 2;
    const exact = w.map(x => (x / total) * halves);
    const base = exact.map(v => Math.max(1, Math.floor(v)));          // at least 0.5 each
    let spent = base.reduce((s, x) => s + x, 0);
    const order = exact
      .map((v, i) => ({ i, rem: v - Math.floor(v) }))
      .sort((a, b) => b.rem - a.rem || lv[b.i].id - lv[a.i].id);
    let k = 0;
    while (spent < halves && order.length) { base[order[k % order.length].i]++; spent++; k++; }
    while (spent > halves) {                                           // over-allocated by the floor of 1
      const shrink = base.map((v, i) => ({ i, v, lvl: lv[i].id }))
        .filter(x => x.v > 1).sort((a, b) => a.lvl - b.lvl || b.v - a.v)[0];
      if (!shrink) break;
      base[shrink.i]--; spent--;
    }
    return w.map((x, i) => ({ weight: base[i], marks: base[i] / 2, level: lv[i] }));
  }

  /* ---------------------------------------------------- criterion matching */
  const norm = t => ' ' + String(t || '').toLowerCase().replace(/\s+/g, ' ') + ' ';
  const has = (hay, term) => hay.indexOf(String(term).toLowerCase()) !== -1;

  function nearby(text, a, b, window) {
    const words = text.toLowerCase().split(/\s+/);
    const ia = [], ib = [];
    words.forEach((w, i) => {
      if (w.indexOf(String(a).toLowerCase()) !== -1) ia.push(i);
      if (w.indexOf(String(b).toLowerCase()) !== -1) ib.push(i);
    });
    return ia.some(x => ib.some(y => Math.abs(x - y) <= (window || 25)));
  }

  function testCriterion(c, hay, raw) {
    if (c.all && c.all.length) {
      if (!c.all.every(k => has(hay, k))) return false;
    }
    if (c.near && c.near.length >= 2) {
      if (!nearby(raw, c.near[0], c.near[1], c.near[2])) return false;
    }
    if (c.kw && c.kw.length) {
      if (!c.kw.some(k => has(hay, k))) return false;
    }
    if (c.notkw && c.notkw.some(k => has(hay, k))) return false;
    return !!(c.all || c.near || c.kw);
  }

  /* ------------------------------------------------------------- the mark */
  /* Realistic HSC response lengths — roughly 30 words per mark once the
     first mark is allowed for. A candidate has about 1.5 minutes per mark in
     the examination, so a model answer far longer than this teaches a length
     no student can actually produce under timed conditions. */
  const WORDS_FOR_MARKS = { 1: 20, 2: 35, 3: 60, 4: 90, 5: 120, 6: 150 };
  function expectedWords(marks) {
    return WORDS_FOR_MARKS[marks] || Math.max(20, marks * 30 - 30);
  }

  function mark(q, text) {
    const raw = String(text || '');
    const hay = norm(raw);
    const words = (raw.trim().match(/\S+/g) || []).length;
    const expect = expectedWords(q.marks);
    const w = weights(q);
    const maxMarks = q.marks;

    /* --- layer 1: rubric ------------------------------------------------ */
    const criteria = (q.criteria || []).map((c, i) => {
      const hit = words > 0 && testCriterion(c, hay, raw);
      return {
        t: c.t,
        hit,
        marks: w[i] ? w[i].marks : 0,
        awarded: hit ? (w[i] ? w[i].marks : 0) : 0,
        weight: w[i] ? w[i].weight : 1,
        level: w[i] ? w[i].level.name : 'Knowledge',
        band: w[i] ? w[i].level.band : 2
      };
    });
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0) || 1;
    const hitWeight = criteria.reduce((s, c) => s + (c.hit ? c.weight : 0), 0);
    let ratio = hitWeight / totalWeight;

    /* --- layer 2: structure --------------------------------------------- */
    const verbs = verbsIn(q.stem);
    const demanded = [...new Set(verbs.reduce((acc, v) => acc.concat(v.demands), []))];
    if (/example/i.test(q.stem || '')) demanded.push('example');

    const structure = [];
    const caps = [];
    demanded.forEach(key => {
      const sig = SIGNALS[key];
      if (!sig) return;
      const ok = words === 0 ? false : (sig.custom ? sig.custom(raw) : sig.re.test(raw));
      structure.push({ id: key, ok, label: sig.label, advisory: !!sig.advisory, message: ok ? null : sig.missing });
      if (!ok && words > 0 && !sig.advisory) caps.push({ reason: sig.label + ' missing', cap: sig.cap });
    });

    /* development: a response far shorter than the marks imply cannot be
       more than partially developed, however many keywords it contains */
    let development = 'appropriate';
    if (words === 0) development = 'empty';
    else if (words < expect * 0.35) {
      development = 'underdeveloped';
      caps.push({ reason: 'Response is much shorter than a ' + q.marks + '-mark answer requires', cap: 0.60 });
    } else if (words < expect * 0.6) {
      development = 'brief';
      caps.push({ reason: 'Response is brief for ' + q.marks + ' marks', cap: 0.85 });
    } else if (words > expect * 3) {
      development = 'long';
    }

    const cap = caps.reduce((lo, c) => Math.min(lo, c.cap), 1);
    const cappedRatio = Math.min(ratio, cap);

    /* --- misconceptions -------------------------------------------------- */
    /* `unless` suppresses a flag when the response elsewhere states the
       correct position — a penalty wrongly applied is worse than one missed. */
    /* Checked against every response, not only questions on the listed dot
       points: "passwords should be encrypted" is wrong wherever a student
       writes it. `points` records where each one is most expected, and the
       patterns are narrow enough — plus `unless`-guarded — that the 102 model
       answers in the bank trip none of them. */
    const misconceptions = words === 0 ? [] : MISCONCEPTIONS.filter(m =>
      m.re.test(raw) && !(m.unless && m.unless.test(raw))
    ).map(m => ({ id: m.id, message: m.message, penalty: m.penalty }));

    /* A cap is a ceiling, so it must not round back up through itself: 70% of
       4 marks is 2.8 and that has to read as 2, not 3. Uncapped responses
       round normally, so a complete answer still earns full marks. */
    const penalty = misconceptions.reduce((s, m) => s + m.penalty, 0);
    const scaled = cappedRatio * maxMarks;
    const base = caps.length ? Math.floor(scaled + 1e-9) : Math.round(scaled);
    let awarded = Math.max(0, base - penalty);
    const finalRatio = maxMarks ? awarded / maxMarks : 0;
    const bandInfo = words === 0 ? BANDS[BANDS.length - 1] : bandFor(finalRatio);

    /* --- advice ---------------------------------------------------------- */
    const advice = [];
    const missed = criteria.filter(c => !c.hit);
    if (missed.length) {
      const top = missed.slice().sort((a, b) => b.band - a.band)[0];
      advice.push('Not yet evidenced: ' + top.t + '.');
    }
    structure.filter(s => !s.ok).forEach(s => advice.push(s.message));
    if (development === 'underdeveloped') {
      advice.push('A ' + q.marks + '-mark response is typically around ' + expect + ' words; yours is ' + words + '.');
    }
    if (development === 'long') {
      advice.push('This is much longer than a ' + q.marks + '-mark response needs. Marks come from addressing each criterion, not from length.');
    }
    if (!missed.length && !caps.length && !misconceptions.length) {
      advice.push('Every criterion is evidenced and the response does what the command verb asks. Compare it with the sample for depth of expression.');
    }

    return {
      criteria,
      structure,
      misconceptions,
      caps,
      verbs: verbs.map(v => v.v),
      demanded,
      awardedMarks: awarded,
      maxMarks,
      ratio: finalRatio,
      rubricRatio: ratio,
      band: bandInfo.band,
      bandLabel: bandInfo.label,
      bandDescriptor: bandInfo.descriptor,
      words,
      expectedWords: expect,
      development,
      advice,
      /* legacy fields so existing callers keep working */
      hits: criteria.filter(c => c.hit).length,
      total: criteria.length,
      marks: awarded
    };
  }

  A.Marking = {
    mark, weights, levelOf, verbsIn, bandFor, expectedWords,
    LEVELS, VERBS, SIGNALS, MISCONCEPTIONS, BANDS
  };
})(typeof window !== 'undefined' ? (window.APP = window.APP || {}) : (globalThis.APP = globalThis.APP || {}));
