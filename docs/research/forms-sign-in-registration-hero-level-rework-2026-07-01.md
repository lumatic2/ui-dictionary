# Sign-in and Registration Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms`
- Local route: `/?filter=nav%3Aplus-forms-sign-in-registration`
- Goal: replace one generic `auth-form-page` preview with 4 dedicated Sign-in and Registration variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/tailwind-sign-in-registration-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/tailwind-sign-in-registration-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/tailwind-sign-in-registration-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/tailwind-sign-in-registration-full-desktop.png`
- Tailwind full crops: `tailwind-sign-in-registration-full-part1.png` through `tailwind-sign-in-registration-full-part4.png`
- Local before desktop: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/local-sign-in-registration-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/local-sign-in-registration-desktop.png`
- Local after mobile: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/local-sign-in-registration-mobile.png`
- Local full desktop: `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/local-sign-in-registration-full-desktop.png`

## Implementation Notes

- Added 4 `auth-sign-in-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Sign-in and Registration example title to a distinct local preview variant.
- Kept generic `auth-form-page` for older shared template surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - full dark simple sign-in panel
  - no-label stacked fields with remember/forgot controls
  - split-screen auth form with a right-side desk image
  - centered card sign-in form with social buttons

## Image Assets

Generated a fresh split-screen desk asset for the `Split screen` preview with built-in `image_gen`.

Project asset:

- `examples/ui-vocabulary-site/public/assets/sign-in-registration/split-desk.png`

Source/provenance:

- `docs/research/assets/forms-sign-in-registration-hero-level-rework-2026-07-01/split-desk-provenance.md`

Rule carried forward: this image is specific to the Sign-in and Registration split-screen preview. Future image-backed previews should generate their own purpose-fit imagery rather than reusing this asset.

## Verification

- Chrome reference capture confirmed all 4 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 4 Sign-in and Registration titles.
  - confirmed `/assets/sign-in-registration/split-desk.png` loaded at 900 x 1200.
  - horizontal overflow: false.
