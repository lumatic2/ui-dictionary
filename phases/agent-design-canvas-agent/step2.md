# Step 2: Codex And Claude Terminal MCP Adapters

## 읽어야 할 파일
- `docs/adr/0007-terminal-agent-live-canvas-bridge.md` — 왜: 두 CLI가 하나의 authority와 semantics를 공유해야 한다.
- `apps/agent-design-bridge` protocol/types — 왜: adapter가 transaction 규칙을 재구현하지 않고 forwarding한다.
- `packages/cli/src/index.ts` — 왜: 기존 CLI entrypoint convention과 충돌하지 않는다.
- `docs/PRD.md` — 왜: user-owned terminal flow와 즉시 반영 UX가 acceptance 기준이다.

## 작업
- `packages/agent-design-mcp`에 stdio MCP server를 만들고 bridge URL, token, project identity를 session 환경으로 받는다.
- `get_context`, `apply_operations`, `apply_source_patch`, `verify`, `undo` tools의 JSON schema와 structured response를 구현한다.
- Codex CLI와 Claude CLI 각각에 대해 repo/session-scoped 실행·연결 문서를 만들고 tool discovery smoke script를 둔다.
- 두 actor가 같은 adapter binary와 bridge transaction semantics를 쓰되 audit actor identity는 보존한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-mcp; npm test; npm run build
npm run test:mcp-contract
```

## 검증 절차
1. deterministic stdio client로 initialize→tools/list→get_context→apply→verify→undo를 검증한다.
2. Codex actor와 Claude actor가 동일 fixture/revision/error schema를 받는지 비교한다.
3. 설치된 Codex CLI와 Claude CLI에서 각각 adapter tool discovery와 bridge connection smoke를 실행한다.
4. CLI가 없거나 runtime 연결이 실패하면 contract E2E와 actual smoke blocker를 별도 기록한다.

## 금지사항
- Agent Design app 또는 bridge가 Codex/Claude 프로세스를 spawn하지 마라.
- 사용자 global CLI config를 자동 수정하지 마라.
- CLI별로 mutation 또는 conflict semantics를 fork하지 마라.
