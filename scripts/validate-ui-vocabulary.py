from __future__ import annotations

from collections import Counter
from pathlib import Path
import re
import sys

import yaml


ROOT = Path(__file__).resolve().parents[1]
TERMS_PATH = ROOT / "docs" / "ui-vocabulary" / "terms.yml"
SOURCES_PATH = ROOT / "docs" / "ui-vocabulary" / "sources.md"
GROUPS_PATH = ROOT / "docs" / "ui-vocabulary" / "groups.yml"

REQUIRED_FIELDS = {
    "id",
    "status",
    "category",
    "group",
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
    "style",
    "layout-rendering",
    "accessibility",
}

VALID_STATUS = {"draft", "reviewed", "published"}
VALID_CONFIDENCE = {"low", "medium", "high"}
VALID_KINDS = {
    "component",
    "block",
    "form-pattern",
    "visual-effect",
    "motion-pattern",
    "visual-treatment",
}
VALID_RELATED_RELATIONS = {"compare", "alternative", "use-with"}
VALID_NAVIGATION_ROOTS = {"Docs", "Plus", "Index"}
SOURCE_LINE_PATTERN = re.compile(r"^- `([^`]+)`: (.+?)\s*$")
TIER_LINE_PATTERN = re.compile(r"^### Tier ([A-Z])\b")


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def parse_source_ids(sources_text: str) -> set[str]:
    source_ids: set[str] = set()
    current_tier: str | None = None
    lines = sources_text.splitlines()

    for index, line in enumerate(lines):
        tier_match = TIER_LINE_PATTERN.match(line)
        if tier_match:
            current_tier = tier_match.group(1)
            continue

        source_match = SOURCE_LINE_PATTERN.match(line)
        if not source_match:
            continue

        source_id = source_match.group(1)
        next_line = lines[index + 1].strip() if index + 1 < len(lines) else ""

        if not current_tier:
            fail(f"{source_id}: source must be listed below a Tier heading")
        if source_id in source_ids:
            fail(f"{source_id}: duplicate source id")
        if not next_line.startswith("https://"):
            fail(f"{source_id}: source must have an https URL on the next line")

        source_ids.add(source_id)

    return source_ids


def validate_navigation_path(term_id: str, field: str, path_value: object) -> None:
    if not isinstance(path_value, list) or not path_value:
        fail(f"{term_id}: navigation.{field} must be a non-empty list")
    if not all(isinstance(segment, str) and segment.strip() for segment in path_value):
        fail(f"{term_id}: navigation.{field} contains an invalid path segment")
    if path_value[0] not in VALID_NAVIGATION_ROOTS:
        fail(f"{term_id}: navigation.{field} must start with Docs, Plus, or Index")


def validate_navigation(term_id: str, navigation: object) -> None:
    if not isinstance(navigation, dict):
        fail(f"{term_id}: navigation must be a mapping")
    if "canonical_path" not in navigation:
        fail(f"{term_id}: navigation.canonical_path is required when navigation is present")

    validate_navigation_path(term_id, "canonical_path", navigation["canonical_path"])

    also_appears_in = navigation.get("also_appears_in", [])
    if not isinstance(also_appears_in, list):
        fail(f"{term_id}: navigation.also_appears_in must be a list of paths")
    for path_value in also_appears_in:
        validate_navigation_path(term_id, "also_appears_in", path_value)


def load_groups() -> dict[str, dict]:
    if not GROUPS_PATH.exists():
        fail(f"missing {GROUPS_PATH.relative_to(ROOT)}")

    groups = yaml.safe_load(GROUPS_PATH.read_text(encoding="utf-8"))
    if not isinstance(groups, list) or not groups:
        fail("groups.yml must be a non-empty list")

    by_id: dict[str, dict] = {}
    for index, group in enumerate(groups):
        if not isinstance(group, dict):
            fail(f"group #{index} must be a mapping")
        group_id = group.get("id")
        if not group_id:
            fail(f"group #{index} is missing id")
        if group_id in by_id:
            fail(f"{group_id}: duplicate group id in groups.yml")
        if group.get("category") not in VALID_CATEGORIES:
            fail(f"{group_id}: invalid category {group.get('category')}")
        if not group.get("label"):
            fail(f"{group_id}: missing label")
        by_id[group_id] = group

    return by_id


def main() -> None:
    if not TERMS_PATH.exists():
        fail(f"missing {TERMS_PATH.relative_to(ROOT)}")
    if not SOURCES_PATH.exists():
        fail(f"missing {SOURCES_PATH.relative_to(ROOT)}")

    terms = yaml.safe_load(TERMS_PATH.read_text(encoding="utf-8"))
    source_ids = parse_source_ids(SOURCES_PATH.read_text(encoding="utf-8"))
    groups_by_id = load_groups()
    used_group_ids: set[str] = set()
    if not source_ids:
        fail("sources.md must register at least one `source_id`")
    if not isinstance(terms, list):
        fail("terms.yml must be a list")
    if len(terms) < 60:
        fail(f"expected at least 60 terms, got {len(terms)}")

    term_ids = {term.get("id") for term in terms if isinstance(term, dict)}
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

        group_id = term["group"]
        group = groups_by_id.get(group_id)
        if group is None:
            fail(f"{term_id}: unknown group {group_id}")
        if group["category"] != category:
            fail(
                f"{term_id}: group {group_id} belongs to category "
                f"{group['category']}, but term category is {category}"
            )
        used_group_ids.add(group_id)

        if term["status"] not in VALID_STATUS:
            fail(f"{term_id}: invalid status {term['status']}")
        if term["confidence"] not in VALID_CONFIDENCE:
            fail(f"{term_id}: invalid confidence {term['confidence']}")
        if "kind" in term and term["kind"] not in VALID_KINDS:
            fail(f"{term_id}: invalid kind {term['kind']}")
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
        if "related" in term:
            if not isinstance(term["related"], list):
                fail(f"{term_id}: related must be a list")
            for related in term["related"]:
                related_id = related.get("id")
                relation = related.get("relation")
                note = related.get("note")
                if not related_id or not relation or not note:
                    fail(f"{term_id}: related items require id, relation, note")
                if related_id not in term_ids:
                    fail(f"{term_id}: unknown related id {related_id}")
                if relation not in VALID_RELATED_RELATIONS:
                    fail(f"{term_id}: invalid related relation {relation}")
                if related_id == term_id:
                    fail(f"{term_id}: related id cannot point to itself")
        if "navigation" in term:
            validate_navigation(term_id, term["navigation"])

    sparse = {category: count for category, count in counts.items() if count < 8}
    if sparse:
        fail(f"categories need at least 8 terms each: {sparse}")

    unused_groups = sorted(set(groups_by_id) - used_group_ids)
    if unused_groups:
        print(f"WARNING: groups with no terms: {unused_groups}", file=sys.stderr)

    print(f"terms ok: {len(terms)}")
    print("categories:", dict(sorted(counts.items())))
    print(f"groups ok: {len(groups_by_id)} ({len(used_group_ids)} in use)")


if __name__ == "__main__":
    main()
