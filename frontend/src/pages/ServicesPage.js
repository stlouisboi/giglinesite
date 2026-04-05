import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import BookingModal, { serviceConfig } from '../components/BookingModal';
import SEO from '../components/SEO';

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
      />

      {/* Hero */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-testid="services-headline" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              Services
            </h1>
            <p className="text-lg text-white/85 leading-relaxed">
              Three focused services. Each ends with a written report, clear action items, and a defined next step. No ongoing contracts. No retainers. One engagement at a time.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE 01 */}
      <section className="py-20 md:py-28 border-b border-[#1C2B2B]/10" data-testid="service-section-0">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase">Service 01</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mt-3 mb-2" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                Safety Walkthrough & Top 10 Fixes Report
              </h2>
              <p className="text-[#1C2B2B]/60 text-lg mb-6">See what your operation looks like under review.</p>

              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed mb-10">
                <p>
                  I walk the facility, observe the operation, and identify what creates the most immediate exposure. This is not a clipboard exercise. It is a practical review of how the work is actually being done.
                </p>
                <p>
                  You receive a written report with the ten issues most likely to create trouble first, ranked in priority order.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {[
                    'On-site facility walkthrough',
                    'Observation of active operations and work practices',
                    'Photo documentation of key findings',
                    'Written report with top ten priority issues',
                    'Ranked action list showing what to fix first',
                    'Brief review call to discuss findings and next steps',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#B8972C] mt-0.5 flex-shrink-0">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">Best For</h3>
                <ul className="space-y-2">
                  {[
                    'Operations that have not had an outside review in the last 12 months',
                    'New managers who need a clear baseline',
                    'Companies preparing for customer, insurance, or internal review',
                    'Operations with recent near-misses, injuries, or recurring concerns',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#1C2B2B]/30 mt-0.5 flex-shrink-0">&rsaquo;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <div className="border border-[#1C2B2B]/10 rounded p-6 sticky top-24">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-5 pb-3 border-b border-[#1C2B2B]/10">Pricing & Booking</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Small site (single building, one shift)</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">$650</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Standard site</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">$750</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Large or complex site</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">Quote</span>
                  </div>
                </div>
                <p className="text-xs text-[#1C2B2B]/50 mb-6">
                  Typically completed within 1-2 weeks of scheduling.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => openBooking('walkthrough_standard')}
                    className="w-full bg-[#1C2B2B] text-white font-medium py-3 rounded hover:bg-[#2A3D3D] transition-colors text-sm"
                    data-testid="book-walkthrough"
                  >
                    Book
                  </button>
                  <Link
                    to="/contact"
                    className="block w-full text-center border border-[#1C2B2B]/20 text-[#1C2B2B] font-medium py-3 rounded hover:border-[#1C2B2B]/40 transition-colors text-sm"
                    data-testid="request-walkthrough"
                  >
                    Request This Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE 02 */}
      <section className="py-20 md:py-28 border-b border-[#1C2B2B]/10" data-testid="service-section-1">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase">Service 02</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mt-3 mb-2" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                Safety Documentation Review & Gap Check
              </h2>
              <p className="text-[#1C2B2B]/60 text-lg mb-6">Make sure the paperwork holds up.</p>

              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed mb-10">
                <p>
                  I review the paper side of the operation: written programs, training records, inspection logs, and required documentation. The goal is simple — identify what is present, what is weak, what is outdated, and what is missing.
                </p>
                <p>
                  This is the review you want before an auditor, insurer, customer, or inspector asks for your files.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {[
                    'Review of written safety programs and policies',
                    'OSHA 300 log and recordkeeping check',
                    'Training record review',
                    'SDS and chemical inventory review',
                    'Equipment inspection record review',
                    'Gap analysis report with specific action items',
                    'Recommendations for missing or weak documentation',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#B8972C] mt-0.5 flex-shrink-0">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">Best For</h3>
                <ul className="space-y-2">
                  {[
                    'Companies preparing for customer or insurance audits',
                    'Businesses rebuilding or updating safety programs',
                    'Operations that added equipment, changed processes, or expanded',
                    'New managers inheriting existing files and documentation',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#1C2B2B]/30 mt-0.5 flex-shrink-0">&rsaquo;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <div className="border border-[#1C2B2B]/10 rounded p-6 sticky top-24">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-5 pb-3 border-b border-[#1C2B2B]/10">Pricing & Booking</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Remote review (PDFs/scans)</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">$550</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">On-site review</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">$750</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Multiple locations</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">Quote</span>
                  </div>
                </div>
                <p className="text-xs text-[#1C2B2B]/50 mb-6">
                  Remote reviews are typically completed within 1 week. On-site reviews are typically scheduled within 2 weeks.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => openBooking('documentation_remote')}
                    className="w-full bg-[#1C2B2B] text-white font-medium py-3 rounded hover:bg-[#2A3D3D] transition-colors text-sm"
                    data-testid="book-documentation"
                  >
                    Book
                  </button>
                  <Link
                    to="/contact"
                    className="block w-full text-center border border-[#1C2B2B]/20 text-[#1C2B2B] font-medium py-3 rounded hover:border-[#1C2B2B]/40 transition-colors text-sm"
                    data-testid="request-documentation"
                  >
                    Request This Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE 03 */}
      <section className="py-20 md:py-28" data-testid="service-section-2">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase">Service 03</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mt-3 mb-2" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                Incident Review & Corrective Action Support
              </h2>
              <p className="text-[#1C2B2B]/60 text-lg mb-6">Document what happened. Fix what caused it.</p>

              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed mb-10">
                <p>
                  After an injury, near-miss, property damage event, or other serious incident, I help document what happened, identify what broke down, and build corrective action that can hold up under review.
                </p>
                <p>
                  Whether you are responding to an OSHA inquiry, an insurance request, or an internal failure that cannot be repeated, this service is built to bring structure to the response.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {[
                    'Incident investigation interview support',
                    'Corrective action planning',
                    'Root cause review using practical methods',
                    'Documentation support for OSHA or insurance review',
                    'Witness statement guidance',
                    'Follow-up verification of corrective action implementation',
                    'Training recommendations to reduce recurrence',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#B8972C] mt-0.5 flex-shrink-0">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-4">Best For</h3>
                <ul className="space-y-2">
                  {[
                    'Companies responding to recordable injuries',
                    'Operations preparing for possible OSHA scrutiny',
                    'Businesses needing documentation for insurance claims',
                    'Organizations trying to prevent repeat incidents',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1C2B2B]/70 text-sm">
                      <span className="text-[#1C2B2B]/30 mt-0.5 flex-shrink-0">&rsaquo;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <div className="border border-[#1C2B2B]/10 rounded p-6 sticky top-24">
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-5 pb-3 border-b border-[#1C2B2B]/10">Pricing & Booking</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Standard incident (non-emergency, one incident)</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">$900</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#1C2B2B]/70">Urgent or complex cases</span>
                    <span className="text-base font-bold text-[#1C2B2B] ml-4">From $1,200</span>
                  </div>
                </div>
                <p className="text-xs text-[#1C2B2B]/50 mb-6">
                  Initial response available within 24-48 hours for time-sensitive incidents.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => openBooking('incident_standard')}
                    className="w-full bg-[#1C2B2B] text-white font-medium py-3 rounded hover:bg-[#2A3D3D] transition-colors text-sm"
                    data-testid="book-incident"
                  >
                    Book
                  </button>
                  <Link
                    to="/contact"
                    className="block w-full text-center border border-[#1C2B2B]/20 text-[#1C2B2B] font-medium py-3 rounded hover:border-[#1C2B2B]/40 transition-colors text-sm"
                    data-testid="request-incident"
                  >
                    Request This Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#1C2B2B] text-white">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
            Not Sure Which Service You Need?
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Describe the situation and I will recommend the right starting point. No sales pitch. No unnecessary upsell. Just a clear recommendation based on what will actually help the operation.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-[#B8972C] hover:bg-[#A6872A] text-white font-semibold px-8 py-4 rounded transition-colors"
            data-testid="services-bottom-cta"
          >
            Let's Talk
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Fleet Operators Note */}
      <section className="py-12 bg-[#F5F5F3]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/50 uppercase mb-3">For Fleet Operators</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-4">
              If the issue is deeper than a one-time review — driver files, drug and alcohol program gaps, maintenance records, or system installation — structured support is available through LaunchPath.
            </p>
            <a
              href="https://launchpathedu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#B8972C] font-medium hover:underline mb-3"
              data-testid="services-launchpath-edu-link"
            >
              LaunchPath Transportation EDU
              <ExternalLink size={14} />
            </a>
            <br />
            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#B8972C] font-medium hover:underline"
            >
              Start with Ground 0 — Free
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
