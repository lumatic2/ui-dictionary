#!/usr/bin/env node
// PPTX bespoke export (PB2) — 이 덱 전용 코드. 계약: ~/.claude/skills/presentation-slides-yusung/references/pptx-bespoke.md
// 기준 이미지 = export/baseline-png/*.png (HTML 렌더, 사용자 확정 2026-07-31).
// 산출물은 파생 — 손편집 금지, 재생성으로만. 팔레트는 theme.mjs 판독(하드코딩 금지). 차트는 addChart 네이티브만.
// 사용: 덱 루트에서 `node tools/export-pptx-bespoke.mjs [out.pptx]`
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
function resolvePptxgen() {
  for (const dir of [root, path.join(root, '..'), path.join(root, '..', '..')]) {
    try { return createRequire(path.join(dir, 'noop.js'))('pptxgenjs'); } catch { /* next */ }
  }
  console.error('pptxgenjs is not importable. Run `npm install pptxgenjs` in this deck and retry.');
  process.exit(1);
}

const deck = JSON.parse(fs.readFileSync(path.join(root, 'content', 'slides.json'), 'utf8'));
const { THEME_ROOTS } = await import(new URL('./src/theme.mjs', import.meta.url));
const rootCss = THEME_ROOTS[deck.meta.template];
if (!rootCss) { console.error(`unknown template "${deck.meta.template}" — THEME_ROOTS 에 없음`); process.exit(1); }
const vars = {};
for (const m of rootCss.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
const hex = (name) => {
  const m = String(vars[name] || '').match(/#([0-9a-fA-F]{6})\b/);
  if (!m) { console.error(`테마 변수 hex 판독 실패: ${name}`); process.exit(1); }
  return m[1].toUpperCase();
};

// askewly 팔레트 (전부 theme 판독)
const BG = hex('bg-primary'), CARD = hex('bg-card'), RAISED = hex('surface-raised');
const BORDER = hex('border-card'), INK = hex('text-primary'), SUB = hex('text-secondary'), MUTED = hex('text-muted');
const NAVY = hex('accent-start'), CORAL = hex('accent-end');
const CHART = [hex('chart-1'), hex('chart-2'), hex('chart-3'), hex('chart-4')];
const FONT = 'Pretendard';

const pptxgen = resolvePptxgen();
const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.title = deck.meta.title;
const W = 13.333, H = 7.5;

// --- 공통 표현 (HTML 캐논: 중앙 제목 + 상중단 콘텐츠 밴드, 소프트 섀도, 그라디언트 언더라인) ---
// ⚠ pptxgenjs 4.0.1 은 shadow 옵션 객체를 제자리 EMU 변환(뮤테이션)한다 — 같은 객체를 두 도형에 쓰면
// 이중 변환으로 파일이 손상된다(실측 2026-07-31). 반드시 shadow() 로 새 객체를 만들어 넘길 것.
const shadow = () => ({ type: 'outer', color: '8A8272', blur: 14, offset: 3, angle: 90, opacity: 0.28 });
function title(slide, text, { y = 1.95, size = 33 } = {}) {
  slide.addText(text, { x: 1.0, y, w: W - 2.0, h: 0.75, fontFace: FONT, fontSize: size, bold: true, color: INK, align: 'center' });
}
function subtitle(slide, text, { y = 2.72, size = 14 } = {}) {
  if (!text) return;
  slide.addText(text, { x: 1.0, y, w: W - 2.0, h: 0.4, fontFace: FONT, fontSize: size, color: SUB, align: 'center' });
}
// 그라디언트 언더라인 근사: navy→coral 2톤 분할 (pptxgenjs gradient fill 미지원 — 편차 장부)
function gradientRule(slide, x, y, w, h = 0.022) {
  slide.addShape('rect', { x, y, w: w * 0.55, h, fill: { color: NAVY }, line: { type: 'none' } });
  slide.addShape('rect', { x: x + w * 0.55, y, w: w * 0.45, h, fill: { color: CORAL, transparency: 15 }, line: { type: 'none' } });
}
function card(slide, x, y, w, h, { fill = CARD, border = BORDER, shadowed = true } = {}) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { color: border, width: 1 }, shadow: shadowed ? shadow() : undefined });
}
function check(slide, x, y, { size = 14, color = NAVY } = {}) {
  slide.addText('✓', { x, y, w: 0.35, h: 0.32, fontFace: FONT, fontSize: size, bold: true, color, align: 'left' });
}

const builders = {
  // 1 — hero-motion 정지 프레임 재해석: 중앙 대제목 + 부제 + pill 칩 2개
  1(slide, s) {
    slide.addText(s.title, { x: 1.0, y: 2.85, w: W - 2.0, h: 1.1, fontFace: FONT, fontSize: 55, bold: true, color: INK, align: 'center', charSpacing: -0.5 });
    slide.addText(s.subtitle || '', { x: 1.0, y: 4.02, w: W - 2.0, h: 0.4, fontFace: FONT, fontSize: 14.5, color: SUB, align: 'center' });
    const chips = (s.items || []).map((c) => c.label).filter(Boolean);
    const chipW = 0.95, gap = 0.18, totalW = chips.length * chipW + (chips.length - 1) * gap;
    chips.forEach((label, i) => {
      const cx = (W - totalW) / 2 + i * (chipW + gap);
      slide.addShape('roundRect', { x: cx, y: 4.72, w: chipW, h: 0.34, rectRadius: 0.17, fill: { color: RAISED }, line: { color: BORDER, width: 1 } });
      slide.addText(label, { x: cx, y: 4.72, w: chipW, h: 0.34, fontFace: FONT, fontSize: 10.5, color: SUB, align: 'center', valign: 'middle' });
    });
  },
  // 2 — hero-cards: 카드 3열 (번호 뱃지·아이콘 자리·제목·본문·그라디언트 언더라인)
  2(slide, s) {
    title(slide, s.title); subtitle(slide, s.subtitle);
    const items = s.items || [];
    const bandW = 7.25, gap = 0.24, cw = (bandW - gap * (items.length - 1)) / items.length;
    const x0 = (W - bandW) / 2, y0 = 3.08, ch = 1.82;
    items.forEach((item, i) => {
      const cx = x0 + i * (cw + gap);
      card(slide, cx, y0, cw, ch);
      slide.addText(String(i + 1).padStart(2, '0'), { x: cx + 0.2, y: y0 + 0.14, w: 0.6, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: NAVY, charSpacing: 1 });
      slide.addText('✦', { x: cx + 0.2, y: y0 + 0.38, w: 0.4, h: 0.28, fontFace: FONT, fontSize: 13, color: NAVY });
      slide.addText(item.title || '', { x: cx + 0.2, y: y0 + 0.66, w: cw - 0.4, h: 0.3, fontFace: FONT, fontSize: 14, bold: true, color: INK });
      slide.addText(item.body || '', { x: cx + 0.2, y: y0 + 0.98, w: cw - 0.4, h: 0.6, fontFace: FONT, fontSize: 9.5, color: SUB, valign: 'top' });
      gradientRule(slide, cx + 0.2, y0 + ch - 0.15, cw - 0.4);
    });
  },
  // 3 — comparison-2col: 좌=웜(코랄 보더) 우=쿨(네이비 보더), 카드당 2절(hairline 구분)
  3(slide, s) {
    title(slide, s.title); subtitle(slide, s.subtitle);
    const it = s.items || [];
    const pair = [ { top: it[0], bot: it[2], border: CORAL, tint: 'FDF3EC' }, { top: it[1], bot: it[3], border: NAVY, tint: 'EEF3F0' } ];
    const bandW = 7.25, gap = 0.28, cw = (bandW - gap) / 2, x0 = (W - bandW) / 2, y0 = 3.05, ch = 2.35;
    pair.forEach((p, i) => {
      const cx = x0 + i * (cw + gap);
      card(slide, cx, y0, cw, ch, { fill: p.tint, border: p.border });
      const sec = (item, sy) => {
        if (!item) return;
        slide.addText('✦', { x: cx + 0.24, y: sy, w: 0.3, h: 0.24, fontFace: FONT, fontSize: 11, color: p.border });
        slide.addText(item.title || '', { x: cx + 0.24, y: sy + 0.24, w: cw - 0.48, h: 0.27, fontFace: FONT, fontSize: 13.5, bold: true, color: NAVY });
        slide.addText(item.body || '', { x: cx + 0.24, y: sy + 0.52, w: cw - 0.48, h: 0.3, fontFace: FONT, fontSize: 9.5, color: SUB });
      };
      sec(p.top, y0 + 0.18);
      slide.addShape('line', { x: cx + 0.24, y: y0 + 1.18, w: cw - 0.48, h: 0, line: { color: BORDER, width: 0.75 } });
      sec(p.bot, y0 + 1.3);
    });
  },
  // 4 — chart-interactive: 화이트 카드 안 네이티브 가로 막대 (첫 항목 위)
  4(slide, s) {
    title(slide, s.title, { y: 2.0 });
    const cx = 2.95, cy = 2.85, cw = W - 5.9, ch = 2.6;
    card(slide, cx, cy, cw, ch, { fill: RAISED });
    // 가로 막대는 첫 항목이 아래로 깔린다 — 데이터를 역순으로 넣어 첫 항목을 위로 (축은 아래 유지)
    const rev = [...(s.items || [])].reverse();
    slide.addChart(pptx.charts.BAR, [{
      name: s.chartLabel || s.title,
      labels: rev.map((i) => i.label),
      values: rev.map((i) => Number(i.value)),
    }], {
      x: cx + 0.25, y: cy + 0.2, w: cw - 0.5, h: ch - 0.62,
      barDir: 'bar', chartColors: [...CHART].reverse(),
      catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT, dataLabelFontFace: FONT,
      catAxisLabelFontSize: 10, catAxisLabelColor: SUB, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
      valGridLine: { color: 'E7E1D4', style: 'solid', size: 0.75 }, catGridLine: { style: 'none' },
      valAxisMaxVal: 600, showValue: false, showLegend: false, showTitle: false, barGapWidthPct: 60,
    });
    if (s.sourceNote) slide.addText(s.sourceNote, { x: cx, y: cy + ch - 0.34, w: cw - 0.3, h: 0.26, fontFace: FONT, fontSize: 8.5, color: MUTED, align: 'right' });
  },
  // 5 — step-flow: 번호 원 + 그라디언트 연결선 위, 카드 5열 아래
  5(slide, s) {
    title(slide, s.title); subtitle(slide, s.subtitle);
    const items = s.items || [];
    const bandW = 7.25, gap = 0.15, cw = (bandW - gap * (items.length - 1)) / items.length;
    const x0 = (W - bandW) / 2, rowY = 3.14, y0 = 3.62, ch = 1.68;
    // 연결선 (navy→teal→coral 3분할 근사 — gradient 미지원 편차)
    const segs = [CHART[0], CHART[1], CHART[2]];
    const lineW = bandW - cw; const segW = lineW / segs.length;
    segs.forEach((c, i) => slide.addShape('rect', { x: x0 + cw / 2 + i * segW, y: rowY + 0.135, w: segW, h: 0.02, fill: { color: c, transparency: 35 }, line: { type: 'none' } }));
    items.forEach((item, i) => {
      const cx = x0 + i * (cw + gap);
      // 번호 원
      slide.addShape('ellipse', { x: cx + cw / 2 - 0.16, y: rowY, w: 0.32, h: 0.32, fill: { color: RAISED }, line: { color: NAVY, width: 1.5 }, shadow: shadow() });
      // margin 0 필수 — 기본 inset 이 0.32in 박스의 가용 폭을 다 먹어 "01" 이 줄바꿈된다 (실측)
      slide.addText(String(i + 1).padStart(2, '0'), { x: cx + cw / 2 - 0.3, y: rowY, w: 0.6, h: 0.32, fontFace: FONT, fontSize: 8.5, bold: true, color: NAVY, align: 'center', valign: 'middle', margin: 0 });
      card(slide, cx, y0, cw, ch, {});
      slide.addShape('roundRect', { x: cx + cw / 2 - 0.14, y: y0 + 0.18, w: 0.28, h: 0.28, rectRadius: 0.06, fill: { color: hex('accent-soft') }, line: { color: hex('accent-border'), width: 0.75 } });
      slide.addText('✓', { x: cx + cw / 2 - 0.14, y: y0 + 0.18, w: 0.28, h: 0.28, fontFace: FONT, fontSize: 10, bold: true, color: NAVY, align: 'center', valign: 'middle' });
      slide.addText(item.title || '', { x: cx + 0.08, y: y0 + 0.52, w: cw - 0.16, h: 0.28, fontFace: FONT, fontSize: 12.5, bold: true, color: INK, align: 'center' });
      slide.addText(item.body || '', { x: cx + 0.08, y: y0 + 0.8, w: cw - 0.16, h: 0.3, fontFace: FONT, fontSize: 9, color: SUB, align: 'center' });
    });
  },
  // 6 — summary-grid: 플랫 카드 3열 (체크 + 제목 + 본문)
  6(slide, s) {
    title(slide, s.title); subtitle(slide, s.subtitle);
    const items = s.items || [];
    const bandW = 7.25, gap = 0.24, cw = (bandW - gap * (items.length - 1)) / items.length;
    const x0 = (W - bandW) / 2, y0 = 3.08, ch = 1.15;
    items.forEach((item, i) => {
      const cx = x0 + i * (cw + gap);
      card(slide, cx, y0, cw, ch, { shadowed: false });
      check(slide, cx + 0.18, y0 + 0.14, { size: 12 });
      slide.addText(item.title || '', { x: cx + 0.18, y: y0 + 0.42, w: cw - 0.36, h: 0.28, fontFace: FONT, fontSize: 14, bold: true, color: INK });
      slide.addText(item.body || '', { x: cx + 0.18, y: y0 + 0.7, w: cw - 0.36, h: 0.42, fontFace: FONT, fontSize: 9.5, color: SUB, valign: 'top' });
    });
  },
  // 7 — closing: 소형 중앙 제목 + 체크 3항 가로줄 (캐논의 미니멀 구도 준수)
  7(slide, s) {
    slide.addText(s.title, { x: 1.0, y: 3.2, w: W - 2.0, h: 0.65, fontFace: FONT, fontSize: 30, bold: true, color: INK, align: 'center' });
    const items = s.items || [];
    const itemW = 1.8, gap = 0.3, totalW = items.length * itemW + (items.length - 1) * gap;
    items.forEach((item, i) => {
      const cx = (W - totalW) / 2 + i * (itemW + gap);
      check(slide, cx, 4.02, { size: 11 });
      slide.addText(item.title || '', { x: cx + 0.24, y: 4.0, w: itemW - 0.24, h: 0.24, fontFace: FONT, fontSize: 11, bold: true, color: INK });
      slide.addText(item.body || '', { x: cx + 0.24, y: 4.24, w: itemW - 0.24, h: 0.24, fontFace: FONT, fontSize: 8.5, color: MUTED });
    });
  },
};

const only = process.env.BESPOKE_ONLY ? process.env.BESPOKE_ONLY.split(',').map(Number) : null; // 디버그용 부분 빌드
for (const s of deck.slides.filter((s) => !only || only.includes(s.no))) {
  const slide = pptx.addSlide();
  slide.background = { color: BG };
  if (s.notes) slide.addNotes(s.notes);
  const build = builders[s.no];
  if (!build) { console.error(`slide ${s.no}: bespoke builder 없음`); process.exit(1); }
  build(slide, s);
}

const outPath = path.resolve(root, process.argv[2] || path.join('export', 'askewly-design-intro.bespoke.pptx'));
fs.mkdirSync(path.dirname(outPath), { recursive: true });
await pptx.writeFile({ fileName: outPath });
console.log('wrote', outPath);
