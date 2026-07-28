import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Lock,
  Clock,
  CalendarCheck,
  FileSearch,
  PhoneCall,
  ShieldAlert,
  Activity,
  Anchor,
  ChevronRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import RelatedFieldNotesStrip from '../components/RelatedFieldNotesStrip';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SLUG = 'annual-compliance-partner';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const CRV_HREF = '/services/compliance-readiness-visit';

const INCLUDED_CARDS = [
  {
    icon: CalendarCheck,
    title: 'Quarterly On-Site Visits',
    body:
      'Four scheduled floor visits per year. Physical hazards documented, findings tracked, corrective actions verified. Your operation stays current between inspections.',
  },
  {
    icon: FileSearch,
    title: 'Annual Documentation Audit',
    body:
      'Full review of written programs, training records, and OSHA logs once per year. Gaps identified and corrected before they become citations.',
  },
  {
    icon: PhoneCall,
    title: 'On-Call Support',
    body:
      'Call or text when something happens — an incident, a near-miss, a regulatory question, a customer audit request. You have someone who already knows your floor.',
  },
  {
    icon: ShieldAlert,
    title: 'Incident Review — Included',
    body:
      "If something happens, the incident review is included in the annual engagement. No additional fee. No scrambling to find someone who doesn't know your operation.",
  },
  {
    icon: Activity,
    title: 'Corrective Action Tracking',
    body:
      "Every finding tracked from identification to closure. A running record of your operation's safety improvement — the kind of documentation that matters if OSHA shows up.",
  },
  {
    icon: Anchor,
    title: 'Regulatory Update Briefings',
    body:
      'When OSHA issues new standards or enforcement guidance relevant to your operation, you hear about it before it becomes an issue.',
  },
];

const WHO_CARDS = [
  {
    title: "You've already had a walkthrough or CRV",
    body:
      'You know where you stand. Now you need someone to help you stay there — and catch what changes between inspections.',
  },
  {
    title: "You don't have a dedicated safety person",
    body:
      "You're the plant manager, the safety coordinator, and the HR department. The Annual Partner gives you a resource without adding headcount.",
  },
  {
    title: 'Your operation is high-hazard or high-growth',
    body:
      'New equipment, new employees, new processes — every change creates new exposure. Quarterly visits catch it before it becomes a citation.',
  },
];

const GOLD = '#C9A84C';
const NAVY = '#102A43';

const Eyebrow = ({ children, color = '#2A52A0' }) => (
  <p
    className="uppercase font-bold mb-3"
    style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}
  >
    {children}
  </p>
);

const AnnualCompliancePartnerPage = () => {
  return (
    <main data-testid="annual-compliance-partner-page">
      <SEO
        title="Annual Compliance Partner — $12,000/year | GigLine"
        description="Ongoing OSHA compliance support for small operations. Four quarterly on-site visits, annual documentation audit, on-call support, incident review included. $12,000/year ($1,000/month equivalent). Limited availability."
        canonical={`/services/${SLUG}`}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Annual Compliance Partner',
            provider: {
              '@type': 'LocalBusiness',
              name: 'GigLine Safety & Compliance',
              url: 'https://www.giglinecompliance.com',
              telephone: '+13363298899',
            },
            areaServed: { '@type': 'State', name: 'North Carolina' },
            offers: {
              '@type': 'Offer',
              price: '12000',
              priceCurrency: 'USD',
              description: 'Annual Compliance Partner — $12,000/year ($1,000/month equivalent).',
            },
            description:
              'Ongoing OSHA compliance support including four quarterly on-site visits, annual documentation audit, on-call support, and incident review.',
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
                name: 'Annual Compliance Partner',
                item: `https://www.giglinecompliance.com/services/${SLUG}`,
              },
            ],
          },
        ]}
      />

      {/* ═══ Hero + Annual Investment Pricing Block (dark navy) ═══ */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="acp-hero">
        <div className="container max-w-6xl">
          <Eyebrow color={GOLD}>Annual Compliance Partner</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">When OSHA shows up,</span>
            <span className="block italic" style={{ color: GOLD, fontStyle: 'italic' }}>
              you need someone who already knows your floor.
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-9 max-w-3xl">
            When someone gets hurt. When a customer asks for your safety program. When an inspector walks through the
            door. In every one of those moments, the outcome depends on the work you did before they arrived. The
            Annual Compliance Partner engagement is how that work gets done.
          </p>

          {/* CTA row — GOLD button for the premium engagement */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-12">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              style={{ background: GOLD, color: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              data-testid="acp-cta-hero"
            >
              Ask About Annual Partnership
              <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Lock size={14} />
              Private engagement
            </span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Clock size={14} />
              Limited availability
            </span>
          </div>

          {/* Annual Investment 3-column pricing block — embedded in hero */}
          <div
            className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr_minmax(220px,280px)] gap-7 md:gap-8 items-start"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            data-testid="acp-investment-block"
          >
            {/* LEFT: Investment amount */}
            <div>
              <Eyebrow color={GOLD}>Annual Investment</Eyebrow>
              <p className="text-3xl md:text-[34px] font-extrabold text-white leading-none mb-2 tracking-tight" style={mono}>
                $12,000 / year
              </p>
              <p className="text-[13px] text-white/55 mb-3" style={mono}>
                $1,000 / month equivalent
              </p>
              <p className="text-[13px] text-white/55 leading-[1.6]">
                Billed annually. Fixed scope. No hourly billing.
              </p>
            </div>
            {/* CENTER: Market comparison */}
            <div className="md:px-2">
              <p className="text-[14.5px] text-white/80 leading-[1.75]">
                A retained safety consultant in the Southeast typically bills $1,500–$3,000/month. At $1,000/month
                equivalent, the Annual Compliance Partner delivers the same continuity at a structured, predictable
                cost — designed for operations that need consistent oversight without adding headcount.
              </p>
            </div>
            {/* RIGHT: Limited availability callout */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.30)',
              }}
            >
              <p className="text-[13px] leading-[1.65]" style={{ color: 'rgba(201,168,76,0.95)' }}>
                GigLine accepts a limited number of annual partners. Engagements are scheduled on a first-confirmed
                basis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ What's Included (6-card 2-col grid on white) ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="acp-included">
        <div className="container max-w-6xl">
          <Eyebrow>What&apos;s Included</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            Everything. For one fixed annual price.
          </h2>
          <p className="text-base text-[#1C2B2B]/65 leading-[1.75] mb-12 max-w-2xl">
            No hourly billing. No scope creep. No surprise invoices when something happens.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INCLUDED_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-6 md:p-7 flex gap-5"
                  style={{ background: '#f5f4f0', border: '1px solid #e8e5dd' }}
                  data-testid={`acp-included-card-${i + 1}`}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'rgba(42,82,160,0.10)',
                      color: '#2A52A0',
                    }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[16.5px] font-bold mb-2 leading-snug" style={{ color: NAVY }}>
                      {card.title}
                    </h3>
                    <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{card.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Inline CTA bar + Who This Is For (combined dark-navy band) ═══ */}
      <section style={{ background: NAVY }}>
        {/* Top CTA bar with logo + center label + "All Services" + gold button */}
        <div
          className="py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          data-testid="acp-cta-bar"
        >
          <div className="container max-w-6xl">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6">
              {/* Left: logo + tagline */}
              <div className="flex items-center gap-2.5">
                <img src="/gigline-logo-dark-bg.png?v=8" loading="lazy" alt="" className="h-7 w-auto" />
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
              {/* Center: "WHO THIS IS FOR" eyebrow */}
              <span
                className="uppercase font-bold hidden md:inline-block"
                style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}
              >
                Who This Is For
              </span>
              {/* Right: All Services + gold button */}
              <div className="flex items-center gap-5">
                <Link
                  to="/services"
                  className="text-[13.5px] font-bold text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                  data-testid="acp-bar-all-services"
                >
                  ← All Services
                </Link>
                <Link
                  to={INTAKE_HREF}
                  className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors"
                  style={{ background: GOLD, color: NAVY }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
                  data-testid="acp-bar-cta"
                >
                  Ask About Partnership
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Who This Is For — 3-col cards on dark navy */}
        <div className="py-16 md:py-20" data-testid="acp-who">
          <div className="container max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight text-white max-w-4xl">
              The Annual Compliance Partner is right for you when:
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
                  data-testid={`acp-who-card-${i + 1}`}
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
        </div>
      </section>

      {/* ═══ How to Start (cream bg) ═══ */}
      <RelatedFieldNotesStrip
        heading="Field Notes that pair with the Annual Compliance Partner"
        intro="The compliance topics that come up year after year — and what changes in North Carolina you'll want to track."
        notes={[
          { slug: 'nc-osha-vs-federal', title: 'NC OSHA vs Federal OSHA — the differences that matter', blurb: 'State-plan quirks, penalty structures, and the NC-specific rules that show up in inspections.' },
          { slug: 'recordkeeping-300-log', title: 'OSHA 300 Log — the mistakes I see most often', blurb: 'The recordkeeping habits that make annual submissions painless instead of painful.' },
          { slug: 'hazcom', title: 'Written HazCom Program — what a working one looks like', blurb: 'What to keep current every year — new chemicals, revised SDS, updated employee training.' },
        ]}
      />

      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="acp-how-to-start">
        <div className="container max-w-4xl">
          <Eyebrow>How to Start</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight" style={{ color: NAVY }}>
            Most annual partners start with a Compliance Readiness Visit.
          </h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-10 max-w-3xl">
            The CRV establishes a baseline — where your operation stands today, what needs to be fixed first, and what
            the ongoing oversight should focus on. It is the most efficient way to start an annual engagement and the
            most defensible way to document your starting point.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center justify-center gap-2 text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
              onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
              data-testid="acp-bottom-cta-annual"
            >
              Ask About Annual Partnership
              <ArrowRight size={18} />
            </Link>
            <Link
              to={CRV_HREF}
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ color: NAVY, border: `1.5px solid ${NAVY}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = NAVY;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = NAVY;
              }}
              data-testid="acp-bottom-cta-crv"
            >
              Start with a Compliance Readiness Visit
            </Link>
          </div>
          <a
            href="tel:3363298899"
            className="inline-flex items-center gap-2 text-[#1C2B2B]/60 hover:text-[#1C2B2B] text-sm mt-8 transition-colors"
            data-testid="acp-cta-phone"
          >
            <Phone size={14} />
            Questions? Call or text Vince directly — (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default AnnualCompliancePartnerPage;
