# Source notes

What this page is allowed to say, and where each figure came from.

Pulled on 28 September 2026.

---

## 1. The live kleaner.my site could not be read

The machine this was built on routes outbound traffic through an egress proxy
that refuses `kleaner.my` by organisation policy:

```
EGRESS_BLOCKED: Access to kleaner.my is blocked by the network egress proxy.
```

The policy is not something to route around, so no third party mirror or cache
was used as a stand in for the live site.

Two consequences:

1. **Four of six booking URLs are the front of the flow** rather than a direct
   service route. None can 404. See GO-LIVE.md step 1.
2. **Anything the brief did not state carries an `[OWNER TO CONFIRM]` note.**
   There are 8, listed in `content/OWNER-CONFIRM.md`.

---

## 2. Prices

Held in `src/data/prices.json` and asserted against `BRIEF_PRICES` in
`scripts/verify.mjs`, so neither can drift alone. Carried over from the
post-renovation site, where they came from the owner and from the kleaner.my
booking form.

| Item | Price | Unit |
| --- | --- | --- |
| Post-renovation cleaning | RM1.20 | per sqft of built-up area |
| Formaldehyde Filter | RM280 | per job |
| Air & Surface Sterilisation | RM300 | per job |
| Sofa 1 / 2 / 3 Seater / L-Shaped | RM88 / RM138 / RM168 / RM198 | per sofa |
| Mattress Single / Queen / King / Super King | RM108 / RM148 / RM168 / RM188 | per mattress |
| Carpet, four sizes | RM80 / RM110 / RM130 / RM160 | per carpet |
| Curtain / Sheer | RM68 / RM30 | per piece |

Carpet and curtain are kept in the data file although this page does not quote
them, so the file stays identical across the Kleaner sites.

### The one price the brief got wrong

The brief put Sofa & Mattress Deep Cleaning at **"from RM80"**. The booking form
has sofa from RM88 and mattress from RM108. **RM80 is the smallest carpet**, not
a sofa price.

The upholstery site already publishes "Sofa from RM88, mattress from RM108", so
this is not a judgement call: the card shows **from RM88**, computed from
`prices.json`. `npm run verify` fails the build if "from RM80" ever appears.

### RM1.20 and the no-decimals rule

House style is RM with no decimals. A per sqft rate is meaningless without them,
so `rm()` prints two decimals only when the value is not a whole ringgit, and
`verify.mjs` enforces that the rate is the only RM figure on the page carrying
a decimal point.

---

## 3. Facts stated as fact

All already published by Kleaner, or given by the owner in the brief.

- Kleaner cleans Kuala Lumpur and Selangor.
- 100,000+ cleaning hours delivered.
- Providers are background checked.
- Satisfaction guarantee: not happy, we reclean or refund.
- Anti-theft policy at `kleaner.my/kleaners-anti-theft-policy`.
- WhatsApp +60 17-477 0978. Call line +60 17-477 0010.
- Tagline: The Benchmark of Cleaning Service.
- General cleaning is by the hour, minimum 4 hours, up to 4 cleaners.

### Two claims the brief made that this page softened

**"Trained in-house team, not gig workers."** It is on the page, with a note.
What Kleaner publishes is that providers are background checked. Employment
model is a different and stronger claim, and a competitor would be entitled to
challenge it.

**"Dry in a few hours."** Not used. Drying time was already an open owner
question on the upholstery site, so the bullet reads "Left to dry after the
clean" instead.

### The tagline

The brief gave **"THE BENCHMARK IN CLEANING"**. The logo artwork in
`assets/kleaner-logo.png` has **"The Benchmark of Cleaning Service"** rendered
into it, and that is what the rest of the Kleaner sites publish. The published
one is used here, because new text beside a logo showing the old one reads as a
mistake. If the new tagline is official, it is one line in `site.ts` plus a new
logo file.

---

## 4. What is deliberately not claimed

No reading, percentage, quote, award or certification is invented anywhere. The
page never says 100 per cent anything, never says permanent or clinical, makes
no claim about viruses and no promise about anybody's health. `verify.mjs` holds
the list and fails the build on any of them.
