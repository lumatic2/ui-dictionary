# Application UI / Overlays / Modal Dialogs hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/modal-dialogs`
- Local route: `/?filter=nav%3Aplus-overlays-modal-dialogs`
- Leaf target: 6 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/tailwind-modal-dialogs-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/tailwind-modal-dialogs-mobile-390.png`
- Local before desktop: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/local-modal-dialogs-before-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/local-modal-dialogs-before-mobile-390.png`
- Local after desktop: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/local-modal-dialogs-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/local-modal-dialogs-after-mobile-390.png`

## Reference Observations

- Examples: `Simple with gray footer`, `Centered with single action`, `Centered with wide buttons`, `Simple alert`, `Simple with dismiss button`, `Simple alert with left-aligned buttons`.
- The reference is UI-only: it uses gray or dark overlay surfaces, icon badges, modal cards, action footers, and dismiss controls.
- Mobile is not a generic shrink of desktop. The gray footer example switches to centered content and stacked full-width actions, while desktop keeps the icon/content grid and footer action row.
- The dark wide-buttons example needs a separate dark overlay/card treatment, not a recolored light modal.

## Implementation

- Replaced the shared `modal-page` mapping for this leaf with dedicated variants:
  - `modal-gray-footer`
  - `modal-single-action`
  - `modal-wide-buttons`
  - `modal-alert`
  - `modal-dismiss`
  - `modal-left-actions`
- Kept the older generic `modal-page` renderer for unrelated overlay pages.
- Added modal-specific preview rendering with gray overlay canvases, dark wide-button treatment, alert/success icon badges, dismiss control, footer actions, and mobile-specific centered/stacked actions where Tailwind uses that rhythm.

## Imagegen Policy

- No imagegen asset was needed. The Tailwind reference is modal UI/control-only and does not contain photos, product screenshots, background images, avatars, or illustrations.
- Carry-forward rule: for image-bearing previews, do not reuse assets from previous leaves or other previews. Generate a fresh image for the specific preview role, copy it into that leaf's public asset directory with a versioned filename, and record provenance next to the capture evidence.

## Smoke

- Local smoke JSON: `docs/research/assets/application-modal-dialogs-hero-level-rework-2026-07-02/local-modal-dialogs-smoke.json`
- Result:
  - Local desktop/mobile found 6/6 expected names.
  - Local desktop/mobile loaded 0 preview images.
  - Local desktop/mobile horizontal overflow: `false`.
  - Chrome extension setup was attempted, but its bundled documentation file for tab claiming was missing in this session. The post-fix after captures were therefore saved with headless Chrome/Playwright using the same desktop and 390px mobile viewports.
