#!/usr/bin/env node
// PPTX export 트랙 (SP3) — slides.json → 편집 가능 PPTX. pptxgenjs 단일 정본 경로 (사용자 확정 2026-07-31).
// 이 매퍼는 빠른 파생용 — 고품질 PPTX 가 목표면 references/pptx-bespoke.md (덱 전용 코드 + 미세조정 루프).
// 계약: 차트는 addChart 네이티브만(이미지 폴백 금지) · 텍스트는 텍스트박스/AUTO_SHAPE(비트맵 금지)
//       · 산출물은 파생 — 손편집 금지, 재생성으로만 · 팔레트는 theme.mjs/theme.json 판독(하드코딩 금지).
// 사용: 덱 루트에서 `node tools/export-pptx.mjs [out.pptx]`
// 의존성: pptxgenjs — 덱/상위 node_modules 에서 해석, 없으면 `npm install pptxgenjs` 안내 후 종료.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function resolvePptxgen() {
  const candidates = [root, path.join(root, '..'), path.join(root, '..', '..'), scriptDir];
  for (const dir of candidates) {
    try {
      return createRequire(path.join(dir, 'noop.js'))('pptxgenjs');
    } catch { /* 다음 후보 */ }
  }
  console.error('pptxgenjs is not importable. Run `npm install pptxgenjs` in this deck (or a parent) and retry.');
  process.exit(1);
}

const deck = JSON.parse(fs.readFileSync(path.join(root, 'content', 'slides.json'), 'utf8'));
const themeModuleUrl = new URL('./src/theme.mjs', import.meta.url);
const { THEME_ROOTS } = await import(themeModuleUrl);

// --- 팔레트 판독 -----------------------------------------------------------
function firstHex(value) {
  const m = String(value || '').match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return h.toUpperCase();
}

function readVars() {
  const template = deck.meta?.template || 'light';
  if (template === 'custom') {
    const themePath = path.join(root, 'content', 'theme.json');
    if (!fs.existsSync(themePath)) {
      console.error('meta.template "custom" requires content/theme.json');
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(themePath, 'utf8')).vars;
  }
  const rootCss = THEME_ROOTS[template] || THEME_ROOTS.light;
  const vars = {};
  for (const m of rootCss.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

const vars = readVars();
const PALETTE_KEYS = {
  bg: 'bg-primary', card: 'surface-raised', border: 'border-card',
  text: 'text-primary', sub: 'text-secondary', muted: 'text-muted',
  accent: 'accent-start', accent2: 'accent-end',
  chart1: 'chart-1', chart2: 'chart-2', chart3: 'chart-3', chart4: 'chart-4',
};
const C = {};
const unreadable = [];
for (const [k, varName] of Object.entries(PALETTE_KEYS)) {
  // gradient/color-mix 는 첫 hex 로 근사한다 (CSS 전용 값은 PPTX 로 못 간다)
  const hex = firstHex(vars[varName]);
  if (!hex) unreadable.push(varName);
  C[k] = hex;
}
if (unreadable.length) {
  console.error(`테마 변수에서 hex 를 판독하지 못했다 (기본값 미채움): ${unreadable.join(', ')}`);
  process.exit(1);
}
C.chart = [C.chart1, C.chart2, C.chart3, C.chart4];
const fontMain = String(vars['font-main'] || 'Pretendard');
const FONT = (fontMain.match(/'([^']+)'|^([\w-]+)/)?.[1] || 'Pretendard').replace(/\s*Variable$/, '');

// --- PPTX 조립 -------------------------------------------------------------
const pptxgen = resolvePptxgen();
const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.title = deck.meta.title;

const W = 13.333, H = 7.5;
const NATIVE_LAYOUTS = new Set(['cover', 'closing', 'hero-cards', 'summary-grid', 'comparison-2col', 'step-flow', 'chart-interactive']);

function addKicker(slide, text) {
  if (!text) return;
  slide.addText(String(text).toUpperCase(), { x: 0.7, y: 0.35, w: W - 1.4, h: 0.3, fontFace: FONT, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
}
function addTitle(slide, text, opts = {}) {
  slide.addText(text, { x: 0.7, y: opts.y ?? 0.68, w: W - 1.4, h: 0.9, fontFace: FONT, fontSize: opts.size ?? 30, bold: true, color: C.text, align: opts.align ?? 'left' });
}
function addSubtitle(slide, text, y = 1.5) {
  if (!text) return;
  slide.addText(text, { x: 0.7, y, w: W - 1.4, h: 0.5, fontFace: FONT, fontSize: 14, color: C.sub });
}
function addFooter(slide, no, total) {
  slide.addText(`${String(no).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, { x: 0.7, y: H - 0.5, w: 1.2, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted });
  slide.addText(deck.meta.title, { x: W - 3.4, y: H - 0.5, w: 2.7, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, align: 'right' });
}
function addCards(slide, items, { y = 2.1, cardH = 2.6, cols = null } = {}) {
  const columns = cols ?? (Math.min(items.length, 4) || 1);
  const gap = 0.35;
  const cw = (W - 1.4 - gap * (columns - 1)) / columns;
  items.forEach((item, i) => {
    const cx = 0.7 + (i % columns) * (cw + gap);
    const cy = y + Math.floor(i / columns) * (cardH + gap);
    slide.addShape('roundRect', { x: cx, y: cy, w: cw, h: cardH, rectRadius: 0.08, fill: { color: C.card }, line: { color: C.border, width: 1 } });
    slide.addText(String(i + 1).padStart(2, '0'), { x: cx + 0.25, y: cy + 0.2, w: cw - 0.5, h: 0.3, fontFace: FONT, fontSize: 11, bold: true, color: C.accent });
    slide.addText(item.title || item.label || '', { x: cx + 0.25, y: cy + 0.55, w: cw - 0.5, h: 0.5, fontFace: FONT, fontSize: 17, bold: true, color: C.text });
    if (item.body) slide.addText(item.body, { x: cx + 0.25, y: cy + 1.1, w: cw - 0.5, h: cardH - 1.3, fontFace: FONT, fontSize: 12, color: C.sub, valign: 'top' });
  });
}

const total = deck.slides.length;
const fallbacks = [];
for (const s of deck.slides) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  if (s.notes) slide.addNotes(s.notes);

  switch (NATIVE_LAYOUTS.has(s.layout) ? s.layout : 'fallback') {
    case 'cover': {
      slide.addText(s.title, { x: 0.7, y: 2.6, w: W - 1.4, h: 1.2, fontFace: FONT, fontSize: 54, bold: true, color: C.text, align: 'center' });
      slide.addText(s.subtitle || '', { x: 0.7, y: 3.9, w: W - 1.4, h: 0.6, fontFace: FONT, fontSize: 20, color: C.sub, align: 'center' });
      const chips = (s.items || []).map((c) => c.label).filter(Boolean).join('   ·   ');
      if (chips) slide.addText(chips, { x: 0.7, y: 4.8, w: W - 1.4, h: 0.4, fontFace: FONT, fontSize: 13, color: C.muted, align: 'center' });
      break;
    }
    case 'chart-interactive': {
      addKicker(slide, s.kicker);
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      slide.addChart(pptx.charts.BAR, [{
        name: s.chartLabel || s.title,
        labels: (s.items || []).map((i) => i.label),
        values: (s.items || []).map((i) => Number(i.value)),
      }], {
        x: 1.2, y: 1.9, w: W - 2.4, h: 4.4,
        barDir: 'bar', chartColors: C.chart, catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT,
        dataLabelFontFace: FONT, showValue: true, dataLabelColor: C.sub, dataLabelFontSize: 11,
        catAxisLabelFontSize: 12, valAxisLabelFontSize: 10,
      });
      if (s.sourceNote) slide.addText(s.sourceNote, { x: 0.7, y: 6.6, w: W - 1.4, h: 0.35, fontFace: FONT, fontSize: 10, color: C.muted, align: 'right' });
      break;
    }
    case 'step-flow': {
      addKicker(slide, s.kicker);
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      const items = s.items || [];
      const gap = 0.55, cw = (W - 1.4 - gap * (items.length - 1)) / (items.length || 1);
      items.forEach((item, i) => {
        const cx = 0.7 + i * (cw + gap);
        slide.addShape('roundRect', { x: cx, y: 3.0, w: cw, h: 1.9, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.border, width: 1 } });
        slide.addText(`${i + 1}`, { x: cx + 0.18, y: 3.15, w: 0.6, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: C.accent });
        slide.addText(item.title || '', { x: cx + 0.18, y: 3.6, w: cw - 0.36, h: 0.45, fontFace: FONT, fontSize: 15, bold: true, color: C.text });
        slide.addText(item.body || '', { x: cx + 0.18, y: 4.1, w: cw - 0.36, h: 0.7, fontFace: FONT, fontSize: 11, color: C.sub });
        if (i < items.length - 1) slide.addText('→', { x: cx + cw + gap / 2 - 0.18, y: 3.7, w: 0.36, h: 0.5, fontFace: FONT, fontSize: 18, color: C.muted, align: 'center' });
      });
      break;
    }
    case 'closing': {
      addTitle(slide, s.title, { y: 1.5, size: 40, align: 'center' });
      addCards(slide, s.items || [], { y: 3.0, cardH: 2.0 });
      break;
    }
    case 'comparison-2col': {
      addKicker(slide, s.kicker);
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      addCards(slide, s.items || [], { y: 2.1, cardH: 2.2, cols: 2 });
      break;
    }
    case 'fallback': {
      fallbacks.push(`${s.no}:${s.layout}`);
      addKicker(slide, s.kicker);
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle || s.exportFallback);
      if (Array.isArray(s.items) && s.items.length) addCards(slide, s.items);
      break;
    }
    default: { // hero-cards, summary-grid — 카드형 공통
      addKicker(slide, s.kicker);
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      addCards(slide, s.items || []);
    }
  }
  addFooter(slide, s.no, total);
}

if (fallbacks.length) {
  console.error(`카드 폴백 처리된 레이아웃 (네이티브 매핑 없음): ${fallbacks.join(', ')}`);
}

const outArg = process.argv[2];
const outPath = outArg
  ? path.resolve(root, outArg)
  : path.join(root, 'export', `${(deck.meta.title || 'deck').replace(/[^\w가-힣-]+/g, '-').toLowerCase()}.pptx`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
await pptx.writeFile({ fileName: outPath });
console.log('wrote', outPath, fallbacks.length ? `(fallback ${fallbacks.length})` : '');
