# Horizon — Skill Entry (진입 경량화 + 사람 확인 게이트)

Date: 2026-07-18
Status: active
Objective link: `OBJECTIVE.md` (성공 상태 ③ 에이전트 통합 — 판단 주입 경로의 인체공학 교정)
Preceding horizon: `plans/horizons/2026-07-taste-corpus.md` (closed 2026-07-17)

## Goal

Askewly Design의 에이전트 진입 경로를 전역 CLAUDE.md/AGENTS.md 규칙에서 **`askewly-design` skill**로 이전해 비디자인 세션의 컨텍스트 noise를 제거하고, 진입 프로토콜에 **사람 눈 확인 게이트**(스크린샷 증거 의무 + 사람 확인 전 완료 선언 금지)를 추가한다.

## Why Now

- 사용자 발의 2026-07-18: ① "디자인 결과물을 사람이 눈으로 확인하는 단계는 꼭 필요해" — 현 프로토콜은 에이전트 자가 판정에서 끝남(하한선 필터일 뿐 상한선 보증 아님) ② "진입점은 skill로 만드는 게 좋지 않을까 — 불필요한 noise가 줄지 않으려나" — 전역 절은 모든 프로젝트의 모든 세션에 주입됨.
- AD1 E2E 실측 결함 "규칙 단독 비결정성"(DF-1/DF-2에서 워커 2/2 판정 스킵)의 구조적 해소: skill 호출은 관측 가능한 명시 행위.
- 사용자 확정(2026-07-18 AskUserQuestion): 전역 "디자인 판정" 절은 **완전 제거** — skill description 자동 트리거에만 의존.

## 설계 원칙

- **정본 유지**: 프로토콜 정본은 `docs/design-system/entry-protocol.md`(ui.askewly.com 배포) 하나. skill은 내용을 복제하지 않는 **얇은 라우터**(llms.txt fetch → 프로토콜 준수 → 스크린샷 → 사람 확인 대기)다 — stale 방지.
- skill 소스는 관례대로 `~/projects/custom-skills/askewly-design/` + `setup.sh` 배포(Claude `~/.claude/skills/` + Codex `~/.codex/skills/` 동시).

## Sizing (boundary horizon 사유)

milestone 2개 — 권고 루브릭(3~5개) 미만이지만 사용자 발의 범위가 명확히 한정된 진입 경로 교정이며, 인접 후보(다음 제품 방향)와 병합하면 사용자 소유 결정을 침범한다. 좁은 boundary horizon으로 정당.

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| SE1 | skill 신설 + 프로토콜 사람 게이트 개정 | `plans/2026-07-18-se1-skill-and-human-gate.md` | approved 2026-07-18 | 불요 — 내부 자산 재배선 |
| SE2 | 전역 규칙 제거 + E2E 검증 | `plans/2026-07-18-se2-global-removal-e2e.md` | approved 2026-07-18 | 불요 |

## Close Criteria

① `askewly-design` skill이 Claude·Codex 양쪽에 배포되고 ② entry-protocol에 스크린샷+사람 확인 게이트가 배포 반영되고 ③ 전역 CLAUDE.md/AGENTS.md에서 "디자인 판정" 절이 제거되고 ④ E2E로 skill 경유 진입 + 스크린샷 산출이 최소 1회 관측되면 닫는다.

## 범위 제외

- 프로토콜 내용 자체의 재설계(판단 주입 계약은 AD4에서 정렬 완료 — 이 horizon은 *전달 경로*만)
- 신규 recipe/knowledge 추가
- design-qa 등 기존 글로벌 디자인 스킬 개편

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-taste-corpus.md`
- 관련 교훈: AD3 DF-3(판단 주입 ≠ 스타일 주입), AD1 E2E(규칙 단독 비결정성)
