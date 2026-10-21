/* ===========================================================================
   notes.js — Structured learning resources (modules + notes)
   Every lesson declares `points: []` — the syllabus dot points it teaches.
   Completing a lesson contributes mastery evidence to those dot points.
   Block types: h (sub-heading), p, ul, ol, code, table, callout, terms, svg
   =========================================================================== */
(function (A) {
  'use strict';

  const L = (id, areaId, title, mins, points, body) =>
    ({ id, areaId, title, mins, points, body });

  const LESSONS = [

    /* ======================= PROGRAMMING FUNDAMENTALS ==================== */
    L('PF-L1', 'PF', 'The software development steps', 25, ['PF-1.1', 'PF-1.2'], [
      { t: 'p', v: 'Every software project — a school app or an air traffic system — moves through the same eight steps. NESA names them explicitly, and marks are awarded for naming them correctly and in order.' },
      {
        t: 'table', head: ['Step', 'What actually happens', 'Typical artefact'], rows: [
          ['Requirements definition', 'Work with the client to state what the system must do, in the client’s language. Functional and non-functional needs.', 'Requirements list, user stories'],
          ['Determining specifications', 'Translate requirements into measurable, technical statements the developer can build against.', 'Specification document, data dictionary'],
          ['Design', 'Model the solution before writing it — algorithms, data structures, interfaces, architecture.', 'Pseudocode, flowcharts, class diagrams, UI mock-ups'],
          ['Development', 'Write the code, build the data structures, construct subprograms.', 'Source code, repository commits'],
          ['Integration', 'Join modules, subsystems and third-party components so they operate as one system.', 'Integrated build, API contracts'],
          ['Testing and debugging', 'Run planned test data, locate and remove defects.', 'Test plan, defect log'],
          ['Installation', 'Deploy into the live environment using direct, phased, parallel or pilot methods.', 'Deployment plan, release notes'],
          ['Maintenance', 'Correct faults, adapt to change, improve performance after release.', 'Change log, patch releases']
        ]
      },
      { t: 'callout', k: 'exam', v: 'A very common question asks you to place a described activity into the correct step. Clue words: “client said they want…” = requirements; “the system must respond in under 2 seconds” = specifications; “we joined the payment module to the cart” = integration.' },
      { t: 'h', v: 'Online code collaboration tools (PF-1.2)' },
      { t: 'ul', v: ['Hosted version control (GitHub, GitLab, Bitbucket) — branches, pull requests, issue tracking, code review.', 'Real-time shared editors (VS Code Live Share, Replit) — pair programming across locations.', 'Communication/CI integration (Slack, Teams, GitHub Actions) — automated builds notify the team on each push.'] },
      { t: 'p', v: 'Evaluate, don’t just list: these tools raise code quality through peer review and traceability, but introduce dependence on connectivity, a learning curve, and risk if private code is pushed to a public repository.' }
    ]),

    L('PF-L2', 'PF', 'Algorithms: structure, strategies and modelling', 30, ['PF-2.1', 'PF-2.2', 'PF-2.3', 'PF-2.4', 'PF-2.5', 'PF-2.6'], [
      { t: 'p', v: 'Computational thinking = decomposition, pattern recognition, abstraction, algorithm design. Standard algorithms are built from exactly three control structures.' },
      { t: 'terms', v: [['Sequence', 'Steps execute one after another in order.'], ['Selection', 'A decision chooses between paths (IF / CASEWHERE).'], ['Iteration', 'A block repeats — pre-test (WHILE), post-test (REPEAT…UNTIL), or counted (FOR).']] },
      { t: 'h', v: 'Pseudocode conventions used in the HSC' },
      {
        t: 'code', lang: 'text', v:
          `BEGIN CalculateGrade(marks)
    total = 0
    FOR each mark IN marks
        total = total + mark
    NEXT mark
    average = total / LENGTH(marks)
    IF average >= 80 THEN
        grade = "A"
    ELSE IF average >= 65 THEN
        grade = "B"
    ELSE
        grade = "C"
    END IF
    RETURN grade
END CalculateGrade`
      },
      { t: 'h', v: 'Divide and conquer vs backtracking (PF-2.2)' },
      { t: 'ul', v: ['<b>Divide and conquer</b> — split the problem into independent sub-problems, solve each (often recursively), combine results. Examples: binary search, merge sort, quicksort.', '<b>Backtracking</b> — build a candidate solution incrementally; when a partial candidate cannot be completed, abandon it and return to the last decision point. Examples: maze solving, Sudoku, 8-queens.'] },
      { t: 'h', v: 'Modelling tools (PF-2.4)' },
      { t: 'ul', v: ['<b>Structure chart</b> — hierarchy of modules with data couples and control flags passed between them.', '<b>Abstraction/refinement diagram</b> — the same solution shown at increasing levels of detail; supports top-down (stepwise refinement) and bottom-up (compose from known components) design.'] },
      { t: 'h', v: 'Desk checking (PF-2.5)' },
      { t: 'p', v: 'Trace the algorithm by hand with a table: one column per variable, one row per iteration. You must show the final output. Peer checking is the same process performed by someone else — it finds assumptions the author cannot see.' },
      { t: 'callout', k: 'tip', v: 'Procedures do not return a value; functions do. If the algorithm says RETURN, it is a function.' }
    ]),

    L('PF-L3', 'PF', 'Data: number systems, types and structures', 30, ['PF-3.1', 'PF-3.2', 'PF-3.3', 'PF-3.4', 'PF-3.5', 'PF-4.2'], [
      { t: 'h', v: 'Number systems' },
      { t: 'p', v: 'Binary (base 2), decimal (base 10), hexadecimal (base 16). One hex digit = exactly 4 bits, which is why hex is used for colours (#FF8800), memory addresses and MAC addresses.' },
      {
        t: 'table', head: ['Decimal', 'Binary', 'Hex'], rows: [
          ['10', '0000 1010', '0A'], ['64', '0100 0000', '40'], ['127', '0111 1111', '7F'], ['200', '1100 1000', 'C8'], ['255', '1111 1111', 'FF']
        ]
      },
      { t: 'h', v: 'Two’s complement (PF-3.2)' },
      { t: 'ol', v: ['Write the magnitude in binary using the fixed word size (e.g. 8 bits).', 'Invert every bit (one’s complement).', 'Add 1.'] },
      { t: 'code', lang: 'text', v: `Represent −20 in 8-bit two's complement
  20        = 0001 0100
  invert    = 1110 1011
  add 1     = 1110 1100   →  −20

Range of 8-bit two's complement:  −128 .. +127
The leftmost bit is the sign bit: 1 = negative.` },
      { t: 'h', v: 'Standard data types (PF-3.3)' },
      { t: 'terms', v: [['char / string', 'A single character; a sequence of characters.'], ['Boolean', 'True or False — 1 bit of information.'], ['integer', 'Whole numbers, no fractional part.'], ['real', 'Numbers with a fractional part.'], ['single precision floating point', '32 bits: sign (1) + exponent (8) + mantissa (23). Finite precision causes rounding error — 0.1 + 0.2 ≠ 0.3.'], ['date and time', 'Stored as an offset from an epoch; formatting is separate from storage.']] },
      { t: 'h', v: 'Data dictionary (PF-3.4)' },
      {
        t: 'table', head: ['Field', 'Data type', 'Size', 'Format', 'Validation', 'Example'], rows: [
          ['studentID', 'string', '8', 'SXXXXXXX', 'Must start with S, 7 digits', 'S1234567'],
          ['dateOfBirth', 'date', '8', 'DD/MM/YYYY', 'Valid date, age 12–20', '04/09/2008'],
          ['atarGoal', 'real', '4', '##.##', '0.00–99.95', '92.40'],
          ['isEnrolled', 'Boolean', '1', 'T/F', 'T or F only', 'T']
        ]
      },
      { t: 'h', v: 'Data structures (PF-3.5, PF-4.2)' },
      { t: 'terms', v: [['Array', 'Fixed-size, indexed, homogeneous. Multidimensional arrays index by [row][column].'], ['Record', 'A group of related fields of different types treated as one item.'], ['List', 'Ordered, dynamically sized sequence.'], ['Stack', 'LIFO — push/pop. Used for call stacks, undo, backtracking.'], ['Tree', 'Hierarchical nodes; a binary search tree gives O(log n) lookup when balanced.'], ['Hash table', 'Key → index via a hash function; average O(1) lookup; collisions resolved by chaining or probing.'], ['Sequential file', 'Records read in order from start to end; efficient for batch processing, poor for random access.']] }
    ]),

    L('PF-L4', 'PF', 'Testing, debugging and error types', 25, ['PF-4.3', 'PF-4.4', 'PF-4.5', 'PF-4.6', 'PF-4.7'], [
      { t: 'h', v: 'Error types (PF-4.7)' },
      {
        t: 'table', head: ['Error', 'When detected', 'Cause', 'Example'], rows: [
          ['Syntax', 'Compile/parse time', 'Code breaks the grammar of the language', 'Missing colon or bracket'],
          ['Runtime', 'During execution', 'A legal statement fails on actual data', 'Division by zero, index out of range, file not found'],
          ['Logic', 'Never — output is simply wrong', 'The algorithm does the wrong thing correctly', 'Using < instead of <=, averaging by the wrong count']
        ]
      },
      { t: 'h', v: 'Debugging tools (PF-4.5)' },
      { t: 'ul', v: ['<b>Breakpoint</b> — pause execution at a chosen line to inspect state.', '<b>Single line stepping</b> — execute one statement at a time (step over / into / out).', '<b>Watch</b> — display the live value of a chosen variable or expression.', '<b>Interfaces between functions</b> — check the parameters passed in and the value returned at each call boundary.', '<b>Debugging output statements</b> — temporary print/console statements showing values at key points.', '<b>IDE debugger</b> — combines all the above with a call stack view.'] },
      { t: 'h', v: 'Test data (PF-4.6)' },
      { t: 'ul', v: ['<b>Boundary values</b> — the lowest and highest valid values and one either side. For 0–100: test −1, 0, 1, 99, 100, 101.', '<b>Path coverage</b> — a set of test cases that causes every branch of the code to execute at least once.', '<b>Faulty and abnormal data</b> — wrong type, empty input, extreme size, malicious input.'] },
      { t: 'h', v: 'Waterfall vs Agile (PF-4.3)' },
      {
        t: 'table', head: ['', 'Waterfall', 'Agile'], rows: [
          ['Flow', 'Sequential, each stage completed before the next', 'Iterative increments (sprints)'],
          ['Requirements', 'Fixed early and documented', 'Expected to change; revisited each iteration'],
          ['Client contact', 'Start and end', 'Continuous'],
          ['Best for', 'Stable, safety-critical, regulated projects', 'Evolving requirements, small co-located teams'],
          ['Risk', 'Errors found late are expensive', 'Scope creep, lighter documentation']
        ]
      },
      { t: 'callout', k: 'exam', v: 'Evaluating a solution (PF-4.4) means addressing all four named aspects: functionality, performance, readability of code, and quality of documentation. Dropping one costs a mark.' }
    ]),

    /* ======================= OBJECT-ORIENTED PARADIGM ==================== */
    L('OOP-L1', 'OOP', 'Key features of OOP', 30, ['OOP-1.1', 'OOP-1.2', 'OOP-1.6'], [
      { t: 'terms', v: [
        ['Class', 'A blueprint defining attributes (state) and methods (behaviour).'],
        ['Object', 'An instance of a class with its own attribute values.'],
        ['Encapsulation', 'Bundling data with the methods that operate on it and restricting direct access (private attributes + getters/setters). Protects integrity.'],
        ['Abstraction', 'Exposing only what a caller needs; hiding the implementation detail behind an interface.'],
        ['Inheritance', 'A subclass acquires the attributes and methods of a superclass and may extend or override them.'],
        ['Generalisation', 'Designing upward — extracting the shared features of several classes into a common superclass.'],
        ['Polymorphism', 'One interface, many forms. The same method call behaves differently depending on the object’s actual class (overriding), or on the arguments (overloading).']
      ] },
      { t: 'code', lang: 'python', v: `class Vehicle:                       # superclass (generalisation)
    def __init__(self, rego, wheels):
        self.__rego = rego           # encapsulation: private attribute
        self.wheels = wheels

    def get_rego(self):              # accessor
        return self.__rego

    def describe(self):
        return f"Vehicle {self.__rego} with {self.wheels} wheels"


class Motorbike(Vehicle):            # inheritance
    def __init__(self, rego):
        super().__init__(rego, 2)

    def describe(self):              # polymorphism via overriding
        return f"Motorbike {self.get_rego()}"


for v in [Vehicle("ABC123", 4), Motorbike("XYZ789")]:
    print(v.describe())              # same call, different behaviour` },
      { t: 'h', v: 'Procedural vs OOP (OOP-1.2)' },
      {
        t: 'table', head: ['', 'Procedural', 'OOP'], rows: [
          ['Organising idea', 'Functions acting on separate data', 'Objects owning their own data and behaviour'],
          ['Data access', 'Often global — any procedure can change it', 'Encapsulated — access controlled by the class'],
          ['Reuse', 'Copy functions / call libraries', 'Inheritance, composition, polymorphism'],
          ['Scaling', 'Becomes hard to maintain as size grows', 'Maintains structure in large teams and codebases'],
          ['Suited to', 'Short, linear, computational tasks', 'Large systems modelling real-world entities']
        ]
      },
      { t: 'h', v: 'Message passing (OOP-1.6)' },
      { t: 'p', v: 'Objects do not reach into each other’s data; they send messages — a method call on another object’s public interface, with arguments, which may return a value. The receiving object decides how to respond (dynamic dispatch). This keeps objects loosely coupled.' }
    ]),

    L('OOP-L2', 'OOP', 'Designing and modelling OOP systems', 25, ['OOP-1.3', 'OOP-1.4', 'OOP-1.5', 'OOP-1.7'], [
      { t: 'h', v: 'Modelling tools (OOP-1.3)' },
      { t: 'ul', v: ['<b>Class diagram</b> — boxes with three compartments (name / attributes / methods); lines show inheritance (hollow triangle), association, aggregation (hollow diamond) and composition (filled diamond). Visibility: + public, − private, # protected.', '<b>Data flow diagram</b> — external entities, processes, data stores and flows. Shows <i>what data moves where</i>, not control order.', '<b>Structure chart</b> — module hierarchy with data couples and control flags.'] },
      { t: 'svg', v: 'classdiagram' },
      { t: 'h', v: 'The design process (OOP-1.4)' },
      { t: 'ul', v: ['<b>Task definition</b> — state precisely what the program must accomplish before designing classes.', '<b>Top-down</b> — decompose the whole into subsystems; <b>bottom-up</b> — build and combine known components.', '<b>Facade pattern</b> — a single simplified class that provides a clean entry point to a complex subsystem, reducing coupling for the caller.', '<b>Agility</b> — design in increments; refactor the class model as understanding improves.'] },
      { t: 'h', v: 'Code optimisation (OOP-1.7)' },
      { t: 'ul', v: ['Remove redundant computation from loops; cache repeated results.', 'Choose a better algorithm or data structure (hash table instead of linear search).', 'Reduce memory churn — reuse objects, release references.', 'Readability vs speed is a genuine trade-off; optimise only what profiling shows is slow.'] }
    ]),

    L('OOP-L3', 'OOP', 'Collaborative, maintainable OOP code and testing', 25, ['OOP-1.8', 'OOP-2.1', 'OOP-2.2', 'OOP-2.3'], [
      { t: 'h', v: 'Features supporting collaboration (OOP-1.8)' },
      { t: 'ul', v: ['<b>Consistency</b> — agreed naming conventions, indentation and file structure so any member can read any file.', '<b>Code commenting</b> — intent and interface documentation (why, not what).', '<b>Version control</b> — branching, merging and history so parallel work does not overwrite.', '<b>Feedback</b> — code review and pull requests surface defects early.'] },
      { t: 'h', v: 'Qualities of maintainable code (OOP-2.2)' },
      { t: 'ul', v: ['Clear, uncluttered mainline — the mainline reads as a summary of the program.', 'One logical task per subroutine.', 'Stubs — a placeholder subroutine returning a fixed value so the rest can be tested before it is written.', 'Appropriate control and data structures; meaningful identifiers.', 'Version control and regular backup.'] },
      { t: 'h', v: 'Testing methodologies (OOP-2.3)' },
      {
        t: 'table', head: ['Level', 'Scope'], rows: [
          ['Unit testing', 'One subroutine/class in isolation'],
          ['Subsystem testing', 'A group of related modules working together'],
          ['System testing', 'The complete integrated solution against the specifications']
        ]
      },
      {
        t: 'table', head: ['Approach', 'Tester knowledge', 'Focus'], rows: [
          ['Black box', 'No view of the code', 'Inputs → expected outputs; specification conformance'],
          ['White box', 'Full view of the code', 'Paths, branches, internal logic coverage'],
          ['Grey box', 'Partial — e.g. knows the data structures', 'Realistic integration and data-driven tests']
        ]
      },
      { t: 'p', v: '<b>Quality assurance</b> is the process of defining standards and checking them continually throughout development — it is broader than testing, which checks the product after it is built.' }
    ]),

    /* ======================= MECHATRONICS ================================ */
    L('MEC-L1', 'MEC', 'Mechatronic hardware and how it shapes code', 30, ['MEC-1.1', 'MEC-1.2', 'MEC-1.3', 'MEC-1.4'], [
      { t: 'p', v: 'A mechatronic system combines mechanical engineering, electronics, control systems and software. Applications: manufacturing robotics, agriculture (autonomous harvesters), medicine (surgical robots, prosthetics), automotive (ABS, lane keeping), aerospace, mining, assistive technology.' },
      { t: 'h', v: 'Microcontrollers and the CPU (MEC-1.2)' },
      { t: 'ul', v: ['A <b>microcontroller</b> is a complete small computer on one chip: CPU core, RAM, flash and I/O peripherals (GPIO, ADC, PWM, timers). A desktop <b>CPU</b> is only the processor and relies on external memory and controllers.', 'The <b>instruction set</b> is the set of machine operations the processor understands; each is encoded as an <b>opcode</b> plus operands. A small instruction set and limited RAM force compact, efficient code.', '<b>Address registers</b> hold memory locations being accessed; <b>data registers</b> hold the values being operated on. The program counter is a specialised address register.'] },
      { t: 'callout', k: 'tip', v: 'Hardware constrains code: limited RAM rules out large arrays; no floating-point unit makes integer maths far faster; a fixed clock speed sets the maximum sampling rate of your control loop.' },
      { t: 'h', v: 'Sensors, actuators and end effectors (MEC-1.3)' },
      {
        t: 'table', head: ['Component', 'Type', 'Function', 'Data'], rows: [
          ['PIR / ultrasonic motion sensor', 'Sensor', 'Detects movement or distance', 'Digital pulse / time-of-flight in µs'],
          ['LDR / photodiode light sensor', 'Sensor', 'Measures light level', 'Analogue voltage → ADC integer'],
          ['Hydraulic actuator', 'Actuator', 'Produces large linear force using pressurised fluid', 'Valve position, pressure feedback'],
          ['Servo / stepper motor', 'Actuator', 'Produces controlled rotation', 'PWM duty cycle / step pulses'],
          ['Robotic gripper', 'End effector', 'Grasps and releases objects', 'Grip force, open/closed state']
        ]
      },
      { t: 'h', v: 'Data in mechatronic systems (MEC-1.4)' },
      { t: 'ul', v: ['<b>Control data</b> — setpoints and commands sent to actuators.', '<b>Sensor data</b> — raw readings, usually needing filtering and calibration.', '<b>Diagnostic data</b> — error codes, temperatures, battery voltage, uptime; used for fault finding.', '<b>Optimisation data</b> — cycle times, energy use and error magnitudes logged over time to tune the system.'] }
    ]),

    L('MEC-L2', 'MEC', 'Control algorithms: open and closed loop', 25, ['MEC-1.5', 'MEC-2.1', 'MEC-2.2', 'MEC-2.3', 'MEC-3.4'], [
      { t: 'h', v: 'Open vs closed loop (MEC-2.2)' },
      { t: 'svg', v: 'controlloop' },
      { t: 'ul', v: ['<b>Open loop</b> — output is not measured. Simple and cheap, but cannot correct disturbance. Example: a toaster running for a fixed time.', '<b>Closed loop</b> — a sensor measures the output, the controller computes <i>error = setpoint − measured</i> and adjusts the actuator. Example: a thermostat, a line-following robot, cruise control.'] },
      { t: 'code', lang: 'python', v: `# Closed-loop proportional controller for a heater (MEC-3.4)
SETPOINT = 22.0        # target °C
KP = 4.0               # proportional gain
TOLERANCE = 0.3        # dead band, prevents actuator chatter

def control_step(measured):
    error = SETPOINT - measured
    if abs(error) < TOLERANCE:
        return 0                       # inside dead band: do nothing
    power = KP * error
    return max(0, min(100, power))     # clamp to 0-100% duty cycle

for reading in [18.0, 19.5, 21.2, 21.9, 22.4]:
    print(reading, "->", round(control_step(reading), 1), "% power")` },
      { t: 'h', v: 'Interactions and dependencies (MEC-1.5)' },
      { t: 'terms', v: [
        ['Motion constraint', 'A physical limit the software must respect — joint angle range, maximum velocity, workspace boundary.'],
        ['Degrees of freedom', 'The number of independent movements a system can make. A robot arm with 6 DOF can reach any position and orientation in its workspace.'],
        ['Subsystem combination', 'Drive, sensing and manipulation subsystems share power, timing and data; a change in one affects the others.']
      ] },
      { t: 'h', v: 'Autonomous control (MEC-2.3)' },
      { t: 'ul', v: ['Senses its environment continuously, decides without human input, and acts — then repeats (the sense–decide–act loop).', 'Includes fail-safe states, obstacle handling and watchdog timers.', 'Often uses state machines: each state has entry conditions, behaviour and transitions.'] }
    ]),

    L('MEC-L3', 'MEC', 'Building, powering and testing a mechatronic system', 25, ['MEC-1.6', 'MEC-1.7', 'MEC-1.8', 'MEC-3.1', 'MEC-3.2', 'MEC-3.3', 'MEC-3.5', 'MEC-3.6', 'MEC-3.7', 'MEC-3.8'], [
      { t: 'h', v: 'Power and materials (MEC-1.6)' },
      { t: 'p', v: 'Sum the current draw of every component at peak load, add a safety margin (typically 20–30%), then size the battery in mAh for the required runtime: <code>runtime (h) = capacity (mAh) ÷ total draw (mA)</code>. Motors must be driven from a separate supply rail or driver board, never directly from a microcontroller pin.' },
      { t: 'h', v: 'Wiring diagrams (MEC-1.7)' },
      { t: 'ul', v: ['Show power rails (V+, GND) and data lines separately; label voltages.', 'Include protective components — flyback diodes across motors, pull-up/pull-down resistors, current-limiting resistors on LEDs.', 'Share a common ground between the controller and the motor supply.'] },
      { t: 'h', v: 'Designing for people with disability (MEC-1.8)' },
      { t: 'ul', v: ['Consult actual users — requirements must come from lived experience, not assumption.', 'Alternative input and output modes (voice, switch, eye gaze, haptic, audio feedback).', 'Adjustable force, speed and sensitivity; predictable, reversible actions.', 'Safety interlocks and emergency stop reachable from the user’s position.', 'Reliability and ease of repair — the device may be relied on daily.'] },
      { t: 'h', v: 'Unit testing control algorithms (MEC-3.8)' },
      { t: 'p', v: 'Test each component’s control algorithm in isolation with known inputs and repeat the test to prove <b>repeatability</b> — a mechatronic system that works once is not working. Simulation (MEC-3.3) lets you test code before hardware exists and to test dangerous failure cases safely.' },
      { t: 'code', lang: 'python', v: `# Unit test: gripper control must clamp force and be repeatable
def grip_force(target, max_force=40):
    return max(0, min(max_force, target))

tests = [(10, 10), (50, 40), (-5, 0), (40, 40)]
passed = 0
for value, expected in tests:
    actual = grip_force(value)
    ok = actual == expected
    passed += ok
    print(f"grip_force({value}) = {actual} expected {expected} {'PASS' if ok else 'FAIL'}")
print(f"{passed}/{len(tests)} passed")` }
    ]),

    /* ======================= SECURE SOFTWARE ARCHITECTURE ================ */
    L('SSA-L1', 'SSA', 'Security concepts and secure design', 30, ['SSA-1.1', 'SSA-1.2', 'SSA-1.3', 'SSA-2.1', 'SSA-2.2'], [
      { t: 'h', v: 'The six fundamental concepts (SSA-2.1)' },
      { t: 'terms', v: [
        ['Confidentiality', 'Only authorised parties can read the data. Mechanisms: encryption at rest and in transit, access control.'],
        ['Integrity', 'Data cannot be altered undetected. Mechanisms: hashing, checksums, digital signatures, database constraints.'],
        ['Availability', 'The system is usable when needed. Mechanisms: redundancy, backups, rate limiting, DDoS protection.'],
        ['Authentication', 'Proving who you are — passwords, MFA, biometrics, certificates.'],
        ['Authorisation', 'What an authenticated identity is permitted to do — roles, permissions, least privilege.'],
        ['Accountability', 'Actions can be traced to an identity — audit logs, non-repudiation via digital signatures.']
      ] },
      { t: 'callout', k: 'exam', v: 'Authentication ≠ authorisation. Authentication is identity; authorisation is permission. A logged-in student is authenticated but not authorised to change another student’s marks.' },
      { t: 'h', v: 'Benefits of secure software (SSA-1.1)' },
      { t: 'ul', v: ['<b>Data protection</b> — personal and financial data stays confidential, meeting obligations under the Privacy Act and the Australian Privacy Principles.', '<b>Minimising attacks and vulnerabilities</b> — fewer exploitable defects means lower remediation cost, less downtime, and preserved reputation and trust.'] },
      { t: 'h', v: 'End users shape secure design (SSA-1.3)' },
      { t: 'p', v: 'Security that is hard to use gets bypassed. Novice users need safe defaults, clear error messages that do not leak system detail, guided recovery and MFA that is simple to enrol. Expert users may require API keys, configurable session timeouts and detailed audit access. Accessibility matters: CAPTCHA and SMS-only MFA can exclude users.' },
      { t: 'h', v: 'Security features in software (SSA-2.2)' },
      { t: 'ul', v: ['Data protection — encryption, hashing of passwords with a salt (bcrypt/Argon2), tokenisation, data minimisation.', 'Security — access control, secure session handling, logging and monitoring.', 'Privacy — consent, purpose limitation, the right to erasure.', 'Regulatory compliance — Privacy Act 1988 (Cth) and APPs, Notifiable Data Breaches scheme, GDPR where EU users are served, PCI-DSS for card data.'] }
    ]),

    L('SSA-L2', 'SSA', 'Security by design, privacy by design and resilience', 30, ['SSA-2.3', 'SSA-2.4', 'SSA-2.5', 'SSA-2.6'], [
      { t: 'h', v: 'Cryptography and sandboxing (SSA-2.3)' },
      { t: 'ul', v: ['<b>Symmetric encryption</b> (AES) — one shared key, fast, used for bulk data. <b>Asymmetric</b> (RSA, ECC) — public/private key pair, used for key exchange and signatures.', '<b>Hashing</b> (SHA-256, bcrypt) — one-way; verifies integrity and stores passwords. A salt prevents rainbow-table attacks.', '<b>Sandboxing</b> — running code in an isolated environment with restricted access to the file system, network and memory, so that compromised or untrusted code cannot affect the host. Browsers, mobile apps and this app’s own code runner all use sandboxes.'] },
      { t: 'h', v: 'Privacy by design (SSA-2.4)' },
      { t: 'ul', v: ['<b>Proactive not reactive</b> — anticipate and prevent privacy invasion before it occurs, rather than remediating after a breach.', '<b>Embed privacy into design</b> — privacy is a core component of the system, not an add-on; default settings are the most private.', '<b>Respect for user privacy</b> — keep it user-centric: clear consent, visible controls, collect only what is needed, delete when no longer needed.'] },
      { t: 'h', v: 'Resilience (SSA-2.5)' },
      {
        t: 'table', head: ['Activity', 'What it involves'], rows: [
          ['Determining vulnerabilities', 'Scanning, threat modelling, reviewing dependencies against CVE databases'],
          ['Hardening systems', 'Disable unused services and ports, patch, enforce least privilege, secure configuration defaults'],
          ['Handling breaches', 'Detect, contain, eradicate, recover; notify affected individuals and the OAIC where required'],
          ['Business continuity', 'Redundancy, failover, documented processes so the organisation keeps operating'],
          ['Disaster recovery', 'Backups tested by restoration, defined RPO (data loss tolerated) and RTO (downtime tolerated)']
        ]
      },
      { t: 'h', v: 'Managing the security of code (SSA-2.6)' },
      {
        t: 'table', head: ['Strategy', 'How it works', 'Strength / limitation'], rows: [
          ['Code review', 'Humans read the code (often via pull request)', 'Finds design and logic flaws; slow, subjective'],
          ['SAST', 'Automated analysis of source code without running it', 'Early, broad coverage; false positives, misses runtime issues'],
          ['DAST', 'Automated attacks on the running application', 'Finds real exploitable behaviour; needs a deployed build, no line references'],
          ['Vulnerability assessment', 'Systematic scan and prioritised list of known weaknesses', 'Broad inventory; does not prove exploitability'],
          ['Penetration testing', 'Authorised humans attempt real exploitation', 'Highest confidence, finds chained flaws; costly, point-in-time']
        ]
      }
    ]),

    L('SSA-L3', 'SSA', 'Writing defensive code', 30, ['SSA-2.7', 'SSA-2.8', 'SSA-2.9', 'SSA-2.10', 'SSA-2.11'], [
      { t: 'h', v: 'Defensive data input handling (SSA-2.7)' },
      { t: 'ul', v: ['<b>Validation</b> — reject what does not meet the rule (type, range, length, format, presence). Allow-lists beat deny-lists.', '<b>Sanitisation</b> — neutralise dangerous content you must accept (escape HTML, parameterise SQL, normalise paths).', '<b>Error handling</b> — catch expected failures, fail securely and closed, log detail server-side but show the user a generic message.'] },
      { t: 'code', lang: 'python', v: `# Vulnerable: string concatenation builds the query (SQL injection)
query = "SELECT * FROM users WHERE name = '" + name + "'"

# Secure: parameterised query — the driver separates code from data
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))

# Validation + error handling together
def set_age(raw):
    try:
        age = int(raw)                       # type validation
    except (TypeError, ValueError):
        raise ValueError("Age must be a whole number")
    if not 0 <= age <= 120:                  # range validation
        raise ValueError("Age must be between 0 and 120")
    return age` },
      { t: 'h', v: 'Safe APIs (SSA-2.8)' },
      { t: 'ul', v: ['Authenticate every request (tokens/keys), authorise per resource — never trust an ID supplied by the client without an ownership check.', 'Rate limit and throttle; validate request bodies against a schema.', 'Return only the fields needed; never leak stack traces or internal IDs.', 'Version the API and use HTTPS exclusively.'] },
      { t: 'h', v: 'Efficient execution (SSA-2.9)' },
      { t: 'terms', v: [
        ['Memory management', 'Release objects and close resources; avoid leaks and unbounded buffers (a classic source of overflow vulnerabilities).'],
        ['Session management', 'Random high-entropy session IDs, regenerate on login, set HttpOnly/Secure/SameSite, expire on timeout and logout.'],
        ['Exception management', 'Catch specific exceptions, clean up in a finally block, never swallow errors silently.']
      ] },
      { t: 'h', v: 'User action control vulnerabilities (SSA-2.10)' },
      {
        t: 'table', head: ['Vulnerability', 'Attack', 'Countermeasure'], rows: [
          ['Broken authentication / session management', 'Session fixation, stolen or guessable session IDs, no logout expiry', 'Regenerate session ID on login, short timeouts, MFA, secure cookies'],
          ['Cross-site scripting (XSS)', 'Attacker script stored or reflected into a page and run in another user’s browser', 'Output encoding, Content-Security-Policy, sanitise on input and escape on output'],
          ['Cross-site request forgery (CSRF)', 'A victim’s authenticated browser is tricked into submitting an action', 'Anti-CSRF tokens, SameSite cookies, re-authenticate for sensitive actions'],
          ['Invalid forwarding and redirecting', 'Open redirect sends users to a phishing site via a trusted domain', 'Allow-list of redirect targets, never redirect to a raw URL parameter'],
          ['Race conditions', 'Two operations interleave (TOCTOU) — e.g. a balance checked then spent twice', 'Atomic transactions, locking, idempotency keys']
        ]
      },
      { t: 'h', v: 'File and hardware vulnerabilities (SSA-2.11)' },
      { t: 'ul', v: ['<b>File attacks</b> — path traversal (<code>../../etc/passwd</code>), unrestricted upload of executable content, zip bombs. Defend with canonicalised paths, allow-listed extensions and MIME checks, size limits, storage outside the web root, and malware scanning.', '<b>Side channel attacks</b> — leaking secrets through timing, power draw, cache behaviour or electromagnetic emission. Defend with constant-time comparison of secrets, blinding and avoiding secret-dependent branching.'] }
    ]),

    L('SSA-L4', 'SSA', 'The impact of safe and secure development', 20, ['SSA-3.1', 'SSA-3.2', 'SSA-3.3'], [
      { t: 'h', v: 'Collaboration (SSA-3.1)' },
      { t: 'ul', v: ['<b>Various points of view</b> — a tester, a security specialist and an accessibility advocate each see risks the developer does not.', '<b>Delegating by expertise</b> — cryptography written by a specialist rather than improvised.', '<b>Quality of the solution</b> — review catches defects earlier, when they are cheapest to fix.'] },
      { t: 'h', v: 'Enterprise benefits (SSA-3.2)' },
      { t: 'ul', v: ['Improved products or services — fewer outages and defects.', 'Influence on future development — secure patterns become reusable standards.', 'Improved work practices — review, CI and testing become routine.', 'Productivity — less time spent on emergency patching and incident response.', 'Business interactivity — partners and customers will integrate with a system they can trust.'] },
      { t: 'h', v: 'Social, ethical and legal ramifications (SSA-3.3)' },
      {
        t: 'table', head: ['Issue', 'Consider'], rows: [
          ['Employment', 'Demand for security specialists; automation of routine testing; retraining obligations'],
            ['Data security', 'Breach costs, identity theft, Notifiable Data Breaches obligations'],
          ['Privacy', 'Consent, surveillance, secondary use of data, de-identification'],
          ['Copyright', 'Licence compliance for libraries and frameworks; attribution'],
          ['Intellectual property', 'Ownership of code written by employees, students and contractors; patents and trade secrets'],
          ['Digital disruption', 'Secure platforms displacing incumbent businesses and changing whole industries']
        ]
      }
    ]),

    /* ======================= PROGRAMMING FOR THE WEB ===================== */
    L('WEB-L1', 'WEB', 'How data travels the web', 30, ['WEB-1.1', 'WEB-1.2', 'WEB-1.3'], [
      { t: 'h', v: 'Packets, IP and DNS (WEB-1.2)' },
      { t: 'ul', v: ['Data is split into <b>packets</b>: a header (source IP, destination IP, sequence number, protocol, TTL, checksum) plus a payload. Packets may take different routes and arrive out of order; TCP reassembles them in sequence and requests retransmission of anything lost.', '<b>IPv4</b> is a 32-bit address written as four octets (e.g. 203.0.113.25) — about 4.3 billion addresses, which is why NAT and IPv6 exist.', '<b>DNS</b> resolves a human-readable domain to an IP address: browser cache → OS cache → resolver → root → TLD (.au) → authoritative name server.'] },
      { t: 'h', v: 'Protocols and ports (WEB-1.3)' },
      {
        t: 'table', head: ['Protocol', 'Port', 'Function'], rows: [
          ['HTTP', '80', 'Unencrypted request/response transfer of web resources'],
          ['HTTPS', '443', 'HTTP inside a TLS tunnel — encrypted, authenticated, integrity-checked'],
          ['TCP/IP', '—', 'TCP provides reliable, ordered, connection-oriented delivery; IP provides addressing and routing'],
          ['DNS', '53', 'Resolves domain names to IP addresses'],
          ['FTP', '20/21', 'File transfer — credentials and data sent in plain text'],
          ['SFTP', '22', 'File transfer tunnelled over SSH — encrypted'],
          ['SSL / TLS', '—', 'Transport-layer encryption; SSL is the deprecated predecessor of TLS'],
          ['SMTP', '25 (587)', 'Sending mail between servers'],
          ['POP3', '110 (995)', 'Retrieves mail and typically removes it from the server'],
          ['IMAP', '143 (993)', 'Synchronises mail across devices, leaving it on the server']
        ]
      },
      { t: 'h', v: 'Applications of web programming (WEB-1.1)' },
      { t: 'ul', v: ['<b>Interactive websites</b> — DOM manipulation, forms, client-side validation, AJAX/fetch.', '<b>E-commerce</b> — catalogues, carts, payment gateways, order and inventory management, PCI-DSS obligations.', '<b>Progressive web apps</b> — installable, offline-capable via a service worker and cache, responsive, push notifications, served over HTTPS with a manifest.'] }
    ]),

    L('WEB-L2', 'WEB', 'Securing the web and big data', 25, ['WEB-1.4', 'WEB-1.5'], [
      { t: 'h', v: 'Processes for securing the web (WEB-1.4)' },
      { t: 'terms', v: [
        ['SSL certificate', 'Issued by a Certificate Authority; binds a public key to a domain and proves the server’s identity during the TLS handshake.'],
        ['Encryption algorithm', 'The method — AES (symmetric, fast, bulk data) or RSA/ECC (asymmetric, key exchange and signatures).'],
        ['Encryption key', 'The secret parameter. Symmetric: one shared key. Asymmetric: public key encrypts/verifies, private key decrypts/signs.'],
        ['Plain text / cipher text', 'The readable message / the encrypted output produced by applying the algorithm and key.'],
        ['Authentication & authorisation', 'Verifying identity, then granting the permissions that identity holds.'],
        ['Hash value', 'A fixed-length one-way digest. Any change to the input changes the digest — used for integrity and password storage.'],
        ['Digital signature', 'A hash of the message encrypted with the sender’s private key. Verifies origin (non-repudiation) and integrity.']
      ] },
      { t: 'svg', v: 'tlshandshake' },
      { t: 'h', v: 'Big data and web architecture (WEB-1.5)' },
      { t: 'ul', v: ['Characterised by volume, velocity, variety (and veracity). Forces distributed storage, horizontal scaling, CDNs, caching layers and NoSQL stores.', '<b>Data mining</b> — finding patterns and correlations in large datasets to drive recommendations and forecasting.', '<b>Metadata</b> — data about data (timestamps, geolocation, device, file size); small but highly revealing, and a privacy concern.', '<b>Streaming service management</b> — adaptive bitrate, edge caching, load balancing and buffering to deliver continuous media at scale.'] }
    ]),

    L('WEB-L3', 'WEB', 'Designing web applications: front end to back end', 30, ['WEB-2.1', 'WEB-2.2', 'WEB-2.3', 'WEB-2.4', 'WEB-2.5', 'WEB-2.6', 'WEB-2.7', 'WEB-2.8', 'WEB-2.9'], [
      { t: 'h', v: 'The W3C (WEB-2.1)' },
      { t: 'p', v: 'The World Wide Web Consortium develops open standards so the web is interoperable across browsers and devices. Key areas: the <b>Web Accessibility Initiative</b> (WCAG — perceivable, operable, understandable, robust), <b>internationalisation</b> (character encoding, locales, right-to-left text), <b>web security</b> (CSP, CORS, Subresource Integrity), <b>privacy</b>, and <b>machine-readable data</b> (semantic HTML, RDF, JSON-LD) so search engines and assistive technology can interpret content.' },
      { t: 'h', v: 'The web development system (WEB-2.2)' },
      { t: 'svg', v: 'webstack' },
      {
        t: 'table', head: ['Layer', 'Runs on', 'Technologies', 'Responsibilities'], rows: [
          ['Front end', 'User’s browser', 'HTML, CSS, JavaScript, frameworks', 'Structure, presentation, interaction, client-side validation, accessibility'],
          ['Back end', 'Server', 'Python/Node/PHP, web framework, web server', 'Business logic, authentication, authorisation, persistence, APIs, server-side validation'],
          ['Database', 'Server / managed service', 'SQL (MySQL, PostgreSQL) or non-SQL (MongoDB, Redis)', 'Durable storage, integrity constraints, queries, transactions']
        ]
      },
      { t: 'p', v: '<b>SQL</b> databases use a fixed relational schema with strong consistency and joins; <b>non-SQL</b> stores use flexible documents or key-value pairs and scale horizontally, suiting unstructured or rapidly changing data.' },
      { t: 'h', v: 'Browsers, CSS, libraries and performance' },
      { t: 'ul', v: ['<b>Browser influence (WEB-2.3)</b> — different rendering engines mean developers must test cross-browser and use feature detection; <b>dev tools</b> give the element inspector, console, network timings, performance profiler, application storage and device emulation.', '<b>CSS (WEB-2.4)</b> — one stylesheet gives consistency of appearance across pages; media queries and relative units give flexibility across browsers and display devices; maintenance tools (pre-processors such as Sass, variables, linters, minifiers) keep large stylesheets manageable.', '<b>Version control (WEB-2.5)</b> — history, branching, rollback, blame, parallel work and traceable releases.', '<b>Code libraries (WEB-2.6)</b> — frameworks (React, Vue, Angular) manage state and complexity in large applications; template engines generate markup from data; predesigned CSS classes (Bootstrap, Tailwind) deliver consistent responsive components quickly.', '<b>Open source (WEB-2.7)</b> — licensed for inspection, modification and redistribution; faster development and community scrutiny, but creates licence obligations (GPL copyleft vs MIT) and supply-chain risk.', '<b>Load times (WEB-2.8)</b> — minify and bundle, compress (gzip/Brotli), optimise and lazy-load images, use a CDN, cache with service workers, defer non-critical JavaScript, reduce HTTP requests.', '<b>CMS (WEB-2.9)</b> — WordPress, Drupal and headless CMS let non-developers publish content; fast and cheap, but plugin bloat, performance cost and a large attack surface.'] }
    ]),

    L('WEB-L4', 'WEB', 'Back end, SQL, ORM and building a PWA', 30, ['WEB-2.10', 'WEB-2.11', 'WEB-2.12', 'WEB-2.13', 'WEB-2.14', 'WEB-2.15', 'WEB-2.16'], [
      { t: 'h', v: 'The back-end request cycle (WEB-2.11)' },
      { t: 'ol', v: ['The browser resolves DNS and opens a TCP/TLS connection.', '<b>Web server software</b> (nginx, Apache) receives the HTTP request and serves static files or passes dynamic routes on.', 'The <b>web framework</b> (Django, Express, Laravel) routes the request to a controller.', '<b>Objects</b> model the entities; <b>libraries</b> provide shared functions (authentication, validation, templating).', 'The <b>database</b> is queried; results are rendered into a response (HTML or JSON) and returned with a status code.'] },
      { t: 'p', v: '<b>Why the back end matters (WEB-2.10)</b>: it is the only place validation and authorisation can be trusted, it protects the data store, it determines scalability and response time, and it integrates payment, email and third-party services.' },
      { t: 'h', v: 'Shell scripting for a web project (WEB-2.12)' },
      { t: 'code', lang: 'text', v: `mkdir -p site/css site/js site/data     # make directory structure
touch site/index.html site/css/app.css   # create files
grep -rn "TODO" site/                    # search for text in files
grep -ric "password" site/js/            # count case-insensitive matches per file` },
      { t: 'h', v: 'SQL (WEB-2.13)' },
      { t: 'code', lang: 'sql', v: `-- Selecting fields with a WHERE constraint
SELECT studentID, surname, mark
FROM   results
WHERE  mark >= 80 AND subject = 'Software Engineering';

-- GROUP BY with an aggregate
SELECT subject, COUNT(*) AS entries, AVG(mark) AS average
FROM   results
GROUP  BY subject
HAVING AVG(mark) > 70;

-- Table join
SELECT s.surname, c.courseName, r.mark
FROM   students s
JOIN   results  r ON s.studentID = r.studentID
JOIN   courses  c ON r.courseID  = c.courseID
WHERE  c.year = 12
ORDER  BY r.mark DESC;` },
      { t: 'h', v: 'ORM vs SQL (WEB-2.14)' },
      {
        t: 'table', head: ['', 'ORM', 'Raw SQL'], rows: [
          ['Code style', 'Objects and methods in the host language', 'Query strings'],
          ['Productivity', 'High — migrations, relationships, less boilerplate', 'Lower for CRUD'],
          ['Security', 'Parameterises by default, reducing injection risk', 'Safe only if parameterised deliberately'],
          ['Performance', 'Can generate inefficient queries (N+1 problem)', 'Full control and tuning'],
          ['Portability', 'Swap database engines with little change', 'Dialect-specific']
        ]
      },
      { t: 'h', v: 'Front-end / back-end collaboration (WEB-2.15)' },
      { t: 'p', v: 'An agreed API contract (endpoints, request/response schemas, status codes) lets both sides work in parallel; mock data and stubs unblock the front end; shared version control, code review and integration testing prevent mismatched assumptions.' },
      { t: 'h', v: 'Building a PWA (WEB-2.16)' },
      { t: 'ul', v: ['<b>manifest.json</b> (name, icons, start_url, display, theme colour) makes it installable; a <b>service worker</b> caches the app shell for offline use; HTTPS is required.', '<b>UI/UX principles</b> — readable font sizes and pairing, accessible colour contrast (4.5:1 for body text), purposeful audio/video with controls and captions, predictable navigation.', '<b>Accessibility and inclusivity</b> — semantic HTML, alt text, visible focus states, full keyboard operation, ARIA where needed, responsive layouts, and never relying on colour alone to convey meaning.'] },
      { t: 'callout', k: 'tip', v: 'This study app is itself a PWA-style single-page application — open dev tools and inspect its layout, storage and network behaviour as a worked example of WEB-2.3 and WEB-2.16.' }
    ]),

    /* ======================= SOFTWARE AUTOMATION ========================= */
    L('AUT-L1', 'AUT', 'AI, ML and models of training', 25, ['AUT-1.1', 'AUT-1.2', 'AUT-1.3', 'AUT-1.4'], [
      { t: 'h', v: 'AI vs ML (AUT-1.2)' },
      { t: 'p', v: '<b>Artificial intelligence</b> is the broad field of machines performing tasks that would require human intelligence — including rule-based expert systems that contain no learning at all. <b>Machine learning</b> is a subset of AI in which a model improves its performance on a task by learning statistical patterns from data rather than from explicitly programmed rules. Deep learning is a subset of ML using multi-layer neural networks.' },
      { t: 'h', v: 'Automation through DevOps, RPA and BPA (AUT-1.1)' },
      { t: 'ul', v: ['<b>DevOps</b> — continuous integration, automated testing and continuous deployment; ML predicts build failures, flags anomalous logs and auto-scales infrastructure.', '<b>RPA</b> — software "robots" imitate user actions across existing interfaces (form filling, data re-entry); ML adds document reading and exception handling.', '<b>BPA</b> — redesigning an entire business process to run automatically end-to-end (invoice → approval → payment), using ML for classification, prediction and routing.'] },
      { t: 'h', v: 'Models of training (AUT-1.3)' },
      {
        t: 'table', head: ['Model', 'Data', 'How it learns', 'Example'], rows: [
          ['Supervised', 'Labelled', 'Maps input → known output, minimising error', 'Spam detection, house-price prediction'],
          ['Unsupervised', 'Unlabelled', 'Finds structure and groupings itself', 'Customer segmentation, anomaly detection'],
          ['Semi-supervised', 'Small labelled + large unlabelled', 'Uses the labelled subset to interpret the rest', 'Medical imaging where labelling is expensive'],
          ['Reinforcement', 'Environment feedback', 'Agent takes actions, receives reward/penalty, maximises long-term reward', 'Game playing, robot locomotion']
        ]
      },
      { t: 'h', v: 'Applications (AUT-1.4)' },
      { t: 'ul', v: ['<b>Data analysis and forecasting</b> — regression and time series for demand, weather, energy load.', '<b>Virtual personal assistants</b> — speech recognition, natural language understanding, intent classification.', '<b>Image recognition</b> — convolutional neural networks for classification, detection and segmentation.'] }
    ]),

    L('AUT-L2', 'AUT', 'ML algorithms and models', 30, ['AUT-1.5', 'AUT-1.6', 'AUT-2.1', 'AUT-2.2'], [
      { t: 'h', v: 'Models engineers use to design and analyse ML (AUT-1.5)' },
      { t: 'ul', v: ['<b>Decision tree</b> — a flowchart of tests on features; leaves are the predictions. Highly interpretable (you can read the rule), but prone to overfitting without pruning.', '<b>Neural network</b> — layers of weighted nodes with an activation function. Input layer → hidden layer(s) → output layer. Trained by forward pass, loss calculation, then backpropagation adjusting weights by gradient descent. Powerful but a "black box".'] },
      { t: 'svg', v: 'neuralnet' },
      { t: 'h', v: 'Key algorithms (AUT-1.6)' },
      {
        t: 'table', head: ['Algorithm', 'Predicts', 'Core idea'], rows: [
          ['Linear regression', 'A continuous number', 'Fit y = mx + b minimising the sum of squared errors'],
          ['Logistic regression', 'A class probability (0–1)', 'Fit a sigmoid to the linear combination; classify by threshold'],
          ['K-nearest neighbour', 'A class or value', 'Look at the k closest labelled examples by distance and take the majority/mean']
        ]
      },
      { t: 'h', v: 'Regression with OOP (AUT-2.1)' },
      { t: 'code', lang: 'python', v: `class LinearRegression:
    """Least-squares linear regression implemented with OOP (AUT-2.1)."""
    def __init__(self):
        self.m = 0.0
        self.b = 0.0

    def fit(self, xs, ys):
        n = len(xs)
        mean_x, mean_y = sum(xs) / n, sum(ys) / n
        num = sum((xs[i] - mean_x) * (ys[i] - mean_y) for i in range(n))
        den = sum((x - mean_x) ** 2 for x in xs)
        self.m = num / den
        self.b = mean_y - self.m * mean_x
        return self

    def predict(self, x):
        return self.m * x + self.b

    def r_squared(self, xs, ys):
        mean_y = sum(ys) / len(ys)
        ss_res = sum((ys[i] - self.predict(xs[i])) ** 2 for i in range(len(xs)))
        ss_tot = sum((y - mean_y) ** 2 for y in ys)
        return 1 - ss_res / ss_tot


hours  = [1, 2, 3, 4, 5, 6, 7, 8]
marks  = [52, 55, 61, 64, 70, 72, 79, 83]
model = LinearRegression().fit(hours, marks)
print(f"mark = {model.m:.2f} x hours + {model.b:.2f}")
print("predicted mark for 9 hours:", round(model.predict(9), 1))
print("R^2:", round(model.r_squared(hours, marks), 4))` },
      { t: 'p', v: '<b>Polynomial regression</b> fits a curve (y = ax² + bx + c) for non-linear relationships. <b>Logistic regression</b> replaces the output with a sigmoid, 1 / (1 + e^−z), producing a probability for binary classification.' },
      { t: 'h', v: 'Neural network with OOP (AUT-2.2)' },
      { t: 'code', lang: 'python', v: `import math, random

class Neuron:
    def __init__(self, n_inputs):
        self.w = [random.uniform(-1, 1) for _ in range(n_inputs)]
        self.b = random.uniform(-1, 1)

    @staticmethod
    def sigmoid(z):
        return 1 / (1 + math.exp(-z))

    def forward(self, inputs):
        z = sum(w * x for w, x in zip(self.w, inputs)) + self.b
        return self.sigmoid(z)

class Network:
    """Single-neuron network trained on the AND function."""
    def __init__(self):
        self.out = Neuron(2)

    def train(self, data, epochs=5000, lr=0.5):
        for _ in range(epochs):
            for inputs, target in data:
                pred  = self.out.forward(inputs)
                error = target - pred
                delta = error * pred * (1 - pred)        # sigmoid derivative
                for i in range(len(self.out.w)):
                    self.out.w[i] += lr * delta * inputs[i]
                self.out.b += lr * delta

data = [([0,0],0), ([0,1],0), ([1,0],0), ([1,1],1)]
net = Network(); net.train(data)
for inputs, target in data:
    print(inputs, "->", round(net.out.forward(inputs), 3), "target", target)` }
    ]),

    L('AUT-L3', 'AUT', 'Impact, human behaviour and bias', 25, ['AUT-3.1', 'AUT-3.2', 'AUT-3.3'], [
      { t: 'h', v: 'Impact of automation (AUT-3.1)' },
      {
        t: 'table', head: ['Dimension', 'Positive', 'Negative'], rows: [
          ['Safety of workers', 'Machines take dangerous, repetitive and heavy tasks', 'New hazards from human–robot interaction; complacency'],
          ['People with disability', 'Assistive automation, speech interfaces, prosthetics increase independence and employment', 'Systems trained without disabled users exclude them'],
          ['Employment', 'Growth in high-skill design, data and maintenance roles', 'Displacement of routine roles; retraining burden falls unevenly'],
          ['Efficiency, waste, environment', 'Less material waste, optimised energy and logistics', 'Energy and water cost of training large models; e-waste'],
          ['Economy and wealth', 'Lower prices, higher productivity', 'Returns concentrate with capital owners, widening inequality']
        ]
      },
      { t: 'h', v: 'Human behaviour in ML/AI design (AUT-3.2)' },
      { t: 'ul', v: ['<b>Psychological responses</b> — trust, automation bias (over-trusting output) and the uncanny valley shape interface design and how confidence is displayed.', '<b>Acute stress response</b> — under fight/flight, users lose fine motor control and narrow their attention; emergency interfaces need large targets, few choices and clear defaults.', '<b>Cultural protocols</b> — naming, imagery, gendered voices and data sovereignty (including Indigenous Cultural and Intellectual Property) must be respected.', '<b>Belief systems</b> — assumptions baked into labels and categories can conflict with users’ values; involve community in design.'] },
      { t: 'h', v: 'Bias (AUT-3.3)' },
      { t: 'ul', v: ['<b>Dataset source bias</b> — the training data is not representative (facial recognition trained mostly on light-skinned faces; hiring data reflecting past discrimination).', '<b>Human bias</b> — choices of features, labels, thresholds and success metrics encode the developer’s assumptions; confirmation bias in evaluation.', '<b>Mitigation</b> — diverse and documented datasets (datasheets/model cards), measuring accuracy per subgroup, diverse teams, human oversight for consequential decisions, and auditing after deployment.'] }
    ]),

    /* ======================= SOFTWARE ENGINEERING PROJECT ================ */
    L('SEP-L1', 'SEP', 'Identifying and defining the problem', 25, ['SEP-1.1', 'SEP-1.2', 'SEP-1.3'], [
      { t: 'h', v: 'Defining requirements (SEP-1.1)' },
      { t: 'ul', v: ['<b>Need or opportunity</b> — evidence that the problem is real: survey data, interview quotes, observation of the current process.', '<b>Feasibility</b> — scheduling (can it be built in the time available?) and financial (hardware, hosting, licences).', '<b>Functional requirements</b> — what the system does. <b>Performance requirements</b> — how well (response time, concurrent users, uptime).', '<b>Data structures and data types</b> — recorded in a data dictionary.', '<b>Boundaries</b> — what is explicitly out of scope. This protects you from scope creep and is directly assessed.'] },
      { t: 'h', v: 'Idea generation tools (SEP-1.2)' },
      { t: 'p', v: 'Brainstorming and mind-mapping open the solution space; storyboards sequence the user’s journey screen by screen; data dictionaries pin down types; algorithm design (pseudocode/flowcharts) precedes code generation; then testing and debugging, installation and maintenance planning.' },
      { t: 'h', v: 'Implementation methods (SEP-1.3)' },
      {
        t: 'table', head: ['Method', 'How', 'Risk', 'Cost'], rows: [
          ['Direct', 'Old system off, new system on, at once', 'Highest — no fallback', 'Lowest'],
          ['Phased', 'Introduced module by module', 'Moderate — isolated to each phase', 'Moderate'],
          ['Parallel', 'Both systems run together and outputs compared', 'Lowest — fallback always available', 'Highest (double operation)'],
          ['Pilot', 'One site or group uses it first', 'Low — contained to the pilot group', 'Moderate']
        ]
      }
    ]),

    L('SEP-L2', 'SEP', 'Development approaches and project management', 30, ['SEP-2.1', 'SEP-2.2', 'SEP-2.3', 'SEP-2.4', 'SEP-2.5', 'SEP-2.6', 'SEP-2.7', 'SEP-2.8', 'SEP-2.9'], [
      { t: 'h', v: 'Waterfall (SEP-2.1)' },
      { t: 'p', v: 'A logical progression through the life cycle where each stage is completed and signed off before the next begins — the "stages of falling water" (requirements → specifications → design → development → integration → testing → installation → maintenance). <b>Advantages:</b> clear milestones, thorough documentation, easy to manage and cost, suits regulated and safety-critical work. <b>Disadvantages:</b> inflexible to change, the client sees nothing working until late, defects found at the end are expensive. <b>Scale:</b> large, stable, well-understood projects.' },
      { t: 'h', v: 'Agile (SEP-2.2)' },
      { t: 'p', v: 'Short iterations deliver working increments. <b>Rate of developing a final solution:</b> usable software early, with the full solution emerging over iterations. <b>Method tailoring:</b> the team adapts the framework (Scrum, Kanban, XP) to its own context. <b>Iteration workflow:</b> backlog → sprint planning → daily stand-up → build and test → review → retrospective. <b>Scale:</b> small to medium co-located teams with evolving requirements.' },
      { t: 'h', v: 'WAgile (SEP-2.3)' },
      { t: 'p', v: 'A hybrid: Waterfall’s up-front planning, documentation and fixed milestones for governance, with Agile iterations inside the build phase. Intervention is applied <b>when</b> requirements are partly fixed (contractual or regulatory) but detail will evolve, and <b>how</b> by keeping stage gates while running sprints between them. Suits large organisations and medium-to-large projects with external reporting obligations.' },
      { t: 'h', v: 'Project management (SEP-2.4)' },
      { t: 'ul', v: ['<b>Gantt chart</b> — tasks on the vertical axis, time on the horizontal; bars show duration, dependencies show order, milestones mark deliverables, and the critical path identifies tasks that cannot slip.', '<b>Collaboration tools</b> — shared repository, issue tracker/Kanban board, chat and shared documents.'] },
      { t: 'h', v: 'Social, ethical and communication issues (SEP-2.5, SEP-2.6)' },
      { t: 'ul', v: ['Working individually vs collaboratively: fair attribution of work, honest reporting of progress, managing unequal contribution.', 'Responding to stakeholders: accessibility, privacy of test participants, informed consent.', '<b>Involving and empowering the client</b> — regular demonstrations, client-set priorities.', '<b>Enabling feedback</b> — structured surveys, usability sessions, a channel for ongoing comment.', '<b>Negotiating</b> — trading scope, time and quality explicitly when something must give.'] },
      { t: 'h', v: 'Quality assurance (SEP-2.7)' },
      { t: 'ul', v: ['Define the criteria on which quality will be judged before building (measurable, tied to requirements).', 'Check continually that requirements are being met — reviews at each milestone, automated tests on each commit.', 'Address compliance and legislative requirements — privacy, accessibility (WCAG), copyright and licensing, records retention.'] },
      { t: 'h', v: 'Back-end engineering (SEP-2.9)' },
      { t: 'p', v: 'Technology selection, robust error handling, clean interfacing with the front end through a defined API, and security engineering built in from the start all determine how easily the solution can be completed, extended and trusted.' }
    ]),

    L('SEP-L3', 'SEP', 'Producing, testing and evaluating', 25, ['SEP-3.1', 'SEP-3.2', 'SEP-3.3', 'SEP-3.4', 'SEP-3.5', 'SEP-3.6', 'SEP-3.7', 'SEP-3.8', 'SEP-4.1', 'SEP-4.2', 'SEP-4.3', 'SEP-4.4'], [
      { t: 'h', v: 'Producing and implementing' },
      { t: 'ul', v: ['<b>Document algorithms (SEP-3.3)</b> — pseudocode or flowcharts for every non-trivial subroutine, kept in the portfolio alongside the final code.', '<b>Allocate resources (SEP-3.4)</b> — people, time, hardware, libraries and budget, mapped onto the Gantt chart.', '<b>Programmed data backup (SEP-3.5)</b> — a scheduled script (cron/Task Scheduler) producing timestamped copies, stored off-device, with restoration actually tested.', '<b>Version control (SEP-3.6)</b> — meaningful commit messages, feature branches, tagged releases; the commit history is direct evidence of your development process.', '<b>Responding to difficulties (SEP-3.7)</b> — searching documentation and forums (with critical evaluation of what you copy), collaborating with peers, or outsourcing a component; all must be acknowledged.', '<b>Innovative prototype (SEP-3.8)</b> — a non-functional UI prototype proposing an extension, justified against user feedback.'] },
      { t: 'h', v: 'Testing and evaluating (SEP-4.x)' },
      { t: 'ul', v: ['Apply unit, subsystem and system testing and black/white/grey box approaches.', '<b>Language-dependent optimisation (SEP-4.2)</b> — e.g. Python list comprehensions and generators instead of manual loops, caching with a dictionary, avoiding repeated string concatenation; JavaScript: debouncing, minimising DOM reflow.', '<b>Analyse and respond to feedback (SEP-4.3)</b> — record it, categorise it, decide and justify what you will act on.'] },
      { t: 'h', v: 'Evaluating effectiveness (SEP-4.4)' },
      {
        t: 'table', head: ['Requirement', 'Test data', 'Expected output', 'Actual output', 'Verdict'], rows: [
          ['Reject mark above 100', '101 (boundary)', 'Error: must be 0–100', 'Error: must be 0–100', 'Pass'],
          ['Accept upper boundary', '100', 'Accepted, stored', 'Accepted, stored', 'Pass'],
          ['Handle empty input', '""', 'Error: required field', 'Crash — ValueError', 'Fail → defect #12']
        ]
      },
      { t: 'p', v: 'Your evaluation report should synthesise feedback, present the test plan, show path and boundary test data, compare actual with expected output, and conclude with a judgement against the original requirements — including what you would do differently.' }
    ])
  ];

  const byArea = id => LESSONS.filter(l => l.areaId === id);
  const byId = id => LESSONS.find(l => l.id === id);
  const forPoint = pid => LESSONS.filter(l => l.points.indexOf(pid) !== -1);

  A.Notes = { LESSONS, byArea, byId, forPoint };
})(window.APP = window.APP || {});
