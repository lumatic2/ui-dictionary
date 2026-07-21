# 212 — webgpu-selection-tint

- 날짜: 2026-07-21
- milestone: ECT2 step-2 후속 (스크린샷 육안 확인에서 발견)
- horizon: editor-color-and-token-editing

## 무엇을 발견했나

ECT2 step-2를 브라우저로 확인하다가, **인스펙터 견본과 캔버스가 다른 색으로 보였다.**
사용자가 볼 수 없는 상황이라 눈 대신 **픽셀을 쟀다.**

같은 CSS 문자열(`oklch(0.58 0.22 27)`, 빨강)을 한 화면에 세 곳에 칠하고 한 장으로 찍어 비교:

| 위치 | 픽셀 |
|---|---|
| 대조군 div (캔버스 밖) | `#DF2225` ✅ |
| 인스펙터 견본 | `#DF2225` ✅ |
| **캔버스 노드** | **`#FF4AF2`** ❌ 마젠타 |

## 범인을 좁힌 과정

1. hex로 바꿔도 같음 → oklch 문제 아님
2. **캔버스 안에 넣은 평범한 div는 정상** → 컨테이너·transform 문제 아님
3. 선택 오버레이를 숨겨도 같음 → DOM 오버레이 아님
4. 노드에 매칭되는 CSS 규칙 0건, 문서 전체에 filter/blend/backdrop 0건 → DOM은 결백
5. **`pointer-events:none`이라 `elementsFromPoint`에 안 잡히던 `canvas.webgpu-editor-canvas` 발견**
6. 그 캔버스를 숨기니 노드가 `#DF2225`로 정확히 복귀 → **확정**

## 원인 — 프리멀티플라이드 계약 위반

`context.configure({ alphaMode: 'premultiplied' })`인데 셰이더가 색을 알파와 곱하지 않고 넘겼다
(`rects.set([..., 0.49, 0.18, 0.83, 0.18])`).

합성식 `src.rgb + dst.rgb*(1-src.a)`로 계산하면:
`(0.49, 0.18, 0.83) + (0.875, 0.133, 0.145)×0.82 = (1.21, 0.29, 0.95)` → 클램프 → **`#FF4AF2`**
— **측정값과 정확히 일치.** 추정이 아니라 산술로 확정했다.

## 왜 이게 중요한가

선택 틴트는 **선택된 노드**에만 그려진다. 그런데 색을 판단하려면 그 노드를 선택해야 한다 —
**판단하려는 대상이 바로 오염되는 대상이다.** ECT2가 "색을 보고 고른다"를 만드는 milestone이라
그냥 넘길 수 없었다.

또 ECT2 스캐폴딩 결정이 명시적으로 막으려던 실패("견본과 캔버스가 다른 색")가 **다른 층에서**
실제로 일어나 있었다. 내 가드는 DOM 렌더러만 덮었고 WebGPU 평면은 못 봤다.

## 수정

`premultiplied()`로 RGB에 알파를 곱해 넘긴다. 선택(0.18)·가이드(0.72) 둘 다.

수정 후 같은 지점 픽셀 = **`#CD2444`** (예상값과 채널차 **0**) — 빨강에 보라 틴트 18%.

## 변경 파일

- `apps/agent-design/src/editorPlaneRuntime.ts` — `SELECTION_TINT`·`premultiplied()` 신설·적용
- `apps/agent-design/src/editorPlaneRuntime.test.ts` — 신설, 회귀 4건

## Verification

| 항목 | 결과 |
|---|---|
| 알파가 RGB에 곱해져 나감 | PASS |
| 알파 1·0 경계 | PASS |
| **합성 계산이 실측 픽셀 두 값을 재현** (`#FF4AF2` 결함 / `#CD2444` 수정) | PASS |
| **브라우저 픽셀 실측** — 수정 후 `#CD2444`, 예상과 채널차 0 | PASS |
| `npm test` (apps/agent-design) | 171 passed / 15 files |
| canvas-core `vitest run` | 88 passed |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

증거: `evidence/editor-color-and-token-editing/ect2/ect2-{pixel-probe,hex-probe,no-overlay,no-webgpu,webgpu-fixed}.png`

## 배운 것

**스크린샷을 눈으로 보는 것만으로는 색 결함을 못 잡는다.** 처음엔 "민트인데 분홍으로 보인다"를
내 눈 탓으로 의심했고, 채도 높은 색으로 바꿔서야 이상하다고 확신했다. 결정적 판정은
**같은 이미지 안에 대조군을 넣고 픽셀을 비교**한 것이었다.

색을 다루는 UI의 검증에는 대조군 + 픽셀 측정이 필요하다 — ECT5 관측 설계에 반영한다.
