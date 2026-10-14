# Handoff: Fig — wisdom app (Scripture, Stoics, Christian writers, modern practice)

## Overview
Fig is a mobile-first personal wisdom app. 500 cards across six shelves (Relationships 125, Stoic 100, Scripture 100, Habits 59, Stewardship 58, Christian formation 58). Features: onboarding, personalized Today feed with daily hero photo, guided plans, card reader with spaced recall, Ask Fig and Decision Room (AI via Anthropic Claude), journaling, custom cards, light/dark themes, free tier (3 AI answers/day) and Pro ($39.99/yr, $5.99/mo). All data is device-local (localStorage). No accounts yet.

## About the files
- `site/` replaces `current_build/` as the deployable multi-file app (see DEPLOY.md).
- `design/Fig.dc.html` is the **readable source** of the app. Markup is the template between `<x-dc>` tags. Logic, data (cards in `MORE` arrays, `BASE_ORDER`, `THEMES`, `BOOKS`, plans) is in the `<script data-dc-script>` class. `support.js` is the small runtime that renders it. Open it in a browser over a local server to run it.
- Treat these as **high-fidelity references**. Two paths:
  1. **Ship as-is:** deploy `current_build/` to Netlify (fastest path to launch).
  2. **Rebuild:** recreate in a real framework (recommended: React + Vite as a PWA, or Expo/React Native for the stores, wrapped with Capacitor if staying web). Match the visuals pixel-for-pixel; extract card data from `Fig.dc.html` into JSON.

## Fidelity
High fidelity. Final colors, type, spacing, copy and interactions.

## Screens
Welcome / onboarding (goals, faith preference, shelves) → Today (full-width daily hero photo, rotates at local midnight; personalized feed) → Library (six shelves with cover photos, books) → Reader (editorial layout, shelf photo, quoted source, action, reflection, recall question) → Plans (guided multi-day plans with covers) → Ask Fig (chat, cites cards as `[#id]`) → Decision Room (step-by-step guided decision chat) → Journal → Custom card editor → Settings (theme, Pro, legal). Disclaimers shown on all advice features. Inspect `Fig.dc.html` for exact layout and copy of each.

## Interactions & state
- State persists to localStorage: onboarding answers, saved cards, recall schedule, journal entries, custom cards, theme, daily AI usage count.
- Spaced recall: cards resurface with their recall question on a growing interval.
- AI: POST to `/.netlify/functions/ask`; card context is built by `cardCtx()`. If the request fails, `offlineReply()` returns a card-based fallback.
- Free cap: 3 AI answers per day, reset at local midnight; Pro unlimited (Pro gating is local only — needs real verification once Stripe/IAP is wired).
- Screen transitions: soft fade/slide (see logic class).

## Design tokens (from `THEMES`)
Light (default): bg `#F5F0E8`, surface `#FFFDF9`, soft `#EAE2D6`, side `#EFE8DD`, ink `#24161C`, muted `#6E6064`, accent/tag `#7A3F57`, line `rgba(36,22,28,0.09)`, rule `rgba(36,22,28,0.14)`.
Dark: bg `#1C1317`, surface `#271C21`, soft `#35262D`, side `#20161A`, ink `#F5EEE3`, muted `#B8A9AC`, accent `#F08DB0`.
Type: Source Serif (headings, quotes) + Instrument Sans (UI), from Google Fonts.
Book cover colors: see `BOOKS` in the logic class.

## Assets
`design/assets/` — hero photos, plan covers, shelf photos. `design/brand/` — logo, wordmark, mark, app icon, favicon, share image.

## Content rules
See `CONTENT_RULES.md`. Scripture is NLT only (stay under 500 quoted verses). Modern books: paraphrase + chapter reference only. Public-domain works may be quoted.

## Remaining launch work
1. Stripe payment links (or Apple/Google in-app purchases for store builds) and real Pro verification.
2. Fill in Terms/Privacy (`legal.html`) with legal name, contact, address; lawyer review.
3. Deploy to Netlify at figwisdom.com with `ANTHROPIC_API_KEY` env var.
4. Spot-check ~100 NLT quotes and ~15 book references.
5. Store screenshots (`design/Store Screenshots.dc.html`) and listing copy (`Store Listing.md`); submit Google Play then App Store.
Post-launch: accounts, sync, audio narration.
