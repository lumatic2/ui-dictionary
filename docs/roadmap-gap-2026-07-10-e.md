# Roadmap Gap Review

Date: 2026-07-10

## North Star
Goal: 디자인 시스템의 콘텐츠를 채운다 — Principles 증류(사람용 Docs+에이전트용 llms.txt) + 레시피 5→pattern_group 10종 커버리지. Details: `docs/horizons/2026-07-system-content-depth.md`. 직전 close: `docs/horizons/2026-07-agent-design-cli.md`. 조정 시퀀스: Content Depth → 앱 → Docs.

## Current State
- SCD1: SCD1 - Principles 증류 (사람용 + 에이전트용) (evidence: changesets/20260710-principles-gate-open/README.md)
- SCD2: SCD2 - 레시피 커버리지 배치 (pattern_group 10종) (evidence: changesets/20260710-recipes-integration/README.md)

## Gap
- System Content Depth close criteria are fully satisfied; there is no remaining milestone inside this horizon.
- The agreed sequence points next to an app built on top of the now-populated content, but its product identity and OS-level capability are user-owned decisions.

## Proposed Next Horizon
- Candidate: Agent Design desktop app / local GUI over the CLI and content registry.
- Required planning gate: define the OS-level capability that justifies an app instead of a web/CLI wrapper.
- After that decision, author the new horizon and milestone DoD through §B0.5.

## Recommendation
Stop implementation at the horizon boundary and discuss the app identity before writing the next active horizon.
