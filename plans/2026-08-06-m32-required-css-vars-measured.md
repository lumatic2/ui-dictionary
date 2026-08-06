# PLAN — M32: `requiredCssVars` 를 손 선언에서 실측으로

> 생성: 2026-08-06 · 갈래: goal `queue-drain` (1/4) · scope: 이식 계약 `requiredCssVars` 를 **사람이 쓰는 선언**에서
> **파일에서 뽑아낸 실측**으로 옮기고, 선언이 실측보다 좁으면 빌드가 잡게 한다. M31 이 남긴 후속 ⓐ·ⓑ 를 닫는다.
Status: approved (사용자 승인 2026-08-06 "ㄱㄱ" — goal `queue-drain` 연쇄 M32→M33→M34→M35 일괄 승인. 계획 검증자 1회 반영 완료)

## 큐 문구 정정 (착수 전 실사 + 계획 검증자 실측 2026-08-06)

핸드오프의 ⓐ 는 "상류 shadcn primitive(`ui/button`·`ui/input`)에 선언이 없다 — 붙이자"였다. **그대로는 실행 불가다.**
`button`·`input` 은 우리 registry 57종에 없고 kickstart 가 `SHADCN_BASE` + `/<name>.json` 원격에서 당겨온다
(`kickstart.ts:581`) — 남의 JSON 이라 우리 필드를 넣을 자리가 없다. ⓐ 의 실체는 "선언 추가"가 아니라
**"우리가 선언할 수 없는 의존이 검사 밖에 있다"** 는 경계 문제다.

**선언 보유 현황 (검증자 실측 정정)**: 57종 중 **5종**이 선언을 갖는다 — 블록 3종은 **top-level** `requiredCssVars`
(`saas-app-shell` 28 · `marketing-landing` 20 · `docs-site` 20), asset 2종은 **`meta.requiredCssVars`**
(`auth-gate-modal` 7 · `bottom-sheet-detents` 6, M31 이 손으로 넣음). 나머지 52종은 0이다.
(초안이 "2종뿐"이라 적은 것은 블록 3종의 top-level 키를 못 본 오류다 — 철회한다.)

**ⓑ 는 초안의 방식으로 증명되지 않는다 (검증자 반증 — 계획 변경).** 초안은 "8종 asset 이 실측 선언을 가지면
`marketing-landing` 합집합이 20보다 커진다"고 예측했으나, 그 8종이 실제로 쓰는 변수 합집합은
**`--background` `--card` `--foreground` `--muted` `--primary` 5개**이고 **블록이 이미 선언한 20의 부분집합**이다.
즉 실측을 도입해도 합집합은 20 그대로다. 따라서:

- **전이 판독이 "코드로 발화한다"는 증명은 단위 테스트(자식만 가진 변수를 둔 픽스처)로 한다** — 라이브 개수 증가가 아니라.
- **라이브에서는 "부분집합이다"라는 사실 자체를 실측으로 기록한다.** 그것이 오늘의 정직한 결론이다 —
  블록 선언이 자식 요구를 이미 덮고 있다는 뜻이고, 전이 판독은 *덮지 못하는 날*을 위한 방어선이다.

## 북극성 → milestone → step (위계)

북극성의 **"이식 가능한 제품"** 축이다. 이식된 코드가 색을 잃는 사고는 M31 에서 실제로 밟았고
(`@theme inline` 누락 → `bg-scrim` 조용히 소멸, 빌드는 통과), 그때 세운 방어선이 `requiredCssVars` 대조다.
그 방어선이 지금은 **사람이 빠짐없이 적었는가**에 의존한다 — 57종 중 5종만 적혀 있으므로 사실상 열려 있다.

## run 전 scope 결정

- **포함**: ① 이식 파일에서 CSS 변수 사용을 **실측 추출**하는 층 + 선언 대조 게이트(블록 경로·비블록 경로 **양쪽**)
  ② 57종 선언을 실측으로 채움 + 상류 shadcn 검사 경계 판정(측정 후 결론) + 전이 수집 단위 테스트
  ③ 배포(필요 시 CLI 출고) + 라이브 실측 기록.
- **제외**: 반전 오용 lint 룰(사용자 확정 2026-08-06 — **보류 유지**) · 토큰 SSOT 변경 · 새 asset·블록 추가 ·
  shadcn 상류 fork·vendoring · 이식 파일 **내용** 변경 · 큐의 나머지 3건(M33·M34·M35).
- **연쇄**: **M33 → M34 → M35**. 이 승인 1회로 큐 4건을 끝까지 간다.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  **human gate 1개** — step-3 배포 승인(CLI 출고가 필요해진 경우 npm publish 직전).
- rollback/cleanup: 커밋 단위 revert. **생성물 주의** — `public/r/*.json` 은 `generate-registry.mjs` 산출물이라
  손으로 되돌리지 않고 정본(`registry.json`) 되돌린 뒤 재생성. `public/llms/` 도 동일(`generate-llms-txt.mjs`).
  배포된 registry 는 되돌려도 그 사이 받아간 사람은 못 고치지만, 이번 변경은 **meta 뿐이고 이식 파일 내용은
  무변경**이라 위험이 낮다.

## 스캐폴딩 결정

- source-of-truth: 선언 정본 = `examples/ui-vocabulary-site/registry.json`(블록은 항목 top-level `requiredCssVars`,
  비블록은 `meta.requiredCssVars` — **두 경로가 다르다**, `generate-registry.mjs:132` vs `:206`/`:220`).
  `public/r/*.json`·`public/llms/` 는 생성물. 이식 경로의 변수 **정의** 정본은 `kickstart.ts` 의 `renderBrandCss`.
- 검증: 추출기 `--self-test`(레포 선례 = `figma-return-diff.mjs --self-test`) + `packages/cli` vitest(전이 수집 픽스처)
  + llms sync. **통합 검증** = 라이브 배포 후 빈 vite 에 `marketing-landing` 킥스타트가 예외 없이 끝나고,
  요구 변수 목록이 로컬 실측과 **집합으로 일치**함을 확인.
- 배포/운영: registry = CF Pages(`public/r/`), CLI = npm. **순서는 M31 D5 승계** — CLI 변경이 있으면 CLI 출고 먼저.
- 자기선언 도메인 — **추출 문법 2종만 센다**: ① `var(--x)` ② Tailwind 유틸의 토큰 이름
  (`bg-`·`text-`·`border-`·`ring-`·`from-`·`via-`·`to-`·`fill-`·`stroke-` + `@theme inline` 에 실재하는 토큰).
  임의 문자열 스캔 금지(주석·문서 문자열 오탐).
- 자기선언 도메인 — **실측은 선언을 덮어쓰지 않는다**: 생성기는 실측을 **채우고**, 손 선언이 있으면 **대조**한다.
  상위집합(넓게 적음)은 통과, **누락은 실패**.
- 자기선언 도메인 — **상류 shadcn 은 측정 후 판정**: `renderBrandCss` 가 shadcn 표준 변수 집합을 전부 정의하면
  상류는 구조적으로 안전하므로 **검사 경계로 문서화**하고 끝낸다. 빠진 것이 있으면 그때만 baseline 을 CLI 에
  추가하고 **0.4.4 를 낸다**(D3 이 그 분기까지 확정한다 — 실행 중 재질문 없음).
- 검토 후 제외: 반전 오용 lint 룰 · shadcn vendoring(유지보수 부채 > 이득) · 런타임 검사(빌드 타임으로 충분) ·
  블록 선언을 실측으로 **좁히는** 일(넓은 선언은 무해하고, 좁히면 소비처가 조용히 깨진다).

## 결정 로그

- status: resolved

- **D1 — 곁가지 ⓒ 반전 오용 lint 룰 [사용자 소유 · 확정 2026-08-06]**: **보류 유지.** 보류 사유만
  `docs/findings.md` 에 명문화하고 구현하지 않는다.
- **D2 — 배포 범위 [사용자 소유 · 확정 2026-08-06]**: **라이브 배포 + 실증까지.** 블록 JSON 의 asset regDeps 가
  라이브 절대 URL 이라 로컬 서빙으로는 애초에 실증이 안 된다(M31 실측).
- **D3 — 상류 baseline 이 필요해지면 CLI 를 출고할 것인가 [사전 확정 — 실행 중 재질문 없음]**: **출고한다(0.4.4).**
  근거: baseline 이 필요하다는 것은 이식처에서 변수가 빠질 수 있다는 뜻이고, 그 수정은 CLI 에만 있다.
  단 step-3 의 human gate(publish 직전 승인)는 그대로 적용된다.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **ⓐ 의 해석**을 "상류에 선언 추가"에서 "실측 도입 + 상류는 경계 판정"으로 바꾼다(위 정정 절).
  - ② **ⓑ 의 증명 방식**을 "라이브 합집합 증가"에서 "**단위 테스트 발화 + 라이브 부분집합 실측 기록**"으로
    바꾼다(검증자 반증 반영).
  - ③ **실측은 생성기(빌드 타임)에 둔다** — CLI 는 이미 전이 수집을 한다(`kickstart.ts:578`). 양쪽에 두면 두 벌 관리.
  - ④ **누락은 실패, 초과는 통과.**
  - ⑤ **게이트는 두 경로 모두** — 블록(`:132`)만 걸면 비블록 54종이 검사 밖에 남는다(검증자 C3).
- **위임 결정**: **skip** — 표면이 좁고 판정이 기계적이다. 계획 검증자 1회는 수행 완료(치명 5건 반영).

## 재생성 장벽

- **step-2 이후**: `node scripts/generate-registry.mjs` → `public/r/` 재생성.
  `block-contract.md` 를 고치면 **반드시** `node scripts/generate-llms-txt.mjs` → `public/llms/` 재생성
  (이 문서는 `generate-llms-txt.mjs:63` 의 고정 자산이라, 빠뜨리면 다음 milestone 의 llms sync 게이트가 터진다 — 검증자 C4).
- **step-3**: 라이브 반영은 즉시가 아니다(M31 실측: 폴링 4회 ≈ 2분).

## Step 트리

- [x] **step-1 — 실측 추출 + 대조 게이트 (두 경로)**
  - Artifact: 이식 파일이 실제로 쓰는 CSS 변수를 뽑아내고, 선언이 그보다 좁으면 생성이 실패한다
  - Files: `scripts/generate-registry.mjs`(추출 함수 + 대조 + `--self-test` 플래그 — 블록 경로 `:132` 와 비블록 경로 `:206`/`:220` 양쪽)
  - Dependencies: 없음
  - Verify: `node scripts/generate-registry.mjs --self-test` 픽스처 통과(양성: `var(--scrim)`·`bg-scrim/50` 검출 / 음성: 주석·문자열 리터럴 무검출) · 생성기 2회 실행 `git diff` 무변화(멱등) · **선언 채우기 전 57종 산출 무변경**(게이트만 도입한 상태)
  - Failure probe: ① `auth-gate-modal`(비블록 경로)과 ② `marketing-landing`(블록 경로) 각각에서 선언 1개를 빼고 생성 → **두 경로 모두** 게이트가 잡는지. 한쪽만 잡히면 C3 가 재현된 것이다
  - Risk: 기계적 (정적 추출은 동적 클래스 조합을 못 잡는다 — 한계를 self-test 와 계약 문서에 고정)
  - Commit: `feat(registry): requiredCssVars 실측 추출 + 선언 대조 게이트`

- [ ] **step-2 — 57종 선언 채우기 + 상류 경계 판정 + 전이 발화 테스트**
  - Artifact: 선언이 실측과 일치하고, 전이 수집이 코드로 발화함이 테스트로 증명된다
  - Files: `examples/ui-vocabulary-site/registry.json` · `public/r/*.json`(재생성) ·
    `docs/design-system/block-contract.md` **§4 "Restyle obligation — required CSS variables"**(실측 규약·정적 추출 한계·**상류 shadcn 검사 경계**) ·
    `public/llms/`(재생성) · `packages/cli` vitest 픽스처(자식만 가진 변수를 선언한 registry item) ·
    (측정 결과 필요할 때만) `packages/cli/src/kickstart.ts` baseline
  - Dependencies: step-1
  - Verify: 57종 전건 생성 통과 · **전이 발화 테스트** — 자식에만 있는 변수가 `resolve()` 합집합에 들어오는지 vitest 로 확인 · `marketing-landing` 합집합을 **실측해 기록**(예상: 20 유지 = 자식 요구가 블록 선언의 부분집합) · `renderBrandCss` 출력이 그 합집합을 전부 정의(미정의 0)를 단위 테스트로 고정 · 상류 shadcn 표준 변수 대조 결과를 **수치로 기록**(빠진 개수 0이면 경계 문서화로 종료, 아니면 D3 대로 baseline+출고) · `node scripts/check-llms-sync.mjs` PASS · 이식 **파일 내용 diff 0**(meta 만 변경)
  - Failure probe: 픽스처에서 자식 선언을 비우면 합집합이 줄어드는지 — 줄지 않으면 전이 수집이 실제로는 안 도는 것이다(M31 의 no-op probe 재발 검사)
  - Risk: 위험 (과다 검출 시 소비처가 불필요한 변수를 요구받는다 — 증가분을 이름 단위로 확인, 미정의 1개라도 나오면 정지)
  - Commit: `feat(registry): 57종 requiredCssVars 실측 반영 + 상류 검사 경계 명문화`

- [ ] **step-3 — 배포 + 라이브 실측 (human gate)**
  - Artifact: 라이브 이식 경로가 실측 선언 위에서 정상 동작하고, 그 수치가 증거로 남는다
  - Files: `evidence/queue-drain/m32-required-css-vars.md` · `changesets/20260806-m32-required-css-vars-measured/README.md` ·
    (CLI 변경이 있었을 때만) `packages/cli/package.json` 0.4.4
  - Dependencies: step-2
  - Verify: 순서 고정(CLI 변경 있으면 출고 먼저, registry 나중) · push → CF Pages 반영 **폴링 확인** ·
    빈 vite react-ts 에서 `npx --yes @askewly/design init <dir> --block marketing-landing --color violet --yes` 가 예외 없이 완료 ·
    출력 `required CSS variables: N/N defined` 의 N 과 **생성된 `askewly-brand.css` 실물**을 대조해 요구 변수 전건이 정의돼 있음을 확인(출력만으로는 미정의를 알 수 없다 — 미정의는 예외로만 드러난다, `kickstart.ts:645-649`) ·
    N 이 로컬 실측 합집합과 **집합으로 일치**
  - Failure probe: 선언 1건이 라이브에 **아직 반영되기 전**에 한 번 재현해 두고, 반영 후 재현과 대조한다. 두 값이 같으면 "부분집합이라 개수가 안 변한다"는 step-2 결론이 라이브에서도 확인된 것이고, 다르면 그 차이가 전이 발화의 라이브 증거다 — **어느 쪽이든 결과를 그대로 기록**한다(원하는 답을 만들지 않는다)
  - Risk: 위험 (라이브 반영 지연으로 전후 대조가 오염된다 — 폴링으로 반영 확인 후에만 후측정)
  - Commit: `docs(m32): changeset + 라이브 실측 evidence`

## 검증/DoD

**DoD**: `requiredCssVars` 가 이식 파일 실측에서 나오고, 선언이 실측보다 좁으면 **빌드가 실패**한다
(블록·비블록 **양 경로**). 57종이 실측 선언을 갖고, 전이 수집이 **테스트로 발화**함이 증명되며,
라이브 킥스타트가 예외 없이 끝나고 요구 변수 전건이 브랜드 CSS 에 정의돼 있다. 상류 shadcn 의존은
검사 안에 들어오거나(baseline+0.4.4) 검사 밖임이 계약 문서에 명문화된다. **이식 파일 내용은 무변경.**

**실패 모드 5항**:
1. 정적 추출 한계 → 동적 클래스 조합을 놓친다. self-test 로 한계 고정 + 문서화
2. 한쪽 경로만 게이트 → 비블록 54종이 검사 밖(검증자 C3). step-1 probe 가 두 경로를 다 친다
3. 전이 수집이 실제로는 안 돈다 → step-2 픽스처 probe
4. llms 재생성 누락 → 다음 milestone 의 sync 게이트가 터진다(검증자 C4). 재생성 장벽에 명시
5. 라이브 미반영 → 전후 대조 오염. 폴링 확인 후 후측정

**E2E 표면**: CLI — 빈 프로젝트 실제 킥스타트 실행 + 생성 파일 실측 (배포 전/후 2회).

## 수치 출처

- 선언 보유 **5종**(블록 top-level 3: 28·20·20 / asset meta 2: 7·6), 나머지 52종 0 — `examples/ui-vocabulary-site/registry.json` 실측(계획 검증자 2026-08-06)
- 8종 asset 실사용 변수 합집합 **5개**(`--background --card --foreground --muted --primary`), 블록 선언 20의 부분집합 — 검증자 실측
- `marketing-landing` 요구 20개·askewly asset 8종 — `public/r/marketing-landing.json`
- 상류 원격 해석 `kickstart.ts:581` · 전이 수집 `:578` · 요구 변수 출력/예외 `:645-649`
- 선언 복사 경로 — 블록 `scripts/generate-registry.mjs:132` · 비블록 `:206`/`:220`
- `block-contract.md` 의 required CSS var 절 = **§4** · llms 고정 자산 등재 — `scripts/generate-llms-txt.mjs:63`

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `queue-drain` 연쇄 1/4.
- **step-1 완료 (2026-08-06)** — `extractCssVars` + `stripComments` + `assertDeclarationCoversUsage` 를
  `scripts/generate-registry.mjs` 에 넣고 블록(`buildBlock`)·비블록 양 경로에 배선. `--self-test` **8/8**,
  생성기 2회 실행 `public/r/` **diff 0**(멱등 + 선언 채우기 전 산출 무변경).
  **Failure probe 양 경로 성립** — `auth-gate-modal` 에서 `--scrim`(비블록), `marketing-landing` 에서
  `--primary`(블록) 를 빼자 각각 exit 1 로 잡혔다.
  ⚠ **계획 Verify 문구 1건 정정** — "음성: 주석·**문자열 리터럴** 무검출"에서 문자열 쪽은 성립하지 않는다.
  className 자체가 문자열이라 배제하면 실검출이 죽는다. 주석만 제거하고(`stripComments` — URL 의 `//` 를
  자르지 않게 따옴표 상태 추적), 문자열은 센다는 것을 self-test 에 **한계로 고정**했다.
  ⚠ **추출기가 첫 실행에서 오검출 3건을 냈다**(`saas-app-shell`: `--color-desktop`·`--color-mobile`·`--spacing`).
  원인은 ① 파일이 스스로 정의하는 변수 ② Tailwind 내장(`--spacing`) ③ shadcn chart 가 런타임 주입하는
  `--color-<series>`. 셋 다 소비처가 정의할 대상이 아니라 제외 규칙을 넣었다 — `--color-*` 는 테마에 실재하면
  가리키는 변수로 치환(`--color-scrim`→`--scrim`), 아니면 버린다. 커밋 `feat(registry): requiredCssVars 실측 추출`.
- 2026-08-06 계획 검증자 반영 — 치명 4건(선언 수 5종 정정 · ⓑ 증명 방식 전환 · 비블록 경로 게이트 · llms 재생성 장벽) + 경미 5건(§4 위치·self-test 관례·evidence 파일·출력 해석·vitest 신호).
