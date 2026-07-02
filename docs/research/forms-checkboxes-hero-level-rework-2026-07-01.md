# Checkboxes Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/checkboxes`
- Local route: `/?filter=nav%3Aplus-forms-checkboxes`
- Goal: replace one generic `checkbox-page` preview with 4 dedicated Checkboxes variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/tailwind-checkboxes-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/tailwind-checkboxes-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/tailwind-checkboxes-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/tailwind-checkboxes-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/local-checkboxes-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/local-checkboxes-desktop.png`
- Local after mobile: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/local-checkboxes-mobile.png`
- Local full desktop: `docs/research/assets/forms-checkboxes-hero-level-rework-2026-07-01/local-checkboxes-full-desktop.png`

## Implementation Notes

- Added 4 `checkbox-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Checkboxes example title to a distinct local preview variant.
- Kept generic `checkbox-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - list with description
  - list with inline description
  - list with checkbox on right
  - simple list with heading

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: checkbox inputs, text descriptions, bordered option rows, and a fieldset heading.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `List with description`
  - `List with inline description`
  - `List with checkbox on right`
  - `Simple list with heading`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 4 Checkboxes titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 1919.
