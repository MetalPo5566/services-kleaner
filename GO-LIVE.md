# Go live checklist: services.kleaner.my

One page, the hub that lists every Kleaner service. Standalone static site,
because kleaner.my runs on BookingKoala and cannot host custom coded pages.
Same pattern as `movers.kleaner.my`, `upholstery.kleaner.my` and
`postreno.kleaner.my`.

| Page | URL once live |
| --- | --- |
| All Services | `https://services.kleaner.my/` |

---

## 0. Read this first

### The hostname was chosen, the rest was assumed

`services.kleaner.my` is the host you asked for. It is set once, as `SITE.url`
in `src/data/site.ts`, and everything else reads from it: the canonical, the
sitemap, the Open Graph URL, the menu entry and the checks in
`scripts/verify.mjs`.

### The live kleaner.my site could not be read

The machine this was built on routes outbound traffic through an egress proxy
that refuses `kleaner.my` by organisation policy. The booking flow could not be
opened. The booking links in step 1 were supplied by the owner on 2 October
2026.

---

## 1. The nine booking links

This page has one job: the visitor picks a service and books it. The board
quotes no prices; each booking flow shows its own.

| Service | Card links to |
| --- | --- |
| Standard Cleaning | `https://kleaner.my/booknow/` |
| Deep Cleaning | `https://kleaner.my/booknow/` |
| Move In / Move Out Cleaning | `https://kleaner.my/booknow/` |
| Post Renovation Cleaning | `https://kleaner.my/booknow/post-renovation` |
| Formaldehyde Removal | `https://kleaner.my/booknow/post-renovation` |
| Aircond Maintenance | `https://kleaner.my/booknow/aircond-servicing` |
| Sofa & Mattress Cleaning | `https://kleaner.my/booknow/upholstery-cleaning` |
| Curtain & Carpet Cleaning | `https://kleaner.my/booknow/upholstery-cleaning` |
| Mover | `https://kleaner.my/booknow/movers` |

The three home cleaning services share the front of the flow, where the customer
picks the service, so their order slip says so. The links live in
`src/data/services.ts` and `npm run verify` checks each one.

---

## 2. Deploy

Nothing has been pushed to a host: this session had no Vercel or Cloudflare
credentials. Both configs are committed and ready. Pick one.

### Option A: Cloudflare (`wrangler.jsonc`, `public/_redirects` and `public/_headers` are ready)

Create a project from this repository. Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Astro, or None |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | leave it. `.node-version` pins Node 22. |

**Set this build environment variable before the first build:**

```
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1
```

The repo has playwright as a devDependency for the test suite. Cloudflare
installs devDependencies, and playwright's postinstall downloads about 500MB of
browsers the build does not need. Without this the build is very slow and may
fail. Do **not** use `NPM_FLAGS=--production` instead: Tailwind is also a
devDependency and the build genuinely needs it.

Then **Custom domains**, **Set up a custom domain**, and enter
`services.kleaner.my`.

### Option B: Vercel (`vercel.json` is already in the repo)

```bash
npm install -g vercel
vercel login
vercel link
vercel --prod
vercel domains add services.kleaner.my
```

### The DNS record

**kleaner.my already uses Cloudflare for DNS.** If the zone is in the same
Cloudflare account as the project, adding the custom domain creates the record
and the certificate for you, with nothing to copy or paste.

If the zone sits in a different account, send whoever holds it:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `services` | the target shown in the project's Custom domains tab | Proxied (orange cloud) |

---

## 3. Add it to the kleaner.my menu

The main site menu lives in the BookingKoala admin, not in this repo. In the
**Cleaning Services** dropdown, add a first item:

| Label | URL |
| --- | --- |
| `All Services` | `https://services.kleaner.my/` |

Add the same entry at the top of the footer's Cleaning Services list.

The header and footer on this site already carry it, and so does
`postreno.kleaner.my`. The upholstery site is a separate repository and needs
the same two lines added to its `HEADER_NAV` and `FOOTER_NAV`.

---

## 4. Google Tag Manager

The page renders no analytics markup at all until you set the container ID. Add
the kleaner.my GTM container ID as `PUBLIC_GTM_ID` in the host's environment
variables and redeploy.

| Event | Parameters | Fires when |
| --- | --- | --- |
| `cta_book` | `page`, `service`, `cta_text` | any service card, the chooser cards, the voucher button |
| `cta_whatsapp` | `page`, `service`, `cta_text` | any WhatsApp control |

On a service card, `service` is that card's slug, so you can see which service
people actually tap. That is the number worth watching on this page.

---

## 5. Three things on the page are not verified

`content/OWNER-CONFIRM.md` lists **8** open items, each printed on the page in
an amber `[OWNER TO CONFIRM]` note. Six are the per card questions in step 1.
The other two:

1. **The voucher.** The strip offers RM20 off with code `KLEANERHOME` to
   31 December 2026. Confirm the code is live in BookingKoala on those terms. A
   code that fails at checkout costs more than no code at all, so say the word
   and we pull the strip instead.
2. **"Trained in-house team, not gig workers."** What Kleaner publishes is that
   providers are background checked. This is a claim about how people are
   employed, which is a different and stronger thing to say, and a competitor
   would be entitled to challenge it.

Those notes are **visible to visitors**, so clear them before you point the main
menu here. They are kept out of the structured data, and `npm run verify`
enforces that.

---

## 6. One price was corrected against the booking form

The brief put sofa and mattress cleaning at "from RM80". The booking form has
sofa from RM88 and mattress from RM108, and RM80 is the smallest carpet. The
card shows **from RM88**, computed from `prices.json` rather than typed in, and
`npm run verify` fails the build if RM80 ever appears there. Confirm which is
right.

---

## 7. The page is English only

The brief asked for EN, BM and ZH if the shell supported it. The shell switches
English and Chinese on the post-renovation page, but there is no Bahasa Malaysia
anywhere on the site, so a three way switcher here would point at two pages that
do not exist. Every word lives in `src/data/copy/services.en.ts`, so
`services.ms.ts` and `services.zh.ts` are a copy, a translation and one import.
Say the word and we add them.

---

## 8. Checks after go live

```bash
npm run check       # build, then 78 content checks
npm run links       # resolve every link, writes qa/link-audit.md
npm run preview     # then, in another shell:
npm run qa          # 33 interaction checks and the screenshots
npm run lighthouse  # mobile Lighthouse
```

As built here: **100 for Performance, Accessibility, Best Practices and SEO.**

**Re-run `npm run links` from a machine with normal internet access.** Every
external link comes back BLOCKED here because of the egress policy, so the audit
in `qa/` proves only that the internal links resolve.

Then, by hand:

- [ ] Open the page on a real phone and tap every one of the nine cards. Confirm
      each one lands on the right service, not just on a page that loads.
- [ ] Tap the WhatsApp button and check the prefilled message.
- [ ] Try the voucher code at checkout.
- [ ] Paste the URL into WhatsApp to check the share card renders.
- [ ] Submit `https://services.kleaner.my/sitemap.xml` in Google Search Console.
- [ ] Run the URL through the Google Rich Results Test and confirm the ItemList.

---

## Notes on two deliberate decisions

**WhatsApp buttons use navy text, not white.** The published brand green
`#00CD56` with white text is 2.1:1, which fails accessibility. With navy text it
is 7.2:1. The brand colour is unchanged, only the text colour.

**Filled blue buttons use `#0071D1`, not `#0088F8`.** The official brand blue is
3.6:1 behind white text. `#0071D1` is 4.9:1 and passes. The official blue is
still used throughout for icons, accents and the tagline.
