/**
 * Case study legacy redirect test.
 *
 * Proves that the legacy city-based URL is preserved as a permanent
 * redirect to the neutral canonical, and is not left as a 404.
 */
const fs = require('fs');
const path = require('path');

describe('Case study legacy redirect', () => {
  const LEGACY = '/case-study/metals-fabrication-statesville';
  const CANONICAL = '/case-study/metal-fabrication-readiness';

  test('vercel.json contains a permanent (301) redirect from the legacy URL', () => {
    const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../vercel.json'), 'utf8'));
    const match = (cfg.redirects || []).find((r) => r.source === LEGACY);
    expect(match).toBeDefined();
    expect(match.destination).toBe(CANONICAL);
    expect(match.permanent).toBe(true);
  });

  test('App.js contains a React Router Navigate fallback from the legacy URL', () => {
    const app = fs.readFileSync(path.join(__dirname, '../../App.js'), 'utf8');
    expect(app).toContain(LEGACY);
    expect(app).toMatch(/<Navigate\s+to=["']\/case-study\/metal-fabrication-readiness["']/);
  });

  test('sitemap excludes both the legacy URL and the canonical URL while CASE_STUDY_PUBLIC is false', () => {
    const sitemap = fs.readFileSync(path.join(__dirname, '../../../public/sitemap.xml'), 'utf8');
    expect(sitemap).not.toContain(LEGACY);
    expect(sitemap).not.toContain(CANONICAL);
  });

  test('siteSearchIndex does not surface the anonymized case study while gated', () => {
    const idx = fs.readFileSync(path.join(__dirname, '../../data/siteSearchIndex.js'), 'utf8');
    expect(idx).not.toContain('/case-study/metal-fabrication');
  });
});
