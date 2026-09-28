// Builds the web assets from the owner's logo file at assets/kleaner-logo.png.
// The supplied artwork is the full lockup: the wordmark with the current
// tagline underneath, flanked by its ornaments. It is used whole.
//
// Re-run with `npm run logo` if the owner ever supplies a new logo file.
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'assets/kleaner-logo.png'
const OUT = 'public/images'
mkdirSync(OUT, { recursive: true })

// Roughly three times the largest on-page display size (171px wide in the
// footer), which stays crisp on any screen. The share card generator reads the
// full resolution original from assets/ instead of using these.
const WIDTH = 480

// Flat artwork with soft edges, so a 16 entry palette is indistinguishable from
// a full one at 4x magnification and less than half the bytes. WebP was tried
// and is larger than palette PNG for this image, lossless or lossy.
const PNG = { compressionLevel: 9, palette: true, colours: 16, effort: 10 }

// Render once, then take every dimension from the rendered buffer. Reading
// them from the source file instead would use the untrimmed size and give the
// white version the wrong aspect ratio.
const rendered = await sharp(SRC)
  .trim({ threshold: 1 })
  .resize({ width: WIDTH })
  .png()
  .toBuffer({ resolveWithObject: true })

const { width, height } = rendered.info
console.log(`rendering at ${width}x${height}`)

// Brand colour version, for white and light backgrounds.
await sharp(rendered.data).png(PNG).toFile(`${OUT}/kleaner-logo.png`)
console.log('wrote kleaner-logo.png')

// White version for the navy footer. The artwork's own alpha channel becomes
// the mask, so the shape is identical and only the ink colour changes.
const alpha = await sharp(rendered.data).extractChannel('alpha').toBuffer()

await sharp({
  create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
})
  .joinChannel(alpha)
  .png(PNG)
  .toFile(`${OUT}/kleaner-logo-white.png`)
console.log('wrote kleaner-logo-white.png')

// The intrinsic size is written into src/components/Logo.astro, so surface it
// here. Update the component if these numbers ever change.
console.log(`intrinsic size ${width}x${height}, aspect ${(width / height).toFixed(4)}`)
