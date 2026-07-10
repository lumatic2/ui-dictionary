# Plan — AUC3 Terminal Agent Live Canvas Roundtrip

Date: 2026-07-10
Milestone: AUC3 (`ROADMAP.md`, active planning gate)
Status: awaiting execution approval

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — 사용자가 터미널의 Codex/Claude에 디자인을 지시하면 별도 Agent Design canvas가 같은 code-native 정본을 즉시 보여준다.
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`
- Predecessor: AUC1 canonical document/operation/history와 AUC2 direct manipulation/property runtime.
- Outcome: terminal agent mutation과 human canvas manipulation이 하나의 revisioned document, history, source mapping을 공유한다.

## Confirmed product flow

1. 사용자가 Codex CLI 또는 Claude CLI를 자신의 터미널에서 실행한다.
2. 각 CLI의 stdio MCP adapter가 project-local Agent Design bridge에 연결된다.
3. agent가 context를 읽고 typed operations 또는 source patch를 보낸다.
4. bridge가 base revision, path scope, before hash를 검증하고 transaction을 원자적으로 적용한다.
5. 별도 canvas 창은 WebSocket event를 받아 즉시 다시 그린다.
6. exact diff, actor, transaction ID, history, Undo는 승인 대기창이 아니라 audit/recovery surface로 남는다.
7. 사람이 source file을 직접 고치면 file watcher가 reverse sync하여 같은 canvas/document revision으로 수렴시킨다.

## Scope and ownership

- `packages/agent-design-engine`: context projection, transaction validation/apply, exact diff, verification, audit codec를 제공하는 pure TypeScript package.
- `apps/agent-design-bridge`: loopback Node daemon으로 canonical revision/event log, filesystem authority, WebSocket fan-out, file watcher를 소유한다.
- `packages/agent-design-mcp`: Codex와 Claude가 각각 stdio로 실행하는 얇은 MCP adapter. bridge protocol을 재구현하지 않는다.
- `apps/agent-design`: bridge WebSocket client와 connection/recovery/audit UI를 갖되 Node/filesystem authority는 소유하지 않는다.
- MCP tools: `get_context`, `apply_operations`, `apply_source_patch`, `verify`, `undo`.
- AUC3는 repo/session-scoped 연결 명령과 smoke proof까지 다룬다. CLI 프로세스 자동 실행, global config 자동 변경, desktop packaging/supervision은 AUC4 범위다.

## Step tree

- [ ] Step 1 — Local bridge and session protocol
  - pure engine과 loopback bridge를 만들고 project root, ephemeral session token, revision, event cursor, actor, transaction ID 계약을 고정한다.
  - Verify: token/scope rejection, optimistic revision conflict, reconnect replay, loopback-only integration tests.

- [ ] Step 2 — Codex and Claude terminal MCP adapters
  - 동일 stdio adapter를 두 CLI가 repo/session 단위로 연결하고 context/query/mutation/verify/undo tools를 발견하게 한다.
  - Verify: deterministic stdio client contract tests + Codex/Claude 각각 tool discovery/connection smoke.

- [ ] Step 3 — Atomic auto-apply, exact audit, and Undo
  - trusted MCP mutation을 별도 Approve click 없이 적용하되 exact diff와 audit/history를 한 transaction으로 남긴다.
  - Verify: stale revision/hash rejection, validation failure rollback, one transaction→one history entry, exact Undo restoration.

- [ ] Step 4 — Canvas live sync and source watcher reverse sync
  - canvas가 WebSocket event를 받아 bridge acknowledgement 후 p95 100ms 안에 보이고, 직접 source edit은 p95 300ms 안에 반영되게 한다.
  - Verify: reconnect/cursor replay, watcher echo suppression, forced disconnect recovery, browser canvas/source convergence.

- [ ] Step 5 — Dual-CLI fresh React roundtrip proof
  - Codex/Claude actor가 같은 fresh React project를 순차·충돌 상황에서 수정하고 canvas/source/document가 일치함을 증명한다.
  - Verify: actual CLI discovery smoke when available, repeatable protocol E2E, conflict/crash/reconnect, screenshot and drift evidence.

## Trust, conflict, and recovery rules

- bridge는 `127.0.0.1`에만 bind하고 매 실행마다 project/session token을 발급한다.
- source mutation은 trusted project root와 registered source mapping allowlist 밖으로 나갈 수 없다.
- 모든 write는 base revision과 before hash를 동반한다. stale/conflicting write는 silent last-write-wins 대신 structured conflict로 거부한다.
- transaction은 validate→stage→persist→publish 순서로 원자 적용하며 어느 단계든 실패하면 document, source, history를 함께 rollback한다.
- bridge transaction ID/content hash로 watcher echo를 제거하되 실제 외부 edit는 삼키지 않는다.
- reconnect client는 last event cursor 이후의 event를 replay하고 gap이 있으면 full snapshot을 다시 받는다.

## Quality gates and stop rules

- bridge acknowledgement→visible canvas p95 ≤100ms, direct source edit→visible canvas p95 ≤300ms를 동일 Windows 머신에서 3회 측정한다.
- deterministic protocol client는 transport/transaction 증거일 뿐 live model design quality 증거로 주장하지 않는다.
- actual Codex/Claude smoke가 환경 문제로 불가능하면 repeatable E2E 결과와 blocker를 분리 기록하고 live CLI 연결을 통과한 것으로 표시하지 않는다.
- public bind, token 없는 mutation, project root escape, partial write, silent conflict가 발견되면 다음 step으로 진행하지 않는다.
- canvas가 Node/filesystem authority를 다시 소유하거나 두 CLI adapter가 서로 다른 mutation semantics를 가지면 architecture로 되돌아간다.

## Decision log

- 사용자가 실행한 terminal agents가 주체이며 Agent Design app이 CLI를 spawn하지 않는다.
- trusted terminal tool call은 auto-apply한다. per-change canvas approval은 두지 않는다.
- exact diff/history/Undo는 audit와 recovery를 위해 필수다.
- Codex와 Claude는 하나의 bridge authority와 동일 MCP tool semantics를 공유한다.
- repo/session 연결만 안내·검증하며 global CLI configuration은 자동 변경하지 않는다.
- daemon packaging, lifecycle supervision, desktop installer는 AUC4로 유지한다.

## Planning gate

```yaml
planning_gate:
  artifact_contract: product
  output: "engine + local bridge + MCP adapter + live canvas client + phase/evidence"
  hierarchy_scale: "milestone; five observable step leaves"
  predecessor_gate: "AUC2 complete and ledger-confirmed"
  security_lane: "loopback/token/path/revision/atomicity gates in every mutating step"
  qa_lane: "repeatable protocol E2E plus actual Codex/Claude discovery smoke"
  skeptic_lane: "do not equate deterministic clients with live agent quality"
  delegation: "skip; current runtime forbids subagents without explicit user request"
  manual_pass: "plan rewritten against the confirmed terminal-to-canvas flow"
  run_boundary: "No AUC3 implementation before explicit user approval of this revised plan."
```
