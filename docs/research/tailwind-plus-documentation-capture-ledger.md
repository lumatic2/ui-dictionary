# Tailwind Plus Documentation Capture Ledger

Date: 2026-07-03

## Reference Scope

The correct reference for this pass is Tailwind Plus Documentation, not the public Tailwind CSS `/docs` surface.

- Start URL: `https://tailwindcss.com/plus/ui-blocks/documentation`
- Element URL: `https://tailwindcss.com/plus/ui-blocks/documentation/command-palette`
- Element URL: `https://tailwindcss.com/plus/ui-blocks/documentation/dialog`

## Reference Evidence

- `docs/research/assets/tailwind-plus-documentation-2026-07-03/getting-set-up-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/getting-set-up-mobile.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/command-palette-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/command-palette-mobile.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/dialog-desktop.png`

Chrome control was repaired before this capture set. The stale Chrome plugin cache at `chrome/26.623.30605` was missing `docs/`; copying the same plugin docs from `chrome/26.623.42026/docs` restored `chrome.documentation()`.

## Observations

- Documentation is not a landing-card page. It is a page family with a persistent left docs nav.
- The left nav has two groups: `Getting started` and `Elements`.
- Setup pages use article flow: breadcrumb eyebrow, large title, section headings, paragraphs, and dark code blocks.
- Element pages use article flow plus live example, component API table, examples, and an `On this page` rail.
- Mobile keeps the article-first rhythm and hides persistent desktop rails.

## Local Implementation

- Added Documentation nav ids for all `Getting started` and `Elements` entries.
- Changed Documentation entry to open `Getting set up` by default.
- Replaced the prior category accordion with Tailwind Plus-style docs nav groups.
- Added `DocsArticlePage` and wired every Documentation nav item to an article page.
- Implemented custom pages for `Getting set up`, `Using React`, `Command palette`, `Dialog`, and `Tabs`.
- Added template-backed article pages for the remaining docs nav entries so no item falls back to a raw search-only list.

## Local Evidence

- `docs/research/assets/tailwind-plus-documentation-2026-07-03/local-smoke/docs-getting-set-up-chrome.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/local-smoke/docs-command-palette-chrome.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/local-smoke/docs-getting-set-up-mobile.png`
- `docs/research/assets/tailwind-plus-documentation-2026-07-03/local-smoke/docs-command-palette-mobile.png`

## Verification

- `npm run build` passes.
- `npm run lint` passes with the existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Chrome smoke checked all 15 Documentation nav ids. Each rendered an article page, none fell back to search-only output, and console logs had no errors or warnings.
