# Step 6: Packaged E2E And Representative Quality Proof

## 읽어야 할 파일
- AUC0/AUC2/AUC3 results — performance, manipulation, live-sync baselines.
- `phases/agent-design-desktop-productization/step1.md`~`step5.md` — 모든 security/recovery gate.
- Squirrel install/uninstall lifecycle docs — clean Windows proof.
- `docs/horizons/2026-07-agent-native-ui-canvas.md` — horizon close criteria.

## 작업
- unpacked/installed app에서 fresh React trust→canvas edit→dual adapter→watcher→verify를 실행한다.
- bridge/renderer crash, autosave restore, corrupt snapshot, WebGPU fallback, offline restart를 검증한다.
- clean Windows Sandbox 또는 clean user에서 install/launch/uninstall과 process/artifact cleanup을 확인한다.
- actual Microsoft IME, keyboard/a11y, 5k/AUC3 latency, screenshot/source/document drift evidence를 남긴다.

## Acceptance Criteria
```powershell
cd apps/agent-design-desktop; npm run test:packaged-e2e; npm run verify:packaged-evidence
```

## 금지사항
- dev Electron/Vite 결과를 packaged proof로 대체하지 마라.
- synthetic IME, installer 생성, screenshot만으로 actual IME/install/drift gate를 통과 처리하지 마라.
