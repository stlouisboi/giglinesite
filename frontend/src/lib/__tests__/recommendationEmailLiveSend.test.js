/**
 * Recommendation-as-PDF live-send regression tests (Feb 2026, Batch 2B.1).
 *
 * Locks in:
 *   - Frontend RecommendationResultCard.EmailPreviewForm POSTs to
 *     /api/recommendation/email via REACT_APP_BACKEND_URL.
 *   - EMAIL_DELIVERY_LIVE flag still gates whether the form is exposed
 *     at all, and the extra EMAILABLE_SLUGS gate keeps unreleased/kit
 *     slugs from ever calling the endpoint.
 *   - Confirmation copy no longer says "preview only" and does not
 *     mention `Generate preview` on the button.
 *   - Admin CRM stats renders a Recommendation Emails tile and the
 *     downloads sub-tab recognises `recommendation_email` events.
 */
const fs = require('fs');
const path = require('path');

const cardPath = path.join(__dirname, '..', '..', 'components', 'RecommendationResultCard.js');
const adminPath = path.join(__dirname, '..', '..', 'pages', 'AdminPage.js');
const featuresPath = path.join(__dirname, '..', '..', 'config', 'features.js');

const card = fs.readFileSync(cardPath, 'utf8');
const admin = fs.readFileSync(adminPath, 'utf8');
const features = fs.readFileSync(featuresPath, 'utf8');

describe('Recommendation-as-PDF live-send wiring', () => {
  test('EmailPreviewForm posts to /api/recommendation/email via REACT_APP_BACKEND_URL', () => {
    expect(card).toMatch(/process\.env\.REACT_APP_BACKEND_URL/);
    expect(card).toMatch(/\/api\/recommendation\/email/);
    expect(card).toMatch(/method:\s*['"]POST['"]/);
  });

  test('endpoint URL is a const named RECOMMENDATION_EMAIL_ENDPOINT so tests can trace it', () => {
    expect(card).toMatch(/const\s+RECOMMENDATION_EMAIL_ENDPOINT/);
  });

  test('POST body sends slug from result and echoes answers', () => {
    expect(card).toMatch(/slug:\s*result\.slug/);
    expect(card).toMatch(/answers:\s*answersPayload/);
  });

  test('EMAIL_DELIVERY_LIVE feature flag is still exported (may be true or false)', () => {
    expect(features).toMatch(/export\s+const\s+EMAIL_DELIVERY_LIVE\s*=\s*(true|false)/);
  });

  test('email form is gated by BOTH the flag AND the emailable-slug allow-list', () => {
    expect(card).toMatch(/EMAILABLE_SLUGS/);
    expect(card).toMatch(/EMAILABLE_SLUGS\.has\(result\.slug\)/);
    expect(card).toMatch(/showEmailForm\s*&&\s*EMAIL_DELIVERY_LIVE\s*&&\s*EMAILABLE_SLUGS\.has\(result\.slug\)/);
  });

  test('confirmation copy reflects a real send, no leftover "Preview only" phrasing', () => {
    expect(card).not.toContain('Preview only, no email was sent');
    expect(card).not.toMatch(/GigLine is not sending real email in this preview/);
    expect(card).toMatch(/We just emailed/);
  });

  test('submit button label no longer says "Generate preview"', () => {
    expect(card).not.toMatch(/Generate preview/);
    expect(card).toMatch(/Email my recommendation/);
  });

  test('honeypot field is present and hidden from a11y tree', () => {
    expect(card).toMatch(/name="website"/);
    expect(card).toMatch(/aria-hidden="true"/);
    expect(card).toMatch(/tabIndex=\{-1\}/);
  });

  test('Field Notes companion checkbox is present, unchecked by default, and sent as include_field_notes in the POST body', () => {
    expect(card).toMatch(/data-testid="rr-email-preview-include-field-notes"/);
    expect(card).toMatch(/const\s+\[includeFieldNotes,\s*setIncludeFieldNotes\]\s*=\s*useState\(false\)/);
    expect(card).toMatch(/include_field_notes:\s*!!includeFieldNotes/);
  });
});

describe('Admin CRM surfaces recommendation-email leads', () => {
  test('Recommendation Emails tile is rendered', () => {
    expect(admin).toMatch(/Recommendation Emails/);
    expect(admin).toMatch(/stats\.recommendation_email_leads\?\.total/);
  });

  test('typeLabel recognises recommendation_email downloads', () => {
    expect(admin).toMatch(/recommendation_email/);
    expect(admin).toMatch(/'Recommendation Email'/);
  });
});
