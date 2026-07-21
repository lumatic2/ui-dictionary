# HORIZON — 편집 가능한 템플릿 제작 시스템

> 생성: 2026-07-19 · marker: `harness:goal id="template-production-system"` · 상태: closed (2026-07-19)
> 위계: Objective(`OBJECTIVE.md`) → **Horizon**(이 문서) → Milestone(`plans/2026-07-19-tps*.md`) → Step.
> 진행 상태의 정본은 `ROADMAP.md` marker다. `recipe-code-reuse` close 후 2026-07-19 승인·승격됐다.

## 목표
- Askewly Design의 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 **편집 가능한 장면**으로 바꾸는 결정론적 제작 파이프라인을 만든다.
- GPT Image 2는 소재 생성과 평면 시안 참고에만 쓰고, 텍스트·이미지·도형·그룹·토큰 결합을 보존하는 `CanvasDocument`를 템플릿 정본으로 삼는다.
- **무감독 분량: 승인 후 최소 3 무감독 세션**. 5개 milestone, 11개 독립 leaf와 horizon 통합검증으로 구성한다.

## 왜 지금 (이전 horizon 이 드러낸 갭)
- 브리프 스튜디오는 디자인 결정을 `DESIGN.md`로 만드는 데까지 왔지만, 그 결정을 실제 편집 가능한 산출물로 조립하는 계층은 없다.
- 경쟁 제품 조사 결과, 핵심은 단일 이미지 프롬프트보다 형식 선택·콘텐츠 구조·구성 청사진·브랜드 토큰·편집 장면·검증의 결합이다.
- 사용자 확정(2026-07-19): 명함+제품 포스터+인포그래픽, JSON 장면+브라우저 HTML/CSS/SVG, 고정 fixture 우선, 라이브 GPT 호출과 범용 캔버스 직접 연결은 후속 승인 경계로 둔다.

## 담을 milestone — 설계 번들 인덱스

| milestone | 제목 (왜 milestone 규모인가) | plan doc | 승인 | 리서치 입력 |
|---|---|---|---|---|
| **TPS1** | 템플릿 계약·장면 기반 — 계약 결정과 최소 노드/검증 기반을 독립 구축 | `plans/2026-07-19-tps1-template-contract.md` | 승인 | `research/2026-07-19-template-production-system-generative-template-reverse-engineering.md` |
| **TPS2** | 구성 청사진·결정론적 조립기 — 선택기와 컴파일러 분리·통합 재현성 검증 | `plans/2026-07-19-tps2-blueprint-compiler.md` | 승인 | 위와 같음 |
| **TPS3** | 브라우저 템플릿 스튜디오 — 렌더와 편집·내보내기 분리·브라우저 검증 | `plans/2026-07-19-tps3-browser-template-studio.md` | 승인 | 위와 같음 |
| **TPS4** | 명함·제품 포스터·인포그래픽 팩 — 형식별 제약 3종·교차 카탈로그 검증 | `plans/2026-07-19-tps4-three-format-packs.md` | 승인 | 위와 같음 |
| **TPS5** | 생성 소재 경계·통합 실연 — 오프라인 공급자 계약·세 형식 E2E | `plans/2026-07-19-tps5-asset-provider-integration.md` | 승인 | OpenAI 공식 이미지 생성 문서(리서치에 기록) |

## 닫는 기준
- 세 형식 고정 입력이 동일 실행마다 같은 장면 서명을 만든다 — 관측: `npm --prefix packages/template-core test` 결정성 fixture 3종.
- 각 결과가 편집 가능한 텍스트·이미지·도형·그룹·토큰 결합을 보존한다 — 관측: 장면 JSON 검사와 `CanvasDocument` 검증 PASS.
- 브라우저에서 세 형식을 열고 텍스트/이미지 교체·토큰 변경·HTML/SVG/JSON 내보내기를 수행한다 — 관측: Playwright E2E와 `evidence/template-production-system/`.
- 잘못된 비율, 필수 콘텐츠 누락, 수치 출처 누락, 공급자 실패를 명시적으로 거부한다 — 관측: 형식별 negative-path tests.
- TPS1~TPS5 DoD와 `브리프 → 청사진 → 장면 → 편집 → 내보내기` 통합 실연 1회를 모두 증거로 남긴다.

## 미리 쓰는 실패 회고
- 평면 이미지 생성기를 템플릿 시스템으로 오인해 편집성이 사라짐 → 예방: TPS1에서 평면 시안과 템플릿을 구분하고 TPS5 live 호출을 제외한다.
- 세 형식을 한 범용 레이아웃으로 억지 통합해 품질이 평균화됨 → 예방: TPS2는 공통 컴파일 계약만, TPS4는 형식별 제약·검증을 독립 구현한다.
- 브라우저 데모는 예쁘지만 장면 정본과 drift함 → 예방: TPS3 렌더러는 `CanvasDocument`만 소비하고 JSON 왕복·결정성 검사를 DoD에 둔다.
- 라이브 API 비용·키가 구현을 막음 → 예방: TPS5는 고정 공급자 응답으로 닫고 실제 GPT Image 2 호출은 별도 승인 후보로 남긴다.

## Objective 임팩트 (close 시 기록)
- close 시 공개 참고 시스템, 에이전트 소비 계약, 미래 코드 네이티브 캔버스 연결 중 실제로 움직인 축과 실측을 기록한다.

## 링크
- 위(Objective): `OBJECTIVE.md`
- 설계 결정 예정: `docs/adr/0009-structured-template-production-boundary.md`
- 아래: `plans/2026-07-19-tps1-template-contract.md` ~ `plans/2026-07-19-tps5-asset-provider-integration.md`

## Close (2026-07-19)

- 결정성: 세 기준 fixture 동일 signature 재현 및 6개 catalog compile matrix PASS.
- 편집성: text/image/shape/frame/token binding 보존, 평면 artwork 거부.
- 브라우저: 세 형식 렌더·텍스트 편집·JSON/HTML/SVG export/import, desktop/mobile PASS.
- 실패경로: 비율·필수 콘텐츠·overflow·asset·token·출처/단위·provider 응답 명시 거부.
- 외부 호출: 0. GPT Image 2는 구조 정본이 아닌 provenance 소재 경계로만 편입.
- Objective 임팩트: 브리프·토큰·레시피가 실제 편집 가능한 제작 장면과 에이전트 검증 명령까지 이어졌다.
