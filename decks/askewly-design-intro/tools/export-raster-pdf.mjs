#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire, Module } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const CANVAS_PRESETS = {
  hd: { width: 1280, height: 720 },
};

const DEFAULT_CAPTURE_VIEWPORT = { width: 1920, height: 1080 };

function parseArgs(argv) {
  const options = {
    dir: process.cwd(),
    output: '',
    pngDir: '',
    scale: 2,
    wait: 900,
    viewport: 'fullscreen',
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dir') options.dir = path.resolve(argv[++index]);
    else if (arg === '--output') options.output = path.resolve(argv[++index]);
    else if (arg === '--png-dir') options.pngDir = path.resolve(argv[++index]);
    else if (arg === '--scale') options.scale = Number(argv[++index]);
    else if (arg === '--wait') options.wait = Number(argv[++index]);
    else if (arg === '--viewport') options.viewport = argv[++index];
    else if (arg === '--notes') options.notes = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node tools/export-raster-pdf.mjs [--dir deck-folder] [--output exports/deck.pdf] [--png-dir exports/png] [--scale 2] [--wait 900] [--viewport fullscreen|canvas|1920x1080] [--notes]

Captures each generated slide HTML at ?capture=1, then embeds those viewport PNGs
into a 16:9 PDF. This is the preferred sharing export when visual parity with
Chrome fullscreen matters more than selectable text.

The default viewport is fullscreen-like 1920x1080, not the logical deck canvas size.
Keep meta.canvas as hd. Use --viewport and --scale for sharper shared PDFs.
Use --viewport canvas only when you explicitly want the 1280x720 logical frame.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isFinite(options.scale) || options.scale < 1 || options.scale > 4) {
    throw new Error('--scale must be a number from 1 to 4');
  }
  if (!Number.isFinite(options.wait) || options.wait < 0) {
    throw new Error('--wait must be a non-negative number of milliseconds');
  }
  return options;
}

function parseViewport(value, canvas) {
  if (!value || value === 'fullscreen') return DEFAULT_CAPTURE_VIEWPORT;
  if (value === 'canvas') return canvas;
  const match = /^(\d{3,5})x(\d{3,5})$/i.exec(value);
  if (!match) throw new Error('--viewport must be fullscreen, canvas, or WIDTHxHEIGHT such as 1920x1080');
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('--viewport dimensions must be positive numbers');
  }
  return { width, height };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function fileName(slide) {
  return `${String(slide.no).padStart(2, '0')}-${slide.slug}.html`;
}

function slugify(value) {
  return String(value || 'deck')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'deck';
}

function discoverDeck(deckDir, output) {
  const slidesPath = path.join(deckDir, 'content', 'slides.json');
  if (!fs.existsSync(slidesPath)) throw new Error(`Missing ${slidesPath}`);
  const deck = readJson(slidesPath);
  const canvas = CANVAS_PRESETS[deck.meta?.canvas || 'hd'] || CANVAS_PRESETS.hd;
  const slides = deck.slides.map((slide) => {
    const file = path.join(deckDir, fileName(slide));
    if (!fs.existsSync(file)) throw new Error(`Missing generated slide HTML: ${file}`);
    return { slide, file, name: fileName(slide) };
  });
  const defaultOutput = path.join(deckDir, 'exports', `${slugify(deck.meta?.title)}.pdf`);
  return { deck, canvas, slides, output: output || defaultOutput };
}

function candidateNodeModules() {
  const roots = [];
  if (process.env.npm_config_cache) roots.push(path.join(process.env.npm_config_cache, '_npx'));
  if (process.env.LOCALAPPDATA) roots.push(path.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx'));
  roots.push(path.join(os.homedir(), 'AppData', 'Local', 'npm-cache', '_npx'));
  roots.push(path.join(os.homedir(), '.npm', '_npx'));

  const found = [];
  for (const root of [...new Set(roots)]) {
    if (!fs.existsSync(root)) continue;
    for (const child of fs.readdirSync(root, { withFileTypes: true })) {
      if (!child.isDirectory()) continue;
      const nodeModules = path.join(root, child.name, 'node_modules');
      if (fs.existsSync(path.join(nodeModules, 'playwright', 'package.json'))) found.push(nodeModules);
    }
  }
  return found;
}

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    for (const nodeModules of candidateNodeModules()) {
      process.env.NODE_PATH = [nodeModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
      Module._initPaths();
      try {
        return require('playwright');
      } catch {
        // Try the next cached npx install.
      }
    }
  }
  throw new Error('Playwright is not importable. Run `npx playwright --version` once or install playwright in this deck/project.');
}

function chromeCandidates() {
  return [
    process.env.CHROME_PATH,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
}

function findChromeExecutable() {
  return chromeCandidates().find((candidate) => fs.existsSync(candidate));
}

async function launchBrowser(chromium) {
  const executablePath = findChromeExecutable();
  return chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
}

function withQuery(file, query) {
  const url = new URL(pathToFileURL(file).href);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url.href;
}

async function captureSlide(browser, entry, viewport, options) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: options.scale,
  });
  try {
    await page.goto(withQuery(entry.file, { capture: '1' }), { waitUntil: 'load' });
    try {
      await page.waitForLoadState('networkidle', { timeout: 2500 });
    } catch {
      // CDN-backed interactive slides can keep requests open; fixed wait below is the export contract.
    }
    await page.waitForTimeout(options.wait);
    const checks = await page.evaluate(() => {
      const nav = document.querySelector('.slide-nav');
      const navStyle = nav ? window.getComputedStyle(nav) : null;
      return {
        captureMode: document.documentElement.classList.contains('capture-mode'),
        navHidden: !nav || navStyle.display === 'none' || navStyle.visibility === 'hidden',
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scroll: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
      };
    });
    if (!checks.captureMode) throw new Error(`${entry.name} did not enter capture mode`);
    if (!checks.navHidden) throw new Error(`${entry.name} still shows slide navigation in capture mode`);
    const buffer = await page.screenshot({ type: 'png', fullPage: false });
    return { buffer, checks };
  } finally {
    await page.close();
  }
}

function notesPageHtml(slide, index) {
  // notes 없는 슬라이드는 페이지를 만들지 않는다(빈 페이지 삽입 금지).
  const notes = Array.isArray(slide?.notes) ? slide.notes.join('\n') : slide?.notes;
  if (!notes) return '';
  return `<section class="page notes-page">
  <div class="notes-head"><span class="notes-no">${String(index + 1).padStart(2, '0')}</span><span class="notes-title">${escapeText(slide.title || '')}</span></div>
  <div class="notes-body">${escapeText(notes).replace(/\n/g, '<br>')}</div>
  <div class="notes-foot">SPEAKER NOTES</div>
</section>`;
}

function imagePdfHtml(deck, canvas, captures, withNotes) {
  const pages = captures.map((capture, index) => {
    const alt = `${String(index + 1).padStart(2, '0')} ${deck.slides[index]?.title || 'slide'}`;
    const src = `data:image/png;base64,${capture.buffer.toString('base64')}`;
    const notes = withNotes ? notesPageHtml(deck.slides[index], index) : '';
    return `<section class="page"><img alt="${escapeAttribute(alt)}" src="${src}"></section>${notes ? `\n${notes}` : ''}`;
  }).join('\n');
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeText(deck.meta?.title || 'Deck')} raster export</title>
<style>
@page { size: ${canvas.width}px ${canvas.height}px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #000; }
.page { width: ${canvas.width}px; height: ${canvas.height}px; margin: 0; page-break-after: always; break-after: page; overflow: hidden; background: #000; }
.page:last-child { page-break-after: auto; break-after: auto; }
img { display: block; width: 100%; height: 100%; object-fit: fill; }
.notes-page { background: #ffffff; color: #1c1c22; padding: ${Math.round(canvas.height * 0.09)}px ${Math.round(canvas.width * 0.07)}px; display: flex; flex-direction: column; font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif; }
.notes-head { display: flex; align-items: baseline; gap: 18px; border-bottom: 2px solid #1c1c22; padding-bottom: 14px; }
.notes-no { font-size: ${Math.round(canvas.height * 0.045)}px; font-weight: 800; }
.notes-title { font-size: ${Math.round(canvas.height * 0.035)}px; font-weight: 600; }
.notes-body { flex: 1; margin-top: ${Math.round(canvas.height * 0.05)}px; font-size: ${Math.round(canvas.height * 0.03)}px; line-height: 1.7; white-space: normal; }
.notes-foot { font-size: ${Math.round(canvas.height * 0.018)}px; letter-spacing: .14em; opacity: .45; }
</style>
</head>
<body>
${pages}
</body>
</html>`;
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

async function writePdf(browser, deck, viewport, captures, output, withNotes) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const page = await browser.newPage({ viewport });
  try {
    await page.setContent(imagePdfHtml(deck, viewport, captures, withNotes), { waitUntil: 'load' });
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((img) => img.complete ? Promise.resolve() : new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      })));
    });
    await page.pdf({
      path: output,
      printBackground: true,
      preferCSSPageSize: true,
      width: `${viewport.width}px`,
      height: `${viewport.height}px`,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await page.close();
  }
}

async function run(options) {
  const { deck, canvas, slides, output } = discoverDeck(options.dir, options.output);
  const viewport = parseViewport(options.viewport, canvas);
  const ratio = viewport.width / viewport.height;
  if (Math.abs(ratio - (16 / 9)) > 0.01) {
    throw new Error(`--viewport must be 16:9 for slide PDF export; got ${viewport.width}x${viewport.height}`);
  }
  if (options.pngDir) fs.mkdirSync(options.pngDir, { recursive: true });
  const { chromium } = loadPlaywright();
  const browser = await launchBrowser(chromium);
  const captures = [];
  try {
    for (const entry of slides) {
      const capture = await captureSlide(browser, entry, viewport, options);
      captures.push(capture);
      if (options.pngDir) {
        fs.writeFileSync(path.join(options.pngDir, entry.name.replace(/\.html$/, '.png')), capture.buffer);
      }
      console.log(`captured ${entry.name}`);
    }
    await writePdf(browser, deck, viewport, captures, output, options.notes);
  } finally {
    await browser.close();
  }
  return { output, count: captures.length, canvas, viewport, scale: options.scale };
}

async function main() {
  try {
    const result = await run(parseArgs(process.argv.slice(2)));
    console.log(`raster PDF exported: ${result.output}`);
    console.log(`pages: ${result.count}, logical canvas: ${result.canvas.width}x${result.canvas.height}, capture viewport: ${result.viewport.width}x${result.viewport.height}, capture scale: ${result.scale}x`);
  } catch (error) {
    console.error(`raster PDF export failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
