# Ecommerce Category Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/category-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-category-pages`
- Goal: replace the shared `commerce-list-page` placeholder with five dedicated visual variants that follow the captured Tailwind Category Pages examples.

## Reference captures

- Desktop: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/tailwind-category-pages-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/tailwind-category-pages-mobile-390.png`
- Local before desktop: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/local-category-pages-before-desktop.png`
- Local before mobile: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/local-category-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/local-category-pages-after-desktop.png`
- Local after mobile: `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/local-category-pages-after-mobile-390.png`

## Implemented examples

- With text header and image product grid -> `commerce-category-text-image-grid`
- With image header and detail product grid -> `commerce-category-image-detail-grid`
- With text header and simple product grid -> `commerce-category-text-simple-grid`
- With product grid and pagination -> `commerce-category-grid-pagination`
- With large images and filters sidebar -> `commerce-category-large-sidebar`

## Implementation notes

- Added five dedicated Category Pages preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Preserved the generic ecommerce renderer for other routes; Category Pages now branches before that fallback.
- Recreated the captured Tailwind structures with page-level category navigation, toolbar/sort controls, sidebar filters, product grids, pagination, and footer rhythm.
- Generated fresh images for this leaf instead of reusing assets from Storefront Pages or Product Pages.
- Public assets live in `examples/ui-vocabulary-site/public/assets/ecommerce-category-pages/`.
- Imagegen provenance is recorded in `docs/research/assets/ecommerce-category-pages-hero-level-rework-2026-07-02/category-pages-imagegen-provenance.md`.

## Verification

- `cd examples/ui-vocabulary-site; npm run build` -> passed.
- `cd examples/ui-vocabulary-site; npm run audit:visuals` -> passed. Result: 527 terms, 527 variants, fallback variants 6, generic renderer 0, shared variants 0.
- `cd examples/ui-vocabulary-site; npm run lint` -> passed with only pre-existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` -> passed. Result: 527 terms.
- Chrome smoke on local route -> passed with 5 headings, 37 category images, 0 broken images, and all five expected generated assets present.

