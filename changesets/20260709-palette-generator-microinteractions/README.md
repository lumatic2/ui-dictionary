# 20260709 Palette Generator Microinteractions

Target: ROADMAP milestone PSS2 - Landing Page Design Quality.

## Scope

- Remove the selected-color outline behavior.
- Add edge add buttons for inserting palette colors.
- Add action tooltips for the five hover controls.
- Show copy feedback after HEX copy.
- Keep shade sets fixed while applying shades and expand them to ten choices.
- Make drag reorder visibly move the color column while dragging.
- Dismiss picker/shades/export when clicking elsewhere.

## Contract

- Source of truth: `examples/ui-vocabulary-site/src/components/home-page.tsx`.
- Out of scope: pushing to remote or completing PSS2.

## Verification

- [x] `npm run lint` from `examples/ui-vocabulary-site`
- [x] `npm run build` from `examples/ui-vocabulary-site`
- [x] Chrome smoke: add, tooltip, copy toast, picker dismiss, and no selected outline
- [x] Chrome smoke: fixed 10-shade panel, remove animation, and visible drag reorder

## Result

Completed. Chrome smoke confirmed add buttons, tooltip labels, no selected outline, HEX copy toast with clipboard payload, picker dismiss behavior, 10 shade choices, fixed shade set after applying a shade, and visible drag movement. Final console error/warn list was empty.
