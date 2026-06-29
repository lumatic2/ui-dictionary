import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import { categories, kinds, terms, type TermCategory, type TermKind, type VocabularyTerm } from "@/data/terms.generated"
import { categoryGroups, categoryGroupsByCategory, categoryLabels, getTermKindCategoryFromFilter, getTermKindFromFilter, getTermKindGroupFromFilter, isTermCategory, isTermKindCategoryFilter, isTermKindFilter, isTermKindGroupFilter, kindLabels, matchesFilter, searchTerms, type SearchResult, type TermFilter, type TermGroupId } from "@/lib/search"
import { getStarterQueries } from "@/lib/search-suggestions"
import { useCases } from "@/lib/term-ux"
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
  const [openExploreSections, setOpenExploreSections] = useState<string[]>(["kind"])
  const [openKinds, setOpenKinds] = useState<string[]>(["component"])
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [selectedTerm, setSelectedTerm] = useState<VocabularyTerm | null>(terms[0] ?? null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [printMode, setPrintMode] = useState<PrintMode>("screen")
  const [printScopeLabel, setPrintScopeLabel] = useState("전체 용어")
  const [activeUseCaseId, setActiveUseCaseId] = useState<string | null>(null)
  const restoreAfterPrintRef = useRef<RestorePrintState>(null)
  const cleanupTimerRef = useRef<number | null>(null)
  const activeUseCase = useMemo(() => useCases.find((item) => item.id === activeUseCaseId) ?? null, [activeUseCaseId])
  const baseSearchResults = useMemo(() => searchTerms(terms, query, filter), [query, filter])
  const searchResults = useMemo(
    () => applyUseCaseResults(baseSearchResults, activeUseCase),
    [activeUseCase, baseSearchResults]
  )
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
  const kindCounts = useMemo(
    () =>
      kinds.map((kind) => ({
        kind,
        count: terms.filter((term) => term.kind === kind).length,
        categories: categories.map((category) => ({
          category,
          count: terms.filter((term) => matchesFilter(term, kindCategoryFilter(kind, category))).length,
          groups: categoryGroupsByCategory[category].map((group) => ({
            ...group,
            count: terms.filter((term) => matchesFilter(term, kindGroupFilter(kind, group.id))).length,
          })).filter((group) => group.count > 0),
        })).filter((category) => category.count > 0),
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
    const timer = window.setTimeout(() => {
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
    }, 500)

    return () => window.clearTimeout(timer)
  }, [filter, query])

  const selectTerm = useCallback((term: VocabularyTerm) => {
    setSelectedTerm(term)
    setDetailOpen(true)
  }, [])

  function updateQuery(nextQuery: string) {
    setActiveUseCaseId(null)
    setQuery(nextQuery)
  }

  function updateFilter(nextFilter: TermFilter) {
    setActiveUseCaseId(null)
    setFilter(nextFilter)
  }

  function updateNavFilter(nextFilter: TermFilter) {
    setActiveUseCaseId(null)
    setQuery("")
    setFilter(nextFilter)
  }

  function selectUseCase(queryValue: string) {
    const useCase = useCases.find((item) => item.query === queryValue)
    setActiveUseCaseId(useCase?.id ?? null)
    setQuery(queryValue)
    setFilter("all")
    setOpenExploreSections((current) => current.includes("use-case") ? current : [...current, "use-case"])
    setDetailOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goHome() {
    setQuery("")
    setFilter("all")
    setActiveUseCaseId(null)
    setOpenExploreSections(["kind"])
    setOpenKinds(["component"])
    setOpenCategories([])
    setSelectedTerm(terms[0] ?? null)
    setDetailOpen(false)
    window.history.replaceState(null, "", window.location.pathname)
    window.scrollTo({ top: 0, behavior: "smooth" })
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

  const exploreNav = (
    <div className="flex flex-col gap-3">
      <CategoryButton
        active={filter === "all"}
        count={terms.length}
        icon={BookOpen}
        label="전체"
        onClick={() => updateNavFilter("all")}
      />
      <Accordion className="flex flex-col gap-1" onValueChange={setOpenExploreSections} type="multiple" value={openExploreSections}>
        <AccordionItem className="border-0" value="kind">
          <AccordionTrigger className="rounded-lg px-3 py-2 text-sm hover:bg-muted hover:no-underline">
            형태
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <Accordion className="flex flex-col gap-1" onValueChange={setOpenKinds} type="multiple" value={openKinds}>
            {kindCounts.map((item) => (
              <AccordionItem key={item.kind} className="border-0" value={item.kind}>
                <AccordionTrigger
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm hover:bg-muted hover:no-underline",
                    filter === `kind:${item.kind}` && "bg-secondary text-primary"
                  )}
                  onClick={() => updateNavFilter(`kind:${item.kind}`)}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="min-w-0 flex-1 truncate">{kindLabels[item.kind]}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.count}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pb-2 pl-4">
                  {item.kind === "component" ? (
                    <Accordion className="flex flex-col gap-1" onValueChange={setOpenCategories} type="multiple" value={openCategories}>
                      {item.categories.map((categoryItem) => (
                        <AccordionItem key={categoryItem.category} className="border-0" value={categoryItem.category}>
                          <AccordionTrigger
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm hover:bg-muted hover:no-underline",
                              filter === kindCategoryFilter(item.kind, categoryItem.category) && "bg-secondary text-primary"
                            )}
                            onClick={() => updateNavFilter(kindCategoryFilter(item.kind, categoryItem.category))}
                          >
                            <span className="flex min-w-0 flex-1 items-center gap-3">
                              <CategoryIcon category={categoryItem.category} />
                              <span className="min-w-0 flex-1 truncate">{categoryLabels[categoryItem.category]}</span>
                              <span className="shrink-0 text-xs text-muted-foreground">{categoryItem.count}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-1 pb-2 pl-8">
                            {categoryItem.groups.map((group) => (
                              <CategoryButton
                                key={group.id}
                                active={filter === kindGroupFilter(item.kind, group.id)}
                                count={group.count}
                                label={group.label}
                                onClick={() => updateNavFilter(kindGroupFilter(item.kind, group.id))}
                              />
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    item.categories.map((categoryItem) => (
                      <CategoryButton
                        key={categoryItem.category}
                        active={filter === kindCategoryFilter(item.kind, categoryItem.category)}
                        count={categoryItem.count}
                        icon={categoryIcons[categoryItem.category]}
                        label={categoryLabels[categoryItem.category]}
                        onClick={() => updateNavFilter(kindCategoryFilter(item.kind, categoryItem.category))}
                      />
                    ))
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className="border-0" value="use-case">
          <AccordionTrigger className="rounded-lg px-3 py-2 text-sm hover:bg-muted hover:no-underline">
            상황
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-2">
            {useCases.map((item) => (
              <CategoryButton
                key={item.id}
                active={activeUseCaseId === item.id}
                count={item.termIds.length}
                label={item.label}
                onClick={() => selectUseCase(item.query)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh overflow-y-auto border-r bg-background px-4 py-6 lg:block" data-print-hidden>
          <nav aria-label="탐색" className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Navigation</p>
              <h2 className="mt-1 text-lg font-semibold">탐색</h2>
            </div>
            {exploreNav}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-5 py-4 md:px-8 lg:px-10">
              <div className="grid gap-4 md:grid-cols-[minmax(240px,320px)_auto] md:items-center">
                <button
                  type="button"
                  aria-label="UI 용어 사전 홈으로 이동"
                  className="flex min-w-0 items-start gap-3 rounded-lg text-left outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={goHome}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <img aria-hidden="true" alt="" className="size-6" src="/favicon.svg" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-semibold tracking-normal text-foreground">UI 용어 사전</h1>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      UI 컴포넌트 레퍼런스
                    </p>
                  </div>
                </button>

                <div className="flex items-center justify-between gap-2 md:justify-end" data-print-hidden>
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
                {exploreNav}
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

            <div className="flex flex-col gap-3" data-print-hidden>
              <SearchAutocomplete
                filter={filter}
                query={query}
                terms={terms}
                onFilterChange={updateFilter}
                onQueryChange={updateQuery}
              />

              {hasActiveSearch && (
                <div
                  className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
                  data-search-summary
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground">현재 탐색</span>
                    {query.trim() && <span>검색어: {query.trim()}</span>}
                    {activeUseCase && <span>상황: {activeUseCase.label}</span>}
                    {filter !== "all" && <span>필터: {getFilterLabel(filter)}</span>}
                    <span>{filteredTerms.length}개 결과</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {query.trim() && (
                      <button className="text-sm text-foreground underline-offset-4 hover:underline" type="button" onClick={() => updateQuery("")}>
                        검색어 지우기
                      </button>
                    )}
                    {filter !== "all" && (
                      <button className="text-sm text-foreground underline-offset-4 hover:underline" type="button" onClick={() => updateFilter("all")}>
                        필터 해제
                      </button>
                    )}
                    <button className="text-sm text-foreground underline-offset-4 hover:underline" type="button" onClick={() => { updateQuery(""); updateFilter("all") }}>
                      전체 초기화
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden" data-print-summary>
              <p>UI 용어 사전</p>
              <h2>{printScopeLabel}</h2>
              <span>{filteredTerms.length} / {terms.length} terms</span>
            </div>

            <Separator data-print-hidden />

            {filteredTerms.length > 0 && printMode === "poster" ? (
              <PosterView scopeLabel={printScopeLabel} terms={filteredTerms} totalCount={terms.length} />
            ) : filteredTerms.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-print-grid>
                {searchResults.map((result) => (
                  <TermCard
                    key={result.term.id}
                    matchReasons={query ? result.reasons : undefined}
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
                onFilterChange={updateFilter}
                onQueryChange={updateQuery}
              />
            )}
          </section>
        </div>
      </div>

      <TermDetail
        open={detailOpen}
        term={selectedTerm}
        terms={terms}
        onOpenChange={setDetailOpen}
        onSelectTerm={selectTerm}
      />
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

function applyUseCaseResults(results: SearchResult[], useCase: typeof useCases[number] | null) {
  if (!useCase) {
    return results
  }

  const resultsById = new Map(results.map((result) => [result.term.id, result]))
  const useCaseIds = new Set(useCase.termIds)
  const pinnedResults = useCase.termIds.flatMap((id, index) => {
    const existing = resultsById.get(id)
    if (existing) {
      return [{ ...existing, score: existing.score + 1000 - index }]
    }

    const term = terms.find((item) => item.id === id)
    if (!term) {
      return []
    }

    return [{
      term,
      score: 1000 - index,
      reasons: ["prompt_phrase"] as SearchResult["reasons"],
      matchedText: [useCase.label],
    }]
  })
  const remainingResults = results.filter((result) => !useCaseIds.has(result.term.id))

  return [...pinnedResults, ...remainingResults]
}

function getFilterLabel(filter: TermFilter) {
  if (filter === "all") {
    return "전체 용어"
  }

  if (isTermKindCategoryFilter(filter)) {
    const { kind, category } = getTermKindCategoryFromFilter(filter)
    return `${kindLabels[kind]} · ${categoryLabels[category]}`
  }
  if (isTermKindGroupFilter(filter)) {
    const { kind, groupId } = getTermKindGroupFromFilter(filter)
    const group = categoryGroups.find((item) => item.id === groupId)
    return `${kindLabels[kind]} · ${group?.label ?? "세부 분류"}`
  }
  if (isTermCategory(filter)) {
    return categoryLabels[filter]
  }
  if (isTermKindFilter(filter)) {
    return kindLabels[getTermKindFromFilter(filter)]
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
  if (isTermKindFilter(value)) {
    return value
  }
  if (isTermKindCategoryFilter(value)) {
    return value
  }
  if (isTermKindGroupFilter(value)) {
    return value
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

function kindCategoryFilter(kind: TermKind, category: TermCategory): TermFilter {
  return `kind:${kind}:category:${category}`
}

function kindGroupFilter(kind: TermKind, groupId: TermGroupId): TermFilter {
  return `kind:${kind}:group:${groupId}`
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
