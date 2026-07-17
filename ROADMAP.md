# ROADMAP

> Last updated: 2026-07-17
> Status: Taste Corpus — TC1 활성 (expressive-stack closed 2026-07-17)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="taste-corpus" status="active" -->
Goal: 최상급 레퍼런스(사용자 큐레이션 5종 정본)를 관찰→원리→판단 diff→자산 갱신 계약으로 소화해 판단 시스템의 상한을 올린다. Details: `plans/horizons/2026-07-taste-corpus.md`.

## Active Milestones

<!-- harness:milestone id="TC1" status="active" priority="P0" evidence="plans/2026-07-17-tc1-taste-loop-contract.md" -->
### TC1 — 흡수 계약 개정
- DoD: `research/taste-loop.md`(관찰→원리→판단 diff→자산 갱신 의무 + 성립성 게이트) + taste ledger 스켈레톤이 커밋되고, 기존 RL 절차(`research/reference-loop.md`)와의 관계(증설, 대체 아님)가 양쪽에 명문화된다.
- Evidence: 활성화 시 plan doc
- Gap: RL 루프는 커버리지(신규 recipe/term)만 계수 — 판단 갱신을 강제하는 계약·장부가 없음.
- Scale: changesets>=1(계약 단일 응집 변경); surfaces: research/ 계약 문서; capability: 판단 갱신 강제 흡수 계약
- Status: [ ]

<!-- harness:milestone id="TC2" status="pending" priority="P0" -->
### TC2 — 제품 배치: 사용자 큐레이션 5종
- DoD: Notion·Linear·Codex·Claude·Google 실화면 관찰(제품당 표면 1~2개, 착수 시 사용자 확정)이 taste ledger에 관찰→자산 갱신 추적으로 10건 이상 기록되고, 갱신이 판단 자산 2종 이상에 배포 반영된다.
- Evidence: 활성화 시 plan doc + taste ledger
- Gap: 취향 판단의 상한을 올릴 1급 제품 관찰이 시스템에 0건.
- Scale: changesets>=3; surfaces: 실서비스 브라우저 관찰, 판단 자산, llms 배포; capability: 취향 코퍼스 1차
- Status: [ ]

<!-- harness:milestone id="TC3" status="pending" priority="P1" -->
### TC3 — 표현 배치: Dribbble 조건부
- DoD: 성립성 게이트(실데이터·에러·한글·다크모드)를 통과한 원리 흡수 1건 이상 + 탈락 사례의 anti-pattern 역이용 1건 이상이 ledger에 기록·자산 반영된다.
- Evidence: 활성화 시 plan doc + taste ledger
- Gap: 표현 상한 사례가 콘셉트 목업 필터 없이는 판단 오염 위험.
- Scale: changesets>=1; surfaces: 판단 자산, llms; capability: 조건부 표현 흡수
- Status: [ ]

<!-- harness:milestone id="TC4" status="pending" priority="P1" -->
### TC4 — 성문 판단 diff: HIG·Material·Polaris
- DoD: 1급 디자인 시스템 원칙과 우리 시그니처·anti-patterns의 충돌 검증 diff가 기록되고, 채택·기각 각각 사유와 함께 자산 반영 1건 이상.
- Evidence: 활성화 시 plan doc + taste ledger
- Gap: 남이 증류한 판단과의 대조 없이 자가 기준만 존재.
- Scale: changesets>=1; surfaces: 판단 자산, llms; capability: 성문 판단 대조
- Status: [ ]

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
