# Ecommerce Order Detail Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-detail-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-order-detail-pages`
- Goal: replace the shared `commerce-order-page` placeholder with three dedicated order detail page variants based on the captured Tailwind examples.

## Reference captures

- Desktop: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/tailwind-order-detail-pages-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/tailwind-order-detail-pages-mobile-390.png`
- Local before desktop: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/local-order-detail-pages-before-desktop.png`
- Local before mobile: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/local-order-detail-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/local-order-detail-pages-after-desktop.png`
- Local after mobile: `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/local-order-detail-pages-after-mobile-390.png`

## Implemented examples

- With progress bars -> `commerce-order-detail-progress-page`
- With large images and progress bars -> `commerce-order-detail-large-images-page`
- Simple with full order details -> `commerce-order-detail-full-details-page`

## Implementation notes

- Added three dedicated Order Detail Pages preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Preserved the generic `commerce-order-page` renderer for unrelated overview/template usages.
- Recreated the captured Tailwind structures with order number/date, product cards, progress bars, delivery/shipping details, billing/payment/summary rows, footer, and the simplified "It's on the way!" order receipt.
- Generated fresh order-detail assets under `examples/ui-vocabulary-site/public/assets/ecommerce-order-detail-pages/`.
- Existing Order Summaries and Order History component assets were not reused.
- Imagegen provenance is recorded in `docs/research/assets/ecommerce-order-detail-pages-hero-level-rework-2026-07-02/order-detail-pages-imagegen-provenance.md`.

## Verification

- `cd examples/ui-vocabulary-site; npm run build` -> passed.
- `cd examples/ui-vocabulary-site; npm run audit:visuals` -> passed. Result: 527 terms, 527 variants, fallback variants 6, generic renderer 0, shared variants 0.
- `cd examples/ui-vocabulary-site; npm run lint` -> passed with only pre-existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` -> passed. Result: 527 terms.
- Chrome smoke on local route -> passed with 3 expected headings, 5 order-detail asset references, all three expected generated assets present, and 0 broken image tags.
- `git diff --check` on touched Order Detail Pages files -> passed with only the existing LF/CRLF warning for `App.tsx`.

