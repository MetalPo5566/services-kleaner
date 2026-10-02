---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

## Scope

services.kleaner.my, the single page (`src/pages/index.astro`). Mode: Persuade. Mobile first.

Audience and job: Klang Valley households and small businesses who know roughly what they need (renovation done, stained sofa, regular help, moving) and want to get into the right booking flow fast. Action: tap through to that service's booking page. Backup: WhatsApp for the unsure.

Constraints: logo and #0088F8 blue fixed; kleaner.my header and footer links kept; prices only from prices.json; every claim on the page owner-confirmed (2 Oct 2026); no em dashes; English only.

Approved comp: `.impeccable/mocks/comp-b.png` (Higgsfield job 96970b1b-09fe-49c4-896f-765e1828594e, 758x1340 capture). Alternates in the same folder carry no approval.

## Direction contract

THESIS: The services page is the numbered tile wall above a kopitiam counter: every service is a tile you point at and order, its price on a tag. It refuses the category default of soft white cards, stock cleaner photos and sparkle icons.

OWN-WORLD: Kleaner blue #0088F8 enamel tiles with a thin white inset rule, giant white condensed numerals, white line pictograms, white rounded price tags. Selected tile flips to sunny yellow #FAC93F (sampled from the approved comp) with navy #11263C ink. Navy order bar, yellow BOOK NOW pill. Display in a heavy condensed sign face (Anton), labels in a condensed workhorse (Oswald), body in Lato. White ground, no gradients, no glow.

STORY: The visitor sees all six services and their prices at once, taps one, it lights up, the order bar names it and BOOK NOW opens that booking flow. A chevron in the bar opens the order slip: the service's full name, price, what is included and, where the link lands on the front of the BookingKoala form (four of six), which service to choose there. Product-truth citation: GO-LIVE.md step 1 and PRODUCT.md Operating Context. The unsure get three set combos and WhatsApp. Then the guarantee, the trust facts, the RM20 code, and the kleaner.my footer.

FIRST VIEWPORT: 390 phone. Tiles are flat enamel, no drop shadow; rows size to content (two line names make row one taller). Header: logo left, menu right. "ORDER YOUR CLEAN." full width, about 45px cap height. Subline beneath. Blue RM20 pill, tap copies KLEANERHOME. Two-column tile grid starting near y=200, four tiles visible. Navy order bar fixed at the bottom, selected service on the left, yellow BOOK NOW on the right. Desktop: same order, headline larger, grid three across.

FORM: Kopitiam counter menu board, position 3 of 7 on the ordered list (1 floor plan, 2 MRT line map, 3 kopitiam menu board, 4 handover checklist, 5 job ticket, 6 care label, 7 super-app grid); approved comp is the numbered-tile variant. Seed key b9dd7c26 (degraded roll, no challengers). Signature interaction: tile select lights the tile and the order bar updates name, price and link; deep links `#<slug>` preselect a service for ads.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Four of six booking links still open the front of the BookingKoala flow (GO-LIVE.md step 1).
- The logo file still carries "The Benchmark of Cleaning Service"; newer wording "The Benchmark in Cleaning" needs a new logo file.
