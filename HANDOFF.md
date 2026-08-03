# HANDOFF

## 이어서 할 일
> 2026-08-04 세션 종료 시 기록 (M16 매체 통합 검증 + M17 DESIGN.md→테마 배선 연쇄 완주)

- **active goal 0 — 다음은 `/harness-plan`.** 남은 큐(우선순위 사용자 소유): 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도 — 워크트리에서 직접) · dark/light 테마 SSOT 파생(SSOT dark 모드 토큰 정비 선행 — M17 finding) · D2 Presenton 벤치(수요 미확인) · Around 재판정(이식 milestone 개방 시).
- Figma 후속 2건은 다음 Figma 세션에 묶음: ① `figma-push-snapshot.mjs` 청크 옵션화 ② 계약 §2.2 변수 description 생성기 ③ 신규 토큰 생기면 `generate-figma-variables-sync.mjs` 재실행.
- `/pt` 신기능 실사용 대기: 덱 요청 시 대상 프로젝트 DESIGN.md 자동 탐지→custom 브랜드 테마 제안(M17). 첫 실전 사용에서 어색하면 SKILL.md §6 문구 조정.
- DESIGN.md 이탈 양식 3레포(askew-app 등 frontmatter 없는 표 기반)는 변환기가 거부함 — 그 레포 덱을 만들 일이 생기면 DESIGN.md를 표준 양식으로 정비하는 게 선행.

### 계획 위치 (cascade)
- 북극성: Askewly Design — "같은 토큰 SSOT에서 출발" 앞절이 발표 매체에서 실현됨 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-04 완주: M16(SSOT 소비 0건 실측→판정 A) + M17(변환기 2양식·/pt 브랜드 탐지 배선·관측 2케이스 PASS)
- 다음 차례: `/harness-plan` — 큐에서 goal 선택 또는 새 방향

### 현재 상태 / 주의점
- main 클린·push 완료(`7b9290a`). custom-skills push 완료(`55890eb`). 라이브 llms에 slide-spec 「토큰 출발점」 반영 확인됨(LIVE-OK 2026-08-04).
- 스킬 개명: presentation-slides-yusung → **`/pt`** (구명 트리거 병기). pr-review 세션 훅 노이즈 제거(cadence_nudge.py 체크 2 삭제).
- push 리모트명은 `origin` (구 표기 `ui-dictionary`는 문서 정정 완료 — phases/ 기록 문서에만 옛 표기 잔존).
- Figma: "Atlas Pilot 2026-08-01" 페이지 제거 완료(사용자 지시). MCP SKKU OAuth 유지.
- 시각 결과 제시는 Artifact로 띄워서(경로 출력 금지 — 메모리 show-results-visually).
