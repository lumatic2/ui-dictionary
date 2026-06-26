# UI Vocabulary Export/Capture Contract

## Goal

UI Vocabulary site should let users turn the same glossary cards they browse on screen into study and sharing assets without a backend, login, external screenshot service, or image generation model.

## Export Modes

### PDF: current

- Saves the currently visible search/filter result.
- Keeps the same term order shown in the card grid.
- Hides navigation, search, split-button controls, and interactive-only chrome during print.
- File name guidance: `ui-vocabulary-current-<yyyy-mm-dd>.pdf`.
- UI entry: header split button main action or `현재 필터 결과 저장`.

### PDF: all

- Temporarily clears search/filter state and saves the full 257-term grid.
- Intended for archive/reference use, not poster-style quick reading.
- File name guidance: `ui-vocabulary-all-<yyyy-mm-dd>.pdf`.
- UI entry: header split button menu `전체 용어 저장`.
- After print, the previous search/filter state is restored.

### PDF: poster

- Renders a compact poster layout for the current category/filter scope.
- Reuses the same `terms.generated.ts` data and `TermVisual` mini mock renderer.
- Best for category-sized subsets. Full 257-term poster is out of scope because it would be unreadable.
- File name guidance: `ui-vocabulary-poster-<scope>-<yyyy-mm-dd>.pdf`.
- UI entry: header split button menu `포스터로 저장`.
- Recommended scope: a major category or detailed group such as `입력` or `커머스·청구`.

### PNG: single term

- Captures one visible term card or term detail export target.
- Uses the user's current DOM state where practical.
- File name guidance: `ui-vocabulary-<term-id>-<yyyy-mm-dd>.png`.
- UI entry: open a term detail sheet, then click `PNG 저장`.

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
- `data-export-ignore="true"`: controls excluded from PNG capture.

## Usage

1. Use the left category navigation or global search to narrow the glossary.
2. Use `PDF로 저장` for the current visible result.
3. Open the split button menu for `전체 용어 저장` or `포스터로 저장`.
4. Open a single term detail sheet and use `PNG 저장` for a standalone term asset.

Browser print handles the final PDF destination and filename. Use the filename guidance above when saving from the print dialog.

## Known Limits

- Poster export is optimized for category-sized subsets, not all 257 terms in one page.
- Native browser print controls the final PDF pagination and filename.
- PNG capture uses the current DOM state and can include interactive mini mock state as currently rendered.
- PNG capture intentionally avoids external image URLs to prevent canvas taint failures.
- The site does not store export history.

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

### Smoke Log: 2026-06-26

- `npm run build`: passed.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Current PDF smoke: `입력` category printed `35 / 257 terms` with `data-print-mode="current"`.
- All PDF smoke: temporarily printed `257 / 257 terms` with `data-print-mode="all"` and restored to the previous filter after print.
- Poster smoke: `입력` rendered 35 poster rows and `커머스·청구` rendered 7 poster rows under `data-export-poster`.
- PNG smoke: `text-field` detail export produced `ui-vocabulary-text-field-2026-06-26.png` with a nonblank `data:image/png` URL.
- Mobile header smoke at `390x844`: no horizontal overflow; PDF split button and search stayed reachable.
