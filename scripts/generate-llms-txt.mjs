#!/usr/bin/env node
// Generates the agent discovery layer from the design-system SSOT (AG1):
//   (a) examples/ui-vocabulary-site/public/llms/** — raw copies of SSOT assets
//   (b) examples/ui-vocabulary-site/public/llms.txt — link-only index (no value duplication, C-10)
//
// The index is derived — do not edit llms.txt or public/llms/ by hand.
// Usage: node scripts/generate-llms-txt.mjs
// Exits non-zero if any SSOT source is missing or an index link has no backing file.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SITE_PUBLIC = path.join(REPO_ROOT, "examples", "ui-vocabulary-site", "public");
const LLMS_DIR = path.join(SITE_PUBLIC, "llms");
const LLMS_TXT = path.join(SITE_PUBLIC, "llms.txt");
const BASE_URL = "https://ui.askewly.com";

// Fixed SSOT assets: repo-relative source path + one-line description for the index.
const FIXED_ASSETS = [
  {
    section: "Entry Protocol",
    items: [
      ["docs/design-system/entry-protocol.md", "Start here: what to fetch, in what order, per design task type (new screen / improving existing UI / single component)"],
      ["docs/design-system/design-brief.md", "Kickoff interview contract: scale gate (when to interview vs skip), 7-domain question catalog (tone, look ownership, color, type, structure, interaction level, content), answers persisted as the project's own DESIGN.md"],
      ["docs/design-system/brief-studio.md", "Visual brief studio contract: show color palettes on a mini UI preview, real font specimens, and touchable interaction demos in the browser; user clicks to choose, selections map into DESIGN.md — text questions are the fallback"],
    ],
  },
  {
    section: "Principles",
    items: [
      ["docs/design-system/principles.md", "Canonical Askewly Design principles: task-first hierarchy, semantic tokens, complete interaction states, meaningful motion, and evidence-based publication"],
      ["docs/design-system/anti-patterns.md", "Agent-facing anti-pattern checklist distilled from all recipe Anti-patterns sections: 12 clusters covering cost integrity, destructive actions, accessible interaction paths, and more"],
      ["docs/design-system/style-signature.md", "User-approved style signature: 5 cross-project operating principles + 5 hard-fail dislikes (left-border accent cards, broken Korean word wrap, emoji icons, …) — judge every design output against this"],
    ],
  },
  {
    section: "Tokens",
    items: [
      ["tokens/askewly.tokens.json", "3-tier design tokens (primitive/semantic/component), DTCG stable 2025.10 format — the single source all colors, dimensions, and typography derive from"],
      ["examples/ui-vocabulary-site/src/tokens.css", "Ready-to-use CSS custom properties (light + dark) generated from the token SSOT — copy these variables instead of inventing values", "tokens/tokens.css"],
    ],
  },
  {
    section: "Taxonomy",
    items: [
      ["docs/design-system/pattern-taxonomy.md", "Canonical pattern classification: 7 surfaces, 10 pattern groups, 57 groups"],
      ["docs/ui-vocabulary/groups.yml", "Group axis data (57 groups) referenced by every vocabulary term"],
    ],
  },
  {
    section: "Contracts",
    items: [
      ["docs/design-system/recipe-format.md", "Recipe format contract: intent / anatomy / tokens / states / checks / anti-patterns"],
      ["docs/design-system/agent-asset-model.md", "How coding agents are expected to consume tokens, taxonomy, and recipes"],
      ["docs/design-system/component-restyle.md", "Component-layer restyle contract: keep shadcn-class behavior guarantees, remap the look to the working project's own tokens — the escape route from the generic shadcn face"],
      ["docs/design-system/absorption-criteria.md", "Decision rules for absorbing external expressive libraries: what becomes a canonical recipe, what stays a link reference, what waits"],
      ["docs/design-system/no-asset-fallback.md", "What to build from when a term has NO recipe and NO code asset (481 of 562 terms): use the term entry itself as material — visual_anatomy as a parts checklist, anti_use as the boundary, related as the neighbour diff. A missing recipe must not stop the work"],
      ["docs/ui-vocabulary/term-asset-map.json", "Generated term↔recipe↔code-asset map: for any term, what exists to build it with. Empty recipes AND code_assets means take the no-asset-fallback path"],
    ],
  },
  {
    section: "Knowledge",
    items: [
      [
        "knowledge/expressive-stack.md",
        "Expressive stack tier map: which rendering tier (CSS/SVG, JS motion orchestration, " +
          "Canvas 2D + physics, WebGL/three.js) a visual effect belongs to, with a technique-to-tier " +
          "decision table and mandatory judgment procedure (lower tier first, reduced-motion gating, " +
          "lazy-load for GPU)",
      ],
    ],
  },
];

function repoRel(p) {
  return path.relative(REPO_ROOT, p).split(path.sep).join("/");
}

/** Parse minimal YAML frontmatter fields (id, name, pattern_group, status) from a recipe file. */
function parseRecipeFrontmatter(filePath) {
  const text = readFileSync(filePath, "utf8");
  // CRLF 체크아웃(Windows autocrlf)에서도 읽혀야 한다 — \n 만 보면 frontmatter 를 통째로 못 본다.
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`recipe has no frontmatter: ${repoRel(filePath)}`);
  const fields = {};
  // \r 로 쪼개야 한다 — JS 정규식에서 \r 은 줄 종결자라 `.` 가 먹지 못하고, 남겨두면 모든 필드가 null 이 된다.
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(id|name|pattern_group|status):\s*(.+)$/);
    if (m) fields[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
  return fields;
}

function collectRecipes() {
  const files = globSync("recipes/**/*.md", { cwd: REPO_ROOT }).sort();
  if (files.length === 0) throw new Error("no recipes found under recipes/");
  return files.map((rel) => {
    const abs = path.join(REPO_ROOT, rel);
    const fm = parseRecipeFrontmatter(abs);
    const desc = `${fm.name ?? fm.id} — ${fm.pattern_group} recipe (status: ${fm.status})`;
    return { rel: rel.split(path.sep).join("/"), desc };
  });
}

function copyAsset(rel, destRel = rel) {
  const src = path.join(REPO_ROOT, rel);
  if (!existsSync(src)) throw new Error(`SSOT source missing: ${rel}`);
  const dest = path.join(LLMS_DIR, destRel);
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  return `/llms/${destRel}`;
}

function main() {
  rmSync(LLMS_DIR, { recursive: true, force: true });
  mkdirSync(LLMS_DIR, { recursive: true });

  const lines = [];
  lines.push("# Askewly Design");
  lines.push("");
  lines.push(
    "> Agent-usable design system SSOT: 3-tier tokens, a cross-surface pattern taxonomy, and component recipes. This index links to raw assets derived from the same source the website uses — values live in the linked files, never here.",
  );
  lines.push("");
  lines.push("Generated by scripts/generate-llms-txt.mjs — do not edit by hand.");
  lines.push("Rules for consumers: reference semantic tokens, never hard-code color/dimension literals; follow each recipe's Checks and Anti-patterns sections.");

  const writtenUrls = [];

  for (const { section, items } of FIXED_ASSETS) {
    lines.push("");
    lines.push(`## ${section}`);
    lines.push("");
    for (const [rel, desc, destRel] of items) {
      const urlPath = copyAsset(rel, destRel);
      writtenUrls.push(urlPath);
      lines.push(`- [${destRel ?? rel}](${BASE_URL}${urlPath}): ${desc}`);
    }
  }

  lines.push("");
  lines.push("## Recipes");
  lines.push("");
  // RC2: recipe copies get a code-asset backlink injected when a registry asset matches.
  const regPath = path.join(SITE_PUBLIC, "r", "registry.json");
  const regNames = existsSync(regPath) ? JSON.parse(readFileSync(regPath, "utf8")).items.map((i) => i.name) : [];
  const assetFor = (recipeStem) => {
    if (regNames.includes(recipeStem)) return recipeStem;
    const hits = regNames.filter((n) => recipeStem.startsWith(n) || n.startsWith(recipeStem));
    return hits.length === 1 ? hits[0] : null;
  };
  for (const { rel, desc } of collectRecipes()) {
    const urlPath = copyAsset(rel);
    writtenUrls.push(urlPath);
    const stem = path.basename(rel, ".md");
    const asset = assetFor(stem);
    if (asset) {
      const dest = path.join(LLMS_DIR, rel);
      const md = readFileSync(dest, "utf8");
      const link =
        "> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: " +
        `fetch ${BASE_URL}/r/${asset}.json, write \`files[].content\` into the project, ` +
        "install the declared dependencies, THEN restyle the look to the project's own tokens " +
        "(mandatory — component-restyle.md). Prose below is the contract you verify against, " +
        "not the thing you rebuild.\n";
      // 레시피는 YAML frontmatter로 시작 — 첫 마크다운 헤딩 뒤에 주입, 헤딩 없는 레시피는 frontmatter 직후
      let injected = md.replace(/^(# .+\r?\n)/m, `$1\n${link}`);
      if (injected === md) injected = md.replace(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)/, `$1\n${link}`);
      if (injected === md) throw new Error(`code-asset link injection failed (no heading/frontmatter): ${rel}`);
      writeFileSync(dest, injected);
    }
    lines.push(`- [${rel}](${BASE_URL}${urlPath}): ${desc}${asset ? ` [code: /r/${asset}.json]` : ""}`);
  }

  // Code Assets (RC1): shadcn-registry-compatible verified implementations built by
  // scripts/generate-registry.mjs into public/r/ -- linked here, not copied (same public/ tree).
  const registryIndexPath = path.join(SITE_PUBLIC, "r", "registry.json");
  if (existsSync(registryIndexPath)) {
    const reg = JSON.parse(readFileSync(registryIndexPath, "utf8"));
    lines.push("## Code Assets (verified implementations)");
    lines.push("");
    lines.push(`Fetch the JSON, write files[].content into your project, install declared dependencies, then remap the look to your project's tokens per component-restyle.md. Human path: npx shadcn add ${BASE_URL}/r/<name>.json. Index: [r/registry.json](${BASE_URL}/r/registry.json)`);
    lines.push("");
    for (const item of reg.items) {
      writtenUrls.push(`/r/${item.name}.json`);
      lines.push(`- [r/${item.name}.json](${BASE_URL}/r/${item.name}.json): ${item.title} -- ${item.description}`);
    }
    lines.push("");
  }


  // Vocabulary (VL2): 562-term dictionary, published as a lightweight index + per-group shards.
  // 이 블록은 **샤드 생성을 직접 호출한다.** main() 첫 줄의 rmSync 가 LLMS_DIR 을 통째로 지우므로,
  // 샤드를 따로 만들어 두면 다음 재생성 때 조용히 사라진다(2026-07-21 실증: 배포 용어 562→0,
  // 끊긴 참조 0→91). 파이프라인에 묶어 두 산출물의 수명을 하나로 만든다.
  execFileSync(process.execPath, [path.join(REPO_ROOT, "scripts", "generate-vocabulary-shards.mjs")], {
    stdio: "pipe",
  });
  const vocabDirRel = "docs/ui-vocabulary/vocabulary";
  const vocabDir = path.join(LLMS_DIR, vocabDirRel);
  if (!existsSync(path.join(vocabDir, "index.md"))) {
    throw new Error("vocabulary shards were not produced — generate-vocabulary-shards.mjs 가 index.md 를 내지 않았다");
  }
  const shardFiles = readdirSync(vocabDir).filter((f) => f.endsWith(".yml")).sort();
  lines.push("## Vocabulary (562 UI terms)");
  lines.push("");
  lines.push(
    `Do NOT fetch the whole dictionary — the source is 665KB. Read the lookup contract first, then the index, then the ONE group shard you need (2–3 fetches). The raw ${"`docs/ui-vocabulary/terms.yml`"} is deliberately not published; a 404 there is expected.`,
  );
  lines.push("");
  for (const [rel, desc] of [
    ["docs/design-system/vocabulary-lookup.md", "How to look a term up: by name, by intent (category axis), and what to do when the concept is not in the dictionary — a lookup miss must not stop the work"],
  ]) {
    const urlPath = copyAsset(rel);
    writtenUrls.push(urlPath);
    lines.push(`- [${rel}](${BASE_URL}${urlPath}): ${desc}`);
  }
  writtenUrls.push(`/llms/${vocabDirRel}/index.md`);
  lines.push(
    `- [${vocabDirRel}/index.md](${BASE_URL}/llms/${vocabDirRel}/index.md): Term index — ids and Korean names only, grouped by category then group. No definitions here; it tells you which shard to open`,
  );
  for (const f of shardFiles) {
    writtenUrls.push(`/llms/${vocabDirRel}/${f}`);
  }
  lines.push(
    `- Group shards (${shardFiles.length}): ${BASE_URL}/llms/${vocabDirRel}/<group>.yml — full term bodies (one_liner, visual_anatomy, when_to_use, anti_use, related). Group ids come from the index`,
  );
  lines.push("");

  writeFileSync(LLMS_TXT, lines.join("\n"));

  // Integrity check: every URL in the index must map to a file that now exists under public/.
  const broken = writtenUrls.filter((u) => !existsSync(path.join(SITE_PUBLIC, u.replace(/^\//, ""))));
  if (broken.length > 0) {
    throw new Error(`index links without backing files: ${broken.join(", ")}`);
  }

  console.log(`wrote ${repoRel(LLMS_TXT)} (${writtenUrls.length} assets copied to ${repoRel(LLMS_DIR)}/)`);
}

main();
