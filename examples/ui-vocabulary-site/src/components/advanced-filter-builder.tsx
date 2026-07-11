import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterFieldType = "text" | "number" | "date"
export type FilterFieldOption = { value: string; label: string; type: FilterFieldType }
export type FilterOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than"

export type FilterCondition = {
  id: string
  field: string
  operator: FilterOperator
  value: string
}

export type FilterGroup = {
  id: string
  join: "and" | "or"
  conditions: FilterCondition[]
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "contains", label: "contains" },
  { value: "greater_than", label: "greater than" },
  { value: "less_than", label: "less than" },
]

type AdvancedFilterBuilderProps = {
  fields: FilterFieldOption[]
  groups: FilterGroup[]
  groupJoin: "and" | "or"
  onGroupJoinChange: (join: "and" | "or") => void
  onConditionChange: (groupId: string, condition: FilterCondition) => void
  onGroupJoinToggle: (groupId: string, join: "and" | "or") => void
  onAddCondition: (groupId: string) => void
  onRemoveCondition: (groupId: string, conditionId: string) => void
  onAddGroup: () => void
  onSaveAsView?: () => void
}

/**
 * Condition-group filter builder: fields/operators/values compose into a
 * group, groups combine with a top-level AND/OR join, and the value input's
 * `type` follows the selected field (implements the existing
 * `advanced-filter-builder` term's field-operator-value contract with
 * nested condition groups, per Retool/internal-admin conventions).
 */
export function AdvancedFilterBuilder({
  fields,
  groups,
  groupJoin,
  onGroupJoinChange,
  onConditionChange,
  onGroupJoinToggle,
  onAddCondition,
  onRemoveCondition,
  onAddGroup,
  onSaveAsView,
}: AdvancedFilterBuilderProps) {
  const fieldType = (fieldValue: string) => fields.find((field) => field.value === fieldValue)?.type ?? "text"

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      {groups.map((group, groupIndex) => (
        <div key={group.id} className="flex flex-col gap-2">
          {groupIndex > 0 ? (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <Select value={groupJoin} onValueChange={(value) => onGroupJoinChange(value as "and" | "or")}>
                <SelectTrigger size="sm" aria-label="Join groups with">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">AND</SelectItem>
                  <SelectItem value="or">OR</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-px flex-1 bg-border" />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
            {group.conditions.map((condition, conditionIndex) => (
              <div key={condition.id} className="flex flex-wrap items-center gap-2">
                {conditionIndex > 0 ? (
                  <Select
                    value={group.join}
                    onValueChange={(value) => onGroupJoinToggle(group.id, value as "and" | "or")}
                  >
                    <SelectTrigger size="sm" aria-label="Join conditions with">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">AND</SelectItem>
                      <SelectItem value="or">OR</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-muted-foreground">Where</span>
                )}

                <Select
                  value={condition.field}
                  onValueChange={(value) =>
                    onConditionChange(group.id, { ...condition, field: value })
                  }
                >
                  <SelectTrigger size="sm" aria-label="Field">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    onConditionChange(group.id, { ...condition, operator: value as FilterOperator })
                  }
                >
                  <SelectTrigger size="sm" aria-label="Operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  className="w-32"
                  type={fieldType(condition.field) === "number" ? "number" : fieldType(condition.field) === "date" ? "date" : "text"}
                  value={condition.value}
                  onChange={(event) =>
                    onConditionChange(group.id, { ...condition, value: event.target.value })
                  }
                  aria-label="Value"
                />

                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Remove condition"
                  onClick={() => onRemoveCondition(group.id, condition.id)}
                >
                  ×
                </Button>
              </div>
            ))}

            <Button size="sm" variant="ghost" className="self-start" onClick={() => onAddCondition(group.id)}>
              + Add condition
            </Button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between gap-2">
        <Button size="sm" variant="outline" onClick={onAddGroup}>
          + Add group
        </Button>
        {onSaveAsView ? (
          <Button size="sm" variant="ghost" onClick={onSaveAsView}>
            Save as view
          </Button>
        ) : null}
      </div>
    </div>
  )
}
