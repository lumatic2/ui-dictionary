# changeset — M32 `requiredCssVars` 를 손 선언에서 실측으로

> 2026-08-06 · goal `queue-drain` · plan `plans/2026-08-06-m32-required-css-vars-measured.md`
> evidence `evidence/queue-drain/m32-required-css-vars.md`

## 무엇이 바뀌었나

**registry 생성기** — `scripts/generate-registry.mjs` 에 실측 층 3개: `stripComments`(따옴표 상태를 보며
주석만 제거 — URL 의 `//` 보존) · `extractCssVars`(이식 파일이 쓰는 CSS 변수 추출) ·
`assertDeclarationCoversUsage`(선언이 실측보다 좁으면 생성 실패). 블록 경로와 비블록 경로 **양쪽**에 배선.
`--self-test`(픽스처 8종)·`--print-measured`(감사용 출력) 플래그 신설.

**선언 데이터** — `examples/ui-vocabulary-site/registry.json` 의 49종에 실측 선언 신규 기입.
기존 5종은 이미 실측의 상위집합이라 무변경, 요구 0인 3종은 생략. `public/r/` 재생성.

**계약 문서** — `block-contract.md` §4.1(실측 규약·추출 문법·제외 규칙·정적 추출의 한계)와
§4.2(상류 shadcn 검사 경계와 그것이 안전한 이유) 신설. llms 재생성.

**테스트** — `packages/cli` 에 6건 추가: 전이 수집 발화(양·음 2건) · 브랜드 CSS 가 실측 합집합을 덮는가 ·
사이트 전용 토큰 gap 고정 · 상류 21종 요구 변수 커버리지 · Radix 런타임 변수 불간섭.

**CLI 무변경** — 상류 실측 결과 baseline 이 불필요해 `0.4.4` 를 내지 않았다.

## 왜 (계약으로 남길 것 4건)

1. **선언은 실측과 대조되기 전까지 신뢰하지 않는다.** M31 은 `requiredCssVars` 를 방어선으로 세웠지만
   그 방어선은 "사람이 빠짐없이 적었는가"에 걸려 있었다 — 57종 중 5종만 적혀 있었다.
2. **선언 자리는 tier 마다 다르다.** 블록은 항목 top-level, 비블록은 `meta` 아래. 한쪽만 게이트하면
   54종이 조용히 검사 밖에 남는다.
3. **누락은 실패, 초과는 통과.** 넓은 선언은 무해하고, 실측으로 좁히면 그 선언에 기대던 소비처가 깨진다.
4. **우리가 선언할 수 없는 의존은 "구멍"이 아니라 "경계"다** — 다만 그 말은 측정한 뒤에만 할 수 있다.
   상류 21종이 요구하는 27종 중 25종을 브랜드 CSS 가 정의하고 2종은 Radix 런타임 소유임을 재고 나서
   경계로 확정했다. 이 사실은 테스트로 고정돼 있어 깨지면 알려준다.

## 실측이 잡은 것

- 추출기 오검출 2라운드 — `--color-<series>`(shadcn chart 런타임 주입)·`--spacing`(Tailwind 내장)·
  자기정의 변수 · `style.setProperty()` 주입. 넷 다 소비처가 정의할 대상이 아니라 제외 규칙으로 폐구.
- **`color-palette-generator` 가 사이트 전용 `--askewly-violet` 을 요구한다** — 소비처엔 없어 포커스 링이
  투명해진다. 이식 파일 내용 변경은 M32 범위 밖이라 finding 으로 이월(테스트로 gap 고정).

## 무엇이 증명되지 않았나

`marketing-landing` 의 전이 합집합은 **20 그대로**다. 자식 asset 8종이 요구하는 10종이 블록 선언 20의
부분집합이기 때문이다. 그래서 "전이 수집이 돈다"는 라이브 개수가 아니라 **픽스처**로 증명했고,
라이브에서는 배포 전 자식 선언 0개 → 후 10개라는 **전후 대조**로 경로가 실데이터를 받게 됐음만 기록했다.
