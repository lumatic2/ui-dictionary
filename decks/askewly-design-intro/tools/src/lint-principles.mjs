// 거장 원칙 린트 (옵트인 --lint) — 규칙 정본: ui-dictionary methodology/slide-production.md §6
// R1 제목=완결 문장(assertion) · R2 슬라이드당 메시지 1 · R3 텍스트 과밀
// 전부 warning, 차단 없음. 각 경고는 규칙 id + 근거 등급을 문자열로 들고 다닌다
// (slide-spec 철학 — 근거 없는 임계값을 차단으로 승격하지 않는다).

const NOUN_TITLE_BLACKLIST = new Set(['개요', '결과', '소개', '배경', '현황', '목차', '정리']);
const KOREAN_SENTENCE_ENDING = /(다|까|자|요)\s*[.!?]?$/;
const ENGLISH_VERB_HINT = /\b(is|are|was|were|has|have|does|do|can|will|should|must|makes|means|shows|drives|beats|wins|fails|works|needs|cuts|grows|saves)\b/i;
const R1_EXEMPT_LAYOUTS = new Set(['cover', 'closing', 'qr-embed']);
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

export function lintPrinciples(deck) {
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
  });

  if (r1Suspects > 0) {
    warnings.push(`lint R1[실증] 의심 ${r1Suspects}건: 종결어미·동사 없는 제목 — 주장(완결 문장)인지 확인 (title-only read test 는 G3 사람 체크)`);
  }

  return warnings;
}
