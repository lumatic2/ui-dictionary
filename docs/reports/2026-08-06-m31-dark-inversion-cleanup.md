# 완료 — M31 다크 반전 정리 (스크림 토큰 + 전체면 반전 4곳)

> 완료: 2026-08-06 · M31 (goal `dark-inversion-cleanup`) · 배치: `docs/reports/` (record — 작성 후 동결)

## 1. 결과

**다크에서 모달 백드롭이 어두워진다 — 이제 사이트에서도, 남의 레포에서도.** `bg-foreground/NN` 을 쓰던
스크림 8곳(7파일)이 신설 semantic 토큰 `surface.scrim` 으로 옮겨갔고, 전체면 반전 목업 4곳이 다크 판본을
얻었다. 토큰은 CLI `renderBrandCss` 와 registry asset 2종에도 실려 `0.4.3` 으로 출고됐다.

의뢰는 "9개 파일 판정"이었으나 **파일이 아니라 용법이 판정 단위**였다 — 스크림 8곳만 결함, "marketing
hero"(`floating-bars-hero`)는 오탐, 인계 목록에 없던 `App.tsx` 2곳이 대상이었다. 그리고 대상 중 2종이
registry 이식 asset 이라 이건 화면 수리가 아니라 **이식 표면의 결함**이었다.

부수로 검사 구멍 하나를 닫았다. `requiredCssVars` 를 최상위 블록 `meta` 에서만 읽어, component tier asset 이
`registryDependencies` 로 딸려올 때 그 토큰 요구가 검사 밖에 남았다 — 승계 계약 ④("선언이 좁으면 검사가
통과해 이식처에서 색이 빠진다")의 실물. `resolve()` 재귀 전체 수집으로 전환했다.

## 2. 이슈와 해결

- **관측이 잡은 결함 1건 — 기계 게이트 전건 통과 상태였다.** step-1 이 `scrim = gray.12` 로 잡았는데 다크
  `--background` 가 바로 그 `gray.12` 다. 같은 색을 같은 색 위에 얹은 것이라 **불투명도와 무관하게 합성 결과가
  0** — 반전 버그는 사라졌지만 그 자리를 **무동작**이 대신했다. 계획이 예상한 "분리감이 약할 수 있다"보다 나쁜
  상태다. `{color.primitive.black}`(primitive 신설)으로 정정. **교훈**: 스크림 계열의 제약은 *다른 토큰과 같은
  값인가*가 아니라 *덮는 표면보다 어두운가*다. "라이트 픽셀 무변화"를 목표로 값을 고른 것이 오답의 원인이었다.
- **Failure probe 로 실패 모드 ① 실증**: `@theme inline` 에서 `--color-scrim` 을 빼면 build exit 0 ·
  prerender 759 로 통과하는데 `.bg-scrim` 유틸이 **0개**가 된다. 백드롭이 투명해지는데 아무 게이트도 짖지 않는다.
- **계획의 E2E 절차가 틀렸다**: step-6 이 "빈 vite → `auth-gate-modal` 이식 → 다크 확인"을 적었으나, CLI 가
  `"not a block-tier asset"` 로 **정상 거부**한다(component tier 는 shadcn CLI 경로). 라이브 asset ↔ 브랜드 CSS
  요구변수 대조로 대체했다.
- **관측 진행 자체의 결함 2건 (사용자 시간을 뺏었다)**: ① dev 서버가 IPv6 에만 바인딩돼 `127.0.0.1` 접속이
  거부됐다 — 사용자 화면이 비어 있던 원인. `--host 127.0.0.1` 로 재기동해 해소 ② 스크린샷을 대화에 붙였는데
  그건 에이전트 화면에만 보인다. Artifact 로 다시 제시했다. **관측 게이트는 "사용자가 실제로 볼 수 있는가"까지가
  에이전트 책임이다.**
- **완료 감사 ① 드리프트(확장) 2건 — 정직한 기록**: ⓐ `color.primitive.black` 신설(계획에 없음) ⓑ CLI
  테스트 3건 추가. 둘 다 관측 결함 수습에 필요했고 범위를 넓히지 않는다. **누락 방향 드리프트 없음**(6 step 전건 수행).
- **완료 감사 ② 순조로움 재검증**: step-3 이 한 번에 통과해 되짚었다 — diff 가 정확히 `4 insertions(+),
  4 deletions(-)` 1파일이고 `bg-foreground` 총 출현수 25 불변(나머지 21곳 무변경). registry 도 재확인 —
  전체 커밋 범위에서 바뀐 `public/r/` 파일이 **3개**(asset 2 + 인덱스)뿐, 나머지 53종 무변경.

## 3. 증거

- changeset: `changesets/20260806-m31-dark-inversion-cleanup` · evidence: `evidence/dark-inversion-cleanup/m31-scrim-token.md` · plan: `archive/plans/2026-08-06-m31-dark-inversion-cleanup.md`
- 검증: vitest **83/83**(신규 3) · `tsc --noEmit` exit 0(사이트·CLI) · 사이트 build exit 0 · prerender **759 불변** · 토큰 lint parse/schema/alias/contrast PASS · llms-sync PASS · `npm pack --dry-run` 15 files·262.4 kB(0.4.2 의 15·261.6 kB 대비 예상 범위) · registry diff 3파일, 53종 무변경 · 출고 워크플로 [run 31073069134](https://github.com/lumatic2/ui-dictionary/actions/runs/31073069134) 전 단계 ✓
- 실표면: ① 빈 `create-vite react-ts` → `npx @askewly/design@0.4.3 init . --block marketing-landing` → 산출 `askewly-brand.css` 에 `--scrim: oklch(0 0 0)`(:root)·`--color-scrim`(@theme) **실재 확인** ② 라이브 registry asset 2종이 `bg-scrim` 사용·구 스크림 잔존 **0** ③ 그 asset 들이 요구하는 변수 **7개/6개 전부 브랜드 CSS 에 정의됨(미정의 0)** ④ 실브라우저에서 `/recipes` Bottom Sheet Detents modal sheet 를 라이트·다크로 렌더해 스크림 계산값 `oklab(0 0 0 / 0.5)` 확인 + **사용자 관측 통과**
- 배선: 신설 장치 없음 — `--scrim` 은 기존 토큰 파이프라인(`generate-tokens.mjs` COLOR_MAPPINGS)의 항목 추가이고, 전이 판독은 기존 `resolve()` 확장이다. 호출자는 각각 생성기와 `installBlock`. 실발화: 위 실표면 ①이 `renderBrandCss` 경로를, ③이 `requiredCssVars` 대조를 실제로 통과시켰다.
- 평가 못 함: ⓐ **전이 판독의 실발화** — `marketing-landing` 이 askewly asset **8종**을 실제로 끌어와 경로 자체는 라이브에서 돌지만, 그 8종 중 `requiredCssVars` 를 선언한 것이 아직 없어 합집합이 블록 자신의 20개와 같다. 구조적으로 닫혔으나 오늘 발화하지는 않았다 ⓑ **라이브 사이트의 다크 육안 확인** — CF Pages 반영 후 로컬 관측과 동일 코드임을 근거로 갈음했고 라이브 화면을 다시 열어 보지는 않았다 ⓒ 상류 shadcn primitive 의 `requiredCssVars` 공백은 범위 밖으로 남겼다
- 크기 회고: 6 step · changeset 1개 · human gate 2회(관측·배포) · 커밋 11개 — milestone-grade 맞다. 목표(큐 ①)가 그 크기였으므로 과소 그릇 아님.
- 재현: `npx --yes @askewly/design@0.4.3 init <빈 vite react-ts dir> --block marketing-landing --color violet --yes` → `grep scrim src/askewly-brand.css` · 사이트는 `npm run dev -- --host 127.0.0.1` → `/recipes` → Overlays → Bottom Sheet Detents → "Open modal sheet" → 다크 토글
