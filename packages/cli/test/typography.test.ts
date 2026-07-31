import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { resolveTypographyBuckets, resolveTypographySteps, typographyScale, typographyViolation } from "../src/typography.js"

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

// M1 — the rule counted `text-5xl md:text-7xl` as two steps, so ordinary
// responsive headings ate the budget of files that had no type problem.
describe("resolveTypographyBuckets", () => {
  const scale = { sm: 14, base: 16, lg: 20, "5xl": 48, "7xl": 72 }

  it("separates a responsive pair into its own breakpoints", () => {
    const buckets = resolveTypographyBuckets(`<h1 className="text-5xl md:text-7xl" />`, scale)
    expect([...buckets.get("")!]).toEqual([48])
    expect([...buckets.get("md")!]).toEqual([72])
  })

  it("keeps non-breakpoint variants in the base bucket", () => {
    // hover and dark are states of the same screen, visible next to everything
    // else on it — they are not a separate layout.
    const buckets = resolveTypographyBuckets(`<a className="text-sm hover:text-lg dark:text-base" />`, scale)
    expect([...buckets.keys()]).toEqual([""])
    expect([...buckets.get("")!].sort((a, b) => a - b)).toEqual([14, 16, 20])
  })

  it("buckets arbitrary min-/max- variants too", () => {
    const buckets = resolveTypographyBuckets(`<p className="max-md:text-sm min-[900px]:text-lg" />`, scale)
    expect([...buckets.get("max-md")!]).toEqual([14])
    expect([...buckets.get("min-[900px]")!]).toEqual([20])
  })

  it("normalises a variant chain to one bucket regardless of order", () => {
    const a = resolveTypographyBuckets(`<p className="md:hover:text-lg" />`, scale)
    const b = resolveTypographyBuckets(`<p className="hover:md:text-lg" />`, scale)
    expect([...a.keys()]).toEqual([...b.keys()])
    expect([...a.keys()]).toEqual(["md"])
  })
})

describe("typographyViolation", () => {
  const scale = { xs: 12, sm: 14, base: 16, lg: 20, xl: 28, "2xl": 40, "5xl": 48, "7xl": 72 }

  it("does not flag a scale-full file that also carries responsive pairs", () => {
    const source = [
      `<h1 className="text-5xl md:text-7xl" />`,
      `<p className="text-xs" /><p className="text-sm" /><p className="text-base" />`,
      `<p className="text-lg" /><p className="text-xl" />`,
    ].join("\n")
    // base = 12,14,16,20,28,48 → six, over the limit; the pair is not the cause.
    expect(typographyViolation(source, 6, scale)).toBeNull()
  })

  it("still flags a file that exceeds the limit at one breakpoint", () => {
    const source = `<p className="text-xs text-sm text-base text-lg text-xl text-2xl" />`
    const violation = typographyViolation(source, 5, scale)
    expect(violation).not.toBeNull()
    expect(violation!.bucket).toBe("")
    expect(violation!.steps).toEqual([12, 14, 16, 20, 28, 40])
  })

  it("flags a breakpoint bucket that blows the limit on its own", () => {
    const source = `<p className="md:text-xs md:text-sm md:text-base md:text-lg md:text-xl md:text-2xl" />`
    const violation = typographyViolation(source, 5, scale)
    expect(violation).not.toBeNull()
    expect(violation!.bucket).toBe("md")
  })
})
