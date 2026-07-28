# VI7 — 도구 층 배치 완료 노트 (2026-07-28)

## 1. 결과

toolshelf 비주얼 임팩트 카드 15건을 전수 배치·판정했다: **A 완료 1(motion) · A 대기 2(GSAP·Paper Shaders → VI8 입력) · B 링크 8 · C 보류 4**. absorption-criteria 실측 표에 신규 9행이 추가돼 도구 편입 판정이 정본 문서 한 곳에서 읽힌다. VI6 finding(llms 미배선 2건)을 해소해 knowledge 3문서(expressive-stack·motion-principles·motion-references) 전부가 llms 에 배선됐고, motion-references 에 관찰 갤러리 절이 생겼다.

## 2. 이슈와 해결

- 갤러리형 4건(Brainwave·3d-spatial-pack·60fps·landing.love)은 티어 오배치 위험(failure probe) — 티어 비배치 "레퍼런스 소스"로 구분 표기해 해소.
- C 판정 4건은 카드 열람 없이 기존 요약으로 판정 — shelf used 는 실참조 8건만 기록(과다 기록 회피).
- DoD 잔여 없음.

## 3. 증거

- 장부: `research/2026-07-28-vi7-toolshelf-placement.md` (15행 전수, MISSING 0) · evidence: `evidence/visual-impact-consolidation/vi7-placement.md`
- changeset: `changesets/20260728-vi7-toolshelf-placement` · 커밋: 2b6f730 · 2213552 · 11af6f5
- 검증: llms 재생성 160→162 assets(신규 링크 2건 grep) · build ✓ 1.03s · lint exit 0 · shelf used --ok 8건(use_count 증가 출력)
- 실표면: none — agent-facing 판정 문서·생성기 배선이라 사용자 표면 변경 없음. 실서비스 llms 반영은 세션 말 push 후 curl 확인 항목.
- 재현: `node scripts/generate-llms-txt.mjs && cd examples/ui-vocabulary-site && npm run build && npm run lint`
- 크기 회고: changeset 1개(step 3절) — step-2(정본 3파일+생성기)·step-3(외부 레포 기록+검증)이 독립 응집 변경, milestone-grade 유지.
