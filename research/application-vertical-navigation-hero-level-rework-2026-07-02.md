# Application UI Vertical Navigation hero-level rework

Date: 2026-07-02
Leaf: Application UI / Navigation / Vertical Navigation
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/vertical-navigation`
Local route: `/?filter=nav%3Aplus-navigation-vertical-navigation`

## Reference

- Desktop capture: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/tailwind-vertical-navigation-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/tailwind-vertical-navigation-mobile-390.png`
- Reference metadata: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/tailwind-vertical-navigation-reference.json`

Observed visible examples:

- Simple
- With badges
- With icons and badges
- With icons
- With secondary navigation
- On gray

## Implementation

This pass replaces the previous shared `sidebar-page` preview with 6 dedicated vertical navigation variants.

- `vertical-nav-simple`: narrow text-only vertical list with active state.
- `vertical-nav-badges`: text vertical list with count badges.
- `vertical-nav-icons-badges`: icon list with count badges.
- `vertical-nav-icons`: icon list without badges.
- `vertical-nav-secondary`: primary list plus secondary team/project navigation.
- `vertical-nav-gray`: vertical navigation mounted on a gray surface.

Image policy applied:

- No imagegen asset was generated. The Tailwind reference is UI-only: links, icons, count badges, active state, secondary section, and gray background treatment.

## Verification

- Local before desktop: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/local-vertical-navigation-before-desktop.png`
- Local before mobile: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/local-vertical-navigation-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/local-vertical-navigation-after-desktop.png`
- Local mobile after: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/local-vertical-navigation-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-vertical-navigation-hero-level-rework-2026-07-02/local-vertical-navigation-smoke.json`

Smoke result:

- Desktop expected example names: 6/6 present.
- Mobile expected example names: 6/6 present.
- Desktop preview images: 0 after favicon exclusion.
- Mobile preview images: 0 after favicon exclusion.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
