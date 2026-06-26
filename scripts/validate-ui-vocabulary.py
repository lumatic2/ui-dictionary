from __future__ import annotations

from collections import Counter
from pathlib import Path
import re
import sys

import yaml


ROOT = Path(__file__).resolve().parents[1]
TERMS_PATH = ROOT / "docs" / "ui-vocabulary" / "terms.yml"
SOURCES_PATH = ROOT / "docs" / "ui-vocabulary" / "sources.md"

REQUIRED_FIELDS = {
    "id",
    "status",
    "category",
    "ko",
    "en",
    "one_liner",
    "description",
    "visual_anatomy",
    "when_to_use",
    "anti_use",
    "prompt_phrases",
    "asset",
    "sources",
    "confidence",
}

VALID_CATEGORIES = {
    "input",
    "selection",
    "action",
    "structure",
    "feedback",
    "data-display",
}

VALID_STATUS = {"draft", "reviewed", "published"}
VALID_CONFIDENCE = {"low", "medium", "high"}
SOURCE_ID_PATTERN = re.compile(r"^- `([^`]+)`:", re.MULTILINE)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if not TERMS_PATH.exists():
        fail(f"missing {TERMS_PATH.relative_to(ROOT)}")
    if not SOURCES_PATH.exists():
        fail(f"missing {SOURCES_PATH.relative_to(ROOT)}")

    terms = yaml.safe_load(TERMS_PATH.read_text(encoding="utf-8"))
    source_ids = set(SOURCE_ID_PATTERN.findall(SOURCES_PATH.read_text(encoding="utf-8")))
    if not source_ids:
        fail("sources.md must register at least one `source_id`")
    if not isinstance(terms, list):
        fail("terms.yml must be a list")
    if len(terms) < 60:
        fail(f"expected at least 60 terms, got {len(terms)}")

    seen_ids: set[str] = set()
    counts: Counter[str] = Counter()
    for index, term in enumerate(terms):
        if not isinstance(term, dict):
            fail(f"term #{index} must be a mapping")
        term_id = term.get("id", f"#{index}")
        missing = REQUIRED_FIELDS - set(term)
        if missing:
            fail(f"{term_id}: missing fields {sorted(missing)}")
        if term_id in seen_ids:
            fail(f"{term_id}: duplicate id")
        seen_ids.add(term_id)

        category = term["category"]
        if category not in VALID_CATEGORIES:
            fail(f"{term_id}: invalid category {category}")
        counts[category] += 1

        if term["status"] not in VALID_STATUS:
            fail(f"{term_id}: invalid status {term['status']}")
        if term["confidence"] not in VALID_CONFIDENCE:
            fail(f"{term_id}: invalid confidence {term['confidence']}")
        if not term["ko"].get("name") or not term["en"].get("name"):
            fail(f"{term_id}: missing ko/en name")
        if not term["prompt_phrases"]:
            fail(f"{term_id}: prompt_phrases must not be empty")
        if not term["visual_anatomy"]:
            fail(f"{term_id}: visual_anatomy must not be empty")
        if not term["asset"].get("kind") or not term["asset"].get("variant"):
            fail(f"{term_id}: asset.kind and asset.variant are required")
        if not term["sources"]:
            fail(f"{term_id}: sources must not be empty")
        for source in term["sources"]:
            source_id = source.get("source_id")
            if not source_id:
                fail(f"{term_id}: source_id is required")
            if source_id not in source_ids:
                fail(f"{term_id}: unknown source_id {source_id}")

    sparse = {category: count for category, count in counts.items() if count < 8}
    if sparse:
        fail(f"categories need at least 8 terms each: {sparse}")

    print(f"terms ok: {len(terms)}")
    print("categories:", dict(sorted(counts.items())))


if __name__ == "__main__":
    main()
