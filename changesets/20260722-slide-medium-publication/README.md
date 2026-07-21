# 슬라이드 규격이 에이전트 경로에 실린다 + 분류표의 빈칸을 메운다

> 2026-07-22 · milestone DOG5 step-3 · changeset #263

## 왜

step-1·2가 코드를 만들었다. 코드는 에이전트가 안 읽는다 — `llms.txt`를 읽는다.

## 무엇을

`docs/design-system/slide-spec.md` 신설 + `Media` 섹션 등재(분류 → 슬라이드 → 인쇄 순).

문서 구조가 이 매체의 성격을 그대로 담는다:

1. **읽는 법** — 등급 체계를 먼저 설명한다. "등급을 지우고 값만 옮기지 말 것."
2. 캔버스 프리셋 (확정 사실 중심, 등급 열 포함)
3. WCAG 대비 (확정)
4. 통설 3규칙 (옵트인, 각 행에 **실제 출처**)
5. **확정 못 한 것** — 7항목. "모르는 것을 모른다고 적어둔 것이지 나중에 채울 빈칸이 아니다."
6. 이 계약이 아직 하지 않는 것

## 계획에 없던 것 — medium-taxonomy 발표 행 갱신

DOG4에서 발표 행을 *"DOG5 대상 — 규격·게이트는 DOG5가 정한다"*로 비워뒀다. 그 DOG5가 방금 끝났다.

**갱신하지 않으면 배포된 분류표가 에이전트에게 "발표 게이트는 없다"고 말한다** — 바로 옆 인덱스에 `slide-spec.md`가 실려 있는데도. DOG4가 그 칸을 "미정"이라고 정직하게 적은 것이 이제는 거짓이 되는 시점이다.

발표 행을 실제 게이트로 채웠다: 캔버스 프리셋 선언 대조 · WCAG AA · **통설은 옵트인 경고이고 통과 조건이 아님**을 명시.

"세 줄이 서로 다른 이유" 절의 발표 항목도 고쳤다. 전에는 "거리와 조명으로 깨진다(가설)"였는데, 리서치가 끝난 지금 실제 답은 다르다 — **발표는 근거가 얇아서 깨진다.** 무엇을 지켰는지가 아니라 무엇을 근거로 지켰는지가 갈린다.

step-2 검사 스크립트의 `발표 행에 DOG5` 항목도 함께 무효화했다(자리표시자 시절의 조건). 대신 **실체를 가리키는지** 검사한다 — `slide-spec.md` 링크와 `옵트인` 구분.

## Failure probe

| 조작 | 잡히는 실패 |
|---|---|
| 문서만 두고 `FIXED_ASSETS` 등록 생략 | `llms.txt`에 링크 없음 — VL2류(자산은 있는데 에이전트 경로 밖) |
| 등록하고 push 생략 | 배포본 fetch 404 |

## Contract

- source of truth: `research/2026-07-22-design-output-gates-slide-spec.md`(값) · `slide-spec.ts`(코드) · 이 문서(에이전트 소비면)
- deploy/sync target: Cloudflare Pages(`ui.askewly.com`)
- out of scope: 마무리 절차가 이 게이트를 부르는 배선 — DOG6

## 검증

- [x] `node scripts/generate-llms-txt.mjs` exit 0 (160 assets, 무결성 검사 내장)
- [x] `llms.txt` `Media` 섹션에 3개 링크
- [x] medium-taxonomy 게이트 검사 exit 0 (세 행이 여전히 서로 다름)
- [x] 배포본 fetch — evidence 파일
