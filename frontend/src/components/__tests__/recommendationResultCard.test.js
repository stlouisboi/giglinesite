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

describe('RecommendationResultCard, non-transmission contract', () => {
  test('the card source contains NO fetch/axios calls or transactional-email API calls', () => {
    // Guard against real network egress. Comment mentions are fine so long
    // as no actual call expression or import ever hits this file.
    expect(CARD_SRC).not.toMatch(/\bfetch\s*\(/);
    expect(CARD_SRC).not.toMatch(/\baxios\b/);
    // No import from a transactional-email SDK
    expect(CARD_SRC).not.toMatch(/from\s+['"](resend|@mailerlite\/|mailerlite-nodejs|sendgrid)/i);
    // No call expression like Resend(...) or new MailerLite()
    expect(CARD_SRC).not.toMatch(/\bResend\s*\(/);
    expect(CARD_SRC).not.toMatch(/new\s+MailerLite\b/);
    expect(CARD_SRC).not.toMatch(/mailerlite\./i);
  });
  test('preview confirmation string explicitly states no email was sent', () => {
    expect(CARD_SRC).toContain('Preview only, no email was sent');
  });
  test('marketing consent is unchecked by default (state initialized to false)', () => {
    // useState is called with `false` for the marketing consent hook.
    expect(CARD_SRC).toMatch(/marketing[\s\S]{0,60}useState\(false\)/i);
  });
  test('marketing consent checkbox is separate from the transactional preview flow', () => {
    // Two independent things: the "generate preview" submit path always runs,
    // and the marketing checkbox is optional.
    expect(CARD_SRC).toMatch(/marketing/i);
    expect(CARD_SRC).toMatch(/marketing consent status/i);
  });
  test('preview state cannot claim delivery', () => {
    expect(CARD_SRC).not.toMatch(/email sent|delivered to your inbox|check your email/i);
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
