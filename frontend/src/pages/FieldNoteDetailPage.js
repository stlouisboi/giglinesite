import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Download, Check } from 'lucide-react';
import { trackPDFDownload } from '../utils/analytics';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

/* ── Field Note content database ── */
const NOTES = {
  'heat-stress': {
    title: 'Heat Stress',
    subtitle: 'What Actually Matters on the Floor',
    seo: 'Heat stress safety for small operations. What gets missed, what OSHA looks for, and what to do about it.',
    download: {
      title: '2026 Heat Stress Action Template',
      description: 'A printable checklist and action plan for managing heat stress on the floor. Built for small operations.',
      image: '/GL_Heat_Stress_Mockup_Web.png',
      endpoint: '/api/heat-guide/submit',
    },
    sections: {
      whatItIs: 'Heat stress happens when the body can\'t cool itself fast enough. In warehouses, manufacturing floors, and outdoor operations, it shows up faster than most people expect — especially during summer in enclosed spaces with poor ventilation.',
      whatGetsMissed: [
        'No written heat illness prevention plan',
        'Water stations too far from work areas',
        'No acclimatization plan for new or returning workers',
        'Break schedules not adjusted for temperature',
        'Supervisors untrained on early warning signs',
      ],
      whatISee: 'I walk into facilities in July where the floor temperature is 15–20 degrees hotter than the office. Workers are sweating through shirts by 10 AM. There\'s a water cooler by the break room — 200 feet from the press line. Nobody has been trained on what to watch for, and the new hire started Monday in full PPE without an acclimatization period.',
      checklist: [
        'Written heat illness prevention plan in place',
        'Water available within 50 feet of all work areas',
        'Acclimatization plan for new and returning workers',
        'Break frequency increases with temperature',
        'Supervisors trained on heat illness recognition',
        'Buddy system or check-in protocol in place',
        'Cool-down area accessible and shaded',
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
      whatItIs: 'Forklift safety is more than a certification card. OSHA requires operator training, evaluation, daily pre-shift inspections, and pedestrian separation. Most operations have the card — but the daily practices have slipped. Pre-shift inspections are required under 29 CFR 1910.178(q) and must be documented. Missing records are a citable condition on the first OSHA visit.',
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
      whatItIs: 'Electrical panels require 36 inches of clearance on all sides — no exceptions. This is one of OSHA\'s most cited violations because it\'s easy to check and almost always blocked in small operations. A pallet, a shelf, a parts bin, a forklift. Beyond access, NFPA 70E requires arc flash hazard labels on all electrical equipment and establishes approach boundaries for qualified and unqualified workers.',
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
    sections: {
      whatItIs: 'Hazard Communication (HazCom) is OSHA\'s most cited standard — year after year. It requires a written program, Safety Data Sheets for every chemical on site, proper labeling on every container, and documented employee training. Most small operations have pieces of this, but not the whole thing.',
      whatGetsMissed: [
        'No written HazCom program',
        'SDS binder incomplete, outdated, or inaccessible',
        'Secondary containers missing labels',
        'New chemicals added without updating SDS',
        'Training not documented or not specific to site chemicals',
      ],
      whatISee: 'I find spray bottles with no labels, cleaning chemicals under sinks with no SDS, and "the binder" in a manager\'s office that hasn\'t been updated since 2019. Workers know they use chemicals — they don\'t know what\'s in them or where the data sheets are. The written program, if it exists, is a template downloaded and never customized.',
      checklist: [
        'Written HazCom program specific to your operation',
        'SDS available for every chemical on site',
        'SDS accessible to all employees during every shift',
        'All containers — including secondary — properly labeled',
        'Employee training documented with dates and names',
        'New chemical review process in place',
        'Chemical inventory list current and complete',
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
        title={`${note.title} — Field Notes | GigLine Safety & Compliance`}
        description={note.seo}
        canonical={`/field-notes/${slug}`}
        schema={note.faqSchema ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": note.faqSchema.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
          }))
        } : undefined}
      />

      {/* Article Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": note.title,
        "description": note.seo,
        "author": { "@type": "Person", "name": "Vince Lawrence" },
        "publisher": {
          "@type": "Organization",
          "name": "GigLine Safety & Compliance",
          "url": "https://giglinecompliance.com"
        },
        "datePublished": "2026-04-15",
        "dateModified": "2026-04-15",
        "mainEntityOfPage": `https://giglinecompliance.com/field-notes/${slug}`
      })}} />

      {/* Header */}
      <section className="bg-[#0D1B2A] py-16 md:py-24" data-testid="note-header">
        <div className="container max-w-3xl">
          <Link to="/field-notes" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C9A84C] transition-colors mb-6" data-testid="back-to-notes">
            <ArrowLeft size={14} /> Field Notes
          </Link>
          <p
            className="uppercase tracking-[3px] text-[#C9A84C] mb-3"
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
          {/* What It Is */}
          <div className="mb-12" data-testid="note-what-it-is">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What It Is</h2>
            <p className="text-base text-[#1C2B2B]/70 leading-relaxed">{note.sections.whatItIs}</p>
          </div>

          {/* What OSHA Checks (if available) */}
          {note.oshaChecks && (
            <div className="mb-12" data-testid="note-osha-checks">
              <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What OSHA Checks</h2>
              <div className="space-y-3">
                {note.oshaChecks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#B8972C] mt-1 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <p className="text-base text-[#1C2B2B]/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Gets Missed */}
          <div className="mb-12" data-testid="note-what-gets-missed">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What Most Operations Get Wrong</h2>
            <div className="space-y-3">
              {note.sections.whatGetsMissed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#C9A84C] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>//</span>
                  <p className="text-base text-[#1C2B2B]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What I See */}
          <div className="mb-12 bg-[#F9F8F6] border-l-2 border-[#C9A84C] p-6 rounded-r" data-testid="note-what-i-see">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What GigLine Looks For</h2>
            <p className="text-base text-[#1C2B2B]/70 leading-relaxed italic">{note.sections.whatISee}</p>
          </div>

          {/* Checklist */}
          <div className="mb-12" data-testid="note-checklist">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">Quick Checklist</h2>
            <div className="space-y-3">
              {note.sections.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#1C2B2B]/20 text-[#C9A84C] focus:ring-[#C9A84C] accent-[#C9A84C]" />
                  <span className="text-base text-[#1C2B2B]/70 group-hover:text-[#1C2B2B] transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#1C2B2B]/40">
              Print this page or use the browser print function (Ctrl+P / Cmd+P) to save a copy.
            </p>
          </div>

          {/* CFR Citation */}
          {note.cfrCitation && (
            <div className="mb-12 py-4 border-t border-[#1C2B2B]/10" data-testid="note-cfr-citation">
              <p className="text-xs text-[#1C2B2B]/40 uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Regulation Reference
              </p>
              <p className="text-sm text-[#1C2B2B]/60 font-medium mt-1">{note.cfrCitation}</p>
            </div>
          )}

          {/* Related Field Notes */}
          {note.relatedNotes && (
            <div className="mb-8" data-testid="note-related">
              <p className="text-xs text-[#1C2B2B]/40 uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
                      className="text-sm text-[#1C2B2B]/60 hover:text-[#B8972C] transition-colors flex items-center gap-1"
                      data-testid={`related-note-${rSlug}`}
                    >
                      <ArrowRight size={12} />
                      {related.title}
                    </Link>
                  );
                })}
                <Link
                  to="/services"
                  className="text-sm text-[#C9A84C] hover:text-[#B8972C] transition-colors flex items-center gap-1"
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
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                >
                  Free Download
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-2" data-testid="download-title">
                  {note.download.title}
                </h3>
                <p className="text-sm text-[#1C2B2B]/55 mb-6">{note.download.description}</p>

                {dlStatus === 'sent' ? (
                  <div className="flex items-center gap-3 text-[#1C2B2B]/70" data-testid="download-success">
                    <Check size={20} className="text-[#C9A84C]" />
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
                      className="flex-grow px-4 py-3 rounded border border-[#1C2B2B]/15 bg-white text-sm text-[#1C2B2B] placeholder:text-[#1C2B2B]/30 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                      data-testid="download-email-input"
                    />
                    <button
                      type="submit"
                      disabled={dlStatus === 'sending'}
                      className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-6 py-3 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60"
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
                <p className="text-xs text-[#1C2B2B]/30 mt-3">No spam. Just the PDF.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0D1B2A]" data-testid="note-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-2">
            If you're not sure how this looks in your operation —
          </p>
          <p className="text-lg text-white font-medium mb-8">
            start with a walkthrough.
          </p>
          <Link
            to="/request-walkthrough"
            className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
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
