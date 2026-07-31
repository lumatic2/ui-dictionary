# PLAN — HU2: 모션 문법 + 표현 규율 (fragment·모션/폰트/anti-slop 규율·bento 레이아웃)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `html-upgrade` 2/4.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 2회 발견 7건 반영 후 일괄 승인, chain hu1→hu2→hu3→hu4)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `html-upgrade` 2/4 — "발표하는 느낌"의 핵심인 **단계 공개(fragment)** 가 현행 트랙에 없다(슬라이드 진입 애니메이션만 존재). 모션·폰트 규율에 더해 **AI-slop 회피 규율**(사용자 확장 요청 2026-07-31 — "AI slop 느낌 덜 나게, 아이콘도 깔끔한 거")을 계약+린트로 명문화하고, 리서치 트렌드 레이아웃(bento grid) 1종을 추가한다.
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §1(reveal.js fragment/Slidev click — 차용 1순위)·§2-5(GPU 속성·stagger 상한·reduced-motion)·§2-1(폰트 preload/`font-display`)·§2-8(bento grid)·**§5(KG AI-slop 스멜 테스트 8항 — 원출처 이 레포 `methodology/prompt-patterns.md` · 아이콘 lucide/lobe 계약)**.

## Scope Boundary
- **포함**: ① fragment 단계 공개 시스템(slides.json opt-in 필드 + 키 진행 통합) ② 모션·폰트·**anti-slop** 규율 명문화(style-system.md — AI-slop 스멜 테스트 슬라이드판 번안 + 아이콘 lucide/lobe 강제) + builder 반영(폰트 preload·reduced-motion 가드) + 린트(warning) ③ 신규 레이아웃 `bento-grid` 1종(schema·renderer·layout-meta·문서).
- **제외**: Auto-Animate(요소 보간 — 복잡도 대비 후순위, finding 큐) · View Transitions API(리서치 미확인 항목) · 기존 14+4 레이아웃의 모션 소급 개편(규율은 신규 작성분부터 적용, 소급은 HU3 실증 덱에서만).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. fragment·bento 는 opt-in 필드/신규 레이아웃 — 미사용 덱 산출 무변화.

## 스캐폴딩 결정
- source-of-truth: 모션·폰트 규율 정본 = `references/style-system.md`(계약) — 린트는 그 파생. fragment 콘텐츠 계약 = `slides.schema.json` + `references/layouts.md`. bento 레이아웃 단일 기준 = `templates/layout-meta.json`(스킬 현행 계약 준수).
- 검증: fixture 덱에 fragment·bento 사용 장 추가 → validate·build·overflow 3종 + Chrome 실조작(키 진행당 요소 공개, fragment 소진 후 다음 장) + print/PDF/PPTX 산출에서 fragment 전체 표시(단계 상태 미노출) 확인.
- 배포/운영: setup.sh 단일 배포. 공유 레포 — add 경로 명시.
- 자기선언 — fragment 계약: slides.json 요소에 `fragment: <순번>`(opt-in, 미지정=기존 동작) · 진행 키(→/Space)가 미공개 fragment 를 먼저 소진 후 다음 장 이동, ←는 역순 · **export 전 트랙(print·PDF raster/vector·PPTX·standalone)은 전체 표시 상태로 캡처**(단계 공개는 라이브 발표 전용) · 공개 모션은 transform/opacity 만 · `prefers-reduced-motion` 이면 즉시 표시 · 스피커 뷰 동기 채널에 fragment 인덱스 추가 — 메시지 shape 버전 관리는 불요(speaker.html 과 본편이 같은 빌드에서 항상 함께 재생성).
- 자기선언 — 모션·폰트 규율(계약 문구 골자): 애니메이션 속성 = transform/opacity 한정(레이아웃 유발 속성 금지) · stagger 항목 상한 10 · 전 모션 `prefers-reduced-motion` 가드 · 폰트 규율은 **현행 로딩 패턴 실측 기준**(검증자 발견 — 3테마 전부 Pretendard 를 CDN stylesheet `PRETENDARD_LINK` 로 로드, 폰트 파일 URL 을 직접 모름): `as="font"` preload 는 성립 안 함 → `preconnect`(CDN origin) + `rel="preload" as="style"` 를 계약으로, `font-display` 는 CDN CSS 내부 값 실측 후 필요 시 자체 `@font-face` 오버라이드(step-2 에서 판정·기록) · 위반은 validate `--lint` warning(비차단 — 기존 거장 린트와 동일 등급).
- 자기선언 — bento-grid 계약: 정적 레이아웃 15종째 — 2~6 셀 모듈 블록(셀 = 텍스트/스탯/이미지/미니 차트 슬롯), 셀 span 지정, overflow-checker 대상, exportFallback 불요(정적).
- 검토 후 제외: fragment 중첩(fragment 안 fragment) — 초판 범위 밖 · 커스텀 공개 이펙트 종류 확장(fade-up 단일 기본 + reduced-motion) — 수요 확인 후.

## 결정 로그
- status: resolved
- **범위 = 추천안** — 사용자 확정 2026-07-31 ("추천대로 계획 ㄱ"). Auto-Animate 후순위·bento 포함이 그 추천의 내용.
- **확장: anti-slop·아이콘 규율 포함** — 사용자 확장 요청 2026-07-31 ("/kg /ts 에서도 쓸만한 요소… AI slop 느낌 덜 나게, 아이콘도 깔끔한 거").
- fragment 필드 문법·기본 이펙트(fade-up)·stagger 상한 10 = 기술/튜닝값 (에이전트 결정, 기록만).

## Step 트리

- [x] **step-1 — fragment 단계 공개 시스템**
  - Artifact: `slides.schema.json` fragment 필드 + shell 키 진행 로직(fragment 소진→장 이동, 역방향) + renderer 들의 fragment 클래스 부여 + print/export 경로 전체 표시 강제. `references/layouts.md`·`references/interactive.md` 에 fragment 절.
  - Files: write custom-skills `templates/`(schema·builder src shell·renderer — 착수 시 실경로 확정)·`references/layouts.md`·`references/interactive.md`. read `references/builder-architecture.md`.
  - Risk: 위험 (키 내비 공통 로직 변경 — HU1 스피커 뷰 동기와 상호작용: fragment 인덱스도 동기 대상)
  - Dependencies: 없음
  - Verify: fixture 덱 fragment 장 → Chrome 실조작(진행/역행/장 경계) + 스피커 뷰 동기 유지(HU1 회귀) + print.html·raster PDF 에서 전체 표시 + fragment 미사용 덱 산출 무변화.
  - Failure probe: overflow-checker 가 fragment 숨김 상태에서 오탐하지 않는지(검사는 전체 표시 상태로) 확인. reduced-motion 에뮬레이션으로 즉시 표시 확인.
  - Commit: changeset `20260731-hu2-motion-grammar` (custom-skills, README 절: step-1).
- [x] **step-2 — 모션·폰트·anti-slop 규율 명문화 + builder 반영 + 린트**
  - Artifact: `references/style-system.md` 규율 절 — ⓐ 모션(GPU 속성 한정·stagger≤10·reduced-motion) ⓑ 폰트(preconnect/preload — 실측 계약) ⓒ **anti-slop 체크리스트(슬라이드판)**: KG 8항(디폴트 그림자·보라/파랑 그라데이션·라운드 8/12 고정·단일 서체 의존·상투 구도·white-on-gray 카드 일색 등)을 슬라이드 맥락으로 번안 — 테마 토큰 근거 없는 값 금지 형태로 + ⓓ 아이콘 = lucide/lobe SVG 만(이모지·유니코드 글리프 금지 — 기존 §6 계약을 린트로 승격). builder head 생성부(웹폰트 덱이면 preload 태그) + `validate-slides.mjs --lint` warning 항목(모션·anti-slop·아이콘).
  - Files: write custom-skills `references/style-system.md`·`templates/build-slides.mjs`·`templates/validate-slides.mjs`. read 이 레포 `methodology/prompt-patterns.md`(스멜 테스트 원문).
  - Risk: 위험 (builder head 생성부 변경 — 전 덱 산출 표면)
  - Dependencies: step-1
  - Verify: 웹폰트 fixture 빌드 산출 head 에 preload 존재 + 시스템 폰트 덱은 무변화 + 린트 위반 fixture(디폴트 그림자·이모지 아이콘 심은 것)에서 warning 실출력·정상 fixture 0건.
  - Failure probe: 현행 테마 3종+custom 이 실제로 웹폰트를 쓰는지 착수 시 실측(안 쓰면 preload 분기는 custom 테마 전용으로 좁혀 기록 — 발명 금지). anti-slop 린트는 정적 검사 한계(구도·상투성은 기계 판정 불가) — 기계 검사 가능 항목만 린트로, 나머지는 G5 캘리브레이션 체크리스트 항목으로 배선(경계를 계약에 명기).
  - Commit: changeset 동일 (README 절: step-2).
- [x] **step-3 — bento-grid 레이아웃 + 등재·배포**
  - Artifact: 신규 정적 레이아웃 `bento-grid`(renderer·schema·layout-meta·layouts.md 계약) + SKILL.md 레이아웃 수 갱신 + setup.sh 배포.
  - Files: write custom-skills `templates/layout-meta.json`·`templates/slides.schema.json`·renderer 파일·`references/layouts.md`·`SKILL.md`.
  - Risk: 위험 (schema·layout-meta 공유 계약 파일 편집 — 3자 정합 필수)
  - Dependencies: step-2
  - Verify: fixture bento 장 validate·build·overflow PASS + Chrome 렌더 육안 + 배포본 정합(커밋 가드) + 3 step 통합: fragment+bento+규율 lint 한 fixture 에서 동시 PASS.
  - Failure probe: layout-meta·schema·renderer 3자 정합(스킬 계약 — 하나라도 빠지면 validate 가 잡는지 확인).
  - Commit: changeset 동일 (README 절: step-3).

## 검증/DoD
- **DoD**: fragment 단계 공개가 라이브 발표에서 동작하고 export 전 트랙은 전체 표시를 유지하며, 모션·폰트 규율이 계약+린트로 배포되고, bento-grid 가 15종째 정적 레이아웃으로 등재된다 — fixture 통합 검증(validate·build·overflow·Chrome 실조작) PASS + 미사용 덱 산출 무변화.
- **Evidence**: `evidence/html-upgrade/hu2-motion-grammar.md`
- **회귀 게이트**: fragment/bento 미사용 fixture 재빌드 diff 0 + HU1 스피커 뷰 동기 유지.

## 수치 출처
- stagger 상한(8~10)·GPU 속성 근거 = research 문서 §2-5 (LogRocket, 접근 2026-07-31) — 확인: `grep -n "stagger" research/2026-07-31-html-upgrade-goal-refs.md`. 상한 10 채택은 튜닝값.
- 레이아웃 수(정적 14→15) 실측: `python -c "import json;print(len(json.load(open('templates/layout-meta.json'))))"` (custom-skills, 착수 시 실측 갱신).

## 재생성 장벽
- step-3 배포 후 배포본 검증.

## finding 큐
- Auto-Animate(요소 보간) — 이번 제외, 수요 확인 후 후보.

## 진행 로그
- 2026-07-31 작성 — goal 연쇄 2/3.
