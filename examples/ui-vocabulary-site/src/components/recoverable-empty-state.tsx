import { useState } from "react"
import { InboxIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type EmptyStateKind = "firstUse" | "search" | "filtered" | "error"

type RecoverableEmptyStateProps = {
  kind: EmptyStateKind
  query?: string
  onRecover: () => void
}

const COPY: Record<EmptyStateKind, { title: (query?: string) => string; body: string; action: string }> = {
  firstUse: {
    title: () => "No projects yet",
    body: "Create the first project for this workspace.",
    action: "Create project",
  },
  search: {
    title: (query) => `No results for "${query}"`,
    body: "Try a broader term or clear the query.",
    action: "Clear search",
  },
  filtered: {
    title: () => "No matching records",
    body: "The current filters exclude every record.",
    action: "Clear filters",
  },
  error: {
    title: () => "Could not load records",
    body: "Your changes are safe. Try loading this view again.",
    action: "Retry",
  },
}

/**
 * Recoverable empty state: matches copy and the primary recovery action to
 * the actual cause (first use, empty search, filtered-out content, or a
 * load failure) instead of showing one generic illustration for every case.
 */
export function RecoverableEmptyState({ kind, query, onRecover }: RecoverableEmptyStateProps) {
  const copy = COPY[kind]

  return (
    <section className="grid min-h-64 place-items-center rounded-lg border bg-muted/30 p-8 text-center">
      <div className="max-w-md">
        <InboxIcon aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium text-foreground">{copy.title(query)}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.body}</p>
        <Button className="mt-6" type="button" onClick={onRecover}>
          {copy.action}
        </Button>
      </div>
    </section>
  )
}

const KIND_OPTIONS: { id: EmptyStateKind; label: string }[] = [
  { id: "firstUse", label: "First use" },
  { id: "search", label: "Empty search" },
  { id: "filtered", label: "Filtered out" },
  { id: "error", label: "Load error" },
]

/**
 * Colocated demo: lets you switch between the four causes the recipe
 * distinguishes, so each renders its own copy and recovery action.
 */
export function RecoverableEmptyStateDemo() {
  const [kind, setKind] = useState<EmptyStateKind>("firstUse")
  const [recovered, setRecovered] = useState<EmptyStateKind | null>(null)
  const query = "graphite lamp"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {KIND_OPTIONS.map((option) => (
          <Button
            key={option.id}
            size="sm"
            type="button"
            variant={kind === option.id ? "default" : "outline"}
            onClick={() => {
              setKind(option.id)
              setRecovered(null)
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <RecoverableEmptyState kind={kind} query={query} onRecover={() => setRecovered(kind)} />
      {recovered ? <p className="text-sm text-muted-foreground">Recovery action triggered for "{recovered}".</p> : null}
    </div>
  )
}
