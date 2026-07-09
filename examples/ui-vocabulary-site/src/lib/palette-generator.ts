export type PaletteColor = {
  hex: string
  name: string
}

export type GeneratorColor = PaletteColor & {
  id: string
  locked: boolean
}

export type PaletteSeed = {
  id: string
  name: string
  note: string
  colors: PaletteColor[]
}

type GeneratePaletteOptions = {
  current: GeneratorColor[]
  seedIndex: number
}

const colorNames = [
  "Anchor",
  "Field",
  "Accent",
  "Signal",
  "Wash",
  "Ink",
  "Mist",
]

export const paletteSeedLibrary: PaletteSeed[] = [
  {
    id: "soft-product",
    name: "Soft Product",
    note: "Pastel interface palette tuned for onboarding, empty states, and friendly product surfaces.",
    colors: [
      { hex: "#FF99C8", name: "Baby Pink" },
      { hex: "#FCF6BD", name: "Lemon Chiffon" },
      { hex: "#D0F4DE", name: "Frosted Mint" },
      { hex: "#A9DEF9", name: "Icy Blue" },
      { hex: "#E4C1F9", name: "Mauve" },
    ],
  },
  {
    id: "ops-calm",
    name: "Ops Calm",
    note: "Muted green and stone hues for dense dashboards and operational states.",
    colors: [
      { hex: "#12130F", name: "Onyx" },
      { hex: "#5B9279", name: "Viridian" },
      { hex: "#8FCB9B", name: "Mint Leaf" },
      { hex: "#EAE6E5", name: "Soft Ash" },
      { hex: "#8F8073", name: "Taupe" },
    ],
  },
  {
    id: "commerce-warmth",
    name: "Commerce Warmth",
    note: "Warm conversion palette with dark grounding and high-energy merchandising accents.",
    colors: [
      { hex: "#12130F", name: "Onyx" },
      { hex: "#FBBA72", name: "Apricot" },
      { hex: "#CA5310", name: "Burnt Orange" },
      { hex: "#BB4D00", name: "Copper" },
      { hex: "#8F250C", name: "Russet" },
    ],
  },
  {
    id: "agent-violet",
    name: "Agent Violet",
    note: "Askewly-adjacent violet and cyan contrast for agent tools and technical landing surfaces.",
    colors: [
      { hex: "#102A33", name: "Deep Ink" },
      { hex: "#6F2DBD", name: "Violet" },
      { hex: "#A663CC", name: "Orchid" },
      { hex: "#B9FAF8", name: "Mint" },
      { hex: "#F8FAFC", name: "Cloud" },
    ],
  },
  {
    id: "editorial-natural",
    name: "Editorial Natural",
    note: "Editorial neutral set for long-form docs, references, and quieter marketing sections.",
    colors: [
      { hex: "#1C1C1C", name: "Carbon" },
      { hex: "#E7CBA9", name: "Canvas" },
      { hex: "#C6D8AF", name: "Sage" },
      { hex: "#8AA399", name: "Sea Glass" },
      { hex: "#F4F1DE", name: "Parchment" },
    ],
  },
  {
    id: "mobile-signal",
    name: "Mobile Signal",
    note: "Compact mobile palette with crisp system blues, status greens, and soft UI neutrals.",
    colors: [
      { hex: "#0F172A", name: "Slate Ink" },
      { hex: "#2563EB", name: "Action Blue" },
      { hex: "#22C55E", name: "Success Green" },
      { hex: "#E0F2FE", name: "Sky Wash" },
      { hex: "#F8FAFC", name: "Cloud" },
    ],
  },
  {
    id: "saas-focus",
    name: "SaaS Focus",
    note: "Focused B2B surface palette with restrained neutrals and one legible accent lane.",
    colors: [
      { hex: "#111827", name: "Work Ink" },
      { hex: "#374151", name: "Panel Gray" },
      { hex: "#4F46E5", name: "Focus Indigo" },
      { hex: "#A7F3D0", name: "Status Mint" },
      { hex: "#F9FAFB", name: "Canvas White" },
    ],
  },
  {
    id: "fintech-trust",
    name: "Fintech Trust",
    note: "Navy and gold trust palette for banking, payments, and investment dashboards.",
    colors: [
      { hex: "#0B1D33", name: "Deep Navy" },
      { hex: "#1B3A63", name: "Ledger Blue" },
      { hex: "#C9A24B", name: "Vault Gold" },
      { hex: "#E8ECF1", name: "Statement Gray" },
      { hex: "#FFFFFF", name: "Paper White" },
    ],
  },
  {
    id: "wellness-calm",
    name: "Wellness Calm",
    note: "Soft sage and lavender palette for health, mindfulness, and wellness apps.",
    colors: [
      { hex: "#2F3E33", name: "Forest Ink" },
      { hex: "#8FB39B", name: "Sage" },
      { hex: "#C9D6C0", name: "Meadow Mist" },
      { hex: "#D8CCE8", name: "Lavender" },
      { hex: "#F6F4EF", name: "Oat Cream" },
    ],
  },
  {
    id: "gaming-neon",
    name: "Gaming Neon",
    note: "Dark-ground neon palette for gaming HUDs, streaming overlays, and esports brands.",
    colors: [
      { hex: "#0A0A12", name: "Void Black" },
      { hex: "#FF2E63", name: "Plasma Pink" },
      { hex: "#08D9D6", name: "Cyber Cyan" },
      { hex: "#F8F32B", name: "Bolt Yellow" },
      { hex: "#252A34", name: "Console Gray" },
    ],
  },
  {
    id: "enterprise-slate",
    name: "Enterprise Slate",
    note: "Grayscale enterprise palette with a single restrained accent for admin tools.",
    colors: [
      { hex: "#1E2530", name: "Charcoal" },
      { hex: "#3E4757", name: "Slate" },
      { hex: "#8B93A1", name: "Ash Gray" },
      { hex: "#D8DCE3", name: "Fog" },
      { hex: "#2E6B8A", name: "Enterprise Teal" },
    ],
  },
  {
    id: "creator-warm",
    name: "Creator Warm",
    note: "Warm coral and cream palette for creator-economy landing pages and profiles.",
    colors: [
      { hex: "#2B1B17", name: "Espresso" },
      { hex: "#FF6F59", name: "Coral" },
      { hex: "#FFB84C", name: "Marigold" },
      { hex: "#FFE8D1", name: "Cream" },
      { hex: "#FDF6EC", name: "Linen" },
    ],
  },
  {
    id: "dataviz-categorical",
    name: "Data Viz Categorical",
    note: "Distinct hues tuned for chart series and categorical data visualization.",
    colors: [
      { hex: "#1F2937", name: "Axis Ink" },
      { hex: "#2563EB", name: "Series Blue" },
      { hex: "#F97316", name: "Series Orange" },
      { hex: "#10B981", name: "Series Green" },
      { hex: "#A855F7", name: "Series Purple" },
    ],
  },
]

export function getPaletteSeed(seedIndex: number) {
  return paletteSeedLibrary[seedIndex % paletteSeedLibrary.length] ?? paletteSeedLibrary[0]
}

export function createGeneratorPalette(seedIndex = 0) {
  const seed = getPaletteSeed(seedIndex)
  return seed.colors.map((color, index) => createGeneratorColor(color, `initial-${index}-${color.hex}`))
}

export function createGeneratorColor(color: PaletteColor, id: string): GeneratorColor {
  return { ...color, id, locked: false }
}

export function generatePaletteFromSeed({ current, seedIndex }: GeneratePaletteOptions) {
  const lockedHexes = new Set(current.filter((color) => color.locked).map((color) => normalizeHex(color.hex)))
  const nextSeed = getPaletteSeed(seedIndex)
  const candidates = buildCandidatePool(seedIndex, lockedHexes)
  const usedHexes = new Set(lockedHexes)
  let cursor = 0

  const colors = current.map((color, index) => {
    if (color.locked) return color
    const candidate = pickReadableCandidate(candidates, usedHexes, cursor, index, nextSeed)
    cursor += 1
    usedHexes.add(normalizeHex(candidate.hex))
    return { ...candidate, id: color.id, locked: false }
  })

  return {
    colors,
    seed: nextSeed,
    quality: buildPaletteQuality(colors),
  }
}

export function getNextPaletteCandidate(seedIndex: number, existingHexes: string[]) {
  const usedHexes = new Set(existingHexes.map(normalizeHex))
  const candidates = buildCandidatePool(seedIndex, usedHexes)
  return candidates.find((color) => !usedHexes.has(normalizeHex(color.hex))) ?? getPaletteSeed(seedIndex).colors[0] ?? { hex: "#F8FAFC", name: "Cloud" }
}

export function buildPaletteQuality(colors: PaletteColor[]) {
  const uniqueHexes = new Set(colors.map((color) => normalizeHex(color.hex)))
  const lowContrastCount = colors.filter((color) => getReadableTextContrast(color.hex) < 4.5).length
  return {
    duplicateCount: colors.length - uniqueHexes.size,
    lowContrastCount,
    exportStable: colors.every((color) => /^#[0-9A-F]{6}$/.test(normalizeHex(color.hex))),
  }
}

export function normalizeHex(hex: string) {
  return hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`
}

function buildCandidatePool(seedIndex: number, lockedHexes: Set<string>) {
  const seed = getPaletteSeed(seedIndex)
  const adjacentSeed = getPaletteSeed(seedIndex + 1)
  const generated = seed.colors.flatMap((color, index) => buildHarmonyCandidates(color, index, seedIndex))
  return [...seed.colors, ...generated, ...adjacentSeed.colors].filter((color) => !lockedHexes.has(normalizeHex(color.hex)))
}

function pickReadableCandidate(candidates: PaletteColor[], usedHexes: Set<string>, cursor: number, index: number, seed: PaletteSeed) {
  const candidate = candidates.find((color, candidateIndex) => candidateIndex >= cursor && !usedHexes.has(normalizeHex(color.hex)) && getReadableTextContrast(color.hex) >= 4.5)
  if (candidate) return candidate

  const fallback = candidates.find((color) => !usedHexes.has(normalizeHex(color.hex))) ?? seed.colors[index % seed.colors.length]
  if (fallback && !usedHexes.has(normalizeHex(fallback.hex))) return fallback

  return buildHarmonyCandidates(seed.colors[index % seed.colors.length] ?? seed.colors[0], index, cursor)[0]
}

function buildHarmonyCandidates(color: PaletteColor, index: number, seedIndex: number) {
  const hsv = hexToHsv(color.hex)
  const offsets = [28, -34, 148, -156]
  return offsets.map((offset, offsetIndex) => {
    const valueShift = ((seedIndex + index + offsetIndex) % 3) * 5
    const nextHex = hsvToHex(hsv.h + offset, Math.max(34, Math.min(88, hsv.s + offsetIndex * 4 - 6)), Math.max(34, Math.min(96, hsv.v - valueShift)))
    return {
      hex: nextHex,
      name: `${colorNames[(index + offsetIndex) % colorNames.length]} ${offsetIndex + 1}`,
    }
  })
}

function getReadableTextContrast(hex: string) {
  const whiteContrast = getContrastRatio(hex, "#F8FAFC")
  const darkContrast = getContrastRatio(hex, "#111827")
  return Math.max(whiteContrast, darkContrast)
}

function getContrastRatio(hexA: string, hexB: string) {
  const a = getRelativeLuminance(hexA)
  const b = getRelativeLuminance(hexB)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

function getRelativeLuminance(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const channels = [red, green, blue].map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex).replace("#", "")
  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  }
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((channel) => clampNumber(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function hexToHsv(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const hue =
    delta === 0 ? 0 :
    max === r ? 60 * (((g - b) / delta) % 6) :
    max === g ? 60 * ((b - r) / delta + 2) :
    60 * ((r - g) / delta + 4)

  return {
    h: (hue + 360) % 360,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  }
}

function hsvToHex(hue: number, saturation: number, value: number) {
  const h = ((hue % 360) + 360) % 360
  const s = clampNumber(saturation, 0, 100) / 100
  const v = clampNumber(value, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] :
    [c, 0, x]

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
