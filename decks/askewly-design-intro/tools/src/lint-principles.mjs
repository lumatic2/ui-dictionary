// 거장 원칙 린트 (옵트인 --lint) — 규칙 정본: ui-dictionary methodology/slide-production.md §6
// R1 제목=완결 문장(assertion) · R2 슬라이드당 메시지 1 · R3 텍스트 과밀
// 전부 warning, 차단 없음. 각 경고는 규칙 id + 근거 등급을 문자열로 들고 다닌다
// (slide-spec 철학 — 근거 없는 임계값을 차단으로 승격하지 않는다).

const NOUN_TITLE_BLACKLIST = new Set(['개요', '결과', '소개', '배경', '현황', '목차', '정리']);
const KOREAN_SENTENCE_ENDING = /(다|까|자|요)\s*[.!?]?$/;
const ENGLISH_VERB_HINT = /\b(is|are|was|were|has|have|does|do|can|will|should|must|makes|means|shows|drives|beats|wins|fails|works|needs|cuts|grows|saves)\b/i;
const R1_EXEMPT_LAYOUTS = new Set(['cover', 'closing', 'qr-embed', 'hero-motion']); // hero-motion: 표지·챕터 전환 대체 (SX3 dogfood 적발)
const R2_EXEMPT_LAYOUTS = new Set(['comparison-2col', 'summary-grid']);
const R3_VISUAL_LAYOUTS = new Set(['chart-interactive', 'three-scene', 'before-after', 'qr-embed', 'diagram-box', 'case-map', 'split-screen', 'timeline-cards', 'pipeline-lanes', 'result-transitions']);
const R3_CHAR_LIMIT = 250;

function textLen(value) {
  return typeof value === 'string' ? [...value.trim()].length : 0;
}

function slideTextTotal(slide) {
  let total = textLen(slide.title) + textLen(slide.subtitle) + textLen(slide.body);
  for (const item of slide.items || []) {
    total += textLen(item.title || item.label) + textLen(item.body || item.description) + textLen(item.value);
  }
  return total;
}

function parallelSignals(title) {
  if (typeof title !== 'string') return 0;
  let count = 0;
  count += (title.match(/및/g) || []).length;
  count += (title.match(/&/g) || []).length;
  count += (title.match(/,/g) || []).length;
  count += (title.match(/[가-힣](와|과)\s/g) || []).length;
  return count;
}

const INTERACTIVE_LAYOUTS = new Set(['chart-interactive', 'three-scene', 'before-after', 'qr-embed']);
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
// AI-slop 디폴트 시그니처 (규칙 정본: ui-dictionary methodology/prompt-patterns.md 스멜 테스트 — KG design-prompt-ai-slop-smell-test-검수)
const SLOP_SHADOW = /0\s+4px\s+12px\s+rgba\(0,\s*0,\s*0,\s*0?\.1\)/;
const SLOP_FONT_ONLY = /^(inter|geist)$/i;
const STAGGER_LIMIT = 10;
// Q2 — 카드형 레이아웃의 병렬 항목 상한 (quality-rubric.md Q2, UCSD rule of four).
// 구조상 다항이 정상인 레이아웃(step-flow·summary-grid·bento 등)은 대상 밖 — 예외 판단은 G5.
const Q2_CARD_LAYOUTS = new Set(['hero-cards', 'closing', 'comparison-2col']);
const Q2_CARD_LIMIT = 4;

function slideTexts(slide) {
  const texts = [slide.title, slide.subtitle, slide.body, slide.kicker];
  for (const item of slide.items || []) texts.push(item.title, item.body, item.label, item.value);
  return texts.filter((t) => typeof t === 'string');
}

export function lintPrinciples(deck, { customTheme } = {}) {
  const warnings = [];
  let r1Suspects = 0;

  (deck.slides || []).forEach((slide, index) => {
    const label = `slides[${index}]`;
    const title = typeof slide.title === 'string' ? slide.title.trim() : '';

    // R1 — 제목=완결 문장 (근거: assertion-evidence, Penn State 실증)
    if (!R1_EXEMPT_LAYOUTS.has(slide.layout) && title) {
      if (NOUN_TITLE_BLACKLIST.has(title)) {
        warnings.push(`${label}.title lint R1[실증]: "${title}" 는 명사구 제목 — 슬라이드의 주장을 완결 문장으로 (예: "결과" → "처리군 생존율이 40% 높았다")`);
      } else if (!KOREAN_SENTENCE_ENDING.test(title) && !ENGLISH_VERB_HINT.test(title)) {
        r1Suspects += 1;
      }
    }

    // R2 — 슬라이드당 메시지 1 (근거: 맥킨지 관행 — 통설)
    if (!R2_EXEMPT_LAYOUTS.has(slide.layout) && parallelSignals(title) >= 2) {
      warnings.push(`${label}.title lint R2[통설]: 병렬 신호 ${parallelSignals(title)}개 — 메시지가 둘이면 슬라이드도 둘로`);
    }

    // R3 — 텍스트 과밀 (근거: 6×6 계열 통설 — 임계값 조정 가능)
    if (!R3_VISUAL_LAYOUTS.has(slide.layout) && !slide.assets && slideTextTotal(slide) > R3_CHAR_LIMIT) {
      warnings.push(`${label} lint R3[통설]: 본문 텍스트 ${slideTextTotal(slide)}자 (> ${R3_CHAR_LIMIT}) — 시각 증거로 대체하거나 발표자 노트로 이동`);
    }

    // R4 — 모션 규율 (근거: 규율 — style-system.md 모션 절)
    const items = slide.items || [];
    if (items.length > STAGGER_LIMIT) {
      warnings.push(`${label} lint R4[규율]: 항목 ${items.length}개 (> ${STAGGER_LIMIT}) — stagger 등장이 늘어져 뒤 항목이 죽는다. 분할하거나 stagger 없는 구성으로`);
    }
    const fragmented = items.filter((item) => Number.isFinite(item.fragment));
    if (fragmented.length && INTERACTIVE_LAYOUTS.has(slide.layout)) {
      warnings.push(`${label} lint R4[규율]: 인터랙티브 layout(${slide.layout})에 fragment — article 매핑이 보장되지 않는다 (interactive.md 경계)`);
    }
    const orders = fragmented.map((item) => item.fragment);
    if (new Set(orders).size !== orders.length) {
      warnings.push(`${label} lint R4[규율]: fragment 순번 중복 — 공개 순서가 모호하다`);
    }
    // animId — 같은 장 안 중복 금지 (view-transition-name 은 문서 내 유일해야 전환이 성립)
    const animIds = items.map((item) => item.animId).filter((v) => typeof v === 'string');
    if (new Set(animIds).size !== animIds.length) {
      warnings.push(`${label} lint R4[규율]: animId 중복 — 같은 장 안에서 view-transition-name 이 겹치면 전환이 무시된다`);
    }

    // Q2 — 카드 항목 4개 상한 (근거: 통설 — quality-rubric.md Q2, UCSD rule of four)
    if (Q2_CARD_LAYOUTS.has(slide.layout) && items.length > Q2_CARD_LIMIT) {
      warnings.push(`${label} lint Q2[통설]: 카드 ${items.length}개 (> ${Q2_CARD_LIMIT}) — rule of four. 장을 나누거나 그룹화 (quality-rubric.md Q2)`);
    }

    // R6 — 아이콘 규율 (근거: 규율 — SKILL §6 이모지 금지, lucide/lobe SVG 만)
    for (const text of slideTexts(slide)) {
      if (EMOJI_PATTERN.test(text)) {
        warnings.push(`${label} lint R6[규율]: 텍스트에 이모지 "${[...text].find((ch) => EMOJI_PATTERN.test(ch))}" — 아이콘은 item.icon(lucide/lobe SVG)으로, 이모지·글리프 금지`);
        break;
      }
    }
  });

  // R5 — anti-slop 디폴트 시그니처 (custom theme.json 만 기계 검사 가능 — 내장 테마는 이미 규율 준수)
  if (customTheme) {
    const themeText = JSON.stringify(customTheme);
    if (SLOP_SHADOW.test(themeText)) {
      warnings.push(`theme.json lint R5[규율]: 그림자 "0 4px 12px rgba(0,0,0,.1)" — AI-slop 디폴트 시그니처. 브랜드 근거 있는 값으로 (스멜 테스트: methodology/prompt-patterns.md)`);
    }
    const fonts = [customTheme.fontFamily, customTheme.headingFont, customTheme.bodyFont].filter((f) => typeof f === 'string');
    if (fonts.length && fonts.every((f) => SLOP_FONT_ONLY.test(f.split(',')[0].trim().replace(/['"]/g, '')))) {
      warnings.push('theme.json lint R5[규율]: 서체가 Inter/Geist 단독 — AI-slop 디폴트. 브랜드 서체 또는 조합 근거를 명시');
    }
    const radii = [...themeText.matchAll(/"(?:radius|borderRadius|cardRadius)[^"]*":\s*"?(\d+)(?:px)?"?/g)].map((m) => Number(m[1]));
    if (radii.length && radii.every((r) => r === 8 || r === 12)) {
      warnings.push('theme.json lint R5[규율]: 라운드가 8/12px 뿐 — AI-slop 디폴트 시그니처. 브랜드 스케일에서 파생된 값인지 확인');
    }
  }

  if (r1Suspects > 0) {
    warnings.push(`lint R1[실증] 의심 ${r1Suspects}건: 종결어미·동사 없는 제목 — 주장(완결 문장)인지 확인 (title-only read test 는 G3 사람 체크)`);
  }

  return warnings;
}
