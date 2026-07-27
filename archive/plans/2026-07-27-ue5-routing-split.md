# PLAN — UE5 페이지 분리 (라우팅 전환)

> 생성: 2026-07-27 · 갈래: product 기능/화면 · scope 결정: 화면을 실제 URL 경로로 분리하고 코드 분할한다 — 콘텐츠 채우기(UE3)·갤러리(UE2)·Pro 잠금(UE4)·SSG/prerender 는 범위 밖
Status: approved (2026-07-27 — 사용자 "ㄱㄱ")

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 모든 형태의 디자인을 총괄하는 시스템. 사람이 둘러보는 공개 웹사이트가 세 얼굴 중 하나다. (← `CLAUDE.md` 「북극성」 절)
- **goal**: `ui-encyclopedia` — 웹사이트가 UI 백과사전 역할을 다한다.
- **milestone**: UE5 — 페이지 분리. 23,507줄 `App.tsx` 상태 기반 SPA 를 라우트 단위로 분리한다 (사용자 확정 2026-07-27 "분리는 진행하는 게 좋겠어" · "그 다음 UE5 먼저").
- **리서치 입력**: UE1 관측 결함 O1(뒤로가기)·O7(내비 IA)·O9(검색 결과 UI) — 전부 "한 컴포넌트가 모든 화면을 상태로 갈아끼우는 구조"가 뿌리다. `research/2026-07-27-ue1-encyclopedia-diagnosis.md` 결함 4(정비 마찰).

## 왜 이게 먼저인가 (UE2·UE3 보다)

- UE3 가 Page Sections 16종에 콘텐츠를 대량 투입하면 이행 반경이 몇 배로 커진다 — 그릇을 먼저 바꾼다.
- 진짜 URL 경로는 UE1 에서 손으로 때운 히스토리 동작을 브라우저 기본으로 대체하고, 백과사전의 검색 유입(SEO)·공유·북마크의 전제다.
- O7(내비 IA 재정리)·O9(검색 결과 페이지 재디자인)가 라우트 구조 위에서 자연스럽게 풀린다.

## Scope Boundary
- **포함**: React Router 도입(라우트 트리·경로 스킴), 기존 쿼리 URL(`?page=…&id=…`·`?q=…`·`?filter=…`) → 새 경로 리다이렉트, 화면 모듈을 App.tsx 에서 라우트 단위로 분리 + lazy 코드 분할, UE1 탐색 회귀 스위트의 경로 버전 재작성·통과, 사람 관측 1회.
- **제외**:
  - SSG/prerender·SEO 메타 완성 — 후속 후보(UE3 콘텐츠와 함께 가치가 생긴다). 이번엔 CSR 라우팅까지.
  - Next/Astro 등 프레임워크 이행 — Vite+React 유지 (Tech Stack "가벼움 우선" 관례).
  - 내비 IA 재설계(O7)·검색 결과 UI 재디자인(O9)·Docs 랜딩 역할(O6) — 라우트 구조가 생긴 뒤 별도 milestone 에서. 이번엔 현행 화면을 경로로 옮기기만.
  - 배포 — 로컬 검증까지 (deployment.md 규약).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step 별 독립 revert. step-1 어댑터 단계에서는 기존 상태 기계가 그대로 살아 있어 라우터 레이어만 걷어내면 원상복구된다. step-2 분리는 화면 모듈 단위로 커밋해 부분 revert 가능하게 한다.

## 스캐폴딩 결정
- source-of-truth: 경로 스킴의 정본은 라우트 정의 모듈(신설 `src/routes.tsx` 또는 `src/router/`) 하나 — App.tsx 의 `PageMode`·파라미터 직렬화는 이행 완료 시 이 정본에서 파생되거나 제거된다. 내비 구조 정본은 계속 `navigation-model.ts`.
- 검증: UE1 Playwright 회귀 스위트를 경로 기반으로 개작한 것이 회귀 기준(착지·딥링크·뒤로가기·검색·하위호환 리다이렉트). `npm run build`·`npm run lint` PASS. 청크 크기는 build 출력으로 전/후 비교 기록.
- 배포/운영: 로컬 검증까지 — 정적 호스팅(SPA fallback) 요구사항이 배포 문서에 추가돼야 함을 changeset 에 기록(실제 배포 설정 변경은 배포 시점).
- 자기선언 도메인 — **하위호환 리다이렉트**: 기존 4파라미터 URL 전 형태가 새 경로로 301성 리다이렉트(라우터 레벨 replace)된다. 깨진 공유 링크 0 이 목표 — 회귀 스위트에 전용 케이스.
- 자기선언 도메인 — **이행 중 무회귀**: 한 번에 다 옮기지 않는다 — step-1 은 어댑터(라우터가 기존 상태 기계를 구동), step-2 가 실분리. 각 step 끝에서 UE1 회귀 스위트가 PASS 여야 다음으로 간다.
- 검토 후 제외: 인증(현행 OAuth 리턴 파라미터 `?auth=` 처리는 그대로 유지 — 회귀 케이스에 포함), 결제·시크릿·DB(해당 없음), 디자인 변경(화면 이동만, 새 화면 없음 — askewly-design 브리프 불요).

## 결정 로그
- status: resolved
- **라우터 = React Router v7 (라이브러리 모드, Vite 유지)** — 기술 선택(에이전트 소유): 프레임워크 이행 없이 경로·중첩 라우트·lazy 를 얻는 최소 반경. TanStack Router 는 타입 안전성이 강점이나 커뮤니티 관례·이행 문서량에서 열세, Next/Astro 는 재작성급이라 기각. 구현 시 Context7 로 v7 현행 API 확인.
- **경로 스킴** — `/` 홈 · `/patterns` + `/patterns/:collectionId` (구 plus) · `/terms/:termId` (구 ?page=term&id=) · `/docs` + `/docs/:articleId` · `/colors` · `/recipes` · `/pro` · `/search?q=` (검색 결과). 컬렉션·용어 id 는 기존 id 체계 그대로.
- **prerender 범위 밖** — SEO 완성은 UE3 콘텐츠 투입과 함께 별도 후보로. 이 결정으로 이번 milestone 이 순수 구조 이행으로 유지된다.
- **UE5 자체의 미결 사용자 결정**: 없음 — 분리 진행 자체가 사용자 확정이고 나머지는 기술 선택.

## Step 트리

- [x] **step-1 — 라우터 골격 + URL 어댑터 + 하위호환 리다이렉트**
  - Artifact: React Router 가 위 경로 스킴으로 마운트되고, 각 라우트가 기존 App 상태 기계(PageMode·filter·query)를 구동하는 어댑터로 연결된다. 기존 쿼리 URL 전 형태는 진입 시 새 경로로 replace 리다이렉트. `?auth=` OAuth 리턴 처리 유지.
  - Files: write `examples/ui-vocabulary-site/package.json`(react-router 추가), `src/main.tsx`, 신설 `src/routes.tsx`, `src/App.tsx`(어댑터 배선 — 상태 기계는 유지). read `src/lib/navigation-model.ts`.
  - Risk: 위험 (URL 해석 층이 이중화되는 단계 — 리다이렉트 누락 시 기존 링크가 깨진다. 하위호환 전용 회귀 케이스로 잡는다)
  - Dependencies: 없음
  - Verify: Playwright — ① `/patterns/plus-marketing-header-sections` 직행 → 목록 렌더 ② `/terms/accordion` 직행 → 상세 ③ 구 URL 4형태(`?page=term&id=accordion`·`?filter=nav:…`·`?q=아코디언`·`?page=docs&filter=…`) → 새 경로로 리다이렉트 + 같은 화면 ④ `?auth=ok` 처리 회귀 ⑤ 뒤로가기 = 브라우저 기본 동작. 콘솔 에러 0. build·lint PASS.
  - Failure probe: 리다이렉트 맵에서 `page=term` 분기를 일시 제거하면 ③이 FAIL 로 잡는다. 라우터 마운트를 되돌리면 ①②가 404/홈 폴백으로 FAIL.
  - Commit: changeset `ue5-routing-split` (README 절: step-1).

- [x] **step-2 — 화면 모듈 분리 + lazy 코드 분할**
  - Artifact: 홈·Patterns 목록·용어 상세·Docs·Colors·Recipes·Pro 화면이 App.tsx 밖의 라우트 모듈로 분리되고 `lazy()` 로딩된다. App.tsx 는 셸(헤더·사이드바·공유 상태)만 남는다. UE1 에서 넣은 `pushHistoryEntry` 손배선은 라우터 내비게이션으로 대체·제거.
  - Files: write `src/App.tsx`(축소), 신설 `src/pages/*`(화면 모듈 — 기존 컴포넌트 이동 위주, 재작성 아님), `src/routes.tsx`. read `src/components/*`.
  - Risk: 위험 (대규모 이동 diff — 화면 모듈 단위로 커밋을 쪼개 부분 revert 를 보장한다. 상태 공유가 끊기면 검색·필터가 화면 간 초기화되는 회귀)
  - Dependencies: step-1
  - Verify: UE1 회귀 스위트(경로 버전) 전항목 PASS + 검색어·필터가 화면 이동에도 유지되는 케이스. `npm run build` 출력의 청크 구성 전/후 비교 — 초기 로드 청크가 라우트 분할로 감소했음을 수치로 기록. lint PASS.
  - Failure probe: 한 라우트 모듈의 lazy 를 동기 import 로 되돌리면 청크 비교 검증이 감소 없음으로 FAIL. 공유 상태 컨텍스트를 끊으면 검색어 유지 케이스가 FAIL.
  - Commit: changeset `ue5-routing-split` (README 절: step-2 — 화면 모듈별 다중 커밋 허용).

- [ ] **step-3 — 통합 회귀 + 사람 관측**
  - Artifact: 통합 시나리오(홈→검색→상세→사이드바→목록→새 탭 공유→뒤로가기)의 경로 기반 실행 로그 + 청크 전/후 수치 + **사람 관측 1회**(과업: UE1 과 동일 + "주소창이 읽을 수 있는 경로로 보이는가") 기록을 담은 evidence.
  - Files: write `evidence/ui-encyclopedia/ue5-routing-split.md`. 관측의 좁은 결함은 이 leaf 안에서 수정, 구조 결함은 finding 큐.
  - Risk: 없음 (관측·기록 중심)
  - Dependencies: step-1, step-2
  - Verify: 통합 Playwright PASS(출력 원문 evidence 기록) · build·lint PASS · 사람 관측 기록 존재(발화 인용). 기계 PASS 만으로 닫지 않는다.
  - Failure probe: 사람 관측 없이 닫으면 무효 — UE1 에서 기계 5항 PASS 뒤 사람이 10건을 적발한 직전 사례가 근거다.
  - Commit: changeset `ue5-routing-split` (README 절: step-3).

## 검증/DoD
- **DoD**: 화면들이 실제 URL 경로로 분리되고(`/terms/accordion` 등), 기존 쿼리 URL 전 형태가 리다이렉트로 하위호환되며, 라우트 lazy 분할로 초기 청크가 줄었음이 수치로 기록되고, UE1 탐색 회귀(내비·검색·딥링크·뒤로가기) 전부 유지 — 사람 관측 1회 포함.
- **Evidence**: `evidence/ui-encyclopedia/ue5-routing-split.md`
- **회귀 게이트**: UE1 회귀 스위트(경로 버전) + `npm run build` + `npm run lint` PASS.
- **spec 반영**: `docs/design-system/site-blueprint.md` 의 "라우팅 방식 전환은 범위 밖" 문구를 공식 개정(사용자 확정 2026-07-27 인용) — step-1 커밋에 포함.

## finding 큐
- step-2: Pro/Download/카탈로그 골격(약 6천 줄)이 App.tsx 에 잔류 — `src/pages/*` 완전 분리는 후속 정리 후보 (효과 대비 diff 커서 이번 범위에서 제외).

## 진행 로그
- 2026-07-27 작성.
