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
//
// SSOT의 color.semantic 잎을 순회해 CSS 변수 이름을 만든다.
// 손으로 나열하던 19줄을 대체한다 — 같은 집합을 두 방식(손 나열 + walkLeaves)으로
// 표현하고 있어서, SSOT에 토큰이 늘면 한쪽만 따라가고 다른 쪽이 뒤처졌다
// (ECT1 finding). 정본은 SSOT 하나다.
const semanticColorMappings = () => {
  const out = [];
  walkLeaves(getNode(root, "color.semantic"), [], (leafPath) => {
    out.push([`--ad-${leafPath.replace(/\./g, "-")}`, `color.semantic.${leafPath}`]);
  });
  return out;
};


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
  for (const [cssVar, tokenPath] of semanticColorMappings()) {
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
  for (const [cssVar, tokenPath] of semanticColorMappings()) {
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

// DTCG `$type` is declared on a group and inherited by its descendants, so the
// kind of a leaf is whatever the nearest ancestor declaring `$type` says.
function declaredType(dotPath) {
  const parts = dotPath.split(".");
  for (let i = parts.length; i > 0; i -= 1) {
    const node = getNode(root, parts.slice(0, i).join("."));
    if (node?.$type) return node.$type;
  }
  return null;
}

// The editor vocabulary carried no kind at all, so the canvas could not tell a
// colour token from a font one and would have offered both in a colour picker
// (ECT1 step-1 left it null rather than guessing). Derive it from the SSOT.
const DTCG_TO_TOKEN_KIND = { color: "color", fontFamily: "fontFamily" };

function buildSemanticKindMap() {
  const map = {};
  walkLeaves(getNode(root, "color.semantic"), [], (leafPath) => {
    const dtcgType = declaredType(`color.semantic.${leafPath}`);
    const kind = DTCG_TO_TOKEN_KIND[dtcgType];
    if (!kind) {
      // Guessing here is how a font token ends up in a colour list. Fail loudly:
      // a new DTCG type means someone must decide what the editor does with it.
      throw new Error(
        `color.semantic.${leafPath} has DTCG $type "${dtcgType}", which maps to no editor token kind. ` +
          `Add it to DTCG_TO_TOKEN_KIND (and to TokenKind in template-core) before regenerating.`,
      );
    }
    map[leafPath] = kind;
  });
  return map;
}

function buildEditorTokensTs() {
  const defaultMap = buildSemanticColorMap("light");
  const darkMap = buildSemanticColorMap("dark");
  const kindMap = buildSemanticKindMap();

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
  lines.push("/** Mirrors TokenKind in @askewly/template-core so both vocabularies describe tokens the same way. */");
  lines.push("export type EditorTokenKind = 'color' | 'fontFamily'");
  lines.push("");
  lines.push("/** Neutral background used for canvas nodes with no tokenBindings.background. */");
  lines.push("export const FALLBACK_BACKGROUND_TOKEN = 'surface.muted'");
  lines.push("");
  lines.push("export const editorTokenMaps: Record<TokenSetId, Record<string, string>> = {");
  lines.push("  'askewly.default': " + JSON.stringify(defaultMap, null, 2).replace(/\n/g, "\n  ") + ",");
  lines.push("  'askewly.dark': " + JSON.stringify(darkMap, null, 2).replace(/\n/g, "\n  ") + ",");
  lines.push("}");
  lines.push("");
  lines.push("/** Token kind per name, derived from the SSOT's DTCG `$type`. Both sets share these names. */");
  lines.push("export const editorTokenKinds: Record<string, EditorTokenKind> = " + JSON.stringify(kindMap, null, 2));
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
