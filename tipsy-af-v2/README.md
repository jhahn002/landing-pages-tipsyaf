# TIPSY AF landing page, v2 (design exploration)

Same page content, offer, Mix option and cart wiring as `../tipsy-af`, in a new visual system
modeled on loopearplugs.com. It borrows Loop's layout and design approach, not its wording,
images or brand assets. Status: **working preview, not published.**

## What was borrowed from Loop, and how it maps

| Loop pattern | TIPSY v2 |
| --- | --- |
| Calm white page, warm light-grey rounded panels, charcoal text and pill buttons, one bright accent | White / `#f4f3f1` panels / `#222124` ink / TIPSY yellow `#ffe748` as the only accent |
| Geometric sans in sentence case, tight tracking, mostly regular weights | Figtree (free Google font) as a stand-in for a licensed brand sans; see ASSETS.md |
| Rounded hero media card with copy on it | Hero card: photo on top and copy below on phones; copy left, photo right on desktop |
| Grey product cards: small label chip, product cutout, price, short line, dark + outline buttons | "Pick your cocktail": Blood Orange, Pineapple Martini, The Mix |
| "A decade of scientific research" checklist panel | "A decade of mushroom science": patent pending, FDA-reviewed, brain wave studies, $220M |
| "Best for…" lifestyle cards with a chip and an overlaid title | "For the moments you'd usually pour a drink" (stand-in photos for now) |
| Centered founders photo with a short caption | "A father and son. One better buzz." |
| "Worn by you" UGC carousel | "Tried by you" review cards (UGC video once available) |
| Row of trust stats | 10–15 min · Zero alcohol, kava, kratom, THC · 100-day guarantee · Same-day shipping |
| Giant condensed statement above the footer | "The first-drink feeling. Zero booze." in Coolvetica |

Left out on purpose, per the landing-page rules: small eyebrow labels above headlines, "01 02 03"
style numbering, star ratings and review counts we can't verify, and up-right arrows.

New to this version: a drawn experience curve in the page's own style, replacing the blue chart image.
It is labeled as an illustration.

## Preview and edit

```sh
python3 build.py tipsy-af-v2                        # from the repo root
python3 -m http.server 8767 -d tipsy-af-v2/preview  # then open http://localhost:8767
```

Installs like the other pages, using `shopify/sections/tipsy-af-meta-v2.liquid` and
`shopify/templates/page.tipsy-af-meta-v2.json`. Mix setup is the same as `../tipsy-af/README.md`.

## QA record (2026-10-14)

| Check | Result | Status |
| --- | --- | --- |
| First screen shows headline, photo, CTA and terms at 375×667, 390×844 and 1280×720 | CTA fully visible | Passed |
| No horizontal scroll at 375, 390, 1280 | 0px overflow (product-card overflow found and fixed) | Passed |
| Figtree and Coolvetica load | Passed | Passed |
| Flavor cards preselect flavor, option labels and trial timeline update, mix split shows | Passed | Passed |
| Sticky CTA hidden at top, shown mid-page, hidden from the buy box down | Passed | Passed |
| Live cart, all 6 flavor × option combos, plus Mix wiring with stand-in IDs (cart cleared after) | Correct variants and plans; cart drawer opened | Passed |
| Checkout, tracking, theme install | Not tested | Unverified |

Open launch gaps are the same as `../tipsy-af/README.md`: Shopify trial plan renews at $47.88 vs. the
confirmed $49.80 + $2.99, the returns policy's 7-day cancellation wording, the mixed products, tracking
and the safety FAQ.
