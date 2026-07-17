# Staggered Entrance recipe + VI3 배포 (VI3 Step 2)

- Date: 2026-07-17
- Milestone: VI3 Step 2 (plan: `docs/plans/2026-07-17-vi3-motion-recipes.md`)
- Scope: `recipes/application-ui/staggered-entrance-group.md` + code_asset + gallery 배선, llms 재생성(54 assets)

## What

- 모션 안무(stagger) recipe — 절제된 stagger는 실무 기본값(magnetic과 달리 opt-in 아님)임을 계약에 명시. 간격 ≤60ms·총 400ms 상한·구조 우선 시퀀싱(헤더→콘텐츠→주요 행동) 체크 포함.
- reduced-motion 분기: 전 항목 즉시 완전 렌더(안무는 표현이지 게이팅이 아님).
- 티어 경계: 정적 리스트는 CSS animation-delay(①)로 충분 — 동적 개수·인터럽트 시에만 Motion(②).

## Verification

- [x] validate-recipes PASS (43) + generate-llms-txt PASS (54 assets) + build PASS
- [x] 브라우저 실구동: Replay 재구동 시 hidden(opacity 0) → settled(1) 전환 관측, 100ms 시점 미가시→900ms 완전 가시
- [x] failure probe: reduced-motion 분기 코드 존재(initial=false 경로), 애니메이션 미구동 시에도 settled 상태 도달 가능(variants 기반 — 콘텐츠 게이팅 없음)
- [x] 배포 curl: 3 recipe 200 + 오경로 404 (push 후 기록)
