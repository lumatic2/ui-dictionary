# Roadmap Gap Review

Date: 2026-07-13

## North Star
Goal: 코드 네이티브 캔버스의 기술 proof를 실제 React UI를 보고 만들고 되돌릴 수 있는 Mac 우선 편집 제품으로 끌어올린다. Details: `docs/horizons/2026-07-askewlydesign-editor-quality.md`.

## Current State
- EQ0: EQ0 — Mac Reproducible Baseline (evidence: docs/research/eq0-mac-baseline/2026-07-13-fresh-clone.json)

## Gap
- EQ0 proves a reproducible Mac shell, but its 5,000-node pointer trace remains over budget at p95 418.9 ms.
- The current flat label renderer does not yet express real React hierarchy, content, clipping, or z-order.
- EQ1 needs a separately approved DoD and evidence path before implementation starts.

## Proposed Next Milestone
- EQ1 — Real React Rendering Contract.
- Define measurable hierarchy, clipping, z-order, source-link, and 5k interaction targets during planning.
- Preserve the EQ0 fresh-clone and production-entry gates while replacing the renderer incrementally.

## Recommendation
Promote EQ1 to an active harness milestone only after the user approves its detailed plan and acceptance evidence.
