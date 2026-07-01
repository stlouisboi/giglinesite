"""
Surgical logo swap (v2) for /app/frontend/public/assets/gl-fm-2026.pdf

v1 left both target slots invisible because the original embedded logo
images carried a shield-shaped soft-mask (smask). Replacing the RGB
stream alone meant the new logo got clipped to the old shield silhouette.

This version:
  1. Replaces the RGB image stream with the canonical 3D logo,
     centred on a navy slot the same size as the original.
  2. Replaces the linked smask stream with a fully-white grayscale image
     of the same dimensions, so the full rectangle is opaque and the
     entire new logo is visible.

We use pikepdf because we need full control over the image XObject
dictionary (Width, Height, ColorSpace, Filter, /SMask).
"""

import shutil
from pathlib import Path
import io
from PIL import Image
import pikepdf
from pikepdf import Pdf, Name, Stream

PDF_PATH       = Path("/app/frontend/public/assets/gl-fm-2026.pdf")
BACKUP_PATH    = Path("/app/frontend/public/assets/gl-fm-2026.pdf.bak")
CANONICAL_LOGO = Path("/app/frontend/public/gigline-logo-3d.png")

SLOTS = [(600, 270), (416, 208)]
NAVY  = (10, 22, 40)


def render_logo_raw(width: int, height: int) -> bytes:
    """Composite the canonical logo onto a navy slot. Returns raw RGB bytes."""
    src = Image.open(CANONICAL_LOGO).convert("RGBA")
    pad = 0.08
    target_w = int(width * (1 - 2 * pad))
    target_h = int(height * (1 - 2 * pad))
    ratio = min(target_w / src.width, target_h / src.height)
    new = src.resize((int(src.width * ratio), int(src.height * ratio)), Image.LANCZOS)
    canvas = Image.new("RGB", (width, height), NAVY)
    canvas.paste(new, ((width - new.width) // 2, (height - new.height) // 2), new)
    return canvas.tobytes("raw", "RGB")


def white_mask_raw(width: int, height: int) -> bytes:
    """Solid-white grayscale of the requested size — fully opaque mask."""
    return Image.new("L", (width, height), 255).tobytes("raw", "L")


def swap_image_stream(img_obj, width: int, height: int):
    """Replace an XObject image's pixel data with our raw RGB bytes."""
    img_obj.write(
        render_logo_raw(width, height),
        filter=Name.FlateDecode,
    )
    img_obj.Width        = width
    img_obj.Height       = height
    img_obj.ColorSpace   = Name.DeviceRGB
    img_obj.BitsPerComponent = 8
    # Drop any decode-related leftovers
    for k in ("/DecodeParms", "/Decode"):
        if k.lstrip("/") in img_obj.keys():
            del img_obj[k.lstrip("/")]


def swap_smask_stream(smask_obj, width: int, height: int):
    """Replace a soft mask with a solid-white grayscale bitmap."""
    smask_obj.write(
        white_mask_raw(width, height),
        filter=Name.FlateDecode,
    )
    smask_obj.Width        = width
    smask_obj.Height       = height
    smask_obj.ColorSpace   = Name.DeviceGray
    smask_obj.BitsPerComponent = 8
    for k in ("/DecodeParms", "/Decode"):
        if k.lstrip("/") in smask_obj.keys():
            del smask_obj[k.lstrip("/")]


def main():
    shutil.copy2(PDF_PATH, BACKUP_PATH)
    print(f"backup → {BACKUP_PATH}")

    pdf = Pdf.open(PDF_PATH, allow_overwriting_input=True)

    seen = set()
    swapped = 0
    for page in pdf.pages:
        for name, xobj in page.images.items():
            if xobj.objgen in seen:
                continue
            seen.add(xobj.objgen)

            w = int(xobj.Width)
            h = int(xobj.Height)
            if (w, h) not in SLOTS:
                continue

            # Swap the image data
            swap_image_stream(xobj, w, h)

            # Neutralize the linked smask, if any
            if "/SMask" in xobj.keys():
                smask = xobj.SMask
                sw = int(smask.Width)
                sh = int(smask.Height)
                swap_smask_stream(smask, sw, sh)
                print(f"  swapped {w}x{h} image (xref {xobj.objgen[0]}) + smask (xref {smask.objgen[0]})")
            else:
                print(f"  swapped {w}x{h} image (xref {xobj.objgen[0]})  [no smask]")

            swapped += 1

    print(f"total swapped: {swapped}")
    pdf.save(PDF_PATH)
    print(f"saved → {PDF_PATH}  ({PDF_PATH.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
