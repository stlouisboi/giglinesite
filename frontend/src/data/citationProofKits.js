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

export const PROOF_GAP_ENGINE = [
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
export const KIT_TIERS = [
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
    badge: 'Most Popular',
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
export const KIT_CATALOG = [
  {
    slug: 'loto-readiness-kit',
    name: 'Machine-Specific LOTO Readiness Kit',
    outcome: 'Prove every machine has a written, photo-verified lockout procedure supervisors can actually run.',
    problem: 'We do not have written, machine-specific lockout/tagout procedures — or the ones we have don’t match the floor.',
    controlTool: 'Photo Lockout Map™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: true,
  },
  {
    slug: 'forklift-pit-readiness-kit',
    name: 'Forklift / PIT Readiness Kit',
    outcome: 'Know exactly who is cleared to operate which truck — and when the next evaluation is due.',
    problem: 'We cannot prove forklift training, workplace evaluation, re-evaluation, and daily readiness on demand.',
    controlTool: 'Operator / Truck Authorization Matrix',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: true,
  },
  {
    slug: 'hazcom-pro-kit',
    name: 'HazCom Pro Kit',
    outcome: 'Turn a scattered SDS drawer and mystery chemical list into a controlled program you can hand OSHA in ten minutes.',
    problem: 'Our SDS, chemical inventory, labels, and HazCom training records are not controlled.',
    controlTool: 'Chemical Control Index™ + SDS Gap Severity Grid™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: false,
  },
  {
    slug: 'incident-to-correction-kit',
    name: 'Incident-to-Correction Kit',
    outcome: 'Close the loop on every incident, near miss, and hazard report — with proof it actually got fixed.',
    problem: 'We report incidents and near misses, but we cannot show that the corrective action was ever completed or verified.',
    controlTool: 'Correction Closure Index™ + Root Cause Ladder™',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: false,
  },
  {
    slug: 'new-hire-orientation-kit',
    name: 'New Hire Safety Orientation Kit',
    outcome: 'Prove every new hire was oriented, restricted, equipped, and released — before they touched a machine.',
    problem: 'We onboard new employees, but we cannot prove safety readiness or the equipment restrictions we placed on them.',
    controlTool: 'Day-One Readiness Index™ + Restricted Until Released™ Matrix',
    startingAt: 150,
    startingAtLabel: 'Starting at $150',
    ready: false,
  },
];

// Full per-kit content used by /citation-proof-kits/[slug]
// Each kit follows the outcome-first hero structure.
export const KIT_DETAILS = {
  'loto-readiness-kit': {
    name: 'Machine-Specific LOTO Readiness Kit',
    subtitle: 'With Photo Lockout Maps',
    system: 'Machine-Specific Energy-Control Documentation & Self-Audit System',
    standard: '29 CFR 1910.147',
    ready: true,
    // Hero (5-step outcome-first structure)
    outcomeHeadline: 'Prove every machine has a written, photo-verified lockout procedure your supervisors can actually run.',
    problemStatement: 'Most facilities have some LOTO paperwork — but nobody can show a specific procedure for a specific machine, with photos of the energy sources, the isolation points, and the verification steps.',
    proofPromise: 'This kit organizes energy-control procedures machine by machine, so any supervisor can pull the right lockout sheet and any operator can see the exact points to isolate.',
    proprietaryToolName: 'Photo Lockout Map™',
    proprietaryToolDescription: 'A visual lockout guide that attaches labeled photos of the actual machine, energy-isolating devices, stored-energy points, verification points, installed lockout devices, and danger zones. This is the control mechanism that makes machine-specific LOTO real instead of theoretical.',
    scoreIndexName: 'Energy-Control Readiness Index™',
    // Flow line for hero support
    flowLine: ['Identify', 'Shut Down', 'Isolate', 'Verify', 'Certify'],
    // What this kit gets you (outcome-first, not feature-list)
    outcomes: [
      { headline: 'Machine-specific lockout procedures that actually exist', body: 'Every powered piece of equipment gets its own written procedure with photos of the energy sources and isolation points — not a generic template with the wrong machine name.' },
      { headline: 'Annual inspection certification you can pull on demand', body: 'The annual LOTO procedure inspection required under 1910.147(c)(6) becomes a scheduled event with a signed certification form for each machine.' },
      { headline: 'A training log that ties each employee to each procedure', body: 'Authorized, affected, and other employees are documented against the specific procedures they were trained on — not a single blanket sign-in sheet.' },
      { headline: 'A lock and tag register that survives turnover', body: 'Every lock, tag, and hasp is assigned, tracked, and reissued when employees leave. The register makes the physical control system auditable.' },
    ],
    // Proprietary tool callout section
    // Key proof section
    keyProof: [
      'Written energy-control program aligned to 1910.147',
      'Machine-specific procedures with photo isolation maps',
      'Annual procedure inspection certification',
      'Authorized / affected / other employee training log',
      'Lock and tag register with reissue tracking',
    ],
    // Kit-specific FAQ
    faq: [
      { q: 'Do I need a separate procedure for every machine?', a: 'Yes, if the machine has different energy sources, isolation points, or hazard controls. OSHA is explicit under 1910.147(c)(4) — procedures must be specific enough that an authorized employee can perform the isolation. Generic templates are a citation risk.' },
      { q: 'What does the Photo Lockout Map replace?', a: 'It replaces the assumption that operators know where each isolation point is. Photos of the actual machine make the procedure usable by any authorized employee — including someone who has never worked that machine before.' },
      { q: 'Does this cover contractor lockout?', a: 'The kit includes the outer program language for host-employer / contractor coordination, but the on-site coordination itself is a facility policy that we help you document, not a pre-fillable form.' },
    ],
  },

  'forklift-pit-readiness-kit': {
    name: 'Forklift / PIT Readiness Kit',
    subtitle: 'Powered Industrial Truck Compliance Control',
    system: 'Forklift Compliance Control System',
    standard: '29 CFR 1910.178(l)',
    ready: true,
    outcomeHeadline: 'Know exactly who is cleared to operate which truck — and when their next evaluation is due.',
    problemStatement: 'Most facilities can produce a stack of forklift certificates. Almost none can show which operator is cleared on which class of truck, when their three-year re-evaluation is due, or whether their last workplace evaluation was actually observed — not just signed.',
    proofPromise: 'This kit turns forklift compliance from a stack of certificates into a running control system: authorization, evaluation, re-evaluation, refresher triggers, daily inspection, and trainer credentials — all in one place.',
    proprietaryToolName: 'Operator / Truck Authorization Matrix',
    proprietaryToolDescription: 'A control matrix that shows which operators are cleared on which truck classes, when their initial evaluation was performed, when their three-year re-evaluation is due, and what refresher triggers apply. This is the mechanism that answers OSHA’s "prove it" question in seconds.',
    scoreIndexName: 'Operator Readiness Index™',
    flowLine: ['Instruct', 'Train', 'Evaluate', 'Certify', 'Re-Evaluate'],
    outcomes: [
      { headline: 'Every operator tied to every truck they’re authorized for', body: 'The Authorization Matrix ends the "we think John is cleared on the reach truck" conversation. Cleared, not cleared, or expired — visible at a glance.' },
      { headline: 'Three-year re-evaluations that get scheduled, not forgotten', body: '1910.178(l)(4)(iii) requires re-evaluation at least every three years. The kit tracks the due date per operator per truck class and flags refresher triggers (near miss, damage, accident, new equipment).' },
      { headline: 'Pre-shift inspection records that hold up under review', body: 'Daily inspection sheets tied to truck ID, operator ID, defect handling, and out-of-service tags. The record proves the inspection happened — and what was done about defects.' },
      { headline: 'Trainer qualification documented, not assumed', body: '1910.178(l)(2)(iii) requires the trainer to have the knowledge, training, and experience to train and evaluate. The kit includes a trainer qualification record so this is provable, not verbal.' },
    ],
    keyProof: [
      'Operator certifications tied to truck class(es)',
      'Workplace evaluations — initial and periodic',
      'Three-year re-evaluation tracker with due dates',
      'Refresher trigger log (near miss, damage, accident, new equipment)',
      'Pre-shift inspection record',
      'Trainer qualification record',
    ],
    faq: [
      { q: 'Is a wallet card enough proof?', a: 'No. The wallet card proves training happened at some point. It does not prove workplace evaluation, does not track the three-year re-evaluation, and does not tie the operator to the specific truck class(es) they operate. OSHA asks for all four.' },
      { q: 'What triggers a refresher?', a: '1910.178(l)(4)(i) lists them: unsafe operation observed, involvement in an accident or near miss, workplace evaluation showing operator needs additional training, assignment to a different type of truck, or a change in workplace conditions that could affect safe operation. The kit logs each trigger and links it to the refresher completed.' },
      { q: 'Do I need daily inspections for every truck?', a: 'Yes, at the beginning of each shift where the truck is used — 1910.178(q)(7). The kit provides the pre-shift inspection form and the defect-handling protocol so out-of-service trucks are actually removed from service.' },
    ],
  },

  'hazcom-pro-kit': {
    name: 'HazCom Pro Kit',
    subtitle: 'Chemical Inventory, SDS, Labeling & Training Control',
    system: 'Chemical Inventory, SDS, Labeling & Training Control System',
    standard: '29 CFR 1910.1200',
    ready: false,
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
export const getKitBySlug = (slug) => KIT_DETAILS[slug] || null;
