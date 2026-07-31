import { loadTokens } from "./load.js"

/**
 * Counts how many distinct type sizes one file uses.
 *
 * The hard part is not counting — it is deciding what counts as one "step".
 * A file can express font size four ways (named Tailwind utility, arbitrary
 * value, inline style, CSS declaration) and they must land in the same space
 * to be comparable. So every expression is resolved to an integer px value and
 * the distinct set is what we report.
 */

const REM_PX = 16

/**
 * Tailwind v4 defaults for names our token scale does not define. Our SSOT owns
 * sm/base/lg/xl/2xl; everything else is Tailwind's, so it is looked up here
 * rather than invented. Values in rem, converted at REM_PX.
 */
const TAILWIND_DEFAULTS_REM: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.875,
  "4xl": 2.25,
  "5xl": 3,
  "6xl": 3.75,
  "7xl": 4.5,
  "8xl": 6,
  "9xl": 8,
}

/** Reads our own scale from the token SSOT. Never hardcode these — they move. */
function scaleFromTokens(): Record<string, number> {
  const tokens = loadTokens() as {
    typography?: { scale?: Record<string, { $value?: { value?: number; unit?: string } }> }
  }
  const scale = tokens.typography?.scale ?? {}
  const out: Record<string, number> = {}
  for (const [name, node] of Object.entries(scale)) {
    const value = node?.$value?.value
    const unit = node?.$value?.unit
    if (typeof value !== "number") continue
    out[name] = unit === "rem" ? value * REM_PX : value
  }
  return out
}

/**
 * Our scale wins over Tailwind's defaults for the names it defines — that is
 * the whole point of having a token SSOT. Names it does not define fall back.
 */
export function typographyScale(): Record<string, number> {
  return { ...tailwindDefaultsPx(), ...scaleFromTokens() }
}

function tailwindDefaultsPx(): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [name, rem] of Object.entries(TAILWIND_DEFAULTS_REM)) out[name] = Math.round(rem * REM_PX)
  return out
}

/** `md:text-lg`, `hover:text-xl`, `dark:md:text-sm` → `text-lg` etc. */
function stripVariants(utility: string): string {
  const parts = utility.split(":")
  return parts[parts.length - 1]
}

/**
 * Named breakpoints plus the `min-*`/`max-*` families. Matching the families by
 * shape rather than listing them keeps arbitrary variants (`max-[900px]`,
 * `min-[40rem]`) in the same space as the named ones.
 */
const NAMED_BREAKPOINTS = new Set(["sm", "md", "lg", "xl", "2xl"])

function isBreakpointVariant(variant: string): boolean {
  if (NAMED_BREAKPOINTS.has(variant)) return true
  return /^(?:min|max)-/.test(variant)
}

/**
 * The breakpoint a utility renders at, as a stable key. Non-breakpoint variants
 * (`hover`, `dark`, `group-*`) do not create a bucket: they are states of the
 * same screen, and their sizes are visible alongside the rest.
 */
function breakpointBucket(utility: string): string {
  const variants = utility.split(":").slice(0, -1).filter(isBreakpointVariant)
  return [...new Set(variants)].sort().join("+")
}

function lengthToPx(raw: string): number | null {
  const text = raw.trim()
  let match = /^(-?\d*\.?\d+)px$/.exec(text)
  if (match) return Math.round(Number(match[1]))
  match = /^(-?\d*\.?\d+)rem$/.exec(text)
  if (match) return Math.round(Number(match[1]) * REM_PX)
  match = /^(-?\d*\.?\d+)em$/.exec(text)
  if (match) return Math.round(Number(match[1]) * REM_PX)
  match = /^(-?\d*\.?\d+)pt$/.exec(text)
  if (match) return Math.round((Number(match[1]) * 96) / 72)
  return null
}

// `text-lg`, `md:text-lg`, `text-[13px]`, `md:text-[0.9rem]`, `min-[900px]:text-lg`
// The bracket in the variant half is load-bearing: without it an arbitrary
// breakpoint made the whole utility invisible to the scan, not just its prefix.
const UTILITY_RULE = /(?:^|["'`\s{])((?:[a-z0-9-]+(?:\[[^\]\s]+\])?:)*text-(?:\[[^\]\s]+\]|[a-z0-9]+))(?=["'`\s}]|$)/g
// `fontSize: "14px"` / `fontSize: '1rem'` / `font-size: 14px`
const INLINE_RULE = /fontSize\s*:\s*["'`]([^"'`]+)["'`]/g
const CSS_RULE = /font-size\s*:\s*([^;}\n]+)/g

/**
 * Resolves every font-size expression in one file to px and returns the
 * distinct set. Responsive/state prefixes are stripped: only one breakpoint
 * renders at a time, so `md:text-lg` is not a step of its own.
 */
export function resolveTypographySteps(source: string, scale = typographyScale()): Set<number> {
  const steps = new Set<number>()
  for (const sizes of resolveTypographyBuckets(source, scale).values()) {
    for (const size of sizes) steps.add(size)
  }
  return steps
}

/** The base bucket: sizes that render with no breakpoint variant attached. */
export const BASE_BUCKET = ""

/**
 * Same resolution as `resolveTypographySteps`, but keyed by the breakpoint the
 * size renders at.
 *
 * Counting every size in one set punished the ordinary responsive pair:
 * `text-5xl md:text-7xl` is one element at one size on any given screen, yet it
 * read as two steps. Buckets are judged independently because only one
 * breakpoint is live at a time.
 *
 * Known limit: inline styles and CSS declarations land in the base bucket even
 * inside `@media` — attributing those needs block parsing, and the files that
 * drove this change express sizes as utilities.
 */
export function resolveTypographyBuckets(source: string, scale = typographyScale()): Map<string, Set<number>> {
  const buckets = new Map<string, Set<number>>()
  const add = (bucket: string, px: number) => {
    const existing = buckets.get(bucket)
    if (existing) existing.add(px)
    else buckets.set(bucket, new Set([px]))
  }

  for (const match of source.matchAll(UTILITY_RULE)) {
    const bucket = breakpointBucket(match[1])
    const utility = stripVariants(match[1])
    const suffix = utility.slice("text-".length)
    if (suffix.startsWith("[")) {
      const px = lengthToPx(suffix.slice(1, -1))
      if (px !== null) add(bucket, px)
      continue
    }
    // `text-center`, `text-primary` and friends share the prefix but are not
    // sizes — only names present in the scale count.
    if (suffix in scale) add(bucket, Math.round(scale[suffix]))
  }

  for (const match of source.matchAll(INLINE_RULE)) {
    const px = lengthToPx(match[1])
    if (px !== null) add(BASE_BUCKET, px)
  }

  for (const match of source.matchAll(CSS_RULE)) {
    const px = lengthToPx(match[1])
    if (px !== null) add(BASE_BUCKET, px)
  }

  return buckets
}

/**
 * Default step limit.
 *
 * Kraft (당근) uses 4. We use 5 because our own token scale defines five sizes
 * (sm 14 / base 16 / lg 20 / xl 28 / 2xl 40) — at 4, a screen that uses the
 * design system's full scale and nothing else would be a violation. Borrowing
 * someone else's number without checking it against our tokens would have made
 * the rule contradict the system it is supposed to defend.
 */
export const DEFAULT_TYPOGRAPHY_THRESHOLD = 5

export type TypographyViolation = {
  line: number
  steps: number[]
  threshold: number
  /** Which breakpoint broke the limit; `BASE_BUCKET` for the unprefixed screen. */
  bucket: string
}

/**
 * Returns the violation for one file, or null when every breakpoint stays
 * within the limit. The reported line is where the step that broke the limit
 * first appears — pointing at the first line of the file would say nothing
 * about what to fix.
 *
 * Buckets are judged separately, which under-counts on purpose: at `md` the
 * screen also shows whatever base sizes `md` did not override, and a text
 * scanner cannot tell which those are. The alternative — adding base into every
 * breakpoint — reinstates the false positive this rule exists to avoid, so the
 * rule stays quiet where it cannot be sure.
 */
export function typographyViolation(
  source: string,
  threshold = DEFAULT_TYPOGRAPHY_THRESHOLD,
  scale = typographyScale(),
): TypographyViolation | null {
  const seen = new Map<string, Set<number>>()
  let breaking: { line: number; bucket: string } | null = null

  source.split("\n").forEach((text, index) => {
    for (const [bucket, sizes] of resolveTypographyBuckets(text, scale)) {
      const known = seen.get(bucket) ?? new Set<number>()
      seen.set(bucket, known)
      for (const step of sizes) {
        known.add(step)
        if (breaking === null && known.size > threshold) breaking = { line: index + 1, bucket }
      }
    }
  })

  if (breaking === null) return null
  const { line, bucket } = breaking
  const steps = [...(seen.get(bucket) ?? new Set<number>())].sort((a, b) => a - b)
  return { line, steps, threshold, bucket }
}
