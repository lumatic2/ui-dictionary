---
id: scroll-driven-reveal
name: "Scroll-Driven Reveal"
pattern_group: marketing
kind: motion-pattern
status: draft
surface_refs: [websites, commerce, documentation]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.md
code_asset: examples/ui-vocabulary-site/src/components/scroll-driven-reveal.tsx
component_refs: []
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A scroll-driven reveal fades/raises content in as it enters the scrollport, using CSS view-progress timelines (`animation-timeline: view()`). Tier ① in `knowledge/expressive-stack.md`: for a plain "appear on entry" mapping this needs no scroll listeners, no IntersectionObserver, and runs off the main thread. Escalate to tier ② (GSAP ScrollTrigger) only for pinning, scrubbing, or cross-element sequencing — per the decision table.

## Anatomy

- A reveal item whose hidden initial state (`opacity: 0`, small translate) is declared **only inside** `@supports (animation-timeline: view())` — the load-bearing safety: unsupported browsers see content immediately.
- `animation: <keyframes> both` + `animation-timeline: view()` + `animation-range: entry 0% entry N%` mapping the entry window to animation progress.
- A `prefers-reduced-motion: reduce` override that disables the animation (content visible, no movement).
- The nearest scrollport (page or an `overflow` container) drives the timeline automatically.

## States

- Before entry: hidden (supported browsers only).
- During entry: progress mapped to scroll position — reversible by scrolling back up.
- Reduced motion: fully visible, no animation.
- No support (Safari/Firefox partial as of 2026-07): fully visible static content — indistinguishable from "already revealed".

## Variants

- Landing section reveal (page scrollport).
- Bounded feed/list reveal (inner `overflow-y-auto` scrollport).
- Progress-linked treatments (scale/blur instead of rise) — same timeline, different keyframes.

## Code

```tsx
const REVEAL_CSS = `
@supports (animation-timeline: view()) {
  .sdr-item {
    animation: sdr-reveal both;
    animation-timeline: view();
    animation-range: entry 0% entry 70%;
  }
  @keyframes sdr-reveal {
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: none; }
  }
}
@media (prefers-reduced-motion: reduce) {
  .sdr-item { animation: none; }
}
`
```

## Checks

- The hidden initial state lives only under `@supports` — removing timeline support must leave all content visible (reveal failure ≠ content loss).
- `prefers-reduced-motion` disables movement entirely.
- Only `opacity`/`transform` animate — no layout properties on a scroll-linked timeline.
- Reveal distance stays small (≤1.5rem) and the entry range ends well before center — content is readable when the user's eye reaches it.

## Anti-patterns

- **Hidden-by-default without @supports gate**: `opacity: 0` in base styles turns every unsupported browser into a blank page — the single worst failure of this pattern.
- **JS re-implementation**: adding IntersectionObserver for a plain entry reveal when the CSS timeline covers it — tier escalation without justification.
- **Reveal everything**: staggering every section element makes the page feel gated; reveal one structural unit per viewport at most.
- **Scroll-linked layout animation**: animating height/margin on a scroll timeline causes continuous reflow.

## Agent notes

- prompt_phrases: "CSS view() timeline reveal with @supports-gated hidden state and reduced-motion off-switch", "scroll-entry fade-rise without JS listeners"
- fallbacks: unsupported browsers get static visible content by construction; if pinning/scrubbing/sequencing is requested, use tier ② GSAP ScrollTrigger instead of stretching this recipe.
- canonical guidance: `knowledge/expressive-stack.md` decision rows "스크롤 진행률에 매핑된 애니메이션"(①) vs "핀 고정·스크럽"(②).
