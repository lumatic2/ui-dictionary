# SVG Scenegraph + Embedded DOM

## Hypothesis

SVG는 vector geometry와 zoom 정밀도를 제공하고 `foreignObject`가 UI input fidelity를 보존할 수 있다.

## Method

- 모든 canonical node를 SVG `g/rect`로 렌더하고 첫 node에 `foreignObject` input을 삽입했다.
- viewport는 SVG root transform, selection은 SVG rect mutation으로 갱신했다.
- 동일 trace와 DOM baseline pixel diff, semantic/focus coverage, Korean composition을 측정했다.

## Results

- pan/zoom p95: 1k `8.5ms`, 5k `8.5ms`, 10k `9.4ms`; interaction budget 통과.
- DOM 대비 1k screenshot mismatch `0.86%`로 후보 중 가장 낮았다.
- semantic elements는 모든 크기에서 `2`, focusable element는 `1`뿐이었다.
- embedded input의 synthetic Korean composition과 canonical/source round-trip은 통과했다.
- 10k initial render `222.2ms`, measured JS heap `41.9MB`.

## Insight

Vector drawing fidelity는 우수하지만 전체 UI를 SVG로 표현하면 React/browser semantics와 focus model을 재구축해야 한다. 아이콘·Bezier/path 편집·selection geometry 같은 vector island에는 적합하나 production component tree의 기본 renderer로는 부적합하다. `foreignObject`는 좁은 text-edit bridge이지 전체 UI fidelity 전략이 아니다.
