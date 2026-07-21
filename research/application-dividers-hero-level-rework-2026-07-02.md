# Application UI / Layout / Dividers hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-layout-dividers`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/dividers`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/tailwind-dividers-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/tailwind-dividers-mobile-390.png`
- Local before desktop: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/local-before-dividers-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/local-before-dividers-mobile-390.png`
- Local after desktop: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/local-dividers-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/local-dividers-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/dividers-capture-smoke.json`
- After smoke: `docs/research/assets/application-dividers-hero-level-rework-2026-07-02/dividers-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Python Playwright screenshots as the browser fallback and records that fallback in `dividers-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 8 visible examples:

1. With label
2. With icon
3. With label on left
4. With title
5. With title on left
6. With button
7. With title and button
8. With toolbar

The previews are compact divider controls. They use centered text labels, a centered plus icon, left-aligned labels and titles, pill buttons, a dark title/button row, and a toolbar segmented control.

## Local Change

The local page previously exposed the right 8 names but mapped every example to the shared `layout-divider-page` preview. That showed split layout panels instead of divider controls.

The rework replaces that shared preview with 8 dedicated divider variants:

- `divider-label`
- `divider-icon`
- `divider-label-left`
- `divider-title`
- `divider-title-left`
- `divider-button`
- `divider-title-button`
- `divider-toolbar`

The renderer now uses Tailwind-like horizontal rules, centered and left-aligned labels, title typography, dark divider panels, pill buttons, and a toolbar with Lucide icons.

## Imagegen Policy

No imagegen asset was generated for this leaf because the Tailwind reference is UI/control-only. The visual content is made from lines, labels, buttons, and icons, not raster images.

For image-backed previews in later leaves, generate a fresh purpose-fit image per preview or per clearly distinct visual role. Do not reuse a generic asset across previews just because the subject is similar.

## Verification

- `npm run build`: passed after implementation.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - desktop dark panel count: `2`
  - mobile dark panel count: `2`
  - desktop button text count: `2`
  - mobile button text count: `2`
  - desktop project title count: `3`
  - mobile project title count: `3`
  - desktop toolbar button count: `4`
  - mobile toolbar button count: `4`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`
