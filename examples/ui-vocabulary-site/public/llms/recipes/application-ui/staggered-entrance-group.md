---
id: staggered-entrance-group
name: "Staggered Entrance Group"
pattern_group: application-ui
kind: motion-pattern
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.border.default
  - dimension.radius.md
code_asset: examples/ui-vocabulary-site/src/components/staggered-entrance-group.tsx
component_refs: [button]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A staggered entrance offsets the start times of sibling items so a list, card grid, or dashboard reads as one coherent arrival instead of a simultaneous pop. Choreography principle from `knowledge/expressive-stack.md`: tier-agnostic — static lists can do it with CSS `animation-delay`; use tier ② (Motion `staggerChildren`) when item count is dynamic or entrances can be interrupted. Unlike magnetic hover, restrained stagger is a production default, not an experimental touch.

## Anatomy

- A parent that owns the choreography (`staggerChildren` interval) — children never self-schedule.
- Per-item entrance of `opacity` + small `y` rise, spring-driven.
- Tight interval (20–60ms) — rhythm, not a parade.
- Sequencing order: stable structure first (headers), then content, important actions last — the eye lands where the next decision is.
- Reduced-motion branch: everything immediately visible, no movement, no delays.

## States

- Entering: items cascade with offset starts.
- Settled: identical to a never-animated layout — entrance leaves no residue.
- Reduced motion: instant, complete render.
- Re-run (filter/tab change): re-trigger only when the *set* changes, not on every data refresh.

## Variants

- List/feed entrance (this demo).
- Card grid arrival (row-major order).
- Dashboard widgets (structure → data → primary action).

## Code

```tsx
<motion.ul
  initial={reduceMotion ? false : "hidden"}
  animate="show"
  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
>
  {items.map((label) => (
    <motion.li
      key={label}
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    />
  ))}
</motion.ul>
```

## Checks

- Interval ≤60ms and total choreography under ~400ms for a typical list — content is never held hostage by its own entrance.
- Only `opacity`/`transform` animate; layout is stable from first frame (no reflow as items land).
- `prefers-reduced-motion` renders the complete list instantly.
- Stagger runs on mount/set-change only — scrolling or data refresh does not replay it.

## Anti-patterns

- **Parade stagger**: 150ms+ intervals turn a 6-item list into a 1-second wait — choreography becomes latency.
- **Everything staggers**: applying entrance to every section of a page makes the product feel gated; one choreographed group per view.
- **Content gating**: hiding items until their turn in a way that survives animation failure — the settled state must be reachable even if the animation never runs.
- **Random delays**: per-item random offsets read as jank, not rhythm — the interval is constant by design.

## Agent notes

- prompt_phrases: "staggerChildren entrance with 50ms interval, spring items, reduced-motion instant render", "structure-first sequencing: headers, content rows, then primary actions"
- fallbacks: static known-length lists can use pure CSS `animation-delay` (tier ①) — escalate to Motion only for dynamic counts or interruptible entrances.
- canonical guidance: `knowledge/expressive-stack.md` decision row "다요소 등장 안무(stagger)"; choreography sources in the genealogy research doc (Carbon/Material).
