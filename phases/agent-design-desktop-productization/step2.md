# Step 2: Supervised Bridge Lifecycle And Terminal Bootstrap

## 읽어야 할 파일
- `apps/agent-design-bridge/src/server.ts` — 기존 bridge authority를 재사용한다.
- `packages/agent-design-mcp/src/cli.ts` — terminal adapter 환경 계약.
- `docs/adr/0007-terminal-agent-live-canvas-bridge.md` — app은 agents를 spawn하지 않는다.
- Electron `utilityProcess` API — message/exit/error lifecycle.

## 작업
- main-owned supervisor가 bridge ESM entry를 `utilityProcess.fork`로 실행한다.
- message channel로 project ID, token, port, cursor, health를 handshake한다.
- crash backoff, 3회/60초 circuit breaker, graceful shutdown, orphan cleanup을 구현한다.
- canvas에는 redacted connection state를, 사용자에게는 copyable session-scoped Codex/Claude 명령을 제공한다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm run test:supervisor; npm run test:terminal-bootstrap
```

## 금지사항
- Electron main에 canvas transaction logic을 복제하지 마라.
- Codex/Claude를 자동 spawn하거나 global CLI config/token file을 만들지 마라.
