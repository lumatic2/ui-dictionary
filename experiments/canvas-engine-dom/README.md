# DOM/React + Editor Overlay

## Hypothesis

React DOM을 production content renderer로 쓰면 브라우저와 동일한 레이아웃·텍스트·입력·접근성을 유지하면서 5k UI node에서도 60fps 편집 예산을 지킬 수 있다.

## Method

- 공통 canonical fixture 1k/5k/10k를 semantic DOM으로 렌더했다.
- viewport는 단일 CSS transform, selection은 별도 DOM overlay로 갱신했다.
- 90-frame pan/zoom과 90-frame selection trace, 전체 canonical JSON round-trip, source mapping, operation-log replay, synthetic Korean composition을 측정했다.
- Windows system Chrome 149 headless 1440x900@1x에서 자동 측정하고 실제 Chrome에서 1k 화면을 확인했다.

## Results

- pan/zoom p95: 1k `8.4ms`, 5k `8.5ms`, 10k `8.5ms`; 5k까지 `≤16ms` 예산 통과.
- semantic elements: `1,001 / 5,001 / 10,001`; focusable elements: `129 / 643 / 1,285`.
- 10k initial render `218.4ms`, measured JS heap `37.8MB` (single-run noisy indicator).
- canonical full-value round-trip, 10k source mappings, operation replay, synthetic Korean composition 모두 통과.

## Insight

Code-native UI의 fidelity와 native browser semantics를 가장 직접적으로 보존한다. 이번 trace처럼 viewport 전체를 transform하는 경우 10k에서도 병목이 아니었다. 다만 초기 mount와 실제 per-node layout/style mutation은 별도 최적화 대상이며, 화면 밖 node virtualization과 render isolation이 필요하다.
