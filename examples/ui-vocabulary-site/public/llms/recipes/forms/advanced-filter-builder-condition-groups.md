---
id: advanced-filter-builder-condition-groups
name: "Advanced Filter Builder with Condition Groups"
pattern_group: forms
kind: form-pattern
status: draft
surface_refs: [internal-tools, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/advanced-filter-builder.tsx
component_refs: [button]
term_refs: [advanced-filter-builder, select, text-field]
source_refs: [appmaster-io-blog]
last_verified: 2026-07-12
---

## Intent

An advanced filter builder with condition groups implements the `advanced-filter-builder` term's field-operator-value contract at composition scale: instead of one flat list of conditions, conditions nest inside groups, and groups combine with a top-level AND/OR join. This is the structure Retool-style internal admin tools repeat when a single filter row can't express "status is active AND (region is US OR region is EU)".

## Anatomy

- Field select: which column/attribute the condition targets.
- Operator select: equals, contains, greater than, etc. — the available set follows the selected field's type.
- Value input: adapts to the field's type (text, number, date) rather than always being a plain text box.
- Condition join: AND/OR selector between conditions inside the same group.
- Group join: a separate AND/OR selector between groups, visually distinguished from the in-group join.
- Add condition / add group: explicit actions to grow the structure.
- Remove condition: per-row action to shrink a group.
- Save as view: optional action connecting the built filter to `saved-view-tabs`.

## States

- Single group, single condition: the simplest case — no join selectors are shown yet.
- Multiple conditions, one group: an in-group AND/OR selector appears between conditions.
- Multiple groups: a group-level AND/OR selector appears between groups, styled distinctly from the in-group join so the two nesting levels stay visually separable.
- Field changed mid-condition: the operator and value input reset to match the new field's type rather than keeping a stale operator/value combination.
- Empty condition: a newly added condition with no field chosen yet still renders a full field/operator/value row, prompting completion rather than hiding controls.

## Variants

- Inline builder embedded directly above a data table (default, this recipe).
- Panel/drawer variant when the condition list is long enough to compete with the data view — compose with `filter-panel` instead of inlining.
- Read-only summary variant that renders the built expression as text/chips once complete, useful for confirming a saved view.

## Code

```tsx
export function AdvancedFilterBuilder({ fields, groups, groupJoin, onGroupJoinChange, onConditionChange, onGroupJoinToggle, onAddCondition, onRemoveCondition, onAddGroup, onSaveAsView }: AdvancedFilterBuilderProps) {
  const fieldType = (fieldValue: string) => fields.find((field) => field.value === fieldValue)?.type ?? "text"

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      {groups.map((group, groupIndex) => (
        <div key={group.id} className="flex flex-col gap-2">
          {groupIndex > 0 ? (
            <Select value={groupJoin} onValueChange={(value) => onGroupJoinChange(value as "and" | "or")}>
              <SelectTrigger size="sm" aria-label="Join groups with"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="and">AND</SelectItem><SelectItem value="or">OR</SelectItem></SelectContent>
            </Select>
          ) : null}
          <div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
            {group.conditions.map((condition, conditionIndex) => (
              <div key={condition.id} className="flex flex-wrap items-center gap-2">
                {/* field select, operator select, type-aware value input, remove action */}
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => onAddCondition(group.id)}>+ Add condition</Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={onAddGroup}>+ Add group</Button>
    </div>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/advanced-filter-builder.tsx`. Built on the existing `select`/`text-field` input primitives, not a bespoke query-string editor.

## Checks

- Changing a condition's field resets its operator/value to a valid combination for the new field's type rather than leaving a stale mismatch.
- The in-group join selector and the between-group join selector are visually distinguishable from each other.
- Adding a group always starts with at least one empty condition row, never an empty group with no conditions.
- Removing the last condition in a group removes the group itself rather than leaving an empty shell.
- Value input type (text/number/date) matches the selected field's declared type.

## Anti-patterns

- **Exposed query string**: rendering the built filter as raw SQL/query-language text for the user to hand-edit defeats the purpose of a structured builder — keep the structure the primary editing surface.
- **Flat conditions with no grouping**: when the underlying data model supports nested AND/OR, forcing everything into one flat list silently drops expressiveness the user needs.
- **Operator list ignoring field type**: showing "greater than" for a text field or "contains" for a date field confuses users and produces invalid queries.
- **Untouched empty groups**: allowing a save action while a group has zero conditions produces a filter that silently matches everything or nothing depending on the join semantics.

## Agent notes

- prompt_phrases: "필드, 연산자, 값을 조합하고 AND/OR로 그룹까지 묶을 수 있는 advanced filter builder를 만들어줘", "조건을 여러 그룹으로 나누고 그룹끼리도 AND/OR로 연결되는 필터 빌더를 넣어줘"
- fallbacks: if nested groups are out of scope, a single flat AND-only condition list is an acceptable reduced variant — but do not silently drop the OR case; state the limitation to the user instead.
- component composition: reuses `select`/`text-field` input primitives directly — assemble from those rather than building custom dropdown/input controls for this recipe.
