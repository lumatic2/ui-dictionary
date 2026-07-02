# Application UI Description Lists hero-level rework

Date: 2026-07-02
Leaf: Application UI / Data Display / Description Lists
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/description-lists`
Local route: `/?filter=nav%3Aplus-data-display-description-lists`

## Reference

- Desktop capture: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/tailwind-description-lists-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/tailwind-description-lists-mobile-390.png`
- Reference metadata: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/tailwind-description-lists-reference.json`

Observed visible examples:

- Left-aligned
- Left-aligned in card
- Left-aligned striped
- Two-column
- Left-aligned with inline actions
- Narrow with hidden labels

## Implementation

This pass refreshes the Description Lists leaf against new Tailwind desktop and 390px mobile captures.

- Kept the existing 6-example renderer because it already maps to the full Tailwind example set.
- Confirmed the local page has left-aligned, card inset, striped, two-column, inline action, and narrow hidden-label treatments.
- Preserved the large preview-frame rhythm and table-like label/value spacing needed for this leaf.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is text/control-only: labels, values, dividers, cards, striped rows, and inline action links.
- For future image-backed leaves, each preview must receive a fresh purpose-fit generated image instead of reusing assets across previews.

## Verification

- Local before desktop: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/local-description-lists-before-desktop.png`
- Local before mobile: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/local-description-lists-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/local-description-lists-after-desktop.png`
- Local mobile after: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/local-description-lists-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-description-lists-hero-level-rework-2026-07-02/local-description-lists-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
