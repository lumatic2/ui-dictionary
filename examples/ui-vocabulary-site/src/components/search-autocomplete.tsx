import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CircleAlert,
  CreditCard,
  GalleryHorizontal,
  Inbox,
  LayoutPanelTop,
  ListChecks,
  ListFilter,
  LoaderCircle,
  Lock,
  MousePointerClick,
  Navigation,
  PanelBottom,
  PanelRight,
  PanelTop,
  PanelsTopLeft,
  PencilLine,
  Rows3,
  Search,
  SlidersHorizontal,
  Sparkles,
  TableProperties,
  ToggleLeft,
  Type,
  Upload,
  UserRound,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react"
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
import type { TermCategory, VocabularyTerm } from "@/data/terms.generated"
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/search-suggestions"
import type { TermFilter, TermGroupId } from "@/lib/search"
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
    if (!query) {
      setDraftQuery("")
    }
  }, [filter, query])

  function commitQuery(value = draftQuery) {
    const nextQuery = value.trim()
    setDraftQuery(nextQuery)
    onQueryChange(nextQuery)
    setFocused(false)
    setActiveIndex(-1)
  }

  function selectSuggestion(suggestion: SearchSuggestion) {
    if (suggestion.type === "category" || suggestion.type === "group") {
      onFilterChange(suggestion.filter)
      setDraftQuery("")
      onQueryChange("")
    } else {
      commitQuery(suggestion.value)
      return
    }
    setFocused(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && event.key !== "Enter") {
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
      if (open && activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex])
      } else {
        commitQuery()
      }
    }
    if (event.key === "Escape") {
      setFocused(false)
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
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
                setFocused(true)
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
                    <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <SuggestionIcon suggestion={suggestion} />
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
      <Button className="h-11 shrink-0" variant="secondary" onClick={() => commitQuery()}>
        <Search aria-hidden="true" data-icon="inline-start" />
        검색
      </Button>
    </div>
  )
}

function SuggestionIcon({ suggestion }: { suggestion: SearchSuggestion }) {
  const Icon = getSuggestionIcon(suggestion)

  return <Icon aria-hidden="true" className="size-4" />
}

function getSuggestionIcon(suggestion: SearchSuggestion): LucideIcon {
  if (suggestion.type === "term") {
    const groupIcon = suggestion.groupId ? groupIcons[suggestion.groupId] : undefined

    return termIconOverrides[suggestion.termId] ?? groupIcon ?? categoryIcons[suggestion.category]
  }
  if (suggestion.type === "category" || suggestion.type === "group") {
    return getFilterIcon(suggestion.filter)
  }

  switch (suggestion.value) {
    case "켜고 끄는":
      return ToggleLeft
    case "옆에서 나오는 창":
      return LayoutPanelTop
    case "표 필터":
      return TableProperties
    case "빈 화면":
      return Inbox
    case "카드 넘기기":
      return GalleryHorizontal
    case "진행 상태":
      return ListChecks
    default:
      return Search
  }
}

function getFilterIcon(filter: TermFilter): LucideIcon {
  if (filter in categoryIcons) {
    return categoryIcons[filter as TermCategory]
  }
  if (filter in groupIcons) {
    return groupIcons[filter as TermGroupId] ?? TableProperties
  }

  return TableProperties
}

const categoryIcons: Record<TermCategory, LucideIcon> = {
  input: Type,
  selection: ToggleLeft,
  action: MousePointerClick,
  structure: LayoutPanelTop,
  feedback: ListChecks,
  "data-display": TableProperties,
}

const groupIcons: Partial<Record<TermGroupId, LucideIcon>> = {
  "input-text": Type,
  "input-search-command": Search,
  "input-pickers": CalendarDays,
  "input-file-media": Upload,
  "input-editing": PencilLine,
  "selection-options": ToggleLeft,
  "selection-navigation": Navigation,
  "selection-menus": PanelsTopLeft,
  "selection-context": CreditCard,
  "action-buttons": MousePointerClick,
  "action-command-bars": SlidersHorizontal,
  "action-bulk-danger": CircleAlert,
  "action-editor-media": GalleryHorizontal,
  "structure-app-layout": PanelTop,
  "structure-panels": PanelRight,
  "structure-navigation": Navigation,
  "structure-sections": LayoutPanelTop,
  "structure-mobile": PanelBottom,
  "feedback-alerts-toasts": Bell,
  "feedback-loading-progress": LoaderCircle,
  "feedback-empty-error": Inbox,
  "feedback-access-limits": Lock,
  "feedback-status-notifications": Activity,
  "data-tables-lists": Rows3,
  "data-cards-content": GalleryHorizontal,
  "data-metrics-charts": BarChart3,
  "data-timeline-history": Activity,
  "data-people-integrations": UserRound,
  "data-commerce-billing": CreditCard,
}

const termIconOverrides: Record<string, LucideIcon> = {
  "bottom-navigation": PanelBottom,
  "bottom-cta-bar": PanelBottom,
  "cart-summary-bar": PanelBottom,
  "tab-bar": Navigation,
  "mobile-segmented-tabs": ToggleLeft,
  "page-control": ListChecks,
  "edge-swipe-back": Navigation,
  "responsive-mobile": PanelBottom,
  "bottom-app-bar": PanelBottom,
  "floating-search-button": Search,
  "filter-bar": SlidersHorizontal,
  "filter-panel": SlidersHorizontal,
  "faceted-filter": ListFilter,
  "empty-state": Inbox,
  "empty-search-result": Inbox,
  "empty-table": Inbox,
  "progress-bar": LoaderCircle,
  stepper: ListChecks,
  "setup-progress": ListChecks,
  "visual-effect": Sparkles,
  "motion-pattern": WandSparkles,
}
