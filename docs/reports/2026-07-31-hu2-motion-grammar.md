# 완료 — HU2 모션 문법 + 표현 규율 (goal `html-upgrade` 2/4)

> 완료: 2026-07-31 · HU2 (goal `html-upgrade`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

"발표하는 느낌"의 문법이 트랙에 들어왔다: ① fragment 단계 공개(→키당 요소 공개, 스피커 step 동기, export 는 전체 표시) ② 모션·폰트·anti-slop 규율이 계약(style-system.md)+린트(R4~R6 warning)로 명문화 — KG 스멜 테스트 8항(원출처 이 레포 prompt-patterns.md)의 기계 검사 가능 항목을 배선, 이모지 아이콘 금지 승격, 폰트 preconnect/preload 자동 삽입 ③ bento-grid 가 정적 15종째 레이아웃으로 등재. custom-skills 3커밋(01bea4f→cf44bc4) 배포·push.

## 2. 이슈와 해결

- overflow-checker 가 fragment pending(translateY)을 내부 오버플로로 오탐 — capture 모드 전환은 nav-overlap 판정을 깨서 기각, 검사 페이지 중화 스타일 주입으로 해소.
- 계획의 `as="font"` preload 계약이 실측(CDN stylesheet 패턴)과 불일치 — 검증자 발견대로 preconnect+style preload 로 정정, `font-display:swap` 은 CDN CSS 기선언 실측 확인.
- bento 셀 높이 눌림(제목 잘림) 1라운드 수리.

## 3. 증거

- changeset: custom-skills `changesets/20260731-hu2-motion-grammar` (step 3절)
- 검증: `evidence/html-upgrade/hu2-motion-grammar.md` — `FRAGMENTS PASS`(공개/역행/장 경계/capture 무오염/스피커 `+k/m`), 위반 fixture 경고 7건 전부 실발화·정상 fixture 0건, 3장 통합 validate·build·overflow PASS.
- 크기 회고: changeset 1디렉터리·3절 — 라벨 정합.
- 실표면: 배포본 템플릿으로 빌드한 fixture 를 Chrome 실조작 — fragment 진행·스피커 동기·bento 렌더 육안(스크린샷) 확인.
- 재현: `node tools/validate-slides.mjs content/slides.json --lint && node tools/build-slides.mjs && node tools/overflow-checker.mjs` (fixture: fragment·bento 장 포함)
