// Shared resolver utilities for tokens/askewly.tokens.json (DTCG-style SSOT).
// Used by scripts/lint-tokens.mjs and scripts/generate-tokens.mjs.
// Node stdlib only - no dependencies.

import { readFileSync } from "node:fs";

export class TokenError extends Error {}

export function loadTokens(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const ALIAS_RE = /^\{([a-zA-Z0-9_.-]+)\}$/;

export function isAlias(value) {
  return typeof value === "string" && ALIAS_RE.test(value);
}

export function aliasTarget(value) {
  const match = value.match(ALIAS_RE);
  return match ? match[1] : null;
}

/** Get the token node at a dot path (e.g. "color.primitive.gray.1"). Returns undefined if missing. */
export function getNode(root, dotPath) {
  const segments = dotPath.split(".");
  let node = root;
  for (const seg of segments) {
    if (node == null || typeof node !== "object" || !(seg in node)) return undefined;
    node = node[seg];
  }
  return node;
}

/** Tier of a color.* dot path: 'primitive' | 'semantic' | 'component'. Returns null for non-color paths. */
export function tierOf(dotPath) {
  const segments = dotPath.split(".");
  if (segments[0] !== "color") return null;
  return segments[1] ?? null;
}

/**
 * Resolve a raw token value (possibly an alias string) all the way down to a literal,
 * following alias chains. Throws TokenError on missing or circular references.
 * Returns { literal, chain } where chain is the list of dot paths visited (in order).
 */
export function resolveLiteral(root, rawValue, originPath, visited = []) {
  if (!isAlias(rawValue)) {
    return { literal: rawValue, chain: visited };
  }
  const target = aliasTarget(rawValue);
  if (visited.includes(target)) {
    throw new TokenError(`circular reference: ${[...visited, target].join(" -> ")}`);
  }
  const node = getNode(root, target);
  if (!node || typeof node !== "object" || !("$value" in node)) {
    throw new TokenError(`missing reference "{${target}}" (from ${originPath})`);
  }
  return resolveLiteral(root, node.$value, target, [...visited, target]);
}

/**
 * Resolve a semantic/component token's value for a given mode ('light' | 'dark'),
 * following the dark override in $extensions['com.askewly.modes'].dark when present
 * and mode === 'dark', then chasing aliases down to a literal.
 */
export function resolveModeLiteral(root, dotPath, mode) {
  const node = getNode(root, dotPath);
  if (!node || typeof node !== "object" || !("$value" in node)) {
    throw new TokenError(`unknown token path "${dotPath}"`);
  }
  const darkRaw = node.$extensions?.["com.askewly.modes"]?.dark;
  const raw = mode === "dark" && darkRaw !== undefined ? darkRaw : node.$value;
  return resolveLiteral(root, raw, dotPath).literal;
}

/** Depth-first walk over every leaf token (a node carrying $value) under `node`. */
export function walkLeaves(node, path, cb) {
  if (node && typeof node === "object" && "$value" in node) {
    cb(path.join("."), node);
    return;
  }
  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) continue;
      walkLeaves(node[key], [...path, key], cb);
    }
  }
}

// ---- Color parsing + WCAG contrast ----

function srgbToLinearChannel(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToLinearRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [srgbToLinearChannel(r), srgbToLinearChannel(g), srgbToLinearChannel(b)];
}

// OKLCH -> OKLab -> LMS -> linear sRGB (Björn Ottosson's standard matrices).
function oklchToLinearRgb(L, C, hueDeg) {
  const h = (hueDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [r, g, bl].map((c) => Math.min(1, Math.max(0, c)));
}

/**
 * Parse a DTCG stable 2025.10 color $value object ({ colorSpace, components, alpha?, hex? })
 * into linear-light sRGB [r, g, b] (each 0-1), for use in WCAG contrast math.
 */
export function parseColorToLinearRgb(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TokenError(`cannot parse color from non-object value: ${JSON.stringify(value)}`);
  }
  const { colorSpace, components } = value;
  if (colorSpace === "oklch") {
    const [L, C, H] = components;
    return oklchToLinearRgb(L, C, H);
  }
  if (colorSpace === "srgb") {
    const [r, g, b] = components;
    return [srgbToLinearChannel(r), srgbToLinearChannel(g), srgbToLinearChannel(b)];
  }
  throw new TokenError(`unsupported colorSpace: "${colorSpace}"`);
}

/**
 * Render a DTCG color $value object back to the CSS string it represents, matching
 * the exact literal syntax previously hand-authored in tokens/askewly.tokens.json
 * (oklch(L C H) for colorSpace "oklch"; the preserved brand hex for colorSpace "srgb").
 */
export function colorValueToCss(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TokenError(`cannot render color to CSS from non-object value: ${JSON.stringify(value)}`);
  }
  const { colorSpace, components, hex } = value;
  if (colorSpace === "oklch") {
    const [L, C, H] = components;
    return `oklch(${L} ${C} ${H})`;
  }
  if (colorSpace === "srgb") {
    if (hex) return hex;
    const [r, g, b] = components;
    const toHexByte = (c) => Math.round(c * 255).toString(16).padStart(2, "0");
    return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`.toUpperCase();
  }
  throw new TokenError(`unsupported colorSpace: "${colorSpace}"`);
}

export function relativeLuminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(rgbA, rgbB) {
  const lA = relativeLuminance(rgbA);
  const lB = relativeLuminance(rgbB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}
