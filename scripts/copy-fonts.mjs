// Copies the font subsets we use out of @fontsource so the site self-hosts them.
// Run again after changing weights. All three families are SIL Open Font License.
//   Lato: body copy, the brand's existing text face.
//   Anton: the counter-board display face (headline, tile numerals and names).
//   Oswald: condensed labels (price tags, the order bar, small caps lines).
import { copyFileSync, mkdirSync } from 'node:fs'

const OUT = 'public/fonts'
mkdirSync(OUT, { recursive: true })

const FILES = [
  ['lato', 'lato-latin-400-normal.woff2'],
  ['lato', 'lato-latin-700-normal.woff2'],
  ['lato', 'lato-latin-900-normal.woff2'],
  ['anton', 'anton-latin-400-normal.woff2'],
  ['oswald', 'oswald-latin-500-normal.woff2'],
  ['oswald', 'oswald-latin-600-normal.woff2'],
  ['oswald', 'oswald-latin-700-normal.woff2'],
]

for (const [family, file] of FILES) {
  copyFileSync(`node_modules/@fontsource/${family}/files/${file}`, `${OUT}/${file}`)
  console.log('copied', file)
}
