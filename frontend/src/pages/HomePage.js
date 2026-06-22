import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, BookOpen, Monitor, FileText, Bot, Zap, ShieldCheck, Star, Anchor, Factory, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import CaseStudyTeaser from '../components/CaseStudyTeaser';
import FieldManualBand from '../components/FieldManualBand';
import { trackPhoneClick, trackReviewClick, trackEvent } from '../utils/analytics';

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
  hero: 'https://www.giglinecompliance.com/vince-inspecting.png',
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
        title="Safety Walkthroughs & OSHA Documentation Readiness Reviews for NC Manufacturers, Warehouses & Fleets | GigLine"
        description="Practical safety walkthroughs and OSHA Documentation Readiness Reviews for manufacturers, warehouses, contractors, and fleet operations in North Carolina. Written report in 48 hours. (336) 329-8899."
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
            { "@type": "City", "name": "Clemmons" },
            { "@type": "City", "name": "Lexington" },
            { "@type": "City", "name": "Thomasville" },
            { "@type": "City", "name": "Mocksville" },
            { "@type": "City", "name": "Asheboro" },
            { "@type": "City", "name": "Salisbury" },
            { "@type": "City", "name": "Burlington" }
          ],
          "priceRange": "$750–$4500",
          "openingHours": "Mo-Fr 08:00-18:00",
          "sameAs": [],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Safety Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Safety Walkthrough & Top 10 Fixes Report", "description": "On-site facility walkthrough with written report." }, "price": "650", "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "OSHA Documentation Readiness Review", "description": "Review of written safety programs and training records." }, "price": (process.env.REACT_APP_GL_WEB_008_ENABLED === 'true' ? "950" : "750"), "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Incident Review & Corrective Action Support", "description": "Post-incident documentation and corrective action." }, "price": "900", "priceCurrency": "USD" }
            ]
          }
        }}
      />

      {/* FAQPage JSON-LD lives only in the pre-rendered static HTML via
          /scripts/generate-seo-pages.js. We do NOT emit it from React to avoid
          Google "Duplicate field FAQPage" warnings. */}

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
        className="relative min-h-[60vh] xl:min-h-[85vh] overflow-hidden"
        style={{ backgroundColor: '#0B1F33' }}
        data-testid="hero-section"
      >
        <div className="flex flex-col xl:flex-row h-full min-h-[60vh] xl:min-h-[85vh]">
          {/* Left — Photo */}
          <div className="relative w-full xl:w-3/5 h-[45vh] xl:h-auto overflow-hidden">
            <img
              src="/vince-inspecting.webp"
              alt="Vince Lawrence of GigLine Safety & Compliance inspecting a facility during an on-site OSHA safety walkthrough"
              className="absolute inset-0 w-full h-full object-cover img-zoom"
              loading="eager"
              fetchPriority="high"
              data-testid="hero-image"
            />
            {/* Gradient bleed into text column */}
            <div className="hidden xl:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0B1F33]" />
            <div className="xl:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1F33] to-transparent" />
          </div>

          {/* Right — Copy */}
          <div className="w-full xl:w-2/5 flex items-center px-6 md:px-10 lg:px-14 xl:px-20 py-12 xl:py-0 relative z-10">
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
                Practical{' '}
                <span className="text-[#1F6FEB]">Safety Walkthroughs</span>
                {' '}&amp;{' '}
                <span className="text-[#1F6FEB]">OSHA Documentation Readiness Reviews</span>
                <span className="block mt-3 text-[#CBD5E1] font-semibold text-2xl sm:text-3xl lg:text-4xl">
                  for Manufacturers, Warehouses, Contractors &amp; Fleets in{' '}
                  <span className="inline-flex items-center gap-3 align-middle">
                    <span>North Carolina.</span>
                    <img
                      src="/assets/carolina-built-badge.png"
                      alt="Carolina-Built · Navy Veteran Owned · Kernersville NC"
                      className="inline-block w-[125px] sm:w-32 md:w-40 lg:w-44 xl:w-48 h-auto select-none align-middle"
                      style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
                      loading="eager"
                      data-testid="hero-carolina-badge"
                    />
                  </span>
                </span>
              </h1>

              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-6 max-w-md"
                data-testid="hero-sub"
              >
                On-site walkthroughs, OSHA Documentation Readiness Reviews, and OSHA-focused compliance visits — clear findings, photo-documented reports in 48 hours, no retainer. Based in Kernersville, NC.
              </p>

              <p
                className="text-sm text-[#CBD5E1] leading-relaxed mb-8 max-w-md"
              >
                A single OSHA citation averages $15,625. A GigLine engagement costs a fraction — and gives you a clear picture of where you stand before an inspector shows up.
              </p>

              <div className="flex flex-col items-start gap-3 mb-5" data-testid="hero-ctas">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    to="/intake?service=compliance-readiness-visit"
                    onClick={() => trackEvent('hero_cta_primary', {
                      cta_text: 'Schedule a Compliance Readiness Visit',
                      cta_destination: '/intake?service=compliance-readiness-visit',
                      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
                    })}
                    className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#1F6FEB]/20"
                    data-testid="hero-cta-primary"
                  >
                    Schedule a Compliance Readiness Visit
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/request-walkthrough"
                    onClick={() => trackEvent('hero_cta_secondary', {
                      cta_text: 'Request a Safety Walkthrough',
                      cta_destination: '/request-walkthrough',
                      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
                    })}
                    className="border-2 border-white/25 hover:border-white/55 text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2"
                    data-testid="hero-cta-secondary"
                  >
                    Request a Safety Walkthrough
                  </Link>
                </div>
                <p className="text-base font-semibold text-white leading-relaxed" data-testid="hero-pricing-anchor">
                  Safety Walkthrough from <span className="text-[#1F6FEB]">$850</span>. Compliance Readiness Visit from <span className="text-[#1F6FEB]">$1,500</span>. Start where your operation needs it most.
                </p>
                <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-md" data-testid="hero-pricing-direction">
                  Fixed quote before scheduling. Written report in 48 hours. No retainer.{' '}
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

      {/* ═══════════════════════════════════════════════════════════════
          POST-HERO REBUILD — Reference: giglinehome-fduza8jl.manus.space
          Institutional / restrained. Inter throughout. No gradients,
          no decorative backgrounds, no Unsplash stock photos.
      ═══════════════════════════════════════════════════════════════ */}

      {/* ═══ SECTION 1 — WHAT WE FIND ON THE FLOOR ═══ */}
      <section className="py-20 md:py-24 bg-white border-t border-b" style={{ borderColor: '#E5E7EB' }} data-testid="floor-findings-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#1F6FEB] font-semibold mb-3" style={{ fontSize: '11px' }} data-testid="floor-findings-eyebrow">
              What We Find on the Floor
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-[1.15] mb-3 max-w-3xl">
              The violations most owners don&apos;t see coming.
            </h2>
            <p className="text-base text-[#102133]/70 leading-relaxed mb-12 max-w-3xl">
              These aren&apos;t rare edge cases. These are the violations we find most often in small operations &mdash; the ones most owners don&apos;t know are there until an inspector shows up.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Blocked Egress', badge: 'Instant Citation', img: '/hero-blocked-exit.jpg', caption: 'Cluttered aisle / blocked exit door', body: 'Cited in 22% of general industry inspections. It happens when floor space gets tight, but it is an instant citation if found during an OSHA visit.' },
              { title: 'Electrical Access', badge: 'Automatic Citation', img: '/blocked-electrical-panel.jpg', caption: 'Pallet blocking electrical panel', body: 'Usually a forklift, a pallet, or a trash can. Blocked panels delay emergency shutoff and are automatic citations under OSHA 1910.303.' },
              { title: 'Machine Guarding', badge: 'Top 10 OSHA Violation', img: '/machine-guarding.jpg', caption: 'Exposed belt / press line without guard', body: 'One of OSHA\u2019s top 10 most cited violations. Guards get removed for maintenance and never put back. Missing guards are automatic citations.' },
              { title: 'Emergency Access', badge: 'Citable on First Observation', img: '/blocked-fire-riser.jpg', caption: 'Blocked fire riser / extinguisher', body: 'Blocked fire equipment delays response time and is citable on first observation. It is an easy fix that gets missed in the daily rush.' },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full flex flex-col bg-white" style={{ border: '1px solid #E5E7EB' }} data-testid={`floor-card-${i + 1}`}>
                  {/* Authentic GigLine facility photo */}
                  <img
                    src={c.img}
                    alt={c.caption}
                    loading="lazy"
                    className="w-full"
                    style={{ aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
                  />
                  <div className="p-5 flex-grow flex flex-col">
                    <span
                      className="inline-block self-start uppercase font-bold mb-3"
                      style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#8B2500', border: '1px solid rgba(139,37,0,0.35)', padding: '3px 8px', borderRadius: '2px' }}
                    >
                      {c.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#102133] mb-2">{c.title}</h3>
                    <p className="text-sm text-[#102133]/70 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — WHY GIGLINE ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="why-gigline-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-6" style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#1a6fc4' }}>
              Why GigLine
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0d1b2a] leading-[1.1] mb-12 max-w-4xl tracking-tight">
              The industry sells binders. We walk the floor.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { kicker: 'Training', Icon: BookOpen, title: 'Training gives theory.', body: 'Generic curricula and recycled slides. They check a box, but no one actually walks your floor to see if the training is being applied.' },
              { kicker: 'Software', Icon: Monitor, title: 'Software gives dashboards.', body: 'Dashboards full of inputs and metrics. None of them will flag the pallet sitting in front of your electrical panel right now.' },
              { kicker: 'GigLine', Icon: ShieldCheck, title: 'GigLine gives eyes on the floor.', body: 'Documents without floor context create false confidence. We walk in, find the blind spots, and tell you exactly what is exposed.', featured: true },
              { kicker: 'The Real Problem', Icon: Zap, title: 'Others let AI write their compliance.', body: 'No floor visit. No context. Just a prompt. And when OSHA shows up, they will ask who signed off on it \u2014 and that is still you.', dark: true },
            ].map((c, i) => (
              <Reveal key={c.kicker} delay={i * 80}>
                <div
                  className="h-full p-7 flex flex-col"
                  style={{
                    background: c.dark ? '#0d1b2a' : '#fff',
                    border: c.dark
                      ? '1px solid rgba(255,255,255,0.10)'
                      : c.featured
                        ? '2px solid #1a6fc4'
                        : '1px solid #E5E7EB',
                    borderRadius: '12px',
                  }}
                  data-testid={`why-gigline-card-${i + 1}`}
                >
                  {/* Icon — circular tinted background (not on dark card) */}
                  {c.dark ? (
                    <span
                      className="inline-block self-start uppercase font-bold mb-4"
                      style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#c8922a', border: '1px solid #c8922a', padding: '3px 10px', borderRadius: '4px' }}
                    >
                      {c.kicker}
                    </span>
                  ) : (
                    <div
                      className="mb-5 flex items-center justify-center"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: c.featured ? 'rgba(26,111,196,0.10)' : 'rgba(13,27,42,0.06)',
                      }}
                    >
                      <c.Icon size={20} strokeWidth={1.75} style={{ color: c.featured ? '#1a6fc4' : '#6b7280' }} />
                    </div>
                  )}

                  {c.dark && (
                    <c.Icon size={22} strokeWidth={1.5} style={{ color: '#c8922a', marginBottom: '14px' }} />
                  )}

                  {!c.dark && (
                    <p
                      className="uppercase font-semibold mb-3"
                      style={{ fontSize: '11px', letterSpacing: '0.16em', color: c.featured ? '#1a6fc4' : '#6b7280' }}
                    >
                      {c.kicker}
                    </p>
                  )}

                  <h3
                    className="leading-snug mb-4"
                    style={
                      c.dark
                        ? { color: '#c8922a', fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '18px', fontWeight: 600 }
                        : { color: '#0d1b2a', fontSize: '18px', fontWeight: 700 }
                    }
                  >
                    {c.title}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: c.dark ? '#a09080' : '#6b7280' }}>
                    {c.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Thin divider + signal caption */}
          <Reveal delay={400}>
            <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', marginTop: '56px', paddingTop: '40px' }}>
              <p
                className="text-center uppercase font-bold"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.18em',
                  color: '#0d1b2a',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                data-testid="signal-caption"
              >
                This is not a full audit. It is a signal.
              </p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══ SECTION 3 — TESTIMONIALS + CASE STUDY + TRACK RECORD (combined dark navy) ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#0d1b2a' }} data-testid="trust-section">
        <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* LEFT — What Clients Say */}
          <div data-testid="reviews-column">
            <p className="uppercase font-bold mb-8" style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>What Clients Say</p>
            {[
              { text: 'Most consultants show up with a binder and a checklist. Vince showed up in work boots and asked to see the press line first. Practical guy. Knows the floor. Report came back clear and short \u2014 the way it should.', name: 'David R.', role: 'Plant Manager, Small Manufacturer, Piedmont Triad' },
              { text: 'They don\u2019t just point out issues \u2014 they understand how operations actually run and provide solutions that can be executed on the floor. Where they really stand out is in incident investigations. Their approach is disciplined and focused on true root cause.', name: 'Demar Archie', role: 'Warehouse Receiving Manager' },
            ].map((r, i) => (
              <div key={r.name} className="p-7 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px' }} data-testid={`review-card-${i + 1}`}>
                <p className="mb-6" style={{ fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '17px', lineHeight: 1.6, color: 'rgba(255,255,255,0.92)' }}>&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{r.name} &mdash; <span style={{ fontWeight: 400 }}>{r.role}</span></p>
              </div>
            ))}
          </div>

          {/* MIDDLE — Case Study */}
          <div data-testid="case-study-column">
            <p className="uppercase font-bold mb-8" style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>Case Study</p>
            <div className="p-7" style={{ background: 'rgba(26,111,196,0.06)', border: '1px solid rgba(26,111,196,0.25)', borderRadius: '10px' }}>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-8">How a Plastics Manufacturer Passed OSHA With Zero Citations.</h3>
              {[
                { label: 'Operation Size', value: '~60 Employees', highlight: false },
                { label: 'GigLine Findings', value: '4 Critical Gaps Identified', highlight: false },
                { label: 'OSHA Outcome', value: 'Zero Citations', highlight: true },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center justify-between py-4" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>{s.label}</span>
                  <span className="font-bold text-right" style={{ color: s.highlight ? '#22c55e' : '#fff', fontSize: '15px' }}>{s.value}</span>
                </div>
              ))}
              <Link to="/case-studies/mocksville-plastics-osha-inspection" className="inline-flex items-center gap-2 mt-6 font-semibold" style={{ color: '#1a6fc4' }}>Read the full case study <ArrowRight size={14} /></Link>
            </div>
          </div>

          {/* RIGHT — Track Record */}
          <div data-testid="track-record-column">
            <p className="uppercase font-bold mb-8" style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>The Track Record</p>
            {[
              { Icon: Star, title: '5.0 Google Review Rating', sub: 'Verified client reviews' },
              { Icon: Anchor, title: 'U.S. Navy Veteran Owned', sub: 'Discipline. Accountability. Precision.' },
              { Icon: Factory, title: '25+ Years Operations Leadership', sub: 'Glass, vinyl, manufacturing, distribution' },
              { Icon: MapPin, title: 'Based in Kernersville, NC', sub: 'Serving the Piedmont Triad' },
            ].map((c, i, arr) => (
              <div key={c.title} className="flex items-start gap-4 py-5" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                  <c.Icon size={18} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.65)' }} />
                </div>
                <div>
                  <p className="font-bold text-white mb-1" style={{ fontSize: '15px' }}>{c.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — SERVICES ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#F9F8F6' }} data-testid="services-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#1F6FEB] font-semibold mb-3" style={{ fontSize: '11px' }}>
              Services
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-[1.15] mb-12 max-w-3xl">
              Start where your operation needs it most.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <Reveal>
              <div className="h-full p-7 bg-white flex flex-col" style={{ border: '1px solid #E5E7EB' }} data-testid="home-service-walkthrough">
                <h3 className="text-xl font-bold text-[#102133] mb-3">Safety Walkthrough</h3>
                <p className="text-base text-[#102133]/70 leading-relaxed mb-6 flex-grow">The first step when you need exposure identified quickly. An on-site walkthrough focused purely on physical hazards. You get a photo-documented report and a prioritized fix list in 48 hours.</p>
                <Link to="/request-walkthrough" className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#1558C0] font-semibold underline underline-offset-4 self-start">Request a Walkthrough <ArrowRight size={14} /></Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full p-7 bg-white flex flex-col relative" style={{ border: '2px solid #1F6FEB' }} data-testid="home-service-readiness-visit">
                <span className="absolute -top-3 left-7 px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#1F6FEB', color: '#fff' }}>★ Recommended Starting Point</span>
                <h3 className="text-xl font-bold text-[#102133] mb-3 mt-2">Compliance Readiness Visit</h3>
                <p className="text-base text-[#102133]/70 leading-relaxed mb-6 flex-grow">A deeper pre-inspection engagement. The floor and the files reviewed in a single visit &mdash; physical walkthrough plus a structured review of your written programs, training records, and OSHA logs.</p>
                <Link to="/intake?service=compliance-readiness-visit" className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#1558C0] font-semibold underline underline-offset-4 self-start">Schedule a Visit <ArrowRight size={14} /></Link>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="h-full p-7 bg-white flex flex-col" style={{ border: '1px solid #E5E7EB' }} data-testid="home-service-safety-check">
                <h3 className="text-xl font-bold text-[#102133] mb-3">90-Second Safety Check</h3>
                <p className="text-base text-[#102133]/70 leading-relaxed mb-6 flex-grow">Not sure where you stand? Take our free self-screen. Six yes-or-no questions, an immediate risk score, and no email required to start.</p>
                <Link to="/safety-check" className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#1558C0] font-semibold underline underline-offset-4 self-start">Take the Safety Check <ArrowRight size={14} /></Link>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <Link to="/services" className="inline-flex items-center gap-2 text-[#102133] hover:text-[#1F6FEB] font-semibold underline underline-offset-4">See all service options &amp; pricing <ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 7 — HOW IT WORKS ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="how-it-works-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#1F6FEB] font-semibold mb-3" style={{ fontSize: '11px' }}>
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-[1.15] mb-12 max-w-3xl">
              Simple. Transparent. No surprises.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
            {[
              { n: '1', title: 'Request', body: 'Submit a brief request online. We confirm your location and operation type.' },
              { n: '2', title: 'Schedule', body: 'We provide a fixed quote and schedule around your production calendar.' },
              { n: '3', title: 'Walkthrough', body: 'We walk your floor, document visible hazards, and review physical compliance gaps.' },
              { n: '4', title: 'Report in 48 Hours', body: 'Plain-language, photo-documented report with CFR citations and penalty exposure.' },
              { n: '5', title: 'Fix What Matters First', body: 'RED / AMBER / GREEN priority list. You decide what to fix and when.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="p-6 h-full bg-white" style={{ border: '1px solid #E5E7EB' }} data-testid={`how-step-${s.n}`}>
                  <p className="font-bold mb-3" style={{ color: '#D4A93E', fontSize: '32px', lineHeight: 1 }}>{s.n}</p>
                  <h3 className="text-base font-bold text-[#102133] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#102133]/70 leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link to="/request-walkthrough" className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-6 py-3 transition-colors" data-testid="how-it-works-cta">
              Request a Walkthrough <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8 — ABOUT GIGLINE + BOTTOM CTA ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#F9F8F6' }} data-testid="about-section">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#1F6FEB] font-semibold mb-3" style={{ fontSize: '11px' }}>
              About GigLine
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-[1.15] mb-6">
              Built by someone who&apos;s worked the floor.
            </h2>
          </Reveal>

          <div className="space-y-5 text-base md:text-lg text-[#102133]/85 leading-relaxed mb-8">
            <Reveal><p>I&apos;m Vince Lawrence. Before GigLine, I spent years as a safety coordinator inside glass and vinyl manufacturing &mdash; running Gemba walks across production floors and a shipping department, writing corrective actions, and building compliance systems that had to hold up under real production pressure.</p></Reveal>
            <Reveal>
              <blockquote
                className="my-2"
                style={{
                  borderLeft: '3px solid #c8922a',
                  paddingLeft: '20px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontStyle: 'italic',
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: '#102133',
                  fontSize: '1.15rem',
                  lineHeight: 1.5,
                }}
                data-testid="about-blockquote"
              >
                &ldquo;I didn&rsquo;t learn this by visiting other people&rsquo;s facilities. I learned it from inside an operation like yours.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal><p>GigLine is a private engagement. Nothing leaves your facility except the report I hand you. My job is to give you a clear picture of where you stand before an inspector shows up &mdash; so you can protect your operation, your people, and your position.</p></Reveal>
          </div>

          <Reveal>
            <Link to="/about" className="inline-flex items-center gap-2 text-[#1F6FEB] hover:text-[#1558C0] font-semibold underline underline-offset-4" data-testid="about-link">Read full bio <ArrowRight size={14} /></Link>
          </Reveal>
        </div>

        {/* Bottom dual CTA */}
        <div className="container max-w-4xl mt-20">
          <Reveal>
            <div className="pt-12" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#102133] leading-[1.15] mb-8 max-w-3xl">
                If you&apos;re not sure what&apos;s exposed, start with a walkthrough.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-walkthrough" className="inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-7 py-3.5 transition-colors" data-testid="bottom-cta-primary">
                  Request a Walkthrough <ArrowRight size={16} />
                </Link>
                <Link to="/safety-check" className="inline-flex items-center justify-center gap-2 border-2 border-[#102133] hover:bg-[#102133] hover:text-white text-[#102133] font-bold px-7 py-3.5 transition-colors" data-testid="bottom-cta-secondary">
                  Take the 90-Second Safety Check
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
