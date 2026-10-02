/**
 * Every word on the services page that is not a service itself. Services live
 * in src/data/services.ts. English only for now; a translation is a copy of
 * this file and one import.
 *
 * Proof is limited to what the owner has confirmed: 100,000+ cleaning hours
 * and the reclean or full refund guarantee. Nothing else is claimed.
 */
export type ServicesCopy = {
  htmlLang: string
  ogLocale: string
  path: string
  meta: { title: string; description: string; ogImage: string }
  hero: {
    h1: string
    sub: string
    book: string
    whatsApp: string
    waMessage: string
    photoAlt: string
  }
  jump: { label: string }
  proof: {
    title: string
    hours: { figure: string; text: string }
    guarantee: { title: string; text: string }
  }
  close: {
    title: string
    text: string
    whatsApp: string
    waMessage: string
  }
}

export const SERVICES_EN: ServicesCopy = {
  htmlLang: 'en-MY',
  ogLocale: 'en_MY',
  path: '/',

  meta: {
    title: 'Cleaning Services in Klang Valley | Kleaner',
    description:
      'Home, deep and move-out cleaning, post renovation, formaldehyde removal, aircond, sofa, curtain and carpet care, and movers in Klang Valley.',
    ogImage: '/og/index.jpg',
  },

  hero: {
    h1: 'Your home, our honour.',
    sub: 'Home cleaning, renovation clean-ups, aircond, upholstery and moving across Klang Valley. Pick a service and book.',
    book: 'Book now',
    whatsApp: 'WhatsApp us',
    waMessage: "Hi Kleaner, I'd like to ask about your services.",
    photoAlt: 'A Kleaner cleaner mopping the floor of a sunlit condo living room with the Kuala Lumpur skyline outside',
  },

  jump: { label: 'Jump to a service group' },

  proof: {
    title: 'Done properly, or done again.',
    hours: {
      figure: '100,000+',
      text: 'cleaning hours delivered.',
    },
    guarantee: {
      title: 'Reclean or full refund',
      text: 'Not happy with the clean? We come back and clean it again. Still not happy, you get a full refund.',
    },
  },

  close: {
    title: 'Not sure which service you need?',
    text: 'Send us a WhatsApp message with what needs doing and we will point you to the right one.',
    whatsApp: 'WhatsApp us',
    waMessage: "Hi Kleaner, I'm not sure which service I need. Here is the job:",
  },
}
