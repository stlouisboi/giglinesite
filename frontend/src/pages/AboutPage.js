import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <main data-testid="about-page">
      <SEO 
        title="About"
        description="Built for operations that don't have time for theory — only what actually works on the floor. Vince Lawrence, 25+ years safety leadership."
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
              Built for operations that don't have time for theory — only what actually works on the floor.
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
                  I've spent over 25 years in environments where safety isn't optional — manufacturing floors, warehouses, and transportation operations.
                </p>
                <p>
                  I've worked the floor, in leadership, and across systems. I've seen what happens when expectations are not met — and how quickly small issues become real problems.
                </p>
                <p className="font-medium text-[#1C2B2B]">
                  GigLine was built for a specific gap.
                </p>
                <p>
                  Most small operations don't have a full-time safety department.
                </p>
                <p>
                  But they do need someone who can step in, walk the operation, and call out what actually matters.
                </p>
                <p className="font-medium text-[#1C2B2B]">
                  That's the role. That's what I do when I show up.
                </p>
                <div className="py-2">
                  <p>I walk the floor.</p>
                  <p>I review what exists.</p>
                  <p>I identify what's missing.</p>
                  <p>I document what matters.</p>
                </div>
                <p className="font-medium text-[#1C2B2B] pt-2">
                  One visit.<br />
                  Clear findings.<br />
                  No contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statement Anchor */}
      <section className="py-16 md:py-24 bg-[#0D1B2A]" data-testid="about-statement-anchor">
        <div className="container text-center max-w-2xl mx-auto">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 leading-snug">
            Most issues aren't new.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C9A84C] leading-snug mt-2">
            They've just gone unchecked.
          </p>
        </div>
      </section>

      {/* Why "GigLine" */}
      <section className="py-16 md:py-20 bg-[#F5F5F3]" data-testid="origin-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 text-center" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              Why "GigLine"?
            </h2>
            <p className="text-center text-[#1C2B2B]/50 mb-8">
              It's a small detail. But it explains everything.
            </p>
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
                  Because in most operations, the problem isn't effort.<br />
                  It's misalignment.
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
                If you run a small fleet or are building a transportation operation, the issue is often not a single gap — it's the absence of a system.
              </p>
              <p>
                If your issue is structural, not just visible — that's where LaunchPath comes in.
              </p>
              <p>
                GigLine identifies exposure.<br />
                LaunchPath installs what should have been there from the start.
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
            If You're Not Sure What's Exposed — Start Here.
          </h2>
          <p className="text-[#1C2B2B]/70 mb-8 leading-relaxed">
            Six questions. 90 seconds. A clear picture of where you stand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link 
              to="/request-walkthrough" 
              className="inline-flex items-center gap-2 bg-[#B8972C] hover:bg-[#A6872A] text-white font-bold px-8 py-4 rounded transition-colors"
              data-testid="about-cta-walkthrough"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/safety-check" 
              className="inline-flex items-center gap-2 border-2 border-[#1C2B2B]/20 hover:border-[#1C2B2B]/40 text-[#1C2B2B] font-semibold px-8 py-4 rounded transition-colors"
              data-testid="about-cta-safety-check"
            >
              Take the Free Safety Check
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
