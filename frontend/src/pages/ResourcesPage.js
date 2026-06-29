import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, ClipboardCheck, Shield, BookOpen, FileSearch, Mail, Package } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const RESOURCES = [
  {
    id: 'safety-check',
    title: 'Safety Check',
    type: 'Checklist',
    gate: 'Ungated',
    icon: ClipboardCheck,
    description:
      'A free 90-second self-screen that surfaces the OSHA exposure points most often missed in small operations. Generates a personalized PDF report at the end — no email required to start.',
    cta: 'Start the Check',
    href: '/safety-check',
    internal: true,
  },
  {
    id: 'heat-stress-guide',
    title: 'Heat Stress Field Guide',
    type: 'Guide',
    gate: 'Email capture',
    icon: BookOpen,
    description:
      '2026 Heat Stress Action Template for NC manufacturing and warehouse operations. Daily heat check, trigger levels, written plan checklist, and enforcement reference. One page. Print and post.',
    cta: 'Get Access',
    href: '/heat-guide',
    internal: true,
  },
  {
    id: 'hazcom-guide',
    title: 'HazCom Compliance Guide',
    type: 'Guide',
    gate: 'Ungated read',
    icon: Shield,
    description:
      'Full plain-language breakdown of the OSHA Hazard Communication standard — written program, SDS management, container labeling, and employee training. The #1 most cited OSHA violation in general industry.',
    cta: 'Read the Guide',
    href: '/blog/hazcom-requirements-small-business',
    internal: true,
  },
  {
    id: 'sample-report',
    title: 'Sample Compliance Report',
    type: 'Report',
    gate: 'Email capture',
    icon: FileSearch,
    description:
      'A redacted real compliance report — facility name removed, every finding intact. CFR citations, penalty exposure, RED/AMBER/GREEN fix list, and the 30/60/90-day corrective action plan.',
    cta: 'Get Access',
    href: '/sample-report',
    internal: true,
  },
  {
    id: 'osha-inspection-guide',
    title: 'OSHA Inspection Guide — HR & Safety Leaders',
    type: 'Guide',
    gate: 'Email capture',
    icon: Mail,
    description:
      'What OSHA looks for when they walk in. Built for HR managers and safety coordinators — what to have ready before, what happens during, and what to do in the 15-day window after. CFR-cited.',
    cta: 'Get Access',
    href: '/osha-inspection-guide',
    internal: true,
  },
  {
    id: 'supervisor-kit',
    title: 'Supervisor Safety Starter System',
    type: 'Paid Kit',
    gate: 'From $600',
    icon: Package,
    description:
      'The full digital kit of CFR-cited, print-ready safety documents GigLine uses on every walkthrough — written programs, training rosters, inspection logs, and OSHA-response templates. Built for the supervisor responsible for safety on the floor. Included free with every Compliance Readiness Visit.',
    cta: 'See the Kit',
    href: '/supervisor-kit',
    internal: true,
  },
  {
    id: 'field-checklist',
    title: 'Field Inspection Checklist',
    type: 'Checklist',
    gate: 'Ungated',
    icon: FileText,
    description:
      'The printable on-floor inspection checklist GigLine uses during walkthroughs. Covers machine guarding, electrical, walking surfaces, LOTO, fire/exit, PPE, chemical handling, and recordkeeping touchpoints.',
    cta: 'Download',
    href: `${API_URL}/api/field-checklist`,
    internal: false,
  },
];

const ResourcesPage = () => {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Safety Resources | GigLine Safety & Compliance',
    description:
      'Free and gated safety resources for manufacturing and warehouse supervisors — guides, checklists, and compliance tools from GigLine.',
    url: 'https://www.giglinecompliance.com/resources',
  };

  return (
    <main data-testid="resources-page">
      <SEO
        title="Safety Resources | GigLine Safety & Compliance"
        description="Free and gated safety resources for manufacturing and warehouse supervisors — guides, checklists, and compliance tools from GigLine."
        canonical="/resources"
        schema={[pageSchema]}
      />

      {/* Hero */}
      <section className="bg-[#0d1b2a] text-white py-16 md:py-24" data-testid="resources-hero">
        <div className="container max-w-4xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.2em', color: '#c8922a' }}
            data-testid="resources-eyebrow"
          >
            Resources
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="resources-headline"
          >
            Resources
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
            Guides, checklists, and tools built for the person responsible for safety.
          </p>
        </div>
      </section>

      {/* Asset grid */}
      <section className="py-16 md:py-20 bg-white" data-testid="resources-grid">
        <div className="container max-w-5xl">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {RESOURCES.map((r) => {
              const Icon = r.icon;
              return (
                <li
                  key={r.id}
                  className="rounded-lg p-6 md:p-7 flex flex-col"
                  style={{ background: '#F9F8F6', border: '1px solid rgba(13,27,42,0.10)' }}
                  data-testid={`resource-card-${r.id}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Icon size={22} className="text-[#1a6fc4] flex-shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <div
                        className="flex flex-wrap items-center gap-2 mb-1.5"
                        style={mono}
                      >
                        <span
                          className="uppercase font-bold text-[10px] tracking-[0.18em] px-2 py-0.5 rounded"
                          style={{ background: 'rgba(26,111,196,0.10)', color: '#1a6fc4' }}
                        >
                          {r.type}
                        </span>
                        <span
                          className="uppercase text-[10px] tracking-[0.16em] text-[#0d1b2a]/50"
                        >
                          {r.gate}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-[#0d1b2a] leading-tight">
                        {r.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-[15px] text-[#0d1b2a]/65 leading-relaxed mb-5 flex-grow">
                    {r.description}
                  </p>
                  {r.internal ? (
                    <Link
                      to={r.href}
                      className="inline-flex items-center justify-center gap-2 bg-[#0d1b2a] hover:bg-[#1c2e44] text-white font-semibold px-5 py-3 rounded transition-colors text-sm self-start"
                      data-testid={`resource-cta-${r.id}`}
                    >
                      {r.cta}
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#0d1b2a] hover:bg-[#1c2e44] text-white font-semibold px-5 py-3 rounded transition-colors text-sm self-start"
                      data-testid={`resource-cta-${r.id}`}
                    >
                      <Download size={14} />
                      {r.cta}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 bg-[#F9F8F6] border-t border-[#0d1b2a]/10" data-testid="resources-cta">
        <div className="container max-w-2xl text-center">
          <p className="text-base md:text-lg text-[#0d1b2a]/65 mb-2">Need more than a guide?</p>
          <p
            className="text-xl md:text-2xl text-[#0d1b2a] font-semibold mb-7"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Schedule a walkthrough and get findings written for your operation.
          </p>
          <Link
            to="/intake?service=safety-walkthrough-report&utm_source=resources-hub&utm_medium=website&utm_campaign=resources-cta"
            className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-7 py-4 rounded transition-colors"
            data-testid="resources-bottom-cta"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ResourcesPage;
