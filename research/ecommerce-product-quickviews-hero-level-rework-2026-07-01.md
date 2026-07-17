# Product Quickviews Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-quickviews`
- Local route: `/?filter=nav%3Aplus-ecommerce-product-quickviews`
- Goal: replace the shared generic `commerce-product-page` preview with four Product Quickviews variants based on fresh Tailwind desktop/mobile captures and preview-specific generated product imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/tailwind-product-quickviews-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/tailwind-product-quickviews-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/tailwind-product-quickviews-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/local-product-quickviews-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/local-product-quickviews-mobile-390.png`

## Tailwind Examples

- `With color and size selector`
- `With color selector, size selector, and details link`
- `With large size selector`
- `With color selector and description`

## Implementation Notes

- Added four dedicated Product Quickviews variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Product Quickviews example title to its own preview variant instead of the old shared `commerce-product-page`.
- Matched the Tailwind reference around a large quickview/modal surface, product image column, color selector, size selector, price, CTA, optional detail link, and optional description/details rows.
- Mobile preview adjustments:
  - title row, price, color metadata, and size grid stack within the modal.
  - size buttons use 2 columns on narrow screens, then expand at larger breakpoints.
  - measured mobile `scrollWidth=390` with zero right-edge offenders.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another preview or leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-product-quickviews/color-size-backpack.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-quickviews/details-link-tote.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-quickviews/large-size-sling.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-quickviews/description-pouch.png`

Provenance: `docs/research/assets/ecommerce-product-quickviews-hero-level-rework-2026-07-01/product-quickviews-imagegen-provenance.md`

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and four visible example names.
- Chrome local route smoke:
  - found all four Product Quickviews titles.
  - loaded four local Product Quickviews image references from four preview-specific asset files.
  - unique local Product Quickviews asset count: 4.
  - desktop horizontal overflow: false.
- Mobile CDP smoke at 390px:
  - `document.documentElement.scrollWidth`: 390.
  - right-edge overflow offenders: 0.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.
