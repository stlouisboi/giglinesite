import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Factory, Warehouse, Truck, Wrench, CheckCircle, Award, Clock, FileText, ArrowRight, ExternalLink, Mail, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import SafetyCheckTeaser from '../components/SafetyCheckTeaser';

const HomePage = () => {
  useEffect(() => {
    document.title = "GigLine Safety & Compliance | Safety Walkthroughs & Gap Checks for Small Operations";
  }, []);

  const clientTypes = [
    {
      icon: Factory,
      title: 'Small Manufacturers & Fabrication Shops',
      description: 'Machine shops, metal fabricators, and production facilities with 5-50 employees.',
    },
    {
      icon: Warehouse,
      title: 'Warehouses & Distribution Centers',
      description: 'Forklift operations, racking systems, loading docks, and inventory handling.',
    },
    {
      icon: Wrench,
      title: 'Contractors & Maintenance Operations',
      description: 'Field crews, maintenance teams, and specialty trade contractors.',
    },
    {
      icon: Truck,
      title: 'Trucking Fleets 5–25 Trucks',
      description: 'Small carriers needing DOT compliance, driver files, and safety programs.',
    },
  ];

  const offers = [
    {
      number: '01',
      title: 'Safety Walkthrough & Top 10 Fixes Report',
      description: 'I walk your facility, observe operations, and identify what OSHA would cite first. You get a written report with your top 10 fixes in priority order.',
      deliverables: [
        'Full facility walkthrough (2-4 hours on-site)',
        'Photo documentation of findings',
        'Written report with top 10 fixes ranked by risk',
        'Brief phone call to discuss findings',
      ],
      pricing: 'Starting at $650–$750',
      bestFor: 'Operations that have not had an outside review in 12+ months',
    },
    {
      number: '02',
      title: 'Safety Documentation Review & Gap Check',
      description: 'I review your safety programs, training records, and OSHA-required documentation. You get a gap analysis showing what is missing or expired.',
      deliverables: [
        'Review of safety programs and written policies',
        'Training record audit',
        'OSHA 300 log and recordkeeping check',
        'Gap analysis report with action items',
      ],
      pricing: 'Starting at $550 remote, $750 on-site',
      bestFor: 'Companies preparing for audits or updating safety programs',
    },
    {
      number: '03',
      title: 'Incident Review & Corrective Action Support',
      description: 'After an injury or near-miss, I help you document what happened, identify root causes, and build corrective actions that hold up to scrutiny.',
      deliverables: [
        'Incident investigation interview support',
        'Root cause analysis',
        'Corrective action plan development',
        'Documentation for OSHA or insurance',
      ],
      pricing: 'Starting at $900–$1,500',
      bestFor: 'Companies responding to incidents or preparing for potential citations',
    },
  ];

  const credentials = [
    { icon: Clock, text: '25+ Years Safety Leadership' },
    { icon: Award, text: 'OSHA 30-Hour Certified' },
    { icon: Shield, text: 'U.S. Navy Veteran' },
  ];

  return (
    <main data-testid="homepage">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24" data-testid="hero-section">
        <div className="container">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" data-testid="hero-headline">
              Your Operation Has Gaps.{' '}
              <span className="text-accent">Find Them Before OSHA Does.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl" data-testid="hero-subhead">
              Safety walkthroughs, documentation reviews, and incident response for small shops, 
              warehouses, fleets, and contractors. One engagement. A written report. A clear list 
              of what to fix first.
            </p>
            
            {/* Military Origin Callout */}
            <div className="bg-white/10 border-l-4 border-accent p-6 mb-8 rounded-r-md" data-testid="military-callout">
              <p className="text-white/90 italic">
                "In the military, your gig line is the straight line between your shirt, belt, and fly. 
                If it's off, you're out of standard. GigLine Safety & Compliance brings that same 
                straight-line standard to safety and compliance for small operations."
              </p>
            </div>

            <Link to="/contact" className="btn-primary text-lg" data-testid="hero-cta">
              Request a Walkthrough or Review
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-6 md:gap-12" data-testid="trust-bar">
              {credentials.map((cred, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80">
                  <cred.icon size={20} className="text-accent" />
                  <span className="text-sm md:text-base font-medium">{cred.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Check Teaser - After Hero, Before Who I Work With */}
      <SafetyCheckTeaser />

      {/* Who I Work With */}
      <section className="py-16 md:py-24 bg-secondary" data-testid="clients-section">
        <div className="container">
          <h2 className="section-heading text-center mb-4">Who I Work With</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Small operations that can't afford a full-time safety manager but need professional 
            guidance to stay compliant and protect their people.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientTypes.map((client, index) => (
              <div 
                key={index} 
                className="card hover:shadow-md transition-shadow"
                data-testid={`client-card-${index}`}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <client.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{client.title}</h3>
                <p className="text-sm text-muted-foreground">{client.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Offers */}
      <section className="py-16 md:py-24" data-testid="offers-section">
        <div className="container">
          <h2 className="section-heading text-center mb-4">What I Offer</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Three focused services. Each delivers a written report with clear action items. 
            No ongoing contracts required.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div 
                key={index} 
                className="card border-t-4 border-t-accent"
                data-testid={`offer-card-${index}`}
              >
                <span className="text-accent font-bold text-sm">OFFER {offer.number}</span>
                <h3 className="text-xl font-bold text-primary mt-2 mb-3">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{offer.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-2">Deliverables:</p>
                  <ul className="space-y-2">
                    {offer.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-secondary rounded-md p-3 mb-4">
                  <p className="text-sm text-muted-foreground">Best for:</p>
                  <p className="text-sm font-medium text-primary">{offer.bestFor}</p>
                </div>

                <p className="text-lg font-bold text-accent mb-4">{offer.pricing}</p>
                
                <Link 
                  to="/contact" 
                  className="btn-secondary w-full text-center"
                  data-testid={`offer-cta-${index}`}
                >
                  Request This Service
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services" className="text-accent font-medium hover:underline inline-flex items-center gap-1">
              View Full Service Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Background / Why Bring Me In */}
      <section className="py-16 md:py-24 bg-primary text-white" data-testid="background-section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Bring Me In</h2>
            <p className="text-xl text-white/90 mb-8 italic">
              "I find what is exposed. I tell you exactly what to fix. You keep the liability off the floor."
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">25+</p>
                <p className="text-sm text-white/80">Years Safety Leadership</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">OSHA</p>
                <p className="text-sm text-white/80">30 & 10 Hour Certified</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">MFG</p>
                <p className="text-sm text-white/80">Manufacturing Background</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">USN</p>
                <p className="text-sm text-white/80">U.S. Navy Veteran</p>
              </div>
            </div>

            <p className="text-white/80 max-w-2xl mx-auto">
              I've managed safety programs in manufacturing, warehousing, and transportation. 
              I know what OSHA looks for because I've been on both sides of the inspection clipboard.
            </p>
          </div>
        </div>
      </section>

      {/* For Carriers and Fleets */}
      <section className="py-16 md:py-24 bg-secondary" data-testid="fleets-section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Truck size={48} className="mx-auto text-accent mb-4" />
            <h2 className="section-heading mb-4">For Carriers and Fleets</h2>
            <p className="text-muted-foreground mb-6">
              If you're running a small trucking operation (5-25 trucks), check out LaunchPath Transportation EDU. 
              Free resources to help you build compliant driver files, understand DOT requirements, and avoid 
              the mistakes that get carriers shut down.
            </p>
            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              data-testid="launchpath-cta"
            >
              Start with Ground 0 — Free
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24" data-testid="contact-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-heading mb-4">Ready to Find Your Gaps?</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form and I'll respond within one business day. Or reach out directly 
                by email or phone.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href="mailto:vince@giglinecompliance.com"
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
                  data-testid="contact-email"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">vince@giglinecompliance.com</p>
                  </div>
                </a>

                <a
                  href="tel:336-671-4967"
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
                  data-testid="contact-phone"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">336-671-4967</p>
                  </div>
                </a>
              </div>

              <div className="bg-secondary p-6 rounded-lg">
                <FileText size={24} className="text-accent mb-3" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Not sure which service you need?</strong> Describe 
                  your situation in the form and I'll recommend the right approach for your operation.
                </p>
              </div>
            </div>

            <div className="card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
