/**
 * GA4 analytics helper. All selector events flow through here so the naming
 * stays consistent. Silent no-op if gtag is not on the page yet.
 */

const _gtag = () => {
  if (typeof window === 'undefined') return null;
  const g = window.gtag;
  return typeof g === 'function' ? g : null;
};

export const track = (name, params = {}) => {
  const g = _gtag();
  if (g) {
    try {
      g('event', name, params);
    } catch (_) { /* swallow */ }
  }
  if (typeof window !== 'undefined' && window.__GL_ANALYTICS_DEBUG__) {
    console.info('[ga4]', name, params);
  }
};

// Assessment selector
export const assessmentEvents = {
  start: (source) => track('assessment_selector_start', { source }),
  answer: (question, answer, extras = {}) =>
    track('assessment_selector_answer', { question, answer, ...extras }),
  result: (slug, extras = {}) =>
    track('assessment_selector_result', { recommendation: slug, ...extras }),
  cta: (cta, extras = {}) =>
    track('assessment_selector_cta_click', { cta, ...extras }),
};

// Kit selector (same shape, kit-namespaced)
export const kitSelectorEvents = {
  start: (source) => track('kit_selector_start', { source }),
  answer: (question, answer, extras = {}) =>
    track('kit_selector_answer', { question, answer, ...extras }),
  result: (kitOrCrv, extras = {}) =>
    track('kit_selector_result', { recommendation: kitOrCrv, ...extras }),
  cta: (cta, extras = {}) => track('kit_selector_cta_click', { cta, ...extras }),
};
