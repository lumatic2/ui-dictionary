# changeset — M31 다크 반전 정리 (스크림 토큰 + 전체면 반전 4곳)

> 2026-08-06 · goal `dark-inversion-cleanup` · plan `plans/2026-08-06-m31-dark-inversion-cleanup.md`
> evidence `evidence/dark-inversion-cleanup/m31-scrim-token.md`

## 무엇이 바뀌었나

**토큰 SSOT** — `color.primitive.black` 신설, `color.semantic.surface.scrim` 신설(`{color.primitive.black}`,
다크 오버라이드 **없음**). 생성물 3종 재생성(`src/tokens.css`·`DESIGN.md` frontmatter·`public/llms/tokens/`).
`@theme inline` 에 `--color-scrim` 배선.

**사이트** — 스크림 8곳/7파일을 `bg-foreground/NN` → `bg-scrim/NN`(불투명도 원값 보존).
`term-visual.tsx` 전체면 반전 4곳에 `dark:bg-muted dark:text-foreground`.

**이식 경로** — `renderBrandCss` 가 `--scrim` 을 `:root` 에 1회 + `@theme inline` 에 `--color-scrim`.
`requiredCssVars` 수집을 최상위 블록 `meta` → `resolve()` 재귀 전체로 확장.
`auth-gate-modal`·`bottom-sheet-detents` 에 `requiredCssVars` 신설. CLI **0.4.3**.

## 왜 (계약으로 남길 것 4건)

1. **스크림은 자기가 덮는 가장 어두운 표면보다 어두워야 한다.** `--foreground` 를 쓰면 다크에서 뒤집혀
   백드롭이 *밝아지고*, 다크 배경과 같은 `gray.12` 를 쓰면 *아무것도 어둡게 하지 않는다*(합성 결과 0).
   둘 다 실측했다. 그래서 순수 검정이고, 그래서 모드 오버라이드가 없다.
2. **`@theme inline` 은 변수 선언과 한 몸이다.** 변수만 넣고 매핑을 빠뜨리면 Tailwind 가 유틸을 조용히
   버린다 — 빌드 exit 0, prerender 정상, 백드롭만 투명. probe 로 실증했다.
3. **`requiredCssVars` 는 component tier 까지 읽어야 한다.** 최상위 블록 meta 만 읽으면 딸려오는 asset 의
   토큰 요구가 검사 밖에 남는다. 승계 계약 ④("선언이 좁으면 검사가 통과해 이식처에서 색이 빠진다")의 실물.
4. **불투명도는 토큰이 아니라 사용처가 갖는다.** `/20`(옅은 전환)과 `/72`(라이트박스)는 서로 다른 의도다.

## 범위 밖 (의도적)

C2 작은 컨트롤(반전 버튼·토스트·툴팁·미니목) — 다크의 흰 덩어리가 의도된 최고강조 문법(D1 사용자 확정).
C3 데코 틴트 — 양 모드에서 알아서 뒤집히는 정상 용법. `contrast-duo-card`(반전이 콘텐츠)·`ui/tooltip`
(shadcn 정본) 불가침. 블록 3종 `requiredCssVars` — 이식 파일에 스크림 0건(실측).

## 남은 위험

- **0.4.2 이하에 고정된 프로젝트**가 새 registry asset 을 받으면 `--scrim` 이 없어 백드롭이 빈다.
  출고로 해소되지 않는다 → 배포 순서를 **CLI 먼저, registry 나중**으로 고정한다(D5).
- **상류 shadcn primitive 는 `requiredCssVars` 를 갖지 않는다** — M31 이전부터의 공백, 범위 밖.

## 검증

vitest 83/83(신규 3) · tsc 0(사이트·CLI) · 사이트 build 0 · prerender 759 불변 · 토큰 lint 4항 PASS ·
llms-sync PASS · registry diff 4파일(나머지 53종 무변경) · `npm pack --dry-run` 15 files·262.4 kB
(0.4.2 의 15·261.6 kB 대비 예상 범위) · **사람 관측 통과 2026-08-06**.
