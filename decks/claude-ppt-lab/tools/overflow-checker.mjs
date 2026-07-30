#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire, Module } from 'node:module';

const require = createRequire(import.meta.url);

const CANVAS_PRESETS = {
  hd: { width: 1280, height: 720 },
};

const TARGET_SELECTORS = [
  '.title',
  '.kicker',
  '.subtitle',
  '.body-copy',
  '.grid',
  '.card',
  '.hero-card-grid',
  '.hero-card',
  '.comparison',
  '.comparison-panel',
  '.steps',
  '.step',
  '.diagram',
  '.diagram-center',
  '.diagram-node-row',
  '.diagram-node',
  '.flow',
  '.flow-stage',
  '.summary-grid',
  '.summary-card',
  '.conclusion',
  '.case-map',
  '.case-map-item',
  '.case-map-thumb',
  '.split-screen',
  '.split-copy',
  '.split-visual',
  '.timeline-cards',
  '.timeline-card',
  '.timeline-conclusion',
  '.pipeline-lanes',
  '.pipeline-main',
  '.pipeline-step',
  '.pipeline-controls',
  '.result-transitions',
  '.transition-row',
  '.stats',
  '.stat',
  '.chart-section',
  '.chart-wrapper',
  '.chart-controls',
  '.three-shell',
  '.media-shell',
  '.media-frame',
  '.media-meta',
  '.demo-panel',
  '.demo-controls',
  '.demo-result',
  '.timer-section',
  '.embed-section',
  '.device-frame',
  '.asset-architecture',
  '.asset-arch-node',
  '.asset-metric-cards',
  '.asset-metric-card',
  '.asset-source-badge',
  '.plan-wrapper',
  '.ba-wrapper',
  '.qr-card',
  '.source-note',
];

const DOCUMENT_TOLERANCE = 2;
const ELEMENT_HORIZONTAL_TOLERANCE = 2;
const ELEMENT_VERTICAL_TOLERANCE = 8;

function parseArgs(argv) {
  const options = {
    dir: process.cwd(),
    includeIndex: false,
    allowSkip: false,
    json: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dir') options.dir = path.resolve(argv[++index]);
    else if (arg === '--include-index') options.includeIndex = true;
    else if (arg === '--allow-skip') options.allowSkip = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node tools/overflow-checker.mjs [--dir deck-folder] [--include-index] [--allow-skip] [--json]`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function fileName(slide) {
  return `${String(slide.no).padStart(2, '0')}-${slide.slug}.html`;
}

function discoverDeckFiles(deckDir, includeIndex) {
  const deckPath = path.join(deckDir, 'content', 'slides.json');
  if (!fs.existsSync(deckPath)) throw new Error(`Missing ${deckPath}`);
  const deck = readJson(deckPath);
  const canvas = CANVAS_PRESETS[deck.meta?.canvas || 'hd'] || CANVAS_PRESETS.hd;
  const files = deck.slides.map((slide) => ({
    label: `${String(slide.no).padStart(2, '0')} ${slide.title}`,
    file: path.join(deckDir, fileName(slide)),
  }));
  if (includeIndex) files.unshift({ label: 'index', file: path.join(deckDir, 'index.html'), index: true });
  for (const entry of files) {
    if (!fs.existsSync(entry.file)) throw new Error(`Missing generated HTML: ${entry.file}`);
  }
  return { canvas, files };
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
  const launchOptions = executablePath ? { headless: true, executablePath } : { headless: true };
  return chromium.launch(launchOptions);
}

async function inspectPage(page, entry) {
  await page.goto(pathToFileURL(entry.file).href, { waitUntil: 'load' });
  try {
    await page.waitForLoadState('networkidle', { timeout: 2500 });
  } catch {
    // CDN-backed interactive slides can keep requests open; layout checks can still proceed.
  }
  await page.waitForTimeout(700);
  return page.evaluate(({ selectors, tolerances }) => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const doc = document.documentElement;
    const body = document.body;
    const nav = document.querySelector('.slide-nav');
    const navTop = nav ? nav.getBoundingClientRect().top : viewport.height;
    const issues = [];

    function selectorFor(el) {
      if (el.id) return `#${el.id}`;
      const classes = [...el.classList].slice(0, 3).map((name) => `.${name}`).join('');
      return `${el.tagName.toLowerCase()}${classes}`;
    }

    const docOverflow = {
      scrollWidth: doc.scrollWidth,
      clientWidth: viewport.width,
      scrollHeight: doc.scrollHeight,
      clientHeight: viewport.height,
    };
    if (docOverflow.scrollWidth > viewport.width + tolerances.document) {
      issues.push({ type: 'document-horizontal-overflow', selector: 'document', ...docOverflow });
    }
    if (docOverflow.scrollHeight > viewport.height + tolerances.document) {
      issues.push({ type: 'document-vertical-overflow', selector: 'document', ...docOverflow });
    }

    const elements = [...document.querySelectorAll(selectors.join(','))]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      });

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const selector = selectorFor(el);
      if (el.scrollWidth > el.clientWidth + tolerances.elementX || el.scrollHeight > el.clientHeight + tolerances.elementY) {
        issues.push({
          type: 'element-internal-overflow',
          selector,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
        });
      }
      if (rect.left < -1 || rect.right > viewport.width + 1 || rect.top < -1 || rect.bottom > viewport.height + 1) {
        issues.push({
          type: 'element-outside-viewport',
          selector,
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
          viewport,
        });
      }
      if (!el.closest('.slide-nav') && rect.bottom > navTop - 1) {
        issues.push({
          type: 'nav-overlap-risk',
          selector,
          bottom: Math.round(rect.bottom),
          navTop: Math.round(navTop),
        });
      }
    }

    return {
      title: document.title,
      viewport,
      navTop: Math.round(navTop),
      issues,
    };
  }, {
    selectors: TARGET_SELECTORS,
    tolerances: {
      document: DOCUMENT_TOLERANCE,
      elementX: ELEMENT_HORIZONTAL_TOLERANCE,
      elementY: ELEMENT_VERTICAL_TOLERANCE,
    },
  });
}

async function run(options) {
  const { canvas, files } = discoverDeckFiles(options.dir, options.includeIndex);
  const { chromium } = loadPlaywright();
  const browser = await launchBrowser(chromium);
  const results = [];
  try {
    for (const entry of files) {
      const page = await browser.newPage({ viewport: canvas });
      const result = await inspectPage(page, entry);
      await page.close();
      results.push({ ...entry, ...result, file: path.relative(options.dir, entry.file) });
    }
  } finally {
    await browser.close();
  }
  return results;
}

function printResults(results, json) {
  const issueCount = results.reduce((sum, result) => sum + result.issues.length, 0);
  if (json) {
    console.log(JSON.stringify({ ok: issueCount === 0, issueCount, results }, null, 2));
    return;
  }
  if (issueCount === 0) {
    console.log(`overflow check passed: ${results.length} page(s), 0 issue(s)`);
    return;
  }
  console.error(`overflow check failed: ${results.length} page(s), ${issueCount} issue(s)`);
  for (const result of results) {
    if (result.issues.length === 0) continue;
    console.error(`- ${result.file}: ${result.issues.length} issue(s)`);
    for (const issue of result.issues.slice(0, 8)) {
      console.error(`  - ${issue.type} ${issue.selector}`);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  try {
    const results = await run(options);
    const issueCount = results.reduce((sum, result) => sum + result.issues.length, 0);
    printResults(results, options.json);
    process.exit(issueCount === 0 ? 0 : 1);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (options.allowSkip) {
      console.warn(`overflow check skipped: ${message}`);
      process.exit(0);
    }
    console.error(`overflow check could not run: ${message}`);
    process.exit(2);
  }
}

main();
