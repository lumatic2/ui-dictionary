# changeset: 구성→레시피 구현 계약 (RC3 step 2)

- Date: 2026-07-19
- Plan: `plans/2026-07-19-rc3-composition-recipe-map.md`
- Evidence: `evidence/recipe-code-reuse/rc3-composition-map.md`

## Scope

- `design-brief.md`: 스튜디오 payload의 `implementation.composition/recipes`를 DESIGN.md Layout에 저장하고 실제 구현 출발점으로 소비한다.
- `brief-studio.md`: registry 코드가 있으면 이식·토큰 재결합, 없으면 recipe 문서 재구현으로 폴백하는 순서를 정본화한다.
- llms 파생본에 동일 계약을 배포한다.

## Verification

- 구성 13항, 매핑 49개, 고유 target 13개 전수 유효.
- registry 코드 자산 target 9개, recipe-only 폴백 4개.
- 기본 스튜디오 18축 제출 payload에서 `hero-cards-info`의 recipe 3개 관측.
- 누락 매핑은 `make-studio.py`가 exit 1로 거부.
- 사이트 build PASS.
- Cloudflare deployment `f33f2bcd`, custom domain의 새 구성→구현 계약 HTTP 200.
- stale Pages project name(`ui-vocabulary`)을 `ui-dictionary`로 교정.

## Result

구성 선택은 더 이상 와이어프레임 라벨로 끝나지 않고, DESIGN.md와 구현 에이전트가 소비하는 코드/문서 출발점으로 이어진다.
