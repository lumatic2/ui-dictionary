# PLAN — M17: DESIGN.md→슬라이드 테마 자동 배선 — 프로젝트별 브랜드 덱 (판정 A 의 범용 구현)

> 생성: 2026-08-04 (2차 재작성 — 사용자 정정 2건 반영) · 갈래: 매체 통합(M16 판정 A 구현) · scope: `/pt` 로 덱을 만들 때 **대상 프로젝트의 DESIGN.md 를 찾아 그 브랜드로 슬라이드 테마를 자동 생성·제안**하는 배선을 완성한다 — 변환기 3-tier 지원 + 스킬 워크플로우 배선 + 실프로젝트 2케이스 관측 실증.
Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — 결정 1 flat 케이스 미지정→기본값 askew-app 확정, 결정 2 추천안 확정)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "같은 토큰 SSOT에서 출발" 앞절의 발표 매체 구현. ui-dictionary 덱은 이 배선으로 자기 DESIGN.md(SSOT 생성물)에서 출발하게 되고(판정 A 실현), 다른 모든 프로젝트도 같은 경로로 각자의 브랜드에서 출발한다.
- **사용자 정정 2건 (2026-08-04)**: ① 기존 askewly 크림 테마는 잘 만든 자산 — 교체 아님 ② 목표는 askewly 전용 신규 테마가 아니라 **프로젝트마다 있는 각자의 DESIGN.md 를 찾아 그걸 토대로 슬라이드를 만드는 것**.
- **입력 실측 (2026-08-03~04, M16 + 계획 탐색)**: ① 프로젝트별 DESIGN.md 20개+ 실재(`~/projects/*/DESIGN.md`), 전부 Stitch flat colors 양식(`templates/DESIGN.md.tmpl` 정본) — ui-dictionary 본체만 3-tier 중첩(tokens: primitive/semantic) ② 스킬에 수동 경로 기존재: `design-md-to-theme.mjs`(flat 전용) → theme.json → `meta.template:"custom"`(style-system.md Custom Brand Theme 절, customThemeErrors 검증·custom-theme-smoke 픽스처) ③ 갭 4: 자동 탐지·제안 워크플로우 부재 / 3-tier 미지원 / 경계 문구가 자기 브랜드까지 차단("reproduction and comps only") / 실프로젝트 관측 실증 0회 ④ 테마 계약 29변수 = REQUIRED_THEME_VARS.
- 조사 불요 — M16 장부 + 위 실측이 리서치 입력.

## Scope Boundary

- **포함**: ① 변환기 `design-md-to-theme.mjs` 확장 — 3-tier tokens 구조 지원(semantic 층 우선 매핑) + 부족 역할(차트·내비 등) 파생 fallback + WCAG 대비 자기검사 ② `/pt` SKILL.md 워크플로우 배선 — 덱 생성 절차에 "대상 프로젝트 DESIGN.md 탐지 → custom 브랜드 테마 제안" 단계 신설 + style-system.md 경계 문구 정정(타 브랜드 복사 금지 유지, **자기 프로젝트 DESIGN.md 는 정본 사용**) ③ 실프로젝트 2케이스 E2E + **사용자 관측(human gate)** — ui-dictionary(3-tier) + 타 프로젝트 1개(flat) ④ slide-spec §5 구현 형태 기록 + llms 재생성.
- **제외**: 기존 canonical 테마 3종(askewly·dark·light)·css.mjs 일체 무변경 · 신규 canonical 테마 추가 없음(custom 트랙 사용 — 사용자 정정) · SSOT dataviz 토큰 추가(변환기 fallback 으로 해결 — 부족하면 finding 큐) · 지면(print) 매체 · Figma 동기화.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **human gate — step-3 사용자 관측**(기각 시 파생 규칙 조정 왕복).
- rollback/cleanup: custom-skills·ui-dictionary 커밋 단위 revert + setup.sh 재배포. 관측 산출물은 scratchpad(레포 무오염). 기존 덱·테마 불변.

## 스캐폴딩 결정

- source-of-truth: 각 프로젝트 DESIGN.md = 그 프로젝트 브랜드 정본(ui-dictionary 는 tokens/askewly.tokens.json 이 원천, DESIGN.md 는 생성물 — 변환기는 DESIGN.md 를 읽으면 충분) · 테마 계약 = REQUIRED_THEME_VARS(theme.mjs) · 배선 정본 = 스킬 SKILL.md 워크플로우 + references/style-system.md.
- 검증: step별 Verify + 통합 E2E = DESIGN.md 탐지→변환→theme.json 검증(customThemeErrors 0)→pt 빌드→실브라우저→사용자 관측 2케이스(3-tier 1 + flat 1) + 대비 자기검사 + check-llms-sync PASS.
- 배포/운영: custom-skills 수정 → setup.sh 재배포(step-1·2), ui-dictionary 는 slide-spec 기록만. push 세션 일괄.
- 자기선언 도메인 — 파생 규칙 소유: DESIGN.md 에 없는 역할(차트·내비·hint 등)의 fallback 파생 규칙은 **변환기 코드가 소유**(주석 문서화) — DESIGN.md 양식에 슬라이드 전용 필드를 요구하지 않는다(양식 오염 금지).
- 검토 후 제외: DESIGN.md 표준 양식(DESIGN.md.tmpl) 변경 — 20개+ 기존 파일 호환이 우선, 변환기가 맞춘다.

## 결정 로그

- status: resolved
- **[사용자 정정 2026-08-04] 형태 = 프로젝트별 DESIGN.md 범용 배선** — askewly 전용 테마 신설(1차 재작성안)·정본 교체(초안) 모두 기각. custom 트랙이 소비 경로, canonical 테마 무변경.
- **결정 1 — 관측 케이스 2건 = ui-dictionary(3-tier, 판정 A 실현 케이스) + 타 프로젝트 1개(flat 양식)** (추천: 두 번째 케이스는 승인 답변에서 사용자 지정 — 미지정 시 `askew-app`). 근거: 두 양식을 각 1회 실물 관측해야 배선이 "범용"임이 실증됨.
- **결정 2 — 경계 문구 정정 방향** = "타 제품 브랜드를 최종 아이덴티티로 복사 금지"(「하지 않는 것」)는 유지, **자기 소유 프로젝트의 DESIGN.md 는 재현·시안 한정이 아니라 정본 브랜드로 사용** (추천 — style-system.md Boundary 절 문구 교체).
- **기술 결정**: ① 3-tier 매핑은 semantic 층 우선(surface.*→bg 계열, text.*→text 계열, action/accent→accent 계열), 부족분 primitive fallback ② 대비 자기검사 = 변환기에 내장(text/bg 조합 WCAG AA, FAIL 시 exit 1 + `--set` 보완 안내 — 기존 "조용한 기본값 금지" 계약 승계) ③ 탐지 규칙 = 덱 대상 프로젝트 루트의 `DESIGN.md`(없으면 canonical 테마 제안으로 폴백 — 강제 아님, 제안) ④ cross-repo import 는 pathToFileURL 경유(fresh 검증자, Windows).

## Step 트리

- [x] **step-1 — 변환기 확장 (3-tier 지원 + fallback 파생 + 대비 자기검사)**
  - Artifact: custom-skills `promoted/pt/scripts/design-md-to-theme.mjs` 확장 — ① frontmatter 가 `tokens:` 중첩 구조(3-tier)면 semantic 층 우선 매핑으로 판독(기존 flat colors 경로는 무변경 유지) ② DESIGN.md 에 없는 역할(chart-1~4·nav-*·input/option/hint·text-sub·gradient 계열)의 파생 fallback 규칙(accent·surface 조합+알파, 주석 문서화) ③ WCAG 대비 자기검사(text-primary/bg-primary 4.5:1 등, FAIL = exit 1) ④ self-test(flat 픽스처 + 3-tier 픽스처 각 1 — 29변수 전건·unknown 0).
  - Files: edit ~/projects/custom-skills/promoted/pt/scripts/design-md-to-theme.mjs. write 스킬 fixtures(3-tier 테스트 입력 1본). read ui-dictionary DESIGN.md(3-tier 실물), templates/DESIGN.md.tmpl(flat 정본).
  - Risk: 기계적 (기존 flat 경로 무변경 — self-test 로 회귀 확인)
  - Dependencies: 없음
  - Verify: self-test 2양식 PASS(customThemeErrors 0) + ui-dictionary DESIGN.md 실물 변환 exit 0 + 대비표 stdout 전항목 AA + 기존 custom-theme-smoke 픽스처 회귀 PASS.
  - Failure probe: 3-tier semantic 값이 참조 문자열(`{color.primitive...}`)이라 flat 파서가 hex 를 못 얻음 — 참조 해석기(DESIGN.md 내 primitive 역참조)를 변환기에 내장, 미해석 참조는 exit 1 로 표면화.
  - Commit: changeset `20260804-m17-slide-theme-generator` (README 절: step-1) + custom-skills 커밋.

- [x] **step-2 — /pt 워크플로우 배선 (탐지→제안) + 경계 정정 + 재배포**
  - Artifact: 스킬 SKILL.md 덱 생성 절차에 "대상 프로젝트 루트 DESIGN.md 탐지 → 있으면 custom 브랜드 테마를 기본 제안(변환 실행·G5 캘리브레이션 포함), 없으면 canonical 3종 제안" 단계 신설 + references/style-system.md Custom Brand Theme 절 갱신(3-tier 지원·자기 브랜드 정본 사용 경계 정정 — 결정 2) + `setup.sh` 재배포.
  - Files: edit ~/projects/custom-skills/promoted/pt/SKILL.md, ~/projects/custom-skills/promoted/pt/references/style-system.md.
  - Risk: 기계적 (문서 배선 — 빌더 코드 무변경)
  - Dependencies: step-1
  - Verify: 배포본-소스 diff 0 + SKILL.md 에 탐지 단계 grep 1건 이상 + style-system.md 에 구 경계 문구("reproduction and comps only" 단독) 잔존 0.
  - Failure probe: 워크플로우 단계가 문서로만 있고 실발화 안 되는 위험(만들었다≠호출된다) — step-3 E2E 가 이 단계를 그대로 밟아 실발화를 증명(관측 기록에 단계 준수 여부 명시).
  - Commit: changeset (README 절: step-2) + custom-skills 커밋.

- [x] **step-3 — 실프로젝트 2케이스 E2E + 관측 (human gate) + 기록**
  - Artifact: 결정 1 의 2케이스로 step-2 배선 절차를 그대로 밟아 프리뷰 덱 생성(scratchpad — theme-preview 픽스처 사본에 각 theme.json 주입) → 실브라우저 렌더 + 스크린샷(케이스별 1장 이상) → **사용자 관측**(기각 시 step-1 파생 규칙 조정 왕복) → `evidence/media-unification/m17-brand-deck-wiring.md`(케이스·스크린샷·판정) + slide-spec §5 구현 형태 정정 기록(범용 배선 신설·기존 테마 존치 — 사용자 정정 인용) + llms 재생성.
  - Files: write scratchpad(프리뷰 2본), evidence/media-unification/m17-brand-deck-wiring.md. edit docs/design-system/slide-spec.md. regen llms.
  - Risk: 기계적 (관측 산출물 scratchpad — human gate: 사용자 부재 시 스크린샷 준비 후 blocked 정지)
  - Dependencies: step-2
  - Verify: 2케이스 빌드 콘솔 에러 0 + 사용자 관측 판정 각 1회 기록 + `node scripts/check-llms-sync.mjs` PASS.
  - Failure probe: flat 케이스 프로젝트의 DESIGN.md 가 필수 colors 미달(primary 없음 등)로 변환 실패 — 그 실패 표면화 자체가 배선의 정상 동작(조용한 기본값 금지) — 다른 프로젝트로 교체하고 실패를 evidence 에 기록.
  - Commit: changeset (README 절: step-3).

## 검증/DoD

- **DoD**: `/pt` 가 대상 프로젝트의 DESIGN.md 를 탐지해 그 브랜드의 슬라이드 테마를 자동 생성·제안하는 배선이 완성됨 — 변환기가 flat·3-tier 두 양식을 읽고(29변수 전건·대비 AA 자기검사), 워크플로우가 스킬 정본에 배선되고, 실프로젝트 2케이스가 사용자 관측을 통과. 실패 모드 확인 = 대비 위반 또는 필수 색 미달 입력이 exit 1 로 실제 차단됨. slide-spec §5 기록 + check-llms-sync PASS.
- **Evidence**: `evidence/media-unification/m17-brand-deck-wiring.md`
- **회귀 게이트**: canonical 테마 3종·css.mjs·기존 flat 변환 경로·custom-theme-smoke 무변경 PASS.

## 수치 출처

- 29변수·REQUIRED_THEME_VARS: `research/2026-08-03-m16-media-token-audit.md` §1 (theme.mjs L141~150).
- DESIGN.md 20개+ 실재: `ls ~/projects/*/DESIGN.md` (2026-08-04 실행).
- WCAG AA 4.5:1/3:1: `docs/design-system/slide-spec.md` §2 (`confirmed`).

## finding 큐

- SSOT `semantic.dataviz` 토큰 추가(사이트 차트 재사용 목적) — 이번엔 변환기 fallback 으로 해결, 사이트 쪽 수요 생기면 후속.
- dark·light 테마의 SSOT 파생 — 후속 후보(SSOT dark 모드 정비 선행).
- 신규 토큰 Figma 동기화 — 다음 Figma 세션.

## 진행 로그

- 2026-08-04 작성 (1차: askewly 정본 교체 → 사용자 정정으로 기각).
- 2026-08-04 1차 재작성 (4번째 canonical 테마 신설안) → 사용자 정정 2 ("프로젝트마다 각자의 DESIGN.md 를 찾아 그걸 토대로") 로 기각.
- 2026-08-04 step-2 완료 — SKILL.md §6 브랜드 탐지 단계 + style-system 경계 정정 + 재배포(diff 0). custom-skills `55890eb`.
- 2026-08-04 step-3 완료 — 관측 덱 3본 빌드(생성 2 + 비교 1), Artifact 비교 페이지 제시, **사용자 관측 PASS 2케이스**("좋아"). evidence + slide-spec §5·§6 정정 + llms 재생성(check-llms-sync PASS). 커밋 `5cb8025`.
- 2026-08-04 step-1 완료 — 변환기 확장(3-tier·fallback·대비 자기검사·self-test 6/6), 실물 2케이스 변환 PASS. failure probe 실현: askew-app 은 frontmatter 없는 표 기반 → **flat 관측 케이스 3d-repolis-portfolio 로 교체**(probe 예정 대응). custom-skills `487bfea`.
- 2026-08-04 2차 재작성 — 범용 DESIGN.md→테마 배선으로 전면 개편. 실측 보강: 프로젝트 DESIGN.md 20개+ 전부 flat 양식·수동 경로 기존재·갭 4(탐지 배선·3-tier·경계 문구·실증 0). fresh 검증자 1차 결과 중 유효 항목 승계(pathToFileURL·customThemeErrors 실재·픽스처 template 교체 필요).
