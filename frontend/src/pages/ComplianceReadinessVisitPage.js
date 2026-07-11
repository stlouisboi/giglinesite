import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Lock,
  Clock,
  Camera,
  FolderOpen,
  FileBarChart2,
  CalendarClock,
  AlertOctagon,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import RelatedFieldNotesStrip from '../components/RelatedFieldNotesStrip';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SLUG = 'compliance-readiness-visit';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const WALKTHROUGH_HREF = '/services/safety-walkthrough-report';

const GOLD = '#C9A84C';
const NAVY = '#102A43';
const BLUE = '#2A52A0';
const CREAM = '#f5f4f0';

const DELIVERABLES = [
  {
    icon: Camera,
    title: 'On-Site Floor Walkthrough',
    body:
      'Physical hazards documented with photos, CFR citations, and severity ratings. Every finding tied to the specific standard it violates.',
    highlight: false,
  },
  {
    icon: FolderOpen,
    title: 'Full Documentation Review',
    body:
      'Written programs, training records, OSHA 300 logs, SDS library, and required postings reviewed against a 53-point checklist.',
    highlight: false,
  },
  {
    icon: FileBarChart2,
    title: '18-Page CFR-Cited Field Audit Report',
    body:
      'Delivered within 48 hours. Compliance score, at-a-glance dashboard, executive summary, and a prioritized remediation sequence — not just a list of violations.',
    highlight: true,
    fullWidth: true,
  },
  {
    icon: CalendarClock,
    title: '90-Day Remediation Tracker',
    body:
      'Pre-populated with every finding. Assign owners, set target dates, and document corrective actions. A paper trail that demonstrates good-faith effort if OSHA shows up during remediation.',
    highlight: false,
  },
  {
    icon: AlertOctagon,
    title: '“What to Say If OSHA Calls” Guidance Sheet',
    body:
      "Operational guidance on employer rights during an inspection, what to say and not say at the door, and how to document the inspector's visit. Included with every engagement.",
    highlight: false,
  },
  {
    icon: PhoneCall,
    title: '30-Day Check-In Call',
    body:
      'A 20-minute follow-up call to review what got fixed, what got stuck, and what to prioritize next. No upsell. Just accountability.',
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: 'Private Engagement',
    body:
      'Nothing leaves your facility except the report I hand you. No third-party sharing, no regulatory disclosure, no public record.',
    highlight: false,
  },
];

const CATEGORIES = [
  {
    title: 'Physical Hazards',
    body: 'Unguarded shear points, blocked egress, unsecured compressed gas cylinders.',
  },
  {
    title: 'Documentation Gaps',
    body: 'Missing written programs, incomplete OSHA 300 logs, SDS library gaps.',
  },
  {
    title: 'Training Records',
    body: 'No evidence of required training — LOTO, HazCom, forklift, BBP.',
  },
  {
    title: 'Administrative Controls',
    body: 'No corrective action log, no near-miss reporting system.',
  },
  {
    title: 'Regulatory Postings',
    body: 'Missing required OSHA poster, no emergency contact posting.',
  },
];

const WHO_CARDS = [
  {
    title: 'You have an OSHA inspection coming up',
    body:
      "Or you've received a complaint, a referral, or a notice of inspection. The CRV gives you a clear picture of what they'll find before they find it.",
  },
  {
    title: "You've never had an outside safety review",
    body:
      'Most operations that have never been reviewed have more exposure than they realize. The CRV tells you exactly where you stand — without the penalty.',
  },
  {
    title: 'Your documentation is incomplete or outdated',
    body:
      'Missing written programs, gaps in training records, and incomplete OSHA logs are the most common citation triggers. The CRV finds them first.',
  },
];

const PROCESS_STEPS = [
  {
    title: 'Request & Scope',
    body:
      'You submit a request. I send a fixed quote based on your facility size and employee count. No discovery call required.',
  },
  {
    title: 'Schedule the Visit',
    body:
      'We pick a date. I show up on time, in work boots, ready to walk the floor.',
  },
  {
    title: 'Floor Walkthrough',
    body:
      'Physical hazards documented with photos and CFR citations. Every finding rated by severity.',
  },
  {
    title: 'Documentation Review',
    body:
      'Written programs, training records, OSHA logs, and SDS library reviewed against a 53-point checklist.',
  },
  {
    title: 'Report Delivered in 48 Hours',
    body:
      '18-page CFR-cited report with compliance score, executive summary, and prioritized remediation sequence. Plus the tracker, the OSHA guidance sheet, and the 30-day check-in call.',
  },
];

const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p
    className={`uppercase font-bold mb-3 ${className}`}
    style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}
  >
    {children}
  </p>
);

const CTABar = () => (
  <div
    className="py-5"
    style={{ background: NAVY, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    data-testid="crv-cta-bar"
  >
    <div className="container max-w-6xl">
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/gigline-logo-dark-bg.png?v=7" loading="lazy" alt="" className="h-7 w-auto" />
          <span
            className="uppercase font-bold"
            style={{
              ...mono,
              fontSize: '10px',
              letterSpacing: '0.20em',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Safety &amp; Compliance
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/services"
            className="text-[13.5px] font-bold text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            data-testid="crv-bar-all-services"
          >
            ← All Services
          </Link>
          <Link
            to={INTAKE_HREF}
            className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors"
            style={{ background: BLUE, color: '#ffffff' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1F3F80')}
            onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
            data-testid="crv-bar-cta"
          >
            Schedule a Visit
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const ComplianceReadinessVisitPage = () => {
  return (
    <main data-testid="compliance-readiness-visit-page">
      <SEO
        title="Compliance Readiness Visit — From $2,000 | GigLine"
        description="The floor and the files reviewed in a single engagement. 18-page CFR-cited field audit report delivered within 48 hours. 90-day remediation tracker, OSHA guidance sheet, and 30-day check-in call included. From $2,000."
        canonical={`/services/${SLUG}`}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Compliance Readiness Visit',
            provider: {
              '@type': 'LocalBusiness',
              name: 'GigLine Safety & Compliance',
              url: 'https://www.giglinecompliance.com',
              telephone: '+13363298899',
            },
            areaServed: { '@type': 'State', name: 'North Carolina' },
            offers: {
              '@type': 'Offer',
              price: '2000',
              priceCurrency: 'USD',
              description: 'Compliance Readiness Visit from $2,000 — combined walkthrough + documentation review.',
            },
            description:
              'On-site walkthrough plus full documentation review delivered as a single 18-page CFR-cited field audit report within 48 hours.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Compliance Readiness Visit',
                item: `https://www.giglinecompliance.com/services/${SLUG}`,
              },
            ],
          },
        ]}
      />

      {/* ═══ Hero + Fixed Price 3-col block (dark navy) ═══ */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="crv-hero">
        <div className="container max-w-6xl">
          <Eyebrow color={GOLD}>Compliance Readiness Visit</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">The floor and the files.</span>
            <span className="block italic" style={{ color: GOLD, fontStyle: 'italic' }}>
              One visit. One report.
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-9 max-w-3xl">
            The most complete picture of where your operation stands before OSHA shows up. Physical walkthrough plus
            full documentation review — delivered as a single, CFR-cited field audit report within 48 hours.
          </p>

          {/* CTA row — GOLD button for the recommended starting engagement */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-12">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              style={{ background: GOLD, color: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              data-testid="crv-cta-hero"
            >
              Schedule a Compliance Readiness Visit
              <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Clock size={14} />
              Report delivered within 48 hours
            </span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Lock size={14} />
              Private engagement
            </span>
          </div>

          {/* Fixed Price 3-column block — embedded in hero */}
          <div
            className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_1fr_minmax(240px,300px)] gap-7 md:gap-8 items-start"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            data-testid="crv-price-block"
          >
            {/* LEFT: From $2,000 */}
            <div>
              <Eyebrow color={GOLD}>Fixed Price</Eyebrow>
              <p
                className="text-3xl md:text-[34px] font-extrabold text-white leading-none mb-3 tracking-tight"
                style={mono}
              >
                From $2,000
              </p>
              <p className="text-[13px] text-white/55 leading-[1.65]">
                Varies by facility size and employee count. Fixed quote provided before scheduling.
              </p>
            </div>
            {/* CENTER: Value comparison */}
            <div className="md:px-2">
              <p className="text-[14.5px] text-white/80 leading-[1.75]">
                Booked separately, the Safety Walkthrough and Documentation Review start at <span className="font-bold text-white" style={mono}>$2,500</span>. The
                Compliance Readiness Visit covers both in a single visit.
              </p>
            </div>
            {/* RIGHT: $16,550 penalty callout */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.30)',
              }}
            >
              <p className="text-[13px] leading-[1.65]" style={{ color: 'rgba(201,168,76,0.95)' }}>
                A single OSHA serious violation averages{' '}
                <span className="font-bold" style={mono}>$16,550</span>. One finding prevents the cost of this
                engagement many times over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Social proof — real outcome graphic (full-width strip) ═══ */}
      <section
        className="py-14 md:py-16"
        style={{ background: CREAM, borderBottom: '1px solid #e8e5dd' }}
        data-testid="crv-social-proof"
      >
        <div className="container max-w-5xl">
          <figure>
            <Link
              to="/case-study/metals-fabrication-statesville"
              className="block rounded-xl overflow-hidden transition-shadow"
              style={{
                background: '#ffffff',
                border: '1px solid #e8e5dd',
                boxShadow: '0 6px 24px rgba(16,42,67,0.06)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 32px rgba(16,42,67,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(16,42,67,0.06)')}
              data-testid="crv-social-proof-link"
            >
              <img
                src="/assets/case-study-statesville-12-of-13.webp"
                alt="12 of 13 corrective actions closed in 7 days — outcome of a GigLine Compliance Readiness Visit at a metals fabrication facility in Statesville, NC."
                loading="lazy"
                className="w-full h-auto block"
                data-testid="crv-social-proof-image"
              />
            </Link>
            <figcaption
              className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[13px]"
              style={{ color: 'rgba(28,43,43,0.65)' }}
            >
              <span className="italic">
                Real outcome from a 2026 Compliance Readiness Visit — Statesville, NC.
              </span>
              <Link
                to="/case-study/metals-fabrication-statesville"
                className="inline-flex items-center gap-1.5 font-bold transition-colors"
                style={{ color: BLUE }}
                onMouseEnter={(e) => (e.currentTarget.style.color = NAVY)}
                onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
                data-testid="crv-social-proof-case-link"
              >
                View the case study
                <ArrowRight size={13} />
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ What You Get — 7 deliverables with 18-page report highlighted ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="crv-deliverables">
        <div className="container max-w-6xl">
          <Eyebrow>What You Get</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            Seven deliverables. One engagement.
          </h2>
          <p className="text-base text-[#1C2B2B]/65 leading-[1.75] mb-12 max-w-3xl">
            Most operations only need this once to understand exactly where they stand. Everything below is included at
            the fixed price — no add-ons, no upsells.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DELIVERABLES.map((d, i) => {
              const Icon = d.icon;
              const isFullWidth = d.fullWidth;
              return (
                <div
                  key={i}
                  className={`rounded-xl p-6 md:p-7 flex gap-5 ${isFullWidth ? 'md:col-span-2' : ''}`}
                  style={{
                    background: d.highlight ? '#eef4fb' : CREAM,
                    border: d.highlight ? `1px solid ${BLUE}` : '1px solid #e8e5dd',
                  }}
                  data-testid={`crv-deliverable-${i + 1}`}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: d.highlight ? 'rgba(42,82,160,0.18)' : 'rgba(42,82,160,0.10)',
                      color: BLUE,
                    }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[16.5px] font-bold mb-2 leading-snug" style={{ color: NAVY }}>
                      {d.title}
                    </h3>
                    <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{d.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ What We Look For + The Report (side-by-side on cream) ═══ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="crv-categories-report">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: What We Look For — 5 numbered categories */}
            <div data-testid="crv-categories">
              <Eyebrow>What We Look For</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.2] mb-4 tracking-tight" style={{ color: NAVY }}>
                Five categories.<br />Every engagement.
              </h2>
              <p className="text-[15px] text-[#1C2B2B]/75 leading-[1.75] mb-7">
                The Compliance Readiness Visit covers both the physical floor and the paper trail. Most operations have
                gaps in both. The report tells you exactly where — and in what order to fix them.
              </p>
              <ol className="space-y-5">
                {CATEGORIES.map((cat, i) => (
                  <li
                    key={i}
                    className="flex gap-4"
                    data-testid={`crv-category-${i + 1}`}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center font-extrabold"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: NAVY,
                        color: '#ffffff',
                        ...mono,
                        fontSize: '12px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15.5px] font-bold mb-1 leading-snug" style={{ color: NAVY }}>
                        {cat.title}
                      </h3>
                      <p className="text-[13.5px] text-[#1C2B2B]/65 leading-[1.7]">{cat.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* RIGHT: The Report — sample images */}
            <div data-testid="crv-report-sample">
              <Eyebrow>The Report</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.2] mb-4 tracking-tight" style={{ color: NAVY }}>
                What you actually receive.
              </h2>
              <p className="text-[15px] text-[#1C2B2B]/75 leading-[1.75] mb-7">
                An 18-page CFR-cited field audit report with a compliance score, at-a-glance dashboard, executive
                summary, and prioritized remediation sequence. Not a checklist. Not a template. A document specific to
                your operation.
              </p>
              {/* Sample report cards — placeholder pages */}
              <div
                className="grid grid-cols-2 gap-3 p-4 rounded-xl max-w-md mx-auto lg:max-w-none lg:mx-0"
                style={{ background: '#ffffff', border: '1px solid #e8e5dd' }}
              >
                <div
                  className="aspect-[3/4] rounded-md p-4 flex flex-col justify-between"
                  style={{ background: NAVY }}
                  data-testid="crv-report-cover"
                >
                  <ShieldCheck size={22} style={{ color: GOLD }} />
                  <div>
                    <p
                      className="uppercase font-bold mb-2"
                      style={{ ...mono, fontSize: '7px', letterSpacing: '0.18em', color: GOLD }}
                    >
                      Combined Safety &amp; Documentation Report
                    </p>
                    <p className="text-[8px] text-white/55 leading-snug">
                      Anchor Metal Supply<br />
                      Client name redacted
                    </p>
                    <div className="mt-3 h-px" style={{ background: 'rgba(201,168,76,0.4)' }} />
                    <div className="mt-3 grid grid-cols-2 gap-1 text-[7px] text-white/40 leading-tight">
                      <span>Facility Details</span>
                      <span className="text-right">DAVIE COUNTY</span>
                      <span>Visit Date</span>
                      <span className="text-right">FEB 04 2026</span>
                      <span>Auditor</span>
                      <span className="text-right">V. WILLIAMS</span>
                    </div>
                  </div>
                </div>
                <div
                  className="aspect-[3/4] rounded-md p-3 flex flex-col"
                  style={{ background: '#fdfdfb', border: '1px solid #e8e5dd' }}
                  data-testid="crv-report-summary"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p
                      className="uppercase font-bold"
                      style={{ ...mono, fontSize: '6px', letterSpacing: '0.16em', color: BLUE }}
                    >
                      EX SUMMARY
                    </p>
                    <p className="text-[6px] font-bold" style={{ color: NAVY, ...mono }}>
                      67%
                    </p>
                  </div>
                  <div
                    className="h-px mb-2"
                    style={{ background: '#e0e4e9' }}
                  />
                  <div className="grid grid-cols-5 gap-0.5 mb-2">
                    {['#fee2e2', '#fed7aa', '#fef3c7', '#d1fae5', '#dbeafe'].map((c, idx) => (
                      <div key={idx} className="h-1.5 rounded-sm" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-[6px] text-[#1C2B2B]/60 leading-[1.5] mb-2">
                    Inspection conducted across five OSHA categories on a 53-point checklist. Physical walkthrough +
                    documentation review.
                  </p>
                  <div className="space-y-1 mt-auto">
                    {[
                      { c: '#dc2626', label: 'Critical', n: 3 },
                      { c: '#f97316', label: 'High', n: 7 },
                      { c: '#eab308', label: 'Medium', n: 12 },
                      { c: '#22c55e', label: 'Resolved', n: 4 },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-1.5 text-[6px]">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: row.c }} />
                        <span className="flex-1 text-[#1C2B2B]/70">{row.label}</span>
                        <span className="font-bold" style={{ color: NAVY, ...mono }}>
                          {row.n}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-[#1C2B2B]/55 italic mt-4">
                Sample from an actual engagement. Client details redacted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Who This Is For (dark navy) ═══ */}
      <section style={{ background: NAVY }} className="py-16 md:py-20" data-testid="crv-who">
        <div className="container max-w-6xl">
          <p
            className="uppercase font-bold mb-3 text-center"
            style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}
          >
            Who This Is For
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight text-white text-center">
            Book a Compliance Readiness Visit when:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHO_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-xl p-7"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                data-testid={`crv-who-card-${i + 1}`}
              >
                <div
                  className="flex items-center justify-center mb-5"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.15)',
                    color: GOLD,
                  }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-[16px] font-bold mb-3 leading-snug text-white">{card.title}</h3>
                <p className="text-[13.5px] text-white/65 leading-[1.75]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works — 5 stacked steps, with inline CTA bar between steps 2-3 ═══ */}
      <section className="bg-white" data-testid="crv-process">
        <div className="py-20 md:py-24">
          <div className="container max-w-4xl">
            <Eyebrow className="text-center">How It Works</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight text-center" style={{ color: NAVY }}>
              Five steps. Fixed price. No surprises.
            </h2>
            <div className="space-y-1">
              {PROCESS_STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div
                    className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr] gap-4 py-6"
                    style={{ borderBottom: i === PROCESS_STEPS.length - 1 ? 'none' : '1px solid #eef0f3' }}
                    data-testid={`crv-step-${i + 1}`}
                  >
                    <span
                      className="font-extrabold leading-none"
                      style={{ ...mono, fontSize: '38px', color: '#dde3ea' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="text-[17px] font-bold mb-2 leading-snug" style={{ color: NAVY }}>
                        {step.title}
                      </h3>
                      <p className="text-[14.5px] text-[#1C2B2B]/70 leading-[1.7]">{step.body}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Inline dark CTA bar at end of process */}
        <CTABar />
      </section>

      {/* ═══ OS vs CRV differentiator — for supervisors who already have the Supervisor Safety OS ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="crv-vs-os" style={{ borderTop: `1px solid #e8e5dd` }}>
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <Eyebrow>OS vs CRV — What&rsquo;s the Difference?</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] tracking-tight" style={{ color: NAVY }}>
              The OS is documentation-only. The CRV is site-specific.
            </h2>
            <p className="text-base md:text-lg text-[#1C2B2B]/70 mt-5 max-w-3xl mx-auto leading-[1.75]">
              The <Link to="/supervisor-kit" className="font-bold underline" style={{ color: BLUE }} data-testid="crv-vs-os-kit-link">GigLine Supervisor Safety OS</Link> gives your team a system to organize safety paperwork. The Compliance Readiness Visit walks your floor and reviews your binder against what OSHA actually looks at.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* OS card */}
            <div
              className="rounded-lg p-7 md:p-8"
              style={{ background: '#ffffff', border: '1px solid #e8e5dd', boxShadow: '0 4px 14px rgba(16,42,67,0.06)' }}
              data-testid="crv-vs-os-card-os"
            >
              <p className="uppercase font-bold tracking-[0.22em] mb-3" style={{ color: 'rgba(10,22,40,0.55)', ...mono, fontSize: '11px' }}>
                Supervisor Safety OS — from $600
              </p>
              <p className="text-lg md:text-xl font-bold mb-4 leading-tight" style={{ color: NAVY }}>
                A documentation system your supervisors run themselves.
              </p>
              <ul className="space-y-2.5 text-[15px] leading-[1.65] text-[#1C2B2B]/75">
                <li>17-document, 20-page supervisor safety documentation system</li>
                <li>You fill in your own facility details, chemicals, SDS locations</li>
                <li>Supports your monthly inspection and corrective-action rhythm</li>
                <li>Delivered digitally or as a physical binder</li>
              </ul>
              <p className="mt-5 pt-5 text-[13.5px] italic leading-relaxed" style={{ color: 'rgba(10,22,40,0.55)', borderTop: '1px solid #e8e5dd' }}>
                Does not include a site-specific walkthrough, OSHA compliance evaluation, or written report from Vince.
              </p>
            </div>

            {/* CRV card (featured) */}
            <div
              className="rounded-lg p-7 md:p-8 relative"
              style={{ background: NAVY, color: 'white', border: `1px solid ${GOLD}`, boxShadow: '0 18px 40px rgba(16,42,67,0.20)' }}
              data-testid="crv-vs-os-card-crv"
            >
              <span
                className="absolute -top-3 right-6 uppercase font-bold tracking-[0.18em] px-3 py-1 rounded-sm"
                style={{ background: GOLD, color: NAVY, ...mono, fontSize: '10.5px' }}
              >
                Site-Specific
              </span>
              <p className="uppercase font-bold tracking-[0.22em] mb-3" style={{ color: GOLD, ...mono, fontSize: '11px' }}>
                Compliance Readiness Visit — from $2,000
              </p>
              <p className="text-lg md:text-xl font-bold mb-4 leading-tight">
                Vince walks your floor and reviews your binder.
              </p>
              <ul className="space-y-2.5 text-[15px] leading-[1.65] text-white/85">
                <li>Full on-site safety walkthrough with photo documentation</li>
                <li>Documentation Readiness Review against OSHA-cited standards</li>
                <li>Written report with a single compliance percentage score</li>
                <li>CFR citations on every finding + prioritized corrective actions</li>
                <li><strong className="text-white">Supervisor Safety OS included at no additional cost</strong></li>
              </ul>
              <p className="mt-5 pt-5 text-[13.5px] italic leading-relaxed text-white/60" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                For teams that want a second set of eyes on both the floor AND the paperwork before an inspection, incident, or audit.
              </p>
            </div>
          </div>

          <p className="text-center text-[14px] md:text-[15px] italic mt-10 max-w-3xl mx-auto text-[#1C2B2B]/60 leading-relaxed">
            Already own the Supervisor Safety OS? The CRV cost is <strong className="not-italic" style={{ color: NAVY }}>reduced by your OS purchase price</strong> — mention your order at booking.
          </p>
        </div>
      </section>

      {/* ═══ Related Field Notes — internal linking to boost long-tail indexing ═══ */}
      <RelatedFieldNotesStrip
        heading="Field Notes that pair with the Compliance Readiness Visit"
        intro="During a CRV, these are the topics that come up most often on the floor and in the binder. Read them before your visit — they'll help you know what Vince is looking for."
        notes={[
          { slug: 'recordkeeping-300-log', title: 'OSHA 300 Log — the mistakes I see most often', blurb: 'Common recordkeeping errors that turn a routine inspection into a citation.' },
          { slug: 'hazcom', title: 'Written HazCom Program — what a working one looks like', blurb: 'Beyond the SDS binder: what OSHA expects your written HazCom program to actually cover.' },
          { slug: 'machine-guarding', title: 'Machine Guarding — the #1 general-industry citation', blurb: 'Point-of-operation, power-transmission, and the everyday oversights that trigger 1910.212.' },
        ]}
      />

      {/* ═══ Closing CTA (cream) ═══ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="crv-closing">
        <div className="container max-w-4xl text-center">
          <Eyebrow>Ready to Know Where You Stand?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight" style={{ color: NAVY }}>
            Schedule a Compliance Readiness Visit.
          </h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-10 max-w-3xl mx-auto">
            Fixed price. Private engagement. Report in 48 hours. If you&rsquo;re not sure this is the right starting
            point, start with a Safety Walkthrough instead.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
              onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
              data-testid="crv-bottom-cta-crv"
            >
              Schedule a Compliance Readiness Visit
              <ArrowRight size={18} />
            </Link>
            <Link
              to={WALKTHROUGH_HREF}
              className="inline-flex items-center gap-2 bg-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ color: NAVY, border: `1.5px solid ${NAVY}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = NAVY;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = NAVY;
              }}
              data-testid="crv-bottom-cta-walkthrough"
            >
              Start with a Walkthrough Instead
            </Link>
          </div>
          <a
            href="tel:3363298899"
            className="inline-flex items-center gap-2 text-[#1C2B2B]/60 hover:text-[#1C2B2B] text-sm mt-8 transition-colors"
            data-testid="crv-cta-phone"
          >
            <Phone size={14} />
            Questions? Call or text Vince directly — (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default ComplianceReadinessVisitPage;
