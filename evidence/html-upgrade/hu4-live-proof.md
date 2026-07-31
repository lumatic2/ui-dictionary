# HU4 — 통합 실증 (정본 덱 라이브 리허설 + 발표 게이트)

> 2026-07-31 · plan: `plans/2026-07-31-hu4-live-proof.md` · 대상: `decks/askewly-design-intro` · changeset: custom-skills `20260731-hu4-live-proof`

## step-1 — 정본 덱 업그레이드 + 리허설 (커밋 1438619)

- 적용: 덱 tools 배포본 재동기화(로컬 커스텀 없음 확인 — git 이력상 템플릿 사본, 재동기화 선례 c29c9d6) · fragment s2 hero-cards(3)·s5 step-flow(5) — 서사 적합 장만 · speaker.html 산출 · standalone 2.92MB · `--notes` vector PDF 14페이지(7+7).
- **적합 판정 기록**: bento = 해당 없음(s6 은 텍스트 3항 — 수치 스탯 없음, summary-grid 적정) · 이미지 = 해당 없음(표지는 hero-motion 소유·본문은 다이어그램/차트 소유 — 무리한 끼워넣기 금지 계약. 3원천 실증은 HU3 fixture 로 완료).
- 리허설 실측(`REHEARSAL PASS`): →키 15회로 전장 진행 — s2 에서 +1/3→+3/3, s5 에서 +1/5→+5/5 스피커 pos 완전 추종, 콘솔 에러 0.
- **정적 회귀: 픽셀 diff 0** — capture 재산출 7장 전부 기존 기준(export/baseline-png)과 bbox None(완전 일치). fragment·스피커 배선이 export 에 전혀 새지 않음이 픽셀 수준 증명.
- standalone 오프라인(전 요청 차단 file://): 7장 내비·폰트 인라인 `STANDALONE-OFFLINE PASS`.

## step-2 — 발표 게이트 명문화 (custom-skills 2fc6a4b)

- verification.md 「발표 전 체크」(G7 하위): 오프라인 리허설·대비 AAA 지향·프로젝터/외부 모니터 실측(실측은 발표자 몫 명시)·리모컨 표준 키 가정·스피커 뷰 예행.
- methodology/slide-production.md 「발표 운영」 절 신설(운영 장치 6종 + 정본 백링크).

## finding 큐 정리 (goal 마감 이월분)

- D1 few-shot 예시 장 패턴 G5 형식화 · D2 Presenton 정밀 벤치마크 · Auto-Animate(HU2 이월) · 이미지 최적화 빌드(리사이즈·webp) · split-screen sourceNote 겹침 배치 재검토(HU3 관측 노트).

## 게이트

- 자동·리허설·회귀: PASS (위 실측).
- 사용자 관측 1회차 2026-07-31: **부분 FAIL — 3건 반영** ① fragment 는 좋으나 기본값이 아니어야 함(사용자 확정: 기본=전체 표시, 요청 장만) → 계약 반전+정본 덱 제거 ② 스피커→본편 동기 불통(실크롬 file:// = opaque origin — BC·localStorage 무음 사망, Playwright headless 와 환경차) → postMessage 릴레이+하트비트, 합성 재현 `POSTMESSAGE-SYNC PASS` ③ 스피커 노트 수정 불가 → textarea 편집+수정본 복사. 회귀: 리허설 PASS·픽셀 diff 0/7 유지.
- 사용자 관측 2회차 2026-07-31: **부분 FAIL — 2건 반영** ① 스피커→본편 여전히 단방향 불통 — 원인은 릴레이가 아니라 **미리보기 iframe 의 포커스 강탈**(iframe 클릭 후 화살표 키가 미리보기 자신만 넘김 — "스피커는 넘어가는데 본편은 안 넘어감" 증상의 실체) → iframe `pointer-events:none`+`tabindex=-1`, navScript top-window 가드. 재현 테스트 `IFRAME-GUARD PASS`(iframe 내 keydown 무효·스피커 문서 keydown → 본편 전진) ② 장 넘김 시 글자가 좌우로 늘었다 재정렬 = FOUT(새 문서마다 대체 폰트 1~2프레임) → head FOUT 게이트(`document.fonts.load` 대기·500ms 상한·print/capture 스킵)+콘텐츠 숨김 CSS. 회귀: `POSTMESSAGE-SYNC`·`REHEARSAL`·`STANDALONE-OFFLINE` PASS, capture diff 4장 비트 동일·3장 파랑 최대 2/255 렌더 노이즈(비지각·콘텐츠 무변). custom-skills 27e4836.
- 사용자 관측 3회차 2026-07-31: **부분 FAIL — 1건 반영** (동기·FOUT 는 "잘 된다" 확인) 스피커 창이 계속 렌더링 새로고침되며 깜빡임 — 원인 = **다중 덱 창 announce 경합**(스피커가 이름 있는 창이라 잔존 덱 창과 현재 본편이 서로 다른 slide 번호를 번갈아 announce → 미리보기·노트 1.2s 주기 갈아끼움) → `createDeckSync({single:true})` 단일 마스터 규칙(본편 하나만 추종·master 사망 시 입양·master 존재 시 브로드캐스트 차단) + show() DOM 쓰기 멱등화. 재현 `TWO-DECKS PASS`(0.5s spam announce 에도 미리보기 재로드 0·step 은 master 만 전진), idle DOM 변이 5회/6s→0회. 회귀 4종 PASS. custom-skills 5a156cf.
- 사용자 관측 4회차 2026-07-31: **부분 FAIL — 1건 반영** (깜빡임 해소 확인, 단 본편-스피커 타이밍 어긋남) 원인 = 재연결 지연: 장 넘김마다 본편이 새 문서로 교체되고 다음 하트비트(≤1.2s)가 와야 스피커가 따라옴 → `navigateTo()` 목적지 선공지 + `__navigating` 레이스 가드. 실측 지연 42/269/21ms·역방향 24ms(`SYNC-LAG PASS`), 회귀 4종 PASS. custom-skills 205810b.
- 사용자 관측 5회차 2026-07-31: **부분 FAIL — 1건 반영** (타이밍 동기 해소 확인, 단 스피커 미리보기에서 넘김 시 FOUT 재현) 원인 = 미리보기 iframe 이 `?capture` 로 열려 r2 FOUT 게이트가 스킵됨 → 스킵 조건을 "최상위 print/capture(익스포터)"로 한정, iframe 내장 capture 는 게이트 적용. `PREVIEW-FOUT PASS`(iframe 게이트 발화·해제 / 최상위 capture 미부착 — 익스포터 무영향), 회귀 4종 PASS. custom-skills d8ac491.
- 사용자 관측 6회차 2026-07-31: **PASS** ("잘 되는거 확인") — fragment 기본 미적용·양방향 동기(즉시)·노트 창내 수정·단일 마스터(무깜빡임)·본편/미리보기 FOUT 게이트 전부 실크롬 file:// 에서 사용자 실측 통과. **게이트 닫힘.**
