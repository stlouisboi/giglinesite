---
title: External Vetting Briefs, Perplexity and Claude
eyebrow: AI Review Prompts
subtitle: Two ready-to-paste prompts for external red-team review of the Ongoing Safety Support offer. Attach the SOP and web page markdown sources alongside each prompt.
tags: PROMPTS · READY TO PASTE · V2
code: GL-VET-OSS-100
---

# External Vetting Briefs

These prompts are designed to produce criticism, not approval. Send the full SOP and website page with the applicable prompt.

Attach with either prompt:

- `00-GigLine-Ongoing-Safety-Support-SOP.md`
- `00b-Ongoing-Safety-Support-Web-Page.md`

Do not send the prior conversational analysis by itself. The SOP and page are the proposed system of record for this vetting round.

---

# Prompt for Perplexity

I am evaluating a new recurring service for GigLine Safety and Compliance, a small safety consulting business serving manufacturers, warehouses, contractors, and fleets in the Piedmont Triad of North Carolina.

The proposed offer is **GigLine Ongoing Safety Support**, starting at **$1,650 per month** after a paid Compliance Readiness Visit. The starting scope is intended for a one-location, one-primary-shift, low-to-moderate complexity employer, generally with 10 to 50 employees. The draft caps total monthly service capacity at eight hours, including travel, an on-site visit, reporting, a management meeting, and routine support.

I am attaching:

1. The internal service-delivery SOP
2. The proposed website page

Act as a skeptical market, regulatory, pricing, and risk researcher. Do not merely summarize the documents and do not praise the idea unless evidence supports it.

Research current information and answer:

1. Is $1,650 per month commercially realistic for this defined scope in North Carolina and comparable U.S. markets?
2. What do credible competitors include and exclude in fractional or outsourced safety services?
3. Is eight total hours a realistic delivery budget after travel, documentation, meetings, and client communication?
4. Which parts of the website could create misleading expectations about acting as the client's safety manager, OSHA compliance, incident prevention, or regulatory responsibility?
5. What North Carolina or federal legal, regulatory, insurance, or professional-liability issues should be reviewed before launch?
6. Are the scope boundaries adequate for incident response, OSHA inspections, LOTO, machine guarding, competent-person duties, industrial hygiene, environmental matters, and employee training?
7. Does requiring a paid Compliance Readiness Visit before the retainer strengthen the model or create unnecessary sales friction?
8. How does free North Carolina OSH consultation affect the offer, and what defensible distinction may GigLine make without misrepresenting the state program?
9. What parts of this service will AI commoditize over the next three years, and what parts remain defensible because they require observation, verification, judgment, trust, or management accountability?
10. What important failure modes, hidden costs, or client-abuse patterns are missing?
11. What contract provisions should a North Carolina attorney specifically examine?
12. What professional insurance coverages and limits should GigLine discuss with a licensed insurance professional?
13. What are the three strongest reasons to launch, the three strongest reasons not to launch, and the minimum changes required before a three-client pilot?

Source requirements:

- Cite every material factual claim with a direct link.
- Prioritize OSHA, NCDOL, statutes, court or agency materials, BLS, recognized insurers, professional associations, and direct competitor service pages.
- Separate verified facts, market observations, and your own inferences.
- Give publication and effective dates where they matter.
- Do not invent North Carolina licensing requirements or claim that a contractual disclaimer eliminates liability.
- Identify uncertainty clearly.

End with a red-team verdict using one of these outcomes:

- Launch the pilot as drafted
- Launch only after specified changes
- Do not launch in this form

Then provide a prioritized correction table with: issue, severity, evidence, recommended change, and owner to consult.

---

# Prompt for Claude

I need a rigorous service-design and copy review, not encouragement.

GigLine Safety and Compliance is considering **Ongoing Safety Support**, a recurring service starting at **$1,650 per month**. It follows a paid Compliance Readiness Visit and is intended to keep inspections, corrective actions, training records, written programs, and management follow-up moving for small employers without dedicated safety staff.

I am attaching:

1. The internal SOP
2. The proposed website page

Review the two documents as four people at once:

- A skeptical small manufacturing owner deciding whether to buy
- An experienced safety consultant protecting delivery capacity
- A professional-services operator protecting margin and repeatability
- A plaintiff-side reader looking for promises, ambiguity, contradictions, and responsibility GigLine may accidentally assume

Do not rewrite immediately. First diagnose.

## Part 1: Offer logic

1. State what the customer is actually buying in one sentence.
2. Identify any mismatch among the promise, deliverables, price, monthly time cap, and likely client expectations.
3. Determine whether **Ongoing Safety Support**, **Safety Program Partner**, or **Fractional Safety Manager** is the clearest and safest category language. Explain the tradeoff.
4. Test whether the required Compliance Readiness Visit creates a logical customer journey.
5. Identify anything that may cannibalize GigLine's $2,500-plus corrective-action work or $4,500-plus control-system work.

## Part 2: Operational red team

1. Walk through a worst-case month involving an injury, overdue serious hazard, demanding owner, missing records, and 90 minutes of round-trip travel.
2. Show exactly where eight hours fails or holds.
3. Identify scope-creep pathways and propose enforceable operational controls.
4. Identify what should be standardized, automated, templated, delegated, referred, or separately quoted.
5. Test the three-client pilot and recommend objective pass/fail thresholds.
6. Identify dependencies on Vince that would prevent scaling or create health and scheduling pressure.

## Part 3: AI durability

1. Divide the deliverables into work AI can automate now, work AI will likely cheapen soon, and work that remains meaningfully human.
2. Recommend how AI should reduce delivery cost without weakening confidentiality, accuracy, or professional judgment.
3. Determine whether AI-generated safety-document validation should be included, offered as an add-on, or made a separate service.
4. Identify any website language about AI that is compelling versus defensive or unnecessary.

## Part 4: Website conversion and trust

1. Mark copy that is vague, repetitive, too legalistic, too long, or likely to create an objection.
2. Identify the strongest buying trigger and whether the hero expresses it.
3. Evaluate whether publishing **starting at $1,650 per month** helps qualification or causes price anchoring problems.
4. Recommend the best CTA and minimum qualification-form fields.
5. Identify questions a serious buyer will still have after reading the page.
6. Flag every sentence that sounds like a guarantee, certification, transfer of responsibility, or broader scope than the SOP supports.

## Part 5: Decision

Provide:

- A go/no-go verdict
- The five most important corrections before launch
- A revised service architecture if the current one is flawed
- A section-by-section website revision plan
- A list of contract issues for an attorney, without pretending to give legal advice
- A list of insurance questions for a licensed broker
- A 90-day pilot scorecard

Preserve GigLine's core positioning: **Find the gaps before OSHA does** and **FLOOR to FINDINGS to FIXES to PROOF**. Do not turn the offer into generic corporate consulting, an unlimited retainer, or a binder-writing service.

---

# How to use these prompts

1. Open Perplexity or Claude in a fresh conversation.
2. Copy the full prompt for that engine above.
3. Attach both files: `00-GigLine-Ongoing-Safety-Support-SOP.md` and `00b-Ongoing-Safety-Support-Web-Page.md`.
4. Send.
5. When the response returns, paste it back into the GigLine build conversation and we will translate the highest-signal findings into a concrete SOP and web-page revision plan in one pass.

Send both prompts through both engines when possible. The two systems answer differently and will surface complementary failure modes.
