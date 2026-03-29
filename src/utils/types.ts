// ═══════════════════════════════════════════════════════
// Shared TypeScript Interfaces — iWay Tourism
// ═══════════════════════════════════════════════════════

// ─── SEO & Layout ───

export interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export interface HeroProps {
  heading: string;
  subheading?: string;
  image: string;
  imageAlt: string;
}

// ─── Navigation ───

export interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export type SiloType = 'local-tours' | 'international-tours';

// ─── Content Components ───

export interface QuickAnswerProps {
  question: string;
  answer: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQGroup {
  groupHeading: string;
  faqs: FAQItem[];
}

export interface CrossSellLink {
  label: string;
  url: string;
  tagline?: string;
}

export interface CrossSellProps {
  heading: string;
  body: string;
  links: CrossSellLink[];
}

export interface PracticalInfoData {
  howToGetThere?: string;
  bestTimeToVisit?: string;
  duration?: string;
  difficulty?: string;
  tips?: string[];
}

// ─── Cards ───

export interface PackageCardProps {
  title: string;
  slug: string;
  tagline: string;
  priceFrom?: number;
  image: string;
  imageAlt: string;
}

export interface VehicleCardProps {
  name: string;
  type: string;
  capacity: number;
  image: string;
  imageAlt: string;
  features: string[];
  idealFor: string;
  priceNote?: string;
}

export interface TestimonialCardProps {
  name: string;
  location?: string;
  tripType?: string;
  quote: string;
  rating: number;
  date?: string;
}

export interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image?: string;
  imageAlt?: string;
}

export interface AttractionCardProps {
  name: string;
  description: string;
  image?: string;
  imageAlt?: string;
  timings?: string;
  entryFee?: string;
  dressCode?: string;
  duration?: string;
  highlights?: string[];
  latitude?: number;
  longitude?: number;
}

// ─── Itinerary ───

export interface ItineraryStopProps {
  name: string;
  description: string;
  duration?: string;
  tip?: string;
  image?: string;
  imageAlt?: string;
}

export interface ItineraryDayProps {
  dayNumber: number;
  title: string;
  description: string;
  stops: ItineraryStopProps[];
  meals?: string;
  overnight?: string;
}

// ─── Pricing ───

export interface PricingTier {
  name: string;
  duration: string;
  priceFrom: number;
  priceTo: number;
  currency: string;
  perPerson: boolean;
  includes: string[];
  excludes?: string[];
  highlights?: string[];
}

export interface PriceBadgeProps {
  priceFrom: number;
  currency?: string;
}

// ─── Schema ───

export type JsonLdSchema = Record<string, unknown>;

export interface SchemaBlockProps {
  schema: JsonLdSchema | JsonLdSchema[];
}
