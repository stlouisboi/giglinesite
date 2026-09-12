# DRAFT: First-Pull Checklist Delivery Email

**Feature flag**: `FIRST_PULL_CHECKLISTS_ENABLED` (frontend) + matching backend guard.
**Trigger**: Day 0, immediately after the requester submits the checklist form on `/first-pull/{slug}`.
**Send regardless of marketing consent**: Yes. The resource was requested. Delivery is transactional.
**Enroll in marketing sequence**: Only if `marketing_consent === true`.

Per-slug template variables control which checklist ships. All five checklists
(LOTO, PIT, HazCom, Incident, New Hire) reuse this same delivery template.

---

## Subject line

"Your {{checklist_title}} , First-Pull Checklist"

Example fills:
- "Your LOTO First-Pull Checklist , 8 Items an Inspector Asks For First"
- "Your Forklift & Powered Industrial Truck First-Pull Checklist"

## Preheader

The eight to twelve records this program is expected to produce on the spot.

## From

GigLine Safety & Compliance <vince@giglinecompliance.com>

## Body (plain text)

```
Hi {{first_name}},

Attached: {{checklist_title}} , First-Pull Checklist.

This one-page checklist shows the records and evidence an OSHA inspector,
customer auditor, or insurance loss-control officer typically asks for
first when they walk into a facility and ask about {{program_short_name}}.

How to use it:

1. Walk to where those items are supposed to live. Not the file cabinet,
   the actual retrieval point.
2. Time yourself. If any single item takes longer than three minutes to
   surface, that is a first-pull gap.
3. Mark every gap and schedule time to close it before the next audit.

This is an educational checklist. It is not a full compliance evaluation
and it does not replace a written program review or an on-site walkthrough.

If several items on this checklist are gaps, the next reasonable step is
GigLine's Documentation Readiness Review ($1,700) or a full Compliance
Readiness Visit ($2,500, both walkthrough and doc review in one engagement).

All engagements are fixed-quote and private. No retainer.

Full details: https://www.giglinecompliance.com/services

Questions?
Reply to this email or call (336) 329-8899.

Regards,
Vince Lawrence
GigLine Safety & Compliance
Kernersville, NC
```

## Template variables

- `{{first_name}}` , first name from form. Fall back to "there".
- `{{checklist_title}}` , full checklist title per `firstPullChecklists.js`
  entry.
- `{{program_short_name}}` , short program label. Examples: "lockout/tagout",
  "forklifts and powered industrial trucks", "hazard communication",
  "incident response", "new hire orientation".
- `{{checklist_pdf}}` , attachment filename per slug.
- `{{consent_status}}` , "opted in" or "not enrolled".
- `{{unsubscribe_url}}` , always present.

## Attachments (per slug)

- `LOTO-First-Pull-Checklist-v1.pdf`
- `Forklift-PIT-First-Pull-Checklist-v1.pdf`
- `HazCom-First-Pull-Checklist-v1.pdf`
- `Incident-Correction-First-Pull-Checklist-v1.pdf`
- `New-Hire-Orientation-First-Pull-Checklist-v1.pdf`

All five PDF assets are TO BE PRODUCED after owner content approval. The
current `/first-pull/{slug}` route renders the checklist as an on-screen
draft only.

## Footer (identical across all five slugs)

Same footer as `12-questions-delivery.md`, including unsubscribe link,
consent status, and legal disclaimer paragraph.

## Owner review checklist

- [ ] Every slug's checklist items match what an inspector typically asks first.
- [ ] Every disclaimer accurately notes that a checklist is not a compliance evaluation.
- [ ] "Next step" language routes to Documentation Readiness Review or Compliance Readiness Visit, not directly to an Ongoing Safety Support pitch.
- [ ] Prices match canonical source.
