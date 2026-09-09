---
title: Capacity Ledger, Standard Template
eyebrow: Template 05
subtitle: The internal time log used to keep every service month inside the agreed eight-hour capacity. Every hour or partial hour is captured here before it appears in the client summary.
tags: TEMPLATE · INTERNAL
code: GL-TPL-OSS-05
---

# Capacity Ledger, Standard Template

## Purpose

The Capacity Ledger is GigLine's internal defensible record of the time spent on each client's engagement each month. It supports:

- Transparent capacity conversations with the client
- Change-order justification when a month runs over
- Historical evidence if the scope of the engagement is ever challenged
- Continuous improvement (where GigLine's time is actually going month over month)

The ledger is internal. Its summary (Section 7 of the monthly management summary) is what the client receives.

## Ledger structure

Every entry uses the following fields. Keep one ledger file per client per calendar year: `GL-[CLIENT-CODE]-capacity-YYYY.xlsx`.

| Field | Standard |
|---|---|
| Date | ISO date, YYYY-MM-DD |
| Start time | 24-hour local, HH:MM |
| End time | 24-hour local, HH:MM |
| Duration | Auto-calculated, decimal hours to nearest 0.25 |
| Activity type | On-site / Prep / Remote / Meeting / Admin / Travel |
| Corrective actions touched | Comma-separated Finding IDs, or blank |
| Deliverable produced | e.g., "Sept management summary" or "email response to plant manager" |
| Notes | Brief, factual |

## Activity type definitions

| Type | Counts against monthly capacity | Description |
|---|---|---|
| On-site | Yes | Walkthrough, on-site record review, close-out. Capped at 2.5 hours per visit. |
| Prep | Yes | Reviewing prior summary, pulling records, drafting walkthrough plan. |
| Remote | Yes | Email, scheduled phone or video, short document reviews. Capped at 45 minutes per month. |
| Meeting | Yes | Monthly management review meeting. |
| Admin | Yes | Documenting time, updating tracker, saving photos to client folder. |
| Travel | No | Drive to and from site within the 45-minute radius. Not billable, not against capacity. |

If a client is outside the 45-minute radius and the extended travel was agreed in writing, treated as billable, and reflected on the invoice, log Travel as an activity type with a "Billed separately" note.

## Monthly rollup

At the end of every service month, roll the ledger into these totals:

| Bucket | Hours |
|---|---|
| On-site (walkthrough + review + close-out) | # |
| Prep | # |
| Remote support (client-billable capacity) | # |
| Meeting (management review) | # |
| Admin (documentation, tracker updates) | # |
| **Total capacity used** | **#** |
| **Capacity remaining out of 8 hours** | **#** |

## Overrun handling

When the month is projected to exceed 8 hours, the SOP requires that GigLine notify the client in writing before overrunning. Log the overrun conversation in the ledger:

- Date of notice
- Client-side person notified
- Option chosen (defer priority, reduce another activity, change order)
- Any written confirmation received

If GigLine absorbs an overrun as a one-time courtesy, log it explicitly:

- "Absorbed [# hours] as one-time courtesy, next overrun requires change order."

More than one absorption per quarter for the same client is a signal for scope renegotiation at renewal.

## Retention

Keep the current-year ledger in the client's private folder. At year-end, archive it alongside the corrective-action tracker archive. Retain the ledger for the same minimum six years as the tracker.
