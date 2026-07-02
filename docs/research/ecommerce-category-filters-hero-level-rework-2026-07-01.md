# Category Filters Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-filters`
- Local route: `/?filter=nav%3Aplus-ecommerce-category-filters`
- Goal: replace the shared generic `commerce-list-page` preview with five Category Filters variants based on fresh Tailwind desktop/mobile captures, while preserving the new rule that image-backed previews receive fresh purpose-fit generated assets.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/tailwind-category-filters-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/tailwind-category-filters-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/tailwind-category-filters-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/local-category-filters-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/local-category-filters-mobile-390.png`

## Tailwind Examples

- `With inline actions and expandable sidebar filters`
- `With centered text and dropdown product filters`
- `With dropdown product filters`
- `With expandable product filter panel`
- `Sidebar filters`

## Implementation Notes

- Added five dedicated Category Filters variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Category Filters example title to its own preview variant instead of the old shared `commerce-list-page`.
- Matched the Tailwind reference structure around `New Arrivals`, sort controls, sidebar filters, dropdown filter toolbars, expandable panels, and tall preview rhythm.
- Tailwind's current preview uses a large hatched placeholder instead of actual product photos. The local implementation keeps the hatched panel language but adds low-opacity/catalog imagery and product tiles so each preview has a distinct visual identity.
- Mobile fixes from this pass:
  - hatch product mini grid is 1 column on narrow screens, then 2/3 columns at larger breakpoints.
  - locked code CTA is hidden on mobile.
  - long example titles truncate like the Tailwind mobile reference.
  - measured mobile `scrollWidth=390` with zero right-edge offenders.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another preview or leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-category-filters/inline-sidebar-bags.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-filters/centered-dropdown-ceramics.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-filters/dropdown-product-pouches.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-filters/expandable-panel-textiles.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-category-filters/sidebar-filters-lighting.png`

Provenance: `docs/research/assets/ecommerce-category-filters-hero-level-rework-2026-07-01/category-filters-imagegen-provenance.md`

Note: repeated tiles inside a single preview may reuse that preview's own generated catalog image to preserve grid rhythm. The rule remains one fresh generated asset per preview, not one generated asset per repeated tile.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and five visible example names.
- Chrome local route smoke:
  - found all five Category Filters titles.
  - loaded 30 local Category Filters image references from five preview-specific asset files.
  - unique local Category Filters asset count: 5.
  - desktop horizontal overflow: false.
- Mobile CDP smoke at 390px:
  - `document.documentElement.scrollWidth`: 390.
  - right-edge overflow offenders: 0.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.
