#!/usr/bin/env node
// design-lint — validate a DESIGN.md
//
// Pipeline (fail-fast, JSON report to .design/lint.json):
//   1. parse frontmatter
//   2. ajv schema check
//   3. token alias resolution
//   4. WCAG AA contrast check on common text/surface pairs
//
// Usage: node index.js <path/to/DESIGN.md>
// Exit: 0 PASS, 1 FAIL, 2 IO error

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import Ajv from "ajv/dist/2020.js";
import { wcagContrast, parse as parseColor, oklch, formatCss } from "culori";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "..", "schema", "design-md.schema.json"), "utf8")
);

const target = process.argv[2];
if (!target) {
  console.error("usage: design-lint <DESIGN.md>");
  process.exit(2);
}
if (!fs.existsSync(target)) {
  console.error(`not found: ${target}`);
  process.exit(2);
}

const report = { file: target, ts: new Date().toISOString(), stages: {}, ok: true };
const fail = (stage, errors, extra = {}) => {
  report.stages[stage] = { ok: false, errors, ...extra };
  report.ok = false;
};
const pass = (stage, extra = {}) => {
  report.stages[stage] = { ok: true, ...extra };
};

// 1. parse
let data;
try {
  const raw = fs.readFileSync(target, "utf8");
  ({ data } = matter(raw));
  pass("parse");
} catch (e) {
  fail("parse", [String(e.message || e)]);
  emitAndExit();
}

// 2. schema
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(SCHEMA);
if (!validate(data)) {
  fail("schema", validate.errors.map((e) => `${e.instancePath || "/"} ${e.message}`));
} else {
  pass("schema");
}

// 3. alias resolution — walk tokens, collect all paths, then verify {alias} references
const tokens = data?.tokens ?? {};
const flat = new Map();
(function walk(node, prefix) {
  if (!node || typeof node !== "object") return;
  if ("value" in node && "type" in node) {
    flat.set(prefix.join("."), node);
    return;
  }
  for (const [k, v] of Object.entries(node)) walk(v, [...prefix, k]);
})(tokens, []);

const aliasRe = /\{([^}]+)\}/g;
const aliasErrors = [];
for (const [p, t] of flat) {
  if (typeof t.value !== "string") continue;
  for (const m of t.value.matchAll(aliasRe)) {
    const ref = m[1];
    if (!flat.has(ref)) aliasErrors.push(`${p}: unresolved alias {${ref}}`);
  }
}
if (aliasErrors.length) fail("alias", aliasErrors);
else pass("alias", { tokens: flat.size });

// 4. contrast — auto-discover pairs, evaluate per theme, suggest fixes
const tryColor = (s) => {
  try { return parseColor(s); } catch { return null; }
};

// Build per-theme effective token maps. Default = base. Themes override by dot-path key.
const themes = data?.themes ?? {};
const themeNames = ["default", ...Object.keys(themes).filter((n) => n !== "default")];
const effective = (themeName) => {
  const map = new Map(flat);
  const def = themes[themeName];
  if (def && !def.base) {
    for (const [path, ovr] of Object.entries(def)) {
      if (path === "base") continue;
      map.set(path, ovr);
    }
  }
  return map;
};
const resolveWith = (val, map, depth = 0) => {
  if (depth > 8) return null;
  if (typeof val !== "string") return val;
  return val.replace(aliasRe, (_, ref) => {
    const t = map.get(ref);
    if (!t) return _;
    return resolveWith(t.value, map, depth + 1);
  });
};

// Auto-discover token paths by name convention
const has = (p, prefix) => p.startsWith(prefix);
const allTextPaths = [...flat.keys()].filter((p) => has(p, "color.semantic.text."));
const onTextPaths  = allTextPaths.filter((p) => /\.on-/.test(p));        // explicit pairs only
const textPaths    = allTextPaths.filter((p) => !/\.on-/.test(p));        // tested vs surface
const surfacePaths = [...flat.keys()].filter((p) => has(p, "color.semantic.surface."));
const actionPaths  = [...flat.keys()].filter((p) => has(p, "color.semantic.action."));

// Pair rules:
//   text  × surface       → AA error  (4.5)
//   action× surface       → AA warn   (4.5; action may not be used as text)
//   on-X  × X-parent      → AA error  (explicit pairing, e.g. text.on-primary × action.primary)
const pairRules = [];
for (const fg of textPaths)   for (const bg of surfacePaths) pairRules.push({ fg, bg, sev: "error" });
for (const fg of actionPaths) for (const bg of surfacePaths) pairRules.push({ fg, bg, sev: "warn" });
for (const fg of onTextPaths) {
  const role = fg.split(".on-")[1];                // e.g. "primary"
  const bg = actionPaths.find((p) => p.endsWith(`.${role}`)) ||
             surfacePaths.find((p) => p.endsWith(`.${role}`));
  if (bg) pairRules.push({ fg, bg, sev: "error" });
}

// OKLCH-based suggestion: nudge L of fg toward 0 or 1 to reach target ratio
function suggest(fgColor, bgColor, target = 4.5) {
  const fgOk = oklch(fgColor), bgOk = oklch(bgColor);
  if (!fgOk || !bgOk) return null;
  const dir = (fgOk.l ?? 0.5) >= (bgOk.l ?? 0.5) ? 1 : -1; // lighter bg → push fg darker, etc.
  for (let step = 0.02; step <= 0.6; step += 0.02) {
    const tryL = Math.max(0, Math.min(1, (fgOk.l ?? 0.5) + dir * step));
    const trial = { ...fgOk, l: tryL };
    if (wcagContrast(trial, bgColor) >= target) {
      return formatCss(trial);
    }
  }
  return null;
}

const themeResults = {};
let totalErrors = 0;
const errorLines = [];
for (const themeName of themeNames) {
  const map = effective(themeName);
  const rows = [];
  for (const { fg, bg, sev } of pairRules) {
    const tF = map.get(fg), tB = map.get(bg);
    if (!tF || !tB) continue;
    const fgRaw = resolveWith(tF.value, map);
    const bgRaw = resolveWith(tB.value, map);
    const c1 = tryColor(fgRaw), c2 = tryColor(bgRaw);
    const row = { fg, bg, sev };
    if (!c1 || !c2) {
      row.note = "unparseable (color-mix / function)";
      rows.push(row);
      continue;
    }
    const ratio = wcagContrast(c1, c2);
    row.ratio = Number(ratio.toFixed(2));
    if (ratio < 4.5) {
      row.fail = true;
      if (sev === "error") {
        totalErrors++;
        errorLines.push(`[${themeName}] ${fg} on ${bg}: ${ratio.toFixed(2)} < 4.5`);
      }
      const fix = suggest(c1, c2, 4.5);
      if (fix) row.suggest = { token: fg, value: fix, note: "OKLCH L 조정" };
    }
    rows.push(row);
  }
  themeResults[themeName] = rows;
}

if (totalErrors > 0) fail("contrast", errorLines, { themes: themeResults });
else pass("contrast", { themes: themeResults });

emitAndExit();

function emitAndExit() {
  const outDir = path.join(path.dirname(target), ".design");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "lint.json"), JSON.stringify(report, null, 2));
  // human summary
  for (const [stage, r] of Object.entries(report.stages)) {
    const tag = r.ok ? "PASS" : "FAIL";
    console.log(`[${tag}] ${stage}`);
    if (!r.ok) for (const e of r.errors) console.log(`       - ${e}`);
  }
  console.log(`\nreport: ${path.join(outDir, "lint.json")}`);
  process.exit(report.ok ? 0 : 1);
}
