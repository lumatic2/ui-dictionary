# PLAN — M19: 킥스타트 원커맨드 — 브리프→DESIGN.md→블록 이식→검증 일괄

> 생성: 2026-08-04 · 갈래: 재사용 조합(reusable-composition goal 2/2) · scope: `npx @askewly/design init --blueprint` 아님 — **`init --block <name>`** 한 번으로 [축약 브리프 → 프로젝트 DESIGN.md 생성 → 토큰 파생 → 블록 이식 + restyle → verify]를 잇는 부트스트랩 경로를 CLI 와 스킬 양쪽에 배선하고, 빈 프로젝트 E2E + 사용자 관측으로 실증한다.
Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M18 과 연쇄 승인, 결정 1 축약 브리프 3문항·결정 2 동일 명령 추천안 확정)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 해커톤 비효율 제거의 둘째 절반: 저장 단위(M18 블록)를 **착수 마찰 없이** 꺼내 쓰는 경로. "잘 만들어진 수준이 기본값"은 착수 시점에 결정된다 — 절차가 무거우면 실전에서 우회되고, 우회된 시스템은 없는 시스템이다.
- **입력 실측 (2026-08-04, fresh 검증자 정정 반영)**: ① CLI 기존 명령 = terms/tokens/init/add/verify/recipes(commander, `packages/cli/src/index.ts` 236줄) — `init` 은 **정적 파일 복사만**(`inject.ts` initProject — 템플릿 치환 로직 없음, 토큰 파생은 신규 구현이다) ② 브리프 정본 = design-brief.md **규모 게이트 + 전략층(텍스트 인터뷰) + 시각층(Brief Studio 18축)** 구조 — "7영역"은 entry-protocol 의 요약 표현 ③ 스킬 askewly-design 은 절차를 원격 fetch — **entry-protocol 에 kickstart 단계를 배선하면 그것이 곧 에이전트 경로 호출자다**(스킬 원문 수정 불요 — 스킬은 entry-protocol 을 매번 fetch 해 따른다).
- 조사 불요 — M18 계약 + CLI 실측이 입력. 신규 외부 조사 대상 없음.

## run 전 scope 결정

- **포함**: ① CLI `init --block <name>` 확장 — 축약 브리프(대화형 3문항 + `--yes` 비대화 기본값) → DESIGN.md 생성(templates/DESIGN.md.tmpl 양식) → 토큰 CSS 파생 → 블록 fetch·이식 → restyle 매핑(DESIGN.md 값 → 블록 cssVars) → verify 실행·보고 ② 정본 문서 배선 — block-contract.md 에 kickstart 소비 절 + entry-protocol "새 제품/해커톤" 분기 + design-brief.md 규모 게이트에 축약 모드 등재 ③ 빈 프로젝트 E2E + 사용자 관측(human gate) + evidence.
- **제외**: npm publish 실행(관측 통과 후 사용자 승인 시 별도 — cli-release-procedure.md 경로) · 스킬 `askewly-design` SKILL.md 원문 수정(정본이 원격 문서라 레포 문서 배선으로 충분한지 실측 후 finding 큐 판단) · 두 번째 블록 · Figma 왕복.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **human gate — step-3 사용자 관측**(기각 시 브리프·restyle 매핑 조정 왕복).
- rollback/cleanup: 커밋 단위 revert. E2E 프로젝트는 scratchpad. CLI 는 로컬 빌드로 검증(publish 없음 — 배포면 미변경).

## 스캐폴딩 결정

- source-of-truth: 킥스타트 절차 정본 = `docs/design-system/block-contract.md` kickstart 절(+entry-protocol 분기) — CLI 는 그 계약의 구현. 브리프 문항·기본값 정본 = design-brief.md 축약 모드 절. 생성되는 DESIGN.md 의 양식 정본 = templates/DESIGN.md.tmpl(무변경 — M17 결정 승계: 변환·생성기가 양식에 맞춘다).
- 검증: step별 Verify + 통합 E2E = 빈 디렉터리에서 원커맨드 1회 → 생성물 전건(DESIGN.md·토큰 CSS·블록 파일) + verify 0건 + dev 서버 실브라우저 + **사용자 관측 1회**. CLI 단위검증 = `--yes` 경로 스냅숏 시험(대화 없이 결정 재현).
- 배포/운영: CLI 는 로컬 빌드(`npm run build` in packages/cli)로 검증, npm publish 는 제외 절 명시대로 후속. 문서는 llms 재생성 + check-llms-sync. push 세션 일괄.
- 자기선언 도메인 — 브리프 축약의 소유: 어떤 축을 묻고 어떤 축을 기본값으로 미는지는 **사용자 소유**(결정 1) — CLI 코드는 그 결정의 구현이며 임의 추가 질문 금지.
- 검토 후 제외: 대화형 프롬프트 프레임워크 도입(inquirer 등) — Node 내장 readline 로 3문항이면 충분, 의존 최소 원칙.

## 결정 로그

- status: resolved
- **[승인 확정 2026-08-04]** 사용자 승인("ㄱㄱ", 대안 미지정): 결정 1·2 추천안 확정.
- **결정 1 — 축약 브리프 축 = 톤·컬러·타입 3문항**(텍스트 문항, 각 선택지+추천 기본값 제시; 전략층 나머지 문항과 Brief Studio 시각층은 생략하고 추천 기본값 — 생략 사실을 생성 DESIGN.md 에 가정으로 명시) (추천). 근거: 룩을 가르는 최소 축이 이 셋 — 구조·인터랙션 레벨은 블록이 이미 결정하고 있다. `--yes` 는 3문항도 기본값.
- **결정 2 — 사람 경로와 에이전트 경로 동일 명령** (추천): 에이전트는 `--yes` + `--tone/--color/--type` 플래그로 브리프 답을 주입. 호출자 배선 = entry-protocol kickstart 단계(step-1)가 "사용자에게 3문항을 묻고 답을 플래그로 전달"까지 지시 — 스킬은 entry-protocol 을 fetch 해 따르므로 스킬 원문 수정 불요(fresh 검증자 적발 해소: 호출자가 문서에 실재하게 됨). 근거: 경로가 갈리면 검증도 갈린다 — 한 명령의 두 입력 모드가 유지비 최소.
- **기술 결정**: ① DESIGN.md 생성은 tmpl 치환 신규 구현(flat colors 양식 — M17 변환기 호환 보장, 덱 경로 공짜 획득; 기존 init 은 정적 복사뿐이라 재사용 대상 아님 — 실측 정정) ② restyle = cssVars 스왑이 아니라 **component-restyle.md 실계약대로**: 생성 DESIGN.md 에서 파생한 CSS 변수 정의부(토큰 정의 파일)를 프로젝트에 쓰고, 블록이 선언한 요구 변수 목록(M18 기술 결정 ⑤) 전건이 정의됐는지 기계 대조 — 잔존은 verify 가 표면화 ③ 이식은 shadcn CLI 에 의존하지 않고 JSON fetch 직접 구현(에이전트 소비 경로와 동일 — 이미 entry-protocol A-2.5 정본) ④ 실패는 조용한 폴백 없이 exit 1(M17 계약 승계).

## Step 트리

- [ ] **step-1 — 정본 문서 배선 (kickstart 절차·축약 브리프 모드)**
  - Artifact: block-contract.md 에 「kickstart 소비」 절(원커맨드 계약: 입력·생성물·검증·실패 모드) + design-brief.md 규모 게이트에 축약 모드 행(트리거 = 블록 출발 신규 프로젝트, 문항 = 결정 1, 나머지 = 추천 기본값을 보고서에 가정으로 명시 — 기존 계약 문구 승계) + entry-protocol A분기에 "블록 출발 신규 프로젝트 → kickstart 경로" 한 단계.
  - Files: edit docs/design-system/block-contract.md, docs/design-system/design-brief.md, docs/design-system/entry-protocol.md.
  - Risk: 기계적 (문서)
  - Dependencies: 없음 (M18 완료가 milestone 선행조건 — chain)
  - Verify: 세 문서에 kickstart/축약 모드 grep 각 1건 이상 + check-llms-sync PASS.
  - Failure probe: 축약 모드가 기존 규모 게이트("신규 화면 = 전체 인터뷰")와 충돌 판독 — 축약 모드 행에 우선순위 명시(블록 출발일 때만 축약이 이긴다)로 해소, 모호하면 문서에 결정표 추가.
  - Commit: changeset `20260804-m19-kickstart-command` (README 절: step-1).

- [ ] **step-2 — CLI 브리프→DESIGN.md→토큰 파생 구현**
  - Artifact: packages/cli 신규 모듈 `kickstart.ts` 1부 — ① 축약 브리프(readline 3문항 · `--yes`/`--tone/--color/--type` 플래그 주입) ② DESIGN.md 생성(tmpl 치환 신규 구현 — flat colors 양식, 생략 축은 가정으로 명시) ③ DESIGN.md → CSS 변수 정의부(토큰 파일) 파생. `init --block <name>` 옵션 등록(이 step 에서는 브리프~토큰 구간만 동작). 각 단계 실패 = exit 1 + 원인.
  - Files: edit packages/cli/src/index.ts. write packages/cli/src/kickstart.ts. read templates/DESIGN.md.tmpl.
  - Risk: 위험 (기존 `init` 토큰 주입 동작 회귀 가능 — 무옵션 init 기존 경로 무변경 회귀 게이트로 방어)
  - Dependencies: step-1
  - Verify: `npm run build`(packages/cli) PASS + `--yes` 스냅숏 시험(빈 디렉터리 → DESIGN.md frontmatter 키 전건 + 토큰 파일 생성) + 플래그 주입 경로 1회(값이 DESIGN.md 에 반영) + 무옵션 init 회귀 PASS + 필수 응답 누락 exit 1 실측.
  - Failure probe: tmpl 치환 결과가 M17 변환기(design-md-to-theme.mjs)가 못 읽는 변형 양식 — 생성 DESIGN.md 를 변환기에 1회 통과시켜 호환 확인(exit 0), 실패 시 tmpl 아닌 생성기를 보수(양식 정본 무변경 원칙).
  - Commit: changeset (README 절: step-2).

- [ ] **step-3 — CLI 블록 이식→restyle 대조→verify 연결**
  - Artifact: `kickstart.ts` 2부 — ④ `/r/<name>.json` fetch·files 기록·dependencies 안내(자동 설치는 `--install` 옵트인) ⑤ 블록 요구 CSS 변수 목록 전건이 step-2 파생 토큰 정의부에 정의됐는지 기계 대조(미정의 = exit 1 + 목록) ⑥ `verify` 자동 실행·잔존 보고로 마감. 미존재 블록명·fetch 실패 = exit 1.
  - Files: edit packages/cli/src/kickstart.ts, packages/cli/src/index.ts.
  - Risk: 기계적 (신규 경로 — 기존 명령 무변경)
  - Dependencies: step-2
  - Verify: 빈 디렉터리 `--yes` 전 구간 실행 → 블록 파일 기록 + 요구 변수 대조 PASS + verify 자동 실행 결과 출력 + 미존재 블록명 exit 1 실측 + 요구 변수 1개 고의 결손 시 exit 1(대조기 실효 확인).
  - Failure probe: 요구 변수 대조는 통과했는데 실렌더가 깨지는 경우(변수 정의는 있으나 값 부적합) — step-4 실브라우저가 잡는 표면. 대조기는 존재만 보증함을 커맨드 출력 문구에 명시(과잉 보증 금지).
  - Commit: changeset (README 절: step-3).

- [ ] **step-4 — 빈 프로젝트 E2E + 사용자 관측 (human gate) + 기록**
  - Artifact: scratchpad 빈 디렉터리에서 원커맨드 1회(대화형 — 실제 3문항 응답) → 생성 프로젝트 dev 서버 → **사용자 기본 브라우저로 열어 관측**(라이트/다크 스크린샷 + 대시보드·설정·빈 상태) → 관측 판정 기록 → `evidence/reusable-composition/m19-kickstart.md`(커맨드 로그·생성물 목록·verify 결과·스크린샷·판정) → ROADMAP·llms 정리.
  - Files: write evidence/reusable-composition/m19-kickstart.md. scratchpad(E2E 프로젝트).
  - Risk: 기계적 (human gate — 사용자 부재 시 스크린샷 준비 후 blocked 정지)
  - Dependencies: step-3
  - Verify: 원커맨드 1회로 [브리프→DESIGN.md→토큰→이식→restyle→verify] 전 구간 통과(중간 수동 개입 0) + 브라우저 콘솔 에러 0 + 사용자 관측 판정 1회 기록 + check-llms-sync PASS.
  - Failure probe: "원커맨드"가 실제로는 중간 수동 개입(deps 설치·설정 수정)을 요구 — 개입 지점을 evidence 에 전건 기록하고, 자동화 가능분은 즉시 보수·불가분은 커맨드 출력의 안내 문구로 계약화(숨은 마찰 금지 — 이 milestone 의 존재 이유).
  - Commit: changeset (README 절: step-4).

## 검증/DoD

- **DoD**: 빈 프로젝트에서 `npx @askewly/design init --block saas-app-shell` 1회로 [축약 브리프 → DESIGN.md → 토큰 → 블록 이식 → restyle → verify] 전 구간이 수동 개입 없이 닫히고, 결과물이 **사용자 관측을 통과**. 실패 모드 확인 = 미존재 블록명·필수 응답 누락이 exit 1 로 실제 차단 + 무옵션 init 회귀 무변경. 문서 3종 배선 + check-llms-sync PASS.
- **Evidence**: `evidence/reusable-composition/m19-kickstart.md`
- **회귀 게이트**: 기존 CLI 명령 6종 무변경 동작 · llms 동기화 PASS.

## 수치 출처

- CLI 명령·줄수: `packages/cli/src/index.ts` grep (2026-08-04 실측).
- 브리프 7영역·규모 게이트: `docs/design-system/design-brief.md` (llms 게시본, 접근 2026-08-04).

## finding 큐

- npm publish(새 CLI 버전 출고) — 관측 통과 후 사용자 승인·cli-release-procedure.md 경로.
- 스킬 askewly-design 에 kickstart 분기 명시 필요 여부 — 원격 문서 배선으로 스킬이 실발화하는지 첫 실사용에서 관측 후 판단.
- 해커톤 실전 dogfooding 1회(다음 해커톤) — harvest 회수 계약과 묶어 후속 goal.

## 진행 로그

- 2026-08-04 작성.
- 2026-08-04 fresh 검증자 반영 — ① 기존 init = 정적 복사 실측 정정(토큰 파생은 신규 구현) ② restyle 를 cssVars 스왑에서 "요구 변수 목록 대조 + 토큰 정의부 파생"으로 정정 ③ 에이전트 경로 호출자 = entry-protocol 배선임을 명시(결정 2 보강) ④ 브리프 구조 표기를 실문서(전략층+시각층)로 정정 ⑤ 구 step-2 를 브리프~토큰(step-2)과 이식~verify(step-3)로 분해.
