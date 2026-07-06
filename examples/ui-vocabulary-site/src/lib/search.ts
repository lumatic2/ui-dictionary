import type { TermCategory, TermGroup, TermGroupId, TermKind, VocabularyTerm } from "@/data/terms.generated"
import { groups as generatedGroups } from "@/data/terms.generated"
import { getNavigationCollection, isNavigationFilter, type NavigationFilter } from "@/lib/navigation-model"

export type { TermGroupId } from "@/data/terms.generated"

export type TermKindFilter = `kind:${TermKind}`
export type TermKindCategoryFilter = `kind:${TermKind}:category:${TermCategory}`
export type TermKindGroupFilter = `kind:${TermKind}:group:${TermGroupId}`
export type TermFilter = "all" | TermCategory | TermGroupId | TermKindFilter | TermKindCategoryFilter | TermKindGroupFilter | NavigationFilter
export type SearchMatchReason =
  | "name"
  | "alias"
  | "category"
  | "kind"
  | "group"
  | "one_liner"
  | "description"
  | "visual_anatomy"
  | "when_to_use"
  | "prompt_phrase"

export type SearchResult = {
  term: VocabularyTerm
  score: number
  reasons: SearchMatchReason[]
  matchedText: string[]
}

export const categoryLabels: Record<TermCategory, string> = {
  input: "입력",
  selection: "선택·탐색",
  action: "행동",
  structure: "구조",
  feedback: "상태·피드백",
  "data-display": "데이터·콘텐츠",
  style: "스타일·재질",
  "layout-rendering": "레이아웃·렌더링",
  accessibility: "접근성",
}

export const searchMatchReasonLabels: Record<SearchMatchReason, string> = {
  name: "이름 일치",
  alias: "별칭 일치",
  category: "주제 일치",
  kind: "단위 일치",
  group: "세부 분류 일치",
  one_liner: "한 줄 설명",
  description: "설명 일치",
  visual_anatomy: "생김새 단서",
  when_to_use: "사용 상황",
  prompt_phrase: "AI 요청 문장",
}

export const kindLabels: Record<TermKind, string> = {
  component: "컴포넌트",
  block: "화면 블록",
  "form-pattern": "폼 패턴",
  "visual-effect": "시각 효과",
  "motion-pattern": "모션 패턴",
  "visual-treatment": "시각 처리",
}

export const categoryGroups: TermGroup[] = generatedGroups

export const categoryGroupsByCategory = categoriesToGroups()

const discoveryQueryBoosts = [
  { query: "토글", matches: [{ id: "switch", weight: 100 }, { id: "toggle-button", weight: 80 }, { id: "toggle-group", weight: 40 }] },
  { query: "켜고 끄는", matches: [{ id: "switch", weight: 80 }, { id: "toggle-button", weight: 70 }] },
  { query: "옆에서 나오는 창", matches: [{ id: "drawer", weight: 80 }, { id: "side-sheet", weight: 70 }, { id: "navigation-drawer", weight: 60 }] },
  { query: "위에 뜨는 창", matches: [{ id: "dialog", weight: 80 }, { id: "popover", weight: 70 }, { id: "tooltip", weight: 60 }] },
  { query: "표 필터", matches: [{ id: "filter-bar", weight: 80 }, { id: "filter-panel", weight: 70 }, { id: "faceted-filter", weight: 60 }, { id: "data-table-toolbar", weight: 50 }] },
  { query: "빈 화면", matches: [{ id: "empty-state", weight: 80 }, { id: "empty-search-result", weight: 70 }, { id: "empty-table", weight: 60 }] },
  { query: "카드 넘기기", matches: [{ id: "carousel", weight: 80 }, { id: "image-gallery", weight: 70 }] },
  { query: "결제 카드", matches: [{ id: "payment-method-card", weight: 80 }, { id: "price-card", weight: 70 }, { id: "plan-card", weight: 60 }] },
  { query: "진행 상태", matches: [{ id: "progress-bar", weight: 80 }, { id: "stepper", weight: 70 }, { id: "setup-progress", weight: 60 }] },
  { query: "명령어", matches: [{ id: "command-palette", weight: 80 }, { id: "search-view", weight: 70 }] },
  { query: "여러 개 중 하나", matches: [{ id: "radio-group", weight: 80 }, { id: "select", weight: 70 }, { id: "segmented-control", weight: 60 }] },
  { query: "목록에서 고르기", matches: [{ id: "select", weight: 80 }, { id: "combobox", weight: 70 }, { id: "dropdown-menu", weight: 60 }] },
  { query: "잠깐 뜨는 안내", matches: [{ id: "toast", weight: 80 }, { id: "snackbar", weight: 70 }, { id: "announcement-banner", weight: 60 }] },
  { query: "지도 아래 패널", matches: [{ id: "map-bottom-panel", weight: 100 }, { id: "mobile-bottom-sheet", weight: 60 }] },
  { query: "스토리 넘기는 화면", matches: [{ id: "story-viewer", weight: 100 }, { id: "story-rail", weight: 70 }, { id: "carousel", weight: 40 }] },
  { query: "상품 옵션 아래에서 선택", matches: [{ id: "product-option-sheet", weight: 100 }, { id: "standard-bottom-sheet", weight: 60 }, { id: "quantity-stepper", weight: 30 }] },
  { query: "고정된 하단 결제 버튼", matches: [{ id: "bottom-cta-bar", weight: 100 }, { id: "cart-summary-bar", weight: 70 }, { id: "sticky-footer-bar", weight: 40 }] },
]

export function searchTerms(
  terms: VocabularyTerm[],
  query: string,
  filter: TermFilter
) {
  const normalizedQuery = normalize(query)

  return terms.flatMap((term, index) => {
    if (!matchesFilter(term, filter)) {
      return []
    }
    if (!normalizedQuery) {
      return [{ term, score: 0, reasons: [], matchedText: [], sourceIndex: index }]
    }

    const result = scoreTerm(term, normalizedQuery)
    if (result.score === 0) {
      return []
    }

    return [{ ...result, sourceIndex: index }]
  }).sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

    return left.sourceIndex - right.sourceIndex
  }).map(({ sourceIndex: _sourceIndex, ...result }) => result)
}

export function searchableText(term: VocabularyTerm) {
  return normalize(
    [
      term.id,
      term.category,
      term.kind,
      term.ko.name,
      ...term.ko.aliases,
      term.en.name,
      ...term.en.aliases,
      term.one_liner,
      term.description,
      ...(term.navigation?.canonical_path ?? []),
      ...(term.navigation?.also_appears_in ?? []).flat(),
      ...term.visual_anatomy,
      ...term.when_to_use,
      ...term.anti_use,
      ...term.prompt_phrases,
    ].join(" ")
  )
}

export function matchesFilter(term: VocabularyTerm, filter: TermFilter) {
  if (filter === "all") {
    return true
  }
  if (isNavigationFilter(filter)) {
    return matchesNavigationFilter(term, filter)
  }
  if (isTermKindCategoryFilter(filter)) {
    const { kind, category } = getTermKindCategoryFromFilter(filter)
    return term.kind === kind && term.category === category
  }
  if (isTermKindGroupFilter(filter)) {
    const { kind, groupId } = getTermKindGroupFromFilter(filter)
    return term.kind === kind && getTermGroup(term)?.id === groupId
  }
  if (isTermCategory(filter)) {
    return term.category === filter
  }
  if (isTermKindFilter(filter)) {
    return term.kind === getTermKindFromFilter(filter)
  }

  return getTermGroup(term)?.id === filter
}

function matchesNavigationFilter(term: VocabularyTerm, filter: NavigationFilter) {
  const collection = getNavigationCollection(filter)
  if (!collection) {
    return false
  }

  if (term.navigation?.canonical_path && pathStartsWith(term.navigation.canonical_path, collection.path)) {
    return true
  }
  if (term.navigation) {
    return false
  }

  const groupId = getTermGroup(term)?.id

  return Boolean(
    collection.termIds?.includes(term.id)
    || collection.categories?.includes(term.category)
    || collection.kinds?.includes(term.kind)
    || (groupId && collection.groupIds?.includes(groupId))
  )
}

function pathStartsWith(path: string[], prefix: string[]) {
  return prefix.every((segment, index) => path[index] === segment)
}

export function getTermGroup(term: VocabularyTerm) {
  return categoryGroups.find((group) => group.id === term.group)
}

export function isTermCategory(filter: TermFilter): filter is TermCategory {
  return filter in categoryLabels
}

export function isTermKindFilter(filter: TermFilter | string): filter is TermKindFilter {
  if (!filter.startsWith("kind:") || filter.includes(":category:") || filter.includes(":group:")) {
    return false
  }

  return filter.slice("kind:".length) in kindLabels
}

export function getTermKindFromFilter(filter: TermKindFilter): TermKind {
  return filter.slice("kind:".length) as TermKind
}

export function isTermKindCategoryFilter(filter: TermFilter | string): filter is TermKindCategoryFilter {
  const match = filter.match(/^kind:([^:]+):category:([^:]+)$/)
  if (!match) {
    return false
  }

  return match[1] in kindLabels && match[2] in categoryLabels
}

export function getTermKindCategoryFromFilter(filter: TermKindCategoryFilter) {
  const [, kind, category] = filter.match(/^kind:([^:]+):category:([^:]+)$/) ?? []

  return {
    kind: kind as TermKind,
    category: category as TermCategory,
  }
}

export function isTermKindGroupFilter(filter: TermFilter | string): filter is TermKindGroupFilter {
  const match = filter.match(/^kind:([^:]+):group:([^:]+)$/)
  if (!match) {
    return false
  }

  return match[1] in kindLabels && categoryGroups.some((group) => group.id === match[2])
}

export function getTermKindGroupFromFilter(filter: TermKindGroupFilter) {
  const [, kind, groupId] = filter.match(/^kind:([^:]+):group:([^:]+)$/) ?? []

  return {
    kind: kind as TermKind,
    groupId: groupId as TermGroupId,
  }
}

function categoriesToGroups() {
  return Object.fromEntries(
    Object.keys(categoryLabels).map((category) => [
      category,
      categoryGroups.filter((group) => group.category === category),
    ])
  ) as Record<TermCategory, TermGroup[]>
}

function scoreTerm(term: VocabularyTerm, query: string): SearchResult {
  const reasons = new Set<SearchMatchReason>()
  const matchedText = new Set<string>()
  let score = 0

  for (const field of getSearchFields(term)) {
    const fieldScore = scoreField(field.text, query, field.exactWeight, field.prefixWeight, field.includesWeight)
    if (fieldScore === 0) {
      continue
    }

    score += fieldScore
    reasons.add(field.reason)
    matchedText.add(field.text)
  }

  for (const boost of discoveryQueryBoosts) {
    const match = boost.matches.find((item) => item.id === term.id)
    if (!normalize(boost.query).includes(query) || !match) {
      continue
    }

    score += match.weight
    reasons.add("prompt_phrase")
    matchedText.add(boost.query)
  }

  return {
    term,
    score,
    reasons: Array.from(reasons),
    matchedText: Array.from(matchedText).slice(0, 3),
  }
}

function getSearchFields(term: VocabularyTerm) {
  const group = getTermGroup(term)

  return [
    ...[term.ko.name, term.en.name, term.id].map((text) => ({
      text,
      reason: "name" as const,
      exactWeight: 120,
      prefixWeight: 80,
      includesWeight: 65,
    })),
    ...[...term.ko.aliases, ...term.en.aliases].map((text) => ({
      text,
      reason: "alias" as const,
      exactWeight: 100,
      prefixWeight: 80,
      includesWeight: 60,
    })),
    {
      text: categoryLabels[term.category],
      reason: "category" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    },
    {
      text: kindLabels[term.kind],
      reason: "kind" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    },
    ...(group ? [{
      text: group.label,
      reason: "group" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    }] : []),
    {
      text: term.one_liner,
      reason: "one_liner" as const,
      exactWeight: 45,
      prefixWeight: 40,
      includesWeight: 35,
    },
    ...term.prompt_phrases.map((text) => ({
      text,
      reason: "prompt_phrase" as const,
      exactWeight: 40,
      prefixWeight: 35,
      includesWeight: 30,
    })),
    ...term.when_to_use.map((text) => ({
      text,
      reason: "when_to_use" as const,
      exactWeight: 35,
      prefixWeight: 30,
      includesWeight: 25,
    })),
    ...term.visual_anatomy.map((text) => ({
      text,
      reason: "visual_anatomy" as const,
      exactWeight: 30,
      prefixWeight: 25,
      includesWeight: 20,
    })),
    {
      text: term.description,
      reason: "description" as const,
      exactWeight: 20,
      prefixWeight: 18,
      includesWeight: 15,
    },
    ...term.anti_use.map((text) => ({
      text,
      reason: "description" as const,
      exactWeight: 10,
      prefixWeight: 8,
      includesWeight: 5,
    })),
  ]
}

function scoreField(
  field: string,
  query: string,
  exactWeight: number,
  prefixWeight: number,
  includesWeight: number
) {
  const normalizedField = normalize(field)

  if (!normalizedField) {
    return 0
  }
  if (normalizedField === query) {
    return exactWeight
  }
  if (normalizedField.startsWith(query)) {
    return prefixWeight
  }
  if (normalizedField.includes(query)) {
    return includesWeight
  }

  return 0
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}
