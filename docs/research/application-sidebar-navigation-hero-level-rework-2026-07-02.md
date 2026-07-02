# Application UI / Navigation / Sidebar Navigation hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/sidebar-navigation`
- Local route: `/?filter=nav%3Aplus-navigation-sidebar-navigation`
- Leaf target: 5 examples, each with its own preview variant.

## Captures

- Tailwind desktop: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/tailwind-sidebar-navigation-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/tailwind-sidebar-navigation-mobile-390.png`
- Local before desktop: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/local-sidebar-navigation-before-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/local-sidebar-navigation-before-mobile-390.png`
- Local after desktop: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/local-sidebar-navigation-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/local-sidebar-navigation-after-mobile-390.png`

## Reference Observations

- Examples: `Light`, `Dark`, `With expandable sections`, `With secondary navigation`, `Brand`.
- The preview is a large app frame, not a compact card: about 18rem left sidebar, long vertical height, and a mostly empty right content plane.
- Mobile keeps the large preview frame rhythm; it clips/contains the wide app surface rather than collapsing the sidebar into a tiny responsive mock.
- Each preview has navigation icons, badge pills, a `Your teams` group, and a footer user profile.

## Implementation

- Replaced the shared `sidebar-page` preview mapping for this leaf with dedicated variants:
  - `sidebar-nav-light`
  - `sidebar-nav-dark`
  - `sidebar-nav-expandable`
  - `sidebar-nav-secondary`
  - `sidebar-nav-brand`
- Kept the older generic `sidebar-page` renderer for unrelated pages.
- Matched the Tailwind-like large frame with `18rem` sidebar, long `720px` preview height, dark/brand surfaces, badges, nested project links, secondary navigation, teams, and footer profile.

## Imagegen Policy

- This leaf is not UI-only because the Tailwind screenshot includes a footer profile avatar.
- Generated one fresh avatar image per preview and used each asset in only that preview:
  - `examples/ui-vocabulary-site/public/assets/sidebar-navigation/avatar-light-v1.png`
  - `examples/ui-vocabulary-site/public/assets/sidebar-navigation/avatar-dark-v1.png`
  - `examples/ui-vocabulary-site/public/assets/sidebar-navigation/avatar-expandable-v1.png`
  - `examples/ui-vocabulary-site/public/assets/sidebar-navigation/avatar-secondary-v1.png`
  - `examples/ui-vocabulary-site/public/assets/sidebar-navigation/avatar-brand-v1.png`
- Provenance: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/sidebar-navigation-imagegen-provenance.md`

## Smoke

- Reference JSON: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/tailwind-sidebar-navigation-reference.json`
- Local smoke JSON: `docs/research/assets/application-sidebar-navigation-hero-level-rework-2026-07-02/local-sidebar-navigation-smoke.json`
- CDP result:
  - Reference desktop/mobile found 5/5 expected names.
  - Local desktop/mobile found 5/5 expected names.
  - Local desktop/mobile loaded 5 sidebar avatar assets.
  - Local desktop/mobile horizontal overflow: `false`.

