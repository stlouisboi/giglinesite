/**
 * CRV / Documentation-Review turnaround promise regression tests (Feb 2026).
 *
 * The Compliance Readiness Visit and the Documentation Readiness Review
 * deliver reports in 5 business days (not 48 hours — that timeline is
 * specific to the standalone Safety Walkthrough). This test pins the
 * copy on every CRV / DRR-facing surface so a well-meaning edit can't
 * re-introduce a Safety-Walkthrough turnaround into a CRV context.
 */
const fs = require('fs');
const path = require('path');

const files = {
  crvPage: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'ComplianceReadinessVisitPage.js'), 'utf8'),
  intakePage: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'ClientIntakePage.js'), 'utf8'),
  aboutPage: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'AboutPage.js'), 'utf8'),
  serviceDetail: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'ServiceDetailPage.js'), 'utf8'),
  caseStudy: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'CaseStudyMetalsFabricationPage.js'), 'utf8'),
  faq: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'FAQPage.js'), 'utf8'),
  docGap: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'DocumentationGapCheckPage.js'), 'utf8'),
  oshaDocReview: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'OSHADocumentationReviewNCPage.js'), 'utf8'),
  blogPenalty: fs.readFileSync(path.join(__dirname, '..', '..', 'pages', 'BlogOSHAPenaltyNC2026.js'), 'utf8'),
  assessmentCatalog: fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'assessmentCatalog.js'), 'utf8'),
};

describe('CRV and Doc Review copy pins to 5-business-day promise', () => {
  test('ComplianceReadinessVisitPage.js contains no "48 hour" turnaround language', () => {
    expect(files.crvPage).not.toMatch(/48\s*hour/i);
    expect(files.crvPage).toMatch(/5 business days/i);
  });

  test('ServiceDetailPage compliance-readiness-visit entry says 5 business days, not 48 hours', () => {
    const crvSection = files.serviceDetail.split("'compliance-readiness-visit'")[1] || '';
    expect(crvSection).toMatch(/5 business days/i);
    // and none of the surface CRV-specific 48-hour lines remain
    expect(crvSection.slice(0, 2000)).not.toMatch(/within 48 hours/i);
  });

  test('CaseStudyMetalsFabricationPage.js CRV write-up references 5 business days', () => {
    expect(files.caseStudy).toMatch(/within 5 business days of the on-site visit/);
    expect(files.caseStudy).toMatch(/within 5 business days of your own walkthrough/);
  });

  test('FAQ CRV answer (from-$2,500 combined engagement) says 5 business days', () => {
    const crvFaqRegion = files.faq.match(/Compliance Readiness Visit \(from \$2,500\)[\s\S]{0,1200}/);
    expect(crvFaqRegion).not.toBeNull();
    expect(crvFaqRegion[0]).toMatch(/within 5 business days/);
    expect(crvFaqRegion[0]).not.toMatch(/within 48 hours/);
  });

  test('BlogOSHAPenaltyNC2026 CRV mention says 5 business days', () => {
    const crvBlogRegion = files.blogPenalty.match(/A Compliance Readiness Visit walks[\s\S]{0,500}/);
    expect(crvBlogRegion).not.toBeNull();
    expect(crvBlogRegion[0]).toMatch(/5 business days/);
  });

  test('DocumentationGapCheckPage.js says 5 business days across seo, FAQ, and deliverable label', () => {
    expect(files.docGap).toMatch(/Written findings report in 5 business days\./);
    expect(files.docGap).toMatch(/Written Findings Report in 5 Business Days/);
    expect(files.docGap).not.toMatch(/within 48 hours/i);
    expect(files.docGap).not.toMatch(/in 48 hours/i);
  });

  test('OSHADocumentationReviewNCPage subhead says 5 business days', () => {
    expect(files.oshaDocReview).toMatch(/written report in 5 business days/);
    expect(files.oshaDocReview).not.toMatch(/within 48 hours/i);
  });

  test('assessmentCatalog Documentation Readiness Review nextStep says 5 business days', () => {
    expect(files.assessmentCatalog).toMatch(
      /Request the review, share your programs and records securely, and receive the written findings report within 5 business days\./,
    );
    expect(files.assessmentCatalog).not.toMatch(
      /Request the review, share your programs and records securely, and receive the written findings report within 48 hours/,
    );
  });

  test('assessmentCatalog Safety Walkthrough entry retains its 48-hour promise (unchanged)', () => {
    expect(files.assessmentCatalog).toMatch(/'Written report within 48 hours'/);
    expect(files.assessmentCatalog).toMatch(
      /Request the walkthrough, agree on an on-site date, and receive the written report within 48 hours of the visit\./,
    );
  });

  test('AboutPage and ClientIntakePage Vince narrative is scope-neutral (no 48-hour claim)', () => {
    // Vince intro appears on both /about and /intake. Neither should
    // promise a walkthrough-only turnaround since these pages serve
    // visitors from any service lane.
    const aboutVinceRegion = files.aboutPage.match(/I come to your facility, walk the areas that matter,[\s\S]{0,400}/);
    const intakeVinceRegion = files.intakePage.match(/I come to your facility, walk the areas that matter,[\s\S]{0,400}/);
    expect(aboutVinceRegion).not.toBeNull();
    expect(intakeVinceRegion).not.toBeNull();
    expect(aboutVinceRegion[0]).not.toMatch(/within 48 hours/);
    expect(intakeVinceRegion[0]).not.toMatch(/within 48 hours/);
    expect(aboutVinceRegion[0]).toMatch(/fixed timeline you know before we start/);
    expect(intakeVinceRegion[0]).toMatch(/fixed timeline you know before we start/);
  });
});
