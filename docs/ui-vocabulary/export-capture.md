# UI Vocabulary Export/Capture Contract

## Goal

UI Vocabulary site should let users turn the same glossary cards they browse on screen into study and sharing assets without a backend, login, external screenshot service, or image generation model.

## Export Modes

### PDF: current

- Saves the currently visible search/filter result.
- Keeps the same term order shown in the card grid.
- Hides navigation, search, split-button controls, and interactive-only chrome during print.
- File name guidance: `ui-vocabulary-current-<yyyy-mm-dd>.pdf`.

### PDF: all

- Temporarily clears search/filter state and saves the full 257-term grid.
- Intended for archive/reference use, not poster-style quick reading.
- File name guidance: `ui-vocabulary-all-<yyyy-mm-dd>.pdf`.

### PDF: poster

- Renders a compact poster layout for the current category/filter scope.
- Reuses the same `terms.generated.ts` data and `TermVisual` mini mock renderer.
- Best for category-sized subsets. Full 257-term poster is out of scope because it would be unreadable.
- File name guidance: `ui-vocabulary-poster-<scope>-<yyyy-mm-dd>.pdf`.

### PNG: single term

- Captures one visible term card or term detail export target.
- Uses the user's current DOM state where practical.
- File name guidance: `ui-vocabulary-<term-id>-<yyyy-mm-dd>.png`.

## Dependency Decision

PNG capture uses `html-to-image`.

Reasons:

- Runs entirely in the browser.
- Captures a specific DOM node to PNG data URL/blob.
- Fits the static Vite app architecture.
- Does not require secrets, remote upload, or a screenshot API.

## Stable DOM Contracts

The implementation should use stable attributes instead of brittle text selectors:

- `data-export-root`: the page-level export region.
- `data-export-card`: a single term card capture target.
- `data-export-detail`: a detail sheet/card capture target.
- `data-export-poster`: poster view capture/print target.
- `data-print-hidden`: screen controls hidden in print.
- `data-print-grid`: printable card grid.
- `data-print-card`: printable card.

## Non-Goals

- No server-side capture.
- No remote screenshot service.
- No login or saved export history.
- No image generation model.
- No single giant PNG containing all 257 terms.
- No external image URLs that can taint canvas capture.

## Verification

Required for implementation steps:

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

Additional smoke checks should verify:

- Current PDF mode keeps current count/scope.
- All PDF mode uses all terms.
- Poster mode renders `data-export-poster`.
- Single-card PNG helper returns a nonblank PNG data URL/blob.
