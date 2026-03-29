// ═══════════════════════════════════════════════════════
// JSON-LD Schema Builder — iWay Tourism
// Reads common.json + schema templates, merges with
// page-specific data, returns valid JSON-LD objects.
// ═══════════════════════════════════════════════════════

import commonData from '../content/common.json';
import webAppTemplate from '../content/schema-templates/web-application.json';
import type {
  FAQItem,
  TestimonialCardProps,
  TeamMemberCardProps,
  VehicleCardProps,
  AttractionCardProps,
  ItineraryDayProps,
  PricingTier,
  BreadcrumbItem,
  JsonLdSchema,
} from './types';

// ─── Helpers ───

const siteUrl: string = commonData.business.url;

/** Deep-replace {{placeholder}} tokens in a JSON structure. */
function replacePlaceholders(
  obj: unknown,
  data: Record<string, unknown>
): unknown {
  if (typeof obj === 'string') {
    const fullMatch = obj.match(/^\{\{(\w+)\}\}$/);
    if (fullMatch) {
      return data[fullMatch[1]] ?? obj;
    }
    return obj.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const val = data[key];
      return val != null ? String(val) : `{{${key}}}`;
    });
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replacePlaceholders(item, data));
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = replacePlaceholders(value, data);
    }
    return result;
  }
  return obj;
}

// ═══════════════════════════════════════════════════════
// Global Schemas (injected on every page by BaseLayout)
// ═══════════════════════════════════════════════════════

export function getGlobalSchemas(): JsonLdSchema[] {
  return [
    commonData.schema.organization as JsonLdSchema,
    commonData.schema.website as JsonLdSchema,
  ];
}

// ═══════════════════════════════════════════════════════
// Page-Level Schema Builders
// ═══════════════════════════════════════════════════════

export function buildArticleSchema(data: {
  pageUrl: string;
  title: string;
  description: string;
  heroImage: string;
  authorName: string;
  authorRole: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': data.pageUrl },
    headline: data.title,
    description: data.description,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}${data.heroImage}`,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: data.authorName,
      jobTitle: data.authorRole,
      worksFor: { '@type': 'TravelAgency', name: 'iWay Tourism' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'iWay Tourism',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logo.svg` },
    },
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
  };
}

export function buildFAQPageSchema(faqs: FAQItem[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildLocalBusinessSchema(data: {
  phone: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
  opensTime?: string;
  closesTime?: string;
  priceRange?: string;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'iWay Tourism',
    image: `${siteUrl}/images/logo.svg`,
    url: siteUrl,
    telephone: data.phone,
    email: data.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.streetAddress,
      addressLocality: 'Marthandam',
      addressRegion: 'Tamil Nadu',
      postalCode: data.postalCode,
      addressCountry: 'IN',
    },
    ...(data.latitude &&
      data.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }),
    ...(data.opensTime &&
      data.closesTime && {
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: data.opensTime,
            closes: data.closesTime,
          },
        ],
      }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    areaServed: commonData.schema.organization.areaServed,
  };
}

export function buildProductOfferSchema(data: {
  name: string;
  description: string;
  heroImage: string;
  pageUrl: string;
  tiers: PricingTier[];
  ratingValue?: number;
  reviewCount?: number;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: `${siteUrl}${data.heroImage}`,
    brand: { '@type': 'Organization', name: 'iWay Tourism' },
    provider: { '@type': 'TravelAgency', name: 'iWay Tourism', url: siteUrl },
    offers: data.tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.priceFrom,
      priceCurrency: tier.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: tier.priceFrom,
        priceCurrency: tier.currency,
        minPrice: tier.priceFrom,
        maxPrice: tier.priceTo,
        unitText: tier.perPerson ? 'per person' : 'per group',
      },
      availability: 'https://schema.org/InStock',
      url: data.pageUrl,
      seller: { '@type': 'TravelAgency', name: 'iWay Tourism' },
    })),
    ...(data.ratingValue != null &&
      data.reviewCount != null && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount,
        },
      }),
  };
}

export function buildTouristTripSchema(data: {
  name: string;
  description: string;
  heroImage: string;
  authorName: string;
  attractions: AttractionCardProps[];
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: data.name,
    description: data.description,
    image: `${siteUrl}${data.heroImage}`,
    provider: { '@type': 'TravelAgency', name: 'iWay Tourism', url: siteUrl },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: data.attractions.length,
      itemListElement: data.attractions.map((attraction, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: attraction.name,
          description: attraction.description,
          ...(attraction.latitude != null &&
            attraction.longitude != null && {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: attraction.latitude,
                longitude: attraction.longitude,
              },
            }),
          ...(attraction.timings && { openingHours: attraction.timings }),
        },
      })),
    },
    subjectOf: {
      '@type': 'Article',
      headline: data.name,
      author: { '@type': 'Person', name: data.authorName },
    },
  };
}

export function buildHowToSchema(data: {
  title: string;
  description: string;
  heroImage: string;
  pageUrl: string;
  totalDuration: string;
  estimatedCost?: string;
  days: ItineraryDayProps[];
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.title,
    description: data.description,
    image: { '@type': 'ImageObject', url: `${siteUrl}${data.heroImage}` },
    totalTime: data.totalDuration,
    ...(data.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: data.estimatedCost,
      },
    }),
    step: data.days.map((day) => ({
      '@type': 'HowToStep',
      position: day.dayNumber,
      name: day.title,
      text: day.description,
      url: `${data.pageUrl}#day-${day.dayNumber}`,
    })),
  };
}

export function buildWebApplicationSchema(): JsonLdSchema {
  return replacePlaceholders(
    structuredClone(webAppTemplate.baseProperties),
    { siteUrl }
  ) as JsonLdSchema;
}

export function buildItemListSchema(
  items: { name: string; url: string }[]
): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${siteUrl}${item.url}`,
    })),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

// ═══════════════════════════════════════════════════════
// Component-Level Schema Builders
// ═══════════════════════════════════════════════════════

export function buildReviewSchema(testimonial: TestimonialCardProps): JsonLdSchema {
  return {
    '@type': 'Review',
    author: { '@type': 'Person', name: testimonial.name },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: testimonial.rating,
      bestRating: 5,
    },
    reviewBody: testimonial.quote,
    ...(testimonial.date && { datePublished: testimonial.date }),
  };
}

export function buildAggregateRatingSchema(data: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: data.ratingValue,
    reviewCount: data.reviewCount,
    bestRating: data.bestRating ?? 5,
    itemReviewed: {
      '@type': 'TravelAgency',
      name: 'iWay Tourism',
    },
  };
}

export function buildPersonSchema(member: TeamMemberCardProps): JsonLdSchema {
  return {
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    ...(member.image && { image: `${siteUrl}${member.image}` }),
    worksFor: { '@type': 'TravelAgency', name: 'iWay Tourism' },
  };
}

export function buildOfferCatalogSchema(vehicles: VehicleCardProps[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'iWay Tourism Fleet & Ground Transport',
    itemListElement: vehicles.map((vehicle) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: vehicle.name,
        description: `${vehicle.type} — seats ${vehicle.capacity}. ${vehicle.idealFor}`,
        image: `${siteUrl}${vehicle.image}`,
      },
      ...(vehicle.priceNote && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          description: vehicle.priceNote,
        },
      }),
    })),
  };
}

export function buildWebPageSchema(data: {
  title: string;
  description: string;
  pageUrl: string;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    description: data.description,
    url: data.pageUrl,
    publisher: { '@type': 'Organization', name: 'iWay Tourism' },
  };
}
