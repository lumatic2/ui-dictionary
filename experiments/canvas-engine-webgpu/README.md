# Custom WebGPU Mini-engine

## Hypothesis

GPU instancing은 대규모 geometry의 mount/draw 비용을 낮추지만 text/layout/accessibility/source fidelity 비용을 드러낼 것이다.

## Method

- canonical geometry를 32-byte instance records로 저장하고 하나의 WebGPU draw call로 rectangle scene을 렌더했다.
- DOM semantic mirror에는 선택 control과 Korean input만 유지했다.
- 실제 Chrome에서 WGSL uniform alignment 오류를 재현·수정하고 validation scope 통과 후 draw 성공을 확인했다.
- 동일 trace, full canonical round-trip, screenshot diff, semantic/focus coverage를 측정했다.

## Results

- pan/zoom p95: 1k `8.4ms`, 5k `8.5ms`, 10k `8.5ms`; dropped-frame ratio `0%`.
- 10k initial render `65.0ms`로 DOM `218.4ms`보다 짧았다. 실행 순서·warm-up 영향이 있으므로 절대 배수로 해석하지 않는다.
- DOM 대비 1k screenshot mismatch `16.40%`; text, border, browser control rendering이 빠진 영향이 크다.
- semantic elements `3`, focusable elements `2`로 scene node semantics가 사라졌다.
- canonical/source/operation-log round-trip과 semantic mirror input의 synthetic Korean composition은 통과했다.

## Insight

Dense geometry hot path의 잠재력은 확인했지만 production UI renderer로 채택하면 browser layout, font shaping, native controls, a11y tree를 별도 엔진으로 다시 만들어야 한다. C++/Rust/Wasm custom engine을 금지할 근거는 없지만 지금 main renderer로 채택할 근거도 부족하다. geometry, hit testing, display-list preparation처럼 측정된 병목만 native/Wasm seam 뒤로 이동하는 후보로 유지한다.
