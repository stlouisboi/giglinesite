import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Download, Check } from 'lucide-react';
import { trackPDFDownload } from '../utils/analytics';
import SEO from '../components/SEO';
import FieldNotesNewsletter from '../components/FieldNotesNewsletter';

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Map each Field Note slug to the 1–2 most relevant service pages.
 * Drives the "Service that handles this on the floor" callout near the bottom of each article.
 * Adding a new article? Add an entry here so the cross-link block renders.
 */
const SERVICE_LINKS_BY_SLUG = {
  'heat-stress': [
    { title: 'Safety Walkthrough', body: 'On-site review of heat-exposure tasks, controls, and your HIIPP in action.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Written HIIPP, daily heat check, and training records that match your operation.', to: '/services/document-development' },
  ],
  'forklift-safety': [
    { title: 'Safety Walkthrough', body: 'On-floor review of forklift traffic, pedestrian separation, and pre-shift inspection practice.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Operator certifications, evaluation records, and pre-shift checklists that satisfy 1910.178(l).', to: '/services/document-development' },
  ],
  'electrical-safety': [
    { title: 'Safety Walkthrough', body: 'Panel access, GFCI coverage, cord management, and Subpart S compliance checked on the floor.', to: '/services/safety-walkthrough' },
    { title: 'Incident Review', body: 'For shock events, near-miss arc flash, or any electrical incident: documented root cause and corrective action.', to: '/services/incident-review' },
  ],
  'hazcom': [
    { title: 'Document Development', body: 'Written HazCom program, container labels, SDS index, and training records for the most-cited OSHA standard.', to: '/services/document-development' },
    { title: 'Compliance Readiness Visit', body: 'Floor + files in a single visit — confirms your HazCom system actually matches the chemicals on site.', to: '/services/compliance-readiness-visit' },
  ],
  'machine-guarding': [
    { title: 'Safety Walkthrough', body: 'Every guarded point of operation checked against 1910.212 and the equipment-specific standards.', to: '/services/safety-walkthrough' },
  ],
  'walking-surfaces': [
    { title: 'Safety Walkthrough', body: 'Floor condition, housekeeping, slip/trip hazards, and Subpart D compliance documented with photos.', to: '/services/safety-walkthrough' },
  ],
  'lockout-tagout': [
    { title: 'Document Development', body: 'Written LOTO program, machine-specific procedures, periodic inspection records, and training documentation.', to: '/services/document-development' },
    { title: 'Safety Walkthrough', body: 'On-the-floor verification that LOTO devices are present, accessible, and being used.', to: '/services/safety-walkthrough' },
  ],
  'emergency-action-plans': [
    { title: 'Document Development', body: 'Written EAP, evacuation diagrams, alarm-system documentation, and drill records to satisfy 1910.38.', to: '/services/document-development' },
  ],
  'ppe-assessment': [
    { title: 'Document Development', body: 'Written PPE hazard assessment certification — the first citation under 1910.132 when missing.', to: '/services/document-development' },
  ],
  'fall-protection': [
    { title: 'Safety Walkthrough', body: 'Every 4-foot+ exposure, anchor point, and elevated walking surface checked against Subpart D.', to: '/services/safety-walkthrough' },
  ],
  'confined-space': [
    { title: 'Document Development', body: 'Written permit-required program, entry permits, and rescue plan that satisfies 1910.146.', to: '/services/document-development' },
    { title: 'Safety Walkthrough', body: 'Every confined space on site identified, classified, and signed per the standard.', to: '/services/safety-walkthrough' },
  ],
  'scaffolding-safety': [
    { title: 'Safety Walkthrough', body: 'Erection, inspection, and use practices reviewed against 1926.451 — competent person verification on site.', to: '/services/safety-walkthrough' },
  ],
  'hearing-conservation': [
    { title: 'Document Development', body: 'Written hearing conservation program, audiogram records, and noise exposure assessments per 1910.95.', to: '/services/document-development' },
  ],
  'bloodborne-pathogens': [
    { title: 'Document Development', body: 'Written exposure control plan, hepatitis B vaccination records, and training documentation per 1910.1030.', to: '/services/document-development' },
  ],
  'ai-generated-safety-programs': [
    { title: 'Document Development', body: 'Written programs built around your equipment and chemicals — not AI templates that name a different operation.', to: '/services/document-development' },
  ],
  'recordkeeping-300-log': [
    { title: 'Compliance Readiness Visit', body: '300 Log, 300A summary, and severe-injury reporting practice all reviewed in a single visit.', to: '/services/compliance-readiness-visit' },
    { title: 'Document Development', body: 'Recordable-injury decision tree and 300/300A maintenance procedure built for your operation.', to: '/services/document-development' },
  ],
  'respiratory-protection': [
    { title: 'Document Development', body: 'Written respiratory protection program, medical evaluation, fit testing, and training records per 1910.134.', to: '/services/document-development' },
  ],
  'silica-respirable-crystalline': [
    { title: 'Compliance Readiness Visit', body: 'Exposure assessment, written exposure control plan, and medical surveillance review for stone/concrete operations.', to: '/services/compliance-readiness-visit' },
    { title: 'Document Development', body: 'Written silica exposure control plan tailored to the tasks and materials on your floor.', to: '/services/document-development' },
  ],
  'hot-work-welding': [
    { title: 'Safety Walkthrough', body: 'Hot-work area designation, fire watch practice, cylinder storage, and Subpart Q compliance checked on site.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Written hot work permit program (NFPA 51B-based) that insurance carriers and customers accept.', to: '/services/document-development' },
  ],
  'abrasive-wheels': [
    { title: 'Safety Walkthrough', body: 'Every grinder in the shop checked against the 1/8" work rest and 1/4" tongue-guard standards under 1910.215.', to: '/services/safety-walkthrough' },
  ],
  'ladder-safety': [
    { title: 'Safety Walkthrough', body: 'Every portable ladder on site inspected against 1910.23 — damaged ladders tagged out before OSHA does it for you.', to: '/services/safety-walkthrough' },
  ],
  'eye-face-protection': [
    { title: 'Document Development', body: 'Written PPE hazard assessment certification per 1910.132 — the first citation when missing.', to: '/services/document-development' },
  ],
  'trenching-excavation': [
    { title: 'Safety Walkthrough', body: 'Protective systems, competent-person inspection, soil classification, and egress reviewed against Subpart P.', to: '/services/safety-walkthrough' },
  ],
  'cranes-rigging': [
    { title: 'Safety Walkthrough', body: 'Daily/annual inspection practice, sling condition, capacity marking, and operator authorization checked on site.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Annual inspection logs, operator training records, and rigging gear inspection procedures.', to: '/services/document-development' },
  ],
  'nc-osha-vs-federal': [
    { title: 'Compliance Readiness Visit', body: 'Practitioner walkthrough framed against NC State Plan enforcement reality — not federal-OSHA-only theory.', to: '/services/compliance-readiness-visit' },
  ],
};

/* ── Field Note content database ── */
const NOTES = {
  'heat-stress': {
    title: 'Heat Stress',
    subtitle: 'What Actually Matters on the Floor',
    seo: 'Heat stress safety for small operations. What gets missed, what OSHA looks for, and what to do about it.',
    cfrCitation: 'OSHA General Duty Clause — Section 5(a)(1) · OSHA NEP CPL 03-00-024 (Heat Hazard NEP)',
    download: {
      title: '2026 Heat Stress Action Template',
      description: 'A printable checklist and action plan for managing heat stress on the floor. Built for small operations.',
      image: '/GL_Heat_Stress_Mockup_Web.png',
      endpoint: '/api/heat-guide/submit',
    },
    oshaChecks: [
      'Written heat illness prevention plan (HIPP) tailored to your facility and shift schedule',
      'Documented acclimatization protocol for new and returning workers — first 5 days',
      'Drinking water within 50 feet of work areas, kept cool, replenished throughout shift',
      'Shaded or air-conditioned cool-down area accessible during all working hours',
      'Supervisors trained to recognize early symptoms of heat illness — documented training records',
      'Buddy system or check-in procedure when single workers operate in high-heat zones',
    ],
    faqSchema: [
      { question: 'Does OSHA have a specific heat stress standard?', answer: 'No. There is no dedicated OSHA heat stress standard yet — but heat illness is enforced under the General Duty Clause Section 5(a)(1). OSHA also runs a National Emphasis Program (NEP CPL 03-00-024) that triggers inspections when indoor temperatures exceed 80°F. A federal heat-specific rule is currently in rulemaking.' },
      { question: 'When does OSHA expect a heat illness prevention plan?', answer: 'Any time workers are exposed to indoor or outdoor heat conditions that could lead to heat illness — generally above 80°F heat index for sustained work. Small manufacturers and warehouses without HVAC almost always meet this threshold during NC summer months.' },
      { question: 'What\'s an acclimatization plan and is it required?', answer: 'Acclimatization is gradually exposing new or returning workers (after vacation/leave of 7+ days) to high-heat conditions over 5 working days. OSHA expects this under the General Duty Clause. Most documented heat fatalities involve workers in their first three days on the job.' },
    ],
    relatedNotes: ['walking-surfaces', 'ppe-assessment', 'recordkeeping-300-log'],
    sections: {
      whatItIs: `Heat stress happens when the body can't cool itself fast enough. In warehouses, manufacturing floors, and outdoor operations across North Carolina, it shows up faster than most operators expect — especially during May through September in enclosed spaces with limited ventilation, near presses, ovens, or any hot process.

OSHA does not have a dedicated heat stress standard yet. Heat illness is enforced under the General Duty Clause, Section 5(a)(1), which says every employer must keep the workplace free of recognized hazards likely to cause death or serious physical harm. OSHA also runs a Heat Hazard National Emphasis Program (NEP CPL 03-00-024) — when temperatures cross 80°F indoor or outdoor, an inspector can open a heat-focused inspection on the spot. A federal heat-specific rule is in rulemaking and likely to land within the next 18 months. Anything you build now will only get more important, not less.

The most common citations I see written under the General Duty Clause for heat stress involve four failures: no written prevention plan, no acclimatization procedure for new or returning workers, water stations placed too far from active work zones, and supervisors who can't name the early symptoms of heat exhaustion. These are exactly the items an OSHA Compliance Officer asks about when they walk in on a hot day.

When an inspector arrives, they'll ask to see the written heat illness prevention plan — and they'll ask the floor supervisor to describe it from memory. They'll measure the distance from the work area to the nearest water source. They'll check whether water is cool. They'll ask new hires how their first week was structured and whether anyone explained the acclimatization period. They'll ask supervisors what they watch for, and they'll talk to workers about whether anyone has called for breaks based on temperature.

The fix isn't expensive. A written Heat Illness Prevention Plan, customized to your facility and shift schedule, takes about an hour to draft. Moving water stations closer to active work zones is a $40 cooler purchase and a labor reassignment. Acclimatization is a scheduling change — new hires work 20% of normal duration on Day 1, 40% on Day 2, and step up to full duration by Day 5. Training supervisors to recognize symptoms (excessive sweating that stops, confusion, nausea, hot dry skin) is a 30-minute toolbox talk you document with a sign-in sheet. None of this requires hiring a consultant — but if any of it is missing when OSHA shows up under the NEP, expect a written citation.`,
      whatGetsMissed: [
        'No written heat illness prevention plan',
        'Water stations more than 50 feet from active work areas',
        'No acclimatization plan for new or returning workers',
        'Break schedules not adjusted as temperature rises',
        'Supervisors untrained on early warning signs',
        'No documented cool-down area or shade structure',
      ],
      whatISee: 'I walk into facilities in July where the floor temperature is 15–20 degrees hotter than the office. Workers are sweating through shirts by 10 AM. There\'s a water cooler by the break room — 200 feet from the press line. Nobody has been trained on what to watch for, and the new hire started Monday in full PPE without an acclimatization period. The written plan, if it exists, is a template downloaded years ago with another company\'s name still in it.',
      checklist: [
        'Written heat illness prevention plan in place and customized to facility',
        'Water available within 50 feet of all work areas, kept cool',
        'Acclimatization plan for new and returning workers — 5-day step-up',
        'Break frequency increases automatically with temperature',
        'Supervisors trained on heat illness recognition — training documented',
        'Buddy system or check-in protocol in place for high-heat zones',
        'Cool-down area accessible, shaded, and stocked with water',
        'Heat illness incident response procedure posted and trained',
      ],
    },
  },
  'forklift-safety': {
    title: 'Forklift Safety & Daily Inspections',
    subtitle: 'Beyond the Certification Card',
    seo: 'OSHA forklift inspection requirements for small operations in NC. Daily pre-shift checklists, operator certification, and pedestrian separation — what gets cited.',
    cfrCitation: '29 CFR 1910.178',
    oshaChecks: [
      'Operator certification records — initial training, evaluation, and 3-year refresher',
      'Daily pre-shift inspection documentation',
      'Pedestrian separation — marked walkways and traffic management',
      'Seatbelt use and enforcement',
      'Load capacity charts visible on each unit',
    ],
    faqSchema: [
      { question: 'How often do forklift operators need to be recertified under OSHA?', answer: 'OSHA requires forklift operator evaluation at least every three years under 29 CFR 1910.178(l)(4)(iii). Re-evaluation is also required after an accident, near-miss, or observed unsafe operation.' },
      { question: 'Are daily forklift inspections required by OSHA?', answer: 'Yes. 29 CFR 1910.178(q)(7) requires that industrial trucks be examined before being placed in service. Daily pre-shift inspections must be documented with a written checklist.' },
      { question: 'What is the most common forklift violation cited by OSHA?', answer: 'The most common forklift violations involve incomplete or missing operator training documentation, lack of daily pre-shift inspection records, and failure to maintain pedestrian separation in high-traffic areas.' },
    ],
    relatedNotes: ['walking-surfaces', 'lockout-tagout', 'ppe-assessment'],
    sections: {
      whatItIs: `Forklift safety is more than a certification card. OSHA's standard for Powered Industrial Trucks — 29 CFR 1910.178 — covers operator training and evaluation, daily pre-shift inspections, pedestrian separation, load capacity, and refueling/charging procedures. Most operations have the laminated training card from when the operator started years ago. The daily practices that go with it have usually slipped.

The most-cited subsection year after year is 1910.178(l) — operator training, evaluation, and re-evaluation. OSHA requires initial training, a hands-on evaluation, and re-evaluation at least every three years. Re-evaluation is also required after an accident, observed near-miss, or any incident that suggests the operator isn't operating safely. Most small operations train once on hire and forget. Three years go by, and the operator is now technically uncertified — a citable condition the moment OSHA walks in.

The second most-cited subsection is 1910.178(q)(7) — daily pre-shift inspections. The inspection itself is a 5-minute walkaround: tires, forks, mast chains, hydraulic lines, horn, lights, seatbelt, fluid leaks. The hard part is documentation. OSHA wants to see the written log. A blank checklist or one that hasn't been signed in three weeks is the same as no inspection at all. In small operations I walk into, the inspection sheet is either missing entirely or is a stack on the manager's desk dated for "every shift" but only signed when an audit is coming.

Beyond training and inspections, pedestrian separation is the silent killer. Forklift accidents kill about 85 workers a year in the US — most are pedestrians struck or pinned. OSHA expects to see marked pedestrian walkways, mirrors at blind corners, audible alarms on reverse, and a documented traffic management plan in operations where forklifts and pedestrians share aisles. In Triad-area warehouses I've walked through, painted aisles have faded to invisible and operators routinely cross through pedestrian zones at full travel speed.

Corrective action is straightforward. Re-evaluate every operator on the floor right now if it's been three years — schedule a half-day, run them through a hands-on, document and file. Print pre-shift inspection logs in triplicate so the operator can leave one on the truck, one in the inspection binder, and one with the supervisor on shift change. Repaint pedestrian aisles if they've faded. Install a mirror at every blind corner. Brief operators on the speed-limit-near-intersections rule. Document everything you do — OSHA's first question on inspection day is "show me the records."`,
      whatGetsMissed: [
        'Daily pre-shift inspections not documented',
        'No pedestrian separation plan in high-traffic areas',
        'Operators trained once, never re-evaluated',
        'Seatbelts not worn consistently',
        'Speed not controlled near intersections or docks',
      ],
      whatISee: 'I see operators who were certified three years ago and haven\'t been re-evaluated since. Pre-shift checklists are blank or don\'t exist. Pedestrians walk through forklift lanes without a second thought. Seatbelts are tucked behind seats. When I ask about the inspection log, it\'s either missing or hasn\'t been filled out in weeks.',
      checklist: [
        'Operator certification current (every 3 years or after incident)',
        'Daily pre-shift inspection forms completed and filed',
        'Pedestrian walkways clearly marked and separated',
        'Seatbelt use enforced and observed',
        'Speed limits posted and enforced in high-traffic zones',
        'Blind intersections have mirrors or warning systems',
        'Load capacity charts visible on each unit',
      ],
    },
  },
  'electrical-safety': {
    title: 'Electrical Safety & Arc Flash',
    subtitle: 'The Panel Nobody Can Reach',
    seo: 'OSHA electrical safety for small manufacturing in the Piedmont Triad NC. Panel clearance, arc flash, lockout-tagout — what gets cited and how to fix it.',
    cfrCitation: '29 CFR 1910.303 / NFPA 70E',
    oshaChecks: [
      'Electrical panel clearance — 36 inches minimum on all sides',
      'Panel directories current and legible',
      'Arc flash hazard labels on all panels and switchgear',
      'Lockout-tagout procedures posted for electrical maintenance',
      'Qualified vs. unqualified worker boundaries established',
    ],
    faqSchema: [
      { question: 'What is the OSHA clearance requirement for electrical panels?', answer: 'OSHA requires a minimum of 36 inches of clear space in front of all electrical panels per 29 CFR 1910.303(g)(1). The area must be free of storage, equipment, and product at all times.' },
      { question: 'Do small manufacturers need arc flash labels?', answer: 'Yes. NFPA 70E requires arc flash hazard labels on all electrical equipment likely to require examination, adjustment, servicing, or maintenance while energized. This applies to operations of all sizes.' },
      { question: 'What happens if an electrical panel is blocked during an OSHA inspection?', answer: 'Blocked electrical panels are one of the most frequently cited OSHA violations. Citations under 29 CFR 1910.303 can result in penalties starting at $16,550 per violation.' },
    ],
    relatedNotes: ['lockout-tagout', 'machine-guarding', 'ppe-assessment'],
    sections: {
      whatItIs: `Electrical panels in your facility are governed by two overlapping requirements: OSHA's general industry electrical standards under 29 CFR 1910 Subpart S (specifically 1910.303 for general requirements and 1910.305 for wiring methods), and NFPA 70E — the National Electrical Code's safety standard for the workplace. OSHA enforces NFPA 70E by reference under the General Duty Clause. In practical terms: both apply, and OSHA will cite under whichever fits the violation best.

The single most common citation in this category is 1910.303(g)(1) — working space around electrical equipment. The rule requires 36 inches of clear, depth-wise space in front of any panel rated 600V or less, with the clearance extending the full width and height of the equipment. The space must be accessible at all times. "At all times" means right now, not after you move the pallet that's been there for three weeks. Inspectors don't ask if you can clear it — they look at what's there when they walk in.

The second issue is panel directory accuracy and labeling. 1910.303(f) requires every disconnect, every breaker, every circuit to be legibly marked with what it controls. In small shops, panel directories are usually outdated by years — "Air Compressor" still listed where the printer now lives. When OSHA asks "kill power to the press line," nobody knows which breaker to flip. That's a citation and a safety problem at the same time.

Arc flash is the third area, governed by NFPA 70E Article 130. Every piece of electrical equipment likely to require examination, adjustment, servicing, or maintenance while energized must carry an arc flash hazard label showing incident energy and required PPE category. Most small operations have zero labels. The fix is an arc flash hazard analysis (a few hours of work by a qualified electrical contractor) followed by printed labels affixed to each panel.

What an OSHA Compliance Officer checks during an electrical-focused visit: clearance in front of every panel (with a measuring tape, not a guess), panel doors closed and intact, directory legibility, arc flash labels present, and lockout-tagout procedures posted for electrical maintenance work. They'll ask qualified vs. unqualified worker boundaries — under NFPA 70E, only "qualified persons" (formally trained and documented) may work on or near energized parts. Most small shops let any electrician on the maintenance team work on energized equipment with no documented qualification training. That's a separate citation.

Corrective action: photograph every panel in your facility today. Mark the floor with yellow tape showing the 36-inch clearance zone. Re-do the panel directories — print them, laminate them, mount them inside the door. Schedule an arc flash analysis with a qualified electrical contractor (cost: $2,000–$4,000 for a small facility, one-time). Build or buy lockout-tagout procedures specific to each piece of equipment. Document qualified person training. None of this is fast, but none of it is hard either — and missing any of it on inspection day will produce a citation that starts at $16,550.`,
      whatGetsMissed: [
        'Panels blocked by inventory or equipment',
        'Clearance zone not marked on the floor',
        'Panel doors missing or damaged',
        'Labels inside panel faded or incorrect',
        'No arc flash hazard labels on panels or switchgear',
        'No lockout-tagout procedures for electrical maintenance',
      ],
      whatISee: 'In almost every facility I walk into, at least one electrical panel is partially blocked. The most common offender is a pallet leaned against the wall "temporarily." I\'ve seen panels behind shelving units that can\'t be accessed without moving product. The floor isn\'t marked, and when I ask how they\'d shut power in an emergency, the answer is usually "we\'d figure it out." Arc flash labels are missing entirely in most small shops — and nobody has been trained on approach boundaries.',
      checklist: [
        '36-inch clearance maintained on all sides of panels',
        'Floor markings indicate clearance zone',
        'All panel doors intact and closeable',
        'Panel directories current and legible',
        'Arc flash hazard labels on all panels and switchgear',
        'Lockout-tagout procedures posted and trained',
        'No storage or equipment within clearance zone',
        'Emergency shutoff locations known by all shift leads',
      ],
    },
  },
  'hazcom': {
    title: 'HazCom & SDS',
    subtitle: 'The #1 OSHA Citation',
    seo: 'Hazard Communication compliance for small businesses. Written programs, SDS management, labeling, and training requirements.',
    cfrCitation: '29 CFR 1910.1200 (Hazard Communication Standard) · OSHA Top-Cited Violation, General Industry',
    kitCrossSell: {
      headline: 'The HazCom program — already written.',
      intro: 'The three HazCom-anchor documents from the GigLine Supervisor Safety Starter System are the exact forms OSHA expects when they ask for your written program. CFR-cited. Customizable. Print-ready. $600 for the digital kit, included free with every Compliance Readiness Visit.',
      cards: [
        { num: '04', label: 'Written HazCom Program', body: 'Your 1910.1200(e) required written program. Customize the company name, sign it, file it. The single document most operations get cited for missing.' },
        { num: '02', label: 'Chemical Inventory Log', body: 'Every chemical on site, line by line. The basis for your SDS index and the document an inspector asks for first.' },
        { num: '03', label: 'SDS Index & Binder Log', body: 'Track which SDS lives where. No more "the binder is in here somewhere" when OSHA asks where the safety data sheet for the solvent on the loading dock is.' },
      ],
    },
    oshaChecks: [
      'Written Hazard Communication program customized to your facility — not a generic template',
      'Safety Data Sheet (SDS) for every hazardous chemical on site',
      'SDS accessible to all employees during every shift — paper binder, intranet, or QR code',
      'All primary AND secondary containers labeled with product name and pictograms',
      'Documented employee training — initial and ongoing — with sign-in sheets',
      'Chemical inventory list current and complete — including occasional-use chemicals',
    ],
    faqSchema: [
      { question: 'Is Hazard Communication (HazCom) really OSHA\'s most cited standard?', answer: 'Yes. 29 CFR 1910.1200 has been the most-cited or second-most-cited general industry standard for over a decade. It is also one of the most achievable to fix — most of the work is documentation, not capital expense.' },
      { question: 'Do I need a written HazCom program for a 5-person shop?', answer: 'Yes. The standard applies to any employer with hazardous chemicals in the workplace, regardless of headcount. The only exemption is for sealed consumer-packaged products used in the same way a household consumer would use them.' },
      { question: 'What is a secondary container and why does it matter?', answer: 'A secondary container is any container you fill from the original — a spray bottle, a small jug poured from a 55-gallon drum, even a bucket of mixed cleaner. Every secondary container must be labeled with the product name and hazard information unless it is used by one employee in one shift. Missing secondary container labels are one of the most common HazCom citations.' },
    ],
    relatedNotes: ['ppe-assessment', 'machine-guarding', 'respiratory-protection'],
    sections: {
      whatItIs: `Hazard Communication is OSHA's most-cited general industry standard. Year after year. 29 CFR 1910.1200 — also called HazCom or the "Employee Right-to-Know" standard — is also one of the most achievable to fix, which makes the citation rate even more frustrating. Almost every HazCom citation in a small operation is preventable with a few hours of organized paperwork.

The standard has five pillars, and OSHA checks every one: a written HazCom program, a complete and accessible Safety Data Sheet (SDS) library, proper container labeling, employee training, and a current chemical inventory list. Miss any pillar and you can be cited. Miss multiple pillars and the citation count multiplies fast.

The most common citation I see in small operations is missing or inadequate secondary container labels — under 1910.1200(f)(6). A secondary container is anything you transfer chemical into from the original — a spray bottle, a bucket of mixed cleaner, a small jug from a 55-gallon drum. These need labels showing product name and hazard pictograms. The only exception is single-shift, single-user containers. In practice, every facility has unlabeled spray bottles in a closet somewhere. OSHA finds them in three minutes.

The second most common is the written program itself. 1910.1200(e) requires a written program tailored to your operation — not a generic template downloaded years ago with another company's name still in the header. The program has to describe how YOU handle chemical hazard communication: where the SDS library lives, how new chemicals get added, how employees access the data, who's responsible. A template that doesn't reflect your actual procedures is treated as no program at all.

Third is training. 1910.1200(h) requires that every employee with potential chemical exposure receive training on hazards, label reading, SDS access, and your written program. Training must be documented — date, topics covered, attendee names. "We talked about it in our morning meeting once" is not training. OSHA wants a sign-in sheet and a topic outline. Refresher training is required when new chemicals are introduced.

What OSHA looks for during a HazCom inspection: they'll walk to a random shelf and pick up the first chemical container they see — does it have a label with product name and pictograms? They'll ask any random employee where the SDS library is located and watch them find it. They'll review the written program and check whether it actually matches what they observe on the floor. They'll review training records and pull names of recent hires to verify training was completed within 30 days. The chemical inventory list will be checked against what they physically see in the shop.

Corrective action: buy a label-maker and a set of GHS pictogram stickers ($60 total). Audit every spray bottle, jug, and bucket on the floor. Replace your generic HazCom program with one specific to your facility — list your chemicals by location, identify your trainer, name your program coordinator. Build (or rebuild) your SDS library — use a free service like ChemTel or buy access to Verisk 3E. Print a chemical inventory list and walk the floor with it, adding every chemical you find. Run a 1-hour all-hands training session, document it with a sign-in sheet, file the sheet. Total fix time: about 8 hours of focused work. Total cost: under $200.`,
      whatGetsMissed: [
        'No written HazCom program (or generic template never customized)',
        'SDS binder incomplete, outdated, or inaccessible',
        'Secondary containers (spray bottles, buckets, jugs) missing labels',
        'New chemicals added without updating SDS or inventory',
        'Training not documented or not specific to site chemicals',
        'Chemical inventory list missing or never updated',
      ],
      whatISee: 'I find spray bottles with no labels, cleaning chemicals under sinks with no SDS, and "the binder" in a manager\'s office that hasn\'t been updated since 2019. Workers know they use chemicals — they don\'t know what\'s in them or where the data sheets are. The written program, if it exists, is a template downloaded and never customized — sometimes still has the original consultant\'s company name in the header.',
      checklist: [
        'Written HazCom program specific to your operation',
        'SDS available for every chemical on site (paper, intranet, or QR code)',
        'SDS accessible to all employees during every shift',
        'All containers — including secondary — properly labeled',
        'Employee training documented with dates and names',
        'Refresher training when new chemicals are introduced',
        'New chemical review process in place',
        'Chemical inventory list current and complete',
        'Designated HazCom program coordinator named in the written program',
      ],
    },
  },
  'machine-guarding': {
    title: 'Machine Guarding',
    subtitle: 'When the Guard Gets Removed',
    seo: 'OSHA machine guarding compliance for small manufacturers in the Piedmont Triad NC. Point of operation guards, nip points, interlocks, and the citations that follow when guards come off and stay off.',
    cfrCitation: '29 CFR 1910.212 / 1910.219',
    oshaChecks: [
      'Guards at every point of operation, nip point, ingoing nip, and rotating shaft or pulley',
      'Guards permanently affixed and not easily removable without tools',
      'Interlocks tested and functional — equipment stops when guard is opened',
      'Written machine guarding hazard assessment on file',
      'Operators trained on guard purpose, function, and removal/replacement procedures',
      'Post-maintenance guard verification step in every LOTO or service procedure',
    ],
    faqSchema: [
      { question: 'What does OSHA require for machine guards?', answer: 'Under 29 CFR 1910.212, machine guards must be affixed to the machine and unable to be easily removed; they must prevent the operator from having any part of their body in the danger zone during the operating cycle; and they must protect against point of operation, ingoing nip points, rotating parts, and flying chips or sparks. The guard itself must not create a hazard.' },
      { question: 'Is a written machine guarding assessment required by OSHA?', answer: 'OSHA does not explicitly mandate a written assessment for general machine guarding under 1910.212, but it is required under several related standards (LOTO, PPE, mechanical power transmission) and is the de facto expectation during any focused inspection. Written assessments are the fastest way to demonstrate compliance and identify gaps before an inspector does.' },
      { question: 'What is the penalty range for machine guarding citations?', answer: 'Serious machine guarding violations under 1910.212 typically cite at $16,550 per violation as a Serious classification. Willful or repeat citations can reach $165,514 per violation. Amputation-related citations frequently trigger an OSHA enforcement focus called the National Emphasis Program on Amputations.' },
    ],
    relatedNotes: ['lockout-tagout', 'electrical-safety', 'ppe-assessment'],
    sections: {
      whatItIs: `Machine guarding is governed primarily by 29 CFR 1910.212 (general requirements for all machines) and 29 CFR 1910.219 (mechanical power transmission apparatus). The standard's intent is straightforward: any machine part, function, or process that could injure a worker must be guarded. In practice, the citation rate sits in OSHA's top 10 every year, and machine guarding is the standard most frequently associated with amputations under OSHA's National Emphasis Program on Amputations in Manufacturing Industries.

The most-cited subsection is 1910.212(a)(1) — failure to provide guards at the point of operation, ingoing nip points, rotating parts, flying chips, and sparks. The "point of operation" is wherever work is actually performed — the press die, the saw blade, the shear edge. OSHA expects a guard that prevents any part of the operator's body from entering the danger zone during the operating cycle. Acceptable guards include fixed barriers, interlocked enclosures, light curtains, two-hand controls, and presence-sensing devices. Unacceptable substitutes include training, awareness, "experienced operators," or "we've never had an injury here."

The second most-cited subsection is 1910.212(a)(2) — guards being easily removable or readily defeated. OSHA wants guards affixed to the machine, requiring tools to remove, and constructed so they cannot be bypassed without disabling the machine. The most common floor reality is the opposite: guards held in place with one bolt that was last tightened during installation, interlocks taped down or jumpered, light curtains misaligned and ignored. Once an interlock has been bypassed, that bypass becomes "how we run this machine" — and the citation when OSHA finds it can be classified Willful.

The third area is 1910.219 — mechanical power transmission. Belt drives, gears, pulleys, sprockets, chains, and rotating shafts must be enclosed if they are within 7 feet of the floor or working level. In small shops, belt drives are routinely uncovered because "the cover was in the way" or "we took it off to change the belt and never put it back." OSHA writes this citation almost every time they walk through a job shop or fabrication facility.

What an OSHA Compliance Officer checks during a machine guarding inspection: they walk the floor and look at every machine in operation. Pull a guard off and ask why it is off. Press a test button on every interlock and watch whether the machine actually stops. Ask the operator to describe the guard's purpose and what to do if it is missing. Review LOTO procedures and check whether the guard-replacement step is documented as part of returning equipment to service.

Corrective action: photograph every machine in your facility today. For each one, document the point of operation, the nip points, the rotating components, and the existing guards. Where guards are missing, source proper guards from the equipment manufacturer or a guarding fabricator (most operations can spec and install guards for under $300 per machine). Where interlocks are defeated, restore them and add a tamper-evident seal. Build a guard-replacement step into every LOTO procedure. Add machine guarding to your supervisor's daily walkaround. Total fix time for a 15-machine shop: about 30 hours of focused work spread over 60 days. Total cost: usually under $4,000. The cost of one amputation: $1.5 million in average direct and indirect costs, plus the OSHA citation that follows.`,
      whatGetsMissed: [
        'Guards removed during maintenance and never replaced',
        'Interlocks bypassed with tape, jumpers, or zip ties',
        'Makeshift guards (cardboard, plywood) that do not meet the standard',
        'No written machine guarding assessment on file',
        'New or used equipment installed without verifying guard adequacy',
        'Belt drives, gears, and pulleys exposed within 7 feet of floor level',
        'Operators trained on production but not on guard function or guard-loss reporting',
      ],
      whatISee: 'I find guards zip-tied in the "open" position so operators can clear jams faster. Interlocks defeated with electrical tape over the switch plunger. Belt drives exposed because "the cover was in the way" during a belt change six months ago and nobody put it back. Operators know it is wrong — they have just worked around it long enough that it feels normal. The real risk is not just the citation. It is the amputation, the lost finger, or the recordable that changes someone\'s life. I see this on almost every walkthrough in a metals shop or job shop.',
      checklist: [
        'Point of operation guard on every machine, properly affixed',
        'Ingoing nip points and rotating parts guarded',
        'Belt drives, gears, sprockets, and shafts enclosed if within 7 feet of floor',
        'Interlocks tested and functional — equipment stops when guard is opened',
        'No bypassed, defeated, or modified guards',
        'Written machine guarding hazard assessment on file',
        'Operator training on guard purpose, function, and guard-loss reporting documented',
        'Guard-replacement verification step built into every LOTO procedure',
        'Daily supervisor walkaround includes guard check',
      ],
    },
  },
  'walking-surfaces': {
    title: 'Walking Surfaces',
    subtitle: 'Trip Hazards You Walk Past Every Day',
    seo: 'OSHA walking-working surface compliance for warehouses and manufacturers in NC. Aisle clearance, housekeeping, floor conditions, and the slip-trip-fall hazards that produce most recordable injuries.',
    cfrCitation: '29 CFR 1910 Subpart D (1910.22 / 1910.25 / 1910.28)',
    oshaChecks: [
      'Aisles and passageways kept clear and unobstructed',
      'Walking-working surfaces maintained in clean, dry, and orderly condition',
      'Spill cleanup procedure in place and equipment accessible',
      'Floor markings (aisle stripes, hazard areas, dock edges) clear and current',
      'Adequate lighting in all walking and working areas',
      'Ladders inspected before each use and rated for the load and task',
    ],
    faqSchema: [
      { question: 'What is the OSHA standard for walking-working surfaces?', answer: '29 CFR 1910 Subpart D covers walking-working surfaces in general industry. The general housekeeping rule is 1910.22(a) — all places of employment must be kept clean and orderly and in a sanitary condition. Specific provisions address floors, aisles, stairways, ladders, dockboards, and fall protection.' },
      { question: 'How wide does an OSHA aisle have to be?', answer: 'OSHA does not specify an exact aisle width. The standard (1910.22(b)) requires that aisles be appropriate to the use, equipment, and traffic moving through them. Where forklifts operate, aisles are typically marked 8–12 feet wide. The key requirement is that aisles be kept clear and properly marked.' },
      { question: 'Why are walking-surface citations so common?', answer: 'Walking-working surface hazards (slips, trips, falls, blocked aisles, poor housekeeping) are visible from the moment an OSHA inspector walks through the door. They are also the leading source of recordable injuries in general industry — about 25% of all reported workplace injuries involve slips, trips, or falls. The combination of high visibility and high injury rate produces consistent citation rates.' },
    ],
    relatedNotes: ['fall-protection', 'forklift-safety', 'ladder-safety'],
    sections: {
      whatItIs: `Walking and working surfaces are governed by 29 CFR 1910 Subpart D, which covers floors, aisles, stairways, fixed and portable ladders, dockboards, and fall protection. The core housekeeping rule — 1910.22(a) — requires every workplace to be kept clean, orderly, and in a sanitary condition. The rule sounds soft until you walk a small operation in the middle of a production run: cords across walkways, hoses snaking through aisles, pallets parked in the middle of pedestrian zones, and "temporary" spills that have been there for three days.

The Bureau of Labor Statistics consistently reports that slips, trips, and falls account for roughly 25% of all reportable workplace injuries — making walking surfaces the single largest source of recordable cases in general industry. That is more than chemical exposures, more than struck-by incidents, more than caught-in-or-between cases. And almost every one is preventable with housekeeping and aisle discipline.

The most-cited subsection in this Subpart is 1910.22(b) — failure to keep aisles and passageways clear and clearly marked. OSHA expects to see painted aisle lines, no permanent obstructions, and width appropriate for the equipment using them. In small shops I walk through, painted aisle lines have faded to invisible, pallets are stacked in the walkway because the rack was full, and the only path from the dock to the assembly line is a zigzag around production tooling.

The second most-cited area is 1910.22(d)(1) — failure to inspect walking-working surfaces regularly and correct hazardous conditions. OSHA does not specify a frequency, but the de facto expectation is daily, with documented periodic inspections. Most small operations have no documented inspection process at all. Spills get reported when someone notices; cords get rerouted when they trip someone; aisle lines get repainted when the customer audit catches them.

The third area is portable and fixed ladders under 1910.23 — daily inspection before use, no makeshift use, no damaged rungs or rails, and the right ladder for the job. In small shops, I find ladders leaned against walls with no inspection tag, rolling stair platforms missing handrails, and step-stools used as ladders to reach high shelves.

What an OSHA Compliance Officer checks during a walking-surface inspection: they observe the route they walked from the front door to the breakroom. They look at aisle marking visibility. They check whether pallets, hoses, or cords are in pedestrian zones. They open the spill-kit cabinet and verify it is stocked. They inspect ladders for damage and tags. They review any documented daily-walk or housekeeping inspection records, and they correlate visible conditions against the OSHA 300 log to look for unreported recordable cases.

Corrective action: buy a 5-gallon bucket of safety yellow paint and re-mark every aisle this week. Designate a housekeeping owner and build a daily 15-minute walkaround into the shift schedule. Stock a spill kit at each high-risk area (dock, hydraulic equipment, chemical storage). Tag every portable ladder with an inspection sticker and a Sharpie date. Build a 5-minute housekeeping toolbox talk into your weekly supervisor meeting. Total fix time: about 8 hours of focused effort plus the daily walkaround going forward. Total cost: under $300 for paint, spill supplies, and ladder tags. The cost of getting it wrong: each recordable case averages $42,000 in direct and indirect costs, plus the OSHA citation rate that climbs the longer the condition persists.`,
      whatGetsMissed: [
        'Extension cords and hoses running across walkways',
        'Aisle markings faded or never installed',
        'Spills left for hours or days before cleanup',
        'Floor damage or uneven surfaces near doorways and dock edges',
        'Pallets and product stored in walking aisles',
        'Lighting inadequate in storage zones, mezzanines, or back corners',
        'Portable ladders used without inspection or rated incorrectly for the task',
      ],
      whatISee: 'Extension cords running across the main aisle to power a tool by the loading dock. A puddle near the dock that has been there for three days — somebody put a paper towel on it. Pallets stacked in the walkway because the rack was full. Aisle lines painted two years ago and barely visible. A step-stool being used to reach a top shelf at 8 feet. Everyone walks around the hazard. Nobody fixes it because it is "temporary." That is exactly how the OSHA 300 log fills up faster than the maintenance schedule.',
      checklist: [
        'Aisles clearly marked with paint or tape and kept free of obstructions',
        'No extension cords, hoses, or cables running across walkways',
        'Spill response procedure in place; spill kits stocked at high-risk areas',
        'Floor surfaces level and in good condition — no chips, cracks, or warped sections',
        'Pallets and product stored in designated areas only, not aisles',
        'Lighting adequate in all walking and working areas, including back corners',
        'Daily housekeeping walkaround assigned to a named owner and documented',
        'All portable ladders inspected before each use and tagged with an inspection sticker',
        'Mezzanines, dock edges, and elevated surfaces have proper edge protection',
      ],
    },
  },
  'lockout-tagout': {
    title: 'Lockout/Tagout (LOTO)',
    subtitle: 'The Step That Gets Skipped',
    seo: 'OSHA Lockout/Tagout compliance for small manufacturers and warehouses in the Piedmont Triad NC. Written procedures, training, annual inspections, and the steps that get skipped on the floor.',
    cfrCitation: '29 CFR 1910.147',
    kitCrossSell: {
      headline: 'The LOTO documentation layer.',
      intro: 'Three documents from the GigLine Supervisor Safety Starter System cover the documentation gaps that get LOTO citations. The kit does not replace machine-specific procedures (you still need those for each piece of equipment) — but it builds the training, inspection, and OSHA-response layer around them. $600 for the digital kit, included free with every Compliance Readiness Visit.',
      cards: [
        { num: '10', label: 'Employee Training Record Log', body: 'Documents every LOTO training session for authorized, affected, and other employees. The training trail OSHA asks for under 1910.147(c)(7).' },
        { num: '09', label: 'Monthly Safety Inspection Checklist', body: 'Includes LOTO equipment checks — locks at point of use, interlocks functional, energy isolation devices labeled. Proves the periodic inspection happened.' },
        { num: '07', label: 'If OSHA Shows Up', body: 'Seven-step protocol. LOTO is in OSHA\'s top 5 most-cited general industry standards — if an inspector walks in, this is the document that runs the first 10 minutes.' },
      ],
    },
    oshaChecks: [
      'Written, machine-specific lockout procedures for every piece of equipment with hazardous energy',
      'Authorized employees trained on energy isolation and documented annually',
      'Personal locks, tags, and hasps assigned by name and available at point of use',
      'Annual periodic inspection of each lockout procedure by an authorized employee',
      'Group lockout procedures for crews servicing the same equipment',
      'Contractor LOTO coordination — outside service providers informed and aligned',
    ],
    faqSchema: [
      { question: 'Does OSHA require a written lockout/tagout procedure for every machine?', answer: 'Yes. 29 CFR 1910.147(c)(4)(i) requires a documented procedure for the control of hazardous energy for each piece of equipment. A single generic procedure used across multiple machines is one of the most common citations under this standard.' },
      { question: 'How often does OSHA require LOTO procedure inspections?', answer: '29 CFR 1910.147(c)(6) requires a periodic inspection of each energy control procedure at least annually. The inspection must be performed by an authorized employee (other than the one performing the work), and it must be documented with the date, the equipment, and the names of the employees included.' },
      { question: 'What is the difference between authorized, affected, and other employees under LOTO?', answer: 'Authorized employees actually lock out and service equipment — they receive full LOTO training. Affected employees operate or work in the area but do not service equipment — they receive awareness training. Other employees work in the facility but are not exposed — they receive an explanation of the program. All three categories must be trained, and the training must be documented.' },
    ],
    relatedNotes: ['machine-guarding', 'electrical-safety', 'confined-space'],
    sections: {
      whatItIs: `Lockout/Tagout — 29 CFR 1910.147 — is the OSHA standard that governs the control of hazardous energy during equipment servicing and maintenance. It is consistently in OSHA's top 5 most-cited general industry standards, and it shows up in fatality reports more often than any other maintenance-related standard. The rule is straightforward: before anyone services equipment that could start up unexpectedly or release stored energy, every energy source must be isolated, locked out, and verified. The execution is where it falls apart.

The single most-cited subsection is 1910.147(c)(4) — failure to develop, document, and use machine-specific lockout procedures. OSHA does not accept one generic procedure used for every press, conveyor, and mixer in the building. Each piece of equipment with hazardous energy needs its own written procedure that lists every energy source (electrical, pneumatic, hydraulic, mechanical, thermal, chemical), the specific steps to isolate each one, and the verification method. In small shops I walk into, the most common state is no written procedures at all — the maintenance lead just "knows how to do it." That is a citable condition the moment OSHA asks for the procedure.

The second most-cited subsection is 1910.147(c)(7) — training and retraining. OSHA requires training for three categories of employees: authorized employees who perform LOTO, affected employees who operate the equipment or work in the area, and other employees in the facility. All three categories must be trained, the training must be documented with dates and names, and retraining is required whenever there is a change in job assignments, machines, processes, or procedures — or when a periodic inspection reveals deviations. Most small operations train the maintenance team once at hire and never again. Affected employees (the operators who actually run the machine) often receive no formal training at all.

The third gap is the annual periodic inspection — 1910.147(c)(6)(i). At least once per year, an authorized employee (other than the one who performs the work on a given machine) must observe a LOTO performance and verify that the written procedure is being followed correctly. The inspection has to be documented: date, machine, procedure inspected, names of the authorized employee and the inspector, and any deviations identified. Almost no small operation does this. When OSHA asks for the annual inspection records, the response is usually silence.

What an OSHA Compliance Officer checks during a LOTO-focused visit: they ask to see written procedures for the specific machines they observe being serviced — pick one at random and the response had better be a printed, signed procedure within 60 seconds. They observe an actual lockout if maintenance is in progress and compare what they see against the written procedure. They review training records and confirm each authorized employee has been trained on the specific procedures they perform. They ask for the most recent annual inspection record. They review the program's annual review documentation under 1910.147(c)(4)(ii) to confirm procedures have been reviewed and updated as needed.

Corrective action: photograph every piece of equipment with hazardous energy in your facility. For each one, draft a written procedure that lists every energy source and isolation point — most facilities can produce 8–15 procedures covering everything that needs one. Print the procedures, post them at the equipment, and file copies in a LOTO binder. Assign personal locks (with each authorized employee's name engraved or labeled) and store them at point of use. Schedule and document annual periodic inspections — put it on the calendar like any other required check. Train all three employee categories, document with sign-in sheets, and re-train whenever anything changes. Total fix time for a small operation: 12–20 hours of focused work spread over a month. Total cost: under $500 for locks, hasps, tags, and binders. The cost of getting it wrong: citations starting at $16,550 per violation, multiplied across every machine without a procedure.`,
      whatGetsMissed: [
        'No machine-specific written LOTO procedure — one generic procedure used for everything',
        'Personal locks not assigned by name or stored away from point of use',
        'Authorized employees trained at hire and never retrained or re-evaluated',
        'Annual periodic inspection never performed or never documented',
        'Affected employees (operators) receive no LOTO awareness training',
        'Contractors brought in for service work without LOTO coordination',
        'Group lockout used informally with no documented procedure',
      ],
      whatISee: 'I walk into facilities where the maintenance lead can describe lockout from memory — but there is no written procedure. The breakers are tagged with masking tape and a Sharpie. Personal locks are kept in a drawer in the maintenance office, not at point of use. The annual periodic inspection has never been performed. Operators have never been told what LOTO is, even though they are the ones who walk past locked-out equipment every day. When contractors come in to service a press, nobody coordinates LOTO at all — the contractor does whatever they were trained to do at their last job. This is the standard that turns a routine maintenance task into a fatality, and it is the standard that gets skipped because "we have always done it this way."',
      checklist: [
        'Written LOTO procedure on file for every machine with hazardous energy',
        'Machine-specific procedures posted at point of use or filed in a binder available on the floor',
        'Personal locks assigned to each authorized employee (name on lock)',
        'Locks, tags, and hasps stored at point of use, not in a central drawer',
        'Authorized, affected, and other employees trained — training documented by date and name',
        'Annual periodic inspection completed for each procedure and documented',
        'Group lockout procedure written for crew-based service work',
        'Contractor LOTO coordination procedure in place and used on every outside service visit',
        'Annual program review (1910.147(c)(4)(ii)) completed and documented',
      ],
    },
  },
  'emergency-action-plans': {
    title: 'Emergency Action Plans',
    subtitle: 'What Happens When the Alarm Goes Off',
    seo: 'OSHA Emergency Action Plan and Fire Prevention Plan compliance for small manufacturers in the Piedmont Triad NC. Evacuation routes, alarm systems, fire extinguishers, and the documentation OSHA expects to see.',
    cfrCitation: '29 CFR 1910.38 / 1910.39 / 1910.157',
    oshaChecks: [
      'Written Emergency Action Plan for facilities with 11+ employees, available for employee review',
      'Documented evacuation procedures, escape routes, and assembly point',
      'Alarm system that can be perceived above ambient noise in all work areas',
      'Fire extinguishers inspected monthly (tagged) and serviced annually',
      'Exit routes unobstructed, properly marked, and properly lit',
      'Drills conducted and documented at least annually',
    ],
    faqSchema: [
      { question: 'Does my small shop need a written Emergency Action Plan?', answer: 'Yes if you have 11 or more employees at any one location. Under 29 CFR 1910.38(b), facilities with 11+ employees must have a written EAP available for review by employees and OSHA. Operations with 10 or fewer employees may communicate the plan orally, but every required element still has to be in place.' },
      { question: 'What has to be included in an OSHA Emergency Action Plan?', answer: '29 CFR 1910.38(c) requires the EAP to address procedures for emergency reporting, evacuation procedures and escape route assignments, procedures for employees who remain to operate critical operations before evacuation, procedures to account for all employees after evacuation, rescue and medical duties, and the name of the EAP coordinator. The Fire Prevention Plan (1910.39) is a separate but related document.' },
      { question: 'How often does OSHA require fire extinguisher inspections?', answer: 'Under 29 CFR 1910.157(e), portable fire extinguishers must be visually inspected monthly and given an annual maintenance check by a qualified person, with the date and inspector recorded on the extinguisher tag. Hydrostatic testing is required every 5 or 12 years depending on the extinguisher type.' },
    ],
    relatedNotes: ['hazcom', 'walking-surfaces', 'bloodborne-pathogens'],
    sections: {
      whatItIs: `Emergency Action Plans are governed by 29 CFR 1910.38, with the related Fire Prevention Plan requirements at 1910.39 and the portable fire extinguisher requirements at 1910.157. The standards are easy to overlook in a small operation because most days nothing happens — and most operators do not think about emergency planning until something goes wrong or until OSHA shows up and asks for the documentation.

The headcount threshold is the first thing to check. Under 1910.38(b), any facility with 11 or more employees at any one location must have a written EAP available for employee review. Operations with 10 or fewer employees may communicate the plan orally, but every required element still has to be in place — reporting procedures, evacuation procedures, escape routes, accountability after evacuation, rescue and medical duties, and the name of a coordinator. Most small manufacturers in the Triad cross the 11-employee threshold and do not realize the written-plan requirement applies to them.

The most-cited subsection in this category is 1910.157(e) — failure to properly inspect, maintain, and tag portable fire extinguishers. OSHA expects monthly visual inspections (documented on the extinguisher tag) and annual maintenance by a qualified person. In small shops, what I most often find is extinguishers mounted in the right places but with tags blank for the past 18 months. The vendor came once at install, charged $80, and was never seen again. That is a citation under 1910.157(e)(2) and (e)(3), and each extinguisher is its own citable item.

The second most-cited issue is 1910.37(a) — exit route obstruction. Exit routes must be unobstructed, marked with exit signs, properly lit, and not blocked by storage, equipment, or product. In small operations, the second exit door is almost always partially blocked by inventory or used as a working surface. The exit sign above it is sometimes burned out, and the path to it is partially obstructed by a forklift parked there overnight.

The third issue is the EAP itself — 1910.38(c). The plan must address every required element, be available to employees for review, and be supplemented with training when the plan is developed and when responsibilities change. In small operations, the EAP either does not exist or is a one-page template downloaded years ago with another company's name in the header. Employees have never seen it. The "assembly point after evacuation" — required under 1910.38(c)(4) — has never been communicated to anyone, so workers congregate in different locations after a fire alarm.

What an OSHA Compliance Officer checks during an EAP inspection: they ask for the written plan and confirm it covers every required element. They ask three random employees where the nearest exit is and where the assembly point is. They walk every exit route to verify it is unobstructed and properly marked. They look at fire extinguisher tags. They review training records for the EAP and ask whether annual drills have been conducted and documented. They check the Fire Prevention Plan if hazardous materials are present.

Corrective action: download the OSHA EAP template (free at osha.gov) and customize it to your facility — name your coordinator, list your assembly point, document your accountability procedure. Walk every exit route and clear obstructions. Replace burned-out exit signs and verify backup illumination works. Schedule a fire extinguisher inspection vendor for annual maintenance and add monthly visual inspections to your housekeeping checklist. Conduct one evacuation drill, document it, and put it on the calendar to repeat annually. Train every employee on the plan and document with a sign-in sheet. Total fix time for a small operation: about 6–10 hours of focused work. Total cost: $200–$500 for fire extinguisher service, exit signs, and printed plan documentation. The cost of getting it wrong: each missing extinguisher tag is its own citation; an obstructed exit is its own citation; a missing written plan is its own citation. They stack fast.`,
      whatGetsMissed: [
        'No written Emergency Action Plan for facilities with 11+ employees',
        'Exit routes blocked by inventory, equipment, or forklifts',
        'Exit signs burned out or missing backup illumination',
        'Fire extinguisher tags blank for 6+ months',
        'No designated assembly point or three different assembly points depending on who you ask',
        'Annual evacuation drill never conducted or never documented',
        'EAP coordinator not identified — no single person responsible',
      ],
      whatISee: 'I ask where the assembly point is and get three different answers. Exit signs are blocked by racking. Fire extinguishers have not been inspected in over a year — the tag is either missing or the last entry was 2023. Nobody knows where the plan is because it does not exist. When I ask what happens if there is a fire, the answer is usually "we leave." That is not a plan. That is a hope. OSHA wants the written plan, the trained employees, the documented drill, and the maintained equipment — together, not in fragments.',
      checklist: [
        'Written Emergency Action Plan on file, customized to facility (or oral plan for 10-or-fewer operations)',
        'EAP coordinator named and trained',
        'Evacuation procedures and escape route assignments documented',
        'Designated assembly point posted and known by all employees',
        'Procedure to account for all employees after evacuation',
        'Exit routes unobstructed, marked with exit signs, properly lit',
        'Fire extinguishers inspected monthly (tag documented) and serviced annually',
        'Alarm system audible above ambient noise throughout all work areas',
        'Annual evacuation drill conducted and documented',
        'EAP training documented for every employee, including new hires',
      ],
    },
  },
  'ppe-assessment': {
    title: 'PPE Assessment & Use',
    subtitle: 'More Than Just Handing Out Glasses',
    seo: 'OSHA PPE hazard assessment compliance for small manufacturers in NC. Written certification, hazard-based selection, employee training, and the citations that follow when PPE is bought but never documented.',
    cfrCitation: '29 CFR 1910.132 / 1910.133 / 1910.138',
    oshaChecks: [
      'Written PPE hazard assessment for each work area, signed and dated',
      'PPE selected based on the actual hazards identified, not on availability',
      'Documented employee training on proper use, care, and limitations of each PPE item',
      'PPE provided at no cost to employees (with limited exceptions under 1910.132(h))',
      'Inspection and replacement program for damaged or expired PPE',
      'Enforcement of PPE rules — violations addressed consistently and documented',
    ],
    faqSchema: [
      { question: 'What does OSHA require for PPE under 1910.132?', answer: 'Under 29 CFR 1910.132(d), every employer must perform a workplace hazard assessment to determine whether PPE is necessary. The assessment must be in writing, identify the workplace evaluated, the person certifying the assessment, and the date. PPE must then be selected to protect against the identified hazards, employees must be trained on its use, and the employer must verify the training in writing.' },
      { question: 'Does OSHA require the employer to pay for PPE?', answer: 'Yes, with limited exceptions. Under 29 CFR 1910.132(h), the employer must provide all required PPE at no cost to the employee. Exceptions include non-specialty safety-toe footwear and non-specialty prescription safety eyewear that the employee may take off-site, plus everyday clothing like long pants or weather gear.' },
      { question: 'What is the most common PPE citation?', answer: 'The most common PPE citation is failure to perform and document the written hazard assessment under 1910.132(d). Operations frequently provide the PPE but cannot produce the written assessment showing why specific PPE was selected for specific hazards. Eye and face protection (1910.133) is the most-cited specific PPE category.' },
    ],
    relatedNotes: ['hazcom', 'machine-guarding', 'eye-face-protection'],
    sections: {
      whatItIs: `Personal Protective Equipment is governed by 29 CFR 1910 Subpart I — primarily 1910.132 (general requirements), 1910.133 (eye and face protection), 1910.135 (head protection), 1910.136 (foot protection), and 1910.138 (hand protection). The standards' core requirement is straightforward: identify the hazards in your workplace, select PPE that protects against those hazards, train employees on proper use, and document everything. The execution is where small operations get cited.

The most-cited subsection across all PPE standards is 1910.132(d) — failure to perform and document a workplace hazard assessment. This is the requirement that OSHA inspectors look for first because it is the foundation of every other PPE decision. The written assessment must identify the workplace evaluated, the person who performed it, the date it was performed, and the hazards identified. Without it, there is no defensible reason for any of the PPE selections an employer has made. In small shops, the written assessment either does not exist or is a generic template downloaded years ago that does not reflect the actual equipment, chemicals, or processes in the facility.

The second most-cited subsection is 1910.132(f) — training. Employees must be trained on when PPE is necessary, what PPE is necessary, how to properly wear and adjust it, the limitations of the PPE, and the proper care, maintenance, useful life, and disposal of the PPE. Training must be verified in writing — date, names, topics covered. "We told them at the morning meeting" is not training. OSHA wants a sign-in sheet and a topic outline, signed by the trainer and the employee.

Eye and face protection — 1910.133 — is consistently in OSHA's top 10 most-cited general industry standards. The citation usually involves employees performing eye-hazard work without proper protection, or employees wearing the wrong type of eye protection for the hazard (regular safety glasses where a face shield is required, no side shields where impact protection is required, no chemical splash protection where chemicals are handled). The fix is rarely the PPE — most operations have it on the shelf — it is the assessment and training that connect the hazard to the right PPE.

Hand protection — 1910.138 — is the next most common gap. Employees wearing the wrong glove for the chemical they are handling (latex where nitrile is required, cotton where cut-resistant is required). The hazard assessment is the document that should determine the correct selection; without it, the wrong selection is the default. Burned, torn, or chemically degraded gloves continue to be worn because nobody owns the replacement schedule.

What an OSHA Compliance Officer checks during a PPE-focused inspection: they ask for the written hazard assessment under 1910.132(d). They observe whether the PPE in actual use matches the hazards visible on the floor. They review training records and confirm each employee has been trained on the specific PPE they wear. They check whether PPE is provided at no cost — they will ask employees directly. They examine the PPE in use for damage, expiration, or inappropriate substitution.

Corrective action: walk every work area in your facility with a printed PPE hazard assessment template. For each work area, list the hazards (impact, chemical, electrical, thermal, sharp edges, noise, particles), identify the PPE selected for each hazard, certify the assessment with date and signer name. Build a PPE training session, document it with a sign-in sheet, and file it. Audit your PPE inventory — replace expired or damaged items, ensure proper sizes are stocked. Add PPE compliance to your supervisor's daily walkaround. Total fix time: about 8 hours of focused work for a small operation. Total cost: usually under $300 in replacement PPE and zero in new documentation. The cost of getting it wrong: 1910.132(d) failure is its own citation; 1910.132(f) failure is its own citation; each specific PPE subsection (1910.133, 1910.138, etc.) is its own citation. They stack.`,
      whatGetsMissed: [
        'No written PPE hazard assessment — or a generic template never customized',
        'PPE selection based on what was in the cabinet, not on the hazards present',
        'Training delivered verbally and never documented',
        'Damaged or expired PPE still in active use',
        'Wrong PPE for the task (latex gloves for solvents, regular safety glasses where face shields are required)',
        'No enforcement when PPE rules are ignored — supervisors looking past the violation',
        'Employees required to provide their own PPE without an explicit exception',
      ],
      whatISee: 'I see employees grinding without face shields, using the wrong gloves for the chemicals they are handling, and safety glasses so scratched they can barely see through them. When I ask about the hazard assessment, it is either a generic template downloaded years ago or it does not exist. The employer bought the PPE — but never documented why those specific items were selected, never trained anyone on when to use them, and never enforced it consistently. By the time I walk in, the PPE has become optional in practice, even though it is required on paper.',
      checklist: [
        'Written PPE hazard assessment completed for each work area, signed and dated',
        'PPE selection documented against specific hazards identified',
        'Employees trained on proper use, care, limitations, and useful life of each PPE item',
        'Training documented with dates, topics, attendee names, and trainer signature',
        'PPE provided at no cost to employees (limited exceptions documented)',
        'PPE inspected regularly and replaced when damaged or expired',
        'Enforcement consistent — violations addressed and documented',
        'Hazard assessment updated when processes, chemicals, or equipment change',
        'Eye/face protection appropriate for the task (impact, chemical splash, optical radiation)',
        'Hand protection matched to specific chemical or mechanical hazard',
      ],
    },
  },
  'fall-protection': {
    title: 'Fall Protection',
    subtitle: "It's Not Just a Roofing Problem",
    seo: 'OSHA fall protection compliance for general industry warehouses and small manufacturers in NC. The 4-foot rule, mezzanines, loading docks, fixed ladders, and the citations that follow when edge protection is missing.',
    cfrCitation: '29 CFR 1910.28 / 1910.29 / 1910.30',
    oshaChecks: [
      'Guardrails on all open sides of walking-working surfaces 4 feet or higher (42-inch top rail, 21-inch midrail, 4-inch toeboard)',
      'Self-closing mezzanine gates at load/unload openings — chains do not meet the standard',
      'Loading dock edges marked, protected, or fitted with portable edge protection',
      'Portable ladders inspected before each use and rated for the task and load',
      'Fixed ladders meeting cage, well, or personal fall arrest requirements above 24 feet',
      'Documented fall protection training for every employee with height exposure',
    ],
    faqSchema: [
      { question: 'What is the OSHA fall protection trigger height in general industry?', answer: 'Under 29 CFR 1910.28(b)(1)(i), fall protection is required for general industry walking-working surfaces that are 4 feet or higher above a lower level. This is significantly lower than the construction standard (6 feet) and applies to mezzanines, loading docks, elevated platforms, and any open-sided floor.' },
      { question: 'Does a chain across a mezzanine opening meet OSHA?', answer: 'No. Under 29 CFR 1910.29(b), a guardrail system must have a top rail at 42 inches (±3 inches), a midrail midway between the top rail and walking surface, and be able to withstand a 200-pound force in any outward or downward direction. A chain does not meet the strength, height, or completeness requirements. Self-closing or self-locking gates are the standard solution for mezzanine load openings.' },
      { question: 'Is fall protection training required by OSHA?', answer: 'Yes. Under 29 CFR 1910.30, every employee exposed to a fall hazard must be trained on the nature of the hazards, the procedures for protecting them, and the proper use, inspection, and maintenance of any fall protection equipment used. Training must be documented in writing, and retraining is required when an employee shows inadequate knowledge or when conditions change.' },
    ],
    relatedNotes: ['walking-surfaces', 'scaffolding-safety', 'ladder-safety'],
    sections: {
      whatItIs: `Fall protection in general industry is governed by 29 CFR 1910 Subpart D — primarily 1910.28 (duty to have fall protection), 1910.29 (fall protection systems and criteria), and 1910.30 (training). The standards were significantly updated in 2017 and now mirror many of the construction-industry rules under Subpart M of 29 CFR 1926. The 2017 update closed loopholes that had allowed older general-industry operations to use less-protective measures than construction sites — and it made the 4-foot trigger height explicit across nearly every walking-working surface.

The 4-foot rule is the single most important number in the standard. Under 1910.28(b)(1)(i), any walking-working surface 4 feet or higher above a lower level requires fall protection — guardrails, safety net systems, or personal fall arrest. This applies to mezzanines, loading docks, elevated work platforms, scaffolds, open-sided floors, and anywhere a worker could walk off an edge. Most small operations in the Triad have at least one mezzanine, one dock, or one elevated platform where employees work — and most have at least one location where the 4-foot rule is violated.

The most-cited subsection is 1910.28(b)(1) — failure to provide fall protection on walking-working surfaces. The most common form of this citation in warehouses is the mezzanine load opening with a chain instead of a self-closing gate. The chain is removable, does not meet the 42-inch height requirement, does not provide a midrail, and provides no protection during the moment of load transfer when a pallet is being placed on the mezzanine. OSHA writes this citation almost every time they walk into a warehouse with a mezzanine.

The second most-cited subsection is 1910.29(b) — guardrail system criteria. Even where guardrails exist, they frequently fail to meet the standard: top rails below 39 inches, no midrails, gaps wider than 19 inches, no toeboards where required to prevent objects from falling on workers below. Operations install "guardrails" that look like guardrails but do not meet the specifications. OSHA's measurement is exact: 42 inches ±3, midrail at the midpoint, 4-inch toeboard, 200-pound load capacity.

The third issue is 1910.30 — training. Every employee with height exposure must be trained on hazards, protective procedures, and any equipment they use. Training must be documented. In small operations, fall protection training either never happens or is delivered as part of a generic safety orientation with no specific content on the actual fall hazards in the facility. Operators on a mezzanine, dock workers, anyone using a ladder — all need documented fall protection training matched to their specific exposures.

What an OSHA Compliance Officer checks during a fall protection inspection: they walk every elevated surface in the facility. They measure top rail heights, check for midrails and toeboards, verify gates are self-closing, and look at the floor for unprotected holes or openings. They inspect portable ladders for damage and the required inspection. They review training records and ask employees to describe the fall protection measures in their work area. They check whether personal fall arrest equipment (if used) has been inspected, fits the wearer, and is properly anchored.

Corrective action: walk every elevated surface in your facility with a tape measure. Replace any chain at a mezzanine opening with a self-closing gate (cost: $400–$800 per gate). Install or rebuild guardrails to meet the 42-inch/midrail/toeboard standard. Mark loading dock edges with visible paint and add portable dock-edge guards or barriers. Inspect every portable ladder, tag the ones that pass, and remove damaged ones from service. Build a fall protection training session, document it, and file it. Total fix time: 8–20 hours of focused work depending on facility size. Total cost: typically $1,000–$4,000 for self-closing gates and guardrail upgrades on a small operation. The cost of getting it wrong: each unprotected edge is its own citation, and falls from less than 10 feet cause the majority of warehouse fatalities every year.`,
      whatGetsMissed: [
        'Mezzanines with a chain across the opening instead of a self-closing gate',
        'Loading docks with no edge marking and no barrier',
        'Guardrails below 42 inches or missing midrails and toeboards',
        'Workers on top of storage containers or pallets without fall protection',
        'Portable ladders leaned against walls with no inspection tags',
        'Fixed ladders over 24 feet without a cage, well, or personal fall arrest',
        'Holes or openings in walking surfaces uncovered and unmarked',
      ],
      whatISee: 'I find mezzanines with a chain across the opening instead of a proper gate. Loading docks with no edge marking and no barrier. Workers climbing on top of storage containers to reach overhead inventory without any fall protection discussion. Ladders leaned against walls with no inspection tags. The 4-foot rule gets ignored because it does not feel that high — until someone falls and it is a recordable. The post-2017 update closed most of the loopholes general industry used to rely on, but most small operations have not adjusted their setups since the rule changed.',
      checklist: [
        'Guardrails on all open sides of walking-working surfaces 4 feet or higher',
        'Guardrail top rails at 42 inches (±3), midrails at the midpoint, 4-inch toeboards where required',
        'Self-closing or self-locking mezzanine gates at load/unload openings',
        'Loading dock edges marked, painted, or protected with portable edge guards',
        'Fall protection training documented for every employee with height exposure',
        'Portable ladders inspected before each use; damaged ladders removed from service',
        'Fixed ladders 24+ feet have cage, well, or personal fall arrest system',
        'Holes and openings in walking surfaces covered, secured, and marked',
        'Personal fall arrest equipment (if used) inspected, fitted, and properly anchored',
      ],
    },
  },
  'confined-space': {
    title: 'Confined Space Entry',
    subtitle: 'The Permit Nobody Wrote',
    seo: 'OSHA confined space entry permit program for small manufacturers and warehouses in NC. What gets missed, what gets cited, and what to do about it.',
    cfrCitation: '29 CFR 1910.146',
    oshaChecks: [
      'Written permit-required confined space program',
      'Atmospheric testing before and during entry',
      'Entry permits completed for each entry',
      'Attendant stationed at each active entry point',
      'Rescue procedures established and practiced',
      'Annual program review documented',
    ],
    faqSchema: [
      { question: 'What qualifies as a permit-required confined space under OSHA?', answer: 'A permit-required confined space has limited or restricted means of entry or exit, is large enough for an employee to enter and perform work, is not designed for continuous occupancy, and has one or more recognized hazards — such as atmospheric hazards, engulfment potential, or configuration that could trap an entrant. Examples include tanks, vats, pits, silos, and some ductwork.' },
      { question: 'Do small manufacturers need a confined space program?', answer: 'Yes. If your facility has any space that meets the OSHA definition of a permit-required confined space — even if employees rarely enter it — you must have a written program under 29 CFR 1910.146. This includes identifying all such spaces, posting danger signs, and establishing entry procedures.' },
      { question: 'What is the most common confined space violation?', answer: 'The most common citation is failure to have a written permit-required confined space program. Many small operations have spaces that qualify but have never been formally identified or assessed.' },
    ],
    relatedNotes: ['lockout-tagout', 'ppe-assessment', 'emergency-action-plans'],
    sections: {
      whatItIs: 'A permit-required confined space has limited entry, is large enough for a worker to enter, is not designed for continuous occupancy, and contains a recognized hazard. Tanks, vats, pits, silos, storage bins, and some mechanical enclosures all qualify. OSHA 29 CFR 1910.146 requires a written program, atmospheric testing, entry permits, trained attendants, and rescue procedures. Most small operations either don\'t know they have confined spaces or haven\'t built the program.',
      whatGetsMissed: [
        'Confined spaces not identified or labeled',
        'No written permit-required confined space program',
        'Atmospheric testing not performed before entry',
        'Entry permits not completed or filed',
        'No trained attendant at the entry point',
        'Rescue plan missing or untested',
      ],
      whatISee: 'I find pits and tanks that workers enter routinely without a permit, without testing the atmosphere, and without an attendant. The space was never formally identified as a confined space because "it\'s just a pit." Nobody has a gas monitor. Nobody is watching the opening. The rescue plan is "call 911" — which means a 15-minute response for a space where an atmospheric hazard can incapacitate someone in seconds.',
      checklist: [
        'All permit-required confined spaces identified and posted',
        'Written confined space entry program on file',
        'Entry permits completed and signed for each entry',
        'Atmospheric testing (O2, LEL, CO, H2S) before and during entry',
        'Trained attendant stationed at entry during all operations',
        'Rescue equipment available and rescue team identified',
        'Annual program review documented',
        'All entrants, attendants, and supervisors trained and documented',
      ],
    },
  },
  'scaffolding-safety': {
    title: 'Scaffolding Safety',
    subtitle: 'Set Up Wrong, Used Anyway',
    seo: 'OSHA scaffolding safety requirements for small operations in the Piedmont Triad NC. What gets cited, what gets missed, and how to fix it.',
    cfrCitation: '29 CFR 1926.451',
    oshaChecks: [
      'Scaffold erected under direction of a competent person',
      'Guardrails on all open sides and ends above 10 feet',
      'Planking fully decked and secured — no gaps over 1 inch',
      'Access ladder or stairway provided',
      'Load capacity known and not exceeded',
      'Daily inspection by competent person before each shift',
    ],
    faqSchema: [
      { question: 'Who can erect a scaffold under OSHA rules?', answer: 'OSHA requires scaffolds to be erected, moved, dismantled, or altered only under the supervision of a competent person — someone capable of identifying existing and predictable hazards and authorized to take corrective measures. This is defined under 29 CFR 1926.451(f)(7).' },
      { question: 'What are the guardrail requirements for scaffolding?', answer: 'Scaffolds more than 10 feet above a lower level must have guardrails on all open sides and ends. The top rail must be between 38 and 45 inches high, with a midrail and toeboard. Cross bracing can serve as a top rail only if the crossing point is between 38 and 48 inches.' },
      { question: 'How often must scaffolding be inspected?', answer: 'A competent person must inspect scaffolding before each work shift and after any event that could affect structural integrity — such as high winds, heavy rain, or impact damage. Inspections must be documented.' },
    ],
    relatedNotes: ['fall-protection', 'ppe-assessment', 'ladder-safety'],
    sections: {
      whatItIs: 'Scaffolding violations are consistently in OSHA\'s top 10 most cited standards. 29 CFR 1926.451 requires scaffolds to be erected under the direction of a competent person, inspected before each shift, and equipped with guardrails when the platform is more than 10 feet above a lower level. Most small operations either rent scaffolding and set it up without training, or use makeshift platforms that don\'t meet any standard.',
      whatGetsMissed: [
        'No competent person designated for scaffold erection',
        'Guardrails missing or incomplete on elevated platforms',
        'Planking not fully decked or not secured',
        'No access ladder — workers climbing the frame',
        'Scaffold not inspected before each shift',
        'Load capacity unknown or exceeded',
      ],
      whatISee: 'I see scaffolds assembled by whoever was available, with no training documentation and no competent person oversight. Guardrails are missing on one side because "we\'re working from the wall." Planks are laid across without being secured — they shift underfoot. Workers climb the cross-bracing instead of using a ladder. Nobody knows the load rating, and I\'ve seen material stacked on platforms well beyond capacity. The scaffold went up and nobody checked it again.',
      checklist: [
        'Competent person designated and documented for erection/inspection',
        'Guardrails on all open sides and ends (top rail 38-45 inches)',
        'Midrails and toeboards in place',
        'Planking fully decked, secured, and extending 6-12 inches past supports',
        'Access ladder or stairway provided — no climbing the frame',
        'Load capacity posted and not exceeded',
        'Daily inspection before each shift, documented',
        'Scaffold on firm, level base with base plates or mudsills',
      ],
    },
  },
  'hearing-conservation': {
    title: 'Hearing Conservation',
    subtitle: 'The Damage You Don\'t Feel Until It\'s Done',
    seo: 'OSHA hearing conservation program requirements for small manufacturers in NC. Noise monitoring, audiometric testing, and hearing protection — what gets cited.',
    cfrCitation: '29 CFR 1910.95',
    oshaChecks: [
      'Noise monitoring to identify employees exposed at or above 85 dBA (8-hour TWA)',
      'Audiometric testing program for all exposed employees',
      'Hearing protection provided and available at 85 dBA, required at 90 dBA',
      'Employee training on noise hazards and hearing protection',
      'Recordkeeping — noise exposure records and audiograms maintained',
    ],
    faqSchema: [
      { question: 'At what noise level does OSHA require a hearing conservation program?', answer: 'OSHA requires a hearing conservation program when employees are exposed to noise at or above 85 decibels (dBA) averaged over an 8-hour work shift (the Action Level). At 90 dBA, feasible engineering or administrative controls and mandatory hearing protection are required under 29 CFR 1910.95.' },
      { question: 'Do small manufacturers need audiometric testing?', answer: 'Yes. If any employee is exposed to noise at or above the 85 dBA Action Level, the employer must provide baseline and annual audiometric testing at no cost. Results must be compared year over year to detect standard threshold shifts.' },
      { question: 'What counts as an OSHA noise violation in a small shop?', answer: 'The most common citations include failure to conduct noise monitoring, no audiometric testing program, hearing protection not provided or not enforced, and missing training records. OSHA can cite any of these independently.' },
    ],
    relatedNotes: ['ppe-assessment', 'machine-guarding', 'respiratory-protection'],
    sections: {
      whatItIs: 'Noise-induced hearing loss is permanent and cumulative. OSHA\'s hearing conservation standard (29 CFR 1910.95) requires a full program when employees are exposed to noise at or above 85 dBA over an 8-hour shift. That includes noise monitoring, audiometric testing, hearing protection, training, and recordkeeping. Most small manufacturing and warehouse operations exceed 85 dBA in at least one area — presses, grinders, saws, pneumatic tools, packaging lines — but have no program in place.',
      whatGetsMissed: [
        'No noise monitoring ever conducted',
        'Hearing protection available but not enforced or fitted',
        'No audiometric testing program for exposed employees',
        'Training on noise hazards never documented',
        'Standard threshold shift detected but no follow-up action taken',
      ],
      whatISee: 'I walk through shops where I have to raise my voice to be heard from three feet away — that\'s roughly 85-90 dBA. Nobody has measured it. Foam earplugs are in a box on the wall but half the operators aren\'t wearing them. There\'s no audiometric testing, no baseline hearing tests, and no training records. The noise has been there for years. The hearing loss has been building the whole time. By the time someone notices, the damage is irreversible.',
      checklist: [
        'Noise monitoring conducted and documented (identify all areas at or above 85 dBA)',
        'Baseline audiogram completed for all exposed employees within 6 months of hire',
        'Annual audiometric testing conducted and compared to baseline',
        'Hearing protection provided at 85 dBA, required and enforced at 90 dBA',
        'Employees trained annually on noise hazards and proper use of hearing protection',
        'Training documented with dates and attendees',
        'Noise exposure and audiometric records maintained per OSHA requirements',
        'Standard threshold shifts identified and follow-up actions documented',
      ],
    },
  },
  'bloodborne-pathogens': {
    title: 'Bloodborne Pathogens',
    subtitle: 'Not Just a Healthcare Problem',
    seo: 'OSHA bloodborne pathogens exposure control plan for small operations in NC. First aid responders, sharps disposal, and what manufacturing shops miss.',
    cfrCitation: '29 CFR 1910.1030',
    oshaChecks: [
      'Written Exposure Control Plan identifying at-risk employees and tasks',
      'Hepatitis B vaccination offered to all employees with occupational exposure',
      'Universal precautions followed — treat all blood/body fluids as infectious',
      'Sharps disposal containers and cleanup supplies accessible',
      'Post-exposure evaluation and follow-up procedures established',
      'Annual training for all employees with occupational exposure',
    ],
    faqSchema: [
      { question: 'Do manufacturing operations need a bloodborne pathogens program?', answer: 'Yes, if any employees have reasonably anticipated occupational exposure to blood or other potentially infectious materials. This includes designated first aid responders, maintenance workers who clean up blood or body fluids, and anyone who could encounter sharps. 29 CFR 1910.1030 applies to all industries, not just healthcare.' },
      { question: 'What is an Exposure Control Plan under OSHA?', answer: 'An Exposure Control Plan is a written document that identifies employees with occupational exposure to bloodborne pathogens, describes the methods the employer uses to reduce exposure (engineering controls, work practices, PPE), and outlines post-exposure procedures. It must be reviewed and updated annually.' },
      { question: 'Does OSHA require Hepatitis B vaccines for first aid responders?', answer: 'Yes. Employers must offer the Hepatitis B vaccination series at no cost to all employees who have occupational exposure to blood or body fluids. Employees may decline, but the declination must be documented in writing.' },
    ],
    relatedNotes: ['ppe-assessment', 'emergency-action-plans', 'recordkeeping-300-log'],
    sections: {
      whatItIs: 'Bloodborne pathogens aren\'t limited to hospitals. OSHA\'s standard (29 CFR 1910.1030) applies to any workplace where employees have reasonably anticipated occupational exposure to blood or other potentially infectious materials. In manufacturing and warehouse operations, that means designated first aid responders, maintenance staff who clean up after injuries, and anyone who handles contaminated sharps or materials. The standard requires a written Exposure Control Plan, Hepatitis B vaccination, training, and proper cleanup and disposal procedures.',
      whatGetsMissed: [
        'No written Exposure Control Plan',
        'First aid responders not identified as having occupational exposure',
        'Hepatitis B vaccination not offered or declination not documented',
        'No sharps containers or proper cleanup kits available',
        'Training not provided or not documented annually',
        'Post-exposure evaluation procedure not established',
      ],
      whatISee: 'I ask who responds when someone gets cut on the floor. Usually it\'s the shift lead or whoever is closest. I ask if they\'ve been offered the Hep B vaccine. They haven\'t. I ask where the bloodborne pathogen cleanup kit is. There isn\'t one — just paper towels and a trash can. The Exposure Control Plan doesn\'t exist because nobody thought the standard applied to a manufacturing shop. It does. Every designated first aid responder is covered.',
      checklist: [
        'Written Exposure Control Plan on file, reviewed annually',
        'All employees with occupational exposure identified by job title and task',
        'Hepatitis B vaccination offered within 10 days of assignment — declinations documented',
        'Universal precautions followed for all blood/body fluid contact',
        'Sharps disposal containers available where needed',
        'Bloodborne pathogen cleanup kits stocked and accessible',
        'Post-exposure evaluation and follow-up procedure in place',
        'Annual training for all exposed employees, documented with dates and names',
        'Contaminated laundry and waste handled per standard requirements',
      ],
    },
  },
  'recordkeeping-300-log': {
    title: 'OSHA Recordkeeping & the 300 Log',
    subtitle: 'The Form Nobody Fills Out Until It Is Too Late',
    seo: 'OSHA 300 log and recordkeeping compliance for small employers in NC. Recordable injuries, 300A summary posting, severe injury reporting, and the citations that follow when the log is missing.',
    cfrCitation: '29 CFR Part 1904',
    kitCrossSell: {
      headline: 'The forms that handle this on the floor.',
      intro: 'Three documents from the GigLine Supervisor Safety Starter System map directly to the recordkeeping requirements in this article. CFR-cited. Print-ready. $600 for the digital kit, included free with every Compliance Readiness Visit.',
      cards: [
        { num: '09', label: 'Monthly Safety Inspection Checklist', body: '40+ items. Signature block. Retention instruction. The corrective action proof you need on file when OSHA asks.' },
        { num: '10', label: 'Employee Training Record Log', body: 'Documents every safety training session — dates, topics, attendees, signatures. The training-record trail OSHA cross-checks against the 300 log.' },
        { num: '07', label: 'If OSHA Shows Up', body: 'Seven-step protocol. Post near the front entrance. What the recordkeeping audit looks like in real time when an inspector walks in.' },
      ],
    },
    oshaChecks: [
      'OSHA 300 log maintained for the current calendar year and the past 5 years',
      'Each recordable injury logged within 7 calendar days of notice',
      '300A annual summary posted from February 1 through April 30 in a visible workplace location',
      'Severe injuries reported to OSHA within required timeframes — fatality (8 hours), inpatient hospitalization / amputation / loss of an eye (24 hours)',
      'Privacy concern cases handled correctly — no employee name on the publicly posted form',
      'Electronic submission of 300A summary completed by March 2 for covered establishments',
    ],
    faqSchema: [
      { question: 'Does every employer have to keep an OSHA 300 log?', answer: 'No. Employers with 10 or fewer employees at all times during the previous calendar year are partially exempt from routine OSHA recordkeeping under 29 CFR 1904.1. Certain low-hazard industries (NAICS codes listed in 1904 Subpart B Appendix A) are also exempt regardless of size. All employers — regardless of size or industry — must still report fatalities, in-patient hospitalizations, amputations, and losses of an eye to OSHA per 1904.39.' },
      { question: 'What counts as an OSHA recordable injury?', answer: 'Under 29 CFR 1904.7, an injury or illness is recordable if it is work-related and results in death, days away from work, restricted work or transfer to another job, medical treatment beyond first aid, loss of consciousness, or a significant injury or illness diagnosed by a licensed health-care professional. First-aid-only cases are not recordable. The definition of first aid is narrow — for example, butterfly bandages count as first aid; sutures do not.' },
      { question: 'When does the 300A summary have to be posted?', answer: 'The 300A annual summary must be posted in a conspicuous location at each establishment from February 1 through April 30 of the year following the year covered. It must be certified by a company executive before posting. Failure to post is one of the most common recordkeeping citations during scheduled inspections.' },
    ],
    relatedNotes: ['hazcom', 'emergency-action-plans', 'bloodborne-pathogens'],
    sections: {
      whatItIs: `OSHA recordkeeping is governed by 29 CFR Part 1904 — the standard that requires employers to record work-related injuries and illnesses on three connected forms: the OSHA 300 (the running log of every recordable case), the OSHA 301 (the incident report for each case, with details OSHA can audit), and the OSHA 300A (the annual summary posted on the workplace bulletin board). The standard sounds simple — write down the injuries, post a summary, keep the records — but it is one of the most under-maintained programs in small operations, and one of the easiest for OSHA to cite because the gap is on paper.

The partial exemption is the first thing to check. Under 1904.1, employers with 10 or fewer employees at any point during the prior calendar year are exempt from routine recordkeeping (they still have to report severe events to OSHA). Certain low-hazard industries are also exempt — see Subpart B Appendix A. Most small manufacturers, warehouses, and contractor operations in the Triad do NOT qualify for the partial exemption. They have 11+ employees and their NAICS code is not on the exempt list. The first question I ask is "what was your peak headcount last year?" — and the answer almost always pulls them into the recordkeeping requirement they did not realize applied to them.

The most-cited recordkeeping subsection is 1904.32 — failure to post or properly complete the 300A annual summary. Every covered employer must post the 300A from February 1 through April 30 each year, in a conspicuous place where employees can see it. The form must be signed and certified by a company executive (CEO, owner, designated official, or supervising official). In small operations, what I most often find is no 300A at all — because there is no 300 log, so there is nothing to summarize. The second most common state is a 300A taped to the breakroom wall from 2019, never updated and never re-posted.

The second most-cited subsection is 1904.29 — failure to record an injury within 7 calendar days. Recordable cases must be entered on the 300 log within 7 days of the employer learning about them. The OSHA 301 incident report (or an equivalent form) must be completed for each case as well. In facilities I walk through, the question "where is your OSHA 300 log?" is often met with a confused look. If the log exists, it is in the HR office, and the last entry is from a previous calendar year — even though Workers' Comp records show three injuries since.

The third area is severe injury reporting under 1904.39. Regardless of recordkeeping exemption status, every employer in the US must report to OSHA: fatalities within 8 hours, and inpatient hospitalizations, amputations, or losses of an eye within 24 hours. These reports go to the OSHA Area Office or the federal 1-800-321-OSHA hotline. A delayed or missed severe injury report is its own citation, and it is one OSHA pursues aggressively because the case usually leads to a follow-up inspection of the underlying hazard.

What an OSHA Compliance Officer checks during a recordkeeping audit: they ask for the OSHA 300 log for the current year and the past five years (the retention requirement under 1904.33). They cross-check the 300 log against Workers' Comp first reports, insurance claims, and any incident reports the employer keeps. They look at the 300A — is it posted? Is it certified? Is the certification date current? They ask whether any case from the past three years involved an inpatient hospitalization, amputation, or eye injury — and they verify whether that report went to OSHA in time. If electronic submission is required (establishments with 250+ employees, or 20+ in certain high-hazard industries), they verify the 300A was submitted to ITA by March 2.

Corrective action: download the current OSHA 300 log, 301 incident form, and 300A summary from osha.gov (free, fillable PDFs). Reconstruct the past five years using whatever incident records you have — Workers' Comp filings, internal incident reports, employee handbook copies of injury notes. Designate one person as the recordkeeping owner. Build a calendar reminder for February 1 every year to certify and post the 300A. Build a calendar reminder for each severe injury reporting requirement so it is not missed if something happens. Train supervisors on what counts as recordable — the line between first aid and medical treatment is narrow and frequently misclassified. Total fix time for a small operation: 4–8 hours of focused work. Total cost: zero, beyond a printer and a clipboard. The cost of getting it wrong: each missing year of records is a separate citation, and the penalty range for recordkeeping violations under 1903.15 reaches $16,550 per item.`,
      whatGetsMissed: [
        'No OSHA 300 log maintained at all — operator assumes the partial exemption applies when it does not',
        'Recordable injuries logged on Workers\' Comp records but never entered on the 300 log',
        '300A annual summary never posted — or posted from a prior year and never updated',
        '300A not certified by a company executive before posting (an executive signature is required, not a clerk\'s)',
        'First aid vs. medical treatment misclassified — sutures, prescription medication, and work restriction often missed',
        'Severe injury reports (fatality, hospitalization, amputation, eye loss) missed or delayed past required timeframes',
        'Records destroyed before the 5-year retention requirement under 1904.33',
        'Privacy concern cases listed by name on the publicly posted 300A',
      ],
      whatISee: 'I ask for the OSHA 300 log on almost every walkthrough. Most of the time it does not exist. The HR lead has never been asked about it, and the office manager assumes "we are too small for that." Headcount is usually well over 10 employees, which means the partial exemption does not apply. I check the breakroom wall — no 300A. I cross-reference the past three years against Workers\' Comp records and find multiple recordable cases the company never logged. When something serious happened — a fingertip amputation in 2023 — nobody called OSHA within 24 hours because nobody knew that requirement existed. None of this is the result of bad faith. It is the result of nobody being assigned the responsibility, and nobody knowing what counts.',
      checklist: [
        'Confirm whether the partial exemption applies (10 or fewer employees AND low-hazard NAICS) — document the determination',
        'OSHA 300 log started for the current calendar year and maintained going forward',
        'Each recordable case entered within 7 calendar days of notice',
        'OSHA 301 incident report (or equivalent) completed for every recordable case',
        '300A annual summary completed, certified by a company executive, and posted Feb 1 through Apr 30',
        'Records retained for the current year plus the previous 5 years',
        'Severe injury reporting procedure in place: 8 hours for fatality, 24 hours for hospitalization / amputation / eye loss',
        'Electronic submission to OSHA ITA completed by March 2 for covered establishments',
        'Supervisor training on the difference between first aid and medical treatment, documented annually',
        'Privacy concern cases handled correctly — no employee name on the publicly posted 300A',
      ],
    },
  },
  // Alias slug for SEO / inbound linking — same content as 'confined-space'
  'ai-generated-safety-programs': {
    title: "An AI-Generated Safety Program Is Not a Working Safety Program",
    subtitle: "What ChatGPT can't see on your floor — and why OSHA can.",
    seoTitle: "AI-Generated Safety Programs vs. OSHA Compliance: What ChatGPT Can't See on Your Floor",
    seo: "Operators are using ChatGPT to generate OSHA safety programs. The output looks compliant — until an inspector arrives. Here's why AI-generated programs fail at the floor level, and what a real walkthrough surfaces that AI cannot.",
    heroImage: '/assets/field-notes/ai-safety-programs-hero.png',
    heroImageAlt: 'AI Can Write a Safety Program. It Cannot Walk Your Floor — GigLine Field Note',
    cfrCitation: 'Applies across General Industry — 29 CFR 1910 · Inspection Methods reference: OSHA Field Operations Manual',
    oshaChecks: [
      'Whether written programs match the equipment and chemicals actually on site',
      'Employee interviews — supervisors and operators asked to describe procedures from memory',
      'Training records traceable to specific employees, dates, and tasks',
      'SDS binder cross-referenced against current chemical inventory',
      'Floor observation matched against written lockout/tagout and machine-specific procedures',
      'Recordkeeping (OSHA 300 log, 300A summary) reconciled against incident history',
    ],
    faqSchema: [
      { question: 'Can I use ChatGPT to write my OSHA safety program?', answer: 'You can use it as a starting point, but an AI-generated safety program does not reflect your actual operation. It does not know your equipment, your chemicals, your training history, or your facility layout. OSHA does not just review your binder — they walk your floor, interview your supervisors, and compare what is written against what is happening. When the two do not match, that gap can become a citation.' },
      { question: 'What does OSHA actually look at during an inspection?', answer: 'OSHA Compliance Officers review paperwork, ask employees questions, observe equipment and work practices, and compare written procedures against the floor reality. They pay close attention to whether supervisors can describe procedures from memory, whether SDS binders match current chemical use, and whether training records can be traced back to specific employees and tasks.' },
      { question: 'Why do AI-generated safety programs fail OSHA inspections?', answer: 'Generic AI-generated programs describe what a compliant operation should look like — they do not prove what your operation actually looks like. They miss site-specific hazards (the unguarded press in the back, the chemical added last month, the lockout step nobody is following). When OSHA sees a polished written program that does not match floor reality, the gap itself becomes evidence.' },
      { question: 'What is the difference between a document and a working safety program?', answer: 'A document describes procedures. A working safety program is what your people do every day. OSHA cites the gap between the two. The fastest way to find that gap is an outside walkthrough — someone who looks at your floor with fresh eyes and compares what they see against what is written.' },
    ],
    relatedNotes: ['hazcom', 'lockout-tagout', 'recordkeeping-300-log'],
    sections: {
      whatItIs: `A lot of operators are using ChatGPT and similar tools to generate safety programs right now. The output may look legitimate. It may cite real OSHA standards. The formatting may be clean. You can print it, put it in a binder, and feel like the box is checked.

The problem is this: OSHA does not just look at your binder. OSHA looks at your operation.

An AI-generated program does not know your equipment. It does not know about the machine in the back corner with a missing guard. It does not know your employees are skipping lockout steps because nobody showed them the correct process. It does not know your SDS binder lists chemicals you no longer use while missing chemicals used every day.

A generic program describes what a compliant operation should look like. It does not prove what your operation actually looks like.

When an OSHA compliance officer walks in, they may review paperwork, ask employees questions, observe equipment, and compare written procedures against what is happening on the floor. When the paperwork and the work do not match, that gap can become a problem.

The document is not the program. The program is what your people do every day.

If you used AI to generate safety documentation — or you are not sure whether your safety program reflects your current operation — GigLine Safety & Compliance can help you find out where you stand. A GigLine walkthrough provides a practical review of visible safety gaps, documentation concerns, and corrective action priorities. No software to learn. No generic binder talk. Just ground truth from the floor.`,
      whatGetsMissed: [
        'The unguarded machine in the back corner — never appears in any AI-generated written program',
        'Employees skipping lockout/tagout steps because the AI program does not match the equipment',
        'SDS binders that include chemicals removed from service and miss chemicals added last month',
        'Training records that reference generic AI-suggested topics, not the actual equipment in use',
        'Written procedures that describe a different facility — wrong square footage, wrong layout, wrong hazards',
        'Lockout-tagout procedures with no machine-specific energy isolation — generic boilerplate that would not pass an inspection',
        'Employees and supervisors who cannot describe procedures the written program says they should follow',
      ],
      whatISee: 'When I walk an operation with AI-generated documentation, the binder usually looks polished. Real OSHA standards are cited. Formatting is clean. Then I ask the floor supervisor to describe the lockout procedure for the press they ran this morning — and they cannot. I check the SDS binder against the chemical drum I just walked past — and it is not in there. The gap between the document and the work is exactly what an inspector will find.',
      checklist: [
        'Walk your floor with the written program in hand — note any equipment, chemical, or procedure that does not match',
        'Verify SDS binder matches current chemical inventory: remove old, add new, date the update',
        'Ask 2-3 supervisors to describe lockout/tagout for a specific machine from memory — compare to the written procedure',
        'Confirm training records show specific employees, specific dates, specific equipment — not generic topic lists',
        'Cross-check every OSHA standard cited in your written program against the equipment, chemicals, and processes actually present',
        'Check whether your written program matches your facility — square footage, layout, number of exits, type of operations',
        'Test it: ask yourself, if OSHA walked in today, would what is in this binder match what they would see on the floor?',
        'If the document and the work do not match — schedule a walkthrough before an inspector does it for you',
      ],
    },
  },
  'respiratory-protection': {
    title: 'Respiratory Protection',
    subtitle: 'The Fit Test Nobody Did',
    seo: 'OSHA respiratory protection program requirements for small manufacturers in NC. Written program, medical evaluation, fit testing, and training — the five-piece program most small operations are missing.',
    cfrCitation: '29 CFR 1910.134',
    oshaChecks: [
      'Written respiratory protection program tailored to the facility',
      'Hazard assessment identifying every task requiring respiratory protection',
      'Medical evaluation completed before fit testing — current within program requirements',
      'Annual fit testing for tight-fitting respirators, documented per employee and respirator model',
      'Training on proper use, limitations, cleaning, maintenance, and disposal',
      'Cartridge change-out schedule for chemical cartridges based on use conditions',
    ],
    faqSchema: [
      { question: 'When does OSHA require a respiratory protection program?', answer: 'OSHA requires a written respiratory protection program any time employees are required to wear respirators — including filtering facepiece respirators (N95s) used to protect against airborne hazards. Voluntary use of dust masks for nuisance dust still triggers Appendix D notification requirements under 29 CFR 1910.134.' },
      { question: 'Do employees need a medical evaluation before wearing a respirator?', answer: 'Yes. 29 CFR 1910.134(e) requires a medical evaluation by a Physician or Other Licensed Health Care Professional (PLHCP) before an employee is fit tested or required to wear a respirator. The OSHA medical evaluation questionnaire in Appendix C can be used at no cost — but the PLHCP review is required.' },
      { question: 'How often is fit testing required?', answer: 'Fit testing is required before initial use, whenever a different respirator model is used, and at least annually thereafter. It must be repeated when the wearer reports changes in physical condition that could affect fit — weight change, dental work, facial scarring, or cosmetic surgery.' },
    ],
    relatedNotes: ['ppe-assessment', 'hazcom', 'silica-respirable-crystalline'],
    sections: {
      whatItIs: `OSHA 29 CFR 1910.134 is the respiratory protection standard, and it carries one of the most extensive program requirements of any general industry standard. If your operation requires employees to wear any tight-fitting respirator — including the N95 filtering facepiece — you owe a five-piece program: a written respiratory protection plan, a hazard assessment, medical evaluation for every wearer before fit testing, annual fit testing, and documented training. Miss any one of those five pieces and the citation writes itself.

The hazard assessment is the foundation. Before requiring a respirator, the employer has to determine that the airborne contaminant exposure exceeds a permissible exposure limit (PEL) or that a respirator is otherwise needed to protect employee health. That assessment should reference air sampling data when available, manufacturer SDS guidance for chemical exposures, and a written rationale for the type of respirator selected. In small fabrication and woodworking shops in the Triad, I almost never see a written hazard assessment — the dust mask is bought, distributed, and worn, and the file is empty.

The medical evaluation is the most frequently skipped piece. Before any employee wears a tight-fitting respirator, a Physician or Other Licensed Health Care Professional (PLHCP) must review a medical questionnaire (OSHA provides the form in Appendix C). The PLHCP issues a written opinion clearing the employee for respirator use. This is non-negotiable — respirator use places a measurable cardiopulmonary load on the wearer, and OSHA does not allow employers to substitute their own judgment for a medical professional's. The questionnaire and review can be handled remotely through occupational health services for under $50 per employee. Most small operations skip the step entirely.

Fit testing comes after the medical clearance. Tight-fitting respirators — including all N95 filtering facepiece respirators — must be fit tested using either a qualitative protocol (saccharin, Bitrex, or irritant smoke) or a quantitative protocol (PortaCount instrument). Fit tests must be performed before initial use, whenever a different respirator make or model is used, and at least annually thereafter. The fit test record must include the employee name, the test date, the respirator make/model/size, the protocol used, and the result. In the operations I walk through, fit tests are either undocumented or performed once on hire and never repeated.

Training rounds out the program. Annual training is required on respirator capabilities and limitations, proper donning and doffing, seal checks, cleaning and maintenance, cartridge change-out schedules for chemical cartridges, and signs of respirator failure. Training must be documented with employee names, dates, topics, and trainer credentials. A 15-minute toolbox talk every year — properly documented — satisfies the requirement.

Corrective action for a small operation: draft a one-page written program using the OSHA template (a quick search for "OSHA respiratory protection program template" returns usable starting points), conduct a written hazard assessment, send the OSHA Appendix C questionnaire to every respirator user, get the PLHCP review done, schedule annual fit tests with a local occupational health vendor or train a designated employee to administer qualitative fit tests in-house, and run annual training. Total cost for a 20-employee operation: under $2,000 the first year. Cost of a willful citation under 1910.134: up to $165,514 per item.`,
      whatGetsMissed: [
        'No written respiratory protection program — the binder is empty',
        'Hazard assessment never performed or never documented',
        'Medical evaluation skipped — employees go straight to fit testing or straight to use',
        'Fit testing performed once on hire and never repeated annually',
        'Voluntary N95 users not given the Appendix D notification (a citable gap even when the respirator is "voluntary")',
        'Beard or facial hair growth in the seal area — automatic seal failure',
        'Cartridges left in service past change-out schedule — no documented schedule at all',
      ],
      whatISee: 'I walk into a fab shop and find a box of N95s on a shelf with no program in place. The supervisor tells me they "give them out as needed." I ask if anyone has been medically cleared to wear one — no. I ask when fit tests were last done — never. I check the SDS for the welding rod in use — it specifies a half-face respirator with P100 cartridges for the operation being performed. Nobody is wearing one. The full program would have caught all of this. The empty binder caught none of it.',
      checklist: [
        'Written respiratory protection program on file, signed and dated by the program administrator',
        'Hazard assessment completed for every task that may require respiratory protection',
        'Medical evaluation (PLHCP review of Appendix C questionnaire) completed before fit testing for every respirator user',
        'Initial fit test performed for every employee on the specific respirator model issued',
        'Annual fit test performed and documented for every tight-fitting respirator user',
        'Annual training documented with names, dates, and topics',
        'Cartridge change-out schedule established and documented for chemical cartridges',
        'Voluntary respirator users provided Appendix D notification',
        'Respirators inspected before each use; damaged respirators removed from service',
        'Beard policy in place for tight-fitting respirator users',
      ],
    },
  },
  'silica-respirable-crystalline': {
    title: 'Respirable Crystalline Silica',
    subtitle: 'The 50 µg/m³ Limit Nobody Measured',
    seo: 'OSHA respirable crystalline silica standard (1910.1053) for small operations in NC. Exposure assessment, engineering controls, medical surveillance, and the written exposure control plan most stone and concrete shops are missing.',
    cfrCitation: '29 CFR 1910.1053 (general industry) · 29 CFR 1926.1153 (construction)',
    oshaChecks: [
      'Exposure assessment — air sampling or objective data establishing exposure levels',
      'Written exposure control plan identifying tasks, controls, and protective measures',
      'Engineering controls (water suppression, LEV) per Table 1 or alternative exposure assessment',
      'Respiratory protection program when controls cannot reduce exposure below PEL',
      'Medical surveillance for employees exposed at or above the action level for 30+ days/year',
      'Annual training on silica hazards, controls, and medical surveillance',
    ],
    faqSchema: [
      { question: 'What is the OSHA silica exposure limit?', answer: 'The OSHA permissible exposure limit (PEL) for respirable crystalline silica is 50 micrograms per cubic meter of air (50 µg/m³) averaged over an 8-hour shift. The action level — which triggers exposure assessment and medical surveillance requirements — is 25 µg/m³.' },
      { question: 'Which operations are covered by the silica standard?', answer: 'Any operation where employees may be exposed to respirable crystalline silica. Common examples include concrete cutting and grinding, stone fabrication (countertops, monuments), sandblasting, foundry operations, brick and block work, and any task that disturbs materials containing crystalline silica.' },
      { question: 'What is the Table 1 approach in the construction standard?', answer: 'Construction operations covered by 29 CFR 1926.1153 can comply by following Table 1 — specified exposure control methods (water suppression, dust collection) and respiratory protection for listed tasks. Following Table 1 fully eliminates the need for exposure assessment for those tasks. General industry operations under 1910.1053 do not have a Table 1 option — they must perform exposure assessments.' },
    ],
    relatedNotes: ['respiratory-protection', 'hazcom', 'ppe-assessment'],
    sections: {
      whatItIs: `Respirable crystalline silica is the fine fraction of silica dust that can reach deep into the lungs and cause silicosis, lung cancer, COPD, and kidney disease. OSHA tightened the silica standard in 2016, dropping the general industry permissible exposure limit (PEL) from roughly 100 µg/m³ down to 50 µg/m³ — a 50% reduction — and adding action-level requirements (exposure assessment, medical surveillance) at 25 µg/m³. The standard applies in two parallel versions: 29 CFR 1910.1053 covers general industry and maritime, and 29 CFR 1926.1153 covers construction. Stone fabrication shops (countertops, monuments), foundries, concrete cutting and grinding operations, brick and block masonry, abrasive blasting with silica-containing media, and any operation that mills, drills, saws, or grinds material containing crystalline silica is potentially in scope.

The exposure assessment is the first compliance step. Under 1910.1053(d), the employer must assess employee exposure to respirable crystalline silica for every employee who may be exposed at or above the action level. Two paths exist: a performance option (any combination of air monitoring data and objective data sufficient to characterize exposure) or a scheduled monitoring option (initial monitoring, then periodic monitoring at frequencies that depend on the result). Most small Triad-area stone fab shops have never performed any monitoring. They do not know whether they are below the action level, between action level and PEL, or above the PEL — which means they cannot comply with any of the downstream requirements either.

The written exposure control plan is required under 1910.1053(f)(2) for any employer with workers exposed at or above the action level. The plan must identify the tasks involving silica exposure, the engineering controls and work practices used for each task, the housekeeping measures, and the procedures for restricting access to high-exposure areas. It is not boilerplate — it has to describe the actual operation. Most plans I have reviewed in stone fab shops are downloaded templates with the original company's name still in the header.

Engineering controls drive the compliance strategy. Water suppression (wet cutting, wet grinding) and local exhaust ventilation (LEV) with HEPA-filtered vacuums are the two primary control methods. Dry cutting of natural or engineered stone without water suppression and without a HEPA-filtered shroud-and-vacuum system will exceed the PEL almost universally. In the operations I walk through, dry cutting is still happening — operators wearing a paper dust mask, no LEV, no water — and the exposure is unmeasured but almost certainly above the PEL by a factor of five or more.

Medical surveillance under 1910.1053(i) is required for any employee exposed at or above the action level for 30 or more days per year. It includes a baseline medical examination (medical history, physical exam, chest X-ray, pulmonary function test, tuberculosis test, and other tests deemed necessary by the PLHCP) and subsequent exams at least every three years. The employer must offer the exam at no cost and during regular working hours. Most small operations have no surveillance program — and most have employees who would test positive on a baseline X-ray for early silicosis if they were screened today.

Corrective action: schedule a qualified industrial hygienist to perform initial air monitoring (about $300 to $800 per sample, several samples needed to characterize a small operation). Use the results to drive the rest of the program — written plan, engineering controls, respiratory protection where controls cannot eliminate exposure, medical surveillance for exposed workers, annual training. The capital investment in water-fed saws or LEV-equipped shrouds is real ($1,500 to $8,000 depending on operation size) but is far less than the cost of a willful silica citation (up to $165,514 per item) or a silicosis claim filed by a former employee.`,
      whatGetsMissed: [
        'No exposure assessment ever performed — employer cannot demonstrate compliance with the PEL',
        'No written exposure control plan, or a generic template with no facility specifics',
        'Dry cutting of stone, concrete, or masonry with no water suppression and no LEV',
        'HEPA-filtered vacuums replaced with shop vacuums (which do not capture respirable silica)',
        'Respiratory protection used as a primary control instead of engineering controls',
        'Medical surveillance not offered — or offered but not documented as offered',
        'Housekeeping by dry sweeping or compressed air (both prohibited under the standard)',
        'Construction operations relying on Table 1 without actually meeting Table 1 conditions',
      ],
      whatISee: 'I walk into a small countertop fab shop and find one operator dry cutting a quartz slab. He is wearing a single-strap paper dust mask. There is no LEV at the saw, no water bath, no exhaust. There is dust on every horizontal surface and on the operator\'s clothes. The shop has no written exposure control plan, no air monitoring records, and no medical surveillance — and the owner does not know the standard applies to engineered stone (it does, and the exposure on engineered stone is often higher than on natural stone). This is the single highest-risk silica exposure I see in the Triad.',
      checklist: [
        'Exposure assessment completed for every task that may generate respirable crystalline silica',
        'Written exposure control plan customized to the facility, reviewed annually',
        'Engineering controls (water suppression, LEV with HEPA) in place for primary silica-generating tasks',
        'Wet methods or HEPA-filtered vacuums used for housekeeping — no dry sweeping or compressed air',
        'Respiratory protection program in place where controls cannot reduce exposure below the PEL',
        'Medical surveillance offered to every employee exposed at or above the action level for 30+ days/year, documented',
        'Annual training on silica hazards, controls, and medical surveillance',
        'Restricted-access signs posted at high-exposure areas',
        'Recordkeeping: air monitoring data, exposure assessments, and medical surveillance records retained per standard',
      ],
    },
  },
  'hot-work-welding': {
    title: 'Hot Work, Welding & Cutting',
    subtitle: 'The Fire Watch That Walked Off',
    seo: 'OSHA welding, cutting, and brazing requirements (29 CFR 1910 Subpart Q) for small fabrication shops in NC. Hot work permits, fire watch, compressed gas cylinders, ventilation, and PPE — the five-point program that almost every fab shop is missing pieces of.',
    cfrCitation: '29 CFR 1910 Subpart Q (1910.251–1910.255) · NFPA 51B (Hot Work Permits)',
    oshaChecks: [
      'Hot work permit system for any cutting, welding, or grinding outside of a designated hot work area',
      'Fire watch posted during and 30+ minutes after hot work in non-designated areas',
      '35-foot combustible-clearance zone or fire-resistant guards around hot work',
      'Compressed gas cylinders secured upright, capped when not in regulator-connected',
      'Eye, face, and skin protection appropriate to the process (Z87.1 welding helmets, leather)',
      'Local exhaust ventilation when welding stainless, galvanized, or other higher-toxicity metals',
    ],
    faqSchema: [
      { question: 'Does OSHA require a hot work permit?', answer: 'OSHA 29 CFR 1910.252(a)(2)(iv) does not use the phrase "hot work permit" by name, but it requires the employer to control fire hazards during welding and cutting. The widely accepted compliance method is a written hot work permit program based on NFPA 51B. Hot work permits are essentially universal in any operation with insurance coverage — most carriers require them.' },
      { question: 'How long does a fire watch need to stay after welding?', answer: 'NFPA 51B and OSHA guidance require a fire watch during hot work in non-designated areas and for at least 30 minutes after hot work is completed. Some authorities and insurers require 60 minutes. The fire watch must have access to extinguishing equipment and must be trained to use it.' },
      { question: 'How should compressed gas cylinders be stored?', answer: 'Compressed gas cylinders must be stored upright, secured (chain or strap) against tipping, with valve protection caps in place when not in service. Oxygen cylinders must be stored at least 20 feet from fuel-gas cylinders or separated by a fire-resistant barrier at least 5 feet high with a 30-minute fire rating, per 29 CFR 1910.253(b)(4).' },
    ],
    relatedNotes: ['ppe-assessment', 'eye-face-protection', 'machine-guarding'],
    sections: {
      whatItIs: `Welding, cutting, brazing, and grinding fall under OSHA Subpart Q (29 CFR 1910.251 through 1910.255). The standard covers fire prevention, ventilation, compressed gas cylinders, electrical safety for arc welding, eye and face protection, and protective clothing. Every Triad-area fab shop, machine shop, and any operation that runs even an occasional torch or grinder is subject to some portion of this subpart — and every one of them I have walked into has a gap somewhere in the five-point program.

Fire prevention is the highest-stakes piece. OSHA 1910.252(a) requires the employer to establish areas where hot work can be performed safely (a "designated hot work area" with non-combustible floors and surfaces, no combustible storage within 35 feet, and adequate ventilation). For hot work performed outside a designated area, the employer must: remove combustibles within 35 feet, cover what cannot be moved with fire-resistant guards, post a fire watch during the work, and maintain the fire watch for at least 30 minutes after work is completed. NFPA 51B — the recognized industry standard — formalizes this into a written hot work permit program. Insurance carriers and many customer audits require it explicitly. In small fab shops I walk through, hot work is happening anywhere there is room for the operator to stand. There is no designated area, no permit, no fire watch — just an operator, a torch, and a stack of wooden pallets eight feet away.

Compressed gas cylinder safety under 1910.253 is the second most-cited area. Cylinders must be stored upright, secured against tipping (chain or strap, not just leaning), with valve protection caps in place when the cylinder is not connected to a regulator. Oxygen and fuel-gas cylinders must be separated in storage — at least 20 feet apart, or by a 5-foot-tall fire-resistant barrier. Cylinders cannot be stored near combustible materials, in unventilated rooms, or in temperatures above 125°F. In nearly every fab shop I walk through, at least one cylinder is unsecured, valve caps are off and missing entirely, and oxygen and fuel cylinders are mixed in the same rack.

Ventilation under 1910.252(c) is the silent failure. Welding fumes — especially from galvanized steel (zinc fume fever), stainless steel (hexavalent chromium), and any coated or painted material — require local exhaust ventilation or respiratory protection. Welding hexavalent chromium under 1910.1026 requires written exposure control and exposure assessment in addition to the welding standard. The PEL for hexavalent chromium is 5 µg/m³ averaged over an 8-hour shift, with an action level of 2.5 µg/m³. Stainless welding without LEV will exceed both. Most small shops have a single overhead fan, no LEV at the welding station, and no respirator program.

Eye, face, and skin protection requirements are listed in 1910.252(b)(2). Welding helmets must meet ANSI Z87.1, with shade numbers appropriate to the process and amperage (shade 10 minimum for stick welding at moderate amperage, higher shades for higher amperage and TIG). Bystanders within range of the arc require welding curtains or screens. Leather sleeves, gloves, and aprons are required for any process generating spatter. Grinding requires Z87.1-rated goggles plus a face shield. In the shops I walk through, helmets are present but mismatched to the process, and grinding is routinely done in safety glasses alone — no face shield.

Corrective action: implement a written hot work permit program based on NFPA 51B, designate a hot work area, establish a permit-issuing authority (usually the supervisor on shift), train a fire watch on every shift, audit cylinder storage daily and fix violations on the spot, install LEV at the welding station for any work on coated or stainless material, perform a hazard assessment for the welding processes in use, and update PPE accordingly. Total fix time for a small fab shop: 1 to 2 weeks of focused work. Total cost: under $5,000 in equipment for a typical 5-station shop. Cost of a fire that destroys a building: total loss.`,
      whatGetsMissed: [
        'No hot work permit program — torches and grinders running anywhere in the shop without authorization',
        'Fire watch not posted, or posted but leaves immediately when the welder stops',
        'Combustibles within 35 feet of hot work — wooden pallets, cardboard, plastic, fuel containers',
        'Compressed gas cylinders unsecured, valve caps missing, oxygen mixed with fuel gas',
        'Welding stainless or galvanized without LEV — hexavalent chromium and zinc fume exposures undocumented',
        'Welding curtains missing — bystanders exposed to arc flash and UV',
        'Grinding in safety glasses with no face shield — eye and face injuries every year',
        'Welding leads with damaged insulation in service — shock and arc hazard',
      ],
      whatISee: 'I walk into a fab shop and find a welder running stainless TIG at 180 amps with no LEV — the fume cloud rises straight to the ceiling and hangs there. Twenty feet away, another operator is grinding without a face shield. In the corner, three oxygen cylinders and two acetylene cylinders are leaned against the wall, unsecured, with no valve caps. A wooden workbench sits ten feet from a third welding station. There is no hot work permit, no fire watch, and no written program for any of it.',
      checklist: [
        'Written hot work permit program (NFPA 51B-based) in place',
        'Designated hot work area established with non-combustible floor and adequate ventilation',
        'Fire watch trained, posted during hot work in non-designated areas, and stays 30+ minutes after',
        '35-foot combustible-clearance zone or fire-resistant guards in place during hot work',
        'Compressed gas cylinders stored upright, secured, valve caps in place when not in service',
        'Oxygen and fuel-gas cylinders separated by 20 feet or by a 5-foot fire-resistant barrier',
        'Local exhaust ventilation at welding stations handling galvanized, stainless, or coated materials',
        'Welding helmets Z87.1-rated and matched to process amperage; bystander curtains in place',
        'Hexavalent chromium and other process-specific exposure assessments completed where applicable',
        'Annual training documented for all welders, cutters, and fire watch personnel',
      ],
    },
  },
  'abrasive-wheels': {
    title: 'Abrasive Wheels & Bench Grinders',
    subtitle: 'The Tongue Guard at 1/8 of an Inch',
    seo: 'OSHA abrasive wheel safety requirements (29 CFR 1910.215) for bench grinders in small NC shops. Tongue guards, work rests, ring testing, and RPM limits — one of the most specific and most violated OSHA standards.',
    cfrCitation: '29 CFR 1910.215',
    oshaChecks: [
      'Tongue guard adjustable to within 1/4 inch of the wheel',
      'Work rest adjusted to within 1/8 inch of the wheel',
      'Side guards covering at least 75% of the wheel diameter',
      'Wheel RPM rating matching or exceeding the grinder spindle RPM',
      'Ring test performed before mounting any new wheel',
      'Wheel run for at least one minute before use after mounting',
    ],
    faqSchema: [
      { question: 'How close should the tongue guard be on a bench grinder?', answer: 'OSHA 29 CFR 1910.215(b)(9) requires the tongue guard (the upper movable guard that follows the wheel as it wears) to be kept adjustable to within 1/4 inch of the wheel surface. The work rest below the wheel must be adjusted to within 1/8 inch of the wheel.' },
      { question: 'What is a ring test on a grinding wheel?', answer: 'A ring test is performed before mounting any new abrasive wheel. The wheel is suspended on a finger or a thin rod and tapped lightly with a non-metallic object — a wood handle works. A sound wheel rings clearly. A cracked wheel produces a dull thud. The standard requires this test under 29 CFR 1910.215(d)(1) — it takes 10 seconds and is almost never done.' },
      { question: 'Why does the wheel RPM matter?', answer: 'Every abrasive wheel is rated for a maximum RPM stamped on the wheel or the blotter. If the spindle RPM of the grinder exceeds the wheel RPM, the wheel can disintegrate during operation — the centrifugal force exceeds the bond strength of the wheel. Always verify the wheel rating is equal to or greater than the spindle RPM before mounting.' },
    ],
    relatedNotes: ['machine-guarding', 'eye-face-protection', 'ppe-assessment'],
    sections: {
      whatItIs: `29 CFR 1910.215 is one of the most specific OSHA standards in general industry. The standard governs abrasive wheels — bench grinders, pedestal grinders, swing-frame grinders, and any wheel-type abrasive tool — and it lists exact dimensional tolerances that an inspector can measure on the spot. The most-cited subsections are 1910.215(a)(4) — work rest adjustment — and 1910.215(b)(9) — tongue guard adjustment. Both can be checked with a feeler gauge in under a minute, and both fail in the majority of small shops I walk through.

The work rest must be adjusted to within 1/8 inch of the wheel. If the gap is wider, the workpiece can wedge between the rest and the wheel and pull the operator's hand into the wheel. As the wheel wears down through use, the gap grows. Operators do not stop and re-adjust because it slows them down. Within a week of use, almost every bench grinder I see has a gap of 1/2 inch or more. That is a citation, and it is a hand-injury hazard.

The tongue guard is the upper adjustable guard that follows the wheel as it wears. It must be kept adjustable to within 1/4 inch of the wheel surface. Most tongue guards are factory-set, never adjusted again, and as the wheel wears down the gap opens to 1 to 2 inches. That gap exposes the operator to wheel fragments if the wheel breaks during use.

Side guards (the fixed peripheral and side enclosures) must cover at least 75% of the wheel diameter. Many older grinders have side guards missing entirely or modified by previous owners. A bench grinder without a side guard cannot be brought into compliance with a feeler gauge — it needs the part installed.

Ring testing is required before any wheel is mounted. Most shop hands have never heard of it. The procedure: suspend the wheel on a finger or a thin rod (not against your hand or any padded surface), tap lightly with a non-metallic object, and listen. A sound wheel rings — like a small bell. A cracked wheel produces a dull thud. A cracked wheel mounted to a grinder spinning at 3,450 RPM is a fragmentation event waiting to happen, and those fragments leave the wheel at the speed of a slow-moving handgun bullet.

RPM matching is the last critical check. Every wheel has a maximum operating speed stamped on the blotter or the wheel itself. Every grinder has a spindle speed listed on the motor plate. If the wheel rating is less than the spindle speed, the wheel will fail in service. Always check both and confirm the wheel rating is equal to or higher than the spindle speed. Mismatched wheels are a recurring finding in shops that buy wheels by diameter and arbor size without checking ratings.

Corrective action: adjust every grinder in the shop right now — work rest to 1/8 inch, tongue guard to 1/4 inch. Replace missing side guards. Train every operator on the ring test, the RPM check, and the requirement to run a new wheel for at least one minute before use. Re-train when grinders are added. Document the training. Add a daily pre-shift check of each grinder to the supervisor's routine. Total cost: a feeler gauge, a few replacement guards, and 30 minutes of training time. Total time: one shift. Penalty for ignoring this standard during an OSHA visit: up to $16,550 per grinder, per missing tolerance.`,
      whatGetsMissed: [
        'Work rest gap larger than 1/8 inch — the most common citation under this standard',
        'Tongue guard gap larger than 1/4 inch — runner-up citation',
        'Side guards missing or modified — operator exposed to wheel fragmentation',
        'Ring test never performed before mounting new wheels',
        'Wheel RPM rating not verified against spindle RPM',
        'New wheels not run for the required one minute before initial use',
        'Operators using bench grinders with no eye or face protection',
        'Damaged or chipped wheels left in service',
      ],
      whatISee: 'I bring a feeler gauge to every walkthrough that involves a fab shop or machine shop. Every bench grinder I find has at least one tolerance out of spec. The work rest is usually 1/2 to 3/4 inch from the wheel. The tongue guard is rarely adjusted at all. Ring testing is universally unknown — when I ask about it, the response is "we just put the wheel on and use it." Wheels are stored on a shelf, sometimes stacked on top of each other, sometimes leaning against a wall. Cracked wheels go unnoticed. This standard is the easiest fix in OSHA — and the most ignored.',
      checklist: [
        'Work rest adjusted to within 1/8 inch of the wheel on every grinder',
        'Tongue guard adjusted to within 1/4 inch of the wheel on every grinder',
        'Side guards in place and covering at least 75% of the wheel diameter',
        'Wheel RPM rating verified against spindle RPM before mounting any wheel',
        'Ring test performed on every new wheel before mounting',
        'New wheel run for at least one minute under guard before operator approaches',
        'Eye protection (Z87.1) and face shield available and used at every grinder',
        'Wheel storage area protected from impact, moisture, and heat',
        'Damaged or chipped wheels removed from service immediately',
        'Daily pre-shift visual check of every grinder by the supervisor on shift',
      ],
    },
  },
  'ladder-safety': {
    title: 'Portable Ladder Safety',
    subtitle: 'The 4-to-1 Rule Nobody Remembers',
    seo: 'OSHA portable ladder safety requirements (29 CFR 1910.23) for small operations in NC. Inspection, the 4-to-1 angle rule, three-point contact, and what disqualifies a ladder from service — top citations in general industry.',
    cfrCitation: '29 CFR 1910.23 (general industry) · 29 CFR 1926.1053 (construction)',
    oshaChecks: [
      'Ladders inspected before each use; damaged ladders tagged out of service',
      'Extension ladders set at the 4-to-1 ratio (1 foot out for every 4 feet up)',
      'Extension ladders extending at least 3 feet above the upper landing surface',
      'Three-point contact maintained while climbing (two hands and one foot, or two feet and one hand)',
      'Ladder rated for the user weight plus tools and materials',
      'Ladders not used on slippery or unstable surfaces, or in high-wind conditions outdoors',
    ],
    faqSchema: [
      { question: 'What is the 4-to-1 rule for extension ladders?', answer: 'The 4-to-1 rule means the base of an extension ladder should be set out from the upper support by 1 foot for every 4 feet of working ladder length. A ladder reaching a 16-foot support should be set with its base 4 feet from the wall. This produces approximately a 75-degree angle — the safest climbing angle. Required under 29 CFR 1926.1053(b)(5)(i) and recommended in 1910.23.' },
      { question: 'When does an extension ladder need to extend above the landing?', answer: 'When an extension ladder is used for access to an upper landing surface, the side rails must extend at least 3 feet above the upper landing. This gives the user something to hold onto when stepping off the ladder. Required by 29 CFR 1926.1053(b)(1) and a frequent citation when missing.' },
      { question: 'When does a ladder have to be removed from service?', answer: 'A ladder must be removed from service when it has any of the following: cracked or broken side rails, missing or broken rungs, broken or damaged feet, bent or cracked support brackets, or any defect that would impair safe use. The ladder must be tagged "Do Not Use" and removed from the work area until repaired or destroyed.' },
    ],
    relatedNotes: ['fall-protection', 'walking-surfaces', 'scaffolding-safety'],
    sections: {
      whatItIs: `Portable ladder safety is governed under 29 CFR 1910.23 in general industry and 29 CFR 1926.1053 in construction. The two standards share most requirements: inspection before use, proper angle of setup, extension above the landing surface, three-point contact climbing, and load rating compliance. Ladders are present in nearly every operation — warehouse, manufacturing, contractor — and ladder violations are consistently in OSHA's top 10 most cited standards every year.

The most-cited subsection is "improper use." The 4-to-1 rule for extension ladders means the base sits 1 foot out from the upper support for every 4 feet of working ladder length. That produces approximately a 75-degree angle. Steeper than that, the ladder tips backward when the climber leans away. Shallower than that, the base slides out when weight is applied. Most operators set the ladder at whatever angle "looks about right" — usually closer to 60 degrees in my experience, because it feels more stable to the person on the ground. From the climber's perspective at the top, that shallow angle becomes obvious — and dangerous — only when the base slips.

Extension above the upper landing is the second most-cited issue. When an extension ladder provides access to a roof, mezzanine, or elevated surface, the side rails must extend at least 3 feet above the landing. This gives the climber a handhold while transitioning on or off the ladder. A ladder cut too short — or extended too short — forces the climber to step from the top rung onto the landing with no handhold, and that step accounts for a large fraction of ladder fall injuries.

Inspection before use is the third area. Ladders develop defects through use: cracked side rails, bent rungs, damaged feet, broken support brackets on step ladders, loose or missing rivets. A ladder with any of these defects must be tagged "Do Not Use" and removed from the work area. In the operations I walk through, damaged ladders are leaning against a wall in regular use — nobody has tagged them, nobody has removed them.

Three-point contact is the climbing rule that prevents most fall incidents. Either two hands and one foot, or two feet and one hand, must be in contact with the ladder at all times during ascent and descent. That means tools and materials must be carried by hoist, by tool belt with attachment lanyard, or by a second person — not held in the climber's free hand. Climbing with a tool or a five-gallon bucket in one hand is one of the most consistent unsafe practices in small shops.

Load rating matters because operators choose ladders by length, rarely by load capacity. Type IAA (375 lb), Type IA (300 lb), Type I (250 lb), Type II (225 lb), and Type III (200 lb) ratings are stamped on every ladder. The capacity includes the climber plus tools and materials carried up. A 250-lb-rated ladder with a 230-lb climber carrying a 30-lb pail of paint is overloaded. Older fiberglass ladders often weather and lose strength — even those ratings degrade over time.

Corrective action for a small operation: inventory every ladder in the shop. Inspect each one. Tag and remove damaged ladders. Train operators on the 4-to-1 setup, extension above landing, three-point contact, and load-rating awareness. Add daily pre-use inspection to the toolbox talk. Replace any ladder that has weathered or developed defects. Total cost: under $1,000 for a typical small operation. Total time: a single half-day audit.`,
      whatGetsMissed: [
        'Extension ladders set at the wrong angle — too steep or too shallow',
        'Extension ladders not extending 3 feet above the upper landing',
        'Damaged ladders left in service — cracked rails, broken rungs, missing feet',
        'Three-point contact broken — climbers carrying tools or materials in one hand',
        'Step ladders used as straight ladders (rails leaned against a wall) — a defeating-the-design violation',
        'Ladders used on uneven, slippery, or unstable surfaces with no base stabilization',
        'Aluminum ladders used near energized electrical work — conductive hazard',
        'Top step or top cap of a step ladder used as a standing platform',
      ],
      whatISee: 'I walk through a warehouse and find a 20-foot extension ladder leaning at maybe 55 degrees against a mezzanine — too shallow. The top of the ladder is at the level of the landing, with nothing extending above it. The rubber feet on the bottom are worn smooth. A worker climbs it carrying a small toolbox in one hand. Half the step ladders in the shop are missing their spreader-bar locks. Two are cracked along the rails. None of them have been tagged out. The standard is straightforward; the practice is not.',
      checklist: [
        'Every ladder inspected for damage before each use',
        'Damaged ladders tagged "Do Not Use" and removed from the work area',
        'Extension ladders set at the 4-to-1 ratio',
        'Extension ladders extend at least 3 feet above the upper landing',
        'Three-point contact maintained on all ascents and descents',
        'Tools and materials carried by hoist, tool belt, or second person — not in a free hand',
        'Step ladders used only in the fully open position with spreader bar locked',
        'Top step and top cap of step ladders never used as standing surfaces',
        'Ladder load rating matched to the climber plus tools and materials',
        'Aluminum ladders kept clear of energized electrical work',
      ],
    },
  },
  'eye-face-protection': {
    title: 'Eye & Face Protection',
    subtitle: 'Safety Glasses Are Not a PPE Program',
    seo: 'OSHA eye and face protection requirements (29 CFR 1910.133) for small NC operations. Z87.1 markings, side shields, face shields for grinding and chemical handling, and the hazard assessment that must come first.',
    cfrCitation: '29 CFR 1910.133 (general industry) · 29 CFR 1910.132 (PPE hazard assessment)',
    oshaChecks: [
      'Written PPE hazard assessment identifying eye and face hazards by task',
      'Eye protection meeting ANSI Z87.1, with side shields for impact hazards',
      'Face shields used for grinding, chipping, chemical splash, and high-impact tasks',
      'Tinted lenses or welding helmets matched to the welding process',
      'Eye protection fitted properly — prescription users provided Z87-rated prescription eyewear',
      'Training documented on PPE selection, fit, use, care, and limitations',
    ],
    faqSchema: [
      { question: 'What does Z87.1 mean on safety glasses?', answer: 'ANSI Z87.1 is the American National Standard for occupational eye and face protection. The Z87 or Z87+ marking on the frame or lens indicates the eyewear has been tested to that standard. Z87+ indicates high-velocity impact rating. OSHA 29 CFR 1910.133 requires eye protection to meet the ANSI Z87.1 standard.' },
      { question: 'Are safety glasses with side shields required?', answer: 'When the hazard assessment identifies impact, dust, or particles flying laterally — which covers most general industry operations — eye protection must have side shields. Side shields can be integral to the frame or attached. Wraparound safety glasses meet the requirement; standard glasses with no lateral coverage do not.' },
      { question: 'When does OSHA require a face shield in addition to safety glasses?', answer: 'A face shield is required as secondary protection (worn over safety glasses or goggles) when there is a risk of significant facial impact, chemical splash, or molten material splatter. Grinding, chipping, and chemical handling typically require both. Safety glasses alone are insufficient for face-level hazards.' },
    ],
    relatedNotes: ['ppe-assessment', 'hot-work-welding', 'abrasive-wheels'],
    sections: {
      whatItIs: `OSHA 29 CFR 1910.133 is the eye and face protection standard. It requires employers to ensure that affected employees use appropriate eye or face protection when exposed to hazards from flying particles, molten metal, liquid chemicals, acids or caustics, chemical gases or vapors, or potentially injurious light radiation. The standard works in tandem with 1910.132 — the general PPE standard — which requires a written hazard assessment before PPE selection.

The hazard assessment is the first compliance step, and the most commonly missing one. Under 1910.132(d), the employer must assess the workplace to determine if hazards are present that necessitate PPE, select appropriate PPE based on the assessment, communicate selection decisions to affected employees, and verify by written certification that the assessment has been performed. The certification must identify the workplace, the person performing the assessment, the date of the assessment, and a statement identifying the document as a certification. Most small operations have safety glasses on the shelf and no written assessment anywhere. That is two citations — one under 1910.132 for the missing assessment, and one under 1910.133 for the unverified eye protection.

ANSI Z87.1 is the consensus standard OSHA references. Eye protection that meets the standard is marked Z87 (basic impact) or Z87+ (high-velocity impact) on the frame or lens. Without the marking, the eyewear is not OSHA-compliant. Reading glasses, prescription glasses without the Z87 marking, and "fashion" safety glasses bought off the rack at a hardware store often do not carry the marking — they look like safety glasses but do not meet the standard.

Side shields are required when the hazard assessment identifies impact, dust, or lateral particle hazards — which is most general industry operations. Wraparound safety glasses with frame designs that wrap toward the temples meet the requirement. Conventional flat-front glasses without side coverage do not. Snap-on side shields are an acceptable retrofit but tend to disappear within a week of use.

Face shields are secondary protection. Worn over safety glasses or goggles, they protect against face-level impact, chemical splash, and molten material. Grinding, chipping, and chemical handling routinely require both safety glasses and a face shield. The most common gap I see is a grinder with safety glasses but no face shield — grinding fragments routinely hit the cheek, neck, and lower forehead, all unprotected.

Welding lenses and helmets are governed by 1910.252(b)(2) under Subpart Q (welding). Shade numbers must match the process and amperage — shade 10 minimum for stick welding at moderate amperage, higher for higher amperage and TIG. Auto-darkening helmets are acceptable if they meet the standard and are set appropriately for the process. A welding helmet with the wrong shade is not compliant.

Prescription users present a recurring problem. Employees who wear prescription glasses cannot achieve compliance by putting safety glasses over their prescription eyewear unless those safety glasses are specifically designed for the over-glass fit and are Z87-rated. The compliant option is prescription safety eyewear with the Z87 marking — available through occupational health providers for around $80 to $200 per pair, often covered by the employer under 1910.132(h) (the OSHA-employer-pays rule for required PPE).

Corrective action: perform a written hazard assessment for every workstation. Document it with date and certifier. Replace any non-Z87 eyewear in service. Add side shields or replace with wraparound designs. Add face shields at grinding stations and chemical handling stations. Provide Z87-rated prescription eyewear for prescription users. Train annually on PPE selection, fit, and use — document it. Total cost: under $500 for a typical small operation, plus prescription eyewear for any wearer. Total time: one shift.`,
      whatGetsMissed: [
        'No written PPE hazard assessment — the first citation under 1910.132',
        'Safety glasses in use without Z87 markings — non-compliant eyewear',
        'No side shields on safety glasses where lateral hazards exist',
        'Grinding performed in safety glasses with no face shield — most common face-injury cause',
        'Prescription users wearing personal glasses without Z87 rating',
        'Welding helmets with wrong shade for the process and amperage',
        'Visitors and bystanders not provided eye protection in active work areas',
        'Eye protection not cleaned or stored properly — scratched and pitted lenses in continued use',
      ],
      whatISee: 'Almost every shop I walk into has safety glasses available. Very few have a written hazard assessment. About half the glasses in use are non-compliant — no Z87 marking, no side shields, or scratched to the point of impaired vision. Grinders are run in safety glasses without face shields. Welders use whatever helmet is on the shelf, regardless of shade or process. Prescription users wear their personal eyewear. The PPE is mostly there. The program around it is mostly not.',
      checklist: [
        'Written PPE hazard assessment completed for every workstation, certified by date and signer',
        'All eye protection in service marked Z87 or Z87+',
        'Side shields present on all eye protection used in environments with lateral particle hazards',
        'Face shields available and used at grinding stations, chipping stations, and chemical handling',
        'Welding lenses and helmets matched to process and amperage per Z87.1 / 1910.252(b)(2)',
        'Prescription-rated safety eyewear provided to prescription users',
        'Visitor and bystander PPE available at entry points to active work areas',
        'Annual training documented on PPE selection, fit, use, and care',
        'Damaged or scratched eyewear removed from service and replaced',
        'PPE inventory tracked and maintained',
      ],
    },
  },
  'trenching-excavation': {
    title: 'Trenching & Excavation',
    subtitle: 'The 5-Foot Rule That Buries People',
    seo: 'OSHA trenching and excavation requirements (29 CFR 1926.651) for NC contractors. Protective systems, competent person inspections, soil classification, and access ladders — the standard with the highest fatality rate per inspection.',
    cfrCitation: '29 CFR 1926.651–.652 (Subpart P)',
    oshaChecks: [
      'Protective system in place for any trench 5 feet or deeper (sloping, benching, shoring, or trench box)',
      'Competent person on site for every excavation — daily inspection documented',
      'Soil classified per Appendix A (Type A, B, or C) before selecting protective system',
      'Ladder or other safe means of egress within 25 feet of any worker in a trench 4+ feet deep',
      'Spoil piles, equipment, and materials kept at least 2 feet from the trench edge',
      'Underground utility locates completed before excavation begins (NC 811)',
    ],
    faqSchema: [
      { question: 'When does OSHA require a protective system in a trench?', answer: 'OSHA 29 CFR 1926.652(a)(1) requires a protective system in any excavation 5 feet or deeper, regardless of soil type — unless the excavation is made entirely in stable rock or the soil has been classified as Type A and the depth is less than 5 feet. Excavations less than 5 feet may also require protection if the competent person identifies hazards.' },
      { question: 'What is a competent person under the OSHA excavation standard?', answer: 'A competent person is someone capable of identifying existing and predictable hazards in the surroundings or working conditions, and who has authorization to take prompt corrective measures to eliminate them. Under 1926.651(k), the competent person must inspect excavations, adjacent areas, and protective systems for evidence of cave-ins, failures, or hazardous atmospheres before each shift, after every rainstorm, and after any event that increases the hazard.' },
      { question: 'How far away can workers be from a ladder in a trench?', answer: 'Under 1926.651(c)(2), trenches 4 feet deep or deeper must have a stairway, ladder, ramp, or other safe means of egress located so as to require no more than 25 feet of lateral travel for any employee. The egress must extend at least 3 feet above the upper edge of the trench.' },
    ],
    relatedNotes: ['fall-protection', 'confined-space', 'ppe-assessment'],
    sections: {
      whatItIs: `Trenching and excavation work is governed under OSHA Subpart P (29 CFR 1926.650 through 1926.652). It is one of the deadliest specialty areas in OSHA enforcement — trench collapses kill an average of 22 to 30 workers per year in the United States, with a fatality rate per inspection that far exceeds general construction. North Carolina has been a recurring focus area, with multiple Triad-area collapses in the past five years. The standard applies to every excavation deeper than 5 feet (and many that are shallower), and to every contractor doing utility, foundation, or site work.

The protective system is the single most-cited and most-critical requirement. Under 1926.652(a)(1), every trench 5 feet or deeper must have one of four protective systems in place: sloping (cutting the walls back at an angle determined by soil type), benching (cutting horizontal steps into the walls), shoring (installing hydraulic or timber supports), or shielding (using a trench box). Type A soil at less than 5 feet may not require protection; everything else does. Most small contractors I have seen running utility work in the Triad operate with no protective system — they accept the risk because the trench will be backfilled before the end of the shift. That risk is the highest cause of trench fatalities.

Soil classification under Appendix A of Subpart P determines the slope angle and the type of system required. Type A soils (cohesive, no fissures, no visual indication of failure planes) are most stable. Type B soils are intermediate. Type C soils (cohesionless, granular, or with visible signs of instability) are least stable. The competent person on site must classify the soil before selecting the protective system. Sloping a Type C soil at the Type A angle is a fatal mistake — and one that gets made regularly because the classification step is skipped.

The competent person requirement under 1926.651(k) is universally underemphasized. Every excavation must have a competent person responsible for daily inspections — before each shift, after every rainstorm, and after any event that could increase the hazard. The competent person must be on site whenever workers are in or near the excavation. In small contractor crews, the competent person is often nominal — the foreman is "designated" but has had no formal training. OSHA enforcement asks for documentation of training and on-the-job experience that supports the designation. Most contractors cannot produce it.

Access and egress under 1926.651(c)(2) requires a stairway, ladder, ramp, or other safe means of egress within 25 feet of any worker in a trench 4 feet or deeper. The egress must extend at least 3 feet above the upper edge. In Triad-area utility crews, the access is often a 6-foot step ladder leaning against the trench wall — too short to extend above the upper edge, and not secured. In a collapse event, the egress is the only path out. A poorly placed ladder costs lives.

Spoil pile placement under 1926.651(j)(2) requires excavated material to be placed at least 2 feet back from the trench edge. The reason is mechanical: spoil placed at the edge surcharges the trench wall and increases the chance of collapse. In every utility job I have observed in passing, the spoil is mounded directly at the edge. The crew is working below it.

Underground utility locates under 1926.651(b) are required before excavation begins. North Carolina's 811 system provides locates within 3 business days of a request. Cutting an unmarked gas line, water main, or electrical conduit is a separate citation under the same standard, and a separate set of secondary hazards. The locate request takes five minutes online or by phone. It is the cheapest single step in the entire compliance picture.

Corrective action for a small contracting operation: train at least one competent person per crew formally — OSHA 10 or 30 Construction is a starting point; a dedicated competent-person trench safety course is better. Acquire or rent a trench box for every job involving trenches 5 feet or deeper. Build a daily inspection log into the crew's shift-start routine. Build the 811 locate request into the job-startup checklist. Brief every employee on egress location at the start of each shift. Total program cost for a small contractor: $3,000 to $8,000 the first year (training plus equipment rental plus documentation). Total cost of a trench collapse fatality and the resulting willful citation: career-ending. Subpart P violations regularly produce penalties at the upper end of the OSHA range.`,
      whatGetsMissed: [
        'No protective system in place for trenches 5 feet or deeper — the most common citation under Subpart P',
        'Competent person designated on paper only, no documented training or experience',
        'Soil never classified — protective system selected by guess',
        'No documented daily inspection by the competent person',
        'Access ladder more than 25 feet from a worker in a trench 4+ feet deep',
        'Egress ladder not extending 3 feet above the upper edge of the trench',
        'Spoil pile placed at the trench edge — surcharging the wall',
        'Underground utility locates not requested before excavation',
        'Workers near a trench edge without fall protection',
        'No emergency response plan for collapse rescue',
      ],
      whatISee: 'I drive past a utility job and stop. The crew has cut a trench to about 6 feet deep, no protective system in place, soil that looks like Type C, no trench box, no shoring, no sloping. Spoil is mounded right at the edge. The foreman is in the trench running pipe, and the only access is a stepladder that does not reach the upper edge. The crew has no idea I have an OSHA background; they are working fast, expecting to backfill before the end of the day. This is the standard I worry about most as I drive around the Triad — because the risk is invisible until the wall comes down.',
      checklist: [
        '811 locate request completed at least 3 business days before excavation',
        'Protective system selected based on soil classification per Appendix A',
        'Protective system in place before any worker enters a trench 5 feet or deeper',
        'Competent person designated with documented training and experience',
        'Daily inspection by competent person before each shift, after rainstorms, after any change',
        'Access ladder, stairway, or ramp within 25 feet of any worker in a 4+ foot trench',
        'Egress extends at least 3 feet above the upper edge of the trench',
        'Spoil piles, equipment, and materials kept 2+ feet back from the trench edge',
        'Workers within 6 feet of the excavation edge have fall protection or barriers',
        'Hazardous atmosphere testing where confined-space conditions could exist',
        'Emergency response plan for trench collapse rescue',
      ],
    },
  },
  'cranes-rigging': {
    title: 'Overhead Cranes & Rigging',
    subtitle: 'The Sling That Should Have Been Retired',
    seo: 'OSHA overhead crane and rigging requirements (29 CFR 1910.179, 1910.184) for small NC fab and metals shops. Daily inspections, annual inspections, sling condition, rated capacity, and operator training.',
    cfrCitation: '29 CFR 1910.179 (Overhead and gantry cranes) · 29 CFR 1910.184 (Slings) · 29 CFR 1926 Subpart CC (Construction cranes)',
    oshaChecks: [
      'Daily pre-shift inspection of each crane in service',
      'Annual periodic inspection by a qualified person — documented',
      'Sling inspection before each shift and removal of damaged slings',
      'Rated capacity marked on each crane and each sling — capacity not exceeded',
      'Operator training and authorization documented',
      'Load testing on new and repaired cranes per 1910.179(k)(2)',
    ],
    faqSchema: [
      { question: 'How often do overhead cranes need inspection?', answer: 'OSHA 29 CFR 1910.179(j) requires two levels: frequent inspections (daily to monthly, depending on use intensity) and periodic inspections (1 to 12 months, depending on use intensity). Periodic inspections must be documented and signed by the qualified inspector. Daily pre-shift checks should be documented on a checklist.' },
      { question: 'When does a sling have to be removed from service?', answer: 'OSHA 29 CFR 1910.184 requires removal of any sling with broken or worn wires (number depends on sling type), kinks, severe corrosion, missing or illegible tags, distorted hooks, end attachments damaged or showing visible cracks, or any condition that visibly reduces strength. Synthetic slings are inspected before each shift and removed if cut, abraded, melted, chemically damaged, or showing exposed core yarns.' },
      { question: 'Does the crane operator need certification?', answer: 'General industry overhead cranes under 1910.179 require operator training and demonstrated competence — no formal certification card is required by federal OSHA. Construction cranes under 1926 Subpart CC require formal operator certification through an accredited testing organization. Most insurance carriers and customer audits expect documented operator training for general industry crane operators regardless of standard.' },
    ],
    relatedNotes: ['machine-guarding', 'lockout-tagout', 'walking-surfaces'],
    sections: {
      whatItIs: `Overhead cranes, gantry cranes, jib cranes, and the slings and rigging used with them are governed by OSHA 29 CFR 1910.179 and 1910.184 in general industry. The standards require inspection programs at two levels (frequent and periodic), operator training, capacity marking, and a maintenance program. In Triad-area fab shops, metals operations, and any facility moving heavy material with a hoist, at least one piece of the program is almost always missing.

The most-cited subsection is 1910.179(j) — inspection. Frequent inspections check operating mechanisms (excessive wear, deterioration, leakage), air or hydraulic systems for deficiencies, hooks for deformation or cracks, hoist chains and end connections, and rope reeving. Periodic inspections (annual or more frequent depending on intensity of use) are comprehensive — they cover deformed/cracked/corroded members, loose bolts and rivets, cracks in welds, worn pins or pin holes, end-attachment deterioration, brake system performance, load indicators, hoist limit switches, and structural members. The periodic inspection must be documented and the documentation retained. In small shops, the crane was installed years ago and never inspected formally. I ask for the inspection log and it does not exist.

Sling condition under 1910.184 is the second most common failure. Slings — wire rope, chain, synthetic (nylon, polyester), and metal mesh — are required to be inspected before each shift. The inspection criteria depend on sling type: wire rope slings are removed when ten randomly distributed broken wires appear in one rope lay (or five in one strand); chain slings are removed when cracks, twists, or wear of 10% of the original material thickness appear at any link. Synthetic slings are removed for cuts, abrasion, melting, chemical damage, or any condition that exposes the core yarns. In every fab shop I walk through, at least one sling on the rack should be retired today. Most are still in service.

Rated capacity marking under 1910.179(b)(5) requires the rated load to be plainly marked on each side of the crane. Slings under 1910.184(d) must have an identification tag listing the rated load for the various sling configurations. Tags fade. Markings get painted over. Operators end up guessing or relying on memory. When a sling fails because the load exceeded its rating, the cause was usually a missing or illegible tag and an operator who never checked.

Operator training under 1910.179 is not as prescriptive as the forklift standard, but the employer is still responsible for ensuring that operators are trained and authorized. Most small operations have an operator who "has been running the crane for years" with no documented training. Insurance carriers and customer audits frequently ask for the training records — and the answer is usually "we'll get back to you."

Load testing under 1910.179(k)(2) applies after any alteration, repair, or installation. The crane must be tested with a load 125% of the rated capacity (or per manufacturer recommendations) before being returned to service. This is the area where shops most often improvise — a weld repair to a hook or a beam gets made, the crane goes back into service the same day, and no load test is performed. If the repair fails under a future load, the missing test becomes a major liability issue independent of the OSHA citation.

Construction cranes under 1926 Subpart CC follow a separate and more prescriptive standard, including formal operator certification through accredited testing organizations. Mobile cranes, tower cranes, and articulating cranes on construction sites must have certified operators.

Corrective action for a small fab shop: schedule a qualified inspector for an annual periodic inspection (a local crane service company will perform this for $400 to $1,200 depending on the unit). Establish daily pre-shift checklists and supervisor-verified completion. Audit every sling on the rack, retire what should be retired, and add tags where tags are missing. Document operator training — even retroactive on-the-job training observations, signed and dated, satisfy the standard. Build the program around a single binder kept near the crane.`,
      whatGetsMissed: [
        'Annual periodic inspection never performed or not documented',
        'Daily pre-shift inspection skipped or unlogged',
        'Slings in service that should have been retired — broken wires, cuts, chemical damage',
        'Rated capacity not marked on crane or missing/illegible sling tags',
        'Operator training not documented',
        'Load tests not performed after alterations, repairs, or new installation',
        'Hoist limit switches not tested or non-functional',
        'Pendant controls or remote controls in poor repair',
        'Improper hitching — slings choked or basketed without manufacturer guidance',
        'Personnel under suspended loads',
      ],
      whatISee: 'I walk into a metals fab shop and look up. The overhead crane has a manufacturer plate I can read; the periodic inspection sticker dates from four years ago. I ask for the inspection log. It does not exist. I look at the sling rack: a chain sling with a kink in the middle, two synthetic slings with visible core yarn exposure, and one wire rope sling with at least 15 broken wires in one strand. None are tagged out. The operator has been running the crane for eight years and has no documented training. The maintenance log shows a hook repair done two summers ago — no load test record. This is one citation for every item I just listed.',
      checklist: [
        'Daily pre-shift inspection documented for each crane in service',
        'Annual periodic inspection by qualified person — documented and signed',
        'Sling inspection before each shift — damaged slings tagged and removed from service',
        'Rated capacity legibly marked on each crane and each sling',
        'Operator training documented with names, dates, and topics',
        'Load test performed and documented after installation, alteration, or major repair',
        'Hoist limit switches tested per inspection schedule',
        'Pendant or remote controls in good repair',
        'Hitching practices match manufacturer or qualified rigger guidance',
        'No personnel under suspended loads — enforced as a hard rule',
      ],
    },
  },
  'nc-osha-vs-federal': {
    title: 'NC State Plan vs. Federal OSHA',
    subtitle: 'What North Carolina Does Differently',
    seo: 'How North Carolina OSHA differs from federal OSHA. The NC State Plan, NCDOL inspections, consultation services, and the standards that apply differently to operations in Kernersville, Winston-Salem, Greensboro, and the broader Piedmont Triad.',
    cfrCitation: 'NC General Statutes Chapter 95, Article 16 (OSHANC) · 29 CFR 1953 (State Plan approval)',
    oshaChecks: [
      'Operating under NC OSHA (NCDOL Occupational Safety and Health Division) — not federal OSHA',
      'NC-specific standards adopted in addition to federal standards (e.g., logging, communication tower erection)',
      'Penalty schedule and policies set by the NC Industrial Commission and Labor Commissioner',
      'Free on-site consultation available through NCDOL Bureau of Education, Training, and Standards',
      'Whistleblower protections under N.C. Gen. Stat. § 95-241',
      'Apparent imminent-danger reports handled by NCDOL Division of Occupational Safety and Health (DOSH)',
    ],
    faqSchema: [
      { question: 'Does federal OSHA inspect operations in North Carolina?', answer: 'No, with limited exceptions. North Carolina operates an OSHA-approved State Plan under 29 CFR 1953. The NC Department of Labor (NCDOL) Occupational Safety and Health Division (NCOSH) handles inspections, enforcement, and standards adoption in all private and state/local government workplaces. Federal OSHA retains jurisdiction over federal employees and a small number of specific operations such as maritime work on navigable waters.' },
      { question: 'Are NC OSHA standards the same as federal OSHA standards?', answer: 'NC OSHA standards must be at least as effective as federal OSHA standards. Most are identical adoptions. NC has adopted some additional state-specific standards (logging, communication tower erection, etc.) and has authority to enact more protective standards. In practice, the standards are the same as federal OSHA in nearly all general industry contexts — the difference is who enforces them and how.' },
      { question: 'How is NC OSHA consultation different from a compliance inspection?', answer: 'NCDOL offers free on-site consultation services through the Bureau of Education, Training, and Standards (BETS) — separate from the compliance inspection program. A consultation visit is voluntary, confidential, and protected from citations as long as serious hazards identified are corrected within an agreed timeframe. A compliance inspection is unannounced or programmed by referral, and citations are issued for any violations found. The two programs do not share inspection data.' },
    ],
    relatedNotes: ['recordkeeping-300-log', 'hazcom', 'emergency-action-plans'],
    sections: {
      whatItIs: `North Carolina operates an OSHA-approved State Plan under federal authority granted in 29 CFR 1953. This means that workplace safety and health enforcement in NC — for private sector, state government, and local government employers — is handled by the North Carolina Department of Labor (NCDOL), specifically the Occupational Safety and Health Division (NCOSH), not by federal OSHA. The distinction matters operationally even though most of the underlying standards are identical to federal OSHA.

The standards themselves: NC adopts federal OSHA standards by reference, and NC OSHA standards must be at least as effective as federal standards under the State Plan agreement. NC has adopted some additional state-specific standards — notably for logging operations and for communication tower erection — and retains authority to enact more protective standards if needed. For general industry operations in the Triad — manufacturing, warehousing, fabrication, construction — the OSHA standards an inspector will cite are functionally identical to what federal OSHA would cite. Same CFR sections. Same general approach. Operationally, no change.

What does change is who knocks on the door. NCDOL Compliance Officers (called Safety and Health Compliance Officers, or SHCOs) come from the NC Department of Labor in Raleigh. The NCDOL has Asheville, Charlotte, Greensboro, Raleigh, and Wilmington area offices. The Greensboro office covers most of the Piedmont Triad — Guilford, Forsyth, Alamance, Davidson, Davie, Randolph, Rockingham, and Stokes counties. The Compliance Officer carries NCDOL credentials, identifies as a state employee, and operates under NC General Statutes Chapter 95, Article 16 — the NC OSHA Act.

The penalty schedule is set by the NC Commissioner of Labor and the NC Industrial Commission. The maximum penalties under NC OSHA mirror federal OSHA penalty caps and are adjusted annually for inflation. In 2026, the federal maxima — $16,550 for serious/other-than-serious, $165,514 for willful/repeated — apply in NC as well. NC has historically been somewhat less aggressive with penalty escalation than some federal regions, but the penalty range and citation methodology are the same.

Consultation services are a significant point of leverage in NC. The NCDOL Bureau of Education, Training, and Standards (BETS) provides free on-site consultation visits to employers who request them. The consultation is voluntary, confidential, and explicitly separated from the compliance enforcement program. If a consultation visit identifies serious hazards, the employer agrees to correct them within a specified timeframe, and the visit is protected from citation (with limited exceptions for imminent danger or willful failure to correct). This program is heavily underused by Triad-area small employers — the request form is on the NCDOL website, the visit costs nothing, and it does not generate a citation file. For a small operation that wants to improve compliance without exposure, BETS is the most efficient first move.

What changes for a small operation operating under NC OSHA vs. federal OSHA, day to day, is mostly nothing — the same standards apply, the same posting and recordkeeping obligations are in place, the same incident reporting requirements (8 hours for fatality, 24 hours for hospitalization/amputation/eye loss) apply. Reports go to NCDOL at 1-800-NC-LABOR or the dedicated reporting line. The familiar federal OSHA hotline (1-800-321-OSHA) will redirect NC reports to NCDOL.

Whistleblower protection under N.C. Gen. Stat. § 95-241 mirrors Section 11(c) of the federal OSH Act — employees who report safety concerns are protected from retaliation. Complaints to NCDOL are confidential at the complainant's request.

One area where NC differs operationally: the consultation program is administered separately from compliance, and the two programs are firewalled. This is the same structure used in federal OSHA's On-site Consultation Program but is worth noting for NC employers because the NCDOL website lays out both programs side by side, and small operators sometimes assume requesting consultation will trigger a compliance inspection. It does not.

What this means for a Triad-area operation: the standards you have to meet are the same standards as anywhere else in the US. The agency you deal with is NCDOL, not federal OSHA. The reporting numbers and addresses are NC-specific. The consultation program is free, confidential, and far more accessible than federal OSHA's. And the inspection rate by NCDOL is consistent with federal OSHA's — a small operation should not assume that "we're in NC, not under federal OSHA" means less enforcement attention. The same triggers (worker complaints, severe-injury reports, programmed inspections in targeted industries) apply.

Corrective action for any NC operation: bookmark the NCDOL website (labor.nc.gov), specifically the Occupational Safety and Health Division pages. Save the reporting number (1-800-NC-LABOR / 1-800-625-2267). Consider a BETS consultation visit if your operation has never had a compliance review — it is free and confidential. Make sure your OSHA 300A is posted in the workplace from February 1 to April 30 (the requirement is the same as federal). Make sure your workplace poster is the NC "It's the Law" poster from NCDOL, not the federal OSHA poster — this is one of the easiest visible citations and one of the easiest fixes.`,
      whatGetsMissed: [
        'Federal OSHA poster posted instead of the NC "It\'s the Law" poster from NCDOL',
        'Severe injury reports made to federal OSHA hotline only — not always forwarded to NCDOL',
        'Consultation program through BETS never used — assumption that requesting consultation triggers enforcement',
        'NC-specific standards (logging, comm towers) overlooked for operations in those sectors',
        'Whistleblower complaint procedure under N.C. Gen. Stat. § 95-241 unfamiliar to managers',
        'NCDOL contact information not posted alongside the workplace poster',
      ],
      whatISee: 'I walk into operations across the Triad and find the federal OSHA workplace poster taped to the breakroom wall. The NC "It\'s the Law" poster from NCDOL — the actually-required one in this state — is missing. The owner does not know there is a difference. When I mention the BETS consultation program, the response is usually surprise: "I thought asking for OSHA help meant getting inspected." The consultation program is one of the most useful tools in NC compliance and one of the most under-known. Standards-wise, NC operations have the same obligations as anywhere else. The difference is the agency relationship — and that relationship can work in the operator\'s favor if they know how to use it.',
      checklist: [
        'NC "It\'s the Law" workplace poster (NCDOL) posted in a conspicuous location',
        'NCDOL severe injury reporting number (1-800-625-2267) saved and known by supervisors',
        'OSHA 300A annual summary posted Feb 1 through Apr 30 (same as federal)',
        'NC-specific standards reviewed for applicability (logging, comm towers, others as relevant)',
        'BETS consultation visit considered if operation has not had an outside compliance review',
        'Whistleblower complaint procedure documented in employee handbook per N.C. Gen. Stat. § 95-241',
        'Compliance Officer credentials policy in place (identify NCDOL SHCO if visit occurs)',
        'Familiarity with NC Industrial Commission penalty schedule for the current year',
      ],
    },
  },
};

const FieldNoteDetailPage = () => {
  const { slug } = useParams();
  // Alias map — additional slugs that resolve to existing notes (kept narrow on purpose).
  const SLUG_ALIASES = {
    'confined-space-entry-permits': 'confined-space',
  };
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const note = NOTES[resolvedSlug];
  const [dlEmail, setDlEmail] = useState('');
  const [dlStatus, setDlStatus] = useState('idle'); // idle | sending | sent | error

  if (!note) return <Navigate to="/field-notes" replace />;

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!dlEmail.trim()) return;
    setDlStatus('sending');
    try {
      const res = await fetch(`${API}${note.download.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: dlEmail.trim() }),
      });
      if (res.ok) {
        trackPDFDownload(note.download.title);
        setDlStatus('sent');
      } else {
        setDlStatus('error');
      }
    } catch {
      setDlStatus('error');
    }
  };

  return (
    <main>
      <SEO
        title={note.seoTitle || `${note.title} — Field Notes | GigLine Safety & Compliance`}
        description={note.seo}
        canonical={`/field-notes/${resolvedSlug}`}
        ogType="article"
        ogImage={note.heroImage}
      />

      {/* JSON-LD Article + FAQPage schemas live in the pre-rendered static
          HTML via /scripts/generate-seo-pages.js. We do NOT inject them at
          runtime to avoid Google "Duplicate field" warnings. */}

      {/* Header */}
      <section className="bg-[#0d1b2a] py-16 md:py-24" data-testid="note-header">
        <div className="container max-w-3xl">
          <Link to="/field-notes" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#1a6fc4] transition-colors mb-6" data-testid="back-to-notes">
            <ArrowLeft size={14} /> Field Notes
          </Link>
          <p
            className="uppercase tracking-[3px] text-[#1a6fc4] mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            Field Note
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3" data-testid="note-title">
            {note.title}
          </h1>
          <p className="text-lg text-white/50">{note.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white" data-testid="note-content">
        <div className="container max-w-3xl">
          {/* Hero promo image (when present) */}
          {note.heroImage && (
            <div className="mb-10 md:mb-12 -mt-2" data-testid="note-hero-image">
              <img
                src={note.heroImage}
                alt={note.heroImageAlt || note.title}
                className="w-full h-auto rounded-xl shadow-lg"
                style={{ boxShadow: '0 18px 36px -16px rgba(11,31,51,0.35), 0 0 0 1px rgba(11,31,51,0.06)' }}
                loading="eager"
              />
            </div>
          )}

          {/* What It Is — supports multi-paragraph via blank line splits */}
          <div className="mb-12" data-testid="note-what-it-is">
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">What It Is</h2>
            <div className="text-base text-[#0d1b2a]/70 leading-relaxed space-y-4 whitespace-pre-line">
              {note.sections.whatItIs.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* What OSHA Checks (if available) */}
          {note.oshaChecks && (
            <div className="mb-12" data-testid="note-osha-checks">
              <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">What OSHA Checks</h2>
              <div className="space-y-3">
                {note.oshaChecks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#1560ae] mt-1 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <p className="text-base text-[#0d1b2a]/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Gets Missed */}
          <div className="mb-12" data-testid="note-what-gets-missed">
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">What Most Operations Get Wrong</h2>
            <div className="space-y-3">
              {note.sections.whatGetsMissed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#1a6fc4] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>//</span>
                  <p className="text-base text-[#0d1b2a]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What I See */}
          <div className="mb-12 bg-[#F9F8F6] border-l-2 border-[#1a6fc4] p-6 rounded-r" data-testid="note-what-i-see">
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">What GigLine Looks For</h2>
            <p className="text-base text-[#0d1b2a]/70 leading-relaxed italic">{note.sections.whatISee}</p>
          </div>

          {/* Checklist */}
          <div className="mb-12" data-testid="note-checklist">
            <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">Quick Checklist</h2>
            <div className="space-y-3">
              {note.sections.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#0d1b2a]/20 text-[#1a6fc4] focus:ring-[#1a6fc4] accent-[#1a6fc4]" />
                  <span className="text-base text-[#0d1b2a]/70 group-hover:text-[#0d1b2a] transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#0d1b2a]/40">
              Print this page or use the browser print function (Ctrl+P / Cmd+P) to save a copy.
            </p>
          </div>

          {/* CFR Citation */}
          {note.cfrCitation && (
            <div className="mb-12 py-4 border-t border-[#0d1b2a]/10" data-testid="note-cfr-citation">
              <p className="text-xs text-[#0d1b2a]/40 uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Regulation Reference
              </p>
              <p className="text-sm text-[#0d1b2a]/60 font-medium mt-1">{note.cfrCitation}</p>
            </div>
          )}

          {/* Newsletter capture — soft list-builder per article */}
          <FieldNotesNewsletter source={`field-note-${slug}`} />

          {/* Service that handles this on the floor (GL-WEB-018) */}
          {SERVICE_LINKS_BY_SLUG[slug] && (
            <div className="mb-10" data-testid="note-related-services">
              <p
                className="text-xs uppercase tracking-wider mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1a6fc4' }}
              >
                Where this gets handled
              </p>
              <h3
                className="text-lg md:text-xl font-bold text-[#0d1b2a] mb-5 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Want this audited on your floor?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICE_LINKS_BY_SLUG[slug].map((svc) => (
                  <Link
                    key={svc.to}
                    to={svc.to}
                    className="block p-5 rounded-lg transition-colors group"
                    style={{ background: '#F9F8F6', border: '1px solid rgba(13,27,42,0.10)' }}
                    data-testid={`note-service-link-${svc.to.split('/').pop()}`}
                  >
                    <p className="font-bold text-[15px] text-[#0d1b2a] mb-1 group-hover:text-[#1560ae] transition-colors flex items-center gap-1.5">
                      {svc.title}
                      <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[13.5px] text-[#0d1b2a]/65 leading-[1.55]">{svc.body}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Field Notes */}
          {note.relatedNotes && (
            <div className="mb-8" data-testid="note-related">
              <p className="text-xs text-[#0d1b2a]/40 uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Related Field Notes
              </p>
              <div className="flex flex-wrap gap-3">
                {note.relatedNotes.map(rSlug => {
                  const related = NOTES[rSlug];
                  if (!related) return null;
                  return (
                    <Link
                      key={rSlug}
                      to={`/field-notes/${rSlug}`}
                      className="text-sm text-[#0d1b2a]/60 hover:text-[#1560ae] transition-colors flex items-center gap-1"
                      data-testid={`related-note-${rSlug}`}
                    >
                      <ArrowRight size={12} />
                      {related.title}
                    </Link>
                  );
                })}
                <Link
                  to="/services"
                  className="text-sm text-[#1a6fc4] hover:text-[#1560ae] transition-colors flex items-center gap-1"
                  data-testid="related-services-link"
                >
                  <ArrowRight size={12} />
                  Safety Walkthrough Services
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Download Resource (if available) */}
      {note.download && (
        <section className="py-12 md:py-20" style={{ backgroundColor: '#F9F8F6' }} data-testid="note-download">
          <div className="container max-w-3xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Mockup image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img
                  src={note.download.image}
                  alt={note.download.title}
                  className="w-full max-w-[260px] mx-auto md:mx-0 rounded shadow-lg"
                  data-testid="download-mockup"
                />
              </div>

              {/* Download form */}
              <div className="flex-grow">
                <p
                  className="uppercase tracking-[3px] text-[#1a6fc4] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                >
                  Free Download
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#0d1b2a] mb-2" data-testid="download-title">
                  {note.download.title}
                </h3>
                <p className="text-sm text-[#0d1b2a]/55 mb-6">{note.download.description}</p>

                {dlStatus === 'sent' ? (
                  <div className="flex items-center gap-3 text-[#0d1b2a]/70" data-testid="download-success">
                    <Check size={20} className="text-[#1a6fc4]" />
                    <p className="text-sm font-medium">Sent to your inbox. Check your email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleDownload} className="flex flex-col sm:flex-row gap-3" data-testid="download-form">
                    <input
                      type="email"
                      required
                      value={dlEmail}
                      onChange={(e) => setDlEmail(e.target.value)}
                      placeholder="Your work email"
                      className="flex-grow px-4 py-3 rounded border border-[#0d1b2a]/15 bg-white text-sm text-[#0d1b2a] placeholder:text-[#0d1b2a]/30 focus:outline-none focus:border-[#1a6fc4] focus:ring-1 focus:ring-[#1a6fc4]/30"
                      data-testid="download-email-input"
                    />
                    <button
                      type="submit"
                      disabled={dlStatus === 'sending'}
                      className="bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-6 py-3 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                      data-testid="download-submit-btn"
                    >
                      <Download size={16} />
                      {dlStatus === 'sending' ? 'Sending...' : 'Send Me the PDF'}
                    </button>
                  </form>
                )}
                {dlStatus === 'error' && (
                  <p className="text-sm text-red-500 mt-2">Something went wrong. Try again.</p>
                )}
                <p className="text-xs text-[#0d1b2a]/30 mt-3">No spam. Just the PDF.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Documents CTA — for articles that specify a kitCrossSell card set */}
      {note.kitCrossSell && Array.isArray(note.kitCrossSell.cards) && (
        <section
          className="py-16 md:py-20"
          style={{ background: '#FAF7F1', borderTop: '1px solid #E5DDCD' }}
          data-testid="kit-cross-sell"
        >
          <div className="container max-w-5xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-4"
              style={{ color: '#C5A059', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              Related Documents
            </p>
            <h2
              className="font-bold leading-tight mb-3 text-[24px] md:text-[30px]"
              style={{ fontFamily: "'Manrope', sans-serif", color: '#0A1628' }}
            >
              {note.kitCrossSell.headline || 'The forms that handle this on the floor.'}
            </h2>
            <p
              className="text-[15.5px] md:text-base leading-[1.7] mb-10 max-w-2xl"
              style={{ color: 'rgba(10,22,40,0.72)', fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {note.kitCrossSell.intro || `Documents from the GigLine Supervisor Safety Starter System map directly to the requirements in this article. CFR-cited. Print-ready. $600 for the digital kit, included free with every Compliance Readiness Visit.`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
              {note.kitCrossSell.cards.map((card) => (
                <div
                  key={card.num}
                  className="rounded-md p-6"
                  style={{ background: 'white', border: '1px solid #E5DDCD' }}
                  data-testid={`kit-cross-sell-card-${card.num}`}
                >
                  <p
                    className="font-bold mb-3"
                    style={{ color: '#C5A059', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
                  >
                    SS-{card.num}
                  </p>
                  <h3
                    className="font-bold text-[15.5px] leading-snug mb-2"
                    style={{ fontFamily: "'Manrope', sans-serif", color: '#0A1628' }}
                  >
                    {card.label}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.65]"
                    style={{ color: 'rgba(10,22,40,0.65)', fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                to="/supervisor-kit"
                className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 transition-all text-[15px]"
                style={{ background: '#0A1628', color: 'white', fontFamily: "'Manrope', sans-serif" }}
                data-testid="kit-cross-sell-cta"
              >
                See the Full Kit ($600 digital)
                <ArrowRight size={16} />
              </Link>
              <p
                className="text-[13.5px] italic"
                style={{ color: 'rgba(10,22,40,0.55)', fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Or call <a href="tel:+13363298899" className="font-bold hover:underline" style={{ color: '#0A1628' }}>(336) 329-8899</a> to scope a Compliance Readiness Visit &mdash; the kit ships included.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0d1b2a]" data-testid="note-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-2">
            If you're not sure how this looks in your operation —
          </p>
          <p className="text-lg text-white font-medium mb-8">
            start with a walkthrough.
          </p>
          <Link
            to="/intake"
            className="bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
            data-testid="note-walkthrough-cta"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-white/30 mt-4">
            One visit. Clear findings. No retainer.
          </p>
        </div>
      </section>
    </main>
  );
};

export default FieldNoteDetailPage;
