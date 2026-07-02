# Tailwind Hero Parity Type And Frame Plan

Date: 2026-07-01

## Scope

Bring the current Plus / UI Blocks / Marketing / Hero Sections page closer to the Tailwind Plus reference without changing navigation data, term taxonomy, or code tab behavior.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_skip_reason: "Narrow visual parity changeset inside the existing Tailwind reference direction; no product contract change."
  perspectives:
    product: "Users should recognize the page as a Tailwind Plus-style UI Blocks catalog."
    architecture: "Keep changes inside App.tsx and index.css; do not touch generated term data or navigation model."
    security: "No secret, auth, network write, or data model change."
    qa: "Build, lint, whitespace check, and Chrome-rendered style smoke."
    skeptic: "External webfont loading may differ by network; fallback stack must remain acceptable."
  dod:
    - "Hero page body font resolves to InterVariable/Inter stack."
    - "Hero Sections title renders near Tailwind reference scale: 60px / weight 400 on desktop."
    - "Preview/Code control uses pill segmented styling; Code remains disabled placeholder."
    - "Get the code action appears in the row; local page has no console errors."
```

## Step Tree

- [x] Font tokens: add InterVariable + IBM Plex Mono stacks. Verify: computed body font in Chrome.
- [x] Page typography: adjust breadcrumb, title, description scale/weight. Verify: title computed 60px / 400.
- [x] Catalog controls: replace rectangular Preview/Code buttons with rounded pill segmented control. Verify: computed border radius is full round.
- [x] Preview frame and code placeholder: soften frame/ring/panel styling. Verify: screenshot has no overlap and Code remains placeholder.

## Stop Points

- Stop if `npm run build`, `npm run lint`, or Chrome smoke fails.
- Stop before changing actual Code tab behavior or replacing placeholder snippets; that is a separate feature step.

