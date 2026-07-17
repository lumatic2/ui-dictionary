# Topbar Search UX

Date: 2026-07-03

## Decision

Use an expanding topbar search chip instead of an app-level modal dialog.

Reasons:

- The topbar is now Tailwind-like and should stay visually light.
- `Ctrl+F` should focus UI Dictionary search without changing the user's visual context.
- The search target is structured content: terms, patterns, categories, and filters.
- The chip should expand left into a search input, then collapse after a query or selection.

## Implementation

- Added `examples/ui-vocabulary-site/src/components/topbar-search.tsx`
- Topbar search chip expands into an inline search input with a right-anchored width transition
- Collapsed width is the compact `Ctrl F` chip; expanded width is `22rem` on desktop and `calc(100vw - 2rem)` on mobile
- `Ctrl+F`, `Cmd+F`, `Ctrl+K`, and `Cmd+K` open the inline input when focus is not already inside an editable field
- Expanded input autofocuses
- Placeholder is block-search oriented: `Hero, header, footer, feature...`
- Empty-query suggestions use common Tailwind Plus leaves: Hero Sections, Header Sections, Footers, Feature Sections, Pricing Sections, Application Shells, Product Overviews, Checkout Forms
- Arrow up/down moves the active result
- Enter selects the active suggestion or commits the query
- Escape collapses the input

## Verification

Captures:

- `docs/research/assets/search-dialog-2026-07-03/topbar_search_expanded_quick_find.png`
- `docs/research/assets/search-dialog-2026-07-03/topbar_search_mobile_inline_quick_find.png`

Smoke checks:

- `Ctrl+F` expands the topbar chip
- Expanded input receives focus
- Desktop chip expanded from 84px to 352px while the right edge stayed fixed, so the input grows left
- Mobile chip expanded from 76px to 358px within a 390px viewport, with no horizontal overflow
- Empty state shows `바로 찾기` suggestions for Hero, Header, Footer, Feature, Pricing, Application Shells, Product Overviews, and Checkout Forms
- Selecting `Hero Sections` updates the URL to `?filter=nav%3Aplus-marketing-hero-sections` and collapses the input
- Topbar search button expands the same input
- Mobile expansion hides the brand while active so the input does not overlap adjacent header controls
- Side navigation numeric count suffixes are absent across UI Blocks, Docs, Templates, and UI Kit
