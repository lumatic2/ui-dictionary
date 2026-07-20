# changeset: 노드 회전 (모델부터)

- Date: 2026-07-20
- Plan: EU1 step 2 (`plans/2026-07-20-eu1-selection-affordance.md`)
- 증거: `evidence/editor-legibility/eu1-selection.md`

## 왜 모델부터인가

편집기에 **회전이 아예 없었다** — `grep rotation packages/canvas-core/src/types.ts` 0건.
핫존만 그리면 드래그해도 아무 일도 안 일어나는 가짜 UI가 된다. 렌더 층 CSS transform으로만
두는 것도 같은 문제다: 내보내기가 각도를 잃어 **화면에서만 돌아간 산출물**이 나간다.

## 무엇을 바꿨나

- **`CanvasNodeBase.rotation: number` (필수)** — 도(度), 시계 방향, 회전축은 바운딩 박스 중심. 선택 필드로 두면 "각도를 안 쓰는 경로"가 조용히 생긴다.
- **`rotate-nodes` 연산** — bounds를 건드리지 않으므로 `transform-nodes`와 별개다. 역연산·잠금 검사·유한성 검사 포함.
- **`normalizeRotation`** — [0,360)으로 접는다. 370°와 10°가 다른 문서가 되지 않게.
- **`rotationFromPointer`** — 델타가 아니라 **중심에서 포인터로 향하는 각도**. 잡은 위치가 각도를 튀게 하지 않는다.
- **회전 핫존** — 모서리 **바깥**. 리사이즈 핸들과 겹치면 어느 조작인지 손이 알 수 없다.
- **내보내기 3종** — SVG `transform="rotate(a cx cy)"`, HTML `transform:rotate(Ndeg)`, JSON은 필드 그대로. 세 층이 같은 각도를 말한다.

## 브라우저가 유닛 테스트를 이겼다 (2회)

**① 회전 중심을 화면 좌표로 잘못 환산했다.** 문서 좌표에 zoom·pan만 곱했는데, 뷰포트 요소가
창 안에서 밀려 있는 오프셋을 빼먹었다. 유닛 테스트(순수 각도 계산)는 전부 통과했고,
**브라우저에서 90° 드래그가 8°로 나와** 적발됐다. 지금은 화면의 선택 상자 rect에서 중심을
직접 읽는다 — 중심·포인터가 같은 좌표계라 zoom·pan·오프셋이 전부 상쇄된다.

**② 게이트에 구멍이 있었다.** 커밋 호출을 지우는 probe가 **통과했다** — 회전이 문서까지
가는지 보는 테스트가 없었다. 표면 테스트를 추가하고 나서야 probe가 걸렸다. (jsdom에는
PointerEvent가 없어 `fireEvent.pointerDown`이 좌표를 버린다 — 좌표가 살아 있는 MouseEvent를
pointer 타입으로 보내야 회전을 검사할 수 있다.)

## 곁다리로 잡은 버그

컴파일러가 청사진 슬롯의 `tokenBindings`를 **참조로** 넘기고 있었다. 문서에서 토큰을 바꾸면
청사진 자체가 오염되고 이후 모든 컴파일이 그 값을 물려받는다. 복사하도록 고치고 회귀 테스트를 뒀다.

## Verification

- [x] canvas-core 126 PASS · template-core 195 PASS · agent-design 106 PASS
- [x] `npm run verify` 4단계 exit 0
- [x] 브라우저 실조작 — 위에서 오른쪽으로 드래그 → **정확히 90°**, Revision 0→1
- [x] 서명 재기준선 1건 (근거: rotation 필드 추가, 각도값은 전부 0이라 레이아웃 무변경)

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 회전 커밋 제거(렌더에서만 회전) | **처음엔 통과** → 표면 테스트 추가 후 1 failed |
| 회전 중심을 문서 좌표로 환산 | 브라우저에서 90°가 8°로 (테스트는 통과했다) |

## finding 큐

- 다중선택 묶음 회전 없음(단일 노드만).
- 회전 스냅(15° 등)은 EU2.
- 회전된 노드의 정렬 가이드·히트 테스트는 아직 축 정렬 bounds를 쓴다.
