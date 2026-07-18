# 편집 가능한 템플릿 제작 계약

## 입력과 출력

입력 `TemplateRequest`는 형식, 캔버스 크기, semantic token, 형식별 콘텐츠를 담는다. `AssetManifest`는 로컬·생성·stock 소재의 식별자와 provenance를 보존한다. 출력 `TemplateProject`는 이 입력과 검증된 `CanvasDocument`를 한 단위로 묶는다.

지원 형식은 명함(`business-card`), 제품 포스터(`product-poster`), 인포그래픽(`infographic`)이다. 새 형식은 고유 필수 콘텐츠, 비율, 안전영역, 실패 코드를 함께 등록해야 한다.

## 편집성 판정

템플릿은 다음을 모두 만족한다.

1. 텍스트가 `text` node로 남아 있다.
2. 소재는 `image.assetId`로 manifest를 참조하거나 도형이 `shape` node로 남아 있다.
3. 구조가 frame/group child 관계로 보존된다.
4. 색·서체·간격 중 하나 이상이 `tokenBindings`로 semantic token에 연결된다.
5. `validateDocument()`와 형식별 콘텐츠 검증을 모두 통과한다.

평면 PNG 하나만 배치하고 텍스트·구조·토큰을 잃은 장면은 `FLAT_ARTWORK_NOT_EDITABLE`로 거부한다.

## AI 경계

GPT Image 계열 모델은 이미지 소재와 참고 시안을 제공할 수 있다. 모델 출력은 asset manifest에 provenance와 함께 기록되며, 텍스트·구성·검증·내보내기의 정본이 되지 않는다. 네트워크 호출 실패가 장면 구조를 훼손해서는 안 된다.

## 형식 확장 규칙

형식 pack은 청사진 metadata, 슬롯, 필수 콘텐츠, 허용 비율, 형식 검증기를 함께 제공한다. 공통 compiler는 pack을 소비하지만 형식 고유 규칙을 추측하거나 조용히 fallback하지 않는다.
