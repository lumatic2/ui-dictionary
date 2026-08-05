# M29 step-4 — docs-site 블록 사이트 배선 + 실브라우저 관측

> 2026-08-06 · plan `plans/2026-08-05-m29-docs-block-and-alias.md` step-4 · 관측 게이트 통과

## 관측 방법

갤러리 카드(640px 박스)가 아니라 **소비자가 보게 되는 전체 화면**에서 봤다 — 빈 vite react-ts 프로젝트에
`init . --block docs-site --color violet` 로 이식하고 `vite preview` 로 띄웠다. 로컬 registry 서빙
(`python -m http.server 8899` → `--registry`) 사용, asset regDeps 는 라이브 절대 URL 이라 수정한 asset 3종은
파일 직접 복사(M28 승계 제약).

스크린샷: 세션 scratchpad `m29shots/` (라이트/다크 × 아티클·API·체인지로그, ⌘K 검색, 버전 전환, 카테고리 필터,
수정 전/후 비교). 사용자 제시 = Artifact 페이지 1본.

## 사용자 지목과 처리

### 지점 A — 다크에서 코드 패널이 흰색으로 뒤집힘 → **수정**

- 증상: `docs-code-block`·`api-reference-layout`·`terminal-demo-panel` 이 `bg-foreground` / `text-background`
  로 **의미 반전**을 쓴다. 라이트에서는 "어두운 코드 패널"이 되지만 다크에서는 같은 규칙이 **밝은 패널 + 어두운
  글자**를 만든다. 토큰 규칙 위반이 아니라 `verify` 는 통과하고, 대비도 최대치라 접근성 실패도 아니다 — 어두운
  지면에 흰 덩어리가 뜨는 시각 문제다.
- 사용자 판정(2026-08-06): **"다크에서도 코드 패널을 어둡게 가자."**
- 처리: `dark:bg-muted dark:text-foreground` 를 덧붙였다(터미널은 `text-background/xx` 계열 7곳에 다크 짝을
  추가). **새 토큰(`--code` 등)을 만들지 않았다** — requiredCssVars 가 늘면 이미 배포된 소비자 계약이 바뀐다.
  표준 shadcn 20종 안에서 해결.
- **범위 주의(정직한 기록)**: 이 반전 패턴은 레포 전체 **12개 파일**에 있다. 이번에 고친 것은 **이 블록이 실제로
  렌더하는 3종뿐**이다. `terminal-demo-panel` 은 `marketing-landing`(M27)도 쓰므로 그 블록의 다크 터미널도 같이
  어두워진다 — 같은 종류의 개선이라 의도적으로 포함했다. 나머지 9종(marketing hero·colors-page 등)은 이 milestone
  범위 밖이며 finding 으로 남긴다.

### 지점 B — 다크 스위치가 두 개로 갈라져 있었다 → **수정** (계획 밖에서 발견)

- 증상: CLI 가 만드는 `askewly-brand.css` 는 `.dark { … }` 로 **토큰 값**을 정의하지만, **`dark:` 유틸리티가 그
  클래스를 보게 만드는 선언이 없었다.** Tailwind v4 의 기본 `dark:` 는 클래스가 아니라 `prefers-color-scheme` 다.
- 결과: 두 개의 독립 스위치. 앱이 `.dark` 를 토글하면 → 토큰은 다크인데 `dark:` 유틸리티는 라이트로 남는다.
  OS 가 다크인 방문자는 → 라이트 토큰 위에 다크 유틸리티가 얹힌다. 이식된 shadcn primitive **9종 18곳**이
  `dark:` 를 쓰므로 장식이 아니라 하중을 받는 결함이다.
- 발견 경위: **관측을 위해 내가 직접 `@custom-variant` 를 손으로 넣고서야 다크가 보였다.** `@/` alias 와 같은
  종류의 누락 — 인쇄된 안내를 그대로 따르면 도달할 수 없는 상태.
- 처리: `renderBrandCss` 가 `@custom-variant dark (&:where(.dark, .dark *));` 를 토큰 블록보다 **앞에** 낸다.
  `Next steps` 에 "`dark` 클래스를 `<html>` 에 붙이면 토큰과 유틸리티가 같은 스위치로 움직인다" 단계 추가,
  CSS import 단계에 "순서가 중요하다(다크 variant 를 등록한다)" 명시.

### 지점 C — `color-scheme` 미선언 → **수정**

- 증상: 사이트 본체 `index.css` 는 `color-scheme: light|dark` 를 갖는데 **CLI 생성물엔 없었다.** 토큰은 우리가
  그리는 것만 칠한다 — 스크롤바·네이티브 select/checkbox·오버스크롤 지면은 브라우저 소유라 다크에서 흰색으로 남는다.
- 처리: `:root` 에 `color-scheme: light`, `.dark` 에 `color-scheme: dark`.

### 지점 D — OS 다크 사용자 기본값 없음 → **의도적 미조치**

`.dark` 클래스를 붙이지 않으면 OS 가 다크인 방문자도 라이트를 본다. `@media (prefers-color-scheme: dark)` 로
자동 적용하면 앱이 나중에 붙일 명시적 토글과 충돌한다(사용자가 라이트를 골라도 OS 가 이기는 상태). 스위치는
하나로 두고, **인쇄된 안내가 켜는 법을 말하게** 하는 쪽을 택했다(지점 B 의 4번 단계).

## 검증

- **인쇄된 안내만으로 재현**(수기 보완 0 — `@custom-variant` 를 손으로 넣지 않았다): 빈 vite → `init --block
  docs-site --color violet --yes` → 인쇄된 alias 스니펫 → 인쇄된 `npm i` → 인쇄된 CSS import → 인쇄된 대로
  `<html class="dark">` → `npm run build` **exit 0**.
- 실측 computed style — 다크: `color-scheme: dark` · `--background: #0f1219` · `pre` 배경 `rgb(30,36,46)`(= `--muted` 다크).
  라이트로 클래스를 떼면 `color-scheme: light` 로 따라옴. **라이트 회귀 없음**(코드 패널은 전과 같이 어두운 반전 유지).
- 콘솔 에러 **0** (라이트·다크·검색·버전 전환·필터 전 경로).
- 사이트 배선: Docs 컬렉션에 카드 노출, 클릭 시 데모 마운트, 콘솔 0.
- 기계 게이트: `generate-registry` 재생성 diff = **수정한 asset 3종만**(다른 54종 무변경) · `verify` 블록 5파일 **0건** ·
  사이트 `npm run build` exit 0 + prerender **759** · CLI `vitest` **80/80**(신규 3) · `tsc --noEmit` exit 0 · oxlint 0건.

## 남긴 finding

- `bg-foreground`/`text-background` 반전을 쓰는 나머지 **9개 파일**(marketing hero·colors-page·contrast-duo-card 등).
  다크에서 같은 반전이 일어난다. 이번 범위 밖 — 일괄 판정이 필요하면 별도 milestone.
