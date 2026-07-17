# Application UI Stacked Layouts hero-level rework

Date: 2026-07-02
Leaf: Application UI / Application Shells / Stacked Layouts
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked`
Local route: `/?filter=nav%3Aplus-application-shells-stacked-layouts`

## Reference

- Desktop capture: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/tailwind-stacked-layouts-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/tailwind-stacked-layouts-mobile-390.png`
- Reference metadata: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/tailwind-stacked-layouts-reference.json`

Observed visible examples:

- With lighter page header
- With bottom border
- On subtle background
- Branded nav with compact lighter page header
- With overlap
- Brand nav with overlap
- Branded nav with lighter page header
- With compact lighter page header
- Two-row navigation with overlap

## Implementation

This pass keeps the existing 9-example Stacked Layouts data and tightens the renderer to match the Tailwind shell rhythm:

- Wider `max-w-6xl` application shell frame.
- Taller working area with neutral gray surfaces instead of patterned placeholder texture.
- Header/nav spacing adjusted for compact, branded, bottom-border, and overlap variants.
- Two-row navigation variant now renders two side-by-side content wells inside the overlapped work area.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is application-shell structure only: nav bars, page headers, empty content wells, and gray work surfaces.
- Smoke records `/favicon.svg`, but preview image sources are empty after excluding the site favicon.

## Verification

- Local before desktop: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/local-stacked-layouts-before-desktop.png`
- Local before mobile: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/local-stacked-layouts-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/local-stacked-layouts-after-desktop.png`
- Local mobile after: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/local-stacked-layouts-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-stacked-layouts-hero-level-rework-2026-07-02/local-stacked-layouts-smoke.json`

Smoke result:

- Desktop expected example names: 9/9 present.
- Mobile expected example names: 9/9 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
