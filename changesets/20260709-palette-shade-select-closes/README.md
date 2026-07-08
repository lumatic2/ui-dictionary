# 20260709 Palette Shade Select Closes

## Scope

- Close the shade column after a shade option is selected.
- Keep shade selection as an explicit apply action rather than relying on outside-click behavior.
- Preserve the existing outside-click guard for shade column internals.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms selecting a shade closes the shade panel.
- [x] Browser smoke confirms reopening shades still renders a 10-option shade column for the selected color.
