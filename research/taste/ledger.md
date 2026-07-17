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
