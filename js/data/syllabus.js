/* ===========================================================================
   syllabus.js — NESA Software Engineering 11–12 (2022) machine-readable map
   Source: NSW Education Standards Authority, Software Engineering 11–12 (2022)
   Outcomes + content dot points transcribed verbatim for mapping purposes.
   Every module, note, question, quest and portfolio artefact in this app
   references one or more of the dotpoint ids defined below.
   =========================================================================== */
(function (A) {
  'use strict';

  /* ---- Outcomes -------------------------------------------------------- */
  const OUTCOMES = {
    'SE-11-01': 'describes methods used to plan, develop and engineer software solutions',
    'SE-11-02': 'explains how structural elements are used to develop programming code',
    'SE-11-03': 'describes how current hardware, software and emerging technologies influence the development of software engineering solutions',
    'SE-11-04': 'applies safe and secure practices to collect, use and store data',
    'SE-11-05': 'describes the social, ethical and legal implications of software engineering on the individual, society and the environment',
    'SE-11-06': 'applies tools and resources to design, develop, manage and evaluate software',
    'SE-11-07': 'implements safe and secure programming solutions',
    'SE-11-08': 'applies language structures to refine code',
    'SE-11-09': 'manages and documents the development of a software project',
    'SE-12-01': 'justifies methods used to plan, develop and engineer software solutions',
    'SE-12-02': 'applies structural elements to develop programming code',
    'SE-12-03': 'analyses how current hardware, software and emerging technologies influence the development of software engineering solutions',
    'SE-12-04': 'evaluates practices to safely and securely collect, use and store data',
    'SE-12-05': 'explains the social, ethical and legal implications of software engineering on the individual, society and the environment',
    'SE-12-06': 'justifies the selection and use of tools and resources to design, develop, manage and evaluate software',
    'SE-12-07': 'designs, develops and implements safe and secure programming solutions',
    'SE-12-08': 'tests and evaluates language structures to refine code',
    'SE-12-09': 'applies methods to manage and document the development of a software project'
  };

  /* ---- Focus areas ------------------------------------------------------
     p(id, text, including[]) builds a dot point. `including` entries are the
     syllabus "Including:" bullets and are tracked as sub-points.
     ----------------------------------------------------------------------- */
  const p = (id, text, inc) => ({ id, text, inc: inc || [] });

  const FOCUS_AREAS = [
    /* ========================= YEAR 11 ================================== */
    {
      id: 'PF', year: 11, hours: 40,
      title: 'Programming Fundamentals',
      blurb: 'The fundamental elements of creating software: development steps, algorithm design, data, and building and debugging working solutions.',
      outcomes: ['SE-11-01', 'SE-11-02', 'SE-11-03', 'SE-11-04', 'SE-11-06', 'SE-11-07'],
      groups: [
        {
          title: 'Software development',
          points: [
            p('PF-1.1', 'Explore fundamental software development steps used by programmers when designing software',
              ['requirements definition', 'determining specifications', 'design', 'development', 'integration', 'testing and debugging', 'installation', 'maintenance']),
            p('PF-1.2', 'Research and evaluate the prevalence and use of online code collaboration tools')
          ]
        },
        {
          title: 'Designing algorithms',
          points: [
            p('PF-2.1', 'Apply computational thinking and algorithmic design by defining the key features of standard algorithms, including sequence, selection, iteration and identifying data that should be stored'),
            p('PF-2.2', 'Apply divide and conquer and backtracking as algorithmic design strategies'),
            p('PF-2.3', 'Develop structured algorithms using pseudocode and flowcharts, including the use of subprograms'),
            p('PF-2.4', 'Use modelling tools including structure charts, abstraction and refinement diagrams to support top-down and bottom-up design'),
            p('PF-2.5', 'Analyse the logic and structure of written algorithms',
              ['determining inputs and outputs', 'determining the purpose of the algorithm', 'desk checking and peer checking', 'determining connections of written algorithms to other subroutines or functions']),
            p('PF-2.6', 'Identify procedures and functions in an algorithm'),
            p('PF-2.7', 'Experiment with object-oriented programming, imperative, logic and functional programming paradigms')
          ]
        },
        {
          title: 'Data for software engineering',
          points: [
            p('PF-3.1', 'Investigate the use of number systems for computing purposes, including binary, decimal and hexadecimal'),
            p('PF-3.2', 'Represent integers using two’s complement'),
            p('PF-3.3', 'Investigate standard data types',
              ['char (character) and string', 'Boolean', 'real', 'single precision floating point', 'integer', 'date and time']),
            p('PF-3.4', 'Create data dictionaries as a tool to describe data and data types, structure data, and record relationships'),
            p('PF-3.5', 'Use data structures of arrays, records, trees and sequential files')
          ]
        },
        {
          title: 'Developing solutions with code',
          points: [
            p('PF-4.1', 'Apply skills in computational thinking and programming to develop a software solution',
              ['converting an algorithm into code', 'using control structures', 'using data structures', 'using standard modules', 'creating relevant subprograms that incorporate parameter passing']),
            p('PF-4.2', 'Implement data structures that support data storage',
              ['single and multidimensional arrays', 'lists', 'trees', 'stacks', 'hash tables']),
            p('PF-4.3', 'Compare the execution of the Waterfall and Agile project management models as applied to software development'),
            p('PF-4.4', 'Test and evaluate solutions, considering key aspects including functionality, performance, readability of code, quality of documentation'),
            p('PF-4.5', 'Use debugging tools',
              ['breakpoints', 'single line stepping', 'watches', 'interfaces between functions', 'debugging output statements', 'debugging software available in an integrated development environment (IDE)']),
            p('PF-4.6', 'Determine sets of suitable test data',
              ['boundary values', 'path coverage', 'faulty and abnormal data']),
            p('PF-4.7', 'Determine typical errors experienced when developing code, including syntax, logic and runtime, and explain their likely causes')
          ]
        }
      ]
    },
    {
      id: 'OOP', year: 11, hours: 40,
      title: 'The Object-Oriented Paradigm',
      blurb: 'Classes, objects and the structural elements of OOP, how OOP code is designed, collaborated on, implemented and tested.',
      outcomes: ['SE-11-01', 'SE-11-02', 'SE-11-03', 'SE-11-04', 'SE-11-06', 'SE-11-07', 'SE-11-08', 'SE-11-09'],
      groups: [
        {
          title: 'Understanding OOP',
          points: [
            p('OOP-1.1', 'Apply the key features of an object-oriented programming (OOP) language',
              ['objects', 'classes', 'encapsulation', 'abstraction', 'inheritance', 'generalisation', 'polymorphism']),
            p('OOP-1.2', 'Compare procedural programming with OOP'),
            p('OOP-1.3', 'Use data flow diagrams, structure charts and class diagrams to represent a system'),
            p('OOP-1.4', 'Describe the process of design used to develop code in an OOP language',
              ['task definition', 'top-down and bottom-up', 'facade pattern', 'agility']),
            p('OOP-1.5', 'Assess the effectiveness of programming code developed to implement an algorithm'),
            p('OOP-1.6', 'Investigate how OOP languages handle message-passing between objects'),
            p('OOP-1.7', 'Explain code optimisation in software engineering'),
            p('OOP-1.8', 'Outline the features of OOP that support collaborative code development',
              ['consistency', 'code commenting', 'version control', 'feedback'])
          ]
        },
        {
          title: 'Programming in OOP',
          points: [
            p('OOP-2.1', 'Design and implement computer programs involving branching, iteration and functions in an OOP language for an identified need or opportunity'),
            p('OOP-2.2', 'Implement and modify OOP programming code',
              ['clear and uncluttered mainline', 'one logical task per subroutine', 'use of stubs', 'use of control structures and data structures', 'ease of maintenance', 'version control', 'regular backup']),
            p('OOP-2.3', 'Apply methodologies to test and evaluate code',
              ['unit, subsystem and system testing', 'black, white and grey box testing', 'quality assurance'])
          ]
        }
      ]
    },
    {
      id: 'MEC', year: 11, hours: 40,
      title: 'Programming Mechatronics',
      blurb: 'Hardware/software integration: sensors, actuators and end effectors, control algorithms, and building a mechatronic system for a real-world problem.',
      outcomes: ['SE-11-01', 'SE-11-02', 'SE-11-03', 'SE-11-04', 'SE-11-05', 'SE-11-06', 'SE-11-07', 'SE-11-08', 'SE-11-09'],
      groups: [
        {
          title: 'Understanding mechatronic hardware and software',
          points: [
            p('MEC-1.1', 'Outline applications of mechatronic systems in a variety of specialised fields'),
            p('MEC-1.2', 'Identify the hardware requirements to run a program and the effect on code development',
              ['assessing the relationship of microcontrollers and the central processing unit (CPU)', 'the influence of instruction set and opcodes', 'the use of address and data registers']),
            p('MEC-1.3', 'Identify and describe a range of sensors, actuators and end effectors/manipulators within existing mechatronic systems',
              ['motion sensors', 'light level sensors', 'hydraulic actuators', 'robotic grippers']),
            p('MEC-1.4', 'Use different types of data and understand how it is obtained and processed in a mechatronic system, including diagnostic data and data used for optimisation'),
            p('MEC-1.5', 'Experiment with software to control interactions and dependencies within mechatronic systems',
              ['motion constraints', 'degrees of freedom', 'combination of subsystems', 'combination of sensors, actuators and end effectors to create viable subsystems']),
            p('MEC-1.6', 'Determine power, battery and material requirements for components of a mechatronic system'),
            p('MEC-1.7', 'Develop wiring diagrams for a mechatronic system, considering data and power supply requirements'),
            p('MEC-1.8', 'Determine specialist requirements that influence the design and functions of mechatronic systems designed for people with disability')
          ]
        },
        {
          title: 'Designing control algorithms',
          points: [
            p('MEC-2.1', 'Develop, modify and apply algorithms to control a mechatronic system'),
            p('MEC-2.2', 'Explore the algorithmic patterns, code and applications for open and closed control systems'),
            p('MEC-2.3', 'Outline the features of an algorithm and program code used for autonomous control')
          ]
        },
        {
          title: 'Programming and building',
          points: [
            p('MEC-3.1', 'Design, develop and produce a mechatronic system for a real-world problem',
              ['software control', 'mechanical engineering', 'electronics and mathematics']),
            p('MEC-3.2', 'Implement algorithms and design programming code to drive mechatronic devices'),
            p('MEC-3.3', 'Develop simulations and prototypes of a potential mechatronic system to test programming code'),
            p('MEC-3.4', 'Design, develop and implement programming code for a closed loop control system'),
            p('MEC-3.5', 'Apply programming code to integrate sensors, actuators and end effectors/manipulators'),
            p('MEC-3.6', 'Implement specific control algorithms that enhance the performance of a mechatronic system'),
            p('MEC-3.7', 'Design, develop and implement a user interface (UI) to control a mechatronic system'),
            p('MEC-3.8', 'Create and use unit tests to determine the effectiveness and repeatability of each component’s control algorithm')
          ]
        }
      ]
    },

    /* ========================= YEAR 12 ================================== */
    {
      id: 'SSA', year: 12, hours: 30,
      title: 'Secure Software Architecture',
      blurb: 'Designing, developing and testing software that protects data and users — security and privacy by design, defensive code, and the impact of secure practice.',
      outcomes: ['SE-12-01', 'SE-12-02', 'SE-12-03', 'SE-12-04', 'SE-12-05', 'SE-12-06', 'SE-12-07', 'SE-12-08'],
      groups: [
        {
          title: 'Designing software',
          points: [
            p('SSA-1.1', 'Describe the benefits of developing secure software',
              ['data protection', 'minimising cyber attacks and vulnerabilities']),
            p('SSA-1.2', 'Interpret and apply fundamental software development steps to develop secure code',
              ['requirements definition', 'determining specifications', 'design', 'development', 'integration', 'testing and debugging', 'installation', 'maintenance']),
            p('SSA-1.3', 'Describe how the capabilities and experience of end users influence the secure design features of software')
          ]
        },
        {
          title: 'Developing secure code',
          points: [
            p('SSA-2.1', 'Explore fundamental software design security concepts when developing programming code',
              ['confidentiality', 'integrity', 'availability', 'authentication', 'authorisation', 'accountability']),
            p('SSA-2.2', 'Apply security features incorporated into software including data protection, security, privacy and regulatory compliance'),
            p('SSA-2.3', 'Use and explain the contribution of cryptography and sandboxing to the ‘security by design’ approach in the development of software solutions'),
            p('SSA-2.4', 'Use and explain the ‘privacy by design’ approach in the development of software solutions',
              ['proactive not reactive approach', 'embed privacy into design', 'respect for user privacy']),
            p('SSA-2.5', 'Test and evaluate the security and resilience of software by determining vulnerabilities, hardening systems, handling breaches, maintaining business continuity and conducting disaster recovery'),
            p('SSA-2.6', 'Apply and evaluate strategies used by software developers to manage the security of programming code',
              ['code review', 'static application security testing (SAST)', 'dynamic application security testing (DAST)', 'vulnerability assessment', 'penetration testing']),
            p('SSA-2.7', 'Design, develop and implement code using defensive data input handling practices, including input validation, sanitisation and error handling'),
            p('SSA-2.8', 'Design, develop and implement a safe application programming interface (API) to minimise software vulnerabilities'),
            p('SSA-2.9', 'Design, develop and implement code considering efficient execution for the user',
              ['memory management', 'session management', 'exception management']),
            p('SSA-2.10', 'Design, develop and implement secure code to minimise vulnerabilities in user action controls',
              ['broken authentication and session management', 'cross-site scripting (XSS) and cross-site request forgery (CSRF)', 'invalid forwarding and redirecting', 'race conditions']),
            p('SSA-2.11', 'Design, develop and implement secure code to protect user file and hardware vulnerabilities from file attacks and side channel attacks')
          ]
        },
        {
          title: 'Impact of safe and secure software development',
          points: [
            p('SSA-3.1', 'Apply and describe the benefits of collaboration to develop safe and secure software',
              ['considering various points of view', 'delegating tasks based on expertise', 'quality of the solution']),
            p('SSA-3.2', 'Investigate and explain the benefits to an enterprise of the implementation of safe and secure development practices',
              ['improved products or services', 'influence on future software development', 'improved work practices', 'productivity', 'business interactivity']),
            p('SSA-3.3', 'Evaluate the social, ethical and legal issues and ramifications that affect people and enterprises resulting from the development and implementation of safe and secure software',
              ['employment', 'data security', 'privacy', 'copyright', 'intellectual property', 'digital disruption'])
          ]
        }
      ]
    },
    {
      id: 'WEB', year: 12, hours: 30,
      title: 'Programming for the Web',
      blurb: 'How data moves across the internet, how web systems are designed front-to-back, and building a secure, accessible progressive web app.',
      outcomes: ['SE-12-01', 'SE-12-02', 'SE-12-03', 'SE-12-04', 'SE-12-05', 'SE-12-06', 'SE-12-07', 'SE-12-08', 'SE-12-09'],
      groups: [
        {
          title: 'Data transmission using the web',
          points: [
            p('WEB-1.1', 'Explore the applications of web programming',
              ['interactive website/webpages', 'e-commerce', 'progressive web apps (PWAs)']),
            p('WEB-1.2', 'Investigate and practise how data is transferred on the internet',
              ['data packets', 'internet protocol (IP) addresses, including IPv4', 'domain name systems (DNS)']),
            p('WEB-1.3', 'Investigate and describe the function of web protocols and their ports',
              ['HTTP, HTTPS', 'TCP/IP', 'DNS', 'FTP, SFTP', 'SSL, TLS', 'SMTP, POP 3, IMAP']),
            p('WEB-1.4', 'Explain the processes for securing the web',
              ['Secure Sockets Layer (SSL) certificates', 'encryption algorithms', 'encryption keys', 'plain text and cipher text', 'authentication and authorisation', 'hash values', 'digital signatures']),
            p('WEB-1.5', 'Investigate the effect of big data on web architecture',
              ['data mining', 'metadata', 'streaming service management'])
          ]
        },
        {
          title: 'Designing web applications',
          points: [
            p('WEB-2.1', 'Investigate and explain the role of the World Wide Web Consortium (W3C) in the development of applications for the web',
              ['Web Accessibility Initiative (WAI)', 'internationalisation', 'web security', 'privacy', 'machine-readable data']),
            p('WEB-2.2', 'Model elements that form a web development system',
              ['client-side (front-end) web programming', 'server-side (back-end) web programming', 'interfacing with databases that are based on Structured Query Language (SQL) or non-SQL']),
            p('WEB-2.3', 'Explore and explain the influence of a web browser on web development, including the use of developer (dev) tools'),
            p('WEB-2.4', 'Investigate cascading style sheets (CSS) and its impact on the design of a web application',
              ['consistency of appearance', 'flexibility with browsers or display devices', 'CSS maintenance tools']),
            p('WEB-2.5', 'Investigate the reasons for version control and apply it when developing web application'),
            p('WEB-2.6', 'Explore the types and significance of code libraries for front-end web development',
              ['frameworks that control complex web applications', 'template engines', 'predesigned CSS classes']),
            p('WEB-2.7', 'Explain the use and development of open-source software in relation to web development'),
            p('WEB-2.8', 'Investigate methods to support and manage the load times of web pages/applications'),
            p('WEB-2.9', 'Research, experiment with and evaluate the prevalence and use of web content management systems (CMS)'),
            p('WEB-2.10', 'Assess the contribution of back-end web development to the success of a web application'),
            p('WEB-2.11', 'Observe and describe the back-end process used to manage a web request',
              ['role of webserver software', 'web framework', 'objects', 'libraries', 'databases']),
            p('WEB-2.12', 'Develop a web application using an appropriate scripting language with shell scripts to make files and directories, and searching for text in a text file'),
            p('WEB-2.13', 'Apply a web-based database and construct script that executes SQL',
              ['selecting fields', 'incorporating ‘group by’', 'common SQL queries', 'constraints using WHERE keyword', 'table joins']),
            p('WEB-2.14', 'Compare Object-Relational Mapping (ORM) to SQL'),
            p('WEB-2.15', 'Describe how collaborative work practices between front-end and back-end developers improve the development of a web solution'),
            p('WEB-2.16', 'Design, develop and implement a progressive web app (PWA)',
              ['the application of design and user interface (UI) and user experience (UX) principles of font, colour, audio, video and navigation', 'a UI that considers accessibility and inclusivity'])
          ]
        }
      ]
    },
    {
      id: 'AUT', year: 12, hours: 30,
      title: 'Software Automation',
      blurb: 'Machine learning algorithms and models, programming regression and neural networks with OOP, and the human impact of automation.',
      outcomes: ['SE-12-01', 'SE-12-02', 'SE-12-03', 'SE-12-04', 'SE-12-05', 'SE-12-06', 'SE-12-07', 'SE-12-08', 'SE-12-09'],
      groups: [
        {
          title: 'Algorithms in machine learning',
          points: [
            p('AUT-1.1', 'Investigate how machine learning (ML) supports automation through the use of DevOps, robotic process automation (RPA) and business process automation (BPA)'),
            p('AUT-1.2', 'Distinguish between artificial intelligence (AI) and ML'),
            p('AUT-1.3', 'Explore models of training ML',
              ['supervised learning', 'unsupervised learning', 'semi-supervised learning', 'reinforcement learning']),
            p('AUT-1.4', 'Investigate common applications of key ML algorithms',
              ['data analysis and forecasting', 'virtual personal assistants', 'image recognition']),
            p('AUT-1.5', 'Research models used by software engineers to design and analyse ML',
              ['decision trees', 'neural networks']),
            p('AUT-1.6', 'Describe types of algorithms associated with ML',
              ['linear regression', 'logistic regression', 'K-nearest neighbour'])
          ]
        },
        {
          title: 'Programming for automation',
          points: [
            p('AUT-2.1', 'Design, develop and apply ML regression models using an OOP to predict numeric values',
              ['linear regression', 'polynomial regression', 'logistic regression']),
            p('AUT-2.2', 'Apply neural network models using an OOP to make predictions')
          ]
        },
        {
          title: 'Significance and impact of ML and AI',
          points: [
            p('AUT-3.1', 'Assess the impact of automation on the individual, society and the environment',
              ['safety of workers', 'people with disability', 'the nature and skills required for employment', 'production efficiency, waste and the environment', 'the economy and distribution of wealth']),
            p('AUT-3.2', 'Explore by implementation how patterns in human behaviour influence ML and AI software development',
              ['psychological responses', 'patterns related to acute stress response', 'cultural protocols', 'belief systems']),
            p('AUT-3.3', 'Investigate the effect of human and dataset source bias in the development of ML and AI solutions')
          ]
        }
      ]
    },
    {
      id: 'SEP', year: 12, hours: 30,
      title: 'Software Engineering Project',
      blurb: 'The major project: defining the problem, choosing and running a development approach, producing the solution, and testing and evaluating it.',
      outcomes: ['SE-12-01', 'SE-12-02', 'SE-12-03', 'SE-12-04', 'SE-12-05', 'SE-12-06', 'SE-12-07', 'SE-12-08', 'SE-12-09'],
      groups: [
        {
          title: 'Identifying and defining',
          points: [
            p('SEP-1.1', 'Define and analyse the requirements of a problem',
              ['demonstrating need(s) or opportunities', 'assessing scheduling and financial feasibility', 'generating requirements including functionality and performance', 'defining data structures and data types', 'defining boundaries']),
            p('SEP-1.2', 'Explore tools used to develop ideas and generate solutions',
              ['brainstorming, mind-mapping and storyboards', 'data dictionaries, including selecting appropriate data types', 'algorithm design', 'code generation', 'testing and debugging', 'installation', 'maintenance']),
            p('SEP-1.3', 'Investigate types of software implementation methods',
              ['direct', 'phased', 'parallel', 'pilot'])
          ]
        },
        {
          title: 'Research and planning',
          points: [
            p('SEP-2.1', 'Research and use the Waterfall software development approach',
              ['logical progression of steps used throughout the life cycle', 'stages of ‘falling water’', 'advantages and disadvantages', 'scale and types of developments']),
            p('SEP-2.2', 'Research and use the Agile software development approach',
              ['rate of developing a final solution', 'method tailoring', 'iteration workflow', 'scale and types of developments']),
            p('SEP-2.3', 'Research the WAgile software development approach',
              ['understanding it is a hybrid model', 'analysis of the ‘when’ and ‘how’ intervention is applied during the development life cycle', 'scale and types of developments']),
            p('SEP-2.4', 'Apply project management to plan and conduct the development and implementation of a project and software engineering solution',
              ['scheduling and tracking using a software tool, including Gantt charts', 'using collaboration tools']),
            p('SEP-2.5', 'Explore social and ethical issues associated with project work, including working individually, collaboratively and responding to stakeholders'),
            p('SEP-2.6', 'Explore communication issues associated with project work',
              ['involving and empowering the client', 'enabling feedback', 'negotiating']),
            p('SEP-2.7', 'Investigate how software engineering solutions are quality assured',
              ['defining criteria on which quality will be judged', 'ensuring requirements are met using a continual checking process', 'addressing compliance and legislative requirements']),
            p('SEP-2.8', 'Demonstrate the use of modelling tools'),
            p('SEP-2.9', 'Explain the contribution of back-end engineering to the success and ease of software development',
              ['technology used', 'error handling', 'interfacing with front end', 'security engineering'])
          ]
        },
        {
          title: 'Producing and implementing',
          points: [
            p('SEP-3.1', 'Design, construct and implement a solution to a software problem using appropriate development approach(es)'),
            p('SEP-3.2', 'Present a software engineering solution using presentation software'),
            p('SEP-3.3', 'Develop, construct and document algorithms'),
            p('SEP-3.4', 'Allocate resources to support the development of a software engineering solution'),
            p('SEP-3.5', 'Demonstrate the use of programmed data backup'),
            p('SEP-3.6', 'Implement version control when developing a software engineering solution'),
            p('SEP-3.7', 'Explore strategies to respond to difficulties when developing a software engineering solution',
              ['looking for a solution online', 'collaboration with peers', 'outsourcing']),
            p('SEP-3.8', 'Propose an additional innovative solution using a prototype and user interface (UI) design')
          ]
        },
        {
          title: 'Testing and evaluating',
          points: [
            p('SEP-4.1', 'Apply methodologies to test and evaluate code'),
            p('SEP-4.2', 'Use a language-dependent code optimisation technique'),
            p('SEP-4.3', 'Analyse and respond to feedback'),
            p('SEP-4.4', 'Evaluate the effectiveness of a software engineering solution',
              ['developing a report to synthesise feedback', 'developing a test plan', 'testing data used/generated based on path and boundary testing', 'comparing actual output with expected output'])
          ]
        }
      ]
    }
  ];

  /* ---- Derived indexes -------------------------------------------------- */
  const POINT_INDEX = {};   // dotpoint id -> {point, group, area}
  const AREA_INDEX = {};
  FOCUS_AREAS.forEach(area => {
    AREA_INDEX[area.id] = area;
    area.groups.forEach(group => {
      group.points.forEach(pt => {
        POINT_INDEX[pt.id] = { point: pt, group: group.title, area: area };
      });
    });
  });

  const allPoints = () => Object.keys(POINT_INDEX);
  const pointsForArea = id => AREA_INDEX[id]
    ? AREA_INDEX[id].groups.reduce((acc, g) => acc.concat(g.points.map(x => x.id)), [])
    : [];
  const pointsForYear = y => FOCUS_AREAS.filter(a => a.year === y)
    .reduce((acc, a) => acc.concat(pointsForArea(a.id)), []);
  const areaOf = pid => (POINT_INDEX[pid] || {}).area;
  const textOf = pid => (POINT_INDEX[pid] ? POINT_INDEX[pid].point.text : pid);

  A.Syllabus = {
    OUTCOMES, FOCUS_AREAS, POINT_INDEX, AREA_INDEX,
    allPoints, pointsForArea, pointsForYear, areaOf, textOf,
    totals: {
      points: Object.keys(POINT_INDEX).length,
      y11: FOCUS_AREAS.filter(a => a.year === 11).length,
      y12: FOCUS_AREAS.filter(a => a.year === 12).length
    }
  };
})(window.APP = window.APP || {});
