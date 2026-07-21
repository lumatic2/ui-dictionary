/**
 * PNG 헤더 판독 — 의존성 없이 파일이 정말 PNG인지, 실제 치수가 얼마인지 확인한다.
 *
 * 공급자가 "요청한 치수"를 그대로 믿으면 안 되는 이유: Codex imagegen은 정확 치수를
 * 보장하지 않는다(2026-07-20 실측 — 정사각 요청에 1254×1254 반환, 16의 배수도 아니다).
 * 그래서 **파일이 말하는 치수**를 정본으로 삼는다.
 *
 * 규격: PNG는 8바이트 시그니처 뒤 첫 청크가 반드시 IHDR이고, 폭·높이가 각각
 * 빅엔디언 4바이트로 온다. 출처: PNG Specification (W3C) 5.2 PNG signature / 11.2.2 IHDR
 * https://www.w3.org/TR/png/ (접근 2026-07-20)
 */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

export class PngReadError extends Error {
  constructor(readonly code: 'NOT_A_PNG' | 'TRUNCATED_HEADER', message: string) {
    super(message)
    this.name = 'PngReadError'
  }
}

export interface PngHeader {
  width: number
  height: number
}

export function readPngHeader(bytes: Buffer): PngHeader {
  // IHDR 데이터는 시그니처(8) + 길이(4) + 타입(4) 뒤에 오고, 폭·높이로 8바이트를 쓴다.
  if (bytes.length < 24) {
    throw new PngReadError('TRUNCATED_HEADER', `PNG 헤더를 읽기엔 너무 짧습니다(${bytes.length}바이트).`)
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new PngReadError('NOT_A_PNG', 'PNG 시그니처가 아닙니다 — 생성물이 이미지가 아닙니다.')
  }
  if (bytes.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new PngReadError('NOT_A_PNG', '첫 청크가 IHDR이 아닙니다 — 손상된 PNG입니다.')
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}
