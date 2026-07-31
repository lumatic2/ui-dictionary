# PLAN — M2: 강조·상태색 시맨틱 토큰 신설 + "토큰 부재" 마커 전수 해소 (다크 이월 1/3)

> 생성: 2026-08-01 · 갈래: product 기능/화면(토큰 SSOT + 사이트 셸) · scope: "토큰 부재" 사유 마커의 색 전수를 3-tier 토큰으로 승격(라이트+다크 값)하고 마커를 제거한다. goal `dark-carryover` 1번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M2→M3→M4 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "모든 색은 시맨틱 토큰을 거친다"를 자기 사이트가 예외 0 으로 지킨다. DM2 가 남긴 "토큰 부재" 예외를 토큰 설계로 닫는다.
- **goal**: `dark-carryover` (신규 — 다크모드 goal 이월 3건 마감) · **milestone**: M2 (연쇄: M2 → M3 → M4).
- **리서치 입력**: `research/2026-08-01-dark-carryover-goal-inventory.md` §A (마커 실측 인벤토리·SSOT 파이프라인).

## Scope Boundary
- **포함**: ① `tokens/askewly.tokens.json` 에 primitive(indigo·sky·emerald·rose 필요 shade + 브랜드 보라 hover shade) + semantic 토큰(강조·정보·성공·위험 + destructive-foreground, 각 라이트/다크 값) 신설 → `generate-tokens.mjs` 재생성 → `index.css` `@theme inline` 매핑 ② "토큰 부재" 사유 마커 전수를 새 토큰 클래스로 치환·마커 제거(라이트 시각 무손실) ③ 토큰 문서 표면(colors-page·llms 배포물) 반영.
- **제외**: 의도 고정색 마커(브랜드 카카오/구글·코드 에디터 관례·오버레이 스크림·인쇄 백지 — 사유가 "토큰 부재"가 아닌 것 전부) · 데모 콘텐츠 내부 색(allowlist 구간) · DESIGN.md 루트 토큰 전면 재설계 · forced-colors(M3) · og-image(M4) · **기본 테마 변경 — 사이트 기본 = 라이트 불변**(사용자 재확인 2026-08-01, goal 전체 공통).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 토큰 추가는 additive(기존 값 무변경) — 커밋 단위 revert. 치환은 파일 단위 커밋으로 격리, 시각 대조 실패 시 파일 단위 되돌림.

## 스캐폴딩 결정
- source-of-truth: `tokens/askewly.tokens.json` 이 유일 정본 — `tokens.css`·`public/llms/tokens/*.json` 은 생성물(손편집 금지). 다크 값은 `$extensions['com.askewly.modes'].dark` 관례를 따른다(기존 토큰과 동일 방식).
- 검증: `generate-tokens.mjs` 재생성 diff 검수 + `lint:colors` 스캐너에서 "토큰 부재" 마커 잔여 0 + site `npm run lint`·`npm run build` PASS + 라이트 시각 무손실 스크린샷 대조(치환 표면: topbar·docs·용어 상세 Pro 배지·article 데모, 1440px) + 다크 토글에서 새 토큰 표면 대비 육안+`lint` 다크 대비 검사 통과 + Playwright 콘솔 0에러.
- 배포/운영: push·배포는 goal 마감(M4) 시 일괄 — 사전 요약 보고 후 사용자 승인(배포 배칭 규약). M2 는 로컬 검증까지.
- 자기선언 도메인 — **시각 무손실 계약(라이트)**: 치환은 라이트 모드에서 동일 색 해석이 원칙. 기존 리터럴(예: indigo-50/700)과 신설 토큰 값이 정확히 같도록 primitive 를 실사용 shade 그대로 등재한다. 다크 값은 신규 설계(무손실 대상 아님 — knowledge/dark-mode.md 게이트: 순검정 회피·채도 완화 준수).
- 검토 후 제외: `@askewly/design` verify 에 신설 토큰 인지 추가 — 외부 패키지 개편은 goal 범위 밖(기존 결정 유지, finding 후보).

## 결정 로그
- status: resolved
- **범위 = 실사용 전수 승격** (사용자 확정 2026-08-01): "토큰 부재" 마커에 등장한 색 전부에 대응 토큰 신설, 예외 0 목표. 상태색 표준 세트만/브랜드 최소 안은 기각.
- **기술 결정 (에이전트)**: ① semantic 그룹은 **신설 `status.*`**(`status.info` sky 계 · `status.success` emerald 계 · `status.danger` rose 계, 각 base/foreground/surface 필요분) + **`emphasis.*`**(indigo 강조·선택) — 기존 `accent.*`(shadcn 인터랙션 상태 — badge/button/dropdown hover 에 전면 사용 중)는 **무변경**, 그 그룹에 상태색을 섞지 않는다(fresh 검증자 지적: 그룹 의미 충돌) ② `action.primary-hover`(브랜드 보라 hover) 추가 ③ `destructive-foreground` 신설 — 값은 양 테마 동일 white 고정: 기존 마커 3건("text-white 가 correct")의 판단을 뒤집는 게 아니라 그 결론을 토큰 값으로 승격해 예외 0 목표(사용자 확정 "전수")와 정합시킨다 ④ primitive 는 실사용 Tailwind shade 값을 그대로 등재(라이트 무손실 보장) ⑤ 다크 값은 기존 `.dark` 블록 토큰들과 같은 명도 정책(채도 완화)으로 설계.
- 그 외 새 사용자 소유 결정: 없음. (다크 shade 취향은 M3 이전 다크 토글 육안 검증 + goal 마감 관측에서 잡힌다)

## Step 트리

- [x] **step-1 — 토큰 신설 + 재생성 배선**
  - Artifact: `tokens/askewly.tokens.json` 에 primitive·semantic(라이트/다크 값) 추가 → `node scripts/generate-tokens.mjs` 재생성(`src/tokens.css` `:root`+`.dark` **+ 루트 `DESIGN.md` frontmatter 도 함께 재작성됨** — 스크립트가 무조건 갱신) → `src/index.css` `@theme inline` 매핑 추가 → llms 배포 사본은 **별도 커맨드 `node scripts/generate-llms-txt.mjs`** 로 재생성(생략 시 조용히 구본 잔존 — fresh 검증자 지적).
  - Files: write tokens/askewly.tokens.json, DESIGN.md(생성), examples/ui-vocabulary-site/src/index.css, examples/ui-vocabulary-site/src/tokens.css(생성), examples/ui-vocabulary-site/public/llms/tokens/askewly.tokens.json(생성). read scripts/generate-tokens.mjs, scripts/generate-llms-txt.mjs, 마커 실사용 shade(App.tsx·article-documentation-layout.tsx·ui/*).
  - Risk: 기계적 (additive 토큰 — 기존 화면 무영향, 생성물 diff 로 즉시 검수)
  - Dependencies: 없음
  - Verify: 재생성 diff 가 신설 토큰 추가 + DESIGN.md frontmatter 갱신만(기존 토큰 값 무변경) + build PASS + 신설 각 토큰이 라이트에서 실사용 리터럴과 동일 값인지 표로 대조 + llms 사본과 정본 diff 0.
  - Failure probe: generate-tokens.mjs 가 미지의 토큰 그룹(accent 하위 신규 키)을 스킵하거나 이름 변환이 어긋나는지 — 생성물에서 신설 변수 전수 존재 확인.
  - Commit: changeset `m2-accent-semantic-tokens` (README 절: step-1).

- [x] **step-2 — "토큰 부재" 마커 전수 치환·제거**
  - Artifact: 인벤토리 §A 의 마커 전수를 새 토큰 클래스로 치환하고 마커 주석 제거 — App.tsx(강조 칩·태그·sky 링크·Pro 배지·보라 hover)·article-documentation-layout.tsx(rose·indigo — 셸/콘텐츠 경계 실측 판정)·ui/button.tsx·ui/badge.tsx·bottom-tab-bar.tsx(destructive-foreground).
  - Files: write examples/ui-vocabulary-site/src/App.tsx, src/components/article-documentation-layout.tsx, src/components/bottom-tab-bar.tsx, src/components/ui/button.tsx, src/components/ui/badge.tsx. read src/tokens.css.
  - Risk: 위험 (사이트 최상위 표면 수정 — 라이트 무손실 계약·파일 단위 커밋 격리)
  - Dependencies: step-1
  - Verify: grep 으로 "토큰 부재" 사유 마커 잔여 0 + `lint:colors`(스캐너) PASS + 라이트 스크린샷 대조 무손실 + 다크 토글에서 치환 표면 대비 확인 + build·lint PASS.
  - Failure probe: article-documentation-layout 마커 중 데모 콘텐츠 판정분 — 치환하지 않고 사유를 "콘텐츠"로 정정한 건이 있으면 그 근거를 finding 큐에 기록(조용한 잔존 금지).
  - Commit: changeset `m2-accent-semantic-tokens` (README 절: step-2).

- [x] **step-3 — 토큰 문서 표면 반영 + 통합 검증 (M2 마감)**
  - Artifact: colors-page 등 토큰 문서 표면에 신설 토큰 노출(자동 파생이면 재생성 확인만) + 통합 검증 일괄 실행 + `evidence/dark-carryover/m2-accent-semantic-tokens.md`.
  - Files: write evidence/dark-carryover/m2-accent-semantic-tokens.md, (필요 시) src/components/colors-page.tsx·문서 데이터. read 전 단계 산출물.
  - Risk: 기계적
  - Dependencies: step-2
  - Verify: `npm run lint`(스캐너 포함)·`npm run build` PASS + `npx @askewly/design verify src/components --ext tsx` 비악화 + Playwright 라이트/다크 스모크(홈·docs·용어 상세) 콘솔 0에러 + colors-page 에 신설 토큰 표시.
  - Failure probe: llms 배포물(tokens json·문서)이 재생성 누락으로 구본을 내보내는지 — public/llms 사본과 정본 diff 0 확인.
  - Commit: changeset `m2-accent-semantic-tokens` (README 절: step-3).

## 검증/DoD
- **DoD**: "토큰 부재" 사유 마커 0 — 해당 색 전부가 3-tier 토큰(라이트+다크 값)으로 승격되어 SSOT·생성물·llms 배포물이 정합하고, 라이트 시각 무손실 + 다크 대비 확인 + 게이트(lint:colors·verify·build) PASS.
- **Evidence**: `evidence/dark-carryover/m2-accent-semantic-tokens.md`
- **회귀 게이트**: 라이트 스크린샷 무손실 + verify 비악화 + build·lint PASS + Playwright 콘솔 0에러.

## finding 큐
- (실행 중 발견 항목 — 특히 콘텐츠 판정으로 잔존시킨 마커와 그 근거)
- **콘텐츠 재판정 1건**: `article-documentation-layout.tsx:107` 사람별 장식 아바타 5색(rose/amber/sky/emerald/violet-200) — 색 자체가 콘텐츠(사람 구분)라 시맨틱 역할 없음. 토큰 승격 대신 마커 사유를 "데모 콘텐츠"로 정정해 잔존. 5색 토큰 신설은 과설계 판단.
- **보조 토큰 1건 추가**: `emphasis.on-solid`(white/white) — 강조 solid 버튼 위 텍스트. 치환 중 text-white 예외가 새로 생기는 걸 막기 위해 step-2 에서 즉석 추가(step-1 설계 누락, additive 라 재승인 불요 판정).
- llms 재생성이 M1 `copy-language.md` 소스 변경 미반영분을 정합화(부수 캐치업 — M1 마감 시 generate-llms-txt 미실행이 원인. 재발 방지 후보: 문서 소스→llms 정합 검사).

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — M2: status.* 그룹 신설(accent 충돌 회피)·DESIGN.md 재생성 부작용·llms 별도 커맨드 명시·destructive-foreground 승격 근거, M4: og:image 셸 단일 전제 정정, M3: 실물 고대비 사람 핸드오프 명시.
- 2026-08-01 step-1 실행 노트 — generate-tokens.mjs 가 COLOR_MAPPINGS 등재분만 방출하는 구조라 매핑 17건 추가(write — Files 목록 누락분, 배선 artifact 내재 표면 판정). llms 재생성이 M1 copy-language.md 미반영분 정합화(부수).
