import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { trackServiceBooking } from '../utils/analytics';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

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
    priceLabel: 'Starting at',
    priceValue: '$650',
    priceSubline: 'fixed quote before scheduling',
    cta: { label: 'Request a Walkthrough', subline: 'Vince calls back within one business day.' },
    testId: 'book-walkthrough',
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
    priceLabel: 'Starting at',
    priceValue: '$550',
    priceSubline: 'fixed quote before scheduling',
    cta: { label: 'Request a Review', subline: 'Vince calls back within one business day.' },
    testId: 'book-documentation',
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
    priceLabel: 'Starting at',
    priceValue: '$900',
    priceSubline: 'fixed quote before scheduling',
    cta: { label: 'Request Support', subline: 'Initial response within 24\u201348 hours.' },
    testId: 'book-incident',
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
          SECTION 1 — INTRO PANEL  (editorial, asymmetric)
      ═══════════════════════════════════════════════ */}
      <section
        className="pt-28 md:pt-36 pb-20 md:pb-28 bg-white"
        data-testid="services-intro"
      >
        <div className="container max-w-6xl">
          <div className="grid grid-cols-12 gap-x-8 gap-y-6">
            <div className="col-span-12 md:col-span-3">
              <p
                className="uppercase text-[#1F6FEB] font-semibold tracking-[0.3em]"
                style={{ ...mono, fontSize: '11px' }}
                data-testid="services-kicker"
              >
                Services
              </p>
            </div>
            <div className="col-span-12 md:col-span-9 md:pl-2 border-l md:border-l-[1px] border-[#102133]/12 md:pl-10">
              <p
                className="text-[#102133] leading-[1.45] text-2xl md:text-[28px] mb-6"
                style={serif}
                data-testid="services-intro-1"
              >
                GigLine serves small manufacturers, warehouses, contractors, and fleet operations in the Piedmont Triad that don&rsquo;t have a full-time safety manager on staff.
              </p>
              <p
                className="text-[#102133]/65 leading-relaxed text-base md:text-lg"
                style={serif}
                data-testid="services-intro-2"
              >
                Every engagement is a fixed quote before scheduling. No retainer. No hourly billing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — THREE SERVICE CARDS
          Editorial column treatment: large numerals, serif titles,
          italic prose-style lists (no checkmark icons), serif pricing.
      ═══════════════════════════════════════════════ */}
      <section
        className="pt-4 pb-24 md:pb-32 border-t border-[#102133]/10"
        data-testid="services-cards-section"
      >
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#102133]/12">
            {SERVICES.map((svc) => (
              <article
                key={svc.num}
                className="group relative bg-white flex flex-col"
                data-testid={`service-card-${svc.num}`}
              >
                {/* Soft top accent (only on hover or focus-within for restraint) */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-[#1F6FEB] origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500"
                />

                <div className="px-8 md:px-10 pt-12 pb-10 flex flex-col flex-grow">
                  {/* Numeral */}
                  <p
                    className="text-[#102133]/25 mb-8 leading-none"
                    style={{ ...mono, fontSize: '12px', letterSpacing: '0.25em' }}
                  >
                    {svc.num}
                  </p>

                  {/* Title */}
                  <h2
                    className="text-[#102133] leading-[1.25] mb-10 text-[22px] md:text-[26px] font-normal"
                    style={serif}
                  >
                    {svc.title}
                  </h2>

                  {/* Best When */}
                  <div className="mb-10">
                    <p
                      className="text-[#1F6FEB] font-semibold mb-4 uppercase"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.25em' }}
                    >
                      Best When
                    </p>
                    <ul className="space-y-3" data-testid={`service-bestwhen-${svc.num}`}>
                      {svc.bestWhen.map((line, i) => (
                        <li key={i} className="flex gap-3 text-[#102133]/80 text-[15px] leading-[1.55]">
                          <span className="text-[#102133]/30 flex-shrink-0 select-none" aria-hidden="true">&mdash;</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What You Get */}
                  <div className="mb-10 flex-grow">
                    <p
                      className="text-[#1F6FEB] font-semibold mb-4 uppercase"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.25em' }}
                    >
                      What You Get
                    </p>
                    <ul className="space-y-3" data-testid={`service-whatyouget-${svc.num}`}>
                      {svc.whatYouGet.map((line, i) => (
                        <li key={i} className="flex gap-3 text-[#102133]/80 text-[15px] leading-[1.55]">
                          <span className="text-[#102133]/30 flex-shrink-0 select-none" aria-hidden="true">&mdash;</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price */}
                  <div className="border-t border-[#102133]/10 pt-7 mb-7" data-testid={`price-${svc.num}`}>
                    <p
                      className="uppercase text-[#102133]/45 mb-2"
                      style={{ ...mono, fontSize: '10px', letterSpacing: '0.25em' }}
                    >
                      {svc.priceLabel}
                    </p>
                    <p
                      className="text-[#102133] leading-none mb-3 text-[40px] md:text-[44px] font-normal"
                      style={serif}
                    >
                      {svc.priceValue}
                    </p>
                    <p className="text-[#102133]/55 text-sm italic" style={serif}>
                      {svc.priceSubline}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/request-walkthrough?service=${svc.key}`}
                    onClick={() => trackServiceBooking(svc.key)}
                    className="inline-flex items-center justify-between w-full bg-[#102133] hover:bg-[#1F6FEB] text-white font-semibold py-4 px-5 rounded-none transition-colors text-[15px] group/cta"
                    data-testid={svc.testId}
                  >
                    <span>{svc.cta.label}</span>
                    <ArrowRight size={16} className="transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                  <p
                    className="mt-3 text-[#102133]/55 text-[13px] leading-relaxed"
                    style={serif}
                    data-testid={`cta-subline-${svc.num}`}
                  >
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
          Quiet two-column editorial. Hairline divider on desktop only.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 bg-[#F7F5F0]"
        data-testid="services-coverage"
      >
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div className="md:border-r md:border-[#102133]/15 md:pr-16">
              <p
                className="uppercase text-[#1F6FEB] mb-5 font-semibold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
              >
                Service Area
              </p>
              <p
                className="text-[#102133] leading-[1.6] text-lg"
                style={serif}
                data-testid="services-coverage-area"
              >
                On-site walkthroughs within <span className="font-bold">60 miles of Winston-Salem</span> &mdash; including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities. Documentation Review is available remotely for operations outside the Triad.
              </p>
            </div>
            <div>
              <p
                className="uppercase text-[#1F6FEB] mb-5 font-semibold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
              >
                How Booking Works
              </p>
              <p
                className="text-[#102133] leading-[1.6] text-lg"
                style={serif}
                data-testid="services-coverage-booking"
              >
                Submit the short request form. Vince calls back within one business day with scheduling options and a confirmed fixed price. <span className="font-bold">Nothing is scheduled until the price is agreed.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — SAFETY CHECK BAND  (deliberately low-weight)
      ═══════════════════════════════════════════════ */}
      <section
        className="py-14 md:py-16 bg-white border-y border-[#102133]/12"
        data-testid="services-safety-check-band"
      >
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="md:max-w-2xl">
              <p
                className="uppercase text-[#102133]/40 mb-3 font-semibold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
              >
                Not sure where to start?
              </p>
              <p
                className="text-[#102133] leading-snug text-xl md:text-2xl"
                style={serif}
              >
                Take the free 90-Second Safety Check. Six yes-or-no questions. Instant risk score. No email required.
              </p>
            </div>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#102133] font-semibold whitespace-nowrap transition-colors"
              style={{ ...mono, fontSize: '13px', letterSpacing: '0.05em' }}
              data-testid="services-safety-check-link"
            >
              Take the Safety Check
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — PROOF & REASSURANCE
          Two compact panels side-by-side.
      ═══════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 bg-[#0B1F33] text-white"
        data-testid="services-proof"
      >
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {/* Proof — Not an OSHA inspection */}
            <div className="bg-[#0B1F33] p-10 md:p-14" data-testid="proof-private">
              <p
                className="uppercase text-[#1F6FEB] mb-6 font-semibold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
              >
                Private Engagement
              </p>
              <h3
                className="text-2xl md:text-[28px] font-normal mb-6 leading-tight"
                style={serif}
              >
                This is not an OSHA inspection.
              </h3>
              <p className="text-white/65 leading-[1.7] text-base">
                A GigLine walkthrough is a private engagement. Findings are delivered only to you. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency. What you do with the report is your decision.
              </p>
            </div>

            {/* Reassurance — Follow-ups */}
            <div className="bg-[#0B1F33] p-10 md:p-14" data-testid="proof-followup">
              <p
                className="uppercase text-[#1F6FEB] mb-6 font-semibold"
                style={{ ...mono, fontSize: '10px', letterSpacing: '0.3em' }}
              >
                Returning Clients
              </p>
              <h3
                className="text-2xl md:text-[28px] font-normal mb-6 leading-tight"
                style={serif}
              >
                Follow-up walkthroughs available.
              </h3>
              <p className="text-white/65 leading-[1.7] text-base">
                Returning clients receive follow-up walkthroughs at <span className="text-white font-semibold">$550</span> &mdash; reduced from the standard $650. Most operations benefit from a semi-annual or annual review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
