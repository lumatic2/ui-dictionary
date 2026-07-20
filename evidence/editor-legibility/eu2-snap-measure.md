# EVIDENCE — EU2 스냅·정렬 가이드·거리 측정

- Milestone: EU2 (`plans/2026-07-21-eu2-snap-measure.md`)
- Horizon: 편집기 판독성과 조작감 (`plans/horizons/2026-07-editor-legibility.md`)
- 일자: 2026-07-21

## DoD 대조

| 선언 | 실측 | 판정 |
|---|---|---|
| 드래그 중 자동 스냅이 동작한다 | 브라우저 실조작: 이웃 행에서 3px 모자란 지점까지 끌었더니 커밋 좌표가 `96px`(스냅 없으면 93px) | PASS |
| 정적 거리 측정이 동작한다 | Alt+호버 판독 `↔ 220 ↕ 14`, 같은 화면 DOM 좌표에서 독립 계산한 값과 일치 | PASS |
| 둘이 **별개 상호작용**이다 | 드래그 중 측정 배지 0 · 정적 호버 중 가이드 0. 양방향 테스트 + 브라우저 재확인 | PASS |
| 모든 측정이 바운딩 박스 기준이며 정의가 문서에 있다 | `docs/ARCHITECTURE.md` §편집기 측정 기준. 회전 45° 노드의 측정값이 회전 전과 동일함을 테스트로 고정 | PASS |

## step-1 — 스냅이 좌표를 실제로 보정한다

**발견**: `alignmentGuides()`가 이웃 모서리를 찾아 가이드를 돌려주는데 **아무도 그 값으로 좌표를
보정하지 않았다.** 선이 떠도 커밋되는 bounds는 어긋난 그대로였다. horizon 미리 쓰는 실패 회고
3번("스냅이 스냅처럼 보이기만 한다")이 개설 시점에 이미 코드에 있던 상태다.

- `snapBounds()`가 가이드와 보정된 bounds를 함께 돌려준다.
- 리사이즈는 **잡은 모서리만** 옮긴다 — 안 잡은 변에 스냅하면 요소가 제자리에서 튄다.
- `pinSnappedEdges()`로 비례 재배치의 부동소수 드리프트(500 → 499.99999999999994)를 없앤다.
- `SNAP_THRESHOLD = 4`는 **우리가 정한 값**이다. Figma·Penpot 모두 수치를 공개하지 않는다.

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 보정 제거, 가이드 계산만 남김 | canvas-core 2 failed |
| 표면 배선을 보정 전 bounds로 되돌림 | agent-design 1 failed — `expected 197 to be 200` |

## step-2 — 정적 거리 측정

측정 경로가 **아예 없었다**(`grep -i "measure\|distance"` 0건). Alt+호버로 진입하고, 드래그
gesture와 다른 상태에 둔다.

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 측정을 드래그 gesture 경로에 함께 붙임 | agent-design 1 failed |

## step-3 — 분리 게이트 + 측정 기준 문서

측정 기준을 `docs/ARCHITECTURE.md`에 명문화했다. 요지: **바운딩 박스**, 회전 노드는 **회전 전**
축 정렬 bounds(각도가 값을 흔들지 않게), stroke·베이스라인은 제외, 겹친 축의 거리는 0.

## 브라우저가 유닛 테스트를 두 번 이겼다

자동 검증이 전부 초록인 상태에서 브라우저 실조작이 결함 2건을 냈다.

### ① 빠른 드래그가 편집기를 통째로 죽였다

누르고·끌고·놓는 일이 **한 틱 안에** 일어나면 `finishGesture`의 클로저가 읽는 `previewBounds`는
아직 `{}`다. 빈 `transform-nodes`가 커밋되고 문서 계층이 거부한다:

```
Error: transform-nodes requires at least one node
  at mutateOperation (packages/canvas-core/dist/operations.js:68)
```

화면이 **백지**가 됐다(`nodeCount: 0`). EU1부터 있던 잠복 결함이고, 스냅과 무관하다.
jsdom에서는 재현되지 않는다 — RTL의 `fireEvent`가 이벤트마다 React를 flush 하기 때문에
"한 틱 안"이라는 조건 자체가 성립하지 않는다. **브라우저에서만 보이는 결함이다.**

수정: preview bounds를 ref로도 들고 `finishGesture`가 그것을 읽는다. 빈 preview는 커밋하지 않는다.

### ② 측정 배지가 드래그 내내 남았다

Alt 호버로 배지를 띄운 뒤 드래그를 시작하면 배지가 그대로 붙어 있었다. 내 테스트는 "드래그 중
Alt 호버로 **진입**할 수 없다"만 봤고, "이미 떠 있던 것이 **꺼지는가**"는 안 봤다 —
게이트가 한쪽 방향만 본 것이다. 브라우저에서 `measureDuringDrag: true`로 잡혔다.

수정: gesture 시작 시 측정 상태를 끈다. probe로 확인 — 수정을 되돌리면 새 테스트가 실패한다.

## 관측 기록

| 항목 | 값 |
|---|---|
| 드래그 커밋 좌표 | `96px` (스냅 없으면 93px) |
| 측정 판독 | `↔ 220 ↕ 14` — 화면 좌표에서 독립 계산한 값과 일치 |
| 드래그 중 측정 배지 | 0 (수정 전 1) |
| 편집기 생존 | `nodeCount: 1000`, 콘솔 오류 0 (수정 전 백지) |
| editor plane | `webgpu` — 가이드는 GPU 평면에 그려진다. `.dom-alignment-guide`는 DOM 폴백 전용이라 브라우저에서 0으로 나오는 것이 정상 |

스크린샷: `eu2/measure-alt-hover.png`(Alt 측정 판독), `eu2/snap-mid-drag.png`(드래그 중 정렬 가이드, 측정 배지 없음)

## 테스트

- canvas-core 142 PASS · template-core 195 PASS · agent-design 119 PASS
- `npm run verify` PASS

## finding 큐 (범위 밖)

- 측정 판독에 **두 요소를 잇는 선이 없다.** 숫자만 뜬다 — Figma는 빨간 선을 함께 그린다. 판독성 항목이라 EU5 과업 관측에서 다시 볼 것.
- 배지가 상대 요소의 이름표를 가린다.
- 3개 이상 근접 시 균등 간격 자동 감지 없음(Penpot 참조).
- 픽셀 그리드 스냅·수동 눈금자 가이드 없음.
- 회전 스냅(15° 등) 없음.
- 회전한 노드의 히트 테스트는 여전히 축 정렬 bounds 기준(EU1에서 넘어옴).
