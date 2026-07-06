#!/usr/bin/env node
// Generates derived artifacts from tokens/askewly.tokens.json (SSOT):
//   (a) examples/ui-vocabulary-site/src/tokens.css
//   (b) DESIGN.md frontmatter (YAML block only; markdown body is preserved)
//
// Usage: node scripts/generate-tokens.mjs

import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { loadTokens, getNode, resolveModeLiteral } from "./lib/token-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TOKENS_PATH = path.join(REPO_ROOT, "tokens", "askewly.tokens.json");
const TOKENS_CSS_PATH = path.join(REPO_ROOT, "examples", "ui-vocabulary-site", "src", "tokens.css");
const DESIGN_MD_PATH = path.join(REPO_ROOT, "DESIGN.md");

const root = loadTokens(TOKENS_PATH);

// ---------------------------------------------------------------------------
// (a) tokens.css
// ---------------------------------------------------------------------------

function formatDimension(raw) {
  return `${raw.value}${raw.unit}`;
}

function hasDarkOverride(dotPath) {
  const node = getNode(root, dotPath);
  return node?.$extensions?.["com.askewly.modes"]?.dark !== undefined;
}

const COLOR_MAPPINGS = [
  ["--background", "color.semantic.surface.base"],
  ["--foreground", "color.semantic.text.default"],
  ["--card", "color.semantic.surface.raised"],
  ["--card-foreground", "color.semantic.text.default"],
  ["--popover", "color.semantic.surface.overlay"],
  ["--popover-foreground", "color.semantic.text.default"],
  ["--primary", "color.semantic.action.primary"],
  ["--primary-foreground", "color.semantic.text.on-accent"],
  ["--secondary", "color.semantic.surface.secondary"],
  ["--secondary-foreground", "color.semantic.text.secondary"],
  ["--muted", "color.semantic.surface.muted"],
  ["--muted-foreground", "color.semantic.text.muted"],
  ["--accent", "color.semantic.accent.base"],
  ["--accent-foreground", "color.semantic.accent.foreground"],
  ["--destructive", "color.semantic.action.destructive"],
  ["--border", "color.semantic.border.default"],
  ["--input", "color.semantic.border.input"],
  ["--ring", "color.semantic.border.focus"],
];

const BRAND_MAPPINGS = [
  ["--askewly-violet", "color.primitive.askewly.violet"],
  ["--askewly-orchid", "color.primitive.askewly.orchid"],
  ["--askewly-lavender", "color.primitive.askewly.lavender"],
  ["--askewly-sky", "color.primitive.askewly.sky"],
  ["--askewly-mint", "color.primitive.askewly.mint"],
];

const SPACE_MAPPINGS = [
  ["--space-1", "dimension.space.1"],
  ["--space-2", "dimension.space.2"],
  ["--space-4", "dimension.space.4"],
  ["--space-8", "dimension.space.8"],
  ["--space-12", "dimension.space.12"],
  ["--space-16", "dimension.space.16"],
];

const FONT_SIZE_MAPPINGS = [
  ["--font-size-sm", "typography.scale.sm"],
  ["--font-size-base", "typography.scale.base"],
  ["--font-size-lg", "typography.scale.lg"],
  ["--font-size-xl", "typography.scale.xl"],
  ["--font-size-2xl", "typography.scale.2xl"],
];

const FONT_WEIGHT_MAPPINGS = [
  ["--font-weight-regular", "typography.weight.regular"],
  ["--font-weight-medium", "typography.weight.medium"],
];

const RADIUS_MAPPINGS = [
  ["--radius-sm", "dimension.radius.sm"],
  ["--radius-md", "dimension.radius.md"],
  ["--radius-lg", "dimension.radius.lg"],
  ["--radius-xl", "dimension.radius.xl"],
];

function buildTokensCss() {
  const lines = [];
  lines.push(
    "/* GENERATED from tokens/askewly.tokens.json — do not edit by hand. Regenerate: node scripts/generate-tokens.mjs */",
  );
  lines.push(":root {");
  lines.push("  --radius: 0.5rem;");
  for (const [cssVar, tokenPath] of COLOR_MAPPINGS) {
    lines.push(`  ${cssVar}: ${resolveModeLiteral(root, tokenPath, "light")};`);
  }
  for (const [cssVar, tokenPath] of BRAND_MAPPINGS) {
    lines.push(`  ${cssVar}: ${resolveModeLiteral(root, tokenPath, "light")};`);
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
  for (const [cssVar, tokenPath] of RADIUS_MAPPINGS) {
    lines.push(`  ${cssVar}: ${formatDimension(resolveModeLiteral(root, tokenPath, "light"))};`);
  }
  lines.push("}");
  lines.push("");
  lines.push(".dark {");
  for (const [cssVar, tokenPath] of COLOR_MAPPINGS) {
    if (!hasDarkOverride(tokenPath)) continue;
    lines.push(`  ${cssVar}: ${resolveModeLiteral(root, tokenPath, "dark")};`);
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// (b) DESIGN.md frontmatter
// ---------------------------------------------------------------------------

function isPureNumericKey(key) {
  return /^[0-9]+$/.test(key);
}

function yamlKey(key) {
  return isPureNumericKey(key) ? `"${key}"` : key;
}

function formatLeafValue(value, type) {
  if (type === "dimension") return JSON.stringify(formatDimension(value));
  if (type === "fontFamily") return JSON.stringify(Array.isArray(value) ? value.join(", ") : value);
  if (type === "fontWeight") return String(value);
  if (type === "color") return JSON.stringify(value);
  return JSON.stringify(value);
}

function formatLeaf(value, type) {
  return `{ value: ${formatLeafValue(value, type)}, type: ${type} }`;
}

/** Recursively serialize a token group node into YAML-inline-map lines. */
function serializeGroup(node, indent, inheritedType) {
  const pad = "  ".repeat(indent);
  const groupType = node.$type ?? inheritedType;
  const lines = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    const child = node[key];
    const label = yamlKey(key);
    if (child && typeof child === "object" && "$value" in child) {
      const type = child.$type ?? groupType;
      lines.push(`${pad}${label}: ${formatLeaf(child.$value, type)}`);
    } else if (child && typeof child === "object") {
      lines.push(`${pad}${label}:`);
      lines.push(...serializeGroup(child, indent + 1, groupType));
    }
  }
  return lines;
}

/** Collect { path, value, type } for every leaf under color.semantic that has a dark override. */
function collectDarkOverrides(node, pathSegments, inheritedType, out) {
  const groupType = node.$type ?? inheritedType;
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    const child = node[key];
    const childPath = [...pathSegments, key];
    if (child && typeof child === "object" && "$value" in child) {
      const darkRaw = child.$extensions?.["com.askewly.modes"]?.dark;
      if (darkRaw !== undefined) {
        out.push({ path: childPath.join("."), value: darkRaw, type: child.$type ?? groupType });
      }
    } else if (child && typeof child === "object") {
      collectDarkOverrides(child, childPath, groupType, out);
    }
  }
}

function buildFrontmatterLines() {
  const lines = [];
  lines.push("# GENERATED tokens/themes from tokens/askewly.tokens.json — edit the SSOT, then regenerate");
  lines.push('name: "Askewly Design"');
  lines.push('version: "0.2.0"');
  lines.push("");
  lines.push("tokens:");
  lines.push("  color:");
  lines.push("    primitive:");
  lines.push(...serializeGroup(root.color.primitive, 3, "color"));
  lines.push("    semantic:");
  lines.push(...serializeGroup(root.color.semantic, 3, "color"));
  lines.push("    component:");
  lines.push(...serializeGroup(root.color.component, 3, "color"));
  lines.push("");
  lines.push("  dimension:");
  lines.push("    space:");
  lines.push(...serializeGroup(root.dimension.space, 3, "dimension"));
  lines.push("    radius:");
  lines.push(...serializeGroup(root.dimension.radius, 3, "dimension"));
  lines.push("");
  lines.push("  typography:");
  lines.push("    font:");
  lines.push(...serializeGroup(root.typography.font, 3, "fontFamily"));
  lines.push("    scale:");
  lines.push(...serializeGroup(root.typography.scale, 3, "dimension"));
  lines.push("    weight:");
  lines.push(...serializeGroup(root.typography.weight, 3, "fontWeight"));
  lines.push("");
  lines.push("themes:");
  lines.push("  default: { base: true }");
  lines.push("  dark:");
  const darkOverrides = [];
  collectDarkOverrides(root.color.semantic, ["color", "semantic"], "color", darkOverrides);
  for (const override of darkOverrides) {
    lines.push(`    ${override.path}: ${formatLeaf(override.value, override.type)}`);
  }
  return lines;
}

function regenerateDesignMdFrontmatter() {
  const text = readFileSync(DESIGN_MD_PATH, "utf8");
  const lines = text.split("\n");

  if (lines[0].trim() !== "---") {
    throw new Error(`DESIGN.md must start with a "---" frontmatter delimiter (got: ${JSON.stringify(lines[0])})`);
  }
  let endIdx = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) {
    throw new Error("DESIGN.md is missing a closing frontmatter '---' delimiter");
  }

  const body = lines.slice(endIdx + 1).join("\n");
  const newFrontmatter = buildFrontmatterLines();
  const newContent = ["---", ...newFrontmatter, "---", body].join("\n");
  writeFileSync(DESIGN_MD_PATH, newContent);
}

// ---------------------------------------------------------------------------

function main() {
  writeFileSync(TOKENS_CSS_PATH, buildTokensCss());
  console.log(`wrote ${path.relative(REPO_ROOT, TOKENS_CSS_PATH)}`);

  regenerateDesignMdFrontmatter();
  console.log(`regenerated frontmatter in ${path.relative(REPO_ROOT, DESIGN_MD_PATH)}`);
}

main();
