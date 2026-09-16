# Safety Check, Email My Action Plan, transactional email draft

**Status:** DRAFT. Not wired. Not scheduled. Not sending.

**Trigger (design intent):** the buyer completes the free /safety-check tiered assessment and, on the result screen, opts to "Email my action plan". Marketing consent is a separate unchecked checkbox and does not gate this transactional delivery.

**Approvals required before wiring:** Vince Lawrence.

---

**From:** GigLine Safety & Compliance <vince@giglinecompliance.com>
**Reply-To:** vince@giglinecompliance.com
**Subject:** Your GigLine Safety Check action plan, {{result_level}}
**Preheader:** Three practical next actions inside, plus one recommended path.

---

Hi {{first_name}},

Here is the action plan the GigLine Safety Check generated for you.

**Your result level:** {{result_level}}

**Concern categories identified**
{{concern_categories_rendered_as_bulleted_list}}

**Three practical next actions**
1. {{action_1}}
2. {{action_2}}
3. {{action_3}}

**Recommended GigLine solution**
{{recommendation_name}}, {{price_or_starting_price}}

**Why it was recommended**
{{reason_text}}

**Continue when you are ready:** {{primary_action_url_and_label}}

Questions first? Reply to this email or call (336) 329-8899.

Thanks for taking the assessment,
Vince Lawrence
GigLine Safety & Compliance
Kernersville, NC

---

**Marketing consent status for this delivery:** {{consent_status}}
{{#if not_opted_in}}
This is a one-time transactional delivery. You will not receive additional marketing email from GigLine unless you explicitly opt in on a future visit.
{{else}}
You opted in to receive occasional practical safety guidance from GigLine. {{unsubscribe_url}}
{{/if}}

**Disclaimer**
The Safety Check is a self-assessment. It is not an inspection, an audit, or a compliance certification. GigLine is a private North Carolina safety-and-compliance practice, not affiliated with OSHA. Starting prices apply to the standard scope; final pricing is confirmed in writing before scheduling.

---

**Rendering notes (owner review, before wiring)**
- Transactional email. Sender = Vince, reply-to = Vince.
- No case-study reference while CASE_STUDY_PUBLIC is false.
- No invented statistics, no false urgency, no fear-heavy penalty repetition.
- Preview build renders this template locally in the browser; nothing is transmitted.
