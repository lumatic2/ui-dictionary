# Tailwind Plus side navigation parity

Date: 2026-07-03

## Problem

The local UI Blocks sidebar used the same leaf labels as Tailwind Plus, but it rendered the hierarchy with UI Dictionary search-result counts:

- Product row: `Application UI 146`
- Group row: `Forms 62`
- Leaf row: `Stacked Layouts 3`

Those numbers were not Tailwind Plus navigation structure. They were term/filter match counts from `filterCounts`, so the sidebar mixed two different mental models: Tailwind's component catalog navigation and UI Dictionary's vocabulary search index.

## Tailwind Reference

Reference page:

`https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked`

Captured drawer:

`docs/research/assets/side-nav-parity-2026-07-03/tailwind_stacked_nav_drawer.png`

Observed structure:

- Top axis list: `Marketing`, `Application UI`, `Ecommerce`, `Documentation`
- Active axis groups are uppercase labels, for example `APPLICATION SHELLS`, `HEADINGS`, `DATA DISPLAY`
- Leaves are plain links under each group, for example `Stacked Layouts`, `Sidebar Layouts`, `Multi-Column Layouts`
- No product, group, or leaf count suffixes are shown in the drawer

## Local Fix

Changed `StaticUiBlocksNavTree` in `examples/ui-vocabulary-site/src/App.tsx` so UI Blocks uses a Tailwind-shaped tree:

- Removed the extra product-level row such as `Application UI 364`
- Removed group and leaf count suffixes
- Rendered group labels as uppercase mono headings
- Rendered leaf items under a left rule with active border/weight styling
- Kept the existing source of truth, `uiBlockSections`, for the Marketing / Application UI / Ecommerce leaf structure

Templates and UI Kit still use the older count-based `StaticPlusNavItem` pattern because their public pages are not fully visible without purchase and they are not part of this UI Blocks sidebar parity fix.

## Verification

Build:

`npm run build`

Local screenshot after fix:

`docs/research/assets/side-nav-parity-2026-07-03/local_application_after_tailwind_nav_shape.png`

Smoke assertion against `/?filter=nav%3Aplus-application-shells-stacked-layouts`:

- `Application UI 364` absent
- `Stacked Layouts 9` absent
- `APPLICATION SHELLS`, `Stacked Layouts`, `Sidebar Layouts`, `FORMS`, and child leaves present

## Repeat Rule

For UI Blocks side navigation parity, compare against Tailwind's opened navigation drawer, not the footer sitemap and not local search-result counts. The sidebar structure is product axis -> uppercase group heading -> leaf link.
