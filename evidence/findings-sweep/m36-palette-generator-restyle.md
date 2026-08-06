# M36 — `color-palette-generator` 이식 표면 restyle · evidence

> 2026-08-06 · plan: `plans/2026-08-06-m36-palette-generator-restyle.md` · changeset: `changesets/20260806-m36-palette-generator-restyle/`

## step-1 — chrome restyle (커밋 `3746aad`)

- 치환 실측: `ring-askewly-violet` 6→0 · `slate-*` 색 유틸 50→0 · `bg-white`(chrome) 12→0 · `border-blue-500` 1→0.
  잔존 백색 6곳은 전부 스와치·그라디언트 **위** 오버레이(액션 필·hex 라벨 hover·shade 포커스/도트 링·픽커 핸들 2) —
  임의 색 위 대비 장치로 의도 고정, 파일 docstring + 주석 명시.
- 다크 잉크 칩(툴팁·토스트)은 사이트 idiom `bg-foreground text-background`(colors-page 토스트 동일) ·
  export 백드롭은 M31 신설 `bg-scrim/72`.
- Verify: oxlint · `lint:colors --max 0`(0건) · build · prerender 759 라우트 PASS · 콘솔 에러 0.
- 실브라우저: 라이트 기본/포커스, 다크 포커스/픽커/export 모달 + **전/후 다크 비교**(restyle 전 바텀레일이
  다크에서 흰 판때기 — stash 왕복으로 재현 촬영). 사용자 관측 **통과**(Artifact 제시, "ㄱㄱ").

## step-2 — 실측 선언 · 테스트 반전 · 라이브 실증 (커밋 `1a5e14c`)

- 선언 전사: `meta.requiredCssVars` 5종(구, `--askewly-violet` 포함) → **14종**
  (`--accent --background --border --card --card-foreground --foreground --input --muted --muted-foreground
  --popover --popover-foreground --radius --ring --scrim`). `--print-measured` 실측과 **집합 일치**(excess 0·missing 0).
- 게이트 실효 확인: 전사 전 `generate-registry.mjs` 가 신규 10종 누락으로 **실패**(M32 게이트가 실전에서 물었다).
- gap 테스트 반전: M32 의 documented-gap 테스트(하드코딩 — registry 를 읽지 않아 restyle 후에도 실패하지 않는
  no-op 임을 probe 로 확인·기록)를 **실 registry 판독 2건**으로 교체 — ① 선언에 브랜드 전용 토큰 부재
  ② 요구 전건이 `renderBrandCss` 출력에 정의. 왕복 probe: 선언에 `--askewly-violet` 임시 주입 시 **실패**, 복원 시 통과.
  vitest **90/90**.
- llms: M35 잔여 drift(`figma-bridge-contract.md`) 함께 재생성, `check-llms-sync` **PASS**.
- 라이브: push 후 CF Pages 폴링 **10회 ≈ 5분** 반영(M32 9회·M31 4회 — 회차별 변동 기록).
  라이브 JSON: `ring-ring` 존재 · `askewly-violet` **0** · 선언 14종 일치.
- 소비처 실증(빈 vite + 킥스타트 + 라이브 JSON `files[].content` 이식 + regDeps `palette-generator-core`):
  - `askewly-brand.css` 가 요구 14종 **전건 정의**(미정의 0), `--askewly-violet` 미정의(= 구 코드였다면 링 투명).
  - 실브라우저 키보드 Tab: `:focus-visible` 매치, ring **`rgb(98,49,196) 0 0 0 2px`** — 포커스 링이 소비처에서
    실제로 보인다(결함 해소의 직접 증거). 스크린샷: 세션 scratchpad `m36-consumer-focus.png`.

## 부수 발견 (finding 큐 → findings.md 이관 대상)

- `generate-registry.mjs --print-measured` 가 **파괴적** — 시작 시 `public/r/` 를 지우고(`:207`) index(`:392`)를
  쓰기 전에 종료해 `public/r/registry.json` 이 삭제된 채 남는다.
- 그 상태에서 `generate-llms-txt.mjs` 의 `assetFor` 가 **조용히** 빈 registry 로 동작 — 레시피 STOP 배너 32건
  전멸(오류 없음). 이번 run 에서 실측 재현·복구. 하드 실패로 바꿀 후보.
- 다크에서 파스텔 스와치 위 hex 라벨 흐림 — `getReadableTextColor` 가 테마 변수 반환(기존 동작, restyle 무관).
