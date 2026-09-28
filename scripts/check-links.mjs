// Resolves every link the built pages point at and writes the result to
// qa/link-audit.md. Hosts blocked by an egress policy are reported as blocked
// rather than broken, because those are not the same thing.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const FILES = readdirSync(DIST).filter((name) => name.endsWith('.html'))

const links = new Map()
for (const file of FILES) {
  const html = readFileSync(join(DIST, file), 'utf8')
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1]
    if (href.startsWith('#')) continue
    if (!links.has(href)) links.set(href, new Set())
    links.get(href).add(file)
  }
}

const rows = []

for (const [href, pages] of [...links].sort()) {
  const from = [...pages].join(', ')

  if (href.startsWith('tel:')) {
    rows.push({ href, from, kind: 'tel', status: 'n/a', note: 'dial link, nothing to resolve' })
    continue
  }

  if (href.startsWith('/')) {
    const direct = join(DIST, href)
    const asHtml = join(DIST, `${href.replace(/\/$/, '')}.html`)
    const asIndex = join(DIST, href, 'index.html')
    const ok = existsSync(direct) || existsSync(asHtml) || existsSync(asIndex)
    rows.push({ href, from, kind: 'internal', status: ok ? '200' : 'MISSING', note: ok ? 'in dist' : 'not built' })
    continue
  }

  let status = 'error'
  let note = ''
  try {
    const response = await fetch(href, { method: 'GET', redirect: 'manual' })
    // A 403 or 407 here is the egress proxy refusing the host, not the site
    // refusing us. Reporting it as a broken link would be wrong and would send
    // somebody chasing a URL that is fine.
    if (response.status === 403 || response.status === 407) {
      status = 'BLOCKED'
      note = 'egress policy in this build environment, not a site error'
    } else {
      status = String(response.status)
      const location = response.headers.get('location')
      note = location ? `redirects to ${location}` : 'direct response'
    }
  } catch (error) {
    const message = [error?.message, error?.cause?.message, String(error)].filter(Boolean).join(' | ')
    const blocked =
      /403|407|proxy|tunnel|CONNECT|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|was cancelled/i.test(
        message
      )
    status = blocked ? 'BLOCKED' : 'error'
    note = blocked ? 'not reachable from this build environment' : message.slice(0, 80)
  }
  rows.push({ href, from, kind: 'external', status, note })
}

mkdirSync('qa', { recursive: true })

const counts = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1
  return acc
}, {})

const lines = [
  '# Link audit',
  '',
  `Generated from the built site. ${rows.length} unique links.`,
  '',
  Object.entries(counts)
    .map(([status, count]) => `- **${status}**: ${count}`)
    .join('\n'),
  '',
  '`BLOCKED` means this build environment could not open the host, not that the link is wrong.',
  'The egress policy on the machine that built this site does not allow kleaner.my or most',
  'external hosts, so every off site link comes back BLOCKED here. Re-run this from a machine',
  'with normal internet access before go live to get a real answer on each one.',
  '',
  '| Link | Type | Status | Note | On |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map((row) => `| \`${row.href}\` | ${row.kind} | ${row.status} | ${row.note} | ${row.from} |`),
  '',
]

writeFileSync('qa/link-audit.md', lines.join('\n'))
console.log(`wrote qa/link-audit.md`)
console.log(Object.entries(counts).map(([status, count]) => `${status}: ${count}`).join('  '))

const missing = rows.filter((row) => row.status === 'MISSING')
if (missing.length) {
  console.log('MISSING internal links:', missing.map((row) => row.href).join(', '))
  process.exitCode = 1
}
