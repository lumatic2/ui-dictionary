# PLAN — DM1: 다크모드 지식·용어 자산화 (다크모드 정비 1/3)

> 생성: 2026-07-31 · 갈래: 지식 문서 + 용어 사전 등재 · scope: '다크모드' 정의 정본화 — knowledge 문서 + llms 배선 + terms.yml 등재. goal `dark-mode` 1번 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 결정 4건 매듭 + fresh 검증자 반영본, 연쇄 DM1→DM2→DM3)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 에이전트와 사람이 같은 정본 지식을 공유한다. 다크모드는 "배경을 검게 뒤집는 것"이 아니라 별도 팔레트 재설계라는 정의부터 정본이 있어야 DM2·DM3 구현 판단이 선다.
- **goal**: `dark-mode` (신규) · **milestone**: DM1 (연쇄: DM1 → DM2 → DM3).
- **리서치 입력**: `research/2026-07-31-dark-mode-goal-dark-mode.md` (Apple HIG·MDN·Material 3·Primer·Tailwind — 출처 URL+접근일 전건).

## Scope Boundary
- **포함**: ① `knowledge/dark-mode.md` 신설(정의·인접 개념 경계·디자인 주의점·구현 주의점 — 출처 유지) + `scripts/generate-llms-txt.mjs` 등재 + llms 재생성 ② terms.yml '다크모드' 1건 등재(authoring workflow 준수 — audit → promotion → validate → visual check) + 기존 '테마 토큰' related 연결.
- **제외**: 인접 개념(forced colors·inverted colors 등)의 별도 항목 등재(사용자 확정 2026-07-31 — related·본문 경계 설명으로 갈음) · 사이트 테마 기능 변경(토큰 치환·토글 — DM2·DM3 소관) · 소배치 수집. (단 `term-visual.tsx` 신규 시각 variant 1건은 용어 콘텐츠 렌더라 포함 가능 — 아래 기술 결정 ②)
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 파일 + 명시 등재 2곳(generate-llms-txt.mjs·terms.yml append) — 커밋 단위 revert 로 완전 복구.

## 스캐폴딩 결정
- source-of-truth: 지식 정본 = `knowledge/dark-mode.md`(리서치 문서를 근거로 요약·재구성, 출처 인용 유지) · 용어 정본 = `docs/ui-vocabulary/terms.yml` · 배포 경로 = `scripts/generate-llms-txt.mjs` → `https://ui.askewly.com/llms.txt`.
- 검증: `node scripts/audit-ui-vocabulary-candidates.mjs`(+`--strict-duplicates`) → `python scripts/validate-ui-vocabulary.py` → site `npm run build`·`npm run lint` → `npm run audit:visuals`(fallback 렌더러 확인) → llms 재생성 diff 확인.
- 배포/운영: push·배포는 DM3 마감 시 일괄(deploy-batching — 세션 단위, 사전 보고 후). DM1 은 로컬 검증까지.
- 자기선언 도메인 — **인용 규약**: 모든 외부 주장에 출처 URL+접근일, 추정은 '추정' 표기(리서치 문서가 이미 준수 — knowledge 문서로 옮길 때 유실 금지). knowledge ↔ methodology 중복 시 methodology 가 knowledge 를 인용(레포 규약).
- 검토 후 제외: methodology/ 문서 신설 — 다크모드 실행 절차는 DM2·DM3 완료 후 패턴이 굳으면 후보(지금은 지식만).

## 결정 로그
- status: resolved
- **등재 범위 (사용자 확정 2026-07-31)**: '다크모드' 1건 + related 연결. 인접 개념은 본문 경계 설명으로.
- **자산화 범위 (사용자 확정 2026-07-31)**: knowledge/dark-mode.md 신설 + llms 배선.
- **기술 결정**: ① 용어 항목 구조는 terms.yml 기존 스키마 준수(ko/en·aliases: dark theme·야간 모드 등, one_liner, description, visual_anatomy, when_to_use, anti_use, prompt_phrases, sources — apple-hig·mdn·material 소스) ② asset — fresh 검증자 실측: `theme-switch` variant 는 **존재하지 않는다**(등록 variant: outline-ring·blend-mode·object-fit·semantic-color·theme-token + toggle 계열). 기본안 = kind `diagram`·variant `theme-token` 재사용이 아니라 **`term-visual.tsx` 에 다크모드 전용 소형 variant 1건 신설**(라이트/다크 표면 스왑을 보여주는 미니 다이어그램 — 개념 정확성이 재사용보다 우선). 신설이 과하면 실행 중 `theme-token` 재사용으로 폴백(둘 다 audit:visuals 통과 경로) ③ knowledge 문서는 리서치 문서의 §A·§B·§C 를 정본 어휘로 재구성, 사이트 현황(§E)은 계획서 소관이라 제외.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — knowledge/dark-mode.md + llms 배선**
  - Artifact: `knowledge/dark-mode.md` 신설 — 정의(HIG·MDN·M3), 인접 개념 경계 표(dark theme·night shift·forced-colors·inverted colors), 디자인 주의점(순검정 회피·elevation·채도·halation·WCAG 테마별 재검증), 웹 구현 주의점(FOUC 인라인 스크립트·3-상태 패턴·color-scheme·theme-color·이미지·트랜지션), 우수 사례 4건. + `scripts/generate-llms-txt.mjs` 에 등재, llms 재생성.
  - Files: write knowledge/dark-mode.md, scripts/generate-llms-txt.mjs. read research/2026-07-31-dark-mode-goal-dark-mode.md, knowledge/motion-principles.md(형식 관례).
  - Risk: 기계적 (신규 문서 + 명시 등재 1줄)
  - Dependencies: 없음
  - Verify: llms 재생성 실행 → 산출물에 dark-mode 문서 노출 확인 + 기존 등재 문서 목록 무손실(diff) + 문서 내 출처 URL+접근일 전건 유지.
  - Failure probe: llms 재생성 스크립트가 존재하지 않는 경로를 등재해도 조용히 통과하는지 — 오타 경로 1회 넣어 실패가 감지되는지 확인 후 원복.
  - Commit: changeset `dm1-dark-mode-knowledge` (README 절: step-1).

- [ ] **step-2 — terms.yml '다크모드' 등재**
  - Artifact: '다크모드' 항목 등재 — one_liner("저조도 환경을 위해 어두운 팔레트로 재설계된 전역 외형 테마" 계열), description 에 "단순 반전이 아니라 대비·표면 구조까지 재설계" 요지, related 로 '테마 토큰' 연결, sources 에 HIG·MDN·M3. 기존 '테마 토큰' 항목에도 역방향 related 검토.
  - Files: write docs/ui-vocabulary/terms.yml, examples/ui-vocabulary-site/src/components/term-visual.tsx(신규 variant 1건). read docs/ui-vocabulary/authoring-workflow.md, terms.yml(테마 토큰 항목 — related 는 `{id, relation, note}` 구조, id `theme-token`).
  - Risk: 기계적 (스키마 준수 append — 중복 prefilter 로 검출)
  - Dependencies: step-1 (knowledge 문서의 확정 정의를 요약 근거로 사용)
  - Verify: `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates` 중복 0 + `python scripts/validate-ui-vocabulary.py` PASS + site `npm run build`·`npm run lint` PASS + `npm run audit:visuals` 신규 항목 fallback/generic 렌더러 아님 확인 + dev 브라우저에서 /terms 상세 1회 렌더 확인.
  - Failure probe: 검색("다크모드"·"dark mode")으로 신규 항목이 정확 일치 티어에 뜨는지 — alias 누락 시 연관 티어로 새는 회귀 확인.
  - Commit: changeset `dm1-dark-mode-knowledge` (README 절: step-2).

## 검증/DoD
- **DoD**: `knowledge/dark-mode.md` 가 출처 기반으로 존재하고 llms 재생성 산출물에 배선되며, terms.yml '다크모드' 항목이 authoring workflow 전 검증(validate·build·lint·audit:visuals)을 통과하고 상세 페이지가 렌더된다.
- **Evidence**: `evidence/dark-mode/dm1-knowledge.md`
- **회귀 게이트**: llms 기존 문서 목록 무손실 + terms 기존 항목 count 불변(+1만) + build·lint PASS.

## 수치 출처
- 리서치 = `research/2026-07-31-dark-mode-goal-dark-mode.md` (sonnet 웹 리서치, 출처 전건). llms 등재 방식 = `scripts/generate-llms-txt.mjs:79-93` 실측(2026-07-31).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-31 작성 — 결정 4건(토글 패턴·등재 범위·자산화 범위·데모 연동) AskUserQuestion 매듭.
- 2026-07-31 fresh 검증자(sonnet) 반영 — theme-switch variant 미존재 실측 → 신규 variant 1건 신설로 기본안 교체(스코프 문구 정정), related 스키마 실재 확인.
