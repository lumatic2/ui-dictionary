# Plan - SCD2 레시피 커버리지 배치

Date: 2026-07-10
Milestone: SCD2 (`ROADMAP.md`, active)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-system-content-depth.md` (active)
- Milestone: SCD2 — 레시피 커버리지 배치 (pattern_group 10종)

## Scope

현재 5개 레시피가 커버하는 pattern group은 `marketing`, `application-ui`, `forms`, `navigation`, `overlays`다. 미커버 5개(`docs`, `layout`, `data-display`, `feedback`, `commerce`)에 실구현 기반 레시피 8개를 추가해 총 13개로 만든다.

신규 레시피와 code asset:

- `docs/article-documentation-layout` → `examples/ui-vocabulary-site/src/App.tsx` (`DocsArticlePage`)
- `layout/sidebar-application-shell` → `examples/ui-vocabulary-site/src/App.tsx` (`SidebarShell`)
- `layout/responsive-content-grid` → `examples/ui-vocabulary-site/src/App.tsx` (grid-list/page-section implementations)
- `data-display/interactive-data-table` → `examples/ui-vocabulary-site/src/App.tsx` (`UsersTable`)
- `data-display/stat-summary-grid` → `examples/ui-vocabulary-site/src/components/home-page.tsx` (`DashboardShowcase`, `dashboardStats`)
- `feedback/actionable-toast` → `examples/ui-vocabulary-site/src/App.tsx` (`ToastCard`)
- `feedback/recoverable-empty-state` → `examples/ui-vocabulary-site/src/App.tsx` (empty-state implementations)
- `commerce/checkout-order-summary` → `examples/ui-vocabulary-site/src/App.tsx` (checkout/order summary implementations)

범위 밖: 기존 레시피 wording 재작성, 새 UI 구현, CLI 기능 변경, npm publish, Pro 에셋/라이선스.

중단점: recipe validator 실패, code_asset/term/token 참조 불일치, CLI `add` 실주입 실패, 배포 실패. 예상 밖 사용자 소유 결정은 없음.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  delegation_decision:
    remote_background_agents: skip
    reason: "사용자가 sub-agent/병렬 위임을 요청하지 않았고, 현재 런타임 정책상 명시 요청 없는 위임은 금지된다. 배치별 자체 reviewer/qa/gate pass로 검증한다."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "pattern_group, recipe schema, validator, CLI add 계약이 이미 recipe-format.md와 CLI registry contract에 고정되어 있어 제품 계약 변경이 없다."
  perspectives:
    product: "빈 pattern group을 모두 채워 llms.txt와 CLI가 실제 제품 표면 전반의 콘텐츠를 제공한다."
    architecture: "기존 code_asset을 참조하고 레시피에는 20~40줄 발췌만 두며 코드 SSOT를 복제하지 않는다."
    security: "secret/auth/외부 쓰기 없음. 배포는 기존 승인된 main push 경로만 사용한다."
    qa: "validate-recipes, llms 생성 실패모드, CLI build/test/add 실주입 2종, site build/lint, public asset probe를 통합 게이트로 둔다."
    skeptic: "형식만 채운 얕은 레시피가 될 위험을 code asset의 실제 상태·반응형·실패 행동을 Checks/Anti-patterns에 연결해 차단한다."
  role_lanes:
    explorer: "App.tsx/home-page.tsx의 실구현 symbol과 terms/tokens 실존을 배치 전 확인한다."
    planner: "8개 레시피가 5개 미커버 group과 정확히 대응하고 총 13개가 되는지 대조한다."
    reviewer: "각 레시피가 Principles, recipe-format, 코드 SSOT 경계를 어기지 않는지 diff별 검토한다."
    qa: "배치마다 validator를 돌리고 마지막에 CLI 및 public discovery E2E를 재실행한다."
    gate: "완료 전 ledger evidence와 ROADMAP DoD를 독립 대조한다."
  dod:
    - "python scripts/validate-recipes.py reports recipes ok: 13"
    - "node scripts/generate-llms-txt.mjs publishes all 13 recipes and retains missing-source failure"
    - "packages/cli build/test PASS and add smoke injects at least two new recipes into fresh targets"
    - "site lint/build and production public asset probes PASS"
```

## Step 트리

- [x] Step 1 — Docs + Layout 배치: `article-documentation-layout`, `sidebar-application-shell`, `responsive-content-grid` 3종 작성. (verify: `python scripts/validate-recipes.py` → recipes ok: 8)
- [x] Step 2 — Data Display 배치: `interactive-data-table`, `stat-summary-grid` 2종 작성. (verify: validator → recipes ok: 10)
- [x] Step 3 — Feedback 배치: `actionable-toast`, `recoverable-empty-state` 2종 작성. (verify: validator → recipes ok: 12)
- [x] Step 4 — Commerce 배치: `checkout-order-summary` 1종 작성. (verify: validator → recipes ok: 13 + 10/10 pattern_group coverage)
- [x] Step 5 — 통합 소비·배포: llms.txt 재생성, CLI 재번들/test, fresh target `add` smoke 2종, site lint/build, push 후 public asset 확인. (verify: changeset 통합 checklist + Cloudflare source commit)

## 결정 로그

- [확정 2026-07-10] 현재 horizon의 SCD1→SCD2 연쇄를 유지한다.
- [AI 기본값] 총 5→13종 목표를 만족하는 최소 신규 8종으로 제한하고, 미커버 group마다 최소 1종을 둔다.
- [AI 기본값] 새 컴포넌트를 만들지 않고 이미 배포된 실구현 code asset만 증류한다.
- 사용자 소유 결정: 없음.
