# Application UI Empty States hero-level rework

Date: 2026-07-02
Leaf: Application UI / Feedback / Empty States
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/feedback/empty-states`
Local route: `/?filter=nav%3Aplus-feedback-empty-states`

## Reference

- Desktop capture: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/tailwind-empty-states-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/tailwind-empty-states-mobile-390.png`
- Reference metadata: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/tailwind-empty-states-reference.json`

Observed visible examples:

- Simple
- With dashed border
- With starting points
- With recommendations
- With templates
- With recommendations grid

## Implementation

This pass replaces the previous shared `empty-state-page` preview with 6 dedicated empty-state variants.

- `empty-state-simple`: centered empty state with icon, copy, and primary action.
- `empty-state-dashed-border`: upload-style dashed drop zone.
- `empty-state-starting-points`: centered empty state with a two-column starting-point list.
- `empty-state-recommendations`: dark recommendation panel with connect actions.
- `empty-state-templates`: template recommendation list with action buttons.
- `empty-state-recommendations-grid`: collaborator recommendation grid with avatar-like initials.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is UI-only: icons, colored tiles, avatar-like circles, lists, buttons, and empty-state copy.

## Verification

- Local before desktop: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/local-empty-states-before-desktop.png`
- Local before mobile: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/local-empty-states-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/local-empty-states-after-desktop.png`
- Local mobile after: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/local-empty-states-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-empty-states-hero-level-rework-2026-07-02/local-empty-states-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
