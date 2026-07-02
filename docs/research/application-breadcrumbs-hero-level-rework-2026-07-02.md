# Application UI / Navigation / Breadcrumbs hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/breadcrumbs`
- Local route: `/?filter=nav%3Aplus-navigation-breadcrumbs`
- Leaf target: 4 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/tailwind-breadcrumbs-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/tailwind-breadcrumbs-mobile-390.png`
- Local before desktop: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/local-breadcrumbs-before-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/local-breadcrumbs-before-mobile-390.png`
- Local after desktop: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/local-breadcrumbs-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/local-breadcrumbs-after-mobile-390.png`

## Reference Observations

- Examples: `Contained`, `Full-width bar`, `Simple with chevrons`, `Simple with slashes`.
- The preview is mostly an empty large surface; the breadcrumb control is small and precise.
- `Contained` uses a centered segmented white breadcrumb chip on a light gray surface.
- `Full-width bar` places the segmented breadcrumb inside a horizontal white bar across the preview.
- `Simple with chevrons` uses a dark surface with a small centered trail.
- `Simple with slashes` uses a light bordered surface with slash separators.
- Mobile keeps the breadcrumb compact and starts it near the preview's left padding instead of collapsing the pattern.

## Implementation

- Replaced the shared `breadcrumb-page` mapping for this leaf with dedicated variants:
  - `breadcrumb-contained`
  - `breadcrumb-full-width-bar`
  - `breadcrumb-simple-chevrons`
  - `breadcrumb-simple-slashes`
- Kept the older generic `breadcrumb-page` renderer for unrelated pages.
- Added large Tailwind-like preview surfaces, segmented chip/bar treatment, dark chevron treatment, and slash treatment.

## Imagegen Policy

- No imagegen asset was needed. The Tailwind reference is UI/control-only: it contains icons, text, separators, and surfaces, but no raster preview imagery.

## Smoke

- Reference JSON: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/tailwind-breadcrumbs-reference.json`
- Local smoke JSON: `docs/research/assets/application-breadcrumbs-hero-level-rework-2026-07-02/local-breadcrumbs-smoke.json`
- CDP result:
  - Reference desktop/mobile found 4/4 expected names.
  - Local desktop/mobile found 4/4 expected names.
  - Local desktop/mobile loaded 0 preview images.
  - Local desktop/mobile horizontal overflow: `false`.

