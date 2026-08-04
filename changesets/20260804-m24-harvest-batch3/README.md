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
