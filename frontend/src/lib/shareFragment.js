/**
 * shareFragment, Phase 2 Batch 2B follow-up (Feb 2026).
 *
 * Encode / decode the recommendation router answer state as a URL
 * fragment (after `#`). Fragments are never transmitted to servers,
 * referrer headers, or analytics, so this is a privacy-safe way for one
 * manager to share a guided decision path with a colleague or their
 * leadership for buy-in.
 *
 * Only whitelisted structural answer keys survive encode/decode. No
 * PII, no workplace descriptions, no free text ever leaves the browser.
 */

export const ANSWER_KEYS_ALLOWED = [
  'primaryAim',
  'controlArea',
  'edition',
  'reviewFocus',
  'hasFindingsList',
  'programsExist',
  'trainingCurrent',
  'correctiveActionsTracked',
  'primaryNeedRecurring',
];

const BOOL_KEYS = [
  'programsExist',
  'trainingCurrent',
  'correctiveActionsTracked',
  'primaryNeedRecurring',
];

export function decodeShareFragment(fragment) {
  if (!fragment || typeof fragment !== 'string') return null;
  const raw = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parts = decoded.split('&').filter(Boolean);
    const out = {};
    for (const part of parts) {
      const eq = part.indexOf('=');
      if (eq === -1) continue;
      const k = part.slice(0, eq);
      const v = part.slice(eq + 1);
      if (!ANSWER_KEYS_ALLOWED.includes(k)) continue;
      if (BOOL_KEYS.includes(k)) {
        out[k] = v === 'true' ? true : v === 'false' ? false : v;
      } else {
        out[k] = v;
      }
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch (e) {
    return null;
  }
}

export function encodeShareFragment(answers) {
  if (!answers || typeof answers !== 'object') return '';
  const pairs = [];
  for (const k of ANSWER_KEYS_ALLOWED) {
    if (answers[k] === undefined || answers[k] === null || answers[k] === '') continue;
    pairs.push(`${k}=${encodeURIComponent(String(answers[k]))}`);
  }
  return pairs.length > 0 ? `#${pairs.join('&')}` : '';
}
