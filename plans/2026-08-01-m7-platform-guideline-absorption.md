# PLAN — M7: 플랫폼 가이드라인 흡수 — HIG·Material → 모바일 내비게이션·시트 (레퍼런스 다변화 1/2)

> 생성: 2026-08-01 · 갈래: reference 흡수(RL 배치) + tooling 스키마 보수 · scope: Tier 1 소스(Apple HIG·Material 3)를 RL 루프에 처음 태워 승격 산출물을 만든다. 첫 표면 = 모바일 내비게이션·시트(사용자 확정). goal `reference-diversification` 1번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M7→M8 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "Tailwind 패리티를 최종 시스템으로 취급하지 않는다" + "표면을 가로지르는 제품 패턴으로".
- **goal**: `reference-diversification` (신규 — Tailwind 편중 해소: 비-Tailwind 소스의 첫 RL 흡수 실증) · **milestone**: M7 (연쇄: M7 → M8).
- **리서치 입력**: `research/2026-08-01-plan-reference-diversification.md` — 배관 실사(재사용 정본 9종·미비점 3건) + `research/mobile-platform-design-baseline.md`(2026-07-04, HIG×Material 비교표 — 미흡수 원본).

## Scope Boundary
- **포함**: ① RL 배관에 소스 축 추가(inbox·ledger 스키마) + absorption-criteria 에 원칙류(플랫폼 가이드라인) 착지 규칙 보강 ② 모바일 내비게이션·시트 표면 1배치 수집(기존 baseline 리서치 재사용 + HIG·Material 공식 문서 재확인, 출처 URL+접근일) ③ 승격(knowledge 판정 규칙 + term/recipe) + 검증 체인 + ledger 기록.
- **제외**: 모바일 이외 표면(폼·입력 등 후속 배치) · Tier 2 SaaS 소스(M8) · 사이트 IA/디자인 변경 · 네이티브 코드/앱 구현(문서·데이터·미니 렌더러 범위).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서·데이터 추가 위주 — 커밋 단위 revert. 스키마 변경은 기존 행 무손실(열 추가만).

## 스캐폴딩 결정
- source-of-truth: 흡수 절차 정본 = `research/reference-loop.md`(1 batch = 1 surface) · 편입 판정 = `docs/design-system/absorption-criteria.md` · 소스 티어링·Capture Protocol = `research/design-system-reference-strategy.md` · 용어 정본 = `docs/ui-vocabulary/terms.yml` · 판정 규칙 정본 = `knowledge/`(근거는 research 동결, 중복 서술 금지).
- 검증: dedup audit(`audit-ui-vocabulary-candidates.mjs`·`audit-recipe-candidates.mjs`) → validate-recipes·validate-ui-vocabulary → generate-tokens·generate-llms-txt 재생성 + `lint:llms` 게이트(M5 신설) → 사이트 build·lint → 실브라우저 스모크(신규 용어 렌더 확인).
- 배포/운영: push 는 goal 마감(M8) 시 일괄 — 요약 보고 후 사용자 승인(배포 배칭). M7 은 로컬 검증까지.
- 자기선언 도메인 — 없음 (기존 배관 재사용, 신규 인프라 없음).
- 검토 후 제외: HIG·Material 스크린샷 패리티 장부(Tailwind 1세대 방식) — 원칙류 소스는 시각 패리티가 아니라 규범 흡수가 목적이라 파일당-1행 패리티 장부를 만들지 않는다.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: ① 그릇 = Tier1+Tier2 연쇄(M7→M8) ② 첫 표면 = 모바일 내비게이션·시트.
- **기술 결정**: ① 소스 축은 ledger 에 `source` 열 추가로 해결(inbox.yml 은 `source:{tier,url,accessed}` 기존 보유 — 변경 불요, 기존 ledger 행 무손실) ② 원칙류 소스의 기본 착지 = knowledge/ 판정 규칙(A/B/C 3분기의 A 를 "recipe 또는 knowledge 규칙"으로 확장 — 컴포넌트가 아니라 규범이면 knowledge) ③ knowledge 신설 파일의 llms 노출은 `FIXED_ASSETS` 수동 등재가 필수(생성기는 knowledge/ 를 glob 하지 않음) ④ 스타일 복사 금지 불변식 유지 — 흡수 대상은 원리·계약·판정 기준뿐 ⑤ 문서가 JS 렌더링이라 공식 문서 재확인은 실브라우저로(접근일 갱신) ⑥ 기존 terms 에 모바일 내비·시트 계열 ~30개 실재(검증자 실측) — 신규 승격보다 기존 항목의 플랫폼 규범 보강이 주 경로일 가능성이 높고, DoD 는 term 신규가 아니라 knowledge 규칙 ≥1 로 건다.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — RL 배관 보수: ledger 소스 열 + 원칙류 착지 규칙**
  - Artifact: `docs/research/loop/ledger.md` 표에 `source` 열 추가(기존 행은 `tailwind` 소급 기입 — inbox.yml 은 candidate 스키마에 `source:{tier,url,accessed}` 가 **이미 존재**하므로 변경 불요, fresh 검증자 실측 2026-08-01) + `docs/design-system/absorption-criteria.md` 에 원칙류(플랫폼 가이드라인) 착지 분기(A 를 "recipe 또는 knowledge 규칙"으로 확장) 1절 보강 + `research/reference-loop.md` 절차문 개정: ledger source 열 반영 · 검증 체인에 `lint:llms`(M5 신설) 추가 · CLI `build:data`·캔버스 `build:catalog` 는 recipe 승격이 있는 배치만 필수임을 명문화.
  - Files: write docs/research/loop/ledger.md, docs/design-system/absorption-criteria.md, research/reference-loop.md. read docs/research/loop/inbox.yml, scripts/audit-recipe-candidates.mjs(source 필드 기존 검증 로직 확인).
  - Risk: 기계적 (문서·표 열 추가 — 코드 무변경)
  - Dependencies: 없음
  - Verify: ledger 기존 행 무손실(행 수 동일 + source 열 전행 기입) + `node scripts/check-llms-sync.mjs`(루트) PASS.
  - Failure probe: absorption-criteria.md 가 llms `FIXED_ASSETS` 등재 문서인지 확인 — 맞으면 재생성 없이 check-llms-sync 가 FAIL 해야 정상(게이트 실증 겸), 재생성 후 PASS 확인.
  - Commit: changeset `m7-platform-guideline-absorption` (README 절: step-1).

- [x] **step-2 — 모바일 내비게이션·시트 배치 수집 + dedup**
  - Artifact: HIG(navigation-and-search·sheets·tab-bars)·Material 3(navigation-bar·navigation-drawer·bottom-sheets·dialogs) 공식 문서 실브라우저 재확인(출처 URL+접근일) → `docs/research/loop/inbox.yml` 에 후보 10~20건 스테이징(8필드 + source) → dedup audit 로 기존 terms.yml·recipes 대비 중복 판정. 근거 원본은 `research/2026-08-01-m7-mobile-nav-sheets-capture.md` 에 동결.
  - Files: write docs/research/loop/inbox.yml, research/2026-08-01-m7-mobile-nav-sheets-capture.md. read research/mobile-platform-design-baseline.md, docs/ui-vocabulary/terms.yml(중복 후보 대조).
  - Risk: 기계적 (데이터 스테이징 — 외부 문서 접근 실패 시 baseline 리서치 + 공식 요약 폴백, 접근일 명시)
  - Dependencies: step-1
  - Verify: `node scripts/audit-ui-vocabulary-candidates.mjs` + `--strict-duplicates` 실행 — 후보 전건 id/name/alias overlap 판정 완료 + 중복분은 alias/related 처리 방침 기록.
  - Failure probe: 기존 563 용어에 tab bar·sheet 류가 이미 있을 가능성 높음 — "전부 중복이라 승격분 0" 이면 신규 항목이 아니라 기존 항목의 플랫폼 규범 필드 보강으로 전환(그 판정을 capture 문서에 기록).
  - Commit: changeset `m7-platform-guideline-absorption` (README 절: step-2).

- [ ] **step-3 — 승격 + 검증 체인 + ledger (M7 마감)**
  - Artifact: `knowledge/mobile-navigation.md` 신설(내비게이션·모달리티 선택 판정 규칙 — 탭바/스택/시트/다이얼로그/드로어를 태스크 깊이·플랫폼으로 가르는 결정표, knowledge 양식: 지위+결정표+판정 절차+Changelog) + **llms 노출 배선(필수 — generate-llms-txt.mjs 는 knowledge/ 를 glob 하지 않고 `FIXED_ASSETS` 수동 배열, fresh 검증자 실측)**: FIXED_ASSETS Knowledge 섹션에 항목 추가 + 재생성 산출물 커밋 + terms.yml 승격분(신규 또는 기존 항목 보강) + (해당 시) recipe. inbox 비우기 + `docs/research/loop/ledger.md` 1행(source=apple-hig+material) + `evidence/reference-diversification/m7-platform-guideline-absorption.md`.
  - Files: write knowledge/mobile-navigation.md, scripts/generate-llms-txt.mjs(FIXED_ASSETS Knowledge 섹션), examples/ui-vocabulary-site/public/llms.txt·public/llms/(재생성 산출물), docs/ui-vocabulary/terms.yml, docs/research/loop/ledger.md, docs/research/loop/inbox.yml(비움), evidence/reference-diversification/m7-platform-guideline-absorption.md. read docs/design-system/entry-protocol.md(knowledge 신규 파일의 에이전트 진입 배선 필요 여부).
  - Risk: 위험 (terms.yml 은 사이트·llms 정본 데이터 — 검증 체인 전체로 회귀 차단)
  - Dependencies: step-2
  - Verify: `python scripts/validate-ui-vocabulary.py` PASS → `node scripts/generate-tokens.mjs && node scripts/generate-llms-txt.mjs` 재생성 → `node scripts/check-llms-sync.mjs`(루트) PASS → 사이트 `npm run build`·`npm run lint` PASS → 실브라우저 스모크(신규/보강 용어 1건 렌더 + `npm run audit:visuals` fallback 없음) → recipe 승격이 있으면 `build:data`+`build:catalog` 추가 실행(없으면 생략을 evidence 에 명시) → ledger 행에 검증 커맨드 exit code 기재.
  - Failure probe: llms.txt 에 knowledge/mobile-navigation 링크가 실제 노출됐는지 재생성 산출물에서 문자열 확인 — FIXED_ASSETS 등재 누락 시 check-llms-sync 는 통과해도 노출은 안 되는 조용한 실패 경로.
  - Commit: changeset `m7-platform-guideline-absorption` (README 절: step-3).

## 검증/DoD
- **DoD**: 비-Tailwind 소스(HIG·Material)가 RL 루프 전 단계(수집→dedup→승격→검증→ledger)를 처음으로 완주 — 승격 산출물 ≥1(knowledge 판정 규칙) + ledger 에 source 축이 보이는 1행 + 전 검증 체인 PASS. 실패 모드: llms 재생성 누락 시 `lint:llms` 게이트가 잡는다(step-1 에서 FAIL 경로 실증).
- **Evidence**: `evidence/reference-diversification/m7-platform-guideline-absorption.md`
- **회귀 게이트**: 사이트 build·lint + audit:visuals + 기존 ledger 행 무손실.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — ① inbox.yml source 필드 기존 보유 판명(step-1 범위를 ledger 열 추가로 축소) ② knowledge llms 노출 = FIXED_ASSETS 수동 등재 필수(조건부→필수 승격, Files 보강) ③ 정본 검증 체인 대비 build:data·build:catalog 생략 조건 명문화 ④ 기존 terms 모바일 내비·시트 계열 ~30개 실측 — 보강 전환이 주 경로.
