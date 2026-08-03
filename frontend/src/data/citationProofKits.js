/**
 * Citation-Proof Kit Series — content database.
 *
 * Positioning discipline (per Vince):
 *   Sell the OUTCOME, not the download. Every kit hero follows this order:
 *     1. Outcome headline
 *     2. Short problem statement
 *     3. Proof/control promise
 *     4. Proprietary tool callout (as mechanism, not product)
 *     5. Pricing options
 *
 *   Proprietary tools (matrices, indexes, grids, ladders, maps) are the
 *   PROOF MECHANISMS inside the system — not the thing being sold. The
 *   buyer is not buying a form packet; they are buying a way to know
 *   what proof they have, what is missing, what needs fixing, and what
 *   to hand over first.
 *
 *   NEVER write "Includes Operator / Truck Authorization Matrix."
 *   INSTEAD write "Know exactly who is cleared to operate which truck —
 *   and when their next evaluation is due."
 */

/**
 * Citation-Proof Kit Series — Shared kit content database.
 *
 * Single source of truth used by BOTH:
 *   - React components: CitationProofKitsPage, CitationProofKitDetailPage, KitPricingTiers, ...
 *   - SSR generator:    /app/frontend/scripts/generate-seo-pages.js
 *
 * Exported via CommonJS (`module.exports` at the bottom) so the Node SSR script
 * can `require()` this file at build time. Webpack transparently handles the
 * CJS→ESM import in every React component (`import { KIT_DETAILS } from '...'`).
 * See fieldNoteContent.js for the same pattern.
 */

const PROOF_GAP_ENGINE = [
  {
    step: '01',
    name: 'Score',
    body: 'Use the kit’s Citation-Proof Score™ to measure where the program stands right now — not from memory, from records.',
  },
  {
    step: '02',
    name: 'Sort',
    body: 'Classify every gap as missing proof, weak proof, stale proof, floor mismatch, or control failure. Stop guessing what to fix first.',
  },
  {
    step: '03',
    name: 'Fix',
    body: 'Use the kit’s builders, trackers, matrices, and reset plans to close each gap. The work moves in a defined sequence.',
  },
  {
    step: '04',
    name: 'Pull',
    body: 'Assemble the First-Pull Packet™ — the exact records to hand over first when OSHA, an insurer, or a customer arrives.',
  },
];

// Universal 3-tier structure used by every kit page.
// Each kit optionally overrides `stripeSku` per tier once wired.
const KIT_TIERS = [
  {
    id: 'digital',
    name: 'Digital Compliance Kit',
    price: 150,
    priceLabel: '$150',
    positioning: 'Core self-build documentation kit.',
    bestFor: 'Facilities that want the builders and are prepared to run the system themselves.',
    includes: [
      'Main Builder Tool for this control area',
      'Citation-Proof Score™ to measure current standing',
      'Inspector’s First 10 Questions Card',
      'Core fillable forms',
      'One worked example so the builder is not blank',
      'Regulatory Basis & Sources page',
    ],
    badge: null,
    ctaLabel: 'Start with the Digital Kit',
  },
  {
    id: 'control-system',
    name: 'Compliance Control System',
    price: 300,
    priceLabel: '$300',
    positioning: 'The full running program — not just forms, but the operating rhythm.',
    bestFor: 'Facilities that need more than paperwork. Turns the kit into a system supervisors can run every month.',
    includes: [
      'Everything in the Digital Compliance Kit',
      'The kit’s proprietary control tool (matrix, index, grid, ladder, or map)',
      'First-Pull Packet™ — the records to hand over first',
      '30-Day Reset Plan — the sequence that gets the program under control',
      'Binder Buildout Map so the physical binder mirrors the digital system',
      'Live Excel tracker where applicable',
      'QR Evidence Hub setup guide',
    ],
    badge: 'Recommended for most facilities',
    ctaLabel: 'Get the Control System',
  },
  {
    id: 'binder',
    name: 'Inspector-Ready Binder Edition',
    price: 600,
    priceLabel: '$600',
    positioning: 'Printed, tabbed, and done-with-you setup.',
    bestFor: 'Owners, plant managers, and supervisors who want help getting organized — not another download sitting on a laptop.',
    includes: [
      'Everything in the Compliance Control System',
      'Pre-printed physical binder shipped to your facility',
      'Tabbed divider structure aligned to the First-Pull Packet™',
      'Printed working forms ready to fill',
      'Done-with-you setup call to organize your first records',
      'Help assembling initial facility data into the binder',
      'First-Pull section organized for fast inspection response',
    ],
    badge: null,
    ctaLabel: 'Choose the Binder Edition',
  },
];

// Catalog card summary for the /citation-proof-kits index page.
// Copy leads with the OUTCOME the buyer walks away with, not the tool.
// `cardImage` is the hero mockup for kits that have finished art.
// `placeholder` is the fallback for kits still in build — an array of text lines
// rendered on a navy background in gold.
const KIT_CATALOG = [
  {
    slug: 'loto-readiness-kit',
    name: 'Machine-Specific LOTO Readiness Kit',
    outcome: 'Build machine-specific lockout procedures your team can follow and verify.',
    problem: 'Document energy sources, shutdown steps, authorized employees, annual inspections, and procedure control.',
    controlTool: 'Machine-Specific Procedure Builder™ and Photo Lockout Map™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: true,
    cardImage: '/assets/kits/loto/loto-hero.png',
    placeholder: null,
  },
  {
    slug: 'forklift-pit-readiness-kit',
    name: 'Forklift / PIT Readiness Kit',
    outcome: 'Know exactly who is cleared to operate which truck — and when the next evaluation is due.',
    problem: 'Document the three-part training program, four-element certification, three-year re-evaluation, refresher triggers, and daily pre-shift inspection.',
    controlTool: 'Operator Training & Evaluation Builder™ and Operator Readiness Index™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: true,
    cardImage: '/assets/kits/pit/pit-hero.png',
    placeholder: ['Forklift / PIT', 'Readiness Kit'],
  },
  {
    slug: 'hazcom-pro-kit',
    name: 'HazCom Pro Kit',
    outcome: 'Turn scattered SDS, chemical inventory, and training records into a controlled program.',
    problem: 'Control chemical inventory approval, SDS access, container labeling, and HazCom training in one auditable system.',
    controlTool: 'Chemical Control Index™ and SDS Gap Severity Grid™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: true,
    cardImage: '/assets/kits/hazcom-pro/hazcom-hero.png',
    placeholder: ['HazCom Pro Kit'],
  },
  {
    slug: 'incident-to-correction-kit',
    name: 'Incident-to-Correction Kit',
    outcome: 'Close the loop on every incident, near miss, and hazard report — with proof it got fixed.',
    problem: 'Document root cause, corrective-action ownership, closure verification, and repeat-prevention communication.',
    controlTool: 'Correction Closure Index™ and Root Cause Ladder™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: false,
    cardImage: null,
    placeholder: ['Incident-to-Correction', 'Kit'],
  },
  {
    slug: 'new-hire-orientation-kit',
    name: 'New Hire Safety Orientation Kit',
    outcome: 'Prove every new hire was oriented, restricted, equipped, and released — before they touched a machine.',
    problem: 'Track day-one orientation, PPE issue, restriction matrix, supervisor release, and 7/30-day follow-up.',
    controlTool: 'Day-One Readiness Index™ and Restricted Until Released™ Matrix',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: false,
    cardImage: null,
    placeholder: ['New Hire Safety', 'Orientation Kit'],
  },
  {
    // Lead-magnet ramp — rendered as a SEPARATE strip below the 5-kit grid
    slug: 'hazcom-starter-pack',
    name: 'HazCom Starter Pack',
    outcome: 'The $29 entry pack — written program, SDS binder checklist, and training log.',
    problem: 'You need the HazCom paperwork basics fast, and you\u2019re not ready for the full Pro Kit yet.',
    controlTool: '11-page starter set → ramps up to the HazCom Pro Kit',
    startingAt: 29,
    startingAtLabel: '$29',
    ready: true,
    cardImage: null,
    placeholder: ['HazCom', 'Starter Pack'],
    starterVariant: true,
    externalHref: '/hazcom-starter-pack',
  },
];

// Full per-kit content used by /citation-proof-kits/[slug]
// Each kit follows the outcome-first hero structure.
const KIT_DETAILS = {
  'loto-readiness-kit': {
    name: 'Machine-Specific LOTO Readiness Kit',
    subtitle: 'With Photo Lockout Maps',
    system: 'Machine-Specific Energy-Control Documentation & Self-Audit System',
    standard: '29 CFR 1910.147',
    ready: true,
    ctaShortName: 'LOTO',
    heroSupportLine: 'Built for facilities that need machine-specific lockout proof they can produce before OSHA, an insurer, or a serious injury forces the question.',
    builtFor: [
      { role: 'Plant Managers', description: 'Know every machine has a documented, machine-specific lockout procedure.' },
      { role: 'Maintenance Supervisors', description: 'Isolate energy the same way every time — even with new hires or contractors.' },
      { role: 'Small Business Owners', description: 'Have a system you can show during an inspection, insurance audit, or after an incident.' },
    ],
    // Product image assets — content-rich compositions with baked-in copy.
    // Presence of these fields triggers image-driven section rendering.
    productImages: {
      hero: '/assets/kits/loto/loto-hero.png',
      problemPanel: '/assets/kits/loto/loto-problem-panel.png',
      whatsInside: '/assets/kits/loto/loto-whats-inside.png',
      physicalMockup: '/assets/kits/loto/loto-physical-mockup.png',
      photoMapSpotlight: '/assets/kits/loto/loto-photo-map.png',
    },
    // Hero (5-step outcome-first structure)
    outcomeHeadline: 'Build machine-specific LOTO proof your team can actually follow on the floor.',
    problemStatement: 'OSHA cites employers for missing machine-specific lockout procedures more than any other 1910.147 failure. A one-page policy that says “lock out equipment before servicing” does not satisfy the standard — (c)(4)(i) requires a documented procedure for each machine, and (c)(4)(ii) defines the exact elements it must contain.',
    proofPromise: 'This kit walks a non-expert through every required element, machine by machine — with photo isolation maps, a 0–100 self-audit mapped to the CFR sub-paragraphs OSHA cites, and the exact sequence of documents an inspector asks for first.',
    proprietaryToolName: 'Machine-Specific Procedure Builder™ + Photo Lockout Map™',
    proprietaryToolDescription: 'The Procedure Builder™ is the primary control tool — an 11-step generator that produces a compliant (c)(4) procedure for any machine. Photo Lockout Map™ is Step 4A: labeled photos of every isolation point on the actual machine, so any authorized employee — or an inspector — can see the lockout at a glance instead of reading a generic template.',
    scoreIndexName: 'Citation-Proof Score™ (0–100)',
    // Flow line for hero support
    flowLine: ['Identify', 'Shut Down', 'Isolate', 'Verify', 'Certify'],
    // Stakes strip — factual, cited to OSHA source
    stakes: {
      kicker: 'What’s at Stake in 2026',
      headline: 'OSHA’s #4 most-cited standard.',
      body: 'FY2025 lockout/tagout citations totaled 2,177 — the #1 root cause was the absence of a written, machine-specific energy-control procedure. Penalties are frozen at 2025 levels — the highest in the agency’s history.',
      stats: [
        { value: '$16,550', label: 'Per Serious Violation', sub: 'The maximum for a serious or other-than-serious citation.' },
        { value: '$165,514', label: 'Per Willful or Repeat', sub: 'The maximum where OSHA shows you knew and did nothing — or cited you before.' },
        { value: '2,177', label: 'FY2025 LOTO Citations', sub: 'OSHA’s #4 most-cited standard. Instance-by-instance policy multiplies exposure per worker.' },
      ],
      source: 'Source: 2026 OSHA civil penalty schedule; OSHA FY2025 Top 10 Most-Cited Standards.',
    },
    // What this kit gets you (outcome-first, not feature-list)
    outcomes: [
      { headline: 'A defensible procedure for every machine — not a generic template', body: 'The 11-step Procedure Builder™ walks a non-expert through every element required by (c)(4)(ii): use statement, energy survey, shutdown, isolation, stored-energy release, verification, and release. Two fully worked examples (a 50-ton hydraulic press and a Haas VF-2 CNC) show what a completed procedure looks like end to end.' },
      { headline: 'A 0–100 self-audit that tells you exactly where you stand', body: 'The Citation-Proof Score™ Rubric grades your program against the ten line items OSHA actually cites, each mapped to its exact CFR sub-paragraph. Score 90+ and you’re Citation-Proof. Under 50 and a citation is likely — you know which document closes each gap before OSHA asks for it.' },
      { headline: 'Photo isolation maps that end the “where do I lock it?” conversation', body: 'Photo Lockout Map™ (Step 4A) attaches labeled photos of the main disconnect, air shutoff, hydraulic bleed, stored-energy point, verification point, and danger zone. Any authorized employee — including one who’s never worked that machine — can see the lockout at a glance.' },
      { headline: 'The Inspector’s First 10 Questions — and the exact document that answers each', body: 'When a CSHO opens a LOTO inspection, they ask for documents in a predictable order. This card gives you the question, why it’s asked, and the item from your binder that answers it. If you can produce items 1–4 in under two minutes, you’ve already shown an active safety-management system.' },
    ],
    // Optional: Control mechanisms section (outcome-first, tool as mechanism)
    controlMechanisms: [
      {
        outcome: 'Generate a compliant (c)(4) procedure for any machine — without hiring a consultant.',
        toolName: 'Machine-Specific Procedure Builder™',
        toolNote: 'Step-by-step 11-step generator with the Energy Source Decoder™ built in.',
      },
      {
        outcome: 'Know your program’s citation exposure in ten minutes — before OSHA scores it for you.',
        toolName: 'Citation-Proof Score™ Rubric',
        toolNote: '0–100 self-audit mapped to the exact CFR sub-paragraphs.',
      },
      {
        outcome: 'Hand over proof in the order an inspector asks for it — instead of scrambling.',
        toolName: 'Inspector’s First 10 Questions Card',
        toolNote: 'The predictable CSHO sequence + the item from your kit that answers each.',
      },
      {
        outcome: 'Show any employee where every lock, bleed valve, and verification point lives — with photos.',
        toolName: 'Photo Lockout Map™',
        toolNote: 'Step 4A of the Procedure Builder — visual proof, not paragraphs.',
      },
    ],
    // Key proof section
    keyProof: [
      'Written Energy-Control Program (Form A) — (c)(1)',
      'Machine-specific procedures with Photo Lockout Maps — (c)(4)(i)(ii)',
      'Periodic Inspection Certification (Form B) — (c)(6)',
      'Training Certification Log (Form C) — (c)(7)(iv)',
      'Lock & Tag Assignment Register (Form D) — (c)(5)',
      'Two fully worked examples — 50-ton press and Haas VF-2 CNC',
    ],
    // Kit-specific FAQ
    faq: [
      { q: 'Do I need a separate procedure for every machine?', a: 'Yes, if the machine has different energy sources, isolation points, or hazard controls. OSHA is explicit under 1910.147(c)(4) — procedures must be specific enough that an authorized employee can perform the isolation. Generic templates are the #1 LOTO citation.' },
      { q: 'What does the Photo Lockout Map replace?', a: 'It replaces the assumption that operators know where each isolation point is. Photos of the actual machine make the procedure usable by any authorized employee — including someone who has never worked that machine before, or an inspector reading it in real time.' },
      { q: 'How does the Citation-Proof Score™ work?', a: 'It’s a 0–100 rubric graded against the ten LOTO line items OSHA actually cites, each mapped to a specific CFR sub-paragraph. Full points if it exists, is signed and dated, and matches the floor. Half points if it’s incomplete or generic. Zero if it’s missing or contradicted by practice. Under 50 = citation likely. 90+ = Citation-Proof. It is a readiness self-assessment, not a legal certification.' },
      { q: 'Does this cover contractor lockout?', a: 'Yes — Step 10 of the Procedure Builder addresses (f)(2) host-employer / contractor coordination and (f)(3) group LOTO methods (lockbox, multi-lock hasp). The on-site coordination itself is a facility policy the kit helps you document.' },
    ],
  },

  'forklift-pit-readiness-kit': {
    name: 'Forklift / PIT Readiness Kit',
    subtitle: 'Forklift Training & Evaluation Documentation Kit',
    system: 'Forklift Compliance Control System',
    standard: '29 CFR 1910.178(l)',
    ready: true,
    ctaShortName: 'PIT',
    heroSupportLine: 'Built for facilities that need PIT records they can find, trust, and produce before OSHA, an insurer, or leadership asks for them.',
    builtFor: [
      { role: 'Plant Managers', description: 'Know who is cleared and what records are missing.' },
      { role: 'Warehouse Supervisors', description: 'Track daily readiness, refresher triggers, and evaluations.' },
      { role: 'Small Business Owners', description: 'Have a system that can be shown during an inspection or audit.' },
    ],
    // Product image assets — content-rich compositions with baked-in copy.
    // Presence of these fields triggers image-driven section rendering.
    productImages: {
      hero: '/assets/kits/pit/pit-hero.png',
      problemPanel: '/assets/kits/pit/pit-problem-panel.png',
      problemPanelAlt: 'What this kit helps you organize — operator training, evaluation, and certification documentation',
      whatsInside: '/assets/kits/pit/pit-whats-inside.png',
      photoMapSpotlight: '/assets/kits/pit/pit-matrix.png',
      photoMapSpotlightAlt: 'Operator Training & Evaluation Builder™ — proprietary tool that documents the three-part program across all 22 required topics for one operator on one truck type',
      physicalMockup: '/assets/kits/pit/pit-physical-mockup.png',
    },
    outcomeHeadline: 'Know exactly who is cleared to operate which truck — and when their next evaluation is due.',
    problemStatement: 'Not another training packet. A system that proves training, evaluation, re-evaluation, refresher triggers, and daily readiness — before OSHA does. Most facilities can produce a stack of forklift certificates. Almost none can show a complete four-element certification per operator, per truck type — with the three-year re-evaluation actually tracked.',
    proofPromise: 'This kit walks a non-expert through every required element — the Training & Evaluation Builder™ covers the three parts of (l)(2)(ii) and the 22 required topics of (l)(3), a 0–100 self-audit mapped to the (l) sub-paragraphs OSHA cites, and a fully worked example (Class IV sit-down counterbalance) so the Builder is never blank.',
    proprietaryToolName: 'Operator Training & Evaluation Builder™ + Operator Readiness Index™',
    proprietaryToolDescription: 'The Training & Evaluation Builder™ is the primary control tool — it documents the three-part program (formal + practical + workplace evaluation) across all 22 required topics for one operator, on one truck type. The Operator Readiness Index™ powers the Citation-Proof Score™: a 0–100 rubric mapped to the exact (l) sub-paragraphs OSHA cites. The 3-Year Re-Evaluation Autopilot Tracker closes the gap that generates the most missed citations.',
    scoreIndexName: 'Operator Readiness Index™',
    flowLine: ['Instruct', 'Train', 'Evaluate', 'Certify', 'Re-Evaluate'],
    // Stakes strip — factual, cited to OSHA source
    stakes: {
      kicker: 'What’s at Stake in 2026',
      headline: 'OSHA’s #6 most-cited standard — 2,248 forklift citations in FY2024.',
      body: 'The #1 root cause of a forklift citation is incomplete operator training, evaluation, and certification records under (l)(2), (l)(3), and (l)(6). Penalties are frozen at 2025 levels — the highest in the agency’s history — with no inflation rollback. Every tool, rubric, form, and tracker in this documentation kit maps to the exact 1910.178(l) sub-paragraphs OSHA cites — so you can build defensible, operator-specific documentation and self-audit your program before OSHA does.',
      stats: [
        { value: '$16,550', label: 'Per Serious Violation', sub: 'The maximum for a serious or other-than-serious citation — e.g., an operator with no completed training, evaluation, or certification.' },
        { value: '$165,514', label: 'Per Willful or Repeat', sub: 'The maximum where OSHA shows you knew and did nothing — or cited you for the same training failure before.' },
        { value: '2,248', label: 'FY2024 PIT Citations', sub: 'OSHA’s #6 most-cited standard. Instance-by-instance policy: five operators without complete records can become five separate citations — not one.' },
      ],
      source: 'Source: 2026 OSHA civil penalty schedule (penalties frozen at 2025 levels); OSHA FY2024 Top 10 Most-Cited Standards — Powered Industrial Trucks, 29 CFR 1910.178, 2,248 citations.',
    },
    // What this kit gets you (outcome-first)
    outcomes: [
      { headline: 'A four-element certification for every operator — the record OSHA asks for first', body: 'The Training & Evaluation Certification (Form A) captures the four elements required by (l)(6): operator name, training date, evaluation date, and the identity of the person who performed the training and evaluation. Missing any one of these is a citable recordkeeping failure. The Builder walks you through completing this — with a fully worked example (Marcus Reed on a Class IV counterbalance) so the record is never guess-built.' },
      { headline: 'A 0–100 self-audit that tells you exactly where you stand', body: 'The Citation-Proof Score™ Rubric grades your program against the ten line items OSHA cites, each mapped to its exact CFR sub-paragraph. Score 90+ and you’re Citation-Proof. Under 50 and a citation is likely — you know which certification, tracker, or evaluation closes each gap before an inspector opens the binder.' },
      { headline: 'A 3-Year Re-Evaluation tracker that catches the most-missed citation', body: 'The single most common PIT citation is a lapsed 3-year re-evaluation that nobody tracked. Form B (3-Year Re-Evaluation Autopilot) logs every operator’s last evaluation date and computes the next-due date under (l)(4)(iii). No triennial evaluation lapses because the clock runs on paper, not in someone’s head.' },
      { headline: 'The Inspector’s First 10 Questions — and the exact record that answers each', body: 'When a CSHO opens a forklift inspection, they ask for records in a predictable order — certifications, workplace evaluations, re-evaluation dates, refresher after a near-miss, today’s pre-shift inspection. This card gives you the question, why it’s asked, and the item from your kit that answers it. If you can produce complete four-element certifications for every operator in under two minutes, you’ve already shown an active training program.' },
    ],
    controlMechanisms: [
      {
        outcome: 'Build a defensible operator record for any truck type — without hiring a consultant.',
        toolName: 'Operator Training & Evaluation Builder™',
        toolNote: 'Documents the three-part program across all 22 required topics — one operator, one truck type.',
      },
      {
        outcome: 'Know your program’s citation exposure in ten minutes — before OSHA scores it for you.',
        toolName: 'Citation-Proof Score™ Rubric',
        toolNote: '0–100 self-audit mapped to the exact (l) sub-paragraphs. Powered by the Operator Readiness Index™.',
      },
      {
        outcome: 'Never let a triennial re-evaluation lapse again.',
        toolName: '3-Year Re-Evaluation Autopilot Tracker',
        toolNote: 'Form B — logs every operator’s last eval + auto-computed next-due date. (l)(4)(iii).',
      },
      {
        outcome: 'Hand over proof in the order an inspector asks for it — instead of scrambling.',
        toolName: 'Inspector’s First 10 Questions Card',
        toolNote: 'The predictable CSHO sequence + the record from your kit that answers each.',
      },
    ],
    keyProof: [
      'Operator Training & Evaluation Builder™ — three-part format + 22 required topics, blank + worked example',
      'Training & Evaluation Certification (Form A) — the four-element (l)(6) record of certification',
      '3-Year Re-Evaluation Autopilot Tracker (Form B) — (l)(4)(iii)',
      'Daily / Pre-Shift Inspection (Form C) — (p)(1)',
      'Refresher-Training Trigger Log (Form D) — (l)(4)(ii)',
      'Citation-Proof Score™ Rubric (0–100, mapped to (l) sub-paragraphs)',
      'Inspector’s First 10 Questions Card',
      'Fully worked example — Class IV sit-down counterbalance forklift',
      'Regulatory Basis & Sources page — every requirement cited to 1910.178',
    ],
    faq: [
      { q: 'Is a wallet card enough proof?', a: 'No. A wallet card proves training happened at some point. It does not prove workplace evaluation on the actual truck type, does not track the three-year re-evaluation, and does not tie the operator to the specific truck class(es) they operate. Under (l)(6) OSHA asks for a certification with four specific elements — operator name, training date, evaluation date, and trainer identity. The kit’s Form A captures all four.' },
      { q: 'Does online-only training satisfy OSHA?', a: 'No. 1910.178(l)(2)(ii) requires three parts — formal instruction (which can be online), practical training (hands-on demonstration + trainee exercises on the actual truck type), and a workplace performance evaluation observed in real conditions. Online-only training fails the standard. The Builder documents all three parts as separate steps so an inspector can see each was completed.' },
      { q: 'What triggers a refresher training?', a: '1910.178(l)(4)(ii) lists them: an operator observed operating unsafely, involvement in an accident or near miss, workplace evaluation showing operator needs additional training, assignment to a different type of truck, or a change in workplace conditions that could affect safe operation. Form D (Refresher-Training Trigger Log) documents each trigger event and links it to the refresher training completed.' },
      { q: 'How does the Citation-Proof Score™ work?', a: 'It’s a 0–100 rubric graded against ten PIT line items OSHA actually cites, each mapped to its exact CFR sub-paragraph (mostly under (l), plus (p)(1) for daily inspection). Full points if it exists, is signed and dated, and matches practice. Half points if it’s incomplete, unsigned, generic, or outdated. Zero if it’s missing or contradicted by practice. Under 50 = citation likely. 90+ = Citation-Proof. It is a readiness self-assessment, not a legal certification or an operator license — there is no OSHA “forklift license.”' },
      { q: 'Do I need one certification per operator per truck type?', a: 'Yes. Under (l)(3)(i), training is truck-type-specific. An operator certified on a Class IV counterbalance is not automatically certified on a reach truck. The Builder is designed to be completed once per operator, per truck type — the Step 1 identification captures the exact class and unit(s) the certification covers.' },
    ],
  },

  'hazcom-pro-kit': {
    name: 'HazCom Pro Kit',
    subtitle: 'Chemical Inventory, SDS, Labeling & Training Control',
    system: 'Chemical Inventory, SDS, Labeling & Training Control System',
    standard: '29 CFR 1910.1200',
    ready: true,
    ctaShortName: 'HazCom',
    heroSupportLine: 'Built for facilities that need chemical inventory, SDS access, labeling, and training records they can produce the moment an inspector or an employee asks.',
    builtFor: [
      { role: 'Plant Managers', description: 'Know every chemical is inventoried, labeled, and matched to a current SDS.' },
      { role: 'Line Supervisors', description: 'Give every worker access to the SDS they need, when they need it.' },
      { role: 'Small Business Owners', description: 'Have a written HazCom program that stands up to inspection.' },
    ],
    productImages: {
      hero: '/assets/kits/hazcom-pro/hazcom-hero.png',
      whatsInside: '/assets/kits/hazcom-pro/hazcom-whats-inside.png',
      physicalMockup: '/assets/kits/hazcom-pro/hazcom-binder-600.png',
      deliverySection: '/assets/kits/hazcom-pro/hazcom-delivery.png',
      deliverySectionAlt: 'How Delivery Works — Digital: instant PDF access · Control System: PDF + XLSX · Binder Edition: digital access plus printed fulfillment',
      tierCards: {
        digital: '/assets/kits/hazcom-pro/hazcom-digital-150.png',
        'control-system': '/assets/kits/hazcom-pro/hazcom-control-300.png',
        binder: '/assets/kits/hazcom-pro/hazcom-binder-600.png',
      },
    },
    outcomeHeadline: 'Turn a scattered SDS drawer and a mystery chemical list into a controlled program you can hand OSHA in ten minutes.',
    problemStatement: 'HazCom is the #1 cited standard in general industry — not because chemicals are rare, but because the paperwork trailing behind them almost never lines up. The inventory says one thing, the SDS binder says another, and half the labels are missing.',
    proofPromise: 'This kit builds a chemical program you can actually control: every chemical inventoried, every SDS current, every label verified, every employee trained, and every new chemical routed through an approval step before it comes in the door.',
    proprietaryToolName: 'Chemical Control Index™ + SDS Gap Severity Grid™',
    proprietaryToolDescription: 'The Chemical Control Index™ scores whether each chemical is controlled end to end — inventory, SDS, labeling, training, approval, and emergency response. The SDS Gap Severity Grid™ ranks chemical and SDS problems by urgency so the facility knows exactly what to fix first when the list is long.',
    scoreIndexName: 'HazCom Readiness Index™',
    flowLine: ['Inventory', 'SDS', 'Label', 'Train', 'Approve', 'Respond'],
    outcomes: [
      { headline: 'One chemical inventory that matches the floor', body: 'The inventory, the SDS binder, and the containers on the shelf finally tell the same story. New chemicals are added through a documented approval step.' },
      { headline: 'An SDS index that surfaces gaps before OSHA does', body: 'The SDS Gap Severity Grid™ ranks missing, outdated, or wrong-language SDSs by risk — so the shortlist to fix first is obvious.' },
      { headline: 'A label audit that catches secondary containers', body: 'The most common HazCom citation is not the missing manufacturer label — it’s the unlabeled spray bottle in the maintenance shop. The audit sheet targets exactly those.' },
      { headline: 'HazCom training tied to the actual chemicals present', body: 'Training records reference the specific hazard classes in your inventory, not a generic PowerPoint. Employees can point to the SDS they were trained on.' },
    ],
    keyProof: [
      'Written HazCom program aligned to 1910.1200',
      'Chemical inventory with approval trail',
      'SDS index with severity-graded gap list',
      'Container label audit',
      'HazCom training certification',
      'New chemical approval form',
    ],
    faq: [
      { q: 'Do I need an SDS for every chemical, even office cleaners?', a: 'Consumer products used in a way that matches consumer use are generally exempt — but the moment a product is used in higher frequency, larger quantity, or a different way than a consumer would use it, the exemption drops. Safer default: keep the SDS.' },
      { q: 'What counts as a "secondary container"?', a: 'Any container the chemical was transferred INTO from the original manufacturer container — spray bottles, buckets, dispensers, dip tanks. Under 1910.1200(f)(6), these must be labeled unless the transferring employee uses the entire amount within their own shift.' },
      { q: 'How current do SDSs need to be?', a: 'There is no fixed shelf life, but if the manufacturer issues a new revision (usually because of a hazard reclassification or GHS update), the facility is expected to have the current sheet. The kit includes an SDS refresh cadence.' },
    ],
  },

  'incident-to-correction-kit': {
    name: 'Incident-to-Correction Kit',
    subtitle: 'Incident, Near-Miss & Corrective Action Control',
    system: 'Incident, Near-Miss & Corrective Action Control System',
    standard: 'OSHA recordkeeping and corrective-action program support (general)',
    ready: false,
    ctaShortName: 'Incident',
    heroSupportLine: 'Built for facilities that need incident, near-miss, and corrective-action records they can produce the moment leadership, an insurer, or OSHA asks for them.',
    builtFor: [
      { role: 'Plant Managers', description: 'Know every incident was logged, investigated, and closed with a corrective action.' },
      { role: 'HR / Safety Coordinators', description: 'Keep the corrective-action loop moving — no reports sitting open for months.' },
      { role: 'Small Business Owners', description: 'Have an incident and closure record you can produce during an insurance claim or audit.' },
    ],
    outcomeHeadline: 'Close the loop on every incident, near miss, and hazard report — with proof it actually got fixed.',
    problemStatement: 'Most facilities are decent at writing the incident report. Almost none can show what changed as a result. The corrective action is either verbal, undocumented, or "in progress" for six months. That gap is what turns a near miss into the next injury.',
    proofPromise: 'This kit takes the reporting-to-closure loop and turns it into a controlled sequence: report, investigate, correct, verify, communicate, and prevent repeat. No item stays open without an owner and a due date.',
    proprietaryToolName: 'Correction Closure Index™ + Root Cause Ladder™',
    proprietaryToolDescription: 'The Correction Closure Index™ scores whether an incident, near miss, hazard observation, or complaint was actually closed — not just reported. The Root Cause Ladder™ walks the team from the event, to the direct cause, to the system weakness, to the control gap, to the corrective action that prevents the next occurrence.',
    scoreIndexName: 'Correction Closure Index™',
    flowLine: ['Report', 'Investigate', 'Correct', 'Verify', 'Communicate', 'Prevent Repeat'],
    outcomes: [
      { headline: 'Every incident owned, tracked, and closed', body: 'The corrective action tracker ends the "who was supposed to fix that?" conversation. Owner, due date, verification, and closure evidence live in one place.' },
      { headline: 'Root cause work that moves past "employee error"', body: 'The Root Cause Ladder™ forces the analysis past the first surface cause and into the system that allowed the event to happen. That’s where repeat prevention actually lives.' },
      { headline: 'A near-miss log that’s taken seriously', body: 'Near misses get the same investigation treatment as recordables. The pattern is what an inspector or insurer will ask about — not the individual near miss.' },
      { headline: 'Employee communication proof', body: 'When a corrective action changes a work practice, the kit documents that employees were informed — not just that the change was made in the file cabinet.' },
    ],
    keyProof: [
      'Incident report form',
      'Near-miss report form',
      'Witness statement template',
      'Photo evidence log',
      'Root cause worksheet',
      'Corrective action tracker (owner, due date, closure evidence)',
      'Verification-of-correction form',
      'Employee communication record',
    ],
    faq: [
      { q: 'Is this a 300-log replacement?', a: 'No. This kit sits on top of your OSHA 300/300A/301 recordkeeping. The 300 log records what qualifies. This kit tracks what got fixed — which is what an inspector, insurer, or plaintiff’s attorney will ask about next.' },
      { q: 'Why include near misses?', a: 'Because near-miss investigation is where recordable prevention actually happens. A pattern of near misses at the same task is the exact evidence trail that turns into "the employer knew or should have known" — the phrase inside most General Duty Clause citations.' },
      { q: 'How does the Root Cause Ladder differ from a 5-Why?', a: 'The ladder is designed for supervisors, not investigators. It moves in five defined steps — event, direct cause, contributing conditions, system weakness, corrective action — so the analysis lands on a control gap the facility can actually change.' },
    ],
  },

  'new-hire-orientation-kit': {
    name: 'New Hire Safety Orientation Kit',
    subtitle: 'Day-One Safety Readiness & Authorization Control',
    system: 'Day-One Safety Readiness & Authorization Control System',
    standard: 'OSHA training and orientation proof support (general)',
    ready: false,
    ctaShortName: 'New Hire',
    heroSupportLine: 'Built for facilities that need new-hire safety training records they can produce the moment an inspector or a workers-compensation adjuster asks for them.',
    builtFor: [
      { role: 'Plant Managers', description: 'Know every new hire completed orientation before they hit the floor.' },
      { role: 'HR / Onboarding Coordinators', description: 'Have one repeatable path — no matter who runs orientation.' },
      { role: 'Small Business Owners', description: 'Have proof of initial safety training for every employee on payroll.' },
    ],
    outcomeHeadline: 'Prove every new hire was oriented, restricted, equipped, and released — before they touched a machine.',
    problemStatement: 'Most facilities orient new hires. Very few can prove it in the level of detail an inspector, insurer, or defense attorney will want. And almost none document the equipment or task restrictions in place until training and evaluation are complete.',
    proofPromise: 'This kit runs the new hire through a defined sequence — orient, restrict, equip, train, release, follow up — with a paper trail at each step. The restrictions are explicit, the release is documented, and the follow-up is scheduled.',
    proprietaryToolName: 'Day-One Readiness Index™ + Restricted Until Released™ Matrix',
    proprietaryToolDescription: 'The Day-One Readiness Index™ scores whether a new employee was oriented, restricted, equipped, trained, assigned, and followed up on before working independently. The Restricted Until Released™ Matrix documents exactly what a new hire is not allowed to do until training, evaluation, and supervisor release are complete.',
    scoreIndexName: 'Day-One Readiness Index™',
    flowLine: ['Orient', 'Restrict', 'Equip', 'Train', 'Release', 'Follow Up'],
    outcomes: [
      { headline: 'A day-one packet that’s the same for every new hire', body: 'Orientation checklist, PPE issue, emergency action briefing, hazard reporting and stop-work card, equipment restriction notice — issued and signed on day one, filed in one place.' },
      { headline: 'Explicit written restrictions during the readiness window', body: 'The Restricted Until Released™ Matrix names the specific equipment, tasks, and areas the new hire cannot enter or operate until each release step is completed.' },
      { headline: 'A supervisor-verified release step', body: 'Nobody transitions from restricted to full-duty by verbal say-so. The release requires supervisor sign-off tied to the training and evaluation completed.' },
      { headline: '7-day and 30-day follow-up scheduled, not optional', body: 'The two follow-up checkpoints (safety concerns raised, restrictions still applying, near misses observed) are on the calendar as part of the onboarding sequence, not "when we get around to it."' },
    ],
    keyProof: [
      'Orientation checklist',
      'PPE acknowledgment',
      'Emergency action plan orientation',
      'Hazard reporting / stop-work card',
      'Equipment restriction notice',
      'Training matrix placement form',
      '7-day follow-up form',
      '30-day check-in form',
    ],
    faq: [
      { q: 'Isn’t this just an HR onboarding form?', a: 'HR onboarding proves the employee was hired. This kit proves the employee was oriented to the actual safety hazards of your facility — which is what OSHA, an insurer, or a workers’ comp reviewer is going to ask for after any first-90-day incident.' },
      { q: 'How is "Restricted Until Released" different from just saying "trainee"?', a: 'It’s written. It names the specific equipment, tasks, and areas the trainee cannot enter. It gets signed by the trainee, the trainer, and the supervisor. When something goes wrong, the difference between verbal restriction and written restriction is the difference between a defensible position and a lawsuit.' },
      { q: 'Do I need the follow-ups if the employee is doing fine?', a: 'The follow-ups are what document that the employee was doing fine — and that safety concerns, near misses, or restrictions were reviewed at the 7-day and 30-day mark. Skipping them removes the paper trail that protects the facility, not the employee.' },
    ],
  },
};

// Everything a kit page needs to render, in one lookup.
const getKitBySlug = (slug) => KIT_DETAILS[slug] || null;

module.exports = {
  PROOF_GAP_ENGINE,
  KIT_TIERS,
  KIT_CATALOG,
  KIT_DETAILS,
  getKitBySlug,
};
