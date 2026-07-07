"""GL-WEB-018b (Jul 2026) — Propagate the new flat logo to favicons + OG image.

Source of truth: /app/frontend/public/gigline-logo-3d.png (already the new logo).

Outputs:
  * All favicon-*.png variants (16/32/48/180 in light + dark themes) + favicon.ico
  * apple-touch-icon.png
  * og-image.png and og-image-pinterest.png (regenerated via existing generator)

Favicons crop to the "buckle icon" portion of the new logo (the square icon
between the two yellow belt bars) so it stays readable at 16×16.
"""

from pathlib import Path
from PIL import Image
import numpy as np

PUBLIC = Path('/app/frontend/public')
SRC_LOGO = PUBLIC / 'gigline-logo-3d.png'          # light-bg source
SRC_DARK = PUBLIC / 'gigline-logo-dark-bg.png'     # dark-bg source


def _crop_buckle(logo_img: Image.Image) -> Image.Image:
    """Isolate the buckle icon (central charcoal shape between the two belt bars).

    Strategy: find yellow-band pixel rows (belt bars), then take the box between
    them horizontally centered on the buckle glyph.
    """
    arr = np.array(logo_img.convert('RGBA'))
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    is_yellow = (r > 180) & (g > 140) & (b < 120) & (a > 50)
    # yellow-pixel row occupancy
    row_yellow = is_yellow.sum(axis=1)
    threshold = row_yellow.max() * 0.5 if row_yellow.max() else 0
    yellow_rows = np.where(row_yellow > threshold)[0]
    if len(yellow_rows) < 2:
        return logo_img  # fallback

    # Belt bars occupy top and bottom yellow ranges; buckle sits between them.
    # Find the vertical gap between yellow rows (max jump in indices).
    gaps = np.diff(yellow_rows)
    if gaps.max() < 5:
        return logo_img
    gap_idx = gaps.argmax()
    y0 = yellow_rows[gap_idx]
    y1 = yellow_rows[gap_idx + 1]
    # Slice out the buckle region horizontally too — non-transparent pixels only
    slab = arr[y0:y1, :, 3]
    xs = np.where(slab.max(axis=0) > 20)[0]
    if len(xs) == 0:
        return logo_img
    # Center the crop on the buckle horizontally, square aspect ratio
    x0, x1 = xs.min(), xs.max()
    h = y1 - y0
    cx = (x0 + x1) // 2
    half = max(h, x1 - x0) // 2 + 6
    left = max(0, cx - half)
    right = min(logo_img.width, cx + half)
    top = max(0, y0 - 6)
    bottom = min(logo_img.height, y1 + 6)
    return logo_img.crop((left, top, right, bottom))


def _build_favicon(src_path: Path, size: int) -> Image.Image:
    src = Image.open(src_path).convert('RGBA')
    icon = _crop_buckle(src)
    # Fit into a square with transparent padding
    max_dim = max(icon.size)
    canvas = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
    canvas.paste(icon, ((max_dim - icon.width) // 2, (max_dim - icon.height) // 2), icon)
    return canvas.resize((size, size), Image.LANCZOS)


def build_favicons():
    print("=== Favicons ===")
    for theme, src_path in (('light', SRC_LOGO), ('dark', SRC_DARK)):
        for size in (16, 32, 48, 180):
            out = PUBLIC / f'favicon-{theme}-icon-{size}.png'
            _build_favicon(src_path, size).save(out, 'PNG', optimize=True)
            print(f"  wrote {out.name} ({size}×{size})")
    # apple-touch-icon: light theme, 180×180
    _build_favicon(SRC_LOGO, 180).save(PUBLIC / 'apple-touch-icon.png', 'PNG', optimize=True)
    print(f"  wrote apple-touch-icon.png (180×180)")
    # favicon-48 (theme-neutral fallback): use light-theme 48
    _build_favicon(SRC_LOGO, 48).save(PUBLIC / 'favicon-48.png', 'PNG', optimize=True)
    print(f"  wrote favicon-48.png (48×48)")
    # favicon.ico: multi-resolution ICO
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_frames = [_build_favicon(SRC_LOGO, s[0]) for s in ico_sizes]
    ico_frames[0].save(
        PUBLIC / 'favicon.ico',
        format='ICO',
        sizes=ico_sizes,
        append_images=ico_frames[1:],
    )
    print(f"  wrote favicon.ico (multi-res)")


def build_og_image():
    """Regenerate the social share image using the new flat logo."""
    print("\n=== OG image ===")
    import subprocess
    # First check if the OG generator can accept a PNG. If not, monkey-patch env.
    result = subprocess.run(
        ['python3', '/app/backend/scripts/generate_og_image.py'],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode == 0:
        print("  regenerated via generate_og_image.py")
        print("  stdout tail:", result.stdout.strip().splitlines()[-3:])
    else:
        print("  ⚠ generate_og_image.py failed:")
        print("  stderr:", result.stderr.strip()[:500])
        print("  → falling back to a simple centered logo composite")
        _og_fallback()


def _og_fallback():
    """Simple fallback: 1200×630 navy background with centered white logo."""
    img = Image.new('RGB', (1200, 630), (16, 42, 67))  # #102A43
    logo = Image.open(SRC_DARK).convert('RGBA')
    scale = min(1000 / logo.width, 400 / logo.height)
    new_size = (int(logo.width * scale), int(logo.height * scale))
    logo = logo.resize(new_size, Image.LANCZOS)
    x = (1200 - logo.width) // 2
    y = (630 - logo.height) // 2
    img.paste(logo, (x, y), logo)
    img.save(PUBLIC / 'og-image.png', 'PNG', optimize=True)
    img.save(PUBLIC / 'og-image-pinterest.png', 'PNG', optimize=True)
    print(f"  wrote og-image.png + og-image-pinterest.png (fallback)")


if __name__ == '__main__':
    build_favicons()
    build_og_image()
    print("\n✓ Logo propagation complete.")
