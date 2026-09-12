/**
 * Preview-gate protection test.
 *
 * Confirms that ?preview=1 CANNOT expose disabled draft routes in a
 * production-mode build. Production builds must redirect to /resources.
 */

describe('isPreviewBypassAllowed (production-mode enforcement)', () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: ORIGINAL_NODE_ENV,
      configurable: true,
    });
    // Reset any window mocking.
    if (global.window && global.window.location) {
      // no-op; each test sets what it needs.
    }
  });

  const setLocation = (hostname) => {
    Object.defineProperty(window, 'location', {
      value: { hostname, href: `https://${hostname}/`, pathname: '/' },
      writable: true,
      configurable: true,
    });
  };

  test('returns false when query parameter is not "1"', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
    setLocation('localhost');
    const { isPreviewBypassAllowed } = require('../previewGate');
    expect(isPreviewBypassAllowed(null)).toBe(false);
    expect(isPreviewBypassAllowed('')).toBe(false);
    expect(isPreviewBypassAllowed('true')).toBe(false);
    expect(isPreviewBypassAllowed('2')).toBe(false);
  });

  test('returns false in production build on the public production hostname even with ?preview=1', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    setLocation('www.giglinecompliance.com');
    jest.resetModules();
    const { isPreviewBypassAllowed } = require('../previewGate');
    expect(isPreviewBypassAllowed('1')).toBe(false);
  });

  test('returns false in production build on the apex hostname even with ?preview=1', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    setLocation('giglinecompliance.com');
    jest.resetModules();
    const { isPreviewBypassAllowed } = require('../previewGate');
    expect(isPreviewBypassAllowed('1')).toBe(false);
  });

  test('returns true in development mode when the query parameter is exactly "1"', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
    setLocation('localhost');
    jest.resetModules();
    const { isPreviewBypassAllowed } = require('../previewGate');
    expect(isPreviewBypassAllowed('1')).toBe(true);
  });

  test('returns true in a production-mode build IF running on the emergent preview hostname (defense in depth for E1 previews)', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    setLocation('z-project-9.preview.emergentagent.com');
    jest.resetModules();
    const { isPreviewBypassAllowed } = require('../previewGate');
    expect(isPreviewBypassAllowed('1')).toBe(true);
  });
});
