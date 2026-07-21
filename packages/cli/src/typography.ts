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

// `text-lg`, `md:text-lg`, `text-[13px]`, `md:text-[0.9rem]`
const UTILITY_RULE = /(?:^|["'`\s{])((?:[a-z0-9-]+:)*text-(?:\[[^\]\s]+\]|[a-z0-9]+))(?=["'`\s}]|$)/g
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

  for (const match of source.matchAll(UTILITY_RULE)) {
    const utility = stripVariants(match[1])
    const suffix = utility.slice("text-".length)
    if (suffix.startsWith("[")) {
      const px = lengthToPx(suffix.slice(1, -1))
      if (px !== null) steps.add(px)
      continue
    }
    // `text-center`, `text-primary` and friends share the prefix but are not
    // sizes — only names present in the scale count.
    if (suffix in scale) steps.add(Math.round(scale[suffix]))
  }

  for (const match of source.matchAll(INLINE_RULE)) {
    const px = lengthToPx(match[1])
    if (px !== null) steps.add(px)
  }

  for (const match of source.matchAll(CSS_RULE)) {
    const px = lengthToPx(match[1])
    if (px !== null) steps.add(px)
  }

  return steps
}
