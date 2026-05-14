#!/usr/bin/env node
// build.js — emit Tailwind v4 @theme CSS from a DESIGN.md
//
// Reads DESIGN.md frontmatter (DTCG short form), walks the token tree,
// maps each leaf to a CSS variable name following Tailwind v4 conventions,
// resolves {alias} refs to var(--name), and emits theme overrides as
// prefers-color-scheme / [data-theme=...] rule blocks.
//
// Usage: node build.js <path/to/DESIGN.md> [--out <path>]
// Default output: <DESIGN.md dir>/.design/theme.generated.css

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const args = process.argv.slice(2);
const target = args[0];
if (!target) {
  console.error("usage: build.js <DESIGN.md> [--out <path>]");
  process.exit(2);
}
const outIdx = args.indexOf("--out");
const outPath =
  outIdx >= 0
    ? args[outIdx + 1]
    : path.join(path.dirname(target), ".design", "theme.generated.css");

// ── token-path → CSS var name ────────────────────────────────────────────
// Strips tier names (primitive/semantic/component) and maps groups to
// Tailwind v4 conventions. Unknown groups fall back to dot-joined dash name.
function varName(tokenPath) {
  const parts = tokenPath.split(".");
  const root = parts[0];

  if (root === "color") {
    const rest = parts.slice(2).join("-"); // drop tier
    return `--color-${rest}`;
  }
  if (root === "dimension") {
    const group = parts[1];
    const rest = parts.slice(2).join("-");
    if (group === "space") return `--spacing-${rest}`;
    return `--${group}-${rest}`;
  }
  if (root === "typography") {
    const group = parts[1];
    const rest = parts.slice(2).join("-");
    if (group === "font") return `--font-${rest}`;
    if (group === "scale") return `--text-${rest}`;
    if (group === "weight") return `--font-weight-${rest}`;
    return `--${group}-${rest}`;
  }
  if (root === "motion") {
    const group = parts[1];
    const rest = parts.slice(2).join("-");
    if (group === "easing") return `--ease-${rest}`;
    if (group === "duration") return `--duration-${rest}`;
    return `--${group}-${rest}`;
  }
  return `--${parts.join("-")}`;
}

// ── walk token tree ──────────────────────────────────────────────────────
function walk(node, prefix, out) {
  if (!node || typeof node !== "object") return;
  if ("value" in node && "type" in node) {
    out.set(prefix.join("."), node);
    return;
  }
  for (const [k, v] of Object.entries(node)) walk(v, [...prefix, k], out);
}

const aliasRe = /\{([^}]+)\}/g;
function resolveAliases(value) {
  if (typeof value !== "string") return value;
  return value.replace(aliasRe, (_, ref) => `var(${varName(ref)})`);
}

function formatValue(token) {
  const v = token.value;
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return resolveAliases(v);
  return JSON.stringify(v);
}

// ── main ─────────────────────────────────────────────────────────────────
const { data } = matter(fs.readFileSync(target, "utf8"));

const tokens = new Map();
walk(data?.tokens ?? {}, [], tokens);

let out = `/* AUTO-GENERATED from ${path.relative(path.dirname(outPath), target).replaceAll("\\", "/")} */\n`;
out += `/* Edit DESIGN.md, then run: node ~/projects/desing-manual/scripts/lint/build.js DESIGN.md */\n\n`;
out += `@import "tailwindcss";\n\n`;
out += `@theme {\n`;
for (const [p, t] of tokens) {
  out += `  ${varName(p)}: ${formatValue(t)};\n`;
}
out += `}\n`;

// ── theme overrides ──────────────────────────────────────────────────────
const themes = data?.themes ?? {};
for (const [name, def] of Object.entries(themes)) {
  if (def.base) continue;
  const entries = Object.entries(def).filter(([k]) => k !== "base");
  if (entries.length === 0) continue;

  const block = entries
    .map(([p, d]) => `  ${varName(p)}: ${formatValue(d)};`)
    .join("\n");

  if (name === "dark") {
    // Both OS-level and app-level toggles
    out += `\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${block.replace(/^/gm, "  ")}\n  }\n}\n`;
    out += `\n[data-theme="dark"] {\n${block}\n}\n`;
  } else {
    out += `\n[data-theme="${name}"] {\n${block}\n}\n`;
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log(`[build] ${tokens.size} tokens, ${Object.keys(themes).length} themes → ${outPath}`);
