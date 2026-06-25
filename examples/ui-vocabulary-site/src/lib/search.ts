import type { TermCategory, VocabularyTerm } from "@/data/terms.generated"

export const categoryLabels: Record<TermCategory, string> = {
  input: "입력",
  selection: "선택·전환",
  action: "버튼·행동",
  structure: "화면 구조",
  feedback: "안내·상태",
  "data-display": "목록·정보",
}

export function searchTerms(
  terms: VocabularyTerm[],
  query: string,
  category: TermCategory | "all"
) {
  const normalizedQuery = normalize(query)

  return terms.filter((term) => {
    if (category !== "all" && term.category !== category) {
      return false
    }
    if (!normalizedQuery) {
      return true
    }

    return searchableText(term).includes(normalizedQuery)
  })
}

export function searchableText(term: VocabularyTerm) {
  return normalize(
    [
      term.id,
      term.category,
      term.ko.name,
      ...term.ko.aliases,
      term.en.name,
      ...term.en.aliases,
      term.one_liner,
      term.description,
      ...term.visual_anatomy,
      ...term.when_to_use,
      ...term.anti_use,
      ...term.prompt_phrases,
    ].join(" ")
  )
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}
