# Step 10: batch-4-feedback-permission-system-states

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-full-component-expansion.md` — 왜: Batch 4 scope와 final audit 의존성을 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: feedback/system-state terms를 추가한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: state visual variants를 구현한다.
- `phases/ui-vocabulary-encyclopedia/step9.md` — 왜: 직전 batch 결과를 이어받는다.

## 작업

Batch 4 feedback, permission, and system-state patterns 20개를 추가한다. 대상 예: `media-card`, `video-player-controls`, `audio-player-controls`, `image-gallery`, `lightbox`, `cropper`, `upload-dropzone`, `attachment-list`, `file-card`, `product-card`, `price-card`, `plan-card`, `feature-comparison`, `coupon-field`, `quantity-stepper`, `cart-summary`, `checkout-step`, `payment-method-card`, `address-card`, `order-status`.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 10을 `in_progress`로 바꾼다.
2. 20개 term과 visual variant를 추가한다.
3. build/lint/render smoke를 실행한다.
4. 성공하면 step 10을 `completed`로 갱신한다.

## 금지사항

- commerce terms를 앱 전체 화면 템플릿으로 만들지 않는다. 카드, 컨트롤, 상태처럼 작은 recognizable UI pattern으로 유지한다.

