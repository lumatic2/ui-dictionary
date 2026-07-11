# Plan — UX3 Agent Collaboration UX

Date: 2026-07-12
Milestone: UX3 (`ROADMAP.md`, active)
Status: completed 2026-07-12 — 5/5 steps; evidence: phases/agent-design-agent-collaboration-ux/ + 게이트 매트릭스(core 52/52·renderer 55/55·desktop 46/46·mcp 17/17)

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — 에이전트와 production code로 무손실 왕복하는 제작 환경.
- Horizon: `docs/horizons/2026-07-canvas-production-environment.md` (H1).
- Predecessor: UX2 Visual Creation Workflow 완료·ledger 확정.
- Outcome: bridge/MCP 왕복을 사람이 이해·통제하는 in-product collaboration workflow로 만들고, 하이브리드 채널(MCP live context + thin CLI)을 배선한다.

## Scope Boundary

- UX3 소유: agent activity/connection 표면, selection context 바인딩, transaction 요약/diff, conflict 표면, audit 기반 Undo, MCP `/events` 구독, BridgeClient 재사용 CLI.
- 제외: 컴포넌트 레지스트리(CR), 실 레포 소스 반영(RT), 시각 폴리시(UX4), 새 renderer 권한/네트워크 authority.
- 모든 표면은 기존 bridge 계약(HTTP+WS, bearer token, revision/hash guard)을 소비만 한다 — bridge authority 경계 변경 금지.
- Test failure는 3회 자가교정, 그 이상 생존 시 blocked.

## Step Tree

- [x] Step 1 — MCP live context (channel)
  - MCP 서버가 bridge `/events` WS를 구독해 snapshot 캐시를 유지하고 `get_context`가 폴링 없이 live selection/revision을 반환. 구독 실패 시 기존 REST 폴백.
  - Verify: `packages/agent-design-mcp` vitest — live update 반영, WS 단절 폴백, revision guard 회귀 없음.

- [x] Step 2 — Thin CLI over BridgeClient (channel)
  - `packages/agent-design-mcp`에 두 번째 bin `agent-canvas`: `context|apply|undo|verify` 서브커맨드, 같은 env(BRIDGE_URL/SESSION_TOKEN/ACTOR) 사용, JSON in/out, exit code 계약.
  - Verify: CLI unit tests + 모의 bridge에 대한 E2E 실행(exit code·출력 관측), 실패 모드(bad token, revision conflict) 포함.

- [x] Step 3 — Collaboration feed contract (desktop/bridge projection)
  - desktopHost에 actor-attributed transaction feed API(`onCanvasSnapshot` reason 확장 또는 `getRecentTransactions`)와 actor별 연결 상태를 노출. 브라우저(liveBridge) 경로에도 동등 계약.
  - Verify: desktopHost/liveBridge 테스트 — actor 귀속, revision 순서, 재연결 후 cursor 연속성.

- [x] Step 4 — Collaboration surface UI
  - Agent 패널: Codex/Claude 연결·작업 상태, 사람이 읽는 transaction feed(actor·op 요약·revision), transaction 단위 Undo, conflict(REVISION_CONFLICT/HASH_CONFLICT) 인라인 표면, "에이전트가 보는 것"(현재 selection context) 표시 + 기존 Copy Codex/Claude와 결합.
  - Verify: 컴포넌트 테스트 — feed 렌더, Undo dispatch, conflict 표시, selection context 동기화, 접근성 롤.

- [x] Step 5 — Dual-actor collaboration E2E
  - 사람 편집 + 에이전트 op 주입이 병행되는 시나리오: 정상 병합, conflict 유발→표면 확인→Undo 복구, 재연결 연속성. 브라우저 smoke + 스크린샷.
  - Verify: renderer E2E 테스트 + core/renderer/mcp 전 스위트 + 브라우저 증거.

## 결정 로그

- status: resolved
- 소진 경로: horizon `2026-07-canvas-production-environment.md` Confirmed Decisions에서 사전 매듭.
- 채널 = 하이브리드 (MCP 기본 표면 + BridgeClient 재사용 CLI + MCP `/events` 구독) — 2026-07-12 사용자 위임 하 추천값 확정.
- CLI 위치 = `packages/agent-design-mcp` 두 번째 bin (새 패키지 대신; 같은 BridgeClient·env 계약 재사용, 분리는 실 수요 발생 시).
- Conflict UX = 인라인 status/피드 항목 (모달 금지 — 편집 흐름 차단 방지).
- Feed 데이터 = 기존 bridge audit/transaction 계약 소비만; 새 저장소·스키마 신설 금지.
- 예상되는 추가 사용자 소유 결정: 없음.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "독립 패키지 단위 step(1·2)은 병렬 위임 가능하고 계약·테스트가 명확; 오케스트레이터는 spec·게이트·통합 담당 (2026-07-12 사용자 지시: 오케스트레이터+백그라운드 노동 체제)"
    target_roles: ["explorer", "worker-implementation"]
    execution_path: claude_subagent
  spec_delta: "ROADMAP UX3 DoD에 하이브리드 채널 배선 포함 (반영 완료)"
  perspectives:
    product: "에이전트 협업이 보이지 않는 기술에서 이해 가능한 제품 표면이 된다"
    architecture: "모든 신규 표면은 기존 bridge 계약의 소비자; authority 경계 불변"
    security: "renderer 권한 확장 없음, token은 env 경유 유지, CLI도 loopback bridge만"
    qa: "step별 vitest + 실패 모드(단절·conflict·bad token) + dual-actor E2E"
    skeptic: "feed가 예쁘기만 하고 conflict 복구가 실제로 안 되면 실패 — Step 5가 복구까지 강제"
  role_lanes:
    explorer: "bridge/MCP 기존 계약 정독은 위임 프롬프트에 명시"
    planner: "CR/RT로 새는 scope(레지스트리·소스 패치 UI) 차단"
    reviewer: "위임 산출 diff를 오케스트레이터가 게이트: 이중 상태·authority 확장·테스트 우회 반박"
    qa: "오케스트레이터가 전 스위트 독립 재실행 후에만 step 완료"
    gate: "ledger 3-event는 오케스트레이터 소유"
  dod:
    - "packages/agent-design-mcp vitest 전체 PASS (live context + CLI)"
    - "renderer/desktop 스위트 회귀 0"
    - "dual-actor E2E + conflict 복구 실패모드 1개 이상 관측"
    - "브라우저 smoke 증거"
```

## 중단점

- 각 step 완료 = checkpoint (2-phase commit). blocked/error, 새 사용자 소유 결정, 보안 경계 변경 필요 시에만 정지.
