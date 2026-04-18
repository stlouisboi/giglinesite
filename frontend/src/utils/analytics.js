/**
 * GigLine Analytics — GA4 event helpers
 * Usage: import { trackEvent } from '../utils/analytics';
 */

const GA_ID = 'G-FNX42NP1QT';

function gtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...arguments);
  }
}

/** Track a page view (called on route change) */
export function trackPageView(path, title) {
  gtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  });
}

/** Track a custom event */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params);
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
