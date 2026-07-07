# ROADMAP

> Last updated: 2026-07-07
> Status: Figma Workflow horizon active (opened 2026-07-07)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="figma-workflow" status="active" -->
Goal: Claude Code × Figma 활용 방법론을 리서치 기반으로 확립하고(FW1), askewly 실작업 파일럿 1회 왕복 + 스킬 운영화로 검증한다(FW2). Details: `docs/horizons/2026-07-figma-workflow.md`.

## Active Milestones

<!-- harness:milestone id="FW1" status="completed" priority="P0" evidence="methodology/figma-workflow.md" -->
### FW1 - 리서치 → 방법론 채택
- DoD: 트렌드 리서치 재료(다각 리포트 + 커뮤니티 펄스)와 후보 워크플로우 비교·평가가 문서화되고, 파일럿 방향이 사용자 결정으로 확정되며, 채택 방법론이 `methodology/figma-workflow.md` 계약 문서로 기록된다(브리지 계약과 정합).
- Evidence: methodology/figma-workflow.md
- Gap: Figma Bridge가 파이프는 검증했지만 "언제·어떻게 쓰는가" 방법론이 미정의 — askewly 디자인 시스템 작업 방식이 여기 달려 있다.
- Status: [x]

- Completed at: 2026-07-07
- Summary: 리서치 2건 기반 하이브리드 왕복 워크플로우 채택·계약 문서화
<!-- harness:milestone id="FW2" status="active" priority="P0" -->
### FW2 - 파일럿 실증 + 운영화
- DoD: FW1 채택 워크플로우(하이브리드 왕복)로 askewly 실작업 1회 왕복 실증 + figma-codex-workflow 스킬 갱신 3건이 방법론을 소비 좌표로 흡수.
- Evidence: `docs/research/` 파일럿 사례 노트 + Figma/코드 양쪽 증거 + 스킬 갱신·배포 기록
- Gap: 방법론은 실작업 1회로 검증되기 전까지 문서일 뿐이다.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="PSS2" status="pending" priority="P1" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: `docs/plans/2026-07-05-showcase-atlas-upgrade.md` (resume from Step 4); build/lint + Chrome screenshots
- Gap: Showcase Steps 0-3 done; remaining cards and integrated QA open. New items from SMC: hero pill-button reconciliation, dark-mode toggle activation, showcase reduced-motion fallback.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Figma Bridge closed 2026-07-07; Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
