# Application UI / Overlays / Drawers hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/drawers`
- Local route: `/?filter=nav%3Aplus-overlays-drawers`
- Leaf target: 12 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/tailwind-drawers-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/tailwind-drawers-mobile-390.png`
- Local before desktop: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/local-before-drawers-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/local-before-drawers-mobile-390.png`
- Local after desktop: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/local-drawers-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/local-drawers-after-mobile-390.png`

## Reference Observations

- Examples: `With close button on outside`, `Empty`, `Wide empty`, `With background overlay`, `With branded header`, `With sticky footer`, `Create project form example`, `Wide create project form example`, `User profile example`, `Wide horizontal user profile example`, `Contact list example`, `File details example`.
- Most examples are right-edge drawer panels with a blank or muted page area on the left.
- Important differences are drawer width, outside close button, overlay opacity, branded header, sticky footer, project form density, profile photo layout, contact list rows, and dark file detail metadata.
- Mobile keeps the drawer panel as the dominant preview object instead of reducing it to a tiny generic card.

## Implementation

- Replaced the shared `drawer-page` mapping for this leaf with dedicated variants:
  - `drawer-close-outside`
  - `drawer-empty`
  - `drawer-wide-empty`
  - `drawer-background-overlay`
  - `drawer-branded-header`
  - `drawer-sticky-footer`
  - `drawer-create-project`
  - `drawer-wide-create-project`
  - `drawer-user-profile`
  - `drawer-wide-user-profile`
  - `drawer-contact-list`
  - `drawer-file-details`
- Kept the older generic `drawer-page` renderer for unrelated UI Kit and glossary entries.
- Matched Tailwind-like right drawer surfaces, wide dark drawer variants, branded purple headers, sticky bottom actions, form content, profile cards, contact list rows, and dark file detail metadata.

## Imagegen Policy

- This leaf is partially image-backed because the Tailwind reference includes profile photos, contact avatars, and a file thumbnail.
- Generated four fresh Drawers-specific assets and copied them into `examples/ui-vocabulary-site/public/assets/drawers/`.
- Provenance: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/drawers-imagegen-provenance.md`
- Non-image examples remain UI/control-only; no decorative raster images were added to those previews.

## Smoke

- Capture smoke JSON: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/drawers-capture-smoke.json`
- Local smoke JSON: `docs/research/assets/application-drawers-hero-level-rework-2026-07-02/local-drawers-smoke.json`
- Result:
  - Tailwind desktop/mobile found 12/12 expected names.
  - Local desktop/mobile found 12/12 expected names.
  - Local desktop/mobile loaded 4 drawer image sources plus drawer avatar background crops.
  - Local desktop/mobile horizontal overflow: `false`.
