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
    sample: 'The permanent log should be a sequential file, because readings are only appended in time order and read start-to-end for nightly batch processing, and a file persists beyond execution. The ten most recent readings suit a fixed-size array of 10 used as a circular buffer, since the size is known and indexed access allows the rolling average to be calculated. The station details should be a record, because name, latitude, longitude and installation date are fields of different types that belong together as one unit and can be passed as a single parameter, which an array could not do.'
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
    stem: 'Both versions produce the same mean for valid input. Test and evaluate these solutions against functionality, performance, readability of code and quality of documentation, and state which you would accept into a shared codebase.',
    criteria: [
      { t: 'Functionality — B handles the empty-list case, A raises an unhandled ZeroDivisionError', kw: ['empty', 'zerodivision', 'divide by zero', 'crash', 'functional'] },
      { t: 'Performance — addressed honestly (equivalent; both O(n), no meaningful difference)', kw: ['performance', 'o(n', 'same', 'equivalent', 'negligible', 'linear'] },
      { t: 'Readability of code — B uses meaningful identifiers, spacing and a clear single task', kw: ['readab', 'identifier', 'name', 'meaningful', 'clear'] },
      { t: 'Quality of documentation — B has a docstring stating the contract, A has none', kw: ['document', 'docstring', 'comment', 'contract'] },
      { t: 'Reaches a judgement and justifies it', kw: ['accept', 'version b', 'recommend', 'choose', 'therefore'] }
    ],
    sample: 'Functionality separates them: with an empty list Version A evaluates 0/0 and raises an unhandled ZeroDivisionError, whereas B validates first and raises a ValueError the caller can catch. Performance is equivalent — both are O(n), so this is no reason to prefer either. Readability of code strongly favours B, which uses meaningful identifiers and one clear task, while A crams single-character names onto one line. For quality of documentation, B has a docstring stating its input, return and exception; A has none. I would therefore accept Version B, because it is equal on performance and better on every other aspect, and an empty result set is a normal occurrence rather than an exotic one.'
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
    sample: 'class Order:\n    def __init__(self, menu):\n        self.__menu = menu\n        self.__items = []\n\n    def add_item(self, name):\n        if self.__menu[name][\'stock\'] <= 0:\n            return False\n        self.__menu[name][\'stock\'] -= 1\n        self.__items.append(name)\n        return True\n\n    def total(self):\n        subtotal = 0.0\n        for name in self.__items:\n            subtotal += self.__menu[name][\'price\']\n        if subtotal > 20:\n            return round(subtotal * 0.9, 2)\n        return round(subtotal, 2)\n\nThe items are private, so stock can only change through add_item(). Branching appears in the stock check and the discount threshold, iteration in total(), and both methods return a value.'
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
    sample: 'Diagnostic data detects and locates faults by comparing a value against a threshold: the driver temperature rising to 79.6 °C, the battery sagging to 10.11 V and 71 missed deadlines together show the driver overheating and the loop missing its 20 ms period. Optimisation data, by contrast, improves performance rather than finding a fault — the encoder drift growing from 3 to 462 counts shows the wheels travelling different distances, which is used to calibrate the wheel-diameter constants.'
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
    sample: 'An autonomous algorithm runs a continuous sense-decide-act loop without human input at a predictable rate, and must define a safe state for every condition, including a fail-safe that stops the motors if the line is lost and a watchdog timer. Two modifications would improve this system. First, read_line_sensor() is called twice in one decision, so the robot can act on two inconsistent readings; the value should be read once into a variable at the top of the loop. Second, every correction uses the same fixed speed of 60, so a tiny deviation is corrected as violently as a large one and the robot oscillates; proportional speed, turning harder the further off-line it is, gives smoother tracking and a higher average speed.'
  });
  add({
    id: 'MEC-Q12', area: 'MEC', points: ['MEC-3.1', 'MEC-3.2', 'MEC-3.5'], outcome: 'SE-11-07', marks: 6, format: 'extended',
    media: dgm('sorterarch'),
    stem: 'Using Figure E3, analyse how this parcel sorter would be designed, developed and produced as an integrated mechatronic system, referring to software control, mechanical engineering, and electronics and mathematics. Explain how the programming code integrates the sensors, actuators and the end effector.',
    criteria: [
      { t: 'Software control — the control loop, state machine and decision logic at a stated rate', kw: ['control loop', 'state machine', 'software', '50 hz', 'cycle', 'decision'] },
      { t: 'Mechanical engineering — conveyor, mounting, diverter geometry, parcel handling', kw: ['mechanical', 'conveyor', 'mount', 'geometry', 'belt', 'chute', 'frame'] },
      { t: 'Electronics — power supply, drivers, wiring, signal conditioning', kw: ['electronic', 'driver', 'power', 'wiring', 'circuit', 'voltage', 'pwm'] },
      { t: 'Mathematics — calibration, thresholds, timing/distance calculation', kw: ['calculat', 'calibrat', 'threshold', 'timing', 'distance', 'speed', 'mathematic'] },
      { t: 'Explains sensor input handling (debouncing, ADC conversion, validation)', kw: ['debounc', 'adc', 'analogue', 'analog', 'convert', 'validat', 'filter'] },
      { t: 'Explains actuator and end effector integration (sequencing, timing the diverter to the parcel)', kw: ['sequence', 'timing', 'servo', 'diverter', 'trigger', 'synchronis'] }
    ],
    sample: 'Software control integrates the system: the microcontroller runs a 50 Hz control loop as a state machine with IDLE, WEIGHING, SCANNING and DIVERTING states, so behaviour is deterministic and every deadline is met. Mechanical engineering fixes the belt speed, the rigid frame and sensor mounts that keep the beam aligned, and the diverter geometry so a parcel clears into the chute without jamming. Electronics provides separate supply rails for logic and motors, a driver switched by PWM, a common ground and conditioning for the load cell. Mathematics calibrates ADC counts to grams and calculates the travel time as distance ÷ belt speed, which sets the threshold for firing the arm. In code, the IR beam is debounced over several cycles and the ADC reading is filtered before use, because a raw reading cannot be trusted. The sequence then times the diverter servo to the parcel\'s arrival, and the end effector is interlocked so it cannot actuate unless the mass and label both validated.'
  });
  add({
    id: 'MEC-Q13', area: 'MEC', points: ['MEC-3.8'], outcome: 'SE-11-08', marks: 3, format: 'short',
    stem: 'Explain why unit tests for a mechatronic control algorithm must establish repeatability as well as effectiveness, and describe how such a test would be constructed.',
    criteria: [
      { t: 'Effectiveness = produces the correct output for a given input; repeatability = the same input always produces the same output', kw: ['effective', 'repeatab', 'same input', 'same output', 'consistent'] },
      { t: 'Explains why repeatability matters in a mechatronic context (noise, timing, physical variation, safety)', kw: ['noise', 'timing', 'random', 'varies', 'safety', 'intermittent', 'physical'] },
      { t: 'Describes constructing the test — isolate the algorithm, feed known/simulated inputs, assert expected output, run repeatedly', kw: ['isolat', 'simulat', 'known input', 'expected', 'repeat', 'assert', 'loop'] }
    ],
    sample: 'Effectiveness means the algorithm returns the correct output for a given input; repeatability means the same input always returns the same output. Repeatability matters because sensor noise and timing variation can make a faulty algorithm appear correct once, and an intermittent fault in a system driving actuators is a safety risk that will not reproduce when investigated. The test isolates the control function from the hardware, feeds known simulated inputs, asserts the expected outputs, then repeats each call to confirm a single distinct result.'
  });

  /* ===================== SECURE SOFTWARE ARCHITECTURE ================== */
  add({
    id: 'SSA-Q13', area: 'SSA', points: ['SSA-1.1', 'SSA-2.2'], outcome: 'SE-12-04', marks: 3, format: 'short',
    media: scen('A start-up is deciding whether to spend four of its sixteen development weeks on security work before launching a health-tracking app that stores users’ names, dates of birth and daily health metrics.'),
    stem: 'Describe the benefits of developing secure software, and identify the security features this health-tracking app should incorporate.',
    criteria: [
      { t: 'Data protection benefit — personal and health data stays confidential', kw: ['data protection', 'confidential', 'personal', 'protect'] },
      { t: 'Minimising cyber attacks and vulnerabilities — fewer exploitable defects, lower remediation cost, reputation preserved', kw: ['attack', 'vulnerab', 'breach', 'cost', 'reputation', 'trust'] },
      { t: 'Names concrete security features (encryption, hashing, access control, MFA, logging)', kw: ['encrypt', 'hash', 'access control', 'mfa', 'authentic', 'log'] },
      { t: 'Addresses privacy and regulatory compliance for health data', kw: ['privacy', 'complian', 'regulat', 'privacy act', 'consent', 'law', 'health record'] }
    ],
    sample: 'Secure development protects personal health data and keeps it confidential, and it minimises exploitable vulnerabilities, so there are fewer attacks and far lower remediation and reputation costs later. The app should encrypt data in transit and at rest, hash passwords with a salt, enforce role-based access control and multi-factor authentication, and log access to records. It must also meet privacy and regulatory compliance obligations under the Privacy Act, which treats health information as sensitive.'
  });
  add({
    id: 'SSA-Q14', area: 'SSA', points: ['SSA-1.3'], outcome: 'SE-12-07', marks: 3, format: 'short',
    media: scen('A council is building one portal used by three groups: residents over 70 claiming a rates rebate, council staff processing claims, and an external auditor with read-only access.'),
    stem: 'Describe how the capabilities and experience of these end users should influence the secure design features of the portal.',
    criteria: [
      { t: 'Novice/older users need safe defaults, plain-language errors and accessible recovery rather than complex security steps', kw: ['default', 'plain', 'simple', 'recovery', 'accessib', 'older', 'novice', 'clear'] },
      { t: 'Notes that security which is hard to use gets bypassed or excludes people', kw: ['bypass', 'written down', 'abandon', 'exclude', 'give up', 'workaround'] },
      { t: 'Experienced staff users — stronger controls, least privilege, session timeouts, audit logging', kw: ['staff', 'least privilege', 'timeout', 'audit', 'role', 'mfa'] },
      { t: 'Auditor — read-only authorisation enforced server-side, accountability', kw: ['read-only', 'read only', 'auditor', 'authoris', 'authoriz', 'cannot change', 'accountab'] }
    ],
    sample: 'Residents over 70 are occasional users, so the portal needs the most private settings as defaults, plain-language errors and accessible recovery that does not assume a smartphone. Security that is hard to use is written down or abandoned, excluding people from a service they are entitled to. Staff are frequent users handling many records, so they need MFA, least privilege by role, short session timeouts and audit logging. The auditor must be authorised read-only, enforced server-side on every endpoint.'
  });
  add({
    id: 'SSA-Q15', area: 'SSA', points: ['SSA-2.3'], outcome: 'SE-12-06', marks: 4, format: 'short',
    stem: 'Explain how cryptography and sandboxing each contribute to a ‘security by design’ approach, using an example of sandboxing from software you have used.',
    criteria: [
      { t: 'Explains security by design — security built in from the start, not added afterwards', kw: ['by design', 'from the start', 'built in', 'not added', 'afterthought', 'foundation'] },
      { t: 'Cryptography — encryption in transit and at rest, hashing for integrity and passwords, signatures', kw: ['encrypt', 'at rest', 'in transit', 'hash', 'signature', 'key'] },
      { t: 'Sandboxing — isolating code so it cannot reach the file system, memory or network of the host', kw: ['sandbox', 'isolat', 'restrict', 'contain', 'permission', 'separate'] },
      { t: 'Gives a real example of sandboxing (browser tab, mobile app permissions, container, VM, this app’s code runner)', kw: ['browser', 'tab', 'mobile app', 'container', 'virtual machine', 'vm', 'iframe', 'webassembly', 'plugin'] }
    ],
    sample: 'Security by design means the system is built to be secure from the start rather than hardened afterwards, because decisions such as where keys live are architectural and very costly to retrofit. Cryptography provides confidentiality and integrity: data is encrypted in transit and at rest, and passwords are hashed with a salt so a breach yields no usable credentials. Sandboxing provides containment, isolating code with restricted access to the file system, memory and network so a compromised component cannot spread. For example, each browser tab runs in its own sandboxed process.'
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
    sample: 'Browsers use different rendering engines, so the same code can behave differently and developers must test cross-browser and use feature detection. Dev tools diagnose three kinds of problem: the element inspector shows the live DOM and computed styles, which exposes a broken layout; the console reports JavaScript errors with their file and line; and the network panel shows each request\'s status, size and timing, revealing an oversized image or a failed call.'
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
    id: 'WEB-Q17', area: 'WEB', points: ['WEB-2.11'], outcome: 'SE-12-03', marks: 3, format: 'short',
    media: dgm('webstack'),
    stem: 'Describe the back-end process that handles a web request for a page listing a user’s orders, referring to the role of webserver software, the web framework, objects, libraries and databases.',
    criteria: [
      { t: 'Webserver software receives the HTTP request, serves static assets and passes dynamic routes on', kw: ['webserver', 'web server', 'nginx', 'apache', 'static', 'receives', 'passes'] },
      { t: 'Web framework routes the request to the correct controller/handler', kw: ['framework', 'rout', 'controller', 'handler', 'endpoint', 'django', 'express'] },
      { t: 'Objects model the entities and libraries provide shared functions (auth, validation, templating)', kw: ['object', 'model', 'librar', 'template', 'authentic', 'validat'] },
      { t: 'Database queried and the response rendered and returned with a status code', kw: ['database', 'quer', 'sql', 'render', 'json', 'status code', '200', 'response'] }
    ],
    sample: 'Nginx receives the HTTPS request, serves any static assets itself and passes the /orders route to the application. The web framework matches that route to a controller, after middleware has restored the session. Objects model each Order, while libraries supply authentication and templating. The controller queries the database for that user\'s orders only, renders the result and returns it with a 200 status code.'
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
    sample: 'Each input is multiplied by its weight and the products are summed, so the weights scale each input by its learned importance. The bias is then added, shifting that sum so the decision threshold can move independently of the inputs; without it the neuron could not learn AND, which must return 0 for [0,0]. The sigmoid activation squashes the result into a 0-1 probability and introduces non-linearity. The untrained 0.731 reflects random weights only: training measures the error, and backpropagation with gradient descent adjusts the weights and bias over thousands of epochs until only [1,1] returns 0.94.'
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
    sample: 'The portfolio should contain a class diagram for the structure of the solution, a data flow diagram for the movement of data, and storyboards with a use case diagram for scope. Models are needed because source code shows the solution at only one level of abstraction: a reader cannot recover the architecture from thousands of lines, whereas a model communicates the whole design at a glance and shows it existed before the code. Documented algorithms in pseudocode or flowcharts are language-independent evidence of the logic, which is what a marker assesses and what another developer relies on to maintain the system.'
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
    sample: 'I would use Agile in fortnightly iterations, because the client is only available every two weeks and the interface cannot be specified before users try it. Weeks 1-2 define the requirements and data model; weeks 3-4 construct a walking skeleton so integration risk is proven early; weeks 5-10 build the public results page, admin interface and PWA features in priority order; weeks 11-12 test with club members; weeks 13-14 implement with a pilot running alongside the existing spreadsheet. Of the 70 available hours I would schedule about 55, holding the rest as buffer. Resources: free HTTPS hosting, GitHub for version control and off-device backup, established libraries for authentication, and the secretary\'s fortnightly slot reserved for reviewing working software. Offline support is the first scope to be cut if the schedule slips.'
  });

})(window.APP = window.APP || {});
