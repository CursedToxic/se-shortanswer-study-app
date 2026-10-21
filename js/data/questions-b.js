/* ===========================================================================
   questions-b.js — second bank, extending coverage to the remaining dot points
   so that examination papers can demand precise knowledge of the whole course.
   Loaded after questions.js and pushed into the same array.
   =========================================================================== */
(function (A) {
  'use strict';
  const { QUESTIONS, code, log, dgm, scen } = A.Questions;
  const add = q => QUESTIONS.push(q);

  /* ===================== PROGRAMMING FUNDAMENTALS ====================== */
  add({
    id: 'PF-Q8', area: 'PF', points: ['PF-2.2'], outcome: 'SE-11-01', marks: 1, format: 'mcq',
    stem: 'A program solves a Sudoku grid by placing a digit, continuing, and — when a placement makes the grid unsolvable — removing it and returning to the previous decision point to try the next digit. Which algorithmic design strategy is this?',
    options: ['Divide and conquer', 'Backtracking', 'Greedy selection', 'Iterative refinement'],
    answer: 1,
    why: 'Backtracking builds a candidate solution incrementally and abandons a partial candidate as soon as it cannot be completed, returning to the last decision point. Divide and conquer splits a problem into independent sub-problems that are solved and then combined.'
  });
  add({
    id: 'PF-Q9', area: 'PF', points: ['PF-2.7'], outcome: 'SE-11-02', marks: 4, format: 'short',
    stem: 'Distinguish between the imperative, object-oriented, functional and logic programming paradigms. Give one characteristic of each.',
    criteria: [
      { t: 'Imperative — explicit sequence of statements changing program state', kw: ['imperative', 'statement', 'state', 'step', 'sequence', 'how'] },
      { t: 'Object-oriented — objects bundling state and behaviour, interacting by messages', kw: ['object', 'class', 'encapsulat', 'message'] },
      { t: 'Functional — computation as evaluation of pure functions, avoiding changing state', kw: ['function', 'pure', 'immutab', 'no side effect', 'recursion'] },
      { t: 'Logic — declaring facts and rules; the engine infers the answer', kw: ['logic', 'fact', 'rule', 'prolog', 'infer', 'declarative', 'query'] }
    ],
    sample: 'Imperative programming expresses a solution as an explicit sequence of statements that change the program’s state — the programmer specifies how the result is produced, step by step. Object-oriented programming organises the solution as objects, each an instance of a class bundling state (attributes) with behaviour (methods), interacting by passing messages. Functional programming treats computation as the evaluation of functions, favouring pure functions without side effects and immutable data, with recursion in place of loops. Logic programming is declarative: the programmer states facts and rules, and an inference engine (as in Prolog) determines how to satisfy a query. The key contrast is that imperative and OOP say how to compute, while functional and logic styles emphasise what must be true of the result.'
  });
  add({
    id: 'PF-Q10', area: 'PF', points: ['PF-3.1'], outcome: 'SE-11-04', marks: 2, format: 'short',
    stem: 'Convert the hexadecimal value C8 to both binary and decimal, and explain why hexadecimal is widely used to represent binary data.',
    criteria: [
      { t: 'Binary 1100 1000 given', kw: ['11001000', '1100 1000'] },
      { t: 'Decimal 200 given', kw: ['200'] },
      { t: 'Explains that one hex digit maps exactly to four bits, making it compact and readable', kw: ['four bits', '4 bits', 'nibble', 'compact', 'shorter', 'one digit'] }
    ],
    sample: 'C = 1100 and 8 = 1000, so C8 = 1100 1000 in binary. In decimal, C8 = (12 × 16) + 8 = 192 + 8 = 200. Hexadecimal is used because one hex digit represents exactly four bits, so any byte is exactly two hex digits. This makes long binary values far shorter and less error-prone to read and write, which is why memory addresses, colour values and MAC addresses are written in hex.'
  });
  add({
    id: 'PF-Q11', area: 'PF', points: ['PF-3.3'], outcome: 'SE-11-04', marks: 1, format: 'mcq',
    media: code('python', `price = 0.1 + 0.2
print(price == 0.3)      # False
print(price)             # 0.30000000000000004`),
    stem: 'Which statement best explains this output?',
    options: [
      'Python has a bug in its addition operator for small numbers',
      'Floating point values store an approximation in a finite number of bits, so some decimal fractions cannot be represented exactly',
      'The values should have been declared as integers before adding',
      'The comparison operator cannot be used on real numbers in any language'
    ],
    answer: 1,
    why: 'Single and double precision floating point allocate a fixed number of bits to the mantissa, so fractions such as 0.1 have no exact binary representation and a tiny rounding error accumulates. Monetary values are therefore stored as integer cents or a decimal type, and reals are compared within a tolerance.'
  });
  add({
    id: 'PF-Q12', area: 'PF', points: ['PF-3.4', 'PF-3.3'], outcome: 'SE-11-04', marks: 4, format: 'short',
    media: scen('A library system stores, for each loan: a member ID (format M followed by 6 digits), the date the item was borrowed, whether the item has been returned, and the fine owing in dollars and cents.'),
    stem: 'Construct a data dictionary for these four fields. Include the field name, data type, size, format, validation and an example for each.',
    criteria: [
      { t: 'Correct type for memberID (string/char) with the format and validation rule stated', kw: ['string', 'm', '6 digit', 'format'] },
      { t: 'Correct type for the date field with a format', kw: ['date', 'dd/mm/yyyy', 'yyyy-mm-dd'] },
      { t: 'Boolean used for the returned flag', kw: ['boolean', 'true', 'false', 't/f'] },
      { t: 'Real/currency used for the fine with a sensible validation range', kw: ['real', 'currency', 'decimal', '0.00', 'two decimal'] }
    ],
    sample: 'memberID — string, 7 characters, format MXXXXXX, validation: first character must be “M” followed by exactly 6 digits, example M004271. dateBorrowed — date, 8 bytes, format DD/MM/YYYY, validation: must be a valid calendar date not in the future, example 14/03/2026. isReturned — Boolean, 1 bit, format T/F, validation: must be T or F only, example F. fineOwing — real (currency), 4–8 bytes, format $##0.00, validation: must be ≥ 0.00 and ≤ a defined maximum such as 100.00, stored to two decimal places (ideally as integer cents to avoid floating-point rounding), example 3.50.'
  });
  add({
    id: 'PF-Q13', area: 'PF', points: ['PF-2.4', 'PF-2.3'], outcome: 'SE-11-01', marks: 3, format: 'short',
    stem: 'Explain how a structure chart and an abstraction/refinement diagram each support design, and distinguish top-down from bottom-up design.',
    criteria: [
      { t: 'Structure chart — hierarchy of modules showing data couples and control flags passed between them', kw: ['structure chart', 'module', 'hierarch', 'data couple', 'control flag', 'parameter'] },
      { t: 'Abstraction/refinement diagram — the same solution at increasing levels of detail', kw: ['abstraction', 'refinement', 'level', 'detail', 'stepwise'] },
      { t: 'Top-down decomposes the whole; bottom-up composes from known components', kw: ['top-down', 'decompos', 'bottom-up', 'compose', 'build up', 'combine'] }
    ],
    sample: 'A structure chart shows the module hierarchy of a solution: each box is a subprogram, lines show which module calls which, and annotated arrows show the data couples (values passed) and control flags (status information) crossing each interface — so it documents both decomposition and the interfaces between functions. An abstraction and refinement diagram shows the same solution at successive levels of detail, starting with a single abstract statement of the task and refining each step until it is detailed enough to code (stepwise refinement). Top-down design starts with the whole problem and decomposes it into smaller subproblems until each is trivial; bottom-up design starts from components that already exist or are easy to build and combines them into larger subsystems. Most real projects use both: top-down to structure the solution, bottom-up to reuse tested components.'
  });
  add({
    id: 'PF-Q14', area: 'PF', points: ['PF-1.2'], outcome: 'SE-11-06', marks: 3, format: 'short',
    stem: 'Research and evaluate the use of online code collaboration tools in a software development team. Refer to both benefits and limitations.',
    criteria: [
      { t: 'Names specific tools/features (hosted VCS, pull requests, issue tracking, live share, CI)', kw: ['github', 'gitlab', 'bitbucket', 'pull request', 'issue', 'live share', 'replit', 'ci'] },
      { t: 'States benefits — parallel work, review, traceability, remote collaboration', kw: ['parallel', 'review', 'history', 'traceab', 'remote', 'quality'] },
      { t: 'States limitations — connectivity, learning curve, security of code, merge conflicts', kw: ['internet', 'connectivity', 'learning curve', 'security', 'public', 'conflict', 'cost'] }
    ],
    sample: 'Online collaboration tools are now the default in industry. Hosted version control such as GitHub, GitLab or Bitbucket provides a shared repository with branching, pull requests, code review and issue tracking, while real-time editors such as VS Code Live Share or Replit allow pair programming across locations, and CI services run the test suite automatically on every push. The benefits are substantial: team members work in parallel without overwriting each other, every change is attributable and reversible, review raises code quality before merging, and the history provides evidence of the development process. The limitations are also real: the tools require reliable internet access, add a learning curve (particularly around merging and conflict resolution), can expose private code if a repository is misconfigured as public, and a team that relies on automation without reviewing it can merge defects quickly rather than slowly. On balance the traceability and review benefits outweigh the costs for any team of more than one.'
  });

  /* ===================== OBJECT-ORIENTED PARADIGM ====================== */
  add({
    id: 'OOP-Q7', area: 'OOP', points: ['OOP-1.4'], outcome: 'SE-11-01', marks: 1, format: 'mcq',
    media: code('python', `class MediaFacade:
    def __init__(self):
        self._codec = CodecLibrary()
        self._buffer = StreamBuffer()
        self._drm = RightsChecker()

    def play(self, file):
        self._drm.verify(file)
        stream = self._codec.decode(file)
        self._buffer.feed(stream)`),
    stem: 'Which design approach does the MediaFacade class demonstrate?',
    options: [
      'Inheritance from three superclasses',
      'The facade pattern — a simplified interface to a complex subsystem',
      'Polymorphism through method overriding',
      'Bottom-up refinement of an algorithm'
    ],
    answer: 1,
    why: 'A facade provides one simple entry point (play) that hides the complexity of several collaborating classes, reducing coupling for the caller. No inheritance or overriding occurs here — the facade composes the subsystem objects.'
  });
  add({
    id: 'OOP-Q8', area: 'OOP', points: ['OOP-1.7', 'OOP-1.5'], outcome: 'SE-11-08', marks: 4, format: 'short',
    media: code('python', `def find_duplicates(records):
    duplicates = []
    for i in range(len(records)):
        for j in range(len(records)):
            if i != j and records[i] == records[j]:
                if records[i] not in duplicates:
                    duplicates.append(records[i])
    return duplicates`),
    stem: 'Assess the effectiveness of this code and explain how it could be optimised. Refer to its behaviour as the number of records grows.',
    criteria: [
      { t: 'Identifies the nested loop as O(n²) — execution time grows with the square of the input', kw: ['nested', 'n²', 'n^2', 'quadratic', 'squar', 'o(n'] },
      { t: 'Identifies the additional cost of the linear “not in duplicates” search inside the loop', kw: ['not in', 'linear search', 'inside the loop', 'list search'] },
      { t: 'Proposes a hash-based (set/dictionary) single-pass solution', kw: ['set', 'dictionary', 'hash', 'seen', 'counter', 'one pass', 'single pass'] },
      { t: 'Notes the trade-off (memory used vs speed gained) or that correctness is preserved', kw: ['memory', 'trade', 'space', 'still correct', 'same result'] }
    ],
    sample: 'The code is functionally correct but inefficient. The nested loops compare every record with every other record, so the number of comparisons grows with the square of the number of records: 1 000 records require a million comparisons, and 10 000 require a hundred million. The membership test `records[i] not in duplicates` performs a further linear search on each match, adding more cost. An optimised version makes a single pass using a hash-based structure:\n\ndef find_duplicates(records):\n    seen, duplicates = set(), set()\n    for r in records:\n        if r in seen:\n            duplicates.add(r)\n        else:\n            seen.add(r)\n    return list(duplicates)\n\nSet membership is an average O(1) hash lookup, so the whole function becomes O(n). The trade-off is additional memory to hold the two sets, which is almost always worth it; the output is unchanged, so this is optimisation rather than a change in behaviour. The optimised version is also more readable, which matters for maintenance.'
  });
  add({
    id: 'OOP-Q9', area: 'OOP', points: ['OOP-2.2'], outcome: 'SE-11-08', marks: 3, format: 'short',
    media: code('python', `def main():
    data = open("marks.txt").read().split(",")
    total = 0
    for d in data:
        total += int(d)
    avg = total / len(data)
    if avg > 80: print("A")
    elif avg > 65: print("B")
    else: print("C")
    out = open("report.txt", "w")
    out.write(str(avg))
    out.close()
    print("done")`),
    stem: 'Modify the structure of this program to demonstrate a clear and uncluttered mainline with one logical task per subroutine. Explain how your restructuring improves ease of maintenance.',
    criteria: [
      { t: 'Separates into subroutines by task (load, calculate, grade, save)', kw: ['def load', 'def calculate', 'def grade', 'def save', 'subroutine', 'function'] },
      { t: 'Mainline reduced to a short sequence of calls', kw: ['mainline', 'main()', 'calls', 'short'] },
      { t: 'Explains the maintenance benefit — change is localised, each part is unit-testable', kw: ['maintain', 'test', 'unit', 'localis', 'reuse', 'readab'] }
    ],
    sample: 'Restructured:\n\ndef load_marks(path):\n    with open(path) as f:\n        return [int(x) for x in f.read().split(",")]\n\ndef calculate_average(marks):\n    return sum(marks) / len(marks)\n\ndef grade(average):\n    if average > 80: return "A"\n    if average > 65: return "B"\n    return "C"\n\ndef save_report(path, average):\n    with open(path, "w") as f:\n        f.write(str(average))\n\ndef main():\n    marks = load_marks("marks.txt")\n    average = calculate_average(marks)\n    print(grade(average))\n    save_report("report.txt", average)\n\nThe mainline is now four lines that read as a summary of what the program does, and each subroutine performs exactly one logical task. Maintenance improves because a change to the grading boundaries touches only grade(), a change to the file format touches only load_marks(), and each subroutine can be unit tested in isolation with known inputs and expected outputs. The functions are also reusable elsewhere, and using `with` guarantees files are closed even if an error occurs.'
  });
  add({
    id: 'OOP-Q10', area: 'OOP', points: ['OOP-1.3'], outcome: 'SE-11-06', marks: 3, format: 'short',
    media: dgm('canteendfd'),
    stem: 'Interpret the data flow diagram in Figure E2. Identify the external entity, the processes and the data stores, and state one thing a data flow diagram does NOT show.',
    criteria: [
      { t: 'Identifies Student as the external entity', kw: ['student', 'external entity'] },
      { t: 'Identifies the processes (1.0 Place order, 2.0 Process payment) and data stores (D1 Orders, D2 Accounts, D3 Menu)', kw: ['place order', 'process payment', 'd1', 'd2', 'd3', 'data store'] },
      { t: 'States that a DFD does not show control flow / sequence / timing / decisions', kw: ['sequence', 'order of', 'control', 'timing', 'decision', 'when'] }
    ],
    sample: 'The external entity is the Student — a source and destination of data outside the system boundary. The processes are 1.0 Place order and 2.0 Process payment, each transforming incoming data into outgoing data. The data stores are D1 Orders, D2 Accounts and D3 Menu. The labelled arrows are data flows: order details, order record, price, total and debit. A data flow diagram shows only what data moves between components; it does not show control flow — the sequence in which processes run, the conditions or decisions that trigger them, loops, or timing. For that you would use a flowchart, structure chart or sequence diagram.'
  });

  /* ===================== MECHATRONICS ================================== */
  add({
    id: 'MEC-Q6', area: 'MEC', points: ['MEC-1.1'], outcome: 'SE-11-03', marks: 3, format: 'short',
    stem: 'Outline applications of mechatronic systems in three different specialised fields, identifying the sensing and actuation involved in each.',
    criteria: [
      { t: 'Three distinct fields named (e.g. medicine, agriculture, manufacturing, mining, aerospace, automotive, assistive tech)', kw: ['medic', 'agricultur', 'manufactur', 'mining', 'aerospace', 'automotive', 'assistive', 'surgical', 'warehouse'] },
      { t: 'Sensing identified for the applications', kw: ['sensor', 'camera', 'lidar', 'encoder', 'force', 'proximity', 'gps'] },
      { t: 'Actuation/end effector identified for the applications', kw: ['actuator', 'motor', 'servo', 'gripper', 'hydraulic', 'arm', 'valve'] }
    ],
    sample: 'Medicine: surgical robots use force and position sensors together with high-resolution cameras so the surgeon’s hand movements are scaled down and tremor-filtered, driving precise servo-actuated instruments and micro-grippers. Agriculture: autonomous harvesters use GPS, LiDAR and machine-vision cameras to detect crop ripeness and obstacles, and actuate steering, cutting heads and hydraulic lifting arms, which reduces waste and labour. Manufacturing and logistics: automated warehouse systems use barcode scanners, proximity and load sensors with motor-driven conveyors, robotic arms and vacuum or mechanical grippers to sort and palletise, operating continuously and removing workers from repetitive lifting. In every case the pattern is the same — sense the environment, decide in software, act through an actuator and end effector — but the sensing resolution, force and safety requirements differ enormously between fields.'
  });
  add({
    id: 'MEC-Q7', area: 'MEC', points: ['MEC-1.5'], outcome: 'SE-11-02', marks: 1, format: 'mcq',
    stem: 'A robotic arm has 6 independent joints, each able to rotate. In mechatronics, the number of independent movements the arm can make is referred to as its:',
    options: ['Motion constraints', 'Degrees of freedom', 'Instruction set', 'End effectors'],
    answer: 1,
    why: 'Degrees of freedom is the number of independent movements a system can make; 6 DOF allows any position and orientation to be reached within the workspace. Motion constraints are the limits imposed on those movements, such as a joint’s angular range.'
  });
  add({
    id: 'MEC-Q8', area: 'MEC', points: ['MEC-1.7', 'MEC-1.6'], outcome: 'SE-11-07', marks: 3, format: 'short',
    stem: 'A student connects a 6 V DC motor directly to a microcontroller output pin and the board fails. Explain what was wrong, and describe what the wiring diagram should have shown.',
    criteria: [
      { t: 'Explains that a GPIO pin cannot supply the motor’s current / voltage — it is overloaded', kw: ['current', 'ma', 'overload', 'too much', 'cannot supply', 'damage'] },
      { t: 'States the need for a driver/transistor/relay and a separate supply rail', kw: ['driver', 'transistor', 'mosfet', 'relay', 'h-bridge', 'separate supply', 'external power'] },
      { t: 'Mentions a flyback diode and/or common ground', kw: ['flyback', 'diode', 'back emf', 'common ground', 'shared ground'] }
    ],
    sample: 'A microcontroller GPIO pin is a logic output rated for only a few tens of milliamps; a DC motor draws hundreds of milliamps at stall, so the pin was overloaded and the driver circuitry in the chip failed. Motors must be powered from their own supply rail and switched by the microcontroller rather than powered from it. The wiring diagram should have shown a separate battery or supply for the motor, a motor driver — a transistor/MOSFET for one-direction control or an H-bridge IC for reversible control — with the microcontroller pin connected only to the driver’s logic input, a flyback diode across the motor terminals to absorb the back-EMF generated when the motor is switched off, and a common ground joining the controller and motor supplies so the logic signal has a reference. Power and data lines should be drawn separately and voltages labelled.'
  });
  add({
    id: 'MEC-Q9', area: 'MEC', points: ['MEC-3.3', 'MEC-3.7'], outcome: 'SE-11-06', marks: 3, format: 'short',
    stem: 'Justify the use of a simulation and prototype before building the physical mechatronic system, and outline two requirements of a user interface used to control such a system.',
    criteria: [
      { t: 'Simulation lets code be tested before hardware exists, cheaply and repeatably', kw: ['before', 'hardware', 'cheap', 'cost', 'repeat', 'faster', 'parallel'] },
      { t: 'Simulation allows dangerous or edge-case failures to be tested safely', kw: ['danger', 'safe', 'failure', 'edge case', 'damage', 'risk'] },
      { t: 'Names two UI requirements (clear state feedback, emergency stop, confirmation of destructive actions, latency, accessibility)', kw: ['emergency stop', 'e-stop', 'feedback', 'status', 'confirm', 'latency', 'accessib', 'clear'] }
    ],
    sample: 'Simulating the system first allows the control algorithms to be developed and unit tested before any hardware is built or while it is being assembled, which parallelises the project and removes the hardware as a bottleneck. It is also far cheaper and faster to iterate in software than to rebuild a mechanism, and it allows failure cases that would be dangerous or destructive on real hardware — a runaway motor, a sensor returning nonsense, a dropped power rail — to be tested safely and repeatably. A prototype then validates the assumptions the simulation made about the physical world, such as friction, backlash and real sensor noise. The control UI must give clear, immediate feedback of the system’s current state (position, mode, errors) so the operator is never guessing what the machine is about to do, and must provide an always-available emergency stop that is physically or visually prominent and cuts actuator power independently of the software. Destructive or irreversible actions should also require confirmation, and the interface must remain responsive, since a laggy UI makes a moving machine unsafe.'
  });

  /* ===================== SECURE SOFTWARE ARCHITECTURE ================== */
  add({
    id: 'SSA-Q8', area: 'SSA', points: ['SSA-1.2'], outcome: 'SE-12-01', marks: 4, format: 'short',
    stem: 'Interpret and apply the fundamental software development steps to the development of secure code. For four named steps, state one security activity that belongs in that step.',
    criteria: [
      { t: 'Requirements/specifications — security and privacy requirements stated, threat modelling, compliance obligations', kw: ['requirement', 'specification', 'threat model', 'compliance', 'privacy requirement'] },
      { t: 'Design — security and privacy by design, least privilege, trust boundaries', kw: ['design', 'by design', 'least privilege', 'architecture', 'trust boundar'] },
      { t: 'Development/testing — secure coding practices, code review, SAST/DAST, penetration testing', kw: ['code review', 'sast', 'dast', 'penetration', 'validation', 'secure coding', 'unit test'] },
      { t: 'Installation/maintenance — hardened configuration, patching, monitoring, incident response', kw: ['harden', 'patch', 'monitor', 'update', 'maintenance', 'configuration', 'incident'] }
    ],
    sample: 'Requirements definition: capture security and privacy requirements alongside functional ones — what data is collected, who may access it, and which legislation applies — and perform threat modelling to identify who would attack the system and why. Determining specifications: translate these into testable statements, such as “passwords are stored using bcrypt with a per-user salt” and “sessions expire after 20 minutes of inactivity”. Design: apply security and privacy by design — define trust boundaries, apply least privilege, choose where encryption and authorisation checks sit, and make the most private configuration the default. Development: apply defensive coding practices, parameterise all queries, validate and sanitise input, and run SAST in the pipeline with peer code review on every change. Integration: verify that authorisation is enforced at every interface, not just the front end. Testing and debugging: run DAST against the running build, conduct vulnerability assessment and penetration testing, and include abuse cases in the test plan. Installation: deploy with a hardened configuration, secrets outside the codebase and TLS enforced. Maintenance: monitor logs, patch dependencies against known CVEs within a defined timeframe, and maintain an incident response and disaster recovery plan — security is a property of the whole life cycle, not a stage near the end.'
  });
  add({
    id: 'SSA-Q9', area: 'SSA', points: ['SSA-2.8'], outcome: 'SE-12-07', marks: 4, format: 'short',
    media: code('javascript', `// GET /api/invoices/:id
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json(invoice);
});`),
    stem: 'This API endpoint returns any invoice to any logged-in user who guesses an ID. Identify the vulnerability class and rewrite the endpoint to demonstrate a safe API.',
    criteria: [
      { t: 'Identifies broken access control / insecure direct object reference — no ownership check', kw: ['access control', 'idor', 'direct object', 'ownership', 'authoris', 'authoriz'] },
      { t: 'Adds an authentication check and an authorisation/ownership check on the resource', kw: ['req.user', 'session', 'owner', 'userid', 'belongs', 'if ('] },
      { t: 'Validates the id parameter and handles the not-found/forbidden cases without leaking detail', kw: ['validat', '404', '403', 'not found', 'forbidden', 'generic'] },
      { t: 'Limits the fields returned / mentions rate limiting or HTTPS', kw: ['select', 'fields', 'only', 'rate limit', 'https', 'minim'] }
    ],
    sample: 'This is broken access control, specifically an insecure direct object reference: the endpoint authenticates the session but never checks that the requested invoice belongs to the requesting user, so incrementing the ID exposes other customers’ invoices. A safe version:\n\napp.get(\'/api/invoices/:id\', requireAuth, rateLimit, async (req, res) => {\n  const id = String(req.params.id);\n  if (!/^[0-9a-f]{24}$/.test(id)) return res.status(400).json({ error: \'Invalid invoice id\' });\n  const invoice = await Invoice.findOne({ _id: id, ownerId: req.user.id })\n                               .select(\'number issuedAt total status\');\n  if (!invoice) return res.status(404).json({ error: \'Not found\' });\n  res.json(invoice);\n});\n\nThe ownership condition is part of the query itself, so an invoice belonging to someone else can never be loaded. The id is validated before use, only the fields the client needs are returned rather than the whole document, and a missing and a forbidden invoice both return 404 so the response does not confirm that another user’s invoice exists. Authentication middleware, rate limiting and HTTPS complete the control set.'
  });
  add({
    id: 'SSA-Q10', area: 'SSA', points: ['SSA-2.9'], outcome: 'SE-12-07', marks: 1, format: 'mcq',
    stem: 'An application opens a database connection in a loop and never closes it, so the server gradually slows and eventually refuses new connections. Which aspect of efficient execution has been neglected?',
    options: ['Session management', 'Memory and resource management', 'Exception management', 'Authorisation'],
    answer: 1,
    why: 'Failing to release resources is a memory/resource management defect — a leak. It also has a security consequence: exhausting the connection pool denies service to legitimate users, so availability is lost.'
  });
  add({
    id: 'SSA-Q11', area: 'SSA', points: ['SSA-2.11'], outcome: 'SE-12-04', marks: 3, format: 'short',
    media: code('python', `def verify_token(supplied, actual):
    if len(supplied) != len(actual):
        return False
    for i in range(len(actual)):
        if supplied[i] != actual[i]:
            return False        # returns as soon as a character differs
    return True`),
    stem: 'Explain the class of attack this comparison is vulnerable to, how it would be exploited, and how to fix it.',
    criteria: [
      { t: 'Identifies a timing side channel attack', kw: ['timing', 'side channel', 'side-channel'] },
      { t: 'Explains the exploit — measuring response time reveals how many characters matched, allowing the token to be recovered character by character', kw: ['time', 'measur', 'character by character', 'longer', 'guess', 'one character'] },
      { t: 'Fixes with a constant-time comparison (e.g. hmac.compare_digest) or by comparing hashes', kw: ['constant time', 'constant-time', 'compare_digest', 'hmac', 'xor', 'hash'] }
    ],
    sample: 'This is vulnerable to a timing side channel attack. The loop returns at the first differing character, so the time taken is proportional to how many leading characters are correct. An attacker who can measure response times (averaging over many requests to overcome network noise) learns when the first character is right, fixes it, then attacks the second — reducing the search from exponential in the token length to linear, so a token that should be infeasible to guess can be recovered in a manageable number of requests. The length check leaks the token length as well. The fix is a constant-time comparison that always examines every character, such as Python’s hmac.compare_digest(supplied, actual), or XOR-accumulating the differences across the full length and testing the accumulator once at the end. Rate limiting and comparing fixed-length hashes of both values rather than the raw secrets are useful additional defences.'
  });
  add({
    id: 'SSA-Q12', area: 'SSA', points: ['SSA-3.1', 'SSA-3.2'], outcome: 'SE-12-05', marks: 4, format: 'short',
    stem: 'Apply and describe the benefits of collaboration in developing safe and secure software, and explain the resulting benefits to the enterprise.',
    criteria: [
      { t: 'Various points of view — different roles identify different risks', kw: ['point of view', 'perspective', 'different', 'tester', 'security specialist', 'accessibility'] },
      { t: 'Delegating tasks based on expertise', kw: ['expertise', 'delegat', 'specialist', 'skill'] },
      { t: 'Quality of the solution — defects found earlier and more cheaply', kw: ['quality', 'earlier', 'cheaper', 'review', 'defect'] },
      { t: 'Enterprise benefit named (improved products, productivity, work practices, business interactivity, influence on future development)', kw: ['productiv', 'work practice', 'product', 'service', 'business interactivity', 'future', 'reputation'] }
    ],
    sample: 'Collaboration brings various points of view to the same code: a developer sees the intended path, a tester looks for the unintended one, a security specialist thinks about the attacker, and someone focused on accessibility notices that the MFA flow excludes screen-reader users. Each sees risks the others cannot. Delegating by expertise means cryptography, authentication and payment handling are implemented by people who understand them rather than improvised, which is where the most damaging defects otherwise originate. The quality of the solution improves because peer review and pair programming catch defects at the point of writing, when a fix costs minutes rather than after release, when it costs an incident response. For the enterprise, this produces improved products and services with fewer outages and breaches, improved work practices as review and automated testing become routine rather than exceptional, and higher productivity because engineering time is spent on new features instead of emergency patching. Secure patterns established on one project influence future development as reusable standards, and partners and customers are more willing to integrate with a system they can trust, increasing business interactivity.'
  });

  /* ===================== PROGRAMMING FOR THE WEB ======================= */
  add({
    id: 'WEB-Q9', area: 'WEB', points: ['WEB-1.1', 'WEB-2.16'], outcome: 'SE-12-03', marks: 3, format: 'short',
    stem: 'Explain what distinguishes a progressive web app from a standard interactive website, naming the technologies that make the difference.',
    criteria: [
      { t: 'Service worker provides offline capability and caching', kw: ['service worker', 'offline', 'cache'] },
      { t: 'Web app manifest makes it installable with an icon and its own window', kw: ['manifest', 'install', 'icon', 'home screen', 'standalone'] },
      { t: 'Other PWA properties — HTTPS requirement, push notifications, responsive across devices', kw: ['https', 'push', 'notification', 'responsive', 'secure'] }
    ],
    sample: 'A standard interactive website runs only while the browser is online and lives inside a browser tab. A progressive web app adds three things. A service worker — a script the browser runs in the background — intercepts network requests and serves cached responses, so the app shell loads instantly and continues to function offline or on an unreliable connection, and can synchronise changes when connectivity returns. A web app manifest (name, icons, start_url, display, theme colour) allows the user to install the app to their home screen or desktop, where it launches in its own window without browser chrome. It must be served over HTTPS, both because service workers are restricted to secure contexts and because an attacker able to modify a service worker would control the app permanently. PWAs can also receive push notifications and are responsive by design across phone, tablet and desktop — delivering much of the capability of a native app from one codebase, without an app store.'
  });
  add({
    id: 'WEB-Q10', area: 'WEB', points: ['WEB-1.5'], outcome: 'SE-12-03', marks: 3, format: 'short',
    stem: 'Investigate the effect of big data on web architecture, referring to data mining, metadata and streaming service management.',
    criteria: [
      { t: 'Architectural effect — distributed/horizontal scaling, NoSQL, caching, CDN', kw: ['distribut', 'scale', 'horizontal', 'nosql', 'cach', 'cdn', 'cluster'] },
      { t: 'Data mining — finding patterns to drive recommendation/forecasting, and its cost', kw: ['data mining', 'pattern', 'recommend', 'forecast', 'analy'] },
      { t: 'Metadata and/or streaming management (adaptive bitrate, edge caching, buffering)', kw: ['metadata', 'adaptive', 'bitrate', 'edge', 'buffer', 'stream'] }
    ],
    sample: 'Big data — high volume, velocity and variety — forces web architecture away from a single relational server. Systems scale horizontally across clusters, often using non-SQL stores that trade joins and strict schemas for distribution and write throughput, with caching layers and content delivery networks placing data near users. Data mining runs over this collected data to find patterns and correlations that drive recommendations, personalisation and demand forecasting; it requires separate analytical pipelines so that heavy queries do not slow the transactional system, and it raises the question of whether users understood that their behaviour would be analysed this way. Metadata — timestamps, device, geolocation, file size, viewing duration — is small individually but accumulates into a highly revealing profile, and is often retained long after the content it describes; it is a significant privacy exposure as well as an operational necessity. Streaming service management illustrates all of this: adaptive bitrate selects a quality that matches each viewer’s measured bandwidth, edge caching holds popular content close to viewers, load balancing spreads demand, and buffering absorbs variation — which together turn an enormous continuous data flow into a service that appears instant.'
  });
  add({
    id: 'WEB-Q11', area: 'WEB', points: ['WEB-2.7'], outcome: 'SE-12-05', marks: 3, format: 'short',
    stem: 'Explain the use and development of open-source software in relation to web development, including one benefit and one obligation it creates.',
    criteria: [
      { t: 'Defines open source — source available, licensed for use, modification and redistribution; community development', kw: ['source', 'licen', 'modif', 'redistribut', 'community', 'free'] },
      { t: 'Benefit — speed, cost, scrutiny/quality, avoiding vendor lock-in', kw: ['faster', 'cost', 'free', 'scrutin', 'quality', 'lock-in', 'reuse'] },
      { t: 'Obligation/risk — licence compliance (GPL copyleft vs MIT), attribution, unmaintained dependencies, supply-chain risk', kw: ['gpl', 'mit', 'copyleft', 'attribut', 'licence', 'license', 'unmaintain', 'supply chain', 'vulnerab'] }
    ],
    sample: 'Open-source software is released with its source code under a licence permitting use, inspection, modification and redistribution, and is typically developed publicly by a community that contributes fixes and features. Web development depends on it almost entirely: the server (nginx, Apache), runtimes (Node.js, Python), frameworks (React, Django, Express), databases (PostgreSQL, MySQL) and build tooling are nearly all open source. The benefits are speed and cost — a team can assemble a production stack in a day without licensing fees — plus the quality that comes from many developers scrutinising widely used code, and freedom from vendor lock-in since the code can be forked if a project is abandoned. The obligations are real, however. Each licence has terms: MIT and Apache require attribution and a copy of the licence, while GPL is copyleft and can require derived works to be released under the same licence, which may be incompatible with a commercial product. There is also a maintenance obligation: dependencies must be monitored and patched, because an unmaintained or compromised package becomes a supply-chain vulnerability in your application, as the 14-month-unpatched library in many real breaches demonstrates.'
  });
  add({
    id: 'WEB-Q12', area: 'WEB', points: ['WEB-2.6', 'WEB-2.4'], outcome: 'SE-12-06', marks: 1, format: 'mcq',
    stem: 'A team adopts a CSS framework offering predesigned classes such as `btn btn-primary`. Which statement best describes the main trade-off of this decision?',
    options: [
      'Faster, visually consistent development, but a larger payload and a look that is harder to differentiate from other sites',
      'Smaller file sizes, but the site can no longer be made responsive',
      'Improved accessibility guaranteed, but slower rendering in all browsers',
      'The framework removes the need for any server-side validation'
    ],
    answer: 0,
    why: 'Predesigned CSS classes deliver consistency and speed, at the cost of shipping styles the project may not use and producing a generic appearance unless customised. Responsiveness and accessibility are not guaranteed by a framework, and none of this affects server-side validation.'
  });
  add({
    id: 'WEB-Q13', area: 'WEB', points: ['WEB-2.12'], outcome: 'SE-12-02', marks: 2, format: 'short',
    stem: 'Write the shell commands that would create a project directory containing css and js subdirectories with an index.html file, and then search every file in the project for the text "TODO", showing line numbers.',
    criteria: [
      { t: 'Creates the nested directory structure (mkdir -p)', kw: ['mkdir'] },
      { t: 'Creates the file (touch or redirection) and performs a recursive search with line numbers (grep -rn)', kw: ['touch', 'grep'] }
    ],
    sample: 'mkdir -p project/css project/js\ntouch project/index.html project/css/app.css project/js/app.js\ngrep -rn "TODO" project/\n\nmkdir -p creates the parent and child directories in one command and does not fail if they already exist; touch creates the empty files. grep -r searches recursively through the directory, and -n prefixes each match with its line number. Adding -i would make the search case-insensitive and --include="*.js" would restrict it to JavaScript files.'
  });
  add({
    id: 'WEB-Q14', area: 'WEB', points: ['WEB-2.9', 'WEB-2.15'], outcome: 'SE-12-06', marks: 4, format: 'extended',
    media: scen('A small sporting club needs a website where non-technical volunteers can post weekly results and photos. One developer proposes building it from scratch with a custom back end; another proposes a content management system.'),
    stem: 'Evaluate the use of a content management system for this project, and describe how collaborative work practices between front-end and back-end developers would improve the outcome if the custom option were chosen instead.',
    criteria: [
      { t: 'CMS benefits — non-technical publishing, speed, cost, plugins, themes', kw: ['non-technical', 'volunteer', 'without code', 'fast', 'cheap', 'plugin', 'theme', 'wordpress'] },
      { t: 'CMS limitations — plugin bloat, performance, attack surface, update burden, less flexibility', kw: ['bloat', 'performance', 'attack surface', 'security', 'update', 'vulnerab', 'flexib', 'generic'] },
      { t: 'Reaches a justified recommendation for this specific client', kw: ['recommend', 'suited', 'therefore', 'best', 'should'] },
      { t: 'Describes collaboration practices — agreed API contract, mocks, shared version control, review, integration testing', kw: ['api', 'contract', 'mock', 'stub', 'version control', 'review', 'integration', 'parallel'] }
    ],
    sample: 'A CMS is well suited here. The decisive requirement is that non-technical volunteers publish content weekly, and a CMS provides exactly that: an authenticated editing interface, media handling, scheduled publishing and user roles, with no code written for any of it. A themed site can be live in days at near-zero cost, and plugins cover galleries, calendars and contact forms. The limitations must be weighed honestly: plugins accumulate and slow the site, each one enlarges the attack surface, and a CMS left unpatched is among the most commonly compromised software on the web — so the club must accept an ongoing update responsibility, or pay for managed hosting. Customisation beyond the theme can also become awkward. For a small club with simple, content-driven needs and no developer on hand, those costs are far smaller than the cost of maintaining bespoke software that no volunteer can modify, so the CMS is the right recommendation.\n\nIf the custom option were chosen, collaboration practice would determine whether it succeeded. The front-end and back-end developers should first agree an API contract — endpoints, request and response schemas, status codes and error formats — so that both can build in parallel rather than one waiting on the other. The front-end developer works against mock data matching that contract while the back end is written, and the back end is unit tested against the same schema. Both work in one version-controlled repository with feature branches and pull requests so each reviews the other’s changes, and integration tests run automatically against the real endpoints to catch mismatched assumptions early. Regular short check-ins resolve contract changes deliberately rather than discovering them at integration, which is where projects of this kind usually fail.'
  });

  /* ===================== SOFTWARE AUTOMATION =========================== */
  add({
    id: 'AUT-Q7', area: 'AUT', points: ['AUT-1.5'], outcome: 'SE-12-03', marks: 3, format: 'short',
    media: dgm('neuralnet'),
    stem: 'Using the diagram, describe how a neural network makes and improves a prediction, and compare its interpretability with that of a decision tree.',
    criteria: [
      { t: 'Forward pass — inputs multiplied by weights, summed with a bias, passed through an activation function layer by layer', kw: ['weight', 'sum', 'activation', 'forward', 'layer', 'bias'] },
      { t: 'Training — error/loss calculated and weights adjusted by backpropagation / gradient descent over many epochs', kw: ['backpropagat', 'error', 'loss', 'gradient', 'adjust', 'epoch', 'train'] },
      { t: 'Compares interpretability — decision tree rules are readable, neural network is a black box', kw: ['black box', 'interpret', 'explain', 'readable', 'rule', 'transparen'] }
    ],
    sample: 'Each input value is multiplied by the weight on its edge, the products arriving at a hidden node are summed with that node’s bias, and an activation function (such as a sigmoid or ReLU) is applied to produce the node’s output. Those outputs become the inputs to the next layer, and the process repeats until the output node produces a prediction — this is the forward pass. During training the prediction is compared with the known target to compute an error or loss; backpropagation then works backwards through the network calculating how much each weight contributed to that error, and gradient descent adjusts every weight slightly in the direction that reduces it. Repeating this over many examples and epochs gradually fits the network to the data. Interpretability is where the two models differ most: a decision tree can be read directly as a sequence of human-understandable rules, so a prediction can be explained and audited, whereas a neural network’s behaviour is distributed across thousands of weights with no individually meaningful value — it is a black box. That matters when a prediction affects someone’s employment, credit or healthcare, and is why an interpretable model is often preferred even at some cost in accuracy.'
  });
  add({
    id: 'AUT-Q8', area: 'AUT', points: ['AUT-1.6'], outcome: 'SE-12-02', marks: 1, format: 'mcq',
    media: code('text', `Training data (feature: mark, label: outcome)
  (45, FAIL) (52, PASS) (48, FAIL) (61, PASS) (44, FAIL) (58, PASS)

Classify a new point: mark = 50, using k = 3`),
    stem: 'Using K-nearest neighbour with k = 3, how is the new point classified and why?',
    options: [
      'PASS, because the mean of all marks exceeds 50',
      'FAIL, because the three closest marks are 48, 52 and 45, giving two FAIL labels to one PASS',
      'PASS, because the closest single mark is 52',
      'It cannot be classified because 50 does not appear in the training data'
    ],
    answer: 1,
    why: 'KNN measures distance to every labelled example and takes the majority label of the k closest. The distances from 50 are: 48→2, 52→2, 45→5, 44→6, 58→8, 61→11. The three nearest are 48 (FAIL), 52 (PASS) and 45 (FAIL) — a 2:1 majority for FAIL. KNN does not require the exact value to appear in the training data.'
  });
  add({
    id: 'AUT-Q9', area: 'AUT', points: ['AUT-1.3'], outcome: 'SE-12-03', marks: 2, format: 'short',
    media: scen('A medical research team has 200 000 chest X-rays. Only 4 000 have been labelled by radiologists, because expert labelling is slow and expensive.'),
    stem: 'Identify the model of training best suited to this situation and justify your choice.',
    criteria: [
      { t: 'Identifies semi-supervised learning', kw: ['semi-supervised', 'semi supervised'] },
      { t: 'Justifies — uses the small labelled set to interpret the large unlabelled set, since labelling is expensive', kw: ['small labelled', 'large unlabelled', 'expensive', 'expert', 'cost', 'both'] }
    ],
    sample: 'Semi-supervised learning is best suited. It uses the small labelled subset to establish the mapping from image to diagnosis, then exploits the structure of the much larger unlabelled set — for example by generating pseudo-labels for high-confidence predictions and retraining, or by pre-training on the unlabelled images and fine-tuning on the labelled ones. This is precisely the situation semi-supervised learning exists for: labels are expensive because they require scarce expert radiologist time, while raw data is abundant. Purely supervised learning would discard 98% of the available data, and purely unsupervised learning could cluster the images but could not attach a diagnosis to any cluster.'
  });
  add({
    id: 'AUT-Q10', area: 'AUT', points: ['AUT-3.2'], outcome: 'SE-12-05', marks: 4, format: 'extended',
    media: scen('A team is building an AI-assisted emergency app that guides members of the public through first aid while an ambulance is dispatched. It will be used across culturally diverse communities.'),
    stem: 'Explore how patterns in human behaviour should influence the development of this software, referring to psychological responses, the acute stress response, cultural protocols and belief systems.',
    criteria: [
      { t: 'Psychological responses — trust, automation bias, how confidence is displayed', kw: ['trust', 'automation bias', 'confidence', 'panic', 'reassur', 'uncanny'] },
      { t: 'Acute stress response — loss of fine motor control, narrowed attention, need for large targets and few choices', kw: ['stress', 'fight', 'flight', 'motor', 'attention', 'tunnel', 'large', 'simple', 'one step'] },
      { t: 'Cultural protocols — language, imagery, gender, touch, data sovereignty, community consultation', kw: ['cultur', 'language', 'translat', 'gender', 'imagery', 'protocol', 'community', 'indigenous'] },
      { t: 'Belief systems — values affecting consent, medical decisions; design must respect them', kw: ['belief', 'value', 'religio', 'consent', 'respect', 'refus'] }
    ],
    sample: 'Psychological responses shape whether the app is used at all. In a crisis users either over-trust automated instructions (automation bias) or abandon them at the first ambiguity, so the interface must state its confidence honestly, make clear when to stop and wait for the paramedic, and never present a guess with the same authority as a certainty. A calm, directive tone reduces panic; a cluttered or hesitant one increases it.\n\nUnder an acute stress response, users experience adrenaline-driven loss of fine motor control, narrowed ("tunnel") attention, degraded reading comprehension and poor short-term memory. The design must therefore present one instruction at a time in large type, with very large touch targets and minimal choices, avoid text entry and small controls entirely, repeat critical information aloud, and never rely on the user remembering a step from a previous screen. Timers and compression metronomes should be audible as well as visual.\n\nCultural protocols must be designed in, not translated on afterwards: language options with genuine translation rather than machine-rendered medical terms, imagery that depicts diverse users, awareness that touch between genders or assistance from a stranger may require different wording or an explanation of necessity, and — for Aboriginal and Torres Strait Islander communities — consultation and respect for Indigenous Cultural and Intellectual Property and data sovereignty in anything the app records.\n\nBelief systems affect what users will consent to, including attitudes to blood products, resuscitation and end-of-life decisions. The app should give information and offer options rather than issue absolute commands where a value judgement is involved, record consent appropriately, and be tested with members of the communities who will use it. The underlying principle is that the software is used by people in the worst minutes of their lives: assumptions about calm, literate, culturally homogeneous users are not simply inaccurate but dangerous.'
  });

  /* ===================== SOFTWARE ENGINEERING PROJECT ================== */
  add({
    id: 'SEP-Q7', area: 'SEP', points: ['SEP-2.7'], outcome: 'SE-12-09', marks: 3, format: 'short',
    stem: 'Investigate how software engineering solutions are quality assured. Refer to the three aspects named in the syllabus.',
    criteria: [
      { t: 'Defining criteria on which quality will be judged, before building', kw: ['criteria', 'defin', 'before', 'measurab', 'standard'] },
      { t: 'Ensuring requirements are met using a continual checking process', kw: ['continual', 'ongoing', 'throughout', 'each milestone', 'automated test', 'review'] },
      { t: 'Addressing compliance and legislative requirements', kw: ['complian', 'legislat', 'privacy', 'accessib', 'copyright', 'law', 'wcag'] }
    ],
    sample: 'Quality assurance begins by defining the criteria on which quality will be judged, before development starts and in measurable terms tied to the requirements — for example “every requirement R1–R12 has at least one passing test”, “all pages meet WCAG AA contrast”, “response under two seconds with 400 concurrent users”, and standards for code readability and documentation. It then operates as a continual checking process rather than an inspection at the end: requirements are reviewed at each milestone, the test suite runs automatically on every commit, code review precedes every merge, and the client sees working increments and confirms the solution is still solving their problem. Finally it must address compliance and legislative requirements: privacy obligations under the Privacy Act and the Australian Privacy Principles for any personal data collected, accessibility obligations, correct licensing and attribution for every third-party library used, and records retention where applicable. The distinction from testing is important — testing checks the product that was built, whereas quality assurance governs the process that builds it.'
  });
  add({
    id: 'SEP-Q8', area: 'SEP', points: ['SEP-2.6', 'SEP-2.5'], outcome: 'SE-12-09', marks: 4, format: 'short',
    media: scen('Four weeks before the deadline, a project team discovers that the feature the client considers most important cannot be delivered in the remaining time without cutting two other agreed features.'),
    stem: 'Explore the communication and ethical issues this situation raises, and describe how the team should respond.',
    criteria: [
      { t: 'Involving and empowering the client — the client decides the trade-off, not the team alone', kw: ['client', 'involve', 'empower', 'decide', 'priorit', 'consult'] },
      { t: 'Negotiating — scope, time and quality traded explicitly with options presented', kw: ['negotiat', 'trade', 'scope', 'option', 'alternativ'] },
      { t: 'Enabling feedback and early, honest disclosure rather than concealment', kw: ['feedback', 'early', 'honest', 'transparen', 'disclose', 'immediately', 'conceal'] },
      { t: 'Ethical dimension — honesty about progress, not delivering untested work, responsibility to stakeholders', kw: ['ethic', 'honest', 'integrity', 'untested', 'quality', 'responsib', 'stakeholder'] }
    ],
    sample: 'The first issue is timing and honesty. The ethical obligation is to disclose the problem to the client immediately rather than concealing it and hoping, because the client can only make a good decision while four weeks remain, and misreporting progress to avoid a difficult conversation is a breach of professional integrity. The second is that the decision is not the team’s to make alone: involving and empowering the client means presenting the situation clearly and letting them set the priority, since only they know the relative business value of the features. The team should prepare concrete, costed options rather than an open-ended problem — for example deliver the priority feature fully and defer the other two to a documented second release; deliver all three at reduced scope; or extend the deadline — and state the consequences of each honestly, including the quality risk. That is negotiation: scope, time and quality are traded explicitly rather than quality being silently sacrificed, which is the usual and worst outcome. Enabling feedback matters too: the team should ask why the client values that feature most, because the underlying need may be satisfiable in a simpler way. Finally there is an ethical limit on the options — shipping untested code to meet a date transfers risk to the users of the system, and no deadline justifies that.'
  });
  add({
    id: 'SEP-Q9', area: 'SEP', points: ['SEP-3.7', 'SEP-2.5'], outcome: 'SE-12-09', marks: 3, format: 'short',
    stem: 'Explore strategies for responding to difficulties when developing a software engineering solution, and explain the academic integrity obligations attached to each.',
    criteria: [
      { t: 'Looking for a solution online, with critical evaluation of what is found', kw: ['online', 'search', 'documentation', 'forum', 'stack overflow', 'evaluate'] },
      { t: 'Collaboration with peers and/or outsourcing a component', kw: ['peer', 'collaborat', 'outsourc', 'help', 'teacher'] },
      { t: 'Acknowledgement/attribution and licence compliance for anything used', kw: ['acknowledge', 'attribut', 'cite', 'reference', 'licen', 'own work', 'comment'] }
    ],
    sample: 'The first strategy is searching online — official documentation, forums and existing open-source implementations. This is legitimate and is what professional developers do, but the code found must be critically evaluated rather than pasted: you must understand what it does, confirm it is correct and secure for your context (much published example code omits validation), and check its licence. The second is collaboration with peers and teachers — explaining the problem aloud often solves it, and a peer reviewing your code sees assumptions you cannot. The third is outsourcing a component, such as using an established library for authentication or charting rather than writing it yourself, which is usually the right engineering decision because specialists have already handled the edge cases. The obligation attached to all three is acknowledgement: any code you did not write must be identified in the source as a comment with its origin and licence, and documented in the portfolio, with a clear statement of what you adapted and what you wrote. For an HSC major project this is the difference between appropriate practice and academic misconduct, and it also protects you legally, since using GPL-licensed code imposes obligations on the whole work.'
  });
  add({
    id: 'SEP-Q10', area: 'SEP', points: ['SEP-4.2'], outcome: 'SE-12-08', marks: 3, format: 'short',
    media: code('python', `# Builds an HTML table of 10 000 results
html = ""
for r in results:
    html = html + "<tr><td>" + r.name + "</td><td>" + str(r.mark) + "</td></tr>"
    lookup = [s for s in students if s.id == r.student_id][0]   # inside the loop
    html = html + "<!-- " + lookup.email + " -->"`),
    stem: 'Identify two language-dependent optimisation techniques that would improve this Python code, and explain the improvement each makes.',
    criteria: [
      { t: 'Replaces repeated string concatenation with a list + join (or f-strings/join)', kw: ['join', 'list', 'append', 'concat', 'f-string', 'immutab'] },
      { t: 'Removes the linear lookup from inside the loop by building a dictionary once', kw: ['dictionary', 'dict', 'hash', 'index', 'outside the loop', 'precompute', 'o(1)'] },
      { t: 'Explains the performance effect in terms of repeated work / complexity', kw: ['o(n', 'quadratic', 'repeat', 'each iteration', 'faster', 'slow'] }
    ],
    sample: 'First, the repeated string concatenation is quadratic: Python strings are immutable, so every `html = html + …` allocates a new string and copies everything built so far, meaning the cost grows with the square of the number of rows. Collecting the fragments in a list and joining once — `parts.append(f"<tr><td>{r.name}</td><td>{r.mark}</td></tr>")` then `html = "".join(parts)` — makes it linear and is also more readable. Second, the list comprehension inside the loop scans every student to find one match, so with 10 000 results and 10 000 students it performs up to a hundred million comparisons. Building a dictionary once before the loop — `by_id = {s.id: s for s in students}` — turns each lookup into an average O(1) hash access. Together these change the routine from quadratic to linear and typically reduce runtime from minutes to a fraction of a second, with no change to the output.'
  });
  add({
    id: 'SEP-Q11', area: 'SEP', points: ['SEP-1.3'], outcome: 'SE-12-01', marks: 3, format: 'short',
    media: scen('A national retail chain with 300 stores is replacing its point-of-sale software. Staff training is a significant cost and an outage during trading hours would be extremely damaging.'),
    stem: 'Recommend an implementation method for this rollout and justify it by comparing it with the alternatives.',
    criteria: [
      { t: 'Recommends pilot and/or phased, appropriate to 300 stores', kw: ['pilot', 'phased'] },
      { t: 'Rejects direct implementation because of unacceptable risk across 300 stores', kw: ['direct', 'risk', 'no fallback', 'all at once'] },
      { t: 'Addresses parallel — lowest risk but double operation cost at this scale', kw: ['parallel', 'cost', 'double', 'two systems', 'expensive'] }
    ],
    sample: 'A pilot implementation is recommended, followed by a phased rollout. The new system is introduced in a small number of representative stores first, so that defects, training gaps and hardware problems surface where they affect a handful of sites rather than all 300, and the experience informs the training materials before the main rollout. Stores are then converted in phases, region by region, with support concentrated on each group as it goes live. Direct implementation should be rejected outright: switching all 300 stores at once with no fallback means a single undiscovered defect halts trading nationally, which the scenario identifies as extremely damaging, and support staff could not possibly cover 300 simultaneous first days. Parallel implementation is the lowest-risk option in principle, since the old system remains available and outputs can be compared, but running both point-of-sale systems through every transaction in 300 stores doubles the operational workload for every cashier and is impractical at this scale — though it may be worth using parallel operation for a short period within the pilot stores alone, which combines the containment of a pilot with the safety net of parallel running.'
  });
  add({
    id: 'SEP-Q12', area: 'SEP', points: ['SEP-2.9'], outcome: 'SE-12-01', marks: 3, format: 'short',
    stem: 'Explain the contribution of back-end engineering to the success and ease of software development, referring to technology used, error handling, interfacing with the front end and security engineering.',
    criteria: [
      { t: 'Technology selection affects what can be built, scaled and maintained', kw: ['technology', 'framework', 'language', 'database', 'scale', 'ecosystem'] },
      { t: 'Error handling makes failures recoverable and diagnosable rather than silent', kw: ['error handling', 'exception', 'log', 'recover', 'graceful', 'crash'] },
      { t: 'Interfacing with the front end through a defined API enables parallel work', kw: ['api', 'contract', 'interface', 'json', 'parallel', 'endpoint'] },
      { t: 'Security engineering belongs in the back end because it is the trust boundary', kw: ['security', 'trust', 'validation', 'authoris', 'server-side'] }
    ],
    sample: 'The technology chosen for the back end — language, framework, database and hosting — determines how quickly features can be built, how far the system can scale, and how easily another developer can maintain it; a mature framework supplies routing, authentication, migrations and templating that would otherwise consume most of the project. Error handling is where back-end quality becomes visible: catching specific exceptions, logging detail server-side for diagnosis, returning meaningful status codes and failing gracefully rather than crashing means problems are recoverable and traceable instead of silent, which dramatically shortens debugging. A well-defined interface to the front end — a documented API with stable endpoints, request and response schemas and consistent error formats — allows the front end to be developed in parallel against mocks and prevents the integration failures that otherwise appear late. Security engineering has to live here because the back end is the trust boundary: it is the only place where input validation, authentication, authorisation and data protection cannot be bypassed by a user who controls their own browser. Together these make the difference between a project that integrates smoothly and one that stalls at integration.'
  });
  add({
    id: 'SEP-Q13', area: 'SEP', points: ['SEP-4.3', 'SEP-3.8'], outcome: 'SE-12-09', marks: 4, format: 'short',
    media: log(`User testing — 6 participants, task: place a canteen order
P1  took 4 attempts to find the "collect time" field       severity: high
P2  assumed the order was placed before pressing Confirm   severity: high
P3  asked for allergen information on the item page        severity: medium
P4  assumed the order was placed before pressing Confirm   severity: high
P5  wanted a "repeat last order" button                    severity: low
P6  could not read the grey price text in sunlight         severity: medium`),
    stem: 'Analyse this user testing feedback and explain how you would respond to it. Your answer must show that you have prioritised rather than simply listed.',
    criteria: [
      { t: 'Groups/themes the feedback rather than treating each row separately', kw: ['theme', 'group', 'two participants', 'both', 'pattern', 'common'] },
      { t: 'Prioritises by severity and frequency — the Confirm misunderstanding first', kw: ['priorit', 'severity', 'first', 'high', 'most important', 'confirm'] },
      { t: 'Proposes specific design changes tied to the findings', kw: ['change', 'button', 'contrast', 'allergen', 'label', 'confirmation', 'redesign'] },
      { t: 'Justifies what will NOT be actioned and why / defers it as an innovation', kw: ['not', 'defer', 'later', 'low', 'out of scope', 'future', 'justif'] }
    ],
    sample: 'Grouping the findings rather than reading them as six separate items reveals three themes. The dominant one is a confirmation problem: P2 and P4 both believed the order was already placed before pressing Confirm, and P1’s four attempts to find the collect time belong to the same cause — the ordering flow does not make the current step or the remaining steps visible. This is both the highest severity and the most frequent, so it is actioned first: add a visible step indicator, make the Confirm button the single prominent action on the final screen, and show an unambiguous confirmation screen with the order number and collect time after submission. The second theme is information presentation: P6 could not read grey price text in sunlight, which is a contrast failure, and P3 expected allergen information on the item page. Both are medium severity but cheap to fix and carry real risk — allergen data is a safety matter, not a convenience — so prices move to a contrast ratio above 4.5:1 and allergens are added to the item page in this iteration. The third is a feature request: P5’s "repeat last order" button. One participant, low severity, and it adds scope rather than fixing a defect, so it will not be built now; it is recorded in the backlog and proposed in the portfolio as the innovative extension with a UI prototype, justified by the fact that most canteen orders are repeats. Each decision, including the one not to act, is recorded against the finding so the reasoning is auditable, and the two high-severity changes will be re-tested with new participants to confirm the fix worked rather than assumed.'
  });
  add({
    id: 'SEP-Q14', area: 'SEP', points: ['SEP-1.2', 'SEP-3.2'], outcome: 'SE-12-06', marks: 2, format: 'short',
    stem: 'Explain the purpose of storyboards and mind-mapping when developing ideas for a software solution, and state when each is most useful.',
    criteria: [
      { t: 'Mind-mapping — divergent idea generation, showing relationships between concepts, used early', kw: ['mind map', 'brainstorm', 'idea', 'relationship', 'early', 'divergent', 'branch'] },
      { t: 'Storyboard — sequences the user journey screen by screen, used when shaping the interface', kw: ['storyboard', 'screen', 'sequence', 'journey', 'user', 'flow', 'interface'] }
    ],
    sample: 'Mind-mapping is used at the start, when the problem is still open. Ideas branch outward from the central problem, showing relationships between features, users and constraints without committing to any of them. This matters because judgement suppresses invention: as soon as a team starts evaluating ideas it stops generating them, so a mind map deliberately separates the two activities and a wider set of options survives to be considered. It is a divergent tool, and it belongs before requirements are fixed, since its value disappears once the solution has already been chosen. A storyboard comes later, once the chosen solution is being shaped: it sequences the user’s journey screen by screen, showing what the user sees, what they do and what the system responds with at each step. Laying the journey out in order exposes missing steps, confusing transitions and unnecessary screens while they are still cheap to change, because nothing has been built yet. It is also the most productive thing to put in front of a client, as people can react accurately to a picture of what they will use but struggle to critique an abstract written requirements list.'
  });

  A.State && A.State.logEvent && A.State.logEvent('info', 'BANK', 'Extended question bank loaded');
})(window.APP = window.APP || {});
