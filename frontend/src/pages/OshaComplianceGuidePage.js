import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FlaskConical,
  Cog,
  ArrowUpFromLine,
  HardHat,
  ClipboardList,
  Truck,
} from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const NAVY = '#1C2B2B';
const GOLD = '#C9A84C';
const BLUE = '#2A52A0';
const CREAM = '#F9F8F6';

// 25 Field Notes organized into 6 OSHA-aligned topical clusters.
// Order within each cluster: most-cited → adjacent → newer/specialized.
const CLUSTERS = [
  {
    id: 'chemical-health',
    icon: FlaskConical,
    eyebrow: 'Cluster 01',
    title: 'Chemical & Health Exposure',
    blurb:
      'Hazard Communication is the #1 most-cited OSHA standard in general industry. The exposure programs below are where the documentation almost always lags behind the floor.',
    notes: [
      { slug: 'hazcom', title: 'HazCom & SDS', note: '#1 OSHA citation — 29 CFR 1910.1200' },
      { slug: 'respiratory-protection', title: 'Respiratory Protection', note: 'Written program, medical eval, fit test — 1910.134' },
      { slug: 'silica-respirable-crystalline', title: 'Respirable Crystalline Silica', note: 'Stone fab, concrete, foundries — 1910.1053' },
      { slug: 'hearing-conservation', title: 'Hearing Conservation', note: 'Noise monitoring + audiometric testing — 1910.95' },
      { slug: 'bloodborne-pathogens', title: 'Bloodborne Pathogens', note: 'Exposure control plan + Hep B — 1910.1030' },
    ],
  },
  {
    id: 'mechanical-energy',
    icon: Cog,
    eyebrow: 'Cluster 02',
    title: 'Mechanical & Energy Control',
    blurb:
      "Machinery, electrical, and hot work. The standards in this cluster cause more of OSHA's serious citations and fatality reports than any other group in general industry.",
    notes: [
      { slug: 'machine-guarding', title: 'Machine Guarding', note: 'Point-of-operation guards — 1910.212' },
      { slug: 'lockout-tagout', title: 'Lockout/Tagout (LOTO)', note: 'Control of hazardous energy — 1910.147' },
      { slug: 'electrical-safety', title: 'Electrical Access', note: 'Panel clearance, arc flash — 1910.303' },
      { slug: 'abrasive-wheels', title: 'Abrasive Wheels & Bench Grinders', note: 'Tongue guards, ring test — 1910.215' },
      { slug: 'cranes-rigging', title: 'Overhead Cranes & Rigging', note: 'Inspections, sling capacity — 1910.179 / 1910.184' },
      { slug: 'hot-work-welding', title: 'Hot Work, Welding & Cutting', note: 'Permits, fire watch — Subpart Q' },
    ],
  },
  {
    id: 'fall-height',
    icon: ArrowUpFromLine,
    eyebrow: 'Cluster 03',
    title: 'Fall & Height Work',
    blurb:
      'The 4-foot rule, ladder geometry, scaffold competence. Falls remain among the most-cited OSHA standards every year — and the most preventable.',
    notes: [
      { slug: 'fall-protection', title: 'Fall Protection', note: 'Mezzanines, docks, the 4-foot rule — 1910.28' },
      { slug: 'ladder-safety', title: 'Portable Ladder Safety', note: '4-to-1 angle, three-point contact — 1910.23' },
      { slug: 'scaffolding-safety', title: 'Scaffolding Safety', note: 'Competent person, guardrails — 1910.27' },
      { slug: 'walking-surfaces', title: 'Walking Surfaces', note: 'Aisles, edges, housekeeping — 1910.22' },
    ],
  },
  {
    id: 'ppe',
    icon: HardHat,
    eyebrow: 'Cluster 04',
    title: 'PPE & Personal Protection',
    blurb:
      'PPE without a written hazard assessment is a citation waiting to happen. These two notes anchor the standard for every other exposure type on this page.',
    notes: [
      { slug: 'ppe-assessment', title: 'PPE Assessment & Use', note: 'Written hazard assessment + selection — 1910.132' },
      { slug: 'eye-face-protection', title: 'Eye & Face Protection', note: 'Z87.1, side shields, face shields — 1910.133' },
    ],
  },
  {
    id: 'process-recordkeeping',
    icon: ClipboardList,
    eyebrow: 'Cluster 05',
    title: 'Process, Recordkeeping & Enforcement',
    blurb:
      'The paperwork OSHA asks for first. If the 300 log is missing or the EAP cannot be produced, the inspection narrative is already written before the floor walk begins.',
    notes: [
      { slug: 'recordkeeping-300-log', title: 'OSHA Recordkeeping & the 300 Log', note: 'Recordables, 300A, severe injury reports — Part 1904' },
      { slug: 'emergency-action-plans', title: 'Emergency Action Plans', note: 'Evacuation, alarm, training — 1910.38' },
      { slug: 'nc-osha-vs-federal', title: 'NC State Plan vs. Federal OSHA', note: 'NCDOL inspections, BETS consultation' },
      { slug: 'ai-generated-safety-programs', title: 'AI-Generated Safety Programs', note: 'What ChatGPT cannot see on your floor' },
    ],
  },
  {
    id: 'operations-movement',
    icon: Truck,
    eyebrow: 'Cluster 06',
    title: 'Operations, Movement & Environment',
    blurb:
      'Vehicles, confined spaces, trenches, heat. Hazards that change with the day, the season, and the task — and that an inspector asks the floor supervisor to describe from memory.',
    notes: [
      { slug: 'forklift-safety', title: 'Forklift Safety', note: 'Daily inspections, certification — 1910.178' },
      { slug: 'confined-space', title: 'Confined Space Entry', note: 'Permits, testing, rescue — 1910.146' },
      { slug: 'trenching-excavation', title: 'Trenching & Excavation', note: 'Protective systems, competent person — 1926.651' },
      { slug: 'heat-stress', title: 'Heat Stress', note: 'General Duty Clause + NEP CPL 03-00-024' },
    ],
  },
];

const OshaComplianceGuidePage = () => {
  const totalNotes = CLUSTERS.reduce((acc, c) => acc + c.notes.length, 0);

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The OSHA Compliance Guide for Small Manufacturing & Warehouse Operations',
    description:
      'A complete index of 25 OSHA compliance topics for NC manufacturing, warehouse, and contractor operations — organized by hazard cluster, CFR-cited, written by Vince Lawrence.',
    url: 'https://www.giglinecompliance.com/osha-compliance-guide',
    inLanguage: 'en-US',
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'OSHA Compliance Field Notes — Topical Index',
    url: 'https://www.giglinecompliance.com/osha-compliance-guide',
    hasPart: CLUSTERS.flatMap((c) =>
      c.notes.map((n) => ({
        '@type': 'Article',
        headline: n.title,
        url: `https://www.giglinecompliance.com/field-notes/${n.slug}`,
      }))
    ),
  };

  return (
    <main data-testid="osha-compliance-guide-page">
      <SEO
        title="The OSHA Compliance Guide — All 25 Topics, Organized by Hazard | GigLine"
        description="The complete OSHA compliance reference for NC small manufacturing and warehouse operations. 25 CFR-cited field notes organized into six hazard clusters — written by Vince Lawrence, GigLine Safety & Compliance."
        canonical="/osha-compliance-guide"
        schema={[pageSchema, collectionSchema]}
      />

      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-14 md:pb-20" style={{ background: NAVY }} data-testid="osha-guide-hero">
        <div className="container max-w-5xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}
            data-testid="osha-guide-eyebrow"
          >
            The OSHA Compliance Guide
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-4xl"
            data-testid="osha-guide-headline"
          >
            <span className="block">Every OSHA exposure point</span>
            <span className="block" style={{ color: GOLD }}>a small operation actually sees.</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-8 max-w-3xl">
            {totalNotes} CFR-cited field notes — organized into six hazard clusters. Hazard Communication. Machine guarding and energy control. Fall and height work. PPE. Recordkeeping and enforcement. Operations and environment. Each note is written from the floor, not the binder.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3" style={mono}>
            <span className="text-white/55 text-xs uppercase tracking-[0.18em]">By Vince Lawrence</span>
            <span className="text-white/30">·</span>
            <span className="text-white/55 text-xs uppercase tracking-[0.18em]">OSHA 30 · USN Veteran</span>
            <span className="text-white/30">·</span>
            <span className="text-white/55 text-xs uppercase tracking-[0.18em]">Kernersville, NC</span>
          </div>
        </div>
      </section>

      {/* Cluster jump-nav */}
      <section className="py-6 border-b" style={{ background: 'white', borderColor: 'rgba(28,43,43,0.10)' }} data-testid="osha-guide-jumpnav">
        <div className="container max-w-5xl">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="uppercase tracking-[0.18em] text-[#1C2B2B]/40" style={{ ...mono, fontSize: '10px' }}>
              Jump to →
            </span>
            {CLUSTERS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="text-[#1C2B2B]/70 hover:text-[#2A52A0] transition-colors"
                data-testid={`jumpnav-${c.id}`}
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Clusters */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-5xl">
          {CLUSTERS.map((cluster, idx) => {
            const Icon = cluster.icon;
            return (
              <section
                key={cluster.id}
                id={cluster.id}
                className={`scroll-mt-24 ${idx > 0 ? 'mt-16 md:mt-20 pt-12 md:pt-14 border-t border-[#1C2B2B]/10' : ''}`}
                data-testid={`cluster-${cluster.id}`}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="flex items-center justify-center rounded"
                    style={{ background: 'rgba(42,82,160,0.08)', width: 44, height: 44, flexShrink: 0 }}
                  >
                    <Icon size={22} className="text-[#2A52A0]" />
                  </div>
                  <div className="flex-grow">
                    <p
                      className="uppercase font-bold mb-1.5"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: GOLD }}
                    >
                      {cluster.eyebrow}
                    </p>
                    <h2
                      className="text-2xl md:text-3xl font-bold text-[#1C2B2B] leading-tight"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {cluster.title}
                    </h2>
                  </div>
                </div>
                <p className="text-base text-[#1C2B2B]/70 leading-[1.7] mb-8 max-w-3xl">
                  {cluster.blurb}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {cluster.notes.map((n) => (
                    <li key={n.slug}>
                      <Link
                        to={`/field-notes/${n.slug}`}
                        className="block p-5 rounded transition-all hover:translate-x-0.5 group"
                        style={{ background: CREAM, border: '1px solid rgba(28,43,43,0.08)' }}
                        data-testid={`cluster-note-${n.slug}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-bold text-[#1C2B2B] group-hover:text-[#2A52A0] transition-colors">
                            {n.title}
                          </h3>
                          <ArrowRight size={14} className="text-[#2A52A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p
                          className="text-[#1C2B2B]/55 leading-snug"
                          style={{ ...mono, fontSize: '11.5px' }}
                        >
                          {n.note}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 border-t border-[#1C2B2B]/10" style={{ background: CREAM }} data-testid="osha-guide-cta">
        <div className="container max-w-3xl">
          {/* Trust strip — anchors the closing CTA in real numbers (GL-WEB-022) */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-0 rounded mb-10 overflow-hidden"
            style={{ background: NAVY }}
            data-testid="pillar-trust-strip"
          >
            {[
              { stat: '25+ Years', label: 'Manufacturing Operations Experience' },
              { stat: '12 of 13', label: 'Findings Closed in 4 Days · Statesville Case Study' },
              { stat: 'NC-Based', label: 'Kernersville · Piedmont Triad · OSHA 30 Certified' },
            ].map((s, i) => (
              <div
                key={i}
                className="px-5 py-6 text-center"
                style={{
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}
                data-testid={`pillar-trust-${i}`}
              >
                <p
                  className="font-bold leading-none mb-2"
                  style={{ color: GOLD, fontSize: 'clamp(20px, 2.4vw, 26px)', fontFamily: "'Manrope', sans-serif" }}
                >
                  {s.stat}
                </p>
                <p
                  className="uppercase tracking-[0.16em] font-bold"
                  style={{ color: 'rgba(255,255,255,0.72)', ...mono, fontSize: '9.5px' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-[#1C2B2B]/65 mb-2">
              Reading is the easy part.
            </p>
            <p
              className="text-xl md:text-2xl text-[#1C2B2B] font-semibold mb-7"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              See what these standards look like on your floor.
            </p>
            <Link
              to="/intake?service=safety-walkthrough-report&utm_source=osha-guide-pillar&utm_medium=website&utm_campaign=pillar-cta"
              className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded transition-colors text-white"
              style={{ background: BLUE }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1F3F80')}
              onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
              data-testid="osha-guide-bottom-cta"
            >
              Request a Safety Walkthrough
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-[#1C2B2B]/45 mt-5" style={mono}>
              From $1,200 · Findings in 48 hours · NC Piedmont Triad
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OshaComplianceGuidePage;
