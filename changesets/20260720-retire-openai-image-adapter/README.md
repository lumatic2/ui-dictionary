# changeset: 깨진 OpenAI 이미지 어댑터 제거

- Date: 2026-07-20
- Plan: TH5 step 3 (`plans/2026-07-20-th5-codex-imagegen-provider.md`)

`packages/template-image-provider-openai`를 지웠다.

## 왜 지웠나

이 어댑터의 응답 타입은 OpenAI 실제 응답 구조와 다르다. 실제는 `{data:[{b64_json}]}` 배열이고 여기 선언된 `mimeType`·`width`·`height`·`requestId` 필드는 **실재하지 않는다.** 라이브에서 100% 실패한다. (리서치: `research/2026-07-20-template-production-hardening-openai-image-api-contract.md`)

step-2가 대체 경로를 실호출로 증명했으므로 이제 지운다. 복구 경로는 git 히스토리다.

## Verification

- [x] 코드·설정 참조 grep **0건** (남은 언급은 changeset·plan·research 등 record 문서뿐 — 기록은 정정하지 않는다)
- [x] 전체 테스트 **439 PASS**
  - template-core 155 · canvas-core 56 · **template-image-provider-codex 15** · agent-design 90 · bridge 46 · desktop 56 · mcp 21
- [x] `npm run verify` — 4단계 exit 0
- [x] `node scripts/verify-template-production-system.mjs` — exit 0

### Failure probe

제거 전 참조를 먼저 grep해 **어떤 코드도 import하지 않음**을 확인했다(패키지 자기 참조와 신규 공급자 주석의 언급만). 제거 후 7개 패키지 전부 빌드·테스트가 통과하므로 이관 누락이 없다.
