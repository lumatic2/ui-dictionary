# Horizon — Taste Corpus (판단 상향 레퍼런스 흡수)

Date: 2026-07-17
Status: active (2026-07-17 사용자 승인 "ㄱㄱ" — 큐레이션 5종·Dribbble 조건부 포함 구성 확정)
Objective link: `OBJECTIVE.md` (에이전트가 "의도적으로 디자인된 느낌"의 UI를 만든다 — 그 판단의 상한을 올림)
Preceding horizon: `plans/horizons/2026-07-expressive-stack.md` (closed 2026-07-17)

## Goal

판단 시스템(시그니처·anti-patterns·recipe·티어 지도)의 상한을 올리기 위해 **최상급 레퍼런스를 소화**한다. 지금까지의 흡수(RL)는 커버리지(새 recipe/term 추가)를 늘렸다면, 이 horizon은 **판단의 질**을 올린다 — 매 관찰이 기존 판단 자산의 구체적 갱신으로 끝나야 흡수로 계수한다(갱신 없는 관찰 = 미소화).

## Why Now

- expressive-stack까지로 "무엇을 어떻게 만드나"의 폭은 확보 — 남은 병목은 "무엇이 좋은가"의 상한 (사용자 발의 2026-07-17: "판단 시스템을 업그레이드하기 위해 높은 품질의 레퍼런스들을 먹어야").
- 기존 소스가 Tailwind Plus류 구조 레퍼런스 중심이라 완결성 판단은 길렀지만 취향 판단의 상한은 못 올림.
- RL 5단계 파이프라인·inbox·ledger가 실증돼 있어 소화기관 재발명 불필요 — 계약만 개정하면 됨.

## 취향 정본 (사용자 확정 2026-07-17)

1순위 = **사용자 큐레이션**: Notion · Linear · Codex(OpenAI) · Claude · Google. 합의된 명작·수상작은 보조. Dribbble은 조건부(성립성 게이트 — 콘셉트 목업의 "화면빨 좋은 미완성"을 걸러냄).

## Milestones

> 실행 순서: TC1(계약) → TC2(제품 배치, 좁고 깊게) → TC3(표현 배치) → TC4(성문 판단 diff). TC2~4 plan은 TC1 계약을 입력으로 승격 시점에 펼친다.

### TC1 — 흡수 계약 개정 (P0)

RL 루프에 taste 경로 신설: 관찰 → 원리 추출 → **기존 판단과의 diff → 자산 갱신** 의무 계약(`research/taste-loop.md`) + taste ledger. Dribbble류 콘셉트 소스용 성립성 테스트 게이트(실데이터·에러 상태·한글·다크모드 성립 여부) 포함.

### TC2 — 제품 배치: 사용자 큐레이션 5종 (P0)

Notion·Linear·Codex·Claude·Google을 실화면 기준으로 정밀 해부(좁고 깊게 — 제품당 표면 1~2개, 착수 시 사용자와 표면 확정). 제품당 "잘하는 판단 2~3개" 추출 → 자산 갱신 추적. 브라우저 실관찰 + 스크린샷 증거.

### TC3 — 표현 배치: Dribbble 조건부 (P1)

성립성 게이트 통과 원리만 흡수, 탈락 사례는 "왜 안 성립하는가"를 anti-pattern 재료로 역이용.

### TC4 — 성문 판단 diff: HIG·Material·Polaris (P1)

1급 디자인 시스템 원칙 문서를 우리 시그니처·anti-patterns와 충돌 검증하며 **diff만** 선별 흡수(전량 수용 금지 — 스타일 고정 금지 원칙과 충돌하는 항목은 기각 사유 기록).

## Close Criteria

taste ledger에 관찰→자산 갱신 추적이 12건 이상(제품 배치 10+ / 표현·성문 배치 각 1+) 기록되고, 그 갱신이 실제 판단 자산(시그니처·anti-patterns·recipe·티어 지도 중 2종 이상)에 배포 반영되면 닫는다.

## 범위 제외

- 신규 recipe 대량 추가(커버리지 확장은 RL 기존 루프 소관 — 이 horizon은 판단 갱신이 산출물)
- 레퍼런스 자산 벤더링·복제(관찰과 원리만, look 복사 금지 — DF-3 원칙)
- 유료/로그인 벽 뒤 자료의 무단 수집(사용자 계정 표면은 사용자 브라우저 경유 + 승인)

## Objective Impact Target

성공 상태 ③의 질적 상한: "그럴듯한 UI"에서 "최상급 제품의 판단이 배어 있는 UI"로.

## Backlinks

- Objective: `OBJECTIVE.md`
- 소화기관: `research/reference-loop.md` (RL 5단계 — TC1이 taste 경로를 증설)
- Predecessor: `plans/horizons/2026-07-expressive-stack.md` (closed)
