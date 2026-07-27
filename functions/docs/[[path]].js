// SPA fallback — /docs/* 는 앱 라우트라 index.html 을 그대로 서빙한다 (정적 문서는 /llms/docs/* 별도).
export async function onRequestGet(context) {
  return context.env.ASSETS.fetch(new URL("/", context.request.url))
}
