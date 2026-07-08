# 20260709 Palette Shade Column Selection

## Scope

- Sort Color Palette Generator shades from bright at the top to dark at the bottom.
- Remove the persistent floating HEX chip from the shade column.
- Show each shade HEX code only on hover or keyboard focus.
- Mark the currently selected shade with a dot.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms shade rows are ordered bright to dark.
- [x] Browser smoke confirms no persistent HEX chip remains, shade hover reveals the HEX code, and the selected shade has one dot.
