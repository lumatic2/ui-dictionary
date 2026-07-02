# Application UI / Navigation / Command Palettes hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/command-palettes`
- Local route: `/?filter=nav%3Aplus-navigation-command-palettes`
- Leaf target: 8 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/tailwind-command-palettes-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/tailwind-command-palettes-mobile-390.png`
- Local before desktop: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/local-command-palettes-before-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/local-command-palettes-before-mobile-390.png`
- Local after desktop: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/local-command-palettes-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/local-command-palettes-after-mobile-390.png`

## Reference Observations

- Examples: `Simple`, `Simple with padding`, `With preview`, `With images and descriptions`, `With icons`, `Semi-transparent with icons`, `With groups`, `With footer`.
- The reference is image-backed: large mountain/photo backgrounds sit behind floating command palette surfaces.
- Some variants include avatar/image rows and a preview details column.
- Mobile keeps the large image-backed surface rhythm and clips the preview horizontally rather than simplifying to a tiny card.

## Implementation

- Replaced the shared `command-menu-page` mapping for this leaf with dedicated variants:
  - `command-palette-simple`
  - `command-palette-padding`
  - `command-palette-preview`
  - `command-palette-images`
  - `command-palette-icons`
  - `command-palette-translucent`
  - `command-palette-groups`
  - `command-palette-footer`
- Kept the older generic `command-menu-page` renderer for unrelated command menu pages.
- Added large image-backed preview surfaces, floating white/dark/translucent command palette cards, image rows, icons, groups, preview details, and footer keyboard hints.

## Imagegen Policy

- This leaf is image-backed, so fresh command-palette-specific assets were generated instead of reusing older preview images.
- Backgrounds: `examples/ui-vocabulary-site/public/assets/command-palettes/mountain-backgrounds-sheet-v1.png`
- Avatars: `examples/ui-vocabulary-site/public/assets/command-palettes/avatar-results-sheet-v1.png`
- Each preview uses a different crop/slot from the generated sheets. Provenance: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/command-palettes-imagegen-provenance.md`

## Smoke

- Reference JSON: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/tailwind-command-palettes-reference.json`
- Local smoke JSON: `docs/research/assets/application-command-palettes-hero-level-rework-2026-07-02/local-command-palettes-smoke.json`
- CDP result:
  - Reference desktop/mobile found 8/8 expected names.
  - Local desktop/mobile found 8/8 expected names.
  - Local desktop/mobile loaded command palette CSS background assets.
  - Local desktop/mobile horizontal overflow: `false`.

