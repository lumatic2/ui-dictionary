# Comboboxes Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/comboboxes`
- Local route: `/?filter=nav%3Aplus-forms-comboboxes`
- Goal: replace one generic `combobox-page` preview with 4 dedicated Comboboxes variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/tailwind-comboboxes-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/tailwind-comboboxes-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/tailwind-comboboxes-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/tailwind-comboboxes-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/local-comboboxes-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/local-comboboxes-desktop.png`
- Local after mobile: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/local-comboboxes-mobile.png`
- Local full desktop: `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/local-comboboxes-full-desktop.png`

## Implementation Notes

- Added 4 `combobox-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Comboboxes example title to a distinct local preview variant.
- Kept generic `combobox-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple opened combobox list
  - dark combobox with status indicators
  - combobox with avatar image
  - combobox with secondary text

## Image Assets

Generated a fresh avatar asset for the `With image` combobox preview with built-in `image_gen`.

Project asset:

- `examples/ui-vocabulary-site/public/assets/comboboxes/leslie-alexander-avatar.png`

Source/provenance:

- `docs/research/assets/forms-comboboxes-hero-level-rework-2026-07-01/leslie-alexander-avatar-provenance.md`

Rule carried forward: this avatar is specific to the Comboboxes `With image` preview. Future image-backed previews should generate their own purpose-fit imagery rather than reusing this asset.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Simple`
  - `With status indicator`
  - `With image`
  - `With secondary text`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 4 Comboboxes titles.
  - confirmed `/assets/comboboxes/leslie-alexander-avatar.png` loaded at 1254 x 1254.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 2645.
