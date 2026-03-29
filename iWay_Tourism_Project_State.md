# iWay Tourism — Project State Document

**Last updated:** 2026-03-28
**Chat transition from:** Chat 2 (Content Authoring)
**Next chat should:** Review Claude Code implementation progress, address any implementation questions, iterate on design/UX after first build, fill REPLACE markers.

---

## 1. Opening Prompt for Next Chat

Copy-paste this to start the next conversation:

---

> You are continuing the iWay Tourism website project. Read the Project State Document and RULES.md in the project knowledge to load full context.
>
> **Where we left off:** All architecture (Steps 1–9) and content authoring (all 36 JSON files) are complete. Styling confirmed (Inter + Outfit fonts, teal + amber colors). Claude Code handoff document, CLAUDE.md, and REPLACE marker inventory have been prepared.
>
> **Current status:** Implementation is being handled by Claude Code using the handoff document. This chat is for:
> 1. Reviewing Claude Code's implementation output and flagging issues
> 2. Filling REPLACE markers with real business data
> 3. Iterating on design/UX decisions after first visual build
> 4. Addressing any implementation questions Claude Code escalates
> 5. Content refinements based on seeing pages rendered
>
> **Critical rules:** Read RULES.md before making any decisions. Never select tools, packages, or approaches without presenting options first. No large code blocks in chat — describe implementations in prose. End every response with token estimate. Alert at 60-70% usage for chat transition.

---

## 2. To-Do Tracker

### Architecture (Complete)
- [x] Step 1: Page Structure & URL Hierarchy — 27 pages, 3 silos + standalone
- [x] Step 2: Silo Internal Linking Strategy — 3-layer linking (global, silo-internal, cross-silo bridges)
- [x] Step 3: Schema Strategy Per Page — global, page-level, component-level schema mapped
- [x] Step 4: Reusable Component Inventory — 23 Astro components + 4 Preact sub-components + 1 calculator island
- [x] Step 5: Wireframe Patterns Per Page Type — 5 page types defined
- [x] Step 6: Web Performance Strategy — Core Web Vitals targets, loading strategy, modern CSS patterns
- [x] Step 7: Styling & Typography — CONFIRMED: Inter + Outfit, teal + amber
- [x] Step 8: Cloud Function & Firebase Configuration — single endpoint, Gmail SMTP, preview channels
- [x] Step 9: Project Directory Structure — complete file tree defined

### Content Authoring (Complete)
- [x] common.json — Organization data, NAP, global schema fragments
- [x] Schema templates (7 files) — article, faq-page, how-to, local-business, product-offer, tourist-trip, web-application
- [x] Zod schema definitions (config.ts content)

**Core Pages:**
- [x] homepage.json
- [x] about-us.json
- [x] fleet.json
- [x] contact.json
- [x] reviews.json
- [x] terms.json

**Local Tours Silo:**
- [x] _pillar.json (Local Tours Hub)
- [x] trivandrum-kanyakumari-3-days.json
- [x] kanyakumari-sightseeing.json
- [x] trivandrum-heritage.json
- [x] hidden-gems.json
- [x] temple-pilgrimages.json
- [x] eco-nature-trails.json
- [x] cuisine-guide.json
- [x] faq.json (Local Transport FAQ)

**International Tours Silo:**
- [x] _pillar.json (International Tours Hub)
- [x] singapore-malaysia.json
- [x] bali-honeymoon.json
- [x] vietnam.json
- [x] sri-lanka.json
- [x] dubai.json
- [x] thailand.json
- [x] trending-2026.json
- [x] visa-guide.json
- [x] best-time-to-visit.json
- [x] faq.json (International Travel FAQ)

**Standalone:**
- [x] budget-calculator.json (cost baselines per destination)

### Claude Code Handoff (Complete)
- [x] HANDOFF.md — Full implementation spec with all architecture decisions
- [x] CLAUDE.md — Project instructions file for Claude Code
- [x] REPLACE-INVENTORY.md — All placeholder markers catalogued by file and priority
- [x] All JSON files delivered to user for manual placement

### Implementation (Pending — Claude Code)
- [ ] Project scaffold and dependency installation
- [ ] Foundation: config.ts, schema-builder.ts, types.ts, navigation.ts
- [ ] Layout & Navigation components (BaseLayout, SiloLayout, SEOHead, Header, Footer, etc.)
- [ ] Content components (QuickAnswer, cards, accordion, itinerary, etc.)
- [ ] Conversion components (StickyFooterCTA, DesktopSidebarCTA, LeadCaptureForm)
- [ ] Core pages (homepage, about, fleet, contact, reviews, terms)
- [ ] Local Tours silo (pillar + [slug] dynamic route)
- [ ] International Tours silo (pillar + [slug] dynamic route)
- [ ] Budget Calculator page + Preact island
- [ ] 404 page
- [ ] Cloud Function (lead form endpoint)
- [ ] Firebase configuration (hosting, functions, headers, rewrites)
- [ ] CI/CD workflow (GitHub Actions + Lighthouse CI)
- [ ] Lighthouse audit pass on all pages

### REPLACE Markers (Pending — Client Data)
- [ ] Business contact data (phone, email, WhatsApp, address)
- [ ] Social media URLs
- [ ] Google Maps embed URL
- [ ] Operating hours
- [ ] Team member names, bios, photos
- [ ] Author name for Article schema
- [ ] All 8 client testimonials
- [ ] About Us story paragraphs
- [ ] Founding year
- [ ] Fleet vehicle pricing
- [ ] Cancellation/refund policy percentages
- [ ] Advance payment percentages
- [ ] Restaurant recommendations (cuisine guide)
- [ ] One-way transfer and surcharge pricing

### Post-Implementation (Pending)
- [ ] Fill all REPLACE markers with real business data
- [ ] Source and optimize all images (hero, fleet, destinations, local, team)
- [ ] Google Business Profile setup and NAP consistency audit
- [ ] Google Search Console verification and sitemap submission
- [ ] GA4 property creation and gtag configuration
- [ ] Firebase custom domain setup and SSL verification
- [ ] Production deployment and smoke testing
- [ ] Schema validation via Google Rich Results Test (all 27 pages)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Samsung Internet)
- [ ] Mobile device testing (minimum: iPhone SE, Pixel 5, Samsung A-series)

---

## 3. Confirmed Architecture Decisions

*No changes from Chat 1. Full architecture specs are in HANDOFF.md §3–§13. Key additions from Chat 2:*

- Step 7 styling CONFIRMED: Inter + Outfit fonts, teal primary (#0F766E–#0D9488), amber accent (#D97706–#F59E0B), slate neutrals.
- BudgetCalculator.tsx added to islands directory (was implied but not explicitly listed in Chat 1 component inventory).
- All content files authored with consistent voice, AEO-optimized QuickAnswer nodes, and CrossSellCTA links matching the exact mapping from Step 2.

---

## 4. Current Task State

**Completed in Chat 1:**
- Full architecture planning (Steps 1–9)
- RULES.md created and added to project knowledge

**Completed in Chat 2:**
- Step 7 styling confirmed (font pairing + color system)
- All 36 content JSON files authored and delivered
- Claude Code handoff document (HANDOFF.md)
- CLAUDE.md project instructions file
- REPLACE marker inventory
- Updated Project State Document

**Pending for Chat 3:**
- Review Claude Code implementation output
- Fill REPLACE markers with real business data
- Design/UX iteration after first visual build
- Image sourcing and optimization
- Production deployment preparation

**Open questions:** None. All architecture and content decisions are locked.

---

## 5. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-03-28 | **Framework: Astro** | Static content site where HTML structure is the product. Zero JS by default, island architecture for interactive components. Firebase Hosting compatible. User has 7 years Astro experience. |
| 2026-03-28 | **Hosting: Firebase Hosting + Cloud Functions** | GCP ecosystem, free tier sufficient, static CDN hosting with serverless backend for form processing. |
| 2026-03-28 | **No CMS — hardcoded content** | Developer deploys all changes. Eliminates CMS dependency, API layer, and content sync complexity. |
| 2026-03-28 | **Email: Nodemailer + Gmail SMTP** | Zero cost, no third-party service, 500 emails/day limit is sufficient for regional travel agency lead volume. |
| 2026-03-28 | **Dropped: booking interface, payment gateway, waiver portal** | No payment processing needed. Lead capture functionality absorbed into Contact page and embedded forms on package pages. |
| 2026-03-28 | **Page count: flexible** | Currently ~27 pages from blueprint. Will increase or decrease based on need. Quality over quantity for SEO. |
| 2026-03-28 | **Architecture validated in chat, code in Claude Code** | Clean separation. Chat produces the implementation spec, Claude Code executes it. |
| 2026-03-28 | **Interactive islands: Preact** | ~3KB, React-compatible API. Only used for LeadCaptureForm and BudgetCalculator. Everything else is pure static Astro. |
| 2026-03-28 | **MobileMenu: inline vanilla JS** | ~15 lines for aria-expanded, focus trap, escape-to-close. Google-recommended accessible pattern. No framework needed. |
| 2026-03-28 | **Content data as JSON in src/content/** | Astro Content Collections with Zod validation. Three-layer safety: Zod (build-time), TypeScript (IDE), template guards (render-time). |
| 2026-03-28 | **Dynamic routes for silos** | `[slug].astro` for local-tours and international-tours. Explicit .astro files for core pages and budget calculator. Scales to 270+ pages. |
| 2026-03-28 | **Schema: dual Article + TouristTrip on local pages** | Article for editorial trust, TouristTrip for semantic precision. Both in same JSON-LD array. |
| 2026-03-28 | **Schema: Product + Offer on international pages** | Google rich results surface pricing from Product/Offer. TouristTrip doesn't show pricing in SERPs. |
| 2026-03-28 | **Silo restructure: eliminated /resources/ and /faqs/** | FAQ and resource pages nested inside parent silos to keep link equity within topical clusters. |
| 2026-03-28 | **CrossSellCTA on local pages** | Editorially voiced, destination-specific CTAs linking local tour visitors to 2-3 relevant international packages. |
| 2026-03-28 | **Mobile-first design (strict)** | All CSS starts mobile, scales up via breakpoints. Container Queries where appropriate. |
| 2026-03-28 | **Embedded lead form on local tour pages** | Shorter conversion path wins over pure-static purity. Preact island loads only on pages that need it. |
| 2026-03-28 | **Font pairing: Inter + Outfit (CONFIRMED)** | Inter for headings (clean, professional), Outfit for body (softer, mobile-readable). Variable fonts, ~40-50KB total. |
| 2026-03-28 | **Color system: teal + amber (CONFIRMED)** | Teal primary (#0F766E–#0D9488) for trust/travel, amber accent (#D97706–#F59E0B) for warmth/premium. Slate neutrals. CSS custom properties. |
| 2026-03-28 | **Budget calculator: client-side only** | No Cloud Function needed. Cost baselines in JSON file, calculation in Preact island. |
| 2026-03-28 | **Staging: Firebase preview channels** | Preview URL per PR via GitHub Actions. Allows content review before production deploy. |
| 2026-03-28 | **Full content authoring for all 27 pages** | Ensures consistent voice and tone across the site. Prevents Claude Code from hallucinating content patterns. |
| 2026-03-28 | **Single Project State Document** | One living document updated per chat transition. No pile-up of handoff files. Contains opening prompt, to-do tracker, architecture specs, decision log. |
| 2026-03-28 | **Lighthouse CI in deploy pipeline** | Fail deployment if Core Web Vitals are in "poor" range. Prevents performance regressions. |
| 2026-03-28 | **Container Queries for card components** | Cards respond to container width, not viewport. Correct for component-based architecture with cards in different layout contexts. |
| 2026-03-28 | **GA4 via minimal gtag.js, not GTM** | GTM adds ~80KB overhead. Single analytics property doesn't justify Tag Manager. |
| 2026-03-28 | **Content authoring batch approach** | 5 batches (foundation, core, local, international, standalone). Review per batch for quality control without burning context on 36 individual round-trips. |
| 2026-03-28 | **CLAUDE.md for Claude Code** | Standard April 2026 convention. Single project instructions file at repo root. Contains stack, rules, implementation order, coding standards, and testing checklist. |
| 2026-03-28 | **REPLACE marker inventory** | Separate document cataloguing ~65 placeholder values by file and priority. Prevents Claude Code from hallucinating business data. |

---

*This document is the single source of working context. Updated at every chat transition. RULES.md remains the separate, permanent protocol document.*
