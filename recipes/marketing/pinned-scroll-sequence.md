---
id: pinned-scroll-sequence
name: "Pinned Scroll Sequence"
pattern_group: marketing
kind: motion-pattern
status: draft
surface_refs: [websites, commerce]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.md
code_asset: examples/ui-vocabulary-site/src/components/pinned-scroll-sequence.tsx
component_refs: []
term_refs: []
source_refs:
  - https://github.com/greensock/GSAP
last_verified: 2026-07-28
---

## Intent

A pinned scroll sequence holds a section in the viewport while the user's scroll scrubs a multi-step narrative, then releases it back into the flow. Tier ② in `knowledge/expressive-stack.md` — the decision-table row "핀 고정·스크럽·스크롤 스토리텔링" that tier ① CSS `animation-timeline` cannot express: pinning and cross-element sequencing need JS orchestration (GSAP ScrollTrigger). For a plain "appear on entry" reveal, stay on tier ① (`scroll-driven-reveal`) — escalating to this recipe without pin/scrub need is a tier violation.

## Anatomy

- A scroll container that owns the effect: ScrollTrigger's `scroller` points at it, never at the page scroll — the sequence must not hijack surrounding layout.
- A pinned stage (`pin: true`) whose steps are sequenced on one timeline; `scrub` maps scroll position to timeline progress (reversible by scrolling back).
- Step elements marked with a data attribute, entered via `fromTo` at staggered timeline positions, previous steps dimming as the next arrives.
- `gsap.context` + `revert()` cleanup on unmount — timelines and triggers must not outlive the component.
- A `prefers-reduced-motion` branch that renders every step statically: no pin, no scrub, content complete.

## States

- Before entry: steps hidden, stage unpinned.
- Pinned + scrubbing: scroll drives step-by-step reveal; direction reversible.
- Released: pin ends, page flow resumes.
- Reduced motion: static complete list — the narrative must read without any motion.

## Variants

- Dim-previous (default here): earlier steps fade to a fraction as later ones arrive — keeps one focal step (motion-principles §3: 한 번에 하나).
- Keep-all: steps accumulate at full opacity — for short sequences where the set is the message.
- Horizontal scrub: timeline translates a track on the x-axis — same contract, different axis.

## Code

```tsx
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: stage,
    scroller: container,   // scoped — never the page scroll in embedded contexts
    start: "top top",
    end: "+=600",
    pin: true,
    scrub: 0.4,
  },
})
steps.forEach((step, i) => timeline.fromTo(step, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, i))
// cleanup: gsap.context(...) + ctx.revert() on unmount
```

## Checks

- Scoped scroller: the demo/gallery embed must pass its own container as `scroller` — verify surrounding page scroll is unaffected.
- Cleanup: unmount then remount must not duplicate triggers (gsap.context revert).
- Reduced motion renders all content statically — no pin, no hidden steps.
- Dynamic import keeps gsap out of the initial chunk until the demo mounts; record the bundle diff when adopting.
- License: GSAP core + ScrollTrigger free for all uses since the Webflow acquisition — recheck `gsap.com/standard-license` before redistribution (toolshelf card guidance).

## Anti-patterns

- Escalating a simple entry reveal to ScrollTrigger — tier ① `scroll-driven-reveal` covers it with zero dependency.
- Page-scroll pinning inside an embedded/gallery context — hijacks layout the component does not own.
- Leaving triggers alive after unmount (no context/revert) — ghost pins corrupt later layout measurements.
- Hiding narrative-critical content behind scrub progress with no reduced-motion static path — content loss for reduced-motion users.

## Agent notes

- prompt_phrases: "pinned scroll storytelling section with scrubbed steps", "GSAP ScrollTrigger pin and scrub sequence scoped to its own container"
- fallbacks: reduced-motion renders the full step list statically; without JS the steps are plain stacked content — narrative never depends on scroll position.
- canonical guidance: `knowledge/expressive-stack.md` tier ② + decision table row "핀 고정·스크럽·스크롤 스토리텔링"; plain entry reveals stay tier ① (`scroll-driven-reveal`).

## Changelog

- 2026-07-28: 초판 (VI8 — VI7 A 대기 판정 집행, GSAP 첫 도입).
