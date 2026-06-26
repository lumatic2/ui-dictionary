# Step 0: mobile-taxonomy-and-candidate-contract

## 읽어야 할 파일

- `docs/ui-vocabulary/mobile-expansion.md` — 왜: 모바일 taxonomy, 후보 배치, 검색 fixture의 source of truth.
- `docs/plans/2026-06-26-ui-vocabulary-mobile-expansion.md` — 왜: horizon scope, DoD, non-goals 확인.
- `docs/ui-vocabulary/sources.md` — 왜: source_id와 trust tier 확인.
- `docs/ui-vocabulary/terms.yml` — 왜: 기존 모바일/중복 후보 확인.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: phone-frame visual wrapper와 variant 추가 위치 확인.

## 작업

모바일 UI 확장의 경계를 먼저 정한다. 플랫폼 문서 복붙이 아니라 사용자가 AI에게 화면을 요청할 때 필요한 "보이는 이름"만 승격한다.

## Acceptance Criteria

- 모바일 group taxonomy가 문서화되어 있다.
- Batch 1~5 후보가 60개 이상 정리되어 있다.
- 검색 fixture에 한국어 자연어 query와 expected ids가 있다.
- 구현 non-goals가 명확하다.

## 검증 절차

1. 후보가 기존 terms와 명백히 중복되는지 spot-check한다.
2. 각 후보가 phone-frame mini visual로 표현 가능한지 확인한다.
3. Step 1 구현 전에 source id와 category/group 분류를 다시 확인한다.

## 금지사항

- 모바일 OS 내부 구현 API를 term으로 승격하지 않는다.
- 단순 responsive 상태만으로 새 term을 만들지 않는다.
- 네이티브 스크린샷을 visual source로 쓰지 않는다.

