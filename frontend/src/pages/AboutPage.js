import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Play, Lock, FileText, MapPin, Anchor } from 'lucide-react';
import SEO from '../components/SEO';
import FieldManualBand from '../components/FieldManualBand';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* TODO: Replace with real founder video YouTube ID when ready */
const FOUNDER_VIDEO_ID = 'dQw4w9WgXcQ';

/* Intersection-based reveal animation */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-fade-in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-fade ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
};

/* Stats grid used in the founder section */
const STATS = [
  { value: '25+', label: 'Years', sub: 'Safety Leadership' },
  { value: 'OSHA', label: '30-Hour', sub: 'Certified' },
  { value: 'USN', label: 'Veteran', sub: 'U.S. Navy' },
  { value: 'MFG', label: 'Manufacturing', sub: 'Experience' },
  { value: 'WHSE', label: 'Warehousing', sub: 'Operations' },
  { value: 'TRANS', label: 'Transportation', sub: 'Safety' },
];

const HOW_CARDS = [
  {
    Icon: Lock,
    title: 'Private engagement',
    body: 'Nothing leaves your facility except the report I hand you. I don\u2019t share findings with other clients, regulators, or third parties. What happens on your floor stays between us.',
  },
  {
    Icon: FileText,
    title: 'Fixed quote before scheduling',
    body: 'You know the price before I show up. No hourly billing, no scope creep, no surprise invoices. Every engagement is quoted based on your facility size and what you need reviewed.',
  },
  {
    Icon: MapPin,
    title: 'Local and available',
    body: 'I\u2019m based in Kernersville, NC and serve manufacturers and warehouses across Forsyth, Guilford, Davidson, Rowan, and surrounding counties. Most engagements are scheduled within 1\u20132 weeks.',
  },
];

const AboutPage = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <main data-testid="about-page">
      <SEO
        title="Safety Consultant Kernersville NC — Vince Lawrence | GigLine"
        description="25+ years on the floor. OSHA 30-Hour certified. Navy veteran. The same eyes an inspector uses — before they show up. (336) 329-8899."
        canonical="/about"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Vince Lawrence",
            "jobTitle": "Safety Coordinator & Founder",
            "worksFor": {
              "@type": "LocalBusiness",
              "name": "GigLine Safety & Compliance",
              "url": "https://www.giglinecompliance.com",
              "telephone": "+13363298899",
              "address": { "@type": "PostalAddress", "addressLocality": "Kernersville", "addressRegion": "NC", "postalCode": "27107", "addressCountry": "US" }
            },
            "telephone": "+13363298899",
            "email": "vince@giglinecompliance.com",
            "url": "https://www.giglinecompliance.com/about",
            "image": "https://www.giglinecompliance.com/vince-portrait.jpg",
            "description": "Vince Lawrence is a safety consultant with 25+ years of experience in manufacturing, fleet, and warehouse operations. OSHA 30-Hour Certified in General Industry. U.S. Navy veteran. Founder of GigLine Safety & Compliance in Kernersville, NC.",
            "hasCredential": [
              { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "OSHA 30-Hour General Industry Certification" },
              { "@type": "EducationalOccupationalCredential", "credentialCategory": "military service", "name": "U.S. Navy Veteran" }
            ],
            "areaServed": { "@type": "State", "name": "North Carolina" }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.giglinecompliance.com/" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.giglinecompliance.com/about" }
            ]
          }
        ]}
      />

      {/* ═══ HERO + FOUNDER (one continuous dark navy section) ═══ */}
      <section className="bg-[#0d1b2a] text-white" data-testid="about-hero-founder">
        <div className="container max-w-6xl pt-20 md:pt-28 pb-14 md:pb-20 text-center">
          <Reveal>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6"
              data-testid="about-headline"
            >
              Built by someone who&rsquo;s worked the floor.
            </h1>
            <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-3xl mx-auto">
              Not a consultant who learned compliance from a textbook. Someone who spent years inside manufacturing operations &mdash; running Gemba walks, writing corrective actions, and building safety systems that had to hold up under real production pressure.
            </p>
          </Reveal>
        </div>

        {/* Founder split */}
        <div className="container max-w-6xl pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* LEFT: video placeholder + stats */}
            <Reveal>
              {videoOpen ? (
                <div
                  className="rounded-xl overflow-hidden mb-5"
                  style={{
                    background: '#000',
                    border: '1px solid rgba(255,255,255,0.10)',
                    aspectRatio: '16 / 9',
                  }}
                  data-testid="about-video-iframe-wrap"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="GigLine Founder Introduction — Vince Lawrence"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    data-testid="about-video-iframe"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="w-full rounded-xl p-7 md:p-9 mb-5 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 group cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  data-testid="about-video-card"
                  aria-label="Play founder introduction video"
                >
                  <div
                    className="flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(31,111,235,0.18)',
                      border: '1px solid rgba(31,111,235,0.40)',
                    }}
                  >
                    <Play size={22} strokeWidth={2} className="text-[#1a6fc4]" style={{ marginLeft: '3px' }} fill="#1a6fc4" />
                  </div>
                  <p className="font-bold text-white text-lg mb-2">Founder Introduction</p>
                  <p className="text-sm text-white/55 leading-relaxed max-w-xs">
                    60&ndash;90 second video &mdash; Vince speaking directly to plant managers and operations owners.
                  </p>
                  <p className="text-[11px] text-[#1a6fc4] mt-4 font-bold uppercase" style={{ ...mono, letterSpacing: '0.12em' }}>
                    Click to play &rarr;
                  </p>
                </button>
              )}

              <div className="grid grid-cols-3 gap-3" data-testid="about-stats-grid">
                {STATS.map((s, i) => (
                  <Reveal key={s.value} delay={i * 60}>
                    <div
                      className="rounded-xl py-4 px-3 text-center h-full flex flex-col items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}
                      data-testid={`about-stat-${i + 1}`}
                    >
                      <p
                        className="font-extrabold text-[#D4A93E] leading-none tracking-tight"
                        style={{ ...mono, fontSize: 'clamp(20px, 2vw, 24px)' }}
                      >
                        {s.value}
                      </p>
                      <p className="text-[11px] font-bold text-white mt-1.5 uppercase" style={{ letterSpacing: '0.06em' }}>
                        {s.label}
                      </p>
                      <p className="text-[10.5px] text-white/55 mt-0.5 leading-tight">{s.sub}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* RIGHT: I'm Vince Lawrence */}
            <Reveal delay={120}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-5 tracking-tight">
                I&rsquo;m Vince Lawrence.
              </h2>
              <div className="space-y-5 text-[15.5px] md:text-base text-white/80 leading-[1.75]">
                <p>
                  Before GigLine, I spent years as a safety coordinator inside glass and vinyl manufacturing &mdash; running Gemba walks across production floors and a shipping department, writing corrective actions, and building compliance systems that had to hold up under real production pressure.
                </p>

                <blockquote
                  className="pl-5 my-7"
                  style={{ borderLeft: '3px solid #D4A93E' }}
                  data-testid="about-quote"
                >
                  <p
                    className="text-white font-semibold text-[17px] md:text-[18px] leading-snug"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
                  >
                    &ldquo;I didn&rsquo;t learn this by visiting other people&rsquo;s facilities. I learned it from inside an operation like yours.&rdquo;
                  </p>
                </blockquote>

                <p>
                  That experience is what GigLine is built on. I know what inspectors look for because I&rsquo;ve spent years on the same floors they inspect &mdash; not as an outside observer, but as someone responsible for keeping those floors running safely.
                </p>

                <p>
                  I started GigLine because small and mid-size manufacturers in the Piedmont Triad don&rsquo;t have the budget for a full-time safety director, but they carry the same OSHA exposure as operations ten times their size. A single serious citation can cost more than $16,550. A missed lockout/tagout program or an unguarded shear point doesn&rsquo;t care how many employees you have.
                </p>

                <p>
                  GigLine fills that gap. I walk your floor, review your documents, and hand you a prioritized report &mdash; within 48 hours &mdash; that tells you exactly where you stand and what to fix first.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ WHY "GIGLINE"? ═══ */}
      <section className="py-20 md:py-28" style={{ background: '#f5f4f0' }} data-testid="about-name-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              The Name
            </p>
            <h2 className="text-3xl md:text-[36px] font-extrabold text-[#0d1b2a] leading-[1.15] mb-3 tracking-tight">
              Why &ldquo;GigLine&rdquo;?
            </h2>
            <p className="text-[15px] text-[#0d1b2a]/65 mb-2" style={{ borderBottom: '2px solid #D4A93E', display: 'inline-block', paddingBottom: '8px' }}>
              It&rsquo;s a small detail. But it explains everything.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="rounded-xl bg-white p-7 md:p-9 mt-8 space-y-3 text-[15px] text-[#0d1b2a]/80 leading-[1.75]"
              style={{ border: '1px solid #dde3ea' }}
              data-testid="about-gigline-def"
            >
              <p>
                In the military, your <strong className="text-[#0d1b2a]">gig line</strong> is the straight line formed by your shirt, your belt buckle, and your trouser fly.
              </p>
              <p>If it is off &mdash; even slightly &mdash; you are out of standard.</p>
              <p>
                It is a small detail. But it represents something larger: attention to alignment, discipline in execution, and the understanding that inspectors notice what others ignore.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <blockquote
              className="pl-5 mt-10"
              style={{ borderLeft: '3px solid #D4A93E' }}
              data-testid="about-name-quote"
            >
              <p
                className="text-[#0d1b2a] font-semibold text-[17px] md:text-[18px] leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
              >
                &ldquo;GigLine applies that same standard to safety and compliance. Not broad advice. Not general guidance. Alignment.&rdquo;
              </p>
            </blockquote>
            <p className="text-[15px] text-[#0d1b2a]/70 mt-5 leading-relaxed">
              Because in most operations, the problem isn&rsquo;t effort. It&rsquo;s misalignment. And misalignment is what gets found.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FIELD MANUAL LEAD MAGNET (kept) ═══ */}
      <FieldManualBand source="about" />

      {/* ═══ PRIVATE. SCOPED. DELIVERED. ═══ */}
      <section className="py-20 md:py-28" style={{ background: '#f5f4f0' }} data-testid="about-how-section">
        <div className="container max-w-6xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              How GigLine Works
            </p>
            <h2 className="text-3xl md:text-[36px] font-extrabold text-[#0d1b2a] leading-[1.15] mb-10 tracking-tight">
              Private. Scoped. Delivered.
              <span className="block w-12 h-[3px] bg-[#D4A93E] mt-3" />
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_CARDS.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={120 + i * 80}>
                <div
                  className="bg-white rounded-xl p-7 h-full transition-all duration-300 hover:-translate-y-0.5"
                  style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(13,27,42,0.02)' }}
                  data-testid={`about-how-card-${i + 1}`}
                >
                  <div
                    className="flex items-center justify-center mb-5"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(26,111,196,0.10)',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.9} className="text-[#1a6fc4]" />
                  </div>
                  <h3 className="text-[15.5px] font-bold text-[#0d1b2a] mb-3">{title}</h3>
                  <p className="text-[14px] text-[#0d1b2a]/70 leading-[1.65]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY GIGLINE EXISTS ═══ */}
      <section className="py-20 md:py-28 bg-white" data-testid="about-exists-section">
        <div className="container max-w-4xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              Why GigLine Exists
            </p>
            <h2 className="text-3xl md:text-[36px] font-extrabold text-[#0d1b2a] leading-[1.15] mb-8 max-w-3xl tracking-tight">
              Most small operations don&rsquo;t have a safety director. They have you.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-5 text-[15.5px] md:text-base text-[#0d1b2a]/75 leading-[1.75]">
              <p>
                A plant manager at a 30-person fabrication shop is responsible for production, quality, HR, and safety &mdash; simultaneously. There&rsquo;s no budget for a full-time safety coordinator. There&rsquo;s no time to read 29 CFR 1910 cover to cover. And there&rsquo;s no one to call when an inspector shows up.
              </p>
              <p>
                Generic training courses teach concepts. Software platforms track inputs. Neither one walks your floor, looks at the pallet blocking your electrical panel, or notices the unlabeled spray bottle next to the grinder.
              </p>
              <p>
                GigLine exists to give small and mid-size operations the same floor-level safety intelligence that larger companies pay a full-time coordinator to provide &mdash; without the retainer, without the overhead, and without the generic checklist.
              </p>
              <p className="font-semibold text-[#0d1b2a]">
                One visit. One report. A clear picture of where you stand and what to fix first.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ U.S. NAVY VETERAN BAND ═══ */}
      <section className="py-14 md:py-16 bg-[#0d1b2a]" data-testid="about-navy-band">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="flex items-start gap-5 md:gap-6">
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(26,111,196,0.20)',
                  border: '1px solid rgba(26,111,196,0.40)',
                }}
              >
                <Anchor size={22} strokeWidth={1.9} className="text-[#1a6fc4]" />
              </div>
              <div className="flex-1">
                <p
                  className="uppercase font-bold mb-3"
                  style={{ ...mono, fontSize: '10.4px', letterSpacing: '2.08px', color: '#1a6fc4' }}
                >
                  U.S. Navy Veteran
                </p>
                <p className="text-[15px] md:text-base text-white/85 leading-[1.75]">
                  I served in the U.S. Navy before moving into manufacturing safety. The discipline, the attention to detail, and the understanding that procedures exist to protect people &mdash; not to fill binders &mdash; came from that experience. It&rsquo;s the same standard I bring to every engagement.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ READY TO GET STARTED CTA ═══ */}
      <section className="py-20 md:py-24" style={{ background: '#f5f4f0' }} data-testid="about-cta-section">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10.4px', fontWeight: 700, letterSpacing: '2.08px', color: '#1a6fc4' }}
            >
              Ready to get started?
            </p>
            <h2 className="text-3xl md:text-[36px] font-extrabold text-[#0d1b2a] leading-[1.15] mb-5 tracking-tight">
              If you&rsquo;re not sure what&rsquo;s exposed, start with a walkthrough.
            </h2>
            <p className="text-base md:text-lg text-[#0d1b2a]/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              Every engagement is scoped to your operation, priced before scheduling, and delivered with a written report. No retainer. No ongoing obligation unless you want one.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/request-walkthrough"
                className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg shadow-[#1a6fc4]/15"
                data-testid="about-cta-walkthrough"
              >
                Request a Walkthrough
                <ArrowRight size={18} />
              </Link>
              <a
                href="tel:3363298899"
                className="inline-flex items-center gap-2 bg-white border-2 border-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white text-[#0d1b2a] font-bold px-8 py-4 rounded-lg text-base transition-colors"
                data-testid="about-cta-phone"
              >
                <Phone size={16} />
                (336) 329-8899
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
