#!/usr/bin/env node
// M14 step-3: 승격 스냅숏 장부 — use_figma 읽기 페이로드 생성기.
// 사용: node scripts/figma-push-snapshot.mjs <rootNodeId> [outPath]
//   생성된 JS를 use_figma 로 실행하면 서브트리 속성 스냅숏(JSON)이 반환된다.
//   승격 직후 1회(push 장부), 회수 시 1회(current) 실행해 figma-return-diff.mjs 로 대조한다.
// 교훈 반영(research/figma-roundtrip-pilot-2026-07.md): 줄바꿈은 charCode(10/13/8232/8233)로
//   수치 기록 — U+2028 리터럴을 페이로드에 넣으면 파서가 줄바꿈으로 해석해 SyntaxError.

// M35: 구간 분할. use_figma 의 반환은 20kb 에서 잘리고(M14 실측), 102노드 서브트리는
//   한 번에 못 받아 손으로 3번 나눠 우회했다. 인자로 나눌 수 있게 한다.
//   --from <i> --to <j>  루트의 직속 자식 인덱스 구간 [i, j] 만 걷는다. 루트 노드 자신은
//                        from 이 0 인 청크에만 들어간다(조립 시 중복 방지).
//   --roots <id,id,...>  직속 자식 수가 적어 인덱스로 못 자를 때, 노드 id 를 직접 지정한다.
//   인자가 없으면 **기존과 완전히 같은 단일 페이로드**를 낸다(회귀 금지).
//   조립 검사: --assemble <결과.json> ... [--expect <n>]  중복·누락을 id 집합으로 본다.

import { writeFileSync, readFileSync } from 'node:fs';

// 걷기 로직 하나만 둔다 — 페이로드에 심는 소스와 self-test 가 evaluate 하는 소스가 같은 문자열이다.
// 두 벌로 두면 분할 규칙이 조용히 갈라진다.
const WALK_SRC = `
const walkRange = (root, range) => {
  const out = [];
  const walk = (n) => { out.push(snap(n)); if ('children' in n && n.children) for (const c of n.children) walk(c); };
  if (!range) { walk(root); return out; }
  if (range.kind === 'children') {
    const kids = ('children' in root && root.children) ? root.children : [];
    if (range.from > range.to) throw new Error('invalid range: from > to');
    if (range.from < 0 || range.to >= kids.length) throw new Error('range out of bounds: children=' + kids.length);
    if (range.from === 0) out.push(snap(root));
    for (let i = range.from; i <= range.to; i++) walk(kids[i]);
    return out;
  }
  throw new Error('unknown range kind: ' + range.kind);
};
`;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
};

// --assemble: 청크 결과들을 합쳐 중복·누락을 판정한다(Figma 접속 불요).
if (argv.includes('--assemble')) {
  // 첫 후속 플래그에서 끊는다 — 안 끊으면 `--expect 4` 의 값 `4` 까지 파일로 읽는다(실측 버그).
  const rest = argv.slice(argv.indexOf('--assemble') + 1);
  const stop = rest.findIndex((a) => a.startsWith('--'));
  const files = stop === -1 ? rest : rest.slice(0, stop);
  if (!files.length) { console.error('usage: --assemble <result.json> [more.json ...] [--expect <n>]'); process.exit(1); }
  const seen = new Map();
  const dupes = [];
  for (const f of files) {
    const parsed = JSON.parse(readFileSync(f, 'utf8'));
    for (const n of parsed.nodes ?? []) {
      if (seen.has(n.id)) dupes.push(n.id);
      else seen.set(n.id, n);
    }
  }
  const expect = flag('--expect');
  const problems = [];
  if (dupes.length) problems.push(`중복 ${dupes.length}건: ${[...new Set(dupes)].slice(0, 5).join(', ')}`);
  if (expect && seen.size !== Number(expect)) problems.push(`누락/초과: 조립 ${seen.size} != 기대 ${expect}`);
  if (problems.length) {
    console.error(`assemble FAIL — ${problems.join(' · ')}`);
    process.exit(1);
  }
  console.log(`assemble OK — ${files.length} chunk(s), ${seen.size} unique node(s), 중복 0`);
  process.exit(0);
}

// --self-test: 분할·조립 규칙을 가짜 트리로 고정한다(Figma 불요).
if (argv.includes('--self-test')) {
  const node = (id, kids = []) => ({ id, name: id, type: 'FRAME', x: 0, y: 0, width: 1, height: 1, children: kids });
  const tree = node('0:1', [
    node('1:1', [node('1:2'), node('1:3')]),
    node('2:1', [node('2:2')]),
    node('3:1'),
  ]);
  const run = (range) => {
    const fn = new Function('root', 'range', 'snap', `${WALK_SRC}; return walkRange(root, range);`);
    return fn(tree, range, (n) => ({ id: n.id })).map((n) => n.id);
  };
  const cases = [];
  const full = run(null);
  cases.push(['범위 없음 = 전체', full.join(',') === '0:1,1:1,1:2,1:3,2:1,2:2,3:1']);
  const a = run({ kind: 'children', from: 0, to: 0 });
  const b = run({ kind: 'children', from: 1, to: 2 });
  cases.push(['첫 청크에만 루트', a.includes('0:1') && !b.includes('0:1')]);
  const merged = [...a, ...b];
  cases.push(['2분할 조립 = 단일 실행', new Set(merged).size === full.length && merged.length === full.length]);
  cases.push(['중복 0', merged.length === new Set(merged).size]);
  const missing = [...a, ...run({ kind: 'children', from: 1, to: 1 })];
  cases.push(['구간 빠뜨리면 조립이 모자란다', new Set(missing).size < full.length]);
  const throws = (r) => { try { run(r); return false; } catch { return true; } };
  cases.push(['역순 구간 거부', throws({ kind: 'children', from: 2, to: 1 })]);
  cases.push(['범위 초과 거부', throws({ kind: 'children', from: 0, to: 9 })]);
  let pass = 0;
  for (const [name, ok] of cases) { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}`); if (ok) pass++; }
  console.log(`figma-push-snapshot --self-test: ${pass}/${cases.length}`);
  process.exit(pass === cases.length ? 0 : 1);
}

const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--from', '--to', '--roots', '--expect'].includes(argv[i - 1])));
const rootId = positional[0];
if (!rootId) {
  console.error('usage: node scripts/figma-push-snapshot.mjs <rootNodeId> [outPath] [--from i --to j | --roots id,id]');
  console.error('       node scripts/figma-push-snapshot.mjs --assemble <result.json> ... [--expect n]');
  console.error('       node scripts/figma-push-snapshot.mjs --self-test');
  process.exit(1);
}
if (!/^[0-9]+:[0-9]+$/.test(rootId)) {
  console.error(`invalid node id: ${rootId} (expected "123:456")`);
  process.exit(1);
}
const outPath = positional[1] || 'tmp/figma-snapshot-payload.js';

const fromArg = flag('--from');
const toArg = flag('--to');
const rootsArg = flag('--roots');
if ((fromArg === null) !== (toArg === null)) {
  console.error('--from 과 --to 는 함께 준다');
  process.exit(1);
}
if (rootsArg !== null && fromArg !== null) {
  console.error('--roots 와 --from/--to 는 함께 쓸 수 없다');
  process.exit(1);
}
if (rootsArg !== null) {
  for (const id of rootsArg.split(',')) {
    if (!/^[0-9]+:[0-9]+$/.test(id.trim())) { console.error(`invalid node id in --roots: ${id}`); process.exit(1); }
  }
}
const range = fromArg === null ? null : { kind: 'children', from: Number(fromArg), to: Number(toArg) };
if (range && (!Number.isInteger(range.from) || !Number.isInteger(range.to))) {
  console.error('--from/--to 는 정수여야 한다');
  process.exit(1);
}
if (range && range.from > range.to) {
  console.error(`invalid range: from ${range.from} > to ${range.to}`);
  process.exit(1);
}
if (range && range.from < 0) {
  console.error('--from 은 0 이상이어야 한다');
  process.exit(1);
}

// 분할이 없으면 M14 가 쓰던 꼬리를 **글자 그대로** 유지한다 — 회수 diff 가 이 포맷에 의존한다.
const DEFAULT_TAIL = `const out = [];
const walk = (n) => { out.push(snap(n)); if ('children' in n) for (const c of n.children) walk(c); };
walk(root);
return { rootId: '${rootId}', capturedCount: out.length, nodes: out };`;

const chunkedTail = () => {
  if (rootsArg !== null) {
    const ids = rootsArg.split(',').map((s) => s.trim());
    return `${WALK_SRC}
const out = [];
for (const id of ${JSON.stringify(ids)}) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) throw new Error('node not found: ' + id);
  for (const s of walkRange(n, null)) out.push(s);
}
return { rootId: '${rootId}', chunk: { kind: 'roots', ids: ${JSON.stringify(ids)} }, capturedCount: out.length, nodes: out };`;
  }
  return `${WALK_SRC}
const out = walkRange(root, ${JSON.stringify(range)});
return { rootId: '${rootId}', chunk: ${JSON.stringify(range)}, capturedCount: out.length, nodes: out };`;
};

const tail = range === null && rootsArg === null ? DEFAULT_TAIL : chunkedTail();

const payload = `
// GENERATED by scripts/figma-push-snapshot.mjs — do not edit by hand.
// Read-only subtree property snapshot for node ${rootId}.
const BREAK_CODES = [10, 13, 8232, 8233]; // LF, CR, U+2028 LINE SEP, U+2029 PARA SEP
const root = await figma.getNodeByIdAsync('${rootId}');
if (!root) throw new Error('node not found: ${rootId}');
let page = root;
while (page && page.type !== 'PAGE') page = page.parent;
if (page && page.type === 'PAGE') await figma.setCurrentPageAsync(page);
const paint = (arr) => (Array.isArray(arr) ? arr : []).map((p) => ({
  type: p.type,
  color: p.type === 'SOLID' ? { r: Number(p.color.r.toFixed(6)), g: Number(p.color.g.toFixed(6)), b: Number(p.color.b.toFixed(6)) } : undefined,
  opacity: p.opacity,
  boundVar: p.boundVariables && p.boundVariables.color ? p.boundVariables.color.id : undefined,
}));
const snap = (n) => {
  const s = { id: n.id, name: n.name, type: n.type,
    x: Math.round(n.x), y: Math.round(n.y), width: Math.round(n.width), height: Math.round(n.height) };
  if ('fills' in n && n.fills !== figma.mixed) s.fills = paint(n.fills);
  if ('strokes' in n) s.strokes = paint(n.strokes);
  if ('strokeWeight' in n && n.strokeWeight !== figma.mixed) s.strokeWeight = n.strokeWeight;
  if ('cornerRadius' in n && n.cornerRadius !== figma.mixed) s.cornerRadius = n.cornerRadius;
  if ('paddingLeft' in n) { s.padding = [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft]; s.itemSpacing = n.itemSpacing; }
  if (n.type === 'TEXT') {
    s.characters = n.characters;
    s.breakCodes = [];
    for (let i = 0; i < n.characters.length; i++) {
      const c = n.characters.charCodeAt(i);
      if (BREAK_CODES.includes(c)) s.breakCodes.push({ pos: i, code: c });
    }
    if (n.fontSize !== figma.mixed) s.fontSize = n.fontSize;
    if (n.fontName !== figma.mixed) s.fontName = n.fontName.family + ' ' + n.fontName.style;
    if (n.lineHeight !== figma.mixed) s.lineHeight = n.lineHeight;
  }
  return s;
};
${tail}
`;

writeFileSync(outPath, payload.trim() + '\n');
// 함정 자기검사: 페이로드에 U+2028/U+2029 리터럴이 섞이면 use_figma 파서가 깨진다
for (let i = 0; i < payload.length; i++) {
  const c = payload.charCodeAt(i);
  if (c === 8232 || c === 8233) {
    console.error(`FATAL: payload contains literal U+${c.toString(16)} at ${i}`);
    process.exit(1);
  }
}
console.log(`payload written: ${outPath} (${payload.length} chars, use_figma limit 50000)`);
