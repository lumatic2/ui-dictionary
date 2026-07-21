# Application UI Card Headings hero-level rework

Date: 2026-07-02
Leaf: Application UI / Headings / Card Headings
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/card-headings`
Local route: `/?filter=nav%3Aplus-application-headings-card-headings`

## Reference

- Desktop capture: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/tailwind-card-headings-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/tailwind-card-headings-mobile-390.png`
- Reference metadata: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/tailwind-card-headings-reference.json`

Observed visible examples:

- Simple
- With action
- With avatar and actions
- With description and action
- With description
- With avatar, meta, and dropdown

## Implementation

This pass keeps the existing 6-example Card Headings renderer and refreshes the image-backed previews:

- `With avatar and actions` now uses a fresh generated v2 avatar asset.
- `With avatar, meta, and dropdown` now uses a separate fresh generated v2 avatar asset.
- Other variants remain UI-only: simple light card, dark action card, description/action, and dark description.

Image policy applied:

- `With avatar and actions`: `examples/ui-vocabulary-site/public/assets/card-headings/tom-cook-v2.png`
- `With avatar, meta, and dropdown`: `examples/ui-vocabulary-site/public/assets/card-headings/chelsea-hagon-v2.png`

Provenance: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/card-headings-imagegen-provenance.md`

## Verification

- Local desktop after: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/local-card-headings-after-desktop.png`
- Local mobile after: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/local-card-headings-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-card-headings-hero-level-rework-2026-07-02/local-card-headings-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: `tom-cook-v2.png`, `chelsea-hagon-v2.png`.
- Mobile preview images: `tom-cook-v2.png`, `chelsea-hagon-v2.png`.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
