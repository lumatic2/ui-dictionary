# SP1 — 영상 재현 랩 충실도 장부 + 흡수 판정

> 2026-07-31 · plan: `plans/2026-07-31-sp1-video-reproduction-lab.md` · 영상: https://www.youtube.com/watch?v=aITV54CLc_U (자동 자막, 접근일 2026-07-31 — `research/sources/claude-ppt-aITV54CLc_U.transcript.md`)
> 재현 환경 = Claude Code 등가 (사용자 확정 2026-07-31 — claude.ai 웹 프로젝트 미사용).

## 1. 영상 5단계 충실도 장부

| 단계 | 영상 주장 | 재현 결과 | 편차 |
|---|---|---|---|
| ① 스타일 선정 [1:51–2:35] | getdesign.md에서 브랜드(미니맥스) 디자인 시스템 프롬프트 복사 | `npx getdesign@latest add minimax` 로 DESIGN.md 전문(37.9KB, Google/Stitch 스펙: YAML 토큰+rationale) 확보 — `research/sources/minimax-design-md.md` | 영상은 웹 UI 카피 버튼, 우리는 공식 CLI. 내용물 동일 계보. 영상 주장("70개 가까이") 대비 실측 약 75개 공개·300+ 준비 |
| ② 커스터마이즈 [2:35–4:03] | 폰트(Pretendard 파일 업로드)·로고 교체·16:9·레이아웃 규칙, 프롬프트는 영어 유지 | `decks/claude-ppt-lab/style-preset.md` — 영어 프롬프트 본문, Pretendard·워드마크·16:9·앵커/밀도/키컬러 규칙 10항 | **편차 2**: ⓐ 폰트 파일 업로드 대신 CDN/로컬 설치 폰트 참조 ⓑ 로고 파일이 레포에 없어 텍스트 워드마크 "Askewly" 로 등가 치환 |
| ③ 1장 미세 조정 [4:03–6:18] | 테스트 주제 1장 생성→피드백 반복(제목/부제 간격·본문 위치·넘버링/로고 스왑) | 같은 테스트 주제("한일 AI 리터러시 비교") 1장, 3회 왕복 수렴 — r1: 편차 5건 적발(챕터명 부재·중앙정렬·간격 과다·2색 혼용·푸터 불일치) → r2: 기준선 불일치 1건 → r3: 편차 0. 스크린샷 `evidence/slide-pipeline/img/lab-calib-r{1,2,3}.png` | 영상의 "대화 피드백"이 우리는 "빌더 코드 diff"다 — 교정이 재현 가능한 diff로 남는 점은 오히려 우월. 영상의 비교쌍 파일 업로드 기법은 이번 랩에서 미사용(스크린샷 관측으로 충분했음) |
| ④ 프로젝트 박제 [6:18–7:12] | 완성 프롬프트를 Claude 프로젝트 지침에, 로고를 지식에 업로드 | 프리셋 v1을 `style-preset.md` 로 박제 + minimax 테마를 덱 로컬 `tools/src/theme.mjs` 에 코드화 | 등가 치환의 핵심 차이: 우리 "지침" = 버전 관리되는 파일 + 기계 검증(validate·lint) 내장 — 프로젝트 지침보다 강한 형태 |
| ⑤ 제작·리디자인 [7:12–8:59] | (a) 주제만 입력 → PPT (b) 저품질 PPT/PDF 업로드 → 내 스타일 리디자인. 차트는 네이티브(더블클릭→엑셀) | (a) 주제 덱 6장(실데이터 차트 포함) (b) 실존 저품질 소스(SL1 완료 보고서 md)→4장 리디자인. pptxgenjs 로 PPTX 2본 산출 | 리디자인 입력이 md 문서(영상은 PPT/PDF 업로드) — PDF/PPTX 파싱 입력 경로는 미실증, SP2 후보로 이월 |

**결정타 검증 (네이티브 차트)**: python-pptx — topic.pptx 6장, 차트 1(BAR_CLUSTERED, 실데이터 cats 5·vals [15,12,4,4,3]), **pictures 0**(이미지 폴백 없음), 텍스트 셰이프 77. PowerPoint COM 실개봉 — 2본 모두 Opened, `Shape.HasChart` 1, `Chart.ChartData.Workbook` 접근 1 (=엑셀 데이터 연동 실존). 프로세스 잔존 0. GUI 더블클릭 편집 UX 는 자동화 불가 항목 — **사용자 관측 대기 (partial)**: PowerPoint에서 topic.pptx 3번 슬라이드 차트를 더블클릭해 데이터 시트가 뜨는지 1회 확인 요망.

검증 스크립트: `decks/claude-ppt-lab/scripts/export-pptx.mjs`(export) · `scripts/open-verify-pptx.ps1`(COM 실개봉 — SL3 즉석 명령을 이번에 박제).

## 2. 흡수 후보 4건 판정

| 후보 | 판정 | 근거 |
|---|---|---|
| ① 브랜드 DESIGN.md → 테마 변환 | **채택 (SP2)** | 이번 랩에서 수동 변환(DESIGN.md 토큰→CSS 변수 26개 매핑)이 실제로 통했다 — getdesign CLI 표준 포맷이라 스크립트화 가능. 스킬 3테마 고정의 한계를 푼다 |
| ② 1장 캘리브레이션 | **채택 (SP2)** | 3회 왕복으로 편차 6건이 전부 계획 밖에서 적발됐다 — 전체 덱 일괄 생성 전 1장 수렴이 실효. 기존 G5(대표 1~3장 미리보기)에 "스타일 편차 교정 루프" 를 명시 절차로 승격 |
| ③ 비교쌍 교정 | **보류** | 이번 랩에서 미사용 — 스크린샷 관측+코드 diff로 충분했다. 사용자가 직접 고친 파일을 주는 워크플로우가 실제 발생할 때 재평가 (finding 큐) |
| ④ 리디자인 입력 트랙 | **채택 (SP2, 축소 범위)** | md 소스→프리셋 재생성은 실증됨. PDF/PPTX 파싱 입력은 미실증이라 SP2 에서는 "md/보고서 입력" 우선, PDF 파싱은 확장 후보로만 |

**SP3 입력**: pptxgenjs 경로가 랩에서 파라미터화(팔레트·프리셋 규칙 주입)까지 실증됨 — 스킬 export 트랙 승격 시 `export-pptx.mjs` 를 layout-meta 연동 일반형으로 확장.

## 3. 산출물 색인

- 덱: `decks/claude-ppt-lab/{content,topic-deck,redesign-deck}` (HTML 정본, validate·build·overflow 전부 PASS, 경고 0)
- PPTX: `decks/claude-ppt-lab/pptx/claude-ppt-lab.{topic,redesign}.pptx`
- 프리셋: `decks/claude-ppt-lab/style-preset.md` (v1, 캘리브레이션 로그 포함)
- 스크린샷: `evidence/slide-pipeline/img/` 5매 (calib r1~r3 · topic chart · redesign issues)
- 회귀 게이트: 스킬 소스·기존 덱·methodology 무접촉 — 커밋 diff 가 `decks/claude-ppt-lab/`·`research/`·`evidence/`·`plans/`·ROADMAP 한정임을 git log 로 확인
