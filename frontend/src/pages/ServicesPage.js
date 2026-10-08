import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronRight, Phone, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { trackEvent, trackPhoneClick } from '../utils/analytics';
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

const NAVY_DEEP = '#0a1a2e';
const GOLD = '#c9a961';
const mono = { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace' };
const PHONE_DISPLAY = '(336) 329-8899';
const PHONE_HREF = 'tel:+13363298899';
const TALK_TO_VINCE_HREF = '/intake?service=compliance-readiness-visit#talk-to-vince';

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

// Approved CRV deliverables (owner-confirmed Feb 2026). Deliberately
// conservative, no page count, no compliance percentage, no tracker,
// no follow-up call, no bundled products. See /app/memory/PRD.md.
const CRV_DELIVERABLES = [
  'On-site review of observable workplace conditions and work practices.',
  'Review of applicable safety programs, training records, inspection records, and other supporting documentation within the agreed scope.',
  'Written findings identifying floor and documentation gaps.',
  'Prioritized corrective-action recommendations and practical next steps.',
];

const AFTER_SUBMIT_STEPS = [
  { t: 'You send the inquiry', d: 'Submitting the short form or the full intake requests a discussion, scope, and quote. It does not purchase a service or begin a paid engagement.' },
  { t: 'Vince reviews and reaches back out', d: 'Vince reviews what you shared and follows up to confirm the operation, requested service, location, workforce, and any scheduling constraints.' },
  { t: 'Written scope and price', d: 'Final scope and fixed price are confirmed in writing before the visit is scheduled.' },
  { t: 'Service completed and written report delivered', d: 'The Safety Walkthrough report is delivered within 48 hours of the on-site visit. The Compliance Readiness Visit report is delivered within 5 business days of the on-site visit. The Documentation Readiness Review report is delivered within 5 business days.' },
];

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
    { q: 'Are corrections included in the Compliance Readiness Visit?', a: 'No. The CRV identifies and prioritizes gaps. Corrective implementation is scoped and quoted separately.' },
    { q: 'Why does the CRV cost less than purchasing both reviews separately?', a: `For standard scope, the two reviews total $${COMBINED_SEPARATE_TOTAL.toLocaleString()} when purchased separately. The combined CRV is $${COMPLIANCE_READINESS_VISIT.amount.toLocaleString()}, a $${COMBINED_SAVINGS} difference reflecting a coordinated single visit. Final scope and price are confirmed in writing before scheduling and may vary when scope expands.` },
    { q: 'When is the written report delivered?', a: 'The Safety Walkthrough report is delivered within 48 hours of the on-site visit. The Compliance Readiness Visit report is delivered within 5 business days of the on-site visit. The Documentation Readiness Review report is delivered within 5 business days.' },
    { q: 'Does submitting an inquiry commit me to purchasing a service?', a: 'No. Submitting the short form or the full intake requests a discussion, scope, and quote. Nothing is purchased and no visit is scheduled until the written scope and fixed price are agreed.' },
    { q: 'Does GigLine guarantee OSHA compliance?', a: 'No. GigLine provides independent readiness, implementation, and support services according to the written scope. These services do not guarantee compliance, prevent citations, or replace legal advice.' },
    { q: 'Can we start with a readiness kit?', a: 'Yes, when the need is focused and the organization is prepared to implement the material internally.' },
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
        title="Know what needs attention. Know what to fix first. | GigLine Services"
        description="GigLine reviews workplace conditions and safety documentation so Piedmont Triad manufacturers, warehouses, contractors, and fleet operations can see the gaps, set priorities, and give their teams clear next steps. Fixed quote in writing before scheduling."
        canonical="/services"
        jsonLd={jsonLd}
      />

      {/* ── S1 · RESULT-FOCUSED HERO ── */}
      <section className="relative py-20 md:py-28 md:pr-16 lg:pr-20 text-white overflow-hidden" style={{ backgroundColor: NAVY_DEEP }} data-testid="services-hero-section">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, #12253f 100%)` }} aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-4" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Safety and compliance services</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl" data-testid="services-hero-h1">
              Know what needs attention. Know what to fix first.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-4 max-w-3xl" data-testid="services-hero-sub">
              GigLine reviews your workplace conditions and safety documentation so you can see the gaps, set priorities, and give your team clear next steps.
            </p>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl" data-testid="services-hero-audience">
              On-site support for manufacturers, warehouses, contractors, and fleet operations across the Piedmont Triad.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => trackEvent('services_hero_primary_cta', { destination: 'intake' })}
                data-testid="services-hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-bold text-slate-900 min-h-[44px]"
                style={{ backgroundColor: GOLD }}
              >
                Request a Compliance Readiness Visit <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/sample-report"
                onClick={() => trackEvent('services_hero_secondary_cta', { destination: 'sample-report' })}
                data-testid="services-hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors min-h-[44px]"
              >
                See a Sample Report
              </Link>
              <Link
                to={TALK_TO_VINCE_HREF}
                onClick={() => trackEvent('services_hero_talk_to_vince_cta', {})}
                data-testid="services-hero-cta-talk"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white/50 text-white hover:border-white transition-colors min-h-[44px]"
              >
                Talk to Vince First
              </Link>
            </div>
            <p className="text-sm text-slate-300 mb-2" data-testid="services-hero-price-line">
              Starting at {COMPLIANCE_READINESS_VISIT.displayPrice}. Final scope and price confirmed in writing before scheduling.
            </p>
            <p className="text-sm text-slate-300" data-testid="services-hero-phone-line">
              Prefer to talk first? Call Vince at{' '}
              <a
                href={PHONE_HREF}
                className="text-white font-semibold underline underline-offset-4 hover:text-slate-100"
                onClick={() => trackPhoneClick('services_hero')}
                data-testid="services-hero-phone-link"
              >
                {PHONE_DISPLAY}
              </a>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── S2 · CREDIBILITY + SAMPLE REPORT PREVIEW ── */}
      <section className="py-16 md:py-20 md:pr-16 lg:pr-20 bg-white" data-testid="services-credibility-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[200px_1fr_1fr] items-start">
              <img
                src="/vince-founder.webp"
                alt="Vince Lawrence, GigLine Safety and Compliance founder"
                width="200"
                height="200"
                className="rounded-lg w-full max-w-[200px]"
                data-testid="services-credibility-photo"
                loading="lazy"
              />
              <div data-testid="services-credibility-bio">
                <p className="uppercase mb-2" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Who you work with</p>
                <p className="text-xl font-bold text-slate-900 mb-2">Vince Lawrence, Founder</p>
                <p className="text-sm text-slate-700 mb-4" data-testid="services-credibility-credential">
                  OSHA 30-Hour General Industry Trained · U.S. Navy Veteran · 25+ years in manufacturing, fleet, and warehouse safety.
                </p>
                <a
                  href="https://www.google.com/search?q=GigLine+Safety+%26+Compliance+Kernersville+NC&stick=&hl=en&reviews=1&utm_source=services&utm_medium=website&utm_campaign=credibility-review-read"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors hover:bg-amber-50"
                  style={{ borderColor: '#c8922a', color: '#8c6a28', background: '#fffaf0' }}
                  data-testid="services-credibility-reviews-chip"
                  aria-label="Read 5.0-star Google reviews for GigLine Safety and Compliance"
                >
                  <Star size={12} strokeWidth={2.5} fill="#c8922a" aria-hidden="true" />
                  <span>5.0 on Google Reviews</span>
                  <ChevronRight size={12} aria-hidden="true" />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Every engagement is scoped and priced in writing before work begins. You know what Vince will review, how long it will take, and what the written report will cover.
                </p>
                <Link to="/about" className="inline-flex items-center gap-1 text-sm text-slate-900 font-semibold underline underline-offset-4" data-testid="services-credibility-about-link">
                  Learn more about GigLine <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="p-5 rounded-lg border border-slate-200 bg-slate-50" data-testid="services-sample-report-card">
                <p className="uppercase mb-2" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Report preview</p>
                <p className="text-lg font-bold text-slate-900 mb-2">See what the written report looks like.</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Download an illustrative report example showing how GigLine documents findings, references CFR standards, and prioritizes next steps.
                </p>
                <Link
                  to="/sample-report"
                  onClick={() => trackEvent('services_sample_report_cta', {})}
                  data-testid="services-sample-report-cta"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors text-sm"
                >
                  See a Sample Report <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S3 · FEATURED COMPLIANCE READINESS VISIT ── */}
      <section className="py-20 md:py-24 bg-slate-50 md:pr-16 lg:pr-20" data-testid="services-crv-feature-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>The most complete diagnostic starting point</p>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Compliance Readiness Visit</h2>
              <p className="text-2xl md:text-3xl font-bold text-slate-900" data-testid="services-crv-price">
                {COMPLIANCE_READINESS_VISIT.displayPrice}
              </p>
            </div>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
              A coordinated single visit that reviews the floor and the documentation together, so leadership can see whether workplace practices and written safety records support each other.
            </p>

            <p className="text-sm font-bold uppercase mb-3" style={{ color: '#a7842f', letterSpacing: '0.2em', ...mono }}>
              What you receive
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 mb-6" data-testid="services-crv-deliverables">
              {CRV_DELIVERABLES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm md:text-base text-slate-800 leading-relaxed">
                  <Check size={16} className="text-emerald-600 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 mb-6 rounded-md border-l-4 bg-white" style={{ borderColor: GOLD }} data-testid="services-crv-implementation-note">
              <p className="text-sm md:text-base text-slate-800 leading-relaxed">
                <strong>Corrective implementation is not included.</strong> If findings require remediation beyond your team's internal effort, GigLine scopes and quotes that work separately before any implementation begins.
              </p>
            </div>

            <div className="p-4 mb-8 rounded-md bg-white border border-slate-200" data-testid="services-crv-savings-note">
              <p className="text-sm md:text-base text-slate-800 leading-relaxed">
                <strong>Save ${COMBINED_SAVINGS} on standard scope.</strong> Buying the Safety Walkthrough and Documentation Readiness Review separately totals ${COMBINED_SEPARATE_TOTAL.toLocaleString()}. The combined CRV is {COMPLIANCE_READINESS_VISIT.displayPrice}. Final scope and price are confirmed in writing before scheduling and may vary when scope expands.
              </p>
            </div>

            <p className="text-sm text-slate-700 mb-6" data-testid="services-crv-turnaround-line">
              Written report delivered within 5 business days of the on-site visit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/intake?service=compliance-readiness-visit"
                onClick={() => trackEvent('services_crv_cta_click', {})}
                data-testid="services-crv-primary-cta"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-bold text-slate-900 min-h-[44px]"
                style={{ backgroundColor: GOLD }}
              >
                Request a Compliance Readiness Visit <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to={TALK_TO_VINCE_HREF}
                onClick={() => trackEvent('services_crv_talk_to_vince_cta', {})}
                data-testid="services-crv-talk-cta"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors min-h-[44px]"
              >
                Talk to Vince First
              </Link>
              <Link
                to="/services/compliance-readiness-visit"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4 min-h-[44px]"
                data-testid="services-crv-learn-more"
              >
                Read the full scope <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S4 · THREE-REVIEW COMPARISON ── */}
      <section id="services-compare" className="py-20 md:py-24 bg-white md:pr-16 lg:pr-20" data-testid="services-comparison-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Compare the three reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose the review that matches the question you need answered.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              A short "Best for" note sits at the top of each option so you can match the review to the concern on your floor today.
            </p>
          </Reveal>

          {/* "Best for" cards */}
          <div className="grid gap-5 md:grid-cols-3 mb-10">
            <div className="p-5 rounded-xl border border-slate-200 bg-white" data-testid="services-bestfor-walkthrough">
              <p className="uppercase mb-1" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Best for</p>
              <p className="text-base font-bold text-slate-900 mb-1">Safety Walkthrough</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">Concerns about visible hazards and workplace practices.</p>
              <p className="text-sm font-semibold text-slate-900">{SAFETY_WALKTHROUGH.displayPrice} · report in 48 hours</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-white" data-testid="services-bestfor-docreview">
              <p className="uppercase mb-1" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Best for</p>
              <p className="text-base font-bold text-slate-900 mb-1">Documentation Readiness Review</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">Concerns about written programs and safety records.</p>
              <p className="text-sm font-semibold text-slate-900">{DOCUMENTATION_REVIEW.displayPrice} · report in 5 business days</p>
            </div>
            <div className="p-5 rounded-xl border-2 bg-white shadow-sm relative" style={{ borderColor: GOLD, backgroundColor: '#fffaf0' }} data-testid="services-bestfor-crv">
              <div className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: GOLD, color: NAVY_DEEP }}>
                <Star size={10} className="inline mr-1" aria-hidden="true" /> Recommended
              </div>
              <p className="uppercase mb-1 mt-1" style={{ ...mono, fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>Best for</p>
              <p className="text-base font-bold text-slate-900 mb-1">Compliance Readiness Visit</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">Concerns about both, or uncertainty about where the gaps are.</p>
              <p className="text-sm font-semibold text-slate-900">{COMPLIANCE_READINESS_VISIT.displayPrice} · report in 5 business days</p>
            </div>
          </div>

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
                <tr className="border-t border-slate-200 bg-white">
                  <td className="p-4 text-slate-900 font-semibold">Written report delivered</td>
                  <td className="p-4 text-center text-slate-800">Within 48 hours of visit</td>
                  <td className="p-4 text-center text-slate-800">Within 5 business days</td>
                  <td className="p-4 text-center font-semibold text-slate-900" style={{ backgroundColor: '#fffaf0' }}>Within 5 business days of visit</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link
              to="/blog/how-much-does-an-osha-safety-consultant-cost-in"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-amber-700 transition-colors"
              data-testid="pricing-guide-link"
              onClick={() => trackEvent('services_pricing_guide_click', {})}
            >
              See the full OSHA safety consultant cost breakdown
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
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
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {mobileCompareKey === 'walkthrough' && SAFETY_WALKTHROUGH.displayPrice}
                {mobileCompareKey === 'docreview' && DOCUMENTATION_REVIEW.displayPrice}
                {mobileCompareKey === 'crv' && COMPLIANCE_READINESS_VISIT.displayPrice}
              </p>
              <p className="text-xs text-slate-600 mb-4">
                {mobileCompareKey === 'walkthrough' && 'Report within 48 hours of visit.'}
                {mobileCompareKey === 'docreview' && 'Report within 5 business days.'}
                {mobileCompareKey === 'crv' && 'Report within 5 business days of visit.'}
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

      {/* ── S5 · WHAT HAPPENS AFTER SUBMITTING A REQUEST ── */}
      <section className="py-20 md:py-24 md:pr-16 lg:pr-20 bg-slate-50" data-testid="services-after-submit-section">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>After you submit a request</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Submitting an inquiry asks for a scope and quote. It does not purchase a service.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              You stay in control at every step. Here is what happens from the moment you hit send.
            </p>
          </Reveal>
          <ol className="grid gap-5 md:grid-cols-2" data-testid="services-after-submit-steps">
            {AFTER_SUBMIT_STEPS.map((s, i) => (
              <li key={s.t} className="p-5 bg-white rounded-lg border border-slate-200 flex gap-4" data-testid={`services-after-submit-step-${i + 1}`}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: GOLD, color: NAVY_DEEP }} aria-hidden="true">
                  {i + 1}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 mb-1">{s.t}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to={TALK_TO_VINCE_HREF}
              onClick={() => trackEvent('services_after_submit_talk_cta', {})}
              data-testid="services-after-submit-talk-cta"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-bold text-slate-900 min-h-[44px]"
              style={{ backgroundColor: GOLD }}
            >
              Talk to Vince First <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={PHONE_HREF}
              onClick={() => trackPhoneClick('services_after_submit')}
              data-testid="services-after-submit-phone-link"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors min-h-[44px]"
            >
              <Phone size={16} aria-hidden="true" /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ── S6 · CORRECTIVE IMPLEMENTATION · CONTROL SYSTEM · ONGOING SUPPORT ── */}
      <section className="py-20 md:py-24 md:pr-16 lg:pr-20 bg-white" data-testid="services-after-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <p className="uppercase mb-3" style={{ ...mono, fontSize: '11px', color: GOLD, letterSpacing: '0.24em' }}>Beyond the assessment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">If gaps need remediation, you decide the path.</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
              The diagnostic review identifies and prioritizes the gaps. Your team may complete the work internally, or GigLine can provide a separately scoped proposal for implementation, broader system buildout, or ongoing support.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="services-after-card-cai">
              <p className="text-lg font-bold text-slate-900 mb-2">Corrective Action Implementation</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">GigLine can separately scope selected corrective-action work. A written proposal defines responsibilities, exclusions, schedule, and fixed price before implementation begins.</p>
              <p className="text-sm font-semibold text-slate-900 mb-4">Custom quote. Most projects begin at ${CORRECTIVE_ACTION_IMPLEMENTATION.amountFrom.toLocaleString()}.</p>
              {secCta('Request an Implementation Discussion', '/intake?service=corrective-action-implementation', 'services-after-cai-cta')}
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="services-after-card-oss-build">
              <p className="text-lg font-bold text-slate-900 mb-2">OSHA-Ready Control System</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">For operations needing a broader buildout, GigLine can scope the controls, written documentation, training records, and tracking structures needed to maintain a functioning safety program.</p>
              <p className="text-sm font-semibold text-slate-900 mb-4">Starting at {SAFETY_CONTROL_SYSTEM_BUILDOUT.displayPrice}.</p>
              {secCta('Explore the OSHA-Ready Control System', '/services/safety-control-system-buildout', 'services-after-oss-build-cta')}
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200" data-testid="services-after-card-ongoing">
              <p className="text-lg font-bold text-slate-900 mb-2">Ongoing Safety Support</p>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">For operations with the appropriate foundation and leadership commitment: on-site visits, record reviews, corrective-action tracking, and leadership meetings on a recurring cadence.</p>
              <p className="text-sm font-semibold text-slate-900 mb-4">Starting at {ONGOING_SAFETY_SUPPORT.displayPrice}.</p>
              {secCta('Review Ongoing Safety Support', '/ongoing-safety-support', 'services-after-ongoing-cta')}
            </div>
          </div>
        </div>
      </section>

      {/* ── S7 · COMPACT SELF-SERVE KITS ── */}
      <section className="py-16 md:py-20 md:pr-16 lg:pr-20 bg-slate-50" data-testid="services-kits-section">
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
          {secCta('View All Readiness Kits', '/citation-proof-kits', 'services-kits-all-cta')}
        </div>
      </section>

      {/* ── S8 · FAQ + FINAL CTA ── */}
      <section className="py-20 md:py-24 md:pr-16 lg:pr-20 bg-white" data-testid="services-faq-section">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Frequently asked questions</h2>
          </Reveal>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} data-testid={`services-faq-item-${i}`}>
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

      {/* ── S9 · FINAL CTA ── */}
      <section className="py-20 md:py-24 md:pr-16 lg:pr-20 text-white" style={{ backgroundColor: NAVY_DEEP }} data-testid="services-final-cta-section">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start by seeing where you stand.</h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl mx-auto">
              Request a Compliance Readiness Visit, see a sample report, or talk to Vince first. Nothing is scheduled until the written scope and fixed price are agreed.
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
              <Link
                to="/sample-report"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors min-h-[44px]"
                data-testid="services-final-cta-secondary"
                onClick={() => trackEvent('services_final_cta_secondary', {})}
              >
                See a Sample Report
              </Link>
              <Link
                to={TALK_TO_VINCE_HREF}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold border-2 border-white/50 text-white hover:border-white transition-colors min-h-[44px]"
                data-testid="services-final-cta-talk"
                onClick={() => trackEvent('services_final_cta_talk', {})}
              >
                Talk to Vince First
              </Link>
            </div>
            <p className="text-sm text-slate-300 mt-6" data-testid="services-final-phone-line">
              Or call Vince directly at{' '}
              <a
                href={PHONE_HREF}
                className="text-white font-semibold underline underline-offset-4 hover:text-slate-100"
                onClick={() => trackPhoneClick('services_final')}
                data-testid="services-final-phone-link"
              >
                {PHONE_DISPLAY}
              </a>.
            </p>
            <p className="text-xs text-slate-400 mt-8 max-w-xl mx-auto">
              Not sure whether you need a private consultant?{' '}
              <Link
                to="/nc-dol-consultation-vs-private-consultant"
                className="text-slate-200 underline underline-offset-4 hover:text-white"
                data-testid="services-nc-dol-comparison-link"
              >
                Compare GigLine with the NC DOL On-Site Consultation Program
              </Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
