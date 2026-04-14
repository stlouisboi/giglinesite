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
    title: 'Forklift Safety',
    subtitle: 'Beyond the Certification Card',
    seo: 'Forklift safety beyond certification. What OSHA actually checks, what gets missed in daily operations, and how to fix it.',
    sections: {
      whatItIs: 'Forklift safety is more than a certification card. OSHA requires operator training, evaluation, daily pre-shift inspections, and pedestrian separation. Most operations have the card — but the daily practices have slipped.',
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
    title: 'Electrical Access',
    subtitle: 'The Panel Nobody Can Reach',
    seo: 'Electrical panel safety for small operations. Blocked panels, clearance requirements, and what OSHA cites most.',
    sections: {
      whatItIs: 'Electrical panels require 36 inches of clearance on all sides — no exceptions. This is one of OSHA\'s most cited violations because it\'s easy to check and almost always blocked in small operations. A pallet, a shelf, a parts bin, a forklift.',
      whatGetsMissed: [
        'Panels blocked by inventory or equipment',
        'Clearance zone not marked on the floor',
        'Panel doors missing or damaged',
        'Labels inside panel faded or incorrect',
        'No lockout-tagout procedures for electrical maintenance',
      ],
      whatISee: 'In almost every facility I walk into, at least one electrical panel is partially blocked. The most common offender is a pallet leaned against the wall "temporarily." I\'ve seen panels behind shelving units that can\'t be accessed without moving product. The floor isn\'t marked, and when I ask how they\'d shut power in an emergency, the answer is usually "we\'d figure it out."',
      checklist: [
        '36-inch clearance maintained on all sides of panels',
        'Floor markings indicate clearance zone',
        'All panel doors intact and closeable',
        'Panel directories current and legible',
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
      />

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

          {/* What Gets Missed */}
          <div className="mb-12" data-testid="note-what-gets-missed">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What Gets Missed</h2>
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
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What I See on the Floor</h2>
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
