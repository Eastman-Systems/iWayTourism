# CLAUDE.md — iWay Tourism Project Instructions

This file is the single source of truth for Claude Code working on this project. Read it fully before any implementation.

---

## Project Summary

Static 27-page travel agency website. Astro + Tailwind CSS + Preact islands + Firebase Hosting + Cloud Functions. All content pre-authored as JSON in `src/content/`. All architecture decisions locked — see HANDOFF.md for the full spec.

---

## Critical Rules

1. **No package additions without approval.** Do not install any npm package, Astro integration, or utility library not explicitly listed in the stack. If you think something is needed, stop and ask.

2. **No content modifications.** The JSON files in `src/content/` are authored content. Do not rewrite, rephrase, reorder, or "improve" any text. Consume them as-is in templates.

3. **No architecture changes.** Component names, file paths, URL structures, schema mappings, and linking strategy are locked. If you encounter ambiguity, ask — do not fill gaps with assumptions.

4. **REPLACE: markers are intentional.** Content files contain `REPLACE:` prefixed values where real business data is needed. Render them as-is in development. Do not substitute placeholder data.

5. **Mobile-first is non-negotiable.** Every CSS rule starts at mobile and scales up via breakpoints. No desktop-first patterns. No `max-width` media queries. Container Queries on card components.

6. **Core Web Vitals are a deploy gate.** LCP < 2.5s, CLS < 0.1, INP < 200ms. Lighthouse CI blocks deployment if any metric is "poor". Test before every PR.

---

## Tech Stack (Locked)

```
Astro (latest stable)
Tailwind CSS + @tailwindcss/container-queries
Preact (for interactive islands only)
Firebase Hosting + Cloud Functions (Node.js 20)
Nodemailer (Gmail SMTP)
Google Analytics 4 (minimal gtag.js, no GTM)
```

---

## Key File Locations

| What | Where |
|---|---|
| Content JSON files | `src/content/` |
| Zod schemas | `src/content/config.ts` |
| Global business data | `src/content/common.json` |
| Schema templates | `src/content/schema-templates/` |
| Astro components | `src/components/` |
| Preact islands | `src/components/islands/` |
| Page routes | `src/pages/` |
| Schema builder utility | `src/utils/schema-builder.ts` |
| Navigation config | `src/config/navigation.ts` |
| Cloud Function | `functions/src/index.ts` |
| Firebase config | `firebase.json` + `.firebaserc` |
| CI/CD | `.github/workflows/deploy.yml` |

---

## Implementation Order

Follow this sequence. Complete each step before moving to the next.

### Phase 1: Scaffold
1. Initialize Astro project
2. Install dependencies: Tailwind, Preact integration, container-queries plugin
3. Create full directory structure (see HANDOFF.md §5)
4. Configure `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
5. Set up `global.css` with CSS custom properties for colors, font-face declarations
6. Place all content JSON files in `src/content/`

### Phase 2: Foundation
7. Implement `config.ts` (Zod schemas — file is pre-authored, just place it)
8. Implement `schema-builder.ts` utility
9. Implement `types.ts` with shared TypeScript interfaces
10. Implement `navigation.ts` config

### Phase 3: Layout & Navigation
11. BaseLayout.astro (with SEOHead, global schema injection)
12. SEOHead.astro
13. Header.astro + Logo.astro + NavMenu.astro + MobileMenu.astro
14. Footer.astro + FooterNav.astro + FooterContact.astro + FooterSocial.astro
15. SiloLayout.astro (extends BaseLayout)
16. Breadcrumb.astro
17. SiloSidebar.astro
18. SchemaBlock.astro

### Phase 4: Content Components
19. QuickAnswer.astro
20. FAQAccordion.astro (native `<details>/<summary>`)
21. PackageCard.astro (Container Query)
22. VehicleCard.astro (Container Query)
23. TestimonialCard.astro (Container Query)
24. AttractionCard.astro (Container Query)
25. TeamMemberCard.astro
26. ItineraryDay.astro + ItineraryStop.astro
27. PracticalInfo.astro
28. PriceBadge.astro
29. HighlightsList.astro
30. CrossSellCTA.astro

### Phase 5: Conversion Components
31. StickyFooterCTA.astro
32. DesktopSidebarCTA.astro
33. LeadCaptureForm.tsx (Preact) + FormStep, FormField, FormSuccess

### Phase 6: Pages
34. Homepage (index.astro)
35. About Us, Fleet, Contact, Reviews, Terms (explicit .astro files)
36. Local Tours pillar (local-tours/index.astro)
37. Local Tours dynamic spoke (local-tours/[slug].astro)
38. International Tours pillar (international-tours/index.astro)
39. International Tours dynamic spoke (international-tours/[slug].astro)
40. Budget Calculator (tools/budget-calculator.astro) + BudgetCalculator.tsx
41. 404 page

### Phase 7: Backend & Config
42. Cloud Function (functions/src/index.ts)
43. firebase.json
44. .firebaserc
45. robots.txt
46. GitHub Actions workflow (deploy.yml)

---

## Coding Standards

### Astro Components
- Semantic HTML5 elements (`<article>`, `<section>`, `<nav>`, `<aside>`, `<main>`, `<header>`, `<footer>`)
- No div soup — every container must have a semantic or ARIA role justification
- Props typed with TypeScript interfaces (define in the component frontmatter or import from types.ts)
- Use Astro's built-in `<Image>` component where possible for automatic optimization attributes
- Template guards: check for optional data before rendering (e.g., `{faqs && faqs.length > 0 && ...}`)

### Tailwind CSS
- Mobile-first: default styles are mobile, `sm:`, `md:`, `lg:`, `xl:` scale up
- Container Queries: `@container` on card wrapper, `@[size]` utilities on card internals
- No `@apply` in component styles — use utility classes directly in markup
- Color values via CSS custom properties: `text-[var(--color-primary)]` or define in Tailwind config `extend.colors`
- Minimum body text: 16px (1rem)
- H1 fluid size: `clamp(1.75rem, 4vw, 2.5rem)` or equivalent Tailwind arbitrary value
- `gap` on all flex/grid containers — no margin-based spacing between children
- `prefers-reduced-motion` media query respected for any animation/transition

### Preact Islands
- `.tsx` extension
- Default export (functional component)
- Use Preact signals or useState — no external state management
- `client:visible` loading directive by default
- `client:load` only on the Contact page LeadCaptureForm (form is above fold)
- Total JS budget across all islands: <10KB

### Schema (JSON-LD)
- All schema output via SchemaBlock.astro
- One `<script type="application/ld+json">` per schema block (multiple blocks per page are fine)
- Global schemas (Organization, WebSite) injected by BaseLayout
- Page-level schemas constructed by schema-builder.ts from page data + common.json + templates
- Component-level schemas (Review, Person, Offer, Question) emitted by individual components
- Validate all output with Google Rich Results Test before merge

### Accessibility
- Every `<img>` has a descriptive `alt` attribute (provided in JSON data)
- Every interactive element is keyboard-accessible
- FAQAccordion uses native `<details>/<summary>` — no custom JS
- MobileMenu has focus trap and escape-to-close
- Color contrast meets WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
- ARIA landmarks on all major sections
- Skip-to-content link in BaseLayout

---

## Common Pitfalls to Avoid

- **Do not use `<img>` without width and height.** CLS penalty.
- **Do not add GTM.** GA4 loads via minimal gtag.js async script only.
- **Do not use CSS animations without `prefers-reduced-motion` guard.**
- **Do not use `max-width` media queries.** Mobile-first means `min-width` only.
- **Do not inline large SVGs.** Use external SVG files in `public/images/`.
- **Do not add React.** Islands use Preact. The integration is `@astrojs/preact`.
- **Do not modify content JSON files.** Consume them exactly as authored.
- **Do not hardcode the Cloud Function URL.** Use environment variable or Firebase config.
- **Do not skip the Lighthouse CI step in the deploy workflow.** It's a quality gate.

---

## Environment Setup

```bash
# Clone and install
git clone <repo-url>
cd iway-tourism
npm install

# Development
npm run dev          # Astro dev server
npm run build        # Production build
npm run preview      # Preview production build locally

# Cloud Function (separate)
cd functions
npm install
npm run serve        # Local function emulator

# Deploy
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy      # Both
```

### Required Environment Variables
| Variable | Where | Purpose |
|---|---|---|
| FIREBASE_TOKEN | GitHub Secrets | CI/CD deployment auth |
| GMAIL_USER | Firebase Functions config | SMTP sender address |
| GMAIL_APP_PASSWORD | Firebase Functions config | Gmail App Password |

Set function config:
```bash
firebase functions:config:set gmail.user="address@gmail.com" gmail.password="app-password"
```

---

## Testing Checklist (Before Every PR)

- [ ] `astro check` passes with zero errors
- [ ] `astro build` completes successfully
- [ ] All pages render correctly at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] LCP < 2.5s on all pages
- [ ] CLS < 0.1 on all pages
- [ ] All JSON-LD validates in Google Rich Results Test
- [ ] All internal links resolve (no 404s)
- [ ] LeadCaptureForm submits successfully to Cloud Function
- [ ] MobileMenu opens/closes, traps focus, responds to Escape key
- [ ] FAQAccordion expands/collapses with keyboard
- [ ] All images have explicit width/height and lazy loading (except hero)
- [ ] No console errors in browser dev tools
