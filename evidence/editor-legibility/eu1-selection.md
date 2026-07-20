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

## 남은 step

- step-2 — 회전(문서 모델부터). 현재 `packages/canvas-core`에 각도 필드가 **없다**.
- step-3 — 조작 4종의 입력→결과 게이트.
