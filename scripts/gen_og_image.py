"""Editorial OG image: photo-forward, magazine-cover aesthetic.

Design principles chosen to avoid the "AI-generated card" look:
 - Real photograph of a real person as the primary visual, not clip-art
 - Asymmetric split (photo left, quiet type panel right), not centered grid
 - Editorial serif italic headline in muted cream, not saturated white/gold
 - One hairline gold rule as the only ornament
 - Restrained mono type at eyebrow + kicker, generous negative space
 - Subtle film-grain overlay for print-editorial feel
 - No stylized shield, no checkmark glyph, no gradient background trick

Output: /app/frontend/public/og-image.png (1200x630, PNG)
"""

import os
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ── Canvas ──
W, H = 1200, 630
SPLIT_X = 720   # 60% photo / 40% type panel

# ── Palette (muted, editorial) ──
NAVY_DEEP = (10, 22, 40)      # #0A1628
NAVY_INK = (16, 32, 55)       # slightly warmer navy for panel
CREAM = (238, 232, 219)       # #EEE8DB, warm cream (not bright white)
CREAM_SOFT = (208, 202, 189)  # dimmer cream for kicker
GOLD_AGED = (176, 143, 68)    # aged gold, less saturated than #C9A84C

# ── Fonts (Liberation is metrically compatible with Georgia/Courier/etc.) ──
SERIF_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf"
SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"
MONO_REG = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"

# ── Left panel: cropped photograph of Vince ──
photo_src = Image.open("/app/frontend/public/vince-inspecting.webp").convert("RGB")
pw, ph = photo_src.size  # 1024 x 1536, portrait

# Crop a landscape band from the photo that keeps the subject.
# Target aspect: 720/630 = 1.1429. In source (1024 wide), matching height = 1024/1.1429 = 896.
target_h_in_src = int(pw / (SPLIT_X / H))  # 896
# Start crop slightly above the vertical middle to keep Vince's head + clipboard.
top = max(0, int(ph * 0.20))
if top + target_h_in_src > ph:
    top = ph - target_h_in_src
photo_crop = photo_src.crop((0, top, pw, top + target_h_in_src))
# Resize to left-panel size.
photo_panel = photo_crop.resize((SPLIT_X, H), Image.LANCZOS)

# ── Composite canvas ──
img = Image.new("RGB", (W, H), NAVY_INK)
img.paste(photo_panel, (0, 0))

# ── Soft navy vignette at the right edge of the photo so it blends into type panel ──
vignette = Image.new("RGBA", (SPLIT_X, H), (0, 0, 0, 0))
vg = ImageDraw.Draw(vignette)
for i in range(140):
    alpha = int(255 * (i / 140))
    vg.line([(SPLIT_X - 140 + i, 0), (SPLIT_X - 140 + i, H)],
            fill=(NAVY_INK[0], NAVY_INK[1], NAVY_INK[2], alpha))
img.paste(vignette, (0, 0), vignette)

# ── Right panel: solid navy ink ──
draw = ImageDraw.Draw(img)
draw.rectangle([(SPLIT_X, 0), (W, H)], fill=NAVY_INK)

# ── Editorial typography, right panel ──
PADDING_L = SPLIT_X + 44
PADDING_R = W - 44

# 1) Kicker at top: tiny mono, aged gold
kicker_font = ImageFont.truetype(MONO_BOLD, 15)
draw.text((PADDING_L, 60), "GIGLINE  SAFETY  &  COMPLIANCE",
          font=kicker_font, fill=GOLD_AGED)

# 2) Short hairline rule under kicker
draw.rectangle([(PADDING_L, 88), (PADDING_L + 42, 89)], fill=GOLD_AGED)

# 3) Serif italic headline, three deliberate lines
headline_font = ImageFont.truetype(SERIF_ITALIC, 66)
# Vertical stacking with generous leading. Position near vertical middle of panel.
lines = ["Find the gaps", "before OSHA", "does."]
y = 200
for line in lines:
    draw.text((PADDING_L, y), line, font=headline_font, fill=CREAM)
    y += 78

# 4) Kicker at bottom: locale in mono, dimmed cream
sub_font = ImageFont.truetype(MONO_REG, 13)
draw.text((PADDING_L, H - 90), "PIEDMONT  TRIAD  ·  NORTH  CAROLINA",
          font=sub_font, fill=CREAM_SOFT)

# 5) Domain footer, tiny mono, aged gold
domain_font = ImageFont.truetype(MONO_BOLD, 14)
draw.text((PADDING_L, H - 60), "GIGLINECOMPLIANCE.COM",
          font=domain_font, fill=GOLD_AGED)

# ── Subtle film-grain overlay across the whole image (2-3% opacity noise) ──
grain = Image.new("L", (W, H))
gpx = grain.load()
random.seed(7)
for x in range(W):
    for y in range(H):
        # Slight symmetric noise so it looks like film grain, not TV static
        gpx[x, y] = 128 + random.randint(-14, 14)
grain = grain.filter(ImageFilter.GaussianBlur(radius=0.4))
grain_rgb = Image.merge("RGB", (grain, grain, grain))
img = Image.blend(img, grain_rgb, 0.05)

# ── Save ──
out = "/app/frontend/public/og-image.png"
img.save(out, "PNG", optimize=True)
print(f"Saved {out} ({os.path.getsize(out) / 1024:.1f} KB)")
