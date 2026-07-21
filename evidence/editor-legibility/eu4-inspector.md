# EVIDENCE — EU4 인스펙터 정보구조

- Milestone: EU4 (`plans/2026-07-21-eu4-inspector-ia.md`)
- Horizon: 편집기 판독성과 조작감 (`plans/horizons/2026-07-editor-legibility.md`)
- 일자: 2026-07-21

## 실사가 계획을 바꿨다 — "순서"가 아니라 "존재"였다

EU4의 선언은 **인스펙터 순서 재배치**였다. 열어보니 순서 이전에 값이 없었다.

| 항목 | 실사 |
|---|---|
| 위치·크기 | **없음** — `propertyFieldsForNode()`에 `bounds`의 `x·y·width·height`가 하나도 없다 |
| 각도 | **없음** — EU1에서 회전을 넣었는데 각도를 읽을 방법이 없었다 |
| 섹션 | **없음** — 제목 없는 `<label>` 평면 나열. 규약과 대조할 대상 자체가 없다 |
| 내보내기 | **없음** |
| 종류별 노출 | **부분** — prop·variant·override만 갈리고 layout 5개는 늘 나온다 |

인스펙터의 "Width/Height"는 숫자가 아니라 `fixed|hug|fill` **사이징 모드**였다.
**없는 것은 재배치할 수 없다.** 그래서 step-1을 "존재"로 잡았다.

## DoD 대조

| 선언 | 실측 | 판정 |
|---|---|---|
| 위치·크기·각도를 읽고 고칠 수 있다 | 브라우저: 인스펙터 값이 캔버스 스타일과 일치, X에 512 입력 → 캔버스 `left: 512px`·revision 1, 각도 30 입력 → `rotate(30deg)`·revision 2 | PASS |
| 기하→구조→시각→내보내기 순서 | DOM 섹션 순서 `["geometry","structure","visual","export"]` | PASS |
| 선택 종류에 따라 노출이 달라진다 | 선택없음/다중/단일이 다른 문구, code-component만 Prop·Variant, instance만 Override, 기하는 전 종류 공통 | PASS |

## 설계 판단

**기하 편집은 캔버스 드래그와 같은 연산으로 커밋한다** — `transform-nodes`·`rotate-nodes`.
인스펙터 전용 경로를 만들면 두 표면이 서로 다른 변경 경로를 갖게 되고 하나만 undo에 잡힌다.
`propertyFieldsForNode`에 섞지 않은 이유도 같다(그쪽은 `set-node-property` 계약).

**섹션 순서는 우리가 지어낸 것이 아니다** — 리서치가 Figma·Penpot 공통으로 확인한 순서다.
근거를 코드 주석에 남겼다.

**없는 것은 만들지 않았다** — stroke·effect는 문서 모델에 없어 시각 섹션은 토큰 바인딩뿐이다.
내보내기 섹션은 자리만 두고 현재 상태를 말한다. 빈 자리에 가짜 버튼을 두면 판독성이 더 나빠진다.

## 잡은 결함 2건

### ① 빈 칸이 좌표를 0으로 만들었다

`Number('')`은 `0`이다. 그냥 넘기면 입력을 비웠을 때 좌표가 0으로 날아간다.
`x = 0`은 정당한 값이라 숫자 검사만으로는 못 거른다 — 빈 문자열을 `NaN`으로 바꾸는 파서를 따로 뒀다.

### ② 이름이 겹쳐 서로를 가렸다

스크린샷을 보고 알았다: 기하 섹션의 `너비·높이`(숫자) 바로 아래 구조 섹션에 `Width·Height`가
있는데 **그건 크기가 아니라 크기를 정하는 방식**이다. 같은 이름이 두 개면 둘 다 안 읽힌다.
`가로 사이징`·`세로 사이징`으로 바꿨다. **이건 테스트가 아니라 스크린샷이 잡았다.**

## 검증 방법 메모 — 합성 `blur`는 React에 닿지 않는다

브라우저에서 `input.dispatchEvent(new Event('blur'))`로 값을 넣었더니 **입력값만 512로 바뀌고
캔버스는 24px, revision 0**이었다. 제품 결함처럼 보였지만 아니었다 — React는 버블링하지 않는
`blur` 대신 `focusout`으로 위임한다. Playwright의 실제 타이핑(`fill` + `Enter`)으로 다시 하니
정상 동작했다. **합성 이벤트로 "안 된다"를 결론내면 안 된다**는 사례로 남긴다.

## 관측 기록 (localhost:5213)

| 항목 | 값 |
|---|---|
| 섹션 순서 | `geometry → structure → visual → export` |
| 인스펙터 초기값 | X 24 · Y 24 · 너비 92 · 높이 58 · 각도 0 — 캔버스 스타일과 일치 |
| X에 512 입력 | 캔버스 `left: 512px`, revision 0 → 1 |
| 각도에 30 입력 | 캔버스 `transform: rotate(30deg)`, revision 1 → 2 |

스크린샷: `eu4/inspector-sections.png`

## 테스트

- agent-design 142 PASS · canvas-core 73 PASS · template-core 311 PASS
- `tsc -b` 통과 · `npm run verify` PASS

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 기하 transform 커밋 제거 | 1 failed |
| 시각 섹션을 구조 앞으로 | 1 failed |
| `propertyFieldsForNode`의 kind 조건 제거 | 종류별 노출 테스트 실패 + 비컴포넌트 노드에서 크래시 |

## finding 큐 (범위 밖)

- 다중선택에서 **공통 값 편집이 안 된다** — 개수만 말하고 편집은 단일 선택에서만. 다중 기하 편집은 별도 연산 설계가 필요하다.
- stroke·effect가 문서 모델에 없어 시각 섹션이 토큰 바인딩뿐이다.
- 노드 단위 내보내기 없음(문서 전체만).
- 인스펙터 라벨이 한국어(기하)와 영어(Name·Layout·Gap·Padding)로 섞여 있다.
