# Emergent handoff: OSHA consultant cost article

## Status

DRAFT ONLY. Do not publish, merge, deploy, index, add to the blog hub, or add to the sitemap until Vince explicitly approves the article.

## Source package

Use `osha-safety-consultant-cost-2026.json` in this folder as the content source of truth. Preserve the title, body copy, table, TL;DR points, comparison image, quote, CTA and all seven FAQ items. Do not invent prices, credentials, client examples, facility details or claims.

## Required route after approval

`/blog/how-much-does-an-osha-safety-consultant-cost-in`

Use the slug exactly as supplied unless Vince approves a change. Canonical URL must use `https://www.giglinecompliance.com`.

## Match the site's existing article layout

Build the page from the same visual system used by `frontend/src/pages/BlogMachineGuardingChecklist.js`:

- Full-width dark navy hero: `#102A43`.
- Small uppercase eyebrow in JetBrains Mono using gold `#C9A84C`.
- Article title in the same responsive serif heading treatment used on existing blog pages.
- Content width: the existing `container max-w-3xl` article column.
- Body color: `#1C2B2B` with the existing muted opacity levels.
- Section rhythm: `py-12 md:py-16`, with the existing light blue dividers.
- Alternate white and `#F9F8F6` section backgrounds where this brief specifies a panel.
- Reuse the current Navbar, Footer, SEO component and StickyTOC. Do not create a separate visual language.

## Exact content order

1. Hero: eyebrow `PRICING GUIDE`, title, opening paragraph, author, date and calculated read time.
2. Table of contents linking to every H2.
3. Intro paragraph.
4. TL;DR panel with all four supplied points.
5. `Why this matters`.
6. `How much does an OSHA safety consultant cost in 2026?` with the three-column comparison table.
7. Three service sections: on-site walkthroughs, documentation readiness reviews and incident response.
8. Supplied three-column comparison image with alt text and caption.
9. `Why OSHA safety consultant cost varies` as a six-item list.
10. Pull quote panel using the supplied quote verbatim.
11. Three question sections: worth the cost, hourly vs project pricing, and manufacturing vs warehouse pricing.
12. CTA panel.
13. FAQ accordion with all seven supplied questions and answers.
14. `One last thing` closing section.
15. Related-resources panel linking to the Compliance Readiness Visit and the Documentation Readiness Review.

## Component mapping for Ryze blocks

- `ryze-tldr`: bordered light panel, gold left rule, heading `THE SHORT ANSWER`, four check-mark rows.
- Markdown table: responsive wrapper; on narrow screens display each service as a stacked card so no horizontal overflow occurs.
- `ryze-image`: full article-column width, rounded corners consistent with the blog, descriptive alt text, caption directly below.
- `ryze-quote`: navy panel with gold left rule; quote is not a client testimonial and must not be styled or attributed as one.
- `ryze-cta`: dark navy panel. Change the supplied generic button label to `Request a Compliance Readiness Visit` and link to `/services/compliance-readiness-visit`; this matches the approved primary next step. Do not publish that copy change until Vince approves the final page.
- `ryze-faq`: accessible accordion plus matching FAQPage structured data generated from the same seven answers.

## Search and structured-data requirements

- Page title: `OSHA Safety Consultant Cost in 2026: What Drives Price`.
- Meta description: use the package value exactly.
- Add Article structured data using Vince Lawrence as author and GigLine Safety & Compliance as publisher.
- Add FAQPage structured data from the seven supplied FAQ items.
- Add BreadcrumbList: Home → Blog → article title.
- Add the route to `frontend/src/App.js`, the article card to `frontend/src/pages/BlogHubPage.js`, and the pre-render route to `frontend/scripts/generate-seo-pages.js` only after approval.
- Add the final URL to the sitemap only after approval.

## Final checks before showing Vince

- Test at desktop and mobile widths.
- Confirm no body copy or table columns are clipped.
- Confirm every table/list/FAQ item from the package appears once.
- Confirm the body image loads and its alt text is present.
- Confirm the CTA opens the Compliance Readiness Visit page.
- Confirm title, description, canonical, Article schema, FAQ schema and breadcrumb schema are present in the pre-rendered page.
- Keep the page out of production until Vince explicitly approves it.
