# Recommendation Delivery, transactional email draft

**Status:** DRAFT. Not wired to any transactional-email provider. Not scheduled. Not sending.

**Trigger (design intent, not yet wired):** the buyer explicitly requests "Email my recommendation" on the /recommendation router (or the compact service-page embed). The delivery is transactional; it fires whether or not marketing consent is checked. Marketing consent controls only the separate follow-up sequence.

**Approvals required before wiring:** Vince Lawrence.

---

**From:** GigLine Safety & Compliance <vince@giglinecompliance.com>
**Reply-To:** vince@giglinecompliance.com
**Subject:** Your GigLine recommendation, {{recommendation_name}}
**Preheader:** {{price_or_starting_price}}. One primary next step and one alternative inside.

---

Hi {{first_name}},

Here is the recommendation the GigLine tool returned based on your answers.

**Recommendation:** {{recommendation_name}}
**Price or starting price:** {{price_or_starting_price}}

**Why this fits your answers**
{{reason_text}}

**What is included**
{{included_lines_rendered_as_bulleted_list}}

**What is not included**
{{not_included_lines_rendered_as_bulleted_list}}

**Expected next step**
{{next_step_text}}

**One alternative**
{{alternative_name_and_price_or_"none"}}

**Your answers**
{{answer_summary_rendered_as_bulleted_list}}

**Ready to move?**
{{primary_action_url_and_label}}

If you would rather talk it through first, reply to this email or call (336) 329-8899.

Thanks for reading,
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
GigLine is a private North Carolina safety-and-compliance practice. GigLine is not affiliated with OSHA and does not guarantee any inspection outcome. Starting prices apply to the standard scope; final pricing is confirmed in writing before scheduling.

---

**Rendering notes (owner review, before wiring)**
- Template is transactional. Sender = Vince, reply-to = Vince, no "no-reply" address.
- No case-study reference until CASE_STUDY_PUBLIC is flipped and written client permission is on file.
- No invented statistics, no invented client stories, no discounts, no bonuses.
- No em/en dashes. Commas and periods only.
- Preview build renders this template locally in the browser; nothing is transmitted.
