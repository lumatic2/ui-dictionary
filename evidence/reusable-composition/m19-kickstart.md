# M19 evidence — 킥스타트 원커맨드

> Plan: `plans/2026-08-04-m19-kickstart-command.md` (chain 승격 2026-08-04)

## step-1 — 정본 문서 배선 (커밋 `10841c3`)

- block-contract §8(6단 계약) · design-brief 축약 모드 행(블록 출발일 때만 풀 브리프에 우선) · entry-protocol A-0 에이전트 호출 경로. llms 재생성·sync PASS. grep 검증: kickstart/축약 각 ≥1건.

## step-2·3 — CLI `init --block` 구현 (커밋 `b8ef36e`)

- `kickstart.ts`: 브리프(3문항·`--yes`·플래그) → DESIGN.md(tmpl flat colors·hex) → askewly-brand.css(light/dark+@theme) → fetch 선행·재귀 이식(asset URL+shadcn primitives+cn 보증) → `meta.requiredCssVars` 28건 기계 대조 → verify 자동.
- 검증 배터리: 무옵션 init 회귀 3파일 ✓ · `--yes` 전 구간 34파일·28/28·verify PASS ✓ · 플래그 주입 DESIGN.md 반영 ✓ · 실패 모드 exit 1 3종(옵션 밖 tone / 미존재 블록 **clean fail** — fetch 선행 보수로 파일 0개 생성 / DESIGN.md 충돌) ✓ · 요구 변수 고의 결손 단위시험 ✓ · **M17 슬라이드 변환기 호환 PASS**(29변수·대비 최소 5.71:1 AA — hex 전환 보수 후) ✓.

## step-4 — 빈 프로젝트 E2E + 사용자 관측 (2026-08-04)

- 절차: entry-protocol A-0 에이전트 경로 그대로 — 사용자에게 3문항(AskUserQuestion) → 답(minimal-clean·blue·geist-sans)을 플래그로 전달:
  `npx … init . --block saas-app-shell --tone minimal-clean --color blue --type geist-sans --yes`
- 전 구간 수동 개입 0(브리프→DESIGN.md→토큰층→이식 34파일→28/28 대조→verify PASS). 소비자 몫으로 남는 것(커맨드가 안내 출력): deps `npm i`, css import 1줄, 블록 렌더 1줄, 라우팅. dev 서버 → 사용자 기본 브라우저 관측.
- **사용자 관측 판정: 통과** (2026-08-04) — "나쁘진 않은데 더 다듬으면 좋겠다" → 게이트 통과(원커맨드 기본값이 쓸 만한 출발점인가 기준), 폴리싱 코멘트는 finding 큐 등재.
- 스크린샷: `screenshots/m19-step4-e2e-light.png` (블루 액센트·근백색 캔버스·Geist — 차트 면적은 full-page 캡처 시점의 recharts 진입 애니메이션으로 비어 보임, 실관측·M18 스모크에서 렌더 확인).
- 잔여 마찰(정직한 기록): deps 설치·css import·App 배선은 원커맨드 밖(안내 출력으로 계약) — vite 스캐폴드 자체를 만들어주는 것은 범위 밖(create-vite 소관).

## finding 큐

- 사용자 폴리싱 코멘트 — 킥스타트 기본값 시각 품질 다듬기(팔레트 미세조정·섹션 여백·카드 그라디언트 강도). 후속 반복 후보.
- recharts 진입 애니메이션이 정적 캡처와 상호작용 초기에 차트를 빈 면으로 보이게 함 — 블록 차트에 `isAnimationActive` 옵션 노출 검토.
- npm publish(새 CLI 버전 출고) — cli-release-procedure.md 경로, 사용자 승인 후.
