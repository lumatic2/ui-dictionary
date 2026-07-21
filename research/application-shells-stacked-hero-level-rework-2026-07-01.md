# Application UI Stacked Layouts hero-level rework evidence

Date: 2026-07-01

## Scope

Stacked Layouts was reworked as the first Application UI leaf that applies the
same stricter bar used for Feature, CTA, and Pricing Sections. The previous
state matched the example names, but all nine examples reused the same compact
`shell-stacked-page` preview. This pass gives each visible Tailwind example a
distinct local variant.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked`
- Local route: `/?filter=nav%3Aplus-application-shells-stacked-layouts`

## Evidence

- Tailwind desktop: `docs/research/assets/application-shells-stacked-hero-level-rework-2026-07-01/tailwind-stacked-layouts-desktop.png`
- Tailwind mobile: `docs/research/assets/application-shells-stacked-hero-level-rework-2026-07-01/tailwind-stacked-layouts-mobile.png`
- Local desktop: `docs/research/assets/application-shells-stacked-hero-level-rework-2026-07-01/local-stacked-layouts-desktop.png`
- Local mobile: `docs/research/assets/application-shells-stacked-hero-level-rework-2026-07-01/local-stacked-layouts-mobile.png`

## What changed

- Added nine Stacked Layouts preview variants instead of reusing one preview.
- Rebuilt the preview as a larger app shell with dark top navigation, avatar,
  page header, content background, and dashed work area.
- Added variant-specific differences for lighter header, bottom border, subtle
  background, branded navigation, compact header, overlap, and two-row
  navigation.
- Kept this leaf layout-only because the Tailwind reference uses structural app
  shell placeholders, not photos or generated screenshots.

## Stacked Layouts variant ledger

| Preview | Local variant |
| --- | --- |
| With lighter page header | `shell-stacked-lighter-header` |
| With bottom border | `shell-stacked-bottom-border` |
| On subtle background | `shell-stacked-subtle-background` |
| Branded nav with compact lighter page header | `shell-stacked-brand-compact-header` |
| With overlap | `shell-stacked-overlap` |
| Brand nav with overlap | `shell-stacked-brand-overlap` |
| Branded nav with lighter page header | `shell-stacked-brand-lighter-header` |
| With compact lighter page header | `shell-stacked-compact-header` |
| Two-row navigation with overlap | `shell-stacked-two-row-overlap` |

## Repeatable parity rule

For Application UI leaves, matching example names is not enough. Record whether
each example has a distinct local preview variant, especially when the Tailwind
page changes app chrome, background, density, borders, or overlap behavior. A
shared renderer is acceptable only when props or variant branches visibly encode
the reference differences.

## Verification

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed.
- Chrome route smoke passed: 9 Stacked Layouts example names, horizontal
  overflow false.
- Local desktop and mobile captures were saved after implementation.
