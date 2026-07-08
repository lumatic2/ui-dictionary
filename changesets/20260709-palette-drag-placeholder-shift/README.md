# Palette Drag Placeholder Shift

Date: 2026-07-09

## Scope

- Stop mutating palette order during pointer movement.
- Keep the grabbed color's original slot as a placeholder while dragging.
- Slide intervening color columns into the placeholder with horizontal transforms.
- Commit the actual reorder only on pointer up.

## Verification

- [x] Type/lint
- [x] Production build
- [x] Chrome smoke: drag right shifts intervening colors left before drop
- [x] Chrome smoke: final order commits on drop without console errors
