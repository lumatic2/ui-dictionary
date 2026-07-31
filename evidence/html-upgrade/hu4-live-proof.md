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
- 사용자 관측 1회(라이브 발표 흐름): **대기** — 관측 결과를 새 줄로 추가한다.
