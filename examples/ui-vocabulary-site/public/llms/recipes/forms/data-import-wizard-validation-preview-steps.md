---
id: data-import-wizard-validation-preview-steps
name: "Data Import Wizard Validation Preview Steps"
pattern_group: forms
kind: form-pattern
status: draft
surface_refs: [internal-tools, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.action.destructive
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/data-import-wizard-validation-preview-steps.tsx
component_refs: [button]
term_refs: [data-import-wizard-validation-preview, wizard]
source_refs: [retool-csv-import-flow-blog]
last_verified: 2026-07-12
---

## Intent

A data import wizard validation preview steps recipe implements the `data-import-wizard-validation-preview` term's upload-to-summary contract as five discrete steps: upload, map, validate, preview, confirm. Each step is its own screen rather than a single scrolling form, per-row validation errors surface inline in the preview table instead of only as an aggregate count, and a failing row can be fixed or explicitly skipped without aborting the whole import. This is the structure Retool/Linear/Stripe-style admin CSV import flows repeat.

## Anatomy

- Step indicator: upload / map / validate / preview / confirm, with the current step visually distinct from completed and upcoming ones.
- Column mapping table: source column paired with target field, with type coercion implied by the target field's type.
- Row-level validation: each preview row shows its own error inline, with an explicit fix-or-skip choice rather than a single blocking error banner.
- Preview table: shows the first N rows post-mapping, labeled with target schema column names, not the raw source column names.
- Summary screen: imported / skipped / failed counts once the import completes.

## States

- Upload: no mapping or preview yet, only the file input and step indicator.
- Map: column mapping table is editable; no row-level errors are shown yet.
- Validate/Preview: preview rows render with per-row error state where applicable; error count is visible as a scannable badge.
- Row error: shows an inline message plus both "fix" and "skip row" actions — never only an abort-the-whole-import path.
- Confirm: final summary counts render after the import completes; the step indicator marks all prior steps done.

## Variants

- Full five-step wizard (default, this recipe) for first-time or infrequent bulk imports.
- Collapsed three-step variant (upload, validate+preview combined, confirm) when column mapping is fixed/non-configurable for a given import type.
- Re-run variant that pre-fills mapping from the previous successful import, skipping straight to validate.

## Code

```tsx
export function DataImportWizardValidationPreviewSteps({ step, mappings, previewRows, summary, onFixRow, onSkipRow, onContinue }: DataImportWizardStepsProps) {
  const errorCount = previewRows.filter((row) => row.error).length
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      {/* step indicator, column mapping table (map step), preview table with per-row fix/skip (validate/preview step), summary counts (confirm step) */}
    </section>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/data-import-wizard-validation-preview-steps.tsx`.

## Checks

- Every preview row with an error shows both a fix action and a skip-row action, not only an abort option.
- The preview table's column labels match the target schema, not the raw uploaded column names.
- The step indicator always reflects the actual current step — a user cannot land on "preview" while still seeing "map" highlighted.
- The confirm summary's three counts (imported/skipped/failed) always sum to the total row count submitted.
- Changing a column mapping after validation invalidates the stale preview rather than silently keeping outdated validation results.

## Anti-patterns

- **Single scrolling form for all steps**: collapsing upload/map/validate/preview/confirm into one long form loses the step indicator's orientation value and makes partial progress unclear.
- **Aggregate-only error count**: showing "12 rows failed" with no per-row detail forces the user to guess which records need fixing.
- **Abort-only on row error**: forcing the user to cancel the entire import because of one bad row wastes the successfully mapped/validated rows.
- **Preview table using source column names**: showing raw uploaded headers instead of target field labels makes it hard to confirm the mapping actually did what was intended.

## Agent notes

- prompt_phrases: "업로드, 매핑, 검증, 미리보기, 확인 단계로 나뉜 data import wizard를 만들어줘", "행 단위 오류에 고치기와 건너뛰기 선택지가 있는 CSV 임포트 미리보기를 넣어줘"
- fallbacks: if per-row fix-in-place isn't feasible, skip-row plus a downloadable error report is an acceptable reduced variant — do not silently drop failed rows from the summary count.
- component composition: implements the same term (`data-import-wizard-validation-preview`) already in the dictionary; this recipe is the step-by-step structural realization, reusing the generic `wizard` step-indicator pattern rather than inventing a new one.
