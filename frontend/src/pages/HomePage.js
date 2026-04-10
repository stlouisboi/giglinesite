import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

/* ── Scroll-reveal ── */
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

const HomePage = () => {
  return (
    <main>
      <SEO
        title="Safety Walkthroughs for Small Operations | GigLine Safety & Compliance"
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. No retainer."
        canonical="/"
      />

      <style>{`
        .reveal-fade { opacity: 0; transform: translateY(16px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .reveal-fade.revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO — Real-world problem, simple explanation
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-36 relative"
        style={{
          backgroundColor: '#0D1B2A',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
        data-testid="hero-section"
      >
        <div className="container max-w-4xl relative z-10">
          <Reveal>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8"
              data-testid="hero-headline"
            >
              Safety Issues Don't Announce Themselves.{' '}
              <span className="block mt-2">
                They Show Up as{' '}
                <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Injuries</span>,{' '}
                <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Fines</span>, and{' '}
                <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Downtime</span>.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-6 leading-relaxed" data-testid="hero-sub">
              Safety walkthroughs for small operations — identify exposure before it becomes operational loss.
            </p>

            <p
              className="text-sm text-[#C9A84C] font-semibold tracking-wide uppercase mb-12"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              data-testid="hero-positioning"
            >
              One engagement. A written report. No retainer.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-5" data-testid="hero-ctas">
              <Link
                to="/request-walkthrough"
                className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-10 py-5 rounded text-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#C9A84C]/20"
                data-testid="hero-cta-primary"
              >
                Request a Walkthrough
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/safety-check"
                className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white font-medium px-8 py-4 rounded transition-colors inline-flex items-center gap-2 text-sm"
                data-testid="hero-cta-secondary"
              >
                Take the Safety Check
              </Link>
            </div>
            <p className="text-sm text-white/40" data-testid="hero-trust-line">
              No contracts. One visit. Written report.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. REALITY / PROBLEM — What we actually see
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28 bg-white" data-testid="reality-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              The Reality
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8 leading-tight" data-testid="reality-headline">
              What We Actually See on the Floor
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-5 mb-8">
              {[
                'Blocked electrical panels with no clearance',
                'Trip hazards across active walkways',
                'Missing guards on operating machinery',
                'Exit routes partially obstructed',
                'Chemicals without labels or accessible SDS',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4" data-testid={`reality-item-${i}`}>
                  <span
                    className="mt-1 flex-shrink-0"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#C9A84C' }}
                  >
                    //
                  </span>
                  <p className="text-base md:text-lg text-[#1C2B2B]/70">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="text-base text-[#1C2B2B]/50 font-medium">
              These aren't rare. They're in almost every facility we walk into.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SIGNAL — The brand statement. Full stop.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#0D1B2A' }} data-testid="signal-section">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: '#C9A84C' }} />

            <p
              className="text-2xl sm:text-3xl md:text-[44px] font-bold text-[#C9A84C] leading-tight tracking-tight mb-8"
              data-testid="signal-headline"
            >
              THIS IS NOT A FULL AUDIT.<br />
              IT IS A SIGNAL.
            </p>

            <p className="text-base md:text-lg text-white/50 max-w-md mx-auto" data-testid="signal-sub">
              We identify exposure. You decide what to fix.
            </p>

            <div className="w-16 h-px mx-auto mt-10" style={{ backgroundColor: '#C9A84C' }} />
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. SOLUTION / SERVICES — Three ways to fix it
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28 bg-white" data-testid="solution-section">
        <div className="container max-w-4xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              What We Do
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-14 leading-tight" data-testid="solution-headline">
              Three Ways to Fix What's Exposed
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-0 border-t border-[#1C2B2B]/10" data-testid="solution-list">
              {[
                {
                  num: '01',
                  lead: 'Walk the floor. Find the gaps.',
                  name: 'Safety Walkthrough',
                  line: 'On-site. Photo-documented. Written report within 48 hours.',
                },
                {
                  num: '02',
                  lead: "Review the system. Find what's missing.",
                  name: 'Documentation Review',
                  line: 'Remote or on-site. Red / yellow / green gap score.',
                },
                {
                  num: '03',
                  lead: 'Investigate the incident. Prevent it from repeating.',
                  name: 'Incident Response',
                  line: 'Post-incident review. Documented for OSHA, insurance, internal records.',
                },
              ].map((svc) => (
                <div
                  key={svc.num}
                  className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 py-8 border-b border-[#1C2B2B]/10"
                  data-testid={`solution-card-${svc.num}`}
                >
                  <span
                    className="text-[#C9A84C] font-bold flex-shrink-0"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', minWidth: '32px' }}
                  >
                    {svc.num}
                  </span>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-[#1C2B2B] mb-1">{svc.lead}</p>
                    <p
                      className="text-xs uppercase tracking-[2px] text-[#C9A84C] mb-2"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {svc.name}
                    </p>
                    <p className="text-base text-[#1C2B2B]/60">{svc.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <Link
                to="/services"
                className="text-sm text-[#C9A84C] hover:text-[#1C2B2B] transition-colors inline-flex items-center gap-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                data-testid="solution-link"
              >
                View pricing and details <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4B. WHAT TO EXPECT — The process
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#F9F8F6' }} data-testid="expect-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              The Process
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 leading-tight" data-testid="expect-headline">
              What to Expect
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-0" data-testid="expect-steps">
              {[
                { num: '01', label: 'Request', line: 'Tell me about your shop.' },
                { num: '02', label: 'Schedule', line: "We pick a time. Most visits are 60\u201390 minutes." },
                { num: '03', label: 'Walkthrough', line: 'We walk the floor during normal operations.' },
                { num: '04', label: 'Report', line: 'You get a short written report with photos in 24\u201348 hours.' },
                { num: '05', label: 'Action', line: 'You decide what to fix now, later, or not at all.' },
              ].map((step, i) => (
                <div key={step.num} className="flex items-start gap-6 py-5 border-b border-[#1C2B2B]/10" data-testid={`expect-step-${i}`}>
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#C9A84C', fontWeight: 600 }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <p className="text-base font-bold text-[#1C2B2B] mb-1">{step.label}</p>
                    <p className="text-base text-[#1C2B2B]/60">{step.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="mt-8 text-sm text-[#1C2B2B]/40">
              Most walkthroughs for small operations fall between $500\u2013$1,000 depending on size. You'll know your price before we schedule.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. DELIVERABLES — What you actually get
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#1C2B2B' }} data-testid="deliverables-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              What You Get
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight" data-testid="deliverables-headline">
              Every Engagement Produces a Written Report.
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-0">
              {[
                'On-site walkthrough — 30 to 90 minutes',
                'Photo-documented findings',
                'Risk-referenced observations',
                'Clear corrective actions',
                'Written report delivered within 24–48 hours',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 py-4 border-b border-white/[0.08]" data-testid={`deliverable-${i}`}>
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#C9A84C' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. OBJECTION HANDLING — Why not OSHA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28 bg-white" data-testid="objection-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              The Difference
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 leading-tight" data-testid="objection-headline">
              Why Not Just Use OSHA Consultants?
            </h2>
            <p className="text-base text-[#1C2B2B]/50 mb-10">
              OSHA On-Site Consultation is a real program. It's free and it's useful. But it has limits.
            </p>
          </Reveal>

          <Reveal>
            <div className="space-y-6">
              {[
                { them: 'General, compliance-focused guidance', us: 'Operational, site-specific findings' },
                { them: 'May not document real-time conditions', us: 'Every observation is photo-documented' },
                { them: 'Covers regulations, not your specific risks', us: 'Built around your floor, your crew, your exposure' },
                { them: 'No enforcement — but no execution either', us: 'Clear priorities you can act on the same week' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 py-4 border-b border-[#1C2B2B]/10" data-testid={`objection-row-${i}`}>
                  <p className="text-base text-[#1C2B2B]/40 line-through decoration-[#1C2B2B]/20">{row.them}</p>
                  <p className="text-base text-[#1C2B2B]/80 font-medium">{row.us}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. PROOF / VISUAL — Real environment
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative" data-testid="proof-section">
        <div
          className="relative bg-cover bg-no-repeat py-28 md:py-40"
          style={{ backgroundImage: "url('/vince-inspecting.png')", backgroundPosition: 'center 35%' }}
        >
          <div className="absolute inset-0 bg-black/75" />
          <div className="container relative z-10 max-w-3xl text-center">
            <Reveal>
              <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed" data-testid="proof-caption">
                Most issues aren't hidden. They're overlooked.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          8. FOUNDER — Built by someone who's worked the floor
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#0D1B2A' }} data-testid="founder-section">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src="/vince-portrait.png"
                  alt="Vince Lawrence — Founder, GigLine Safety & Compliance"
                  className="w-full rounded"
                  data-testid="founder-photo"
                />
              </div>
              <div className="flex-grow">
                <p
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                >
                  About
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight" data-testid="founder-headline">
                  Built by someone who's worked the floor.
                </h2>
                <p className="text-base text-[#C9A84C] mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
                  Navy veteran and shop-floor safety specialist
                </p>
                <p className="text-base text-white/70 leading-relaxed mb-4">
                  I have spent 25 years working in environments where safety was not theoretical — it was operational.
                </p>
                <p className="text-base text-white/70 leading-relaxed mb-4">
                  Manufacturing floors. Compliance systems. Real operations with real consequences when something was missed.
                </p>
                <p className="text-base text-white/70 leading-relaxed mb-4">
                  GigLine was built to give small operations a clear, straightforward way to understand their risk without needing a full consulting firm.
                </p>
                <p className="text-base text-white/70 leading-relaxed mb-6 font-medium">
                  One visit. Clear findings. No confusion.
                </p>
                <div className="flex flex-wrap gap-2" data-testid="founder-credentials">
                  {['25+ Years Leadership', 'OSHA 30-Hour', 'OSHA 10-Hour', 'Safety Coordinator', 'Navy Veteran', 'Kernersville, NC', 'On-site \u00b7 Remote Nationwide'].map((cred, i) => (
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. FINAL CTA — Start with a walkthrough
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#000000' }} data-testid="final-cta-section">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl leading-tight mb-8" data-testid="final-cta-headline">
              <span className="block text-white/50 font-normal mb-2">
                If you're not sure what's exposed —
              </span>
              <span className="block font-bold text-white">
                start with a walkthrough.
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14" data-testid="final-cta-buttons">
              <Link
                to="/request-walkthrough"
                className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-walkthrough"
              >
                Request a Walkthrough
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/safety-check"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-safety-check"
              >
                Take the Safety Check
              </Link>
            </div>

            {/* Contact block */}
            <div className="w-px h-10 mx-auto mb-8" style={{ backgroundColor: 'rgba(201, 168, 76, 0.2)' }} />
            <p className="text-white font-bold text-lg mb-1">Vince Lawrence</p>
            <p className="text-white/40 text-sm mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>GigLine Safety &amp; Compliance</p>
            <p className="mb-2">
              <a href="tel:3363298899" className="text-[#C9A84C] hover:text-white transition-colors text-2xl font-bold tracking-wide" data-testid="final-phone">
                (336) 329-8899
              </a>
            </p>
            <p>
              <a href="mailto:vince@giglinecompliance.com" className="text-white/50 hover:text-[#C9A84C] transition-colors text-sm" data-testid="final-email">
                vince@giglinecompliance.com
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
