# 20260709 Palette Hover Shades Shader Fill

## Scope

- Prevent palette swatch action icons from staying visible after an icon click by removing focus-within visibility and blurring clicked actions.
- Add smooth enter and exit animation for the View shades strip.
- Recenter left/right Add buttons against the color-board area instead of the full palette card.
- Increase Shader Gradient System visual height to fill the row space next to the taller palette generator card.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms clicked swatch actions hide when the pointer leaves and Add buttons align to the color-board center.
- [x] Browser smoke confirms View shades enter/exit animation classes run and Shader Gradient System fills the lower blank space.
