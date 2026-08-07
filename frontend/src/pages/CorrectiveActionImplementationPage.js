import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ClipboardCheck, Users, FileCheck, Layers, Phone } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#F9F8F6';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const meta = {
  title: 'Corrective Action Implementation — Close the Findings | GigLine',
  description:
    'GigLine helps close selected safety-control findings after an assessment. Hands-on implementation. Custom-quoted per facility. Typically from $2,500 depending on scope.',
  canonical: '/services/corrective-action-implementation',
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corrective Action Implementation',
  provider: {
    '@type': 'LocalBusiness',
    name: 'GigLine Safety & Compliance',
    url: 'https://www.giglinecompliance.com',
    telephone: '+13363298899',
  },
  areaServed: { '@type': 'State', name: 'North Carolina' },
  serviceType: 'Safety Compliance Implementation',
  description:
    'Hands-on implementation of selected safety-control findings identified in a GigLine assessment or comparable review. Includes organizing PIT authorization, HazCom evidence, training records, corrective-action tracking, and document control. Custom quote per engagement. Most projects begin at $2,500.',
  offers: {
    '@type': 'Offer',
    price: '2500',
    priceCurrency: 'USD',
    description:
      'Corrective Action Implementation — custom quote. Most projects begin at $2,500 and are driven by the number of findings, complexity, program area, facility size, and hands-on work required.',
  },
};

const EXAMPLES = [
  {
    Icon: Wrench,
    title: 'Organize PIT authorization and evaluation systems',
    body: 'Build the operator-by-operator authorization file, evaluation cadence, and pre-shift documentation structure — matched to your actual truck fleet and shift structure.',
  },
  {
    Icon: FileCheck,
    title: 'Rebuild selected HazCom evidence structures',
    body: 'Organize the chemical inventory, SDS accessibility, secondary container labeling audit, and training-to-inventory match — with responsible owners named.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Organize training evidence',
    body: 'Consolidate scattered training records into a role-based matrix with completion dates, refresher cadence, and named ownership.',
  },
  {
    Icon: Users,
    title: 'Assign corrective-action ownership',
    body: 'Take a list of findings and give each one a named owner, target date, verification step, and closure-evidence requirement so nothing sits open.',
  },
  {
    Icon: Layers,
    title: 'Establish defined document controls',
    body: 'Version control, review cadence, approval owner, and retrieval structure for the written programs and records that would be produced during an inspection.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Build corrective-action tracking',
    body: 'A single tracker for open findings, target dates, verification, and closure evidence — one that management can actually read on a Monday morning.',
  },
];

const SCOPE_FACTORS = [
  'Number of findings',
  'Complexity of each finding',
  'Program area (LOTO, HazCom, PIT, training, recordkeeping, etc.)',
  'Facility size and record volume',
  'Number of employees and shifts',
  'Travel',
  'Amount of hands-on work required on-site vs. off-site',
];

const CorrectiveActionImplementationPage = () => (
  <main data-testid="corrective-action-implementation-page">
    <SEO title={meta.title} description={meta.description} canonical={meta.canonical} schema={schema} />

    {/* ═══ HERO ═══ */}
    <section className="py-20 md:py-28" style={{ background: NAVY, color: 'white' }}>
      <div className="container max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p
            className="uppercase tracking-[0.18em] font-semibold mb-4"
            style={{ ...mono, fontSize: '11px', color: GOLD }}
            data-testid="corrective-action-eyebrow"
          >
            BUILD · Corrective Action Implementation
          </p>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="corrective-action-headline"
          >
            We found the gap. Now GigLine can help you close it.
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-relaxed mb-6 max-w-xl">
            After an assessment identifies what needs to change, Corrective Action Implementation is
            the hands-on engagement that closes selected findings — with ownership, records, and
            evidence organized so the control actually works between visits.
          </p>
          <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-xl">
            Not another assessment. Not a subscription. A separately scoped engagement to organize
            the ownership, records, and evidence around the specific findings you want closed.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/intake?service=corrective-action-implementation"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/95 font-bold px-7 py-4 rounded-lg transition-colors"
              style={{ color: NAVY }}
              data-testid="corrective-action-hero-cta"
            >
              Ask About Corrective Action Support
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:3363298899"
              className="inline-flex items-center gap-2 text-white/85 hover:text-white font-semibold text-base underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
              data-testid="corrective-action-hero-phone"
            >
              <Phone size={16} />
              (336) 329-8899
            </a>
          </div>
        </div>

        <div
          className="rounded-xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <p
            className="uppercase font-bold mb-2"
            style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.14em', color: GOLD }}
          >
            Pricing
          </p>
          <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-none" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="cai-hero-price-primary">
            Custom Quote
          </p>
          <p className="text-white/70 mb-6 text-[15px] leading-relaxed" data-testid="cai-hero-price-support">
            Most projects begin at <span className="font-semibold text-white" style={mono}>$2,500</span>. Fixed price before scheduling. Implementation is always separately scoped — the quote varies with findings, complexity, and facility size.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }} className="pt-5">
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)' }}
            >
              The Quote Reflects
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {SCOPE_FACTORS.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* ═══ POSITIONING ═══ */}
    <section className="py-16 md:py-24 bg-white border-b" style={{ borderColor: '#dde3ea' }}>
      <div className="container max-w-4xl">
        <p
          className="uppercase tracking-[0.18em] font-semibold mb-3"
          style={{ ...mono, fontSize: '11px', color: '#2A52A0' }}
        >
          When to use it
        </p>
        <h2
          className="text-2xl md:text-4xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "Georgia, serif", color: NAVY }}
        >
          Corrective Action Implementation vs. OSHA-Ready Control System
        </h2>
        <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-relaxed mb-8">
          The two BUILD engagements sound similar. They are not. One closes a specific list of
          findings. The other builds broader connected safety infrastructure across the operation.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="rounded-lg p-6"
            style={{ background: '#FBFCFD', border: '1px solid #dde3ea' }}
            data-testid="cai-vs-orcs-cai-card"
          >
            <p
              className="uppercase font-bold mb-2"
              style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.14em', color: GOLD }}
            >
              Corrective Action Implementation
            </p>
            <h3 className="text-xl font-bold mb-3" style={{ color: NAVY, fontFamily: "Georgia, serif" }}>
              Best for: selected findings or one defined implementation project
            </h3>
            <p className="text-[15px] leading-[1.7] text-[#1C2B2B]/75">
              You have a specific list of gaps from a walkthrough, review, insurance audit, or
              customer pre-qualification. You know which items need to close. GigLine organizes the
              work around your actual records so those items get closed with evidence.
            </p>
          </div>
          <div
            className="rounded-lg p-6"
            style={{ background: '#FBFCFD', border: '1px solid #dde3ea' }}
            data-testid="cai-vs-orcs-orcs-card"
          >
            <p
              className="uppercase font-bold mb-2"
              style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.14em', color: '#2A52A0' }}
            >
              OSHA-Ready Control System
            </p>
            <h3 className="text-xl font-bold mb-3" style={{ color: NAVY, fontFamily: "Georgia, serif" }}>
              Best for: multiple connected safety-control areas
            </h3>
            <p className="text-[15px] leading-[1.7] text-[#1C2B2B]/75">
              You want a broader safety infrastructure across the operation — physical command
              system, digital folder architecture, training matrix, corrective-action tracker,
              supervisor handoff, and evidence system built to work together.
            </p>
            <Link
              to="/services/osha-ready-control-system"
              className="inline-flex items-center gap-1 text-[#2A52A0] hover:text-[#1F3F80] font-semibold text-sm mt-4"
              data-testid="cai-see-orcs-link"
            >
              See OSHA-Ready Control System
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* ═══ EXAMPLES ═══ */}
    <section className="py-16 md:py-24" style={{ background: CREAM }}>
      <div className="container max-w-6xl">
        <p
          className="uppercase tracking-[0.18em] font-semibold mb-3"
          style={{ ...mono, fontSize: '11px', color: '#2A52A0' }}
        >
          What implementation typically covers
        </p>
        <h2
          className="text-2xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: NAVY }}
        >
          Examples of Corrective Action work
        </h2>
        <p className="text-base md:text-lg text-[#1C2B2B]/70 leading-relaxed mb-10 max-w-3xl">
          Not every engagement covers every item. GigLine scopes the work around the specific
          findings you want closed and quotes fixed before scheduling.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="cai-examples-grid">
          {EXAMPLES.map((ex) => {
            const Icon = ex.Icon;
            return (
              <div
                key={ex.title}
                className="rounded-lg bg-white p-6 h-full"
                style={{ border: '1px solid #e5e2d9' }}
                data-testid={`cai-example-${ex.title.slice(0, 12).replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-4"
                  style={{ background: NAVY, color: GOLD }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <h3
                  className="text-lg font-bold mb-2 leading-snug"
                  style={{ color: NAVY, fontFamily: "Georgia, serif" }}
                >
                  {ex.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-[#1C2B2B]/75">{ex.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-16 md:py-20" style={{ background: NAVY, color: 'white' }}>
      <div className="container max-w-3xl text-center">
        <h2
          className="text-2xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Have a list of findings you need closed?
        </h2>
        <p className="text-base md:text-lg text-white/75 leading-relaxed mb-8 max-w-2xl mx-auto">
          Share the list — from a GigLine assessment, an insurance audit, a customer pre-qualification,
          or an internal review — and GigLine will scope the implementation and quote it fixed before scheduling.
        </p>
        <Link
          to="/intake?service=corrective-action-implementation"
          className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-lg transition-colors"
          style={{ background: GOLD, color: NAVY }}
          data-testid="cai-footer-cta"
        >
          Ask About Corrective Action Support
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  </main>
);

export default CorrectiveActionImplementationPage;
