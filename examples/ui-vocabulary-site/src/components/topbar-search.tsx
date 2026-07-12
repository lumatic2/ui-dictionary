import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import type { VocabularyTerm } from "@/data/terms.generated"
import { getSearchSuggestions, type SearchDestination, type SearchSuggestion } from "@/lib/search-suggestions"
import type { TermFilter } from "@/lib/search"
import { navFilter } from "@/lib/navigation-model"
import { cn } from "@/lib/utils"

type TopbarSearchProps = {
  expanded: boolean
  filter: TermFilter
  query: string
  terms: VocabularyTerm[]
  onExpandedChange: (expanded: boolean) => void
  onFilterChange: (filter: TermFilter) => void
  onQueryChange: (query: string) => void
  onNavigate?: (destination: SearchDestination) => void
}

export function TopbarSearch({
  expanded,
  filter,
  query,
  terms,
  onExpandedChange,
  onFilterChange,
  onQueryChange,
  onNavigate,
}: TopbarSearchProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [draftQuery, setDraftQuery] = useState(query)
  const [activeIndex, setActiveIndex] = useState(0)
  const suggestions = useMemo(() => {
    if (!draftQuery.trim()) {
      return topbarStarterSuggestions
    }

    return getSearchSuggestions(terms, draftQuery, filter, 8)
  }, [draftQuery, filter, terms])
  const open = expanded && suggestions.length > 0

  useEffect(() => {
    if (expanded) {
      setDraftQuery(query)
      setActiveIndex(0)
      window.setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [expanded, query])

  useEffect(() => {
    if (!query) {
      setDraftQuery("")
    }
  }, [query])

  const collapse = useCallback(() => {
    onExpandedChange(false)
    setActiveIndex(0)
  }, [onExpandedChange])

  useEffect(() => {
    if (!expanded) {
      return
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target as Node | null
      if (target && rootRef.current?.contains(target)) {
        return
      }

      // PopoverContent renders through a Portal, so suggestion buttons are
      // never descendants of rootRef even while the popover is open —
      // without this check, every pointerdown on a suggestion closes the
      // popover before its click handler runs.
      if (target instanceof Element && target.closest('[data-slot="popover-content"]')) {
        return
      }

      collapse()
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
    }
  }, [collapse, expanded])

  function commitQuery(value = draftQuery) {
    const nextQuery = value.trim()
    setDraftQuery(nextQuery)
    onQueryChange(nextQuery)
    collapse()
  }

  function selectSuggestion(suggestion: SearchSuggestion) {
    if (suggestion.type === "category" || suggestion.type === "group") {
      onFilterChange(suggestion.filter)
      onQueryChange("")
      collapse()
      return
    }

    if (suggestion.type === "page") {
      onNavigate?.(suggestion.destination)
      onQueryChange("")
      collapse()
      return
    }

    commitQuery(suggestion.value)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    }
    if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
    }
    if (event.key === "Enter") {
      event.preventDefault()
      const activeSuggestion = suggestions[activeIndex]
      if (activeSuggestion) {
        selectSuggestion(activeSuggestion)
      } else {
        commitQuery()
      }
    }
    if (event.key === "Escape") {
      collapse()
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex shrink-0 origin-right justify-end overflow-visible transition-[width] duration-300 ease-out motion-reduce:transition-none",
        expanded ? "w-[calc(100vw-2rem)] md:w-[22rem]" : "w-[4.75rem] md:w-[5.25rem]"
      )}
    >
      <Popover open={open}>
        <PopoverAnchor asChild>
          <div className="relative w-full">
            {!expanded ? (
              <button
                aria-label="검색 열기"
                className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full px-2.5 text-sm transition hover:bg-muted"
                type="button"
                onClick={() => onExpandedChange(true)}
              >
                <Search aria-hidden="true" className="size-4" />
                <span className="hidden text-muted-foreground md:inline">Ctrl F</span>
              </button>
            ) : (
              <>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  aria-autocomplete="list"
                  aria-expanded={open}
                  aria-label="Askewly Design topbar 검색"
                  autoComplete="off"
                  className="h-9 rounded-full pl-9 pr-9"
                  placeholder="Hero, header, footer, feature..."
                  value={draftQuery}
                  onChange={(event) => {
                    setDraftQuery(event.target.value)
                    setActiveIndex(0)
                  }}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  aria-label="검색 닫기"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  size="icon-sm"
                  variant="ghost"
                  onClick={collapse}
                >
                  <X aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="end"
          className="w-[min(28rem,calc(100vw-2rem))] p-2"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="px-2 py-2 text-xs font-medium uppercase text-muted-foreground">
            {draftQuery.trim() ? "추천 결과" : "바로 찾기"}
          </div>
          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                className={cn(
                  "flex items-start gap-3 rounded-md px-3 py-2 text-left transition",
                  index === activeIndex ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                )}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
              >
                <Search aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{suggestion.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{suggestion.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const topbarStarterSuggestions: SearchSuggestion[] = [
  {
    id: "topbar-hero-sections",
    type: "group",
    label: "Hero Sections",
    description: "Marketing page hero examples",
    value: "Hero Sections",
    filter: navFilter("plus-marketing-hero-sections"),
  },
  {
    id: "topbar-footers",
    type: "group",
    label: "Footers",
    description: "Footer layouts and link groups",
    value: "Footers",
    filter: navFilter("plus-marketing-footers"),
  },
  {
    id: "topbar-pricing-sections",
    type: "group",
    label: "Pricing Sections",
    description: "Pricing cards, tiers, and comparison tables",
    value: "Pricing Sections",
    filter: navFilter("plus-marketing-pricing-sections"),
  },
  {
    id: "topbar-checkout-forms",
    type: "group",
    label: "Checkout Forms",
    description: "Ecommerce checkout form examples",
    value: "Checkout Forms",
    filter: navFilter("plus-ecommerce-checkout-forms"),
  },
  {
    id: "topbar-recipes",
    type: "page",
    label: "Recipe Gallery",
    description: "Live-render index of composed design-system recipes",
    value: "Recipe Gallery",
    destination: { page: "recipes" },
  },
  {
    id: "topbar-colors",
    type: "page",
    label: "Colors",
    description: "Color palette and token reference",
    value: "Colors",
    destination: { page: "colors" },
  },
  {
    id: "topbar-docs-getting-started",
    type: "group",
    label: "Getting set up",
    description: "Docs / Getting started",
    value: "Getting set up",
    filter: navFilter("docs-getting-started-setup"),
  },
]
