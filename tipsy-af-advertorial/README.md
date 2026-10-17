# TIPSY AF advertorial

A "5 reasons" listicle advertorial for cold traffic (assumed: Meta). It reuses the approved angle
from `../pineapple-martini/BRIEF.md`: the first-drink feeling, without the grey-area ingredients.
Status: **working preview, not published.**

## Brief

| | |
| --- | --- |
| Visitor | Wants to unwind or be social without alcohol or a hangover; unsure alcohol-free drinks do anything |
| Incoming promise | Assumption: an ad framed as an article ("5 reasons…"). Change the headline to match the real ad |
| Angle | You actually feel it, without kava, kratom, THC or alcohol |
| Main objection | "Buzz drinks don't work / what's in it?" → timeline chart, ingredients, mushroom-science founders, 100-day guarantee |
| Offer / action | 6-can trial $29.94 (then 12 cans for $49.80/mo + $2.99 shipping, cancel anytime) → cart → checkout |

## Section plan

| # | Reason | Evidence |
| --- | --- | --- |
| Intro | The problem with mocktails and kava/kratom drinks | Category framing |
| 1 | You feel it in 10–15 minutes | Brand timing claim, illustrated chart (labeled), customer quote |
| 2 | No hangover | Zero alcohol, customer quote |
| 3 | Nothing in a grey area | FDA-reviewed, legal in 50 states, ingredient list, "no" badges |
| Inline CTA | Trial + guarantee | |
| 4 | Serious mushroom science | Founder story, $220M company, brain wave studies, patent pending (confirmed) |
| 5 | Low-risk trial | 100-day guarantee policy, same-day shipping, customer quote |
| Offer | Flavor pick + trial terms + timeline | Shopify variants 44868866212048 / 45108737507536, plan 1777991888 |
| FAQ, disclosure | Legal/age, driving, servings | Homepage FAQ |

Kept honest on purpose: a visible "Advertisement · Paid content from TIPSY AF" label and closing
disclosure; no fake publication masthead, no invented reporter, testimonials or stats. Quotes are the
customer quotes already on gettipsy.com.

## Preview, edit, install

```sh
python3 build.py tipsy-af-advertorial
python3 -m http.server 8771 -d tipsy-af-advertorial/preview   # open http://localhost:8771
```

Shopify: add `shopify/sections/tipsy-af-advertorial.liquid`, `shopify/templates/page.tipsy-af-advertorial.json`
and the two files in `shopify/assets/` to a theme, then create a page using that template. For a cleaner
article feel, the store header can be hidden on that template.

## QA (2026-10-17)

| Check | Result | Status |
| --- | --- | --- |
| 375×667, 390×844, 1280×800: headline and ad label on first screen, no horizontal scroll | Passed | Passed |
| Chart draws on scroll; reduced motion respected | Passed | Passed |
| Live store: Blood Orange and Pineapple trial each add the starter kit at $29.94 on plan 1777991888, then go to /checkout (checkout blocked in test, cart cleared) | Passed | Passed |
| Sticky CTA hidden at top and once the offer is on screen | Passed | Passed |
| Payment, tracking, theme install | Not tested | Unverified |

Open launch gaps (shared with the other pages): Shopify trial plan still set to renew at $47.88 vs the
confirmed $49.80 + $2.99; returns policy "after the first 7 days" wording; Meta pixel / purchase tracking.

## Suggested test

Run this advertorial against the v3 home page with the same Meta ad set. Primary outcome: trial starts
per landing-page session (from Shopify orders, not clicks). Hypothesis: an article format that answers
"does it work / what's in it" before the offer lifts trial starts from colder audiences.
