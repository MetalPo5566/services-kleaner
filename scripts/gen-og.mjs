// Renders the 1200x630 share card in the counter board world: the headline in
// Anton, six numbered tiles, the brand blue logo. Chromium draws it with the
// same self hosted fonts the page uses, so the card matches the page.
import { mkdirSync, readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const OUT = 'public/og'
mkdirSync(OUT, { recursive: true })

const b64 = (path) => readFileSync(path).toString('base64')
const face = (family, weight, file) =>
  `@font-face{font-family:${family};font-weight:${weight};src:url(data:font/woff2;base64,${b64(`public/fonts/${file}`)}) format('woff2')}`

const FONT_FACES = [
  face('Anton', 400, 'anton-latin-400-normal.woff2'),
  face('Oswald', 600, 'oswald-latin-600-normal.woff2'),
].join('')

const logo = b64('public/images/kleaner-logo.png')

const TILES = [
  ['01', 'General Cleaning'],
  ['02', 'Sofa & Mattress'],
  ['03', 'Post-Reno'],
  ['04', 'Formaldehyde'],
  ['05', 'Movers'],
  ['06', 'Kleaner Club'],
]

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${FONT_FACES}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#fff;font-family:Anton;color:#0b2747;padding:56px 64px;position:relative;overflow:hidden}
.logo{height:62px;display:block}
h1{font-size:132px;line-height:1;text-transform:uppercase;margin-top:30px;letter-spacing:.005em}
p{font-family:Oswald;font-weight:600;font-size:36px;margin-top:6px}
.wall{position:absolute;left:64px;right:64px;bottom:44px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.t{background:#0088f8;border-radius:8px;padding:6px;height:150px}
.t.on{background:#fac93f;color:#0b2747}
.f{border:2px solid #fff;border-radius:5px;height:100%;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-between;color:#fff}
.t.on .f{color:#0b2747}
.n{font-size:56px;line-height:1}
.m{font-size:20px;line-height:1;text-transform:uppercase}
</style></head><body>
<img class="logo" src="data:image/png;base64,${logo}">
<h1>Order your clean.</h1>
<p>Every Kleaner service. Tap one to book. KL &amp; Selangor.</p>
<div class="wall">${TILES.map(([n, name], i) => `<div class="t${i === 2 ? ' on' : ''}"><div class="f"><span class="n">${n}</span><span class="m">${name}</span></div></div>`).join('')}</div>
</body></html>`

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: `${OUT}/index.jpg`, type: 'jpeg', quality: 88 })
await browser.close()
console.log('wrote index.jpg')
