# M2-M4 Execution Notes

## Scope

After M1 Origin/coss deployment, the user asked to design M2, M3, and M4 and continue execution with harness.

This pass intentionally uses one compact batch per milestone:

- M2: adjacent shadcn block ecosystems
- M3: Magic UI-style motion/effect vocabulary
- M4: Aceternity UI-style landing/hero/card vocabulary

## M2: Shadcn Blocks Ecosystem

Source direction:

- blocks.so and adjacent shadcn block libraries
- SaaS/admin/dashboard/marketing sections
- Exclude official shadcn dashboard/sidebar/chart/auth blocks already covered

Promoted terms:

1. `pricing-section`
2. `testimonial-section`
3. `feature-grid-section`
4. `integration-grid-section`
5. `settings-page-layout`
6. `profile-settings-form`
7. `billing-settings-page`
8. `onboarding-flow-page`
9. `newsletter-section`
10. `cta-section`

## M3: Motion / Effect UI

Source direction:

- Magic UI-style animated components
- Text effects, loading effects, backgrounds, marquee/beam/orbit effects
- Keep purely decorative effects constrained with `anti_use`

Promoted terms:

1. `animated-gradient-background`
2. `marquee-row`
3. `border-beam`
4. `orbiting-icons`
5. `spotlight-card`
6. `grid-pattern-background`
7. `typing-text-effect`
8. `number-ticker`
9. `blur-fade-in`
10. `animated-shiny-text`
11. `dot-pattern-background`

## M4: Aceternity UI

Source direction:

- Aceternity UI-style landing, hero, card, background, and scroll interaction components
- Split landing/page semantics from M3 reusable motion effects

Promoted terms:

1. `bento-grid`
2. `sticky-scroll-section`
3. `floating-navbar`
4. `three-d-card`
5. `hover-card-stack`
6. `background-beams`
7. `aurora-background`
8. `spotlight-hero`
9. `infinite-moving-cards`
10. `canvas-reveal-card`
11. `tracing-beam-section`

## Duplicate Handling

- Existing `hero`, `price-card`, `integration-card`, `billing-summary`, `wizard`, `marquee-row`, and `shimmer-effect` are linked as related where a new block/effect is broader or narrower.
- Generic shadcn official blocks remain covered by previous shadcn milestones; M2 only adds ecosystem page/block patterns.
- M3 keeps reusable effects; M4 keeps landing/page patterns even when both use motion.

## Verification

Local verification:

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data && npm run build && npm run lint
cd ../..
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

Status before deploy:

- Dataset count: 462 terms
- Production deploy for M2-M4 is not yet pushed.
