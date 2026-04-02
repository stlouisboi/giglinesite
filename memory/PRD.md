# GigLine Safety & Compliance - PRD

## Original Problem Statement
Build a professional static marketing website for GigLine Safety & Compliance, a safety consulting business owned by Vince Lawrence based in Kernersville, NC. The site provides safety walkthroughs, documentation reviews, and incident response support for small manufacturers, warehouses, contractors, and trucking fleets.

## Tech Stack
- React with React Router
- Tailwind CSS
- No backend required - static site with contact form
- Contact form submissions via Formspree

## Brand
- **Business name:** GigLine Safety & Compliance
- **Tagline:** Safety Walkthroughs & Gap Checks for Small Operations
- **Owner:** Vince Lawrence
- **Email:** vince@giglinecompliance.com
- **Phone:** 336-671-4967
- **Color palette:** 
  - Primary: #1C2B2B (dark steel gray)
  - Accent: #2E6B5E (steel green)
  - Secondary: #F4F4F4 (light gray)
- **Typography:** Inter font stack

## User Personas
1. **Small Manufacturers** - Machine shops, metal fabricators (5-50 employees)
2. **Warehouse Operators** - Distribution centers, forklift operations
3. **Contractors** - Field crews, maintenance teams
4. **Fleet Owners** - Small trucking operations (5-25 trucks)

## Core Requirements (Static)
- 4 pages: Homepage, Services, About, Contact
- Responsive design (mobile-first)
- Sticky navigation with mobile hamburger menu
- Contact form with Formspree integration
- SEO meta tags on all pages
- No backend required

## What's Been Implemented (April 2, 2026)

### Pages
1. **Homepage** - Hero section, Who I Work With cards, Three Offers, Background section, LaunchPath fleet reference, Contact form
2. **Services** - Expanded offer cards with full deliverable lists, pricing, "Best for" callouts
3. **About** - Full bio, military gig line origin story, credentials grid, headshot placeholder, LaunchPath cross-reference
4. **Contact** - Full contact form, contact info block, availability note, FAQ section

### Components
- `Navbar` - Sticky navigation, desktop nav + mobile drawer with hamburger toggle
- `Footer` - Business info, nav links, LaunchPath reference, tagline
- `ContactForm` - Form with Name, Company, Phone, Email, Service Type dropdown, Message; POSTs to Formspree

### Features
- Full responsive design
- Mobile hamburger menu
- Brand colors and Inter font
- SEO meta tags
- Data-testid attributes for testing
- All CTA buttons link to contact page
- External LaunchPath link opens in new tab

## Prioritized Backlog

### P0 (Before Launch)
- [ ] Replace Formspree placeholder endpoint (`xgvkbjze`) with actual form ID
- [ ] Add actual headshot photo to About page

### P1 (Post-Launch Improvements)
- [ ] Add testimonials section
- [ ] Add case studies or success stories
- [ ] Add blog/resources section
- [ ] Analytics integration (Google Analytics)

### P2 (Future Enhancements)
- [ ] Online scheduling/booking integration
- [ ] PDF download for service brochures
- [ ] Newsletter signup

## Next Tasks
1. User needs to create Formspree account and get actual form ID
2. Replace placeholder in ContactForm.js: `https://formspree.io/f/xgvkbjze` → actual endpoint
3. Add real headshot image to About page
4. Deploy to Vercel
