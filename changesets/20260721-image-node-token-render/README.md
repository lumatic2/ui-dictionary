# 220 — image-node-token-render

- 날짜: 2026-07-21
- milestone: ECT4 step-2 — **ECT4 완료**
- horizon: editor-color-and-token-editing

## 전제가 틀렸다

이 step은 "이미지 노드는 렌더러가 `tokenBindings`를 아예 참조하지 않으므로 확장한다"를
전제로 설계됐다. **착수 전 실측했더니 거짓이었다.**

| 항목 | 값 |
|---|---|
| 이미지 노드 인라인 배경 | `oklch(0.95 0.015 270)` |
| `documentTokens().resolve('surface.muted')` | `oklch(0.95 0.015 270)` |
| **일치** | **true** |

`<img>`도 `shared.style`(=`nodeStyle`)을 받는다(`CanvasSurface.tsx:177`).
배경 바인딩은 **처음부터 칠해지고 있었다.**

## 이 틀린 문장이 어디까지 갔나

세션 첫 실사(코드 탐색)에서 나온 한 문장이 **네 곳으로 전파**됐다:

1. horizon 문서 "현 상태 실사" 2번 — 4표면 논거의 한 축
2. ECT3의 `bindableColorKeys`가 이미지 노드를 제외 — 사용자가 EU5에서 막힌 바로 그 노드
3. ECT4 step-2의 존재 이유 자체
4. **사용자 결정 3** ("이미지 노드: 렌더러까지 확장한다") — **사용자가 거짓 전제 위에서 선택했다**

### EU5의 진짜 원인

렌더러가 아니라 **그 노드에 바인딩이 없었고 새로 묶을 경로도 없었던 것**이다.
ECT3의 묶기 어포던스가 이미 해결한 문제이고, 결정 3이 요구한 결과는 **이미 충족돼 있었다.**

### 왜 이제야 잡혔나

첫 실사는 **코드를 읽어** "image 분기에 tokenBindings가 안 보인다"고 판단했다.
실제로는 공통 `shared` 객체를 통해 흘러들어오고 있었고, 그건 읽어서는 놓치기 쉽다.
**렌더해서 재니 5분 만에 나왔다.**

## 그래서 step-2가 한 일

"렌더러 확장"이 아니라 **틀린 전제로 막아둔 것을 열고, 실제로 칠해지는지 렌더 테스트로
고정**하는 일이 됐다. 기록(horizon 문서·plan)에 정정을 붙였다 —
plan 본문은 승인 hash 보존을 위해 고치지 않고 상단에 정정 블록을 얹었다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — 이미지 제외 규칙 제거 + 이유 기록
- `apps/agent-design/src/CanvasSurface.test.tsx` — 이미지 렌더 3건
- `apps/agent-design/src/PropertyInspector.test.tsx` — 이미지 묶기 가능으로 뒤집음
- `plans/horizons/2026-07-editor-color-and-token-editing.md` — 실사 2 정정
- `plans/2026-07-21-ect4-image-node-and-contract.md` — 전제 정정 블록
- `evidence/editor-color-and-token-editing/ect4-image-render.md` — ECT4 증거

## Verification

| 항목 | 결과 |
|---|---|
| 이미지 노드에 묶기 어포던스가 나온다 | PASS |
| 배경 바인딩이 렌더에 반영 (캔버스와 같은 해석 함수 값) | PASS |
| 바인딩 없으면 이전과 동일 — 시각 회귀 없음 | PASS |
| 미해결 바인딩은 표시되고 폴백 색으로 안 덮임 | PASS |
| canvas-core 108 / template-core 195 / agent-design 200 | PASS |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

**남은 사실**: 불투명한 이미지는 자기 배경을 덮으므로 배경색이 눈에 안 보일 수 있다.
결함이 아니라 겹침 순서의 당연한 결과이고, 투명 PNG·`contain` 맞춤에서는 보인다.

## 배운 것

**코드를 읽어 내린 실사는 렌더해서 잰 것보다 약하다.** 이 horizon에서 측정이 판단을 뒤집은
게 세 번째다(어휘 이름 겹침, WebGPU 색, 이미지 렌더). 세 번 다 "읽어서 그렇다고 생각한 것"이
"재보니 아니었다"로 바뀌었다.
