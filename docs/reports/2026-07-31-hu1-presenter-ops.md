# 완료 — HU1 발표 운영력 (goal `html-upgrade` 1/4)

> 완료: 2026-07-31 · HU1 (goal `html-upgrade`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

HTML 덱이 "발표 현장"을 갖게 됐다: ① `S` 키 스피커 뷰(별도 창 — 현재/다음 미리보기·노트·타이머, BroadcastChannel+localStorage 양방향 동기) ② 단일 파일 오프라인 standalone(내비 모델을 단일 문서로 병합 + 전 자원 base64 인라인 — 발표장 Wi-Fi 무관) ③ PDF `--notes`(노트 페이지 삽입, raster/vector 양 트랙). custom-skills 4커밋(56b6c88→c4a2f61) 배포·push 완료.

## 2. 이슈와 해결

- 스피커 미리보기 잘림(논리 캔버스 미축소) → iframe 원치수+transform scale 수리(1라운드).
- "미사용 덱 산출 무변화" DoD 는 바이트 diff 로는 불성립(공통 스크립트가 전 장 삽입) — **렌더·export 무변화**로 판정 기준을 해석하고 evidence 에 정직 기록: `?print`/`?capture` 침묵 가드 + raster capture 체크 통과.
- Playwright MCP 의 file:// 차단 → npx 캐시 playwright 직접 구동 스크립트로 오프라인 검증 대체.

## 3. 증거

- changeset: custom-skills `changesets/20260731-hu1-presenter-ops` (step 4절)
- 검증: `evidence/html-upgrade/hu1-presenter-ops.md` — http 양방향 실조작·`FILE-SYNC PASS`·`STANDALONE-OFFLINE PASS`(전 요청 차단, 폰트 인라인 로드 true)·pypdf 4페이지/미지정 2페이지.
- 크기 회고: changeset 1디렉터리·4절(4 step) — milestone 라벨 정합(독립 step 4 + 통합 검증).
- 실표면: 배포본(`~/.claude/skills`) 템플릿으로 fixture 덱 신규 생성 → 스피커 동기·오프라인 standalone·`--notes` PDF 3기능 동시 실동작 확인.
- 재현: `cp -r ~/.claude/skills/presentation-slides-yusung/templates/* tools/ && node tools/build-slides.mjs && node tools/export-standalone.mjs && node tools/export-vector-pdf.mjs --notes`
