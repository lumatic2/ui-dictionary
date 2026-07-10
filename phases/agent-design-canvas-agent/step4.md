# Step 4: Shared Verification And CLI Parity

## 읽어야 할 파일
- `phases/agent-design-canvas-agent/index.json` — 왜: guarded apply contract를 이어받는다.
- `packages/cli/src/verify.ts` — 왜: 기존 Node directory walker와 pure rule을 분리한다.
- `packages/cli/test/verify.test.ts` — 왜: CLI behavior를 보존한다.
- `packages/agent-design-engine/src/` — 왜: app/CLI가 소비할 pure verification 경계다.

## 작업
- raw color/token verification의 pure text rule을 shared engine으로 이동한다.
- CLI `verifyDir`은 directory I/O만 소유하고 동일 pure result를 소비한다.
- proposal apply 전 changed source text를 동일 verifier로 검사하고 failure를 block한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test; npm run build
cd ../cli; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 금지사항
- CLI rule을 app에 복사하지 마라.
- browser bundle에 `node:fs` 또는 process authority를 넣지 마라.
