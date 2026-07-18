# changeset: 오프라인 이미지 공급자 경계

- Status: complete

## Target

- TPS5 step-1 — `offline-image-provider-boundary`

## Scope

- `packages/template-core/src/assets/provider.ts`: 공급자 중립 interface, 로컬 fallback, asset provenance 계약
- `packages/template-image-provider-openai/`: GPT Image 2 요청 직렬화와 frozen response 변환
- `packages/template-core/src/index.ts`: provider 계약 공개

## Contract

- CanvasDocument와 템플릿 구조는 provider가 아니라 `template-core`가 소유한다.
- OpenAI adapter는 네트워크 호출·키·비용 없이 request/response 경계만 검증한다.
- 빈 출력, 잘못된 MIME, 잘못된 크기는 명시 오류로 거부하고 로컬 fallback을 유지한다.
- 라이브 API 연결·재시도·원격 저장은 범위 밖이다.

## Verification

- [x] provider adapter tests 5개 PASS
- [x] provider package build PASS
- [x] invalid empty/MIME/size 실패경로 PASS
- [x] generated asset provenance snapshot PASS

## Result

provider-neutral interface와 GPT Image 2 request/frozen response adapter, provenance 및 mime/size/empty 실패 코드를 추가했다. 네트워크 호출과 키는 없다.
