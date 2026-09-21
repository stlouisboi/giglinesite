/**
 * Machine Guarding lead-magnet regression tests.
 *
 * Locks in:
 *   - Feature flag `MG_LEAD_MAGNET_ENABLED` is defined and starts `false`
 *     so the form does not render in production until Batch 2C.
 *   - The component source contains no live-email transmission code
 *     (no fetch, no axios, no transactional-email SDK imports).
 *   - Consent checkbox defaults to unchecked.
 *   - Article page imports and mounts the component.
 *   - Honeypot is present and hidden from a11y tree.
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

  test('MG_LEAD_MAGNET_ENABLED feature flag is defined and defaults to false', () => {
    expect(featuresSrc).toMatch(/export\s+const\s+MG_LEAD_MAGNET_ENABLED\s*=\s*false/);
  });

  test('component early-returns null when the flag is false', () => {
    expect(componentSrc).toMatch(/if\s*\(\s*!\s*MG_LEAD_MAGNET_ENABLED\s*\)\s*return\s+null/);
  });

  test('component performs no live email transmission (no fetch, axios, or email SDK)', () => {
    expect(componentSrc).not.toMatch(/\bfetch\s*\(/);
    expect(componentSrc).not.toMatch(/\baxios\b/);
    expect(componentSrc).not.toMatch(/from\s+['"]@?resend/);
    expect(componentSrc).not.toMatch(/from\s+['"]@?mailerlite/);
    expect(componentSrc).not.toMatch(/from\s+['"]@?sendgrid/);
  });

  test('marketing consent checkbox defaults to unchecked', () => {
    // useState initialiser must set consent: false
    expect(componentSrc).toMatch(/consent:\s*false/);
  });

  test('honeypot input is present and hidden from a11y tree', () => {
    expect(componentSrc).toMatch(/name="website"/);
    expect(componentSrc).toMatch(/aria-hidden="true"/);
    expect(componentSrc).toMatch(/tabIndex=\{-1\}/);
  });

  test('confirmation state exposes an accessible download-PDF trigger', () => {
    expect(componentSrc).toMatch(/data-testid="mg-lead-magnet-download"/);
    expect(componentSrc).toMatch(/window\.print/);
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

  test('draft-state confirmation copy does not falsely claim an email was sent', () => {
    expect(componentSrc).toMatch(/In a live send/);
    expect(componentSrc).not.toMatch(/We (just )?sent your (checklist|PDF)/i);
    expect(componentSrc).not.toMatch(/Check your inbox/i);
  });
});
