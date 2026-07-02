# Application UI Multi-Column Layouts hero-level rework

Date: 2026-07-02
Leaf: Application UI / Application Shells / Multi-Column Layouts
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/multi-column`
Local route: `/?filter=nav%3Aplus-application-shells-multi-column-layouts`

## Reference

- Desktop capture: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/tailwind-multi-column-layouts-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/tailwind-multi-column-layouts-mobile-390.png`
- Reference metadata: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/tailwind-multi-column-layouts-reference.json`

Observed visible examples:

- Full-width three-column
- Full-width secondary column on right
- Constrained three column
- Constrained with sticky columns
- Full-width with narrow sidebar
- Full-width with narrow sidebar and header

## Implementation

This pass keeps the existing 6-example Multi-Column Layouts data and tightens the renderer to match the Tailwind shell rhythm:

- Wider `max-w-6xl` shell frame for full-width variants and visibly narrower constrained variants.
- Taller `min-h-[640px]` shell body with larger empty column work planes.
- Dark variants now render with dark chrome and dark work surfaces instead of all variants sharing the same light shell.
- Narrow-sidebar variants use a thin icon rail and wider content columns.
- Header variant uses a taller top bar with navigation links and avatar affordance.
- Main work areas use neutral filled surfaces rather than dense hatch textures.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is application-shell structure only: sidebars, columns, headers, and neutral work surfaces.
- Smoke records `/favicon.svg`, but preview image sources are empty after excluding the site favicon.

## Verification

- Local before desktop: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/local-multi-column-layouts-before-desktop.png`
- Local before mobile: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/local-multi-column-layouts-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/local-multi-column-layouts-after-desktop.png`
- Local mobile after: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/local-multi-column-layouts-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-multi-column-layouts-hero-level-rework-2026-07-02/local-multi-column-layouts-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
