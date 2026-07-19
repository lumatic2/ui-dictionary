import type { TemplateBlueprint } from '../types.js'

/**
 * 청사진 정본 — 포맷당 2개, 총 6개를 **명시 선언**한다.
 *
 * 파생 생성기를 두지 않는 이유: 구 `formatPackCatalog`는 기준 청사진 3종을 복제해
 * 모든 슬롯에 `x+24`/`width-48`을 균일 적용한 `-split` 변종을 만들었다. 좌표만 옮긴
 * 것이라 카탈로그 숫자 6이 실질 3이었다.
 *
 * 리서치(`research/2026-07-20-...-format-layout-taxonomy.md`)가 도출한 포맷별 결정 축은
 * 셋 다 **그리드/슬롯 구조 자체**의 변화다 — 좌표 offset으로는 흉내낼 수 없다:
 *
 * | 포맷 | A | B | 구별 축 |
 * |---|---|---|---|
 * | 명함 | 가로 3-column | 세로 2-column | 방향 → 그리드 열 수 |
 * | 제품 포스터 | 이미지 지배 1-column | 타이포 지배 2-column | 이미지:텍스트 비율 + 그리드 |
 * | 인포그래픽 | 단일 big-stat | 다중 병렬 반복 유닛 | 구조(슬롯 개수·반복) |
 *
 * `blueprint-distinctness.test.ts`가 이 구별을 기계 검증한다 — 같은 포맷의 두 청사진은
 * 슬롯 개수 또는 `gridColumns`가 반드시 달라야 한다.
 *
 * priority: 기존 선택 동작을 보존하기 위해 A안(10)을 B안(8)보다 높게 둔다.
 */

// ─── 명함 ────────────────────────────────────────────────────────────────────

/** A — 가로 명함. 좌측 accent rail + 3-column 텍스트 스택. 클래식·신뢰 톤. */
const businessCardMinimal: TemplateBlueprint = {
  id: 'business-card-minimal',
  format: 'business-card',
  output: { medium: 'print', printSpecId: 'us-business-card-3.5x2' },
  width: 1050,
  height: 600,
  density: 'airy',
  priority: 10,
  gridColumns: 3,
  slots: [
    {
      id: 'accent',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 32, height: 600 },
      tokenBindings: { fill: 'brand.primary' },
      shape: 'rectangle',
    },
    {
      id: 'name',
      kind: 'text',
      contentKey: 'name',
      required: true,
      bounds: { x: 90, y: 150, width: 580, height: 90 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 40,
    },
    {
      id: 'role',
      kind: 'text',
      contentKey: 'role',
      required: true,
      bounds: { x: 90, y: 250, width: 580, height: 48 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 60,
    },
    {
      id: 'contact',
      kind: 'text',
      contentKey: 'contact',
      required: true,
      bounds: { x: 90, y: 420, width: 580, height: 44 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 100,
    },
    {
      id: 'portrait',
      kind: 'image',
      assetRole: 'portrait',
      required: false,
      bounds: { x: 730, y: 80, width: 240, height: 440 },
      tokenBindings: {},
    },
  ],
}

/**
 * B — 세로 명함. 상단 인물 밴드 + 하단 2-column 텍스트 스택.
 * 방향이 뒤집히면 그리드 열 수(3→2)와 이미지 슬롯의 배치 논리(우측 rail→상단 밴드)가 함께 바뀐다.
 */
const businessCardVertical: TemplateBlueprint = {
  id: 'business-card-vertical',
  format: 'business-card',
  output: { medium: 'print', printSpecId: 'kr-business-card-90x50' },
  width: 600,
  height: 1050,
  density: 'balanced',
  priority: 8,
  gridColumns: 2,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 600, height: 1050 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'portrait',
      kind: 'image',
      assetRole: 'portrait',
      required: false,
      bounds: { x: 48, y: 48, width: 504, height: 396 },
      tokenBindings: {},
    },
    {
      id: 'name',
      kind: 'text',
      contentKey: 'name',
      required: true,
      bounds: { x: 48, y: 520, width: 504, height: 90 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 40,
    },
    {
      id: 'role',
      kind: 'text',
      contentKey: 'role',
      required: true,
      bounds: { x: 48, y: 626, width: 504, height: 48 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 60,
    },
    {
      id: 'contact',
      kind: 'text',
      contentKey: 'contact',
      required: true,
      bounds: { x: 48, y: 940, width: 504, height: 44 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 100,
    },
  ],
}

// ─── 제품 포스터 ─────────────────────────────────────────────────────────────

/** A — 이미지 지배. 제품 사진이 면적을 차지하고 텍스트가 하단에 쌓인다. 1-column. */
const productPosterHero: TemplateBlueprint = {
  id: 'product-poster-hero',
  format: 'product-poster',
  output: { medium: 'screen', reason: '소셜 4:5 비율 — 인쇄 표준 아님(리서치 4.4). 인쇄용은 별도 A계열 청사진.', safeMarginPx: 24 },
  width: 1080,
  height: 1350,
  density: 'balanced',
  priority: 10,
  gridColumns: 1,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1080, height: 1350 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'product-image',
      kind: 'image',
      assetRole: 'product',
      required: true,
      bounds: { x: 120, y: 110, width: 840, height: 690 },
      tokenBindings: {},
    },
    {
      id: 'headline',
      kind: 'text',
      contentKey: 'headline',
      required: true,
      bounds: { x: 120, y: 850, width: 840, height: 150 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 70,
    },
    {
      id: 'product',
      kind: 'text',
      contentKey: 'product',
      required: true,
      bounds: { x: 120, y: 1010, width: 840, height: 60 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 80,
    },
    {
      id: 'cta',
      kind: 'text',
      contentKey: 'cta',
      required: true,
      bounds: { x: 120, y: 1130, width: 360, height: 80 },
      tokenBindings: { color: 'brand.primary' },
      maxChars: 30,
    },
  ],
}

/**
 * B — 타이포 지배(Swiss/editorial). 대형 headline이 상단을 지배하고 규칙선 아래
 * 2-column으로 이미지와 텍스트가 나뉜다. 이미지 면적이 A의 절반 이하로 줄고 슬롯이 하나 늘어난다.
 */
const productPosterEditorial: TemplateBlueprint = {
  id: 'product-poster-editorial',
  format: 'product-poster',
  output: { medium: 'screen', reason: '소셜 4:5 비율 — 인쇄 표준 아님(리서치 4.4). 인쇄용은 별도 A계열 청사진.', safeMarginPx: 24 },
  width: 1080,
  height: 1350,
  density: 'compact',
  priority: 8,
  gridColumns: 2,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1080, height: 1350 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'headline',
      kind: 'text',
      contentKey: 'headline',
      required: true,
      bounds: { x: 80, y: 90, width: 920, height: 280 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 70,
    },
    {
      id: 'rule',
      kind: 'shape',
      required: true,
      bounds: { x: 80, y: 400, width: 920, height: 8 },
      tokenBindings: { fill: 'brand.primary' },
      shape: 'rectangle',
    },
    {
      id: 'product-image',
      kind: 'image',
      assetRole: 'product',
      required: true,
      bounds: { x: 80, y: 450, width: 460, height: 620 },
      tokenBindings: {},
    },
    {
      id: 'product',
      kind: 'text',
      contentKey: 'product',
      required: true,
      bounds: { x: 580, y: 450, width: 420, height: 90 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 80,
    },
    {
      id: 'cta',
      kind: 'text',
      contentKey: 'cta',
      required: true,
      bounds: { x: 580, y: 1180, width: 420, height: 80 },
      tokenBindings: { color: 'brand.primary' },
      maxChars: 30,
    },
  ],
}

/**
 * 인쇄판 — A3(297×420mm) 포스터.
 *
 * **새 아키타입이 아니다.** hero(이미지 지배 1-column)를 인쇄 지면으로 옮긴 것이다.
 * 소셜 4:5(0.800)와 A3(0.707)는 비율이 달라 좌표를 그대로 옮길 수 없고, 안전 여백도
 * 규격 mm에서 나온다 — 그래서 별도 청사진이지 hero의 변형 플래그가 아니다.
 * 소셜 청사진은 그대로 둔다(리서치 4.4 — 4:5는 인쇄 표준이 아니지만 실사용 산출물이다).
 *
 * 논리 px는 A3를 100dpi로 잡은 값이다(297mm→1169px). 인쇄 시 300dpi로 환산된다.
 */
const productPosterPrintA3: TemplateBlueprint = {
  id: 'product-poster-print-a3',
  format: 'product-poster',
  output: { medium: 'print', printSpecId: 'iso-a3' },
  width: 1169,
  height: 1654,
  density: 'balanced',
  priority: 6,
  gridColumns: 1,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1169, height: 1654 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'product-image',
      kind: 'image',
      assetRole: 'product',
      required: true,
      bounds: { x: 130, y: 140, width: 909, height: 830 },
      tokenBindings: {},
    },
    {
      id: 'headline',
      kind: 'text',
      contentKey: 'headline',
      required: true,
      bounds: { x: 130, y: 1030, width: 909, height: 180 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 70,
    },
    {
      id: 'product',
      kind: 'text',
      contentKey: 'product',
      required: true,
      bounds: { x: 130, y: 1230, width: 909, height: 70 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 80,
    },
    {
      id: 'cta',
      kind: 'text',
      contentKey: 'cta',
      required: true,
      bounds: { x: 130, y: 1380, width: 400, height: 90 },
      tokenBindings: { color: 'brand.primary' },
      maxChars: 30,
    },
  ],
}

// ─── 인포그래픽 ──────────────────────────────────────────────────────────────

/** A — 단일 초점. 하나의 수치가 압도적으로 크고 나머지가 그것을 설명한다. */
const infographicStats: TemplateBlueprint = {
  id: 'infographic-stats',
  format: 'infographic',
  output: { medium: 'screen', reason: '인포그래픽 고유 인쇄 규격은 없다(리서치 5.1). 인쇄가 필요하면 A4/A3를 차용한다.', safeMarginPx: 24 },
  width: 1200,
  height: 1600,
  density: 'balanced',
  priority: 10,
  gridColumns: 1,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1200, height: 1600 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'title',
      kind: 'text',
      contentKey: 'title',
      required: true,
      bounds: { x: 100, y: 100, width: 1000, height: 160 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 80,
    },
    {
      id: 'stat',
      kind: 'text',
      contentKey: 'stat',
      required: true,
      bounds: { x: 100, y: 420, width: 1000, height: 300 },
      tokenBindings: { color: 'brand.primary', fontFamily: 'type.display' },
      maxChars: 50,
    },
    {
      id: 'explanation',
      kind: 'text',
      contentKey: 'explanation',
      required: true,
      bounds: { x: 100, y: 800, width: 1000, height: 420 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 360,
    },
    {
      id: 'source',
      kind: 'text',
      contentKey: 'source',
      required: true,
      bounds: { x: 100, y: 1430, width: 1000, height: 60 },
      tokenBindings: { color: 'text.muted' },
      maxChars: 160,
    },
  ],
}

/**
 * B — 다중 병렬. 같은 크기의 유닛 N개를 늘어놓아 항목을 비교한다.
 * 고정 슬롯은 3개뿐이고 본문은 `lists.comparisons` 길이에 따라 늘어난다 —
 * 슬롯 **개수 자체가 데이터에 따라 변하는** 구조라 A와 좌표로 환원되지 않는다.
 */
const infographicComparison: TemplateBlueprint = {
  id: 'infographic-comparison',
  format: 'infographic',
  output: { medium: 'screen', reason: '인포그래픽 고유 인쇄 규격은 없다(리서치 5.1). 인쇄가 필요하면 A4/A3를 차용한다.', safeMarginPx: 24 },
  width: 1200,
  height: 1600,
  density: 'compact',
  priority: 8,
  gridColumns: 3,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 1200, height: 1600 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'title',
      kind: 'text',
      contentKey: 'title',
      required: true,
      bounds: { x: 100, y: 100, width: 1000, height: 140 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 80,
    },
    {
      id: 'source',
      kind: 'text',
      contentKey: 'source',
      required: true,
      bounds: { x: 100, y: 1450, width: 1000, height: 60 },
      tokenBindings: { color: 'text.muted' },
      maxChars: 160,
    },
  ],
  repeatGroups: [
    {
      id: 'units',
      listKey: 'comparisons',
      bounds: { x: 100, y: 340, width: 1000, height: 1000 },
      axis: 'vertical',
      gap: 40,
      minUnits: 2,
      maxUnits: 4,
      unitSlots: [
        {
          id: 'label',
          kind: 'text',
          contentKey: 'label',
          required: true,
          bounds: { x: 0, y: 0, width: 1000, height: 80 },
          tokenBindings: { color: 'text.primary' },
          maxChars: 40,
        },
        {
          id: 'value',
          kind: 'text',
          contentKey: 'value',
          required: true,
          bounds: { x: 0, y: 90, width: 1000, height: 140 },
          tokenBindings: { color: 'brand.primary', fontFamily: 'type.display' },
          maxChars: 20,
        },
      ],
    },
  ],
}

/**
 * 인쇄판 — A4(210×297mm) 인포그래픽.
 *
 * 인포그래픽에는 **고유 인쇄 규격이 없다**(리서치 5.1). 그래서 A계열을 차용한다 —
 * 배포용 유인물은 A4, 게시용은 A3다. 그 관계를 산문 주석이 아니라 `printSpecId`로 못박는다.
 * 단일 초점(stats) 아키타입의 인쇄판이며, 화면용 두 청사진은 그대로 둔다.
 */
const infographicPrintA4: TemplateBlueprint = {
  id: 'infographic-print-a4',
  format: 'infographic',
  output: { medium: 'print', printSpecId: 'iso-a4' },
  width: 827,
  height: 1169,
  density: 'balanced',
  priority: 6,
  gridColumns: 1,
  slots: [
    {
      id: 'backdrop',
      kind: 'shape',
      required: true,
      bounds: { x: 0, y: 0, width: 827, height: 1169 },
      tokenBindings: { fill: 'surface.canvas' },
      shape: 'rectangle',
    },
    {
      id: 'title',
      kind: 'text',
      contentKey: 'title',
      required: true,
      bounds: { x: 70, y: 70, width: 687, height: 115 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
      maxChars: 80,
    },
    {
      id: 'stat',
      kind: 'text',
      contentKey: 'stat',
      required: true,
      bounds: { x: 70, y: 300, width: 687, height: 215 },
      tokenBindings: { color: 'brand.primary', fontFamily: 'type.display' },
      maxChars: 50,
    },
    {
      id: 'explanation',
      kind: 'text',
      contentKey: 'explanation',
      required: true,
      bounds: { x: 70, y: 570, width: 687, height: 305 },
      tokenBindings: { color: 'text.secondary' },
      maxChars: 360,
    },
    {
      id: 'source',
      kind: 'text',
      contentKey: 'source',
      required: true,
      bounds: { x: 70, y: 1045, width: 687, height: 45 },
      tokenBindings: { color: 'text.muted' },
      maxChars: 160,
    },
  ],
}

/** 기준 청사진(포맷당 A안). 서명 기준선과 기본 선택이 여기서 나온다. */
export const blueprintRegistry: TemplateBlueprint[] = [
  businessCardMinimal,
  productPosterHero,
  infographicStats,
]

/**
 * 전체 카탈로그 — 8개. 파생 생성기 없이 전부 명시 선언.
 *
 * 매체별 구성: 명함은 둘 다 인쇄, 포스터·인포그래픽은 화면 2 + 인쇄 1이다.
 * 화면용 소셜 비율 청사진을 인쇄로 개조하지 않고 인쇄판을 따로 둔 이유는
 * 4:5와 A계열의 비율이 달라 같은 판을 두 매체가 공유할 수 없기 때문이다.
 */
export const formatPackCatalog: TemplateBlueprint[] = [
  businessCardMinimal,
  businessCardVertical,
  productPosterHero,
  productPosterEditorial,
  productPosterPrintA3,
  infographicStats,
  infographicComparison,
  infographicPrintA4,
]
