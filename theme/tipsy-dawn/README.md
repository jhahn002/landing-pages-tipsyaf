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

## Push

```sh
cd theme/tipsy-dawn
shopify theme push --theme 138833887440 --password "$SHOPIFY_CLI_THEME_TOKEN" --store "$SHOPIFY_FLAG_STORE"
```

Pull first if anyone has edited the theme in the editor (`config/settings_data.json` and
`templates/*.json` change there).

## Migration plan

1. **Base** — fresh Dawn + font library. ✅
2. **Control product page** — move the live home page (`templates/index.json` on the live theme:
   `703a-hero-banner`, `703-hero-banner-mobile`, `704-features`, `705-scroll-bar`,
   `706-product-imagery`, `pm-offer-selector`, `707-two-column-images`, `708-experience-v2`,
   `709-founders`, `710-ugc`, `pm-flavour-drop`) into a product template, looking the same as it
   does today, so new versions can be tested against it.
3. **Home page** — rebuild the v3 landing page (`tipsy-af-v3`) as editable sections.
4. **Product page variants** on Dawn's `main-product`.
5. **Collections, contact, FAQ, subscription** and the other pages.
6. **Header/footer, cart, tracking** — see the checklist below — then QA and publish.

## Tracking and apps to carry over

From the live theme's `config/settings_data.json` (app embeds) and sections:

- [ ] Klaviyo onsite embed (app embed)
- [ ] Alia (app embed)
- [ ] Triple Whale pixel (app embed)
- [ ] Stape conversion tracking / GTM (app embed)
- [ ] Intelligems A/B testing (app embed)
- [ ] US consent bar (app embed)
- [ ] Klaviyo newsletter form + `_learnq` identify/track in `sections/712-footer.liquid`
- [ ] Check **Settings → Customer events** in the Shopify admin. Pixels installed there are
      store-wide and keep working with any theme.

App embeds are switched on per theme (**Theme settings → App embeds**), so each one has to be
turned on in this theme before it goes live.
