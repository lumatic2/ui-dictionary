# Palette Drag Verified Shift

Date: 2026-07-09

## Scope

- Fix the animation override that prevented dragged placeholders and neighbor transforms from appearing.
- Disable `palette-generator-enter` while dragging so opacity and transform styles apply.
- Flush `dragTargetIndex` updates during pointer movement so neighbor shifts render before drop.
- Add a drag preview data attribute for targeted visual smoke verification.

## Verification

- [x] Type/lint
- [x] Production build
- [x] Standalone Playwright mid-drag screenshot: `tmp/palette-mid-drag-fixed.png`
- [x] Mid-drag computed styles: source opacity `0`; intervening colors transform `matrix(... -108, 0)`; final drop order commits
