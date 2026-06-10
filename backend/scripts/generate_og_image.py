"""
Regenerate GigLine Open Graph social card (og-image.png) — v2.

Layout updates from v1:
  - Real horizontal GigLine logo replaces the gold accent bar (top-left)
  - Phone number anchored top-right (callable contact at a glance)
  - Headline shifts to a tighter 2-line stack with gold underline rule
  - 3-up stat band at bottom inside a darker tinted strip (visual ledge)
  - All copy stays bold and readable at thumbnail / preview sizes

Run: python3 /app/backend/scripts/generate_og_image.py
Output: /app/frontend/public/og-image.png
"""

import os
import io
from PIL import Image, ImageDraw, ImageFont
import cairosvg

OUT = "/app/frontend/public/og-image.png"
LOGO_SVG = "/app/frontend/public/gigline-logo-full-horizontal-white.svg"
SIZE = (1200, 630)

# ── Brand palette ──
NAVY = (10, 22, 40)               # #0A1628
NAVY_DARKER = (7, 16, 30)
NAVY_BAR = (5, 14, 26)            # darker strip behind stats
GOLD = (197, 160, 89)             # #C5A059
WHITE = (255, 255, 255)


def load_font(size, bold=False):
    candidates_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    candidates_regular = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in (candidates_bold if bold else candidates_regular):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def render_logo(target_height):
    """Convert horizontal white SVG to PNG, scaled to target height."""
    png_bytes = cairosvg.svg2png(
        url=LOGO_SVG,
        output_height=target_height,
    )
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def build():
    img = Image.new("RGBA", SIZE, NAVY + (255,))

    # ── Darker tinted ledge strip across the bottom for stat band ──
    draw_base = ImageDraw.Draw(img)
    draw_base.rectangle([(0, 460), (SIZE[0], SIZE[1])], fill=NAVY_DARKER + (255,))
    # Top edge of strip — thin gold rule
    draw_base.rectangle([(0, 458), (SIZE[0], 460)], fill=GOLD + (255,))

    # ── Header band: logo top-left, phone top-right ──
    logo_height = 56
    logo = render_logo(logo_height)
    img.paste(logo, (72, 60), logo)

    # Phone number top-right
    phone_font = load_font(26, bold=True)
    phone_label_font = load_font(14, bold=True)
    phone_text = "(336) 329-8899"
    bbox = ImageDraw.Draw(img).textbbox((0, 0), phone_text, font=phone_font)
    phone_w = bbox[2] - bbox[0]
    ImageDraw.Draw(img).text(
        (SIZE[0] - 72 - phone_w, 62),
        "CALL OR TEXT",
        font=phone_label_font,
        fill=GOLD + (255,),
    )
    ImageDraw.Draw(img).text(
        (SIZE[0] - 72 - phone_w, 84),
        phone_text,
        font=phone_font,
        fill=WHITE + (255,),
    )

    # ── Kicker label (above headline) ──
    kicker_font = load_font(20, bold=True)
    ImageDraw.Draw(img).text(
        (72, 178),
        "OSHA SAFETY WALKTHROUGHS  ·  TRIAD NC",
        font=kicker_font,
        fill=GOLD + (255,),
    )

    # ── Gold underline rule beneath kicker ──
    ImageDraw.Draw(img).rectangle([(72, 215), (140, 219)], fill=GOLD + (255,))

    # ── Headline — 2 lines, big and bold ──
    headline_font = load_font(72, bold=True)
    headline_y = 240
    ImageDraw.Draw(img).text(
        (72, headline_y),
        "If OSHA Walked In Tomorrow,",
        font=headline_font,
        fill=WHITE + (255,),
    )
    ImageDraw.Draw(img).text(
        (72, headline_y + 90),
        "Would You Pass?",
        font=headline_font,
        fill=GOLD + (255,),
    )

    # ── Stats band (inside the darker ledge) ──
    proof_label_font = load_font(15, bold=True)
    proof_value_font = load_font(34, bold=True)

    proofs = [
        ("AVG OSHA CITATION", "$15,625"),
        ("REPORT DELIVERED", "48 HOURS"),
        ("CALLBACK WITHIN", "1 BUSINESS DAY"),
    ]
    x_positions = [72, 480, 870]
    proof_label_y = 498
    proof_value_y = 525
    for (label, value), x in zip(proofs, x_positions):
        ImageDraw.Draw(img).text((x, proof_label_y), label, font=proof_label_font, fill=GOLD + (255,))
        ImageDraw.Draw(img).text((x, proof_value_y), value, font=proof_value_font, fill=WHITE + (255,))

    # ── Bottom-right brand tagline ──
    tag_font = load_font(14, bold=False)
    tag_text = "GIGLINECOMPLIANCE.COM"
    bbox = ImageDraw.Draw(img).textbbox((0, 0), tag_text, font=tag_font)
    tag_w = bbox[2] - bbox[0]
    tag_font_bold = load_font(14, bold=True)
    ImageDraw.Draw(img).text(
        (SIZE[0] - 72 - tag_w, SIZE[1] - 30),
        tag_text,
        font=tag_font_bold,
        fill=GOLD + (255,),
    )

    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"✓ Generated: {OUT}")
    print(f"  Size: {os.path.getsize(OUT) / 1024:.1f} KB ({SIZE[0]}x{SIZE[1]})")


if __name__ == "__main__":
    build()
