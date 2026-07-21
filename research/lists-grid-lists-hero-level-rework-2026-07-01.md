# Grid Lists Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/lists/grid-lists`
- Local route: `/?filter=nav%3Aplus-application-lists-grid-lists`
- Goal: replace one generic `app-example-list` preview with 7 dedicated Grid Lists variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/tailwind-grid-lists-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/tailwind-grid-lists-desktop.png`
- Tailwind mobile: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/tailwind-grid-lists-mobile.png`
- Tailwind full desktop: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/tailwind-grid-lists-full-desktop.png`
- Tailwind full crops: `tailwind-grid-lists-full-part1.png` through `tailwind-grid-lists-full-part3.png`
- Local before desktop: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/local-grid-lists-before-desktop.png`
- Local after desktop: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/local-grid-lists-desktop.png`
- Local after mobile: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/local-grid-lists-mobile.png`
- Local full desktop: `docs/research/assets/lists-grid-lists-hero-level-rework-2026-07-01/local-grid-lists-full-desktop.png`

## Implementation Notes

- Added 7 `grid-list-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind Grid Lists example title to a distinct local preview variant.
- Kept generic `app-example-list` for older shared surfaces, but removed it from this leaf.
- Implemented separate structures for:
  - contact cards with small portraits
  - dark contact cards
  - pinned project simple cards
  - horizontal link cards
  - shared-border action cards
  - dark image detail gallery
  - logo cards with invoice description list

## Image Assets

Generated fresh assets for this leaf with built-in `image_gen`; originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`.

Project assets:

- `examples/ui-vocabulary-site/public/assets/grid-lists/jane-cooper.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/cody-fisher.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/esther-howard.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/jenny-wilson.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/hill-tree.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/snow-forest.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/mountain-clouds.png`
- `examples/ui-vocabulary-site/public/assets/grid-lists/green-forest.png`

Rule carried forward: Grid Lists does not reuse avatar/photo assets from Stacked Lists or Tables. Within this leaf, the generated people and scenery assets repeat only where the reference itself repeats the same card/data pattern.

## Verification

- Chrome reference capture confirmed all 7 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, `tabs.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 7 Grid Lists titles.
  - `/assets/grid-lists/*` images loaded with `complete: true`, natural size 512 x 512.
  - horizontal overflow: false.
