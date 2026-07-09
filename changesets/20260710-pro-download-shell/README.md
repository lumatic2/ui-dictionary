# 20260710 Pro + Download Shell

## Target

- ROADMAP milestone: SFB2 - Shell Buildout (Step 3)
- Plan: `docs/plans/2026-07-10-sfb2-shell-buildout.md`

## Scope

- `src/App.tsx` (단일 파일): `ProPlanPage`에 dev-only 하위 탭 3종 skeleton — Asset Packs(팩 카드 슬롯 3), Templates(기존 `templateSections` 실데이터 29 leaf를 skeleton 카드로 재사용), License/Provenance(문서 슬롯 3). 프로덕션은 탭 1개(Overview)면 탭바 마크업 없이 early return — 기존과 동일 렌더.
- `DownloadPage`를 blueprint 재정의대로 앱 배포 skeleton으로 재구성 — "Askewly Design App" 헤딩 + 플랫폼 슬롯 3(macOS/Windows/Other, Install pending) + Pro Asset Packs 링크.
- `parsePageParam`의 `download` 직접 진입을 `isShellVisible` 게이트(프로덕션에서 홈 정규화 — colors와 동일 관용구).

## Contract

- 프로덕션 표면 변화 0 (Pro Overview 기존 동일, Download 진입 차단). 실 판매·실 앱 배포는 범위 밖.
- 참고: plan doc의 "Templates 16종"은 섹션 기준 표기였고 flatten leaf 실측은 29 — 실데이터 재사용이 정본.

## Verification

- [x] `npm run lint` PASS (에이전트 + 부모 독립 재실행).
- [x] `npm run build` PASS (독립 재실행).
- [x] dev 스모크: Pro 4탭 렌더(Asset Packs/Templates 29슬롯/License), Download 앱 skeleton 렌더 (구현 에이전트).
- [x] prod 비노출 회귀: Pro Overview만·탭바 없음, `?page=download`→홈 정규화, footer Download 없음 (구현 에이전트).
