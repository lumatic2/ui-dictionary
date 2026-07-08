# 20260709 Palette Drag Hover Stable Rail

## Scope

- Hide swatch action stacks while palette drag is active so shifted neighbor columns do not expose hover controls under the pointer.
- Restore a stable bottom rail for the palette card using a compact palette strip and copy action.
- Keep the shade strip inside the same bottom rail so opening View shades does not change the card height.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms drag-shifted columns keep action stacks hidden mid-drag.
- [x] Browser smoke confirms View shades toggles inside a stable-height palette card.
