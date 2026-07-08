# Palette Drag Axis Visual

Date: 2026-07-09

## Scope

- Constrain palette drag overlay movement to the horizontal axis only.
- Remove the white outline/ring from the grabbed color column.
- Make the grabbed column fully opaque so the target slot does not visually duplicate through it.
- Re-check behavior against the Coolors drag reference.

## Verification

- [x] Type/lint
- [x] Production build
- [x] Chrome reference check: Coolors drag axis/visual behavior
- [x] Chrome smoke: local drag stays horizontal, opaque, and reorders
