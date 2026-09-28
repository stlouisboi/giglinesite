/**
 * First-Pull live-send regression tests (Feb 2026).
 *
 * Locks in:
 *   - Template POSTs to /api/first-pull/submit via REACT_APP_BACKEND_URL.
 *   - Slug from the checklist prop is included in the body.
 *   - No hardcoded absolute hosts; no direct email SDK imports on the client.
 *   - Honeypot input present, hidden from a11y tree.
 *   - Marketing consent defaults to unchecked.
 *   - Confirmation copy reflects a real send (no leftover "In a live send" or "Requested (draft)").
 *   - Pending-state UI (spinner + disabled submit + role="alert" error banner) exists.
 *   - Admin CRM stats page renders the "First-Pull Leads" tile.
 *   - Admin downloads type label recognises `first_pull_checklist`.
 */
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', '..', 'components', 'FirstPullChecklistTemplate.js');
const adminPath = path.join(__dirname, '..', '..', 'pages', 'AdminPage.js');

describe('First-Pull live-send wiring', () => {
  const src = fs.readFileSync(templatePath, 'utf8');
  const adminSrc = fs.readFileSync(adminPath, 'utf8');

  test('template POSTs to /api/first-pull/submit via REACT_APP_BACKEND_URL', () => {
    expect(src).toMatch(/process\.env\.REACT_APP_BACKEND_URL/);
    expect(src).toMatch(/\/api\/first-pull\/submit/);
    expect(src).toMatch(/method:\s*['"]POST['"]/);
    expect(src).not.toMatch(/https?:\/\/(?!\$\{)/); // no hardcoded absolute host
  });

  test('POST body includes the slug from the checklist prop', () => {
    expect(src).toMatch(/slug:\s*checklist\.slug/);
  });

  test('template does not import any email SDK on the client', () => {
    expect(src).not.toMatch(/from\s+['"]@?resend/);
    expect(src).not.toMatch(/from\s+['"]@?mailerlite/);
    expect(src).not.toMatch(/from\s+['"]@?sendgrid/);
  });

  test('honeypot input is present and hidden from a11y tree', () => {
    expect(src).toMatch(/name="website"/);
    expect(src).toMatch(/aria-hidden="true"/);
    expect(src).toMatch(/tabIndex=\{-1\}/);
  });

  test('marketing consent checkbox defaults to unchecked', () => {
    expect(src).toMatch(/consent:\s*false/);
  });

  test('confirmation copy reflects a real send (no leftover draft copy)', () => {
    expect(src).not.toMatch(/In a live send/);
    expect(src).not.toMatch(/Requested\s*\(draft\)/i);
    expect(src).toMatch(/We just emailed/);
  });

  test('pending state exposes disabled submit + spinner + error alert', () => {
    expect(src).toMatch(/disabled=\{pending\}/);
    expect(src).toMatch(/Loader2/);
    expect(src).toMatch(/role="alert"/);
    expect(src).toMatch(/data-testid="first-pull-error"/);
  });
});

describe('Admin CRM surfaces First-Pull leads', () => {
  const adminSrc = fs.readFileSync(adminPath, 'utf8');

  test('First-Pull Leads tile is rendered on the portal overview', () => {
    expect(adminSrc).toMatch(/First-Pull Leads/);
    expect(adminSrc).toMatch(/stats\.first_pull_leads\?\.total/);
  });

  test('typeLabel recognises first_pull_checklist downloads', () => {
    expect(adminSrc).toMatch(/first_pull_checklist/);
    expect(adminSrc).toMatch(/'First-Pull'/);
  });

  test('Machine Guarding tile with dual-hazard subtitle still present', () => {
    expect(adminSrc).toMatch(/Machine Guarding Leads/);
    expect(adminSrc).toMatch(/dual-hazard/);
  });
});
