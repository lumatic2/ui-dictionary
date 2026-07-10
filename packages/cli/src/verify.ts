import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

export type Violation = {
  file: string
  line: number
  rule: "hex-literal" | "raw-color-fn"
  excerpt: string
}

const DEFAULT_EXTENSIONS = ["tsx", "ts", "jsx", "js", "css", "html"]
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", ".next"])
// Generated token files legitimately contain raw color values.
const SKIP_FILES = new Set(["tokens.css", "askewly.css"])

const HEX_RULE = /#[0-9a-fA-F]{3,8}\b/
const COLOR_FN_RULE = /\b(?:rgb|rgba|hsl|hsla|oklch)\(/

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
export function verifyDir(dir: string, extensions: string[] = DEFAULT_EXTENSIONS): { files: number; violations: Violation[] } {
  const files = collectFiles(dir, extensions)
  const violations: Violation[] = []
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n")
    lines.forEach((text, index) => {
      const rule = HEX_RULE.test(text) ? "hex-literal" : COLOR_FN_RULE.test(text) ? "raw-color-fn" : null
      if (rule) {
        violations.push({ file, line: index + 1, rule, excerpt: text.trim().slice(0, 120) })
      }
    })
  }
  return { files: files.length, violations }
}
