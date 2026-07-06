# Tailwind Documentation Capture Ledger

Date: 2026-07-03

Status: superseded for the current UI Dictionary Documentation parity pass. The correct reference is Tailwind Plus `https://tailwindcss.com/plus/ui-blocks/documentation`; see `docs/research/tailwind-plus-documentation-capture-ledger.md`.

## Capture Set

- `https://tailwindcss.com/docs`
  - Desktop: `docs/research/assets/tailwind-documentation-2026-07-03/docs-index-desktop.png`
  - Mobile: `docs/research/assets/tailwind-documentation-2026-07-03/docs-index-mobile.png`
- `https://tailwindcss.com/docs/installation`
  - Desktop: `docs/research/assets/tailwind-documentation-2026-07-03/docs-installation-desktop.png`
- `https://tailwindcss.com/docs/styling-with-utility-classes`
  - Desktop: `docs/research/assets/tailwind-documentation-2026-07-03/docs-styling-utilities-desktop.png`

Chrome extension route failed before usable browser documentation was available (`Packaged browser documentation directory is missing.`), so this pass used Playwright screenshots as the capture fallback.

## Reference Observations

- Desktop uses a persistent left docs rail, a narrow patterned gutter, a centered article column, and a right on-this-page rail on leaf pages.
- Primary page rhythm is article-first: uppercase section eyebrow, large plain title, short lead paragraph, then a compact section heading.
- Installation docs use horizontal tabs directly under the section heading, followed by numbered steps paired with dark terminal/code blocks.
- Core concept leaf pages use the same article rhythm but replace installation steps with an example card, dark code block, and in-page anchor list.
- Mobile hides the full sidebar, keeps a compact top breadcrumb row, and lets the article content start immediately with the same eyebrow/title/lead hierarchy.

## Implementation Target

- Keep the existing UI Vocabulary Plus shell and topbar search intact.
- Replace the Documentation landing's flat category list with a docs-style overview:
  - `Documentation` eyebrow and article headline.
  - Getting Started tabs modeled after Tailwind docs installation tabs.
  - Numbered getting-started rows with compact code/example blocks.
  - A docs index grid that still routes to current filters.
- Add leaf-page preview blocks for docs filters so `Layout`, `Styling`, `Interaction`, and related documentation sections feel like docs pages, not only search result lists.

## Mismatch Ledger

- Intentional: local topbar/search remains the existing UI Vocabulary shell instead of Tailwind's exact header, because the previous parity pass stabilized `TopbarSearch`.
- Intentional: right-side on-this-page rail is represented inside the landing/preview content rather than as a new global third column, to avoid destabilizing the existing two-column app shell.
- Verified: desktop and 390px mobile preserve the `Ctrl+F` inline search expansion. Evidence:
  - `docs/research/assets/tailwind-documentation-2026-07-03/local-smoke/documentation-search-expanded-desktop.png`
  - `docs/research/assets/tailwind-documentation-2026-07-03/local-smoke/documentation-search-expanded-mobile.png`
- Verified: local Documentation landing and Styling leaf page render with docs-style article rhythm. Evidence:
  - `docs/research/assets/tailwind-documentation-2026-07-03/local-smoke/documentation-landing-desktop.png`
  - `docs/research/assets/tailwind-documentation-2026-07-03/local-smoke/documentation-landing-mobile.png`
  - `docs/research/assets/tailwind-documentation-2026-07-03/local-smoke/documentation-styling-desktop.png`
