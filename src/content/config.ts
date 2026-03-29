import { defineCollection, z } from 'astro:content';

// ════════════════════════════════════════════════════════════════
// Shared Sub-Schemas
// ════════════════════════════════════════════════════════════════

const seoSchema = z.object({
  title: z.string().max(70),
  description: z.string().max(160),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noindex: z.boolean().default(false),
});

const heroSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  image: z.string(),
  imageAlt: z.string(),
});

const quickAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(), // Target: 40–60 words for AEO extraction
});

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const crossSellSchema = z.object({
  heading: z.string(),
  body: z.string(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
      tagline: z.string().optional(),
    })
  ),
});

const practicalInfoSchema = z.object({
  howToGetThere: z.string().optional(),
  bestTimeToVisit: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.string().optional(),
  tips: z.array(z.string()).optional(),
});

const attractionSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  timings: z.string().optional(),
  entryFee: z.string().optional(),
  dressCode: z.string().optional(),
  duration: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const itineraryStopSchema = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string().optional(),
  tip: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
});

const itineraryDaySchema = z.object({
  dayNumber: z.number(),
  title: z.string(),
  description: z.string(),
  stops: z.array(itineraryStopSchema),
  meals: z.string().optional(),
  overnight: z.string().optional(),
});

const pricingTierSchema = z.object({
  name: z.string(),
  duration: z.string(),
  priceFrom: z.number(),
  priceTo: z.number(),
  currency: z.string().default('INR'),
  perPerson: z.boolean().default(true),
  includes: z.array(z.string()),
  excludes: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
});

const vehicleSchema = z.object({
  name: z.string(),
  type: z.string(),
  capacity: z.number(),
  image: z.string(),
  imageAlt: z.string(),
  features: z.array(z.string()),
  idealFor: z.string(),
  priceNote: z.string().optional(),
});

const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
});

const testimonialSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  tripType: z.string().optional(),
  quote: z.string(),
  rating: z.number().min(1).max(5),
  date: z.string().optional(),
});

// ════════════════════════════════════════════════════════════════
// Core Pages Collection
// Discriminated union — each core page has a unique structure.
// ════════════════════════════════════════════════════════════════

const homepageSchema = z.object({
  pageType: z.literal('homepage'),
  seo: seoSchema,
  hero: heroSchema,
  trustBadges: z.array(
    z.object({
      icon: z.string(),
      label: z.string(),
    })
  ),
  localToursPreview: z.object({
    heading: z.string(),
    subheading: z.string(),
    featured: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        tagline: z.string(),
        image: z.string(),
        imageAlt: z.string(),
      })
    ),
  }),
  internationalToursPreview: z.object({
    heading: z.string(),
    subheading: z.string(),
    featured: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        tagline: z.string(),
        priceFrom: z.number(),
        image: z.string(),
        imageAlt: z.string(),
      })
    ),
  }),
  fleetPreview: z.object({
    heading: z.string(),
    subheading: z.string(),
    featured: z.array(
      z.object({
        name: z.string(),
        capacity: z.number(),
        image: z.string(),
        imageAlt: z.string(),
      })
    ),
  }),
  featuredTestimonials: z.array(testimonialSchema),
  ctaSection: z.object({
    heading: z.string(),
    body: z.string(),
    buttonText: z.string(),
    buttonUrl: z.string(),
  }),
});

const aboutSchema = z.object({
  pageType: z.literal('about'),
  seo: seoSchema,
  hero: heroSchema,
  story: z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()),
  }),
  serviceArea: z.object({
    heading: z.string(),
    description: z.string(),
    locations: z.array(z.string()),
  }),
  team: z.object({
    heading: z.string(),
    members: z.array(teamMemberSchema),
  }),
  values: z.object({
    heading: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
});

const fleetSchema = z.object({
  pageType: z.literal('fleet'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  vehicles: z.array(vehicleSchema),
  bookingProcess: z.object({
    heading: z.string(),
    steps: z.array(
      z.object({
        step: z.number(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  faqs: z.array(faqItemSchema).optional(),
});

const contactSchema = z.object({
  pageType: z.literal('contact'),
  seo: seoSchema,
  hero: heroSchema,
  nap: z.object({
    address: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    country: z.string().default('IN'),
    phone: z.string(),
    email: z.string(),
    whatsapp: z.string().optional(),
  }),
  hours: z.object({
    heading: z.string(),
    schedule: z.array(
      z.object({
        days: z.string(),
        hours: z.string(),
      })
    ),
  }),
  mapEmbed: z.object({
    src: z.string(),
    title: z.string(),
  }),
});

const reviewsSchema = z.object({
  pageType: z.literal('reviews'),
  seo: seoSchema,
  hero: heroSchema,
  aggregateRating: z.object({
    ratingValue: z.number(),
    reviewCount: z.number(),
    bestRating: z.number().default(5),
  }),
  testimonials: z.array(testimonialSchema),
});

const termsSchema = z.object({
  pageType: z.literal('terms'),
  seo: seoSchema,
  hero: heroSchema,
  lastUpdated: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.array(z.string()),
    })
  ),
});

const coreCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('pageType', [
    homepageSchema,
    aboutSchema,
    fleetSchema,
    contactSchema,
    reviewsSchema,
    termsSchema,
  ]),
});

// ════════════════════════════════════════════════════════════════
// Local Tours Collection
// Five page variants within the regional discovery silo.
// ════════════════════════════════════════════════════════════════

const localTourPillarSchema = z.object({
  pageType: z.literal('pillar'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  overview: z.string(),
  spokeCards: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      tagline: z.string(),
      image: z.string(),
      imageAlt: z.string(),
    })
  ),
  faqs: z.array(faqItemSchema).optional(),
});

const localTourItinerarySchema = z.object({
  pageType: z.literal('itinerary'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  overview: z.string(),
  days: z.array(itineraryDaySchema),
  practicalInfo: practicalInfoSchema,
  faqs: z.array(faqItemSchema).optional(),
  crossSell: crossSellSchema.optional(),
});

const localTourSightseeingSchema = z.object({
  pageType: z.literal('sightseeing'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  overview: z.string(),
  attractions: z.array(attractionSchema),
  practicalInfo: practicalInfoSchema,
  faqs: z.array(faqItemSchema).optional(),
  crossSell: crossSellSchema.optional(),
});

const localTourEditorialSchema = z.object({
  pageType: z.literal('editorial'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  overview: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      quickAnswer: quickAnswerSchema.optional(),
      body: z.array(z.string()),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    })
  ),
  practicalInfo: practicalInfoSchema.optional(),
  faqs: z.array(faqItemSchema).optional(),
  crossSell: crossSellSchema.optional(),
});

const localTourFaqSchema = z.object({
  pageType: z.literal('faq'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  overview: z.string(),
  faqGroups: z.array(
    z.object({
      groupHeading: z.string(),
      faqs: z.array(faqItemSchema),
    })
  ),
  crossSell: crossSellSchema.optional(),
});

const localToursCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('pageType', [
    localTourPillarSchema,
    localTourItinerarySchema,
    localTourSightseeingSchema,
    localTourEditorialSchema,
    localTourFaqSchema,
  ]),
});

// ════════════════════════════════════════════════════════════════
// International Tours Collection
// Four page variants for the outbound travel silo.
// ════════════════════════════════════════════════════════════════

const intlTourPillarSchema = z.object({
  pageType: z.literal('pillar'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  overview: z.string(),
  spokeCards: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      tagline: z.string(),
      priceFrom: z.number().optional(),
      image: z.string(),
      imageAlt: z.string(),
    })
  ),
  faqs: z.array(faqItemSchema).optional(),
});

const intlTourDestinationSchema = z.object({
  pageType: z.literal('destination'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  overview: z.array(z.string()), // multiple paragraphs
  pricingTiers: z.array(pricingTierSchema),
  itineraryHighlights: z.array(
    z.object({
      day: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  visaInfo: z.object({
    heading: z.string(),
    quickAnswer: quickAnswerSchema,
    body: z.array(z.string()),
  }),
  bestTimeToVisit: z.object({
    heading: z.string(),
    quickAnswer: quickAnswerSchema,
    body: z.string(),
  }),
  whyBookWithIWay: z.object({
    heading: z.string(),
    reasons: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  faqs: z.array(faqItemSchema).optional(),
});

const intlTourEditorialSchema = z.object({
  pageType: z.literal('editorial'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  overview: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      quickAnswer: quickAnswerSchema.optional(),
      body: z.array(z.string()),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    })
  ),
  faqs: z.array(faqItemSchema).optional(),
});

const intlTourFaqSchema = z.object({
  pageType: z.literal('faq'),
  seo: seoSchema,
  hero: heroSchema,
  quickAnswer: quickAnswerSchema,
  overview: z.string(),
  faqGroups: z.array(
    z.object({
      groupHeading: z.string(),
      faqs: z.array(faqItemSchema),
    })
  ),
});

const internationalToursCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('pageType', [
    intlTourPillarSchema,
    intlTourDestinationSchema,
    intlTourEditorialSchema,
    intlTourFaqSchema,
  ]),
});

// ════════════════════════════════════════════════════════════════
// Schema Templates Collection
// Static JSON-LD base structures consumed by schema-builder.ts.
// ════════════════════════════════════════════════════════════════

const schemaTemplatesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    context: z.string().default('https://schema.org'),
    type: z.string(),
    baseProperties: z.record(z.unknown()),
  }),
});

// ════════════════════════════════════════════════════════════════
// Export Collections
// ════════════════════════════════════════════════════════════════

export const collections = {
  core: coreCollection,
  'local-tours': localToursCollection,
  'international-tours': internationalToursCollection,
  'schema-templates': schemaTemplatesCollection,
};
