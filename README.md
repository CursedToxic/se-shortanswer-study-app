# SE Ops — NESA Software Engineering 11–12 study app

A zero-setup study environment for the **NSW Education Standards Authority
Software Engineering 11–12 (2022)** syllabus. Every module, question, coding
challenge and portfolio artefact is mapped to a syllabus dot point, so progress
is tracked against the course itself rather than against an arbitrary score.

No build step, no server, no dependencies to install. Open `index.html`.

---

## Running it

**Locally** — double-click `index.html`, or:

```bash
open index.html                 # macOS
xdg-open index.html             # Linux
```

Everything works from `file://` except the Python runtime, which downloads
Pyodide from a CDN the first time it is used (about 1.7 s on a warm connection,
cached by the browser afterwards). JavaScript execution works offline.

**Serving it** (recommended if you want Python to cache reliably, or to install
it as a PWA on a phone):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**Browser support:** any current Chrome, Edge, Safari or Firefox. The design
uses `backdrop-filter`; where that is unsupported the glass panels fall back to
solid surfaces and nothing breaks.

---

## What it does

### Syllabus mapping
All **124 content dot points** across the seven focus areas are transcribed
verbatim, with their "Including:" sub-points, and indexed by id (`SSA-2.10`,
`PF-4.7`, …). All 18 outcomes are mapped to the areas that address them.
Every dot point has at least one learning resource **and** at least one exam
question — coverage is 124/124 both ways.

### Mastery tracking
Mastery is modelled per dot point from weighted evidence, not from a single
score. Reading a module, answering a question, clearing a code challenge,
closing a bug bounty and completing a portfolio artefact all contribute
different weights. A point only reaches **Mastered** when it has been evidenced
by more than one *kind* of activity, which prevents a point being "finished" by
reading alone.

Levels: `Not started → Introduced → Developing → Mastered`.

### Inline code execution
Python and JavaScript run in the browser with nothing installed:

| Language | Runtime | Isolation |
|---|---|---|
| JavaScript | sandboxed `<iframe sandbox="allow-scripts">` | unique opaque origin — no access to the host page's DOM, storage or cookies |
| Python | Pyodide (CPython compiled to WebAssembly) in a dedicated Web Worker | no DOM access; worker terminated on timeout |

Both have a hard wall-clock timeout, so an infinite loop is killed rather than
hanging the tab. This is also a worked example of the sandboxing content in
SSA-2.3 — the tool demonstrates the thing it teaches.

### Examinations
Questions come in all four media formats the HSC paper uses — **code snippets,
system logs, architecture diagrams and scenarios** — across multiple choice,
short answer and extended response.

- **Practice mode** marks immediately and shows the criteria, an explanation and
  a model answer.
- **Conditions mode** simulates the external examination: reading time, a
  countdown, no marking or sample answers until the whole paper is submitted,
  and automatic submission when working time expires.

Papers are balanced automatically: every focus area in scope is represented, no
question repeats, and questions are ordered multiple choice → short → extended.

### Major project portfolio
Nine artefact templates covering the whole project life cycle, each mapped to
Software Engineering Project dot points: requirements and feasibility, data
dictionary, methodology (Waterfall / Agile / WAgile with conditional fields per
approach), Gantt scheduling, UML modelling, version control and programmed
backup, test plan, user testing records, and evaluation. Exports as Markdown.

### UML workspace
A text-driven modelling tool producing **class, sequence, use case and
flowchart** diagrams, laid out as you type and exportable as SVG for the
portfolio.

```
class Account
- balance : real
+ deposit(amount) : void

class SavingsAccount : Account
+ addInterest() : void
```

### Gamification
XP from every activity, eight ranks mapped to the NESA performance bands,
narrative mission chains, bug-bounty tickets where real vulnerable code must be
patched until a verification suite passes, and unlockable badges, sigils and
interface skins.

### Diagnostics
A gap report scans every dot point, combining how much evidence exists with how
well you actually scored on questions touching it, and sorts by severity. Output
is both a readable table and a terminal-style scan log, exportable as text.

---

## Design

Two visual zones, applied automatically by content:

- **Year 11 and app chrome** — "Liquid Glass": translucent layered surfaces over
  a soft colour field, specular top edges, wide soft shadows. Adapts to light
  and dark system appearance.
- **Year 12** — the same glass system reskinned as a cyberpunk operations
  centre: dark field, cyan/magenta accents, monospace type, grid overlay.

The zone is chosen by the route, so a Year 12 focus area, module, question,
dot point, mission or the major project is always in the ops-centre skin, and
Year 11 content is always in daylight glass.

Responsive from 390 px upward: a sidebar rail on desktop collapses to a floating
tab bar on mobile. Honours `prefers-reduced-motion` and `prefers-color-scheme`.

---

## Project structure

```
index.html              app shell, navigation, script graph
css/app.css             the whole design system (tokens, both zones, components)
js/
  data/
    syllabus.js         7 focus areas, 18 outcomes, 124 dot points  ← the backbone
    notes.js            24 teaching modules
    questions.js        ┐
    questions-b.js      ├ 102 exam questions, 307 marks
    questions-c.js      ┘
    quests.js           ranks, XP tariff, 6 challenges, 5 bounties, 8 missions, 14 assets
    portfolio.js        9 major-project artefact templates
    diagrams.js         9 inline SVG architecture diagrams
  marking.js            rubric weighting + structural analysis + misconceptions
  state.js              mastery model, XP, persistence, diagnostics, sync
  runtime.js            sandboxed JS + Python execution
  uml.js                text → SVG diagram renderer
  ui.js                 router, zone theming, shared widgets, marking
  views/                learn · code · exam · project · ops
  app.js                boot
```

`APP` is the single global namespace; files are plain scripts loaded in
dependency order, so the app runs from `file://` with no bundler.

---

## Data and privacy

All progress is stored in this browser's `localStorage`. **Nothing is sent
anywhere** unless you deliberately configure a sync endpoint in Settings.

- **Export / import** a JSON progress file to move between devices.
- **Cloud sync** (optional): supply any HTTPS endpoint that accepts `GET` and
  `PUT` of a JSON document — a storage bucket, a school server, your own
  service — plus an optional bearer token.

Clearing site data erases progress, so export before you do.

---

## Adding content

Everything is data. To add a question, append an object to one of the
`questions*.js` banks:

```js
add({
  id: 'SSA-Q16', area: 'SSA', points: ['SSA-2.7'], outcome: 'SE-12-07',
  marks: 4, format: 'short',
  media: code('python', '...'),        // or log(...) / dgm(...) / scen(...)
  stem: '…',
  criteria: [{ t: 'Identifies …', kw: ['injection', 'concat'] }],
  sample: '…'
});
```

The integrity harness enforces the rules: dot points must exist and belong to
the question's own area, the outcome's year must match the area's year, MCQs
need exactly one mark and an explanation, written questions need criteria and a
model answer — **and the model answer must satisfy every one of its own
criteria**.

---

## Testing

The test harnesses live outside the project (they were run from a scratch
directory). Six suites were run against this build:

| Suite | What it checks | Result |
|---|---|---|
| Syntax | every JS file parses | 20/20 |
| Data integrity | cross-references, coverage, state engine, mastery maths, rubric weighting, structural analysis, misconception probes, paper balance | 2,660 checks |
| Auto-graders | each challenge/bounty: a reference solution passes **and** the supplied starter fails | 11/11 |
| Route sweep | all 41 routes render in headless Chrome with no JS errors | 41/41 |
| DOM interaction | widgets driven as a student would: answering, marking, caps, misconceptions, tables, Gantt, UML, zone theming | 253 checks |
| Execution runtime | JS sandbox, isolation, timeouts, error reporting, Pyodide, in-browser grading | 28 checks |

---

## How written responses are marked

`js/marking.js` applies two layers, because a response can contain every right
word and still not answer the question.

**1 · Weighted rubric.** Each criterion carries a mark value and a cognitive
level — Knowledge, Description, Explanation, Analysis, Judgement — inferred
from its own wording, or from the question's command verb where the criterion
is a noun phrase. Spare marks go to the higher-order criteria, so the judgement
criterion in a 6-mark *evaluate* question is worth more than a recall
criterion. Allocation uses largest-remainder rounding, so the parts always sum
to the whole. Criteria can require several ideas together (`all`), two ideas in
proximity (`near`), or any of a set of alternatives (`kw`).

**2 · Structural analysis.** The command verb in the stem is detected and the
response is checked for what that verb actually demands:

| Verb | Demands | Effect if missing |
|---|---|---|
| compare, contrast, distinguish | comparative language about both subjects | capped at 70% |
| evaluate, assess, justify, recommend | an explicit judgement or recommendation | capped at 70% |
| explain, analyse | causal reasoning | capped at 80% |
| any | development proportionate to the marks | capped at 60% / 85% |
| evaluate, discuss | both sides weighed | advisory only |

Caps are ceilings and do not round back up through themselves. A response that
scores every criterion on keywords alone but compares nothing and concludes
nothing cannot reach Band 5 — which is how a marker would treat it.

**Misconceptions.** A library of statements that are actively *wrong* rather
than merely missing — passwords "encrypted" instead of hashed, hashing called
reversible, flipping the sign bit for two's complement, client-side validation
described as a security control, polymorphism defined as inheritance — each
costs a mark and returns the correction. Every pattern is guarded by an
`unless` clause so that a correct contrast ("hashed rather than encrypted") is
never penalised, and all 102 model answers are tested to trip none of them.

The learner sees the mark, the band and its descriptor, each criterion with its
level and marks, what the command verb required, any cap that was applied with
the reason, any misconception with its correction, and specific next steps.

It is still an *indication, not a mark*: a criterion can be met in words the
checker does not recognise. The app says so on every marked response and always
offers the model answer for comparison. Band mappings on ranks and results are
motivational guides, not predicted marks.

---

## Attribution

Syllabus outcomes and content dot points are reproduced from the **NSW Education
Standards Authority, *Software Engineering 11–12 (2022) Syllabus*** © NSW
Education Standards Authority, for personal study use. This application is a
study aid; it is not a NESA product and its marks and band mappings are not
official.
