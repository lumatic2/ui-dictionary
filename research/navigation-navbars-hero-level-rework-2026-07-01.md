# Navbars Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/navbars`
- Local route: `/?filter=nav%3Aplus-navigation-navbars`
- Goal: replace one generic `navbar-page` preview with 11 dedicated Navbars variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/tailwind-navbars-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/tailwind-navbars-desktop.png`
- Tailwind mobile: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/tailwind-navbars-mobile.png`
- Tailwind full desktop: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/tailwind-navbars-full-desktop.png`
- Local before desktop: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/local-navbars-before-desktop.png`
- Local after desktop: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/local-navbars-desktop.png`
- Local after mobile: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/local-navbars-mobile.png`
- Local full desktop: `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/local-navbars-full-desktop.png`

## Implementation Notes

- Added 11 `navbar-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Navbars example title to a distinct local preview variant.
- Kept generic `navbar-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple dark with menu button on left
  - dark with quick action
  - simple dark
  - simple with menu button on left
  - simple
  - with quick action
  - dark with search
  - with search
  - dark with centered search and secondary links
  - with centered search and secondary links
  - with search in column layout

## Image Assets

Generated fresh Navbars-specific avatar imagery with built-in `image_gen`, then cropped 11 separate avatar assets so each Navbars preview uses a distinct image.

Project assets:

- `examples/ui-vocabulary-site/public/assets/navbars/avatar-01.png` through `avatar-11.png`

Source/provenance:

- `docs/research/assets/navigation-navbars-hero-level-rework-2026-07-01/navbar-avatar-provenance.md`

Rule carried forward: these avatars are specific to the Navbars previews. Future image-backed previews should generate their own purpose-fit imagery rather than reusing these assets.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Simple dark with menu button on left`
  - `Dark with quick action`
  - `Simple dark`
  - `Simple with menu button on left`
  - `Simple`
  - `With quick action`
  - `Dark with search`
  - `With search`
  - `Dark with centered search and secondary links`
  - `With centered search and secondary links`
  - `With search in column layout`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 11 Navbars titles.
  - confirmed 11 distinct navbar avatar image elements loaded.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 4449.
