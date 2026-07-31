# PB1 — PPTX bespoke 트랙 정식화 검증

> 2026-07-31 · plan: `plans/2026-07-31-pb1-bespoke-track-skill.md` · changeset: custom-skills `changesets/20260731-pb1-bespoke-track-skill` (커밋 6fdb3cc·86d33d3)

## 구현

- **`scripts/pptx-to-png.ps1` 신설** — PowerPoint COM `Slide.Export(path,'PNG',w,h)` 슬라이드별 PNG 산출. ReadOnly·창 없음, try/finally Quit+ReleaseComObject, 빈 산출=에러, 세로 해상도는 PageSetup 실비율 파생. **에이전트가 PPTX 산출물을 직접 보는 눈** — 이게 없어서 PPTX 캘리브레이션이 0회였다(품질 미달 원인 ③).
- **`references/pptx-bespoke.md` 신설** — 트랙 선택표·입력 계약(기준=HTML 렌더 스크린샷, 팔레트 판독)·표현 레시피(아트디렉션·그림자·그라디언트 근사 2법·액센트 바·타이포·차트 룩)·미세조정 루프(상한 5+전장 3, 체크리스트 5항, 라운드/편차 장부 양식)·SP3 계약 계승.
- SKILL.md 2단 트랙 라우팅(빠른 파생=범용 매퍼 / 고품질=bespoke) + §8 라우팅 표 + export-pptx.mjs 헤더 상호 참조. verification.md "PPTX 시각 게이트" 절.

## 검증

- PNG 실산출: askewly-design-intro.skill-track.pptx(7장)에서 s01·s04 산출 → Read 육안 판독 성공(s04 가 범용 매퍼의 기본 차트 룩·플랫 표현을 그대로 보여줌 — 품질 미달의 시각 증거이기도 함) → PowerPoint 프로세스 잔존 0 (3초 유예 후).
- 실측 결함 1건 즉시 수리: `pwsh -File` 경유 시 `[int[]]` 배열 바인딩이 "1,4"→14 로 뭉개짐 → 쉼표 문자열 파싱 전환(스크립트 주석+verification.md 에 기록).
- 배포: setup.sh 출고 정합 통과 2회(step-1·step-2 커밋 가드), 배포본에 스크립트·문서 존재 확인.
- gradient fill 미지원 근거 확정: 로컬 pptxgenjs 타입/소스 실측(fresh 검증자 교차 확인) + 공식 API 문서 fill 단색+투명도(https://gitbrent.github.io/PptxGenJS/docs/api-shapes/ 접근일 2026-07-31).

## finding

- 없음 (신규 finding 없음 — SP3 이월 finding 은 그대로 유지).
