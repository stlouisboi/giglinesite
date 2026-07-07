"""
Regenerate GigLine Open Graph social card (og-image.png) — v3.

Layout mirrors the reference banner the user shared:
  - Right ~40% holds a portrait of Vince (faded edge into navy)
  - Left ~60% holds the logo + headline + 3 service icons + bottom info bar
  - Diagonal gold accents in corners (top-left + bottom-right)
  - Subtle dot pattern in top-left corner for texture

Run: python3 /app/backend/scripts/generate_og_image.py
Output: /app/frontend/public/og-image.png
"""

import os
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cairosvg

OUT = "/app/frontend/public/og-image.png"
# New flat logo (Jul 2026 refresh) — dark-bg variant so charcoal→white pixels
# read on the navy OG background. Direct PNG load; SVG version deprecated.
LOGO_PNG = "/app/frontend/public/gigline-logo-dark-bg.png"
LOGO_SVG = "/app/frontend/public/gigline-logo-full-horizontal-white.svg"  # legacy fallback
PORTRAIT_PATH = "/app/frontend/public/vince-portrait.png"
SIZE = (1200, 630)

# ── Brand palette ──
NAVY = (10, 22, 40)
NAVY_DARKER = (5, 12, 22)
GOLD = (197, 160, 89)
WHITE = (255, 255, 255)


def load_font(size, bold=False):
    paths_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    paths_regular = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in (paths_bold if bold else paths_regular):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def render_logo(target_height):
    """Load the new flat logo PNG and scale to target height (transparent bg)."""
    if os.path.exists(LOGO_PNG):
        img = Image.open(LOGO_PNG).convert("RGBA")
        scale = target_height / img.height
        new_w = int(img.width * scale)
        return img.resize((new_w, target_height), Image.LANCZOS)
    # Legacy SVG fallback (kept for safety if the PNG is missing)
    png_bytes = cairosvg.svg2png(url=LOGO_SVG, output_height=target_height)
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def draw_dot_pattern(draw, x, y, w, h, color=(197, 160, 89, 60), spacing=12, dot_radius=1.5):
    """Subtle gold dot grid for texture."""
    for px in range(x, x + w, spacing):
        for py in range(y, y + h, spacing):
            draw.ellipse(
                [(px - dot_radius, py - dot_radius), (px + dot_radius, py + dot_radius)],
                fill=color,
            )


def draw_diagonal_accent(img, corner, color=GOLD):
    """
    Draw a thin diagonal gold accent at a corner.
    corner: 'top_left' or 'bottom_right'
    """
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    if corner == "top_left":
        # Two diagonal lines: one at 0,200 → 200,0 (outer), and parallel inner
        odraw.polygon(
            [(0, 220), (0, 0), (250, 0), (180, 0), (0, 180)],
            fill=(*color, 60),
        )
        # Thin gold line
        odraw.line([(0, 240), (240, 0)], fill=(*color, 220), width=2)
    elif corner == "bottom_right":
        odraw.polygon(
            [(SIZE[0], SIZE[1] - 220), (SIZE[0], SIZE[1]), (SIZE[0] - 250, SIZE[1])],
            fill=(*color, 60),
        )
        odraw.line(
            [(SIZE[0] - 240, SIZE[1]), (SIZE[0], SIZE[1] - 240)],
            fill=(*color, 220), width=2,
        )
    return Image.alpha_composite(img, overlay)


def draw_clipboard_icon(draw, x, y, size=22, color=GOLD):
    """Stylized clipboard for 'Walkthroughs'."""
    c = (*color, 255)
    # body
    draw.rounded_rectangle([(x, y + 3), (x + size, y + size)], radius=2, outline=c, width=2)
    # clip
    draw.rounded_rectangle(
        [(x + 5, y), (x + size - 5, y + 6)], radius=1, fill=c,
    )
    # 3 check rows
    for i, dy in enumerate([8, 13, 18]):
        draw.ellipse([(x + 4, y + dy - 1), (x + 7, y + dy + 2)], fill=c)
        draw.line([(x + 9, y + dy), (x + size - 4, y + dy)], fill=c, width=1)


def draw_document_icon(draw, x, y, size=22, color=GOLD):
    """Stylized doc page for 'Documentation Reviews'."""
    c = (*color, 255)
    # page with folded corner
    draw.polygon(
        [(x, y), (x + size - 6, y), (x + size, y + 6), (x + size, y + size), (x, y + size)],
        outline=c, width=2,
    )
    # folded corner
    draw.line([(x + size - 6, y), (x + size - 6, y + 6), (x + size, y + 6)], fill=c, width=2)
    # lines
    for dy in [10, 14, 18]:
        draw.line([(x + 3, y + dy), (x + size - 4, y + dy)], fill=c, width=1)


def draw_warning_icon(draw, x, y, size=22, color=GOLD):
    """Stylized warning triangle for 'Incident Reviews'."""
    c = (*color, 255)
    # triangle
    draw.polygon(
        [(x + size // 2, y), (x, y + size), (x + size, y + size)],
        outline=c, width=2,
    )
    # exclamation
    draw.line([(x + size // 2, y + 7), (x + size // 2, y + 14)], fill=c, width=2)
    draw.ellipse([(x + size // 2 - 1, y + 16), (x + size // 2 + 1, y + 18)], fill=c)


def draw_pin_icon(draw, x, y, size=18, color=GOLD):
    c = (*color, 255)
    # circle top
    draw.ellipse([(x + 3, y), (x + size - 3, y + size - 6)], outline=c, width=2)
    # inner dot
    draw.ellipse([(x + size // 2 - 2, y + 5), (x + size // 2 + 2, y + 9)], fill=c)
    # point
    draw.polygon([(x + size // 2, y + size), (x + 5, y + size - 8), (x + size - 5, y + size - 8)], fill=c)


def draw_phone_icon(draw, x, y, size=18, color=GOLD):
    c = (*color, 255)
    draw.rounded_rectangle(
        [(x + 4, y), (x + size - 4, y + size)], radius=2, outline=c, width=2,
    )
    draw.line([(x + 8, y + size - 4), (x + size - 8, y + size - 4)], fill=c, width=1)


def draw_globe_icon(draw, x, y, size=18, color=GOLD):
    c = (*color, 255)
    draw.ellipse([(x, y), (x + size, y + size)], outline=c, width=2)
    # latitude/longitude lines
    draw.line([(x, y + size // 2), (x + size, y + size // 2)], fill=c, width=1)
    draw.ellipse([(x + 5, y), (x + size - 5, y + size)], outline=c, width=1)


def prep_portrait(target_h):
    """Load portrait, scale to height, fade-in soft edge on the LEFT for navy blend."""
    p = Image.open(PORTRAIT_PATH).convert("RGBA")
    # Scale to height
    ratio = target_h / p.height
    new_w = int(p.width * ratio)
    p = p.resize((new_w, target_h), Image.LANCZOS)
    # Create soft alpha mask that fades on the left
    mask = Image.new("L", p.size, 255)
    mdraw = ImageDraw.Draw(mask)
    fade_width = 200
    for i in range(fade_width):
        alpha = int((i / fade_width) * 255)
        mdraw.line([(i, 0), (i, p.height)], fill=alpha)
    # Apply mask to alpha channel
    r, g, b, existing_alpha = p.split()
    new_alpha = Image.eval(mask, lambda v: v)
    # Combine with existing alpha (multiply)
    combined_alpha = Image.eval(existing_alpha, lambda v: v)
    final_alpha = Image.new("L", p.size)
    final_alpha = Image.merge("L", [Image.eval(mask, lambda v: v)])
    # Multiply mask × existing alpha pixel-by-pixel
    from PIL import ImageChops
    combined = ImageChops.multiply(mask, existing_alpha)
    p.putalpha(combined)
    return p


def build():
    # Base navy canvas
    img = Image.new("RGBA", SIZE, NAVY + (255,))

    # ── Subtle navy ↘ darker gradient (very gentle) ──
    grad_overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad_overlay)
    for i in range(SIZE[0]):
        # gradient from left=0 to right=24 alpha black
        alpha = int((i / SIZE[0]) * 30)
        gdraw.line([(i, 0), (i, SIZE[1])], fill=(0, 0, 0, alpha))
    img = Image.alpha_composite(img, grad_overlay)

    # ── Subtle dot pattern, top-left corner ──
    dot_overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(dot_overlay)
    draw_dot_pattern(ddraw, 0, 0, 80, 220, color=(*GOLD, 90), spacing=10, dot_radius=1.2)
    img = Image.alpha_composite(img, dot_overlay)

    # ── Diagonal gold accents ──
    img = draw_diagonal_accent(img, "top_left")
    img = draw_diagonal_accent(img, "bottom_right")

    # ── Portrait on the right ──
    if os.path.exists(PORTRAIT_PATH):
        portrait_h = SIZE[1]
        portrait = prep_portrait(portrait_h)
        # Position so the figure's center sits around x=950
        portrait_x = SIZE[0] - portrait.width + 80  # nudge right edge off-canvas slightly
        # If portrait is too wide, anchor right; if too narrow, anchor right
        if portrait_x > SIZE[0] - portrait.width:
            portrait_x = SIZE[0] - portrait.width
        # Composite portrait
        img.paste(portrait, (portrait_x, 0), portrait)

    # ── Logo (left side, top) ──
    logo_h = 90
    logo = render_logo(logo_h)
    img.paste(logo, (72, 100), logo)

    # ── Tagline beneath logo ──
    draw = ImageDraw.Draw(img)
    tagline_font = load_font(32, bold=True)
    tag_x = 72
    tag_y = 230
    # Small vertical gold accent bar to the left of the tagline (survives downscaling)
    draw.rectangle([(tag_x - 14, tag_y + 4), (tag_x - 10, tag_y + 38)], fill=GOLD + (255,))
    # Tagline in WHITE for max contrast at small preview sizes (200–400px wide)
    draw.text((tag_x, tag_y), "Find it before OSHA does.", font=tagline_font, fill=WHITE + (255,))

    # ── Gold rule below tagline ──
    draw.rectangle([(tag_x, tag_y + 44), (tag_x + 80, tag_y + 48)], fill=GOLD + (255,))

    # ── Headline (the value prop) ──
    headline_font = load_font(48, bold=True)
    head_y = 300
    draw.text((72, head_y), "If OSHA Walked In Tomorrow,", font=headline_font, fill=WHITE + (255,))
    draw.text((72, head_y + 58), "Would You Pass?", font=headline_font, fill=WHITE + (255,))

    # ── Service icon row ──
    service_y = 450
    service_label_font = load_font(15, bold=True)
    services = [
        ("walkthroughs", "Walkthroughs", draw_clipboard_icon),
        ("documentation", "Documentation Reviews", draw_document_icon),
        ("incident", "Incident Reviews", draw_warning_icon),
    ]
    s_x = 72
    for key, label, icon_fn in services:
        icon_fn(draw, s_x, service_y, size=22)
        draw.text((s_x + 32, service_y + 3), label, font=service_label_font, fill=WHITE + (255,))
        # Measure to space the next group
        bbox = draw.textbbox((0, 0), label, font=service_label_font)
        s_x += 32 + (bbox[2] - bbox[0]) + 38

    # ── Bottom info bar (location, phone, web) ──
    info_y = 540
    info_label_font = load_font(15, bold=False)
    info_value_font = load_font(15, bold=True)
    i_x = 72

    # Location
    draw_pin_icon(draw, i_x, info_y - 2, size=18)
    draw.text((i_x + 28, info_y), "Serving the Piedmont Triad", font=info_label_font, fill=WHITE + (255,))
    bbox = draw.textbbox((0, 0), "Serving the Piedmont Triad", font=info_label_font)
    i_x += 28 + (bbox[2] - bbox[0]) + 30
    draw.line([(i_x - 18, info_y - 4), (i_x - 18, info_y + 24)], fill=(*GOLD, 120), width=1)

    # Phone
    draw_phone_icon(draw, i_x, info_y - 2, size=18)
    draw.text((i_x + 28, info_y), "Call/Text:", font=info_label_font, fill=WHITE + (255,))
    bbox = draw.textbbox((0, 0), "Call/Text:", font=info_label_font)
    phone_x = i_x + 28 + (bbox[2] - bbox[0]) + 5
    draw.text((phone_x, info_y), "(336) 329-8899", font=info_value_font, fill=GOLD + (255,))
    bbox = draw.textbbox((0, 0), "(336) 329-8899", font=info_value_font)
    i_x = phone_x + (bbox[2] - bbox[0]) + 30
    draw.line([(i_x - 18, info_y - 4), (i_x - 18, info_y + 24)], fill=(*GOLD, 120), width=1)

    # Web
    draw_globe_icon(draw, i_x, info_y - 2, size=18)
    draw.text((i_x + 28, info_y), "giglinecompliance.com", font=info_value_font, fill=WHITE + (255,))

    # Save
    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"✓ Generated: {OUT}")
    print(f"  Size: {os.path.getsize(OUT) / 1024:.1f} KB ({SIZE[0]}x{SIZE[1]})")


if __name__ == "__main__":
    build()
