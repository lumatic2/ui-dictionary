// GENERATED from tokens/askewly.tokens.json — do not edit by hand. Regenerate: node apps/agent-design/scripts/generate-editor-tokens.mjs
// All color.semantic tokens define a dark override in the SSOT — no fallbacks were needed.

export type TokenSetId = 'askewly.default' | 'askewly.dark'

/** Neutral background used for canvas nodes with no tokenBindings.background. */
export const FALLBACK_BACKGROUND_TOKEN = 'surface.muted'

export const editorTokenMaps: Record<TokenSetId, Record<string, string>> = {
  'askewly.default': {
    "surface.base": "oklch(0.985 0 0)",
    "surface.raised": "oklch(1 0 0)",
    "surface.overlay": "oklch(1 0 0)",
    "surface.muted": "oklch(0.95 0.015 270)",
    "surface.secondary": "oklch(0.94 0.02 270)",
    "surface.tint": "#B9FAF8",
    "text.default": "oklch(0.16 0.015 270)",
    "text.muted": "oklch(0.46 0.03 270)",
    "text.secondary": "oklch(0.25 0.03 270)",
    "text.on-accent": "oklch(0.985 0 0)",
    "action.primary": "#6F2DBD",
    "action.secondary": "#A663CC",
    "action.destructive": "oklch(0.58 0.22 27)",
    "accent.base": "#B9FAF8",
    "accent.foreground": "oklch(0.16 0.015 270)",
    "border.default": "oklch(0.88 0.015 270)",
    "border.input": "oklch(0.88 0.015 270)",
    "border.focus": "#6F2DBD",
    "border.accent": "#B298DC"
  },
  'askewly.dark': {
    "surface.base": "oklch(0.16 0.015 270)",
    "surface.raised": "oklch(0.25 0.03 270)",
    "surface.overlay": "oklch(0.25 0.03 270)",
    "surface.muted": "oklch(0.35 0.03 270)",
    "surface.secondary": "oklch(0.35 0.03 270)",
    "surface.tint": "oklch(0.35 0.03 270)",
    "text.default": "oklch(0.985 0 0)",
    "text.muted": "oklch(0.72 0.02 270)",
    "text.secondary": "oklch(0.95 0.015 270)",
    "text.on-accent": "oklch(0.16 0.015 270)",
    "action.primary": "oklch(0.985 0 0)",
    "action.secondary": "#B9FAF8",
    "action.destructive": "oklch(0.58 0.22 27)",
    "accent.base": "oklch(0.35 0.03 270)",
    "accent.foreground": "oklch(0.985 0 0)",
    "border.default": "oklch(0.35 0.03 270)",
    "border.input": "oklch(0.35 0.03 270)",
    "border.focus": "#B298DC",
    "border.accent": "#A663CC"
  },
}
