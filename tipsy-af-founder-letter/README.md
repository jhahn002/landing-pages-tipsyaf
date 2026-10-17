# TIPSY AF founder-letter advertorial

Second advertorial, testing a different approach from `../tipsy-af-advertorial` (the "5 reasons"
listicle). Status: **working preview, not published. Letter copy needs Josh's approval** since it
is written in his voice.

## How it differs from the listicle

| | Listicle | Founder letter |
| --- | --- | --- |
| Format | Article with numbered reasons | First-person letter, one narrative |
| Main argument | Feature-by-feature reasons | Trust in who made it and why |
| Hook | "5 reasons to try…" | "I think I just reverse engineered alcohol." |
| Objection handled | "Does it work / what's in it" | "Who's behind this, and why should I believe them" |
| Close | Offer after reason 5 | "Don't take my word for it" → customer quotes → trial + guarantee |

Hypothesis: for viewers skeptical of functional drinks, a founder's credible story converts better
than a list of claims. Untested.

## Sources for the letter

First-person story is adapted from the founder copy published on gettipsy.com (`/pages/pineapple-martini`
"The Origin Story" and the homepage founder block). Facts used were all confirmed earlier: $220M raised,
brain wave studies, patent pending, FDA-reviewed ingredients, 10–15 min onset, about an hour per can,
100-day guarantee, trial terms. New connective lines written for the letter (please review):

- "The part I liked was the first drink… the next morning."
- "I'd tried the alternatives. Mocktails taste like a cocktail and feel like a soda. The drinks that do give
  you a feeling usually get it from kava, kratom or THC, and that's not something I wanted to hand my friends."
- "It's not meant to knock you over."
- "I'm obviously biased, so here's what a few customers told us."

## Preview, edit, install

```sh
python3 build.py tipsy-af-founder-letter
python3 -m http.server 8772 -d tipsy-af-founder-letter/preview   # open http://localhost:8772
```

Install like the other pages: `shopify/sections/tipsy-af-founder-letter.liquid`,
`shopify/templates/page.tipsy-af-founder-letter.json` and `shopify/assets/`.

## QA (2026-10-17)

| Check | Result | Status |
| --- | --- | --- |
| 375×667, 390×844, 1280×800: headline, label and byline on first screen; no horizontal scroll | Passed | Passed |
| Live store: both flavors add the starter kit at $29.94 on plan 1777991888 and go to /checkout (checkout blocked in test, cart cleared) | Passed | Passed |
| Sticky CTA hidden at top and once the offer is on screen | Passed | Passed |
| Payment, tracking, theme install | Not tested | Unverified |

Same open launch gaps as the other pages (trial plan renewal price in Shopify, returns-policy cancellation
wording, Meta tracking).

## Suggested test

Run the founder letter and the listicle against each other on the same Meta audience. Primary outcome:
trial starts per landing-page session from Shopify orders. Watch scroll depth to the offer as a guardrail.
