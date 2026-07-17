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
- 갱신: 보류 — 시그니처 보강 제안으로 마감 보고에 상정(확인 전 미계수)
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
