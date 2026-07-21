# Application UI / Elements / Avatars hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/avatars`
- Local route: `/?filter=nav%3Aplus-application-elements-avatars`
- Leaf target: 11 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/tailwind-avatars-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/tailwind-avatars-mobile-390.png`
- Local before desktop: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/local-before-avatars-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/local-before-avatars-mobile-390.png`
- Local after desktop: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/local-avatars-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/local-avatars-after-mobile-390.png`

## Reference Observations

- Examples: `Avatar group stacked bottom to top`, `Circular avatars`, `Rounded avatars`, `Circular avatars with top notification`, `Rounded avatars with top notification`, `Circular avatars with bottom notification`, `Rounded avatars with bottom notification`, `Circular avatars with placeholder icon`, `Circular avatars with placeholder initials`, `Avatar group stacked top to bottom`, `With text`.
- The reference is image-backed: most examples use real face avatars in small row/group layouts.
- The important differences are circular versus rounded shape, top versus bottom status dots, stacked group direction, placeholder icon/initial variants, and the text label row.
- Mobile keeps compact avatar rows; slight horizontal crop at the preview edge is part of the Tailwind rhythm for some rows.

## Implementation

- Replaced the shared `element-avatar-page` mapping for this leaf with dedicated variants:
  - `avatar-group-bottom-top`
  - `avatar-circular`
  - `avatar-rounded`
  - `avatar-circular-top-notification`
  - `avatar-rounded-top-notification`
  - `avatar-circular-bottom-notification`
  - `avatar-rounded-bottom-notification`
  - `avatar-placeholder-icon`
  - `avatar-placeholder-initials`
  - `avatar-group-top-bottom`
  - `avatar-with-text`
- Kept the older generic `element-avatar-page` renderer for the Application UI Elements overview.
- Matched Tailwind-like compact avatar rows, group stacks, dark placeholder panel, slate initials, status dots, and text label row.

## Imagegen Policy

- This leaf is image-backed because the Tailwind reference uses real face avatars.
- Generated one fresh Avatars-specific contact sheet and copied it into `examples/ui-vocabulary-site/public/assets/avatars/`.
- Provenance: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/avatars-imagegen-provenance.md`
- Placeholder icon and initials examples remain code-native and do not add decorative raster images.

## Smoke

- Capture smoke JSON: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/avatars-capture-smoke.json`
- Local smoke JSON: `docs/research/assets/application-avatars-hero-level-rework-2026-07-02/local-avatars-smoke.json`
- Result:
  - Tailwind desktop/mobile found 11/11 expected names.
  - Local desktop/mobile found 11/11 expected names.
  - Local desktop/mobile rendered 61 avatar sheet background crops.
  - Local desktop/mobile horizontal overflow: `false`.
  - Local desktop/mobile element overflow list: empty.
