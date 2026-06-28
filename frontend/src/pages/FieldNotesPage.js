import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import FieldNotesNewsletter from '../components/FieldNotesNewsletter';

const FIELD_NOTES = [
  {
    slug: 'ai-generated-safety-programs',
    title: 'AI-Generated Safety Programs',
    subtitle: "What ChatGPT Can't See on Your Floor",
    description: 'Operators are using AI to write OSHA programs. The output looks compliant — until an inspector arrives. Here\'s why AI-generated programs fail at the floor level, and what a walkthrough surfaces that AI cannot.',
    topics: ['AI documentation gaps', 'paperwork vs. floor reality', 'inspection readiness'],
  },
  {
    slug: 'heat-stress',
    title: 'Heat Stress',
    subtitle: 'What Actually Matters on the Floor',
    description: 'How heat exposure gets missed, what triggers OSHA attention, and what small operations can do about it.',
    topics: ['what it is', 'what gets missed', 'what I see on the floor'],
  },
  {
    slug: 'forklift-safety',
    title: 'Forklift Safety',
    subtitle: 'Beyond the Certification Card',
    description: 'Certification gets the headlines, but daily inspections and pedestrian separation are where most operations break down.',
    topics: ['operator certification', 'daily inspections', 'pedestrian zones'],
  },
  {
    slug: 'electrical-safety',
    title: 'Electrical Access',
    subtitle: 'The Panel Nobody Can Reach',
    description: 'Blocked electrical panels are one of OSHA\'s most cited violations. Usually a forklift, a pallet, or a shelf is in the way.',
    topics: ['panel clearance', 'lockout-tagout', 'arc flash basics'],
  },
  {
    slug: 'hazcom',
    title: 'HazCom & SDS',
    subtitle: 'The #1 OSHA Citation',
    description: 'Missing labels, outdated SDS binders, and no written program. The most common violation in general industry.',
    topics: ['written program', 'SDS management', 'labeling requirements'],
  },
  {
    slug: 'machine-guarding',
    title: 'Machine Guarding',
    subtitle: 'When the Guard Gets Removed',
    description: 'Guards get removed for access, maintenance, or convenience. They don\'t always go back on. OSHA notices.',
    topics: ['point of operation', 'nip points', 'guard types'],
  },
  {
    slug: 'walking-surfaces',
    title: 'Walking Surfaces',
    subtitle: 'Trip Hazards You Walk Past Every Day',
    description: 'The most common source of recordable injuries in general industry. Cords, hoses, uneven floors, and blocked aisles.',
    topics: ['housekeeping', 'aisle markings', 'floor conditions'],
  },
  {
    slug: 'lockout-tagout',
    title: 'Lockout/Tagout (LOTO)',
    subtitle: 'The Step That Gets Skipped',
    description: 'Energy isolation during maintenance. Top 5 OSHA citation every year. Written procedures, locks, training, and annual inspections.',
    topics: ['energy isolation', 'written procedures', 'annual inspections'],
  },
  {
    slug: 'emergency-action-plans',
    title: 'Emergency Action Plans',
    subtitle: 'What Happens When the Alarm Goes Off',
    description: 'Exit routes, fire extinguishers, evacuation procedures. Most small operations have a fire extinguisher and call that a plan.',
    topics: ['evacuation procedures', 'fire extinguishers', 'exit routes'],
  },
  {
    slug: 'ppe-assessment',
    title: 'PPE Assessment & Use',
    subtitle: 'More Than Just Handing Out Glasses',
    description: 'OSHA requires a written hazard assessment, proper selection, and documented training. Not just buying safety glasses.',
    topics: ['hazard assessment', 'PPE selection', 'documented training'],
  },
  {
    slug: 'fall-protection',
    title: 'Fall Protection',
    subtitle: 'It\'s Not Just a Roofing Problem',
    description: 'Mezzanines, loading docks, elevated platforms. The 4-foot rule applies to every warehouse with height exposure.',
    topics: ['mezzanines', 'loading docks', 'guardrails'],
  },
  {
    slug: 'confined-space',
    title: 'Confined Space Entry',
    subtitle: 'The Permit Nobody Wrote',
    description: 'Tanks, vats, pits, silos. If it has limited entry and isn\'t designed for continuous occupancy, it\'s a permit-required confined space. Most small operations don\'t have the program.',
    topics: ['permit program', 'atmospheric testing', 'rescue procedures'],
  },
  {
    slug: 'scaffolding-safety',
    title: 'Scaffolding Safety',
    subtitle: 'Set Up Wrong, Used Anyway',
    description: 'Scaffolds assembled without a competent person, missing guardrails, and overloaded platforms. One of OSHA\'s top 10 citations every year.',
    topics: ['competent person', 'guardrails', 'load capacity'],
  },
  {
    slug: 'hearing-conservation',
    title: 'Hearing Conservation',
    subtitle: 'The Damage You Don\'t Feel Until It\'s Done',
    description: 'Noise exposure above 85 dBA triggers a full hearing conservation program. Most small shops have the noise but not the program.',
    topics: ['noise monitoring', 'audiometric testing', 'hearing protection'],
  },
  {
    slug: 'bloodborne-pathogens',
    title: 'Bloodborne Pathogens',
    subtitle: 'Not Just a Healthcare Problem',
    description: 'Any operation where employees could be exposed to blood or body fluids needs a written exposure control plan. First aid responders count.',
    topics: ['exposure control plan', 'first aid', 'sharps disposal'],
  },
  {
    slug: 'recordkeeping-300-log',
    title: 'OSHA Recordkeeping & the 300 Log',
    subtitle: 'The Form Nobody Fills Out Until It Is Too Late',
    description: '29 CFR Part 1904. Recordable injuries, the 300A summary that has to be posted every Feb 1, and the severe injury reports OSHA expects within 8 or 24 hours of an event.',
    topics: ['300 log', '300A summary', 'severe injury reporting'],
  },
  {
    slug: 'respiratory-protection',
    title: 'Respiratory Protection',
    subtitle: 'The Fit Test Nobody Did',
    description: 'Dust masks, half-face respirators, written program, medical evaluation, fit testing, and training. The five pieces that almost every small operation is missing at least one of.',
    topics: ['written program', 'medical evaluation', 'fit testing'],
  },
  {
    slug: 'silica-respirable-crystalline',
    title: 'Respirable Crystalline Silica',
    subtitle: 'The 50 µg/m³ Limit Nobody Measured',
    description: 'Concrete cutting, sandblasting, foundry work, stone fabrication. The OSHA silica standard requires exposure assessment, controls, medical surveillance, and a written exposure control plan. Most small operations have none of it.',
    topics: ['exposure assessment', 'engineering controls', 'medical surveillance'],
  },
  {
    slug: 'hot-work-welding',
    title: 'Hot Work, Welding & Cutting',
    subtitle: 'The Fire Watch That Walked Off',
    description: 'Welding, cutting, brazing, grinding. Subpart Q covers fire prevention, ventilation, eye protection, and compressed gas safety. Hot work permits, fire watches, and combustible material removal — the three most cited.',
    topics: ['hot work permits', 'fire watch', 'compressed gas cylinders'],
  },
  {
    slug: 'abrasive-wheels',
    title: 'Abrasive Wheels & Bench Grinders',
    subtitle: 'The Tongue Guard at 1/8 of an Inch',
    description: 'Tongue guards, work rests, ring tests, RPM limits. 29 CFR 1910.215 is one of the most specific and most violated standards in general industry. Bench grinders are everywhere — and they almost always fail inspection.',
    topics: ['tongue guards', 'work rests', 'ring testing'],
  },
  {
    slug: 'ladder-safety',
    title: 'Portable Ladder Safety',
    subtitle: 'The 4-to-1 Rule Nobody Remembers',
    description: 'Extension ladders, step ladders, fixed ladders. Inspection requirements, the 4-to-1 angle, three-point contact, and what disqualifies a ladder from service. A top OSHA citation in small operations.',
    topics: ['ladder inspection', '4-to-1 angle', 'three-point contact'],
  },
  {
    slug: 'eye-face-protection',
    title: 'Eye & Face Protection',
    subtitle: 'Safety Glasses Are Not a PPE Program',
    description: 'Z87.1 compliance, side shields, face shields for grinding and chemical work, and the hazard assessment that has to come first. Buying glasses is not the program — the documented assessment and training are.',
    topics: ['Z87.1 markings', 'face shields', 'hazard assessment'],
  },
  {
    slug: 'trenching-excavation',
    title: 'Trenching & Excavation',
    subtitle: 'The 5-Foot Rule That Buries People',
    description: 'Protective systems, competent person inspections, soil classification, and ladders within 25 feet. Trench collapses kill an average of 22 workers a year. The Triad has been a recent trench-fatality flashpoint.',
    topics: ['protective systems', 'competent person', 'soil classification'],
  },
  {
    slug: 'cranes-rigging',
    title: 'Overhead Cranes & Rigging',
    subtitle: 'The Sling That Should Have Been Retired',
    description: 'Daily inspections, annual inspections, sling condition, rated capacity, and operator training. 29 CFR 1910.179 plus the 1926 construction provisions. Most fab and metals shops have at least one nonconforming sling on a hook right now.',
    topics: ['sling inspection', 'annual inspection', 'operator training'],
  },
  {
    slug: 'nc-osha-vs-federal',
    title: 'NC State Plan vs. Federal OSHA',
    subtitle: 'What North Carolina Does Differently',
    description: 'NC operates an approved State Plan. Compliance officers come from the NC Department of Labor, not federal OSHA. The standards mirror federal — but enforcement, penalty schedules, and consultation services differ in ways that matter to Triad operations.',
    topics: ['NC State Plan', 'NCDOL inspections', 'consultation services'],
  },
];

const FieldNotesPage = () => {
  return (
    <main>
      <SEO
        title="OSHA Safety Tips for Small Manufacturers | GigLine Field Notes"
        description="OSHA safety tips and plain-language guidance for small manufacturers. Field notes on HazCom, forklift safety, electrical, LOTO, PPE, and fall protection."
        canonical="/field-notes"
      />

      {/* Header */}
      <section className="bg-[#0d1b2a] py-16 md:py-24" data-testid="field-notes-header">
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] text-[#1a6fc4] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            Field Notes
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-7" data-testid="field-notes-headline">
            What We See. What Gets Missed.
          </h1>

          <blockquote
            className="mb-8 max-w-2xl"
            style={{
              borderLeft: '3px solid #c8922a',
              padding: '4px 0 4px 22px',
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 2.4vw, 26px)',
              lineHeight: 1.4,
              color: '#c8922a',
            }}
            data-testid="field-notes-standout"
          >
            <p>Safety becomes the thing you will get to.</p>
            <p>OSHA does not wait for you to get to it.</p>
          </blockquote>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            Practical breakdowns of the safety topics that come up most in small operations. Not theory &mdash; what we actually find on the floor.
          </p>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-16 md:py-24 bg-white" data-testid="field-notes-grid">
        <div className="container max-w-4xl">
          <div className="space-y-0 border-t border-[#dde3ea]">
            {FIELD_NOTES.map((note) => (
              <Link
                key={note.slug}
                to={`/field-notes/${note.slug}`}
                className="block py-8 border-b border-[#dde3ea] group"
                data-testid={`field-note-${note.slug}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-[#0d1b2a] group-hover:text-[#1560ae] transition-colors mb-1">
                      {note.title}
                    </h2>
                    <p className="text-sm text-[#1a6fc4] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {note.subtitle}
                    </p>
                    <p className="text-base text-[#0d1b2a]/60 leading-relaxed mb-3">
                      {note.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {note.topics.map((topic) => (
                        <span key={topic} className="text-xs px-2 py-1 rounded bg-[#0d1b2a]/5 text-[#0d1b2a]/50">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[#0d1b2a]/20 group-hover:text-[#1560ae] transition-colors flex-shrink-0 mt-2 hidden md:block" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-12 text-sm text-[#0d1b2a]/40 text-center">
            New topics added monthly based on what we're seeing in the field.
          </p>

          {/* Newsletter capture — soft list-builder */}
          <div className="max-w-4xl mx-auto">
            <FieldNotesNewsletter source="field-notes-index" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0d1b2a]" data-testid="field-notes-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-6">
            Reading about it is useful. Having someone walk your floor is better.
          </p>
          <Link
            to="/intake"
            className="bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
            data-testid="field-notes-walkthrough-cta"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default FieldNotesPage;
