# Application UI / Layout / Cards hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-layout-cards`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/cards`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/tailwind-cards-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/tailwind-cards-mobile-390.png`
- Local before desktop: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/local-before-cards-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/local-before-cards-mobile-390.png`
- Local after desktop: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/local-cards-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/local-cards-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/cards-capture-smoke.json`
- After smoke: `docs/research/assets/application-cards-hero-level-rework-2026-07-02/cards-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Playwright screenshots as the browser fallback and records that fallback in `cards-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 10 visible examples:

1. Basic card
2. Card, edge-to-edge on mobile
3. Card with header
4. Card with footer
5. Card with header and footer
6. Card with gray footer
7. Card with gray body
8. Well
9. Well on gray
10. Well, edge-to-edge on mobile

The previews are UI/card surface diagrams. They show centered card surfaces on gray, white, or dark canvases, with header/footer bands, gray body/footer treatments, and nested well surfaces.

## Local Change

The local page previously mapped all 10 examples to the shared `layout-panel-page` preview, which showed two labeled layout panels and did not communicate card surface variations.

The rework replaces that mapping with 10 dedicated preview variants:

- `card-basic`
- `card-edge-mobile`
- `card-header`
- `card-footer`
- `card-header-footer`
- `card-gray-footer`
- `card-gray-body`
- `card-well`
- `card-well-gray`
- `card-well-edge-mobile`

The renderer now uses compact card diagrams with white, gray, and dark canvases, header and footer slots, gray body/footer states, dark well treatment, and nested well surfaces.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews are UI/card surface diagrams with CSS-only surfaces.

For later leaves, if a preview contains raster-like visual content, generate a fresh asset for that leaf or preview instead of reusing existing assets. Record the generated file and prompt/provenance in that leaf evidence folder.

## Verification

- `npm run build`: passed.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - dark panel count: `3`
  - gray surface marker count: `32`
  - hatched dark treatment count: `3`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; it is outside the Cards preview surfaces and does not affect page-level horizontal overflow.
