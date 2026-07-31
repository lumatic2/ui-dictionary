# 완료 — SP1 영상 재현 랩

> 완료: 2026-07-31 · SP1 (goal `slide-pipeline-upgrade`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.** 설계 논거·경위는 커밋 메시지와 evidence 에.

## 1. 결과

유튜브 aITV54CLc_U(클로드 PPT 5단계)를 Claude Code 등가로 전 단계 재현했다. getdesign.md MiniMax DESIGN.md 확보(공식 CLI, Stitch 스펙) → PPT용 영어 프리셋(폰트·워드마크·16:9·규칙 10항) → 1장 캘리브레이션 3왕복 수렴(편차 6건 적발·교정, 전부 코드 diff 로 기록) → 본생산 2모드(주제 6장·리디자인 4장, minimax 덱 로컬 테마) → pptxgenjs PPTX 2본. 영상 결정타(네이티브 차트)는 python-pptx(BAR_CLUSTERED·실데이터·pictures 0) + PowerPoint COM 실개봉(Workbook 접근 PASS)으로 검증. 흡수 판정: 채택 3(브랜드 테마 변환·1장 캘리브레이션·리디자인 입력[md 우선]) · 보류 1(비교쌍 교정) — SP2/SP3 scope 확정 입력.

## 2. 이슈와 해결

- fresh 검증자 4건 반영(계획 단계): COM 스크립트 "재사용" 오전제 → 신규 박제로 정정, step-3 과다 번들 → 생성/export 분리, 차트 편집 검증 기준 → COM Workbook 접근으로 구체화, SL3 오귀속 제거.
- http-server 기본 캐시로 재빌드 미반영 관측 → 캐시버스터 쿼리로 우회 (finding 큐: 스킬 문서화 후보).
- 로고 파일 부재 → 텍스트 워드마크 등가 치환 (충실도 장부에 편차 명기).

## 3. 증거

- evidence: `evidence/slide-pipeline/sp1-video-lab.md` — 5단계 충실도 장부(편차 전건) + 흡수 판정 4건 + 산출물 색인. 스크린샷 5매 `evidence/slide-pipeline/img/`.
- 검증: 세 덱 validate·build·overflow 전부 PASS(경고 0) · python-pptx 구조 검증 · COM 실개봉 2본 PASS·프로세스 잔존 0 · 회귀 게이트(스킬 소스·기존 덱·methodology 무접촉) 커밋 diff 확인.
- 실표면: PowerPoint COM 으로 PPTX 2본을 실제로 열어 Slides/ChartShapes/WorkbookAccess assertion 이 (6·1·1)/(4·0·0) 로 평가·성공 보고 — 차트의 엑셀 데이터 연동이 실존함을 확인.
- 평가 못 함: GUI 차트 더블클릭 편집 UX — COM 자동화 범위 밖이라 사용자 관측 1회 대기 (topic.pptx 3번 슬라이드).
- 재현: `node decks/claude-ppt-lab/scripts/export-pptx.mjs topic-deck claude-ppt-lab.topic.pptx && pwsh -File decks/claude-ppt-lab/scripts/open-verify-pptx.ps1 decks/claude-ppt-lab/pptx/claude-ppt-lab.topic.pptx`
- 크기 회고: step 5개·커밋 5개(개설 제외)로 닫힘 — milestone 라벨 정합.
