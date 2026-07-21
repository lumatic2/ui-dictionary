# TPS2 청사진·결정론적 조립기

- 청사진: 명함 1050×600, 제품 포스터 1080×1350, 인포그래픽 1200×1600 기준 3종.
- 선택: format·정확 크기·필수 콘텐츠를 검사하고 priority/id 안정 정렬.
- 컴파일: 청사진/slot 기반 안정 node id, 고정 metadata timestamp, semantic token binding.
- 결정성: 세 형식 각각 동일 입력 2회 signature 일치.
- 실패경로: 미지원 크기, 텍스트 overflow, 필수 image role 누락, 잘못된 token binding을 명시 거부.
- 검증: template-core 8 tests PASS + TypeScript build PASS.
