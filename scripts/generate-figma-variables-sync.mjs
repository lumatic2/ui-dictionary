#!/usr/bin/env node
// Generate idempotent Figma variables sync payloads from tokens/askewly.tokens.json.
// Contract: docs/design-system/figma-bridge-contract.md §2 (ADR 0003).
// Output: tmp/figma-sync-1-primitive.js, tmp/figma-sync-2-semantic.js
// Each payload is a self-contained `use_figma` script (upsert by name, own-collection-only deletes).

// M35: ① 계약 §2.2 의 변수 description 복사(7월부터 미구현) ② 쓰기 전 현재 상태를 뜨는
//   읽기 모드(--read) ③ 삭제를 끄는 스위치(--no-remove, 기본값은 계약 §2.4 대로 삭제).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens/askewly.tokens.json'), 'utf8'));

// --- oklch -> sRGB (0..1), standard OKLab matrices ---
function oklchToSrgb([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return lin.map((c) => {
    const g = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, Number(g.toFixed(6))));
  });
}

function colorValue(v) {
  const [r, g, b] = v.colorSpace === 'oklch' ? oklchToSrgb(v.components) : v.components.map((c) => Number(c.toFixed(6)));
  return { r, g, b };
}

const refName = (ref) => ref.slice(1, -1).replaceAll('.', '/'); // "{color.primitive.gray.1}" -> "color/primitive/gray/1"

const SCOPES = [
  [/^color\/semantic\/surface\//, ['FRAME_FILL', 'SHAPE_FILL']],
  [/^color\/semantic\/text\//, ['TEXT_FILL']],
  [/^color\/semantic\/border\//, ['STROKE_COLOR']],
  [/^color\/semantic\//, ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR', 'TEXT_FILL']],
  [/^color\/component\/.*\/(bg|background)$/, ['FRAME_FILL', 'SHAPE_FILL']],
  [/^color\/component\/.*\/text$/, ['TEXT_FILL']],
  [/^color\//, ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR', 'TEXT_FILL']],
  [/^dimension\/space\//, ['GAP', 'WIDTH_HEIGHT']],
  [/^dimension\/radius\//, ['CORNER_RADIUS']],
  [/^typography\/scale\//, ['FONT_SIZE']],
  [/^typography\/weight\//, ['FONT_WEIGHT']],
  [/^typography\/font\//, ['FONT_FAMILY']],
  [/^dimension\/size\//, ['WIDTH_HEIGHT']],
  [/^dimension\/z-index\//, []], // Figma에 대응 scope 없음 — picker 비노출
  [/^motion\/duration\//, []], // Figma에 대응 scope 없음 — picker 비노출
];
const scopesFor = (name) => SCOPES.find(([re]) => re.test(name))[1];

// --- flatten DTCG tree ---
const primitives = []; // { name, type: 'COLOR'|'FLOAT'|'STRING', value, description? }
const aliases = [];    // { name, light, dark, description? } — alias targets by variable name

// 계약 §2.2: 변수 description 에 SSOT 의 $description 요지를 복사한다(MCP search 신호).
// 빈 값으로 덮어쓰지 않는다 — 사람이 Figma 에서 적어 둔 설명을 지울 수 있어 **필드를 생략**한다.
const desc = (v) => {
  const d = v.$description;
  return typeof d === 'string' && d.trim() ? { description: d.trim() } : {};
};

function walk(node, path) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    const p = [...path, k];
    if (typeof v === 'object' && v !== null && !('$value' in v)) { walk(v, p); continue; }
    const name = p.join('/');
    const val = v.$value;
    const dark = v.$extensions?.['com.askewly.modes']?.dark;
    if (typeof val === 'string' && val.startsWith('{')) {
      aliases.push({ name, light: refName(val), dark: dark ? refName(dark) : refName(val), ...desc(v) });
    } else if (typeof val === 'object' && 'colorSpace' in val) {
      primitives.push({ name, type: 'COLOR', value: colorValue(val), ...desc(v) });
    } else if (typeof val === 'object' && 'unit' in val) {
      // Figma FLOAT 변수는 px 기준 — rem 토큰은 ×16 환산 (px·ms는 수치 그대로)
      primitives.push({ name, type: 'FLOAT', value: val.unit === 'rem' ? val.value * 16 : val.value, ...desc(v) });
    } else if (Array.isArray(val)) {
      primitives.push({ name, type: 'STRING', value: val[0], ...desc(v) });
    } else if (typeof val === 'number') {
      primitives.push({ name, type: 'FLOAT', value: val, ...desc(v) });
    } else {
      throw new Error(`unhandled token ${name}: ${JSON.stringify(val)}`);
    }
  }
}
walk(tokens, []);

const withScopes = (list) => list.map((t) => ({ ...t, scopes: scopesFor(t.name) }));

// JSON.stringify 는 U+2028/U+2029 를 **날것으로** 내보낸다. JS 소스로는 합법이지만 use_figma 의
// 파서는 이것을 줄바꿈으로 읽어 SyntaxError 를 낸다(M14 실측 함정). 직렬화 지점에서 이스케이프한다.
const embed = (v) => JSON.stringify(v).split(String.fromCharCode(8232)).join(String.fromCharCode(92) + 'u2028').split(String.fromCharCode(8233)).join(String.fromCharCode(92) + 'u2029');

// --no-remove: 계약 §2.4 의 orphan 삭제를 끈다. 기본값은 계약대로 삭제 — 초안이 "이번엔 삭제 안 함"
// 이라고 적었을 때 실제 페이로드에는 v.remove() 가 박혀 있었다(승인 문구와 코드가 어긋난 사고 방지).
const NO_REMOVE = process.argv.includes('--no-remove');
const REMOVE_BLOCK = NO_REMOVE
  ? [
      '// --no-remove: orphan 삭제를 끈 페이로드다. 남은 변수는 목록으로만 보고한다.',
      'const orphans = [...existing.keys()];',
    ].join(String.fromCharCode(10))
  : [
      'for (const [, v] of existing) { v.remove(); removed++; }',
      'const orphans = [];',
    ].join(String.fromCharCode(10));

// --read: 쓰기를 하나도 하지 않는 읽기 페이로드. 쓰기 전 현재 상태를 떠 두는 롤백 근거용.
const READ_PAYLOAD = `
// GENERATED by scripts/generate-figma-variables-sync.mjs --read — do not edit by hand.
// READ-ONLY: askewly/* 컬렉션의 현재 변수 상태를 뜬다. 어떤 쓰기 호출도 하지 않는다.
const out = [];
const cols = await figma.variables.getLocalVariableCollectionsAsync();
for (const col of cols) {
  if (!col.name.startsWith('askewly/')) continue;
  const modes = col.modes.map(m => ({ modeId: m.modeId, name: m.name }));
  for (const id of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (!v) continue;
    out.push({ collection: col.name, name: v.name, type: v.resolvedType, description: v.description, scopes: v.scopes,
      valuesByMode: modes.map(m => ({ mode: m.name, value: v.valuesByMode[m.modeId] })) });
  }
}
return { capturedAt: 'read-only snapshot', collections: cols.filter(c => c.name.startsWith('askewly/')).map(c => c.name), count: out.length, variables: out };
`;

const payload1 = `
// GENERATED by scripts/generate-figma-variables-sync.mjs — do not edit by hand.
// Sync 1/2: askewly/primitive collection (single mode). Idempotent upsert by name.
const SPEC = ${embed(withScopes(primitives))};
const COLLECTION = 'askewly/primitive';
const all = await figma.variables.getLocalVariableCollectionsAsync();
let col = all.find(c => c.name === COLLECTION);
if (!col) col = figma.variables.createVariableCollection(COLLECTION);
if (col.modes[0].name !== 'default') col.renameMode(col.modes[0].modeId, 'default');
const modeId = col.modes[0].modeId;
const existing = new Map();
for (const id of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v) existing.set(v.name, v);
}
let created = 0, updated = 0;
for (const t of SPEC) {
  let v = existing.get(t.name);
  if (!v) { v = figma.variables.createVariable(t.name, col, t.type); created++; }
  else updated++;
  v.scopes = t.scopes;
  if (t.description) v.description = t.description;
  v.setValueForMode(modeId, t.value);
  existing.delete(t.name);
}
let removed = 0;
${REMOVE_BLOCK}
return { collection: COLLECTION, collectionId: col.id, created, updated, removed, total: SPEC.length };
`;

const payload2 = `
// GENERATED by scripts/generate-figma-variables-sync.mjs — do not edit by hand.
// Sync 2/2: askewly/semantic collection (modes light/dark), values = aliases to askewly/primitive vars.
const SPEC = ${embed(withScopes(aliases))};
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const prim = cols.find(c => c.name === 'askewly/primitive');
if (!prim) throw new Error('run sync 1/2 first: askewly/primitive missing');
const primVars = new Map();
for (const id of prim.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v) primVars.set(v.name, v);
}
let col = cols.find(c => c.name === 'askewly/semantic');
if (!col) col = figma.variables.createVariableCollection('askewly/semantic');
if (col.modes[0].name !== 'light') col.renameMode(col.modes[0].modeId, 'light');
let darkMode = col.modes.find(m => m.name === 'dark');
const darkId = darkMode ? darkMode.modeId : col.addMode('dark');
const lightId = col.modes[0].modeId;
const existing = new Map();
for (const id of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v) existing.set(v.name, v);
}
const semVars = new Map();
let created = 0, updated = 0;
for (const t of SPEC) {
  let v = existing.get(t.name);
  if (!v) { v = figma.variables.createVariable(t.name, col, 'COLOR'); created++; }
  else updated++;
  v.scopes = t.scopes;
  if (t.description) v.description = t.description;
  semVars.set(t.name, v);
  existing.delete(t.name);
}
const resolve = (name) => primVars.get(name) || semVars.get(name);
const unresolved = [];
for (const t of SPEC) {
  const v = semVars.get(t.name);
  const L = resolve(t.light), D = resolve(t.dark);
  if (!L || !D) { unresolved.push(t.name); continue; }
  v.setValueForMode(lightId, figma.variables.createVariableAlias(L));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(D));
}
let removed = 0;
${REMOVE_BLOCK}
return { collection: 'askewly/semantic', collectionId: col.id, created, updated, removed, total: SPEC.length, unresolved };
`;

mkdirSync(resolve(root, 'tmp'), { recursive: true });
if (process.argv.includes('--read')) {
  const p = resolve(root, 'tmp/figma-read-variables.js');
  writeFileSync(p, READ_PAYLOAD.trim() + String.fromCharCode(10));
  console.log(`read-only payload written: ${p} (${READ_PAYLOAD.length} chars)`);
  process.exit(0);
}
writeFileSync(resolve(root, 'tmp/figma-sync-1-primitive.js'), payload1.trim() + '\n');
writeFileSync(resolve(root, 'tmp/figma-sync-2-semantic.js'), payload2.trim() + '\n');
console.log(`primitive vars: ${primitives.length}, semantic/component aliases: ${aliases.length}`);
console.log(`payload sizes: ${payload1.length}, ${payload2.length} chars (use_figma limit 50000)`);
