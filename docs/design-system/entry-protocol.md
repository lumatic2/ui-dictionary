# Agent Entry Protocol

Date: 2026-07-18 (human verification gate added — self-judgment is the floor, human eyes are the final gate)

Operational contract for coding agents (Claude Code, Codex): **Askewly Design injects design judgment, not a style.** When you receive a design or UI task, consult this system for *what good looks like* — pattern recipes, failure modes, and the quality bar — while the visual identity (palette, radius, type) stays owned by the project you are working in. Fetching this system must never make different projects converge on one look.

Index of all assets: `https://ui.askewly.com/llms.txt` (raw URLs; link-only, values live in the linked files).

## Always, for any design task

0. **Copy asset URLs exactly as written here or in llms.txt — never construct, shorten, or guess a path.** After every fetch, check the response starts with the expected content type (markdown heading, CSS rule, or JSON). If it looks like an HTML page or a 404, the fetch failed: stop and re-check the URL against llms.txt.
0.5. **Brief interview — before assuming, ask.** Fetch [docs/design-system/design-brief.md](https://ui.askewly.com/llms/docs/design-system/design-brief.md) and apply its scale gate: a new page/site/screen with no existing DESIGN.md gets the full 7-domain brief interview (tone, look ownership, color, type, structure, interaction level, content — each with options + a recommendation, never all open-ended); a small component fix skips it; a project that already has a DESIGN.md is never re-interviewed. Persist full-brief answers as the working project's own `DESIGN.md` — that file *is* the look ownership the next step derives from. In non-interactive environments proceed with recommended defaults and list them as assumptions in the report.
1. Tokens — **the working project's design system owns the look.** If the project has its own DESIGN.md, token SSOT, or established styling, derive every value from *that* and do not import Askewly colors, radii, or type. Fetch [tokens/tokens.css](https://ui.askewly.com/llms/tokens/tokens.css) only as a fallback when the project has no tokens at all, or when the user explicitly asks for Askewly Design. Never invent color/dimension values either way. The full DTCG source is [tokens/askewly.tokens.json](https://ui.askewly.com/llms/tokens/askewly.tokens.json).
1.5. **Code assets before re-implementation.** Before writing any component from a recipe, check the llms.txt "Code Assets" section (or the recipe's own "Code asset" callout). If an asset exists for the pattern you are building, the code-first path (A-2.5 below) is the default — re-implementing from prose when an asset exists wastes verification and produces drift.
2. Fetch [docs/design-system/anti-patterns.md](https://ui.askewly.com/llms/docs/design-system/anti-patterns.md) — the generic-AI-output failure modes to avoid.
3. **Self-judgment is a mandatory step, not a suggestion — no runtime hook will remind you; this document is the only place the obligation lives.** Fetch [docs/design-system/style-signature.md](https://ui.askewly.com/llms/docs/design-system/style-signature.md) and judge your finished output against it *before* reporting: all 5 operating principles met + 0 hard-fail dislikes. Include the per-principle judgment in your report; a report without it is incomplete. (Dogfooding DF-1/DF-2: workers skipped this step 2 out of 2 times — do not be the third.)
4. Close the loop with verification: interaction states complete (hover/focus/active/disabled/loading/error), dark mode holds, WCAG contrast passes. The website's Getting set up page describes the same loop for humans: Explore → Acquire → Inject → Verify.
5. **Human verification is the final gate — self-judgment (step 3) is only the floor, not the ceiling.** The user judges the *live* result, not a screenshot: open the finished work in the user's default browser (`Start-Process <url>` on Windows, `open` on macOS) and, if it needs a local server, **keep that server running until the user has confirmed** — a killed server turns the page into an error the moment they look. Capture screenshots as well (light and dark at minimum, plus key interaction/empty/error states) and attach them to your report as the durable evidence record. Then wait: do not declare the work complete, and do not deploy, until the user has looked and confirmed. Clean up the server after confirmation or at session end. "Passed the signature" and "actually looks good" are different claims — only human eyes on the live page settle the second one.

## Before the task branches: name it, pick it, then find what to build it with

These three steps run **before** A/B/C below, in this order. They exist because a request usually names an outcome ("정보가 많은데 펼치고 접혔으면"), not a UI element — and the branches below all assume the element is already decided.

Skip a step only when it is genuinely moot, and say so in the report (`요소 결정: 해당 없음 — 요소 지정됨`).

### N-1. Name it — look the vocabulary up

Fetch [docs/design-system/vocabulary-lookup.md](https://ui.askewly.com/llms/docs/design-system/vocabulary-lookup.md) and follow it. The dictionary is 562 terms published as a lightweight index plus per-group shards; a lookup costs 2–3 fetches. **Never fetch the raw `terms.yml` — it is deliberately unpublished and a 404 there is expected.**

If the concept is genuinely not in the dictionary, **do not stop.** Follow one `related` hop, then proceed as an out-of-dictionary concept and note that in the report — where the dictionary fails to reach is the input to the next collection batch. A lookup miss is never a reason to abandon the work.

### N-2. Pick it — decide the element

If the request already names the element (`"이 버튼 색 고쳐"`), skip to N-3.

Otherwise fetch [docs/design-system/decisions/README.md](https://ui.askewly.com/llms/docs/design-system/decisions/README.md), find the cluster your candidates fall into, and fetch that cluster file. Then:

1. Answer the cluster's `axes` questions. **If you cannot answer an axis from what the user said, ask them that question verbatim — one line.** Guessing an axis silently is the failure this step exists to prevent.
2. Evaluate `rules` top to bottom; the first whose `when` fully matches wins. If none match, take `default`. **Rule order is itself the judgment** — axes that decide the surface come before axes that measure quantity.
3. If no cluster covers your candidates, decide from the terms' own `when_to_use`/`anti_use`/`related` and note the missing cluster in the report.

### N-3. Find what to build it with

Fetch [docs/ui-vocabulary/term-asset-map.json](https://ui.askewly.com/llms/docs/ui-vocabulary/term-asset-map.json) and look up the chosen term.

- `code_assets` non-empty → code-first path (A-2.5 below). Restyle is mandatory.
- `recipes` non-empty → follow that recipe.
- **both empty** (481 of 562 terms) → [docs/design-system/no-asset-fallback.md](https://ui.askewly.com/llms/docs/design-system/no-asset-fallback.md). The term entry itself is the material: `visual_anatomy` is the parts checklist, `anti_use` is the boundary, `related` is the neighbour diff. Missing assets are not a reason to draw from feel.

### Report contract — the `요소 결정` block

Every report for a task that passed through N-2 includes this block. A decision nobody can see is a decision nobody can challenge.

```
요소 결정: <picked term id> (군집: <cluster id>)
- 갈린 축: <axis id>=<value> → <why this answer>
- 기각: <alternative> — <why not>
- 자산: <code asset | recipe path | 폴백(no-asset-fallback)>
```

When the element was specified by the user, the block is `요소 결정: 해당 없음 — 요소 지정됨`. That is a valid value, not an omission.

## By task type

> All three branches assume N-1…N-3 already ran. If you arrive here with the element still undecided, go back — none of the branches below will decide it for you.

### A. New screen or page

1. [docs/design-system/pattern-taxonomy.md](https://ui.askewly.com/llms/docs/design-system/pattern-taxonomy.md) — locate the surface (marketing, application UI, commerce, docs, …) and pattern groups the screen belongs to.
2. From the llms.txt Recipes section, fetch every recipe matching those pattern groups. Follow each recipe's Structure, Tokens, States, Checks, and Anti-patterns sections.
2.5. **Code-first (RC2, 2026-07-19): when a matching entry exists in the llms.txt "Code Assets" section, start from the verified implementation instead of re-implementing the recipe from prose.** Fetch `https://ui.askewly.com/r/<name>.json`, write `files[].content` into the project, install the declared `dependencies`, and resolve `registryDependencies` (shadcn primitives — `npx shadcn add <name>` or existing project copies). Then the **restyle step is mandatory, not optional**: remap the look to the working project's own tokens per [component-restyle.md](https://ui.askewly.com/llms/docs/design-system/component-restyle.md) before reporting — shipping the asset with its default face is a style-signature failure ("대충 그린 CSS"). Prose re-implementation remains the fallback for recipes without a code asset.
3. [docs/design-system/principles.md](https://ui.askewly.com/llms/docs/design-system/principles.md) — apply task-first hierarchy and meaningful motion when composing recipes into a page.

### B. Improving existing UI

1. Start from [docs/design-system/anti-patterns.md](https://ui.askewly.com/llms/docs/design-system/anti-patterns.md) — diagnose what makes the current UI feel generic or broken. If the diagnosis is that the **wrong element** was used (a modal where the content scrolls, a dropdown where four options had room), that is an N-2 decision, not a styling fix — go back and run it.
2. Fetch the recipe closest to the surface being improved and diff the existing implementation against its anatomy, states, and token expectations.
3. Migrate literals to semantic tokens as you touch each element — do not leave mixed literal/token styling in the files you edit.

### C. Single component

1. N-3 already told you what exists. Recipe → follow it. No recipe and no code asset → [no-asset-fallback.md](https://ui.askewly.com/llms/docs/design-system/no-asset-fallback.md), which is the path for exactly this case; [recipe-format.md](https://ui.askewly.com/llms/docs/design-system/recipe-format.md) is the completeness checklist either way (intent, anatomy, tokens, states, checks, anti-patterns).
1.5. If the recipe has a Code Asset (llms.txt "Code Assets" section), apply the code-first path from A-2.5: fetch the asset JSON, transplant, then mandatorily restyle to project tokens.
2. Implement all interaction states and the keyboard/aria contract before visual polish.

## Rules

- **Judgment injection, not style injection.** Recipes, anti-patterns, and the signature apply to every project; Askewly tokens apply only to token-less projects or on explicit request. If you notice your output making an unrelated project look like askewly.com, that is a failure — re-derive from the project's own tokens.
- Semantic tokens only; never primitive-tier references or raw literals in component code. In standalone files, paste the fetched tokens.css block once and reference `var(--…)` everywhere else.
- If no recipe covers the task, take the no-asset-fallback path (N-3), apply tokens + principles + anti-patterns, and note the gap (it feeds demand-driven recipe expansion). "No recipe" is a documented branch, not a dead end.
- If a fetch fails (404, missing asset), stop and report it — do not silently fall back to invented styling.
