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

// 5. Every service books in one tap, at desktop width, and reports its slug.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  const links = await page.$$eval('[data-cta="book"]', (all) =>
    all.map((a) => ({ service: a.getAttribute('data-service'), href: a.getAttribute('href'), target: a.getAttribute('target') }))
  )
  const services = links.filter((link) => link.service !== 'hero')
  record('every service has its own booking link', services.length === SERVICE_COUNT, `${services.length}`)
  record('every booking link opens kleaner.my/booknow', links.every((l) => l.href.startsWith('https://kleaner.my/booknow')))
  record('booking links open in the same tab', links.every((l) => !l.target))
  record('home cleaning is three columns at 1440', (await page.evaluate(() => {
    const tops = [...document.querySelectorAll('#home-cleaning li')].map((li) => Math.round(li.getBoundingClientRect().top))
    return tops.filter((t) => t === tops[0]).length
  })) === 3)

  await page.evaluate(blockNavigation)
  await page.locator('[data-service="aircond-maintenance"]').click()
  const fired = await page.evaluate(() => (window.dataLayer || []).filter((e) => e.event === 'cta_book').pop())
  record('a booking tap reports its own slug', fired?.service === 'aircond-maintenance', JSON.stringify(fired))
  record('the event reports the page', fired?.page === '/', JSON.stringify(fired?.page))
  await context.close()
}

// 6. On a phone: the hero fits, the pills stick and follow the scroll, and a
// deep link lands its service below the sticky chrome.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await settle(page)

  const fold = await page.evaluate(() => {
    const book = document.querySelector('[data-service="hero"]').getBoundingClientRect()
    const h1 = document.querySelector('h1')
    const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight))
    return { bookBottom: book.bottom, lines }
  })
  record('hero Book now is above the fold at 390', fold.bookBottom < 844, JSON.stringify(fold))
  record('hero headline holds two lines at 390', fold.lines <= 2, JSON.stringify(fold))
  record('no horizontal page scroll at 390', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 390)

  await page.evaluate(() => document.querySelector('#specialist-care').scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(300)
  const pill = await page.evaluate(() => {
    const bar = document.querySelector('[data-pill-bar]').getBoundingClientRect()
    const current = document.querySelector('[data-pill][aria-current="true"]')
    return { top: Math.round(bar.top), current: current?.dataset.pill }
  })
  record('pill strip sticks under the header', pill.top === 59, JSON.stringify(pill))
  record('pill strip lights the group in view', pill.current === 'specialist-care', JSON.stringify(pill))
  await context.close()

  const deep = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const deepPage = await deep.newPage()
  await deepPage.goto(`${BASE}/#formaldehyde-removal`, { waitUntil: 'networkidle' })
  await deepPage.waitForTimeout(400)
  const landed = await deepPage.evaluate(() => {
    const r = document.querySelector('#formaldehyde-removal').getBoundingClientRect()
    return { top: Math.round(r.top) }
  })
  record('#formaldehyde-removal lands below the sticky chrome', landed.top >= 110 && landed.top < 200, JSON.stringify(landed))
  await deep.close()
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
    Boolean(whatsapp) && whatsapp.page === '/' && whatsapp.service === 'hero',
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
  record('every service is still reachable under reduced motion', (await page.locator('[data-cta="book"]').count()) === SERVICE_COUNT + 1)
  await context.close()
}

// 9. With JavaScript off the page still has to do its job.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'load' })

  record('every booking link is there without JavaScript', (await page.locator('[data-cta="book"]').count()) === SERVICE_COUNT + 1)
  record('the group pills are plain links without JavaScript', (await page.locator('[data-pill]').first().getAttribute('href')) === '#home-cleaning')
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
