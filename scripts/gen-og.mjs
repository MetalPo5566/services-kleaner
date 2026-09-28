// Renders the 1200x630 share cards. Chromium draws them with the same self
// hosted Lato the site uses, so the cards match the pages exactly.
import { mkdirSync, readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import sharp from 'sharp'

const OUT = 'public/og'
mkdirSync(OUT, { recursive: true })

const font = (weight) =>
  readFileSync(`public/fonts/lato-latin-${weight}-normal.woff2`).toString('base64')

const FONT_FACES = [400, 700, 900]
  .map(
    (weight) => `@font-face{font-family:Lato;font-style:normal;font-weight:${weight};
      src:url(data:font/woff2;base64,${font(weight)}) format('woff2')}`
  )
  .join('')

// The owner's logo, masked to white for the blue card background. Rendered at
// twice its on-card size so it stays sharp.
const LOGO_WIDTH = 760
const logoSource = await sharp('assets/kleaner-logo.png')
  .trim({ threshold: 1 })
  .resize({ width: LOGO_WIDTH })
  .png()
  .toBuffer({ resolveWithObject: true })

const logoWhite = await sharp({
  create: {
    width: logoSource.info.width,
    height: logoSource.info.height,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .joinChannel(await sharp(logoSource.data).extractChannel('alpha').toBuffer())
  .png()
  .toBuffer()

const LOGO_DATA_URI = `data:image/png;base64,${logoWhite.toString('base64')}`

const CARDS = [
  {
    file: 'index.jpg',
    title: 'Every Kleaner service,<br>one tap to book',
    place: 'in KL &amp; Selangor',
    chips: ['Cleaning, upholstery, post-reno, movers'],
  },
]

const template = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${FONT_FACES}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:Lato,Arial,sans-serif;
  background:radial-gradient(120% 130% at 12% 0%,#0096FF 0%,#0071D1 55%,#0A4E93 100%);
  color:#fff;padding:74px 80px;display:flex;flex-direction:column;justify-content:space-between;
  position:relative;overflow:hidden}
.glow{position:absolute;width:760px;height:760px;right:-230px;bottom:-330px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 66%)}
.brand{position:relative}
.brand img{display:block;width:380px;height:auto}
.body{position:relative}
h1{font-weight:900;font-size:74px;line-height:1.04;letter-spacing:-1.5px;max-width:1010px}
h1 .place{display:block;font-weight:700;font-size:50px;color:#CCE7FE;letter-spacing:-.5px;
  margin-top:10px}
.chips{position:relative;display:flex;gap:16px;flex-wrap:wrap}
.chip{background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.34);
  border-radius:999px;padding:15px 30px;font-weight:700;font-size:28px}
.rule{position:absolute;left:0;right:0;bottom:0;height:12px;background:#00CD56}
</style></head><body>
<div class="glow"></div>
<div class="brand"><img src="${LOGO_DATA_URI}" alt="Kleaner. The Benchmark of Cleaning Service."></div>
<div class="body"><h1>${card.title}<span class="place">${card.place}</span></h1></div>
<div class="chips">${card.chips.map((chip) => `<div class="chip">${chip}</div>`).join('')}</div>
<div class="rule"></div>
</body></html>`

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })

for (const card of CARDS) {
  await page.setContent(template(card), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png' })
  const sharp = (await import('sharp')).default
  await sharp(png).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile(`${OUT}/${card.file}`)
  console.log('wrote', card.file)
}

await browser.close()
