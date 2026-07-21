# EU1 — 조작 종류가 구분되는 선택 (증거)

- Plan: `plans/2026-07-20-eu1-selection-affordance.md`
- 리서치: `research/2026-07-20-editor-ui-horizon-canvas-interaction.md` §1.1, 함의 1

## step-1 — 핸들 역할이 보인다 (완료 2026-07-20)

### 전

핸들 8개가 **전부 같은 9×9 흰 사각형**이었다(`styles.css:139`). 변과 모서리가 커서로만 갈리고
보이는 모양은 같았다. 배경은 `white` 리터럴이라 토큰 규약도 어겼다.

### 후 — 실제 브라우저 실측

```
resize-nw: 9x9    resize-n: 20x6    resize-ne: 9x9
resize-w:  6x20                     resize-e:  6x20
resize-sw: 9x9    resize-s: 20x6    resize-se: 9x9
```

모서리는 정사각(양축), 변은 **이동 축 방향으로 누운 막대**(단축)다. 형태가 조작을 말한다.

상태 3종이 각각 다르다: 호버(점선, 약한 색) / 선택(실선 1px) / 다중선택(실선 2px + `3개 선택` 배지).
개수를 **글자로도** 낸다 — 색만으로 신호하지 않는다(anti-patterns 3).

증거: `eu1/single-selection.png`(단일 — 모서리·변 핸들 형태 차이), `eu1/multi-selection.png`(3개 선택 배지 + 굵은 외곽선)

### 검증

- `npm --prefix apps/agent-design test` — **104 PASS** (98 + 신규 6)
- 실제 브라우저에서 8개 핸들의 `getBoundingClientRect` 실측 — 위 표
- 다중선택 실조작: Shift+클릭 → 배지 `3개 선택`, 선택 노드 3개 전부 `data-selection-scope="multi"`

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 변 핸들 치수를 모서리와 같게(9×9) | 1 failed — `expected '.resize-handle-edge.resize-handle-n, …' to match /width:\s*20px/` |

### 규약 대조 (askewly-design 자가 판정)

| 원칙 | 판정 |
|---|---|
| 토큰 파생 | PASS — `white` 리터럴을 `var(--ad-surface-base)`로 교체. 새 값은 전부 토큰 |
| 강조는 신호로 소면적 | PASS — action-primary는 핸들 테두리·배지에만 |
| 절제된 계층 | PASS — 형태(치수)로 구분, 새 색을 늘리지 않음 |
| 상태 완결성 | PASS — idle/hover/selected/multi/focus-visible |
| 실험적 손맛 | 해당 없음(능동 시도 금지 규약 준수) |

하드페일 5종: 좌측 색선 카드 없음 / 한글 배지에 `word-break: keep-all` / 어색한 줄바꿈 없음(배지 `white-space: nowrap`) / 이모지 아이콘 없음 / 리터럴·상태 누락 없음.

**사람 확인은 EU5 과업 관측이 정본이다.** 이 자가 판정은 하한선이다.

## step-2 — 회전이 실제로 된다 (완료 2026-07-20)

편집기에 회전이 **아예 없었다**(`types.ts`에 `rotation` 0건). 문서 모델부터 넣었다:
필수 필드 `rotation`(도, 시계 방향, 축=바운딩 박스 중심) → `rotate-nodes` 연산 →
회전 핫존(모서리 바깥) → SVG `rotate(a cx cy)` · HTML `rotate(Ndeg)` · JSON 필드.

**브라우저가 유닛 테스트를 두 번 이겼다.**

1. 회전 중심을 문서 좌표에 zoom·pan만 곱해 환산했다. 뷰포트 요소가 창 안에서 밀려 있는
   오프셋을 빼먹어 **90° 드래그가 8°로** 나왔다. 순수 각도 계산 유닛 테스트는 전부 통과했다.
   → 화면의 선택 상자 rect에서 중심을 직접 읽도록 고쳤다(같은 좌표계라 전부 상쇄).
2. 커밋 호출을 지우는 probe가 **통과했다** — 회전이 문서까지 가는지 보는 테스트가 없었다.
   표면 테스트를 추가하고 나서야 걸렸다.

곁다리로, 컴파일러가 청사진 슬롯 `tokenBindings`를 참조로 넘겨 **문서 편집이 청사진을 오염시키던**
버그를 잡아 고쳤다.

증거: `eu1/rotation.png` (90° 회전 후 화면)

## step-3 — 조작 결과 게이트 (완료 2026-07-20)

조작 4종의 **입력→결과**를 고정했다. 기대값은 입력 델타에서 계산하며 렌더 출력을 되읽지 않는다.

| 조작 | 입력 | 기대 |
|---|---|---|
| 이동 | +20,+10 | x·y만 +20/+10, 크기 불변 |
| 변 핸들 n | +30,+12 | **x·width 불변**, y +12, height −12 |
| 모서리 핸들 se | +20,+10 | width +20, height +10, x 불변 |
| 회전 | 위→오른쪽 | 각도 +90, 위치·크기 불변 |

변 핸들 테스트가 역할 분리의 증명이다 — x나 width가 움직이면 변이 양축을 바꾸고 있다는 뜻이다.

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 변 핸들을 양축 리사이즈로(`handle.includes` 조건 제거) | **2 failed** — `expected '54px' to be '24px'`, `expected '92px' to be '112px'` |
| 회전 커밋 제거 | 1 failed — `회전을 놓았는데 문서 연산이 나오지 않았다` |

## 최종 검증

- canvas-core 126 · template-core 195 · agent-design **110** PASS
- `npm run verify` 4단계 exit 0
- 브라우저 실조작: 핸들 치수 실측, Shift 다중선택 배지, 90° 회전 + Revision 증가
