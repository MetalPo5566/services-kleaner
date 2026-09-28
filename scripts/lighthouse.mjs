// Runs Lighthouse mobile over the page and writes qa/lighthouse-summary.md.
// Needs `npm run preview` running, and a Chromium at CHROME_PATH.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const BASE = process.env.QA_BASE || 'http://127.0.0.1:4321'
const OUT = 'qa'
mkdirSync(OUT, { recursive: true })

process.env.CHROME_PATH =
  process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const PAGES = [{ slug: 'services', path: '/' }]

const METRICS = {
  'first-contentful-paint': 'FCP',
  'largest-contentful-paint': 'LCP',
  'total-blocking-time': 'TBT',
  'cumulative-layout-shift': 'CLS',
  'speed-index': 'Speed Index',
}

const rows = []

for (const page of PAGES) {
  execFileSync(
    'npx',
    [
      'lighthouse',
      `${BASE}${page.path}`,
      '--quiet',
      '--output=json',
      '--output=html',
      `--output-path=${OUT}/lighthouse-${page.slug}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
      '--only-categories=performance,accessibility,best-practices,seo',
    ],
    { stdio: 'inherit' }
  )

  const report = JSON.parse(readFileSync(`${OUT}/lighthouse-${page.slug}.report.json`, 'utf8'))
  rows.push({
    page: page.path,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)])
    ),
    metrics: Object.fromEntries(
      Object.entries(METRICS).map(([id, label]) => [label, report.audits[id].displayValue])
    ),
  })
}

const lines = [
  '# Lighthouse, mobile preset',
  '',
  `Run against \`${BASE}\` on the production build. Target is 95 or above everywhere.`,
  '',
  '| Page | Performance | Accessibility | Best Practices | SEO |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(
    (row) =>
      `| \`${row.page}\` | ${row.scores.performance} | ${row.scores.accessibility} | ${row.scores['best-practices']} | ${row.scores.seo} |`
  ),
  '',
  '## Metrics',
  '',
  '| Page | ' + Object.values(METRICS).join(' | ') + ' |',
  '| --- | ' + Object.values(METRICS).map(() => '---').join(' | ') + ' |',
  ...rows.map(
    (row) => `| \`${row.page}\` | ` + Object.values(METRICS).map((label) => row.metrics[label]).join(' | ') + ' |'
  ),
  '',
  'Full reports: `lighthouse-<page>.report.html` in this folder.',
  '',
]

writeFileSync(`${OUT}/lighthouse-summary.md`, lines.join('\n'))
console.log('\nwrote qa/lighthouse-summary.md')

const low = rows.flatMap((row) =>
  Object.entries(row.scores).filter(([, score]) => score < 95).map(([key]) => `${row.page} ${key}`)
)
if (low.length) {
  console.log('below 95:', low.join(', '))
  process.exitCode = 1
}
