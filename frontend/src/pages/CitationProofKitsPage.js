import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import SEO from '../components/SEO';
import ProofGapEngineSteps from '../components/ProofGapEngineSteps';
import KitPricingTiers from '../components/KitPricingTiers';
import { KIT_CATALOG } from '../data/citationProofKits';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const BG_WARM = '#FAF7F1';
const PANEL = '#F3ECDB';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const sans = { fontFamily: "'Manrope', sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const TRUST_STRIP = [
  'OSHA-aligned documentation',
  'Built for small facilities',
  'Field-use ready',
  'Digital, control system, and binder options',
];

const CitationProofKitsPage = () => {
  const navigate = useNavigate();
  return (
    <main data-testid="citation-proof-kits-page" style={{ backgroundColor: BG_WARM, color: NAVY }}>
      {/* Card hover states — nested rules that inline style can't reach */}
      <style>{`
        .kit-card:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important;
        }
        .kit-card:hover .kit-card-gold-border {
          height: 6px !important;
        }
        .kit-card:hover .kit-card-cta {
          color: #B8902E !important;
        }
      `}</style>
      <SEO
        title="Citation-Proof Kit Series | GigLine Safety & Compliance"
        description="Five practical compliance-control kits for small manufacturers, warehouses, contractors, and fleet operations. Turn scattered safety activity into inspection-ready proof — before OSHA, an insurer, or a customer asks for it."
        canonical="/citation-proof-kits"
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-14 md:pb-16" data-testid="kits-hero">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-4"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Citation-Proof Kit Series
          </p>
          <h1
            className="font-bold leading-[1.08] tracking-tight mb-6 text-[32px] md:text-[44px] lg:text-[52px]"
            style={{ ...sans, color: NAVY }}
            data-testid="kits-hero-headline"
          >
            Five kits that turn scattered safety activity into inspection-ready proof.
          </h1>
          <p
            className="text-[17px] md:text-[19px] leading-[1.65] max-w-3xl mx-auto mb-6"
            style={{ color: 'rgba(10,22,40,0.72)', ...serif }}
            data-testid="kits-hero-subhead"
          >
            Practical compliance-control kits for small manufacturers, warehouses, contractors, and fleet operations that need inspection-ready proof before OSHA, an insurer, customer, or owner asks for it.
          </p>
          <p
            className="text-[15.5px] md:text-[17px] leading-[1.7] max-w-3xl mx-auto mb-10 italic"
            style={{ color: 'rgba(10,22,40,0.6)', ...serif }}
          >
            Most safety problems do not start with a lack of effort. They start when the work was done, but the proof is missing, weak, outdated, or does not match the floor. GigLine kits help you close that proof gap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href="#kit-grid"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
              style={{ background: NAVY, color: 'white', ...sans }}
              data-testid="kits-hero-primary-cta"
            >
              View the Kits
              <ArrowRight size={14} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
              style={{ background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, ...sans }}
              data-testid="kits-hero-secondary-cta"
            >
              Need help choosing? Contact GigLine
            </Link>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-3xl mx-auto" data-testid="kits-hero-trust-strip">
            {TRUST_STRIP.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 text-[13px] md:text-[14px]"
                style={{ color: 'rgba(10,22,40,0.6)', ...mono }}
              >
                <ShieldCheck size={13} style={{ color: GOLD }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════ PROOF GAP ENGINE ═══════════ */}
      <ProofGapEngineSteps
        kicker="Built on the GigLine Proof Gap Engine™"
        heading="One method. Four steps. Every kit."
        intro="Every kit in the Citation-Proof Series runs on the same four-step method. It doesn’t matter which control area you’re fixing — the sequence is always the same: Score where you stand, Sort every gap by type, Fix in the right order, and Pull the records that get handed over first."
      />

      {/* ═══════════ KIT GRID ═══════════ */}
      <section id="kit-grid" className="px-5 md:px-8 py-20 md:py-24" style={{ background: PANEL }} data-testid="kits-grid-section">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-3xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Choose the Problem You Need to Solve
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
              style={{ color: NAVY, ...sans }}
            >
              Which proof gap is costing you sleep?
            </h2>
            <p
              className="text-base md:text-[17px] leading-relaxed"
              style={{ color: 'rgba(10,22,40,0.68)', ...serif }}
            >
              Each kit targets one specific gap. Start with the one that is actually a problem in your operation — you can add more later.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {KIT_CATALOG.filter((k) => !k.starterVariant).map((kit) => (
              <Link
                key={kit.slug}
                to={kit.externalHref || `/citation-proof-kits/${kit.slug}`}
                className="kit-card group block h-full overflow-hidden transition-all"
                style={{
                  background: 'white',
                  border: kit.starterVariant ? `1px dashed ${GOLD}` : '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                data-testid={`kit-card-${kit.slug}`}
              >
                {/* 1. IMAGE HEADER — 200px desktop / 160px mobile, gold bottom border */}
                <div
                  className="kit-card-image relative overflow-hidden h-[160px] md:h-[200px] flex-shrink-0"
                  style={{ background: NAVY }}
                >
                  {kit.cardImage ? (
                    <img
                      src={kit.cardImage}
                      alt={`${kit.name} — product mockup`}
                      className="w-full h-full"
                      style={{ objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center px-4">
                      <div className="text-center">
                        {(kit.placeholder || [kit.name]).map((line, i) => (
                          <p
                            key={i}
                            style={{
                              color: GOLD,
                              ...sans,
                              fontWeight: 700,
                              fontSize: '20px',
                              lineHeight: 1.2,
                              margin: 0,
                            }}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* $29 STARTER pill — top-left of image, mirrors IN BUILD placement */}
                  {kit.starterVariant && (
                    <span
                      className="absolute uppercase font-bold inline-flex items-center"
                      style={{
                        top: '12px',
                        left: '12px',
                        background: GOLD,
                        color: NAVY,
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        fontFamily: 'Arial, sans-serif',
                      }}
                      data-testid={`kit-card-starter-badge-${kit.slug}`}
                    >
                      $29 Starter
                    </span>
                  )}
                  {/* IN BUILD badge — top-right of image area */}
                  {!kit.ready && (
                    <span
                      className="absolute uppercase font-bold inline-flex items-center gap-1.5"
                      style={{
                        top: '12px',
                        right: '12px',
                        background: NAVY,
                        border: `1px solid ${GOLD}`,
                        color: GOLD,
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        fontFamily: "Arial, sans-serif",
                      }}
                      data-testid={`kit-card-badge-${kit.slug}`}
                    >
                      <Lock size={10} strokeWidth={2.5} />
                      In Build
                    </span>
                  )}
                  {/* Gold bottom border — 4px baseline, grows to 6px on hover */}
                  <div
                    className="kit-card-gold-border absolute left-0 right-0 bottom-0"
                    style={{ height: '4px', background: GOLD, transition: 'height 0.2s ease' }}
                  />
                </div>

                {/* CARD BODY */}
                <div className="flex-1 flex flex-col p-4 md:pt-4 md:px-5 md:pb-5">
                  {/* 2. KIT LABEL */}
                  <p
                    className="uppercase font-bold"
                    style={{
                      color: kit.starterVariant ? GOLD : '#888888',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      margin: 0,
                    }}
                  >
                    {kit.starterVariant ? 'Starter Pack' : 'Kit'}
                  </p>

                  {/* 3. KIT NAME */}
                  <h3
                    style={{
                      color: NAVY,
                      ...sans,
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: 1.3,
                      margin: '4px 0 0',
                    }}
                  >
                    {kit.name}
                  </h3>

                  {/* 4. PRIMARY OUTCOME (bolder, larger — leads the card) */}
                  <p
                    style={{
                      color: NAVY,
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: '15.5px',
                      lineHeight: 1.45,
                      margin: '10px 0 0',
                    }}
                  >
                    {kit.outcome}
                  </p>

                  {/* 5. RISK / PROOF GAP (plain, one sentence, non-italic per new spec) */}
                  <p
                    style={{
                      color: '#555555',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '13.5px',
                      lineHeight: 1.55,
                      margin: '8px 0 0',
                    }}
                  >
                    {kit.problem}
                  </p>

                  {/* Reverse-link to Starter Pack — HazCom Pro Kit only */}
                  {kit.slug === 'hazcom-pro-kit' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate('/hazcom-starter-pack');
                      }}
                      className="text-left"
                      style={{
                        color: '#666666',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        margin: '10px 0 0',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                      data-testid="hazcom-pro-kit-starter-pack-link"
                    >
                      Not ready for $150?{' '}
                      <span style={{ color: GOLD, fontWeight: 700, textDecoration: 'underline' }}>
                        Start with the $29 Starter Pack &rarr;
                      </span>
                    </button>
                  )}

                  {/* Spacer pushes control tool + footer to bottom for equal-height cards */}
                  <div style={{ flex: 1, minHeight: '16px' }} />

                  {/* 6. CONTROL TOOL LABEL */}
                  <p
                    className="uppercase font-bold"
                    style={{
                      color: GOLD,
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      margin: '16px 0 0',
                    }}
                  >
                    {kit.starterVariant ? 'What You Get' : 'Includes'}
                  </p>

                  {/* 7. CONTROL TOOL NAME */}
                  <p
                    style={{
                      color: NAVY,
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      lineHeight: 1.4,
                      margin: '4px 0 20px',
                    }}
                  >
                    {kit.controlTool}
                  </p>

                  {/* 8. BOTTOM ROW — Starting at $X / View Kit → with top border */}
                  <div
                    className="flex items-center justify-between"
                    style={{ borderTop: '1px solid #E0E0E0', paddingTop: '20px' }}
                  >
                    <span
                      style={{
                        color: NAVY,
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '15px',
                      }}
                    >
                      {kit.startingAtLabel}
                    </span>
                    <span
                      className="kit-card-cta inline-flex items-center gap-1"
                      style={{
                        color: GOLD,
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {kit.starterVariant ? 'Get the Starter Pack' : 'View Kit'}
                      <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Starter Pack strip — separated from the 5 full kits per user's direction */}
          {(() => {
            const starter = KIT_CATALOG.find((k) => k.starterVariant);
            if (!starter) return null;
            return (
              <div
                className="mt-14 md:mt-16 rounded-md p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
                style={{
                  background: 'white',
                  border: `1px dashed ${GOLD}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
                data-testid="kit-starter-strip"
              >
                <div className="flex-1">
                  <p
                    className="uppercase font-bold tracking-[0.16em] mb-2"
                    style={{ color: GOLD, fontFamily: 'Arial, sans-serif', fontSize: '11px' }}
                  >
                    Not Ready for the Full HazCom Kit?
                  </p>
                  <h3
                    className="font-bold text-[19px] md:text-[22px] leading-snug mb-2"
                    style={{ color: NAVY, ...sans }}
                  >
                    HazCom Starter Pack &mdash; $29
                  </h3>
                  <p
                    className="text-[14px] md:text-[15px] leading-[1.55]"
                    style={{ color: '#555555', fontFamily: 'Arial, sans-serif' }}
                  >
                    An 11-page entry pack &mdash; written HazCom program, SDS binder checklist, and training verification log. Ramps up to the HazCom Pro Kit when you&rsquo;re ready.
                  </p>
                </div>
                <Link
                  to={starter.externalHref}
                  className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-opacity flex-shrink-0"
                  style={{ background: NAVY, color: 'white', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  data-testid="kit-starter-strip-cta"
                >
                  Get the Starter Pack
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════ UNIVERSAL PRICING OVERVIEW ═══════════ */}
      <KitPricingTiers
        universalTiers
        kickerOverride="Simple Pricing Across Every Kit"
        headingOverride="Three tiers. Same across every kit."
        introOverride="Every kit in the Citation-Proof Series is offered in three tiers. Buy the level that matches how much of the build you want to do yourself — and how quickly you need the physical binder in the supervisor’s hands."
      />

      {/* ═══════════ BUNDLE TEASER ═══════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kits-bundle-teaser">
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Coming Soon
          </p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
            style={{ color: NAVY, ...sans }}
          >
            Need more than one kit?
          </h2>
          <p
            className="text-base md:text-[17px] leading-relaxed mb-8"
            style={{ color: 'rgba(10,22,40,0.68)', ...serif }}
          >
            Once your facility has more than one gap, the better move may be a bundled control stack. GigLine is scoping bundle options for warehouses, machine shops, and full-facility readiness.
          </p>
          <ul className="space-y-2 mb-8" data-testid="kits-bundle-list">
            {[
              { name: 'Starter Compliance Bundle', kits: 'New Hire + HazCom' },
              { name: 'Warehouse Readiness Bundle', kits: 'PIT + HazCom + New Hire' },
              { name: 'Machine Shop Control Bundle', kits: 'LOTO + HazCom + Incident' },
              { name: 'Full GigLine Control Stack', kits: 'All 5 kits' },
            ].map((b) => (
              <li key={b.name} className="flex items-start gap-3 text-[15px] leading-[1.6]">
                <span
                  className="uppercase font-bold tracking-[0.15em] flex-shrink-0 mt-1"
                  style={{ color: GOLD, ...mono, fontSize: '10px' }}
                >
                  &raquo;
                </span>
                <span style={{ color: 'rgba(10,22,40,0.78)', ...serif }}>
                  <strong style={{ color: NAVY, ...sans }}>{b.name}</strong> &mdash; {b.kits}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/contact?intent=bundle"
            className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
            style={{ background: NAVY, color: 'white', ...sans }}
            data-testid="kits-bundle-cta"
          >
            Ask About Bundles
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══════════ CROSS-LINK TO SUPERVISOR OS ═══════════ */}
      <section className="px-5 md:px-8 py-14 md:py-16 border-t" style={{ borderColor: '#e8e5dd', background: 'white' }} data-testid="kits-cross-link-supervisor-os">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Also From GigLine
          </p>
          <h3
            className="text-xl md:text-2xl font-bold leading-tight mb-3"
            style={{ color: NAVY, ...sans }}
          >
            Need a full supervisor-run safety operating system, not a single kit?
          </h3>
          <p
            className="text-[15.5px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-5"
            style={{ color: 'rgba(10,22,40,0.68)', ...serif }}
          >
            The GigLine Supervisor Safety OS is the broader, 17-document system that runs the monthly rhythm — inspect, document, assign, verify, and review — across every hazard area at once.
          </p>
          <Link
            to="/supervisor-kit"
            className="inline-flex items-center gap-2 font-bold text-[14px] underline hover:no-underline"
            style={{ color: NAVY, ...sans }}
            data-testid="kits-cross-link-supervisor-os-cta"
          >
            See the Supervisor Safety OS
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE NOTE ═══════════ */}
      <section className="px-5 md:px-8 py-16 md:py-20" style={{ background: PANEL }} data-testid="kits-compliance-note">
        <div className="max-w-3xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: 'rgba(10,22,40,0.5)', ...mono, fontSize: '10.5px' }}
          >
            Important Notice
          </p>
          <h3
            className="text-xl md:text-2xl font-bold leading-tight mb-4"
            style={{ color: NAVY, ...sans }}
          >
            What GigLine kits are — and what they are not.
          </h3>
          <p className="text-[15px] md:text-[16px] leading-[1.7] mb-4" style={{ color: 'rgba(10,22,40,0.72)', ...serif }}>
            GigLine kits are compliance-readiness tools. They do not guarantee OSHA compliance, prevent citations, or replace a qualified on-site assessment. Only OSHA determines compliance. Every facility, machine, task, and workforce is different.
          </p>
          <p className="text-[15px] md:text-[16px] leading-[1.7]" style={{ color: 'rgba(10,22,40,0.72)', ...serif }}>
            The kits are built to help you organize the proof you already have, surface the proof you’re missing, and give supervisors a running system they can actually use.
          </p>
        </div>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <section className="px-5 md:px-8 py-16 md:py-20" style={{ background: NAVY, color: 'white' }} data-testid="kits-footer-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h3
            className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4"
            style={{ ...sans, color: 'white' }}
          >
            Not sure which kit fits your facility?
          </h3>
          <p className="text-[15.5px] md:text-[17px] leading-[1.7] mb-8" style={{ color: 'rgba(255,255,255,0.78)', ...serif }}>
            Call Vince directly, or drop a line — he’ll help you figure out which proof gap is actually the priority.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:3363298899"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
              style={{ background: GOLD, color: NAVY, ...sans }}
              data-testid="kits-footer-cta-phone"
            >
              Call (336) 329-8899
            </a>
            <a
              href="mailto:vince@giglinecompliance.com"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-all text-[14px]"
              style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', ...sans }}
              data-testid="kits-footer-cta-email"
            >
              vince@giglinecompliance.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CitationProofKitsPage;
