# PLAN — UE1 탐색이 작동한다

> 생성: 2026-07-27 · 갈래: product 기능/화면 · scope 결정: 사이트의 탐색 경로(사이드바·검색·딥링크)만 고친다 — 바리에이션 갤러리(UE2)·헤더/푸터 콘텐츠(UE3)·Pro 잠금(UE4)은 다음 milestone
Status: approved (2026-07-27 — 사용자 "ㄱㄱ". 연쇄 UE2·UE3·UE4 포함 제시 승인, 각자 별도 plan doc 으로 깎은 뒤 진행. UE3 는 Page Sections 전체 확장판으로 승인됨)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 모든 형태의 디자인을 총괄하는 시스템. 사람이 둘러보는 공개 웹사이트가 세 얼굴 중 하나다. (← `CLAUDE.md` 「북극성」 절)
- **goal**: `ui-encyclopedia` — 웹사이트가 UI 백과사전 역할을 다한다: 들어가서 용어의 생김새·쓰임·바리에이션을 보고, 헤더·푸터 종류와 디자인 레퍼런스를 본다 (2026-07-27 사용자 발의).
- **milestone**: UE1 — 탐색이 작동한다. 사이드바·검색·딥링크로 원하는 용어·카테고리에 실제로 도달한다.
- **리서치 입력**: `research/2026-07-27-ue1-encyclopedia-diagnosis.md` — 실측 결함 1(사이드바 무반응, `App.tsx:334-338` 조용한 return 후보)·결함 2(딥링크 홈 폴백) + 사용자 확정 결정 5건.

## 왜 이게 먼저인가

백과사전의 첫 동사는 "찾는다"다. 실측에서 그 동사가 두 군데 부러져 있었다:

1. **사이드바 내비 무반응** — 아코디언 페이지에서 "Header Sections" 클릭 시 URL·화면 무변화 (Playwright 실측). UE3 가 헤더/푸터 콘텐츠를 채워도 도달 경로가 없으면 아무도 못 본다.
2. **딥링크 홈 폴백** — `?page=dictionary`·`?q=헤더` 가 홈으로 떨어진다. 공유·북마크·검색엔진 유입이 전부 홈에서 끊긴다.

RU1·DOG7 의 반복 교훈(기계 PASS 를 사람이 뒤집는다)에 따라, 이 milestone 은 **사람 관측을 DoD 에 포함**한다.

## Scope Boundary
- **포함**: 사이드바 내비 수리(용어 상세·목록 양쪽에서 카테고리 착지), 실패의 관측 가능화(조용한 return 제거), URL 딥링크 계약(page/filter/q 파라미터 왕복 + 뒤로가기), 통합 E2E + 사람 관측 1회.
- **제외**:
  - 바리에이션 갤러리 스키마·렌더러 — UE2.
  - 헤더/푸터 레퍼런스 수집·데모 제작 — UE3.
  - Pro 잠금·오너 언락·auth — UE4.
  - `App.tsx` 모놀리스 분해 리팩터링 — 이번엔 수리에 필요한 최소 추출만 (Surgical Changes).
  - React Router 도입 등 라우팅 방식 전환 — blueprint 가 명시적으로 범위 밖으로 둔 결정 유지.
  - 프로덕션 배포 — 로컬 검증까지. push·배포는 사용자 승인 후 (deployment.md 규약).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step 별 독립 revert. URL 파라미터 스키마 변경은 기존 파라미터(`page`·`id`·`q`·`filter`)와 하위호환 유지 — 깨지면 해당 step 만 되돌린다.

## 스캐폴딩 결정
- source-of-truth: 내비 구조의 정본은 `src/lib/navigation-model.ts` (`navigationCollections`), URL 계약의 정본은 `App.tsx` 의 파라미터 직렬화 지점(현행 `page`·`id`·`q`·`filter`) — 수리는 이 두 정본을 맞추는 방향으로 하고 제3의 매핑 테이블을 만들지 않는다.
- 검증: Playwright 스크립트(`webapp-testing` 절차, scratchpad 실행) — 클릭·딥링크·뒤로가기 시나리오가 회귀 기준. 최종은 사람 관측 1회(과업: "아코디언 찾기 → 헤더 섹션 목록 보기").
- 배포/운영: 이번 milestone 은 로컬 검증까지 — `npm run build`·`npm run lint` PASS 를 회귀 게이트로 두고, 배포는 범위 밖(사용자 승인 후 별도).
- 자기선언 도메인 — **조용한 실패 제거**: `navigateToNavigationPath` 류의 무반응 경로는 수리 후에도 "경로 못 찾음"이 최소 console.warn 으로 관측 가능해야 한다. DOG7·UE1 결함 모두 "실패가 안 보임"에서 왔다.
- 자기선언 도메인 — **하위호환 URL**: 기존에 공유됐을 수 있는 `?page=term&id=…` 형태는 계속 동작해야 한다. 새 계약은 추가지 교체가 아니다.
- 검토 후 제외: 인증·결제·시크릿(UE4 로 이월), 마이그레이션·DB(해당 없음), 디자인 시그니처 변경(화면 수리만 — 새 화면을 만들지 않으므로 askewly-design 브리프 불요, 단 목록 착지 화면의 기존 스타일 유지 확인은 step-3 스크린샷에 포함).

## 결정 로그
- status: resolved
- **확정 (2026-07-27 사용자, goal 수준)**: ① 유료 경계 = Tailwind Plus 모델(미리보기 무료·전체는 Pro) ② 결제는 나중 — 이번 연쇄는 잠금+오너 언락까지 ③ 콘텐츠 범위 = **Page Sections 전체**(헤더/푸터 우선 착수, 이어서 Hero·Feature·CTA·Bento·Pricing·Newsletter·Stats·Testimonials·Blog·Contact·Team·Content·Logo Clouds·FAQ — 확장 확정) ④ 오너 판별 = Google 로그인 이메일 대조 ⑤ 레퍼런스는 Dribbble·Pinterest 탐색 후 직접 구현 데모(출처 URL+접근일 기록).
- **UE1 자체의 미결 사용자 결정**: 없음 — 부러진 탐색의 수리이며 새 UX 결정을 만들지 않는다. 수리 중 UX 선택지가 갈리면(예: 사이드바 클릭 착지 화면이 목록이냐 필터냐) 현행 설계 의도(`navigation-model.ts` 의 collection → 목록 필터)를 따르고 finding 큐에 기록한다.

## Step 트리

- [ ] **step-1 — 사이드바 내비 수리 + 실패 관측 가능화**
  - Artifact: 용어 상세·목록 어디서든 사이드바 카테고리(예: "Header Sections") 클릭이 해당 컬렉션 목록 화면으로 착지한다. `navigateToNavigationPath` 의 조용한 return 을 제거 — 경로 불일치 시 console.warn 으로 사유가 남는다. 근본 원인(경로 불일치인지, 핸들러 미배선인지)을 changeset README 에 기록한다.
  - Files: read `src/lib/navigation-model.ts`, `src/lib/exposure.ts`; write `src/App.tsx`(내비 핸들러·파라미터 배선), 필요 시 `src/lib/navigation-model.ts`(경로 데이터 정정), `src/components/term-page.tsx`(사이드바 전달 props 한정).
  - Risk: 위험 (내비 배선 변경이 지금 동작하는 목록 필터·홈 진입 경로를 깰 수 있다 — Verify 의 기존 경로 회귀 확인으로 잡는다)
  - Dependencies: 없음
  - Verify: Playwright — `?page=term&id=accordion` 에서 "Header Sections" 클릭 → URL 에 해당 filter 반영 + 화면에 Header Sections 컬렉션 목록 렌더(용어 행 ≥1 또는 빈 컬렉션 명시 상태). 같은 스크립트로 "Footers"·"FAQs" 2건 추가 확인. dev 콘솔 에러 0건.
  - Failure probe: `navigationCollections` 에서 해당 collection 정의를 일시 제거하고 클릭하면 무반응이 아니라 console.warn 에 경로 문자열이 찍힌다 — 조용한 실패가 제거됐다는 증거.
  - Commit: changeset `ue1-encyclopedia-navigation` (README 절: step-1).

- [ ] **step-2 — URL 딥링크 계약**
  - Artifact: 탐색 상태(카테고리 목록·검색어·용어 상세)가 URL 로 왕복한다 — 주소를 복사해 새 탭에 붙이면 같은 화면이 나오고, 브라우저 뒤로가기가 직전 탐색 상태로 돌아간다. 유효하지 않은 파라미터는 홈이 아니라 가장 가까운 유효 상태(예: 잘못된 id → 목록)로 떨어지며 그 사실이 화면에 보인다(EmptyTermPage 류).
  - Files: write `src/App.tsx`(파라미터 파싱·pushState/popstate 배선). read `src/lib/search.ts`.
  - Risk: 위험 (URL 스키마 변경이 기존 공유 링크 `?page=term&id=…` 를 깨면 하위호환 위반 — Verify ③ 이 전용 회귀다)
  - Dependencies: step-1
  - Verify: Playwright — ① `?filter=nav:<header-collection-id>` 새 탭 직행 → 목록 렌더 ② `?q=아코디언` 직행 → 검색 결과에 아코디언 행 ③ `?page=term&id=accordion` 기존 형태 회귀 유지 ④ 목록→상세→뒤로가기 → 목록 복귀(스크롤 최상단 허용). 종전 파라미터 4종(`page`·`id`·`q`·`filter`) 전부 하위호환.
  - Failure probe: popstate 배선을 끊으면 ④가 실패한다(뒤로가기가 홈으로 감) — 테스트가 이를 잡는다. 잘못된 `?id=no-such-term` 은 빈 상세 폴백 화면을 렌더하고 콘솔 에러 0건.
  - Commit: changeset `ue1-encyclopedia-navigation` (README 절: step-2).

- [ ] **step-3 — 통합 E2E + 사람 관측**
  - Artifact: 통합 시나리오 1본("홈 → 검색 '아코디언' → 상세 열람 → 사이드바 'Header Sections' → 목록 → 딥링크 공유")의 Playwright 실행 로그 + 스크린샷, 그리고 **사용자 관측 1회**(사전 설명 없이 "아코디언 찾아서 보고, 헤더 종류 목록까지 가보세요" 과업)의 성공/실패·막힌 지점·발화 인용을 담은 evidence.
  - Files: write `evidence/ui-encyclopedia/ue1-navigation.md`. 관측에서 즉시 고칠 수 있는 좁은 결함이 나오면 이 leaf 안에서 수정(새 leaf 를 만들지 않는다), 구조적 결함은 finding 큐로.
  - Risk: 없음 (관측·기록 중심 — 관측 중 수정이 생기면 그 수정만 step-1·2 와 같은 위험 기준으로 본다)
  - Dependencies: step-1, step-2
  - Verify: `npm run build` + `npm run lint` PASS · 통합 Playwright 시나리오 PASS(실행 출력 원문을 evidence 에 옮긴다 — 읽어서 낸 판단 금지) · 사람 관측 기록이 evidence 에 존재(성공이든 미달이든 발화 인용 포함).
  - Failure probe: 사람 관측 없이 기계 PASS 만으로 닫으면 이 milestone 은 무효다 — RU1·DOG7 이 정확히 그렇게 미달했다. 관측이 미달이면 미달로 적고 닫는다(7번째 재현을 기록으로 남기는 것 자체가 산출물).
  - Commit: changeset `ue1-encyclopedia-navigation` (README 절: step-3).

## 검증/DoD
- **DoD**: 사용자가 사이트에서 ① 검색으로 '아코디언' 상세에 도달하고 ② 사이드바로 'Header Sections' 목록에 도달하고 ③ 그 주소를 복사해 새 탭에서 재현할 수 있으며, 이것이 사람 관측 1회로 확인된다. 기존 URL 형태는 전부 하위호환.
- **Evidence**: `evidence/ui-encyclopedia/ue1-navigation.md` — Playwright 실행 로그·스크린샷 + 사람 관측 기록(발화 인용).
- **회귀 게이트**: `npm run build` + `npm run lint` PASS.

## 다음 milestone 연쇄 (승인 범위 제시용 — 각자 별도 plan doc 으로 깎는다)
- **UE2 — 용어 상세에 바리에이션 갤러리**: terms 스키마에 변형·상태 층 추가 + 상세 페이지 갤러리 렌더러 + 파일럿 용어 1~2건(아코디언 포함). 무료/Pro 경계 표시 자리만 마련(잠금 동작은 UE4).
- **UE3 — Page Sections 레퍼런스 → 직접 구현 데모 (배치식)**: Dribbble·Pinterest 등 탐색(출처 URL+접근일 장부) → 재해석 직접 구현 데모로 **Page Sections 전체(약 16종 컬렉션)** 를 채운다. 배치 1 = Header Sections·Footers(우선 착수 확정), 이후 배치 순서는 UE3 계획서에서 확정. 카테고리당 데모 최소 기준·노출은 source-quality + Production Exposure Policy(채워진 컬렉션만 노출·실개수 표기) 적용 — 전 카테고리 완주 전에도 채워진 것부터 열린다.
- **UE4 — Pro 잠금 + 오너 언락**: Tailwind Plus 모델 잠금(미리보기 무료·전체 Pro) + 세션 이메일 대조로 소유자 전체 열람. 결제는 범위 밖.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-27 작성.
