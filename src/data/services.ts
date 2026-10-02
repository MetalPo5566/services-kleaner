import type { IconName } from '../components/Icon.astro'
import type { PictogramName } from '../components/Pictogram.astro'
import { SITE } from './site'

/**
 * Every Kleaner service, once. The grid renders from this array and nothing
 * else, so adding a service is a new entry here and no change to any markup.
 *
 * The board quotes no prices: each tile goes straight to its booking flow,
 * which shows the price for the job.
 *
 * A new unverified claim gets a `confirm` string, which renders a visible note
 * and scripts/gen-owner-confirm.mjs collects it.
 */

/** The booking flow's front door, where the home cleaning services start. */
const BOOKING_HOME = SITE.bookingUrl
const BOOKING_POST_RENO = 'https://kleaner.my/booknow/post-renovation'
const BOOKING_AIRCOND = 'https://kleaner.my/booknow/aircond-servicing'
const BOOKING_UPHOLSTERY = 'https://kleaner.my/booknow/upholstery-cleaning'
const BOOKING_MOVERS = 'https://kleaner.my/booknow/movers'

export type Service = {
  slug: string
  name: string
  /** The tile's own name, short enough for two lines of board lettering. */
  short: string
  /** One line, literal, no hype. Sits directly under the name. */
  promise: string
  bullets: readonly string[]
  badge?: string
  bookingUrl: string
  icon: IconName
  /** The tile's drawing, from the board's own pictogram set. */
  pictogram: PictogramName
  /** True when bookingUrl is the shared booking form rather than its own flow. */
  isFallbackUrl: boolean
  confirm?: string
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'standard-cleaning',
    name: 'Standard Cleaning',
    short: 'Standard',
    promise: 'Routine cleaning for your home, by trained Kleaner cleaners.',
    bullets: ['Weekly, biweekly, monthly or one-off', 'Bring your own supplies or use ours'],
    badge: 'Most booked',
    bookingUrl: BOOKING_HOME,
    icon: 'vacuum',
    pictogram: 'vacuum',
    isFallbackUrl: true,
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    short: 'Deep Clean',
    promise: 'A top to bottom clean for a home that needs more than the usual.',
    bullets: ['One-off, booked when you need it'],
    bookingUrl: BOOKING_HOME,
    icon: 'sparkle',
    pictogram: 'spray',
    isFallbackUrl: true,
  },
  {
    slug: 'move-in-out',
    name: 'Move In / Move Out Cleaning',
    short: 'Move In / Out',
    promise: 'A full clean of an empty home, before you move in or after you move out.',
    bullets: ['Scheduled around your moving date'],
    bookingUrl: BOOKING_HOME,
    icon: 'home',
    pictogram: 'box',
    isFallbackUrl: true,
  },
  {
    slug: 'post-renovation',
    name: 'Post Renovation Cleaning',
    short: 'Post-Reno',
    promise:
      'Full clean of a newly renovated home, office, shoplot or restaurant.',
    bullets: [
      'Every floor type, including tile, marble, timber and vinyl',
      'One-off, scheduled around your handover date',
    ],
    bookingUrl: BOOKING_POST_RENO,
    icon: 'home',
    pictogram: 'house',
    isFallbackUrl: false,
  },
  {
    slug: 'formaldehyde-removal',
    name: 'Formaldehyde Removal',
    short: 'Formaldehyde',
    promise:
      'Formaldehyde filtering plus air and surface sterilisation for a newly renovated space.',
    bullets: ['Can be added to a post-renovation clean'],
    badge: 'New',
    bookingUrl: BOOKING_POST_RENO,
    icon: 'wind',
    pictogram: 'air',
    isFallbackUrl: false,
  },
  {
    slug: 'aircond-maintenance',
    name: 'Aircond Maintenance',
    short: 'Aircond',
    promise: 'Servicing for the air conditioners in your home or office.',
    bullets: [],
    bookingUrl: BOOKING_AIRCOND,
    icon: 'wind',
    pictogram: 'aircond',
    isFallbackUrl: false,
  },
  {
    slug: 'sofa-mattress',
    name: 'Sofa & Mattress Cleaning',
    short: 'Sofa & Mattress',
    promise:
      'Extraction cleaning for sofas, from 1 seater to L-shape, and mattresses from single to super king.',
    bullets: ['Lifts dust mites, stains and odours', 'Left to dry after the clean'],
    bookingUrl: BOOKING_UPHOLSTERY,
    icon: 'sofa',
    pictogram: 'sofa',
    isFallbackUrl: false,
  },
  {
    slug: 'curtain-carpet',
    name: 'Curtain & Carpet Cleaning',
    short: 'Curtain & Carpet',
    promise: 'Cleaning for curtains, sheers and carpets.',
    bullets: [],
    bookingUrl: BOOKING_UPHOLSTERY,
    icon: 'curtain',
    pictogram: 'curtain',
    isFallbackUrl: false,
  },
  {
    slug: 'movers',
    name: 'Mover',
    short: 'Mover',
    promise: 'Home and office moving, with cleaning booked in the same job.',
    bullets: ['Across the Klang Valley'],
    bookingUrl: BOOKING_MOVERS,
    icon: 'truck',
    pictogram: 'van',
    isFallbackUrl: false,
  },
] as const
