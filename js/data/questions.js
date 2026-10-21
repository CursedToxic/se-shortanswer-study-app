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
      stem: 'Desk check the algorithm above using the data [4, 9, 2, 9, 7], then interpret its logic by stating the inputs, outputs and purpose of the algorithm, and give the value of `result` after each iteration.',
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
      sample: 'Waterfall runs as a sequential series of stages, each signed off and documented before the next begins, whereas Agile runs as short iterative sprints that each deliver a working increment for continuous client feedback. The fitness app should use Agile, because its requirements will keep changing with user feedback and iterations absorb that change cheaply. The infusion pump should use Waterfall: its requirements are fixed by regulation, certification demands complete documentation at every stage, and late unplanned change would be unsafe.'
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
      sample: 'The history fails almost every collaborative requirement. Commit messages such as \'stuff\' and \'asdf\' give no traceability of what changed or why, and there is no branching: all work lands on main, and the conflict was resolved by taking ours, which silently discarded a member\'s work. There is no evidence of feedback through review. The team should adopt a commit message convention stating the change and its reason, use a feature branch per task with a pull request so a peer reviews it, and resolve conflicts with both authors present. The history does at least show regular commits, but that alone is not version control used well.'
    }),
    Q({
      id: 'OOP-Q6', area: 'OOP', points: ['OOP-1.2'], outcome: 'SE-11-02', marks: 3, format: 'short',
      stem: 'Compare procedural programming with object-oriented programming, referring to how each organises data and how each supports maintenance of a large system.',
      criteria: [
        { t: 'Procedural: functions/procedures operating on data that is often global or passed around', kw: ['procedur', 'function', 'global', 'separate'] },
        { t: 'OOP: objects bundle data and behaviour, access controlled by the class', kw: ['object', 'class', 'encapsulat', 'bundle', 'attribute'] },
        { t: 'Addresses maintenance/scale — OOP localises change, supports reuse via inheritance; procedural becomes harder to maintain as size grows', kw: ['maintain', 'reuse', 'inherit', 'scale', 'large', 'localis'] }
      ],
      sample: 'Procedural programming organises a solution as functions acting on data held separately, often globally, so any procedure can change it. OOP instead organises it as objects whose class bundles attributes with the methods that use them, with access controlled by encapsulation. For a large system OOP localises change and supports reuse through inheritance, whereas procedural code becomes harder to maintain as shared data and call relationships grow.'
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
      id: 'MEC-Q2', area: 'MEC', points: ['MEC-1.6', 'MEC-1.3'], outcome: 'SE-11-03', marks: 3, format: 'short',
      media: dgm('sorterarch'),
      stem: 'The parcel sorter in Figure E3 draws 180 mA (controller and sensors), 950 mA (conveyor motor) and 420 mA (diverter servo at peak). Calculate the expected runtime on the 2200 mAh battery, and identify the sensors, actuators and end effectors in the system.',
      criteria: [
        { t: 'Totals the current draw as 1550 mA', kw: ['1550', '1.55'] },
        { t: 'Calculates runtime ≈ 1.42 hours (about 85 minutes)', kw: ['1.4', '1.42', '85', '1 hour', '1.41'] },
        { t: 'Correctly classifies sensors: IR sensor, load cell, camera', kw: ['ir', 'load cell', 'camera'] },
        { t: 'Correctly classifies actuators (conveyor motor, servo) and the end effector (diverter arm)', kw: ['motor', 'servo', 'diverter', 'end effector'] }
      ],
      sample: 'Total draw = 180 + 950 + 420 = 1550 mA. Runtime = 2200 ÷ 1550 = 1.42 hours, about 85 minutes, and less once a safety margin is allowed. Sensors: the IR sensor, the load cell and the camera. Actuators: the conveyor motor and the diverter servo. The end effector is the diverter arm, the only part that acts on the parcel.'
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
      sample: 'The algorithm has a single threshold and no dead band, so tiny sensor fluctuations around 25 °C flip the condition many times per second and the heater chatters. This wastes energy and causes relay and heater wear, and the temperature never settles. Adding hysteresis fixes it: switch on below 24.5 °C and off above 25.5 °C, holding state in between. Proportional control is better still, because power then falls smoothly as the setpoint is approached.'
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
      sample: 'Input must not depend on grip or fine motor precision, so voice commands or large switches are required, with audio and visual confirmation. Actuator force must be limited and compliant, with an emergency stop within reach and motions that are slow, predictable and reversible, because a collision would injure the user. These requirements must come from consultation and co-design with people who have the condition rather than from assumption. Getting them wrong matters socially: a device that misreads atypical speech excludes the user from the independence and dignity it promised, while leaving them dependent on it.'
    }),
    Q({
      id: 'MEC-Q5', area: 'MEC', points: ['MEC-1.2'], outcome: 'SE-11-03', marks: 3, format: 'short',
      stem: 'Explain how the hardware of a microcontroller influences the way code is written for a mechatronic system. Refer to two specific hardware characteristics.',
      criteria: [
        { t: 'Names a specific constraint (limited RAM/flash, no FPU, clock speed, instruction set, register width)', kw: ['ram', 'memory', 'flash', 'floating point', 'fpu', 'clock', 'instruction set', 'register', '8-bit', '16-bit'] },
        { t: 'Explains the consequence for the code written', kw: ['integer', 'avoid', 'efficient', 'smaller', 'fixed point', 'loop', 'sampling', 'optimis'] }
      ],
      sample: 'A microcontroller typically has only a few kilobytes of RAM, so code must avoid large arrays and process sensor data in a small rolling buffer. Many have no floating-point unit, which means floating-point maths is emulated and slow, so control code uses fixed-point integer arithmetic to keep each loop within its timing budget.'
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
      sample: 'The search term is concatenated into the SQL, so the database cannot tell code from data: ?q=%\' OR 1=1 -- returns every note. The term is also echoed into the HTML unencoded, a reflected XSS, so a crafted link runs <script> in the victim\'s browser and steals their session cookie. Rewritten defensively:\n\napp.get(\'/search\', (req, res) => {\n  const term = String(req.query.q ?? \'\').trim();\n  if (!term || term.length > 50) return res.status(400).render(\'error\');\n  db.query(\'SELECT id, title FROM notes WHERE owner_id = ? AND title LIKE ?\',\n    [req.session.userId, `%${term}%`],\n    (err, rows) => err ? res.status(500).render(\'error\') : res.render(\'results\', { term, rows }));\n});\n\nThis parameterises the query, validates length, escapes output through the template engine and restricts rows to the owner.'
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
      sample: 'The gateway accepts HTTP on port 80, so credentials cross the network in plain text and can be intercepted; enforce HTTPS with TLS and HSTS. Passwords are stored as MD5, which is fast and unsalted and falls to rainbow tables within minutes; re-hash with bcrypt or Argon2id and force a reset. Session IDs are userID+1, so any user can guess another\'s session and impersonate them; generate 128-bit random IDs, regenerate on login and set HttpOnly, Secure and SameSite. The log service records full passwords, making the logs a higher-value target than the database; redact credentials and restrict log access. The admin panel performs no authorisation check, so any authenticated user who finds the URL gains control; enforce role-based authorisation server-side. The internal network is the only thing working in its favour, and that is not a control. Overall the architecture fails confidentiality, integrity and accountability, and should not hold private notes until all five are fixed and penetration tested.'
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
      sample: 'From 02:14 to 02:51 a single source made over 41 000 failed logins against the admin account, roughly 20 per second, and one finally succeeded: a brute-force attack. Thirty-five seconds later that session exported all 48 217 user rows, a mass exfiltration, then deleted audit_bot to destroy the accountability evidence. Two controls would have stopped it: rate limiting with progressive lockout and CAPTCHA, which makes 41 000 attempts take years rather than 37 minutes, and mandatory multi-factor authentication on admin accounts, so a guessed password alone is useless. Alerting on bulk export should also be added.'
    }),
    Q({
      id: 'SSA-Q5', area: 'SSA', points: ['SSA-2.4'], outcome: 'SE-12-04', marks: 4, format: 'short',
      media: scen('A fitness app collects continuous GPS location, contacts, and health metrics. The default settings share the user’s route publicly, and the privacy policy is a 12-page document shown once at sign-up. Data is retained indefinitely "to improve the service".'),
      stem: 'Evaluate this app against the ‘privacy by design’ approach, referring to a proactive rather than reactive stance, embedding privacy into the design, and respect for user privacy.',
      criteria: [
        { t: 'Proactive not reactive — privacy risk anticipated and prevented before harm, not patched after a complaint', kw: ['proactive', 'reactive', 'anticipat', 'prevent', 'before'] },
        { t: 'Embed privacy into design — privacy as a default/core component, data minimisation', kw: ['default', 'embed', 'minimis', 'minimiz', 'core', 'by default'] },
        { t: 'Respect for user privacy — consent, control, transparency', kw: ['consent', 'control', 'transparen', 'respect', 'user-centric', 'retention'] }
      ],
      sample: 'The app fails all three aspects. It is reactive rather than proactive: publicly sharing routes by default creates a foreseeable stalking risk that should have been anticipated and prevented before harm, not patched after a complaint. Privacy is not embedded in the design: the most private setting should be the default, and data minimisation would mean not collecting contacts at all. It does not respect user privacy, since a twelve-page policy shown once is not meaningful consent and indefinite retention gives the user no control. The only credit is that a policy exists at all.'
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
      sample: 'For individuals the ramifications are severe: names, addresses and dates of birth are exactly what enables identity theft, fraud and targeted phishing, and unlike a password they cannot be reissued, so the loss of control over personal information is permanent. Legally the retailer is bound by the Privacy Act and the Australian Privacy Principles, particularly APP 11, and must notify affected individuals and the OAIC, with civil penalties possible. Ethically it owed a duty of care; leaving a known flaw unpatched for 14 months is negligence, and it should disclose transparently and fund remediation. For the enterprise there is reputation damage, remediation cost, likely customer loss and new compliance employment. The breach was preventable, so overall the company is culpable rather than unlucky.'
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
      stem: 'Explain what happens between a user typing https://shop.example.com.au into a browser and the first byte of the page arriving, referring to DNS, IP addressing, packets and TCP.',
      criteria: [
        { t: 'DNS resolution described as a lookup chain (cache → resolver → root → TLD → authoritative)', kw: ['dns', 'resolver', 'root', 'tld', 'authoritative', 'cache', 'name server'] },
        { t: 'Result is an IP address used to address the request', kw: ['ip address', 'ipv4', 'ipv6'] },
        { t: 'TCP connection/handshake established, reliable ordered delivery', kw: ['tcp', 'handshake', 'syn', 'connection', 'reliable', 'ordered'] },
        { t: 'Data split into packets with headers, routed independently, reassembled', kw: ['packet', 'header', 'reassembl', 'route', 'sequence'] }
      ],
      sample: 'The browser first resolves the domain: it checks its cache, then asks a resolver, which queries a root server, the .au TLD server and finally the authoritative name server, returning an IPv4 address such as 203.0.113.25. It opens a TCP connection to port 443 with the three-way handshake, so delivery is reliable and ordered, and TLS negotiates encryption. The request is then split into packets, each carrying a header with source and destination IP and a sequence number, which routers forward independently and TCP reassembles in order.'
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
      sample: 'Client-side JavaScript runs in the user\'s own browser, which they fully control: they can edit it in dev tools or disable it entirely. More importantly the front end is not required at all, because an attacker can send an HTTP request straight to the endpoint with curl, bypassing every check. The server is the trust boundary, so server-side validation is the only real security control. Client-side validation is still worth having, but for usability — immediate feedback without a round trip.'
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
      sample: 'The server sends its SSL certificate, which binds its public key to the domain and is signed by a Certificate Authority the browser already trusts, so the client can verify the server\'s identity. The client then uses that public key, asymmetric encryption, to send a secret only the matching private key can decrypt, and both sides derive a shared session key. All application data is then encrypted symmetrically with AES because it is far faster for bulk data. Hash values give integrity, since any alteration in transit changes the digest and is detected.'
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
      sample: 'The W3C develops the open standards that keep the web interoperable across browsers and devices, including WCAG through its Web Accessibility Initiative. The council site fails it badly. Light grey text fails the contrast requirement, so it should be darkened to a ratio of at least 4.5:1. Errors shown only in red rely on colour alone, so each needs accompanying text. The mouse-only menu fails keyboard operability and the infographic has no alt text, so both must be fixed. The site is clearly non-compliant and unacceptable for an essential public service, though its content itself is sound.'
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
      id: 'WEB-Q8', area: 'WEB', points: ['WEB-2.8'], outcome: 'SE-12-06', marks: 4, format: 'short',
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
      sample: 'The hero image is the biggest cost: a 3840-pixel PNG served to a 390-pixel phone, so it should be resized with srcset, converted to WebP and lazy-loaded, removing several megabytes. The 2.1 MB bundle includes six unused libraries, so it should be minified, tree-shaken and code-split, with non-critical scripts deferred. The CSS should be minified and all static assets served from a CDN with long cache lifetimes. I would do the image first because it alone accounts for nearly half the load time.'
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
      sample: 'AI is the broad field of machines performing tasks that would need human intelligence, whereas ML is a subset of it in which a model learns patterns from data rather than following written rules. A rule-based expert system is AI with no ML.'
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
      sample: 'The class fits a least-squares line of best fit: fit() calculates the gradient m and the intercept b, and predict() applies y = mx + b. For this data m = 2.0, b = 1.0 and predict(10) returns 21.0. A key limitation is that it assumes a straight-line relationship, so where the true relationship curves — study hours against marks must plateau below 100% — the model systematically over-predicts at the extremes and the forecast becomes unreliable.'
    }),
    Q({
      id: 'AUT-Q4', area: 'AUT', points: ['AUT-3.3'], outcome: 'SE-12-05', marks: 5, format: 'extended',
      media: scen('A company builds an ML model to shortlist job applicants. It is trained on 10 years of the company’s own hiring decisions. In testing, the model shortlists applicants from one university at triple the rate of equally qualified applicants from others, and ranks applicants with a gap in employment history significantly lower.'),
      stem: 'Analyse how human bias and dataset source bias have shaped this model’s behaviour, and recommend how the development team should respond.',
      criteria: [
        { t: 'Identifies dataset source bias — training on historical decisions encodes past human preferences', kw: ['historical', 'past decisions', 'dataset', 'training data', 'encode', 'reflect'] },
        { t: 'Identifies human bias in feature/label/metric choice', kw: ['feature', 'label', 'proxy', 'metric', 'developer', 'choice'] },
        { t: 'Explains a concrete harm (discrimination, proxy for protected attributes, feedback loop)', kw: ['discriminat', 'proxy', 'unfair', 'feedback loop', 'caregiv', 'disability', 'socioeconomic'] },
        { t: 'Recommends mitigation — subgroup accuracy measurement, dataset auditing/documentation, diverse teams', kw: ['audit', 'subgroup', 'measure', 'diverse', 'document', 'datasheet', 'test'] },
        { t: 'Recommends human oversight / not automating the consequential decision', kw: ['human oversight', 'human in the loop', 'review', 'not automat', 'advisory', 'appeal'] }
      ],
      sample: 'The dominant problem is dataset source bias: the model is trained on the company\'s own historical hiring decisions, so it learns to reproduce who was chosen before rather than who performs well, which is why one university is favoured. Human bias compounds this through the developers\' choice of label and features, since university is a proxy for socioeconomic background and an employment gap is a proxy for caregiving or disability, so the model discriminates on protected attributes it was never given. Left live, its shortlists become next year\'s training data, a feedback loop. The team should audit and document the dataset, measure accuracy per subgroup rather than in aggregate, remove proxy features, and keep the model advisory with human review and an appeals process.'
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
      sample: 'The pipeline automates commit to production, with each stage a quality gate. At the automated test stage, ML can perform predictive test selection, running the tests most likely to fail first and triaging flaky tests, so feedback arrives in minutes rather than hours. In staging and production it supports anomaly detection, modelling normal log and error-rate behaviour and triggering an automatic rollback when a deployment deviates.'
    }),
    Q({
      id: 'AUT-Q6', area: 'AUT', points: ['AUT-3.1'], outcome: 'SE-12-05', marks: 4, format: 'extended',
      stem: 'Assess the impact of automation on the individual, society and the environment, referring to at least three of: the safety of workers, people with disability, the skills required for employment, production efficiency and waste, and the distribution of wealth.',
      criteria: [
        { t: 'Safety of workers — removal from hazardous tasks, plus new risks', kw: ['safety', 'hazard', 'danger', 'injur', 'collision'] },
        { t: 'Employment — displacement of routine roles and growth of new skill requirements', kw: ['employ', 'job', 'displac', 'reskill', 'retrain', 'skills'] },
        { t: 'Environment — efficiency and waste reduction vs energy use and e-waste', kw: ['environment', 'waste', 'energy', 'emission', 'e-waste', 'efficien'] },
        { t: 'Makes a judgement rather than only listing (assess)', kw: ['overall', 'however', 'on balance', 'therefore', 'benefit outweigh', 'depends'] }
      ],
      sample: 'Automation removes workers from hazardous tasks, improving safety, though human-robot collision introduces new risks. For employment it displaces routine roles while raising demand for design and maintenance skills, and the difficulty is that these are not the same people, so the cost falls on those least able to retrain. Environmentally it reduces material waste and optimises energy, but training large models consumes substantial energy and shortened hardware cycles create e-waste. Overall the benefits are real but unevenly distributed, so the net impact depends on whether retraining is funded rather than on the technology itself.'
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
      sample: 'WAgile is a hybrid: it keeps Waterfall\'s up-front planning and stage gates while running Agile sprints inside the build phase. Here the requirements, architecture and contract are signed off first, giving the agency its fixed price and milestone reporting, and the interface is then developed in fortnightly sprints with public usability testing. Pure Waterfall is unsuitable because the UI cannot be specified in advance and its feedback would arrive too late to change. Pure Agile is unsuitable because a fixed-price government contract needs a defined scope and auditable progress, which an emergent backlog cannot provide. For a large, externally governed project with one uncertain component, WAgile is therefore the appropriate recommendation.'
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
      sample: 'The solution does not meet R3. Group size 0 is wrongly accepted and 8 is wrongly rejected, both boundary failures, and both point to incorrect comparison operators: the condition is almost certainly size >= 0 and size < 8 rather than >= 1 and <= 8. The crash on non-numeric input is a separate defect caused by missing type validation and error handling, which also leaks a stack trace. It correctly rejects 9, but three of five cases fail, so the solution is not fit for release until the operators are corrected and the conversion is wrapped in a try block.'
    }),
    Q({
      id: 'SEP-Q4', area: 'SEP', points: ['SEP-2.4'], outcome: 'SE-12-09', marks: 3, format: 'short',
      stem: 'Explain how a Gantt chart supports the management of a software engineering project, referring to dependencies, milestones and the critical path.',
      criteria: [
        { t: 'Describes the structure — tasks against a timeline with bars showing duration', kw: ['task', 'timeline', 'bar', 'duration', 'horizontal'] },
        { t: 'Explains dependencies — tasks that cannot start until another finishes', kw: ['depend', 'cannot start', 'predecessor', 'sequence', 'order'] },
        { t: 'Explains milestones and/or critical path and their use in tracking', kw: ['milestone', 'critical path', 'slip', 'deadline', 'track', 'progress'] }
      ],
      sample: 'A Gantt chart lists tasks down the page against time across it, with each bar\'s length showing its duration. Arrows show dependencies, so it is clear that integration cannot start until both modules are complete and why delaying one task delays others. Milestones mark deliverables, and the critical path identifies the chain that cannot slip, so shading progress against each bar reveals slippage early enough to respond.'
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
      sample: 'The need must be demonstrated with evidence rather than assumed, by timing the recess queue for a week and surveying students and canteen staff. Functional requirements: students can browse the menu with prices and allergens, place and pay for an order, and receive a collection time; staff can view the order queue and mark items sold out. Performance requirements must be measurable: 400 concurrent users in the ten minutes before recess, every action responding within two seconds. The boundaries exclude stock and supplier management, payroll and home delivery, and payment is handled by an existing gateway, so card data never reaches our system.'
    }),
    Q({
      id: 'SEP-Q6', area: 'SEP', points: ['SEP-3.5', 'SEP-3.6'], outcome: 'SE-12-09', marks: 4, format: 'short',
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
      sample: 'The crontab runs backup.sh at 02:00 nightly; the script builds a timestamped gzip archive of the project and deletes archives older than 30 days, giving an automated rolling retention with no manual effort. The significant weakness is that the archives sit on the same machine as the project, so the event most likely to destroy the data — disk failure, theft or ransomware — destroys every backup with it. The fix is to copy each archive off the machine to cloud storage, keeping one copy off-site. The script also never checks whether tar succeeded and no restore has been tested, so a verified quarterly test restore should be added.'
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
