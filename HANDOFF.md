# HANDOFF

## 이어서 할 일
> 2026-08-01 세션 종료 시 기록 (goal 3개 완주: reference-diversification 1·2 + usage-and-site-surfacing)

- **다음 goal = 제작 표면 왕복 "귀환 경로"(Figma→정본 토큰·문서→production code)** — 사용자 확정 2026-08-01 "A를 다음 세션에서 한다". `/harness-plan` 으로 시작, 재료 수집(리서치)부터.
  - 기반 자산: `docs/design-system/figma-bridge-contract.md`(FB2 — Figma→Askewly 는 "선별적 흡수"로 방향만 선언, 절차 미정) · `docs/research/figma-capability-map-2026-07.md`(FB1 채널 실측) · FB3 토큰→Figma 동기화 실증(`docs/research/figma-variables-sync-2026-07.md`, idempotent PASS). 미검증 = 돌아오는 방향 실증.
  - 사용자 결정 낌: Figma 계정 이원화(원격 MCP=SKKU / REST·chrome=gmail, FB2 §1 리스크 절) — 대상 파일·계정 확정 필요.
- 배포: `667f867` push 완료 — 라이브 확인은 `curl https://ui.askewly.com/llms.txt | grep adaptive-navigation-container` (세션 종료 시 감시 중이었음, 미확인이면 재확인).
- 보류 후보(사용자에게 제시된 순위): B 이식 축(품질 판정 대기 — 열면 Around C→A 재판정) · C 매체 통합 검증(슬라이드 파이프가 토큰 SSOT 소비하는지, 반나절 그릇) · D RL 후속 배치(dashboard·checkout 레시피 — 수요 대기).

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품 축 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-01 완주: M7~M11(레퍼런스 다변화 — knowledge 4본 신설) + M12(설치 경로 정합·Quickstart) + M13(adaptive-navigation-container 승격 + Judgment guides 4페이지)
- 다음 차례: `/harness-plan` — Figma 귀환 경로 goal 설계

### 현재 상태 / 주의점
- main 클린·push 완료(`667f867`). 신규 표면: `/docs/judgment-*` 4페이지 · 레시피 48(adaptive-navigation-container) · README §How to use · templates/README.md.
- 설치 명령 정본 = `@askewly/design`(bin `askewly-design`) — 사이트 예시는 실존 recipe id 만 쓴다. 재유입 검사: `grep -rn "npx ui-dictionary"` 0 유지.
- knowledge 신설 시 FIXED_ASSETS 수동 등재 필수(생성기가 knowledge/ glob 안 함) — reference-loop.md 참조.
- untracked `tmp-patterns-reference.png` 사용자 소유 방치 유지.
