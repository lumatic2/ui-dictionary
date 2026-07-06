from __future__ import annotations

from pathlib import Path
import json
import re
import sys

import yaml


ROOT = Path(__file__).resolve().parents[1]
RECIPES_ROOT = ROOT / "recipes"
TERMS_PATH = ROOT / "docs" / "ui-vocabulary" / "terms.yml"
TOKENS_PATH = ROOT / "tokens" / "askewly.tokens.json"

# Source of truth: docs/design-system/pattern-taxonomy.md §3 (10 fixed values)
VALID_PATTERN_GROUPS = {
    "marketing",
    "application-ui",
    "commerce",
    "docs",
    "data-display",
    "forms",
    "navigation",
    "overlays",
    "feedback",
    "layout",
}

# Source of truth: docs/design-system/recipe-format.md frontmatter contract
# (term kind vocabulary, reused per pattern-taxonomy.md §4)
VALID_KINDS = {
    "component",
    "block",
    "form-pattern",
    "visual-effect",
    "motion-pattern",
    "visual-treatment",
}

# Source of truth: docs/design-system/pattern-taxonomy.md §2 (7 fixed values)
VALID_SURFACES = {
    "websites",
    "mobile-apps",
    "saas-dashboards",
    "commerce",
    "documentation",
    "internal-tools",
    "components-primitives",
}

VALID_STATUS = {"draft", "stable", "deprecated"}

REQUIRED_FRONTMATTER_FIELDS = {
    "id",
    "name",
    "pattern_group",
    "kind",
    "status",
    "surface_refs",
    "tokens_used",
    "code_asset",
}

REQUIRED_SECTIONS = [
    "## Intent",
    "## Anatomy",
    "## States",
    "## Variants",
    "## Code",
    "## Checks",
    "## Anti-patterns",
    "## Agent notes",
]

ALLOWED_TOKEN_PREFIXES = (
    "color.semantic.",
    "color.component.",
    "dimension.",
    "typography.",
)

HEX_COLOR_PATTERN = re.compile(r"#[0-9a-fA-F]{3,8}\b")
CODE_FENCE_PATTERN = re.compile(r"```[^\n]*\n(.*?)```", re.DOTALL)

errors: list[str] = []


def fail(recipe_id: str, message: str) -> None:
    errors.append(f"{recipe_id}: {message}")


def parse_frontmatter(text: str, rel_path: str) -> tuple[dict | None, str]:
    if not text.startswith("---"):
        errors.append(f"{rel_path}: missing frontmatter delimiter '---'")
        return None, ""

    parts = text.split("---", 2)
    if len(parts) < 3:
        errors.append(f"{rel_path}: malformed frontmatter (need opening and closing '---')")
        return None, ""

    _, frontmatter_text, body = parts
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
    except yaml.YAMLError as exc:
        errors.append(f"{rel_path}: frontmatter YAML parse error: {exc}")
        return None, body

    if not isinstance(frontmatter, dict):
        errors.append(f"{rel_path}: frontmatter must be a mapping")
        return None, body

    return frontmatter, body


def load_tokens() -> dict:
    if not TOKENS_PATH.exists():
        fail("(setup)", f"missing {TOKENS_PATH.relative_to(ROOT)}")
        return {}
    return json.loads(TOKENS_PATH.read_text(encoding="utf-8"))


def token_path_exists(tokens: dict, dot_path: str) -> bool:
    segments = dot_path.split(".")
    node = tokens
    for segment in segments:
        if not isinstance(node, dict) or segment not in node:
            return False
        node = node[segment]
    if not isinstance(node, dict):
        return False
    return "$value" in node


def load_term_ids() -> set[str]:
    if not TERMS_PATH.exists():
        fail("(setup)", f"missing {TERMS_PATH.relative_to(ROOT)}")
        return set()
    terms = yaml.safe_load(TERMS_PATH.read_text(encoding="utf-8"))
    if not isinstance(terms, list):
        return set()
    return {term.get("id") for term in terms if isinstance(term, dict) and term.get("id")}


def validate_frontmatter(recipe_id_hint: str, frontmatter: dict, filename_stem: str) -> str:
    # returns the effective recipe id (for cross-referencing in later checks)
    missing = REQUIRED_FRONTMATTER_FIELDS - set(frontmatter)
    if missing:
        fail(recipe_id_hint, f"missing frontmatter fields {sorted(missing)}")

    recipe_id = frontmatter.get("id")
    if recipe_id and recipe_id != filename_stem:
        fail(recipe_id_hint, f"frontmatter id '{recipe_id}' does not match filename '{filename_stem}'")

    pattern_group = frontmatter.get("pattern_group")
    if pattern_group is not None and pattern_group not in VALID_PATTERN_GROUPS:
        fail(recipe_id_hint, f"invalid pattern_group '{pattern_group}' (must be one of {sorted(VALID_PATTERN_GROUPS)})")

    kind = frontmatter.get("kind")
    if kind is not None and kind not in VALID_KINDS:
        fail(recipe_id_hint, f"invalid kind '{kind}' (must be one of {sorted(VALID_KINDS)})")

    status = frontmatter.get("status")
    if status is not None and status not in VALID_STATUS:
        fail(recipe_id_hint, f"invalid status '{status}' (must be one of {sorted(VALID_STATUS)})")

    surface_refs = frontmatter.get("surface_refs")
    if surface_refs is not None:
        if not isinstance(surface_refs, list) or not surface_refs:
            fail(recipe_id_hint, "surface_refs must be a non-empty list")
        else:
            invalid = [s for s in surface_refs if s not in VALID_SURFACES]
            if invalid:
                fail(recipe_id_hint, f"invalid surface_refs {invalid} (must be subset of {sorted(VALID_SURFACES)})")

    return recipe_id or recipe_id_hint


def validate_tokens_used(recipe_id: str, frontmatter: dict, tokens: dict) -> None:
    tokens_used = frontmatter.get("tokens_used")
    if tokens_used is None:
        return
    if not isinstance(tokens_used, list) or not tokens_used:
        fail(recipe_id, "tokens_used must be a non-empty list")
        return

    for token_ref in tokens_used:
        if not isinstance(token_ref, str):
            fail(recipe_id, f"tokens_used entry must be a string, got {token_ref!r}")
            continue
        if token_ref.startswith("color.primitive."):
            fail(recipe_id, f"tokens_used '{token_ref}' references color.primitive.* directly (forbidden)")
            continue
        if not token_ref.startswith(ALLOWED_TOKEN_PREFIXES):
            fail(
                recipe_id,
                f"tokens_used '{token_ref}' must start with one of "
                f"{ALLOWED_TOKEN_PREFIXES}",
            )
            continue
        if not token_path_exists(tokens, token_ref):
            fail(recipe_id, f"tokens_used '{token_ref}' does not exist in {TOKENS_PATH.relative_to(ROOT)}")


def validate_body(recipe_id: str, body: str) -> None:
    for section in REQUIRED_SECTIONS:
        pattern = re.compile(rf"^{re.escape(section)}\s*$", re.MULTILINE)
        if not pattern.search(body):
            fail(recipe_id, f"missing required section header '{section}'")

    for code_block in CODE_FENCE_PATTERN.findall(body):
        hex_matches = HEX_COLOR_PATTERN.findall(code_block)
        if hex_matches:
            fail(recipe_id, f"code block contains hex color literal(s): {sorted(set(hex_matches))}")


def validate_refs(
    recipe_id: str,
    frontmatter: dict,
    all_recipe_ids: set[str],
    term_ids: set[str],
) -> None:
    code_asset = frontmatter.get("code_asset")
    if code_asset:
        if not (ROOT / code_asset).exists():
            fail(recipe_id, f"code_asset path does not exist: {code_asset}")

    component_refs = frontmatter.get("component_refs")
    if component_refs:
        if not isinstance(component_refs, list):
            fail(recipe_id, "component_refs must be a list")
        else:
            for ref in component_refs:
                if ref not in all_recipe_ids:
                    fail(recipe_id, f"component_refs '{ref}' does not exist as a recipe id")

    term_refs = frontmatter.get("term_refs")
    if term_refs:
        if not isinstance(term_refs, list):
            fail(recipe_id, "term_refs must be a list")
        else:
            for ref in term_refs:
                if ref not in term_ids:
                    fail(recipe_id, f"term_refs '{ref}' does not exist in {TERMS_PATH.relative_to(ROOT)}")


def main() -> None:
    recipe_files = sorted(RECIPES_ROOT.glob("**/*.md"))

    if not recipe_files:
        print("no recipes yet")
        return

    tokens = load_tokens()
    term_ids = load_term_ids()

    parsed: list[tuple[str, str, dict, str]] = []  # (rel_path, recipe_id, frontmatter, body)
    id_counts: dict[str, int] = {}

    for path in recipe_files:
        rel_path = str(path.relative_to(ROOT))
        text = path.read_text(encoding="utf-8")
        frontmatter, body = parse_frontmatter(text, rel_path)
        if frontmatter is None:
            continue
        filename_stem = path.stem
        recipe_id_hint = frontmatter.get("id") or filename_stem
        parsed.append((rel_path, recipe_id_hint, frontmatter, body))
        id_counts[recipe_id_hint] = id_counts.get(recipe_id_hint, 0) + 1

    all_recipe_ids = set(id_counts)

    for rel_path, recipe_id_hint, frontmatter, body in parsed:
        if id_counts.get(recipe_id_hint, 0) > 1:
            fail(rel_path, f"duplicate recipe id '{recipe_id_hint}' across recipes/")

        recipe_id = validate_frontmatter(rel_path, frontmatter, Path(rel_path).stem)
        validate_tokens_used(recipe_id, frontmatter, tokens)
        validate_body(recipe_id, body)
        validate_refs(recipe_id, frontmatter, all_recipe_ids, term_ids)

    if errors:
        for message in errors:
            print(f"ERROR: {message}", file=sys.stderr)
        raise SystemExit(1)

    print(f"recipes ok: {len(parsed)}")


if __name__ == "__main__":
    main()
