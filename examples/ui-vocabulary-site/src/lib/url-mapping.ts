import { isNavigationFilter, normalizeNavigationFilter } from "@/lib/navigation-model"

/**
 * UE5 경로 스킴의 정본 — 상태(page/filter/query/termId) ↔ URL 경로 왕복.
 *
 *   /                      home
 *   /terms/:termId         용어 상세 (구 ?page=term&id=)
 *   /patterns[/:slug]      plus 축 — slug = 컬렉션 id 에서 "plus-" 를 뗀 것 (구 ?filter=nav:plus-*)
 *   /docs[/:slug]          docs 축 — slug = "docs-" 를 뗀 것
 *   /search?q=…[&filter=…] 검색 결과 (구 ?q=)
 *   /colors /recipes /pro /download
 *
 * 컬렉션이 아닌 필터(카테고리·kind:*)는 ?filter= 검색 파라미터로 유지한다.
 * 구 쿼리 URL(?page/id/q/filter)은 라우터 loader 가 legacyRedirectPath 로 새 경로에 리다이렉트한다.
 */

export type UrlPageMode = "home" | "docs" | "plus" | "term" | "download" | "pro" | "colors" | "recipes"

export type UrlState = {
  page: UrlPageMode
  filter: string
  query: string
  termId: string | null
}

const STATIC_PAGES = new Set(["colors", "recipes", "pro", "download"])

function collectionSlug(filter: string): string | null {
  if (!isNavigationFilter(filter)) {
    return null
  }
  const id = filter.slice("nav:".length)
  if (id === "plus-all" || id === "docs-all") {
    return ""
  }
  if (id.startsWith("plus-")) {
    return id.slice("plus-".length)
  }
  if (id.startsWith("docs-")) {
    return id.slice("docs-".length)
  }
  return null
}

/** 상태 → URL(pathname+search). extraParams 는 auth 리턴 등 보존해야 할 파라미터. */
export function urlFromState(state: UrlState, extraParams?: URLSearchParams): string {
  const params = new URLSearchParams()
  let pathname: string

  if (state.page === "term" && state.termId) {
    pathname = `/terms/${encodeURIComponent(state.termId)}`
  } else if (state.query.trim() && (state.page === "plus" || state.page === "docs")) {
    pathname = "/search"
    params.set("q", state.query.trim())
    if (state.filter && state.filter !== "all" && state.filter !== "nav:plus-all") {
      params.set("filter", state.filter)
    }
  } else if (state.page === "plus" || state.page === "docs") {
    const base = state.page === "plus" ? "/patterns" : "/docs"
    const slug = collectionSlug(state.filter)
    if (slug) {
      pathname = `${base}/${slug}`
    } else {
      pathname = base
      if (slug === null && state.filter && state.filter !== "all") {
        params.set("filter", state.filter)
      }
    }
  } else if (STATIC_PAGES.has(state.page)) {
    pathname = `/${state.page}`
  } else {
    pathname = "/"
  }

  if (extraParams) {
    for (const key of ["auth", "reason"]) {
      const value = extraParams.get(key)
      if (value !== null) {
        params.set(key, value)
      }
    }
  }

  const search = params.toString()
  return `${pathname}${search ? `?${search}` : ""}`
}

export type RawUrlState = {
  page: UrlPageMode
  /** 미검증 필터 문자열 — 호출측(App)의 parseFilterParam 으로 검증한다. null = 페이지 기본값 사용 */
  rawFilter: string | null
  query: string
  termId: string | null
}

/** URL(pathname+search) → 미검증 상태. 경로가 스킴 밖이면 null. */
export function stateFromUrl(pathname: string, searchParams: URLSearchParams): RawUrlState | null {
  const segments = pathname.split("/").filter(Boolean)
  const filterParam = searchParams.get("filter")

  if (segments.length === 0) {
    return { page: "home", rawFilter: null, query: "", termId: null }
  }

  const [head, rest] = [segments[0], segments.slice(1).join("/")]

  if (head === "terms" && rest) {
    return { page: "term", rawFilter: null, query: "", termId: decodeURIComponent(rest) }
  }
  if (head === "search") {
    const rawFilter = filterParam
    const page: UrlPageMode = rawFilter?.startsWith("nav:docs-") ? "docs" : "plus"
    return { page, rawFilter, query: searchParams.get("q") ?? "", termId: null }
  }
  if (head === "patterns" || head === "docs") {
    const axis = head === "patterns" ? "plus" : "docs"
    if (rest) {
      const candidate = normalizeNavigationFilter(`nav:${axis === "plus" ? "plus" : "docs"}-${rest}`)
      return { page: axis, rawFilter: candidate ?? filterParam, query: "", termId: null }
    }
    return { page: axis, rawFilter: filterParam, query: "", termId: null }
  }
  if (STATIC_PAGES.has(head) && !rest) {
    return { page: head as UrlPageMode, rawFilter: null, query: "", termId: null }
  }

  return null
}

/** 구 쿼리 URL(?page/id/q/filter)이면 새 경로를 돌려준다 — 아니면 null (리다이렉트 불요). */
export function legacyRedirectPath(url: URL): string | null {
  const params = url.searchParams
  if (url.pathname !== "/" || (!params.has("page") && !params.has("id") && !params.has("q") && !params.has("filter"))) {
    return null
  }

  const legacyPage = params.get("page")
  const legacyId = params.get("id")
  const legacyQuery = params.get("q") ?? ""
  const legacyFilter = params.get("filter") ?? ""

  let page: UrlPageMode
  if (legacyPage === "term" && legacyId) {
    page = "term"
  } else if (legacyPage === "docs" || legacyFilter.startsWith("nav:docs-")) {
    page = "docs"
  } else if (legacyPage && STATIC_PAGES.has(legacyPage)) {
    page = legacyPage as UrlPageMode
  } else if (legacyPage === "home" && !legacyQuery) {
    page = "home"
  } else {
    page = "plus"
  }

  return urlFromState(
    { page, filter: legacyFilter, query: legacyQuery, termId: legacyId },
    params
  )
}
