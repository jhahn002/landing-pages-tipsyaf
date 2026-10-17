# TIPSY AF wine-swap landing page

Dedicated page for ads about replacing the nightly glass of wine (customer data shows many people are
looking specifically for a wine replacement). Status: **working preview, not published.**

## Brief

| | |
| --- | --- |
| Visitor | Has a glass of wine most evenings to unwind; wants the ritual without the next-morning cost |
| Incoming promise | Wine-replacement ads (exact ad copy to be matched once available) |
| Angle | "Swap the nightly glass of wine. Keep the unwind." Keep the pour, the glass and the exhale; lose the alcohol and hangover |
| Evidence | 10–15 min onset, about an hour per can, zero alcohol / no hangover, "loose, not sloppy", customer quotes |
| Main objection | "Will it be like wine?" Answered honestly: it won't taste like wine (it's a sparkling cocktail); it replaces the moment and the feeling |
| Offer / action | 6-can trial $29.94 → 12 cans $49.80/mo + $2.99 shipping; cart → checkout |

Honesty guardrails: the page says plainly it doesn't taste like wine; no wine calorie/sugar statistics;
the comparison table sticks to clearly true facts (alcohol-removed wine is under 0.5% ABV and has no
buzz; wine has alcohol and can cause hangovers).

## Sections

| Section | Customer question |
| --- | --- |
| Hero: "Swap the nightly glass of wine. Keep the unwind." | What is this, why care? |
| Your wine o'clock, with a can instead (6:00 → tomorrow) | What will the evening feel like? |
| Same glass. Different pour. | Does it fit my ritual? (and: it won't taste like wine) |
| What you keep / what you lose + wine vs alcohol-removed wine vs TIPSY AF table | What do I give up? Why not NA wine? |
| From people who made the swap | Does it work for people like me? |
| Offer: "Try it in place of tonight's glass" | How do I start? |
| FAQ: Does it taste like wine? Why not alcohol-removed wine? How many? Driving? Age? | Remaining doubts |

## Asset gap

The hero and ritual images are cocktail shots. A real photo of TIPSY AF poured into a **wine glass**
(couch, kitchen counter, dinner table at dusk) would match the ad promise much better. Same for UGC of
customers who switched from wine.

## Preview, edit, install

```sh
python3 build.py tipsy-af-wine
python3 -m http.server 8774 -d tipsy-af-wine/preview   # open http://localhost:8774
```

## QA (2026-10-17)

| Check | Result | Status |
| --- | --- | --- |
| 375×667: headline, lede and CTA on first screen; 390×844; 1280×800 | Passed | Passed |
| No horizontal scroll; comparison table readable on phones | Passed (table row gaps found and fixed) | Passed |
| Live store: both flavors add the starter kit at $29.94 on plan 1777991888 and go to /checkout (checkout blocked in test, cart cleared) | Passed | Passed |
| Payment, tracking, theme install | Not tested | Unverified |

Same open launch gaps as the other pages (trial plan renewal price in Shopify, returns-policy wording, tracking).

## Suggested test

Wine-replacement ads → this page vs. the same ads → v3 home page. Primary outcome: trial starts per session
from Shopify orders. Guardrail: refund rate in the first 30 days (watch for "expected it to taste like wine").
