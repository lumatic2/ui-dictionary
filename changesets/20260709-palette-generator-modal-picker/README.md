# 20260709 Palette Generator Modal Picker

Target: ROADMAP milestone PSS2 - Landing Page Design Quality.

## Scope

- Remove the remaining redundant palette status/preview UI from the Color Palette Generator card.
- Keep only the requested hover actions: remove, view shades, drag reorder, copy, and lock.
- Make the color code itself a clickable color-picker popover.
- Replace the compact export dropdown with an Export Palette modal containing Image, Code, and SVG actions.

## Contract

- Source of truth: `examples/ui-vocabulary-site/src/components/home-page.tsx`.
- Out of scope: pushing to remote, completing PSS2, or implementing every Coolors export format.
- Compatibility: keep the provided seed palette and existing atlas card layout.

## Verification

- [x] `npm run lint` from `examples/ui-vocabulary-site`
- [x] `npm run build` from `examples/ui-vocabulary-site`
- [x] Chrome smoke: no preview/status text, picker popover opens from hex code, requested hover actions visible
- [x] Chrome smoke: drag reorder, lock/generate preservation, and Image/Code/SVG export actions work

## Result

Completed. Chrome smoke confirmed no preview/status text, only the requested hover actions remain, hex click opens the picker popover, pointer drag reorders colors, lock persists through generation, Code/SVG exports write clipboard payloads, and Image export closes without console errors.
