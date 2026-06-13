# GL-WEB-014 — Part A Rename + Pricing Update Deliverable

**Build Spec:** GL-WEB-014 (Services Page Rebuild + Global Rename)
**Date Completed:** June 13, 2026
**Slug Preserved:** `/documentation-gap-check` (Option A confirmed — URL unchanged, content renamed)

---

## Part A — Global Rename Mapping (Confirmed Applied)

| Find | Replace With |
|---|---|
| "Documentation Gap Check" | "OSHA Documentation Readiness Review" |
| "Gap Check" (brand-term usage) | "Documentation Readiness Review" |
| "gap_check" enum | (not present as enum — backend used label strings; renamed) |
| "Documentation Review & Gap Check" | "OSHA Documentation Readiness Review" |
| "documentation gap check" (sentence case) | "OSHA Documentation Readiness Review" |
| "Compliance Gap Check" (page name) | "Compliance Readiness Visit" |

**NOT changed:** generic descriptors like "documentation gaps," "paperwork gaps," and "AI documentation gaps" — these describe a real-world condition (gaps exist), not the brand service name. Per spec, only brand-term usage was renamed.

---

## File-by-File Changes Applied

### Frontend — React pages
| File | Changes |
|---|---|
| `/app/frontend/src/pages/ServicesPage.js` | **COMPLETE REBUILD** per Part B spec — 3 primary cards (Walkthrough $850 / Compliance Readiness Visit $1,500 / OSHA-Ready Control System $4,500), 4 additional services with floor pricing block, 2 recurring services, Case Study Teaser, 90-Second Safety Check band, bottom CTA. Card 2 visually elevated (blue border + Star icon + MOST POPULAR badge). |
| `/app/frontend/src/pages/HomePage.js` | Hero pricing line ($650→$850, "Doc Gap Checks"→"OSHA Documentation Readiness Reviews"). Headline accent word "OSHA-Focused Gap Checks"→"OSHA Documentation Readiness Reviews". Sub-paragraph rewrite. Service offer schema name + price ($550→$750). SEO meta title/desc. JSON-LD priceRange ($550-$1200 → $750-$4500). |
| `/app/frontend/src/pages/DocumentationGapCheckPage.js` | All H1/eyebrow/sub-header/closing copy renamed. Price $550→$750. "documentation gap check" → "OSHA Documentation Readiness Review" everywhere in body copy. Intake form CTA label updated. URL slug **preserved** as `/documentation-gap-check`. |
| `/app/frontend/src/pages/OshaComplianceGapCheckPage.js` | Renamed to "Compliance Readiness Visit" throughout. Price $1,200→$1,500. All "gap check" body copy renamed. URL slug **preserved** as `/osha-compliance-gap-check`. |
| `/app/frontend/src/pages/SafetyWalkthroughPage.js` | Price line $650→$850. SEO description updated. |
| `/app/frontend/src/pages/CityLandingPage.js` | All 13 city seoDesc strings: `Starting at $650.` → `Starting at $850.` (bulk replace_all). |
| `/app/frontend/src/pages/FAQPage.js` | Walkthrough cost FAQ rewritten ($650 single-tier with travel modifier → $850 simple). Follow-up walkthrough FAQ rewritten ($550/$650 reference → Quarterly Maintenance / Annual Partner references). Bottom CTA $650→$850. |
| `/app/frontend/src/pages/SafetyCheckPage.js` | Pricing reference $650→$850. |
| `/app/frontend/src/pages/HeatGuidePage.js` | CTA button $650→$850. |
| `/app/frontend/src/pages/BlogHazComRequirements.js` | CTA caption $650→$850. |
| `/app/frontend/src/pages/BlogOSHAViolations.js` | CTA caption $650→$850. |
| `/app/frontend/src/pages/ServiceAreasPage.js` | Triad Core pricing header $650→$850. |
| `/app/frontend/src/pages/HazComThankYouPage.js` | CTA button "Request a Walkthrough — $650+" → "$850+". |
| `/app/frontend/src/pages/ClientIntakePage.js` | Service dropdown option label `'Documentation & Gap Check'` → `'OSHA Documentation Readiness Review'`. Value enum (`doc_review`) preserved for downstream routing continuity. |

### Frontend — Components
| File | Changes |
|---|---|
| `/app/frontend/src/components/ContactForm.js` | Service dropdown label `'Documentation Review & Gap Check'` → `'OSHA Documentation Readiness Review'`. |
| `/app/frontend/src/components/Footer.js` | Tagline "Safety Walkthroughs and Gap Checks for Small Operations" → "...Documentation Readiness Reviews...". |
| `/app/frontend/src/components/SEO.js` | Default fallback title same rename. Added `ogImage` prop support (from earlier session). |

### Frontend — Public assets
| File | Changes |
|---|---|
| `/app/frontend/public/index.html` | `<title>`, `<meta og:title>`, `<meta twitter:title>`, `<meta keywords>` ("gap check" removed). JSON-LD service offer `"Safety Documentation Review & Gap Check"` → `"OSHA Documentation Readiness Review"`. |
| `/app/frontend/public/llms.txt` | Tagline rename. Service list entry renamed. Pricing block rewritten with full new schedule. All 13 city links: $650→$850. |
| `/app/frontend/public/og-image.svg` | Subtitle "Safety Walkthroughs & Gap Checks" renamed. |

### Frontend — Build scripts
| File | Changes |
|---|---|
| `/app/frontend/scripts/generate-seo-pages.js` | Comprehensive update: priceRange (`$550-$1200` → `$750-$4500`); all Service schema entries renamed + repriced; homepage crawler HTML rewritten; all FAQ schema answers updated for new pricing; `/services` page meta title rewritten; `/documentation-gap-check` route entry: title/description/schemas/content all renamed with $550→$750 pricing; `/osha-compliance-gap-check` route entry: renamed to "Compliance Readiness Visit" / $1,200→$1,500. Crawler-visible H1/H2/H3 + JSON-LD all consistent with rename. |
| `/app/frontend/public/sitemap.xml` | URLs unchanged per Option A. |

### Backend — Python
| File | Changes |
|---|---|
| `/app/backend/config.py` | Stripe product names: "Safety Documentation Review & Gap Check (Remote)" / "(On-site)" → "OSHA Documentation Readiness Review (Remote)" / "(On-site)". |
| `/app/backend/routes/intake.py` | Intake lane comment renamed. Service display label `"Documentation & Gap Check"` → `"OSHA Documentation Readiness Review"`. Confirmation email body language rewritten. Internal `doc_review` enum key **preserved** (used as routing key in MailerLite + Resend templates — changing it would break automation; only the human-readable label was changed). |
| `/app/backend/scripts/generate_doc_review_prep_checklist.py` | PDF generator script docstring + body text references "Documentation & Gap Check" → "OSHA Documentation Readiness Review" / "gap report" → "findings report". |

### Untouched (intentionally)
- `/app/frontend/src/App.js` — routes unchanged (Option A: slugs preserved)
- `/app/frontend/public/sitemap.xml` — URLs unchanged
- `/app/frontend/public/robots.txt` — no relevant references
- `/app/frontend/src/pages/PrivacyPolicyPage.js` / `TermsOfServicePage.js` — no brand-term references
- `/app/backend/integrations/mailerlite.py` — uses generic service routing keys (no rename needed); MailerLite group/sequence labels must be **manually updated by Vince** in MailerLite dashboard
- `/app/backend/pdf_generator.py` — uses generic "documentation gaps" descriptor (correct usage, not brand term)

---

## Updated Pricing Schedule — Applied Site-Wide

| Service | Old Price | New Price |
|---|---|---|
| Safety Walkthrough Report | From $650 | **From $850** |
| OSHA Documentation Readiness Review (standalone) | From $550 | **From $750** |
| Compliance Readiness Visit (NEW name; was OSHA Compliance Gap Check) | From $1,200 | **From $1,500** |
| Documentation Readiness Review — Entry Level | n/a (new) | **$950 flat** |
| Incident Review & Corrective Action Support | From $900 | **From $1,200** |
| Document Development — Single program | n/a | **From $350** |
| Document Development — LOTO + ≤5 procedures | n/a | **From $650** |
| Document Development — LOTO + 6–15 procedures | n/a | **From $950** |
| Document Development — Full suite (5+) | n/a | **From $1,500** |
| GigLine OSHA-Ready Control System Buildout | n/a (new) | **From $4,500** |
| Quarterly Compliance Maintenance | n/a (new) | **$750–$1,750 / qtr** |
| Annual Compliance Control Partner | n/a (new) | **$9,000–$18,000 / yr** |
| Supervisor Safety Starter System — Digital | $199 | $199 (unchanged) |
| Supervisor Safety Starter System — Physical | $249 | $249 (unchanged) |
| HazCom Starter Pack | $49 | $49 (unchanged) |

**Amero Steel grandfather note:** Quote of $675 (issued prior to June 13, 2026) stands as given.

---

## Manual Tasks Outside Codebase (Required to Complete Acceptance Criteria)

The spec lists "field app (app.giglinecompliance.com), all generated PDF report templates, email templates, MailerLite sequence copy, Google Business profile services section, RingCentral Knowledge Hub documents" — these are NOT in this React/FastAPI codebase. Vince needs to manually update:

1. **MailerLite dashboard** — Rename email sequences / groups containing "Gap Check" → "Documentation Readiness Review." The backend routing keys remain `doc_review` so existing automation continues working; only the user-facing copy in MailerLite emails needs renaming.
2. **Google Business Profile** — Services section: rename "Documentation Review" line item to "OSHA Documentation Readiness Review." Update prices.
3. **RingCentral Knowledge Hub** — Any documents referencing "Gap Check."
4. **`app.giglinecompliance.com`** — Field app PDF report templates (separate codebase).
5. **Resend email templates** — If hosted in Resend dashboard, update there. If embedded in backend code, already updated.

---

## Acceptance Criteria Status

- [x] Global rename confirmed in writing with complete file list **(this document)**
- [x] Page title tag updated as specified
- [x] Meta description updated as specified
- [x] Three primary cards display correctly on desktop and mobile (verified via screenshot)
- [x] Card 2 (Compliance Readiness Visit) visually elevated (blue border + MOST POPULAR badge + Star icon + scale-up on lg)
- [x] All pricing reflects updated 2026 rate schedule
- [x] Supervisor Safety Starter System listed as included ($199 value) in Card 2 body copy
- [x] All additional services present in Section 2 with updated pricing
- [x] Document Development floor pricing displayed in Section 2 (gold-bordered cream block)
- [x] Recurring services present in Section 3 with updated pricing
- [x] 90-Second Safety Check preserved and moved to bottom of page (full standalone band)
- [x] Mocksville case study link preserved (via CaseStudyTeaser, between recurring services and Safety Check)
- [x] Bottom CTA section present with tap-to-call (`tel:+13363298899`)
- [x] No instances of "Gap Check" or "Documentation Gap Check" remain in user-facing copy (verified via repo-wide grep)
- [x] All CTA buttons link to `/intake?service={slug}` with service pre-selected
- [x] Page renders correctly on mobile (verified at 414px viewport)

---

*GigLine Safety & Compliance — Kernersville, NC — (336) 329-8899*
