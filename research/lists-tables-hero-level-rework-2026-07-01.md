# Tables Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/lists/tables`
- Local route: `/?filter=nav%3Aplus-application-lists-tables`
- Goal: replace one generic `table-page` preview with 19 dedicated table variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/tailwind-tables-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/tailwind-tables-desktop.png`
- Tailwind mobile: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/tailwind-tables-mobile.png`
- Tailwind full desktop: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/tailwind-tables-full-desktop.png`
- Tailwind full crops: `tailwind-tables-full-part1.png` through `tailwind-tables-full-part5.png`
- Local before desktop: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/local-tables-before-desktop.png`
- Local after desktop: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/local-tables-desktop.png`
- Local after mobile: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/local-tables-mobile.png`
- Local full desktop: `docs/research/assets/lists-tables-hero-level-rework-2026-07-01/local-tables-full-desktop.png`

## Implementation Notes

- Added 19 `table-list-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind Tables example title to a distinct local preview variant.
- Kept generic `table-page` for older shared surfaces, but removed it from this leaf.
- Implemented separate structures for:
  - basic Users table, dark card table, full-width/constrained table
  - striped rows, uppercase headings, stacked/hidden mobile columns
  - avatar + multiline dark table
  - sticky header, vertical line, condensed transaction table
  - sortable headings, grouped rows, invoice summary rows
  - bordered plan table, checkbox table, hidden-heading recent activity, full-width avatar activity table

## Image Assets

Generated fresh avatar assets for this leaf with built-in `image_gen`; originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`.

Project assets:

- `examples/ui-vocabulary-site/public/assets/tables/lindsay-walton.png`
- `examples/ui-vocabulary-site/public/assets/tables/courtney-henry.png`
- `examples/ui-vocabulary-site/public/assets/tables/tom-cook.png`
- `examples/ui-vocabulary-site/public/assets/tables/whitney-francis.png`
- `examples/ui-vocabulary-site/public/assets/tables/leonard-krasner.png`
- `examples/ui-vocabulary-site/public/assets/tables/floyd-miles.png`

Rule carried forward: preview imagery is leaf-specific. Tables does not reuse Stacked Lists avatars even though some visible names overlap.

## Verification

- Chrome reference capture confirmed all 19 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `badge.tsx`, `tabs.tsx`, `button.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 19 Tables titles.
  - `/assets/tables/*` images loaded with `complete: true`, natural size 256 x 256.
  - horizontal overflow: false.
