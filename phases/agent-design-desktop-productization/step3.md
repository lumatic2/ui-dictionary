# Step 3: Trusted Project Import And Durable Recovery

## 읽어야 할 파일
- `apps/agent-design-bridge/src/session.ts` — revision/audit/allowlist contract.
- `packages/canvas-core/src/persistence.ts` — snapshot version/checksum contract.
- Electron `dialog`, `app.getPath('userData')` docs — native trust/persistence surfaces.
- `docs/adr/0008-electron-desktop-host-and-supervised-bridge.md` — app-data ownership decision.

## 작업
- native directory picker와 canonical realpath 기반 trusted project registry를 구현한다.
- source access마다 junction/symlink 포함 containment를 재검증한다.
- userData project hash 아래 atomic snapshot, audit JSONL, recent metadata, autosave를 저장한다.
- corrupt/incomplete writes를 quarantine하고 last-known-good snapshot으로 read-only recovery한다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm run test:project-trust; npm run test:recovery
```

## 금지사항
- renderer가 전달한 absolute path를 그대로 읽거나 쓰지 마라.
- corrupt snapshot으로 last-known-good를 덮어쓰거나 recovery 중 mutation을 허용하지 마라.
