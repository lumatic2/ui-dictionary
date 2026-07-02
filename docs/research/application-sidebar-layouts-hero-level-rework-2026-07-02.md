# Application UI Sidebar Layouts hero-level rework

Date: 2026-07-02
Leaf: Application UI / Application Shells / Sidebar Layouts
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar`
Local route: `/?filter=nav%3Aplus-application-shells-sidebar-layouts`

## Reference

- Desktop capture: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/tailwind-sidebar-layouts-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/tailwind-sidebar-layouts-mobile-390.png`
- Reference metadata: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/tailwind-sidebar-layouts-reference.json`

Observed visible examples:

- Simple sidebar
- Simple dark sidebar
- Sidebar with header
- Dark sidebar with header
- With constrained content area
- With off-white background
- Simple brand sidebar
- Brand sidebar with header

## Implementation

This pass keeps the existing 8-example Sidebar Layouts data and tightens the renderer to match the Tailwind shell rhythm:

- Wider `max-w-6xl` shell frame, with constrained variants still visibly narrower.
- Taller `min-h-[620px]` shell body and larger empty work plane.
- Dark, light, off-white, and brand sidebars now preserve the same sidebar/content proportions as the reference.
- Header variants use a taller top bar with search/avatar affordances and the same sidebar body rhythm underneath.
- Main work areas use neutral filled surfaces rather than dense hatch textures.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is application-shell structure only: sidebars, top headers, empty content wells, and neutral work surfaces.
- Smoke records `/favicon.svg`, but preview image sources are empty after excluding the site favicon.

## Verification

- Local before desktop: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/local-sidebar-layouts-before-desktop.png`
- Local before mobile: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/local-sidebar-layouts-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/local-sidebar-layouts-after-desktop.png`
- Local mobile after: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/local-sidebar-layouts-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-sidebar-layouts-hero-level-rework-2026-07-02/local-sidebar-layouts-smoke.json`

Smoke result:

- Desktop expected example names: 8/8 present.
- Mobile expected example names: 8/8 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
