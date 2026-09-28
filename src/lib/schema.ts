import { SITE } from '../data/site'

const AREA_SERVED = [
  { '@type': 'City', name: 'Kuala Lumpur' },
  { '@type': 'State', name: 'Selangor' },
]

const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '07:30',
    closes: '18:00',
  },
]

export function localBusinessSchema(image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.mainSite}/#business`,
    name: SITE.name,
    slogan: SITE.tagline,
    url: SITE.mainSite,
    telephone: SITE.phone,
    image,
    areaServed: AREA_SERVED,
    openingHoursSpecification: OPENING_HOURS,
    sameAs: [SITE.reviewsUrl],
  }
}

/**
 * The services hub, as an ItemList. Built from src/data/services.ts, so a new
 * service appears in the structured data the moment it appears in the grid.
 * Each item points at the URL the card actually links to, including the ones
 * that currently fall back to the front of the booking flow.
 */
export function itemListSchema(options: {
  name: string
  url: string
  items: readonly { name: string; bookingUrl: string; promise: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options.name,
    url: options.url,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.bookingUrl,
      item: {
        '@type': 'Service',
        name: item.name,
        description: item.promise,
        url: item.bookingUrl,
        provider: { '@id': `${SITE.mainSite}/#business` },
        areaServed: AREA_SERVED,
      },
    })),
  }
}
