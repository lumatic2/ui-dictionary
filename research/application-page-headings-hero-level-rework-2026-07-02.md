# Application UI Page Headings hero-level rework

Date: 2026-07-02
Leaf: Application UI / Headings / Page Headings
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/page-headings`
Local route: `/?filter=nav%3Aplus-application-headings-page-headings`

## Reference

- Desktop capture: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/tailwind-page-headings-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/tailwind-page-headings-mobile-390.png`
- Reference metadata: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/tailwind-page-headings-reference.json`

Observed visible examples:

- With meta and actions
- With actions
- With actions and breadcrumbs
- With banner image
- With avatar and actions
- Card with avatar and stats
- With meta, actions, and breadcrumbs
- With filters and action
- With logo, meta and actions

## Implementation

This pass keeps the existing 9-example Page Headings data and refreshes the image-backed preview evidence:

- `With banner image` now uses a fresh generated v2 banner asset instead of the older shared `banner-office.png`.
- Other variants remain UI-only: meta rows, action buttons, dark action bar, breadcrumbs, avatar rows, stat card, filters, and logo/meta treatment.
- The renderer already separated the 9 variants, so this pass focuses on fresh Tailwind captures, v2 image provenance, and current smoke evidence.

Image policy applied:

- `With banner image`: `examples/ui-vocabulary-site/public/assets/page-headings/banner-office-v2.png`
- No other Page Headings previews use raster images.

Provenance: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/page-headings-imagegen-provenance.md`

## Verification

- Local desktop after: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/local-page-headings-after-desktop.png`
- Local mobile after: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/local-page-headings-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-page-headings-hero-level-rework-2026-07-02/local-page-headings-smoke.json`

Smoke result:

- Desktop expected example names: 9/9 present.
- Mobile expected example names: 9/9 present.
- Desktop preview images: `banner-office-v2.png`.
- Mobile preview images: `banner-office-v2.png`.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
