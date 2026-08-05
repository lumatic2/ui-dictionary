# M29 step-5 — CF Pages 배포 + `0.4.2` 출고 + 라이브 통합 E2E

> 2026-08-06 · plan `plans/2026-08-05-m29-docs-block-and-alias.md` step-5

## 배포

- push `08109a0..75fbd09` (5 커밋) → **Cloudflare Pages Git 통합**이 main push 로 자동 빌드.
  `https://ui.askewly.com/r/docs-site.json` 404 → **200** (배포까지 4회 폴링, 약 80초).
- npm: `gh workflow run publish-cli.yml --ref main` → [run 31031905737](https://github.com/lumatic2/ui-dictionary/actions/runs/31031905737)
  전 단계 ✓ (게이트 → pack 확인 → OIDC publish → 전파 확인 → 레포 밖 실증). `npm view @askewly/design version` → **0.4.2**.
- 순서는 계획 기술결정 ④ 대로 **registry 먼저**. 이번엔 asset 3종을 고쳤으므로 라이브 블록이 수정본을 물고 오는지가
  실질 검사였고, 이식된 파일에서 `dark:` 짝이 **실제로 확인**됐다(docs-code-block 1 · api-reference-layout 1 ·
  terminal-demo-panel 4). M28 승계 제약(로컬 서빙으로는 asset 변경분이 안 온다)이 여기서 해소된다.

## 통합 E2E — 인쇄된 안내만으로 (수기 보완 0)

빈 `create-vite react-ts` 프로젝트에서:

```
npx --yes @askewly/design@0.4.2 init . --block docs-site --color violet --yes
```

→ 인쇄된 6단계를 **그대로** 적용(alias 스니펫 · `npm i` 목록 · CSS import · `<html class="dark">` · export 진입점).
`@custom-variant` 도 `color-scheme` 도 손으로 넣지 않았다 — 이번 릴리스의 요점이 그것이다.

| 검사 | 결과 |
|---|---|
| 이식 | 21 파일, `verify PASS — 5 block file(s)` |
| 필수 CSS 변수 | 20/20 정의됨 |
| `npx tsc -b` | **exit 0** (M28 의 6건 무재현) |
| `npm run build` | **exit 0** |
| `npx @askewly/design@0.4.2 verify .` | **26 파일 0건** |
| 실브라우저 다크 | `color-scheme: dark` · `--background #0f1219` · `pre` 배경 `rgb(30,36,46)`(= muted 다크) |
| 실브라우저 라이트 | 클래스 제거 시 `color-scheme: light` 로 따라옴, 코드 패널은 라이트 반전 유지(회귀 없음) |
| 3페이지 + ⌘K | 아티클·API·체인지로그 전환, 검색 팔레트 개폐 정상 |
| 콘솔 에러 | **0** (전 경로) |

스크린샷: scratchpad `m29shots/40~44` (라이브 다크 아티클·API·체인지로그·검색 + 라이트 아티클).

## 재현

```
npx --yes @askewly/design@0.4.2 init <빈 vite react-ts dir> --block docs-site --color violet --yes
# 인쇄된 6단계를 그대로 → npx tsc -b → npm run build
```

## 남은 것

- 없음. M29 DoD 충족.
- finding 승계: `bg-foreground`/`text-background` 반전을 쓰는 나머지 **9개 파일**(범위 밖).
