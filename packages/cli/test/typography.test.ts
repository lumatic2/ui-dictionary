import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { resolveTypographySteps, typographyScale } from "../src/typography.js"

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "typography-regression")

function steps(name: string): number[] {
  const source = readFileSync(path.join(FIXTURES, name), "utf8")
  return [...resolveTypographySteps(source)].sort((a, b) => a - b)
}

describe("typographyScale", () => {
  it("takes our scale from the token SSOT, not a hardcoded list", () => {
    const scale = typographyScale()
    // Our SSOT: sm 14 / base 16 / lg 20 / xl 28 / 2xl 40 — five steps.
    expect(scale.sm).toBe(14)
    expect(scale.base).toBe(16)
    expect(scale.lg).toBe(20)
    expect(scale.xl).toBe(28)
    expect(scale["2xl"]).toBe(40)
  })

  it("our scale wins over the Tailwind default for names we define", () => {
    // Tailwind's lg is 1.125rem = 18px. Ours is 20px. If this ever reads 18,
    // the SSOT stopped being the source of truth.
    expect(typographyScale().lg).toBe(20)
    expect(typographyScale().lg).not.toBe(18)
  })

  it("falls back to Tailwind defaults for names our scale does not define", () => {
    expect(typographyScale().xs).toBe(12)
    expect(typographyScale()["4xl"]).toBe(36)
  })
})

describe("resolveTypographySteps", () => {
  it("resolves named utilities through the SSOT", () => {
    expect(steps("named-utility.tsx")).toEqual([14, 20, 28])
  })

  it("resolves out-of-scale names through Tailwind defaults", () => {
    expect(steps("out-of-scale.tsx")).toEqual([12, 36])
  })

  it("resolves arbitrary values and inline styles", () => {
    expect(steps("arbitrary-and-inline.tsx")).toEqual([13, 14])
  })

  it("merges responsive variants into the base step", () => {
    // md:text-lg and text-lg are both 20 — one step, not two.
    expect(steps("responsive.tsx")).toEqual([16, 20])
  })

  // The fixture above cannot detect a regression on its own: it contains a
  // plain `text-lg` too, so dropping `md:text-lg` entirely still yields
  // {16, 20}. A probe caught that. This fixture reaches 20 and 28 ONLY through
  // prefixed utilities, so prefix handling is actually load-bearing here.
  it("reads sizes that appear only behind a variant prefix", () => {
    expect(steps("variant-only.tsx")).toEqual([16, 20, 28])
  })

  it("resolves CSS font-size declarations", () => {
    expect(steps("mixed.css")).toEqual([14, 24])
  })

  it("ignores text- utilities that are not sizes", () => {
    expect([...resolveTypographySteps(`<div className="text-center text-primary" />`)]).toEqual([])
  })

  it("converts units to px", () => {
    const scale = { base: 16 }
    expect([...resolveTypographySteps(`font-size: 1rem`, scale)]).toEqual([16])
    expect([...resolveTypographySteps(`font-size: 12pt`, scale)]).toEqual([16])
    expect([...resolveTypographySteps(`.a{font-size:18px}`, scale)]).toEqual([18])
  })
})
