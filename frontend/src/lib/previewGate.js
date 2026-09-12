/**
 * Preview-bypass gate.
 *
 * The `?preview=1` query parameter may reveal disabled draft routes ONLY in
 * the private preview / development environment. In production it must be
 * ignored. This is enforced two ways:
 *
 *   1. NODE_ENV check. Create-React-App inlines `process.env.NODE_ENV` at
 *      build time. In production builds it is the literal string 'production'
 *      and the bypass returns false unconditionally.
 *
 *   2. Host-name check. As a defense in depth we also require the current
 *      host to end with `.preview.emergentagent.com` OR to be a localhost /
 *      dev host. This means even if a production build somehow renders the
 *      route, the bypass still does not activate on the public production
 *      domain (www.giglinecompliance.com).
 *
 * The paired automated test lives at
 *   frontend/src/lib/__tests__/previewGate.test.js
 * and forces NODE_ENV=production to confirm the bypass never returns true.
 */

const isPreviewHost = () => {
  if (typeof window === 'undefined' || !window.location) return false;
  const host = window.location.hostname;
  if (!host) return false;
  // Allowed preview / development hostnames only.
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.preview.emergentagent.com')) return true;
  if (host.endsWith('.emergent.host')) return true;
  return false;
};

/**
 * Returns true only when the caller may reveal a feature-flagged draft route
 * behind ?preview=1. Returns false in production builds and on any non-preview
 * hostname, regardless of the query parameter value.
 *
 * @param {string|null} queryValue the current value of the `preview` query param
 * @returns {boolean}
 */
export function isPreviewBypassAllowed(queryValue) {
  if (queryValue !== '1') return false;
  if (process.env.NODE_ENV === 'production' && !isPreviewHost()) return false;
  return true;
}
