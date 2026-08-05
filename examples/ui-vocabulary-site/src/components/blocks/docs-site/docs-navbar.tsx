import { BookOpenIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type DocsPageId = "article" | "api" | "changelog"

const TABS: { id: DocsPageId; label: string }[] = [
  { id: "article", label: "Guides" },
  { id: "api", label: "API" },
  { id: "changelog", label: "Changelog" },
]

type DocsNavbarProps = {
  product: string
  activePage: DocsPageId
  onNavigate: (page: DocsPageId) => void
  onOpenSearch: () => void
}

/**
 * The thin top rail: product mark, section tabs, and the search affordance.
 *
 * The search button is deliberately a *button* showing the shortcut rather
 * than an input — the panel it opens is a command dialog, and rendering a
 * text field here would promise inline results that never arrive.
 */
export function DocsNavbar({ product, activePage, onNavigate, onOpenSearch }: DocsNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <BookOpenIcon aria-hidden="true" className="size-5 text-primary" />
        <span className="font-medium">{product}</span>
        <Badge variant="outline" className="hidden sm:inline-flex">
          docs
        </Badge>
      </div>

      <nav aria-label="Docs sections" className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            aria-current={tab.id === activePage ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab.id === activePage
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            type="button"
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Button
        aria-label="Search docs"
        className="ml-auto w-44 justify-between text-muted-foreground"
        size="sm"
        variant="outline"
        onClick={onOpenSearch}
      >
        <span className="flex items-center gap-2">
          <SearchIcon aria-hidden="true" className="size-4" />
          Search
        </span>
        <kbd className="rounded border bg-muted px-1.5 text-xs font-medium">⌘K</kbd>
      </Button>
    </header>
  )
}
