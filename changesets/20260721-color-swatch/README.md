# 210 — color-swatch

- 날짜: 2026-07-21
- milestone: ECT2 (`plans/2026-07-21-ect2-color-swatch-and-picker.md`) step-1
- horizon: editor-color-and-token-editing

## 무엇을 왜

EU5 관측 계측이 이 step의 과녁이다:

| 계측 | EU5 | 지금 (브라우저 실측) |
|---|---|---|
| 화면에 "색"이라는 단어 | **0건** | 1건 |
| 색 견본 | **0개** | 1개 |
| `Token · ` 내부 용어 | 노출 | 0건 |

`Token · fill` 자유 텍스트 입력을 **해석된 색 견본 + 토큰 이름**으로 바꾸고 라벨을
사용자 언어로 옮겼다(`채움 색`·`배경 색`·`글자 색`).

## 견본 색은 캔버스와 같은 함수에서 온다

`documentTokens().resolve()` — 렌더러가 캔버스를 칠할 때 쓰는 그 함수다.
별도 해석 경로를 만들면 **견본과 캔버스가 다른 색을 보여준다.** 조용히 틀리는 종류라
테스트가 컴포넌트가 아니라 그 함수와 대조한다.

## 색이 아닌 토큰은 색 컨트롤이 되지 않는다

ECT1이 심은 `kind`로 가른다. 글꼴 토큰을 색 견본으로 보여주면 거짓말이 된다.
해석 안 되는 죽은 바인딩은 kind를 물을 대상이 없으므로 키 계약(`fill`·`background`·`color`)으로
판정한다 — 죽었다고 색 컨트롤에서 빼면 사용자가 그걸 고칠 방법이 사라진다.

## 디자인 규약 적용 (askewly-design 스킬)

- 색만으로 상태를 말하지 않는다 — 견본 + 토큰 이름 글자 + `aria-label` 3중.
- 해석 실패를 회색으로 덮지 않는다 — 점선 + 사선 해칭으로 **빈 상태임을 형태로** 말하고 문장으로 적는다.
- 모든 chrome 색은 프로젝트 토큰(`--ad-*`)에서. 리터럴 없음.
- 한국어 줄바꿈 `word-break: keep-all`.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — `COLOR_BINDING_LABELS`, `isColorBinding`, `ColorBindingField`
- `apps/agent-design/src/styles.css` — `.color-field` 계열
- `apps/agent-design/src/PropertyInspector.test.tsx` — 색 견본 6건 + EU4 라벨 계약 갱신

## Verification

| 항목 | 결과 |
|---|---|
| 견본 색 = `documentTokens().resolve()` 값 | PASS |
| 화면에 "색" 단어 존재 (EU5 0건의 역) | PASS |
| 라벨이 사용자 언어, `Token · background` 소멸 | PASS |
| 견본 옆 토큰 이름 + aria-label | PASS |
| 해석 실패는 미해결 표시 (회색 폴백 없음) | PASS |
| 색 아닌 토큰(글꼴)은 색 컨트롤 안 됨 | PASS |
| **브라우저 실측** — "색" 1건 · 견본 1개 · `Token ·` 0건 | PASS |
| **다크 모드** — 견본이 세트를 따라감 `oklch(1 0 0)`→`oklch(0.25 0.03 270)`, 테두리 대비 유지 | PASS |
| **Failure probe** — 견본을 별도 팔레트로 칠함 → 테스트 2건 실패 | PASS |
| `npm test` (apps/agent-design) | 158 passed / 14 files |
| `npm run typecheck` | exit 0 |

스크린샷: `evidence/editor-color-and-token-editing/ect2/ect2-inspector-{light,dark}.png`

## 시그니처 자가 판정

1. **토큰 파생** — chrome 색 전부 `--ad-*`. 견본이 칠하는 색은 문서 데이터(토큰 해석값)이지 발명한 값이 아니다. **충족**
2. **강조는 신호로만** — 강조색 추가 없음. **충족**
3. **절제된 위계** — 행 하나 추가, 경쟁하는 강조 없음. **충족**
4. **상태 완비** — 해석/미해결 두 상태 + 라이트·다크 실측. 단 **hover/focus는 아직 없다** — 이 컨트롤은 step-1에서 표시 전용이고 상호작용은 step-2에서 붙는다. 그때 재판정한다. **부분 — step-2에서 마감**
5. **수작업 실험 없음** — 비대칭·장식 시도 없음. **충족**

하드페일 5종: 좌측 강조선 카드 없음 / 한글 `keep-all` 적용 / 이모지 아이콘 없음 / 정렬 어긋남 없음(견본·이름 수직 중앙) / 매직넘버 대신 기존 인스펙터 치수 규약 따름. **0건**

## 실물에서 발견한 것 (범위 밖, finding)

스크린샷을 보니 **인스펙터가 한영 반반**이다 — `Properties`·`Token mode`·`Name`·`Layout`·`Gap`·
`Padding`·`Revision`·`Nodes`·`Selection`은 영어, 기하·구조·시각·너비·높이·각도·배경 색은 한국어.
EU5가 드러낸 것과 **같은 종류의 문제**(사용자가 읽어야 할 자리에 내부·영어 용어)이고,
이번에 색만 한국어로 옮겨서 오히려 혼재가 더 눈에 띈다.

ECT2 범위는 "색"이라 여기서 고치지 않는다. 다만 **ECT5 판단 가능성 재관측에서 이게 다시 걸릴 수 있다.**
