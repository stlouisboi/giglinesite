import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Star } from 'lucide-react';
import { trackServiceBooking } from '../utils/analytics';
import SEO from '../components/SEO';
import CaseStudyTeaser from '../components/CaseStudyTeaser';
import SampleReportSection from '../components/SampleReportSection';

/* ── Scroll-reveal — mirrors HomePage.js exactly ── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-fade ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ── PRIMARY CARDS (Section 1) ── */
const PRIMARY = [
  {
    serviceNum: '01',
    badge: 'ENTRY POINT',
    title: 'Safety Walkthrough Report',
    bestWhen: [
      'You want to know where you stand before OSHA shows up',
      "You've had recent growth, new equipment, or facility changes",
      "You're about to go through an insurance review",
    ],
    whatYouGet: [
      'On-site walkthrough (1–3 hours)',
      'Photo-documented hazard findings',
      'CFR citations + 2026 penalty exposure per finding',
      'Top 10 Fixes report — RED / AMBER / GREEN priority',
      'Delivered within 24–48 hours',
    ],
    price: '850',
    cta: 'Request a Walkthrough',
    intakeService: 'safety-walkthrough-report',
    testid: 'svc-card-walkthrough',
    featured: false,
  },
  {
    serviceNum: '02',
    badge: 'MOST POPULAR',
    title: 'Compliance Readiness Visit',
    bestWhen: [
      'You want both the floor AND documentation reviewed in one visit',
      "You're preparing for an OSHA inspection, audit, or insurance review",
      'You need a single compliance score across hazards and paperwork',
    ],
    whatYouGet: [
      'Full safety walkthrough on-site',
      'OSHA Documentation Readiness Review',
      'Compliance percentage score',
      'Photo documentation + CFR citations',
      'Written report within 48 hours',
      'Supervisor Safety Starter System ($199 value) included',
    ],
    price: '1,500',
    cta: 'Schedule a Visit',
    intakeService: 'compliance-readiness-visit',
    testid: 'svc-card-compliance-readiness',
    featured: true,
  },
  {
    serviceNum: '03',
    badge: 'PREMIUM',
    title: 'GigLine OSHA-Ready Control System',
    bestWhen: [
      'Your documentation is scattered across drives, binders, and emails',
      'A customer, auditor, or insurer is asking for proof',
      'You need a system your team can maintain after handoff',
    ],
    whatYouGet: [
      'Four-binder physical command system',
      'Digital folder architecture + master document index',
      'Training matrix + SDS organization',
      'Corrective action tracker',
      '90-day maintenance calendar',
      'Supervisor walkthrough included',
    ],
    price: '4,500',
    cta: 'Request Buildout',
    intakeService: 'osha-ready-control-system',
    testid: 'svc-card-control-system',
    featured: false,
  },
];

/* ── SECONDARY (Section 2) ── */
const ADDITIONAL = [
  {
    title: 'OSHA Documentation Readiness Review',
    price: 'From $750',
    body: 'Structured review of written programs, training records, OSHA logs, inspection records, and SDS compliance. 53-item checklist across seven OSHA categories. Compliance percentage score. Priority readiness report with corrective action sequence. Available as a standalone service or included in the Compliance Readiness Visit.',
    best: 'Operations preparing for an audit, insurance review, or customer pre-qualification that need to know specifically what documentation gaps exist before scheduling an on-site visit.',
    cta: 'Request a Documentation Review',
    intakeService: 'documentation-readiness-review',
    testid: 'svc-add-doc-review',
  },
  {
    title: 'Incident Review & Corrective Action Support',
    price: 'From $1,200',
    body: 'Post-injury or post-near-miss response. Root cause analysis. OSHA recordability determination. OSHA 301 completion. Corrective action plan. Documentation of closure.',
    body2: 'Call GigLine before you file anything or talk to anyone.',
    cta: 'Request Incident Support',
    intakeService: 'incident-review',
    testid: 'svc-add-incident',
  },
  {
    title: 'Document Development',
    price: 'Quote after documentation review',
    body: 'GigLine writes the programs you are missing. LOTO program and machine-specific procedures. HazCom program. PPE hazard assessment. Emergency Action Plan. Scoped and quoted after the OSHA Documentation Readiness Review identifies specific gaps.',
    floorPricing: [
      ['Single written program', 'From $350'],
      ['LOTO program + up to 5 machine procedures', 'From $650'],
      ['LOTO program + 6–15 machine procedures', 'From $950'],
      ['Full written program suite (5+ programs)', 'From $1,500'],
    ],
    cta: 'Ask About Document Development',
    intakeService: 'document-development',
    testid: 'svc-add-doc-dev',
  },
  {
    title: 'Documentation Readiness Review — Entry Level',
    price: '$950 flat',
    body: 'Not sure where to start? GigLine conducts a focused 60–90 minute review of your existing safety documentation and tells you specifically what is missing, what is outdated, and what to fix first. Written findings report included.',
    best: 'Smaller operations that are not ready for a full engagement yet — or operations that want a professional assessment before committing to a larger service.',
    cta: 'Schedule a Readiness Review',
    intakeService: 'documentation-readiness-review-entry',
    testid: 'svc-add-readiness-entry',
  },
];

/* ── RECURRING (Section 3) ── */
const RECURRING = [
  {
    title: 'Quarterly Compliance Maintenance',
    price: '$750–$1,750 per quarter',
    body: 'GigLine keeps the system current between annual walkthroughs. Documentation review, training record audit, SDS inventory check, corrective action tracker review, and a brief site visit if needed.',
    best: 'Operations that want the system kept alive after it is built.',
    cta: 'Ask About Quarterly Maintenance',
    intakeService: 'quarterly-compliance-maintenance',
    testid: 'svc-rec-quarterly',
  },
  {
    title: 'Annual Compliance Control Partner',
    price: '$9,000–$18,000 per year',
    body: 'Two full walkthroughs per year. Quarterly documentation reviews. Training record maintenance. OSHA 300A posting reminders. Pre-inspection readiness review. Management safety review. GigLine becomes your ongoing compliance resource — available when something happens and proactive between visits.',
    best: 'Operations that want a consultant they can call, not just a one-time report.',
    cta: 'Ask About Annual Partnership',
    intakeService: 'annual-compliance-partner',
    testid: 'svc-rec-annual',
  },
];

const intakeLink = (svc) => `/intake?service=${encodeURIComponent(svc)}`;

const ServicesPage = () => {
  return (
    <main className="overflow-x-hidden bg-white">
      <SEO
        title="GigLine Safety Services — Walkthroughs, Compliance Visits & OSHA-Ready Systems | From $850"
        description="GigLine walks your floor, reviews your documentation, and builds inspection-ready systems for small manufacturers, warehouses, contractors, and fleet operations in the Piedmont Triad. Fixed pricing. No retainer."
        canonical="/services"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative py-20 md:py-28" style={{ backgroundColor: '#0B1F33' }} data-testid="services-hero">
        <div className="container max-w-5xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-5 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Services · GigLine Safety & Compliance
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6 max-w-4xl" data-testid="services-headline">
              Three ways GigLine can help — before OSHA asks.
            </h1>
            <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed max-w-3xl" data-testid="services-sub">
              Every engagement ends with a written report, clear action items, and a defined next step. Fixed pricing. No retainer. No long contracts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ S1 — PRIMARY CARDS ═══ */}
      <section className="py-20 md:py-28 bg-white" data-testid="services-primary">
        <div className="container max-w-7xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-5 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Choose Your Engagement
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102133] leading-[1.15] mb-14 max-w-3xl" data-testid="services-section-headline">
              Each service starts with a fixed price, ends with a written deliverable.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {PRIMARY.map((s) => (
              <Reveal key={s.testid} delay={s.featured ? 0 : 80}>
                <div
                  className={`relative h-full flex flex-col rounded-2xl bg-white transition-all duration-300 ${
                    s.featured ? 'lg:-mt-6 lg:mb-3 lg:scale-[1.045] z-10' : ''
                  }`}
                  style={{
                    border: s.featured ? '3px solid #1F6FEB' : '1px solid rgba(16,33,51,0.10)',
                    boxShadow: s.featured
                      ? '0 32px 64px -16px rgba(31,111,235,0.45), 0 0 0 6px rgba(31,111,235,0.08), 0 0 80px -20px rgba(31,111,235,0.35)'
                      : '0 6px 14px rgba(16,33,51,0.05)',
                  }}
                  data-testid={s.testid}
                  data-featured={s.featured ? 'true' : 'false'}
                >
                  {/* MOST POPULAR top ribbon (featured only) */}
                  {s.featured && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #1F6FEB 0%, #1558C0 100%)',
                        boxShadow: '0 8px 20px -4px rgba(31,111,235,0.55), 0 0 0 4px #FFFFFF',
                      }}
                    >
                      <span
                        className="uppercase tracking-[2px] font-bold text-white whitespace-nowrap"
                        style={{ ...mono, fontSize: '10.5px' }}
                      >
                        ★ Most Popular
                      </span>
                    </div>
                  )}

                  {/* SERVICE 0X row */}
                  <div className="flex items-center justify-between px-8 pt-7 pb-1">
                    <span
                      className="uppercase tracking-[2.5px] font-bold text-[#1F6FEB]"
                      style={{ ...mono, fontSize: '10.5px' }}
                    >
                      Service {s.serviceNum}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="px-8 pt-3 pb-6">
                    <h3 className="text-2xl md:text-[1.625rem] font-bold text-[#102133] leading-[1.2]">
                      {s.title}
                    </h3>
                  </div>

                  {/* BEST WHEN */}
                  <div className="px-8 pb-6">
                    <p
                      className="uppercase tracking-[2px] text-[#102133]/55 font-bold mb-4"
                      style={{ ...mono, fontSize: '10.5px' }}
                    >
                      Best When
                    </p>
                    <ul className="space-y-3">
                      {s.bestWhen.map((line, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#102133]/85 text-base leading-snug">
                          <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#1F6FEB]" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WHAT YOU GET */}
                  <div className="px-8 pb-7 flex-grow">
                    <p
                      className="uppercase tracking-[2px] text-[#102133]/55 font-bold mb-4"
                      style={{ ...mono, fontSize: '10.5px' }}
                    >
                      What You Get
                    </p>
                    <ul className="space-y-2.5">
                      {s.whatYouGet.map((line, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#102133]/70 text-sm leading-snug">
                          <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[#102133]/35" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price block */}
                  <div className="px-8 pb-5">
                    <div
                      className="rounded-lg px-5 py-4 flex items-baseline justify-between gap-3"
                      style={{ border: '1px solid rgba(16,33,51,0.10)', backgroundColor: '#FBFCFD' }}
                    >
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="uppercase tracking-[2px] text-[#102133]/55 font-bold" style={{ ...mono, fontSize: '10px' }}>
                          Starting At
                        </span>
                        <span className="text-3xl md:text-[2.25rem] font-bold text-[#1F6FEB] leading-none tracking-tight">
                          ${s.price}
                        </span>
                      </div>
                      <span className="text-[#102133]/45 italic" style={{ ...mono, fontSize: '11px' }}>
                        fixed quote
                      </span>
                    </div>
                  </div>

                  {/* Full-width CTA */}
                  <div className="px-8 pb-8">
                    <Link
                      to={intakeLink(s.intakeService)}
                      onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-6 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1F6FEB]/20"
                      data-testid={`${s.testid}-cta`}
                    >
                      {s.cta}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S2 — ADDITIONAL SERVICES ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-additional">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Additional Services
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-12 max-w-3xl">
              Targeted engagements when you need a specific outcome.
            </h2>
          </Reveal>

          <div className="space-y-6">
            {ADDITIONAL.map((s) => (
              <Reveal key={s.testid}>
                <div
                  className="bg-white rounded-lg p-6 md:p-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start"
                  style={{
                    border: '1px solid rgba(16,33,51,0.10)',
                    boxShadow: '0 2px 6px rgba(16,33,51,0.03)',
                  }}
                  data-testid={s.testid}
                >
                  <div>
                    <div className="flex items-baseline gap-4 flex-wrap mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-[#102133]">{s.title}</h3>
                      <span className="text-base font-bold text-[#1F6FEB]" style={mono}>{s.price}</span>
                    </div>
                    <p className="text-base text-[#102133]/80 leading-relaxed mb-3">{s.body}</p>
                    {s.body2 && (
                      <p className="text-base text-[#102133]/80 leading-relaxed mb-3 font-semibold">{s.body2}</p>
                    )}

                    {s.floorPricing && (
                      <div className="mt-4 mb-3 p-4 rounded bg-[#F7F1E0]" style={{ border: '1px solid rgba(212,169,62,0.35)' }}>
                        <p className="text-xs uppercase tracking-wider text-[#102133]/65 mb-2 font-bold" style={mono}>
                          Floor Pricing Reference
                        </p>
                        <ul className="space-y-1.5">
                          {s.floorPricing.map(([item, price], i) => (
                            <li key={i} className="flex justify-between gap-4 text-sm text-[#102133]/85">
                              <span>{item}</span>
                              <span className="font-bold text-[#102133] whitespace-nowrap" style={mono}>{price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.best && (
                      <p className="text-sm text-[#102133]/60 leading-relaxed mt-3 italic" style={mono}>
                        Best for: {s.best}
                      </p>
                    )}
                  </div>

                  <Link
                    to={intakeLink(s.intakeService)}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1F6FEB] hover:bg-[#1F6FEB] hover:text-white text-[#1F6FEB] font-bold px-5 py-3 rounded-lg text-sm transition-colors whitespace-nowrap self-start md:self-center"
                    data-testid={`${s.testid}-cta`}
                  >
                    {s.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SAMPLE DELIVERABLE — restored per GL-WEB-014 follow-up ═══ */}
      <SampleReportSection />

      {/* ═══ S3 — RECURRING SERVICES ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-recurring">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Ongoing Compliance Support
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-3 max-w-3xl">
              Keep the system current.
            </h2>
            <p className="text-base md:text-lg text-[#102133]/70 leading-relaxed mb-12 max-w-3xl">
              Every GigLine engagement includes a compliance calendar. These services keep it current.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECURRING.map((s) => (
              <Reveal key={s.testid}>
                <div
                  className="bg-white h-full rounded-xl p-7 md:p-8 flex flex-col"
                  style={{
                    border: '1px solid rgba(16,33,51,0.10)',
                    boxShadow: '0 6px 14px rgba(16,33,51,0.04)',
                  }}
                  data-testid={s.testid}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-[#102133] mb-3">{s.title}</h3>
                  <p className="text-xl font-bold text-[#1F6FEB] mb-5" style={mono}>{s.price}</p>
                  <p className="text-base text-[#102133]/85 leading-relaxed mb-4">{s.body}</p>
                  <p className="text-sm text-[#102133]/60 leading-relaxed mb-6 italic flex-grow" style={mono}>
                    Best for: {s.best}
                  </p>
                  <Link
                    to={intakeLink(s.intakeService)}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1F6FEB] hover:bg-[#1F6FEB] hover:text-white text-[#1F6FEB] font-bold px-6 py-3 rounded-lg text-base transition-colors self-start"
                    data-testid={`${s.testid}-cta`}
                  >
                    {s.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S4 — Case Study Teaser ═══ */}
      <CaseStudyTeaser source="services" />

      {/* ═══ 90-SECOND SAFETY CHECK BAND ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#F7F1E0' }} data-testid="services-safety-check-band">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-4 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Free Tool
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#102133] mb-5 leading-tight">
              Not sure where you stand?
            </h2>
            <p className="text-base md:text-lg text-[#102133]/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Answer 6 yes-or-no questions about your operation. Get an immediate risk score and a clear next step — no email required to start.
            </p>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1F6FEB]/25"
              data-testid="services-safety-check-link"
            >
              Take the Safety Check
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ S5 — BOTTOM CTA ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#000000' }} data-testid="services-bottom-cta">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Not sure which service fits your operation?
          </h2>
          <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-10 max-w-2xl mx-auto">
            Call or text (336) 329-8899. GigLine will tell you exactly what makes sense before you schedule anything. No pressure. No sales pitch. Just a straight answer.
          </p>
          <a
            href="tel:+13363298899"
            className="inline-flex items-center gap-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1F6FEB]/25"
            data-testid="services-bottom-cta-call"
          >
            <Phone size={20} />
            Call or Text Now
          </a>
          <p className="text-sm text-[#CBD5E1] mt-6" style={mono}>
            (336) 329-8899 · vince@giglinecompliance.com
          </p>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
