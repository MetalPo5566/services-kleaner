# Kleaner services hub

One page listing every Kleaner service, each card a single tap to its booking
page. Deployed as a standalone static site on `home.kleaner.my`.

kleaner.my runs on BookingKoala, which cannot host custom coded pages, so this
follows the same pattern already used for `movers.kleaner.my`,
`upholstery.kleaner.my` and `postreno.kleaner.my`. The header and footer
replicate the main site and link back to it with absolute URLs.

Forked from the shell in
[postreno](https://github.com/MetalPo5566/postreno), which was itself forked
from [Claude-Upholstery](https://github.com/MetalPo5566/Claude-Upholstery).
Same tokens, same motion vocabulary, same check suite.

**Read [GO-LIVE.md](./GO-LIVE.md) before deploying.** The nine booking links are
the thing to look at first.

## The page

Laid out like a super-app service menu (the Grab or Touch 'n Go home screen):
a photo-led hero, a launcher of the four groups, a sticky strip of group pills
that follows the scroll, then each group in its own arrangement. The visual
system is recorded in [DESIGN.md](./DESIGN.md); product facts in
[PRODUCT.md](./PRODUCT.md). No prices anywhere: each booking flow shows its own.

| Section | What it does |
| --- | --- |
| Hero | "Your home, our honour.", Book now (kleaner.my/booknow) and WhatsApp us |
| Launcher | Four photo tiles, one per group, each jumping to its group |
| Pill strip | Sticks under the header and lights the group in view |
| Home cleaning | Standard, Deep, Move In / Move Out as a swipeable row (three columns on wide screens) |
| After renovation | Post Renovation and Formaldehyde Removal as wide rows |
| Specialist care | Sofa & Mattress, Aircond, Curtain & Carpet as a bento of three |
| Moving | Mover as a photo and blue panel, "Get a quote" |
| Proof | 100,000+ cleaning hours and reclean or full refund, nothing else |
| Close | WhatsApp us, for the unsure |

Every service has its own anchor, so ads and WhatsApp can deep-link, for
example `home.kleaner.my/#formaldehyde-removal`. The previous page's
anchors (`#general-cleaning`, `#sofa-mattress`, `#post-renovation`,
`#formaldehyde-removal`, `#movers`) still land on the matching service.

## Stack

Astro 7, static output, Tailwind CSS 4. No client framework and no third party
runtime dependency: the only external script is Google Tag Manager, and only
when a container ID is configured. 

**Photos** are generated plates in `assets/plates` and `assets/photos`, each
with its generation prompt embedded in the file; Astro serves them as AVIF and
WebP at the sizes each slot needs. Icons are Phosphor (regular) through
`src/components/Icon.astro`. Reddit Sans is self hosted from `public/fonts`.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # static build into dist/, regenerates content/OWNER-CONFIRM.md
npm run preview    # serve the build
npm run check      # build, then the content checks
npm run verify     # prices, menu, claims, structured data, no em dashes
npm run links      # resolve every link in the build, writes qa/link-audit.md
npm run qa         # screenshots and interaction tests, needs preview running
npm run lighthouse # mobile Lighthouse
npm run assets     # regenerate fonts, logo, favicon and the OG card
```

`npm run qa` and `npm run lighthouse` expect `npm run preview` to be running on
port 4321 and drive a real Chromium. Set `CHROME_PATH` if the browser is not at
the default location.

## Layout

```
src/
  components/        Header, Footer, ServiceGrid, Button, Icon, Section, ConfirmNote
  data/
    prices.json      Single source of truth for every price on the page
    services.ts      Every service. The grid renders from this and nothing else.
    site.ts          Brand, contact, menu, and the price helpers
    copy/
      services.en.ts Every word on the page that is not a service
  layouts/
    BaseLayout.astro SEO, JSON-LD, GTM, the reveal script, CTA tracking
  lib/schema.ts      LocalBusiness and ItemList structured data
  pages/             index.astro, sitemap.xml
public/
  fonts/             Self hosted Lato 400, 700, 900
  images/            The two logo files, nothing else
  og/                The 1200x630 share card
scripts/             Asset generation and the check suite
content/
  OWNER-CONFIRM.md   Generated: every open question, with where it sits
  SOURCE-NOTES.md    What the page may state, and where each figure came from
qa/                  Screenshots, Lighthouse report, link audit
```

## Config driven

Adding a service is a new entry in `src/data/services.ts` and no change to any
markup. Every figure comes from `prices.json` through the helpers in `site.ts`,
so the cards and the booking form cannot drift. Where no price exists the card
reads "Get instant price" rather than a guess.

Two things about the cards are deliberate:

- **Each service has one real button**, `Book now` (or `Get a quote` for the
  Mover), linking straight to its booking flow. Cards are not links
  themselves, so nothing interactive is nested.
- **The pill strip works without JavaScript**: every pill is a plain anchor;
  the script only lights the group in view.

Each booking button carries `data-cta="book"` and `data-service="<slug>"`, so the shell's
existing delegated handler reports a `cta_book` event per card with its slug and
no new JavaScript.

## Claims, and what stops them drifting

The owner confirmed every claim on the page on 2 October 2026, so there are
**0** open items and no visible notes. A new unverified claim gets a `confirm`
string in `services.ts`, which renders a visible `[OWNER TO CONFIRM]` note and
lands in `content/OWNER-CONFIRM.md` on the next build.

`npm run verify` holds a list of phrases that may never appear: no 100 per cent
anything, nothing permanent or clinical, no claim about viruses, no promise
about anybody's health. Add one and the build fails. It also fails if the sofa
card ever quotes RM80, which is the carpet price and not the sofa one.

House style: Malaysian English, short sentences, second person, no exclamation
marks, no em dashes anywhere in copy or code comments, RM with no decimals
except the per sqft rate.

## Analytics

Set `PUBLIC_GTM_ID` to render the GTM snippet. Leave it unset and no analytics
markup is emitted at all. Two events are pushed to the dataLayer: `cta_book`
with the service slug, and `cta_whatsapp`.

## Performance

Lighthouse mobile, on the production build: **99 Performance, 100
Accessibility, Best Practices and SEO** (2 October 2026).

CLS reads 0.006 under Lighthouse's throttled emulation, which is the font swap,
not the layout. Measured unthrottled there is no shift at all, and `npm run qa`
asserts exactly zero.

## Motion

Inherited unchanged from the shell. `transform` and `opacity` only, UI feedback
under 300ms, hover motion gated behind a real pointer.

**Under `prefers-reduced-motion` nothing is hidden at all.** The reveal is
skipped entirely rather than reduced, because hiding content behind an observer
is the one failure that can leave the page blank. `npm run qa` asserts it.
