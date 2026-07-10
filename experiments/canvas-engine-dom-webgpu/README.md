# DOM/React + WebGPU Overlay

## Hypothesis

Production UI는 DOM에 남기고 selection/guides/viewport 장식만 WebGPU로 옮기면 fidelity를 잃지 않고 editor hot path를 분리할 수 있다.

## Method

- DOM baseline과 같은 canonical DOM을 유지하고 투명 WebGPU canvas overlay를 추가했다.
- GPU storage buffer에 공통 geometry를 올리고 instanced rectangles를 draw했다.
- WGSL validation error scope와 unsupported adapter 상태를 명시적으로 기록했다.
- 동일 trace/round-trip/IME/a11y 측정과 DOM baseline screenshot diff를 수행했다.

## Results

- WebGPU는 automated system Chrome과 실제 Chrome에서 모두 활성화됐고 validation 후 draw를 확인했다.
- pan/zoom p95: 1k `8.5ms`, 5k `8.4ms`, 10k `8.4ms`; DOM 대비 유의미한 개선은 관측되지 않았다.
- DOM과 동일한 semantic/focus/IME/source round-trip 표면을 유지했다.
- DOM 대비 1k screenshot mismatch `1.92%`; overlay 자체가 만드는 의도된 차이를 포함한다.
- 10k measured JS heap `49.5MB`, DOM보다 약 `11.7MB` 높았다. GPU memory는 이 값에 포함되지 않는다.

## Insight

이번 단순 trace에서는 성능 이득보다 분리 가능한 editor rendering plane이 가치였다. 따라서 WebGPU를 content renderer로 선결정하지 않고 selection, guides, multiplayer cursors, minimap, dense hit-test visualization처럼 DOM과 독립적인 hot path에 제한하는 것이 타당하다. 실제 장식 복잡도가 올라갈 때 다시 DOM overlay와 비교해야 한다.
