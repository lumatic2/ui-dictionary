# 은퇴 — 이 패키지는 TH5 step-3에서 제거된다

- 은퇴 표기: 2026-07-20 (TH5 step-1)
- 대체: `packages/template-image-provider-codex`

## 왜

이 어댑터의 응답 타입은 OpenAI 실제 응답 구조와 다르다. 실제 응답은 `{data:[{b64_json}]}` 배열이고, 여기 선언된 `mimeType`·`width`·`height`·`requestId` 필드는 **실재하지 않는다.** 라이브 호출 시 100% 실패한다.

리서치: `research/2026-07-20-template-production-hardening-openai-image-api-contract.md`

사용자 확정(2026-07-20): API 키를 쓰지 않고 **Codex 내장 image_gen**을 유일 생성 경로로 삼는다.

## 지금 지우지 않는 이유

step-2(라이브 실호출 실증)가 새 공급자를 증명하기 전에 지우면 되돌릴 곳이 없다. 제거는 step-3에서 별도 커밋으로 한다.
