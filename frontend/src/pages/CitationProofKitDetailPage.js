import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, ShieldCheck, ClipboardList, Lock, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import ProofGapEngineSteps from '../components/ProofGapEngineSteps';
import KitPricingTiers from '../components/KitPricingTiers';
import { KIT_DETAILS, KIT_CATALOG } from '../data/citationProofKits';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const BG_WARM = '#FAF7F1';
const PANEL = '#F3ECDB';
const BORDER = '#e8e5dd';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const sans = { fontFamily: "'Manrope', sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const CitationProofKitDetailPage = () => {
  const { slug } = useParams();
  const kit = KIT_DETAILS[slug];

  if (!kit) {
    return <Navigate to="/citation-proof-kits" replace />;
  }

  return (
    <main data-testid={`kit-detail-page-${slug}`} style={{ backgroundColor: BG_WARM, color: NAVY }}>
      <SEO
        title={`${kit.name} | ${kit.system} | GigLine Safety & Compliance`}
        description={`${kit.outcomeHeadline} ${kit.proofPromise}`}
        canonical={`/citation-proof-kits/${slug}`}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section
        className="px-5 md:px-8 pt-16 md:pt-20 pb-14 md:pb-16"
        data-testid="kit-detail-hero"
        style={kit.productImages?.hero ? { background: NAVY, color: 'white' } : {}}
      >
        <div className={kit.productImages?.hero ? 'max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-14 items-center' : 'max-w-4xl mx-auto'}>
          <div>
          <Link
            to="/citation-proof-kits"
            className="inline-flex items-center gap-2 text-[13px] font-bold mb-6 hover:underline"
            style={{ color: kit.productImages?.hero ? 'rgba(255,255,255,0.6)' : 'rgba(10,22,40,0.62)', ...mono }}
            data-testid="kit-detail-back-link"
          >
            <ArrowLeft size={13} />
            Back to Citation-Proof Kits
          </Link>

          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
            data-testid="kit-detail-kicker"
          >
            {kit.system}
          </p>

          {/* 1. OUTCOME HEADLINE (leads with outcome, not features) */}
          <h1
            className="font-bold leading-[1.1] tracking-tight mb-6 text-[30px] md:text-[40px] lg:text-[46px]"
            style={{ ...sans, color: kit.productImages?.hero ? 'white' : NAVY }}
            data-testid="kit-detail-outcome-headline"
          >
            {kit.outcomeHeadline}
          </h1>

          {/* 1b. HERO SUPPORT LINE — role/outcome framing for conversion */}
          {kit.heroSupportLine && (
            <p
              className="text-[15.5px] md:text-[17px] leading-[1.6] max-w-3xl mb-6"
              style={{
                color: kit.productImages?.hero ? 'rgba(255,255,255,0.82)' : 'rgba(10,22,40,0.78)',
                ...sans,
              }}
              data-testid="kit-detail-hero-support-line"
            >
              {kit.heroSupportLine}
            </p>
          )}

          {/* 2. SHORT PROBLEM STATEMENT */}
          <p
            className="text-[16.5px] md:text-[18.5px] leading-[1.65] max-w-3xl mb-5 italic"
            style={{ color: kit.productImages?.hero ? 'rgba(255,255,255,0.78)' : 'rgba(10,22,40,0.7)', ...serif }}
            data-testid="kit-detail-problem"
          >
            {kit.problemStatement}
          </p>

          {/* 3. PROOF/CONTROL PROMISE */}
          <p
            className="text-[16px] md:text-[17.5px] leading-[1.7] max-w-3xl mb-8"
            style={{ color: kit.productImages?.hero ? 'rgba(255,255,255,0.92)' : NAVY, ...serif }}
            data-testid="kit-detail-proof-promise"
          >
            <strong style={{ ...sans, color: kit.productImages?.hero ? 'white' : NAVY }}>What this kit does:</strong> {kit.proofPromise}
          </p>

          {/* 4. PROPRIETARY TOOL CALLOUT (as mechanism, not product) */}
          <div
            className="rounded-md p-5 md:p-6 mb-10"
            style={{
              background: kit.productImages?.hero ? 'rgba(255,255,255,0.05)' : PANEL,
              border: kit.productImages?.hero ? '1px solid rgba(255,255,255,0.12)' : `1px solid ${BORDER}`,
            }}
            data-testid="kit-detail-tool-callout"
          >
            <p
              className="uppercase font-bold tracking-[0.18em] mb-2"
              style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
            >
              Control Mechanism
            </p>
            <p
              className="font-bold text-[17px] md:text-[19px] leading-snug mb-2"
              style={{ color: kit.productImages?.hero ? 'white' : NAVY, ...sans }}
              data-testid="kit-detail-tool-name"
            >
              {kit.proprietaryToolName}
            </p>
            <p className="text-[14.5px] leading-[1.65]" style={{ color: kit.productImages?.hero ? 'rgba(255,255,255,0.78)' : 'rgba(10,22,40,0.72)', ...serif }}>
              {kit.proprietaryToolDescription}
            </p>
          </div>

          {/* 5. PRICING OPTIONS CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
            {kit.ready ? (
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
                style={{ background: GOLD, color: NAVY, ...sans }}
                data-testid="kit-detail-hero-primary-cta"
              >
                Choose Your {kit.ctaShortName || kit.name} Kit
                <ArrowRight size={14} />
              </a>
            ) : (
              <Link
                to={`/contact?kit=${slug}&intent=notify`}
                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
                style={{ background: GOLD, color: NAVY, ...sans }}
                data-testid="kit-detail-hero-primary-cta"
              >
                <Lock size={13} />
                Notify Me When Available
              </Link>
            )}
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
              style={{
                background: 'transparent',
                color: kit.productImages?.hero ? 'white' : NAVY,
                border: `1px solid ${kit.productImages?.hero ? 'rgba(255,255,255,0.35)' : NAVY}`,
                ...sans,
              }}
              data-testid="kit-detail-hero-secondary-cta"
            >
              Compare the 3 Options
            </a>
          </div>
          </div>

          {/* HERO PRODUCT IMAGE (right column) */}
          {kit.productImages?.hero && (
            <div className="flex items-center justify-center xl:justify-end" data-testid="kit-detail-hero-image">
              <img
                src={kit.productImages.hero}
                alt={`${kit.name} — product mockup`}
                className="w-full h-auto max-w-[720px]"
                style={{ display: 'block' }}
              />
            </div>
          )}
        </div>

        {/* Hero support strip + control flow — full-width below the 2-col */}
        <div className={kit.productImages?.hero ? 'max-w-7xl mx-auto mt-12 md:mt-16' : 'max-w-4xl mx-auto'}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" data-testid="kit-detail-hero-support">
            <HeroSupportCard label="Standard" value={kit.standard} onDark={!!kit.productImages?.hero} />
            <HeroSupportCard label="Score" value={kit.scoreIndexName} onDark={!!kit.productImages?.hero} />
            <HeroSupportCard label="Delivery" value="Digital, Control, or Binder" onDark={!!kit.productImages?.hero} />
            <HeroSupportCard
              label="Status"
              value={kit.ready ? 'Available Now' : 'In Build'}
              accent={kit.ready ? GOLD : (kit.productImages?.hero ? 'rgba(255,255,255,0.5)' : 'rgba(10,22,40,0.5)')}
              onDark={!!kit.productImages?.hero}
            />
          </div>

          {/* Process flow line */}
          {kit.flowLine && (
            <div
              className="mt-10 pt-8 border-t"
              style={{ borderColor: kit.productImages?.hero ? 'rgba(255,255,255,0.12)' : BORDER }}
            >
              <p
                className="uppercase font-bold tracking-[0.18em] mb-4"
                style={{
                  color: kit.productImages?.hero ? 'rgba(255,255,255,0.55)' : 'rgba(10,22,40,0.5)',
                  ...mono,
                  fontSize: '10.5px',
                }}
              >
                The Control Flow
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3" data-testid="kit-detail-flow">
                {kit.flowLine.map((step, i) => (
                  <React.Fragment key={step}>
                    <span
                      className="inline-flex items-center px-3 py-2 rounded"
                      style={{
                        background: kit.productImages?.hero ? 'rgba(255,255,255,0.08)' : 'white',
                        border: kit.productImages?.hero ? '1px solid rgba(255,255,255,0.15)' : `1px solid ${BORDER}`,
                        color: kit.productImages?.hero ? 'white' : NAVY,
                        ...sans,
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {step}
                    </span>
                    {i < kit.flowLine.length - 1 && (
                      <span style={{ color: GOLD, ...mono, fontSize: '14px' }}>&rarr;</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ PROBLEM PANEL (image-driven when provided) ═══════════ */}
      {kit.productImages?.problemPanel && (
        <section
          className="px-5 md:px-8 py-16 md:py-20 border-t"
          style={{ background: '#F5F5F0', borderColor: BORDER }}
          data-testid="kit-detail-problem-panel"
        >
          <div className="max-w-6xl mx-auto">
            <img
              src={kit.productImages.problemPanel}
              alt={kit.productImages.problemPanelAlt || 'What this kit helps you organize'}
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </section>
      )}

      {/* ═══════════ WHAT'S AT STAKE (optional — only if kit provides stakes) ═══════════ */}
      {kit.stakes && (
        <section
          className="px-5 md:px-8 py-16 md:py-20 border-t"
          style={{ background: NAVY, color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}
          data-testid="kit-detail-stakes"
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-10">
              <p
                className="uppercase font-bold tracking-[0.28em] mb-3 inline-flex items-center gap-2"
                style={{ color: GOLD, ...mono, fontSize: '11px' }}
              >
                <AlertTriangle size={13} />
                {kit.stakes.kicker}
              </p>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
                style={{ ...sans, color: 'white' }}
              >
                {kit.stakes.headline}
              </h2>
              <p className="text-[15.5px] md:text-[17px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.78)', ...serif }}>
                {kit.stakes.body}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {kit.stakes.stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-md p-6 md:p-7"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                  data-testid={`kit-detail-stakes-stat-${i}`}
                >
                  <p
                    className="uppercase font-bold tracking-[0.15em] mb-2"
                    style={{ color: GOLD, ...mono, fontSize: '10px' }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-extrabold text-[32px] md:text-[38px] leading-none mb-3"
                    style={{ color: 'white', ...sans }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[13.5px] leading-[1.55]" style={{ color: 'rgba(255,255,255,0.72)', ...serif }}>
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-6 text-[12.5px] italic"
              style={{ color: 'rgba(255,255,255,0.5)', ...serif }}
            >
              {kit.stakes.source}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════ WHAT THIS KIT GETS YOU (outcome-first) ═══════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-white border-t" style={{ borderColor: BORDER }} data-testid="kit-detail-outcomes">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-3xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              What This Kit Gets You
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
              style={{ color: NAVY, ...sans }}
            >
              Four outcomes. Not four downloads.
            </h2>
            <p
              className="text-base md:text-[17px] leading-relaxed"
              style={{ color: 'rgba(10,22,40,0.68)', ...serif }}
            >
              You&rsquo;re not buying a form packet. You&rsquo;re buying a way to know what proof you have, what&rsquo;s missing, what needs fixing, and what to hand over first.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {kit.outcomes.map((o, i) => (
              <div
                key={i}
                className="rounded-md p-6 md:p-7"
                style={{ background: '#FBFBF9', border: `1px solid ${BORDER}` }}
                data-testid={`kit-detail-outcome-${i + 1}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Check size={18} strokeWidth={2.5} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
                  <h3
                    className="font-bold text-[17px] md:text-[18.5px] leading-snug"
                    style={{ color: NAVY, ...sans }}
                  >
                    {o.headline}
                  </h3>
                </div>
                <p className="text-[14.5px] leading-[1.65]" style={{ color: 'rgba(10,22,40,0.7)', ...serif }}>
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT'S INSIDE (image-driven when provided, else fallback to card grid) ═══════════ */}
      {kit.productImages?.whatsInside ? (
        <section
          className="px-5 md:px-8 py-16 md:py-20 border-t"
          style={{ background: '#F5F5F0', borderColor: BORDER }}
          data-testid="kit-detail-whats-inside"
        >
          <div className="max-w-6xl mx-auto">
            <img
              src={kit.productImages.whatsInside}
              alt={`What's inside the ${kit.name} — Citation-Proof Score, Main Builder Tool, Inspector's First 10 Questions, Worked Example, Core Fillable Forms, Regulatory Basis`}
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </section>
      ) : (
        kit.controlMechanisms && kit.controlMechanisms.length > 0 && (
        <section
          className="px-5 md:px-8 py-20 md:py-24 border-t"
          style={{ background: BG_WARM, borderColor: BORDER }}
          data-testid="kit-detail-control-mechanisms"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 max-w-3xl">
              <p
                className="uppercase font-bold tracking-[0.28em] mb-3"
                style={{ color: GOLD, ...mono, fontSize: '11px' }}
              >
                The Control Mechanisms Inside
              </p>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
                style={{ color: NAVY, ...sans }}
              >
                Four tools. Each one does a specific job.
              </h2>
              <p className="text-base md:text-[17px] leading-relaxed" style={{ color: 'rgba(10,22,40,0.68)', ...serif }}>
                You&rsquo;re not buying a folder of forms. You&rsquo;re buying a set of control mechanisms &mdash; each engineered to close a specific proof gap.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {kit.controlMechanisms.map((cm, i) => (
                <div
                  key={i}
                  className="rounded-md p-6 md:p-7"
                  style={{ background: 'white', border: `1px solid ${BORDER}` }}
                  data-testid={`kit-detail-mechanism-${i}`}
                >
                  {/* OUTCOME leads (the point of Vince's rule) */}
                  <p
                    className="font-bold text-[17px] md:text-[18.5px] leading-snug mb-4"
                    style={{ color: NAVY, ...sans, fontFeatureSettings: '"liga" 0, "clig" 0, "dlig" 0' }}
                  >
                    {cm.outcome}
                  </p>
                  <div className="pt-4 border-t" style={{ borderColor: BORDER }}>
                    <p
                      className="uppercase font-bold tracking-[0.15em] mb-1.5"
                      style={{ color: GOLD, ...mono, fontSize: '10px' }}
                    >
                      The Tool That Makes It Possible
                    </p>
                    <p className="text-[15px] font-bold leading-snug mb-1.5" style={{ color: NAVY, ...sans }}>
                      {cm.toolName}
                    </p>
                    <p className="text-[13.5px] leading-[1.55] italic" style={{ color: 'rgba(10,22,40,0.65)', ...serif }}>
                      {cm.toolNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )
      )}

      {/* ═══════════ HOW THE KIT WORKS (4-step framework) ═══════════ */}
      <ProofGapEngineSteps
        kicker="How the Kit Works"
        heading="Score. Sort. Fix. Pull."
        intro="This kit runs on the same four-step control loop as every kit in the Citation-Proof Series. The sequence is what turns forms into a system."
      />

      {/* ═══════════ KEY PROOF (what you\'ll be able to produce) ═══════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" style={{ background: PANEL }} data-testid="kit-detail-key-proof">
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Proof You&rsquo;ll Be Able to Produce
          </p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
            style={{ color: NAVY, ...sans }}
          >
            The records that get handed over first.
          </h2>
          <p
            className="text-base md:text-[17px] leading-relaxed mb-8"
            style={{ color: 'rgba(10,22,40,0.68)', ...serif }}
          >
            When an inspector, insurer, customer, or owner asks, this is what the First-Pull Packet&trade; produces — in order.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kit.keyProof.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-4 rounded-md"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-detail-proof-${i}`}
              >
                <ClipboardList size={16} strokeWidth={2.2} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
                <span className="text-[14.5px] leading-[1.55]" style={{ color: NAVY, ...serif }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════ PHOTO LOCKOUT MAP SPOTLIGHT (image-driven, dark navy full-width) ═══════════ */}
      {kit.productImages?.photoMapSpotlight && (
        <section
          className="px-5 md:px-8 py-12 md:py-16"
          style={{ background: NAVY }}
          data-testid="kit-detail-photo-map-spotlight"
        >
          <div className="max-w-6xl mx-auto">
            <img
              src={kit.productImages.photoMapSpotlight}
              alt={kit.productImages.photoMapSpotlightAlt || 'Proprietary visual proof tool'}
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </section>
      )}

      {/* ═══════════ BUILT FOR ═══════════ */}
      {kit.builtFor && kit.builtFor.length > 0 && (
        <section
          className="px-5 md:px-8 py-14 md:py-18 bg-white border-t"
          style={{ borderColor: BORDER }}
          data-testid="kit-detail-built-for"
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Built For
            </p>
            <h3
              className="text-2xl md:text-3xl font-bold leading-tight mb-10"
              style={{ color: NAVY, ...sans }}
            >
              Who this kit is built for.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {kit.builtFor.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col"
                  data-testid={`kit-detail-built-for-item-${i}`}
                >
                  <div
                    className="inline-flex items-center justify-center rounded-md mb-4"
                    style={{
                      background: PANEL,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Check size={20} strokeWidth={2.5} style={{ color: GOLD }} />
                  </div>
                  <h4
                    className="font-bold text-[16.5px] md:text-[18px] leading-tight mb-2"
                    style={{ color: NAVY, ...sans }}
                  >
                    {item.role}
                  </h4>
                  <p
                    className="text-[14.5px] leading-[1.65]"
                    style={{ color: 'rgba(10,22,40,0.72)', ...serif }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ PRICING TIERS ═══════════ */}
      <div id="pricing">
        <KitPricingTiers kitSlug={slug} ready={kit.ready} />
      </div>

      {/* ═══════════ PREFER WE BUILD IT WITH YOU ═══════════ */}
      {kit.productImages?.physicalMockup ? (
        <section className="px-5 md:px-8 py-16 md:py-20" style={{ background: NAVY, color: 'white' }} data-testid="kit-detail-done-with-you">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <img
                src={kit.productImages.physicalMockup}
                alt={`${kit.name} — physical binder mockup`}
                className="w-full h-auto"
                style={{ display: 'block' }}
              />
            </div>
            <div>
              <p className="uppercase font-bold tracking-[0.28em] mb-3" style={{ color: GOLD, ...mono, fontSize: '11px' }}>
                Prefer We Build It With You?
              </p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: 'white', ...sans }}>
                The Binder Edition isn&rsquo;t just a printed kit.
              </h3>
              <p className="text-[15.5px] md:text-[17px] leading-[1.7] mb-6" style={{ color: 'rgba(255,255,255,0.78)', ...serif }}>
                If you don&rsquo;t want another download sitting on your computer, GigLine will help assemble the binder, organize the First-Pull Packet&trade;, and walk you through setup so the system is running before we leave the call.
              </p>
              <Link
                to={kit.ready ? `/contact?kit=${slug}&tier=binder&price=600&intent=purchase` : `/contact?kit=${slug}&tier=binder&intent=notify`}
                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
                style={{ background: GOLD, color: NAVY, ...sans }}
                data-testid="kit-detail-done-with-you-cta"
              >
                {kit.ready ? 'Choose Binder Edition' : 'Notify Me When Binder Edition Ships'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      ) : (
      <section className="px-5 md:px-8 py-16 md:py-20 bg-white border-t" style={{ borderColor: BORDER }} data-testid="kit-detail-done-with-you">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Prefer We Build It With You?
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold leading-tight mb-4"
            style={{ color: NAVY, ...sans }}
          >
            The Binder Edition isn&rsquo;t just a printed kit.
          </h3>
          <p
            className="text-[15.5px] md:text-[17px] leading-[1.7] mb-6"
            style={{ color: 'rgba(10,22,40,0.72)', ...serif }}
          >
            If you don&rsquo;t want another download sitting on your computer, GigLine will help assemble the binder, organize the First-Pull Packet&trade;, and walk you through setup so the system is running before we leave the call.
          </p>
          <Link
            to={kit.ready ? `/contact?kit=${slug}&tier=binder&price=600&intent=purchase` : `/contact?kit=${slug}&tier=binder&intent=notify`}
            className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
            style={{ background: NAVY, color: 'white', ...sans }}
            data-testid="kit-detail-done-with-you-cta"
          >
            {kit.ready ? 'Choose Binder Edition' : 'Notify Me When Binder Edition Ships'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      )}

      {/* ═══════════ KIT-SPECIFIC FAQ ═══════════ */}
      {kit.faq && kit.faq.length > 0 && (
        <section className="px-5 md:px-8 py-20 md:py-24" style={{ background: BG_WARM }} data-testid="kit-detail-faq">
          <div className="max-w-3xl mx-auto">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Frequently Asked
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-8 tracking-tight"
              style={{ color: NAVY, ...sans }}
            >
              What buyers ask before they order.
            </h2>
            <div className="space-y-5">
              {kit.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-md p-5 md:p-6"
                  style={{ background: 'white', border: `1px solid ${BORDER}` }}
                  data-testid={`kit-detail-faq-item-${i}`}
                >
                  <summary
                    className="cursor-pointer font-bold text-[15.5px] md:text-[16.5px] leading-snug list-none flex items-start gap-3"
                    style={{ color: NAVY, ...sans }}
                  >
                    <span
                      className="inline-block mt-1"
                      style={{ color: GOLD, ...mono, fontSize: '14px', flexShrink: 0 }}
                    >
                      Q.
                    </span>
                    <span>{item.q}</span>
                  </summary>
                  <p
                    className="mt-3 pl-7 text-[14.5px] md:text-[15.5px] leading-[1.7]"
                    style={{ color: 'rgba(10,22,40,0.72)', ...serif }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ COMPLIANCE NOTE ═══════════ */}
      <section className="px-5 md:px-8 py-14 md:py-16 border-t" style={{ background: PANEL, borderColor: BORDER }} data-testid="kit-detail-compliance-note">
        <div className="max-w-3xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: 'rgba(10,22,40,0.5)', ...mono, fontSize: '10.5px' }}
          >
            Important Notice
          </p>
          <p className="text-[14.5px] md:text-[16px] leading-[1.7]" style={{ color: 'rgba(10,22,40,0.72)', ...serif }}>
            This kit is a compliance-readiness tool. It does not guarantee OSHA compliance, prevent citations, or replace a qualified on-site assessment. Only OSHA determines compliance. Every facility, machine, task, and workforce is different.
          </p>
        </div>
      </section>

      {/* ═══════════ RELATED KITS ═══════════ */}
      <section className="px-5 md:px-8 py-16 md:py-20 bg-white border-t" style={{ borderColor: BORDER }} data-testid="kit-detail-related">
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Other Kits in the Series
          </p>
          <h3
            className="text-xl md:text-2xl font-bold leading-tight mb-8"
            style={{ color: NAVY, ...sans }}
          >
            Other proof gaps you might need to close.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KIT_CATALOG.filter((k) => k.slug !== slug).slice(0, 3).map((k) => (
              <Link
                key={k.slug}
                to={`/citation-proof-kits/${k.slug}`}
                className="group block rounded-md p-5 transition-shadow"
                style={{ background: '#FBFBF9', border: `1px solid ${BORDER}` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 24px rgba(16,42,67,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                data-testid={`kit-detail-related-${k.slug}`}
              >
                <p
                  className="uppercase font-bold tracking-[0.18em] mb-2"
                  style={{ color: 'rgba(10,22,40,0.5)', ...mono, fontSize: '10px' }}
                >
                  {k.ready ? 'Available' : 'In Build'}
                </p>
                <h4 className="font-bold text-[15.5px] leading-snug mb-2" style={{ color: NAVY, ...sans }}>
                  {k.name}
                </h4>
                <p className="text-[13.5px] leading-[1.55]" style={{ color: 'rgba(10,22,40,0.65)', ...serif }}>
                  {k.outcome}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 mt-3 font-bold text-[12.5px]"
                  style={{ color: NAVY, ...sans }}
                >
                  View Kit
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const HeroSupportCard = ({ label, value, accent, onDark = false }) => {
  const labelColor = accent || (onDark ? 'rgba(255,255,255,0.55)' : 'rgba(10,22,40,0.5)');
  return (
    <div
      className="rounded-md p-3 md:p-4"
      style={{
        background: onDark ? 'rgba(255,255,255,0.06)' : 'white',
        border: onDark ? '1px solid rgba(255,255,255,0.12)' : `1px solid ${BORDER}`,
      }}
    >
      <p
        className="uppercase font-bold tracking-[0.15em] mb-1"
        style={{ color: labelColor, ...mono, fontSize: '9.5px' }}
      >
        {label}
      </p>
      <p className="text-[12.5px] md:text-[13px] font-bold leading-tight" style={{ color: onDark ? 'white' : NAVY, ...sans }}>
        {value}
      </p>
    </div>
  );
};

export default CitationProofKitDetailPage;
