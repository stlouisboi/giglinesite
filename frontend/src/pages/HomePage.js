import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import CallVinceBar from '../components/CallVinceBar';
import SafetyCheckTeaser from '../components/SafetyCheckTeaser';
import SEO from '../components/SEO';

/* ── Scroll-reveal hook ── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); io.unobserve(el); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, className = '' }) => {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-fade ${className}`}>{children}</div>;
};

/* ── Section label component (GLOBAL 1) ── */
const SectionLabel = ({ text, light = false }) => (
  <div className="flex items-center gap-2 mb-4">
    <span
      className="inline-block w-4 h-4 border-2 flex-shrink-0"
      style={{ borderColor: '#C9A84C' }}
    />
    <span
      className="uppercase tracking-[3px]"
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#C9A84C', fontWeight: 400 }}
    >
      {text}
    </span>
  </div>
);

/* ── Inline SVG icons for Who We Work With ── */
const GearIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="5" />
    <path d="M14 2h4l.5 3.5a9 9 0 012.2 1.3l3.3-1.3 2 3.5-2.8 2.2a9 9 0 010 2.6l2.8 2.2-2 3.5-3.3-1.3a9 9 0 01-2.2 1.3L18 30h-4l-.5-3.5a9 9 0 01-2.2-1.3l-3.3 1.3-2-3.5 2.8-2.2a9 9 0 010-2.6L6 16l-2.8-2.2 2-3.5 3.3 1.3a9 9 0 012.2-1.3z" />
  </svg>
);

const WarehouseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="24" height="18" />
    <polygon points="2,10 16,2 30,10" />
    <line x1="12" y1="14" x2="12" y2="24" />
    <line x1="16" y1="14" x2="16" y2="24" />
    <line x1="20" y1="14" x2="20" y2="24" />
  </svg>
);

const HardHatIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 20h20" />
    <path d="M8 20c0-6 3.6-10 8-10s8 4 8 10" />
    <path d="M4 20c0 2 2 4 12 4s12-2 12-4" />
  </svg>
);

const TruckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="18" height="12" />
    <path d="M20 14h6l4 6v2H20z" />
    <circle cx="9" cy="24" r="2" />
    <circle cx="25" cy="24" r="2" />
    <line x1="11" y1="22" x2="23" y2="22" />
  </svg>
);

const HomePage = () => {
  return (
    <main>
      <SEO
        title="GigLine Safety & Compliance | Safety Walkthroughs & Gap Checks for Small Operations"
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. Based in Kernersville, NC."
        ogTitle="GigLine Safety & Compliance"
        ogDescription="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. Based in Kernersville, NC."
      />

      {/* ── Global reveal animation styles ── */}
      <style>{`
        .reveal-fade { opacity: 0; transform: translateY(16px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .reveal-fade.revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ━━━━━ SECTION 1 — HERO ━━━━━ */}
      <section
        id="hero"
        className="py-20 md:py-28 relative"
        style={{
          backgroundColor: '#0D1B2A',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        data-testid="hero-section"
      >
        <div className="container max-w-4xl text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6" data-testid="hero-headline">
            Safety Issues Don't Announce Themselves.{' '}
            <span className="block mt-2">
              They Show Up as{' '}
              <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Injuries</span>,{' '}
              <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Fines</span>, and{' '}
              <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Downtime</span>.
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-6" data-testid="hero-subline">
            GigLine Safety & Compliance provides focused walkthroughs for small operations — identifying OSHA exposure before it becomes a problem.
          </p>

          {/* Positioning Line with gold rules */}
          <div className="flex flex-col items-center mb-10" data-testid="hero-positioning">
            <div className="w-20 h-px bg-[#C9A84C] mb-3" />
            <p className="text-sm md:text-base text-[#C9A84C] font-semibold tracking-wide uppercase py-1">
              One engagement. A written report. No retainer.
            </p>
            <div className="w-20 h-px bg-[#C9A84C] mt-3" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" data-testid="hero-ctas">
            <Link
              to="/safety-check"
              className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-base text-white/60 mb-4" data-testid="hero-trust-bar">
            <span>25+ Years Safety Leadership</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>OSHA 30-Hour Certified</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>U.S. Navy Veteran</span>
          </div>

          {/* Local Trust Cue */}
          <p className="text-base text-white/50" data-testid="hero-local-trust">
            Based in Kernersville, NC — on-site in the Triad, remote nationwide.
          </p>
        </div>
      </section>

      {/* ━━━━━ SAFETY CHECK TEASER (GL-WEB-001) ━━━━━ */}
      <SafetyCheckTeaser />

      {/* ━━━━━ CALL VINCE BAR — First Placement ━━━━━ */}
      <CallVinceBar />

      {/* ━━━━━ SECTION 2 — THE REALITY ━━━━━ */}
      <section id="reality" className="py-16 md:py-24 bg-white" data-testid="reality-section">
        <div className="container max-w-4xl">
          <Reveal>
            <SectionLabel text="THE REALITY" />

            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 leading-tight" data-testid="reality-headline">
              Most Small Operations Are Not Audited Until Something Goes Wrong. By That Point, the Issues Were Already There.
            </h2>

            <p className="text-base text-[#1C2B2B]/60 mb-10">
              The risk is not hidden. It is just not being looked at correctly.
            </p>
          </Reveal>

          {/* Three Violation Blocks with ghost CFR numbers */}
          <Reveal>
            <div className="space-y-6 mb-10">
              {[
                { title: 'Blocked electrical panel', cfr: '29 CFR 1910.303', ghost: '1910.303', lines: ['Serious violation — up to $16,550 per instance.', 'Response time in an emergency depends on panel access. If it is blocked, seconds are lost.'] },
                { title: 'Trip hazards in walkways', cfr: '29 CFR 1910.22', ghost: '1910.22', lines: ['Direct injury exposure — the most common source of recordable incidents in general industry.'] },
                { title: 'Missing or incomplete chemical labels', cfr: '29 CFR 1910.1200', ghost: '1910.1200', lines: ['Compliance failure — every chemical on site requires a label and an accessible SDS.', 'Most operations have gaps they do not know about.'] },
              ].map((block, i) => (
                <div key={i} className="relative border border-[#1C2B2B]/10 rounded p-6 overflow-hidden" data-testid={`violation-block-${i + 1}`}>
                  {/* Ghost CFR number */}
                  <span
                    className="absolute select-none pointer-events-none font-extrabold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '100px',
                      color: 'rgba(201, 168, 76, 0.07)',
                      bottom: '-8px',
                      right: '12px',
                      lineHeight: 1,
                    }}
                    aria-hidden="true"
                  >
                    {block.ghost}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-[#1C2B2B] mb-1">{block.title}</h3>
                    <p className="font-medium mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#C9A84C' }}>{block.cfr}</p>
                    {block.lines.map((line, j) => (
                      <p key={j} className="text-base text-[#1C2B2B]/60 mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <p className="text-base text-[#1C2B2B]/60" data-testid="reality-closing">
            These are not edge cases. They are the most commonly cited violations in small operations. One walkthrough finds them.
          </p>
        </div>
      </section>

      {/* ━━━━━ INSPECTION IMAGE SECTION ━━━━━ */}
      <section className="relative" data-testid="inspection-image-section">
        <div
          className="relative bg-cover bg-no-repeat py-24 md:py-32"
          style={{ backgroundImage: "url('/vince-founder.png')", backgroundPosition: 'center 40%' }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="container relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
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
          <Reveal>
            <SectionLabel text="WHAT WE DO" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 leading-tight" data-testid="services-headline">
              Three Specific Engagements. Each Produces a Written Deliverable.
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '01', title: 'Safety Walkthrough', body1: 'A structured on-site review of common OSHA exposure areas. Walkthroughs run 15 minutes to 3 hours depending on the size and complexity of the operation.', body2: 'You leave with a written report and a clear list of what to address first.', price: 'Starting at $650', cta: 'Request a Walkthrough', testid: 'service-card-walkthrough' },
                { num: '02', title: 'Documentation Review', body1: 'Basic compliance checks on required programs and records. Most operations have gaps they do not know about until an inspector asks for them.', body2: 'Remote or on-site. You get a red, yellow, and green gap score with a clear missing-items list.', price: 'Starting at $550 remote', cta: 'Request a Review', testid: 'service-card-documentation' },
                { num: '03', title: 'Incident Response Support', body1: 'Post-incident review and corrective direction. Documents management\'s response for OSHA, insurance, or internal records.', body2: 'When something goes wrong, the response needs to be fast and documented correctly.', price: 'Starting at $900', cta: 'Contact About an Incident', testid: 'service-card-incident' },
              ].map((card) => (
                <div
                  key={card.num}
                  className="bg-white border border-[#1C2B2B]/10 rounded-r p-6 flex flex-col"
                  style={{ borderLeft: '3px solid #C9A84C', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  data-testid={card.testid}
                >
                  <p className="font-extrabold leading-none text-[#C9A84C]" style={{ fontSize: '120px', marginBottom: '-16px' }}>{card.num}</p>
                  <p className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-3">OFFER {card.num}</p>
                  <h3 className="text-xl font-bold text-[#1C2B2B] mb-3">{card.title}</h3>
                  <p className="text-base text-[#1C2B2B]/60 mb-3 flex-grow">{card.body1}</p>
                  <p className="text-base text-[#1C2B2B]/60 mb-4">{card.body2}</p>
                  <p className="text-lg font-bold text-[#1C2B2B] mb-4">{card.price}</p>
                  <a
                    href="#contact"
                    className="bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white text-base font-semibold px-6 py-3 rounded transition-colors text-center"
                    data-testid={`service-cta-${card.testid.split('-').pop()}`}
                  >
                    {card.cta}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━ CALL VINCE BAR — Second Placement ━━━━━ */}
      <CallVinceBar />

      {/* ━━━━━ SECTION 4 — WHAT YOU GET ━━━━━ */}
      <section id="deliverables" className="py-16 md:py-24 bg-white" data-testid="deliverables-section">
        <div className="container max-w-4xl">
          <Reveal>
            <SectionLabel text="WHAT YOU GET" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8" data-testid="deliverables-headline">
              Every Engagement Produces a Written Report.
            </h2>
          </Reveal>

          {/* Numbered sequence */}
          <Reveal>
            <div className="mb-12">
              {[
                'Focused walkthrough \u2014 15 minutes to 3 hours depending on operation size',
                'Photo-documented findings',
                'CFR-referenced observations',
                'Clear corrective actions in plain language',
                'Written report delivered within 24\u201348 hours',
              ].map((item, index) => (
                <div key={index} data-testid={`deliverable-${index}`}>
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 mt-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C9A84C', fontWeight: 500 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[#1C2B2B]/70 text-base">{item}</p>
                  </div>
                  {index < 4 && (
                    <div className="ml-[7px] w-px h-4" style={{ backgroundColor: 'rgba(201, 168, 76, 0.2)' }} />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pull quote — display type */}
          <Reveal>
            <div className="text-center my-12 md:my-16" data-testid="deliverables-callout">
              <div className="w-[120px] h-px mx-auto mb-6" style={{ backgroundColor: '#C9A84C' }} />
              <p className="text-[28px] md:text-[40px] font-bold text-[#C9A84C] leading-tight max-w-2xl mx-auto">
                This is not a full audit. It is a signal.
              </p>
              <div className="w-[120px] h-px mx-auto mt-6" style={{ backgroundColor: '#C9A84C' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━ SECTION 5 — WHO WE WORK WITH ━━━━━ */}
      <section id="who-we-serve" className="py-16 md:py-24" style={{ backgroundColor: '#1A2A2A' }} data-testid="who-we-serve-section">
        <div className="container max-w-5xl">
          <Reveal>
            <SectionLabel text="WHO WE WORK WITH" light />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight" data-testid="who-we-serve-headline">
              Small Operations Where the Owner Is Also the Safety Manager.
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4">
              {[
                { Icon: GearIcon, title: 'Small Manufacturers & Fabrication Shops', desc: 'Machine guarding, LOTO, HazCom, and training documentation.', testid: 'segment-manufacturers' },
                { Icon: WarehouseIcon, title: 'Warehouses & Distribution Centers', desc: 'Forklift safety, racking, dock operations, and pedestrian separation.', testid: 'segment-warehouses' },
                { Icon: HardHatIcon, title: 'Contractors & Maintenance Operations', desc: 'Jobsite safety, PPE, fall protection basics, and documentation gaps.', testid: 'segment-contractors' },
                { Icon: TruckIcon, title: 'Trucking Fleets — 5 to 25 Trucks', desc: 'Driver files, drug and alcohol programs, vehicle maintenance records, and FMCSA gaps.', testid: 'segment-trucking' },
              ].map((seg, i) => (
                <div
                  key={i}
                  className={`p-6 ${i < 3 ? 'md:border-r border-b md:border-b-0' : 'border-b-0'}`}
                  style={{ borderColor: '#2A3A3A' }}
                  data-testid={seg.testid}
                >
                  <div className="mb-4"><seg.Icon /></div>
                  <h3 className="text-lg font-bold text-white mb-2">{seg.title}</h3>
                  <p className="text-base text-white/70">{seg.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━ SECTION 6 — ABOUT ━━━━━ */}
      <section id="about" className="py-16 md:py-24" style={{ backgroundColor: '#0D1B2A' }} data-testid="about-section">
        <div className="container max-w-4xl">
          {/* Founder line as section header */}
          <Reveal>
            <div className="text-center mb-12">
              <span
                className="uppercase tracking-[3px] block mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#C9A84C' }}
              >
                ABOUT
              </span>
              <p className="text-[22px] md:text-[32px] font-bold italic text-white max-w-[760px] mx-auto mb-6" data-testid="about-founder-quote">
                I find what is exposed. I tell you exactly what to fix. You keep the liability off the floor.
              </p>
              <div className="w-20 h-px mx-auto" style={{ backgroundColor: '#C9A84C' }} />
            </div>
          </Reveal>

          <Reveal>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Photo */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src="/vince-inspecting.png"
                  alt="Vince Lawrence — Founder, GigLine Safety & Compliance, OSHA certified safety consultant, Kernersville NC"
                  className="w-full rounded"
                  data-testid="about-headshot"
                />
              </div>

              {/* Bio */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-1" data-testid="about-name">Vince Lawrence</h3>
                <p className="text-base text-white/50 mb-6">
                  Safety Coordinator &nbsp;&middot;&nbsp; OSHA 30-Hour &nbsp;&middot;&nbsp; U.S. Navy Veteran
                </p>

                <div className="space-y-4 text-white/75 text-base mb-8">
                  <p>I have spent 25 years working in environments where safety was not theoretical — it was operational.</p>
                  <p>Manufacturing floors. Compliance systems. Real operations with real consequences when something was missed.</p>
                  <p>GigLine was built to give small operations a clear, straightforward way to understand their risk without needing a full consulting firm.</p>
                  <p>One visit. Clear findings. No confusion.</p>
                </div>

                {/* Credential pills */}
                <div className="flex flex-wrap gap-2" data-testid="about-credentials">
                  {[
                    '25+ Years Leadership',
                    'OSHA 30-Hour',
                    'OSHA 10-Hour',
                    'Navy Veteran',
                    'Kernersville, NC',
                    'On-site \u00b7 Remote Nationwide',
                  ].map((cred, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded"
                      style={{
                        backgroundColor: '#1A2A2A',
                        border: '1px solid #3A4A4A',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#B0B8C0',
                      }}
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━ SECTION 7 — FOR TRANSPORTATION OPERATIONS ━━━━━ */}
      <section id="transportation" className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#1C2B2B' }} data-testid="transportation-section">
        {/* Ghost watermark */}
        <span
          className="absolute select-none pointer-events-none font-black"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '200px',
            color: 'rgba(201, 168, 76, 0.05)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          49 CFR
        </span>

        <div className="container max-w-4xl relative z-10">
          <Reveal>
            <SectionLabel text="FOR TRANSPORTATION OPERATIONS" light />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight" data-testid="transportation-headline">
              If You Run Trucks, the Gaps Run Deeper.
            </h2>

            <div className="space-y-4 text-white/75 text-base mb-8">
              <p>Fleet documentation gaps — driver qualification files, drug and alcohol programs, maintenance records — require more than a walkthrough to fix.</p>
              <p>GigLine finds the gaps. LaunchPath installs the system.</p>
              <p>LaunchPath Transportation EDU is a 90-day compliance installation program for new motor carriers built on the same standards GigLine applies on the floor.</p>
              <p>If what a review finds goes deeper than a list of corrections, that is where LaunchPath begins.</p>
            </div>

            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 mb-4"
              data-testid="transportation-cta"
            >
              Start with Ground 0 — Free
              <ExternalLink size={16} />
            </a>

            <p className="text-base text-white/40">
              Ground 0 is free. It tells you whether you need GigLine, LaunchPath, or both.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━ SECTION 8 — FINAL CTA ━━━━━ */}
      <section id="contact" className="py-24 md:py-24" style={{ backgroundColor: '#000000', paddingTop: '96px', paddingBottom: '96px' }} data-testid="final-cta-section">
        <div className="container max-w-4xl text-center">
          <Reveal>
            <SectionLabel text="GET STARTED" />

            <h2 className="text-2xl md:text-3xl leading-tight mb-4" data-testid="final-cta-headline">
              <span className="block font-normal" style={{ color: '#B0B8C0' }}>
                If You Are Not Sure Where Your Exposure Is —
              </span>
              <span className="block font-bold text-white">
                Start With the Safety Check.
              </span>
            </h2>

            <p className="text-base mb-3" style={{ color: '#B0B8C0' }}>
              Six questions. 90 seconds. A clear picture of where your operation stands.
            </p>
            <p className="text-base mb-8" style={{ color: '#B0B8C0' }}>
              Or skip the check and reach out directly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12" data-testid="final-cta-buttons">
              <Link
                to="/safety-check"
                className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-safety-check"
              >
                Run the Safety Check
                <ArrowRight size={18} />
              </Link>
              <a
                href="#contact"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-walkthrough"
              >
                Request a Walkthrough
              </a>
            </div>

            {/* Contact Block */}
            <div data-testid="final-contact-block" className="mt-4 py-8 px-6 rounded inline-block" style={{ fontFamily: "'JetBrains Mono', monospace", backgroundColor: 'rgba(201, 168, 76, 0.06)', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
              <p className="mb-3"><strong className="text-white text-xl">Vince Lawrence</strong></p>
              <p className="mb-3 text-white/60 text-sm">GigLine Safety & Compliance</p>
              <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: '#C9A84C' }} />
              <p className="mb-2">
                <a href="tel:3363298899" className="text-[#C9A84C] hover:text-white transition-colors text-2xl font-bold tracking-wide">
                  (336) 329-8899
                </a>
              </p>
              <p className="mb-2">
                <a href="mailto:vince@giglinecompliance.com" className="text-white hover:text-[#C9A84C] transition-colors text-base font-medium">
                  vince@giglinecompliance.com
                </a>
              </p>
              <p>
                <a href="https://giglinecompliance.com" className="text-white/50 hover:text-[#C9A84C] transition-colors text-sm">
                  giglinecompliance.com
                </a>
              </p>
            </div>

            <div className="mt-8 text-base max-w-lg mx-auto text-white/40" data-testid="final-availability">
              <p>Available for limited on-site days each month in the Triad and surrounding region.</p>
              <p>Remote reviews available nationwide.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
