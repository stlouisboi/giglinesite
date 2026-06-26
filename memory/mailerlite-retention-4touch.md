# MailerLite Setup — Retention 4-Touch Sequence
**Spec:** GL-WEB-RET-001
**Authored:** Feb 2026

## Overview
Past-client retention sequence. Four emails over six months, triggered when a booking status flips to `report_delivered`. Backend automatically enrolls the client in MailerLite group `Retention - 4 Touch` at that moment.

## Backend trigger (already wired)
- File: `/app/backend/integrations/mailerlite.py` → `move_to_past_client()`
- Called from: `/app/backend/routes/portal.py` (line ~209, when booking status flips to `report_delivered`)
- Action: Adds contact to MailerLite groups **Past Client** AND **Retention - 4 Touch**.

## MailerLite UI setup (your side)
1. Confirm group `Retention - 4 Touch` exists (auto-created on first enrollment if missing).
2. Create a new **Automation** in MailerLite:
   - **Trigger:** When subscriber joins group `Retention - 4 Touch`
   - **Steps:** Four delay → send-email pairs (see cadence + copy below)
3. Set sender to `vince@giglinecompliance.com`.
4. Disable cross-sequence overlap: if the contact re-enters Lead Nurture or any other active list, pause this automation.

---

## Touch 1 — Day 30

**Delay from enrollment:** 30 days

**Subject:** `30 days out — how are the corrective actions coming?`

**Body (plaintext):**
> It's been about a month since the walkthrough. Wanted to check in — not to sell you anything, just to see how the corrective action log is moving.
>
> If you've hit a finding you're not sure how to close, call or text (336) 329-8899. That conversation doesn't cost anything.
>
> — Vince

---

## Touch 2 — Day 60

**Delay from enrollment:** 60 days

**Subject:** `One thing worth checking this month`

**Body (plaintext):**
> Quick note from the field.
>
> One of the most common gaps I see at the 60-day mark is chemical inventory drift — new products come in, the SDS library doesn't get updated. Worth a 10-minute sweep before it becomes a finding.
>
> If you want a fresh set of eyes before that happens, you know where to reach me.
>
> — Vince, GigLine Safety & Compliance, (336) 329-8899

---

## Touch 3 — Day 90

**Delay from enrollment:** 90 days

**Subject:** `90 days — your corrective action window`

**Body (plaintext):**
> Three months out from your walkthrough.
>
> If you had P2 findings, this is around the point where OSHA would expect to see documented corrective action if they showed up. If anything is still open and you're not sure how to document it, let's talk before it becomes a problem.
>
> (336) 329-8899.
>
> — Vince

---

## Touch 4 — Day 180

**Delay from enrollment:** 180 days

**Subject:** `Six months out — worth a second look`

**Body (plaintext):**
> Six months is a reasonable interval for a follow-up walkthrough — especially if you've added equipment, changed your chemical inventory, brought on new employees, or moved locations. Things change faster than most operations track.
>
> A second walkthrough starts at $1,200. Fixed quote before scheduling. Everything stays private.
>
> — Vince Lawrence
> GigLine Safety & Compliance
> (336) 329-8899
> giglinecompliance.com

---

## Notes
- All four emails are signed by Vince personally; no marketing footer beyond the address.
- The Day-180 email is the only one with a soft pricing mention ($1,200). Others are pure check-ins.
- If a contact replies to any touch, mark them as "Engaged" and pause the rest of the sequence.
