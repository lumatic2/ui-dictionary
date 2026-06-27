# UI Vocabulary Authoring Loop - Step 4

## Topic

`shadcn-chat-primitives` + `shadcn-forms-ecosystem` + `shadcn-utilities`

## Added Terms

1. `chat-message`
2. `chat-bubble`
3. `chat-attachment`
4. `conversation-marker`
5. `message-scroller`
6. `react-hook-form-pattern`
7. `tanstack-form-pattern`
8. `formisch-form-pattern`
9. `scroll-fade`
10. `shimmer-effect`

## Duplicate Handling

These terms were collected after excluding concepts already represented by the vocabulary.

- `chat-attachment` is narrower than `attachment-list`: it is a message-bound attachment surface, not a general file list.
- `conversation-marker` is narrower than `map-marker` or generic `status-indicator`: it marks a position or state inside a chat transcript.
- `message-scroller` is narrower than `scroll-area` or `infinite-scroll`: it handles conversation-specific bottom anchoring and new-message affordances.
- `shimmer-effect` is narrower than `skeleton` or `loading-state`: it names the animated shimmer treatment itself.
- `react-hook-form-pattern`, `tanstack-form-pattern`, and `formisch-form-pattern` are `form-pattern` entries, not individual input components.

## Site Integration

- Added 10 YAML records to `docs/ui-vocabulary/terms.yml`.
- Regenerated `examples/ui-vocabulary-site/src/data/terms.generated.ts`.
- Added dedicated mini-mock visuals in `examples/ui-vocabulary-site/src/components/term-visual.tsx`.

## Verification

- `python scripts/validate-ui-vocabulary.py` -> `terms ok: 408`
- `npm run build:data` -> generated 408 terms
- `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates` -> 0 candidates, 0 warnings
- `npm run build` -> pass
- `npm run lint` -> pass with existing fast-refresh warnings in shadcn wrapper files

## Status

Local implementation verified. Final publish gate remains a separate commit/push/deploy decision.
