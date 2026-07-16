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

> 실행 순서 (2026-07-17 사용자 확정): AD1 라우팅 → AD2 스타일 시그니처 → AD3 dogfooding → AD4 확장. 근거: close 기준이 "결과물이 스타일 체크리스트 통과"라서 판정 기준(AD2)이 실작업(AD3)보다 먼저 있어야 각 건을 즉시 판정한다.

### AD1 — Default Routing 배선 (활성)

에이전트 진입 프로토콜 정본화 + Claude·Codex 양쪽 전역 라우팅 배선. 3 changesets: ① 진입 프로토콜 문서 + llms.txt 노출, ② Claude 배선(전역 CLAUDE.md 규칙 + custom-skills 디자인 스킬 갱신·재배포), ③ Codex 배선(전역 Codex 지침 + 배포 미러) + 양 에이전트 통합 E2E. hook 강제는 이번 범위 밖 — E2E에서 미발화가 관측되면 격상 경로(2026-07-17 사용자 확정: 규칙+스킬 먼저). 상세: `docs/plans/2026-07-17-ad1-default-routing.md`.

### AD2 — Style Signature (후보, P0)

"내 스타일" 판정 기준 성문화 (2026-07-17 사용자 확정: 역산 + 인터뷰 보강). ① 역산 초안 — 토큰 SSOT·templates(neo-claude 등)·현 사이트·과거 결과물에서 스타일 특징(타이포·컬러 운용·밀도·모션·보더/섀도 성향) 추출 → style-signature 문서 초안, ② 사용자 인터뷰로 확정(계획된 사용자 상호작용 — 연쇄의 정당한 정지점) + 판정 체크리스트 도출, ③ 검증 루프 편입 — design-qa 스킬·anti-patterns·llms.txt에 체크리스트 노출.

### AD3 — Real-work Dogfooding (후보, P1)

실제 프로젝트 디자인 작업 3~5건을 라우팅 경유로 수행하고 AD2 체크리스트로 즉시 판정 (2026-07-17 사용자 확정: 실작업, 혼합 확보 — 즉시 착수 실작업 2건 지정 + 기회주의 1~3건). ① dogfooding ledger 인프라(건별 조회 경로·체크리스트 판정·마찰·부족 자산 기록), ② 지정 실작업 2건 수행(후보: askewly.com·brain.askewly.com·development-dictionary 표면 — 활성화 시 사용자와 확정), ③ 기회주의 건 수행·장부화. 작업 자체는 외부 레포, evidence는 이 레포 ledger.

### AD4 — Gap-driven 확장 (후보, P1)

AD3 장부에서 나온 부족 recipe/token/anti-pattern/프로토콜 마찰을 수요 주도로만 확장 (AG3 "선제 배치 확장 없음" 원칙 승계). ① 장부 → 우선순위 갭 목록, ② 자산 확장 구현(기존 파이프라인: build:catalog·llms.txt·audit:visuals 검증 체인), ③ 장부 항목 → 자산 반영 추적(각 갭이 어느 changeset으로 닫혔는지).

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
