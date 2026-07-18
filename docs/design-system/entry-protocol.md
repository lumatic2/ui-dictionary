# Agent Entry Protocol

Date: 2026-07-18 (human verification gate added — self-judgment is the floor, human eyes are the final gate)

Operational contract for coding agents (Claude Code, Codex): **Askewly Design injects design judgment, not a style.** When you receive a design or UI task, consult this system for *what good looks like* — pattern recipes, failure modes, and the quality bar — while the visual identity (palette, radius, type) stays owned by the project you are working in. Fetching this system must never make different projects converge on one look.

Index of all assets: `https://ui.askewly.com/llms.txt` (raw URLs; link-only, values live in the linked files).

## Always, for any design task

0. **Copy asset URLs exactly as written here or in llms.txt — never construct, shorten, or guess a path.** After every fetch, check the response starts with the expected content type (markdown heading, CSS rule, or JSON). If it looks like an HTML page or a 404, the fetch failed: stop and re-check the URL against llms.txt.
0.5. **Brief interview — before assuming, ask.** Fetch [docs/design-system/design-brief.md](https://ui.askewly.com/llms/docs/design-system/design-brief.md) and apply its scale gate: a new page/site/screen with no existing DESIGN.md gets the full 7-domain brief interview (tone, look ownership, color, type, structure, interaction level, content — each with options + a recommendation, never all open-ended); a small component fix skips it; a project that already has a DESIGN.md is never re-interviewed. Persist full-brief answers as the working project's own `DESIGN.md` — that file *is* the look ownership the next step derives from. In non-interactive environments proceed with recommended defaults and list them as assumptions in the report.
1. Tokens — **the working project's design system owns the look.** If the project has its own DESIGN.md, token SSOT, or established styling, derive every value from *that* and do not import Askewly colors, radii, or type. Fetch [tokens/tokens.css](https://ui.askewly.com/llms/tokens/tokens.css) only as a fallback when the project has no tokens at all, or when the user explicitly asks for Askewly Design. Never invent color/dimension values either way. The full DTCG source is [tokens/askewly.tokens.json](https://ui.askewly.com/llms/tokens/askewly.tokens.json).
2. Fetch [docs/design-system/anti-patterns.md](https://ui.askewly.com/llms/docs/design-system/anti-patterns.md) — the generic-AI-output failure modes to avoid.
3. **Self-judgment is a mandatory step, not a suggestion — no runtime hook will remind you; this document is the only place the obligation lives.** Fetch [docs/design-system/style-signature.md](https://ui.askewly.com/llms/docs/design-system/style-signature.md) and judge your finished output against it *before* reporting: all 5 operating principles met + 0 hard-fail dislikes. Include the per-principle judgment in your report; a report without it is incomplete. (Dogfooding DF-1/DF-2: workers skipped this step 2 out of 2 times — do not be the third.)
4. Close the loop with verification: interaction states complete (hover/focus/active/disabled/loading/error), dark mode holds, WCAG contrast passes. The website's Getting set up page describes the same loop for humans: Explore → Acquire → Inject → Verify.
5. **Human verification is the final gate — self-judgment (step 3) is only the floor, not the ceiling.** Capture screenshots of the finished result (light and dark at minimum, plus key interaction/empty/error states where relevant) and attach the file paths or images to your report. Then wait: do not declare the work complete, and do not deploy, until the user has looked at the screenshots and confirmed. "Passed the signature" and "actually looks good" are different claims — only human eyes settle the second one.

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

- **Judgment injection, not style injection.** Recipes, anti-patterns, and the signature apply to every project; Askewly tokens apply only to token-less projects or on explicit request. If you notice your output making an unrelated project look like askewly.com, that is a failure — re-derive from the project's own tokens.
- Semantic tokens only; never primitive-tier references or raw literals in component code. In standalone files, paste the fetched tokens.css block once and reference `var(--…)` everywhere else.
- If no recipe covers the task, still apply tokens + principles + anti-patterns, and note the gap (it feeds demand-driven recipe expansion).
- If a fetch fails (404, missing asset), stop and report it — do not silently fall back to invented styling.
