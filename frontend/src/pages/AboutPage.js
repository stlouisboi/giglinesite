import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Clock, Factory, Truck, Warehouse, ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
  const credentials = [
    { icon: Clock, label: '25+ Years', description: 'Safety Leadership' },
    { icon: Award, label: 'OSHA Certified', description: '30 & 10 Hour' },
    { icon: Shield, label: 'U.S. Navy', description: 'Veteran' },
    { icon: Factory, label: 'Manufacturing', description: 'Background' },
    { icon: Warehouse, label: 'Warehousing', description: 'Experience' },
    { icon: Truck, label: 'Transportation', description: 'Expertise' },
  ];

  return (
    <main data-testid="about-page">
      <SEO 
        title="About"
        description="Vince Lawrence — 25+ years in safety and compliance leadership. OSHA certified. Navy veteran. Founder of GigLine Safety & Compliance and LaunchPath Transportation EDU."
        canonical="/about"
      />
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="about-headline">
              About GigLine Safety & Compliance
            </h1>
            <p className="text-lg text-white/90">
              Founded by Vince Lawrence — 25+ years of safety leadership, OSHA certified, 
              U.S. Navy veteran. I help small operations find and fix safety gaps before 
              they become citations or injuries.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Headshot */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-lg overflow-hidden"
                data-testid="headshot"
              >
                <img 
                  src="/vince-founder.png" 
                  alt="Vince Lawrence - Founder of GigLine Safety & Compliance"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Bio Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                Vince Lawrence
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  I've spent over 25 years managing safety programs in manufacturing, warehousing, 
                  and transportation. I've worked on the floor, in the office, and everywhere in between. 
                  I know what OSHA looks for because I've been on both sides of the inspection clipboard.
                </p>
                <p>
                  Before consulting, I built and managed safety programs for operations ranging from 
                  small fabrication shops to multi-facility distribution networks. I've trained hundreds 
                  of supervisors and frontline workers. I've investigated incidents, written programs, 
                  and testified in hearings.
                </p>
                <p>
                  I started GigLine Safety & Compliance because small operations need professional safety 
                  guidance but can't afford a full-time safety manager. My approach is simple: I come in, 
                  find what's exposed, tell you exactly what to fix, and leave you with documentation 
                  that holds up to scrutiny.
                </p>
                <p className="font-medium text-primary">
                  No ongoing contracts. No monthly retainers. One engagement at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gig Line Origin Story */}
      <section className="py-16 md:py-20 bg-secondary" data-testid="origin-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
              Why "GigLine"?
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <p className="text-lg text-muted-foreground mb-4">
                In the military, your <strong className="text-primary">gig line</strong> is the straight 
                line formed by the edge of your shirt placket, your belt buckle, and your trouser fly. 
                If any of these are misaligned, you're "out of standard" — and an inspector will find it.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                It's a small detail, but it represents something bigger: attention to standards, 
                discipline in execution, and the understanding that inspectors notice what you overlook.
              </p>
              <p className="text-lg text-primary font-medium">
                GigLine Safety & Compliance brings that same straight-line standard to safety and 
                compliance for small operations. I find the misalignments before OSHA does.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Grid */}
      <section className="py-16 md:py-24" data-testid="credentials-section">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Credentials & Background
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {credentials.map((cred, index) => (
              <div 
                key={index} 
                className="card text-center p-4"
                data-testid={`credential-${index}`}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <cred.icon size={24} className="text-accent" />
                </div>
                <p className="font-bold text-primary">{cred.label}</p>
                <p className="text-sm text-muted-foreground">{cred.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LaunchPath Reference */}
      <section className="py-16 md:py-20 bg-primary text-white" data-testid="launchpath-section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Truck size={48} className="mx-auto text-accent mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Also: LaunchPath Transportation EDU
            </h2>
            <p className="text-white/80 mb-6">
              I also run LaunchPath Transportation EDU, a free resource for small carriers and fleet 
              operators. If you're running trucks and need help understanding DOT compliance, driver 
              qualification files, or safety management systems, start there.
            </p>
            <img 
              src="/launchpath-logo-white.png" 
              alt="LaunchPath" 
              className="h-12 mx-auto mb-6"
              data-testid="about-launchpath-logo"
            />
            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-accent hover:bg-accent/90"
              data-testid="about-launchpath-cta"
            >
              Start with Ground 0 — Free
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20" data-testid="about-contact-cta">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Ready to Find Your Gaps?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            If your operation hasn't had an outside review in the last year — or if you've had 
            incidents, near-misses, or changes in your operation — let's talk.
          </p>
          <Link to="/contact" className="btn-primary" data-testid="about-bottom-cta">
            Request a Walkthrough or Review
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
