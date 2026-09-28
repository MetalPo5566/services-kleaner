import type { IconName } from '../components/Icon.astro'
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
 * `confirm` is the same contract as everywhere else on this site: anything not
 * verified against the booking form or already published by Kleaner carries a
 * visible note, and scripts/gen-owner-confirm.mjs collects it.
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
  /** One line, literal, no hype. Sits directly under the name. */
  promise: string
  bullets: readonly string[]
  /** Rendered as given. "Get instant price" wherever we have no number. */
  price: string
  badge?: string
  bookingUrl: string
  icon: IconName
  /** True when bookingUrl is the generic flow rather than a direct route. */
  isFallbackUrl: boolean
  confirm?: string
}

export const QUOTE_PRICE = 'Get instant price'

export const SERVICES: readonly Service[] = [
  {
    slug: 'general-cleaning',
    name: 'General Cleaning (Hourly Maid)',
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
    isFallbackUrl: true,
    confirm:
      'Two things on this card. What is the direct BookingKoala URL for hourly maid or general cleaning? Book Now currently opens the front of the booking flow, so the customer picks the service again. And is "same team on repeat bookings where possible" something we may publish?',
  },
  {
    slug: 'sofa-mattress',
    name: 'Sofa & Mattress Deep Cleaning',
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
    isFallbackUrl: false,
    confirm:
      'Two things on this card. The brief put the starting price at RM80, but the booking form has sofa at RM88 and mattress at RM108, and RM80 is the smallest carpet. The card shows RM88. Confirm which is right. And we have never had a drying time from you, so the bullet says the fabric is left to dry rather than naming hours.',
  },
  {
    slug: 'post-renovation',
    name: 'Post-Renovation Cleaning',
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
    isFallbackUrl: true,
    confirm:
      'Two things on this card. What is the direct BookingKoala URL for post-renovation cleaning? And the brief said post-renovation runs Monday to Saturday, but our published hours are Monday to Sunday. The card avoids naming days until you confirm which is right.',
  },
  {
    slug: 'formaldehyde-removal',
    name: 'Formaldehyde Removal & Air Sterilisation',
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
    isFallbackUrl: true,
    confirm:
      'Does the booking flow let us preselect the formaldehyde add-on from a link? If it does, send the URL. If it does not, this card should say the add-on is chosen inside the form, and we will reword it.',
  },
  {
    slug: 'movers',
    name: 'Movers',
    promise: 'Home and office moving, with cleaning booked in the same job.',
    bullets: [
      'Ballpark price before you commit',
      'Confirmed quote before you pay',
      'Across the Klang Valley',
    ],
    price: QUOTE_PRICE,
    bookingUrl: SITE.moversSite,
    icon: 'truck',
    isFallbackUrl: false,
    confirm:
      'The two quote bullets describe how movers.kleaner.my behaves, which we could not open from here. Confirm that a visitor really does get a ballpark figure first and a confirmed quote before paying, or tell us the real sequence.',
  },
  {
    slug: 'kleaner-club',
    name: 'Kleaner Club',
    promise: 'Recurring cleaning at member rates, with priority slots.',
    bullets: [
      'Member rate held for the length of the plan',
      'Priority scheduling',
      'Satisfaction guarantee on every visit',
    ],
    price: QUOTE_PRICE,
    badge: 'Best value',
    bookingUrl: BOOKING_FALLBACK,
    icon: 'star',
    isFallbackUrl: true,
    confirm:
      'This is the least verified card on the page. Is Kleaner Club live, what are the member rates, what does priority scheduling mean in practice, and is there a link that preselects a recurring frequency? Until you answer, the card states only what the brief gave us and the price reads "Get instant price".',
  },
] as const
