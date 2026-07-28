# VI8 — 실증 확장 완료 노트 (2026-07-28)

## 1. 결과

VI7 A 대기 2건이 실동작 recipe 로 착지했다: **`pinned-scroll-sequence`**(② GSAP ScrollTrigger — 핀+스크럽, 스코프드 scroller, reduced-motion 정적 분기, gsap 별도 청크 27.4kB gzip)와 **`shader-gradient-surface`**(④ Paper Shaders — lazy 경계, 로딩/reduced-motion/WebGL 실패가 같은 정적 토큰 폴백으로 수렴, 시맨틱 토큰 판독). 갤러리·catalog(47)·llms(164 assets) 전부 반영. presentation-slides three-scene 계약과 lazy-three-object-scene recipe 가 상호 링크됐다(custom-skills 커밋·배포·push 포함). 이로써 goal `visual-impact-consolidation`(VI6~VI8) 연쇄가 완주됐다.

## 2. 이슈와 해결

- **oklch 토큰 결함 (브라우저 게이트 적발)**: 토큰이 oklch() 저작인데 Paper Shaders 는 hex/rgb 만 파싱 — 콘솔 에러 2건. 1×1 canvas 경유 sRGB hex 정규화로 수리, 재검증 에러 0. build·lint 는 못 잡았다 — 실표면 게이트의 가치 재실증.
- **catalog 추출기 계약**: exported 데모 JSX return 2개 거부 — 단일 return 재구성.
- validate-recipes 적발 5건(필수 섹션 2·프리미티브 토큰 참조 3) 전부 교정.
- finding 이월 2건: 쇼케이스 ShaderGradientDemo 하드코딩 hex 잔존(verify 위반 77건 정리 후보와 함께) · oklch→hex 정규화 재사용 유틸 후보.

## 3. 증거

- evidence: `evidence/visual-impact-consolidation/vi8-recipes.md` · changeset: `changesets/20260728-vi8-expressive-recipes`
- 커밋: cb90808(step-1) · 75def0b(step-2) · 152ec09(step-3) · custom-skills 89752c6
- 검증: Playwright 5/5 PASS·콘솔 0(원문 evidence §2) · validate-recipes 47 ok · build ✓ 981ms · lint exit 0
- 실표면: 로컬 dev 서버 갤러리 라우트(/recipes)에서 headless chromium 으로 두 데모 상세 진입·스크럽 조작(opacity 0→0.25)·canvas 렌더를 실측 — 5항 전부 assertion 평가 성공. 배포 사이트 확인은 push 후 항목.
- 재현: `cd examples/ui-vocabulary-site && npm run dev` + `python <scratchpad>/vi8_verify.py` (또는 with_server.py 래퍼)
- 크기 회고: changeset 1개(step 3절) — 독립 응집 변경 3(GSAP recipe/셰이더 recipe/링크+검증), milestone-grade 유지.
