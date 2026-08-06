# HANDOFF

## 이어서 할 일
> 2026-08-07 세션 종료 시 기록 (goal `findings-sweep` 완주 — M36 단독)

- **active goal 0 — 다음은 `/harness-plan` 새 goal 개설** (사용자 예고: "다음 세션에서 새롭게 목표 세워볼게").
- **`/pt` 슬롯 계약 계획 on-hold**: `plans/2026-08-06-m37-pt-slot-contract.md` — 사용자 보류("왜 건드는지 맥락을 모르겠다"). 재상정 시 **M33 벤치 §4-① 맥락(레이아웃 스키마=생성 계약) 공유·논의부터**, milestone 번호는 그때 새로 받는다.
- **생성기 수리 후보 2건** (`docs/findings.md` §G, M36 실측 사고): ① `generate-registry.mjs --print-measured` 가 `public/r/` 를 지우고 index 를 안 쓴 채 종료(파괴적 — `:207`/`:392`) ② `generate-llms-txt.mjs` `assetFor` 가 index 부재를 조용히 빈 목록으로 받아 레시피 STOP 배너 32건 무음 소실. 수리 방향: print 모드 삭제 금지 + llms 하드 실패.
- 스와치 라벨 다크 대비 finding — `getReadableTextColor` 가 테마 변수 반환(§G 마지막 항목, palette-generator-core 걸침).
- **M35 미실증 승계**: `use_figma` 20kb 절단 재현 불가(큰 서브트리 부재) — 조건 생기면 `figma-push-snapshot.mjs --from/--to` 재시도.
- 큐 잔여: 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도 — **별도 워크트리**, main 에서 건드리지 않음).

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품(내 디자인 색채를 남의 레포·매체에 입힌다) (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-06 M36 완주(goal `findings-sweep` close). 보고서 `docs/reports/2026-08-06-m36-palette-generator-restyle.md`.
- 다음 차례: `/harness-plan` — 새 goal 개설(findings §G 수리 후보·on-hold 계획이 재료)

### 현재 상태 / 주의점
- main 클린·push 완료(`68ee62c`). ROADMAP 148줄(상한 150 임박 — 다음 `/harness-done` compact 주의).
- `color-palette-generator` 라이브 반영 완료 — 선언 14종·`askewly-violet` 0·소비처 포커스 링 실측. CF Pages 반영 지연 실측 이력: 폴링 10회 ≈ 5분(M32 4분·M31 2분 — 회차별 변동).
- `requiredCssVars` 계약 승계: 누락=실패·초과=통과이므로 **초과 선언은 게이트가 못 잡는다** — 선언 갱신은 `--print-measured` 전사 + 집합 일치 diff 로(단 위 파괴성 주의: 실행 후 `generate-registry.mjs` 전체 재실행 필수).
- Presenton 이미지 5.27GB 로컬 잔존(`docker rmi` 후보) · untracked `glow-t1/t2.png` 사용자 소유 — 건드리지 않음.
