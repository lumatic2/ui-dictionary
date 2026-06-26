# UI Vocabulary Mobile Component Expansion

## planning_gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "UI Vocabulary Encyclopedia의 다음 horizon을 모바일 앱/모바일 웹 UI 컴포넌트와 패턴 확장으로 잡는다. 기존 257개 용어 중 모바일 항목은 일부만 흩어져 있으므로, 모바일 화면에서만 의미가 강한 구조, 제스처, 오버레이, 입력, 피드 패턴을 별도 배치로 보강한다."
  perspectives:
    product: "바이브코딩 사용자는 '아래에서 올라오는 창', '하단 탭', '옆으로 밀어서 삭제'처럼 모바일 특유의 생김새와 제스처를 자주 말한다. 이 horizon은 그런 표현을 정확한 UI 명칭과 연결한다."
    architecture: "기존 `docs/ui-vocabulary/terms.yml` -> generated data -> React visual renderer 흐름을 유지한다. 모바일 전용 필드를 무리하게 추가하기보다 `group`, aliases, visual_anatomy, prompt_phrases를 먼저 강화한다."
    security: "정적 dataset과 UI renderer만 다룬다. 외부 API, 사용자 데이터, 분석 로그, 네이티브 권한 호출은 없다."
    qa: "각 배치는 build/lint와 모바일 viewport smoke를 통과해야 한다. 모든 새 `asset.variant`는 `term-visual.tsx`에 fallback 없이 매핑되어야 한다."
    skeptic: "모바일 OS 고유 컨트롤을 모두 넣으면 glossary가 플랫폼 문서 복붙이 된다. 실제 바이브코딩 프롬프트에 필요한 visible pattern만 승격한다."
  dod:
    - "모바일 UI 후보 taxonomy와 승격 기준이 문서화된다."
    - "Batch 1~5로 나눈 모바일 후보 60~80개가 `terms.yml`에 추가된다."
    - "새 모바일 용어는 phone-frame 기반 mini visual 또는 기존 visual의 명확한 모바일 variant를 가진다."
    - "검색 fixture에 모바일 자연어 쿼리가 추가된다."
    - "중복/분류 감사에서 기존 terms와의 overlap을 related/alias/anti-use로 정리한다."
```

## Scope

In scope:

- Mobile app shell and navigation patterns.
- Mobile overlays and system prompts.
- Mobile gestures and touch interactions.
- Mobile inputs, pickers, and authentication patterns.
- Mobile feeds, cards, maps, commerce, and onboarding patterns.
- Search aliases for Korean appearance-based queries.

Out of scope:

- Native implementation APIs such as Android `Activity`, iOS `UIViewController`, or permission code.
- Pure animation vocabulary unless it has a visible UI affordance.
- Full app templates such as food delivery home, banking app, or social app. These belong in cookbook/screen pattern docs.
- Platform-only controls that are not useful in cross-platform web/app prompting.

## Reference Sources

Use existing Tier A/B source ids from `docs/ui-vocabulary/sources.md`.

- `material-m3-components`: navigation bar, navigation drawer, bottom sheets, dialogs, snackbars, date/time pickers, FAB.
- `apple-hig-components`: tab bars, navigation bars, sheets, action sheets, controls, touch interaction expectations.
- `wai-aria-apg-patterns`: accessibility behavior for dialog, menu, combobox, tabs, tooltip-like controls where relevant.
- `shadcn-ui-docs`, `radix-ui-primitives`: web implementation names when the mobile pattern has a web analogue.

## Milestone Tree

- [x] Step 0 — mobile taxonomy and candidate contract
  - AC: `docs/ui-vocabulary/mobile-expansion.md` defines groups, acceptance rules, candidate batches, and search fixture queries.
- [x] Step 1 — mobile app shell and navigation
  - AC: add high-frequency navigation/app-shell terms and phone-frame visuals; build/lint/mobile smoke pass.
- [x] Step 2 — mobile overlays and system feedback
  - AC: add sheets, action menus, permission/system prompts, snackbars/toasts; build/lint/mobile smoke pass.
- [x] Step 3 — mobile gestures and touch affordances
  - AC: add gesture-visible patterns such as swipe actions, pull refresh, drag handles, long-press menu, page indicators; build/lint/mobile smoke pass.
- [ ] Step 4 — mobile inputs, pickers, and auth flows
  - AC: add OTP, passcode, wheel pickers, mobile search, chip input, contact/address pickers; build/lint/mobile smoke pass.
- [ ] Step 5 — mobile content, commerce, and final audit
  - AC: add feed/story/media/map/commerce/onboarding patterns; update search fixture; run duplicate/category audit.

## Implementation Notes

- Introduce or reuse a `PhoneFrame` visual wrapper in `term-visual.tsx` before adding many mobile variants.
- Mobile terms should use Korean aliases that match how users describe the shape: `아래에서 올라오는`, `하단 탭`, `옆으로 밀기`, `끌어내려 새로고침`, `인증번호 입력`.
- Keep category stable unless the final audit proves that a new top-level category is needed. Prefer detailed `group` values first.
- Build after each batch because `npm run build` regenerates `src/data/terms.generated.ts`.
