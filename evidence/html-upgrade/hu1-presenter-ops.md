# HU1 — 발표 운영력 (스피커 뷰·standalone·PDF 노트)

> 2026-07-31 · plan: `plans/2026-07-31-hu1-presenter-ops.md` · changeset: custom-skills `20260731-hu1-presenter-ops`

## step-1 — 스피커 뷰 (커밋 56b6c88, 배포·push 완료)

- 구현: shell.mjs `createDeckSync`(BroadcastChannel+localStorage 겸용, from+seq dedupe) + `S` 키 스피커 창 + `renderSpeaker`(현재/다음 iframe·노트·타이머) + io/builder-core 에 speaker.html 산출. rendering-contract §E 계약 신설.
- 검증 실측 (fixture theme-askewly-smoke + notes 2장):
  - http(localhost:8931) Playwright 실조작: hello 핸드셰이크로 01/02 표시 → 스피커 →키에 본편 02 이동 → 본편 ←키를 스피커가 01 추종 → `S` 키로 스피커 창 열림. **양방향 PASS**.
  - file:// 폴백 스크립트(`test-file-sync.mjs`): 채널 진단 `{bc:ok, ls:ok}` · 3단 assertion → **FILE-SYNC PASS**.
  - 콘솔 에러 0 (favicon 404 제외).
- 라운드: r1 미리보기 잘림(논리 캔버스가 iframe 폭으로 축소 안 됨) → iframe 캔버스 원치수 + transform scale 로 수리, r2 수렴 (스크린샷 `hu1-speaker-view-v2.png` 관측).

## step-2 — standalone export (커밋 2772336)

- 본체 = 내비 모델 병합(검증자 발견 반영): 문서 N개 full navigation → `renderStandalone` 단일 문서 `<section>` 상태 전환(`display:none↔contents`, 활성화 시 진입 애니메이션 재생) + 전 자원 인라인(CDN CSS 재귀 url()·script·img). 실패는 stderr 고지 + exit 2(침묵 열화 금지).
- 검증 실측: fixture 산출 2.70MB·인라인 실패 0 → **모든 http(s) 요청 차단 라우트** 위에서 file:// 개봉 — 렌더 정상(스크린샷 `standalone-offline.png`)·Pretendard 인라인 로드(`document.fonts.check` true)·키 내비 →/← 동작·차단된 요청 0·콘솔 에러 0 → `STANDALONE-OFFLINE PASS`.

## step-3 — PDF `--notes` (커밋 70eea2d)

- raster(imagePdfHtml 인터리브)·vector(print.html DOM 주입) 양 트랙. notes 없는 슬라이드 생략(빈 페이지 금지).
- 검증 실측(pypdf): `--notes` vector 4페이지·raster 4페이지, p2 에서 노트 텍스트 실추출("슬라이드 1 발표 노트 …") · 플래그 미지정 vector 2페이지(회귀 무변화).

## step-4 — 등재·배포 + 통합 (커밋 c4a2f61, push 완료)

- SKILL.md §7-11항·§8 라우팅 + verification.md 「발표 운영 검증」 5항 체크.
- 통합(배포본 `~/.claude/skills` 템플릿에서 fixture 신규 생성): build(speaker.html)·standalone 2.70MB·vector `--notes` 4페이지·file:// 동기 `FILE-SYNC PASS` — 3기능 동시 실동작.

## DoD 판정 (정직 기록)

- 스피커 뷰·standalone·PDF 노트 3기능 배포·실동작 — PASS (위 실측).
- "미사용 덱 산출 무변화"는 바이트 diff 기준으로는 성립하지 않는다 — 공통 스크립트(S키·동기)가 전 장에 들어간다(계약상 불가피). 판정 기준을 **렌더·export 무변화**로 해석: `?print`/`?capture` 침묵 가드 + raster capture 모드 체크(nav 숨김·capture-mode 클래스) 통과로 확인. export 산출 경로(PDF·PPTX·print.html 구조) 무접촉.
