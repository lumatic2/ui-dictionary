#!/usr/bin/env node
import { readFileSync } from "node:fs"
import path from "node:path"
import { Command } from "commander"
import { addRecipe, initProject, InjectError } from "./inject.js"
import { verifyDir } from "./verify.js"
import {
  loadRecipes,
  loadTerms,
  loadTokens,
  loadTokensCss,
  searchTerms,
  tokensForTier,
  type Term,
} from "./load.js"

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string }

const program = new Command()
program
  .name("askewly-design")
  .description("Query the Askewly Design system: UI vocabulary terms, design tokens, and component recipes.")
  .version(pkg.version)

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function asList(value: string[] | string | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value.map(String) : [String(value)]
}

function printTermLine(term: Term) {
  const en = term.en?.name ?? term.id
  const ko = term.ko?.name ? ` (${term.ko.name})` : ""
  console.log(`${term.id}  —  ${en}${ko}`)
  if (term.one_liner) console.log(`    ${term.one_liner}`)
}

const terms = program.command("terms").description("UI vocabulary (536+ terms)")

terms
  .command("search")
  .argument("<query>", "text to match against id, names, aliases, prompt phrases")
  .option("--json", "machine-readable output")
  .option("--limit <n>", "max results", "10")
  .description("search terms")
  .action((query: string, options: { json?: boolean; limit: string }) => {
    const results = searchTerms(loadTerms(), query).slice(0, Number(options.limit) || 10)
    if (results.length === 0) fail(`no terms match "${query}"`)
    if (options.json) {
      console.log(JSON.stringify(results.map((t) => ({ id: t.id, en: t.en?.name, ko: t.ko?.name, one_liner: t.one_liner, category: t.category, group: t.group })), null, 2))
      return
    }
    for (const term of results) printTermLine(term)
  })

terms
  .command("show")
  .argument("<id>", "term id, e.g. hero")
  .option("--json", "machine-readable output")
  .description("show one term in full")
  .action((id: string, options: { json?: boolean }) => {
    const term = loadTerms().find((t) => t.id === id)
    if (!term) fail(`unknown term "${id}" — try: askewly-design terms search ${id}`)
    if (options.json) {
      console.log(JSON.stringify(term, null, 2))
      return
    }
    printTermLine(term)
    console.log(`    category: ${term.category} / ${term.group}`)
    if (term.description) console.log(`\n${term.description}`)
    const sections: Array<[string, string[]]> = [
      ["When to use", asList(term.when_to_use)],
      ["Anti-use", asList(term.anti_use)],
      ["Prompt phrases", term.prompt_phrases ?? []],
    ]
    for (const [title, items] of sections) {
      if (items.length === 0) continue
      console.log(`\n${title}:`)
      for (const item of items) console.log(`  - ${item}`)
    }
  })

program
  .command("tokens")
  .option("--tier <tier>", "color tier: primitive | semantic | component")
  .option("--format <format>", "json | css", "json")
  .description("design tokens (DTCG source or generated CSS)")
  .action((options: { tier?: string; format: string }) => {
    if (options.format === "css") {
      if (options.tier) fail("--tier only applies to --format json (the CSS output is generated as a whole)")
      process.stdout.write(loadTokensCss())
      return
    }
    if (options.format !== "json") fail(`unknown format "${options.format}" — use json or css`)
    const tokens = loadTokens()
    if (options.tier) {
      const subtree = tokensForTier(tokens, options.tier)
      if (subtree === null) fail(`unknown tier "${options.tier}" — use primitive, semantic, or component`)
      console.log(JSON.stringify(subtree, null, 2))
      return
    }
    console.log(JSON.stringify(tokens, null, 2))
  })

program
  .command("init")
  .argument("[dir]", "target directory", ".")
  .option("--force", "overwrite existing files")
  .description("write DESIGN.md and tokens.css into a project")
  .action((dir: string, options: { force?: boolean }) => {
    try {
      const written = initProject(path.resolve(dir), Boolean(options.force))
      for (const file of written) console.log(`wrote ${file}`)
      console.log('\nNext: add `@import "./askewly.css";` after `@import "tailwindcss";` in your global stylesheet, then `askewly-design add <recipe>`.')
    } catch (error) {
      if (error instanceof InjectError) fail(error.message)
      throw error
    }
  })

program
  .command("add")
  .argument("<recipe>", "recipe id, e.g. button")
  .option("--out <dir>", "output directory for the component file", ".")
  .option("--tokens <file>", "path to the project's tokens.css", "tokens.css")
  .option("--force", "overwrite an existing file")
  .description("inject a recipe's Code excerpt into the project")
  .action((id: string, options: { out: string; tokens: string; force?: boolean }) => {
    const recipe = loadRecipes().find((r) => r.id === id)
    if (!recipe) fail(`unknown recipe "${id}" — try: askewly-design recipes list`)
    try {
      const result = addRecipe(recipe, path.resolve(options.out), Boolean(options.force), path.resolve(options.tokens))
      console.log(`wrote ${result.file}`)
      if (result.missingTokens.length > 0) {
        console.log(`\n⚠ tokens not found in ${options.tokens} — run \`askewly-design init\` first. Required:`)
        for (const token of result.missingTokens) console.log(`  - ${token}`)
      }
      if (recipe.code_asset) console.log(`\nFull implementation reference: ${recipe.code_asset} (ui-dictionary repo)`)
      if (result.checks.length > 0) {
        console.log("\nChecks before you ship:")
        for (const check of result.checks) console.log(`  - ${check}`)
      }
      if (result.antiPatterns.length > 0) {
        console.log("\nAnti-patterns to avoid:")
        for (const anti of result.antiPatterns) console.log(`  - ${anti}`)
      }
    } catch (error) {
      if (error instanceof InjectError) fail(error.message)
      throw error
    }
  })

program
  .command("verify")
  .argument("[dir]", "directory to scan", ".")
  .option("--ext <list>", "comma-separated extensions to scan", "tsx,ts,jsx,js,css,html")
  .description("scan for color values that bypass the token system (hex literals, raw rgb/hsl/oklch)")
  .action((dir: string, options: { ext: string }) => {
    const target = path.resolve(dir)
    const { files, violations } = verifyDir(target, options.ext.split(",").map((e) => e.trim()))
    if (violations.length === 0) {
      console.log(`verify PASS — ${files} file(s) scanned, no color literals (tokens.css/askewly.css and build dirs are excluded)`)
      return
    }
    console.error(`verify FAIL — ${violations.length} violation(s) in ${files} file(s):`)
    for (const violation of violations) {
      console.error(`  ${path.relative(target, violation.file)}:${violation.line} [${violation.rule}] ${violation.excerpt}`)
    }
    console.error("\nFix: replace literals with semantic token utilities (bg-primary, text-foreground, border-border, ...).")
    process.exit(1)
  })

const recipes = program.command("recipes").description("component recipes (agent-ready implementation contracts)")

recipes
  .command("list")
  .option("--json", "machine-readable output")
  .description("list all recipes")
  .action((options: { json?: boolean }) => {
    const all = loadRecipes()
    if (options.json) {
      console.log(JSON.stringify(all.map((r) => ({ id: r.id, name: r.name, pattern_group: r.pattern_group, source_path: r.source_path })), null, 2))
      return
    }
    for (const recipe of all) {
      console.log(`${recipe.id}  (${recipe.pattern_group ?? "-"})  —  ${recipe.name ?? recipe.id}`)
    }
  })

recipes
  .command("show")
  .argument("<id>", "recipe id, e.g. button")
  .option("--json", "machine-readable output (frontmatter + body)")
  .description("show one recipe in full")
  .action((id: string, options: { json?: boolean }) => {
    const recipe = loadRecipes().find((r) => r.id === id)
    if (!recipe) fail(`unknown recipe "${id}" — try: askewly-design recipes list`)
    if (options.json) {
      console.log(JSON.stringify(recipe, null, 2))
      return
    }
    console.log(`# ${recipe.name ?? recipe.id}  (${recipe.pattern_group ?? "-"})`)
    if (recipe.tokens_used?.length) console.log(`tokens_used: ${recipe.tokens_used.join(", ")}`)
    if (recipe.code_asset) console.log(`code_asset: ${recipe.code_asset}`)
    console.log("")
    console.log(recipe.body)
  })

program.parse()
