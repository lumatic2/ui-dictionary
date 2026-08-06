import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { aliasStep, blockExportName, detectPathAlias, importedPackages, missingRequiredVars, renderBrandCss } from "../src/kickstart.js"

// M28 step-2. The registry's declared `dependencies` is a lower bound —
// shadcn's button.json declares only `radix-ui` while button.tsx imports
// class-variance-authority, and following the printed `npm i` broke the first
// fresh build (M27). These cases pin the two derivations that replaced it.
describe("importedPackages", () => {
  it("finds the dependency the registry failed to declare", () => {
    const source = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
`
    expect(importedPackages(source).sort()).toEqual(["class-variance-authority", "radix-ui", "react"])
  })

  it("ignores relative paths and the project alias", () => {
    const source = `import { Hero } from "./hero-section"
import data from "../data.json"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
`
    expect(importedPackages(source)).toEqual([])
  })

  it("folds subpaths onto the installed package name", () => {
    const source = `import { Slot } from "radix-ui/react-slot"
import { motion } from "@scope/pkg/dist/esm"
`
    expect(importedPackages(source).sort()).toEqual(["@scope/pkg", "radix-ui"])
  })

  it("catches type-only, side-effect, re-export, dynamic and require forms", () => {
    const source = `import type { Config } from "tailwindcss"
import "recharts/styles.css"
export { Chart } from "victory"
const lazy = () => import("embla-carousel-react")
const legacy = require("clsx")
`
    expect(importedPackages(source).sort()).toEqual([
      "clsx",
      "embla-carousel-react",
      "recharts",
      "tailwindcss",
      "victory",
    ])
  })

  it("does not report node builtins as packages to install", () => {
    const source = `import fs from "node:fs"
import path from "path"
import { z } from "zod"
`
    expect(importedPackages(source)).toEqual(["zod"])
  })
})

// M29 step-4. The token layer defines `.dark { … }`, but Tailwind v4 keys
// `dark:` utilities off prefers-color-scheme unless told otherwise — and the
// transplanted shadcn primitives (button, badge, tabs, select, input, switch,
// checkbox, dropdown-menu) all carry `dark:` utilities. Without the variant
// line the two halves of dark mode run off different switches.
describe("renderBrandCss dark switch", () => {
  const css = renderBrandCss({ tone: "minimal-clean", color: "teal", type: "system-sans" })

  it("registers the class-based dark variant", () => {
    expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *))")
  })

  it("declares the variant before the token blocks that depend on it", () => {
    expect(css.indexOf("@custom-variant")).toBeLessThan(css.indexOf(":root {"))
    expect(css.indexOf("@custom-variant")).toBeLessThan(css.indexOf(".dark {"))
  })

  // Tokens only repaint what we draw. Scrollbars, native selects and the
  // overscroll gutter are the browser's, and they stay light without this.
  it("tells the browser which scheme each block is", () => {
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"))
    const dark = css.slice(css.indexOf(".dark {"))
    expect(root).toContain("color-scheme: light;")
    expect(dark).toContain("color-scheme: dark;")
  })
})

describe("blockExportName", () => {
  it("picks the page export, not the demo wrapper", () => {
    const source = `export function MarketingLandingPage() { return null }
export function MarketingLandingDemo() { return null }
`
    expect(blockExportName(source)).toBe("MarketingLandingPage")
  })

  it("reads past a leading demo export", () => {
    const source = `export function SaasAppShellDemo() { return null }
export function SaasAppShell({ defaultView = "dashboard" }) { return null }
`
    expect(blockExportName(source)).toBe("SaasAppShell")
  })

  it("returns null rather than inventing a symbol", () => {
    expect(blockExportName(`export default function () { return null }\n`)).toBeNull()
    expect(blockExportName(`export const Page = () => null\n`)).toBeNull()
  })
})

// M29 step-1. The printed handoff told readers to import through `@/…` without
// ever saying how that alias comes to exist — six `tsc -b` errors on a stock
// vite react-ts project, hand-patched in both M28 E2E runs.
describe("detectPathAlias", () => {
  const project = (files: Record<string, string>): string => {
    const dir = mkdtempSync(path.join(tmpdir(), "askewly-alias-"))
    for (const [name, content] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(dir, name)), { recursive: true })
      writeFileSync(path.join(dir, name), content)
    }
    return dir
  }

  it("reports both halves missing on a stock vite react-ts project", () => {
    const dir = project({
      "tsconfig.json": `{ "files": [], "references": [{ "path": "./tsconfig.app.json" }] }`,
      "tsconfig.app.json": `{ "compilerOptions": { "target": "ES2022", "jsx": "react-jsx" } }`,
      "vite.config.ts": `import { defineConfig } from "vite"\nexport default defineConfig({ plugins: [] })\n`,
    })
    // Names the file that owns compilerOptions — paths in the solution file is ignored by `tsc -b`.
    expect(detectPathAlias(dir)).toEqual({ tsconfig: "tsconfig.app.json", vite: false })
  })

  it("stays quiet once both halves are configured", () => {
    const dir = project({
      "tsconfig.json": `{ "files": [], "references": [{ "path": "./tsconfig.app.json" }] }`,
      "tsconfig.app.json": `{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }`,
      "vite.config.ts": `export default { resolve: { alias: { "@": "/src" } } }\n`,
    })
    expect(detectPathAlias(dir)).toEqual({ tsconfig: null, vite: true })
    expect(aliasStep(detectPathAlias(dir), "./src")).toBeNull()
  })

  it("does not read a commented-out alias as configured", () => {
    const dir = project({
      "tsconfig.json": `{
  "compilerOptions": {
    // "paths": { "@/*": ["./src/*"] }
    "target": "ES2022"
  }
}`,
      "vite.config.ts": `export default {\n  /* resolve: { alias: { "@": "/src" } } */\n  plugins: [],\n}\n`,
    })
    expect(detectPathAlias(dir)).toEqual({ tsconfig: "tsconfig.json", vite: false })
  })

  it("accepts the vite-tsconfig-paths plugin as the vite half", () => {
    const dir = project({
      "tsconfig.app.json": `{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }`,
      "vite.config.ts": `import tsconfigPaths from "vite-tsconfig-paths"\nexport default { plugins: [tsconfigPaths()] }\n`,
    })
    expect(detectPathAlias(dir)).toEqual({ tsconfig: null, vite: true })
  })

  it("asks for tsconfig only when vite alone already resolves @", () => {
    const dir = project({
      "tsconfig.app.json": `{ "compilerOptions": { "target": "ES2022" } }`,
      "vite.config.ts": `export default { resolve: { alias: { "@": "/src" } } }\n`,
    })
    const status = detectPathAlias(dir)
    expect(status).toEqual({ tsconfig: "tsconfig.app.json", vite: true })
    const step = aliasStep(status, "./src")
    expect(step).toContain("tsconfig.app.json")
    expect(step).not.toContain("vite.config.ts")
  })

  it("points the snippet at where the block was actually written", () => {
    const step = aliasStep({ tsconfig: "tsconfig.json", vite: false }, ".")
    expect(step).toContain(`"@/*": ["./*"]`)
    expect(step).toContain(`new URL(".", import.meta.url)`)
    // TS 6 fails the build on `baseUrl` (TS5101) — measured, not assumed.
    expect(step).not.toContain("baseUrl")
    // No new npm dependency is recommended — the printed `npm i` list stays
    // "what the transplanted files import" (M28 contract).
    expect(step).not.toContain("vite-tsconfig-paths")
  })
})

describe("scrim in the transplanted token layer", () => {
  const css = renderBrandCss({ tone: "minimal-clean", color: "teal", type: "system-sans" })

  it("defines --scrim once, outside the light/dark pair", () => {
    // A scrim means "press the background down". Keyed off --foreground it
    // inverts in dark mode and the backdrop gets brighter than the page.
    expect(css.match(/--scrim:/g)).toHaveLength(1)
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"))
    expect(root).toContain("--scrim:")
  })

  it("maps --scrim into @theme inline so bg-scrim is actually generated", () => {
    // Measured, not assumed: without this line Tailwind silently drops the
    // utility and the build still exits 0 — the backdrop just goes transparent.
    expect(css).toContain("--color-scrim: var(--scrim);")
  })

  it("is caught by the required-var check when the token layer omits it", () => {
    expect(missingRequiredVars(css, ["--scrim"])).toEqual([])
    expect(missingRequiredVars(css.replace(/\s*--scrim:[^;]+;/, ""), ["--scrim"])).toEqual(["--scrim"])
  })
})

// M32. The transitive collection in transplantBlock (kickstart.ts:578) was
// wired in M31 but never observed firing: the live block's child assets carry
// no declaration of their own, so the union equals the block's own list and a
// count proves nothing. This fixture makes a child declare a variable the
// parent does not, which is the only shape that distinguishes "collected
// transitively" from "read off the top level".
describe("transitive requiredCssVars collection", () => {
  const child = {
    name: "child-asset",
    meta: { requiredCssVars: ["--child-only"] },
    files: [{ path: "registry/askewly/child-asset/child-asset.tsx", type: "registry:component", content: "export const Child = () => null\n" }],
  }
  const parent = {
    name: "parent-block",
    meta: { tier: "block", requiredCssVars: ["--parent-only"] },
    registryDependencies: ["https://ui.askewly.com/r/child-asset.json"],
    files: [{ path: "registry/askewly/parent-block/page.tsx", type: "registry:component", content: "export default function Page() { return null }\n" }],
  }

  async function collect(childItem: unknown): Promise<string[]> {
    const original = globalThis.fetch
    globalThis.fetch = (async () =>
      new Response(JSON.stringify(childItem), { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch
    try {
      const dir = mkdtempSync(path.join(tmpdir(), "askewly-transitive-"))
      const { transplantBlock } = await import("../src/kickstart.js")
      const result = await transplantBlock(parent as never, dir)
      return result.requiredCssVars.sort()
    } finally {
      globalThis.fetch = original
    }
  }

  it("collects a variable only the child declares", async () => {
    expect(await collect(child)).toEqual(["--child-only", "--parent-only"])
  })

  it("loses that variable when the child stops declaring it", async () => {
    // The negative half: if this still returned --child-only, the collection
    // would be reading something other than the child's meta.
    expect(await collect({ ...child, meta: {} })).toEqual(["--parent-only"])
  })
})

// M32. Every variable the registry now *measures* as required must be
// definable by the layer kickstart writes. A required variable the brand CSS
// never emits is a transplant that loses its color — the exact M31 failure.
describe("brand CSS covers what the registry requires", () => {
  const css = renderBrandCss({ tone: "minimal-clean", color: "violet", type: "system-sans" })
  // Measured union across all 57 registry items (scripts/generate-registry.mjs --print-measured, 2026-08-06).
  const MEASURED_UNION = [
    "--accent", "--accent-foreground", "--background", "--border", "--card", "--card-foreground",
    "--destructive", "--foreground", "--input", "--muted", "--muted-foreground", "--popover",
    "--popover-foreground", "--primary", "--primary-foreground", "--radius", "--ring", "--scrim",
  ]

  it("defines every measured variable", () => {
    expect(missingRequiredVars(css, MEASURED_UNION)).toEqual([])
  })

  // --askewly-violet is deliberately absent from the list above: it is this
  // site's own brand token, and color-palette-generator asks for it via
  // `ring-askewly-violet`. A consumer project has no such variable, so that
  // asset's focus ring falls back to transparent. Left as a finding — M32
  // does not change transplanted file contents.
  it("does not define the site-only brand token (documented gap)", () => {
    expect(missingRequiredVars(css, ["--askewly-violet"])).toEqual(["--askewly-violet"])
  })
})

// M32. Upstream shadcn primitives cannot carry our `requiredCssVars` field —
// they are fetched from ui.shadcn.com and we do not own that JSON, so the 21
// primitives our registry pulls are structurally outside the declaration
// check. That is only safe if the brand CSS defines what they need. Measured
// 2026-08-06 by running the registry extractor over all 21 upstream items:
// 27 variables, of which 2 are injected by Radix at runtime.
describe("upstream shadcn primitives stay inside the token layer", () => {
  const css = renderBrandCss({ tone: "minimal-clean", color: "violet", type: "system-sans" })
  const UPSTREAM_MEASURED = [
    "--accent", "--accent-foreground", "--background", "--border", "--card", "--card-foreground",
    "--destructive", "--foreground", "--input", "--muted", "--muted-foreground", "--popover",
    "--popover-foreground", "--primary", "--primary-foreground", "--radius", "--ring",
    "--secondary", "--secondary-foreground", "--sidebar", "--sidebar-accent",
    "--sidebar-accent-foreground", "--sidebar-border", "--sidebar-foreground", "--sidebar-ring",
  ]

  it("defines every variable the 21 upstream primitives use", () => {
    // Zero missing is what makes the uncheckable dependency safe. If this ever
    // fails, the fix is a baseline set in the CLI, not a declaration upstream.
    expect(missingRequiredVars(css, UPSTREAM_MEASURED)).toEqual([])
  })

  it("leaves Radix's own runtime variables alone", () => {
    // --radix-select-trigger-{height,width} are written by Radix on the element;
    // defining them in the token layer would fight the library.
    expect(missingRequiredVars(css, ["--radix-select-trigger-height"])).toEqual(["--radix-select-trigger-height"])
  })
})
