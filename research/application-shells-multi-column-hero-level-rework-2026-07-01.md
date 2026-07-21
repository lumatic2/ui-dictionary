# Application UI Multi-Column Layouts hero-level rework evidence

Date: 2026-07-01

## Scope

Multi-Column Layouts was reworked after Stacked and Sidebar Layouts to complete
the Application Shells group at the stricter Hero Sections quality bar. The
previous state matched the six example names, but reused one shallow
three-region preview. This pass gives each visible Tailwind multi-column layout
a distinct local variant.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/multi-column`
- Local route: `/?filter=nav%3Aplus-application-shells-multi-column-layouts`

## Evidence

- Tailwind desktop: `docs/research/assets/application-shells-multi-column-hero-level-rework-2026-07-01/tailwind-multi-column-layouts-desktop.png`
- Tailwind mobile: `docs/research/assets/application-shells-multi-column-hero-level-rework-2026-07-01/tailwind-multi-column-layouts-mobile.png`
- Local desktop: `docs/research/assets/application-shells-multi-column-hero-level-rework-2026-07-01/local-multi-column-layouts-desktop.png`
- Local mobile: `docs/research/assets/application-shells-multi-column-hero-level-rework-2026-07-01/local-multi-column-layouts-mobile.png`

## What changed

- Added six Multi-Column Layouts preview variants instead of reusing one
  preview.
- Rebuilt the preview as a large multi-column app shell with navigation,
  secondary work column, primary work column, optional narrow sidebar, and
  optional top header.
- Added variant-specific differences for full-width three-column, secondary
  column on right, constrained width, sticky-column treatment, narrow sidebar,
  and narrow-sidebar-with-header treatment.
- Kept this leaf layout-only because the reference uses structural app shell
  placeholders, not photos or generated screenshots.

## Multi-Column Layouts variant ledger

| Preview | Local variant |
| --- | --- |
| Full-width three-column | `shell-multi-full-three-column` |
| Full-width secondary column on right | `shell-multi-secondary-right` |
| Constrained three column | `shell-multi-constrained-three-column` |
| Constrained with sticky columns | `shell-multi-sticky-columns` |
| Full-width with narrow sidebar | `shell-multi-narrow-sidebar` |
| Full-width with narrow sidebar and header | `shell-multi-narrow-sidebar-header` |

## Repeatable parity rule

For multi-column app-shell leaves, each preview must show the column contract:
primary navigation, secondary column position, main work area width, constrained
versus full-width behavior, sticky/narrow treatment, and header presence. A
single generic three-column preview is not enough.

## Verification

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed.
- Chrome route smoke passed: 6 Multi-Column Layouts example names, horizontal
  overflow false.
- Local desktop and mobile captures were saved after implementation.
