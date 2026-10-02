# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Households and small businesses in Kuala Lumpur and Selangor who need cleaning (or moving) done and want to book it quickly, mostly on a phone. Typical arrivals: someone who just finished a renovation, someone with a stained sofa or mattress, someone who wants regular help at home, someone moving house. They land from ads, the vehicle wrap (www.kleaner.my), WhatsApp shares and the kleaner.my "Cleaning Services" menu.

## Product Purpose

services.kleaner.my is the one page that lists every Kleaner service and sends the visitor straight into that service's booking flow. Success is a tap through to booking (owner confirmed: booking is the one action; WhatsApp is the backup for the unsure).

## Positioning

Kleaner is a Klang Valley cleaning company with 100,000+ cleaning hours delivered, a trained in-house team (not gig workers), and a reclean-or-full-refund guarantee on every service. One operator covers the whole job: standard, deep and move in/out cleaning, post-renovation, formaldehyde removal, aircond maintenance, sofa and mattress, curtain and carpet, and movers.

## Operating Context

- kleaner.my runs on BookingKoala, which cannot host custom pages, so this is a standalone static site like movers., upholstery. and postreno.kleaner.my. Header and footer link back to kleaner.my with absolute URLs.
- Booking links: standard, deep and move in/out cleaning open kleaner.my/booknow/; post-renovation and formaldehyde use /booknow/post-renovation; aircond /booknow/aircond-servicing; sofa, mattress, curtain and carpet /booknow/upholstery-cleaning; movers /booknow/movers. The board shows no prices.
- Contact: WhatsApp +60 17-477 0978 (primary), call line +60 17-477 0010. Hours Monday to Sunday, 7:30 AM to 6:00 PM.

## Capabilities and Constraints

- Astro 7 static output, Tailwind CSS 4, no client framework. Deployed on Cloudflare Pages (project kleaner-services).
- Services and prices are data driven: `src/data/services.ts`, `src/data/prices.json`, helpers in `src/data/site.ts`. No price is typed into markup.
- `npm run verify` enforces banned claims (no 100 per cent anything, nothing permanent or clinical, no virus claims, no health promises), no em dashes, and price integrity (sofa from RM88, never RM80).
- English only for now; copy lives in `src/data/copy/services.en.ts` so BM and ZH can follow.
- House style: Malaysian English, short sentences, second person, no exclamation marks, no em dashes, RM with no decimals except the RM1.20 per sqft rate.
- Owner decision (2 Oct 2026): every claim on the page is confirmed as written; the public [OWNER TO CONFIRM] notes come off the page.

## Brand Commitments

- Logo: blue #0088F8 lowercase "kleaner" wordmark with tagline beneath; supplied file at `assets/kleaner-logo.png` (still carries "The Benchmark of Cleaning Service"; the owner's newer wording is "The Benchmark in Cleaning").
- Brand blue #0088F8; #0071D1 for filled buttons (AA with white text).
- Motto "Your home, our honour".
- Keep the kleaner.my header and footer link structure so the page reads as part of Kleaner.

## Evidence on Hand

- 100,000+ cleaning hours delivered.
- Reclean or full refund guarantee.
- Background checked, trained in-house team.
- Anti-theft policy at kleaner.my/kleaners-anti-theft-policy.
- Prices in `prices.json` (post-reno RM1.20/sqft, formaldehyde filter RM280, air and surface sterilisation RM300, sofa from RM88, mattress from RM108).
- RM20 first-booking voucher KLEANERHOME, one use per customer, valid to 31 December 2026, redeemable via kleaner.my/booknow.
- No customer photos, testimonials, ratings counts or awards are on hand in this repo. Do not invent any.

## Product Principles

1. One tap from need to booking; every element either helps choose or helps book.
2. State only what is true and published; prices come from the data file.
3. Mobile first: most visitors arrive on a phone from an ad or a share.
4. Feels like Kleaner: same blue, same logo, same menus as kleaner.my.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard order (card is the anchor, no nested interactive elements), content visible under prefers-reduced-motion. Lighthouse mobile 100 is the current bar.
