# 20260712 Recipe Gallery 전용 섹션

Target: QA1 Step 1 — recipe 35종 사이트 실노출 + live-render 유보 계약 갱신.

## Scope

- `examples/ui-vocabulary-site`에 Recipe Gallery 섹션 신설: 인덱스(10 collection 그룹, 35 카드) + 상세(실 구현 컴포넌트 live render, 모바일 recipe는 자체 DeviceFrame).
- 신규: `src/lib/recipe-gallery-data.ts`(35 entry 정적 인덱스), `src/lib/recipe-gallery-demo-registry.ts`(slug→zero-prop 데모 매핑), `src/components/recipe-gallery-demos.tsx`(샘플 데이터/상태 래퍼), `src/components/recipe-gallery.tsx`.
- `App.tsx`: `PageMode`에 "recipes" 추가 — 기존 "colors" 페이지 배선 패턴 1:1 (topbar 진입점 + parsePageParam + 렌더 분기). `home-page.tsx` 푸터 링크 추가.
- `docs/design-system/recipe-format.md`: "사이트 렌더는 후속 milestone" 유보 조항을 갤러리가 live-render 표면임을 명시하는 계약으로 갱신 (+Changelog).
- 매핑 검증: data 35 = registry 35, 누락 0.

## Verification

- [x] `npm run build` — exit 0 (오케스트레이터 게이트 재실행 포함; 500kB chunk 경고는 기존)
- [x] `npm run lint` — 기준선 6 경고 정확히 유지, 신규 0
- [x] 브라우저 smoke — `?page=recipes` 인덱스에 10 collection 그룹 렌더, Bottom Tab Bar 상세가 DeviceFrame 안에서 live render (`docs/research/assets/qa1-step1-gallery-detail.png`)

## Result

Completed. recipe 35종 전부가 갤러리 인덱스 카드 + 상세 live render로 열람 가능해졌고, live-render 유보 계약이 해소됐다. 인덱스 카드는 정적(35종 동시 live render는 비용 판단으로 미채택 — 상세에서 1종씩 렌더).
