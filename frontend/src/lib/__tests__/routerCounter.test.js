/**
 * Batch 2B follow-up: admin dashboard recommendation-router counter.
 *
 * Source-level asserts, no live DB required:
 *   1. Backend /admin/stats builds recommendation_router with this_month,
 *      last_30d, total, and paths_this_month.
 *   2. Query uses `lead_source: "recommendation-router"` (matches the
 *      frontend value shipped in the intake payload).
 *   3. Uses `submittedAt` (matches the actual field on gl_intake_submissions),
 *      not the incorrect `created_at`.
 *   4. Frontend AdminPage renders the tile with the mandated testids.
 */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', '..');
const APP = path.join(__dirname, '..', '..', '..', '..');

function read(rel) {
  return fs.readFileSync(path.join(SRC, rel), 'utf8');
}
function readApp(rel) {
  return fs.readFileSync(path.join(APP, rel), 'utf8');
}

describe('Backend /admin/stats router-attribution counter', () => {
  const admin = readApp('backend/routes/admin.py');
  test('exposes recommendation_router with this_month / last_30d / total / paths_this_month', () => {
    expect(admin).toMatch(/"recommendation_router":\s*\{/);
    expect(admin).toMatch(/"this_month":\s*router_this_month/);
    expect(admin).toMatch(/"last_30d":\s*router_last_30d/);
    expect(admin).toMatch(/"total":\s*router_total/);
    expect(admin).toMatch(/"paths_this_month":\s*router_paths_this_month/);
  });
  test('filters by the exact lead_source value shipped by the frontend', () => {
    expect(admin).toMatch(/"lead_source":\s*"recommendation-router"/);
  });
  test('queries gl_intake_submissions by submittedAt (not created_at) for the router counter', () => {
    // Only the router counter must use the correct field; other legacy queries
    // are intentionally left alone to avoid scope creep.
    const routerBlock = admin.split('router_query = {"lead_source"')[1] || '';
    expect(routerBlock).toContain('"submittedAt"');
    expect(routerBlock).toMatch(/start_of_month/);
  });
  test('start_of_month is derived from calendar month, not rolling 30 days', () => {
    expect(admin).toMatch(/now\.replace\(day=1,\s*hour=0,\s*minute=0,\s*second=0,\s*microsecond=0\)/);
  });
  test('path breakdown accepts only A through E aims', () => {
    expect(admin).toMatch(/aim in \("A", "B", "C", "D", "E"\)/);
  });
});

describe('AdminPage renders the recommendation-router tile', () => {
  const admin = read('pages/AdminPage.js');
  test('renders the tile only when stats.recommendation_router is present', () => {
    expect(admin).toMatch(/stats\.recommendation_router\s*&&/);
    expect(admin).toMatch(/data-testid="recommendation-router-tile"/);
  });
  test('exposes stable testids for the three counters', () => {
    expect(admin).toMatch(/data-testid="recommendation-router-this-month"/);
    expect(admin).toMatch(/data-testid="recommendation-router-last-30d"/);
    expect(admin).toMatch(/data-testid="recommendation-router-total"/);
  });
  test('renders a compact path-mix strip when paths_this_month has entries', () => {
    expect(admin).toMatch(/paths_this_month\.length\s*>\s*0/);
    expect(admin).toMatch(/data-testid="recommendation-router-paths"/);
  });
  test('links to /recommendation so Vince can open the tool from the dashboard', () => {
    expect(admin).toMatch(/href="\/recommendation"/);
  });
});
