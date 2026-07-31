#!/usr/bin/env node
// PPTX bespoke export v2 (PB2) — 이 덱 전용 코드. brandlogy 편집 그래머 + askewly 토큰.
// 계약: ~/.claude/skills/presentation-slides-yusung/references/pptx-bespoke.md
// 기준: research/2026-07-31-pb2-brandlogy-grammar.md + research/sources/brandlogy-ppt-ref-*.png
// 콘텐츠: content/pptx-composition.json (PPT 구성 레이어 — 수치는 레포 실측만. HTML 정본 slides.json 무접촉)
// 산출물은 파생 — 손편집 금지, 재생성으로만. 팔레트는 theme.mjs 판독(하드코딩 금지). 차트는 addChart 네이티브만.
// ⚠ pptxgenjs 4.0.1: shadow 옵션 객체를 제자리 EMU 변환(뮤테이션) — 도형마다 새 객체 필수 (v1 실측).
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

const comp = JSON.parse(fs.readFileSync(path.join(root, 'content', 'pptx-composition.json'), 'utf8'));
const deckMeta = JSON.parse(fs.readFileSync(path.join(root, 'content', 'slides.json'), 'utf8')).meta;
const { THEME_ROOTS } = await import(new URL('./src/theme.mjs', import.meta.url));
const rootCss = THEME_ROOTS[deckMeta.template];
if (!rootCss) { console.error(`unknown template "${deckMeta.template}"`); process.exit(1); }
const vars = {};
for (const m of rootCss.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
const hex = (name) => {
  const m = String(vars[name] || '').match(/#([0-9a-fA-F]{6})\b/);
  if (!m) { console.error(`테마 변수 hex 판독 실패: ${name}`); process.exit(1); }
  return m[1].toUpperCase();
};

const BG = hex('bg-primary'), RAISED = hex('surface-raised'), BORDER = hex('border-card');
const INK = hex('text-primary'), SUB = hex('text-secondary'), MUTED = hex('text-muted');
const NAVY = hex('accent-start'), SOFT = hex('accent-soft'), SOFTBORDER = hex('accent-border');
const FONT = 'Pretendard';

const pptxgen = resolvePptxgen();
const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.title = 'Askewly Design';
const W = 13.333, H = 7.5;
const MX = 0.75; // 좌우 여백 (프레임 그리드)
const CW = W - MX * 2;

const shadow = () => ({ type: 'outer', color: '8A8272', blur: 12, offset: 2, angle: 90, opacity: 0.22 });

// 캔버스: 회백 + 하단으로 미세하게 어두워지는 수직 그라디언트 근사 (ink 저투명 밴드 2장)
function canvas(slide) {
  slide.background = { color: BG };
  // 1% 투명도 계단 5장 — 경계선이 보이지 않는 수직 그라디언트 근사 (r1 실측: 2장 큰 계단은 경계가 드러남)
  for (let i = 0; i < 5; i++) {
    slide.addShape('rect', { x: 0, y: H * (0.64 + i * 0.072), w: W, h: H * (0.36 - i * 0.072) + 0.01, fill: { color: INK, transparency: 99 - i }, line: { type: 'none' } });
  }
}

// 프레임 고정 앵커: kicker(좌상) · 워드마크(우상) · 페이지(좌하) · 출처(우하)
function frame(slide, { kicker, pageNo, source }) {
  if (kicker) {
    slide.addText([
      { text: `${kicker.no}`, options: { bold: true } },
      { text: `  ·  ${kicker.label}`, options: {} },
    ], { x: MX, y: 0.32, w: 5, h: 0.3, fontFace: FONT, fontSize: 10.5, color: SUB, charSpacing: 3 });
  }
  slide.addText(comp.meta.wordmark, { x: W - MX - 2.2, y: 0.32, w: 2.2, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: INK, align: 'right' });
  slide.addText(String(pageNo).padStart(2, '0'), { x: MX, y: H - 0.48, w: 1, h: 0.28, fontFace: FONT, fontSize: 10, color: MUTED });
  if (source) slide.addText(source, { x: W / 2, y: H - 0.48, w: W / 2 - MX, h: 0.28, fontFace: FONT, fontSize: 9, color: MUTED, align: 'right' });
}

// 헤드라인(주장형 문장) + 근거 부제 — 좌측 정렬
function headlineBlock(slide, headline, subline) {
  slide.addText(headline, { x: MX, y: 0.88, w: CW * 0.86, h: 0.62, fontFace: FONT, fontSize: 27, bold: true, color: INK, charSpacing: -0.3 });
  if (subline) slide.addText(subline, { x: MX, y: 1.52, w: CW * 0.86, h: 0.34, fontFace: FONT, fontSize: 12.5, color: SUB });
}

function cardShape(slide, x, y, w, h, { shadowed = true } = {}) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.08, fill: { color: RAISED }, line: { color: BORDER, width: 1 }, shadow: shadowed ? shadow() : undefined });
}

// 스탯 카드: 빅넘버(정량=네이비 / 정성=먹색) + 굵은 라벨 + 뮤티드 상세
function statCard(slide, x, y, w, h, s) {
  cardShape(slide, x, y, w, h);
  const big = s.value.length > 4 ? 22 : 27;
  slide.addText(s.value, { x: x + 0.28, y: y + 0.18, w: w - 0.56, h: 0.5, fontFace: FONT, fontSize: big, bold: true, color: s.quant ? NAVY : INK });
  slide.addText(s.label, { x: x + 0.28, y: y + 0.72, w: w - 0.56, h: 0.28, fontFace: FONT, fontSize: 12.5, bold: true, color: INK });
  slide.addText(s.detail || '', { x: x + 0.28, y: y + 1.0, w: w - 0.56, h: h - 1.12, fontFace: FONT, fontSize: 9.5, color: MUTED, valign: 'top' });
}

// 차트 카드: 자체 제목·단위 부제·세로 막대(단일 키컬러·값 라벨)·카드 내 Source
function chartCard(slide, x, y, w, h, c) {
  cardShape(slide, x, y, w, h);
  slide.addText(c.title, { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.3, fontFace: FONT, fontSize: 13.5, bold: true, color: INK });
  slide.addText(c.sub || '', { x: x + 0.3, y: y + 0.5, w: w - 0.6, h: 0.24, fontFace: FONT, fontSize: 9.5, color: MUTED });
  slide.addChart(pptx.charts.BAR, [{
    name: c.title,
    labels: c.items.map((i) => i.label),
    values: c.items.map((i) => Number(i.value)),
  }], {
    x: x + 0.25, y: y + 0.82, w: w - 0.5, h: h - 1.3,
    barDir: 'col', chartColors: [NAVY], showValue: true,
    dataLabelFontFace: FONT, dataLabelFontSize: 9.5, dataLabelColor: INK,
    catAxisLabelFontFace: FONT, catAxisLabelFontSize: 9.5, catAxisLabelColor: SUB,
    valAxisHidden: true, valGridLine: { color: 'E7E1D4', style: 'solid', size: 0.5 },
    catGridLine: { style: 'none' }, showLegend: false, showTitle: false, barGapWidthPct: 55,
  });
  if (c.source) slide.addText(c.source, { x: x + 0.3, y: y + h - 0.36, w: w - 0.6, h: 0.24, fontFace: FONT, fontSize: 8.5, color: MUTED });
}

// 아이콘 리스트 카드: 틴트 아이콘 칩 + 키컬러 소라벨(시리즈 ①) + 굵은 제목 + 뮤티드 본문 (가로형)
const CIRCLED = ['①', '②', '③', '④', '⑤'];
function iconListCard(slide, x, y, w, h, item, idx, tagPrefix) {
  cardShape(slide, x, y, w, h);
  const chip = 0.44;
  slide.addShape('roundRect', { x: x + 0.24, y: y + (h - chip) / 2, w: chip, h: chip, rectRadius: 0.1, fill: { color: SOFT }, line: { color: SOFTBORDER, width: 0.75 } });
  slide.addText(item.glyph || '✦', { x: x + 0.24, y: y + (h - chip) / 2, w: chip, h: chip, fontFace: FONT, fontSize: 13, bold: true, color: NAVY, align: 'center', valign: 'middle', margin: 0 });
  const tx = x + 0.24 + chip + 0.2, tw = w - (0.24 + chip + 0.2) - 0.24;
  let ty = y + 0.14;
  if (tagPrefix) {
    slide.addText(`${tagPrefix} ${CIRCLED[idx] || ''}`, { x: tx, y: ty, w: tw, h: 0.22, fontFace: FONT, fontSize: 9, bold: true, color: NAVY, charSpacing: 1 });
    ty += 0.22;
  }
  slide.addText(item.title, { x: tx, y: ty, w: tw, h: 0.28, fontFace: FONT, fontSize: 13, bold: true, color: INK });
  slide.addText(item.body || '', { x: tx, y: ty + 0.28, w: tw, h: y + h - (ty + 0.28) - 0.12, fontFace: FONT, fontSize: 9.5, color: SUB, valign: 'top' });
}

// --- 슬라이드 조립 ---------------------------------------------------------
const totalPages = comp.slides.length;

for (const s of comp.slides) {
  const slide = pptx.addSlide();
  canvas(slide);
  if (s.notes) slide.addNotes(s.notes);

  if (s.kind === 'cover') {
    frame(slide, { pageNo: s.no });
    slide.addText(s.title, { x: MX, y: 2.75, w: CW, h: 1.1, fontFace: FONT, fontSize: 56, bold: true, color: INK, align: 'center', charSpacing: -0.5 });
    slide.addText(s.subtitle || '', { x: MX, y: 3.95, w: CW, h: 0.4, fontFace: FONT, fontSize: 15, color: SUB, align: 'center' });
    const chips = s.chips || [];
    const chipW = 1.0, gap = 0.2, totalW = chips.length * chipW + (chips.length - 1) * gap;
    chips.forEach((label, i) => {
      const cx = (W - totalW) / 2 + i * (chipW + gap);
      slide.addShape('roundRect', { x: cx, y: 4.66, w: chipW, h: 0.36, rectRadius: 0.18, fill: { color: RAISED }, line: { color: BORDER, width: 1 } });
      slide.addText(label, { x: cx, y: 4.66, w: chipW, h: 0.36, fontFace: FONT, fontSize: 10.5, color: SUB, align: 'center', valign: 'middle', margin: 0 });
    });
    continue;
  }

  if (s.kind === 'closing') {
    frame(slide, { pageNo: s.no });
    slide.addText(s.headline, { x: MX, y: 2.5, w: CW, h: 0.8, fontFace: FONT, fontSize: 38, bold: true, color: INK, align: 'center' });
    const items = s.list?.items || [];
    const cw2 = 2.9, gap = 0.3, totalW = items.length * cw2 + (items.length - 1) * gap;
    items.forEach((item, i) => {
      const cx = (W - totalW) / 2 + i * (cw2 + gap);
      iconListCard(slide, cx, 3.7, cw2, 1.0, item, i, null);
    });
    continue;
  }

  // content 슬라이드 — 프레임 + 헤드라인 + 3계층 본문
  frame(slide, { kicker: s.kicker, pageNo: s.no, source: s.source });
  headlineBlock(slide, s.headline, s.subline);
  const bodyTop = 2.12, bodyBottom = H - 0.62, bodyH = bodyBottom - bodyTop;

  if (s.chart && s.statsColumn) {
    // ref-01 구도: 좌측 차트 카드 + 우측 스탯 스택
    const chartW = CW * 0.56;
    chartCard(slide, MX, bodyTop, chartW, bodyH, s.chart);
    const sx = MX + chartW + 0.3, sw = CW - chartW - 0.3;
    const n = s.stats.length, gap = 0.22, sh = (bodyH - gap * (n - 1)) / n;
    s.stats.forEach((st, i) => statCard(slide, sx, bodyTop + i * (sh + gap), sw, sh, st));
  } else if (s.steps) {
    // 스텝 카드 줄(키컬러 번호 라벨) + 하단 게이트 리스트 2열
    const n = s.steps.length, gap = 0.2, cw2 = (CW - gap * (n - 1)) / n, rowH = 1.6, lh = 1.45;
    const top = bodyTop + (bodyH - (rowH + 0.3 + lh)) / 2; // 두 행 블록을 본문 영역에 수직 센터 (중간 빈 띠 방지)
    s.steps.forEach((st, i) => {
      const cx = MX + i * (cw2 + gap);
      cardShape(slide, cx, top, cw2, rowH);
      slide.addText(`단계 ${CIRCLED[i] || i + 1}`, { x: cx + 0.22, y: top + 0.16, w: cw2 - 0.44, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: NAVY, charSpacing: 1 });
      slide.addText(st.title, { x: cx + 0.22, y: top + 0.44, w: cw2 - 0.44, h: 0.3, fontFace: FONT, fontSize: 15, bold: true, color: INK });
      slide.addText(st.body || '', { x: cx + 0.22, y: top + 0.76, w: cw2 - 0.44, h: rowH - 0.9, fontFace: FONT, fontSize: 9.5, color: SUB, valign: 'top' });
    });
    const items = s.list?.items || [];
    const ly = top + rowH + 0.3;
    const lw = (CW - 0.3) / 2;
    items.forEach((item, i) => iconListCard(slide, MX + i * (lw + 0.3), ly, lw, lh, item, i, s.list.tagPrefix));
  } else {
    // 기본 구도(ref-02 축약): 상단 스탯 카드 줄 + 하단 아이콘 리스트
    const stats = s.stats || [];
    const gap = 0.24, cw2 = (CW - gap * (stats.length - 1)) / stats.length;
    const statH = 1.6, lh = 1.6; // ref-02 실측 비율대 — 카드 내부 공백 금지
    const top = bodyTop + (bodyH - (statH + 0.3 + lh)) / 2; // 블록 수직 센터 (중간 빈 띠 방지)
    stats.forEach((st, i) => statCard(slide, MX + i * (cw2 + gap), top, cw2, statH, st));
    const items = s.list?.items || [];
    const ly = top + statH + 0.3;
    const lw = (CW - 0.3 * (items.length - 1)) / items.length;
    items.forEach((item, i) => iconListCard(slide, MX + i * (lw + 0.3), ly, lw, lh, item, i, s.list.tagPrefix));
  }
}

const outPath = path.resolve(root, process.argv[2] || path.join('export', 'askewly-design-intro.bespoke.pptx'));
fs.mkdirSync(path.dirname(outPath), { recursive: true });
await pptx.writeFile({ fileName: outPath });
console.log('wrote', outPath);
