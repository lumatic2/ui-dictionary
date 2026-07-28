// SPA fallback — /recipes/* 는 앱 라우트라 index.html 을 그대로 서빙한다 (정적 recipe 원문은 /llms/recipes/* 별도).
export async function onRequestGet(context) {
  return context.env.ASSETS.fetch(new URL("/", context.request.url))
}
