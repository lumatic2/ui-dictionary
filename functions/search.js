// SPA fallback + prerender-first (SQ4) — /search 는 앱 라우트다.
// 프리렌더된 정적 HTML(dist/<route>/index.html)이 있으면 그것을, 없으면 SPA 셸(index.html)을 서빙한다.
// Pages 는 함수가 정적 자산보다 우선이라 이 asset-first 분기가 없으면 프리렌더가 서빙되지 않는다.
// ASSETS 바인딩의 경로 해석이 환경에 따라 갈린다(실측 2026-07-28: bare 경로가 308·404·셸 폴백 셋 다 관측)
// — 그래서 트레일링 슬래시(=디렉터리 index) 변형을 먼저 명시 시도하고, 이어 원 경로, 마지막에 셸이다.
export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const assets = context.env.ASSETS

  const indexVariant = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
  const prerendered = await assets.fetch(new URL(indexVariant, url))
  if (prerendered.status < 300) {
    return prerendered
  }

  const asset = await assets.fetch(context.request)
  if (asset.status < 300) {
    return asset
  }
  if (asset.status < 400) {
    const location = asset.headers.get("Location")
    if (location) {
      const followed = await assets.fetch(new URL(location, url))
      if (followed.status < 300) {
        return followed
      }
    }
  }

  return assets.fetch(new URL("/", url))
}
