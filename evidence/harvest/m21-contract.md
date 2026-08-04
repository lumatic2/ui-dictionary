# M21 evidence — 회수 계약 정본화 + 첫 승격 실증

- 계약: `docs/design-system/harvest-contract.md` (llms 실등재 — 미등재 0건 probe 후 등재 1건, check-llms-sync PASS)
- 승격 2건: `/r/zigzag-story-section.json` · `/r/terminal-demo-panel.json` — meta.harvest(원 프로젝트·라이브 URL·회수일)
- 게이트: 기존 28건 재생성 diff 0(스냅숏 대조) · purity probe FAIL 실확인 · hex probe 적발 · build 759 routes · lint/sync PASS · 신선 프로젝트 격리 verify 0건
- E2E: 킥스타트 신선 프로젝트 이식 + 실브라우저 시간차 3장 — 실결함 1(타이핑 리셋 루프) 적발·수정·재검증
- 사용자 관측: 2026-08-04 통과("응 ㄱㅊ") — 승격 실증 보드(Artifact)
- 완료 보고: `docs/reports/2026-08-04-m21-harvest-contract.md`
