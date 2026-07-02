# Ecommerce Shopping Cart Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/shopping-cart-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-shopping-cart-pages`
- Goal: replace the shared `commerce-cart-page` placeholder with three dedicated cart page variants based on the captured Tailwind examples.

## Reference captures

- Desktop: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/tailwind-shopping-cart-pages-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/tailwind-shopping-cart-pages-mobile-390.png`
- Local before desktop: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/local-shopping-cart-pages-before-desktop.png`
- Local before mobile: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/local-shopping-cart-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/local-shopping-cart-pages-after-desktop.png`
- Local after mobile: `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/local-shopping-cart-pages-after-mobile-390.png`

## Implemented examples

- With related products -> `commerce-cart-related-products-page`
- Simple with policy grid -> `commerce-cart-simple-policy-page`
- With policy grid and extended summary -> `commerce-cart-extended-summary-page`

## Implementation notes

- Added three dedicated Shopping Cart Pages preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Preserved the generic `commerce-cart-page` renderer for unrelated components/templates.
- Recreated the captured Tailwind page rhythm with top ecommerce navigation, cart rows, order summary, related products, policy grid, footer, and extended summary differences.
- Generated six fresh assets for this page leaf under `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-cart-pages/`.
- Used preview-specific generated image sets instead of reusing existing `ecommerce-shopping-carts` component assets.
- Imagegen provenance is recorded in `docs/research/assets/ecommerce-shopping-cart-pages-hero-level-rework-2026-07-02/shopping-cart-pages-imagegen-provenance.md`.

## Verification

- `cd examples/ui-vocabulary-site; npm run build` -> passed.
- `cd examples/ui-vocabulary-site; npm run audit:visuals` -> passed. Result: 527 terms, 527 variants, fallback variants 6, generic renderer 0, shared variants 0.
- `cd examples/ui-vocabulary-site; npm run lint` -> passed with only pre-existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` -> passed. Result: 527 terms.
- Chrome smoke on local route -> passed with 3 expected headings, 13 cart asset references, all six expected generated assets present, and 0 broken image tags.
- `git diff --check` on touched Shopping Cart Pages files -> passed with only the existing LF/CRLF warning for `App.tsx`.

