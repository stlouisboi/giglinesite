import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SEO from '../components/SEO';
import { trackPhoneClick, trackReviewClick } from '../utils/analytics';

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
const heading = { fontFamily: "'Manrope', sans-serif" };

const HomePage = () => {
  return (
    <main className="overflow-x-hidden">
      <SEO
        title="On-Site Safety Walkthroughs | Kernersville, NC | GigLine Safety & Compliance"
        description="GigLine provides on-site OSHA safety walkthroughs for small manufacturers and warehouses in Kernersville and the Triad, NC. OSHA 30-Hour Certified."
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
        style={{ backgroundColor: '#0B1F33' }}
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
            <div className="hidden md:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0B1F33]" />
            <div className="md:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1F33] to-transparent" />
          </div>

          {/* Right — Copy */}
          <div className="w-full md:w-2/5 flex items-center px-6 md:px-14 lg:px-20 py-12 md:py-0 relative z-10">
            <Reveal>
              <p
                className="uppercase tracking-[3px] text-[#CBD5E1] mb-5"
                style={{ ...mono, fontSize: '11px' }}
                data-testid="hero-label"
              >
                GigLine Safety & Compliance
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6"
                data-testid="hero-headline"
              >
                If OSHA Walked In Tomorrow,{' '}
                <span className="block mt-3">
                  Would You{' '}
                  <span style={{ borderBottom: '2px solid #1F6FEB', paddingBottom: '2px' }}>Pass</span>?
                </span>
              </h1>

              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-6 max-w-md"
                data-testid="hero-sub"
              >
                A single OSHA citation averages $15,625. A GigLine safety walkthrough costs a fraction of that — and gives you a clear picture of where you stand.
              </p>

              <p
                className="text-sm text-[#CBD5E1] leading-relaxed mb-8 max-w-md"
              >
                GigLine provides on-site safety walkthroughs and OSHA-focused compliance inspections for small warehouses and manufacturing operations in the Piedmont Triad.
              </p>

              <div className="flex flex-col items-start gap-3 mb-5" data-testid="hero-ctas">
                <Link
                  to="/services"
                  className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#1F6FEB]/20"
                  data-testid="hero-cta-primary"
                >
                  Request a Safety Walkthrough
                  <ArrowRight size={18} />
                </Link>
                <p className="text-base text-[#CBD5E1] leading-relaxed max-w-md" data-testid="hero-pricing-direction">
                  Walkthrough pricing is based on the size and type of your operation.{' '}
                  <Link to="/services" className="text-[#1F6FEB] hover:text-white underline decoration-[#1F6FEB]/40 hover:decoration-white transition-colors font-semibold">
                    See service options &rarr;
                  </Link>
                </p>
              </div>

              {/* Credentials block */}
              <p
                className="text-sm text-[#CBD5E1] leading-relaxed"
                style={mono}
                data-testid="hero-credentials"
              >
                OSHA 30-Hour Certified · 25+ Years Experience · U.S. Navy Veteran · Serving the Triad
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
              className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              The Reality
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#102133] mb-4 leading-tight"
              data-testid="problem-headline"
            >
              Common OSHA Safety Issues We See on the Floor
            </h2>
            <p className="text-base text-[#102133] mb-4 max-w-2xl leading-relaxed" data-testid="problem-leadin">
              These are the violations we find most often in small operations — most owners don't know they're there until an inspector shows up.
            </p>
            <p className="text-base text-[#102133]/70 mb-12 max-w-2xl leading-relaxed">
              Blocked electrical panels. Expired forklift certifications. Missing lockout-tagout procedures. No written HazCom program. These aren't rare edge cases — they're in almost every facility we walk into.
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
                      className="text-xs uppercase tracking-[2px] text-[#1F6FEB] mb-1"
                      style={mono}
                    >
                      {item.label}
                    </p>
                    <p className="text-base text-white font-bold mb-1">{item.caption}</p>
                    <p className="text-sm text-[#F8FAFC] leading-relaxed">{item.consequence}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p
              className="text-center text-lg sm:text-xl md:text-2xl text-[#102133] font-semibold mt-12"
              data-testid="grid-pressure-line"
            >
              These aren't just issues — they're the ones that show up in inspections.
            </p>
            <p className="text-center text-base md:text-lg text-[#102133]/75 mt-4 max-w-2xl mx-auto" data-testid="grid-consequence-line">
              A single citation for any of these averages $15,625. Most walkthroughs cost a fraction of that.
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
          <div className="absolute inset-0" style={{ backgroundColor: '#0B1F33', opacity: 0.92 }} />
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
                className="text-base sm:text-lg md:text-xl text-[#F8FAFC] font-medium leading-relaxed mb-2"
                data-testid="pressure-line"
              >
                Most issues aren't new.
              </p>
              <p
                className="text-base sm:text-lg md:text-xl text-[#F8FAFC] font-medium leading-relaxed mb-8"
              >
                They've just gone unchecked.
              </p>

              {/* Gold divider — visual entry point */}
              <div className="w-12 h-[2px] mx-auto mb-8" style={{ backgroundColor: 'rgba(74,124,201,0.4)' }} />

              {/* Main headline — bold, gold, largest */}
              <p
                className="text-2xl sm:text-3xl md:text-[44px] font-bold text-white leading-[1.15] tracking-tight mb-6"
                data-testid="statement-headline"
              >
                THIS IS NOT A FULL AUDIT.
                <br />
                IT IS A SIGNAL.
              </p>

              {/* Subtext — smaller, lighter, spaced */}
              <p
                className="text-sm md:text-base text-[#CBD5E1] max-w-sm mx-auto"
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
          S3b — TESTIMONIALS (3-card grid, light bg)
      ═══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white" data-testid="testimonials-section">
        <div className="container max-w-6xl relative z-10">
          {/* Section label */}
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#102133]/45 mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              Proof
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#102133] mb-12 md:mb-16"
              data-testid="testimonials-heading"
            >
              Client Review · Track Record · What You Get
            </h2>
          </Reveal>

          {/* 3-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" data-testid="testimonial-grid">
            {/* Card 1 — Demar Archie (real) */}
            <Reveal delay={0}>
              <div
                className="relative h-full rounded-xl p-7 md:p-8 flex flex-col"
                style={{
                  backgroundColor: '#F7F9FC',
                  border: '1px solid rgba(31,111,235,0.15)',
                  boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
                }}
                data-testid="testimonial-card-1"
              >
                {/* Decorative quote mark */}
                <span
                  className="absolute top-3 right-4 text-[80px] leading-none text-[#1F6FEB]/15 select-none pointer-events-none"
                  aria-hidden="true"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  &ldquo;
                </span>

                {/* Pull quote */}
                <p className="relative text-lg md:text-xl text-[#102133] leading-[1.55] font-semibold mb-5" style={{ fontFamily: 'Georgia, serif' }}>
                  If you're looking for a partner that can bridge the gap between compliance and real-world execution, GigLine delivers results.
                </p>

                {/* Divider */}
                <div className="w-10 h-[2px] mb-5" style={{ backgroundColor: '#1F6FEB' }} />

                {/* Full review */}
                <p className="text-base md:text-sm text-[#102133]/75 leading-relaxed mb-6 flex-grow">
                  "I've worked with GigLine Safety & Compliance and can say they operate at a different level than most safety consultants. They don't just point out issues — they understand how operations actually run and provide solutions that can be executed on the floor. Where they really stand out is in incident investigations. Their approach is disciplined, focused on true root cause, and built around preventing repeat events."
                </p>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#102133]/10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#1F6FEB' }}>
                    DA
                  </div>
                  <div>
                    <p className="text-base md:text-sm font-bold text-[#102133]">Demar Archie</p>
                    <p className="text-sm md:text-xs text-[#102133]/65 mt-0.5">Warehouse Receiving Manager — Google Review</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 2 — Credentials / Track Record (not a testimonial) */}
            <Reveal delay={120}>
              <div
                className="h-full rounded-xl p-7 md:p-8 flex flex-col"
                style={{
                  backgroundColor: '#F7F9FC',
                  border: '1px solid rgba(16,33,51,0.08)',
                  boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
                }}
                data-testid="testimonial-card-2"
              >
                <p className="text-xs uppercase tracking-[2px] text-[#1F6FEB] mb-4 font-semibold" style={mono}>
                  Track Record
                </p>
                <p className="text-[44px] md:text-[52px] leading-none font-bold text-[#102133] mb-2 tracking-tight">
                  25<span className="text-[#1F6FEB]">+</span>
                </p>
                <p className="text-base md:text-lg font-bold text-[#102133] mb-4">
                  Years in manufacturing, fleet, and warehouse safety
                </p>
                <p className="text-base md:text-sm text-[#102133]/75 leading-relaxed mb-6 flex-grow">
                  Plastics manufacturing, building materials distribution, and trucking operations across the Triad. The same violations come up over and over.
                </p>
                <div className="pt-5 border-t border-[#102133]/10">
                  <div className="flex flex-wrap gap-2" data-testid="track-record-credentials">
                    {['OSHA 30-Hour', 'OSHA 10-Hour', 'U.S. Navy Veteran'].map((cred) => (
                      <span
                        key={cred}
                        className="inline-flex items-center px-3 py-1 rounded text-[#102133] border border-[#102133]/15"
                        style={{ ...mono, fontSize: '11px' }}
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3 — Outcome stats (not a testimonial) */}
            <Reveal delay={240}>
              <div
                className="h-full rounded-xl p-7 md:p-8 flex flex-col"
                style={{
                  backgroundColor: '#F7F9FC',
                  border: '1px solid rgba(16,33,51,0.08)',
                  boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
                }}
                data-testid="testimonial-card-3"
              >
                <p className="text-xs uppercase tracking-[2px] text-[#1F6FEB] mb-4 font-semibold" style={mono}>
                  What You Get
                </p>

                {/* Stat block 1 */}
                <div className="mb-6">
                  <p className="text-[40px] md:text-[48px] leading-none font-bold text-[#102133] mb-2 tracking-tight">
                    6<span className="text-[#102133]/40 text-2xl md:text-3xl">–</span>10
                  </p>
                  <p className="text-base font-bold text-[#102133] mb-1">
                    Corrective actions per walkthrough
                  </p>
                  <p className="text-sm md:text-xs text-[#102133]/65 leading-relaxed">
                    Prioritized. Most clients resolve top items within 30 days.
                  </p>
                </div>

                {/* Stat block 2 */}
                <div className="pt-5 border-t border-[#102133]/10 flex-grow">
                  <p className="text-[40px] md:text-[48px] leading-none font-bold text-[#102133] mb-2 tracking-tight">
                    24<span className="text-[#102133]/40 text-2xl md:text-3xl">–</span>48<span className="text-[#1F6FEB] text-2xl md:text-3xl"> hrs</span>
                  </p>
                  <p className="text-base font-bold text-[#102133] mb-1">
                    Written report delivery
                  </p>
                  <p className="text-sm md:text-xs text-[#102133]/65 leading-relaxed">
                    Photo-documented findings. CFR-referenced. Yours to keep.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Google Review Badge — verifiable trust signal */}
          <Reveal delay={360}>
            <div className="mt-10 md:mt-12 flex justify-center" data-testid="google-review-badge-wrap">
              <a
                href="https://share.google/iUzTnuRSCNdguZQww"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackReviewClick('homepage_badge')}
                className="group inline-flex items-center gap-4 rounded-full pl-5 pr-6 py-3 transition-all hover:shadow-md"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(16,33,51,0.10)',
                }}
                data-testid="google-review-badge"
                aria-label="Read GigLine reviews on Google"
              >
                {/* Google "G" logo */}
                <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" className="flex-shrink-0">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                </svg>

                {/* Rating + count */}
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-[#102133]">5.0</span>
                    <span className="flex items-center" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </span>
                  </div>
                  <span className="text-xs text-[#102133]/65 mt-0.5" style={mono}>
                    1 Google Review &middot; Read on Google &rarr;
                  </span>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#F7F9FC' }} data-testid="process-section">
        {/* Background image — right side only */}
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-0 right-0 bottom-0 w-3/5">
            <img
              src="/vince-inspecting.png"
              alt="Vince Lawrence conducting LOTO compliance review with clipboard"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #F7F9FC 0%, rgba(247,249,252,0.15) 25%, transparent 50%)' }} />
          </div>
        </div>

        <div className="container max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left label — 40% */}
            <div className="md:w-2/5">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  The Process
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#102133] leading-tight mb-6"
                  data-testid="process-headline"
                >
                  What to Expect from a Safety Walkthrough
                </h2>
                <p className="text-base text-[#102133] leading-relaxed">
                  Simple, direct, no disruption to your day.
                </p>
              </Reveal>
            </div>

            {/* Right steps — 60% */}
            <div className="md:w-3/5">
              <Reveal>
                <div className="space-y-0 border-t border-[#102133]/10 rounded-lg p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }} data-testid="process-steps">
                  {[
                    { num: '01', label: 'Request', desc: 'Tell me about your operation.' },
                    { num: '02', label: 'Schedule', desc: 'We set a time. No disruption.' },
                    { num: '03', label: 'Walkthrough', desc: 'I walk your floor during normal work.' },
                    { num: '04', label: 'Report', desc: 'You get clear findings with photos.' },
                    { num: '05', label: 'Action', desc: 'You fix what matters. Ignore what doesn\'t.' },
                  ].map((step, i) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-5 py-5 border-b border-[#102133]/10"
                      data-testid={`process-step-${i}`}
                    >
                      <span
                        className="flex-shrink-0 mt-0.5 text-[#1F6FEB] font-semibold"
                        style={{ ...mono, fontSize: '13px' }}
                      >
                        {step.num}
                      </span>
                      <div>
                        <p className="text-base font-bold text-[#102133] mb-0.5">{step.label}</p>
                        <p className="text-base text-[#102133]/80">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA after Process steps */}
                <div className="mt-8 flex justify-start" data-testid="process-cta-wrap">
                  <Link
                    to="/services"
                    className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-7 py-3.5 rounded-lg text-base transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#1F6FEB]/20"
                    data-testid="process-cta"
                  >
                    Request a Safety Walkthrough
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S5 — DELIVERABLE CHECKLIST  (asymmetric 40/60)
      ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#102A43' }} data-testid="deliverables-section">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left label — 40% */}
            <div className="md:w-2/5">
              <Reveal>
                <p
                  className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
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
                <p className="text-base text-[#CBD5E1] leading-relaxed">
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
                      <Check size={18} className="flex-shrink-0 mt-0.5 text-[#1F6FEB]" strokeWidth={2.5} />
                      <p className="text-base text-[#CBD5E1]">{item}</p>
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
                  className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
                  style={{ ...mono, fontSize: '11px' }}
                >
                  The Difference
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#102133] leading-tight mb-4"
                  data-testid="comparison-headline"
                >
                  Why Not Just Use OSHA Consultation?
                </h2>
                <p className="text-base text-[#102133]/75 leading-relaxed">
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
                      className="text-xs font-semibold tracking-widest text-[#102133]/25 uppercase mb-5"
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
                          className="text-base text-[#102133]/30 line-through decoration-[#102133]/12"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* GigLine column */}
                  <div className="p-5 rounded border-2 border-[#1F6FEB]/20" style={{ backgroundColor: '#FDFBF5' }}>
                    <p
                      className="text-xs font-semibold tracking-widest text-[#1F6FEB] uppercase mb-5"
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
                          <Check size={15} className="flex-shrink-0 mt-0.5 text-[#1F6FEB]" strokeWidth={3} />
                          <p className="text-base text-[#102133] font-bold">{item}</p>
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
              <p className="text-base md:text-sm text-[#CBD5E1]" style={mono}>
                Every facility has blind spots. We walk in and find them.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S8 — FOUNDER  (asymmetric 35/65)
      ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#0B1F33' }} data-testid="founder-section">
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
                  className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
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
                      className="inline-flex items-center px-3 py-1 rounded text-[#1F6FEB] border border-[#1F6FEB]/30"
                      style={{ ...mono, fontSize: '11px' }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-8" data-testid="founder-bio">
                  <p className="text-base text-[#F8FAFC] leading-relaxed">
                    Vince Lawrence is a safety consultant based in Kernersville, NC. OSHA 30-Hour Certified. 25+ years in manufacturing, fleet, and warehouse safety operations. U.S. Navy veteran.
                  </p>
                  <p className="text-base text-[#CBD5E1] leading-relaxed">
                    I've walked floors in plastics manufacturing, building materials distribution, and trucking operations across the Triad. I know what inspectors look for because I've helped operations correct the same violations hundreds of times.
                  </p>
                  <p className="text-base text-[#CBD5E1] leading-relaxed">
                    GigLine is a private engagement. Nothing leaves your facility except the report I hand you.
                  </p>
                  <p className="text-base md:text-sm text-[#CBD5E1]/90 leading-relaxed">
                    Service area: On-site walkthroughs within 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities.
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
                        border: '1px solid rgba(255,255,255,0.06)',
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
              className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              Common Questions
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-12" data-testid="faq-heading">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="space-y-8" data-testid="faq-list">
            <Reveal>
              <div className="pb-8 border-b border-[#102133]/10">
                <h3 className="text-lg font-bold text-[#102133] mb-3" data-testid="faq-q1">How long are you on-site?</h3>
                <p className="text-base text-[#102133]/85 leading-relaxed">
                  Most walkthroughs run 1 to 3 hours depending on the size of the operation. A small shop may take under an hour. A multi-bay warehouse or production floor typically runs 2 to 3 hours. You'll know the range before I arrive.
                </p>
              </div>
            </Reveal>

            <Reveal delay={50}>
              <div className="pb-8 border-b border-[#102133]/10">
                <h3 className="text-base font-bold text-[#102133] mb-3" data-testid="faq-q2">What do I get when it's done?</h3>
                <p className="text-base text-[#102133]/80 leading-relaxed">
                  A written report delivered within 48 hours. It includes photo-documented findings, the specific OSHA standard referenced for each one, and a plain-language corrective action for each item. No guesswork about what to fix or why.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="pb-8 border-b border-[#102133]/10">
                <h3 className="text-lg font-bold text-[#102133] mb-3" data-testid="faq-q3">Do you work with my insurance company or report to OSHA?</h3>
                <p className="text-base text-[#102133]/85 leading-relaxed">
                  No. This is a private engagement. Nothing leaves the building except the report I give you. I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div>
                <h3 className="text-lg font-bold text-[#102133] mb-3" data-testid="faq-q4">What if my operation is outside the Triad?</h3>
                <p className="text-base text-[#102133]/85 leading-relaxed">
                  On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply.
                </p>
              </div>
            </Reveal>
          </div>

          {/* CTA after FAQ */}
          <Reveal>
            <div className="mt-12 md:mt-14 flex justify-center" data-testid="faq-cta-wrap">
              <Link
                to="/services"
                className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-7 py-3.5 rounded-lg text-base transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#1F6FEB]/20"
                data-testid="faq-cta"
              >
                Request a Safety Walkthrough
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S9 — LOCAL SERVICE AREA STATEMENT
      ═══════════════════════════════════════════════ */}
      <section className="relative py-14 md:py-20 overflow-hidden" style={{ backgroundColor: '#E8ECF0' }}>
        {/* Realistic light-mode map background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Base */}
          <rect width="1200" height="500" fill="#E8ECF0" />

          {/* City blocks */}
          <rect x="50" y="30" width="120" height="80" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="200" y="30" width="180" height="120" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="50" y="140" width="120" height="100" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="200" y="180" width="180" height="90" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="420" y="30" width="140" height="160" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="420" y="220" width="140" height="130" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="600" y="30" width="200" height="100" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="600" y="160" width="100" height="110" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="730" y="160" width="70" height="110" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="840" y="30" width="160" height="180" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="840" y="240" width="160" height="120" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="1040" y="30" width="130" height="120" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="1040" y="180" width="130" height="180" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="50" y="270" width="120" height="100" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="200" y="300" width="180" height="100" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="50" y="400" width="320" height="80" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="420" y="380" width="140" height="100" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="600" y="300" width="200" height="80" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="600" y="410" width="200" height="70" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />
          <rect x="840" y="390" width="330" height="90" rx="2" fill="#F2F4F6" stroke="#D0D5DC" strokeWidth="0.5" />

          {/* Green spaces */}
          <rect x="710" y="165" width="15" height="100" rx="2" fill="#C8E6C0" />
          <rect x="95" y="145" width="30" height="30" rx="3" fill="#C8E6C0" />
          <rect x="950" y="50" width="40" height="40" rx="4" fill="#C8E6C0" />

          {/* Street names */}
          <text x="190" y="125" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">MAIN ST</text>
          <text x="560" y="205" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">UNIVERSITY PKWY</text>
          <text x="180" y="280" fontSize="7" fill="#8899AA" fontFamily="Arial" transform="rotate(-90, 180, 280)" letterSpacing="1">CHERRY ST</text>
          <text x="820" y="225" fontSize="7" fill="#8899AA" fontFamily="Arial" transform="rotate(-90, 820, 225)" letterSpacing="1">HANES MILL RD</text>
          <text x="410" y="375" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">BUSINESS 40</text>
          <text x="600" y="400" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">KERNERSVILLE RD</text>
          <text x="900" y="375" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">I-40</text>
          <text x="50" y="265" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">S STRATFORD RD</text>
          <text x="1050" y="170" fontSize="7" fill="#8899AA" fontFamily="Arial" letterSpacing="1">OLD HOLLOW RD</text>

          {/* Navigation route line — blue, curved through streets */}
          <path d="M 150,450 L 150,280 L 190,280 L 190,125 L 390,125 L 390,200 L 570,200 L 570,200 L 810,200 L 810,200 L 810,130 L 700,130" 
            stroke="#1F6FEB" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <path d="M 150,450 L 150,280 L 190,280 L 190,125 L 390,125 L 390,200 L 570,200 L 570,200 L 810,200 L 810,200 L 810,130 L 700,130" 
            stroke="#1F6FEB" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Start marker — blue dot */}
          <circle cx="150" cy="450" r="6" fill="#1F6FEB" />
          <circle cx="150" cy="450" r="3" fill="white" />

          {/* Destination pin */}
          <g transform="translate(700, 108)">
            <ellipse cx="0" cy="20" rx="6" ry="3" fill="rgba(0,0,0,0.15)" />
            <path d="M0,-14 C-8,-14 -14,-8 -14,0 C-14,10 0,22 0,22 C0,22 14,10 14,0 C14,-8 8,-14 0,-14 Z" fill="#D94040" />
            <circle cx="0" cy="-1" r="5" fill="white" />
          </g>
        </svg>

        <div className="container max-w-4xl relative z-10">
          <div className="rounded-xl px-6 py-8 md:px-10 md:py-10 text-center" style={{ background: '#0B1F33', border: '1px solid rgba(74,124,201,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <p
              className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              Service Area
            </p>
            <p className="text-base md:text-lg text-[#F8FAFC] leading-relaxed mb-3 font-medium" data-testid="service-area-statement">
              On-site walkthroughs within roughly 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and nearby towns.
            </p>
            <p className="text-base md:text-sm text-white/70 leading-relaxed">
              Need a visit a bit farther out? I can often travel to Mooresville, Concord, Huntersville, or Danville, VA — travel fees may apply.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S9b — FROM THE FIELD (Recent Articles)
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" data-testid="recent-articles-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase tracking-[3px] text-[#102133]/45 mb-4"
              style={{ ...mono, fontSize: '11px' }}
            >
              Safety Resources
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-3" data-testid="recent-articles-heading">
              From the Field
            </h2>
            <p className="text-base text-[#102133]/70 mb-12 max-w-2xl leading-relaxed">
              Plain-language notes on the OSHA issues that show up most often during walkthroughs.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6" data-testid="recent-articles-grid">
            {[
              { slug: 'heat-stress', title: 'Heat Stress', desc: 'How heat exposure gets missed, what triggers OSHA attention, and what small operations can do about it.' },
              { slug: 'forklift-safety', title: 'Forklift Safety', desc: 'Certification gets the headlines, but daily inspections and pedestrian separation are where most operations break down.' },
              { slug: 'electrical-safety', title: 'Electrical Access', desc: "Blocked electrical panels are one of OSHA's most cited violations. Usually a forklift, a pallet, or a shelf is in the way." },
              { slug: 'hazcom', title: 'HazCom & SDS', desc: 'Missing labels, outdated SDS binders, and no written program. The most common violation in general industry.' },
            ].map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <Link
                  to={`/field-notes/${post.slug}`}
                  className="group block h-full rounded-lg p-6 transition-all duration-200"
                  style={{
                    backgroundColor: '#F7F9FC',
                    border: '1px solid rgba(16,33,51,0.08)',
                  }}
                  data-testid={`recent-article-${i}`}
                >
                  <p
                    className="text-[10px] uppercase tracking-[2px] text-[#1F6FEB] mb-3 font-semibold"
                    style={mono}
                  >
                    Field Note
                  </p>
                  <h3 className="text-lg font-bold text-[#102133] mb-2 leading-snug group-hover:text-[#1F6FEB] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-base md:text-sm text-[#102133]/75 leading-relaxed mb-4">
                    {post.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-base md:text-sm font-semibold text-[#1F6FEB] group-hover:gap-2 transition-all">
                    Read the note
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 text-center">
              <Link
                to="/field-notes"
                className="inline-flex items-center gap-2 text-base md:text-sm font-semibold text-[#102133] hover:text-[#1F6FEB] transition-colors"
                data-testid="all-field-notes-link"
              >
                See all field notes
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          {/* Pricing direction line above footer — Fix 2 secondary */}
          <Reveal>
            <div className="mt-16 pt-10 border-t border-[#102133]/08 text-center" data-testid="pricing-direction-footer">
              <p className="text-base md:text-sm text-[#102133]/70 max-w-xl mx-auto leading-relaxed">
                Walkthrough pricing is based on the size and type of your operation.{' '}
                <Link to="/services" className="text-[#1F6FEB] font-semibold underline decoration-[#1F6FEB]/40 hover:decoration-[#1F6FEB] transition-colors">
                  See service options &rarr;
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          S10 — FINAL CTA BAND
      ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-36" style={{ backgroundColor: '#000000' }} data-testid="final-cta-section">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl leading-tight mb-8" data-testid="final-cta-headline">
              <span className="block text-[#F8FAFC] font-normal mb-2">
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
                to="/services"
                className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#1F6FEB]/20"
                data-testid="final-cta-walkthrough"
              >
                Request a Safety Walkthrough
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

            <p className="text-base md:text-sm text-[#CBD5E1] mb-14" style={mono} data-testid="final-price-line">
              Walkthrough pricing is based on the size and type of your operation — see service options.
            </p>

            {/* Contact block */}
            <div className="w-px h-10 mx-auto mb-8" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }} />
            <p className="text-white font-bold text-lg mb-1">Vince Lawrence</p>
            <p className="text-base md:text-sm text-[#CBD5E1] mb-4" style={mono}>
              GigLine Safety & Compliance
            </p>
            <p className="mb-2">
              <a
                href="tel:3363298899"
                onClick={() => trackPhoneClick('homepage_final_cta')}
                className="text-[#1F6FEB] hover:text-white transition-colors text-2xl font-bold tracking-wide"
                data-testid="final-phone"
              >
                (336) 329-8899
              </a>
            </p>
            <p>
              <a
                href="mailto:vince@giglinecompliance.com"
                className="text-[#CBD5E1] hover:text-[#1F6FEB] transition-colors text-base md:text-sm"
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
