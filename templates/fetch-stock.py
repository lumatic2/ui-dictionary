#!/usr/bin/env python3
"""Pexels 스톡 후보 fetch — Brief Studio 이미지 축 연동 (표준 라이브러리만).

사용: python fetch-stock.py "<한국어/영어 쿼리>" [count=6] [outdir=stock]
필요: 환경변수 PEXELS_API_KEY (User 전역 등록 2026-07-19 — 키 값 출력·커밋·로그 금지)

동작: /v1/search?locale=ko-KR → 후보 메타 candidates.json 저장 + medium 썸네일 다운로드.
라이선스: Pexels 무료(상업 포함, 저작자 표기 불요·권장) — candidates.json에 photographer·url 보존.
"""
import json
import os
import sys
import urllib.parse
import urllib.request

API = "https://api.pexels.com/v1/search"


def die(msg: str, code: int = 1):
    print(f"ERROR: {msg}", file=sys.stderr)  # 조용한 실패 금지
    sys.exit(code)


def main():
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        die("PEXELS_API_KEY 환경변수가 없다 — User 전역 등록 여부 확인 (새 셸에서 재시도)")
    if len(sys.argv) < 2:
        die("사용법: fetch-stock.py \"쿼리\" [count] [outdir]", 2)
    query = sys.argv[1]
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    outdir = sys.argv[3] if len(sys.argv) > 3 else "stock"
    os.makedirs(outdir, exist_ok=True)

    url = f"{API}?{urllib.parse.urlencode({'query': query, 'per_page': count, 'locale': 'ko-KR'})}"
    req = urllib.request.Request(url, headers={
        "Authorization": key,
        "User-Agent": "askewly-brief-studio/1.0",  # urllib 기본 UA는 Pexels CDN이 403으로 차단
    })
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        die(f"Pexels API {e.code} — {'키 무효' if e.code == 401 else '율리밋 초과(200/h)' if e.code == 429 else e.reason}")
    except urllib.error.URLError as e:
        die(f"네트워크 실패 — {e.reason} (오프라인이면 스튜디오는 톤 카드로 degrade)")

    photos = data.get("photos", [])
    if not photos:
        die(f"'{query}' 결과 0건 — 쿼리를 바꿔 재시도", 3)

    cands = []
    for i, p in enumerate(photos, 1):
        fn = f"{outdir}/cand-{i}.jpg"
        tr = urllib.request.Request(p["src"]["medium"], headers={"User-Agent": "askewly-brief-studio/1.0"})
        with urllib.request.urlopen(tr, timeout=30) as img, open(fn, "wb") as out:
            out.write(img.read())
        cands.append({
            "file": fn, "id": p["id"], "alt": p.get("alt", ""),
            "photographer": p["photographer"], "pexels_url": p["url"],
            "avg_color": p.get("avg_color"),
        })
        print(f"[{i}/{len(photos)}] {fn}  ({p['photographer']}, avg {p.get('avg_color')})")
    with open(f"{outdir}/candidates.json", "w", encoding="utf-8") as f:
        json.dump({"query": query, "locale": "ko-KR", "candidates": cands}, f, ensure_ascii=False, indent=2)
    print(f"OK: {len(cands)}건 → {outdir}/candidates.json")


if __name__ == "__main__":
    main()
