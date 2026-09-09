/*
 * GigLine site init: GA4 config + Microsoft Clarity bootstrap.
 * Loaded from same-origin so no 'unsafe-inline' is needed in the CSP script-src.
 * Clarity ID is passed via data-clarity-id attribute so build-time env interpolation
 * can happen on the <script> tag in index.html.
 */
(function () {
  // GA4: initialize dataLayer + gtag stub, then configure.
  // The actual gtag.js loader is a separate <script src="https://www.googletagmanager.com/gtag/js?id=..."> tag.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', 'G-FNX42NP1QT', { send_page_view: false });

  // Microsoft Clarity: activates only when a real ID was templated in.
  var scriptEl = document.currentScript;
  var clarityId = scriptEl && scriptEl.dataset ? scriptEl.dataset.clarityId : '';
  if (!clarityId || clarityId === '' || clarityId.indexOf('REACT_APP_') === 0) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', clarityId);
})();
