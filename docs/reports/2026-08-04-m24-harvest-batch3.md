# 완료 — M24 harvest 배치 3 — 본체 미등재 재고 회수 + motion 의존 게이트 확장

> work-id: m24-harvest-batch3 · plan: archive/plans/2026-08-04-m24-harvest-batch3.md · changeset: changesets/20260804-m24-harvest-batch3 · 2026-08-04

## 1. 결과

- **registry 38 → 48 (+10)**: 미등재 마이크로 인터랙션 6종(magnetic-hover-button·spring-drag-snap-card·swipe-action-row-pattern·pull-to-refresh-list-pattern·staggered-entrance-group·bottom-sheet-detents) + 부속 device-frame + home-page.tsx 에서 독립 추출한 데모 3종(product-coverflow·hero-composition·image-treatment). meta.harvest 출처 전건.
- **게이트 확장**: `generate-registry.mjs` plain-asset 경로에 블록 계약 §2 준용 2경로 — `item.dependencies` 선언 npm allowlist(선언+실사용 대조) + `@/components/<등재자산>` 참조→registryDependencies URL 파생. motion/react 계열 자산의 registry 진입로가 생겼다.
- **knowledge**: `knowledge/graph-content-schema.md`(B4 — 타입/계층 2축·방향/무방향 관계·provenance.reviewed) + llms 등재.
- 추출 정규화: 공유 훅 인라인·keyframe 컴포넌트 내장(이름 스코프)·브랜드 변수 로컬 자급(`--pc-*`/`--it-*`)·사진 prop 화.
- 사용자 관측 1회 통과(2026-08-04 "응 통과" — 관측 보드 artifact 5ae085df M24 섹션).
- 구현됨·미검증: 소비 프로젝트에서 shadcn CLI 실설치 경로(`npx shadcn add <url>`) — E2E 는 fetch+수동 기록 방식(계약 부록 준수), CLI 설치는 npm publish 전이라 로컬 한정.

## 2. 이슈와 해결

- fresh 검증자 적발 3건 반영: ① 6종 중 3종의 `@/components/device-frame` import 로 npm allowlist 만으로는 재생성 전체 크래시 → 게이트 확장에 등재-자산 참조 경로(②) 추가 + device-frame 부속 선등재 ② 수치 출처 file:line 오기 정정 ③ 데모 추출 얽힘(공유 훅 `usePrefersReducedMotion`·전역 keyframe `filters-wipe-sweep`) plan 명시 후 인라인/내장으로 처리.
- probe 원복에 `git checkout` 을 쓰자 autocrlf 가 소스를 CRLF 로 되살려 registry 임베드 content 가 오염 → LF 재정규화로 해소. 교훈: probe 원복은 역편집 또는 즉시 EOL 검사 (finding 신규).
- 추출 3종의 하드코딩 라이트 팔레트는 기록된 디자인 의도("양 테마에서 밝게")라 시맨틱 전환 대신 콘텐츠 판정 — lint ALLOWLIST +2(term-visual 선례), 브랜드 변수만 로컬 CSS 변수로 자급해 이식성 확보.
- 이월(배치 4 후보): C1 brain three.js 씬 · C2 Color Palette Generator · C5 Cursor-Reactive Field·brain 인증 모달/HUD. finding 승계: CLI verify chart.tsx 속성 셀렉터 오탐.
- 크기 회고: milestone 판정 적정 — 독립 step 5 + 통합 검증 + 단독 capability, changeset 1 디렉터리·커밋 5.

## 3. 증거

- 실표면: 로컬 프로덕션 빌드 프리뷰(vite preview :4322) 홈 실렌더 스모크 + 라이브 프로드(ui.askewly.com) 풀페이지 대조 PASS — 신규 registry/llms 의 라이브 반영은 push 후 CF Pages 자동 배포(마감 커밋에 포함).
- 재현: `node scripts/generate-registry.mjs && cd examples/ui-vocabulary-site && npm run lint && npm run build` (48 assets·lint 3종·759 routes) + 신선 E2E 는 harvest-contract 부록 8단(로컬 registry 서빙→fetch 이식→시간차 스크린샷).
- 게이트 자기시험 3건 전부 FAIL 적발(실행 출력): 미선언 motion import / 선언·미사용 dependencies / 미등재 device-frame 참조 → 각각 `generate-registry: FAIL` 후 원복 재생성 OK.
- 순수 추가: step-2 후 45건(porcelain ?? 7 + M index 1), step-3 후 48건(?? 3 + M index 1) — 기존 per-item JSON diff 0.
- hex probe: `bg-[#ff0000]` 주입 → `FAIL lint:colors — 1 > max 0` → 원복 `0 violations`.
- 사이트: `tsc -b` 무오류 · oxlint/lint:colors/check-llms-sync PASS · build `prerender: 759 routes` · 시각 회귀 = 로컬 빌드 vs 라이브 프로드 풀페이지 대조 동일(scratchpad m24-home-local/live.png).
- 신선 E2E: 로컬 registry(http.server:8931) fetch 10종 전건 ok(regDeps 로 device-frame URL 참조) · tsc 무오류·콘솔 에러 0 · 시간차 2장(t=2.5s/7.2s — Coverflow analytics→kanban·Hero Centered→Proof surface·Image Duotone→Warm Film·와이프 중간 프레임, scratchpad m24-e2e-t1/t2.png).
- 상호작용 실발화 측정값(Playwright): 마그네틱 pull `(7.94,6.95)`→leave `none` / 드래그 held `(24.8,-40)`→복귀 중간 보간 `(1.91,-3.09)`→rest `none` / 스와이프 행 3→2 삭제 / 풀투리프레시 `animate-spin` 1→`Updated` 라벨 visible / 바텀시트 `data-detent` collapsed→expanded·scrim 클릭 닫힘 / 스태거 중간 opacity `[1,1,1,0.72]`.
- llms probe: 등재 전 `grep -c graph-content-schema llms.txt` = 0 → 등재 후 1 · check-llms-sync PASS.
- 커밋: 460b81b(step-1)·4f126d7(step-2)·dbb2f2c(step-3)·5501138(step-4)·49f5004(step-5) · 상세 evidence: evidence/harvest/m24-batch3.md
