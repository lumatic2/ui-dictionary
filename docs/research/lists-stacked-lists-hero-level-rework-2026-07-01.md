# Stacked Lists Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/lists/stacked-lists`
- Local route: `/?filter=nav%3Aplus-application-lists-stacked-lists`
- Goal: replace one generic `list-page` preview with 15 dedicated stacked-list variants based on desktop/mobile Tailwind captures.

## Reference Evidence

- Tailwind desktop: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/tailwind-stacked-lists-desktop.png`
- Tailwind mobile: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/tailwind-stacked-lists-mobile.png`
- Tailwind full desktop: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/tailwind-stacked-lists-full-desktop.png`
- Tailwind full crops: `tailwind-stacked-lists-full-part1.png` through `tailwind-stacked-lists-full-part4.png`
- Local after desktop: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/local-stacked-lists-desktop.png`
- Local after mobile: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/local-stacked-lists-mobile.png`
- Local full desktop: `docs/research/assets/lists-stacked-lists-hero-level-rework-2026-07-01/local-stacked-lists-full-desktop.png`

## Implementation Notes

- Added 15 `stacked-list-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind example title to a distinct local preview variant.
- Implemented separate structures for light profile rows, dark linked rows, inline avatar groups, project rows with badges/buttons, in-card rows, two-column rows, full-width rows, constrained rows, narrow rows, sticky heading rows, action rows, truncated rows, small-avatar commit rows, and dark deployment badge rows.
- Kept `list-page` available for older generic surfaces but removed it from this Stacked Lists leaf.

## Image Assets

Generated fresh avatar assets for this leaf with built-in `image_gen`; originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`.

Project assets:

- `examples/ui-vocabulary-site/public/assets/stacked-lists/leslie-alexander.png`
- `examples/ui-vocabulary-site/public/assets/stacked-lists/michael-foster.png`
- `examples/ui-vocabulary-site/public/assets/stacked-lists/dries-vincent.png`
- `examples/ui-vocabulary-site/public/assets/stacked-lists/lindsay-walton.png`
- `examples/ui-vocabulary-site/public/assets/stacked-lists/courtney-henry.png`
- `examples/ui-vocabulary-site/public/assets/stacked-lists/tom-cook.png`

Rule carried forward: if a preview depends on people, screenshots, product photography, or other raster imagery, generate new assets for that leaf/preview instead of reusing unrelated assets. Within a Tailwind leaf, a repeated data set may share that leaf's own newly generated assets when the reference itself repeats the same people/context.

## Verification

- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `tabs.tsx`, `button.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 15 Stacked Lists titles.
  - `/assets/stacked-lists/*` images loaded with `complete: true`, natural size 256 x 256.
  - horizontal overflow: false.

## Reusable Parity Checklist

- Capture Tailwind desktop, mobile, and full-page desktop before coding.
- Crop full-page captures when the leaf is taller than one viewport.
- Implement one dedicated preview variant per Tailwind example, not one generic preview per leaf.
- Match the structural differences first: preview height, actual content width, dark/light frame, row density, card/full-width/narrow behavior, actions, badges, and truncation.
- Generate fresh raster imagery for image-bearing previews and document asset paths.
- Capture local desktop/mobile/full-page after coding.
- Run build, validator, lint, visual audit, and Chrome smoke before marking the leaf verified.
