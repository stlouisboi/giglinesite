/**
 * RecommendationRouterPage, Phase 2 Batch 2B (Feb 2026).
 *
 * Standalone /recommendation page. Gated behind RECOMMENDATION_ROUTER_ENABLED.
 * When the flag is false and no ?preview=1 bypass on the preview host, the
 * page redirects to /resources.
 */
import React from 'react';
import { Navigate, useSearchParams, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import RecommendationRouter from '../components/RecommendationRouter';
import ObjectionSupport from '../components/ObjectionSupport';
import { RECOMMENDATION_ROUTER_ENABLED } from '../config/features';
import { isPreviewBypassAllowed } from '../lib/previewGate';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const BG_WARM = '#FAF7F1';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const RecommendationRouterPage = () => {
  const [searchParams] = useSearchParams();
  const previewBypass = isPreviewBypassAllowed(searchParams.get('preview'));
  const location = useLocation();

  if (!RECOMMENDATION_ROUTER_ENABLED && !previewBypass) {
    return <Navigate to="/resources" replace />;
  }

  return (
    <main
      style={{ backgroundColor: BG_WARM, color: INK }}
      data-testid="recommendation-router-page"
    >
      <SEO
        title="Recommendation Router (Private Preview) | GigLine"
        description="Internal decision-support preview. Not indexed. Not for production traffic."
        canonical="/recommendation"
        noindex
      />

      <section className="px-5 md:px-8 pt-16 pb-8 md:pt-20">
        <div className="max-w-3xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-5"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
            data-testid="rr-page-kicker"
          >
            Private preview, decision support
          </p>
          <h1
            className="font-bold leading-[1.1] mb-5 text-[32px] sm:text-[40px] md:text-[48px] tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            data-testid="rr-page-heading"
          >
            Which GigLine step fits your operation right now?
          </h1>
          <p
            className="text-[17px] md:text-[19px] leading-relaxed max-w-2xl"
            style={{ color: 'rgba(10,22,40,0.72)', ...serif }}
            data-testid="rr-page-subhead"
          >
            Answer up to five short questions. GigLine returns one primary
            recommendation, one contextually relevant alternative, and the
            appropriate next step. No contact information is required to see
            the result.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 pb-20 md:pb-28">
        <div
          className="max-w-3xl mx-auto p-6 md:p-8"
          style={{ background: 'white', border: '1px solid rgba(10,22,40,0.10)' }}
        >
          <RecommendationRouter
            source="page"
            referringRoute={location.pathname}
          />
        </div>

        <p
          className="max-w-3xl mx-auto mt-6 text-[12.5px] italic"
          style={{ color: INK_MUTED }}
          data-testid="rr-page-preview-notice"
        >
          Private preview build. This route is not indexed, not linked from
          navigation, and does not transmit any email or payment. Copy and
          logic will be reviewed before public launch.
        </p>
      </section>

      <section className="px-5 md:px-8 pb-20" data-testid="rr-page-objection-section">
        <div className="max-w-3xl mx-auto">
          <ObjectionSupport
            heading="Common questions buyers ask on this page"
            anchor="rr-objections"
          />
        </div>
      </section>
    </main>
  );
};

export default RecommendationRouterPage;
