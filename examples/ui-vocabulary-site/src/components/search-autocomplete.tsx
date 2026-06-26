import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Search, X } from "lucide-react"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import type { VocabularyTerm } from "@/data/terms.generated"
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/search-suggestions"
import type { TermFilter } from "@/lib/search"
import { cn } from "@/lib/utils"

type SearchAutocompleteProps = {
  filter: TermFilter
  query: string
  terms: VocabularyTerm[]
  onFilterChange: (filter: TermFilter) => void
  onQueryChange: (query: string) => void
}

export function SearchAutocomplete({
  filter,
  query,
  terms,
  onFilterChange,
  onQueryChange,
}: SearchAutocompleteProps) {
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [draftQuery, setDraftQuery] = useState(query)
  const suggestions = useMemo(() => getSearchSuggestions(terms, draftQuery, filter), [draftQuery, filter, terms])
  const open = focused && suggestions.length > 0

  useEffect(() => {
    setDraftQuery(query)
  }, [query])

  useEffect(() => {
    if (draftQuery === query) {
      return
    }

    const timer = window.setTimeout(() => onQueryChange(draftQuery), 180)
    return () => window.clearTimeout(timer)
  }, [draftQuery, onQueryChange, query])

  function selectSuggestion(suggestion: SearchSuggestion) {
    if (suggestion.type === "category" || suggestion.type === "group") {
      onFilterChange(suggestion.filter)
      setDraftQuery("")
      onQueryChange("")
    } else {
      setDraftQuery(suggestion.value)
      onQueryChange(suggestion.value)
    }
    setFocused(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
    }
    if (event.key === "Enter") {
      event.preventDefault()
      selectSuggestion(suggestions[Math.max(activeIndex, 0)])
    }
    if (event.key === "Escape") {
      setFocused(false)
    }
  }

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-autocomplete="list"
            aria-expanded={open}
            autoComplete="off"
            className="h-11 pl-9 pr-10"
            placeholder="토글, 모달, icon..."
            value={draftQuery}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onChange={(event) => {
              setDraftQuery(event.target.value)
              setActiveIndex(-1)
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {draftQuery && (
            <Button
              aria-label="검색어 지우기"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setDraftQuery("")
                onQueryChange("")
              }}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-[min(var(--radix-popover-trigger-width),calc(100vw-2rem))] p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-80">
            <CommandGroup heading={draftQuery ? "추천 결과" : "이렇게 찾아보세요"}>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={suggestion.id}
                  className={cn("items-start gap-3", activeIndex === index && "bg-accent text-accent-foreground")}
                  value={suggestion.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onSelect={() => selectSuggestion(suggestion)}
                >
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                    {getSuggestionGlyph(suggestion)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{suggestion.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{suggestion.description}</span>
                  </span>
                  <CommandShortcut>
                    <ArrowRight aria-hidden="true" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            {!draftQuery && (
              <>
                <CommandSeparator />
                <CommandGroup heading="팁">
                  <CommandItem disabled>
                    <span className="text-xs text-muted-foreground">
                      정확한 이름 대신 생김새나 목적을 입력해도 됩니다.
                    </span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function getSuggestionGlyph(suggestion: SearchSuggestion) {
  if (suggestion.type === "term") {
    return "T"
  }
  if (suggestion.type === "starter") {
    return "?"
  }
  return "F"
}
