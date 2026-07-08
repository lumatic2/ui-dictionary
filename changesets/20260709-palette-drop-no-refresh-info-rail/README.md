# 20260709 Palette Drop No Refresh Info Rail

## Scope

- Prevent the palette-wide enter animation from replaying after drag drop reorder.
- Restore the bottom rail as selected color information plus palette name instead of a palette strip or copy CTA.
- Keep the shade controls inside the same stable bottom rail so View shades does not resize the card.

## Verification

- [x] Lint passes.
- [x] Production build passes.
- [x] Browser smoke confirms drag drop does not replay palette-wide enter animation.
- [x] Browser smoke confirms bottom rail shows color name, HEX/RGB/HSL, and palette name while remaining stable when shades open.
