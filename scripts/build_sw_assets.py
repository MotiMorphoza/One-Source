import json
import re
from pathlib import Path
from urllib.parse import urlparse


ROOT_DIR = Path(__file__).resolve().parent.parent
INDEX_FILE = ROOT_DIR / "index.html"
OUTPUT_FILE = ROOT_DIR / "sw-assets.js"

HTML_ASSET_PATTERN = re.compile(
    r"""<(?:link|script)\b[^>]*(?:href|src)=["']([^"']+)["'][^>]*>""",
    re.IGNORECASE,
)
JS_IMPORT_PATTERN = re.compile(
    r"""import\s+(?:[^"'`;]+?\s+from\s+)?["']([^"']+)["']""",
)
CSS_URL_PATTERN = re.compile(
    r"""url\(\s*["']?([^)"']+)["']?\s*\)""",
    re.IGNORECASE,
)
CSS_IMPORT_PATTERN = re.compile(
    r"""@import\s+(?:url\()?["']([^"']+)["']\)?""",
    re.IGNORECASE,
)

SKIP_PREFIXES = ("http://", "https://", "data:", "mailto:", "#")


def normalize_asset_path(asset_path: str, base_file: Path) -> str | None:
    if not asset_path:
        return None

    cleaned = asset_path.strip()
    if not cleaned or cleaned.startswith(SKIP_PREFIXES):
        return None

    parsed = urlparse(cleaned)
    if parsed.scheme or parsed.netloc:
        return None

    path_only = parsed.path
    if not path_only:
        return None

    if path_only.startswith("/"):
        resolved = ROOT_DIR / path_only.lstrip("/")
    else:
        resolved = (base_file.parent / path_only).resolve()

    try:
        relative = resolved.relative_to(ROOT_DIR)
    except ValueError:
        return None

    if not resolved.exists() or resolved.is_dir():
        return None

    return f"./{relative.as_posix()}"


def discover_html_assets(index_file: Path) -> set[str]:
    assets = {"./", "./index.html"}
    content = index_file.read_text(encoding="utf-8")

    for match in HTML_ASSET_PATTERN.findall(content):
        normalized = normalize_asset_path(match, index_file)
        if normalized:
            assets.add(normalized)

    return assets


def discover_manifest_assets(asset_path: str) -> set[str]:
    file_path = ROOT_DIR / asset_path.removeprefix("./")
    try:
        manifest = json.loads(file_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {asset_path}

    assets = {asset_path}
    for icon in manifest.get("icons", []):
        normalized = normalize_asset_path(icon.get("src", ""), file_path)
        if normalized:
            assets.add(normalized)

    return assets


def collect_css_dependencies(asset_path: str, seen: set[str]) -> set[str]:
    if asset_path in seen:
        return set()

    seen.add(asset_path)
    file_path = ROOT_DIR / asset_path.removeprefix("./")
    content = file_path.read_text(encoding="utf-8")
    assets = {asset_path}

    for match in CSS_IMPORT_PATTERN.findall(content):
        normalized = normalize_asset_path(match, file_path)
        if normalized:
            assets |= collect_css_dependencies(normalized, seen)

    for match in CSS_URL_PATTERN.findall(content):
        normalized = normalize_asset_path(match, file_path)
        if normalized:
            assets.add(normalized)

    return assets


def collect_js_dependencies(asset_path: str, seen: set[str]) -> set[str]:
    if asset_path in seen:
        return set()

    seen.add(asset_path)
    file_path = ROOT_DIR / asset_path.removeprefix("./")
    content = file_path.read_text(encoding="utf-8")
    assets = {asset_path}

    for match in JS_IMPORT_PATTERN.findall(content):
        normalized = normalize_asset_path(match, file_path)
        if not normalized:
            continue

        suffix = Path(normalized).suffix.lower()
        if suffix == ".css":
            assets |= collect_css_dependencies(normalized, set())
        elif suffix == ".js":
            assets |= collect_js_dependencies(normalized, seen)
        else:
            assets.add(normalized)

    return assets


def sort_assets(asset_paths: set[str]) -> list[str]:
    def sort_key(value: str):
        priority = 1
        if value == "./":
            priority = 0
        elif value == "./index.html":
            priority = 1
        elif value == "./styles.css":
            priority = 2
        elif value == "./hubIndex.js":
            priority = 3
        return (priority, value)

    return sorted(asset_paths, key=sort_key)


def write_manifest(asset_paths: list[str]) -> None:
    lines = ["self.APP_SHELL_ASSETS = ["]
    lines.extend(f'  "{asset}",' for asset in asset_paths)
    lines.append("];")
    OUTPUT_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")


def build_manifest() -> list[str]:
    assets = discover_html_assets(INDEX_FILE)
    js_seen: set[str] = set()

    for asset in list(assets):
        suffix = Path(asset).suffix.lower()
        if suffix == ".js":
            assets |= collect_js_dependencies(asset, js_seen)
        elif suffix == ".css":
            assets |= collect_css_dependencies(asset, set())
        elif suffix == ".json" and asset.endswith("manifest.json"):
            assets |= discover_manifest_assets(asset)

    sorted_assets = sort_assets(assets)
    write_manifest(sorted_assets)
    return sorted_assets


if __name__ == "__main__":
    result = build_manifest()
    print(f"Rebuilt sw-assets.js with {len(result)} assets.")
