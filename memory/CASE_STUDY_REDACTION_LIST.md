# Phase 2 Batch 2A.1 — Case Study Redaction List

## Canonical route change
- **New neutral canonical**: `/case-study/metal-fabrication-readiness`
- **Legacy URL kept only as permanent redirect**: `/case-study/metals-fabrication-statesville` → `/case-study/metal-fabrication-readiness` (React `<Navigate replace>` + `vercel.json` `permanent: true`)
- `siteSearchIndex.js`, `sitemap.xml`, `generate-sitemap.js`, `generate-seo-pages.js`, all internal links, `HomePage.js`, `CaseStudyTeaser.js`, `ComplianceReadinessVisitPage.js`, `WalkthroughLandingPage.js`, and the case study's own SEO canonical + BreadcrumbList + Article `mainEntityOfPage` all updated to the new neutral URL.

## Redactions applied to the anonymized case study
| Item redacted | Before | After |
|---|---|---|
| Client name | "Amero Steel Supply" | "a small North Carolina metal fabrication operation" |
| City | "Statesville, NC" | "North Carolina" |
| Plant manager name | "Kevin Stutts, Plant Manager" | quote removed entirely; role described generically |
| Facility address | "170/174 Innovation Drive" | "the operation's planned facility relocation" |
| Report ID | "62FC03EB" | "Anonymized Engagement Example" |
| Visit / report dates | "June 18, 2026 / June 22, 2026 / Due Sept 1" | relative timeframes only ("four days after the walkthrough", "post-relocation") |
| Employee count | "9 employees / 9-person" | "Under 15 employees" |
| Equipment quantities | "two roll formers, two forklifts" | removed |
| Machine model / class references | "roll former cut-off mechanism", "D-coiler" | "one machine class", "a point-of-operation on one machine" |
| Chemical brand names | "Star Fire AW46 Hydraulic Oil", "Simple Green" | "a hazardous hydraulic-oil product", "a hazardous cleaner" |
| Container quantities | "four five-gallon pails" | removed |
| Internal system reference | "internal plant information website" | removed |
| Plant manager credentials | "The plant manager had completed OSHA 30-Hour General Industry Outreach Training" | removed |
| AI-generated documents claim | "some of it using AI-generated templates", "AI-generated template that don't match actual operations" | rewritten to "programs that don't match actual operations" (no source claim) |
| Turnaround discrepancy | "Written report delivered four days after the walkthrough" (unqualified) | now labeled as historical turnaround; the current standard commitment is "written report within 48 hours of the on-site visit" |
| Outcomes strip | "92.3% Closure Rate", implying all 13 closed | rewritten to explicitly show "1 Open at Reporting Point" and "4 Days Report Turnaround" |
| Pull quote | *"We knew some of these gaps existed…"* attributed to Kevin Stutts | **REMOVED**; awaiting owner confirmation of verbatim wording + written client permission before any restoration |

## CTA alignment
- Primary case-study CTA is now **Request a Compliance Readiness Visit** (`/intake?service=compliance-readiness-visit`, starting at $2,500, combined walkthrough + doc review, $500 saving vs purchasing separately).
- Secondary CTA is **Start with a Safety Walkthrough** ($1,300) with the qualifier "floor only" and a clarifying line noting it does not review written programs or training records.
- The prior CTA "A Safety Walkthrough starts at $1,300" is retired because the case study describes a combined engagement, not a walkthrough-alone.

## Owner approval flags
- ☐ **Verify or remove the pull quote** — currently removed pending Vince confirmation.
- ☐ **Written client permission** — required before any release. Even in the anonymized state, keep the case study private / non-indexed until Vince signs off. (Current preview state: still indexed; a follow-up may add `noindex` if you want it withheld from Google until permission is in hand — flag this in your response and I will add the meta tag.)
