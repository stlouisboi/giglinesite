import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Shield, FileText } from 'lucide-react';

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Services | GigLine Safety & Compliance";
  }, []);

  const services = [
    {
      number: '01',
      title: 'Safety Walkthrough & Top 10 Fixes Report',
      tagline: 'See your operation through OSHA\'s eyes.',
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
      pricing: 'Starting at $650–$750',
      pricingNote: 'Price varies by facility size and complexity. Travel outside the Triad area may incur additional cost.',
      bestFor: [
        'Operations that haven\'t had an outside review in 12+ months',
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
        'Training record audit — who\'s current, who\'s expired',
        'OSHA 300 log and recordkeeping compliance check',
        'SDS/chemical inventory review',
        'Equipment inspection record review',
        'Gap analysis report with specific action items',
        'Template recommendations for missing documentation',
      ],
      pricing: 'Starting at $550 remote, $750 on-site',
      pricingNote: 'Remote reviews work well for documentation-focused engagements. On-site reviews include physical file inspection.',
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
      pricing: 'Starting at $900–$1,500',
      pricingNote: 'Price depends on incident complexity and documentation requirements. Rush availability for time-sensitive situations.',
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

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-lg p-6 sticky top-24">
                      <p className="text-2xl font-bold text-accent mb-2">{service.pricing}</p>
                      <p className="text-sm text-muted-foreground mb-4">{service.pricingNote}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Clock size={16} className="text-accent" />
                        {service.timeframe}
                      </div>

                      <Link 
                        to="/contact" 
                        className="btn-primary w-full text-center"
                        data-testid={`service-cta-${index}`}
                      >
                        Request This Service
                      </Link>
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
    </main>
  );
};

export default ServicesPage;
