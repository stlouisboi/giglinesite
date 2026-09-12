# Sample-Report Review, Phase 2 Batch 2B (Feb 2026)

**Status:** Owner-review-required. No changes shipped in Batch 2B; this memo records the current state and the open decisions.

## Current behavior on the live route `/sample-report`

The page (`/app/frontend/src/pages/SampleReportPage.js`) currently:
- Renders a gated flow that POSTs to `/api/sample-report/submit` when the buyer fills first name, work email, and company.
- Shows a success card referencing email delivery, then links to `/api/sample-report/pdf` for the fallback download.
- Also renders an "ungated" download option that opens the same PDF asset directly.
- Sends a UTM-tagged CTA to `/intake?service=safety-walkthrough-report&utm_source=sample-report&utm_medium=website&utm_campaign=sample-report-followup` on success.

The PDF served at `/api/sample-report/pdf` is a redacted representation of the 2026 metal-fabrication engagement whose public case study is currently withheld pending written client permission (`CASE_STUDY_PUBLIC = false`).

## Owner-review issues

1. **Permission alignment.** The public case study for the same engagement is behind an owner-approval gate. Serving a full redacted report that references the same engagement is inconsistent with that gate. Written client permission must be documented before either surface goes public.
2. **Delivery-claim wording.** The current success card implies email delivery. Any transactional-email delivery must (a) actually transmit and (b) match the consent-separation rules in Batch 2B. The current wording predates those rules.
3. **Redaction level.** The PDF should be re-audited against the same redaction list applied to the anonymized case-study page (`/app/memory/CASE_STUDY_REDACTION_LIST.md`). Any facility identifiers, employee names, machine identifiers, or chemical brand names surfaced in the PDF must be redacted or replaced with representative placeholders.

## Batch 2B scope decision (recorded)

**No Batch 2B code change to `SampleReportPage.js`.** The Batch 2B mandate says:
- "Do not reuse the current live Sample Report submission behavior for this preview."
- "Build the Batch 2B preview so it cannot transmit or imply delivery until separately approved."
- "Use a clearly labeled representative or fully redacted preview if permission is unavailable."
- "Keep the full email-delivery flow disabled pending owner approval."
- "Show up to three useful preview pages without requiring an email."
- "Offer the complete approved report format through an optional email form using the same consent rules."
- "Do not use a popup that blocks the preview."

Owner review required to answer:
- **A.** Should the live `/sample-report` gated submission remain enabled while Batch 2B is in preview, or should we disable it for consistency with `CASE_STUDY_PUBLIC = false`?
- **B.** If we ship a Batch 2B non-transmitting preview at a distinct route (for example, `/sample-report-preview` gated behind `RECOMMENDATION_ROUTER_ENABLED`), what redacted three-page excerpt is approved for the ungated preview?
- **C.** Is the redaction list on the current PDF asset aligned with `/app/memory/CASE_STUDY_REDACTION_LIST.md`? If not, Vince to name a target release date for the aligned version.

## Recommended sequence

1. Confirm A above (keep live vs. temporarily disable). If disabled, replace the gated submit with a small explanatory notice that lists the current status and offers a fixed-quote CTA to `/intake?service=compliance-readiness-visit`.
2. Confirm redaction alignment on the served PDF.
3. Build the Batch 2B non-transmitting preview at `/sample-report-preview?preview=1` once the three-page redacted excerpt is approved. Consent-separation rules apply.
4. Only after A, B, and C are documented, wire live transactional delivery in Batch 2C.

## Files in scope for a future edit

- `/app/frontend/src/pages/SampleReportPage.js` (existing live route)
- `/app/backend/email_templates/drafts/` (three-page-preview delivery template not yet drafted, pending B above)
- `/app/frontend/public/assets/` (redacted PDF asset)
- `/app/frontend/src/config/features.js` (would add `SAMPLE_REPORT_PREVIEW_ENABLED` flag if we ship a Batch 2B preview surface)

---

**No code changes made in this batch to the live sample-report flow or the served PDF.** This memo exists only to document the decisions the owner needs to approve before the next batch touches that surface.
