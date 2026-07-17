# Taste Ledger — 판단 흡수 장부

> 계약: `research/taste-loop.md` (TC1). 관찰 1건 = 1항목, 스키마 7필드. **갱신 없는 관찰은 `미소화`로 표기하고 Close Criteria 계수에서 제외한다.** 취향 정본 = 사용자 큐레이션(Notion·Linear·Codex·Claude·Google, 2026-07-17 확정).

## 항목 스키마

- **id**: `T-<번호>`
- **source**: 제품/표면 + URL + 접근일
- **관찰**: 무엇을 봤나 (스크린샷 경로)
- **원리**: 소스 독립적 서술
- **diff**: 우리 판단 자산과의 차이
- **갱신**: 반영 자산·위치·changeset (또는 `미소화 — <사유>`)
- **게이트**: 성립성 결과 (제품 실화면 `해당 없음`)

## 장부

<!-- 새 항목은 아래에 append -->

### T-1 — Notion: 디스플레이 타이포 압축

- source: Notion 마케팅 히어로(한국어) — https://www.notion.com/ko (접근 2026-07-17). ※앱 에디터는 이 Chrome 로그아웃으로 미관찰(정직 기록)
- 관찰: 한글 헤드라인 96px/weight 600에 **letter-spacing -4.6px(≈-4.8%)·line-height 1.04·keep-all** (`tc2-notion-marketing.png`, computed style 실측)
- 원리: 디스플레이 스케일 타이포는 크기만 키우는 게 아니라 자간을 강하게 조이고 행간을 1.0대로 눌러 한 덩어리로 만든다 — 한글에도 동일 적용(keep-all 병행)
- diff: 클러스터 13(한글 타이포)은 break-keep만 다룸 — 디스플레이 압축 판단 부재
- 갱신: `docs/design-system/anti-patterns.md` 클러스터 13 보강 (changeset 124)
- 게이트: 해당 없음(실서비스)

### T-2 — Notion: 잉크 알파 완화

- source: 동일 페이지 body computed — rgba(0,0,0,0.95)
- 관찰: 본문 잉크가 순검정이 아니라 95% 알파
- 원리: 잉크는 순#000을 피하고 미세 완화 — 대비 과잉의 딱딱함 제거(T-7 종이 웜 틴트와 쌍)
- diff: 잉크·종이의 순수값 회피 판단이 자산 어디에도 없음
- 갱신: `docs/design-system/anti-patterns.md` 클러스터 14 신설(T-7과 합산 근거) (changeset 124)
- 게이트: 해당 없음

### T-3 — Notion: 컴팩트 CTA — 미소화

- source: 동일 페이지 CTA computed — padding 6px 15px, radius 8px, shadow 없음
- 관찰: 마케팅 CTA가 앱 밀도의 컴팩트 버튼
- 원리: CTA도 제품과 같은 밀도 언어 — 과대 버튼 금지
- diff: **중복** — `recipes/forms/button.md` Anti-patterns(오버사이즈 풀필·헤비 섀도)에 이미 존재
- 갱신: 미소화 — 기존 판단 재확인 증거(계수 제외)
- 게이트: 해당 없음

### T-4 — Linear: 보더리스 명도 사다리 위계

- source: Linear 앱(로그인) Active issues — https://linear.app/mod41/team/MOD/active (접근 2026-07-17, `tc2-linear-app.png`)
- 관찰: 다크 앱 전체가 **보더 0px** — 표면 위계를 lch 명도 사다리(L 1.82→4.52→7.67, 동일 hue 272, 무채도)로만 구성. 이슈 행·사이드바 전부 무보더
- 원리: 위계의 1차 수단은 보더가 아니라 동일 색상의 극미세 명도 단계(ΔL≈3) — 보더는 최후 수단
- diff: 우리 자산에 표면 위계 수단 판단이 없고, 자체 사이트는 보더 의존
- 갱신: `docs/design-system/anti-patterns.md` 클러스터 15 신설 (changeset 124)
- 게이트: 해당 없음

### T-5 — Linear: 행높이 44px = 터치 타깃 하한과 밀도의 균형

- source: 동일 화면 이슈 행 computed — 높이 44px, 16px 본문
- 관찰: 고밀도 도구인데 행높이가 터치 타깃 최소치(44px)와 정확히 일치
- 원리: 밀도를 올려도 인터랙티브 행 높이는 터치 타깃 하한 아래로 내리지 않는다
- diff: `interactive-data-table` recipe Checks에 행높이-터치타깃 항목 부재
- 갱신: `recipes/data-display/interactive-data-table.md` Checks 보강 (changeset 124)
- 게이트: 해당 없음

### T-6 — Linear: 액센트 최소 운용 — 미소화

- source: 동일 화면 — 컬러 요소가 팀 아이콘·아바타 2점뿐, 나머지 완전 무채
- 원리: 액센트는 식별 신호에만
- diff: **중복** — 시그니처 운용 원칙 2("액센트는 신호")와 동일
- 갱신: 미소화 — 재확인 증거(계수 제외)
- 게이트: 해당 없음

### T-7 — Claude: 웜 종이 + 핵심 표면만 순백 부양

- source: claude.ai 앱(로그인) 새 채팅 — https://claude.ai/new (접근 2026-07-17, `tc2-claude-new.png`)
- 관찰: 베이스가 rgb(248,248,246) 웜 오프화이트, **입력창만 순백 + radius 20px**로 화면에서 가장 밝고 가장 둥근 표면. 사이드바는 박스 없는 플랫 텍스트 목록
- 원리: 라이트 테마에서 순백은 배경이 아니라 *들어올릴 1곳*에 쓰는 위계 재화다 — 제품의 무게중심(입력창)이 가장 밝은 표면과 가장 뚜렷한 형태를 독점한다
- diff: 잉크·종이 판단 부재(T-2와 합산) + chat recipe에 입력창 부양 판단 없음
- 갱신: anti-patterns 클러스터 14(T-2와 합산 근거, changeset 124) + `recipes/application-ui/chat-conversation-panel.md` Variants 보강 (changeset 125)
- 게이트: 해당 없음

### T-8 — Claude: 인사말 단일 액센트 글리프 — 시그니처 보강 제안 (사용자 확인 대기)

- source: 동일 화면 — 인사말 옆 테라코타 별표(✳) 1점이 화면 유일 브랜드 컬러
- 관찰: 첫 화면의 브랜드 순간이 로고도 일러스트도 아닌 글리프 1점
- 원리: 액센트 신호의 최소 단위는 "글리프 1점"까지 내려갈 수 있다 — 원칙 2의 하한 예시
- diff: 시그니처 원칙 2와 방향 일치하나 하한 예시가 없음 — 시그니처 개정은 사용자 확인 필수(계약)
- 갱신: `docs/design-system/style-signature.md` 원칙 2 보강 — 사용자 승인 2026-07-17 (changeset 127, 흡수 확정)
- 게이트: 해당 없음

### T-9 — Codex: 실제 제품 UI가 히어로 증거

- source: Codex 마케팅(한국어) — https://chatgpt.com/ko-KR/codex/ (접근 2026-07-17, `tc2-codex-marketing.png`). ※앱은 로그아웃으로 미관찰
- 관찰: 히어로 미디어가 일러스트가 아니라 **실제 제품 화면**(diff 리뷰·파일트리·커밋 UI가 실데이터로 렌더된 캡처) — 다크 아우라 배경 위 백색 제품 카드
- 원리: 제품 랜딩의 1순위 증거는 실제 제품 화면이다 — 말·일러스트로 설명하지 말고 UI가 스스로 증명하게 한다
- diff: `landing-hero` recipe에 미디어 선택 기준(실제품 우선) 없음
- 갱신: `recipes/marketing/landing-hero.md` Checks 보강 (changeset 125)
- 게이트: 해당 없음

### T-10 — Codex: 다크 베이스 상단 아우라 그라디언트

- source: 동일 페이지 — 순흑 베이스(#000) 상단에만 블루-바이올렛 소프트 그라디언트 아우라, 콘텐츠 카드가 그 위에 부유
- 원리: 다크 히어로의 색은 전면 도포가 아니라 상단 아우라 1곳 — 콘텐츠 대비는 보존하고 분위기만 공급
- diff: `mesh-gradient-surface` recipe에 다크 베이스 아우라 variant 없음
- 갱신: `recipes/marketing/mesh-gradient-surface.md` Variants 보강 (changeset 125)
- 게이트: 해당 없음

### T-11 — Antigravity: 디스플레이 굵기 역전

- source: Google Antigravity — https://antigravity.google/ (접근 2026-07-17, `tc2-antigravity.png`)
- 관찰: 히어로 80px가 **weight 450** — 크기가 커질수록 굵기를 오히려 내림(Google Sans Flex 가변축 활용)
- 원리: 디스플레이 스케일에서 무게는 크기가 담당한다 — 굵기는 본문 수준(±1단)으로 유지해야 대형 타이포가 우아하게 선다
- diff: T-1과 같은 클러스터(디스플레이 압축)의 굵기 축 근거
- 갱신: anti-patterns 클러스터 13 보강에 합산 근거로 반영 (changeset 124)
- 게이트: 해당 없음

### T-12 — Antigravity: 장식은 여백에, 콘텐츠 축은 순정

- source: 동일 페이지 — 컬러 컨페티 파티클이 **좌측 여백에만** 흩어지고 중앙 콘텐츠 축(로고·헤드라인·CTA)은 완전 무장식 백색
- 원리: 앰비언트 장식은 콘텐츠 축과 공간을 나눈다 — 읽는 축은 순정으로 두고 장식은 주변 여백이 소유
- diff: `canvas-particle-field` recipe는 배경 전면 배치만 다룸 — 여백 한정 배치 variant 없음
- 갱신: `recipes/application-ui/canvas-particle-field.md` Variants 보강 (changeset 126)
- 게이트: 해당 없음

### T-13 — Dribbble: Real Estate CRM 콘셉트 — 게이트 FAIL, 역이용 흡수

- source: "Real Estate CRM Dashboard UI Design" (Nixtio) — https://dribbble.com/shots/27565263 (접근 2026-07-17, `tc3-dribbble-crm.png`)
- 관찰: 운영 도구 첫 뷰포트를 대형 인사("Good morning, Elizabeth!")+매물 사진 배경이 점유, 스탯 카드가 사진 위 부유, 아크형 장식 차트(축·단위 없음)
- 원리(역): 콘셉트 아트의 관성이 실무에서 무너지는 3형태 — 인사말 히어로·사진 배경 위 데이터·축 없는 장식 차트
- diff: 이 실패형이 anti-patterns에 없음 (클러스터 12는 기능 과다 축, 이건 콘셉트 관성 축)
- 갱신: `docs/design-system/anti-patterns.md` 클러스터 16 신설 (changeset 129)
- 게이트: **FAIL** — ① 실데이터: 리드 테이블·긴 매물명·수백 행 표면 부재, 사진 밝기에 따라 카드 대비 붕괴 ② 상태: 전 위젯 완벽 데이터 가정, 빈/에러 표현 불가, 차트에 축·단위 없음 ③ 한글: 대형 인사는 성립 가능하나 부차 ④ 접근성: 사진 위 텍스트 대비 미보장·장식 차트 color-only

### T-14 — Dribbble: 단일 액센트 주간 차트 — 게이트 PASS

- source: "Reading tracker – personal library dashboard" (Maria M) — https://dribbble.com/shots/27565039 (접근 2026-07-17, `tc3-dribbble-reading.png`)
- 관찰: 주간 바 차트에서 6일은 무채 베이지, 강조일(Sat)만 액센트 1색 — 축 라벨(Mon~Sun)·Avg/Peak 각주·강조일 텍스트 라벨 병행
- 원리: 데이터 강조는 전 계열 채색이 아니라 **무채 베이스 + 강조 1점**(텍스트 라벨 병행 조건) — 시그니처 원칙 2의 데이터 표면 적용형
- diff: `stat-summary-grid` recipe에 강조 운용 판단 없음 (클러스터 4는 color-only 금지 축으로 별개)
- 갱신: `recipes/data-display/stat-summary-grid.md` Checks 보강 (changeset 129)
- 게이트: **PASS** — ① 실데이터: 주 7칸 고정이라 폭발 없음, 값·축 실존 ② 상태: 빈 주간=0높이 바로 표현 가능, 원리는 상태와 독립 ③ 한글: 요일 라벨 치환 성립 ④ 접근성: 강조가 색+텍스트 라벨 병행(단독 색 아님)

### T-15 — HIG: 위계는 서체 증식이 아니라 굵기·크기·색 — 채택

- source: Apple HIG Typography — https://developer.apple.com/design/human-interface-guidelines/typography (접근 2026-07-17, 리서처 수집)
- 관찰: "Minimize the number of typefaces… Mixing too many different typefaces can obscure your information hierarchy" — 위계는 한두 서체 안에서 weight/size/color 축으로
- 원리: 타이포 위계의 변수는 서체 수가 아니라 굵기·크기·색 — 서체 추가는 위계를 흐린다
- diff: 클러스터 13은 줄바꿈·압축만 — 서체 증식 축 부재
- 갱신: anti-patterns 클러스터 13 보강 (changeset 131)
- 게이트: 해당 없음(성문 원칙)

### T-16 — Material 3: 모션은 전환 규모에 비례 — 채택

- source: M3 Easing and duration — https://m3.material.io/styles/motion/easing-and-duration/tokens-specs (접근 2026-07-17)
- 관찰: 작은 유틸리티 전환=짧은 duration+Standard easing, 크고 주목할 전환=긴 duration+Emphasized easing — 규모-비례 규칙
- 원리: 모션의 길이·표현성은 전환되는 대상의 규모·중요도에 비례한다 — 작은 상태 변화에 과장 모션 금지, 큰 전환에 인색한 모션 금지
- diff: expressive-stack 판정 절차에 티어 선택 규칙만 있고 모션 스케일 판단 없음
- 갱신: `knowledge/expressive-stack.md` 판정 절차 6 추가 (changeset 131)
- 게이트: 해당 없음

### T-17 — Polaris: 버튼 레이블은 동사 선행 — 채택

- source: Polaris Button — https://polaris-react.shopify.com/components/actions/button (접근 2026-07-17)
- 관찰: "{verb}+{noun}" 형식, 잉여 동사(View/Go/Read) 생략, 관사 배제 — "무슨 일이 일어날지 예측 가능해야"
- 원리: 액션 레이블은 행동 동사가 선행하고 결과를 예측 가능하게 — 명사형·장식형 레이블 금지
- diff: `button` recipe에 레이블 문구 판단 부재(시각 계약만)
- 갱신: `recipes/forms/button.md` Checks 보강 (changeset 131)
- 게이트: 해당 없음

### T-18 — Material 3: 색 역할 어휘(primary/secondary/tertiary) — 기각

- source: M3 Color roles — https://m3.material.io/styles/color/roles (접근 2026-07-17)
- 관찰: 강조를 3단 색 역할 토큰 체계로 규정, 역할 오적용은 접근성 파괴
- 원리(그들의): 강조 = 올바른 역할 토큰 선택
- diff·기각 사유: **기각** — 우리 철학은 "팔레트·토큰 체계는 프로젝트 소유, 스타일 고정 금지"(시그니처 철학 절). M3 역할 어휘를 전역 채택하면 특정 토큰 체계 종속이 생기고, 액센트 운용 판단은 이미 원칙 2가 체계-중립으로 보유. 접근성-by-construction 취지는 기존 검증 루프(WCAG 체크)가 담당
- 갱신: 없음 — 기각 기록 자체가 산출물
- 게이트: 해당 없음

### T-19 — HIG: 재질(Liquid Glass) 계층 — 기각(중복)

- source: HIG Materials — https://developer.apple.com/design/human-interface-guidelines/materials (접근 2026-07-17)
- 관찰: 콘텐츠 위에 부유하는 재질 레이어로 크롬/콘텐츠 분리, 과용 경계
- diff·기각 사유: **기각(중복)** — 특정 재질 언어는 플랫폼 스타일(스타일 고정 금지 충돌). "콘텐츠가 주인공, 크롬 후퇴" 취지는 `principles.md` 과제 우선 + glass-panel recipe(블러 과용 금지)에 기존재
- 갱신: 없음
- 게이트: 해당 없음
