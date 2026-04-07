import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Mail, Phone, CheckCircle } from 'lucide-react';
import CallVinceBar from '../components/CallVinceBar';
import SafetyCheckTeaser from '../components/SafetyCheckTeaser';
import SEO from '../components/SEO';

const HomePage = () => {
  return (
    <main>
      <SEO
        title="GigLine Safety & Compliance | Safety Walkthroughs & Gap Checks for Small Operations"
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. Based in Kernersville, NC."
        ogTitle="GigLine Safety & Compliance"
        ogDescription="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. Based in Kernersville, NC."
      />

      {/* ━━━━━ SECTION 1 — HERO ━━━━━ */}
      <section id="hero" className="bg-[#1C2B2B] py-20 md:py-28" data-testid="hero-section">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6" data-testid="hero-headline">
            Safety Issues Don't Announce Themselves.{' '}
            <span className="block mt-2">They Show Up as Injuries, Fines, and Downtime.</span>
          </h1>

          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-6" data-testid="hero-subline">
            GigLine Safety & Compliance provides focused walkthroughs for small operations — identifying OSHA exposure before it becomes a problem.
          </p>

          {/* Positioning Line */}
          <p className="text-sm md:text-base text-[#B8972C] font-semibold tracking-wide uppercase mb-10" data-testid="hero-positioning">
            One engagement. A written report. No retainer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" data-testid="hero-ctas">
            <Link
              to="/safety-check"
              className="bg-[#B8972C] hover:bg-[#A3852A] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="hero-cta-safety-check"
            >
              Run the Safety Check
              <ArrowRight size={18} />
            </Link>
            <a
              href="#contact"
              className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="hero-cta-walkthrough"
            >
              Request a Walkthrough
            </a>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-base text-white/50 mb-4" data-testid="hero-trust-bar">
            <span>25+ Years Safety Leadership</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>OSHA 30-Hour Certified</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>U.S. Navy Veteran</span>
          </div>

          {/* Local Trust Cue */}
          <p className="text-base text-white/40" data-testid="hero-local-trust">
            Based in Kernersville, NC — on-site in the Triad, remote nationwide.
          </p>
        </div>
      </section>

      {/* ━━━━━ SAFETY CHECK TEASER (GL-WEB-001) ━━━━━ */}
      <SafetyCheckTeaser />

      {/* ━━━━━ CALL VINCE BAR — First Placement (GL-WEB-003) ━━━━━ */}
      <CallVinceBar />

      {/* ━━━━━ SECTION 2 — THE REALITY ━━━━━ */}
      <section id="reality" className="py-16 md:py-24 bg-white" data-testid="reality-section">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            THE REALITY
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 leading-tight" data-testid="reality-headline">
            Most Small Operations Are Not Audited Until Something Goes Wrong. By That Point, the Issues Were Already There.
          </h2>

          <p className="text-base text-[#1C2B2B]/60 mb-10">
            The risk is not hidden. It is just not being looked at correctly.
          </p>

          {/* Three Violation Blocks */}
          <div className="space-y-6 mb-10">
            {/* Block 1 */}
            <div className="border border-[#1C2B2B]/10 rounded p-6" data-testid="violation-block-1">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-1">Blocked electrical panel</h3>
              <p className="text-sm font-medium text-[#B8972C] mb-3">29 CFR 1910.303</p>
              <p className="text-base text-[#1C2B2B]/60 mb-2">
                Serious violation — up to $16,550 per instance.
              </p>
              <p className="text-base text-[#1C2B2B]/60">
                Response time in an emergency depends on panel access. If it is blocked, seconds are lost.
              </p>
            </div>

            {/* Block 2 */}
            <div className="border border-[#1C2B2B]/10 rounded p-6" data-testid="violation-block-2">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-1">Trip hazards in walkways</h3>
              <p className="text-sm font-medium text-[#B8972C] mb-3">29 CFR 1910.22</p>
              <p className="text-base text-[#1C2B2B]/60">
                Direct injury exposure — the most common source of recordable incidents in general industry.
              </p>
            </div>

            {/* Block 3 */}
            <div className="border border-[#1C2B2B]/10 rounded p-6" data-testid="violation-block-3">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-1">Missing or incomplete chemical labels</h3>
              <p className="text-sm font-medium text-[#B8972C] mb-3">29 CFR 1910.1200</p>
              <p className="text-base text-[#1C2B2B]/60 mb-2">
                Compliance failure — every chemical on site requires a label and an accessible SDS.
              </p>
              <p className="text-base text-[#1C2B2B]/60">
                Most operations have gaps they do not know about.
              </p>
            </div>
          </div>

          {/* Closing Line */}
          <p className="text-base text-[#1C2B2B]/60" data-testid="reality-closing">
            These are not edge cases. They are the most commonly cited violations in small operations. One walkthrough finds them.
          </p>
        </div>
      </section>

      {/* ━━━━━ INSPECTION IMAGE SECTION — Visual Depth Break ━━━━━ */}
      <section className="relative" data-testid="inspection-image-section">
        <div
          className="relative bg-cover bg-no-repeat py-24 md:py-32"
          style={{backgroundImage: "url('/vince-inspecting.png')", backgroundPosition: "center 40%"}}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container relative z-10 max-w-2xl">
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
          </div>
        </div>
      </section>

      {/* ━━━━━ SECTION 3 — WHAT WE DO ━━━━━ */}
      <section id="services" className="py-16 md:py-24 bg-[#F9F8F6]" data-testid="services-section">
        <div className="container max-w-5xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            WHAT WE DO
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 leading-tight" data-testid="services-headline">
            Three Specific Engagements. Each Produces a Written Deliverable.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Safety Walkthrough */}
            <div className="bg-white border border-[#1C2B2B]/10 rounded p-6 flex flex-col" data-testid="service-card-walkthrough">
              <p className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase mb-3">OFFER 01</p>
              <h3 className="text-xl font-bold text-[#1C2B2B] mb-3">Safety Walkthrough</h3>
              <p className="text-base text-[#1C2B2B]/60 mb-3 flex-grow">
                A structured on-site review of common OSHA exposure areas. Walkthroughs run 15 minutes to 3 hours depending on the size and complexity of the operation.
              </p>
              <p className="text-base text-[#1C2B2B]/60 mb-4">
                You leave with a written report and a clear list of what to address first.
              </p>
              <p className="text-lg font-bold text-[#1C2B2B] mb-4">Starting at $650</p>
              <a
                href="#contact"
                className="bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white text-base font-semibold px-6 py-3 rounded transition-colors text-center"
                data-testid="service-cta-walkthrough"
              >
                Request a Walkthrough
              </a>
            </div>

            {/* Card 2 — Documentation Review */}
            <div className="bg-white border border-[#1C2B2B]/10 rounded p-6 flex flex-col" data-testid="service-card-documentation">
              <p className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase mb-3">OFFER 02</p>
              <h3 className="text-xl font-bold text-[#1C2B2B] mb-3">Documentation Review</h3>
              <p className="text-base text-[#1C2B2B]/60 mb-3 flex-grow">
                Basic compliance checks on required programs and records. Most operations have gaps they do not know about until an inspector asks for them.
              </p>
              <p className="text-base text-[#1C2B2B]/60 mb-4">
                Remote or on-site. You get a red, yellow, and green gap score with a clear missing-items list.
              </p>
              <p className="text-lg font-bold text-[#1C2B2B] mb-4">Starting at $550 remote</p>
              <a
                href="#contact"
                className="bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white text-base font-semibold px-6 py-3 rounded transition-colors text-center"
                data-testid="service-cta-documentation"
              >
                Request a Review
              </a>
            </div>

            {/* Card 3 — Incident Response Support */}
            <div className="bg-white border border-[#1C2B2B]/10 rounded p-6 flex flex-col" data-testid="service-card-incident">
              <p className="text-xs font-semibold tracking-widest text-[#B8972C] uppercase mb-3">OFFER 03</p>
              <h3 className="text-xl font-bold text-[#1C2B2B] mb-3">Incident Response Support</h3>
              <p className="text-base text-[#1C2B2B]/60 mb-3 flex-grow">
                Post-incident review and corrective direction. Documents management's response for OSHA, insurance, or internal records.
              </p>
              <p className="text-base text-[#1C2B2B]/60 mb-4">
                When something goes wrong, the response needs to be fast and documented correctly.
              </p>
              <p className="text-lg font-bold text-[#1C2B2B] mb-4">Starting at $900</p>
              <a
                href="#contact"
                className="bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white text-base font-semibold px-6 py-3 rounded transition-colors text-center"
                data-testid="service-cta-incident"
              >
                Contact About an Incident
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ CALL VINCE BAR — Second Placement (GL-WEB-003) ━━━━━ */}
      <CallVinceBar />

      {/* ━━━━━ SECTION 4 — WHAT YOU GET ━━━━━ */}
      <section id="deliverables" className="py-16 md:py-24 bg-white" data-testid="deliverables-section">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            WHAT YOU GET
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8" data-testid="deliverables-headline">
            Every Engagement Produces a Written Report.
          </h2>

          <div className="space-y-5 mb-10">
            {[
              'Focused walkthrough \u2014 15 minutes to 3 hours depending on operation size',
              'Photo-documented findings',
              'CFR-referenced observations',
              'Clear corrective actions in plain language',
              'Written report delivered within 24\u201348 hours',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3" data-testid={`deliverable-${index}`}>
                <CheckCircle size={20} className="text-[#B8972C] mt-0.5 flex-shrink-0" />
                <p className="text-[#1C2B2B]/70 text-sm md:text-base">{item}</p>
              </div>
            ))}
          </div>

          {/* Closing Callout */}
          <div className="border-l-4 border-[#B8972C] pl-6 py-2" data-testid="deliverables-callout">
            <p className="text-lg font-semibold text-[#1C2B2B] italic">
              This is not a full audit. It is a signal.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━ SECTION 5 — WHO WE WORK WITH ━━━━━ */}
      <section id="who-we-serve" className="py-16 md:py-24 bg-[#F9F8F6]" data-testid="who-we-serve-section">
        <div className="container max-w-5xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            WHO WE WORK WITH
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 leading-tight" data-testid="who-we-serve-headline">
            Small Operations Where the Owner Is Also the Safety Manager.
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-[#1C2B2B]/10 rounded p-6 bg-white" data-testid="segment-manufacturers">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-2">Small Manufacturers & Fabrication Shops</h3>
              <p className="text-base text-[#1C2B2B]/60">
                Machine guarding, LOTO, HazCom, and training documentation.
              </p>
            </div>

            <div className="border border-[#1C2B2B]/10 rounded p-6 bg-white" data-testid="segment-warehouses">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-2">Warehouses & Distribution Centers</h3>
              <p className="text-base text-[#1C2B2B]/60">
                Forklift safety, racking, dock operations, and pedestrian separation.
              </p>
            </div>

            <div className="border border-[#1C2B2B]/10 rounded p-6 bg-white" data-testid="segment-contractors">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-2">Contractors & Maintenance Operations</h3>
              <p className="text-base text-[#1C2B2B]/60">
                Jobsite safety, PPE, fall protection basics, and documentation gaps.
              </p>
            </div>

            <div className="border border-[#1C2B2B]/10 rounded p-6 bg-white" data-testid="segment-trucking">
              <h3 className="text-lg font-bold text-[#1C2B2B] mb-2">Trucking Fleets — 5 to 25 Trucks</h3>
              <p className="text-sm text-[#1C2B2B]/60">
                Driver files, drug and alcohol programs, vehicle maintenance records, and FMCSA gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ SECTION 6 — ABOUT ━━━━━ */}
      <section id="about" className="py-16 md:py-24 bg-white" data-testid="about-section">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            ABOUT
          </p>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src="/vince-founder.png"
                alt="Vince Lawrence — Founder, GigLine Safety & Compliance, OSHA certified safety consultant, Kernersville NC"
                className="w-full rounded"
                data-testid="about-headshot"
              />
            </div>

            {/* Bio */}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-[#1C2B2B] mb-1" data-testid="about-name">Vince Lawrence</h3>
              <p className="text-base text-[#1C2B2B]/50 mb-6">
                Safety Coordinator &nbsp;&middot;&nbsp; OSHA 30-Hour &nbsp;&middot;&nbsp; U.S. Navy Veteran
              </p>

              <div className="space-y-4 text-[#1C2B2B]/60 text-base mb-6">
                <p>
                  I have spent 25 years working in environments where safety was not theoretical — it was operational.
                </p>
                <p>
                  Manufacturing floors. Compliance systems. Real operations with real consequences when something was missed.
                </p>
                <p>
                  GigLine was built to give small operations a clear, straightforward way to understand their risk without needing a full consulting firm.
                </p>
                <p>
                  One visit. Clear findings. No confusion.
                </p>
              </div>

              {/* Founder Pull Quote */}
              <div className="border-l-4 border-[#B8972C] pl-6 py-2 mb-8" data-testid="about-founder-quote">
                <p className="text-base font-semibold text-[#1C2B2B] italic">
                  I find what is exposed. I tell you exactly what to fix. You keep the liability off the floor.
                </p>
              </div>

              {/* Credential Block */}
              <div className="space-y-2 text-base text-[#1C2B2B]/60" data-testid="about-credentials">
                <p>25+ years in operations and safety leadership</p>
                <p>OSHA 30-hour and 10-hour certified</p>
                <p>Manufacturing, warehouse, and transportation background</p>
                <p>U.S. Navy veteran</p>
                <p>Based in Kernersville, NC</p>
                <p>On-site in the Triad — remote nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ SECTION 7 — FOR TRANSPORTATION OPERATIONS ━━━━━ */}
      <section id="transportation" className="py-16 md:py-24 bg-[#1C2B2B]" data-testid="transportation-section">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">
            FOR TRANSPORTATION OPERATIONS
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight" data-testid="transportation-headline">
            If You Run Trucks, the Gaps Run Deeper.
          </h2>

          <div className="space-y-4 text-white/60 text-base mb-8">
            <p>
              Fleet documentation gaps — driver qualification files, drug and alcohol programs, maintenance records — require more than a walkthrough to fix.
            </p>
            <p>
              GigLine finds the gaps. LaunchPath installs the system.
            </p>
            <p>
              LaunchPath Transportation EDU is a 90-day compliance installation program for new motor carriers built on the same standards GigLine applies on the floor.
            </p>
            <p>
              If what a review finds goes deeper than a list of corrections, that is where LaunchPath begins.
            </p>
          </div>

          <a
            href="https://launchpathedu.com/ground-0-briefing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#B8972C] hover:bg-[#A3852A] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 mb-4"
            data-testid="transportation-cta"
          >
            Start with Ground 0 — Free
            <ExternalLink size={16} />
          </a>

          <p className="text-base text-white/30">
            Ground 0 is free. It tells you whether you need GigLine, LaunchPath, or both.
          </p>
        </div>
      </section>

      {/* ━━━━━ SECTION 8 — FINAL CTA ━━━━━ */}
      <section id="contact" className="py-16 md:py-24 bg-white" data-testid="final-cta-section">
        <div className="container max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4">
            GET STARTED
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 leading-tight" data-testid="final-cta-headline">
            If You Are Not Sure Where Your Exposure Is — Start With the Safety Check.
          </h2>

          <p className="text-base text-[#1C2B2B]/60 mb-3">
            Six questions. 90 seconds. A clear picture of where your operation stands.
          </p>

          <p className="text-base text-[#1C2B2B]/60 mb-8">
            Or skip the check and reach out directly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" data-testid="final-cta-buttons">
            <Link
              to="/safety-check"
              className="bg-[#B8972C] hover:bg-[#A3852A] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="final-cta-safety-check"
            >
              Run the Safety Check
              <ArrowRight size={18} />
            </Link>
            <a
              href="#contact"
              className="border-2 border-[#1C2B2B]/20 hover:border-[#1C2B2B]/40 text-[#1C2B2B] font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="final-cta-walkthrough"
            >
              Request a Walkthrough
            </a>
          </div>

          {/* Contact Block */}
          <div className="space-y-2 text-[#1C2B2B]/70" data-testid="final-contact-block">
            <p className="font-bold text-[#1C2B2B] text-lg">Vince Lawrence</p>
            <p className="font-medium text-[#1C2B2B]">GigLine Safety & Compliance</p>
            <p>
              <a href="mailto:vince@giglinecompliance.com" className="hover:text-[#B8972C] transition-colors">
                vince@giglinecompliance.com
              </a>
            </p>
            <p>
              <a href="tel:3363298899" className="hover:text-[#B8972C] transition-colors">
                (336) 329-8899
              </a>
            </p>
            <p>
              <a href="https://giglinecompliance.com" className="hover:text-[#B8972C] transition-colors">
                giglinecompliance.com
              </a>
            </p>
          </div>

          <div className="mt-8 text-sm text-[#1C2B2B]/40 max-w-lg mx-auto" data-testid="final-availability">
            <p>
              Available for limited on-site days each month in the Triad and surrounding region.
            </p>
            <p>
              Remote reviews available nationwide.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
