# TIPSY AF "evening unwind" landing page

Targets the end-of-day glass occasion (the after-work / dinner / couch pour) without naming the drink
it replaces. Status: **working preview, not published.**

## Brief

| | |
| --- | --- |
| Visitor | Pours something most evenings to unwind; wants the ritual without the next-morning cost |
| Incoming promise | Assumption: an ad about unwinding at the end of the day without regretting it tomorrow |
| Angle | "The 6 p.m. unwind. Minus the 6 a.m. regret." Keep the pour, the glass and the exhale; change what's in it |
| Evidence | 10–15 min onset, about an hour per can, zero alcohol / no hangover, 35 calories, "loose, not sloppy", customer quotes |
| Main objection | "Will it feel like my evening drink?" → evening timeline, serving ritual, what changes vs. what stays |
| Offer / action | 6-can trial $29.94 → 12 cans $49.80/mo + $2.99 shipping (≈ $4.15/can); cart → checkout |

Copy rule for this page: the replaced drink is never named; the occasion is described instead
(end-of-day pour, your favorite glass, something to sip with dinner).

## Sections

| Section | Customer question | Evidence |
| --- | --- | --- |
| Hero | What is this, why care? | Evening product shot, angle headline, trial terms |
| Your evening, with a can instead (6:00 → tomorrow) | What will it actually feel like? | Onset/duration claims, brand "loose, not sloppy", no hangover; timing caveat |
| Make it feel like the good stuff | Does it keep the ritual? | Serving suggestions per flavor (suggestions, not claims) |
| What changes, what doesn't | What do I give up? | Zero alcohol, no hangover, 35 cal, ~1 hour; ingredients, no kava/kratom/THC, FDA-reviewed |
| Swapped and not looking back | Does it work for people like me? | Three real customer quotes from gettipsy.com |
| Offer | How do I start? | Flavor pick, trial timeline, guarantee |
| FAQ | Taste, how many, driving, age | Brand FAQ |

## Preview, edit, install

```sh
python3 build.py tipsy-af-evening
python3 -m http.server 8773 -d tipsy-af-evening/preview   # open http://localhost:8773
```

## QA (2026-10-17)

| Check | Result | Status |
| --- | --- | --- |
| 375×667: headline, lede and CTA on first screen (preview bar included); 390×844; 1280×800 | Passed (hero image height bug on desktop found and fixed) | Passed |
| No horizontal scroll; timeline reveals on scroll; reduced motion respected | Passed | Passed |
| Live store: both flavors add the starter kit at $29.94 on plan 1777991888 and go to /checkout (checkout blocked in test, cart cleared) | Passed | Passed |
| Payment, tracking, theme install | Not tested | Unverified |

Same open launch gaps as the other pages (trial plan renewal price in Shopify, returns-policy wording, tracking).

## Suggested test

Point an evening-occasion ad ("end of the day, without tomorrow's regret") at this page vs. the v3 home
page. Primary outcome: trial starts per session from Shopify orders. A strong result would suggest building
more occasion pages (dinner party, weekend afternoon).
