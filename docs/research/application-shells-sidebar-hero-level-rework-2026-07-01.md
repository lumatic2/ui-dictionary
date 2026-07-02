# Application UI Sidebar Layouts hero-level rework evidence

Date: 2026-07-01

## Scope

Sidebar Layouts was reworked after Stacked Layouts to continue raising
Application UI leaves to the Hero Sections quality bar. The previous state
matched the eight example names, but reused one shallow white sidebar preview
for every example. This pass gives each visible Tailwind sidebar layout a
distinct local variant.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar`
- Local route: `/?filter=nav%3Aplus-application-shells-sidebar-layouts`

## Evidence

- Tailwind desktop: `docs/research/assets/application-shells-sidebar-hero-level-rework-2026-07-01/tailwind-sidebar-layouts-desktop.png`
- Tailwind mobile: `docs/research/assets/application-shells-sidebar-hero-level-rework-2026-07-01/tailwind-sidebar-layouts-mobile.png`
- Local desktop: `docs/research/assets/application-shells-sidebar-hero-level-rework-2026-07-01/local-sidebar-layouts-desktop.png`
- Local mobile: `docs/research/assets/application-shells-sidebar-hero-level-rework-2026-07-01/local-sidebar-layouts-mobile.png`

## What changed

- Added eight Sidebar Layouts preview variants instead of reusing one preview.
- Rebuilt the preview as a large application shell with persistent sidebar,
  navigation rows, team shortcuts, avatar footer, and dashed work area.
- Added variant-specific differences for simple dark shell, dark sidebar with
  light content, header variants, constrained content, off-white background, and
  brand sidebar treatments.
- Kept this leaf layout-only because the reference uses app shell placeholders,
  not photos or generated screenshots.

## Sidebar Layouts variant ledger

| Preview | Local variant |
| --- | --- |
| Simple sidebar | `shell-sidebar-simple` |
| Simple dark sidebar | `shell-sidebar-dark` |
| Sidebar with header | `shell-sidebar-with-header` |
| Dark sidebar with header | `shell-sidebar-dark-with-header` |
| With constrained content area | `shell-sidebar-constrained` |
| With off-white background | `shell-sidebar-off-white` |
| Simple brand sidebar | `shell-sidebar-brand` |
| Brand sidebar with header | `shell-sidebar-brand-with-header` |

## Repeatable parity rule

For Application Shell leaves, each example must encode the shell-level
difference directly: side/top navigation position, dark or light chrome,
header presence, content width, background tone, overlap, and branded treatment.
Counting example names without changing the app shell preview is not enough.

## Verification

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed.
- Chrome route smoke passed: 8 Sidebar Layouts example names, horizontal
  overflow false.
- Local desktop and mobile captures were saved after implementation.
