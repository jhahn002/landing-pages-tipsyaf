# TIPSY AF landing page (Meta traffic, brand level)

The brand-level version of the Meta landing page, modeled on the gettipsy.com homepage. It
uses the angle approved for the Pineapple Martini page (see `../pineapple-martini/BRIEF.md`)
but sells TIPSY AF with a choice of flavors, as the homepage does. It reuses assets from
`/pages/pineapple-martini`. Status: **working preview, not published.**

## How it differs from the homepage

| Homepage | This page | Why |
| --- | --- | --- |
| First phone screen: headline and copy, no price or button | Headline on the photo, then 3 facts, the $29.94 trial button and renewal terms | Cold Meta traffic sees the offer and next step without scrolling |
| Lifestyle images of people (several AI-generated per their filenames) | Product photos only; the homepage's ice-bucket product shot as hero | Generated people shouldn't stand in for real customers |
| "World's first" claim | Left out | Not among the claims confirmed |
| FAQ says three servings per can | One can is one serving | Confirmed 2026-10-13 |
| Trial reminder day 25 / renewal $49.80 + $2.99 | Same (per your answers) | Shopify plan still renews at $47.88; see gaps |
| Buy box at mid-page | Flavor cards near the top preselect the flavor in the buy box; sticky "Try it" bar on phones | Shorter path to purchase |
| Kava/kratom positioning in the badge marquee only | A dedicated "Between feels like nothing and what's in this?" section | The approved angle |

## Section plan

| Customer question | Section | Evidence / asset |
| --- | --- | --- |
| What is it, what does it cost? | Hero: homepage headline, "first-drink feeling" pill, facts, trial CTA, terms | Ice-bucket product shot, Dominic Harris quote |
| Which one? | Two flavors: Blood Orange (fan favorite) and Pineapple Martini (new) | Flavor can shots, calories |
| Will I feel it? | Timeline: hits quick, peaks ~20 min, stack, zero recovery | Homepage "What you will experience" chart, Carolyn Lockwood quote |
| Why not a mocktail or kava/kratom? | Comparison (no competitor names) | Brand facts |
| How does it work and what's in it? | Mushroom science (3 steps), zero-ingredient icons, per-flavor ingredients and nutrition | Homepage copy and icons; patent pending, FDA-reviewed, brain wave studies (confirmed) |
| Who's behind it? | Founder note, Josh Hahn | Homepage photo and copy, $220M (confirmed) |
| Does it work for others? | Three more reviews | Reviews on /pages/pineapple-martini |
| How do I buy? | Flavor picker + trial / auto ship / one-time, trial timeline | Shopify variant and plan data |
| What if I don't like it? | Guarantee, FAQ | Returns policy, homepage FAQ |

## Preview and edit

```sh
python3 build.py tipsy-af                      # from the repo root, after any change in src/
python3 -m http.server 8766 -d tipsy-af/preview  # then open http://localhost:8766
```

Variant IDs live on the option inputs in `src/page.html`: `data-variant-bo`, `data-variant-pm`
and `data-plan`. The trial terms appear in the hero, trial timeline and FAQ: change all three
together. Install steps are the same as in `../pineapple-martini/README.md`, using
`shopify/sections/tipsy-af-meta.liquid` and `shopify/templates/page.tipsy-af-meta.json`.

## QA record (2026-10-14)

| Check | Viewport / action | Result | Status |
| --- | --- | --- | --- |
| First screen shows headline, product, price, CTA | 375×667, 390×844, 1280×720 | CTA fully visible on all three (preview header included) | Passed |
| No horizontal scroll | 375, 390, 1280 | 0px overflow | Passed |
| Brand fonts load | all | Passed | Passed |
| Flavor card "Choose" preselects flavor and moves focus to it | 375 | Pineapple selected and focused | Passed |
| Option switch updates button label and trial timeline | 375 | Passed | Passed |
| Sticky CTA: hidden at top, shown mid-page, hidden at buy box and below, including direct jumps | 375 | Passed (bug fixed in both pages) | Passed |
| Real cart add on live theme, all 6 flavor × option combos (test browser, cart cleared after) | 390 | Blood Orange and Pineapple: trial $29.94 plan 1777991888; auto ship $49.80 plan 1778024656; one-time $60.00 no plan; cart drawer opened each time | Passed |
| Trial renewal price matches copy | Shopify plan data | Plan renews at **$47.88**; page says $49.80 + $2.99 shipping | **Failed** |
| Checkout, payment, order events, Meta pixel, consent | — | Not tested | Unverified |
| Installed as a Shopify template | — | Not installed | Unverified |

## Launch gaps

1. **Trial renewal price**: Shopify plan 1777991888 renews at $47.88, but the page says $49.80/mo + $2.99 shipping.
2. **Cancellation wording**: the returns policy says "after the first 7 days"; the page says "cancel anytime".
3. **Hero image**: the ice-bucket shot is AI-generated (per its filename). It shows the real can, but a real photo would be safer for ads review and trust.
4. **Mixed trial**: the trial is one flavor. Mixing applies to subscriptions in the account, which is how the page words it. Confirm that's right.
5. **Tracking**: confirm Meta PageView, AddToCart (on cart add, not click) and Purchase fire for this page, with consent respected.
6. **Safety FAQ**: there's no answer yet on mixing with alcohol or medication, or on pregnancy.
