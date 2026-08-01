#!/usr/bin/env node
// M14 step-3: 기계화 회수 diff — push 장부 vs 회수 스냅숏 전수 대조.
// 사용: node scripts/figma-return-diff.mjs <push.json> <current.json>
//        node scripts/figma-return-diff.mjs --self-test
// 입력은 figma-push-snapshot.mjs 페이로드의 반환 JSON({ rootId, nodes: [...] }).
// 출력: 노드별 변경 필드 목록(JSON). 텍스트는 눈이 아니라 charCode로 대조한다
//   (U+2028 등 은닉 줄바꿈 — research/figma-roundtrip-pilot-2026-07.md 함정).

import { readFileSync } from 'node:fs';

const BREAK_CODES = [10, 13, 8232, 8233];
const COMPARED = ['name', 'x', 'y', 'width', 'height', 'fills', 'strokes', 'strokeWeight',
  'cornerRadius', 'padding', 'itemSpacing', 'characters', 'fontSize', 'fontName', 'lineHeight'];

function charDiff(a = '', b = '') {
  if (a === b) return null;
  const codes = (s) => {
    const out = [];
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (BREAK_CODES.includes(c)) out.push({ pos: i, code: c });
    }
    return out;
  };
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return { firstDivergence: i, pushBreaks: codes(a), currentBreaks: codes(b), pushLen: a.length, currentLen: b.length };
}

export function diffSnapshots(push, current) {
  const pushMap = new Map(push.nodes.map((n) => [n.id, n]));
  const curMap = new Map(current.nodes.map((n) => [n.id, n]));
  const changed = [], added = [], removed = [];
  for (const [id, p] of pushMap) {
    const c = curMap.get(id);
    if (!c) { removed.push({ id, name: p.name }); continue; }
    const fields = {};
    for (const k of COMPARED) {
      if (!(k in p) && !(k in c)) continue;
      if (k === 'characters') {
        const d = charDiff(p.characters, c.characters);
        if (d) fields.characters = d;
      } else if (JSON.stringify(p[k]) !== JSON.stringify(c[k])) {
        fields[k] = { push: p[k], current: c[k] };
      }
    }
    if (Object.keys(fields).length) changed.push({ id, name: p.name, type: p.type, fields });
  }
  for (const [id, c] of curMap) if (!pushMap.has(id)) added.push({ id, name: c.name, type: c.type });
  return { changed, added, removed, unchangedCount: push.nodes.length - changed.length - removed.length };
}

function selfTest() {
  // 함정 1: U+2028 은닉 — 시각적으로 같은 두 문자열의 diff 가 breakCodes 로 드러나야 한다
  const sep = String.fromCharCode(8232);
  const push = { rootId: 't', nodes: [
    { id: '1:1', name: 'h1', type: 'TEXT', characters: 'system for design', fontSize: 152 },
    { id: '1:2', name: 'box', type: 'FRAME', width: 100, height: 50, fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] },
    { id: '1:3', name: 'gone', type: 'TEXT', characters: 'x' },
  ] };
  const current = { rootId: 't', nodes: [
    { id: '1:1', name: 'h1', type: 'TEXT', characters: 'system for' + sep + 'design', fontSize: 128 },
    { id: '1:2', name: 'box', type: 'FRAME', width: 100, height: 50, fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] },
    { id: '1:4', name: 'new', type: 'FRAME', width: 10, height: 10 },
  ] };
  const r = diffSnapshots(push, current);
  const t1 = r.changed.find((n) => n.id === '1:1');
  const assert = (cond, msg) => { if (!cond) { console.error(`SELF-TEST FAIL: ${msg}`); process.exit(1); } };
  assert(t1, 'h1 변경 미검출');
  assert(t1.fields.characters.currentBreaks.some((b) => b.code === 8232), 'U+2028 은닉 줄바꿈 미검출');
  assert(t1.fields.fontSize.push === 152 && t1.fields.fontSize.current === 128, 'fontSize diff 오류');
  assert(r.changed.length === 1, `무변경 노드 오검출 (changed=${r.changed.length})`);
  assert(r.removed.length === 1 && r.removed[0].id === '1:3', '삭제 노드 미검출');
  assert(r.added.length === 1 && r.added[0].id === '1:4', '추가 노드 미검출');
  console.log('SELF-TEST PASS: U+2028 검출·속성 diff·무변경 무음·추가/삭제 검출 4항');
}

const [a, b] = process.argv.slice(2);
if (a === '--self-test') {
  selfTest();
} else if (a && b) {
  const push = JSON.parse(readFileSync(a, 'utf8'));
  const current = JSON.parse(readFileSync(b, 'utf8'));
  const r = diffSnapshots(push, current);
  console.log(JSON.stringify(r, null, 2));
  console.error(`changed=${r.changed.length} added=${r.added.length} removed=${r.removed.length} unchanged=${r.unchangedCount}`);
} else {
  console.error('usage: node scripts/figma-return-diff.mjs <push.json> <current.json> | --self-test');
  process.exit(1);
}
