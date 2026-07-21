# Plan — UX4 Product Polish And Validation

Date: 2026-07-12
Milestone: UX4 (`ROADMAP.md`, active)
Status: completed 2026-07-12 — 3/3 steps; packaged evidence가 UX2+UX3+UX4 renderer 기준으로 재생성됨 (5k p95 12.10ms, IME waiver 유지)

## Hierarchy

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-canvas-production-environment.md` (H1) — UX3 완료 후 연쇄 승격.
- Outcome: UX1~UX3에서 만든 개별 워크플로우를 하나의 일관된 제품 경험으로 닫고, UX2·UX3 기능을 포함한 packaged 최종 게이트를 통과한다 (UX2 packaged 재증명 이월 해소).

## Scope Boundary

- UX4 소유: empty/loading/error/recovery 상태, 접근성(키보드·ARIA·대비), 밀도·시각 일관성(툴바 협폭 debt 포함), packaged 대표 워크플로우 E2E + evidence 재생성.
- 제외: 새 기능 표면(CR/RT/AI 소관), Askewly 재스킨(AI milestone), 캔버스 엔진 변경.
- 기존 canonical/authority 경계·테스트 계약 유지. IME waiver는 waiver로 유지.

## Step Tree

- [x] Step 1 — States and resilience sweep
  - 전 패널(layers/insert/agents/inspector/project entry) empty·loading·error·recovery 상태 감사 후 누락 보강. bridge 실패·복구 상태 문구 일관화.
  - Verify: 상태별 컴포넌트 테스트 추가 + 기존 55+ 스위트 회귀 0.

- [x] Step 2 — Accessibility, density, and visual consistency sweep
  - 키보드 포커스 순서·ARIA 롤·라벨 감사, 대비 확인, 툴바 협폭 wrapping 해소(그룹핑/overflow), 패널 spacing·typography 정규화.
  - Verify: a11y 단정 테스트(롤·라벨·포커스) + 협폭(900px) 렌더 테스트 + 브라우저 양폭 smoke.

- [x] Step 3 — Packaged representative workflow gate
  - make:win 재패키징(UX2·UX3 renderer 포함) 후 packaged E2E·installer lifecycle 실행, verify:package + verify:packaged-evidence 신선한 아티팩트로 재생성, 대표 워크플로우(생성 루프 + 협업 패널) fresh Chrome/packaged 스크린샷.
  - Verify: `npm run test:packaged-e2e; npm run verify:package; npm run verify:packaged-evidence` PASS (IME waiver 유지), 5k 예산 유지.

## 결정 로그

- status: resolved
- 협폭 툴바 해법 = 그룹 축약+overflow 메뉴 대신 **섹션별 wrap 허용 + 우선순위 축약(라벨→아이콘)** 중 구현 단순한 쪽을 워커 재량으로 (시각 검증으로 게이트).
- 상태 문구 톤 = 기존 project-entry 문구 스타일(짧은 문장 + 행동 제안) 통일.
- 예상되는 추가 사용자 소유 결정: 없음.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: reduction
  delegation_decision:
    remote_background_agents: use
    reason: "Step 1-2는 renderer 한정 sweep으로 위임 적합(같은 파일군이라 한 워커가 순차 수행); Step 3 packaged 게이트는 장시간 빌드·실행이라 백그라운드 위임 후 오케스트레이터 독립 게이트"
    target_roles: ["worker-implementation", "qa"]
    execution_path: claude_subagent
  spec_delta: "ROADMAP UX4 marker active 승격 (반영 완료)"
  perspectives:
    product: "첫 사용자가 오류·빈 상태에서도 다음 행동을 알 수 있다"
    architecture: "표면 정리만, 계약·경계 불변"
    security: "packaged 게이트가 fuses·security 검증 재실행"
    qa: "상태·a11y 단정 테스트 + packaged E2E + evidence 재생성"
    skeptic: "폴리시가 스타일 취향 변경으로 새면 실패 — 상태/a11y/packaged 증거로만 판정"
  role_lanes:
    reviewer: "오케스트레이터가 diff 게이트: 기능 변경·계약 변경 유입 반박"
    qa: "오케스트레이터가 전 스위트 + packaged 결과 독립 확인"
    gate: "ledger 3-event 오케스트레이터 소유"
  dod:
    - "core/renderer/desktop/mcp 전 스위트 PASS + 신규 상태·a11y 테스트"
    - "packaged E2E + verify:package + verify:packaged-evidence 신선 아티팩트로 PASS"
    - "양폭 브라우저 smoke + packaged 스크린샷 evidence"
```

## 중단점

각 step 완료 = checkpoint. blocked/error·새 사용자 결정·보안 경계 변경 시 정지. UX4 완료 시 H1 다음 후보 CR로 연쇄.
