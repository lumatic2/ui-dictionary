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
import { wcagContrast, parse as parseColor, oklch, rgb } from "culori";

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
const fail = (stage, errors) => {
  report.stages[stage] = { ok: false, errors };
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

// 4. contrast — best-effort pairs
const resolve = (val, depth = 0) => {
  if (depth > 8) return null;
  if (typeof val !== "string") return val;
  return val.replace(aliasRe, (_, ref) => {
    const t = flat.get(ref);
    if (!t) return _;
    return resolve(t.value, depth + 1);
  });
};
const tryColor = (s) => {
  try {
    return parseColor(s);
  } catch {
    return null;
  }
};
const pairs = [
  ["color.semantic.text.default", "color.semantic.surface.base"],
  ["color.semantic.text.muted", "color.semantic.surface.base"],
  ["color.semantic.text.default", "color.semantic.surface.muted"],
];
const contrastErrors = [];
const contrastInfo = [];
for (const [fg, bg] of pairs) {
  const tF = flat.get(fg), tB = flat.get(bg);
  if (!tF || !tB) continue;
  const fgRaw = resolve(tF.value);
  const bgRaw = resolve(tB.value);
  const c1 = tryColor(fgRaw), c2 = tryColor(bgRaw);
  if (!c1 || !c2) {
    contrastInfo.push({ fg, bg, fgRaw, bgRaw, note: "unparseable (color-mix / unknown function)" });
    continue;
  }
  const ratio = wcagContrast(c1, c2);
  const row = { fg, bg, ratio: Number(ratio.toFixed(2)) };
  contrastInfo.push(row);
  if (ratio < 4.5) contrastErrors.push(`${fg} on ${bg}: ${ratio.toFixed(2)} < 4.5 (WCAG AA)`);
}
if (contrastErrors.length) fail("contrast", contrastErrors);
else pass("contrast", { pairs: contrastInfo });

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
