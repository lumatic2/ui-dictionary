# Product Overviews Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-overviews`
- Local route: `/?filter=nav%3Aplus-ecommerce-product-overviews`
- Goal: replace the shared generic `commerce-product-page` preview with five Product Overviews variants based on fresh Tailwind captures and preview-specific generated product imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/tailwind-product-overviews-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/tailwind-product-overviews-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/tailwind-product-overviews-mobile-390.png`
- Local Chrome viewport: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/local-product-overviews-chrome-viewport.png`
- Local desktop: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/local-product-overviews-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/local-product-overviews-mobile-390.png`

## Tailwind Examples

- `With image grid`
- `With tiered images`
- `With image gallery and expandable details`
- `Split with image`
- `With tabs`

## Implementation Notes

- Added five dedicated Product Overviews preview variants in `examples/ui-vocabulary-site/src/App.tsx`:
  - `commerce-overview-image-grid`
  - `commerce-overview-tiered-images`
  - `commerce-overview-gallery-details`
  - `commerce-overview-split-image`
  - `commerce-overview-tabs`
- Mapped every Product Overviews example title to its own preview variant.
- Kept the older `commerce-product-page` renderer for unrelated legacy routes, but removed it from this leaf.
- Desktop previews now follow the Tailwind visual classes: image grid, tiered image column, gallery with expandable detail rows, split image, and tabbed details.
- Mobile previews stack product media and purchase controls without the previous placeholder blocks.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/image-grid-backpack.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/tiered-sling-bag.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/gallery-duffel.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/split-tote.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/tabs-pouch.png`

Provenance: `docs/research/assets/ecommerce-product-overviews-hero-level-rework-2026-07-01/product-overviews-imagegen-provenance.md`

Note: the `With image grid` and gallery previews reuse their own preview-specific product image across internal crops/thumbnails. The current rule is one fresh generated image per preview, not one generated image per internal thumbnail.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and five visible example names.
- Chrome local route smoke:
  - found all five Product Overviews titles.
  - loaded 14 local product images from five preview-specific asset files.
  - desktop horizontal overflow: false.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.

