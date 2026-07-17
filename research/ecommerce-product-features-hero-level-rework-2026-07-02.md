# Product Features Hero-Level Rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-features`
- Local route: `/?filter=nav%3Aplus-ecommerce-product-features`
- Goal: replace the shared generic `commerce-product-page` preview with nine Product Features variants based on fresh Tailwind desktop/mobile captures and preview-specific generated product imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/tailwind-product-features-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/tailwind-product-features-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/tailwind-product-features-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/local-product-features-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/local-product-features-mobile-390.png`

## Tailwind Examples

- `With image grid`
- `With header, images, and descriptions`
- `With fading image`
- `With wide images`
- `With split image`
- `With tabs`
- `With alternating sections`
- `With square images`
- `With tiered images`

## Implementation Notes

- Added nine dedicated Product Features variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Product Features example title to its own preview variant instead of the old shared `commerce-product-page`.
- Matched the Tailwind reference around image grids, centered header with descriptions, fading image hero, wide image rows, split image layout, tabbed details, alternating sections, square image cards, and tiered image layout.
- Preserved the long vertical rhythm of `wide images`, `alternating sections`, and `tiered images` while removing mobile `aspect-ratio + min-height` overflow.
- Mobile CDP smoke found `scrollWidth=390` and zero right-edge offenders after making large image minimum heights `md:` scoped.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another preview or leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/image-grid-backpack.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/header-descriptions-desk.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/fading-image-carafe.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/wide-images-linen.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/split-image-coffee.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/tabs-desk-lamp.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/alternating-weekender.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/square-images-jars.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-product-features/tiered-images-accessories.png`

Provenance: `docs/research/assets/ecommerce-product-features-hero-level-rework-2026-07-01/product-features-imagegen-provenance.md`

Note: repeated crops inside a single preview may reuse that preview's own generated product image to preserve the layout rhythm. The rule remains one fresh generated asset per preview, not one generated asset per repeated crop.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and nine visible example names.
- Chrome local route smoke:
  - found all nine Product Features titles.
  - loaded 23 local Product Features image references from nine preview-specific asset files.
  - unique local Product Features asset count: 9.
  - desktop horizontal overflow: false.
- Mobile CDP smoke at 390px:
  - `document.documentElement.scrollWidth`: 390.
  - right-edge overflow offenders: 0.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.
