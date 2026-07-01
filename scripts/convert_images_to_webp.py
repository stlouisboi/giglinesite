"""
Batch-convert content JPG/PNG assets to WebP for the marketing site.

Rules:
  - Skip logos/favicons/OG cards/PWA manifest icons (must stay PNG for
    third-party compatibility)
  - Skip already-optimized WebP originals
  - Keep original JPG/PNG on disk as a fallback (referenced by <picture> or
    kept in place for any file we don't rewire yet)
  - Quality 82 for JPGs (visually indistinguishable, 60–70% smaller)
  - Method 6 (slowest / best-compression) — one-time build cost is fine

Prints a summary of savings so we can verify the impact.
"""

import os
from pathlib import Path
from PIL import Image

PUBLIC = Path("/app/frontend/public")

# Never touch these — third-party compat / PWA / social embeds
SKIP_PATTERNS = {
    "og-image.png",              # social share card — many platforms don't like WebP
    "og-image-pinterest.png",    # pinterest requires JPG/PNG
    "android-chrome-192.png",    # PWA manifest
    "android-chrome-512.png",    # PWA manifest
    "apple-touch-icon.png",      # iOS home-screen icon
    "favicon-48.png",
    "favicon-dark-icon-16.png", "favicon-dark-icon-32.png",
    "favicon-dark-icon-48.png", "favicon-dark-icon-180.png",
    "favicon-light-icon-16.png", "favicon-light-icon-32.png",
    "favicon-light-icon-48.png", "favicon-light-icon-180.png",
    "gigline-logo-3d.png",           # brand — keep PNG source of truth
    "gigline-logo-dark-bg.png",      # brand — keep PNG
}

MIN_KB = 20  # skip anything already tiny — no meaningful savings

converted = 0
skipped   = 0
total_saved_kb = 0

def convert(src: Path):
    global converted, total_saved_kb
    dst = src.with_suffix(".webp")
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        return  # already up-to-date
    img = Image.open(src)
    save_kwargs = {"quality": 82, "method": 6}
    if img.mode == "RGBA":
        save_kwargs["lossless"] = False
    # Convert palette PNGs to RGB(A) for WebP
    if img.mode in ("P", "L"):
        img = img.convert("RGBA" if "transparency" in img.info else "RGB")
    img.save(dst, "WEBP", **save_kwargs)
    before_kb = src.stat().st_size // 1024
    after_kb  = dst.stat().st_size // 1024
    saved     = before_kb - after_kb
    total_saved_kb += max(saved, 0)
    converted += 1
    print(f"  {before_kb:>5} → {after_kb:>4} KB  ({saved:>+5} KB)  {src.relative_to(PUBLIC)}")

for src in sorted(PUBLIC.rglob("*")):
    if not src.is_file():
        continue
    if src.name in SKIP_PATTERNS:
        skipped += 1
        continue
    ext = src.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        continue
    if src.stat().st_size < MIN_KB * 1024:
        continue
    # Skip PDFs, backups, etc.
    if ".bak" in src.name.lower():
        continue
    try:
        convert(src)
    except Exception as e:
        print(f"  SKIP {src}: {e}")

print()
print(f"converted: {converted}")
print(f"skipped:   {skipped}")
print(f"total saved: {total_saved_kb} KB  (~{total_saved_kb / 1024:.1f} MB)")
