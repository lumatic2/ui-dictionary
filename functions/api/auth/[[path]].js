const ASKEWLY_AUTH_ORIGIN = "https://askewly.com"

function buildUpstreamRequest(request) {
  const incomingUrl = new URL(request.url)
  const upstreamUrl = new URL(incomingUrl.pathname + incomingUrl.search, ASKEWLY_AUTH_ORIGIN)
  const headers = new Headers(request.headers)

  headers.set("host", upstreamUrl.host)
  headers.set("x-forwarded-host", incomingUrl.host)
  headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""))

  return new Request(upstreamUrl, {
    body: request.body,
    headers,
    method: request.method,
    redirect: "manual",
  })
}

export async function onRequest(context) {
  return fetch(buildUpstreamRequest(context.request))
}
