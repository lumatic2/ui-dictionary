# Application UI / Layout / List containers hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-layout-list-containers`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/list-containers`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/tailwind-list-containers-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/tailwind-list-containers-mobile-390.png`
- Local before desktop: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/local-before-list-containers-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/local-before-list-containers-mobile-390.png`
- Local after desktop: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/local-list-containers-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/local-list-containers-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/list-containers-capture-smoke.json`
- After smoke: `docs/research/assets/application-list-containers-hero-level-rework-2026-07-02/list-containers-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Playwright screenshots as the browser fallback and records that fallback in `list-containers-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 7 visible examples:

1. Simple with dividers
2. Card with dividers
3. Card with dividers, full-width on mobile
4. Separate cards
5. Separate cards, full-width on mobile
6. Flat card with dividers
7. Simple with dividers, full-width on mobile

The previews are layout skeletons, not data-rich list content. They emphasize white, gray, and dark canvases; centered list widths; card boundaries; separated row cards; divider-only rows; and full-width-on-mobile framing.

## Local Change

The local page previously exposed the right 7 names but still used the shared text-heavy list/activity preview. That produced a count match, but not the visual parity level of the Hero Sections baseline.

The rework replaces the shared preview with 7 dedicated list container variants:

- `list-simple-dividers`
- `list-card-dividers`
- `list-card-dividers-mobile-full`
- `list-separate-cards`
- `list-separate-cards-mobile-full`
- `list-flat-card-dividers`
- `list-simple-dividers-mobile-full`

The renderer now uses CSS skeleton rows with hatched fills, card dividers, separated card rows, light gray canvases, flat white canvases, and dark canvas/card treatments.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews are layout skeleton diagrams with zero preview images.

For image-backed previews in later leaves, generate a fresh purpose-fit image per preview or per clearly distinct visual role. Do not reuse a generic asset across previews just because the leaf needs similar media; reuse is allowed only for deliberate sprites/contact sheets documented as a single preview-specific source.

## Verification

- `npm run build`: passed before documentation update.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - dark panel count: `2`
  - gray panel count: `17`
  - hatched skeleton count: `21`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; mobile smoke reports breadcrumb scroll width inside an intentionally horizontally scrollable breadcrumb bar. Neither creates page-level horizontal overflow.
