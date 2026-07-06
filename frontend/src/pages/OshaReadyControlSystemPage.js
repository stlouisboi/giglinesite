import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Lock,
  Clock,
  FolderArchive,
  Cloud,
  Users,
  Wrench,
  ClipboardList,
  Handshake,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const SLUG = 'osha-ready-control-system';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const QUARTERLY_HREF = '/services/quarterly-compliance-maintenance';
const ACP_HREF = '/services/annual-compliance-partner';
const BLUE = '#2A52A0';
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#f5f4f0';
const ORANGE = '#e07a3d';

const COMPONENTS = [
  { icon: FolderArchive, title: 'Four-Binder Physical Command System', body: 'Hazard programs, training records, inspection & maintenance logs, and incident & corrective action — each in a dedicated binder, tabbed and ready for an OSHA compliance officer.', cfr: '29 CFR 1910.1 — General Industry Standards' },
  { icon: Cloud, title: 'Digital Folder Architecture', body: 'Master document index mirrored to your cloud drive. Naming conventions, version control, and supervisor access permissions configured so your team can maintain it without GigLine.', cfr: 'Mirrors physical binder structure' },
  { icon: Users, title: 'Training Matrix + SDS Organization', body: 'Employee training matrix built by role. SDS inventory current and indexed against your chemical list. Annual refresher calendar built in so nothing lapses.', cfr: '29 CFR 1910.1200 — HazCom Standard' },
  { icon: Wrench, title: 'Written Safety Programs — Built to Your Operation', body: 'LOTO, HazCom, PPE, emergency action, and any additional programs required by your specific operations. Written from scratch against your actual equipment and processes — not downloaded templates.', cfr: '29 CFR 1910.147, 1910.1200, 1910.132' },
  { icon: ClipboardList, title: 'Inspection & Maintenance Log Templates', body: 'Pre-built log templates for forklift pre-shift inspections, fire extinguisher checks, eyewash station tests, and any other recurring inspection your operation requires.', cfr: '29 CFR 1910.178, 1910.157, 1910.151' },
  { icon: Handshake, title: 'Supervisor Handoff + Walk-Through', body: 'Final on-site session with your supervisor or safety lead. Every binder, every folder, every log — walked through in person so your team owns the system from day one.', cfr: 'Included in engagement scope' },
];

const STEPS = [
  { title: 'Site Assessment', body: 'GigLine walks the floor and reviews existing documentation to understand your operation, your hazards, and your current state. This scopes the buildout and confirms the fixed quote.' },
  { title: 'Program Development', body: 'Written safety programs are drafted against your actual equipment, chemicals, and processes. No templates. Every program references your specific operation.' },
  { title: 'Physical Build', body: 'The four-binder system is assembled. Tabs, dividers, and log templates are installed. The digital folder architecture is built and mirrored to your cloud drive.' },
  { title: 'Supervisor Handoff', body: 'Final on-site session with your team. Every component walked through in person. Your supervisor leaves knowing how to maintain the system without outside help.' },
];

const WHEN_CARDS = [
  { title: "You've never had a written safety program", body: 'Your operation has been running on institutional knowledge and verbal procedures. The Control System builds the documented foundation that should have been there from the start.' },
  { title: 'You failed a customer safety audit', body: 'Customer audits increasingly require written programs, training records, and inspection logs. The Control System produces exactly what auditors ask to see.' },
  { title: "You're preparing for a programmed OSHA inspection", body: "If your industry is on OSHA's programmed inspection list, the question isn't whether they'll show up — it's whether your documentation is ready when they do." },
  { title: 'A new safety manager is starting', body: 'Give an incoming safety manager a system to inherit instead of a blank slate. The Control System is the foundation they build on, not the project they spend their first year creating.' },
];

const REPLACES = [
  { title: 'Written programs downloaded from the internet', sub: 'Not specific to your equipment, chemicals, or processes.' },
  { title: 'Training records in a spreadsheet nobody updates', sub: 'No matrix, no expiration tracking, no role-based assignments.' },
  { title: "SDS binder that hasn't been touched in two years", sub: 'Missing chemicals, outdated sheets, no inventory cross-reference.' },
  { title: "Inspection logs that exist but aren't being used", sub: 'No accountability structure, no supervisor review process.' },
  { title: "Safety programs that live on one person's computer", sub: 'No version control, no backup, no supervisor access.' },
  { title: 'Verbal procedures for critical safety tasks', sub: 'LOTO, confined space, hot work — undocumented and unverifiable.' },
];

const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p className={`uppercase font-bold mb-3 ${className}`} style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}>{children}</p>
);

const OshaReadyControlSystemPage = () => {
  return (
    <main data-testid="osha-ready-control-system-page">
      <SEO
        title="OSHA-Ready Control System — From $4,500 | GigLine"
        description="Complete physical and digital safety infrastructure built to your operation. Four-binder command system, digital folder architecture, training matrix + SDS, written programs, log templates, and supervisor handoff. From $4,500."
        canonical={`/services/${SLUG}`}
        schema={[
          { '@context': 'https://schema.org', '@type': 'Service', name: 'OSHA-Ready Control System', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com', telephone: '+13363298899' }, areaServed: { '@type': 'State', name: 'North Carolina' }, offers: { '@type': 'Offer', price: '4500', priceCurrency: 'USD', description: 'OSHA-Ready Control System from $4,500 — complete safety infrastructure buildout.' }, description: 'Complete physical and digital safety infrastructure buildout: four-binder system, digital folder architecture, training matrix and SDS organization, written programs built to your operation, log templates, and supervisor handoff session.' },
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' }, { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' }, { '@type': 'ListItem', position: 3, name: 'OSHA-Ready Control System', item: `https://www.giglinecompliance.com/services/${SLUG}` }] },
        ]}
      />

      {/* Hero + 3-col pricing block */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="ocs-hero">
        <div className="container max-w-6xl">
          <Eyebrow color={GOLD}>OSHA-Ready Control System</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">The buildout.</span>
            <span className="block" style={{ color: GOLD }}>Complete safety infrastructure.</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-5 max-w-3xl">
            GigLine constructs the complete physical and digital safety infrastructure your operation needs to pass any OSHA inspection, customer audit, or insurance review — and hands it back to your team with a system they can actually maintain.
          </p>
          <p className="italic font-semibold mb-9 max-w-3xl text-[15px]" style={{ color: ORANGE }}>
            This is not a report. This is the system.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-12">
            <Link to={INTAKE_HREF} className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors" style={{ background: GOLD, color: NAVY }} onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')} onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)} data-testid="ocs-cta-hero">
              Request Buildout <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Clock size={14} />Scoped after site assessment</span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Lock size={14} />Private engagement</span>
          </div>

          {/* 3-col pricing block */}
          <div className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(220px,280px)_1fr_minmax(220px,280px)] gap-7 md:gap-8 items-start" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }} data-testid="ocs-price-block">
            <div>
              <Eyebrow color={GOLD}>Starting At</Eyebrow>
              <p className="text-3xl md:text-[34px] font-extrabold text-white leading-none mb-3 tracking-tight" style={mono}>$4,500</p>
              <p className="text-[13px] text-white/55 leading-[1.6]">Fixed quote provided after site assessment</p>
            </div>
            <div className="md:px-2">
              <p className="text-[14.5px] text-white/80 leading-[1.75]">
                The Control System is scoped after a site assessment — every operation is different. The assessment is included in the engagement. You&apos;ll have a fixed quote before any buildout work begins.
              </p>
            </div>
            <div className="rounded-lg p-5" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.30)' }}>
              <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: GOLD }}>Premium Engagement</p>
              <p className="text-[13px] leading-[1.65]" style={{ color: 'rgba(201,168,76,0.95)' }}>
                The highest-scope GigLine engagement. Built for operations that need the complete foundation, not just a report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included — 6 cards in 3-col grid */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-components">
        <div className="container max-w-6xl">
          <Eyebrow>What&apos;s Included</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>Six components. One complete system.</h2>
          <p className="text-base text-[#1C2B2B]/65 leading-[1.75] mb-12 max-w-3xl">
            Every component is built to your operation — not downloaded from a template library. The result is a system your team can maintain without outside help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPONENTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="rounded-xl p-6 md:p-7 flex flex-col" style={{ background: CREAM, border: '1px solid #e8e5dd' }} data-testid={`ocs-component-${i + 1}`}>
                  <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(42,82,160,0.10)', color: BLUE }}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16.5px] font-bold mb-2.5 leading-snug" style={{ color: NAVY }}>{c.title}</h3>
                  <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7] mb-4 flex-1">{c.body}</p>
                  <p className="uppercase font-bold pt-3" style={{ ...mono, fontSize: '10px', letterSpacing: '0.14em', color: '#5a6878', borderTop: '1px dashed #d8d4c8' }}>{c.cfr}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works — 4-col horizontal */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ocs-process">
        <div className="container max-w-6xl">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight max-w-4xl" style={{ color: NAVY }}>Four steps. One complete handoff.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={i} className="rounded-xl p-6 bg-white" style={{ border: '1px solid #e8e5dd' }} data-testid={`ocs-step-${i + 1}`}>
                <p className="font-extrabold mb-4 leading-none" style={{ ...mono, fontSize: '34px', color: GOLD }}>{String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-[16px] font-bold mb-2.5 leading-snug" style={{ color: NAVY }}>{s.title}</h3>
                <p className="text-[13.5px] text-[#1C2B2B]/70 leading-[1.7]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Book + What This Replaces — side-by-side */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-when-replaces">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT — When to Book This */}
            <div data-testid="ocs-when">
              <Eyebrow>When to Book This</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.2] mb-4 tracking-tight" style={{ color: NAVY }}>
                This is the right engagement when the foundation doesn&apos;t exist yet.
              </h2>
              <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.75] mb-7">
                Most small operations have some safety activity — a binder somewhere, some training that happened, some programs that were downloaded. The Control System replaces that patchwork with a complete, defensible infrastructure.
              </p>
              <div className="space-y-3.5">
                {WHEN_CARDS.map((card, i) => (
                  <div key={i} className="rounded-xl p-5 flex gap-3.5" style={{ background: CREAM, border: '1px solid #e8e5dd' }} data-testid={`ocs-when-card-${i + 1}`}>
                    <ChevronRight size={18} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                    <div className="min-w-0">
                      <h3 className="text-[15.5px] font-bold mb-1.5 leading-snug" style={{ color: NAVY }}>{card.title}</h3>
                      <p className="text-[13.5px] text-[#1C2B2B]/70 leading-[1.7]">{card.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* RIGHT — What This Replaces (warning list) */}
            <div data-testid="ocs-replaces">
              <Eyebrow>What This Replaces</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.2] mb-4 tracking-tight" style={{ color: NAVY }}>
                The patchwork most operations are running on.
              </h2>
              <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.75] mb-7">
                The Control System is designed to replace these specific failure modes — not augment them, replace them.
              </p>
              <ul className="space-y-4">
                {REPLACES.map((r, i) => (
                  <li key={i} className="flex gap-3.5" data-testid={`ocs-replaces-item-${i + 1}`}>
                    <AlertTriangle size={18} strokeWidth={2} className="flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-snug mb-1" style={{ color: NAVY }}>{r.title}</p>
                      <p className="text-[13.5px] text-[#1C2B2B]/60 leading-[1.65]">{r.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Comes After — dark navy section with inline CTA bar + 2 cards */}
      <section style={{ background: NAVY }}>
        {/* CTA bar */}
        <div className="py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} data-testid="ocs-cta-bar">
          <div className="container max-w-6xl">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <img src="/gigline-logo-dark-bg.png?v=7" loading="lazy" alt="" className="h-7 w-auto" />
                <span className="uppercase font-bold" style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: 'rgba(255,255,255,0.55)' }}>Safety &amp; Compliance</span>
              </div>
              <div className="flex items-center gap-5">
                <Link to="/services" className="text-[13.5px] font-bold text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors" data-testid="ocs-bar-all-services">← All Services</Link>
                <Link to={INTAKE_HREF} className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors" style={{ background: GOLD, color: NAVY }} onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')} onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)} data-testid="ocs-bar-cta">Request Buildout</Link>
              </div>
            </div>
          </div>
        </div>
        {/* What Comes After cards */}
        <div className="py-16 md:py-20" data-testid="ocs-what-comes-after">
          <div className="container max-w-6xl">
            <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>What Comes After</p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight text-white max-w-4xl">
              The Control System is the foundation. These keep it alive.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Quarterly */}
              <div className="rounded-xl p-7" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)' }} data-testid="ocs-after-quarterly">
                <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)' }}>Quarterly Compliance Maintenance</p>
                <h3 className="text-xl font-bold mb-3 leading-snug text-white">Keep the system current between annual walkthroughs.</h3>
                <p className="text-[14px] text-white/65 leading-[1.7] mb-6">
                  Quarterly check-ins to update training records, review inspection logs, refresh any programs that need updating, and flag anything that&apos;s drifted since the last visit.
                </p>
                <div className="flex items-center gap-5 flex-wrap">
                  <Link to={QUARTERLY_HREF} className="inline-flex items-center gap-2 bg-transparent border border-white/40 hover:border-white text-white font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors" data-testid="ocs-after-quarterly-cta">
                    Ask About Quarterly
                  </Link>
                  <span className="text-[14px] font-bold text-white" style={mono}>$950/quarter</span>
                </div>
              </div>
              {/* Annual */}
              <div className="rounded-xl p-7" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.30)' }} data-testid="ocs-after-annual">
                <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10px', letterSpacing: '0.16em', color: GOLD }}>Annual Compliance Control Partner</p>
                <h3 className="text-xl font-bold mb-3 leading-snug text-white">Year-round support. No full-time hire.</h3>
                <p className="text-[14px] text-white/70 leading-[1.7] mb-6">
                  Four quarterly walkthroughs, documentation maintenance, incident response, and a year-end compliance review. Everything the Control System covers, on an ongoing basis.
                </p>
                <div className="flex items-center gap-5 flex-wrap">
                  <Link to={ACP_HREF} className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors" style={{ background: GOLD, color: NAVY }} onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')} onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)} data-testid="ocs-after-annual-cta">
                    See Annual Partner <ArrowRight size={14} />
                  </Link>
                  <span className="text-[14px] font-bold text-white" style={mono}>$12,000/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ocs-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow>Ready to Build?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight" style={{ color: NAVY }}>
            Request the OSHA-Ready Control System.
          </h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-10 max-w-3xl mx-auto">
            The engagement starts with a site assessment. You&apos;ll have a fixed quote before any buildout work begins. Private engagement — nothing leaves your facility except the system GigLine hands you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={INTAKE_HREF} className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-lg text-base transition-colors" style={{ background: GOLD, color: NAVY }} onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')} onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)} data-testid="ocs-bottom-cta-request">
              Request Buildout <ArrowRight size={18} />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 bg-white font-bold px-7 py-4 rounded-lg text-base transition-colors" style={{ color: NAVY, border: `1.5px solid ${NAVY}` }} onMouseEnter={(e) => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = NAVY; }} data-testid="ocs-bottom-cta-all-services">
              See All Services
            </Link>
          </div>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-[#1C2B2B]/60 hover:text-[#1C2B2B] text-sm mt-8 transition-colors" data-testid="ocs-cta-phone">
            <Phone size={14} />Questions? Call or text Vince directly — (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default OshaReadyControlSystemPage;
