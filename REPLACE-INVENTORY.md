# REPLACE Marker Inventory — iWay Tourism Content Files

Every `REPLACE:` marker in the content JSON files represents real business data that only the client/owner can provide. Fill these before production deployment. Claude Code should render them as-is during development — do not substitute placeholder values.

**Total markers: ~65**

---

## common.json (11 markers)

| Field Path              | What's Needed                                    |
| ----------------------- | ------------------------------------------------ |
| `business.foundingYear` | Year iWay Tourism was established (e.g., "2019") |
| `business.url`          | Production domain URL                            |
| `business.email`        | Primary business email                           |
| `business.phone`        | Primary phone number with country code           |
| `business.whatsapp`     | WhatsApp number with country code                |
| `address.streetAddress` | Full street address of Marthandam office         |
| `address.postalCode`    | Postal code (likely 629163 area)                 |
| `socialLinks.facebook`  | Facebook page URL                                |
| `socialLinks.instagram` | Instagram profile URL                            |
| `socialLinks.youtube`   | YouTube channel URL                              |
| `socialLinks.google`    | Google Business Profile URL                      |

**Note:** The `schema.organization` and `schema.website` blocks inside common.json mirror these same values — update both when filling.

---

## common.json — Author Entity (3 markers)

| Field Path           | What's Needed                                               |
| -------------------- | ----------------------------------------------------------- |
| `author.name`        | Full name of the primary content author / senior consultant |
| `author.description` | 1–2 sentence bio for schema Person entity                   |
| `author.image`       | File path to author headshot image                          |

---

## Core Pages

### about-us.json (7 markers)

| Field Path                                     | What's Needed                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `seo.title` (contains YYYY)                    | Replace YYYY with founding year                                           |
| `story.paragraphs[0]`                          | Origin story paragraph — founding motivation, market gap                  |
| `story.paragraphs[1]`                          | Growth paragraph — milestones, first international group, fleet expansion |
| `story.paragraphs[2]`                          | Present-day paragraph — current scale, number of travellers served        |
| `team.members[0]` (name, bio, image, imageAlt) | Founder/Director details                                                  |
| `team.members[1]` (name, bio, image, imageAlt) | Senior Travel Consultant details                                          |
| `team.members[2]` (name, bio, image, imageAlt) | Fleet & Operations Manager details                                        |

### contact.json (6 markers)

| Field Path                | What's Needed                             |
| ------------------------- | ----------------------------------------- |
| `nap.address`             | Street address                            |
| `nap.postalCode`          | Postal code                               |
| `nap.phone`               | Phone number                              |
| `nap.email`               | Email address                             |
| `nap.whatsapp`            | WhatsApp number                           |
| `mapEmbed.src`            | Google Maps embed URL for office location |
| `hours.schedule[*].hours` | Actual operating hours (2 entries)        |

### fleet.json (6 markers)

| Field Path                      | What's Needed                                                  |
| ------------------------------- | -------------------------------------------------------------- |
| `vehicles[0].priceNote`         | Innova Crysta daily rate                                       |
| `vehicles[1].priceNote`         | 12-seater Tempo daily rate                                     |
| `vehicles[2].priceNote`         | 14-seater Tempo daily rate                                     |
| `vehicles[3].priceNote`         | 17-seater Tempo daily rate                                     |
| `vehicles[4].priceNote`         | 26-seater Mini Bus daily rate                                  |
| `homepage.trustBadges[3].label` | Number of travellers served (e.g., "5,000+ Travellers Served") |

### reviews.json (8 markers)

All 8 testimonials need real client data:

| Field   | What's Needed (per testimonial)            |
| ------- | ------------------------------------------ |
| `name`  | Client's real name (with permission)       |
| `quote` | Authentic testimonial text (3–5 sentences) |
| `date`  | Month/year of the trip                     |

Testimonials cover: Singapore-Malaysia family trip, local 3-day circuit, Bali honeymoon, wedding transport, Vietnam budget trip, Sri Lanka family, Dubai luxury, corporate group.

### terms.json (7 markers)

| Field Path                   | What's Needed                                                         |
| ---------------------------- | --------------------------------------------------------------------- |
| `lastUpdated`                | Actual date of terms finalization                                     |
| `sections[1]` (Booking)      | Advance payment percentages for fleet and international (3 values)    |
| `sections[2]` (Cancellation) | Cancellation tiers and refund percentages for fleet and international |
| `sections[7]` (Privacy)      | Document retention period (e.g., 30 days)                             |
| `sections[8]` (Disputes)     | Jurisdiction city (e.g., "Nagercoil")                                 |

---

## Local Tours Silo

### trivandrum-kanyakumari-3-days.json (2 markers)

| Field Path       | What's Needed                                        |
| ---------------- | ---------------------------------------------------- |
| `author.name`    | Author name (consistent across all pages)            |
| `faqs[0].answer` | Actual pricing for the 3-day circuit by vehicle type |

### kanyakumari-sightseeing.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### trivandrum-heritage.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### hidden-gems.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### temple-pilgrimages.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### eco-nature-trails.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### cuisine-guide.json (5 markers)

| Field Path            | What's Needed                                                  |
| --------------------- | -------------------------------------------------------------- |
| `author.name`         | Author name                                                    |
| `sections[0].body[2]` | 2–3 specific seafood restaurant recommendations with locations |
| `sections[1].body[2]` | 2–3 specific sadya restaurant recommendations                  |
| `sections[2].body[3]` | 1–2 specific breakfast spot recommendations                    |
| `sections[3].body[2]` | 1–2 specific Chettinad restaurant recommendations              |

### faq.json (5 markers)

| Field Path                    | What's Needed                               |
| ----------------------------- | ------------------------------------------- |
| `faqGroups[1].faqs[2].answer` | One-way airport drop pricing (Innova)       |
| `faqGroups[2].faqs[0].answer` | Full-day Innova rental pricing              |
| `faqGroups[2].faqs[2].answer` | Early/late hour surcharge policy and amount |
| `faqGroups[3].faqs[1].answer` | Phone number for bookings                   |
| `faqGroups[3].faqs[1].answer` | WhatsApp number for bookings                |

---

## International Tours Silo

### All destination pages (6 files × 1 marker each)

Each destination page (singapore-malaysia, bali-honeymoon, vietnam, sri-lanka, dubai, thailand) has:

| Field Path    | What's Needed            |
| ------------- | ------------------------ |
| `author.name` | Author name (consistent) |

### trending-2026.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### visa-guide.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### best-time-to-visit.json (1 marker)

| Field Path    | What's Needed |
| ------------- | ------------- |
| `author.name` | Author name   |

### faq.json (international) (3 markers)

| Field Path                    | What's Needed                   |
| ----------------------------- | ------------------------------- |
| `faqGroups[4].faqs[0].answer` | Phone number                    |
| `faqGroups[4].faqs[0].answer` | WhatsApp number                 |
| `faqGroups[4].faqs[1].answer` | Advance payment percentages     |
| `faqGroups[4].faqs[3].answer` | Cancellation policy percentages |

---

## Summary by Priority

### Must-fill before launch (blocks real functionality)

- Business phone, email, WhatsApp (common.json, contact.json, FAQ pages)
- Office address and postal code
- Google Maps embed URL
- Social media URLs
- Operating hours

### Should-fill before launch (affects trust and SEO)

- Team member names, bios, and photos
- All 8 client testimonials (real quotes with permission)
- Author name (appears on ~18 pages via Article schema)
- About Us story paragraphs
- Founding year

### Should-fill before launch (affects pricing accuracy)

- All fleet vehicle daily rates
- Cancellation/refund tiers and percentages
- Advance payment percentages
- Specific restaurant recommendations in cuisine guide

### Can fill post-launch (nice to have)

- Travellers served count (trust badge)
- Specific one-way transfer pricing in FAQ
- Early/late hour surcharge amount
