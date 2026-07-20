# 216 — detach-token-binding

- 날짜: 2026-07-21
- milestone: ECT3 step-2
- horizon: editor-color-and-token-editing

## 무엇을 왜

사용자 결정(2026-07-21): **탈출구 있음 (Figma식 detach)**. 기본은 토큰이고, 명시적으로
벗어나면 리터럴 색을 쓸 수 있다. 벗어난 상태는 화면에 표시한다.

## 실사가 새 필드를 부른 지점

plan 결정은 "원시 색은 기존 리터럴 자리 우선 — 새 필드는 기존 자리로 안 될 때만"이었다.
실사 결과 리터럴 색 자리는 `ShapeNode.fill` **하나뿐**이라 frame·text의 배경/글자색을
detach하면 둘 곳이 없다. 그래서 `CanvasNodeBase.literalColors?`를 신설했다.

- `tokenBindings`에 리터럴을 섞지 않는다 — 방금 세운 토큰 실재 검증(ECT1)이 무너진다.
- **선택 필드**로 둔다 — 필수면 이미 저장된 문서가 안 열린다. 문서 검증이 추가 필드를
  막지 않는 것을 확인하고 결정했다.
- 우선순위는 **바인딩 > 리터럴** — 둘이 겹쳐도 모호하지 않다.

## 연산 둘, 서로의 역

| 연산 | 하는 일 |
|---|---|
| `detach-token-binding {key, literal}` | 바인딩 제거 + 리터럴 설정. 이미 벗어난 키에 다시 쓰면 **리터럴만 갱신** — 원시 색 편집이 같은 연산을 탄다 |
| `attach-token-binding {key, name}` | 리터럴 제거 + 바인딩 설정 |

역함수는 둘 다 같은 질문이다 — "이 키의 색 출처가 원래 무엇이었나". 바인딩이었으면 다시 묶고
리터럴이었으면 그 리터럴로 되돌린다. 되돌릴 출처가 없으면 **조용히 넘어가지 않고 던진다**.

`literal`을 연산이 들고 오는 이유: canvas-core는 어휘를 모른다(ECT1 계층 결정).
"지금 이 토큰이 무슨 색인가"는 어휘를 아는 앱만 답할 수 있다.

## 다시 묶는 경로도 검증을 지난다

`attach-token-binding`이 `validateTokenBinding`을 부른다 — ECT1에서 세 경로가 차례로
뚫렸던 전례가 있어, 새 연산을 내면서 검증을 빠뜨리지 않았는지 테스트로 못박았다.

## 벗어난 상태를 화면에 적는다

horizon 프리모템 2가 이 결정의 리스크를 맡는다 — 원시 색이 편한 기본 습관이 되면 토큰
SSOT라는 논지가 안에서부터 무너진다. **표시 없는 detach는 만들지 않는다**:

- 견본이 **원형**으로 바뀐다(리서치: Figma·Penpot이 형태로 바인딩 종류를 말한다)
- 토큰 이름 대신 **원시값**이 편집 가능한 입력으로 보인다
- "토큰에서 벗어난 색이다"라고 **글자로** 적는다

## 변경 파일

- `packages/canvas-core/src/types.ts` — `literalColors?`
- `packages/canvas-core/src/operations.ts` — 두 연산의 타입·실행·역함수
- `packages/canvas-core/src/properties.test.ts` — 연산 8건
- `apps/agent-design/src/CanvasSurface.tsx` — 렌더러가 리터럴을 칠한다(바인딩 우선)
- `apps/agent-design/src/PropertyInspector.tsx` — `LiteralColorField`, 풀기 버튼
- `apps/agent-design/src/styles.css` — 원형 견본·원시값 입력·풀기 버튼

## Verification

| 항목 | 결과 |
|---|---|
| 풀면 바인딩 사라지고 리터럴로 남음 | PASS |
| **색 없는 detach 거부** — 색을 잃는 detach는 없다 | PASS |
| 다시 묶으면 리터럴 사라짐 — 두 출처가 같이 안 남음 | PASS |
| **재바인딩도 토큰 실재 검사를 지남** | PASS |
| undo가 detach를 정확히 되돌림 (redo도) | PASS |
| undo가 attach를 리터럴로 되돌림 | PASS |
| 이미 벗어난 키 재기입 = 리터럴만 갱신 | PASS |
| 되돌릴 출처 없으면 역함수가 던짐 | PASS |
| **브라우저 실측 — detach 시 캔버스 색이 안 변함** (`oklch(1 0 0)` → `oklch(1 0 0)`) | PASS |
| 브라우저 undo → 바인딩 복원, redo → 리터럴 복귀 | PASS |
| 벗어남이 형태(원형 견본)·글자로 표시됨 | PASS |
| canvas-core `vitest run` | 96 passed |
| `npm test` (apps/agent-design) | 190 passed |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

스크린샷: `evidence/editor-color-and-token-editing/ect3/ect3-detached.png`
