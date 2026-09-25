// Convert Ryze's approved published JSON into static pages for the existing React site's public/blog folder.
// The site builds frontend/public into the deployed root; these pages do not depend on client-side routing.
const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '../../blog/data');
const output = path.resolve(__dirname, '../public/blog');
const site = 'https://www.giglinecompliance.com';
const marker = '<!-- Generated from Ryze published article JSON. Do not hand-edit. -->';
const escape = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const jsonScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const safeUrl = (s) => { try { const u = new URL(s); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };

if (!fs.existsSync(source)) throw new Error('Published article source folder missing');
fs.mkdirSync(output, { recursive: true });
let built = 0;
for (const name of fs.readdirSync(source).filter((f) => f.endsWith('.json')).sort()) {
  const article = JSON.parse(fs.readFileSync(path.join(source, name), 'utf8'));
  if (article.status !== 'published') continue;
  const slug = article.slug;
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || name !== `${slug}.json`) throw new Error(`Invalid article slug: ${name}`);
  if (!article.title || !article.body_html) throw new Error(`Incomplete published article: ${name}`);
  const dir = path.join(output, slug);
  const file = path.join(dir, 'index.html');
  if (fs.existsSync(file) && !fs.readFileSync(file, 'utf8').startsWith(marker)) {
    console.log(`Preserving hand-built page: ${slug}`);
    continue;
  }
  const canonical = `${site}/blog/${slug}`;
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || '';
  const image = safeUrl(article.image && article.image.url);
  const alt = (article.image && article.image.alt) || article.title;
  const date = article.published_at || article.updated_at;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
    description, mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Vince Lawrence', url: `${site}/about` },
    publisher: { '@type': 'Organization', name: 'GigLine Safety & Compliance', url: site },
    ...(image ? { image } : {}),
    ...(date ? { datePublished: date, dateModified: article.updated_at || date } : {}),
  };
  // Ryze supplies rendered, trusted body HTML. Remove active scripting rather than embedding it in the page.
  const body = article.body_html.replace(/<script\\b[^>]*>[\\s\\S]*?<\\/script\\s*>/gi, '');
  const html = `${marker}
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}">
<meta property="og:type" content="article"><meta property="og:site_name" content="GigLine Safety &amp; Compliance"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}">
${image ? `<meta property="og:image" content="${escape(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${escape(image)}">` : ''}
<script type="application/ld+json">${jsonScript(schema)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{--navy:#102a43;--blue:#2a52a0;--gold:#c9a84c;--ink:#1c2b2b;--line:#d6dfec}*{box-sizing:border-box}body{margin:0;background:#fbf8f2;color:var(--ink);font:17px/1.75 Arial,sans-serif}a{color:var(--blue)}.nav{background:white;border-bottom:1px solid var(--line);padding:22px max(20px,calc((100vw - 1080px)/2));display:flex;justify-content:space-between;align-items:center;gap:20px}.nav a{font:700 12px 'JetBrains Mono',monospace;text-decoration:none;color:var(--navy)}.nav .action{background:var(--gold);padding:10px 14px;border-radius:4px}.hero{background:var(--navy);color:white;padding:65px 20px}.hero-inner{max-width:840px;margin:auto}.kicker{font:700 12px 'JetBrains Mono',monospace;color:var(--gold);letter-spacing:.12em;text-transform:uppercase}.hero h1{font:700 clamp(34px,5vw,56px)/1.13 Georgia,serif;max-width:850px;margin:15px 0}.hero p{color:#d9e3ec;margin:0;max-width:750px}.hero img{width:100%;max-height:430px;object-fit:cover;margin-top:28px;border-radius:8px}.article{max-width:840px;margin:0 auto;padding:50px 20px 70px;overflow-wrap:anywhere}.article h2,.article h3{font-family:Georgia,serif;color:var(--navy);line-height:1.28;margin:42px 0 16px}.article h2{font-size:32px}.article h3{font-size:24px}.article p{margin:0 0 22px}.article ul,.article ol{padding-left:24px;margin:0 0 24px}.article li{margin:8px 0}.article blockquote{margin:28px 0;padding:20px 26px;border-left:4px solid var(--gold);background:#fff}.article table{border-collapse:collapse;width:100%;min-width:600px}.article th,.article td{padding:12px;text-align:left;border:1px solid var(--line);vertical-align:top}.article th{background:var(--navy);color:#fff}.article figure{margin:30px 0}.article img{max-width:100%;height:auto}.article figcaption{font-size:13px;color:#53636c}.article .pseo-tldr{background:#fff!important;border-left:4px solid var(--gold)!important}.table-scroll{overflow-x:auto}.cta{background:var(--navy);color:#fff;text-align:center;padding:55px 20px}.cta h2{font:700 32px Georgia,serif;margin:0 0 12px}.cta a{display:inline-block;background:var(--gold);color:var(--navy);font-weight:700;text-decoration:none;padding:14px 22px;border-radius:4px}.foot{background:#0a1b2b;color:#cbd6df;text-align:center;padding:25px;font-size:13px}.foot a{color:#fff}@media(max-width:600px){.nav{padding:16px 20px}.nav a{font-size:10px}.hero{padding:45px 20px}.article{padding:34px 20px 55px}.article h2{font-size:27px}.article h3{font-size:21px}}
</style></head><body>
<nav class="nav"><a href="/">GIGLINE SAFETY &amp; COMPLIANCE</a><a href="/blog">Blog</a><a class="action" href="/intake?service=compliance-readiness-visit">Request a Visit</a></nav>
<header class="hero"><div class="hero-inner"><span class="kicker">FIELD GUIDE</span><h1>${escape(article.title)}</h1><p>${escape(article.excerpt || description)}</p>${image ? `<img src="${escape(image)}" alt="${escape(alt)}">` : ''}</div></header>
<main class="article">${body}</main>
<section class="cta"><h2>See where your floor and records stand.</h2><p>A Compliance Readiness Visit reviews both in one engagement.</p><a href="/intake?service=compliance-readiness-visit">Request a Compliance Readiness Visit</a></section>
<footer class="foot"><a href="/blog">More field guides</a> · <a href="/about">About Vince Lawrence</a> · GigLine Safety &amp; Compliance</footer>
</body></html>`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, html);
  built++;
  console.log(`Generated /blog/${slug}`);
}
console.log(`Generated ${built} published article pages.`);
