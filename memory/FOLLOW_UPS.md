# GigLine Time-Based Follow-Ups

## ~Feb 27, 2026 — GA4 Funnel Review (2 weeks after Feb 13, 2026 deploy)

**Set:** Feb 13, 2026
**Trigger date:** ~Feb 27, 2026 (two weeks after `intake_submit_success` shipped)

**What to check in GA4 (property G-FNX42NP1QT):**

1. **Hero CTA distribution** — Reports → Engagement → Events:
   - `hero_cta_primary` (Schedule a Compliance Readiness Visit → /intake?service=compliance-readiness-visit)
   - `hero_cta_secondary` (Request a Safety Walkthrough → /request-walkthrough)
   - **Signal:** if primary ≥ 40% of total hero CTA clicks, the $1,500 anchor + CTA swap are working
   - **Action if secondary dominates:** consider equalizing visual weight or A/B testing CTA copy

2. **Services CTA distribution** — filter `services_cta_click`:
   - Group by `cta_text` to see which Readiness Path stage / CRV / Control System CTAs land most
   - **Signal:** if "Readiness Path · Review both" (CRV) leads, the sales path is working as designed

3. **Form conversion rate** — `intake_submit_success`:
   - Group by `service_requested`
   - Cross-reference vs total hero/services CTA clicks → real conversion %

4. **Promote to Key Event** (3 clicks, no code):
   - GA4 Admin → Events → toggle "Mark as key event" for `intake_submit_success`
   - Enables attribution in Acquisition reports + Google Ads conversion goal if/when paid traffic starts

**What to tell Emergent if you want changes:**
- "Primary CTA is converting at X%, secondary at Y% — make the primary even more prominent" → CTA visual weight tweak
- "Most clicks are on Readiness Path Stage 1 (Find the issues, $850), not CRV ($1,500) — anchor isn't landing" → reconsider hero copy / pricing reference visibility
- "Form completion rate is below 20% on the intake page" → form is too long; consider a shorter first-touch form
