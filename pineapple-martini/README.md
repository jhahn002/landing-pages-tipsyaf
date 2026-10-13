# Pineapple Martini landing page (Meta traffic)

A Shopify page template for TIPSY AF Pineapple Martini, built for cold Meta traffic.
Brief, angle and sources: [BRIEF.md](BRIEF.md). Status: **working preview, not published.**

## Files

| Path | What it is |
| --- | --- |
| `src/page.html`, `src/page.css`, `src/page.js` | The page. Edit these. |
| `build.py` | Builds the preview and the Shopify files from `src/` |
| `preview/index.html` | Local preview with a stand-in header/footer. The buy button shows what it *would* add instead of posting to a cart. |
| `shopify/sections/tipsy-pineapple-martini-meta.liquid` | Generated Shopify section (do not edit by hand) |
| `shopify/templates/page.pineapple-martini-meta.json` | Page template that uses the section |
| `qa/` | Screenshots from the checks below |

## Preview and edit

```sh
cd pineapple-martini
python3 build.py                       # after any change in src/
python3 -m http.server 8765 -d preview # then open http://localhost:8765
```

Images and fonts load from the live gettipsy.com CDN, so the preview needs internet access.

Prices, variant IDs and selling plan IDs live on the three radio inputs in `src/page.html`
(`data-variant`, `data-plan`, `data-label`) and in the visible copy next to them. The trial
terms also appear in the hero, the trial timeline and the FAQ — change all four together.

## Install on Shopify (needs your approval; not done)

1. Duplicate the live theme (Online Store → Themes → ⋯ → Duplicate) and work on the copy.
2. Edit code on the copy: add `sections/tipsy-pineapple-martini-meta.liquid` and
   `templates/page.pineapple-martini-meta.json` with the contents from `shopify/`.
3. Online Store → Pages → Add page, title e.g. "Pineapple Martini" (handle such as
   `pineapple-martini-try`), template `page.pineapple-martini-meta`. Leave the page hidden
   or only on the unpublished theme until checked.
4. Preview the duplicate theme on a phone; run the launch checks below; then publish and
   repeat them on the final live URL before pointing Meta ads at it.

The section expects the theme asset `lemonmilk-bold.woff2` (present in the current theme)
and the Dawn `<cart-drawer>`. Without the drawer it falls back to `/cart`.

## QA record (2026-10-13)

| Check | Viewport / action | Result | Status |
| --- | --- | --- | --- |
| First screen shows product, promise, price, CTA | 375×667, 390×844, 1280×720 | CTA fully visible on all three (preview header included) | Passed |
| No horizontal scroll | 375, 390, 1280 | 0px overflow | Passed |
| Brand fonts load | all | LEMON MILK, Sofia Pro, Coolvetica loaded | Passed |
| Option switch updates button label and trial timeline | 375 | Trial / auto ship / one-time labels correct; timeline only on trial | Passed |
| Keyboard: arrow keys change option, focus ring visible | 375 | Passed | Passed |
| CTA jump moves focus to purchase heading | 375 | Focus on "Get your Pineapple Martini" | Passed |
| Sticky CTA hidden at top, shown mid-page, hidden at purchase section and below, inert when hidden | 375 | Passed | Passed |
| Preview buy button reports correct item | trial, one-time | variant/plan IDs correct | Passed |
| Real cart add on live theme (section injected into gettipsy.com in a test browser, cart cleared after) | trial | 6 Pack Starter Kit, $29.94, plan 1777991888, drawer opened | Passed |
| Same | auto ship | 12 Pack Auto Ship, $49.80, plan 1778024656, drawer opened | Passed |
| Same | one-time | 12 Pack, $60.00, no plan, drawer opened | Passed |
| Trial renewal price matches copy | Shopify plan data | Plan renews at **$47.88**; page says $49.80 + $2.99 shipping | **Failed — see launch gaps** |
| Checkout, payment, order events | — | Not tested (no orders placed) | Unverified |
| Meta pixel / Shopify customer events, consent behaviour | — | No account access | Unverified |
| Installed as a Shopify template on a theme | — | Not installed | Unverified |

## Launch gaps

1. **Trial renewal price.** Shopify selling plan 1777991888 charges $47.88 on renewal; the page (per homepage) says $49.80/mo + $2.99 shipping. Fix the plan in Shopify/Loop or change the copy.
2. **Cancellation wording.** Page says "cancel anytime" (as confirmed); the returns policy says cancel "after the first 7 days". Update the policy page so they agree.
3. **Image resolution.** Hero (388px), founders photo (336px) and martini shot (402px) are low-res uploads and look soft on phones. Send originals at 1200px+ wide; the hero should be a tall portrait like the current one.
4. **Tracking.** Confirm the Meta pixel / Conversions API fires PageView, AddToCart (on cart add, not click) and Purchase for this page, with consent respected.
5. **Safety FAQ.** No answer yet for mixing with alcohol or medication, or pregnancy. Recommended before scaling spend.
