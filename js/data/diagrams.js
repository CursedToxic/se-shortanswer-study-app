/* ===========================================================================
   diagrams.js — inline SVG system architecture / model diagrams.
   All strokes and fills use CSS custom properties so diagrams re-theme with
   the Year 11 (standard) and Year 12 (ops-centre) skins automatically.
   =========================================================================== */
(function (A) {
  'use strict';

  const open = (vb, title) =>
    `<svg class="dgm" viewBox="${vb}" role="img" aria-label="${title}" preserveAspectRatio="xMidYMid meet">
     <defs>
       <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
         <path d="M0,0 L10,5 L0,10 z" fill="var(--dgm-line)"/>
       </marker>
       <marker id="ahi" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto">
         <path d="M0,0 L12,6 L0,12 z" fill="var(--dgm-bg)" stroke="var(--dgm-line)" stroke-width="1"/>
       </marker>
     </defs>`;

  const box = (x, y, w, h, label, sub) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="dgm-box"/>
     <text x="${x + w / 2}" y="${y + (sub ? h / 2 - 4 : h / 2 + 5)}" class="dgm-t">${label}</text>` +
    (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" class="dgm-s">${sub}</text>` : '');

  const line = (x1, y1, x2, y2, label, dash) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="dgm-l" marker-end="url(#ah)"${dash ? ' stroke-dasharray="5 4"' : ''}/>` +
    (label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" class="dgm-s">${label}</text>` : '');

  const DIAGRAMS = {

    /* ---------- OOP class diagram (notes + exam) ---------- */
    classdiagram: open('0 0 640 330', 'UML class diagram: Account with Savings and Cheque subclasses') + `
      <rect x="220" y="10" width="200" height="104" rx="4" class="dgm-box"/>
      <line x1="220" y1="38" x2="420" y2="38" class="dgm-l" marker-end=""/>
      <line x1="220" y1="86" x2="420" y2="86" class="dgm-l" marker-end=""/>
      <text x="320" y="29" class="dgm-t">Account</text>
      <text x="230" y="54" class="dgm-c">- accountNo : string</text>
      <text x="230" y="70" class="dgm-c">- balance : real</text>
      <text x="230" y="102" class="dgm-c">+ deposit(amt) : void</text>
      <path d="M320,114 L320,150" class="dgm-l" marker-end="url(#ahi)" transform="rotate(180 320 132)"/>
      <line x1="150" y1="150" x2="490" y2="150" class="dgm-l" marker-end=""/>
      <line x1="150" y1="150" x2="150" y2="186" class="dgm-l" marker-end=""/>
      <line x1="490" y1="150" x2="490" y2="186" class="dgm-l" marker-end=""/>
      <rect x="50" y="186" width="200" height="86" rx="4" class="dgm-box"/>
      <line x1="50" y1="214" x2="250" y2="214" class="dgm-l" marker-end=""/>
      <line x1="50" y1="244" x2="250" y2="244" class="dgm-l" marker-end=""/>
      <text x="150" y="205" class="dgm-t">SavingsAccount</text>
      <text x="60" y="232" class="dgm-c">- interestRate : real</text>
      <text x="60" y="262" class="dgm-c">+ addInterest() : void</text>
      <rect x="390" y="186" width="200" height="86" rx="4" class="dgm-box"/>
      <line x1="390" y1="214" x2="590" y2="214" class="dgm-l" marker-end=""/>
      <line x1="390" y1="244" x2="590" y2="244" class="dgm-l" marker-end=""/>
      <text x="490" y="205" class="dgm-t">ChequeAccount</text>
      <text x="400" y="232" class="dgm-c">- overdraft : real</text>
      <text x="400" y="262" class="dgm-c">+ withdraw(amt) : void</text>
      <text x="320" y="306" class="dgm-s">Hollow triangle = inheritance. − private, + public.</text>
    </svg>`,

    /* ---------- open vs closed loop control ---------- */
    controlloop: open('0 0 680 300', 'Open loop and closed loop control system block diagrams') + `
      <text x="20" y="22" class="dgm-h">Open loop</text>
      ${box(20, 34, 110, 48, 'Input', 'setpoint')}
      ${box(180, 34, 120, 48, 'Controller')}
      ${box(350, 34, 120, 48, 'Actuator')}
      ${box(520, 34, 110, 48, 'Output')}
      ${line(130, 58, 178, 58)}${line(300, 58, 348, 58)}${line(470, 58, 518, 58)}
      <text x="20" y="140" class="dgm-h">Closed loop</text>
      ${box(20, 152, 90, 48, 'Input')}
      <circle cx="150" cy="176" r="18" class="dgm-box"/><text x="150" y="181" class="dgm-t">Σ</text>
      ${box(205, 152, 110, 48, 'Controller')}
      ${box(350, 152, 110, 48, 'Actuator')}
      ${box(495, 152, 110, 48, 'Process')}
      ${box(285, 240, 120, 42, 'Sensor', 'feedback')}
      ${line(110, 176, 130, 176)}${line(168, 176, 203, 176)}
      ${line(315, 176, 348, 176, 'error')}${line(460, 176, 493, 176)}
      <path d="M605,176 L645,176 L645,261 L407,261" class="dgm-l" marker-end="url(#ah)"/>
      <path d="M285,261 L150,261 L150,196" class="dgm-l" marker-end="url(#ah)"/>
      <text x="640" y="296" class="dgm-s" text-anchor="end">error = setpoint − measured</text>
    </svg>`,

    /* ---------- web stack ---------- */
    webstack: open('0 0 700 300', 'Three tier web development system: client, server, database') + `
      ${box(20, 60, 160, 120, 'FRONT END', 'browser / client')}
      <text x="100" y="152" class="dgm-c">HTML · CSS · JS</text>
      ${box(270, 60, 160, 120, 'BACK END', 'web server + framework')}
      <text x="350" y="152" class="dgm-c">routing · auth · logic</text>
      ${box(520, 60, 160, 120, 'DATABASE', 'SQL / non-SQL')}
      <text x="600" y="152" class="dgm-c">persistent storage</text>
      ${line(180, 100, 268, 100, 'HTTPS request')}
      <path d="M268,146 L182,146" class="dgm-l" marker-end="url(#ah)"/>
      <text x="225" y="140" class="dgm-s">HTML / JSON</text>
      ${line(430, 100, 518, 100, 'query')}
      <path d="M518,146 L432,146" class="dgm-l" marker-end="url(#ah)"/>
      <text x="475" y="140" class="dgm-s">result set</text>
      <text x="350" y="222" class="dgm-s">Validation on the client is for usability; validation on the server is the security control.</text>
      <text x="350" y="244" class="dgm-s">Ports: HTTP 80 · HTTPS 443 · DNS 53 · SFTP 22</text>
    </svg>`,

    /* ---------- TLS handshake ---------- */
    tlshandshake: open('0 0 620 290', 'TLS handshake sequence between client and server') + `
      ${box(40, 14, 140, 40, 'Client')}
      ${box(440, 14, 140, 40, 'Server')}
      <line x1="110" y1="54" x2="110" y2="262" class="dgm-l" stroke-dasharray="4 4" marker-end=""/>
      <line x1="510" y1="54" x2="510" y2="262" class="dgm-l" stroke-dasharray="4 4" marker-end=""/>
      ${line(110, 84, 506, 84, 'ClientHello — supported ciphers')}
      <path d="M510,124 L114,124" class="dgm-l" marker-end="url(#ah)"/>
      <text x="310" y="118" class="dgm-s">ServerHello + SSL certificate (public key)</text>
      <text x="310" y="152" class="dgm-s">Client verifies certificate against the Certificate Authority</text>
      ${line(110, 182, 506, 182, 'Pre-master secret encrypted with the public key')}
      <path d="M510,222 L114,222" class="dgm-l" marker-end="url(#ah)"/>
      <text x="310" y="216" class="dgm-s">Finished — switch to symmetric session key</text>
      <text x="310" y="256" class="dgm-s">Asymmetric sets up the session · symmetric (AES) encrypts the data</text>
    </svg>`,

    /* ---------- neural network ---------- */
    neuralnet: open('0 0 560 280', 'Feedforward neural network with one hidden layer') + `
      <text x="90" y="24" class="dgm-h">Input</text><text x="280" y="24" class="dgm-h">Hidden</text><text x="470" y="24" class="dgm-h">Output</text>
      ${[70, 140, 210].map((y, i) => `<circle cx="90" cy="${y}" r="22" class="dgm-box"/><text x="90" y="${y + 5}" class="dgm-t">x${i + 1}</text>`).join('')}
      ${[50, 120, 190, 260].map((y, i) => `<circle cx="280" cy="${y}" r="22" class="dgm-box"/><text x="280" y="${y + 5}" class="dgm-t">h${i + 1}</text>`).join('')}
      <circle cx="470" cy="140" r="22" class="dgm-box"/><text x="470" y="145" class="dgm-t">ŷ</text>
      ${[70, 140, 210].map(y1 => [50, 120, 190, 260].map(y2 =>
        `<line x1="112" y1="${y1}" x2="258" y2="${y2}" class="dgm-l dgm-thin" marker-end=""/>`).join('')).join('')}
      ${[50, 120, 190, 260].map(y1 =>
        `<line x1="302" y1="${y1}" x2="448" y2="140" class="dgm-l dgm-thin" marker-end=""/>`).join('')}
      <text x="280" y="276" class="dgm-s">Each edge carries a weight · each node applies an activation function · backpropagation adjusts the weights</text>
    </svg>`,

    /* ---------- exam: secure login architecture (vulnerable) ---------- */
    loginarch: open('0 0 700 320', 'Architecture of a login system showing data flow between components') + `
      ${box(20, 40, 130, 56, 'Browser', 'login form')}
      ${box(200, 40, 140, 56, 'API gateway', 'HTTP :80')}
      ${box(390, 40, 140, 56, 'Auth service')}
      ${box(560, 40, 120, 56, 'User DB', 'passwords: MD5')}
      ${line(150, 68, 198, 68)}${line(340, 68, 388, 68)}${line(530, 68, 558, 68)}
      ${box(200, 160, 140, 56, 'Session store', 'id = userID+1')}
      ${box(390, 160, 140, 56, 'Log service', 'logs full password')}
      <path d="M460,96 L460,158" class="dgm-l" marker-end="url(#ah)"/>
      <path d="M270,96 L270,158" class="dgm-l" marker-end="url(#ah)"/>
      ${box(20, 160, 130, 56, 'Admin panel', 'no auth check')}
      <path d="M200,188 L152,188" class="dgm-l" marker-end="url(#ah)"/>
      <text x="350" y="262" class="dgm-s">Figure E1 — "SecureNotes" authentication architecture as deployed</text>
      <text x="350" y="284" class="dgm-s">All traffic between components is on the internal network</text>
    </svg>`,

    /* ---------- exam: DFD for a school canteen ordering system ---------- */
    canteendfd: open('0 0 700 300', 'Data flow diagram for a canteen ordering system') + `
      ${box(20, 50, 120, 50, 'Student', 'external entity')}
      <circle cx="300" cy="75" r="46" class="dgm-box"/><text x="300" y="72" class="dgm-t">1.0</text><text x="300" y="90" class="dgm-s">Place order</text>
      <circle cx="300" cy="225" r="46" class="dgm-box"/><text x="300" y="222" class="dgm-t">2.0</text><text x="300" y="240" class="dgm-s">Process payment</text>
      ${box(520, 50, 150, 44, 'D1  Orders')}
      ${box(520, 150, 150, 44, 'D2  Accounts')}
      ${box(520, 230, 150, 44, 'D3  Menu')}
      ${line(140, 75, 252, 75, 'order details')}
      ${line(346, 75, 518, 72, 'order record')}
      <path d="M518,250 L348,232" class="dgm-l" marker-end="url(#ah)"/>
      <text x="430" y="262" class="dgm-s">price</text>
      ${line(300, 121, 300, 177, 'total')}
      ${line(346, 205, 518, 180, 'debit')}
      <text x="350" y="294" class="dgm-s">Figure E2 — context-level data flow diagram</text>
    </svg>`,

    /* ---------- exam: mechatronic sorting line ---------- */
    sorterarch: open('0 0 700 300', 'Mechatronic parcel sorting system block diagram') + `
      ${box(20, 110, 120, 56, 'Load cell', 'mass (g)')}
      ${box(20, 30, 120, 56, 'IR sensor', 'parcel present')}
      ${box(20, 190, 120, 56, 'Camera', 'label scan')}
      ${box(230, 100, 150, 80, 'Microcontroller', 'control loop @ 50 Hz')}
      ${box(470, 30, 150, 56, 'Conveyor motor', 'PWM')}
      ${box(470, 110, 150, 56, 'Diverter arm', 'servo 0–180°')}
      ${box(470, 190, 150, 56, 'Status display', 'UI')}
      ${line(140, 58, 228, 118)}${line(140, 138, 228, 138)}${line(140, 218, 228, 162)}
      ${line(380, 118, 468, 58)}${line(380, 140, 468, 138)}${line(380, 162, 468, 218)}
      <text x="350" y="288" class="dgm-s">Figure E3 — parcel sorting subsystem. Battery: 11.1 V 2200 mAh.</text>
    </svg>`,

    /* ---------- exam: CI/CD automation pipeline ---------- */
    pipeline: open('0 0 720 230', 'DevOps continuous integration and deployment pipeline') + `
      ${box(10, 70, 110, 56, 'Commit', 'feature branch')}
      ${box(160, 70, 110, 56, 'Build')}
      ${box(310, 70, 110, 56, 'Automated tests', 'unit + SAST')}
      ${box(460, 70, 110, 56, 'Staging', 'DAST')}
      ${box(610, 70, 100, 56, 'Production')}
      ${line(120, 98, 158, 98)}${line(270, 98, 308, 98)}${line(420, 98, 458, 98)}${line(570, 98, 608, 98)}
      <path d="M365,126 L365,170 L65,170 L65,128" class="dgm-l" marker-end="url(#ah)" stroke-dasharray="5 4"/>
      <text x="215" y="188" class="dgm-s">failed test → rollback to developer</text>
      <text x="360" y="218" class="dgm-s">Figure E4 — deployment pipeline for an e-commerce PWA</text>
    </svg>`
  };

  A.Diagrams = DIAGRAMS;
  A.diagram = key => DIAGRAMS[key] || `<p class="muted">[diagram ${key} unavailable]</p>`;
})(window.APP = window.APP || {});
