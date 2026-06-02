import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Shield, RefreshCw } from 'lucide-react';
import { trackServiceBooking } from '../utils/analytics';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const SERVICES = [
  {
    num: '01',
    key: 'walkthrough_standard',
    title: 'Safety Walkthrough &',
    titleLine2: 'Top 10 Fixes Report',
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
    priceNote: 'fixed quote before scheduling',
    cta: { label: 'Request a Walkthrough', subline: 'Vince calls back within one business day.' },
    testId: 'book-walkthrough',
    featured: true,
  },
  {
    num: '02',
    key: 'documentation_remote',
    title: 'Documentation Review',
    titleLine2: '& Gap Check',
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
    priceNote: 'fixed quote before scheduling',
    cta: { label: 'Request a Review', subline: 'Vince calls back within one business day.' },
    testId: 'book-documentation',
    featured: false,
  },
  {
    num: '03',
    key: 'incident_standard',
    title: 'Incident Review &',
    titleLine2: 'Corrective Action Support',
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
    priceNote: 'fixed quote before scheduling',
    cta: { label: 'Request Support', subline: 'Initial response within 24\u201348 hours.' },
    testId: 'book-incident',
    featured: false,
  },
];

const ServicesPage = () => {
  return (
    <main data-testid="services-page" className="bg-white">
      <SEO
        title="OSHA Safety Walkthrough & Compliance Services | Kernersville NC | GigLine"
        description="On-site OSHA safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, and fleets in Kernersville, NC. From $650."
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

      {/* ═══════════════════════════════════════════════
          SECTION 1 — INTRO PANEL
          Dark navy "hangar" feel. Photo accent on the right. Asymmetric.
      ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[#0B1F33] text-white"
        data-testid="services-intro"
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Right photo accent — only visible on desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute -right-10 top-0 bottom-0 w-[44%] pointer-events-none"
        >
          <img
            src="/vince-inspecting.webp"
            alt=""
            className="w-full h-full object-cover opacity-[0.18]"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
          />
          {/* Hard left fade so it dissolves into the navy */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, #0B1F33 0%, rgba(11,31,51,0.85) 18%, rgba(11,31,51,0.35) 55%, rgba(11,31,51,0.1) 100%)',
            }}
          />
        </div>

        <div className="container max-w-6xl relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="grid grid-cols-12 gap-x-8">
            <div className="col-span-12 md:col-span-2 mb-6 md:mb-0">
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                <span
                  className="text-[#1F6FEB] font-semibold uppercase"
                  style={{ ...mono, fontSize: '11px', letterSpacing: '0.35em' }}
                  data-testid="services-kicker"
                >
                  Services
                </span>
                <span className="hidden md:block h-12 w-px bg-white/15" aria-hidden="true" />
              </div>
            </div>

            <div className="col-span-12 md:col-span-10 lg:col-span-8">
              <h1
                className="text-white leading-[1.15] mb-6 text-[34px] md:text-[44px] lg:text-[52px] font-normal tracking-tight"
                style={serif}
                data-testid="services-intro-1"
              >
                GigLine serves small manufacturers, warehouses, contractors, and fleet operations in the Piedmont Triad that don&rsquo;t have a full-time safety manager on staff.
              </h1>

              <div className="flex items-start gap-4 mt-10">
                <span className="block w-10 h-[2px] bg-[#1F6FEB] mt-3 flex-shrink-0" aria-hidden="true" />
                <p
                  className="text-white/70 text-lg md:text-xl leading-relaxed"
                  data-testid="services-intro-2"
                >
                  Every engagement is a <span className="text-white font-semibold">fixed quote before scheduling.</span> No retainer. No hourly billing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — THREE SERVICE CARDS
          Real cards on warm cream. Permanent blue accent bar.
          Each card: large numeral + serif title, distinct
          "Best When" and "What You Get" zones, anchored price module,
          full-width CTA with depth.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 relative"
        style={{ backgroundColor: '#F4EFE6' }}
        data-testid="services-cards-section"
      >
        <div className="container max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-7">
            {SERVICES.map((svc) => (
              <article
                key={svc.num}
                className="relative bg-white flex flex-col group transition-all duration-300 shadow-[0_2px_24px_rgba(11,31,51,0.07)] hover:shadow-[0_8px_40px_rgba(11,31,51,0.13)] hover:-translate-y-1"
                data-testid={`service-card-${svc.num}`}
              >
                {/* Top accent bar — permanent */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-1 bg-[#1F6FEB]"
                />

                {/* "Most-booked" ribbon on featured card */}
                {svc.featured && (
                  <span
                    className="absolute -top-3 right-6 bg-[#0B1F33] text-white px-3 py-1 text-[10px] uppercase font-bold tracking-[0.2em]"
                    style={mono}
                    aria-label="Most-booked service"
                    data-testid={`featured-badge-${svc.num}`}
                  >
                    Most Booked
                  </span>
                )}

                {/* HEADER ZONE — numeral + title */}
                <div className="px-8 pt-10 pb-8 border-b border-[#102133]/08">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span
                      className="text-[#1F6FEB] leading-none"
                      style={{ ...serif, fontSize: '56px' }}
                    >
                      {svc.num}
                    </span>
                    <span
                      className="text-[#102133]/30 uppercase pb-2"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
                    >
                      Service
                    </span>
                  </div>
                  <h2
                    className="text-[#102133] leading-[1.15] text-[26px] md:text-[28px] font-normal"
                    style={serif}
                  >
                    {svc.title}
                    <br />
                    {svc.titleLine2}
                  </h2>
                </div>

                {/* BODY ZONE — Best When + What You Get */}
                <div className="px-8 py-8 flex-grow flex flex-col">
                  <div className="mb-8">
                    <p
                      className="text-[#0B1F33] mb-4 uppercase font-bold flex items-center gap-2"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.28em' }}
                    >
                      <span className="block w-3 h-[2px] bg-[#1F6FEB]" aria-hidden="true" />
                      Best When
                    </p>
                    <ul className="space-y-3" data-testid={`service-bestwhen-${svc.num}`}>
                      {svc.bestWhen.map((line, i) => (
                        <li key={i} className="flex gap-3 text-[#102133]/85 text-[15px] leading-[1.5]">
                          <span
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1F6FEB] mt-2.5"
                            aria-hidden="true"
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-grow">
                    <p
                      className="text-[#0B1F33] mb-4 uppercase font-bold flex items-center gap-2"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.28em' }}
                    >
                      <span className="block w-3 h-[2px] bg-[#1F6FEB]" aria-hidden="true" />
                      What You Get
                    </p>
                    <ul className="space-y-3" data-testid={`service-whatyouget-${svc.num}`}>
                      {svc.whatYouGet.map((line, i) => (
                        <li key={i} className="flex gap-3 text-[#102133]/85 text-[15px] leading-[1.5]">
                          <span
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#102133]/30 mt-2.5"
                            aria-hidden="true"
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* PRICE MODULE — distinct color block */}
                <div
                  className="px-8 py-6 flex items-baseline gap-3"
                  style={{ backgroundColor: '#0B1F33' }}
                  data-testid={`price-${svc.num}`}
                >
                  <span
                    className="text-white/55 uppercase"
                    style={{ ...mono, fontSize: '10px', letterSpacing: '0.28em' }}
                  >
                    Starting at
                  </span>
                  <span
                    className="text-white leading-none"
                    style={{ ...serif, fontSize: '32px' }}
                  >
                    {svc.price}
                  </span>
                  <span className="text-white/45 italic text-xs ml-auto" style={serif}>
                    {svc.priceNote}
                  </span>
                </div>

                {/* CTA */}
                <div className="px-8 py-7 bg-white">
                  <Link
                    to={`/request-walkthrough?service=${svc.key}`}
                    onClick={() => trackServiceBooking(svc.key)}
                    className="inline-flex items-center justify-between w-full bg-[#1F6FEB] hover:bg-[#0B1F33] text-white font-bold py-4 px-5 transition-colors text-[15px] group/cta shadow-[0_4px_14px_rgba(31,111,235,0.25)] hover:shadow-[0_6px_18px_rgba(11,31,51,0.3)]"
                    data-testid={svc.testId}
                  >
                    <span>{svc.cta.label}</span>
                    <ArrowRight size={17} className="transition-transform group-hover/cta:translate-x-1.5" />
                  </Link>
                  <p
                    className="mt-4 text-[#102133]/60 text-[13px] flex items-center gap-2"
                    data-testid={`cta-subline-${svc.num}`}
                  >
                    <Phone size={11} className="flex-shrink-0 text-[#1F6FEB]" />
                    {svc.cta.subline}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — COVERAGE AND LOGISTICS
          Mid-tone navy → strong rhythm break from cream above.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 bg-[#102C44] text-white relative overflow-hidden"
        data-testid="services-coverage"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={18} className="text-[#1F6FEB]" />
                <p
                  className="uppercase text-[#1F6FEB] font-semibold"
                  style={{ ...mono, fontSize: '11px', letterSpacing: '0.3em' }}
                >
                  Service Area
                </p>
              </div>
              <p
                className="text-white text-2xl md:text-[28px] leading-[1.35] mb-6 font-normal"
                style={serif}
              >
                On-site walkthroughs within <span className="text-[#1F6FEB]">60 miles</span> of Winston-Salem.
              </p>
              <p
                className="text-white/65 leading-relaxed text-base md:text-lg"
                data-testid="services-coverage-area"
              >
                Including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities. Documentation Review is available remotely for operations outside the Triad.
              </p>
            </div>

            <div className="md:border-l md:border-white/15 md:pl-12 lg:pl-16">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw size={18} className="text-[#1F6FEB]" />
                <p
                  className="uppercase text-[#1F6FEB] font-semibold"
                  style={{ ...mono, fontSize: '11px', letterSpacing: '0.3em' }}
                >
                  How Booking Works
                </p>
              </div>
              <p
                className="text-white text-2xl md:text-[28px] leading-[1.35] mb-6 font-normal"
                style={serif}
              >
                Nothing is scheduled until the <span className="text-[#1F6FEB]">price is agreed.</span>
              </p>
              <p
                className="text-white/65 leading-relaxed text-base md:text-lg"
                data-testid="services-coverage-booking"
              >
                Submit the short request form. Vince calls back within one business day with scheduling options and a confirmed fixed price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — SAFETY CHECK BAND
          Warm cream, low-weight, but with real visual interest.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ backgroundColor: '#F4EFE6' }}
        data-testid="services-safety-check-band"
      >
        {/* Soft right-side accent shape */}
        <div
          aria-hidden="true"
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1F6FEB 0%, transparent 70%)' }}
        />
        <div className="container max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:max-w-3xl">
              <p
                className="uppercase text-[#1F6FEB] mb-3 font-semibold"
                style={{ ...mono, fontSize: '11px', letterSpacing: '0.3em' }}
              >
                Not sure where to start?
              </p>
              <p
                className="text-[#0B1F33] leading-[1.25] text-2xl md:text-[32px] font-normal"
                style={serif}
              >
                Take the free 90-Second Safety Check. <span className="text-[#102133]/55">Six yes-or-no questions. Instant risk score. No email required.</span>
              </p>
            </div>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 bg-[#0B1F33] hover:bg-[#1F6FEB] text-white font-bold px-6 py-4 whitespace-nowrap transition-all text-[14px] tracking-wide shadow-[0_4px_14px_rgba(11,31,51,0.2)]"
              data-testid="services-safety-check-link"
            >
              Take the Safety Check
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — PROOF & REASSURANCE
          Two distinct cards on dark navy. Real shadow, real depth.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 bg-[#0B1F33] text-white"
        data-testid="services-proof"
      >
        <div className="container max-w-6xl">
          <p
            className="uppercase text-[#1F6FEB] mb-12 md:mb-16 font-semibold text-center"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.3em' }}
          >
            How GigLine Works
          </p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Proof — Not an OSHA inspection */}
            <div
              className="relative bg-[#102C44] p-10 md:p-12 border border-white/10"
              data-testid="proof-private"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-1 bg-[#1F6FEB]"
              />
              <Shield size={24} className="text-[#1F6FEB] mb-6" />
              <h3
                className="text-[26px] md:text-[30px] font-normal mb-5 leading-tight"
                style={serif}
              >
                This is not an OSHA inspection.
              </h3>
              <p className="text-white/70 leading-[1.7] text-base md:text-lg">
                A GigLine walkthrough is a private engagement. Findings are delivered only to you. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency. <span className="text-white">What you do with the report is your decision.</span>
              </p>
            </div>

            {/* Reassurance — Follow-ups */}
            <div
              className="relative bg-[#102C44] p-10 md:p-12 border border-white/10"
              data-testid="proof-followup"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-1 bg-[#1F6FEB]"
              />
              <RefreshCw size={24} className="text-[#1F6FEB] mb-6" />
              <h3
                className="text-[26px] md:text-[30px] font-normal mb-5 leading-tight"
                style={serif}
              >
                Follow-up walkthroughs available.
              </h3>
              <p className="text-white/70 leading-[1.7] text-base md:text-lg">
                Returning clients receive follow-up walkthroughs at <span className="text-[#1F6FEB] font-bold">$550</span> &mdash; reduced from the standard $650. Most operations benefit from a semi-annual or annual review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
