#!/usr/bin/env node
// SX2 — 벡터 PDF export: 덱의 print.html(@page 크기·페이지 분할 CSS 내장)을 Chromium 인쇄 엔진으로
// 직접 인쇄한다. 텍스트가 선택·검색 가능한 벡터로 남는다(라스터 트랙 export-raster-pdf.mjs 와 병행).
// 트랙 선택: 시각 충실(모션 정지 캡처·카드뉴스) = raster / 텍스트 선택·검색·경량 공유 = vector.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire, Module } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const CANVAS_PRESETS = {
  hd: { width: 1280, height: 720 },
};

function parseArgs(argv) {
  const options = { dir: process.cwd(), output: '', wait: 900, notes: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dir') options.dir = path.resolve(argv[++index]);
    else if (arg === '--output') options.output = path.resolve(argv[++index]);
    else if (arg === '--wait') options.wait = Number(argv[++index]);
    else if (arg === '--notes') options.notes = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node tools/export-vector-pdf.mjs [--dir deck-folder] [--output exports/deck.vector.pdf] [--wait 900] [--notes]

Prints the generated print.html through Chromium's print engine. Text stays
selectable/searchable (vector). Interactive layouts show their exportFallback
notes exactly as the print contract defines. Use export-raster-pdf.mjs instead
when pixel-perfect motion capture matters more than selectable text.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isFinite(options.wait) || options.wait < 0) throw new Error('--wait must be a non-negative number of milliseconds');
  return options;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
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
  const printPath = path.join(deckDir, 'print.html');
  if (!fs.existsSync(printPath)) throw new Error(`Missing ${printPath} — run tools/build-slides.mjs first`);
  const deck = readJson(slidesPath);
  const canvas = CANVAS_PRESETS[deck.meta?.canvas || 'hd'] || CANVAS_PRESETS.hd;
  const defaultOutput = path.join(deckDir, 'exports', `${slugify(deck.meta?.title)}.vector.pdf`);
  return { deck, canvas, printPath, output: output || defaultOutput };
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

async function run(options) {
  const { deck, canvas, printPath, output } = discoverDeck(options.dir, options.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const playwright = loadPlaywright();
  const executablePath = findChromeExecutable();
  const browser = await playwright.chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
  try {
    const page = await browser.newPage({ viewport: canvas });
    await page.goto(pathToFileURL(printPath).href, { waitUntil: 'networkidle' });
    // CDN 폰트가 로드되기 전에 인쇄하면 폴백 폰트가 임베드된다 — 폰트 준비를 명시 대기.
    await page.evaluate(() => document.fonts.ready);
    if (options.notes) {
      // --notes: 각 슬라이드 페이지 뒤에 노트 페이지 삽입. notes 없는 슬라이드는 생략(빈 페이지 금지).
      const notesData = deck.slides.map((slide, index) => ({
        no: String(index + 1).padStart(2, '0'),
        title: slide.title || '',
        notes: Array.isArray(slide.notes) ? slide.notes.join('\n') : (slide.notes || ''),
      }));
      const inserted = await page.evaluate((data) => {
        const style = document.createElement('style');
        style.textContent = `
          .notes-page { background: #ffffff; color: #1c1c22; padding: 8% 7%; display: flex; flex-direction: column; font-family: 'Pretendard Variable', Pretendard, sans-serif; page-break-after: always; break-after: page; }
          .notes-page .notes-head { display: flex; align-items: baseline; gap: 16px; border-bottom: 2px solid #1c1c22; padding-bottom: 12px; }
          .notes-page .notes-no { font-size: 30px; font-weight: 800; }
          .notes-page .notes-title { font-size: 22px; font-weight: 600; }
          .notes-page .notes-body { flex: 1; margin-top: 28px; font-size: 19px; line-height: 1.7; }
          .notes-page .notes-foot { font-size: 11px; letter-spacing: .14em; opacity: .45; }`;
        document.head.appendChild(style);
        const pages = document.querySelectorAll('.print-page');
        let count = 0;
        pages.forEach((pageEl, index) => {
          const entry = data[index];
          if (!entry || !entry.notes) return;
          const section = document.createElement('section');
          section.className = 'print-page notes-page';
          const head = document.createElement('div');
          head.className = 'notes-head';
          const no = document.createElement('span'); no.className = 'notes-no'; no.textContent = entry.no;
          const title = document.createElement('span'); title.className = 'notes-title'; title.textContent = entry.title;
          head.append(no, title);
          const body = document.createElement('div'); body.className = 'notes-body'; body.textContent = entry.notes;
          const foot = document.createElement('div'); foot.className = 'notes-foot'; foot.textContent = 'SPEAKER NOTES';
          section.append(head, body, foot);
          pageEl.after(section);
          count += 1;
        });
        return count;
      }, notesData);
      console.log(`notes pages inserted: ${inserted}`);
    }
    await page.waitForTimeout(options.wait);
    await page.pdf({
      path: output,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }
  console.log(`vector pdf written: ${output} (${deck.slides.length} slides)`);
}

run(parseArgs(process.argv.slice(2))).catch((error) => {
  console.error(`export-vector-pdf failed: ${error.message}`);
  process.exitCode = 1;
});
