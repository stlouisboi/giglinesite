import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const FIELD_NOTES = [
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
      <section className="bg-[#0B1F33] py-16 md:py-24" data-testid="field-notes-header">
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            Field Notes
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6" data-testid="field-notes-headline">
            What We See. What Gets Missed.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            Practical breakdowns of the safety topics that come up most in small operations. Not theory — what we actually find on the floor.
          </p>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-16 md:py-24 bg-white" data-testid="field-notes-grid">
        <div className="container max-w-4xl">
          <div className="space-y-0 border-t border-[#102133]/10">
            {FIELD_NOTES.map((note) => (
              <Link
                key={note.slug}
                to={`/field-notes/${note.slug}`}
                className="block py-8 border-b border-[#102133]/10 group"
                data-testid={`field-note-${note.slug}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-[#102133] group-hover:text-[#1558C0] transition-colors mb-1">
                      {note.title}
                    </h2>
                    <p className="text-sm text-[#1F6FEB] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {note.subtitle}
                    </p>
                    <p className="text-base text-[#102133]/60 leading-relaxed mb-3">
                      {note.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {note.topics.map((topic) => (
                        <span key={topic} className="text-xs px-2 py-1 rounded bg-[#102133]/5 text-[#102133]/50">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[#102133]/20 group-hover:text-[#1558C0] transition-colors flex-shrink-0 mt-2 hidden md:block" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-12 text-sm text-[#102133]/40 text-center">
            New topics added monthly based on what we're seeing in the field.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0B1F33]" data-testid="field-notes-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-6">
            Reading about it is useful. Having someone walk your floor is better.
          </p>
          <Link
            to="/request-walkthrough"
            className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
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
