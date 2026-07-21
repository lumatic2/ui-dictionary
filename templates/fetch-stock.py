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
VIDEO_API = "https://api.pexels.com/videos/search"


def die(msg: str, code: int = 1):
    print(f"ERROR: {msg}", file=sys.stderr)  # 조용한 실패 금지
    sys.exit(code)


def main():
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        die("PEXELS_API_KEY 환경변수가 없다 — User 전역 등록 여부 확인 (새 셸에서 재시도)")
    args = [a for a in sys.argv[1:] if a != "--video"]
    video_mode = "--video" in sys.argv
    if not args:
        die("사용법: fetch-stock.py [--video] \"쿼리\" [count] [outdir]", 2)
    query = args[0]
    count = int(args[1]) if len(args) > 1 else 6
    outdir = args[2] if len(args) > 2 else ("video" if video_mode else "stock")
    os.makedirs(outdir, exist_ok=True)

    if video_mode:
        return fetch_videos(key, query, count, outdir)

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

    def download(url, fn):
        tr = urllib.request.Request(url, headers={"User-Agent": "askewly-brief-studio/1.0"})
        with urllib.request.urlopen(tr, timeout=60) as img, open(fn, "wb") as out:
            out.write(img.read())

    cands = []
    for i, p in enumerate(photos, 1):
        # 해상도 분리 (ST1): 스튜디오 썸네일 = medium / 최종 페이지 = large2x (부재 시 large → original 폴백)
        fn = f"{outdir}/cand-{i}.jpg"
        full = f"{outdir}/cand-{i}-full.jpg"
        src = p["src"]
        download(src["medium"], fn)
        download(src.get("large2x") or src.get("large") or src["original"], full)
        cands.append({
            "file": fn, "file_full": full, "id": p["id"], "alt": p.get("alt", ""),
            "photographer": p["photographer"], "pexels_url": p["url"],
            "avg_color": p.get("avg_color"),
        })
        kb = os.path.getsize(full) // 1024
        print(f"[{i}/{len(photos)}] {fn} + full({kb}KB)  ({p['photographer']}, avg {p.get('avg_color')})")
    with open(f"{outdir}/candidates.json", "w", encoding="utf-8") as f:
        json.dump({"query": query, "locale": "ko-KR", "candidates": cands}, f, ensure_ascii=False, indent=2)
    print(f"OK: {len(cands)}건 → {outdir}/candidates.json")


def fetch_videos(key, query, count, outdir):
    """Pexels Videos (ST3): HD(≤1280) mp4 + 포스터 이미지. 히어로 배경용 — reduced-motion/모바일은 포스터 폴백."""
    url = f"{VIDEO_API}?{urllib.parse.urlencode({'query': query, 'per_page': count, 'locale': 'ko-KR'})}"
    req = urllib.request.Request(url, headers={"Authorization": key, "User-Agent": "askewly-brief-studio/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        die(f"Pexels Videos API {e.code} — {'키 무효' if e.code == 401 else '율리밋 초과(200/h)' if e.code == 429 else e.reason}")
    except urllib.error.URLError as e:
        die(f"네트워크 실패 — {e.reason}")
    videos = data.get("videos", [])
    if not videos:
        die(f"'{query}' 영상 결과 0건 — 쿼리를 바꿔 재시도", 3)

    def download(u, fn):
        tr = urllib.request.Request(u, headers={"User-Agent": "askewly-brief-studio/1.0"})
        with urllib.request.urlopen(tr, timeout=120) as f, open(fn, "wb") as out:
            out.write(f.read())

    cands = []
    for i, v in enumerate(videos, 1):
        files = [f for f in v.get("video_files", []) if f.get("file_type") == "video/mp4" and f.get("width")]
        if not files:
            continue
        # HD 상한: 1280 이하 중 최대 폭 (없으면 최소 폭 — 4K 원본 회피)
        hd = sorted([f for f in files if f["width"] <= 1280], key=lambda f: -f["width"]) or sorted(files, key=lambda f: f["width"])
        mp4 = f"{outdir}/vid-{i}.mp4"
        poster = f"{outdir}/vid-{i}-poster.jpg"
        download(hd[0]["link"], mp4)
        download(v["image"], poster)
        mb = os.path.getsize(mp4) / 1048576
        cands.append({"file": mp4, "poster": poster, "id": v["id"], "duration": v.get("duration"),
                      "width": hd[0]["width"], "user": v.get("user", {}).get("name"), "pexels_url": v.get("url"), "size_mb": round(mb, 1)})
        print(f"[{i}] {mp4} ({hd[0]['width']}px, {mb:.1f}MB, {v.get('duration')}s) + poster  ({v.get('user',{}).get('name')})")
    with open(f"{outdir}/candidates.json", "w", encoding="utf-8") as f:
        json.dump({"query": query, "locale": "ko-KR", "type": "video", "candidates": cands}, f, ensure_ascii=False, indent=2)
    print(f"OK: {len(cands)}건 → {outdir}/candidates.json")


if __name__ == "__main__":
    main()
