# 20260804-m24-harvest-batch3 — M24 harvest 배치 3

> plan: `plans/2026-08-04-m24-harvest-batch3.md` · milestone: M24

## step-1 — plain-asset 게이트 확장 (선언 의존성 + 등재 자산 참조)

- `scripts/generate-registry.mjs` plain-asset 경로에 블록 계약 §2 준용 2경로 추가:
  ① `item.dependencies` 선언 npm allowlist(선언+실사용 대조 — 선언·미사용도 FAIL, 패키지 루트 기준 매칭 `motion/react`→`motion`)
  ② `@/components/<등재자산>` 참조 허용 → registryDependencies URL 파생(미등재 참조는 FAIL).
- `dependencies` 산출을 패키지 루트로 정규화(기존 항목은 lucide-react 뿐이라 출력 불변).
- 검증: 재생성 기존 38건 diff 0(porcelain 무출력) + 자기시험 3건 전부 FAIL 적발(미선언 motion / 선언·미사용 / 미등재 device-frame 참조) + 원복 재생성 OK.
