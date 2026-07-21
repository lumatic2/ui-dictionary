# 검사기 오탐 제거 — 규칙이 아니라 문맥을 고친다

> 2026-07-22 · milestone DOG1 step-2 · changeset #248

## 왜

step-1이 기준선을 고정하며 **horizon 실사보다 넓은 사실**을 냈다. 오탐은 hex 규칙만의 문제가 아니라 `raw-color-fn`에도 똑같이 있었다:

| 위치 | 잡힌 것 | 판정 |
|---|---|---|
| `svg.tsx:6` | `fill="#000000"` | 오탐 |
| `svg.tsx:7` | `stroke="rgb(255, 255, 255)"` | 오탐 |
| `comment.tsx:5` | `// design ref: #FF0000 …` | 오탐 |
| `comment.tsx:6` | `/* legacy palette: rgb(10, 20, 30) */` | 오탐 |

**두 규칙이 모두 문맥을 안 본다.** 그래서 규칙별로 예외를 붙이면 규칙이 늘 때마다 같은 오탐이 재발한다. 예외는 규칙이 아니라 **스캔 전 단계**에 있어야 한다.

## 무엇을

`maskIgnoredRegions(source, ext)` 신설 — 렌더 결과에 영향이 없는 영역을 **공백으로 덮되 문자 위치와 줄바꿈을 그대로 보존**한다. 줄번호가 원본을 계속 가리키게 하기 위해서다.

**Pass 1 — 주석** (문자열 인식 상태 기계)
- `//` 줄 주석, `/* */` 블록 주석, JSX `{/* */}`
- **문자열 안의 `//`는 주석이 아니다** — `"https://x.dev"` 뒤의 코드를 삼키면 진짜 위반을 놓친다
- **CSS에는 `//` 주석이 없다** — `.css`에 적용하면 `url(//cdn/…)` 뒤 선언이 통째로 가려진다

**Pass 2 — SVG 마크업** (주석 마스킹 *뒤에* 실행)
- `<svg>…</svg>` 와 자기닫힘 `<svg … />`
- 주석 처리된 `</svg>`가 블록을 조기 종료하지 못하도록 순서를 고정했다

보고 시엔 **마스킹 안 된 원본 줄**을 발췌로 쓴다. 마스크는 매칭 장치이지 독자가 해독할 것이 아니다.

## 관측 (step-1 기준선 대비)

| fixture | step-1 | step-2 | 판정 |
|---|---|---|---|
| `svg.tsx` | 위반 2 | **0** | 오탐 해소 |
| `comment.tsx` | 위반 2 | **0** | 오탐 해소 |
| `clean.tsx` | 0 | 0 | 유지 |
| `svg-outside.tsx` (신규) | — | **2** (`:5` hex · `:8` raw-color-fn) | 예외 밖은 여전히 잡힘 |
| `comment-outside.tsx` (신규) | — | **2** (`:6` hex · `:10` raw-color-fn) | 예외 밖은 여전히 잡힘 |
| `oneline.tsx` | 위반 1 | 1 | step-3 대상 |

**양방향 게이트가 성립했다.** 오탐 4건이 사라지면서 예외 밖 위반 4건은 그대로 잡힌다.

## Failure probe — 실제로 돌렸다

| probe | 조작 | 결과 |
|---|---|---|
| A | 마스킹 제거(원본 그대로 스캔) | **5건 실패** — 오탐 테스트 2 + 예외밖 테스트 2 + 원본 발췌 테스트 1 |
| B | 예외를 블록 단위가 아니라 **파일 전체 스킵**으로 확대 | **1건 실패** — `still flags literals outside the SVG block` |

B가 이 changeset의 핵심 위험(예외를 넓게 뚫어 진짜 위반을 놓치는 것)을 정확히 잡는다.

### ⚠ 첫 probe 시도는 헛돌았다 (기록)

처음 두 probe를 heredoc 안 Python 문자열 치환으로 돌렸는데 **이스케이프가 어긋나 치환이 한 글자도 안 먹었다**(`\n` 이 개행으로 해석돼 대상 문자열과 불일치). 그런데 테스트는 12건 전부 통과했다 — **원본 코드가 그대로였으니 당연했다.**

"probe를 돌렸고 통과했다"로 넘어갔으면 검증한 척만 한 셈이다. 통과가 이상해서 대상 문자열을 바이트 비교해보고 드러났다. **probe는 실패를 봐야 성공이다** — 통과하면 probe 자체를 의심한다. 이후 파일 편집 도구로 다시 돌려 A/B 둘 다 실패를 확인했다.

## Contract

- source of truth: `packages/cli/src/verify.ts`
- deploy/sync target: 없음 (배포는 DOG2)
- compatibility: 기존 `verify.test.ts` 3건 그대로 PASS — 회귀 하한 유지
- out of scope: 한 줄 다중 위반(step-3), HTML `<!-- -->` 주석(아래 finding)

## 검증

- [x] `npx vitest run` (packages/cli) **30 passed** — 21 → +9
- [x] `npx tsc --noEmit` exit 0
- [x] `npm run build` 성공 (data bundled: terms=562 recipes=45)
- [x] 루트 `npm run verify` exit 0
- [x] fixture 6종 CLI 실행 관측 — 위 표와 일치
- [x] Failure probe A·B 실제 실행, 각각 5건·1건 실패 확인 후 원복

## finding 큐

- **HTML `<!-- -->` 주석은 아직 오탐이다.** 같은 결함 종류지만 이번 scope(plan이 명시한 `//`·`/* */`·JSX)에 없어 손대지 않았다. `.html` 산출물을 검사 대상에 넣을 때 필요해진다.
- **자기닫힘 `<svg … fill="#000" />`** 는 `SVG_SELF_CLOSING` 이 덮지만, `<svg>` 여는 태그 자체에 색이 있고 자식이 있는 형태는 Pass 2의 non-greedy 매칭에 의존한다. 중첩 `<svg>` 는 드물어 지금은 문제되지 않는다.
