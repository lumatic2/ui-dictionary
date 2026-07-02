# Category Previews Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-previews`
- Local route: `/?filter=nav%3Aplus-ecommerce-category-previews`
- Goal: replace the shared generic `commerce-list-page` preview with six Category Previews variants based on fresh Tailwind captures and preview-specific generated category imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/tailwind-category-previews-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/tailwind-category-previews-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/tailwind-category-previews-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/local-category-previews-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/local-category-previews-mobile-390.png`

## Tailwind Examples

- `Three-column`
- `With image backgrounds`
- `With background image and detail overlay`
- `Three-column with description`
- `With scrolling cards`
- `With split images`

## Implementation Notes

- Added six dedicated Category Previews variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Category Previews example title to its own preview variant.
- Kept the older `commerce-list-page` renderer for unrelated legacy routes, but removed it from this leaf.
- Desktop previews now cover three-column cards, image background cards, detail overlay, descriptive category cards, horizontal scrolling cards, and split image composition.
- Mobile previews stack the category cards into stable one-column layouts, with horizontal scrolling preserved for the scrolling-card variant.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/three-column-desk-accessories.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/image-backgrounds-travel-bags.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/detail-overlay-ceramics.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/three-column-description-textiles.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/scrolling-cards-lighting.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-previews/split-images-paper-goods.png`

Provenance: `docs/research/assets/ecommerce-category-previews-hero-level-rework-2026-07-01/category-previews-imagegen-provenance.md`

Note: repeated cards inside a single preview may reuse that preview's own category image to preserve Tailwind-like rhythm. The rule remains one fresh generated asset per preview, not one generated asset per repeated card.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and six visible example names.
- Chrome local route smoke:
  - found all six Category Previews titles.
  - loaded 17 local category images from six preview-specific asset files.
  - unique local Category Previews asset count: 6.
  - desktop horizontal overflow: false.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.

