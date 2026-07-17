# Ecommerce Product Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/product-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-product-pages`
- Visible examples: 5
  - With related products
  - With image grid
  - With expandable product details
  - With featured details
  - With tabs and related products

## Reference Captures

- Tailwind desktop: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/tailwind-product-pages-desktop.png`
- Tailwind mobile 390: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/tailwind-product-pages-mobile-390.png`

## Local Captures

- Local before desktop: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/local-product-pages-before-desktop.png`
- Local before mobile 390: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/local-product-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/local-product-pages-after-desktop.png`
- Local after mobile 390: `docs/research/assets/ecommerce-product-pages-hero-level-rework-2026-07-02/local-product-pages-after-mobile-390.png`

## Implementation Notes

- Replaced the Product Pages leaf mapping from one reused `commerce-product-page` preview to five dedicated page-level variants:
  - `commerce-product-related`
  - `commerce-product-image-grid`
  - `commerce-product-expandable-details`
  - `commerce-product-featured-details`
  - `commerce-product-tabs-related`
- Kept the generic `commerce-product-page` renderer intact because overview and template cards still reference it.
- Each preview now has a full product-detail page composition with nav, product media, purchase controls, reviews, related products, detail sections, and footer.
- Added fresh product-page generated assets under `examples/ui-vocabulary-site/public/assets/ecommerce-product-pages/`.
- During visual review, a miscopied magenta/isometric image was caught in `canvas-tote.png`; it was regenerated as a real tote product photo before final capture.

## Verification

- `npm run build` in `examples/ui-vocabulary-site`: pass
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms, 527 variants, fallback variants 6, generic renderer variants 0, shared variants 0
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, `tabs.tsx`
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms
- Chrome extension smoke:
  - all 5 expected example titles present
  - 32 product page images observed
  - 5 unique `ecommerce-product-pages` assets loaded
  - bad image count 0
  - horizontal overflow offenders 0

