#!/usr/bin/env node
// 단일 파일 오프라인 export — 덱 전체를 의존성 없는 HTML 1개로 병합한다.
// 본체는 내비게이션 모델 병합(renderStandalone: 문서 N개 → <section> 상태 전환)이고,
// 이 스크립트는 그 산출에 외부 자원(CDN CSS/JS·웹폰트·로컬 이미지)을 base64 로 인라인한다.
// 인라인 실패는 침묵하지 않는다 — 실패 목록을 stderr 로 고지하고 원본 URL 을 유지한다(온라인에서만 동작).
import fs from 'node:fs';
import path from 'node:path';
import { loadDeck, renderers } from './src/builder-core.mjs';

const SIZE_WARN_BYTES = 20 * 1024 * 1024; // 20MB (base64 ~33% 오버헤드 감안 튜닝값)
const root = process.cwd();
const failures = [];

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.css': 'text/css', '.js': 'text/javascript',
};

function mimeOf(url) {
  const clean = url.split(/[?#]/)[0];
  return MIME[path.extname(clean).toLowerCase()] || 'application/octet-stream';
}

async function fetchBytes(url, baseUrl) {
  const resolved = new URL(url, baseUrl).href;
  const res = await fetch(resolved);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { buffer: Buffer.from(await res.arrayBuffer()), resolved };
}

function readLocal(relUrl) {
  const clean = decodeURIComponent(relUrl.split(/[?#]/)[0]);
  const abs = path.resolve(root, clean);
  if (!abs.startsWith(path.resolve(root))) throw new Error('path escapes deck root');
  return fs.readFileSync(abs);
}

async function toDataUri(url, baseUrl) {
  if (url.startsWith('data:')) return url;
  if (/^https?:/.test(url) || baseUrl) {
    const { buffer } = await fetchBytes(url, baseUrl);
    return `data:${mimeOf(url)};base64,${buffer.toString('base64')}`;
  }
  const buffer = readLocal(url);
  return `data:${mimeOf(url)};base64,${buffer.toString('base64')}`;
}

async function inlineCssUrls(css, cssBaseUrl) {
  const refs = [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)];
  for (const match of refs) {
    const target = match[2];
    if (target.startsWith('data:')) continue;
    try {
      const dataUri = await toDataUri(target, cssBaseUrl);
      css = css.replace(match[0], `url(${dataUri})`);
    } catch (error) {
      failures.push(`css url ${target} — ${error.message}`);
    }
  }
  return css;
}

async function inlineHtml(html) {
  // <link rel="stylesheet"> → <style> (내부 url() 재귀 인라인)
  const links = [...html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/g)].filter((m) => /rel="stylesheet"/.test(m[0]));
  for (const match of links) {
    const href = match[1];
    try {
      let css;
      let base;
      if (/^https?:/.test(href)) {
        const { buffer, resolved } = await fetchBytes(href);
        css = buffer.toString('utf8');
        base = resolved;
      } else {
        css = readLocal(href).toString('utf8');
        base = null;
      }
      css = await inlineCssUrls(css, base);
      html = html.replace(match[0], `<style>/* inlined: ${href} */\n${css}</style>`);
    } catch (error) {
      failures.push(`stylesheet ${href} — ${error.message}`);
    }
  }
  // <script src> → 인라인
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)];
  for (const match of scripts) {
    const src = match[1];
    try {
      const body = /^https?:/.test(src) ? (await fetchBytes(src)).buffer.toString('utf8') : readLocal(src).toString('utf8');
      html = html.replace(match[0], `<script>/* inlined: ${src} */\n${body}</script>`);
    } catch (error) {
      failures.push(`script ${src} — ${error.message}`);
    }
  }
  // <img src> → data URI
  const imgs = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)];
  for (const match of imgs) {
    const src = match[1];
    if (src.startsWith('data:')) continue;
    try {
      const dataUri = await toDataUri(src, /^https?:/.test(src) ? src : null);
      html = html.replace(`src="${src}"`, `src="${dataUri}"`);
    } catch (error) {
      failures.push(`img ${src} — ${error.message}`);
    }
  }
  // preconnect/preload 힌트 링크 제거 — stylesheet 를 인라인한 뒤에는 네트워크 힌트만 남아 오프라인에서 요청을 만든다
  html = html.replace(/<link rel="(?:preconnect|preload)"[^>]*>\s*/g, '');
  // 인라인 <style> 안의 로컬/원격 url()
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
  for (const match of styles) {
    if (match[1].includes('/* inlined:')) continue;
    const inlined = await inlineCssUrls(match[1], null);
    if (inlined !== match[1]) html = html.replace(match[1], inlined);
  }
  return html;
}

const deck = loadDeck();
let html = renderers.renderStandalone(deck);
html = await inlineHtml(html);

const slug = String(deck.meta.title || 'deck').toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '');
const outDir = path.join(root, 'export');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.standalone.html`);
fs.writeFileSync(outPath, html);

const size = fs.statSync(outPath).size;
console.log(`standalone: ${path.relative(root, outPath)} (${(size / 1024 / 1024).toFixed(2)} MB, slides ${deck.slides.length})`);
if (size > SIZE_WARN_BYTES) console.warn(`⚠ 산출 크기가 ${(SIZE_WARN_BYTES / 1024 / 1024).toFixed(0)}MB 를 초과 — 대형 에셋 축소를 검토하라`);
if (failures.length) {
  console.error(`⚠ 인라인 실패 ${failures.length}건 — 아래 자원은 온라인에서만 동작한다:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exitCode = 2;
}
