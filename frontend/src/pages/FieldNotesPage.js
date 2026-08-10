import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import SEO from '../components/SEO';
import FieldNotesNewsletter from '../components/FieldNotesNewsletter';

// CFR subpart label for each field note. Lives alongside FIELD_NOTES so the
// filter dropdown can derive options from a single source of truth.
const CFR_BY_SLUG = {
  'ai-generated-safety-programs': '29 CFR 1910 — General Industry',
  'heat-stress': 'OSHA General Duty Clause',
  'forklift-safety': '29 CFR 1910.178 — Forklifts',
  'electrical-safety': '29 CFR 1910 Subpart S — Electrical',
  'hazcom': '29 CFR 1910.1200 — HazCom',
  'machine-guarding': '29 CFR 1910.212 — Machine Guarding',
  'walking-surfaces': '29 CFR 1910 Subpart D — Walking-Working Surfaces',
  'lockout-tagout': '29 CFR 1910.147 — LOTO',
  'emergency-action-plans': '29 CFR 1910.38 — Emergency Action Plans',
  'ppe-assessment': '29 CFR 1910 Subpart I — PPE',
  'fall-protection': '29 CFR 1910 Subpart D — Fall Protection',
  'confined-space': '29 CFR 1910.146 — Confined Space',
  'scaffolding-safety': '29 CFR 1926.451 — Scaffolding',
  'hearing-conservation': '29 CFR 1910.95 — Hearing Conservation',
  'bloodborne-pathogens': '29 CFR 1910.1030 — Bloodborne Pathogens',
  'recordkeeping-300-log': '29 CFR Part 1904 — Recordkeeping',
  'respiratory-protection': '29 CFR 1910.134 — Respiratory Protection',
  'silica-respirable-crystalline': '29 CFR 1910.1053 — Silica',
  'hot-work-welding': '29 CFR 1910 Subpart Q — Welding',
  'abrasive-wheels': '29 CFR 1910.215 — Abrasive Wheels',
  'ladder-safety': '29 CFR 1910.23 — Ladders',
  'eye-face-protection': '29 CFR 1910.133 — Eye & Face PPE',
  'trenching-excavation': '29 CFR 1926.651 — Trenching',
  'cranes-rigging': '29 CFR 1910.179 — Cranes',
  'nc-osha-vs-federal': 'NC State Plan',
};

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
  const [keyword, setKeyword] = useState('');
  const [cfrFilter, setCfrFilter] = useState('');

  // Unique CFR subpart options, sorted alphabetically. Derived from the
  // CFR_BY_SLUG map — no hardcoded option lists.
  const cfrOptions = useMemo(
    () =>
      Array.from(new Set(Object.values(CFR_BY_SLUG))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [],
  );

  // Filtered notes: keyword search across title/subtitle/description/topics,
  // AND CFR-subpart match when a filter is selected.
  const filteredNotes = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return FIELD_NOTES.filter((note) => {
      // CFR filter: when active, exclude notes without a subpart entry.
      if (cfrFilter) {
        const subpart = CFR_BY_SLUG[note.slug];
        if (!subpart || subpart !== cfrFilter) return false;
      }
      // Keyword filter
      if (kw) {
        const haystack = [
          note.title,
          note.subtitle,
          note.description,
          ...(note.topics || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [keyword, cfrFilter]);

  const hasActiveFilter = keyword.trim() !== '' || cfrFilter !== '';
  const clearFilters = () => {
    setKeyword('');
    setCfrFilter('');
  };

  return (
    <main>
      <SEO
        title="OSHA Safety Tips for Small Manufacturers | GigLine Field Notes"
        description="OSHA safety tips and plain-language guidance for small manufacturers. Field notes on HazCom, forklift safety, electrical, LOTO, PPE, and fall protection."
        canonical="/field-notes"
      />

      {/* Header */}
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{
          backgroundColor: '#102A43',
          backgroundImage: 'linear-gradient(rgba(28,43,43,0.55), rgba(28,43,43,0.72)), url(/assets/field-notes-header.webp)',
          backgroundSize: 'cover',
          backgroundPosition: '50% 20%',
          backgroundRepeat: 'no-repeat',
        }}
        data-testid="field-notes-header"
      >
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] mb-4"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#C9A84C',
              fontWeight: 700,
              letterSpacing: '0.28em',
            }}
            data-testid="field-notes-kicker"
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

          {/* Search + Filter Bar */}
          <div
            className="flex flex-col md:flex-row gap-3 mb-8 pb-6 border-b border-[#dde3ea]"
            data-testid="field-notes-filter-bar"
          >
            <div className="relative flex-grow">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2B2B]/40"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search field notes…"
                className="w-full pl-10 pr-10 py-3 rounded border border-[#2A52A0]/15 bg-white text-sm text-[#1C2B2B] placeholder:text-[#1C2B2B]/40 focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                data-testid="field-notes-search-input"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C2B2B]/40 hover:text-[#1C2B2B]"
                  data-testid="field-notes-search-clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={cfrFilter}
              onChange={(e) => setCfrFilter(e.target.value)}
              className="md:w-72 py-3 px-3 rounded border border-[#2A52A0]/15 bg-white text-sm text-[#1C2B2B] focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
              data-testid="field-notes-cfr-filter"
              aria-label="Filter by CFR subpart"
            >
              <option value="">All CFR subparts</option>
              {cfrOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {filteredNotes.length === 0 ? (
            <div
              className="py-16 text-center"
              data-testid="field-notes-empty-state"
            >
              <p className="text-base text-[#1C2B2B]/60 mb-4">
                No Field Notes match your search. Try a different keyword or clear the filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-[#2A52A0] hover:text-[#1F3F80] inline-flex items-center gap-1"
                data-testid="field-notes-empty-clear"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {hasActiveFilter && (
                <div
                  className="flex items-center justify-between mb-4 text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  data-testid="field-notes-result-count"
                >
                  <span className="text-[#1C2B2B]/55">
                    Showing {filteredNotes.length} of {FIELD_NOTES.length}
                  </span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[#2A52A0] hover:text-[#1F3F80] font-semibold"
                    data-testid="field-notes-clear-link"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              <div className="space-y-0 border-t border-[#dde3ea]">
                {filteredNotes.map((note) => (
                  <Link
                    key={note.slug}
                    to={`/field-notes/${note.slug}`}
                    className="block py-8 border-b border-[#dde3ea] group"
                    data-testid={`field-note-${note.slug}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-[#1C2B2B] group-hover:text-[#1F3F80] transition-colors mb-1">
                          {note.title}
                        </h2>
                        <p className="text-sm text-[#2A52A0] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {note.subtitle}
                        </p>
                        <p className="text-base text-[#1C2B2B]/60 leading-relaxed mb-3">
                          {note.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {note.topics.map((topic) => (
                            <span key={topic} className="text-xs px-2 py-1 rounded bg-[#102A43]/5 text-[#1C2B2B]/50">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-[#1C2B2B]/20 group-hover:text-[#1F3F80] transition-colors flex-shrink-0 mt-2 hidden md:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <p className="mt-12 text-sm text-[#1C2B2B]/40 text-center">
            New topics added monthly based on what we're seeing in the field.
          </p>

          {/* Newsletter capture — soft list-builder */}
          <div className="max-w-4xl mx-auto">
            <FieldNotesNewsletter source="field-notes-index" />
          </div>
        </div>
      </section>

      {/* ═══ GL-WEB-025: Field Notes Booking CTA (bottom) ═══ */}
      <section className="py-16 md:py-24 bg-[#102A43]" data-testid="field-notes-cta">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What you just read is what we look for on the floor.
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            If any of these gaps exist in your operation, a Safety Walkthrough will find them — before OSHA does.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/intake?service=safety-walkthrough-report"
              className="w-full sm:w-auto bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold px-8 py-4 rounded transition-colors inline-flex items-center justify-center gap-2"
              data-testid="field-notes-walkthrough-cta"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/safety-check"
              className="text-sm text-white/60 hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1.5"
              data-testid="field-notes-safety-check-link"
            >
              Or take the 6-question Safety Check first
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FieldNotesPage;
