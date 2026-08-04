import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { verifyDir } from "./verify.js"

export class KickstartError extends Error {}

const REGISTRY_BASE = "https://ui.askewly.com"
const SHADCN_BASE = "https://ui.shadcn.com/r/styles/new-york-v4"

// ---------------------------------------------------------------------------
// Abbreviated brief (block-contract.md §8 / design-brief.md 축약 모드):
// three questions, options + recommended default. Everything else is a
// recorded assumption in the generated DESIGN.md.
// ---------------------------------------------------------------------------

export type BriefAnswers = { tone: string; color: string; type: string }

const BRIEF_QUESTIONS: Array<{ key: keyof BriefAnswers; label: string; options: string[]; recommended: string }> = [
  {
    key: "tone",
    label: "Tone — how should the product feel?",
    options: ["minimal-clean", "warm-editorial", "dark-technical"],
    recommended: "minimal-clean",
  },
  {
    key: "color",
    label: "Color direction — the single accent family",
    options: ["blue", "teal", "violet", "amber", "cosmos"],
    recommended: "blue",
  },
  {
    key: "type",
    label: "Type direction — one family, hierarchy by weight/size",
    options: ["system-sans", "geist-sans", "humanist-serif-display"],
    recommended: "system-sans",
  },
]

const FONT_STACKS: Record<string, string> = {
  "system-sans": "system-ui, 'Noto Sans KR', sans-serif",
  "geist-sans": "'Geist', 'Noto Sans KR', system-ui, sans-serif",
  "humanist-serif-display": "'Source Serif 4', 'Noto Serif KR', Georgia, serif",
}

// Accent hue pairs. Hex only — the flat-colors DESIGN.md parser (slide-theme
// converter, parser A) accepts hex exclusively; the template stays canonical,
// the generator conforms (M17 decision carried over).
const ACCENTS: Record<string, { light: string; onLight: string; dark: string; onDark: string; ring: string; darkRing: string }> = {
  blue: { light: "#2256C4", onLight: "#F8FAFD", dark: "#6D9DF6", onDark: "#0E1626", ring: "#2256C4", darkRing: "#6D9DF6" },
  teal: { light: "#1C877E", onLight: "#F6FBFA", dark: "#37BEAD", onDark: "#0A1F1D", ring: "#1C877E", darkRing: "#37BEAD" },
  violet: { light: "#6231C4", onLight: "#FAF8FD", dark: "#A683EE", onDark: "#160E26", ring: "#6231C4", darkRing: "#A683EE" },
  amber: { light: "#BC6E0F", onLight: "#FDFBF6", dark: "#F3A324", onDark: "#211405", ring: "#BC6E0F", darkRing: "#F3A324" },
  // cosmos: harvested from second-brain/poc-graph (brain.askewly.com) knowledge-graph
  // palette — muted navy primary over a near-black ground family (harvest-contract §4, 2026-08-04).
  cosmos: { light: "#3E5F94", onLight: "#F7F9FC", dark: "#6E8FC4", onDark: "#0E1420", ring: "#3E5F94", darkRing: "#6E8FC4" },
}

// Neutral canvases by tone (hex — same parser constraint as above).
type Canvas = { bg: string; fg: string; card: string; muted: string; mutedFg: string; border: string }
const CANVASES: Record<string, { light: Canvas; dark: Canvas; radius: string }> = {
  "minimal-clean": {
    light: { bg: "#F9FAFB", fg: "#171B26", card: "#FFFFFF", muted: "#EDF0F4", mutedFg: "#5C6472", border: "#DEE2E9" },
    dark: { bg: "#0F1219", fg: "#E7EAEF", card: "#14181F", muted: "#1E242E", mutedFg: "#949CA9", border: "#262D3A" },
    radius: "0.5rem",
  },
  "warm-editorial": {
    light: { bg: "#FAF7F1", fg: "#2B241C", card: "#FDFBF7", muted: "#EFEAE1", mutedFg: "#746A5C", border: "#E1DACF" },
    dark: { bg: "#191410", fg: "#EBE5DB", card: "#211B16", muted: "#2B241E", mutedFg: "#A69C8F", border: "#352D25" },
    radius: "0.625rem",
  },
  "dark-technical": {
    light: { bg: "#EFF1F4", fg: "#14181F", card: "#F8F9FB", muted: "#E2E5EA", mutedFg: "#59616D", border: "#D2D6DD" },
    dark: { bg: "#080B12", fg: "#DFE3E9", card: "#0D1119", muted: "#161C26", mutedFg: "#8B93A1", border: "#232B3A" },
    radius: "0.375rem",
  },
}

export async function collectBrief(opts: { yes?: boolean; tone?: string; color?: string; type?: string }): Promise<{ answers: BriefAnswers; assumed: string[] }> {
  const answers = {} as BriefAnswers
  const assumed: string[] = []
  for (const q of BRIEF_QUESTIONS) {
    const injected = opts[q.key]
    if (injected) {
      if (!q.options.includes(injected)) {
        throw new KickstartError(`--${q.key} "${injected}" is not an option — use one of: ${q.options.join(", ")}`)
      }
      answers[q.key] = injected
      continue
    }
    if (opts.yes) {
      answers[q.key] = q.recommended
      assumed.push(q.key)
      continue
    }
    const rl = createInterface({ input: stdin, output: stdout })
    try {
      const menu = q.options.map((o, i) => `  ${i + 1}. ${o}${o === q.recommended ? "  (recommended)" : ""}`).join("\n")
      const raw = (await rl.question(`${q.label}\n${menu}\n> [1-${q.options.length}, Enter = recommended] `)).trim()
      if (raw === "") {
        answers[q.key] = q.recommended
      } else {
        const idx = Number(raw)
        const picked = Number.isInteger(idx) && idx >= 1 && idx <= q.options.length ? q.options[idx - 1] : q.options.includes(raw) ? raw : null
        if (!picked) throw new KickstartError(`"${raw}" is not a valid choice for ${q.key}`)
        answers[q.key] = picked
      }
    } finally {
      rl.close()
    }
  }
  return { answers, assumed }
}

// ---------------------------------------------------------------------------
// DESIGN.md generation — flat-colors form of templates/DESIGN.md.tmpl
// (the form the slide-theme converter already reads; do not invent new keys).
// ---------------------------------------------------------------------------

export function renderDesignMd(project: string, answers: BriefAnswers, assumed: string[]): string {
  const accent = ACCENTS[answers.color]
  const canvas = CANVASES[answers.tone]
  const font = FONT_STACKS[answers.type]
  const date = new Date().toISOString().slice(0, 10)
  const assumedNote = assumed.length > 0
    ? `기본값 채택(추정): ${assumed.join(", ")} — 비대화 실행으로 추천값을 그대로 썼다.`
    : "세 축(tone·color·type) 모두 사용자 답변으로 결정됐다."
  return `---
# 공식 스키마: google-labs-code/design.md spec (version: alpha)
# generated by \`askewly-design init --block\` — tone=${answers.tone} color=${answers.color} type=${answers.type}
name: "${project}"
description: "Kickstart brief: ${answers.tone} tone, ${answers.color} accent, ${answers.type} type."
colors:
  primary: "${accent.light}"
  on-primary: "${accent.onLight}"
  surface: "${canvas.light.bg}"
  on-surface: "${canvas.light.fg}"
  surface-raised: "${canvas.light.card}"
  muted: "${canvas.light.mutedFg}"
  border: "${canvas.light.border}"
typography:
  headline-lg:
    fontFamily: "${font}"
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 1.1
    letterSpacing: -0.03em
  body-md:
    fontFamily: "${font}"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.65
  label-md:
    fontFamily: "${font}"
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px
spacing:
  unit: 4px
  gap: 16px
  container-padding: 24px
  section-margin: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: "{spacing.container-padding}"
---

# ${project} — DESIGN.md

## Overview

Kickstart 축약 브리프 산출물 (block-contract §8). ${assumedNote}
구조·인터랙션 레벨은 블록(saas-app-shell 등)이 결정하므로 묻지 않았다 — 나머지 브리프 영역(콘텐츠·모션 등)은 추천 기본값이며, 바뀌면 이 파일이 정본이다.

## Colors

- 코드에서는 의미 이름(\`surface\`, \`on-surface\`, \`muted\`)만 참조 — 값 하드코딩 금지.
- \`primary\`는 유일한 액센트: CTA·핵심 신호에만. WCAG AA(4.5:1) 통과 필수.

## Typography

- 서체 1종(${answers.type}). 위계는 굵기·크기·색으로만.
- 한글: \`word-break: keep-all\`.

## Do's and Don'ts

- Do: 상태 완비(hover/focus-visible/active/disabled/loading/error), 다크 모드, reduced-motion 분기.
- Don't: 이모지 아이콘, 좌측 컬러 라인 카드, 그라디언트 남발, primary의 비-CTA 사용.

<!-- Changelog: ${date} kickstart 초기화 (축약 브리프 산출) -->
`
}

// ---------------------------------------------------------------------------
// Token derivation — the CSS variable definition layer the block's
// required-CSS-variable list (registry meta.requiredCssVars) is checked against.
// ---------------------------------------------------------------------------

export function renderBrandCss(answers: BriefAnswers): string {
  const a = ACCENTS[answers.color]
  const c = CANVASES[answers.tone]
  const font = FONT_STACKS[answers.type]
  const vars = (m: { bg: string; fg: string; card: string; muted: string; mutedFg: string; border: string }, primary: string, onPrimary: string, ring: string) => `  --background: ${m.bg};
  --foreground: ${m.fg};
  --card: ${m.card};
  --card-foreground: ${m.fg};
  --popover: ${m.card};
  --popover-foreground: ${m.fg};
  --primary: ${primary};
  --primary-foreground: ${onPrimary};
  --secondary: ${m.muted};
  --secondary-foreground: ${m.fg};
  --muted: ${m.muted};
  --muted-foreground: ${m.mutedFg};
  --accent: ${m.muted};
  --accent-foreground: ${m.fg};
  --destructive: hsl(0 72% 45%);
  --destructive-foreground: ${m.card};
  --border: ${m.border};
  --input: ${m.border};
  --ring: ${ring};
  --radius: ${c.radius};
  --sidebar: ${m.bg};
  --sidebar-foreground: ${m.fg};
  --sidebar-primary: ${primary};
  --sidebar-primary-foreground: ${onPrimary};
  --sidebar-accent: ${m.muted};
  --sidebar-accent-foreground: ${m.fg};
  --sidebar-border: ${m.border};
  --sidebar-ring: ${ring};`
  return `/* Generated by \`askewly-design init --block\` from DESIGN.md (tone=${answers.tone}, color=${answers.color}).
 * This file is the project's token definition layer — the block's required
 * CSS variables (block-contract §4/§6) are defined here, nowhere else. */
:root {
  font-family: ${font};
${vars(c.light, a.light, a.onLight, a.ring)}
}

.dark {
${vars(c.dark, a.dark, a.onDark, a.darkRing)}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
`
}

/** Presence-only check (block-contract §8-5): every required var must be *defined* in css. */
export function missingRequiredVars(css: string, required: string[]): string[] {
  return required.filter((name) => !new RegExp(`${name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}\\s*:`).test(css))
}

// ---------------------------------------------------------------------------
// Transplant — direct JSON fetch, recursive registryDependencies resolution
// (entry-protocol A-2.5 mechanics; bare names resolve to shadcn's registry).
// ---------------------------------------------------------------------------

type RegistryFile = { path: string; type: string; target?: string; content: string }
type RegistryItem = {
  name: string
  registryDependencies?: string[]
  dependencies?: string[]
  files?: RegistryFile[]
  meta?: { tier?: string; requiredCssVars?: string[] }
}

async function fetchJson(url: string): Promise<RegistryItem> {
  let res: Response
  try {
    res = await fetch(url)
  } catch (error) {
    throw new KickstartError(`fetch failed: ${url} — ${(error as Error).message}`)
  }
  if (!res.ok) throw new KickstartError(`registry fetch ${res.status}: ${url}`)
  return (await res.json()) as RegistryItem
}

function rewriteImports(content: string): string {
  return content
    .replaceAll(/@\/registry\/[a-z0-9-]+\/hooks\//g, "@/hooks/")
    .replaceAll(/@\/registry\/[a-z0-9-]+\/lib\/utils/g, "@/lib/utils")
    .replaceAll(/@\/registry\/[a-z0-9-]+\/ui\//g, "@/components/ui/")
    .replaceAll(/@\/registry\/[a-z0-9-]+\/blocks\/[a-z0-9-]+\/components\//g, "./")
}

function destFor(file: RegistryFile, srcRoot: string): string {
  if (file.target) return path.join(srcRoot, file.target)
  const p = file.path
  const uiMatch = p.match(/\/ui\/([^/]+)$/)
  if (uiMatch) return path.join(srcRoot, "components", "ui", uiMatch[1])
  const hookMatch = p.match(/\/hooks\/([^/]+)$/)
  if (hookMatch) return path.join(srcRoot, "hooks", hookMatch[1])
  const libMatch = p.match(/\/lib\/([^/]+)$/)
  if (libMatch) return path.join(srcRoot, "lib", libMatch[1])
  return path.join(srcRoot, "components", path.basename(p))
}

export type TransplantResult = {
  written: string[]
  npmDeps: Set<string>
  requiredCssVars: string[]
}

export async function fetchBlock(blockName: string, registryBase: string): Promise<RegistryItem> {
  const block = await fetchJson(`${registryBase}/r/${blockName}.json`)
  if (block.meta?.tier !== "block") {
    throw new KickstartError(`"${blockName}" is not a block-tier asset (meta.tier missing) — see block-contract §1`)
  }
  return block
}

export async function transplantBlock(block: RegistryItem, targetDir: string): Promise<TransplantResult> {
  const srcRoot = existsSync(path.join(targetDir, "src")) ? path.join(targetDir, "src") : targetDir
  const written: string[] = []
  const npmDeps = new Set<string>(["clsx", "tailwind-merge"])
  const visited = new Set<string>()

  async function resolve(item: RegistryItem): Promise<void> {
    for (const dep of item.dependencies ?? []) npmDeps.add(dep.split("@").slice(0, dep.startsWith("@") ? 2 : 1).join("@"))
    for (const ref of item.registryDependencies ?? []) {
      const url = ref.startsWith("http") ? ref : `${SHADCN_BASE}/${ref}.json`
      const key = url
      if (visited.has(key)) continue
      visited.add(key)
      const child = await fetchJson(url)
      await resolve(child)
      for (const file of child.files ?? []) {
        const dest = destFor(file, srcRoot)
        mkdirSync(path.dirname(dest), { recursive: true })
        writeFileSync(dest, rewriteImports(file.content))
        written.push(dest)
      }
    }
  }

  await resolve(block)
  for (const file of block.files ?? []) {
    const dest = destFor(file, srcRoot)
    mkdirSync(path.dirname(dest), { recursive: true })
    writeFileSync(dest, rewriteImports(file.content))
    written.push(dest)
  }

  // cn() — shadcn init would have created it; transplant guarantees it (M18 step-5 friction).
  const utils = path.join(srcRoot, "lib", "utils.ts")
  if (!existsSync(utils)) {
    mkdirSync(path.dirname(utils), { recursive: true })
    writeFileSync(utils, `import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`)
    written.push(utils)
  }

  return { written, npmDeps, requiredCssVars: block.meta?.requiredCssVars ?? [] }
}

// ---------------------------------------------------------------------------
// Orchestrator — brief → DESIGN.md → tokens → transplant → required-var check → verify
// ---------------------------------------------------------------------------

export async function runKickstart(
  dir: string,
  opts: { block: string; yes?: boolean; tone?: string; color?: string; type?: string; registry?: string; force?: boolean },
): Promise<void> {
  const targetDir = path.resolve(dir)
  const registryBase = (opts.registry ?? REGISTRY_BASE).replace(/\/$/, "")
  const designPath = path.join(targetDir, "DESIGN.md")
  if (existsSync(designPath) && !opts.force) {
    throw new KickstartError(`refusing to overwrite ${designPath} (use --force) — an existing DESIGN.md owns the look; kickstart is for blank projects`)
  }

  // 0. fetch the block first — an unknown block name must fail before any file
  //    is written (no half-initialized project on exit 1).
  const block = await fetchBlock(opts.block, registryBase)

  // 1. brief
  const { answers, assumed } = await collectBrief(opts)
  console.log(`brief: tone=${answers.tone} color=${answers.color} type=${answers.type}${assumed.length ? ` (defaults: ${assumed.join(", ")})` : ""}`)

  // 2. DESIGN.md
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(designPath, renderDesignMd(path.basename(targetDir), answers, assumed))
  console.log(`wrote ${designPath}`)

  // 3. token layer
  const srcRoot = existsSync(path.join(targetDir, "src")) ? path.join(targetDir, "src") : targetDir
  const brandCss = renderBrandCss(answers)
  const cssPath = path.join(srcRoot, "askewly-brand.css")
  writeFileSync(cssPath, brandCss)
  console.log(`wrote ${cssPath}`)

  // 4. transplant
  const result = await transplantBlock(block, targetDir)
  console.log(`transplanted ${result.written.length} file(s) from ${registryBase}/r/${opts.block}.json`)

  // 5. required-var check (presence only — values are settled by human eyes)
  const missing = missingRequiredVars(brandCss, result.requiredCssVars)
  if (missing.length > 0) {
    throw new KickstartError(`token layer is missing required CSS variables (block-contract §4): ${missing.join(", ")}`)
  }
  console.log(`required CSS variables: ${result.requiredCssVars.length}/${result.requiredCssVars.length} defined (presence check only — look at the rendered result before shipping)`)

  // 6. verify
  const blockDir = path.join(srcRoot, "components", "blocks", opts.block)
  const { files, violations } = verifyDir(blockDir, ["tsx", "ts", "css"], {})
  if (violations.length > 0) {
    console.error(`verify FAIL — ${violations.length} violation(s) in ${files} file(s) under ${blockDir}`)
    for (const violation of violations) console.error(`  ${violation.file}:${violation.line} [${violation.rule}] ${violation.excerpt}`)
    throw new KickstartError("transplanted block bypasses the token system — fix before continuing")
  }
  console.log(`verify PASS — ${files} block file(s), no color literals`)

  // 7. handoff
  console.log(`\nNext steps:`)
  console.log(`  1. npm i ${[...result.npmDeps].sort().join(" ")}`)
  console.log(`  2. import "./askewly-brand.css" after \`@import "tailwindcss";\` in your global stylesheet`)
  console.log(`  3. render the block: import { SaasAppShell } from "@/components/blocks/${opts.block}/page"`)
  console.log(`  4. wire routing yourself — the block deliberately ships none (block-contract §3)`)
}
