import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Download, Check } from 'lucide-react';
import { trackPDFDownload } from '../utils/analytics';
import SEO from '../components/SEO';
import FieldNotesNewsletter from '../components/FieldNotesNewsletter';

const API = process.env.REACT_APP_BACKEND_URL;

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
    relatedNotes: ['walking-surfaces', 'ppe-assessment'],
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
    relatedNotes: ['walking-surfaces', 'lockout-tagout'],
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
    relatedNotes: ['lockout-tagout', 'machine-guarding'],
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
    relatedNotes: ['ppe-assessment', 'machine-guarding'],
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
    relatedNotes: ['lockout-tagout', 'electrical-safety'],
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
    relatedNotes: ['fall-protection', 'forklift-safety'],
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
    relatedNotes: ['machine-guarding', 'electrical-safety'],
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
    relatedNotes: ['hazcom', 'walking-surfaces'],
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
    relatedNotes: ['hazcom', 'machine-guarding'],
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
    relatedNotes: ['walking-surfaces', 'scaffolding-safety'],
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
    relatedNotes: ['lockout-tagout', 'ppe-assessment'],
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
    relatedNotes: ['fall-protection', 'ppe-assessment'],
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
    relatedNotes: ['ppe-assessment', 'machine-guarding'],
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
    relatedNotes: ['ppe-assessment', 'emergency-action-plans'],
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
    kitCrossSell: true,
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
    relatedNotes: ['hazcom', 'emergency-action-plans'],
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
    relatedNotes: ['hazcom', 'lockout-tagout'],
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

      {/* Related Documents CTA — for articles flagged with kitCrossSell */}
      {note.kitCrossSell && (
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
              The forms that handle this on the floor.
            </h2>
            <p
              className="text-[15.5px] md:text-base leading-[1.7] mb-10 max-w-2xl"
              style={{ color: 'rgba(10,22,40,0.72)', fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Three documents from the GigLine Supervisor Safety Starter System map directly to the recordkeeping requirements in this article. CFR-cited. Print-ready. $600 for the digital kit, included free with every Compliance Readiness Visit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
              {[
                {
                  label: 'Monthly Safety Inspection Checklist',
                  body: '40+ items. Signature block. Retention instruction. The corrective action proof you need on file when OSHA asks.',
                  num: '09',
                },
                {
                  label: 'Employee Training Record Log',
                  body: 'Documents every safety training session — dates, topics, attendees, signatures. The training-record trail OSHA cross-checks against the 300 log.',
                  num: '10',
                },
                {
                  label: 'If OSHA Shows Up',
                  body: 'Seven-step protocol. Post near the front entrance. What the recordkeeping audit looks like in real time when an inspector walks in.',
                  num: '07',
                },
              ].map((card) => (
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
