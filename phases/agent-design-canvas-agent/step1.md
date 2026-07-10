# Step 1: Local Bridge And Session Protocol

## 읽어야 할 파일
- `docs/ARCHITECTURE.md` — 왜: browser renderer와 Node authority 경계를 지킨다.
- `docs/adr/0007-terminal-agent-live-canvas-bridge.md` — 왜: terminal agent, bridge, MCP ownership 결정을 구현 계약으로 사용한다.
- `packages/canvas-core/src/types.ts` — 왜: canonical document와 stable IDs를 재사용한다.
- `packages/canvas-core/src/operations.ts` — 왜: bridge mutation도 기존 operation/history 불변식을 우회하지 않는다.
- `packages/cli/src/load.ts` — 왜: 기존 React source loading/source mapping과 중복 구현하지 않는다.

## 작업
- `packages/agent-design-engine`에 context projection, transaction envelope, revision/hash validation, exact diff, verify codec를 pure TypeScript로 만든다.
- `apps/agent-design-bridge`에 `127.0.0.1` 전용 HTTP/WebSocket daemon과 ephemeral project/session token bootstrap을 만든다.
- snapshot, monotonic revision, event cursor, actor(`codex|claude|human|watcher`), transaction ID, structured conflict/error schema를 고정한다.
- reconnect 시 cursor replay가 가능하도록 bounded event log를 두고 gap이면 full snapshot을 반환한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test; npm run build
cd ../../apps/agent-design-bridge; npm test; npm run build
```

## 검증 절차
1. valid token/client가 context snapshot과 current revision을 읽는다.
2. missing/wrong token, non-loopback access, root 밖 path, stale revision을 거부한다.
3. disconnect 후 last cursor로 재접속해 누락 event만 받으며 gap은 snapshot으로 복구한다.
4. bridge integration fixture에서 operation apply와 source load가 같은 revision을 보고하는지 확인한다.

## 금지사항
- `0.0.0.0` 또는 public interface에 bind하지 마라.
- browser app에 filesystem/daemon authority를 넣지 마라.
- token, project root, base revision 없는 mutation endpoint를 만들지 마라.
