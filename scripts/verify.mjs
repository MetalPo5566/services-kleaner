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
const BRIEF_SERVICES = [
  { slug: 'general-cleaning', name: 'General Cleaning (Hourly Maid)' },
  { slug: 'sofa-mattress', name: 'Sofa & Mattress Deep Cleaning' },
  { slug: 'post-renovation', name: 'Post-Renovation Cleaning' },
  { slug: 'formaldehyde-removal', name: 'Formaldehyde Removal & Air Sterilisation' },
  { slug: 'movers', name: 'Movers' },
  { slug: 'kleaner-club', name: 'Kleaner Club' },
]

// The site's own money formatting, restated rather than imported, so the check
// does not pass just because the helper and the page share a bug.
const money = (value) => `RM${Number.isInteger(value) ? value : value.toFixed(2)}`

const prices = JSON.parse(readFileSync('src/data/prices.json', 'utf8'))
const RATE = prices.groups.postreno.items[0].price

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

// 2. Every service reaches the page, as a card, with its own analytics tag.
for (const service of BRIEF_SERVICES) {
  check(`renders the ${service.slug} card`, text.includes(service.name))
  check(`tags ${service.slug} for analytics`, html.includes(`data-service="${service.slug}"`))
}
const cardCount = (html.match(/data-service-card/g) || []).length
check('one card per service', cardCount === BRIEF_SERVICES.length, `${cardCount}`)

// 3. No card may point at nothing, and none may leave the known hosts.
const ALLOWED_BOOKING_HOSTS = ['https://kleaner.my/', 'https://movers.kleaner.my']
const cardHrefs = [...html.matchAll(/<a\b[^>]*data-service-card[^>]*>/g)].map(
  (tag) => (tag[0].match(/href="([^"]*)"/) || [])[1] || ''
)
check(
  'every card has an href',
  cardHrefs.length === BRIEF_SERVICES.length && cardHrefs.every(Boolean),
  `${cardHrefs.length} cards`
)
const offHost = cardHrefs.filter((href) => !ALLOWED_BOOKING_HOSTS.some((h) => href.startsWith(h)))
check('every card books on a known Kleaner host', offHost.length === 0, offHost.join(', '))

// 4. The prices the cards quote come from prices.json, and the sofa figure is
// the booking form one rather than the RM80 the brief gave.
const sofaFrom = Math.min(...prices.groups.sofa.items.map((item) => item.price))
check(`quotes sofa from ${money(sofaFrom)}`, text.includes(`from ${money(sofaFrom)}`))
check('does not quote the RM80 carpet price for sofas', !text.includes('from RM80'))
check(`quotes the post-renovation rate ${money(RATE)}`, text.includes(money(RATE)))
for (const item of prices.groups.treatment.items) {
  check(`quotes ${item.name} ${money(item.price)}`, text.includes(money(item.price)))
}

// 4b. RM carries no decimals anywhere, with one deliberate exception: the per
// sqft rate, which is meaningless without them.
const decimals = [...new Set(text.match(/RM\d[\d,]*\.\d+/g) || [])].filter((f) => f !== money(RATE))
check('writes RM without decimals, except the rate', decimals.length === 0, decimals.join(', '))

// 5. No em dash anywhere in the repo we author. The character is built from its
// code point so that this file does not fail its own check.
const EM_DASH = String.fromCharCode(0x2014)
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
  check('ItemList URLs match the card links', schemaUrls.every((url) => cardHrefs.includes(url)), schemaUrls.join(', '))
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
  check(`names ${service.slug} in an H2`, new RegExp(`<h2[^>]*>[^<]*${escaped}`).test(html))
}

// 13. Performance and platform contracts.
const preloads = [...html.matchAll(/<link rel="preload"[^>]*as="image"[^>]*>/g)]
check('preloads no image, because the page has none', preloads.length === 0, `${preloads.length}`)
check('renders no raster image', !/<img\b[^>]*src="\/images\/(?!kleaner-logo)/.test(html))
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
