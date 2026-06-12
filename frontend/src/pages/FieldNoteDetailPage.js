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

Corrective action: photograph every panel in your facility today. Mark the floor with yellow tape showing the 36-inch clearance zone. Re-do the panel directories — print them, laminate them, mount them inside the door. Schedule an arc flash analysis with a qualified electrical contractor (cost: $1,500–$4,000 for a small facility, one-time). Build or buy lockout-tagout procedures specific to each piece of equipment. Document qualified person training. None of this is fast, but none of it is hard either — and missing any of it on inspection day will produce a citation that starts at $16,550.`,
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
    seo: 'Machine guarding compliance for small manufacturers. What OSHA requires, what gets removed, and how to fix it.',
    sections: {
      whatItIs: 'Machine guarding protects workers from rotating parts, flying chips, and sparks. OSHA requires guards at every point of operation, nip point, and rotating shaft. Guards get removed for maintenance, cleaning, or access — and often don\'t go back on.',
      whatGetsMissed: [
        'Guards removed and not replaced after maintenance',
        'Makeshift guards that don\'t meet OSHA requirements',
        'Interlocks bypassed or disabled',
        'No written machine guarding assessment',
        'New equipment installed without proper guards',
      ],
      whatISee: 'I find guards zip-tied in the "open" position, interlocks bypassed with tape, and belt drives exposed because "the guard was in the way." Operators know it\'s wrong — they\'ve just worked around it long enough that it feels normal. The real risk isn\'t just the citation. It\'s the amputation, the lost finger, or the recordable that changes someone\'s life.',
      checklist: [
        'All points of operation guarded',
        'Belt drives, gears, and shafts enclosed',
        'Interlocks functional and tested',
        'Guards secure and not modified',
        'Written machine guarding assessment on file',
        'Employees trained on guard requirements',
        'Post-maintenance guard verification process',
      ],
    },
  },
  'walking-surfaces': {
    title: 'Walking Surfaces',
    subtitle: 'Trip Hazards You Walk Past Every Day',
    seo: 'Walking surface safety for warehouses and manufacturing. Trip hazards, housekeeping, and aisle management.',
    sections: {
      whatItIs: 'Walking and working surfaces are the most common source of recordable injuries in general industry. Slips, trips, and falls — from cords on the floor, hoses across walkways, uneven surfaces, spills, and blocked aisles. Simple to see. Consistently ignored.',
      whatGetsMissed: [
        'Cords and hoses across walkways',
        'Aisle markings faded or missing',
        'Spills not cleaned up promptly',
        'Floor damage or uneven surfaces',
        'Aisles partially blocked by pallets or product',
      ],
      whatISee: 'Extension cords running across the main aisle. A puddle near the dock that\'s been there for three days. Pallets stacked in the walkway because the rack was full. Aisle lines that were painted two years ago and are barely visible. Everyone walks around the hazard. Nobody fixes it because it\'s "temporary."',
      checklist: [
        'Aisles clear and properly marked',
        'No cords or hoses across walkways',
        'Spill kits accessible and used promptly',
        'Floor surfaces level and in good condition',
        'Pallets and product stored in designated areas only',
        'Lighting adequate in all walking areas',
        'Housekeeping schedule in place and followed',
      ],
    },
  },
  'lockout-tagout': {
    title: 'Lockout/Tagout (LOTO)',
    subtitle: 'The Step That Gets Skipped',
    seo: 'Lockout/Tagout compliance for small operations. Energy isolation during maintenance — what gets missed and what OSHA requires.',
    sections: {
      whatItIs: 'Lockout/Tagout is the process of isolating energy sources before maintenance or servicing equipment. Electrical, hydraulic, pneumatic, mechanical — if it can move, it needs to be locked out. OSHA 1910.147 requires written procedures, training, and annual inspections. Most small operations skip at least one of those.',
      whatGetsMissed: [
        'No written LOTO procedures for each machine',
        'Locks and tags not available or not used',
        'Employees trained once and never re-evaluated',
        'Annual periodic inspections not conducted',
        'Contractors not included in LOTO program',
      ],
      whatISee: 'I find machines with no written lockout procedure posted. Maintenance gets done with the breaker off but no lock on it. The locks are in a drawer somewhere. Training happened three years ago and nobody can describe the steps. When I ask about the annual inspection, the answer is usually a blank stare. This is the one that turns a maintenance task into a fatality.',
      checklist: [
        'Written LOTO procedures for each machine or energy source',
        'Locks, tags, and hasps available and assigned',
        'All affected and authorized employees trained',
        'Training documented with dates and names',
        'Annual periodic inspection completed and documented',
        'Contractors informed of LOTO requirements',
        'Group lockout procedures in place where needed',
      ],
    },
  },
  'emergency-action-plans': {
    title: 'Emergency Action Plans',
    subtitle: 'What Happens When the Alarm Goes Off',
    seo: 'Emergency action plan requirements for small businesses. Exit routes, fire extinguishers, evacuation procedures, and what OSHA expects.',
    sections: {
      whatItIs: 'Every operation with more than 10 employees needs a written Emergency Action Plan. It covers exit routes, alarm systems, evacuation procedures, and who does what when something goes wrong. Most small operations have a fire extinguisher on the wall and call that a plan.',
      whatGetsMissed: [
        'No written Emergency Action Plan',
        'Exit routes not posted or not clearly marked',
        'Fire extinguisher inspections overdue',
        'Employees never trained on evacuation procedures',
        'No designated assembly point after evacuation',
      ],
      whatISee: 'I ask where the assembly point is and get three different answers. Exit signs are blocked by racking. Fire extinguishers haven\'t been inspected in over a year — the tag is either missing or the last entry was 2023. Nobody knows where the plan is because it doesn\'t exist. When I ask what happens if there\'s a fire, the answer is "we leave." That\'s not a plan.',
      checklist: [
        'Written Emergency Action Plan on file',
        'Exit routes clearly marked and unobstructed',
        'Fire extinguishers inspected monthly (tag documented)',
        'Annual fire extinguisher maintenance by certified vendor',
        'Evacuation drills conducted and documented',
        'Assembly point designated and known by all employees',
        'Emergency contact list current and posted',
      ],
    },
  },
  'ppe-assessment': {
    title: 'PPE Assessment & Use',
    subtitle: 'More Than Just Handing Out Glasses',
    seo: 'PPE hazard assessment and compliance for small operations. What OSHA requires beyond just providing equipment.',
    sections: {
      whatItIs: 'OSHA doesn\'t just require PPE — it requires a written hazard assessment that determines what PPE is needed, where, and why. Then it requires documented training on proper use, maintenance, and limitations. Most small operations hand out safety glasses and gloves and assume that\'s enough.',
      whatGetsMissed: [
        'No written PPE hazard assessment',
        'PPE selection not based on actual hazards',
        'Training not documented',
        'Employees wearing damaged or wrong PPE',
        'No enforcement when PPE rules are ignored',
      ],
      whatISee: 'I see employees grinding without face shields, using the wrong gloves for the chemicals they\'re handling, and safety glasses so scratched they can barely see through them. When I ask about the hazard assessment, it\'s either a generic template or it doesn\'t exist. The employer bought the PPE — but never documented why those specific items were selected or trained anyone on when to use them.',
      checklist: [
        'Written PPE hazard assessment completed and certified',
        'PPE selected based on specific workplace hazards',
        'Employees trained on proper use, care, and limitations',
        'Training documented with dates and signatures',
        'PPE inspected regularly and replaced when damaged',
        'Enforcement consistent — violations addressed',
        'Assessment updated when processes or hazards change',
      ],
    },
  },
  'fall-protection': {
    title: 'Fall Protection',
    subtitle: 'It\'s Not Just a Roofing Problem',
    seo: 'Fall protection for warehouses and small operations. Mezzanines, loading docks, elevated platforms, and what OSHA requires.',
    sections: {
      whatItIs: 'Fall protection isn\'t limited to construction sites. In general industry, any walking-working surface 4 feet or higher requires protection — guardrails, safety nets, or personal fall arrest. Warehouse mezzanines, loading docks, elevated platforms, and even open-sided floors count. OSHA 1910.28 applies to every small operation with height exposure.',
      whatGetsMissed: [
        'Mezzanine guardrails missing or incomplete',
        'Loading dock edges unprotected',
        'No fall protection training documented',
        'Portable ladder use without inspection protocol',
        'Elevated storage platforms without edge protection',
      ],
      whatISee: 'I find mezzanines with a chain across the opening instead of a proper gate. Loading docks with no edge marking and no barrier. Workers on top of storage containers reaching overhead without any fall protection discussion. Ladders leaned against walls with no inspection tags. The 4-foot rule gets ignored because it doesn\'t feel that high — until someone falls and it\'s a recordable.',
      checklist: [
        'Guardrails on all open sides of platforms and mezzanines (42" top rail)',
        'Self-closing mezzanine gates at load/unload points',
        'Loading dock edges marked or protected',
        'Fall protection training documented for all exposed employees',
        'Portable ladders inspected before each use',
        'Fixed ladders meeting cage or personal fall arrest requirements',
        'Holes in walking surfaces covered and secured',
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
  const note = NOTES[slug];
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
        canonical={`/field-notes/${slug}`}
        ogType="article"
        ogImage={note.heroImage}
      />

      {/* JSON-LD Article + FAQPage schemas live in the pre-rendered static
          HTML via /scripts/generate-seo-pages.js. We do NOT inject them at
          runtime to avoid Google "Duplicate field" warnings. */}

      {/* Header */}
      <section className="bg-[#0B1F33] py-16 md:py-24" data-testid="note-header">
        <div className="container max-w-3xl">
          <Link to="/field-notes" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#1F6FEB] transition-colors mb-6" data-testid="back-to-notes">
            <ArrowLeft size={14} /> Field Notes
          </Link>
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-3"
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
            <h2 className="text-xl font-bold text-[#102133] mb-4">What It Is</h2>
            <div className="text-base text-[#102133]/70 leading-relaxed space-y-4 whitespace-pre-line">
              {note.sections.whatItIs.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* What OSHA Checks (if available) */}
          {note.oshaChecks && (
            <div className="mb-12" data-testid="note-osha-checks">
              <h2 className="text-xl font-bold text-[#102133] mb-4">What OSHA Checks</h2>
              <div className="space-y-3">
                {note.oshaChecks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#1558C0] mt-1 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <p className="text-base text-[#102133]/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Gets Missed */}
          <div className="mb-12" data-testid="note-what-gets-missed">
            <h2 className="text-xl font-bold text-[#102133] mb-4">What Most Operations Get Wrong</h2>
            <div className="space-y-3">
              {note.sections.whatGetsMissed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#1F6FEB] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>//</span>
                  <p className="text-base text-[#102133]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What I See */}
          <div className="mb-12 bg-[#F9F8F6] border-l-2 border-[#1F6FEB] p-6 rounded-r" data-testid="note-what-i-see">
            <h2 className="text-xl font-bold text-[#102133] mb-4">What GigLine Looks For</h2>
            <p className="text-base text-[#102133]/70 leading-relaxed italic">{note.sections.whatISee}</p>
          </div>

          {/* Checklist */}
          <div className="mb-12" data-testid="note-checklist">
            <h2 className="text-xl font-bold text-[#102133] mb-4">Quick Checklist</h2>
            <div className="space-y-3">
              {note.sections.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#102133]/20 text-[#1F6FEB] focus:ring-[#1F6FEB] accent-[#1F6FEB]" />
                  <span className="text-base text-[#102133]/70 group-hover:text-[#102133] transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#102133]/40">
              Print this page or use the browser print function (Ctrl+P / Cmd+P) to save a copy.
            </p>
          </div>

          {/* CFR Citation */}
          {note.cfrCitation && (
            <div className="mb-12 py-4 border-t border-[#102133]/10" data-testid="note-cfr-citation">
              <p className="text-xs text-[#102133]/40 uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Regulation Reference
              </p>
              <p className="text-sm text-[#102133]/60 font-medium mt-1">{note.cfrCitation}</p>
            </div>
          )}

          {/* Newsletter capture — soft list-builder per article */}
          <FieldNotesNewsletter source={`field-note-${slug}`} />

          {/* Related Field Notes */}
          {note.relatedNotes && (
            <div className="mb-8" data-testid="note-related">
              <p className="text-xs text-[#102133]/40 uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
                      className="text-sm text-[#102133]/60 hover:text-[#1558C0] transition-colors flex items-center gap-1"
                      data-testid={`related-note-${rSlug}`}
                    >
                      <ArrowRight size={12} />
                      {related.title}
                    </Link>
                  );
                })}
                <Link
                  to="/services"
                  className="text-sm text-[#1F6FEB] hover:text-[#1558C0] transition-colors flex items-center gap-1"
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
                  className="uppercase tracking-[3px] text-[#1F6FEB] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                >
                  Free Download
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#102133] mb-2" data-testid="download-title">
                  {note.download.title}
                </h3>
                <p className="text-sm text-[#102133]/55 mb-6">{note.download.description}</p>

                {dlStatus === 'sent' ? (
                  <div className="flex items-center gap-3 text-[#102133]/70" data-testid="download-success">
                    <Check size={20} className="text-[#1F6FEB]" />
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
                      className="flex-grow px-4 py-3 rounded border border-[#102133]/15 bg-white text-sm text-[#102133] placeholder:text-[#102133]/30 focus:outline-none focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/30"
                      data-testid="download-email-input"
                    />
                    <button
                      type="submit"
                      disabled={dlStatus === 'sending'}
                      className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-6 py-3 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60"
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
                <p className="text-xs text-[#102133]/30 mt-3">No spam. Just the PDF.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0B1F33]" data-testid="note-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-2">
            If you're not sure how this looks in your operation —
          </p>
          <p className="text-lg text-white font-medium mb-8">
            start with a walkthrough.
          </p>
          <Link
            to="/request-walkthrough"
            className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
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
