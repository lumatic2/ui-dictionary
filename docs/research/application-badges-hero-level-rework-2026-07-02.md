# Application UI / Elements / Badges hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-elements-badges`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/badges`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/tailwind-badges-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/tailwind-badges-mobile-390.png`
- Local before desktop: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/local-before-badges-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/local-before-badges-mobile-390.png`
- Local after desktop: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/local-badges-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/local-badges-after-mobile-390.png`
- Smoke: `docs/research/assets/application-badges-hero-level-rework-2026-07-02/badges-after-smoke.json`

## Reference Observations

The Tailwind page exposes 16 visible examples:

1. With border
2. With border and dot
3. Pill with border
4. Pill with border and dot
5. With border and remove button
6. Flat
7. Flat pill
8. Flat with dot
9. Flat pill with dot
10. Flat with remove button
11. Small with border
12. Small flat
13. Small pill with border
14. Small flat pill
15. Small flat with dot
16. Small flat pill with dot

The previews are compact UI-only badge rows inside low white preview frames. There are no product screenshots, photos, avatars, or decorative raster images in the reference.

## Local Change

The local page previously mapped every example to the shared `element-badge-page` preview, so all 16 cards showed the same generic `Admin / Active / Beta / Owner` row.

The rework replaces that shared mapping with 16 dedicated preview variants:

- `badge-border`
- `badge-border-dot`
- `badge-pill-border`
- `badge-pill-border-dot`
- `badge-border-remove`
- `badge-flat`
- `badge-flat-pill`
- `badge-flat-dot`
- `badge-flat-pill-dot`
- `badge-flat-remove`
- `badge-small-border`
- `badge-small-flat`
- `badge-small-pill-border`
- `badge-small-flat-pill`
- `badge-small-flat-dot`
- `badge-small-flat-pill-dot`

The renderer keeps Tailwind-like color samples (`Badge`, `Red`, `Yellow`, `Green`, `Blue`, `Indigo`, `Purple`, `Pink`) and varies only the traits shown by the official example names: outline ring, filled flat background, pill radius, status dot, dismiss `X`, and small density.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews are UI/control-only. This is an explicit quality decision, not an omission.

For later leaves, if a preview contains a screenshot, product photo, portrait, thumbnail, or background image, generate a fresh asset for that leaf or preview. Do not reuse an older asset just because it is visually close. Record each generated asset in the leaf evidence folder with provenance.

## Verification

- `npm run build`: passed.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; it is outside the Badges preview cards and does not affect the page-level horizontal overflow result.
