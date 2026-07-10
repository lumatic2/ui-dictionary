# AUC1 Canonical Document Contract

Date: 2026-07-10
Milestone: AUC1 Step 1

## Contract

- Renderer-independent versioned document and typed node union.
- Stable hierarchy, component/instance references, source mappings, responsive sizing, typed props, variants, and token bindings.
- Deterministic 1k/5k representative fixtures.
- Explicit happy/failure validation for schema, hierarchy, source, and instance integrity.

## Verification

- [x] `npm install`
- [x] `npm run build`
- [x] `npm test` (6/6)
- [x] 1k/5k fixtures validate
- [x] broken hierarchy, dangling instance, invalid source, unknown schema fail
