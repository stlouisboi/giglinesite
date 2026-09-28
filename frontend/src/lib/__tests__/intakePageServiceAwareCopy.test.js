/**
 * Intake page "What happens next" per-service copy regression tests.
 *
 * Locks in that the intake page's step-3 (schedule) and step-4 (deliverable)
 * bodies vary based on the ?service=<slug> query param the intake reads,
 * so a visitor arriving from a Compliance Readiness Visit page never sees
 * Safety-Walkthrough-only copy ("48 hours of the walkthrough...") as a
 * fallback.
 */
const fs = require('fs');
const path = require('path');

const intakeSrc = fs.readFileSync(
  path.join(__dirname, '..', '..', 'pages', 'ClientIntakePage.js'),
  'utf8',
);

describe('Intake page "What happens next" is service-aware', () => {
  test('per-slug schedule and report content maps are defined', () => {
    expect(intakeSrc).toMatch(/scheduleBySlug\s*=\s*\{/);
    expect(intakeSrc).toMatch(/reportBySlug\s*=\s*\{/);
  });

  test('Compliance Readiness Visit slug gets its own step-4 report copy (5 business days, combined report, 30/60/90 action ladder)', () => {
    expect(intakeSrc).toMatch(/'compliance-readiness-visit':\s*'Within 5 business days of the visit\./);
    expect(intakeSrc).toMatch(/30\/60\/90 action ladder/);
  });

  test('Documentation Readiness Review slug reflects the remote, no-visit reality', () => {
    expect(intakeSrc).toMatch(/'documentation-readiness-review':\s*'Once you approve the quote, you send the program binder or shared-drive access\. No on-site visit is required/);
    expect(intakeSrc).toMatch(/'documentation-readiness-review':\s*'Within 5 business days\. A gap report/);
  });

  test('Safety Walkthrough slug retains its existing 48-hour report language', () => {
    expect(intakeSrc).toMatch(/'safety-walkthrough':\s*'Within 48 hours of the walkthrough/);
  });

  test('Ongoing Safety Support and Control System buildout have delivery-appropriate language', () => {
    expect(intakeSrc).toMatch(/'ongoing-safety-support':\s*'Once you approve the monthly quote/);
    expect(intakeSrc).toMatch(/'safety-control-system-buildout':\s*'A delivered program set/);
  });

  test('fallback default step-4 body avoids service-specific timelines', () => {
    expect(intakeSrc).toMatch(/step4Default\s*=\s*'In writing\./);
    expect(intakeSrc).not.toMatch(/step4Default\s*=\s*'Within 48 hours/);
  });

  test('step headers renamed to service-neutral phrasing (engagement / deliverable)', () => {
    expect(intakeSrc).toMatch(/'We schedule the engagement'/);
    expect(intakeSrc).toMatch(/'You get the deliverable in writing'/);
  });
});
