# Architecture — UI Vocabulary Encyclopedia

## Stack

- App: Vite + React + TypeScript
- Styling: Tailwind CSS
- UI Kit: shadcn/ui
- Icons: lucide-react
- Data source: `docs/ui-vocabulary/terms.yml`
- Generated data: site-local JSON or TypeScript module

## Project Layout

```text
ui-dictionary/
├── docs/
│   └── ui-vocabulary/
│       ├── PLAN.md
│       ├── schema.md
│       ├── sources.md
│       └── terms.yml
├── examples/
│   └── ui-vocabulary-site/
│       ├── src/
│       │   ├── components/
│       │   │   ├── term-card.tsx
│       │   │   ├── term-detail.tsx
│       │   │   ├── term-visual.tsx
│       │   │   └── poster-view.tsx
│       │   ├── data/
│       │   │   └── terms.generated.ts
│       │   ├── lib/
│       │   │   └── search.ts
│       │   └── App.tsx
│       └── components.json
└── scripts/
    └── build-ui-vocabulary-data.mjs
```

## Data Flow

1. Human-editable vocabulary lives in `docs/ui-vocabulary/terms.yml`.
2. `scripts/build-ui-vocabulary-data.mjs` validates required fields and emits `examples/ui-vocabulary-site/src/data/terms.generated.ts`.
3. React app imports generated data.
4. Search/filter runs client-side for MVP.

## Visual Asset Strategy

Each term has an `asset` field:

- `mini-mock`: default. Render a small React/CSS component that resembles the UI element.
- `icon-composition`: lucide icon plus UI chrome for abstract states.
- `diagram`: static diagram for layout concepts.
- `screenshot`: deferred. Use only when a real product example is required.

`term-visual.tsx` maps `asset.variant` to visual components. This keeps the website, detail page, and future poster export using the same source.

## UI Structure

- Header: product name, category count, search input.
- Main grid: category sections with compact cards.
- Card: Korean name, English name, one-line definition, prompt phrase, mini visual.
- Detail panel: full explanation, anatomy, when to use, anti-use, related terms.
- Poster view: 6 category blocks laid out like the seed image.

## Verification

- Data build validates schema.
- `npm run build` verifies TypeScript and Vite build.
- Browser smoke checks desktop and mobile layout.
- Poster view must fit without text overlap before H3 export work starts.
