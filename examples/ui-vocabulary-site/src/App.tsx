import { useMemo, useState } from "react"
import {
  BellDot,
  BookOpen,
  ChevronDown,
  Download,
  FileText,
  Keyboard,
  LayoutPanelTop,
  MousePointerClick,
  Search,
  TableProperties,
  ToggleLeft,
  X,
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TermCard } from "@/components/term-card"
import { TermDetail } from "@/components/term-detail"
import { categories, terms, type TermCategory, type VocabularyTerm } from "@/data/terms.generated"
import { categoryGroupsByCategory, categoryLabels, matchesFilter, searchTerms, type TermFilter } from "@/lib/search"
import { cn } from "@/lib/utils"

function App() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<TermFilter>("all")
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [selectedTerm, setSelectedTerm] = useState<VocabularyTerm | null>(terms[0] ?? null)
  const [detailOpen, setDetailOpen] = useState(false)

  const filteredTerms = useMemo(() => searchTerms(terms, query, filter), [query, filter])
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

  function selectTerm(term: VocabularyTerm) {
    setSelectedTerm(term)
    setDetailOpen(true)
  }

  function saveAsPdf() {
    window.print()
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
                      이름과 생김새로 찾는 UI 컴포넌트 레퍼런스
                    </p>
                  </div>
                </div>

                <div className="relative" data-print-hidden>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-11 pl-9 pr-10"
                    placeholder="토글, 모달, icon..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query && (
                    <Button
                      aria-label="검색어 지우기"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setQuery("")}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 xl:justify-end" data-print-hidden>
                  <Badge variant="secondary" className="rounded-md px-3 py-1 text-sm">
                    {filteredTerms.length} / {terms.length} terms
                  </Badge>
                  <div className="inline-flex overflow-hidden rounded-md border bg-card shadow-sm">
                    <Button className="h-9 rounded-none border-0" size="sm" variant="ghost" onClick={saveAsPdf}>
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
                        <DropdownMenuItem onClick={saveAsPdf}>
                          <FileText aria-hidden="true" />
                          현재 필터 결과 저장
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setQuery(""); setFilter("all"); window.setTimeout(saveAsPdf, 0) }}>
                          <Download aria-hidden="true" />
                          전체 용어 저장
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

          <section className="flex flex-col gap-8 px-5 py-8 md:px-8 lg:px-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground">UI Vocabulary Encyclopedia</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                바이브코딩과 UI/UX 설계에서 자주 쓰는 화면 요소의 이름, 쓰임새, 생김새를 한곳에서 확인합니다.
              </p>
            </div>

            <Separator />

            {filteredTerms.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-print-grid>
                {filteredTerms.map((term, index) => (
                  <TermCard
                    key={term.id}
                    index={index}
                    selected={selectedTerm?.id === term.id}
                    term={term}
                    onSelect={selectTerm}
                  />
                ))}
              </section>
            ) : (
              <section className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border bg-card p-8 text-center">
                <p className="text-lg font-semibold">검색 결과가 없습니다.</p>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  한국어 이름, 영어 이름, alias, 설명, 프롬프트 문장을 모두 검색합니다. 예: 토글, modal, dropdown.
                </p>
                <Button variant="outline" onClick={() => { setQuery(""); setFilter("all") }}>
                  전체 용어 보기
                </Button>
              </section>
            )}
          </section>
        </div>
      </div>

      <TermDetail open={detailOpen} term={selectedTerm} onOpenChange={setDetailOpen} />
    </main>
  )
}

type CategoryButtonProps = {
  active: boolean
  count: number
  icon?: LucideIcon
  label: string
  onClick: () => void
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
