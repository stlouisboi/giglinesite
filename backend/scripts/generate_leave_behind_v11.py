"""
GL-WEB-LB-011 — Leave-Behind Flyer (v11) — Premium Visual Redesign

A single-page printable flyer Vince leaves at front desks after a warm
follow-up (call or email exchange). Designed to feel like a $1,000 document.

Same copy as v9/v10. Visual system rebuilt against the GigLine brand:
  - Real GigLine logo in the header
  - Inter typeface family throughout
  - Navy / gold / cream brand tokens
  - Cost-of-inaction stat row above services
  - CRV row highlighted with a gold left border + cream background
  - QR/Contact block wrapped in cream panel with gold accent
  - Explicit privacy commitment in the footer

Run once:  python3 /app/backend/scripts/generate_leave_behind_v11.py
Output:    /app/backend/internal_docs/GigLine_LeaveBehind_v11.pdf
Route:     GET /api/leave-behind/v11
"""

import os
import io
from pathlib import Path

import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image,
    Table, TableStyle, KeepTogether, HRFlowable,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


# ─── Brand tokens (v11 spec) ───
NAVY = HexColor("#0B1F3A")
NAVY_MID = HexColor("#152D4F")
GOLD = HexColor("#C9A84C")
CREAM = HexColor("#F5F0E8")
CREAM_DARK = HexColor("#EDE8DC")
DARK_TEXT = HexColor("#1A1A2E")
GRAY = HexColor("#666666")


# ─── Font registration (Inter) ───
FONTS_DIR = Path("/app/backend/assets/fonts")
INTER_REG = "Inter"
INTER_SB = "Inter-SemiBold"
INTER_BLACK = "Inter-Black"
INTER_IT = "Inter-Italic"


def register_fonts():
    """Register the Inter family with reportlab. Falls back to Helvetica if missing."""
    try:
        pdfmetrics.registerFont(TTFont(INTER_REG, str(FONTS_DIR / "Inter-Regular.ttf")))
        pdfmetrics.registerFont(TTFont(INTER_SB, str(FONTS_DIR / "Inter-SemiBold.ttf")))
        pdfmetrics.registerFont(TTFont(INTER_BLACK, str(FONTS_DIR / "Inter-Black.ttf")))
        pdfmetrics.registerFont(TTFont(INTER_IT, str(FONTS_DIR / "Inter-Italic.ttf")))
        return True
    except Exception as e:
        print(f"WARN: Inter fonts not loaded ({e}). Using Helvetica fallback.")
        return False


# ─── Paths ───
LOGO_PATH = "/app/frontend/public/gigline-logo-2026-v2.png"
OUT_DIR = "/app/backend/internal_docs"
OUT_PATH = os.path.join(OUT_DIR, "GigLine_LeaveBehind_v11.pdf")
os.makedirs(OUT_DIR, exist_ok=True)

QR_TARGET = (
    "https://giglinecompliance.com/walkthrough"
    "?utm_source=doorknock&utm_medium=doorknock&utm_campaign=leave-behind-v11"
)


def make_qr_image(url: str, size_inches: float = 1.25) -> Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B1F3A", back_color="#F5F0E8")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return Image(buf, width=size_inches * inch, height=size_inches * inch)


def build():
    have_inter = register_fonts()
    F_BODY = INTER_REG if have_inter else "Helvetica"
    F_SB = INTER_SB if have_inter else "Helvetica-Bold"
    F_BLACK = INTER_BLACK if have_inter else "Helvetica-Bold"
    F_IT = INTER_IT if have_inter else "Helvetica-Oblique"

    # ─── Styles ───
    style = {
        "byline": ParagraphStyle(
            "byline", fontName=F_SB, fontSize=7.5, leading=10,
            textColor=GOLD, alignment=TA_LEFT, spaceAfter=6,
        ),
        "headline": ParagraphStyle(
            "headline", fontName=F_BLACK, fontSize=26, leading=29,
            textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=8,
        ),
        "intro": ParagraphStyle(
            "intro", fontName=F_BODY, fontSize=9.5, leading=13.5,
            textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=8,
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName=F_BODY, fontSize=9, leading=13,
            textColor=DARK_TEXT, alignment=TA_LEFT, leftIndent=12, spaceAfter=3,
        ),
        "section_label": ParagraphStyle(
            "section_label", fontName=F_SB, fontSize=7, leading=10,
            textColor=GOLD, alignment=TA_LEFT, spaceAfter=4,
        ),
        "svc_name": ParagraphStyle(
            "svc_name", fontName=F_SB, fontSize=9.5, leading=12,
            textColor=DARK_TEXT, alignment=TA_LEFT,
        ),
        "svc_desc": ParagraphStyle(
            "svc_desc", fontName=F_BODY, fontSize=8, leading=12,
            textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=0,
        ),
        "svc_price": ParagraphStyle(
            "svc_price", fontName=F_BLACK, fontSize=9.5, leading=12,
            textColor=GOLD, alignment=TA_RIGHT,
        ),
        "fixed_quote_note": ParagraphStyle(
            "fixed_quote_note", fontName=F_IT, fontSize=7.5, leading=10,
            textColor=GRAY, alignment=TA_LEFT, spaceBefore=3, spaceAfter=2,
        ),
        # Cost-of-inaction
        "coi_value": ParagraphStyle(
            "coi_value", fontName=F_BLACK, fontSize=18, leading=20,
            textColor=GOLD, alignment=TA_CENTER, spaceAfter=2,
        ),
        "coi_label": ParagraphStyle(
            "coi_label", fontName=F_BODY, fontSize=7.5, leading=10,
            textColor=white, alignment=TA_CENTER,
        ),
        "coi_caption": ParagraphStyle(
            "coi_caption", fontName=F_IT, fontSize=7.5, leading=10,
            textColor=DARK_TEXT, alignment=TA_CENTER, spaceBefore=4, spaceAfter=2,
        ),
        # Three ways panel
        "ways_title": ParagraphStyle(
            "ways_title", fontName=F_SB, fontSize=9, leading=12,
            textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=4,
        ),
        "ways_item": ParagraphStyle(
            "ways_item", fontName=F_BODY, fontSize=8.5, leading=12,
            textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=2,
        ),
        "ways_micro": ParagraphStyle(
            "ways_micro", fontName=F_IT, fontSize=7.5, leading=10,
            textColor=GRAY, alignment=TA_LEFT, spaceBefore=3,
        ),
        "qr_label": ParagraphStyle(
            "qr_label", fontName=F_SB, fontSize=6.5, leading=8,
            textColor=GOLD, alignment=TA_CENTER, spaceBefore=3,
        ),
        # Footer
        "creds": ParagraphStyle(
            "creds", fontName=F_BODY, fontSize=7.5, leading=10,
            textColor=DARK_TEXT, alignment=TA_CENTER, spaceAfter=3,
        ),
        "privacy": ParagraphStyle(
            "privacy", fontName=F_IT, fontSize=6.5, leading=9,
            textColor=GRAY, alignment=TA_CENTER, spaceAfter=2,
        ),
        "disclaimer": ParagraphStyle(
            "disclaimer", fontName=F_IT, fontSize=6.5, leading=9,
            textColor=GRAY, alignment=TA_CENTER, spaceAfter=0,
        ),
        "header_phone": ParagraphStyle(
            "header_phone", fontName=F_SB, fontSize=9, leading=11,
            textColor=DARK_TEXT, alignment=TA_RIGHT,
        ),
        "header_url": ParagraphStyle(
            "header_url", fontName=F_BODY, fontSize=8, leading=10,
            textColor=GOLD, alignment=TA_RIGHT,
        ),
    }

    # ─── Document ───
    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.5 * inch,
        title="GigLine Safety & Compliance — Leave-Behind v11",
        author="Vince Lawrence",
        subject="Leave-Behind v11 — Premium Visual Redesign",
    )

    story = []
    content_width = letter[0] - (1.2 * inch)  # 7.3" usable width

    # ─────────────────────────────
    #  HEADER — Logo (left) + Phone/URL (right)
    # ─────────────────────────────
    logo = Image(LOGO_PATH, width=1.7 * inch, height=1.7 * (497 / 1041) * inch)
    header_right = [
        Paragraph("(336) 329-8899", style["header_phone"]),
        Paragraph("giglinecompliance.com", style["header_url"]),
    ]
    header_table = Table(
        [[logo, header_right]],
        colWidths=[2.0 * inch, content_width - 2.0 * inch],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    )
    story.append(header_table)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.75, color=GOLD, spaceBefore=0, spaceAfter=6))

    # ─────────────────────────────
    #  BYLINE
    # ─────────────────────────────
    story.append(Paragraph("LEFT BY VINCE LAWRENCE — FOUNDER", style["byline"]))

    # ─────────────────────────────
    #  HEADLINE
    # ─────────────────────────────
    story.append(Paragraph("Sorry we missed you.", style["headline"]))

    # ─────────────────────────────
    #  INTRO PARAGRAPH (single condensed paragraph carrying v9 substance)
    # ─────────────────────────────
    story.append(Paragraph(
        'I stopped by to introduce GigLine — a Carolina-built safety consulting practice for '
        'small manufacturing, warehouse, and contractor operations in the Triad. I walk your facility '
        'the way an OSHA inspector would and put what I find in writing within 48 hours. CFR-cited. '
        'Photo-documented. Prioritized corrective action plan. Yours to keep. One engagement, no retainer, '
        'everything stays private.',
        style["intro"],
    ))

    # ─────────────────────────────
    #  THREE BULLETS
    # ─────────────────────────────
    bullets = [
        "On the floor — not just in your inbox",
        "Findings ranked by penalty exposure, not opinion",
        "25+ years inside manufacturing and warehousing",
    ]
    for b in bullets:
        story.append(Paragraph(
            f'<font color="#C9A84C">■</font>&nbsp;&nbsp;{b}',
            style["bullet"],
        ))

    story.append(Spacer(1, 7))

    # ─────────────────────────────
    #  COST-OF-INACTION STAT ROW
    # ─────────────────────────────
    def coi_cell(value, label):
        return [
            Paragraph(value, style["coi_value"]),
            Paragraph(label.upper(), style["coi_label"]),
        ]

    col_w = content_width / 3.0
    coi_table = Table(
        [[coi_cell("$16,550", "Max serious violation"),
          coi_cell("$165,514", "Willful or repeat violation"),
          coi_cell("$2,000", "Compliance Readiness Visit")]],
        colWidths=[col_w, col_w, col_w],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), NAVY),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            # Gold dividers between columns
            ("LINEAFTER", (0, 0), (0, 0), 0.5, GOLD),
            ("LINEAFTER", (1, 0), (1, 0), 0.5, GOLD),
        ]),
    )
    story.append(coi_table)
    story.append(Paragraph(
        '<i>"The CRV costs $2,000 and takes one visit. A single serious citation costs more."</i>',
        style["coi_caption"],
    ))

    story.append(Spacer(1, 6))

    # ─────────────────────────────
    #  SERVICES SECTION
    # ─────────────────────────────
    story.append(Paragraph("SERVICES &amp; STARTING PRICES", style["section_label"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceBefore=0, spaceAfter=6))

    svc_rows = [
        {
            "name": "Safety Walkthrough",
            "price": "Starting at $1,200",
            "desc": "Floor walkthrough, written report in 48 hours. Best when you want fresh eyes on the floor.",
            "highlight": False,
        },
        {
            "name": "Compliance Readiness Visit",
            "price": "Starting at $2,000",
            "desc": "Floor + files. Reviews written programs, training records, OSHA 300 log, and HazCom binder. Includes the Supervisor Safety Starter System.",
            "highlight": True,
        },
        {
            "name": "Supervisor Safety Starter System",
            "price": "$600 digital · $675 physical",
            "desc": '11 CFR-cited documents. Written HazCom program, SDS index, training log, inspection checklist, "If OSHA Shows Up" protocol. Standalone product.',
            "highlight": False,
        },
        {
            "name": "Incident Review &amp; Corrective Action",
            "price": "Starting at $1,500",
            "desc": "After an event. Documents what happened, what caused it, and what to do next. Filed correctly.",
            "highlight": False,
        },
    ]

    for svc in svc_rows:
        star = '&nbsp;<font color="#C9A84C">&#9733;</font>' if svc["highlight"] else ""
        row = Table(
            [[
                [Paragraph(f'{svc["name"]}{star}', style["svc_name"]),
                 Paragraph(svc["desc"], style["svc_desc"])],
                Paragraph(svc["price"], style["svc_price"]),
            ]],
            colWidths=[content_width - 1.7 * inch, 1.7 * inch],
            style=TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10 if svc["highlight"] else 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8 if svc["highlight"] else 0),
                ("TOPPADDING", (0, 0), (-1, -1), 6 if svc["highlight"] else 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6 if svc["highlight"] else 3),
                ("BACKGROUND", (0, 0), (-1, -1), CREAM if svc["highlight"] else white),
                ("LINEBEFORE", (0, 0), (0, -1), 2 if svc["highlight"] else 0, GOLD),
                ("LINEBELOW", (0, 0), (-1, -1), 0.25, CREAM_DARK),
            ]),
        )
        story.append(row)

    story.append(Paragraph(
        "Fixed quote before scheduling. No hourly billing. No estimate ranges.",
        style["fixed_quote_note"],
    ))

    story.append(Spacer(1, 6))

    # ─────────────────────────────
    #  THREE WAYS TO START — Cream panel with gold left border
    # ─────────────────────────────
    ways_title_p = Paragraph("Three ways to start the conversation:", style["ways_title"])
    ways_items = [
        Paragraph('<b>1.</b>&nbsp;&nbsp;Scan the QR &rarr; request a walkthrough online (60 seconds, no obligation)', style["ways_item"]),
        Paragraph('<b>2.</b>&nbsp;&nbsp;Call or text <b>(336) 329-8899</b> — Vince picks up', style["ways_item"]),
        Paragraph('<b>3.</b>&nbsp;&nbsp;Email <b>vince@giglinecompliance.com</b> with what you want a fresh set of eyes on', style["ways_item"]),
        Paragraph("I'll respond same day. Quote before scheduling. Everything stays private.", style["ways_micro"]),
    ]
    ways_left = [ways_title_p] + ways_items

    qr_img = make_qr_image(QR_TARGET, size_inches=1.2)
    qr_block = [
        qr_img,
        Paragraph("SCAN TO REQUEST A VISIT", style["qr_label"]),
    ]

    panel = Table(
        [[ways_left, qr_block]],
        colWidths=[content_width - 1.7 * inch, 1.7 * inch],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), CREAM),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 14),
            ("RIGHTPADDING", (0, 0), (-1, -1), 14),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LINEBEFORE", (0, 0), (0, -1), 1, GOLD),
        ]),
    )
    story.append(KeepTogether(panel))

    story.append(Spacer(1, 5))

    # ─────────────────────────────
    #  FOOTER — credentials, privacy, disclaimer
    # ─────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceBefore=0, spaceAfter=4))
    story.append(Paragraph(
        '<b>Vince Lawrence</b> &middot; Founder, GigLine Safety &amp; Compliance &middot; '
        'OSHA 30-Hour Certified &middot; U.S. Navy Veteran &middot; '
        '25+ years in MFG / WHSE / Transportation',
        style["creds"],
    ))
    story.append(Paragraph(
        '<i>"All engagements are private — findings are never shared, published, or referenced '
        'without your written permission."</i>',
        style["privacy"],
    ))
    story.append(Paragraph(
        "Pricing reflects 2026 standard engagement rates. Fixed quote provided after scoping. "
        "GigLine Safety &amp; Compliance is an independent consulting practice and does not represent OSHA. "
        "&copy; 2026 GigLine Safety &amp; Compliance LLC. &middot; Leave-Behind v11",
        style["disclaimer"],
    ))

    doc.build(story)
    print(f"PDF written: {OUT_PATH}")
    print(f"QR target: {QR_TARGET}")
    print(f"Inter fonts used: {have_inter}")


if __name__ == "__main__":
    build()
