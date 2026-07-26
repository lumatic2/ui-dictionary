import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";
import { deck } from "./deck-content.mjs";
import { theme } from "./theme.mjs";

const output = path.resolve("output/askewly-design-intro.pptx");
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Askewly Design";
pptx.subject = "getdesign Linear-based editable PPTX pilot";
pptx.title = "Askewly Design introduction";
pptx.company = "Askewly";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Noto Sans KR",
  bodyFontFace: "Noto Sans KR",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "PILOT_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "PILOT_WIDE";

const c = theme.colors;
const W = 13.333;
const H = 7.5;
const margin = 0.62;

function addBackground(slide) {
  slide.background = { color: c.canvas.slice(1) };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, line: { color: c.canvas.slice(1) }, fill: { color: c.canvas.slice(1) } });
  slide.addShape(pptx.ShapeType.line, { x: margin, y: 0.57, w: W - margin * 2, h: 0, line: { color: c.border.slice(1), width: 0.7 } });
  slide.addText("ASKEWLY DESIGN", { x: margin, y: 0.28, w: 2.5, h: 0.18, fontFace: theme.fonts.sans, fontSize: 7.5, bold: true, charSpace: 1.1, color: c.text.slice(1), margin: 0 });
}

function addFooter(slide, index, text = "getdesign → DESIGN.md → native output") {
  slide.addText(text, { x: margin, y: 7.02, w: 5.4, h: 0.16, fontFace: theme.fonts.sans, fontSize: 6.5, bold: true, charSpace: 0.9, color: c.textMuted.slice(1), margin: 0 });
  slide.addText(String(index).padStart(2, "0"), { x: 12.05, y: 6.96, w: 0.65, h: 0.2, align: "right", fontFace: theme.fonts.sans, fontSize: 8, bold: true, color: c.textMuted.slice(1), margin: 0 });
}

function addEyebrow(slide, text) {
  slide.addText(text, { x: margin, y: 1.08, w: 4.2, h: 0.2, fontFace: theme.fonts.sans, fontSize: 7.5, bold: true, charSpace: 1.5, color: c.textMuted.slice(1), margin: 0 });
}

function addTitle(slide, text, y = 1.48, size = 31) {
  slide.addText(text, { x: margin, y, w: 8.9, h: 1.72, breakLine: false, fontFace: theme.fonts.sans, fontSize: size, bold: true, breakLine: false, color: c.text.slice(1), margin: 0, paraSpaceAfterPt: 0, fit: "shrink" });
}

function addBody(slide, text, y = 3.52) {
  slide.addText(text, { x: margin, y, w: 6.9, h: 0.72, fontFace: theme.fonts.sans, fontSize: 13.5, color: c.textMuted.slice(1), breakLine: false, margin: 0, fit: "shrink", breakLine: false });
}

function addCards(slide, cards) {
  const start = 8.2;
  cards.forEach((card, i) => {
    const y = 1.38 + i * 1.46;
    slide.addShape(pptx.ShapeType.roundRect, { x: start, y, w: 4.45, h: 1.13, rectRadius: 0.06, line: { color: c.border.slice(1), width: 0.8 }, fill: { color: i === 1 ? c.surfaceRaised.slice(1) : c.surface.slice(1) } });
    slide.addText(`0${i + 1}`, { x: start + 0.26, y: y + 0.22, w: 0.35, h: 0.12, fontFace: theme.fonts.sans, fontSize: 6.8, bold: true, charSpace: 0.8, color: c.textMuted.slice(1), margin: 0 });
    slide.addText(card, { x: start + 0.26, y: y + 0.55, w: 3.8, h: 0.22, fontFace: theme.fonts.sans, fontSize: 12, bold: true, color: c.text.slice(1), margin: 0, fit: "shrink" });
  });
}

deck.slides.forEach((item, index) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addEyebrow(slide, item.eyebrow);
  addTitle(slide, item.title, index === 0 ? 1.42 : 1.48, index === 0 ? 34 : 29);
  addBody(slide, item.body, index === 0 ? 3.72 : 3.7);
  if (item.cards) addCards(slide, item.cards);
  if (index === 0) {
    slide.addShape(pptx.ShapeType.roundRect, { x: margin, y: 5.0, w: 1.75, h: 0.52, rectRadius: 0.04, line: { color: c.accent.slice(1), transparency: 100 }, fill: { color: c.accent.slice(1) } });
    slide.addText("파일럿 보기", { x: margin + 0.2, y: 5.17, w: 1.35, h: 0.14, fontFace: theme.fonts.sans, fontSize: 9, bold: true, color: c.canvas.slice(1), margin: 0, align: "center" });
  }
  if (index === 5) {
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.2, y: 2.03, w: 4.45, h: 2.75, rectRadius: 0.06, line: { color: c.border.slice(1), width: 0.8 }, fill: { color: c.surface.slice(1) } });
    slide.addText("DESIGN.md", { x: 8.5, y: 2.47, w: 2.5, h: 0.22, fontFace: theme.fonts.sans, fontSize: 13, bold: true, color: c.accent.slice(1), margin: 0 });
    slide.addText("웹과 PPTX가 같은\nsemantic token을 소비", { x: 8.5, y: 3.02, w: 3.2, h: 0.62, fontFace: theme.fonts.sans, fontSize: 16, bold: true, color: c.text.slice(1), margin: 0, fit: "shrink" });
  }
  addFooter(slide, index + 1, item.footer);
});

fs.mkdirSync(path.dirname(output), { recursive: true });
await pptx.writeFile({ fileName: output });
console.log(output);
