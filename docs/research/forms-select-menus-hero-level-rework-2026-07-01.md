# Select Menus Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus`
- Local route: `/?filter=nav%3Aplus-forms-select-menus`
- Goal: replace one generic `select-menu-page` preview with 7 dedicated Select Menus variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/tailwind-select-menus-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/tailwind-select-menus-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/tailwind-select-menus-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/tailwind-select-menus-full-desktop.png`
- Local before desktop: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/local-select-menus-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/local-select-menus-desktop.png`
- Local after mobile: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/local-select-menus-mobile.png`
- Local full desktop: `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/local-select-menus-full-desktop.png`

## Implementation Notes

- Added 7 `select-menu-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Select Menus example title to a distinct local preview variant.
- Kept generic `select-menu-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - custom menu with avatar options
  - simple native select
  - dark custom menu
  - check-on-left menu
  - status indicator menu
  - secondary text menu
  - branded select with supported text

## Image Assets

Generated a fresh avatar asset for the `Custom with avatar` preview with built-in `image_gen`.

Project asset:

- `examples/ui-vocabulary-site/public/assets/select-menus/custom-avatar.png`

Source image:

- `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0313b75b49ee3971016a44f13abc8c81919ea151eed4c754dd.png`

Prompt/provenance notes:

- `docs/research/assets/forms-select-menus-hero-level-rework-2026-07-01/select-menu-avatar-provenance.md`

Rule carried forward: this avatar is specific to the Select Menus avatar preview. Future image-backed previews should generate their own purpose-fit imagery rather than reusing this asset.

## Verification

- Chrome reference capture confirmed the current 7 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 7 Select Menus titles.
  - confirmed `/assets/select-menus/custom-avatar.png` loaded at 256 x 256.
  - horizontal overflow: false.
