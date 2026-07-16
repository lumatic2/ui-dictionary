# Dogfooding Ledger — Agent Adoption Loop

> AD3 정본 장부. 실제 프로젝트 디자인 작업이 AD1 라우팅 경유로 수행되고 AD2 시그니처로 판정된 기록. 부정 결과(라우팅 미발화·판정 FAIL)도 그대로 장부화한다 — 은폐 금지. 부족 자산(갭) 열은 AD4 수요 주도 확장의 입력이다.

## 항목 스키마

각 건은 아래 필드를 전부 기록한다:

- **id**: `DF-<번호>`
- **날짜 / 프로젝트 / 과제**: 무엇을 어디서
- **유형**: 지정 | 기회주의
- **수행 주체**: 워커 세션(모델) 또는 오케스트레이터
- **라우팅 발화**: 발화 여부 + fetch 목록 (미발화면 그 사실 자체를 기록)
- **시그니처 판정**: 운용 원칙 5·비선호 5 결과 (FAIL 항목 명시, 교정 후 재판정 이력 포함)
- **마찰**: 프로토콜·자산·도구에서 걸린 지점
- **부족 자산(갭)**: 없어서 아쉬웠던 recipe/token/anti-pattern/가이드 → AD4 입력
- **evidence**: diff 커밋·스크린샷·로그 경로

## 장부

<!-- 새 항목은 아래에 append -->

### DF-1 — bootcamp 히어로+번역기 디자인 패스

- 날짜/프로젝트/과제: 2026-07-17 / bootcamp.askewly.com (`lumatic2/ai-bootcamp-2026`) / 메인 히어로+translator 영역 완성도(타이포·간격·상태·한글 줄바꿈·모바일)
- 유형: 지정 ① / 수행 주체: 워커 신규 세션(sonnet), 게이트=오케스트레이터
- 라우팅 발화: **발화** — hook 리마인더 하에 `entry-protocol.md`·`anti-patterns.md` fetch. 프로젝트 자체 DESIGN.md 보유 → askewly tokens.css 미사용(프로토콜 "프로젝트 토큰 우선" 준수, 올바름)
- 시그니처 판정: **PASS** — 원칙 5/5(토큰 파생: 프로젝트 토큰·var(--ring)만 / 액센트=라임 신호 유지 / 절제 계층 / focus-visible 추가로 상태 보강 / 실험 터치 없음), 비선호 0(break-keep 적용이 비선호 2를 교정, 이모지·좌측 라인·매직넘버 없음)
- 마찰: ① 워커가 프로토콜 step 3(style-signature fetch·자가 판정)을 건너뜀 — 판정은 게이트가 수행 ② 워커가 localhost:3000 확인 시도(dev 서버 부재로 무산) — 워커에게 실행 표면이 없음
- 부족 자산(갭): 챗/대화 UI recipe 없음(표면 B에서 재확인 예정), 한글 break-keep 지침이 anti-patterns에 없음(시그니처에만 존재)
- evidence: bootcamp `dogfood/design-pass` 브랜치 커밋(hero/translator pass), 스크린샷 `dogfood1-desktop.png`·`dogfood1-mobile.png`(세션 산출), build PASS, fetch 로그 `dogfood1-log.jsonl`

### DF-2 — bootcamp size-chat 디자인 패스

- 날짜/프로젝트/과제: 2026-07-17 / bootcamp.askewly.com / size-chat 대화 UI(말풍선·입력·로딩/에러 상태·포커스·모바일)
- 유형: 지정 ② / 수행 주체: 워커 신규 세션(sonnet), 게이트=오케스트레이터
- 라우팅 발화: **발화** — `llms.txt`·`entry-protocol.md`·`anti-patterns.md` fetch. 프로젝트 토큰 우선 준수(tokens.css 미사용, 올바름)
- 시그니처 판정: **PASS** — 원칙 5/5(프로젝트 토큰만 / 액센트 절제 / 계층 유지 / 상태 강화: 에러 tint+아이콘·로딩 dot(reduced-motion·sr-only)·focus ring·role=log / 실험 없음), 비선호 0(아이콘=lucide SVG, break-keep 적용, 좌측 라인·이모지·매직넘버 없음)
- 마찰: 워커가 프로토콜 step 3(style-signature 자가 판정)을 또 건너뜀 — **2/2 재현** (판정은 게이트 수행). hook 리마인더 문구에 판정 의무가 없음.
- 부족 자산(갭): ① 챗/대화 UI recipe 부재 재확인(DF-1과 동일) ② hook 리마인더에 시그니처 판정 의무 미포함 ③ 한글 break-keep 지침 anti-patterns 부재(DF-1 재확인)
- evidence: bootcamp `dogfood/design-pass` 커밋 bf49546, build PASS, 스크린샷 `changesets/20260717-dogfood-bootcamp-2/dogfood2-chat-mobile.png`, fetch 로그 `dogfood2-log.jsonl`

### DF-3 — 실사용 피드백: 라우팅이 스타일 수렴을 유발 (기회주의 관측)

- 날짜/프로젝트/과제: 2026-07-17 / 전역(모든 프로젝트) / 사용자 실사용 관측 — "모든 디자인 작업에 askewly UI가 자동 적용되어 디자인이 똑같아짐 + hook 노이즈 과다"
- 유형: 기회주의(실사용 마찰 — 산출물 없는 관측 건)
- 라우팅 발화: 발화 자체가 문제 — hook·규칙 문구("tokens.css의 var만 사용")가 시그니처 확정("팔레트는 프로젝트별, 스타일 고정 금지")과 모순, askewly 스타일을 전 프로젝트에 주입
- 시그니처 판정: 해당 없음 (라우팅 인프라 자체의 결함)
- 마찰: ① AD1 라우팅이 "조회"가 아니라 "스타일 강제"로 작동 — 원 목표(흐름)와 부작용(동질화) 혼동 ② hook이 매 디자인 프롬프트에 발화해 노이즈 과다
- 교정 (2026-07-17 사용자 "진행" 승인): hook 비활성(설정에서 제거, 파일 보존) + 전역 규칙을 "디자인 판정"으로 축소 — 시그니처(원칙 5·비선호 5) 자가 판정만 유지, askewly 토큰은 무토큰 프로젝트 기본값·명시 요청 시로 한정
- 부족 자산(갭): 라우팅 설계 원칙 부재 — "판단 주입(시그니처)"과 "스타일 주입(토큰)"의 구분이 프로토콜·horizon 문서에 없었음 → AD4에서 entry-protocol 재정렬 필요
- evidence: `~/.claude/CLAUDE.md`·`~/.codex/AGENTS.md` 디자인 절 개정, settings.json hook 제거
