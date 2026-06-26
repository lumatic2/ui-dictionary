# Step 1: Detail Reference And Prompt Copy UI

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/components/term-detail.tsx` — 왜: 상세 drawer UI를 수정하는 주 대상이다.
- `examples/ui-vocabulary-site/src/data/terms.generated.ts` — 왜: step 0에서 생성한 source registry export를 사용한다.
- `examples/ui-vocabulary-site/src/lib/term-ux.ts` — 왜: related/use-case 표시 로직과 detail UX helper 경계를 확인한다.
- `examples/ui-vocabulary-site/src/components/ui/button.tsx` — 왜: prompt copy와 source link 버튼은 기존 button primitive를 재사용한다.
- `examples/ui-vocabulary-site/src/components/ui/badge.tsx` — 왜: source tier, relation badge 표현에 기존 badge를 재사용한다.

## 작업

상세 drawer를 "학습 가능한 reference panel"로 개선한다.

- 출처 섹션은 `source_id` 대신 사람이 읽는 source label과 URL을 보여준다.
- source note가 있으면 짧게 표시한다.
- source 링크는 새 탭으로 열고 `rel="noreferrer"`를 둔다.
- prompt phrase는 복사 버튼을 제공하고, 복사 성공 상태를 짧게 표시한다.
- "빠른 판단", "언제 쓰나", "피해야 할 때"는 중복감을 줄이고, "이거 말고 이런 경우"가 잘 보이게 정돈한다.
- 관련 용어 카드는 relation, note, target term 이름이 빠르게 스캔되도록 개선한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build && npm run lint
```

## 검증 절차

1. AC 커맨드 실행.
2. 로컬 Chrome에서 `select`, `dialog`, `toast` 중 하나의 detail drawer를 열어 source link와 prompt copy가 보이는지 확인.
3. `phases/ui-vocabulary-term-detail-reference-depth/index.json`의 step 1을 completed로 갱신.

## 금지사항

- 상세 drawer 안에 긴 설명문을 추가하지 마라. 이유: 사전은 빠르게 스캔되어야 한다.
- `navigator.clipboard` 실패를 무시하지 마라. 이유: 브라우저 권한/HTTP 환경에서 fallback 상태가 필요할 수 있다.
