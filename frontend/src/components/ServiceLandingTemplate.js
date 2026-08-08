import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Phone } from 'lucide-react';
import SEO from './SEO';
import FieldManualBand from './FieldManualBand';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/**
 * Shared layout for buyer-intent service landing pages
 *   /safety-walkthrough
 *   /documentation-gap-check
 *   /osha-compliance-gap-check
 *
 * Each page passes its own structured copy. Visual structure stays consistent
 * so the inbound funnel feels like a single coherent product.
 */
const ServiceLandingTemplate = ({
  // SEO
  seoTitle,
  seoDescription,
  canonical,
  // Hero
  eyebrow,
  headline,
  subheadline,
  priceLine,
  heroImage,           // optional: { src, alt } — right-column editorial photo
  // Sections
  whoItsFor,           // { intro, bullets[] }
  theProblem,          // { intro, bullets[] }
  whatIsReviewed,      // { intro, bullets[] }
  whatYouReceive,      // { intro, bullets[] }
  nextSteps,           // { intro, steps[] }
  // Closing
  closingHeadline,
}) => {
  return (
    <main className="overflow-x-hidden bg-white">
      <SEO title={seoTitle} description={seoDescription} canonical={canonical} />

      {/* ── Hero ── */}
      <section
        className="relative py-20 md:py-28"
        style={{ backgroundColor: '#102A43' }}
        data-testid="svc-hero"
      >
        <div className="container max-w-6xl">
          <div className={heroImage ? 'grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center' : ''}>
            <div>
              <p
                className="uppercase tracking-[3px] text-[#CBD5E1] mb-5"
                style={{ ...mono, fontSize: '11px' }}
                data-testid="svc-eyebrow"
              >
                {eyebrow}
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6 max-w-4xl"
                data-testid="svc-headline"
              >
                {headline}
              </h1>
              <p
                className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-8 max-w-2xl"
                data-testid="svc-sub"
              >
                {subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-5" data-testid="svc-hero-ctas">
                <Link
                  to="/intake"
                  className="bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#2A52A0]/20"
                  data-testid="svc-cta-primary"
                >
                  Request a Safety Walkthrough
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/intake"
                  className="border-2 border-white/25 hover:border-white/55 text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2"
                  data-testid="svc-cta-secondary"
                >
                  Start Client Intake
                </Link>
                <a
                  href="tel:+13363298899"
                  className="border-2 border-white/15 hover:border-white/40 text-white font-medium px-6 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2"
                  data-testid="svc-cta-call"
                >
                  <Phone size={16} />
                  (336) 329-8899
                </a>
              </div>
              {priceLine && (
                <p className="text-base text-white/85" data-testid="svc-price-line">
                  {priceLine}
                </p>
              )}
            </div>
            {heroImage && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(201,168,76,0.30)', boxShadow: '0 20px 60px -20px rgba(0,0,0,0.55)' }}
                data-testid="svc-hero-image-wrap"
              >
                <img
                  src={heroImage.src}
                  alt={heroImage.alt}
                  width="1600"
                  height="900"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-auto block"
                  data-testid="svc-hero-image"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <Section
        eyebrow="Who It's For"
        title="Is this the right engagement for your operation?"
        intro={whoItsFor.intro}
        bullets={whoItsFor.bullets}
        bg="#F7F9FC"
        testid="svc-who"
      />

      {/* ── The problem ── */}
      <Section
        eyebrow="The Problem"
        title="What this engagement is built to solve."
        intro={theProblem.intro}
        bullets={theProblem.bullets}
        bg="#FFFFFF"
        testid="svc-problem"
        bulletStyle="dash"
      />

      {/* ── What is reviewed ── */}
      <Section
        eyebrow="What's Reviewed"
        title="Exactly what gets checked during this engagement."
        intro={whatIsReviewed.intro}
        bullets={whatIsReviewed.bullets}
        bg="#F7F9FC"
        testid="svc-reviewed"
      />

      {/* ── What you receive ── */}
      <section className="py-20 md:py-24" style={{ backgroundColor: '#102A43' }} data-testid="svc-deliverables">
        <div className="container max-w-5xl">
          <p
            className="uppercase tracking-[3px] text-[#CBD5E1] mb-4"
            style={{ ...mono, fontSize: '11px' }}
          >
            What You Receive
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6">
            A written deliverable you can act on this week.
          </h2>
          {whatYouReceive.intro && (
            <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed mb-8 max-w-3xl">
              {whatYouReceive.intro}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whatYouReceive.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4" data-testid={`svc-deliverable-${i}`}>
                <Check size={20} className="flex-shrink-0 mt-0.5 text-[#2A52A0]" strokeWidth={2.5} />
                <p className="text-base text-[#CBD5E1] leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Field manual band (lead magnet) ── */}
      <FieldManualBand source={canonical} />

      {/* ── Next steps ── */}
      <section className="py-20 md:py-24 bg-white" data-testid="svc-next-steps">
        <div className="container max-w-5xl">
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-4 font-semibold"
            style={{ ...mono, fontSize: '11px' }}
          >
            Next Steps
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] leading-tight mb-6">
            How to get started.
          </h2>
          {nextSteps.intro && (
            <p className="text-base md:text-lg text-[#1C2B2B]/80 leading-relaxed mb-10 max-w-3xl">
              {nextSteps.intro}
            </p>
          )}
          <div className="space-y-0 border-t border-[#2A52A0]/10">
            {nextSteps.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-5 border-b border-[#2A52A0]/10"
                data-testid={`svc-next-step-${i}`}
              >
                <span
                  className="flex-shrink-0 mt-0.5 text-[#2A52A0] font-semibold"
                  style={{ ...mono, fontSize: '13px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-base md:text-lg font-bold text-[#1C2B2B] mb-1">{step.label}</p>
                  <p className="text-base text-[#1C2B2B]/80 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#000000' }} data-testid="svc-final-cta">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-8" data-testid="svc-closing-headline">
            {closingHeadline}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              to="/intake"
              className="bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#2A52A0]/20"
              data-testid="svc-closing-cta-primary"
            >
              Request a Safety Walkthrough
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/intake"
              className="border-2 border-white/20 hover:border-white/45 text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="svc-closing-cta-secondary"
            >
              Start Client Intake
            </Link>
          </div>
          <p className="text-base text-[#CBD5E1]" style={mono} data-testid="svc-closing-contact">
            Or call Vince directly — (336) 329-8899
          </p>
        </div>
      </section>
    </main>
  );
};

const Section = ({ eyebrow, title, intro, bullets, bg, testid, bulletStyle = 'check' }) => (
  <section className="py-20 md:py-24" style={{ backgroundColor: bg }} data-testid={testid}>
    <div className="container max-w-5xl">
      <p
        className="uppercase tracking-[3px] text-[#2A52A0] mb-4 font-semibold"
        style={{ ...mono, fontSize: '11px' }}
      >
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] leading-tight mb-6">
        {title}
      </h2>
      {intro && (
        <p className="text-base md:text-lg text-[#1C2B2B]/80 leading-relaxed mb-8 max-w-3xl">
          {intro}
        </p>
      )}
      <ul className="space-y-4">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-4" data-testid={`${testid}-bullet-${i}`}>
            {bulletStyle === 'check' ? (
              <Check size={18} className="flex-shrink-0 mt-1 text-[#2A52A0]" strokeWidth={2.5} />
            ) : (
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#102A43] mt-3" aria-hidden="true" />
            )}
            <p className="text-base md:text-lg text-[#1C2B2B]/90 leading-relaxed">{b}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ServiceLandingTemplate;
