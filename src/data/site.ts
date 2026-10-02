import pricesData from './prices.json'

export type PriceItem = { name: string; price: number }
export type PriceGroup = { label: string; unit: string; icon: string; items: PriceItem[] }
export type Prices = {
  currency: string
  prefix: string
  pulledOn: string
  source: string
  note: string
  groups: Record<string, PriceGroup>
}

export const prices = pricesData as Prices

/**
 * Formats a price exactly as the booking form shows it: RM prefix, no decimals.
 * The one exception is a rate that is not a whole ringgit, such as the RM1.20
 * per sqft post-renovation rate, which needs its two decimals to mean anything.
 */
export function rm(value: number): string {
  const body = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${prices.prefix}${body}`
}

/** Lowest price in a group, used for the "from RMxx" summaries. */
export function fromPrice(groupKey: keyof Prices['groups'] | string): number {
  const group = prices.groups[groupKey]
  if (!group) throw new Error(`Unknown price group: ${groupKey}`)
  return Math.min(...group.items.map((item) => item.price))
}

/** Looks up one item's price so nothing has to be repeated in the copy. */
export function priceOf(groupKey: string, itemName: string): number {
  const item = prices.groups[groupKey]?.items.find((entry) => entry.name === itemName)
  if (!item) throw new Error(`Unknown price: ${groupKey} / ${itemName}`)
  return item.price
}

/** The figures the service cards quote, all read from prices.json. */
export const RATE_PER_SQFT = priceOf('postreno', 'Built-up area')
export const FORMALDEHYDE_PRICE = priceOf('treatment', 'Formaldehyde Filter')
export const STERILISATION_PRICE = priceOf('treatment', 'Air & Surface Sterilisation')

export const SITE = {
  name: 'Kleaner',
  tagline: 'The Benchmark of Cleaning Service',
  url: 'https://home.kleaner.my',
  mainSite: 'https://kleaner.my',
  /** The other standalone Kleaner sites this one links out to. */
  postRenoSite: 'https://postreno.kleaner.my',
  upholsterySite: 'https://upholstery.kleaner.my',
  moversSite: 'https://movers.kleaner.my',
  /** Call line shown in the main site header and footer. */
  phone: '+60174770010',
  phoneDisplay: '+60174770010',
  /** WhatsApp line. Intentionally a different number from the call line. */
  whatsapp: '60174770978',
  hours: 'Monday to Sunday, 7:30 AM to 6:00 PM',
  hoursShort: 'Mon to Sun, 7:30 AM to 6:00 PM',
  areaServed: 'Kuala Lumpur and Selangor',
  areaShort: 'KL & Selangor',
  /**
   * The front of the BookingKoala flow. Four of the six service cards still
   * point here because their direct routes are not known. See GO-LIVE.md.
   */
  bookingUrl: 'https://kleaner.my/booknow/',
  reviewsUrl: 'https://kleaner.my/reviews',
  antiTheftUrl: 'https://kleaner.my/kleaners-anti-theft-policy',
  airconUrl: 'https://kleaner.my/aircond-servicing',
} as const

/** Builds a wa.me link with the prefilled message URL encoded. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}

/** This site is one page, and that page is the root. */
export const PAGES = {
  services: '/',
} as const

export const ABSOLUTE_PAGES = {
  services: `${SITE.url}/`,
  postReno: `${SITE.postRenoSite}/`,
  sofaMattress: `${SITE.upholsterySite}/sofa-mattress-cleaning`,
  carpetCurtain: `${SITE.upholsterySite}/carpet-curtain-cleaning`,
} as const

export type NavItem = { label: string; href: string; children?: NavItem[] }

/** Mirrors the live kleaner.my header menu. All links are absolute. */
export const HEADER_NAV: NavItem[] = [
  { label: 'Book Now', href: 'https://kleaner.my/booknow/home_cleaning' },
  {
    label: 'Cleaning Services',
    // The parent opens this site, which is what the hub is for.
    href: ABSOLUTE_PAGES.services,
    children: [
      { label: 'All Services', href: ABSOLUTE_PAGES.services },
      { label: 'Standard Cleaning', href: 'https://kleaner.my/standard-cleaning' },
      { label: 'Deep Cleaning', href: 'https://kleaner.my/deep-cleaning' },
      { label: 'Move In/Out Cleaning', href: 'https://kleaner.my/move-in-out' },
      { label: 'Post Renovation Cleaning', href: ABSOLUTE_PAGES.postReno },
      { label: 'Office Cleaning', href: 'https://kleaner.my/office-cleaning' },
      { label: 'Part-Time Maid', href: 'https://kleaner.my/part-time-maid' },
      { label: 'Sofa & Mattress Cleaning', href: ABSOLUTE_PAGES.sofaMattress },
      { label: 'Carpet & Curtain Cleaning', href: ABSOLUTE_PAGES.carpetCurtain },
      { label: 'Movers & Packers', href: SITE.moversSite },
      { label: 'OneClean™', href: 'https://kleaner.my/premium-clean' },
      { label: 'Aircond Service', href: SITE.airconUrl },
    ],
  },
  { label: 'Reviews', href: 'https://kleaner.my/reviews' },
  { label: 'Gift Card', href: 'https://kleaner.my/gift-card' },
  { label: 'FAQs', href: 'https://kleaner.my/faqs' },
  { label: 'Contact Us', href: 'https://kleaner.my/contact-us' },
  { label: 'Client Login', href: 'https://kleaner.my/login' },
]

/** Mirrors the live kleaner.my footer, with the standalone sites in place. */
export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: 'https://kleaner.my/home' },
      { label: 'Get A Quote', href: 'https://kleaner.my/contact-us' },
      { label: 'Gift Cards', href: 'https://kleaner.my/gift-card' },
      { label: 'Blog', href: 'https://kleaner.my/blog' },
      { label: 'Book Now', href: 'https://kleaner.my/booknow/' },
      { label: 'Login/Sign Up', href: 'https://kleaner.my/login' },
    ],
  },
  {
    title: 'Cleaning Services',
    links: [
      { label: 'All Services', href: ABSOLUTE_PAGES.services },
      { label: 'Standard Cleaning', href: 'https://kleaner.my/standard-cleaning' },
      { label: 'Deep Cleaning', href: 'https://kleaner.my/deep-cleaning' },
      { label: 'Move In/Out Cleaning', href: 'https://kleaner.my/move-in-out' },
      { label: 'Post Renovation Cleaning', href: ABSOLUTE_PAGES.postReno },
      { label: 'Office Cleaning', href: 'https://kleaner.my/office-cleaning' },
      { label: 'Part-Time Maid', href: 'https://kleaner.my/part-time-maid' },
      { label: 'Aircond Servicing', href: SITE.airconUrl },
      { label: 'Sofa & Mattress Cleaning', href: ABSOLUTE_PAGES.sofaMattress },
      { label: 'Carpet & Curtain Cleaning', href: ABSOLUTE_PAGES.carpetCurtain },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: 'https://kleaner.my/faqs' },
      { label: 'Privacy Policy', href: 'https://kleaner.my/privacy-policy' },
      { label: 'Anti-Theft Policy', href: SITE.antiTheftUrl },
      { label: 'Reviews', href: 'https://kleaner.my/reviews' },
      { label: 'Contact Us', href: 'https://kleaner.my/contact-us' },
    ],
  },
]
