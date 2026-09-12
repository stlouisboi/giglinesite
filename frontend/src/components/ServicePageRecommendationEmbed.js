/**
 * ServicePageRecommendationEmbed, Phase 2 Batch 2B (Feb 2026).
 *
 * Compact "Is this the right starting point?" embed that renders on each of
 * the three assessment service pages. Seeds the shared RecommendationRouter
 * with Path B so the buyer answers only "Where is the greatest gap?" and
 * sees the result inline. Gated behind RECOMMENDATION_ROUTER_ENABLED.
 */
import React from 'react';
import RecommendationRouter from './RecommendationRouter';
import { RECOMMENDATION_ROUTER_ENABLED } from '../config/features';

const NAVY = '#102A43';
const GOLD = '#C9A84C';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const ServicePageRecommendationEmbed = ({ source, referringRoute }) => {
  if (!RECOMMENDATION_ROUTER_ENABLED) return null;
  return (
    <section
      className="py-14 md:py-20"
      style={{ background: '#FAF7F1' }}
      data-testid={`service-embed-${source}`}
    >
      <div className="container max-w-3xl px-5 md:px-8">
        <p
          className="uppercase font-bold tracking-[0.24em] mb-3"
          style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
        >
          Decision support
        </p>
        <h3
          className="font-bold leading-tight mb-4 text-[24px] md:text-[30px] tracking-tight"
          style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
          data-testid={`service-embed-heading-${source}`}
        >
          Is this the right starting point for you?
        </h3>
        <p className="text-[15.5px] md:text-[17px] leading-[1.7] max-w-2xl mb-6" style={{ color: 'rgba(10,22,40,0.65)' }}>
          One short question. GigLine confirms whether this service fits, or
          points at the more appropriate scope. No contact information
          required.
        </p>
        <div className="p-5 md:p-6" style={{ background: 'white', border: '1px solid rgba(10,22,40,0.10)' }}>
          <RecommendationRouter
            seedPrimaryAim="B"
            source={`service-embed-${source}`}
            referringRoute={referringRoute}
            compact
          />
        </div>
      </div>
    </section>
  );
};

export default ServicePageRecommendationEmbed;
