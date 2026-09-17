import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Anchor,
  Factory,
  Truck,
  HardHat,
  Warehouse,
  Building2,
  Search,
  ClipboardCheck,
  Wrench,
  FileCheck,
  Lock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
  HAZCOM_STARTER_PACK,
  KIT_PRICES,
  COMBINED_SAVINGS,
  PRICE_RANGE,
} from '../data/servicePricing';
import { RECOMMENDATION_ROUTER_ENABLED, CASE_STUDY_PUBLIC } from '../config/features';
import { trackEvent } from '../utils/analytics';

/* ── Approved OSHA 2026 penalty schedule ───────────────────────────────────
 * Values verified against 29 CFR 1903.15 annual DOL Federal Register
 * adjustment. Also used by CitationCostCalculatorPage, citationProofKits,
 * and BlogOSHAPenaltyNC2026. Do not diverge without updating those three
 * sources of truth at the same time.
 */
const OSHA_PENALTY = {
  year: 2026,
  serious: '$16,550',
  willfulOrRepeat: '$165,514',
  failureToAbate: '$16,550 per day',
  source: 'https://www.osha.gov/penalties',
};

/* ── Motion helper (respects reduced-motion) ───────────────────────────── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('revealed');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          io.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, className = '' }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-fade ${className}`}>
      {children}
    </div>
  );
};

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY = '#102A43';
const NAVY_DEEP = '#0A1F35';
const GOLD = '#C9A84C';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#4A5568';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ── Secondary-CTA helper ──────────────────────────────────────────────── */
const secondaryCtaProps = () =>
  RECOMMENDATION_ROUTER_ENABLED
    ? { label: 'Find My Starting Point', to: '/recommendation' }
    : { label: 'Compare Services', to: '/services' };

/* ── FAQ accordion item ────────────────────────────────────────────────── */
const FaqItem = ({ q, a, index, isOpen, onToggle }) => (
  <div
    className="border-b border-slate-200"
    data-testid={`home-faq-item-${index}`}
  >
    <button
      type="button"
      onClick={() => onToggle(index)}
      aria-expanded={isOpen}
      aria-controls={`home-faq-panel-${index}`}
      className="w-full flex items-center justify-between text-left py-5 min-h-[44px]"
    >
      <span className="text-base md:text-lg font-semibold text-slate-900 pr-4">{q}</span>
      <ChevronDown
        size={20}
        className={`flex-shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
    <div
      id={`home-faq-panel-${index}`}
      hidden={!isOpen}
      className="pb-5 text-[15px] md:text-base text-slate-700 leading-relaxed"
    >
      {a}
    </div>
  </div>
);

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const secondary = secondaryCtaProps();
  const savingsDollars = `$${COMBINED_SAVINGS}`;

  const handlePrimaryCta = (location) => {
    trackEvent('cta_click', { cta: 'request_crv', location });
  };
  const handleSecondaryCta = (location) => {
    trackEvent('cta_click', { cta: secondary.to === '/recommendation' ? 'find_starting_point' : 'compare_services', location });
  };

  return (
    <main className="overflow-x-hidden bg-white" data-testid="home-main">
      <SEO
        title="OSHA Safety & Documentation Readiness | GigLine Safety & Compliance"
        description="On-site OSHA safety walkthroughs and documentation readiness reviews for small NC manufacturers, warehouses, contractors, and fleets. Combined Compliance Readiness Visit starts at $2,500."
        canonical="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://www.giglinecompliance.com',
          name: 'GigLine Safety & Compliance',
          description:
            'On-site safety walkthroughs, documentation readiness reviews, and combined Compliance Readiness Visits for small manufacturers, warehouses, contractors, and fleet operations in the North Carolina Piedmont Triad.',
          url: 'https://www.giglinecompliance.com',
          telephone: '+13363298899',
          email: 'vince@giglinecompliance.com',
          image: 'https://www.giglinecompliance.com/og-image.png',
          founder: { '@type': 'Person', name: 'Vince Lawrence' },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kernersville',
            addressRegion: 'NC',
            postalCode: '27107',
            addressCountry: 'US',
          },
          areaServed: [
            { '@type': 'City', name: 'Winston-Salem' },
            { '@type': 'City', name: 'Greensboro' },
            { '@type': 'City', name: 'High Point' },
            { '@type': 'City', name: 'Kernersville' },
            { '@type': 'City', name: 'Clemmons' },
            { '@type': 'City', name: 'Lexington' },
            { '@type': 'City', name: 'Thomasville' },
            { '@type': 'City', name: 'Mocksville' },
            { '@type': 'City', name: 'Asheboro' },
            { '@type': 'City', name: 'Salisbury' },
            { '@type': 'City', name: 'Burlington' },
          ],
          priceRange: PRICE_RANGE,
          openingHours: 'Mo-Fr 08:00-18:00',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Safety Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Walkthrough' }, price: SAFETY_WALKTHROUGH.amountStr, priceCurrency: 'USD' },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'OSHA Documentation Readiness Review' }, price: DOCUMENTATION_REVIEW.amountStr, priceCurrency: 'USD' },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Compliance Readiness Visit' }, price: COMPLIANCE_READINESS_VISIT.amountStr, priceCurrency: 'USD' },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corrective Action Implementation' }, price: CORRECTIVE_ACTION_IMPLEMENTATION.amountStr, priceCurrency: 'USD' },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Control System Buildout' }, price: SAFETY_CONTROL_SYSTEM_BUILDOUT.amountStr, priceCurrency: 'USD' },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ongoing Safety Support' }, price: ONGOING_SAFETY_SUPPORT.amountStr, priceCurrency: 'USD' },
            ],
          },
        }}
      />

      <style>{`
        .reveal-fade { opacity: 0; transform: translateY(16px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .reveal-fade.revealed { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .reveal-fade { opacity: 1 !important; transform: none !important; transition: none !important; } }
      `}</style>

      {/* ══════════════ S1 · HERO ══════════════ */}
      <section
        className="relative min-h-[80vh] flex items-center overflow-hidden"
        style={{ backgroundColor: NAVY_DEEP }}
        data-testid="hero-section"
        aria-label="Hero"
      >
        <img
          src="/vince-inspecting.webp"
          srcSet="/vince-inspecting-400w.webp 400w, /vince-inspecting-600w.webp 600w, /vince-inspecting-843w.webp 843w, /vince-inspecting.webp 1600w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'right center' }}
          loading="eager"
          fetchPriority="high"
          width="1600"
          height="900"
        />
        {/* Dark navy overlay — heavier on the left where the copy sits, fading
            to transparent on the right so the image remains clearly visible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              `linear-gradient(90deg, ${NAVY_DEEP} 0%, ${NAVY_DEEP}F2 35%, ${NAVY_DEEP}80 60%, transparent 100%)`,
          }}
          aria-hidden="true"
        />
        {/* Mobile fallback: image is squeezed, add bottom-up scrim for text
            legibility only on narrow viewports. */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              `linear-gradient(180deg, ${NAVY_DEEP}E6 0%, ${NAVY_DEEP}CC 60%, ${NAVY_DEEP}F2 100%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-2xl">
            <Reveal>
            <p
              className="uppercase mb-5"
              style={{ ...mono, fontSize: '12px', color: GOLD, letterSpacing: '0.24em' }}
              data-testid="hero-eyebrow"
            >
              Find the gaps before OSHA does.
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl"
              data-testid="hero-headline"
            >
              Know what to fix before OSHA walks in.
            </h1>
            <p
              className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl"
              data-testid="hero-sub"
            >
              GigLine helps small manufacturers, warehouses, contractors, and fleet operations
              identify workplace hazards, uncover documentation gaps, and build proof of
              correction. You leave knowing what requires attention, what to address first, and
              what to do next.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4" data-testid="hero-ctas">
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => handlePrimaryCta('hero')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-md font-semibold text-base transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                data-testid="hero-cta-primary"
              >
                Request a Compliance Readiness Visit
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to={secondary.to}
                onClick={() => handleSecondaryCta('hero')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-md font-semibold text-base border-2 border-white/80 text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                data-testid="hero-cta-secondary"
              >
                {secondary.label}
              </Link>
            </div>

            <p className="text-sm text-slate-300 mb-6" data-testid="hero-price-line">
              Compliance Readiness Visits start at {COMPLIANCE_READINESS_VISIT.displayPrice}. Scope
              and scheduling are confirmed before work begins.
            </p>

            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"
              data-testid="hero-trust-line"
              role="list"
              aria-label="Consultant credentials"
            >
              <span className="inline-flex items-center gap-2" role="listitem">
                <ShieldCheck size={16} className="text-amber-400" aria-hidden="true" />
                OSHA 30-Hour General Industry Trained
              </span>
              <span className="inline-flex items-center gap-2" role="listitem">
                <Anchor size={16} className="text-amber-400" aria-hidden="true" />
                U.S. Navy Veteran
              </span>
              <span className="inline-flex items-center gap-2" role="listitem">
                <Factory size={16} className="text-amber-400" aria-hidden="true" />
                25+ years floor-level experience
              </span>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ S2 · OUTCOME FRAMEWORK ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="outcome-framework-section"
        aria-labelledby="outcome-framework-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              From uncertainty to a clear plan
            </p>
            <h2
              id="outcome-framework-heading"
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl"
            >
              Floor. Findings. Fixes. Proof.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-12 max-w-3xl">
              A safety program is only useful when it connects what is happening on the floor to
              what leadership documents, corrects, and verifies.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Search, title: 'Floor', body: 'See what is happening where the work is actually performed.', slug: 'floor' },
              { Icon: ClipboardCheck, title: 'Findings', body: 'Document observable hazards and readiness gaps in clear language.', slug: 'findings' },
              { Icon: Wrench, title: 'Fixes', body: 'Prioritize what requires attention and determine the appropriate corrective action.', slug: 'fixes' },
              { Icon: FileCheck, title: 'Proof', body: 'Build records showing what was corrected, when it was addressed, and how it was verified.', slug: 'proof' },
            ].map(({ Icon, title, body, slug }) => (
              <Reveal key={slug}>
                <div
                  className="h-full p-6 rounded-lg border border-slate-200 bg-white"
                  data-testid={`outcome-column-${slug}`}
                >
                  <Icon size={28} className="text-amber-500 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-[15px] text-slate-700 leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ S3 · WHO GIGLINE HELPS ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: CARD_BG }}
        data-testid="who-section"
        aria-labelledby="who-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Built for small operations
            </p>
            <h2
              id="who-heading"
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl"
            >
              Practical compliance support for the places where work gets done.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-12 max-w-3xl">
              GigLine works with small and growing operations that need experienced, hands-on
              safety support without immediately adding a full-time safety position.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Factory, title: 'Manufacturers', body: 'Machine guarding, lockout/tagout, hazard communication, training, documentation, and corrective-action readiness.', slug: 'manufacturers' },
              { Icon: Warehouse, title: 'Warehouses', body: 'Powered industrial trucks, pedestrian traffic, storage, loading areas, inspections, and employee training records.', slug: 'warehouses' },
              { Icon: HardHat, title: 'Contractors', body: 'Jobsite hazards, required programs, field documentation, employee readiness, and corrective-action tracking.', slug: 'contractors' },
              { Icon: Truck, title: 'Fleet Operations', body: 'Driver and facility safety, inspections, training records, shop conditions, and operational documentation.', slug: 'fleet' },
            ].map(({ Icon, title, body, slug }) => (
              <Reveal key={slug}>
                <div
                  className="h-full p-6 rounded-lg bg-white border border-slate-200"
                  data-testid={`who-card-${slug}`}
                >
                  <Icon size={26} className="text-slate-700 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-[15px] text-slate-700 leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ S4 · CHOOSE THE RIGHT STARTING POINT ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="starting-point-section"
        aria-labelledby="starting-point-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Start with the level of review you need
            </p>
            <h2 id="starting-point-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl">
              Three ways to understand where your operation stands.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-12 max-w-3xl">
              Choose a focused review or combine the floor and documentation review through the
              Compliance Readiness Visit.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {/* Card 1 · Safety Walkthrough */}
            <div
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-7"
              data-testid="service-card-safety-walkthrough"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Focused</p>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Safety Walkthrough</h3>
              <p className="text-2xl font-bold text-slate-900 mb-3" data-testid="service-card-walkthrough-price">
                {SAFETY_WALKTHROUGH.displayPrice}
              </p>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-5 flex-grow">
                A focused review of observable workplace conditions and work practices. Written
                report of findings with photo documentation and prioritized next steps.
              </p>
              <Link
                to="/services/safety-walkthrough-report"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                data-testid="service-card-walkthrough-cta"
              >
                Review the Safety Walkthrough
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Card 2 · Documentation Readiness Review */}
            <div
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-7"
              data-testid="service-card-documentation-review"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Focused</p>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Documentation Readiness Review</h3>
              <p className="text-2xl font-bold text-slate-900 mb-3" data-testid="service-card-docreview-price">
                {DOCUMENTATION_REVIEW.displayPrice}
              </p>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-5 flex-grow">
                A focused review of safety programs, records, training documentation, and other
                approved documentation categories. Prioritized findings and one review call.
              </p>
              <Link
                to="/services/documentation-readiness-review"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                data-testid="service-card-docreview-cta"
              >
                Review Documentation Readiness
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Card 3 · Compliance Readiness Visit (RECOMMENDED) */}
            <div
              className="flex flex-col rounded-lg p-7 relative shadow-lg"
              style={{ backgroundColor: NAVY, color: 'white', border: `2px solid ${GOLD}` }}
              data-testid="service-card-crv"
            >
              <span
                className="absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: GOLD, color: NAVY_DEEP, letterSpacing: '0.12em' }}
                data-testid="crv-recommended-badge"
              >
                Recommended Starting Point
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Combined</p>
              <h3 className="text-xl font-semibold text-white mb-2">Compliance Readiness Visit</h3>
              <p className="text-2xl font-bold text-white mb-1" data-testid="service-card-crv-price">
                {COMPLIANCE_READINESS_VISIT.displayPrice}
              </p>
              <p className="text-xs text-amber-300 mb-3" data-testid="crv-savings-line">
                A {savingsDollars} savings compared with purchasing both reviews separately.
              </p>
              <p className="text-[15px] text-slate-200 leading-relaxed mb-5 flex-grow">
                Combines the floor-level Safety Walkthrough and Documentation Readiness Review
                into one coordinated assessment. One visit, one prioritized findings package.
              </p>
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => handlePrimaryCta('starting-point-crv-card')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-md font-semibold text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                data-testid="crv-primary-cta"
              >
                Request a Compliance Readiness Visit
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ S5 · WHAT THE CLIENT ACHIEVES ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: CARD_BG }}
        data-testid="outcomes-section"
        aria-labelledby="outcomes-heading"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              What you leave with
            </p>
            <h2 id="outcomes-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Clear priorities instead of compliance guesswork.
            </h2>
          </Reveal>
          <ul className="space-y-3 mb-8" data-testid="outcomes-checklist">
            {[
              'A clearer picture of observable workplace hazards',
              'Identification of documentation readiness gaps',
              'Priorities based on the significance of the findings',
              'A defined path for addressing identified issues',
              'A structure for tracking corrective actions',
              'Better evidence that identified problems were addressed',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={20} className="text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-base text-slate-800 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[15px] text-slate-600 leading-relaxed italic border-l-4 border-slate-300 pl-4">
            GigLine identifies and organizes the work. The client remains responsible for
            operating decisions, implementation, and ongoing compliance unless additional
            implementation services are included in a separate written scope.
          </p>
        </div>
      </section>

      {/* ══════════════ S6 · AFTER FINDINGS ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="after-findings-section"
        aria-labelledby="after-findings-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              From findings to action
            </p>
            <h2 id="after-findings-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl">
              You decide how the corrective work gets completed.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-12 max-w-3xl">
              A Compliance Readiness Visit identifies and prioritizes the gaps. After the review,
              your team can complete the corrective work internally or request a separate
              implementation proposal from GigLine.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-lg border border-slate-200 bg-white" data-testid="after-card-fix-internally">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fix It Internally</h3>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                Use the findings and priorities to assign and complete corrective actions with
                your own team.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-slate-200 bg-white" data-testid="after-card-corrective-action">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Request Corrective Action Implementation</h3>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-3">
                GigLine can scope selected corrective-action work through a separate fixed-price
                proposal.
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Most Corrective Action Implementation projects begin at $2,500.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-slate-200 bg-white" data-testid="after-card-control-system">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Build a Larger Control System</h3>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-3">
                For operations needing broader implementation, the OSHA-Ready Control System
                begins at {SAFETY_CONTROL_SYSTEM_BUILDOUT.displayPrice}.
              </p>
              <Link
                to="/services/safety-control-system-buildout"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
              >
                Learn more
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ S7 · DIFFERENTIATION ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: NAVY }}
        data-testid="differentiation-section"
        aria-labelledby="diff-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-white">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Hands-on support
            </p>
            <h2 id="diff-heading" className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl">
              Not a software tool. Not a template mill. A person who walks your floor.
            </h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-12 max-w-3xl">
              Templates and software can store information. They cannot observe how work is being
              performed, ask follow-up questions, compare practice with documentation, or help
              leadership prioritize what matters most.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Real Workplaces', body: 'The review considers the conditions, tasks, equipment, and practices present in the operation.', slug: 'real' },
              { title: 'Clear Priorities', body: 'Findings are organized so leadership can understand what requires attention first.', slug: 'priorities' },
              { title: 'Evidence of Action', body: 'Corrective-action tracking helps turn identified problems into documented follow-through.', slug: 'evidence' },
            ].map((c) => (
              <div key={c.slug} className="p-6 rounded-lg bg-white/5 border border-white/10" data-testid={`diff-card-${c.slug}`}>
                <h3 className="text-lg font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-[15px] text-slate-200 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ S8 · COST OF WAITING ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="cost-of-waiting-section"
        aria-labelledby="cost-heading"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              The cost of waiting
            </p>
            <h2 id="cost-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl">
              Unaddressed safety gaps can become expensive problems.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              Workplace hazards can affect employees, operations, insurance relationships,
              customer confidence, and regulatory exposure. Finding problems before an inspection
              or incident gives leadership time to respond deliberately.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50" data-testid="penalty-serious">
              <p className="text-3xl font-bold text-slate-900 mb-1">{OSHA_PENALTY.serious}</p>
              <p className="text-sm font-semibold text-slate-800 mb-1">Per Serious or Other-Than-Serious violation</p>
              <p className="text-xs text-slate-600">Maximum, {OSHA_PENALTY.year}</p>
            </div>
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50" data-testid="penalty-willful">
              <p className="text-3xl font-bold text-slate-900 mb-1">{OSHA_PENALTY.willfulOrRepeat}</p>
              <p className="text-sm font-semibold text-slate-800 mb-1">Per Willful or Repeat violation</p>
              <p className="text-xs text-slate-600">Maximum, {OSHA_PENALTY.year}</p>
            </div>
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50" data-testid="penalty-failure-to-abate">
              <p className="text-3xl font-bold text-slate-900 mb-1">{OSHA_PENALTY.failureToAbate}</p>
              <p className="text-sm font-semibold text-slate-800 mb-1">Failure to Abate</p>
              <p className="text-xs text-slate-600">Per day, maximum, {OSHA_PENALTY.year}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Penalty amounts and circumstances vary. Not every violation is assessed at the
            maximum; actual assessed penalties reflect gravity, good faith, employer size, and
            history.{' '}
            <a
              href={OSHA_PENALTY.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-slate-900 underline underline-offset-2 hover:text-amber-700"
              data-testid="penalty-source-link"
            >
              OSHA penalties, official schedule
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            .
          </p>
        </div>
      </section>

      {/* ══════════════ S9 · RECOMMENDATION ENTRY ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: CARD_BG }}
        data-testid="rec-entry-section"
        aria-labelledby="rec-entry-heading"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Not sure where to begin?
            </p>
            <h2 id="rec-entry-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Find the right starting point for your operation.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-8">
              Answer a few questions about your workplace, documentation, and current safety
              needs. GigLine will direct you toward the most appropriate service or self-serve
              resource.
            </p>
            <Link
              to={secondary.to}
              onClick={() => handleSecondaryCta('rec-entry')}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-md font-semibold text-base border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/60"
              data-testid="rec-entry-cta"
            >
              {RECOMMENDATION_ROUTER_ENABLED ? 'Find My Starting Point' : 'Compare GigLine Services'}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ S10 · SELF-SERVE KITS ══════════════ */}
      <section
        className="py-16 md:py-20 bg-white"
        data-testid="kits-section"
        aria-labelledby="kits-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              For teams starting with a specific need
            </p>
            <h2 id="kits-heading" className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 max-w-3xl">
              Practical tools for focused compliance work.
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <Link
              to="/hazcom-starter-pack"
              className="block p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/50"
              data-testid="kit-card-hazcom-starter"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Starter</p>
              <h3 className="text-base font-semibold text-slate-900 mb-1">HazCom Starter Pack</h3>
              <p className="text-sm font-bold text-slate-900 mb-2">{HAZCOM_STARTER_PACK.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Written program, SDS binder checklist, and training log. The entry pack for teams
                not yet ready for the full HazCom Pro Kit.
              </p>
            </Link>
            <Link
              to="/citation-proof-kits/loto-readiness-kit"
              className="block p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/50"
              data-testid="kit-card-loto"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Readiness Kit</p>
              <h3 className="text-base font-semibold text-slate-900 mb-1">Machine-Specific LOTO Readiness Kit</h3>
              <p className="text-sm font-bold text-slate-900 mb-2">Starting at {KIT_PRICES.digital.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Build machine-specific lockout procedures your team can follow and verify.
              </p>
            </Link>
            <Link
              to="/citation-proof-kits/forklift-pit-readiness-kit"
              className="block p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/50"
              data-testid="kit-card-forklift-pit"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Readiness Kit</p>
              <h3 className="text-base font-semibold text-slate-900 mb-1">Forklift / PIT Readiness Kit</h3>
              <p className="text-sm font-bold text-slate-900 mb-2">Starting at {KIT_PRICES.digital.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Know exactly who is cleared to operate which truck, and when the next evaluation
                is due.
              </p>
            </Link>
          </div>
          <div className="mt-8">
            <Link
              to="/citation-proof-kits"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
              data-testid="kits-all-cta"
            >
              View All Readiness Kits
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ S11 · WHY GIGLINE ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: CARD_BG }}
        data-testid="why-section"
        aria-labelledby="why-heading"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Practical safety support
            </p>
            <h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 max-w-3xl">
              Built around real operations, not generic paperwork.
            </h2>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-2" data-testid="why-benefits">
            {[
              'On-site observation of actual conditions and work practices',
              'Plain-language findings, no acronym soup',
              'Prioritized corrective actions leadership can act on',
              'Documentation readiness structured for inspection or audit',
              'Leadership-focused communication of what needs attention',
              'Flexible implementation options after the review',
            ].map((b) => (
              <div key={b} className="flex items-start gap-3">
                <Check size={20} className="text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-[15px] text-slate-800 leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700"
            data-testid="why-badges"
            role="list"
            aria-label="Approved credentials and positioning"
          >
            <span className="inline-flex items-center gap-2" role="listitem">
              <ShieldCheck size={16} className="text-amber-500" aria-hidden="true" />
              OSHA 30-Hour General Industry Trained
            </span>
            <span className="inline-flex items-center gap-2" role="listitem">
              <Anchor size={16} className="text-amber-500" aria-hidden="true" />
              U.S. Navy Veteran-Owned
            </span>
            <span className="inline-flex items-center gap-2" role="listitem">
              <Building2 size={16} className="text-amber-500" aria-hidden="true" />
              Carolina-Built, Kernersville NC
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════ S12 · HOW ENGAGEMENT WORKS ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="process-section"
        aria-labelledby="process-heading"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              A clear process
            </p>
            <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 max-w-3xl">
              From the first request to documented next steps.
            </h2>
          </Reveal>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '1', t: 'Request', b: 'Tell GigLine about the operation, location, workforce, and primary concerns.' },
              { n: '2', t: 'Confirm', b: 'GigLine confirms the appropriate service, scope, price, preparation requirements, and schedule.' },
              { n: '3', t: 'Review', b: 'The agreed floor, documentation, or combined assessment is completed.' },
              { n: '4', t: 'Act', b: 'Leadership receives the approved findings and next-step information, then determines how corrective work will be completed.' },
            ].map((s) => (
              <li
                key={s.n}
                className="p-6 rounded-lg border border-slate-200 bg-white"
                data-testid={`process-step-${s.n}`}
              >
                <p className="text-3xl font-bold mb-3" style={{ color: GOLD, ...mono }}>{s.n}</p>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.t}</h3>
                <p className="text-[15px] text-slate-700 leading-relaxed">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════════ S13 · HOMEPAGE FAQ ══════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: CARD_BG }}
        data-testid="home-faq-section"
        aria-labelledby="home-faq-heading"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Common questions
            </p>
            <h2 id="home-faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="rounded-lg bg-white border border-slate-200 px-6">
            {[
              {
                q: 'Does a Compliance Readiness Visit guarantee OSHA compliance?',
                a: 'No. GigLine provides an independent readiness review based on the approved scope. The service identifies observable conditions and documentation gaps, but it does not guarantee regulatory compliance, prevent citations, or replace legal advice.',
              },
              {
                q: 'Are corrective actions included in the Compliance Readiness Visit?',
                a: 'No. The visit identifies and prioritizes findings. Your team may complete corrective actions internally, or GigLine can provide a separate implementation proposal when appropriate.',
              },
              {
                q: 'What is the difference between the three reviews?',
                a: 'The Safety Walkthrough focuses on observable workplace conditions. The Documentation Readiness Review focuses on programs and records. The Compliance Readiness Visit combines both reviews into one coordinated assessment.',
              },
              {
                q: 'What happens before the visit is scheduled?',
                a: 'GigLine confirms the operation, location, workforce, requested service, scope, price, preparation needs, and scheduling details.',
              },
              {
                q: 'Can we begin with a readiness kit instead?',
                a: (
                  <>
                    Yes. Self-serve kits may be appropriate when the need is narrow and leadership
                    is prepared to implement the material internally. If the need is unclear or
                    spans multiple areas, begin with{' '}
                    <Link to={secondary.to} className="underline underline-offset-2 font-semibold text-slate-900 hover:text-amber-700">
                      {RECOMMENDATION_ROUTER_ENABLED ? 'the recommendation tool' : 'the services comparison'}
                    </Link>{' '}
                    or request a Compliance Readiness Visit.
                  </>
                ),
              },
            ].map((item, i) => (
              <FaqItem
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onToggle={(idx) => setOpenFaq((cur) => (cur === idx ? null : idx))}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ S14 · FOUNDER ══════════════ */}
      <section
        className="py-20 md:py-24 bg-white"
        data-testid="founder-section"
        aria-labelledby="founder-heading"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid gap-10 lg:grid-cols-[240px_1fr] items-start">
          <img
            src="/vince-founder.webp"
            alt="Vince Lawrence, founder of GigLine Safety & Compliance"
            width="240"
            height="240"
            loading="lazy"
            className="w-full max-w-[240px] rounded-lg object-cover"
            data-testid="founder-photo"
          />
          <div>
            <Reveal>
              <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
                Meet the founder
              </p>
              <h2 id="founder-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-5" data-testid="founder-name">
                Safety experience shaped by the realities of work.
              </h2>
            </Reveal>
            <div className="space-y-4 text-base md:text-[17px] text-slate-700 leading-relaxed" data-testid="founder-body">
              <p>
                Vince Lawrence founded GigLine Safety &amp; Compliance to help small operations
                recognize safety and documentation gaps before those gaps become larger problems.
              </p>
              <p>
                His background includes production leadership, workplace safety coordination,
                employee training, corrective-action follow-through, and support for manufacturing
                and operational environments. As a U.S. Navy veteran, he brings a direct,
                structured approach to helping leaders understand what requires attention and what
                should happen next.
              </p>
              <p>
                GigLine was built for owners and operational leaders who need practical answers,
                clear priorities, and a workable path forward.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                data-testid="founder-learn-more"
              >
                Learn More About GigLine
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ S15 · RESOURCES ══════════════ */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: CARD_BG }}
        data-testid="resources-section"
        aria-labelledby="resources-heading"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>
              Safety and compliance resources
            </p>
            <h2 id="resources-heading" className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 max-w-3xl">
              Start strengthening your operation today.
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-5 rounded-lg bg-white border border-slate-200" data-testid="resource-card-0">
              <h3 className="text-base font-semibold text-slate-900 mb-1">OSHA Penalty Calculator</h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Estimate {OSHA_PENALTY.year} exposure across your open gaps.
              </p>
              <Link to="/tools/citation-cost-calculator" className="text-[14px] font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1">
                Open the calculator <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="p-5 rounded-lg bg-white border border-slate-200" data-testid="resource-card-1">
              <h3 className="text-base font-semibold text-slate-900 mb-1">OSHA Penalty Guide, NC 2026</h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                What Serious, Willful, Repeat, and Failure-to-Abate citations actually cost.
              </p>
              <Link to="/blog/osha-penalty-north-carolina-2026" className="text-[14px] font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1">
                Read the guide <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="p-5 rounded-lg bg-white border border-slate-200" data-testid="resource-card-2">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Field Notes</h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Practical write-ups from the floor on the standards small operations miss.
              </p>
              <Link to="/field-notes" className="text-[14px] font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1">
                Browse field notes <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
              data-testid="resources-all-cta"
            >
              View All Resources
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ S16 · FINAL CONVERSION ══════════════ */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: NAVY_DEEP }}
        data-testid="final-cta-section"
        aria-labelledby="final-cta-heading"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center text-white">
          <Reveal>
            <div
              className="mx-auto mb-6 w-12 h-0.5"
              style={{ backgroundColor: GOLD }}
              aria-hidden="true"
            />
            <h2 id="final-cta-heading" className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              Know what requires attention before an inspection, incident, or customer demand
              forces the issue.
            </h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl mx-auto">
              Start with a coordinated review of the floor and documentation. GigLine will confirm
              the scope, price, preparation requirements, and scheduling details before the work
              begins.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => handlePrimaryCta('final-cta')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-md font-semibold text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                data-testid="final-cta-primary"
              >
                Request a Compliance Readiness Visit
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to={secondary.to}
                onClick={() => handleSecondaryCta('final-cta')}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/90 hover:text-white underline underline-offset-4"
                data-testid="final-cta-secondary"
              >
                {RECOMMENDATION_ROUTER_ENABLED ? 'Find My Starting Point' : 'Compare Services'}
              </Link>
            </div>
            {/* CASE_STUDY_PUBLIC gated: intentionally no promotional case-study link */}
            {CASE_STUDY_PUBLIC && null}
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
