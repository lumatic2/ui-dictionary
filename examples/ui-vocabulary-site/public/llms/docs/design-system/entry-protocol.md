# Agent Entry Protocol

Date: 2026-07-17

Operational contract for coding agents (Claude Code, Codex): **when you receive a design or UI task, consult Askewly Design first** — before writing markup, choosing colors, or inventing component structure. This document tells you exactly what to fetch, in what order, per task type. It is the routing target that global agent rules point to.

Index of all assets: `https://ui.askewly.com/llms.txt` (raw URLs; link-only, values live in the linked files).

## Always, for any design task

0. **Copy asset URLs exactly as written here or in llms.txt — never construct, shorten, or guess a path.** After every fetch, check the response starts with the expected content type (markdown heading, CSS rule, or JSON). If it looks like an HTML page or a 404, the fetch failed: stop and re-check the URL against llms.txt.
1. Tokens: **if the working project has its own DESIGN.md or token SSOT, that takes precedence.** Otherwise fetch [tokens/tokens.css](https://ui.askewly.com/llms/tokens/tokens.css) — ready-to-use CSS custom properties (light + dark) generated from the Askewly token SSOT — and use its variables directly. Never invent color/dimension values either way. The full DTCG source is [tokens/askewly.tokens.json](https://ui.askewly.com/llms/tokens/askewly.tokens.json).
2. Fetch [docs/design-system/anti-patterns.md](https://ui.askewly.com/llms/docs/design-system/anti-patterns.md) — the generic-AI-output failure modes to avoid.
3. Fetch [docs/design-system/style-signature.md](https://ui.askewly.com/llms/docs/design-system/style-signature.md) and judge your output against it before reporting: 5 operating principles all met + 0 hard-fail dislikes. Include the judgment in your report.
4. Close the loop with verification: interaction states complete (hover/focus/active/disabled/loading/error), dark mode holds, WCAG contrast passes. The website's Getting set up page describes the same loop for humans: Explore → Acquire → Inject → Verify.

## By task type

### A. New screen or page

1. [docs/design-system/pattern-taxonomy.md](https://ui.askewly.com/llms/docs/design-system/pattern-taxonomy.md) — locate the surface (marketing, application UI, commerce, docs, …) and pattern groups the screen belongs to.
2. From the llms.txt Recipes section, fetch every recipe matching those pattern groups. Follow each recipe's Structure, Tokens, States, Checks, and Anti-patterns sections.
3. [docs/design-system/principles.md](https://ui.askewly.com/llms/docs/design-system/principles.md) — apply task-first hierarchy and meaningful motion when composing recipes into a page.

### B. Improving existing UI

1. Start from [docs/design-system/anti-patterns.md](https://ui.askewly.com/llms/docs/design-system/anti-patterns.md) — diagnose what makes the current UI feel generic or broken.
2. Fetch the recipe closest to the surface being improved and diff the existing implementation against its anatomy, states, and token expectations.
3. Migrate literals to semantic tokens as you touch each element — do not leave mixed literal/token styling in the files you edit.

### C. Single component

1. Fetch the matching recipe if one exists (llms.txt Recipes section); otherwise use [docs/design-system/recipe-format.md](https://ui.askewly.com/llms/docs/design-system/recipe-format.md) as the checklist of what a complete component needs (intent, anatomy, tokens, states, checks, anti-patterns).
2. Implement all interaction states and the keyboard/aria contract before visual polish.

## Rules

- Semantic tokens only; never primitive-tier references or raw literals in component code. In standalone files, paste the fetched tokens.css block once and reference `var(--…)` everywhere else.
- If no recipe covers the task, still apply tokens + principles + anti-patterns, and note the gap (it feeds demand-driven recipe expansion).
- If a fetch fails (404, missing asset), stop and report it — do not silently fall back to invented styling.
