import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Shield, FileText, CreditCard, Calendar } from 'lucide-react';
import BookingModal, { serviceConfig } from '../components/BookingModal';
import SEO from '../components/SEO';

const ServicesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openBooking = (serviceKey) => {
    setSelectedService(serviceConfig[serviceKey]);
    setModalOpen(true);
  };

  const services = [
    {
      number: '01',
      title: 'Safety Walkthrough & Top 10 Fixes Report',
      tagline: "See your operation through OSHA's eyes.",
      description: `I walk your facility, observe your operations, and identify what OSHA would cite first. 
        No checklist audit — I look at how work actually gets done. You get a written report with your 
        top 10 fixes in priority order, ranked by risk and likelihood of citation.`,
      deliverables: [
        'Full facility walkthrough (2-4 hours on-site)',
        'Observation of active operations and work practices',
        'Photo documentation of findings',
        'Written report with top 10 fixes ranked by risk',
        'Prioritized action list — what to fix first',
        'Brief phone call to discuss findings and answer questions',
      ],
      pricing: [
        { label: 'Small site (single building, 1 shift)', price: '$650', serviceKey: 'walkthrough_small' },
        { label: 'Standard site', price: '$750', serviceKey: 'walkthrough_standard' },
        { label: 'Large/complex site', price: 'Quote', serviceKey: 'walkthrough_large' },
      ],
      bestFor: [
        "Operations that haven't had an outside review in 12+ months",
        'New facility managers wanting a baseline assessment',
        'Companies preparing for customer or insurance audits',
        'Businesses that have had recent near-misses or injuries',
      ],
      timeframe: 'Typically completed within 1-2 weeks of scheduling',
    },
    {
      number: '02',
      title: 'Safety Documentation Review & Gap Check',
      tagline: 'Make sure your paperwork holds up.',
      description: `I review your safety programs, training records, and OSHA-required documentation. 
        You get a gap analysis showing what's missing, what's expired, and what needs updating. 
        This is the review you need before an auditor, insurer, or inspector asks for your files.`,
      deliverables: [
        'Review of written safety programs and policies',
        "Training record audit — who's current, who's expired",
        'OSHA 300 log and recordkeeping compliance check',
        'SDS/chemical inventory review',
        'Equipment inspection record review',
        'Gap analysis report with specific action items',
        'Template recommendations for missing documentation',
      ],
      pricing: [
        { label: 'Remote (send PDFs/scans)', price: '$550', serviceKey: 'documentation_remote' },
        { label: 'On-site review', price: '$750', serviceKey: 'documentation_onsite' },
        { label: 'Multiple locations', price: 'Quote', serviceKey: 'documentation_complex' },
      ],
      bestFor: [
        'Companies preparing for customer or insurance audits',
        'Businesses updating or rebuilding safety programs',
        'Operations that have changed processes or added equipment',
        'New safety managers inheriting existing programs',
      ],
      timeframe: 'Remote reviews completed within 1 week. On-site reviews scheduled within 2 weeks.',
    },
    {
      number: '03',
      title: 'Incident Review & Corrective Action Support',
      tagline: 'Document what happened. Fix what caused it.',
      description: `After an injury or near-miss, I help you document what happened, identify root causes, 
        and build corrective actions that hold up to scrutiny. Whether you're responding to an OSHA inquiry 
        or just want to prevent recurrence, I help you get it right the first time.`,
      deliverables: [
        'Incident investigation interview support',
        'Root cause analysis using proven methods',
        'Corrective action plan development',
        'Documentation suitable for OSHA or insurance',
        'Witness statement guidance',
        'Follow-up verification of corrective action implementation',
        'Training recommendations to prevent recurrence',
      ],
      pricing: [
        { label: 'Standard (non-emergency, 1 incident)', price: '$900', serviceKey: 'incident_standard' },
        { label: 'Urgent/complex cases', price: 'From $1,200', serviceKey: 'incident_urgent' },
      ],
      bestFor: [
        'Companies responding to recordable injuries',
        'Operations preparing for potential OSHA citations',
        'Businesses needing documentation for insurance claims',
        'Organizations wanting to prevent incident recurrence',
      ],
      timeframe: 'Initial response within 24-48 hours for time-sensitive incidents.',
    },
  ];

  return (
    <main data-testid="services-page">
      <SEO 
        title="Services"
        description="Three safety consulting engagements for small operations — Safety Walkthrough, Documentation Review, and Incident Response Support. Starting at $550."
        canonical="/services"
      />
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="services-headline">
              Services
            </h1>
            <p className="text-lg text-white/90">
              Three focused services. Each delivers a written report with clear action items. 
              No ongoing contracts, no retainers, no monthly fees. One engagement at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="border-b border-border pb-16 last:border-b-0"
                data-testid={`service-section-${index}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                    <span className="text-accent font-bold text-sm">SERVICE {service.number}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2 mb-2">
                      {service.title}
                    </h2>
                    <p className="text-lg text-accent font-medium mb-4">{service.tagline}</p>
                    <p className="text-muted-foreground mb-6">{service.description}</p>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                        <FileText size={20} className="text-accent" />
                        What You Get
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle size={18} className="text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                        <Shield size={20} className="text-accent" />
                        Best For
                      </h3>
                      <ul className="space-y-2">
                        {service.bestFor.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <ArrowRight size={16} className="text-accent mt-1 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar - Pricing & Booking */}
                  <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-lg p-6 sticky top-24">
                      <h3 className="text-lg font-bold text-primary mb-4">Pricing & Booking</h3>
                      
                      <div className="space-y-3 mb-6">
                        {service.pricing.map((tier, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-md border border-border">
                            <div>
                              <p className="text-sm font-medium text-primary">{tier.label}</p>
                              <p className="text-lg font-bold text-accent">{tier.price}</p>
                            </div>
                            <button
                              onClick={() => openBooking(tier.serviceKey)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                tier.price === 'Quote' 
                                  ? 'bg-primary text-white hover:bg-primary/90'
                                  : 'bg-accent text-white hover:bg-accent/90'
                              }`}
                              data-testid={`book-${tier.serviceKey}`}
                            >
                              {tier.price === 'Quote' ? (
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} /> Get Quote
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <CreditCard size={14} /> Book
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} className="text-accent" />
                        {service.timeframe}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Describe your situation and I'll recommend the right approach. No pressure, no sales pitch — 
            just honest guidance on what will actually help your operation.
          </p>
          <Link to="/contact" className="btn-primary bg-accent hover:bg-accent/90" data-testid="services-bottom-cta">
            Let's Talk
            <ArrowRight size={18} className="ml-2" />
          </Link>
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
