# PLAN — UE2 용어 상세에 바리에이션 갤러리

> 생성: 2026-07-27 · 갈래: product 기능/화면 · scope 결정: 변형·상태 층과 상세 페이지 갤러리 + 파일럿 용어 2건(아코디언·탭)까지 — 전 용어 확산·Pro 잠금 동작·YAML 파이프라인 통합은 범위 밖
Status: approved (2026-07-27 — UE1 승인 연쇄 `--chain UE2,UE3,UE4` 집행. 새 사용자 소유 결정 없음 — 결정 로그 참조)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 모든 형태의 디자인을 총괄하는 시스템. (← `CLAUDE.md` 「북극성」 절)
- **goal**: `ui-encyclopedia` — "아코디언의 생김새·쓰임·**바리에이션**을 본다"(사용자 원문). UE1 이 "찾는다"를, UE5 가 "그릇"을 만들었고 UE2 가 **찾은 페이지에 볼 것**을 만든다.
- **milestone**: UE2 — 용어 상세에 바리에이션 갤러리.
- **리서치 입력**: UE1 관측 결함 O10(기존 Header Sections 예제가 변형 간 차별성 미달 — "몇 개는 그냥 똑같이 생겼는데") — 변형은 서로 달라 보여야 변형이다. `research/2026-07-27-ue1-encyclopedia-diagnosis.md` 결함 3(바리에이션·상태·레퍼런스 0건).

## Scope Boundary
- **포함**: 변형·상태 데이터 층(TS 레지스트리) + 상세 페이지 갤러리 렌더러(실동작 데모) + 파일럿 2건(아코디언·탭) + 무료/Pro 경계 **표시 자리**(잠금 동작 없음) + askewly-design 게이트 + 사람 관측 1회.
- **제외**: 전 용어(562개) 확산 — UE3 와 함께 배치식. Pro 잠금 실동작·오너 언락 — UE4. terms.yml/빌드 파이프라인 스키마 통합 — 파일럿 검증 후 UE3 에서 재검토. 레퍼런스 헌팅 대량 수행 — UE3 (이번엔 파일럿 근거만).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: 신규 파일 위주(레지스트리·갤러리 컴포넌트) — step 단위 revert 로 원복. term-page.tsx 변경은 갤러리 섹션 추가에 한정.

## 스캐폴딩 결정
- source-of-truth: 변형 데이터의 정본은 신설 `src/data/term-variations.tsx`(타입드 레지스트리, termId 키). **terms.yml 파이프라인에 넣지 않는 이유**: 변형 = 설명+실동작 데모 컴포넌트 쌍이라 YAML 이 코드 참조를 소유할 수 없다 — 파일럿으로 형태를 검증한 뒤 UE3 규모화 때 데이터/코드 경계를 재확정한다(finding 큐 기록).
- 검증: Playwright(갤러리 렌더·변형 전환·상태 데모 상호작용) + `npx @askewly/design verify`(신규 화면 코드 — DOG 게이트) + build·lint. 최종은 사람 관측.
- 배포/운영: 로컬 검증까지 (기존 규약 동일).
- 자기선언 도메인 — **변형 차별성(O10 재발 방지)**: 파일럿의 각 변형은 한 문장 정의가 서로 다르고 시각적으로도 구분돼야 한다 — 관측 과업에 "변형들이 서로 달라 보이는가"를 명시 포함.
- 자기선언 도메인 — **실동작**: 데모는 스크린샷이 아니라 실제로 조작된다(아코디언 펼침/접힘, 탭 전환). 상태(hover/disabled 등)는 조작 또는 명시 토글로 보인다.
- 검토 후 제외: 인증·결제(UE4), DB·마이그레이션(해당 없음). **디자인 게이트 적용**: 새 화면 UI 이므로 askewly-design 스킬 경유(브리프·시그니처·스크린샷 증거) — N-0 매체=화면.

## 결정 로그
- status: resolved
- **파일럿 = 아코디언 + 탭** — 사용자가 아코디언을 명시했고, 탭은 같은 데이터·콘텐츠 계열의 최근접 이웃(비슷한 용어 비교에 이미 연결)이라 갤러리 구조의 일반화를 검증한다.
- **변형 축 2층** — 변형(variant: 구조가 다른 것 — 예: 기본/보더형/분리형/FAQ형)과 상태(state: 같은 구조의 시점 — 펼침/접힘/비활성)를 분리해 렌더. O10 교훈.
- **무료/Pro 표시** — 변형 1번(대표)은 무료 표시 없음, 2번째부터 "Pro" 배지만(잠금 없음). Tailwind Plus 모델 결정(goal 수준 확정 ①)의 표시 층.
- **새 사용자 소유 결정: 없음** — 위는 전부 기확정 결정의 집행 또는 기술 선택. 갤러리 룩은 askewly-design 시그니처를 따른다.

## Step 트리

- [ ] **step-1 — 변형 데이터 층 + 파일럿 데이터**
  - Artifact: `src/data/term-variations.tsx` — 타입(`TermVariation`: id·label·one_liner·tier·states[]·Demo 컴포넌트) + 아코디언 변형 4종(기본/보더 묶음형/분리 카드형/FAQ 형)·탭 변형 3종(기본/필형/세로형) 실동작 데모. 각 변형에 근거 레퍼런스 출처 URL+접근일 주석(전역 인용 규칙).
  - Files: write `src/data/term-variations.tsx`, `src/components/variation-demos/accordion.tsx`, `src/components/variation-demos/tabs.tsx`. read `src/components/term-visual.tsx`(기존 미니목과 중복 회피), `DESIGN.md`(토큰).
  - Risk: 없음 (신규 파일 — 기존 화면 무변경)
  - Dependencies: 없음
  - Verify: `npx tsc -b` 0 에러 · 데모 컴포넌트가 Storybook 없이 단독 렌더 가능(간이 Playwright 마운트 확인은 step-2 갤러리 경유로 대체) · `npx @askewly/design@0.2.0 verify src/components/variation-demos --ext tsx` 위반 0 (토큰 하드코딩 금지).
  - Failure probe: 레지스트리에서 accordion 키를 제거하면 step-2 갤러리 검증(변형 ≥4 렌더)이 FAIL.
  - Commit: changeset `ue2-variation-gallery` (README 절: step-1).

- [ ] **step-2 — 상세 페이지 갤러리 렌더러**
  - Artifact: `term-page.tsx` 에 "바리에이션" 섹션 — 레지스트리에 데이터가 있는 용어만 렌더(없으면 섹션 자체 미노출 — 노출 정책 정합). 변형 카드(실동작 데모 + 라벨 + 한 줄 정의 + 상태 토글) + 2번째 변형부터 "Pro" 배지. lazy 로딩(초기 청크 영향 0). askewly-design 절차로 룩 확정(스크린샷 증거).
  - Files: write `src/components/term-page.tsx`(섹션 추가), `src/components/variation-gallery.tsx`(신설). read `src/data/term-variations.tsx`.
  - Risk: 위험 (term-page 는 전 용어 공용 — 레지스트리 없는 560개 용어에서 레이아웃 회귀 가능. 미등록 용어 렌더 확인을 Verify 에 포함)
  - Dependencies: step-1
  - Verify: Playwright — `/terms/accordion` 에 변형 ≥4 렌더·펼침/접힘 실조작·상태 토글 동작·Pro 배지 표시, `/terms/tabs`(또는 해당 id) 변형 ≥3, **미등록 용어(`/terms/text-field`)는 섹션 미노출 + 기존 레이아웃 무변화**. 라이트/다크 스크린샷. build·lint·tsc PASS. verify(디자인 게이트) 위반 0.
  - Failure probe: 미등록 용어에서 빈 "바리에이션" 헤딩이 노출되면 FAIL (노출 정책 위반). lazy 를 끊으면 초기 청크 증가로 회귀 확인.
  - Commit: changeset `ue2-variation-gallery` (README 절: step-2).

- [ ] **step-3 — 통합 검증 + 사람 관측**
  - Artifact: 통합 시나리오(검색→아코디언 상세→바리에이션 조작→탭 상세) 실행 로그 + 스크린샷 + **사람 관측 1회**(과업: "아코디언 페이지에서 바리에이션들을 만져 보세요 — 서로 달라 보이나요? 원하시던 '생김새·쓰임·바리에이션' 그림에 가까운가요?") 발화 기록을 담은 evidence.
  - Files: write `evidence/ui-encyclopedia/ue2-variation-gallery.md`.
  - Risk: 없음 (관측·기록 중심)
  - Dependencies: step-1, step-2
  - Verify: 통합 Playwright PASS(원문 기록) · build·lint PASS · 사람 관측 기록 존재(발화 인용 — 미달이면 미달로 기록).
  - Failure probe: 사람 관측 없이 닫으면 무효 (UE1 전례 — 기계 PASS 후 사람 10건 적발).
  - Commit: changeset `ue2-variation-gallery` (README 절: step-3).

## 검증/DoD
- **DoD**: 아코디언·탭 상세 페이지에 변형·상태 갤러리가 실동작으로 렌더되고(변형 차별성 포함), 미등록 용어는 무변화이며, Pro 경계 표시 자리가 있고, 사람 관측 1회로 확인된다.
- **Evidence**: `evidence/ui-encyclopedia/ue2-variation-gallery.md`
- **회귀 게이트**: UE5 회귀 스위트 + build·lint·tsc + 디자인 verify.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-27 작성 (UE1 승인 연쇄 집행).
