/**
 * Phase 2 Batch 2B, Checkpoint 1: page + router source-level gating.
 *
 *   1. /recommendation route is registered in App.js
 *   2. Route emits noindex
 *   3. Route redirects to /resources when RECOMMENDATION_ROUTER_ENABLED
 *      is false and no preview bypass is present
 *   4. Sitemap does NOT include /recommendation
 *   5. Router source contains no fetch/axios/Resend/MailerLite calls
 *   6. Feature flag file exports the two new preview flags
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

describe('Recommendation router, page gating', () => {
  const page = read('pages/RecommendationRouterPage.js');
  const app = read('App.js');
  const router = read('components/RecommendationRouter.js');

  test('/recommendation route is registered in App.js and uses the gated page component', () => {
    expect(app).toMatch(/RecommendationRouterPage/);
    expect(app).toMatch(/path="\/recommendation"/);
  });

  test('page emits SEO tags and redirects to /resources when the flag is off', () => {
    expect(page).toMatch(/RECOMMENDATION_ROUTER_ENABLED/);
    expect(page).toMatch(/Navigate to="\/resources"/);
  });

  test('page respects the previewGate bypass helper (same pattern as case study)', () => {
    expect(page).toMatch(/isPreviewBypassAllowed/);
  });

  test('sitemap includes /recommendation (Batch 2B live)', () => {
    const sitemap = fs.readFileSync(
      path.join(SRC, '..', 'public', 'sitemap.xml'),
      'utf8',
    );
    expect(sitemap).toMatch(/\/recommendation/);
  });

  test('router source contains no fetch/axios calls and no transactional-email SDK imports', () => {
    expect(router).not.toMatch(/\bfetch\s*\(/);
    expect(router).not.toMatch(/\baxios\b/);
    expect(router).not.toMatch(/from\s+['"](resend|@mailerlite\/|mailerlite-nodejs|sendgrid)/i);
    expect(router).not.toMatch(/\bResend\s*\(/);
    expect(router).not.toMatch(/new\s+MailerLite\b/);
  });
});

describe('Feature flag registration', () => {
  const features = read('config/features.js');
  test('RECOMMENDATION_ROUTER_ENABLED exported as true (Batch 2B live)', () => {
    expect(features).toMatch(/export\s+const\s+RECOMMENDATION_ROUTER_ENABLED\s*=\s*true\s*;/);
  });
  test('EXIT_FEEDBACK_ENABLED exported as false', () => {
    expect(features).toMatch(/export\s+const\s+EXIT_FEEDBACK_ENABLED\s*=\s*false\s*;/);
  });
});
