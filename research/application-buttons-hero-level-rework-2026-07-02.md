# Application UI / Elements / Buttons hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-elements-buttons`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/buttons`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/tailwind-buttons-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/tailwind-buttons-mobile-390.png`
- Local before desktop: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/local-before-buttons-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/local-before-buttons-mobile-390.png`
- Local after desktop: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/local-buttons-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/local-buttons-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/buttons-capture-smoke.json`
- After smoke: `docs/research/assets/application-buttons-hero-level-rework-2026-07-02/buttons-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Playwright screenshots as the browser fallback and records that fallback in `buttons-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 8 visible examples:

1. Primary buttons
2. Secondary buttons
3. Soft buttons
4. Buttons with leading icon
5. Buttons with trailing icon
6. Rounded primary buttons
7. Rounded secondary buttons
8. Circular buttons

The previews are UI/control-only. They show low, wide preview frames with repeated button sizes arranged horizontally on desktop. The dark surface appears for secondary buttons and rounded primary buttons. Icon variants use a check-like glyph before or after the label. Circular buttons show plus icon-only controls in different sizes.

## Local Change

The local page previously mapped all 8 examples to the shared `element-button-page` preview, so every card rendered the same `Save changes / Cancel / ...` application element panel.

The rework replaces that mapping with 8 dedicated preview variants:

- `button-primary`
- `button-secondary`
- `button-soft`
- `button-leading-icon`
- `button-trailing-icon`
- `button-rounded-primary`
- `button-rounded-secondary`
- `button-circular`

The renderer now uses compact preview frames, repeated size samples, Tailwind-like indigo primary styling, dark secondary panels, soft indigo backgrounds, leading/trailing icons, rounded pill buttons, and circular plus buttons.

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
  - button text count: `35`
  - circular plus count: `3`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; it is outside the Buttons preview cards and does not affect the page-level horizontal overflow result.
