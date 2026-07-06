# Step 54: calendars-page-parity-pass

## 읽어야 할 파일
- `CLAUDE.md` - 왜: Tailwind Plus reference 기반 IA와 leaf 구현 기준을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Calendars leaf examples와 preview renderer가 구현된 파일이다.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - 왜: `plus-data-display-calendars` leaf의 실제 IA 위치를 확인한다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: 이전 leaf parity pass와 검증 기록을 이어받는다.

## 작업
- Tailwind Plus `Application UI / Data Display / Calendars` 페이지를 캡처한다.
- 로컬 `plus-data-display-calendars` leaf 페이지를 캡처한다.
- 캡처를 비교해 calendar 로컬 leaf에서 부족한 구조, 상호작용, motion, light/dark behavior를 보강한다.
- 작업 범위는 `plus-data-display-calendars` leaf와 해당 preview variants로 제한한다.

## Acceptance Criteria
```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
python scripts/validate-ui-vocabulary.py
```

## 검증 절차
1. Tailwind 공식 Calendars reference와 로컬 Calendars 페이지 스크린샷을 저장한다.
2. 로컬 Calendars leaf에서 Today/Add event, mini day selection, meeting selection, month/week/day/year controls, light/dark toggle을 직접 클릭한다.
3. Desktop과 mobile 390px에서 overflow, console error, framework overlay 여부를 확인한다.
4. `phases/tailwind-plus-catalog-interactivity/index.json` step 업데이트:
   - 성공 -> `completed` + `summary`
   - 사용자 개입 필요 -> `blocked` + `blocked_reason`

## 금지사항
- Calendars leaf 외의 pages를 이 step에서 함께 수정하지 않는다. 이유: 작업 단위를 한 페이지로 고정한다.
- Tailwind 원본 문구를 그대로 복제하지 않는다. 이유: 우리 사이트 맥락에 맞춘 UI Dictionary copy를 유지한다.
