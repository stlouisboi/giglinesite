// Offline cache. Static files are cache-first, pages are network-first, /api is never cached.
const V = 'fig-v1', PRE = ['./', 'support.js', 'vendor/react.production.min.js', 'vendor/react-dom.production.min.js', 'vendor/babel.min.js', 'manifest.webmanifest', 'brand/fig-logo.png', 'brand/fig-logo-dark.png', 'brand/fig-logo-cream.png', 'brand/fig-favicon-64.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(PRE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  const page = r.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname === '/';
  e.respondWith(page
    ? fetch(r).then(x => { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); return x; }).catch(() => caches.match(r).then(x => x || caches.match('./')))
    : caches.match(r).then(x => x || fetch(r).then(y => { if (y.ok) { const c = y.clone(); caches.open(V).then(k => k.put(r, c)); } return y; })));
});
