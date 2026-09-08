---
title: Corrective Action Tracker, Standard Template
eyebrow: Template 03
subtitle: The single source of truth for every open, in-progress, and closed finding. Every field is required at row-open time except Verified fields, which populate at closure.
tags: TEMPLATE · WORKING DOCUMENT
code: GL-TPL-OSS-03
---

# Corrective Action Tracker, Standard Template

## Purpose

The tracker is the operational spine of the Ongoing Safety Support engagement. If a finding is not on the tracker, it did not happen. If a correction is not verified in the tracker, it is not closed.

This template describes:

- What each column means
- When to update each column
- What "verified" requires

The physical tracker lives in the client's private folder as `GL-[CLIENT-CODE]-tracker.xlsx` (or the equivalent Google Sheet) and is exported to PDF for each monthly delivery packet.

## Column definitions

| Column | Populated when | Standard for the field |
|---|---|---|
| Finding ID | Row-open | Format: GL-[CLIENT-CODE]-YYYY-###. Sequence within the calendar year. Never re-used. |
| Discovered date | Row-open | ISO date, YYYY-MM-DD |
| Source | Row-open | Walkthrough / Record review / Incident / Near miss / Client-reported |
| Standard reference | Row-open | Applicable OSHA CFR or internal program section |
| Hazard description | Row-open | Plain-language, one to two sentences. Written for a plant manager, not a lawyer. |
| Photo reference | Row-open | Filename in secure folder. No PII in the filename. |
| Severity | Row-open | Critical / High / Medium / Low |
| Priority | Row-open | Immediate / 30-day / 60-day / 90-day / Program-level |
| Owner (client-side) | Row-open | Named person accountable for the correction |
| Target date | Row-open | ISO date. Set based on priority. |
| Current status | Updated monthly | Open / In progress / Verified / Closed / Deferred |
| Last update note | Updated monthly | One-line change captured this cycle |
| Last updated date | Updated monthly | ISO date |
| Verification method | Closure | Photo / Document / Retraining record / Direct observation |
| Verified date | Closure | ISO date when GigLine confirmed correction |
| Notes | Any time | Context, decisions, scope questions, deferred rationale |

## Suggested Excel or Sheets structure

```
GL-CLIENT-YYYY-001 | 2026-09-15 | Walkthrough | 1910.147 | LOTO padlocks missing personal identifiers | photos/2026-09-15-loto-01.jpg | High | 30-day | Maintenance lead | 2026-10-15 | Open | Row created | 2026-09-15 |   |   |
```

## Priority-to-target-date defaults

Use these unless the client-specific hazard demands a shorter window.

| Priority | Default target date |
|---|---|
| Immediate | Same day |
| 30-day | Discovered date + 30 days |
| 60-day | Discovered date + 60 days |
| 90-day | Discovered date + 90 days |
| Program-level | Next annual review |

## Verification standard

A finding is only marked **Verified** when GigLine has one of the following in the client folder:

- A dated after photo that documents the correction, or
- A dated document (training roster, revised program page, purchase invoice, engineering drawing) that documents the correction, or
- A direct in-person observation by GigLine, dated and noted in the row.

Client claims of correction, without one of the above, keep the finding in **In progress**.

## Deferred rationale

A finding may be moved to **Deferred** only with written client acknowledgment. The Notes field must include:

- Who authorized the deferral (client contact name)
- Reason for deferral
- New anticipated action window (quarter and year)

Deferred findings roll forward on the tracker until they either close or become a recurring issue at the annual review.

## Monthly cycle

At every service month, GigLine:

1. Adds any findings discovered that month, one row per finding.
2. Updates the status column and last update note for every open and in-progress finding.
3. Moves verified findings to Verified with the verification method and verified date.
4. Reviews the count of findings past target date and flags them in the monthly management summary.

## Annual archive

At each anniversary of the engagement, all findings marked **Verified** or **Closed** are archived to a separate sheet named `Archive-YYYY`. The working sheet keeps only findings that are Open, In progress, or Deferred. This keeps the working tracker readable without losing history.

## Handoff standard

If GigLine transitions the client to a new consultant, or the client takes the tracker in-house, GigLine delivers the tracker with:

- All rows populated per the column definitions above
- A one-page tracker legend (this document)
- A written engagement transition document (Template 08)
