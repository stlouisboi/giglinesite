import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Shield, FileText, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

/* ── Scroll-reveal hook ── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); io.unobserve(el); } },
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

/* ── Section label ── */
const Label = ({ text }) => (
  <p className="font-mono text-xs tracking-[3px] uppercase text-[#C9A84C] mb-5">{text}</p>
);

/* ── Thin gold rule ── */
const Rule = ({ width = 'w-16', className = '' }) => (
  <div className={`${width} h-px bg-[#C9A84C]/40 ${className}`} />
);

/* ── Stock photos for Field Reality ── */
const FIELD_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1566417108845-5ba9c2f9ea1b?auto=format&fit=crop&w=600&q=80', alt: 'Electrical panel with high voltage warning — common OSHA violation in small operations' },
  { src: 'https://images.unsplash.com/photo-1772299121503-cd62a57e3a26?auto=format&fit=crop&w=600&q=80', alt: 'Workers inspecting warehouse floor walkway — trip hazard assessment' },
  { src: 'https://images.unsplash.com/photo-1709293958490-1cc2f9bf0e42?auto=format&fit=crop&w=600&q=80', alt: 'Chemical storage containers on shelves — missing labels compliance check' },
  { src: 'https://images.unsplash.com/photo-1720036236855-9a1a2e4d3f26?auto=format&fit=crop&w=600&q=80', alt: 'Manufacturing floor with heavy machinery — exit route and safety equipment inspection' },
];

const HomePage = () => {
  return (
    <main>
      <SEO
        title="Safety Walkthroughs & Gap Checks for Small Operations"
        description="Safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, fleets, and contractors. One engagement. A written report. Based in Kernersville, NC."
        canonical="/"
      />

      <style>{`
        .reveal-fade { opacity: 0; transform: translateY(20px); transition: opacity 500ms ease-out, transform 500ms ease-out; }
        .reveal-fade.revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ━━━ 1. HERO ━━━ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ backgroundColor: '#0D1B2A' }} data-testid="hero-section">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Label text="GigLine Safety & Compliance" />

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="hero-headline">
            Safety Issues Don't<br className="hidden md:block" /> Announce Themselves.{' '}
            <span className="block mt-2">
              They Show Up as{' '}
              <span className="text-[#C9A84C]">Injuries</span>,{' '}
              <span className="text-[#C9A84C]">Fines</span>, and{' '}
              <span className="text-[#C9A84C]">Downtime</span>.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-6 leading-relaxed" data-testid="hero-sub">
            Safety walkthroughs for small operations — identify exposure before it becomes operational loss.
          </p>

          <Rule className="mb-4" />
          <p className="font-mono text-sm text-[#C9A84C] tracking-wide uppercase mb-10" data-testid="hero-positioning">
            One engagement. A written report. No retainer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4" data-testid="hero-ctas">
            <Link
              to="/request-walkthrough"
              className="bg-[#C9A84C] text-[#0D1B2A] font-mono font-bold uppercase tracking-wider text-sm px-8 py-4 hover:bg-[#B8972C] transition-colors inline-flex items-center gap-2"
              data-testid="hero-cta-primary"
            >
              Request a Walkthrough
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/safety-check"
              className="border border-white/25 text-white font-mono font-medium uppercase tracking-wider text-sm px-8 py-4 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              data-testid="hero-cta-secondary"
            >
              Run the Safety Check
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 2. TRUST STRIP ━━━ */}
      <section className="py-5 border-y border-white/10" style={{ backgroundColor: '#1C2B2B' }} data-testid="trust-strip">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-xs md:text-sm tracking-wide text-white/50">
            Trusted for practical, floor-level walkthroughs that translate compliance into real operational action.
          </p>
        </div>
      </section>

      {/* ━━━ 3. FIELD REALITY ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#F8F9FA' }} data-testid="field-reality-section">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <Label text="The Reality" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0D1B2A] leading-tight mb-4" data-testid="field-reality-headline">
              What We Actually See on the Floor
            </h2>
          </Reveal>

          <Reveal>
            <ul className="space-y-3 text-lg text-[#0D1B2A]/70 mb-6 max-w-xl">
              {[
                'Blocked electrical panels',
                'Trip hazards in active walkways',
                'Missing chemical labels',
                'Exit routes partially obstructed',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3" data-testid={`field-item-${i}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p className="text-base text-[#0D1B2A]/50 font-medium mb-12">
              These aren't rare. They're overlooked.
            </p>
          </Reveal>

          {/* Photo grid */}
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" data-testid="field-reality-grid">
              {FIELD_IMAGES.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded bg-[#0D1B2A]/5">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    data-testid={`field-photo-${i}`}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 4. HUMAN LAYER (Photo + Video) ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#0D1B2A' }} data-testid="human-layer-section">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <Label text="On the Floor" />
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — Vince photo */}
            <Reveal>
              <div className="overflow-hidden rounded" data-testid="vince-photo-container">
                <img
                  src="/vince-inspecting.png"
                  alt="Vince Lawrence conducting a safety walkthrough on a shop floor"
                  className="w-full h-auto object-cover"
                  data-testid="vince-photo"
                />
              </div>
            </Reveal>

            {/* Right — Video placeholder + text */}
            <Reveal delay={150}>
              <div>
                {/* Video placeholder */}
                <div
                  className="aspect-video bg-[#1C2B2B] rounded border border-white/10 flex items-center justify-center mb-8 cursor-pointer group relative overflow-hidden"
                  data-testid="video-placeholder"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 group-hover:bg-[#C9A84C]/30 transition-colors flex items-center justify-center">
                    <Play size={28} className="text-[#C9A84C] ml-1" fill="currentColor" />
                  </div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/30 font-mono">
                    Video coming soon
                  </p>
                </div>

                <p className="text-lg text-white/80 leading-relaxed mb-4">
                  Real operations. Real conditions. Most issues aren't complicated — they're overlooked.
                </p>
                <Rule />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━ 5. WHY PRIVATE VS OSHA ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#F8F9FA' }} data-testid="why-private-section">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Label text="The Difference" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0D1B2A] leading-tight mb-10" data-testid="why-private-headline">
              Why not just use OSHA consultation services?
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-0 border-t border-[#0D1B2A]/10" data-testid="comparison-list">
              {[
                { point: 'Helpful, but general and compliance-focused', icon: AlertTriangle },
                { point: 'GigLine is operational and site-specific', icon: Shield },
                { point: 'We document real conditions in real time', icon: FileText },
                { point: 'No regulatory enforcement layer', icon: Shield },
                { point: 'Focused on corrective clarity, not paperwork', icon: FileText },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-5 border-b border-[#0D1B2A]/10" data-testid={`comparison-item-${i}`}>
                  <item.icon size={18} className={i === 0 ? 'text-[#0D1B2A]/30' : 'text-[#C9A84C]'} />
                  <p className={`text-base md:text-lg ${i === 0 ? 'text-[#0D1B2A]/40' : 'text-[#0D1B2A]/80 font-medium'}`}>
                    {item.point}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 6. WHAT WE DO ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#1C2B2B' }} data-testid="services-section">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <Label text="What We Do" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-12" data-testid="services-headline">
              Three Engagements. Each Produces a Written Deliverable.
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-3 gap-6" data-testid="services-grid">
              {[
                { title: 'Safety Walkthroughs', line: 'On-site review of common OSHA exposure areas. Written report with corrective actions.' },
                { title: 'Documentation Reviews', line: 'Gap check on required programs and records. Red, yellow, green scoring.' },
                { title: 'Incident Response', line: 'Post-incident review and corrective direction. Documented for OSHA and insurance.' },
              ].map((svc, i) => (
                <div key={i} className="border-t-2 border-[#C9A84C] pt-6" data-testid={`service-card-${i}`}>
                  <p className="font-mono text-xs tracking-widest text-[#C9A84C] uppercase mb-3">0{i + 1}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                  <p className="text-base text-white/60 leading-relaxed">{svc.line}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <Link
                to="/services"
                className="font-mono text-sm text-[#C9A84C] hover:text-white transition-colors inline-flex items-center gap-2 tracking-wide uppercase"
                data-testid="services-link"
              >
                View Full Service Details <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 7. WHAT YOU GET ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#0D1B2A' }} data-testid="deliverables-section">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Label text="What You Get" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-10" data-testid="deliverables-headline">
              Every Engagement Produces a Written Report.
            </h2>
          </Reveal>

          <Reveal>
            <div className="space-y-0" data-testid="deliverables-list">
              {[
                'On-site walkthrough (15-45 minutes)',
                'Photo-documented findings',
                'CFR-referenced observations',
                'Clear corrective actions',
                'Written report within 24-48 hours',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 py-4 border-b border-white/[0.06]" data-testid={`deliverable-${i}`}>
                  <span className="font-mono text-sm text-[#C9A84C] mt-0.5 flex-shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base md:text-lg text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pull quote */}
          <Reveal>
            <div className="mt-16 text-center" data-testid="deliverables-callout">
              <Rule width="w-20" className="mx-auto mb-6" />
              <p className="font-serif text-2xl md:text-4xl font-bold text-[#C9A84C] leading-tight italic max-w-lg mx-auto">
                This is not a full audit. It is a signal.
              </p>
              <Rule width="w-20" className="mx-auto mt-6" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 8. WHO WE WORK WITH ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#F8F9FA' }} data-testid="who-section">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <Label text="Who We Work With" />
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="who-grid">
              {[
                'Small manufacturers',
                'Warehouses',
                'Contractors',
                'Fleet operations',
              ].map((type, i) => (
                <div key={i} className="py-6 text-center" data-testid={`who-item-${i}`}>
                  <p className="text-lg font-bold text-[#0D1B2A]">{type}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 9. TESTIMONIAL ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#1C2B2B' }} data-testid="testimonial-section">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="font-serif text-6xl text-[#C9A84C]/30 leading-none block mb-4">"</span>
            <blockquote className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed italic mb-6" data-testid="testimonial-quote">
              They operate at a different level than most safety consultants... provide solutions that can be executed on the floor.
            </blockquote>
            <Rule width="w-12" className="mx-auto mb-4" />
            <p className="font-mono text-xs tracking-widest uppercase text-white/40" data-testid="testimonial-attribution">
              — Operations Client
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━ 10. ABOUT ━━━ */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#F8F9FA' }} data-testid="about-section">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Label text="About" />
          </Reveal>

          <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
            <Reveal>
              <img
                src="/vince-portrait.png"
                alt="Vince Lawrence, Founder — GigLine Safety & Compliance"
                className="w-full rounded"
                data-testid="about-photo"
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                <h3 className="text-2xl font-bold text-[#0D1B2A] mb-1">Vince Lawrence</h3>
                <p className="font-mono text-xs tracking-widest text-[#C9A84C] uppercase mb-6">
                  Safety Consultant &middot; OSHA 30-Hour &middot; U.S. Navy Veteran
                </p>
                <p className="text-base text-[#0D1B2A]/70 leading-relaxed mb-4">
                  I've spent years in real operations where safety had to function on the floor — not just on paper.
                </p>
                <p className="text-base text-[#0D1B2A]/70 leading-relaxed font-medium">
                  One visit. Clear findings. No confusion.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━ 11. FINAL CTA ━━━ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#0D1B2A' }} data-testid="final-cta-section">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-lg md:text-xl text-white/60 mb-4" data-testid="final-cta-line">
              If you're not sure where your exposure is — start with a walkthrough.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12" data-testid="final-cta-buttons">
              <Link
                to="/request-walkthrough"
                className="bg-[#C9A84C] text-[#0D1B2A] font-mono font-bold uppercase tracking-wider text-sm px-8 py-4 hover:bg-[#B8972C] transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-walkthrough"
              >
                Request a Walkthrough
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/safety-check"
                className="border border-white/25 text-white font-mono font-medium uppercase tracking-wider text-sm px-8 py-4 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                data-testid="final-cta-safety-check"
              >
                Run the Safety Check
              </Link>
            </div>

            {/* Contact block */}
            <div className="inline-block py-6 px-8 rounded border border-[#C9A84C]/15 bg-[#C9A84C]/[0.04]" data-testid="final-contact-block">
              <p className="text-white font-bold text-lg mb-1">Vince Lawrence</p>
              <p className="text-white/50 text-sm mb-3 font-mono">GigLine Safety & Compliance</p>
              <Rule width="w-10" className="mx-auto mb-3" />
              <p className="mb-1">
                <a href="tel:3363298899" className="text-[#C9A84C] hover:text-white transition-colors text-xl font-bold tracking-wide">
                  (336) 329-8899
                </a>
              </p>
              <p>
                <a href="mailto:vince@giglinecompliance.com" className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm">
                  vince@giglinecompliance.com
                </a>
              </p>
            </div>

            <p className="mt-8 text-sm text-white/30">
              Based in Kernersville, NC — on-site in the Triad, remote nationwide.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
