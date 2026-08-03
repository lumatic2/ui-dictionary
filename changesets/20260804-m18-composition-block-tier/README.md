# 20260804-m18-composition-block-tier

> M18 — 조합 블록 계층 (외부 흡수 실사 + 앱 골격급 자산 정본화 + saas-app-shell 1종). Plan: `plans/2026-08-04-m18-composition-block-tier.md`

## step-1 — 외부 공개 블록 실사 + 베이스 판정 (2026-08-04)

- `research/2026-08-04-m18-block-absorption-survey.md` 신설 — 후보 5개 실측 표(라이선스·구성·import 표면·품질), 채택 규칙 3항 대조.
- **판정: shadcn 공식 `dashboard-01`(MIT) 베이스 채택** — 이미 registry:block 동형 배포(11 files·shadcn primitives registryDependencies 19종), 설정·빈 상태·토스트는 우리 asset 보강. shadcn-admin(라우터 결합)·Tremor(자체 체계)·Next 스타터(프레임워크 결합)·shadcnblocks(유료) 기각.
- `docs/design-system/absorption-criteria.md` 실측 후보 분류 표에 A(dashboard-01)·B(기각 3종) 행 추가 + llms 재생성.
- 검증: 후보 ≥3 실측 표 ✓ · 규칙 3항 대조 ✓ · 베이스 확정 1줄 ✓ · absorption-criteria 행 ✓ · llms-sync PASS(커밋 `606c3bd` 후 확인).

## step-2 — 블록 계약 정본화 + entry-protocol 접합 (2026-08-04, 커밋 `424448a`)

- `docs/design-system/block-contract.md` 신설 — tier marker(meta.tier)·registry 표현·레이아웃 계약(라우팅 미결합·원 asset 무수정)·restyle 요구 변수 의무·흡수/attribution 규칙·소비 경로 §7.
- entry-protocol A분기에 **A-0 Block-first** 단계 삽입 + llms 생성기 등재(175 assets) + evidence 에 보강 재료 import 실측표(recoverable-empty-state·actionable-toast 순수 판정).
- 검증: llms-sync PASS · entry-protocol grep 1건 ✓.

## step-3 — generate-registry 블록 지원 확장 (2026-08-04)

- `scripts/generate-registry.mjs` — `tier:"block"` 분기 신설: `blocks/<name>/` 다중 파일 수집(page/file/component 타입 파생), purity gate 확장(블록 내부 상대 import + 등재 asset import→URL registryDependencies + 선언 npm deps 만 허용), `meta.tier:"block"` 출력, 미사용 선언 deps FAIL.
- 검증: 기존 27 자산 회귀 — 구조 diff 0(잔여 1건은 M6 `text-2xs` 소스 드리프트의 재생성 회수, 커밋 `0334874` 이후 registry 미갱신분) · 픽스처 블록 생성 PASS(files 2·meta.tier·primitives+asset URL·선언 dep) · **게이트 자기시험 2건 실제 FAIL**(`@/data/terms.generated` 사이트 결합 import / 미선언 npm 패키지) · 픽스처 제거 후 27 자산 클린 재생성.

## step-4 — saas-app-shell 블록 구현 (2026-08-04, 커밋 `10c3bf1`·`fd0d6e2`)

- 블록 12본(dashboard-01 흡수 7 + 어댑터 2 + 신작 1 + page + data) + primitives 4종 설치 + registry·데모·계약 §6 등재. 상세 evidence §step-4.
- 데모 격리 보정: fixed sidebar 카드 탈출 → 래퍼 `[transform:translateZ(0)]`.

## step-5 — 외부 이식 통합 검증 (2026-08-04)

- 신선 vite 프로젝트에 `npx shadcn add` 재귀 해결 전건 성공 + teal 테스트 브랜드 restyle + 실브라우저 4장면·콘솔 0·verify 0건.
- 이식 실측이 잡은 생성기 계약 결함 2건 보수: ① 블록 파일 전건 `target` 부여 ② `registry:page`→`registry:component`(Next 외 조용한 스킵). 상세 evidence §step-5.

