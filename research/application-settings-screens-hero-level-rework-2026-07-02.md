# Application UI / Page Examples / Settings Screens hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-page-examples-settings-screens`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/settings-screens`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/tailwind-settings-screens-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/tailwind-settings-screens-mobile-390.png`
- Local before desktop: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/local-before-settings-screens-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/local-before-settings-screens-mobile-390.png`
- Local after desktop: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/local-settings-screens-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/local-settings-screens-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/settings-screens-capture-smoke.json`
- After smoke: `docs/research/assets/application-settings-screens-hero-level-rework-2026-07-02/settings-screens-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Python Playwright screenshots as the browser fallback and records that fallback in `settings-screens-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 2 visible examples:

1. Sidebar
2. Stacked

The `Sidebar` preview is a dark account settings screen with app navigation, settings tab bar, personal information copy, avatar control, form fields, timezone select, and save action.

The `Stacked` preview is a light settings page with top navigation, a settings side nav, profile rows, bank accounts, integrations, language/date rows, update actions, and a timezone toggle.

## Local Change

The local page previously exposed the right 2 names but mapped both examples to the shared `app-example-settings` preview. That created a generic workspace settings shell and did not match the Tailwind page-scale settings examples.

The rework replaces that mapping with two dedicated page-scale variants:

- `settings-screen-sidebar`
- `settings-screen-stacked`

The new renderer builds a dark settings form with account tabs, avatar control, labeled form fields, and save action, plus a light stacked settings page with horizontal/side navigation, profile rows, bank account rows, integrations, language/date rows, and toggle treatment.

## Imagegen Policy

No imagegen asset was generated for this leaf because the Tailwind reference contains no raster photos, product screenshots, thumbnails, or background images. The avatar is a small placeholder role in a UI form and is represented with initials rather than a reused or generated photo.

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
  - desktop form label count: `5`
  - mobile form label count: `5`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`
