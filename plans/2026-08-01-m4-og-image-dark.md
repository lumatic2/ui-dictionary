# PLAN — M4: 다크 톤 og-image 교체 (다크 이월 3/3)

> 생성: 2026-08-01 · 갈래: product 기능/화면(SNS 공유 에셋 + 메타 배선) · scope: codex imagegen 으로 다크·라이트 톤 og-image 후보 2종을 생성해 기존 SVG 와 3안 품질 비교 후, 선택안으로 교체(또는 유지). goal `dark-carryover` 3번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M2→M3→M4 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 사이트가 공유되는 첫 인상(링크 카드)까지 디자인 시스템의 얼굴이다.
- **goal**: `dark-carryover` · **milestone**: M4 (M3 완료 후 연쇄 — goal 마감 milestone, 배포 일괄 승인 지점).
- **리서치 입력**: `research/2026-08-01-dark-carryover-goal-inventory.md` §C (og:image 테마 분기 불가·SVG 호환성·prerender 배선).

## Scope Boundary
- **포함**: ① 다크 톤 1200×630 og-image 신규 제작(브랜드 보라·사이트 아이덴티티 기반, 래스터 PNG — SVG 호환성 문제 동시 해소) ② `index.html` 셸 메타 og:image/twitter:image 배선 갱신 — **og:image 는 셸 단일이다**: prerender(`scripts/prerender-ui-vocabulary.ts:184-210`)는 title/url/description 만 라우트별로 찍고 og:image 는 건드리지 않으며, 전 라우트가 셸 값을 상속한다(fresh 검증자 실측 — 초안의 "라우트별 og:image 파이프라인" 전제는 오류로 정정) ③ 로컬 검증 + goal 마감 일괄 배포(사용자 승인 후) 시 실카드 확인.
- **제외**: 라우트별 동적 og-image 생성(용어별 카드 등 — 별도 후보) · 파비콘·기타 브랜드 에셋 변경 · og 외 메타(카피·SEO 텍스트 — M1 확정 영어 유지).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **배포 직전(사용자 일괄 승인 게이트)**
- rollback/cleanup: 에셋 교체 + 메타 경로 수정 — 커밋 단위 revert, 구 og-image.svg 는 git 이력 보존.

## 스캐폴딩 결정
- source-of-truth: og-image 원본 = imagegen 생성 프롬프트·커맨드(evidence 기록) + 산출 PNG 커밋. 메타 경로 정본 = index.html 셸 단일 선언(전 라우트 상속).
- 검증: 산출물 1200×630 픽셀 검증 + 로컬 build 후 dist 라우트 표본의 og:image 메타 경로·파일 존재 확인 + (배포 후) 실배포 URL 이미지 200 + 카드 디버거(트위터 validator 또는 카카오 디버거) 1회 실확인.
- 배포/운영: **goal 마감 일괄 배포** — M2·M3·M4 로컬 검증 완료 상태에서 요약 보고 → 사용자 승인 → push → 실배포 확인(배포 배칭 규약). 승인 전 push 금지.
- 자기선언 도메인 — **매체 게이트(지면 산출물)**: og-image 는 상호작용 없는 지면 — 최종 형식(PNG 실물) 그대로 렌더해 확인하는 것이 게이트다. 라이트/다크 채팅 배경 목업 위에 얹은 대조 스크린샷으로 "양 테마에서 자연스러움"을 관측 증거로 남기고 **사용자 확인을 받는다**(에셋 취향은 사용자 소유).
- 검토 후 제외: SVG 유지 + PNG 폴백 이중 배선 — 크롤러가 1장만 취하는 구조라 이중화 이득 없음, PNG 단일이 단순.

## 결정 로그
- status: resolved
- **제작 방식 = codex exec imagegen** (사용자 확정 2026-08-01 2차): 다크 톤 + **라이트 톤 2종을 생성**하고, **기존 og-image.svg 포함 3안 품질 비교** 관측으로 사용자가 최종 선택한다(다크 톤은 우선 가설이지 확정 아님 — 비교에서 기존/라이트가 이기면 그걸 채택). 구 결정("다크 톤 단일 교체" 1차 확정)은 이 비교 선택으로 대체.
- **사이트 기본 테마 = 라이트 불변** (사용자 재확인 2026-08-01): 이 goal 의 어떤 milestone 도 DM3 확정 기본값(라이트)을 건드리지 않는다.
- **기술 결정**: ① 포맷 = 1200×630 PNG(플랫폼별 SVG 미지원 근거는 step-1 에서 URL 확보) ② imagegen 산출물의 재생성 소스 = 생성 프롬프트 — 프롬프트·생성 커맨드를 evidence 에 기록(레포 내 렌더 소스 방식은 대체됨) ③ 시안 확정은 사용자 관측 1회(3안 비교).
- 그 외 새 사용자 소유 결정: **3안 비교 선택 1회** (step-1 안에 예정된 관측 게이트 — 예상된 정지점이므로 decision_required 계수 아님).

## Step 트리

- [ ] **step-1 — codex imagegen 다크·라이트 2종 생성 + 3안 비교 관측**
  - Artifact: codex exec imagegen 으로 다크 톤·라이트 톤 1200×630 시안 각 1종(브랜드 보라·사이트 아이덴티티 프롬프트 — 프롬프트·커맨드 evidence 기록) + 기존 og-image.svg 렌더 포함 **3안 비교 시트**(라이트/다크 채팅 배경 목업 대조) → 사용자 관측 1회로 최종 선택. SVG og:image 플랫폼 지원 근거 URL 확보(research §C 갱신).
  - Files: write examples/ui-vocabulary-site/public/og-image.png(선택안), tmp/ 시안 후보 2종, research/2026-08-01-dark-carryover-goal-inventory.md(§C 근거 URL), evidence/dark-carryover/m4-og-image-dark.md(프롬프트·비교 시트). read 현행 public/og-image.svg, DESIGN.md(브랜드 토큰).
  - Risk: 기계적 (신규 에셋 — 기존 표면 무영향, 취향은 관측 게이트가 잡음. imagegen 산출 치수가 1200×630 이 아니면 재생성/크롭으로 보정)
  - Dependencies: 없음
  - Verify: 후보 PNG 1200×630 실측 + 3안 × 양 테마 목업 대조 시트 + 사용자 선택 확정(기존 유지 선택 시 step-2 는 검증만 수행하고 메타 무변경 마감).
  - Failure probe: imagegen 산출물의 텍스트 렌더 품질(로고·워드마크 왜곡) — 텍스트는 이미지 생성에 맡기지 않고 후처리 합성(오버레이)로 넣는 대안을 비교 시트에 병기.
  - Commit: changeset `m4-og-image-dark` (README 절: step-1).

- [ ] **step-2 — 메타 배선 + goal 마감 검증 (M4 마감·배포 게이트)**
  - Artifact: index.html 셸 메타의 og:image/twitter:image 를 PNG 경로·타입으로 갱신(width/height 정합) + 로컬 통합 검증 + `evidence/dark-carryover/m4-og-image-dark.md` + goal 일괄 배포 요약 보고(배포는 사용자 승인 후).
  - Files: write examples/ui-vocabulary-site/index.html, evidence/dark-carryover/m4-og-image-dark.md. read scripts/prerender-ui-vocabulary.ts(og:image 무개입 확인).
  - Risk: 기계적 (메타 문자열 교체 — dist 표본 검사로 즉시 검증)
  - Dependencies: step-1
  - Verify: build 후 dist 표본 라우트(홈·용어 상세·docs)가 셸 상속으로 신경로 og:image 메타를 갖는지 + PNG 파일 dist 존재 + lint·build PASS. 배포 후: 실배포 이미지 200 + 카드 디버거 1회.
  - Failure probe: dist 전체 grep 으로 `og-image.svg` 참조 0 + `og-image.png` 참조 존재 확인(셸 외 하드코딩 참조 — 예: term-visual 데모 문자열 — 은 콘텐츠라 제외 판정 기록).
  - Commit: changeset `m4-og-image-dark` (README 절: step-2).

## 검증/DoD
- **DoD**: 3안(imagegen 다크·라이트 + 기존 SVG) 품질 비교를 사용자가 관측해 선택하고, 교체 선택 시 실배포 링크 카드가 선택안 PNG(1200×630)로 나가며 dist 메타 정합·구 SVG 참조 0. 기존 유지 선택 시 비교 evidence 로 마감(메타 무변경). 실패 모드: dist grep 으로 잔존 구경로가 잡힌다.
- **Evidence**: `evidence/dark-carryover/m4-og-image-dark.md`
- **회귀 게이트**: build·lint PASS + dist 메타 표본 검사 + (배포 후) 실배포 스팟.

## 수치 출처
- 1200×630 = 현행 셸 메타 자기 선언(`examples/ui-vocabulary-site/index.html:34-35` `og:image:width/height`) — Open Graph 링크 카드 관례 치수, 신규 PNG 도 동일 치수 유지. 산출물 실측 커맨드: `python -c "from PIL import Image; print(Image.open('public/og-image.png').size)"` (step-1 Verify).

## 재생성 장벽
- goal 마감 일괄 배포: M2·M3·M4 커밋 → 요약 보고 → 사용자 승인 → `git push` → 실배포 확인(og 카드 디버거 포함). 승인 전 push 금지.

## finding 큐
- (실행 중 발견 — 라우트별 동적 og-image 등 후보는 여기로)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — M2: status.* 그룹 신설(accent 충돌 회피)·DESIGN.md 재생성 부작용·llms 별도 커맨드 명시·destructive-foreground 승격 근거, M4: og:image 셸 단일 전제 정정, M3: 실물 고대비 사람 핸드오프 명시.
- 2026-08-01 사용자 수정 반영 — M4 제작 방식 = codex exec imagegen(다크+라이트 2종 생성, 기존 SVG 포함 3안 품질 비교 선택), 기본 테마 라이트 불변 명문화(M2 제외·M4 결정 로그).
- 2026-08-01 step-1 시안 생성 완료(다크·라이트 텍스트 왜곡 0) + 3안 비교 시트 — 사용자 관측 게이트 대기. M3 실물 고대비 스팟과 묶어 제시.
