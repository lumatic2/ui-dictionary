import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import type { AssetManifestEntry, ImageAssetProvider, ImageAssetRequest } from '@askewly/template-core'
import { fitsSlot, coverCropLoss, MAX_COVER_CROP_LOSS } from './fit.js'
import { readPngHeader } from './png.js'

/**
 * Codex imagegen 소재 공급자 — `codex exec`의 내장 `image_gen`으로 이미지를 얻는다.
 *
 * **API 키를 쓰지 않는다.** Codex 자체 인증을 타므로 `.env`·시크릿 항목이 생기지 않는다
 * (사용자 확정 2026-07-20). 구 `template-image-provider-openai`는 응답 타입이 실제
 * OpenAI 응답 구조와 달라 라이브에서 100% 실패했고, TH5 step-3에서 제거한다.
 *
 * 이 공급자의 계약은 셋이다.
 * 1. 생성물이 **정말 PNG인지** 파일 헤더로 확인한다 — 요청한 치수를 믿지 않는다.
 * 2. **실제 치수**를 기록한다 — Codex는 정확 치수를 보장하지 않는다(정사각 요청에 1254×1254).
 * 3. 슬롯에 cover로 넣을 때 **잘림이 한도를 넘으면 거부**한다 — 조용히 잘린 소재를 넘기지 않는다.
 */

export type CodexImageErrorCode =
  | 'CODEX_RUN_FAILED'
  | 'IMAGE_NOT_READABLE'
  | 'NOT_A_PNG'
  | 'CROP_LOSS_TOO_LARGE'

export class CodexImageError extends Error {
  constructor(
    readonly code: CodexImageErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'CodexImageError'
  }
}

/** `codex exec`에 넘길 지시문. 출력 경로를 못박아 생성물의 위치를 결정론적으로 만든다. */
export function buildImagePrompt(request: ImageAssetRequest, outputPath: string): string {
  return [
    `Generate one image and save it to ${outputPath} in PNG format.`,
    `Subject: ${request.prompt}`,
    `Target aspect ratio: ${request.width}:${request.height}.`,
    'Do not write any other file. Do not explain. Produce the image only.',
  ].join('\n')
}

/**
 * 생성 실행기. 기본 구현은 `codex exec` 서브프로세스이고, 테스트는 이 자리에 고정 응답을 넣는다.
 *
 * 계약 검증이 라이브 호출에 의존하면 재현이 불가능해진다 — 비결정적 생성물을 E2E에서
 * 분리하라는 horizon 프리모템 4번 항목의 예방 장치다.
 */
export type CodexRunner = (prompt: string, outputPath: string) => Promise<void>

export const spawnCodexRunner: CodexRunner = (prompt, outputPath) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      'codex',
      ['exec', '--skip-git-repo-check', '--sandbox', 'workspace-write', prompt],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let stderr = ''
    child.stderr.on('data', (chunk) => (stderr += String(chunk)))
    child.on('error', (error) =>
      reject(new CodexImageError('CODEX_RUN_FAILED', `codex 실행 실패: ${error.message}`)),
    )
    child.on('close', (code) => {
      if (code === 0) return resolve()
      reject(
        new CodexImageError(
          'CODEX_RUN_FAILED',
          `codex exec가 ${code}로 끝났습니다 (${outputPath}). ${stderr.trim().slice(0, 400)}`,
        ),
      )
    })
  })

export interface CodexImageProviderOptions {
  /** 생성물이 저장될 경로를 요청마다 정한다. 호출자가 fixture 경로를 소유한다. */
  outputPathFor: (request: ImageAssetRequest) => string
  /** 소재 매니페스트에 기록할 URI. 미지정이면 출력 경로를 그대로 쓴다. */
  uriFor?: (request: ImageAssetRequest, outputPath: string) => string
  runner?: CodexRunner
  readFileBytes?: (path: string) => Promise<Buffer>
}

export class CodexImageProvider implements ImageAssetProvider {
  readonly id = 'codex-imagegen'

  constructor(private readonly options: CodexImageProviderOptions) {}

  async provide(request: ImageAssetRequest): Promise<AssetManifestEntry> {
    const outputPath = this.options.outputPathFor(request)
    const runner = this.options.runner ?? spawnCodexRunner
    const readBytes = this.options.readFileBytes ?? ((path: string) => readFile(path))

    await runner(buildImagePrompt(request, outputPath), outputPath)

    let bytes: Buffer
    try {
      bytes = await readBytes(outputPath)
    } catch (error) {
      // 생성이 성공했다고 보고했는데 파일이 없는 경우 — 조용히 빈 소재를 만들지 않는다.
      throw new CodexImageError(
        'IMAGE_NOT_READABLE',
        `생성물을 읽을 수 없습니다: ${outputPath} (${(error as Error).message})`,
      )
    }

    let header: { width: number; height: number }
    try {
      header = readPngHeader(bytes)
    } catch (error) {
      throw new CodexImageError('NOT_A_PNG', `${outputPath}: ${(error as Error).message}`)
    }

    const slot = { width: request.width, height: request.height }
    if (!fitsSlot(header, slot)) {
      const loss = Math.round(coverCropLoss(header, slot) * 100)
      throw new CodexImageError(
        'CROP_LOSS_TOO_LARGE',
        `생성물 ${header.width}×${header.height}을 슬롯 ${slot.width}×${slot.height}에 넣으면 ` +
          `${loss}%가 잘립니다(한도 ${Math.round(MAX_COVER_CROP_LOSS * 100)}%).`,
      )
    }

    return {
      id: request.id,
      role: request.role,
      uri: this.options.uriFor?.(request, outputPath) ?? outputPath,
      mimeType: 'image/png',
      // 요청 치수가 아니라 **파일이 말하는 치수**를 기록한다.
      width: header.width,
      height: header.height,
      provenance: { provider: 'generated', source: `codex:image_generation:${request.id}` },
    }
  }
}

export { coverCropLoss, fitsSlot, MAX_COVER_CROP_LOSS } from './fit.js'
export { readPngHeader, PngReadError } from './png.js'
