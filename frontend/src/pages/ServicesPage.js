import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Star } from 'lucide-react';
import { trackServiceBooking } from '../utils/analytics';
import SEO from '../components/SEO';
import CaseStudyTeaser from '../components/CaseStudyTeaser';

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
    badge: 'ENTRY POINT',
    title: 'Safety Walkthrough Report',
    price: 'From $850',
    body: 'GigLine walks your floor and tells you specifically what an OSHA inspector would find. Every finding is documented with photos, the applicable CFR citation, the 2026 penalty exposure, and a plain-language corrective action. Written report delivered within 48 hours.',
    bodyExtra: 'No training to schedule. No software to learn. Just ground truth from the floor.',
    fine: "Best for operations that want to start with a physical hazard assessment — or facilities that have recently completed a documentation review and need a floor walkthrough.",
    cta: 'Request a Walkthrough',
    intakeService: 'safety-walkthrough-report',
    testid: 'svc-card-walkthrough',
    featured: false,
  },
  {
    badge: 'MOST POPULAR',
    title: 'Compliance Readiness Visit',
    price: 'From $1,500',
    body: 'GigLine checks what OSHA sees on the floor and what OSHA asks for in the office — in one visit. Includes a full safety walkthrough, OSHA Documentation Readiness Review, compliance score, photo documentation, CFR citations, and a written report delivered within 48 hours.',
    bodyExtra: 'The Supervisor Safety Starter System ($199 value) is included with every Compliance Readiness Visit.',
    fine: 'Best for operations that want complete coverage — physical hazards and documentation gaps — in one engagement.',
    cta: 'Schedule a Compliance Readiness Visit',
    intakeService: 'compliance-readiness-visit',
    testid: 'svc-card-compliance-readiness',
    featured: true,
  },
  {
    badge: 'PREMIUM',
    title: 'GigLine OSHA-Ready Control System',
    price: 'Starting at $4,500',
    body: 'GigLine builds your inspection-ready documentation system from the ground up. Four-binder physical command system. Digital folder architecture. Master document index. Training matrix. SDS organization. Corrective action tracker. 90-day maintenance calendar. Supervisor walkthrough included.',
    bodyExtra: 'When OSHA, a customer, an auditor, or an insurance carrier asks for your safety documentation — your team knows exactly where it is, what is current, and what still needs action.',
    fine: 'Best for operations with scattered documentation that need order, structure, and defensibility fast.',
    cta: 'Request a Buildout Consultation',
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {PRIMARY.map((s) => (
              <Reveal key={s.testid} delay={s.featured ? 0 : 80}>
                <div
                  className={`relative h-full flex flex-col rounded-xl bg-white transition-all duration-300 ${
                    s.featured ? 'lg:-mt-3 lg:mb-3 lg:scale-[1.02]' : ''
                  }`}
                  style={{
                    border: s.featured ? '2px solid #1F6FEB' : '1px solid rgba(16,33,51,0.12)',
                    boxShadow: s.featured
                      ? '0 24px 48px -16px rgba(31,111,235,0.30), 0 0 0 1px rgba(31,111,235,0.10) inset'
                      : '0 6px 14px rgba(16,33,51,0.05)',
                  }}
                  data-testid={s.testid}
                  data-featured={s.featured ? 'true' : 'false'}
                >
                  {/* Badge */}
                  <div className="px-7 pt-7 pb-2 flex items-center gap-2">
                    {s.featured && <Star size={14} className="text-[#F2D072]" fill="#F2D072" />}
                    <span
                      className="uppercase tracking-[2.5px] font-bold"
                      style={{
                        ...mono,
                        fontSize: '10.5px',
                        color: s.featured ? '#1F6FEB' : '#102133',
                        opacity: s.featured ? 1 : 0.55,
                      }}
                    >
                      {s.badge}
                    </span>
                  </div>

                  {/* Title + Price */}
                  <div className="px-7 pb-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#102133] leading-tight mb-3">
                      {s.title}
                    </h2>
                    <p className="text-2xl md:text-3xl font-bold text-[#1F6FEB]" style={mono}>
                      {s.price}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="mx-7 h-px" style={{ backgroundColor: s.featured ? 'rgba(31,111,235,0.25)' : 'rgba(16,33,51,0.10)' }} />

                  {/* Body */}
                  <div className="px-7 py-6 flex-grow flex flex-col">
                    <p className="text-base text-[#102133]/85 leading-relaxed mb-4">{s.body}</p>
                    <p className="text-base text-[#102133]/85 leading-relaxed mb-6">{s.bodyExtra}</p>
                    <p className="text-sm text-[#102133]/55 leading-relaxed mt-auto italic" style={mono}>
                      {s.fine}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-7 pb-7">
                    <Link
                      to={intakeLink(s.intakeService)}
                      onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
                      className={`w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-base transition-colors ${
                        s.featured
                          ? 'bg-[#1F6FEB] hover:bg-[#1558C0] text-white shadow-lg shadow-[#1F6FEB]/25'
                          : 'border-2 border-[#102133]/15 hover:border-[#1F6FEB] text-[#102133] hover:text-[#1F6FEB]'
                      }`}
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
