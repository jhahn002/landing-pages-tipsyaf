# TIPSY Dawn Rebuild

A clean rebuild of the TIPSY store theme on stock **Dawn 16.0.0** (from github.com/Shopify/dawn).
On the store it is the unpublished theme **TIPSY Dawn Rebuild** (`#138833887440`).

- Preview: https://tipsyaf.myshopify.com?preview_theme_id=138833887440
- Editor: https://tipsyaf.myshopify.com/admin/themes/138833887440/editor

The live theme (**Pineapple Martini Launch v4**, `#138420682960`) is not touched by anything here.

## Ground rules

- Stock Dawn files stay stock unless there is a reason to change them. Additions get their own
  sections/snippets/assets, so Dawn updates stay easy to merge.
- No global `!important` font overrides. Fonts come from `snippets/brand-fonts.liquid` only.
- Sections are built from normal settings and blocks, so they can be edited in the theme editor.
  Products, variants and selling plans are picked in settings, not hard-coded.

## Fonts

`snippets/brand-fonts.liquid` (rendered in `layout/theme.liquid`) declares every brand font from
files in `assets/`:

| Font | Variable | Class | File(s) |
| --- | --- | --- | --- |
| League Gothic | `--font-league-gothic` | `.font-league-gothic` | `league-gothic-regular.woff2` |
| Coolvetica Compressed | `--font-coolvetica` | `.font-coolvetica` | `coolvetica-compressed-heavy.woff2` |
| Lemon Milk | `--font-lemon-milk` | `.font-lemon-milk` | `lemonmilk-{regular,medium,bold}.woff2` |
| Sofia Pro | `--font-sofia-pro` | `.font-sofia-pro` | `sofia-pro-{regular,semibold}.woff2` |
| Figtree | `--font-figtree` | `.font-figtree` | `figtree-variable.woff2` |
| Instrument Serif (+ italic) | `--font-serif` | `.font-serif`, `.font-serif-italic` | `instrument-serif-{regular,italic}.woff2` |

**Theme settings → Typography → Brand fonts** can switch Dawn's heading and body fonts to one of
these. Left on "Use font picker above", Dawn's normal font pickers apply. A font is only
downloaded when the page uses it.

## v3 sections

`sections/tpm-*.liquid` can be added to any page or product template in the theme editor.
Shared styles and script: `assets/tpm-v3.css`, `assets/tpm-v3.js` (ported from `tipsy-af-v3/src`).

| Section | What's editable |
| --- | --- |
| TIPSY hero | Phone/desktop images, headline + italic line, text, product card, terms |
| TIPSY campaign cards | Cards (image or cans, title, flavor the button picks) |
| TIPSY use cases | Rows (thumbnail, title, text, "our pick" flavor + plan), quiz button |
| TIPSY lineup | Flavor cards (tag, name, description, price line) |
| TIPSY reviews collage | Heading, two photos, up to 4 reviews with tile colors |
| TIPSY comparison chart | Heading, 6 columns, rows with Yes/No/Varies per column |
| TIPSY science | Heading, can, in/not-in lists, steps, proof points |
| TIPSY how it feels | Heading, text, chart labels, caption |
| TIPSY founder | Photo, quote, story |
| **TIPSY buy box** | Products for each flavor × plan, labels, checkout flow, quiz, sticky bar |
| TIPSY FAQ | Questions and answers |
| TIPSY statement band | Text, button |

**TIPSY buy box** must be on the page (once): it holds the checkout flow, quiz and sticky bar that
every other section's buttons open. Pick products, not IDs: for each flavor it takes the 6-pack
trial, 12-pack auto ship and 12-pack one-time products, and reads the variant, subscription plan and
price from them. The one-time 12-packs are also the add-ons. The Mix appears everywhere only once all
three Mix products are set.

## Push

```sh
cd theme/tipsy-dawn
shopify theme push --theme 138833887440 --password "$SHOPIFY_CLI_THEME_TOKEN" --store "$SHOPIFY_FLAG_STORE"
```

Pull first if anyone has edited the theme in the editor (`config/settings_data.json` and
`templates/*.json` change there).

## Migration plan

1. **Base** — fresh Dawn + font library. ✅
2. **Control product page** ✅ — `templates/product.control.json`: the live home page ("The Mood
   Boosting Stress Melting Zero Proof Cocktail") as a product template, so new versions can be
   tested against it. It has the live home page's enabled sections (`703-hero-banner-mobile`,
   `704-features`, `705-scroll-bar`, `706-product-imagery`, `707-two-column-images`,
   `708-experience-v2`, `709-founders`, `pm-flavour-drop`) and its own layout
   (`layout/control.liquid`) with the live header/footer (`sections/control-header-group.json`,
   `sections/control-footer-group.json`) and the old font override (`snippets/legacy-fonts.liquid`),
   so none of that leaks into the rest of the theme. Preview on any product with `?view=control`,
   or assign the template to a product. Full-page screenshots match the live home page to within
   0.2% of pixels.
3. **Home page** ✅ — the v3 landing page (`tipsy-af-v3`,
   https://jhahn002.github.io/landing-pages-tipsyaf/tipsy-af-v3/preview/index.html) rebuilt as 12
   editable sections (`sections/tpm-*.liquid`), in order in `templates/index.json`. See "v3 sections" below.
4. **Product page variants** on Dawn's `main-product`.
5. **Collections, contact, FAQ, subscription** and the other pages.
6. **Header/footer, cart, tracking** — see the checklist below — then QA and publish.

## Tracking and apps carried over

- [x] App embeds copied from the live theme's `config/settings_data.json`: Klaviyo onsite, Alia,
      Triple Whale, Stape conversion tracking, Intelligems, US consent bar.
- [x] Google Tag Manager `GTM-P2852HG5` (hard-coded in the live `theme.liquid`) → `snippets/gtm.liquid`,
      rendered in both layouts.
- [x] Klaviyo newsletter form + `_learnq` identify/track — inside `sections/712-footer.liquid`
      (control footer). The new theme's own footer still needs it.
- [x] Cart: compare-at strike-through (cart drawer + cart page) and 12-pack quantity buttons on the
      cart page. Cart type set to drawer, as on live.
- [ ] Check **Settings → Customer events** in the Shopify admin. Pixels installed there are
      store-wide and keep working with any theme.

App embeds are switched on per theme (**Theme settings → App embeds**). The six above are on in
this theme; any app added to the live theme later has to be switched on here too.
