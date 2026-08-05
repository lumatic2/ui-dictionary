# M28 evidence — `0.4.1` 출고 + 라이브 재현 (step-4)

> milestone: M28 · plan: `plans/2026-08-05-m28-cli-polish-041.md`

## 출고

- `0.4.0` → **`0.4.1`** (patch — 오탐 수정·누락 수정, CLI 인터페이스 무변경).
- 경로: Trusted Publishing 워크플로 [run 30988075333](https://github.com/lumatic2/ui-dictionary/actions/runs/30988075333) — 게이트·pack 확인·OIDC publish·전파 확인·레포 밖 실증 전 단계 ✓.
- 배포 전 게이트: build(terms=563 recipes=48) · vitest **71/71** · `tsc --noEmit` exit 0 · `npm pack --dry-run` 15 files·259.6 kB(`src/`·`test/`·`scripts/` **0건**).
- `npm view @askewly/design version` → `0.4.1`.

## 라이브 재현 — M27 에서 깨졌던 경로 그대로

빈 vite react-ts 프로젝트(scratchpad `m28-live`)에서:

```
npx --yes @askewly/design@0.4.1 init . --block marketing-landing --color teal --yes
```

1. 이식 exit 0 · requiredCssVars 20/20 · `verify PASS — 10 block file(s)`.
2. **인쇄된 설치 목록을 그대로 실행** — `class-variance-authority clsx lucide-react motion radix-ui react tailwind-merge`.
3. **인쇄된 export 로 진입점 작성** — `import { MarketingLandingPage } from "@/components/blocks/marketing-landing/page"`.
4. `npm run build` **PASS** — **cva 누락 무재현**(M27 실패 지점).
5. `npx @askewly/design@0.4.1 verify src` → **25 파일 0건**.
6. `vite preview` 실브라우저 런타임 측정: 섹션 **9** 렌더 · **콘솔 에러 0** · h1 렌더.

## step-3 변경분의 라이브 반영 확인

CF Pages 배포 후 라이브 registry 가 갱신된 asset 을 서빙하는지 — 이식된 파일 실측:

| 확인 | 결과 |
|---|---|
| `logo-marquee` 컨테이너 `mx-auto` | 있음 · 런타임 중심 정렬 측정 PASS |
| `zigzag-story-section` 플레이스홀더 `border` | **없음** (`rounded-lg bg-muted`) |
| 블록 내 `MeshGradientSurface` 사용 | **0건** · DOM 내 `radial-gradient` **없음** |

## 실패 모드 확인 (계획 DoD)

- 마스킹 과다 — `bg-[#ccc]` 는 여전히 위반(fixture `attr-selector-outside.tsx`, 한 줄에 면제 셀렉터와 동거).
- dep 집계 과소·과다 — type-only·side-effect·re-export·동적 import·require 5형태 포함, `node:` 내장 제외(단위 테스트).
- export 미발견 — 심볼을 지어내지 않고 파일 안내로 폴백(단위 테스트).
- WCAG — 팔레트 무변경(지목 없음)이라 대비 회귀 없음.

## finding (0.4.x 큐 승계)

- **`@/` alias 안내 누락** — 인쇄된 3번 항목이 `@/...` 를 쓰라면서 alias 설정(vite `resolve.alias` + tsconfig `paths`)은 안내하지 않는다. 라이브 E2E 에서도 수기로 메웠다. 0.4.1 에 태우지 않고 다음 patch 로 넘김(사용자 판단 보류).
