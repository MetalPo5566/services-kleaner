import type { IconName } from '../../components/Icon.astro'

/**
 * Every word on /services that is not a service itself. Services live in
 * src/data/services.ts.
 *
 * The page is English only for now. The shell already switches EN and ZH on
 * the post-renovation page, but there is no Bahasa Malaysia anywhere on the
 * site yet, so a three way switcher here would point at two pages that do not
 * exist. Everything is in this one file so services.ms.ts and services.zh.ts
 * are a copy, a translation and one import.
 */
export type ServicesCopy = {
  htmlLang: string
  ogLocale: string
  path: string
  navLabel: string

  meta: { title: string; description: string; ogImage: string }

  hero: {
    h1: string
    sub: string
    whatsApp: string
    waMessage: string
  }

  /** The tile wall and its order bar. */
  board: {
    /** Read to screen readers on every tile. */
    hint: string
    idle: string
    selected: string
    book: string
    details: string
    close: string
    fallbackNote: string
  }

  trust: {
    items: readonly { icon: IconName; text: string }[]
  }

  sets: {
    title: string
    lead: string
    /** Each set points at a slug in services.ts. */
    items: readonly { letter: string; question: string; answer: string; slug: string }[]
    whatsAppLead: string
    whatsApp: string
    waMessage: string
  }

  guarantee: {
    title: string
    text: string
  }

  voucher: {
    pill: string
    headline: string
    code: string
    terms: string
    cta: string
    copy: string
    copied: string
  }
}

export const SERVICES_EN: ServicesCopy = {
  htmlLang: 'en-MY',
  ogLocale: 'en_MY',
  path: '/',
  navLabel: 'All Services',

  meta: {
    title: 'Cleaning Services in Klang Valley | Kleaner',
    description:
      'Every Kleaner service in one place: home, deep and post-renovation cleaning, aircond, sofa, curtain and carpet, and movers. Book in one tap.',
    ogImage: '/og/index.jpg',
  },

  hero: {
    h1: 'Order your clean.',
    sub: 'Every Kleaner service. Tap one to book.',
    whatsApp: 'Ask on WhatsApp',
    waMessage: "Hi Kleaner, I'd like to ask about your cleaning services.",
  },

  board: {
    hint: 'Shows what is included and the book button. Tap again to book.',
    idle: 'Pick a service',
    selected: 'selected',
    book: 'Book now',
    details: "What's included",
    close: 'Close',
    fallbackNote: 'Opens the Kleaner booking form, where you choose this service.',
  },

  trust: {
    items: [
      { icon: 'clock', text: '100,000+ cleaning hours delivered' },
      { icon: 'shield', text: 'Trained in-house team, not gig workers' },
      { icon: 'guarantee', text: 'Background checked providers' },
      { icon: 'home', text: 'Kuala Lumpur and Selangor' },
    ],
  },

  sets: {
    title: 'Not sure? Order a set.',
    lead: 'Most people land on one of these.',
    items: [
      {
        letter: 'A',
        question: 'Just finished a renovation?',
        answer: 'Post-Renovation Cleaning. Add formaldehyde removal in the same booking.',
        slug: 'post-renovation',
      },
      {
        letter: 'B',
        question: 'Stains on the sofa or mattress?',
        answer: 'Sofa & Mattress Cleaning, booked by the piece.',
        slug: 'sofa-mattress',
      },
      {
        letter: 'C',
        question: 'Want regular help at home?',
        answer: 'Standard Cleaning, weekly, biweekly or monthly.',
        slug: 'standard-cleaning',
      },
    ],
    whatsAppLead: 'Still not sure? Describe the job and we will tell you which one it is.',
    whatsApp: 'Ask on WhatsApp',
    waMessage: "Hi Kleaner, I'm not sure which service I need. Here is the job:",
  },

  guarantee: {
    title: 'Reclean or full refund.',
    text: 'If you are not happy with the clean, we come back and clean it again. If you are still not happy, we refund you in full. That applies to every service on this page.',
  },

  voucher: {
    pill: 'RM20 off first booking',
    headline: 'RM20 off your first booking',
    code: 'KLEANERHOME',
    terms: 'One use per customer. Valid to 31 December 2026.',
    cta: 'Book and use the code',
    copy: 'Copy code',
    copied: 'Code copied',
  },
}
