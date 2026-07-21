# Action Panels Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/action-panels`
- Local route: `/?filter=nav%3Aplus-forms-action-panels`
- Goal: replace one generic `action-panel-page` preview with 8 dedicated Action Panels variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/tailwind-action-panels-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/tailwind-action-panels-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/tailwind-action-panels-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/tailwind-action-panels-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/local-action-panels-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/local-action-panels-desktop.png`
- Local after mobile: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/local-action-panels-mobile.png`
- Local full desktop: `docs/research/assets/forms-action-panels-hero-level-rework-2026-07-01/local-action-panels-full-desktop.png`

## Implementation Notes

- Added 8 `action-panel-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Action Panels example title to a distinct local preview variant.
- Kept generic `action-panel-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple action panel
  - link action panel
  - button on right
  - button at top right
  - toggle action panel
  - input action panel
  - simple well
  - well with secondary action

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: cards, action buttons, links, toggles, inputs, and well surfaces.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Simple`
  - `With link`
  - `With button on right`
  - `With button at top right`
  - `With toggle`
  - `With input`
  - `Simple well`
  - `With well`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 8 Action Panels titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 3367.
