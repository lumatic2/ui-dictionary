# RC1 코드 자산 이식 실구동

- Date: 2026-07-19
- Asset: `examples/ui-vocabulary-site/public/r/stat-summary-grid.json`
- Consumer: 새 Vite 8 + React 19 + Tailwind CSS 4 프로젝트 (`tmp/rc1-transplant`, 검증 후 삭제)

## 수행

1. registry JSON의 `files[0].content`를 새 프로젝트의 `StatSummaryGrid.tsx`로 이식했다.
2. 선언된 외부·registry 의존성이 모두 빈 배열임을 확인했다.
3. 소비 프로젝트 semantic token(`background`, `foreground`, `card`, `muted-foreground`, `primary`, `border`)으로 룩을 다시 결합했다.
4. `npm run build` 후 로컬 Vite 서버를 띄우고 Python Playwright로 실제 렌더를 검사했다.

## 관측

- Build: PASS — 17 modules, JS 192.09 kB, CSS 46.54 kB.
- Browser: PASS — `Workspace summary`, `Active workspaces`, `98%`, 통계 행 3개 표시.
- Console errors: 0.
- Screenshot: `evidence/recipe-code-reuse/rc1-transplant.png`.
- `llms.txt`: `Code Assets (verified implementations)`와 `/r/<name>.json` 링크 27개, registry index 1개.

## 실패 경로

- 결합 자산 `landing-hero`를 registry에 넣는 probe는 생성기의 순수성 게이트에서 `@/components/home-page`, `@/lib/exposure` 의존으로 exit 1 거부됐다.
- 미선언 의존은 import 파싱 결과와 manifest 선언 대조에서 생성 단계 오류가 된다.

## 판정

RC1 DoD 충족: 27개 빌드·인덱스, 깨끗한 프로젝트 이식 1건 실구동, 실패 모드 2종 거부 경로가 모두 확인됐다.
