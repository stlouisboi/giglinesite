import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Lock } from 'lucide-react';
import { KIT_TIERS } from '../data/citationProofKits';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const PANEL = '#F3ECDB';

/**
 * KitPricingTiers — reusable 3-tier pricing card grid.
 *
 * Props:
 *   kitSlug           — string. Passed into CTA query params so lead-capture
 *                       knows which kit the buyer wanted.
 *   ready             — bool. When false, all tier CTAs route to "Notify me"
 *                       intent instead of "Buy now" intent. Used for kits
 *                       whose products are still being built.
 *   showHeading       — bool. Shows the section heading + kicker.
 *   universalTiers    — bool. When true, does NOT filter the tiers per kit
 *                       (used on catalog overview to show the pricing model
 *                       without tying to one kit).
 */
const KitPricingTiers = ({
  kitSlug = '',
  ready = true,
  showHeading = true,
  universalTiers = false,
  headingOverride = null,
  kickerOverride = null,
  introOverride = null,
}) => {
  const kicker = kickerOverride || (universalTiers ? 'Pricing' : 'Choose Your Tier');
  const heading = headingOverride || (universalTiers ? 'Simple pricing across every kit.' : 'Three ways to run this kit.');
  const intro = introOverride || (universalTiers
    ? 'Every kit in the Citation-Proof Series is offered in three tiers. Buy the level that matches how much of the build you want to do yourself — and how quickly you need the physical binder in the supervisor’s hands.'
    : 'Buy the tier that matches how much of the build you want to run yourself.');

  const buildCtaHref = (tier) => {
    if (universalTiers) {
      return '/citation-proof-kits';
    }
    const base = ready ? '/contact' : '/contact';
    const params = new URLSearchParams({
      kit: kitSlug,
      tier: tier.id,
      price: String(tier.price),
      intent: ready ? 'purchase' : 'notify',
    });
    return `${base}?${params.toString()}`;
  };

  const ctaLabel = (tier) => {
    if (universalTiers) return 'View the Kits';
    if (!ready) return 'Notify Me When Available';
    return tier.ctaLabel;
  };

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: PANEL }}
      data-testid="kit-pricing-tiers"
    >
      <div className="container max-w-6xl mx-auto px-5 md:px-8">
        {showHeading && (
          <div className="mb-12 max-w-3xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              {kicker}
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
              style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
            >
              {heading}
            </h2>
            <p
              className="text-base md:text-[17px] leading-relaxed"
              style={{ color: 'rgba(10,22,40,0.68)', fontFamily: "Georgia, serif" }}
            >
              {intro}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {KIT_TIERS.map((tier) => {
            const isFeatured = tier.badge === 'Most Popular';
            return (
              <div
                key={tier.id}
                className="rounded-md flex flex-col h-full relative"
                style={{
                  background: isFeatured ? NAVY : 'white',
                  color: isFeatured ? 'white' : NAVY,
                  border: isFeatured ? `1px solid ${GOLD}` : '1px solid #e8e5dd',
                  boxShadow: isFeatured ? '0 12px 32px rgba(16,42,67,0.18)' : '0 4px 12px rgba(16,42,67,0.05)',
                }}
                data-testid={`kit-tier-${tier.id}`}
              >
                {isFeatured && (
                  <div
                    className="absolute -top-3 left-6 uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-sm"
                    style={{
                      background: GOLD,
                      color: NAVY,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10.5px',
                    }}
                    data-testid={`kit-tier-${tier.id}-badge`}
                  >
                    {tier.badge}
                  </div>
                )}
                <div className="p-6 md:p-7 flex-1 flex flex-col">
                  <p
                    className="uppercase font-bold tracking-[0.18em] mb-2"
                    style={{
                      color: isFeatured ? GOLD : 'rgba(10,22,40,0.5)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10.5px',
                    }}
                  >
                    Tier {['digital', 'control-system', 'binder'].indexOf(tier.id) + 1}
                  </p>
                  <h3
                    className="font-extrabold text-[22px] md:text-[24px] leading-tight mb-1.5"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className="font-extrabold text-[32px] md:text-[36px] leading-none mb-3"
                    style={{ color: isFeatured ? GOLD : NAVY, fontFamily: "'Manrope', sans-serif" }}
                  >
                    {tier.priceLabel}
                  </p>
                  <p
                    className="text-[14.5px] leading-[1.5] mb-4 italic"
                    style={{
                      color: isFeatured ? 'rgba(255,255,255,0.82)' : 'rgba(10,22,40,0.72)',
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {tier.positioning}
                  </p>
                  <p
                    className="uppercase font-bold tracking-[0.18em] mb-3"
                    style={{
                      color: isFeatured ? GOLD : 'rgba(10,22,40,0.5)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10.5px',
                    }}
                  >
                    Best For
                  </p>
                  <p
                    className="text-[14px] leading-[1.55] mb-5"
                    style={{
                      color: isFeatured ? 'rgba(255,255,255,0.9)' : 'rgba(10,22,40,0.72)',
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {tier.bestFor}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55]">
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          style={{ color: GOLD, flexShrink: 0, marginTop: 3 }}
                        />
                        <span style={{ color: isFeatured ? 'rgba(255,255,255,0.9)' : 'rgba(10,22,40,0.75)' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={buildCtaHref(tier)}
                    className="inline-flex items-center justify-center gap-2 font-bold py-3 px-5 rounded transition-all text-[14px] w-full"
                    style={{
                      background: isFeatured ? GOLD : NAVY,
                      color: isFeatured ? NAVY : 'white',
                      fontFamily: "'Manrope', sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    data-testid={`kit-tier-${tier.id}-cta`}
                  >
                    {!ready && <Lock size={13} />}
                    {ctaLabel(tier)}
                    {ready && <ArrowRight size={14} />}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {universalTiers && (
          <div className="mt-10 text-center">
            <Link
              to="/citation-proof-kits"
              className="inline-flex items-center gap-2 font-bold text-[14px] md:text-[15px] underline hover:no-underline"
              style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
              data-testid="kit-tier-compare-cta"
            >
              Compare Kits
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default KitPricingTiers;
