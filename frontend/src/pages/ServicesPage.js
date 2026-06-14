import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Factory, Truck, Warehouse, HardHat, ShieldCheck } from 'lucide-react';
import { trackServiceBooking, trackPhoneClick, trackEvent } from '../utils/analytics';
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

const intakeLink = (svc) => `/intake?service=${encodeURIComponent(svc)}`;

/* GA4 services CTA click — fired alongside intent so we can see full funnel */
const fireServicesCtaClick = (ctaText, ctaDestination) => {
  if (typeof window === 'undefined') return;
  trackEvent('services_cta_click', {
    cta_text: ctaText,
    cta_destination: ctaDestination,
    page_path: window.location.pathname,
  });
};

/* ═══ Who GigLine Helps ═══ */
const WHO_HELPS = [
  {
    Icon: Factory,
    title: 'Manufacturers',
    desc: 'Plastics, fabrication, food, building materials — 10 to 250 employees, single facility or multi-site Triad operations.',
  },
  {
    Icon: Warehouse,
    title: 'Warehouses & Distribution',
    desc: 'Powered industrial trucks, racking systems, dock operations — facilities where one untrained operator becomes a $16,131 finding.',
  },
  {
    Icon: HardHat,
    title: 'Contractors',
    desc: 'General contractors, electrical, mechanical, framing — operations bidding work that requires a documented safety program.',
  },
  {
    Icon: Truck,
    title: 'Fleet Operations',
    desc: 'Trucking, delivery, service fleets — DOT-adjacent operations that also fall under OSHA general industry standards on their yards and shops.',
  },
];

/* ═══ Standalone Services (Section 6 — excludes Compliance Visit + Control System which get their own sections) ═══ */
const STANDALONE = [
  {
    title: 'Safety Walkthrough Report',
    price: 'From $850',
    body: 'On-site walkthrough (1–3 hours). Photo-documented hazard findings. CFR citations + 2026 penalty exposure per finding. Top 10 Fixes report — RED / AMBER / GREEN priority. Delivered within 24–48 hours.',
    best: 'Operations that want to know where they stand on the floor before OSHA, an insurer, or a customer auditor shows up.',
    cta: 'Request a Walkthrough',
    intakeService: 'safety-walkthrough-report',
    testid: 'svc-standalone-walkthrough',
  },
  {
    title: 'OSHA Documentation Readiness Review',
    price: 'From $750',
    body: 'Structured review of written programs, training records, OSHA logs, inspection records, and SDS compliance. 53-item checklist across seven OSHA categories. Compliance percentage score. Priority readiness report with corrective action sequence.',
    best: 'Operations preparing for an audit, insurance review, or customer pre-qualification that need to know specifically what documentation gaps exist before scheduling an on-site visit.',
    cta: 'Request a Documentation Review',
    intakeService: 'documentation-readiness-review',
    testid: 'svc-standalone-doc-review',
  },
  {
    title: 'Incident Review & Corrective Action Support',
    price: 'From $1,200',
    body: 'Post-injury or post-near-miss response. Root cause analysis. OSHA recordability determination. OSHA 301 completion. Corrective action plan. Documentation of closure.',
    body2: 'Call GigLine before you file anything or talk to anyone.',
    cta: 'Request Incident Support',
    intakeService: 'incident-review',
    testid: 'svc-standalone-incident',
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
    testid: 'svc-standalone-doc-dev',
  },
];

/* ═══ Recurring (Quarterly + Annual) ═══ */
const RECURRING = [
  {
    title: 'Quarterly Compliance Maintenance',
    price: 'From $750/quarter',
    body: 'GigLine keeps the system current between annual walkthroughs. Documentation review, training record audit, SDS inventory check, corrective action tracker review, and a brief site visit if needed.',
    best: 'Operations that want the system kept alive after the Control System is built.',
    cta: 'Ask About Quarterly Maintenance',
    intakeService: 'quarterly-compliance-maintenance',
    testid: 'svc-rec-quarterly',
  },
  {
    title: 'Annual Compliance Control Partner',
    price: 'From $9,000/year',
    body: 'Two full walkthroughs per year. Quarterly documentation reviews. Training record maintenance. OSHA 300A posting reminders. Pre-inspection readiness review. Management safety review. GigLine becomes your ongoing compliance resource — available when something happens and proactive between visits.',
    best: 'Operations that want a consultant they can call, not just a one-time report.',
    cta: 'Ask About Annual Partnership',
    intakeService: 'annual-compliance-partner',
    testid: 'svc-rec-annual',
  },
];

/* ═══ Readiness Path table ═══ */
const READINESS_PATH = [
  { stage: 'Find the issues', need: 'What would OSHA see on our floor?', offer: 'Safety Walkthrough — from $850', link: intakeLink('safety-walkthrough-report') },
  { stage: 'Check the files', need: 'Are our documents inspection-ready?', offer: 'OSHA Documentation Readiness Review — from $750', link: intakeLink('documentation-readiness-review') },
  { stage: 'Review both', need: 'We need the floor and files checked.', offer: 'Compliance Readiness Visit — from $1,500', link: intakeLink('compliance-readiness-visit') },
  { stage: 'Build the system', need: 'We need this organized and defensible.', offer: 'OSHA-Ready Control System — from $4,500', link: intakeLink('osha-ready-control-system') },
  { stage: 'Keep it current', need: 'We need ongoing accountability.', offer: 'Quarterly Maintenance — from $750/quarter', link: intakeLink('quarterly-compliance-maintenance') },
];

/* ═══ Pricing reference block ═══ */
const PRICING_REF = [
  ['Safety Walkthrough', 'Starting at $850'],
  ['OSHA Documentation Readiness Review', 'Starting at $750'],
  ['Compliance Readiness Visit', 'Starting at $1,500'],
  ['Incident Review & Corrective Action', 'Starting at $1,200'],
  ['OSHA-Ready Control System', 'Starting at $4,500'],
  ['Quarterly Compliance Maintenance', 'Starting at $750/quarter'],
  ['Annual Compliance Control Partner', 'Starting at $9,000/year'],
];

/* ═══ Services FAQ ═══ */
const SERVICES_FAQ = [
  {
    q: 'How do I know which service to start with?',
    a: 'Most clients start with the Compliance Readiness Visit. It reviews both the floor and the documentation in one visit, gives you a single compliance score, and tells you exactly what to fix first. If you only need one side reviewed, start with the Safety Walkthrough or the OSHA Documentation Readiness Review. Not sure? Call or text (336) 329-8899.',
  },
  {
    q: 'Are the prices fixed or do they go up later?',
    a: 'Fixed quote before scheduling. The price you see is the starting point — GigLine will confirm scope and confirm the final fixed quote in writing before any visit is scheduled. No hourly billing. No retainer. No long-term contracts.',
  },
  {
    q: 'Do I have to sign up for ongoing services?',
    a: 'No. Every service is a single engagement. Quarterly Maintenance and the Annual Compliance Control Partner are optional — they exist for operations that want the system kept current after the Control System is built.',
  },
  {
    q: 'Will GigLine share findings with OSHA or my insurance carrier?',
    a: 'No. The engagement is private. The only deliverable is the written report handed to you. Nothing is shared with OSHA, insurance carriers, or any third party.',
  },
  {
    q: 'What happens after I submit a request?',
    a: 'GigLine reviews the intake within one business day, confirms scope and fixed pricing, and schedules the visit. Most walkthroughs are scheduled within 5–7 business days of the confirmed quote.',
  },
];

const ServicesPage = () => {
  return (
    <main className="overflow-x-hidden bg-white">
      <SEO
        title="GigLine Safety Services — Walkthroughs, Compliance Visits & OSHA-Ready Systems | From $850"
        description="OSHA-readiness support for small industrial operations. GigLine helps manufacturers, warehouses, contractors, and fleet operations identify visible hazards, documentation gaps, and inspection-readiness issues before they become citations. Fixed pricing. No retainer."
        canonical="/services"
      />

      {/* ═══ 1. HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0B1F33' }}
        data-testid="services-hero"
      >
        <div className="flex flex-col md:flex-row min-h-[480px] md:min-h-[560px]">
          {/* Image — left 40% on desktop, top on mobile */}
          <div className="relative w-full md:w-2/5 md:flex-shrink-0">
            <img
              src="/services-hero.jpg"
              alt="On-site safety walkthrough — warehouse and manufacturing operations across the Piedmont Triad"
              className="w-full h-64 md:h-full object-cover"
              loading="eager"
              fetchPriority="high"
              data-testid="services-hero-image"
            />
            {/* Soft navy fade on right edge to blend into copy panel on desktop */}
            <div
              className="hidden md:block absolute inset-y-0 right-0 w-24 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(11,31,51,0) 0%, rgba(11,31,51,0.92) 100%)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Copy — right 60% on desktop */}
          <div className="flex-grow flex items-center px-6 md:px-12 lg:px-16 py-12 md:py-16 relative z-10">
            <Reveal>
              <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-5 font-bold" style={{ ...mono, fontSize: '11px' }}>
                Services · GigLine Safety & Compliance
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6 max-w-2xl"
                data-testid="services-headline"
              >
                OSHA-Readiness Support for Small Industrial Operations
              </h1>
              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl"
                data-testid="services-sub"
              >
                GigLine helps manufacturers, warehouses, contractors, and fleet operations identify visible safety hazards, documentation gaps, and inspection-readiness issues before they become citations, insurance problems, or customer-audit failures.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 2. AUTHORITY STATEMENT ═══ */}
      <section className="py-10 md:py-14 bg-white" data-testid="services-authority-band">
        <div className="container max-w-4xl text-center">
          <Reveal>
            <p
              className="text-lg md:text-xl text-[#102133] leading-relaxed italic font-medium"
              data-testid="services-authority-line"
            >
              Built for small operations that need practical safety support without hiring a full-time safety manager.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3. 90-SECOND SAFETY CHECK — intake door, reduced visual weight ═══ */}
      <section
        className="py-14 md:py-16 border-t border-b"
        style={{ backgroundColor: '#F7F1E0', borderColor: 'rgba(212,169,62,0.35)' }}
        data-testid="services-safety-check-band"
      >
        <div className="container max-w-3xl text-center">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#102133]/55 mb-3 font-bold"
              style={{ ...mono, fontSize: '11px' }}
              data-testid="services-safety-check-kicker"
            >
              Not sure where to start?
            </p>
            <p className="text-base md:text-lg text-[#102133] leading-relaxed mb-6 max-w-2xl mx-auto" data-testid="services-safety-check-intro">
              Not sure where you stand? Take the free 90-Second Safety Check — six yes-or-no questions, immediate risk score, no email required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/safety-check"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#102133] hover:bg-[#102133] hover:text-white text-[#102133] font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                data-testid="services-safety-check-link"
              >
                Take the Safety Check
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-sm text-[#102133]/70 mt-5 italic" data-testid="services-safety-check-followup">
              Ready for a professional review?{' '}
              <Link
                to={intakeLink('compliance-readiness-visit')}
                className="text-[#1F6FEB] hover:text-[#1558C0] underline font-semibold"
                data-testid="services-safety-check-followup-link"
              >
                Schedule a Compliance Readiness Visit &rarr;
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 4. WHO GIGLINE HELPS ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-who-helps">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Who GigLine Helps
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] leading-tight mb-3 max-w-3xl">
              Built for the operations OSHA inspects the most.
            </h2>
            <p className="text-base md:text-lg text-[#102133]/70 leading-relaxed mb-12 max-w-3xl">
              GigLine focuses on the four operation types most likely to receive an OSHA inspection, an insurance review, or a customer-audit request in the Piedmont Triad.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHO_HELPS.map(({ Icon, title, desc }) => (
              <Reveal key={title}>
                <div
                  className="h-full bg-white rounded-xl p-6 flex flex-col"
                  style={{ border: '1px solid rgba(16,33,51,0.10)', boxShadow: '0 4px 12px rgba(16,33,51,0.04)' }}
                  data-testid={`who-helps-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(31,111,235,0.08)' }}
                  >
                    <Icon size={22} className="text-[#1F6FEB]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#102133] mb-2">{title}</h3>
                  <p className="text-sm text-[#102133]/75 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. COMPLIANCE READINESS VISIT — Featured, standalone ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-readiness-visit">
        <div className="container max-w-5xl">
          <Reveal>
            <div
              className="relative rounded-2xl bg-white p-8 md:p-12"
              style={{
                border: '3px solid #1F6FEB',
                boxShadow: '0 32px 64px -16px rgba(31,111,235,0.30), 0 0 0 6px rgba(31,111,235,0.08)',
              }}
              data-testid="svc-card-compliance-readiness"
            >
              {/* Recommended Starting Point badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-lg whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #1F6FEB 0%, #1558C0 100%)',
                  boxShadow: '0 8px 20px -4px rgba(31,111,235,0.55), 0 0 0 4px #FFFFFF',
                }}
                data-testid="readiness-visit-badge"
              >
                <span
                  className="uppercase tracking-[2px] font-bold text-white"
                  style={{ ...mono, fontSize: '10.5px' }}
                >
                  ★ Recommended Starting Point
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start mt-4">
                <div>
                  <p
                    className="uppercase tracking-[2.5px] text-[#1F6FEB] font-bold mb-3"
                    style={{ ...mono, fontSize: '10.5px' }}
                  >
                    Flagship Engagement
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-tight mb-4">
                    Compliance Readiness Visit
                  </h2>
                  <p className="text-base md:text-lg text-[#102133]/80 leading-relaxed mb-6 max-w-2xl">
                    The floor and the files reviewed in a single visit. Most operations don&apos;t need a separate walkthrough and documentation review — they need both, scored together, with a single readiness report. This is that engagement.
                  </p>

                  <p
                    className="uppercase tracking-[2px] text-[#102133]/55 font-bold mb-3"
                    style={{ ...mono, fontSize: '10.5px' }}
                  >
                    What You Get
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      'Full safety walkthrough on-site',
                      'OSHA Documentation Readiness Review',
                      'Single compliance percentage score',
                      'Photo documentation + CFR citations',
                      'Written report within 48 hours',
                      'Supervisor Safety Starter System ($199 value) included',
                    ].map((line, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#102133]/85 text-base leading-snug">
                        <Check size={18} className="flex-shrink-0 mt-0.5 text-[#1F6FEB]" strokeWidth={3} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:w-64 flex-shrink-0">
                  <div
                    className="rounded-lg px-5 py-5 mb-4 text-center"
                    style={{ border: '1px solid rgba(31,111,235,0.25)', backgroundColor: '#FBFCFD' }}
                  >
                    <p
                      className="uppercase tracking-[2px] text-[#102133]/55 font-bold mb-1"
                      style={{ ...mono, fontSize: '10px' }}
                    >
                      Starting At
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-[#1F6FEB] leading-none tracking-tight mb-1">
                      $1,500
                    </p>
                    <p className="text-[#102133]/45 italic" style={{ ...mono, fontSize: '11px' }}>
                      fixed quote
                    </p>
                  </div>
                  <Link
                    to={intakeLink('compliance-readiness-visit')}
                    onClick={() => {
                      fireServicesCtaClick('Schedule a Visit', intakeLink('compliance-readiness-visit'));
                      trackServiceBooking && trackServiceBooking('Compliance Readiness Visit');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-6 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1F6FEB]/20"
                    data-testid="svc-card-compliance-readiness-cta"
                  >
                    Schedule a Visit
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. STANDALONE SERVICES ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-standalone">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Standalone Services
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-3 max-w-3xl">
              Targeted engagements when you need a specific outcome.
            </h2>
            <p className="text-base md:text-lg text-[#102133]/70 leading-relaxed mb-12 max-w-3xl">
              For operations that already know which side they need reviewed — the floor, the files, or a specific incident.
            </p>
          </Reveal>

          <div className="space-y-6">
            {STANDALONE.map((s) => (
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
                    onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
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

      {/* ═══ 7. OSHA-READY CONTROL SYSTEM — Premium dedicated section ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#0B1F33' }} data-testid="services-control-system">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-14 items-start">
            <Reveal>
              <p
                className="uppercase tracking-[3px] text-[#D4A93E] mb-4 font-bold"
                style={{ ...mono, fontSize: '11px' }}
                data-testid="control-system-kicker"
              >
                Premium Engagement · Long-Term System
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5" data-testid="control-system-headline">
                GigLine OSHA-Ready Control System
              </h2>
              <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-6">
                The buildout. GigLine constructs the complete physical and digital safety infrastructure your operation needs to pass any OSHA inspection, customer audit, or insurance review — and hands it back to your team with a system they can actually maintain.
              </p>
              <p className="text-base text-[#CBD5E1]/85 leading-relaxed mb-6">
                Not a binder of templates. A working command system organized the way an inspector reads it, with corrective action tracking your supervisors can update on a tablet from the floor.
              </p>

              <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p
                  className="uppercase tracking-[2px] text-[#D4A93E] font-bold mb-2"
                  style={{ ...mono, fontSize: '10px' }}
                >
                  Starting At
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white leading-none tracking-tight mb-2">
                  $4,500
                </p>
                <p className="text-[#CBD5E1]/65 italic" style={{ ...mono, fontSize: '11px' }}>
                  fixed quote · scoped after site assessment
                </p>
              </div>

              <Link
                to={intakeLink('osha-ready-control-system')}
                onClick={() => {
                  fireServicesCtaClick('Request Buildout', intakeLink('osha-ready-control-system'));
                  trackServiceBooking && trackServiceBooking('GigLine OSHA-Ready Control System');
                }}
                className="inline-flex items-center gap-2 bg-[#D4A93E] hover:bg-[#B58F2E] text-[#0B1F33] font-bold px-7 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#D4A93E]/25"
                data-testid="control-system-cta"
              >
                Request Buildout
                <ArrowRight size={18} />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div
                className="rounded-xl p-7 md:p-8"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <p
                  className="uppercase tracking-[2px] text-[#D4A93E] font-bold mb-5"
                  style={{ ...mono, fontSize: '10.5px' }}
                >
                  What the Buildout Includes
                </p>

                <div className="space-y-5">
                  <div>
                    <p className="text-[#CBD5E1] font-bold mb-1.5 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#D4A93E]" />
                      Four-Binder Physical Command System
                    </p>
                    <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                      Hazard programs · Training records · Inspection & maintenance logs · Incident & corrective action.
                    </p>
                  </div>

                  <div>
                    <p className="text-[#CBD5E1] font-bold mb-1.5 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#D4A93E]" />
                      Digital Folder Architecture
                    </p>
                    <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                      Master document index mirrored to your cloud drive. Naming conventions, version control, and supervisor access permissions configured.
                    </p>
                  </div>

                  <div>
                    <p className="text-[#CBD5E1] font-bold mb-1.5 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#D4A93E]" />
                      Training Matrix + SDS Organization
                    </p>
                    <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                      Employee training matrix by role. SDS inventory current and indexed. Annual refresher calendar built in.
                    </p>
                  </div>

                  <div>
                    <p className="text-[#CBD5E1] font-bold mb-1.5 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#D4A93E]" />
                      Corrective Action Tracker
                    </p>
                    <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                      Live status of every open finding — assigned, dated, and closeable by supervisors. Mirrors what an OSHA CO expects to see during a follow-up.
                    </p>
                  </div>

                  <div>
                    <p className="text-[#CBD5E1] font-bold mb-1.5 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#D4A93E]" />
                      90-Day Maintenance Calendar + Supervisor Walkthrough
                    </p>
                    <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                      GigLine walks the supervisor team through the system at handoff. Calendar-based reminders for the first 90 days so nothing decays.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 8. QUARTERLY + ANNUAL SUPPORT — natural next step after Control System ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-recurring">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              The Natural Next Step
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-3 max-w-3xl">
              Once the system is built, keep it current.
            </h2>
            <p className="text-base md:text-lg text-[#102133]/70 leading-relaxed mb-12 max-w-3xl">
              The Control System is the foundation. Quarterly and Annual support are how operations keep that foundation alive — without hiring a full-time safety manager.
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
                    onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
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

      {/* ═══ 9. THE GIGLINE READINESS PATH ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-readiness-path">
        <div className="container max-w-5xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              The GigLine Readiness Path
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-3 max-w-3xl">
              A clear sequence from first call to ongoing accountability.
            </h2>
            <p className="text-base md:text-lg text-[#102133]/70 leading-relaxed mb-10 max-w-3xl">
              Most clients enter at one of five stages. GigLine will tell you exactly where you should start before you schedule anything.
            </p>
          </Reveal>

          {/* Desktop table */}
          <Reveal>
            <div
              className="hidden md:block rounded-xl overflow-hidden bg-white"
              style={{ border: '1px solid rgba(16,33,51,0.10)', boxShadow: '0 6px 14px rgba(16,33,51,0.04)' }}
              data-testid="readiness-path-table"
            >
              <div
                className="grid grid-cols-[1fr_1.4fr_1.4fr] px-6 py-4 uppercase tracking-[2px] font-bold text-[#102133]/65"
                style={{ ...mono, fontSize: '11px', backgroundColor: '#F7F9FC', borderBottom: '1px solid rgba(16,33,51,0.10)' }}
              >
                <div>Stage</div>
                <div>What You Need</div>
                <div>GigLine Offer</div>
              </div>
              {READINESS_PATH.map((row, i) => (
                <div
                  key={row.stage}
                  className="grid grid-cols-[1fr_1.4fr_1.4fr] px-6 py-5 items-center"
                  style={{ borderBottom: i < READINESS_PATH.length - 1 ? '1px solid rgba(16,33,51,0.08)' : 'none' }}
                  data-testid={`readiness-path-row-${i + 1}`}
                >
                  <div className="font-bold text-[#102133]">{row.stage}</div>
                  <div className="text-[#102133]/80 italic">&ldquo;{row.need}&rdquo;</div>
                  <div>
                    <Link
                      to={row.link}
                      onClick={() => fireServicesCtaClick(`Readiness Path · ${row.stage}`, row.link)}
                      className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#1558C0] font-semibold"
                      data-testid={`readiness-path-link-${i + 1}`}
                    >
                      {row.offer}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3" data-testid="readiness-path-mobile">
            {READINESS_PATH.map((row, i) => (
              <Reveal key={row.stage}>
                <div
                  className="bg-white rounded-lg p-5"
                  style={{ border: '1px solid rgba(16,33,51,0.10)' }}
                  data-testid={`readiness-path-mobile-row-${i + 1}`}
                >
                  <p
                    className="uppercase tracking-[2px] text-[#1F6FEB] font-bold mb-2"
                    style={{ ...mono, fontSize: '10px' }}
                  >
                    Stage {i + 1} · {row.stage}
                  </p>
                  <p className="text-[#102133]/80 italic mb-3">&ldquo;{row.need}&rdquo;</p>
                  <Link
                    to={row.link}
                    onClick={() => fireServicesCtaClick(`Readiness Path · ${row.stage}`, row.link)}
                    className="inline-flex items-center gap-2 text-[#1F6FEB] font-semibold"
                  >
                    {row.offer}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p
              className="text-base md:text-lg text-[#102133]/85 leading-relaxed text-center mt-10 max-w-3xl mx-auto"
              data-testid="readiness-path-footnote"
            >
              Most clients start with the <strong>Compliance Readiness Visit</strong>. GigLine will tell you exactly where to start before you schedule anything &mdash; call or text{' '}
              <a
                href="tel:+13363298899"
                onClick={() => trackPhoneClick && trackPhoneClick('readiness-path-footnote')}
                className="text-[#1F6FEB] hover:text-[#1558C0] font-bold underline"
                data-testid="readiness-path-phone"
              >
                (336) 329-8899
              </a>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 10. SAMPLE REPORT SECTION ═══ */}
      <SampleReportSection />

      {/* ═══ 11. CASE STUDY ═══ */}
      <CaseStudyTeaser source="services" />

      {/* ═══ 12. FOUNDER (compact, links to /about) ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#0B1F33' }} data-testid="services-founder">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start">
            <div className="w-44 md:w-52 flex-shrink-0">
              <Reveal>
                <img
                  src="/vince-portrait.jpg"
                  alt="Vince Lawrence — Founder, GigLine Safety & Compliance"
                  className="w-full rounded"
                  data-testid="services-founder-photo"
                />
              </Reveal>
            </div>
            <div className="flex-grow text-center md:text-left">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#CBD5E1] mb-3"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  About the Founder
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4" data-testid="services-founder-headline">
                  Built by someone who&apos;s worked the floor.
                </h2>
                <p className="text-base md:text-lg text-[#F8FAFC] leading-relaxed mb-3 max-w-2xl">
                  Vince Lawrence is a safety consultant based in Kernersville, NC. OSHA 30-Hour Certified. 25+ years in manufacturing, fleet, and warehouse safety operations. U.S. Navy veteran.
                </p>
                <p className="text-base text-[#CBD5E1] leading-relaxed mb-5 max-w-2xl">
                  GigLine is a private engagement. Nothing leaves your facility except the report I hand you.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-white font-bold underline decoration-[#1F6FEB]/40 hover:decoration-white"
                  data-testid="services-founder-about-link"
                >
                  Read the full bio &rarr;
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 13. FAQ ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-faq">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Questions Before You Schedule
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-10 max-w-2xl">
              Straight answers about how the services work.
            </h2>
          </Reveal>

          <div className="space-y-5">
            {SERVICES_FAQ.map((item, i) => (
              <Reveal key={i}>
                <details
                  className="group bg-white rounded-lg overflow-hidden"
                  style={{ border: '1px solid rgba(16,33,51,0.10)' }}
                  data-testid={`services-faq-${i + 1}`}
                >
                  <summary
                    className="cursor-pointer px-6 py-5 flex items-center justify-between gap-4 list-none"
                  >
                    <span className="text-base md:text-lg font-bold text-[#102133]">{item.q}</span>
                    <span className="flex-shrink-0 text-[#1F6FEB] text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 -mt-1 text-base text-[#102133]/80 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-base text-[#102133]/70 leading-relaxed text-center mt-10">
              Want more answers?{' '}
              <Link to="/faq" className="text-[#1F6FEB] hover:text-[#1558C0] underline font-semibold">
                Read the full FAQ &rarr;
              </Link>
            </p>
          </Reveal>

          {/* Pricing reference block */}
          <div className="mt-16" data-testid="services-pricing-reference">
            <Reveal>
              <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold text-center" style={{ ...mono, fontSize: '11px' }}>
                Pricing Reference
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-[#102133] mb-3 text-center max-w-2xl mx-auto">
                Current starting prices, plainly.
              </h3>
              <p className="text-sm text-[#102133]/65 italic text-center mb-8 max-w-xl mx-auto">
                Every engagement receives a fixed written quote before scheduling. These are starting prices for typical scope.
              </p>
              <div
                className="rounded-xl bg-white overflow-hidden"
                style={{ border: '1px solid rgba(16,33,51,0.10)', boxShadow: '0 6px 14px rgba(16,33,51,0.04)' }}
              >
                {PRICING_REF.map(([name, price], i) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 items-center"
                    style={{ borderBottom: i < PRICING_REF.length - 1 ? '1px solid rgba(16,33,51,0.08)' : 'none' }}
                    data-testid={`pricing-ref-row-${i + 1}`}
                  >
                    <span className="text-base text-[#102133] font-semibold">{name}</span>
                    <span className="text-base font-bold text-[#1F6FEB] whitespace-nowrap" style={mono}>{price}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 14. FINAL CTA — tap-to-call ═══ */}
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
            onClick={() => trackPhoneClick && trackPhoneClick('services-bottom-cta')}
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
