# Canvas Engine Benchmark Contract

Date: 2026-07-10
Milestone: AUC0 Step 1

## Scope

- One deterministic canonical fixture generator for 1k/5k/10k UI nodes.
- Four renderer candidates consume the same IDs, bounds, tokens, labels, hierarchy hints, and selected node.
- One trace measures initial render, 90-frame pan/zoom, 90-frame selection mutation, serialization, semantic/editable coverage, IME composition, memory, support/failure state.
- The workspace exposes `window.__canvasBenchmark.run(candidate, size)` for real-browser automation.

## Verification checklist

- [x] `npm install`
- [x] `npm run build`
- [x] all four candidates mount at 1k nodes
- [x] fixture self-check reports no duplicate/missing/invalid node
- [x] unsupported WebGPU is an explicit result, not a silent fallback claim
- [x] result JSON validates against the shared required fields
- [x] representative Chrome screenshot and console check

Verification: `npm run build`, `npm run benchmark`, `npm run validate:results`, and `npm run compare:screenshots` all passed on 2026-07-10. Actual Chrome confirmed both WebGPU candidates supported, validation-clean, and visibly rendered.

## Failure contract

- A missing WebGPU adapter sets `supported=false` and records the error.
- Loss of stable IDs or token bindings makes `roundTripStable=false`.
- Absence of a Korean IME-capable input makes `imeCompositionPreserved=false`.
- Candidate-specific traces or scene simplification are prohibited unless disclosed in the final comparison.
