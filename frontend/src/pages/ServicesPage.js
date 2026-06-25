import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Factory, Truck, Warehouse, HardHat, ShieldCheck, Zap, FileText, Users, Wrench, BookOpen, CheckCircle2 } from 'lucide-react';
import { trackServiceBooking, trackPhoneClick, trackEvent } from '../utils/analytics';
import SEO from '../components/SEO';
import CaseStudyTeaser from '../components/CaseStudyTeaser';
import SampleReportSection from '../components/SampleReportSection';

/* ═══ GL-WEB-008 — Staged content update for OSHA Documentation Readiness Review ═══
   Triggered by GL-SPEC-APP-002 (Document Review Module — 148 element-level checks).
   When `REACT_APP_GL_WEB_008_ENABLED` is "true", the services page swaps in:
     • Description: two-layer (53-item + element-by-element) framing
     • Price: $750 → $1,200 (4 places — card, Readiness Path link, Pricing Reference row, FAQ)
     • Meta description: adds "verify documentation compliance element by element"
   Flag stays false until Vince confirms conditions 1–5 in Section 5 of GL-WEB-008.
*/
const GL_WEB_008 = process.env.REACT_APP_GL_WEB_008_ENABLED === 'true';
const DOC_REVIEW_DESCRIPTION = 'A structured review of your safety documentation across 53 required items in seven OSHA categories. Layer one checks whether required programs exist. Layer two checks whether each document contains what it is legally required to contain \u2014 element by element, standard by standard. You receive a single compliance percentage score and a prioritized gap list. Fixed quote. Private engagement.';
const DOC_REVIEW_PRICE = 'From $1,300';
const DOC_REVIEW_PRICING_REF_PRICE = 'Starting at $1,300';
const DOC_REVIEW_PATH_OFFER = 'OSHA Documentation Readiness Review \u2014 from $1,300';
const SERVICES_META_DESCRIPTION = 'OSHA-readiness support for small industrial operations. GigLine helps manufacturers, warehouses, contractors, and fleet operations identify visible hazards, verify documentation compliance element by element, and resolve inspection-readiness issues before they become citations. Fixed pricing. No retainer.';

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
    desc: 'Powered industrial trucks, racking systems, dock operations — facilities where one untrained operator becomes a $16,550 finding.',
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
    eyebrow: 'Safety Walkthrough Report',
    title: 'Safety Walkthrough Report',
    headline: 'The first step when you need exposure identified quickly.',
    price: 'From $1,200',
    body: 'An on-site walkthrough focused purely on physical hazards. You get a photo-documented report and a prioritized fix list in 48 hours. No retainer. No follow-up obligation.',
    listLabel: "What's Included",
    bgColor: '#ffffff',
    whatsIncluded: [
      'On-site walkthrough (1\u20133 hours)',
      'Photo-documented hazard findings',
      'CFR citations + 2026 penalty exposure per finding',
      'Top 10 priority findings \u2014 RED / AMBER / GREEN, CFR citation + corrective action for each',
      'Delivered within 24\u201348 hours',
      'Fixed quote before scheduling',
    ],
    best: 'Operations that want to know where they stand on the floor before OSHA, an insurer, or a customer auditor shows up.',
    cta: 'Request a Walkthrough',
    intakeService: 'safety-walkthrough-report',
    detailsHref: '/services/safety-walkthrough',
    testid: 'svc-standalone-walkthrough',
    anchor: 'walkthrough',
  },
  {
    eyebrow: 'OSHA Documentation Readiness Review',
    title: 'OSHA Documentation Readiness Review',
    headline: 'Know exactly what your files say before an inspector does.',
    price: 'From $1,300',
    body: 'A structured review of your written programs, training records, OSHA logs, and SDS compliance. You get a compliance percentage score and a prioritized corrective action sequence \u2014 not a generic checklist.',
    listLabel: "What's Reviewed",
    bgColor: '#EFEEE8',
    whatsIncluded: [
      'Written safety programs (LOTO, HazCom, PPE, EAP)',
      'Training records by employee and role',
      'OSHA 300/300A/301 logs',
      'Inspection and maintenance records',
      'SDS inventory and compliance',
      '53-item checklist across 7 OSHA categories',
      'Compliance percentage score + priority corrective action sequence',
    ],
    best: 'Operations preparing for an audit, insurance review, or customer pre-qualification who need to know specifically what documentation gaps exist.',
    cta: 'Request a Documentation Review',
    intakeService: 'documentation-readiness-review',
    detailsHref: '/services/documentation-readiness-review',
    testid: 'svc-standalone-doc-review',
    anchor: 'docs-review',
  },
  {
    eyebrow: 'Incident Review & Corrective Action Support',
    title: 'Incident Review & Corrective Action Support',
    headline: 'Call before you file anything or speak to anyone outside the operation.',
    price: 'From $1,500',
    body: 'Post-injury or post-near-miss response. Root cause analysis, OSHA recordability determination, and a corrective action plan with documented closure \u2014 reviewed before paperwork or outside conversations begin.',
    listLabel: "What's Included",
    bgColor: '#FFF8F0',
    whatsIncluded: [
      'Root cause analysis on-site',
      'OSHA recordability determination',
      'OSHA 301 completion',
      'Corrective action plan with documented closure',
      'Same-week response',
      'Private engagement',
    ],
    best: 'Operations responding to a recordable injury, near-miss, or OSHA inquiry that need expert review before paperwork is filed or recorded statements are given.',
    cta: 'Request Incident Support',
    intakeService: 'incident-review',
    detailsHref: '/services/incident-review',
    testid: 'svc-standalone-incident',
    anchor: 'incident',
    badge: 'Time-Sensitive',
    badgeColor: '#dc2626',
    showPhone: true,
  },
  {
    eyebrow: 'Document Development',
    title: 'Document Development',
    headline: 'When the program is missing, GigLine writes it.',
    price: 'Quote after review',
    body: 'GigLine writes the programs you are missing \u2014 LOTO, HazCom, PPE assessments, Emergency Action Plans, machine-specific procedures. Scoped and quoted after the OSHA Documentation Readiness Review identifies specific gaps.',
    listLabel: "What's Built",
    bgColor: '#f5f4f0',
    whatsIncluded: [
      'LOTO program + machine-specific procedures',
      'HazCom program',
      'PPE hazard assessment',
      'Emergency Action Plan',
      'Single program or full suite \u2014 scoped to your gap list',
      'Quoted after Documentation Readiness Review',
    ],
    floorPricing: [
      ['Single written program', 'From $350'],
      ['LOTO program + up to 5 machine procedures', 'From $650'],
      ['LOTO program + 6\u201315 machine procedures', 'From $1,200'],
      ['Full written program suite (5+ programs)', 'From $2,000'],
    ],
    best: 'Operations whose Documentation Readiness Review surfaced missing or insufficient written programs and need them built to OSHA standard.',
    cta: 'Ask About Document Development',
    intakeService: 'document-development',
    detailsHref: '/services/document-development',
    testid: 'svc-standalone-doc-dev',
  },
];

/* ═══ Recurring (Quarterly + Annual) ═══ */
const RECURRING = [
  {
    title: 'Quarterly Compliance Maintenance',
    eyebrow: 'Quarterly Compliance Maintenance',
    headline: 'Keep the system alive between annual walkthroughs.',
    price: '$950/quarter',
    priceFull: 'From $950/quarter',
    body: 'Documentation review, training record audit, SDS inventory check, corrective action tracker review, and a brief site visit if needed.',
    best: 'Operations that want the system kept alive after the Control System is built.',
    cta: 'Ask About Quarterly Maintenance',
    intakeService: 'quarterly-compliance-maintenance',
    detailsHref: '/services/quarterly-compliance-maintenance',
    testid: 'svc-rec-quarterly',
    anchor: 'quarterly',
  },
  {
    title: 'Annual Compliance Control Partner',
    eyebrow: 'Annual Compliance Control Partner',
    headline: 'When OSHA shows up, when someone gets hurt, when your customer asks for your safety program \u2014 you need someone who already knows your operation.',
    price: '$12,000/year',
    priceSecondary: '$1,000/month equivalent',
    body: 'Two full walkthroughs per year. Quarterly documentation reviews. Training record maintenance. OSHA 300A posting reminders. Pre-inspection readiness review. Management safety review. GigLine becomes your ongoing compliance resource \u2014 available when something happens and proactive between visits.',
    includes: [
      { label: 'Two Safety Walkthroughs per year', detail: 'on-site, photographed, reported within 48 hours', value: 'standalone value: $2,400' },
      { label: 'Four Documentation Reviews per year', detail: 'written programs, training records, OSHA 300 logs, HazCom binder', value: 'standalone value: $5,200' },
      { label: 'Four Quarterly Review Calls', detail: '30 minutes each, reviewing findings, corrections, and upcoming compliance calendar items' },
      { label: 'OSHA 300A posting reminders', detail: 'flagged in advance of the February 1 posting requirement' },
      { label: 'Pre-inspection readiness review', detail: "if OSHA shows up or a complaint is filed, you\u2019re not starting from zero" },
      { label: 'On-call access between visits', detail: "direct line to Vince for questions, incidents, and situations that can\u2019t wait for a scheduled visit" },
      { label: 'Annual management safety review', detail: "a written summary of the year\u2019s findings, corrections completed, and open items for the coming year" },
    ],
    valueAnchor: {
      standaloneLabel: 'Standalone value of scheduled services',
      standalone: '$7,600+',
      partnerLabel: 'Annual Partner rate',
      partner: '$12,000',
      monthlyLabel: 'Monthly equivalent',
      monthly: '$1,000',
    },
    closingLine: 'This is not a retainer that sits in a drawer. It is an active compliance relationship \u2014 scheduled, documented, and available when you need it.',
    best: 'Operations that want a consultant they can call, not just a one-time report.',
    cta: 'Ask About Annual Partnership',
    intakeService: 'annual-compliance-partner',
    detailsHref: '/services/annual-compliance-partner',
    testid: 'svc-rec-annual',
    anchor: 'annual',
    badge: 'Highest-Value Engagement',
  },
];

/* ═══ Readiness Path table ═══ */
const READINESS_PATH = [
  { stage: 'Find the issues', need: 'What would OSHA see on our floor?', offer: 'Safety Walkthrough', priceFrom: '$1,200', link: intakeLink('safety-walkthrough-report') },
  { stage: 'Check the files', need: 'Are our documents inspection-ready?', offer: 'OSHA Documentation Readiness Review', priceFrom: '$1,300', link: intakeLink('documentation-readiness-review') },
  { stage: 'Review both', need: 'We need the floor and files checked.', offer: 'Compliance Readiness Visit', priceFrom: '$2,000', link: intakeLink('compliance-readiness-visit') },
  { stage: 'Build the system', need: 'We need this organized and defensible.', offer: 'OSHA-Ready Control System', priceFrom: '$4,500', link: intakeLink('osha-ready-control-system') },
  { stage: 'Keep it current', need: 'We need ongoing accountability.', offer: 'Quarterly / Annual Partner', priceFrom: '$950/qtr', link: intakeLink('annual-compliance-partner') },
];

/* ═══ Pricing reference block ═══ */
const PRICING_REF = [
  ['Safety Walkthrough', 'Starting at $1,200'],
  ['OSHA Documentation Readiness Review', DOC_REVIEW_PRICING_REF_PRICE],
  ['Compliance Readiness Visit', 'Starting at $2,000'],
  ['Incident Review & Corrective Action', 'Starting at $1,500'],
  ['OSHA-Ready Control System', 'Starting at $4,500'],
  ['Quarterly Compliance Maintenance', 'Starting at $950/quarter'],
  ['Annual Compliance Control Partner', '$12,000/year'],
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
        title="OSHA Compliance Services — Walkthroughs & Documentation Reviews | GigLine"
        description={SERVICES_META_DESCRIPTION}
        canonical="/services"
      />

      {/* ═══ 1. HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0d1b2a' }}
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
              <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-5 font-bold" style={{ ...mono, fontSize: '11px' }}>
                Services · GigLine Safety & Compliance
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-5 max-w-2xl"
                data-testid="services-headline"
              >
                On-Site Safety Support for NC Manufacturers &amp; Warehouses
              </h1>
              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl"
                data-testid="services-sub"
              >
                Every engagement is scoped to your operation, priced before scheduling, and delivered with a written report. No retainer. No ongoing obligation unless you want one.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ JUMP NAV (sticky pill strip) ═══ */}
      <nav
        className="sticky top-[80px] md:top-[112px] lg:top-[128px] z-20 bg-white/95 backdrop-blur-sm"
        style={{ borderBottom: '1px solid #dde3ea' }}
        aria-label="Jump to service"
        data-testid="services-jump-nav"
      >
        <div className="container max-w-6xl py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto whitespace-nowrap text-[13px] md:text-sm" style={{ scrollbarWidth: 'thin' }}>
            <span className="uppercase font-bold flex-shrink-0 pr-2 hidden md:inline" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.18em', color: '#0d1b2a' }}>Jump to:</span>
            {[
              { label: 'Safety Walkthrough', href: '#walkthrough' },
              { label: 'Documentation Review', href: '#docs-review' },
              { label: 'Compliance Readiness Visit', href: '#crv' },
              { label: 'Incident Review', href: '#incident' },
              { label: 'OSHA-Ready Control System', href: '#control-system' },
              { label: 'Annual Partner', href: '#annual' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full border transition-colors hover:bg-[#1a6fc4] hover:text-white hover:border-[#1a6fc4]"
                style={{ borderColor: 'rgba(16,33,51,0.18)', color: '#0d1b2a' }}
                data-testid={`jump-nav-${l.href.replace('#','')}`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ 2. AUTHORITY STATEMENT ═══ */}
      <section className="py-10 md:py-14 bg-white" data-testid="services-authority-band">
        <div className="container max-w-4xl text-center">
          <Reveal>
            <p
              className="text-lg md:text-xl text-[#0d1b2a] leading-relaxed italic font-medium"
              data-testid="services-authority-line"
            >
              Built for small operations that need practical safety support without hiring a full-time safety manager.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3. 90-SECOND SAFETY CHECK — intake door, reduced visual weight ═══ */}
      <section
        className="py-7 md:py-8 border-t border-b"
        style={{ backgroundColor: '#F7F1E0', borderColor: 'rgba(212,169,62,0.35)' }}
        data-testid="services-safety-check-band"
      >
        <div className="container max-w-3xl text-center">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#0d1b2a]/55 mb-3 font-bold"
              style={{ ...mono, fontSize: '11px' }}
              data-testid="services-safety-check-kicker"
            >
              Not sure where to start?
            </p>
            <p className="text-base md:text-lg text-[#0d1b2a] leading-relaxed mb-6 max-w-2xl mx-auto" data-testid="services-safety-check-intro">
              Not sure where you stand? Take the free 90-Second Safety Check — six yes-or-no questions, immediate risk score, no email required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/safety-check"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white text-[#0d1b2a] font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                data-testid="services-safety-check-link"
              >
                Take the Safety Check
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-sm text-[#0d1b2a]/70 mt-5 italic" data-testid="services-safety-check-followup">
              Ready for a professional review?{' '}
              <Link
                to={intakeLink('compliance-readiness-visit')}
                className="text-[#1a6fc4] hover:text-[#1560ae] underline font-semibold"
                data-testid="services-safety-check-followup-link"
              >
                Schedule a Compliance Readiness Visit &rarr;
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 4. WHO GIGLINE HELPS ═══ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#f5f4f0' }} data-testid="services-who-helps">
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-4"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              Who GigLine Helps
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0d1b2a] leading-[1.1] mb-4 max-w-4xl tracking-tight">
              Built for the operations OSHA inspects the most.
            </h2>
            <div className="mb-8" style={{ width: '56px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />
            <p className="text-base md:text-lg text-[#0d1b2a]/65 leading-[1.85] mb-16 max-w-3xl">
              GigLine focuses on the four operation types most likely to receive an OSHA inspection,
              <br className="hidden md:block" />
              an insurance review, or a customer-audit request in the Piedmont Triad.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_HELPS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div
                  className="h-full bg-white rounded-2xl p-8 md:p-9 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-12px_rgba(13,27,42,0.12)]"
                  style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)', minHeight: '460px' }}
                  data-testid={`who-helps-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <div
                    className="flex items-center justify-center mb-8"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(26,111,196,0.12)',
                    }}
                  >
                    <Icon size={24} strokeWidth={1.9} className="text-[#1a6fc4]" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0d1b2a] mb-5 leading-tight">{title}</h3>
                  <p className="text-[14.5px] text-[#0d1b2a]/65 leading-[1.85]">{desc}</p>
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
              data-testid="svc-card-compliance-readiness"
              id="crv"
              style={{
                border: '2px solid #1a6fc4',
                boxShadow: '0 8px 24px -8px rgba(31,111,235,0.15)',
                scrollMarginTop: '128px',
              }}
            >
              {/* Recommended Starting Point badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-lg whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #1a6fc4 0%, #1560ae 100%)',
                  boxShadow: '0 8px 20px -4px rgba(31,111,235,0.55), 0 0 0 4px #FFFFFF',
                }}
                data-testid="readiness-visit-badge"
              >
                <span
                  className="uppercase tracking-[2px] font-bold text-white"
                  style={{ ...mono, fontSize: '10.5px' }}
                >
                  ★ Most Requested
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start mt-4">
                <div>
                  <p
                    className="uppercase tracking-[2.5px] text-[#1a6fc4] font-bold mb-3"
                    style={{ ...mono, fontSize: '10.5px' }}
                  >
                    Flagship Engagement
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d1b2a] leading-tight mb-4">
                    Compliance Readiness Visit
                  </h2>
                  <p className="text-base md:text-lg text-[#0d1b2a]/80 leading-relaxed mb-6 max-w-2xl">
                    The floor and the files reviewed in a single visit. Most operations don&apos;t need a separate walkthrough and documentation review — they need both, scored together, with a single readiness report. This is that engagement.
                  </p>

                  <div
                    className="rounded-2xl p-7 md:p-9 mb-6"
                    style={{ backgroundColor: '#f5f4f0' }}
                    data-testid="crv-whats-included"
                  >
                    <p
                      className="uppercase font-bold mb-6"
                      style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#5B6B7A' }}
                    >
                      What&apos;s Included
                    </p>
                    <ul className="space-y-4">
                      {[
                        'Full physical hazard walkthrough (2\u20134 hours)',
                        'Photo-documented findings with CFR citations',
                        'Structured documentation review (53-item checklist)',
                        'Single compliance percentage score \u2014 floor and files combined',
                        '18-page CFR-cited field audit report within 48 hours',
                        'Compliance score with prioritized finding categories',
                        '90-day remediation tracker \u2014 pre-populated, ready to assign',
                        "'What to Say If OSHA Calls' guidance sheet",
                        '30-day check-in call included',
                        'Fixed quote \u00b7 Private engagement',
                      ].map((line, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-[#0d1b2a]/85 text-[15.5px] leading-[1.55]">
                          <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-[#1a6fc4]" strokeWidth={2} />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p
                    className="italic text-[#0d1b2a]/65 text-sm md:text-[15px] leading-relaxed mb-6 max-w-2xl"
                    data-testid="crv-anchor-line"
                  >
                    Booked separately, the Safety Walkthrough and Documentation Review start at $2,500. The Compliance Readiness Visit covers both in a single visit &mdash; from $2,000.
                  </p>
                </div>

                <div className="md:w-64 flex-shrink-0">
                  <div
                    className="rounded-xl px-5 py-6 mb-4 text-center"
                    style={{ border: '1px solid #dde3ea', backgroundColor: '#FBFCFD' }}
                  >
                    <p
                      className="uppercase tracking-[2px] text-[#0d1b2a]/55 font-bold mb-1"
                      style={{ ...mono, fontSize: '10px' }}
                    >
                      Starting At
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-[#1a6fc4] leading-none tracking-tight mb-1" style={mono} data-testid="crv-price-large">
                      $2,000
                    </p>
                    <p className="text-[#0d1b2a]/45 italic" style={{ ...mono, fontSize: '11px' }}>
                      fixed quote
                    </p>
                  </div>
                  <Link
                    to={intakeLink('compliance-readiness-visit')}
                    onClick={() => {
                      fireServicesCtaClick('Schedule a Visit', intakeLink('compliance-readiness-visit'));
                      trackServiceBooking && trackServiceBooking('Compliance Readiness Visit');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-6 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1a6fc4]/20 mb-2"
                    data-testid="svc-card-compliance-readiness-cta"
                  >
                    Schedule a Visit
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/services/compliance-readiness-visit"
                    className="w-full inline-flex items-center justify-center gap-2 text-[#1a6fc4] hover:text-[#1560ae] font-bold text-[14px] py-2 mb-4 transition-colors"
                    data-testid="svc-card-compliance-readiness-learn-more"
                  >
                    See Full Page
                    <ArrowRight size={15} />
                  </Link>

                  {/* Ops Manager Trust Block */}
                  <div
                    className="rounded-xl p-5"
                    style={{ background: '#0d1b2a', border: '1px solid rgba(212,169,62,0.25)' }}
                    data-testid="crv-ops-trust-block"
                  >
                    <p
                      className="uppercase font-bold mb-3"
                      style={{ ...mono, fontSize: '9.5px', letterSpacing: '0.18em', color: '#D4A93E' }}
                    >
                      Built for Ops Leaders
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        'Fixed quote · No retainer',
                        'Navy Veteran owned',
                        'Kernersville, NC based',
                        '24–48 hr written report',
                      ].map((line) => (
                        <li key={line} className="flex items-start gap-2 text-[12.5px] text-white/80 leading-snug">
                          <Check size={13} className="flex-shrink-0 mt-0.5 text-[#D4A93E]" strokeWidth={3} />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. STANDALONE SERVICES — Intro band ═══ */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16" style={{ backgroundColor: '#f5f4f0' }} data-testid="services-standalone">
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-4"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              Standalone Services
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0d1b2a] leading-[1.1] mb-4 max-w-4xl tracking-tight">
              Targeted engagements when you need a specific outcome.
            </h2>
            <div className="mb-8" style={{ width: '56px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />
            <p className="text-base md:text-lg text-[#0d1b2a]/65 leading-[1.85] max-w-3xl">
              For operations that already know which side they need reviewed &mdash; the floor, the files, or a specific incident. Each engagement is scoped, quoted, and delivered independently.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Per-service bands — each with its own background color for visual separation */}
      {STANDALONE.map((s, idx) => {
        const cardOnLeft = idx % 2 === 1;
        const listLabel = s.listLabel || "What's Included";
        return (
          <section
            key={s.testid}
            id={s.anchor}
            className="py-16 md:py-20 scroll-mt-32"
            style={{ backgroundColor: s.bgColor || '#f5f4f0' }}
            data-testid={`${s.testid}-section`}
          >
            <div className="container max-w-6xl">
              <Reveal>
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                  data-testid={s.testid}
                >
                  {/* COPY column */}
                  <div className={cardOnLeft ? 'lg:order-2' : 'lg:order-1'}>
                    {s.badge && (
                      <span
                        className="inline-block uppercase font-bold mb-4"
                        style={{
                          ...mono,
                          fontSize: '10px',
                          letterSpacing: '0.14em',
                          color: s.badgeColor || '#1a6fc4',
                          border: `1px solid ${s.badgeColor || '#1a6fc4'}55`,
                          padding: '4px 10px',
                          borderRadius: '999px',
                        }}
                        data-testid={`${s.testid}-badge`}
                      >
                        {s.badge}
                      </span>
                    )}
                    <p
                      className="uppercase font-bold mb-4"
                      style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
                      data-testid={`${s.testid}-eyebrow`}
                    >
                      {s.eyebrow}
                    </p>
                    <h3 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0d1b2a] leading-[1.1] mb-5 tracking-tight">
                      {s.headline}
                    </h3>
                    <div className="mb-8" style={{ width: '56px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />
                    <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-[1.85] mb-8">
                      {s.body}
                    </p>

                    {s.floorPricing && (
                      <div className="mb-8 p-5 rounded-xl bg-white" style={{ border: '1px solid rgba(212,169,62,0.35)' }}>
                        <p className="text-xs uppercase tracking-wider text-[#0d1b2a]/65 mb-2.5 font-bold" style={{ ...mono, letterSpacing: '0.2em' }}>
                          Floor Pricing Reference
                        </p>
                        <ul className="space-y-2">
                          {s.floorPricing.map(([item, price], i) => (
                            <li key={i} className="flex justify-between gap-4 text-[14px] text-[#0d1b2a]/85">
                              <span>{item}</span>
                              <span className="font-bold text-[#0d1b2a] whitespace-nowrap" style={mono}>{price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.best && (
                      <div className="mb-8" data-testid={`${s.testid}-best`}>
                        <p className="font-bold text-[#0d1b2a] mb-2 text-[15.5px]">Best for:</p>
                        <p className="text-[15px] text-[#0d1b2a]/70 leading-[1.75]">{s.best}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Link
                        to={intakeLink(s.intakeService)}
                        onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
                        className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors shadow-md shadow-[#1a6fc4]/15"
                        data-testid={`${s.testid}-cta`}
                      >
                        {s.cta}
                      </Link>
                      <span className="font-bold text-[#0d1b2a] text-[15.5px]" style={mono} data-testid={`${s.testid}-price`}>
                        {s.price}
                      </span>
                      {s.detailsHref && (
                        <Link
                          to={s.detailsHref}
                          className="inline-flex items-center gap-1 text-[#1a6fc4] hover:text-[#1560ae] font-bold text-[14.5px] transition-colors"
                          data-testid={`${s.testid}-details`}
                        >
                          See Full Details
                          <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                    {s.showPhone && (
                      <a
                        href="tel:3363298899"
                        className="inline-flex items-center gap-2 mt-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors"
                        data-testid={`${s.testid}-phone-cta`}
                      >
                        <Phone size={15} />
                        Call Now &mdash; (336) 329-8899
                      </a>
                    )}
                  </div>

                  {/* WHAT'S INCLUDED CARD column */}
                  <div className={cardOnLeft ? 'lg:order-1' : 'lg:order-2'}>
                    <div
                      className="rounded-2xl bg-white p-8 md:p-10"
                      style={{
                        border: '1px solid #d0d7e0',
                        boxShadow: '0 12px 32px -16px rgba(13,27,42,0.18), 0 2px 6px rgba(13,27,42,0.04)',
                      }}
                      data-testid={`${s.testid}-includes-card`}
                    >
                      <p
                        className="uppercase font-bold mb-7"
                        style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#5B6B7A' }}
                      >
                        {listLabel}
                      </p>
                      <ul className="space-y-5">
                        {s.whatsIncluded.map((line, i) => (
                          <li key={i} className="flex items-start gap-3.5 text-[#0d1b2a]/85 text-[15px] leading-[1.55]">
                            <CheckCircle2 size={19} className="flex-shrink-0 mt-0.5 text-[#1a6fc4]" strokeWidth={2} />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* ═══ 7. OSHA-READY CONTROL SYSTEM — Premium dedicated section ═══ */}
      <section className="py-20 md:py-28 scroll-mt-32" id="control-system" style={{ backgroundColor: '#0d1b2a' }} data-testid="services-control-system">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-14 items-start">
            <Reveal>
              {/* PREMIUM ENGAGEMENT badge */}
              <span
                className="inline-flex items-center gap-2 uppercase font-bold mb-6"
                style={{
                  ...mono,
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  color: '#D4A93E',
                  background: 'rgba(212,169,62,0.10)',
                  border: '1px solid rgba(212,169,62,0.35)',
                  padding: '8px 14px',
                  borderRadius: '4px',
                }}
                data-testid="control-system-premium-badge"
              >
                <Zap size={13} strokeWidth={2.5} />
                Premium Engagement
              </span>

              <p
                className="uppercase font-bold mb-5"
                style={{ ...mono, fontSize: '11px', letterSpacing: '0.18em', color: '#1a6fc4' }}
                data-testid="control-system-kicker"
              >
                OSHA-Ready Control System
              </p>

              <h2
                className="text-4xl md:text-5xl font-extrabold text-white leading-[1.05] mb-5 tracking-tight"
                data-testid="control-system-headline"
              >
                The buildout. Complete physical and digital safety infrastructure.
              </h2>

              {/* Gold accent line */}
              <div className="mb-7" style={{ width: '64px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />

              <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-6">
                GigLine constructs the complete safety infrastructure your operation needs to pass any OSHA inspection, customer audit, or insurance review &mdash; and hands it back to your team with a system they can actually maintain.
              </p>
              <p
                className="text-lg md:text-xl font-semibold text-white leading-snug mb-10"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
                data-testid="control-system-tagline"
              >
                This is not a report. This is the system.
              </p>

              {/* Prominent price block */}
              <div className="mb-8" data-testid="control-system-price-block">
                <p
                  className="uppercase font-bold mb-2"
                  style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)' }}
                >
                  Starting At
                </p>
                <p className="font-extrabold text-white leading-none tracking-tight mb-3" style={{ ...mono, fontSize: 'clamp(56px, 7vw, 88px)' }} data-testid="control-system-price-large">
                  $4,500
                </p>
                <p style={{ ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                  fixed quote &middot; scoped after site assessment
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  to={intakeLink('osha-ready-control-system')}
                  onClick={() => {
                    fireServicesCtaClick('Request Buildout', intakeLink('osha-ready-control-system'));
                    trackServiceBooking && trackServiceBooking('GigLine OSHA-Ready Control System');
                  }}
                  className="inline-flex items-center gap-2 bg-[#D4A93E] hover:bg-[#B58F2E] text-[#0d1b2a] font-bold px-7 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#D4A93E]/25"
                  data-testid="control-system-cta"
                >
                  Request Buildout
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services/osha-ready-control-system"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold px-5 py-4 rounded-lg text-[14px] transition-colors border border-white/20 hover:border-white/40"
                  data-testid="control-system-learn-more"
                >
                  See Full Page
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>

            <div className="space-y-4">
              <Reveal>
                <p
                  className="uppercase font-bold mb-2"
                  style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#D4A93E' }}
                  data-testid="buildout-eyebrow"
                >
                  What the Buildout Includes
                </p>
              </Reveal>
              {[
                {
                  Icon: ShieldCheck,
                  title: 'Four-Binder Physical Command System',
                  body: 'Hazard programs · Training records · Inspection & maintenance logs · Incident & corrective action.',
                },
                {
                  Icon: FileText,
                  title: 'Digital Folder Architecture',
                  body: 'Master document index mirrored to your cloud drive. Naming conventions, version control, and supervisor access permissions configured.',
                },
                {
                  Icon: Users,
                  title: 'Training Matrix + SDS Organization',
                  body: 'Employee training matrix by role. SDS inventory current and indexed. Annual refresher calendar built in.',
                },
                {
                  Icon: Wrench,
                  title: 'Corrective Action Tracker',
                  body: 'Live status of every open finding — assigned, dated, and closeable by supervisors. Mirrors what an OSHA CO expects to see during a follow-up.',
                },
                {
                  Icon: BookOpen,
                  title: '90-Day Maintenance Calendar + Supervisor Walkthrough',
                  body: 'GigLine walks the supervisor team through the system at handoff. Calendar-based reminders for the first 90 days so nothing decays.',
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={140 + i * 90}>
                  <div
                    className="rounded-xl p-6 flex items-start gap-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#D4A93E]/40 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    data-testid={`buildout-include-${i + 1}`}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(212,169,62,0.14)',
                        border: '1px solid rgba(212,169,62,0.30)',
                      }}
                    >
                      <item.Icon size={20} strokeWidth={1.9} className="text-[#D4A93E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold leading-tight mb-2 text-[15.5px] md:text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#CBD5E1]/75 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. QUARTERLY + ANNUAL SUPPORT — natural next step after Control System ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-recurring">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              The Natural Next Step
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d1b2a] mb-3 max-w-3xl">
              Once the system is built, keep it current.
            </h2>
            <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-relaxed mb-12 max-w-3xl">
              The Control System is the foundation. Quarterly and Annual support are how operations keep that foundation alive — without hiring a full-time safety manager.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECURRING.map((s) => {
              const isAnnual = !!s.includes;
              return (
              <Reveal key={s.testid}>
                <div
                  id={s.anchor}
                  className="h-full rounded-xl p-7 md:p-8 flex flex-col scroll-mt-32"
                  style={{
                    background: isAnnual ? '#0d1b2a' : '#ffffff',
                    border: isAnnual ? '1px solid rgba(212,169,62,0.35)' : '1px solid #dde3ea',
                    boxShadow: isAnnual ? '0 8px 24px -8px rgba(13,27,42,0.25)' : '0 1px 0 rgba(13,27,42,0.02)',
                  }}
                  data-testid={s.testid}
                >
                  {s.badge && (
                    <span
                      className="inline-block uppercase font-bold mb-3 self-start"
                      style={{
                        ...mono,
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        color: isAnnual ? '#D4A93E' : '#1a6fc4',
                        background: isAnnual ? 'rgba(212,169,62,0.12)' : 'rgba(31,111,235,0.10)',
                        border: isAnnual ? '1px solid rgba(212,169,62,0.30)' : 'none',
                        padding: '4px 10px',
                        borderRadius: '999px',
                      }}
                      data-testid={`${s.testid}-badge`}
                    >
                      ★ {s.badge}
                    </span>
                  )}
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${isAnnual ? 'text-white' : 'text-[#0d1b2a]'}`}>{s.title}</h3>
                  <p
                    className="font-extrabold leading-none mb-1"
                    style={{ ...mono, fontSize: isAnnual ? 'clamp(34px, 4vw, 42px)' : '20px', color: isAnnual ? '#D4A93E' : '#1a6fc4' }}
                    data-testid={`${s.testid}-price`}
                  >
                    {s.price}
                  </p>
                  {s.priceSecondary && (
                    <p
                      className={`text-sm mb-5 mt-1 ${isAnnual ? 'text-white/55' : 'text-[#0d1b2a]/55'}`}
                      style={mono}
                      data-testid={`${s.testid}-price-secondary`}
                    >
                      {s.priceSecondary}
                    </p>
                  )}
                  {!s.priceSecondary && <div className="mb-4" />}

                  {/* Body — either single paragraph (Quarterly) or multi-paragraph (Annual) */}
                  {s.bodyTagline || s.bodyExtended ? (
                    <div className={`space-y-4 mb-6 text-base leading-relaxed ${isAnnual ? 'text-white/80' : 'text-[#0d1b2a]/85'}`}>
                      <p>{s.body}</p>
                      {s.bodyTagline && (
                        <p className={`font-bold ${isAnnual ? 'text-white' : 'text-[#0d1b2a]'}`}>{s.bodyTagline}</p>
                      )}
                      {s.bodyExtended && <p>{s.bodyExtended}</p>}
                    </div>
                  ) : (
                    <p className="text-base text-[#0d1b2a]/85 leading-relaxed mb-6">{s.body}</p>
                  )}

                  {/* What's Included list (Annual Partner only) */}
                  {s.includes && (
                    <div className="mb-6" data-testid={`${s.testid}-includes`}>
                      <p
                        className="uppercase font-bold mb-3"
                        style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#D4A93E' }}
                      >
                        What&apos;s Included
                      </p>
                      <ul className="space-y-3">
                        {s.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-white/85 leading-snug">
                            <Check size={18} className="flex-shrink-0 mt-0.5 text-[#D4A93E]" strokeWidth={3} />
                            <span>
                              <span className="font-semibold text-white">{item.label}</span>
                              {item.detail && <span className="text-white/70"> &mdash; {item.detail}</span>}
                              {item.value && (
                                <span className="text-[#D4A93E]/85 italic" style={mono}> &nbsp;({item.value})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Value anchor block (Annual Partner only) */}
                  {s.valueAnchor && (
                    <div
                      className="rounded-lg p-5 mb-5"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,169,62,0.18)' }}
                      data-testid={`${s.testid}-value-anchor`}
                    >
                      <div className="flex flex-col gap-2 text-[15px]">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-white/65">{s.valueAnchor.standaloneLabel}</span>
                          <span className="font-bold text-white" style={mono}>{s.valueAnchor.standalone}</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-white/65">{s.valueAnchor.partnerLabel}</span>
                          <span className="font-bold text-[#D4A93E]" style={mono}>{s.valueAnchor.partner}</span>
                        </div>
                        <div
                          className="flex items-baseline justify-between gap-3 pt-2 mt-1"
                          style={{ borderTop: '1px dashed rgba(212,169,62,0.30)' }}
                        >
                          <span className="text-white/65 italic">{s.valueAnchor.monthlyLabel}</span>
                          <span className="font-bold text-white" style={mono}>{s.valueAnchor.monthly}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Closing line (Annual Partner only) */}
                  {s.closingLine && (
                    <p className="text-[15px] text-white/75 leading-relaxed mb-6" data-testid={`${s.testid}-closing`}>
                      {s.closingLine}
                    </p>
                  )}

                  <p
                    className={`text-sm leading-relaxed mb-6 italic flex-grow ${isAnnual ? 'text-white/55' : 'text-[#0d1b2a]/60'}`}
                    style={mono}
                  >
                    Best for: {s.best}
                  </p>
                  <Link
                    to={intakeLink(s.intakeService)}
                    onClick={() => trackServiceBooking && trackServiceBooking(s.title)}
                    className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-lg text-base transition-colors self-start border-2 ${
                      isAnnual
                        ? 'border-[#D4A93E] text-[#D4A93E] hover:bg-[#D4A93E] hover:text-[#0d1b2a]'
                        : 'border-[#1a6fc4] text-[#1a6fc4] hover:bg-[#1a6fc4] hover:text-white'
                    }`}
                    data-testid={`${s.testid}-cta`}
                  >
                    {s.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 9. THE GIGLINE READINESS PATH ═══ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#f5f4f0' }} data-testid="services-readiness-path">
        <div className="container max-w-5xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-4"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              The GigLine Readiness Path
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0d1b2a] leading-[1.1] mb-4 max-w-4xl tracking-tight">
              A clear sequence from first call to ongoing accountability.
            </h2>
            <div className="mb-8" style={{ width: '56px', height: '3px', background: '#D4A93E', borderRadius: '2px' }} />
            <p className="text-base md:text-lg text-[#0d1b2a]/65 leading-[1.85] mb-12 max-w-3xl">
              Most clients enter at one of five stages. GigLine will tell you exactly where you should start before you schedule anything.
            </p>
          </Reveal>

          {/* Desktop table — Manus style */}
          <Reveal>
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
              data-testid="readiness-path-table"
            >
              {/* Dark navy header */}
              <div
                className="grid grid-cols-[140px_1.4fr_1.5fr_140px] px-8 py-6 uppercase font-bold text-white"
                style={{ ...mono, fontSize: '11px', letterSpacing: '0.18em', backgroundColor: '#0d1b2a' }}
              >
                <div>Stage</div>
                <div>What You Need</div>
                <div>GigLine Offer</div>
                <div className="text-right">Starting At</div>
              </div>
              {READINESS_PATH.map((row, i) => (
                <Link
                  key={row.stage}
                  to={row.link}
                  onClick={() => fireServicesCtaClick(`Readiness Path · ${row.stage}`, row.link)}
                  className="grid grid-cols-[140px_1.4fr_1.5fr_140px] px-8 py-7 items-center transition-colors hover:bg-[#FBFCFD]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#F7F6F2' }}
                  data-testid={`readiness-path-row-${i + 1}`}
                >
                  <div
                    className="uppercase font-bold text-[#1a6fc4]"
                    style={{ ...mono, fontSize: '12.5px', letterSpacing: '0.12em' }}
                  >
                    Stage {i + 1}
                  </div>
                  <div className="text-[#0d1b2a]/80 italic text-[15px] leading-snug">
                    &ldquo;{row.need}&rdquo;
                  </div>
                  <div className="font-bold text-[#0d1b2a] text-[15.5px] leading-snug">
                    {row.offer}
                  </div>
                  <div className="text-right">
                    <span className="text-[#0d1b2a]/55 text-[13px] block">from</span>
                    <span className="font-extrabold text-[#0d1b2a] text-[16px]" style={mono}>
                      {row.priceFrom}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3" data-testid="readiness-path-mobile">
            {READINESS_PATH.map((row, i) => (
              <Reveal key={row.stage}>
                <Link
                  to={row.link}
                  onClick={() => fireServicesCtaClick(`Readiness Path · ${row.stage}`, row.link)}
                  className="block bg-white rounded-xl p-5 transition-colors hover:bg-[#FBFCFD]"
                  style={{ border: '1px solid #dde3ea' }}
                  data-testid={`readiness-path-mobile-row-${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="uppercase font-bold text-[#1a6fc4]"
                      style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.14em' }}
                    >
                      Stage {i + 1}
                    </p>
                    <div className="text-right">
                      <span className="text-[#0d1b2a]/55 text-[11px] mr-1">from</span>
                      <span className="font-extrabold text-[#0d1b2a] text-[14px]" style={mono}>{row.priceFrom}</span>
                    </div>
                  </div>
                  <p className="text-[#0d1b2a]/80 italic text-sm mb-2">&ldquo;{row.need}&rdquo;</p>
                  <p className="font-bold text-[#0d1b2a] text-[15px]">{row.offer}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Footnote + Intake CTA */}
          <Reveal>
            <p
              className="text-base md:text-lg text-[#0d1b2a]/75 leading-relaxed text-center mt-10 max-w-3xl mx-auto"
              data-testid="readiness-path-footnote"
            >
              Most clients start with the <strong className="text-[#0d1b2a]">Compliance Readiness Visit</strong>. GigLine will tell you exactly where to start before you schedule anything &mdash;{' '}
              <a
                href="tel:+13363298899"
                onClick={() => trackPhoneClick && trackPhoneClick('readiness-path-footnote')}
                className="text-[#1a6fc4] hover:text-[#1560ae] font-bold"
                data-testid="readiness-path-phone"
              >
                call or text (336) 329-8899
              </a>.
            </p>
          </Reveal>

          {/* Intake CTA card */}
          <Reveal delay={120}>
            <div
              className="mt-12 rounded-2xl bg-white p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
              data-testid="readiness-path-intake-cta"
            >
              <div className="flex-1">
                <p
                  className="uppercase font-bold mb-2"
                  style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#1a6fc4' }}
                >
                  GL-INTAKE-002 &middot; 7 Sections &middot; ~5&ndash;7 min
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#0d1b2a] leading-tight mb-2 tracking-tight">
                  Not sure which stage you&apos;re at? Start with the intake form.
                </h3>
                <p className="text-[15px] text-[#0d1b2a]/65 leading-relaxed max-w-2xl">
                  Tell GigLine about your operation, what triggered the search, and what your current documentation looks like. We&apos;ll reply with the right starting point and a fixed quote within one business day.
                </p>
              </div>
              <Link
                to={intakeLink()}
                onClick={() => fireServicesCtaClick('Readiness Path · Intake Form', intakeLink())}
                className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-7 py-4 rounded-lg text-[15px] transition-colors shadow-md shadow-[#1a6fc4]/15 whitespace-nowrap self-start md:self-auto"
                data-testid="readiness-path-intake-cta-button"
              >
                Start the Intake Form
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 10. SAMPLE REPORT SECTION ═══ */}
      <SampleReportSection />

      {/* ═══ 11. CASE STUDY ═══ */}
      <CaseStudyTeaser source="services" />

      {/* ═══ 12. FOUNDER (compact, links to /about) ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#0d1b2a' }} data-testid="services-founder">
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
                  className="inline-flex items-center gap-2 text-[#1a6fc4] hover:text-white font-bold underline decoration-[#1a6fc4]/40 hover:decoration-white"
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
            <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-3 font-bold" style={{ ...mono, fontSize: '11px' }}>
              Questions Before You Schedule
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d1b2a] mb-10 max-w-2xl">
              Straight answers about how the services work.
            </h2>
          </Reveal>

          <div className="space-y-5">
            {SERVICES_FAQ.map((item, i) => (
              <Reveal key={i}>
                <details
                  className="group bg-white rounded-xl overflow-hidden"
                  style={{ border: '1px solid #dde3ea' }}
                  data-testid={`services-faq-${i + 1}`}
                >
                  <summary
                    className="cursor-pointer px-6 py-5 flex items-center justify-between gap-4 list-none"
                  >
                    <span className="text-base md:text-lg font-bold text-[#0d1b2a]">{item.q}</span>
                    <span className="flex-shrink-0 text-[#1a6fc4] text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 -mt-1 text-base text-[#0d1b2a]/80 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-base text-[#0d1b2a]/70 leading-relaxed text-center mt-10">
              Want more answers?{' '}
              <Link to="/faq" className="text-[#1a6fc4] hover:text-[#1560ae] underline font-semibold">
                Read the full FAQ &rarr;
              </Link>
            </p>
          </Reveal>

          {/* Pricing reference block */}
          <div className="mt-16" data-testid="services-pricing-reference">
            <Reveal>
              <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-3 font-bold text-center" style={{ ...mono, fontSize: '11px' }}>
                Pricing Reference
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-[#0d1b2a] mb-3 text-center max-w-2xl mx-auto">
                Current starting prices, plainly.
              </h3>
              <p className="text-sm text-[#0d1b2a]/65 italic text-center mb-8 max-w-xl mx-auto">
                Every engagement receives a fixed written quote before scheduling. These are starting prices for typical scope.
              </p>
              <div
                className="rounded-xl bg-white overflow-hidden"
                style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
              >
                {PRICING_REF.map(([name, price], i) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 items-center"
                    style={{ borderBottom: i < PRICING_REF.length - 1 ? '1px solid rgba(16,33,51,0.06)' : 'none' }}
                    data-testid={`pricing-ref-row-${i + 1}`}
                  >
                    <span className="text-base text-[#0d1b2a] font-semibold">{name}</span>
                    <span className="text-base font-bold text-[#1a6fc4] whitespace-nowrap" style={mono}>{price}</span>
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
            className="inline-flex items-center gap-3 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1a6fc4]/25"
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
