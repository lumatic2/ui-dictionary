import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import type { Recipe } from "./load.js"

export class InjectError extends Error {}

function readBundled(relative: string): string {
  return readFileSync(new URL(`../data/${relative}`, import.meta.url), "utf8")
}

/**
 * Writes DESIGN.md and tokens.css into targetDir.
 * Refuses to overwrite existing files unless force is set.
 */
export function initProject(targetDir: string, force: boolean): string[] {
  const files: Array<[string, string]> = [
    ["DESIGN.md", readBundled("DESIGN.md")],
    ["tokens.css", readBundled("tokens.css")],
    ["askewly.css", readBundled("askewly.css")],
  ]
  const conflicts = files
    .map(([name]) => path.join(targetDir, name))
    .filter((file) => existsSync(file))
  if (conflicts.length > 0 && !force) {
    throw new InjectError(`refusing to overwrite: ${conflicts.join(", ")} (use --force to overwrite)`)
  }
  mkdirSync(targetDir, { recursive: true })
  const written: string[] = []
  for (const [name, content] of files) {
    const file = path.join(targetDir, name)
    writeFileSync(file, content)
    written.push(file)
  }
  return written
}

/** Extracts the first fenced code block under the recipe's `## Code` section. */
export function extractCodeSnippet(recipe: Recipe): string {
  const codeSection = recipe.body.split(/^## Code\s*$/m)[1]
  if (!codeSection) {
    throw new InjectError(`recipe "${recipe.id}" has no ## Code section`)
  }
  const fence = codeSection.match(/```[a-z]*\n([\s\S]*?)```/)
  if (!fence) {
    throw new InjectError(`recipe "${recipe.id}" has no fenced code block under ## Code`)
  }
  return fence[1].trimEnd() + "\n"
}

/** Extracts list items of a `## <title>` section (used for Checks / Anti-patterns notes). */
export function extractSectionNotes(recipe: Recipe, title: string): string[] {
  const section = recipe.body.split(new RegExp(`^## ${title}\\s*$`, "m"))[1]
  if (!section) return []
  const untilNext = section.split(/^## /m)[0]
  return untilNext
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.trim().slice(2))
}

export type AddResult = {
  file: string
  missingTokens: string[]
  checks: string[]
  antiPatterns: string[]
}

/**
 * Writes the recipe's Code excerpt to <outDir>/<id>.tsx and reports which
 * tokens_used entries are not covered by an existing tokens.css in outDir's
 * project root (heuristic: tokens.css next to outDir or in cwd).
 */
export function addRecipe(recipe: Recipe, outDir: string, force: boolean, tokensCssPath?: string): AddResult {
  const snippet = extractCodeSnippet(recipe)
  const file = path.join(outDir, `${recipe.id}.tsx`)
  if (existsSync(file) && !force) {
    throw new InjectError(`refusing to overwrite: ${file} (use --force to overwrite)`)
  }
  mkdirSync(outDir, { recursive: true })
  writeFileSync(file, snippet)

  let missingTokens: string[] = []
  const tokensUsed = recipe.tokens_used ?? []
  if (tokensUsed.length > 0) {
    if (tokensCssPath && existsSync(tokensCssPath)) {
      const css = readFileSync(tokensCssPath, "utf8")
      const bundledCss = readBundled("tokens.css")
      // The generated css does not embed DTCG paths; equality with the bundled
      // generation is the practical "tokens are present and current" check.
      if (css !== bundledCss) missingTokens = [...tokensUsed]
    } else {
      missingTokens = [...tokensUsed]
    }
  }

  return {
    file,
    missingTokens,
    checks: extractSectionNotes(recipe, "Checks"),
    antiPatterns: extractSectionNotes(recipe, "Anti-patterns"),
  }
}
