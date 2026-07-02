# Application UI / Layout / Media Objects hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-layout-media-objects`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/media-objects`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/tailwind-media-objects-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/tailwind-media-objects-mobile-390.png`
- Local before desktop: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/local-before-media-objects-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/local-before-media-objects-mobile-390.png`
- Local after desktop: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/local-media-objects-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/local-media-objects-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/media-objects-capture-smoke.json`
- After smoke: `docs/research/assets/application-media-objects-hero-level-rework-2026-07-02/media-objects-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Python Playwright screenshots as the browser fallback and records that fallback in `media-objects-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 8 visible examples:

1. Basic
2. Aligned to center
3. Aligned to bottom
4. Stretched to fit
5. Media on right
6. Basic responsive
7. Wide responsive
8. Nested

The previews are UI-only media-object diagrams. They use X-mark media placeholders, lorem text, white and dark canvases, top/center/bottom alignment, right-side media, responsive stacking, wide media, and nested comment-like rows.

## Local Change

The local page previously exposed the right 8 names but mapped every example to the shared `element-avatar-page` preview. That made all examples look like the same avatar primitive card and erased the alignment/right/responsive/nested differences.

The rework replaces that shared renderer with 8 dedicated media-object variants:

- `media-basic`
- `media-center`
- `media-bottom`
- `media-stretched`
- `media-right`
- `media-basic-responsive`
- `media-wide-responsive`
- `media-nested`

The renderer now uses bordered X placeholders, Tailwind-like lorem text, dark panels for the center/right/nested examples, a taller stretched media box, a right-media layout, responsive stacked layouts, a wide placeholder, and nested indented rows.

## Imagegen Policy

No imagegen asset was generated for this leaf because the Tailwind reference contains no photos, avatars, screenshots, thumbnails, or raster backgrounds. The X-mark media blocks are layout placeholders and are better represented with CSS.

For image-backed previews in later leaves, generate a fresh purpose-fit image per preview or per clearly distinct visual role. Do not reuse a generic asset across previews just because the subject is similar.

## Verification

- `npm run build`: passed after implementation.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - desktop dark panel count: `3`
  - mobile dark panel count: `3`
  - desktop media placeholder count: `10`
  - mobile media placeholder count: `9`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`
