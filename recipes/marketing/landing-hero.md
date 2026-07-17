---
id: landing-hero
name: "Landing Hero"
pattern_group: marketing
kind: block
status: draft
surface_refs: [websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.action.primary
  - color.semantic.text.on-accent
  - color.semantic.border.default
  - dimension.radius.xl
  - typography.font.sans
  - typography.scale.xl
  - typography.scale.2xl
code_asset: examples/ui-vocabulary-site/src/components/landing-hero.tsx
component_refs: [topbar-command-search]
term_refs: [command-palette, autocomplete]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-07
---

## Intent

The first-viewport block for a public product/design-system homepage: a centered product name or direct promise, one line of supporting copy naming the two things the product actually is, two calls to action, and a single restrained proof surface underneath (here, a live search field) instead of a wall of decorative cards. It exists to convert a first-time visitor in one scroll-length without resorting to a split hero (text left / mockup right) or a fake analytics dashboard — both of which `DESIGN.md` §8 explicitly bans for this product's landing page.

## Anatomy

- Section root: full-bleed `surface.base` background, generous top/bottom padding, `overflow-hidden` to host any ambient background field without clipping content oddly.
- Optional ambient layer (`FloatingField` in the current asset): a pointer-reactive decorative field sitting behind content at a lower stacking order — never a blob/orb gradient (banned, §8).
- `h1`: centered, large clamp-based type scale, single line of product name or promise. Uses `typography.scale.2xl` as the floor of its clamp range.
- Subcopy `p`: centered, max-width constrained (`max-w-2xl`) so line length stays readable, one sentence naming both the public site and the agent-facing system.
- CTA row: two buttons, `flex-col` on mobile → `flex-row` on `sm:`, gap between them.
  - Primary: solid `color.semantic.action.primary` fill, `color.semantic.text.on-accent` text, trailing icon.
  - Secondary: outline only, `color.semantic.border.default`, transparent fill.
- Proof surface: exactly one below the CTA row — in the current asset this is a live search input with a suggestion popover (`component_refs: topbar-command-search`), not a decorative dashboard mockup.

## States

- **Default (Centered)**: title, subcopy, two CTAs, and the search proof surface stacked and centered — the shipped state.
- **Search proof surface focused**: input expands/opens a suggestion popover beneath it (delegates to the `topbar-command-search`-family state machine: collapsed/open-empty/open-typed/keyboard nav). The hero block itself does not own this state, it only hosts the component.
- **Reduced motion**: any ambient pointer-reactive field must respect `prefers-reduced-motion` and render static or fully disabled.
- **Responsive reflow**: at narrow widths the CTA row stacks vertically and the `h1` clamp shrinks; copy must never truncate or get clipped by the section's `overflow-hidden`.

## Variants

- **Centered** (current, shipped): title → subcopy → CTA row → single proof surface, all centered on one column. Use when the product has one clear promise and one clear next action (search or explore).
- **Proof**: swaps the plain search field for the "Hero Proof Surface" spec in `DESIGN.md` §7 — a compact design-system workspace preview (left nav / central preview / right inspector, labels like Docs, Patterns, Showcase, Resources, Pro) shown *below* the centered title instead of beside it. Still one column, still centered — never split left-text/right-mockup (banned).
- **Compact**: same content order, reduced vertical padding and a smaller `h1` clamp ceiling, for use as a secondary/nested hero (e.g. inside a sub-page) where the full first-viewport treatment would be excessive.

## Code

```tsx
<section className="relative isolate overflow-hidden bg-white px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20 lg:px-10">
  <div className="pointer-events-none absolute inset-0 -z-10 bg-white" />
  <FloatingField />
  <div className="relative z-30 mx-auto flex max-w-[1180px] min-w-0 flex-col items-center">
    <h1 className="mt-4 text-center text-[clamp(3.5rem,16vw,9.5rem)] font-semibold leading-[0.9] tracking-normal text-slate-950">
      Askewly Design
    </h1>
    <p className="mt-7 w-full max-w-2xl text-center text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:text-xl">
      A visual library and agent-ready system for designing better product interfaces.
    </p>

    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <Button
        className="h-11 rounded-full bg-askewly-violet px-6 text-white hover:bg-askewly-violet/90"
        type="button"
        onClick={() => onNavigate({ page: "plus", filter: "nav:plus-application-ui" })}
      >
        Get Started
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      <Button
        className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-950 hover:bg-slate-50"
        variant="outline"
        type="button"
        onClick={() => onNavigate({ page: "docs", filter: "nav:docs-getting-started-setup" })}
      >
        Open Docs
      </Button>
    </div>

    <HeroSearch filter={filter} terms={terms} onNavigate={onNavigate} onSearch={onSearch} />
  </div>
</section>
```

Full hero markup, `FloatingField`, and the `HeroSearch` proof-surface component live in `code_asset`; this excerpt is the structural contract (title → subcopy → CTA pair → single proof surface), not the full implementation.

## Checks

- Known deviation (2026-07-07, found by the recipe-consumption demo): the shipped hero code uses pill-radius CTAs, contradicting the `button` recipe spec (radius `sm`) and DESIGN.md §8. New implementations must follow the `button` recipe; the shipped hero is queued for reconciliation in the product-surface pass.
- Exactly one `h1` in the hero, centered, no split-column layout with a mockup/card on the opposite side.
- Exactly two CTAs, one primary (solid fill) and one secondary (outline) — not more, not a single lonely button.
- Subcopy mentions both the public reference site and the agent-facing design system, not just one.
- Below the CTAs there is exactly one proof surface (search field, or the Proof-variant workspace preview) — never multiple unrelated decorative cards.
- Ambient background field (if present) has a `motion-reduce` fallback and does not read as a purple-dominated page (§8) on its own.
- When the product has a real UI, the proof surface prefers an actual product screen (real data, real states) over illustration or abstract mockups — the UI proves itself (taste ledger T-9, Codex measured).
- CTA buttons have visible hover/active/focus-visible states; focus ring must be keyboard-reachable.
- At narrow viewports, title and subcopy reflow without clipping or horizontal scroll from the section's `overflow-hidden`.

## Anti-patterns

- **Split hero**: text on one side, product screenshot/card mockup on the other. `DESIGN.md` §8 bans this explicitly for this product — the hero must stay single-column and centered.
- **Decorative blob/orb backgrounds**: gradient blobs or orb shapes behind the title are banned (§8); use a restrained ambient field (e.g. a pointer-reactive dot/line field) or nothing.
- **Purple-dominated page**: leaning on `color.semantic.action.primary` (the violet) as a large background wash instead of a small accent on the primary CTA only — the hero background stays `surface.base`, not tinted.
- **Fake metrics dashboard as the proof surface**: substituting the search field or workspace preview with a generic SaaS analytics mockup (charts, fabricated KPI numbers) is banned unless the page's selected mode is explicitly Dashboard (§7 Hero Proof Surface, §8).

## Agent notes

- `prompt_phrases`: "중앙 정렬 hero에 제품 약속과 CTA 2개, 그 아래 proof surface 하나만 넣어줘", "split hero 말고 한 칼럼으로, 배경에 blob 쓰지 말고", "Proof 버전으로 바꿔서 검색창 대신 좌측 nav/중앙 preview/우측 inspector 워크스페이스 미리보기 보여줘"
- Fallback: if the host page has no `terms`-shaped search dataset to power a live proof surface, fall back to the Proof variant's static workspace preview (left nav / central preview / right inspector) rather than leaving the CTA row as the last element — the block's contract requires one proof surface below the CTAs.
- If the product needs a two-column layout with a real product screenshot, that is a different, currently-unbanned-elsewhere pattern outside this recipe's contract — do not force it into `landing-hero`, which is scoped to the centered/no-split direction confirmed in `DESIGN.md` §7-§8.
