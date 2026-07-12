#!/usr/bin/env node
// Generates derived editor-chrome + canvas-rendering artifacts from the repo-root
// token SSOT (tokens/askewly.tokens.json):
//   (a) apps/agent-design/src/editorTokens.css - CSS custom properties (--ad-*)
//       consumed by styles.css for editor chrome. :root defines the light
//       (askewly.default) values; a `.app-shell[data-ad-mode="dark"]` override
//       block redefines the semantic tier with dark values. App.tsx sets
//       data-ad-mode from the same document.tokenSetId the canvas token-mode
//       toggle already drives, so one control themes both canvas and chrome.
//   (b) apps/agent-design/src/editorTokens.ts - a TS map of resolved hex colors
//       per token-set id ('askewly.default' | 'askewly.dark'), keyed by the same
//       dotted semantic token names used in CanvasNode.tokenBindings (e.g.
//       'surface.muted'), consumed by CanvasSurface to render canvas nodes.
//
// Usage: node scripts/generate-editor-tokens.mjs (run from apps/agent-design/)

import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { loadTokens, getNode, resolveModeLiteral, colorValueToCss, walkLeaves } from "../../../scripts/lib/token-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const TOKENS_PATH = path.join(REPO_ROOT, "tokens", "askewly.tokens.json");
const CSS_OUT_PATH = path.resolve(__dirname, "..", "src", "editorTokens.css");
const TS_OUT_PATH = path.resolve(__dirname, "..", "src", "editorTokens.ts");

const root = loadTokens(TOKENS_PATH);

// ---------------------------------------------------------------------------
// (a) editorTokens.css - editor chrome (styles.css) semantic + primitive vars
// ---------------------------------------------------------------------------

// Semantic tier: the tokens editor chrome (app shell, panels, toolbars) should
// reference. Mirrors color.semantic.* 1:1 for every group defined in the SSOT.
const SEMANTIC_COLOR_MAPPINGS = [
  ["--ad-surface-base", "color.semantic.surface.base"],
  ["--ad-surface-raised", "color.semantic.surface.raised"],
  ["--ad-surface-overlay", "color.semantic.surface.overlay"],
  ["--ad-surface-muted", "color.semantic.surface.muted"],
  ["--ad-surface-secondary", "color.semantic.surface.secondary"],
  ["--ad-surface-tint", "color.semantic.surface.tint"],
  ["--ad-text-default", "color.semantic.text.default"],
  ["--ad-text-muted", "color.semantic.text.muted"],
  ["--ad-text-secondary", "color.semantic.text.secondary"],
  ["--ad-text-on-accent", "color.semantic.text.on-accent"],
  ["--ad-action-primary", "color.semantic.action.primary"],
  ["--ad-action-secondary", "color.semantic.action.secondary"],
  ["--ad-action-destructive", "color.semantic.action.destructive"],
  ["--ad-accent-base", "color.semantic.accent.base"],
  ["--ad-accent-foreground", "color.semantic.accent.foreground"],
  ["--ad-border-default", "color.semantic.border.default"],
  ["--ad-border-input", "color.semantic.border.input"],
  ["--ad-border-focus", "color.semantic.border.focus"],
  ["--ad-border-accent", "color.semantic.border.accent"],
];

// Primitive tier: mode-independent values. Used for (1) chrome surfaces that
// deliberately stay dark regardless of document.tokenSetId (the inspector
// panel, styled like a fixed dark dev-tool panel), and (2) canvas diagnostic
// accents (selection/drop-target/node-kind borders) that reference brand hues
// directly rather than a mode-dependent semantic role.
const PRIMITIVE_COLOR_MAPPINGS = [
  ["--ad-white", "color.primitive.white"],
  ["--ad-gray-1", "color.primitive.gray.1"],
  ["--ad-gray-2", "color.primitive.gray.2"],
  ["--ad-gray-3", "color.primitive.gray.3"],
  ["--ad-gray-4", "color.primitive.gray.4"],
  ["--ad-gray-5", "color.primitive.gray.5"],
  ["--ad-gray-6", "color.primitive.gray.6"],
  ["--ad-gray-7", "color.primitive.gray.7"],
  ["--ad-gray-8", "color.primitive.gray.8"],
  ["--ad-gray-9", "color.primitive.gray.9"],
  ["--ad-gray-10", "color.primitive.gray.10"],
  ["--ad-gray-11", "color.primitive.gray.11"],
  ["--ad-gray-12", "color.primitive.gray.12"],
  ["--ad-brand-violet", "color.primitive.askewly.violet"],
  ["--ad-brand-orchid", "color.primitive.askewly.orchid"],
  ["--ad-brand-lavender", "color.primitive.askewly.lavender"],
  ["--ad-brand-sky", "color.primitive.askewly.sky"],
  ["--ad-brand-mint", "color.primitive.askewly.mint"],
  ["--ad-red-9", "color.primitive.red.9"],
];

const RADIUS_MAPPINGS = [
  ["--ad-radius-sm", "dimension.radius.sm"],
  ["--ad-radius-md", "dimension.radius.md"],
  ["--ad-radius-lg", "dimension.radius.lg"],
  ["--ad-radius-xl", "dimension.radius.xl"],
];

const SPACE_MAPPINGS = [
  ["--ad-space-1", "dimension.space.1"],
  ["--ad-space-2", "dimension.space.2"],
  ["--ad-space-4", "dimension.space.4"],
  ["--ad-space-8", "dimension.space.8"],
  ["--ad-space-12", "dimension.space.12"],
  ["--ad-space-16", "dimension.space.16"],
];

const FONT_SIZE_MAPPINGS = [
  ["--ad-font-size-sm", "typography.scale.sm"],
  ["--ad-font-size-base", "typography.scale.base"],
  ["--ad-font-size-lg", "typography.scale.lg"],
  ["--ad-font-size-xl", "typography.scale.xl"],
  ["--ad-font-size-2xl", "typography.scale.2xl"],
];

const FONT_WEIGHT_MAPPINGS = [
  ["--ad-font-weight-regular", "typography.weight.regular"],
  ["--ad-font-weight-medium", "typography.weight.medium"],
];

const FONT_FAMILY_MAPPINGS = [
  ["--ad-font-sans", "typography.font.sans"],
  ["--ad-font-mono", "typography.font.mono"],
];

function formatDimension(raw) {
  return `${raw.value}${raw.unit}`;
}

function buildEditorTokensCss() {
  const lines = [];
  lines.push(
    "/* GENERATED from tokens/askewly.tokens.json — do not edit by hand. Regenerate: node apps/agent-design/scripts/generate-editor-tokens.mjs */",
  );
  lines.push(
    "/* :root holds light-mode (askewly.default) values. The .app-shell[data-ad-mode=\"dark\"] block below overrides the semantic tier with askewly.dark values; App.tsx sets data-ad-mode from document.tokenSetId. */",
  );
  lines.push(":root {");
  for (const [cssVar, tokenPath] of SEMANTIC_COLOR_MAPPINGS) {
    lines.push(`  ${cssVar}: ${colorValueToCss(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  for (const [cssVar, tokenPath] of PRIMITIVE_COLOR_MAPPINGS) {
    lines.push(`  ${cssVar}: ${colorValueToCss(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  for (const [cssVar, tokenPath] of RADIUS_MAPPINGS) {
    lines.push(`  ${cssVar}: ${formatDimension(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  for (const [cssVar, tokenPath] of SPACE_MAPPINGS) {
    lines.push(`  ${cssVar}: ${formatDimension(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  for (const [cssVar, tokenPath] of FONT_SIZE_MAPPINGS) {
    lines.push(`  ${cssVar}: ${formatDimension(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  for (const [cssVar, tokenPath] of FONT_WEIGHT_MAPPINGS) {
    lines.push(`  ${cssVar}: ${resolveModeLiteral(root, tokenPath, "light")};`);
  }
  for (const [cssVar, tokenPath] of FONT_FAMILY_MAPPINGS) {
    const fam = resolveModeLiteral(root, tokenPath, "light");
    const css = (Array.isArray(fam) ? fam : [fam]).map((f) => (/[ ]/.test(f) ? `"${f}"` : f)).join(", ");
    lines.push(`  ${cssVar}: ${css};`);
  }
  lines.push("}");
  lines.push("");
  lines.push('.app-shell[data-ad-mode="dark"] {');
  for (const [cssVar, tokenPath] of SEMANTIC_COLOR_MAPPINGS) {
    lines.push(`  ${cssVar}: ${colorValueToCss(resolveModeLiteral(root, tokenPath, "dark"))};`);
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// (b) editorTokens.ts - canvas node token-binding resolution map
// ---------------------------------------------------------------------------

function buildSemanticColorMap(mode) {
  const map = {};
  walkLeaves(getNode(root, "color.semantic"), [], (leafPath) => {
    map[leafPath] = colorValueToCss(resolveModeLiteral(root, `color.semantic.${leafPath}`, mode));
  });
  return map;
}

function buildEditorTokensTs() {
  const defaultMap = buildSemanticColorMap("light");
  const darkMap = buildSemanticColorMap("dark");

  // Report which semantic tokens have no explicit dark override (they fall
  // back to their light value in darkMap, per AI plan decision log).
  const noDarkOverride = [];
  walkLeaves(getNode(root, "color.semantic"), [], (leafPath) => {
    const node = getNode(root, `color.semantic.${leafPath}`);
    if (node?.$extensions?.["com.askewly.modes"]?.dark === undefined) noDarkOverride.push(leafPath);
  });

  const lines = [];
  lines.push(
    "// GENERATED from tokens/askewly.tokens.json — do not edit by hand. Regenerate: node apps/agent-design/scripts/generate-editor-tokens.mjs",
  );
  if (noDarkOverride.length) {
    lines.push(`// Semantic tokens with no dark override (fell back to light value in 'askewly.dark'): ${noDarkOverride.join(", ")}`);
  } else {
    lines.push("// All color.semantic tokens define a dark override in the SSOT — no fallbacks were needed.");
  }
  lines.push("");
  lines.push("export type TokenSetId = 'askewly.default' | 'askewly.dark'");
  lines.push("");
  lines.push("/** Neutral background used for canvas nodes with no tokenBindings.background. */");
  lines.push("export const FALLBACK_BACKGROUND_TOKEN = 'surface.muted'");
  lines.push("");
  lines.push("export const editorTokenMaps: Record<TokenSetId, Record<string, string>> = {");
  lines.push("  'askewly.default': " + JSON.stringify(defaultMap, null, 2).replace(/\n/g, "\n  ") + ",");
  lines.push("  'askewly.dark': " + JSON.stringify(darkMap, null, 2).replace(/\n/g, "\n  ") + ",");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------

function main() {
  writeFileSync(CSS_OUT_PATH, buildEditorTokensCss());
  console.log(`wrote ${path.relative(REPO_ROOT, CSS_OUT_PATH)}`);

  writeFileSync(TS_OUT_PATH, buildEditorTokensTs());
  console.log(`wrote ${path.relative(REPO_ROOT, TS_OUT_PATH)}`);
}

main();
