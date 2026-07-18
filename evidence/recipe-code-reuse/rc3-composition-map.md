# RC3 구성→레시피 매핑 실증

- Date: 2026-07-19
- Data SSOT: `templates/studio-data.default.json`

## 전수 검사

- 구성 후보: 13/13.
- `pv`↔`recipes` 항목: 49/49.
- 고유 target: 13개 — registry 코드 자산 9개, recipe 문서 폴백 4개.
- 존재하지 않는 target: 0.
- 누락 키 probe: `hero-cards-info.recipes.hero` 제거 시 `recipes 키 누락: hero`, exit 1.

## 브라우저 제출

- 생성물: `templates/brief-studio.html`.
- 1단 타일 + 18축 첫 후보 선택 후 제출.
- payload `implementation.composition`: `hero-cards-info`.
- payload `implementation.recipes`: `landing-hero`, `responsive-content-grid`, `article-documentation-layout`.
- Screenshot: `evidence/recipe-code-reuse/rc3-studio-payload.png`.

## 계약 추적

`payload implementation.recipes → DESIGN.md Layout 기록 → /r/<recipe>.json 코드 이식·프로젝트 토큰 재결합 → 자산 없음 시 recipe md 재구현 → Checks` 순서를 design-brief/brief-studio에 기록했다.

## 판정

RC3의 데이터·수집·저장·구현 지시가 하나의 추적 가능한 경로로 연결됐다. 실배포 curl 결과는 push 후 이 문서에 추가한다.
