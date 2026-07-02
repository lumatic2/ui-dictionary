# Radio Groups Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/radio-groups`
- Local route: `/?filter=nav%3Aplus-forms-radio-groups`
- Goal: replace one generic `radio-group-page` preview with 12 dedicated Radio Groups variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/tailwind-radio-groups-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/tailwind-radio-groups-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/tailwind-radio-groups-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/tailwind-radio-groups-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/local-radio-groups-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/local-radio-groups-desktop.png`
- Local after mobile: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/local-radio-groups-mobile.png`
- Local full desktop: `docs/research/assets/forms-radio-groups-hero-level-rework-2026-07-01/local-radio-groups-full-desktop.png`

## Implementation Notes

- Added 12 `radio-group-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Radio Groups example title to a distinct local preview variant.
- Kept generic `radio-group-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple list
  - simple inline list
  - list with description
  - list with inline description
  - list with radio on right
  - simple list with radio on right
  - simple table
  - list with descriptions in panel
  - color picker
  - cards
  - small cards
  - stacked cards

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: radio inputs, tables, swatches, and card selection states.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed all 12 current Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 12 Radio Groups titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 5041.
