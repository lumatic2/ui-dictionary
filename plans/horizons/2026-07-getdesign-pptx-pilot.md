# HORIZON — getdesign 기반 편집 가능한 PPTX 파일럿

> 생성: 2026-07-21 · ROADMAP marker: `harness:goal id="getdesign-pptx-pilot"` · 상태: active
> 위계: Objective(`OBJECTIVE.md`) → **Horizon**(이 문서) → Milestone(`plans/2026-07-21-gp1-linear-pptx-pilot.md`) → Step.

## 목표

Codex/Claude CLI가 `getdesign` 레퍼런스를 프로젝트 고유의 `DESIGN.md`로 조정하고, 같은 디자인 언어의 웹 미니 페이지와 **편집 가능한 네이티브 `.pptx`**를 로컬에 생성할 수 있음을 한 번 증명한다.

- 무감독 분량: 승인 후 최소 2 세션.
- 확정 입력: `linear.app` (`getdesign` CLI), Askewly Design 소개, 16:9 6장.

## 범위 밖

- 전역 슬라이드 CLI·Askewly Design 배포 스킬·다른 레퍼런스 카탈로그.
- HTML 스크린샷을 슬라이드 배경으로 넣는 방식.
- PowerPoint 외부 앱 자동 조작·배포.

## 담을 milestone — 설계 번들 인덱스

| milestone | 제목 | plan doc | 승인 | 리서치 입력 |
|---|---|---|---|---|
| GP1 | Linear intake → 웹 → 편집 가능한 PPTX를 한 프로젝트에서 검증 | `plans/2026-07-21-gp1-linear-pptx-pilot.md` | 사용자 승인 2026-07-21 | `getdesign` CLI catalog, `docs/design-system/entry-protocol.md`, `PptxGenJS` package metadata |

## 닫는 기준

1. `getdesign add linear.app` 결과를 출처·제외 항목과 함께 프로젝트 `DESIGN.md`로 조정한다.
2. 같은 `DESIGN.md`에서 파생된 웹 미니 페이지와 16:9 6장 PPTX가 생성된다.
3. PPTX 안에 텍스트·도형이 네이티브 객체로 존재하고, PPTX를 여는 데 오류가 없다.
4. 스크린샷과 렌더 검수에서 두 산출물의 색·타이포·밀도 원칙이 일치한다.

## 미리 쓰는 실패 회고

1. **Linear 브랜드를 베낀다.** → 로고·고유 카피·상표 서체를 제외하고, 프로젝트 목적에 맞춘 토큰만 남긴다.
2. **PPTX가 한 장짜리 이미지가 된다.** → PptxGenJS `addText`/`addShape`만 사용하고, OOXML 내부 객체 존재를 검사한다.
3. **웹과 슬라이드가 서로 다른 룩이 된다.** → 둘 다 동일 `DESIGN.md`의 semantic token map만 소비하고, 비교 스크린샷을 남긴다.

## Objective 임팩트 (close 시 기록)

- (close 시 작성)
