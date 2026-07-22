# PRD - Askewly Design

## Problem

AI-assisted UI work often produces generic screens: weak hierarchy, default-looking colors, inconsistent spacing, shallow interaction states, and visual patterns that feel assembled rather than designed. Designers can solve this with Figma systems and taste, but Codex and Claude Code need a durable design system they can read and apply directly.

The original UI vocabulary problem still matters: people need names, examples, and prompt language for UI parts. But the broader product goal is to turn those examples into a reusable design system for digital products.

## Product Goal

Build Askewly Design as:

- a public website for browsing UI patterns, product surfaces, color, typography, layout, motion, and examples;
- a paid asset surface where users can copy richer code and download reusable assets;
- an agent-facing system that Codex and Claude Code can use to implement polished product UI;
- a local CLI (`@askewly/design`) that lets agents and developers query, inject, and verify the design system inside their own projects (ADR 0004; the CLI core later powers a desktop app).

## Scope

The system covers digital product UI broadly:

- websites and landing pages;
- mobile apps;
- SaaS products and dashboards;
- commerce flows;
- documentation sites;
- marketing pages;
- internal tools and application UI;
- reusable components, states, interactions, and visual tokens.

## Target Users

- Askewly, as a designer-builder brand that wants durable proof of a reusable design system.
- Developers and operators using AI coding agents to build interfaces.
- Vibe-coding users who need better UI vocabulary, examples, and prompts.
- Product teams or solo builders who want reusable UI examples and code assets.

## Core Experiences

### Browse And Compare

Users can browse product surfaces, UI patterns, components, examples, typography, colors, layout systems, and interaction states with visual evidence.

### Learn The Language

Each pattern explains what it is, where it works, where it fails, related patterns, and how to ask an AI agent to implement it.

### Copy And Reuse

Free users can inspect examples and learn from them. Paid users eventually get broader code copy, asset download, and implementation packs.

### Agent Guidance

Codex and Claude Code can consume the same system as tokens, recipes, prompts, constraints, and anti-patterns.

### Create On A Code-Native Canvas

Agent Design is the desktop authoring surface. Users compose real React UI in frames, select and directly manipulate elements, bind tokens and typed properties, and explore variants side by side. Codex CLI and Claude CLI remain in user-owned terminal windows and connect to the running canvas through a project-scoped local bridge/MCP adapter. When the user asks either terminal agent to design or revise UI, trusted tool calls atomically update canonical document and React code, and the separate canvas window redraws immediately. Exact diffs, verification results, history, and Undo remain visible without inserting a per-change approval click into the live design loop. Direct source edits made by the terminal agent are reconciled back through a file watcher.

## MVP Direction

The current static React site remains the first product surface. Tailwind/Tailwind Plus parity work is retained as reference-backed implementation evidence, but future work must label what is reference, what is adapted, and what belongs to Askewly Design.

Near-term MVP work should prioritize:

- Objective, ROADMAP, PRD, and Architecture alignment;
- reference strategy for Tailwind, Tailwind Labs, mobile guidelines, SaaS products, and local design-manual assets;
- surface taxonomy beyond web-only categories;
- an agent-usable asset model for tokens, patterns, examples, and code.
- the accepted ADR 0006 canvas topology: semantic DOM content, WebGPU editor plane with DOM fallback, SVG vector islands, and threshold-triggered native/Wasm hot paths;
- a canonical canvas document model that remains independent from its renderer and maps deterministically to code.

The public website structure is defined in `docs/design-system/site-blueprint.md`. That blueprint is the source of truth for the first landing page, top-level navigation, site map, page types, public/internal content boundaries, implementation order, and first vertical slice.

## Non-Goals

- Do not implement payments before the asset model and licensing boundaries are clear.
- Do not make the system web-only.
- Do not blindly copy Tailwind, Apple, Material, or SaaS product identities.
- Do not replace the human-facing website with only machine-readable docs.
- Do not import other local design repositories until a reference/integration strategy exists.
- Do not turn the first AskewlyDesign horizon into a general vector illustration suite, multiplayer cloud editor, or general-purpose chat product.
- Do not lower the quality bar to a screenshot preview with decorative selection handles; direct manipulation must mutate canonical structure and round-trip to working UI code.

## Success Criteria

- The website shows a broad, coherent design system rather than only a term catalog.
- A user can understand differences between product surfaces such as mobile app, SaaS dashboard, commerce flow, documentation, and marketing page.
- Each major example has visual evidence and usable implementation guidance.
- Codex and Claude Code can use the system to produce UI with better hierarchy, spacing, typography, color, interaction states, and reduced AI-generic feel.
- Future paid features have a clear path: copyable code, downloadable assets, and reusable implementation packs.
- A representative AskewlyDesign project can compose, directly edit, agent-revise, diff, apply, and verify a responsive React UI without canvas/browser drift.

## 포지셔닝 (2026-07-12 사용자 제안 · 2026-07-22 OBJECTIVE.md 에서 이관, 문구 원문 그대로)

Claude와 Codex는 이미 "시니어 개발자"다. Askewly Design은 그 시니어 개발자들이 **시니어 디자이너처럼 일하게** 만든다 — 토큰 SSOT, recipe, 프로토콜, 안티패턴 가이드는 전부 코딩 능력이 아니라 디자인 판단력을 주입하는 장치다. 사람용 레퍼런스 사이트(보는 눈)와 에이전트 시스템(판단 주입)은 이 한 문장의 양날개다. 대외 카피는 채용 대체 뉘앙스를 피해 "에이전트가 디자인 감각을 갖게 된다" 계열로 다듬는다 (예: "Your coding agent already writes senior-level code. Askewly Design makes it design like one, too.").

## AskewlyDesign 앱 (2026-07-22 OBJECTIVE.md 에서 이관, 문구 원문 그대로)

Figma, Adobe 제품군이 맡던 자리를 맡는다 — 디자이너가 매일 여는 창. 다만 캔버스의 정본이 벡터 파일이 아니라 코드이고, 옆에 에이전트가 앉아 있다. 사람은 실제 컴포넌트를 배치·선택·이동·변형하고, 에이전트는 같은 정본 document를 편집한다. 결과물은 export가 아니라 production code로 무손실 왕복한다.

한 벌의 앱이 매체를 가로지른다: 제품 UI 화면, 슬라이드, 지면 산출물이 같은 토큰 SSOT와 같은 편집 표면을 공유한다. 도구를 갈아타는 순간이 사라지는 것이 이 앱의 존재 이유다.
