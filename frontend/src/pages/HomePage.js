import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, BookOpen, Monitor, FileText, Bot, Zap, ShieldCheck, Star, Anchor, Factory, MapPin, ClipboardList, Shield, CheckCircle2, FileImage, Repeat } from 'lucide-react';
import SEO from '../components/SEO';
import CaseStudyTeaser from '../components/CaseStudyTeaser';
import FieldManualBand from '../components/FieldManualBand';
import WalkthroughDaySection from '../components/WalkthroughDaySection';
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
        style={{ backgroundColor: '#1C2B2B' }}
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
            <div className="hidden xl:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#1C2B2B]" />
            <div className="xl:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1C2B2B] to-transparent" />
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
                    to="/intake?service=safety-walkthrough-report"
                    onClick={() => trackEvent('hero_cta_primary', {
                      cta_text: 'Request a Walkthrough',
                      cta_destination: '/intake?service=safety-walkthrough-report',
                      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
                    })}
                    className="bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#2A52A0]/20"
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
                  <Link to="/services" className="text-[#2A52A0] hover:text-white underline decoration-[#2A52A0]/40 hover:decoration-white transition-colors font-semibold">
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
      <section className="py-20 md:py-24 bg-white border-t border-b" style={{ borderColor: '#dde3ea' }} data-testid="floor-findings-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase tracking-[0.18em] text-[#2A52A0] font-semibold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }} data-testid="floor-findings-eyebrow">
              What We Find on the Floor
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C2B2B] leading-[1.15] mb-4 max-w-3xl">
              Most violations are hiding in plain sight.
            </h2>
            <p className="text-base text-[#1C2B2B]/70 leading-relaxed mb-12 max-w-3xl">
              OSHA doesn&apos;t find things your team missed. They find things your team stopped seeing. Here&apos;s what shows up on almost every walkthrough.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {[
              { num: '01', title: 'Incomplete LOTO Procedures', body: 'Machine-specific written procedures missing or not posted at the point of use. One of the most cited serious violations in manufacturing \u2014 and one of the easiest to correct before an inspection.', image: '/floor-findings/loto-tag.jpg', alt: 'A red lockout/tagout padlock and DANGER DO NOT OPERATE tag signed and dated by a maintenance worker on industrial equipment' },
              { num: '02', title: 'Forklift & PIT Gaps', body: 'Expired operator certifications, missing pre-shift inspection logs, and unmarked pedestrian zones. These show up on nearly every floor we walk.', image: '/floor-findings/forklift-pit.jpg', alt: 'A warehouse aisle with a forklift showing an expired operator certification sticker and a pre-shift inspection station with no forms available' },
              { num: '03', title: 'Hazard Communication Failures', body: 'SDSs not accessible at point of use, unlabeled secondary containers, and training records that don\u2019t match the chemical inventory. OSHA\u2019s most frequently cited standard.', image: '/floor-findings/hazcom-sds.jpg', alt: 'A worker stands puzzled in front of a wall-mounted HazCom training log, chemical inventory list, and empty Safety Data Sheets binder beside a bench of unlabeled spray bottles and chemical containers' },
              { num: '04', title: 'Electrical Hazard Exposures', body: 'Open junction boxes, missing knockouts, and energized equipment without proper guarding. Often overlooked because they\u2019ve been that way for years.', image: '/floor-findings/electrical-junction.jpg', alt: 'An open electrical junction box with exposed wires and missing knockouts, partially blocked by stacked cardboard inventory boxes against a wooden wall' },
              { num: '05', title: 'Blocked or Unmarked Egress', body: 'Exit routes obstructed by inventory, emergency lighting not tested, and exit signs missing or burned out. Simple to fix. Expensive to ignore.', image: '/floor-findings/blocked-egress.jpg', alt: 'A warehouse exit corridor with shrink-wrapped pallets stacked directly in front of an exit door, the exit sign and emergency lighting fixture above the doorway obscured, between tall pallet racking and a yellow guard rail' },
              { num: '06', title: 'Recordkeeping Deficiencies', body: 'OSHA 300 logs not current, 300A summaries not posted during the required February\u2013April window, and incident records that don\u2019t meet the retention standard.', image: '/floor-findings/recordkeeping.jpg', alt: 'A safety coordinator reviewing an OSHA 300 log at a desk stacked with old incident report binders labeled by year and a paper stack marked INCOMPLETE, beneath a Safety Postings corkboard with Job Safety and Health poster and Emergency Action Plan forms' },
            ].map((c, i) => (
              <Reveal key={c.num} delay={i * 70}>
                <div className="flex flex-col" data-testid={`floor-finding-${c.num}`}>
                  {c.image && (
                    <div
                      className="mb-5 overflow-hidden rounded-lg"
                      style={{ aspectRatio: '16 / 10', border: '1px solid #dde3ea' }}
                      data-testid={`floor-finding-image-${c.num}`}
                    >
                      <img
                        src={c.image}
                        alt={c.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width="800"
                        height="500"
                      />
                    </div>
                  )}
                  <span
                    className="font-bold mb-3"
                    style={{ ...mono, fontSize: '13px', letterSpacing: '0.12em', color: '#2A52A0' }}
                  >
                    {c.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#1C2B2B] leading-tight mb-3">{c.title}</h3>
                  <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.65]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-sm text-[#1C2B2B]/55 italic mt-12 max-w-3xl">
              These are findings from real walkthroughs &mdash; not a checklist from a textbook. Every facility is different.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ RECENT ENGAGEMENT — compact proof block (GL-WEB-020) ═══ */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#f5f4f0' }} data-testid="recent-engagement-section">
        <div className="container max-w-5xl">
          <Reveal>
            <div
              className="p-7 md:p-9 rounded-md"
              style={{
                background: '#1C2B2B',
                borderLeft: '4px solid #C9A84C',
                color: 'white',
              }}
              data-testid="recent-engagement-card"
            >
              <p
                className="uppercase font-bold mb-4"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10.5px',
                  letterSpacing: '0.20em',
                  color: '#C9A84C',
                }}
              >
                Recent Engagement
              </p>
              <p className="text-base md:text-lg leading-[1.7] text-white/90 mb-5 max-w-3xl">
                9-person fabrication shop. Statesville, NC. 13 findings across machine guarding, compressed gas storage, and documentation gaps. 12 of 13 corrective actions closed within 4 days of the walkthrough.
              </p>
              <Link
                to="/case-study/metals-fabrication-statesville"
                className="inline-flex items-center gap-2 font-semibold text-[#C9A84C] hover:text-white transition-colors"
                style={{ fontSize: '15px' }}
                data-testid="recent-engagement-cta"
              >
                See what a walkthrough actually finds →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 2 — WHY GIGLINE ═══ */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="why-gigline-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: '#2A52A0' }}>
              Why GigLine
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1C2B2B] leading-[1.1] mb-12 max-w-4xl tracking-tight">
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
                body: 'Vince Lawrence spent years inside manufacturing operations \u2014 glass and vinyl, rubber compounding, metals fabrication. He learned what OSHA looks for by doing Gemba walks, not by reading about them.',
              },
            ].map((c, i) => (
              <Reveal key={c.kicker} delay={i * 90}>
                <div
                  className="h-full p-8 flex flex-col bg-white"
                  style={{
                    border: c.featured ? '2px solid #2A52A0' : '1px solid #dde3ea',
                    borderRadius: '16px',
                    boxShadow: c.featured ? '0 4px 12px -4px rgba(42,82,160,0.15)' : '0 1px 0 rgba(28,43,43,0.02)',
                  }}
                  data-testid={`why-gigline-card-${i + 1}`}
                >
                  <div
                    className="mb-5 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: c.featured ? 'rgba(42,82,160,0.10)' : 'rgba(28,43,43,0.06)',
                    }}
                  >
                    <c.Icon size={22} strokeWidth={1.75} style={{ color: c.featured ? '#2A52A0' : '#6b7280' }} />
                  </div>
                  <p
                    className="uppercase font-semibold mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', color: c.featured ? '#2A52A0' : '#6b7280' }}
                  >
                    {c.kicker}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-[#1C2B2B] leading-snug mb-3">{c.title}</h3>
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
                background: '#1C2B2B',
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
      <section className="py-20 md:py-24 bg-white border-t" style={{ borderColor: '#dde3ea' }} data-testid="cost-of-waiting-section">
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

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-4 max-w-4xl tracking-tight">
              A serious OSHA violation can cost up to $16,550 per citation.
            </h2>
            <p className="text-base md:text-lg text-[#1C2B2B]/70 leading-relaxed mb-12 max-w-3xl">
              That&apos;s per citation. A single inspection can produce multiple citations across multiple standards. The Safety Walkthrough starts at $1,200.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { stat: '$16,550', label: 'Max. OSHA serious violation (2026)' },
              { stat: '$165,514', label: 'Max penalty per willful or repeat violation' },
              { stat: '48 hrs', label: 'Time from walkthrough to written report' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div
                  className="p-7 md:p-8 h-full"
                  style={{
                    background: '#f5f4f0',
                    borderTop: '3px solid #8B2500',
                    borderRadius: '16px',
                  }}
                  data-testid={`cost-stat-${i + 1}`}
                >
                  <p
                    className="font-extrabold mb-3 text-[#1C2B2B] leading-none tracking-tight"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(36px, 5vw, 52px)' }}
                    data-testid={`cost-stat-${i + 1}-value`}
                  >
                    {s.stat}
                  </p>
                  <p className="text-sm md:text-[15px] text-[#1C2B2B]/70 leading-snug">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-base md:text-lg text-[#1C2B2B]/80 leading-[1.75] max-w-4xl">
              OSHA doesn&apos;t announce inspections. They arrive after a complaint, a referral, or a fatality &mdash; or as part of a programmed inspection targeting your industry. By the time they&apos;re on your floor, the window to fix things has closed.{' '}
              <span className="font-semibold text-[#1C2B2B]">The walkthrough is that window.</span>
            </p>
          </Reveal>

          {/* Concrete scenario — anchored to the real Statesville case study */}
          <Reveal>
            <div
              className="mt-10 p-7 md:p-8 max-w-4xl"
              style={{
                background: '#1C2B2B',
                borderLeft: '4px solid #c8922a',
                borderRadius: '12px',
                color: 'white',
              }}
              data-testid="cost-scenario"
            >
              <p
                className="uppercase font-bold mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.22em', color: '#c8922a' }}
              >
                What That Looks Like
              </p>
              <p className="text-[15.5px] md:text-[17px] leading-[1.7] text-white/85" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                A 9-person metals fabrication facility in Statesville. One combined walkthrough and documentation review. <strong className="text-white">13 findings.</strong> Seven carried serious-citation risk in the <strong className="text-white">$7,000 to $15,621 per-finding range</strong> &mdash; one inspection visit could have stacked those into <strong className="text-white">six figures of penalty exposure</strong>. The corrective action plan closed twelve of thirteen findings inside seven days.
              </p>
              <Link
                to="/case-study/metals-fabrication-statesville"
                className="inline-flex items-center gap-1.5 mt-5 font-semibold text-sm transition-colors"
                style={{ color: '#c8922a', fontFamily: "'JetBrains Mono', monospace" }}
                data-testid="cost-scenario-cta"
              >
                Read the engagement &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5 — SERVICES SNAPSHOT (GL-WEB-008) ═══ */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f4f0' }} data-testid="services-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p className="uppercase font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#2A52A0' }}>
              Services
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-4 max-w-3xl tracking-tight">
              Four ways to work with GigLine.
            </h2>
            <p className="text-base md:text-lg text-[#1C2B2B]/70 leading-relaxed mb-12 max-w-3xl">
              Every engagement starts with a conversation. If we&apos;re not the right fit, we&apos;ll tell you.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 mb-12" data-testid="home-services-grid">
            {[
              {
                Icon: ClipboardList,
                title: 'Safety Walkthrough',
                price: 'From $1,200',
                body: 'A documented on-site walkthrough of your facility. Photo evidence, CFR citations, penalty exposure per finding, and a Top 10 Fixes report \u2014 delivered in writing within 48 hours.',
                outcome: 'You leave with: a written report you can hand to a supervisor and a fix list ranked by citation risk.',
                cta: { label: 'Request a Walkthrough', to: '/intake?service=safety-walkthrough-report' },
                testid: 'home-service-walkthrough',
              },
              {
                Icon: Shield,
                title: 'Compliance Readiness Visit',
                price: 'From $2,000',
                body: 'The Safety Walkthrough plus a full Documentation Review in a single visit. We walk the floor and review your written programs, training records, and OSHA logs \u2014 then give you a prioritized corrective action plan.',
                outcome: 'You leave with: a single compliance score covering both floor and files, plus a 30/60/90-day corrective action plan with owners and dates.',
                cta: { label: 'Schedule a Visit', to: '/intake?service=compliance-readiness-visit' },
                featured: true,
                badge: '★ Recommended Starting Point',
                testid: 'home-service-readiness-visit',
              },
              {
                Icon: Repeat,
                title: 'Quarterly Maintenance',
                price: 'From $950/quarter',
                body: 'Keep the system alive between annual walkthroughs. Quarterly documentation review, training record audit, SDS inventory check, corrective action tracker review, and a brief site visit if needed.',
                outcome: 'You leave with: a safety system that stays current and a paper trail of good-faith effort defensible against insurers and customer audits.',
                cta: { label: 'Ask About Quarterly', to: '/intake?service=quarterly-compliance-maintenance' },
                testid: 'home-service-quarterly',
              },
              {
                Icon: CheckCircle2,
                title: 'Safety Check',
                price: 'Free',
                body: 'Not sure where to start? A free 90-second self-assessment covering the six most common OSHA violations in general industry. No contact information required.',
                outcome: 'You leave with: a personalized exposure score and a short list of the gaps most worth checking on your floor.',
                cta: { label: 'Take the Safety Check', to: '/safety-check' },
                testid: 'home-service-safety-check',
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div
                  className="relative h-full bg-white flex flex-col"
                  style={{
                    border: s.featured ? '2px solid #2A52A0' : '1px solid #dde3ea',
                    borderRadius: '16px',
                    padding: s.featured ? '44px 32px 36px' : '36px 32px',
                    boxShadow: s.featured ? '0 4px 12px -4px rgba(31,111,235,0.18)' : '0 1px 0 rgba(28,43,43,0.02)',
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
                        background: '#2A52A0',
                        color: '#fff',
                        fontSize: '10.5px',
                        letterSpacing: '0.14em',
                        padding: '8px 18px',
                        borderRadius: '999px',
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
                      background: s.featured ? 'rgba(31,111,235,0.10)' : 'rgba(28,43,43,0.05)',
                    }}
                  >
                    <s.Icon size={22} strokeWidth={1.75} style={{ color: s.featured ? '#2A52A0' : '#1C2B2B' }} />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#1C2B2B] mb-1 leading-tight">{s.title}</h3>
                  <p
                    className="font-bold mb-4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: s.featured ? '#2A52A0' : '#1C2B2B', letterSpacing: '-0.01em' }}
                    data-testid={`${s.testid}-price`}
                  >
                    {s.price}
                  </p>
                  <p className="text-[14px] text-[#1C2B2B]/65 leading-[1.65] mb-4 flex-grow">{s.body}</p>

                  {s.outcome && (
                    <p
                      className="mb-6 px-3 py-2.5 text-[13px] leading-[1.5] rounded"
                      style={{
                        background: s.featured ? 'rgba(31,111,235,0.06)' : 'rgba(28,43,43,0.035)',
                        borderLeft: `2px solid ${s.featured ? '#2A52A0' : '#c8922a'}`,
                        color: '#1C2B2B',
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontStyle: 'italic',
                      }}
                      data-testid={`${s.testid}-outcome`}
                    >
                      {s.outcome}
                    </p>
                  )}

                  <Link
                    to={s.cta.to}
                    className="inline-flex items-center gap-1.5 text-[#2A52A0] hover:text-[#1F3F80] font-semibold self-start transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    {s.cta.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-sm text-[#1C2B2B]/60 italic mb-8 max-w-3xl text-center mx-auto">
              Incident review, document development, ongoing compliance partnerships, and OSHA-ready control systems are also available.
            </p>
            <div className="flex justify-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 font-semibold transition-colors"
                style={{
                  color: '#2A52A0',
                  border: '1.5px solid #2A52A0',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2A52A0'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2A52A0'; }}
              >
                See full services &amp; pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SAMPLE REPORT CTA BAND — secondary download cross-sell ═══ */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: '#F9F8F6', borderTop: '1px solid rgba(28,43,43,0.08)' }}
        data-testid="home-sample-report-band"
      >
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center justify-between">
            <div>
              <p
                className="uppercase font-bold tracking-[0.22em] mb-2"
                style={{ color: '#2A52A0', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
              >
                Free Sample
              </p>
              <h2
                className="font-bold leading-tight text-[#1C2B2B] mb-2 text-[22px] md:text-[26px]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Want to see what a report looks like before you schedule?
              </h2>
              <p className="text-[15px] md:text-base text-[#1C2B2B]/65 leading-relaxed max-w-2xl">
                Download a redacted compliance report &mdash; findings, CFR citations, penalty exposure, and the prioritized fix list. Real engagement, facility name removed.
              </p>
            </div>
            <Link
              to="/sample-report"
              className="inline-flex items-center justify-center gap-2 bg-[#1C2B2B] hover:bg-[#1c2e44] text-white font-semibold px-6 py-3.5 rounded transition-colors whitespace-nowrap text-sm md:text-base"
              data-testid="home-sample-report-cta"
            >
              Download a Sample Report &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHAT HAPPENS ON THE DAY OF YOUR WALKTHROUGH ═══ */}
      <WalkthroughDaySection variant="crv" surface="light" />

      {/* ═══ SUPERVISOR KIT BAND — single-CTA cross-sell ═══ */}
      <section
        className="py-16 md:py-20"
        style={{
          background: '#0A1628',
          borderTop: '1px solid rgba(197,160,89,0.30)',
          borderBottom: '1px solid rgba(197,160,89,0.30)',
        }}
        data-testid="home-kit-band"
      >
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
            <div>
              <p
                className="uppercase font-bold tracking-[0.28em] mb-3"
                style={{
                  color: '#C5A059',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                }}
                data-testid="home-kit-band-eyebrow"
              >
                Supervisor Safety Starter System
              </p>
              <h2
                className="font-bold leading-tight tracking-tight mb-3 text-[24px] md:text-[30px] lg:text-[34px] text-white"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                data-testid="home-kit-band-headline"
              >
                Need the documentation layer?
              </h2>
              <p
                className="text-[15.5px] md:text-[17px] leading-[1.65] max-w-2xl"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
                data-testid="home-kit-band-body"
              >
                11 CFR-cited documents &mdash; written HazCom program, SDS index, training log, monthly inspection checklist, &ldquo;If OSHA Shows Up&rdquo; protocol. Use it before a walkthrough, or as the foundation after. <strong style={{ color: '#C5A059' }}>$600 digital &middot; $675 physical</strong>. Included free with every Compliance Readiness Visit.
              </p>
            </div>
            <div className="flex-shrink-0 md:text-right">
              <Link
                to="/supervisor-kit"
                className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 transition-all text-[15px] whitespace-nowrap"
                style={{
                  background: '#C5A059',
                  color: '#0A1628',
                  fontFamily: "'Manrope', sans-serif",
                }}
                data-testid="home-kit-band-cta"
              >
                See the Kit &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS + CASE STUDY + TRACK RECORD (relocated per spec — between Services and How It Works) ═══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#1C2B2B' }} data-testid="trust-section">
        <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* LEFT — What Clients Say */}
          <div data-testid="reviews-column">
            <p className="uppercase font-bold mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>What Clients Say</p>
            {[
              { text: 'They don\u2019t just point out issues \u2014 they understand how operations actually run and provide solutions that can be executed on the floor. Where they really stand out is in incident investigations. Their approach is disciplined and focused on true root cause.', name: 'Demar Archie', role: 'Warehouse Receiving Manager' },
              { text: 'Most consultants show up with a binder and a checklist. Vince showed up in work boots and asked to see the press line first. Practical guy. Knows the floor. Report came back clear and short \u2014 the way it should.', name: 'David R.', role: 'Plant Manager, Small Manufacturer, Piedmont Triad' },
            ].map((r, i) => (
              <div key={r.name} className="p-7 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px' }} data-testid={`review-card-${i + 1}`}>
                <p className="mb-6" style={{ fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '17px', lineHeight: 1.6, color: 'rgba(255,255,255,0.92)' }}>&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{r.name} &mdash; <span style={{ fontWeight: 400 }}>{r.role}</span></p>
              </div>
            ))}
          </div>

          {/* MIDDLE — Case Study */}
          <div data-testid="case-study-column">
            <p className="uppercase font-bold mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>Case Study</p>
            <div className="p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px' }}>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-8">What a Safety Walkthrough Actually Finds.</h3>
              {[
                { label: 'Operation Size', value: '9 employees', highlight: false },
                { label: 'GigLine Findings', value: '13 (7 serious · 6 docs)', highlight: false },
                { label: 'Compliance Score', value: '80.3 / 100', highlight: true },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center justify-between py-4" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>{s.label}</span>
                  <span className="font-bold text-right" style={{ color: s.highlight ? '#22c55e' : '#fff', fontSize: '15px' }}>{s.value}</span>
                </div>
              ))}
              <Link to="/case-study/metals-fabrication-statesville" className="inline-flex items-center gap-2 mt-6 font-semibold" style={{ color: '#2A52A0' }}>Read the full case study <ArrowRight size={14} /></Link>
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
            <p className="uppercase font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#2A52A0' }}>
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-14 max-w-3xl tracking-tight">
              Four steps. No surprises.
            </h2>
          </Reveal>

          {(() => {
            const steps = [
              { n: '01', title: 'You reach out.', body: 'Fill out the intake form or call directly. Tell us your facility type, approximate square footage, and what\u2019s on your mind. No commitment required.' },
              { n: '02', title: 'We give you a fixed quote.', body: 'Based on your facility size, complexity, and the scope of the engagement. You\u2019ll have a number before we schedule anything.' },
              { n: '03', title: 'We walk your floor.', body: 'Vince comes to your facility. He walks every area, photographs findings, and documents what he sees against the applicable OSHA standards. Typically 1\u20133 hours on-site depending on facility size and complexity.', boldTail: 'Minimal disruption to production.' },
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
                    background: 'rgba(28,43,43,0.18)',
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
                            background: '#1C2B2B',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.05em',
                            boxShadow: '0 6px 16px -8px rgba(28,43,43,0.5)',
                          }}
                        >
                          {s.n}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-[#1C2B2B] mb-2 leading-snug">{s.title}</h3>
                        <p className="text-[13.5px] text-[#1C2B2B]/65 leading-[1.6] max-w-[230px]">
                          {s.body}
                          {s.boldTail && (
                            <>
                              {' '}
                              <strong className="text-[#1C2B2B] font-semibold">{s.boldTail}</strong>
                            </>
                          )}
                        </p>
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
                to="/intake"
                className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold transition-colors"
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
      <section className="py-16 md:py-24" style={{ backgroundColor: '#1C2B2B' }} data-testid="about-section">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* LEFT — Vince portrait + Carolina-Built veteran badge */}
            <div className="lg:col-span-4">
              <Reveal>
                <div
                  className="overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.04)',
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
                  <div
                    style={{ whiteSpace: 'pre-line' }}
                    data-testid="about-body-copy"
                  >
{`Before I started GigLine, I spent years inside manufacturing.

Not visiting facilities.
Working in them.

Glass and vinyl. Rubber compounding. Metals fabrication.

I was on the floor — supervising crews, coordinating safety, doing Gemba walks, creating safety orientation for new hires, training people on the standards they were expected to follow, and seeing firsthand where safety systems broke down under production pressure.

I know what a facility looks like when safety is managed by whoever had time that week.

I know what happens when near-misses are not tracked. Small warnings get missed, hazards stay in place, and eventually the OSHA 300 log starts telling the story.

I know what it feels like to walk a floor and see things that have been there so long the team stops seeing them.

Sometimes a facility does not need a lecture.
It needs fresh eyes.

That is not a criticism.
That is how it works in a small operation.

You are running production. Solving problems. Covering call-outs. Meeting deadlines. Chasing quality issues. Keeping customers satisfied.

And when the pressure stacks up, safety can quietly become the thing people work around instead of the thing they work through.

Safety becomes the thing you will get to.
OSHA does not wait for you to get to it.

That is why GigLine exists.

I come to your facility, walk the areas that matter, photograph what I find, document the gaps against the applicable safety standards, and put it in writing within 48 hours.

No retainer.
No long-term contract.
No pressure to buy a program you do not need.

One engagement. One written report. Clear findings. Practical next steps.

You decide what to do with it.

And everything I find stays between us.

I'm Vince Lawrence.
This is GigLine Safety & Compliance.`}
                  </div>
                </Reveal>

                <Reveal>
                  <div
                    className="mt-2 p-5 md:p-6"
                    style={{
                      background: 'rgba(200,146,42,0.08)',
                      borderLeft: '3px solid #c8922a',
                      borderRadius: '4px',
                    }}
                    data-testid="about-hr-callout"
                  >
                    <p
                      className="uppercase font-bold mb-2"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10.5px',
                        letterSpacing: '0.22em',
                        color: '#c8922a',
                      }}
                    >
                      For HR &amp; Safety Coordinators
                    </p>
                    <p className="text-[14.5px] md:text-[15.5px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      HR managers and safety coordinators are often the first to hear from OSHA &mdash; and the first to be asked for documentation. GigLine helps you know what&rsquo;s in your files before that call comes.
                    </p>
                  </div>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-5 max-w-3xl tracking-tight">
              Know what&apos;s on your floor before OSHA does.
            </h2>
            <p className="text-base md:text-lg text-[#1C2B2B]/70 leading-relaxed mb-9 max-w-2xl">
              The walkthrough takes a few hours. The report is in your hands in 48. The cost is a fraction of a single citation.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold transition-colors"
                style={{ padding: '15px 30px', borderRadius: '4px', fontSize: '15px', boxShadow: '0 10px 24px -10px rgba(31,111,235,0.55)' }}
                data-testid="bottom-cta-primary"
              >
                Request a Walkthrough <ArrowRight size={16} />
              </Link>
              <p className="text-sm text-[#1C2B2B]/70" data-testid="bottom-cta-secondary-line">
                Questions first? Call or text directly:{' '}
                <a href="tel:3363298899" className="font-semibold text-[#1C2B2B] hover:text-[#2A52A0] transition-colors whitespace-nowrap">
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
