"""
Regenerate the GigLine Open Graph social card image (og-image.png).
Bold, readable, brand-aligned. 1200x630 standard.

Run: python3 /app/backend/scripts/generate_og_image.py
Output: /app/frontend/public/og-image.png
"""

import os
from PIL import Image, ImageDraw, ImageFont

OUT = "/app/frontend/public/og-image.png"
SIZE = (1200, 630)

# ── Brand palette ──
NAVY = (10, 22, 40)           # #0A1628
NAVY_DEEPER = (7, 16, 30)     # gradient darker
GOLD = (197, 160, 89)         # #C5A059
GOLD_LIGHT = (217, 187, 124)
WHITE = (255, 255, 255)
WHITE_60 = (255, 255, 255, 153)
WHITE_75 = (255, 255, 255, 191)

# ── Font fallbacks (system fonts available in Linux containers) ──
def load_font(size, bold=False):
    candidates_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]
    candidates_regular = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ]
    for path in (candidates_bold if bold else candidates_regular):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def build():
    # Start with solid navy background (cleaner than gradient for previews)
    img = Image.new("RGB", SIZE, NAVY)
    draw = ImageDraw.Draw(img)

    # ── Subtle radial darkening at the bottom-right for depth (not too fancy) ──
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    # A simple gradient strip on the left edge — keeps it clean
    for i in range(40):
        odraw.line([(i, 0), (i, SIZE[1])], fill=(*GOLD, max(0, 35 - i)))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ── Gold accent line top-left ──
    draw.rectangle([(80, 80), (160, 86)], fill=GOLD)

    # ── Kicker label (above headline) ──
    kicker_font = load_font(22, bold=True)
    draw.text(
        (80, 110),
        "OSHA SAFETY WALKTHROUGHS  ·  TRIAD NC",
        font=kicker_font,
        fill=GOLD,
    )

    # ── Headline (the main value prop, big and bold) ──
    headline_font = load_font(72, bold=True)
    headline_y = 175
    draw.text(
        (80, headline_y),
        "If OSHA Walked In",
        font=headline_font,
        fill=WHITE,
    )
    draw.text(
        (80, headline_y + 88),
        "Tomorrow,",
        font=headline_font,
        fill=WHITE,
    )
    draw.text(
        (80, headline_y + 176),
        "Would You Pass?",
        font=headline_font,
        fill=GOLD,
    )

    # ── Stats / proof points row ──
    proof_label_font = load_font(16, bold=True)
    proof_value_font = load_font(34, bold=True)
    
    proofs = [
        ("AVG OSHA CITATION", "$15,625"),
        ("REPORT IN", "48 HOURS"),
        ("CALLBACK IN", "1 BUSINESS DAY"),
    ]
    
    proof_y = 470
    x_positions = [80, 470, 850]
    for (label, value), x in zip(proofs, x_positions):
        draw.text((x, proof_y), label, font=proof_label_font, fill=GOLD)
        draw.text((x, proof_y + 28), value, font=proof_value_font, fill=WHITE)

    # ── Bottom gold line + brand mark ──
    draw.rectangle([(80, 580), (160, 586)], fill=GOLD)
    
    brand_font = load_font(22, bold=True)
    draw.text((80, 596), "GigLine Safety & Compliance", font=brand_font, fill=WHITE)
    
    # Right-side phone number — easy contact for skimmers
    phone_font = load_font(28, bold=True)
    phone_text = "(336) 329-8899"
    bbox = draw.textbbox((0, 0), phone_text, font=phone_font)
    phone_w = bbox[2] - bbox[0]
    draw.text((SIZE[0] - 80 - phone_w, 596), phone_text, font=phone_font, fill=GOLD)

    img.save(OUT, "PNG", optimize=True)
    print(f"✓ Generated: {OUT}")
    print(f"  Size: {os.path.getsize(OUT) / 1024:.1f} KB ({SIZE[0]}x{SIZE[1]})")


if __name__ == "__main__":
    build()
