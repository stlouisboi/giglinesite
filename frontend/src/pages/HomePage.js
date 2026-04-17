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
  hero: '/hero-blocked-exit.jpg',
  grid1: '/cluttered-aisles.jpg',
  grid2: '/blocked-electrical-panel.jpg',
  grid3: '/machine-guarding.jpg',
  grid4: '/blocked-fire-riser.jpg',
  proof: 'https://images.unsplash.com/photo-1644079446600-219068676743?w=1400&q=80&fit=crop&auto=format',
};

/* ── Mono font helper ── */
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const HomePage = () => {
  return (
    <main className="overflow-x-hidden">
      <SEO
        title="On-Site Safety Walkthroughs | Kernersville, NC | GigLine Safety & Compliance"
        description="On-site safety walkthroughs for small warehouses and manufacturers in Kernersville, NC. Find OSHA exposures before an inspector does. No retainer. No ongoing contract."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://www.giglinecompliance.com",
          "name": "GigLine Safety & Compliance",
          "description": "On-site safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, and contractors.",
          "url": "https://www.giglinecompliance.com",
          "telephone": "+13363298899",
          "email": "vince@giglinecompliance.com",
          "image": "https://www.giglinecompliance.com/og-image.png",
          "founder": {
            "@type": "Person",
            "name": "Vince Lawrence"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kernersville",
            "addressRegion": "NC",
            "postalCode": "27107",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 36.1198,
            "longitude": -80.0735
          },
          "areaServed": [
            { "@type": "GeoCircle", "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 36.0999, "longitude": -80.2442 }, "geoRadius": "60 mi" },
            { "@type": "City", "name": "Winston-Salem" },
            { "@type": "City", "name": "Greensboro" },
            { "@type": "City", "name": "High Point" },
            { "@type": "City", "name": "Kernersville", "sameAs": "https://en.wikipedia.org/wiki/Kernersville,_North_Carolina" },
            { "@type": "City", "name": "Lexington" },
            { "@type": "City", "name": "Thomasville" },
            { "@type": "City", "name": "Salisbury" },
            { "@type": "City", "name": "Burlington" }
          ],
          "priceRange": "$550–$1200",
          "openingHours": "Mo-Fr 08:00-18:00",
          "sameAs": [],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Safety Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Safety Walkthrough & Top 10 Fixes Report", "description": "On-site facility walkthrough with written report." }, "price": "650", "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Documentation Review & Gap Check", "description": "Review of written safety programs and training records." }, "price": "550", "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Incident Review & Corrective Action Support", "description": "Post-incident documentation and corrective action." }, "price": "900", "priceCurrency": "USD" }
            ]
          }
        }}
      />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How long are you on-site?", "acceptedAnswer": { "@type": "Answer", "text": "Most walkthroughs run 1 to 3 hours depending on the size of the operation. A small shop may take under an hour. A multi-bay warehouse or production floor typically runs 2 to 3 hours. You'll know the range before I arrive." } },
          { "@type": "Question", "name": "What do I get when it's done?", "acceptedAnswer": { "@type": "Answer", "text": "A written report delivered within 48 hours. It includes photo-documented findings, the specific OSHA standard referenced for each one, and a plain-language corrective action for each item. No guesswork about what to fix or why." } },
          { "@type": "Question", "name": "Do you work with my insurance company or report to OSHA?", "acceptedAnswer": { "@type": "Answer", "text": "No. This is a private engagement. Nothing leaves the building except the report I give you. I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision." } },
          { "@type": "Question", "name": "What if my operation is outside the Triad?", "acceptedAnswer": { "@type": "Answer", "text": "On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply." } }
        ]
      })}} />

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
              alt="Warehouse safety walkthrough — GigLine on-site OSHA inspection"
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
                GigLine provides on-site safety walkthroughs and OSHA-focused compliance inspections for small warehouses and manufacturing operations in the Piedmont Triad.
              </p>

              <p
                className="text-sm text-white/45 leading-relaxed mb-6 max-w-md"
              >
                One OSHA citation runs $16,550. A Safety Walkthrough finds your exposures first — before an inspector does. You leave with a written report and a clear fix list.
              </p>

              <p
                className="text-sm text-[#C9A84C] font-semibold tracking-wide uppercase mb-8"
                style={mono}
                data-testid="hero-positioning"
              >
                One visit. Starting at $650. No retainer.
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
              <p className="text-sm text-white/50" style={mono} data-testid="hero-trust-line">
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
              Common OSHA Safety Issues We See on the Floor
            </h2>
            <p className="text-base text-[#1C2B2B]/50 mb-12 max-w-lg">
              These aren't rare edge cases. They're in almost every facility we walk into.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {[
              { img: IMG.grid1, label: 'Blocked Egress', caption: 'Blocked egress', consequence: 'Cited in 22% of general industry inspections. Instant citation if found during an OSHA visit.' },
              { img: IMG.grid2, label: 'Electrical Access', caption: 'Electrical panel clearance', consequence: 'Blocked panels delay emergency shutoff and are automatic citations under OSHA 1910.303.' },
              { img: IMG.grid3, label: 'Machine Guarding', caption: 'Machine guarding', consequence: 'One of OSHA\u2019s top 10 most cited violations. Missing guards are automatic citations.' },
              { img: IMG.grid4, label: 'Emergency Access', caption: 'Fire riser clearance', consequence: 'Blocked fire equipment delays response time and is citable on first observation.' },
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p
                      className="text-[10px] uppercase tracking-[2px] text-[#C9A84C] mb-1"
                      style={mono}
                    >
                      {item.label}
                    </p>
                    <p className="text-[13px] text-white/90 font-semibold mb-1">{item.caption}</p>
                    <p className="text-[12px] text-white/55 leading-relaxed">{item.consequence}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p
              className="text-center text-base sm:text-lg md:text-xl text-[#1C2B2B]/60 font-medium mt-12"
              data-testid="grid-pressure-line"
            >
              These aren't just issues — they're the ones that show up in inspections.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATEMENT ANCHOR — Combined visual moment
      ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        data-testid="statement-section"
      >
        {/* Background: low-opacity industrial image + vignette */}
        <div className="absolute inset-0">
          <img
            src={IMG.proof}
            alt="Safety walkthrough report with photo documentation and fix list"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(12px) brightness(0.25)', opacity: 0.12 }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: '#0D1B2A', opacity: 0.92 }} />
          {/* Vignette — darker edges, lighter center */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 py-16 md:py-24">
          <div className="container max-w-3xl text-center">
            <Reveal>
              {/* Top lines — medium weight, muted */}
              <p
                className="text-base sm:text-lg md:text-xl text-white/40 font-medium leading-relaxed mb-2"
                data-testid="pressure-line"
              >
                Most issues aren't new.
              </p>
              <p
                className="text-base sm:text-lg md:text-xl text-white/55 font-medium leading-relaxed mb-8"
              >
                They've just gone unchecked.
              </p>

              {/* Gold divider — visual entry point */}
              <div className="w-12 h-[2px] mx-auto mb-8" style={{ backgroundColor: '#C9A84C' }} />

              {/* Main headline — bold, gold, largest */}
              <p
                className="text-2xl sm:text-3xl md:text-[44px] font-bold text-[#C9A84C] leading-[1.15] tracking-tight mb-6"
                data-testid="statement-headline"
              >
                THIS IS NOT A FULL AUDIT.
                <br />
                IT IS A SIGNAL.
              </p>

              {/* Subtext — smaller, lighter, spaced */}
              <p
                className="text-sm md:text-base text-white/35 max-w-sm mx-auto"
                style={{ letterSpacing: '0.5px' }}
                data-testid="statement-sub"
              >
                We identify exposure. You decide what to fix.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S3b — TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#0D1B2A' }} data-testid="testimonials-section">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }} />

        <div className="container max-w-6xl relative z-10">
          {/* Section label */}
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              Client Review
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-16 md:mb-20"
              data-testid="testimonials-heading"
            >
              What Clients Say
            </h2>
          </Reveal>

          {/* Featured quote block */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left — Pull Quote (60%) */}
            <div className="lg:w-3/5">
              <Reveal delay={0}>
                <div
                  className="relative"
                  data-testid="testimonial-card-1"
                >
                  {/* Large decorative quote mark */}
                  <span
                    className="absolute -top-6 -left-2 text-[120px] md:text-[160px] leading-none text-[#C9A84C]/10 select-none pointer-events-none"
                    aria-hidden="true"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    &ldquo;
                  </span>

                  {/* Pull quote */}
                  <p className="relative text-xl sm:text-2xl md:text-[28px] text-white/90 leading-[1.5] font-medium mb-8 pl-1" style={{ fontFamily: 'Georgia, serif' }}>
                    If you're looking for a partner that can bridge the gap between compliance and real-world execution, GigLine delivers results.
                  </p>

                  {/* Gold divider */}
                  <div className="w-16 h-[2px] mb-8" style={{ backgroundColor: '#C9A84C' }} />

                  {/* Full review — glass card */}
                  <div
                    className="rounded-lg p-6 md:p-8"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(201,168,76,0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <p className="text-sm md:text-base text-white/45 leading-relaxed">
                      "I've worked with GigLine Safety & Compliance and can say they operate at a different level than most safety consultants. They don't just point out issues — they understand how operations actually run and provide solutions that can be executed on the floor. Their support with audits and compliance reviews helped us quickly identify gaps, tighten controls, and improve overall accountability without slowing down production. Where they really stand out is in incident investigations. Their approach is disciplined, focused on true root cause, and built around preventing repeat events — not just checking a box. That level of structure has a direct impact on long-term safety performance."
                    </p>
                  </div>

                  {/* Attribution */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#0D1B2A]" style={{ backgroundColor: '#C9A84C' }}>
                      DA
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Demar Archie</p>
                      <p className="text-xs text-white/30 mt-0.5">Warehouse Receiving Manager — Google Review</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Outcome Stats (40%) */}
            <div className="lg:w-2/5 flex flex-col gap-6 md:gap-8">
              {/* Stat Card 1 */}
              <Reveal delay={150}>
                <div
                  className="rounded-lg p-6 md:p-8 group hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.12)',
                  }}
                  data-testid="testimonial-card-2"
                >
                  <p
                    className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-2 tracking-tight"
                    data-testid="outcome-stat-1"
                  >
                    6–10
                  </p>
                  <p className="text-base font-bold text-white mb-3">
                    Corrective actions per walkthrough
                  </p>
                  <p className="text-sm text-white/35 leading-relaxed">
                    Every engagement produces a prioritized list of findings — not a binder full of theory. Most clients resolve their top issues within 30 days.
                  </p>
                  <p className="text-[10px] text-white/15 uppercase tracking-wider mt-4" style={mono}>
                    Based on completed walkthroughs
                  </p>
                </div>
              </Reveal>

              {/* Stat Card 2 */}
              <Reveal delay={300}>
                <div
                  className="rounded-lg p-6 md:p-8 group hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.12)',
                  }}
                  data-testid="testimonial-card-3"
                >
                  <p
                    className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-2 tracking-tight"
                    data-testid="outcome-stat-2"
                  >
                    24–48 hrs
                  </p>
                  <p className="text-base font-bold text-white mb-3">
                    Written report delivered after your visit
                  </p>
                  <p className="text-sm text-white/35 leading-relaxed">
                    A written report with findings, photos, and a fix list — not a phone call summary. Yours to keep, share with your team, or hand to your insurer.
                  </p>
                  <p className="text-[10px] text-white/15 uppercase tracking-wider mt-4" style={mono}>
                    Standard turnaround
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S4 — PROCESS  (asymmetric 40/60)
      ═══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#F9F8F6' }} data-testid="process-section">
        {/* Background image — right side only */}
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-0 right-0 bottom-0 w-3/5">
            <img
              src="/vince-inspecting.png"
              alt="Vince Lawrence conducting LOTO compliance review with clipboard"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #F9F8F6 0%, rgba(249,248,246,0.15) 25%, transparent 50%)' }} />
          </div>
        </div>

        <div className="container max-w-6xl relative z-10">
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
                  What to Expect from a Safety Walkthrough
                </h2>
                <p className="text-base text-[#1C2B2B]/50 leading-relaxed">
                  Simple, direct, no disruption to your day.
                </p>
              </Reveal>
            </div>

            {/* Right steps — 60% */}
            <div className="md:w-3/5">
              <Reveal>
                <div className="space-y-0 border-t border-[#1C2B2B]/10 rounded-lg p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }} data-testid="process-steps">
                  {[
                    { num: '01', label: 'Request', desc: 'Tell me about your operation.' },
                    { num: '02', label: 'Schedule', desc: 'We set a time. No disruption.' },
                    { num: '03', label: 'Walkthrough', desc: 'I walk your floor during normal work.' },
                    { num: '04', label: 'Report', desc: 'You get clear findings with photos.' },
                    { num: '05', label: 'Action', desc: 'You fix what matters. Ignore what doesn\'t.' },
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
      <section className="py-24 md:py-32" style={{ backgroundColor: '#1C2B2B' }} data-testid="deliverables-section">
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
      <section className="py-24 md:py-32 bg-white" data-testid="comparison-section">
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
                <div className="grid grid-cols-2 gap-6 md:gap-10" data-testid="comparison-grid">
                  {/* OSHA column */}
                  <div className="p-5 rounded" style={{ backgroundColor: '#F5F5F3' }}>
                    <p
                      className="text-xs font-semibold tracking-widest text-[#1C2B2B]/25 uppercase mb-5"
                      style={mono}
                    >
                      OSHA Consultation
                    </p>
                    <div className="space-y-4">
                      {[
                        'General guidance',
                        'Not based on real-time conditions',
                        "Doesn't walk your operation",
                      ].map((item, i) => (
                        <p
                          key={i}
                          className="text-sm text-[#1C2B2B]/30 line-through decoration-[#1C2B2B]/12"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* GigLine column */}
                  <div className="p-5 rounded border-2 border-[#C9A84C]/20" style={{ backgroundColor: '#FDFBF5' }}>
                    <p
                      className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-5"
                      style={mono}
                    >
                      GigLine
                    </p>
                    <div className="space-y-4">
                      {[
                        'Walks your floor',
                        "Sees what's actually happening",
                        'Gives priorities you can act on this week',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check size={15} className="flex-shrink-0 mt-0.5 text-[#C9A84C]" strokeWidth={3} />
                          <p className="text-sm text-[#1C2B2B] font-bold">{item}</p>
                        </div>
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
            alt="Warehouse floor during on-site OSHA compliance inspection"
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
      <section className="py-24 md:py-32" style={{ backgroundColor: '#0D1B2A' }} data-testid="founder-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Left — Photo (35%) */}
            <div className="w-full md:w-[35%] flex-shrink-0">
              <Reveal>
                <img
                  src="/vince-portrait.jpg"
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
                    25 years in environments where safety was operational — not theoretical.
                  </p>
                  <p className="text-base text-white/65 leading-relaxed">
                    Manufacturing floors. Compliance systems. Real consequences when something was missed.
                  </p>
                  <p className="text-base text-white/65 leading-relaxed">
                    GigLine gives small operations a clear way to understand their risk — without a full consulting firm.
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
          S8b — FAQ BLOCK
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" data-testid="faq-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#C9A84C] mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              Common Questions
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-12" data-testid="faq-heading">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="space-y-8" data-testid="faq-list">
            <Reveal>
              <div className="pb-8 border-b border-[#1C2B2B]/10">
                <h3 className="text-base font-bold text-[#1C2B2B] mb-3" data-testid="faq-q1">How long are you on-site?</h3>
                <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
                  Most walkthroughs run 1 to 3 hours depending on the size of the operation. A small shop may take under an hour. A multi-bay warehouse or production floor typically runs 2 to 3 hours. You'll know the range before I arrive.
                </p>
              </div>
            </Reveal>

            <Reveal delay={50}>
              <div className="pb-8 border-b border-[#1C2B2B]/10">
                <h3 className="text-base font-bold text-[#1C2B2B] mb-3" data-testid="faq-q2">What do I get when it's done?</h3>
                <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
                  A written report delivered within 48 hours. It includes photo-documented findings, the specific OSHA standard referenced for each one, and a plain-language corrective action for each item. No guesswork about what to fix or why.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="pb-8 border-b border-[#1C2B2B]/10">
                <h3 className="text-base font-bold text-[#1C2B2B] mb-3" data-testid="faq-q3">Do you work with my insurance company or report to OSHA?</h3>
                <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
                  No. This is a private engagement. Nothing leaves the building except the report I give you. I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div>
                <h3 className="text-base font-bold text-[#1C2B2B] mb-3" data-testid="faq-q4">What if my operation is outside the Triad?</h3>
                <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
                  On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S9 — LOCAL SERVICE AREA STATEMENT
      ═══════════════════════════════════════════════ */}
      <section className="py-6" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="container max-w-5xl text-center">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }} data-testid="service-area-statement">
            On-site walkthroughs within roughly 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and nearby towns.
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Need a visit a bit farther out? I can often travel to Mooresville, Concord, Huntersville, or Danville, VA — travel fees may apply.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S10 — FINAL CTA BAND
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
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
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

            <p className="text-sm text-white/35 mb-14" style={mono} data-testid="final-price-line">
              Most walkthroughs start at $650 depending on size.
            </p>

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
