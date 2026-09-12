/**
 * First-Pull Checklists, Phase 2 educational lead-magnet drafts.
 *
 * Every checklist is intentionally framed as "the first records a walk-in
 * would ask for", so a small operator can rehearse against reality rather
 * than an audit manual. Content is educational, factual, and calm.
 *
 * NO claim of compliance, immunity, or guaranteed results.
 * NO fear-heavy OSHA framing. Risk is one of several motivations, not the
 * primary emotional lever.
 * NO fabricated statistics.
 *
 * Draft state, gated behind FIRST_PULL_CHECKLISTS_ENABLED in config/features.js
 * until owner approves each checklist and its disclaimer.
 */

const SHARED_DISCLAIMER =
  'This checklist is educational and reflects the first records or evidence commonly requested during an OSHA visit or third-party audit. It is not a compliance evaluation, a legal opinion, or a substitute for a written program review or on-site walkthrough. Federal OSHA standards apply broadly; state OSH plans may impose additional requirements. Every item must be evaluated against your specific operation, equipment, and workforce.';

const LOTO_DISCLAIMER = SHARED_DISCLAIMER;
const PIT_DISCLAIMER = SHARED_DISCLAIMER;
const HAZCOM_DISCLAIMER = SHARED_DISCLAIMER;
const INCIDENT_DISCLAIMER = SHARED_DISCLAIMER + ' The incident-response items below assume the incident is stable and no active injury or emergency is in progress; call 911 first when appropriate.';
const NEW_HIRE_DISCLAIMER = SHARED_DISCLAIMER;

export const FIRST_PULL_CHECKLISTS = {
  loto: {
    slug: 'loto',
    program: 'Lockout / Tagout',
    title: 'LOTO First-Pull Checklist',
    subtitle: 'Eight records an inspector or auditor asks for first when opening a Lockout/Tagout review.',
    intro:
      'Lockout/Tagout (29 CFR 1910.147) is one of the most consistently cited standards in general industry. Most citations are not about the physical lockout event, they are about the paper behind it. This one-pager lists the eight items typically requested first, if any single item takes longer than three minutes to surface, that is a first-pull gap.',
    items: [
      'Written Energy Control Program (the parent LOTO document, dated, with a revision number and an owner).',
      'Machine-specific written procedures for every machine that requires servicing or maintenance under LOTO scope.',
      'Authorized-employee training records for every employee who applies locks, with dates and trainer.',
      'Affected-employee awareness training records for every employee who works around locked-out equipment.',
      'Annual periodic inspection records (one per authorized employee per procedure per year) signed by the inspector.',
      'Lock and tag inventory list, who is issued which serial-numbered lock or personal tag.',
      'Documented review of the program within the last twelve months (the annual inspection cover memo).',
      'A named program administrator with an active phone or email owner-of-record.',
    ],
    disclaimer: LOTO_DISCLAIMER,
    updatedAt: 'Feb 2026 draft, awaiting owner approval',
  },
  'forklift-pit': {
    slug: 'forklift-pit',
    program: 'Forklift & Powered Industrial Trucks',
    title: 'Forklift & PIT First-Pull Checklist',
    subtitle: 'Nine records asked for first when the walk-through pauses at your lift.',
    intro:
      'Powered Industrial Trucks (29 CFR 1910.178) is one of the top-cited standards in warehousing and light manufacturing. The physical walk-around is fast; the paperwork is where most operators stumble. Nine items are typically requested first.',
    items: [
      'Operator certification records for every named operator, with initial evaluation date, refresher date, and truck class.',
      'Truck-class-specific training documentation (electric sit-down, LP counterbalance, order picker, reach truck, pallet jack, as applicable).',
      'Refresher training triggers documented for every operator: incident, near-miss, unsafe operation observation, three-year evaluation.',
      'Daily / pre-shift inspection records for every truck (recent 30 days minimum, more if inspections drive maintenance).',
      'Named authorized user list posted at each truck or in the operator packet.',
      'LP cylinder change-out training for every operator that swaps propane tanks, plus SDS for the propane on-site.',
      'Battery-room electrolyte handling and eye-wash training records for every electric-truck operator.',
      'Maintenance log or service records for every truck (documented external service or documented internal PM cadence).',
      'A named PIT program administrator with an owner-of-record.',
    ],
    disclaimer: PIT_DISCLAIMER,
    updatedAt: 'Feb 2026 draft, awaiting owner approval',
  },
  hazcom: {
    slug: 'hazcom',
    program: 'Hazard Communication',
    title: 'HazCom First-Pull Checklist',
    subtitle: 'Ten records that answer "show me your HazCom program" in three minutes or less.',
    intro:
      'Hazard Communication (29 CFR 1910.1200) has ranked in the OSHA Top 10 most-cited standards every year for more than a decade. The first pull is about proving the program exists and is being used, not about producing every SDS on demand.',
    items: [
      'Written Hazard Communication Program (dated, with a revision number, listing every location where hazardous chemicals are present).',
      'Chemical inventory list, current within the last twelve months, cross-referenced to SDS binder or digital library.',
      'SDS binder or digital library, retrievable in three minutes at every work location.',
      'Employee HazCom training records covering the eight required topics: hazard identification, physical vs. health hazards, protective measures, work practice controls, PPE, SDS use, container labeling, program location.',
      'Chemical container labeling standard, all workplace containers must bear at minimum a product identifier plus hazard information.',
      'Secondary container labeling procedure (spray bottles, portable containers, day-tanks).',
      'Non-routine task hazard communication procedure (confined space entry, tank cleanout, unusual chemical exposures).',
      'Multi-employer worksite HazCom coordination record when contractors are on-site.',
      'Documented review of the program within the last twelve months.',
      'A named HazCom program administrator with an owner-of-record.',
    ],
    disclaimer: HAZCOM_DISCLAIMER,
    updatedAt: 'Feb 2026 draft, awaiting owner approval',
  },
  incident: {
    slug: 'incident',
    program: 'Incident to Correction',
    title: 'Incident-to-Correction First-Pull Checklist',
    subtitle: 'Eleven records that show the incident happened, the root cause was found, and the correction actually closed.',
    intro:
      'A recordable injury or near-miss is a stress event for any operator. What separates a strong post-incident file from a citation-risk file is not whether the incident happened, it is whether the paper trail closes the loop from report through corrective action. Eleven items are the typical first-pull sequence.',
    items: [
      'Signed employee incident report or witness statement (recorded within 24 hours of the event).',
      'OSHA 301 Incident Report (or equivalent record) completed for every recordable injury.',
      'OSHA 300 Log entry, if recordable, with correct classification (death, DART, other recordable).',
      'OSHA 300A Annual Summary if the incident occurred in the prior calendar year.',
      'Root-cause investigation record identifying the mechanical, procedural, human, and management factors.',
      'Assigned corrective actions with named owners, target dates, and evidence of closure.',
      'Employee training documentation on the corrective action, retraining records if applicable.',
      'Photograph or drawing of the incident location, condition, or equipment at time of investigation.',
      'Follow-up verification that the corrective action holds, walk-back or audit record 30 to 90 days after implementation.',
      'Medical records, workers-compensation first-report-of-injury filing, and any restricted-duty or lost-time documentation, if applicable.',
      'A named incident-response coordinator with an owner-of-record and phone or email contact.',
    ],
    disclaimer: INCIDENT_DISCLAIMER,
    updatedAt: 'Feb 2026 draft, awaiting owner approval',
  },
  'new-hire': {
    slug: 'new-hire',
    program: 'New Hire Orientation',
    title: 'New Hire Orientation First-Pull Checklist',
    subtitle: 'Nine records that show every new hire was trained on your safety expectations before touching production work.',
    intro:
      'The strongest defense against a new-hire injury citation is a documented orientation, delivered before the employee starts work, on the specific hazards of your operation. Nine items are typically requested first.',
    items: [
      'Written New Hire Safety Orientation program, dated, listing every topic covered.',
      'Signed acknowledgment from every new hire that orientation was completed before their first production shift.',
      'PPE issuance and fit records: safety glasses, hearing protection, gloves, footwear, respiratory (if required), signed by the employee.',
      'Task-specific hazard training records for the specific job the employee is being hired into.',
      'Emergency action training: alarm signals, egress routes, evacuation muster point, fire extinguisher use if authorized.',
      'HazCom introduction: chemicals on-site, container labels, SDS retrieval, secondary container labels.',
      'Machine-specific operator training records for every machine the employee will run in the first thirty days.',
      'Return-demonstration record: employee physically demonstrated the safe practice, not merely signed a form.',
      'Named orientation administrator or trainer, with signature and date on each new-hire packet, retained for the length of employment plus one year minimum, longer per OSHA record-retention rules per topic.',
    ],
    disclaimer: NEW_HIRE_DISCLAIMER,
    updatedAt: 'Feb 2026 draft, awaiting owner approval',
  },
};
