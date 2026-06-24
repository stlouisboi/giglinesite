import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, BookOpen, Monitor, FileText, Bot, Zap, ShieldCheck, Star, Anchor, Factory, MapPin, ClipboardList, Shield, CheckCircle2, FileImage } from 'lucide-react';
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
        title="OSHA Safety Walkthrough — Piedmont Triad NC | GigLine"
        description="Safety becomes the thing you'll get to. OSHA doesn't wait. On-site safety walkthroughs for NC manufacturers and warehouses — fixed quote, written report in 48 hours. (336) 329-8899."
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
          "priceRange": "$950–$12000",
          "openingHours": "Mo-Fr 08:00-18:00",
          "sameAs": [],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Safety Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Safety Walkthrough & Top 10 Fixes Report", "description": "On-site facility walkthrough with written report." }, "price": "1200", "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "OSHA Documentation Readiness Review", "description": "Review of written safety programs and training records." }, "price": "1300", "priceCurrency": "USD" },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Incident Review & Corrective Action Support", "description": "Post-incident documentation and corrective action." }, "price": "1500", "priceCurrency": "USD" }
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
        style={{ backgroundColor: '#0d1b2a' }}
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
            <div className="hidden xl:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0d1b2a]" />
            <div className="xl:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
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
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-5"
                data-testid="hero-headline"
              >
                Find the gaps before OSHA does.
              </h1>

              <div
                className="mb-7 max-w-md"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.005em',
                  color: '#c8922a',
                }}
                data-testid="hero-standout-line"
              >
                <p>Safety becomes the thing you will get to.</p>
                <p>OSHA does not wait for you to get to it.</p>
              </div>

              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-8 max-w-md"
                data-testid="hero-sub"
              >
                On-site safety walkthroughs for manufacturers, warehouses, contractors, and fleet operations across the Piedmont Triad. Fixed quote. Private engagement. Report in 48 hours.
              </p>

              <div className="flex flex-col items-start gap-3 mb-5" data-testid="hero-ctas">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    to="/request-walkthrough"
                    onClick={() => trackEvent('hero_cta_primary', {
                      cta_text: 'Request a Walkthrough',
                      cta_destination: '/request-walkthrough',
                      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
                    })}
                    className="bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#1a6fc4]/20"
                    data-testid="hero-cta-primary"
                  >
                    Request a Walkthrough
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/safety-check"
                    onClick={() => trackEvent('hero_cta_secondary', {
                      cta_text: 'Take the Safety Check',
                      cta_destination: '/safety-check',
                      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
                    })}
                    className="text-white/80 hover:text-white font-semibold text-base underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                    data-testid="hero-cta-secondary"
                  >
                    Take the Safety Check &rarr;
                  </Link>
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-md" data-testid="hero-pricing-direction">
                  Fixed quote before scheduling. Written report in 48 hours. No retainer.{' '}
                  <Link to="/services" className="text-[#1a6fc4] hover:text-white underline decoration-[#1a6fc4]/40 hover:decoration-white transition-colors font-semibold">
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

      {/* ═══ SECTION 2 — WHAT WE FIND ON THE FLOOR (GL-WEB-008) ═══ */}
      <section className="py-20 md:py-24 bg-white border-t border-b" style={{ borderColor: '#E5E7EB' }} data-testid="floor-findings-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#1a6fc4] font-semibold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }} data-testid="floor-findings-eyebrow">
              What We Find on the Floor
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d1b2a] leading-[1.15] mb-4 max-w-3xl">
              Most violations are hiding in plain sight.
            </h2>
            <p className="text-base text-[#0d1b2a]/70 leading-relaxed mb-12 max-w-3xl">
              OSHA doesn&apos;t find things your team missed. They find things your team stopped seeing. Here&apos;s what shows up on almost every walkthrough.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {[
              { num: '01', title: 'Incomplete LOTO Procedures', body: 'Machine-specific written procedures missing or not posted at the point of use. One of the most cited serious violations in manufacturing \u2014 and one of the easiest to correct before an inspection.' },
              { num: '02', title: 'Forklift & PIT Gaps', body: 'Expired operator certifications, missing pre-shift inspection logs, and unmarked pedestrian zones. These show up on nearly every floor we walk.' },
              { num: '03', title: 'Hazard Communication Failures', body: 'SDSs not accessible at point of use, unlabeled secondary containers, and training records that don\u2019t match the chemical inventory. OSHA\u2019s most frequently cited standard.' },
              { num: '04', title: 'Electrical Hazard Exposures', body: 'Open junction boxes, missing knockouts, and energized equipment without proper guarding. Often overlooked because they\u2019ve been that way for years.' },
              { num: '05', title: 'Blocked or Unmarked Egress', body: 'Exit routes obstructed by inventory, emergency lighting not tested, and exit signs missing or burned out. Simple to fix. Expensive to ignore.' },
              { num: '06', title: 'Recordkeeping Deficiencies', body: 'OSHA 300 logs not current, 300A summaries not posted during the required February\u2013April window, and incident records that don\u2019t meet the retention standard.' },
            ].map((c, i) => (
              <Reveal key={c.num} delay={i * 70}>
                <div className="flex flex-col" data-testid={`floor-finding-${c.num}`}>
                  <span
                    className="font-bold mb-3"
                    style={{ ...mono, fontSize: '13px', letterSpacing: '0.12em', color: '#1a6fc4' }}
                  >
                    {c.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#0d1b2a] leading-tight mb-3">{c.title}</h3>
                  <p className="text-[15px] text-[#0d1b2a]/70 leading-[1.65]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-sm text-[#0d1b2a]/55 italic mt-12 max-w-3xl">
              These are findings from real walkthroughs &mdash; not a checklist from a textbook. Every facility is different.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 2 — WHY GIGLINE ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="why-gigline-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: '#1a6fc4' }}>
              Why GigLine
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0d1b2a] leading-[1.1] mb-12 max-w-4xl tracking-tight">
              Not a software tool. Not a template audit. A person who walks your floor.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                kicker: 'Fixed Pricing',
                Icon: ShieldCheck,
                title: 'Fixed Quote. No Surprises.',
                body: 'You know the price before we schedule. No hourly billing, no scope creep, no invoice you weren\u2019t expecting. Every engagement is quoted in advance and held.',
              },
              {
                kicker: 'Confidentiality',
                Icon: Shield,
                title: 'Private by Default.',
                body: 'Your findings stay between us. GigLine does not share, publish, or reference client facility data. What we find on your floor is yours \u2014 not a case study, not a portfolio piece.',
                featured: true,
              },
              {
                kicker: 'Floor Experience',
                Icon: Factory,
                title: 'Built on the Floor, Not in a Classroom.',
                body: 'Vince Lawrence spent years inside manufacturing operations \u2014 glass and vinyl, rubber compounding, and metals fabrication, including time at BF Goodrich and Amero Steel. He learned what OSHA looks for by doing Gemba walks, not by reading about them.',
              },
            ].map((c, i) => (
              <Reveal key={c.kicker} delay={i * 90}>
                <div
                  className="h-full p-7 flex flex-col bg-white"
                  style={{
                    border: c.featured ? '2px solid #1a6fc4' : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: c.featured ? '0 18px 40px -22px rgba(26,111,196,0.32)' : '0 1px 0 rgba(13,27,42,0.02)',
                  }}
                  data-testid={`why-gigline-card-${i + 1}`}
                >
                  <div
                    className="mb-5 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: c.featured ? 'rgba(26,111,196,0.10)' : 'rgba(13,27,42,0.06)',
                    }}
                  >
                    <c.Icon size={22} strokeWidth={1.75} style={{ color: c.featured ? '#1a6fc4' : '#6b7280' }} />
                  </div>
                  <p
                    className="uppercase font-semibold mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', color: c.featured ? '#1a6fc4' : '#6b7280' }}
                  >
                    {c.kicker}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-[#0d1b2a] leading-snug mb-3">{c.title}</h3>
                  <p className="text-[15px] text-[#6b7280] leading-[1.65]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* AI / Template warning block */}
          <Reveal delay={350}>
            <div
              className="mt-12 md:mt-14 p-7 md:p-8"
              style={{
                background: '#0d1b2a',
                borderLeft: '4px solid #c8922a',
                borderRadius: '0 8px 8px 0',
              }}
              data-testid="ai-warning-block"
            >
              <p
                className="uppercase font-bold mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.18em', color: '#c8922a' }}
              >
                The Template Trap
              </p>
              <p className="text-[15px] md:text-base text-white/85 leading-[1.7] max-w-4xl">
                We&apos;re seeing more written programs built with AI and templates &mdash; but without floor context, they create false confidence. A written program can come from a template or ChatGPT. Exposure still shows up on the floor.{' '}
                <span className="text-white font-semibold">This is not a full audit. It is a signal.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══ SECTION 4 — COST OF WAITING (GL-WEB-008) ═══ */}
      <section className="py-20 md:py-24 bg-white border-t" style={{ borderColor: '#E5E7EB' }} data-testid="cost-of-waiting-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#8B2500' }} data-testid="cost-eyebrow">
              The Cost of Waiting
            </p>

            <div
              className="mb-8 max-w-3xl"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(22px, 2.8vw, 32px)',
                lineHeight: 1.35,
                color: '#8B2500',
              }}
              data-testid="cost-standout-line"
            >
              <p>Safety becomes the thing you will get to.</p>
              <p>OSHA does not wait for you to get to it.</p>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-4 max-w-4xl tracking-tight">
              The average OSHA serious violation costs $16,550.
            </h2>
            <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-relaxed mb-12 max-w-3xl">
              That&apos;s per citation. A single inspection can produce multiple citations across multiple standards. The Safety Walkthrough starts at $1,200.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { stat: '$16,550', label: 'Avg. OSHA serious violation (2026)' },
              { stat: '$165,514', label: 'Max penalty per willful or repeat violation' },
              { stat: '48 hrs', label: 'Time from walkthrough to written report' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div
                  className="p-7 md:p-8 h-full"
                  style={{
                    background: '#f5f4f0',
                    borderTop: '3px solid #8B2500',
                    borderRadius: '4px',
                  }}
                  data-testid={`cost-stat-${i + 1}`}
                >
                  <p
                    className="font-extrabold mb-3 text-[#0d1b2a] leading-none tracking-tight"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(36px, 5vw, 52px)' }}
                    data-testid={`cost-stat-${i + 1}-value`}
                  >
                    {s.stat}
                  </p>
                  <p className="text-sm md:text-[15px] text-[#0d1b2a]/70 leading-snug">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-base md:text-lg text-[#0d1b2a]/80 leading-[1.75] max-w-4xl">
              OSHA doesn&apos;t announce inspections. They arrive after a complaint, a referral, or a fatality &mdash; or as part of a programmed inspection targeting your industry. By the time they&apos;re on your floor, the window to fix things has closed.{' '}
              <span className="font-semibold text-[#0d1b2a]">The walkthrough is that window.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5 — SERVICES SNAPSHOT (GL-WEB-008) ═══ */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="services-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#1a6fc4' }}>
              Services
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-4 max-w-3xl tracking-tight">
              Three ways to work with GigLine.
            </h2>
            <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-relaxed mb-12 max-w-3xl">
              Every engagement starts with a conversation. If we&apos;re not the right fit, we&apos;ll tell you.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 mb-12" data-testid="home-services-grid">
            {[
              {
                Icon: ClipboardList,
                title: 'Safety Walkthrough',
                price: 'From $1,200',
                body: 'A documented on-site walkthrough of your facility. Photo evidence, CFR citations, penalty exposure per finding, and a Top 10 Fixes report \u2014 delivered in writing within 48 hours.',
                cta: { label: 'Request a Walkthrough', to: '/request-walkthrough' },
                testid: 'home-service-walkthrough',
              },
              {
                Icon: Shield,
                title: 'Compliance Readiness Visit',
                price: 'From $2,000',
                body: 'The Safety Walkthrough plus a full Documentation Review in a single visit. We walk the floor and review your written programs, training records, and OSHA logs \u2014 then give you a prioritized corrective action plan. Documentation Review booked separately: from $1,300.',
                cta: { label: 'Schedule a Visit', to: '/intake?service=compliance-readiness-visit' },
                featured: true,
                badge: '★ Most Requested',
                testid: 'home-service-readiness-visit',
              },
              {
                Icon: CheckCircle2,
                title: 'Safety Check',
                price: 'Free',
                body: 'Not sure where to start? The Safety Check is a free 90-second self-assessment covering the six most common OSHA violations in general industry. No contact information required.',
                cta: { label: 'Take the Safety Check', to: '/safety-check' },
                testid: 'home-service-safety-check',
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div
                  className="relative h-full bg-white flex flex-col"
                  style={{
                    border: s.featured ? '2px solid #1a6fc4' : '1px solid #E5E7EB',
                    borderRadius: '4px',
                    padding: s.featured ? '44px 32px 36px' : '36px 32px',
                    boxShadow: s.featured ? '0 18px 40px -22px rgba(31,111,235,0.35)' : '0 1px 0 rgba(13,27,42,0.02)',
                  }}
                  data-testid={s.testid}
                >
                  {s.featured && (
                    <span
                      className="absolute uppercase font-bold"
                      style={{
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#1a6fc4',
                        color: '#fff',
                        fontSize: '10.5px',
                        letterSpacing: '0.14em',
                        padding: '8px 18px',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s.badge}
                    </span>
                  )}

                  <div
                    className="mb-7 flex items-center justify-center"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: s.featured ? 'rgba(31,111,235,0.10)' : 'rgba(13,27,42,0.05)',
                    }}
                  >
                    <s.Icon size={22} strokeWidth={1.75} style={{ color: s.featured ? '#1a6fc4' : '#0d1b2a' }} />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#0d1b2a] mb-1 leading-tight">{s.title}</h3>
                  <p
                    className="font-bold mb-4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: s.featured ? '#1a6fc4' : '#0d1b2a', letterSpacing: '-0.01em' }}
                    data-testid={`${s.testid}-price`}
                  >
                    {s.price}
                  </p>
                  <p className="text-[14px] text-[#0d1b2a]/65 leading-[1.65] mb-7 flex-grow">{s.body}</p>

                  <Link
                    to={s.cta.to}
                    className="inline-flex items-center gap-1.5 text-[#1a6fc4] hover:text-[#1560ae] font-semibold self-start transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    {s.cta.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-sm text-[#0d1b2a]/60 italic mb-8 max-w-3xl text-center mx-auto">
              Incident review, document development, ongoing compliance partnerships, and OSHA-ready control systems are also available.
            </p>
            <div className="flex justify-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 font-semibold transition-colors"
                style={{
                  color: '#1a6fc4',
                  border: '1.5px solid #1a6fc4',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1a6fc4'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a6fc4'; }}
              >
                See full services &amp; pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS + CASE STUDY + TRACK RECORD (relocated per spec — between Services and How It Works) ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#0d1b2a' }} data-testid="trust-section">
        <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* LEFT — What Clients Say */}
          <div data-testid="reviews-column">
            <p className="uppercase font-bold mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>What Clients Say</p>
            {[
              { text: 'They don\u2019t just point out issues \u2014 they understand how operations actually run and provide solutions that can be executed on the floor. Where they really stand out is in incident investigations. Their approach is disciplined and focused on true root cause.', name: 'Demar Archie', role: 'Warehouse Receiving Manager' },
              { text: 'Most consultants show up with a binder and a checklist. Vince showed up in work boots and asked to see the press line first. Practical guy. Knows the floor. Report came back clear and short \u2014 the way it should.', name: 'David R.', role: 'Plant Manager, Small Manufacturer, Piedmont Triad' },
            ].map((r, i) => (
              <div key={r.name} className="p-7 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px' }} data-testid={`review-card-${i + 1}`}>
                <p className="mb-6" style={{ fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '17px', lineHeight: 1.6, color: 'rgba(255,255,255,0.92)' }}>&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{r.name} &mdash; <span style={{ fontWeight: 400 }}>{r.role}</span></p>
              </div>
            ))}
          </div>

          {/* MIDDLE — Case Study */}
          <div data-testid="case-study-column">
            <p className="uppercase font-bold mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>Case Study</p>
            <div className="p-7" style={{ background: 'rgba(26,111,196,0.06)', border: '1px solid rgba(26,111,196,0.25)', borderRadius: '10px' }}>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-8">How a Plastics Manufacturer Passed OSHA With Zero Citations.</h3>
              {[
                { label: 'Operation Size', value: '~60 Employees', highlight: false },
                { label: 'GigLine Findings', value: '4 Critical Gaps Identified', highlight: false },
                { label: 'OSHA Outcome', value: 'Zero Citations', highlight: true },
              ].map((s, i) => (
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
            <p className="uppercase font-bold mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>The Track Record</p>
            {[
              { Icon: Star, title: '5.0 Google Review Rating', sub: 'Verified client reviews' },
              { Icon: Anchor, title: 'U.S. Navy Veteran Owned', sub: 'Discipline. Accountability. Precision.' },
              { Icon: Factory, title: '25+ Years Operations Leadership', sub: 'Glass, vinyl, manufacturing, distribution' },
              { Icon: MapPin, title: 'Based in Kernersville, NC', sub: 'Serving the Piedmont Triad' },
            ].map((c, i) => (
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

      {/* ═══ SECTION 6 — HOW IT WORKS (connected horizontal timeline) ═══ */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="how-it-works-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#1a6fc4' }}>
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-14 max-w-3xl tracking-tight">
              Four steps. No surprises.
            </h2>
          </Reveal>

          {(() => {
            const steps = [
              { n: '01', title: 'You reach out.', body: 'Fill out the intake form or call directly. Tell us your facility type, approximate square footage, and what\u2019s on your mind. No commitment required.' },
              { n: '02', title: 'We give you a fixed quote.', body: 'Based on your facility size, complexity, and the scope of the engagement. You\u2019ll have a number before we schedule anything.' },
              { n: '03', title: 'We walk your floor.', body: 'Vince comes to your facility. He walks every area, photographs findings, and documents what he sees against the applicable OSHA standards. Typically 1\u20133 hours on-site depending on facility size and complexity.' },
              { n: '04', title: 'You get a written report in 48 hours.', body: 'Photo documentation, CFR citations, penalty exposure per finding, and a prioritized list of corrective actions. Yours to keep, act on, and share with your team.' },
            ];
            return (
              <div className="relative mb-14" data-testid="how-it-works-timeline">
                {/* Connecting line — desktop only, sits behind the circles */}
                <div
                  className="hidden md:block absolute"
                  style={{
                    top: '24px',
                    left: '10%',
                    right: '10%',
                    height: '1px',
                    background: 'rgba(13,27,42,0.18)',
                    zIndex: 0,
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 relative" style={{ zIndex: 1 }}>
                  {steps.map((s, i) => (
                    <Reveal key={s.n} delay={i * 100}>
                      <div className="flex flex-col items-center text-center" data-testid={`how-step-${s.n}`}>
                        {/* Numbered circle */}
                        <div
                          className="flex items-center justify-center mb-5"
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: '#0d1b2a',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.05em',
                            boxShadow: '0 6px 16px -8px rgba(13,27,42,0.5)',
                          }}
                        >
                          {s.n}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-[#0d1b2a] mb-2 leading-snug">{s.title}</h3>
                        <p className="text-[13.5px] text-[#0d1b2a]/65 leading-[1.6] max-w-[230px]">{s.body}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })()}

          <Reveal>
            <div className="flex justify-center">
              <Link
                to="/request-walkthrough"
                className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold transition-colors"
                style={{ padding: '13px 28px', borderRadius: '4px', fontSize: '14px', boxShadow: '0 10px 24px -10px rgba(31,111,235,0.55)' }}
                data-testid="how-it-works-cta"
              >
                Request a Walkthrough <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8 — ABOUT GIGLINE (dark navy, two-column) ═══ */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#0d1b2a' }} data-testid="about-section">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* LEFT — Vince portrait + Carolina-Built veteran badge */}
            <div className="lg:col-span-4">
              <Reveal>
                <div
                  className="overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  data-testid="about-photo-panel"
                >
                  <img
                    src="/vince-about.png"
                    alt="Vince Lawrence — Founder, GigLine Safety & Compliance"
                    className="w-full h-auto block"
                    style={{ filter: 'brightness(0.95) contrast(1.05)' }}
                    loading="lazy"
                  />
                </div>
                <div className="mt-6 flex items-center gap-4" data-testid="about-carolina-badge-block">
                  <img
                    src="/assets/carolina-built-badge.png"
                    alt="Carolina-Built · Navy Veteran Owned · Kernersville NC"
                    className="select-none flex-shrink-0"
                    style={{
                      width: '72px',
                      height: 'auto',
                      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))',
                    }}
                    loading="lazy"
                  />
                  <p
                    className="uppercase font-semibold leading-snug"
                    style={{
                      fontSize: '10.5px',
                      letterSpacing: '0.14em',
                      color: 'rgba(255,255,255,0.55)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Carolina-Built<br />
                    Navy Veteran Owned<br />
                    Kernersville, NC
                  </p>
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Copy (GL-WEB-008 Section 7 spec) */}
            <div className="lg:col-span-8">
              <Reveal>
                <p
                  className="uppercase font-bold mb-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#c8922a' }}
                  data-testid="about-eyebrow"
                >
                  About Vince
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-[1.15] mb-7 tracking-tight">
                  &ldquo;I didn&rsquo;t learn this by visiting other people&rsquo;s facilities.&rdquo;
                </h2>
              </Reveal>

              <div className="space-y-5 text-[14.5px] md:text-[15.5px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                <Reveal>
                  <p>
                    I spent years inside manufacturing operations before I ever called myself a safety professional. Glass and vinyl. Rubber compounding. Metals fabrication. BF Goodrich. Amero Steel. I was on the floor &mdash; doing Gemba walks, writing LOTO procedures, building programs from scratch because nothing existed yet.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    I know what a facility looks like when safety is managed by whoever had time this week. I know what the OSHA 300 log looks like when nobody&apos;s been tracking near-misses. I know what it feels like to walk a floor and see things that have been that way for so long that nobody sees them anymore.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    GigLine exists because most small and mid-size manufacturers can&apos;t afford a full-time safety manager &mdash; but they can afford to know what&apos;s on their floor before OSHA does. That&apos;s what I do.
                  </p>
                </Reveal>

                <Reveal>
                  <p className="font-semibold text-white" data-testid="about-signature">
                    &mdash; Vince Lawrence, Founder
                  </p>
                </Reveal>

                <Reveal>
                  <p
                    className="text-[13px] md:text-[13.5px] pt-4"
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      borderTop: '1px solid rgba(255,255,255,0.10)',
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1.7,
                    }}
                    data-testid="about-service-area"
                  >
                    Service area: on-site within 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities.
                  </p>
                </Reveal>
              </div>

              <Reveal>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-semibold mt-8 transition-colors hover:opacity-80"
                  style={{ color: '#c8922a', fontSize: '14px' }}
                  data-testid="about-link"
                >
                  Read full bio <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8 — FINAL CTA (GL-WEB-008) ═══ */}
      <section className="py-16 md:py-20 bg-white" data-testid="bottom-cta-section">
        <div className="container max-w-4xl">
          <Reveal>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0d1b2a] leading-[1.15] mb-5 max-w-3xl tracking-tight">
              Know what&apos;s on your floor before OSHA does.
            </h2>
            <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-relaxed mb-9 max-w-2xl">
              The walkthrough takes a few hours. The report is in your hands in 48. The cost is a fraction of a single citation.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/request-walkthrough"
                className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold transition-colors"
                style={{ padding: '15px 30px', borderRadius: '4px', fontSize: '15px', boxShadow: '0 10px 24px -10px rgba(31,111,235,0.55)' }}
                data-testid="bottom-cta-primary"
              >
                Request a Walkthrough <ArrowRight size={16} />
              </Link>
              <p className="text-sm text-[#0d1b2a]/70" data-testid="bottom-cta-secondary-line">
                Questions first? Call or text directly:{' '}
                <a href="tel:3363298899" className="font-semibold text-[#0d1b2a] hover:text-[#1a6fc4] transition-colors whitespace-nowrap">
                  (336) 329-8899
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
