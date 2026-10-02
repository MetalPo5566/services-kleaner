// Content checks that run against the built site. Keep this passing: it is what
// stops a price, a menu link, an unsourced claim or an em dash drifting out of
// line.
//
// This site is one page. Everything below runs against it.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const HOST = 'https://services.kleaner.my'
const results = []
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// The prices as written in the brief. Independent of prices.json on purpose,
// so a typo in the data file cannot quietly become the new truth.
const BRIEF_PRICES = {
  postreno: { 'Built-up area': 1.2 },
  treatment: { 'Formaldehyde Filter': 280, 'Air & Surface Sterilisation': 300 },
  sofa: { '1 Seater': 88, '2 Seater': 138, '3 Seater': 168, 'L-Shaped': 198 },
  mattress: { Single: 108, Queen: 148, King: 168, 'Super King': 188 },
  curtain: { Curtain: 68, Sheer: 30 },
  carpet: { '120 x 180 cm': 80, '160 x 210 cm': 110, '180 x 260 cm': 130, '200 x 300 cm': 160 },
}

// The services as written in the brief, restated here on the same principle:
// a service quietly dropped from src/data/services.ts should fail a check.
// Each with the exact booking link the owner gave on 2 October 2026.
const BRIEF_SERVICES = [
  { slug: 'standard-cleaning', name: 'Standard Cleaning', url: 'https://kleaner.my/booknow', cta: 'Book now' },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', url: 'https://kleaner.my/booknow', cta: 'Book now' },
  { slug: 'move-in-move-out', name: 'Move In / Move Out Cleaning', url: 'https://kleaner.my/booknow', cta: 'Book now' },
  { slug: 'post-renovation', name: 'Post Renovation Cleaning', url: 'https://kleaner.my/booknow/post-renovation', cta: 'Book now' },
  { slug: 'formaldehyde-removal', name: 'Formaldehyde Removal', url: 'https://kleaner.my/booknow/post-renovation', cta: 'Book now' },
  { slug: 'aircond-maintenance', name: 'Aircond Maintenance', url: 'https://kleaner.my/booknow/aircond-servicing', cta: 'Book now' },
  { slug: 'sofa-mattress', name: 'Sofa & Mattress Cleaning', url: 'https://kleaner.my/booknow/upholstery-cleaning', cta: 'Book now' },
  { slug: 'curtain-carpet', name: 'Curtain & Carpet Cleaning', url: 'https://kleaner.my/booknow/upholstery-cleaning', cta: 'Book now' },
  { slug: 'movers', name: 'Mover', url: 'https://kleaner.my/booknow/movers', cta: 'Get a quote' },
]
const GROUP_IDS = ['home-cleaning', 'after-renovation', 'specialist-care', 'moving']
// Anchors from the previous page that ads may still use.
const LEGACY_ANCHORS = ['general-cleaning', 'sofa-mattress', 'post-renovation', 'formaldehyde-removal', 'movers']

// The site's own money formatting, restated rather than imported, so the check
// does not pass just because the helper and the page share a bug.
const money = (value) => `RM${Number.isInteger(value) ? value : value.toFixed(2)}`

const prices = JSON.parse(readFileSync('src/data/prices.json', 'utf8'))

const page = join(DIST, 'index.html')
check('the page was built', existsSync(page))
const html = readFileSync(page, 'utf8')

/** Rendered HTML, entity decoded, for assertions about words rather than markup. */
const text = html
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/&#8217;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')

// 1. prices.json matches the brief.
for (const [group, items] of Object.entries(BRIEF_PRICES)) {
  for (const [name, price] of Object.entries(items)) {
    const found = prices.groups[group]?.items.find((item) => item.name === name)
    check(`prices.json ${group} ${name} = ${money(price)}`, found?.price === price, `got ${found?.price}`)
  }
}

// 2. Every service reaches the page with its own anchor, its own analytics tag
// and exactly the booking link and label the brief gives it.
const bookLinks = [...html.matchAll(/<a\b[^>]*data-cta="book"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
  tag: m[0],
  label: m[1].replace(/<[^>]+>/g, '').trim(),
  href: (m[0].match(/href="([^"]*)"/) || [])[1] || '',
  service: (m[0].match(/data-service="([^"]*)"/) || [])[1] || '',
}))
for (const service of BRIEF_SERVICES) {
  check(`renders ${service.slug}`, text.includes(service.name))
  check(`${service.slug} has its anchor`, html.includes(`id="${service.slug}"`))
  const links = bookLinks.filter((link) => link.service === service.slug)
  check(`${service.slug} has one booking link`, links.length === 1, `${links.length}`)
  check(`${service.slug} books on ${service.url}`, links[0]?.href === service.url, links[0]?.href)
  check(`${service.slug} says "${service.cta}"`, links[0]?.label === service.cta, links[0]?.label)
}
for (const id of GROUP_IDS) check(`group #${id} exists`, html.includes(`id="${id}"`))
for (const id of LEGACY_ANCHORS) check(`legacy anchor #${id} still lands`, html.includes(`id="${id}"`))
const hero = bookLinks.find((link) => link.service === 'hero')
check('hero Book now opens the booking flow', hero?.href === 'https://kleaner.my/booknow' && hero?.label === 'Book now', hero?.href)

// 3. One label per intent: booking says "Book now" (Mover: "Get a quote").
const labels = [...new Set(bookLinks.map((link) => link.label))].sort()
check('booking labels are only Book now and Get a quote', labels.join('|') === 'Book now|Get a quote', labels.join('|'))
const offHost = bookLinks.filter((link) => !link.href.startsWith('https://kleaner.my/booknow'))
check('every booking link opens kleaner.my/booknow', offHost.length === 0, offHost.map((l) => l.href).join(', '))

// 4. The page quotes no prices and no proof beyond the two confirmed facts.
// Visible words only: markup and URLs carry %-encoding that is not a claim.
const main = text
  .slice(text.indexOf('<main'), text.indexOf('</main>'))
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
const ringgit = main.match(/RM\s?\d[\d,.]*/g) || []
check('quotes no prices', ringgit.length === 0, ringgit.join(', '))
check('shows the 100,000+ hours proof', main.includes('100,000+'))
check('shows the reclean or full refund guarantee', main.includes('Reclean or full refund'))
for (const banned of ['rating', 'review', '★', 'stars', '%']) {
  check(`main content claims no ${banned}`, !main.toLowerCase().includes(banned.toLowerCase()))
}

// 5. No em dash anywhere in the repo we author. The character is built from its
// code point so that this file does not fail its own check.
const EM_DASH = String.fromCharCode(0x2014)
const EN_DASH = String.fromCharCode(0x2013)
const SKIP = new Set(['node_modules', 'dist', '.git', '.astro', 'qa', '.vercel', 'preview'])
const offenders = []
const walk = (dir) => {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    if (!/\.(astro|ts|js|mjs|css|json|md|txt|html)$/.test(entry)) continue
    if (readFileSync(full, 'utf8').includes(EM_DASH)) offenders.push(full)
  }
}
walk('src')
walk('scripts')
walk('content')
for (const file of ['GO-LIVE.md', 'README.md', 'vercel.json']) {
  if (existsSync(file) && readFileSync(file, 'utf8').includes(EM_DASH)) offenders.push(file)
}
check('no em dash in authored source', offenders.length === 0, offenders.join(', '))
check('no em dash in rendered HTML', !html.includes(EM_DASH))
check('no en dash in rendered HTML', !html.includes(EN_DASH))

// 5b. House style lives in the copy files, so it is checked there rather than
// in rendered HTML, where an inline script would produce false positives.
const COPY_FILES = ['src/data/services.ts', ...readdirSync('src/data/copy').filter((n) => n.endsWith('.ts')).map((n) => join('src/data/copy', n))]
for (const file of COPY_FILES) {
  {
    // Comments first: an apostrophe in prose reads as the start of a string.
    const source = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/^\s*\/\/.*$/gm, ' ')
    const strings = [...source.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((match) => match[1])
    const shouty = strings.filter((value) => value.includes('!') || value.includes('！'))
    check(`${file} has no exclamation marks`, shouty.length === 0, shouty.slice(0, 2).join(' | '))
  }
}

// 6. The header menu replicates kleaner.my, with every standalone site in place.
const REQUIRED_MENU = [
  'https://kleaner.my/booknow/home_cleaning',
  `${HOST}/`,
  'https://kleaner.my/standard-cleaning',
  'https://kleaner.my/deep-cleaning',
  'https://kleaner.my/move-in-out',
  'https://postreno.kleaner.my/',
  'https://kleaner.my/office-cleaning',
  'https://kleaner.my/part-time-maid',
  'https://upholstery.kleaner.my/sofa-mattress-cleaning',
  'https://upholstery.kleaner.my/carpet-curtain-cleaning',
  'https://movers.kleaner.my',
  'https://kleaner.my/premium-clean',
  'https://kleaner.my/aircond-servicing',
  'https://kleaner.my/reviews',
  'https://kleaner.my/gift-card',
  'https://kleaner.my/faqs',
  'https://kleaner.my/contact-us',
  'https://kleaner.my/login',
  'tel:+60174770010',
]
const missingMenu = REQUIRED_MENU.filter((url) => !html.includes(`"${url}"`))
check('carries the full kleaner.my menu', missingMenu.length === 0, missingMenu.join(', '))
check(
  'does not link to the old post-renovation page',
  !html.includes('"https://kleaner.my/post-renovation-cleaning"')
)

const REQUIRED_FOOTER = [
  'https://kleaner.my/home',
  'https://kleaner.my/booknow/',
  'https://kleaner.my/privacy-policy',
  'https://kleaner.my/kleaners-anti-theft-policy',
  'https://kleaner.my/blog',
]
const missingFooter = REQUIRED_FOOTER.filter((url) => !html.includes(`"${url}"`))
check('carries the footer links', missingFooter.length === 0, missingFooter.join(', '))

// 7. WhatsApp and the tagline.
const wa = [...new Set(html.match(/https:\/\/wa\.me\/[^"]+/g) || [])]
check('has WhatsApp controls', wa.length > 0, `${wa.length} targets`)
check(
  'every WhatsApp link uses the chat line',
  wa.every((href) => href.startsWith('https://wa.me/60174770978?text=')),
  wa.join(' | ').slice(0, 120)
)
check(
  'every WhatsApp link carries a prefilled message',
  wa.every((href) => {
    try {
      return decodeURIComponent(href.split('?text=')[1] || '').length > 20
    } catch {
      return false
    }
  })
)
check('shows the current tagline', html.includes('The Benchmark of Cleaning Service'))

// 8. Structured data parses, covers what this page needs, and carries nothing
// the owner still has to confirm.
const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
let parsed = []
try {
  parsed = blocks.map((block) => JSON.parse(block[1]))
} catch (error) {
  check('JSON-LD parses', false, String(error))
}
const types = parsed.map((entry) => entry['@type'])
check('JSON-LD covers LocalBusiness, ItemList', ['LocalBusiness', 'ItemList'].every((t) => types.includes(t)), types.join(', '))
check('structured data is free of owner placeholders', !blocks.some((b) => b[1].includes('OWNER TO CONFIRM')))

const itemList = parsed.find((entry) => entry['@type'] === 'ItemList')
if (itemList) {
  check('ItemList covers every service', itemList.itemListElement.length === BRIEF_SERVICES.length, `${itemList.itemListElement.length}`)
  const schemaUrls = itemList.itemListElement.map((entry) => entry.url)
  check('ItemList URLs match the booking links, in order', schemaUrls.every((url, i) => url === BRIEF_SERVICES[i].url), schemaUrls.join(', '))
  check('ItemList points at this site', itemList.url === `${HOST}/`, itemList.url)
}

// 9. Every confirm note on the page is a real ConfirmNote, so the generator
// cannot miss one.
const marks = (html.match(/\[OWNER TO CONFIRM\]/g) || []).length
const notes = (html.match(/<p[^>]*\bdata-confirm\b/g) || []).length
check('every owner note is a ConfirmNote', marks === notes, `${marks} marks, ${notes} notes`)
// The owner confirmed every claim on 2 October 2026, so the public page
// carries no open note. A new unverified claim brings one back.
check('no open owner notes on the public page', marks === 0, `${marks}`)

// 10. Claims guardrails. These phrases are never allowed, whatever else changes.
const FORBIDDEN = [
  '100% removal',
  '100% remove',
  'completely removes',
  'permanently removes',
  'permanent removal',
  'medical grade',
  'medical-grade',
  'kills viruses',
  'kill viruses',
  'virus free',
  'guaranteed safe',
  'cures',
  'prevents illness',
]
const lower = text.toLowerCase()
const found = FORBIDDEN.filter((phrase) => lower.includes(phrase))
check('makes none of the forbidden claims', found.length === 0, found.join(', '))

// 11. Language, canonical, and no translation this site does not have.
const lang = (html.match(/<html lang="([^"]+)"/) || [])[1] || ''
check('declares its language', lang === 'en-MY', lang)
const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || ''
check('canonical points at this site root', canonical === `${HOST}/`, canonical)
check('claims no translation it does not have', !html.includes('rel="alternate"'))

// 12. SEO basics that are easy to break and invisible when broken.
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || ''
check('title is the agreed one', title === 'Cleaning Services in Klang Valley | Kleaner', title)
const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''
check('meta description is under 155 characters', description.length > 0 && description.length < 155, `${description.length}`)
const h1s = (html.match(/<h1\b/g) || []).length
check('exactly one H1', h1s === 1, `${h1s}`)
for (const service of BRIEF_SERVICES) {
  const escaped = service.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('&', '&amp;')
  check(`names ${service.slug} in a heading`, new RegExp(`<h3[^>]*>[^<]*${escaped}`).test(html))
}

// 13. Performance and platform contracts.
const preloads = [...html.matchAll(/<link rel="preload"[^>]*as="image"[^>]*>/g)]
check('preloads exactly one image, the hero', preloads.length === 1 && /hero-photo/.test(preloads[0]?.[0] || ''), `${preloads.length}`)
const imgs = html.match(/<img\b[^>]*>/g) || []
check('every image has alt text', imgs.every((tag) => /\salt(="|[\s>])/.test(tag)), `${imgs.length} images`)
check('every image reserves its size', imgs.every((tag) => /\swidth="\d+"/.test(tag) && /\sheight="\d+"/.test(tag)))
const eagerPhotos = imgs.filter((tag) => /loading="eager"/.test(tag) && !/kleaner-logo/.test(tag))
check('only the hero photo loads eagerly', eagerPhotos.length === 1, `${eagerPhotos.length}`)
check('drops the mobile sticky bar', !/<body[^>]*class="[^"]*has-sticky-cta/.test(html))

const viewport = (html.match(/<meta name="viewport" content="([^"]*)"/) || [])[1] || ''
check('viewport opts into the safe area it relies on', !html.includes('safe-area-inset') || viewport.includes('viewport-fit=cover'), viewport)
check('viewport never blocks zoom', !/user-scalable=no|maximum-scale=1\b/.test(viewport))

// 14. Anchors and assets.
const anchors = html.match(/<a\b[^>]*>/g) || []
const broken = anchors.filter((tag) => {
  const href = tag.match(/\shref="([^"]*)"/)
  if (!href) return true
  const value = href[1].trim()
  return value === '' || value === '#' || value.startsWith('javascript:')
})
check('no anchor missing an href', broken.length === 0, broken.slice(0, 2).join(' '))

const assets = new Set()
for (const match of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:jpg|png|svg|woff2|xml|txt|css|js))"/g)) {
  assets.add(match[1])
}
const missingAssets = [...assets].filter((asset) => !existsSync(join(DIST, asset)))
check('every local asset exists in dist', missingAssets.length === 0, missingAssets.join(', '))

const htmlLinks = [...new Set([...html.matchAll(/href="([^"]*\.html)"/g)].map((m) => m[1]))]
check('no .html links in the markup', htmlLinks.length === 0, htmlLinks.join(', '))

const failed = results.filter((result) => !result.pass)
console.log(`\n${results.length - failed.length}/${results.length} content checks passed`)
if (failed.length) {
  console.log('failed:', failed.map((f) => f.name).join('; '))
  process.exitCode = 1
}
