# Color Palette Generator Sortable Picker

Date: 2026-07-09

## Scope

- Make dragged palette columns follow the pointer while neighboring columns fill the vacated slot live.
- Limit start/end add buttons to their edge hover zones.
- Keep remove collapse and sibling fill animation simultaneous through flex shrink.
- Make the hex picker popover functional with saturation/value and hue dragging.
- Add eyedropper support and keep HEX copy feedback visible.

## Verification

- [x] Type/lint
- [x] Production build
- [x] Chrome smoke: drag reorder and add edge hover
- [x] Chrome smoke: picker, copy toast, shades, export modal
