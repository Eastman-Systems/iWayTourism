# iWay Tourism — Claude Code Handoff Document

**Prepared:** 2026-03-28
**From:** Architecture & Content Chat (Chats 1–2)
**For:** Claude Code implementation

---

## Opening Prompt for Claude Code

```
You are implementing the iWay Tourism website. Read CLAUDE.md in the project root for all project rules, constraints, and coding standards.

This project has a complete architecture spec and all content authored. Your job is pure implementation — no content decisions, no architecture changes, no package additions without explicit approval.

Start by:
1. Read CLAUDE.md
2. Scaffold the project directory structure
3. Install dependencies (Astro, Tailwind, Preact, Firebase tools)
4. Implement in this order: base layout → global schema → navigation → core pages → local tours silo → international tours silo → standalone pages → lead form → cloud function → Firebase config → CI/CD

All 36 content JSON files are in src/content/. All architecture decisions are locked. If anything is ambiguous, ask — do not assume.
```

---

## 1. Project Overview

iWay Tourism is a 27-page static website for a regional travel agency based in Marthandam, Tamil Nadu, serving the Kanyakumari and Trivandrum districts. The site markets three service lines: local fleet rentals (Innova, Tempo Travellers, mini buses), curated regional tour circuits (Kanyakumari and Trivandrum), and international holiday packages (Singapore, Malaysia, Bali, Vietnam, Sri Lanka, Dubai, Thailand). The site is optimized for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) with extensive JSON-LD schema, QuickAnswer nodes, and semantic HTML.

---

## 2. Stack & Constraints

| Layer               | Choice                   | Notes                                        |
| ------------------- | ------------------------ | -------------------------------------------- |
| Framework           | Astro (latest stable)    | Static site generation, island architecture  |
| Styling             | Tailwind CSS             | Purged at build, mobile-first                |
| Interactive Islands | Preact (~3KB)            | Only for LeadCaptureForm + Budget Calculator |
| Hosting             | Firebase Hosting         | Free tier, static CDN                        |
| Backend             | Firebase Cloud Functions | Single endpoint, asia-south1                 |
| Email               | Nodemailer + Gmail SMTP  | App Password auth                            |
| Analytics           | GA4 via minimal gtag.js  | No GTM                                       |
| Maps                | Google Maps iframe embed | Contact page only                            |
| Version Control     | GitHub                   | CI/CD via GitHub Actions                     |

### Hard Constraints

- No paid third-party services
- No CMS — content hardcoded in JSON files in src/content/
- No payment gateway
- No document/waiver management
- No WhatsApp Business API, no SMS, no push notifications
- Images manually optimized — no Cloudinary or image pipeline
- Mobile-first design (strict) — all CSS starts mobile, scales up
- 100% Core Web Vitals pass: LCP < 2.5s, CLS < 0.1, INP < 200ms
- JS budget: <10KB total
- Preact islands load via client:visible (client:load on Contact page only)

---

## 3. Styling & Typography (Confirmed)

### Fonts

- **Headings:** Inter (variable font)
- **Body:** Outfit (variable font)
- ~40–50KB combined, font-display: swap, preloaded
- System font fallback stack

### Colors (as CSS custom properties)

- **Primary teal:** #0F766E (dark) to #0D9488 (light)
- **Accent amber:** #D97706 (dark) to #F59E0B (light)
- **Neutrals:** Slate scale (Tailwind defaults)
- **Backgrounds:** White / slate-50
- All colors defined as CSS custom properties for future dark mode

### Tailwind Config

- Mobile-first breakpoints (default)
- @tailwindcss/container-queries plugin
- 4px spacing grid (default)
- Body text minimum 16px
- H1 fluid scaling via clamp()
- Container Queries on card components (PackageCard, VehicleCard, TestimonialCard, AttractionCard)
- Media queries for layout-level decisions

---

## 4. Content File Inventory

All content JSON files should be placed in `src/content/`. These files are pre-authored — do not modify content, only consume it in templates.

### Foundation Files

| File        | Location                | Purpose                                                                           |
| ----------- | ----------------------- | --------------------------------------------------------------------------------- |
| config.ts   | src/content/config.ts   | Astro Content Collections with Zod schemas for all page types                     |
| common.json | src/content/common.json | Business NAP, service areas, social links, author entity, global schema fragments |

### Schema Templates (consumed by schema-builder.ts)

| File                 | Location                                          | Schema Type                  |
| -------------------- | ------------------------------------------------- | ---------------------------- |
| article.json         | src/content/schema-templates/article.json         | Article                      |
| faq-page.json        | src/content/schema-templates/faq-page.json        | FAQPage                      |
| how-to.json          | src/content/schema-templates/how-to.json          | HowTo                        |
| local-business.json  | src/content/schema-templates/local-business.json  | LocalBusiness (TravelAgency) |
| product-offer.json   | src/content/schema-templates/product-offer.json   | Product + Offer              |
| tourist-trip.json    | src/content/schema-templates/tourist-trip.json    | TouristTrip                  |
| web-application.json | src/content/schema-templates/web-application.json | WebApplication               |

### Core Pages (src/content/core/)

| File          | Page                       | URL               | Page Type |
| ------------- | -------------------------- | ----------------- | --------- |
| homepage.json | Homepage                   | /                 | homepage  |
| about-us.json | About Us                   | /about-us         | about     |
| fleet.json    | Fleet & Ground Transport   | /cab-rental-fleet | fleet     |
| contact.json  | Contact & Branch Locations | /contact          | contact   |
| reviews.json  | Client Reviews & Stories   | /reviews          | reviews   |
| terms.json    | Terms of Service           | /terms-conditions | terms     |

### Local Tours Silo (src/content/local-tours/)

| File                               | Page                        | URL                                        | Page Type   |
| ---------------------------------- | --------------------------- | ------------------------------------------ | ----------- |
| \_pillar.json                      | Local Tours Hub             | /local-tours                               | pillar      |
| trivandrum-kanyakumari-3-days.json | 3-Day Coastal Circuit       | /local-tours/trivandrum-kanyakumari-3-days | itinerary   |
| kanyakumari-sightseeing.json       | Kanyakumari Sightseeing     | /local-tours/kanyakumari-sightseeing       | sightseeing |
| trivandrum-heritage.json           | Trivandrum Heritage Tour    | /local-tours/trivandrum-heritage           | sightseeing |
| hidden-gems.json                   | Hidden Gems                 | /local-tours/hidden-gems                   | sightseeing |
| temple-pilgrimages.json            | Temple Pilgrimages          | /local-tours/temple-pilgrimages            | sightseeing |
| eco-nature-trails.json             | Eco-Tourism & Nature Trails | /local-tours/eco-nature-trails             | sightseeing |
| cuisine-guide.json                 | South India Cuisine Guide   | /local-tours/cuisine-guide                 | editorial   |
| faq.json                           | Local Transport FAQ         | /local-tours/faq                           | faq         |

### International Tours Silo (src/content/international-tours/)

| File                    | Page                       | URL                                     | Page Type   |
| ----------------------- | -------------------------- | --------------------------------------- | ----------- |
| \_pillar.json           | International Tours Hub    | /international-tours                    | pillar      |
| singapore-malaysia.json | Singapore & Malaysia Combo | /international-tours/singapore-malaysia | destination |
| bali-honeymoon.json     | Bali Honeymoon Escapes     | /international-tours/bali-honeymoon     | destination |
| vietnam.json            | Vietnam Budget Adventures  | /international-tours/vietnam            | destination |
| sri-lanka.json          | Sri Lanka Express Tours    | /international-tours/sri-lanka          | destination |
| dubai.json              | Dubai Luxury and Shopping  | /international-tours/dubai              | destination |
| thailand.json           | Thailand Coastal Retreats  | /international-tours/thailand           | destination |
| trending-2026.json      | Emerging 2026 Frontiers    | /international-tours/trending-2026      | editorial   |
| visa-guide.json         | Visa Assistance Guide      | /international-tours/visa-guide         | editorial   |
| best-time-to-visit.json | Best Time to Travel Guide  | /international-tours/best-time-to-visit | editorial   |
| faq.json                | International Travel FAQ   | /international-tours/faq                | faq         |

### Standalone (src/content/)

| File                   | Page              | URL                      | Notes                                    |
| ---------------------- | ----------------- | ------------------------ | ---------------------------------------- |
| budget-calculator.json | Budget Calculator | /tools/budget-calculator | Not in a collection — direct JSON import |

---

## 5. Directory Structure

```
iway-tourism/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── fleet/
│   │   ├── destinations/
│   │   ├── local/
│   │   ├── team/
│   │   └── logo.svg
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── SiloLayout.astro
│   │   │   └── SEOHead.astro
│   │   ├── navigation/
│   │   │   ├── Header.astro
│   │   │   ├── Logo.astro
│   │   │   ├── NavMenu.astro
│   │   │   ├── MobileMenu.astro          # inline vanilla JS (~15 lines)
│   │   │   ├── Footer.astro
│   │   │   ├── FooterNav.astro
│   │   │   ├── FooterContact.astro
│   │   │   ├── FooterSocial.astro
│   │   │   ├── Breadcrumb.astro
│   │   │   └── SiloSidebar.astro
│   │   ├── content/
│   │   │   ├── QuickAnswer.astro
│   │   │   ├── PackageCard.astro          # Container Query responsive
│   │   │   ├── VehicleCard.astro          # Container Query responsive
│   │   │   ├── TestimonialCard.astro      # Container Query responsive
│   │   │   ├── TeamMemberCard.astro
│   │   │   ├── FAQAccordion.astro
│   │   │   ├── ItineraryDay.astro
│   │   │   ├── ItineraryStop.astro
│   │   │   ├── AttractionCard.astro       # Container Query responsive
│   │   │   ├── PracticalInfo.astro
│   │   │   ├── PriceBadge.astro
│   │   │   ├── HighlightsList.astro
│   │   │   └── CrossSellCTA.astro
│   │   ├── conversion/
│   │   │   ├── StickyFooterCTA.astro
│   │   │   └── DesktopSidebarCTA.astro
│   │   ├── schema/
│   │   │   └── SchemaBlock.astro
│   │   └── islands/
│   │       ├── LeadCaptureForm.tsx        # Preact
│   │       ├── FormStep.tsx               # Preact sub-component
│   │       ├── FormField.tsx              # Preact sub-component
│   │       ├── FormSuccess.tsx            # Preact sub-component
│   │       └── BudgetCalculator.tsx       # Preact island for /tools/budget-calculator
│   ├── content/
│   │   ├── config.ts
│   │   ├── common.json
│   │   ├── schema-templates/             # 7 JSON-LD template files
│   │   ├── local-tours/                  # 9 JSON files (pillar + 8 spokes)
│   │   ├── international-tours/          # 11 JSON files (pillar + 10 spokes)
│   │   └── core/                         # 6 JSON files (homepage through terms)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about-us.astro
│   │   ├── cab-rental-fleet.astro
│   │   ├── contact.astro
│   │   ├── reviews.astro
│   │   ├── terms-conditions.astro
│   │   ├── local-tours/
│   │   │   ├── index.astro               # Pillar page
│   │   │   └── [slug].astro              # Dynamic route for all spokes
│   │   ├── international-tours/
│   │   │   ├── index.astro               # Pillar page
│   │   │   └── [slug].astro              # Dynamic route for all spokes
│   │   ├── tools/
│   │   │   └── budget-calculator.astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   ├── schema-builder.ts
│   │   └── types.ts
│   └── config/
│       └── navigation.ts
├── functions/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── firebase.json
├── .firebaserc
├── .github/
│   └── workflows/
│       └── deploy.yml
├── CLAUDE.md
└── package.json
```

---

## 6. Page Routing

### Core Pages — Explicit .astro files

Each core page has a dedicated .astro file because no two share a template structure.

| Page     | .astro file                      | Reads from                     |
| -------- | -------------------------------- | ------------------------------ |
| Homepage | src/pages/index.astro            | src/content/core/homepage.json |
| About Us | src/pages/about-us.astro         | src/content/core/about-us.json |
| Fleet    | src/pages/cab-rental-fleet.astro | src/content/core/fleet.json    |
| Contact  | src/pages/contact.astro          | src/content/core/contact.json  |
| Reviews  | src/pages/reviews.astro          | src/content/core/reviews.json  |
| Terms    | src/pages/terms-conditions.astro | src/content/core/terms.json    |

### Silo Pages — Dynamic routes

Pillar pages use `index.astro`. Spoke pages use `[slug].astro` with `getStaticPaths()` reading from the collection. The `[slug].astro` template switches rendering logic based on `pageType` from the discriminated union.

| Silo                | Pillar                                    | Spokes                                     | Collection          |
| ------------------- | ----------------------------------------- | ------------------------------------------ | ------------------- |
| Local Tours         | src/pages/local-tours/index.astro         | src/pages/local-tours/[slug].astro         | local-tours         |
| International Tours | src/pages/international-tours/index.astro | src/pages/international-tours/[slug].astro | international-tours |

### Standalone

| Page              | .astro file                             | Data source                                  |
| ----------------- | --------------------------------------- | -------------------------------------------- |
| Budget Calculator | src/pages/tools/budget-calculator.astro | Direct JSON import of budget-calculator.json |
| 404               | src/pages/404.astro                     | No data file — hardcoded                     |

---

## 7. Component Specifications

### Layout Components

**BaseLayout.astro** — Root layout wrapping every page. Receives `seo` props (title, description, ogImage, canonicalUrl, noindex). Renders SEOHead, Header, main slot, Footer. Injects global Organization + WebSite JSON-LD from common.json via SchemaBlock.

**SiloLayout.astro** — Extends BaseLayout for silo spoke pages. Adds Breadcrumb, SiloSidebar (desktop), and optional StickyFooterCTA (mobile). Receives `silo` prop ("local-tours" | "international-tours"), `currentSlug`, and `pageTitle` for breadcrumb generation.

**SEOHead.astro** — Renders in `<head>`: meta title, description, canonical, og:tags, preloaded fonts, critical CSS inline tag, GA4 gtag.js async script, and global JSON-LD schemas.

### Navigation Components

**Header.astro** — Semantic `<header>` with Logo, NavMenu (desktop), MobileMenu toggle (mobile). Sticky on scroll. Links: Home, Local Tours, International Tours, Fleet & Transport, About, Contact.

**MobileMenu.astro** — Inline `<script>` (~15 lines vanilla JS). Handles aria-expanded toggle, focus trap within the menu, escape-to-close. No framework dependency. Google-recommended accessible pattern.

**Footer.astro** — Composes FooterNav, FooterContact, FooterSocial. Links: all header links + Reviews, Terms, Budget Calculator. Copyright line.

**Breadcrumb.astro** — Renders BreadcrumbList schema + visible breadcrumb nav. Props: `items` array of `{ label, url }`. Auto-generated by SiloLayout based on silo and current page.

**SiloSidebar.astro** — Desktop-only sidebar listing all spokes in the current silo with active state highlighting. Visible at `lg:` breakpoint and above.

### Content Components

**QuickAnswer.astro** — The AEO extraction node. Renders a `<section>` with the question as an `<h2>` and the 40–60 word answer in a styled `<p>` with a distinct visual treatment (teal left border or background tint). Props: `question: string`, `answer: string`.

**PackageCard.astro** — Card for international destination packages. Uses Container Query for responsive sizing. Props from spokeCards array: `title`, `slug`, `tagline`, `priceFrom` (optional), `image`, `imageAlt`. Renders PriceBadge when priceFrom is present.

**VehicleCard.astro** — Fleet vehicle card with Container Query. Props from vehicles array: `name`, `type`, `capacity`, `image`, `imageAlt`, `features`, `idealFor`, `priceNote`.

**TestimonialCard.astro** — Review card with Container Query. Props from testimonials array. Renders star rating visually + outputs Review schema via SchemaBlock.

**TeamMemberCard.astro** — About page team member card. Outputs Person schema.

**FAQAccordion.astro** — Accessible accordion using `<details>/<summary>`. Props: `faqs` array of `{ question, answer }`. Outputs FAQPage schema fragment. Keyboard-navigable. No JS required — native HTML behavior.

**ItineraryDay.astro** — Day container for the 3-day itinerary page. Renders day number, title, description, meals, overnight info, and a list of ItineraryStop components.

**ItineraryStop.astro** — Individual stop within an itinerary day. Renders stop name, description, duration, tip callout, and optional image.

**AttractionCard.astro** — Sightseeing attraction card with Container Query. Renders attraction details including timings, entry fee, dress code, duration, highlights. Outputs TouristAttraction schema fragment.

**PracticalInfo.astro** — Renders the practical info block (how to get there, best time, duration, tips) as a styled aside section.

**PriceBadge.astro** — Inline price display. Props: `priceFrom: number`, `currency: string`. Renders "From ₹XX,XXX" with appropriate formatting.

**HighlightsList.astro** — Simple styled list of highlight strings. Used inside cards and tier descriptions.

**CrossSellCTA.astro** — Editorially voiced CTA block linking local tour visitors to international destinations. Props from crossSell object: heading, body, links array with label/url/tagline.

### Conversion Components

**StickyFooterCTA.astro** — Mobile-only sticky bar at bottom of silo spoke pages. "Get a Free Quote" button linking to /contact or triggering scroll to embedded lead form. Hidden at `lg:` breakpoint.

**DesktopSidebarCTA.astro** — Desktop-only CTA card in the sidebar of international destination pages. Sticky positioned within the sidebar column. "Get a Custom Quote" with brief value prop.

### Schema Component

**SchemaBlock.astro** — Renders a `<script type="application/ld+json">` tag. Props: `schema: object | object[]`. Used in BaseLayout for global schemas and in individual components for page-level and component-level schemas. The schema-builder.ts utility constructs the schema objects from page data + common.json + schema templates.

### Preact Islands

**LeadCaptureForm.tsx** — Multi-step form with conditional logic. Steps: (1) Trip type selection (local fleet / local tour / international package), (2) Details based on selection (destination, dates, group size, budget range for international; vehicle type, dates, pickup location for fleet), (3) Contact info (name, phone, email). Honeypot field for spam filtering. Submits POST to Cloud Function endpoint. Renders FormSuccess on 200 response. Uses FormStep and FormField sub-components.

**BudgetCalculator.tsx** — Client-side calculator consuming budget-calculator.json data. UI: destination selector, tier selector, group size input, daily spend level selector. Output: package cost breakdown, estimated daily spend, visa cost, total estimate. CTA to /contact with pre-filled destination parameter. No Cloud Function needed — all computation client-side.

---

## 8. Schema Strategy

### Global (every page, injected by BaseLayout via SEOHead)

- Organization (type: TravelAgency) — from common.json
- WebSite with SearchAction — from common.json

### Page-Level Schema Map

| Page                         | Schema Types                                           |
| ---------------------------- | ------------------------------------------------------ |
| Homepage (1)                 | Global only                                            |
| About Us (2)                 | Article + Person per team member                       |
| Fleet (3)                    | OfferCatalog + Offer per vehicle                       |
| Contact (4)                  | LocalBusiness (TravelAgency)                           |
| Reviews (5)                  | AggregateRating + Review per testimonial               |
| Terms (6)                    | WebPage                                                |
| Local Tours Hub (7)          | ItemList + LocalBusiness                               |
| 3-Day Itinerary (8)          | Article + HowTo with HowToStep per day                 |
| Kanyakumari Sightseeing (9)  | Article + TouristTrip + TouristAttraction per location |
| Trivandrum Heritage (10)     | Article + TouristTrip + TouristAttraction per location |
| Hidden Gems (11)             | Article + TouristTrip + TouristAttraction per location |
| Temple Pilgrimages (12)      | Article + TouristTrip + TouristAttraction per location |
| Eco-Tourism (13)             | Article + TouristTrip + TouristAttraction per location |
| Cuisine Guide (14)           | Article                                                |
| Local FAQ (15)               | FAQPage                                                |
| International Tours Hub (16) | ItemList                                               |
| Singapore & Malaysia (17)    | Product + Offer per tier                               |
| Bali Honeymoon (18)          | Product + Offer                                        |
| Vietnam (19)                 | Product + Offer per tier                               |
| Sri Lanka (20)               | Product + Offer                                        |
| Dubai (21)                   | Product + Offer                                        |
| Thailand (22)                | Product + Offer                                        |
| Trending 2026 (23)           | Article (no pricing)                                   |
| Visa Guide (24)              | Article + FAQPage                                      |
| Best Time to Visit (25)      | Article                                                |
| International FAQ (26)       | FAQPage                                                |
| Budget Calculator (27)       | WebApplication                                         |

### schema-builder.ts

Utility file that:

1. Reads common.json for organization/business data
2. Reads schema templates for base structures
3. Accepts page-specific data (from the JSON content files)
4. Merges and returns valid JSON-LD objects with all `{{placeholder}}` values replaced
5. Handles arrays (FAQ items, itinerary steps, offers) by iterating and constructing ListItem/Question/Offer nodes

---

## 9. Internal Linking Strategy

### Layer 1 — Global Navigation

- **Header:** Home, Local Tours, International Tours, Fleet & Transport, About, Contact
- **Footer:** All header links + Reviews, Terms, Budget Calculator

### Layer 2 — Silo-Internal

Each spoke links back to its pillar. Each pillar links to all spokes. Spokes cross-link to 2–3 siblings.

**Local Tours cross-links:**

- 3-Day Itinerary (8) → Kanyakumari Sightseeing (9), Trivandrum Heritage (10), Hidden Gems (11)
- Kanyakumari Sightseeing (9) → Temple Pilgrimages (12), Hidden Gems (11)
- Trivandrum Heritage (10) → Eco-Tourism (13), Cuisine Guide (14)
- Hidden Gems (11) → Eco-Tourism (13), 3-Day Itinerary (8)
- Temple Pilgrimages (12) → Kanyakumari Sightseeing (9), Trivandrum Heritage (10)
- Eco-Tourism (13) → Hidden Gems (11), Cuisine Guide (14)
- Cuisine Guide (14) → Trivandrum Heritage (10), Kanyakumari Sightseeing (9)
- Local FAQ (15) → Fleet (3, cross-silo), 3-Day Itinerary (8)

**International Tours cross-links:**

- Singapore & Malaysia (17) → Best Time to Visit (25), Visa Guide (24), International FAQ (26)
- Bali Honeymoon (18) → Thailand (22), Best Time to Visit (25)
- Vietnam (19) → Sri Lanka (20), Visa Guide (24)
- Sri Lanka (20) → Vietnam (19), Best Time to Visit (25)
- Dubai (21) → Singapore & Malaysia (17), International FAQ (26)
- Thailand (22) → Bali Honeymoon (18), Vietnam (19)
- Trending 2026 (23) → Visa Guide (24), Best Time to Visit (25)
- Visa Guide (24) → All destination pages (17–23)
- Best Time to Visit (25) → All destination pages (17–23)
- International FAQ (26) → Visa Guide (24), Singapore & Malaysia (17)

### Layer 3 — Cross-Silo Bridges

- Homepage (1) → Local Tours pillar (7), International Tours pillar (16), Fleet (3)
- Fleet (3) → Local Tours pillar (7), Local FAQ (15), Contact (4)
- Contact (4) → Fleet (3), International Tours pillar (16)
- Reviews (5) → Local Tours pillar (7), International Tours pillar (16)
- Local FAQ (15) → Fleet (3)
- Budget Calculator (27) → International Tours pillar (16), Local Tours pillar (7)
- 3-Day Itinerary (8) → Fleet (3)
- All international destination pages (17–23) → Contact (4)

### CrossSellCTA Mapping (local pages → international destinations)

- 3-Day Itinerary (8) → Sri Lanka, Singapore & Malaysia
- Kanyakumari Sightseeing (9) → Bali, Dubai
- Trivandrum Heritage (10) → Vietnam, Sri Lanka
- Hidden Gems (11) → Vietnam, Trending 2026
- Temple Pilgrimages (12) → Sri Lanka, Bali
- Eco-Tourism (13) → Sri Lanka, Bali
- Cuisine Guide (14) → Vietnam, Thailand
- Local FAQ (15) → None

---

## 10. Cloud Function Specification

**Endpoint:** Single HTTPS Cloud Function
**Region:** asia-south1
**Trigger:** POST request from LeadCaptureForm

### Request Body

```typescript
interface LeadFormRequest {
  tripType: "fleet" | "local-tour" | "international";
  // Fleet fields
  vehicleType?: string;
  pickupLocation?: string;
  pickupDate?: string;
  returnDate?: string;
  // Tour fields
  destination?: string;
  groupSize?: number;
  budgetRange?: string;
  travelDates?: string;
  // Contact (always required)
  name: string;
  phone: string;
  email: string;
  message?: string;
  // Honeypot
  website?: string; // must be empty — filled = bot
}
```

### Validation

- Required fields: tripType, name, phone, email
- Phone: Indian mobile format validation (10 digits, starts with 6–9)
- Email: basic format validation
- Honeypot: reject if `website` field is non-empty
- Rate limiting: 5 requests per IP per 10 minutes

### Email Behavior

On valid submission:

1. **Notification email to iWay team** — contains all form fields, formatted as readable HTML table
2. **Confirmation email to submitter** — brief "We received your enquiry" with expected response time (2 hours during business hours)

### Response

- 200: `{ success: true, message: "Enquiry submitted successfully" }`
- 400: `{ success: false, message: "Validation error description" }`
- 429: `{ success: false, message: "Too many requests. Please try again later." }`
- 500: `{ success: false, message: "Internal server error" }`

### Email Config

- Nodemailer transport: Gmail SMTP
- Auth: App Password stored in Firebase environment config (not hardcoded)
- From: iWay Tourism notification address
- To (notification): iWay team email
- To (confirmation): submitter's email

---

## 11. Firebase Configuration

### firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**/*.@(js|css|woff2|webp|jpg|png|svg|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.html",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }]
      },
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://www.google.com https://maps.google.com; connect-src 'self' https://www.google-analytics.com https://us-central1-REPLACE-PROJECT-ID.cloudfunctions.net;"
          }
        ]
      }
    ],
    "rewrites": [{ "source": "/api/lead", "function": "submitLead" }]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

### Custom 404

Configured via `src/pages/404.astro`. Firebase Hosting auto-serves `dist/404.html` for unmatched routes when `cleanUrls` is true.

---

## 12. CI/CD — GitHub Actions

### .github/workflows/deploy.yml

Steps on push to `main`:

1. Checkout repo
2. Setup Node.js (LTS)
3. Install dependencies (`npm ci`)
4. Run `astro check` (type checking)
5. Run `astro build`
6. Run Lighthouse CI — fail if any Core Web Vital is in "poor" range
7. Deploy hosting: `firebase deploy --only hosting`
8. Deploy functions (only if functions/ directory changed): `firebase deploy --only functions`

### Preview Channels

On pull request:

1. Build the site
2. Deploy to a Firebase preview channel: `firebase hosting:channel:deploy pr-${{ github.event.pull_request.number }}`
3. Comment the preview URL on the PR

### Environment Variables (GitHub Secrets)

- FIREBASE_TOKEN — Firebase CLI auth token
- GMAIL_USER — Gmail address for SMTP
- GMAIL_APP_PASSWORD — Gmail App Password

---

## 13. Web Performance Targets

| Metric              | Target  | Strategy                                                                         |
| ------------------- | ------- | -------------------------------------------------------------------------------- |
| LCP                 | < 2.5s  | Hero images eager-loaded with fetchpriority="high", preloaded in head            |
| CLS                 | < 0.1   | Explicit width/height on all images, aspect-ratio CSS, font-display: swap        |
| INP                 | < 200ms | Minimal JS (<10KB), Preact islands load via client:visible                       |
| Performance Score   | > 90    | Tailwind purged, critical CSS inlined, no render-blocking resources              |
| Accessibility Score | > 95    | Semantic HTML, ARIA on interactive elements, keyboard navigation, color contrast |

### Image Strategy

- Format: WebP + JPEG fallback via `<picture>` element
- Hero images: eager load, fetchpriority="high", preloaded in `<head>`
- All other images: `loading="lazy"`
- Explicit `width` and `height` attributes on every `<img>`
- `aspect-ratio` CSS property on image containers
- Google Maps iframe: `loading="lazy"`, below fold

### Font Strategy

- Variable fonts (Inter + Outfit)
- `font-display: swap`
- Preloaded in `<head>` via `<link rel="preload">`

### JS Strategy

- Total budget: <10KB
- Preact island (LeadCaptureForm): `client:visible` (loads when scrolled into view)
- Preact island on Contact page: `client:load` (loads immediately — form is above fold)
- BudgetCalculator island: `client:visible`
- MobileMenu: inline `<script>` in MobileMenu.astro (~15 lines, no module)
- GA4: minimal gtag.js with `async` attribute
- Smooth scroll: CSS-only `scroll-behavior: smooth` with `prefers-reduced-motion` fallback

---

## 14. Decision Log

All major decisions made during architecture planning. Do not override these without explicit approval.

| Date       | Decision                                                   | Reasoning                                                                                  |
| ---------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 2026-03-28 | Framework: Astro                                           | Static content site, zero JS by default, island architecture. User has 7 years experience. |
| 2026-03-28 | Hosting: Firebase Hosting + Cloud Functions                | GCP ecosystem, free tier, static CDN with serverless backend.                              |
| 2026-03-28 | No CMS — hardcoded content                                 | Developer deploys. Eliminates CMS dependency.                                              |
| 2026-03-28 | Email: Nodemailer + Gmail SMTP                             | Zero cost, 500 emails/day sufficient.                                                      |
| 2026-03-28 | Dropped: booking interface, payment gateway, waiver portal | No payment processing needed.                                                              |
| 2026-03-28 | Interactive islands: Preact                                | ~3KB, React-compatible API. Only for forms and calculator.                                 |
| 2026-03-28 | MobileMenu: inline vanilla JS                              | ~15 lines. No framework needed.                                                            |
| 2026-03-28 | Content data as JSON in src/content/                       | Astro Content Collections with Zod validation.                                             |
| 2026-03-28 | Dynamic routes for silos                                   | [slug].astro for local-tours and international-tours.                                      |
| 2026-03-28 | Schema: dual Article + TouristTrip on local pages          | Article for editorial trust, TouristTrip for semantic precision.                           |
| 2026-03-28 | Schema: Product + Offer on international pages             | Google rich results surface pricing.                                                       |
| 2026-03-28 | Silo restructure: eliminated /resources/ and /faqs/        | Keep link equity within topical clusters.                                                  |
| 2026-03-28 | CrossSellCTA on local pages                                | Destination-specific CTAs linking to international packages.                               |
| 2026-03-28 | Mobile-first design (strict)                               | All CSS starts mobile, scales up. Container Queries where appropriate.                     |
| 2026-03-28 | Font pairing: Inter + Outfit                               | Inter headings, Outfit body. Variable fonts, ~40–50KB.                                     |
| 2026-03-28 | Color system: teal + amber                                 | Teal primary, amber accent, slate neutrals. CSS custom properties.                         |
| 2026-03-28 | Budget calculator: client-side only                        | No Cloud Function. Cost baselines in JSON.                                                 |
| 2026-03-28 | Staging: Firebase preview channels                         | Preview URL per PR via GitHub Actions.                                                     |
| 2026-03-28 | Lighthouse CI in deploy pipeline                           | Fail deploy if CWV in "poor" range.                                                        |
| 2026-03-28 | Container Queries for card components                      | Cards respond to container width, not viewport.                                            |
| 2026-03-28 | GA4 via minimal gtag.js, not GTM                           | Single analytics property doesn't justify GTM overhead.                                    |
