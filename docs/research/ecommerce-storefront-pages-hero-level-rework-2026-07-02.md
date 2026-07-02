# Ecommerce Storefront Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/storefront-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-storefront-pages`
- Visible examples: 4
  - With dark nav and footer
  - With offers and testimonials
  - With image tiles and feature sections
  - With overlapping image tiles and perks

## Reference Captures

- Tailwind desktop full: `docs/research/assets/ecommerce-storefront-pages-hero-level-rework-2026-07-02/tailwind-storefront-pages-full-desktop.png`
- Tailwind desktop top: `docs/research/assets/ecommerce-storefront-pages-hero-level-rework-2026-07-02/tailwind-storefront-pages-desktop-top.png`
- Tailwind mobile 390: `docs/research/assets/ecommerce-storefront-pages-hero-level-rework-2026-07-02/tailwind-storefront-pages-mobile-390.png`

## Local Captures

- Local desktop: `docs/research/assets/ecommerce-storefront-pages-hero-level-rework-2026-07-02/local-storefront-pages-desktop.png`
- Local mobile 390: `docs/research/assets/ecommerce-storefront-pages-hero-level-rework-2026-07-02/local-storefront-pages-mobile-390.png`

## Implementation Notes

- Replaced the Storefront Pages leaf mapping from one reused `commerce-storefront-page` preview to four dedicated page-level variants:
  - `commerce-storefront-dark-nav`
  - `commerce-storefront-offers-testimonials`
  - `commerce-storefront-image-tiles`
  - `commerce-storefront-overlap-perks`
- Kept the generic `commerce-storefront-page` renderer intact because templates and overview cards still reference it.
- Each Storefront preview now renders as a full ecommerce page with nav, hero, merchandising sections, product/category grids, perks, and footer.
- Preview-specific images are project-local generated bitmap assets under `examples/ui-vocabulary-site/public/assets/ecommerce-storefront-pages/`.
- During review, a wrong magenta isometric image was caught in the first local desktop capture and replaced with fresh apparel/knitwear/stationery assets before final capture.

## Verification

- `npm run build` in `examples/ui-vocabulary-site`: pass
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms, 527 variants, fallback variants 6, generic renderer variants 0, shared variants 0
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, `tabs.tsx`
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms
- Chrome extension smoke:
  - all 4 expected example titles present
  - 35 storefront page images observed
  - 7 unique `ecommerce-storefront-pages` assets loaded
  - bad image count 0
  - horizontal overflow offenders 0

