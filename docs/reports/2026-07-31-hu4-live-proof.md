# 완료 — HU4 통합 실증: 정본 덱 라이브 리허설 + 발표 게이트 (goal `html-upgrade` 4/4)

> 완료: 2026-07-31 · HU4 (goal `html-upgrade`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

HU1~HU3 업그레이드(발표 운영·모션 문법·이미지 트랙)를 정본 덱 `decks/askewly-design-intro` 에 통합 적용하고, 사용자 실크롬 file:// 관측 6회차 라운드로 발표 표면을 실증했다. 관측이 잡은 실환경 결함 6건을 전부 수리: ① fragment 기본값 반전(기본=전체 표시, 사용자 확정) ② 실크롬 file:// opaque origin 동기 사망 → postMessage 릴레이+하트비트 ③ 노트 창내 수정 불가 → textarea+수정본 복사 ④ 미리보기 iframe 포커스 강탈 → pointer-events 차단+top-window 가드, FOUT → 폰트 게이트 ⑤ 다중 덱 창 announce 경합 깜빡임 → 단일 마스터 규칙+DOM 멱등화 ⑥ 재연결 지연(≤1.2s) → 넘김 목적지 선공지(실측 21~269ms). 발표 게이트를 `references/verification.md` 「발표 전 체크」·`methodology/slide-production.md` 「발표 운영」으로 명문화. custom-skills 6커밋(2fc6a4b→d8ac491) 배포·push.

## 2. 이슈와 해결

- Playwright headless 만으로는 실크롬 file:// 환경차(opaque origin·포커스 흐름·다중 창)를 못 잡았다 — 사용자 관측 라운드가 결함 6건을 전부 발견했고, 각 결함은 합성 재현 테스트(`POSTMESSAGE-SYNC`·`IFRAME-GUARD`·`TWO-DECKS`·`SYNC-LAG`·`PREVIEW-FOUT`)로 박제해 회귀를 잠갔다.
- export 무오염 보증: FOUT 게이트는 최상위 print/capture(익스포터)에서 스킵, capture 픽셀 diff 는 4장 비트 동일·3장 파랑 채널 최대 2/255 렌더 노이즈(비지각)로 콘텐츠 무변 확인.
- 크기 회고: milestone 은 changeset 1디렉터리(8절)로 닫혔으나 사용자 관측 6라운드·독립 수리 6건을 포함 — step-grade 아님, 라벨 정합.

## 3. 증거

- changeset: custom-skills `changesets/20260731-hu4-live-proof` (step 2절 + 관측 라운드 r1~r5 절)
- 검증: `evidence/html-upgrade/hu4-live-proof.md` — 리허설·회귀·관측 6회차 전체 기록, 최종 게이트 닫힘.
- 실표면: 사용자가 실크롬 file:// 에서 정본 덱을 6회 라운드 실조작 — 최종 관측 6회차 "잘 되는거 확인"(양방향 즉시 동기·무깜빡임·노트 편집·FOUT 해소 전부 통과). 에이전트 측도 chromium 실구동으로 SYNC-LAG 42/269/21ms·TWO-DECKS 재로드 0회를 assertion 평가로 확인.
- 재현: `node tools/build-slides.mjs && node <scratchpad>/hu4-{postmessage-sync,iframe-guard,two-decks,sync-lag,preview-fout,rehearsal}.mjs`
