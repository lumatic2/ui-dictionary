#!/usr/bin/env node
// optimize-images.mjs — 덱 assets/ 이미지 최적화 (opt-in, DQ2)
// 캔버스 초과 이미지를 리사이즈(기본 최대 폭 3840 = hd 캔버스 ×2 레티나)하고 webp 로 재인코딩한다.
// 원본은 assets/src/ 에 보존하고, content/slides.json 의 참조를 새 파일명으로 재작성한다(백업 생성).
// 의존성: sharp — 미설치면 안내 후 종료 (pptxgenjs 선례 패턴). 실행 후 build-slides.mjs 재실행 필요.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const options = { dir: process.cwd(), maxWidth: 3840, quality: 82, alphaQuality: 90 };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--dir') options.dir = path.resolve(args[++i]);
  else if (arg === '--max-width') options.maxWidth = Number(args[++i]);
  else if (arg === '--quality') options.quality = Number(args[++i]);
  else if (arg === '--help') {
    console.log(`Usage: node tools/optimize-images.mjs [--dir deck-folder] [--max-width 3840] [--quality 82]

덱 assets/ 의 jpg/jpeg/png 를 캔버스 초과분 리사이즈 + webp 재인코딩한다.
- 원본은 assets/src/ 보존 (재최적화·회귀 대비)
- content/slides.json 의 참조 문자열을 새 .webp 파일명으로 재작성 (slides.json.bak 백업)
- 투명 PNG(누끼)는 알파 보존 webp (quality ${options.alphaQuality})
- 실행 후 node tools/build-slides.mjs 로 재빌드할 것`);
    process.exit(0);
  }
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('sharp 가 설치되어 있지 않다. 덱 폴더에서 다음을 실행한 뒤 재시도:');
  console.error('  npm install sharp');
  process.exit(2);
}

const assetsDir = path.join(options.dir, 'assets');
const srcDir = path.join(assetsDir, 'src');
const slidesPath = path.join(options.dir, 'content', 'slides.json');
if (!fs.existsSync(assetsDir)) {
  console.error(`assets 폴더가 없다: ${assetsDir}`);
  process.exit(1);
}

const targets = fs.readdirSync(assetsDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (!targets.length) {
  console.log('최적화 대상(jpg/png) 없음 — webp/기타는 건너뜀.');
  process.exit(0);
}
fs.mkdirSync(srcDir, { recursive: true });

let slidesJson = fs.existsSync(slidesPath) ? fs.readFileSync(slidesPath, 'utf8') : null;
const report = [];
for (const file of targets) {
  const abs = path.join(assetsDir, file);
  const before = fs.statSync(abs).size;
  const image = sharp(abs);
  const meta = await image.metadata();
  const hasAlpha = Boolean(meta.hasAlpha);
  const outName = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const outAbs = path.join(assetsDir, outName);
  await image
    .resize({ width: options.maxWidth, withoutEnlargement: true })
    .webp({ quality: hasAlpha ? options.alphaQuality : options.quality })
    .toFile(outAbs);
  const after = fs.statSync(outAbs).size;
  fs.renameSync(abs, path.join(srcDir, file)); // 원본 보존
  if (slidesJson) slidesJson = slidesJson.split(`assets/${file}`).join(`assets/${outName}`);
  report.push({ file, outName, width: meta.width, resized: (meta.width || 0) > options.maxWidth, alpha: hasAlpha, before, after });
}

if (slidesJson) {
  fs.copyFileSync(slidesPath, `${slidesPath}.bak`);
  fs.writeFileSync(slidesPath, slidesJson);
}

let beforeTotal = 0;
let afterTotal = 0;
for (const r of report) {
  beforeTotal += r.before;
  afterTotal += r.after;
  console.log(`${r.file} → ${r.outName}  ${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB${r.resized ? ` (리사이즈 ${r.width}→≤${options.maxWidth})` : ''}${r.alpha ? ' [alpha 보존]' : ''}`);
}
console.log(`합계 ${(beforeTotal / 1024).toFixed(0)}KB → ${(afterTotal / 1024).toFixed(0)}KB (${Math.round((1 - afterTotal / beforeTotal) * 100)}% 감소) · 원본 assets/src/ 보존 · slides.json 참조 재작성${slidesJson ? '' : ' (slides.json 없음 — 수동 갱신)'}`);
console.log('다음: node tools/build-slides.mjs 재빌드 (standalone/export 재산출 포함)');
