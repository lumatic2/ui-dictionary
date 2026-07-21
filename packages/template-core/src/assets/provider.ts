import type { AssetManifestEntry } from '../types.js'

export interface ImageAssetRequest {
  id: string
  role: string
  prompt: string
  width: number
  height: number
  fallbackUri: string
}

export interface ImageAssetProvider {
  readonly id: string
  provide(request: ImageAssetRequest): Promise<AssetManifestEntry>
}

/** 외부 호출 없이 고정 소재를 돌려주는 기본 공급자. 결정론적 검증 경로의 기준선이다. */
export class LocalFallbackProvider implements ImageAssetProvider {
  readonly id = 'local-fallback'

  async provide(request: ImageAssetRequest): Promise<AssetManifestEntry> {
    return {
      id: request.id,
      role: request.role,
      uri: request.fallbackUri,
      mimeType: 'image/svg+xml',
      width: request.width,
      height: request.height,
      provenance: { provider: 'local', source: `fallback:${request.prompt}` },
    }
  }
}
