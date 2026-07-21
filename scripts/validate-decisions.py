#!/usr/bin/env python3
"""판별 데이터(docs/design-system/decisions/*.md) 검증기.

계약: docs/design-system/decision-format.md

검사:
  1. frontmatter 필수 필드
  2. candidates 의 모든 id 가 terms.yml 에 실존
  3. 모든 축에 source + confidence
  4. rules[].pick 이 candidates 안, when 의 축·값이 axes 정의 안
  5. default 가 candidates 안
  6. (전 군집) 같은 용어가 두 군집에서 모순되는 규칙을 갖지 않음

위반은 파일·필드를 짚어 보고하고 exit 1. 조용히 넘어가지 않는다.
"""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DECISIONS_DIR = ROOT / "docs" / "design-system" / "decisions"
TERMS_PATH = ROOT / "docs" / "ui-vocabulary" / "terms.yml"

REQUIRED = ["id", "name", "question", "candidates", "axes", "rules", "default", "last_verified"]
AXIS_REQUIRED = ["id", "question", "values", "source", "confidence"]
CONFIDENCE = {"high", "medium", "low"}


def split_frontmatter(text: str) -> dict | None:
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    return yaml.safe_load(text[3:end])


def main() -> int:
    errors: list[str] = []

    if not TERMS_PATH.exists():
        print(f"FAIL: 용어 원본이 없다 — {TERMS_PATH}", file=sys.stderr)
        return 1
    terms = yaml.safe_load(TERMS_PATH.read_text(encoding="utf-8"))
    term_ids = {t["id"] for t in terms}

    if not DECISIONS_DIR.exists():
        print("0 clusters — decisions/ 가 아직 없다")
        return 0

    files = sorted(p for p in DECISIONS_DIR.glob("*.md") if p.name != "README.md")
    clusters: list[dict] = []

    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        fm = split_frontmatter(path.read_text(encoding="utf-8"))
        if fm is None:
            errors.append(f"{rel}: frontmatter 가 없다")
            continue

        for field in REQUIRED:
            if field not in fm or fm[field] in (None, "", [], {}):
                errors.append(f"{rel}: 필수 필드 누락 — {field}")
        if errors and fm.get("id") is None:
            continue

        if fm.get("id") != path.stem:
            errors.append(f"{rel}: 파일명과 id 가 다르다 — id={fm.get('id')}")

        candidates = fm.get("candidates") or []
        for cid in candidates:
            if cid not in term_ids:
                errors.append(f"{rel}: candidates 에 terms.yml 에 없는 id — {cid}")

        axis_values: dict[str, set] = {}
        for axis in fm.get("axes") or []:
            aid = axis.get("id", "<id 없음>")
            for field in AXIS_REQUIRED:
                if field not in axis or axis[field] in (None, "", []):
                    errors.append(f"{rel}: 축 {aid} 에 {field} 가 없다")
            if axis.get("confidence") not in CONFIDENCE:
                errors.append(f"{rel}: 축 {aid} 의 confidence 가 high|medium|low 가 아니다 — {axis.get('confidence')}")
            src = str(axis.get("source", ""))
            if src and not src.startswith("http"):
                errors.append(f"{rel}: 축 {aid} 의 source 가 URL 이 아니다 — {src}")
            axis_values[aid] = {str(v) for v in (axis.get("values") or [])}

        for i, rule in enumerate(fm.get("rules") or []):
            tag = f"{rel}: rules[{i}]"
            when = rule.get("when") or {}
            if not when:
                errors.append(f"{tag} 에 when 이 없다")
            for aid, val in when.items():
                if aid not in axis_values:
                    errors.append(f"{tag} 가 정의되지 않은 축을 쓴다 — {aid}")
                elif str(val) not in axis_values[aid]:
                    errors.append(f"{tag} 의 {aid} 값이 축 values 밖이다 — {val}")
            pick = rule.get("pick")
            if pick not in candidates:
                errors.append(f"{tag} 의 pick 이 candidates 밖이다 — {pick}")
            if not str(rule.get("because", "")).strip():
                errors.append(f"{tag} 에 because 가 없다")

        if fm.get("default") not in candidates:
            errors.append(f"{rel}: default 가 candidates 밖이다 — {fm.get('default')}")

        clusters.append(fm)

    # 6. 교차 군집 모순: 같은 용어가 서로 다른 군집에서 상반된 조건으로 뽑히는가.
    # 같은 축 id + 같은 값인데 pick 이 다르면 두 군집이 서로를 부정한다.
    seen: dict[tuple[str, str], tuple[str, str]] = {}
    for fm in clusters:
        cid = fm.get("id")
        for rule in fm.get("rules") or []:
            for aid, val in (rule.get("when") or {}).items():
                key = (str(aid), str(val))
                pick = rule.get("pick")
                if key in seen:
                    prev_cluster, prev_pick = seen[key]
                    if prev_pick != pick and prev_cluster != cid:
                        errors.append(
                            f"교차 모순: 축 {aid}={val} 에서 {prev_cluster} 는 {prev_pick} 을, {cid} 는 {pick} 을 고른다"
                        )
                else:
                    seen[key] = (cid, pick)

    if errors:
        print(f"판별 데이터 FAIL — {len(errors)}건", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    total_axes = sum(len(c.get("axes") or []) for c in clusters)
    total_rules = sum(len(c.get("rules") or []) for c in clusters)
    low = sum(1 for c in clusters for a in (c.get("axes") or []) if a.get("confidence") == "low")
    print(f"판별 데이터 PASS — {len(clusters)} clusters / 축 {total_axes} / 규칙 {total_rules}")
    if low:
        print(f"  근거 약한 축(confidence: low) {low}건 — 원문 재확인 대상")
    return 0


if __name__ == "__main__":
    sys.exit(main())
