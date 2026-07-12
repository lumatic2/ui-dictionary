# Canvas viewport preset — MS Step 4

Target: milestone MS (`docs/plans/2026-07-12-ms-mobile-surface-batch.md`, Step 4).

## Scope

Added a viewport preset control (`Mobile 390×844` / `Tablet 768×1024` / `Desktop`) to the Agent Design canvas workspace toolbar in `apps/agent-design/src/App.tsx`, so a new mobile recipe can be opened at a mobile-sized canvas root from the same workspace. Applies only to `apps/agent-design/src/App.tsx` and its test file; no other app or package files were touched.

## Contract

- **No renderer direct mutation.** The preset dispatches through the existing `commit` callback (the same function every other toolbar control — zoom, undo, arrangement — already uses), which routes to `commitOperation`/the desktop bridge/the live bridge exactly like every other document change in the app. Nothing writes to `CanvasSurface` or DOM state directly.
- **No canvas-core schema change.** `packages/canvas-core` was not touched. The canonical document (`CanvasDocument`) has no single "artboard size" field — the closest existing concept is `document.rootIds[0]`, the canvas root frame, which already carries `bounds.width`/`bounds.height` like any other node (confirmed against `packages/canvas-core/src/types.ts` and the "canvas root" language already used in `InsertPalette.tsx`). Selecting a preset dispatches the existing `update-node` operation (`packages/canvas-core/src/operations.ts`) with `patch.bounds` set to the preset's width/height, keeping the root's existing `x`/`y` — the identical operation shape `PropertyInspector.tsx`'s Name field and the built-in `demoOperations()` fixture already use for `update-node` bounds patches. `update-node` is already invertible (`invertOperation` in `operations.ts`), so the preset change lands in `history` and is undoable with the existing Undo button/`Ctrl+Z`-equivalent flow — no parallel undo/state store was built.
- **Viewport pan/zoom vs. size are distinct.** `document.viewport` (`{ pan, zoom }`) is the existing editor-camera state and was left untouched; the preset changes the root frame's *dimensions*, not the camera. This was a deliberate reading of the plan's "Desktop 기존값" note: "Desktop" is the default selector state and performs no operation (no canonical "desktop size" exists to restore to) — switching back off a mobile/tablet preset relies on the app's existing Undo, matching how every other reversible action in this app already works, rather than inventing a snapshot/restore mechanism.
- Local `viewportPreset` React state (`'desktop' | 'mobile' | 'tablet'`) is UI-only label state for the `<select>`'s current value — it duplicates no document data (compare to existing UI-only state in the same file: `insertOpen`, `agentsOpen`, `shortcutsOpen`).

## Verification

- `cd apps/agent-design && npm test -- --run`:
  - Before: 10 files / **69 tests** passed (captured via `git stash` to run the pre-change tree, then `git stash pop`).
  - After: 10 files / **70 tests** passed (added 1 test: `applies a viewport preset to the canvas root through the canonical update-node operation, undoably`, plus extended the existing toolbar-grouping test to assert the new `Viewport` `role="group"`). No regressions.
- `cd apps/agent-design && npm run build` → exit 0 (`tsc -b && vite build`, `dist/` emitted cleanly).

## Result

Added a `Viewport` toolbar group (`data-testid="viewport-preset"`) next to the existing `Zoom` group in `apps/agent-design/src/App.tsx`, backed by an `applyViewportPreset` callback that dispatches `update-node` against `history.present.rootIds[0]`. Test and build both green; no `git commit`/`push` performed.

## 오케스트레이터 게이트 + 실브라우저 E2E (2026-07-12)

- 독립 재실행: `npm test -- --run` 10 files / 70 tests PASS, `npm run build` exit 0.
- 실브라우저 E2E (Playwright MCP, `npm run dev` @ 127.0.0.1:5173): Viewport preset combobox 렌더 확인 → `Mobile 390×844` 선택 → 라이브 캔버스의 루트 프레임(`data-canvas-id=node-00000`, `node-frame`)이 정확히 390×844로 적용되고 selection overlay가 추종함을 DOM 측정으로 관측. 스크린샷: `docs/research/assets/ms-step4-mobile-viewport-e2e.png`.
