// Builds the favicon and the touch icon. There is no placeholder artwork here
// because the services page uses no photography.
import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const OUT = 'public/images'
mkdirSync(OUT, { recursive: true })

const W = 1040
const H = 780

// Drawn to the same 24x24 grid as src/components/Icon.astro.
const ICONS = {
  sofa: '<path d="M4.6 13.2V8.1A3.1 3.1 0 0 1 7.7 5h8.6a3.1 3.1 0 0 1 3.1 3.1v5.1"/><path d="M2 15.1a2.3 2.3 0 0 1 4.6 0v1.7h10.8v-1.7a2.3 2.3 0 0 1 4.6 0v4.6H2Z"/><path d="M5.2 19.7v1.4M18.8 19.7v1.4"/>',
  mattress: '<rect x="2.5" y="6.5" width="19" height="11" rx="3.5"/><path d="M7 10.5v3M12 10.5v3M17 10.5v3"/>',
  carpet: '<rect x="3" y="5.5" width="18" height="12.5" rx="1.8"/><rect x="6.5" y="9" width="11" height="5.5" rx="1"/><path d="M6 18v2M10 18v2M14 18v2M18 18v2"/>',
  curtain: '<path d="M3 4h18"/><path d="M6.5 4v16c2.6 0 4.2-2.6 4.2-8S9.1 4 6.5 4Z"/><path d="M17.5 4v16c-2.6 0-4.2-2.6-4.2-8s1.6-8 4.2-8Z"/>',
  droplet: '<path d="M12 3.2c0 0 6.2 6.6 6.2 10.3a6.2 6.2 0 0 1-12.4 0C5.8 9.8 12 3.2 12 3.2Z"/>',
  sparkle: '<path d="M12 3.2 13.8 9l5.8 1.8-5.8 1.8L12 18.4l-1.8-5.8L4.4 10.8 10.2 9 12 3.2Z"/>',
  home: '<path d="m3.2 10.6 8.8-7.2 8.8 7.2"/><path d="M6 9.6V20.5h12V9.6"/><path d="M10.2 20.5v-5.2h3.6v5.2"/>',
  vacuum: '<path d="M7 20.5h10a2 2 0 0 0 2-2v-3a7 7 0 0 0-14 0v3a2 2 0 0 0 2 2Z"/><path d="M12 8.5v-4a2 2 0 0 1 2-2h5"/><circle cx="12" cy="16" r="2.2"/>',
  wind: '<path d="M3 8h9.5a3 3 0 1 0-3-3"/><path d="M3 12.5h12.5a3 3 0 1 1-3 3"/><path d="M3 17h7"/>',
  handshake: '<path d="M3.5 9.5 7 6h4l2 1.8L11 9.6a1.6 1.6 0 0 0 0 2.3l3.6 3.4"/><path d="M13 6h4l3.5 3.5"/><path d="M20.5 9.5v5l-2.5 2.5-3-2.8"/><path d="M3.5 9.5v5L6 17l3-2.8"/>',
}

const TONES = {
  fresh: { from: '#DFF0FF', to: '#FBFDFF', blob: '#BEDFFB', ink: '#0088F8', inkOpacity: 0.9 },
  soiled: { from: '#E4E9EF', to: '#F5F7FA', blob: '#CDD6E0', ink: '#6E8097', inkOpacity: 0.85 },
  deep: { from: '#CDE8FF', to: '#EDF7FF', blob: '#A9D4F9', ink: '#0071D1', inkOpacity: 0.92 },
}

/** Places an icon from the 24x24 grid at an arbitrary size and position. */
function placeIcon(name, x, y, size, colour, opacity, strokePx = 2.5) {
  const scale = size / 24
  const stroke = strokePx / scale
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${colour}"
    stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
    ${ICONS[name]}</g>`
}

function placeSolid(name, x, y, size, colour, opacity) {
  const scale = size / 24
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${colour}" opacity="${opacity}">${ICONS[name]}</g>`
}

function artwork({ icon, tone, accent }) {
  const t = TONES[tone]
  const main = 360
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.55" y2="1">
        <stop offset="0%" stop-color="${t.from}"/>
        <stop offset="100%" stop-color="${t.to}"/>
      </linearGradient>
      <radialGradient id="blob" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="${t.blob}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${t.blob}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <ellipse cx="${W * 0.22}" cy="${H * 0.2}" rx="${W * 0.36}" ry="${H * 0.34}" fill="url(#blob)"/>
    <ellipse cx="${W * 0.84}" cy="${H * 0.82}" rx="${W * 0.34}" ry="${H * 0.36}" fill="url(#blob)"/>
    <rect x="${(W - main * 1.55) / 2}" y="${(H - main * 1.35) / 2}" width="${main * 1.55}"
      height="${main * 1.35}" rx="44" fill="#FFFFFF" opacity="0.5"/>
    ${placeIcon(icon, (W - main) / 2, (H - main) / 2 - 6, main, t.ink, t.inkOpacity, 6.5)}
    ${placeSolid(accent, W * 0.82, H * 0.14, 72, t.ink, t.inkOpacity * 0.45)}
    ${placeIcon('droplet', W * 0.1, H * 0.74, 64, t.ink, t.inkOpacity * 0.5, 2.6)}
    ${placeSolid(accent, W * 0.11, H * 0.15, 44, t.ink, t.inkOpacity * 0.35)}
  </svg>`
}

// This site carries no photography at all: every icon on the page is inline
// SVG from src/components/Icon.astro. Nothing to generate, nothing to lazy
// load, and no layout shift from an image that has not arrived yet.
const JOBS = []

for (const job of JOBS) {
  const svg = artwork(job)
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${OUT}/${job.file}`)
  console.log('wrote', job.file)
}

// Favicon: the K mark on a brand blue rounded square.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#0088F8"/>
  <path d="M11 7.5v17M12 16l8.5-8.5M12 16l9 8.5" fill="none" stroke="#fff" stroke-width="3.6"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
writeFileSync('public/favicon.svg', favicon)
console.log('wrote favicon.svg')

await sharp(Buffer.from(favicon.replace('width="32" height="32"', 'width="180" height="180"')))
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png')
console.log('wrote apple-touch-icon.png')
