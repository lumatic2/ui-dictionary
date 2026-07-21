# TPS5 생성 소재 경계·통합 실연

- `ImageAssetProvider`와 local fallback은 template-core 소유.
- GPT Image 2 adapter는 request 직렬화와 frozen response 변환만 수행하며 네트워크·키·비용 0.
- empty/mime/size 오류 3종을 명시 거부; generated asset provenance 보존.
- provider 5 tests + build PASS.
- `node scripts/verify-template-production-system.mjs`: 명함·제품 포스터·인포그래픽 3/3 compile/validate/signature/export 계약 PASS.
- manifest: `e2e-manifest.json`; 모든 행 `network: false`.
