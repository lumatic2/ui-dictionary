#!/usr/bin/env node
// Lints tokens/askewly.tokens.json (DTCG-style SSOT) for:
//   1. alias reference resolution (missing / circular)
//   2. tier direction (component -> semantic -> primitive, one-way, no skipping)
//   3. orphan primitives (warning only)
//   4. WCAG AA (4.5:1) body-text contrast pairs, light + dark
//
// Usage: node scripts/lint-tokens.mjs

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadTokens,
  isAlias,
  aliasTarget,
  tierOf,
  getNode,
  resolveLiteral,
  resolveModeLiteral,
  walkLeaves,
  parseColorToLinearRgb,
  contrastRatio,
  TokenError,
} from "./lib/token-resolve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = path.resolve(__dirname, "..", "tokens", "askewly.tokens.json");

const CONTRAST_PAIRS = [
  ["text.default", "surface.base"],
  ["text.default", "surface.raised"],
  ["text.default", "surface.muted"],
  ["text.muted", "surface.base"],
  ["text.secondary", "surface.secondary"],
  ["text.on-accent", "action.primary"],
  ["accent.foreground", "accent.base"],
];
const CONTRAST_MIN = 4.5;

function main() {
  const root = loadTokens(TOKENS_PATH);
  const errors = [];
  const warnings = [];
  let checkedCount = 0;

  const referencedPrimitives = new Set();

  walkLeaves(root, [], (tokenPath, node) => {
    const tier = tierOf(tokenPath);

    const sites = [{ ctx: "light", raw: node.$value }];
    const darkRaw = node.$extensions?.["com.askewly.modes"]?.dark;
    if (darkRaw !== undefined) sites.push({ ctx: "dark", raw: darkRaw });

    for (const site of sites) {
      checkedCount += 1;

      if (tier === "primitive") {
        if (isAlias(site.raw)) {
          errors.push(
            `primitive token "${tokenPath}" (${site.ctx}) must be a literal value, found alias reference ${site.raw}`,
          );
          continue;
        }
        // DTCG stable 2025.10: color $value must be a { colorSpace, components, alpha?, hex? }
        // object, never a bare color string (e.g. "oklch(...)" or "#hex").
        if (typeof site.raw === "string") {
          errors.push(
            `primitive color token "${tokenPath}" (${site.ctx}) must be a { colorSpace, components } object per DTCG stable 2025.10, found string value ${JSON.stringify(site.raw)}`,
          );
        } else if (typeof site.raw !== "object" || site.raw === null || Array.isArray(site.raw)) {
          errors.push(
            `primitive color token "${tokenPath}" (${site.ctx}) must be a { colorSpace, components } object, found ${JSON.stringify(site.raw)}`,
          );
        } else {
          if (typeof site.raw.colorSpace !== "string" || site.raw.colorSpace.length === 0) {
            errors.push(`primitive color token "${tokenPath}" (${site.ctx}) is missing a string "colorSpace"`);
          }
          if (!Array.isArray(site.raw.components)) {
            errors.push(`primitive color token "${tokenPath}" (${site.ctx}) is missing a "components" array`);
          }
        }
        continue;
      }

      if (tier === "semantic" || tier === "component") {
        if (!isAlias(site.raw)) {
          errors.push(
            `${tier} token "${tokenPath}" (${site.ctx}) must reference a lower tier via alias, found literal value ${JSON.stringify(site.raw)}`,
          );
          continue;
        }

        const target = aliasTarget(site.raw);
        const targetTier = tierOf(target);
        const expectedTier = tier === "component" ? "semantic" : "primitive";

        if (targetTier !== expectedTier) {
          errors.push(
            `tier violation: "${tokenPath}" (${tier}, ${site.ctx}) references "{${target}}" (${targetTier ?? "unknown"}), expected a ${expectedTier} reference`,
          );
          continue;
        }

        try {
          const { chain } = resolveLiteral(root, site.raw, tokenPath);
          for (const visitedPath of chain) {
            if (tierOf(visitedPath) === "primitive") referencedPrimitives.add(visitedPath);
          }
        } catch (err) {
          if (err instanceof TokenError) errors.push(`${err.message} (site: "${tokenPath}" ${site.ctx})`);
          else throw err;
        }
        continue;
      }

      // Non-color tokens (dimension, typography): no tier rule, but still validate
      // alias resolution if one is ever used.
      if (isAlias(site.raw)) {
        try {
          resolveLiteral(root, site.raw, tokenPath);
        } catch (err) {
          if (err instanceof TokenError) errors.push(`${err.message} (site: "${tokenPath}" ${site.ctx})`);
          else throw err;
        }
      }
    }
  });

  // Orphan check: every color.primitive.* leaf must be referenced by at least one
  // semantic/component token (light or dark).
  const primitiveLeaves = [];
  walkLeaves(root.color.primitive, ["color", "primitive"], (tokenPath) => primitiveLeaves.push(tokenPath));
  for (const primPath of primitiveLeaves) {
    if (!referencedPrimitives.has(primPath)) {
      warnings.push(`orphan primitive token "${primPath}" is not referenced by any semantic/component token`);
    }
  }

  // WCAG AA contrast checks, light + dark.
  for (const mode of ["light", "dark"]) {
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fgPath = `color.semantic.${fgKey}`;
      const bgPath = `color.semantic.${bgKey}`;
      checkedCount += 1;
      try {
        const fgLiteral = resolveModeLiteral(root, fgPath, mode);
        const bgLiteral = resolveModeLiteral(root, bgPath, mode);
        const ratio = contrastRatio(parseColorToLinearRgb(fgLiteral), parseColorToLinearRgb(bgLiteral));
        if (ratio < CONTRAST_MIN) {
          errors.push(
            `WCAG AA fail [${mode}] "${fgKey}" on "${bgKey}": ${ratio.toFixed(2)}:1 (< ${CONTRAST_MIN}:1)`,
          );
        }
      } catch (err) {
        if (err instanceof TokenError) errors.push(`${err.message} (contrast pair: [${mode}] ${fgKey}/${bgKey})`);
        else throw err;
      }
    }
  }

  // Report.
  const status = errors.length === 0 ? "PASS" : "FAIL";
  console.log(`\n${status} — token lint (${TOKENS_PATH.replace(process.cwd() + path.sep, "")})`);
  console.log(`  checks run:   ${checkedCount}`);
  console.log(`  errors:       ${errors.length}`);
  console.log(`  warnings:     ${warnings.length}`);

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  - ${w}`);
  }
  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const e of errors) console.log(`  - ${e}`);
  }
  console.log("");

  process.exitCode = errors.length > 0 ? 1 : 0;
}

main();
