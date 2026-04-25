# GigLine Email Sequences — MailerLite Reference

**Use this file as the source of truth when building/editing automations in MailerLite.**

All emails authored by Vince Lawrence. Tone: calm, direct, plain-language. No exclamation points. No marketing fluff.

**CAN-SPAM footer (required on every email):**
```
GigLine Safety & Compliance
3980 Premier Dr Ste 110 #1028, High Point, NC 27265
(336) 329-8899 · vince@giglinecompliance.com

Unsubscribe: {{unsubscribe}}
```

---

## SEQUENCE 1 — Lead Nurture (7 emails over 6 weeks)

**Trigger:** Subscriber added to "Lead Nurture" group (from /safety-check, /hazcom, /heat-guide, /intake, or /request-walkthrough form submissions where email is provided).

**Pause logic:** When `engagement_status = active`, contact is moved to "Paused — Active Engagement" group. Automation should NOT run for that group.

### Email 1 — Day 0 (Welcome / Delivery)
**Subject:** Your [thing they signed up for] is ready

> [Use the user-supplied content from GigLine_Email_Sequences.docx — Email 1]

### Email 2 — Day 3
**Subject:** The 3 OSHA citations I see most in small operations

> [Email 2 from doc]

### Email 3 — Day 7
**Subject:** What a Top 10 Fixes report actually looks like

> [Email 3 from doc]

### Email 4 — Day 14
**Subject:** How a Greensboro plant avoided a $45K citation

> [Email 4 from doc]

### Email 5 — Day 21
**Subject:** Your operation might be in this group

> [Email 5 from doc]

### Email 6 — Day 35 (Breakup)
**Subject:** Heads up — I'll stop emailing if I don't hear back

> [Email 6 from doc]

### Email 7 — Day 42 (Last value)
**Subject:** Last note: [single best Field Note]

> [Email 7 from doc]

---

## SEQUENCE 2 — Past Client Retention (4 emails over 12 months)

**Trigger:** Subscriber moved to "Past Client" group (when status hits `report_delivered` in `gl_intake_submissions`).

### Email 1 — 14 days after report delivered
**Subject:** Quick check-in — how's the corrective action list going?

> [Past Client Email 1 from doc]

### Email 2 — 90 days after report delivered
**Subject:** Three months since your walkthrough. A few things to watch.

> [Past Client Email 2 from doc]

### Email 3 — 6 months after report delivered
**Subject:** Time for a follow-up walkthrough?

> [Past Client Email 3 from doc]

### Email 4 — 12 months after report delivered
**Subject:** It's been a year. Here's what's changed in OSHA enforcement.

> [Past Client Email 4 from doc]

---

## Setup Checklist (do these in MailerLite dashboard)

- [ ] Confirm 3 groups exist: `Lead Nurture`, `Past Client`, `Paused — Active Engagement`
   *(Backend creates them on first lead — verify they appear after your first test signup.)*
- [ ] Set up sender domain (vince@giglinecompliance.com) — Settings → Domains → Verify SPF/DKIM
- [ ] Custom fields: `name`, `company`, `source_form`, `first_touch_source`, `first_touch_campaign`
- [ ] Build automation 1 — trigger: when subscriber added to `Lead Nurture` group
- [ ] Build automation 2 — trigger: when subscriber added to `Past Client` group
- [ ] Set both automations to skip subscribers in `Paused — Active Engagement` group (Conditions step)
- [ ] Add CAN-SPAM footer block to email template (Settings → Branding)
- [ ] Send test email from each automation to vince@giglinecompliance.com before activating

---

## Backend integration map

| Trigger | Backend file | Function | Action |
|---------|--------------|----------|--------|
| Safety Check submit | `routes/safety_check.py` | `submit_safety_check` | `add_to_lead_nurture` |
| Heat Guide download | `routes/heat_guide.py` | `request_heat_guide` | `add_to_lead_nurture` |
| HazCom purchase | `routes/hazcom.py` | `verify_hazcom` | `add_to_lead_nurture` |
| `/intake` submit | `routes/intake.py` | `submit_intake` | `add_to_lead_nurture` + `pause_engagement` |
| `/request-walkthrough` submit | `routes/walkthrough.py` | `submit_walkthrough_request` | `add_to_lead_nurture` (if email provided) |
| Report delivered | `routes/portal.py` | `upload_report` | `move_to_past_client` |

All MailerLite calls are fire-and-forget (`asyncio.create_task`) — they never block the API response. If MailerLite is down, the user still gets their confirmation email and form submission still works.

---

## Resend stays separate

Transactional emails (intake confirmation, booking confirmation, report ready, lead notification to Vince) all stay on Resend. **Do not** route any of those through MailerLite. Mixing transactional + marketing on one provider tanks deliverability.
