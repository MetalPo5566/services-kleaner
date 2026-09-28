import type { APIRoute } from 'astro'
import { SITE } from '../data/site'

// One page, at the root. Nothing else is published on this host.
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10)
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE.url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  )
}
