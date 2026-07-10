import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { loadRecipes, loadTerms, loadTokens, searchTerms, tokensForTier } from "../src/load.js"

const cliPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "index.js")

function runCli(args: string[]): { stdout: string; code: number } {
  try {
    return { stdout: execFileSync(process.execPath, [cliPath, ...args], { encoding: "utf8" }), code: 0 }
  } catch (error) {
    const failure = error as { status?: number; stdout?: string }
    return { stdout: failure.stdout ?? "", code: failure.status ?? -1 }
  }
}

describe("bundled data", () => {
  it("loads all terms with required query fields", () => {
    const terms = loadTerms()
    expect(terms.length).toBeGreaterThanOrEqual(536)
    for (const term of terms) {
      expect(term.id).toBeTruthy()
      expect(term.category).toBeTruthy()
      expect(term.group).toBeTruthy()
    }
  })

  it("loads recipes with body and source_path", () => {
    const recipes = loadRecipes()
    expect(recipes.length).toBeGreaterThanOrEqual(5)
    for (const recipe of recipes) {
      expect(recipe.body.length).toBeGreaterThan(100)
      expect(recipe.source_path).toMatch(/^recipes\//)
    }
  })
})

describe("searchTerms", () => {
  const terms = loadTerms()

  it("ranks exact id match first", () => {
    expect(searchTerms(terms, "hero")[0]?.id).toBe("hero")
  })

  it("matches korean names", () => {
    const results = searchTerms(terms, "히어로")
    expect(results.some((t) => t.id === "hero")).toBe(true)
  })

  it("returns empty for no match", () => {
    expect(searchTerms(terms, "zzzzqqq")).toHaveLength(0)
  })
})

describe("tokensForTier", () => {
  const tokens = loadTokens()

  it("returns semantic subtree", () => {
    const semantic = tokensForTier(tokens, "semantic") as Record<string, unknown>
    expect(semantic).toHaveProperty("surface")
  })

  it("returns null for unknown tier", () => {
    expect(tokensForTier(tokens, "bogus")).toBeNull()
  })
})

describe("cli exit codes", () => {
  it("succeeds on known term", () => {
    const { stdout, code } = runCli(["terms", "show", "hero"])
    expect(code).toBe(0)
    expect(stdout).toContain("Hero section")
  })

  it("fails with exit 1 on unknown term", () => {
    expect(runCli(["terms", "show", "nonexistent-term"]).code).toBe(1)
  })

  it("fails with exit 1 on unknown recipe", () => {
    expect(runCli(["recipes", "show", "nope"]).code).toBe(1)
  })

  it("emits valid json with --json", () => {
    const { stdout, code } = runCli(["recipes", "list", "--json"])
    expect(code).toBe(0)
    const parsed = JSON.parse(stdout)
    expect(parsed.length).toBeGreaterThanOrEqual(5)
  })
})
