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
    cta: string
    whatsApp: string
    waMessage: string
  }

  trust: {
    items: readonly { icon: IconName; text: string }[]
    confirm: string
  }

  grid: {
    eyebrow: string
    title: string
    book: string
    fallbackNote: string
  }

  chooser: {
    eyebrow: string
    title: string
    lead: string
    /** Each question points at a slug in services.ts. */
    questions: readonly { question: string; answer: string; slug: string }[]
    whatsAppLead: string
    whatsApp: string
    waMessage: string
  }

  guarantee: {
    eyebrow: string
    title: string
    text: string
  }

  voucher: {
    headline: string
    code: string
    terms: string
    cta: string
    confirm: string
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
      'Every Kleaner service in one place: general cleaning, sofa and mattress, post-renovation, formaldehyde removal, movers and Kleaner Club. Book in one tap.',
    ogImage: '/og/index.jpg',
  },

  hero: {
    h1: 'Every Kleaner service, one tap to book.',
    sub: 'Over 100,000 cleaning hours delivered across Klang Valley.',
    cta: 'See services',
    whatsApp: 'Ask on WhatsApp',
    waMessage: "Hi Kleaner, I'd like to ask about your cleaning services.",
  },

  trust: {
    items: [
      { icon: 'clock', text: '100,000+ cleaning hours delivered' },
      { icon: 'guarantee', text: 'Satisfaction guarantee: reclean or full refund' },
      { icon: 'shield', text: 'Trained in-house team, not gig workers' },
      { icon: 'home', text: 'Klang Valley coverage' },
    ],
    confirm:
      'We publish that providers are background checked. "Trained in-house team, not gig workers" is a claim about how people are employed, which is a different and stronger thing to say. Confirm it is accurate before this page goes live, because a competitor would be entitled to challenge it.',
  },

  grid: {
    eyebrow: 'Services',
    title: 'Pick what you need',
    book: 'Book now',
    fallbackNote: 'Opens the Kleaner booking form, where you choose this service.',
  },

  chooser: {
    eyebrow: 'Not sure which one?',
    title: 'Three questions, one answer',
    lead: 'Most people land on one of these.',
    questions: [
      {
        question: 'Just finished a renovation?',
        answer: 'Post-Renovation Cleaning',
        slug: 'post-renovation',
      },
      {
        question: 'Stains on the sofa or mattress?',
        answer: 'Sofa & Mattress Deep Cleaning',
        slug: 'sofa-mattress',
      },
      {
        question: 'Want regular help at home?',
        answer: 'General Cleaning',
        slug: 'general-cleaning',
      },
    ],
    whatsAppLead: 'Still not sure? Describe the job and we will tell you which one it is.',
    whatsApp: 'Ask on WhatsApp',
    waMessage: "Hi Kleaner, I'm not sure which service I need. Here is the job:",
  },

  guarantee: {
    eyebrow: 'Guarantee',
    title: 'Reclean or full refund',
    text: 'If you are not happy with the clean, we come back and clean it again. If you are still not happy, we refund you in full. That applies to every service on this page.',
  },

  voucher: {
    headline: 'RM20 off your first booking',
    code: 'KLEANERHOME',
    terms: 'One use per customer. Valid to 31 December 2026.',
    cta: 'Book and use the code',
    confirm:
      'Is the code KLEANERHOME live in BookingKoala right now, is it RM20 off, one use per customer, and does it run to 31 December 2026? A code that does not work at checkout costs more than no code at all, so we will pull this strip rather than publish it unchecked.',
  },
}
