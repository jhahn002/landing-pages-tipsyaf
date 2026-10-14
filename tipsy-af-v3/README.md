# TIPSY AF landing page, v3 (bold UI)

Same offer, Mix option and cart wiring as `../tipsy-af`, rebuilt around the UI elements liked on
Loop's mobile site: a big hero image, use-case rows with a quiz, campaign cards and strong
product shots. Status: **working preview, not published.**

## Sections

| Section | What it does | Loop element it borrows |
| --- | --- | --- |
| Hero | Full-height photo, "Zero proof. *Real feeling.*" (sans + serif italic), floating product pill card to the trial | Paris Hilton hero with product pill |
| Campaign cards | Swipeable cards: "Feel it in 10 minutes", "Zero hangover", "Can't pick? Get both". Glowing condensed type; each pill preselects that flavor | "Sleep through anything" carousel |
| What brings you here? | Rows: After work, Nights out, Cutting back, Sober curious, Hosting. Tapping opens a short pitch and "Our pick", which fills the buy box | "What brings you here?" rows |
| Help me choose | 2-question quiz (taste, how often) → a match → fills the buy box | "Help me choose" |
| The lineup | Dark rounded carousel: Blood Orange, Pineapple, The Mix with big can renders and color glow | "Loop essentials" |
| The buzz is real | Condensed headline + collage of review tiles and photos + "Join them" | "14 million fans" + UGC collage |
| Mushroom science. Zero grey area. | Exploded-style can with ingredients on one side and struck-through "not in it" on the other, how it works, proof points, "Find my match" | "Designed for comfort" exploded view |
| What one can feels like | Dark card with the drawn experience curve (labeled as an illustration) | — |
| Founder | Photo + "I think I just reverse engineered alcohol." in serif italic | Founders block |
| Buy box, FAQ, statement band | Same purchase logic as earlier versions | — |

Kept from the landing-page rules: no star ratings or fan counts we can't verify (Loop's
"14 million fans" has no TIPSY equivalent yet), no eyebrow labels, no 01/02 numbering.

When the Mix products aren't set up on the store, every Mix element hides and the "Our pick"
recommendations that use the Mix switch to Blood Orange automatically.

## Update 2026-10-14 (round 2)

- **Checkout flow:** every main button (hero, campaign pills, use-case picks, quiz, "Join them",
  comparison, buy box, sticky bar, closing band) opens a full-screen, app-style checkout:
  1. Flavor & plan → 2. Add-ons (one-time 12-packs, with an optional rewards progress bar) →
  3. Review with the trial timeline. "Checkout" adds everything to the cart in one request and goes
  straight to `/checkout`.
- **Rewards bar:** off on the store until you fill the **Checkout rewards** setting in the theme
  editor (e.g. `75:Free shipping|110:Free gift`). Create the matching automatic discounts in Shopify
  first; the bar only displays progress. The preview shows example rewards, labeled as examples.
- **Comparison chart:** TIPSY AF vs. mocktails vs. kava & kratom, highlighted yellow column,
  checks animate in. "Varies" where it depends on the brand or state.
- **Buy box:** round flavor selectors and size & plan cards (Bev-style); its button continues to
  the add-ons step with the choice kept.
- **Lineup:** each can centered with the next one peeking in.
- **How it works:** three short steps and proof badges instead of a paragraph.
- **Chart:** cleaner grid and labels; the line draws itself when it scrolls into view (skipped if the
  visitor has reduced motion turned on).

## Files

- `assets/`: can cutouts made from the white-background shots on gettipsy.com (WebP, transparent).
  The build embeds them in the preview (so `preview/index.html` works as a single downloaded file)
  and copies them to `shopify/assets/`; upload those to the theme's assets with the section.
- Fonts: Figtree (sans) and Instrument Serif (italic headline), both free Google Fonts, plus your
  Coolvetica for condensed type.

## Preview and edit

```sh
python3 build.py tipsy-af-v3
python3 -m http.server 8768 -d tipsy-af-v3/preview   # open http://localhost:8768
```

Install: add `shopify/sections/tipsy-af-meta-v3.liquid`, `shopify/templates/page.tipsy-af-meta-v3.json`
and both files in `shopify/assets/` to the duplicate theme.

## QA record (2026-10-14)

| Check | Result | Status |
| --- | --- | --- |
| Hero product pill fully on the first screen at 375×667 and 390×844; hero text clear of the product at 1280×720 | Passed | Passed |
| No horizontal page scroll at 375, 390, 1280 (fixed: hidden labels escaping the lineup carousel) | 0px | Passed |
| Campaign and lineup carousels swipe; progress bars follow | Passed | Passed |
| Use-case "Our pick" fills flavor + pack and moves to the buy box | Passed | Passed |
| Quiz: opens as a modal, focus moves into it, 2 questions → match → fills the buy box; Escape and backdrop close it | Passed | Passed |
| Store mode without Mix IDs: Mix hidden everywhere, picks fall back to Blood Orange, quiz shows 2 flavors | Passed | Passed |
| Live cart, all 6 flavor × option combos plus Mix wiring with stand-in IDs (test cart cleared) | Correct variants and plans, cart drawer opened | Passed |
| Sticky CTA hidden at top, shown mid-page, hidden from the buy box down | Passed | Passed |
| Checkout flow on the live theme: BO trial; PM auto ship + BO 12-pack; BO 12-pack + PM 12-pack + BO 12-pack (checkout page blocked by the test, cart cleared) | Cart lines, plans and totals matched ($29.94, $109.80, $180.00); went to /checkout each time | Passed |
| Quiz, use-case picks, campaign pills and sticky bar open the flow with the right flavor and plan | Passed | Passed |
| Comparison checks and chart draw animate on scroll; no horizontal scroll at 375/390/1280 | Passed | Passed |
| Payment, order events, tracking, theme install | Not tested | Unverified |

Open launch gaps: same as `../tipsy-af/README.md`, plus the assets below.
