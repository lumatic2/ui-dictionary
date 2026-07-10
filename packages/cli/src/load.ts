import { readFileSync } from "node:fs"

export type Term = {
  id: string
  status?: string
  category: string
  group: string
  kind?: string
  ko?: { name?: string }
  en?: { name?: string }
  aliases?: string[]
  one_liner?: string
  description?: string
  visual_anatomy?: string[] | string
  when_to_use?: string[] | string
  anti_use?: string[] | string
  prompt_phrases?: string[]
  related?: unknown
}

export type Recipe = {
  id: string
  name?: string
  pattern_group?: string
  kind?: string
  status?: string
  tokens_used?: string[]
  code_asset?: string
  term_refs?: string[]
  source_path: string
  body: string
}

function loadJson<T>(relative: string): T {
  const url = new URL(`../data/${relative}`, import.meta.url)
  return JSON.parse(readFileSync(url, "utf8")) as T
}

export function loadTerms(): Term[] {
  return loadJson<Term[]>("terms.json")
}

export function loadTokens(): Record<string, unknown> {
  return loadJson<Record<string, unknown>>("tokens.json")
}

export function loadTokensCss(): string {
  return readFileSync(new URL("../data/tokens.css", import.meta.url), "utf8")
}

export function loadRecipes(): Recipe[] {
  return loadJson<Recipe[]>("recipes.json")
}

/** Case-insensitive substring search over id, names, aliases, one-liner, prompt phrases. */
export function searchTerms(terms: Term[], query: string): Term[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  const scored: Array<{ term: Term; score: number }> = []
  for (const term of terms) {
    const id = term.id.toLowerCase()
    const en = term.en?.name?.toLowerCase() ?? ""
    const ko = term.ko?.name ?? ""
    const aliases = (term.aliases ?? []).map((a) => String(a).toLowerCase())
    const oneLiner = term.one_liner?.toLowerCase() ?? ""
    const phrases = (term.prompt_phrases ?? []).map((p) => String(p).toLowerCase())

    let score = 0
    if (id === needle || en === needle || ko === query.trim()) score = 100
    else if (id.includes(needle) || en.includes(needle) || ko.includes(query.trim())) score = 60
    else if (aliases.some((a) => a.includes(needle))) score = 50
    else if (oneLiner.includes(needle) || phrases.some((p) => p.includes(needle))) score = 20
    if (score > 0) scored.push({ term, score })
  }
  return scored.sort((a, b) => b.score - a.score || a.term.id.localeCompare(b.term.id)).map((s) => s.term)
}

/** Returns the color subtree for a tier, or null when the tier does not exist. */
export function tokensForTier(tokens: Record<string, unknown>, tier: string): unknown | null {
  const color = tokens.color as Record<string, unknown> | undefined
  if (!color || !(tier in color)) return null
  return color[tier]
}
