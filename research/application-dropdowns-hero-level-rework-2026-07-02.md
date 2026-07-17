# Application UI / Elements / Dropdowns hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-elements-dropdowns`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/tailwind-dropdowns-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/tailwind-dropdowns-mobile-390.png`
- Local before desktop: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/local-before-dropdowns-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/local-before-dropdowns-mobile-390.png`
- Local after desktop: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/local-dropdowns-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/local-dropdowns-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/dropdowns-capture-smoke.json`
- After smoke: `docs/research/assets/application-dropdowns-hero-level-rework-2026-07-02/dropdowns-after-smoke.json`

## Browser Note

The requested Chrome extension workflow was attempted first. The plugin runtime failed while loading missing internal documentation files:

- `docs/browser-safety.md`
- `docs/chrome-troubleshooting.md`

To avoid stopping the visual parity loop, this leaf used Playwright screenshots as the browser fallback. The fallback reason is recorded in `dropdowns-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 5 visible examples:

1. Simple
2. With dividers
3. With icons
4. With minimal menu icon
5. With simple header

The reference previews are UI/control-only. They show large neutral preview canvases with a small trigger and an open menu. The `With dividers` preview uses a dark canvas and grouped dark menu rows. The `With icons` preview adds a leading icon column to each row. The minimal trigger variant uses a vertical ellipsis icon instead of the `Options` button. The simple header variant adds signed-in account metadata at the top of the menu.

## Local Change

The local page previously mapped all 5 examples to the shared `element-dropdown-page` preview, so each card rendered the same generic `Edit / Duplicate / Archive` menu inside a text-heavy application element panel.

The rework replaces that mapping with 5 dedicated preview variants:

- `dropdown-simple`
- `dropdown-dividers`
- `dropdown-icons`
- `dropdown-minimal-icon`
- `dropdown-simple-header`

The renderer now uses Tailwind-like large preview surfaces, centered open dropdown positioning, `Options` trigger buttons, dark grouped divider styling, leading row icons, minimal vertical ellipsis trigger, and a signed-in header block.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews contain no screenshots, photos, portraits, thumbnails, or background images.

For later leaves, if a preview contains any raster-like visual content, generate a fresh asset for that leaf or preview instead of reusing existing assets. Record the generated file and prompt/provenance in that leaf evidence folder.

## Verification

- `npm run build`: passed.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - dark panel count: `1`
  - `Delete` action visible: `true`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; it is outside the Dropdowns preview cards and does not affect the page-level horizontal overflow result.
