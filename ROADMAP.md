# ROADMAP

> Last updated: 2026-07-07
> Status: Agent Integration horizon active
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-integration" status="active" -->
Goal: SSOT(토큰·분류·레시피)를 Codex/Claude Code가 스스로 발견·소비하는 진입점으로 배선한다 — 발견(llms.txt) → 소비(custom-skills) → 실증(외부 프로젝트 1건). Details: `docs/horizons/2026-07-agent-integration.md`.

## Active Milestones

<!-- harness:milestone id="AG1" status="active" priority="P0" -->
### AG1 - llms.txt 발견 계층
- DoD: `ui.askewly.com/llms.txt` 배포(링크만, 값 중복 금지 — C-10) + SSOT 자산 raw URL 접근 + 인덱스가 SSOT에서 스크립트로 파생(손 편집 금지).
- Evidence: 생성 스크립트 + 배포 URL fetch 결과 + 링크 무결성 검증 PASS
- Gap: SSOT는 존재하지만 에이전트가 발견하는 인덱스가 없다. SMC3 데모는 경로를 손으로 넘겨줬다.
- Status: [ ]

<!-- harness:milestone id="AG2" status="pending" priority="P0" -->
### AG2 - custom-skills 소비 계층
- DoD: design-harness §4 SSOT 분기 + design-screen §2/§5 정정 + 스킬이 recipes/·토큰 SSOT(AG1 인덱스 포함)를 소비 좌표로 참조 + setup.sh 재배포 + 스킬 경유 소비 smoke 1회.
- Evidence: custom-skills 커밋 + 재배포 로그 + 소비 smoke 기록
- Gap: 스킬 영향 감사(docs/research/design-skills-impact-audit.md)의 실행 계획이 미이행 — 스킬은 아직 DESIGN.md 손편집 정본 시대를 전제한다.
- Status: [ ]

<!-- harness:milestone id="AG3" status="pending" priority="P0" -->
### AG3 - 외부 프로젝트 실전 실증
- DoD: 외부 레포(development-dictionary — 2026-07-07 확정) 1건에서 에이전트가 진입점(스킬 또는 llms.txt) 경유로 SSOT를 소비해 UI 구현(색 리터럴 0 기준 계승). 부족 레시피는 수요 주도 확장.
- Evidence: 외부 레포 구현 diff·스크린샷 + 소비 경로 기록 (docs/research/)
- Gap: 진입점이 실제 워크플로우에서 작동함을 증명한 사례가 없다 — horizon 닫는 기준.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="PSS2" status="pending" priority="P1" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: `docs/plans/2026-07-05-showcase-atlas-upgrade.md` (resume from Step 4); build/lint + Chrome screenshots
- Gap: Showcase Steps 0-3 done; remaining cards and integrated QA open. New items from SMC: hero pill-button reconciliation, dark-mode toggle activation, showcase reduced-motion fallback.
- Status: [ ]

<!-- harness:milestone id="FGB1" status="candidate" priority="P2" evidence="docs/horizons/2026-07-figma-bridge-candidate.md" -->
### FGB1 - Figma Bridge Candidate Horizon
- DoD: Figma's role is defined as both competitor and complement, with a concrete bridge model from Figma artifacts to Askewly Design tokens, patterns, implementation recipes, and coding-agent verification.
- Evidence: docs/horizons/2026-07-figma-bridge-candidate.md
- Gap: Now unblocked — the SMC token model exists to bridge against.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Public Site Shell closed 2026-07-07; System Model Core closed 2026-07-07).
