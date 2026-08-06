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
const INDEX_CSS = path.join(SITE, "src", "index.css");
const BASE_URL = "https://ui.askewly.com";

// react-dom is part of the base surface: it ships with every React project the
// same way react does (flushSync 등), so it needs no per-item declaration.
const ALLOWED = /^(react(\/.+)?$|react-dom(\/.+)?$|lucide-react$|@\/components\/ui\/|@\/lib\/utils$)/;

function fail(msg) {
  console.error(`generate-registry: FAIL — ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// requiredCssVars 실측 (M32)
//
// 선언은 사람이 적는 값이라 빠뜨리면 이식처에서 색이 조용히 사라진다(M31 실증).
// 그래서 이식되는 파일 내용에서 실제로 쓰이는 CSS 변수를 뽑아 선언과 대조한다.
// 문법은 두 종류만 센다 — 임의 문자열 스캔은 주석·문서 문자열에서 오탐이 난다:
//   ① var(--x)
//   ② Tailwind 유틸의 토큰 이름. 단 @theme inline 에 실재하는 토큰만 인정한다.
// 누락은 실패, 초과(넓게 적은 선언)는 통과 — 넓은 선언은 무해하고, 좁히면
// 소비처가 조용히 깨진다.
// ---------------------------------------------------------------------------

// @theme inline 의 `--color-x: var(--y)` / `--radius-x: ... var(--y)` 를 읽어
// "유틸 접미사 -> 소비처가 정의해야 하는 변수" 표를 만든다.
function readThemeTokenMap(cssText) {
  const map = new Map(); // utility suffix ("primary", "sidebar-border") -> "--primary"
  for (const block of cssText.matchAll(/@theme\s+inline\s*\{([\s\S]*?)\n\}/g)) {
    for (const line of block[1].split("\n")) {
      const m = line.match(/^\s*--color-([a-z0-9-]+)\s*:\s*(.+);\s*$/);
      if (!m) continue;
      const ref = m[2].match(/var\(\s*(--[a-z0-9-]+)\s*\)/);
      if (ref) map.set(m[1], ref[1]);
    }
  }
  return map;
}

// 색 유틸 접두사. `border` 는 접두사이자 단독 유틸이라 따로 다룬다.
const COLOR_UTILS = "bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|shadow|accent|caret|divide|placeholder";

// 주석은 지운 뒤 센다 — 설명 산문의 클래스 이름이 요구 변수로 올라오면 소비처가
// 쓰지도 않는 변수를 정의하게 된다. URL 의 `//` 를 자르지 않도록 따옴표 상태를 본다.
export function stripComments(source) {
  let out = "";
  let quote = null; // ' " ` 중 하나
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") { out += next ?? ""; i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") { quote = c; out += c; continue; }
    if (c === "/" && next === "/") { while (i < source.length && source[i] !== "\n") i++; out += "\n"; continue; }
    if (c === "/" && next === "*") { i += 2; while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i++; i++; out += " "; continue; }
    out += c;
  }
  return out;
}

// Tailwind v4 가 스스로 정의하는 변수 — 소비처가 정의할 대상이 아니다.
const TAILWIND_BUILTIN = /^--(spacing|container|breakpoint|text|font|tracking|leading|default)(-|$)/;

export function extractCssVars(rawSource, themeMap) {
  const source = stripComments(rawSource);
  const found = new Set();

  // 이 파일이 스스로 정의하는 변수는 요구 대상이 아니다
  // (예: page.tsx 의 `"--sidebar-width": "calc(var(--spacing) * 72)"`).
  // 객체 리터럴·CSS 선언(`"--x":`)뿐 아니라 런타임 주입(`style.setProperty("--x", …)`)도 자기정의다.
  const selfDefined = new Set([
    ...[...source.matchAll(/["']?(--[a-z0-9-]+)["']?\s*:/g)].map((m) => m[1]),
    ...[...source.matchAll(/setProperty\(\s*["'`](--[a-z0-9-]+)/g)].map((m) => m[1]),
  ]);

  // ① var(--x)
  for (const m of source.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) found.add(m[1]);

  // ② Tailwind 유틸 — 클래스 토큰 경계에서만 본다(주석 산문은 걸리지 않는다).
  const utilRe = new RegExp(`(?:^|[\\s"'\`{(\\[])(?:[a-z-]+:)*(${COLOR_UTILS})-([a-z0-9-]+?)(?:\\/[0-9.]+)?(?=$|[\\s"'\`})\\]])`, "g");
  for (const m of source.matchAll(utilRe)) {
    const token = m[2];
    if (themeMap.has(token)) found.add(themeMap.get(token));
  }

  // radius — rounded-* 는 --radius 파생 유틸이고, 소비처가 정의할 변수는 --radius 하나다.
  if (/(?:^|[\s"'`{(\[])(?:[a-z-]+:)*rounded(?:-(?:sm|md|lg|xl))?(?=$|[\s"'`})\]])/.test(source)) found.add("--radius");

  // 테두리 색은 전역 리셋(`* { border-color: var(--border) }`)이 준다 —
  // 색 토큰 없이 `border`·`border-t`·`border-2` 만 써도 --border 가 필요하다.
  if (new RegExp(`(?:^|[\\s"'\`{(\\[])(?:[a-z-]+:)*border(?:-[xytrbles]|-[0-9]+|-[xytrbles]-[0-9]+)?(?=$|[\\s"'\`})\\]])`).test(source)) {
    found.add("--border");
  }

  // `--color-*` 는 Tailwind 테마 네임스페이스지 소비처가 정의하는 토큰 이름이 아니다.
  // 테마에 실재하면 그것이 가리키는 소비처 변수로 바꾸고(`--color-scrim` → `--scrim`),
  // 아니면 런타임 주입값이라 버린다(shadcn chart 의 `--color-<series>` 가 그 경우다).
  const resolved = new Set();
  for (const v of found) {
    if (v.startsWith("--color-")) {
      const mapped = themeMap.get(v.slice("--color-".length));
      if (mapped) resolved.add(mapped);
      continue;
    }
    resolved.add(v);
  }

  return [...resolved]
    .filter((v) => !selfDefined.has(v) && !TAILWIND_BUILTIN.test(v))
    .sort();
}

// 선언과 대조 — 실측이 선언보다 넓으면(=선언 누락) 실패한다.
const MEASURED = new Map(); // name -> measured vars (--print-measured 용)

function assertDeclarationCoversUsage(label, declared, measured) {
  MEASURED.set(label, measured);
  if (!declared) return; // 미선언 항목은 게이트 판정 대상이 아니다 (선언이 있을 때만 대조)
  const missing = measured.filter((v) => !declared.includes(v));
  if (missing.length) {
    fail(
      `'${label}' requiredCssVars 선언 누락: ${missing.join(", ")} — 이식 파일이 실제로 쓰는데 선언에 없다. ` +
        `선언에 추가하거나(정본: examples/ui-vocabulary-site/registry.json) 소스에서 그 변수 사용을 없애라.`
    );
  }
}

// --self-test: 추출기의 양성·음성 픽스처. 레포 선례 = scripts/figma-return-diff.mjs --self-test
if (process.argv.includes("--self-test")) {
  const themeMap = readThemeTokenMap(readFileSync(INDEX_CSS, "utf8"));
  const cases = [
    // [이름, 소스, 반드시 잡혀야 하는 것, 절대 잡히면 안 되는 것]
    ["var() 직접", `style={{ color: "var(--scrim)" }}`, ["--scrim"], []],
    ["유틸 + 불투명도", `<div className="bg-scrim/50 text-muted-foreground" />`, ["--scrim", "--muted-foreground"], []],
    ["variant 접두사", `<div className="dark:bg-muted hover:text-primary" />`, ["--muted", "--primary"], []],
    ["rounded 파생", `<div className="rounded-lg" />`, ["--radius"], []],
    ["색 없는 border", `<div className="border border-t-2" />`, ["--border"], []],
    ["테마 밖 토큰은 무시", `<div className="bg-white text-sm bg-red-500" />`, [], ["--white", "--sm", "--red-500"]],
    ["주석 산문 오탐 방지", `// 이 데모는 bg-scrim 를 쓰지 않는다는 설명이 아니라 정말 안 쓴다\nconst a = 1`, [], ["--scrim"]],
    // 한계 고정: 문자열·JSX 안의 유틸은 구분하지 못한다(정적 추출의 상한 — 계약 문서에 명시).
    ["문자열 안 유틸도 센다(한계)", `const doc = "text-foreground 규칙 설명 문장"`, ["--foreground"], []],
  ];
  let pass = 0;
  for (const [name, src, must, mustNot] of cases) {
    const got = extractCssVars(src, themeMap);
    const missing = must.filter((v) => !got.includes(v));
    const leaked = mustNot.filter((v) => got.includes(v));
    if (missing.length || leaked.length) {
      console.error(`  FAIL ${name}: got [${got.join(", ")}]${missing.length ? ` / 누락 ${missing.join(", ")}` : ""}${leaked.length ? ` / 오탐 ${leaked.join(", ")}` : ""}`);
    } else {
      pass++;
      console.log(`  ok   ${name}`);
    }
  }
  console.log(`generate-registry --self-test: ${pass}/${cases.length}`);
  process.exit(pass === cases.length ? 0 : 1);
}

// --print-measured: 항목별 실측 결과를 JSON 으로 찍는다 (선언 채우기·감사용, 생성은 하지 않는다)
const PRINT_MEASURED = process.argv.includes("--print-measured");

if (!existsSync(REGISTRY_JSON)) fail(`registry.json 없음: ${REGISTRY_JSON}`);
if (!existsSync(INDEX_CSS)) fail(`index.css 없음: ${INDEX_CSS}`);
const THEME_TOKENS = readThemeTokenMap(readFileSync(INDEX_CSS, "utf8"));
if (THEME_TOKENS.size === 0) fail(`@theme inline 에서 색 토큰을 하나도 읽지 못했다: ${INDEX_CSS}`);
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
  // 블록의 선언 자리는 항목 top-level `requiredCssVars` 다 (비블록은 meta.requiredCssVars — 경로가 다르다).
  const measuredVars = extractCssVars(files.map((f) => f.content).join("\n"), THEME_TOKENS);
  assertDeclarationCoversUsage(item.name, item.requiredCssVars, measuredVars);
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
  assertDeclarationCoversUsage(item.name, item.meta?.requiredCssVars, extractCssVars(src, THEME_TOKENS));

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

if (PRINT_MEASURED) {
  console.log(JSON.stringify(Object.fromEntries([...MEASURED].sort()), null, 2));
  process.exit(0);
}

writeFileSync(path.join(OUT_DIR, "registry.json"), JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "askewly",
  homepage: BASE_URL,
  items: builtItems,
}, null, 2) + "\n");

console.log(`generate-registry: OK — ${builtItems.length} assets -> public/r/ (index + per-item JSON)`);
