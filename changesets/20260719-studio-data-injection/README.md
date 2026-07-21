# changeset: studio data injection (SF1 step 1)

- Date: 2026-07-19
- Milestone: SF1 step-1 (`plans/2026-07-19-sf1-studio-data-injection.md`)
- Target: SF1 — 데이터 주도 스튜디오 주입

## Scope

스튜디오 후보 주입을 "569줄 HTML 직접 편집"에서 "데이터 JSON + 1커맨드 생성"으로 전환.

- `templates/brief-studio.html` — AGENT DATA 블록을 `STUDIO DATA BEGIN/END` 마커 블록으로 교체(기본 데이터 내장 유지 — 단독 열기 폴백 보존). 폰트 `<link>` 주석도 데이터 주도로 갱신.
- `templates/studio-data.default.json` — 신규. 기준 데이터 정본 (`fonts` + `tiles` 4 + `axes` 18, node 평가로 기존 JS 리터럴에서 무손실 추출).
- `templates/make-studio.py` — 신규 생성기. 필수 필드·렌더러 필수 축 12종·boost 참조·fonts URL 검증(실패 시 명시 에러 + exit 1), 마커 블록 치환 + 폰트 링크 주입.

## Contract

- source of truth: `templates/brief-studio.html`(렌더러) + `templates/studio-data.default.json`(데이터)
- deploy: 레포 (템플릿은 llms 미포함 — 기존 계약과 동일하게 로컬 레포 전제)
- compatibility: 산출 HTML self-contained 유지, 템플릿 단독 열기도 기본 데이터로 동작
- out of scope: 계약 문서 교체·배포 (step 2)

## Verification checklist (Playwright + CLI 실측)

- [x] 기본 데이터 생성 → 18축 + 타일 4 렌더, 미리보기 조립, 헤드라인 일치 (기존과 동일)
- [x] 커스텀 데이터 생성 → 커스텀 타일명·헤드라인·미리보기 반영 + 커스텀 폰트 URL 주입
- [x] 템플릿 단독 폴백 → 18축 렌더 + 캐스케이드(타일 선택 → "타일과 한 세트" 배지 4개) 동작
- [x] Failure probe: cands 누락 JSON → `axes[0] (base) 필수 필드 누락: cands` + exit 1 / 비 googleapis 폰트 URL → 명시 거부
