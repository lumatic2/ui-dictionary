# Tailwind Plus Hero Sections baseline contract

Date: 2026-07-01
Related phase: `phases/tailwind-plus-leaf-visual-parity/index.json`, Step 1

## Purpose

Hero Sections is the local quality baseline for the Tailwind Plus leaf visual
parity pass. Sibling leaves should be compared against this page before they are
called visually complete.

## Reference and local routes

| Surface | URL |
| --- | --- |
| Tailwind reference | `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes` |
| Local route | `http://127.0.0.1:5181/?filter=nav%3Aplus-marketing-hero-sections` |

## Evidence

| Evidence | Path |
| --- | --- |
| Tailwind desktop reference | `docs/research/assets/tailwind-plus-live-2026-07-01/hero-sections-detail-viewport.png` |
| Tailwind mobile reference | `docs/research/assets/hero-sections-mobile-2026-07-01/tailwind-hero-sections-mobile-390.png` |
| Local desktop baseline | `docs/research/assets/local-hero-sections-2026-07-01/hero-sections-local-desktop-viewport.png` |
| Local mobile baseline | `docs/research/assets/hero-sections-mobile-2026-07-01/local-hero-sections-mobile-390.png` |
| Current Chrome desktop check | `docs/research/assets/hero-baseline-contract-2026-07-01/local-hero-current-chrome-viewport.png` |

## Baseline requirements

- Sidebar hierarchy matches the Tailwind Plus Marketing tree and keeps Hero
  Sections active under Page Sections.
- Page title is `Hero Sections` with the Tailwind-like breadcrumb and compact
  description block.
- Local page exposes 12 hero examples.
- Example headings currently observed in the local page:
  - Simple centered
  - Split with screenshot
  - Split with bordered screenshot
  - Split with code example
  - Simple centered with background image
  - With bordered app screenshot
  - With app screenshot
  - With phone mockup
  - Split with image
  - With angled image on right
  - With image tiles
  - With offset image
- Each example keeps the Tailwind-like preview toolbar rhythm: Preview, Code,
  and a locked/Get the code affordance where applicable.
- Desktop page has no document-level horizontal overflow.
- Mobile baseline uses the existing 390px evidence pair and must remain the
  comparison target for sibling leaf mobile passes.

## Current Chrome smoke

Chrome opened the local route on 2026-07-01 and observed:

| Check | Result |
| --- | --- |
| Local route loaded | pass |
| Local heading set includes `Hero Sections` | pass |
| Preview mentions | 12 |
| Code mentions | 1 |
| Get the code mentions | 11 |
| Document scroll width | 2545 |
| Document client width | 2545 |
| Desktop horizontal overflow | false |

## How to use this contract

For every later leaf:

1. Capture Tailwind desktop and mobile first.
2. Compare the leaf page shell against this Hero baseline.
3. Match the Tailwind visible example count unless the visual ledger records a
   specific public-access or compression reason.
4. Do not mark `visual-parity-verified` if the page only has route/capture
   parity or three generic previews.
