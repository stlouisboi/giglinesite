import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Factory, Warehouse, Truck, Wrench, CheckCircle, Award, Clock, FileText, ArrowRight, ExternalLink, Mail, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import CallVinceBar from '../components/CallVinceBar';
import SEO from '../components/SEO';

const HomePage = () => {
  const clientTypes = [
    {
      icon: Factory,
      title: 'Small Manufacturers & Fabrication Shops',
      description: 'Machine exposure, material handling, documentation gaps, and production-floor risk.',
    },
    {
      icon: Warehouse,
      title: 'Warehouses & Distribution Centers',
      description: 'Forklift movement, ladder use, dock exposure, storage practices, and inventory-handling risk.',
    },
    {
      icon: Wrench,
      title: 'Contractors & Maintenance Operations',
      description: 'Field crews, service teams, maintenance tasks, and recurring exposure points that are easy to miss.',
    },
    {
      icon: Truck,
      title: 'Trucking Fleets 5\u201325 Trucks',
      description: 'Small carrier operations that need practical safety review, driver-file discipline, and operational clarity.',
    },
  ];

  const offers = [
    {
      number: '01',
      title: 'Safety Walkthrough & Top 10 Fixes Report',
      description: 'I walk your facility, observe operations, and identify what creates the most immediate exposure. You get a written report with the top ten priority fixes.',
      deliverables: [
        'Facility walkthrough or floor-level review',
        'Top ten safety exposures identified',
        'Written report with priority order',
        'Practical first-step corrections',
        'Brief follow-up call to review findings',
      ],
      pricing: 'Starting at $650\u2013$750',
      bestFor: 'Operations that need a fast, outside view of what is most exposed.',
    },
    {
      number: '02',
      title: 'Safety Documentation Review & Gap Check',
      description: 'I review the paper side of your operation: written programs, training records, inspections, logs, and required documentation. You get a written gap report showing what is present, what is missing, and what needs attention first.',
      deliverables: [
        'Review of safety program and written policies',
        'Training record review',
        'Inspection log and documentation check',
        'Written gap report with action items',
        'Priority ranking of missing or weak documentation',
      ],
      pricing: 'Starting at $550 remote, $750 on-site',
      bestFor: 'Companies preparing for growth, audits, updates, or internal cleanup.',
    },
    {
      number: '03',
      title: 'Incident Review & Corrective Action Support',
      description: 'After an injury, near miss, property damage event, or OSHA-triggering incident, I help you review what happened, identify what broke down, and document corrective action.',
      deliverables: [
        'Incident walkthrough interview support',
        'Basic chain-of-events review',
        'Corrective action guidance',
        'Documentation support for internal response',
        'Practical next-step recommendations',
      ],
      pricing: 'Starting at $900\u2013$1,500',
      bestFor: 'Operations that need help responding clearly after something goes wrong.',
    },
  ];

  return (
    <main data-testid="homepage">
      <SEO 
        title={null}
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. A clear path forward."
        canonical="/"
      />

      {/* SECTION 1 — HERO */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-24" data-testid="hero-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6" data-testid="hero-headline" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                Your Operation Has Gaps.{' '}
                <span className="text-[#B8972C]">The Question Is Who Finds Them First.</span>
              </h1>
              <p className="text-lg text-white/85 mb-6 leading-relaxed" data-testid="hero-subhead">
                Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. A clear path forward.
              </p>
              <p className="text-base text-white/70 mb-8 leading-relaxed">
                I built GigLine because small operators rarely need a full-time safety department. They need someone who can walk in, identify what is exposed, and tell them what to fix first.
              </p>

              <Link to="/contact" className="inline-flex items-center gap-2 bg-[#B8972C] hover:bg-[#A6872A] text-white font-semibold px-8 py-4 rounded transition-colors text-base" data-testid="hero-cta">
                Request a Walkthrough or Review
                <ArrowRight size={20} />
              </Link>

              {/* Trust Bar */}
              <div className="mt-10 pt-6 border-t border-white/15">
                <div className="flex flex-wrap items-center gap-6 md:gap-10" data-testid="trust-bar">
                  <div className="flex items-center gap-2 text-white/75">
                    <Clock size={18} className="text-[#B8972C]" />
                    <span className="text-sm font-medium">25+ Years Safety Leadership</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/75">
                    <Award size={18} className="text-[#B8972C]" />
                    <span className="text-sm font-medium">OSHA 30-Hour Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/75">
                    <Shield size={18} className="text-[#B8972C]" />
                    <span className="text-sm font-medium">U.S. Navy Veteran</span>
                  </div>
                </div>
                <p className="text-sm text-white/50 mt-3">
                  Based in North Carolina. Serving small operations that need clarity, not complexity.
                </p>
              </div>
            </div>

            {/* Right: Portrait */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/vince-portrait.png" 
                  alt="Vince Lawrence — Founder, GigLine Safety and Compliance"
                  className="w-full max-w-md rounded-sm"
                  data-testid="hero-portrait"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — INSPECTION AUTHORITY */}
      <section className="relative" data-testid="inspection-section">
        <div 
          className="relative bg-cover bg-no-repeat py-24 md:py-32"
          style={{backgroundImage: "url('/vince-inspecting.png')", backgroundPosition: "center 40%"}}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                This Is What Your Operation Looks Like Under Review.
              </h2>
              <div className="text-lg text-white/90 space-y-1 mb-8 leading-relaxed">
                <p>Every lock.</p>
                <p>Every tag.</p>
                <p>Every ladder.</p>
                <p>Every point of exposure.</p>
              </div>
              <p className="text-white/90 font-semibold text-lg mb-6">
                If it is not correct, it gets found.
              </p>
              <p className="text-white/60 text-base">
                GigLine is built for operators who need a real picture of what is exposed before OSHA, an incident, or a breakdown forces the issue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call Vince Bar */}
      <CallVinceBar />

      {/* SECTION 3 — SAFETY CHECK */}
      <section className="py-16 md:py-24 bg-white" data-testid="safety-check-teaser">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
            Six Questions. Ninety Seconds. A Clearer Picture of Where You Stand.
          </h2>
          <p className="text-[#1C2B2B]/70 mb-6 leading-relaxed">
            These are the violations OSHA cites most often in small operations. Answer honestly. This is not your full safety review. It is your first signal.
          </p>

          {/* Preview Questions */}
          <div className="space-y-4 mb-6">
            <div className="border-l-4 border-[#B8972C]/50 pl-4 py-2">
              <p className="text-[#1C2B2B]">
                Do you have a written Hazard Communication program and can your people find the SDS for every chemical on site right now?
              </p>
              <p className="text-sm text-[#1C2B2B]/50 mt-1">29 CFR 1910.1200</p>
            </div>
            <div className="border-l-4 border-[#B8972C]/50 pl-4 py-2">
              <p className="text-[#1C2B2B]">
                Are your forklift operators certified in the last three years and are daily pre-shift inspections documented?
              </p>
              <p className="text-sm text-[#1C2B2B]/50 mt-1">29 CFR 1910.178</p>
            </div>
          </div>

          <p className="text-sm text-[#1C2B2B]/60 mb-6">
            You will get a simple score and a short read on what the result may mean for your operation.
          </p>

          <Link 
            to="/safety-check" 
            className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-semibold px-8 py-4 rounded transition-colors"
            data-testid="safety-check-teaser-cta"
          >
            Run the Full Safety Check
            <ArrowRight size={18} />
          </Link>

          <p className="text-sm text-[#1C2B2B]/50 mt-4">
            Built from the issues that repeatedly surface in manufacturing, warehousing, maintenance, and fleet environments.
          </p>
        </div>
      </section>

      {/* SECTION 4 — WHO I WORK WITH */}
      <section className="py-16 md:py-24 bg-[#F5F5F3]" data-testid="clients-section" id="who-we-serve">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] text-center mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>Who I Work With</h2>
          <p className="text-[#1C2B2B]/70 text-center max-w-2xl mx-auto mb-12">
            Small operations are usually too large to ignore safety and too lean to carry a full internal safety function. That is where GigLine fits.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientTypes.map((client, index) => (
              <div 
                key={index} 
                className="bg-white border border-[#1C2B2B]/10 rounded p-6 hover:border-[#B8972C]/40 transition-colors"
                data-testid={`client-card-${index}`}
              >
                <div className="w-12 h-12 bg-[#1C2B2B]/5 rounded flex items-center justify-center mb-4">
                  <client.icon size={24} className="text-[#1C2B2B]/70" />
                </div>
                <h3 className="text-base font-semibold text-[#1C2B2B] mb-2">{client.title}</h3>
                <p className="text-sm text-[#1C2B2B]/60">{client.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT I OFFER */}
      <section className="py-16 md:py-24 bg-white" data-testid="offers-section" id="services">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] text-center mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>What I Offer</h2>
          <p className="text-[#1C2B2B]/70 text-center max-w-2xl mx-auto mb-12">
            Focused safety services. Each delivers a written report with clear action items. No ongoing contract. No inflated overhead.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div 
                key={index} 
                className="border border-[#1C2B2B]/10 rounded p-6 hover:border-[#B8972C]/40 transition-colors"
                data-testid={`offer-card-${index}`}
              >
                <span className="text-[#B8972C] font-bold text-sm tracking-wide">OFFER {offer.number}</span>
                <h3 className="text-xl font-bold text-[#1C2B2B] mt-2 mb-3">{offer.title}</h3>
                <p className="text-sm text-[#1C2B2B]/60 mb-4 leading-relaxed">{offer.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-[#1C2B2B] mb-2">Deliverables:</p>
                  <ul className="space-y-2">
                    {offer.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#1C2B2B]/60">
                        <CheckCircle size={16} className="text-[#B8972C] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F5F5F3] rounded p-3 mb-4">
                  <p className="text-sm text-[#1C2B2B]/50">Best for:</p>
                  <p className="text-sm font-medium text-[#1C2B2B]">{offer.bestFor}</p>
                </div>

                <p className="text-lg font-bold text-[#B8972C] mb-4">{offer.pricing}</p>
                
                <Link 
                  to="/contact" 
                  className="block w-full text-center border-2 border-[#1C2B2B] text-[#1C2B2B] font-semibold py-3 rounded hover:bg-[#1C2B2B] hover:text-white transition-colors"
                  data-testid={`offer-cta-${index}`}
                >
                  Request This Service
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services" className="text-[#B8972C] font-medium hover:underline inline-flex items-center gap-1">
              View Full Service Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call Vince Bar */}
      <CallVinceBar message="Not sure where to start? Call or email and I will tell you which review makes sense." />

      {/* SECTION 6 — WHY BRING ME IN */}
      <section className="py-16 md:py-24 bg-[#1C2B2B] text-white" data-testid="background-section" id="about">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>Why Bring Me In</h2>
            <p className="text-white/70 text-center mb-10">
              Most operations do not fail because they do not care about safety. They fail because what they built does not hold under inspection.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#B8972C]">25</p>
                <p className="text-sm text-white/60">Years Safety Leadership</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#B8972C]">OSHA</p>
                <p className="text-sm text-white/60">30-Hour Certified</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#B8972C]">MFG</p>
                <p className="text-sm text-white/60">Manufacturing Background</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#B8972C]">USN</p>
                <p className="text-sm text-white/60">U.S. Navy Veteran</p>
              </div>
            </div>

            <div className="space-y-4 text-white/80 leading-relaxed mb-8">
              <p className="font-medium text-white">What twenty-five years in the field has taught me is simple:</p>
              <p>
                I know what repeated exposure looks like in manufacturing, warehousing, contractor operations, and transportation environments.
              </p>
              <p>
                I know which OSHA violations appear so often they stop being surprising and start becoming operational patterns.
              </p>
              <p>
                I know what a written program is supposed to say, and I know what actual conditions on the floor tend to reveal.
              </p>
              <p>
                I know the difference between a program that exists on paper and a program that is being carried out in practice.
              </p>
              <p>
                And because I have worked on both sides of inspection, I know what to look for before someone gets hurt, cited, or shut down.
              </p>
            </div>

            <p className="text-white/70 border-t border-white/15 pt-6">
              The credential is not the point. The point is knowing what matters, what gets missed, and what should be corrected first.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — GIGLINE / LAUNCHPATH BRIDGE */}
      <section className="py-16 md:py-24 bg-[#F5F5F3]" data-testid="fleets-section" id="fleets">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/50 uppercase mb-4">
              For Carriers and Fleets
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-[#1C2B2B]/70 mb-2">
              Two Different Problems. Two Different Solutions.
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              GigLine Finds the Gap. LaunchPath Installs the System.
            </h3>
            <div className="text-[#1C2B2B]/70 text-left space-y-4 mb-8 leading-relaxed">
              <p>
                If you operate a small fleet or recently activated your authority, a walkthrough or documentation review may help identify what is exposed.
              </p>
              <p>
                But if the issue is deeper\u2014driver qualification files, drug and alcohol program gaps, maintenance records, audit-readiness, or a full operating build\u2014then the work is bigger than a single review.
              </p>
              <p>
                That is where LaunchPath fits.
              </p>
              <p>
                GigLine is a one-time review built to expose what is weak. LaunchPath is a structured installation program built to put the system in place.
              </p>
            </div>
            <div className="text-left mb-8" data-testid="gigline-launchpath-bullets">
              <p className="text-[#1C2B2B]/70 flex items-start gap-2">
                <span className="text-[#B8972C] font-bold">\u2014</span>
                GigLine: one-time review to identify exposure.
              </p>
              <p className="text-[#1C2B2B]/70 flex items-start gap-2 mt-2">
                <span className="text-[#B8972C] font-bold">\u2014</span>
                LaunchPath: structured operating system installation for new or early-stage carriers.
              </p>
            </div>
            <img 
              src="/launchpath-logo.png" 
              alt="LaunchPath" 
              className="h-12 mx-auto mb-6"
              data-testid="launchpath-logo"
            />
            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-semibold px-8 py-4 rounded transition-colors"
              data-testid="launchpath-cta"
            >
              Start with Ground 0 \u2014 Free
              <ExternalLink size={18} />
            </a>
            <p className="text-sm text-[#1C2B2B]/50 mt-4">
              If you are unsure which one fits, start here. The right path depends on the depth of the problem.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CONTACT */}
      <section className="py-16 md:py-24 bg-white pb-24 md:pb-24" data-testid="contact-section" id="contact">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>Ready to Find Your Gaps?</h2>
              <p className="text-[#1C2B2B]/70 mb-8 leading-relaxed">
                Fill out the form and I will respond within one business day. If you are not sure which service fits your situation, describe the operation and I will point you in the right direction.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href="mailto:vince@giglinecompliance.com"
                  className="flex items-center gap-3 text-[#1C2B2B] hover:text-[#B8972C] transition-colors"
                  data-testid="contact-email"
                >
                  <div className="w-10 h-10 bg-[#1C2B2B]/5 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-[#B8972C]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1C2B2B]/50">Email</p>
                    <p className="font-medium">vince@giglinecompliance.com</p>
                  </div>
                </a>

                <a
                  href="tel:336-671-4967"
                  className="flex items-center gap-3 text-[#1C2B2B] hover:text-[#B8972C] transition-colors"
                  data-testid="contact-phone"
                >
                  <div className="w-10 h-10 bg-[#1C2B2B]/5 rounded-full flex items-center justify-center">
                    <Phone size={20} className="text-[#B8972C]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1C2B2B]/50">Phone</p>
                    <p className="font-medium">336-671-4967</p>
                  </div>
                </a>
              </div>

              <div className="bg-[#F5F5F3] p-6 rounded">
                <FileText size={24} className="text-[#B8972C] mb-3" />
                <p className="text-sm text-[#1C2B2B]/70">
                  <strong className="text-[#1C2B2B]">Not every operation needs the same level of review.</strong> Give a short description of your facility, team, or concern, and I will recommend the best starting point.
                </p>
              </div>
            </div>

            <div className="border border-[#1C2B2B]/10 rounded p-6 bg-white">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
