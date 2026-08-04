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
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SITE = path.join(REPO_ROOT, "examples", "ui-vocabulary-site");
const REGISTRY_JSON = path.join(SITE, "registry.json");
const COMPONENTS = path.join(SITE, "src", "components");
const RECIPES_DIR = path.join(REPO_ROOT, "recipes");
const OUT_DIR = path.join(SITE, "public", "r");
const BASE_URL = "https://ui.askewly.com";

// react-dom is part of the base surface: it ships with every React project the
// same way react does (flushSync 등), so it needs no per-item declaration.
const ALLOWED = /^(react(\/.+)?$|react-dom(\/.+)?$|lucide-react$|@\/components\/ui\/|@\/lib\/utils$)/;

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

// Block tier (M18): items declared with tier:"block" read a multi-file directory
// src/components/blocks/<name>/ instead of a single .tsx. Extra allowances, per
// docs/design-system/block-contract.md §2: relative imports inside the block dir,
// imports of registered code assets (@/components/<asset> -> registryDependencies URL),
// and npm packages explicitly declared in the item's `dependencies` allowlist.

const assetNames = new Set(registry.items.filter((i) => i.tier !== "block").map((i) => i.name));

function collectBlockFiles(dir, base) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...collectBlockFiles(p, base));
    else if (/\.(tsx|ts|json|css)$/.test(entry)) out.push(path.relative(base, p).replaceAll("\\", "/"));
  }
  return out.sort();
}

function fileType(rel) {
  // page.tsx 도 registry:component — registry:page 는 Next app 라우터 전제라
  // 비-Next 소비 프로젝트에서 조용히 스킵된다(M18 step-5 실측).
  if (rel.endsWith(".json") || rel.endsWith(".css")) return "registry:file";
  return "registry:component";
}

function buildBlock(item) {
  const blockDir = path.join(COMPONENTS, "blocks", item.name);
  if (!existsSync(blockDir)) fail(`block '${item.name}' 소스 디렉터리 없음: ${blockDir}`);
  const rels = collectBlockFiles(blockDir, blockDir);
  if (rels.length < 2) fail(`block '${item.name}' 은 다중 파일이어야 함 (현재 ${rels.length})`);
  const declaredDeps = new Set(item.dependencies ?? []);
  const primitives = new Set();
  const assetRefs = new Set();
  const usedDeps = new Set();
  const files = [];
  for (const rel of rels) {
    const src = readFileSync(path.join(blockDir, rel), "utf8");
    if (/\.(tsx|ts)$/.test(rel)) {
      const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
      for (const i of imports) {
        if (ALLOWED.test(i) || i.startsWith("./") || i.startsWith("../")) {
          if (i.startsWith("@/components/ui/")) primitives.add(i.replace("@/components/ui/", ""));
          else if (!i.startsWith("@/") && !/^react(\/.+)?$/.test(i) && !i.startsWith(".")) usedDeps.add(i);
          continue;
        }
        if (i.startsWith("@/components/")) {
          const ref = i.replace("@/components/", "");
          if (assetNames.has(ref)) { assetRefs.add(ref); continue; }
          fail(`block '${item.name}' ${rel}: 미등재 컴포넌트 import '${i}' — 등재된 code asset 만 허용`);
        }
        const pkg = i.startsWith("@") ? i.split("/").slice(0, 2).join("/") : i.split("/")[0];
        if (declaredDeps.has(pkg)) { usedDeps.add(pkg); continue; }
        fail(`block '${item.name}' ${rel}: 순수성 위반 — 허용 외 import '${i}' (npm 패키지면 registry.json dependencies 에 선언)`);
      }
    }
    // target: 블록 파일 전건을 한 디렉터리에 고정 — 흩어지면 블록 내부 상대 import 가 깨진다.
    // (shadcn CLI 는 registry:page/file 에 target 필수 — 소비 프로젝트에 src/ 가 있으면 접두 처리)
    files.push({
      path: `registry/askewly/${item.name}/${rel}`,
      type: fileType(rel),
      target: `components/blocks/${item.name}/${rel}`,
      content: src,
    });
  }
  const undeclared = [...declaredDeps].filter((d) => !usedDeps.has(d));
  if (undeclared.length) fail(`block '${item.name}': 선언됐지만 소스에 없는 dependencies: ${undeclared.join(", ")}`);
  const registryDependencies = [
    ...[...primitives].sort(),
    ...[...assetRefs].sort().map((n) => `${BASE_URL}/r/${n}.json`),
  ];
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: "registry:block",
    title: item.title,
    description: item.description,
    ...(item.docs && { docs: item.docs }),
    // requiredCssVars: 소비 프로젝트 토큰층이 정의해야 하는 변수 목록(계약 §6) —
    // kickstart 의 기계 대조가 이 목록을 읽는다. 정본 선언은 registry.json 항목.
    meta: { tier: "block", ...(item.requiredCssVars && { requiredCssVars: item.requiredCssVars }) },
    registryDependencies,
    dependencies: [...usedDeps].sort(),
    files,
  };
}

const builtItems = [];
for (const item of registry.items) {
  for (const k of ["name", "title", "description"]) {
    if (!item[k]) fail(`item '${item.name ?? "?"}' 필수 필드 누락: ${k}`);
  }
  if (item.tier === "block") {
    const built = buildBlock(item);
    writeFileSync(path.join(OUT_DIR, `${item.name}.json`), JSON.stringify(built, null, 2) + "\n");
    builtItems.push({
      name: built.name, type: built.type, title: built.title, description: built.description,
      meta: built.meta, registryDependencies: built.registryDependencies, dependencies: built.dependencies,
      files: built.files.map((f) => ({ path: f.path, type: f.type })),
    });
    continue;
  }
  const srcPath = path.join(COMPONENTS, `${item.name}.tsx`);
  if (!existsSync(srcPath)) fail(`item '${item.name}' 소스 없음: ${srcPath}`);
  const src = readFileSync(srcPath, "utf8");

  const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
  // Plain assets share the block contract (§2) for anything beyond the base surface:
  // npm packages must be declared in the item's `dependencies` allowlist, and
  // @/components/<name> refs must point at registered code assets (-> registryDependencies URL).
  const declaredDeps = new Set(item.dependencies ?? []);
  const usedDeclared = new Set();
  const assetRefs = new Set();
  const banned = [];
  for (const i of imports) {
    if (ALLOWED.test(i)) continue;
    if (i.startsWith("@/components/")) {
      const ref = i.replace("@/components/", "");
      if (assetNames.has(ref)) { assetRefs.add(ref); continue; }
      fail(`item '${item.name}': 미등재 컴포넌트 import '${i}' — 등재된 code asset 만 허용`);
    }
    if (!i.startsWith("@/") && !i.startsWith(".")) {
      const pkg = i.startsWith("@") ? i.split("/").slice(0, 2).join("/") : i.split("/")[0];
      if (declaredDeps.has(pkg)) { usedDeclared.add(pkg); continue; }
    }
    banned.push(i);
  }
  if (banned.length) fail(`item '${item.name}' 순수성 위반 — 허용 외 import: ${banned.join(", ")} (npm 패키지면 registry.json dependencies 에 선언 — 사이트 결합 데모는 배포 금지)`);
  const undeclared = [...declaredDeps].filter((d) => !usedDeclared.has(d));
  if (undeclared.length) fail(`item '${item.name}': 선언됐지만 소스에 없는 dependencies: ${undeclared.join(", ")}`);

  const registryDependencies = [
    ...[...new Set(
      imports.filter((i) => i.startsWith("@/components/ui/")).map((i) => i.replace("@/components/ui/", ""))
    )].sort(),
    ...[...assetRefs].sort().map((n) => `${BASE_URL}/r/${n}.json`),
  ];
  const dependencies = [...new Set(
    imports
      .filter((i) => !i.startsWith("@/") && !i.startsWith(".") && !/^react(-dom)?(\/.+)?$/.test(i))
      .map((i) => (i.startsWith("@") ? i.split("/").slice(0, 2).join("/") : i.split("/")[0]))
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
    // harvest attribution passthrough (harvest-contract.md §4) — declared per item, absent on legacy items.
    ...(item.meta && { meta: item.meta }),
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
    ...(item.meta && { meta: item.meta }),
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
