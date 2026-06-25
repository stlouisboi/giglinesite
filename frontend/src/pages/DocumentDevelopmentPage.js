import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2, FileText, AlertTriangle, Users, ClipboardCheck } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SLUG = 'document-development';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const CRV_HREF = '/services/compliance-readiness-visit';

const PROGRAMS = [
  {
    name: 'Lockout/Tagout (LOTO) Program',
    cfr: '29 CFR 1910.147',
    body: 'Written program + machine-specific procedures for every piece of equipment that requires energy isolation. Includes annual review schedule and employee training documentation.',
    price: 'From $650 (up to 5 machines) · From $1,200 (6–15 machines)',
  },
  {
    name: 'Hazard Communication (HazCom) Program',
    cfr: '29 CFR 1910.1200',
    body: 'Written HazCom program, SDS inventory organization, container labeling procedures, and employee right-to-know documentation. Covers all chemicals present in your operation.',
    price: 'Quoted after documentation review',
  },
  {
    name: 'PPE Hazard Assessment & Certification',
    cfr: '29 CFR 1910.132',
    body: 'Written hazard assessment for each job classification, PPE selection documentation, and signed certification form. Required before any PPE program is considered compliant.',
    price: 'Quoted after documentation review',
  },
  {
    name: 'Emergency Action Plan (EAP)',
    cfr: '29 CFR 1910.38',
    body: 'Written EAP covering evacuation procedures, emergency contacts, employee roles, and assembly points. Includes floor diagram and annual drill documentation template.',
    price: 'Quoted after documentation review',
  },
  {
    name: 'Full Written Program Suite',
    cfr: 'Multiple standards',
    body: 'Five or more written programs developed together — LOTO, HazCom, PPE, EAP, and any additional programs identified in the documentation review. Delivered as a complete, organized package.',
    price: 'From $2,000',
  },
];

const WHY_CARDS = [
  {
    icon: AlertTriangle,
    title: 'OSHA Cites the Absence',
    body: "An OSHA compliance officer doesn't ask whether your employees follow safe procedures. They ask to see the written program. No document means an automatic citation — regardless of actual practice.",
  },
  {
    icon: ClipboardCheck,
    title: 'Customer Audits Require Documentation',
    body: 'Most customer pre-qualification audits include a documentation checklist. Missing programs disqualify bids before anyone walks your floor. Written programs are table stakes for larger customers.',
  },
  {
    icon: FileText,
    title: "Templates Don't Hold Up",
    body: "Generic LOTO templates that don't list your specific equipment fail OSHA review. Programs must reflect your actual operation — your machines, your chemicals, your job classifications.",
  },
];

const WHEN_CARDS = [
  {
    title: 'Your documentation review identified specific gaps',
    body: 'The OSHA Documentation Readiness Review tells you exactly which programs are missing or non-compliant. Document Development is the natural next step.',
  },
  {
    title: "You're preparing for an OSHA inspection or customer audit",
    body: 'Auditors and compliance officers look for written programs first. If the document doesn\'t exist, the program doesn\'t exist — regardless of what your team actually does.',
  },
  {
    title: 'A new safety manager inherited an incomplete system',
    body: 'Starting from scratch or filling gaps left by a previous safety manager. GigLine writes what\'s missing so you\'re not building from templates that don\'t match your operation.',
  },
  {
    title: "You've been cited and need corrective documentation",
    body: 'OSHA citations often require written programs as part of the abatement. GigLine writes the required documents and formats them to satisfy the specific citation.',
  },
];

const PROCESS_STEPS = [
  {
    title: 'Documentation Review First',
    body: 'The OSHA Documentation Readiness Review identifies exactly which programs are missing or non-compliant. This is the starting point — not a sales step, a diagnostic one.',
  },
  {
    title: 'Scoped and Quoted',
    body: 'GigLine scopes the writing work based on your specific gaps, equipment, and operation type. You receive a fixed quote before any writing begins.',
  },
  {
    title: 'Written for Your Floor',
    body: 'Every program is written to your specific operation — your machines, your chemicals, your job classifications. Delivered as a complete, organized package ready for implementation.',
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

const Eyebrow = ({ children, color = '#1a6fc4' }) => (
  <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}>
    {children}
  </p>
);

const GoldRule = ({ className = 'mb-10' }) => (
  <div className={className} style={{ width: '56px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />
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
              description: 'Single written OSHA program from $350; full suite from $2,000.',
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

      {/* ═══ Hero ═══ */}
      <section className="bg-[#0d1b2a] text-white py-20 md:py-28" data-testid="dd-hero">
        <div className="container max-w-4xl">
          <Eyebrow>Document Development</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight">
            The programs you&apos;re missing — written for your floor.
          </h1>
          <GoldRule className="mb-7" />
          <p className="text-base md:text-lg text-white/75 leading-[1.85] mb-8 max-w-3xl">
            GigLine writes the safety programs your operation needs — scoped to your specific equipment, chemicals,
            and job classifications. Not templates. Not generic documents. Programs that match what actually happens
            in your facility.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to={INTAKE_HREF}
              className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              data-testid="dd-cta-hero"
            >
              Ask About Document Development
              <ArrowRight size={17} />
            </Link>
            <span className="text-white/55 text-sm" style={mono}>
              Scoped before writing begins · Fixed price · Private engagement
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Pricing Callout ═══ */}
      <section className="py-16 md:py-20 bg-white" data-testid="dd-pricing-callout">
        <div className="container max-w-4xl">
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ border: '1px solid #dde3ea', background: '#f5f4f0', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
          >
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0d1b2a] leading-[1.2] mb-3 tracking-tight">
              Quote After Review
            </h2>
            <p className="text-base text-[#0d1b2a]/80 leading-[1.75] mb-5">
              Fixed price before any writing begins.
            </p>
            <p className="text-[15px] text-[#0d1b2a]/75 leading-[1.75] mb-5">
              Document Development is scoped and quoted after an{' '}
              <Link to={CRV_HREF} className="text-[#1a6fc4] font-bold hover:text-[#1560ae] underline">
                OSHA Documentation Readiness Review
              </Link>{' '}
              identifies which programs are missing or non-compliant. This ensures you only pay for what your operation
              actually needs.
            </p>
            <p className="text-[13.5px] text-[#0d1b2a]/65 leading-[1.7]" style={mono}>
              Floor pricing reference: single program from $350 · LOTO + 5 machines from $650 · full suite (5+ programs)
              from $2,000.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Why This Matters ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#fff8f0' }} data-testid="dd-why">
        <div className="container max-w-5xl">
          <Eyebrow>Why This Matters</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            If the document doesn&apos;t exist, the program doesn&apos;t exist.
          </h2>
          <GoldRule />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-7"
                  style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
                  data-testid={`dd-why-card-${i + 1}`}
                >
                  <div
                    className="flex items-center justify-center mb-5"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'rgba(26,111,196,0.10)',
                      color: '#1a6fc4',
                    }}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0d1b2a] mb-2.5 leading-snug">{card.title}</h3>
                  <p className="text-[14.5px] text-[#0d1b2a]/70 leading-[1.7]">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Programs GigLine Writes ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-programs">
        <div className="container max-w-5xl">
          <Eyebrow>Programs GigLine Writes</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            Five core programs. All scoped to your operation.
          </h2>
          <GoldRule />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMS.map((p, i) => (
              <div
                key={i}
                className={`rounded-xl p-7 ${i === PROGRAMS.length - 1 ? 'md:col-span-2' : ''}`}
                style={{
                  border: '1px solid #dde3ea',
                  background: i === PROGRAMS.length - 1 ? '#f5f4f0' : '#ffffff',
                  boxShadow: '0 1px 0 rgba(13,27,42,0.02)',
                }}
                data-testid={`dd-program-${i + 1}`}
              >
                <h3 className="text-lg md:text-xl font-bold text-[#0d1b2a] mb-1.5 leading-snug">{p.name}</h3>
                <p
                  className="uppercase font-bold mb-4"
                  style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.16em', color: '#5a6878' }}
                >
                  {p.cfr}
                </p>
                <p className="text-[14.5px] text-[#0d1b2a]/75 leading-[1.75] mb-4">{p.body}</p>
                <div className="pt-4" style={{ borderTop: '1px dashed #dde3ea' }}>
                  <p
                    className="uppercase font-bold mb-1.5"
                    style={{ ...mono, fontSize: '9.5px', letterSpacing: '0.16em', color: '#1a6fc4' }}
                  >
                    Pricing
                  </p>
                  <p className="text-[14px] font-bold text-[#0d1b2a]" style={mono}>
                    {p.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Floor Pricing Reference Table ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="dd-pricing-table">
        <div className="container max-w-4xl">
          <Eyebrow>Floor Pricing Reference</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            Fixed price before any writing begins.
          </h2>
          <GoldRule />
          <p className="text-base text-[#0d1b2a]/75 leading-[1.8] mb-8 max-w-3xl">
            These are reference prices for common scopes. Every engagement is quoted individually after the
            documentation review identifies your specific gaps. You&apos;ll have a fixed price before any writing starts —
            no open-ended billing.
          </p>
          <div
            className="rounded-xl overflow-hidden bg-white"
            style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
          >
            <div
              className="grid grid-cols-[1fr_auto] gap-x-6 px-6 py-4"
              style={{ background: '#0d1b2a', color: '#ffffff' }}
            >
              <span
                className="uppercase font-bold"
                style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.18em', color: '#D4A93E' }}
              >
                Scope
              </span>
              <span
                className="uppercase font-bold text-right"
                style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.18em', color: '#D4A93E' }}
              >
                Starting At
              </span>
            </div>
            {PRICING_TABLE.map(([scope, price], i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] gap-x-6 px-6 py-5 items-center"
                style={{
                  borderTop: i === 0 ? 'none' : '1px solid #eef0f3',
                  background: i % 2 === 1 ? '#fafbfc' : '#ffffff',
                }}
                data-testid={`dd-price-row-${i + 1}`}
              >
                <span className="text-[15px] text-[#0d1b2a]/85 leading-snug">{scope}</span>
                <span className="text-[15px] font-bold text-[#0d1b2a] text-right" style={mono}>
                  {price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[13.5px] text-[#0d1b2a]/60 italic mt-5 leading-[1.7]">
            Final price depends on facility size, number of machines, and complexity of existing documentation. Quoted
            after the OSHA Documentation Readiness Review.
          </p>
        </div>
      </section>

      {/* ═══ When to Book This ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-when">
        <div className="container max-w-5xl">
          <Eyebrow>When to Book This</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            Four situations where Document Development is the right call.
          </h2>
          <GoldRule />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHEN_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-xl p-7 flex gap-4"
                style={{ border: '1px solid #dde3ea', background: '#ffffff', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
                data-testid={`dd-when-card-${i + 1}`}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center font-extrabold"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(26,111,196,0.10)',
                    color: '#1a6fc4',
                    ...mono,
                    fontSize: '13px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-[#0d1b2a] mb-2 leading-snug">{card.title}</h3>
                  <p className="text-[14.5px] text-[#0d1b2a]/70 leading-[1.7]">{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="dd-process">
        <div className="container max-w-4xl">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            Three steps from gap to compliant document.
          </h2>
          <GoldRule />
          <div className="space-y-5">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-7 md:p-8 flex gap-5"
                style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
                data-testid={`dd-step-${i + 1}`}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center font-extrabold text-white"
                  style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a6fc4', ...mono, fontSize: '15px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0d1b2a] mb-2">{step.title}</h3>
                  <p className="text-[15px] text-[#0d1b2a]/70 leading-[1.75]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What's Included ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="dd-included">
        <div className="container max-w-4xl">
          <Eyebrow>What&apos;s Included in Every Document</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
            Not templates. Working documents.
          </h2>
          <GoldRule />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INCLUDED.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 text-[#0d1b2a]/85 text-[15.5px] leading-[1.6]"
                data-testid={`dd-include-${i + 1}`}
              >
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5 text-[#1a6fc4]" strokeWidth={2} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ Closing CTA ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#0d1b2a' }} data-testid="dd-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow color="#D4A93E">Ready to Start?</Eyebrow>
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
              className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
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
