# Application UI / Overlays / Notifications hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/notifications`
- Local route: `/?filter=nav%3Aplus-overlays-notifications`
- Leaf target: 6 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/tailwind-notifications-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/tailwind-notifications-mobile-390.png`
- Local before desktop: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/local-before-notifications-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/local-before-notifications-mobile-390.png`
- Local after desktop: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/local-notifications-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/local-notifications-after-mobile-390.png`

## Reference Observations

- Examples: `Simple`, `Condensed`, `With actions below`, `With avatar`, `With split buttons`, `With buttons below`.
- The reference uses a mostly empty preview canvas with the notification pinned to the lower-right area on desktop.
- Dark variants use a dark canvas and slate notification surfaces.
- Avatar variants include a small person avatar; these require a fresh raster asset for this leaf.
- Mobile keeps each notification as the visual focus inside a tall preview card and must not clip right-side buttons.

## Implementation

- Replaced the shared `toast-page` mapping for this leaf with dedicated variants:
  - `notification-simple`
  - `notification-condensed`
  - `notification-actions-below`
  - `notification-avatar`
  - `notification-split-buttons`
  - `notification-buttons-below`
- Kept the older generic `toast-page` renderer for unrelated feedback pages and glossary entries.
- Matched Tailwind-like success, condensed dark, action-link, avatar reply, split-button, and buttons-below notification treatments.
- Added mobile-specific width handling so cards fit the preview canvas without right-edge clipping.

## Imagegen Policy

- This leaf is partially image-backed because the Tailwind reference includes avatar notification examples.
- Generated one fresh Notifications-specific avatar asset and copied it into `examples/ui-vocabulary-site/public/assets/notifications/`.
- Provenance: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/notifications-imagegen-provenance.md`
- Non-avatar examples remain UI/control-only; no decorative raster images were added.

## Smoke

- Capture smoke JSON: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/notifications-capture-smoke.json`
- Local smoke JSON: `docs/research/assets/application-notifications-hero-level-rework-2026-07-02/local-notifications-smoke.json`
- Result:
  - Tailwind desktop/mobile found 6/6 expected names.
  - Local desktop/mobile found 6/6 expected names.
  - Local desktop/mobile loaded 2 notification avatar image instances.
  - Local desktop/mobile horizontal overflow: `false`.
  - Local desktop/mobile element overflow list: empty.
