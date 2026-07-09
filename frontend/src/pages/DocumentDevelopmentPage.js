import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Clock,
  Lock,
  Zap,
  Beaker,
  HardHat,
  Siren,
  Layers,
  ChevronRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import RelatedFieldNotesStrip from '../components/RelatedFieldNotesStrip';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SLUG = 'document-development';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const CRV_HREF = '/services/compliance-readiness-visit';

const PROGRAMS = [
  {
    icon: Zap,
    name: 'Lockout/Tagout (LOTO) Program',
    cfr: '29 CFR 1910.147',
    body:
      'Written program + machine-specific procedures for every piece of equipment that requires energy isolation. Includes annual review schedule and employee training documentation.',
    price: 'From $650 (up to 5 machines) · From $1,200 (6–15 machines)',
  },
  {
    icon: Beaker,
    name: 'Hazard Communication (HazCom) Program',
    cfr: '29 CFR 1910.1200',
    body:
      'Written HazCom program, SDS inventory organization, container labeling procedures, and employee right-to-know documentation. Covers all chemicals present in your operation.',
    price: 'Quoted after documentation review',
  },
  {
    icon: HardHat,
    name: 'PPE Hazard Assessment & Certification',
    cfr: '29 CFR 1910.132',
    body:
      'Written hazard assessment for each job classification, PPE selection documentation, and signed certification form. Required before any PPE program is considered compliant.',
    price: 'Quoted after documentation review',
  },
  {
    icon: Siren,
    name: 'Emergency Action Plan (EAP)',
    cfr: '29 CFR 1910.38',
    body:
      'Written EAP covering evacuation procedures, emergency contacts, employee roles, and assembly points. Includes floor diagram and annual drill documentation template.',
    price: 'Quoted after documentation review',
  },
  {
    icon: Layers,
    name: 'Full Written Program Suite',
    cfr: 'Multiple standards',
    body:
      'Five or more written programs developed together — LOTO, HazCom, PPE, EAP, and any additional programs identified in the documentation review. Delivered as a complete, organized package.',
    price: 'From $2,000',
  },
];

const WHY_CARDS = [
  {
    icon: AlertTriangle,
    title: 'OSHA Cites the Absence',
    body:
      "An OSHA compliance officer doesn't ask whether your employees follow safe procedures. They ask to see the written program. No document means an automatic citation — regardless of actual practice.",
  },
  {
    icon: ClipboardCheck,
    title: 'Customer Audits Require Documentation',
    body:
      'Most customer pre-qualification audits include a documentation checklist. Missing programs disqualify bids before anyone walks your floor. Written programs are table stakes for larger customers.',
  },
  {
    icon: FileText,
    title: "Templates Don't Hold Up",
    body:
      "Generic LOTO templates that don't list your specific equipment fail OSHA review. Programs must reflect your actual operation — your machines, your chemicals, your job classifications.",
  },
];

const WHEN_CARDS = [
  {
    title: 'Your documentation review identified specific gaps',
    body:
      'The OSHA Documentation Readiness Review tells you exactly which programs are missing or non-compliant. Document Development is the natural next step.',
  },
  {
    title: "You're preparing for an OSHA inspection or customer audit",
    body:
      "Auditors and compliance officers look for written programs first. If the document doesn't exist, the program doesn't exist — regardless of what your team actually does.",
  },
  {
    title: 'A new safety manager inherited an incomplete system',
    body:
      "Starting from scratch or filling gaps left by a previous safety manager. GigLine writes what's missing so you're not building from templates that don't match your operation.",
  },
  {
    title: "You've been cited and need corrective documentation",
    body:
      'OSHA citations often require written programs as part of the abatement. GigLine writes the required documents and formats them to satisfy the specific citation.',
  },
];

const PROCESS_STEPS = [
  {
    title: 'Documentation Review First',
    body:
      'The OSHA Documentation Readiness Review identifies exactly which programs are missing or non-compliant. This is the starting point — not a sales step, a diagnostic one.',
  },
  {
    title: 'Scoped and Quoted',
    body:
      'GigLine scopes the writing work based on your specific gaps, equipment, and operation type. You receive a fixed quote before any writing begins.',
  },
  {
    title: 'Written for Your Floor',
    body:
      'Every program is written to your specific operation — your machines, your chemicals, your job classifications. Delivered as a complete, organized package ready for implementation.',
  },
];

const PRICING_TABLE = [
  ['Single written program', 'From $350'],
  ['LOTO program + up to 5 machine procedures', 'From $650'],
  ['LOTO program + 6–15 machine procedures', 'From $1,200'],
  ['Full written program suite (5+ programs)', 'From $2,000'],
];

const INCLUDED = [
  'Written to your specific operation — not a generic template',
  'Applicable CFR standard cited throughout',
  'Formatted for OSHA review and customer audit',
  'Employee acknowledgment forms included',
  'Annual review schedule built in',
  'Delivered in editable format for future updates',
];

const Eyebrow = ({ children, color = '#2A52A0' }) => (
  <p
    className="uppercase font-bold mb-3"
    style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}
  >
    {children}
  </p>
);

const DocumentDevelopmentPage = () => {
  return (
    <main data-testid="document-development-page">
      <SEO
        title="Document Development — Written OSHA Programs from $350 | GigLine"
        description="GigLine writes the safety programs your operation needs — LOTO, HazCom, PPE, EAP, and full suites — scoped to your specific equipment, chemicals, and job classifications. Fixed price after a documentation review."
        canonical={`/services/${SLUG}`}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Document Development',
            provider: {
              '@type': 'LocalBusiness',
              name: 'GigLine Safety & Compliance',
              url: 'https://www.giglinecompliance.com',
              telephone: '+13363298899',
            },
            areaServed: { '@type': 'State', name: 'North Carolina' },
            offers: {
              '@type': 'Offer',
              price: '350',
              priceCurrency: 'USD',
              description:
                'Single written OSHA program from $350; full suite from $2,000.',
            },
            description:
              'Written OSHA programs — LOTO, HazCom, PPE, EAP, and full suites — scoped to your operation and quoted after a documentation review.',
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
                name: 'Document Development',
                item: `https://www.giglinecompliance.com/services/${SLUG}`,
              },
            ],
          },
        ]}
      />

      {/* ═══ Hero + Pricing Callout (single dark-navy section) ═══ */}
      <section className="bg-[#102A43] text-white pt-20 md:pt-24 pb-16 md:pb-20" data-testid="dd-hero">
        <div className="container max-w-6xl">
          <Eyebrow>Document Development</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight max-w-4xl">
            <span className="block">The programs you&apos;re missing —</span>
            <span className="block italic" style={{ color: '#C9A84C', fontStyle: 'italic' }}>
              written for your floor.
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-9 max-w-3xl">
            GigLine writes the safety programs your operation needs — scoped to your specific equipment, chemicals,
            and job classifications. Not templates. Not generic documents. Programs that match what actually happens
            in your facility.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-12">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center justify-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              data-testid="dd-cta-hero"
            >
              Ask About Document Development
              <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Clock size={14} />
              Scoped before writing begins
            </span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}>
              <Lock size={14} />
              Fixed price · Private engagement
            </span>
          </div>

          {/* Pricing Callout — embedded in hero */}
          <div
            className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr] gap-7 md:gap-10"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            data-testid="dd-pricing-callout"
          >
            <div>
              <Eyebrow color="#2A52A0">Pricing</Eyebrow>
              <h2 className="text-2xl md:text-[26px] font-extrabold text-white mb-2 leading-tight">
                Quote After Review
              </h2>
              <p className="text-sm text-white/65 leading-relaxed" style={mono}>
                Fixed price before any writing begins.
              </p>
            </div>
            <div>
              <p className="text-[15px] text-white/80 leading-[1.75] mb-4">
                Document Development is scoped and quoted after an{' '}
                <Link
                  to={CRV_HREF}
                  className="font-bold underline"
                  style={{ color: '#2A52A0' }}
                >
                  OSHA Documentation Readiness Review
                </Link>{' '}
                identifies which programs are missing or non-compliant. This ensures you only pay for what your
                operation actually needs.
              </p>
              <p className="text-[13px] text-white/55 leading-[1.7]" style={mono}>
                Floor pricing reference: single program from $350 · LOTO + 5 machines from $650 · full suite (5+
                programs) from $2,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why This Matters ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-why">
        <div className="container max-w-6xl">
          <Eyebrow>Why This Matters</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-12 tracking-tight max-w-3xl">
            If the document doesn&apos;t exist, the program doesn&apos;t exist.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-7"
                  style={{
                    background: '#f5f4f0',
                    border: '1px solid #e8e5dd',
                  }}
                  data-testid={`dd-why-card-${i + 1}`}
                >
                  <div
                    className="flex items-center justify-center mb-5"
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
                  <h3 className="text-[17px] font-bold text-[#1C2B2B] mb-2.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[14.5px] text-[#1C2B2B]/70 leading-[1.7]">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Programs GigLine Writes — 5 stacked full-width horizontal cards ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="dd-programs">
        <div className="container max-w-6xl">
          <Eyebrow>Programs GigLine Writes</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-12 tracking-tight max-w-4xl">
            Five core programs. All scoped to your operation.
          </h2>
          <div className="space-y-4">
            {PROGRAMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-6 md:p-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 md:gap-10 items-start"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e8e5dd',
                  }}
                  data-testid={`dd-program-${i + 1}`}
                >
                  {/* LEFT: Icon + Title + CFR + Body */}
                  <div className="flex gap-5">
                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: 'rgba(42,82,160,0.10)',
                        color: '#2A52A0',
                      }}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-[#1C2B2B] mb-1 leading-snug">
                        {p.name}
                      </h3>
                      <p
                        className="uppercase font-bold mb-3"
                        style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.16em', color: '#5a6878' }}
                      >
                        {p.cfr}
                      </p>
                      <p className="text-[14.5px] text-[#1C2B2B]/75 leading-[1.7] max-w-2xl">{p.body}</p>
                    </div>
                  </div>
                  {/* RIGHT: Pricing block */}
                  <div className="md:text-right md:min-w-[200px] md:pl-6 md:border-l md:border-[#e8e5dd]">
                    <p
                      className="uppercase font-bold mb-1.5"
                      style={{ ...mono, fontSize: '9.5px', letterSpacing: '0.16em', color: '#2A52A0' }}
                    >
                      Pricing
                    </p>
                    <p className="text-[14px] font-bold text-[#1C2B2B] leading-snug" style={mono}>
                      {p.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Floor Pricing Reference + When to Book This — side-by-side 2-col ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-pricing-and-when">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: Floor Pricing Reference */}
            <div data-testid="dd-pricing-table">
              <Eyebrow>Floor Pricing Reference</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C2B2B] leading-[1.2] mb-5 tracking-tight">
                Fixed price before any writing begins.
              </h2>
              <p className="text-[15px] text-[#1C2B2B]/75 leading-[1.75] mb-7">
                These are reference prices for common scopes. Every engagement is quoted individually after the
                documentation review identifies your specific gaps. You&apos;ll have a fixed price before any writing
                starts — no open-ended billing.
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #e0e4e9' }}
              >
                <div
                  className="grid grid-cols-[1fr_auto] gap-x-5 px-5 py-3.5"
                  style={{ background: '#102A43', color: '#ffffff' }}
                >
                  <span
                    className="uppercase font-bold"
                    style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#C9A84C' }}
                  >
                    Scope
                  </span>
                  <span
                    className="uppercase font-bold text-right"
                    style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#C9A84C' }}
                  >
                    Starting At
                  </span>
                </div>
                {PRICING_TABLE.map(([scope, price], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto] gap-x-5 px-5 py-4 items-center"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid #eef0f3',
                      background: i % 2 === 1 ? '#fafbfc' : '#ffffff',
                    }}
                    data-testid={`dd-price-row-${i + 1}`}
                  >
                    <span className="text-[14.5px] text-[#1C2B2B]/85 leading-snug">{scope}</span>
                    <span className="text-[14.5px] font-bold text-[#1C2B2B] text-right" style={mono}>
                      {price}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[12.5px] text-[#1C2B2B]/55 italic mt-4 leading-[1.7]">
                Final price depends on facility size, number of machines, and complexity of existing documentation.
                Quoted after the OSHA Documentation Readiness Review.
              </p>
            </div>

            {/* RIGHT: When to Book This */}
            <div data-testid="dd-when">
              <Eyebrow>When to Book This</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C2B2B] leading-[1.2] mb-7 tracking-tight">
                Four situations where Document Development is the right call.
              </h2>
              <div className="space-y-3.5">
                {WHEN_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5 flex gap-3.5"
                    style={{ background: '#f5f4f0', border: '1px solid #e8e5dd' }}
                    data-testid={`dd-when-card-${i + 1}`}
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2.5}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: '#2A52A0' }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-[15.5px] font-bold text-[#1C2B2B] mb-1.5 leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-[13.5px] text-[#1C2B2B]/70 leading-[1.7]">{card.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ How It Works — 3 col horizontal ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="dd-process">
        <div className="container max-w-6xl">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-12 tracking-tight max-w-3xl">
            Three steps from gap to compliant document.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                className="rounded-xl p-7 bg-white"
                style={{ border: '1px solid #e8e5dd' }}
                data-testid={`dd-step-${i + 1}`}
              >
                <p
                  className="font-extrabold mb-4 leading-none"
                  style={{ ...mono, fontSize: '38px', color: '#dde3ea' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-[17px] font-bold text-[#1C2B2B] mb-2.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Inline CTA Bar ═══ */}
      <section
        className="py-5"
        style={{ background: '#102A43', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        data-testid="dd-cta-bar"
      >
        <div className="container max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/gigline-logo-dark-bg.png?v=7" loading="lazy" alt="" className="h-7 w-auto" />
              <span
                className="uppercase font-bold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: 'rgba(255,255,255,0.55)' }}
              >
                Safety &amp; Compliance
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link
                to="/services"
                className="text-[13.5px] font-bold text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                data-testid="dd-bar-all-services"
              >
                <ChevronRight size={14} />
                All Services
              </Link>
              <Link
                to={INTAKE_HREF}
                className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-5 py-2.5 rounded-lg text-[13.5px] transition-colors"
                data-testid="dd-bar-cta"
              >
                Ask About Document Development
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ What's Included — 3-col grid ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-included">
        <div className="container max-w-6xl">
          <Eyebrow>What&apos;s Included in Every Document</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-12 tracking-tight max-w-3xl">
            Not templates. Working documents.
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCLUDED.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg p-4"
                style={{ background: '#f5f4f0', border: '1px solid #e8e5dd' }}
                data-testid={`dd-include-${i + 1}`}
              >
                <CheckCircle2
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                  strokeWidth={2}
                  style={{ color: '#2A52A0' }}
                />
                <span className="text-[14px] text-[#1C2B2B]/85 leading-[1.55]">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ Closing CTA ═══ */}
      <RelatedFieldNotesStrip
        heading="Field Notes that pair with Document Development"
        intro="Real examples of what a working written program looks like — and where teams typically leave gaps."
        notes={[
          { slug: 'hazcom', title: 'Written HazCom Program — what a working one looks like', blurb: 'Beyond the SDS binder: what OSHA expects your written HazCom program to actually cover.' },
          { slug: 'recordkeeping-300-log', title: 'OSHA 300 Log — the mistakes I see most often', blurb: 'Recordkeeping errors that turn a routine inspection into a citation.' },
          { slug: 'respiratory-protection', title: 'Respiratory Protection — the written program most sites are missing', blurb: 'Fit-test docs, medical evals, cartridge change-out — the written pieces OSHA asks for first.' },
        ]}
      />

      <section className="py-20 md:py-24" style={{ background: '#102A43' }} data-testid="dd-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow color="#C9A84C">Ready to Start?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight">
            Start with the documentation review.
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-[1.85] mb-10 max-w-2xl mx-auto">
            The OSHA Documentation Readiness Review identifies exactly which programs are missing. Document Development
            is scoped and quoted from those findings — so you only pay for what your operation actually needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={CRV_HREF}
              className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              data-testid="dd-cta-crv"
            >
              Start with a Documentation Review
              <ArrowRight size={18} />
            </Link>
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              data-testid="dd-cta-intake"
            >
              Ask About Document Development
            </Link>
          </div>
          <a
            href="tel:3363298899"
            className="inline-flex items-center gap-2 text-white/65 hover:text-white text-sm mt-8 transition-colors"
            data-testid="dd-cta-phone"
          >
            <Phone size={14} />
            Questions? Call or text Vince directly — (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default DocumentDevelopmentPage;
