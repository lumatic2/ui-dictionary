import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router"
import {
  BellDot,
  BookOpen,
  Archive,
  ChevronDown,
  CircleAlert,
  CheckCircle2,
  Clipboard,
  CloudUpload,
  Copy,
  Edit3,
  Focus,
  Info,
  LayoutPanelTop,
  Monitor,
  Moon,
  MoreVertical,
  Move,
  MousePointerClick,
  Palette,
  Ruler,
  Search,
  Shapes,
  ShoppingCart,
  Sparkles,
  Sun,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type HomePageDestination } from "@/components/home-page"
import { recipeCollectionAnchorId, recipeCollectionOrder, type RecipeCollection } from "@/lib/recipe-gallery-data"
import { TermResultRow } from "@/components/term-result-row"
import { TopbarSearch } from "@/components/topbar-search"
import { DocsArticlePage } from "@/components/article-documentation-layout"

// UE5 step-2: 화면 모듈 lazy 분할 — 각 화면이 처음 렌더될 때만 청크를 로드한다.
const HomePage = lazy(() => import("@/components/home-page").then((m) => ({ default: m.HomePage })))
const ColorsPage = lazy(() => import("@/components/colors-page").then((m) => ({ default: m.ColorsPage })))
const RecipeGallery = lazy(() => import("@/components/recipe-gallery").then((m) => ({ default: m.RecipeGallery })))
const TermPage = lazy(() => import("@/components/term-page").then((m) => ({ default: m.TermPage })))

function ScreenFallback() {
  return <div aria-hidden="true" className="min-h-[60svh] w-full animate-pulse rounded-md bg-muted/40" />
}
import { categories, kinds, terms, type TermCategory, type VocabularyTerm } from "@/data/terms.generated"
import { categoryGroups, categoryGroupsByCategory, categoryLabels, isTermCategory, isTermKindCategoryFilter, isTermKindFilter, isTermKindGroupFilter, matchesFilter, searchTerms, type SearchResult, type TermFilter, type TermGroupId } from "@/lib/search"
import { isNavigationFilter, navigationCollections, navFilter, normalizeNavigationFilter } from "@/lib/navigation-model"
import { isNavigationFilterVisible, isShellVisible } from "@/lib/exposure"
import { stateFromUrl, urlFromState } from "@/lib/url-mapping"
import { useSystemPreviewTheme, type PreviewTheme } from "@/lib/preview-theme"
import { slugify, toPascalCase } from "@/lib/strings"
import { isOwnerEmail } from "@/lib/owner"
import { MarketingSectionPreviewLazy, type MarketingPreviewVariant } from "@/components/marketing-section-preview-lazy"
import { docsArticlePages, docsNavGroups, type DocsArticlePageData } from "@/lib/documentation-pages"
import { getStarterQueries } from "@/lib/search-suggestions"
import { useCases } from "@/lib/term-ux"
import { usePageMeta } from "@/lib/page-meta"
import { cn } from "@/lib/utils"

type PageMode = "home" | "docs" | "plus" | "term" | "download" | "pro" | "colors" | "recipes"
type SearchState = {
  filter: TermFilter
  page: PageMode
  query: string
  termId: string | null
  returnPage: Exclude<PageMode, "term">
}
type AuthSessionState = {
  authenticated: boolean
  checked: boolean
  email?: string
}
const AUTH_RETURN_OK_STORAGE_KEY = "askewly-auth-return-ok-at"

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  // 이 컴포넌트가 마지막으로 URL 에 동기화한 값 — 자기 navigate 로 인한 location 변화와
  // 뒤로가기/외부 진입을 구분하는 기준 (자기 것이면 상태 재적용을 건너뛴다).
  const lastSyncedUrlRef = useRef<string | null>(null)
  const initialSearchState = useMemo(getInitialSearchState, [])
  const [pageMode, setPageMode] = useState<PageMode>(initialSearchState.page)
  const [query, setQuery] = useState(initialSearchState.query)
  const [filter, setFilter] = useState<TermFilter>(initialSearchState.filter)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(initialSearchState.termId)
  const [returnPageMode, setReturnPageMode] = useState<Exclude<PageMode, "term">>(initialSearchState.returnPage)
  const [activeUseCaseId, setActiveUseCaseId] = useState<string | null>(null)
  const [activeRecipeCollection, setActiveRecipeCollection] = useState<RecipeCollection | null>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [topbarFeedback, setTopbarFeedback] = useState("")
  const [signInOpen, setSignInOpen] = useState(false)
  const [authSession, setAuthSession] = useState<AuthSessionState>({ authenticated: false, checked: false })
  const [proUnlocked, setProUnlocked] = useState(false)
  // 사이트 전역 테마는 라이트 고정 (2026-07-28 사용자 결정 — 다크는 카탈로그 하드코딩 색과 충돌해 가독성 붕괴,
  // 별도 정비 전까지 차단). 데모 카드의 per-example 프리뷰 테마 토글은 콘텐츠 기능이라 유지.
  useEffect(() => {
    document.documentElement.classList.remove("dark")
    window.localStorage.removeItem("askewly-theme")
  }, [])
  const activeUseCase = useMemo(() => useCases.find((item) => item.id === activeUseCaseId) ?? null, [activeUseCaseId])
  const selectedTerm = useMemo(() => terms.find((term) => term.id === selectedTermId) ?? null, [selectedTermId])
  const baseSearchResults = useMemo(() => searchTerms(terms, query, filter), [query, filter])
  const searchResults = useMemo(
    () => applyUseCaseResults(baseSearchResults, activeUseCase),
    [activeUseCase, baseSearchResults]
  )
  const filteredTerms = useMemo(() => searchResults.map((result) => result.term), [searchResults])
  const isPlusLanding = pageMode === "plus" && filter === navFilter("plus-all") && query.trim().length === 0 && !activeUseCase
  const isDocsLanding = pageMode === "docs" && filter === navFilter("docs-all") && query.trim().length === 0 && !activeUseCase
  const docsArticlePageCandidate = pageMode === "docs" && query.trim().length === 0 && !activeUseCase
    ? docsArticlePages.get(filter)
    : undefined
  const docsArticlePage = docsArticlePageCandidate && !isShellVisible(docsArticlePageCandidate.shell) ? undefined : docsArticlePageCandidate
  const activeDocsSection = useMemo(
    () => pageMode === "docs" && !isDocsLanding && !docsArticlePage ? docsSections.find((section) => section.filter === filter) ?? null : null,
    [docsArticlePage, filter, isDocsLanding, pageMode]
  )
  const marketingSectionPage = pageMode === "plus" && query.trim().length === 0 && !activeUseCase
    ? marketingSectionPages.get(filter)
    : undefined
  usePageMeta({
    page: pageMode,
    sectionTitle:
      pageMode === "term"
        ? selectedTerm?.ko.name ?? null
        : docsArticlePage?.title ?? marketingSectionPage?.title ?? null,
    description:
      pageMode === "term"
        ? null
        : docsArticlePage?.lead ?? marketingSectionPage?.description ?? null,
  })
  const visibleSearchResults = useMemo(() => {
    if (!isPlusLanding) {
      return searchResults
    }

    const representativeIds = new Set(plusRepresentativeTermIds)
    return searchResults
      .filter((result) => representativeIds.has(result.term.id))
      .sort((left, right) => plusRepresentativeTermIds.indexOf(left.term.id) - plusRepresentativeTermIds.indexOf(right.term.id))
  }, [isPlusLanding, searchResults])
  const starterSuggestions = useMemo(() => getStarterQueries(), [])
  const hasActiveSearch = query.trim().length > 0 || activeUseCase !== null
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
  const filterCounts = useMemo(
    () => new Map<TermFilter, number>([
      ["all", terms.length],
      ...categories.map((category) => [category, terms.filter((term) => matchesFilter(term, category)).length] as const),
      ...kinds.map((kind) => [`kind:${kind}` as TermFilter, terms.filter((term) => matchesFilter(term, `kind:${kind}`)).length] as const),
      ...categoryGroups.map((group) => [group.id as TermFilter, terms.filter((term) => matchesFilter(term, group.id)).length] as const),
      ...navigationCollections.map((collection) => [navFilter(collection.id), terms.filter((term) => matchesFilter(term, navFilter(collection.id))).length] as const),
    ]),
    []
  )
  useEffect(() => {
    // 라우터가 URL 을 바꿨을 때(뒤로가기·딥링크) 상태를 URL 에서 재구성한다.
    // 자기 자신이 방금 동기화한 URL 이면 건너뛴다 (구 popstate 리스너의 대체).
    const locationUrl = `${location.pathname}${location.search}`
    if (lastSyncedUrlRef.current === locationUrl) {
      return
    }
    const nextState = getInitialSearchState()
    setPageMode(nextState.page)
    setQuery(nextState.query)
    setFilter(nextState.filter)
    setSelectedTermId(nextState.termId)
    setReturnPageMode(nextState.returnPage)
    lastSyncedUrlRef.current = locationUrl
  }, [location])

  const refreshAuthSession = useCallback(async (options: { preserveAuthenticatedOnFailure?: boolean } = {}) => {
    try {
      const response = await fetch(`${getAuthApiOrigin()}/api/auth/session`, { credentials: "include" })

      if (!response.ok) {
        if (!options.preserveAuthenticatedOnFailure && !hasRecentAuthReturnOk()) {
          setAuthSession({ authenticated: false, checked: true })
        }
        return
      }

      const payload = await response.json() as { authenticated?: boolean; email?: string }
      setAuthSession({
        authenticated: payload.authenticated === true,
        checked: true,
        email: payload.email,
      })
    } catch {
      if (!options.preserveAuthenticatedOnFailure && !hasRecentAuthReturnOk()) {
        setAuthSession({ authenticated: false, checked: true })
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!authSession.authenticated || !authSession.email) {
      setProUnlocked(false)
      return
    }
    void isOwnerEmail(authSession.email).then((owner) => {
      if (!cancelled) setProUnlocked(owner)
    })
    return () => { cancelled = true }
  }, [authSession.authenticated, authSession.email])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("auth") === "ok") {
      return
    }

    const preserveAuthenticatedOnFailure = hasRecentAuthReturnOk()
    if (preserveAuthenticatedOnFailure) {
      setAuthSession((current) => ({ ...current, authenticated: true, checked: true }))
    }

    void refreshAuthSession({ preserveAuthenticatedOnFailure })
  }, [refreshAuthSession])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authResult = params.get("auth")

    if (!authResult) {
      return
    }

    if (authResult === "ok") {
      markAuthReturnOk()
      setTopbarFeedback("")
      setAuthSession((current) => ({ ...current, authenticated: true, checked: true }))
      void refreshAuthSession({ preserveAuthenticatedOnFailure: true })
    } else if (authResult === "pending") {
      setTopbarFeedback("Access pending")
    } else if (authResult === "rejected") {
      setTopbarFeedback("Access rejected")
    } else {
      setTopbarFeedback("Sign in failed")
    }

    params.delete("auth")
    params.delete("reason")
    const nextSearch = params.toString()
    const cleanedUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`
    lastSyncedUrlRef.current = cleanedUrl
    void navigate(cleanedUrl, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAuthSession])

  useEffect(() => {
    function openSearchFromShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      if (isEditable) {
        return
      }

      const modifierPressed = event.ctrlKey || event.metaKey
      if (!modifierPressed || (event.key.toLowerCase() !== "f" && event.key.toLowerCase() !== "k")) {
        return
      }

      event.preventDefault()
      setSearchExpanded(true)
    }

    window.addEventListener("keydown", openSearchFromShortcut)

    return () => {
      window.removeEventListener("keydown", openSearchFromShortcut)
    }
  }, [])

  useEffect(() => {
    // 상태 → URL 동기화 (디바운스, replace) — 검색어 타이핑 등 제자리 갱신용.
    // 히스토리 엔트리를 만드는 페이지 이동은 각 내비 함수의 navigateToUrl(push)이 담당한다.
    const timer = window.setTimeout(() => {
      const extraParams = new URLSearchParams(window.location.search)
      const nextUrl = urlFromState({ page: pageMode, filter, query, termId: selectedTermId }, extraParams)
      const currentUrl = `${window.location.pathname}${window.location.search}`
      if (nextUrl !== currentUrl) {
        lastSyncedUrlRef.current = nextUrl
        void navigate(nextUrl, { replace: true })
      } else {
        lastSyncedUrlRef.current = nextUrl
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [filter, pageMode, query, selectedTermId, navigate])

  // 히스토리 엔트리를 만드는 페이지 단위 이동 — location 동기화 효과가 자기 URL 로
  // 인식하도록 ref 를 먼저 기록한다.
  const navigateToUrl = useCallback((targetUrl: string) => {
    lastSyncedUrlRef.current = targetUrl
    void navigate(targetUrl)
  }, [navigate])

  const selectTerm = useCallback((term: VocabularyTerm) => {
    setReturnPageMode((current) => (pageMode === "term" ? current : pageMode))
    setSelectedTermId(term.id)
    setPageMode("term")
    setActiveUseCaseId(null)
    navigateToUrl(urlFromState({ page: "term", filter: "all", query: "", termId: term.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pageMode, navigateToUrl])

  const navigateToNavigationPath = useCallback((path: string[]) => {
    const collection = navigationCollections.find((item) => pathsEqual(item.path, path))
    if (!collection) {
      console.warn(`navigation: no collection matches path "${path.join(" / ")}" — check navigationCollections`)
      return
    }

    const nextFilter = navFilter(collection.id)
    const nextPage = collection.id.startsWith("docs-") ? "docs" : "plus"
    setPageMode(nextPage)
    setReturnPageMode(nextPage)
    setSelectedTermId(null)
    setActiveUseCaseId(null)
    setQuery("")
    setFilter(nextFilter)
    navigateToUrl(urlFromState({ page: nextPage, filter: nextFilter, query: "", termId: null }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [navigateToUrl])

  function updateQuery(nextQuery: string) {
    setActiveUseCaseId(null)
    setQuery(nextQuery)

    const isNoExploreLayout = pageMode === "home" || pageMode === "download" || pageMode === "pro" || pageMode === "colors" || pageMode === "recipes"
    if (nextQuery.trim().length > 0 && isNoExploreLayout) {
      const nextPage: PageMode = isNavigationFilter(filter) && filter.slice("nav:".length).startsWith("docs-") ? "docs" : "plus"
      setPageMode(nextPage)
      setReturnPageMode(nextPage)
      if (!isNavigationFilter(filter)) {
        setFilter(navFilter("plus-all"))
      }
      setSelectedTermId(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function updateFilter(nextFilter: TermFilter) {
    setActiveUseCaseId(null)
    setFilter(nextFilter)
    if (isNavigationFilter(nextFilter)) {
      const collectionId = nextFilter.slice("nav:".length)
      const nextPage = collectionId.startsWith("docs-") ? "docs" : "plus"
      setPageMode(nextPage)
      setReturnPageMode(nextPage)
      setSelectedTermId(null)
      setQuery("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function updateNavFilter(nextFilter: TermFilter) {
    setActiveUseCaseId(null)
    setQuery("")
    setFilter(nextFilter)
    setSearchExpanded(false)
    if (isNavigationFilter(nextFilter)) {
      const collectionId = nextFilter.slice("nav:".length)
      const nextPage = collectionId.startsWith("docs-") ? "docs" : "plus"
      setPageMode(nextPage)
      setReturnPageMode(nextPage)
      setSelectedTermId(null)
      navigateToUrl(urlFromState({ page: nextPage, filter: nextFilter, query: "", termId: null }))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function changePage(nextPage: PageMode) {
    if (nextPage === "term") {
      return
    }
    setPageMode(nextPage)
    setReturnPageMode(nextPage)
    setSelectedTermId(null)
    setActiveUseCaseId(null)
    setQuery("")
    setSearchExpanded(false)
    let nextFilter: TermFilter
    if (nextPage === "home") {
      nextFilter = navFilter("plus-all")
    } else if (nextPage === "docs") {
      nextFilter = navFilter("docs-getting-started-setup")
    } else if (nextPage === "plus") {
      nextFilter = navFilter("plus-all")
    } else {
      nextFilter = "all"
    }
    setFilter(nextFilter)
    navigateToUrl(urlFromState({ page: nextPage, filter: nextFilter, query: "", termId: null }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goHome() {
    setQuery("")
    setFilter(navFilter("plus-all"))
    setPageMode("home")
    setReturnPageMode("home")
    setActiveUseCaseId(null)
    setSelectedTermId(null)
    setSearchExpanded(false)
    navigateToUrl("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function navigateFromHome(destination: HomePageDestination) {
    if (destination.page === "signin") {
      setSignInOpen(true)
      setTopbarFeedback("")
      return
    }

    setActiveUseCaseId(null)
    setQuery("")
    setSelectedTermId(null)
    setSearchExpanded(false)
    setPageMode(destination.page)
    setReturnPageMode(destination.page)
    const nextFilter = "filter" in destination ? destination.filter : getDefaultFilterForPage(destination.page)
    setFilter(nextFilter)
    navigateToUrl(urlFromState({ page: destination.page, filter: nextFilter, query: "", termId: null }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function signOut() {
    try {
      await fetch(`${getAuthApiOrigin()}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
      })
    } finally {
      clearAuthReturnOk()
      setAuthSession({ authenticated: false, checked: true })
      setTopbarFeedback("")
    }
  }

  function searchFromHome(nextQuery: string) {
    const trimmedQuery = nextQuery.trim()
    if (!trimmedQuery) {
      return
    }

    setActiveUseCaseId(null)
    setSelectedTermId(null)
    setSearchExpanded(false)
    setPageMode("plus")
    setReturnPageMode("plus")
    setFilter("all")
    setQuery(trimmedQuery)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function selectPrimaryAxis(axis: PrimaryAxisId) {
    setActiveUseCaseId(null)
    setQuery("")
    setSelectedTermId(null)
    setSearchExpanded(false)

    if (axis === "documentation") {
      setPageMode("docs")
      setReturnPageMode("docs")
      setFilter(navFilter("docs-getting-started-setup"))
    } else {
      setPageMode("plus")
      setReturnPageMode("plus")
      setFilter(
        axis === "application"
          ? navFilter("plus-application-ui")
          : axis === "ecommerce"
            ? navFilter("plus-ecommerce")
            : navFilter("plus-marketing")
      )
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function selectRecipeCollection(collection: RecipeCollection) {
    setActiveRecipeCollection(collection)
    document.getElementById(recipeCollectionAnchorId(collection))?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const visibleDocsNavGroups = docsNavGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => isShellVisible(item.shell)) }))
    .filter((group) => group.items.length > 0)

  const docsNav = (
    <div className="flex flex-col gap-7">
      {visibleDocsNavGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{group.label}</p>
          <div className="flex flex-col gap-1 border-l">
            {group.items.map((item) => (
              <button
                key={item.filter}
                className={cn(
                  "flex min-h-8 items-center border-l px-3 text-left text-sm text-slate-600 transition hover:text-slate-950",
                  filter === item.filter ? "-ml-px border-slate-950 font-semibold text-slate-950" : "-ml-px border-transparent"
                )}
                type="button"
                onClick={() => updateNavFilter(item.filter)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const visiblePageMode = pageMode === "term" ? returnPageMode : pageMode
  const activeProductSurface = getActiveProductSurface(filter)
  const activePrimaryAxis = getActivePrimaryAxis(visiblePageMode === "home" ? "plus" : visiblePageMode, filter)
  const plusNav = (
    <div className="flex flex-col gap-3">
      {activeProductSurface === "templates" ? (
        <StaticTemplateNavTree
          activeFilter={filter}
          onFilterChange={updateNavFilter}
        />
      ) : activeProductSurface === "ui-kit" ? (
        <StaticUiKitNavTree
          activeFilter={filter}
          onFilterChange={updateNavFilter}
        />
      ) : (
        <StaticUiBlocksNavTree
          activeFilter={filter}
          activeSectionId={activePrimaryAxis}
          onFilterChange={updateNavFilter}
        />
      )}
    </div>
  )

  const siteTopNav: Array<{ label: string; active: boolean; onClick: () => void }> = [
    { label: "Docs", active: pageMode === "docs" && filter === navFilter("docs-getting-started-setup"), onClick: () => navigateFromHome({ page: "docs", filter: "nav:docs-getting-started-setup" }) },
    { label: "Patterns", active: pageMode === "plus" && filter === navFilter("plus-marketing"), onClick: () => navigateFromHome({ page: "plus", filter: "nav:plus-marketing" }) },
    { label: "Colors", active: pageMode === "colors", onClick: () => navigateFromHome({ page: "colors" }) },
    { label: "Recipes", active: pageMode === "recipes", onClick: () => navigateFromHome({ page: "recipes" }) },
    { label: "Pro Plan", active: pageMode === "pro", onClick: () => navigateFromHome({ page: "pro" }) },
  ]
  const noExploreLayout = pageMode === "home" || pageMode === "download" || pageMode === "pro" || pageMode === "colors"

  return (
    <main className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center gap-4 px-4 md:px-6 lg:px-8 2xl:px-10">
              <div className={cn("min-w-0 flex-1 items-center gap-4", searchExpanded ? "hidden md:flex" : "flex")}>
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label="Askewly Design home"
                    className="flex shrink-0 items-center gap-2 rounded-lg text-left outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={goHome}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <img aria-hidden="true" alt="" className="size-4" src="/favicon.svg" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-normal text-foreground md:text-lg">Askewly Design</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2" data-print-hidden>
                <TopbarSearch
                  expanded={searchExpanded}
                  filter={filter}
                  query={query}
                  terms={terms}
                  onExpandedChange={setSearchExpanded}
                  onFilterChange={updateFilter}
                  onQueryChange={updateQuery}
                  onNavigate={navigateFromHome}
                />
                <div className="hidden items-center gap-4 text-sm font-medium text-foreground xl:flex">
                  {siteTopNav.map((item) => (
                    <button
                      key={item.label}
                      className={cn(
                        "transition hover:text-primary",
                        item.active && "text-primary",
                        item.label === "Pro Plan" && "rounded-lg bg-askewly-violet/10 px-3 py-1 font-semibold text-askewly-violet hover:bg-askewly-violet/15 hover:text-[#5f22a8]",
                      )}
                      type="button"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  ))}
                  <span className="h-5 w-px bg-border" aria-hidden="true" />
                  {topbarFeedback && <span className="max-w-40 truncate rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{topbarFeedback}</span>}
                  {authSession.authenticated ? (
                    <button className="max-w-44 truncate transition hover:text-primary active:scale-[0.98]" type="button" title={authSession.email ?? "Signed in"} onClick={() => void signOut()}>
                      Sign out
                    </button>
                  ) : (
                    <Popover open={signInOpen} onOpenChange={(nextOpen) => { setSignInOpen(nextOpen); if (nextOpen) setTopbarFeedback("") }}>
                      <PopoverTrigger asChild>
                        <button className="transition hover:text-primary active:scale-[0.98]" type="button">
                          Sign in
                        </button>
                      </PopoverTrigger>
                      <SignInPopoverContent />
                    </Popover>
                  )}
                </div>
                <button className={cn("size-8 place-items-center rounded-md transition hover:bg-muted active:scale-[0.98] md:hidden", searchExpanded ? "hidden" : "grid")} aria-label="More options" type="button" onClick={() => setTopbarFeedback("More options opened")}>
                  <MoreVertical aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>
            {topbarFeedback && <p className="border-t bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 md:hidden">{topbarFeedback}</p>}

      </header>

      <div className={cn("grid w-full", noExploreLayout ? "lg:grid-cols-1" : "lg:grid-cols-[280px_minmax(0,1fr)]")}>
        <aside className={cn("scrollbar-hidden sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain border-r bg-background px-4 py-6 lg:block", noExploreLayout && "lg:hidden")} data-print-hidden>
          <nav aria-label="탐색" className="flex h-full flex-col gap-5">
            {visiblePageMode === "docs" ? (
              <>
                <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Docs</p>
                {docsNav}
              </>
            ) : visiblePageMode === "recipes" ? (
              <RecipesNav activeCollection={activeRecipeCollection} onSelect={selectRecipeCollection} />
            ) : (
              <>
                <PrimaryAxisNav
                  activeAxis={activePrimaryAxis}
                  onSelect={selectPrimaryAxis}
                  includeDocumentation={false}
                />
                {plusNav}
              </>
            )}
          </nav>
        </aside>

        <div className="min-w-0">

          {pageMode === "home" ? (
            <Suspense fallback={<ScreenFallback />}>
              <HomePage
                filter={filter}
                terms={terms}
                onNavigate={navigateFromHome}
                onSearch={searchFromHome}
              />
            </Suspense>
          ) : pageMode === "download" ? (
            <DownloadPage
              onNavigate={navigateFromHome}
            />
          ) : pageMode === "colors" ? (
            <Suspense fallback={<ScreenFallback />}>
              <ColorsPage
                onNavigate={navigateFromHome}
              />
            </Suspense>
          ) : pageMode === "recipes" ? (
            <Suspense fallback={<ScreenFallback />}>
              <RecipeGallery />
            </Suspense>
          ) : pageMode === "pro" ? (
            <ProPlanPage
              onSignIn={() => setSignInOpen(true)}
            />
          ) : (
          <section className="flex flex-col gap-8 px-5 py-8 md:px-8 md:py-10 lg:px-10 2xl:px-12" data-export-root>
            {hasActiveSearch && (
              <div className="flex flex-col gap-3" data-print-hidden>
                <div
                  className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
                  data-search-summary
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground">검색 중</span>
                    {query.trim() && <span>검색어: {query.trim()}</span>}
                    {activeUseCase && <span>상황: {activeUseCase.label}</span>}
                    <span>{filteredTerms.length}개 결과</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {query.trim() && (
                      <button className="text-sm text-foreground underline-offset-4 hover:underline" type="button" onClick={() => updateQuery("")}>
                        검색어 지우기
                      </button>
                    )}
                    <button className="text-sm text-foreground underline-offset-4 hover:underline" type="button" onClick={() => { updateQuery(""); updateFilter("all") }}>
                      전체 초기화
                    </button>
                  </div>
                </div>
                <Separator />
              </div>
            )}

            {pageMode === "term" && selectedTerm ? (
              <Suspense fallback={<ScreenFallback />}>
                <TermPage
                  term={selectedTerm}
                  terms={terms}
                  onBack={() => changePage(returnPageMode)}
                  onNavigatePath={navigateToNavigationPath}
                  onSelectTerm={selectTerm}
                  proUnlocked={proUnlocked}
                />
              </Suspense>
            ) : pageMode === "term" ? (
              <EmptyTermPage onBack={() => changePage(returnPageMode)} />
            ) : docsArticlePage ? (
              <DocsArticlePage
                page={docsArticlePage}
                relatedTerms={docsArticlePage.kind === "category" ? filteredTerms : filteredTerms.slice(0, 6)}
                onSelectTerm={selectTerm}
              />
            ) : marketingSectionPage ? (
              <MarketingSectionCatalogPage
                page={marketingSectionPage}
                proUnlocked={proUnlocked}
              />
            ) : filteredTerms.length > 0 ? (
              <>
                {isPlusLanding && (
                  <PlusCatalogLanding
                    filterCounts={filterCounts}
                    onFilterChange={updateNavFilter}
                  />
                )}
                {isDocsLanding && (
                  <DocsCatalogLanding
                    filterCounts={filterCounts}
                    onFilterChange={updateNavFilter}
                  />
                )}
                {activeDocsSection && (
                  <DocsSectionPreview
                    section={activeDocsSection}
                    termCount={getFilterCount(filterCounts, activeDocsSection.filter)}
                  />
                )}
                <section className="flex flex-col gap-4" data-print-grid>
                  {isPlusLanding && (
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">Representative Terms</p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-normal">대표 용어</h2>
                    </div>
                  )}
                  <div className="divide-y border-y">
                    {visibleSearchResults.map((result) => (
                      <TermResultRow
                        key={result.term.id}
                        matchReasons={query ? result.reasons : undefined}
                        selected={selectedTerm?.id === result.term.id}
                        term={result.term}
                        onSelect={selectTerm}
                      />
                    ))}
                  </div>
                </section>
              </>
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
          )}
        </div>
      </div>

    </main>
  )
}

const downloadPlatforms = [
  { id: "macos", label: "macOS", description: "Apple Silicon and Intel builds." },
  { id: "windows", label: "Windows", description: "Windows 10 and 11, 64-bit." },
  { id: "other", label: "Other platforms", description: "Linux and browser-based access." },
] as const

function DownloadPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Download</p>
          <h1 className="mt-5 text-5xl font-semibold leading-none tracking-normal text-foreground md:text-7xl">Askewly Design App</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            A desktop app for browsing, generating, and exporting this design system without leaving your canvas.
            Platform installers land here once the app is ready to ship.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {downloadPlatforms.map((platform) => (
            <div key={platform.id} className="flex flex-col gap-4 rounded-md border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{platform.label}</p>
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground/50">
                  <CloudUpload className="size-4" />
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{platform.description}</p>
              <Button className="h-9 rounded-lg" disabled type="button" variant="outline">
                Install — pending
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
          <p className="text-sm font-medium text-foreground">Content pending — fill criteria: source-quality</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Installers publish here once a distributable Askewly Design app exists. Looking for exportable assets
            instead? <button className="font-medium text-foreground underline underline-offset-4" type="button" onClick={() => onNavigate({ page: "pro" })}>See Pro Asset Packs</button>.
          </p>
        </div>
      </div>
    </section>
  )
}

type ProView = "overview" | "asset-packs" | "templates" | "license"

const proTabs: Array<{ id: ProView; label: string }> = isShellVisible(true)
  ? [
      { id: "overview", label: "Overview" },
      { id: "asset-packs", label: "Asset Packs" },
      { id: "templates", label: "Templates" },
      { id: "license", label: "License / Provenance" },
    ]
  : [{ id: "overview", label: "Overview" }]

const proAssetPackSlots = [
  { id: "ui-blocks", label: "UI Blocks Pack" },
  { id: "templates", label: "Templates Pack" },
  { id: "ui-kit", label: "React UI Kit Pack" },
]

const proPlanItems = [
  "Unlimited implementation packs",
  "Agent-ready prompts and source notes",
  "Commercial reuse for downloaded UI assets",
  "Reference capture evidence for higher quality builds",
]

function ProOverviewContent({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Pro Plan</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-none tracking-normal text-foreground md:text-7xl">Unlock the reusable side of Askewly Design.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Pro is for teams and agents that need the system as working source material, not only a public visual reference.
        </p>
        <div className="mt-10 overflow-hidden rounded-md border bg-slate-950 shadow-sm">
          <img
            alt=""
            className="aspect-[16/9] size-full object-cover object-left-top"
            src="/assets/landing-pages/pricing-dashboard-v2.png"
          />
        </div>
      </div>

      <aside className="rounded-md border bg-card p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Starter Pro</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal text-foreground">$19</p>
          </div>
          <p className="pb-1 text-sm text-muted-foreground">/ month</p>
        </div>
        <div className="mt-6 space-y-3">
          {proPlanItems.map((item) => (
            <p key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-askewly-violet" />
              <span>{item}</span>
            </p>
          ))}
        </div>
        <Button className="mt-7 h-11 w-full rounded-lg bg-askewly-violet text-white hover:bg-[#5f22a8]" type="button" onClick={onSignIn}>
          Continue to sign in
        </Button>
      </aside>
    </div>
  )
}

function ProAssetPacksPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {proAssetPackSlots.map((pack) => (
          <div key={pack.id} className="flex flex-col gap-3 rounded-md border bg-card p-5 shadow-sm">
            <div className="aspect-[16/10] animate-pulse rounded-md bg-muted" />
            <p className="text-sm font-semibold text-foreground">{pack.label}</p>
            <p className="text-sm leading-6 text-muted-foreground">Live preview — pending</p>
            <p className="text-sm leading-6 text-muted-foreground">Included files — pending</p>
            <p className="text-sm leading-6 text-muted-foreground">License — pending</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-sm font-medium text-foreground">Content pending — fill criteria: source-quality</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Live previews, included-file lists, and license terms land here once real asset packs are ready.
        </p>
      </div>
    </div>
  )
}

function ProTemplatesPanel() {
  const templateSlots = templateSections.flatMap((section) => section.items)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        {templateSlots.length} template definitions reserved for this surface — no real files yet.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templateSlots.map((item) => (
          <div key={item.filter} className="flex flex-col gap-3 rounded-md border bg-card p-4 shadow-sm">
            <div className="aspect-[4/3] animate-pulse rounded-md bg-muted" />
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-sm font-medium text-foreground">Content pending — fill criteria: source-quality</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Real template screens and code exports replace these slots once each definition clears the source-quality bar.
        </p>
      </div>
    </div>
  )
}

function ProLicensePanel() {
  const documentSlots = ["License terms", "Provenance notes", "Attribution requirements"]

  return (
    <div className="flex flex-col gap-6">
      <div className="divide-y rounded-md border bg-card shadow-sm">
        {documentSlots.map((title) => (
          <div key={title} className="flex items-center justify-between gap-3 p-5">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <span className="text-sm text-muted-foreground">Document pending</span>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-sm font-medium text-foreground">Content pending — fill criteria: source-quality</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          License and provenance documents publish here once Asset Packs and Templates have sellable content.
        </p>
      </div>
    </div>
  )
}

function ProPlanPage({ onSignIn }: { onSignIn: () => void }) {
  const [view, setView] = useState<ProView>("overview")

  // Production has exactly one tab (Overview), so the tab bar never renders and
  // this returns byte-identical markup to the pre-SFB2 page.
  if (proTabs.length === 1) {
    return (
      <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
        <ProOverviewContent onSignIn={onSignIn} />
      </section>
    )
  }

  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8">
        <div className="flex gap-2 border-b" role="tablist" aria-label="Pro views">
          {proTabs.map((tab) => (
            <button
              key={tab.id}
              aria-selected={view === tab.id}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition",
                view === tab.id
                  ? "border-askewly-violet text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              role="tab"
              type="button"
              onClick={() => setView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === "overview" ? (
          <ProOverviewContent onSignIn={onSignIn} />
        ) : view === "asset-packs" ? (
          <ProAssetPacksPanel />
        ) : view === "templates" ? (
          <ProTemplatesPanel />
        ) : (
          <ProLicensePanel />
        )}
      </div>
    </section>
  )
}

function GoogleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  )
}

function KakaoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#191600"
        d="M9 1.5C4.86 1.5 1.5 4.1 1.5 7.31c0 2.07 1.4 3.88 3.5 4.92-.15.54-.56 2.02-.64 2.33-.1.39.14.38.3.28.13-.08 2.02-1.37 2.84-1.93.49.07 1 .11 1.5.11 4.14 0 7.5-2.6 7.5-5.81S13.14 1.5 9 1.5Z"
      />
    </svg>
  )
}

function SignInPopoverContent() {
  function startOAuth(provider: "google" | "kakao") {
    const authOrigin = getOAuthStartOrigin()
    const returnUrl = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`
    const params = new URLSearchParams({ return: returnUrl })

    window.location.href = `${authOrigin}/api/auth/oauth/${provider}/start?${params.toString()}`
  }

  return (
    <PopoverContent align="end" sideOffset={12} className="askewly-login-popover w-[min(21rem,calc(100vw-2rem))] gap-0 rounded-lg border-border/80 p-0 shadow-2xl">
      <div className="p-5">
        <PopoverHeader className="gap-2 text-left">
          <PopoverTitle className="text-xl font-semibold tracking-normal text-foreground">로그인</PopoverTitle>
          <PopoverDescription className="text-sm leading-6">어스큐리 계정으로 로그인하세요.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-5 space-y-3">
          <Button className="h-11 w-full rounded-md border-border bg-background text-sm font-semibold text-foreground shadow-xs hover:bg-muted" variant="outline" type="button" onClick={() => startOAuth("google")}>
            <GoogleMark />
            Google로 계속하기
          </Button>
          <Button className="h-11 w-full rounded-md border-[#fee500] bg-[#fee500] text-sm font-semibold text-[#191600] shadow-xs hover:border-[#f5dc00] hover:bg-[#f5dc00]" type="button" onClick={() => startOAuth("kakao")}>
            <KakaoMark />
            카카오로 계속하기
          </Button>
        </div>
      </div>
    </PopoverContent>
  )
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

function pathsEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((segment, index) => segment === right[index])
}

type PrimaryAxisId = "marketing" | "application" | "ecommerce" | "documentation"
type ProductSurfaceId = "ui-blocks" | "templates" | "ui-kit"

const primaryAxes: Array<{ id: PrimaryAxisId; icon: LucideIcon; label: string }> = [
  { id: "marketing", icon: Sparkles, label: "Marketing" },
  { id: "application", icon: LayoutPanelTop, label: "Application UI" },
  { id: "ecommerce", icon: ShoppingCart, label: "Ecommerce" },
  { id: "documentation", icon: BookOpen, label: "Documentation" },
]

function getActivePrimaryAxis(page: PageMode, filter: TermFilter): PrimaryAxisId {
  if (page === "docs" || filter.startsWith("nav:docs-")) {
    return "documentation"
  }
  if (filter.startsWith("nav:plus-application") || filter.startsWith("nav:plus-forms") || filter.startsWith("nav:plus-navigation") || filter.startsWith("nav:plus-overlays") || filter.startsWith("nav:plus-feedback") || filter.startsWith("nav:plus-data-display")) {
    return "application"
  }
  if (filter.startsWith("nav:plus-ecommerce")) {
    return "ecommerce"
  }

  return "marketing"
}

function getActiveProductSurface(filter: TermFilter): ProductSurfaceId {
  if (filter.startsWith("nav:plus-templates")) {
    return "templates"
  }
  if (filter.startsWith("nav:plus-ui-kit")) {
    return "ui-kit"
  }

  return "ui-blocks"
}

function getInitialSearchState(): SearchState {
  if (typeof window === "undefined") {
    return { filter: navFilter("plus-all") as TermFilter, page: "home" as PageMode, query: "", termId: null, returnPage: "home" as Exclude<PageMode, "term"> }
  }

  const params = new URLSearchParams(window.location.search)
  const hasLegacyParams =
    window.location.pathname === "/" &&
    (params.has("page") || params.has("id") || params.has("q") || params.has("filter"))

  // 경로 스킴(UE5) 우선 — /terms/:id, /patterns/:slug, /docs/:slug, /search 등.
  if (!hasLegacyParams) {
    const raw = stateFromUrl(window.location.pathname, params)
    if (raw) {
      const filter = raw.rawFilter ? parseFilterParam(raw.rawFilter) : getDefaultFilterForPage(raw.page)
      const returnPage: Exclude<PageMode, "term"> =
        raw.page !== "term" ? raw.page : filter.startsWith("nav:docs-") ? "docs" : "plus"
      return { filter, page: raw.page, query: raw.query, termId: raw.termId, returnPage }
    }
  }

  // 구 쿼리 URL 폴백 — 라우터 loader 가 리다이렉트하기 전 초기 렌더에서도 안전하게.
  const query = params.get("q") ?? ""
  const rawFilter = params.get("filter")
  const filter = parseFilterParam(rawFilter)
  const parsedPage = parsePageParam(params.get("page"), filter)
  // 검색어 딥링크(?q=)는 홈이 아니라 검색 결과 레이아웃으로 착지해야 한다 — 홈은 결과를 렌더하지 않는다.
  const page: PageMode = parsedPage === "home" && query.trim().length > 0
    ? (filter.startsWith("nav:docs-") ? "docs" : "plus")
    : parsedPage
  const termId = page === "term" ? params.get("id") : null
  const returnPage: Exclude<PageMode, "term"> = page !== "term" ? page : filter.startsWith("nav:docs-") ? "docs" : "plus"

  return { filter: rawFilter ? filter : getDefaultFilterForPage(page), page, query, termId, returnPage }
}

function getAuthApiOrigin() {
  return import.meta.env.VITE_ASKEWLY_AUTH_ORIGIN ?? ""
}

function markAuthReturnOk() {
  try {
    window.sessionStorage.setItem(AUTH_RETURN_OK_STORAGE_KEY, String(Date.now()))
  } catch {
    // Session storage can be disabled; auth state still updates in-memory.
  }
}

function clearAuthReturnOk() {
  try {
    window.sessionStorage.removeItem(AUTH_RETURN_OK_STORAGE_KEY)
  } catch {
    // noop
  }
}

function hasRecentAuthReturnOk() {
  try {
    const value = window.sessionStorage.getItem(AUTH_RETURN_OK_STORAGE_KEY)
    if (!value) {
      return false
    }

    const timestamp = Number(value)
    if (!Number.isFinite(timestamp)) {
      return false
    }

    return Date.now() - timestamp < 10 * 60 * 1000
  } catch {
    return false
  }
}

function getOAuthStartOrigin() {
  const configuredOrigin = import.meta.env.VITE_ASKEWLY_AUTH_ORIGIN
  if (configuredOrigin) {
    return configuredOrigin
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "https://askewly.com"
  }

  return window.location.origin
}

function getDefaultFilterForPage(page: PageMode): TermFilter {
  if (page === "term") {
    return navFilter("plus-all")
  }
  if (page === "docs") {
    return navFilter("docs-getting-started-setup")
  }
  if (page === "plus") {
    return navFilter("plus-all")
  }

  return "all"
}

function parsePageParam(value: string | null, filter: TermFilter): PageMode {
  if (value === "colors") {
    return "colors"
  }
  if (value === "recipes") {
    return "recipes"
  }
  if (value === "download") {
    return isShellVisible(true) ? "download" : "home"
  }
  if (value === "home" || value === "docs" || value === "plus" || value === "term" || value === "pro") {
    return value
  }
  if (isNavigationFilter(filter)) {
    if (filter.startsWith("nav:docs-")) {
      return "docs"
    }
    if (filter.startsWith("nav:plus-")) {
      return "plus"
    }
  }

  return "home"
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
  const navigationFilter = normalizeNavigationFilter(value)
  if (navigationFilter) {
    return navigationFilter
  }
  if (categoryGroups.some((group) => group.id === value)) {
    return value as TermFilter
  }

  return "all"
}

function getFilterCount(counts: Map<TermFilter, number>, filter: TermFilter) {
  return counts.get(filter) ?? 0
}

function PrimaryAxisNav({
  activeAxis,
  onSelect,
  includeDocumentation = true,
}: {
  activeAxis: PrimaryAxisId
  onSelect: (axis: PrimaryAxisId) => void
  includeDocumentation?: boolean
}) {
  const axes = includeDocumentation ? primaryAxes : primaryAxes.filter((axis) => axis.id !== "documentation")
  return (
    <div className="flex flex-col gap-1 py-2">
      {axes.map((axis) => (
        <button
          key={axis.id}
          className={cn(
            "flex h-11 items-center gap-3 rounded-lg px-3 text-left text-base font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
            activeAxis === axis.id && "bg-background text-foreground"
          )}
          type="button"
          onClick={() => onSelect(axis.id)}
        >
          <axis.icon aria-hidden="true" className={cn("size-5 shrink-0", activeAxis === axis.id ? "text-foreground" : "text-muted-foreground")} />
          <span className="min-w-0 truncate">{axis.label}</span>
        </button>
      ))}
    </div>
  )
}

function RecipesNav({
  activeCollection,
  onSelect,
}: {
  activeCollection: RecipeCollection | null
  onSelect: (collection: RecipeCollection) => void
}) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Collections</p>
      {recipeCollectionOrder.map((collection) => (
        <button
          key={collection}
          className={cn(
            "flex min-h-9 items-center rounded-lg px-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
            activeCollection === collection && "bg-background font-semibold text-foreground"
          )}
          type="button"
          onClick={() => onSelect(collection)}
        >
          {collection}
        </button>
      ))}
    </div>
  )
}

type StaticPlusNavTreeProps = {
  activeFilter: TermFilter
  onFilterChange: (filter: TermFilter) => void
}

function StaticUiBlocksNavTree({
  activeFilter,
  activeSectionId,
  onFilterChange,
}: StaticPlusNavTreeProps & { activeSectionId: PrimaryAxisId }) {
  const sectionId = activeSectionId === "application" ? "application-ui" : activeSectionId
  const visibleSections = uiBlockSections.filter((section) => section.id === sectionId)

  return (
    <nav className="flex flex-col gap-8" aria-label="UI Blocks navigation">
      {visibleSections.flatMap((section) =>
        section.groups.map((group) => (
          <StaticUiBlockGroup
            key={`${section.id}-${group.label}`}
            activeFilter={activeFilter}
            group={group}
            onFilterChange={onFilterChange}
          />
        ))
      )}
    </nav>
  )
}

function StaticUiBlockGroup({
  activeFilter,
  group,
  onFilterChange,
}: {
  activeFilter: TermFilter
  group: UiBlockNavSection["groups"][number]
  onFilterChange: (filter: TermFilter) => void
}) {
  const visibleItems = group.items.filter((item) => isNavigationFilterVisible(item.filter))

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <button
        className={cn(
          "text-left font-mono text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground transition hover:text-foreground",
          activeFilter === group.filter && "text-foreground"
        )}
        type="button"
        onClick={() => onFilterChange(group.filter)}
      >
        {group.label}
      </button>
      <div className="flex flex-col border-l border-border">
        {visibleItems.map((item) => {
          const active = activeFilter === item.filter

          return (
            <button
              key={item.filter}
              className={cn(
                "-ml-px border-l px-4 py-1.5 text-left text-sm leading-6 text-muted-foreground transition hover:border-muted-foreground hover:text-foreground",
                active ? "border-foreground font-semibold text-foreground" : "border-transparent"
              )}
              type="button"
              onClick={() => onFilterChange(item.filter)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function StaticTemplateNavTree({ activeFilter, onFilterChange }: StaticPlusNavTreeProps) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Templates navigation">
      <StaticPlusProductSection description="완성 화면 예시로 탐색" title="Templates">
        {templateSections.map((section) => (
          <div key={section.id} className="flex flex-col gap-1">
            <StaticPlusNavItem
              active={activeFilter === section.filter}
              label={section.label}
              level={0}
              onClick={() => onFilterChange(section.filter)}
            />
            {section.items.map((item) => (
              <StaticPlusNavItem
                key={item.filter}
                active={activeFilter === item.filter}
                label={item.label}
                level={1}
                onClick={() => onFilterChange(item.filter)}
              />
            ))}
          </div>
        ))}
      </StaticPlusProductSection>
    </nav>
  )
}

function StaticUiKitNavTree({ activeFilter, onFilterChange }: StaticPlusNavTreeProps) {
  return (
    <nav className="flex flex-col gap-6" aria-label="UI Kit navigation">
      <StaticPlusProductSection description="재사용 가능한 컴포넌트 시스템" title="UI Kit">
        <StaticPlusNavItem
          active={activeFilter === navFilter("plus-ui-kit")}
          label="Overview"
          level={0}
          onClick={() => onFilterChange(navFilter("plus-ui-kit"))}
        />
        {uiKitSections.map((item) => (
          <StaticPlusNavItem
            key={item.id}
            active={activeFilter === item.filter}
            label={item.label}
            level={0}
            onClick={() => onFilterChange(item.filter)}
          />
        ))}
      </StaticPlusProductSection>
    </nav>
  )
}

function StaticPlusProductSection({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="px-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}

function StaticPlusNavItem({
  active,
  icon: Icon,
  label,
  level,
  onClick,
}: {
  active: boolean
  icon?: LucideIcon
  label: string
  level: 0 | 1 | 2
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center gap-3 rounded-lg pr-3 text-left text-sm transition hover:bg-muted",
        level === 0 && "pl-3 font-medium",
        level === 1 && "pl-8 font-medium",
        level === 2 && "pl-12",
        active && "bg-secondary text-primary"
      )}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  )
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
    <section className="flex min-h-64 flex-col gap-6 border-y py-8" data-empty-recovery>
      <div>
        <p className="text-lg font-semibold">검색 결과가 없습니다.</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          검색어와 필터가 함께 적용되어 결과가 좁아졌을 수 있습니다. 아래에서 검색어만 지우거나, 필터만 해제하거나, 다른 탐색 문장으로 이어갈 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="grid gap-6 border-t pt-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">이런 말로 다시 찾아보기</h2>
          <div className="flex flex-wrap gap-2">
            {starters.map((starter) => (
              <Button key={starter.id} size="sm" variant="secondary" onClick={() => onQueryChange(starter.value)}>
                {starter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
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

function EmptyTermPage({ onBack }: { onBack: () => void }) {
  return (
    <section className="flex min-h-[420px] flex-col items-start justify-center gap-4 border-y py-10">
      <Badge variant="outline" className="rounded-md">Term</Badge>
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">용어 페이지를 찾을 수 없습니다</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          URL의 term id가 현재 사전에 없거나 아직 생성되지 않았습니다.
        </p>
      </div>
      <Button type="button" onClick={onBack}>
        목록으로 돌아가기
      </Button>
    </section>
  )
}

type CatalogLandingProps = {
  filterCounts: Map<TermFilter, number>
  onFilterChange: (filter: TermFilter) => void
}

function PlusCatalogLanding({ filterCounts, onFilterChange }: CatalogLandingProps) {
  const visibleSections = plusCatalogSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isNavigationFilterVisible(item.filter)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <section className="flex flex-col gap-10 border-y py-8" data-print-hidden>
      {visibleSections.map((section) => (
        <div key={section.title} className="grid gap-5 xl:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase text-muted-foreground">{section.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
          </div>
          <div className="divide-y border-y">
            {section.items.map((item) => (
              <button
                key={item.filter}
                type="button"
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 px-0 py-3 text-left transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
                onClick={() => onFilterChange(item.filter)}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.description}</span>
                </span>
                <span className="text-sm text-muted-foreground">{getFilterCount(filterCounts, item.filter)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function DocsCatalogLanding({ filterCounts, onFilterChange }: CatalogLandingProps) {
  return (
    <section className="mx-auto flex w-full max-w-[76rem] flex-col gap-10" data-print-hidden>
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Documentation</p>
          <h2 className="mt-5 text-4xl font-normal tracking-normal text-slate-950 md:text-6xl">Build UI vocabulary like a docs site</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Tailwind docs starts with the job a reader is trying to finish, then narrows into tabs, numbered steps, examples, and related anchors. This surface uses the same rhythm for UI terms.
          </p>
        </div>
        <aside className="hidden self-start border-l pl-6 text-sm xl:sticky xl:top-20 xl:block xl:max-h-[calc(100svh-6rem)] xl:overflow-y-auto xl:overscroll-contain">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">On this page</p>
          <div className="mt-5 flex flex-col gap-3 text-slate-600">
            <span>Overview</span>
            <span>Getting started</span>
            <span>Docs index</span>
            <span>Representative terms</span>
          </div>
        </aside>
      </div>

      <div className="flex min-w-0 flex-col gap-7">
        <div>
          <h3 className="text-xl font-semibold tracking-normal text-slate-950">Getting started</h3>
          <div className="scrollbar-hidden mt-5 flex gap-8 overflow-x-auto border-b text-sm font-medium text-slate-600">
            {docsLandingTabs.map((tab, index) => (
              <button
                key={tab}
                className={cn("shrink-0 pb-4", index === 0 && "border-b border-slate-950 text-slate-950")}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
          <div className="flex flex-col gap-6">
            {docsGettingStartedSteps.map((step, index) => (
              <div key={step.title} className="grid gap-4 sm:grid-cols-[2.25rem_minmax(0,1fr)]">
                <span className="grid size-7 place-items-center border text-[0.65rem] font-mono text-slate-600">0{index + 1}</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-950">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl bg-slate-950 p-1 text-sm text-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-400">
              <span>ui-docs.config.ts</span>
              <Copy aria-hidden="true" className="size-4" />
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-5 leading-7"><code>{docsLandingCode}</code></pre>
          </div>
        </div>
      </div>

      <div className="grid divide-y border-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {docsLandingItems.map((item) => (
          <button
            key={item.filter}
            type="button"
            className="grid min-h-36 w-full gap-4 p-5 text-left transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onFilterChange(item.filter)}
          >
            <span>
              <span className="block text-lg font-semibold tracking-normal text-slate-950">{item.label}</span>
              <span className="mt-2 block text-sm leading-6 text-muted-foreground">{item.description}</span>
            </span>
            <span className="self-end text-sm font-medium text-slate-500">{getFilterCount(filterCounts, item.filter)} terms</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function DocsSectionPreview({ section, termCount }: { section: DocsSection; termCount: number }) {
  return (
    <article className="mx-auto grid w-full max-w-[76rem] gap-8 xl:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{section.eyebrow}</p>
        <h2 className="mt-5 text-4xl font-normal tracking-normal text-slate-950 md:text-5xl">{section.title}</h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{section.description}</p>

        <div className="mt-10">
          <h3 className="text-xl font-semibold tracking-normal text-slate-950">Overview</h3>
          <p className="mt-5 text-base leading-7 text-slate-600">{section.overview}</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-slate-50 p-8">
            <div className="mx-auto max-w-md rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-lg bg-sky-100 text-sky-700">
                  <section.icon aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-950">{section.exampleTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">{section.exampleDescription}</p>
                </div>
              </div>
            </div>
          </div>
          <pre className="overflow-x-auto bg-slate-950 p-5 text-sm leading-7 text-slate-100"><code>{section.code}</code></pre>
        </div>
      </div>

      <aside className="hidden self-start border-l pl-6 text-sm xl:sticky xl:top-20 xl:block xl:max-h-[calc(100svh-6rem)] xl:overflow-y-auto xl:overscroll-contain">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">On this page</p>
        <div className="mt-5 flex flex-col gap-3 text-slate-600">
          {section.anchors.map((anchor) => (
            <span key={anchor}>{anchor}</span>
          ))}
          <span>{termCount} related terms</span>
        </div>
      </aside>
    </article>
  )
}

export function LegacyDocsElementPreview({ variant }: { variant: DocsArticlePageData["preview"] }) {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState("Courtney Henry")
  const [copied, setCopied] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [disclosureIndex, setDisclosureIndex] = useState(0)
  const [popoverOpen, setPopoverOpen] = useState(true)
  const [role, setRole] = useState("Admin")
  const [tab, setTab] = useState("Overview")
  const [feedback, setFeedback] = useState("")

  if (!variant) {
    return null
  }

  if (variant === "docs-command-palette") {
    return (
      <div className="relative mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center overflow-hidden rounded-lg bg-slate-200">
        <img alt="" className="absolute inset-0 size-full object-cover" src="/generated/docs/command-palette-bg-1.png" />
        <div className="relative grid w-[78%] overflow-hidden rounded-xl bg-white/95 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur md:grid-cols-[1.15fr_0.85fr]">
          <div className="border-r border-slate-200">
            <div className="flex items-center gap-2 border-b px-4 py-3 text-sm text-slate-400">
              <Search aria-hidden="true" className="size-4" />
              <span>Search...</span>
            </div>
            <div className="p-3">
              <p className="px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Recent searches</p>
              {["Workflow Inc. / Website Redesign", "Add new file...", "Add new folder...", "Add hashtag...", "Add label..."].map((item, index) => (
                <div key={item} className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm", index === 0 ? "bg-slate-100 text-slate-950" : "text-slate-600")}>
                  <span className="flex items-center gap-2"><Clipboard aria-hidden="true" className="size-4 text-slate-400" />{item}</span>
                  {index > 0 && <span className="text-[0.65rem] text-slate-400">⌘{index}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden p-5 text-sm md:block">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-slate-200 text-slate-600">TC</span>
              <div>
                <p className="font-semibold text-slate-950">Tom Cook</p>
                <p className="text-slate-500">Director, Product Design</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-slate-500">
              <p>Last active 12m ago</p>
              <p>5 shared projects</p>
              <p>tom@example.com</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "docs-autocomplete") {
    const teammates = ["Leslie Alexander", "Michael Foster", "Dries Vincent", "Lindsay Walton", "Courtney Henry"]

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-12">
        <div className="w-72">
          <label className="mb-2 block text-xs font-semibold text-slate-700">Assigned to</label>
          <button className="flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm text-slate-500 shadow-sm transition hover:border-indigo-300 active:scale-[0.99]" type="button" onClick={() => setOpen((value) => !value)}>
            <span>{selected || "Search teammates..."}</span>
            <ChevronDown aria-hidden="true" className={cn("size-4 transition", open && "rotate-180")} />
          </button>
          <div className={cn("mt-1 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-900/10 transition-all duration-200", open ? "max-h-64 opacity-100" : "max-h-0 opacity-0")}>
            {teammates.map((name, index) => (
              <button key={name} className={cn("flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-slate-50", selected === name && "bg-indigo-50 text-indigo-700")} type="button" onClick={() => { setSelected(name); setFeedback(`${name} assigned`) }}>
                <span className={cn("size-6 rounded-full", ["bg-rose-200", "bg-amber-200", "bg-sky-200", "bg-emerald-200", "bg-violet-200"][index])} />
                <span className="text-slate-700">{name}</span>
              </button>
            ))}
          </div>
          {feedback && <p className="mt-2 text-xs font-medium text-indigo-600">{feedback}</p>}
        </div>
      </div>
    )
  }

  if (variant === "docs-dropdown-menu") {
    const items = [
      [Edit3, "Edit"],
      [Copy, "Duplicate"],
      [Archive, "Archive"],
      [Move, "Move"],
      [UserRound, "Share"],
      [CheckCircle2, "Add to favorites"],
      [Trash2, "Delete"],
    ] as const

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-12">
        <div className="flex flex-col items-end">
          <button className="mb-3 inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 active:scale-[0.98]" type="button" onClick={() => setOpen((value) => !value)}>
            Options <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition", open && "rotate-180")} />
          </button>
          <div className={cn("w-72 overflow-hidden rounded-lg bg-white text-sm shadow-xl ring-1 ring-slate-900/10 transition-all duration-200", open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0")}>
            {items.map(([Icon, label], index) => (
              <button key={label} className={cn("flex w-full items-center gap-3 px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50 hover:text-slate-950", selected === label && "bg-indigo-50 text-indigo-700", [2, 4, 6].includes(index) && "border-t")} type="button" onClick={() => { setSelected(label); setFeedback(`${label} selected`) }}>
                <Icon aria-hidden="true" className="size-5 text-slate-400" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          {feedback && <p className="mt-2 self-start text-xs font-medium text-indigo-600">{feedback}</p>}
        </div>
      </div>
    )
  }

  if (variant === "docs-copy-button") {
    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center rounded-lg bg-slate-100">
        <div className="w-[min(32rem,90%)] overflow-hidden rounded-xl bg-slate-950 text-slate-100 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <span>install.sh</span>
            <button className={cn("inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-slate-100 transition active:scale-[0.98]", copied ? "bg-emerald-500/20 text-emerald-100" : "bg-white/10 hover:bg-white/15")} type="button" onClick={() => setCopied(true)}><Copy aria-hidden="true" className="size-3.5" /> {copied ? "Copied" : "Copy"}</button>
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-7"><code>npm install ui-dictionary{"\n"}npx ui-dictionary add command-palette</code></pre>
        </div>
      </div>
    )
  }

  if (variant === "docs-dialog") {
    return (
      <div className="relative mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center overflow-hidden rounded-lg bg-slate-100">
        <div className={cn("absolute inset-0 bg-slate-900/20 transition", dialogOpen ? "opacity-100" : "opacity-0")} />
        {dialogOpen ? (
          <div className="relative w-80 rounded-xl bg-white p-6 text-sm shadow-2xl ring-1 ring-slate-900/10 transition animate-in fade-in zoom-in-95">
            <div className="grid size-10 place-items-center rounded-full bg-rose-100 text-rose-600"><CircleAlert aria-hidden="true" className="size-5" /></div>
            <h4 className="mt-4 text-base font-semibold text-slate-950">Delete project</h4>
            <p className="mt-2 leading-6 text-slate-500">This action cannot be undone. All project files and activity will be removed.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="rounded-md border px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]" type="button" onClick={() => setDialogOpen(false)}>Cancel</button>
              <button className="rounded-md bg-rose-600 px-3 py-2 font-semibold text-white transition hover:bg-rose-500 active:scale-[0.98]" type="button" onClick={() => { setDialogOpen(false); setFeedback("Project deleted") }}>Delete</button>
            </div>
          </div>
        ) : (
          <button className="relative rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]" type="button" onClick={() => setDialogOpen(true)}>{feedback || "Open dialog"}</button>
        )}
      </div>
    )
  }

  if (variant === "docs-disclosure") {
    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center rounded-lg bg-slate-100">
        <div className="w-[min(34rem,90%)] divide-y rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10">
          {[
            ["What is included?", "Every screen includes layout, state, and accessibility notes."],
            ["Can I customize it?", "Yes, replace tokens and labels while preserving interaction contracts."],
            ["Does it work on mobile?", "Each pattern should be checked at 390px before it is marked done."],
          ].map(([title, body], index) => (
            <button key={title} className="block w-full p-4 text-left transition hover:bg-slate-50" type="button" onClick={() => setDisclosureIndex(index)}>
              <div className="flex items-center justify-between font-semibold text-slate-950">
                <span>{title}</span>
                <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition", disclosureIndex === index && "rotate-180")} />
              </div>
              <p className={cn("overflow-hidden text-sm leading-6 text-slate-500 transition-all duration-200", disclosureIndex === index ? "mt-3 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0")}>{body}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (variant === "docs-popover") {
    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-16">
        <div className="relative">
          <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]" type="button" onClick={() => setPopoverOpen((value) => !value)}>Quick settings</button>
          <div className={cn("absolute left-1/2 top-12 w-72 -translate-x-1/2 rounded-xl bg-white p-4 text-sm shadow-xl ring-1 ring-slate-900/10 transition duration-200", popoverOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0")}>
            <h4 className="font-semibold text-slate-950">Panel density</h4>
            <p className="mt-1 text-slate-500">Adjust how much detail appears in previews.</p>
            <div className="mt-4 flex rounded-lg bg-slate-100 p-1">
              {["Compact", "Comfortable"].map((item) => (
                <button key={item} className={cn("flex-1 rounded-md px-3 py-2 text-center transition", selected === item ? "bg-white font-medium text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-950")} type="button" onClick={() => setSelected(item)}>{item}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "docs-select") {
    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-14">
        <div className="w-80">
          <label className="mb-2 block text-xs font-semibold text-slate-700">Role</label>
          <button className="flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 active:scale-[0.99]" type="button" onClick={() => setOpen((value) => !value)}>
            {role} <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition", open && "rotate-180")} />
          </button>
          <div className={cn("mt-1 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-900/10 transition-all duration-200", open ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
            {["Admin", "Member", "Viewer", "Billing only"].map((item) => (
              <button key={item} className={cn("flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-slate-50", role === item ? "bg-indigo-50 text-indigo-700" : "text-slate-600")} type="button" onClick={() => { setRole(item); setFeedback(`${item} selected`) }}>
                <span>{item}</span>
                {role === item && <CheckCircle2 aria-hidden="true" className="size-4" />}
              </button>
            ))}
          </div>
          {feedback && <p className="mt-2 text-xs font-medium text-indigo-600">{feedback}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center rounded-lg bg-slate-100">
      <div className="w-[min(34rem,90%)] rounded-xl bg-white p-5 shadow-xl ring-1 ring-slate-900/10">
        <div className="flex gap-2 border-b">
          {["Overview", "Activity", "Settings"].map((item) => (
            <button key={item} className={cn("px-3 py-2 text-sm font-medium transition hover:text-slate-950", tab === item ? "border-b-2 border-indigo-600 text-slate-950" : "text-slate-500")} type="button" onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-3">
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-5/6 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

type MarketingSectionCatalogPageProps = {
  page: MarketingSectionPage
  proUnlocked?: boolean
}

function MarketingSectionCatalogPage({ page, proUnlocked = false }: MarketingSectionCatalogPageProps) {
  const [activeExampleTabs, setActiveExampleTabs] = useState<Record<string, "preview" | "code">>({})
  const [codeLanguages, setCodeLanguages] = useState<Record<string, CodeLanguage>>({})
  const [previewThemes, setPreviewThemes] = useState<Record<string, PreviewTheme>>({})
  const [copiedExampleId, setCopiedExampleId] = useState<string | null>(null)
  const [codeAccessModalOpen, setCodeAccessModalOpen] = useState(false)
  const [codeAccessExample, setCodeAccessExample] = useState<MarketingSectionExample | null>(null)
  const systemPreviewTheme = useSystemPreviewTheme()

  async function copyExampleSnippet(exampleId: string, code: string) {
    await navigator.clipboard.writeText(code)
    setCopiedExampleId(exampleId)
    window.setTimeout(() => setCopiedExampleId((current) => (current === exampleId ? null : current)), 1400)
  }

  return (
    <section className="mx-auto flex w-full max-w-[88rem] flex-col gap-10 md:gap-14" data-print-grid>
      <header className="grid gap-8 pb-1 pt-0 md:pb-2 md:pt-1 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{page.breadcrumb ?? "UI Blocks"}</p>
          <h2 className="mt-5 text-5xl font-normal tracking-normal text-slate-950 md:text-6xl">{page.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{page.description}</p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <div className="flex items-start gap-3">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-slate-400" />
              <p>
                Tailwind Plus처럼 각 leaf의 첫 예제는 Preview와 Code를 함께 제공하고, 이후 예제는 Preview와 잠금 code CTA로 구분합니다. 우리 예시는 실제 화면 맥락에 맞춘 설명, tags, interaction feedback을 함께 보여줍니다.
              </p>
            </div>
          </div>
        </div>
        <aside className="hidden self-start border-l pl-6 text-sm xl:sticky xl:top-20 xl:block xl:max-h-[calc(100svh-6rem)] xl:overflow-y-auto xl:overscroll-contain">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">On this page</p>
          <div className="mt-5 flex flex-col gap-3 text-slate-600">
            <span>{page.examples.length} examples</span>
            {page.examples.slice(0, 9).map((example) => (
              <span key={example.id} className="truncate">{example.title}</span>
            ))}
          </div>
        </aside>
      </header>

      <div className="flex flex-col gap-12 md:gap-16">
        {page.examples.map((example, exampleIndex) => {
          const hasPublicCode = exampleIndex === 0 || proUnlocked
          const activeTab = hasPublicCode ? activeExampleTabs[example.id] ?? "preview" : "preview"
          const codeLanguage = codeLanguages[example.id] ?? "react"
          const previewTheme = previewThemes[example.id] ?? "system"
          const resolvedPreviewTheme = previewTheme === "system" ? systemPreviewTheme : previewTheme
          const snippet = getMarketingSnippet(example, codeLanguage)

          return (
            <article key={example.id} className="flex min-w-0 flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold tracking-normal text-slate-950">{example.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Example {String(exampleIndex + 1).padStart(2, "0")}</span>
                    {exampleIndex > 0 && (
                      <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em]", proUnlocked ? "bg-emerald-50 text-emerald-700" : "bg-askewly-violet/10 text-askewly-violet")}>{proUnlocked ? "Pro · unlocked" : "Pro"}</span>
                    )}
                  </div>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{example.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {example.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 text-[0.68rem] font-medium text-indigo-700">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className={cn("rounded-full bg-slate-100 p-0.5 text-sm/7 font-medium text-slate-600 ring-1 ring-slate-950/5", hasPublicCode ? "inline-flex" : "hidden md:inline-flex")}>
                    <button
                      className={cn("rounded-full px-4 transition", activeTab === "preview" ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-950/5" : "text-slate-500 hover:text-slate-700")}
                      type="button"
                      onClick={() => setActiveExampleTabs((current) => ({ ...current, [example.id]: "preview" }))}
                    >
                      Preview
                    </button>
                    {hasPublicCode && (
                      <button
                        className={cn("rounded-full px-4 transition", activeTab === "code" ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-950/5" : "text-slate-500 hover:text-slate-700")}
                        type="button"
                        onClick={() => setActiveExampleTabs((current) => ({ ...current, [example.id]: "code" }))}
                      >
                        Code
                      </button>
                    )}
                  </div>
                  <span className="hidden h-8 w-px bg-slate-200 md:block" />
                  <div className="block">
                    <PreviewThemeToggle
                      activeTheme={previewTheme}
                      onThemeChange={(theme) => setPreviewThemes((current) => ({ ...current, [example.id]: theme }))}
                    />
                  </div>
                  {hasPublicCode ? (
                    <div className={cn("items-center gap-3", activeTab === "code" ? "flex" : "hidden md:flex")}>
                      <span className="hidden h-8 w-px bg-slate-200 md:block" />
                      <select
                        aria-label="Code language"
                        className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                        value={codeLanguage}
                        onChange={(event) => setCodeLanguages((current) => ({ ...current, [example.id]: event.target.value as CodeLanguage }))}
                      >
                        <option value="html">HTML</option>
                        <option value="react">React</option>
                        <option value="vue">Vue</option>
                      </select>
                      <button
                        aria-label={copiedExampleId === example.id ? "Copied" : "Copy code"}
                        className={cn("grid size-9 place-items-center rounded-lg transition hover:bg-slate-100 hover:text-slate-800", copiedExampleId === example.id ? "bg-slate-100 text-slate-950" : "text-slate-500")}
                        type="button"
                        onClick={() => copyExampleSnippet(example.id, snippet.code)}
                      >
                        <Clipboard aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="hidden items-center gap-3 md:flex">
                      <span className="hidden h-8 w-px bg-slate-200 md:block" />
                      <button className="text-sm font-semibold whitespace-nowrap text-sky-500 transition hover:text-sky-600 active:scale-[0.98]" type="button" onClick={() => { setCodeAccessExample(example); setCodeAccessModalOpen(true) }}>
                        Get the code →
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {activeTab === "preview" ? (
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-950/10 bg-white shadow-sm ring-1 ring-slate-950/5">
                  <MarketingSectionPreviewLazy variant={example.preview} size="large" theme={resolvedPreviewTheme} />
                </div>
              ) : (
                <CodePreviewPanel snippet={snippet} />
              )}
            </article>
          )
        })}
      </div>
      {codeAccessModalOpen && <CodeAccessModal example={codeAccessExample} onClose={() => setCodeAccessModalOpen(false)} />}
    </section>
  )
}

type MarketingSectionPage = {
  breadcrumb?: string
  title: string
  description: string
  examples: MarketingSectionExample[]
}

type MarketingSectionExample = {
  id: string
  eyebrow: string
  title: string
  description: string
  tags: string[]
  termId: string
  preview: MarketingPreviewVariant
}

type MarketingCodeSnippet = {
  filename: string
  language: string
  code: string
  notes: string[]
}

type CodeLanguage = "html" | "react" | "vue"
function SiteThemeToggle({ activeTheme, onThemeChange }: { activeTheme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void }) {
  return (
    <div className="inline-flex rounded-full bg-muted p-0.5 text-muted-foreground ring-1 ring-border" role="group" aria-label="Site theme">
      {([
        ["system", Monitor, "System theme"],
        ["light", Sun, "Light theme"],
        ["dark", Moon, "Dark theme"],
      ] as const).map(([theme, Icon, label]) => (
        <button
          key={theme}
          aria-label={label}
          aria-pressed={activeTheme === theme}
          className={cn("grid size-7 place-items-center rounded-full transition", activeTheme === theme ? "bg-background text-foreground shadow-sm ring-1 ring-border" : "hover:text-foreground")}
          type="button"
          onClick={() => onThemeChange(theme)}
        >
          <Icon aria-hidden="true" className={cn("size-3.5", theme === "system" && "scale-90")} />
        </button>
      ))}
    </div>
  )
}

function PreviewThemeToggle({ activeTheme, onThemeChange }: { activeTheme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void }) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-slate-500 ring-1 ring-slate-950/5">
      {([
        ["system", Monitor, "System"],
        ["light", Sun, "Light"],
        ["dark", Moon, "Dark"],
      ] as const).map(([theme, Icon, label]) => (
        <button
          key={theme}
          aria-label={label}
          aria-pressed={activeTheme === theme}
          className={cn("grid size-8 place-items-center rounded-full transition", activeTheme === theme ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-950/5" : "hover:text-slate-700")}
          type="button"
          onClick={() => onThemeChange(theme)}
        >
          <Icon aria-hidden="true" className={cn("size-4", theme === "system" && "scale-90")} />
        </button>
      ))}
    </div>
  )
}

function CodeAccessModal({ example, onClose }: { example: MarketingSectionExample | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="code-access-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-950 shadow-2xl ring-1 ring-slate-950/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Plus code access</p>
            <h3 id="code-access-title" className="mt-2 text-xl font-semibold tracking-normal">{example ? example.title : "준비 중입니다"}</h3>
          </div>
          <button className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Tailwind Plus의 잠금 코드 흐름처럼 전체 구현 접근을 분리해 보여줍니다. 공개 예시는 첫 번째 카드의 Code 탭에서 바로 확인하고, 나머지 예시는 preview와 구조 메타데이터로 비교합니다. 소유자 계정으로 로그인하면 모든 예시의 Code 탭이 열립니다.
        </p>
        {example && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-950">{example.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {example.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[0.68rem] font-medium text-slate-600 ring-1 ring-slate-200">{tag}</span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800" type="button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

function CodePreviewPanel({ snippet }: { snippet: MarketingCodeSnippet }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-950/10 bg-slate-950 shadow-sm ring-1 ring-slate-950/5">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="truncate font-mono text-xs text-slate-300">{snippet.filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase text-slate-400">{snippet.language}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1fr)_18rem]">
        <pre className="max-h-[720px] overflow-auto p-5 text-left font-mono text-[12px] leading-6 text-slate-300">
          <code>{snippet.code}</code>
        </pre>
        <aside className="border-t border-white/10 bg-white/[0.03] p-5 md:border-l md:border-t-0">
          <p className="text-sm font-semibold text-white">Implementation notes</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            {snippet.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

function getMarketingSnippet(example: MarketingSectionExample, codeLanguage: CodeLanguage = "react"): MarketingCodeSnippet {
  const sharedNotes = [
    "Preview와 같은 Inter/Tailwind 기준의 출발점 코드입니다.",
    "이미지 asset 경로와 copy는 프로젝트에 맞게 교체하세요.",
    "Code 탭의 복사 버튼으로 현재 언어의 snippet을 바로 복사할 수 있습니다.",
  ]

  if (example.preview === "hero-centered") {
    if (codeLanguage === "html") {
      return {
        filename: "centered-hero.html",
        language: "html",
        notes: ["Tailwind CDN 또는 빌드 파이프라인이 연결된 HTML 기준 예시입니다.", ...sharedNotes],
        code: `<section class="overflow-hidden rounded-xl bg-white">
  <nav class="flex items-center justify-between px-6 py-5 text-xs font-medium md:px-10">
    <div class="grid size-5 place-items-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">S</div>
    <div class="hidden items-center gap-8 text-slate-700 md:flex">
      <a href="#">Product</a>
      <a href="#">Features</a>
      <a href="#">Marketplace</a>
      <a href="#">Company</a>
    </div>
    <a class="rounded-md px-2 py-1 text-slate-700" href="#">Log in →</a>
  </nav>
  <div class="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">
    <a class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
      <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-600">What's new</span>
      <span>Just shipped v1.0</span>
      <span>→</span>
    </a>
    <h1 class="mt-6 text-5xl font-semibold tracking-normal text-slate-950 md:text-7xl">
      Data to enrich your online business
    </h1>
    <p class="mt-6 max-w-2xl text-sm leading-6 text-slate-600">
      Turn broad product goals into named UI patterns with visible states and clear next actions.
    </p>
    <div class="mt-8 flex items-center justify-center gap-3">
      <a class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm" href="#">Get started</a>
      <a class="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm" href="#">Learn more →</a>
    </div>
  </div>
</section>`,
      }
    }

    if (codeLanguage === "vue") {
      return {
        filename: "CenteredHero.vue",
        language: "vue",
        notes: ["Vue SFC에서 template만 발췌한 형태입니다.", ...sharedNotes],
        code: `<template>
  <section class="overflow-hidden rounded-xl bg-white">
    <nav class="flex items-center justify-between px-6 py-5 text-xs font-medium md:px-10">
      <div class="grid size-5 place-items-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">S</div>
      <div class="hidden items-center gap-8 text-slate-700 md:flex">
        <a v-for="item in navItems" :key="item" href="#">{{ item }}</a>
      </div>
      <a class="rounded-md px-2 py-1 text-slate-700" href="#">Log in →</a>
    </nav>
    <div class="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">
      <a class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
        <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-600">What's new</span>
        <span>Just shipped v1.0</span>
        <span>→</span>
      </a>
      <h1 class="mt-6 text-5xl font-semibold tracking-normal text-slate-950 md:text-7xl">
        Data to enrich your online business
      </h1>
      <p class="mt-6 max-w-2xl text-sm leading-6 text-slate-600">
        Turn broad product goals into named UI patterns with visible states and clear next actions.
      </p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <a class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm" href="#">Get started</a>
        <a class="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm" href="#">Learn more →</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const navItems = ["Product", "Features", "Marketplace", "Company"]
</script>`,
      }
    }

    return {
      filename: "centered-hero.tsx",
      language: "tsx",
      notes: sharedNotes,
      code: `export function CenteredHero() {
  const navItems = ["Product", "Features", "Marketplace", "Company"]

  return (
    <section className="overflow-hidden rounded-xl bg-white">
      <nav className="flex items-center justify-between px-6 py-5 text-xs font-medium md:px-10">
        <div className="grid size-5 place-items-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">S</div>
        <div className="hidden items-center gap-8 text-slate-700 md:flex">
          {navItems.map((item) => (
            <a key={item} href="#">{item}</a>
          ))}
        </div>
        <a className="rounded-md px-2 py-1 text-slate-700" href="#">Log in →</a>
      </nav>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">
        <a className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-600">What's new</span>
          <span>Just shipped v1.0</span>
          <span>→</span>
        </a>
        <h1 className="mt-6 text-5xl font-semibold tracking-normal text-slate-950 md:text-7xl">
          Data to enrich your online business
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-600">
          Turn broad product goals into named UI patterns with visible states and clear next actions.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm" href="#">Get started</a>
          <a className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm" href="#">Learn more →</a>
        </div>
      </div>
    </section>
  )
}`,
    }
  }

  if (example.preview === "hero-image-split" && codeLanguage === "react") {
    return {
      filename: "split-with-image.tsx",
      language: "tsx",
      notes: ["오른쪽 이미지는 고정 aspect가 아니라 hero 높이를 채우는 cover crop입니다.", ...sharedNotes],
      code: `export function SplitWithImageHero() {
  return (
    <section className="grid min-h-[680px] overflow-hidden rounded-xl bg-white md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-20 md:px-12">
        <a className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Read more →
        </a>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal text-slate-950 md:text-6xl">
          Data to enrich your business
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Image-driven heroes create an immediate product or brand scene.
        </p>
        <div className="mt-7 flex items-center gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
            Get started
          </button>
          <button className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm">
            Learn more →
          </button>
        </div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden md:min-h-[680px]">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover object-[58%_52%]"
          src="/assets/hero-sections/split-workspace-desk.png"
        />
      </div>
    </section>
  )
}`,
    }
  }

  if (example.preview === "hero-angled-image" && codeLanguage === "react") {
    return {
      filename: "angled-image-hero.tsx",
      language: "tsx",
      notes: ["이미지를 skew하지 않고 wrapper에 clip-path를 줘서 대각선으로 잘라냅니다.", ...sharedNotes],
      code: `export function AngledImageHero() {
  return (
    <section className="grid min-h-[680px] overflow-hidden rounded-xl bg-white md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-20 md:px-12">
        <span className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Read more →
        </span>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal text-slate-950 md:text-6xl">
          Data to enrich your business
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Use an angled media crop when the image should push into the layout.
        </p>
      </div>
      <div className="relative min-h-[420px] overflow-hidden md:-mr-12 md:min-h-[680px] md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover object-[72%_48%]"
          src="/assets/hero-sections/angled-rooftop-laptop.png"
        />
      </div>
    </section>
  )
}`,
    }
  }

  if (example.preview === "hero-offset-image" && codeLanguage === "react") {
    return {
      filename: "offset-image-hero.tsx",
      language: "tsx",
      notes: ["Dark surface 안에서 이미지를 inset 처리해 offset card처럼 보이게 합니다.", ...sharedNotes],
      code: `export function OffsetImageHero() {
  return (
    <section className="grid min-h-[680px] overflow-hidden rounded-xl bg-slate-950 text-white md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-20 md:px-12">
        <span className="w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
          Read more →
        </span>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal md:text-6xl">
          We're changing the way people connect
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-300">
          Use a dark shell when the image should feel embedded in the brand surface.
        </p>
      </div>
      <div className="relative min-h-[420px] overflow-hidden p-10 md:min-h-[680px]">
        <img
          alt=""
          className="absolute inset-10 size-[calc(100%-5rem)] rounded-2xl object-cover object-[54%_42%]"
          src="/assets/hero-sections/laptop-workspace.png"
        />
      </div>
    </section>
  )
}`,
    }
  }

  if (example.preview === "hero-phone-mockup" && codeLanguage === "react") {
    return {
      filename: "phone-mockup-hero.tsx",
      language: "tsx",
      notes: ["폰 mockup은 실제 앱 캡처가 아니라 CSS로 만든 product proof입니다.", ...sharedNotes],
      code: `export function PhoneMockupHero() {
  return (
    <section className="grid min-h-[660px] gap-10 overflow-hidden rounded-xl bg-white px-8 py-14 md:grid-cols-[1fr_0.9fr] md:px-12">
      <div className="flex max-w-xl flex-col justify-center">
        <span className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          We're hiring · See open positions →
        </span>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal text-slate-950 md:text-6xl">
          A better way to ship your projects
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Pair the conversion message with a mobile product proof.
        </p>
      </div>
      <div className="flex items-center justify-center md:justify-end">
        <div className="h-[590px] w-[292px] rotate-1 rounded-[3.1rem] bg-slate-950 p-2.5 shadow-2xl ring-1 ring-slate-700">
          <div className="h-full rounded-[2.45rem] bg-slate-900 p-5 pt-12 text-slate-100">
            {/* Add app cards, tabs, feed rows, and bottom nav here. */}
          </div>
        </div>
      </div>
    </section>
  )
}`,
    }
  }

  if (example.preview === "hero-image-tiles" && codeLanguage === "react") {
    return {
      filename: "image-tiles-hero.tsx",
      language: "tsx",
      notes: ["Collage tile은 absolute 위치, rotate, z-index를 함께 조정해야 자연스럽습니다.", ...sharedNotes],
      code: `export function ImageTilesHero() {
  const tiles = [
    ["left-4 top-24 h-44 w-36 rotate-[-7deg] z-20", "/assets/hero-sections/office-lounge-laptop.png"],
    ["left-40 top-6 h-64 w-48 rotate-[4deg] z-30", "/assets/hero-sections/tile-whiteboard-workshop.png"],
    ["right-10 top-24 h-48 w-40 rotate-[8deg] z-20", "/assets/hero-sections/tile-planning-desk.png"],
  ]

  return (
    <section className="grid min-h-[700px] overflow-hidden rounded-xl bg-white px-8 py-16 md:grid-cols-[1fr_1.05fr] md:px-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-5xl font-semibold tracking-normal text-slate-950 md:text-6xl">
          We're changing the way people connect
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          A collage hero balances copy with multiple image tiles.
        </p>
      </div>
      <div className="relative min-h-[560px]">
        {tiles.map(([className, src], index) => (
          <img
            key={src}
            alt=""
            className={\`absolute rounded-[2rem] bg-white p-1 object-cover shadow-2xl ring-1 ring-black/5 \${className}\`}
            src={src}
          />
        ))}
      </div>
    </section>
  )
}`,
    }
  }

  if (codeLanguage === "html") {
    return {
      filename: `${example.id}.html`,
      language: "html",
      notes: ["HTML 예시는 정적 마크업으로 구조와 spacing을 먼저 확인하는 용도입니다.", ...sharedNotes],
      code: `<section class="overflow-hidden rounded-xl bg-white">
  <div class="mx-auto max-w-5xl px-6 py-20">
    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">${example.eyebrow}</p>
    <div class="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end">
      <div>
        <h1 class="text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">
          ${example.title}
        </h1>
        <p class="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
          ${example.description}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p class="font-semibold text-slate-950">Pattern role</p>
        <p class="mt-2">${example.tags.join(" · ")}</p>
      </div>
    </div>
  </div>
</section>`,
    }
  }

  if (codeLanguage === "vue") {
    return {
      filename: `${toPascalCase(example.id)}.vue`,
      language: "vue",
      notes: ["Vue 예시는 Tailwind class 구조와 반복 가능한 content model을 함께 보여줍니다.", ...sharedNotes],
      code: `<template>
  <section class="overflow-hidden rounded-xl bg-white">
    <div class="mx-auto max-w-5xl px-6 py-20">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">{{ eyebrow }}</p>
      <div class="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end">
        <div>
          <h1 class="text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">
            {{ title }}
          </h1>
          <p class="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
            {{ description }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p class="font-semibold text-slate-950">Pattern role</p>
          <p class="mt-2">{{ tags.join(" · ") }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const eyebrow = "${example.eyebrow}"
const title = "${example.title}"
const description = "${example.description}"
const tags = ${JSON.stringify(example.tags)}
</script>`,
    }
  }

  return {
    filename: `${example.id}.tsx`,
    language: "tsx",
    notes: sharedNotes,
    code: `export function ${toPascalCase(example.id)}() {
  return (
    <section className="overflow-hidden rounded-xl bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-5xl font-semibold tracking-normal text-slate-950">
          ${example.title}
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          ${example.description}
        </p>
      </div>
    </section>
  )
}`,
  }
}


const plusRepresentativeTermIds = [
  "hero",
  "pricing-section",
  "bento-grid",
  "command-palette",
  "data-table-toolbar",
  "filter-panel",
  "product-card",
  "checkout-progress-header",
  "dashboard-overview-page",
  "login-page",
  "button",
  "dialog",
]

const templateProductConfigs: Array<{
  id: string
  title: string
  description: string
  tags: string[]
  terms: [string, string, string]
  previews: [MarketingPreviewVariant, MarketingPreviewVariant, MarketingPreviewVariant]
}> = [
  { id: "catalyst", title: "Catalyst UI Kit", description: "컴포넌트 시스템과 앱 레이아웃을 함께 시작하는 UI kit product입니다.", tags: ["UI kit", "components", "app"], terms: ["button", "text-field", "data-table-toolbar"], previews: ["element-button-page", "form-layout-page", "data-table"] },
  { id: "oatmeal", title: "Oatmeal", description: "여러 마케팅 섹션을 테마형 사이트 키트로 묶는 product template입니다.", tags: ["marketing", "theme", "sections"], terms: ["hero", "pricing-section", "testimonial-section"], previews: ["landing-saas", "pricing-comparison-page", "testimonials-marquee"] },
  { id: "radiant", title: "Radiant", description: "SaaS 제품 소개, 기능 설명, CTA를 빠르게 조립하는 landing template입니다.", tags: ["SaaS", "landing", "conversion"], terms: ["hero", "feature-grid-section", "cta-section"], previews: ["landing-product", "features-grid", "cta-centered"] },
  { id: "spotlight", title: "Spotlight", description: "개인 웹사이트나 portfolio를 위한 소개, 글, 프로젝트 목록 중심 template입니다.", tags: ["personal", "portfolio", "writing"], terms: ["profile-card", "testimonial-section", "content-tabs"], previews: ["about-team-page", "testimonials-featured", "content-prose"] },
  { id: "salient", title: "Salient", description: "전형적인 제품 랜딩 페이지처럼 hero, 기능, 가격, FAQ 흐름을 하나로 묶습니다.", tags: ["product", "landing", "pricing"], terms: ["hero", "feature-grid-section", "pricing-section"], previews: ["landing-saas", "features-alternating", "pricing-highlighted"] },
  { id: "protocol", title: "Protocol", description: "API reference와 developer documentation을 빠르게 구성하는 docs template입니다.", tags: ["docs", "API", "reference"], terms: ["sidebar-nav", "table", "content-tabs"], previews: ["content-sidebar", "table-page", "tabs-page"] },
  { id: "commit", title: "Commit", description: "제품 변경 내역과 릴리스 노트를 시간순으로 보여주는 changelog template입니다.", tags: ["changelog", "release", "timeline"], terms: ["activity-feed", "timeline", "badge"], previews: ["list-page", "app-example-list", "element-badge-page"] },
  { id: "compass", title: "Compass", description: "운영 데이터와 탐색을 결합한 dashboard-style template입니다.", tags: ["dashboard", "operations", "workspace"], terms: ["dashboard-overview-page", "data-table-toolbar", "sidebar-nav"], previews: ["app-example-dashboard", "data-table", "shell-sidebar-page"] },
  { id: "primer", title: "Primer", description: "강의, 코스, 정보 상품을 설명하고 구매 전환까지 이어가는 info product template입니다.", tags: ["course", "content", "pricing"], terms: ["content-tabs", "pricing-section", "faq-list"], previews: ["content-prose", "pricing-three-tier", "faqs-stacked"] },
  { id: "studio", title: "Studio", description: "에이전시나 스튜디오가 작업, 팀, 고객 신뢰를 보여주는 agency template입니다.", tags: ["agency", "team", "proof"], terms: ["team-member-row", "logo", "testimonial-section"], previews: ["team-grid", "logo-cloud-grid", "testimonials-featured"] },
  { id: "transmit", title: "Transmit", description: "팟캐스트나 미디어 콘텐츠를 에피소드 목록과 구독 행동으로 정리하는 template입니다.", tags: ["podcast", "media", "subscribe"], terms: ["media-card", "content-tabs", "cta-section"], previews: ["content-media", "list-page", "cta-centered"] },
  { id: "pocket", title: "Pocket", description: "모바일 앱 마케팅을 위한 제품 소개, 기능, 다운로드 CTA template입니다.", tags: ["app", "mobile", "download"], terms: ["hero", "feature-grid-section", "bottom-cta-bar"], previews: ["hero-phone-mockup", "features-grid", "commerce-cart-page"] },
  { id: "syntax", title: "Syntax", description: "문서 사이트를 위한 sidebar, content, code language switching template입니다.", tags: ["docs", "syntax", "code"], terms: ["sidebar-nav", "table", "content-tabs"], previews: ["content-sidebar", "table-page", "tabs-page"] },
  { id: "keynote", title: "Keynote", description: "컨퍼런스나 이벤트 페이지를 위한 hero, 일정, 발표자 소개 template입니다.", tags: ["event", "schedule", "speakers"], terms: ["hero", "timeline", "profile-card"], previews: ["landing-product", "app-example-list", "team-grid"] },
]

const templateProductPageEntries: Array<[TermFilter, MarketingSectionPage]> = [
  [navFilter("plus-templates-products"), {
    breadcrumb: "Plus / Templates / Template Products",
    title: "Template Products",
    description: "Tailwind Plus의 공개 template gallery처럼 완성도 높은 제품 단위 시작점을 한곳에 모읍니다. 코드는 복제하지 않고 UI Dictionary-native 화면 흐름으로 대응합니다.",
    examples: templateProductConfigs.slice(0, 3).map((product) => ({
      id: `template-product-${product.id}`,
      eyebrow: "Templates / Products",
      title: product.title,
      description: product.description,
      tags: product.tags,
      termId: product.terms[0],
      preview: product.previews[0],
    })),
  }],
  ...templateProductConfigs.map((product): [TermFilter, MarketingSectionPage] => [navFilter(`plus-templates-${product.id}` as Parameters<typeof navFilter>[0]), {
    breadcrumb: `Plus / Templates / Template Products / ${product.title}`,
    title: product.title,
    description: product.description,
    examples: [
      {
        id: `${product.id}-overview-template`,
        eyebrow: `Templates / ${product.title}`,
        title: `${product.title} overview`,
        description: "첫 화면에서 template의 목적, 주요 대상, 핵심 행동을 분명히 잡습니다.",
        tags: product.tags,
        termId: product.terms[0],
        preview: product.previews[0],
      },
      {
        id: `${product.id}-structure-template`,
        eyebrow: `Templates / ${product.title}`,
        title: `${product.title} structure`,
        description: "반복 섹션과 탐색 구조를 조합해 완성 페이지 흐름을 만듭니다.",
        tags: ["structure", ...product.tags.slice(0, 2)],
        termId: product.terms[1],
        preview: product.previews[1],
      },
      {
        id: `${product.id}-conversion-template`,
        eyebrow: `Templates / ${product.title}`,
        title: `${product.title} detail state`,
        description: "세부 정보, 상태, 후속 행동을 같은 제품 흐름 안에서 연결합니다.",
        tags: ["detail", ...product.tags.slice(1, 3)],
        termId: product.terms[2],
        preview: product.previews[2],
      },
    ],
  }]),
]

const marketingSectionPages = new Map<TermFilter, MarketingSectionPage>([
  ...templateProductPageEntries,
  [navFilter("plus-marketing-hero-sections"), {
    title: "Hero Sections",
    description: "랜딩 페이지 첫 화면에서 제품 이름, 핵심 문장, 주요 CTA, 대표 이미지나 배경 효과를 조합하는 섹션 예시입니다. 정적 스크린샷 계열과 함께, 히어로 자체가 조작 가능한 인터랙티브 투어 축도 있습니다.",
    examples: [
      {
        id: "interactive-tour",
        eyebrow: "Marketing / Hero",
        title: "Interactive tour",
        description: "정적 스크린샷 대신 번호 hotspot을 눌러 단계별로 진행하는 가이드 투어가 히어로 본체인 2026 product-led 구성입니다.",
        tags: ["interactive", "guided tour", "product-led"],
        termId: "hero",
        preview: "hero-interactive-tour",
      },
      {
        id: "centered-hero",
        eyebrow: "Marketing / Hero",
        title: "Simple centered",
        description: "제품명과 핵심 문장을 가운데에 두고, CTA 두 개로 첫 행동을 명확히 유도하는 기본형입니다.",
        tags: ["headline", "supporting copy", "primary CTA"],
        termId: "hero",
        preview: "hero-centered",
      },
      {
        id: "split-with-preview",
        eyebrow: "Marketing / Hero",
        title: "Split with screenshot",
        description: "왼쪽에는 메시지와 CTA, 오른쪽에는 제품 화면이나 주요 상태를 보여주는 SaaS 랜딩형입니다.",
        tags: ["product preview", "two column", "conversion"],
        termId: "hero",
        preview: "hero-split",
      },
      {
        id: "split-with-bordered-screenshot",
        eyebrow: "Marketing / Hero",
        title: "Split with bordered screenshot",
        description: "제품 화면을 카드형 경계 안에 넣어 preview를 더 명확한 제품 캡처처럼 보여주는 변형입니다.",
        tags: ["bordered screenshot", "product preview", "SaaS"],
        termId: "hero",
        preview: "hero-bordered-screenshot",
      },
      {
        id: "split-with-code-example",
        eyebrow: "Marketing / Hero",
        title: "Split with code example",
        description: "제품 설명과 함께 코드 블록을 보여줘 개발자 대상 제품의 신뢰와 사용 장면을 강조하는 형식입니다.",
        tags: ["code block", "developer product", "split"],
        termId: "hero",
        preview: "hero-code-example",
      },
      {
        id: "centered-background-image",
        eyebrow: "Marketing / Hero",
        title: "Simple centered with background image",
        description: "중앙 메시지 뒤에 이미지나 어두운 오버레이를 깔아 브랜드 장면을 강하게 만드는 형식입니다.",
        tags: ["background image", "overlay", "centered"],
        termId: "hero",
        preview: "hero-background-image",
      },
      {
        id: "bordered-app-screenshot",
        eyebrow: "Marketing / Hero",
        title: "With bordered app screenshot",
        description: "어두운 배경과 빛 집중 효과로 브랜드명이나 한 문장을 강하게 각인시키는 변형입니다.",
        tags: ["app screenshot", "bordered frame", "product-led"],
        termId: "spotlight-hero",
        preview: "hero-bordered-app",
      },
      {
        id: "with-app-screenshot",
        eyebrow: "Marketing / Hero",
        title: "With app screenshot",
        description: "어두운 히어로 안에 제품 화면을 크게 넣어 실제 사용 장면을 첫 화면에서 설득하는 형식입니다.",
        tags: ["dark hero", "app screenshot", "product proof"],
        termId: "hero",
        preview: "hero-app-screenshot",
      },
      {
        id: "with-phone-mockup",
        eyebrow: "Marketing / Hero",
        title: "With phone mockup",
        description: "모바일 제품이나 반응형 경험이 핵심일 때 휴대폰 mockup을 첫 화면 proof로 쓰는 형식입니다.",
        tags: ["phone mockup", "mobile", "product-led"],
        termId: "hero",
        preview: "hero-phone-mockup",
      },
      {
        id: "split-with-image",
        eyebrow: "Marketing / Hero",
        title: "Split with image",
        description: "왼쪽 메시지와 오른쪽 이미지를 나눠 브랜드 장면과 전환 행동을 동시에 보여주는 형식입니다.",
        tags: ["image", "split", "brand scene"],
        termId: "hero",
        preview: "hero-image-split",
      },
      {
        id: "with-angled-image-on-right",
        eyebrow: "Marketing / Hero",
        title: "With angled image on right",
        description: "오른쪽 이미지를 비스듬하게 잘라 동적인 인상과 강한 시각적 구분을 만드는 형식입니다.",
        tags: ["angled image", "dynamic crop", "visual"],
        termId: "hero",
        preview: "hero-angled-image",
      },
      {
        id: "with-image-tiles",
        eyebrow: "Marketing / Hero",
        title: "With image tiles",
        description: "여러 이미지 타일을 겹쳐 커뮤니티, 고객, 사용 장면을 풍부하게 보여주는 형식입니다.",
        tags: ["image tiles", "collage", "community"],
        termId: "hero",
        preview: "hero-image-tiles",
      },
      {
        id: "with-offset-image",
        eyebrow: "Marketing / Hero",
        title: "With offset image",
        description: "어두운 표면 안에서 이미지를 우측으로 밀어 카피와 비주얼의 무게를 분리하는 형식입니다.",
        tags: ["offset image", "dark surface", "brand"],
        termId: "spotlight-hero",
        preview: "hero-offset-image",
      },
    ],
  }],
  [navFilter("plus-marketing-feature-sections"), {
    title: "Feature Sections",
    description: "제품의 핵심 기능과 차별점을 여러 블록으로 나눠 설명하는 랜딩 페이지 섹션 예시입니다. 정적 스크린샷·아이콘 계열과, 패널 자체를 조작하는 인라인 데모 축을 함께 다룹니다.",
    examples: [
      {
        id: "interactive-demo",
        eyebrow: "Marketing / Features",
        title: "Interactive demo",
        description: "정적 스크린샷 패널 대신 뷰 탭을 누르면 패널 내용이 전환되는 인라인 데모가 기능 섹션 본체인 구성입니다. 히어로의 hotspot 투어와 달리 패널 안 뷰 전환이 골격입니다.",
        tags: ["interactive", "inline demo", "tabs"],
        termId: "feature-grid-section",
        preview: "features-interactive-demo",
      },
      {
        id: "with-product-screenshot",
        eyebrow: "Marketing / Features",
        title: "With product screenshot",
        description: "기능 설명 위에 제품 화면을 크게 올려 기능과 실제 사용 장면을 바로 연결하는 형식입니다.",
        tags: ["product screenshot", "feature intro", "proof"],
        termId: "feature-grid-section",
        preview: "features-product-screenshot",
      },
      {
        id: "centered-2x2-grid",
        eyebrow: "Marketing / Features",
        title: "Centered 2x2 grid",
        description: "가운데 정렬된 소개 문장 아래 네 가지 핵심 기능을 균형 있게 보여주는 기본형입니다.",
        tags: ["2x2 grid", "centered", "scan"],
        termId: "feature-grid-section",
        preview: "features-centered-2x2",
      },
      {
        id: "with-large-screenshot",
        eyebrow: "Marketing / Features",
        title: "With large screenshot",
        description: "긴 설명보다 제품 화면의 정보량이 중요할 때 큰 screenshot을 중심에 배치합니다.",
        tags: ["large screenshot", "product proof", "centered"],
        termId: "feature-grid-section",
        preview: "features-large-screenshot",
      },
      {
        id: "with-large-bordered-screenshot",
        eyebrow: "Marketing / Features",
        title: "With large bordered screenshot",
        description: "큰 screenshot에 border와 shadow를 더해 앱 화면의 경계를 명확히 보여주는 형식입니다.",
        tags: ["bordered screenshot", "app frame", "proof"],
        termId: "feature-grid-section",
        preview: "features-bordered-screenshot",
      },
      {
        id: "simple-three-column-with-small-icons",
        eyebrow: "Marketing / Features",
        title: "Simple three column with small icons",
        description: "작은 아이콘과 짧은 설명을 세 열로 반복해 기능 목록을 빠르게 훑게 합니다.",
        tags: ["small icons", "three column", "benefits"],
        termId: "feature-grid-section",
        preview: "features-small-icons",
      },
      {
        id: "with-product-screenshot-on-left",
        eyebrow: "Marketing / Features",
        title: "With product screenshot on left",
        description: "왼쪽에 제품 화면, 오른쪽에 기능 설명을 두어 proof와 카피를 나란히 읽게 합니다.",
        tags: ["screenshot left", "split", "product detail"],
        termId: "feature-grid-section",
        preview: "features-screenshot-left",
      },
      {
        id: "simple-three-column-with-large-icons",
        eyebrow: "Marketing / Features",
        title: "Simple three column with large icons",
        description: "큰 아이콘을 써서 기능 카테고리를 더 강하게 구분하는 세 열 구성입니다.",
        tags: ["large icons", "three column", "category"],
        termId: "feature-grid-section",
        preview: "features-large-icons",
      },
      {
        id: "contained-in-panel",
        eyebrow: "Marketing / Features",
        title: "Contained in panel",
        description: "기능 목록을 하나의 패널 안에 넣어 배경 섹션과 명확하게 분리합니다.",
        tags: ["panel", "contained", "surface"],
        termId: "feature-grid-section",
        preview: "features-contained-panel",
      },
      {
        id: "with-product-screenshot-panel",
        eyebrow: "Marketing / Features",
        title: "With product screenshot panel",
        description: "패널 안에서 제품 screenshot과 기능 목록을 함께 배치해 완성된 섹션처럼 보이게 합니다.",
        tags: ["screenshot panel", "contained", "product"],
        termId: "feature-grid-section",
        preview: "features-screenshot-panel",
      },
      {
        id: "with-testimonial",
        eyebrow: "Marketing / Features",
        title: "With testimonial",
        description: "기능 설명 뒤에 짧은 고객 인용을 붙여 신뢰 단서를 함께 제공합니다.",
        tags: ["testimonial", "trust", "social proof"],
        termId: "feature-grid-section",
        preview: "features-testimonial",
      },
      {
        id: "offset-2x2-grid",
        eyebrow: "Marketing / Features",
        title: "Offset 2x2 grid",
        description: "2x2 기능 카드를 살짝 어긋나게 배치해 단조로운 그리드 느낌을 줄입니다.",
        tags: ["offset grid", "2x2", "visual rhythm"],
        termId: "feature-grid-section",
        preview: "features-offset-2x2",
      },
      {
        id: "with-code-example-panel",
        eyebrow: "Marketing / Features",
        title: "With code example panel",
        description: "개발자 도구나 API 제품처럼 코드 예시 패널을 기능 proof로 함께 보여줍니다.",
        tags: ["code panel", "developer", "API"],
        termId: "feature-grid-section",
        preview: "features-code-panel",
      },
      {
        id: "offset-with-feature-list",
        eyebrow: "Marketing / Features",
        title: "Offset with feature list",
        description: "상단 메시지와 아래 기능 리스트를 비대칭으로 배치해 읽는 흐름을 만듭니다.",
        tags: ["offset", "feature list", "asymmetric"],
        termId: "feature-grid-section",
        preview: "features-offset-list",
      },
      {
        id: "simple",
        eyebrow: "Marketing / Features",
        title: "Simple",
        description: "제목, 설명, 짧은 기능 목록만으로 구성한 가장 가벼운 기능 섹션입니다.",
        tags: ["simple", "minimal", "copy"],
        termId: "feature-grid-section",
        preview: "features-simple",
      },
      {
        id: "simple-3x2-grid",
        eyebrow: "Marketing / Features",
        title: "Simple 3x2 grid",
        description: "여섯 가지 기능을 3x2 그리드로 정리해 기능 폭이 넓은 제품에 맞춥니다.",
        tags: ["3x2 grid", "six features", "scan"],
        termId: "feature-grid-section",
        preview: "features-3x2-grid",
      },
    ],
  }],
  [navFilter("plus-marketing-pricing-sections"), {
    title: "Pricing Sections",
    description: "요금제, 추천 플랜, 기능 비교, 구매 CTA를 한 섹션 안에서 비교하게 하는 가격 섹션 예시입니다. 고정 티어 카드 계열과, 사용량 입력에 실시간 반응하는 계산기 축을 함께 다룹니다.",
    examples: [
      {
        id: "usage-calculator",
        eyebrow: "Marketing / Pricing",
        title: "Usage calculator",
        description: "고정 티어 카드가 아니라 슬라이더로 예상 사용량을 넣으면 월 비용이 실시간 재계산되는 계산기형 구성입니다.",
        tags: ["calculator", "usage-based", "interactive"],
        termId: "pricing-section",
        preview: "pricing-usage-calculator",
      },
      {
        id: "two-tiers-emphasized-right-tier",
        eyebrow: "Marketing / Pricing",
        title: "Two tiers with emphasized right tier",
        description: "두 개의 요금제 중 오른쪽 추천 플랜을 더 강하게 보여주는 가격 섹션입니다.",
        tags: ["two tiers", "right emphasis", "recommended"],
        termId: "pricing-section",
        preview: "pricing-two-tier-right",
      },
      {
        id: "two-tiers-emphasized-left-tier",
        eyebrow: "Marketing / Pricing",
        title: "Two tiers with emphasized left tier",
        description: "왼쪽 엔트리 플랜을 강조해 낮은 진입 장벽을 먼저 설득하는 형식입니다.",
        tags: ["two tiers", "left emphasis", "entry"],
        termId: "pricing-section",
        preview: "pricing-two-tier-left",
      },
      {
        id: "three-tiers-with-logos-and-feature-comparison",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers with logos and feature comparison",
        description: "세 요금제 카드와 로고, 기능 비교 영역을 함께 보여주는 정보 밀도 높은 형식입니다.",
        tags: ["three tiers", "logos", "comparison"],
        termId: "pricing-section",
        preview: "pricing-three-tier-logos-comparison",
      },
      {
        id: "two-tiers-with-extra-tier",
        eyebrow: "Marketing / Pricing",
        title: "Two tiers with extra tier",
        description: "두 핵심 플랜 아래에 별도 enterprise 또는 add-on tier를 붙이는 구성입니다.",
        tags: ["two tiers", "extra tier", "enterprise"],
        termId: "pricing-section",
        preview: "pricing-two-tier-extra",
      },
      {
        id: "single-price-with-details",
        eyebrow: "Marketing / Pricing",
        title: "Single price with details",
        description: "하나의 가격과 포함 항목을 자세히 보여줘 단일 상품 구매를 빠르게 유도합니다.",
        tags: ["single price", "details", "checkout"],
        termId: "pricing-section",
        preview: "pricing-single-details",
      },
      {
        id: "three-tiers",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers",
        description: "가장 표준적인 세 단계 요금제 카드로 선택지를 명확히 비교하게 합니다.",
        tags: ["three tiers", "cards", "standard"],
        termId: "pricing-section",
        preview: "pricing-three-tiers",
      },
      {
        id: "three-tiers-with-dividers",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers with dividers",
        description: "세 요금제를 구분선 중심으로 정리해 카드 느낌을 줄이고 표처럼 읽게 합니다.",
        tags: ["dividers", "three tiers", "structured"],
        termId: "pricing-section",
        preview: "pricing-three-tiers-dividers",
      },
      {
        id: "three-tiers-with-emphasized-tier",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers with emphasized tier",
        description: "세 플랜 중 추천 플랜 하나를 강하게 강조해 선택 비용을 줄입니다.",
        tags: ["recommended", "emphasis", "three tiers"],
        termId: "pricing-section",
        preview: "pricing-three-tiers-emphasized",
      },
      {
        id: "three-tiers-with-toggle",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers with toggle",
        description: "월간/연간 같은 결제 주기 toggle을 요금제 위에 배치한 형식입니다.",
        tags: ["toggle", "billing period", "three tiers"],
        termId: "pricing-section",
        preview: "pricing-three-tiers-toggle",
      },
      {
        id: "four-tiers-with-toggle",
        eyebrow: "Marketing / Pricing",
        title: "Four tiers with toggle",
        description: "네 개 플랜과 결제 주기 toggle로 더 넓은 가격 범위를 비교하게 합니다.",
        tags: ["four tiers", "toggle", "enterprise"],
        termId: "pricing-section",
        preview: "pricing-four-tiers-toggle",
      },
      {
        id: "with-comparison-table",
        eyebrow: "Marketing / Pricing",
        title: "With comparison table",
        description: "카드 아래에 세부 기능 표를 붙여 구매 전 비교 질문을 처리합니다.",
        tags: ["comparison table", "features", "decision"],
        termId: "pricing-section",
        preview: "pricing-comparison-table",
      },
      {
        id: "three-tiers-with-feature-comparison",
        eyebrow: "Marketing / Pricing",
        title: "Three tiers with feature comparison",
        description: "세 요금제 카드와 기능 비교 목록을 함께 배치해 가격과 포함 범위를 동시에 보여줍니다.",
        tags: ["feature comparison", "three tiers", "included"],
        termId: "pricing-section",
        preview: "pricing-three-tiers-feature-comparison",
      },
    ],
  }],
  [navFilter("plus-marketing-cta-sections"), {
    title: "CTA Sections",
    description: "사용자가 다음 행동으로 넘어가도록 한 문장과 버튼을 강하게 배치하는 전환 섹션 예시입니다. 본문 흐름 안(in-flow) 섹션과, 스크롤 내내 화면에 고정되는 스티키 바 축을 함께 다룹니다.",
    examples: [
      {
        id: "sticky-bar",
        eyebrow: "Marketing / CTA",
        title: "Sticky bar",
        description: "본문 흐름 안 섹션이 아니라 스크롤 위치와 무관하게 하단에 고정되는 얇은 바로, 단일 행동을 상시 노출하는 구성입니다.",
        tags: ["sticky", "floating", "persistent"],
        termId: "cta-section",
        preview: "cta-sticky-bar",
      },
      {
        id: "dark-panel-with-app-screenshot",
        eyebrow: "Marketing / CTA",
        title: "Dark panel with app screenshot",
        description: "어두운 CTA 패널에 제품 화면을 붙여 전환 행동과 제품 proof를 동시에 보여줍니다.",
        tags: ["dark panel", "app screenshot", "conversion"],
        termId: "cta-section",
        preview: "cta-dark-app-screenshot",
      },
      {
        id: "simple-stacked",
        eyebrow: "Marketing / CTA",
        title: "Simple stacked",
        description: "짧은 문장과 버튼을 세로로 쌓아 본문 흐름 끝에서 자연스럽게 행동을 제안합니다.",
        tags: ["stacked", "simple", "primary action"],
        termId: "cta-section",
        preview: "cta-simple-stacked",
      },
      {
        id: "centered-on-dark-panel",
        eyebrow: "Marketing / CTA",
        title: "Centered on dark panel",
        description: "어두운 패널 중앙에 메시지와 버튼을 놓아 섹션 끝의 집중도를 높입니다.",
        tags: ["dark", "centered", "panel"],
        termId: "cta-section",
        preview: "cta-dark-panel",
      },
      {
        id: "simple-centered",
        eyebrow: "Marketing / CTA",
        title: "Simple centered",
        description: "가장 단순한 중앙 정렬 CTA로 하나의 다음 행동을 분명하게 제안합니다.",
        tags: ["centered", "simple", "conversion"],
        termId: "cta-section",
        preview: "cta-simple-centered",
      },
      {
        id: "simple-centered-with-gradient",
        eyebrow: "Marketing / CTA",
        title: "Simple centered with gradient",
        description: "은은한 gradient 배경으로 단순한 CTA에 시각적 에너지를 더합니다.",
        tags: ["gradient", "centered", "visual"],
        termId: "cta-section",
        preview: "cta-gradient",
      },
      {
        id: "simple-centered-on-brand",
        eyebrow: "Marketing / CTA",
        title: "Simple centered on brand",
        description: "브랜드 컬러 배경 위에 메시지와 버튼을 올려 강한 전환 지점을 만듭니다.",
        tags: ["brand", "centered", "color"],
        termId: "cta-section",
        preview: "cta-brand",
      },
      {
        id: "simple-justified",
        eyebrow: "Marketing / CTA",
        title: "Simple justified",
        description: "왼쪽 메시지와 오른쪽 버튼을 한 줄로 정렬해 데스크톱에서 효율적인 CTA를 만듭니다.",
        tags: ["justified", "inline", "desktop"],
        termId: "cta-section",
        preview: "cta-simple-justified",
      },
      {
        id: "simple-justified-on-subtle-brand",
        eyebrow: "Marketing / CTA",
        title: "Simple justified on subtle brand",
        description: "연한 브랜드 배경 위에서 좌우 정렬 CTA를 부드럽게 강조합니다.",
        tags: ["subtle brand", "justified", "band"],
        termId: "cta-section",
        preview: "cta-subtle-brand",
      },
      {
        id: "split-with-image",
        eyebrow: "Marketing / CTA",
        title: "Split with image",
        description: "이미지와 전환 메시지를 나란히 배치해 브랜드 장면과 행동을 함께 보여줍니다.",
        tags: ["image", "split", "brand scene"],
        termId: "cta-section",
        preview: "cta-split-image",
      },
      {
        id: "two-columns-with-photo",
        eyebrow: "Marketing / CTA",
        title: "Two columns with photo",
        description: "사진을 한쪽 column에 크게 두어 더 editorial한 CTA 흐름을 만듭니다.",
        tags: ["photo", "two column", "editorial"],
        termId: "cta-section",
        preview: "cta-two-column-photo",
      },
      {
        id: "with-image-tiles",
        eyebrow: "Marketing / CTA",
        title: "With image tiles",
        description: "여러 이미지 타일을 겹쳐 커뮤니티나 사용 장면이 풍부한 CTA를 만듭니다.",
        tags: ["image tiles", "collage", "community"],
        termId: "cta-section",
        preview: "cta-image-tiles",
      },
    ],
  }],
  [navFilter("plus-marketing-bento-grids"), {
    title: "Bento Grids",
    description: "서로 다른 크기의 카드와 미디어를 섞어 기능, 장점, 제품 맥락을 풍부하게 보여주는 섹션 예시입니다. 행·열 수로 정의되는 균일 그리드와, 셀 크기 배수가 섞이는 비대칭 모자이크 축을 함께 다룹니다.",
    examples: [
      { id: "asymmetric-mosaic", eyebrow: "Marketing / Bento", title: "Asymmetric mosaic", description: "행·열 수가 아니라 1x1·2x1·2x2 셀 크기 배수가 섞여, 중요도가 큰 콘텐츠일수록 큰 박스를 차지하는 모자이크 형식입니다.", tags: ["asymmetric", "mosaic", "priority sizing"], termId: "bento-grid", preview: "bento-mosaic" },
      { id: "three-column-bento-grid", eyebrow: "Marketing / Bento", title: "Three column bento grid", description: "세 열을 기준으로 큰 카드와 작은 카드를 섞어 기능 우선순위를 보여주는 형식입니다.", tags: ["three column", "feature cards", "priority"], termId: "bento-grid", preview: "bento-three-column" },
      { id: "two-row-bento-grid", eyebrow: "Marketing / Bento", title: "Two row bento grid", description: "두 줄 구성 안에서 큰 제품 proof와 보조 기능 카드를 조합하는 bento 형식입니다.", tags: ["two row", "product proof", "features"], termId: "bento-grid", preview: "bento-two-row" },
      { id: "two-row-bento-grid-three-column-second-row", eyebrow: "Marketing / Bento", title: "Two row bento grid with three column second row", description: "상단 큰 카드 아래에 세 개의 보조 카드를 둬 메시지와 기능 폭을 동시에 담습니다.", tags: ["two row", "three column", "feature set"], termId: "bento-grid", preview: "bento-two-row-three-column" },
    ],
  }],
  [navFilter("plus-marketing-header-sections"), {
    title: "Header Sections",
    description: "페이지 본문이 시작되는 머리말 섹션(제목·리드·CTA) 예시입니다. hero 와 형태가 겹치지만 역할이 다르고, 사이트 상단의 내비게이션 바는 Elements > Headers 에 있습니다.",
    examples: [
      { id: "type-first", eyebrow: "Marketing / Header", title: "Type-first", description: "초대형 타이포가 화면을 소유하고 메타 정보는 얇은 행으로 물러나는 2026 타입 우선 구성입니다.", tags: ["type-first", "oversized", "editorial"], termId: "header", preview: "header-type-first" },
      { id: "split-editorial", eyebrow: "Marketing / Header", title: "Split editorial", description: "좌측 큰 제목 열과 우측으로 내려앉은 리드·목차 열이 비대칭 편집 그리드를 만듭니다.", tags: ["asymmetric", "editorial grid", "index"], termId: "header", preview: "header-split-editorial" },
      { id: "with-stats", eyebrow: "Marketing / Header", title: "With stats", description: "상단 메시지 아래에 핵심 수치를 붙여 신뢰 신호까지 바로 보여주는 header입니다.", tags: ["stats", "proof", "hero intro"], termId: "header", preview: "header-with-stats" },
      { id: "centered", eyebrow: "Marketing / Header", title: "Centered", description: "모든 요소를 가운데 축에 세우는 대칭 기본형 — 좌측 정렬 Simple 과 짝을 이루는 반대편입니다.", tags: ["centered", "simple", "landing"], termId: "header", preview: "header-centered" },
      { id: "centered-with-eyebrow", eyebrow: "Marketing / Header", title: "Centered with eyebrow", description: "작은 eyebrow label을 추가해 섹션의 맥락이나 출시 소식을 먼저 알려줍니다.", tags: ["eyebrow", "centered", "announcement"], termId: "header", preview: "header-centered-eyebrow" },
      { id: "with-cards", eyebrow: "Marketing / Header", title: "With cards", description: "헤더 하단에 보조 카드들을 붙여 다음 콘텐츠로 자연스럽게 이어지게 합니다.", tags: ["cards", "next section", "overview"], termId: "header", preview: "header-with-cards" },
      { id: "simple", eyebrow: "Marketing / Header", title: "Simple", description: "좌측 정렬로 제목·설명·버튼만 남긴 최소 구성 — 가운데 축의 Centered 와 대비되는 기본형입니다.", tags: ["simple", "copy", "CTA"], termId: "header", preview: "header-simple" },
      { id: "simple-with-eyebrow", eyebrow: "Marketing / Header", title: "Simple with eyebrow", description: "왼쪽 정렬 header에 eyebrow를 더해 제품 카테고리나 공지를 먼저 보여줍니다.", tags: ["eyebrow", "left aligned", "simple"], termId: "header", preview: "header-simple-eyebrow" },
      { id: "simple-with-background-image", eyebrow: "Marketing / Header", title: "Simple with background image", description: "배경 이미지를 깔고 텍스트를 올려 브랜드 장면을 강하게 드러냅니다.", tags: ["background image", "brand", "visual"], termId: "header", preview: "header-bg-image" },
      { id: "centered-with-background-image", eyebrow: "Marketing / Header", title: "Centered with background image", description: "이미지 배경 위에 중앙 정렬 메시지를 올려 hero처럼 쓰는 header입니다.", tags: ["background image", "centered", "hero"], termId: "header", preview: "header-centered-bg-image" },
    ],
  }],
  [navFilter("plus-marketing-newsletter-sections"), {
    title: "Newsletter Sections",
    description: "방문자가 이메일을 남기도록 제목, 설명, 입력 필드, 구독 CTA를 조합하는 섹션 예시입니다. 즉시 입력 폼 계열과, 취향 질문이 먼저 오는 게임화 축을 함께 다룹니다.",
    examples: [
      { id: "gamified-quiz", eyebrow: "Marketing / Newsletter", title: "Gamified quiz", description: "이메일 입력 전에 받고 싶은 콘텐츠를 고르는 퀴즈 스텝이 먼저 오는 게임화 구성으로, 첫 클릭의 부담을 낮춥니다.", tags: ["quiz", "gamified", "two-step"], termId: "newsletter-section", preview: "newsletter-gamified-quiz" },
      { id: "side-by-side-with-details", eyebrow: "Marketing / Newsletter", title: "Side-by-side with details", description: "왼쪽에는 구독 가치와 상세 bullet, 오른쪽에는 이메일 입력을 배치합니다.", tags: ["side-by-side", "details", "email"], termId: "newsletter-section", preview: "newsletter-side-details" },
      { id: "simple-side-by-side", eyebrow: "Marketing / Newsletter", title: "Simple side-by-side", description: "짧은 설명과 입력 필드를 좌우로 나눠 가장 효율적으로 구독 행동을 받습니다.", tags: ["side-by-side", "simple", "subscription"], termId: "newsletter-section", preview: "newsletter-simple-side" },
      { id: "simple-side-by-side-on-brand", eyebrow: "Marketing / Newsletter", title: "Simple side-by-side on brand", description: "브랜드 컬러 배경 위에서 좌우 배치 newsletter를 강조합니다.", tags: ["brand", "side-by-side", "color"], termId: "newsletter-section", preview: "newsletter-brand-side" },
      { id: "simple-stacked", eyebrow: "Marketing / Newsletter", title: "Simple stacked", description: "모바일에서도 안정적인 세로 쌓기 구성으로 구독 메시지를 정리합니다.", tags: ["stacked", "simple", "mobile"], termId: "newsletter-section", preview: "newsletter-stacked" },
      { id: "centered-card", eyebrow: "Marketing / Newsletter", title: "Centered card", description: "가운데 카드 안에 구독 설명과 입력을 넣어 독립 CTA처럼 보이게 합니다.", tags: ["centered", "card", "CTA"], termId: "newsletter-section", preview: "newsletter-centered-card" },
      { id: "side-by-side-on-card", eyebrow: "Marketing / Newsletter", title: "Side-by-side on card", description: "카드 표면 안에서 설명과 입력을 좌우로 배치해 배경과 분리합니다.", tags: ["card", "side-by-side", "surface"], termId: "newsletter-section", preview: "newsletter-side-card" },
    ],
  }],
  [navFilter("plus-marketing-stats"), {
    title: "Stats",
    description: "숫자로 제품의 규모, 성과, 신뢰를 빠르게 보여주는 지표 섹션 예시입니다.",
    examples: [
      { id: "simple", eyebrow: "Marketing / Stats", title: "Simple", description: "짧은 설명 아래 핵심 숫자만 보여주는 가장 가벼운 stats 섹션입니다.", tags: ["simple", "numbers", "proof"], termId: "stat-list", preview: "stats-simple" },
      { id: "simple-grid", eyebrow: "Marketing / Stats", title: "Simple grid", description: "여러 지표를 균일한 그리드로 보여줘 한눈에 비교하게 합니다.", tags: ["grid", "metrics", "comparison"], termId: "stat-list", preview: "stats-simple-grid" },
      { id: "with-background-image", eyebrow: "Marketing / Stats", title: "With background image", description: "이미지 배경 위에 숫자를 얹어 브랜드 장면과 성과를 함께 전달합니다.", tags: ["background image", "brand", "proof"], termId: "stat-list", preview: "stats-bg-image" },
      { id: "split-with-image", eyebrow: "Marketing / Stats", title: "Split with image", description: "한쪽에는 이미지, 다른 쪽에는 수치를 배치해 설명과 proof를 분리합니다.", tags: ["split", "image", "metrics"], termId: "stat-list", preview: "stats-split-image" },
      { id: "timeline", eyebrow: "Marketing / Stats", title: "Timeline", description: "시간 흐름에 따른 성과나 성장 지표를 timeline처럼 보여줍니다.", tags: ["timeline", "growth", "history"], termId: "stat-list", preview: "stats-timeline" },
      { id: "stepped", eyebrow: "Marketing / Stats", title: "Stepped", description: "단계형 프로세스와 숫자를 결합해 진행 흐름을 보여줍니다.", tags: ["steps", "process", "numbers"], termId: "stat-list", preview: "stats-stepped" },
      { id: "with-two-column-description", eyebrow: "Marketing / Stats", title: "With two column description", description: "설명 문단과 수치 그리드를 두 column으로 나눠 정보량을 늘립니다.", tags: ["two column", "description", "proof"], termId: "stat-list", preview: "stats-two-column-description" },
      { id: "with-description", eyebrow: "Marketing / Stats", title: "With description", description: "숫자 위에 설명 문단을 충분히 넣어 지표의 의미를 먼저 설명합니다.", tags: ["description", "context", "metrics"], termId: "stat-list", preview: "stats-description" },
    ],
  }],
  [navFilter("plus-marketing-testimonials"), {
    title: "Testimonials",
    description: "고객 인용문, 이름, 역할, 평점을 조합해 제품의 사회적 증거를 보여주는 섹션 예시입니다. 텍스트 인용 계열과, 영상 클립이 셀을 채우는 video wall 축을 함께 다룹니다.",
    examples: [
      { id: "video-wall", eyebrow: "Marketing / Testimonials", title: "Video wall", description: "텍스트 인용 대신 짧은 고객 영상 클립이 masonry 벽의 셀을 채우고, 재생 버튼이 상호작용의 중심인 wall of love 형식입니다.", tags: ["video", "masonry", "wall of love"], termId: "testimonial-section", preview: "testimonials-video-wall" },
      { id: "simple-centered", eyebrow: "Marketing / Testimonials", title: "Simple centered", description: "하나의 인용문을 가운데 크게 배치해 대표 신뢰 신호로 사용하는 형식입니다.", tags: ["centered", "quote", "simple"], termId: "testimonial-section", preview: "testimonials-simple-centered" },
      { id: "with-large-avatar", eyebrow: "Marketing / Testimonials", title: "With large avatar", description: "큰 아바타와 인용문을 함께 보여줘 사람의 얼굴을 신뢰 단서로 강조합니다.", tags: ["avatar", "quote", "trust"], termId: "testimonial-section", preview: "testimonials-large-avatar" },
      { id: "with-overlapping-image", eyebrow: "Marketing / Testimonials", title: "With overlapping image", description: "이미지와 testimonial card를 겹쳐 더 editorial한 사회적 증거를 만듭니다.", tags: ["overlap", "image", "social proof"], termId: "testimonial-section", preview: "testimonials-overlap-image" },
      { id: "with-background-image", eyebrow: "Marketing / Testimonials", title: "With background image", description: "배경 이미지를 깔고 quote를 올려 브랜드 장면과 고객 목소리를 결합합니다.", tags: ["background image", "brand", "quote"], termId: "testimonial-section", preview: "testimonials-bg-image" },
      { id: "side-by-side", eyebrow: "Marketing / Testimonials", title: "Side-by-side", description: "인용문과 인물 정보를 좌우로 나눠 데스크톱에서 균형 있게 보여줍니다.", tags: ["side-by-side", "profile", "quote"], termId: "testimonial-section", preview: "testimonials-side-by-side" },
      { id: "with-star-rating", eyebrow: "Marketing / Testimonials", title: "With star rating", description: "별점과 짧은 후기를 함께 배치해 리뷰형 신뢰 신호를 강화합니다.", tags: ["rating", "stars", "reviews"], termId: "testimonial-section", preview: "testimonials-star-rating" },
      { id: "grid", eyebrow: "Marketing / Testimonials", title: "Grid", description: "여러 고객 후기를 같은 비중의 카드 그리드로 보여주는 기본형입니다.", tags: ["grid", "quotes", "social proof"], termId: "testimonial-section", preview: "testimonials-grid" },
      { id: "subtle-grid", eyebrow: "Marketing / Testimonials", title: "Subtle grid", description: "낮은 대비의 카드 그리드로 후기 양을 보여주되 페이지 톤을 차분하게 유지합니다.", tags: ["subtle", "grid", "reviews"], termId: "testimonial-section", preview: "testimonials-subtle-grid" },
    ],
  }],
  [navFilter("plus-marketing-blog-sections"), {
    title: "Blog Sections",
    description: "블로그 글, 업데이트, 리소스 콘텐츠를 목록이나 대표 글 중심으로 보여주는 마케팅 섹션 예시입니다. 균일 그리드 계열과, 고정 사이드바가 목록과 짝을 이루는 축을 함께 다룹니다.",
    examples: [
      { id: "sticky-sidebar", eyebrow: "Marketing / Blog", title: "Sticky sidebar", description: "카테고리 사이드바가 스크롤에도 고정된 채 남고, 오른쪽 글 목록만 바뀌는 지속 내비게이션 구성입니다.", tags: ["sticky", "sidebar", "categories"], termId: "section", preview: "blog-sticky-sidebar" },
      { id: "three-column", eyebrow: "Marketing / Blog", title: "Three-column", description: "여러 글을 같은 비중으로 3열에 배치해 사용자가 관심 있는 주제를 빠르게 고르게 합니다.", tags: ["articles", "three column", "resources"], termId: "help-center-card", preview: "blog-three-column" },
      { id: "three-column-with-images", eyebrow: "Marketing / Blog", title: "Three-column with images", description: "각 글에 썸네일 이미지를 붙여 콘텐츠 성격을 시각적으로 구분합니다.", tags: ["images", "grid", "editorial"], termId: "image-card", preview: "blog-three-column-images" },
      { id: "three-column-with-background-images", eyebrow: "Marketing / Blog", title: "Three-column with background images", description: "배경 이미지 위에 글 정보를 올려 더 캠페인형인 article grid를 만듭니다.", tags: ["background image", "cards", "editorial"], termId: "image-card", preview: "blog-three-column-bg-images" },
      { id: "single-column", eyebrow: "Marketing / Blog", title: "Single-column", description: "글 목록을 세로로 쌓아 날짜와 제목 중심으로 조밀하게 훑게 합니다.", tags: ["single column", "list", "updates"], termId: "section", preview: "blog-single-column" },
      { id: "single-column-with-images", eyebrow: "Marketing / Blog", title: "Single-column with images", description: "리스트형 article row에 이미지를 붙여 스캔성과 시각 단서를 함께 제공합니다.", tags: ["single column", "images", "list"], termId: "media-object", preview: "blog-single-column-images" },
      { id: "with-featured-post", eyebrow: "Marketing / Blog", title: "With featured post", description: "대표 글 하나를 크게 강조하고 보조 글을 주변에 배치해 콘텐츠 우선순위를 만듭니다.", tags: ["featured", "editorial", "priority"], termId: "release-note-card", preview: "blog-featured" },
      { id: "with-photo-and-list", eyebrow: "Marketing / Blog", title: "With photo and list", description: "큰 사진과 compact list를 결합해 브랜드 장면과 최신 글 흐름을 같이 보여줍니다.", tags: ["photo", "list", "story"], termId: "media-object", preview: "blog-photo-list" },
    ],
  }],
  [navFilter("plus-marketing-contact-sections"), {
    title: "Contact Sections",
    description: "문의, 영업, 지원, 제휴 요청을 사용자가 바로 보낼 수 있게 안내하는 섹션 예시입니다.",
    examples: [
      { id: "centered", eyebrow: "Marketing / Contact", title: "Centered", description: "문의 메시지와 폼을 중앙에 모아 단일 행동에 집중시키는 contact section입니다.", tags: ["centered", "form", "sales"], termId: "text-field", preview: "contact-centered" },
      { id: "side-by-side-grid", eyebrow: "Marketing / Contact", title: "Side-by-side grid", description: "연락 맥락과 입력 폼을 좌우로 나눠 정보와 행동을 동시에 보여줍니다.", tags: ["side-by-side", "grid", "form"], termId: "text-field", preview: "contact-side-grid" },
      { id: "split-with-pattern", eyebrow: "Marketing / Contact", title: "Split with pattern", description: "패턴 배경 위에 split contact form을 올려 섹션 경계를 분명하게 만듭니다.", tags: ["split", "pattern", "form"], termId: "textarea", preview: "contact-split-pattern" },
      { id: "simple-four-column", eyebrow: "Marketing / Contact", title: "Simple four-column", description: "영업, 지원, 제휴, 채용처럼 목적별 연락 경로를 네 열로 분리합니다.", tags: ["four column", "routing", "support"], termId: "help-center-card", preview: "contact-four-column" },
      { id: "simple-centered", eyebrow: "Marketing / Contact", title: "Simple centered", description: "짧은 안내와 입력 필드만 남겨 가벼운 문의 행동을 받습니다.", tags: ["simple", "centered", "conversion"], termId: "text-field", preview: "contact-simple-centered" },
      { id: "with-testimonial", eyebrow: "Marketing / Contact", title: "With testimonial", description: "문의 폼 옆에 고객 인용을 배치해 연락 전 신뢰를 보강합니다.", tags: ["testimonial", "trust", "form"], termId: "testimonial-section", preview: "contact-testimonial" },
      { id: "split-with-image", eyebrow: "Marketing / Contact", title: "Split with image", description: "브랜드 이미지와 연락 폼을 나란히 배치해 더 editorial한 contact section을 만듭니다.", tags: ["image", "split", "brand"], termId: "image", preview: "contact-split-image" },
    ],
  }],
  [navFilter("plus-marketing-team-sections"), {
    title: "Team Sections",
    description: "창업자, 리더십, 팀원 정보를 아바타와 역할 설명으로 보여줘 신뢰와 조직 맥락을 만드는 섹션 예시입니다. 규칙적 그리드 계열과, 아바타가 공간에 흩어지는 산개형 축을 함께 다룹니다.",
    examples: [
      { id: "scatter-reveal", eyebrow: "Marketing / Team", title: "Scatter reveal", description: "아바타가 그리드가 아니라 공간에 산개 배치되고, 클릭하면 인물 정보가 리빌되는 인터랙티브 구성입니다.", tags: ["scatter", "interactive", "reveal"], termId: "avatar", preview: "team-scatter-reveal" },
      { id: "with-small-images", eyebrow: "Marketing / Team", title: "With small images", description: "작은 인물 이미지를 균일하게 나열해 팀의 얼굴과 역할을 빠르게 보여줍니다.", tags: ["small images", "people", "roles"], termId: "profile-card", preview: "team-small-images" },
      { id: "with-large-images", eyebrow: "Marketing / Team", title: "With large images", description: "큰 인물 이미지를 써서 사람 자체를 더 강한 신뢰 단서로 만듭니다.", tags: ["large images", "people", "trust"], termId: "profile-card", preview: "team-large-images" },
      { id: "grid-with-round-images", eyebrow: "Marketing / Team", title: "Grid with round images", description: "둥근 아바타 그리드로 친근하고 표준적인 team section을 만듭니다.", tags: ["round images", "grid", "avatars"], termId: "avatar", preview: "team-round-grid" },
      { id: "large-grid-with-cards", eyebrow: "Marketing / Team", title: "Large grid with cards", description: "카드 표면 안에 인물 이미지와 역할을 넣어 각 구성원을 독립적으로 읽게 합니다.", tags: ["cards", "grid", "team"], termId: "profile-card", preview: "team-card-grid" },
      { id: "with-image-and-short-paragraph", eyebrow: "Marketing / Team", title: "With image and short paragraph", description: "팀 소개 문단과 인물 목록을 결합해 조직 맥락을 먼저 설명합니다.", tags: ["paragraph", "image", "story"], termId: "profile-card", preview: "team-image-paragraph" },
      { id: "with-vertical-images", eyebrow: "Marketing / Team", title: "With vertical images", description: "세로 비율 이미지를 사용해 더 editorial한 인물 소개 섹션을 구성합니다.", tags: ["vertical images", "editorial", "people"], termId: "image-card", preview: "team-vertical-images" },
      { id: "full-width-with-vertical-images", eyebrow: "Marketing / Team", title: "Full width with vertical images", description: "전체 폭을 쓰는 세로 이미지 그리드로 팀 규모와 존재감을 크게 보여줍니다.", tags: ["full width", "vertical images", "team"], termId: "image-card", preview: "team-full-width-vertical" },
      { id: "grid-with-large-round-images", eyebrow: "Marketing / Team", title: "Grid with large round images", description: "큰 원형 이미지를 중심에 두어 리더십이나 핵심 멤버를 부드럽게 강조합니다.", tags: ["large round", "avatars", "grid"], termId: "avatar", preview: "team-large-round-grid" },
      { id: "with-medium-images", eyebrow: "Marketing / Team", title: "With medium images", description: "중간 크기 인물 이미지와 역할 텍스트를 균형 있게 배치하는 기본형입니다.", tags: ["medium images", "people", "grid"], termId: "profile-card", preview: "team-medium-images" },
    ],
  }],
  [navFilter("plus-marketing-content-sections"), {
    title: "Content Sections",
    description: "긴 설명, 제품 원칙, 사용 방법, 스토리텔링 콘텐츠를 읽기 좋은 흐름으로 배치하는 섹션 예시입니다.",
    examples: [
      { id: "with-sticky-product-screenshot", eyebrow: "Marketing / Content", title: "With sticky product screenshot", description: "설명 문단 옆에 제품 스크린샷을 고정해 읽는 동안 시각 맥락을 유지합니다.", tags: ["sticky", "screenshot", "product"], termId: "image", preview: "content-sticky-screenshot" },
      { id: "with-testimonial", eyebrow: "Marketing / Content", title: "With testimonial", description: "긴 설명 아래 고객 인용을 붙여 주장에 사회적 증거를 더합니다.", tags: ["testimonial", "content", "proof"], termId: "testimonial-section", preview: "content-testimonial" },
      { id: "with-image-titles", eyebrow: "Marketing / Content", title: "With image titles", description: "이미지와 소제목을 반복해 기능 설명을 magazine layout처럼 보여줍니다.", tags: ["image titles", "media", "story"], termId: "image-card", preview: "content-image-titles" },
      { id: "two-columns-with-screenshot", eyebrow: "Marketing / Content", title: "Two columns with screenshot", description: "본문과 제품 캡처를 두 열로 나눠 설명과 결과 화면을 동시에 보여줍니다.", tags: ["two column", "screenshot", "content"], termId: "image", preview: "content-two-column-screenshot" },
      { id: "with-testimonial-and-stats", eyebrow: "Marketing / Content", title: "With testimonial and stats", description: "인용과 지표를 함께 넣어 이야기와 수치 근거를 한 섹션에서 연결합니다.", tags: ["testimonial", "stats", "proof"], termId: "stat-list", preview: "content-testimonial-stats" },
      { id: "split-with-image", eyebrow: "Marketing / Content", title: "Split with image", description: "텍스트와 이미지를 좌우로 나눠 제품 설명을 더 시각적으로 전달합니다.", tags: ["split", "image", "story"], termId: "image", preview: "content-split-image" },
      { id: "centered", eyebrow: "Marketing / Content", title: "Centered", description: "중앙 정렬 텍스트만으로 짧은 원칙이나 메시지를 선명하게 전달합니다.", tags: ["centered", "prose", "message"], termId: "section", preview: "content-centered" },
    ],
  }],
  [navFilter("plus-marketing-logo-clouds"), {
    title: "Logo Clouds",
    description: "고객사, 파트너, 도입 조직 로고를 묶어 사회적 증거와 브랜드 신뢰를 만드는 섹션 예시입니다. 고정 배치 계열과, 로고 행이 끊김 없이 흐르는 마퀴 축을 함께 다룹니다.",
    examples: [
      { id: "scrolling-marquee", eyebrow: "Marketing / Logo Cloud", title: "Scrolling marquee", description: "고정 격자가 아니라 로고 행이 끊김 없이 좌측으로 흐르는 마퀴 구성으로, 애니메이션 자체가 골격입니다.", tags: ["marquee", "animation", "infinite"], termId: "logo", preview: "logo-cloud-marquee" },
      { id: "simple-with-heading", eyebrow: "Marketing / Logo Cloud", title: "Simple with heading", description: "짧은 heading 아래 로고를 나열해 신뢰 신호의 의미를 먼저 설명합니다.", tags: ["heading", "logos", "trust"], termId: "logo", preview: "logo-cloud-heading" },
      { id: "simple-with-call-to-action", eyebrow: "Marketing / Logo Cloud", title: "Simple with call-to-action", description: "고객 로고와 함께 사례 보기 같은 다음 행동을 붙입니다.", tags: ["CTA", "logos", "customers"], termId: "logo", preview: "logo-cloud-cta" },
      { id: "simple-left-aligned", eyebrow: "Marketing / Logo Cloud", title: "Simple left-aligned", description: "왼쪽 정렬로 본문 흐름 안에 자연스럽게 들어가는 logo cloud입니다.", tags: ["left aligned", "logos", "simple"], termId: "logo", preview: "logo-cloud-left" },
      { id: "split-with-logos-on-right", eyebrow: "Marketing / Logo Cloud", title: "Split with logos on right", description: "설명 텍스트를 왼쪽에 두고 로고 격자를 오른쪽에 배치합니다.", tags: ["split", "logos", "right"], termId: "logo", preview: "logo-cloud-split-right" },
      { id: "simple", eyebrow: "Marketing / Logo Cloud", title: "Simple", description: "가벼운 신뢰 신호가 필요할 때 로고만 한 줄로 나열하는 기본형입니다.", tags: ["simple", "logos", "row"], termId: "logo", preview: "logo-cloud-simple" },
      { id: "grid", eyebrow: "Marketing / Logo Cloud", title: "Grid", description: "고객이나 파트너 수가 많을 때 균일한 격자로 보여주는 형식입니다.", tags: ["grid", "customers", "partners"], termId: "logo", preview: "logo-cloud-grid" },
    ],
  }],
  [navFilter("plus-marketing-faqs"), {
    title: "FAQs",
    description: "자주 묻는 질문과 짧은 답변을 섹션 안에서 빠르게 확인하게 하는 FAQ 섹션 예시입니다. 정적 나열 계열과, 검색으로 목록을 좁히는 축을 함께 다룹니다.",
    examples: [
      { id: "search-accordion", eyebrow: "Marketing / FAQs", title: "Search accordion", description: "아코디언 위에 실시간 필터 검색창이 붙어, 큰 질문 세트를 훑는 대신 질의로 좁히는 구성입니다.", tags: ["search", "filter", "accordion"], termId: "faq-list", preview: "faqs-search-accordion" },
      { id: "offset-with-supporting-text", eyebrow: "Marketing / FAQs", title: "Offset with supporting text", description: "왼쪽에는 설명을, 오른쪽에는 질문 목록을 둬 FAQ의 맥락을 먼저 알려줍니다.", tags: ["offset", "supporting text", "questions"], termId: "faq-list", preview: "faqs-offset-supporting" },
      { id: "centered-accordion", eyebrow: "Marketing / FAQs", title: "Centered accordion", description: "질문을 중앙 정렬 accordion처럼 쌓아 FAQ를 단일 흐름으로 읽게 합니다.", tags: ["accordion", "centered", "answers"], termId: "accordion", preview: "faqs-centered-accordion" },
      { id: "side-by-side", eyebrow: "Marketing / FAQs", title: "Side-by-side", description: "소개 문구와 FAQ 목록을 좌우로 나눠 데스크톱에서 균형 있게 보여줍니다.", tags: ["side-by-side", "support", "questions"], termId: "faq-list", preview: "faqs-side-by-side" },
      { id: "three-columns", eyebrow: "Marketing / FAQs", title: "Three columns", description: "질문이 많을 때 3열로 나눠 한 화면에서 더 많은 답변을 보여줍니다.", tags: ["three columns", "dense", "support"], termId: "faq-list", preview: "faqs-three-columns" },
      { id: "three-columns-with-centered-introduction", eyebrow: "Marketing / FAQs", title: "Three columns with centered introduction", description: "중앙 소개 문구 아래 질문을 3열로 배치해 정보량과 정돈감을 같이 확보합니다.", tags: ["centered intro", "three columns", "FAQ"], termId: "faq-list", preview: "faqs-three-columns-centered" },
      { id: "two-columns", eyebrow: "Marketing / FAQs", title: "Two columns", description: "질문을 두 열로 나눠 가장 안정적인 FAQ grid를 만듭니다.", tags: ["two columns", "questions", "support"], termId: "faq-list", preview: "faqs-two-columns" },
      { id: "two-columns-with-centered-introduction", eyebrow: "Marketing / FAQs", title: "Two columns with centered introduction", description: "중앙 소개 문구 아래 2열 질문 목록을 배치하는 차분한 FAQ section입니다.", tags: ["centered intro", "two columns", "FAQ"], termId: "faq-list", preview: "faqs-two-columns-centered" },
    ],
  }],
  [navFilter("plus-marketing-footers"), {
    title: "Footers",
    description: "페이지 하단에서 보조 링크, 정책, 회사 정보, 구독 행동을 정리하는 푸터 섹션 예시입니다.",
    examples: [
      { id: "brand-wordmark", eyebrow: "Marketing / Footer", title: "Brand wordmark", description: "얇은 링크 행 아래 초대형 워드마크를 깔아 푸터를 브랜드 표면으로 쓰는 구성입니다.", tags: ["wordmark", "brand", "oversized type"], termId: "footer", preview: "footer-brand-wordmark" },
      { id: "four-column-with-company-mission", eyebrow: "Marketing / Footer", title: "4-column with company mission", description: "회사 설명과 여러 링크 그룹을 함께 배치해 큰 사이트 하단 정보를 정리합니다.", tags: ["mission", "four column", "links"], termId: "footer", preview: "footer-mission" },
      { id: "four-column-with-call-to-action", eyebrow: "Marketing / Footer", title: "4-column with call-to-action", description: "링크 그룹 위에 CTA를 붙여 하단에서도 전환 행동을 남깁니다.", tags: ["CTA", "four column", "footer"], termId: "footer", preview: "footer-cta" },
      { id: "four-column-simple", eyebrow: "Marketing / Footer", title: "4-column simple", description: "제품, 리소스, 회사 링크를 네 열로 나눠 정리하는 기본형입니다.", tags: ["simple", "columns", "links"], termId: "footer", preview: "footer-four-column-simple" },
      { id: "four-column-with-newsletter", eyebrow: "Marketing / Footer", title: "4-column with newsletter", description: "하단에서 보조 링크와 이메일 구독 행동을 함께 제공하는 형식입니다.", tags: ["newsletter", "footer CTA", "links"], termId: "footer", preview: "footer-newsletter" },
      { id: "four-column-with-newsletter-below", eyebrow: "Marketing / Footer", title: "4-column with newsletter below", description: "링크 묶음 아래에 newsletter 영역을 배치해 footer를 계층적으로 정리합니다.", tags: ["newsletter below", "columns", "footer"], termId: "footer", preview: "footer-newsletter-below" },
      { id: "simple-centered", eyebrow: "Marketing / Footer", title: "Simple centered", description: "작은 사이트에서 브랜드와 필수 링크만 중앙 정렬로 남기는 가벼운 footer입니다.", tags: ["centered", "simple", "legal"], termId: "footer", preview: "footer-centered" },
      { id: "simple-with-social-links", eyebrow: "Marketing / Footer", title: "Simple with social links", description: "간단한 footer에 소셜 링크 아이콘을 더해 외부 채널 이동을 제공합니다.", tags: ["social links", "simple", "footer"], termId: "footer", preview: "footer-social" },
    ],
  }],
  [navFilter("plus-marketing-headers"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Elements / Headers",
    title: "Headers",
    description: "페이지 상단의 브랜드, 링크, 인증, CTA를 독립적인 재사용 요소로 구성하는 헤더 예시입니다.",
    examples: [
      { id: "with-stacked-flyout-menu", eyebrow: "Marketing / Elements", title: "With stacked flyout menu", description: "상단 nav 아래에 stacked flyout panel을 붙여 제품 링크를 접힌 메뉴처럼 보여줍니다.", tags: ["flyout", "stacked", "nav"], termId: "header", preview: "element-header-stacked-flyout" },
      { id: "constrained", eyebrow: "Marketing / Elements", title: "Constrained", description: "헤더 폭을 콘텐츠 컨테이너에 맞춰 landing page 본문과 같은 rhythm을 유지합니다.", tags: ["constrained", "nav", "container"], termId: "header", preview: "element-header-constrained" },
      { id: "on-brand-background", eyebrow: "Marketing / Elements", title: "On brand background", description: "브랜드 컬러나 dark hero 위에 놓이는 header surface입니다.", tags: ["brand", "dark", "contrast"], termId: "header", preview: "element-header-brand-bg" },
      { id: "with-full-width-flyout-menu", eyebrow: "Marketing / Elements", title: "With full width flyout menu", description: "전체 폭 flyout으로 많은 product/resource link를 넓게 펼칩니다.", tags: ["full width", "flyout", "mega menu"], termId: "mega-menu", preview: "element-header-full-width-flyout" },
      { id: "full-width", eyebrow: "Marketing / Elements", title: "Full width", description: "브라우저 폭 전체를 쓰는 기본 header로 앱과 마케팅 페이지 모두에 붙기 쉽습니다.", tags: ["full width", "nav", "header"], termId: "header", preview: "element-header-full-width" },
      { id: "with-call-to-action", eyebrow: "Marketing / Elements", title: "With call-to-action", description: "오른쪽에 가입이나 시작 버튼을 두어 navigation과 conversion을 함께 처리합니다.", tags: ["CTA", "conversion", "nav"], termId: "header", preview: "element-header-cta" },
      { id: "with-multiple-flyout-menus", eyebrow: "Marketing / Elements", title: "With multiple flyout menus", description: "여러 nav item이 각자 flyout을 여는 복합 제품 사이트 header입니다.", tags: ["multiple flyouts", "navigation", "menu"], termId: "mega-menu", preview: "element-header-multiple-flyouts" },
      { id: "with-icons-in-mobile-menu", eyebrow: "Marketing / Elements", title: "With icons in mobile menu", description: "모바일 메뉴에서 항목별 아이콘을 함께 보여줘 작은 화면 탐색을 돕습니다.", tags: ["mobile", "icons", "menu"], termId: "mobile-nav", preview: "element-header-mobile-icons" },
      { id: "with-left-aligned-nav", eyebrow: "Marketing / Elements", title: "With left-aligned nav", description: "브랜드 옆에 navigation을 붙여 데스크톱에서 빠른 scan path를 만듭니다.", tags: ["left aligned", "nav", "desktop"], termId: "header", preview: "element-header-left-nav" },
      { id: "with-right-aligned-nav", eyebrow: "Marketing / Elements", title: "With right-aligned nav", description: "브랜드와 nav를 양끝으로 나눠 여백이 큰 header를 구성합니다.", tags: ["right aligned", "nav", "header"], termId: "header", preview: "element-header-right-nav" },
      { id: "with-centered-logo", eyebrow: "Marketing / Elements", title: "With centered logo", description: "로고를 중앙에 두고 양쪽에 navigation을 나눠 editorial한 균형을 만듭니다.", tags: ["centered logo", "nav", "brand"], termId: "header", preview: "element-header-centered-logo" },
    ],
  }],
  [navFilter("plus-marketing-flyout-menus"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Elements / Flyout Menus",
    title: "Flyout Menus",
    description: "상단 내비게이션의 항목을 눌렀을 때 제품군, 솔루션, 리소스를 펼쳐 보여주는 플라이아웃 메뉴 예시입니다.",
    examples: [
      { id: "stacked-with-footer-actions", eyebrow: "Marketing / Elements", title: "Stacked with footer actions", description: "세로 링크 목록 아래에 demo나 trial 같은 footer action을 붙이는 flyout입니다.", tags: ["stacked", "footer actions", "menu"], termId: "navbar-menu", preview: "flyout-stacked-footer-actions" },
      { id: "full-width-two-columns", eyebrow: "Marketing / Elements", title: "Full-width two-columns", description: "전체 폭 panel 안에서 메뉴 항목을 두 열로 나눠 많은 정보를 보여줍니다.", tags: ["full width", "two columns", "mega menu"], termId: "mega-menu", preview: "flyout-full-width-two-columns" },
      { id: "stacked-with-footer-list", eyebrow: "Marketing / Elements", title: "Stacked with footer list", description: "주요 링크 아래에 보조 list를 붙여 다음 탐색 후보를 남깁니다.", tags: ["stacked", "footer list", "resources"], termId: "navbar-menu", preview: "flyout-stacked-footer-list" },
      { id: "full-width", eyebrow: "Marketing / Elements", title: "Full-width", description: "넓은 megamenu surface로 여러 제품군과 리소스를 한 번에 펼칩니다.", tags: ["full width", "mega menu", "resources"], termId: "mega-menu", preview: "flyout-full-width" },
      { id: "simple-with-descriptions", eyebrow: "Marketing / Elements", title: "Simple with descriptions", description: "각 메뉴 항목에 짧은 설명을 붙여 사용자가 목적지를 더 쉽게 고르게 합니다.", tags: ["descriptions", "links", "compact"], termId: "navbar-menu", preview: "flyout-simple-descriptions" },
      { id: "two-column", eyebrow: "Marketing / Elements", title: "Two-column", description: "중간 크기 flyout을 두 열로 나눠 정보량과 compact함을 균형 있게 유지합니다.", tags: ["two column", "menu", "navigation"], termId: "mega-menu", preview: "flyout-two-column" },
      { id: "simple", eyebrow: "Marketing / Elements", title: "Simple", description: "몇 개의 링크만 보여주는 가장 가벼운 flyout menu입니다.", tags: ["simple", "links", "compact"], termId: "navbar-menu", preview: "flyout-simple" },
    ],
  }],
  [navFilter("plus-marketing-banners"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Elements / Banners",
    title: "Banners",
    description: "공지, 출시, 프로모션, 캠페인처럼 페이지 흐름 위에 짧은 메시지와 행동을 얹는 배너 예시입니다.",
    examples: [
      { id: "with-button", eyebrow: "Marketing / Elements", title: "With button", description: "짧은 공지 메시지 옆에 명확한 button action을 둔 banner입니다.", tags: ["button", "announcement", "CTA"], termId: "announcement-banner", preview: "banner-with-button" },
      { id: "on-dark", eyebrow: "Marketing / Elements", title: "On dark", description: "dark surface 위에서 high-contrast banner로 공지를 띄웁니다.", tags: ["dark", "contrast", "announcement"], termId: "announcement-banner", preview: "banner-on-dark" },
      { id: "on-brand", eyebrow: "Marketing / Elements", title: "On brand", description: "브랜드 컬러 배경으로 프로모션이나 출시 공지를 강하게 강조합니다.", tags: ["brand", "color", "promo"], termId: "announcement-banner", preview: "banner-on-brand" },
      { id: "with-background-glow", eyebrow: "Marketing / Elements", title: "With background glow", description: "은은한 glow 배경으로 banner를 페이지 흐름 안에서 더 눈에 띄게 만듭니다.", tags: ["glow", "background", "announcement"], termId: "announcement-banner", preview: "banner-bg-glow" },
      { id: "with-link", eyebrow: "Marketing / Elements", title: "With link", description: "작은 링크만 붙여 가벼운 update banner로 사용합니다.", tags: ["link", "announcement", "subtle"], termId: "announcement-banner", preview: "banner-with-link" },
      { id: "left-aligned", eyebrow: "Marketing / Elements", title: "Left-aligned", description: "메시지를 왼쪽에 붙여 콘텐츠 본문과 정렬되는 banner입니다.", tags: ["left aligned", "notice", "layout"], termId: "announcement-banner", preview: "banner-left-aligned" },
      { id: "bottom-aligned", eyebrow: "Marketing / Elements", title: "Bottom aligned", description: "화면 하단 흐름에 맞춰 배치되는 campaign banner입니다.", tags: ["bottom", "sticky", "campaign"], termId: "announcement-banner", preview: "banner-bottom-aligned" },
      { id: "floating-at-bottom", eyebrow: "Marketing / Elements", title: "Floating at bottom", description: "콘텐츠 위에 떠 있는 하단 banner로 일시적 안내를 강조합니다.", tags: ["floating", "bottom", "notice"], termId: "announcement-banner", preview: "banner-floating-bottom" },
      { id: "floating-at-bottom-centered", eyebrow: "Marketing / Elements", title: "Floating at bottom centered", description: "화면 하단 중앙에 떠 있는 compact banner입니다.", tags: ["floating", "centered", "bottom"], termId: "announcement-banner", preview: "banner-floating-bottom-centered" },
      { id: "privacy-notice-right-aligned", eyebrow: "Marketing / Elements", title: "Privacy notice right-aligned", description: "개인정보 안내와 동의 버튼을 오른쪽 행동 중심으로 배치합니다.", tags: ["privacy", "right aligned", "notice"], termId: "announcement-banner", preview: "banner-privacy-right" },
      { id: "privacy-notice-centered", eyebrow: "Marketing / Elements", title: "Privacy notice centered", description: "privacy notice를 중앙 정렬로 보여줘 짧고 명확하게 동의를 받습니다.", tags: ["privacy", "centered", "notice"], termId: "announcement-banner", preview: "banner-privacy-centered" },
      { id: "privacy-notice-left-aligned", eyebrow: "Marketing / Elements", title: "Privacy notice left-aligned", description: "privacy copy를 왼쪽 정렬로 본문처럼 읽히게 합니다.", tags: ["privacy", "left aligned", "notice"], termId: "announcement-banner", preview: "banner-privacy-left" },
      { id: "privacy-notice-full-width", eyebrow: "Marketing / Elements", title: "Privacy notice full width", description: "페이지 폭 전체를 쓰는 privacy banner로 정책 안내를 빠짐없이 보여줍니다.", tags: ["privacy", "full width", "notice"], termId: "announcement-banner", preview: "banner-privacy-full" },
    ],
  }],
  [navFilter("plus-marketing-feedback"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Feedback",
    title: "Feedback",
    description: "마케팅 사이트에서 실패, 빈 상태, 방향 전환이 필요한 순간을 브랜드 톤으로 설명하는 페이지 묶음입니다.",
    examples: [
      { id: "marketing-feedback-404", eyebrow: "Marketing / Feedback", title: "404 page", description: "없는 페이지에 도착했을 때 이유와 다음 탐색 행동을 제공합니다.", tags: ["404", "recovery", "navigation"], termId: "empty-state", preview: "not-found-centered" },
      { id: "marketing-feedback-search", eyebrow: "Marketing / Feedback", title: "Search recovery", description: "찾는 내용이 없을 때 검색, 홈, 인기 링크로 회복할 수 있게 합니다.", tags: ["search", "empty", "links"], termId: "empty-search-result", preview: "not-found-search" },
      { id: "marketing-feedback-split", eyebrow: "Marketing / Feedback", title: "Split recovery", description: "문제 설명과 브랜드 이미지를 나란히 두어 이탈을 줄입니다.", tags: ["split", "brand", "recovery"], termId: "error-state", preview: "not-found-split" },
    ],
  }],
  [navFilter("plus-marketing-404-pages"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Feedback / 404 Pages",
    title: "404 Pages",
    description: "없는 페이지에 도착한 사용자가 다시 탐색하거나 도움을 받을 수 있게 회복 경로를 제공하는 오류 페이지 예시입니다.",
    examples: [
      { id: "simple", eyebrow: "Marketing / Feedback", title: "Simple", description: "오류 코드, 짧은 설명, 홈 이동 버튼만 남긴 가장 단순한 404 page입니다.", tags: ["simple", "error", "recovery"], termId: "error-state", preview: "not-found-simple" },
      { id: "split-with-image", eyebrow: "Marketing / Feedback", title: "Split with image", description: "왼쪽에는 설명과 행동, 오른쪽에는 큰 오류 그래픽을 배치합니다.", tags: ["split", "image", "brand"], termId: "error-state", preview: "not-found-split" },
      { id: "with-popular-pages", eyebrow: "Marketing / Feedback", title: "With popular pages", description: "자주 방문하는 페이지 링크를 함께 보여줘 회복 경로를 넓힙니다.", tags: ["popular pages", "links", "recovery"], termId: "empty-state", preview: "not-found-popular" },
      { id: "with-background-image", eyebrow: "Marketing / Feedback", title: "With background image", description: "배경 이미지를 깔아 brand-heavy한 404 recovery 화면을 만듭니다.", tags: ["background image", "brand", "404"], termId: "error-state", preview: "not-found-background-image" },
      { id: "with-navbar-and-footer", eyebrow: "Marketing / Feedback", title: "With navbar and footer", description: "오류 화면에서도 상단 nav와 footer를 유지해 탐색 맥락을 잃지 않게 합니다.", tags: ["navbar", "footer", "recovery"], termId: "header", preview: "not-found-navbar-footer" },
    ],
  }],
  [navFilter("plus-marketing-page-examples"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Page Examples",
    title: "Page Examples",
    description: "마케팅 섹션을 조합해 완성 페이지 단위로 보여주는 landing, pricing, about page 예시 묶음입니다.",
    examples: [
      { id: "marketing-page-example-landing", eyebrow: "Marketing / Page Examples", title: "Landing page", description: "Hero, features, social proof, CTA를 하나의 제품 소개 흐름으로 연결합니다.", tags: ["landing", "product", "conversion"], termId: "hero", preview: "landing-saas" },
      { id: "marketing-page-example-pricing", eyebrow: "Marketing / Page Examples", title: "Pricing page", description: "플랜 카드, 비교표, FAQ를 결제 전 의사결정 흐름으로 구성합니다.", tags: ["pricing", "plans", "FAQ"], termId: "pricing-section", preview: "pricing-comparison-page" },
      { id: "marketing-page-example-about", eyebrow: "Marketing / Page Examples", title: "About page", description: "회사 이야기, 팀, 가치, 신뢰 증거를 한 페이지로 묶습니다.", tags: ["about", "team", "story"], termId: "testimonial-section", preview: "about-team-page" },
    ],
  }],
  [navFilter("plus-marketing-landing-pages"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Page Examples / Landing Pages",
    title: "Landing Pages",
    description: "제품 소개, 기능 설명, 신뢰 신호, 가격 또는 CTA를 한 흐름으로 연결하는 완성형 랜딩 페이지 예시입니다.",
    examples: [
      { id: "with-screenshots-and-stats", eyebrow: "Marketing / Page Example", title: "With screenshots and stats", description: "제품 캡처와 지표를 함께 보여줘 기능 설명과 proof를 한 페이지에서 연결합니다.", tags: ["screenshots", "stats", "landing"], termId: "hero", preview: "landing-screenshots-stats" },
      { id: "with-large-screenshot-and-testimonial", eyebrow: "Marketing / Page Example", title: "With large screenshot and testimonial", description: "큰 제품 스크린샷과 고객 인용을 결합해 신뢰를 만드는 landing page입니다.", tags: ["large screenshot", "testimonial", "proof"], termId: "testimonial-section", preview: "landing-large-screenshot-testimonial" },
      { id: "with-background-image-hero-and-pricing-section", eyebrow: "Marketing / Page Example", title: "With background image hero and pricing section", description: "이미지 hero와 pricing section을 같은 페이지 흐름으로 묶습니다.", tags: ["background image", "pricing", "hero"], termId: "pricing-section", preview: "landing-bg-hero-pricing" },
      { id: "with-mobile-screenshot-and-testimonials-grid", eyebrow: "Marketing / Page Example", title: "With mobile screenshot and testimonials grid", description: "모바일 제품 캡처와 testimonial grid를 함께 보여주는 app landing layout입니다.", tags: ["mobile screenshot", "testimonials", "grid"], termId: "testimonial-section", preview: "landing-mobile-testimonials" },
    ],
  }],
  [navFilter("plus-marketing-pricing-pages"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Page Examples / Pricing Pages",
    title: "Pricing Pages",
    description: "요금제 카드, 기능 비교, FAQ, 영업 문의를 한 페이지에서 비교하게 만드는 완성형 가격 페이지 예시입니다.",
    examples: [
      { id: "with-four-tiers", eyebrow: "Marketing / Page Example", title: "With four tiers", description: "네 가지 플랜을 한 화면에서 비교해 세분화된 가격 선택을 제공합니다.", tags: ["four tiers", "plans", "pricing"], termId: "pricing-section", preview: "pricing-four-tiers-page" },
      { id: "with-comparison-table", eyebrow: "Marketing / Page Example", title: "With comparison table", description: "카드 아래 비교표를 붙여 기능 차이가 많은 가격 페이지를 완성합니다.", tags: ["comparison table", "features", "pricing"], termId: "pricing-section", preview: "pricing-comparison-table-page" },
      { id: "with-three-tiers-and-testimonials", eyebrow: "Marketing / Page Example", title: "With three tiers and testimonials", description: "세 가지 요금제와 testimonial을 결합해 가격 결정 전 신뢰를 보강합니다.", tags: ["three tiers", "testimonials", "pricing"], termId: "testimonial-section", preview: "pricing-three-tiers-testimonials-page" },
    ],
  }],
  [navFilter("plus-marketing-about-pages"), {
    breadcrumb: "Plus / UI Blocks / Marketing / Page Examples / About Pages",
    title: "About Pages",
    description: "브랜드의 이야기, 미션, 팀, 신뢰 근거를 묶어 방문자가 조직을 이해하게 하는 완성형 소개 페이지 예시입니다.",
    examples: [
      { id: "with-image-tiles", eyebrow: "Marketing / Page Example", title: "With image tiles", description: "여러 이미지 타일로 회사 분위기와 사람, 제품 맥락을 시각적으로 보여줍니다.", tags: ["image tiles", "brand", "about"], termId: "image-gallery", preview: "about-image-tiles" },
      { id: "with-timeline-and-stats", eyebrow: "Marketing / Page Example", title: "With timeline and stats", description: "회사 성장 흐름과 핵심 지표를 함께 보여줘 서사와 성과를 연결합니다.", tags: ["timeline", "stats", "company"], termId: "timeline", preview: "about-timeline-stats" },
      { id: "with-two-column-description", eyebrow: "Marketing / Page Example", title: "With two column description", description: "긴 회사 소개를 두 열로 나눠 읽기 좋은 about page 구조를 만듭니다.", tags: ["two column", "description", "story"], termId: "section", preview: "about-two-column-description" },
    ],
  }],
  [navFilter("plus-application-shells"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Application Shells",
    title: "Application Shells",
    description: "반복 사용되는 앱 화면의 바깥 구조입니다. 사이드바, 상단바, 콘텐츠 영역, 보조 패널을 조합해 제품의 기본 작업 공간을 만듭니다.",
    examples: [
      { id: "sidebar-shell", eyebrow: "Application UI / Shell", title: "Sidebar application shell", description: "좌측 사이드바와 넓은 작업 영역을 고정해 관리 도구의 반복 탐색을 안정적으로 만드는 기본형입니다.", tags: ["sidebar", "dashboard", "workspace"], termId: "app-shell", preview: "app-shell-sidebar" },
      { id: "stacked-shell", eyebrow: "Application UI / Shell", title: "Stacked navigation shell", description: "상단 내비게이션을 기준으로 콘텐츠가 아래에 쌓이는 구조입니다. 섹션 수가 적은 SaaS 앱에 적합합니다.", tags: ["top nav", "simple app", "workspace"], termId: "app-shell", preview: "app-shell-stacked" },
      { id: "split-shell", eyebrow: "Application UI / Shell", title: "Split detail shell", description: "주 작업 영역과 우측 세부 패널을 함께 보여줘 선택 항목의 맥락을 잃지 않게 하는 구조입니다.", tags: ["detail panel", "split view", "productivity"], termId: "sidebar-dashboard-layout", preview: "app-shell-split" },
    ],
  }],
  [navFilter("plus-application-shells-stacked-layouts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Application Shells / Stacked Layouts",
    title: "Stacked Layouts",
    description: "상단 내비게이션과 콘텐츠가 위아래로 쌓이는 간결한 앱 셸 구조입니다.",
    examples: [
      ["With lighter page header", "shell-stacked-lighter-header"],
      ["With bottom border", "shell-stacked-bottom-border"],
      ["On subtle background", "shell-stacked-subtle-background"],
      ["Branded nav with compact lighter page header", "shell-stacked-brand-compact-header"],
      ["With overlap", "shell-stacked-overlap"],
      ["Brand nav with overlap", "shell-stacked-brand-overlap"],
      ["Branded nav with lighter page header", "shell-stacked-brand-lighter-header"],
      ["With compact lighter page header", "shell-stacked-compact-header"],
      ["Two-row navigation with overlap", "shell-stacked-two-row-overlap"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Shell",
      title,
      description: "Tailwind의 stacked application shell 예시 이름과 개수를 맞춘 상단 내비게이션 앱 셸 변형입니다.",
      tags: ["stacked", "app shell", "navigation"],
      termId: "app-shell",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-shells-sidebar-layouts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Application Shells / Sidebar Layouts",
    title: "Sidebar Layouts",
    description: "좌측 사이드바를 기준으로 반복 탐색과 작업 화면을 구성하는 앱 셸 구조입니다.",
    examples: [
      ["Simple sidebar", "shell-sidebar-simple"],
      ["Simple dark sidebar", "shell-sidebar-dark"],
      ["Sidebar with header", "shell-sidebar-with-header"],
      ["Dark sidebar with header", "shell-sidebar-dark-with-header"],
      ["With constrained content area", "shell-sidebar-constrained"],
      ["With off-white background", "shell-sidebar-off-white"],
      ["Simple brand sidebar", "shell-sidebar-brand"],
      ["Brand sidebar with header", "shell-sidebar-brand-with-header"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Shell",
      title,
      description: "Tailwind의 sidebar application shell 예시 이름과 개수를 맞춘 사이드바 앱 셸 변형입니다.",
      tags: ["sidebar", "app shell", "workspace"],
      termId: "app-shell",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-shells-multi-column-layouts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Application Shells / Multi-Column Layouts",
    title: "Multi-Column Layouts",
    description: "목록, 본문, 속성 패널처럼 여러 작업 영역을 나란히 보여주는 앱 셸 구조입니다.",
    examples: [
      ["Full-width three-column", "shell-multi-full-three-column"],
      ["Full-width secondary column on right", "shell-multi-secondary-right"],
      ["Constrained three column", "shell-multi-constrained-three-column"],
      ["Constrained with sticky columns", "shell-multi-sticky-columns"],
      ["Full-width with narrow sidebar", "shell-multi-narrow-sidebar"],
      ["Full-width with narrow sidebar and header", "shell-multi-narrow-sidebar-header"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Shell",
      title,
      description: "Tailwind의 multi-column application shell 예시 이름과 개수를 맞춘 다중 열 앱 셸 변형입니다.",
      tags: ["multi column", "app shell", "detail"],
      termId: "sidebar-dashboard-layout",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-headings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Headings",
    title: "Headings",
    description: "페이지, 카드, 섹션 위에서 현재 맥락과 다음 행동을 정리하는 제목 패턴입니다.",
    examples: [
      { id: "overview-heading", eyebrow: "Application UI / Headings", title: "Page heading", description: "화면 목적, 설명, 주요 행동을 한 곳에서 정리합니다.", tags: ["title", "description", "action"], termId: "typography", preview: "heading-page" },
      { id: "card-heading-overview", eyebrow: "Application UI / Headings", title: "Card heading", description: "작은 표면 안에서 제목, 상태, 보조 행동을 압축해 보여줍니다.", tags: ["card", "metadata", "action"], termId: "card", preview: "heading-page" },
      { id: "section-heading-overview", eyebrow: "Application UI / Headings", title: "Section heading", description: "한 화면 안의 정보 묶음을 읽기 쉬운 단위로 나눕니다.", tags: ["section", "grouping", "scan"], termId: "section", preview: "heading-page" },
    ],
  }],
  [navFilter("plus-application-headings-page-headings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Headings / Page Headings",
    title: "Page Headings",
    description: "앱 화면 최상단에서 현재 화면의 목적과 주요 행동을 알려주는 제목 패턴입니다.",
    examples: [
      ["With meta and actions", "heading-meta-actions"],
      ["With actions", "heading-actions"],
      ["With actions and breadcrumbs", "heading-actions-breadcrumbs"],
      ["With banner image", "heading-banner-image"],
      ["With avatar and actions", "heading-avatar-actions"],
      ["Card with avatar and stats", "heading-card-avatar-stats"],
      ["With meta, actions, and breadcrumbs", "heading-meta-actions-breadcrumbs"],
      ["With filters and action", "heading-filters-action"],
      ["With logo, meta and actions", "heading-logo-meta-actions"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Headings",
      title,
      description: "Tailwind의 page heading 예시 이름과 개수를 맞춘 화면 상단 제목 변형입니다.",
      tags: ["page heading", "actions", "metadata"],
      termId: "typography",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-headings-card-headings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Headings / Card Headings",
    title: "Card Headings",
    description: "카드와 작은 패널 안에서 제목, 설명, 상태, 보조 행동을 조밀하게 정리하는 제목 패턴입니다.",
    examples: [
      ["Simple", "card-heading-simple"],
      ["With action", "card-heading-action"],
      ["With avatar and actions", "card-heading-avatar-actions"],
      ["With description and action", "card-heading-description-action"],
      ["With description", "card-heading-description"],
      ["With avatar, meta, and dropdown", "card-heading-avatar-meta-dropdown"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Headings",
      title,
      description: "Tailwind의 card heading 예시 이름과 개수를 맞춘 카드 상단 제목 변형입니다.",
      tags: ["card heading", "metadata", "action"],
      termId: "card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-headings-section-headings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Headings / Section Headings",
    title: "Section Headings",
    description: "설정, 상세, 대시보드 안에서 정보 묶음을 구분하는 제목 패턴입니다.",
    examples: [
      ["Simple", "section-heading-simple"],
      ["With description", "section-heading-description"],
      ["With actions", "section-heading-actions"],
      ["With action", "section-heading-action"],
      ["With input group", "section-heading-input-group"],
      ["With tabs", "section-heading-tabs"],
      ["With actions and tabs", "section-heading-actions-tabs"],
      ["With inline tabs", "section-heading-inline-tabs"],
      ["With label", "section-heading-label"],
      ["With badge and dropdown", "section-heading-badge-dropdown"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Headings",
      title,
      description: "Tailwind의 section heading 예시 이름과 개수를 맞춘 섹션 제목 변형입니다.",
      tags: ["section heading", "tabs", "actions"],
      termId: "section",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-headings-table-headings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Headings / Table Headings",
    title: "Table Headings",
    description: "데이터 테이블 위에서 목록 의미와 조작 도구를 정리하는 제목 패턴입니다.",
    examples: [
      { id: "table-toolbar-heading", eyebrow: "Application UI / Headings", title: "Table heading with toolbar", description: "검색, 필터, 내보내기 같은 행동을 표 제목 근처에 둡니다.", tags: ["table", "toolbar", "actions"], termId: "data-table-toolbar", preview: "table-heading-toolbar" },
      { id: "basic-table-heading", eyebrow: "Application UI / Headings", title: "Basic table heading", description: "행과 열 데이터가 무엇을 의미하는지 먼저 알려줍니다.", tags: ["table", "data", "title"], termId: "table", preview: "table-heading-basic" },
      { id: "filter-table-heading", eyebrow: "Application UI / Headings", title: "Table heading with filters", description: "필터 조건과 결과 수를 표 제목과 함께 보여줍니다.", tags: ["filter", "results", "data"], termId: "filter-bar", preview: "table-heading-filters" },
    ],
  }],
  [navFilter("plus-data-display"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display",
    title: "Data Display",
    description: "테이블, 지표, 빈 상태처럼 운영 화면에서 데이터를 읽고 비교하고 다음 행동으로 이어지게 하는 표시 패턴입니다.",
    examples: [
      { id: "data-table-example", eyebrow: "Application UI / Data", title: "Data table with toolbar", description: "행 목록, 상태, 소유자, 마지막 변경 정보를 테이블로 보여주고 상단 도구로 후속 행동을 연결합니다.", tags: ["table", "toolbar", "operations"], termId: "data-table-toolbar", preview: "data-table" },
      { id: "metrics-overview", eyebrow: "Application UI / Data", title: "Metrics overview", description: "대시보드 상단에서 핵심 수치를 같은 규칙으로 묶어 현재 상태를 빠르게 파악하게 합니다.", tags: ["metrics", "dashboard", "summary"], termId: "stat-list", preview: "data-metrics" },
      { id: "empty-table-state", eyebrow: "Application UI / Data", title: "Empty table state", description: "필터나 검색 결과가 없을 때 이유와 회복 행동을 함께 보여주는 데이터 화면의 빈 상태입니다.", tags: ["empty state", "filters", "recovery"], termId: "empty-table", preview: "data-empty" },
    ],
  }],
  [navFilter("plus-application-elements"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements",
    title: "Elements",
    description: "앱 화면에서 반복적으로 쓰이는 작은 UI 원자들을 조합하는 패턴입니다.",
    examples: [
      { id: "avatar-elements", eyebrow: "Application UI / Elements", title: "Avatar elements", description: "사람, 계정, 담당자를 시각적으로 식별합니다.", tags: ["people", "identity", "status"], termId: "avatar", preview: "element-avatar-page" },
      { id: "badge-elements", eyebrow: "Application UI / Elements", title: "Badge elements", description: "상태, 역할, 속성을 작은 라벨로 표시합니다.", tags: ["status", "metadata", "label"], termId: "badge", preview: "element-badge-page" },
      { id: "button-elements", eyebrow: "Application UI / Elements", title: "Button elements", description: "명확한 명령과 주요 행동을 실행합니다.", tags: ["action", "command", "CTA"], termId: "button", preview: "element-button-page" },
    ],
  }],
  [navFilter("plus-application-elements-avatars"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements / Avatars",
    title: "Avatars",
    description: "사용자, 팀, 담당자를 작은 얼굴 또는 이니셜로 식별하는 요소 패턴입니다.",
    examples: [
      ["Avatar group stacked bottom to top", "avatar-group-bottom-top"],
      ["Circular avatars", "avatar-circular"],
      ["Rounded avatars", "avatar-rounded"],
      ["Circular avatars with top notification", "avatar-circular-top-notification"],
      ["Rounded avatars with top notification", "avatar-rounded-top-notification"],
      ["Circular avatars with bottom notification", "avatar-circular-bottom-notification"],
      ["Rounded avatars with bottom notification", "avatar-rounded-bottom-notification"],
      ["Circular avatars with placeholder icon", "avatar-placeholder-icon"],
      ["Circular avatars with placeholder initials", "avatar-placeholder-initials"],
      ["Avatar group stacked top to bottom", "avatar-group-top-bottom"],
      ["With text", "avatar-with-text"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Elements",
      title,
      description: "Tailwind의 avatar 예시 이름과 개수를 맞춘 사용자 식별 요소 변형입니다.",
      tags: ["avatar", "identity", "people"],
      termId: "avatar",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-elements-badges"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements / Badges",
    title: "Badges",
    description: "상태, 역할, 속성, 개수를 작은 라벨로 빠르게 구분하는 요소 패턴입니다.",
    examples: [
      ["With border", "badge-border"],
      ["With border and dot", "badge-border-dot"],
      ["Pill with border", "badge-pill-border"],
      ["Pill with border and dot", "badge-pill-border-dot"],
      ["With border and remove button", "badge-border-remove"],
      ["Flat", "badge-flat"],
      ["Flat pill", "badge-flat-pill"],
      ["Flat with dot", "badge-flat-dot"],
      ["Flat pill with dot", "badge-flat-pill-dot"],
      ["Flat with remove button", "badge-flat-remove"],
      ["Small with border", "badge-small-border"],
      ["Small flat", "badge-small-flat"],
      ["Small pill with border", "badge-small-pill-border"],
      ["Small flat pill", "badge-small-flat-pill"],
      ["Small flat with dot", "badge-small-flat-dot"],
      ["Small flat pill with dot", "badge-small-flat-pill-dot"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Elements",
      title,
      description: "Tailwind의 badge 예시 이름과 개수를 맞춘 상태 라벨 변형입니다.",
      tags: ["badge", "status", "label"],
      termId: "badge",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-elements-dropdowns"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements / Dropdowns",
    title: "Dropdowns",
    description: "보조 명령, 계정 전환, 경로 축약을 작은 메뉴로 숨기는 요소 패턴입니다.",
    examples: [
      ["Simple", "dropdown-simple"],
      ["With dividers", "dropdown-dividers"],
      ["With icons", "dropdown-icons"],
      ["With minimal menu icon", "dropdown-minimal-icon"],
      ["With simple header", "dropdown-simple-header"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Elements",
      title,
      description: "Tailwind의 dropdown 예시 이름과 개수를 맞춘 메뉴 변형입니다.",
      tags: ["dropdown", "menu", "actions"],
      termId: "dropdown-menu",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-elements-buttons"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements / Buttons",
    title: "Buttons",
    description: "사용자가 명령을 실행하거나 흐름을 진행하게 하는 기본 행동 요소입니다.",
    examples: [
      ["Primary buttons", "button-primary"],
      ["Secondary buttons", "button-secondary"],
      ["Soft buttons", "button-soft"],
      ["Buttons with leading icon", "button-leading-icon"],
      ["Buttons with trailing icon", "button-trailing-icon"],
      ["Rounded primary buttons", "button-rounded-primary"],
      ["Rounded secondary buttons", "button-rounded-secondary"],
      ["Circular buttons", "button-circular"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Elements",
      title,
      description: "Tailwind의 button 예시 이름과 개수를 맞춘 명령 버튼 변형입니다.",
      tags: ["button", "action", "command"],
      termId: "button",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-elements-button-groups"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Elements / Button Groups",
    title: "Button Groups",
    description: "관련 행동이나 보기 모드를 하나의 묶음으로 제공하는 요소 패턴입니다.",
    examples: [
      ["Basic", "button-group-basic"],
      ["Icon only", "button-group-icon-only"],
      ["With stat", "button-group-stat"],
      ["With dropdown", "button-group-dropdown"],
      ["With checkbox and dropdown", "button-group-checkbox-dropdown"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Elements",
      title,
      description: "Tailwind의 button group 예시 이름과 개수를 맞춘 묶음 버튼 변형입니다.",
      tags: ["button group", "toolbar", "actions"],
      termId: "button-group",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-layout"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout",
    title: "Layout",
    description: "앱 화면의 폭, 패널, 구분선을 정해 밀도 높은 정보를 읽기 쉽게 만드는 구조 패턴입니다.",
    examples: [
      { id: "container-layout-overview", eyebrow: "Application UI / Layout", title: "Containers", description: "내용 폭과 정렬 기준을 유지합니다.", tags: ["width", "alignment", "content"], termId: "container", preview: "layout-container-page" },
      { id: "panel-layout-overview", eyebrow: "Application UI / Layout", title: "Panels", description: "주 작업 영역과 보조 영역을 분리합니다.", tags: ["panels", "regions", "workspace"], termId: "split-pane", preview: "layout-panel-page" },
      { id: "divider-layout-overview", eyebrow: "Application UI / Layout", title: "Dividers", description: "구역 사이 경계를 낮은 비용으로 만듭니다.", tags: ["divider", "separation", "density"], termId: "divider", preview: "layout-divider-page" },
    ],
  }],
  [navFilter("plus-application-layout-containers"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / Containers",
    title: "Containers",
    description: "화면 폭과 콘텐츠 정렬을 제어해 읽기 좋은 작업 영역을 만드는 레이아웃 패턴입니다.",
    examples: [
      ["Full-width on mobile, constrained with padded content above", "container-mobile-full-padded"],
      ["Constrained with padded content", "container-constrained-padded"],
      ["Full-width on mobile, constrained to breakpoint with padded content above mobile", "container-mobile-full-breakpoint"],
      ["Constrained to breakpoint with padded content", "container-breakpoint-padded"],
      ["Narrow constrained with padded content", "container-narrow-padded"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Layout",
      title,
      description: "Tailwind의 container 예시 이름과 개수를 맞춘 콘텐츠 폭 변형입니다.",
      tags: ["container", "width", "layout"],
      termId: "container",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-layout-cards"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / Cards",
    title: "Cards",
    description: "관련 정보와 행동을 작은 표면 하나에 묶어 목록, 대시보드, 설정 화면에서 반복 배치하는 레이아웃 패턴입니다.",
    examples: [
      ["Basic card", "card-basic"],
      ["Card, edge-to-edge on mobile", "card-edge-mobile"],
      ["Card with header", "card-header"],
      ["Card with footer", "card-footer"],
      ["Card with header and footer", "card-header-footer"],
      ["Card with gray footer", "card-gray-footer"],
      ["Card with gray body", "card-gray-body"],
      ["Well", "card-well"],
      ["Well on gray", "card-well-gray"],
      ["Well, edge-to-edge on mobile", "card-well-edge-mobile"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Layout",
      title,
      description: "Tailwind의 card 예시 이름과 개수를 맞춘 표면 레이아웃 변형입니다.",
      tags: ["card", "surface", "layout"],
      termId: "card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-layout-list-containers"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / List containers",
    title: "List containers",
    description: "목록, 표, 피드를 감싸는 폭과 경계, 헤더, 하단 행동을 정해 반복 항목을 읽기 쉽게 만드는 레이아웃 패턴입니다.",
    examples: [
      ["Simple with dividers", "list-simple-dividers"],
      ["Card with dividers", "list-card-dividers"],
      ["Card with dividers, full-width on mobile", "list-card-dividers-mobile-full"],
      ["Separate cards", "list-separate-cards"],
      ["Separate cards, full-width on mobile", "list-separate-cards-mobile-full"],
      ["Flat card with dividers", "list-flat-card-dividers"],
      ["Simple with dividers, full-width on mobile", "list-simple-dividers-mobile-full"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Layout",
      title,
      description: "Tailwind의 list container 예시 이름과 개수를 맞춘 목록 컨테이너 변형입니다.",
      tags: ["list container", "rows", "layout"],
      termId: "activity-feed",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-layout-media-objects"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / Media Objects",
    title: "Media Objects",
    description: "아바타, 썸네일, 아이콘 같은 미디어와 텍스트 정보를 나란히 배치하는 조밀한 레이아웃 패턴입니다.",
    examples: [
      ["Basic", "media-basic"],
      ["Aligned to center", "media-center"],
      ["Aligned to bottom", "media-bottom"],
      ["Stretched to fit", "media-stretched"],
      ["Media on right", "media-right"],
      ["Basic responsive", "media-basic-responsive"],
      ["Wide responsive", "media-wide-responsive"],
      ["Nested", "media-nested"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Layout",
      title,
      description: "Tailwind의 media object 예시 이름과 개수를 맞춘 미디어-텍스트 행 변형입니다.",
      tags: ["media object", "avatar", "row"],
      termId: "avatar",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-layout-panels"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / Panels",
    title: "Panels",
    description: "작업 화면을 여러 영역으로 나눠 주 정보와 보조 조작을 함께 보여주는 레이아웃 패턴입니다.",
    examples: [
      { id: "split-pane-panel", eyebrow: "Application UI / Layout", title: "Split pane", description: "목록과 상세처럼 두 영역을 동시에 보여줍니다.", tags: ["split", "detail", "workspace"], termId: "split-pane", preview: "layout-panel-split" },
      { id: "resizable-panel-layout", eyebrow: "Application UI / Layout", title: "Resizable panel", description: "사용자가 작업에 맞게 영역 크기를 조절하게 합니다.", tags: ["resize", "panes", "control"], termId: "resizable-panel", preview: "layout-panel-resizable" },
      { id: "properties-panel-layout", eyebrow: "Application UI / Layout", title: "Properties panel", description: "선택한 객체의 속성과 조작을 보조 패널에 모읍니다.", tags: ["properties", "inspector", "editing"], termId: "properties-panel", preview: "layout-panel-properties" },
    ],
  }],
  [navFilter("plus-application-layout-dividers"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Layout / Dividers",
    title: "Dividers",
    description: "밀도 높은 앱 화면에서 구역 경계를 과하지 않게 만드는 레이아웃 패턴입니다.",
    examples: [
      ["With label", "divider-label"],
      ["With icon", "divider-icon"],
      ["With label on left", "divider-label-left"],
      ["With title", "divider-title"],
      ["With title on left", "divider-title-left"],
      ["With button", "divider-button"],
      ["With title and button", "divider-title-button"],
      ["With toolbar", "divider-toolbar"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Layout",
      title,
      description: "Tailwind의 divider 예시 이름과 개수를 맞춘 구분선 변형입니다.",
      tags: ["divider", "separation", "layout"],
      termId: "divider",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-page-examples"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples",
    title: "Page Examples",
    description: "홈, 상세, 설정처럼 앱에서 반복되는 완성 화면 예시입니다. 로컬 전용 대시보드, 인증, 온보딩 예시는 공식 세트 뒤에 보조로 유지합니다.",
    examples: [
      { id: "home-screen-overview", eyebrow: "Application UI / Page Example", title: "Home screen", description: "사용자가 앱에 들어왔을 때 오늘의 상태와 다음 행동을 보여주는 시작 화면입니다.", tags: ["home", "dashboard", "overview"], termId: "dashboard-overview-page", preview: "app-example-dashboard" },
      { id: "detail-screen-overview", eyebrow: "Application UI / Page Example", title: "Detail screen", description: "선택한 객체의 속성, 활동, 관련 행동을 한 화면에서 정리합니다.", tags: ["detail", "object", "metadata"], termId: "detail-row", preview: "app-example-detail" },
      { id: "settings-screen-overview", eyebrow: "Application UI / Page Example", title: "Settings screen", description: "폼, 패널, 저장 행동을 조합한 설정 화면입니다.", tags: ["settings", "forms", "panels"], termId: "settings-page-layout", preview: "app-example-settings" },
    ],
  }],
  [navFilter("plus-application-page-examples-home-screens"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Home Screens",
    title: "Home Screens",
    description: "앱에 진입한 사용자가 현재 상태, 최근 활동, 다음 행동을 빠르게 파악하게 하는 시작 화면 예시입니다.",
    examples: [
      ["Sidebar", "home-screen-sidebar"],
      ["Stacked", "home-screen-stacked"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Page Example",
      title,
      description: "Tailwind의 home screen 예시 이름과 개수를 맞춘 앱 홈 화면 변형입니다.",
      tags: ["home screen", "dashboard", "app"],
      termId: "dashboard-overview-page",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-page-examples-detail-screens"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Detail Screens",
    title: "Detail Screens",
    description: "선택한 객체의 속성, 상태, 관련 활동, 보조 행동을 한 화면에서 정리하는 상세 화면 예시입니다.",
    examples: [
      ["Sidebar", "detail-screen-sidebar"],
      ["Stacked", "detail-screen-stacked"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Page Example",
      title,
      description: "Tailwind의 detail screen 예시 이름과 개수를 맞춘 앱 상세 화면 변형입니다.",
      tags: ["detail screen", "record", "app"],
      termId: "description-list",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-page-examples-settings-screens"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Settings Screens",
    title: "Settings Screens",
    description: "계정, 조직, 결제, 워크스페이스 옵션을 폼과 패널로 조정하는 설정 화면 예시입니다.",
    examples: [
      ["Sidebar", "settings-screen-sidebar"],
      ["Stacked", "settings-screen-stacked"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Page Example",
      title,
      description: "Tailwind의 settings screen 예시 이름과 개수를 맞춘 설정 화면 변형입니다.",
      tags: ["settings screen", "preferences", "app"],
      termId: "settings-page",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-page-examples-dashboards"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Dashboards",
    title: "Dashboards",
    description: "운영 상태, 핵심 지표, 최근 활동을 한 화면에서 파악하게 하는 완성 화면입니다.",
    examples: [
      { id: "dashboard-overview-example", eyebrow: "Application UI / Page Example", title: "Overview dashboard", description: "KPI와 주요 표를 조합한 기본 대시보드입니다.", tags: ["overview", "metrics", "table"], termId: "dashboard-overview-page", preview: "app-example-dashboard" },
      { id: "dashboard-grid-example", eyebrow: "Application UI / Page Example", title: "Widget dashboard", description: "여러 위젯을 그리드로 배치해 상태를 비교합니다.", tags: ["widgets", "grid", "charts"], termId: "dashboard-grid", preview: "app-example-dashboard" },
      { id: "sidebar-dashboard-example", eyebrow: "Application UI / Page Example", title: "Sidebar dashboard", description: "좌측 내비게이션과 대시보드 콘텐츠를 함께 보여줍니다.", tags: ["sidebar", "dashboard", "workspace"], termId: "sidebar-dashboard-layout", preview: "app-example-dashboard" },
    ],
  }],
  [navFilter("plus-application-page-examples-settings"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Settings",
    title: "Settings",
    description: "계정, 결제, 워크스페이스 설정을 폼과 패널로 조정하는 완성 화면입니다.",
    examples: [
      { id: "workspace-settings-example", eyebrow: "Application UI / Page Example", title: "Workspace settings", description: "조직 정보와 기본 설정을 수정합니다.", tags: ["settings", "workspace", "form"], termId: "settings-page-layout", preview: "app-example-settings" },
      { id: "billing-settings-example", eyebrow: "Application UI / Page Example", title: "Billing settings", description: "플랜, 결제수단, 청구 내역을 관리합니다.", tags: ["billing", "plan", "payment"], termId: "billing-settings-page", preview: "app-example-settings" },
      { id: "properties-settings-example", eyebrow: "Application UI / Page Example", title: "Properties settings", description: "선택한 객체의 속성을 편집 가능한 패널로 정리합니다.", tags: ["properties", "panel", "edit"], termId: "properties-panel", preview: "app-example-settings" },
    ],
  }],
  [navFilter("plus-application-page-examples-detail"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Detail Pages",
    title: "Detail Pages",
    description: "선택한 객체의 속성, 상태, 관련 활동을 자세히 보여주는 완성 화면입니다.",
    examples: [
      { id: "detail-row-page", eyebrow: "Application UI / Page Example", title: "Record detail page", description: "행 선택 후 상세 정보와 보조 행동을 보여줍니다.", tags: ["detail", "record", "actions"], termId: "detail-row", preview: "app-example-detail" },
      { id: "description-detail-page", eyebrow: "Application UI / Page Example", title: "Description detail page", description: "key-value 정보를 중심으로 객체 속성을 읽게 합니다.", tags: ["description list", "properties", "metadata"], termId: "description-list", preview: "app-example-detail" },
      { id: "side-sheet-detail-page", eyebrow: "Application UI / Page Example", title: "Side sheet detail page", description: "목록을 유지하면서 상세를 측면 패널로 엽니다.", tags: ["side sheet", "list", "detail"], termId: "side-sheet", preview: "app-example-detail" },
    ],
  }],
  [navFilter("plus-application-page-examples-list"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / List Pages",
    title: "List Pages",
    description: "객체 목록을 검색, 필터, 정렬, 일괄 행동과 함께 다루는 완성 화면입니다.",
    examples: [
      { id: "table-list-page", eyebrow: "Application UI / Page Example", title: "Table list page", description: "테이블 툴바와 행 목록을 조합한 기본 목록 화면입니다.", tags: ["table", "toolbar", "list"], termId: "data-table-toolbar", preview: "app-example-list" },
      { id: "activity-list-page", eyebrow: "Application UI / Page Example", title: "Activity list page", description: "시간순 활동을 목록으로 보여주는 화면입니다.", tags: ["activity", "history", "feed"], termId: "activity-feed", preview: "app-example-list" },
      { id: "filter-list-page", eyebrow: "Application UI / Page Example", title: "Filtered list page", description: "필터 패널과 목록 결과를 함께 보여줍니다.", tags: ["filters", "results", "panel"], termId: "filter-panel", preview: "app-example-list" },
    ],
  }],
  [navFilter("plus-application-page-examples-auth"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Auth Pages",
    title: "Auth Pages",
    description: "로그인, 가입, 초대 수락처럼 계정 접근을 처리하는 완성 화면입니다.",
    examples: [
      { id: "login-page-example", eyebrow: "Application UI / Page Example", title: "Login page", description: "이메일과 비밀번호로 제품에 접근하는 기본 화면입니다.", tags: ["login", "account", "auth"], termId: "login-page", preview: "app-example-auth" },
      { id: "split-auth-page-example", eyebrow: "Application UI / Page Example", title: "Split auth page", description: "브랜드 메시지와 인증 폼을 나란히 배치합니다.", tags: ["split", "brand", "auth"], termId: "split-auth-layout", preview: "app-example-auth" },
      { id: "invite-auth-page-example", eyebrow: "Application UI / Page Example", title: "Invite acceptance page", description: "초대 수락과 계정 설정을 한 흐름으로 완료합니다.", tags: ["invite", "workspace", "registration"], termId: "invite-acceptance-screen", preview: "app-example-auth" },
    ],
  }],
  [navFilter("plus-application-page-examples-onboarding"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Page Examples / Onboarding Pages",
    title: "Onboarding Pages",
    description: "신규 사용자가 제품 가치를 보기 전 필요한 설정과 선택을 끝내게 하는 완성 화면입니다.",
    examples: [
      { id: "onboarding-flow-page-example", eyebrow: "Application UI / Page Example", title: "Onboarding flow page", description: "여러 단계를 순서대로 완료하게 하는 초기 설정 화면입니다.", tags: ["onboarding", "steps", "setup"], termId: "onboarding-flow-page", preview: "app-example-onboarding" },
      { id: "welcome-choice-page-example", eyebrow: "Application UI / Page Example", title: "Welcome choice page", description: "사용자의 목적이나 역할에 따라 시작 경로를 고르게 합니다.", tags: ["welcome", "choice", "role"], termId: "welcome-choice-screen", preview: "app-example-onboarding" },
      { id: "onboarding-checklist-page-example", eyebrow: "Application UI / Page Example", title: "Onboarding checklist page", description: "남은 설정 항목과 진행률을 보여줘 초기 행동을 유도합니다.", tags: ["checklist", "progress", "activation"], termId: "onboarding-checklist", preview: "app-example-onboarding" },
    ],
  }],
  [navFilter("plus-data-display-description-lists"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display / Description Lists",
    title: "Description Lists",
    description: "객체의 속성과 값을 행 또는 그리드로 정리해 상세 화면에서 빠르게 읽게 하는 데이터 표시 패턴입니다.",
    examples: [
      ["Left-aligned", "description-list-left"],
      ["Left-aligned in card", "description-list-card"],
      ["Left-aligned striped", "description-list-striped"],
      ["Two-column", "description-list-two-column"],
      ["Left-aligned with inline actions", "description-list-inline-actions"],
      ["Narrow with hidden labels", "description-list-narrow-hidden-labels"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Data Display",
      title,
      description: "Tailwind의 description list 예시 이름과 개수를 맞춘 key-value 상세 정보 변형입니다.",
      tags: ["description list", "metadata", "details"],
      termId: "description-list",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-data-display-stats"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display / Stats",
    title: "Stats",
    description: "앱 화면에서 운영 상태와 성과를 숫자로 빠르게 훑게 하는 지표 표시 패턴입니다.",
    examples: [
      ["With trending", "app-stats-trending"],
      ["Simple", "app-stats-simple"],
      ["Simple in cards", "app-stats-cards"],
      ["With brand icon", "app-stats-brand-icon"],
      ["With shared borders", "app-stats-shared-borders"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Data Display",
      title,
      description: "Tailwind의 application stats 예시 이름과 개수를 맞춘 운영 지표 변형입니다.",
      tags: ["stats", "metrics", "dashboard"],
      termId: "metric-card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-data-display-calendars"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display / Calendars",
    title: "Calendars",
    description: "날짜, 일정, 예약, 마감 정보를 달력 구조로 보여주는 앱 UI 패턴입니다.",
    examples: [
      ["Small with meetings", "calendar-small-meetings"],
      ["Month view", "calendar-month-view"],
      ["Week view", "calendar-week-view"],
      ["Day view", "calendar-day-view"],
      ["Year view", "calendar-year-view"],
      ["Double", "calendar-double"],
      ["Borderless stacked", "calendar-borderless-stacked"],
      ["Borderless side-by-side", "calendar-borderless-side-by-side"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Data Display",
      title,
      description: "Tailwind의 calendar 예시 이름과 개수를 맞춘 일정 표시 변형입니다.",
      tags: ["calendar", "schedule", "date"],
      termId: "calendar-view",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-data-display-lists"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display / Lists",
    title: "Lists",
    description: "활동, 사람, 객체, 알림을 반복 행으로 보여줘 스캔과 선택을 빠르게 만드는 데이터 표시 패턴입니다.",
    examples: [
      { id: "object-list", eyebrow: "Application UI / Data Display", title: "Object list", description: "이름, 보조 설명, 상태, 보조 행동을 반복 행으로 배치하는 기본형입니다.", tags: ["rows", "objects", "actions"], termId: "activity-feed", preview: "list-page" },
      { id: "activity-feed-list", eyebrow: "Application UI / Data Display", title: "Activity feed", description: "시간순 이벤트를 나열해 변경 이력과 팀 활동을 추적하게 합니다.", tags: ["activity", "timeline", "history"], termId: "activity-feed", preview: "list-page" },
      { id: "people-list", eyebrow: "Application UI / Data Display", title: "People list", description: "팀원, 고객, 담당자 정보를 아바타와 역할 중심으로 보여줍니다.", tags: ["people", "avatar", "role"], termId: "team-member-row", preview: "list-page" },
    ],
  }],
  [navFilter("plus-data-display-tables"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Data Display / Tables",
    title: "Tables",
    description: "행과 열로 구성된 구조적 데이터를 비교, 정렬, 선택, 페이지 이동과 함께 다루는 패턴입니다.",
    examples: [
      { id: "basic-data-table", eyebrow: "Application UI / Data Display", title: "Basic data table", description: "이름, 상태, 담당자, 업데이트 일자를 열로 나눠 운영 데이터를 비교합니다.", tags: ["rows", "columns", "data"], termId: "table", preview: "table-page" },
      { id: "toolbar-data-table", eyebrow: "Application UI / Data Display", title: "Data table with toolbar", description: "검색, 필터, 내보내기를 테이블 상단에 붙여 데이터 조작을 빠르게 합니다.", tags: ["toolbar", "filter", "export"], termId: "data-table-toolbar", preview: "table-page" },
      { id: "paginated-table", eyebrow: "Application UI / Data Display", title: "Paginated table", description: "행이 많을 때 페이지네이션으로 위치를 유지하며 탐색하게 합니다.", tags: ["pagination", "large data", "navigation"], termId: "pagination", preview: "table-page" },
    ],
  }],
  [navFilter("plus-application-lists"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Lists",
    title: "Lists",
    description: "행, 표, 격자, 피드처럼 반복되는 항목을 사용자가 빠르게 훑고 선택하게 하는 목록 패턴입니다.",
    examples: [
      { id: "stacked-list-overview", eyebrow: "Application UI / Lists", title: "Stacked list", description: "항목을 세로로 쌓아 사람, 작업, 객체 목록을 읽기 쉽게 보여줍니다.", tags: ["rows", "scan", "selection"], termId: "team-member-row", preview: "list-page" },
      { id: "table-list-overview", eyebrow: "Application UI / Lists", title: "Table list", description: "열이 많은 운영 데이터를 정렬과 페이지 이동으로 다룹니다.", tags: ["table", "columns", "operations"], termId: "data-table-toolbar", preview: "table-page" },
      { id: "feed-list-overview", eyebrow: "Application UI / Lists", title: "Activity feed", description: "시간순 이벤트와 상태 변화를 피드처럼 이어 보여줍니다.", tags: ["feed", "timeline", "updates"], termId: "activity-feed", preview: "list-page" },
    ],
  }],
  [navFilter("plus-application-lists-stacked-lists"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Lists / Stacked Lists",
    title: "Stacked Lists",
    description: "항목을 세로로 쌓아 이름, 상태, 보조 설명, 행동을 한 줄 단위로 스캔하게 하는 목록 패턴입니다.",
    examples: [
      ["Simple", "stacked-list-simple"],
      ["With links", "stacked-list-links"],
      ["With inline links and avatar group", "stacked-list-inline-avatar-group"],
      ["With inline links and actions menu", "stacked-list-inline-actions-menu"],
      ["With badges, button, and actions menu", "stacked-list-badges-button-actions"],
      ["In card with links", "stacked-list-card-links"],
      ["Two columns with links", "stacked-list-two-columns"],
      ["Full width with links", "stacked-list-full-width"],
      ["Full-width with constrained content", "stacked-list-full-width-constrained"],
      ["Narrow", "stacked-list-narrow"],
      ["Narrow with sticky headings", "stacked-list-narrow-sticky-headings"],
      ["Narrow with actions", "stacked-list-narrow-actions"],
      ["Narrow with truncated content", "stacked-list-narrow-truncated"],
      ["Narrow with small avatars", "stacked-list-narrow-small-avatars"],
      ["Narrow with badges", "stacked-list-narrow-badges"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Lists",
      title,
      description: "Tailwind 캡처의 stacked list 예시별 폭, 배경, 행 density, 상태 UI를 따로 구현한 반복 행 목록 변형입니다.",
      tags: ["stacked list", "rows", "actions"],
      termId: "activity-feed",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-lists-tables"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Lists / Tables",
    title: "Tables",
    description: "행과 열로 이루어진 목록을 검색, 필터, 페이지 이동과 함께 다루는 테이블 목록 패턴입니다.",
    examples: [
      ["Simple", "table-list-simple"],
      ["Simple in card", "table-list-card"],
      ["Full width", "table-list-full-width"],
      ["Full width with constrained content", "table-list-full-width-constrained"],
      ["With striped rows", "table-list-striped"],
      ["With uppercase headings", "table-list-uppercase"],
      ["With stacked columns on mobile", "table-list-stacked-mobile"],
      ["With hidden columns on mobile", "table-list-hidden-mobile"],
      ["With avatars and multi-line content", "table-list-avatars-multiline"],
      ["With sticky header", "table-list-sticky-header"],
      ["With vertical lines", "table-list-vertical-lines"],
      ["With condensed content", "table-list-condensed"],
      ["With sortable headings", "table-list-sortable"],
      ["With grouped rows", "table-list-grouped"],
      ["With summary rows", "table-list-summary"],
      ["With border", "table-list-border"],
      ["With checkboxes", "table-list-checkboxes"],
      ["With hidden headings", "table-list-hidden-headings"],
      ["Full width with avatars", "table-list-full-width-avatars"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Lists",
      title,
      description: "Tailwind 캡처의 table 예시별 프레임, density, 모바일 열 처리, avatar, summary, checkbox 구조를 따로 구현한 표 변형입니다.",
      tags: ["table", "rows", "columns"],
      termId: "table",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-lists-grid-lists"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Lists / Grid Lists",
    title: "Grid Lists",
    description: "반복 항목을 카드형 격자로 배치해 썸네일, 상태, 짧은 메타데이터를 비교하게 하는 목록 패턴입니다.",
    examples: [
      ["Contact cards with small portraits", "grid-list-small-portraits"],
      ["Contact cards", "grid-list-contact-cards"],
      ["Simple cards", "grid-list-simple-cards"],
      ["Horizontal link cards", "grid-list-horizontal-links"],
      ["Actions with shared borders", "grid-list-shared-actions"],
      ["Images with details", "grid-list-images-details"],
      ["Logos cards with description list", "grid-list-logo-descriptions"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Lists",
      title,
      description: "Tailwind 캡처의 grid list 예시별 카드 밀도, portrait, image tile, shared border, description list 구조를 따로 구현한 격자 목록 변형입니다.",
      tags: ["grid list", "cards", "profiles"],
      termId: "profile-card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-application-lists-feeds"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Lists / Feeds",
    title: "Feeds",
    description: "활동, 알림, 상태 변경을 시간순으로 이어 보여주는 피드 목록 패턴입니다.",
    examples: [
      ["Simple with icons", "feed-list-simple-icons"],
      ["With comments", "feed-list-comments"],
      ["With multiple item types", "feed-list-multiple-types"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Lists",
      title,
      description: "Tailwind 캡처의 feed 예시별 timeline rail, icon/avatar marker, comment card, tag 상태를 따로 구현한 시간순 활동 목록 변형입니다.",
      tags: ["feed", "timeline", "activity"],
      termId: "activity-feed",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms",
    title: "Forms",
    description: "입력, 선택, 저장 행동을 한 작업 흐름으로 묶는 앱 UI 패턴입니다. 설정, 인증, 편집 화면에서 가장 자주 반복됩니다.",
    examples: [
      { id: "stacked-form", eyebrow: "Application UI / Forms", title: "Stacked form", description: "라벨과 입력 필드를 세로로 쌓아 가장 예측 가능하게 값을 수정하는 기본 폼입니다.", tags: ["fields", "labels", "submit"], termId: "text-field", preview: "form-stacked" },
      { id: "settings-form", eyebrow: "Application UI / Forms", title: "Settings form", description: "텍스트 입력과 스위치 설정을 함께 배치해 계정이나 워크스페이스 설정을 수정하게 합니다.", tags: ["settings", "switch", "preferences"], termId: "switch", preview: "form-settings" },
      { id: "auth-form", eyebrow: "Application UI / Forms", title: "Auth form", description: "이메일과 비밀번호처럼 짧은 필드만 남겨 로그인 흐름을 빠르게 완료하게 하는 폼입니다.", tags: ["auth", "email", "password"], termId: "login-page", preview: "form-auth" },
    ],
  }],
  [navFilter("plus-forms-form-layouts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Form Layouts",
    title: "Form Layouts",
    description: "라벨, 입력, 도움말, 저장 행동을 읽기 쉬운 폼 구조로 배치하는 패턴입니다.",
    examples: [
      ["Stacked", "form-layout-stacked"],
      ["Two-column", "form-layout-two-column"],
      ["Two-column with cards", "form-layout-two-column-cards"],
      ["Labels on left", "form-layout-labels-left"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 section spacing, left description column, card wrapper, label alignment를 예시별로 나눠 구현한 폼 레이아웃 변형입니다.",
      tags: ["form layout", "fields", "labels"],
      termId: "text-field",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-input-groups"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Input Groups",
    title: "Input Groups",
    description: "입력값 앞뒤에 단위, 도메인, 버튼, 복사 행동을 붙여 맥락을 분명히 하는 폼 패턴입니다.",
    examples: [
      ["Input with inline leading add-on and trailing dropdown", "input-group-inline-leading-trailing-dropdown"],
      ["Input with label", "input-group-label"],
      ["Input with label and help text", "input-group-label-help-dark"],
      ["Input with validation error", "input-group-validation-error"],
      ["Input with disabled state", "input-group-disabled"],
      ["Input with hidden label", "input-group-hidden-label"],
      ["Input with corner hint", "input-group-corner-hint"],
      ["Input with leading icon", "input-group-leading-icon-dark"],
      ["Input with trailing icon", "input-group-trailing-icon"],
      ["Input with add-on", "input-group-add-on"],
      ["Input with inline add-on", "input-group-inline-add-on-dark"],
      ["Input with inline leading and trailing add-ons", "input-group-inline-leading-trailing-add-ons"],
      ["Input with inline leading dropdown", "input-group-inline-leading-dropdown"],
      ["Input with leading icon and trailing button", "input-group-leading-icon-trailing-button"],
      ["Inputs with shared borders", "input-group-shared-borders"],
      ["Input with inset label", "input-group-inset-label"],
      ["Inputs with inset labels and shared borders", "input-group-inset-labels-shared-borders"],
      ["Input with overlapping label", "input-group-overlapping-label-dark"],
      ["Input with pill shape", "input-group-pill-shape"],
      ["Input with gray background and bottom border", "input-group-gray-bottom-border"],
      ["Input with keyboard shortcut", "input-group-keyboard-shortcut-dark"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 add-on, label, hint, icon, error, shared-border 입력 상태를 예시별로 나눠 구현한 입력 그룹 변형입니다.",
      tags: ["input group", "addon", "field"],
      termId: "input-group",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-select-menus"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Select Menus",
    title: "Select Menus",
    description: "정해진 보기 중 하나를 선택하게 하거나 많은 옵션을 검색해 고르게 하는 선택 입력 패턴입니다.",
    examples: [
      ["Custom with avatar", "select-menu-avatar"],
      ["Simple native", "select-menu-native"],
      ["Simple custom", "select-menu-custom-dark"],
      ["Custom with check on left", "select-menu-check-left"],
      ["Custom with status indicator", "select-menu-status"],
      ["With secondary text", "select-menu-secondary-text"],
      ["Branded with supported text", "select-menu-branded-supported"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 avatar option, native select, custom menu, check placement, status dot, secondary text, branded help text를 예시별로 나눈 선택 입력 변형입니다.",
      tags: ["select menu", "options", "dropdown"],
      termId: "select",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-sign-in-registration"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Sign-in and Registration",
    title: "Sign-in and Registration",
    description: "로그인, 가입, 초대 수락처럼 계정 접근을 처리하는 인증 폼 패턴입니다.",
    examples: [
      ["Simple", "auth-sign-in-simple"],
      ["Simple no labels", "auth-sign-in-no-labels"],
      ["Split screen", "auth-sign-in-split-screen"],
      ["Simple card", "auth-sign-in-card"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 dark login, no-label stacked fields, split image layout, centered card layout을 예시별로 나눈 인증 폼 변형입니다.",
      tags: ["auth", "sign in", "registration"],
      termId: "login-page",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-textareas"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Textareas",
    title: "Textareas",
    description: "메모, 설명, 문의처럼 여러 줄 입력이 필요한 값을 다루는 폼 패턴입니다.",
    examples: [
      ["Simple", "textarea-simple"],
      ["With avatar and actions", "textarea-avatar-actions"],
      ["With underline and actions", "textarea-underline-actions"],
      ["With title and pill actions", "textarea-title-pill-actions"],
      ["With preview button", "textarea-preview-button"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 plain textarea, avatar composer, underline action bar, dark pill action composer, preview-tab writer를 예시별로 나눈 다중 줄 입력 변형입니다.",
      tags: ["textarea", "long input", "actions"],
      termId: "textarea",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-radio-groups"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Radio Groups",
    title: "Radio Groups",
    description: "서로 배타적인 선택지 중 정확히 하나를 고르게 하는 폼 패턴입니다.",
    examples: [
      ["Simple list", "radio-group-simple-list"],
      ["Simple inline list", "radio-group-inline-list"],
      ["List with description", "radio-group-description-list"],
      ["List with inline description", "radio-group-inline-description"],
      ["List with radio on right", "radio-group-radio-right"],
      ["Simple list with radio on right", "radio-group-simple-right"],
      ["Simple table", "radio-group-simple-table"],
      ["List with descriptions in panel", "radio-group-panel-descriptions"],
      ["Color picker", "radio-group-color-picker"],
      ["Cards", "radio-group-cards"],
      ["Small cards", "radio-group-small-cards"],
      ["Stacked cards", "radio-group-stacked-cards"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind 캡처의 list, inline, description, right-radio, table, panel, color picker, card variants를 예시별로 나눈 단일 선택 변형입니다.",
      tags: ["radio group", "single choice", "selection"],
      termId: "radio-group",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-checkboxes"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Checkboxes",
    title: "Checkboxes",
    description: "여러 값을 동시에 선택하거나 동의/포함 여부를 표시하는 폼 패턴입니다.",
    examples: [
      ["List with description", "checkbox-list-description"],
      ["List with inline description", "checkbox-inline-description"],
      ["List with checkbox on right", "checkbox-list-right"],
      ["Simple list with heading", "checkbox-simple-heading"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind Checkboxes 캡처를 기준으로 checkbox 위치, 설명 밀도, heading 변형을 분리한 다중 선택 패턴입니다.",
      tags: ["checkbox", "multiple choice", "settings"],
      termId: "checkbox",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-toggles"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Toggles",
    title: "Toggles",
    description: "설정값을 즉시 켜고 끄거나 여러 pressed 상태를 조작하는 폼 패턴입니다.",
    examples: [
      ["Simple toggle", "toggle-simple"],
      ["Short toggle", "toggle-short"],
      ["Toggle with icon", "toggle-with-icon"],
      ["With left label and description", "toggle-left-label-description"],
      ["With right label", "toggle-right-label"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind Toggles 캡처를 기준으로 switch 크기, icon state, label placement를 분리한 on/off 설정 패턴입니다.",
      tags: ["toggle", "switch", "settings"],
      termId: "switch",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-action-panels"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Action Panels",
    title: "Action Panels",
    description: "폼의 중요한 저장, 위험 작업, 확인 행동을 별도 패널로 강조하는 패턴입니다.",
    examples: [
      ["Simple", "action-panel-simple"],
      ["With link", "action-panel-link"],
      ["With button on right", "action-panel-button-right"],
      ["With button at top right", "action-panel-button-top-right"],
      ["With toggle", "action-panel-toggle"],
      ["With input", "action-panel-input"],
      ["Simple well", "action-panel-simple-well"],
      ["With well", "action-panel-with-well"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind Action Panels 캡처를 기준으로 CTA 위치, 링크, 토글, 입력, well 구조를 분리한 행동 패널입니다.",
      tags: ["action panel", "form", "actions"],
      termId: "cta-section",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-forms-comboboxes"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Forms / Comboboxes",
    title: "Comboboxes",
    description: "입력과 선택을 함께 제공해 많은 옵션을 검색하고 고르게 하는 폼 패턴입니다.",
    examples: [
      ["Simple", "combobox-simple"],
      ["With status indicator", "combobox-status-indicator"],
      ["With image", "combobox-with-image"],
      ["With secondary text", "combobox-secondary-text"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Forms",
      title,
      description: "Tailwind Comboboxes 캡처를 기준으로 dropdown list, status dot, avatar, secondary text 상태를 분리한 검색 선택 입력입니다.",
      tags: ["combobox", "search", "options"],
      termId: "combobox",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation",
    title: "Navigation",
    description: "사용자가 앱 안에서 현재 위치를 이해하고 다음 목적지나 명령으로 이동하게 하는 탐색 패턴입니다.",
    examples: [
      { id: "sidebar-navigation", eyebrow: "Application UI / Navigation", title: "Sidebar navigation", description: "주요 목적지를 왼쪽에 계속 노출해 대시보드와 관리 도구의 반복 이동을 빠르게 만듭니다.", tags: ["sidebar", "active state", "destinations"], termId: "sidebar-nav", preview: "nav-sidebar" },
      { id: "command-navigation", eyebrow: "Application UI / Navigation", title: "Command palette", description: "검색 입력으로 화면 이동과 명령 실행을 함께 처리해 복잡한 앱의 빠른 길을 제공합니다.", tags: ["command", "search", "keyboard"], termId: "command-palette", preview: "nav-command" },
      { id: "breadcrumb-navigation", eyebrow: "Application UI / Navigation", title: "Breadcrumb header", description: "깊은 정보 구조에서 현재 위치와 상위 경로를 함께 보여줘 돌아갈 방향을 분명히 합니다.", tags: ["breadcrumb", "hierarchy", "location"], termId: "breadcrumb-header", preview: "nav-breadcrumb" },
    ],
  }],
  [navFilter("plus-navigation-navbars"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Navbars",
    title: "Navbars",
    description: "앱 상단에서 주요 목적지, 현재 제품 맥락, 주요 행동을 배치하는 내비게이션 바 패턴입니다.",
    examples: [
      ["Simple dark with menu button on left", "navbar-dark-menu-left"],
      ["Dark with quick action", "navbar-dark-quick-action"],
      ["Simple dark", "navbar-simple-dark"],
      ["Simple with menu button on left", "navbar-light-menu-left"],
      ["Simple", "navbar-simple-light"],
      ["With quick action", "navbar-light-quick-action"],
      ["Dark with search", "navbar-dark-search"],
      ["With search", "navbar-light-search"],
      ["Dark with centered search and secondary links", "navbar-dark-centered-search"],
      ["With centered search and secondary links", "navbar-light-centered-search"],
      ["With search in column layout", "navbar-search-column-layout"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind Navbars 캡처를 기준으로 dark/light, search, quick action, secondary link 배치를 분리한 상단 내비게이션입니다.",
      tags: ["navbar", "top nav", "search"],
      termId: "navigation-bar",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-tabs"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Tabs",
    title: "Tabs",
    description: "같은 맥락의 화면이나 패널을 한 영역 안에서 전환하게 하는 탭 패턴입니다.",
    examples: [
      ["Tabs with underline", "tabs-underline"],
      ["Tabs with underline and icons", "tabs-underline-icons"],
      ["Tabs in pills", "tabs-pills"],
      ["Tabs in pills on gray", "tabs-pills-gray"],
      ["Tabs in pills with brand color", "tabs-pills-brand"],
      ["Full-width tabs with underline", "tabs-full-width-underline"],
      ["Bar with underline", "tabs-bar-underline"],
      ["Tabs with underline and badges", "tabs-underline-badges"],
      ["Simple", "tabs-simple"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind Tabs 캡처를 기준으로 underline, icon, pill, badge, full-width 상태를 분리한 보기 전환 패턴입니다.",
      tags: ["tabs", "active state", "navigation"],
      termId: "tabs",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-breadcrumbs"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Breadcrumbs",
    title: "Breadcrumbs",
    description: "깊은 정보 구조에서 현재 위치와 상위 경로를 보여주는 경로 내비게이션 패턴입니다.",
    examples: [
      ["Contained", "breadcrumb-contained"],
      ["Full-width bar", "breadcrumb-full-width-bar"],
      ["Simple with chevrons", "breadcrumb-simple-chevrons"],
      ["Simple with slashes", "breadcrumb-simple-slashes"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind의 breadcrumb 예시 이름과 개수를 맞춘 경로 내비게이션 변형입니다.",
      tags: ["breadcrumb", "hierarchy", "location"],
      termId: "breadcrumb",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-pagination"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Pagination",
    title: "Pagination",
    description: "긴 데이터나 결과 목록을 여러 페이지로 나누고 현재 위치를 유지하게 하는 내비게이션 패턴입니다.",
    examples: [
      ["Card footer with page buttons", "pagination-card-footer-buttons"],
      ["Centered page numbers", "pagination-centered-numbers"],
      ["Simple card footer", "pagination-simple-card-footer"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind Pagination 캡처를 기준으로 card footer, page number, mobile prev/next 구조를 분리한 페이지 이동 패턴입니다.",
      tags: ["pagination", "pages", "list"],
      termId: "pagination",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-vertical-navigation"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Vertical Navigation",
    title: "Vertical Navigation",
    description: "앱 목적지를 세로 축으로 배치해 반복 이동과 현재 위치 인지를 빠르게 만드는 내비게이션 패턴입니다.",
    examples: [
      ["Simple", "vertical-nav-simple"],
      ["With badges", "vertical-nav-badges"],
      ["With icons and badges", "vertical-nav-icons-badges"],
      ["With icons", "vertical-nav-icons"],
      ["With secondary navigation", "vertical-nav-secondary"],
      ["On gray", "vertical-nav-gray"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind의 vertical navigation 예시 이름과 개수를 맞춘 세로 내비게이션 변형입니다.",
      tags: ["vertical navigation", "sidebar", "active state"],
      termId: "sidebar-nav",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-sidebar-navigation"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Sidebar Navigation",
    title: "Sidebar Navigation",
    description: "좌측 사이드바에 앱의 주요 목적지와 현재 위치를 계속 노출하는 내비게이션 패턴입니다.",
    examples: [
      ["Light", "sidebar-nav-light"],
      ["Dark", "sidebar-nav-dark"],
      ["With expandable sections", "sidebar-nav-expandable"],
      ["With secondary navigation", "sidebar-nav-secondary"],
      ["Brand", "sidebar-nav-brand"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind의 sidebar navigation 예시 이름과 개수를 맞춘 사이드 내비게이션 변형입니다.",
      tags: ["sidebar navigation", "app shell", "navigation"],
      termId: "sidebar-nav",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-progress-bars"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Progress Bars",
    title: "Progress Bars",
    description: "다단계 작업이나 설정 흐름에서 현재 진행 정도와 남은 단계를 보여주는 진행 내비게이션 패턴입니다.",
    examples: [
      ["Simple", "progress-simple"],
      ["Panels", "progress-panels"],
      ["Bullets", "progress-bullets"],
      ["Panels with border", "progress-panels-border"],
      ["Circles", "progress-circles"],
      ["Bullets and text", "progress-bullets-text"],
      ["Circles with text", "progress-circles-text"],
      ["Progress bar", "progress-bar"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind의 progress bar 예시 이름과 개수를 맞춘 단계 진행 변형입니다.",
      tags: ["progress", "steps", "navigation"],
      termId: "progress-bar",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-command-palettes"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Command Palettes",
    title: "Command Palettes",
    description: "검색 입력으로 목적지 이동, 명령 실행, 객체 선택을 한 번에 처리하는 키보드 중심 내비게이션입니다.",
    examples: [
      ["Simple", "command-palette-simple"],
      ["Simple with padding", "command-palette-padding"],
      ["With preview", "command-palette-preview"],
      ["With images and descriptions", "command-palette-images"],
      ["With icons", "command-palette-icons"],
      ["Semi-transparent with icons", "command-palette-translucent"],
      ["With groups", "command-palette-groups"],
      ["With footer", "command-palette-footer"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Navigation",
      title,
      description: "Tailwind의 command palette 예시 이름과 개수를 맞춘 검색 명령 내비게이션 변형입니다.",
      tags: ["command palette", "search", "keyboard"],
      termId: "command-palette",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-navigation-command-menus"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Command Menus",
    title: "Command Menus",
    description: "검색 입력으로 목적지 이동, 명령 실행, 옵션 선택을 빠르게 처리하는 키보드 중심 내비게이션입니다.",
    examples: [
      { id: "command-menu-basic", eyebrow: "Application UI / Navigation", title: "Command palette", description: "Ctrl K 같은 단축키로 열어 명령과 화면을 검색 실행합니다.", tags: ["keyboard", "search", "commands"], termId: "command-palette", preview: "command-menu-page" },
      { id: "command-menu-combobox", eyebrow: "Application UI / Navigation", title: "Command combobox", description: "선택 가능한 목적지나 객체가 많을 때 입력으로 좁혀 선택합니다.", tags: ["combobox", "options", "search"], termId: "combobox", preview: "command-menu-page" },
      { id: "command-search-field", eyebrow: "Application UI / Navigation", title: "Search command field", description: "목록이나 앱 전체에서 목적지를 빠르게 찾는 검색 입력을 제공합니다.", tags: ["search", "field", "global"], termId: "search-field", preview: "command-menu-page" },
    ],
  }],
  [navFilter("plus-navigation-sidebars"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Navigation / Sidebars",
    title: "Sidebars",
    description: "앱의 주요 목적지와 현재 위치를 화면 한쪽에 계속 보여주는 사이드 내비게이션 패턴입니다.",
    examples: [
      { id: "sidebar-nav-example", eyebrow: "Application UI / Navigation", title: "Sidebar navigation", description: "대시보드와 관리 도구에서 반복 이동을 빠르게 만드는 기본형입니다.", tags: ["sidebar", "dashboard", "active"], termId: "sidebar-nav", preview: "sidebar-page" },
      { id: "navigation-rail-example", eyebrow: "Application UI / Navigation", title: "Navigation rail", description: "아이콘 중심의 좁은 세로 내비게이션으로 콘텐츠 영역을 넓게 유지합니다.", tags: ["rail", "icons", "compact"], termId: "navigation-rail", preview: "sidebar-page" },
      { id: "navigation-drawer-example", eyebrow: "Application UI / Navigation", title: "Navigation drawer", description: "좁은 화면에서 사이드 메뉴를 필요할 때 열어 보여주는 형식입니다.", tags: ["drawer", "mobile", "menu"], termId: "navigation-drawer", preview: "sidebar-page" },
    ],
  }],
  [navFilter("plus-overlays"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays",
    title: "Overlays",
    description: "현재 화면 위에 임시 작업, 확인, 보조 정보를 띄우는 패턴입니다. 사용자의 초점을 잠깐 옮기되 맥락을 유지합니다.",
    examples: [
      { id: "dialog-overlay", eyebrow: "Application UI / Overlays", title: "Confirmation dialog", description: "삭제나 변경처럼 사용자의 확인이 필요한 행동을 중앙 모달로 분리합니다.", tags: ["dialog", "confirmation", "blocking"], termId: "dialog", preview: "overlay-dialog" },
      { id: "popover-overlay", eyebrow: "Application UI / Overlays", title: "Popover form", description: "작은 편집, 필터, 보조 입력을 현재 위치 근처에서 빠르게 처리하게 합니다.", tags: ["popover", "inline task", "quick edit"], termId: "popover-form", preview: "overlay-popover" },
      { id: "sheet-overlay", eyebrow: "Application UI / Overlays", title: "Side sheet details", description: "목록을 유지한 채 선택 항목의 세부 정보나 편집 폼을 옆에서 열어 보여줍니다.", tags: ["side sheet", "details", "context"], termId: "side-sheet", preview: "overlay-sheet" },
    ],
  }],
  [navFilter("plus-overlays-modals"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Modals",
    title: "Modals",
    description: "현재 작업 위에 집중해야 할 확인, 편집, 생성 흐름을 중앙 패널로 띄우는 오버레이 패턴입니다.",
    examples: [
      { id: "dialog-modal", eyebrow: "Application UI / Overlays", title: "Dialog modal", description: "짧은 확인이나 편집 흐름을 현재 화면 위에서 처리합니다.", tags: ["dialog", "modal", "focus"], termId: "dialog", preview: "modal-page" },
      { id: "confirmation-modal", eyebrow: "Application UI / Overlays", title: "Confirmation modal", description: "되돌리기 어려운 행동 전에 취소와 확인을 명확히 선택하게 합니다.", tags: ["confirmation", "danger", "blocking"], termId: "confirmation-dialog", preview: "modal-page" },
      { id: "full-screen-modal", eyebrow: "Application UI / Overlays", title: "Full-screen dialog", description: "모바일이나 복잡한 편집에서 화면 전체를 임시 작업 공간으로 씁니다.", tags: ["full screen", "mobile", "editing"], termId: "full-screen-dialog", preview: "modal-page" },
    ],
  }],
  [navFilter("plus-overlays-modal-dialogs"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Modal Dialogs",
    title: "Modal Dialogs",
    description: "현재 화면 위에 확인, 편집, 생성 흐름을 띄워 사용자의 초점을 임시 작업에 모으는 오버레이 패턴입니다.",
    examples: [
      ["Simple with gray footer", "modal-gray-footer"],
      ["Centered with single action", "modal-single-action"],
      ["Centered with wide buttons", "modal-wide-buttons"],
      ["Simple alert", "modal-alert"],
      ["Simple with dismiss button", "modal-dismiss"],
      ["Simple alert with left-aligned buttons", "modal-left-actions"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Overlays",
      title,
      description: "Tailwind의 modal dialog 예시 이름과 개수를 맞춘 중앙 오버레이 변형입니다.",
      tags: ["modal", "dialog", "overlay"],
      termId: "dialog",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-overlays-drawers"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Drawers",
    title: "Drawers",
    description: "화면 가장자리에서 열리는 패널로 메뉴, 필터, 보조 작업을 처리하는 패턴입니다.",
    examples: [
      ["With close button on outside", "drawer-close-outside"],
      ["Empty", "drawer-empty"],
      ["Wide empty", "drawer-wide-empty"],
      ["With background overlay", "drawer-background-overlay"],
      ["With branded header", "drawer-branded-header"],
      ["With sticky footer", "drawer-sticky-footer"],
      ["Create project form example", "drawer-create-project"],
      ["Wide create project form example", "drawer-wide-create-project"],
      ["User profile example", "drawer-user-profile"],
      ["Wide horizontal user profile example", "drawer-wide-user-profile"],
      ["Contact list example", "drawer-contact-list"],
      ["File details example", "drawer-file-details"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Overlays",
      title,
      description: "Tailwind의 drawer 예시 이름과 개수를 맞춘 가장자리 패널 변형입니다.",
      tags: ["drawer", "overlay", "panel"],
      termId: "drawer",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-overlays-notifications"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Notifications",
    title: "Notifications",
    description: "현재 화면 위나 가장자리에서 작업 결과, 새 이벤트, 상태 변화를 짧게 알려주는 알림 오버레이 패턴입니다.",
    examples: [
      ["Simple", "notification-simple"],
      ["Condensed", "notification-condensed"],
      ["With actions below", "notification-actions-below"],
      ["With avatar", "notification-avatar"],
      ["With split buttons", "notification-split-buttons"],
      ["With buttons below", "notification-buttons-below"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Overlays",
      title,
      description: "Tailwind의 notification 예시 이름과 개수를 맞춘 알림 오버레이 변형입니다.",
      tags: ["notification", "toast", "overlay"],
      termId: "toast",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-overlays-slide-overs"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Slide-overs",
    title: "Slide-overs",
    description: "현재 목록이나 화면을 유지한 채 오른쪽에서 세부 정보나 편집 폼을 여는 패턴입니다.",
    examples: [
      { id: "side-sheet-slide-over", eyebrow: "Application UI / Overlays", title: "Side sheet", description: "선택 항목의 상세 정보나 편집 폼을 오른쪽 패널로 엽니다.", tags: ["side sheet", "details", "editing"], termId: "side-sheet", preview: "slide-over-side-sheet" },
      { id: "sidebar-dialog-slide-over", eyebrow: "Application UI / Overlays", title: "Sidebar dialog layout", description: "목록과 보조 패널을 결합해 상세 작업을 분리합니다.", tags: ["sidebar dialog", "layout", "detail"], termId: "sidebar-dialog-layout", preview: "slide-over-sidebar-dialog" },
      { id: "detail-row-slide-over", eyebrow: "Application UI / Overlays", title: "Detail row slide-over", description: "행 선택 후 세부 데이터를 패널에서 확인하게 합니다.", tags: ["row", "details", "data"], termId: "detail-row", preview: "slide-over-detail-row" },
    ],
  }],
  [navFilter("plus-overlays-popovers"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Overlays / Popovers",
    title: "Popovers",
    description: "트리거 근처에 짧은 정보, 작은 폼, 옵션을 띄우는 가벼운 오버레이 패턴입니다.",
    examples: [
      { id: "basic-popover", eyebrow: "Application UI / Overlays", title: "Basic popover", description: "버튼 근처에 보조 콘텐츠나 짧은 설명을 띄웁니다.", tags: ["popover", "trigger", "floating"], termId: "popover", preview: "popover-basic" },
      { id: "popover-form-example", eyebrow: "Application UI / Overlays", title: "Popover form", description: "짧은 입력이나 필터를 현재 위치에서 빠르게 처리합니다.", tags: ["form", "quick edit", "inline"], termId: "popover-form", preview: "popover-form" },
      { id: "tooltip-popover-example", eyebrow: "Application UI / Overlays", title: "Tooltip-like popover", description: "짧은 설명만 필요하면 더 가벼운 tooltip 패턴을 씁니다.", tags: ["tooltip", "hint", "help"], termId: "tooltip", preview: "popover-tooltip" },
    ],
  }],
  [navFilter("plus-feedback"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback",
    title: "Feedback",
    description: "저장 완료, 경고, 오류, 빈 상태처럼 사용자의 행동 결과와 다음 회복 경로를 알려주는 앱 UI 패턴입니다.",
    examples: [
      { id: "toast-feedback", eyebrow: "Application UI / Feedback", title: "Toast notification", description: "저장 완료처럼 짧게 알려도 되는 결과를 화면 구석에 잠깐 보여줍니다.", tags: ["toast", "success", "temporary"], termId: "toast", preview: "feedback-toast" },
      { id: "alert-feedback", eyebrow: "Application UI / Feedback", title: "Persistent alert", description: "결제 정보 누락이나 오류처럼 사용자가 계속 읽고 처리해야 하는 안내를 화면 안에 유지합니다.", tags: ["alert", "warning", "persistent"], termId: "alert", preview: "feedback-alert" },
      { id: "empty-feedback", eyebrow: "Application UI / Feedback", title: "Empty state with recovery", description: "데이터가 없을 때 무엇이 없는지와 다음 행동을 함께 알려 혼란을 줄입니다.", tags: ["empty state", "recovery", "guidance"], termId: "empty-state", preview: "feedback-empty" },
    ],
  }],
  [navFilter("plus-feedback-alerts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback / Alerts",
    title: "Alerts",
    description: "사용자가 계속 보고 처리해야 하는 경고, 오류, 안내를 화면 안에 유지하는 피드백 패턴입니다.",
    examples: [
      ["With description", "alert-with-description"],
      ["With list", "alert-with-list"],
      ["With actions", "alert-with-actions"],
      ["With link on right", "alert-link-right"],
      ["With accent border", "alert-accent-border"],
      ["With dismiss button", "alert-dismiss"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Feedback",
      title,
      description: "Tailwind의 alert 예시 이름과 개수를 맞춘 지속 피드백 변형입니다.",
      tags: ["alert", "feedback", "message"],
      termId: "alert",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-feedback-empty-states"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback / Empty States",
    title: "Empty States",
    description: "데이터가 없거나 조건에 맞는 결과가 없을 때 이유와 다음 행동을 알려주는 피드백 패턴입니다.",
    examples: [
      ["Simple", "empty-state-simple"],
      ["With dashed border", "empty-state-dashed-border"],
      ["With starting points", "empty-state-starting-points"],
      ["With recommendations", "empty-state-recommendations"],
      ["With templates", "empty-state-templates"],
      ["With recommendations grid", "empty-state-recommendations-grid"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Application UI / Feedback",
      title,
      description: "Tailwind의 empty state 예시 이름과 개수를 맞춘 빈 상태 변형입니다.",
      tags: ["empty state", "recovery", "CTA"],
      termId: "empty-state",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-feedback-progress"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback / Progress",
    title: "Progress",
    description: "작업, 설정, 업로드, 온보딩의 진행 정도를 사용자가 이해하게 하는 피드백 패턴입니다.",
    examples: [
      { id: "progress-bar-page", eyebrow: "Application UI / Feedback", title: "Progress bar", description: "작업이 얼마나 진행됐는지 수평 막대로 보여줍니다.", tags: ["progress", "percent", "task"], termId: "progress-bar", preview: "progress-feedback-bar" },
      { id: "loading-progress-page", eyebrow: "Application UI / Feedback", title: "Loading state", description: "결과를 기다리는 중이라는 상태를 명확히 전달합니다.", tags: ["loading", "wait", "state"], termId: "loading-state", preview: "progress-feedback-loading" },
      { id: "setup-progress-page", eyebrow: "Application UI / Feedback", title: "Setup progress", description: "초기 설정이나 온보딩의 남은 작업을 보여줘 계속 진행하게 합니다.", tags: ["setup", "onboarding", "completion"], termId: "setup-progress", preview: "progress-feedback-setup" },
    ],
  }],
  [navFilter("plus-feedback-skeletons"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback / Skeletons",
    title: "Skeletons",
    description: "콘텐츠가 로드되기 전 실제 레이아웃과 비슷한 자리표시자를 보여주는 로딩 피드백 패턴입니다.",
    examples: [
      { id: "card-skeleton", eyebrow: "Application UI / Feedback", title: "Card skeleton", description: "카드나 패널이 곧 채워질 영역을 미리 보여줍니다.", tags: ["loading", "placeholder", "layout"], termId: "skeleton", preview: "skeleton-feedback-card" },
      { id: "table-skeleton", eyebrow: "Application UI / Feedback", title: "Table skeleton", description: "행과 열 구조를 유지한 채 데이터 로딩 중임을 보여줍니다.", tags: ["table", "loading", "rows"], termId: "loading-state", preview: "skeleton-feedback-table" },
      { id: "content-skeleton", eyebrow: "Application UI / Feedback", title: "Content skeleton", description: "텍스트와 미디어가 로드되기 전 화면 흔들림을 줄입니다.", tags: ["content", "placeholder", "stability"], termId: "skeleton", preview: "skeleton-feedback-content" },
    ],
  }],
  [navFilter("plus-feedback-toasts"), {
    breadcrumb: "Plus / UI Blocks / Application UI / Feedback / Toasts",
    title: "Toasts",
    description: "저장 완료, 삭제 취소, 짧은 상태 변화를 화면 구석에 잠깐 보여주는 피드백 패턴입니다.",
    examples: [
      { id: "success-toast", eyebrow: "Application UI / Feedback", title: "Success toast", description: "저장이나 생성 완료처럼 짧게 알려도 되는 결과를 보여줍니다.", tags: ["success", "temporary", "saved"], termId: "toast", preview: "toast-feedback-success" },
      { id: "toast-stack-page", eyebrow: "Application UI / Feedback", title: "Toast stack", description: "여러 알림이 이어질 때 쌓이는 규칙과 위치를 유지합니다.", tags: ["stack", "notifications", "queue"], termId: "toast-stack", preview: "toast-feedback-stack" },
      { id: "success-state-toast", eyebrow: "Application UI / Feedback", title: "Success feedback", description: "완료 상태를 짧은 메시지로 전달하고 사용자를 방해하지 않습니다.", tags: ["success state", "feedback", "non-blocking"], termId: "success-state", preview: "toast-feedback-undo" },
    ],
  }],
  [navFilter("plus-ecommerce-components"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components",
    title: "Components",
    description: "상품 탐색, 장바구니, 결제, 주문 확인에 반복적으로 쓰이는 커머스 UI 조각입니다.",
    examples: [
      { id: "product-overview-component", eyebrow: "Ecommerce / Components", title: "Product overview", description: "상품 이미지, 가격, 옵션, 구매 행동을 한 덩어리로 보여줍니다.", tags: ["product", "options", "purchase"], termId: "product-card", preview: "commerce-product-page" },
      { id: "cart-summary-component", eyebrow: "Ecommerce / Components", title: "Cart summary", description: "구매 전 상품 수량, 배송비, 총액, 결제 CTA를 정리합니다.", tags: ["cart", "summary", "checkout"], termId: "cart-summary", preview: "commerce-cart-page" },
      { id: "checkout-component", eyebrow: "Ecommerce / Components", title: "Checkout step", description: "배송, 결제, 확인 단계를 나눠 사용자가 어디까지 왔는지 보여줍니다.", tags: ["checkout", "payment", "step"], termId: "checkout-step", preview: "commerce-checkout-page" },
    ],
  }],
  [navFilter("plus-ecommerce-product-overviews"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Product Overviews",
    title: "Product Overviews",
    description: "상품 상세 영역에서 이미지, 이름, 가격, 옵션, 구매 행동을 조합하는 패턴입니다.",
    examples: ([
      ["With image grid", "commerce-overview-image-grid"],
      ["With tiered images", "commerce-overview-tiered-images"],
      ["With image gallery and expandable details", "commerce-overview-gallery-details"],
      ["Split with image", "commerce-overview-split-image"],
      ["With tabs", "commerce-overview-tabs"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 product overview 예시 이름과 개수를 맞춘 상품 상세 컴포넌트 변형입니다.",
      tags: ["product overview", "gallery", "purchase"],
      termId: "product-card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-product-lists"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Product Lists",
    title: "Product Lists",
    description: "여러 상품을 그리드나 리스트로 보여주고 정렬, 필터, 빠른 구매 행동을 연결하는 패턴입니다.",
    examples: ([
      ["With inline price", "commerce-list-inline-price"],
      ["Simple", "commerce-list-simple"],
      ["With CTA link", "commerce-list-cta-link"],
      ["With color swatches and horizontal scrolling", "commerce-list-swatches-scroll"],
      ["With tall images", "commerce-list-tall-images"],
      ["With image overlay and add button", "commerce-list-overlay-add"],
      ["With tall images and CTA link", "commerce-list-tall-cta"],
      ["With border grid", "commerce-list-border-grid"],
      ["With supporting text", "commerce-list-supporting-text"],
      ["With inline price and CTA link", "commerce-list-inline-price-cta"],
      ["Card with full details", "commerce-list-card-details"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 product list 예시 이름과 개수를 맞춘 상품 목록 변형입니다.",
      tags: ["product list", "grid", "price"],
      termId: "product-card",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-category-previews"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Category Previews",
    title: "Category Previews",
    description: "상위 카테고리, 컬렉션, 추천 묶음을 이미지와 짧은 설명으로 탐색하게 하는 패턴입니다.",
    examples: ([
      ["Three-column", "commerce-category-three-column"],
      ["With image backgrounds", "commerce-category-image-backgrounds"],
      ["With background image and detail overlay", "commerce-category-detail-overlay"],
      ["Three-column with description", "commerce-category-description"],
      ["With scrolling cards", "commerce-category-scrolling-cards"],
      ["With split images", "commerce-category-split-images"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 category preview 예시 이름과 개수를 맞춘 카테고리 탐색 변형입니다.",
      tags: ["category", "preview", "collection"],
      termId: "product-card",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-shopping-carts"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Shopping Carts",
    title: "Shopping Carts",
    description: "담긴 상품, 수량 변경, 배송비, 할인, 총액, 결제 CTA를 정리하는 구매 전 패턴입니다.",
    examples: ([
      ["Drawer", "commerce-cart-drawer"],
      ["Two column with quantity dropdown", "commerce-cart-two-column"],
      ["Single column", "commerce-cart-single-column"],
      ["With extended summary", "commerce-cart-extended-summary"],
      ["Dialog", "commerce-cart-dialog"],
      ["Popover", "commerce-cart-popover"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 shopping cart 예시 이름과 개수를 맞춘 장바구니 변형입니다.",
      tags: ["shopping cart", "summary", "checkout"],
      termId: "cart-summary",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-category-filters"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Category Filters",
    title: "Category Filters",
    description: "카테고리, 가격, 색상, 브랜드, 재고 상태 같은 조건으로 상품 목록을 좁히는 패턴입니다.",
    examples: ([
      ["With inline actions and expandable sidebar filters", "commerce-filter-inline-sidebar"],
      ["With centered text and dropdown product filters", "commerce-filter-centered-dropdown"],
      ["With dropdown product filters", "commerce-filter-dropdown-products"],
      ["With expandable product filter panel", "commerce-filter-expandable-panel"],
      ["Sidebar filters", "commerce-filter-sidebar"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 category filter 예시 이름과 개수를 맞춘 필터링 변형입니다.",
      tags: ["filters", "category", "facets"],
      termId: "filter-panel",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-product-quickviews"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Product Quickviews",
    title: "Product Quickviews",
    description: "목록을 떠나지 않고 상품 이미지, 옵션, 가격, 담기 행동을 빠르게 확인하는 패턴입니다.",
    examples: ([
      ["With color and size selector", "commerce-quickview-color-size"],
      ["With color selector, size selector, and details link", "commerce-quickview-details-link"],
      ["With large size selector", "commerce-quickview-large-size"],
      ["With color selector and description", "commerce-quickview-description"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 product quickview 예시 이름과 개수를 맞춘 빠른 상품 보기 변형입니다.",
      tags: ["quickview", "product", "options"],
      termId: "product-option-sheet",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-product-features"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Product Features",
    title: "Product Features",
    description: "상품의 장점, 소재, 사용 장면, 포함 구성을 상세 설명 영역으로 풀어내는 패턴입니다.",
    examples: ([
      ["With image grid", "commerce-feature-image-grid"],
      ["With header, images, and descriptions", "commerce-feature-header-descriptions"],
      ["With fading image", "commerce-feature-fading-image"],
      ["With wide images", "commerce-feature-wide-images"],
      ["With split image", "commerce-feature-split-image"],
      ["With tabs", "commerce-feature-tabs"],
      ["With alternating sections", "commerce-feature-alternating"],
      ["With square images", "commerce-feature-square-images"],
      ["With tiered images", "commerce-feature-tiered-images"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 product feature 예시 이름과 개수를 맞춘 상품 설명 변형입니다.",
      tags: ["features", "product", "benefits"],
      termId: "product-card",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-store-navigation"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Store Navigation",
    title: "Store Navigation",
    description: "스토어의 카테고리, 컬렉션, 검색, 장바구니, 계정 진입을 상단이나 보조 내비게이션으로 정리합니다.",
    examples: [
      ["With featured categories", "commerce-store-nav-featured"],
      ["With image grid", "commerce-store-nav-image-grid"],
      ["With simple menu and promo", "commerce-store-nav-simple-promo"],
      ["With centered logo and featured categories", "commerce-store-nav-centered-logo"],
      ["With double column and persistent mobile nav", "commerce-store-nav-double-mobile"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 store navigation 예시 이름과 개수를 맞춘 스토어 탐색 변형입니다.",
      tags: ["store navigation", "categories", "cart"],
      termId: "product-card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-promo-sections"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Promo Sections",
    title: "Promo Sections",
    description: "할인, 신규 컬렉션, 무료 배송, 시즌 캠페인을 상품 탐색 흐름 중간에 강조하는 패턴입니다.",
    examples: [
      ["With image tiles", "commerce-promo-image-tiles"],
      ["With fading background image and testimonials", "commerce-promo-fading-testimonials"],
      ["Full-width with background image", "commerce-promo-full-background"],
      ["Full-width with overlapping image tiles", "commerce-promo-full-overlap"],
      ["With background image", "commerce-promo-background-image"],
      ["With overlapping image tiles", "commerce-promo-overlapping-tiles"],
      ["With offers and split image", "commerce-promo-offers-split"],
      ["Full-width with background image and large content", "commerce-promo-large-content"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 promo section 예시 이름과 개수를 맞춘 프로모션 변형입니다.",
      tags: ["promo", "campaign", "commerce"],
      termId: "price-card",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-checkout-forms"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Checkout Forms",
    title: "Checkout Forms",
    description: "배송지, 연락처, 결제 수단, 주문 확인을 단계적으로 입력하게 하는 결제 폼 패턴입니다.",
    examples: [
      ["Single step with order summary", "commerce-checkout-single-summary"],
      ["With mobile order summary overlay", "commerce-checkout-mobile-overlay"],
      ["Multi-step", "commerce-checkout-multi-step"],
      ["With order summary sidebar", "commerce-checkout-sidebar-summary"],
      ["Split with order summary", "commerce-checkout-split-summary"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 checkout form 예시 이름과 개수를 맞춘 결제 폼 변형입니다.",
      tags: ["checkout", "form", "payment"],
      termId: "checkout-step",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-reviews"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Reviews",
    title: "Reviews",
    description: "평점, 리뷰 요약, 개별 후기, 작성 CTA를 통해 구매 전 신뢰를 만드는 패턴입니다.",
    examples: [
      ["Multi-column", "commerce-review-multi-column"],
      ["With summary chart", "commerce-review-summary-chart"],
      ["Avatars with separate description", "commerce-review-avatar-description"],
      ["Simple with avatars", "commerce-review-simple-avatars"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 review 예시 이름과 개수를 맞춘 구매 후기 변형입니다.",
      tags: ["reviews", "rating", "trust"],
      termId: "testimonial-section",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-order-summaries"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Order Summaries",
    title: "Order Summaries",
    description: "상품 금액, 배송비, 할인, 세금, 총액, 결제 CTA를 압축해 보여주는 구매 요약 패턴입니다.",
    examples: [
      ["With split image", "commerce-order-summary-split-image"],
      ["With progress bars", "commerce-order-summary-progress-bars"],
      ["With large images and progress bars", "commerce-order-summary-large-images"],
      ["Simple with full order details", "commerce-order-summary-full-details"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 order summary 예시 이름과 개수를 맞춘 주문 요약 변형입니다.",
      tags: ["order summary", "cart", "total"],
      termId: "cart-summary",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-order-history"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Order History",
    title: "Order History",
    description: "지난 주문, 배송 상태, 재구매, 영수증, 문의 행동을 목록으로 정리하는 패턴입니다.",
    examples: [
      ["Invoice panels", "commerce-order-history-panels"],
      ["Invoice table", "commerce-order-history-table"],
      ["Invoice list", "commerce-order-history-list"],
      ["Invoice list with quick actions", "commerce-order-history-quick-actions"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 order history 예시 이름과 개수를 맞춘 주문 내역 변형입니다.",
      tags: ["order history", "orders", "status"],
      termId: "order-status",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-incentives"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Components / Incentives",
    title: "Incentives",
    description: "무료 배송, 반품 보장, 할인, 멤버십 혜택처럼 구매 결정을 돕는 신뢰와 혜택 신호를 배치하는 패턴입니다.",
    examples: [
      ["3-column with illustrations and split header", "commerce-incentives-split-header"],
      ["4-column with illustrations", "commerce-incentives-four-column"],
      ["3-column with illustrations and header", "commerce-incentives-header"],
      ["3-column with illustrations and centered text", "commerce-incentives-centered"],
      ["3-column with illustrations and heading", "commerce-incentives-heading-band"],
      ["2x2 grid with illustrations", "commerce-incentives-two-by-two"],
      ["3-column with icons and supporting text", "commerce-incentives-icons-supporting"],
      ["3-column with icons", "commerce-incentives-icons"],
    ].map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Components",
      title,
      description: "Tailwind의 incentive 예시 이름과 개수를 맞춘 구매 혜택 변형입니다.",
      tags: ["incentives", "benefits", "trust"],
      termId: "announcement-banner",
      preview: preview as MarketingPreviewVariant,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples",
    title: "Page Examples",
    description: "스토어 홈, 상품 상세, 카테고리, 장바구니, 체크아웃, 주문 상세, 주문 내역처럼 완성 화면 단위의 커머스 예시입니다.",
    examples: [
      { id: "storefront-pages-overview", eyebrow: "Ecommerce / Page Examples", title: "Storefront Pages", description: "브랜드, 프로모션, 카테고리, 대표 상품을 첫 화면에 배치합니다.", tags: ["storefront", "categories", "products"], termId: "product-card", preview: "commerce-storefront-page" },
      { id: "checkout-pages-overview", eyebrow: "Ecommerce / Page Examples", title: "Checkout Pages", description: "주문 요약과 입력 단계를 한 화면에서 연결합니다.", tags: ["checkout", "payment", "summary"], termId: "checkout-step", preview: "commerce-checkout-page" },
      { id: "order-history-pages-overview", eyebrow: "Ecommerce / Page Examples", title: "Order History Pages", description: "지난 주문 목록과 배송 상태, 재구매 행동을 계정 화면에서 정리합니다.", tags: ["orders", "history", "account"], termId: "order-status", preview: "commerce-order-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-storefront-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Storefront Pages",
    title: "Storefront Pages",
    description: "브랜드 헤더, 프로모션, 카테고리 프리뷰, 대표 상품 목록을 조합한 스토어 첫 화면 예시입니다.",
    examples: ([
      ["With dark nav and footer", "commerce-storefront-dark-nav"],
      ["With offers and testimonials", "commerce-storefront-offers-testimonials"],
      ["With image tiles and feature sections", "commerce-storefront-image-tiles"],
      ["With overlapping image tiles and perks", "commerce-storefront-overlap-perks"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 storefront page 예시 이름과 개수를 맞춘 스토어 첫 화면 변형입니다.",
      tags: ["storefront", "page example", "commerce"],
      termId: "product-card",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-product-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Product Pages",
    title: "Product Pages",
    description: "상품 갤러리, 상세 정보, 옵션 선택, 가격, 구매 CTA, 리뷰로 구성되는 상품 상세 화면 예시입니다.",
    examples: ([
      ["With related products", "commerce-product-related"],
      ["With image grid", "commerce-product-image-grid"],
      ["With expandable product details", "commerce-product-expandable-details"],
      ["With featured details", "commerce-product-featured-details"],
      ["With tabs and related products", "commerce-product-tabs-related"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 product page 예시 이름과 개수를 맞춘 상품 상세 화면 변형입니다.",
      tags: ["product page", "gallery", "purchase"],
      termId: "product-card",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-category-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Category Pages",
    title: "Category Pages",
    description: "카테고리 제목, 필터, 정렬, 상품 목록을 조합해 탐색과 비교를 돕는 화면 예시입니다.",
    examples: ([
      ["With text header and image product grid", "commerce-category-text-image-grid"],
      ["With image header and detail product grid", "commerce-category-image-detail-grid"],
      ["With text header and simple product grid", "commerce-category-text-simple-grid"],
      ["With product grid and pagination", "commerce-category-grid-pagination"],
      ["With large images and filters sidebar", "commerce-category-large-sidebar"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 category page 예시 이름과 개수를 맞춘 카테고리 화면 변형입니다.",
      tags: ["category page", "filters", "products"],
      termId: "faceted-filter",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-shopping-cart-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Shopping Cart Pages",
    title: "Shopping Cart Pages",
    description: "담긴 상품 목록, 수량 조절, 쿠폰/배송/총액, 결제 CTA를 한 화면에서 다루는 장바구니 화면 예시입니다.",
    examples: ([
      ["With related products", "commerce-cart-related-products-page"],
      ["Simple with policy grid", "commerce-cart-simple-policy-page"],
      ["With policy grid and extended summary", "commerce-cart-extended-summary-page"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 shopping cart page 예시 이름과 개수를 맞춘 장바구니 화면 변형입니다.",
      tags: ["cart page", "summary", "checkout"],
      termId: "cart-summary",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-checkout-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Checkout Pages",
    title: "Checkout Pages",
    description: "배송 정보, 결제 수단, 주문 요약, 최종 확인을 단계적으로 처리하는 결제 화면 예시입니다.",
    examples: ([
      ["With order summary sidebar", "commerce-checkout-sidebar-summary-page"],
      ["Single step with order summary", "commerce-checkout-single-step-page"],
      ["With mobile order summary overlay", "commerce-checkout-mobile-overlay-page"],
      ["Multi-step", "commerce-checkout-multi-step-page"],
      ["Split with order summary", "commerce-checkout-split-summary-page"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 checkout page 예시 이름과 개수를 맞춘 결제 화면 변형입니다.",
      tags: ["checkout page", "payment", "summary"],
      termId: "checkout-step",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-order-detail-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Order Detail Pages",
    title: "Order Detail Pages",
    description: "주문번호, 결제 상태, 배송 단계, 상품 목록, 영수증과 문의 행동을 정리하는 주문 상세 화면 예시입니다.",
    examples: ([
      ["With progress bars", "commerce-order-detail-progress-page"],
      ["With large images and progress bars", "commerce-order-detail-large-images-page"],
      ["Simple with full order details", "commerce-order-detail-full-details-page"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 order detail page 예시 이름과 개수를 맞춘 주문 상세 화면 변형입니다.",
      tags: ["order detail", "status", "receipt"],
      termId: "order-status",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-order-history-pages"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Order History Pages",
    title: "Order History Pages",
    description: "지난 주문 목록, 배송 상태, 재구매, 영수증, 문의 행동을 계정 화면에서 정리하는 주문 내역 화면 예시입니다.",
    examples: ([
      ["Simple", "commerce-order-history-simple-page"],
      ["With invoice list and quick actions", "commerce-order-history-quick-actions-page"],
      ["With invoice panels", "commerce-order-history-panels-page"],
      ["With invoice tables", "commerce-order-history-tables-page"],
      ["With invoice list", "commerce-order-history-list-page"],
    ] satisfies Array<[string, MarketingPreviewVariant]>).map(([title, preview]): MarketingSectionExample => ({
      id: slugify(title),
      eyebrow: "Ecommerce / Page Examples",
      title,
      description: "Tailwind의 order history page 예시 이름과 개수를 맞춘 주문 내역 화면 변형입니다.",
      tags: ["order history", "orders", "account"],
      termId: "order-status",
      preview,
    })),
  }],
  [navFilter("plus-ecommerce-page-examples-storefront"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Storefront",
    title: "Storefront",
    description: "브랜드 헤더, 프로모션, 카테고리 프리뷰, 대표 상품 목록을 조합한 스토어 첫 화면입니다.",
    examples: [
      { id: "editorial-storefront", eyebrow: "Ecommerce / Storefront", title: "Editorial storefront", description: "큰 프로모션 영역과 추천 상품으로 브랜드 분위기를 먼저 보여줍니다.", tags: ["hero", "promo", "products"], termId: "product-card", preview: "commerce-storefront-page" },
      { id: "category-storefront", eyebrow: "Ecommerce / Storefront", title: "Category-led storefront", description: "카테고리 프리뷰를 먼저 보여줘 탐색 중심 쇼핑을 만듭니다.", tags: ["categories", "browse", "collections"], termId: "price-card", preview: "commerce-storefront-page" },
      { id: "mobile-storefront", eyebrow: "Ecommerce / Storefront", title: "Mobile storefront", description: "모바일에서 장바구니 CTA와 대표 상품을 짧은 스크롤로 배치합니다.", tags: ["mobile", "cart", "CTA"], termId: "bottom-cta-bar", preview: "commerce-storefront-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-product"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Product Page",
    title: "Product Page",
    description: "상품 갤러리, 상세 정보, 옵션 선택, 가격, 구매 CTA, 리뷰로 구성되는 상품 상세 화면입니다.",
    examples: [
      { id: "classic-product-page", eyebrow: "Ecommerce / Product Page", title: "Classic product page", description: "이미지 갤러리와 상품 정보를 좌우로 나누는 기본 상세 페이지입니다.", tags: ["gallery", "details", "purchase"], termId: "product-card", preview: "commerce-product-page" },
      { id: "option-product-page", eyebrow: "Ecommerce / Product Page", title: "Option-first product page", description: "색상, 사이즈, 수량 선택 흐름을 구매 CTA 가까이에 둡니다.", tags: ["options", "variants", "CTA"], termId: "product-option-sheet", preview: "commerce-product-page" },
      { id: "price-focused-product-page", eyebrow: "Ecommerce / Product Page", title: "Price-focused product page", description: "할인, 구성, 배송 혜택을 가격 영역과 함께 강조합니다.", tags: ["price", "discount", "shipping"], termId: "price-card", preview: "commerce-product-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-category"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Category Page",
    title: "Category Page",
    description: "카테고리 제목, 필터, 정렬, 상품 목록을 조합해 탐색과 비교를 돕는 화면입니다.",
    examples: [
      { id: "faceted-category-page", eyebrow: "Ecommerce / Category Page", title: "Faceted category page", description: "다중 필터와 상품 그리드를 함께 제공하는 데스크톱 기본형입니다.", tags: ["facets", "grid", "sort"], termId: "faceted-filter", preview: "commerce-list-page" },
      { id: "drawer-filter-category-page", eyebrow: "Ecommerce / Category Page", title: "Drawer filter category", description: "모바일에서 필터를 패널로 열고 상품 목록을 넓게 유지합니다.", tags: ["drawer", "mobile", "filters"], termId: "filter-panel", preview: "commerce-list-page" },
      { id: "collection-category-page", eyebrow: "Ecommerce / Category Page", title: "Collection category", description: "카테고리 상단에 컬렉션 설명과 대표 상품을 배치합니다.", tags: ["collection", "products", "browse"], termId: "product-card", preview: "commerce-list-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-cart"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Cart",
    title: "Cart",
    description: "담긴 상품 목록, 수량 조절, 쿠폰/배송/총액, 결제 CTA를 한 화면에서 다루는 장바구니 화면입니다.",
    examples: [
      { id: "cart-page-sidebar-summary", eyebrow: "Ecommerce / Cart Page", title: "Cart with sidebar summary", description: "상품 행과 주문 요약을 나란히 둬 결제 전 확인을 쉽게 합니다.", tags: ["cart", "summary", "items"], termId: "cart-summary", preview: "commerce-cart-page" },
      { id: "cart-quantity-page", eyebrow: "Ecommerce / Cart Page", title: "Cart with quantity controls", description: "각 상품 수량을 변경하며 금액 변화를 확인합니다.", tags: ["quantity", "items", "total"], termId: "quantity-stepper", preview: "commerce-cart-page" },
      { id: "cart-mobile-bar-page", eyebrow: "Ecommerce / Cart Page", title: "Mobile cart bar", description: "하단 요약 바를 통해 좁은 화면에서도 결제 행동을 유지합니다.", tags: ["mobile", "sticky", "checkout"], termId: "cart-summary-bar", preview: "commerce-cart-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-checkout"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Checkout",
    title: "Checkout",
    description: "배송 정보, 결제 수단, 주문 요약, 최종 확인을 단계적으로 처리하는 결제 화면입니다.",
    examples: [
      { id: "multi-step-checkout", eyebrow: "Ecommerce / Checkout Page", title: "Multi-step checkout", description: "입력 부담을 줄이기 위해 배송, 결제, 확인 단계를 나눕니다.", tags: ["steps", "payment", "review"], termId: "checkout-step", preview: "commerce-checkout-page" },
      { id: "checkout-progress-page", eyebrow: "Ecommerce / Checkout Page", title: "Checkout progress header", description: "상단 진행 표시로 현재 위치와 남은 결제 단계를 보여줍니다.", tags: ["progress", "header", "steps"], termId: "checkout-progress-header", preview: "commerce-checkout-page" },
      { id: "payment-checkout-page", eyebrow: "Ecommerce / Checkout Page", title: "Payment method checkout", description: "결제 수단 선택과 카드 입력을 주문 요약 옆에 배치합니다.", tags: ["payment", "card", "billing"], termId: "payment-method-card", preview: "commerce-checkout-page" },
    ],
  }],
  [navFilter("plus-ecommerce-page-examples-order-detail"), {
    breadcrumb: "Plus / UI Blocks / Ecommerce / Page Examples / Order Detail",
    title: "Order Detail",
    description: "주문번호, 결제 상태, 배송 단계, 상품 목록, 영수증과 문의 행동을 정리하는 주문 상세 화면입니다.",
    examples: [
      { id: "order-status-detail-page", eyebrow: "Ecommerce / Order Detail", title: "Order status detail", description: "주문 상태와 배송 단계를 명확히 보여줍니다.", tags: ["status", "delivery", "tracking"], termId: "order-status", preview: "commerce-order-page" },
      { id: "order-items-detail-page", eyebrow: "Ecommerce / Order Detail", title: "Order items detail", description: "주문 품목, 수량, 금액을 다시 확인하게 합니다.", tags: ["items", "summary", "receipt"], termId: "cart-summary", preview: "commerce-order-page" },
      { id: "order-progress-detail-page", eyebrow: "Ecommerce / Order Detail", title: "Order progress detail", description: "결제부터 배송 완료까지 단계를 시간순으로 보여줍니다.", tags: ["progress", "timeline", "detail"], termId: "checkout-step", preview: "commerce-order-page" },
    ],
  }],
  [navFilter("plus-templates-marketing"), {
    breadcrumb: "Plus / Templates / Marketing Pages",
    title: "Marketing Pages",
    description: "랜딩, 가격, 회사 소개처럼 공개 웹사이트의 완성 페이지 출발점으로 쓰는 템플릿입니다.",
    examples: [
      { id: "startup-landing-template", eyebrow: "Templates / Marketing", title: "Startup Landing", description: "히어로, 기능, CTA를 연결한 초기 제품 소개 페이지입니다.", tags: ["landing", "startup", "conversion"], termId: "hero", preview: "landing-saas" },
      { id: "saas-pricing-template", eyebrow: "Templates / Marketing", title: "SaaS Pricing", description: "플랜 비교, 추천 요금제, 기능 비교를 포함한 가격 페이지입니다.", tags: ["pricing", "plans", "comparison"], termId: "pricing-section", preview: "pricing-comparison-page" },
      { id: "company-about-template", eyebrow: "Templates / Marketing", title: "Company About", description: "팀, 미션, 사회적 증거를 묶어 신뢰를 만드는 회사 소개 페이지입니다.", tags: ["about", "team", "trust"], termId: "testimonial-section", preview: "about-team-page" },
    ],
  }],
  [navFilter("plus-templates-marketing-startup-landing"), {
    breadcrumb: "Plus / Templates / Marketing Pages / Startup Landing",
    title: "Startup Landing",
    description: "초기 제품이나 SaaS를 소개하기 위한 완성 랜딩 페이지 템플릿입니다.",
    examples: [
      { id: "startup-hero", eyebrow: "Templates / Startup Landing", title: "Hero and product promise", description: "첫 화면에서 제품명, 핵심 문장, 주요 CTA를 정리합니다.", tags: ["hero", "message", "CTA"], termId: "hero", preview: "landing-saas" },
      { id: "startup-features", eyebrow: "Templates / Startup Landing", title: "Feature grid continuation", description: "제품의 핵심 기능을 반복 가능한 섹션으로 이어 붙입니다.", tags: ["features", "grid", "benefits"], termId: "feature-grid-section", preview: "features-grid" },
      { id: "startup-cta", eyebrow: "Templates / Startup Landing", title: "Conversion CTA", description: "페이지 하단에서 가입이나 데모 요청으로 마무리합니다.", tags: ["conversion", "CTA", "footer"], termId: "cta-section", preview: "cta-centered" },
    ],
  }],
  [navFilter("plus-templates-marketing-saas-pricing"), {
    breadcrumb: "Plus / Templates / Marketing Pages / SaaS Pricing",
    title: "SaaS Pricing",
    description: "요금제 선택과 업그레이드 결정을 돕는 완성 가격 페이지 템플릿입니다.",
    examples: [
      { id: "pricing-page-template", eyebrow: "Templates / SaaS Pricing", title: "Pricing page layout", description: "플랜 카드, 추천 플랜, 기능 비교를 한 페이지 흐름으로 구성합니다.", tags: ["pricing", "plans", "layout"], termId: "pricing-section", preview: "pricing-comparison-page" },
      { id: "price-card-template", eyebrow: "Templates / SaaS Pricing", title: "Plan selection block", description: "각 플랜의 가격과 포함 기능을 결정 단위로 보여줍니다.", tags: ["price", "features", "CTA"], termId: "price-card", preview: "pricing-three-tier" },
      { id: "plan-card-template", eyebrow: "Templates / SaaS Pricing", title: "Subscription plan comparison", description: "개인, 팀, 엔터프라이즈 플랜을 비교 가능한 카드로 나눕니다.", tags: ["subscription", "comparison", "teams"], termId: "plan-card", preview: "pricing-highlighted" },
    ],
  }],
  [navFilter("plus-templates-marketing-company-about"), {
    breadcrumb: "Plus / Templates / Marketing Pages / Company About",
    title: "Company About",
    description: "팀, 미션, 고객 신뢰, 브랜드 로고를 조합한 회사 소개 페이지 템플릿입니다.",
    examples: [
      { id: "about-story-template", eyebrow: "Templates / Company About", title: "Company story", description: "브랜드의 시작과 제품 관점을 읽기 좋은 흐름으로 정리합니다.", tags: ["story", "mission", "brand"], termId: "testimonial-section", preview: "about-story-page" },
      { id: "about-team-template", eyebrow: "Templates / Company About", title: "Team profile section", description: "팀 구성과 역할을 인물 중심으로 보여줍니다.", tags: ["team", "people", "roles"], termId: "profile-card", preview: "about-team-page" },
      { id: "about-trust-template", eyebrow: "Templates / Company About", title: "Trust and logos", description: "고객사 로고와 후기 섹션으로 신뢰를 보강합니다.", tags: ["logos", "proof", "customers"], termId: "logo", preview: "logo-cloud-grid" },
    ],
  }],
  [navFilter("plus-templates-dashboard"), {
    breadcrumb: "Plus / Templates / Dashboard Screens",
    title: "Dashboard Screens",
    description: "운영 지표, 설정, 결제 관리처럼 앱 내부의 완성 화면으로 시작하는 템플릿입니다.",
    examples: [
      { id: "analytics-dashboard-template", eyebrow: "Templates / Dashboard", title: "Analytics Dashboard", description: "지표, 차트, 표를 한 화면에 정리한 운영 대시보드입니다.", tags: ["metrics", "tables", "operations"], termId: "dashboard-overview-page", preview: "app-example-dashboard" },
      { id: "settings-console-template", eyebrow: "Templates / Dashboard", title: "Settings Console", description: "설정 내비게이션과 폼 패널을 조합한 관리 화면입니다.", tags: ["settings", "forms", "sidebar"], termId: "settings-page-layout", preview: "app-example-settings" },
      { id: "billing-portal-template", eyebrow: "Templates / Dashboard", title: "Billing Portal", description: "현재 플랜, 결제수단, 청구 내역을 관리하는 결제 화면입니다.", tags: ["billing", "payment", "plans"], termId: "billing-settings-page", preview: "app-example-settings" },
    ],
  }],
  [navFilter("plus-templates-dashboard-analytics"), {
    breadcrumb: "Plus / Templates / Dashboard Screens / Analytics Dashboard",
    title: "Analytics Dashboard",
    description: "업무 현황을 반복적으로 확인하는 운영자용 대시보드 템플릿입니다.",
    examples: [
      { id: "dashboard-overview-template", eyebrow: "Templates / Analytics Dashboard", title: "Overview screen", description: "핵심 지표와 최근 항목을 첫 화면에서 비교하게 합니다.", tags: ["overview", "metrics", "recent"], termId: "dashboard-overview-page", preview: "app-example-dashboard" },
      { id: "dashboard-table-template", eyebrow: "Templates / Analytics Dashboard", title: "Table operations", description: "검색, 필터, 일괄 행동을 포함한 운영 표를 배치합니다.", tags: ["table", "filters", "actions"], termId: "data-table-toolbar", preview: "data-table" },
      { id: "dashboard-stats-template", eyebrow: "Templates / Analytics Dashboard", title: "Metric summary", description: "상단 요약 지표로 중요한 변화만 빠르게 읽게 합니다.", tags: ["stats", "summary", "trend"], termId: "stat-list", preview: "data-metrics" },
    ],
  }],
  [navFilter("plus-templates-dashboard-settings"), {
    breadcrumb: "Plus / Templates / Dashboard Screens / Settings Console",
    title: "Settings Console",
    description: "계정, 팀, 알림, 보안 설정을 탐색하고 저장하는 앱 설정 템플릿입니다.",
    examples: [
      { id: "settings-layout-template", eyebrow: "Templates / Settings Console", title: "Settings page layout", description: "왼쪽 설정 메뉴와 오른쪽 설정 폼을 나눕니다.", tags: ["settings", "navigation", "forms"], termId: "settings-page-layout", preview: "app-example-settings" },
      { id: "profile-settings-template", eyebrow: "Templates / Settings Console", title: "Profile settings", description: "사용자 프로필, 아바타, 연락처 입력을 편집합니다.", tags: ["profile", "account", "form"], termId: "profile-settings-form", preview: "form-settings" },
      { id: "settings-sidebar-template", eyebrow: "Templates / Settings Console", title: "Settings sidebar", description: "설정 카테고리를 반복 이동하기 쉬운 사이드바로 유지합니다.", tags: ["sidebar", "categories", "active"], termId: "sidebar-nav", preview: "sidebar-page" },
    ],
  }],
  [navFilter("plus-templates-dashboard-billing"), {
    breadcrumb: "Plus / Templates / Dashboard Screens / Billing Portal",
    title: "Billing Portal",
    description: "구독 플랜, 결제 수단, 청구 내역을 관리하는 SaaS 결제 템플릿입니다.",
    examples: [
      { id: "billing-settings-template", eyebrow: "Templates / Billing Portal", title: "Billing settings", description: "현재 플랜과 결제 내역을 한 화면에서 관리합니다.", tags: ["billing", "plan", "invoices"], termId: "billing-settings-page", preview: "app-example-settings" },
      { id: "payment-method-template", eyebrow: "Templates / Billing Portal", title: "Payment method", description: "카드와 청구 주소 입력을 결제 설정 안에 배치합니다.", tags: ["payment", "card", "billing"], termId: "payment-method-card", preview: "commerce-checkout-page" },
      { id: "plan-management-template", eyebrow: "Templates / Billing Portal", title: "Plan management", description: "플랜 비교와 업그레이드 행동을 설정 흐름에 연결합니다.", tags: ["plans", "upgrade", "subscription"], termId: "plan-card", preview: "pricing-highlighted" },
    ],
  }],
  [navFilter("plus-templates-auth"), {
    breadcrumb: "Plus / Templates / Auth Screens",
    title: "Auth Screens",
    description: "로그인, 가입, 초대 수락, 권한 동의처럼 인증 전후 흐름을 완성 화면으로 다루는 템플릿입니다.",
    examples: [
      { id: "sign-in-suite-template", eyebrow: "Templates / Auth", title: "Sign-in Suite", description: "로그인과 가입 화면을 같은 시스템 안에서 구성합니다.", tags: ["login", "signup", "auth"], termId: "login-page", preview: "app-example-auth" },
      { id: "invite-flow-template", eyebrow: "Templates / Auth", title: "Invite Flow", description: "초대 수락, 역할 선택, 첫 진입 화면을 연결합니다.", tags: ["invite", "team", "role"], termId: "invite-acceptance-screen", preview: "app-example-onboarding" },
      { id: "consent-review-template", eyebrow: "Templates / Auth", title: "Consent Review", description: "외부 계정 연결 전 권한 범위와 동의 행동을 확인합니다.", tags: ["consent", "permissions", "review"], termId: "consent-review-screen", preview: "app-example-auth" },
    ],
  }],
  [navFilter("plus-templates-auth-sign-in"), {
    breadcrumb: "Plus / Templates / Auth Screens / Sign-in Suite",
    title: "Sign-in Suite",
    description: "로그인, 가입, 비밀번호 회복을 같은 브랜드 시스템으로 묶는 인증 템플릿입니다.",
    examples: [
      { id: "login-page-template", eyebrow: "Templates / Sign-in Suite", title: "Login page", description: "이메일, 비밀번호, 소셜 로그인 진입을 정리합니다.", tags: ["login", "email", "social"], termId: "login-page", preview: "app-example-auth" },
      { id: "auth-card-template", eyebrow: "Templates / Sign-in Suite", title: "Auth card", description: "인증 입력을 독립된 패널로 묶어 집중도를 높입니다.", tags: ["card", "form", "auth"], termId: "auth-card", preview: "auth-form-page" },
      { id: "signup-form-template", eyebrow: "Templates / Sign-in Suite", title: "Signup form", description: "가입에 필요한 최소 입력과 약관 동의를 처리합니다.", tags: ["signup", "form", "terms"], termId: "signup-form", preview: "form-auth" },
    ],
  }],
  [navFilter("plus-templates-auth-invite"), {
    breadcrumb: "Plus / Templates / Auth Screens / Invite Flow",
    title: "Invite Flow",
    description: "팀 초대를 받은 사용자가 계정 선택, 역할 확인, 첫 화면 진입까지 이어지는 템플릿입니다.",
    examples: [
      { id: "invite-acceptance-template", eyebrow: "Templates / Invite Flow", title: "Invite acceptance", description: "초대 조직과 초대한 사람, 수락 행동을 명확히 보여줍니다.", tags: ["invite", "accept", "team"], termId: "invite-acceptance-screen", preview: "app-example-onboarding" },
      { id: "welcome-choice-template", eyebrow: "Templates / Invite Flow", title: "Welcome choice", description: "새 워크스페이스 생성과 기존 초대 수락을 선택하게 합니다.", tags: ["welcome", "choice", "workspace"], termId: "welcome-choice-screen", preview: "app-example-onboarding" },
      { id: "auth-method-template", eyebrow: "Templates / Invite Flow", title: "Auth method choice", description: "이메일, SSO, 소셜 로그인 중 적절한 인증 방법을 고르게 합니다.", tags: ["method", "SSO", "choice"], termId: "auth-method-choice", preview: "app-example-auth" },
    ],
  }],
  [navFilter("plus-templates-auth-consent"), {
    breadcrumb: "Plus / Templates / Auth Screens / Consent Review",
    title: "Consent Review",
    description: "외부 계정 연결이나 데이터 접근 전 권한 범위를 설명하고 동의를 받는 템플릿입니다.",
    examples: [
      { id: "consent-review-screen-template", eyebrow: "Templates / Consent Review", title: "Consent review screen", description: "연결할 계정, 접근 범위, 취소/동의 행동을 보여줍니다.", tags: ["consent", "permissions", "scope"], termId: "consent-review-screen", preview: "app-example-auth" },
      { id: "auth-choice-consent-template", eyebrow: "Templates / Consent Review", title: "Account method", description: "동의 전에 어떤 계정으로 연결할지 선택하게 합니다.", tags: ["account", "method", "choice"], termId: "auth-method-choice", preview: "auth-form-page" },
      { id: "login-consent-template", eyebrow: "Templates / Consent Review", title: "Re-auth before consent", description: "민감한 연결 전에 다시 로그인해 권한 부여 주체를 확인합니다.", tags: ["login", "security", "review"], termId: "login-page", preview: "app-example-auth" },
    ],
  }],
  [navFilter("plus-templates-ecommerce"), {
    breadcrumb: "Plus / Templates / Ecommerce Screens",
    title: "Ecommerce Screens",
    description: "스토어, 체크아웃, 주문 계정처럼 실제 구매 흐름을 완성 화면으로 시작하는 템플릿입니다.",
    examples: [
      { id: "storefront-kit-template", eyebrow: "Templates / Ecommerce", title: "Storefront Kit", description: "브랜드, 프로모션, 상품 목록을 결합한 스토어 첫 화면입니다.", tags: ["storefront", "products", "promo"], termId: "product-card", preview: "commerce-storefront-page" },
      { id: "checkout-flow-template", eyebrow: "Templates / Ecommerce", title: "Checkout Flow", description: "장바구니부터 결제 완료 전 확인까지 이어지는 구매 흐름입니다.", tags: ["checkout", "payment", "summary"], termId: "checkout-step", preview: "commerce-checkout-page" },
      { id: "order-account-template", eyebrow: "Templates / Ecommerce", title: "Order Account", description: "지난 주문과 배송 상태를 확인하는 계정 영역 템플릿입니다.", tags: ["orders", "account", "status"], termId: "order-status", preview: "commerce-order-page" },
    ],
  }],
  [navFilter("plus-templates-ecommerce-storefront"), {
    breadcrumb: "Plus / Templates / Ecommerce Screens / Storefront Kit",
    title: "Storefront Kit",
    description: "상품 탐색과 구매 유도를 위한 스토어 홈 템플릿입니다.",
    examples: [
      { id: "storefront-product-template", eyebrow: "Templates / Storefront Kit", title: "Product grid storefront", description: "대표 상품을 그리드로 보여주고 바로 상세로 이어지게 합니다.", tags: ["products", "grid", "browse"], termId: "product-card", preview: "commerce-storefront-page" },
      { id: "storefront-price-template", eyebrow: "Templates / Storefront Kit", title: "Featured price panel", description: "대표 상품이나 번들의 가격 혜택을 강조합니다.", tags: ["price", "promo", "featured"], termId: "price-card", preview: "commerce-promo-page" },
      { id: "storefront-cta-template", eyebrow: "Templates / Storefront Kit", title: "Sticky shopping CTA", description: "모바일 첫 화면에서도 장바구니나 구매 행동을 유지합니다.", tags: ["sticky", "mobile", "CTA"], termId: "bottom-cta-bar", preview: "commerce-cart-page" },
    ],
  }],
  [navFilter("plus-templates-ecommerce-checkout"), {
    breadcrumb: "Plus / Templates / Ecommerce Screens / Checkout Flow",
    title: "Checkout Flow",
    description: "배송, 결제, 확인을 단계적으로 처리하는 구매 완료 템플릿입니다.",
    examples: [
      { id: "checkout-step-template", eyebrow: "Templates / Checkout Flow", title: "Checkout steps", description: "사용자가 현재 결제 단계와 남은 단계를 알게 합니다.", tags: ["steps", "checkout", "review"], termId: "checkout-step", preview: "commerce-checkout-page" },
      { id: "checkout-progress-template", eyebrow: "Templates / Checkout Flow", title: "Progress header", description: "상단 진행 표시로 결제 이탈을 줄입니다.", tags: ["progress", "header", "payment"], termId: "checkout-progress-header", preview: "commerce-checkout-page" },
      { id: "checkout-payment-template", eyebrow: "Templates / Checkout Flow", title: "Payment method", description: "결제 수단과 주문 요약을 같은 흐름에서 확인합니다.", tags: ["payment", "card", "summary"], termId: "payment-method-card", preview: "commerce-checkout-page" },
    ],
  }],
  [navFilter("plus-templates-ecommerce-orders"), {
    breadcrumb: "Plus / Templates / Ecommerce Screens / Order Account",
    title: "Order Account",
    description: "주문 내역, 배송 상태, 결제 정보, 재구매 행동을 관리하는 계정 화면 템플릿입니다.",
    examples: [
      { id: "order-status-template", eyebrow: "Templates / Order Account", title: "Order status", description: "주문별 결제와 배송 상태를 쉽게 확인하게 합니다.", tags: ["status", "orders", "delivery"], termId: "order-status", preview: "commerce-order-page" },
      { id: "order-summary-template", eyebrow: "Templates / Order Account", title: "Order summary", description: "주문 품목과 총액을 다시 확인할 수 있게 합니다.", tags: ["summary", "items", "receipt"], termId: "cart-summary", preview: "commerce-order-page" },
      { id: "billing-account-template", eyebrow: "Templates / Order Account", title: "Billing account", description: "결제 수단과 청구 정보를 계정 영역에 함께 둡니다.", tags: ["billing", "payment", "account"], termId: "billing-settings-page", preview: "app-example-settings" },
    ],
  }],
  [navFilter("plus-templates-onboarding"), {
    breadcrumb: "Plus / Templates / Onboarding Screens",
    title: "Onboarding Screens",
    description: "첫 방문자가 제품 사용을 시작하도록 선택, 설정, 권한 확인을 연결하는 템플릿입니다.",
    examples: [
      { id: "setup-wizard-template", eyebrow: "Templates / Onboarding", title: "Setup Wizard", description: "단계형 설정과 진행 표시를 포함한 초기 설정 흐름입니다.", tags: ["setup", "wizard", "progress"], termId: "onboarding-flow-page", preview: "app-example-onboarding" },
      { id: "welcome-flow-template", eyebrow: "Templates / Onboarding", title: "Welcome Flow", description: "첫 선택과 역할 설정으로 사용자를 제품 맥락에 맞게 안내합니다.", tags: ["welcome", "choice", "role"], termId: "welcome-choice-screen", preview: "app-example-onboarding" },
      { id: "consent-setup-template", eyebrow: "Templates / Onboarding", title: "Consent Setup", description: "초기 연결 권한과 데이터 접근 범위를 온보딩 중에 확인합니다.", tags: ["consent", "permissions", "setup"], termId: "consent-review-screen", preview: "app-example-auth" },
    ],
  }],
  [navFilter("plus-templates-onboarding-setup"), {
    breadcrumb: "Plus / Templates / Onboarding Screens / Setup Wizard",
    title: "Setup Wizard",
    description: "팀 생성, 데이터 가져오기, 첫 작업 만들기처럼 초기 성공까지 안내하는 템플릿입니다.",
    examples: [
      { id: "onboarding-flow-template", eyebrow: "Templates / Setup Wizard", title: "Onboarding flow page", description: "단계별 설정과 다음 행동을 한 화면에서 이어갑니다.", tags: ["flow", "setup", "continue"], termId: "onboarding-flow-page", preview: "app-example-onboarding" },
      { id: "onboarding-checklist-template", eyebrow: "Templates / Setup Wizard", title: "Setup checklist", description: "남은 설정 작업을 체크리스트로 보여줘 완료를 유도합니다.", tags: ["checklist", "tasks", "completion"], termId: "onboarding-checklist", preview: "progress-page" },
      { id: "progress-stepper-template", eyebrow: "Templates / Setup Wizard", title: "Progress stepper", description: "현재 단계와 남은 단계를 명확히 표시합니다.", tags: ["progress", "steps", "wizard"], termId: "progress-stepper", preview: "progress-page" },
    ],
  }],
  [navFilter("plus-templates-onboarding-welcome"), {
    breadcrumb: "Plus / Templates / Onboarding Screens / Welcome Flow",
    title: "Welcome Flow",
    description: "새 사용자에게 역할, 목적, 워크스페이스 선택지를 제시하는 첫 사용 템플릿입니다.",
    examples: [
      { id: "welcome-choice-page-template", eyebrow: "Templates / Welcome Flow", title: "Welcome choice", description: "새로 시작할지, 초대받은 워크스페이스로 들어갈지 선택하게 합니다.", tags: ["welcome", "choice", "workspace"], termId: "welcome-choice-screen", preview: "app-example-onboarding" },
      { id: "welcome-auth-method-template", eyebrow: "Templates / Welcome Flow", title: "Auth method choice", description: "첫 진입에서 이메일, SSO, 소셜 계정 선택을 제공합니다.", tags: ["auth", "method", "SSO"], termId: "auth-method-choice", preview: "auth-form-page" },
      { id: "welcome-pager-template", eyebrow: "Templates / Welcome Flow", title: "Onboarding pager", description: "짧은 소개 화면을 넘기며 제품의 핵심 가치를 전달합니다.", tags: ["pager", "intro", "first run"], termId: "onboarding-pager", preview: "app-example-onboarding" },
    ],
  }],
  [navFilter("plus-templates-onboarding-consent"), {
    breadcrumb: "Plus / Templates / Onboarding Screens / Consent Setup",
    title: "Consent Setup",
    description: "초기 데이터 연결과 권한 확인을 온보딩의 일부로 처리하는 템플릿입니다.",
    examples: [
      { id: "onboarding-consent-review-template", eyebrow: "Templates / Consent Setup", title: "Consent review", description: "권한 범위를 보여주고 동의 또는 취소 행동을 제공합니다.", tags: ["consent", "scope", "permissions"], termId: "consent-review-screen", preview: "app-example-auth" },
      { id: "onboarding-consent-flow-template", eyebrow: "Templates / Consent Setup", title: "Consent in setup flow", description: "권한 확인을 초기 설정 단계 안에 자연스럽게 배치합니다.", tags: ["setup", "consent", "flow"], termId: "onboarding-flow-page", preview: "app-example-onboarding" },
      { id: "onboarding-consent-progress-template", eyebrow: "Templates / Consent Setup", title: "Consent progress", description: "권한 연결이 전체 온보딩의 어느 단계인지 보여줍니다.", tags: ["progress", "step", "connection"], termId: "progress-stepper", preview: "progress-page" },
    ],
  }],
  [navFilter("plus-ui-kit"), {
    breadcrumb: "Plus / UI Kit",
    title: "UI Kit",
    description: "반복해서 쓰는 컴포넌트 vocabulary를 역할, 상태, 조합 기준으로 정리한 시스템 표면입니다.",
    examples: [
      { id: "ui-kit-controls-overview", eyebrow: "UI Kit / Overview", title: "Controls and states", description: "버튼, 선택, 토글처럼 사용자의 직접 행동을 받는 기본 부품과 상태를 정리합니다.", tags: ["controls", "states", "interaction"], termId: "button", preview: "element-button-page" },
      { id: "ui-kit-composition-overview", eyebrow: "UI Kit / Overview", title: "Forms, overlays, and data", description: "입력, 임시 작업, 데이터 표시를 반복 가능한 컴포넌트 계층으로 묶습니다.", tags: ["forms", "overlays", "data"], termId: "text-field", preview: "form-layout-page" },
      { id: "ui-kit-expression-overview", eyebrow: "UI Kit / Overview", title: "Visual treatment and motion", description: "표면, 강조, 전환, 등장 효과를 컴포넌트 시스템의 표현 계층으로 다룹니다.", tags: ["visual", "motion", "treatment"], termId: "glassmorphism", preview: "content-media" },
    ],
  }],
  [navFilter("plus-ui-kit-component-docs"), {
    breadcrumb: "Plus / UI Kit / Component Docs",
    title: "Component Docs",
    description: "Catalyst 공개 문서처럼 개별 컴포넌트의 역할, 상태, 조합 기준을 빠르게 찾아보는 UI Kit 문서 축입니다.",
    examples: [
      { id: "component-docs-controls", eyebrow: "UI Kit / Component Docs", title: "Button, checkbox, and switch", description: "직접 조작 컴포넌트는 default, hover, focus, disabled, selected 상태를 함께 문서화합니다.", tags: ["button", "selection", "states"], termId: "button", preview: "element-button-page" },
      { id: "component-docs-inputs", eyebrow: "UI Kit / Component Docs", title: "Input, combobox, and textarea", description: "입력 컴포넌트는 label, helper text, invalid state, option navigation을 같은 규칙으로 묶습니다.", tags: ["input", "combobox", "form"], termId: "text-field", preview: "form-layout-page" },
      { id: "component-docs-application", eyebrow: "UI Kit / Component Docs", title: "Table, sidebar, dialog, and navbar", description: "앱 구조 컴포넌트는 데이터 표시, 전역 이동, 임시 작업, 현재 위치를 함께 설명합니다.", tags: ["table", "sidebar", "dialog"], termId: "data-table-toolbar", preview: "data-table" },
    ],
  }],
  [navFilter("plus-ui-kit-controls"), {
    breadcrumb: "Plus / UI Kit / Controls",
    title: "Controls",
    description: "사용자가 클릭, 선택, 토글, 조절하는 직접 조작 컴포넌트입니다. 기본/hover/focus/disabled/selected 상태를 함께 봅니다.",
    examples: [
      { id: "controls-buttons", eyebrow: "UI Kit / Controls", title: "Buttons and icon buttons", description: "주요 행동, 보조 행동, 아이콘 단독 행동을 같은 상태 규칙으로 관리합니다.", tags: ["default", "hover", "disabled"], termId: "button", preview: "element-button-page" },
      { id: "controls-selection", eyebrow: "UI Kit / Controls", title: "Checkbox and radio choices", description: "복수 선택과 단일 선택을 구분하고 checked/focus/error 상태를 설계합니다.", tags: ["checked", "focus", "selection"], termId: "checkbox", preview: "checkbox-page" },
      { id: "controls-switches", eyebrow: "UI Kit / Controls", title: "Switches and segmented controls", description: "즉시 적용되는 설정과 모드 전환을 selected 상태가 보이게 배치합니다.", tags: ["toggle", "selected", "mode"], termId: "switch", preview: "toggle-page" },
    ],
  }],
  [navFilter("plus-ui-kit-forms"), {
    breadcrumb: "Plus / UI Kit / Forms",
    title: "Forms",
    description: "텍스트 입력, 선택 입력, 인증 폼, 검증 메시지를 포함한 입력 컴포넌트 시스템입니다.",
    examples: [
      { id: "forms-text-inputs", eyebrow: "UI Kit / Forms", title: "Text fields and textareas", description: "label, helper text, placeholder, invalid 상태를 일관되게 둡니다.", tags: ["label", "helper", "invalid"], termId: "text-field", preview: "form-layout-page" },
      { id: "forms-selectors", eyebrow: "UI Kit / Forms", title: "Select menus and comboboxes", description: "선택지가 많은 입력은 검색, active option, empty result 상태까지 포함합니다.", tags: ["options", "active", "empty"], termId: "combobox", preview: "combobox-page" },
      { id: "forms-auth-patterns", eyebrow: "UI Kit / Forms", title: "Auth and settings forms", description: "인증/설정 화면에서 입력 그룹, 저장 행동, 오류 회복을 같은 구조로 씁니다.", tags: ["auth", "settings", "recovery"], termId: "signup-form", preview: "form-auth" },
    ],
  }],
  [navFilter("plus-ui-kit-navigation"), {
    breadcrumb: "Plus / UI Kit / Navigation",
    title: "Navigation",
    description: "현재 위치, 이동 가능 영역, 탐색 깊이를 보여주는 내비게이션 컴포넌트 시스템입니다.",
    examples: [
      { id: "navigation-tabs", eyebrow: "UI Kit / Navigation", title: "Tabs and segmented navigation", description: "같은 화면 안의 보기 전환은 active tab과 focus 상태를 분명히 합니다.", tags: ["active", "focus", "views"], termId: "tabs", preview: "tabs-page" },
      { id: "navigation-breadcrumb-pagination", eyebrow: "UI Kit / Navigation", title: "Breadcrumbs and pagination", description: "계층 위치와 목록 이동을 작고 예측 가능한 패턴으로 제공합니다.", tags: ["location", "pages", "hierarchy"], termId: "breadcrumb", preview: "breadcrumb-page" },
      { id: "navigation-command-sidebar", eyebrow: "UI Kit / Navigation", title: "Command and sidebar navigation", description: "반복 작업과 앱 전체 이동에는 검색형 command와 persistent sidebar를 씁니다.", tags: ["command", "sidebar", "global"], termId: "command-palette", preview: "nav-command" },
    ],
  }],
  [navFilter("plus-ui-kit-overlays"), {
    breadcrumb: "Plus / UI Kit / Overlays",
    title: "Overlays",
    description: "현재 화면 위에 확인, 편집, 보조 정보를 띄우는 임시 표면 컴포넌트입니다.",
    examples: [
      { id: "overlays-dialogs", eyebrow: "UI Kit / Overlays", title: "Dialogs and modals", description: "중요한 확인과 짧은 편집은 focus trap, cancel, confirm 상태를 갖습니다.", tags: ["modal", "focus", "confirm"], termId: "dialog", preview: "modal-page" },
      { id: "overlays-popovers-tooltips", eyebrow: "UI Kit / Overlays", title: "Popovers and tooltips", description: "트리거 근처에 짧은 설명이나 작은 입력을 띄우며 위치와 닫힘 규칙을 관리합니다.", tags: ["floating", "trigger", "dismiss"], termId: "popover", preview: "popover-page" },
      { id: "overlays-drawers-sheets", eyebrow: "UI Kit / Overlays", title: "Drawers and sheets", description: "사이드/하단 패널로 목록 맥락을 유지한 채 세부 작업을 처리합니다.", tags: ["drawer", "sheet", "context"], termId: "drawer", preview: "drawer-page" },
    ],
  }],
  [navFilter("plus-ui-kit-data-display"), {
    breadcrumb: "Plus / UI Kit / Data Display",
    title: "Data Display",
    description: "표, 리스트, 지표, 설명 목록처럼 정보를 읽고 비교하게 하는 컴포넌트 시스템입니다.",
    examples: [
      { id: "data-display-tables", eyebrow: "UI Kit / Data Display", title: "Tables and toolbars", description: "검색, 필터, 정렬, 일괄 행동을 표 주변 상태로 설계합니다.", tags: ["table", "filter", "bulk"], termId: "data-table-toolbar", preview: "data-table" },
      { id: "data-display-stats", eyebrow: "UI Kit / Data Display", title: "Stats and metrics", description: "핵심 숫자는 라벨, 변화량, 기간 맥락과 함께 보여줍니다.", tags: ["metrics", "trend", "summary"], termId: "stat-list", preview: "data-metrics" },
      { id: "data-display-descriptions", eyebrow: "UI Kit / Data Display", title: "Descriptions and lists", description: "상세 정보는 label/value 쌍과 리스트 density를 유지해 읽기 쉽게 만듭니다.", tags: ["description", "list", "density"], termId: "description-list", preview: "description-list-page" },
    ],
  }],
  [navFilter("plus-ui-kit-layout"), {
    breadcrumb: "Plus / UI Kit / Layout",
    title: "Layout",
    description: "컨테이너, 패널, 구분선, 앱 쉘처럼 컴포넌트가 놓이는 공간 규칙입니다.",
    examples: [
      { id: "layout-containers", eyebrow: "UI Kit / Layout", title: "Containers and sections", description: "콘텐츠 폭, 내부 여백, 섹션 간 간격을 안정적으로 제한합니다.", tags: ["container", "section", "spacing"], termId: "container", preview: "layout-container-page" },
      { id: "layout-panels", eyebrow: "UI Kit / Layout", title: "Panels and app shells", description: "반복 작업 화면은 사이드바, 헤더, 본문, 보조 패널의 역할을 나눕니다.", tags: ["panel", "shell", "regions"], termId: "sidebar-nav", preview: "shell-sidebar-page" },
      { id: "layout-dividers", eyebrow: "UI Kit / Layout", title: "Dividers and grouping", description: "구분선과 그룹핑으로 밀도 높은 화면의 스캔 흐름을 유지합니다.", tags: ["divider", "grouping", "scan"], termId: "divider", preview: "layout-divider-page" },
    ],
  }],
  [navFilter("plus-ui-kit-feedback"), {
    breadcrumb: "Plus / UI Kit / Feedback",
    title: "Feedback",
    description: "사용자의 행동 결과, 진행 상태, 오류와 빈 상태를 설명하는 컴포넌트 시스템입니다.",
    examples: [
      { id: "feedback-alert-toast", eyebrow: "UI Kit / Feedback", title: "Alerts and toasts", description: "지속 안내와 짧은 완료 알림을 중요도와 지속 시간으로 구분합니다.", tags: ["alert", "toast", "severity"], termId: "alert", preview: "feedback-alert" },
      { id: "feedback-loading", eyebrow: "UI Kit / Feedback", title: "Loading and skeleton states", description: "대기 중에는 실제 레이아웃을 유지하며 진행/로딩 상태를 전달합니다.", tags: ["loading", "skeleton", "progress"], termId: "skeleton", preview: "skeleton-page" },
      { id: "feedback-empty-error", eyebrow: "UI Kit / Feedback", title: "Empty and recovery states", description: "결과가 없거나 실패했을 때 이유와 다음 행동을 함께 제공합니다.", tags: ["empty", "error", "recovery"], termId: "empty-state", preview: "empty-state-page" },
    ],
  }],
  [navFilter("plus-ui-kit-visual-treatments"), {
    breadcrumb: "Plus / UI Kit / Visual Treatments",
    title: "Visual Treatments",
    description: "표면, 깊이, 투명도, 장식 효과처럼 컴포넌트의 시각적 성격을 정하는 표현 vocabulary입니다.",
    examples: [
      { id: "visual-glassmorphism", eyebrow: "UI Kit / Visual Treatments", title: "Glassmorphism surfaces", description: "반투명 표면과 배경 흐림으로 깊이를 만들되 가독성과 대비를 먼저 확인합니다.", tags: ["glass", "blur", "contrast"], termId: "glassmorphism", preview: "content-media" },
      { id: "visual-gradient", eyebrow: "UI Kit / Visual Treatments", title: "Animated gradient background", description: "정적 표면보다 동적인 분위기가 필요한 히어로나 상태 화면에 제한적으로 씁니다.", tags: ["gradient", "background", "motion"], termId: "animated-gradient-background", preview: "hero-spotlight" },
      { id: "visual-shimmer", eyebrow: "UI Kit / Visual Treatments", title: "Shimmer and emphasis effects", description: "로딩, 강조, 프리미엄 느낌을 줄 때 움직임과 대비가 과하지 않게 조절합니다.", tags: ["shimmer", "loading", "emphasis"], termId: "shimmer-effect", preview: "skeleton-page" },
    ],
  }],
  [navFilter("plus-ui-kit-motion-patterns"), {
    breadcrumb: "Plus / UI Kit / Motion Patterns",
    title: "Motion Patterns",
    description: "전환, 등장, 반복 이동처럼 상태 변화를 이해하게 하는 움직임 vocabulary입니다.",
    examples: [
      { id: "motion-transition", eyebrow: "UI Kit / Motion Patterns", title: "Transitions and easing", description: "상태 변화는 duration과 easing을 일관되게 써서 갑작스러운 전환을 줄입니다.", tags: ["transition", "duration", "easing"], termId: "transition", preview: "progress-page" },
      { id: "motion-reveal", eyebrow: "UI Kit / Motion Patterns", title: "Blur fade reveal", description: "새 콘텐츠가 등장할 때 opacity, blur, position 변화를 작게 조합합니다.", tags: ["reveal", "fade", "blur"], termId: "blur-fade-in", preview: "content-media" },
      { id: "motion-marquee", eyebrow: "UI Kit / Motion Patterns", title: "Marquee rows", description: "후기, 로고, 카드가 많은 경우 자동 흐름을 쓰되 읽기와 motion preference를 고려합니다.", tags: ["marquee", "loop", "reduced motion"], termId: "marquee-row", preview: "testimonials-marquee" },
    ],
  }],
])

const plusCatalogSections: Array<{
  eyebrow: string
  title: string
  description: string
  items: Array<{ filter: TermFilter; label: string; description: string }>
}> = [
  {
    eyebrow: "Plus",
    title: "UI Blocks",
    description: "랜딩, 앱 화면, 커머스 화면을 조립하는 반복 가능한 화면 조각입니다.",
    items: [
      { filter: navFilter("plus-marketing"), label: "Marketing", description: "Hero, pricing, CTA, testimonials" },
      { filter: navFilter("plus-application-ui"), label: "Application UI", description: "Forms, navigation, overlays, data display" },
      { filter: navFilter("plus-ecommerce"), label: "Ecommerce", description: "Products, carts, checkout, orders" },
    ],
  },
  {
    eyebrow: "Plus",
    title: "Templates",
    description: "완성 페이지나 흐름의 출발점으로 쓸 수 있는 화면 단위입니다.",
    items: [
      { filter: navFilter("plus-templates-products"), label: "Template Products", description: "Catalyst, Oatmeal, Protocol 같은 공개 product gallery" },
      { filter: navFilter("plus-templates-marketing"), label: "Marketing Pages", description: "랜딩/가격/회사 소개 화면" },
      { filter: navFilter("plus-templates-dashboard"), label: "Dashboard Screens", description: "운영/관리 화면" },
      { filter: navFilter("plus-templates-auth"), label: "Auth Screens", description: "로그인/가입/인증 화면" },
      { filter: navFilter("plus-templates-ecommerce"), label: "Ecommerce Screens", description: "상품/결제/주문 화면" },
      { filter: navFilter("plus-templates-onboarding"), label: "Onboarding Screens", description: "초기 설정과 첫 사용 흐름" },
    ],
  },
  {
    eyebrow: "Plus",
    title: "UI Kit",
    description: "컴포넌트 시스템을 구성하는 재사용 가능한 기본 부품입니다.",
    items: [
      { filter: navFilter("plus-ui-kit"), label: "Overview", description: "컴포넌트 vocab, 상태, 사용 기준" },
      { filter: navFilter("plus-ui-kit-component-docs"), label: "Component Docs", description: "Button, input, table, sidebar docs analogs" },
      { filter: navFilter("plus-ui-kit-controls"), label: "Controls", description: "Button, checkbox, radio, switch" },
      { filter: navFilter("plus-ui-kit-forms"), label: "Forms", description: "Inputs, pickers, auth forms" },
      { filter: navFilter("plus-ui-kit-navigation"), label: "Navigation", description: "Tabs, breadcrumb, pagination" },
      { filter: navFilter("plus-ui-kit-overlays"), label: "Overlays", description: "Dialog, popover, drawer, tooltip" },
      { filter: navFilter("plus-ui-kit-data-display"), label: "Data Display", description: "Tables, metrics, lists, content" },
      { filter: navFilter("plus-ui-kit-layout"), label: "Layout", description: "Containers, panels, dividers" },
      { filter: navFilter("plus-ui-kit-feedback"), label: "Feedback", description: "Alerts, toasts, loading states" },
      { filter: navFilter("plus-ui-kit-visual-treatments"), label: "Visual Treatments", description: "Surface, depth, glass, decoration" },
      { filter: navFilter("plus-ui-kit-motion-patterns"), label: "Motion Patterns", description: "Transitions, reveal, marquee" },
    ],
  },
]

const docsLandingItems: Array<{ filter: TermFilter; label: string; description: string }> = [
  { filter: navFilter("docs-ui-blocks"), label: "UI Blocks", description: "블록을 프로젝트에 붙일 때 필요한 레이아웃, 반응형, 테마 기준" },
  { filter: navFilter("docs-component-api"), label: "Component API", description: "Button, input, dialog처럼 반복 컴포넌트의 상태와 사용 규칙" },
  { filter: navFilter("docs-layout"), label: "Layout", description: "공간, 크기, 반응형, 겹침과 스크롤" },
  { filter: navFilter("docs-styling"), label: "Styling", description: "표면, 색, 타이포그래피, 토큰과 효과" },
  { filter: navFilter("docs-interaction"), label: "Interaction", description: "상태, 로딩, 알림, 오류와 피드백" },
  { filter: navFilter("docs-accessibility"), label: "Accessibility", description: "ARIA, 스크린리더, 포커스와 모션 접근성" },
  { filter: navFilter("docs-motion-effects"), label: "Motion & Effects", description: "전환, 등장, 움직임과 시각 효과" },
]

type DocsSection = {
  id: string
  label: string
  filter: TermFilter
  icon: LucideIcon
  groups: TermGroupId[]
  eyebrow: string
  title: string
  description: string
  overview: string
  exampleTitle: string
  exampleDescription: string
  code: string
  anchors: string[]
}

type FilterNavItem = {
  filter: TermFilter
  label: string
}

type UiBlockNavSection = {
  id: string
  filter: TermFilter
  label: string
  icon?: LucideIcon
  groups: Array<{
    filter: TermFilter
    label: string
    items: FilterNavItem[]
  }>
}

type NavigationNavItem = {
  id: string
  filter: TermFilter
  label: string
  icon?: LucideIcon
}

const docsSections: DocsSection[] = [
  {
    id: "ui-blocks",
    label: "UI Blocks",
    filter: navFilter("docs-ui-blocks"),
    icon: BookOpen,
    groups: ["layout-spacing-sizing", "layout-responsive-viewport", "layout-stacking-overflow", "style-tokens"],
    eyebrow: "Documentation",
    title: "UI Blocks",
    description: "화면을 완성하는 섹션 단위 vocab을 프로젝트 맥락에 맞게 조립합니다.",
    overview: "블록 문서는 hero, pricing, table, sidebar처럼 바로 화면에 놓이는 덩어리를 기준으로 설명합니다. 각 항목은 구성 요소, 반응형 동작, 토큰 의존성, AI에게 줄 수 있는 지시어를 함께 봅니다.",
    exampleTitle: "Hero + feature block",
    exampleDescription: "블록은 layout, copy, responsive rule을 한 번에 포함합니다.",
    code: "<section className=\"mx-auto grid max-w-6xl gap-10 lg:grid-cols-2\">\n  <HeroCopy />\n  <FeaturePreview />\n</section>",
    anchors: ["Overview", "Block anatomy", "Responsive behavior", "Related terms"],
  },
  {
    id: "component-api",
    label: "Component API",
    filter: navFilter("docs-component-api"),
    icon: Clipboard,
    groups: ["input-text", "input-pickers", "selection-navigation", "feedback-alerts-toasts", "data-tables-lists"],
    eyebrow: "Reference",
    title: "Component API",
    description: "반복 컴포넌트의 states, props, accessibility contract를 한 페이지에서 확인합니다.",
    overview: "컴포넌트 문서는 Button, Input, Dialog처럼 작은 부품이 어떤 상태와 제약을 갖는지 정리합니다. 디자이너 없이 구현할 때 빠뜨리기 쉬운 hover, focus, disabled, error 상태를 기준으로 봅니다.",
    exampleTitle: "Button states",
    exampleDescription: "상태와 의도를 함께 문서화해야 재사용이 안정적입니다.",
    code: "<Button intent=\"primary\" state=\"loading\">\n  Save changes\n</Button>",
    anchors: ["Overview", "States", "Accessibility", "Related terms"],
  },
  {
    id: "layout",
    label: "Layout",
    filter: navFilter("docs-layout"),
    icon: Ruler,
    groups: ["layout-spacing-sizing", "layout-responsive-viewport", "layout-stacking-overflow", "layout-scroll-behavior"],
    eyebrow: "Core concepts",
    title: "Layout",
    description: "공간, 크기, 그리드, 스크롤을 화면 목적에 맞게 제한합니다.",
    overview: "레이아웃 문서는 컨테이너 폭, 스택 간격, 그리드 분기, overflow 처리를 먼저 봅니다. 좋은 UI는 개별 컴포넌트보다 전체 화면의 폭과 흐름이 먼저 안정됩니다.",
    exampleTitle: "Responsive shell",
    exampleDescription: "sidebar와 content column의 폭을 명시해 레이아웃 흔들림을 줄입니다.",
    code: "<main className=\"grid lg:grid-cols-[280px_minmax(0,1fr)]\">\n  <Sidebar />\n  <Content />\n</main>",
    anchors: ["Overview", "Spacing", "Responsive design", "Overflow"],
  },
  {
    id: "styling",
    label: "Styling",
    filter: navFilter("docs-styling"),
    icon: Palette,
    groups: ["style-surface-material", "style-border-color", "style-typography", "style-tokens", "style-decorative-effects"],
    eyebrow: "Core concepts",
    title: "Styling",
    description: "타이포그래피, 색, 표면, 토큰을 utility-first 사고로 조합합니다.",
    overview: "스타일링 문서는 단일 색감보다 계층, 대비, 텍스트 리듬, 상태별 표면을 함께 봅니다. Tailwind docs처럼 실제 UI 조각과 코드 표현을 나란히 두면 추상 토큰이 빠르게 이해됩니다.",
    exampleTitle: "Utility card",
    exampleDescription: "표면, radius, shadow, text color가 함께 시각적 위계를 만듭니다.",
    code: "<div className=\"rounded-xl border bg-white p-6 shadow-sm\">\n  <h3 className=\"text-lg font-semibold text-slate-950\" />\n</div>",
    anchors: ["Overview", "Typography", "Color", "Tokens"],
  },
  {
    id: "interaction",
    label: "Interaction",
    filter: navFilter("docs-interaction"),
    icon: BellDot,
    groups: ["feedback-interaction-states", "feedback-loading-progress", "feedback-alerts-toasts", "feedback-empty-error"],
    eyebrow: "Interaction",
    title: "Interaction",
    description: "상태 변화, 피드백, 오류 복구를 사용자가 예측할 수 있게 만듭니다.",
    overview: "인터랙션 문서는 사용자가 누른 뒤 무엇이 바뀌는지, 실패하면 어떻게 복구하는지, 진행 중에는 무엇을 보여주는지에 집중합니다. 시각 디자인과 상태 머신을 분리하지 않고 함께 점검합니다.",
    exampleTitle: "Async feedback",
    exampleDescription: "loading, success, error 상태는 같은 자리에서 이어져야 합니다.",
    code: "<SubmitButton state={isSaving ? \"loading\" : \"idle\"}>\n  Save\n</SubmitButton>",
    anchors: ["Overview", "States", "Loading", "Errors"],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    filter: navFilter("docs-accessibility"),
    icon: Focus,
    groups: ["accessibility-aria-screen-reader", "accessibility-focus-motion"],
    eyebrow: "Accessibility",
    title: "Accessibility",
    description: "키보드, 포커스, 스크린리더, 모션 제약을 구현 초기에 포함합니다.",
    overview: "접근성 문서는 나중에 붙이는 체크리스트가 아니라 컴포넌트 contract입니다. Focus ring, aria label, reduced motion, semantic heading을 화면 설계 단계에서 함께 봅니다.",
    exampleTitle: "Focusable control",
    exampleDescription: "명확한 label과 focus-visible ring은 기본 동작입니다.",
    code: "<button aria-label=\"Open navigation\" className=\"focus-visible:ring-2\">\n  <Menu />\n</button>",
    anchors: ["Overview", "Keyboard", "Screen reader", "Motion"],
  },
  {
    id: "motion-effects",
    label: "Motion & Effects",
    filter: navFilter("docs-motion-effects"),
    icon: MousePointerClick,
    groups: ["feedback-interaction-states", "feedback-loading-progress", "style-decorative-effects"],
    eyebrow: "Effects",
    title: "Motion & Effects",
    description: "전환, 등장, 강조 효과를 정보 구조를 해치지 않는 범위에서 사용합니다.",
    overview: "모션 문서는 장식보다 방향성과 피드백을 우선합니다. 변화가 어디에서 왔고 어디로 가는지 알려주되 텍스트와 조작 영역을 가리지 않아야 합니다.",
    exampleTitle: "State transition",
    exampleDescription: "짧은 duration과 명확한 transform만으로도 충분합니다.",
    code: "<div className=\"transition duration-150 ease-out hover:-translate-y-0.5\">\n  Preview\n</div>",
    anchors: ["Overview", "Transitions", "Feedback", "Reduced motion"],
  },
]

const docsLandingTabs = ["Using vocabulary", "Component API", "Layout rules", "Styling tokens", "AI prompts"]

const docsGettingStartedSteps = [
  {
    title: "Choose the screen context",
    description: "Start from the page type or user task, then pick the smallest UI vocabulary section that explains it.",
  },
  {
    title: "Read the anatomy with examples",
    description: "Pair the Korean explanation with a concrete visual term, state, and responsive rule before writing code.",
  },
  {
    title: "Give AI a precise prompt",
    description: "Use the term page's prompt guidance to ask for layout, state, accessibility, and token constraints together.",
  },
]

const docsLandingCode = "const section = docs.find(\"Layout\")\n\nbuildScreen({\n  terms: section.relatedTerms,\n  constraints: [\n    \"responsive\",\n    \"focus-visible\",\n    \"no-overlap\",\n  ],\n  output: \"usable UI first\",\n})"

const uiBlockSections: UiBlockNavSection[] = [
  {
    id: "marketing",
    filter: navFilter("plus-marketing"),
    label: "Marketing",
    icon: Shapes,
    groups: [
      {
        filter: navFilter("plus-marketing-page-sections"),
        label: "Page Sections",
        items: [
          { filter: navFilter("plus-marketing-hero-sections"), label: "Hero Sections" },
          { filter: navFilter("plus-marketing-feature-sections"), label: "Feature Sections" },
          { filter: navFilter("plus-marketing-cta-sections"), label: "CTA Sections" },
          { filter: navFilter("plus-marketing-bento-grids"), label: "Bento Grids" },
          { filter: navFilter("plus-marketing-pricing-sections"), label: "Pricing Sections" },
          { filter: navFilter("plus-marketing-header-sections"), label: "Header Sections" },
          { filter: navFilter("plus-marketing-newsletter-sections"), label: "Newsletter Sections" },
          { filter: navFilter("plus-marketing-stats"), label: "Stats" },
          { filter: navFilter("plus-marketing-testimonials"), label: "Testimonials" },
          { filter: navFilter("plus-marketing-blog-sections"), label: "Blog Sections" },
          { filter: navFilter("plus-marketing-contact-sections"), label: "Contact Sections" },
          { filter: navFilter("plus-marketing-team-sections"), label: "Team Sections" },
          { filter: navFilter("plus-marketing-content-sections"), label: "Content Sections" },
          { filter: navFilter("plus-marketing-logo-clouds"), label: "Logo Clouds" },
          { filter: navFilter("plus-marketing-faqs"), label: "FAQs" },
          { filter: navFilter("plus-marketing-footers"), label: "Footers" },
        ],
      },
      {
        filter: navFilter("plus-marketing-elements"),
        label: "Elements",
        items: [
          { filter: navFilter("plus-marketing-headers"), label: "Headers" },
          { filter: navFilter("plus-marketing-flyout-menus"), label: "Flyout Menus" },
          { filter: navFilter("plus-marketing-banners"), label: "Banners" },
        ],
      },
      {
        filter: navFilter("plus-marketing-feedback"),
        label: "Feedback",
        items: [
          { filter: navFilter("plus-marketing-404-pages"), label: "404 Pages" },
        ],
      },
      {
        filter: navFilter("plus-marketing-page-examples"),
        label: "Page Examples",
        items: [
          { filter: navFilter("plus-marketing-landing-pages"), label: "Landing Pages" },
          { filter: navFilter("plus-marketing-pricing-pages"), label: "Pricing Pages" },
          { filter: navFilter("plus-marketing-about-pages"), label: "About Pages" },
        ],
      },
    ],
  },
  {
    id: "application-ui",
    filter: navFilter("plus-application-ui"),
    label: "Application UI",
    icon: LayoutPanelTop,
    groups: [
      {
        filter: navFilter("plus-application-shells"),
        label: "Application Shells",
        items: [
          { filter: navFilter("plus-application-shells-stacked-layouts"), label: "Stacked Layouts" },
          { filter: navFilter("plus-application-shells-sidebar-layouts"), label: "Sidebar Layouts" },
          { filter: navFilter("plus-application-shells-multi-column-layouts"), label: "Multi-Column Layouts" },
        ],
      },
      {
        filter: navFilter("plus-application-headings"),
        label: "Headings",
        items: [
          { filter: navFilter("plus-application-headings-page-headings"), label: "Page Headings" },
          { filter: navFilter("plus-application-headings-card-headings"), label: "Card Headings" },
          { filter: navFilter("plus-application-headings-section-headings"), label: "Section Headings" },
        ],
      },
      {
        filter: navFilter("plus-data-display"),
        label: "Data Display",
        items: [
          { filter: navFilter("plus-data-display-description-lists"), label: "Description Lists" },
          { filter: navFilter("plus-data-display-stats"), label: "Stats" },
          { filter: navFilter("plus-data-display-calendars"), label: "Calendars" },
        ],
      },
      {
        filter: navFilter("plus-application-lists"),
        label: "Lists",
        items: [
          { filter: navFilter("plus-application-lists-stacked-lists"), label: "Stacked Lists" },
          { filter: navFilter("plus-application-lists-tables"), label: "Tables" },
          { filter: navFilter("plus-application-lists-grid-lists"), label: "Grid Lists" },
          { filter: navFilter("plus-application-lists-feeds"), label: "Feeds" },
        ],
      },
      {
        filter: navFilter("plus-forms"),
        label: "Forms",
        items: [
          { filter: navFilter("plus-forms-form-layouts"), label: "Form Layouts" },
          { filter: navFilter("plus-forms-input-groups"), label: "Input Groups" },
          { filter: navFilter("plus-forms-select-menus"), label: "Select Menus" },
          { filter: navFilter("plus-forms-sign-in-registration"), label: "Sign-in and Registration" },
          { filter: navFilter("plus-forms-textareas"), label: "Textareas" },
          { filter: navFilter("plus-forms-radio-groups"), label: "Radio Groups" },
          { filter: navFilter("plus-forms-checkboxes"), label: "Checkboxes" },
          { filter: navFilter("plus-forms-toggles"), label: "Toggles" },
          { filter: navFilter("plus-forms-action-panels"), label: "Action Panels" },
          { filter: navFilter("plus-forms-comboboxes"), label: "Comboboxes" },
        ],
      },
      {
        filter: navFilter("plus-feedback"),
        label: "Feedback",
        items: [
          { filter: navFilter("plus-feedback-alerts"), label: "Alerts" },
          { filter: navFilter("plus-feedback-empty-states"), label: "Empty States" },
        ],
      },
      {
        filter: navFilter("plus-navigation"),
        label: "Navigation",
        items: [
          { filter: navFilter("plus-navigation-navbars"), label: "Navbars" },
          { filter: navFilter("plus-navigation-pagination"), label: "Pagination" },
          { filter: navFilter("plus-navigation-tabs"), label: "Tabs" },
          { filter: navFilter("plus-navigation-vertical-navigation"), label: "Vertical Navigation" },
          { filter: navFilter("plus-navigation-sidebar-navigation"), label: "Sidebar Navigation" },
          { filter: navFilter("plus-navigation-breadcrumbs"), label: "Breadcrumbs" },
          { filter: navFilter("plus-navigation-progress-bars"), label: "Progress Bars" },
          { filter: navFilter("plus-navigation-command-palettes"), label: "Command Palettes" },
        ],
      },
      {
        filter: navFilter("plus-overlays"),
        label: "Overlays",
        items: [
          { filter: navFilter("plus-overlays-modal-dialogs"), label: "Modal Dialogs" },
          { filter: navFilter("plus-overlays-drawers"), label: "Drawers" },
          { filter: navFilter("plus-overlays-notifications"), label: "Notifications" },
        ],
      },
      {
        filter: navFilter("plus-application-elements"),
        label: "Elements",
        items: [
          { filter: navFilter("plus-application-elements-avatars"), label: "Avatars" },
          { filter: navFilter("plus-application-elements-badges"), label: "Badges" },
          { filter: navFilter("plus-application-elements-dropdowns"), label: "Dropdowns" },
          { filter: navFilter("plus-application-elements-buttons"), label: "Buttons" },
          { filter: navFilter("plus-application-elements-button-groups"), label: "Button Groups" },
        ],
      },
      {
        filter: navFilter("plus-application-layout"),
        label: "Layout",
        items: [
          { filter: navFilter("plus-application-layout-containers"), label: "Containers" },
          { filter: navFilter("plus-application-layout-cards"), label: "Cards" },
          { filter: navFilter("plus-application-layout-list-containers"), label: "List containers" },
          { filter: navFilter("plus-application-layout-media-objects"), label: "Media Objects" },
          { filter: navFilter("plus-application-layout-dividers"), label: "Dividers" },
        ],
      },
      {
        filter: navFilter("plus-application-page-examples"),
        label: "Page Examples",
        items: [
          { filter: navFilter("plus-application-page-examples-home-screens"), label: "Home Screens" },
          { filter: navFilter("plus-application-page-examples-detail-screens"), label: "Detail Screens" },
          { filter: navFilter("plus-application-page-examples-settings-screens"), label: "Settings Screens" },
        ],
      },
    ],
  },
  {
    id: "ecommerce",
    filter: navFilter("plus-ecommerce"),
    label: "Ecommerce",
    icon: ShoppingCart,
    groups: [
      {
        filter: navFilter("plus-ecommerce-components"),
        label: "Components",
        items: [
          { filter: navFilter("plus-ecommerce-product-overviews"), label: "Product Overviews" },
          { filter: navFilter("plus-ecommerce-product-lists"), label: "Product Lists" },
          { filter: navFilter("plus-ecommerce-category-previews"), label: "Category Previews" },
          { filter: navFilter("plus-ecommerce-shopping-carts"), label: "Shopping Carts" },
          { filter: navFilter("plus-ecommerce-category-filters"), label: "Category Filters" },
          { filter: navFilter("plus-ecommerce-product-quickviews"), label: "Product Quickviews" },
          { filter: navFilter("plus-ecommerce-product-features"), label: "Product Features" },
          { filter: navFilter("plus-ecommerce-store-navigation"), label: "Store Navigation" },
          { filter: navFilter("plus-ecommerce-promo-sections"), label: "Promo Sections" },
          { filter: navFilter("plus-ecommerce-checkout-forms"), label: "Checkout Forms" },
          { filter: navFilter("plus-ecommerce-reviews"), label: "Reviews" },
          { filter: navFilter("plus-ecommerce-order-summaries"), label: "Order Summaries" },
          { filter: navFilter("plus-ecommerce-order-history"), label: "Order History" },
          { filter: navFilter("plus-ecommerce-incentives"), label: "Incentives" },
        ],
      },
      {
        filter: navFilter("plus-ecommerce-page-examples"),
        label: "Page Examples",
        items: [
          { filter: navFilter("plus-ecommerce-page-examples-storefront-pages"), label: "Storefront Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-product-pages"), label: "Product Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-category-pages"), label: "Category Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-shopping-cart-pages"), label: "Shopping Cart Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-checkout-pages"), label: "Checkout Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-order-detail-pages"), label: "Order Detail Pages" },
          { filter: navFilter("plus-ecommerce-page-examples-order-history-pages"), label: "Order History Pages" },
        ],
      },
    ],
  },
]

const templateSections: Array<NavigationNavItem & { items: FilterNavItem[] }> = [
  {
    id: "template-products",
    filter: navFilter("plus-templates-products"),
    label: "Template Products",
    items: templateProductConfigs.map((product) => ({
      filter: navFilter(`plus-templates-${product.id}` as Parameters<typeof navFilter>[0]),
      label: product.title,
    })),
  },
  {
    id: "marketing-pages",
    filter: navFilter("plus-templates-marketing"),
    label: "Marketing Pages",
    items: [
      { filter: navFilter("plus-templates-marketing-startup-landing"), label: "Startup Landing" },
      { filter: navFilter("plus-templates-marketing-saas-pricing"), label: "SaaS Pricing" },
      { filter: navFilter("plus-templates-marketing-company-about"), label: "Company About" },
    ],
  },
  {
    id: "dashboard-screens",
    filter: navFilter("plus-templates-dashboard"),
    label: "Dashboard Screens",
    items: [
      { filter: navFilter("plus-templates-dashboard-analytics"), label: "Analytics Dashboard" },
      { filter: navFilter("plus-templates-dashboard-settings"), label: "Settings Console" },
      { filter: navFilter("plus-templates-dashboard-billing"), label: "Billing Portal" },
    ],
  },
  {
    id: "auth-screens",
    filter: navFilter("plus-templates-auth"),
    label: "Auth Screens",
    items: [
      { filter: navFilter("plus-templates-auth-sign-in"), label: "Sign-in Suite" },
      { filter: navFilter("plus-templates-auth-invite"), label: "Invite Flow" },
      { filter: navFilter("plus-templates-auth-consent"), label: "Consent Review" },
    ],
  },
  {
    id: "ecommerce-screens",
    filter: navFilter("plus-templates-ecommerce"),
    label: "Ecommerce Screens",
    items: [
      { filter: navFilter("plus-templates-ecommerce-storefront"), label: "Storefront Kit" },
      { filter: navFilter("plus-templates-ecommerce-checkout"), label: "Checkout Flow" },
      { filter: navFilter("plus-templates-ecommerce-orders"), label: "Order Account" },
    ],
  },
  {
    id: "onboarding-screens",
    filter: navFilter("plus-templates-onboarding"),
    label: "Onboarding Screens",
    items: [
      { filter: navFilter("plus-templates-onboarding-setup"), label: "Setup Wizard" },
      { filter: navFilter("plus-templates-onboarding-welcome"), label: "Welcome Flow" },
      { filter: navFilter("plus-templates-onboarding-consent"), label: "Consent Setup" },
    ],
  },
]

const uiKitSections: NavigationNavItem[] = [
  { id: "component-docs", filter: navFilter("plus-ui-kit-component-docs"), label: "Component Docs" },
  { id: "controls", filter: navFilter("plus-ui-kit-controls"), label: "Controls" },
  { id: "forms", filter: navFilter("plus-ui-kit-forms"), label: "Forms" },
  { id: "navigation", filter: navFilter("plus-ui-kit-navigation"), label: "Navigation" },
  { id: "overlays", filter: navFilter("plus-ui-kit-overlays"), label: "Overlays" },
  { id: "data-display", filter: navFilter("plus-ui-kit-data-display"), label: "Data Display" },
  { id: "layout", filter: navFilter("plus-ui-kit-layout"), label: "Layout" },
  { id: "feedback", filter: navFilter("plus-ui-kit-feedback"), label: "Feedback" },
  { id: "visual-treatments", filter: navFilter("plus-ui-kit-visual-treatments"), label: "Visual Treatments" },
  { id: "motion-patterns", filter: navFilter("plus-ui-kit-motion-patterns"), label: "Motion Patterns" },
]

export default App
