import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Shield, RefreshCw, FileText, Download } from 'lucide-react';
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

const SERVICES = [
  {
    num: '01',
    key: 'walkthrough_standard',
    title: 'Safety Walkthrough & Top 10 Fixes Report',
    bestWhen: [
      'You want to know where you stand before OSHA shows up',
      'You\u2019ve had recent growth, new employees, or facility changes',
      'You\u2019re about to go through an insurance review',
    ],
    whatYouGet: [
      'On-site walkthrough (1\u20133 hours)',
      'Photo-documented hazard findings',
      'OSHA standard referenced for each finding',
      'Top 10 Fixes report \u2014 RED / AMBER / GREEN priority',
      'Delivered within 24\u201348 hours',
    ],
    price: '$650',
    cta: { label: 'Request a Walkthrough', subline: 'Vince calls back within one business day.' },
    testId: 'book-walkthrough',
    featured: true,
  },
  {
    num: '02',
    key: 'documentation_remote',
    title: 'Documentation Review & Gap Check',
    bestWhen: [
      'You\u2019re preparing for an audit or OSHA inspection',
      'Your written programs, training records, or SDS files haven\u2019t been reviewed in a while',
      'You need to know what\u2019s missing before someone else finds it',
    ],
    whatYouGet: [
      'Review of written safety programs',
      'Training record and inspection log audit',
      'SDS binder and HazCom program check',
      'Written gap report with missing elements identified',
      'Available remote or on-site',
    ],
    price: '$550',
    cta: { label: 'Request a Review', subline: 'Vince calls back within one business day.' },
    testId: 'book-documentation',
    featured: false,
  },
  {
    num: '03',
    key: 'incident_standard',
    title: 'Incident Review & Corrective Action Support',
    bestWhen: [
      'You\u2019ve had a recordable injury or near-miss',
      'You need documentation that holds up under OSHA or insurance review',
      'You need to identify what broke down and build a corrective action record',
    ],
    whatYouGet: [
      'On-site or remote incident review',
      'Root cause documentation',
      'Written corrective action plan',
      'OSHA recordkeeping guidance',
      'Support for insurance or compliance follow-up',
    ],
    price: '$900',
    cta: { label: 'Request Support', subline: 'Initial response within 24\u201348 hours.' },
    testId: 'book-incident',
    featured: false,
  },
];

const ServicesPage = () => {
  return (
    <main data-testid="services-page" className="overflow-x-hidden">
      <SEO
        title="OSHA Walkthrough & Compliance Services — From $550 | GigLine"
        description="On-site walkthroughs from $650. Documentation reviews from $550. Incident response from $900. Fixed quote before scheduling. No retainer."
        canonical="/services"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'GigLine Safety Consulting Services',
            itemListElement: [
              { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance' }, offers: { '@type': 'Offer', price: '650', priceCurrency: 'USD' } } },
              { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Documentation Review & Gap Check', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance' }, offers: { '@type': 'Offer', price: '550', priceCurrency: 'USD' } } },
              { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Incident Review & Corrective Action Support', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance' }, offers: { '@type': 'Offer', price: '900', priceCurrency: 'USD' } } },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' },
            ],
          },
        ]}
      />

      <style>{`
        .reveal-fade{opacity:0;transform:translateY(20px);transition:opacity 500ms ease-out,transform 500ms ease-out}
        .reveal-fade.revealed{opacity:1;transform:translateY(0)}
      `}</style>

      {/* ═══════════════════════════════════════════════
          S1 — INTRO  (asymmetric 60/40, mirrors homepage hero)
      ═══════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{ backgroundColor: '#0B1F33' }}
        data-testid="services-intro"
      >
        <div className="flex flex-col md:flex-row min-h-[55vh] md:min-h-[68vh]">
          {/* Left — Photo */}
          <div className="relative w-full md:w-3/5 h-[40vh] md:h-auto overflow-hidden bg-[#0B1F33]">
            <picture>
              <source srcSet="/services-hero.webp" type="image/webp" />
              <img
                src="/services-hero.jpg"
                alt="GigLine safety walkthrough — inspector in PPE documenting a blocked electrical panel violation"
                className="absolute inset-0 w-full h-full object-cover object-[82%_center] scale-110"
                style={{ filter: 'contrast(1.10) saturate(1.05) brightness(0.93)' }}
                loading="eager"
                fetchpriority="high"
              />
            </picture>

            {/* Cinematic vignette — dark at top corners */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 60%, transparent 50%, rgba(11,31,51,0.55) 100%)',
              }}
            />

            {/* Top bar darken — adds drama, separates from nav */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-32 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(11,31,51,0.5), transparent)' }}
            />

            {/* Right-edge fade into navy panel */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-2/5 bg-gradient-to-r from-transparent via-[#0B1F33]/55 to-[#0B1F33] pointer-events-none" />

            {/* Bottom fade for mobile */}
            <div className="md:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1F33] to-transparent pointer-events-none" />

            {/* Sharp blue accent rule — drama */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-0 bottom-12 w-20 h-[3px] bg-[#1F6FEB]"
            />
          </div>

          {/* Right — Copy */}
          <div className="w-full md:w-2/5 flex items-center px-6 md:px-14 lg:px-20 py-16 md:py-0 relative z-10">
            <Reveal>
              <p
                className="uppercase tracking-[3px] text-[#1F6FEB] mb-5 font-bold"
                style={{ ...mono, fontSize: '12px' }}
                data-testid="services-kicker"
              >
                The Services
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6"
                data-testid="services-intro-1"
              >
                Three engagements.{' '}
                <span className="block mt-3">
                  <span style={{ borderBottom: '2px solid #1F6FEB', paddingBottom: '2px' }}>
                    One standard.
                  </span>
                </span>
              </h1>
              <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-6 max-w-md">
                GigLine serves small manufacturers, warehouses, contractors, and fleet operations in the Piedmont Triad that don&rsquo;t have a full-time safety manager on staff.
              </p>
              <p
                className="text-sm md:text-base text-white leading-relaxed max-w-md font-semibold"
                data-testid="services-intro-2"
              >
                Every engagement is a <span className="text-[#1F6FEB]">fixed quote</span> before scheduling. No retainer. No hourly billing.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S2 — THREE SERVICE CARDS
          Light blue-grey bg matches Testimonials section on homepage.
          Cards use rounded-xl + soft blue-tinted border + soft shadow.
      ═══════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 bg-white"
        data-testid="services-cards-section"
      >
        <div className="container max-w-6xl">
          <Reveal>
            <div className="mb-14 md:mb-16 max-w-3xl">
              <p
                className="uppercase tracking-[3px] text-[#1F6FEB] mb-4 font-bold"
                style={{ ...mono, fontSize: '12px' }}
              >
                Choose Your Engagement
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#102133] leading-tight" data-testid="services-cards-heading">
                Each service starts with a fixed price, ends with a written deliverable.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-7">
            {SERVICES.map((svc, idx) => (
              <Reveal key={svc.num} delay={idx * 120}>
                <article
                  className="relative h-full rounded-xl flex flex-col bg-[#F7F9FC] overflow-hidden"
                  style={{
                    border: svc.featured
                      ? '1px solid rgba(31,111,235,0.35)'
                      : '1px solid rgba(31,111,235,0.15)',
                    boxShadow: svc.featured
                      ? '0 4px 24px rgba(31,111,235,0.10)'
                      : '0 2px 12px rgba(11,31,51,0.04)',
                  }}
                  data-testid={`service-card-${svc.num}`}
                >
                  {/* Featured ribbon */}
                  {svc.featured && (
                    <div
                      className="absolute top-5 right-5 bg-[#1F6FEB] text-white px-3 py-1 rounded-full"
                      style={{ ...mono, fontSize: '9px', letterSpacing: '0.18em' }}
                      data-testid={`featured-badge-${svc.num}`}
                    >
                      MOST BOOKED
                    </div>
                  )}

                  {/* HEAD — numeral + title */}
                  <div className="px-7 md:px-8 pt-9 pb-7">
                    <p
                      className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold"
                      style={{ ...mono, fontSize: '12px' }}
                    >
                      Service {svc.num}
                    </p>
                    <h3 className="text-xl md:text-[22px] font-bold text-[#102133] leading-[1.25]">
                      {svc.title}
                    </h3>
                  </div>

                  {/* BODY */}
                  <div className="px-7 md:px-8 flex-grow flex flex-col gap-7 pb-8">
                    <div>
                      <p
                        className="uppercase tracking-[2.5px] text-[#0B1F33] mb-3 font-bold"
                        style={{ ...mono, fontSize: '11px' }}
                      >
                        Best When
                      </p>
                      <ul className="space-y-2.5" data-testid={`service-bestwhen-${svc.num}`}>
                        {svc.bestWhen.map((line, i) => (
                          <li key={i} className="flex gap-3 text-[#102133]/85 text-[14.5px] leading-[1.55]">
                            <span
                              className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1F6FEB] mt-[8px]"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex-grow">
                      <p
                        className="uppercase tracking-[2.5px] text-[#0B1F33] mb-3 font-bold"
                        style={{ ...mono, fontSize: '11px' }}
                      >
                        What You Get
                      </p>
                      <ul className="space-y-2.5" data-testid={`service-whatyouget-${svc.num}`}>
                        {svc.whatYouGet.map((line, i) => (
                          <li key={i} className="flex gap-3 text-[#102133]/85 text-[14.5px] leading-[1.55]">
                            <span
                              className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#102133]/30 mt-[8px]"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* PRICE — soft-edged module */}
                  <div className="mx-7 md:mx-8 mb-5 rounded-lg bg-white border border-[#1F6FEB]/15 px-5 py-4 flex items-baseline justify-between" data-testid={`price-${svc.num}`}>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="uppercase tracking-[2px] text-[#0B1F33] font-bold"
                        style={{ ...mono, fontSize: '11px' }}
                      >
                        Starting at
                      </span>
                      <span className="text-[#1F6FEB] font-bold text-[28px] leading-none">
                        {svc.price}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#102133]/45 italic">fixed quote</span>
                  </div>

                  {/* CTA */}
                  <div className="px-7 md:px-8 pb-8">
                    <Link
                      to={`/request-walkthrough?service=${svc.key}`}
                      onClick={() => trackServiceBooking(svc.key)}
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold py-4 rounded-lg transition-colors text-[15px] shadow-lg shadow-[#1F6FEB]/20 group/cta"
                      data-testid={svc.testId}
                    >
                      <span>{svc.cta.label}</span>
                      <ArrowRight size={17} className="transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                    <p
                      className="mt-3 text-[#102133]/60 text-[13px] flex items-center justify-center gap-2"
                      data-testid={`cta-subline-${svc.num}`}
                    >
                      <Phone size={11} className="flex-shrink-0 text-[#1F6FEB]" />
                      {svc.cta.subline}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CASE STUDY TEASER  (real outcome before sample report)
      ═══════════════════════════════════════════════ */}
      <CaseStudyTeaser source="services" />

      {/* ═══════════════════════════════════════════════
          GL-WEB-012 — SAMPLE REPORT SECTION
          Static, document-style example of the actual deliverable.
      ═══════════════════════════════════════════════ */}
      <SampleReportSection />

      {/* ═══════════════════════════════════════════════
          S3 — COVERAGE AND LOGISTICS  (light blue-grey, on-brand)
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: '#F7F9FC' }}
        data-testid="services-coverage"
      >
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#1F6FEB] mb-4 font-bold"
              style={{ ...mono, fontSize: '12px' }}
            >
              Logistics
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-12 md:mb-16 max-w-3xl leading-tight">
              Where GigLine works &mdash; and how booking flows from request to scheduled date.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-7">
            <Reveal>
              <div
                className="h-full rounded-xl p-8 md:p-10 bg-white"
                style={{
                  border: '1px solid rgba(31,111,235,0.15)',
                  boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-lg bg-[#1F6FEB]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#1F6FEB]" />
                  </span>
                  <p
                    className="uppercase tracking-[3px] text-[#1F6FEB] font-bold"
                    style={{ ...mono, fontSize: '12px' }}
                  >
                    Service Area
                  </p>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#102133] mb-4 leading-snug">
                  Within 60 miles of Winston-Salem.
                </h3>
                <p
                  className="text-[#102133]/75 leading-relaxed text-base"
                  data-testid="services-coverage-area"
                >
                  Including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities. Documentation Review is available remotely for operations outside the Triad.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div
                className="h-full rounded-xl p-8 md:p-10 bg-white"
                style={{
                  border: '1px solid rgba(31,111,235,0.15)',
                  boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-lg bg-[#1F6FEB]/10 flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={18} className="text-[#1F6FEB]" />
                  </span>
                  <p
                    className="uppercase tracking-[3px] text-[#1F6FEB] font-bold"
                    style={{ ...mono, fontSize: '12px' }}
                  >
                    How Booking Works
                  </p>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#102133] mb-4 leading-snug">
                  Nothing is scheduled until the price is agreed.
                </h3>
                <p
                  className="text-[#102133]/75 leading-relaxed text-base"
                  data-testid="services-coverage-booking"
                >
                  Submit the short request form. Vince calls back within one business day with scheduling options and a confirmed fixed price.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S4 — SAFETY CHECK BAND  (deliberately quieter)
      ═══════════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 bg-white border-y border-[#1F6FEB]/12"
        data-testid="services-safety-check-band"
      >
        <div className="container max-w-5xl">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:max-w-2xl">
                <p
                  className="uppercase tracking-[3px] text-[#1F6FEB] mb-3 font-bold"
                  style={{ ...mono, fontSize: '12px' }}
                >
                  Not sure where to start?
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-[#102133] leading-snug">
                  Take the free 90-Second Safety Check.
                </h2>
                <p className="text-base text-[#102133]/70 mt-2">
                  Six yes-or-no questions. Instant risk score. No email required.
                </p>
              </div>
              <Link
                to="/safety-check"
                className="inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-7 py-4 rounded-lg whitespace-nowrap transition-colors text-[15px] shadow-lg shadow-[#1F6FEB]/20"
                data-testid="services-safety-check-link"
              >
                Take the Safety Check
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S4b — HAZCOM STARTER PACK (standalone $29 resource)
      ═══════════════════════════════════════════════ */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: '#F7F9FC' }}
        data-testid="services-hazcom-pack"
      >
        <div className="container max-w-5xl">
          <Reveal>
            <article
              className="bg-white rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(31,111,235,0.15)',
                boxShadow: '0 4px 24px rgba(11,31,51,0.06)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-10 p-8 md:p-10 items-center">
                {/* LEFT — copy */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-lg bg-[#1F6FEB]/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={17} className="text-[#1F6FEB]" />
                    </span>
                    <p
                      className="uppercase tracking-[3px] text-[#1F6FEB] font-bold"
                      style={{ ...mono, fontSize: '12px' }}
                      data-testid="hazcom-kicker"
                    >
                      Standalone Resource
                    </p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#102133] leading-tight mb-4">
                    HazCom Starter Pack
                  </h2>
                  <p className="text-base md:text-lg text-[#102133]/75 leading-relaxed max-w-xl">
                    A ready-made written Hazard Communication program. Download immediately &mdash; no walkthrough required.
                  </p>
                </div>

                {/* RIGHT — price + CTA */}
                <div className="flex flex-col items-start md:items-end gap-4 md:min-w-[200px]">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="uppercase tracking-[2px] text-[#0B1F33] font-bold"
                      style={{ ...mono, fontSize: '11px' }}
                    >
                      One-time
                    </span>
                    <span className="text-[#1F6FEB] font-bold text-[40px] leading-none">$29</span>
                  </div>
                  <Link
                    to="/hazcom"
                    className="inline-flex items-center justify-center gap-2 bg-[#0B1F33] hover:bg-[#1F6FEB] text-white font-bold py-3.5 px-6 rounded-lg transition-colors text-[15px] shadow-lg shadow-[#0B1F33]/15 group/cta whitespace-nowrap"
                    data-testid="hazcom-cta"
                  >
                    <Download size={16} />
                    <span>Get It Now</span>
                    <ArrowRight size={16} className="transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S5 — PROOF & REASSURANCE  (atmospheric navy, layered)
      ═══════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ backgroundColor: '#0B1F33' }}
        data-testid="services-proof"
      >
        {/* Subtle radial accent */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(31,111,235,0.25) 0%, transparent 60%)' }}
        />
        <div className="container max-w-6xl relative z-10">
          <Reveal>
            <div className="mb-12 md:mb-16 max-w-3xl">
              <p
                className="uppercase tracking-[3px] text-[#1F6FEB] mb-4 font-bold"
                style={{ ...mono, fontSize: '12px' }}
              >
                How GigLine Works
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Private engagement. Returning-client rate. No surprises.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-7">
            <Reveal>
              <div
                className="h-full rounded-xl p-8 md:p-10 relative"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(31,111,235,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
                data-testid="proof-private"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#1F6FEB]/15 mb-5">
                  <Shield size={20} className="text-[#1F6FEB]" />
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">
                  This is not an OSHA inspection.
                </h3>
                <p className="text-white/70 leading-[1.7] text-base">
                  A GigLine walkthrough is a private engagement. Findings are delivered only to you. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency. <span className="text-white">What you do with the report is your decision.</span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div
                className="h-full rounded-xl p-8 md:p-10 relative"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(31,111,235,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
                data-testid="proof-followup"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#1F6FEB]/15 mb-5">
                  <RefreshCw size={20} className="text-[#1F6FEB]" />
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">
                  Follow-up walkthroughs available.
                </h3>
                <p className="text-white/70 leading-[1.7] text-base">
                  Returning clients receive follow-up walkthroughs at <span className="text-[#1F6FEB] font-bold">$550</span> &mdash; reduced from the standard $650. Most operations benefit from a semi-annual or annual review.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
