import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it } from "vitest"
import { initProject } from "../src/inject.js"
import { maskIgnoredRegions, verifyDir } from "../src/verify.js"

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "verify-regression")

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

// DOG1 step-2. The regression corpus lives in the repo so these cases stay
// visible as files, not only as inline strings; each fixture is scanned alone
// because verifyDir reports per directory.
describe("verifyDir — ignored regions (DOG1 step-2)", () => {
  function scanFixture(name: string) {
    const dir = tempDir()
    const source = readFileSync(path.join(FIXTURES, name), "utf8")
    writeFileSync(path.join(dir, name), source)
    return verifyDir(dir).violations
  }

  it("does not flag color literals inside SVG markup", () => {
    expect(scanFixture("svg.tsx")).toHaveLength(0)
  })

  it("does not flag color literals inside comments", () => {
    expect(scanFixture("comment.tsx")).toHaveLength(0)
  })

  it("still flags literals outside the SVG block", () => {
    const violations = scanFixture("svg-outside.tsx")
    expect(violations).toHaveLength(2)
    expect(violations[0]).toMatchObject({ line: 5, rule: "hex-literal" })
    expect(violations[1]).toMatchObject({ line: 8, rule: "raw-color-fn" })
  })

  it("still flags literals outside comments", () => {
    const violations = scanFixture("comment-outside.tsx")
    expect(violations).toHaveLength(2)
    expect(violations[0]).toMatchObject({ line: 6, rule: "hex-literal" })
    expect(violations[1]).toMatchObject({ line: 10, rule: "raw-color-fn" })
  })

  it("keeps the clean fixture clean", () => {
    expect(scanFixture("clean.tsx")).toHaveLength(0)
  })

  it("reports the original source line, not the masked one", () => {
    const violations = scanFixture("comment-outside.tsx")
    expect(violations[0].excerpt).toContain("#654321")
    expect(violations[0].excerpt).toContain("주석 안의 #000000")
  })

  it("does not read `//` inside a string as a comment", () => {
    const dir = tempDir()
    // Without string tracking the URL's `//` would blank the rest of the line
    // and hide a real violation.
    writeFileSync(path.join(dir, "url.tsx"), `const u = "https://x.dev"; const c = "#abc"\n`)
    const violations = verifyDir(dir).violations
    expect(violations).toHaveLength(1)
    expect(violations[0]).toMatchObject({ line: 1, rule: "hex-literal" })
  })

  it("does not treat `//` as a comment in CSS", () => {
    const dir = tempDir()
    writeFileSync(path.join(dir, "a.css"), `.a { background: url(//cdn/x.png); color: #abc; }\n`)
    expect(verifyDir(dir).violations).toHaveLength(1)
  })

  // DOG1 step-3.
  it("reports every rule matched on one line, not just the first", () => {
    const dir = tempDir()
    const source = readFileSync(path.join(FIXTURES, "oneline.tsx"), "utf8")
    writeFileSync(path.join(dir, "oneline.tsx"), source)
    const violations = verifyDir(dir).violations
    expect(violations).toHaveLength(2)
    expect(violations[0]).toMatchObject({ line: 4, rule: "hex-literal" })
    expect(violations[1]).toMatchObject({ line: 4, rule: "raw-color-fn" })
  })

  it("still reports a single rule once when only one matches", () => {
    const dir = tempDir()
    writeFileSync(path.join(dir, "one.tsx"), `const a = "#111"\n`)
    expect(verifyDir(dir).violations).toHaveLength(1)
  })

  it("masks without shifting line numbers", () => {
    const source = `/* rgb(1,2,3)\n   #ffffff */\nconst c = "#abc"\n`
    const masked = maskIgnoredRegions(source, "tsx")
    expect(masked.split("\n")).toHaveLength(source.split("\n").length)
    expect(masked).toHaveLength(source.length)
    expect(masked.split("\n")[2]).toContain("#abc")
  })
})
