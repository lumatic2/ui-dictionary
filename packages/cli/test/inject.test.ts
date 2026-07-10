import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { addRecipe, extractCodeSnippet, extractSectionNotes, initProject, InjectError } from "../src/inject.js"
import { loadRecipes } from "../src/load.js"

const dirs: string[] = []
function tempDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "askewly-cli-"))
  dirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe("initProject", () => {
  it("writes DESIGN.md, tokens.css, askewly.css", () => {
    const dir = tempDir()
    const written = initProject(dir, false)
    expect(written).toHaveLength(3)
    expect(existsSync(path.join(dir, "askewly.css"))).toBe(true)
    expect(readFileSync(path.join(dir, "askewly.css"), "utf8")).toContain("@theme inline")
  })

  it("refuses to overwrite without force", () => {
    const dir = tempDir()
    initProject(dir, false)
    expect(() => initProject(dir, false)).toThrow(InjectError)
    expect(() => initProject(dir, true)).not.toThrow()
  })
})

describe("extractCodeSnippet / extractSectionNotes", () => {
  const recipes = loadRecipes()

  it("extracts a code block from every bundled recipe", () => {
    for (const recipe of recipes) {
      expect(extractCodeSnippet(recipe).length, recipe.id).toBeGreaterThan(50)
    }
  })

  it("extracts Checks notes from the button recipe", () => {
    const button = recipes.find((r) => r.id === "button")!
    expect(extractSectionNotes(button, "Checks").length).toBeGreaterThan(0)
  })
})

describe("addRecipe", () => {
  const recipes = loadRecipes()
  const button = recipes.find((r) => r.id === "button")!

  it("writes <id>.tsx and reports missing tokens when tokens.css is absent", () => {
    const dir = tempDir()
    const result = addRecipe(button, dir, false, path.join(dir, "tokens.css"))
    expect(existsSync(result.file)).toBe(true)
    expect(result.missingTokens.length).toBeGreaterThan(0)
  })

  it("reports no missing tokens after init", () => {
    const dir = tempDir()
    initProject(dir, false)
    const result = addRecipe(button, path.join(dir, "components"), false, path.join(dir, "tokens.css"))
    expect(result.missingTokens).toHaveLength(0)
  })

  it("refuses to overwrite without force", () => {
    const dir = tempDir()
    addRecipe(button, dir, false)
    expect(() => addRecipe(button, dir, false)).toThrow(InjectError)
  })
})
