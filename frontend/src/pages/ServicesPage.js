import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Check } from 'lucide-react';
import BookingModal, { serviceConfig } from '../components/BookingModal';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const SERVICES = [
  {
    num: '01',
    key: 'walkthrough_standard',
    title: 'Safety Walkthrough & Top 10 Fixes Report',
    tagline: 'See what your operation looks like under review.',
    summary: 'I walk the facility, observe the operation, and identify what creates the most immediate exposure. You receive a written report with the ten issues most likely to create trouble first.',
    bestFor: [
      'No outside review in the last 12 months',
      'New managers who need a clear baseline',
      'Preparing for customer or insurance review',
      'Recent near-misses or recurring concerns',
    ],
    pricing: [
      { label: 'Small site', price: '$650' },
      { label: 'Standard site', price: '$750' },
      { label: 'Large / complex', price: 'Quote' },
    ],
    timeline: 'Typically completed within 1–2 weeks.',
    testId: 'book-walkthrough',
  },
  {
    num: '02',
    key: 'documentation_remote',
    title: 'Documentation Review & Gap Check',
    tagline: 'Make sure the paperwork holds up.',
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
    timeline: 'Remote: ~1 week. On-site: ~2 weeks.',
    testId: 'book-documentation',
  },
  {
    num: '03',
    key: 'incident_standard',
    title: 'Incident Review & Corrective Action Support',
    tagline: 'Document what happened. Fix what caused it.',
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
    timeline: 'Initial response within 24–48 hours.',
    testId: 'book-incident',
  },
];

const ServicesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openBooking = (serviceKey) => {
    setSelectedService(serviceConfig[serviceKey]);
    setModalOpen(true);
  };

  return (
    <main data-testid="services-page">
      <SEO
        title="Services"
        description="Three focused safety services for small operations. Safety Walkthrough, Documentation Review, and Incident Response Support. Each ends with a written report, clear action items, and a defined next step."
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
      <section className="bg-[#0D1B2A] text-white py-16 md:py-24" data-testid="services-hero">
        <div className="container max-w-4xl text-center">
          <p
            className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
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
          <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            Each ends with a written report, clear action items, and a defined next step. No ongoing contracts. No retainers.
          </p>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F9F8F6' }} data-testid="services-cards-section">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {SERVICES.map((svc) => (
              <div
                key={svc.num}
                className="bg-white rounded-lg border border-[#1C2B2B]/08 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                data-testid={`service-card-${svc.num}`}
              >
                {/* Card Top */}
                <div className="p-7 md:p-8 flex-grow flex flex-col">
                  {/* Number */}
                  <span
                    className="text-[#C9A84C]/40 font-bold mb-4 block"
                    style={{ ...mono, fontSize: '13px' }}
                  >
                    {svc.num}
                  </span>

                  {/* Title */}
                  <h2
                    className="text-xl md:text-[22px] font-bold text-[#1C2B2B] leading-snug mb-2"
                    style={serif}
                  >
                    {svc.title}
                  </h2>

                  {/* Tagline */}
                  <p className="text-sm text-[#1C2B2B]/45 mb-5">{svc.tagline}</p>

                  {/* Summary */}
                  <p className="text-sm text-[#1C2B2B]/65 leading-relaxed mb-6">
                    {svc.summary}
                  </p>

                  {/* Best For */}
                  <div className="mb-6 flex-grow">
                    <p
                      className="text-[10px] uppercase tracking-[2px] text-[#C9A84C] mb-3 font-semibold"
                      style={mono}
                    >
                      Best For
                    </p>
                    <div className="space-y-2.5">
                      {svc.bestFor.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check size={14} className="flex-shrink-0 mt-0.5 text-[#C9A84C]" strokeWidth={2.5} />
                          <p className="text-sm text-[#1C2B2B]/60">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-[#1C2B2B]/08 pt-5 mb-5">
                    <div className="space-y-2">
                      {svc.pricing.map((tier, i) => (
                        <div key={i} className="flex justify-between items-baseline">
                          <span className="text-xs text-[#1C2B2B]/45">{tier.label}</span>
                          <span className="text-sm font-bold text-[#1C2B2B] ml-3">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#1C2B2B]/30 mt-3" style={mono}>{svc.timeline}</p>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="px-7 md:px-8 pb-7 md:pb-8">
                  <button
                    onClick={() => openBooking(svc.key)}
                    className="w-full bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold py-3.5 rounded transition-colors text-sm"
                    data-testid={svc.testId}
                  >
                    Book This Service
                  </button>
                  <Link
                    to="/request-walkthrough"
                    className="block w-full text-center text-xs text-[#1C2B2B]/40 hover:text-[#C9A84C] mt-3 transition-colors"
                  >
                    Or request a call first
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Line ── */}
      <section className="py-14 md:py-20 bg-white" data-testid="services-trust-line">
        <div className="container max-w-2xl text-center">
          <p className="text-base sm:text-lg md:text-xl text-[#1C2B2B]/55 font-medium leading-relaxed">
            Every engagement produces a written report. No verbal summaries. No promises. Just documented findings and clear next steps.
          </p>
        </div>
      </section>

      {/* ── Not Sure CTA ── */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] text-white" data-testid="services-not-sure">
        <div className="container text-center max-w-2xl mx-auto">
          <p
            className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
            style={{ ...mono, fontSize: '11px' }}
          >
            Not Sure?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={serif}>
            Not Sure Which Service Fits?
          </h2>
          <p className="text-white/50 mb-10 leading-relaxed">
            Describe the situation. I'll recommend a starting point. No sales pitch. Just a clear recommendation based on what will actually help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-walkthrough"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#C9A84C]/20"
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
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F9F8F6' }} data-testid="services-fleet">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p
              className="uppercase tracking-[3px] text-[#1C2B2B]/30 mb-3"
              style={{ ...mono, fontSize: '10px' }}
            >
              For Fleet Operators
            </p>
            <p className="text-sm text-[#1C2B2B]/50 mb-5">
              If the issue is deeper than a one-time review — driver files, drug and alcohol program gaps, maintenance records, or system installation — structured support is available through LaunchPath.
            </p>
            <a
              href="https://launchpathedu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#C9A84C] font-medium hover:underline"
              data-testid="services-launchpath-edu-link"
            >
              LaunchPath Transportation EDU
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
      />
    </main>
  );
};

export default ServicesPage;
