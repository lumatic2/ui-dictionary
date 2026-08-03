# M16 — 매체 통합 검증 완료 보고

- Date: 2026-08-04 · Plan: `plans/2026-08-03-m16-media-token-audit.md` · Changeset: `changesets/20260803-m16-media-token-audit/`

## 1. 결과

북극성 "같은 토큰 SSOT에서 출발" 주장을 발표 매체에 대해 실측 — **슬라이드 파이프라인의 SSOT 소비 0건**(askewly 테마 29변수 전수: 일치 0·파생 0·역할 평행 13·대응 부재 16). 사용자 판정 **A**(2026-08-03, 추천 B 기각): 슬라이드 테마는 SSOT 파생이어야 한다 — 현행 canonical 테마는 미배선 결함(과도기)으로 등재. slide-spec §5 「토큰 출발점」 신설 + medium-taxonomy 발표 행 게이트 추가 + llms 재생성. 후속 goal 후보(토큰→슬라이드 테마 생성기: SSOT 16역할 확장 + SP2 theme.json 생성기 + 관측 게이트)를 ROADMAP 큐 등재.

## 2. 이슈와 해결

- 스킬 *내부* 규율은 건강했다(export = theme.mjs 단일 출처 판독, 덱 사본·배포본 drift 없음) — 결함은 "내부 단일 출처가 레포 SSOT에 연결 안 됨" 하나로 좁혀짐. 판정 A 의 구현 인입점(SP2 custom theme.json 트랙)이 이미 존재해 후속 goal 은 스킬 소스 무변경으로 성립.
- css.mjs 에 테마 팔레트 에코 hex 12건(이중 갱신 지점) — 생성기 goal 의 범위 산정에 포함할 것.
- 계획 대비 드리프트: 없음(그릇 = 실측+판정+기록 유지, 생성기 구현 미착수 — 계획된 제외).

## 3. 증거

- Evidence 합본: `evidence/media-unification/m16-token-audit.md` (DoD 대조표)
- 실측 장부: `research/2026-08-03-m16-media-token-audit.md` (커밋 `82a1c96`) · 게이트 기록: 커밋 `a9ffb51`
- 검증: 대조표 29변수 전수(REQUIRED_THEME_VARS 계수 일치) · 표본 3건 grep 재확인 PASS · `check-llms-sync` PASS(watched 4) · 완료 감사 재검증 — llms 사본에 「토큰 출발점」 2건·발표 행 게이트 1건 실재 확인.
- 실표면: none — 사용자 접촉 표면(사이트 코드·스킬·토큰 데이터) 무변경, 문서·게이트 기록만. 라이브 llms 반영은 세션 일괄 push 후 `curl https://ui.askewly.com/llms.txt` 확인 예정(deploy batching).
- 재현: `node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs` → PASS · `sed -n '141,150p' ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/src/theme.mjs | tr ',' '\n' | grep -c "'"` → 29.
- 배선: none — 장치 신설 없음(문서·판정 기록만).
- 크기 회고: changeset 1개·step 2개로 닫힘 — 검증 그릇으로는 적정하나 milestone/step 경계선상(판정 게이트가 사용자 결정을 불러 milestone 성립). 목표(반나절 검증)가 이 크기였으므로 과소 그릇 아님.
