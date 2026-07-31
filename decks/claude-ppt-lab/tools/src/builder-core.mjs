#!/usr/bin/env node
import { FONT_LINKS, canvasPreset, resolveTheme } from './theme.mjs';
import { commonCss, indexCss } from './css.mjs';
import { iconSvg, renderIcon } from './icons.mjs';
import { createBuilderIO } from './io.mjs';
import { createStaticRenderers } from './renderers/static.mjs';
import { createInteractiveRenderers } from './renderers/interactive.mjs';
import { createSlideScripts } from './scripts/interactive-scripts.mjs';
import { createShellRenderers } from './shell.mjs';
import { escapeHtml, fileName } from './utils.mjs';

const io = createBuilderIO(import.meta.url, { fileName });
const LAYOUT_META = io.readLayoutMeta();

const { renderGeneric, renderers: STATIC_RENDERERS } = createStaticRenderers({ escapeHtml, renderIcon });
const { renderers: INTERACTIVE_RENDERERS } = createInteractiveRenderers({ escapeHtml, renderGeneric, renderIcon });
const { headExtras, slideScripts } = createSlideScripts({ escapeHtml });

const LAYOUT_RENDERERS = {
  ...STATIC_RENDERERS,
  ...INTERACTIVE_RENDERERS,
};

function renderLayout(slide) {
  return (LAYOUT_RENDERERS[slide.layout] || renderGeneric)(slide);
}

const { renderSlide, renderIndex, renderPrint } = createShellRenderers({
  escapeHtml,
  fileName,
  LAYOUT_META,
  FONT_LINKS,
  resolveTheme,
  canvasPreset,
  commonCss,
  indexCss,
  iconSvg,
  renderLayout,
  headExtras,
  slideScripts,
});

export function main() {
  io.runValidator();
  const deck = io.readDeck();
  io.writeDeck(deck, { renderSlide, renderIndex, renderPrint });
  console.log(`built ${deck.slides.length} slides`);
}
