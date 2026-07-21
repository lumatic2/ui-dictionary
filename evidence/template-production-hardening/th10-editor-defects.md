# TH10 — 편집기 결함 마감 (증거)

- 완료: 2026-07-20 (**사람 눈 확인 게이트 대기**)
- Plan: `plans/2026-07-20-th10-editor-defects.md`
- Changesets: `20260720-editor-state-persistence`, `20260720-token-set-parity`, `20260720-structured-input-rejection`

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 편집 상태가 저장·재적재·뷰포트 변경을 건너 살아남는다 | 브라우저 실조작 | 저장 키 `agent-design:starter-business-card-minimal`, 재적재 후 6 nodes 유지 | PASS |
| 토큰 세트 표시가 문서 상태와 일치 | 브라우저 실조작 | 드롭다운 값 = `askewly.warm`, 옵션 4개 | PASS |
| 형태 깨진 입력이 구조화된 오류 코드로 거부 | 코드 대조 | `NOT_A_TEMPLATE_PROJECT`·`MISSING_SCENE_NODES` 등, TypeError 0 | PASS |

## 착수 전에 장부가 틀린 걸 발견했다

`docs/findings.md`는 "`validateTokenMode`가 편집기 세트 2개만 허용"이라고 적었다. 직접 돌려보니 **모양만 본다** — `askewly.warm`도 `foo.bar`도 통과한다.

기록을 믿고 계획을 세웠으면 틀린 문제를 풀 뻔했다. 계획 착수 전 실측 한 번이 milestone 하나를 헛돌지 않게 했다. 장부도 정정했다.

## 결함 넷과 그 정체

| # | 겉보기 | 실제 원인 |
|---|---|---|
| 1 | 템플릿을 저장하고 재적재하면 fixture가 돌아온다 | 스냅샷이 `출발 문서 + 연산 로그`인데 출발 문서로 **항상 dev fixture**를 넘겼다 |
| 2 | 크기 토글을 누르면 템플릿이 사라진다 | `baseDocument` 재생성 → 이력 리셋 effect가 무조건 발화 |
| 3 | `askewly.warm` 템플릿인데 화면은 `askewly.default`라 말한다 | 드롭다운 옵션이 하드코딩 2개 — 값이 목록에 없으면 첫 항목이 선택돼 보인다 |
| 4 | 깨진 JSON을 넣으면 스택 트레이스가 뜬다 | 필드를 읽고 나서 검사해 `TypeError`가 먼저 터진다 |

## 실패 경로 확인

| # | 무엇을 되돌렸나 | 결과 |
|---|---|---|
| 1 | 저장 기준을 `baseDocument`로 | `expected '1,000 nodes' to be '6 nodes'` |
| 2 | 크기 토글 가드 제거 | `expected 'unsaved' to contain 'template'` (2 failed) |
| 3 | 옵션 하드코딩 + 모양 검사만 | `expected 'askewly.default' to be 'askewly.warm'` (2 failed) |
| 4 | 형태 검사 2줄 제거 | TypeError 부활 (7 failed) |

probe 1과 3의 메시지가 결함 그 자체다.

## 브라우저 실조작

`http://localhost:5173` — 실제로 눌러 확인했다. 증거 3장: `th10/`

- `template-open-warm.jpeg` — 갤러리에서 명함 열기, Properties에 **템플릿 · 따뜻한 크래프트**
- `canvas-warm.jpeg` — warm 배경 + 초록 accent rail + 한글 자리표시자
- `editor-dark-and-disabled.jpeg` — 편집기 어둡게 chrome + **잠긴 fixture 토글**(`--ad-surface-muted`, `not-allowed`)

## 브라우저가 알려준 것

편집기 세트를 **템플릿 문서**에 붙여봤더니 노드 3개가 `data-token-unresolved`로 표시됐다. 두 어휘가 겹치지 않는 사실이 화면에 그대로 드러난다(TH7 계약). 다만 목록에 둘을 나란히 놓은 지금 구조에서는 **사용자가 이 조합을 만들 수 있다** — 진단은 뜨지만 막지 않는다.

## 디자인 판정 (askewly-design)

과제 유형 **B(기존 UI 개선)**. anti-patterns 진단이 step-1에서 제가 만든 결함을 잡았다 — `disabled`를 붙이고 스타일을 안 줘서 브라우저 기본에 노출("Crude CSS: exposed browser defaults"). 편집기 토큰으로 채웠다.

- Token Derivation: 새 CSS 전부 `--ad-*` 파생, 리터럴 0 — PASS
- Complete States: `:disabled` 채움 — PASS
- Status Signals via Text: 거부를 색이 아니라 문구로 — PASS
- askewly 팔레트 주입 없음 (편집기는 자체 토큰 보유)

**사람 눈 확인은 아직 받지 않았다** — 자가 판정은 하한선이다.

## 크기 회고

changeset 3개(선언 `changesets>=2`) — 선언보다 1개 많다. 지속성·표시정합·입력거부가 각각 독립 검증을 가져 쪼갠 것이 타당했다.

테스트: agent-design 90 → **98**, template-core 155 → **162**.

## finding 큐

- 토큰 **값** 개별 편집 UI는 여기서 닫지 않았다(기능 추가라 범위 밖). `resolveProjectTokens` override 경로가 계약·테스트만 갖고 UI가 없는 상태는 유지된다.
- 편집기 chrome 다크모드는 이미 있다(`data-ad-mode`) — 장부의 "없다"는 기술은 캔버스 어휘와 혼동한 것으로 보인다. 별도 확인 대상.
- `set-token-mode` 연산 계층(canvas-core)은 여전히 모양 검사만 한다 — 앱을 우회한 연산은 없는 세트를 통과시킬 수 있다.
- 템플릿을 **닫는** 동작이 없다.
- 템플릿 갤러리 패널이 캔버스를 덮는다.
