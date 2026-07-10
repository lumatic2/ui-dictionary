# Step 4: Sandboxed Preview, OS Actions, And Redacted Diagnostics

## 읽어야 할 파일
- Electron security checklist — preview/navigation/permission/openExternal rules.
- `apps/agent-design/src/CanvasSurface.tsx` — editor DOM과 project preview 경계.
- `docs/ARCHITECTURE.md` — isolated code runtime 요구.
- trusted project registry from Step 3 — path authority 정본.

## 작업
- ephemeral partition의 sandboxed `WebContentsView` project preview를 만든다.
- custom preview protocol과 CSP로 allowlisted local resources만 제공하고 network/permission/navigation/window를 거부한다.
- Explorer/editor action은 main-owned project/file ID만 받는 typed IPC로 제한한다.
- version/crash/security/benchmark/hash만 담는 redacted diagnostic bundle을 만든다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm run test:preview-sandbox; npm run test:diagnostics
```

## 금지사항
- `<webview>`에 preload/Node/popups를 허용하거나 arbitrary URL/shell protocol을 열지 마라.
- diagnostics에 token, source body, username, unredacted absolute path를 포함하지 마라.
