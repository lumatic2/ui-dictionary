# Canvas Engine Experiments

| # | Experiment | Date | Hypothesis | Progress | Decision impact |
|---|---|---|---|---|---|
| 1 | DOM/React + editor overlay | 2026-07-10 | Production DOM fidelity and native semantics outweigh high node-count cost | 4/4 | content baseline |
| 2 | DOM/React + WebGPU overlay | 2026-07-10 | GPU guides/selection improve editor interaction without duplicating UI rendering | 4/4 | editor hot-path option |
| 3 | SVG scenegraph + embedded DOM | 2026-07-10 | SVG improves geometry/zoom while foreignObject retains code-native inputs | 4/4 | vector islands only |
| 4 | Custom WebGPU mini-engine | 2026-07-10 | A GPU scene can scale furthest but will expose fidelity, text, and accessibility costs | 4/4 | native/Wasm seam evidence |
