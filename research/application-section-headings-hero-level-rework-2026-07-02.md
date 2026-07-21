# Application UI Section Headings hero-level rework

Date: 2026-07-02
Leaf: Application UI / Headings / Section Headings
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/section-headings`
Local route: `/?filter=nav%3Aplus-application-headings-section-headings`

## Reference

- Desktop capture: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/tailwind-section-headings-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/tailwind-section-headings-mobile-390.png`
- Reference metadata: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/tailwind-section-headings-reference.json`

Observed visible examples:

- Simple
- With description
- With actions
- With action
- With input group
- With tabs
- With actions and tabs
- With inline tabs
- With label
- With badge and dropdown

## Implementation

This pass keeps the existing 10-example Section Headings renderer and tightens the visual treatment:

- Reduced the previous rounded card framing so the previews read as thin section header rows.
- Preserved light and dark variants, actions, single action, input group, tabs, inline tabs, label, and badge/dropdown treatments.
- Kept the section divider rhythm close to Tailwind: heading/control row first, horizontal rule below.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is text/control-only: headings, descriptions, tabs, buttons, input groups, labels, badges, and dropdown affordances.

## Verification

- Local before desktop: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/local-section-headings-before-desktop.png`
- Local before mobile: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/local-section-headings-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/local-section-headings-after-desktop.png`
- Local mobile after: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/local-section-headings-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-section-headings-hero-level-rework-2026-07-02/local-section-headings-smoke.json`

Smoke result:

- Desktop expected example names: 10/10 present.
- Mobile expected example names: 10/10 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
