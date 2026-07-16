# Horizon — Agent Adoption Loop (에이전트 채택 루프)

Date: 2026-07-17
Status: active (2026-07-17 사용자 승인 — public-product-monetization park 직후)
Objective link: `OBJECTIVE.md` (성공 상태 ③ 에이전트 소비 + 이동 축 "탐색·주입 도구 → 제작 환경", 장기 아크 5)
Preceding horizon: `docs/horizons/2026-07-public-product-monetization.md` (parked 2026-07-17)

## Goal

Claude/Codex로 디자인 관련 작업을 할 때 **askewly design 조회가 기본 경로**가 되고(React/shadcn/Tailwind를 쓸 때처럼 "askewly design에서 찾아보자"는 흐름), 그 결과물이 **사용자 스타일 기준을 통과하는 고품질 디자인**이 되는 상태를 만든다.

## Why Now (승인 시점 근거)

Agent Integration horizon(2026-07-07)이 발견(llms.txt)·소비(custom-skills)·실증 1건의 *경로*는 깔았지만, 실사용 *습관*은 생기지 않았다 — 사용자 진단(2026-07-17): "사이트와 서비스를 만들었음에도 어떻게 써야 하는지 감각이 없다." 빠진 것 네 가지: ① 디자인 작업 → askewly design 자동 라우팅 규칙 부재, ② 실전 사용 0건에 가까워 마찰 미파악, ③ "내 스타일" 판정 기준 미성문화, ④ 수요 주도 자산 성장 루프 단절. 수익화(AM~PP)는 쓰는 흐름과 품질이 검증된 뒤가 자연스럽다 — 사용자 판정으로 park.

시장 재료: 수집 beat 면제 (2026-07-17 사용자 확정 흐름 — 내부 채택·dogfooding 기획으로 시장 판단 없음).

## Milestones

### AD1 — Default Routing 배선 (활성)

에이전트 진입 프로토콜 정본화 + 전역 라우팅 규칙(전역 CLAUDE.md·디자인 스킬) 배선. 상세: `docs/plans/2026-07-17-ad1-default-routing.md`.

### AD2 — Real-work Dogfooding (후보)

실제 프로젝트 디자인 작업 3~5건을 askewly design 경유로 수행 (2026-07-17 사용자 확정: 인위 시나리오가 아니라 실작업). 마찰·부족 자산·미조회 사례를 dogfooding ledger로 장부화. 대상 프로젝트 선정은 활성화 시 사용자 결정.

### AD3 — Style Signature (후보)

"내 스타일" 판정 기준 성문화: 기존 토큰 SSOT·templates·과거 결과물에서 역산해 초안 → 사용자 인터뷰로 확정 (2026-07-17 사용자 확정: 역산+인터뷰 보강). 스타일 시그니처 문서 + 체크리스트를 검증 루프(design-qa 계열)에 편입.

### AD4 — Gap-driven 확장 (후보)

AD2 장부에서 나온 부족 recipe/token/anti-pattern을 수요 주도로만 확장 (AG3의 "선제 배치 확장 없음" 원칙 승계). 장부 항목 → 자산 반영 추적 가능해야 한다.

## Close Criteria

디자인 작업 3건 이상이 사람 개입 없이(라우팅 규칙·스킬 경유로) askewly design을 조회해 수행되고, 그 결과물이 스타일 체크리스트를 통과한 것이 dogfooding ledger에 기록되면 닫는다.

## 범위 제외 (이번 horizon에서 하지 않는 것)

- 결제·계정·Pro·에셋 팩 (parked horizon 소관 — `docs/horizons/CANDIDATES.md` 복귀 후보)
- MCP 서버 구축 (Agent Integration의 C-11 결정 유지 — 라우팅·프로토콜이 먼저)
- 선제적 레시피 대량 확장 (AD4 수요 주도로만)
- 사이트 IA·공개 경험 재작업 (PX에서 완료 — 회귀 없는 유지만)

## Objective Impact Target

성공 상태 ③("Codex/Claude Code가 …의도적으로 디자인된 느낌의 UI를 만들어낸다")을 실증 1건에서 **일상 워크플로우**로 확장. 이동 축 "일회성 작업 → 반복 가능한 루프"를 소비 측에서 완성.

## Backlinks

- Objective: `OBJECTIVE.md`
- Horizon 후보 백로그: `docs/horizons/CANDIDATES.md`
- Predecessor: `docs/horizons/2026-07-public-product-monetization.md` (parked)
- 관련 선행: `docs/horizons/2026-07-agent-integration.md` (closed 2026-07-07 — 경로 배선)
