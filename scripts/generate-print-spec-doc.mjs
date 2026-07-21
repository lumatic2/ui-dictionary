#!/usr/bin/env node
// Generates docs/design-system/print-spec.md from the compiled template-core build.
//
// 왜 생성인가: 인쇄 규격 값의 정본은 packages/template-core/src/print-spec.ts 하나다.
// 문서가 그 값을 손으로 옮긴 사본이면 코드가 바뀐 뒤에도 문서는 옛 숫자를 말한다 —
// 그리고 에이전트가 읽는 것은 문서다. 그래서 값은 컴파일된 dist 에서 직접 읽는다.
//
// Usage:
//   node scripts/generate-print-spec-doc.mjs            # 생성
//   node scripts/generate-print-spec-doc.mjs --check    # 드리프트 검사(재생성 결과 == 커밋본이면 exit 0)
//
// 선행: npm --prefix packages/template-core run build (dist/index.js 최신화)

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST = path.join(REPO_ROOT, "packages", "template-core", "dist", "index.js");
const OUT = path.join(REPO_ROOT, "docs", "design-system", "print-spec.md");

if (!existsSync(DIST)) {
  console.error(`template-core dist 가 없다: ${DIST}\n먼저: npm --prefix packages/template-core run build`);
  process.exit(2);
}

// Windows 절대경로는 그대로 import 할 수 없다 — file:// URL 로 변환해야 한다.
const { printSpecs, PRINT_DPI, MM_PER_INCH, mmToPrintPx } = await import(pathToFileURL(DIST).href);

/** 300dpi 재단 픽셀 — 값이 아니라 계산도 정본 함수로 낸다. */
function trimPx(spec) {
  return `${mmToPrintPx(spec.trim.width)}×${mmToPrintPx(spec.trim.height)}`;
}

function fmt(n) {
  return Number.isInteger(n) ? String(n) : String(n);
}

const rows = Object.values(printSpecs).map((spec) => {
  const posting = spec.postingMarginMm === undefined ? "—" : `${fmt(spec.postingMarginMm)}mm`;
  return `| \`${spec.id}\` | ${spec.label} | ${fmt(spec.trim.width)}×${fmt(spec.trim.height)}mm | ${fmt(spec.bleedMm)}mm | ${fmt(spec.safeAreaMm)}mm | ${posting} | ${trimPx(spec)}px |`;
});

const mmExample = 85;
const doc = `<!-- GENERATED — do not edit by hand.
     정본: packages/template-core/src/print-spec.ts
     재생성: node scripts/generate-print-spec-doc.mjs
     드리프트 검사: node scripts/generate-print-spec-doc.mjs --check -->

# Print Spec — 인쇄 규격 계약

지면 산출물(명함·포스터·인포그래픽)의 재단 크기·도련·안전영역 계약이다. 값은
\`packages/template-core/src/print-spec.ts\` 가 정본이고 이 문서는 거기서 생성된다 —
숫자가 다르면 코드가 맞다.

매체별로 게이트가 어떻게 갈리는지는 [medium-taxonomy.md](./medium-taxonomy.md).

## 왜 이 계약이 필요한가

화면에는 재단이 없다. 지면에는 있다 — 종이는 잘리고, 자르는 기계는 1~2mm 어긋난다.
그래서 두 가지를 동시에 지켜야 한다.

- **도련(bleed)**: 배경은 재단선 **바깥까지** 넘어가야 한다. 안 그러면 재단 오차로
  가장자리에 흰 띠가 생긴다.
- **안전영역(safe area)**: 필수 텍스트·로고는 재단선에서 **안쪽으로** 물러나 있어야 한다.
  안 그러면 잘려 나간다.

둘은 반대 방향이고 둘 다 필요하다.

## 규격 표

| id | 규격 | 재단 크기 | 도련 | 안전영역 | 게시 여백 | ${PRINT_DPI}dpi 재단 px |
|---|---|---|---|---|---|---|
${rows.join("\n")}

한국 명함은 **두 표준이 공존한다.** 90×50mm(전통 — 금융·법률·공공 선호)와
85×55mm(카드지갑 규격 — IT·디자인·스타트업 선호)는 비율이 1.8 대 1.545로 다르다.
"한국 명함"이라는 하나의 값으로 뭉갤 수 없다.

**게시 여백은 안전영역과 다른 값이고 다른 목적이다.** 안전영역은 재단 오차 대비(3mm),
게시 여백은 액자·클립에 물리적으로 가려지는 것 대비(15mm)다. 포스터 전용이며 재단
검증에는 쓰지 않는다.

## 해상도와 환산

인쇄 발주 표준 해상도는 **${PRINT_DPI}dpi**, 1인치 = ${MM_PER_INCH}mm 이다.

\`\`\`
px = mm / ${MM_PER_INCH} × dpi
\`\`\`

${PRINT_DPI}dpi 에서 1mm ≈ ${(PRINT_DPI / MM_PER_INCH).toFixed(3)}px.
예: ${mmExample}mm → ${mmToPrintPx(mmExample)}px.

이 공식이 절대 환산의 유일한 출처다. 논리 px ↔ mm 다리는
\`mmPerLogicalPx()\` / \`mmToLogicalPx()\` 가 맡는다.

## 근거의 한계 (그대로 옮긴다)

계약을 쓰는 쪽이 알아야 할 두 가지다.

- **A계열 안전영역 ${fmt(printSpecs["iso-a4"].safeAreaMm)}mm 는 유추다.** 포스터 전용 안전영역 수치의 1차 출처를
  찾지 못했다. 명함의 "재단선 안쪽 3mm" 원칙이 재단 오차라는 같은 물리 현상에서
  나오므로 그대로 옮겼다. **실제 발주 전 인쇄소 확인 대상이다.**
- **재단 표시 선 길이는 출처가 없다.** 도련 폭과 같게 뒀다 — 도련이 이미 규격이 정한
  유일한 "재단선 바깥 여유" 치수라 그것을 기준으로 삼았다.

나머지 수치의 출처: \`research/2026-07-20-template-production-hardening-print-spec.md\`,
\`research/2026-07-20-template-production-hardening-format-layout-taxonomy.md\`.

## 검증 API

\`@askewly/template-core\` 가 청사진 단위로 계약 위반을 잡는다.

| 함수 | 무엇을 잡는가 |
|---|---|
| \`validateSpecDeclaration(blueprint)\` | 선언한 규격과 실제 종횡비가 어긋남 (\`SPEC_RATIO_MISMATCH\`, \`PRINT_SPEC_NOT_FOUND\`) |
| \`validatePrintSpec(blueprint)\` | 위 + 안전영역 침범(\`SAFE_AREA_VIOLATION\`) · 배경이 재단선을 안 덮음(\`BLEED_NOT_COVERED\`) |
| \`printSheetGeometry(blueprint)\` | 도련·재단 표시를 포함한 지면 전체 크기 |
| \`printPixelSize(blueprint, spec)\` | 실제 인쇄 픽셀 크기(재단 기준, 도련 제외) |

청사진은 자기 규격을 **선언한다**(\`output.printSpecId\`). 종횡비는 규격을 고르는 근거가
아니라 그 선언을 검증하는 수단이다 — 1050×600px(비율 1.75)가 90×50mm인지
88.9×50.8mm인지 종횡비만으로는 갈리지 않기 때문이다.
`;

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : null;
  if (current === null) {
    console.error(`DRIFT: ${path.relative(REPO_ROOT, OUT)} 가 없다.`);
    process.exit(1);
  }
  // 커밋본이 CRLF 로 체크아웃돼도 내용 동일성은 유지된다 — 줄끝만 정규화해 비교한다.
  if (current.replace(/\r\n/g, "\n") !== doc.replace(/\r\n/g, "\n")) {
    console.error(
      `DRIFT: 커밋된 print-spec.md 가 print-spec.ts 로부터 재생성한 결과와 다르다.\n` +
        `고치는 법: node scripts/generate-print-spec-doc.mjs`,
    );
    process.exit(1);
  }
  console.log("print-spec.md OK — 정본과 일치한다.");
  process.exit(0);
}

writeFileSync(OUT, doc);
console.log(`wrote ${path.relative(REPO_ROOT, OUT)} (${Object.keys(printSpecs).length} specs)`);
