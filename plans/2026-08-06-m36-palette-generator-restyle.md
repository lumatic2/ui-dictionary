# PLAN — M36: `color-palette-generator` 이식 표면 restyle

> 생성: 2026-08-06 · 갈래: goal `findings-sweep` (단독) · scope: M32 가 발견하고 범위 밖이라 남긴 결함 —
> 이식 asset `color-palette-generator` 가 사이트 전용 브랜드 토큰(`--askewly-violet`)과 토큰 밖 색(`slate-*`·white 계열)을
> 쓰는 것을 semantic 토큰으로 restyle 하고, 실측 선언·CLI gap 테스트·라이브 실증까지 닫는다.
Status: approved (사용자 승인 2026-08-06 "나머진 ㄱ" — M36 단독. `/pt` 슬롯 계약(구 연쇄 2/2)은
사용자 보류: "왜 건드는지 맥락을 모르겠다" — 맥락 공유 후 별도 작업으로 재상정. 계획 검증자 1회 반영 완료)

## 북극성 → milestone → step (위계)

북극성의 **"이식 가능한 제품"** 축이다. 이 asset 은 registry 를 타고 남의 레포로 나가는 이식 파일인데,
소비처에 존재하지 않는 `--askewly-violet` 을 요구해 **포커스 링이 투명해진다** — 접근성 실결함이 이식과 함께 배달된다.
M32 는 이식 파일 내용 변경이 범위 밖이라 CLI 테스트로 gap 만 고정했다(`kickstart.test.ts:271`). 이번에 내용을 고친다.

## run 전 scope 결정

- **포함**: ① `examples/ui-vocabulary-site/src/components/color-palette-generator.tsx` 1개 파일의 chrome 을
  semantic 토큰으로 restyle(사이트 렌더 + 사용자 관측 포함) ② registry 실측 선언 재생성 + CLI gap 테스트 반전 +
  라이브 배포·소비처 실증.
- **제외**: 다른 이식 파일·사이트 전역 verify 위반 sweep(D2) · 팔레트 로직(`palette-generator-core`) 변경 ·
  토큰 SSOT 변경 · 반전 오용 lint 룰(보류 유지, M32 D1 승계) · CLI 코드 변경(테스트만 손댄다 — 출고 없음 예상).
- **연쇄**: 없음 — M37(`/pt` 슬롯 계약)은 사용자 보류(2026-08-06). 완주 시 `/harness-done`.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  **human gate 1개** — step-1 의 사용자 관측(UI 변경이므로 스크린샷 제시 후 확인, askewly-design 계약).
- rollback/cleanup: 커밋 단위 revert. `public/r/*.json`·`public/llms/` 는 생성물 — 정본
  (`registry.json`·소스 tsx) 되돌린 뒤 재생성. 라이브 반영 후 되돌리면 그 사이 받아간 소비처는 옛 파일을
  갖지만, 이번 변경은 결함 수리라 옛 판이 더 나쁜 상태다(전진 수리 우선).

## 스캐폴딩 결정

- source-of-truth: 이식 파일 정본 = `examples/ui-vocabulary-site/src/components/color-palette-generator.tsx`
  (registry JSON 은 생성물 — `scripts/generate-registry.mjs` 가 소스에서 content 를 뽑는다).
  선언 정본 = `registry.json` 의 `meta.requiredCssVars`(비블록 경로, M32 계약 ①). semantic 토큰 어휘 정본 =
  사이트 `src/tokens.css` + CLI `renderBrandCss` 가 정의하는 소비처 변수 집합(M32 실측: 61종 정의).
- 검증: 사이트 `npm run lint`(oxlint + `lint:colors --max 0` + llms sync) + `npm run build` +
  `node scripts/generate-registry.mjs`(M32 게이트 — 선언<실측이면 실패) + `packages/cli` vitest +
  실브라우저 렌더 스크린샷. **통합 검증** = 라이브 반영 후 소비처 시뮬레이션에서 요구 변수 전건이
  `renderBrandCss` 출력에 정의되고(`--askewly-violet` 요구 소멸), 포커스 링이 실제로 보인다.
- 배포/운영: registry = CF Pages(`public/r/`) — push 로 반영, 폴링 확인(M32 실측 9회 ≈ 4분). CLI 출고 없음
  (코드 무변경 — 테스트만). push 는 결함 수리 특성상 이 milestone 안에서 실행(D3), 나머지 커밋은 세션 일괄.
- 자기선언 도메인 — **restyle 치환 규칙**: chrome(패널·버튼·테두리·팝오버·툴팁)은 semantic 토큰으로 —
  `slate-200→border` · `bg-white→bg-background|bg-card` · `slate-950→foreground`(강조면은 `primary` 계열 판단) ·
  `slate-500/600/700→muted-foreground` · `ring-askewly-violet→ring-ring`. 다크에서도 성립해야 하므로
  고정 명도 가정(흰 패널 위 진회색 글자)을 토큰 짝(`card`/`card-foreground`)으로 옮긴다.
- 자기선언 도메인 — **사용자 색 위 오버레이는 예외**: 스와치(임의 팔레트 색) **위에** 얹히는 핸들 링
  (`ring-white/80`)·`text-current`·`bg-white/18` 류는 토큰이 아니라 **콘텐츠 위 대비 장치**라 의도된 고정색이다.
  소스 주석("Swatch colors are user content — the chrome stays on semantic tokens")의 경계를 그대로 계약으로
  삼는다 — chrome=토큰, 콘텐츠 오버레이=고정색 허용(사유 주석 유지). verify 가 이 예외를 위반으로 부르면
  기존 사유 마커 관례(M1 선례)로 표시한다.
- 자기선언 도메인 — **선언 갱신은 실측 전사(轉寫)로 한다** (계획 검증자 반증 반영): 생성기는 선언을
  **대조만 하고 쓰지 않는다** — `registry.json` 에 쓰는 코드 경로가 없고, 초과 선언(옛 `--askewly-violet`)은
  게이트를 통과한다(`generate-registry.mjs:144-154` — 누락만 실패). 따라서 restyle 후
  `node scripts/generate-registry.mjs --print-measured` 의 실측 출력을 `meta.requiredCssVars` 에 **그대로
  옮겨 적는다**(창작·취사 금지). 갱신 후 게이트 재실행(누락 0) + 선언==실측 집합 일치를 diff 로 확인.
- 검토 후 제외: 사이트 전역 위반 sweep(D2 — 이식되지 않는 화면은 이번 결함이 아니다) ·
  다크 전용 별도 스타일 분기(토큰이 이미 두 모드를 안다) · `--askewly-violet` 를 소비처 CSS 에 추가하는 방향
  (브랜드 토큰을 남의 레포에 심는 것은 북극성의 "브랜드 복사 금지"와 충돌 — 요구를 없애는 쪽이 맞다).

## 결정 로그

- status: resolved
- (사용자 소유 D2·D3 은 추천안으로 사전 소진 — 승인 제시에 병기해 확정받는다)

- **D2 — restyle 범위 [사용자 소유]**: **파일 1개 한정 (추천)**. 근거: 소비처 실결함은 이 파일뿐이고,
  전역 sweep 은 이식되지 않는 화면까지 건드려 관측 비용이 커진다. 다른 위반은 finding 장부가 이미 안다.
- **D3 — 라이브 배포·실증 포함 [사용자 소유]**: **포함 (추천)**. 근거: M32 D2 선례 — asset regDeps 가
  라이브 절대 URL 이라 로컬 서빙으로는 이식 실증이 안 된다. push 1회가 이 milestone 안에서 발생한다.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① 치환 규칙·오버레이 예외는 스캐폴딩 결정에 고정 — 실행 중 색 단위 재질문 없음(경계 애매 케이스는
    "임의 색 위인가?"로 판정: 위면 고정색, 아니면 토큰).
  - ② `kickstart.test.ts:271` 의 gap 고정 테스트는 **반전**한다 — "askewly-violet 이 미정의로 남는다"에서
    "요구 목록에 브랜드 전용 변수가 없다 + 요구 전건이 `renderBrandCss` 출력에 정의된다"로.
  - ③ CLI 출고 없음 — `packages/cli/src` 무변경, 테스트만 변경. (src 변경이 필요해지면 decision_required 로 정지.)
- **위임 결정**: **skip** — 단일 파일 restyle, 판정 축(토큰 어휘·예외 규칙)이 계획에 고정돼 있다.
  계획 검증자 1회는 승인 전 수행.

## 재생성 장벽

- **step-2**: restyle 커밋 후 `node scripts/generate-registry.mjs` → `public/r/` 재생성(선언 실측 갱신 동시).
  llms 자산 목록에 이 파일이 걸려 있으면 `node scripts/generate-llms-txt.mjs` 도 재실행(`check-llms-sync.mjs` 가 판정).
- **step-2**: 라이브 반영은 즉시가 아니다 — CF Pages 폴링(M32: 9회 ≈ 4분) 후에만 소비처 실증.

## Step 트리

- [ ] **step-1 — chrome restyle + 사이트 렌더 관측 (human gate)**
  - Artifact: 이식 파일의 chrome 이 semantic 토큰만 쓰고(오버레이 예외는 사유 주석), 사이트에서 라이트·다크
    양 모드 렌더가 관측을 통과한다
  - Files: `examples/ui-vocabulary-site/src/components/color-palette-generator.tsx`
    (실측 위반: `ring-askewly-violet` 6 · `slate-*` 유틸 50 · `bg-white` 12 · `text-white` 7 · `ring/border-white` 4 —
    이 중 오버레이 예외분을 뺀 나머지가 치환 대상)
  - Dependencies: 없음
  - Verify: `npm run lint` PASS · `npm run build` PASS · 치환 후 브랜드 전용·`slate-*` 클래스 grep 0
    (오버레이 예외는 사유 주석 동반) · 실브라우저 라이트/다크 렌더 스크린샷 ≥2장 콘솔 에러 0 ·
    **사용자 관측 통과**(포커스 링 포함 — Tab 이동 스크린샷)
  - Failure probe: 다크 모드에서 팝오버·바텀레일이 깨지는지 실브라우저로 확인 — 고정 백색 패널을 토큰으로
    옮기면 다크에서 처음으로 어두운 판이 되므로, 대비 역전(어두운 판 위 어두운 글자)이 가장 개연성 높은 실패다
  - Risk: 위험 (관측 기각 시 치환 짝을 바꿔 재생성·재관측 — 파일 국소라 되돌림이 싸다)
  - Commit: `fix(site): color-palette-generator chrome 을 semantic 토큰으로 restyle`

- [ ] **step-2 — 실측 선언 재생성 + gap 테스트 반전 + 라이브 실증**
  - Artifact: 선언이 새 실측을 반영하고(`--askewly-violet` 요구 소멸), gap 테스트가 "요구 전건 정의됨"을
    지키는 방향으로 반전되며, 라이브 소비처 실증이 증거로 남는다
  - Files: `examples/ui-vocabulary-site/registry.json`(`--print-measured` 실측 전사 — 위 스캐폴딩 결정) · `public/r/*.json`(재생성) ·
    `packages/cli/test/kickstart.test.ts`(반전) · `evidence/findings-sweep/m36-palette-generator-restyle.md` ·
    `changesets/20260806-m36-palette-generator-restyle/README.md`
  - Dependencies: step-1
  - Verify: `node scripts/generate-registry.mjs` PASS + 2회 실행 diff 0(멱등) ·
    선언==`--print-measured` 실측 **집합 일치**(초과 선언 잔존 검사 — 게이트는 초과를 못 잡는다) ·
    `color-palette-generator` 의 `meta.requiredCssVars` 에 `--askewly-violet` 부재 + 잔여 전건이
    `renderBrandCss` 출력에 정의됨(vitest) · `packages/cli` vitest 전건 PASS ·
    `node ../../scripts/check-llms-sync.mjs` PASS · push → CF Pages 폴링 반영 확인 ·
    라이브 `public/r/color-palette-generator.json` 의 content 에 `askewly-violet` grep 0 ·
    빈 vite 소비처 시뮬레이션에서 브랜드 CSS 대비 요구 변수 **미정의 0** + 포커스 링 실측(브라우저 Tab 스크린샷)
  - Failure probe: 반전 전 테스트를 새 registry 로 돌려 **실패하는 것**을 먼저 확인한다(테스트가 결함을
    실제로 물고 있었는지) — 실패하지 않으면 gap 테스트가 애초에 no-op 이었던 것이므로 그 사실을 기록
  - Risk: 기계적 (선언 손 편집은 실측 출력 전사뿐 — 창작 없음, 집합 일치 diff 로 봉인)
  - Commit: `fix(registry): palette-generator 실측 선언 갱신 + gap 테스트 반전` · `docs(m36): changeset + evidence`

## 검증/DoD

**DoD**: 이식 파일 chrome 이 semantic 토큰만 쓰고(콘텐츠 오버레이 예외는 사유 주석으로 명시),
`meta.requiredCssVars` 에서 브랜드 전용 변수가 사라지며, 요구 전건이 소비처 브랜드 CSS 에 정의됨이
테스트로 고정된다. 라이브 registry 가 새 파일을 서빙하고, 소비처 시뮬레이션에서 포커스 링이 보인다.
사이트 라이트·다크 렌더는 사용자 관측을 통과한다.

**실패 모드 5항**:
1. 다크 모드 대비 역전 — step-1 probe(다크 실브라우저 확인)
2. 오버레이까지 토큰화해 스와치 위 대비가 죽음 — 예외 규칙을 스캐폴딩에 고정, 관측으로 확인
3. gap 테스트가 no-op — step-2 probe(반전 전 실패 확인)
4. 라이브 미반영 상태에서 실증 — 폴링 확인 후에만 소비처 실증
5. 초과 선언 잔존(`--askewly-violet` 이 선언에 남아도 게이트 통과 — 검증자 반증) — 선언==실측 집합 일치 diff 가 잡는다

**E2E 표면**: 웹 UI — 실브라우저 라이트/다크 렌더 + Tab 포커스 링 실측 (사이트 + 소비처 시뮬레이션 양쪽).

## 수치 출처

- 위반 실측 `ring-askewly-violet` 6 · `slate-*` 50 · `bg-white` 12 · `text-white` 7 · `ring/border-white` 4 —
  grep 계수 (2026-08-06, 파일 908줄)
- 현재 선언 `meta.requiredCssVars` = `[--askewly-violet, --background, --border, --foreground, --radius]` —
  `registry.json:779` 인근 실측
- gap 고정 테스트 위치 — `packages/cli/test/kickstart.test.ts:271-277`
- `renderBrandCss` 정의 61종·CF Pages 폴링 9회 ≈ 4분 — M32 evidence (`evidence/queue-drain/m32-required-css-vars.md`)
- 결함 등록 — `docs/findings.md` §G

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `findings-sweep` 연쇄 1/2.
- 2026-08-06 계획 검증자 반영 — 치명 1건: 생성기는 선언을 쓰지 않고 초과 선언을 통과시킨다 →
  "실측이 갱신" 전제를 "`--print-measured` 실측 전사 + 집합 일치 diff" 로 교체(실패 모드 5 신설).
