# Palette Drag Follow

Date: 2026-07-09

## Scope

- Make the grabbed color column render as a fixed overlay that follows the pointer during drag.
- Collapse the original dragged column to zero width so neighboring color columns fill the empty space immediately.
- Move start/end add buttons inside the palette card bounds to avoid clipping.
- Confirm Generate uses the local `paletteGeneratorSets` data and preserves locked colors.

## Verification

- [x] Type/lint
- [x] Production build
- [x] Chrome smoke: dragged color follows pointer while neighbors fill
- [x] Chrome smoke: add buttons are visible inside card edge hover zones
