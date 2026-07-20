# 215 — bind-new-token

- 날짜: 2026-07-21
- milestone: ECT3 (`plans/2026-07-21-ect3-bind-and-detach.md`) step-1
- horizon: editor-color-and-token-editing

## 무엇을 왜

**EU5에서 사용자가 막힌 지점이 이거다.** 색이 안 묶인 노드의 시각 섹션은
"이 노드에 묶인 토큰이 없다"는 **막다른 안내문**만 띄웠다 — 그 노드에서 색을 바꿀 방법이 없었다.

리서치가 본 5개 시스템(Figma·Penpot·Framer·Webflow·Tokens Studio)은 **전부** 미바인딩
상태에서 새로 묶는 명시적 어포던스를 갖는다. 우리는 0이었다. 5/5 대비 0은 취향 차이가 아니다.

이제 `채움 색 묶기`·`배경 색 묶기`·`글자 색 묶기` 버튼이 뜨고, 누르면 **ECT2와 같은 목록**이 열린다.

## 목록을 두 벌 만들지 않았다

plan 결정: "따로 만들면 같은 목록이 두 벌 생기고 한쪽만 어휘 필터를 갖게 된다."
그래서 팝오버를 `TokenColorPicker`로 뽑고 바인딩 유무와 무관하게 같은 것을 쓴다.
열림 상태·포커스 복귀 살림도 `usePickerTrigger`로 공유한다 — ECT2에서 고친 포커스 경합
수정이 새 경로에도 자동으로 적용된다(따로 짰으면 그 버그를 새로 만들었을 것이다).

리팩터 후 ECT2 테스트 39건이 **그대로 통과**했다.

## 렌더러가 칠하는 키만 제안한다

| 노드 종류 | 묶을 수 있는 색 |
|---|---|
| shape | `fill`, `background` |
| text | `color`, `background` |
| frame·group·component·instance | `background` |
| **image** | **없음** |

이미지 노드를 제외한 이유: 렌더러가 image kind에서 `tokenBindings`를 아예 참조하지 않는다
(`CanvasSurface.tsx:162`). 여기서 묶게 하면 **"묶이긴 하는데 안 칠해지는"** 상태가 된다 —
ECT4가 렌더러를 확장한 뒤 열린다. 그때까지는 "이 노드에는 색 속성이 없다"고 정직하게 말한다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — `TokenColorPicker`·`usePickerTrigger` 분리, `bindableColorKeys`, `UnboundColorField`
- `apps/agent-design/src/styles.css` — `.color-bind-button`
- `apps/agent-design/src/PropertyInspector.test.tsx` — 묶기 8건

## Verification

| 항목 | 결과 |
|---|---|
| 바인딩 없으면 묶기 버튼, 막다른 문구 없음 | PASS |
| 묶기가 **같은 목록**을 연다(어휘·kind 필터 살아 있음) | PASS |
| 고르면 `set-node-property` 커밋 | PASS |
| 이미 묶인 색은 견본으로(묶기 버튼 아님) | PASS |
| 노드 종류별 키가 다름(shape=fill+background, text=color+background) | PASS |
| **이미지 노드는 묶기 제안 안 함** | PASS |
| 묶기도 키보드로 됨 | PASS |
| Esc 시 포커스가 묶기 버튼으로 복귀 | PASS |
| **브라우저 실측** — 텍스트 노드에 `글자 색 묶기` → `action.destructive` 선택 → 캔버스 글자색이 실제로 바뀜, 묶기 버튼이 견본으로 대체, revision 증가 | PASS |
| **Failure probe** — 어포던스 제거 6건 / 이미지 제외 제거 1건 실패 | PASS |
| `npm test` | 190 passed / 15 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## 검증자 지적 반영

앞선 ECT2 검증에서 "이미지 노드는 fixture에 없어 확인 못 함"으로 남았던 경로를
이번 테스트가 직접 만들어 덮었다.
