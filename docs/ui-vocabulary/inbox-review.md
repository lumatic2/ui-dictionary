# UI Vocabulary Inbox Review

Generated: 2026-07-09

Source inbox: `docs/ui-vocabulary/inbox.yml`

Use this file to review whether each candidate should become a public
dictionary term. Update decisions in your batch note or directly in the inbox
comments before promotion.

Decision options:

- `promote`: add as a new `terms.yml` entry.
- `alias`: add only as an alias to an existing term.
- `related`: add a comparison note to an existing term.
- `reject`: keep out of the dataset.

## Batch Summary

- Candidates: 9
- Candidates with duplicate-risk: 7

## Review Table

| # | Candidate | What It Is | What It Looks Like | Duplicate Risk | Decision |
|---:|---|---|---|---|---|
| 1 | `blog-post-card`<br>블로그 포스트 카드 / Blog post card | 블로그 글 하나를 썸네일과 요약으로 미리 보여주는 카드.<br><br>Use: 블로그 목록에서 여러 글을 미리보기로 나열할 때, 관련 글 추천 영역을 만들 때<br>Avoid: 본문 전체를 카드에 담지 않는다, 단일 공지나 안내는 banner나 alert가 더 적합하다 | cover image, category tag, title, excerpt, author avatar, date<br><br>Asset: `blog-post-card` | `help-center-card` (name/id substring "article card" ~= "help article card") | TBD |
| 2 | `blog-grid-section`<br>블로그 그리드 섹션 / Blog grid section | 여러 블로그 포스트 카드를 그리드로 모아 보여주는 섹션.<br><br>Use: 최신 글이나 인기 글을 한 화면에서 훑게 할 때<br>Avoid: 글이 하나뿐이면 featured-post-card 하나로 충분하다 | section heading, blog post card grid, optional category filter, view all link<br><br>Asset: `blog-grid-section` | `section` (name/id substring "blog-grid-section" ~= "section") | TBD |
| 3 | `featured-post-card`<br>대표 포스트 카드 / Featured post card | 블로그 글 중 하나를 크게 강조해서 보여주는 대표 카드.<br><br>Use: 블로그 홈 최상단에서 신작이나 대표 글을 강조할 때<br>Avoid: 일반 글 목록에는 blog-post-card 그리드가 더 적합하다 | large cover image, title, longer excerpt, author, date, prominent placement<br><br>Asset: `featured-post-card` | No obvious duplicate risk | TBD |
| 4 | `contact-form-section`<br>문의 폼 섹션 / Contact form section | 이름, 이메일, 메시지를 입력해 문의를 보내는 폼 중심의 랜딩 섹션.<br><br>Use: 방문자가 폼을 채워 문의나 상담을 요청해야 할 때<br>Avoid: 단순 이메일 주소 안내만 필요하면 contact-info-panel 하나로 충분하다 | section heading, name field, email field, message field, submit button, optional side info panel<br><br>Asset: `contact-form-section` | `section` (name/id substring "contact-form-section" ~= "section") | TBD |
| 5 | `contact-info-panel`<br>연락처 정보 패널 / Contact info panel | 이메일, 전화번호, 주소 같은 연락 채널을 보여주는 정보 패널.<br><br>Use: 문의 폼과 함께 다른 연락 채널을 안내할 때, 오피스 위치나 소셜 링크를 보여줄 때<br>Avoid: 사용자 입력을 받아야 하면 contact-form-section이 필요하다 | icon, label, contact value, optional map or social links<br><br>Asset: `contact-info-panel` | `contact-picker` (token similarity 1.00 via "연락처 정보 패널" ~= "연락처 선택") | TBD |
| 6 | `office-location-card`<br>오피스 위치 카드 / Office location card | 회사의 특정 오피스나 지점 하나의 주소와 정보를 보여주는 카드.<br><br>Use: 회사가 여러 지점을 갖고 있어 각각 소개해야 할 때<br>Avoid: 지점이 하나뿐이면 contact-info-panel 하나로 충분하다 | office photo, city or branch name, address, contact info, map link<br><br>Asset: `office-location-card` | No obvious duplicate risk | TBD |
| 7 | `content-section`<br>콘텐츠 섹션 / Content section | 제목, 본문 텍스트, 이미지를 묶어 하나의 주제를 설명하는 랜딩 섹션.<br><br>Use: 제품 스토리나 기능 하나를 자세한 글과 이미지로 설명할 때<br>Avoid: 사용자가 직접 글을 입력하고 편집해야 하면 rich-text-editor가 필요하다, 단순히 화면을 나누기만 하면 범용 section으로 충분하다 | section heading, body copy, supporting image, optional link or button<br><br>Asset: `content-section` | `content-tabs` (token similarity 1.00 via "콘텐츠 섹션" ~= "콘텐츠 탭")<br>`media-card` (token similarity 1.00 via "콘텐츠 섹션" ~= "콘텐츠 카드")<br>`section` (name/id substring "content-section" ~= "section") | TBD |
| 8 | `split-content-section`<br>분할 콘텐츠 섹션 / Split content section | 화면을 좌우로 나눠 한쪽엔 이미지, 다른 한쪽엔 텍스트를 배치하는 콘텐츠 섹션.<br><br>Use: 이미지와 설명을 나란히 대비시켜 보여줄 때, 여러 content-section을 좌우 교차로 배치할 때<br>Avoid: 이미지 없이 글만 있으면 일반 content-section이 더 단순하다 | two-column grid, image half, text half, alternating alignment<br><br>Asset: `split-content-section` | `content-tabs` (token similarity 1.00 via "분할 콘텐츠 섹션" ~= "콘텐츠 탭")<br>`media-card` (token similarity 1.00 via "분할 콘텐츠 섹션" ~= "콘텐츠 카드")<br>`section` (name/id substring "split-content-section" ~= "section")<br>`split-pane` (name/id substring "image-text split layout" ~= "split layout") | TBD |
| 9 | `logo-cloud-section`<br>로고 클라우드 섹션 / Logo cloud section | 고객사나 파트너 로고 여러 개를 한 화면에 모아 신뢰를 보여주는 섹션.<br><br>Use: 제품을 사용하는 유명 고객사나 파트너를 신뢰 요소로 보여줄 때<br>Avoid: 로고 하나만 필요하면 logo를 그대로 쓴다, 연동 상태나 설치 행동이 필요하면 integration-grid-section이 더 적합하다 | optional section heading, logo grid, consistent logo sizing, muted or grayscale treatment<br><br>Asset: `logo-cloud-section` | `bento-grid` (token similarity 1.00 via "로고 그리드 섹션" ~= "벤토 그리드")<br>`dashboard-grid` (token similarity 1.00 via "로고 그리드 섹션" ~= "위젯 그리드")<br>`feature-grid-section` (token similarity 1.00 via "로고 그리드 섹션" ~= "기능 그리드 섹션")<br>`grid` (token similarity 1.00 via "로고 그리드 섹션" ~= "그리드") | TBD |
