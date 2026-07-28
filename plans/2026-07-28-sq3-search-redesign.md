# PLAN — SQ3: O9 검색 결과 UI 재디자인 (사이트 품질 3/4)

> 생성: 2026-07-28 · 갈래: product 기능/화면(검색 결과 표면) · scope: 검색 결과 화면 재디자인 — 정확 일치 vs 연관 언급 계층화 + 요약 헤더 + 결과 행 비주얼. goal `site-quality` 3번 milestone.
Status: approved (사용자 승인 2026-07-28 "ㄱㄱ" — 방향 2건 매듭 + fresh 검증자 반영본)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 자기 사이트의 검색이 자기 디자인 시스템의 품질 증거여야 한다.
- **goal**: `site-quality` · **milestone**: SQ3 (SQ2 완료 후 연쇄).
- **리서치 입력**: 조사 = 이 세션 실측 (별도 research 문서 불요 — 라이브 스크린샷 + 코드 판독으로 현황 전수 파악). 현재: `/search` = 플랫 `TermResultRow` 목록(divide-y), 요약 헤더는 평문("검색 중 검색어: 토글 7개 결과"), 정확 일치와 연관 언급 구분 없음. 스코어링은 `src/lib/search.ts` `scoreTerm`(reasons: name·alias·one_liner·description·visual_anatomy·when_to_use·prompt_phrase 등) + `discoveryQueryBoosts`(큐레이션 정답 부스트). 원 관측: O9 "너무 구려" (`archive/plans/2026-07-27-ue1-encyclopedia-navigation.md` finding 큐, 관측 2회차).

## Scope Boundary
- **포함**: ① 계층화 정보구조 — 정확 일치(이름·별칭 일치 + discovery boost 정답)와 연관 언급(설명·사용상황·AI문장 매치)을 섹션 분리, 요약 헤더 재디자인 ② 결과 행 비주얼 재디자인(정확 일치 = 큰 비주얼 행, 연관 = 컴팩트 행) — askewly-design entry-protocol 경유 ③ 통합 검증(디자인 verify PASS·스모크·실배포) + 사람 관측 1회.
- **제외**: 검색 스코어링 알고리즘 변경(순위 로직 불변 — 표현만) · 사이드바 변경(사용자 확정: 현상 유지) · 검색 제안(topbar autocomplete) 재디자인 · SSG(SQ4).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / 사람 관측 대기(push 후 사용자 왕복)
- rollback/cleanup: 기존 파일 수정 중심 — 커밋 단위 revert. 계층 분리가 결과 누락을 만들면(두 섹션 합 ≠ 전체) 즉시 검출되도록 통합 검증에 개수 대조 포함.

## 스캐폴딩 결정
- source-of-truth: 디자인 판단 = askewly-design entry-protocol(`https://ui.askewly.com/llms.txt` → entry-protocol.md — 실행 시 fetch·준수, 스킬 절차 그대로) · 색·타이포 = 사이트 토큰 SSOT · 검색 순위 정본 = `src/lib/search.ts`(스코어 불변, 티어 판정만 추가).
- 검증: `npx @askewly/design verify src/components --ext tsx` **비악화**(색 0 유지·타이포 7건 초과 금지 — 수정 파일은 위반 0) + build·lint + Playwright(계층 렌더·개수 대조·기존 검색 회귀) + 실배포 스팟 체크 + **사람 관측 1회(DoD — 취향 게이트)**.
- 배포/운영: push 는 완료 절차 일부(Cloudflare Pages 자동) — 라우트 무변경이라 SPA 폴백 추가 불요.
- 자기선언 도메인 — **순위 보존 의무**: 계층화는 표현 계층이다 — 티어 안 정렬은 기존 스코어 순 그대로, 두 섹션 합계 = 기존 결과 전체(누락·중복 0). 통합 검증에 개수 대조 포함.
- 검토 후 제외: 검색 스코어링·부스트 테이블 개편 — O9 는 표현 결함이지 검색 품질 결함이 아니다(검색 로직은 UE1 O8 수리로 이미 검증됨).

## 결정 로그
- status: resolved
- **레이아웃 방향 (사용자 확정 2026-07-28)**: 계층 섹션형 — 정확 일치는 큰 비주얼 행 상단 섹션, 연관 언급은 컴팩트 행 섹션. 요약 헤더 재디자인 포함.
- **사이드바 (사용자 확정 2026-07-28)**: 현상 유지 — 검색 중에도 직전 축 트리 그대로, 결과 영역만 재디자인.
- **기술 결정**: ① 정확 일치 티어 = name·alias 일치 **또는 큐레이션 정답**(discoveryQueryBoosts 매치·use-case 칩 pin — 후자는 `applyUseCaseResults` 가 score 1000+ 로 고정하는 경로, fresh 검증자 적발). 현재 boost 매치는 `reasons:"prompt_phrase"` 로 실필드 매치와 구별 불가 → `scoreTerm`/pin 경로에 **별도 티어 채널(boolean)** 을 추가한다. 스코어·순위 불변. ② 섹션 라벨·카피는 기존 사이트 한국어 검색 어휘를 따른다 — 티어 의미는 "네가 찾는 그것(정답)" vs "본문에 언급됨(연관)". ③ 행 변형은 `TermResultRow` variant 프롭(hero/compact)으로, **variant 미지정 기본값 = 기존 렌더와 동일**(브라우징 목록 무회귀 계약) — 별도 컴포넌트 복제 금지.
- 그 외 **새 사용자 소유 결정: 없음.** (boost·use-case pin 을 정답 티어로 두는 라벨링 포함, 최종 시각 취향은 사람 관측 1회가 게이트 — 어긋나면 관측에서 잡힌다)

## Step 트리

- [x] **step-1 — 계층화 정보구조 + 요약 헤더**
  - Artifact: `search.ts` 에 정확 일치 티어 채널(name·alias·boost — boolean, prompt_phrase reason 과 분리) 추가 + `App.tsx` `applyUseCaseResults` pin 결과도 정답 티어 표시(스코어·정렬 불변) + 검색 렌더를 두 섹션(정확 일치 N / 연관 언급 M)으로 분리 + 요약 헤더 재디자인(검색어 강조·개수·초기화 액션 정리).
  - Files: write examples/ui-vocabulary-site/src/lib/search.ts, src/App.tsx(hasActiveSearch 렌더 블록·applyUseCaseResults). read src/lib/search.ts 전체(scoreTerm·boost 경로).
  - Risk: 기계적 (표현 계층 — 개수 대조로 누락 즉시 검출)
  - Dependencies: 없음
  - Verify: tsc·build PASS + dev 브라우저에서 "토글"·"accordion" 검색 — 두 섹션 렌더·합계 = 기존 결과 수·순위 보존·콘솔 0에러.
  - Failure probe: 검색어 없는 필터 탐색(browsing) 경로 — reasons 빈 배열이라 전부 연관 티어로 새는 회귀. 탐색 모드는 계층 미적용(기존 플랫 목록) 확인.
  - Commit: changeset `sq3-search-redesign` (README 절: step-1).

- [x] **step-2 — 결과 행 비주얼 재디자인 (askewly-design 경유)**
  - Artifact: askewly-design entry-protocol fetch·준수 후 — `TermResultRow` variant 도입: 정확 일치 = 큰 비주얼 행(미니목 확대·이름 위계 강화), 연관 언급 = 컴팩트 행(비주얼 축소·매치 근거 표기) + 섹션 타이틀·간격 시스템.
  - Files: write examples/ui-vocabulary-site/src/components/term-result-row.tsx, src/App.tsx(섹션 스타일). read docs/design-system/(entry-protocol 이 지시하는 원격 정본).
  - Risk: 위험 (검색 전 표면 시각 변경 — 스크린샷 증거 + verify 로 격리, 커밋 revert 가능)
  - Dependencies: step-1
  - Verify: 수정 파일 디자인 verify 위반 0 + dev 브라우저 스크린샷(2개 검색어, 데스크톱 1440px + 모바일 390px) 육안 대조 + 용어 상세 이동(행 클릭) 무회귀.
  - Failure probe: ① TermResultRow 브라우징 목록(필터 탐색) — variant 기본값이 기존 렌더와 동일한지 화면 1개로 확인 ② hero 행(미니목 확대)이 390px 에서 무너지지 않는지.
  - Commit: changeset `sq3-search-redesign` (README 절: step-2).

- [x] **step-3 — 통합 검증 + 실배포 + 사람 관측 (SQ3 마감)**
  - Artifact: 통합 검증 + `evidence/site-quality/sq3-search-redesign.md` + push·실배포 스팟 체크 + 사람 관측 요청.
  - Files: write evidence/site-quality/sq3-search-redesign.md. 실행: verify 전체·build·lint·Playwright(/search?q=토글 · /search?q=accordion · 브라우징 1화면 · /terms/accordion)·push·실배포 확인.
  - Risk: 기계적 (검증·기록·배포 확인)
  - Dependencies: step-2
  - Verify: verify 비악화(색 0·타이포 ≤7) + Playwright 4항 콘솔 0에러 + 실배포 /search 계층 렌더 확인.
  - Failure probe: ① 검색 딥링크(`/search?q=…&filter=…`) — filter 동반 검색에서 섹션 분리·개수 대조 1회 실측 ② 0건 검색어 — EmptySearchRecovery 경로 무회귀 ③ use-case 칩 활성 검색 — pin 결과가 정답 티어 섹션에 뜨는지.
  - Commit: changeset `sq3-search-redesign` (README 절: step-3).

## 검증/DoD
- **DoD**: 검색 결과 화면이 askewly-design 경유로 재디자인되고(정확 일치 vs 연관 언급 계층화 포함), 디자인 verify PASS(비악화) + **사람 관측 1회 통과**.
- **Evidence**: `evidence/site-quality/sq3-search-redesign.md`
- **회귀 게이트**: 검색 순위·개수 보존(계층 합 = 전체) + 브라우징 목록 무회귀 + 용어 상세 이동 무회귀 + Playwright 콘솔 0에러.

## 수치 출처
- 현황(플랫 목록·평문 헤더) = 2026-07-28 라이브 스크린샷(`ui.askewly.com/search?q=토글`) + `App.tsx`·`term-result-row.tsx`·`search.ts` 코드 판독. 원 관측 O9 = `archive/plans/2026-07-27-ue1-encyclopedia-navigation.md`.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)
- **use-case 칩 = 데드 경로**: `setActiveUseCaseId` 의 비-null 호출이 코드 전체에 0곳 — 칩 UI 진입점이 없어 use-case 검색이 실사용 불가. pin 경로 티어 승격(exact:true)은 구현했으나 실동작 probe 불가(코드 검증만). 진입점 복원/제거 판단은 별도 후보.
- App.tsx 카카오 로그인 버튼에 hex 리터럴(`#fee500` 등) 잔존 — verify 스코프(src/components) 밖이라 SQ1 미포함. `--brand-kakao-*` 상수(index.css)로 통일 후보.

## 진행 로그
- 2026-07-28 작성 — 디자인 방향 2건(계층 섹션형·사이드바 현상 유지) AskUserQuestion 으로 매듭.
- 2026-07-28 fresh 계획 검증자(sonnet) 지적 반영 — boost 매치 티어 채널 분리(prompt_phrase reason 과 구별 불가 실측) · use-case 칩 pin 경로 티어 판정 추가 · variant 기본값 계약 명시 · 모바일 390px·0건 검색 probe 추가. "기존 조건부 격돌" 우려는 상호 배타 확인(이상 없음).
