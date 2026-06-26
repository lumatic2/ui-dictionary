import { useEffect, useMemo, useRef, useState } from "react"
import {
  BellDot,
  BookOpen,
  ChevronDown,
  Download,
  FileText,
  Keyboard,
  LayoutPanelTop,
  MousePointerClick,
  TableProperties,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PosterView } from "@/components/poster-view"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import { Separator } from "@/components/ui/separator"
import { TermCard } from "@/components/term-card"
import { TermDetail } from "@/components/term-detail"
import { categories, terms, type TermCategory, type VocabularyTerm } from "@/data/terms.generated"
import { categoryGroups, categoryGroupsByCategory, categoryLabels, isTermCategory, matchesFilter, searchTerms, type TermFilter } from "@/lib/search"
import { getStarterQueries } from "@/lib/search-suggestions"
import { cn } from "@/lib/utils"

type PrintMode = "screen" | "current" | "all" | "poster"
type RestorePrintState = {
  filter: TermFilter
  query: string
} | null

function App() {
  const initialSearchState = useMemo(getInitialSearchState, [])
  const [query, setQuery] = useState(initialSearchState.query)
  const [filter, setFilter] = useState<TermFilter>(initialSearchState.filter)
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [selectedTerm, setSelectedTerm] = useState<VocabularyTerm | null>(terms[0] ?? null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [printMode, setPrintMode] = useState<PrintMode>("screen")
  const [printScopeLabel, setPrintScopeLabel] = useState("전체 용어")
  const restoreAfterPrintRef = useRef<RestorePrintState>(null)
  const cleanupTimerRef = useRef<number | null>(null)

  const searchResults = useMemo(() => searchTerms(terms, query, filter), [query, filter])
  const filteredTerms = useMemo(() => searchResults.map((result) => result.term), [searchResults])
  const starterSuggestions = useMemo(() => getStarterQueries(), [])
  const hasActiveSearch = query.trim().length > 0 || filter !== "all"
  const categoryCounts = useMemo(
    () =>
      categories.map((item) => ({
        category: item,
        count: terms.filter((term) => term.category === item).length,
        groups: categoryGroupsByCategory[item].map((group) => ({
          ...group,
          count: terms.filter((term) => matchesFilter(term, group.id)).length,
        })),
      })),
    []
  )

  function cleanupPrintState() {
    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current)
      cleanupTimerRef.current = null
    }

    const restoreState = restoreAfterPrintRef.current
    restoreAfterPrintRef.current = null

    if (restoreState) {
      setQuery(restoreState.query)
      setFilter(restoreState.filter)
    }

    setPrintMode("screen")
  }

  useEffect(() => {
    window.addEventListener("afterprint", cleanupPrintState)

    return () => {
      window.removeEventListener("afterprint", cleanupPrintState)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }

    if (filter !== "all") {
      params.set("filter", filter)
    } else {
      params.delete("filter")
    }

    const nextSearch = params.toString()
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`
    window.history.replaceState(null, "", nextUrl)
  }, [filter, query])

  function selectTerm(term: VocabularyTerm) {
    setSelectedTerm(term)
    setDetailOpen(true)
  }

  function schedulePrint() {
    window.setTimeout(() => {
      window.print()
      cleanupTimerRef.current = window.setTimeout(cleanupPrintState, 500)
    }, 50)
  }

  function saveCurrentAsPdf() {
    restoreAfterPrintRef.current = null
    setPrintMode("current")
    setPrintScopeLabel(getExportScopeLabel(filter, query))
    schedulePrint()
  }

  function saveAllAsPdf() {
    restoreAfterPrintRef.current = { filter, query }
    setQuery("")
    setFilter("all")
    setPrintMode("all")
    setPrintScopeLabel("전체 용어")
    schedulePrint()
  }

  function savePosterAsPdf() {
    restoreAfterPrintRef.current = null
    setPrintMode("poster")
    setPrintScopeLabel(getExportScopeLabel(filter, query))
    schedulePrint()
  }

  const categoryNav = (
    <div className="flex flex-col gap-3">
      <CategoryButton
        active={filter === "all"}
        count={terms.length}
        icon={BookOpen}
        label="전체"
        onClick={() => setFilter("all")}
      />
      <Accordion className="flex flex-col gap-1" onValueChange={setOpenCategories} type="multiple" value={openCategories}>
        {categoryCounts.map((item) => (
          <AccordionItem key={item.category} className="border-0" value={item.category}>
            <AccordionTrigger
              className={cn(
                "rounded-lg px-3 py-2 text-sm hover:bg-muted hover:no-underline",
                filter === item.category && "bg-secondary text-primary"
              )}
              onClick={() => setFilter(item.category)}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <CategoryIcon category={item.category} />
                <span className="min-w-0 flex-1 truncate">{categoryLabels[item.category]}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{item.count}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1 pb-2 pl-8">
              {item.groups.map((group) => (
                <CategoryButton
                  key={group.id}
                  active={filter === group.id}
                  count={group.count}
                  label={group.label}
                  onClick={() => setFilter(group.id)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh overflow-y-auto border-r bg-background px-4 py-6 lg:block" data-print-hidden>
          <nav aria-label="카테고리" className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Navigation</p>
              <h2 className="mt-1 text-lg font-semibold">카테고리</h2>
            </div>
            {categoryNav}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-5 py-4 md:px-8 lg:px-10">
              <div className="grid gap-4 xl:grid-cols-[minmax(240px,320px)_minmax(280px,1fr)_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BookOpen aria-hidden="true" className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-semibold tracking-normal text-foreground">UI 용어 사전</h1>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      UI 컴포넌트 레퍼런스
                    </p>
                  </div>
                </div>

                <div data-print-hidden>
                  <SearchAutocomplete
                    filter={filter}
                    query={query}
                    terms={terms}
                    onFilterChange={setFilter}
                    onQueryChange={setQuery}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 xl:justify-end" data-print-hidden>
                  <Badge variant="secondary" className="rounded-md px-3 py-1 text-sm">
                    {filteredTerms.length} / {terms.length} terms
                  </Badge>
                  <div className="inline-flex overflow-hidden rounded-md border bg-card shadow-sm">
                    <Button className="h-9 rounded-none border-0" size="sm" variant="ghost" onClick={saveCurrentAsPdf}>
                      <Download aria-hidden="true" />
                      PDF로 저장
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-label="PDF 저장 옵션" className="h-9 rounded-none border-0 border-l" size="icon-sm" variant="ghost">
                          <ChevronDown aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={saveCurrentAsPdf}>
                          <FileText aria-hidden="true" />
                          현재 필터 결과 저장
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={saveAllAsPdf}>
                          <Download aria-hidden="true" />
                          전체 용어 저장
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={savePosterAsPdf}>
                          <FileText aria-hidden="true" />
                          포스터로 저장
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto lg:hidden" data-print-hidden>
                {categoryNav}
              </div>
            </div>
          </header>

          <section className="flex flex-col gap-8 px-5 py-8 md:px-8 lg:px-10" data-export-root data-print-mode={printMode}>
            <div data-print-hidden>
              <p className="text-sm font-medium text-muted-foreground">UI Vocabulary Encyclopedia</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                바이브코딩과 UI/UX 설계에서 자주 쓰는 화면 요소의 이름, 쓰임새, 생김새를 한곳에서 확인합니다.
              </p>
            </div>

            <div className="hidden" data-print-summary>
              <p>UI 용어 사전</p>
              <h2>{printScopeLabel}</h2>
              <span>{filteredTerms.length} / {terms.length} terms</span>
            </div>

            <Separator data-print-hidden />

            {hasActiveSearch && (
              <section
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between"
                data-print-hidden
                data-search-summary
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">현재 탐색</span>
                  {query.trim() && (
                    <Badge variant="secondary" className="rounded-md">
                      검색어: {query.trim()}
                    </Badge>
                  )}
                  {filter !== "all" && (
                    <Badge variant="outline" className="rounded-md">
                      필터: {getFilterLabel(filter)}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">{filteredTerms.length}개 결과</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {query.trim() && (
                    <Button size="sm" variant="outline" onClick={() => setQuery("")}>
                      검색어 지우기
                    </Button>
                  )}
                  {filter !== "all" && (
                    <Button size="sm" variant="outline" onClick={() => setFilter("all")}>
                      필터 해제
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { setQuery(""); setFilter("all") }}>
                    전체 초기화
                  </Button>
                </div>
              </section>
            )}

            {filteredTerms.length > 0 && printMode === "poster" ? (
              <PosterView scopeLabel={printScopeLabel} terms={filteredTerms} totalCount={terms.length} />
            ) : filteredTerms.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-print-grid>
                {searchResults.map((result, index) => (
                  <TermCard
                    key={result.term.id}
                    index={index}
                    matchReasons={query ? result.reasons : []}
                    selected={selectedTerm?.id === result.term.id}
                    term={result.term}
                    onSelect={selectTerm}
                  />
                ))}
              </section>
            ) : (
              <EmptySearchRecovery
                categoryCounts={categoryCounts}
                filter={filter}
                query={query}
                starters={starterSuggestions}
                onFilterChange={setFilter}
                onQueryChange={setQuery}
              />
            )}
          </section>
        </div>
      </div>

      <TermDetail open={detailOpen} term={selectedTerm} onOpenChange={setDetailOpen} />
    </main>
  )
}

function getExportScopeLabel(filter: TermFilter, query: string) {
  const trimmedQuery = query.trim()
  const filterLabel = getFilterLabel(filter)

  if (!trimmedQuery) {
    return filterLabel
  }

  return `${filterLabel} · 검색: ${trimmedQuery}`
}

function getFilterLabel(filter: TermFilter) {
  if (filter === "all") {
    return "전체 용어"
  }

  if (isTermCategory(filter)) {
    return categoryLabels[filter]
  }

  return categoryGroups.find((group) => group.id === filter)?.label ?? "현재 필터"
}

function getInitialSearchState() {
  if (typeof window === "undefined") {
    return { filter: "all" as TermFilter, query: "" }
  }

  const params = new URLSearchParams(window.location.search)
  const query = params.get("q") ?? ""
  const filter = parseFilterParam(params.get("filter"))

  return { filter, query }
}

function parseFilterParam(value: string | null): TermFilter {
  if (!value || value === "all") {
    return "all"
  }
  if (isTermCategory(value as TermFilter)) {
    return value as TermFilter
  }
  if (categoryGroups.some((group) => group.id === value)) {
    return value as TermFilter
  }

  return "all"
}

type CategoryButtonProps = {
  active: boolean
  count: number
  icon?: LucideIcon
  label: string
  onClick: () => void
}

type EmptySearchRecoveryProps = {
  categoryCounts: Array<{
    category: TermCategory
    count: number
  }>
  filter: TermFilter
  query: string
  starters: ReturnType<typeof getStarterQueries>
  onFilterChange: (filter: TermFilter) => void
  onQueryChange: (query: string) => void
}

function EmptySearchRecovery({
  categoryCounts,
  filter,
  query,
  starters,
  onFilterChange,
  onQueryChange,
}: EmptySearchRecoveryProps) {
  return (
    <section className="flex min-h-64 flex-col gap-5 rounded-lg border bg-card p-6" data-empty-recovery>
      <div className="text-center">
        <p className="text-lg font-semibold">검색 결과가 없습니다.</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          검색어와 필터가 함께 적용되어 결과가 좁아졌을 수 있습니다. 아래에서 검색어만 지우거나, 필터만 해제하거나, 다른 탐색 문장으로 이어갈 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {query.trim() && (
          <Button size="sm" variant="outline" onClick={() => onQueryChange("")}>
            검색어만 지우기
          </Button>
        )}
        {filter !== "all" && (
          <Button size="sm" variant="outline" onClick={() => onFilterChange("all")}>
            필터만 해제
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => { onQueryChange(""); onFilterChange("all") }}>
          전체 용어 보기
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">이런 말로 다시 찾아보기</h2>
          <div className="flex flex-wrap gap-2">
            {starters.map((starter) => (
              <Button key={starter.id} size="sm" variant="secondary" onClick={() => onQueryChange(starter.value)}>
                {starter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">대분류로 넓혀보기</h2>
          <div className="flex flex-wrap gap-2">
            {categoryCounts.map((item) => (
              <Button key={item.category} size="sm" variant="outline" onClick={() => { onFilterChange(item.category); onQueryChange("") }}>
                {categoryLabels[item.category]} {item.count}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const categoryIcons: Record<TermCategory, LucideIcon> = {
  input: Keyboard,
  selection: ToggleLeft,
  action: MousePointerClick,
  structure: LayoutPanelTop,
  feedback: BellDot,
  "data-display": TableProperties,
}

function CategoryIcon({ category }: { category: TermCategory }) {
  const Icon = categoryIcons[category]

  return <Icon aria-hidden="true" className="size-4 shrink-0" />
}

function CategoryButton({ active, count, icon: Icon, label, onClick }: CategoryButtonProps) {
  return (
    <Button
      className={cn(
        "h-9 shrink-0 justify-between rounded-lg px-3 text-sm font-medium lg:w-full",
        active && "bg-secondary text-primary hover:bg-secondary"
      )}
      variant="ghost"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-3">
        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
        <span className="truncate">{label}</span>
      </span>
      <span className="ml-3 text-xs text-muted-foreground">{count}</span>
    </Button>
  )
}

export default App
