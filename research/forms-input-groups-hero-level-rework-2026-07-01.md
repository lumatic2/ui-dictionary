# Input Groups Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/input-groups`
- Local route: `/?filter=nav%3Aplus-forms-input-groups`
- Goal: replace one generic `input-group-page` preview with 21 dedicated Input Groups variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/tailwind-input-groups-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/tailwind-input-groups-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/tailwind-input-groups-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/tailwind-input-groups-full-desktop.png`
- Tailwind full crops: `tailwind-input-groups-full-part1.png` through `tailwind-input-groups-full-part5.png`
- Local before desktop: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/local-input-groups-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/local-input-groups-desktop.png`
- Local after mobile: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/local-input-groups-mobile.png`
- Local full desktop: `docs/research/assets/forms-input-groups-hero-level-rework-2026-07-01/local-input-groups-full-desktop.png`

## Implementation Notes

- Added 21 `input-group-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind Input Groups example title to a distinct local preview variant.
- Kept generic `input-group-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - leading/trailing add-ons and dropdown affordances
  - simple label, hidden label, corner hint, disabled, and validation error states
  - leading and trailing icons
  - add-on URL fields and inline add-on treatments
  - leading dropdown plus trailing sort button controls
  - shared-border credit card and billing fields
  - inset label, inset shared borders, overlapping label, pill shape, bottom-border, and keyboard shortcut variants

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is a control-only input-group catalog with labels, icons, borders, hints, and state styling, not photos, product imagery, screenshots, backgrounds, or illustrations.

Rule carried forward: when a future preview visibly needs imagery, generate a fresh purpose-fit imagegen asset for that individual preview. Do not reuse an image from another preview or leaf.

## Verification

- Chrome reference capture confirmed all 21 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 21 Input Groups titles.
  - horizontal overflow: false.
