import type { NavItem, SiloType } from '../utils/types';

// ─── Header Navigation ───
// HANDOFF §9 Layer 1: Home, Local Tours, International Tours, Fleet & Transport, About, Contact

export const headerNav: NavItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Local Tours', url: '/local-tours' },
  { label: 'International Tours', url: '/international-tours' },
  { label: 'Fleet & Transport', url: '/cab-rental-fleet' },
  { label: 'About', url: '/about-us' },
  { label: 'Contact', url: '/contact' },
];

// ─── Footer Navigation ───
// All header links + Reviews, Terms, Budget Calculator

export const footerNav: NavItem[] = [
  ...headerNav,
  { label: 'Reviews', url: '/reviews' },
  { label: 'Terms', url: '/terms-conditions' },
  { label: 'Budget Calculator', url: '/tools/budget-calculator' },
];

// ─── Silo Sidebar Spokes ───
// Used by SiloSidebar.astro for desktop sidebar navigation within each silo

export const siloSpokes: Record<SiloType, NavItem[]> = {
  'local-tours': [
    { label: 'Trivandrum to Kanyakumari — 3-Day Circuit', url: '/local-tours/trivandrum-kanyakumari-3-days' },
    { label: 'Kanyakumari Sightseeing', url: '/local-tours/kanyakumari-sightseeing' },
    { label: 'Trivandrum Heritage Tour', url: '/local-tours/trivandrum-heritage' },
    { label: 'Hidden Gems', url: '/local-tours/hidden-gems' },
    { label: 'Temple Pilgrimages', url: '/local-tours/temple-pilgrimages' },
    { label: 'Eco-Tourism & Nature Trails', url: '/local-tours/eco-nature-trails' },
    { label: 'South India Cuisine Guide', url: '/local-tours/cuisine-guide' },
    { label: 'Local Transport FAQ', url: '/local-tours/faq' },
  ],
  'international-tours': [
    { label: 'Singapore & Malaysia', url: '/international-tours/singapore-malaysia' },
    { label: 'Bali Honeymoon Escapes', url: '/international-tours/bali-honeymoon' },
    { label: 'Vietnam Budget Adventures', url: '/international-tours/vietnam' },
    { label: 'Sri Lanka Express', url: '/international-tours/sri-lanka' },
    { label: 'Dubai Luxury & Shopping', url: '/international-tours/dubai' },
    { label: 'Thailand Coastal Retreats', url: '/international-tours/thailand' },
    { label: 'Emerging 2026 Frontiers', url: '/international-tours/trending-2026' },
    { label: 'Visa Assistance Guide', url: '/international-tours/visa-guide' },
    { label: 'Best Time to Travel', url: '/international-tours/best-time-to-visit' },
    { label: 'International Travel FAQ', url: '/international-tours/faq' },
  ],
};
