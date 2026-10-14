# "Your 5pm glass" landing page

A landing page for people whose evening glass of wine has become the default and who want the
wind-down without the alcohol. It's the first of the "What brings you here?" pages proposed from the
category Voice of Customer report.

Status: **working preview on the unpublished theme, not published.**

- Theme: TIPSY Dawn Rebuild (`#138833887440`), template `theme/tipsy-dawn/templates/page.evening-glass.json`
- Preview (shown on an existing page with `?view=`):
  https://tipsyaf.myshopify.com/pages/returns-refunds-policy?view=evening-glass&preview_theme_id=138833887440
- To give it its own address: in Shopify admin, **Online Store → Pages → Add page** (e.g. title "Your 5pm
  glass", handle `5pm`), choose template **evening-glass**, save. It only shows on the live site once
  this theme is published.

## Brief

| | |
| --- | --- |
| Product and primary action | TIPSY AF zero proof cocktail; open the checkout flow (Quantity → Flavors → Customize → checkout), 6-pack trial selected |
| Visitor | Someone who reaches for a glass of wine at the end of the day and wants that wind-down without alcohol |
| Incoming promise | **Assumption:** the home page row "My 5pm glass of wine" (or an ad on the same idea). No ad copy was supplied |
| Angle | Keep the 5pm ritual, change what's in the glass: same time, same glass, a drink you can feel in 10–15 minutes that tastes like a cocktail |
| Supporting evidence | Category research: the evening / end of day is the largest named occasion and wine is the drink most often replaced (VoC report). TIPSY facts: zero alcohol, felt in about 10–15 min, about an hour per can, 30 / 35 calories, cocktail flavors |
| Main objection | "Will I actually feel anything?" (felt-nothing is the category's most-endorsed complaint) → timeline + "How the hour feels" chart + TIPSY customer quotes + 100-day money-back guarantee |
| Offer | 6-pack trial $29.94, then 12 cans every month for $49.80 + $2.99 shipping; 12-pack auto ship $49.80; 12-pack one time $60.00 |
| Brand | Figtree + Instrument Serif italic headline, Coolvetica condensed, charcoal / TIPSY yellow, store photography |

Why the trial and not auto ship is selected to start: these visitors haven't tried TIPSY yet, and the
trial is the lower commitment. Auto ship is offered in the flavor step's savings nudge.

## Section plan

| Customer question | Section | Evidence or asset |
| --- | --- | --- |
| What is this, and is it for my 5pm? | Hero: "Your 5pm glass. Minus the wine." + Try 6 cans | Supplied photo of a Blood Orange pour into a wine glass (`assets/evening-glass-hero.webp`, 1120×957): whole image above the text on phones, right-hand panel from 50% on desktop |
| How does it fit my evening? | Steps: pour it like a drink, feel it in 10–15 min, done in about an hour | Brand copy and FAQ timings |
| Will I feel it, and how? | How the hour feels (illustrated curve) | Brand experience chart, labeled as an illustration |
| How does it compare with what I drink now? | Comparison: TIPSY AF vs glass of wine vs NA wine | Category facts (see notes below) |
| Does it work for others? | In their own words (4 quotes) | TIPSY customer quotes already on gettipsy.com |
| Which flavor? | Two cocktails. Zero proof. | Can renders, calories |
| How do I buy? | Buy box "Start with 6" → checkout flow | Live products, plans and prices |
| What if it's not for me? | Guarantee card | Returns & Refunds policy |
| Anything else? | FAQ (taste, feeling, servings, driving, trial, ingredients) | Brand FAQ copy |

## Sources (accessed 2026-10-14)

| Finding | Type | Source | Limit | Use |
| --- | --- | --- | --- | --- |
| Evening / end of day is the most-named occasion (88 of 170 reviews naming one); wine replaced 10× more than beer | Category research | `Feel-Something NA Drinks: Voice of Customer` (supplied PDF) | Competitors' Amazon reviews, sample balanced by star rating; not TIPSY customers | Angle only, not on the page |
| Felt nothing / weak is the most-endorsed complaint | Category research | Same | Same | Objection the page answers |
| Felt in ~10–15 min, ~1 hour per can, have another to keep it going | Official copy | gettipsy.com home page FAQ and "7 reasons" page | Individual experience varies | Steps, FAQ |
| 30 cal (Blood Orange), 35 cal (Pineapple), ingredients | Official | Nutrition / ingredient copy in the live theme | — | Lineup, FAQ, comparison |
| Trial $29.94 w/ plan 1777991888; auto ship $49.80 w/ plan 1778024656; one time $60.00 | Official | `/products/<handle>.js` for the six products | Checked today | Buy box (read live from products) |
| $2.99 shipping on renewals | Existing site copy | Previous TIPSY pages | **Not checked at checkout** | Hero terms, FAQ |
| Customer quotes (Dominic H., Carolyn L., Jack M., Shelli M.) | TIPSY customer experiences | Quotes already used on gettipsy.com (`/pages/pineapple-martini`, product page banner) | Not re-verified against the review platform (Okendo API returned no reviews) | Reviews collage |
| 100-day money-back guarantee, opened cans OK | Official policy | `/pages/returns-refunds-policy` (updated 11/11/2025) | **Conflicts** with a newer guarantee text in the theme (Feb 17, 2026), see gaps | Guarantee card, FAQ |

Comparison chart notes: "A feeling you notice" for wine is alcohol's effect; NA wine "Zero alcohol"
is Varies because many non-alcoholic wines contain up to 0.5% ABV; "No hangover" for wine is Varies;
"Under 40 calories" is No for wine (a standard glass is well above 40) and Varies for NA wine.

## QA record (2026-10-14)

| Check | Result | Status |
| --- | --- | --- |
| Renders at 390×844, 375×667, 1280×720; no horizontal page scroll | Passed | Passed |
| Hero CTA visible on first screen | Bottom of the pill at 838/844 (phone), 661/667 (short), 629/720 (desktop). The stock Dawn header takes ~100px | Passed, tight on phones |
| Comparison chart fits a 375px phone without sideways scroll (3 columns) | 375/375 | Passed (fixed in this round) |
| Home page comparison (6 columns) still scrolls with the hint | 680 wide in 375 | Passed |
| Hero CTA → Quantity (trial selected) → Flavors → Customize → checkout | Cart had 1× 6 Pack Pineapple Martini Starter Kit [Deliver every month] $29.94, then went to /checkout (stubbed in the test); test cart cleared | Passed |
| JavaScript errors | None (errors seen only with the test's checkout stub, which also caught Shopify's own checkout scripts) | Passed |
| Guarantee and FAQ links | All point to `/pages/returns-refunds-policy` | Passed |
| Payment, order events, tracking on this page | Not tested | Unverified |

## Launch gaps

1. **Guarantee terms conflict.** The live Returns & Refunds page says every order (subscriptions
   included) and cancel anytime after the first 7 days. The newer guarantee text in the theme says
   first order only, one case, renewals excluded. The page stays general until this is settled.
2. **"Cancel anytime".** The shared buy box / checkout terms still say it; the policy says after the
   first 7 days. This page's hero and FAQ leave it out.
3. **$2.99 renewal shipping** not checked at checkout.
4. **Page handle** has to be created in Shopify admin (above). The preview borrows the returns page,
   so its browser tab title reads "Returns & Refunds Policy".
5. **Header and footer** are still stock Dawn (whole theme).
6. **Mixed 12-packs** still rely on the "Flavors" order note until Mix products exist (whole theme).

## Next test

Hypothesis: visitors who choose "My 5pm glass of wine" buy more when they land on this page than when
they land on the home page. Send that row's clicks (or an evening-wine ad) to this page vs. the home
page, with the same offer; primary outcome orders per visitor, guardrail refund rate. Decide the
sample size and window before reading results.
