# New Design Concept V1 (unpublished theme)

Goal:

1. **Home page** = the v3 landing page (`tipsy-af-v3`).
2. **Current home page** moves to a **product page template** (the first product-page variant).
3. More product-page variants get added later as extra `product.*.json` templates.

Nothing here touches the live theme. The new theme stays unpublished.

## Files in this folder

| File | Goes to | What it does |
| --- | --- | --- |
| `sections/tipsy-af-meta-v3.liquid` | `sections/` | The whole v3 page as one section (built from `tipsy-af-v3/src`) |
| `assets/tipsy-can-blood-orange.webp`, `assets/tipsy-can-pineapple.webp` | `assets/` | Can cut-outs used by the section |
| `templates/index.json` | `templates/index.json` (replaces it) | Makes the v3 page the home page |

The section also uses `lemonmilk-bold.woff2`, already in the current theme's assets.

## Steps (order matters)

1. **Save the current home page as a product template first.**
   In the theme's code editor, open `templates/index.json` and copy everything. Create a new template:
   **Add a new template → product → name `home-classic`**, paste the copied JSON over its contents, and
   add a `"main"` product section if Shopify asks for one. (A product template must include the
   product information section; keep the homepage's sections, then add **Product information** in the
   customizer if it's missing.)
2. **Upload the new files:** add `sections/tipsy-af-meta-v3.liquid` and both `.webp` files under Assets.
3. **Replace `templates/index.json`** with the one in this folder.
4. In the customizer, open a product (e.g. a 12-pack) and switch its template to `product.home-classic`
   to preview the old home page as a product page.
5. **Preview** the theme (Online Store → Themes → New Design Concept V1 → ⋯ → Preview) and run the
   checks in `tipsy-af-v3/README.md` (cart add, checkout handoff) on that preview.

Rebuild after any change to `tipsy-af-v3/src`:

```sh
python3 build.py tipsy-af-v3
cp tipsy-af-v3/shopify/sections/tipsy-af-meta-v3.liquid theme/new-design-concept-v1/sections/
cp tipsy-af-v3/shopify/assets/*.webp theme/new-design-concept-v1/assets/
```

## Having Claude do it

Store access is needed (Theme Access password in the environment as `SHOPIFY_CLI_THEME_TOKEN`, store
as `SHOPIFY_FLAG_STORE`, `*.myshopify.com` allowed). Then, in a new session on this branch:

> Read `theme/new-design-concept-v1/README.md`. Using the Shopify CLI and the Theme Access credentials in
> the environment, work only on the unpublished theme "New Design Concept V1". Pull its
> `templates/index.json`, save it as a new product template `templates/product.home-classic.json`
> (adding the main product section the template needs), then push the section, the two assets and the
> new `templates/index.json` from this folder. Don't publish or touch the live theme. Give me the
> preview link for the home page and for one product using `product.home-classic`.
