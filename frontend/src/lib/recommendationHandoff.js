/**
 * Recommendation handoff, Phase 2 Batch 2B (Feb 2026).
 *
 * Pure helper. No React imports so it can be unit-tested cleanly and reused
 * from any surface that needs to persist a private answer payload before a
 * navigation.
 *
 * Privacy contract:
 *   - Only the private answer payload lands in sessionStorage.
 *   - No email address, no first name, no phone number, no company name,
 *     no free-text is ever written here.
 */

export const SESSION_KEY = 'gl_recommendation_handoff';

/**
 * Persists a handoff payload to sessionStorage. Returns true on success,
 * false when sessionStorage is unavailable or throws.
 *
 * The caller supplies `{ sessionKey, sessionPayload }`. This helper
 * timestamps the payload and never touches window.localStorage.
 */
export function writeHandoffToSession(handoff) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return false;
    const payload = { ...handoff.sessionPayload, createdAt: new Date().toISOString() };
    window.sessionStorage.setItem(handoff.sessionKey || SESSION_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Reads a previously written handoff payload. Returns null when no
 * handoff exists or the payload is unparsable.
 */
export function readHandoffFromSession(sessionKey = SESSION_KEY) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(sessionKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Clears a handoff payload from sessionStorage. Safe when storage is
 * unavailable.
 */
export function clearHandoffFromSession(sessionKey = SESSION_KEY) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return false;
    window.sessionStorage.removeItem(sessionKey);
    return true;
  } catch (e) {
    return false;
  }
}
