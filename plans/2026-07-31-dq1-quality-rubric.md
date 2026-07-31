# PLAN — DQ1: 덱 품질 기준 수립 (리서치 보강 + 품질 루브릭 + few-shot 예시 장)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) + research · scope: goal `deck-quality` 1/3.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 발견 7건 반영 후 일괄 승인, chain dq1→dq2→dq3)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `deck-quality` 1/3 — html-upgrade 로 파이프라인·운영 장치는 올렸으나 **"무엇이 좋은 슬라이드인가"의 기준이 계약에 없다**. 에이전트는 레이아웃 문법(어떻게 만드나)은 알지만 품질 판정(잘 만들었나)은 G5 육안에만 의존한다. 기준을 루브릭+견본으로 명문화해야 DQ3 리디자인과 이후 모든 덱이 같은 잣대를 쓴다.
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §2(품질 기법)·§5(anti-slop 스멜 테스트) — 단 시각 구성 품질(밀도·위계·서사) 원칙·실사례는 미수집 → step-1 보강.

## Scope Boundary
- **포함**: ① 시각 품질 원칙·실사례 리서치 보강(저장 의무) ② 품질 루브릭 명문화(계약 — 밀도·위계·정렬·서사 흐름·장별 역할) ③ D1 이월: few-shot 예시 장(견본 slides.json 조각 + 렌더 스크린샷 + 왜 좋은가 주석) G5 계약 편입.
- **제외**: 표현 기계 구현(Auto-Animate·이미지 빌드 = DQ2) · 정본 덱 수정(= DQ3) · 신규 레이아웃 추가(수요는 finding 큐로).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 루브릭·견본은 문서·계약 추가 — 기존 덱 산출 무변화.

## 스캐폴딩 결정
- source-of-truth: 품질 루브릭 정본 = custom-skills `references/quality-rubric.md`(신설) — G5 캘리브레이션·anti-slop 체크(style-system.md)와 중복 금지, 상호 백링크. few-shot 견본 = `references/exemplars/`(slides.json 조각 + PNG).
- 검증: 루브릭 각 항이 "기계 검사 가능 / G5 육안 판정"으로 이분 표기됐는지 + few-shot 견본이 실제 빌드·렌더되는지(견본은 살아있는 코드 — 죽은 예시 금지) + SKILL.md 라우팅 표에 등재.
- 배포/운영: setup.sh 단일 배포. 공유 레포 — add 경로 명시.
- 자기선언 — 루브릭 형태: 항목당 [원칙 한 줄 · 판정 질문 · 위반 예시 · 검사 주체(린트|G5)] 4필드. 근거 없는 항목 금지 — step-1 리서치 또는 기존 KG/methodology 출처 백링크 필수.
- 자기선언 — few-shot 계약: 견본 3~5장(서로 다른 레이아웃 계열 — 표지·본문 텍스트·데이터·비교·마무리), 각 견본 = slides.json 조각 + 빌드 산출 PNG + "왜 좋은가" 3줄 이내 주석. G5 진입 시 에이전트가 대상 장과 같은 계열 견본을 읽고 비교하는 절차를 SKILL.md §7 에 1줄 배선.
- 검토 후 제외: 견본 자동 회귀(견본 재빌드 diff 게이트) — 스킬 템플릿 변경마다 견본 재산출 부담, 수동 갱신+changeset 기록으로 충분.

## 결정 로그
- status: resolved
- **범위 = ① 덱 자체 품질 업그레이드** — 사용자 확정 2026-07-31 ("① 슬라이드 덱 자체 품질 업그레이드 계획 ㄱ").
- 루브릭 항목 구성·견본 장수(3~5) = 기술/튜닝값 (에이전트 결정, 기록만).

## Step 트리

- [ ] **step-1 — 시각 품질 리서치 보강**
  - Artifact: `research/2026-07-31-dq1-deck-quality-refs.md` — 발표 슬라이드 시각 구성 원칙(밀도·위계·그리드·서사 아크)과 고품질 실덱 사례(컨퍼런스 키노트·디자인 시스템 발표 등) 수집·분석, 루브릭 후보 도출. 전 인용 출처 URL+접근일.
  - Files: write 이 레포 `research/2026-07-31-dq1-deck-quality-refs.md`. read `research/2026-07-31-html-upgrade-goal-refs.md`·`methodology/prompt-patterns.md`·`knowledge/`.
  - Risk: 없음 (리서치 문서만)
  - Dependencies: 없음
  - Verify: 문서에 원칙≥8·실사례≥3·루브릭 후보 표가 있고 각 항에 출처 백링크 존재 — `grep -c "http" research/2026-07-31-dq1-deck-quality-refs.md` ≥ 6.
  - Failure probe: 웹 출처 접근 불가 항목은 "확인 불가" 명기(추정 작성 금지 — 전역 인용 규칙).
  - Commit: 이 레포 `docs(dq1): step-1` (research).
- [ ] **step-2 — 품질 루브릭 문서 + few-shot 견본 제작**
  - Artifact: custom-skills `references/quality-rubric.md`(루브릭 — 4필드 형태) + `references/exemplars/`(견본 3~5장: slides.json 조각+PNG+주석 — 전 장 실빌드·실렌더).
  - Files: write custom-skills `references/quality-rubric.md`·`references/exemplars/*`. read step-1 research·`references/style-system.md`.
  - Risk: 기계적 (신규 문서·견본 추가 — 기존 계약 파일 미편집)
  - Dependencies: step-1
  - Verify: 견본 전 장 실빌드·실렌더 PNG 산출(죽은 예시 0) + 루브릭 전 항 검사 주체(린트|G5) 표기 + 전 항 출처 백링크.
  - Failure probe: 루브릭이 style-system anti-slop 체크와 중복되는 항 발견 시 한쪽 참조로 정리(사본 금지) — `grep` 교차 확인.
  - Commit: changeset `20260731-dq1-quality-rubric` (README 절: step-2).
- [ ] **step-3 — 계약 배선 (SKILL.md 라우팅 + 린트 승격 + 배포)**
  - Artifact: SKILL.md §7 G5 견본 대조 절차 1줄 + §8 라우팅 표 등재 + 루브릭 중 기계 검사 가능 항목의 lint-principles 승격(warning) + setup.sh 배포.
  - Files: write custom-skills `SKILL.md`·`templates/src/lint-principles.mjs`. read step-2 산출.
  - Risk: 위험 (SKILL.md·린트 공유 계약 편집 — 전 덱 표면)
  - Dependencies: step-2
  - Verify: 린트 추가분 위반 fixture 에서 warning 실출력·정상 fixture 0건 + 기존 fixture 재빌드 diff 0 + 배포 정합(커밋 가드).
  - Failure probe: 린트가 기존 R1~R6 과 중복 발화하지 않는지 위반 fixture 로 교차 확인.
  - Commit: changeset 동일 (README 절: step-3).

## 검증/DoD
- **DoD**: 품질 루브릭과 few-shot 견본이 스킬 계약으로 배포되어, G5 가 육안 인상이 아니라 루브릭 항+견본 대조로 판정할 수 있다 — 견본 전 장 실빌드 PASS + 라우팅 등재 + 배포 정합.
- **Evidence**: `evidence/deck-quality/dq1-quality-rubric.md`
- **회귀 게이트**: 기존 fixture 재빌드 diff 0(루브릭·견본은 계약 추가 — 산출 무변화).

## 수치 출처
- 루브릭 항목 수·견본 장수(3~5)는 튜닝값. 현행 레이아웃 수 실측: `python -c "import json;m=json.load(open('templates/layout-meta.json'));print(len(m['layouts']))"` (custom-skills — 최상위 키가 `layouts`, fresh 검증자 실측 2026-07-31).

## 재생성 장벽
- step-2 배포 후 배포본 검증.

## finding 큐
- (비움 — 진행 중 발견 시 append)

## 진행 로그
- 2026-07-31 작성 — goal 연쇄 1/3.
