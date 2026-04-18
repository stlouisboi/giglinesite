/**
 * GigLine Analytics — GA4 event helpers + UTM first-touch attribution
 * Usage: import { trackEvent, initAttribution } from '../utils/analytics';
 */

const GA_ID = 'G-FNX42NP1QT';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const CLICK_IDS = ['gclid', 'fbclid', 'msclkid'];
const FIRST_TOUCH_KEY = 'gl_first_touch';
const LAST_TOUCH_KEY = 'gl_last_touch';

function gtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...arguments);
  }
}

/* ── Attribution (UTM first-touch + last-touch) ── */

function readAttributionFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const record = {};
  [...UTM_KEYS, ...CLICK_IDS].forEach((k) => {
    const v = params.get(k);
    if (v) record[k] = v.slice(0, 100);
  });

  // Fall back to referrer if no UTM/click params were set
  if (Object.keys(record).length === 0 && document.referrer) {
    try {
      const refHost = new URL(document.referrer).hostname;
      if (refHost && !refHost.includes(window.location.hostname)) {
        record.utm_source = refHost;
        record.utm_medium = 'referral';
      }
    } catch (_) { /* ignore */ }
  }

  if (Object.keys(record).length === 0) return null;
  record.first_landing_path = window.location.pathname;
  record.captured_at = new Date().toISOString();
  return record;
}

/** Call once on app boot. Captures first-touch (persistent) + last-touch (overwrites). */
export function initAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const current = readAttributionFromUrl();
    if (!current) return;
    // First-touch: only set if not already stored
    if (!window.localStorage.getItem(FIRST_TOUCH_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(current));
    }
    // Last-touch: always overwrite
    window.localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(current));
  } catch (_) { /* localStorage unavailable */ }
}

function getAttributionParams() {
  if (typeof window === 'undefined') return {};
  try {
    const out = {};
    const first = JSON.parse(window.localStorage.getItem(FIRST_TOUCH_KEY) || 'null');
    const last = JSON.parse(window.localStorage.getItem(LAST_TOUCH_KEY) || 'null');
    if (first) {
      if (first.utm_source) out.first_touch_source = first.utm_source;
      if (first.utm_medium) out.first_touch_medium = first.utm_medium;
      if (first.utm_campaign) out.first_touch_campaign = first.utm_campaign;
      if (first.gclid) out.first_touch_gclid = first.gclid;
      if (first.fbclid) out.first_touch_fbclid = first.fbclid;
    }
    if (last) {
      if (last.utm_source) out.last_touch_source = last.utm_source;
      if (last.utm_medium) out.last_touch_medium = last.utm_medium;
      if (last.utm_campaign) out.last_touch_campaign = last.utm_campaign;
    }
    return out;
  } catch (_) {
    return {};
  }
}

/* ── Core tracking ── */

/** Track a page view (called on route change) */
export function trackPageView(path, title) {
  gtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  });
}

/** Track a custom event — auto-appends first/last-touch attribution */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, { ...getAttributionParams(), ...params });
}

/* ── Pre-built conversion events ── */

export function trackWalkthroughRequest(operationType) {
  trackEvent('generate_lead', {
    event_category: 'walkthrough',
    event_label: operationType || 'general',
    value: 650,
    currency: 'USD',
  });
}

export function trackSafetyCheckComplete(scoreGaps, scoreLevel) {
  trackEvent('safety_check_complete', {
    event_category: 'safety_check',
    score_gaps: scoreGaps,
    score_level: scoreLevel,
  });
}

export function trackPDFDownload(documentName) {
  trackEvent('file_download', {
    event_category: 'pdf_download',
    event_label: documentName,
  });
}

export function trackServiceBooking(serviceName) {
  trackEvent('begin_checkout', {
    event_category: 'service_booking',
    event_label: serviceName,
  });
}

export function trackPhoneClick(location = 'unknown') {
  trackEvent('phone_call_click', {
    event_category: 'contact',
    event_label: location,
  });
}

export function trackReviewClick(location = 'unknown') {
  trackEvent('review_click', {
    event_category: 'reviews',
    event_label: location,
  });
}
