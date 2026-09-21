/**
 * Machine Guarding lead-magnet regression tests.
 *
 * Locks in the live-send integration (Feb 2026):
 *   - Feature flag `MG_LEAD_MAGNET_ENABLED` is defined.
 *   - Component early-returns null when flag is false.
 *   - Component POSTs to /api/machine-guarding-checklist/submit using the
 *     REACT_APP_BACKEND_URL env var (never a hardcoded host).
 *   - Consent checkbox defaults to unchecked.
 *   - Honeypot input is present and hidden from a11y tree.
 *   - Confirmation state exposes an accessible PDF download trigger that
 *     opens the backend PDF endpoint (real file, not a browser print dialog).
 *   - Every required input has a matching label + stable testid.
 *   - Article page imports and mounts the component.
 *   - Post-submit copy correctly claims the email was sent (no draft copy).
 */
const fs = require('fs');
const path = require('path');

const featuresPath = path.join(__dirname, '..', '..', 'config', 'features.js');
const componentPath = path.join(__dirname, '..', '..', 'components', 'MachineGuardingLeadMagnet.js');
const pagePath = path.join(__dirname, '..', '..', 'pages', 'BlogMachineGuardingChecklist.js');

describe('Machine Guarding lead magnet', () => {
  const featuresSrc = fs.readFileSync(featuresPath, 'utf8');
  const componentSrc = fs.readFileSync(componentPath, 'utf8');
  const pageSrc = fs.readFileSync(pagePath, 'utf8');

  test('MG_LEAD_MAGNET_ENABLED feature flag is defined', () => {
    expect(featuresSrc).toMatch(/export\s+const\s+MG_LEAD_MAGNET_ENABLED\s*=\s*(true|false)/);
  });

  test('component early-returns null when the flag is false', () => {
    expect(componentSrc).toMatch(/if\s*\(\s*!\s*MG_LEAD_MAGNET_ENABLED\s*\)\s*return\s+null/);
  });

  test('component POSTs to the machine-guarding submit endpoint via REACT_APP_BACKEND_URL', () => {
    expect(componentSrc).toMatch(/process\.env\.REACT_APP_BACKEND_URL/);
    expect(componentSrc).toMatch(/\/api\/machine-guarding-checklist\/submit/);
    expect(componentSrc).toMatch(/method:\s*['"]POST['"]/);
    expect(componentSrc).not.toMatch(/https?:\/\/(?!\$\{)/); // no hardcoded absolute hosts
  });

  test('marketing consent checkbox defaults to unchecked', () => {
    expect(componentSrc).toMatch(/consent:\s*false/);
  });

  test('honeypot input is present and hidden from a11y tree', () => {
    expect(componentSrc).toMatch(/name="website"/);
    expect(componentSrc).toMatch(/aria-hidden="true"/);
    expect(componentSrc).toMatch(/tabIndex=\{-1\}/);
  });

  test('confirmation state exposes a PDF download trigger that opens the backend PDF endpoint', () => {
    expect(componentSrc).toMatch(/data-testid="mg-lead-magnet-download"/);
    expect(componentSrc).toMatch(/\/api\/machine-guarding-checklist\/pdf/);
    expect(componentSrc).toMatch(/window\.open/);
  });

  test('every required form field has a matching label and stable testid', () => {
    const requiredIds = ['mg-first-name', 'mg-email', 'mg-company', 'mg-consent'];
    for (const id of requiredIds) {
      expect(componentSrc).toMatch(new RegExp(`htmlFor="${id}"`));
      expect(componentSrc).toMatch(new RegExp(`id="${id}"`));
    }
    const requiredTestIds = [
      'mg-lead-magnet',
      'mg-lead-magnet-form',
      'mg-lead-magnet-firstname',
      'mg-lead-magnet-email',
      'mg-lead-magnet-company',
      'mg-lead-magnet-consent',
      'mg-lead-magnet-submit',
      'mg-lead-magnet-confirmation',
      'mg-lead-magnet-download',
    ];
    for (const tid of requiredTestIds) {
      expect(componentSrc).toMatch(new RegExp(`data-testid="${tid}"`));
    }
  });

  test('the article page imports and mounts the lead-magnet component', () => {
    expect(pageSrc).toMatch(/import\s+MachineGuardingLeadMagnet\s+from\s+['"]\.\.\/components\/MachineGuardingLeadMagnet['"]/);
    expect(pageSrc).toMatch(/<MachineGuardingLeadMagnet\s*\/>/);
  });

  test('confirmation copy reflects a real send (no leftover draft-state phrasing)', () => {
    expect(componentSrc).not.toMatch(/In a live send/);
    expect(componentSrc).not.toMatch(/REQUESTED\s*\(DRAFT\)/);
    expect(componentSrc).toMatch(/We just emailed/);
  });
});
