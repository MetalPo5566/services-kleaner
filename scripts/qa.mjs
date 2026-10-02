// Screenshots at the four target widths, plus the interaction checks that are
// easy to get wrong: the header dropdown on touch and keyboard, the service
// grid, and the page still working with JavaScript off.
import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.QA_BASE || 'http://127.0.0.1:4321'
const OUT = 'qa'
mkdirSync(OUT, { recursive: true })

const SERVICE_COUNT = 9

// 1280 is in here because it is the width the brief asks to see.
const WIDTHS = [390, 768, 1280, 1440]
const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

/** Stops a link navigating while still letting the click reach the delegated
    handler under test. Scoped to anchors: a blanket preventDefault would also
    stop a radio or a checkbox from doing its job. */
const blockNavigation = () => {
  document.addEventListener(
    'click',
    (event) => {
      if (event.target instanceof Element && event.target.closest('a')) event.preventDefault()
    },
    true
  )
}

/** Drops the scroll reveal so nothing is mid transition when Playwright clicks,
    and turns off smooth scrolling so scroll-into-view lands immediately. */
const settle = async (page) => {
  await page.evaluate(() => {
    document.documentElement.classList.remove('reveal-ready')
    document.documentElement.style.scrollBehavior = 'auto'
  })
}

/** How many cards share the top of the first row, which is the column count. */
const columnCount = () => {
  const tops = [...document.querySelectorAll('[data-service-card]')].map((card) =>
    Math.round(card.getBoundingClientRect().top)
  )
  return tops.filter((top) => top === tops[0]).length
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

// 1. Screenshots.
for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 900 },
    deviceScaleFactor: 1,
    hasTouch: width < 500,
    isMobile: width < 500,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await settle(page)
  // Walk down the page so the lazy loaded images below the fold, the footer
  // logo among them, decode before the full page capture.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForFunction(() =>
    [...document.querySelectorAll('img')].every((img) => img.complete && img.naturalWidth > 0)
  )
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${OUT}/services-${width}.jpg`, fullPage: true, type: 'jpeg', quality: 82 })
  await context.close()
  console.log(`screenshot done at ${width}px`)
}

// 2. Cumulative layout shift on load, mobile.
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  const cls = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let total = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) total += entry.value
          }
        }).observe({ type: 'layout-shift', buffered: true })
        setTimeout(() => resolve(total), 2500)
      })
  )
  record('no layout shift on load', cls === 0, `cls=${cls.toFixed(4)}`)
  await context.close()
}

// 3. Header dropdown, mouse and keyboard, at desktop width.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  const trigger = page.locator('[data-dropdown-trigger]')
  const panel = page.locator('[data-dropdown-panel]')

  await trigger.click()
  record('dropdown opens on click', await panel.isVisible())
  record('dropdown sets aria-expanded', (await trigger.getAttribute('aria-expanded')) === 'true')

  await page.keyboard.press('Escape')
  record('dropdown closes on Escape', !(await panel.isVisible()))

  await trigger.focus()
  await page.keyboard.press('Enter')
  record('dropdown opens from the keyboard', await panel.isVisible())

  const links = await panel.locator('a').evaluateAll((all) => all.map((a) => a.getAttribute('href')))
  record(
    'dropdown routes each service to its own site',
    links.includes('https://services.kleaner.my/') &&
      links.includes('https://postreno.kleaner.my/') &&
      links.includes('https://upholstery.kleaner.my/sofa-mattress-cleaning'),
    `${links.length} links`
  )
  await context.close()
}

// 4. Touch: hamburger and the inline services group.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  await page.locator('[data-menu-trigger]').tap()
  record('mobile menu opens on tap', await page.locator('[data-menu-panel]').isVisible())
  await page.locator('[data-sub-trigger]').tap()
  record('services expand inline on tap', await page.locator('[data-sub-panel]').isVisible())
  await page.locator('[data-menu-trigger]').tap()
  record('mobile menu closes on tap', !(await page.locator('[data-menu-panel]').isVisible()))
  await context.close()
}

// 5. The service grid at desktop width. This page has one job, so the checks
// are about the card being a single tap that lands somewhere real.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  const cards = await page.evaluate(() =>
    [...document.querySelectorAll('[data-service-card]')].map((card) => ({
      slug: card.getAttribute('data-service'),
      href: card.getAttribute('href'),
      cta: card.getAttribute('data-cta'),
      target: card.getAttribute('target'),
      // An interactive element inside an anchor is invalid and breaks the
      // keyboard order, so the Book now control must be a plain span.
      nested: card.querySelectorAll('a, button, input, select, textarea').length,
      headings: card.querySelectorAll('h2').length,
    }))
  )

  record('every service is on the page as a card', cards.length === SERVICE_COUNT, `${cards.length} cards`)
  record('every card has a slug and an href', cards.every((card) => card.slug && card.href))
  // Tiles select first and book on the second tap, so they report their own
  // cta_book event from the board script rather than through data-cta.
  record('no tile reports a booking on its selecting tap', cards.every((card) => card.cta === null))
  record(
    'every card links to a known Kleaner host',
    cards.every(
      (card) => card.href.startsWith('https://kleaner.my/booknow/')
    ),
    cards.map((card) => card.href).join(' | ')
  )
  record('no card nests an interactive element inside the link', cards.every((card) => card.nested === 0))
  const slipHeadings = await page.$$eval('[data-detail] h2', (els) => els.length)
  record('every service is named in an H2 in the order slip', slipHeadings === SERVICE_COUNT, `${slipHeadings}`)
  record('cards open in the same tab', cards.every((card) => !card.target))

  record('grid is 3 columns at 1280', (await page.evaluate(columnCount)) === 3)
  record('the board quotes no prices', !/RM\d/.test(await page.locator('.board').innerText()))

  // Each card fires its own slug, which is what the brief asked for.
  await page.evaluate(blockNavigation)
  await page.locator('[data-service-card]').nth(3).click()
  const afterSelect = await page.evaluate(() => (window.dataLayer || []).filter((e) => e.event === 'cta_book').length)
  record('the first tap selects without reporting a booking', afterSelect === 0, `${afterSelect}`)
  record(
    'the order bar books the selected service',
    (await page.getAttribute('[data-order-book]', 'href')) === cards[3].href
  )
  await page.locator('[data-service-card]').nth(3).click()
  const events = await page.evaluate(() => window.dataLayer || [])
  const fired = events.filter((entry) => entry.event === 'cta_book').pop()
  record('a card click reports its own slug', fired?.service === cards[3].slug, JSON.stringify(fired))
  record('the event reports the page', fired?.page === '/', JSON.stringify(fired?.page))
  await context.close()
}

// 6. The same grid on a phone, and the one floating control.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  record('grid is 2 columns at 390', (await page.evaluate(columnCount)) === 2)

  // The order bar replaces the floating WhatsApp button on this page.
  record('order bar is visible on a phone', await page.locator('[data-order-bar]').isVisible())
  const placed = await page.evaluate(() => {
    const el = document.querySelector('[data-order-bar]')
    if (!el) return null
    const box = el.getBoundingClientRect()
    return { left: box.left, bottom: window.innerHeight - box.bottom, width: box.width }
  })
  record(
    'order bar spans the bottom edge',
    Boolean(placed) && placed.left === 0 && placed.bottom === 0 && placed.width === 390,
    JSON.stringify(placed)
  )
  record('WhatsApp is still on the page', (await page.locator('a[data-cta="whatsapp"]').count()) > 0)

  const gap = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom))
  record('no dead space where a sticky bar would be', gap < 8, `${gap}px`)

  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))
  record('no sticky bar anchor on the page', !hrefs.includes('#quote'))
  record('the voucher CTA reaches the booking form', hrefs.includes('https://kleaner.my/booknow/'))
  await context.close()
}

// 7. dataLayer events fire on the WhatsApp controls too.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)
  await page.evaluate(blockNavigation)

  await page.locator('[data-cta="whatsapp"]').first().click()
  const events = await page.evaluate(() => window.dataLayer || [])
  const whatsapp = events.find((entry) => entry.event === 'cta_whatsapp')
  record(
    'pushes cta_whatsapp with page and service',
    Boolean(whatsapp) && whatsapp.page === '/' && whatsapp.service === 'services-hub',
    JSON.stringify(whatsapp)
  )
  await context.close()
}

// 8. Reduced motion must still show the page. The reveal hides elements until
// the observer marks them visible, so a mistake here blanks the whole site for
// anyone who has the preference on.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)

  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (element) => Number(getComputedStyle(element).opacity) < 0.9
      ).length
  )
  record('reduced motion leaves nothing hidden', hidden === 0, `${hidden} hidden`)

  const moved = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter((element) => {
        const transform = getComputedStyle(element).transform
        return transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)'
      }).length
  )
  record('reduced motion drops the travel', moved === 0, `${moved} transformed`)
  record('every card is still reachable under reduced motion', (await page.locator('[data-service-card]').count()) === SERVICE_COUNT)
  await context.close()
}

// 9. With JavaScript off the page still has to do its job.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'load' })

  record('every card is there without JavaScript', (await page.locator('[data-service-card]').count()) === SERVICE_COUNT)
  record('the first card is still a link', Boolean(await page.locator('[data-service-card]').first().getAttribute('href')))
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (element) => Number(getComputedStyle(element).opacity) < 0.9
      ).length
  )
  record('nothing is hidden without JavaScript', hidden === 0, `${hidden} hidden`)
  await context.close()
}

await browser.close()

const failed = results.filter((result) => !result.pass)
writeFileSync(`${OUT}/interaction-report.json`, JSON.stringify({ results }, null, 2))
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length) {
  console.log('failed:', failed.map((f) => f.name).join(', '))
  process.exitCode = 1
}
