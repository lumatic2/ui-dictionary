# Step 5: Integrated 5k Quality Proof

## 읽어야 할 파일
- `phases/agent-design-direct-manipulation/index.json` — 왜: Step 1-4 완료 summary와 검증 경로를 이어받는다.
- `apps/agent-design/scripts/run-integration.mjs` — 왜: AUC1 system-Chrome benchmark/persistence evidence를 확장한다.
- `docs/plans/2026-07-10-auc2-direct-manipulation-property-runtime.md` — 왜: 5k latency, fallback, a11y, reload 최종 DoD를 닫는다.

## 작업
- 5k select→move→resize→reparent→property→text→undo/redo→save/reload 통합 trace를 만든다.
- pointer-to-visible p95 3회, keyboard focus, forced fallback, screenshot/reload drift를 증거로 저장한다.
- 실제 Chrome에서 주요 pointer/keyboard/text 흐름을 확인한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build; npm run integration
```

## 금지사항
- 단일 빠른 run만으로 60fps budget을 닫지 마라. 5k p95를 세 번 기록한다.
- synthetic IME 결과를 OS-level Microsoft IME 수동 검증으로 과장하지 마라.
