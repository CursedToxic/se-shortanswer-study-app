/* ===========================================================================
   questions-c.js — third bank, completing examination coverage so that every
   content dot point in the syllabus is directly assessable.
   =========================================================================== */
(function (A) {
  'use strict';
  const { QUESTIONS, code, log, dgm, scen } = A.Questions;
  const add = q => QUESTIONS.push(q);

  /* ===================== PROGRAMMING FUNDAMENTALS ====================== */
  add({
    id: 'PF-Q15', area: 'PF', points: ['PF-2.6'], outcome: 'SE-11-02', marks: 1, format: 'mcq',
    media: code('text', `BEGIN UpdateDisplay(temperature)
    PRINT "Current: " + temperature
END UpdateDisplay

BEGIN ConvertToFahrenheit(celsius)
    result = celsius * 9 / 5 + 32
    RETURN result
END ConvertToFahrenheit`),
    stem: 'Identify the subprograms above correctly.',
    options: [
      'Both are functions, because both accept a parameter',
      'UpdateDisplay is a procedure and ConvertToFahrenheit is a function',
      'UpdateDisplay is a function and ConvertToFahrenheit is a procedure',
      'Both are procedures, because neither declares a data type'
    ],
    answer: 1,
    why: 'A function returns a value to the point of call; a procedure performs an action without returning a value. ConvertToFahrenheit has a RETURN statement so it is a function; UpdateDisplay produces output but returns nothing, so it is a procedure. Accepting a parameter does not determine which it is.'
  });
  add({
    id: 'PF-Q16', area: 'PF', points: ['PF-3.5', 'PF-4.2'], outcome: 'SE-11-04', marks: 4, format: 'short',
    media: scen('A weather station logs one reading every minute, permanently, to be processed in nightly batches. A separate part of the same system holds the 10 most recent readings so the display can show a rolling average, and a third part stores each station’s name, latitude, longitude and installation date as one unit.'),
    stem: 'Select an appropriate data structure for each of the three requirements described, and justify each choice.',
    criteria: [
      { t: 'Sequential file selected for the permanent log, justified by batch processing / append-only access', kw: ['sequential file', 'sequential', 'batch', 'append'] },
      { t: 'Array (or list) selected for the rolling 10 readings, justified by fixed size and indexed access', kw: ['array', 'list', 'index', 'fixed size', 'ten', '10'] },
      { t: 'Record selected for the station details, justified by grouping fields of different types as one unit', kw: ['record', 'field', 'different types', 'one unit', 'struct'] },
      { t: 'Justifies rather than merely names each structure', kw: ['because', 'since', 'suited', 'justif', 'reason', 'allows'] }
    ],
    sample: 'The permanent log should be a sequential file: readings are only ever appended in time order and read from start to end during nightly batch processing, which is exactly the access pattern a sequential file is efficient for, and a file persists beyond program execution as the requirement demands. Random access is never needed, so the main weakness of the structure does not apply. The 10 most recent readings should be held in a fixed-size array of 10 real values used as a circular buffer, because the size is known and unchanging, indexed access allows the rolling average to be calculated by iterating the 10 elements, and the oldest entry is simply overwritten by the newest. A list would also work if the language lacks fixed arrays. The station details should be a record, since name (string), latitude and longitude (real) and installation date (date) are fields of different data types that belong together as one logical item; a record keeps them as a single unit that can be passed to a subprogram as one parameter, which an array could not do because arrays are homogeneous.'
  });
  add({
    id: 'PF-Q17', area: 'PF', points: ['PF-4.1', 'PF-4.4'], outcome: 'SE-11-07', marks: 5, format: 'extended',
    media: code('python', `# Version A
def process(d):
    t=0
    for x in d: t+=x[1]
    return t/len(d)

# Version B
def calculate_mean_mark(results):
    """Return the mean mark from a list of (student_id, mark) tuples.

    Raises ValueError if the list is empty.
    """
    if not results:
        raise ValueError("Cannot calculate a mean from an empty result set")
    total = sum(mark for _, mark in results)
    return total / len(results)`),
    stem: 'Both versions produce the same mean for valid input. Test and evaluate these solutions against the four key aspects named in the syllabus, and state which you would accept into a shared codebase.',
    criteria: [
      { t: 'Functionality — B handles the empty-list case, A raises an unhandled ZeroDivisionError', kw: ['empty', 'zerodivision', 'divide by zero', 'crash', 'functional'] },
      { t: 'Performance — addressed honestly (equivalent; both O(n), no meaningful difference)', kw: ['performance', 'o(n', 'same', 'equivalent', 'negligible', 'linear'] },
      { t: 'Readability of code — B uses meaningful identifiers, spacing and a clear single task', kw: ['readab', 'identifier', 'name', 'meaningful', 'clear'] },
      { t: 'Quality of documentation — B has a docstring stating the contract, A has none', kw: ['document', 'docstring', 'comment', 'contract'] },
      { t: 'Reaches a judgement and justifies it', kw: ['accept', 'version b', 'recommend', 'choose', 'therefore'] }
    ],
    sample: 'Functionality: with valid input both return the same mean, but testing with faulty and abnormal data separates them. Passing an empty list to Version A evaluates total/len(d) as 0/0 and raises an unhandled ZeroDivisionError that terminates the program, whereas Version B validates first and raises a ValueError with a message the caller can catch and act on. Version A also fails obscurely if a tuple is malformed, because x[1] is unguarded. Performance: both iterate the list once and are O(n); the generator expression in B avoids building an intermediate list, so if anything B uses marginally less memory, but on any realistic dataset the difference is negligible and performance is not a reason to prefer either. Readability of code: Version A uses single-character identifiers (d, t, x), statements crammed onto one line, and no spacing, so a maintainer must decode what it does; Version B names the function and its parameter for the domain, unpacks the tuple descriptively, and performs one logical task that can be understood at a glance. Quality of documentation: Version A has none — not even a comment on what the input structure must be — while Version B has a docstring stating the expected input, the return value and the exception raised, which is the contract another developer codes against. I would accept Version B. It is equal on performance and better on every other aspect, and the functional difference is a defect that would eventually reach production, since an empty result set is a normal occurrence rather than an exotic one.'
  });

  /* ===================== OBJECT-ORIENTED PARADIGM ====================== */
  add({
    id: 'OOP-Q11', area: 'OOP', points: ['OOP-1.6'], outcome: 'SE-11-02', marks: 1, format: 'mcq',
    media: code('python', `class Printer:
    def print_job(self, doc):
        return f"printing {doc.title}"

class Workstation:
    def __init__(self, printer):
        self.printer = printer
    def submit(self, doc):
        return self.printer.print_job(doc)`),
    stem: 'Which statement best describes the message passing taking place when `submit()` is called?',
    options: [
      'Workstation copies the Printer object’s attributes into its own before printing',
      'Workstation sends a message to the Printer object by invoking a method on its public interface, and the Printer decides how to respond',
      'The Printer class inherits from Workstation, so the call resolves through the superclass',
      'Both objects share a global variable that holds the document'
    ],
    answer: 1,
    why: 'Message passing in OOP means one object invokes a method on another object’s public interface, passing any arguments; the receiving object decides how to respond. Workstation never touches Printer’s internal data, which keeps the two loosely coupled. There is no inheritance or shared global state here.'
  });
  add({
    id: 'OOP-Q12', area: 'OOP', points: ['OOP-2.1'], outcome: 'SE-11-07', marks: 4, format: 'short',
    media: scen('A canteen needs a class that holds an order of items. It must add an item only if the menu has stock, total the order, and apply a 10% discount once the total exceeds $20.'),
    stem: 'Design and implement a class in an OOP language for this need. Your code must demonstrate branching, iteration and at least one function that returns a value.',
    criteria: [
      { t: 'Defines a class with a constructor and encapsulated item collection', kw: ['class', 'def __init__', 'constructor', 'self.', 'this.'] },
      { t: 'Demonstrates branching (if/else) for the stock check and/or discount threshold', kw: ['if ', 'else', 'elif'] },
      { t: 'Demonstrates iteration over the items to total the order', kw: ['for ', 'while ', 'sum(', 'loop'] },
      { t: 'Includes a function/method that returns a value', kw: ['return'] },
      { t: 'Applies the 10% discount correctly above the $20 threshold', kw: ['0.9', '0.1', '10%', '* .9', '20'] }
    ],
    sample: 'class Order:\n    DISCOUNT_THRESHOLD = 20.00\n    DISCOUNT_RATE = 0.10\n\n    def __init__(self, menu):\n        self.__menu = menu          # {name: {"price": float, "stock": int}}\n        self.__items = []\n\n    def add_item(self, name):\n        """Add an item if the menu holds stock. Returns True if added."""\n        if name not in self.__menu:          # branching: unknown item\n            raise ValueError(f"{name} is not on the menu")\n        if self.__menu[name]["stock"] <= 0:  # branching: stock check\n            return False\n        self.__menu[name]["stock"] -= 1\n        self.__items.append(name)\n        return True\n\n    def subtotal(self):\n        total = 0.0\n        for name in self.__items:            # iteration\n            total += self.__menu[name]["price"]\n        return total\n\n    def total(self):\n        """Return the order total, discounted 10% above the threshold."""\n        subtotal = self.subtotal()\n        if subtotal > Order.DISCOUNT_THRESHOLD:\n            return round(subtotal * (1 - Order.DISCOUNT_RATE), 2)\n        return round(subtotal, 2)\n\nThe class encapsulates both the menu and the item list as private attributes so stock can only change through add_item(). Branching appears in the unknown-item and stock checks and in the discount threshold, iteration appears in subtotal(), and total() is a function returning a value. Each method performs one logical task, which keeps the class easy to unit test: add_item() can be tested with an out-of-stock item, and total() can be tested at the boundary values 19.99, 20.00 and 20.01.'
  });

  /* ============================ MECHATRONICS =========================== */
  add({
    id: 'MEC-Q10', area: 'MEC', points: ['MEC-1.4'], outcome: 'SE-11-04', marks: 3, format: 'short',
    media: log(`[T+0012.4] SENSOR  encoder_l=1042 encoder_r=1039 drift=3
[T+0012.4] SENSOR  battery=11.42V temp_driver=58.1C
[T+0012.4] CYCLE   loop_time_ms=19.8 target=20.0 missed_deadlines=0
[T+0847.1] SENSOR  encoder_l=84102 encoder_r=83640 drift=462
[T+0847.1] SENSOR  battery=10.11V temp_driver=79.6C
[T+0847.1] CYCLE   loop_time_ms=26.3 target=20.0 missed_deadlines=71`),
    stem: 'Using the telemetry above, distinguish between diagnostic data and data used for optimisation in a mechatronic system, giving an example of each from the log and what it tells the engineer.',
    criteria: [
      { t: 'Defines diagnostic data as data used to detect and locate faults or unsafe conditions', kw: ['diagnostic', 'fault', 'detect', 'problem', 'error', 'health'] },
      { t: 'Gives a diagnostic example from the log (driver temperature, battery voltage, missed deadlines)', kw: ['temp', '79.6', 'battery', '10.11', 'missed deadline', 'voltage'] },
      { t: 'Gives an optimisation example and what it would be used to tune (encoder drift, loop time)', kw: ['drift', 'encoder', 'loop_time', 'loop time', 'calibrat', 'tune', 'optimis'] }
    ],
    sample: 'Diagnostic data is collected so that faults and unsafe conditions can be detected and located, usually by comparing a value against a threshold. In this log the driver temperature rising from 58.1 °C to 79.6 °C and the battery falling from 11.42 V to 10.11 V are diagnostic: together they indicate the motor driver is overheating as the battery sags under load, which risks thermal shutdown or damage, and they tell the engineer to check ventilation, current draw and battery capacity. The 71 missed deadlines are also diagnostic — the control loop is no longer meeting its 20 ms period, so the system’s real-time guarantee has failed. Optimisation data is collected to improve performance rather than to find a fault. The encoder drift growing from 3 to 462 counts shows the left and right wheels are travelling measurably different distances, which would be used to calibrate the wheel-diameter constants or tune the straight-line controller so the robot stops veering. Loop_time_ms is used both ways: as a diagnostic it shows deadlines are being missed, and as optimisation data the trend from 19.8 ms to 26.3 ms points to where the control code should be made more efficient.'
  });
  add({
    id: 'MEC-Q11', area: 'MEC', points: ['MEC-2.3', 'MEC-3.6'], outcome: 'SE-11-08', marks: 4, format: 'short',
    media: code('python', `# Line-following robot — current control algorithm
while True:
    if read_line_sensor() == "LEFT":
        turn_left(speed=60)
    elif read_line_sensor() == "RIGHT":
        turn_right(speed=60)
    else:
        drive_forward(speed=60)`),
    stem: 'Outline the features an algorithm requires for autonomous control, and explain two specific modifications that would enhance the performance of this mechatronic system.',
    criteria: [
      { t: 'Describes the continuous sense–decide–act loop running without human input', kw: ['sense', 'loop', 'continuous', 'without human', 'autonomous', 'repeat'] },
      { t: 'Identifies the need for fail-safe handling of lost line / sensor failure / watchdog', kw: ['fail-safe', 'fail safe', 'lost', 'stop', 'watchdog', 'timeout', 'error'] },
      { t: 'Modification 1 — read the sensor once per cycle instead of twice (consistency and efficiency)', kw: ['read', 'once', 'twice', 'two calls', 'same cycle', 'variable'] },
      { t: 'Modification 2 — proportional speed control rather than one fixed speed', kw: ['proportional', 'variable speed', 'slow', 'gradual', 'pid', 'magnitude'] }
    ],
    sample: 'An algorithm for autonomous control runs as a continuous sense–decide–act loop without human input: it reads its sensors, computes a decision from the current state, drives the actuators, then repeats at a predictable rate. It must also define a safe state for every condition it can encounter, including sensor failure — a fail-safe branch that stops the motors if the line is lost for more than a set number of cycles, plus a watchdog timer that halts the system if the loop stops running — and it should log diagnostic data so behaviour can be analysed afterwards. Modification 1: read_line_sensor() is called twice within one decision, so the robot can read LEFT in the first call and something else in the second and act on inconsistent information, as well as wasting time. The reading should be taken once into a variable at the top of the loop and all branches should test that variable, which makes the cycle both consistent and faster. Modification 2: every correction is applied at the same fixed speed of 60, so a tiny deviation is corrected as violently as a large one, making the robot oscillate across the line and slowing its overall progress. Using a proportional response — turning harder the further the sensor reports the robot is off-line, and driving forward faster when it is centred — produces smoother tracking and a higher average speed, and is the same proportional control principle used in a closed-loop controller.'
  });
  add({
    id: 'MEC-Q12', area: 'MEC', points: ['MEC-3.1', 'MEC-3.2', 'MEC-3.5'], outcome: 'SE-11-07', marks: 6, format: 'extended',
    media: dgm('sorterarch'),
    stem: 'Using Figure E3, explain how you would design, develop and produce this parcel sorter as an integrated mechatronic system. Refer to software control, mechanical engineering, and electronics and mathematics, and describe how programming code integrates the sensors, actuators and end effector.',
    criteria: [
      { t: 'Software control — the control loop, state machine and decision logic at a stated rate', kw: ['control loop', 'state machine', 'software', '50 hz', 'cycle', 'decision'] },
      { t: 'Mechanical engineering — conveyor, mounting, diverter geometry, parcel handling', kw: ['mechanical', 'conveyor', 'mount', 'geometry', 'belt', 'chute', 'frame'] },
      { t: 'Electronics — power supply, drivers, wiring, signal conditioning', kw: ['electronic', 'driver', 'power', 'wiring', 'circuit', 'voltage', 'pwm'] },
      { t: 'Mathematics — calibration, thresholds, timing/distance calculation', kw: ['calculat', 'calibrat', 'threshold', 'timing', 'distance', 'speed', 'mathematic'] },
      { t: 'Explains sensor input handling (debouncing, ADC conversion, validation)', kw: ['debounc', 'adc', 'analogue', 'analog', 'convert', 'validat', 'filter'] },
      { t: 'Explains actuator and end effector integration (sequencing, timing the diverter to the parcel)', kw: ['sequence', 'timing', 'servo', 'diverter', 'trigger', 'synchronis'] }
    ],
    sample: 'Software control is the integrating layer. The microcontroller runs a fixed 50 Hz control loop implemented as a state machine with the states IDLE, PARCEL_DETECTED, WEIGHING, SCANNING, DIVERTING and FAULT. Each cycle it reads all three sensors, updates the state, and writes to the actuators, so behaviour is deterministic and every deadline is met. Mechanical engineering determines the physical arrangement: belt width and speed, the rigid frame and sensor mounts that keep the IR beam and camera aligned, the load cell mounted so only the parcel’s mass acts on it, and the diverter arm’s length and pivot geometry so its sweep clears a parcel into the chute without jamming. Electronics covers the separate supply rails for logic and motors from the 11.1 V battery, a motor driver for the conveyor switched by PWM, a servo driver for the diverter, a common ground, flyback protection and conditioning for the load cell’s small analogue signal before it reaches the ADC. Mathematics ties the two together: calibrating the load cell’s raw ADC counts to grams with a linear two-point calibration, setting the mass thresholds that select a destination, and calculating the travel time from the sensor position to the diverter as distance ÷ belt speed so the arm fires at the right moment.\n\nThe programming code integrates the components through that loop. Sensor inputs are never trusted raw: the IR beam is debounced over several consecutive cycles so a flicker does not register as a parcel, the load cell’s ADC reading is converted to grams and passed through a moving-average filter to remove noise, and the camera’s label scan is validated against an expected format with a retry and a FAULT state if it fails. Actuator output is sequenced from the state machine: on a debounced detection the conveyor continues at a constant PWM duty cycle, a timer starts, and when the calculated travel time elapses the servo is commanded to the angle for the parcel’s destination, held for a fixed dwell, then returned to centre. The diverter arm as the end effector is the only component that touches the parcel, so its command is both clamped to a safe angular range and interlocked — it will not actuate unless the mass reading and label scan both completed successfully in that cycle. Each subsystem is unit tested in isolation with simulated inputs before integration, then the whole system is tested end to end with parcels of known mass at the boundaries of each threshold.'
  });
  add({
    id: 'MEC-Q13', area: 'MEC', points: ['MEC-3.8'], outcome: 'SE-11-08', marks: 3, format: 'short',
    stem: 'Explain why unit tests for a mechatronic control algorithm must establish repeatability as well as effectiveness, and describe how such a test would be constructed.',
    criteria: [
      { t: 'Effectiveness = produces the correct output for a given input; repeatability = the same input always produces the same output', kw: ['effective', 'repeatab', 'same input', 'same output', 'consistent'] },
      { t: 'Explains why repeatability matters in a mechatronic context (noise, timing, physical variation, safety)', kw: ['noise', 'timing', 'random', 'varies', 'safety', 'intermittent', 'physical'] },
      { t: 'Describes constructing the test — isolate the algorithm, feed known/simulated inputs, assert expected output, run repeatedly', kw: ['isolat', 'simulat', 'known input', 'expected', 'repeat', 'assert', 'loop'] }
    ],
    sample: 'Effectiveness means the control algorithm produces the correct actuator output for a given sensor input — for example that a measured temperature of 18 °C against a 22 °C setpoint produces 16% heater power. Repeatability means that the same input always produces that same output, every time it is run. Both are required because a mechatronic system runs the same algorithm thousands of times against noisy real-world input: an algorithm that depends on uninitialised state, on a random value, on how long the previous cycle took, or on a floating-point accumulation that drifts can produce the correct result once during testing and a different result later in the field. That is far more dangerous than a consistent failure, because it is intermittent and will not reproduce when investigated, and in a system driving physical actuators an unpredictable output is a safety risk. The test is constructed by isolating the control function from the hardware — it must take sensor values as parameters and return the actuator command, rather than reading and writing hardware directly — then calling it with a table of known inputs and their expected outputs, including boundary values such as the edges of the dead band, and asserting each result. The same call is then repeated in a loop and the set of returned values checked to contain exactly one distinct value, which proves repeatability. Simulating the sensor input this way also allows dangerous cases, such as an out-of-range or failed sensor, to be tested safely before the code reaches the hardware.'
  });

  /* ===================== SECURE SOFTWARE ARCHITECTURE ================== */
  add({
    id: 'SSA-Q13', area: 'SSA', points: ['SSA-1.1', 'SSA-2.2'], outcome: 'SE-12-04', marks: 4, format: 'short',
    media: scen('A start-up is deciding whether to spend four of its sixteen development weeks on security work before launching a health-tracking app that stores users’ names, dates of birth and daily health metrics.'),
    stem: 'Describe the benefits of developing secure software, and identify the security features this app should incorporate.',
    criteria: [
      { t: 'Data protection benefit — personal and health data stays confidential', kw: ['data protection', 'confidential', 'personal', 'protect'] },
      { t: 'Minimising cyber attacks and vulnerabilities — fewer exploitable defects, lower remediation cost, reputation preserved', kw: ['attack', 'vulnerab', 'breach', 'cost', 'reputation', 'trust'] },
      { t: 'Names concrete security features (encryption, hashing, access control, MFA, logging)', kw: ['encrypt', 'hash', 'access control', 'mfa', 'authentic', 'log'] },
      { t: 'Addresses privacy and regulatory compliance for health data', kw: ['privacy', 'complian', 'regulat', 'privacy act', 'consent', 'law', 'health record'] }
    ],
    sample: 'The two benefits the syllabus names are directly at stake here. Data protection: names, dates of birth and daily health metrics are sensitive personal information, and health data is among the most damaging categories to lose because it cannot be reissued like a password and can affect insurance, employment and relationships; building security in keeps that data confidential and intact. Minimising cyber attacks and vulnerabilities: defects found and removed during development cost a fraction of what they cost after release, when the price includes incident response, notification, regulatory investigation, remediation under time pressure and the loss of user trust that a health app depends on entirely. The four weeks are therefore better understood as insurance bought at the cheapest possible point than as time taken from features. The app should incorporate encryption of data in transit with TLS and at rest in the database, passwords hashed with a salted, slow algorithm such as bcrypt, authentication strengthened with multi-factor for account recovery, role-based access control so that support staff cannot read health metrics, secure session management, and audit logging so access to records is attributable. On privacy and regulatory compliance, the app is handling health information under the Privacy Act 1988 (Cth) and the Australian Privacy Principles, which impose stricter obligations on sensitive information: it needs explicit informed consent for collection, collection limited to what the features actually require, a defined retention and deletion policy, the ability for a user to access and correct their own record, and an incident response plan that meets the Notifiable Data Breaches scheme.'
  });
  add({
    id: 'SSA-Q14', area: 'SSA', points: ['SSA-1.3'], outcome: 'SE-12-07', marks: 4, format: 'short',
    media: scen('A council is building one portal used by three groups: residents over 70 claiming a rates rebate, council staff processing claims, and an external auditor with read-only access.'),
    stem: 'Describe how the capabilities and experience of these end users should influence the secure design features of the portal.',
    criteria: [
      { t: 'Novice/older users need safe defaults, plain-language errors and accessible recovery rather than complex security steps', kw: ['default', 'plain', 'simple', 'recovery', 'accessib', 'older', 'novice', 'clear'] },
      { t: 'Notes that security which is hard to use gets bypassed or excludes people', kw: ['bypass', 'written down', 'abandon', 'exclude', 'give up', 'workaround'] },
      { t: 'Experienced staff users — stronger controls, least privilege, session timeouts, audit logging', kw: ['staff', 'least privilege', 'timeout', 'audit', 'role', 'mfa'] },
      { t: 'Auditor — read-only authorisation enforced server-side, accountability', kw: ['read-only', 'read only', 'auditor', 'authoris', 'authoriz', 'cannot change', 'accountab'] }
    ],
    sample: 'The three groups have different capabilities, so a single security design would fail at least two of them. Residents over 70 are likely to be occasional, non-technical users, so the portal needs the most secure configuration as the default rather than as an option they must find, plain-language error messages that say what to do next without leaking system detail, generous session timeouts with a clear warning before expiry, and an account recovery path that does not assume a smartphone — SMS-only multi-factor excludes users without a mobile, and CAPTCHA excludes users with low vision. This matters because security that is hard to use is not security: if the password rules are punishing, users write credentials down or abandon the claim entirely, which converts a security control into both a vulnerability and a barrier to a service they are entitled to. Council staff are frequent expert users handling many residents’ data, so stronger controls are appropriate and workable: mandatory multi-factor authentication, role-based access under least privilege so a processing officer sees only the claims assigned to them, short inactivity timeouts because the terminal sits in a shared office, and full audit logging of every record viewed and changed. The external auditor must be authorised as strictly read-only, enforced server-side on every endpoint rather than by hiding buttons in the interface, with their access scoped to the period under audit, time-limited, and logged for accountability — the same data, a different trust level, and therefore a different set of controls.'
  });
  add({
    id: 'SSA-Q15', area: 'SSA', points: ['SSA-2.3'], outcome: 'SE-12-06', marks: 4, format: 'short',
    stem: 'Use and explain the contribution of cryptography and sandboxing to the ‘security by design’ approach in the development of software solutions.',
    criteria: [
      { t: 'Explains security by design — security built in from the start, not added afterwards', kw: ['by design', 'from the start', 'built in', 'not added', 'afterthought', 'foundation'] },
      { t: 'Cryptography — encryption in transit and at rest, hashing for integrity and passwords, signatures', kw: ['encrypt', 'at rest', 'in transit', 'hash', 'signature', 'key'] },
      { t: 'Sandboxing — isolating code so it cannot reach the file system, memory or network of the host', kw: ['sandbox', 'isolat', 'restrict', 'contain', 'permission', 'separate'] },
      { t: 'Gives a real example of sandboxing (browser tab, mobile app permissions, container, VM, this app’s code runner)', kw: ['browser', 'tab', 'mobile app', 'container', 'virtual machine', 'vm', 'iframe', 'webassembly', 'plugin'] }
    ],
    sample: 'Security by design means the system is architected to be secure from the first design decision, rather than having controls bolted on after the functionality works — the assumption being that any component may be attacked and that defences must be structural, because retrofitted security is both weaker and more expensive. Cryptography contributes the confidentiality and integrity guarantees that design relies on. Data is encrypted in transit with TLS so it cannot be read or altered on the network, and encrypted at rest so that stealing the database or a backup tape yields ciphertext rather than records. Passwords are not stored at all but kept as salted hashes, so a breach does not hand over credentials, and hash values and digital signatures let the system verify that data, updates and messages have not been tampered with and did come from who they claim. Designing this in from the start matters because deciding where keys live, which fields are encrypted and how they are rotated is an architectural decision that is very difficult to change later. Sandboxing contributes containment: code runs in an isolated environment with explicitly restricted access to the file system, memory, network and other processes, so that if a component is compromised or simply untrustworthy, the damage cannot spread to the host. It is the structural expression of least privilege, and it assumes compromise will happen rather than hoping it will not. Real examples are everywhere: each browser tab runs in its own sandboxed process so a malicious page cannot read another site’s data, mobile apps run under a permission model that denies access to the camera or contacts unless granted, and server workloads are isolated in containers or virtual machines. This study app is itself an example — learner code runs in an opaque-origin iframe or a WebAssembly worker with no access to the page’s data, which is why running untrusted code in it is safe.'
  });

  /* ===================== PROGRAMMING FOR THE WEB ======================= */
  add({
    id: 'WEB-Q15', area: 'WEB', points: ['WEB-2.3'], outcome: 'SE-12-06', marks: 3, format: 'short',
    stem: 'Explain the influence of the web browser on web development, and describe how developer tools are used to diagnose three different kinds of problem.',
    criteria: [
      { t: 'Browsers differ in rendering engine and feature support, forcing cross-browser testing / feature detection / progressive enhancement', kw: ['engine', 'differ', 'cross-browser', 'compatib', 'feature detection', 'progressive enhancement', 'support'] },
      { t: 'Layout or styling problems diagnosed with the element inspector / computed styles', kw: ['inspector', 'element', 'computed', 'css panel', 'layout'] },
      { t: 'Two further dev tool uses — console for JS errors, network panel for requests/timing, performance, application storage', kw: ['console', 'network', 'performance', 'storage', 'lighthouse', 'device'] }
    ],
    sample: 'The browser is the runtime for all front-end code, and because several independent rendering engines exist — Blink in Chrome and Edge, Gecko in Firefox, WebKit in Safari — the same HTML, CSS and JavaScript can behave differently in each. Developers therefore cannot target one browser: they must test across browsers and devices, use feature detection rather than assuming support, and apply progressive enhancement so that core functionality works even where a newer API is unavailable. The browser also enforces the security model the application lives inside, including the same-origin policy, CORS and secure-context restrictions. Developer tools make the browser diagnosable. A layout or styling problem is investigated with the element inspector, which shows the live DOM, the cascade of CSS rules applying to an element, which rules were overridden, and the computed box model — this is how you find that a margin collapse or a stale specificity rule is breaking a layout. A JavaScript fault is investigated with the console, which reports uncaught errors with the file and line number, and with the debugger, where a breakpoint and a watch on a variable show the actual values at the moment of failure. A performance or data problem is investigated with the network panel, which lists every request with its status code, size and timing waterfall — revealing, for example, a 4.7 MB image or a request returning 404 — while the application panel inspects cookies, local storage and service worker caches, and device emulation checks responsive behaviour at phone widths.'
  });
  add({
    id: 'WEB-Q16', area: 'WEB', points: ['WEB-2.5'], outcome: 'SE-12-09', marks: 1, format: 'mcq',
    media: log(`$ git log --oneline
a91c3f2 (HEAD -> main, tag: v2.4.1) Fix cart total rounding on discounted items
7d204bb Add discount codes to checkout
0f8c51e Merge pull request #142 from team/feature/checkout-redesign
...
$ git revert a91c3f2 --no-edit
$ git bisect start v2.4.1 v2.3.0`),
    stem: 'Which reason for using version control in web application development is being demonstrated by the final two commands?',
    options: [
      'Reducing the file size of the deployed application',
      'Reverting a faulty change and locating the commit that introduced a defect',
      'Automatically testing the application in multiple browsers',
      'Encrypting the source code so it cannot be read by others'
    ],
    answer: 1,
    why: 'git revert undoes a specific change by creating a new commit, and git bisect performs a binary search across the history between two versions to find the commit that introduced a defect. Both depend on version control keeping a complete, attributable history — which also supports branching, parallel work and tagged releases. Version control does not minify, test or encrypt code.'
  });
  add({
    id: 'WEB-Q17', area: 'WEB', points: ['WEB-2.11'], outcome: 'SE-12-03', marks: 4, format: 'short',
    media: dgm('webstack'),
    stem: 'Observe and describe the back-end process used to manage a web request for a page listing a user’s orders. Refer to the role of webserver software, the web framework, objects, libraries and databases.',
    criteria: [
      { t: 'Webserver software receives the HTTP request, serves static assets and passes dynamic routes on', kw: ['webserver', 'web server', 'nginx', 'apache', 'static', 'receives', 'passes'] },
      { t: 'Web framework routes the request to the correct controller/handler', kw: ['framework', 'rout', 'controller', 'handler', 'endpoint', 'django', 'express'] },
      { t: 'Objects model the entities and libraries provide shared functions (auth, validation, templating)', kw: ['object', 'model', 'librar', 'template', 'authentic', 'validat'] },
      { t: 'Database queried and the response rendered and returned with a status code', kw: ['database', 'quer', 'sql', 'render', 'json', 'status code', '200', 'response'] }
    ],
    sample: 'The browser opens a TCP and TLS connection and sends GET /orders. The webserver software — nginx or Apache — accepts that connection, terminates TLS, and decides what the request is: if it names a static asset such as a stylesheet or image it is served straight from disk, and if it is a dynamic route it is passed to the application process, along with handling concurrency, compression and logging. The web framework then takes over: it matches /orders against its routing table and dispatches to the corresponding controller or view function, having first run the request through middleware that parses cookies, restores the session and confirms the user is authenticated. Inside the controller, objects model the domain — an Order class and a User class whose instances represent rows and carry the behaviour that belongs to them — while libraries supply the shared functions nobody should write twice: authentication and password hashing, input validation, date formatting and the template engine. The controller queries the database for that user’s orders, and critically it filters by the authenticated user’s id rather than by anything supplied in the request, so one user cannot read another’s orders; an ORM typically generates this SQL and returns the rows as objects. The returned result set is passed to a template that renders HTML, or serialised to JSON if the front end is a single-page application, and the response is sent back through the webserver with an appropriate status code — 200 for success, 404 if nothing matched, 500 if the query failed — after which the connection is kept alive or closed.'
  });

  /* ======================== SOFTWARE AUTOMATION ======================== */
  add({
    id: 'AUT-Q11', area: 'AUT', points: ['AUT-1.4'], outcome: 'SE-12-03', marks: 1, format: 'mcq',
    stem: 'A supermarket chain uses a model trained on five years of sales, weather and public holiday data to decide how much fresh produce to order for each store next week. Which common application of machine learning is this?',
    options: [
      'Image recognition',
      'Data analysis and forecasting',
      'A virtual personal assistant',
      'Reinforcement learning of a game strategy'
    ],
    answer: 1,
    why: 'Predicting a future numeric quantity from historical and contextual data is data analysis and forecasting — typically regression or time-series models. Image recognition classifies visual input, and a virtual personal assistant combines speech recognition with natural language understanding.'
  });
  add({
    id: 'AUT-Q12', area: 'AUT', points: ['AUT-2.2'], outcome: 'SE-12-02', marks: 4, format: 'short',
    media: code('python', `class Neuron:
    def __init__(self, n_inputs):
        self.w = [random.uniform(-1, 1) for _ in range(n_inputs)]
        self.b = random.uniform(-1, 1)

    @staticmethod
    def sigmoid(z):
        return 1 / (1 + math.exp(-z))

    def forward(self, inputs):
        z = sum(w * x for w, x in zip(self.w, inputs)) + self.b
        return self.sigmoid(z)

net = Neuron(2)
print(net.forward([1, 1]))       # 0.731...
# after training on AND: [0,0]->0.02  [0,1]->0.04  [1,0]->0.04  [1,1]->0.94`),
    stem: 'Explain how this OOP implementation applies a neural network model to make a prediction, including the purpose of the weights, the bias and the activation function, and how the untrained output of 0.731 becomes 0.94.',
    criteria: [
      { t: 'Weights scale each input by its learned importance and are summed', kw: ['weight', 'multipl', 'importance', 'sum', 'scale'] },
      { t: 'Bias shifts the weighted sum, allowing the decision threshold to move independently of the inputs', kw: ['bias', 'shift', 'offset', 'threshold', 'independ'] },
      { t: 'Activation function (sigmoid) maps the result to a 0–1 probability and introduces non-linearity', kw: ['sigmoid', 'activation', '0 and 1', '0-1', 'probabilit', 'non-linear', 'nonlinear'] },
      { t: 'Training adjusts weights and bias to reduce error (backpropagation / gradient descent) over many epochs', kw: ['train', 'error', 'adjust', 'backpropagat', 'gradient', 'epoch', 'learn'] }
    ],
    sample: 'The object holds the model’s learned state: a list of weights, one per input, and a single bias, both initialised randomly in the constructor. To make a prediction, forward() multiplies each input by its corresponding weight and sums the products — the weights scale each input by how important that feature has been found to be, so a large positive weight makes an input push strongly toward an output of 1 and a negative weight pushes toward 0. The bias is then added. Its purpose is to shift the weighted sum up or down independently of the inputs, which moves the decision threshold: without a bias the neuron is forced to output 0.5 whenever every input is zero, and could not learn a function such as AND that must output 0 for the input [0,0]. The result z is passed through the sigmoid activation function, 1/(1+e^−z), which squashes any real number into the range 0 to 1 so the output can be read as a probability or confidence, and which introduces the non-linearity that allows networks of these units to model relationships a straight line cannot. The untrained output of 0.731 is meaningless — it is simply the consequence of random weights. Training changes that: for each training example the network computes its prediction, measures the error against the known target, and uses backpropagation to determine how much each weight and the bias contributed to that error, then gradient descent nudges every parameter a small step (scaled by the learning rate) in the direction that reduces it. Repeated over thousands of epochs across all four AND examples, the weights grow positive and the bias becomes strongly negative, so only when both inputs are 1 does z become positive enough for the sigmoid to return 0.94, while every other combination returns close to 0.'
  });

  /* ===================== SOFTWARE ENGINEERING PROJECT ================== */
  add({
    id: 'SEP-Q15', area: 'SEP', points: ['SEP-2.8', 'SEP-3.3'], outcome: 'SE-12-06', marks: 4, format: 'short',
    media: scen('A project portfolio contains only finished source code and a paragraph describing what the program does. The marker cannot tell how the solution was designed.'),
    stem: 'Demonstrate the use of modelling tools by identifying which models this project should contain, and explain why documented algorithms are required in addition to the source code.',
    criteria: [
      { t: 'Names appropriate models with their purpose (class diagram, data flow diagram, structure chart, storyboard, use case)', kw: ['class diagram', 'data flow', 'dfd', 'structure chart', 'storyboard', 'use case', 'sequence'] },
      { t: 'Explains that models communicate design at a level of abstraction source code cannot', kw: ['abstraction', 'overview', 'whole', 'communicat', 'before', 'relationship', 'structure'] },
      { t: 'Explains documented algorithms (pseudocode/flowchart) as language-independent design evidence', kw: ['pseudocode', 'flowchart', 'language-independent', 'language independent', 'design', 'evidence', 'logic'] },
      { t: 'Links documentation to maintenance, marking or team communication', kw: ['maintain', 'marker', 'team', 'another developer', 'assess', 'future'] }
    ],
    sample: 'The portfolio should contain a set of models chosen for what each one shows. A class diagram documents the structure of the solution — the classes, their attributes and methods, and the inheritance and association relationships between them — which is the single most useful artefact for an OOP project. A data flow diagram shows what data moves between the external entities, processes and data stores, which the class diagram does not. A structure chart documents the module hierarchy and the parameters crossing each interface. Storyboards and a use case diagram capture the user’s journey and the scope of what the system does for whom, and a sequence diagram is worth adding for any non-trivial interaction such as placing an order. These are needed because source code shows the solution at one level of abstraction only: it is complete but it is also the least readable view, and a reader cannot recover the overall architecture or the designer’s intent by reading several thousand lines of it. A model communicates the whole system at a glance and, more importantly, existed before the code did — it is the evidence that the solution was designed rather than improvised. Documented algorithms serve the same purpose at the subprogram level. Pseudocode and flowcharts express the logic in a language-independent form, which separates the decisions that matter — the order of operations, the conditions, the handling of boundaries — from the syntax of the implementation language, and they are what a desk check is performed against. For the marker, they are direct evidence of how each non-trivial routine was reasoned through; for a team, they allow a subprogram to be reviewed or reimplemented by someone who does not know the language; and for future maintenance, they explain intent long after the author has forgotten it. Without them the only record of the design is the code, and the code only states what the program does, never why.'
  });
  add({
    id: 'SEP-Q16', area: 'SEP', points: ['SEP-3.1', 'SEP-3.4'], outcome: 'SE-12-01', marks: 5, format: 'extended',
    media: scen('A student has 14 school weeks to build their major project: a progressive web app for a local sports club with a results database, an admin interface and a public results page. They have access to a laptop, free hosting, two hours of class time and roughly three hours at home per week, and the club secretary is available for feedback once a fortnight.'),
    stem: 'Describe how you would design, construct and implement this solution using an appropriate development approach, and explain how you would allocate the available resources.',
    criteria: [
      { t: 'Selects and justifies a development approach suited to the scale, timeframe and fortnightly client access', kw: ['agile', 'wagile', 'waterfall', 'iterat', 'sprint', 'approach', 'justif'] },
      { t: 'Sequences design → construct → implement with concrete stages and deliverables', kw: ['design', 'construct', 'implement', 'stage', 'first', 'then', 'prototype', 'milestone'] },
      { t: 'Allocates time resources explicitly against the 14 weeks / 5 hours per week', kw: ['week', 'hour', 'time', 'schedule', 'gantt', 'allocat'] },
      { t: 'Allocates non-time resources — hosting, hardware, libraries, the client’s availability', kw: ['hosting', 'laptop', 'librar', 'framework', 'client', 'secretary', 'tool', 'budget'] },
      { t: 'Includes risk management — contingency, cutting scope, the critical path', kw: ['risk', 'contingency', 'buffer', 'scope', 'critical path', 'fallback', 'priorit'] }
    ],
    sample: 'Approach: a tailored Agile process in fortnightly iterations, which matches both the scale of the project and the single genuinely fixed constraint — the secretary is available every two weeks, so the iteration length should be set to that cadence rather than chosen arbitrarily. Each iteration ends with something demonstrable, feedback is collected while there is still time to act on it, and the backlog is re-prioritised. Pure Waterfall would be wrong here because the admin interface cannot be correctly specified before the secretary has used something, and a design frozen in week 2 would be tested in week 12 when nothing could be changed. One Waterfall element is kept, making this closer to WAgile: requirements, the data dictionary and the database schema are defined and signed off up front, because reworking a schema mid-project is far more expensive than reworking a screen.\n\nDesign, construct, implement: weeks 1–2 establish the need with evidence from the club, define functional and performance requirements with boundaries, and produce the data dictionary, class diagram and storyboards. Weeks 3–4 construct a walking skeleton — the database, one results record end to end, and version control and deployment working — so that the riskiest integration work is proven early rather than discovered late. Weeks 5–10 build the three subsystems in priority order across three iterations: the public results page first because it delivers the most value to the club, then the admin interface, then PWA features (service worker, manifest, offline cache). Weeks 11–12 integrate, harden and run user testing with real club members. Weeks 13–14 implement into live use with a pilot — the secretary runs one round of results through the new app in parallel with the existing spreadsheet, so there is a fallback — then complete the evaluation and portfolio.\n\nResource allocation: the five hours a week give roughly 70 hours in total, and they should not all be allocated. Class time is best used for work that benefits from the teacher being present (design review, debugging, testing), home time for focused construction. I would plan to about 55 hours of scheduled work and hold the rest as buffer, because every student project overruns. Non-time resources: free static hosting with HTTPS for the PWA, a managed database on a free tier, the laptop as the development machine with the repository on GitHub as both version control and off-device backup, and established open-source libraries for anything security-related rather than writing authentication myself — the licence of each is recorded in the portfolio. The scarcest resource is the secretary’s attention: her fortnightly slot is reserved for reviewing working software and resolving decisions, not status updates, and a list of questions is prepared before each meeting.\n\nRisk: the critical path runs through the database schema and the admin interface, so any slippage there delays everything downstream and is reviewed every iteration. The identified risks are the PWA offline features being harder than expected, and the club providing real data late. Both are mitigated by priority order — the public results page and admin interface are must-have, offline support and push notifications are explicitly nice-to-have and will be cut first if week 10 arrives with work outstanding. Cutting scope against a fixed deadline is a planned decision made with the client, not an emergency.'
  });

})(window.APP = window.APP || {});
