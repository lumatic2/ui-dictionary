# AUC1 WebGPU Editor Plane

Date: 2026-07-10
Milestone: AUC1 Step 4

## Contract

- Transparent WebGPU canvas draws selection and horizontal/vertical guides outside content DOM.
- Validation scope must pass before the plane reports active.
- Adapter absence, validation failure, and device loss converge on the same DOM fallback state.
- Fallback never changes the canonical document or content DOM.

## Verification

- [x] app build/test (7/7)
- [x] adapter unavailable fallback
- [x] validation error injection
- [x] device-loss injection and real `device.lost` handler
- [x] actual Chrome WebGPU active screenshot
- [x] forced DOM fallback screenshot
- [x] canonical node/mapping equality and fresh-tab console errors 0

Visual verification caught and fixed two real compositing failures: explicit target blending produced a black overlay, and an uninitialized fallback canvas remained visible. The final WebGPU and DOM fallback screenshots both preserve the content plane.
