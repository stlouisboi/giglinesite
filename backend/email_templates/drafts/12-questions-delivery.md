# DRAFT: 12 Questions Delivery Email

**Feature flag**: `OSHA_TWELVE_QUESTIONS_ENABLED` (frontend) + matching backend guard.
**Trigger**: Day 0, immediately after the requester submits the 12 Questions form on `/12-questions`.
**Send regardless of marketing consent**: Yes. The resource was requested. Delivery is transactional.
**Enroll in marketing sequence**: Only if `marketing_consent === true` in the submission payload.

---

## Subject line options

- Primary: "Your 12 Questions to Answer Before OSHA Walks In"
- Alternate: "12 Questions, delivered. Here's the PDF."

## Preheader

Twelve prompts the site walkthrough asks first, with the paper it needs behind each one.

## From

GigLine Safety & Compliance <vince@giglinecompliance.com>

## Reply-to

vince@giglinecompliance.com

## Body (plain text)

```
Hi {{first_name}},

Attached: 12 Questions to Answer Before OSHA Walks In.

The PDF walks the same twelve questions in the order a compliance officer
typically asks them, and lists the paper each question actually needs. If a
question does not have an obvious answer at your operation, that is not a
citation, it is a gap flag worth reviewing in daylight rather than during an
inspection.

How to use it:

1. Print two copies. One for the binder, one for the floor.
2. Answer each question with the source of your evidence, the specific
   binder tab, folder, or file name.
3. Circle every question that does not have a direct source and schedule
   time to close that item this quarter.

If you would like a second set of eyes on the answers, GigLine offers:

- Safety Walkthrough , $1,300. On-site review of physical hazards with a
  written report in 48 hours.
- Documentation Readiness Review , $1,700. Structured review of written
  programs and training evidence.
- Compliance Readiness Visit , $2,500. Both, in one visit. Saves $500 vs.
  purchasing them separately.

All three are fixed-quote and private. No retainer.

Full pricing: https://www.giglinecompliance.com/services

Questions?
Reply to this email or call (336) 329-8899.

Regards,
Vince Lawrence
GigLine Safety & Compliance
Kernersville, NC
```

## Body (HTML variables)

- `{{first_name}}` , first name from the form. Fall back to "there" if empty.
- `{{unsubscribe_url}}` , appended in the footer of every send. Even
  transactional sends should include this to match the marketing sends'
  footer pattern.
- `{{consent_status}}` , "opted in" or "not enrolled" text used in the
  confirmation footer so the requester sees what they agreed to.

## Footer (appears on every send)

```
This email delivers the resource you requested at
https://www.giglinecompliance.com/12-questions.

Marketing consent status for this address: {{consent_status}}
Unsubscribe from future GigLine safety guidance: {{unsubscribe_url}}

GigLine Safety & Compliance, Kernersville, NC 27284
(336) 329-8899, vince@giglinecompliance.com

GigLine is a safety consulting practice. GigLine is not a law firm and does
not provide legal advice. Federal OSHA rules apply broadly, state OSH plans
may impose additional requirements. Every recommendation must be evaluated
against your specific operation, equipment, and workforce.
```

## Attachments

- `12-Questions-Before-OSHA-Walks-In-v1.pdf` (draft PDF asset, to be built
  from the same content shown on `/12-questions` once the copy is approved).

## Owner review checklist

- [ ] Subject line reads as delivery of a requested resource, not a marketing pitch.
- [ ] Body voice matches the site (calm, specific, practical, not fear-heavy).
- [ ] Prices match `frontend/src/data/servicePricing.js` (canonical).
- [ ] Disclaimer language matches site-wide standard.
- [ ] Unsubscribe present in footer.
- [ ] Consent status shown so the requester can verify their choice.
