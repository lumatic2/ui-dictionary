# 20260804-m24-harvest-batch3 — M24 harvest 배치 3

> plan: `plans/2026-08-04-m24-harvest-batch3.md` · milestone: M24

## step-1 — plain-asset 게이트 확장 (선언 의존성 + 등재 자산 참조)

- `scripts/generate-registry.mjs` plain-asset 경로에 블록 계약 §2 준용 2경로 추가:
  ① `item.dependencies` 선언 npm allowlist(선언+실사용 대조 — 선언·미사용도 FAIL, 패키지 루트 기준 매칭 `motion/react`→`motion`)
  ② `@/components/<등재자산>` 참조 허용 → registryDependencies URL 파생(미등재 참조는 FAIL).
- `dependencies` 산출을 패키지 루트로 정규화(기존 항목은 lucide-react 뿐이라 출력 불변).
- 검증: 재생성 기존 38건 diff 0(porcelain 무출력) + 자기시험 3건 전부 FAIL 적발(미선언 motion / 선언·미사용 / 미등재 device-frame 참조) + 원복 재생성 OK.

## step-2 — device-frame 부속 승격 + 미등재 마이크로 인터랙션 6종 등재

- registry.json +7 (device-frame 부속 + magnetic-hover-button·spring-drag-snap-card·swipe-action-row-pattern·pull-to-refresh-list-pattern·staggered-entrance-group·bottom-sheet-detents) — meta.harvest 전건(본체 출처), motion 의존 3종 dependencies 선언.
- 소스 재작성 0 — 7종 전건 기존 파일이 계약 §3 준수(시맨틱 토큰·reduced-motion·aria·비드래그 대체 경로) 상태.
- 검증: 재생성 45건(38+7 순수 추가 — 기존 per-item diff 0, index만 M) + device-frame 참조 3종의 registryDependencies 에 `/r/device-frame.json` URL 파생 확인 + motion 선언 3종 dependencies `["motion"]` + hex probe(bg-[#ff0000] 주입→lint:colors FAIL 적발→원복 0건) + lint·build 759 routes PASS + llms 재생성(197 assets).

## step-3 — 미등재 데모 3종 독립 추출 + 등재

- home-page.tsx 내장 3종을 독립 컴포넌트로 추출: `product-coverflow.tsx`·`hero-composition.tsx`·`image-treatment.tsx`. home-page 는 신규 파일 import 로 전환, 구 정의 3블록 삭제(잔존 참조 grep 0 — 중복 정의 probe PASS), 추출로 미사용이 된 import 5줄 제거.
- 얽힘 처리: 공유 훅 `usePrefersReducedMotion` 파일별 인라인 · keyframe 컴포넌트 내장+이름 스코프(`hero-composition-rotator-fade`·`image-treatment-wipe-sweep` — index.css 원본과 충돌 회피, 구 규칙은 dead rule 로 잔존/미삭제) · `--askewly-*` 브랜드 변수 → 컴포넌트 로컬 콘텐츠 팔레트(`--pc-*`/`--it-*`, hex 자급 — 소비 프로젝트 무의존) · 사진은 `photos` prop(기본값 사이트 에셋).
- lint ALLOWLIST +2 (product-coverflow·image-treatment — 고정 라이트 목업 팔레트가 콘텐츠, term-visual 선례). hero-composition 은 전량 시맨틱이라 예외 불요.
- registry.json +3 (meta.harvest — home-page extraction 출처). 재생성 48건(45+3 순수 추가 — 기존 per-item diff 0, index만 M).
- 검증: tsc 무오류 + oxlint·lint:colors PASS + build 759 routes + 시각 회귀: 로컬 빌드 vs 라이브 프로드(추출 전 코드) 풀페이지 스크린샷 대조 — Coverflow 배치·Warm Film·Proof surface 프레임까지 동일.
- finding: hex probe 의 `git checkout` 이 소스 파일을 CRLF 로 되살려 임베드 content 오염 — LF 재정규화로 해소. 교훈: probe 원복은 checkout 대신 역편집 또는 즉시 EOL 검사.
