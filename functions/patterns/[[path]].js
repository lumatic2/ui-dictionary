// SPA fallback — /patterns/* 는 앱 라우트라 index.html 을 그대로 서빙한다.
// (public/_redirects 의 200 rewrite 가 이 Pages 프로젝트에서 적용되지 않아 Functions 로 처리 — 2026-07-28)
export async function onRequestGet(context) {
  return context.env.ASSETS.fetch(new URL("/", context.request.url))
}
