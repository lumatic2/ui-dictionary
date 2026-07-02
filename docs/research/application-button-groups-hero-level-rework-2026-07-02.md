# Application UI / Elements / Button Groups hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-elements-button-groups`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/button-groups`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/tailwind-button-groups-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/tailwind-button-groups-mobile-390.png`
- Local before desktop: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/local-before-button-groups-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/local-before-button-groups-mobile-390.png`
- Local after desktop: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/local-button-groups-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/local-button-groups-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/button-groups-capture-smoke.json`
- After smoke: `docs/research/assets/application-button-groups-hero-level-rework-2026-07-02/button-groups-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Playwright screenshots as the browser fallback and records that fallback in `button-groups-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 5 visible examples:

1. Basic
2. Icon only
3. With stat
4. With dropdown
5. With checkbox and dropdown

The previews are UI/control-only. They show low preview frames with compact grouped controls. The icon-only and dropdown variants use dark surfaces. The stat variant combines an icon segment, label segment, and numeric segment. The dropdown variant shows an open menu. The checkbox variant combines a checkbox segment, label segment, and chevron segment.

## Local Change

The local page previously mapped all 5 examples to the shared `element-button-group-page` preview, so every card rendered the same `Day / Week / Month` application element panel.

The rework replaces that mapping with 5 dedicated preview variants:

- `button-group-basic`
- `button-group-icon-only`
- `button-group-stat`
- `button-group-dropdown`
- `button-group-checkbox-dropdown`

The renderer now uses compact preview frames, segmented controls, dark icon-only controls, stat groups, open dropdown menus, and checkbox/dropdown grouped controls.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews contain no screenshots, photos, portraits, thumbnails, or background images.

For later leaves, if a preview contains raster-like visual content, generate a fresh asset for that leaf or preview instead of reusing existing assets. Record the generated file and prompt/provenance in that leaf evidence folder.

## Verification

- `npm run build`: passed.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - dark panel count: `2`
  - `Save and schedule` dropdown item visible: `true`
  - `Unread messages` checkbox group visible: `true`
  - `12k` stat segment visible: `true`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; mobile smoke reports the known breadcrumb horizontal scroll container. Both are outside the Button Groups preview cards and do not affect page-level horizontal overflow.
