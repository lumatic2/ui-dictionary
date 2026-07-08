# 20260709 Palette Rail Export Verification

## Scope

- Remove the awkward palette-name card from the Color Palette Generator bottom rail.
- Keep a fixed invisible shade slot so View shades does not resize the palette card.
- Verify Export Palette image, code, and SVG actions with browser automation.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms the bottom rail no longer shows a palette-name card and remains stable when shades open.
- [x] Browser smoke confirms Export Image downloads a PNG and Export Code/SVG write the expected payloads.
