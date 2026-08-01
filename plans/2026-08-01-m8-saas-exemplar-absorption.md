# PLAN — M8: SaaS exemplar 흡수 — Linear·Vercel → 대시보드 밀도·저소음 위계 (레퍼런스 다변화 2/2)

> 생성: 2026-08-01 · 갈래: reference 흡수(RL 배치) · scope: Tier 2 소스(SaaS exemplar)를 RL 루프에 태운다. 표면 = 대시보드 밀도·저소음 위계(제안 — 승인 시 확정). goal `reference-diversification` 2번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M7→M8 일괄 승인, M8 표면=대시보드 밀도 확정)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로".
- **goal**: `reference-diversification` · **milestone**: M8 (연쇄: M7 → M8 — M7 이 보수한 배관을 그대로 사용).
- **리서치 입력**: `research/2026-08-01-plan-reference-diversification.md` + `research/product-system-exemplars.md`(2026-07-04, Vercel·Stripe·Linear·Radix·Around 교훈·Do-not-copy 표 — 미흡수 원본).

## Scope Boundary
- **표면 = 대시보드 밀도·저소음 위계 (제안 상태 — 이 계획 승인이 곧 표면 확정. 승인 답변에서 다른 표면 지정 시 교체)**
- **포함**: ① 대시보드 밀도·저소음 위계 표면 1배치 수집(Linear·Vercel/Geist 중심, 공식 문서·실제품 실브라우저 재확인, 출처 URL+접근일) ② 승격(knowledge 밀도 판정 규칙 + term/recipe) + 검증 체인 + ledger 기록(source 축 사용).
- **제외**: Stripe(결제 플로우)·Radix(프리미티브)·Around — 별도 표면이라 후속 배치 후보로 finding 큐에만 등재 · 사이트 IA 변경 · 브랜드 아이덴티티 복사(Do-not-copy 표 준수).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서·데이터 추가 위주 — 커밋 단위 revert.

## 스캐폴딩 결정
- source-of-truth: M7 과 동일(reference-loop·absorption-criteria·terms.yml·knowledge/) — M7 step-1 이 보수한 소스 축 스키마를 그대로 사용.
- 검증: M7 과 동일 검증 체인(dedup audit → validate → 재생성+lint:llms → build·lint → 실브라우저 스모크).
- 배포/운영: M8 마감 = goal 마감 — 로컬 검증 후 요약 보고 → 사용자 승인 시 일괄 push(배포 배칭).
- 자기선언 도메인 — 없음.
- 검토 후 제외: exemplar 별 시각 패리티 재현(스크린샷 미러링) — 흡수 대상은 밀도·위계 원리이지 look 이 아니다.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: 그릇 = Tier1+Tier2 연쇄(M7→M8).
- **기술 결정(제안 포함)**: ① M8 표면 = 대시보드 밀도·저소음 위계 — 북극성 갭(대시보드·운영 도구 표면 부재)과 직결이라 제안, 승인 답변에서 다른 표면 지정 시 교체 ② 소스는 Linear(calm density)·Vercel/Geist(개발자 도구 타이포·대비) 2종으로 좁힘 — 1 batch = 1 surface 유지 ③ Stripe·Radix·Around 는 finding 큐 등재만.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [ ] **step-1 — 대시보드 밀도 배치 수집 + dedup**
  - Artifact: Linear(디자인 리프레시 문서·실제품)·Vercel Geist(공식 문서) 실브라우저 재확인 → `docs/research/loop/inbox.yml` 후보 10~20건(8필드 + source=linear/vercel-geist) → dedup audit. 근거 원본 `research/2026-08-01-m8-dashboard-density-capture.md` 동결.
  - Files: write docs/research/loop/inbox.yml, research/2026-08-01-m8-dashboard-density-capture.md. read research/product-system-exemplars.md, docs/ui-vocabulary/terms.yml.
  - Risk: 기계적 (데이터 스테이징 — Linear 실제품 로그인 벽이면 공개 문서·마케팅 표면 폴백, 접근 한계 기록)
  - Dependencies: 없음 (M7 완료가 전제 — 연쇄 순서로 보장)
  - Verify: dedup audit 2종 실행 — 후보 전건 판정 완료 + 중복분 alias/related 방침 기록.
  - Failure probe: 대시보드 용어(data table·kpi card 등)는 기존 흡수분과 중복 확률 높음 — 승격분 0 이면 기존 항목의 밀도·위계 규범 보강으로 전환하고 판정 기록.
  - Commit: changeset `m8-saas-exemplar-absorption` (README 절: step-1).

- [ ] **step-2 — 승격 + 검증 체인 + ledger (M8·goal 마감)**
  - Artifact: `knowledge/dashboard-density.md` 신설(밀도 티어·행높이·보더/구분선 소음·위계 판정 결정표, knowledge 양식) + **llms 노출 배선(필수)**: `scripts/generate-llms-txt.mjs` FIXED_ASSETS Knowledge 섹션 등재 + 재생성 산출물 커밋 + terms.yml 승격/보강분 + (해당 시) recipe. inbox 비우기 + ledger 1행(source 축) + `evidence/reference-diversification/m8-saas-exemplar-absorption.md` + Stripe·Radix·Around 후속 배치 후보 finding 큐 등재.
  - Files: write knowledge/dashboard-density.md, scripts/generate-llms-txt.mjs(FIXED_ASSETS), examples/ui-vocabulary-site/public/llms.txt·public/llms/(재생성 산출물), docs/ui-vocabulary/terms.yml, docs/research/loop/ledger.md, docs/research/loop/inbox.yml(비움), evidence/reference-diversification/m8-saas-exemplar-absorption.md.
  - Risk: 위험 (terms.yml 정본 데이터 변경 — 검증 체인으로 차단)
  - Dependencies: step-1
  - Verify: M7 step-3 과 동일 체인 전체 PASS(validate → 재생성 → `node scripts/check-llms-sync.mjs`(루트) → build·lint → 실브라우저 스모크 + audit:visuals, recipe 승격 시 build:data+build:catalog 추가) + llms.txt 에 knowledge/dashboard-density 노출 문자열 확인 + ledger 행에 exit code 기재.
  - Failure probe: knowledge 파일 2개(m7·m8)가 서로 겹치는 판정(모바일 밀도 vs 대시보드 밀도)을 두면 정본 충돌 — 상호 wikilink 로 경계 명시, 중복 규칙 0 확인.
  - Commit: changeset `m8-saas-exemplar-absorption` (README 절: step-2).

## 검증/DoD
- **DoD**: Tier 2 소스가 소스 축이 보이는 ledger 행으로 RL 완주 — 승격 산출물 ≥1(knowledge 밀도 판정 규칙) + 전 검증 체인 PASS + 후속 배치 후보(Stripe·Radix·Around) 큐 등재. 실패 모드: 재생성 누락 = lint:llms 게이트.
- **Evidence**: `evidence/reference-diversification/m8-saas-exemplar-absorption.md`
- **회귀 게이트**: 사이트 build·lint + audit:visuals + ledger 기존 행 무손실.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — knowledge llms 노출 배선을 필수 작업으로 승격(Files 보강) + 표면 제안 상태를 Scope Boundary 에 명시(승인 = 확정) + 대시보드 계열 기존 terms 다수 실측(table-density-control 등) — 보강 전환 확률 높음.
