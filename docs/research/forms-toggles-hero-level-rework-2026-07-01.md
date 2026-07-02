# Toggles Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/toggles`
- Local route: `/?filter=nav%3Aplus-forms-toggles`
- Goal: replace one generic `toggle-page` preview with 5 dedicated Toggles variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/tailwind-toggles-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/tailwind-toggles-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/tailwind-toggles-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/tailwind-toggles-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/local-toggles-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/local-toggles-desktop.png`
- Local after mobile: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/local-toggles-mobile.png`
- Local full desktop: `docs/research/assets/forms-toggles-hero-level-rework-2026-07-01/local-toggles-full-desktop.png`

## Implementation Notes

- Added 5 `toggle-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Toggles example title to a distinct local preview variant.
- Kept generic `toggle-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple toggle
  - short toggle
  - toggle with icon
  - left label with description in a dark panel
  - right label

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: switch controls, icon state, label placement, and a dark panel state.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Simple toggle`
  - `Short toggle`
  - `Toggle with icon`
  - `With left label and description`
  - `With right label`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 5 Toggles titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 1597.
