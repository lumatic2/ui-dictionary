#!/usr/bin/env node
// SL3 경로 A — slides.json → 편집 가능 PPTX (pptxgenjs 네이티브 개체 매핑 실험)
// 정본은 content/slides.json — 이 산출물은 파생, 손편집 금지. 재생성으로만.
// 색은 tools/src/theme.mjs askewly 팔레트를 hex로 판독해 옮긴다 (semantic 토큰 → export 시 고정).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const deck = JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'slides.json'), 'utf8'));

// askewly 팔레트 (tools/src/theme.mjs 판독값)
const C = {
  bg: 'F4F3EE', card: 'FFFDF7', border: 'D8D0C1',
  text: '15130F', sub: '4A463D', muted: '777164',
  accent: '2F4B7C', accent2: 'C65A3B',
  chart: ['2F4B7C', '2F9E85', 'C65A3B', '7B689B'],
};
const FONT = 'Pretendard';

const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 }); // slide-spec pptx-widescreen-16-9
pptx.layout = 'WIDE';
pptx.author = 'Askewly Design';
pptx.title = deck.meta.title;

const W = 13.333, H = 7.5;

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.7, y: opts.y ?? 0.55, w: W - 1.4, h: 0.9,
    fontFace: FONT, fontSize: opts.size ?? 30, bold: true, color: C.text,
    align: opts.align ?? 'left', ...opts.extra,
  });
}

function addSubtitle(slide, text, y = 1.4) {
  if (!text) return;
  slide.addText(text, { x: 0.7, y, w: W - 1.4, h: 0.5, fontFace: FONT, fontSize: 14, color: C.sub });
}

function addCards(slide, items, { y = 2.1, cardH = 2.6, cols = null } = {}) {
  const n = items.length;
  const columns = cols ?? n;
  const rows = Math.ceil(n / columns);
  const gap = 0.35;
  const cw = (W - 1.4 - gap * (columns - 1)) / columns;
  items.forEach((item, i) => {
    const cx = 0.7 + (i % columns) * (cw + gap);
    const cy = y + Math.floor(i / columns) * (cardH + gap);
    slide.addShape('roundRect', {
      x: cx, y: cy, w: cw, h: cardH, rectRadius: 0.08,
      fill: { color: C.card }, line: { color: C.border, width: 1 },
    });
    slide.addText(String(i + 1).padStart(2, '0'), { x: cx + 0.25, y: cy + 0.2, w: cw - 0.5, h: 0.3, fontFace: FONT, fontSize: 11, bold: true, color: C.accent });
    slide.addText(item.title || item.label || '', { x: cx + 0.25, y: cy + 0.55, w: cw - 0.5, h: 0.5, fontFace: FONT, fontSize: 17, bold: true, color: C.text });
    if (item.body) slide.addText(item.body, { x: cx + 0.25, y: cy + 1.1, w: cw - 0.5, h: cardH - 1.3, fontFace: FONT, fontSize: 12, color: C.sub, valign: 'top' });
  });
}

for (const s of deck.slides) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  if (s.notes) slide.addNotes(s.notes);

  switch (s.layout) {
    case 'cover': {
      slide.addText(s.title, { x: 0.7, y: 2.6, w: W - 1.4, h: 1.2, fontFace: FONT, fontSize: 54, bold: true, color: C.text, align: 'center' });
      slide.addText(s.subtitle || '', { x: 0.7, y: 3.9, w: W - 1.4, h: 0.6, fontFace: FONT, fontSize: 20, color: C.sub, align: 'center' });
      const chips = (s.items || []).map((c) => c.label).join('   ·   ');
      if (chips) slide.addText(chips, { x: 0.7, y: 4.8, w: W - 1.4, h: 0.4, fontFace: FONT, fontSize: 13, color: C.muted, align: 'center' });
      break;
    }
    case 'chart-interactive': {
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
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      const items = s.items || [];
      const gap = 0.55, cw = (W - 1.4 - gap * (items.length - 1)) / items.length;
      items.forEach((item, i) => {
        const cx = 0.7 + i * (cw + gap);
        slide.addShape('roundRect', { x: cx, y: 3.0, w: cw, h: 1.9, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.border, width: 1 } });
        slide.addText(`${i + 1}`, { x: cx + 0.18, y: 3.15, w: 0.6, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: C.accent2 });
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
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      addCards(slide, s.items || [], { y: 2.1, cardH: 2.2, cols: 2 });
      break;
    }
    default: { // hero-cards, summary-grid 등 카드형 공통
      addTitle(slide, s.title);
      addSubtitle(slide, s.subtitle);
      addCards(slide, s.items || []);
    }
  }
}

const out = path.join(here, 'askewly-design-intro.pptxgenjs.pptx');
await pptx.writeFile({ fileName: out });
console.log('wrote', out);
