# Application UI / Page Examples / Detail Screens hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-page-examples-detail-screens`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/detail-screens`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/tailwind-detail-screens-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/tailwind-detail-screens-mobile-390.png`
- Local before desktop: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/local-before-detail-screens-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/local-before-detail-screens-mobile-390.png`
- Local after desktop: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/local-detail-screens-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/local-detail-screens-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/detail-screens-capture-smoke.json`
- After smoke: `docs/research/assets/application-detail-screens-hero-level-rework-2026-07-02/detail-screens-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Python Playwright screenshots as the browser fallback and records that fallback in `detail-screens-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 2 visible examples:

1. Sidebar
2. Stacked

The `Sidebar` preview is a dark deployment detail screen with navigation, tabs, deployment status, metric blocks, and a latest activity table. The mobile preview collapses to a compact dark detail surface with tabs and stacked metrics.

The `Stacked` preview is a light invoice detail page with top navigation, invoice header, invoice table, amount card, and activity/comment panel. On mobile, the invoice and side cards stack vertically.

## Local Change

The local page previously exposed the right 2 names but mapped both examples to the shared `app-example-detail` preview. That created a generic gray application page and did not capture the Tailwind detail-screen patterns.

The rework replaces that mapping with two dedicated page-scale variants:

- `detail-screen-sidebar`
- `detail-screen-stacked`

The new renderer builds a dark deployment detail screen with tabs, KPI metrics, and latest activity, plus a light invoice detail screen with invoice metadata, project rows, total summary, amount card, and activity/comment panel.

## Imagegen Policy

No imagegen asset was generated for this leaf because the Tailwind reference contains no raster photos, product screenshots, thumbnails, or background images. The previews are UI/table/card-only and are better represented with CSS.

For image-backed previews in later leaves, generate a fresh purpose-fit image per preview or per clearly distinct visual role. Do not reuse a generic asset across previews just because the subject is similar.

## Verification

- `npm run build`: passed after implementation.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop marker names missing: `[]`
  - mobile marker names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - desktop dark panel count: `1`
  - mobile dark panel count: `1`
  - desktop card marker count: `4`
  - mobile card marker count: `4`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`
