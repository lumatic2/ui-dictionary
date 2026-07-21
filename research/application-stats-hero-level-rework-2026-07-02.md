# Application UI Stats hero-level rework

Date: 2026-07-02
Leaf: Application UI / Data Display / Stats
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/stats`
Local route: `/?filter=nav%3Aplus-data-display-stats`

## Reference

- Desktop capture: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/tailwind-stats-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/tailwind-stats-mobile-390.png`
- Reference metadata: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/tailwind-stats-reference.json`

Observed visible examples:

- With trending
- Simple
- Simple in cards
- With brand icon
- With shared borders

## Implementation

This pass refreshes the Application UI Stats leaf against new Tailwind desktop and 390px mobile captures.

- Kept the existing 5-example renderer because it already maps to the full Tailwind example set.
- Confirmed the local page has trending financial metrics, dark simple deploy stats, light metric cards, brand-icon cards, and dark shared-border cards.
- Preserved mobile stacking for all metric groups and desktop card/grid proportions.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is text/control-only: metric labels, values, trend labels, cards, borders, and small brand/icon blocks.
- For future image-backed leaves, each preview must receive a fresh purpose-fit generated image instead of reusing assets across previews.

## Verification

- Local before desktop: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/local-stats-before-desktop.png`
- Local before mobile: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/local-stats-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/local-stats-after-desktop.png`
- Local mobile after: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/local-stats-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-stats-hero-level-rework-2026-07-02/local-stats-smoke.json`

Smoke result:

- Desktop expected example names: 5/5 present.
- Mobile expected example names: 5/5 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
