#!/usr/bin/env node
// Builds shadcn-registry-compatible code assets from recipe demo sources (RC1):
//   examples/ui-vocabulary-site/registry.json (item declarations)
//   + src/components/<name>.tsx (code SSOT — same source the site renders)
//   → public/r/registry.json + public/r/<name>.json (files[].content embedded)
//
// Purity gate: every import must be within the allowed surface (react, lucide-react,
// shadcn @/components/ui/*, @/lib/utils). Any other import fails the build with an
// explicit error — site-coupled demos must not leak into distributed assets.
// Derived deps: registryDependencies (shadcn primitives) and dependencies (npm)
// are parsed from source; if the declaration disagrees with the source, fail.
// Usage: node scripts/generate-registry.mjs

import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SITE = path.join(REPO_ROOT, "examples", "ui-vocabulary-site");
const REGISTRY_JSON = path.join(SITE, "registry.json");
const COMPONENTS = path.join(SITE, "src", "components");
const RECIPES_DIR = path.join(REPO_ROOT, "recipes");
const OUT_DIR = path.join(SITE, "public", "r");
const BASE_URL = "https://ui.askewly.com";

const ALLOWED = /^(react(\/.+)?$|lucide-react$|@\/components\/ui\/|@\/lib\/utils$)/;

function fail(msg) {
  console.error(`generate-registry: FAIL — ${msg}`);
  process.exit(1);
}

if (!existsSync(REGISTRY_JSON)) fail(`registry.json 없음: ${REGISTRY_JSON}`);
const registry = JSON.parse(readFileSync(REGISTRY_JSON, "utf8"));
if (!Array.isArray(registry.items) || registry.items.length === 0) fail("registry.items 가 비어 있음");

function findRecipeDoc(name) {
  // recipes/<category>/<name>.md 백링크 탐색
  const cats = ["application-ui", "commerce", "data-display", "docs", "feedback", "forms", "layout", "marketing", "navigation", "overlays"];
  for (const c of cats) {
    const p = path.join(RECIPES_DIR, c, `${name}.md`);
    if (existsSync(p)) return `${BASE_URL}/llms/recipes/${c}/${name}.md`;
  }
  return null;
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const builtItems = [];
for (const item of registry.items) {
  for (const k of ["name", "title", "description"]) {
    if (!item[k]) fail(`item '${item.name ?? "?"}' 필수 필드 누락: ${k}`);
  }
  const srcPath = path.join(COMPONENTS, `${item.name}.tsx`);
  if (!existsSync(srcPath)) fail(`item '${item.name}' 소스 없음: ${srcPath}`);
  const src = readFileSync(srcPath, "utf8");

  const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
  const banned = imports.filter((i) => !ALLOWED.test(i));
  if (banned.length) fail(`item '${item.name}' 순수성 위반 — 허용 외 import: ${banned.join(", ")} (사이트 결합 데모는 배포 금지)`);

  const registryDependencies = [...new Set(
    imports.filter((i) => i.startsWith("@/components/ui/")).map((i) => i.replace("@/components/ui/", ""))
  )].sort();
  const dependencies = [...new Set(
    imports.filter((i) => !i.startsWith("@/") && !/^react(\/.+)?$/.test(i))
  )].sort();

  const recipeDoc = findRecipeDoc(item.name);
  const built = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: "registry:block",
    title: item.title,
    description: item.description,
    ...(recipeDoc && {
      docs: `Recipe contract (intent/anatomy/tokens/checks/anti-patterns): ${recipeDoc} — after transplant, remap look to the project's own tokens per ${BASE_URL}/llms/docs/design-system/component-restyle.md`,
    }),
    registryDependencies,
    dependencies,
    files: [
      {
        path: `registry/askewly/${item.name}/${item.name}.tsx`,
        type: "registry:component",
        content: src,
      },
    ],
  };
  writeFileSync(path.join(OUT_DIR, `${item.name}.json`), JSON.stringify(built, null, 2) + "\n");
  builtItems.push({
    name: item.name, type: "registry:block", title: item.title, description: item.description,
    registryDependencies, dependencies,
    files: [{ path: built.files[0].path, type: "registry:component" }],
  });
}

writeFileSync(path.join(OUT_DIR, "registry.json"), JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "askewly",
  homepage: BASE_URL,
  items: builtItems,
}, null, 2) + "\n");

console.log(`generate-registry: OK — ${builtItems.length} assets -> public/r/ (index + per-item JSON)`);
