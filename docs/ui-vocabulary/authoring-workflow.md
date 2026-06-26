# UI Vocabulary Authoring Workflow

This workflow keeps new UI terms reviewable before they enter the public dataset.

## Files

- `docs/ui-vocabulary/inbox.yml`: candidate terms collected from web research, product screenshots, or design-system references.
- `docs/ui-vocabulary/terms.yml`: canonical editable dataset used by the website.
- `docs/ui-vocabulary/sources.md`: allowed source ids and trust rules.
- `scripts/audit-ui-vocabulary-candidates.mjs`: candidate duplicate and readiness audit.
- `scripts/validate-ui-vocabulary.py`: canonical dataset validation after promotion.

## Candidate Lifecycle

1. Collect a candidate in `inbox.yml`.
2. Fill the same core fields used by `terms.yml`.
3. Add `collector_notes` with unresolved naming, category, or overlap questions.
4. Run the candidate audit.
5. Resolve duplicate and source warnings.
6. Promote the candidate to `terms.yml`.
7. Add or map its `asset.variant` in `TermVisual`.
8. Run full validation and site build.
9. Remove the promoted candidate from `inbox.yml`.

## Candidate Entry

```yaml
- id: mobile-filter-bottom-sheet
  status: candidate
  category: structure
  ko: { name: 모바일 필터 바텀 시트, aliases: [필터 시트] }
  en: { name: Mobile filter bottom sheet, aliases: [Filter sheet] }
  one_liner: 모바일 목록 화면에서 필터 옵션을 아래에서 올라오는 시트로 고르는 패턴.
  description: 검색 결과, 상품 목록, 지도 목록처럼 필터 조건이 많지만 화면 공간이 좁을 때 사용한다.
  visual_anatomy: [bottom sheet container, filter groups, apply button]
  when_to_use: [모바일에서 필터 조건이 여러 그룹으로 나뉠 때]
  anti_use: [필터가 1-2개뿐이면 filter chip이 더 빠르다]
  prompt_phrases: [상품 목록 아래에서 올라오는 mobile filter bottom sheet를 만들어줘]
  asset: { kind: mini-mock, variant: mobile-filter-bottom-sheet }
  sources: [{ source_id: material-m3-components, note: bottom sheet and filter behavior reference }]
  confidence: medium
  collector_notes: filter-panel과 비교 필요.
```

## Promotion Criteria

A candidate can move to `terms.yml` when:

- `id` is unique and kebab-case.
- Korean and English names do not duplicate existing terms.
- Category fits one of the six current buckets.
- `one_liner`, `description`, `visual_anatomy`, `when_to_use`, `anti_use`, and `prompt_phrases` are concrete enough for a beginner.
- At least one source id is listed in `sources.md`.
- Similar terms are handled through naming, aliases, or a future `related` comparison.
- A recognizable mini visual can be rendered without relying on a screenshot.

## Commands

Candidate audit:

```bash
node scripts/audit-ui-vocabulary-candidates.mjs
```

After promotion:

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## Review Questions

Use these before promoting:

- Is this a distinct component/pattern, or only a state of an existing term?
- Would a beginner search for this exact phrase?
- Does it have a recognizable shape in a small visual?
- Does the English name match a design-system or platform convention?
- Should it be a related comparison instead of a new term?

## Batch Strategy

Keep candidate batches small:

- 5-10 terms for a focused category expansion.
- 10-20 terms for a domain expansion such as mobile commerce or dashboard filters.
- Do not promote a batch until every promoted term has an asset renderer or an intentional renderer mapping.
