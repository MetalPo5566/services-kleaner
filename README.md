# Kleaner services hub

One page listing every Kleaner service, each card a single tap to its booking
page. Deployed as a standalone static site on `services.kleaner.my`.

kleaner.my runs on BookingKoala, which cannot host custom coded pages, so this
follows the same pattern already used for `movers.kleaner.my`,
`upholstery.kleaner.my` and `postreno.kleaner.my`. The header and footer
replicate the main site and link back to it with absolute URLs.

Forked from the shell in
[postreno](https://github.com/MetalPo5566/postreno), which was itself forked
from [Claude-Upholstery](https://github.com/MetalPo5566/Claude-Upholstery).
Same tokens, same motion vocabulary, same check suite.

**Read [GO-LIVE.md](./GO-LIVE.md) before deploying.** The six booking links are
the thing to look at first.

## The page

Built as a kopitiam counter board: numbered tiles you point at, an order bar
that books what you picked. The visual system is recorded in
[DESIGN.md](./DESIGN.md); product facts in [PRODUCT.md](./PRODUCT.md).

| Section | What it does |
| --- | --- |
| Board | "Order your clean.", the RM20 code pill (tap copies it), six numbered tiles with price tags |
| Order bar | Fixed to the bottom. Names the picked tile; Book now opens that service's booking flow; the chevron opens the order slip (full name, price, what is included) |
| Sets | Three tickets for the unsure, each straight to a booking flow, plus WhatsApp |
| Guarantee | Reclean or full refund, and the house facts |
| Voucher | RM20 off the first booking, code and terms |

First tap on a tile selects it, the second tap (or Book now) books. Without
JavaScript every tile is a plain link to its booking flow. `#<slug>` in the URL
preselects a tile, so ads can land on one, for example
`services.kleaner.my/#post-renovation`.

## Stack

Astro 7, static output, Tailwind CSS 4. No client framework and no third party
runtime dependency: the only external script is Google Tag Manager, and only
when a container ID is configured. 

**No raster image on the page apart from the logo.** The tile drawings are
inline SVG from `src/components/Pictogram.astro` and the small icons from
`src/components/Icon.astro`. Anton, Oswald and Lato are self hosted from
`public/fonts`.

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

- **The whole card is the anchor**, so the tap target is the card and not the
  button inside it. That means the Book now control is a styled `span`, not a
  `button`: an interactive element nested in an anchor is invalid and breaks
  keyboard order. `npm run qa` asserts no card nests one.
- **Cards whose booking URL is the front of the flow say so**, in a line under
  the price. Four of the six are in that state. See GO-LIVE.md.

Each card carries `data-cta="book"` and `data-service="<slug>"`, so the shell's
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
