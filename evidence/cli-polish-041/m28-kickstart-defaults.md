# M28 evidence — 킥스타트 기본값 관측 (step-3)

> milestone: M28 · plan: `plans/2026-08-05-m28-cli-polish-041.md` · 결정 A = (a) 관측 후 지목분만

## 관측 대상

추천 기본값 그대로 — `tone=minimal-clean` · `color=blue` · `type=system-sans` (플래그 미지정 `--yes` = M19 사용자가 본 것과 같은 조합의 기본값 경로).

- 신선 vite react-ts 프로젝트(scratchpad `m28-defaults`)에 `init --block saas-app-shell --yes` → `init --block marketing-landing --yes --force` 2회 이식.
- 인쇄된 설치 목록을 **그대로** 실행 → `npm run build` PASS (**cva 누락 무재현** — M27 실패 경로가 이번 빌드에서 재현되지 않음).
- dev 서버 `http://localhost:5289/`, 뷰 토글(Landing/App shell) + 라이트/다크 토글.

## 기준선 스크린샷

scratchpad `m28-shots/` — `m28-landing-light.png`(전체) · `m28-landing-dark.png`(전체) · `m28-appshell-light.png` · `m28-appshell-dark.png`.

## 관측 결과 — 지목 3건 (2026-08-05, 오너 실브라우저)

지목은 전부 **블록·asset 표현** 쪽이었다. 팔레트·캔버스(CLI 소유)는 지목 없음 — `ACCENTS`/`CANVASES` 무변경.

| # | 지목 | 처리 | 파일 |
|---|---|---|---|
| 1 | "이런 카드에 그라디언트 있는건 모두 없애" | `MeshGradientSurface` 사용 2곳 제거 — story 첫 스텝의 전용 카드, CTA 밴드의 그라디언트 지면 | `blocks/marketing-landing/story-section.tsx` · `cta-section.tsx` |
| 2 | "카드 아웃라인도 없애면 좋겠는데, 어떤 컴포넌트를 넣었을 때 아웃라인이 또 있는 거 같아서" | 미디어 슬롯의 테두리 제거 — story 스텝은 asset 자체 플레이스홀더(`bg-muted`, 보더 없음)로 통일, CTA 밴드도 보더 없이 `bg-muted` | `zigzag-story-section.tsx` · `cta-section.tsx` |
| 3 | "마키가 좌측면으로 쏠려 있는거 수정하고, hover 해도 안 멈추고" | 컨테이너에 `mx-auto`, 일시정지를 `group`/`group-hover` 로 교체 | `logo-marquee.tsx` |

**hover 가 안 먹던 원인**: `hover:[&>div]:[animation-play-state:paused]` — 쌓인 variant 는 오른쪽에서 왼쪽으로 적용되므로 결과 셀렉터가 `.strip > div:hover` 가 됐다. 컨테이너 hover 로 읽히지 않는다.

### 측정 (전/후)

| 항목 | 전 | 후 |
|---|---|---|
| 마키 중심 vs 부모 중심 | 어긋남(좌측 쏠림) | 713 == 713 |
| 트랙 `animation-play-state` (idle → hover) | running → running | running → **paused** |
| DOM 내 `radial-gradient` | 있음 | **없음** |
| 블록 섹션 수 | 9 | 9 (구조 무변경) |

- 후 스크린샷: `m28-after-hero-strip.png`(마키 중앙·플레이스홀더 무테) · `m28-after-cta.png` · `m28-after-cta-dark.png`.
- ⚠ **fullPage 스크린샷의 빈 구간은 결함이 아니다** — `scroll-driven-reveal` 이 `animation-timeline: view()` 로 뷰포트 밖 섹션을 `opacity: 0` 으로 두기 때문. DOM 상 9섹션 전건 존재를 별도 측정으로 확인했다.

### 관측 경로 주의

블록 JSON 의 asset `registryDependencies` 는 **라이브 절대 URL** 이라 `--registry` 로컬 서빙으로는 asset 변경분이 오지 않는다(M27 기록된 혼합 동작). 이번 관측은 `logo-marquee.tsx`·`zigzag-story-section.tsx` 두 파일을 관측용 프로젝트에 직접 복사해 확인했고, **라이브 경로 재확인은 배포 후 step-4 에서** 한다.

## 손댈 수 있는 표면

| 지목 대상 | 소유 파일 | 딸려오는 것 |
|---|---|---|
| 액센트 팔레트(라이트/다크 primary·ring) | `packages/cli/src/kickstart.ts` `ACCENTS` | CLI 재출고만 |
| 캔버스 중립색·radius(배경·카드·보더·muted) | 같은 파일 `CANVASES` | CLI 재출고만 |
| 섹션 여백·카드 그라디언트 강도 | `examples/ui-vocabulary-site/src/components/blocks/<block>/` | registry·llms 재생성 + CF Pages 배포 |

## finding

- **`@/` alias 안내 누락** — 인쇄된 3번 항목이 `@/components/blocks/...` 를 쓰라고 하는데, alias 설정(vite `resolve.alias` + tsconfig `paths`)은 어디서도 안내하지 않는다. 신선 vite 프로젝트에서 실제로 `tsc -b` 가 6건 실패했고 수기로 메웠다. M28 scope 4건 밖 — 0.4.x 큐로 적재.
