#!/usr/bin/env python3
"""브리프 스튜디오 생성기 — 데이터 JSON + 템플릿 → self-contained 스튜디오 HTML.

사용:
    python templates/make-studio.py --data <studio-data.json> --out <studio.html>

데이터 JSON 은 {"tiles": [...], "axes": [...]} 형태이며 기준 예시는
templates/studio-data.default.json 이다. 템플릿의 STUDIO DATA BEGIN/END
마커 사이를 데이터로 치환해 산출한다 — HTML 직접 편집 금지.
"""
import argparse
import json
import re
import sys
from pathlib import Path

TEMPLATE = Path(__file__).parent / "brief-studio.html"
BEGIN = "/* ================= STUDIO DATA BEGIN"
END = "/* ================= STUDIO DATA END ================= */"

# 렌더러(CTX·미리보기)가 참조하는 축 — 빠지면 미리보기가 조용히 깨진다
REQUIRED_AXIS_IDS = {
    "base", "accent", "typo", "composition", "headline", "subcopy",
    "cta", "header", "footer", "card", "density", "radius",
}
TILE_REQUIRED = ["value", "name", "bg", "ink", "accent", "font", "radius", "desc", "rank"]
AXIS_REQUIRED = ["id", "title", "type", "cands"]


def fail(msg: str) -> None:
    print(f"make-studio: FAIL — {msg}", file=sys.stderr)
    sys.exit(1)


def validate(data: dict) -> None:
    for key in ("tiles", "axes"):
        if not isinstance(data.get(key), list) or not data[key]:
            fail(f"'{key}' 가 비어 있거나 배열이 아님")
    for i, t in enumerate(data["tiles"]):
        missing = [f for f in TILE_REQUIRED if f not in t]
        if missing:
            fail(f"tiles[{i}] ({t.get('value', '?')}) 필수 필드 누락: {', '.join(missing)}")
    axis_ids = set()
    for i, a in enumerate(data["axes"]):
        missing = [f for f in AXIS_REQUIRED if f not in a]
        if missing:
            fail(f"axes[{i}] ({a.get('id', '?')}) 필수 필드 누락: {', '.join(missing)}")
        axis_ids.add(a["id"])
        if not isinstance(a["cands"], list) or not a["cands"]:
            fail(f"axes[{i}] ({a['id']}) cands 가 비어 있음")
        for j, c in enumerate(a["cands"]):
            for f in ("value", "rank"):
                if f not in c:
                    fail(f"axes[{i}].cands[{j}] ({a['id']}) 필수 필드 누락: {f}")
    absent = REQUIRED_AXIS_IDS - axis_ids
    if absent:
        fail(f"렌더러 필수 축 누락: {', '.join(sorted(absent))}")
    for i, t in enumerate(data["tiles"]):
        for axis_id in (t.get("boost") or {}):
            if axis_id not in axis_ids:
                fail(f"tiles[{i}] ({t['value']}) boost 가 없는 축을 가리킴: {axis_id}")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--data", required=True, help="studio-data JSON 경로")
    p.add_argument("--out", required=True, help="산출 HTML 경로")
    p.add_argument("--template", default=str(TEMPLATE), help="템플릿 HTML (기본: brief-studio.html)")
    args = p.parse_args()

    data_path = Path(args.data)
    if not data_path.exists():
        fail(f"데이터 파일 없음: {data_path}")
    try:
        data = json.loads(data_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        fail(f"JSON 파싱 실패 ({data_path}): {e}")
    validate(data)

    template = Path(args.template).read_text(encoding="utf-8")
    fonts = data.get("fonts")
    if fonts:
        if not fonts.startswith("https://fonts.googleapis.com/"):
            fail(f"'fonts' 는 fonts.googleapis.com CSS URL 이어야 함: {fonts[:60]}")
        template, n = re.subn(
            r'href="https://fonts\.googleapis\.com/css2[^"]+"',
            f'href="{fonts}"', template, count=1)
        if n == 0:
            fail("템플릿에서 폰트 <link> 를 찾지 못함")
    begin = template.find(BEGIN)
    end = template.find(END)
    if begin == -1 or end == -1 or end < begin:
        fail(f"템플릿에 STUDIO DATA 마커가 없음: {args.template}")
    tail_from = template.index("\n", end + len(END) - 1)
    # 마커 첫 줄(주석 헤더)은 보존하고 데이터만 교체
    header = template[begin:template.index("*/", begin) + 2]
    block = (
        f"{header}\n"
        f"const STUDIO_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
        f"{END}"
    )
    out_html = template[:begin] + block + template[tail_from:]

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(out_html, encoding="utf-8", newline="\n")
    print(f"make-studio: OK — tiles={len(data['tiles'])} axes={len(data['axes'])} -> {out_path}")


if __name__ == "__main__":
    main()
