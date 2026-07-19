# OpenAI Image Generation API 계약 조사 (2026-07-20)

> 목적: `packages/template-image-provider-openai/src/index.ts` 어댑터를 실제 라이브 호출 전에 교정하기 위한 사실 확인. 접근일 전부 2026-07-20.
> 방법: WebFetch(공식 문서) + WebSearch + context7(라이브러리 ID만 확인, 실사용 안 함). WebFetch는 콘텐츠를 소형 모델이 요약해 반환하므로, 동일 URL을 2회 이상 재조회해 수치가 일치하는지 교차검증했다. 아래 각 항목에 신뢰도를 표시한다.

## 0. 핵심 발견 — 모델 계보

현재 시점(2026-07-20) OpenAI 이미지 생성 모델 계보는 다음과 같이 확인된다.

- `gpt-image-1` — 최초 GPT 이미지 모델. 모델 페이지에서 "Deprecated"로 표기됨.
  출처: https://developers.openai.com/api/docs/models/gpt-image-1 (접근 2026-07-20)
- `gpt-image-1-mini`, `gpt-image-1.5` — 후속/경량 라인.
  출처: https://developers.openai.com/api/reference/resources/images/methods/generate (접근 2026-07-20)
- `gpt-image-2` (스냅샷 `gpt-image-2-2026-04-21`) — 2026-04-21 발표된 최신 모델. "Introducing gpt-image-2" 커뮤니티 공지 및 전용 모델 페이지 존재.
  출처: https://community.openai.com/t/introducing-gpt-image-2-available-today-in-the-api-and-codex/1379479 (접근 2026-07-20), https://developers.openai.com/api/docs/models/gpt-image-2 (접근 2026-07-20)

**중요한 불일치**: `/v1/images/generations`(Create Image) API 레퍼런스 페이지를 두 번 조회했는데, `model` 파라미터 enum에 `gpt-image-2`가 나타나지 않고 `gpt-image-1`, `gpt-image-1-mini`, `gpt-image-1.5`, `dall-e-2`, `dall-e-3`만 나열됐다. 반면 이미지 생성 가이드 페이지와 gpt-image-2 전용 모델 페이지는 gpt-image-2가 `/v1/images/generations` 및 Responses API `image_generation` tool 양쪽에서 쓰인다고 서술한다. 이 문서 간 불일치의 원인(레퍼런스 페이지 캐시 지연 vs 실제 미지원)은 확정하지 못했다 — 아래 "확정 못 한 것" 참조. **라이브 호출 전 실제 `model: "gpt-image-2"` 요청이 `/v1/images/generations`에서 수락되는지 실측 확인이 필요하다.**

---

## 1. 모델 식별자

| 모델 ID | 상태 |
|---|---|
| `dall-e-2` | 레거시 |
| `dall-e-3` | 레거시 |
| `gpt-image-1` | Deprecated (모델 페이지 명시) |
| `gpt-image-1-mini` | 활성 |
| `gpt-image-1.5` | 활성 |
| `gpt-image-2` (스냅샷 `gpt-image-2-2026-04-21`) | 최신, 2026-04-21 출시 |

`gpt-image-2`는 존재하는 모델 ID다 (어댑터 코드의 `'gpt-image-2'` 문자열 자체는 맞다). 다만 위 "핵심 발견"에서 언급한 대로, `/v1/images/generations` 공식 API 레퍼런스 enum에는 아직 노출되지 않아 실제 호출 가능 여부는 미확인.

출처: https://developers.openai.com/api/docs/models/gpt-image-1, https://developers.openai.com/api/docs/models/gpt-image-2, https://developers.openai.com/api/reference/resources/images/methods/generate, https://community.openai.com/t/introducing-gpt-image-2-available-today-in-the-api-and-codex/1379479 (모두 접근 2026-07-20)

## 2. `size` 파라미터

**자유형 WxH가 아니라 모델별 제약이 있는 값이다.** 어댑터가 `${width}x${height}`를 임의로 조합하는 현재 방식은 위험하다.

- **`gpt-image-1` / `gpt-image-1-mini` / `gpt-image-1.5`**: 열거형 3종 — `1024x1024`, `1536x1024`, `1024x1536`, 그리고 `auto`.
- **`gpt-image-2`**: 임의 WxH 문자열을 허용하지만 다음 제약이 있다 (레퍼런스/가이드 두 소스에서 동일 수치로 교차 확인됨):
  - 긴 변 ≤ 3840px
  - 가로·세로 모두 16px의 배수
  - 긴 변:짧은 변 비율 ≤ 3:1 (레퍼런스 페이지는 "1:3~3:1"로 표현, 동일 제약)
  - 전체 픽셀 수 655,360 ~ 8,294,400 사이
  - 예시 값: `1024x1024`, `1536x1024`, `1024x1536`, `2048x2048`, `3840x2160`
- **`dall-e-2`**: `256x256`, `512x512`, `1024x1024`
- **`dall-e-3`**: `1024x1024`, `1792x1024`, `1024x1792`

출처: https://developers.openai.com/api/docs/guides/image-generation, https://developers.openai.com/api/reference/resources/images/methods/generate (둘 다 접근 2026-07-20, 2회 교차조회로 수치 일치 확인)

## 3. 기타 요청 파라미터

| 파라미터 | 값/타입 | 필수 여부 | 모델 적용 범위 |
|---|---|---|---|
| `prompt` | string (GPT 계열 최대 32,000자, dall-e-2 1,000자, dall-e-3 4,000자) | 필수 | 전체 |
| `model` | 위 §1 목록 | 선택 (기본값 `dall-e-2`) | 전체 |
| `n` | 1–10 (dall-e-3는 n=1 고정) | 선택 | 전체 |
| `quality` | GPT계열: `low`/`medium`/`high`/`auto`(기본); dall-e-3: `standard`/`hd` | 선택 | 모델별 값 다름 |
| `response_format` | `url` \| `b64_json` | 선택 | **dall-e-2, dall-e-3 전용** — GPT 이미지 모델(`gpt-image-1`/`.../gpt-image-2`)에는 이 파라미터가 적용되지 않는다 |
| `output_format` | `png`(기본) \| `jpeg` \| `webp` | 선택 | **GPT 이미지 모델 전용** |
| `output_compression` | 0–100(%) | 선택 | GPT 모델의 jpeg/webp 출력에만 |
| `background` | `transparent` \| `opaque` \| `auto`(기본) | 선택 | GPT 모델 전용. **`gpt-image-2`는 `transparent`를 지원하지 않는다**(명시적 미지원 문구 확인) |
| `moderation` | `low` \| `auto`(기본) | 선택 | GPT 모델 전용 |
| `style` | `vivid` \| `natural` | 선택 | dall-e-3 전용 |
| `stream` | boolean | 선택 | GPT 모델 전용(스트리밍) |
| `partial_images` | 0–3 | 선택 | 스트리밍 시(GPT 모델) |
| `user` | string | 선택 | 전체 |

**출력 형식 관련 핵심 정정**: 어댑터가 쓰는 `output_format: 'png'` 필드명 자체는 맞으나, GPT 이미지 모델에는 `response_format`이 없고 `b64_json`이 기본 응답 형식이다(즉 `response_format: 'b64_json'`을 보낼 필요도, 보낼 수도 없다 — dall-e 계열에만 있는 파라미터). 어댑터가 `response_format`을 아예 보내지 않는 점은 결과적으로 맞다.

출처: https://developers.openai.com/api/reference/resources/images/methods/generate, https://developers.openai.com/api/docs/guides/image-generation (접근 2026-07-20)

## 4. 응답(response) 스키마

공식 레퍼런스 요약 기준 정확한 필드명:

```json
{
  "created": 1690000000,
  "background": "opaque",
  "data": [
    {
      "b64_json": "...",
      "url": "...",
      "revised_prompt": "..."
    }
  ],
  "output_format": "png",
  "quality": "high",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": { "text_tokens": 0, "image_tokens": 0 },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": { "text_tokens": 0, "image_tokens": 0 }
  }
}
```

- 최상위는 **`data` 배열**이다 — 각 원소가 `{ b64_json, url?, revised_prompt? }`. 어댑터가 기대하는 `{ b64_json, mimeType, width, height, requestId }` 최상위 구조는 실제 응답과 다르다.
  - **`mimeType` 필드는 존재하지 않는다.** 대신 최상위 `output_format`(예: `"png"`)에서 MIME을 유추해야 한다.
  - **`width`/`height` 필드는 응답에 없다.** 최상위 `size`(문자열, 예: `"1024x1024"`)만 있고, 이를 파싱해 폭/높이를 얻어야 한다. 요청한 `size`와 응답 `size`가 다를 수 있는지는 문서에서 명시적으로 확인하지 못함(§확정 못 한 것 참조).
  - **`requestId`라는 필드는 없다.** OpenAI 응답에 요청 식별자를 원하면 HTTP 응답 헤더(`x-request-id` 등, Chat Completions와 동일 관례로 추정 — 이미지 API 페이지에 명시적 확인 못함) 또는 SDK가 제공하는 별도 메타데이터를 봐야 한다. 어댑터가 `response.requestId`를 읽는 부분은 존재하지 않는 필드를 읽는 것이다.
  - `usage`(토큰 사용량) 블록이 **GPT 이미지 모델에서는 응답에 포함된다**(dall-e 계열은 없음). 어댑터는 이를 전혀 다루지 않는다.
  - dall-e 계열에서만 `url` 필드가 채워질 수 있고, GPT 이미지 모델은 `b64_json`이 기본.

출처: https://developers.openai.com/api/reference/resources/images/methods/generate (접근 2026-07-20)

## 5. 엔드포인트: Images API vs Responses API `image_generation` tool

- **Images API**: `POST /v1/images/generations` (및 `/v1/images/edits`) — 단발성 이미지 생성/편집. 요청·응답 스키마는 위 §3, §4.
- **Responses API `image_generation` tool**: 멀티턴 대화 흐름 안에서 이미지 생성·편집을 tool call로 노출. URL/base64/File ID 등 다양한 이미지 입력, 반복 수정(iterative refinement), 대화 컨텍스트 유지를 지원. 요청/응답이 Responses API의 표준 output item 구조(`type: "image_generation_call"` 등)로 감싸져 Images API와 필드 배치가 다르다(세부 스키마는 이번 조사에서 완전히 수집하지 못함 — 확정 못 한 것 참조).
- 어댑터는 Images API(`/v1/images/generations`) 계약을 가정하고 있고, 이는 방향은 맞다(Responses API를 쓸 필요는 없어 보임). 다만 §0의 model enum 불일치 때문에 `gpt-image-2`가 이 엔드포인트에서 실제로 수락되는지는 실측 필요.

출처: https://developers.openai.com/api/docs/guides/image-generation (접근 2026-07-20)

## 6. 가격 (테스트 호출 비용 추정용)

**`gpt-image-2`** — 토큰 기반 과금 (표준 tier):
- 이미지 입력: $8.00 / 1M tokens
- 이미지 캐시 입력: $2.00 / 1M tokens
- 이미지 출력: $30.00 / 1M tokens
- 텍스트 입력: $5.00 / 1M tokens
- 텍스트 캐시 입력: $1.25 / 1M tokens

배치(batch) tier는 각각 절반 수준(이미지 출력 $15.00/1M 등).

커뮤니티 계산 예시(비공식이지만 공식 계산 공식 인용): 1472×1200, medium quality → 출력 1,763 토큰 → **$0.05289**. 정확한 `1024x1024 medium` 1장당 달러 비용은 공식 문서에 사전 계산된 표로 제공되지 않고, "이미지 생성 가이드 내 계산기"를 쓰라고 안내한다 — **1024x1024 medium 단가는 출처 확인 실패, 사용자가 공식 calculator로 직접 확인 필요**.

**`gpt-image-1`** (참고, deprecated) — 이미지당 고정 가격표가 별도로 존재:

| Quality | 1024×1024 | 1024×1536 | 1536×1024 |
|---|---|---|---|
| Low | $0.011 | $0.016 | $0.016 |
| Medium | $0.042 | $0.063 | $0.063 |
| High | $0.167 | $0.25 | $0.25 |

**`gpt-image-1.5`** — 토큰 기반: 이미지 출력 $32.00/1M(표준), $16.00/1M(배치). 나머지는 gpt-image-2와 동일 구조.

출처: https://developers.openai.com/api/docs/pricing (접근 2026-07-20), https://community.openai.com/t/gpt-image-2-output-pricing-calculator-online-and-in-your-code/1382699 (접근 2026-07-20), https://developers.openai.com/api/docs/models/gpt-image-1 (접근 2026-07-20)

## 7. 오류/실패 모드

- **`moderation_blocked`** — HTTP 400, 안전 시스템에 의한 프롬프트/이미지 차단. 재시도로 해결 안 됨(프롬프트 자체를 바꿔야 함). gpt-image-2는 2단계 필터(입력 프롬프트 분류기 → 출력 이미지 분류기)를 쓴다는 커뮤니티 설명이 있음(비공식 블로그 출처, 공식 문서에서 단계 구조를 직접 확인하지는 못함).
- **잘못된 `size`** — gpt-image-2는 §2의 제약(16배수, 3840px 이하, 3:1 이내, 총 픽셀 655,360~8,294,400) 위반 시 요청 단계에서 거부되는 것으로 보이나, 정확한 에러 코드/메시지 문자열은 공식 문서에서 확인하지 못함.
- **레이트리밋 (429)** — 동시성 초과 또는 모더레이션 트리거 누적 시 발생 가능. 커뮤니티에 `gpt-image-2-codex` 관련 4000 RPM 소진 버그 리포트가 있었음(임시 이슈일 가능성, 공식 상태 아님).
- **일반 사용자 오류** — `error.type = "image_generation_user_error"`로 구분되며 재시도 대상이 아니라 요청 자체를 수정해야 하는 오류로 안내됨.

이 섹션은 공식 API 레퍼런스의 에러 스키마 페이지를 직접 인용하지 못했고, 커뮤니티/서드파티 블로그 정리에 의존했다 — **에러 응답의 정확한 JSON 필드(`error.code`, `error.message` 등)는 출처 확인 실패, 실제 실패 호출로 직접 확인 권장.**

출처: WebSearch 결과 — https://help.apiyi.com/en/fix-gpt-image-2-moderation-blocked-400-error-en.html, https://community.openai.com/t/bug-report-global-rate-limit-exhaustion-4000-rpm-for-gpt-image-2-codex-affecting-most-image-requests/1382726 (둘 다 비공식/커뮤니티 소스, 접근 2026-07-20)

---

## 현재 어댑터 대비 차이

| 현재 어댑터 가정 | 문서화된 실제 | 판정 |
|---|---|---|
| `model: 'gpt-image-2'` | 모델은 존재(2026-04-21 출시). 단 `/v1/images/generations` 공식 레퍼런스 enum에는 미노출 — 실제 수락 여부 미확인 | **미확인** (모델 자체는 실재하나 이 엔드포인트에서의 수락은 실측 필요) |
| `size: \`${width}x${height}\`` 임의 문자열 | gpt-image-2는 임의 WxH 허용하지만 16배수·≤3840px·≤3:1 비율·655,360~8,294,400px 총량 제약 있음. 위반 시 거부 가능성 | **부분 틀림** — 현재 구현은 제약 검증이 전혀 없어 위반 요청을 그대로 보낼 수 있음 |
| `output_format: 'png'` | 필드명 자체는 정확 (GPT 모델 전용 파라미터, `png`/`jpeg`/`webp` 중 선택, 기본 `png`) | **맞음** |
| 요청에 `response_format` 없음 | 맞음 — `response_format`은 dall-e 계열 전용, GPT 이미지 모델에는 해당 파라미터가 없음 | **맞음** (부재가 정답) |
| 응답 최상위가 `{ b64_json, mimeType, width, height, requestId }` | 실제 응답 최상위는 `{ created, data: [{ b64_json, url?, revised_prompt? }], output_format, quality, size, usage }` — `data` 배열로 감싸져 있음 | **틀림** |
| 응답에 `mimeType` 필드 | 존재하지 않음. `output_format`에서 유추해야 함 | **틀림** |
| 응답에 `width`/`height` 필드 | 존재하지 않음. 최상위 `size`(문자열)를 파싱해야 함 | **틀림** |
| 응답에 `requestId` 필드 | 그런 필드 없음. HTTP 헤더 등 별도 경로 필요(미확인) | **틀림** |
| 응답에 `usage`(토큰) 처리 없음 | GPT 이미지 모델 응답에는 `usage` 블록(input/output/cached 토큰)이 포함됨 — 비용 추적에 필요하나 어댑터가 무시하고 있음 | **누락** |

---

## 확정 못 한 것

1. `gpt-image-2`가 `/v1/images/generations`(Create Image REST 엔드포인트)의 `model` enum에 실제로 포함되는지 — 공식 레퍼런스 페이지 2회 조회 모두 미노출, 반면 가이드/모델 페이지/커뮤니티 공지는 지원한다고 서술. **실제 테스트 호출로 직접 확인 필요.**
2. 요청한 `size`와 실제 응답의 `size` 필드가 항상 동일한지(모델이 근사치로 반올림해 다른 값을 반환할 가능성), 문서에서 명시적으로 확인 못함.
3. HTTP 응답에서 요청 추적 ID(`x-request-id` 등)를 얻는 정확한 헤더명 — Chat Completions 관례를 추정했을 뿐 이미지 API 문서에서 직접 확인 못함.
4. `gpt-image-2`의 정확한 에러 응답 JSON 스키마(`error.type`, `error.code` 등 필드명) — 공식 API 레퍼런스의 에러 섹션을 이번 조사에서 직접 인용하지 못했음.
5. `1024x1024 medium quality` 등 흔한 조합의 gpt-image-2 사전 계산 달러 단가 — 공식 계산기(calculator UI)로만 제공되고 텍스트 문서에 표로 없음. 출처 확인 실패.
6. Responses API `image_generation` tool의 정확한 출력 item JSON 스키마 — 가이드 텍스트 설명은 확보했으나 필드 단위 스키마는 미수집.
7. gpt-image-2 모더레이션의 "2단계 필터" 설명은 비공식 서드파티 블로그(apiyi.com) 출처뿐이라 공식 확인 아님.

---

## 권장 조치 (조사자 의견, 실행은 별도 승인 필요)

- 라이브 호출 전에 **`curl`로 `gpt-image-2` model 값을 넣은 최소 요청 1건**을 사용자 승인 하에 실행해 (1) 모델이 실제 수락되는지, (2) 응답이 위 §4 스키마와 일치하는지 직접 확인하는 편이 문서 불일치를 해소하는 가장 확실한 방법이다.
- 어댑터의 `responseToAsset`는 `response.data[0].b64_json`, `response.output_format`, `response.size`(파싱)를 읽도록 재작성이 필요하다.
- `size` 검증 로직(16배수/≤3840px/≤3:1/픽셀 총량 범위)을 요청 직렬화 이전에 추가하는 것이 안전하다.
