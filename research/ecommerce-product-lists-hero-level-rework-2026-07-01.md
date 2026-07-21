# Product Lists Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-lists`
- Local route: `/?filter=nav%3Aplus-ecommerce-product-lists`
- Goal: replace the shared generic `commerce-list-page` preview with eleven Product Lists variants based on fresh Tailwind captures and preview-specific generated product imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/tailwind-product-lists-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/tailwind-product-lists-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/tailwind-product-lists-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/local-product-lists-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/local-product-lists-mobile-390.png`

## Tailwind Examples

- `With inline price`
- `Simple`
- `With CTA link`
- `With color swatches and horizontal scrolling`
- `With tall images`
- `With image overlay and add button`
- `With tall images and CTA link`
- `With border grid`
- `With supporting text`
- `With inline price and CTA link`
- `Card with full details`

## Implementation Notes

- Added eleven dedicated Product Lists preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Product Lists example title to its own local preview variant.
- Kept the older `commerce-list-page` renderer for unrelated legacy routes, but removed it from this leaf.
- Desktop previews now cover the Tailwind visual classes: inline price grid, simple grid, CTA link, horizontal scrolling with swatches, tall images, image overlay add action, tall image CTA, border grid, supporting text, inline price CTA, and full-detail cards.
- Mobile previews collapse to one-column product cards or horizontal scroll where that is the actual reference pattern.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/inline-price-notebook.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/simple-ceramic-cup.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/cta-link-desk-tray.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/swatches-beanie.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/tall-images-apron.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/overlay-task-lamp.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/tall-cta-carafe.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/border-grid-cork-block.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/supporting-text-pencil-case.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/inline-price-cta-pencils.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-lists/full-details-card-wallet.png`

Provenance: `docs/research/assets/ecommerce-product-lists-hero-level-rework-2026-07-01/product-lists-imagegen-provenance.md`

Note: product grid previews reuse their own preview-specific product image across repeated cards to preserve the Tailwind-like list rhythm. The current rule is one fresh generated image per preview, not one generated image per repeated card.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and eleven visible example names.
- Chrome local route smoke:
  - found all eleven Product Lists titles.
  - loaded 43 local product images from eleven preview-specific asset files.
  - unique local Product Lists asset count: 11.
  - desktop horizontal overflow: false.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.

