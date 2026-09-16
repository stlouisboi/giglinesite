/**
 * First-Pull Checklists, Phase 2 educational lead-magnet drafts (Batch 2A.1).
 *
 * Every item is classified as one of:
 *   - required          : a specific applicable OSHA standard mandates the record/practice
 *   - applicability     : required only when specific conditions apply (equipment class,
 *                          exposure, employer size, state OSH plan differences, etc.)
 *   - gigline           : GigLine readiness practice, not a universal federal OSHA requirement
 *
 * Voice: calm, factual, no fear framing, no guaranteed-compliance language.
 *
 * Primary sources cited by CFR paragraph. Federal OSHA text at 29 CFR Part 1910.
 * State OSH plans (including NC OSH) may impose additional requirements beyond the
 * federal baseline. Every item must be evaluated against the specific operation,
 * equipment, and workforce.
 *
 * NOT a legal opinion. NOT a compliance evaluation. Educational field guide only.
 *
 * Draft state gated behind FIRST_PULL_CHECKLISTS_ENABLED in config/features.js.
 */

const SHARED_DISCLAIMER =
  'This checklist is educational and lists records or evidence commonly useful during a compliance review. It is not a compliance evaluation, a legal opinion, or a substitute for a written program review or on-site walkthrough. Items are classified below as regulatory requirements, applicability-dependent requirements, or GigLine recommended readiness practices. Federal OSHA standards apply broadly; state OSH plans, including North Carolina OSH, may impose additional requirements. Every item must be evaluated against your specific operation, equipment, and workforce.';

export const FIRST_PULL_CHECKLISTS = {
  loto: {
    slug: 'loto',
    program: 'Lockout / Tagout',
    title: 'LOTO First-Pull Checklist',
    subtitle: 'Eight records or practices commonly useful during a Lockout/Tagout compliance review.',
    intro:
      'Lockout/Tagout is defined at 29 CFR 1910.147. The physical lockout event is only part of the picture; the written program, machine-specific procedures, employee training, and periodic inspection certification are the paper elements the standard actually requires. This checklist separates the specific standard-required items from GigLine readiness practices so an operator can see the difference at a glance.',
    items: [
      { text: 'Written Energy Control Program with procedures, techniques, and enforcement.', cite: '29 CFR 1910.147(c)(4)(i)', kind: 'required' },
      { text: 'Machine-specific written energy control procedures for each machine or piece of equipment where servicing or maintenance occurs (with limited single-source exception at 1910.147(c)(4)(i) Note).', cite: '29 CFR 1910.147(c)(4)(i) and (c)(4)(ii)', kind: 'required' },
      { text: 'Employee training records for authorized, affected, and other employees, plus retraining when duties change, machines change, procedures change, or an inspection reveals deviations.', cite: '29 CFR 1910.147(c)(7)(i) and (c)(7)(iv)', kind: 'required' },
      { text: 'Certification of periodic inspection of each energy control procedure at least annually, identifying the machine, the date, the employees included, and the person performing the inspection.', cite: '29 CFR 1910.147(c)(6)(ii)', kind: 'required' },
      { text: 'Locks and tags identifiable to a specific employee and not used for any other purpose.', cite: '29 CFR 1910.147(c)(5)(ii)', kind: 'required' },
      { text: 'Named LOTO program administrator or accountable owner with current contact information.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
      { text: 'Lock and tag issuance inventory tying each serial-numbered lock or personal tag to the assigned employee.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
      { text: 'Revision-number and dated-review controls on the written program document itself.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
    ],
    disclaimer: SHARED_DISCLAIMER,
    linkedKitSlug: 'loto-readiness-kit',
    updatedAt: 'September 2026 private draft',
  },
  'forklift-pit': {
    slug: 'forklift-pit',
    program: 'Forklift & Powered Industrial Trucks',
    title: 'Forklift & PIT First-Pull Checklist',
    subtitle: 'Nine records or practices commonly useful during a Powered Industrial Truck compliance review.',
    intro:
      'Powered Industrial Trucks are covered at 29 CFR 1910.178. Operator training, evaluation, and refresher triggers are specific to the standard. Battery, propane, and eyewash items depend on which trucks and fuels are actually in use. This checklist separates the required from the applicability-dependent from the GigLine readiness practices.',
    items: [
      { text: 'Operator training and evaluation records certifying each operator has been trained and evaluated to operate the specific type of truck they use, including operator name, date of training, date of evaluation, and identity of the evaluator.', cite: '29 CFR 1910.178(l)(6)', kind: 'required' },
      { text: 'Truck-type-specific training documentation for each truck class an operator is authorized to use, addressing 1910.178(l)(3) truck-related and workplace-related topics.', cite: '29 CFR 1910.178(l)(3)', kind: 'required' },
      { text: 'Refresher training when the operator has been observed operating unsafely, has been involved in an accident or near-miss, has received an evaluation revealing unsafe operation, is assigned a different type of truck, or when workplace conditions change.', cite: '29 CFR 1910.178(l)(4)(ii)', kind: 'required' },
      { text: 'Operator performance evaluation at least once every three years.', cite: '29 CFR 1910.178(l)(4)(iii)', kind: 'required' },
      { text: 'Powered industrial trucks examined at least daily before being placed in service, and vehicles used on a round-the-clock basis examined after each shift. Written records of examinations are a strong readiness practice; the standard requires the examination itself.', cite: '29 CFR 1910.178(q)(7); written-record retention is a GigLine practice unless another rule applies', kind: 'applicability' },
      { text: 'LP-fuel handling training and applicable storage requirements when the operation uses propane-powered trucks and operators change cylinders.', cite: '29 CFR 1910.110 and 1910.178(f); applicability-dependent', kind: 'applicability' },
      { text: 'Battery charging area controls, ventilation, eyewash, and PPE requirements when the operation uses electric trucks with lead-acid batteries.', cite: '29 CFR 1910.178(g) and 1910.151(c); applicability-dependent', kind: 'applicability' },
      { text: 'Truck maintenance records or documented preventive-maintenance cadence, plus removal from service of any truck found unsafe until restored.', cite: '29 CFR 1910.178(p) requires removal from service; documented PM cadence is a GigLine readiness practice unless another rule applies', kind: 'gigline' },
      { text: 'Named PIT program administrator, authorized-user roster posted or available on request.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
    ],
    disclaimer: SHARED_DISCLAIMER,
    linkedKitSlug: 'forklift-pit-readiness-kit',
    updatedAt: 'September 2026 private draft',
  },
  hazcom: {
    slug: 'hazcom',
    program: 'Hazard Communication',
    title: 'HazCom First-Pull Checklist',
    subtitle: 'Ten records or practices commonly useful during a Hazard Communication compliance review.',
    intro:
      'Hazard Communication is defined at 29 CFR 1910.1200. Written program, chemical list, SDS access, container labeling, and employee information/training are specific standard requirements. This checklist separates the required from the applicability-dependent from the GigLine readiness practices.',
    items: [
      { text: 'Written Hazard Communication program describing how the employer will meet the requirements for labels, safety data sheets, and employee information and training, and listing the hazardous chemicals known to be present.', cite: '29 CFR 1910.1200(e)(1)', kind: 'required' },
      { text: 'Employer-maintained list of the hazardous chemicals known to be present, referenced to the appropriate safety data sheet.', cite: '29 CFR 1910.1200(e)(1)(i)', kind: 'required' },
      { text: 'Safety data sheets for each hazardous chemical, readily accessible during each work shift to employees when they are in their work area(s).', cite: '29 CFR 1910.1200(g)(8)', kind: 'required' },
      { text: 'Employee information and training on the hazards of chemicals in the work area at the time of initial assignment and whenever a new chemical hazard is introduced, covering the elements specified at 1910.1200(h)(3).', cite: '29 CFR 1910.1200(h)(1) and (h)(3)', kind: 'required' },
      { text: 'Labels on shipped containers with product identifier, signal word, hazard statement(s), pictogram(s), precautionary statement(s), and supplier identification. Workplace containers labeled with product identifier and words, pictures, symbols, or a combination that provide general information regarding the hazards.', cite: '29 CFR 1910.1200(f)(1) and (f)(6)', kind: 'required' },
      { text: 'Portable-container exception. Labels are not required on portable containers into which hazardous chemicals are transferred from labeled containers and which are intended only for the immediate use of the employee who performs the transfer.', cite: '29 CFR 1910.1200(f)(8); applicability-dependent', kind: 'applicability' },
      { text: 'Non-routine task hazard communication procedure when employees perform non-routine tasks with hazardous chemicals.', cite: '29 CFR 1910.1200(e)(1)(ii)', kind: 'required' },
      { text: 'Multi-employer worksite information exchange when contractor employees may be exposed to the operation\u2019s hazardous chemicals.', cite: '29 CFR 1910.1200(e)(2)', kind: 'applicability' },
      { text: 'GigLine readiness test: Safety Data Sheets retrievable within three minutes at every work location, plus a current chemical inventory reviewed on a defined schedule. Retrieval speed is a GigLine benchmark, not an OSHA deadline. The standard requires SDSs to be readily accessible during each work shift.', cite: 'GigLine readiness practice built on 29 CFR 1910.1200(g)(8)', kind: 'gigline' },
      { text: 'Named HazCom program administrator, revision-number and dated-review controls on the written program document itself.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
    ],
    disclaimer: SHARED_DISCLAIMER,
    linkedKitSlug: 'hazcom-pro-kit',
    updatedAt: 'September 2026 private draft',
  },
  incident: {
    slug: 'incident',
    program: 'Incident to Correction',
    title: 'Incident-to-Correction First-Pull Checklist',
    subtitle: 'Records and practices commonly useful during a post-incident compliance review.',
    intro:
      'Incident recording and reporting are governed by 29 CFR Part 1904. Not every employer or every incident triggers every record. Partial-exemption categories (employer size and industry classification) alter the OSHA 300/301/300A requirements. Severe-injury reporting has specific timing. Everything else in the post-incident file, root-cause analysis, corrective-action tracking, follow-up verification, is a GigLine readiness practice unless another specific standard applies.',
    items: [
      { text: 'OSHA Form 301 Injury and Illness Incident Report (or an equivalent form) completed within seven calendar days after receiving information that a recordable injury or illness has occurred. Non-exempt employers only.', cite: '29 CFR 1904.29(b)(3); partial exemption at 1904.1 and 1904.2', kind: 'applicability' },
      { text: 'OSHA Form 300 Log of Work-Related Injuries and Illnesses entry within seven calendar days after receiving information that a recordable injury or illness has occurred. Non-exempt employers only.', cite: '29 CFR 1904.29(b)(3); partial exemption at 1904.1 and 1904.2', kind: 'applicability' },
      { text: 'OSHA Form 300A Summary of Work-Related Injuries and Illnesses posted from February 1 through April 30 of each year for the previous calendar year. Non-exempt employers only.', cite: '29 CFR 1904.32(b)(6); partial exemption at 1904.1 and 1904.2', kind: 'applicability' },
      { text: 'Report a fatality to OSHA within eight hours. Report an in-patient hospitalization, amputation, or loss of an eye within twenty-four hours.', cite: '29 CFR 1904.39(a) and (b)', kind: 'required' },
      { text: 'Retain OSHA 300 log, 301 incident reports, and 300A annual summary for five years following the end of the calendar year the records cover. Non-exempt employers only.', cite: '29 CFR 1904.33', kind: 'applicability' },
      { text: 'Internal employee incident or near-miss report with witness statements, capturing what happened, where, when, and who was involved.', cite: 'GigLine readiness practice, not a specific universal CFR requirement', kind: 'gigline' },
      { text: 'Root-cause investigation identifying mechanical, procedural, human, and management factors.', cite: 'GigLine readiness practice, not a specific universal CFR requirement', kind: 'gigline' },
      { text: 'Corrective actions assigned to a named owner with a target date and evidence of closure.', cite: 'GigLine readiness practice, not a specific universal CFR requirement', kind: 'gigline' },
      { text: 'Follow-up verification that the corrective action holds, walk-back or audit record on a defined interval after implementation.', cite: 'GigLine readiness practice, not a specific universal CFR requirement', kind: 'gigline' },
      { text: 'Handle medical information as confidential. Restrict access, redact PII from files shared beyond the treating professional and the employer\u2019s designated point of contact, and comply with any applicable HIPAA, ADA, or state confidentiality rules. Do not collect medical detail beyond what is necessary for the recordkeeping and treatment purpose.', cite: '29 CFR 1904.29(b)(6) through (b)(10) address privacy for specific categories; broader confidentiality is a GigLine practice built on privacy law', kind: 'gigline' },
      { text: 'Named incident-response coordinator with a defined reporting channel available to every employee.', cite: 'GigLine readiness practice, not a specific CFR requirement', kind: 'gigline' },
    ],
    disclaimer: SHARED_DISCLAIMER + ' The incident-response items below assume the incident is stable and no active injury or emergency is in progress. Call 911 first when appropriate.',
    linkedKitSlug: 'incident-to-correction-kit',
    updatedAt: 'September 2026 private draft',
  },
  'new-hire': {
    slug: 'new-hire',
    program: 'New Hire Orientation',
    title: 'New Hire Orientation First-Pull Checklist',
    subtitle: 'Records and practices commonly useful during a review of new-hire safety training.',
    intro:
      'Federal OSHA does not universally require a single written New Hire Safety Orientation program. Training obligations depend on the specific hazards the employee will be exposed to, the specific equipment they will operate, and the specific standards that apply to those hazards. This checklist separates the equipment- or exposure-triggered training requirements from GigLine readiness practices.',
    items: [
      { text: 'Hazard Communication information and training at the time of initial assignment.', cite: '29 CFR 1910.1200(h)(1)', kind: 'required' },
      { text: 'PIT operator training and evaluation before the employee operates a powered industrial truck independently, when applicable.', cite: '29 CFR 1910.178(l)(1) and (l)(6); applicability-dependent', kind: 'applicability' },
      { text: 'LOTO training as an authorized, affected, or other employee before the employee performs or is affected by servicing or maintenance under a LOTO scope, when applicable.', cite: '29 CFR 1910.147(c)(7)(i); applicability-dependent', kind: 'applicability' },
      { text: 'Respiratory protection medical evaluation and fit testing before an employee is required to use a respirator, plus training on selection, use, and maintenance, when applicable.', cite: '29 CFR 1910.134(e), (f), and (k); applicability-dependent', kind: 'applicability' },
      { text: 'Bloodborne Pathogens training at the time of initial assignment to tasks where occupational exposure may take place, when applicable.', cite: '29 CFR 1910.1030(g)(2); applicability-dependent', kind: 'applicability' },
      { text: 'PPE hazard assessment, employee training, and issuance records specific to each hazard and PPE type the employee will use, when the employer determines PPE is required.', cite: '29 CFR 1910.132(d), (f), and 1910.133 through 1910.140', kind: 'required' },
      { text: 'Emergency Action Plan training so employees know actions to take before evacuation and how to shut down critical operations, when the standard requires a written EAP or where an EAP is otherwise established.', cite: '29 CFR 1910.38 and 1910.157(e); applicability-dependent', kind: 'applicability' },
      { text: 'GigLine readiness practice: a written New Hire Safety Orientation packet covering the topics that apply to the specific role, signed acknowledgment retained per each standard\u2019s retention rule, and a return-demonstration record for skill-based safety tasks. Retention periods vary by standard, there is no universal federal OSHA \u201cemployment plus one year\u201d rule.', cite: 'GigLine readiness practice built on the applicable training standards above', kind: 'gigline' },
      { text: 'GigLine readiness practice: named orientation trainer or supervisor, dated signature on each new-hire packet, with each specific record retained for the retention period defined by the standard that requires it.', cite: 'GigLine readiness practice, retention rules vary by standard', kind: 'gigline' },
    ],
    disclaimer: SHARED_DISCLAIMER,
    linkedKitSlug: 'new-hire-orientation-kit',
    updatedAt: 'September 2026 private draft',
  },
};
