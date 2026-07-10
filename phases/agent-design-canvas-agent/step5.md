# Step 5: Dual-CLI Fresh React Roundtrip Proof

## 읽어야 할 파일
- `docs/PRD.md` — 왜: 사용자 terminal→별도 canvas 즉시 반영 흐름을 최종 기준으로 삼는다.
- `docs/adr/0007-terminal-agent-live-canvas-bridge.md` — 왜: AUC3와 AUC4의 책임 경계를 지킨다.
- `phases/agent-design-canvas-agent/step1.md`~`step4.md` — 왜: protocol, trust, atomicity, latency gates를 누락하지 않는다.
- existing React fixture/export verification docs — 왜: fresh project와 source/document/browser drift를 동일 방식으로 비교한다.

## 작업
- fresh React fixture를 만들고 bridge, canvas, Codex-labeled client, Claude-labeled client를 repo-scoped session으로 연결한다.
- create layout→style/prop edit→direct canvas edit→second agent edit→Undo→save/reload의 양방향 시나리오를 실행한다.
- simultaneous write conflict, bridge crash/restart, canvas reconnect, malformed tool call, source verify failure recovery를 검증한다.
- installed Codex/Claude에서 실제 tool discovery/connection smoke를 실행하고 repeatable protocol E2E와 구분해 기록한다.

## Acceptance Criteria
```powershell
npm test
npm run build
npm run test:agent-design-roundtrip
npm run verify:agent-design-roundtrip
```

## 검증 절차
1. 두 actor의 committed edits가 source, canonical document, canvas DOM에서 같은 stable IDs/props/text를 가진다.
2. conflict/restart/reconnect/rollback 뒤 revision, event log, history, source hash가 수렴한다.
3. acknowledgement→canvas p95 ≤100ms와 file edit→canvas p95 ≤300ms 결과 JSON을 남긴다.
4. 실제 Codex/Claude tool discovery smoke와 fresh-flow screenshot을 phase evidence에 남긴다.
5. deterministic clients만 성공한 경우 live model roundtrip을 통과한 것으로 주장하지 않는다.

## 금지사항
- mock client 결과를 실제 Codex/Claude design quality 증거로 표현하지 마라.
- global CLI config 변경, agent process spawning, desktop packaging을 AUC3 완료 조건에 섞지 마라.
- screenshot만으로 source/document/revision drift gate를 대체하지 마라.
