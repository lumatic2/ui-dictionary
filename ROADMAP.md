# ROADMAP

> Last updated: 2026-07-20
> Status: 템플릿 제작 시스템 경화 — TH1 완료, TH2 진행 중
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="template-production-hardening" status="active" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다 — 구별되는 청사진·토큰 구동 스튜디오·실행되는 검증·Codex imagegen 소재 경로. Details: `plans/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive6 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive5 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive4 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.

<!-- harness:goal-archive3 id="cascade-studio" status="completed" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

## Active Milestones

<!-- harness:milestone id="TH1" status="completed" priority="P0" evidence="evidence/template-production-hardening/th1-legibility.md, changesets/20260720-template-core-legibility/README.md, changesets/20260720-template-studio-script-legibility/README.md, changesets/20260720-template-line-length-guard/README.md" -->
### TH1 — 코드 가독성 복구 + 회귀 방어망
- DoD: template 제작 스택 3표면에 300자 초과 라인 0개 + 해제 전후 세 fixture `templateSignature` 동일 + 재발 차단 lint가 단일 커맨드로 실행.
- Evidence: evidence/template-production-hardening/th1-legibility.md, changesets/20260720-template-core-legibility/README.md, changesets/20260720-template-studio-script-legibility/README.md, changesets/20260720-template-line-length-guard/README.md
- Gap: TPS 산출물이 한 줄 300~1,000자로 압축돼 이후 5개 milestone의 편집을 막는다 (App.tsx 18줄 중 JSX 1,000자 라인, verify 스크립트 전체 2줄)
- Scale: changesets>=2; surfaces: template-core·template-studio·verify 스크립트; capability: 사람이 읽고 고칠 수 있는 제작 스택
- Status: [x]

- Completed at: 2026-07-20
- Summary: 압축 해제 3표면 + 서명 불변 증명 + 줄 길이 가드 (300자 초과 13→0)
<!-- harness:milestone id="TH2" status="active" priority="P0" -->
### TH2 — 청사진 6종 실재화
- DoD: 6개 청사진 명시 선언 + 같은 포맷 두 청사진이 슬롯 개수 또는 그리드 열 수에서 다름을 기계 검증 + 인쇄 규격·안전영역 위반 명시 거부.
- Evidence: evidence/template-production-hardening/th2-blueprints.md
- Gap: `-split` 3종이 전 슬롯 x+24/width-48 균일 변형이라 카탈로그 6이 실질 3이다
- Scale: changesets>=3; surfaces: 타입 계약·blueprint registry·검증; capability: 근거 있는 두 번째 아키타입
- Status: [ ]

<!-- harness:milestone id="TH3" status="pending" priority="P0" -->
### TH3 — 스튜디오 토큰 구동 + 실편집
- DoD: 토큰 값 변경 시 렌더 computed style이 실제로 바뀜 + 이미지 교체·청사진 6종 선택 + 내보내기→재가져오기 왕복 무손실.
- Evidence: evidence/template-production-hardening/th3-studio.md
- Gap: TPS3 plan이 "semantic token 변경"을 선언했으나 App.tsx가 팔레트를 하드코딩하고 tokenSetId를 무시한다 (선언·게이트 통과·구현 부재)
- Scale: changesets>=3; surfaces: 브라우저 앱·Playwright desktop/mobile; capability: 실제로 편집되는 스튜디오
- Status: [ ]

<!-- harness:milestone id="TH4" status="pending" priority="P0" -->
### TH4 — 검증 실체화
- DoD: exporter 실제 실행 + 18개 산출물 파싱 검사 + 훼손 3종 각각 exit≠0 + probe 무력화 시 전체 실패.
- Evidence: evidence/template-production-hardening/th4-verification.md
- Gap: verify 스크립트의 exports 목록이 하드코딩 문자열이고 negative probe가 없다 — 통과만 확인하는 검증
- Scale: changesets>=2; surfaces: verify 스크립트·npm script; capability: 훼손을 실제로 잡는 게이트
- Status: [ ]

<!-- harness:milestone id="TH5" status="pending" priority="P1" -->
### TH5 — Codex imagegen 소재 공급자
- DoD: codex exec 경유 공급자 계약 테스트 PASS + 라이브 실호출 1회 소재가 템플릿에 렌더 + 깨진 OpenAI 어댑터 제거.
- Evidence: evidence/template-production-hardening/th5-imagegen.md
- Gap: 현 OpenAI 어댑터의 응답 타입이 실제 API 구조와 달라 라이브에서 100% 실패한다 (사용자 확정: Codex imagegen으로 전환)
- Scale: changesets>=3; surfaces: 신규 공급자 패키지·codex exec 실호출·스튜디오 렌더; capability: 동작하는 소재 생성 경로
- Status: [ ]

<!-- harness:milestone id="TH6" status="pending" priority="P1" -->
### TH6 — 실사용 실연 + horizon close
- DoD: 실제 의뢰 1건 전 루프(청사진→토큰→소재→편집→내보내기) 통과 + 사람 확인 게이트 + 닫는 기준 7항 선언/실측 대조.
- Evidence: evidence/template-production-hardening/th6-commission.md
- Gap: 경화가 실사용감으로 검증돼야 close (RC4·TPS5 교훈)
- Scale: changesets>=2; surfaces: 대화형 실연·산출물 형식 그대로 렌더; capability: 경화된 루프 실증
- Status: [ ]

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)
- 포스터 캔버스 1080×1350을 인쇄 표준 비율로 이전 (TH2 finding)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
