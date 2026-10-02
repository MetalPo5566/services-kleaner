// Copies the font subsets we use out of @fontsource so the site self-hosts them.
// Run again after changing weights. Reddit Sans is SIL Open Font License, the
// one family on the page: 800 for display, 700 for names and buttons, 500 and
// 400 for labels and body.
import { copyFileSync, mkdirSync } from 'node:fs'

const OUT = 'public/fonts'
mkdirSync(OUT, { recursive: true })

const FILES = [
  ['reddit-sans', 'reddit-sans-latin-400-normal.woff2'],
  ['reddit-sans', 'reddit-sans-latin-500-normal.woff2'],
  ['reddit-sans', 'reddit-sans-latin-700-normal.woff2'],
  ['reddit-sans', 'reddit-sans-latin-800-normal.woff2'],
]

for (const [family, file] of FILES) {
  copyFileSync(`node_modules/@fontsource/${family}/files/${file}`, `${OUT}/${file}`)
  console.log('copied', file)
}
