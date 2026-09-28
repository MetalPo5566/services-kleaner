// Packages the built site as a self contained preview bundle whose links and
// assets are all relative, so it can be served from any flat directory.
import { cpSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'

const SRC = 'dist'
const OUT = 'preview'

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

for (const dir of ['images', 'fonts']) {
  cpSync(`${SRC}/${dir}`, `${OUT}/${dir}`, { recursive: true })
}
cpSync(`${SRC}/_astro`, `${OUT}/js`, { recursive: true })
for (const file of ['favicon.svg', 'apple-touch-icon.png']) {
  cpSync(`${SRC}/${file}`, `${OUT}/${file}`)
}

// The viewer, with width switching.
cpSync('scripts/preview-harness.html', `${OUT}/harness.html`)

const PAGES = ['index']

for (const page of PAGES) {
  let html = readFileSync(`${SRC}/${page}.html`, 'utf8')

  // Internal page links have no extension on the real host, which relies on
  // clean URL rewriting. A flat directory has none, so point at the files.
  html = html.replace(/href="\/"/g, 'href="index.html"')

  // Root relative assets become relative to the page.
  html = html.replace(/(src|href)="\/(?!\/)/g, '$1="')
  html = html.replace(/url\(\/fonts\//g, 'url(fonts/')
  html = html.replace(/src="_astro\//g, 'src="js/')

  writeFileSync(`${OUT}/${page}.html`, html)
}

console.log('preview bundle written to', OUT)
for (const page of PAGES) {
  const html = readFileSync(`${OUT}/${page}.html`, 'utf8')
  const leftover = [...html.matchAll(/(?:src|href)="\/(?!\/)[^"]*"/g)].map((m) => m[0])
  console.log(
    `  ${page}.html`.padEnd(32),
    leftover.length ? `LEFTOVER ABSOLUTE: ${leftover.join(', ')}` : 'all paths relative'
  )
}
