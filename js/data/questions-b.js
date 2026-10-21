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
    id: 'PF-Q10', area: 'PF', points: ['PF-3.1'], outcome: 'SE-11-04', marks: 3, format: 'short',
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
    sample: 'A structure chart shows the hierarchy of modules and the data couples and control flags crossing each interface, so it documents both the decomposition and the parameters passed. An abstraction and refinement diagram shows the same solution at increasing levels of detail until each step can be coded. Top-down design decomposes the whole problem into subproblems, whereas bottom-up design composes a solution from components that already exist.'
  });
  add({
    id: 'PF-Q14', area: 'PF', points: ['PF-1.2'], outcome: 'SE-11-06', marks: 4, format: 'short',
    stem: 'Evaluate the use of online code collaboration tools in a software development team, referring to both their benefits and their limitations.',
    criteria: [
      { t: 'Names specific tools/features (hosted VCS, pull requests, issue tracking, live share, CI)', kw: ['github', 'gitlab', 'bitbucket', 'pull request', 'issue', 'live share', 'replit', 'ci'] },
      { t: 'States benefits — parallel work, review, traceability, remote collaboration', kw: ['parallel', 'review', 'history', 'traceab', 'remote', 'quality'] },
      { t: 'States limitations — connectivity, learning curve, security of code, merge conflicts', kw: ['internet', 'connectivity', 'learning curve', 'security', 'public', 'conflict', 'cost'] }
    ],
    sample: 'Hosted version control such as GitHub provides branching, pull requests and issue tracking, and real-time editors such as Live Share allow pair programming. The benefits are substantial: members work in parallel without overwriting each other, every change is attributable through the history giving traceability, and review raises quality before merging. The limitations are real too — the tools need reliable internet, merge conflicts carry a learning curve, and a misconfigured repository can expose private code publicly. On balance the traceability and review benefits outweigh these for any team larger than one.'
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
    sample: 'The code is correct but inefficient. The nested loops compare every record with every other, so the work grows with the square of the input: 10 000 records require a hundred million comparisons. The \'not in duplicates\' test adds a further linear search inside the loop. A single pass using a set is far better — add each record to \'seen\' and add to \'duplicates\' when it is already there — because set membership is an average O(1) hash lookup, making the function linear. The trade-off is extra memory for the two sets, which is almost always worth it, and the output is unchanged.'
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
    sample: 'Split it into one subroutine per task: load_marks(path), calculate_average(marks), grade(average) and save_report(path, average), leaving main() as four calls that read as a summary of the program. This improves maintenance because a change to the grading boundaries touches only grade() and a change to the file format touches only load_marks(), so each can be unit tested in isolation with known inputs and reused elsewhere.'
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
    sample: 'The external entity is the Student. The processes are 1.0 Place order and 2.0 Process payment, and the data stores are D1 Orders, D2 Accounts and D3 Menu, with labelled flows such as order details and price between them. A data flow diagram does not show control flow: the sequence in which processes run, the decisions that trigger them or any timing.'
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
    sample: 'In medicine, surgical robots use force sensors and cameras to scale the surgeon\'s movements, driving servo-actuated instruments and micro-grippers. In agriculture, autonomous harvesters use GPS and machine-vision cameras to detect ripeness and obstacles, actuating steering and hydraulic cutting arms. In manufacturing, warehouse systems use proximity and load sensors with motor-driven conveyors and robotic arms to sort and palletise.'
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
    sample: 'A GPIO pin is a logic output rated for only a few tens of milliamps, whereas a DC motor draws hundreds at stall, so the pin was overloaded and its driver circuitry failed. The wiring diagram should have shown a separate supply for the motor switched by a transistor or H-bridge driver, with the microcontroller pin connected only to the driver\'s logic input, a flyback diode across the motor to absorb back-EMF, and a common ground between the two supplies.'
  });
  add({
    id: 'MEC-Q9', area: 'MEC', points: ['MEC-3.3', 'MEC-3.7'], outcome: 'SE-11-06', marks: 4, format: 'short',
    stem: 'Justify the use of a simulation and prototype before building the physical mechatronic system, and outline two requirements of a user interface used to control such a system.',
    criteria: [
      { t: 'Simulation lets code be tested before hardware exists, cheaply and repeatably', kw: ['before', 'hardware', 'cheap', 'cost', 'repeat', 'faster', 'parallel'] },
      { t: 'Simulation allows dangerous or edge-case failures to be tested safely', kw: ['danger', 'safe', 'failure', 'edge case', 'damage', 'risk'] },
      { t: 'Names two UI requirements (clear state feedback, emergency stop, confirmation of destructive actions, latency, accessibility)', kw: ['emergency stop', 'e-stop', 'feedback', 'status', 'confirm', 'latency', 'accessib', 'clear'] }
    ],
    sample: 'Simulation lets the control algorithms be tested before the hardware exists, so the build is not a bottleneck, and it is far cheaper to iterate in software than to rebuild a mechanism. It also allows dangerous failure cases — a runaway motor, a sensor returning nonsense — to be tested safely and repeatably, which could not be done on real hardware. The prototype then checks the assumptions the simulation made about friction and sensor noise. The control UI must give clear feedback of the system\'s current state, and must provide an always-available emergency stop that cuts actuator power independently of the software.'
  });

  /* ===================== SECURE SOFTWARE ARCHITECTURE ================== */
  add({
    id: 'SSA-Q8', area: 'SSA', points: ['SSA-1.2'], outcome: 'SE-12-01', marks: 4, format: 'short',
    stem: 'Security cannot be added to a product once it is finished. Explain how security is built into the fundamental software development steps, describing one security activity for each of four named steps.',
    criteria: [
      { t: 'Requirements/specifications — security and privacy requirements stated, threat modelling, compliance obligations', kw: ['requirement', 'specification', 'threat model', 'compliance', 'privacy requirement'] },
      { t: 'Design — security and privacy by design, least privilege, trust boundaries', kw: ['design', 'by design', 'least privilege', 'architecture', 'trust boundar'] },
      { t: 'Development/testing — secure coding practices, code review, SAST/DAST, penetration testing', kw: ['code review', 'sast', 'dast', 'penetration', 'validation', 'secure coding', 'unit test'] },
      { t: 'Installation/maintenance — hardened configuration, patching, monitoring, incident response', kw: ['harden', 'patch', 'monitor', 'update', 'maintenance', 'configuration', 'incident'] }
    ],
    sample: 'At requirements definition, security and privacy requirements are captured alongside functional ones and threat modelling identifies who would attack the system, because a requirement that is never stated is never built. At design, least privilege and trust boundaries are decided, since these are architectural and costly to retrofit. During development and testing, code is peer reviewed and SAST and DAST run in the pipeline, so defects are found when they are cheap. At maintenance, dependencies are patched within a defined timeframe and logs monitored, because a known flaw left unpatched is how most breaches occur.'
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
    sample: 'This is broken access control, specifically an insecure direct object reference: the endpoint authenticates the session but never checks that the invoice belongs to the requester, so incrementing the ID exposes other customers\' invoices. Rewritten:\n\napp.get(\'/api/invoices/:id\', requireAuth, async (req, res) => {\n  const id = String(req.params.id);\n  if (!/^[0-9a-f]{24}$/.test(id)) return res.status(400).json({ error: \'Invalid id\' });\n  const invoice = await Invoice.findOne({ _id: id, ownerId: req.user.id })\n                               .select(\'number issuedAt total status\');\n  if (!invoice) return res.status(404).json({ error: \'Not found\' });\n  res.json(invoice);\n});\n\nThe ownership check is part of the query, the id is validated, only needed fields are returned, and a missing and a forbidden invoice both return 404 so nothing is leaked.'
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
    sample: 'This is a timing side channel attack. The loop returns at the first differing character, so the response time grows with the number of leading characters that matched. An attacker measuring those times can recover the token character by character, reducing the search from exponential to linear. The fix is a constant-time comparison such as hmac.compare_digest, which always examines the full length, with rate limiting as a further defence.'
  });
  add({
    id: 'SSA-Q12', area: 'SSA', points: ['SSA-3.1', 'SSA-3.2'], outcome: 'SE-12-05', marks: 4, format: 'short',
    stem: 'Explain how collaboration improves the development of safe and secure software, and describe the benefits an enterprise gains as a result.',
    criteria: [
      { t: 'Various points of view — different roles identify different risks', kw: ['point of view', 'perspective', 'different', 'tester', 'security specialist', 'accessibility'] },
      { t: 'Delegating tasks based on expertise', kw: ['expertise', 'delegat', 'specialist', 'skill'] },
      { t: 'Quality of the solution — defects found earlier and more cheaply', kw: ['quality', 'earlier', 'cheaper', 'review', 'defect'] },
      { t: 'Enterprise benefit named (improved products, productivity, work practices, business interactivity, influence on future development)', kw: ['productiv', 'work practice', 'product', 'service', 'business interactivity', 'future', 'reputation'] }
    ],
    sample: 'Collaboration brings different points of view to the same code: a tester looks for the unintended path and a security specialist thinks like the attacker, so each sees risks the author cannot. Delegating by expertise means cryptography is written by someone who understands it rather than improvised. Review raises the quality of the solution because defects are caught at the point of writing, when a fix costs minutes instead of an incident response. The enterprise therefore gains improved products with fewer outages, higher productivity as engineers stop firefighting, and better work practices as review becomes routine.'
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
    sample: 'A standard website runs only while online and lives in a browser tab. A PWA adds a service worker, which caches the app shell so it loads instantly and works offline, and a web app manifest, which makes it installable with its own icon and window. It must be served over HTTPS because service workers are restricted to secure contexts, and it can also receive push notifications and is responsive across devices.'
  });
  add({
    id: 'WEB-Q10', area: 'WEB', points: ['WEB-1.5'], outcome: 'SE-12-03', marks: 3, format: 'short',
    stem: 'Explain the effect of big data on web architecture, referring to data mining, metadata and streaming service management.',
    criteria: [
      { t: 'Architectural effect — distributed/horizontal scaling, NoSQL, caching, CDN', kw: ['distribut', 'scale', 'horizontal', 'nosql', 'cach', 'cdn', 'cluster'] },
      { t: 'Data mining — finding patterns to drive recommendation/forecasting, and its cost', kw: ['data mining', 'pattern', 'recommend', 'forecast', 'analy'] },
      { t: 'Metadata and/or streaming management (adaptive bitrate, edge caching, buffering)', kw: ['metadata', 'adaptive', 'bitrate', 'edge', 'buffer', 'stream'] }
    ],
    sample: 'Big data forces web architecture to scale horizontally across distributed clusters, often using NoSQL stores with caching layers and a CDN, because a single relational server cannot absorb the volume and velocity. Data mining then analyses that store to find patterns driving recommendations and forecasting, which needs separate pipelines so heavy queries do not slow the live system. Metadata accumulates into a revealing profile, and streaming management uses adaptive bitrate and edge caching with buffering to deliver media at scale.'
  });
  add({
    id: 'WEB-Q11', area: 'WEB', points: ['WEB-2.7'], outcome: 'SE-12-05', marks: 3, format: 'short',
    stem: 'Explain the use and development of open-source software in relation to web development, including one benefit and one obligation it creates.',
    criteria: [
      { t: 'Defines open source — source available, licensed for use, modification and redistribution; community development', kw: ['source', 'licen', 'modif', 'redistribut', 'community', 'free'] },
      { t: 'Benefit — speed, cost, scrutiny/quality, avoiding vendor lock-in', kw: ['faster', 'cost', 'free', 'scrutin', 'quality', 'lock-in', 'reuse'] },
      { t: 'Obligation/risk — licence compliance (GPL copyleft vs MIT), attribution, unmaintained dependencies, supply-chain risk', kw: ['gpl', 'mit', 'copyleft', 'attribut', 'licence', 'license', 'unmaintain', 'supply chain', 'vulnerab'] }
    ],
    sample: 'Open-source software is released with its source code under a licence permitting use, modification and redistribution, and is developed publicly by a community. The benefit is speed and cost, because a team can assemble a production stack in a day with no licence fee and many developers scrutinising widely used code. The obligation is licence compliance and maintenance: MIT requires attribution whereas GPL is copyleft and can bind a derived work, and an unmaintained dependency becomes a supply-chain vulnerability.'
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
    sample: 'mkdir -p project/css project/js\ntouch project/index.html\ngrep -rn "TODO" project/\n\nmkdir -p creates the parents and children in one command; grep -r searches recursively and -n prefixes each match with its line number.'
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
    sample: 'A CMS suits this client. The decisive requirement is that non-technical volunteers publish weekly, and a CMS gives them an editing interface, media handling and user roles with no code, live in days at near-zero cost. The limitations are real: plugins accumulate and slow the site, each enlarges the attack surface, and an unpatched CMS is commonly compromised, so the club accepts an update burden. Those costs are smaller than maintaining bespoke software no volunteer can change, so a CMS is recommended. If the custom option were chosen instead, the developers should agree an API contract first so the front end can build against mocks in parallel, share one repository with pull-request review, and run integration tests.'
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
    sample: 'Each input is multiplied by its weight, the products are summed with the node\'s bias, and an activation function is applied; those outputs feed the next layer until a prediction appears. Training compares the prediction with the target, then backpropagation and gradient descent adjust every weight over many epochs to reduce the error. A decision tree can be read directly as rules, whereas a neural network spreads its behaviour across thousands of weights, which makes it a black box.'
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
    id: 'AUT-Q9', area: 'AUT', points: ['AUT-1.3'], outcome: 'SE-12-03', marks: 4, format: 'short',
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
    stem: 'Discuss how patterns in human behaviour should influence the development of this app, referring to psychological responses, the acute stress response, cultural protocols and belief systems.',
    criteria: [
      { t: 'Psychological responses — trust, automation bias, how confidence is displayed', kw: ['trust', 'automation bias', 'confidence', 'panic', 'reassur', 'uncanny'] },
      { t: 'Acute stress response — loss of fine motor control, narrowed attention, need for large targets and few choices', kw: ['stress', 'fight', 'flight', 'motor', 'attention', 'tunnel', 'large', 'simple', 'one step'] },
      { t: 'Cultural protocols — language, imagery, gender, touch, data sovereignty, community consultation', kw: ['cultur', 'language', 'translat', 'gender', 'imagery', 'protocol', 'community', 'indigenous'] },
      { t: 'Belief systems — values affecting consent, medical decisions; design must respect them', kw: ['belief', 'value', 'religio', 'consent', 'respect', 'refus'] }
    ],
    sample: 'Psychological responses matter because users in a crisis either over-trust the instructions, through automation bias, or abandon them, so the app must state its confidence honestly rather than induce panic. Under the acute stress response users lose fine motor control and narrow their attention, so it needs one instruction at a time, large targets and no text entry. Cultural protocols require genuine language translation, inclusive imagery and community consultation, including Indigenous data sovereignty. Belief systems affect consent to resuscitation or blood products, so the app should inform and offer options rather than command. These choices improve uptake; however, they also risk slowing the interface, so each must be tested with the communities who will use it.'
  });

  /* ===================== SOFTWARE ENGINEERING PROJECT ================== */
  add({
    id: 'SEP-Q7', area: 'SEP', points: ['SEP-2.7'], outcome: 'SE-12-09', marks: 3, format: 'short',
    stem: 'Explain how a software engineering solution is quality assured, referring to the criteria on which quality is judged, the process of continual checking, and compliance and legislative requirements.',
    criteria: [
      { t: 'Defining criteria on which quality will be judged, before building', kw: ['criteria', 'defin', 'before', 'measurab', 'standard'] },
      { t: 'Ensuring requirements are met using a continual checking process', kw: ['continual', 'ongoing', 'throughout', 'each milestone', 'automated test', 'review'] },
      { t: 'Addressing compliance and legislative requirements', kw: ['complian', 'legislat', 'privacy', 'accessib', 'copyright', 'law', 'wcag'] }
    ],
    sample: 'Quality assurance begins by defining measurable criteria before building, because a team cannot judge quality against a standard it never agreed on. It then checks continually rather than once at the end: requirements are reviewed at each milestone and automated tests run on every commit, so a defect is caught while it is still cheap to fix. It must also address compliance and legislative requirements such as privacy and accessibility, since these are obligations rather than preferences.'
  });
  add({
    id: 'SEP-Q8', area: 'SEP', points: ['SEP-2.6', 'SEP-2.5'], outcome: 'SE-12-09', marks: 4, format: 'short',
    media: scen('Four weeks before the deadline, a project team discovers that the feature the client considers most important cannot be delivered in the remaining time without cutting two other agreed features.'),
    stem: 'Discuss the communication and ethical issues this situation raises, and recommend how the team should respond.',
    criteria: [
      { t: 'Involving and empowering the client — the client decides the trade-off, not the team alone', kw: ['client', 'involve', 'empower', 'decide', 'priorit', 'consult'] },
      { t: 'Negotiating — scope, time and quality traded explicitly with options presented', kw: ['negotiat', 'trade', 'scope', 'option', 'alternativ'] },
      { t: 'Enabling feedback and early, honest disclosure rather than concealment', kw: ['feedback', 'early', 'honest', 'transparen', 'disclose', 'immediately', 'conceal'] },
      { t: 'Ethical dimension — honesty about progress, not delivering untested work, responsibility to stakeholders', kw: ['ethic', 'honest', 'integrity', 'untested', 'quality', 'responsib', 'stakeholder'] }
    ],
    sample: 'The team must disclose immediately rather than conceal the problem, because the client can only make a good decision while four weeks remain, and misreporting progress breaches professional integrity. The decision is not the team\'s alone: involving and empowering the client means presenting costed options — deliver the priority feature and defer the other two, reduce scope across all three, or extend the deadline — and negotiating the trade-off between scope, time and quality explicitly. Ethically there is a limit on those options, since shipping untested work transfers risk to users. Honest early disclosure costs the team credibility now but protects the client and the solution, so it is the right response.'
  });
  add({
    id: 'SEP-Q9', area: 'SEP', points: ['SEP-3.7', 'SEP-2.5'], outcome: 'SE-12-09', marks: 3, format: 'short',
    stem: 'Outline three strategies for responding to difficulties when developing a software engineering solution, and explain the academic integrity obligation attached to each.',
    criteria: [
      { t: 'Looking for a solution online, with critical evaluation of what is found', kw: ['online', 'search', 'documentation', 'forum', 'stack overflow', 'evaluate'] },
      { t: 'Collaboration with peers and/or outsourcing a component', kw: ['peer', 'collaborat', 'outsourc', 'help', 'teacher'] },
      { t: 'Acknowledgement/attribution and licence compliance for anything used', kw: ['acknowledge', 'attribut', 'cite', 'reference', 'licen', 'own work', 'comment'] }
    ],
    sample: 'Searching online documentation and forums is legitimate, but what is found must be critically evaluated and understood rather than pasted, and acknowledged in a comment with its source and licence. Collaborating with peers or a teacher often solves the problem faster, and their contribution must be stated. Outsourcing a component to an established library is usually good engineering, so the library and its licence must be referenced. Acknowledgement matters because unattributed code is academic misconduct and may also breach the licence.'
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
    sample: 'First, the repeated string concatenation is quadratic because Python strings are immutable, so each += copies everything built so far; collecting fragments in a list and using join() once makes it linear. Second, the list comprehension inside the loop scans every student on each iteration, so building a dictionary keyed by id once before the loop turns each lookup into an O(1) hash access. Together these take the routine from minutes to a fraction of a second.'
  });
  add({
    id: 'SEP-Q11', area: 'SEP', points: ['SEP-1.3'], outcome: 'SE-12-01', marks: 4, format: 'short',
    media: scen('A national retail chain with 300 stores is replacing its point-of-sale software. Staff training is a significant cost and an outage during trading hours would be extremely damaging.'),
    stem: 'Recommend an implementation method for this rollout and justify it by comparing it with the alternatives.',
    criteria: [
      { t: 'Recommends pilot and/or phased, appropriate to 300 stores', kw: ['pilot', 'phased'] },
      { t: 'Rejects direct implementation because of unacceptable risk across 300 stores', kw: ['direct', 'risk', 'no fallback', 'all at once'] },
      { t: 'Addresses parallel — lowest risk but double operation cost at this scale', kw: ['parallel', 'cost', 'double', 'two systems', 'expensive'] }
    ],
    sample: 'I would recommend a pilot followed by a phased rollout. The new system goes live in a few representative stores first, so defects and training gaps surface where they affect a handful of sites rather than all 300, and the experience improves the training before the wider rollout. Direct implementation must be rejected because a single undiscovered defect would halt trading nationally with no fallback. Parallel running is the lowest-risk option in principle, but processing every transaction through two point-of-sale systems doubles the workload for every cashier, so its cost is impractical at this scale, though it suits the pilot stores alone.'
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
    sample: 'The technology chosen determines how fast features can be built and how far the system scales, because a mature framework supplies routing and authentication the team would otherwise write. Error handling makes failures recoverable and diagnosable through logging rather than silent crashes. A defined API lets the front end work in parallel. Security engineering belongs here because the back end is the trust boundary, so validation and authorisation cannot be bypassed.'
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
    sample: 'Grouped rather than listed, the six findings form three themes. The dominant one is confirmation: two participants believed the order was placed before pressing Confirm, and P1\'s four attempts to find the collect time share that cause, so this is actioned first because it is both the most frequent and the highest severity. I would add a step indicator, make Confirm the single prominent action, and show an unambiguous confirmation screen. The second theme is information presentation — grey prices failing contrast and missing allergen data — both cheap to fix and one is a safety matter. The repeat-order request is a single low-severity feature, so it is not built now; it is recorded and proposed as the innovative extension.'
  });
  add({
    id: 'SEP-Q14', area: 'SEP', points: ['SEP-1.2', 'SEP-3.2'], outcome: 'SE-12-06', marks: 3, format: 'short',
    stem: 'Explain the purpose of storyboards and mind-mapping when developing ideas for a software solution, and state when each is most useful.',
    criteria: [
      { t: 'Mind-mapping — divergent idea generation, showing relationships between concepts, used early', kw: ['mind map', 'brainstorm', 'idea', 'relationship', 'early', 'divergent', 'branch'] },
      { t: 'Storyboard — sequences the user journey screen by screen, used when shaping the interface', kw: ['storyboard', 'screen', 'sequence', 'journey', 'user', 'flow', 'interface'] }
    ],
    sample: 'Mind-mapping is used early, while the problem is still open: ideas branch from the central problem showing relationships between features and constraints, which matters because judgement suppresses invention, so separating generation from evaluation leaves more options to consider. A storyboard comes later, once the solution is chosen, sequencing the user journey screen by screen; laying it out in order exposes missing steps and confusing transitions while they are still cheap to change, since nothing has been built.'
  });

  A.State && A.State.logEvent && A.State.logEvent('info', 'BANK', 'Extended question bank loaded');
})(window.APP = window.APP || {});
