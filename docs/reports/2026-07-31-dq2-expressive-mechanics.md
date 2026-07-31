# 완료 — DQ2 표현 기계 업그레이드 (goal `deck-quality` 2/3)

> 완료: 2026-07-31 · DQ2 (goal `deck-quality`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

이월 finding 3건이 전부 기계로 들어왔다: ① **animId 장간 연속 전환**(reveal.js Auto-Animate 상당) — cross-document View Transitions 기반 opt-in, file:// 동작을 chromium 151·실크롬 stable 150 양쪽에서 실측하고 배선 ② **이미지 최적화 빌드** `optimize-images.mjs`(opt-in sharp) — 캔버스×2 리사이즈+webp, 원본 보존, 누끼 알파 보존, 실측 77% 감소 ③ **split-screen sourceNote 겹침 수리**. custom-skills 2커밋(c10a2a8→9c2dad8) 배포·push.

## 2. 이슈와 해결

- animId 초판이 템플릿 문자열의 빈 줄 2개를 **animId 없는 덱에도** 유출 — "미사용 덱 산출 diff 0" 게이트가 잡아 조건부 개행으로 수정. opt-in 계약이 게이트로 실제 지켜졌다.
- sourceNote 를 플로우로 내리는 데 특이도가 필요했다(`.container > *` 의 relative + capture 의 `bottom:24`) — `.container.layout-split-screen` 로 올려 해결. 처음 얹은 `.split-screen` 셀렉터는 렌더러가 내지 않는 클래스라 사용 안 되는 규칙이어서 제거(렌더러는 `.projectIntro`).
- 크기 회고: changeset 1디렉터리·step 2절 — 정합.

## 3. 증거

- changeset: custom-skills `changesets/20260731-dq2-expressive-mechanics`
- 검증: `evidence/deck-quality/dq2-expressive-mechanics.md`
- 실표면: fixture 덱을 chromium 실구동으로 열어 →키 전환 시 `pagereveal.viewTransition`=true 를 assertion 으로 확인(ANIM-VT PASS), 최적화 산출물을 실렌더해 화질·알파·노트 위치를 좌표 측정(760<768)으로 확인. 실크롬 stable 150 은 VT 지원 여부까지만 확인했고 **더블클릭 실행 경로의 체감 전환은 DQ3 사용자 관측으로 이월**(평가 못 함: 헤드리스 아닌 실사용 개봉).
- 재현: `node tools/optimize-images.mjs && node tools/build-slides.mjs` + `node <scratchpad>/dq2-anim-e2e.mjs <fixture>` + HU4 5종
