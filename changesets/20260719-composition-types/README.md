# changeset: composition 4 types + preview render (SF2 step 1)

- Date: 2026-07-19
- Milestone: SF2 step-1 (`plans/2026-07-19-sf2-composition-patterns.md`)
- Target: SF2 — 구성 패턴 완편
- 리서치: `research/2026-07-19-st4-composition-patterns.md` §2.7/2.10/2.11/2.12

## Scope

- `templates/studio-data.default.json` — 구성 축에 미편입 4유형 추가(비교표 · 문제-메커니즘-증거 · 커뮤니티 UGC · FAQ 신뢰), 총 12유형 카탈로그. 신규 4종은 `hidden: true`(기본 노출 8종 유지 — 브리프 맥락 일치 시 데이터 JSON에서 hidden 해제, 프리모템 2 예방).
- `templates/brief-studio.html` — ① 렌더러에 `hidden` 후보 필터(`visCands` — 렌더·ctx 기본값 계산 양쪽) ② 미리보기 SEC에 신규 섹션 7종: `compare`(비교표) · `problem`(문제 명명) · `mech`(작동 원리 3단) · `ugc`(사용자 콘텐츠 그리드) · `guarantee`(보증·환불) + 예약형용 `bookhero`(위젯 히어로)·`slots`(잔여 슬롯) — step 2 데이터가 사용.

## Contract

- source of truth: `templates/studio-data.default.json` + `templates/brief-studio.html`
- deploy: 레포 (템플릿 로컬 전제). 계약 문서·llms는 step 2
- compatibility: hidden 필드 없는 기존 데이터 JSON 그대로 동작(전부 노출)
- out of scope: 예약형 데이터·계약 절 (step 2)

## Verification checklist (Playwright 실측)

- [x] hidden 해제 데이터 → 구성 후보 12종 렌더
- [x] 신규 4종 각각 선택 → 미리보기 시퀀스 재조립 전수 확인 (compare "비교 항목" · pmp "작동 원리" · ugc "@사용자1" · faq-trust "보증·환불 정책")
- [x] Failure probe: 기본 데이터(hidden 유지) → 구성 노출 8종, hidden 누출 0, 18축·미리보기 무결
- [x] 템플릿 in-place 재생성(make-studio) — 데이터·템플릿 동기 유지
