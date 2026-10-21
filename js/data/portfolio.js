/* ===========================================================================
   portfolio.js — HSC Major Project digital portfolio templates
   Each template maps to Software Engineering Project dot points so that a
   completed portfolio is also evidence of syllabus coverage.
   Field types: text | textarea | url | select | checklist | table | uml | gantt
   =========================================================================== */
(function (A) {
  'use strict';

  const TEMPLATES = [
    {
      id: 'requirements', icon: '◧', stage: 'Identifying and defining',
      title: 'Requirements definition & analysis',
      points: ['SEP-1.1', 'SEP-1.2'],
      intro: 'Demonstrate the need, establish feasibility, and state requirements precisely enough to build and test against. Markers look for evidence, not assertion.',
      fields: [
        { id: 'problem', type: 'textarea', label: 'Problem statement', rows: 3,
          help: 'One paragraph. Who has the problem, what it costs them now.',
          placeholder: 'Students queue an average of 9 minutes of a 15-minute recess…' },
        { id: 'evidence', type: 'table', label: 'Evidence of need', points: ['SEP-1.1'],
          cols: ['Source', 'Method', 'Finding'],
          help: 'Survey, interview, observation or measurement — with the actual finding.' },
        { id: 'feasibility', type: 'table', label: 'Feasibility assessment',
          cols: ['Dimension', 'Assessment', 'Risk / mitigation'],
          seed: [['Scheduling', '', ''], ['Financial', '', ''], ['Technical', '', '']] },
        { id: 'functional', type: 'table', label: 'Functional requirements',
          cols: ['ID', 'The system must…', 'Priority', 'Acceptance test'],
          help: 'Number them (R1, R2…) — your test plan and evaluation will refer back to these IDs.' },
        { id: 'performance', type: 'table', label: 'Performance (non-functional) requirements',
          cols: ['ID', 'Requirement', 'Measure'],
          help: 'Must be measurable: “responds in under 2 s with 400 concurrent users”.' },
        { id: 'boundaries', type: 'textarea', label: 'Boundaries — what is explicitly out of scope', rows: 4,
          help: 'Directly assessed. Protects you from scope creep.' }
      ]
    },
    {
      id: 'datadictionary', icon: '▤', stage: 'Identifying and defining',
      title: 'Data dictionary & data structures',
      points: ['SEP-1.1', 'SEP-1.2', 'PF-3.4'],
      intro: 'Define every stored field with its type, size, format and validation before you write the schema.',
      fields: [
        { id: 'dict', type: 'table', label: 'Data dictionary',
          cols: ['Field', 'Data type', 'Size', 'Format', 'Validation', 'Example'],
          seed: [['', '', '', '', '', '']] },
        { id: 'structures', type: 'textarea', label: 'Data structures selected and justified', rows: 4,
          help: 'Which structure holds what, and why (lookup speed, ordering, persistence).' }
      ]
    },
    {
      id: 'methodology', icon: '◴', stage: 'Research and planning',
      title: 'Development approach & justification',
      points: ['SEP-2.1', 'SEP-2.2', 'SEP-2.3'],
      intro: 'Choose Waterfall, Agile or WAgile and justify it against the scale and type of your development. A justification compares alternatives.',
      fields: [
        { id: 'approach', type: 'select', label: 'Approach adopted',
          options: ['Waterfall', 'Agile', 'WAgile (hybrid)'] },
        { id: 'justify', type: 'textarea', label: 'Justification', rows: 5,
          help: 'Why this approach, and why not the other two, for a project of this scale and type.' },
        { id: 'tailoring', type: 'textarea', label: 'Method tailoring', rows: 3,
          help: 'Agile: iteration length, ceremonies kept and dropped. Waterfall: stage gates and sign-offs. WAgile: where the intervention is applied.' },
        { id: 'waterfall', type: 'checklist', label: 'Waterfall stage gates', when: { approach: ['Waterfall', 'WAgile (hybrid)'] },
          items: ['Requirements definition signed off', 'Specifications agreed', 'Design complete', 'Development complete', 'Integration complete', 'Testing and debugging complete', 'Installation plan approved', 'Maintenance plan documented'] },
        { id: 'agile', type: 'table', label: 'Iteration log', when: { approach: ['Agile', 'WAgile (hybrid)'] },
          cols: ['Sprint', 'Dates', 'Goal', 'Delivered', 'Retrospective action'] }
      ]
    },
    {
      id: 'schedule', icon: '▦', stage: 'Research and planning',
      title: 'Project schedule (Gantt)',
      points: ['SEP-2.4', 'SEP-3.4'],
      intro: 'Tasks against time, with dependencies, milestones and the critical path. Shade progress as you go so slippage is visible.',
      fields: [
        { id: 'gantt', type: 'gantt', label: 'Gantt chart' },
        { id: 'critical', type: 'textarea', label: 'Critical path & resource allocation', rows: 3,
          help: 'Which chain of tasks cannot slip, and who/what is allocated to each.' }
      ]
    },
    {
      id: 'modelling', icon: '◳', stage: 'Research and planning',
      title: 'UML & system models',
      points: ['SEP-2.8', 'SEP-3.3', 'OOP-1.3'],
      intro: 'Model the system before building it. Class diagrams for structure, use case for scope, sequence for interaction, data flow for information movement.',
      fields: [
        { id: 'uml', type: 'uml', label: 'Diagram workspace' },
        { id: 'algorithms', type: 'textarea', label: 'Documented algorithms (pseudocode)', rows: 10, mono: true,
          help: 'One structured algorithm per non-trivial subroutine.',
          placeholder: 'BEGIN PlaceOrder(student, items)\n    …\nEND PlaceOrder' }
      ]
    },
    {
      id: 'versioncontrol', icon: '⑂', stage: 'Producing and implementing',
      title: 'Version control & backup',
      points: ['SEP-3.5', 'SEP-3.6', 'WEB-2.5', 'OOP-1.8'],
      intro: 'Link the repository, record your branching convention, and show that backup is programmed and tested — an untested backup is a hypothesis.',
      fields: [
        { id: 'repo', type: 'url', label: 'Repository URL', placeholder: 'https://github.com/you/major-project' },
        { id: 'board', type: 'url', label: 'Issue tracker / project board URL', placeholder: 'https://github.com/you/major-project/projects/1' },
        { id: 'release', type: 'url', label: 'Latest release / deployed build URL' },
        { id: 'convention', type: 'textarea', label: 'Branching & commit message convention', rows: 3,
          placeholder: 'feature/<short-name> branched from main; commits state the change and the reason; PR reviewed by one peer before merge.' },
        { id: 'commits', type: 'table', label: 'Milestone commits (evidence of development)',
          cols: ['Date', 'Commit / tag', 'What changed and why'] },
        { id: 'backup', type: 'textarea', label: 'Programmed backup arrangement', rows: 4, mono: true,
          help: 'The scheduled job itself, where copies go (off-device), retention, and when you last tested a restore.' },
        { id: 'restoretested', type: 'checklist', label: 'Backup verification',
          items: ['Backup runs automatically on a schedule', 'At least one copy is stored off the development machine', 'A restore has been performed and verified', 'Failure of the backup job raises an alert'] }
      ]
    },
    {
      id: 'testing', icon: '◎', stage: 'Testing and evaluating',
      title: 'Test plan & results',
      points: ['SEP-4.1', 'SEP-4.4', 'OOP-2.3', 'PF-4.6'],
      intro: 'Path and boundary test data, expected output against actual output, and a verdict per requirement ID.',
      fields: [
        { id: 'levels', type: 'checklist', label: 'Testing applied',
          items: ['Unit testing', 'Subsystem testing', 'System testing', 'Black box', 'White box', 'Grey box', 'Boundary values', 'Path coverage', 'Faulty / abnormal data'] },
        { id: 'plan', type: 'table', label: 'Test plan and results',
          cols: ['Req ID', 'Test data', 'Type', 'Expected output', 'Actual output', 'Verdict'],
          seed: [['R1', '', 'Boundary', '', '', '']] },
        { id: 'defects', type: 'table', label: 'Defect log',
          cols: ['#', 'Defect', 'Error type', 'Cause', 'Fix', 'Retested'] }
      ]
    },
    {
      id: 'usertesting', icon: '◔', stage: 'Testing and evaluating',
      title: 'User testing & feedback',
      points: ['SEP-4.3', 'SEP-2.6', 'SEP-2.5'],
      intro: 'Record who tested, what task they attempted, what actually happened, and — critically — what you changed in response and why.',
      fields: [
        { id: 'protocol', type: 'textarea', label: 'Testing protocol & consent', rows: 3,
          help: 'How participants were selected and briefed, tasks set, and how privacy of participants was protected.' },
        { id: 'sessions', type: 'table', label: 'User testing sessions',
          cols: ['Date', 'Participant (role)', 'Task set', 'Observation', 'Severity', 'Action taken'],
          seed: [['', '', '', '', '', '']] },
        { id: 'feedback', type: 'table', label: 'Feedback synthesis',
          cols: ['Theme', 'Raised by (n)', 'Decision', 'Justification'],
          help: 'Analysing feedback means deciding what NOT to act on, with reasons.' },
        { id: 'accessibility', type: 'checklist', label: 'Accessibility & inclusivity check',
          items: ['Keyboard-only operation verified', 'Contrast ratio ≥ 4.5:1 for body text', 'Meaning never conveyed by colour alone', 'Text alternatives for all images', 'Tested at mobile width', 'Tested with a screen reader'] }
      ]
    },
    {
      id: 'evaluation', icon: '◈', stage: 'Testing and evaluating',
      title: 'Evaluation of the solution',
      points: ['SEP-4.4', 'SEP-4.2', 'SEP-2.7'],
      intro: 'Judge the finished solution against the original requirements and the quality criteria you defined before building.',
      fields: [
        { id: 'criteria', type: 'table', label: 'Quality criteria judgement',
          cols: ['Criterion', 'How judged', 'Evidence', 'Judgement'],
          seed: [['Functionality', '', '', ''], ['Performance', '', '', ''], ['Readability of code', '', '', ''], ['Quality of documentation', '', '', '']] },
        { id: 'optimisation', type: 'textarea', label: 'Language-dependent optimisation applied', rows: 3,
          help: 'The technique, where it was applied, and the measured before/after.' },
        { id: 'compliance', type: 'textarea', label: 'Compliance & legislative requirements addressed', rows: 3,
          help: 'Privacy, accessibility, copyright and licensing of libraries used.' },
        { id: 'conclusion', type: 'textarea', label: 'Overall evaluation & what you would do differently', rows: 6 },
        { id: 'innovation', type: 'textarea', label: 'Proposed innovative extension (prototype & UI)', rows: 4,
          help: 'SEP-3.8 — an additional solution proposed, justified from user feedback.' }
      ]
    }
  ];

  const byId = id => TEMPLATES.find(t => t.id === id);
  const allPoints = () => {
    const s = new Set();
    TEMPLATES.forEach(t => (t.points || []).forEach(p => s.add(p)));
    return [...s];
  };

  A.Portfolio = { TEMPLATES, byId, allPoints };
})(window.APP = window.APP || {});
