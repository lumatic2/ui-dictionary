import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function createBuilderIO(importMetaUrl, { fileName }) {
  const root = process.cwd();
  const scriptDir = path.dirname(fileURLToPath(importMetaUrl));
  const contentDir = path.join(root, 'content');
  const slidesPath = path.join(contentDir, 'slides.json');
  const layoutMetaPath = path.join(scriptDir, '..', 'layout-meta.json');

  function readLayoutMeta() {
    const meta = JSON.parse(fs.readFileSync(layoutMetaPath, 'utf8'));
    if (!meta || typeof meta !== 'object' || !meta.layouts) {
      throw new Error(`${layoutMetaPath} must contain a layouts object`);
    }
    return meta.layouts;
  }

  function runValidator() {
    const validator = path.join(root, 'tools', 'validate-slides.mjs');
    if (!fs.existsSync(validator)) return;
    const result = spawnSync(process.execPath, [validator, slidesPath], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }

  function readDeck() {
    return JSON.parse(fs.readFileSync(slidesPath, 'utf8'));
  }

  function readCustomTheme() {
    const themePath = path.join(contentDir, 'theme.json');
    if (!fs.existsSync(themePath)) return null;
    return JSON.parse(fs.readFileSync(themePath, 'utf8'));
  }

  function writeDeck(deck, { renderSlide, renderIndex, renderPrint }) {
    deck.slides.forEach((slide, index) => {
      fs.writeFileSync(path.join(root, fileName(slide)), renderSlide(deck, slide, index));
    });
    fs.writeFileSync(path.join(root, 'index.html'), renderIndex(deck));
    fs.writeFileSync(path.join(root, 'print.html'), renderPrint(deck));
  }

  return { readLayoutMeta, runValidator, readDeck, readCustomTheme, writeDeck };
}
