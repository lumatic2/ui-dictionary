# Application UI Alerts hero-level rework

Date: 2026-07-02
Leaf: Application UI / Feedback / Alerts
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/feedback/alerts`
Local route: `/?filter=nav%3Aplus-feedback-alerts`

## Reference

- Desktop capture: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/tailwind-alerts-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/tailwind-alerts-mobile-390.png`
- Reference metadata: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/tailwind-alerts-reference.json`

Observed visible examples:

- With description
- With list
- With actions
- With link on right
- With accent border
- With dismiss button

## Implementation

This pass replaces the previous shared `alert-page` preview with 6 dedicated alert variants.

- `alert-with-description`: yellow inline warning with icon and supporting copy.
- `alert-with-list`: red validation alert with a short error list.
- `alert-with-actions`: green success alert with two inline actions.
- `alert-link-right`: dark alert with a right-aligned detail link.
- `alert-accent-border`: yellow left-accent alert.
- `alert-dismiss`: dark success alert with a dismiss icon button.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is text/control-only: icons, colored alert surfaces, text, links, actions, and a dismiss button.

## Verification

- Local before desktop: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/local-alerts-before-desktop.png`
- Local before mobile: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/local-alerts-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/local-alerts-after-desktop.png`
- Local mobile after: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/local-alerts-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-alerts-hero-level-rework-2026-07-02/local-alerts-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
