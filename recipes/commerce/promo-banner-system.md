---
id: promo-banner-system
name: "Promo Banner System"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites]
tokens_used:
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/promo-banner-system.tsx
component_refs: []
term_refs: [incentive-trust-strip]
source_refs: [tailwind-plus-ecommerce]
last_verified: 2026-07-12
---

## Intent

A promo banner system is one banner shape that carries different urgency-driven offer copy — a discount rate, a limited-time sale, a countdown — depending on where it's placed (top-of-site vs in-page). It exists specifically for time-limited, dismissible promotional messaging. It is **not** the same thing as the `incentive-trust-strip` term: that term shows fixed reassurance signals (free shipping, returns, secure checkout) that don't expire and aren't urgency-driven, and it is not user-dismissible in the same session-scoped way this recipe is.

## Anatomy

- Banner container: full-width at the top of the site, or scoped to a section/page.
- Primary offer copy: the discount, sale, or promotion message.
- Optional countdown: remaining time to the offer's end, exposed to screen readers as text (not just a visual timer).
- CTA: links to the relevant category or product set the promotion applies to.
- Dismiss action: closes the banner for the current session only — it reappears next session rather than being permanently hidden.

## States

- Visible (default): offer copy, optional countdown, CTA, and dismiss control all shown.
- Dismissed: banner is removed from the layout for the remainder of the session.
- Countdown expired: the banner should be swapped or removed by the caller — this recipe does not auto-hide on expiry, since the countdown value is owned by the caller.
- No countdown: banner renders offer copy and CTA only, omitting the timer region entirely rather than leaving an empty gap.

## Variants

- Top-of-site placement: full-width strip above the main site chrome, typically persistent across pages until dismissed.
- In-page placement: bordered, section-scoped banner (e.g. inside a category page) rather than spanning the full viewport width.
- Countdown variant: adds a live remaining-time region for flash sales or limited windows.
- Evergreen variant: same shape without a countdown, for promotions without a hard deadline.

## Code

```tsx
export function PromoBannerSystem({ copy, ctaLabel, onCtaClick, dismissed, onDismiss, countdownLabel, placement = "top-of-site" }: PromoBannerSystemProps) {
  if (dismissed) return null
  return (
    <div className={placement === "in-page" ? "rounded-md border" : "border-b"} role="region" aria-label="Promotion">
      <p>
        {copy}
        {countdownLabel ? <span role="timer">{countdownLabel}</span> : null}
      </p>
      <Button variant="link" onClick={onCtaClick}>{ctaLabel}</Button>
      <button aria-label="Dismiss promotion" onClick={onDismiss}>×</button>
    </div>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/promo-banner-system.tsx`.

## Checks

- Dismissing the banner hides it only for the current session — it is not a permanent preference change.
- A countdown, when present, is exposed as readable text via `role="timer"`, not conveyed by animation alone.
- Top-of-site and in-page variants share the same component and prop surface; only layout/border styling differs.
- The banner never claims to be `incentive-trust-strip` content (free shipping/returns/security) — offer/urgency copy only.

## Anti-patterns

- **Permanent dismissal**: persisting the dismiss choice indefinitely removes a legitimate future promotion from a returning visitor.
- **Countdown with no text fallback**: a purely visual ticking timer is invisible to screen reader users; the remaining time must be readable text.
- **Confusing with the trust strip**: reusing this recipe to show "free shipping over $50" duplicates `incentive-trust-strip`'s job and blurs the urgency-vs-reassurance distinction for users.
- **CTA without a target**: a banner that dismisses but has no CTA linking to the relevant category/products wastes the placement.

## Agent notes

- prompt_phrases: "상단에 카운트다운이 있는 세일 배너를 넣어줘, 닫으면 이번 세션에서만 사라지게 해줘", "상품 상세 안에 섹션 범위 프로모션 배너를 넣어줘"
- fallbacks: if a live countdown isn't available, drop to the evergreen variant rather than showing a static, misleading time value.
- related: distinct from `incentive-trust-strip` — that term is fixed reassurance signals near cart/checkout, this recipe is time-limited promotional urgency messaging anywhere on the site.
