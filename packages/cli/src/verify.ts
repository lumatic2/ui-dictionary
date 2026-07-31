import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { DEFAULT_TYPOGRAPHY_THRESHOLD, typographyViolation } from "./typography.js"

export type Violation = {
  file: string
  line: number
  rule: "hex-literal" | "raw-color-fn" | "typography-scale-exceeded" | "typography-marker-no-reason"
  excerpt: string
}

/** A file that opted out of the typography rule, and the reason it gave. */
export type TypographySkip = {
  file: string
  line: number
  reason: string
}

/**
 * File-level opt-out for the typography rule. Some files are not one screen —
 * a gallery holding a dozen demos, a miniature mockup drawn at fractional
 * sizes — and for those the count answers a question nobody asked.
 *
 * The reason is mandatory: an exemption nobody had to justify is how a gate
 * stops being a gate. Files claiming the marker are also reported by name, so
 * the exemptions stay countable instead of disappearing into a PASS.
 */
const TYPOGRAPHY_MARKER = /askewly-typography-ok(?::([^\n]*))?/

const DEFAULT_EXTENSIONS = ["tsx", "ts", "jsx", "js", "css", "html"]
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", ".next"])
// Generated token files legitimately contain raw color values.
const SKIP_FILES = new Set(["tokens.css", "askewly.css"])

const HEX_RULE = /#[0-9a-fA-F]{3,8}\b/
const COLOR_FN_RULE = /\b(?:rgb|rgba|hsl|hsla|oklch)\(/

// Every rule is checked independently per line. A single ternary would report
// only the first match and silently drop the rest — `"#111" + "rgb(1,2,3)"`
// hid its raw-color-fn violation that way (DOG1 step-1 baseline).
const RULES: ReadonlyArray<{ name: Violation["rule"]; pattern: RegExp }> = [
  { name: "hex-literal", pattern: HEX_RULE },
  { name: "raw-color-fn", pattern: COLOR_FN_RULE },
]

// `//` starts a comment in JS-family sources only. In CSS it does not, and
// blanking to end-of-line there would hide real declarations.
const LINE_COMMENT_EXTENSIONS = new Set(["ts", "tsx", "js", "jsx"])

// Two SVG shapes: paired <svg>…</svg> and self-closing <svg … />.
const SVG_PAIRED = /<svg\b[\s\S]*?<\/svg\s*>/gi
const SVG_SELF_CLOSING = /<svg\b[^>]*\/>/gi

/**
 * Blanks regions whose color literals are not rendered output — comments and
 * SVG markup — while preserving every character position and newline, so
 * reported line numbers still point at the original source.
 *
 * Masking happens BEFORE rule matching, deliberately. Attaching per-rule
 * exceptions instead would mean re-implementing the same context handling for
 * every future rule, and DOG1 step-1 observed that both existing rules already
 * had the identical false positive.
 */
export function maskIgnoredRegions(source: string, ext: string): string {
  const chars = source.split("")
  const blank = (index: number) => {
    if (chars[index] !== "\n") chars[index] = " "
  }

  // Pass 1 — comments, string-aware so `"https://…"` is not read as a comment.
  const allowLineComment = LINE_COMMENT_EXTENSIONS.has(ext)
  type State = "code" | "line-comment" | "block-comment" | "single" | "double" | "template"
  let state: State = "code"
  let i = 0
  while (i < source.length) {
    const c = source[i]
    const next = source[i + 1]
    switch (state) {
      case "code":
        if (c === "/" && next === "*") {
          state = "block-comment"
          blank(i)
          blank(i + 1)
          i += 2
          continue
        }
        if (allowLineComment && c === "/" && next === "/") {
          state = "line-comment"
          blank(i)
          blank(i + 1)
          i += 2
          continue
        }
        if (c === "'") state = "single"
        else if (c === '"') state = "double"
        else if (c === "`") state = "template"
        break
      case "line-comment":
        if (c === "\n") state = "code"
        else blank(i)
        break
      case "block-comment":
        blank(i)
        if (c === "*" && next === "/") {
          blank(i + 1)
          state = "code"
          i += 2
          continue
        }
        break
      case "single":
      case "double":
      case "template": {
        if (c === "\\") {
          i += 2
          continue
        }
        const closes = (state === "single" && c === "'") || (state === "double" && c === '"') || (state === "template" && c === "`")
        if (closes) state = "code"
        break
      }
    }
    i += 1
  }

  // Pass 2 — SVG markup, matched against the comment-masked text so a commented
  // out `</svg>` cannot terminate a block early.
  let masked = chars.join("")
  for (const pattern of [SVG_PAIRED, SVG_SELF_CLOSING]) {
    masked = masked.replace(pattern, (match) => match.replace(/[^\n]/g, " "))
  }
  return masked
}

function collectFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stats = statSync(full)
    if (stats.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) files.push(...collectFiles(full, extensions))
      continue
    }
    if (SKIP_FILES.has(entry)) continue
    const ext = path.extname(entry).slice(1)
    if (extensions.includes(ext)) files.push(full)
  }
  return files
}

/**
 * Scans project files for color values that bypass the token system:
 * hex literals and raw color functions. Token indirection means UI code
 * should only reference semantic utilities (bg-primary, text-foreground, ...).
 */
export function verifyDir(
  dir: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
  options: { typographyThreshold?: number } = {},
): { files: number; violations: Violation[]; typographySkips: TypographySkip[] } {
  const threshold = options.typographyThreshold ?? DEFAULT_TYPOGRAPHY_THRESHOLD
  const files = collectFiles(dir, extensions)
  const violations: Violation[] = []
  const typographySkips: TypographySkip[] = []
  for (const file of files) {
    const source = readFileSync(file, "utf8")
    const masked = maskIgnoredRegions(source, path.extname(file).slice(1))
    const scanned = masked.split("\n")
    const original = source.split("\n")
    scanned.forEach((text, index) => {
      for (const { name, pattern } of RULES) {
        if (!pattern.test(text)) continue
        // Report the untouched source line — the mask is a matching device,
        // not something the reader should have to decode.
        violations.push({ file, line: index + 1, rule: name, excerpt: original[index].trim().slice(0, 120) })
      }
    })

    // The marker is read from the original source: it lives in a comment, and
    // the masked copy has blanked those out.
    const markerLine = original.findIndex((text) => TYPOGRAPHY_MARKER.test(text))
    if (markerLine !== -1) {
      const reason = (TYPOGRAPHY_MARKER.exec(original[markerLine])?.[1] ?? "").trim()
      if (reason.length === 0) {
        violations.push({
          file,
          line: markerLine + 1,
          rule: "typography-marker-no-reason",
          excerpt: "askewly-typography-ok needs a reason: askewly-typography-ok: <why this file is not one screen>",
        })
      } else {
        typographySkips.push({ file, line: markerLine + 1, reason })
      }
      continue
    }

    // Typography counts per file, not per line: the question is how many sizes
    // one screen uses. Comments and SVG are masked out here too — a size
    // mentioned in a comment is not rendered.
    const typography = typographyViolation(masked, threshold)
    if (typography) {
      const where = typography.bucket === "" ? "" : ` at ${typography.bucket}`
      violations.push({
        file,
        line: typography.line,
        rule: "typography-scale-exceeded",
        excerpt: `font-size steps${where}: ${typography.steps.join(", ")} (${typography.steps.length} > limit ${typography.threshold})`,
      })
    }
  }
  return { files: files.length, violations, typographySkips }
}
