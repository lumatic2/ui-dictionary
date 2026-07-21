# 211 — token-color-picker

- 날짜: 2026-07-21
- milestone: ECT2 (`plans/2026-07-21-ect2-color-swatch-and-picker.md`) step-2
- horizon: editor-color-and-token-editing

## 무엇을 왜

견본을 누르면 **그 문서 어휘의 색 토큰 목록**이 열린다. 검색 가능하고, 점표기에서 유도한
그룹으로 접히고, 항목마다 자기 색 견본을 단다.

EU5에서 사용자는 유효한 토큰 이름을 미리 알고 오타 없이 타이핑해야 했다. 이제 고르면 된다.

## 어휘 격리는 양방향으로 잰다

목록은 `documentTokens(문서 세트).listTokens()`에서만 온다. 편집기 문서에 템플릿 토큰이,
템플릿 문서에 편집기 토큰이 **각각 0건**임을 두 테스트가 따로 본다 — 한쪽만 보는 게이트는
EU2에서 이미 새어 봤다.

그룹은 손으로 적지 않는다. 점표기 이름에서 유도한다(리서치: Penpot 점표기·Webflow 슬래시 —
"이름 규칙 자체가 정보구조").

## 브라우저 실측

`accent.base`를 고르니 캔버스 노드 배경이 `#B9FAF8`로 바뀌고 인스펙터 견본·이름이 따라왔다.
목록은 19개 전부 견본이 칠해진 채 5개 그룹(surface·text·action·accent·border)으로 접혔다.
상대 어휘 유입 0건. revision이 증가하고 목록이 닫힌다.

## ⚠ 해소되지 않은 관측 — 캔버스와 견본이 **다른 색으로 보인다**

같은 토큰(`action.destructive` = `oklch(0.58 0.22 27)`, 빨강)이:

| 어디 | 화면에 보이는 색 |
|---|---|
| 인스펙터 견본 | **빨강** (맞음) |
| 대조군 div (같은 문자열, 캔버스 밖) | **빨강** (맞음) |
| **캔버스 노드** | **마젠타** (틀림) |

앞서 `accent.base`(민트 `#B9FAF8`)도 캔버스에서 분홍으로 보였다. 두 색 모두 분홍 쪽으로 밀렸다.

조사한 것 — **코드 값은 전부 옳다**:
- 노드 인라인 스타일 = `background: oklch(0.58 0.22 27)` (견본과 **같은 문자열**)
- `getComputedStyle` = 같은 값
- filter·mix-blend-mode·backdrop-filter·opacity: 조상 체인 전체에 **없음**
- 노드를 덮는 요소 없음(`elementsFromPoint` — 선택 오버레이는 투명, 자식은 핸들뿐)
- CSS에 선택 상태 배경 덮어쓰기 없음

즉 **값이 아니라 렌더링에서 갈린다.** 유일한 구조적 차이는 캔버스 노드가
`transform: scale(4)` 조상 아래 있다는 것 — 합성 레이어에서 oklch가 다르게 래스터화되는
헤드리스 크로미움 artifact일 가능성이 있다.

**이건 내 변경이 만든 게 아니다** — 캔버스 색칠 경로(`CanvasSurface.nodeStyle`)는 이번에
건드리지 않았다. 다만 ECT2가 "색을 보고 고른다"를 만드는 milestone이라 **그냥 넘길 수 없다.**
헤드리스에서 판정할 수 없어 사용자 기본 브라우저로 열어 사람 확인을 요청했다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — `groupTokens`, `ColorBindingField`에 팝오버·검색·선택
- `apps/agent-design/src/styles.css` — `.color-picker` 계열, 견본 버튼 상태(hover·focus-visible)
- `apps/agent-design/src/PropertyInspector.test.tsx` — 선택기 9건

## Verification

| 항목 | 결과 |
|---|---|
| 편집기 문서 목록에 템플릿 토큰 0건 | PASS |
| 템플릿 문서 목록에 편집기 토큰 0건 (반대 방향) | PASS |
| 글꼴 토큰 0건 (색만) | PASS |
| 항목마다 자기 색 견본 | PASS |
| 검색이 목록을 줄이고 그룹 보존 | PASS |
| 결과 없음을 문장으로 말함 | PASS |
| 고르면 `set-node-property` 커밋 + 목록 닫힘 | PASS |
| 현재 색이 글자로 표시(`지금 이 색`) | PASS |
| 같은 색 재선택 시 연산 없음 | PASS |
| **Failure probe A** — kind 필터 제거 → 1건 실패 | PASS |
| **Failure probe B** — 어휘 합집합 → **양방향 2건** 실패 | PASS |
| `npm test` (apps/agent-design) | 167 passed / 14 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |
| **캔버스 실제 색 일치** | **미판정 — 위 관측 참조, 사람 확인 대기** |

스크린샷: `evidence/editor-color-and-token-editing/ect2/` (목록 열림·선택 후·확대·대조군 비교)
