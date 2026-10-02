import type { ImageMetadata } from 'astro'
import type { IconName } from '../components/Icon.astro'

import standardPhoto from '../../assets/plates/home-card-1-photo.png'
import deepPhoto from '../../assets/plates/home-card-2-photo.png'
import moveInOutPhoto from '../../assets/plates/home-card-3-photo.png'
import postRenoPhoto from '../../assets/plates/reno-row-1-photo.png'
import formaldehydePhoto from '../../assets/plates/reno-row-2-photo.png'
import aircondPhoto from '../../assets/photos/aircond.png'
import sofaPhoto from '../../assets/photos/sofa-mattress.png'
import curtainPhoto from '../../assets/photos/curtain-carpet.png'
import moverPhoto from '../../assets/photos/mover.png'
import homeGroupPhoto from '../../assets/plates/launch-1-photo.png'
import renoGroupPhoto from '../../assets/plates/launch-2-photo.png'
import specialistGroupPhoto from '../../assets/plates/launch-3-photo.png'
import movingGroupPhoto from '../../assets/plates/launch-4-photo.png'

/**
 * Every Kleaner service, once, with the exact booking link the owner gave on
 * 2 October 2026. The page, the structured data and scripts/verify.mjs all
 * read from here, so a link changes in one place.
 *
 * Each `line` says what the service is in plain words: no prices, no claims
 * about results, nothing about the steps inside the booking form.
 */

export type CtaLabel = 'Book now' | 'Get a quote'

export type Service = {
  /** The anchor id. Ads and WhatsApp messages deep-link to #<slug>. */
  slug: string
  /** Older anchors that still have to land on this service. */
  aliases?: readonly string[]
  name: string
  line: string
  bookingUrl: string
  cta: CtaLabel
  photo: ImageMetadata
  /** Describes the photo for screen readers. */
  alt: string
}

export type ServiceGroup = {
  slug: string
  name: string
  icon: IconName
  photo: ImageMetadata
  services: readonly Service[]
}

const BOOK_HOME = 'https://kleaner.my/booknow'
const BOOK_POST_RENO = 'https://kleaner.my/booknow/post-renovation'
const BOOK_AIRCOND = 'https://kleaner.my/booknow/aircond-servicing'
const BOOK_UPHOLSTERY = 'https://kleaner.my/booknow/upholstery-cleaning'
const BOOK_MOVERS = 'https://kleaner.my/booknow/movers'

export const GROUPS: readonly ServiceGroup[] = [
  {
    slug: 'home-cleaning',
    name: 'Home cleaning',
    icon: 'home',
    photo: homeGroupPhoto,
    services: [
      {
        slug: 'standard-cleaning',
        aliases: ['general-cleaning'],
        name: 'Standard Cleaning',
        line: 'Regular cleaning for your home, from floors to kitchen and bathrooms.',
        bookingUrl: BOOK_HOME,
        cta: 'Book now',
        photo: standardPhoto,
        alt: 'A Kleaner cleaner vacuuming beside a grey sofa in a bright condo living room',
      },
      {
        slug: 'deep-cleaning',
        name: 'Deep Cleaning',
        line: 'A more thorough clean for a home that needs more than a regular visit.',
        bookingUrl: BOOK_HOME,
        cta: 'Book now',
        photo: deepPhoto,
        alt: 'A Kleaner cleaner in gloves wiping down a marble kitchen counter',
      },
      {
        slug: 'move-in-move-out',
        name: 'Move In / Move Out Cleaning',
        line: 'Cleaning an empty home before you move in or after you move out.',
        bookingUrl: BOOK_HOME,
        cta: 'Book now',
        photo: moveInOutPhoto,
        alt: 'A Kleaner cleaner wiping a carton among moving boxes in an empty condo',
      },
    ],
  },
  {
    slug: 'after-renovation',
    name: 'After renovation',
    icon: 'renovation',
    photo: renoGroupPhoto,
    services: [
      {
        slug: 'post-renovation',
        name: 'Post Renovation Cleaning',
        line: 'Clearing the dust and debris left behind after renovation work.',
        bookingUrl: BOOK_POST_RENO,
        cta: 'Book now',
        photo: postRenoPhoto,
        alt: 'A Kleaner cleaner wiping dust off a window frame in a renovated condo',
      },
      {
        slug: 'formaldehyde-removal',
        name: 'Formaldehyde Removal',
        line: 'Formaldehyde treatment for newly renovated or newly furnished rooms.',
        bookingUrl: BOOK_POST_RENO,
        cta: 'Book now',
        photo: formaldehydePhoto,
        alt: 'A Kleaner technician holding an air meter beside an air purifier',
      },
    ],
  },
  {
    slug: 'specialist-care',
    name: 'Specialist care',
    icon: 'snowflake',
    photo: specialistGroupPhoto,
    services: [
      {
        slug: 'aircond-maintenance',
        name: 'Aircond Maintenance',
        line: 'Servicing and cleaning for the aircond units in your home.',
        bookingUrl: BOOK_AIRCOND,
        cta: 'Book now',
        photo: aircondPhoto,
        alt: 'A Kleaner technician cleaning a wall-mounted aircond unit',
      },
      {
        slug: 'sofa-mattress',
        name: 'Sofa & Mattress Cleaning',
        line: 'Cleaning for sofas and mattresses, done in your home.',
        bookingUrl: BOOK_UPHOLSTERY,
        cta: 'Book now',
        photo: sofaPhoto,
        alt: 'A Kleaner cleaner using an upholstery cleaner on a grey sofa',
      },
      {
        slug: 'curtain-carpet',
        name: 'Curtain & Carpet Cleaning',
        line: 'Cleaning for curtains, sheers and carpets.',
        bookingUrl: BOOK_UPHOLSTERY,
        cta: 'Book now',
        photo: curtainPhoto,
        alt: 'A Kleaner cleaner steam cleaning long curtains by a window',
      },
    ],
  },
  {
    slug: 'moving',
    name: 'Moving',
    icon: 'truck',
    photo: movingGroupPhoto,
    services: [
      {
        slug: 'movers',
        aliases: ['mover'],
        name: 'Mover',
        line: 'Home and office moves across the Klang Valley.',
        bookingUrl: BOOK_MOVERS,
        cta: 'Get a quote',
        photo: moverPhoto,
        alt: 'Two Kleaner movers carrying a wrapped sofa from a lorry into a terrace house',
      },
    ],
  },
] as const

/** All nine services in page order. */
export const SERVICES: readonly Service[] = GROUPS.flatMap((group) => group.services)

/** The front door of the booking flow, used by the hero's Book now. */
export const BOOKING_URL = BOOK_HOME
