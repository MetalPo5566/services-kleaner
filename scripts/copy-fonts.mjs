// Copies the Lato subsets we use out of @fontsource so the site self-hosts them.
// Run again after changing weights. Source: @fontsource/lato (SIL Open Font License).
import { copyFileSync, mkdirSync } from 'node:fs'

const SRC = 'node_modules/@fontsource/lato/files'
const OUT = 'public/fonts'
mkdirSync(OUT, { recursive: true })

for (const weight of [400, 700, 900]) {
  const file = `lato-latin-${weight}-normal.woff2`
  copyFileSync(`${SRC}/${file}`, `${OUT}/${file}`)
  console.log('copied', file)
}
