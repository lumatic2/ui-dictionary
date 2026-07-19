import { describe, expect, it } from 'vitest'
import type { ImageAssetRequest } from '@askewly/template-core'
import { buildImagePrompt, CodexImageError, CodexImageProvider } from './index.js'
import { coverCropLoss, fitsSlot, MAX_COVER_CROP_LOSS } from './fit.js'
import { PngReadError, readPngHeader } from './png.js'

const request: ImageAssetRequest = {
  id: 'hero',
  role: 'product',
  prompt: '손으로 빚은 도자기 컵',
  width: 1000,
  height: 800,
  fallbackUri: './cup.svg',
}

/** 실제 PNG 헤더를 조립한다 — 라이브러리 없이 바이트를 직접 만든다. */
function pngBytes(width: number, height: number): Buffer {
  const bytes = Buffer.alloc(24)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0)
  bytes.write('IHDR', 12, 'ascii')
  bytes.writeUInt32BE(width, 16)
  bytes.writeUInt32BE(height, 20)
  return bytes
}

function provider(bytes: Buffer | Error, outputPath = 'tmp/generated.png') {
  return new CodexImageProvider({
    outputPathFor: () => outputPath,
    runner: async () => {},
    readFileBytes: async () => {
      if (bytes instanceof Error) throw bytes
      return bytes
    },
  })
}

describe('PNG 헤더 판독', () => {
  it('폭·높이를 파일에서 읽는다', () => {
    expect(readPngHeader(pngBytes(1254, 1254))).toEqual({ width: 1254, height: 1254 })
  })

  it('PNG가 아니면 거부한다', () => {
    expect(() => readPngHeader(Buffer.alloc(24))).toThrowError(PngReadError)
  })

  it('IHDR이 아닌 첫 청크를 거부한다', () => {
    const bytes = pngBytes(10, 10)
    bytes.write('IDAT', 12, 'ascii')
    expect(() => readPngHeader(bytes)).toThrowError(/IHDR/)
  })

  it('잘린 헤더를 거부한다', () => {
    expect(() => readPngHeader(pngBytes(10, 10).subarray(0, 20))).toThrowError(/짧/)
  })
})

describe('cover 잘림 판정', () => {
  it('종횡비가 같으면 잘림이 0이다', () => {
    expect(coverCropLoss({ width: 2000, height: 1600 }, { width: 1000, height: 800 })).toBe(0)
  })

  it('정사각 생성물을 4:5 슬롯에 넣으면 잘림이 생긴다', () => {
    // 1254×1254 → 1080×1350 슬롯: 짧은 축(폭) 기준으로 확대하므로 높이 방향이 잘린다.
    const loss = coverCropLoss({ width: 1254, height: 1254 }, { width: 1080, height: 1350 })
    expect(loss).toBeCloseTo(1 - 1080 / 1350, 5)
    expect(loss).toBeLessThan(MAX_COVER_CROP_LOSS)
  })

  it('한도를 넘는 조합을 거부한다', () => {
    // 극단적 가로 파노라마를 세로 슬롯에 넣으면 대부분이 사라진다.
    expect(fitsSlot({ width: 3000, height: 600 }, { width: 600, height: 900 })).toBe(false)
  })

  it('0 이하 치수는 계산하지 않는다', () => {
    expect(() => coverCropLoss({ width: 0, height: 10 }, { width: 1, height: 1 })).toThrowError(RangeError)
  })
})

describe('지시문', () => {
  it('출력 경로와 종횡비를 못박는다', () => {
    const prompt = buildImagePrompt(request, 'tmp/out.png')
    expect(prompt).toContain('tmp/out.png')
    expect(prompt).toContain('1000:800')
    expect(prompt).toContain(request.prompt)
  })
})

describe('공급자 계약 — 고정 응답', () => {
  it('실제 치수를 기록한다 (요청 치수가 아니라)', async () => {
    const asset = await provider(pngBytes(1254, 1003)).provide(request)
    expect(asset.width).toBe(1254)
    expect(asset.height).toBe(1003)
    expect(asset.mimeType).toBe('image/png')
    expect(asset.provenance).toEqual({ provider: 'generated', source: 'codex:image_generation:hero' })
  })

  it('출력 경로를 URI로 쓴다', async () => {
    const asset = await provider(pngBytes(1000, 800), 'fixtures/cup.png').provide(request)
    expect(asset.uri).toBe('fixtures/cup.png')
  })

  it('파일이 없으면 빈 소재를 만들지 않고 실패한다', async () => {
    await expect(provider(new Error('ENOENT')).provide(request)).rejects.toThrowError(
      expect.objectContaining({ code: 'IMAGE_NOT_READABLE' }),
    )
  })

  it('이미지가 아닌 파일을 거부한다', async () => {
    await expect(provider(Buffer.alloc(64)).provide(request)).rejects.toThrowError(
      expect.objectContaining({ code: 'NOT_A_PNG' }),
    )
  })

  it('잘림이 한도를 넘으면 거부한다', async () => {
    await expect(provider(pngBytes(3000, 600)).provide(request)).rejects.toThrowError(
      expect.objectContaining({ code: 'CROP_LOSS_TOO_LARGE' }),
    )
  })

  it('실행기가 실패하면 그 실패가 전파된다', async () => {
    const failing = new CodexImageProvider({
      outputPathFor: () => 'tmp/x.png',
      runner: async () => {
        throw new CodexImageError('CODEX_RUN_FAILED', 'codex exec가 1로 끝났습니다')
      },
      readFileBytes: async () => pngBytes(1000, 800),
    })
    await expect(failing.provide(request)).rejects.toThrowError(
      expect.objectContaining({ code: 'CODEX_RUN_FAILED' }),
    )
  })
})
