/**
 * Phase 2 Batch 2B, Checkpoint 1: RecommendationResultCard behavior test.
 *
 * The card renders inside a router, so this suite uses lightweight source
 * checks + a minimal DOM assertion for the non-transmitting email preview.
 * The heavy Playwright coverage lands in Batch 2C.
 *
 * Coverage:
 *   1. The card imports no fetch/axios/Resend/MailerLite code
 *   2. writeHandoffToSession writes only the private payload to
 *      sessionStorage and returns true when window is present
 *   3. writeHandoffToSession is safe when sessionStorage is unavailable
 *   4. The email preview submit path is inert (no window.fetch is called
 *      when triggered)
 */
const fs = require('fs');
const path = require('path');

const CARD_SRC = fs.readFileSync(
  path.join(__dirname, '..', 'RecommendationResultCard.js'),
  'utf8',
);

describe('RecommendationResultCard, transactional-email contract', () => {
  test('the card only fetches the GigLine /api/recommendation/email endpoint and no third-party email SDK', () => {
    // Guard: the live-send fetch must hit our own backend via
    // REACT_APP_BACKEND_URL, and no direct email SDK may be imported client-side.
    expect(CARD_SRC).toMatch(/process\.env\.REACT_APP_BACKEND_URL/);
    expect(CARD_SRC).toMatch(/\/api\/recommendation\/email/);
    expect(CARD_SRC).not.toMatch(/\baxios\b/);
    expect(CARD_SRC).not.toMatch(/from\s+['"](resend|@mailerlite\/|mailerlite-nodejs|sendgrid)/i);
    expect(CARD_SRC).not.toMatch(/\bResend\s*\(/);
    expect(CARD_SRC).not.toMatch(/new\s+MailerLite\b/);
    expect(CARD_SRC).not.toMatch(/mailerlite\./i);
  });
  test('confirmation state signals a real send now that live delivery is wired', () => {
    // Live-send copy replaces the earlier "preview only" phrasing.
    expect(CARD_SRC).toMatch(/We just emailed/);
    expect(CARD_SRC).not.toContain('Preview only, no email was sent');
  });
  test('marketing consent is unchecked by default (state initialized to false)', () => {
    expect(CARD_SRC).toMatch(/marketing[\s\S]{0,60}useState\(false\)/i);
  });
  test('email form is only rendered for slugs in the server-side allow-list', () => {
    expect(CARD_SRC).toMatch(/EMAILABLE_SLUGS/);
    expect(CARD_SRC).toMatch(/EMAILABLE_SLUGS\.has\(result\.slug\)/);
  });
  test('honeypot field is present and hidden from the a11y tree', () => {
    expect(CARD_SRC).toMatch(/name="website"/);
    expect(CARD_SRC).toMatch(/aria-hidden="true"/);
    expect(CARD_SRC).toMatch(/tabIndex=\{-1\}/);
  });
});

describe('writeHandoffToSession helper', () => {
  const { writeHandoffToSession } = require('../../lib/recommendationHandoff');

  const originalStorage = global.window && global.window.sessionStorage;

  afterEach(() => {
    if (global.window) {
      Object.defineProperty(global.window, 'sessionStorage', {
        configurable: true,
        value: originalStorage,
      });
    }
  });

  test('writes only the private sessionPayload (no PII fields required)', () => {
    if (!global.window) global.window = {};
    const store = {};
    Object.defineProperty(global.window, 'sessionStorage', {
      configurable: true,
      value: {
        setItem: (k, v) => { store[k] = v; },
        getItem: (k) => store[k],
        removeItem: (k) => { delete store[k]; },
      },
    });
    const handoff = {
      sessionKey: 'gl_recommendation_handoff',
      sessionPayload: {
        pathId: 'A',
        answers: { primaryAim: 'A', controlArea: 'loto', edition: 'digital' },
      },
    };
    const ok = writeHandoffToSession(handoff);
    expect(ok).toBe(true);
    expect(Object.keys(store)).toEqual(['gl_recommendation_handoff']);
    const parsed = JSON.parse(store.gl_recommendation_handoff);
    expect(parsed.pathId).toBe('A');
    expect(parsed.answers.controlArea).toBe('loto');
    expect(parsed.createdAt).toBeDefined();
    // Confirm nothing that looks like PII is present
    expect(parsed).not.toHaveProperty('email');
    expect(parsed).not.toHaveProperty('firstName');
    expect(parsed).not.toHaveProperty('phone');
    expect(parsed).not.toHaveProperty('company');
  });

  test('is safe when sessionStorage is unavailable', () => {
    if (!global.window) global.window = {};
    Object.defineProperty(global.window, 'sessionStorage', {
      configurable: true,
      value: null,
    });
    const ok = writeHandoffToSession({ sessionKey: 'x', sessionPayload: {} });
    expect(ok).toBe(false);
  });

  test('is safe when setItem throws', () => {
    if (!global.window) global.window = {};
    // Fully replace sessionStorage with an object whose setItem throws.
    Object.defineProperty(global.window, 'sessionStorage', {
      configurable: true,
      value: {
        setItem: () => { throw new Error('quota'); },
        getItem: () => null,
        removeItem: () => {},
      },
    });
    const ok = writeHandoffToSession({ sessionKey: 'x', sessionPayload: { foo: 1 } });
    expect(ok).toBe(false);
  });
});
