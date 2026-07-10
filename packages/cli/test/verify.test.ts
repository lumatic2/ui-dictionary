import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { initProject } from "../src/inject.js"
import { verifyDir } from "../src/verify.js"

const dirs: string[] = []
function tempDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "askewly-verify-"))
  dirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe("verifyDir", () => {
  it("flags hex literals and raw color functions with line numbers", () => {
    const dir = tempDir()
    writeFileSync(path.join(dir, "bad.tsx"), `const a = "ok"\nconst b = "#fff"\nconst c = "oklch(0.5 0 0)"\n`)
    const { violations } = verifyDir(dir)
    expect(violations).toHaveLength(2)
    expect(violations[0]).toMatchObject({ line: 2, rule: "hex-literal" })
    expect(violations[1]).toMatchObject({ line: 3, rule: "raw-color-fn" })
  })

  it("passes clean files and skips generated token files", () => {
    const dir = tempDir()
    initProject(dir, false) // tokens.css/askewly.css contain raw colors but must be skipped
    writeFileSync(path.join(dir, "clean.tsx"), `<div className="bg-primary text-primary-foreground" />\n`)
    const { violations } = verifyDir(dir)
    expect(violations).toHaveLength(0)
  })

  it("skips node_modules and dist", () => {
    const dir = tempDir()
    mkdirSync(path.join(dir, "node_modules"))
    mkdirSync(path.join(dir, "dist"))
    writeFileSync(path.join(dir, "node_modules", "dep.ts"), `const x = "#123456"\n`)
    writeFileSync(path.join(dir, "dist", "out.js"), `const x = "#123456"\n`)
    expect(verifyDir(dir).violations).toHaveLength(0)
  })
})
