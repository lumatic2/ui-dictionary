# Future Dictionary Sites

## Decision

Do not keep every dictionary inside `design-manual`.

`design-manual` should remain the source for design-methodology, UI vocabulary, and reusable design-agent workflow notes. Separate dictionary products should become separate repositories once their schema and audience diverge.

## Candidate Repositories

### UX Dictionary

Working idea: `ux-dictionary` or `ux-vocabulary`

Purpose:

- Explain UX research, product design, interaction design, usability, and service design terms.
- Help people say what kind of user problem, flow, metric, or research artifact they mean.

Examples:

- user journey
- task flow
- affordance
- cognitive load
- heuristic evaluation
- usability test
- Jobs To Be Done
- information architecture
- conversion funnel
- empty state UX
- dark pattern

Likely schema differences:

- More conceptual definitions and examples.
- Fewer mini component visuals.
- More process artifacts, diagrams, and scenario examples.
- Stronger compare notes: `user flow` vs `task flow`, `persona` vs `segment`, `metric` vs `KPI`.

### Developer Dictionary

Working idea: `dev-dictionary` or `developer-vocabulary`

Purpose:

- Explain software/product engineering terms for non-specialists and vibe-coding users.
- Help users request architecture, data, API, deployment, testing, and debugging work precisely.

Examples:

- API endpoint
- webhook
- database schema
- migration
- auth session
- cache
- queue
- cron job
- environment variable
- CI/CD
- smoke test
- rate limit

Likely schema differences:

- Code-ish examples and diagrams matter more than component visuals.
- More "when to ask for this" and "what can go wrong" fields.
- Safety notes are important for auth, database, billing, deployment, and destructive operations.

## Shared Engine Direction

The current UI Vocabulary site can become a reusable dictionary engine later:

- Search/autocomplete.
- Category/group navigation.
- Term detail sheet.
- Related-term comparison.
- Use-case browse.
- PDF/export support.

But the dataset and repo should be split when:

- The term schema needs domain-specific fields.
- The navigation taxonomy no longer matches UI components.
- The visual renderer would become domain-specific.
- The product needs a different URL, brand, or publishing cadence.

## Recommended Next Step

After UI Vocabulary detail/comparison UX stabilizes, extract a reusable template:

```txt
dictionary-site-template/
  data/terms.yml
  src/lib/search.ts
  src/lib/term-ux.ts
  src/components/term-card.tsx
  src/components/term-detail.tsx
  src/components/category-nav.tsx
```

Then create new repositories from that template instead of adding UX/developer vocabularies directly to this repo.

