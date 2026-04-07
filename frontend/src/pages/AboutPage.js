import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <main data-testid="about-page">
      <SEO 
        title="About"
        description="Built for small operations that need a clear picture of what is exposed before it becomes a citation, an injury, or a shutdown. Vince Lawrence, 25+ years safety leadership."
        canonical="/about"
      />

      {/* Hero Section */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{fontFamily: "Georgia, 'Times New Roman', serif"}} data-testid="about-headline">
              About GigLine Safety & Compliance
            </h1>
            <p className="text-lg text-white/85 leading-relaxed">
              Built for small operations that need a clear picture of what is exposed — before it becomes a citation, an injury, or a shutdown.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Portrait — slightly reduced brightness, more contrast */}
            <div className="lg:col-span-1">
              <div 
                className="rounded overflow-hidden"
                data-testid="headshot"
              >
                <img 
                  src="/vince-about.png" 
                  alt="Vince Lawrence — Founder, GigLine Safety and Compliance"
                  className="w-full h-auto"
                  style={{filter: "brightness(0.92) contrast(1.08)"}}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-6" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                Vince Lawrence
              </h2>
              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed">
                <p>
                  I have spent over 25 years working in environments where safety is not optional — manufacturing floors, warehouses, and transportation operations where mistakes have consequences.
                </p>
                <p>
                  I have worked on the floor, in leadership, and across systems. I know what OSHA looks for because I have seen what happens when those expectations are not met.
                </p>
                <p>
                  Before consulting, I built and managed safety programs across operations ranging from small fabrication shops to multi-site distribution networks. I have trained supervisors, investigated incidents, written programs, and sat through the moments when something went wrong and everyone needed answers.
                </p>
                <p className="font-medium text-[#1C2B2B]">
                  GigLine was built for a specific problem:
                </p>
                <p>
                  Small operations do not need a full-time safety department.<br />
                  But they do need someone who can step in, identify what is exposed, and tell them what to fix first.
                </p>
                <p className="font-medium text-[#1C2B2B]">
                  That is the role.
                </p>
                <div className="py-2">
                  <p>I walk the operation.</p>
                  <p>I review what exists.</p>
                  <p>I identify what is missing.</p>
                  <p>I document what matters.</p>
                </div>
                <p className="font-medium text-[#1C2B2B] pt-2">
                  No ongoing contracts.<br />
                  No monthly retainers.<br />
                  One engagement at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why "GigLine" */}
      <section className="py-16 md:py-20 bg-[#F5F5F3]" data-testid="origin-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8 text-center" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              Why "GigLine"?
            </h2>
            <div className="bg-white rounded p-8 border border-[#1C2B2B]/10">
              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed">
                <p>
                  In the military, your <strong className="text-[#1C2B2B]">gig line</strong> is the straight line formed by your shirt, your belt buckle, and your trouser fly.
                </p>
                <p>
                  If it is off — even slightly — you are out of standard.
                </p>
                <p>
                  It is a small detail. But it represents something larger:
                </p>
                <div className="py-1">
                  <p>Attention to alignment.</p>
                  <p>Discipline in execution.</p>
                  <p>And the understanding that inspectors notice what others ignore.</p>
                </div>
                <p className="font-medium text-[#1C2B2B]">
                  That is where the name comes from.
                </p>
                <p>
                  GigLine applies that same standard to safety and compliance.
                </p>
                <div className="py-1">
                  <p>Not broad advice.</p>
                  <p>Not general guidance.</p>
                  <p className="font-medium text-[#1C2B2B]">Alignment.</p>
                </div>
                <p>
                  Because in most operations, the problem is not effort.<br />
                  It is misalignment.
                </p>
                <p className="font-medium text-[#1C2B2B]">
                  And misalignment is what gets found.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Background */}
      <section className="py-16 md:py-24" data-testid="credentials-section">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 text-center" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
            Credentials & Background
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: '25+', sub: 'Years', desc: 'Safety Leadership' },
              { label: 'OSHA', sub: '', desc: '30-Hour Certified' },
              { label: 'USN', sub: '', desc: 'U.S. Navy Veteran' },
              { label: 'MFG', sub: '', desc: 'Manufacturing Experience' },
              { label: 'WHSE', sub: '', desc: 'Warehousing Operations' },
              { label: 'TRANS', sub: '', desc: 'Transportation Safety' },
            ].map((cred, index) => (
              <div 
                key={index} 
                className="text-center border border-[#1C2B2B]/10 rounded p-5"
                data-testid={`credential-${index}`}
              >
                <p className="text-2xl font-bold text-[#B8972C]">{cred.label}</p>
                {cred.sub && <p className="text-xs text-[#1C2B2B]/50 uppercase tracking-wide">{cred.sub}</p>}
                <p className="text-sm text-[#1C2B2B]/60 mt-1">{cred.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-semibold px-8 py-4 rounded transition-colors"
              data-testid="credentials-request-walkthrough"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* LaunchPath Section */}
      <section className="py-16 md:py-20 bg-[#1C2B2B] text-white" data-testid="launchpath-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              Also: LaunchPath Transportation EDU
            </h2>
            <div className="text-white/80 space-y-4 leading-relaxed mb-8">
              <p className="font-medium text-white">
                GigLine handles review.<br />
                LaunchPath handles installation.
              </p>
              <p>
                If you operate a small fleet or are building a transportation operation, the issue is often not a single gap — it is the absence of a system.
              </p>
              <p>
                That is what LaunchPath was built to solve.
              </p>
              <p>
                GigLine is a one-time engagement to identify exposure.<br />
                LaunchPath is a structured program to install what should have been there from the start.
              </p>
              <p>
                Two different problems.<br />
                Two different solutions.
              </p>
              <p className="font-medium text-white">
                Start with the one that fits.
              </p>
            </div>
            <div className="text-center">
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
                className="inline-flex items-center gap-2 bg-[#B8972C] hover:bg-[#A6872A] text-white font-semibold px-8 py-4 rounded transition-colors"
                data-testid="about-launchpath-cta"
              >
                Start with Ground 0 — Free
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20" data-testid="about-contact-cta">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
            If That Sounds Like Your Operation
          </h2>
          <p className="text-[#1C2B2B]/70 mb-8 leading-relaxed">
            If that sounds like your operation, start with the Safety Check. Six questions. 90 seconds. A clear picture of where you stand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link 
              to="/safety-check" 
              className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-semibold px-8 py-4 rounded transition-colors"
              data-testid="about-bottom-cta"
            >
              Take the Free Safety Check
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-[#1C2B2B]/60 text-base">
            Or reach out directly —{' '}
            <a href="tel:3363298899" className="text-[#B8972C] hover:underline font-semibold">(336) 329-8899</a>
          </p>
          <p className="text-[#1C2B2B]/50 text-sm mt-4">
            Want to see the full scope first?{' '}
            <Link to="/services" className="text-[#B8972C] hover:underline font-medium">View all services and pricing</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
