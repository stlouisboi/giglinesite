"""
Add missing width, height, and loading="lazy" attributes to every <img> tag
across the frontend src tree.

Rules:
  - width/height sourced from the actual image file on disk
  - Skip if the tag already has both dimensions
  - loading="lazy" added if not present AND fetchPriority is not on the tag
    (LCP hero has fetchPriority="high" — must stay eager)
  - Skip <img> tags whose src is a dynamic expression we cannot resolve
    (they get logged for manual review)
"""

import re
from pathlib import Path
from PIL import Image

SRC = Path("/app/frontend/src")
PUBLIC = Path("/app/frontend/public")

# Match every <img ...> — DOTALL for multi-line JSX
IMG_RE = re.compile(r'<img\s+([^>]*?)\s*/?>', re.DOTALL)

def find_src_value(attrs: str):
    # src="..." or src={"..."} or src={`...`}
    m = re.search(r"src=[\"'`]([^\"'`]+)[\"'`]", attrs)
    if m: return m.group(1), "literal"
    m = re.search(r"src=\{([^}]+)\}", attrs)
    if m: return m.group(1).strip(), "expression"
    return None, None

def resolve_public_path(src_value: str):
    """Convert a URL-style src to a local file path in /public."""
    if src_value.startswith("http"):
        # External URL — extract just the path if it's giglinecompliance.com
        m = re.search(r"giglinecompliance\.com(/[^\s\"'`]+)", src_value)
        if m:
            src_value = m.group(1)
        else:
            return None
    if src_value.startswith("/"):
        p = PUBLIC / src_value.lstrip("/")
        if p.exists():
            return p
    return None

def get_dimensions(src_value: str):
    p = resolve_public_path(src_value)
    if not p: return None
    try:
        with Image.open(p) as im:
            return im.size
    except Exception:
        return None

def ensure_attr(attrs: str, name: str, value: str):
    """Insert an attribute if not already present."""
    if re.search(rf"\b{name}=", attrs):
        return attrs, False
    # Insert right after src=... for grouping, else at the front
    m = re.search(r'(src=[\"\'`][^\"\'`]+[\"\'`])', attrs)
    if m:
        idx = m.end()
        new = attrs[:idx] + f' {name}="{value}"' + attrs[idx:]
    else:
        new = f'{name}="{value}" ' + attrs
    return new, True

def process_file(js: Path):
    text = js.read_text()
    original = text
    changes = 0
    log = []

    def replace(match):
        nonlocal changes
        attrs = match.group(1)
        src_val, kind = find_src_value(attrs)
        if not src_val:
            log.append(f"    ! no src found — skipped")
            return match.group(0)

        # Only try to resolve literal srcs
        new_attrs = attrs
        if kind == "literal":
            dims = get_dimensions(src_val)
            if dims:
                w, h = dims
                new_attrs, added_w = ensure_attr(new_attrs, "width",  str(w))
                new_attrs, added_h = ensure_attr(new_attrs, "height", str(h))
                if added_w or added_h:
                    changes += 1

        # Add loading="lazy" unless fetchPriority is present or loading already set
        has_priority = re.search(r"fetch[Pp]riority", new_attrs)
        has_loading  = re.search(r"\bloading=", new_attrs)
        if not has_priority and not has_loading:
            new_attrs, added_l = ensure_attr(new_attrs, "loading", "lazy")
            if added_l:
                changes += 1

        return f"<img {new_attrs.strip()} />"

    new_text = IMG_RE.sub(replace, text)
    if new_text != original:
        js.write_text(new_text)
    return changes, log


total = 0
for js in SRC.rglob("*.js"):
    changes, log = process_file(js)
    if changes:
        total += changes
        print(f"  {changes:>2} attrs added  {js.relative_to(SRC.parent)}")
        for line in log:
            print(line)

print(f"\nTotal attributes added: {total}")
