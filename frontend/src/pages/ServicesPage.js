import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronRight, ExternalLink, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { trackEvent } from '../utils/analytics';
import {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
  HAZCOM_STARTER_PACK,
  COMBINED_SEPARATE_TOTAL,
  COMBINED_SAVINGS,
} from '../data/servicePricing';
import { KIT_CATALOG } from '../data/citationProofKits';
import { RECOMMENDATION_ROUTER_ENABLED } from '../config/features';

const NAVY_DEEP = '#0a1a2e';
const GOLD = '#c9a961';
const mono = { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace' };

const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.unobserve(el); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};
const Reveal = ({ children, className = '' }) => {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-fade ${className}`}>{children}</div>;
};

const featuredKitSlugs = ['loto-readiness-kit', 'forklift-pit-readiness-kit'];
const releasedFeaturedKits = KIT_CATALOG.filter((k) => !k.hiddenFromCatalog && k.ready && featuredKitSlugs.includes(k.slug));

const ServicesPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileCompareKey, setMobileCompareKey] = useState('crv');
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'GigLine Safety and Compliance Services',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'item': { '@type': 'Service', 'name': 'Safety Walkthrough', 'url': 'https://www.giglinecompliance.com/services/safety-walkthrough-report', 'offers': { '@type': 'Offer', 'price': String(SAFETY_WALKTHROUGH.amount), 'priceCurrency': 'USD' } } },
      { '@type': 'ListItem', 'position': 2, 'item': { '@type': 'Service', 'name': 'OSHA Documentation Readiness Review', 'url': 'https://www.giglinecompliance.com/services/documentation-readiness-review', 'offers': { '@type': 'Offer', 'price': '1700', 'priceCurrency': 'USD' } } },
      { '@type': 'ListItem', 'position': 3, 'item': { '@type': 'Service', 'name': 'Compliance Readiness Visit', 'url': 'https://www.giglinecompliance.com/services/compliance-readiness-visit', 'offers': { '@type': 'Offer', 'price': String(COMPLIANCE_READINESS_VISIT.amount), 'priceCurrency': 'USD' } } },
      { '@type': 'ListItem', 'position': 4, 'item': { '@type': 'Service', 'name': 'Corrective Action Implementation', 'url': 'https://www.giglinecompliance.com/services/corrective-action-implementation' } },
      { '@type': 'ListItem', 'position': 5, 'item': { '@type': 'Service', 'name': 'OSHA-Ready Control System', 'url': 'https://www.giglinecompliance.com/services/safety-control-system-buildout', 'offers': { '@type': 'Offer', 'price': String(SAFETY_CONTROL_SYSTEM_BUILDOUT.amount), 'priceCurrency': 'USD' } } },
      { '@type': 'ListItem', 'position': 6, 'item': { '@type': 'Service', 'name': 'Ongoing Safety Support', 'url': 'https://www.giglinecompliance.com/ongoing-safety-support', 'offers': { '@type': 'Offer', 'price': String(ONGOING_SAFETY_SUPPORT.amount), 'priceCurrency': 'USD' } } },
    ],
  };

  const compareRows = [
    { label: 'Floor-level workplace conditions', walkthrough: true, docreview: false, crv: true },
    { label: 'Work practices observed on-site', walkthrough: true, docreview: false, crv: true },
    { label: 'Written safety programs reviewed', walkthrough: false, docreview: true, crv: true },
    { label: 'Training records reviewed', walkthrough: false, docreview: true, crv: true },
    { label: 'Inspection records reviewed', walkthrough: false, docreview: true, crv: true },
    { label: 'Documentation readiness gap analysis', walkthrough: false, docreview: true, crv: true },
    { label: 'Prioritized findings and next steps', walkthrough: true, docreview: true, crv: true },
    { label: 'Combined floor + documentation review', walkthrough: false, docreview: false, crv: true },
  ];

  const faqs = [
    { q: 'Which service should I start with?', a: 'If both floor conditions and documentation are uncertain, begin with the Compliance Readiness Visit. If the concern is limited to one area, choose the focused Safety Walkthrough or Documentation Readiness Review.' },
    { q: 'Are corrections included in the Compliance Readiness Visit?', a: 'No. The CRV identifies and prioritizes gaps. Corrections are completed internally or quoted separately.' },
    { q: 'Why does the CRV cost less than purchasing both reviews separately?', a: `The two reviews total $${COMBINED_SEPARATE_TOTAL.toLocaleString()} when purchased separately. The combined CRV is $${COMPLIANCE_READINESS_VISIT.amount.toLocaleString()}, creating a $${COMBINED_SAVINGS} savings through a coordinated assessment.` },
    { q: 'Does GigLine guarantee OSHA compliance?', a: 'No. GigLine provides independent readiness, implementation, and support services according to the written scope. These services do not guarantee compliance, prevent citations, or replace legal advice.' },
    { q: 'Can we start with a readiness kit?', a: 'Yes, when the need is focused and the organization is prepared to implement the material internally.' },
    { q: 'What happens before work is scheduled?', a: 'GigLine confirms the operation, requested service, location, workforce, scope, price, preparation requirements, and scheduling details.' },
  ];

  const YesNo = ({ yes }) => yes ? <Check size={18} className="text-emerald-600" aria-label="Included" /> : <span className="text-slate-300" aria-label="Not included">—</span>;

  const secCta = (label, href, testid) => (
    <Link to={href} data-testid={testid} onClick={() => trackEvent('services_cta_click', { label, href })} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors rounded-md">
      {label} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );

  return (
    <main className="bg-white" data-testid="services-page-root">
      <SEO
        title="Safety and Compliance Services | GigLine"
        description="Start with a focused floor review, a documentation review, or a combined Compliance Readiness Visit. Fixed pricing. Scope confirmed before scheduling."
        canonical="/services"
        jsonLd={jsonLd}
      />

      {/* ── S1 · HERO ── */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ backgroundColor: NAVY_DEEP }} data-testid="services-hero-section">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, #12253f 100%)` }} aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-4" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Safety and compliance services</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl" data-testid="services-hero-h1">
              Choose the right level of safety support for what your operation needs now.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-3xl" data-testid="services-hero-sub">
              Start with a focused floor review, a documentation review, or a combined Compliance Readiness Visit. If gaps are identified, your team can address them internally or request separately scoped implementation support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => trackEvent('services_hero_primary_cta', { destination: 'intake' })}
                data-testid="services-hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-bold text-slate-900 min-h-[44px]"
                style={{ backgroundColor: GOLD }}
              >
                Request a Compliance Readiness Visit <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => { trackEvent('services_hero_secondary_cta', {}); scrollTo('services-compare'); }}
                data-testid="services-hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors min-h-[44px]"
              >
                Compare the Three Reviews
              </button>
            </div>
            <p className="text-sm text-slate-300" data-testid="services-hero-price-line">
              Compliance Readiness Visits start at {COMPLIANCE_READINESS_VISIT.displayPrice}. Scope and scheduling are confirmed before work begins.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── S2 · FLOOR. FINDINGS. FIXES. PROOF. ── */}
      <section className="py-16 md:py-20 bg-slate-50" data-testid="services-framework-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Floor. Findings. Fixes. Proof.</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { t: 'Floor', d: 'See what is happening where the work is performed.' },
                { t: 'Findings', d: 'Document workplace and readiness gaps in clear language.' },
                { t: 'Fixes', d: 'Determine what requires attention and who will complete the work.' },
                { t: 'Proof', d: 'Track what was corrected, when it was addressed, and how it was verified.' },
              ].map((c) => (
                <div key={c.t} className="p-5 bg-white rounded-lg border border-slate-200">
                  <p className="text-base font-bold text-slate-900 mb-2">{c.t}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S3 · THREE DIAGNOSTIC STARTING POINTS ── */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-diagnostic-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Start by understanding where you stand</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Three ways to evaluate your operation.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              Choose a focused review or combine the floor and documentation assessment through the Compliance Readiness Visit.
            </p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Walkthrough */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col" data-testid="service-card-walkthrough">
              <p className="uppercase mb-2" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Diagnostic</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">Safety Walkthrough</p>
              <p className="text-3xl font-bold text-slate-900 my-3" data-testid="service-card-walkthrough-price">{SAFETY_WALKTHROUGH.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-6 flex-1">A focused review of observable workplace conditions and work practices.</p>
              {secCta('Review the Safety Walkthrough', '/services/safety-walkthrough-report', 'service-card-walkthrough-cta')}
            </div>
            {/* Doc Review */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col" data-testid="service-card-docreview">
              <p className="uppercase mb-2" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Diagnostic</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">Documentation Readiness Review</p>
              <p className="text-3xl font-bold text-slate-900 my-3" data-testid="service-card-docreview-price">{DOCUMENTATION_REVIEW.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-6 flex-1">A focused review of safety programs, records, training documentation, and other approved documentation categories.</p>
              {secCta('Review Documentation Readiness', '/services/documentation-readiness-review', 'service-card-docreview-cta')}
            </div>
            {/* CRV — RECOMMENDED */}
            <div className="p-6 rounded-xl border-2 flex flex-col shadow-lg relative" style={{ borderColor: GOLD, backgroundColor: '#fffaf0' }} data-testid="service-card-crv">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: GOLD, color: NAVY_DEEP }} data-testid="crv-recommended-badge">
                <Star size={12} className="inline mr-1" aria-hidden="true" /> Recommended starting point
              </div>
              <p className="uppercase mb-2 mt-2" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Diagnostic · Combined</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">Compliance Readiness Visit</p>
              <p className="text-3xl font-bold text-slate-900 my-3" data-testid="service-card-crv-price">{COMPLIANCE_READINESS_VISIT.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2 flex-1">A coordinated floor and documentation assessment that combines the Safety Walkthrough and Documentation Readiness Review.</p>
              <p className="text-sm font-semibold mb-6" style={{ color: '#a7842f' }} data-testid="crv-savings-line">
                Save ${COMBINED_SAVINGS} compared with purchasing both reviews separately.
              </p>
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => trackEvent('services_crv_cta_click', {})}
                data-testid="crv-primary-cta"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-bold text-slate-900 min-h-[44px]"
                style={{ backgroundColor: GOLD }}
              >
                Request a Compliance Readiness Visit <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── S4 · DETAILED CRV FEATURE ── */}
      <section className="py-20 md:py-24 bg-slate-50" data-testid="services-crv-feature-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>The most complete diagnostic starting point</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">See the floor and the documentation together.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
              A Compliance Readiness Visit helps leadership understand whether workplace practices and safety documentation support each other. It provides a more complete view than reviewing either area alone.
            </p>
            <div className="p-4 mb-8 rounded-md border-l-4 bg-white" style={{ borderColor: GOLD }} data-testid="crv-implementation-clarification">
              <p className="text-sm md:text-base text-slate-800 leading-relaxed">
                <strong>The Compliance Readiness Visit identifies and prioritizes gaps.</strong> Corrective implementation is not included unless it is added through a separate written scope.
              </p>
            </div>
            <Link
              to="/services/compliance-readiness-visit"
              className="inline-flex items-center gap-2 text-slate-900 font-semibold underline underline-offset-4"
              data-testid="crv-feature-learn-more"
            >
              Read the full Compliance Readiness Visit scope <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── S5 · DIAGNOSTIC COMPARISON ── */}
      <section id="services-compare" className="py-20 md:py-24 bg-white" data-testid="services-comparison-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Compare the three reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Choose the review that matches the question you need answered.</h2>
          </Reveal>

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200" data-testid="services-compare-table">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-4 font-semibold text-slate-700">Question you need answered</th>
                  <th className="text-center p-4 font-semibold text-slate-900">Safety Walkthrough</th>
                  <th className="text-center p-4 font-semibold text-slate-900">Documentation Readiness Review</th>
                  <th className="text-center p-4 font-bold text-slate-900" style={{ backgroundColor: '#fffaf0' }}>
                    Compliance Readiness Visit
                    <span className="block text-[10px] uppercase font-bold mt-1" style={{ color: '#a7842f', letterSpacing: '0.16em' }}>Recommended</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.label} className="border-t border-slate-200">
                    <td className="p-4 text-slate-800">{r.label}</td>
                    <td className="p-4 text-center"><YesNo yes={r.walkthrough} /></td>
                    <td className="p-4 text-center"><YesNo yes={r.docreview} /></td>
                    <td className="p-4 text-center" style={{ backgroundColor: '#fffaf0' }}><YesNo yes={r.crv} /></td>
                  </tr>
                ))}
                <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                  <td className="p-4 text-slate-900">Price</td>
                  <td className="p-4 text-center text-slate-900">{SAFETY_WALKTHROUGH.displayPrice}</td>
                  <td className="p-4 text-center text-slate-900">{DOCUMENTATION_REVIEW.displayPrice}</td>
                  <td className="p-4 text-center font-bold text-slate-900" style={{ backgroundColor: '#fffaf0' }}>{COMPLIANCE_READINESS_VISIT.displayPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile: service selector showing one column at a time */}
          <div className="md:hidden" data-testid="services-compare-mobile">
            <div className="grid grid-cols-3 gap-2 mb-4" role="tablist" aria-label="Compare services">
              {[
                { k: 'walkthrough', label: 'Walkthrough' },
                { k: 'docreview', label: 'Doc Review' },
                { k: 'crv', label: 'CRV' },
              ].map((tab) => (
                <button
                  key={tab.k}
                  type="button"
                  role="tab"
                  aria-selected={mobileCompareKey === tab.k}
                  onClick={() => setMobileCompareKey(tab.k)}
                  className={`min-h-[44px] px-2 text-xs font-bold uppercase rounded-md border ${mobileCompareKey === tab.k ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-300'}`}
                  data-testid={`services-compare-tab-${tab.k}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 p-5 bg-white">
              <p className="text-lg font-bold text-slate-900 mb-1">
                {mobileCompareKey === 'walkthrough' && 'Safety Walkthrough'}
                {mobileCompareKey === 'docreview' && 'Documentation Readiness Review'}
                {mobileCompareKey === 'crv' && (<>Compliance Readiness Visit <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded" style={{ backgroundColor: GOLD, color: NAVY_DEEP }}>Recommended</span></>)}
              </p>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                {mobileCompareKey === 'walkthrough' && SAFETY_WALKTHROUGH.displayPrice}
                {mobileCompareKey === 'docreview' && DOCUMENTATION_REVIEW.displayPrice}
                {mobileCompareKey === 'crv' && COMPLIANCE_READINESS_VISIT.displayPrice}
              </p>
              <ul className="space-y-2 text-sm text-slate-800">
                {compareRows.map((r) => (
                  <li key={r.label} className="flex items-start gap-3">
                    <span className="mt-0.5"><YesNo yes={r[mobileCompareKey]} /></span>
                    <span>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── S6 · WHAT HAPPENS AFTER FINDINGS ── */}
      <section className="py-20 md:py-24 bg-slate-50" data-testid="services-after-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>After the assessment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">You decide how the corrective work gets completed.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              The diagnostic review identifies and prioritizes the gaps. Your team may complete the work internally, or GigLine can provide a separate implementation proposal for selected corrective actions.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="after-card-internal">
              <p className="text-lg font-bold text-slate-900 mb-2">Complete Corrections Internally</p>
              <p className="text-sm text-slate-700 leading-relaxed">Assign the findings to your team, track completion, and retain evidence showing what was addressed.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="after-card-corrective">
              <p className="text-lg font-bold text-slate-900 mb-2">Request Corrective Action Implementation</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">GigLine can separately scope selected corrective-action work.</p>
              <p className="text-sm font-semibold text-slate-900">Custom quote. Most projects begin at ${CORRECTIVE_ACTION_IMPLEMENTATION.amountFrom.toLocaleString()}. Final scope and price are confirmed before scheduling.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="after-card-control-system">
              <p className="text-lg font-bold text-slate-900 mb-2">Build a Broader Control System</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">For operations needing broader implementation, GigLine can scope an OSHA-Ready Control System.</p>
              <p className="text-sm font-semibold text-slate-900">Starting at {SAFETY_CONTROL_SYSTEM_BUILDOUT.displayPrice}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── S7 · CORRECTIVE ACTION IMPLEMENTATION ── */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-cai-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Corrective Action Implementation</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Turn selected findings into completed and documented work.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
              When leadership needs implementation support, GigLine can prepare a separate proposal for the selected corrective actions. The written proposal defines the work, responsibilities, exclusions, schedule, and fixed price before implementation begins.
            </p>
            <p className="text-lg font-bold text-slate-900 mb-6" data-testid="cai-pricing-line">Custom quote. Most projects begin at ${CORRECTIVE_ACTION_IMPLEMENTATION.amountFrom.toLocaleString()}.</p>
            {secCta('Request an Implementation Discussion', '/intake?service=corrective-action-implementation', 'cai-cta')}
          </Reveal>
        </div>
      </section>

      {/* ── S8 · OSHA-READY CONTROL SYSTEM ── */}
      <section className="py-20 md:py-24 text-white" style={{ backgroundColor: NAVY_DEEP }} data-testid="services-control-system-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Broader implementation support</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Build the controls, documentation, and tracking your operation needs.</h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-6 max-w-3xl">
              For operations that need more than a single corrective-action scope, the OSHA-Ready Control System builds the controls, written documentation, training records, and tracking structures required to maintain a functioning safety program.
            </p>
            <p className="text-lg font-bold mb-6" style={{ color: GOLD }} data-testid="control-system-price-line">
              Starting at {SAFETY_CONTROL_SYSTEM_BUILDOUT.displayPrice}.
            </p>
            <Link
              to="/services/safety-control-system-buildout"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold min-h-[44px]"
              style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
              data-testid="control-system-cta"
              onClick={() => trackEvent('services_control_system_cta', {})}
            >
              Explore the OSHA-Ready Control System <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── S9 · ONGOING SAFETY SUPPORT ── */}
      <section className="py-20 md:py-24 bg-slate-50" data-testid="services-ongoing-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Maintain the system</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ongoing support after the immediate gaps are addressed.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
              Ongoing Safety Support is designed for operations that already have the appropriate foundation and leadership commitment. It is not the automatic starting point for every prospect.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 mb-6 text-sm text-slate-800">
              {['One on-site visit per month','One virtual check-in','Monthly record reviews','Corrective-action tracker','Leadership meeting','Base scope: one location and 10–50 employees'].map((item) => (
                <li key={item} className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" aria-hidden="true" /> <span>{item}</span></li>
              ))}
            </ul>
            <p className="text-lg font-bold text-slate-900 mb-6" data-testid="ongoing-price-line">Starting at {ONGOING_SAFETY_SUPPORT.displayPrice}.</p>
            {secCta('Review Ongoing Safety Support', '/ongoing-safety-support', 'ongoing-cta')}
          </Reveal>
        </div>
      </section>

      {/* ── S10 · SELF-SERVE READINESS KITS ── */}
      <section className="py-16 md:py-20 bg-white" data-testid="services-kits-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>For a focused, self-serve need</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Use a readiness kit when the problem is narrow and your team can implement the material internally.</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Link to="/hazcom-starter-pack" className="p-5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white transition-colors" data-testid="kit-card-hazcom-starter">
              <p className="uppercase mb-1" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Starter</p>
              <p className="text-base font-bold text-slate-900 mb-1">HazCom Starter Pack</p>
              <p className="text-lg font-bold text-slate-900 mb-2">{HAZCOM_STARTER_PACK.displayPrice}</p>
              <p className="text-sm text-slate-700 leading-relaxed">Written program, SDS binder structure, labeling worksheet, and starter training sheet.</p>
            </Link>
            {releasedFeaturedKits.slice(0, 2).map((k) => (
              <Link key={k.slug} to={`/citation-proof-kits/${k.slug}`} className="p-5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white transition-colors" data-testid={`kit-card-${k.slug}`}>
                <p className="uppercase mb-1" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Readiness kit</p>
                <p className="text-base font-bold text-slate-900 mb-1">{k.name}</p>
                <p className="text-lg font-bold text-slate-900 mb-2">Starting at $150</p>
                <p className="text-sm text-slate-700 leading-relaxed">{k.shortDescription || k.subtitle || 'Everything the supervisor needs to run the program in the shop.'}</p>
              </Link>
            ))}
          </div>
          {secCta('View All Readiness Kits', '/citation-proof-kits', 'kits-all-cta')}
        </div>
      </section>

      {/* ── S11 · SIMPLIFIED SERVICE-PATH SUMMARY ── */}
      <section className="py-16 md:py-20 bg-slate-50" data-testid="services-paths-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Common service paths</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Start with the need in front of you.</h2>
          </Reveal>
          <div className="space-y-3">
            {[
              { t: 'Diagnose the Operation', d: 'Safety Walkthrough, Documentation Readiness Review, or Compliance Readiness Visit.' },
              { t: 'Implement Selected Corrections', d: `Corrective Action Implementation through a separate written proposal. Custom quote. Most projects begin at $${CORRECTIVE_ACTION_IMPLEMENTATION.amountFrom.toLocaleString()}.` },
              { t: 'Build a Broader System', d: `OSHA-Ready Control System starting at ${SAFETY_CONTROL_SYSTEM_BUILDOUT.displayPrice}.` },
              { t: 'Maintain the System', d: `Ongoing Safety Support starting at ${ONGOING_SAFETY_SUPPORT.displayPrice}.` },
            ].map((row) => (
              <div key={row.t} className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="font-bold text-slate-900">{row.t}</p>
                <p className="text-sm text-slate-700">{row.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S12 · RECOMMENDATION SUPPORT ── */}
      <section className="py-16 md:py-20 bg-white" data-testid="services-rec-entry-section">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Still not sure where to begin?</h2>
            <div className="flex flex-col items-center gap-3">
              {RECOMMENDATION_ROUTER_ENABLED ? (
                <Link
                  to="/recommendation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold text-slate-900 min-h-[44px]"
                  style={{ backgroundColor: GOLD }}
                  data-testid="services-rec-entry-cta"
                  onClick={() => trackEvent('services_rec_entry_cta', { flag: 'on' })}
                >
                  Find My Starting Point <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => { trackEvent('services_rec_entry_cta', { flag: 'off' }); scrollTo('services-compare'); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold text-slate-900 min-h-[44px] border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                  data-testid="services-rec-entry-cta"
                >
                  Compare the Three Reviews
                </button>
              )}
              <Link to="/contact" className="text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900" data-testid="services-rec-entry-secondary-link">
                Contact GigLine
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S13 · FAQ ── */}
      <section className="py-20 md:py-24 bg-slate-50" data-testid="services-faq-section">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Frequently asked questions</h2>
          </Reveal>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} data-testid={`services-faq-item-${i}`}>
                  <button
                    type="button"
                    className="w-full text-left flex items-center justify-between gap-3 px-5 py-4 font-semibold text-slate-900 hover:bg-slate-50 min-h-[44px]"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`services-faq-panel-${i}`}
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div id={`services-faq-panel-${i}`} className="px-5 pb-5 text-sm text-slate-700 leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── S14 · FOUNDER CREDIBILITY ── */}
      <section className="py-20 md:py-24 bg-white" data-testid="services-founder-section">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[200px_1fr] items-start">
              <img src="/vince-founder.webp" alt="Vince Lawrence, GigLine Safety and Compliance founder" width="200" height="200" className="rounded-lg w-full max-w-[200px]" data-testid="services-founder-photo" loading="lazy" />
              <div>
                <p className="uppercase mb-2" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>About the founder</p>
                <p className="text-xl font-bold text-slate-900 mb-2">Vince Lawrence, Founder</p>
                <p className="text-sm text-slate-700 mb-4" data-testid="services-founder-credential">
                  OSHA 30-Hour General Industry Trained · U.S. Navy Veteran · 25+ years in manufacturing, fleet, and warehouse safety.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  GigLine was founded to help small industrial operations understand what requires attention on the floor, what leadership needs to document, and what to do next. Every engagement is scoped and priced in writing before work begins.
                </p>
                <Link to="/about" className="inline-flex items-center gap-1 text-sm text-slate-900 font-semibold underline underline-offset-4" data-testid="services-about-link">
                  Learn more about GigLine <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S15 · FINAL CTA ── */}
      <section className="py-20 md:py-24 text-white" style={{ backgroundColor: NAVY_DEEP }} data-testid="services-final-cta-section">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start by finding what requires attention.</h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl mx-auto">
              Choose the focused review that fits your current concern, or begin with the Compliance Readiness Visit for a coordinated review of the floor and documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/intake?service=compliance-readiness-visit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-bold text-slate-900 min-h-[44px]"
                style={{ backgroundColor: GOLD }}
                data-testid="services-final-cta-primary"
                onClick={() => trackEvent('services_final_cta_primary', {})}
              >
                Request a Compliance Readiness Visit <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => { trackEvent('services_final_cta_secondary', {}); scrollTo('services-compare'); }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors min-h-[44px]"
                data-testid="services-final-cta-secondary"
              >
                Compare the Three Reviews
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
