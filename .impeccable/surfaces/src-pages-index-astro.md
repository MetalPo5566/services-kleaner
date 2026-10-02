---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

## Scope

home.kleaner.my, the single page (`src/pages/index.astro`). Mode: Persuade. Mobile first, 390px primary.

Audience and job: Klang Valley homeowners, condo residents, people moving or renovating, mostly on a phone from ads and WhatsApp. Job: find their service in seconds and tap the right booking link. Backup: WhatsApp +60 17-477 0978.

Proof allowed: 100,000+ cleaning hours delivered; reclean or full refund guarantee. Nothing else. No prices on the page.

Constraints: Astro + Tailwind, no framework migration; logo asset unchanged; #0088F8 accent, #0071D1 filled buttons; tagline "Your home, our honour."; Phosphor icons only, one weight; light and dark modes; zero em or en dashes; no eyebrows, no section numbers; each group a different layout family; anchor id per service; CTA "Book now" for cleaning, "Get a quote" for Mover.

Services and links: Standard, Deep, Move In / Move Out -> https://kleaner.my/booknow; Post Renovation, Formaldehyde Removal -> https://kleaner.my/booknow/post-renovation; Aircond Maintenance -> https://kleaner.my/booknow/aircond-servicing; Sofa & Mattress, Curtain & Carpet -> https://kleaner.my/booknow/upholstery-cleaning; Mover -> https://kleaner.my/booknow/movers.

## Direction contract

THESIS: The services page is a super-app service menu, the Grab or Touch 'n Go home screen grammar visitors use daily: services grouped by need as big thumb-reach photo tiles, each a direct tap into booking. It refuses the category default of a long brochure of equal white cards with a contact form.

OWN-WORLD: White and cool off-white ground in light, deep blue-black in dark; Kleaner blue #0088F8 as the single accent, #0071D1 for filled buttons. One soft radius system (large rounded tiles, pill buttons and chips). Real photography inside every tile, no text on photos. A sturdy rounded sans with character for headings, a plain workhorse for body. Phosphor regular icons. Sticky pill bar for jumping between groups, like an app's category strip.

STORY: The visitor lands on a split hero (cleaner at work in a Klang Valley condo), reads "Your home, our honour.", sees Book now and WhatsApp us. Below, a scroll-snap strip of four group pills. Four groups follow, each a different tile arrangement: home cleaning, after renovation, specialist care, moving. Each tile: photo, name, one plain line, Book now (Get a quote for Mover). Then 100,000+ hours and reclean or refund, then a WhatsApp close, then the kleaner.my footer.

FIRST VIEWPORT: 390 phone. Single-line header, logo left, menu right, 64px. Headline left-aligned, two lines, subtext under 20 words, Book now filled #0071D1 and WhatsApp us outlined, side by side. Hero photo below the CTAs, rounded, about 40% of the viewport, the group pill strip peeking at the bottom edge. Desktop 1440: split, copy left, photo right, pills visible under the fold line.

FORM: Super-app service menu, position 1 of 7 on the ordered list (1 super-app service menu, 2 condo lobby directory, 3 renovation handover checklist, 4 service job sheet, 5 property listing magazine, 6 MRT line map, 7 uniform care label). User chose IMPECCABLE'S PICK over the assigned job sheet. Seed key 59da3b4a (degraded roll, no challengers). Signature interaction: the group pill strip tracks the section in view and jumps with a smooth scroll; every service has its own anchor for ads and WhatsApp deep links.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Logo file still reads "The Benchmark of Cleaning Service"; the brief's wording "THE BENCHMARK IN CLEANING" needs a new logo file from the owner.
