import type { IconName } from '../components/Icon.astro'
import type { PictogramName } from '../components/Pictogram.astro'
import {
  SITE,
  rm,
  fromPrice,
  RATE_PER_SQFT,
  FORMALDEHYDE_PRICE,
  STERILISATION_PRICE,
} from './site'

/**
 * Every Kleaner service, once. The grid renders from this array and nothing
 * else, so adding a service is a new entry here and no change to any markup.
 *
 * Every figure comes from prices.json through the helpers in site.ts. Nothing
 * is typed in as a literal, so the cards and the booking form cannot drift.
 *
 * The owner confirmed every claim on these cards on 2 October 2026, so none
 * carries a note. A new unverified claim gets a `confirm` string again, which
 * renders a visible note and scripts/gen-owner-confirm.mjs collects it.
 */

/** The booking flow's front door. Used wherever a direct route is not known. */
const BOOKING_FALLBACK = SITE.bookingUrl

/**
 * The route the upholstery site has always used. It is this repository's own
 * established target rather than a guess, but it could not be resolved from
 * this machine, so it carries a note like the rest.
 */
const UPHOLSTERY_BOOKING = 'https://kleaner.my/booknow/upholstery-cleaning'

export type Service = {
  slug: string
  name: string
  /** The tile's own name, short enough for two lines of board lettering. */
  short: string
  /** The price tag on the tile. Read from prices.json like every figure. */
  tag: string
  /** One line, literal, no hype. Sits directly under the name. */
  promise: string
  bullets: readonly string[]
  /** Rendered as given. "Get instant price" wherever we have no number. */
  price: string
  badge?: string
  bookingUrl: string
  icon: IconName
  /** The tile's drawing, from the board's own pictogram set. */
  pictogram: PictogramName
  /** True when bookingUrl is the generic flow rather than a direct route. */
  isFallbackUrl: boolean
  confirm?: string
}

export const QUOTE_PRICE = 'Get instant price'
const TAG_INSTANT = 'Instant price'

export const SERVICES: readonly Service[] = [
  {
    slug: 'general-cleaning',
    name: 'General Cleaning (Hourly Maid)',
    short: 'General Cleaning',
    tag: TAG_INSTANT,
    promise: 'Trained cleaners by the hour, minimum 4 hours, up to 4 cleaners.',
    bullets: [
      'Bring your own supplies or use ours',
      'Weekly, biweekly, monthly or one-off',
      'Same team on repeat bookings where possible',
    ],
    price: QUOTE_PRICE,
    badge: 'Most booked',
    bookingUrl: BOOKING_FALLBACK,
    icon: 'vacuum',
    pictogram: 'vacuum',
    isFallbackUrl: true,
  },
  {
    slug: 'sofa-mattress',
    name: 'Sofa & Mattress Deep Cleaning',
    short: 'Sofa & Mattress',
    tag: `from ${rm(fromPrice('sofa'))}`,
    promise:
      'Extraction cleaning for sofas, from 1 seater to L-shape, and mattresses from single to super king.',
    bullets: [
      'Lifts dust mites, stains and odours',
      'Left to dry after the clean',
      'Priced per piece, not per hour',
    ],
    price: `from ${rm(fromPrice('sofa'))}`,
    bookingUrl: UPHOLSTERY_BOOKING,
    icon: 'sofa',
    pictogram: 'sofa',
    isFallbackUrl: false,
  },
  {
    slug: 'post-renovation',
    name: 'Post-Renovation Cleaning',
    short: 'Post-Reno',
    tag: `${rm(RATE_PER_SQFT)}/sqft`,
    promise:
      'Full clean of a newly renovated home, office, shoplot or restaurant, priced on built-up area.',
    bullets: [
      `${rm(RATE_PER_SQFT)} per sqft of built-up area`,
      'Every floor type, including tile, marble, timber and vinyl',
      'One-off, scheduled around your handover date',
    ],
    price: `${rm(RATE_PER_SQFT)} per sqft`,
    bookingUrl: BOOKING_FALLBACK,
    icon: 'home',
    pictogram: 'house',
    isFallbackUrl: true,
  },
  {
    slug: 'formaldehyde-removal',
    name: 'Formaldehyde Removal & Air Sterilisation',
    short: 'Formaldehyde',
    tag: `from ${rm(FORMALDEHYDE_PRICE)}`,
    promise:
      'Formaldehyde filtering plus air and surface sterilisation for a newly renovated space.',
    bullets: [
      `Formaldehyde Filter ${rm(FORMALDEHYDE_PRICE)} per job`,
      `Air & Surface Sterilisation ${rm(STERILISATION_PRICE)} per job`,
      'Can be added to a post-renovation clean',
    ],
    price: `from ${rm(FORMALDEHYDE_PRICE)}`,
    badge: 'New',
    bookingUrl: BOOKING_FALLBACK,
    icon: 'wind',
    pictogram: 'air',
    isFallbackUrl: true,
  },
  {
    slug: 'movers',
    name: 'Movers',
    short: 'Movers',
    tag: 'Get quote',
    promise: 'Home and office moving, with cleaning booked in the same job.',
    bullets: [
      'Ballpark price before you commit',
      'Confirmed quote before you pay',
      'Across the Klang Valley',
    ],
    price: QUOTE_PRICE,
    bookingUrl: SITE.moversSite,
    icon: 'truck',
    pictogram: 'van',
    isFallbackUrl: false,
  },
  {
    slug: 'kleaner-club',
    name: 'Kleaner Club',
    short: 'Kleaner Club',
    tag: 'Member rate',
    promise: 'Recurring cleaning at member rates, with priority slots.',
    bullets: [
      'Member rate held for the length of the plan',
      'Priority scheduling',
      'Satisfaction guarantee on every visit',
    ],
    price: QUOTE_PRICE,
    badge: 'Best value',
    bookingUrl: BOOKING_FALLBACK,
    icon: 'starLine',
    pictogram: 'star',
    isFallbackUrl: true,
  },
] as const
