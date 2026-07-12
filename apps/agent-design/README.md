# AskewlyDesign

The AUC1 proof surface for the code-native AskewlyDesign canvas.

## Architecture

- `@askewly/canvas-core`: renderer-independent document, operations, history, snapshots.
- Semantic DOM: production component/text/input/focus surface.
- WebGPU editor plane: selection and guides, with mandatory DOM fallback.
- Browser store: AUC1 local persistence adapter; Electron filesystem authority is deferred.

## Commands

```powershell
npm install
npm run build
npm test
npm run integration
npm run validate:integration
```

`integration` uses system Chrome to verify the 5k interaction budget and the full apply → save → reload → undo/redo flow. Evidence is written under `results/`.
