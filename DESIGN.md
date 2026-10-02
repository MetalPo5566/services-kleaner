---
name: Kleaner Services
description: Every Kleaner service on one kopitiam counter board; point at a tile, order, book.
colors:
  tile: "#0088f8"
  brand-dark: "#0071d1"
  brand-ink: "#006abf"
  brand-tint: "#eaf5ff"
  brand-line: "#d5e9fb"
  sun: "#fac93f"
  sun-dark: "#edb91f"
  navy: "#0b2747"
  ink: "#3e5470"
  paper: "#f4f7fa"
  white: "#ffffff"
  wa: "#00cd56"
typography:
  display:
    fontFamily: "Anton, 'Anton Fallback', 'Arial Narrow', Impact, sans-serif"
    fontSize: "clamp(36px, 12.4vw, 128px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Anton, 'Anton Fallback', 'Arial Narrow', Impact, sans-serif"
    fontSize: "clamp(34px, 9.4vw, 64px)"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Anton, 'Anton Fallback', 'Arial Narrow', Impact, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.05
  subhead:
    fontFamily: "Oswald, 'Oswald Fallback', 'Arial Narrow', Arial, sans-serif"
    fontSize: "clamp(17px, 5.75vw, 34px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Oswald, 'Oswald Fallback', 'Arial Narrow', Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.04em"
  body:
    fontFamily: "Lato, 'Lato Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  rule: "4px"
  tag: "5px"
  tile: "7px"
  tile-wide: "9px"
  ticket: "8px"
  plate: "10px"
  pill: "999px"
spacing:
  board-gap: "6px"
  board-gap-wide: "14px"
  gutter: "16px"
  gutter-wide: "32px"
  section: "40px"
  section-wide: "64px"
  container: "76rem"
components:
  tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.white}"
    rounded: "{rounded.tile}"
    padding: "6px"
  tile-selected:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tile}"
  tile-selected-hover:
    backgroundColor: "{colors.sun-dark}"
  price-tag:
    backgroundColor: "{colors.white}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.tag}"
    padding: "3px 5px 2px"
  order-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    height: "58px"
  button-book:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.navy}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "37px"
  button-book-hover:
    backgroundColor: "{colors.sun-dark}"
  button-primary:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  button-whatsapp:
    backgroundColor: "{colors.wa}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  voucher-pill:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  set-ticket:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.ticket}"
  set-ticket-stub:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sun}"
    width: "76px"
  voucher-tile:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.white}"
    rounded: "{rounded.plate}"
    padding: "8px"
  order-slip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.plate}"
    padding: "18px"
---

# Design System: Kleaner Services

## Overview

**Creative North Star: "The Kopitiam Counter Board"**

The page is the numbered tile wall above a kopitiam counter. Every service is an enamel sign tile, painted in Kleaner blue, lettered in a heavy condensed sign face, with a white price tag clipped to its corner and a line drawing beside its numeral. You point at one, it lights up sun yellow, and the navy counter at the bottom of the screen names your order and takes it. Everything else on the page (set tickets, the guarantee band, the voucher) is printed from the same shop: the same three paints, the same two lettering faces, the same inset rule.

Density is high and legible from arm's length. Type is large, uppercase and condensed; surfaces are flat paint, not paper cards. Depth exists only where something genuinely sits on top of the board: the order bar, the order slip, the sticky header once the page scrolls under it. The confirmed refusal is the category default of soft white cards, stock cleaner photos and sparkle icons; the shipped page carries no raster imagery apart from the logo.

**Key Characteristics:**
- Flat enamel blue tiles with a 2px white inset rule, giant condensed numerals, line pictograms.
- Three paints: Kleaner blue, sun yellow for "lit / act", navy for ink and the counter.
- Anton for anything lettered on the board, Oswald for tags and the order bar, Lato for sentences.
- Tile internals sized in container units, so a tile is the same drawing at every width.
- Selection is the signature interaction: tile lights, order bar updates name and link.

## Colors

A signwriter's palette: one saturated blue, one warm yellow, one deep navy, on white.

### Primary
- **Enamel Kleaner Blue** (tile): the official brand blue. Paint for every board tile. Text on it is only ever large display type, or white tags carrying blue text; never small body copy on this blue.
- **Deep Counter Blue** (brand-dark): the AA-safe blue for anything filled that carries white text at normal size (buttons, the RM20 pill, the voucher tile ground) and for price-tag text and Oswald labels on white. Hover deepens to #005fb4.

### Secondary
- **Lit Sun Yellow** (sun): the selected tile, the BOOK NOW pills, the NEW tag, the trust icons on navy, the ticket stub letter, text selection. Yellow means "this one" or "do it".
- **Pressed Sun** (sun-dark): hover and pressed state of anything yellow.

### Tertiary
- **WhatsApp Green** (wa): only on the WhatsApp button, always with navy text (white on this green fails contrast).

### Neutral
- **Board Navy** (navy): headings, the order bar, the guarantee band, the footer, ticket borders and stubs, ink on lit tiles.
- **Slate Ink** (ink): body text on white.
- **Counter Paper** (paper): quiet hover grounds and the COPY CODE chip; not a page background.
- **White**: the page ground and the inset rule.
- **Brand Tint / Brand Line / Brand Ink** (brand-tint, brand-line, brand-ink): header and nav hover grounds, the header hairline, link text on tints. These belong to the shared kleaner.my chrome.

### Named Rules
**The Three Paints Rule.** Board surfaces are painted in blue, sun or navy and nothing else. No gradients, no glows, no tints standing in for a tile.

**The Lit Means Yellow Rule.** Yellow is reserved for the selected thing and the booking action. If a yellow element is not selected or not a call to book, it is wrong.

## Typography

**Display Font:** Anton (with Anton Fallback, metric-fitted from Arial Narrow Bold)
**Label Font:** Oswald 500 / 600 / 700 (with Oswald Fallback, metric-fitted from Arial Narrow)
**Body Font:** Lato 400 / 700 (with Lato Fallback, metric-fitted from Arial)

**Character:** Anton is the hand-lettered sign; Oswald is the printed price tag and order chit; Lato is the person behind the counter explaining in full sentences. All three are self-hosted with size-adjusted fallbacks so the swap never reflows the board.

### Hierarchy
- **Display** (Anton, clamp(36px, 12.4vw, 128px), 1.02, uppercase): the page headline only, full width on phones.
- **Headline** (Anton, clamp(34px, 9.4vw, 64px), 1, uppercase): section titles. Scales up on the navy guarantee band (clamp(44px, 13vw, 112px)) and the voucher (clamp(38px, 11vw, 84px)) at 0.98 line height.
- **Title** (Anton, 22 to 30px, 1.05, uppercase): ticket questions, the order slip service name, BOOK NOW pills (19 to 21px).
- **Tile lettering** (Anton, numeral 31cqi and name 15.2cqi on phones; 24cqi and 10cqi from 1024px): sized to the tile, never to the viewport.
- **Subhead** (Oswald 700, clamp(17px, 5.75vw, 34px)): the line under the headline, sentence case.
- **Label** (Oswald 600, 13 to 17.5px, uppercase where it is a tag or action, 0.01 to 0.06em tracking): price tags, NEW tag, order bar text, text actions, COPY CODE; trust facts in Oswald 500.
- **Body** (Lato 400, 15 to 19px, 1.65 base, snug in lists): explanations, ticket answers, guarantee copy. Keep long runs to 42rem.

### Named Rules
**The Lettered Board Rule.** Anything that is "on the board" (headlines, tile names, numerals, set letters, book pills) is Anton uppercase. Sentences are never Anton.

**The Sign Scale Rule.** Tile numerals and names are sized in container query units (cqi) from the tile's own width, so every tile is the same composition at every breakpoint.

## Layout

Single column page inside a 76rem container with 16px gutters (32px from 768px), safe-area aware. The board is a two-column grid on phones with 6px seams, three columns from 768px with 14px seams. Rows size to content: a two-line tile name makes its row taller. Each grid cell is an inline-size container; tiles take min-height 75cqi on phones, 66cqi from 768px, and drop the minimum at 1024px, where numeral, pictogram and tag share one row and the name runs underneath so both rows of the wall fit above the order bar.

Sections step 40px vertical on phones, 64px from 768px (the navy band 48px and 80px). The order bar is fixed to the bottom at every width, 58px plus the safe-area inset, and the footer pads its bottom by the same amount so nothing is covered. Breakpoints in use: 768px and 1024px, plus 1280px for the header's desktop nav.

## Elevation & Depth

The board is flat. Tiles, tickets, the voucher tile and the guarantee band carry no shadow; depth on the board is expressed by paint (blue to yellow) and by the inset rule. Shadows exist only on layers that genuinely float over the page.

### Shadow Vocabulary
- **Counter edge** (`box-shadow: 0 -10px 24px -18px rgb(11 39 71 / 0.6)`): the order bar's top edge where content scrolls beneath it.
- **Slip lift** (`box-shadow: 0 -18px 40px -24px rgb(11 39 71 / 0.55)`): the order slip rising out of the bar.
- **Header on scroll** (`box-shadow: 0 1px 0 rgb(213 233 251), 0 8px 24px -16px rgb(17 38 60 / 0.28)`): shared kleaner.my header, only once the page has scrolled under it.

### Named Rules
**The Flat Board Rule.** Nothing painted on the board casts a shadow. Elevation is for overlays only: the order bar, the order slip, the scrolled header, dropdowns.

## Shapes

Small, firm corners, like enamel signs and printed tickets: 7px tiles (9px from 768px) with a 4px-cornered inset face, 5px price tags, 8px tickets, 10px plates (voucher tile, order slip top corners). Actions and the voucher pill are full pills (999px). The recurring geometry is the inset rule: a 2px line drawn 6 to 8px inside a painted plate, used on tiles and on the voucher tile. Tickets use a 2px navy outline and a 2px dashed navy perforation between stub and body.

Pictograms are drawn on a 64-unit box (viewBox cropped to 0 7 64 50), one 3.4 stroke, round caps and joins, no fill, currentColor. They are separate from the 24-unit UI icon set, which stays for chevrons, checks, arrows and phone.

## Components

### Board Tile (signature)
An enamel sign you point at.
- **Shape:** 7px corners (9px from 768px), 6px padding (8px from 768px) around an inset face with a 2px currentColor rule and 4px corners.
- **Anatomy:** two-digit Anton numeral top left, white price tag top right (two lines for "from" and "instant" prices), line pictogram beside the numeral, Anton uppercase name across the bottom. An optional NEW tag in sun yellow hangs under the price tag.
- **Default:** tile blue paint, white lettering and rule. Hover (fine pointers only) deepens to #0079e0.
- **Selected (aria-current):** sun yellow paint, navy lettering, rule stays white, tag text turns navy, NEW tag inverts to navy on yellow. Hover on selected goes to sun-dark.
- **Behaviour:** every tile is a real link to its booking flow. With script, the first tap selects and the second books; `#slug` deep links preselect.

### Order Bar and Order Slip
The counter you order at.
- **Bar:** navy, fixed bottom, 58px. Left: Oswald 700 17.5px order text (idle prompt at 82% white, then "<name> selected") with a 24px round chevron chip (14% white ground, sun chevron). Right: the BOOK NOW pill. Focus rings inside the bar turn sun yellow.
- **Slip:** a white card max 34rem wide, 2px navy border with no bottom edge, 10px top corners, rising from the bar. Contents: Anton service name, Oswald price in brand-dark, Lato promise and check-marked list.

### Buttons
- **Book pill:** sun yellow, navy Anton uppercase, full pill; 37px tall in the order bar (19px type), 50px on the voucher (21px). Hover sun-dark.
- **Primary (shared chrome):** brand-dark fill, white Lato 700 18px, full pill, 16px by 28px. Hover #005fb4.
- **WhatsApp:** wa green with navy text, same shape as primary. Used once, as the backup for the unsure.
- **Text action:** Oswald 600 uppercase 15px in brand-dark with an arrow icon (BOOK NOW inside tickets).

### Chips
- **RM20 voucher pill:** brand-dark full pill, Oswald 600 uppercase, offer and code separated by a 1px white rule; tap copies the code and the pill turns navy while confirming.
- **Code chip:** white 8px plate with the code in Anton at 0.06em tracking, and a paper COPY CODE chip in Oswald; turns sun yellow when copied.

### Set Ticket
A printed order ticket for the unsure.
- **Shape:** white body, 2px navy border, 8px corners.
- **Stub:** 76px navy column with "SET" in Oswald and the letter in Anton 44px, sun on navy, divided from the body by a 2px dashed navy perforation.
- **Body:** Anton question, Lato answer, Oswald text action.
- **Hover:** body warms to #fffbea, stub flips to sun with navy letter.

### Guarantee Band
Full-bleed navy, Anton headline in white, Lato body at 85% white, trust facts in Oswald 500 uppercase with sun line icons, divided by 20% white hairlines.

### Voucher Tile
One more tile on the wall: brand-dark plate with 8px padding and 10px corners, a 2px white inset rule with 6px corners, Anton headline, code chip, Lato terms, sun book pill.

### Navigation
The header and footer are the shared kleaner.my chrome (Lato 700 nav on white with tint hovers; navy footer with white links) and keep that link structure. The board world does not restyle them.

### Motion
- **Board power-on:** each tile animates from brightness(0.72) saturate(0.6) to full over 620ms, staggered 55ms in reading order after 80ms. Content is visible from the first frame; only brightness moves.
- **Press:** scale 0.97 over 120ms on every tappable.
- **Order text swap:** 240ms rise from 5px with opacity from 0.2.
- **Slip:** opacity 220ms and translateY(24px) to rest over 280ms; chevron rotates over 220ms.
- **Paint changes:** 160 to 180ms colour transitions.
- **Easing:** ease-out cubic-bezier(0.23, 1, 0.32, 1) everywhere; ease-in-out cubic-bezier(0.77, 0, 0.175, 1) is available.
- **Reduced motion:** power-on and slip travel are removed, scroll reveals show content immediately, colour and opacity transitions stay at 150ms.

## Do's and Don'ts

### Do:
- **Do** paint board surfaces flat in tile blue, sun or navy, with a 2px white inset rule on plates that read as tiles.
- **Do** light the chosen thing in sun yellow with navy ink, and keep yellow for selection and booking.
- **Do** letter board elements in Anton uppercase, tags and chits in Oswald, sentences in Lato.
- **Do** size tile internals in cqi so every tile keeps one composition across widths.
- **Do** draw new pictograms on the 64-unit box with a 3.4 round-capped stroke in currentColor.
- **Do** keep every tile and ticket a real link that books without script.
- **Do** use brand-dark, not tile blue, under any normal-size white text.

### Don't:
- **Don't** put shadows on tiles, tickets, the voucher tile or bands; elevation is for overlays only.
- **Don't** use gradients or glows on board surfaces.
- **Don't** return to soft white rounded service cards, stock cleaner photography or sparkle icons.
- **Don't** set body copy or small text in white on tile blue, or white on WhatsApp green.
- **Don't** set sentences in Anton.
