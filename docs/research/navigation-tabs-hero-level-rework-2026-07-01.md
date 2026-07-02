# Tabs Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/tabs`
- Local route: `/?filter=nav%3Aplus-navigation-tabs`
- Goal: replace one generic `tabs-page` preview with 9 dedicated Tabs variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/tailwind-tabs-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/tailwind-tabs-desktop.png`
- Tailwind mobile: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/tailwind-tabs-mobile.png`
- Tailwind full desktop: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/tailwind-tabs-full-desktop.png`
- Local before desktop: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/local-tabs-before-desktop.png`
- Local after desktop: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/local-tabs-desktop.png`
- Local after mobile: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/local-tabs-mobile.png`
- Local full desktop: `docs/research/assets/navigation-tabs-hero-level-rework-2026-07-01/local-tabs-full-desktop.png`

## Implementation Notes

- Added 9 `tabs-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Tabs example title to a distinct local preview variant.
- Kept generic `tabs-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - tabs with underline
  - tabs with underline and icons
  - tabs in pills
  - tabs in pills on gray
  - tabs in pills with brand color
  - full-width tabs with underline
  - bar with underline
  - tabs with underline and badges
  - simple tabs
- Mobile previews switch to a compact select-like active tab state, matching the Tailwind mobile reference behavior.

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: labels, active tab states, icons, badges, underlines, and pill surfaces.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Tabs with underline`
  - `Tabs with underline and icons`
  - `Tabs in pills`
  - `Tabs in pills on gray`
  - `Tabs in pills with brand color`
  - `Full-width tabs with underline`
  - `Bar with underline`
  - `Tabs with underline and badges`
  - `Simple`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 9 Tabs titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 2427.
