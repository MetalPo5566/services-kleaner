---
name: Kleaner Services
description: Every Kleaner service as a super-app service menu; find your group, tap the photo tile, book.
colors:
  brand: "#0088f8"
  brand-dark: "#0071d1"
  brand-hover: "#005fb4"
  brand-ink: "#006abf"
  page: "#f7f9fc"
  raised: "#fdfeff"
  tint: "#eef3f9"
  pill: "#e6edf5"
  line: "#dbe4ee"
  navy: "#0b2747"
  ink: "#46586f"
  panel-text: "#e3efff"
  footer-heading: "#8fcbff"
  brand-ink-dark: "#4fb0ff"
  page-dark: "#0a131f"
  raised-dark: "#101c2b"
  tint-dark: "#142336"
  pill-dark: "#1a2c42"
  line-dark: "#22364e"
  navy-dark: "#e8f0f9"
  ink-dark: "#a8b7ca"
typography:
  display:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 9.6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  display-wide:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 4.6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  figure:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  body-card:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
  label-small:
    fontFamily: "'Reddit Sans', 'Reddit Sans Fallback', ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  tile: "24px"
  thumb: "16px"
  pill: "999px"
spacing:
  gutter: "16px"
  gutter-wide: "32px"
  tile-gap: "12px"
  tile-gap-wide: "16px"
  tile-pad: "20px"
  panel-pad: "24px"
  group-gap: "40px"
  group-gap-wide: "72px"
  container: "1216px"
components:
  button-primary:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.raised}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-line-hover:
    backgroundColor: "{colors.tint}"
  button-on-blue:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-on-blue-hover:
    backgroundColor: "{colors.panel-text}"
  group-pill:
    backgroundColor: "{colors.pill}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 17.6px"
    height: "44px"
  group-pill-current:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.raised}"
  launcher-tile:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.navy}"
    typography: "{typography.label-small}"
    rounded: "{rounded.tile}"
    padding: "12px 4px 13.6px"
  launcher-tile-hover:
    backgroundColor: "{colors.pill}"
  photo-card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "20px"
  wide-row:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
  blue-panel:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.panel-text}"
    rounded: "{rounded.tile}"
    padding: "24px"
  close-band:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "28px 24px"
---

# Design System: Kleaner Services

## Overview

**Creative North Star: "The Super-App Service Menu"**

The page borrows the home screen grammar Klang Valley visitors already use every day in Grab and Touch 'n Go: services grouped by need, shown as big thumb-reach photo tiles, each one a direct tap into booking. A row of round photo launchers names the four groups, a sticky strip of pills follows the scroll and lights the group in view, and each group below is laid out in its own arrangement so the page reads as a menu of distinct places rather than a column of equal cards.

The material is soft and friendly but disciplined. One blue does every job, from the filled button to the lit pill to the moving panel. Surfaces are cool off-white in light and deep blue-black in dark, stepped by tone rather than by shadow. Corners come from one system: 24px on every tile and photo, full pills on every control. Real photography of the Kleaner team fills every tile and is never written on. Type is a single family, Reddit Sans, carried from heavy 800 headlines down to 400 body. Motion is limited to a fade up on scroll and a small press on tap.

This world replaces the earlier counter board system (condensed display faces, yellow, order bar). None of that vocabulary carries forward.

**Key Characteristics:**
- One accent: Kleaner blue, in four steps, and nothing else that competes with it.
- Tonal surfaces (page, raised, tint, pill, line) that invert cleanly for the dark scheme.
- One radius system: 24px tiles and photos, full pills for controls, circles for launcher photos.
- Reddit Sans only, weights 400, 500, 700 and 800.
- Phosphor regular icons, one weight, drawn in currentColor.
- Real photography in every tile, never text on top of a photo.
- Each service group in its own layout family.

## Colors

A single cool blue family on cool off-white, with navy for headings and slate for reading text.

### Primary
- **Kleaner Blue** (#0088f8): the brand anchor, carried by the logo lockup. The interface never paints white text on it because it does not reach AA; it uses the deeper steps below.
- **Button Blue** (#0071d1): every filled button, the lit group pill, the moving panel, the focus ring, text selection and the input caret. AA with white text, so it is the only blue that carries a label on a fill.
- **Pressed Blue** (#005fb4): hover state of filled buttons on pointer devices only.
- **Link Blue** (#006abf, dark scheme #4fb0ff): blue as text on a light or dark ground: outline button labels, group launcher icons, the 100,000+ figure and the guarantee icon.

### Neutral
- **Cool Paper** (#f7f9fc, dark #0a131f): the page ground and, at 92 per cent with a 10px blur, the sticky pill strip.
- **Raised White** (#fdfeff, dark #101c2b): the header, the dropdown and mobile menu, home cleaning cards and the two small bento tiles. Also the white used for text on blue, in place of pure white.
- **Mist Tint** (#eef3f9, dark #142336): the quiet tile ground: group launchers, after renovation rows, the tall bento tile, the WhatsApp close band, hover wash on outline buttons and menu items.
- **Pill Mist** (#e6edf5, dark #1a2c42): resting group pills and launcher hover.
- **Hairline** (#dbe4ee, dark #22364e): 1px borders on raised cards, the header underline, the proof divider.
- **Harbour Navy** (#0b2747, dark #e8f0f9): every heading and service name, launcher labels, pill labels. In dark it flips to near white.
- **Slate Ink** (#46586f, dark #a8b7ca): body text and the one plain line under each service name.
- **Panel Text** (#e3efff): the service line on the blue moving panel, and the hover of the white button that sits on it.
- **Footer Sky** (#8fcbff): footer column headings on the navy footer.

### Named Rules
**The One Blue Rule.** The page has one accent and it is Kleaner blue. Every call to action, the lit pill and the moving panel use Button Blue (#0071d1); no second hue is introduced for emphasis, status or decoration, and WhatsApp actions on this page are blue like every other action.

**The Swap The Token Rule.** Surfaces and ink are painted only through the page, raised, tint, pill, line, navy, ink and brand-ink tokens, because those are the ones the dark scheme redefines. A literal colour on a surface will not follow the system setting.

## Typography

**Display Font:** Reddit Sans (with a metric matched Arial fallback, then the system sans)
**Body Font:** Reddit Sans
**Label Font:** Reddit Sans

**Character:** One sturdy, rounded humanist sans does everything. Weight carries the hierarchy: 800 for headlines and the proof figure, 700 for service names, buttons, pills and labels, 400 for reading text. Headings sit tight (line height 1.1, tracking minus 0.02em, balanced wrapping); body opens up to a 1.65 line height.

### Hierarchy
- **Display** (800, clamp 36px to 52px on phones, 52px to 72px from 1024px, line height 1.04, tracking minus 0.03em): the hero headline only, left aligned, two lines.
- **Figure** (800, 56px, 80px from 768px, line height 1, tracking minus 0.04em, Link Blue): the 100,000+ hours number, the one numeric moment on the page.
- **Headline** (800, 28px, 40px from 768px, line height 1.1, tracking minus 0.02em): group titles and the close band title. The proof title steps up to 30px and 44px; the guarantee and mover names sit at 24px and 30px.
- **Title** (700, 20px, line height 1.2, tracking minus 0.01em): service names inside tiles. The two small bento tiles drop to 17px on phones.
- **Body** (400, 17px, 19px from 768px, line height about 1.65): hero subtext, proof and close copy, held to roughly 34rem.
- **Card line** (400, 15.5px, line height 1.5): the one plain line under each service name; 14.5px in the small bento tiles on phones.
- **Label** (700, 15px to 16px, line height 1): buttons (16px), group pills (15px), header links (15px).
- **Small label** (700, 13px, 18px from 768px, line height 1.2): launcher tile names.

### Named Rules
**The One Family Rule.** Reddit Sans is the only face. Hierarchy comes from weight (800, 700, 400) and size, never from a second family, italics, or uppercase tracking.

**The No Kicker Rule.** No eyebrow labels, section numbers or small caps over headings. A group is introduced by its title alone.

## Layout

A single centred container, 1216px wide (76rem), with a 16px gutter on phones and 32px from 768px, widened by the safe area inset when the device has a notch. Mobile first at 390px; the main breakpoints are 768px (tablet layouts of every group) and 1024px (split hero), with the full header navigation appearing at 1280px.

The page runs in a fixed order: hero, group launchers, sticky pill strip, the four groups, proof, WhatsApp close, footer. On phones the hero photo leads at a 2:1 crop with the headline and buttons under it; from 1024px the hero splits 5:7 with copy left and the photo right at 4:3, capped to the viewport height. The launcher is four columns at every width (8px gaps, 16px from 768px).

Groups are separated by 40px on phones and 72px from 768px, with titles 16px (24px) above their tiles. Tiles sit 12px apart on phones and 16px apart on wider screens. Every group and every service has its own anchor, offset so it lands below the header and pill strip (scroll margin 120px to 150px).

### Named Rules
**The Own Layout Family Rule.** Each group is arranged differently: home cleaning is a swipeable snap row of photo cards on phones (each card 80 per cent wide so the next one shows) and a 1.35:1:1 grid from 768px; after renovation is a stack of wide rows (photo, words, action); specialist care is a bento of three (one tall tile, two small ones beside it); moving is one banner of photo plus blue panel. A new group gets a new arrangement, not a copy of an existing one.

**The Thumb Reach Rule.** Every tile ends in its own action, at least 48px tall, and on phones the action spans the card or sits directly under the words.

## Elevation & Depth

Flat by default. Depth comes from tone: cool paper ground, mist tinted tiles, raised white cards with a 1px hairline. There are no shadows on tiles or buttons. The one shadow in the system is a soft ambient lift that appears on the sticky header once the page has scrolled, and under the desktop services dropdown; in the dark scheme it deepens to near black. The sticky pill strip separates itself with a 92 per cent page wash and a 10px backdrop blur instead of a shadow.

### Shadow Vocabulary
- **Soft lift** (`box-shadow: 0 1px 2px rgb(11 39 71 / 0.04), 0 10px 28px -16px rgb(11 39 71 / 0.18)`; dark `0 1px 2px rgb(0 0 0 / 0.3), 0 10px 28px -16px rgb(0 0 0 / 0.6)`): the header after scroll and the header dropdown panel only.

### Named Rules
**The Tone Not Shadow Rule.** Tiles are told apart from the ground by tint or hairline, never by a drop shadow.

## Shapes

One soft radius system. Every tile, card, row, banner, band and photo frame takes 24px. Every control (buttons, group pills, the phone button, the menu button, the skip link) is a full pill. Launcher photos are full circles, 64px on phones and 120px from 768px. Inside the header menus, the dropdown panel uses 24px and its items 16px. Photos are clipped by their tile's corners rather than rounded on their own, so photo and tile always share one silhouette. Borders are 1px hairlines on raised cards and 2px on the outline button.

### Named Rules
**The Two Corners Rule.** A shape is either a 24px tile or a full pill. No square corners, no in between radii on page content.

## Components

### Buttons
Confident full pills, one height, one weight.
- **Shape:** full pill (999px), 48px minimum height, 24px side padding, 8px gap to an icon.
- **Primary (filled):** Button Blue fill, Raised White label, Reddit Sans 700 at 16px. Used for every Book now, Get a quote and the closing WhatsApp us.
- **Outline:** 2px Button Blue border, Link Blue label, transparent fill. The secondary action in the hero (WhatsApp us, with the Phosphor WhatsApp icon at 20px).
- **On blue:** Raised White fill, Button Blue label. Only on the moving panel.
- **Hover:** pointer devices only. Filled goes to Pressed Blue, outline washes with Mist Tint, on blue goes to Panel Text. Colour transitions run 160ms on the shared ease out.
- **Press:** scale to 0.97 over 120ms on tap; removed under reduced motion.
- **Focus:** 3px Button Blue outline, 2px offset.

### Group Pills
The app's category strip.
- **Style:** Pill Mist fill, Harbour Navy label at 15px 700, 44px tall, about 18px side padding, 8px apart.
- **Current:** Button Blue fill with Raised White label, set with aria-current by an IntersectionObserver watching a band 30 to 35 per cent down the viewport. No pill is lit while the hero is in view.
- **Behaviour:** the strip sticks under the header (59px, 72px from 768px), scrolls horizontally with snap and no visible scrollbar, and slides itself so the lit pill shows. Without JavaScript the pills are plain anchor links.

### Group Launcher
- **Style:** Mist Tint tile, 24px corners, a circular group photo, a Phosphor icon in Link Blue (28px), and the group name in Harbour Navy small label.
- **Hover / Press:** Pill Mist wash on pointer devices; press scale on tap.

### Cards / Containers
- **Corner Style:** 24px, photo clipped by the tile.
- **Photo card (home cleaning):** Raised White with a 1px Hairline, a 3:2 photo (240px tall from 768px), 20px padding, service name, one line, full width Book now pinned to the bottom.
- **Wide row (after renovation):** Mist Tint, photo column of 34 per cent on phones and 300px from 768px, words beside it, action under the words on phones and at the row's end on wider screens.
- **Bento (specialist care):** the tall tile on Mist Tint with a 4:3 photo (full height from 768px, 352px minimum); the two small tiles on Raised White with a Hairline, square photos on phones and a 42 per cent side photo from 768px.
- **Blue panel (moving):** a 16:9 photo stacked over a Button Blue panel on phones; from 768px a 1.45:1 split with the panel beside the photo. Name in Raised White at 24px 800, line in Panel Text, the on blue button.
- **Close band:** Mist Tint, 28px by 24px padding (48px from 768px), title and line beside a filled WhatsApp us button on wide screens.
- **Shadow Strategy:** none; see Elevation & Depth.

### Navigation
- **Header:** sticky, Raised White with a Hairline underline, 59px tall on phones and 72px from 768px. Logo left; the kleaner.my menu (15px 700 Harbour Navy, pill shaped Mist Tint hover) from 1280px; a filled Button Blue call pill from 640px; a 48px circular menu button below 1280px. Gains the soft lift once scrolled.
- **Mobile menu:** drops under the header on Raised White, 17px 700 items in 16px rounded rows, phone pill at the bottom.
- **Footer:** the shared kleaner.my footer on Harbour Navy (#0b2747) in both schemes, white logo lockup, Footer Sky column headings, links at 80 per cent white, a white phone pill.

### Proof
Two facts only, side by side from 768px and split by a Hairline: the 100,000+ figure in Link Blue with one sentence under it, and the reclean or full refund guarantee with a 44px Phosphor seal check icon.

### Icons
Phosphor, regular weight, read from @phosphor-icons/core at build time and drawn inline at a 256 viewBox in currentColor. Sizes in use: 16, 18, 20, 26, 28 and 44px.

### Motion
- **Reveal:** tiles, proof blocks and the close band fade up 18px over 520ms on the ease out curve cubic-bezier(0.23, 1, 0.32, 1) when they enter the viewport; siblings stagger by 60ms, capped at six. Content is only hidden once the observer can run.
- **Press:** scale 0.97 over 120ms.
- **Reduced motion:** reveals are skipped entirely (everything present), press and travel are removed, smooth scrolling turns off, and only colour and opacity transitions remain at 150ms.

## Do's and Don'ts

### Do:
- **Do** use Button Blue (#0071d1) for every filled action and the lit pill, with Raised White (#fdfeff) text.
- **Do** paint surfaces and text through the swapping tokens (page, raised, tint, pill, line, navy, ink, brand-ink) so the dark scheme follows.
- **Do** give every service tile a real photograph, clipped by the tile's 24px corners.
- **Do** keep every control a full pill at least 44px tall, buttons 48px.
- **Do** give a new group its own layout family and its own anchor id.
- **Do** keep motion to the scroll reveal and the 0.97 press, and honour reduced motion.
- **Do** use Phosphor regular icons only, at one weight.

### Don't:
- **Don't** set any text, badge or button on top of a photograph.
- **Don't** introduce a second accent hue, a second typeface, or a gradient.
- **Don't** put white text on Kleaner Blue (#0088f8); it fails contrast. Use Button Blue.
- **Don't** add drop shadows to tiles or buttons; separate them by tone or hairline.
- **Don't** use eyebrow labels, section numbers or uppercase kickers over headings.
- **Don't** add proof beyond 100,000+ hours and reclean or full refund, and show no prices.
- **Don't** use em dashes or en dashes in copy.
