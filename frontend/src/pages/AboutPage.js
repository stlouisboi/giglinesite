import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Play, Lock, FileText, MapPin, Anchor } from 'lucide-react';
import SEO from '../components/SEO';
import FieldManualBand from '../components/FieldManualBand';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* Editor-friendly copy-paste block for press/credentials section */
const PressCopyBlock = ({ label, text, testid }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="mb-7" data-testid={testid}>
      <div className="flex items-center justify-between mb-2.5">
        <p
          className="uppercase font-bold"
          style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#0d1b2a' }}
        >
          {label}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[#1a6fc4]"
          style={{ color: copied ? '#1f6b48' : '#0d1b2a', ...mono }}
          data-testid={`${testid}-copy-btn`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div
        className="p-5 rounded text-[15px] leading-[1.7]"
        style={{
          background: '#F9F8F6',
          border: '1px solid rgba(13,27,42,0.08)',
          color: '#0d1b2a',
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {text}
      </div>
    </div>
  );
};

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
            "sameAs": [
              "https://www.giglinecompliance.com",
              "https://www.giglinecompliance.com/about",
              "https://www.giglinecompliance.com/osha-compliance-guide"
            ],
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
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-3"
              data-testid="about-headline"
            >
              Vince Lawrence
            </h1>
            <p
              className="text-base md:text-lg text-white/55 leading-relaxed max-w-3xl mx-auto"
              data-testid="about-credential-line"
            >
              OSHA 30-Hour Certified safety compliance consultant &mdash; Kernersville, NC
            </p>
          </Reveal>
        </div>

        {/* Founder split */}
        <div className="container max-w-6xl pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* LEFT: founder photo + stats */}
            <Reveal>
              <div
                className="rounded-xl overflow-hidden mb-5"
                style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}
                data-testid="about-founder-photo-wrap"
              >
                <img
                  src="/vince-founder.png"
                  alt="Vince Lawrence — Founder, GigLine Safety & Compliance"
                  className="w-full h-auto block"
                  loading="eager"
                  data-testid="about-founder-photo"
                />
              </div>

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
              <div
                className="text-[15.5px] md:text-base text-white/80 leading-[1.75]"
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

              <p
                className="mt-8 pt-5 text-[13px] md:text-[13.5px]"
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

      {/* ═══ EDITORIAL / PRESS BIO — copy-paste-ready credentials for editors ═══ */}
      <section className="py-16 md:py-20 bg-white" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }} data-testid="about-press-bio-section">
        <div className="container max-w-3xl">
          <Reveal>
            <p
              className="uppercase font-bold mb-3"
              style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.22em', color: '#D4A93E' }}
            >
              For Editors &amp; Publications
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-5 leading-tight tracking-tight"
              style={{ color: '#0d1b2a', fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Credentials &amp; bio — ready to publish.
            </h2>
            <p className="text-base text-[#0d1b2a]/65 mb-9 leading-[1.7]">
              For guest articles, op-eds, podcast bookings, and quoted commentary on OSHA compliance and manufacturing safety. Copy any block below — all text is pre-approved and factually verified.
            </p>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2 mb-10" data-testid="about-credential-pills">
              {[
                'OSHA 30-Hour Certified',
                'U.S. Navy Veteran',
                '25+ years manufacturing operations',
                'Founder, GigLine Safety & Compliance',
                'Kernersville, NC',
              ].map((c) => (
                <span
                  key={c}
                  className="inline-block px-3 py-1.5 rounded uppercase tracking-[0.14em]"
                  style={{
                    ...mono,
                    fontSize: '10.5px',
                    background: 'rgba(13,27,42,0.04)',
                    color: '#0d1b2a',
                    border: '1px solid rgba(13,27,42,0.10)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            <PressCopyBlock
              label="One-Liner (for contributor footnotes)"
              text="Vince Lawrence — Founder, GigLine Safety & Compliance · 25+ years manufacturing operations · OSHA 30-Hour Certified · U.S. Navy Veteran · Kernersville, NC."
              testid="copy-one-liner"
            />
            <PressCopyBlock
              label="Short Bio (~90 words)"
              text="Vince Lawrence is the founder of GigLine Safety & Compliance, an OSHA compliance consultancy based in Kernersville, NC, serving small manufacturers, warehouses, contractors, and fleet operations across the Piedmont Triad. With 25+ years of manufacturing operations experience and OSHA 30-Hour General Industry certification, he walks the floor before the inspector does — finding what most safety programs miss and what most software cannot see. He is a U.S. Navy veteran and the author of 25+ OSHA compliance field notes published at giglinecompliance.com."
              testid="copy-short-bio"
            />
            <PressCopyBlock
              label="Direct Contact (for editor contact lines)"
              text="Vince Lawrence — Founder, GigLine Safety & Compliance — (336) 329-8899 — vince@giglinecompliance.com — Kernersville, NC."
              testid="copy-direct-contact"
            />

            <p className="text-sm text-[#0d1b2a]/55 mt-3 leading-[1.65]">
              For other formats (250-word bio, headshot, expanded credentials, topic pitches), email{' '}
              <a href="mailto:vince@giglinecompliance.com?subject=Press%20Inquiry%20-%20GigLine" className="font-semibold text-[#1a6fc4] hover:text-[#0d1b2a] underline underline-offset-4">
                vince@giglinecompliance.com
              </a>{' '}
              — replies within one business day.
            </p>
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
                to="/intake"
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
