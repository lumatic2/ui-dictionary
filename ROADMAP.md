# ROADMAP

> Last updated: 2026-07-07
> Status: Figma Bridge horizon active
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="figma-bridge" status="active" -->
Goal: Figma를 경쟁자이자 보완재로 규정하고 Figma 자산 ↔ Askewly SSOT ↔ 에이전트 구현·검증 브리지를 실측 기반으로 정의한다 — 연결 실측(FB1) → 계약(FB2) → 토큰→variables 실증(FB3). Details: `docs/horizons/2026-07-figma-bridge.md`. (직전 horizon: agent-integration closed 2026-07-07 → `BACKLOG.md`)

## Active Milestones

<!-- harness:milestone id="FB1" status="completed" priority="P0" evidence="docs/research/figma-capability-map-2026-07.md" -->
### FB1 - 연결 계층 + capability 지도
- DoD: Figma 공식 Dev Mode MCP를 Claude Code에 등록·실호출 검증(blocker면 사실 기록) + chrome-ext 실 UI 경로 검증 1회 + 경로별 capability 지도 문서화.
- Evidence: docs/research/figma-capability-map-2026-07.md
- Gap: Figma 접근 경로가 이 환경에서 실측된 적 없다 — candidate doc의 질문들이 전부 미확인.
- Status: [x]

- Completed at: 2026-07-07
<!-- harness:milestone id="FB2" status="active" priority="P0" -->
### FB2 - 브리지 모델 계약
- DoD: Figma→Askewly / Askewly→Figma 방향별 계약(variables↔tokens.json 매핑, 흡수/외부 경계, 차별 지점) + figma-codex-workflow 스킬 정합 지점 식별.
- Evidence: docs/design-system/figma-bridge-contract.md + ADR
- Gap: 브리지가 무엇을 잇고 무엇을 안 잇는지 계약이 없다.
- Status: [ ]

<!-- harness:milestone id="FB3" status="pending" priority="P0" -->
### FB3 - 왕복 실증: 토큰 → Figma variables
- DoD: askewly.tokens.json semantic 토큰(light+dark)을 Figma variables로 밀어넣기 — 이름 보존, idempotent, 소비 경로 기록.
- Evidence: Figma variables 검증 기록 + 절차/스크립트 + docs/research/ 사례 노트
- Gap: 디자이너 표면에서 Askewly SoT를 쓸 수 있음이 실증된 적 없다 — horizon 닫는 기준.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="PSS2" status="pending" priority="P1" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: `docs/plans/2026-07-05-showcase-atlas-upgrade.md` (resume from Step 4); build/lint + Chrome screenshots
- Gap: Showcase Steps 0-3 done; remaining cards and integrated QA open. New items from SMC: hero pill-button reconciliation, dark-mode toggle activation, showcase reduced-motion fallback.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Public Site Shell closed 2026-07-07; System Model Core closed 2026-07-07; Agent Integration closed 2026-07-07).
