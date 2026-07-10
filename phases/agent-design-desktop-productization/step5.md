# Step 5: Windows Packaging, Fuses, Installer, And Release Boundary

## 읽어야 할 파일
- Electron Forge configuration/Squirrel maker docs — official packaging contract.
- Electron security/fuses docs — packaged runtime reduction.
- `apps/agent-design-desktop` build outputs — main/preload/renderer/bridge resource inventory.
- `docs/adr/0008-electron-desktop-host-and-supervised-bridge.md` — unsigned/update boundary.

## 작업
- independent Vite renderer + main/preload builds를 Forge packager에 조립한다.
- RunAsNode/inspect/asar 관련 production fuses와 security inspection을 적용한다.
- Windows metadata/icon, x64 unpacked app, Squirrel installer, hashes, SBOM을 생성한다.
- signing input이 없으면 unsigned-development로 명시하고 updater/publish를 disabled 상태로 검증한다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm run make:win; npm run verify:package
```

## 금지사항
- dev server URL, source map, session token, certificate password를 artifact에 포함하지 마라.
- unsigned artifact를 release-ready라고 표시하거나 자동 update/publish를 켜지 마라.
