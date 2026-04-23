import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Check } from 'lucide-react';
import { trackServiceBooking } from '../utils/analytics';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const SERVICES = [
  {
    num: '01',
    key: 'walkthrough_standard',
    title: 'Safety Walkthrough & Top 10 Fixes Report',
    tagline: 'See what your operation looks like under review.',
    whoFor: 'Best for facilities under 50,000 sq ft — small site (under 10,000 sq ft / fewer than 15 employees) or standard site (10,000–50,000 sq ft / 15–75 employees).',
    summary: 'I walk the facility, observe the operation, and identify what creates the most immediate exposure. You receive a written report with the ten issues most likely to create trouble first.',
    bestFor: [
      'No outside review in the last 12 months',
      'New managers who need a clear baseline',
      'Preparing for customer or insurance review',
      'Recent near-misses or recurring concerns',
    ],
    pricing: [
      { label: 'Small site (1–75 employees)', price: '$650' },
      { label: 'Standard site (75–250)', price: '$750' },
      { label: 'Large / complex (250+)', price: 'From $900' },
    ],
    startingAt: '$650',
    timeline: 'Typically completed within 1–2 weeks.',
    testId: 'book-walkthrough',
  },
  {
    num: '02',
    key: 'documentation_remote',
    title: 'Documentation Review & Gap Check',
    tagline: 'Make sure the paperwork holds up.',
    whoFor: 'For operations that need their written programs, OSHA 300 logs, and safety records reviewed without an on-site visit.',
    summary: 'I review written programs, training records, inspection logs, and required documentation. The goal — identify what is present, what is weak, and what is missing before someone else finds it.',
    bestFor: [
      'Preparing for customer or insurance audits',
      'Rebuilding or updating safety programs',
      'Added equipment or changed processes',
      'New managers inheriting existing files',
    ],
    pricing: [
      { label: 'Remote review', price: '$550' },
      { label: 'On-site review', price: '$750' },
      { label: 'Multiple locations', price: 'Quote' },
    ],
    startingAt: '$550',
    timeline: 'Remote: ~1 week. On-site: ~2 weeks.',
    testId: 'book-documentation',
  },
  {
    num: '03',
    key: 'incident_standard',
    title: 'Incident Review & Corrective Action Support',
    tagline: 'Document what happened. Fix what caused it.',
    whoFor: 'For operations that have experienced a workplace injury, near-miss, or OSHA contact and need a structured response.',
    summary: 'After an injury, near-miss, or serious incident, I help document what happened, identify what broke down, and build corrective action that holds up under review — OSHA, insurance, or internal.',
    bestFor: [
      'Responding to recordable injuries',
      'Preparing for possible OSHA scrutiny',
      'Documentation for insurance claims',
      'Preventing repeat incidents',
    ],
    pricing: [
      { label: 'Standard incident', price: '$900' },
      { label: 'Urgent / complex', price: 'From $1,200' },
    ],
    startingAt: '$900',
    timeline: 'Initial response within 24–48 hours.',
    testId: 'book-incident',
  },
];

const ServicesPage = () => {
  return (
    <main data-testid="services-page">
      <SEO
        title="OSHA Safety Walkthrough & Compliance Services | Kernersville NC | GigLine"
        description="On-site OSHA safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, and fleets in Kernersville, NC. From $650."
        canonical="/services"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "GigLine Safety Consulting Services",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Service",
                "name": "Safety Walkthrough & Top 10 Fixes Report",
                "description": "A structured on-site review of common OSHA exposure areas.",
                "provider": { "@type": "LocalBusiness", "name": "GigLine Safety & Compliance" },
                "areaServed": "United States",
                "offers": { "@type": "Offer", "price": "650", "priceCurrency": "USD" }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Service",
                "name": "Safety Documentation Review & Gap Check",
                "description": "Review of written safety programs, training records, and inspection forms.",
                "provider": { "@type": "LocalBusiness", "name": "GigLine Safety & Compliance" },
                "areaServed": "United States",
                "offers": { "@type": "Offer", "price": "550", "priceCurrency": "USD" }
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Service",
                "name": "Incident Review & Corrective Action Support",
                "description": "Post-incident review and corrective direction.",
                "provider": { "@type": "LocalBusiness", "name": "GigLine Safety & Compliance" },
                "areaServed": "United States",
                "offers": { "@type": "Offer", "price": "900", "priceCurrency": "USD" }
              }
            }
          ]
        }}
      />

      {/* ── Hero Band ── */}
      <section className="bg-[#0B1F33] text-white py-16 md:py-24" data-testid="services-hero">
        <div className="container max-w-4xl text-center">
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-4"
            style={{ ...mono, fontSize: '11px' }}
          >
            Services
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={serif}
            data-testid="services-headline"
          >
            Three Services. One Standard.
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            Each ends with a written report, clear action items, and a defined next step. No ongoing contracts. No retainers.
          </p>
        </div>
      </section>

      {/* ── Free Safety Check — Distinct Card ── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-free-check">
        <div className="container max-w-7xl">
          <div className="rounded-xl p-6 md:p-8 text-center" style={{ background: '#0B1F33', border: '2px solid rgba(201,168,76,0.3)' }}>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4" style={{ background: '#1F6FEB', color: '#111' }}>
              Free — No Payment Required
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2" style={serif}>
              90-Second Safety Check
            </h2>
            <p className="text-base md:text-sm text-white/75 mb-6 max-w-lg mx-auto leading-relaxed">
              Answer 6 yes-or-no questions about your operation. Get an immediate risk score and a clear next step — no email required to start.
            </p>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1F6FEB]/20 text-base"
              data-testid="services-free-check-cta"
            >
              Take the Free Safety Check
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-cards-section">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {SERVICES.map((svc) => (
              <div
                key={svc.num}
                className="bg-white rounded-lg border border-[#102133]/08 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                data-testid={`service-card-${svc.num}`}
              >
                {/* Card Top */}
                <div className="p-7 md:p-8 flex-grow flex flex-col">
                  {/* Number + Starting Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[#1F6FEB]/40 font-bold"
                      style={{ ...mono, fontSize: '13px' }}
                    >
                      {svc.num}
                    </span>
                    <span className="text-lg font-bold text-[#1F6FEB]" data-testid={`price-${svc.num}`}>
                      Starting at {svc.startingAt}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-xl md:text-[22px] font-bold text-[#102133] leading-snug mb-2"
                    style={serif}
                  >
                    {svc.title}
                  </h2>

                  {/* Who it's for */}
                  <p className="text-base md:text-sm text-[#1F6FEB] font-semibold mb-3" data-testid={`service-whofor-${svc.num}`}>{svc.whoFor}</p>

                  {/* Tagline */}
                  <p className="text-base md:text-sm text-[#102133]/60 mb-5">{svc.tagline}</p>

                  {/* Summary */}
                  <p className="text-base md:text-sm text-[#102133]/80 leading-relaxed mb-6">
                    {svc.summary}
                  </p>

                  {/* Best For */}
                  <div className="mb-6 flex-grow">
                    <p
                      className="text-[11px] uppercase tracking-[2px] text-[#1F6FEB] mb-3 font-semibold"
                      style={mono}
                    >
                      Best For
                    </p>
                    <div className="space-y-2.5">
                      {svc.bestFor.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check size={14} className="flex-shrink-0 mt-0.5 text-[#1F6FEB]" strokeWidth={2.5} />
                          <p className="text-base md:text-sm text-[#102133]/75">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-[#102133]/08 pt-5 mb-5">
                    <div className="space-y-2">
                      {svc.pricing.map((tier, i) => (
                        <div key={i} className="flex justify-between items-baseline">
                          <span className="text-sm md:text-xs text-[#102133]/60">{tier.label}</span>
                          <span className="text-base md:text-sm font-bold text-[#102133] ml-3">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#102133]/55 mt-3" style={mono}>{svc.timeline}</p>
                  </div>
                </div>

                {/* Card CTA — now links to lead capture form per GL-WEB-010 */}
                <div className="px-7 md:px-8 pb-7 md:pb-8">
                  <Link
                    to={`/request-walkthrough?service=${svc.key}`}
                    onClick={() => trackServiceBooking(svc.key)}
                    className="block w-full text-center bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold py-3.5 rounded transition-colors text-base"
                    data-testid={svc.testId}
                  >
                    Request a Safety Walkthrough
                  </Link>
                  <p className="text-sm md:text-xs text-[#102133]/65 text-center mt-3 leading-relaxed" data-testid={`confirmation-line-${svc.num}`}>
                    Short 90-second form. Vince calls within one business day to talk through your situation.
                  </p>
                  <a
                    href="tel:3363298899"
                    className="block w-full text-center text-sm md:text-xs text-[#102133]/55 hover:text-[#1F6FEB] mt-3 transition-colors font-medium"
                  >
                    Or call (336) 329-8899 directly
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Line ── */}
      <section className="py-14 md:py-20 bg-white" data-testid="services-trust-line">
        <div className="container max-w-2xl text-center">
          <p className="text-lg md:text-xl text-[#102133]/75 font-medium leading-relaxed">
            Every engagement produces a written report. No verbal summaries. No promises. Just documented findings and clear next steps.
          </p>
        </div>
      </section>

      {/* ── HazCom Add-On ── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-hazcom">
        <div className="container max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-6 md:p-8 bg-white rounded-lg border border-[#102133]/08 shadow-sm">
            <div className="flex-grow">
              <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-2" style={{ ...mono, fontSize: '10px' }}>
                Standalone Resource
              </p>
              <h3 className="text-lg font-bold text-[#102133] mb-1" style={serif}>
                HazCom Starter Pack
              </h3>
              <p className="text-base md:text-sm text-[#102133]/70 mb-0 leading-relaxed">
                A ready-made written Hazard Communication program. Download immediately — no walkthrough required.
              </p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-2xl font-bold text-[#102133] mb-2">$29</p>
              <Link
                to="/hazcom"
                className="inline-flex items-center gap-2 bg-[#102133] hover:bg-[#2A3D3D] text-white font-bold px-6 py-3 rounded transition-colors text-base md:text-sm"
                data-testid="services-hazcom-link"
              >
                Get It Now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Not Sure CTA ── */}
      <section className="py-20 md:py-28 bg-[#0B1F33] text-white" data-testid="services-not-sure">
        <div className="container text-center max-w-2xl mx-auto">
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-4"
            style={{ ...mono, fontSize: '11px' }}
          >
            Not Sure?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={serif}>
            Not Sure Which Service Fits?
          </h2>
          <p className="text-base md:text-lg text-white/80 mb-10 leading-relaxed">
            Describe the situation. I'll recommend a starting point. No sales pitch. Just a clear recommendation based on what will actually help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-walkthrough"
              className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1F6FEB]/20"
              data-testid="services-bottom-cta"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded transition-colors"
              data-testid="services-safety-check-cta"
            >
              Take the Safety Check
            </Link>
          </div>
        </div>
      </section>

      {/* ── Fleet Operators ── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F7F9FC' }} data-testid="services-fleet">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p
              className="uppercase tracking-[3px] text-[#102133]/30 mb-3"
              style={{ ...mono, fontSize: '10px' }}
            >
              For Fleet Operators
            </p>
            <p className="text-base md:text-sm text-[#102133]/70 mb-5 leading-relaxed">
              If the issue is deeper than a one-time review — driver files, drug and alcohol program gaps, maintenance records, or system installation — structured support is available through LaunchPath.
            </p>
            <a
              href="https://launchpathedu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base md:text-sm text-[#1F6FEB] font-semibold hover:underline"
              data-testid="services-launchpath-edu-link"
            >
              LaunchPath Transportation EDU
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
