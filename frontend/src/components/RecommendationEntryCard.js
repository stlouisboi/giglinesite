/**
 * RecommendationEntryCard, Phase 2 Batch 2B, Checkpoint 2 (Feb 2026).
 *
 * Small gated entry card that surfaces the /recommendation router from
 * high-intent surfaces (Homepage "Not sure where to start?" band, /services
 * overview, /citation-proof-kits). When RECOMMENDATION_ROUTER_ENABLED is
 * false, the component renders null so it never appears in production.
 *
 * The link forwards the caller's route as `?preview=1` bypass ONLY on the
 * preview host, matching the standard prior-batch pattern.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RECOMMENDATION_ROUTER_ENABLED } from '../config/features';

const NAVY = '#102A43';
const GOLD = '#C9A84C';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const RecommendationEntryCard = ({
  source = 'entry',
  heading = 'Not sure which GigLine step fits?',
  subhead = 'Answer up to five short questions. GigLine returns one primary recommendation, one alternative, and the appropriate next step. No contact information required.',
  compact = false,
}) => {
  if (!RECOMMENDATION_ROUTER_ENABLED) return null;

  const size = compact ? 'py-6 px-5' : 'py-8 md:py-10 px-6 md:px-8';

  return (
    <section
      className={`w-full ${size}`}
      style={{ background: NAVY, color: 'white' }}
      data-testid={`recommendation-entry-card-${source}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex-1">
          <p
            className="uppercase font-bold tracking-[0.24em] mb-2"
            style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
          >
            Decision support
          </p>
          <h3
            className="font-bold leading-tight text-[22px] md:text-[26px] tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {heading}
          </h3>
          <p className="mt-3 text-[14.5px] md:text-[15.5px] leading-[1.65] text-white/70 max-w-2xl">
            {subhead}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            to="/recommendation"
            className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14.5px]"
            style={{ background: GOLD, color: NAVY }}
            data-testid={`recommendation-entry-cta-${source}`}
          >
            Start the recommendation
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendationEntryCard;
