import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SEO from '../components/SEO';

/* ── Scroll-reveal ── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-fade ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

/* ── Stock images ── */
const IMG = {
  hero: 'https://images.unsplash.com/photo-1772298783095-be38fa901232?w=960&q=80&fit=crop&auto=format',
  grid1: 'https://images.unsplash.com/photo-1768796373634-db43bfd5f064?w=640&q=80&fit=crop&auto=format',
  grid2: 'https://images.unsplash.com/photo-1773952136583-5175e906267c?w=640&q=80&fit=crop&auto=format',
  grid3: 'https://images.unsplash.com/photo-1528953030358-b0c7de371f1f?w=640&q=80&fit=crop&auto=format',
  grid4: 'https://images.unsplash.com/photo-1769442263053-a60acf73f00a?w=640&q=80&fit=crop&auto=format',
  proof: 'https://images.unsplash.com/photo-1644079446600-219068676743?w=1400&q=80&fit=crop&auto=format',
};

/* ── Mono font helper ── */
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const HomePage = () => {
  return (
    <main className="overflow-x-hidden">
      <SEO
        title="Safety Walkthroughs for Small Operations | GigLine Safety & Compliance"
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. No retainer."
        canonical="/"
      />

      <style>{`
        .reveal-fade{opacity:0;transform:translateY(20px);transition:opacity 500ms ease-out,transform 500ms ease-out}
        .reveal-fade.revealed{opacity:1;transform:translateY(0)}
        .img-zoom{transition:transform 6s ease-out}
        .img-zoom:hover{transform:scale(1.04)}
      `}</style>

      {/* ═══════════════════════════════════════════════
          S1 — ASYMMETRIC HERO  (60 image / 40 text)
      ═══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[60vh] md:min-h-[85vh]"
        style={{ backgroundColor: '#0D1B2A' }}
        data-testid="hero-section"
      >
        <div className="flex flex-col md:flex-row h-full min-h-[60vh] md:min-h-[85vh]">
          {/* Left — Photo */}
          <div className="relative w-full md:w-3/5 h-[45vh] md:h-auto overflow-hidden">
            <img
              src={IMG.hero}
              alt="Safety inspection on an active warehouse floor"
              className="absolute inset-0 w-full h-full object-cover img-zoom"
              data-testid="hero-image"
            />
            {/* Gradient bleed into text column */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0D1B2A]" />
            <div className="md:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0D1B2A] to-transparent" />
          </div>

          {/* Right — Copy */}
          <div className="w-full md:w-2/5 flex items-center px-6 md:px-14 lg:px-20 py-12 md:py-0 relative z-10">
            <Reveal>
              <p
                className="uppercase tracking-[3px] text-[#C9A84C] mb-5"
                style={{ ...mono, fontSize: '11px' }}
                data-testid="hero-label"
              >
                GigLine Safety & Compliance
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6"
                data-testid="hero-headline"
              >
                Safety Issues Don't Announce Themselves.{' '}
                <span className="block mt-3">
                  They Show Up as{' '}
                  <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Injuries</span>,{' '}
                  <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Fines</span>, and{' '}
                  <span style={{ borderBottom: '2px solid #C9A84C', paddingBottom: '2px' }}>Downtime</span>.
                </span>
              </h1>

              <p
                className="text-base md:text-lg text-white/60 leading-relaxed mb-6 max-w-md"
                data-testid="hero-sub"
              >
                Safety walkthroughs for small operations — identify exposure before it becomes operational loss.
              </p>

              <p
                className="text-sm text-[#C9A84C] font-semibold tracking-wide uppercase mb-8"
                style={mono}
                data-testid="hero-positioning"
              >
                One engagement. A written report. No retainer.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 mb-4" data-testid="hero-ctas">
                <Link
                  to="/request-walkthrough"
                  className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-8 py-4 rounded text-base transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#C9A84C]/20"
                  data-testid="hero-cta-primary"
                >
                  Request a Walkthrough
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/safety-check"
                  className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-medium px-6 py-4 rounded transition-colors inline-flex items-center gap-2 text-sm"
                  data-testid="hero-cta-secondary"
                >
                  Take the Safety Check
                </Link>
              </div>
              <p className="text-xs text-white/30" style={mono} data-testid="hero-trust-line">
                No contracts. One visit. Written report.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S2 — PROBLEM GRID  (4 real-world hazard images)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" data-testid="problem-grid-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              The Reality
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 leading-tight"
              data-testid="problem-headline"
            >
              What We Actually See on the Floor
            </h2>
            <p className="text-base text-[#1C2B2B]/50 mb-12 max-w-lg">
              These aren't rare edge cases. They're in almost every facility we walk into.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {[
              { img: IMG.grid1, caption: 'Cluttered aisles and obstructed walkways', label: 'Trip & Access Hazards' },
              { img: IMG.grid2, caption: 'Blocked electrical panels with no clearance', label: 'Electrical Exposure' },
              { img: IMG.grid3, caption: 'Missing guards on operating machinery', label: 'Machine Guarding Gaps' },
              { img: IMG.grid4, caption: 'Fire equipment blocked or inaccessible', label: 'Emergency Access' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="group relative overflow-hidden rounded"
                  style={{ aspectRatio: '4/3' }}
                  data-testid={`problem-card-${i}`}
                >
                  <img
                    src={item.img}
                    alt={item.caption}
                    className="w-full h-full object-cover img-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p
                      className="text-[10px] uppercase tracking-[2px] text-[#C9A84C] mb-1"
                      style={mono}
                    >
                      {item.label}
                    </p>
                    <p className="text-sm text-white/80">{item.caption}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S3 — STATEMENT BAND
      ═══════════════════════════════════════════════ */}
      <section
        className="py-20 md:py-32"
        style={{ backgroundColor: '#0D1B2A' }}
        data-testid="statement-section"
      >
        <div className="container max-w-3xl text-center">
          <Reveal>
            <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: '#C9A84C' }} />
            <p
              className="text-2xl sm:text-3xl md:text-[42px] font-bold text-[#C9A84C] leading-tight tracking-tight mb-6"
              data-testid="statement-headline"
            >
              THIS IS NOT A FULL AUDIT.
              <br />
              IT IS A SIGNAL.
            </p>
            <p className="text-base md:text-lg text-white/45 max-w-md mx-auto" data-testid="statement-sub">
              We identify exposure. You decide what to fix.
            </p>
            <div className="w-16 h-px mx-auto mt-10" style={{ backgroundColor: '#C9A84C' }} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S4 — PROCESS  (asymmetric 40/60)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#F9F8F6' }} data-testid="process-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left label — 40% */}
            <div className="md:w-2/5">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  The Process
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#1C2B2B] leading-tight mb-6"
                  data-testid="process-headline"
                >
                  What to Expect
                </h2>
                <p className="text-base text-[#1C2B2B]/50 leading-relaxed">
                  Most walkthroughs for small operations fall between $500–$1,000 depending on size. You'll know your price before we schedule.
                </p>
              </Reveal>
            </div>

            {/* Right steps — 60% */}
            <div className="md:w-3/5">
              <Reveal>
                <div className="space-y-0 border-t border-[#1C2B2B]/10" data-testid="process-steps">
                  {[
                    { num: '01', label: 'Request', desc: 'Tell us about your operation and what concerns you.' },
                    { num: '02', label: 'Schedule', desc: 'We pick a time. Most visits are 60–90 minutes.' },
                    { num: '03', label: 'Walkthrough', desc: 'We walk the floor during normal operations. No shutdown required.' },
                    { num: '04', label: 'Report', desc: 'A short written report with photos in 24–48 hours.' },
                    { num: '05', label: 'Action', desc: 'You decide what to fix now, later, or not at all.' },
                  ].map((step, i) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-5 py-5 border-b border-[#1C2B2B]/10"
                      data-testid={`process-step-${i}`}
                    >
                      <span
                        className="flex-shrink-0 mt-0.5 text-[#C9A84C] font-semibold"
                        style={{ ...mono, fontSize: '13px' }}
                      >
                        {step.num}
                      </span>
                      <div>
                        <p className="text-base font-bold text-[#1C2B2B] mb-0.5">{step.label}</p>
                        <p className="text-sm text-[#1C2B2B]/55">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S5 — DELIVERABLE CHECKLIST  (asymmetric 40/60)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#1C2B2B' }} data-testid="deliverables-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left label — 40% */}
            <div className="md:w-2/5">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  What You Get
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6"
                  data-testid="deliverables-headline"
                >
                  Every Engagement Produces a Written Report.
                </h2>
                <p className="text-base text-white/40 leading-relaxed">
                  No verbal summaries. No promises. A documented walkthrough with findings, photos, and corrective actions.
                </p>
              </Reveal>
            </div>

            {/* Right checklist — 60% */}
            <div className="md:w-3/5 flex items-center">
              <Reveal>
                <div className="space-y-5" data-testid="deliverables-list">
                  {[
                    'On-site walkthrough — 30 to 90 minutes',
                    'Photo-documented findings',
                    'Risk-referenced observations',
                    'Clear corrective actions with priorities',
                    'Written report delivered within 24–48 hours',
                    'No retainer, no recurring fee',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4" data-testid={`deliverable-${i}`}>
                      <Check size={18} className="flex-shrink-0 mt-0.5 text-[#C9A84C]" strokeWidth={2.5} />
                      <p className="text-base text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S6 — WHY NOT OSHA  (2-column comparison)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" data-testid="comparison-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left intro — 40% */}
            <div className="md:w-2/5">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  The Difference
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#1C2B2B] leading-tight mb-4"
                  data-testid="comparison-headline"
                >
                  Why Not Just Use OSHA Consultation?
                </h2>
                <p className="text-base text-[#1C2B2B]/50 leading-relaxed">
                  OSHA On-Site Consultation is a real program. It's free and it's useful. But it has limits.
                </p>
              </Reveal>
            </div>

            {/* Right comparison — 60% */}
            <div className="md:w-3/5">
              <Reveal>
                <div className="grid grid-cols-2 gap-8 md:gap-12" data-testid="comparison-grid">
                  {/* OSHA column */}
                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest text-[#1C2B2B]/30 uppercase mb-5"
                      style={mono}
                    >
                      OSHA Consultation
                    </p>
                    <div className="space-y-4">
                      {[
                        'General guidance',
                        'Not based on real-time conditions',
                        'Not focused on execution',
                        'Weeks-long wait times',
                      ].map((item, i) => (
                        <p
                          key={i}
                          className="text-sm text-[#1C2B2B]/35 line-through decoration-[#1C2B2B]/15"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* GigLine column */}
                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-5"
                      style={mono}
                    >
                      GigLine
                    </p>
                    <div className="space-y-4">
                      {[
                        'Walks your floor',
                        'Sees real conditions',
                        'Gives clear priorities',
                        'Scheduled within days',
                      ].map((item, i) => (
                        <p key={i} className="text-sm text-[#1C2B2B]/80 font-semibold">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S7 — FULL-WIDTH PROOF IMAGE
      ═══════════════════════════════════════════════ */}
      <section className="relative" data-testid="proof-section">
        <div className="relative overflow-hidden" style={{ height: 'clamp(280px, 45vw, 520px)' }}>
          <img
            src={IMG.proof}
            alt="Warehouse interior during operations"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <Reveal className="text-center max-w-2xl">
              <p
                className="text-xl sm:text-2xl md:text-3xl text-white font-bold leading-snug mb-3"
                data-testid="proof-headline"
              >
                Most issues aren't hidden.
                <br />
                They're overlooked.
              </p>
              <p className="text-sm text-white/40" style={mono}>
                Every facility has blind spots. We walk in and find them.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S8 — FOUNDER  (asymmetric 35/65)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#0D1B2A' }} data-testid="founder-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Left — Photo (35%) */}
            <div className="w-full md:w-[35%] flex-shrink-0">
              <Reveal>
                <img
                  src="/vince-portrait.png"
                  alt="Vince Lawrence — Founder, GigLine Safety & Compliance"
                  className="w-full rounded"
                  data-testid="founder-photo"
                />
              </Reveal>
            </div>

            {/* Right — Bio (65%) */}
            <div className="flex-grow">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  About
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3"
                  data-testid="founder-headline"
                >
                  Built by someone who's worked the floor.
                </h2>

                {/* Credential pills — inline */}
                <div className="flex flex-wrap gap-2 mb-8" data-testid="founder-pills">
                  {['Navy Veteran', 'Safety Coordinator'].map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center px-3 py-1 rounded text-[#C9A84C] border border-[#C9A84C]/30"
                      style={{ ...mono, fontSize: '11px' }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-base text-white/65 leading-relaxed">
                    I've spent 25 years working in environments where safety was not theoretical — it was operational. Manufacturing floors. Compliance systems. Real operations with real consequences when something was missed.
                  </p>
                  <p className="text-base text-white/65 leading-relaxed">
                    GigLine was built to give small operations a clear, straightforward way to understand their risk without needing a full consulting firm.
                  </p>
                  <p className="text-base text-white/80 leading-relaxed font-medium">
                    One visit. Clear findings. No confusion.
                  </p>
                </div>

                {/* Secondary credential tags */}
                <div className="flex flex-wrap gap-2" data-testid="founder-credentials">
                  {[
                    '25+ Years Leadership',
                    'OSHA 30-Hour',
                    'OSHA 10-Hour',
                    'Kernersville, NC',
                    'On-site & Remote Nationwide',
                  ].map((cred, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        ...mono,
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S9 — FINAL CTA BAND
      ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#000000' }} data-testid="final-cta-section">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl leading-tight mb-8" data-testid="final-cta-headline">
              <span className="block text-white/45 font-normal mb-2">
                If you're not sure what's exposed —
              </span>
              <span className="block font-bold text-white">
                start with a walkthrough.
              </span>
            </h2>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
              data-testid="final-cta-buttons"
            >
              <Link
                to="/request-walkthrough"
                className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#C9A84C]/20"
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
            <div className="w-px h-10 mx-auto mb-8" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }} />
            <p className="text-white font-bold text-lg mb-1">Vince Lawrence</p>
            <p className="text-white/40 text-sm mb-4" style={mono}>
              GigLine Safety & Compliance
            </p>
            <p className="mb-2">
              <a
                href="tel:3363298899"
                className="text-[#C9A84C] hover:text-white transition-colors text-2xl font-bold tracking-wide"
                data-testid="final-phone"
              >
                (336) 329-8899
              </a>
            </p>
            <p>
              <a
                href="mailto:vince@giglinecompliance.com"
                className="text-white/50 hover:text-[#C9A84C] transition-colors text-sm"
                data-testid="final-email"
              >
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
