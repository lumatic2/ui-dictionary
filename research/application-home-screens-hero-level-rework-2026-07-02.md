# Application UI / Page Examples / Home Screens hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-page-examples-home-screens`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/home-screens`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/tailwind-home-screens-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/tailwind-home-screens-mobile-390.png`
- Local before desktop: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/local-before-home-screens-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/local-before-home-screens-mobile-390.png`
- Local after desktop: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/local-home-screens-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/local-home-screens-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/home-screens-capture-smoke.json`
- After smoke: `docs/research/assets/application-home-screens-hero-level-rework-2026-07-02/home-screens-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Python Playwright screenshots as the browser fallback and records that fallback in `home-screens-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 2 visible examples:

1. Sidebar
2. Stacked

The `Sidebar` preview is a dark deployment dashboard with a left navigation rail, a deployment list, and a desktop-only activity feed. The mobile preview collapses away the side nav and activity feed, leaving a compact search bar and deployments list.

The `Stacked` preview is a light finance dashboard with a top nav, KPI strip, recent activity table, and recent client cards.

## Local Change

The local page previously exposed the right 2 names but mapped both examples to the shared `app-example-dashboard` preview. That created generic gray application shells and did not reflect the Tailwind page-scale home screen examples.

The rework replaces that mapping with two dedicated page-scale variants:

- `home-screen-sidebar`
- `home-screen-stacked`

The new renderer builds a dark deployment dashboard with sidebar navigation, deployment rows, badges, and activity feed, plus a light cashflow dashboard with top navigation, KPI cards, recent invoice activity, and client cards. Mobile behavior now follows the reference: the sidebar preview collapses to a compact deployment list, while the stacked dashboard becomes a single-column finance screen.

## Imagegen Policy

No imagegen asset was generated for this leaf because the Tailwind reference contains no raster photos, product screenshots, thumbnails, or background images. The previews are fully represented by UI layout, text, badges, tables, and simple avatar initials.

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
  - desktop table/surface marker count: `2`
  - mobile table/surface marker count: `2`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`
