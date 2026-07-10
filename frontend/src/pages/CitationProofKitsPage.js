import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <main data-testid="citation-proof-kits-page" style={{ backgroundColor: BG_WARM, color: NAVY }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {KIT_CATALOG.map((kit) => (
              <Link
                key={kit.slug}
                to={`/citation-proof-kits/${kit.slug}`}
                className="group block rounded-md p-6 md:p-7 h-full transition-shadow"
                style={{
                  background: 'white',
                  border: '1px solid #e8e5dd',
                  boxShadow: '0 4px 12px rgba(16,42,67,0.05)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,42,67,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,42,67,0.05)')}
                data-testid={`kit-card-${kit.slug}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p
                    className="uppercase font-bold tracking-[0.18em]"
                    style={{ color: 'rgba(10,22,40,0.5)', ...mono, fontSize: '10.5px' }}
                  >
                    Kit
                  </p>
                  {!kit.ready && (
                    <span
                      className="inline-flex items-center gap-1.5 uppercase font-bold tracking-[0.15em] px-2 py-1 rounded-sm"
                      style={{ color: NAVY, background: PANEL, ...mono, fontSize: '9.5px' }}
                    >
                      <Lock size={10} strokeWidth={2.5} />
                      In Build
                    </span>
                  )}
                </div>
                <h3
                  className="font-bold text-[19px] md:text-[20px] leading-snug mb-3"
                  style={{ color: NAVY, ...sans }}
                >
                  {kit.name}
                </h3>
                <p
                  className="font-bold text-[15px] leading-[1.5] mb-4"
                  style={{ color: NAVY, ...sans }}
                >
                  {kit.outcome}
                </p>
                <p
                  className="text-[13.5px] leading-[1.6] italic mb-5"
                  style={{ color: 'rgba(10,22,40,0.62)', ...serif }}
                >
                  {kit.problem}
                </p>
                <div className="pt-4 border-t" style={{ borderColor: '#e8e5dd' }}>
                  <p
                    className="uppercase font-bold tracking-[0.15em] mb-1.5"
                    style={{ color: GOLD, ...mono, fontSize: '9.5px' }}
                  >
                    Control Tool
                  </p>
                  <p className="text-[13.5px] leading-[1.5] mb-4" style={{ color: NAVY, ...sans, fontWeight: 600 }}>
                    {kit.controlTool}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold" style={{ color: NAVY, ...sans }}>
                      {kit.startingAtLabel}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 font-bold text-[13px] transition-colors"
                      style={{ color: NAVY, ...sans }}
                    >
                      View Kit
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
