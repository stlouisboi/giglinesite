# DRAFT: First-Pull Checklist Delivery Email

**Feature flag**: `FIRST_PULL_CHECKLISTS_ENABLED` (frontend) + matching backend guard.
**Type**: Transactional. Sent because the recipient explicitly requested the specific checklist PDF.
**Consent handling**: Marketing-consent branch controls footer wording and unsubscribe link visibility. Do NOT show unsubscribe language to a non-subscriber.
**Template variables**: `{{first_name}}`, `{{checklist_program}}`, `{{checklist_pdf_url}}`, `{{unsubscribe_url}}`, `{{consent_status}}`, `{{linked_kit_name}}`, `{{linked_kit_url}}`.

---

## Subject
Your {{checklist_program}} First-Pull Checklist

## Preheader
The printable version of the checklist you requested is attached.

## Body

Hi {{first_name}},

Here is the **{{checklist_program}} First-Pull Checklist** you requested.

Attached PDF: `{{checklist_pdf_url}}`

Each item is classified so you can tell at a glance whether it is a specific regulatory requirement, an applicability-dependent requirement, or a GigLine readiness practice. That distinction matters when leadership asks why an item is on your list.

If several items on the checklist are gaps, two reasonable next steps:

- **{{linked_kit_name}}** — the self-serve control system for this program. {{linked_kit_url}}
- **Documentation Readiness Review** — $1,700 starting. A structured review of the written programs and evidence for this and related standards.
- **Compliance Readiness Visit** — $2,500 starting. Combined floor and documentation review. Saves $500 compared with purchasing the two standard scopes separately.

Fixed quote before scheduling. Private engagement. No retainer required.

Vince Lawrence
GigLine Safety & Compliance
(336) 329-8899
https://www.giglinecompliance.com

---

## Footer — CONSENT-BASED, choose ONE branch

### Branch A: consent = false (unchecked)
> You requested this resource. You are not subscribed to ongoing marketing emails.
> (No unsubscribe link is included because the recipient was never subscribed.)

### Branch B: consent = true (checked)
> You also opted into occasional practical safety guidance from GigLine.
> [Unsubscribe or manage preferences]({{unsubscribe_url}})

---

## Activation checklist
- [ ] Owner reviewed each first-pull checklist at `/first-pull/<slug>?preview=1`
- [ ] Owner approved this delivery email
- [ ] Backend renders the correct consent branch based on the `marketing_consent` flag on the lead record
- [ ] Non-consenting requesters are NOT enrolled in the five-touch sequence
- [ ] Placeholder PDF paths replaced with the final approved PDFs per checklist slug
- [ ] Linked kit URL points at the released kit for LOTO/PIT/HazCom and at the waitlist page for Incident and New Hire
- [ ] Sending domain, SPF, DKIM, DMARC verified in Resend
- [ ] `FIRST_PULL_CHECKLISTS_ENABLED` flipped to `true`
