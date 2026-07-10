# Step 1: Secure Electron Host And Typed Authority Contract

## 읽어야 할 파일
- `docs/adr/0008-electron-desktop-host-and-supervised-bridge.md` — host/process/security 결정.
- `docs/ARCHITECTURE.md` — renderer와 desktop authority 경계.
- `apps/agent-design/package.json` — 기존 Vite renderer를 재사용한다.
- Electron security checklist — 현재 공식 BrowserWindow/IPC/fuse 기준.

## 작업
- `apps/agent-design-desktop` Electron main/preload package를 만든다.
- existing renderer build를 `app://` custom protocol로 로드한다.
- `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`, strict CSP를 고정한다.
- versioned preload API와 runtime schema를 만들고 IPC sender/project-session ID를 검증한다.
- navigation, new window, permissions, unsafe external protocols를 default deny한다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm test; npm run build; npm run verify:security
```

## 금지사항
- renderer에 `ipcRenderer`, filesystem, shell, process, raw path를 직접 노출하지 마라.
- `file://`, remote content, disabled `webSecurity`, unsandboxed renderer를 사용하지 마라.
