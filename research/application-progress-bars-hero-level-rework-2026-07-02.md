# Application UI / Navigation / Progress Bars hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/progress-bars`
- Local route: `/?filter=nav%3Aplus-navigation-progress-bars`
- Leaf target: 8 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/tailwind-progress-bars-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/tailwind-progress-bars-mobile-390.png`
- Local before desktop: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/local-progress-bars-before-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/local-progress-bars-before-mobile-390.png`
- Local after desktop: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/local-progress-bars-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/local-progress-bars-after-mobile-390.png`

## Reference Observations

- Examples: `Simple`, `Panels`, `Bullets`, `Panels with border`, `Circles`, `Bullets and text`, `Circles with text`, `Progress bar`.
- The reference is control-only: all examples are progress indicators, stepper controls, labels, and empty preview surfaces.
- The main visual differences are linear top bars, segmented panels, dark bullet stepper, bordered panel segments, circle stepper, vertical bullet list, labeled circle stepper, and a single horizontal progress bar.

## Implementation

- Replaced the shared `progress-page` mapping for this leaf with dedicated variants:
  - `progress-simple`
  - `progress-panels`
  - `progress-bullets`
  - `progress-panels-border`
  - `progress-circles`
  - `progress-bullets-text`
  - `progress-circles-text`
  - `progress-bar`
- Kept the older generic `progress-page` renderer for unrelated pages and templates.
- Matched Tailwind-like surfaces using wide cards, compact controls, indigo active states, gray upcoming states, and dark mode for the bullet example.

## Imagegen Policy

- No imagegen asset was needed. The Tailwind reference is UI/control-only and does not include raster imagery.

## Smoke

- Reference JSON: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/tailwind-progress-bars-reference.json`
- Local smoke JSON: `docs/research/assets/application-progress-bars-hero-level-rework-2026-07-02/local-progress-bars-smoke.json`
- CDP result:
  - Reference desktop/mobile found 8/8 expected names.
  - Local desktop/mobile found 8/8 expected names.
  - Local desktop/mobile loaded 0 preview images.
  - Local desktop/mobile horizontal overflow: `false`.

