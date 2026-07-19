/**
 * 텍스트 맞춤 — 글자가 상자를 넘치지 않게 크기와 줄 나눔을 정한다.
 *
 * 왜 필요한가: 컴파일러가 `fontSize = 슬롯높이 × 0.45`로 크기를 정했다. 슬롯 **높이**만 보고
 * 글자 수와 폭을 보지 않아, 긴 문장이 캔버스 밖으로 잘렸다(TH7이 산출물 실물에서 적발 —
 * editorial headline 필요폭 1216 > 슬롯폭 920, stats explanation 4404 > 1000).
 *
 * 한계를 먼저 밝힌다: 여기 폭 계산은 **근사**다. 실제 폰트 파일의 메트릭을 읽지 않고
 * 문자 종류별 평균 전진폭으로 추정한다. 그래서 브라우저 실측과 대조해 오차를 측정하고
 * 기록한다(`text-fitting.test.ts`, evidence). 근사를 정확한 척하지 않는다.
 */

/** 글자 크기 1에 대한 문자별 전진폭 비율. 값의 출처는 브라우저 실측 대조(evidence 참조). */
const ADVANCE_RATIO = {
  /** 한글 음절 — 전각. */
  hangul: 1.0,
  /** CJK 한자·가나 — 전각. */
  cjk: 1.0,
  /** 라틴 대문자·숫자. */
  wide: 0.62,
  /** 라틴 소문자 평균. */
  narrow: 0.58,
  /** i·l·j·f·t 등 좁은 글자. */
  thin: 0.34,
  /** 공백. */
  space: 0.27,
  /** 문장부호. */
  punctuation: 0.42,
} as const

const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/
const CJK = /[぀-ヿ一-鿿]/
const THIN = /[iljft.,:;'`|!()[\]{}]/
const WIDE = /[A-Z0-9@#%&W M]/
const PUNCTUATION = /[-–—·/\\"?+=<>*^~$]/

/** 문자 하나의 전진폭 비율. */
export function advanceRatio(char: string): number {
  if (char === ' ' || char === ' ') return ADVANCE_RATIO.space
  if (HANGUL.test(char)) return ADVANCE_RATIO.hangul
  if (CJK.test(char)) return ADVANCE_RATIO.cjk
  if (THIN.test(char)) return ADVANCE_RATIO.thin
  if (PUNCTUATION.test(char)) return ADVANCE_RATIO.punctuation
  if (WIDE.test(char)) return ADVANCE_RATIO.wide
  return ADVANCE_RATIO.narrow
}

/** 문자열이 차지할 폭(px) 추정. */
export function estimateWidth(text: string, fontSize: number): number {
  let ratio = 0
  for (const char of text) ratio += advanceRatio(char)
  return ratio * fontSize
}

/**
 * 줄 나눔 — 어절(공백) 단위로 끊는다. 한 어절이 한 줄보다 길면 글자 단위로 쪼갠다.
 *
 * 한글 금칙어 처리(조사·괄호 분리 금지 등)는 범위 밖이다.
 */
export function wrapLines(text: string, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (!words.length) return ['']

  const lines: string[] = []
  let current = ''

  const pushChunked = (word: string) => {
    let chunk = ''
    for (const char of word) {
      if (chunk && estimateWidth(chunk + char, fontSize) > maxWidth) {
        lines.push(chunk)
        chunk = char
      } else {
        chunk += char
      }
    }
    current = chunk
  }

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (estimateWidth(candidate, fontSize) <= maxWidth) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    if (estimateWidth(word, fontSize) > maxWidth) pushChunked(word)
    else current = word
  }

  if (current) lines.push(current)
  return lines
}

export interface FitBox {
  width: number
  height: number
}

export interface FitOptions {
  /** 허용 줄 수. 미지정이면 상자 높이가 허용하는 만큼. */
  maxLines?: number
  minFontSize?: number
  maxFontSize?: number
  /** 행간 배수. */
  lineHeightRatio?: number
}

export interface FitResult {
  fontSize: number
  lineHeight: number
  lines: string[]
  /** 추정한 가장 긴 줄의 폭. */
  widestLine: number
}

export const DEFAULT_MIN_FONT_SIZE = 14
export const DEFAULT_LINE_HEIGHT_RATIO = 1.3

export class TextFitError extends Error {
  constructor(
    readonly code: 'TEXT_DOES_NOT_FIT',
    message: string,
  ) {
    super(message)
    this.name = 'TextFitError'
  }
}

/**
 * 상자에 들어가는 가장 큰 글자 크기를 찾는다.
 *
 * 최소 크기에서도 안 들어가면 **던진다**. 잘린 채 내보내지 않는다 —
 * 잘린 산출물이 조용히 나가는 게 이 milestone이 고치는 결함이다.
 */
export function fitText(text: string, box: FitBox, options: FitOptions = {}): FitResult {
  const minFontSize = options.minFontSize ?? DEFAULT_MIN_FONT_SIZE
  const lineHeightRatio = options.lineHeightRatio ?? DEFAULT_LINE_HEIGHT_RATIO
  const maxFontSize = options.maxFontSize ?? Math.floor(box.height)

  for (let size = maxFontSize; size >= minFontSize; size -= 1) {
    const lineHeight = Math.round(size * lineHeightRatio)
    const allowedLines = options.maxLines ?? Math.max(1, Math.floor(box.height / lineHeight))
    const lines = wrapLines(text, size, box.width)

    if (lines.length > allowedLines) continue
    if (lines.length * lineHeight > box.height) continue

    const widestLine = Math.max(...lines.map((line) => estimateWidth(line, size)))
    if (widestLine > box.width) continue

    return { fontSize: size, lineHeight, lines, widestLine }
  }

  throw new TextFitError(
    'TEXT_DOES_NOT_FIT',
    `'${text.slice(0, 24)}…'가 ${box.width}×${box.height} 상자에 최소 ${minFontSize}px로도 들어가지 않습니다.`,
  )
}

export interface OverflowReport {
  /** 가장 긴 줄이 상자 폭을 넘은 양(px). */
  width: number
  /** 줄들이 상자 높이를 넘은 양(px). */
  height: number
  lines: number
}

/**
 * 이미 정해진 크기로 넘치는지 검사한다 — 게이트용.
 *
 * **폭과 높이를 둘 다 본다.** 줄바꿈만 보면 긴 문장이 여러 줄로 접히며 폭 넘침은
 * 사라지지만 상자 높이를 넘어 잘린다 — 그게 TH7이 산출물에서 본 실제 모습이다.
 */
export function measureOverflow(
  text: string,
  fontSize: number,
  box: FitBox,
  lineHeightRatio = DEFAULT_LINE_HEIGHT_RATIO,
): OverflowReport {
  const lines = wrapLines(text, fontSize, box.width)
  const widest = Math.max(...lines.map((line) => estimateWidth(line, fontSize)))
  const lineHeight = Math.round(fontSize * lineHeightRatio)
  return {
    width: Math.max(0, widest - box.width),
    height: Math.max(0, lines.length * lineHeight - box.height),
    lines: lines.length,
  }
}

/** 넘친 총량(px). 0이면 들어간다. */
export function overflowAmount(
  text: string,
  fontSize: number,
  box: FitBox,
  lineHeightRatio = DEFAULT_LINE_HEIGHT_RATIO,
): number {
  const report = measureOverflow(text, fontSize, box, lineHeightRatio)
  return report.width + report.height
}
