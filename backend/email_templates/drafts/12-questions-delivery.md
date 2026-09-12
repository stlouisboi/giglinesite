# DRAFT: 12 Questions Delivery Email

**Feature flag**: `OSHA_TWELVE_QUESTIONS_ENABLED` (frontend) + matching backend guard.
**Type**: Transactional. Sent because the recipient explicitly requested the PDF.
**Consent handling**: Marketing-consent branch controls footer wording and unsubscribe link visibility. Do NOT show unsubscribe language to a non-subscriber.

---

## Subject
Your 12 Questions printable one-pager

## Preheader
The printable version of the field guide you requested is attached.

## Body

Hi {{first_name}},

Here is the printable one-pager for **12 Questions to Answer Before OSHA Walks In**.

Attached PDF: `12-Questions-Before-OSHA-Walks-In.pdf`

Reading time is about six minutes. The value comes from timing yourself against your own operation: walk to where each answer lives, and note the ones that take longer than they should.

If a few questions do not have obvious answers, the reasonable next step is one of GigLine's fixed-quote engagements:

- **Safety Walkthrough** — $1,300 starting. On-site review of physical hazards, written report in 48 hours.
- **Documentation Readiness Review** — $1,700 starting. Structured review of written programs, training records, evidence.
- **Compliance Readiness Visit** — $2,500 starting. Both, in a single visit. Saves $500 compared with purchasing the two standard scopes separately.

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
- [ ] Owner reviewed the field-guide copy at `/12-questions?preview=1`
- [ ] Owner approved this delivery email
- [ ] Backend renders the correct consent branch based on the `marketing_consent` flag stored on the lead record
- [ ] Non-consenting requesters are NOT enrolled in the five-touch sequence
- [ ] Placeholder PDF replaced with the final approved PDF
- [ ] Sending domain, SPF, DKIM, DMARC verified in Resend
- [ ] `OSHA_TWELVE_QUESTIONS_ENABLED` flipped to `true` in `frontend/src/config/features.js`
