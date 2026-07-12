import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type DocSearchResultGroup = {
  id: string
  label: string
  items: { id: string; label: string; description?: string }[]
}

type DocSearchCmdkGroupedResultsPanelProps = {
  open: boolean
  query: string
  groups: DocSearchResultGroup[]
  recentQueries: string[]
  suggestedDocs: { id: string; label: string }[]
  onOpenChange: (open: boolean) => void
  onQueryChange: (query: string) => void
  onSelect: (itemId: string) => void
}

type DocSearchCmdkGroupedResultsPanelBodyProps = Omit<
  DocSearchCmdkGroupedResultsPanelProps,
  "open" | "onOpenChange"
>

/**
 * The `CommandInput`/`CommandList` markup, extracted from the `CommandDialog`
 * chrome so a contained demo can render it inside a plain `Command` root
 * instead of the portal + viewport-centered dialog `CommandDialog` implies.
 */
export function DocSearchCmdkGroupedResultsPanelBody({
  query,
  groups,
  recentQueries,
  suggestedDocs,
  onQueryChange,
  onSelect,
}: DocSearchCmdkGroupedResultsPanelBodyProps) {
  const isEmptyQuery = query.trim().length === 0

  return (
    <>
      <CommandInput
        placeholder="Search docs..."
        value={query}
        onValueChange={onQueryChange}
      />
      <CommandList>
        {isEmptyQuery ? (
          <>
            {recentQueries.length > 0 ? (
              <CommandGroup heading="Recent">
                {recentQueries.map((recent) => (
                  <CommandItem key={recent} value={recent} onSelect={() => onQueryChange(recent)}>
                    {recent}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            <CommandGroup heading="Suggested">
              {suggestedDocs.map((doc) => (
                <CommandItem key={doc.id} value={doc.label} onSelect={() => onSelect(doc.id)}>
                  {doc.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.id} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem key={item.id} value={item.label} onSelect={() => onSelect(item.id)}>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{item.label}</span>
                      {item.description ? (
                        <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        )}
      </CommandList>
    </>
  )
}

/**
 * Docs Cmd/Ctrl+K search: a command-palette overlay whose results are grouped
 * by section (Docs/Guides/API, ...) instead of one flat list, so a query that
 * spans sections stays scannable. When the query is empty it shows recent and
 * suggested-doc rows instead of an empty state — that empty-query content
 * lives inside this same panel rather than as a separate recipe.
 */
export function DocSearchCmdkGroupedResultsPanel({
  open,
  query,
  groups,
  recentQueries,
  suggestedDocs,
  onOpenChange,
  onQueryChange,
  onSelect,
}: DocSearchCmdkGroupedResultsPanelProps) {
  return (
    <CommandDialog
      description="Search docs, guides, and API reference"
      open={open}
      title="Search documentation"
      onOpenChange={onOpenChange}
    >
      <DocSearchCmdkGroupedResultsPanelBody
        query={query}
        groups={groups}
        recentQueries={recentQueries}
        suggestedDocs={suggestedDocs}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
      />
    </CommandDialog>
  )
}
