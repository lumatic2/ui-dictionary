import { describe, expect, it } from "vitest"
import { blockExportName, importedPackages } from "../src/kickstart.js"

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
