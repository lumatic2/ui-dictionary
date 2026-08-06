# PLAN — M31: 다크 반전 정리 — 스크림 토큰 신설 + 전체면 반전 4곳

> 생성: 2026-08-06 · 갈래: goal `dark-inversion-cleanup` (M29 이월분) · scope: 다크에서 **밝아지는 백드롭 8곳**과 **흰 판때기 4곳**을 고친다. 고치는 방식은 파일별 `dark:` 산포가 아니라 **semantic 토큰 1개 신설**이며, 그 토큰은 이식 경로(CLI·registry)까지 함께 탄다.
Status: approved (사용자 승인 2026-08-06 "ㄱㄱ" — D5 = 0.4.3 출고 포함·CLI 먼저 배포, D3 = 이름 `scrim` 확정. 판정 근거 = 2026-08-06 전수 감사, artifact `dd8a59f4`)

## 계획 검증자 반영 (2026-08-06 — 초안 치명 3건)

신선한 검증자가 초안의 **치명 3건**을 실측으로 잡았고 전부 반영했다. 초안이 틀렸던 지점:

1. **`requiredCssVars` 를 없는 자리에서 고치려 했다.** 이 필드는 `public/r/<asset>.json` 이 아니라
   **블록 3종에만** 있고(`registry.json:147,183,547`), kickstart 는 **최상위 블록 meta 만** 읽는다
   (`kickstart.ts:584` — 전이 수집 없음). 대상 asset 2종(`auth-gate-modal`·`bottom-sheet-detents`)은
   component tier 라 **선언 자리도, 읽는 코드도 없다** → 초안의 Failure probe 는 발동조차 안 하는 no-op 이었다.
   추가 실측: docs-site 블록의 이식 파일 6개에 스크림 **0건** — 블록은 무영향(초안의 "조합 asset 전이" 우려는 기우).
2. **이식 경로의 `@theme inline` 이 빠졌다.** `renderBrandCss` 는 변수 선언 + 자체 `@theme inline` 목록을
   함께 출력한다(`kickstart.ts:272-303`). 변수만 넣으면 이식처에서 `bg-scrim` 이 **조용히 버려진다** —
   이 계획 자신의 실패 모드 ①을 이식 경로에서 재현하는 셈.
3. **D5("CLI 버전 안 올린다")가 이식처를 지금보다 나쁘게 만든다.** `packages/cli/data/` 는 gitignored
   (`packages/cli/.gitignore:3`)라 "재빌드"는 로컬 산출물일 뿐 — npm 의 0.4.2 에는 `--scrim` 이 없다.
   그 상태로 registry asset 만 `bg-scrim` 으로 배포하면 그 asset 을 받는 사람은 백드롭이
   **어두워지는 대신 아예 사라진다**(미정의 유틸 = 클래스 미생성). 배포 순서·출고 여부는 사용자 결정으로 올렸다(D5 재개).

경미 6건도 반영: C1 개수 정정 · `public/llms/tokens/tokens.css` 를 step-1 Files 에 추가 ·
`build:data` 실제 입력 정정 · step-5 분할(관측/배포) · component tier E2E 절차 정정.

## 북극성 → milestone → step (위계)

북극성(`CLAUDE.md` 「북극성」)의 **"화면=상태·다크모드 게이트"** 와 **"이식 가능한 제품"** 이 만나는 지점이다.
M29 는 docs-site 가 렌더하는 3종만 고치고 나머지를 이월했는데, 그 이월분에 **registry 로 남의 레포에 이식되는
asset 2종이 들어 있다.** 지금 그 asset 을 받는 사람은 다크에서 백드롭이 밝아지는 모달을 그대로 받는다.

## 전수 감사 결론 (M31 의 입력 — 재조사 불요)

| 분류 | 곳 | 판정 | 이번 범위 |
|---|---|---|---|
| C1 스크림 (`inset-0` + `bg-foreground/20~72`, 텍스트 없음) | **8곳 / 7파일** | **결함 확정** — 다크에서 백드롭이 밝아진다 | ✅ step-2 |
| C2 반전 솔리드 — **전체면** | 4곳 (term-visual) | 다크에서 흰 판때기 | ✅ step-3 |
| C2 반전 솔리드 — **작은 컨트롤** | 나머지 전부 | 의도된 최고강조 문법 (D1) | ❌ 무변경 |
| C3 데코 틴트 (`/10~80`, 텍스트 없음) | 나머지 전부 | **오탐** — 양 모드에서 알아서 뒤집힌다 | ❌ 무변경 |

> **개수 정정**: 감사 시점 artifact 는 C1 을 "10곳"으로 적었으나 실측 재확인 결과 **8곳/7파일**이다
> (`auth-gate-modal:50`·`action-sheet-destructive-confirmation:44`·`bottom-sheet-detents:50`·
> `recipe-gallery-demos:58`·`colors-page:138`·`article-documentation-layout:191`·`App.tsx:2016,2337`).
> 검증자가 줄번호 8곳 전건을 실측 확인했다. **C2 작은 컨트롤·C3 의 총계는 줄 단위로 검증하지 않았다** —
> 이번 범위는 "고칠 8+4곳"이 실측으로 확정된 것으로 충분하고, 나머지는 무변경이라 개수가 계약에 걸리지 않는다.
> 초안이 적었던 9곳·38곳은 근거 없는 수치라 철회한다.

**불가침 2건** — `contrast-duo-card`(반전이 데모의 콘텐츠), `ui/tooltip`(shadcn 정본).
**인계 목록 정정 2건** — "marketing hero"(`floating-bars-hero`)는 C3 오탐이라 대상 아님 / 목록에 없던 `App.tsx` 2건 포함.

선례: 같은 계열 결함을 **이미 한 번 밟았다** — DM3 관측 결함 ③ "인버스 토큰(`bg-foreground`) 치환 탓에
다크에서 희게 뒤집혀 … → 양 테마 고정 복원"(`docs/reports/2026-07-31-dm3-dark-mode-activation.md:11`).
그때 해법이 *양 테마 고정*이었다는 게 D4 의 근거다.

## run 전 scope 결정

- **포함**: ① 토큰 SSOT 에 `scrim` 신설 + 생성물 3종 재생성 ② 사이트 스크림 8곳 배선 ③ 전체면 반전 4곳
  ④ 이식 경로(브랜드 CSS 변수 + `@theme inline` + component tier `requiredCssVars` 판독) ⑤ 통합 E2E + 사람 관측
  ⑥ 출고·배포(CLI → registry 순) + 라이브 재현.
- **제외**: C2 작은 컨트롤 전부 · C3 전부 · 불가침 2건 · `bg-foreground` 전역 치환 · 반전 오용 lint 룰 신설 ·
  큐의 나머지(책 스터디·D2 Presenton·Around 재판정·Figma 후속 3건).
- **연쇄**: 없음 — 1-milestone. 큐의 나머지 4건은 파일·표면이 겹치지 않아 같은 승인에 묶을 근거가 없다.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  **human gate 2개** — step-5 라이트·다크 관측, step-6 배포 승인.
- rollback/cleanup: 커밋 단위 revert. **생성물 주의** — `tokens.css`·`DESIGN.md` frontmatter·`public/llms/tokens/tokens.css`
  는 손으로 되돌리지 말고 SSOT 되돌린 뒤 `node scripts/generate-tokens.mjs` 재실행. **배포 순서 되돌림 불가** —
  registry 를 먼저 배포하면 되돌려도 그 사이 받아간 사람은 못 고친다(D5 가 다루는 위험). 관측용 dev 서버는
  종료 시 정리(`netstat -ano | grep :<port>` → `Stop-Process -Id <pid> -Force` — node 자식 잔존).

## 스캐폴딩 결정

- source-of-truth: 토큰 SSOT = `tokens/askewly.tokens.json` 단일. `examples/ui-vocabulary-site/src/tokens.css` ·
  `DESIGN.md` frontmatter · `public/llms/tokens/tokens.css` 는 **전부 생성물**(파일 머리 "do not edit by hand",
  `node scripts/generate-tokens.mjs` + `scripts/generate-llms-txt.mjs`) — 손으로 고치지 않는다.
  이식 경로 SSOT = `packages/cli/src/kickstart.ts` 의 `renderBrandCss`(변수 + `@theme inline` 양쪽).
  `packages/cli/data/` 는 **gitignored 빌드 산출물**이라 정본이 아니다.
- 검증: step 별 Verify + **통합 검증** = 사이트를 라이트/다크로 띄워 모달 4종을 사람이 관측하고,
  배포 후 라이브 registry 에서 asset 1종을 실제로 받아 다크를 확인한다. 회귀 = **라이트 렌더 픽셀 무변화**
  (D4 부수효과) + C2 작은 컨트롤·C3·불가침 2건 **diff 0** + `npm run build`·`verify`·vitest·oxlint·llms-sync.
- 배포/운영: 사이트 CF Pages + registry `public/r/`. **순서 고정 — CLI 출고(0.4.3) 먼저, registry 나중**
  (D5). push·배포는 사용자 승인 지점.
- 자기선언 도메인 — **스크림은 양 모드 동일값**: `com.askewly.modes.dark` 오버라이드를 **두지 않는다**.
  스크림의 정의가 "뒤를 어둡게 누른다"라 모드에 따라 뒤집히면 의미가 무너진다. `hasDarkOverride` 가 false 이므로
  생성기가 `.dark{}` 에서 자동 제외한다(`generate-tokens.mjs:156`) — 구조가 이미 이 의도를 지원한다.
- 자기선언 도메인 — **이름은 `scrim`**: `color.semantic.surface.overlay` 가 이미 "Popovers, dropdowns,
  floating layers"로 점유돼 있어(`tokens/askewly.tokens.json:92-96`, 검증자 확인) `overlay` 재사용은 뜻이 겹친다.
  `scrim` 은 Material Design 3 의 동명 role 이라 뜻이 바로 읽힌다.
- 자기선언 도메인 — **불투명도는 토큰이 아니라 사용처가 갖는다**: `bg-scrim/50`·`/72` 처럼 곳별 농도를 유지한다.
  농도까지 토큰화하면 8곳의 서로 다른 의도(확인 다이얼로그 vs 라이트박스)가 하나로 뭉개진다.
- 검토 후 제외: 반전 오용 lint 룰 신설(분류가 용법 의존이라 오탐 과다 — finding 큐) · `bg-foreground` 전역 치환 ·
  C2 작은 컨트롤 손대기(D1 명시 제외) · 블록 3종 `requiredCssVars` 확장(블록 파일에 스크림 0건 — 실측).

## 결정 로그

- status: resolved

- **D1 — C2 작은 컨트롤을 고칠 것인가 [사용자 소유 · 확정 2026-08-06]**: **유지.** 라이트/다크 병치 관측 후
  "권고대로" — 전체면 4곳만 수정. 근거: 다크의 흰 버튼·흰 토스트는 Vercel·Linear 계열의 정식 최고강조 문법.
- **D2 — 스크림 수정 방식 [사용자 소유 · 확정 2026-08-06]**: **semantic 토큰 신설.** 파일별 `dark:` 산포 아님.
  근거: entry-protocol 의 "Semantic tokens only in component code; never raw primitives or hex literals" +
  `verify` 의 리터럴 게이트 → `bg-black/50` 은 애초에 탈락.
- **D5(재개) — 이식 경로 배포 순서 [사용자 소유 · 미결 → 승인 시 확정]**: 초안은 "CLI 버전 안 올림"이었으나
  검증자가 그 경우 **이식처가 지금보다 나빠짐**을 실측했다(백드롭 소멸). 아래 승인 질문에서 정한다.
  권고 = **0.4.3 출고 포함 + CLI 먼저 배포**.
- **D3 — 토큰 이름 [에이전트 제안 · 승인 시 확정]**: `scrim`. 검증자 지적대로 이 이름은 registry·CLI 를 타고
  남의 레포 CSS 에 박히는 **공개 API** 라 배포 후 개명 비용이 크다 → 에이전트 단독 소유에서 승인 항목으로 올린다.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **값 = `{color.primitive.gray.12}`, 다크 오버라이드 없음**(위 자기선언). 부수효과로
    **라이트 렌더가 픽셀 무변화** — 현 `--foreground` 라이트값과 같은 primitive 다
    (`gray.12 = oklch(0.16 0.015 270)` ↔ `src/tokens.css:5`, 검증자 실측 확인).
  - ② **자리 = `color.semantic.surface.scrim`** — 새 그룹을 만들지 않는다.
  - ③ **불투명도는 사용처 유지**(위 자기선언).
  - ④ **component tier `requiredCssVars` 판독을 kickstart 에 추가**한다. 이유: 현재 구조에서는 이 계약이
    component asset 에 **존재하지 않아** 검사 구멍이 열려 있다(검증자 치명 ①). 승계 계약 ④("선언이 좁으면
    검사가 통과해 이식처에서 색이 빠진다")의 실현 사례라 같은 milestone 에서 닫는다.
  - ⑤ **블록 3종 `requiredCssVars` 무변경** — 블록 이식 파일에 스크림 0건(실측).
- **위임 결정**: **skip** — 판정이 끝났고 배선이 좁다. 계획 검증자 1회만 별도 수행(완료).

## 재생성 장벽

- **step-1 이후**: `tokens.css` · `DESIGN.md` frontmatter · `public/llms/tokens/tokens.css` 재생성 — step-2·3·4 가 의존.
- **step-4 이후**: `public/r/` registry 재생성.
- **step-6**: 배포 후에야 asset 변경분이 이식 경로에 보인다 — 블록/asset JSON 의 regDeps 가 **라이브 절대 URL**
  이라 로컬 `--registry` 서빙으로는 관측 불가(M29 승계 계약).

## Step 트리

- [x] **step-1 — 토큰 SSOT 에 `scrim` 신설 + 생성물 재생성**
  - Artifact: `--scrim` 이 라이트/다크 동일 값으로 존재하고 `bg-scrim/NN` 유틸이 해석된다
  - Files: `tokens/askewly.tokens.json`(`color.semantic.surface.scrim`) · `scripts/generate-tokens.mjs`(`COLOR_MAPPINGS` 1행) ·
    `examples/ui-vocabulary-site/src/index.css`(`@theme inline` 에 `--color-scrim`) ·
    생성물 3건(`src/tokens.css` · `DESIGN.md` · `public/llms/tokens/tokens.css`)
  - Dependencies: 없음
  - Verify: `node scripts/generate-tokens.mjs` 2회 실행 후 `git diff` 무변화(멱등) · `tokens.css` `:root` 에 `--scrim` 존재 ·
    `.dark{}` 에는 **부재** · 값이 현 라이트 `--foreground` 와 동일 · `node scripts/check-llms-sync.mjs` PASS ·
    브라우저 계산값으로 `bg-scrim` 이 실제 색을 갖는지 확인(클래스 생성 여부)
  - Failure probe: `@theme inline` 항목을 **일부러 빼고** 빌드 → `bg-scrim` 이 조용히 버려지는지 재현하고,
    그 상태가 빌드 통과라는 것을 기록(실패 모드 ①의 실증)
  - Risk: 기계적 (Tailwind 는 모르는 클래스를 조용히 버려 빌드가 통과한다 — Verify 에서 계산값으로 확인)
  - Commit: `feat(tokens): scrim semantic 토큰 신설 — 모달 백드롭용 양모드 고정`

- [x] **step-2 — 스크림 8곳 배선 (7파일)**
  - Artifact: 백드롭이 다크에서 밝아지지 않는다
  - Files: `auth-gate-modal.tsx:50` · `action-sheet-destructive-confirmation.tsx:44` · `bottom-sheet-detents.tsx:50` ·
    `recipe-gallery-demos.tsx:58` · `colors-page.tsx:138` · `article-documentation-layout.tsx:191` · `App.tsx:2016,2337`
  - Dependencies: step-1
  - Verify: 7파일에서 스크림 용법 `bg-foreground/` 잔존 0건 · 각 곳 원래 불투명도(`/20`·`/35`·`/50`·`/72`) 보존 ·
    `npm run build` exit 0 · `npx @askewly/design verify` 0건 · **라이트 스크린샷 대조 픽셀 무변화**
  - Failure probe: `colors-page:251`(토스트, C2) 을 함께 바꾸지 않았는지 — 같은 파일의 다른 용법 오염 검사
  - Risk: 위험 (다크에서 어두운 스크림 + 어두운 배경이라 분리감이 약할 수 있다 — step-5 관측에서 시트 `--card` 0.25 와의 분리를 보고 부족하면 불투명도만 곳별 조정, 토큰 재설계 아님)
  - Commit: `fix(dark): 모달 백드롭 8곳 scrim 토큰 전환`

- [x] **step-3 — 전체면 반전 4곳**
  - Artifact: 다크에서 흰 판때기가 사라진다
  - Files: `term-visual.tsx:3110, 4652, 5100, 5115`
  - Dependencies: step-1
  - Verify: 4곳에 `dark:bg-muted dark:text-foreground`(M29 가 3종에 쓴 것과 동일 해법) · `npm run build` exit 0 ·
    `term-visual.tsx` 의 나머지 반전 21곳 **diff 0**(줄 단위 대조)
  - Failure probe: 같은 파일의 C2 작은 컨트롤(1865·2574·2592·3279·3995·4518)·C3 틴트를 건드렸는지 diff 로 확인
  - Risk: 기계적 (25곳이 한 파일에 몰려 있어 일괄 치환 유혹이 크다 — diff 줄 대조로 4곳만 확인)
  - Commit: `fix(dark): 전체면 반전 목업 4곳 다크 판본`

- [x] **step-4 — 이식 경로 배선**
  - Artifact: 킥스타트로 이식된 프로젝트도 `--scrim` 을 갖고, 빠지면 검사가 잡는다
  - Files: `packages/cli/src/kickstart.ts` — ⓐ `renderBrandCss` 변수부에 `--scrim`(라이트/다크 동일값)
    ⓑ **같은 함수의 `@theme inline` 목록에 `--color-scrim`**(검증자 치명 ②) ⓒ component tier
    `requiredCssVars` 판독(기술 결정 ④) · `public/r/auth-gate-modal.json`·`bottom-sheet-detents.json` 에
    `requiredCssVars` 신설 · registry 재생성
  - Dependencies: step-1, step-2
  - Verify: vitest 전건 · `missingRequiredVars(renderBrandCss(...), ['--scrim'])` 빈 배열 ·
    **판독 확장이 실제로 발화**(component asset 1종으로 검사가 돌았다는 증거 1회) ·
    registry 순수성 게이트 PASS · 무관 asset 55종 **무변경** · 블록 3종 `requiredCssVars` 무변경
  - Failure probe: `requiredCssVars` 에서 `--scrim` 을 **빼고** 실행 → 검사가 잡는지.
    초안에서는 이 probe 가 no-op 이었다(선언 자리도 읽는 코드도 없었음) — ⓒ 를 넣어야 비로소 발동한다
  - Risk: 위험 (판독 확장이 기존 블록 경로 동작을 바꿀 수 있다 — 블록 3종 킥스타트 산출 동일성으로 확인)
  - Commit: `feat(cli): 이식 경로에 scrim 배선 + component tier requiredCssVars 판독`

- [ ] **step-5 — 통합 E2E + 사용자 관측 (human gate)**
  - Artifact: 사람이 라이트/다크 양쪽을 보고 통과시킨다
  - Files: `evidence/dark-inversion-cleanup/m31-scrim-token.md`
  - Dependencies: step-1, step-2, step-3, step-4
  - Verify: 사이트 `npm run build` + prerender 수 대조 · oxlint 0 · llms-sync PASS ·
    실브라우저에서 **모달 4종**(auth-gate · action-sheet · bottom-sheet · colors 라이트박스)을 라이트/다크로 관측 ·
    스크린샷 라이트 2장·다크 2장 이상 · C2 작은 컨트롤이 그대로인지 같은 화면에서 확인
  - Failure probe: 다크 스크림 농도 기각 시 step-2 Risk 경로로 되돌아온다(토큰 재설계 아님)
  - Risk: 위험 (기계 게이트 통과가 완료가 아니다 — M29 에서 전 게이트 통과 상태를 실표면 구동만이 잡았다)
  - Commit: `docs(m31): 통합 E2E + 관측 evidence`

- [ ] **step-6 — 출고·배포 + 라이브 재현 (human gate)**
  - Artifact: 라이브에서 이식처가 나빠지지 않은 채 고쳐진다
  - Files: `packages/cli/package.json`(0.4.3) · `changesets/20260806-m31-dark-inversion-cleanup/README.md`
  - Dependencies: step-5
  - Verify: **순서 고정 — CLI 0.4.3 npm 출고 먼저, registry 배포 나중**(D5) ·
    `npm pack --dry-run` 파일수·크기 예상 밖 증감 없음 · 배포 후 빈 vite 에서 킥스타트 → **`auth-gate-modal` 을
    수동 렌더**해 다크 확인(이 asset 은 component tier 라 `--block` 경로가 아니다 — 검증자 경미 ⑥) ·
    브랜드 CSS 에 `--scrim` 실재 확인
  - Failure probe: 순서를 뒤집으면 어떻게 되는지 **문서로 남긴다**(실행하지 않는다) — 되돌림 불가 위험
  - Risk: 위험 (0.4.2 이하에 고정된 프로젝트가 새 asset 을 받으면 여전히 백드롭이 빈다 — 출고로 해소되지 않는 잔여 위험이라 changeset 에 명시)
  - Commit: `chore(cli): 0.4.3 — scrim 토큰 이식 배선` + `docs(m31): changeset`

## 검증/DoD

**DoD**: 다크에서 모달 백드롭이 어두워지고(밝아지지 않고) 전체면 반전 4곳이 흰 판때기가 아니며,
**라이트 렌더는 픽셀 무변화**다. 스크림은 `tokens/askewly.tokens.json` 단일 SSOT 에서 나오고,
킥스타트로 이식된 프로젝트와 라이브 registry asset 에도 실린다. 선언이 빠지면 **검사가 잡는다**(구멍이 닫힌다).
C2 작은 컨트롤 · C3 · 불가침 2건 · 블록 3종은 무변경.

**실패 모드 5항** (각각 실제로 평가한다):
1. `@theme inline` 누락 → `bg-scrim` 이 조용히 버려져 스크림이 **투명**해진다 (빌드는 통과) — step-1 probe 로 실증
2. `requiredCssVars` 판독 구멍 → 선언해도 아무도 안 읽어 이식처에서 백드롭이 사라진다 — step-4 probe
3. 라이트 회귀 → D4 의 "픽셀 무변화" 가정이 틀렸다면 step-2 스크린샷 대조에서 잡힌다
4. 다크 분리감 부족 → 어두운 스크림 + 어두운 배경. step-5 관측에서만 잡힌다
5. 범위 초과 → `term-visual.tsx` 25곳 중 4곳만, `bg-foreground` 전역 치환 금지

**E2E 표면**: 웹 — 개발서버 + 실브라우저(라이트/다크 양쪽) + 배포 후 라이브 이식 재현 1회.

## 수치 출처

- 스크림 8곳/7파일 — 2026-08-06 `Grep` 전수 + 용법별 수기 판정(artifact `dd8a59f4`), **줄번호 8곳 + 전체면 4곳 검증자 실측 확인**. C2 작은 컨트롤·C3 총계는 미검증(범위 밖이라 계약 무관)
- `gray.12 = oklch(0.16 0.015 270)` = 라이트 `--foreground` — `tokens/askewly.tokens.json:20` ↔ `src/tokens.css:5`
- `surface.overlay` 선점 — `tokens/askewly.tokens.json:92-96`
- `requiredCssVars` 위치·판독 범위 — `registry.json:147,183,547` · `kickstart.ts:584`
- `renderBrandCss` 의 `@theme inline` — `kickstart.ts:272-303`
- `packages/cli/data/` gitignored — `packages/cli/.gitignore:3`
- docs-site 블록 이식 파일 6개에 스크림 0건 — `public/r/docs-site.json` 실측
- DM3 선례 — `docs/reports/2026-07-31-dm3-dark-mode-activation.md:11` · 레포 자체 규정 — `src/lib/documentation-pages.ts:1342`

## finding 큐

- 반전 오용 lint 룰(용법 분류 자동화) — 오탐 위험이 커 이번 범위 밖
- C2 작은 컨트롤의 "의도" 근거가 대화에만 있다 → design-system 문서에 반전 문법 절 신설 후보
- 0.4.2 이하 고정 프로젝트의 잔여 위험 — 버전 하한 안내를 킥스타트가 인쇄할지 검토

## 진행 로그

- **step-1 완료 (2026-08-06)** — `color.semantic.surface.scrim` = `{color.primitive.gray.12}`, 다크 오버라이드 없음.
  `--scrim: oklch(0.16 0.015 270)` 이 `:root` 에만 실리고 `.dark{}` 에는 **0건**(의도대로 `hasDarkOverride` 가 제외).
  값이 라이트 `--foreground`(`tokens.css:5`)와 **완전 일치** — 픽셀 무변화 기준선 확보.
  생성기 2회 실행 diff 무변화(멱등) · 토큰 lint parse/schema/alias/contrast 전건 PASS · llms-sync PASS.
  **Failure probe 는 step-2 로 이월** — Tailwind 는 JIT 라 사용처가 0이면 `@theme inline` 유무와 무관하게
  `.bg-scrim` 이 안 생긴다. 유틸 누락 실증은 사용처가 생긴 뒤에야 의미가 있어 step-2 에서 수행한다.
  커밋 `feat(tokens): scrim semantic 토큰 신설`.
- **step-2 완료** — 8곳 전부 1:1 치환, 불투명도 `/20 /35 /50 /72` 원값 보존, 부수 변경 0.
  **Failure probe 성립** — `@theme inline` 의 `--color-scrim` 을 빼고 빌드하면 exit 0 · prerender 759 로
  통과하는데 `.bg-scrim` 유틸이 **0개**로 사라진다(백드롭 투명화, 경고 없음). 실패 모드 ① 실증.
  verify 는 내 변경발 위반 **0건**(scrim 매칭 0). ⚠ 계획의 "verify 0건"은 이 레포 `src` 전체 기준으로는
  성립하지 않는다 — 기존 위반 153건(glow-points hex·kakao 브랜드 상수 등)이 이미 있다. 판정 기준을
  "내 변경이 새 위반을 넣지 않았는가"로 읽었다. 커밋 `fix(dark): 모달 백드롭 8곳`.
- **step-3 완료** — 4줄(4+/4-), `bg-foreground` 총 출현수 25 불변(나머지 21곳 무변경).
  `tsc --noEmit` 0 · build 0 · prerender 759. 커밋 `fix(dark): 전체면 반전 목업 4곳`.
- **step-4 완료** — `renderBrandCss` 가 `--scrim` 을 `:root` 에 1회 + `@theme inline` 에 `--color-scrim`.
  값은 `c.dark.bg`(그 프로젝트 캔버스의 다크 배경) — 레포 자신의 규칙(scrim = gray.12 = 다크 배경)과 동형.
  `requiredCssVars` 를 `resolve()` 재귀 전체에서 수집하도록 확장해 component tier 구멍을 닫았다.
  vitest **83/83**(신규 3) · tsc 0 · registry diff 4파일, 나머지 53종 무변경 · build:data 통과.
  ⚠ **전이 판독의 실발화 증거는 step-6 으로 이월** — asset regDeps 가 라이브 절대 URL 이라
  선언이 배포되기 전에는 로컬에서 그 경로가 돌지 않는다(승계 계약). 커밋 `feat(cli): 이식 경로에 scrim 배선`.
