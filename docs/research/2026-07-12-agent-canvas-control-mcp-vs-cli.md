# Agent Canvas Control — MCP vs CLI vs Hybrid (UX3 결정 재료)

Date: 2026-07-12
Status: research record — UX3 planning input, 사용자 결정 대기
Method: sonnet 백그라운드 에이전트 위임 (in-repo 코드 판독 + 웹 리서치), Fable 게이트 검토 후 기록

## 질문

Agent Design 캔버스를 Claude Code / Codex CLI가 즉석 통제할 때 주 채널을 MCP로 할 것인가, CLI로 할 것인가.

## 1. 레포가 이미 가진 것

- `packages/agent-design-mcp/src/server.ts` — `BridgeClient`를 `McpServer`(@modelcontextprotocol/sdk)로 감싸 5개 tool 노출: `get_context`, `apply_operations`, `apply_source_patch`, `verify`, `undo`. 모든 mutating call에 `baseRevision`/`beforeHash` optimistic-concurrency guard 필수.
- `packages/agent-design-mcp/src/cli.ts` — **stdio** transport로 부팅. `AGENT_DESIGN_BRIDGE_URL`, `AGENT_DESIGN_SESSION_TOKEN`, `AGENT_DESIGN_ACTOR=codex|claude` env로 actor-scoped 세션.
- MCP 서버는 상태를 갖지 않고 bridge WebSocket `/events` 스트림을 **구독하지 않는다** — 동기 request/response 어댑터일 뿐 live 채널이 아니다.
- 정본 transport는 `apps/agent-design-bridge/src/server.ts`·`session.ts`: HTTP(`/snapshot`,`/context`,`/transactions`,`/verify`,`/undo`,`/source-patches`,`/audit`) + `/events` WS(cursor 기반 replay/push), loopback-only + bearer token, 전체 transaction audit, hash/revision guard.

## 2. 비교

| 축 | MCP (stdio, 현행) | CLI (bridge HTTP/WS 직결) | 하이브리드 |
|---|---|---|---|
| Latency/streaming | stdio 동기 왕복, `/events` 미구독 → live push 없음. 2026 공개 벤치마크에서 stdio는 동시 부하에 취약 | `/events` 상시 구독 + 고빈도 op 배치 가능 | MCP를 `/events` 구독으로 확장하지 않으면 MCP와 동일 한계 |
| Selection-context binding | `get_context` 폴링 — 변경 push 없음 | 데몬이 selection 변경에 실시간 반응 | 데몬이 live 구독 소유, MCP tool은 캐시 읽기 |
| Auth/보안 경계 | bridge에 전부 위임 (loopback + bearer) | 동일 bridge auth 재사용, hop 하나 감소 | 동일 — MCP는 새 경계를 추가하지 않음 |
| Claude Code 지원 | 네이티브 1급 MCP 클라이언트 | 셸 호출 — 비관용적, 스키마 없음 | MCP가 Claude 대면 표면 |
| Codex 지원 | `actor=codex` 배선됨, MCP 클라이언트 성숙도는 Claude보다 낮음 | shell-first 설계상 CLI가 더 자연스러움 | Codex는 동일 `BridgeClient` 기반 CLI로 폴백 가능 |
| 구현 비용 | 이미 구현·테스트됨 (`contract.test.ts`) | `BridgeClient` 재사용 CLI 엔트리 — 중간 | 최저 증분 — CLI 래퍼 + (선택) WS 구독 데몬만 추가 |

## 3. 권고 (에이전트 산출, 미확정)

**하이브리드**: MCP를 기본 에이전트 대면 표면으로 유지(Claude Code 네이티브, 이미 구현·테스트 완료)하되, 고빈도/배치 작업은 stdio로 라우팅하지 말고 `BridgeClient`를 재사용하는 얇은 CLI를 추가한다. 선택적으로 MCP 서버가 내부에서 `/events`를 구독해 `get_context`가 폴링 없이 live selection을 반영하게 한다. bridge가 transport와 client 계약을 이미 분리해 두었으므로 둘 다 같은 revisioned·hash-guarded 세션의 프론트엔드일 뿐 — 하나만 고를 구조적 이유가 없다.

## 4. 출처

- https://www.grizzlypeaksoftware.com/library/mcp-transport-options-stdio-vs-sse-vs-websocket-decbjfzs
- https://www.truefoundry.com/blog/mcp-stdio-vs-streamable-http-enterprise
- https://chatforest.com/guides/mcp-real-time-streaming/
- https://apigene.ai/blog/mcp-sse-vs-stdio
- https://stacklok.com/blog/mcp-server-performance-transport-protocol-matters/
- https://www.stainless.com/mcp/mcp-streaming-messages-performance-transport/
- https://www.onlook.com/
- https://www.builder.io/blog/mcp-client-for-design-handoffs
- https://www.builder.io/blog/mcp-apps

관련 레포 파일: `packages/agent-design-mcp/src/{server,cli,bridgeClient}.ts`, `apps/agent-design-bridge/src/{server,session}.ts`, 선행 연구 `docs/research/figma-capability-map-2026-07.md`
