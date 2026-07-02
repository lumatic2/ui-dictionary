# Tailwind Plus header parity

Date: 2026-07-03

## Problem

The local page header used an app-style header:

- Large `UI 용어 사전` brand block
- Segmented `UI Blocks / Templates / UI Kit` buttons
- Full search input in the top row
- A second all-caps breadcrumb inside the page content

Tailwind Plus uses a catalog header:

- Thin global topbar with logo, promo pill, search chip, product links, sign-in, and access CTA
- Separate breadcrumb row with menu button and parent path
- Page content starts directly with the page title and description

## Reference Captures

- Tailwind desktop: `docs/research/assets/header-parity-2026-07-03/tailwind_desktop.png`
- Tailwind mobile: `docs/research/assets/header-parity-2026-07-03/tailwind_mobile.png`
- Local before desktop: `docs/research/assets/header-parity-2026-07-03/local_desktop.png`
- Local before mobile: `docs/research/assets/header-parity-2026-07-03/local_mobile.png`

## Local Fix

Updated `examples/ui-vocabulary-site/src/App.tsx`:

- Replaced the app-style header with a thin Tailwind-like global topbar
- Converted product surface buttons into text links
- Added a Tailwind-like promo pill and `Ctrl K` search chip
- Added `Sign in` and `Get full access` visual-only actions
- Kept mobile as logo + search + more, matching Tailwind density
- Moved breadcrumb into a dedicated second header row
- Removed the repeated all-caps page breadcrumb from UI Blocks catalog content
- Reduced page top padding and removed the empty separator when there is no active search

## Verification

Build:

`npm run build`

Lint:

`npm run lint`

Known lint state: only the pre-existing shadcn fast-refresh warnings remain.

Final local captures:

- `docs/research/assets/header-parity-2026-07-03/local_desktop_final.png`
- `docs/research/assets/header-parity-2026-07-03/local_mobile_final.png`

Smoke checks:

- `UI Dictionary` brand present
- `Application Shells` parent breadcrumb present
- `PLUS / UI BLOCKS` all-caps duplicate absent
- `Stacked Layouts` title present
- Desktop product links present

## Remaining Difference

Resolved after follow-up shell pass:

- The header now renders outside the desktop two-column grid.
- The desktop persistent sidebar is visible by default below the topbar.
- The header-underlay hamburger and breadcrumb row were removed after review; they were an accidental intermediate implementation and are not part of the current local parity target.
- The sidebar still uses Tailwind-shaped uppercase group headings and leaf links without count suffixes.

Follow-up capture:

`docs/research/assets/shell-layout-parity-2026-07-03/local_persistent_sidebar_bar_removed.png`

DOM smoke:

- Header: `x=0`, full viewport width
- Header has no second breadcrumb row and no hamburger nav button
- Sidebar: persistent `aside` starts below header at `y=57`
- `Introducing Oatmeal` absent
- UI Blocks sidebar still renders uppercase group headings and leaf links
- UI Blocks sidebar count suffixes remain absent
