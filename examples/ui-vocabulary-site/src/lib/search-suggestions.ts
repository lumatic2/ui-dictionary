import type { TermCategory, VocabularyTerm } from "@/data/terms.generated"
import { categoryGroups, categoryLabels, matchesFilter, type TermFilter } from "@/lib/search"

export type SearchSuggestion =
  | {
      id: string
      type: "term"
      label: string
      description: string
      value: string
      termId: string
    }
  | {
      id: string
      type: "category" | "group"
      label: string
      description: string
      value: string
      filter: TermFilter
    }
  | {
      id: string
      type: "starter"
      label: string
      description: string
      value: string
      relatedTermIds: string[]
    }

type StarterQuery = {
  query: string
  description: string
  relatedTermIds: string[]
}

const starterQueries: StarterQuery[] = [
  { query: "켜고 끄는", description: "switch, toggle button 찾기", relatedTermIds: ["switch", "toggle-button"] },
  { query: "옆에서 나오는 창", description: "drawer, side sheet 찾기", relatedTermIds: ["drawer", "side-sheet", "navigation-drawer"] },
  { query: "표 필터", description: "table filter 패턴 찾기", relatedTermIds: ["filter-bar", "filter-panel", "faceted-filter"] },
  { query: "빈 화면", description: "empty state 패턴 찾기", relatedTermIds: ["empty-state", "empty-search-result", "empty-table"] },
  { query: "카드 넘기기", description: "carousel, gallery 찾기", relatedTermIds: ["carousel", "image-gallery"] },
  { query: "진행 상태", description: "progress, stepper 찾기", relatedTermIds: ["progress-bar", "stepper", "setup-progress"] },
]

export function getSearchSuggestions(
  terms: VocabularyTerm[],
  query: string,
  filter: TermFilter,
  limit = 8
): SearchSuggestion[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return [
      ...starterQueries.map(starterToSuggestion),
      ...Object.entries(categoryLabels).map(([category, label]) => ({
        id: `category-${category}`,
        type: "category" as const,
        label,
        description: "대분류 보기",
        value: label,
        filter: category as TermCategory,
      })),
    ].slice(0, limit)
  }

  const suggestions: SearchSuggestion[] = []
  const seen = new Set<string>()

  for (const term of terms) {
    if (!matchesFilter(term, filter)) {
      continue
    }

    const match = getTermSuggestionMatch(term, normalizedQuery)
    if (!match) {
      continue
    }

    const suggestion = termToSuggestion(term, match)
    suggestions.push(suggestion)
    seen.add(term.id)
  }

  for (const starter of starterQueries) {
    if (!normalize(starter.query).includes(normalizedQuery)) {
      continue
    }

    suggestions.push(starterToSuggestion(starter))
    for (const termId of starter.relatedTermIds) {
      if (seen.has(termId)) {
        continue
      }
      const term = terms.find((item) => item.id === termId)
      if (!term || !matchesFilter(term, filter)) {
        continue
      }
      const suggestion = termToSuggestion(term, starter.query)
      suggestions.push(suggestion)
      seen.add(termId)
    }
  }

  for (const suggestion of getFilterSuggestions(normalizedQuery)) {
    suggestions.push(suggestion)
  }

  return suggestions.slice(0, limit)
}

export function getStarterQueries() {
  return starterQueries.map(starterToSuggestion)
}

function termToSuggestion(term: VocabularyTerm, matchedText: string): SearchSuggestion {
  return {
    id: `term-${term.id}`,
    type: "term",
    label: term.ko.name,
    description: `${term.en.name} · ${matchedText}`,
    value: term.ko.name,
    termId: term.id,
  }
}

function starterToSuggestion(starter: StarterQuery): SearchSuggestion {
  return {
    id: `starter-${starter.query}`,
    type: "starter",
    label: starter.query,
    description: starter.description,
    value: starter.query,
    relatedTermIds: starter.relatedTermIds,
  }
}

function getFilterSuggestions(query: string): SearchSuggestion[] {
  const categories = Object.entries(categoryLabels)
    .filter(([category, label]) => normalize(`${category} ${label}`).includes(query))
    .map(([category, label]) => ({
      id: `category-${category}`,
      type: "category" as const,
      label,
      description: "대분류 보기",
      value: label,
      filter: category as TermCategory,
    }))

  const groups = categoryGroups
    .filter((group) => normalize(`${group.id} ${group.label} ${categoryLabels[group.category]}`).includes(query))
    .map((group) => ({
      id: `group-${group.id}`,
      type: "group" as const,
      label: group.label,
      description: `${categoryLabels[group.category]} 세부 분류`,
      value: group.label,
      filter: group.id,
    }))

  return [...categories, ...groups]
}

function getTermSuggestionMatch(term: VocabularyTerm, query: string) {
  const fields = [
    term.ko.name,
    term.en.name,
    term.id,
    ...term.ko.aliases,
    ...term.en.aliases,
    term.one_liner,
    ...term.prompt_phrases,
    ...term.visual_anatomy,
  ]

  return fields.find((field) => normalize(field).includes(query))
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}
