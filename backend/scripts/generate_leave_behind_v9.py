"""
GL-WEB-LB-009 — Leave-Behind Flyer (v9)

A single-page printable flyer Vince leaves at front desks during cold knocks.
Designed to be readable from arm's length, with a QR code routing to the
`/walkthrough` landing page (already wired with utm_source=doorknock).

Run once:  python3 /app/backend/scripts/generate_leave_behind_v9.py
Output:    /app/backend/internal_docs/GigLine_LeaveBehind_v9.pdf

Pricing (Feb 2026, verified against /services live page):
  - Safety Walkthrough          starting at $1,200
  - Compliance Readiness Visit  starting at $2,000
  - Supervisor Safety Starter   $600 digital · $675 physical
"""

import os
import io

import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Image,
    Table, TableStyle, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── Site palette ──
NAVY = HexColor("#0A1628")
GOLD = HexColor("#C5A059")
CREAM = HexColor("#FAF7F1")
PANEL = HexColor("#F3ECDB")
BORDER = HexColor("#E5DDCD")
CHARCOAL = HexColor("#1C2B2B")
MID_GRAY = HexColor("#6B7280")

OUT_DIR = "/app/backend/internal_docs"
OUT_PATH = os.path.join(OUT_DIR, "GigLine_LeaveBehind_v9.pdf")
os.makedirs(OUT_DIR, exist_ok=True)

QR_TARGET = (
    "https://giglinecompliance.com/walkthrough"
    "?utm_source=doorknock&utm_medium=doorknock&utm_campaign=leave-behind-v9"
)


# ── Styles ──
def make_styles():
    return {
        "eyebrow": ParagraphStyle(
            "eyebrow", fontName="Helvetica-Bold", fontSize=9, leading=12,
            textColor=GOLD, spaceAfter=4, alignment=TA_LEFT,
        ),
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=26, leading=30,
            textColor=NAVY, spaceAfter=8, alignment=TA_LEFT,
        ),
        "lede": ParagraphStyle(
            "lede", fontName="Helvetica", fontSize=11, leading=14.5,
            textColor=CHARCOAL, spaceAfter=10, alignment=TA_LEFT,
        ),
        "section": ParagraphStyle(
            "section", fontName="Helvetica-Bold", fontSize=11, leading=13,
            textColor=NAVY, spaceBefore=8, spaceAfter=4, alignment=TA_LEFT,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=10, leading=13,
            textColor=CHARCOAL, spaceAfter=3, alignment=TA_LEFT,
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName="Helvetica", fontSize=10, leading=13,
            textColor=CHARCOAL, leftIndent=14, spaceAfter=2, alignment=TA_LEFT,
            bulletIndent=0,
        ),
        "service_label": ParagraphStyle(
            "service_label", fontName="Helvetica-Bold", fontSize=10.5, leading=13,
            textColor=NAVY, alignment=TA_LEFT,
        ),
        "service_price": ParagraphStyle(
            "service_price", fontName="Helvetica-Bold", fontSize=10.5, leading=13,
            textColor=GOLD, alignment=TA_RIGHT,
        ),
        "service_desc": ParagraphStyle(
            "service_desc", fontName="Helvetica", fontSize=9.5, leading=12,
            textColor=MID_GRAY, alignment=TA_LEFT,
        ),
        "qr_label": ParagraphStyle(
            "qr_label", fontName="Helvetica-Bold", fontSize=9, leading=12,
            textColor=GOLD, alignment=TA_CENTER, spaceAfter=2,
        ),
        "qr_url": ParagraphStyle(
            "qr_url", fontName="Helvetica", fontSize=8.5, leading=11,
            textColor=CHARCOAL, alignment=TA_CENTER,
        ),
        "footer_name": ParagraphStyle(
            "footer_name", fontName="Helvetica-Bold", fontSize=11, leading=14,
            textColor=NAVY, alignment=TA_LEFT,
        ),
        "footer_meta": ParagraphStyle(
            "footer_meta", fontName="Helvetica", fontSize=9.5, leading=12.5,
            textColor=CHARCOAL, alignment=TA_LEFT, spaceAfter=2,
        ),
        "footer_fine": ParagraphStyle(
            "footer_fine", fontName="Helvetica-Oblique", fontSize=8, leading=10,
            textColor=MID_GRAY, alignment=TA_CENTER,
        ),
    }


def make_qr_image_flowable(url: str, size_inches: float = 1.5) -> Image:
    """Generate a QR code PNG in-memory and return as a Platypus Image."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0A1628", back_color="#FAF7F1")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return Image(buf, width=size_inches * inch, height=size_inches * inch)


def build():
    s = make_styles()

    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=letter,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.4 * inch,
        title="GigLine Safety & Compliance — Leave-Behind v9",
        author="Vince Lawrence",
    )

    story = []

    # ────────────────────────────────────────────────
    #  HEADER BAND — full-width navy block w/ gold accent
    # ────────────────────────────────────────────────
    header_left = Paragraph(
        '<font color="#C5A059"><b>GIGLINE</b></font>'
        '<font color="#FFFFFF"><b>&nbsp;&nbsp;SAFETY &amp; COMPLIANCE</b></font>',
        ParagraphStyle("hdr", fontName="Helvetica-Bold", fontSize=14, leading=18,
                       textColor=white, alignment=TA_LEFT),
    )
    header_right = Paragraph(
        '<font color="#FFFFFF">(336) 329-8899</font><br/>'
        '<font color="#FFFFFF" size="8">VETERAN-OWNED · KERNERSVILLE, NC</font>',
        ParagraphStyle("hdr_r", fontName="Helvetica", fontSize=10, leading=13,
                       textColor=white, alignment=TA_RIGHT),
    )
    header = Table(
        [[header_left, header_right]],
        colWidths=[4.2 * inch, 3.2 * inch],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), NAVY),
            ("LEFTPADDING", (0, 0), (-1, -1), 14),
            ("RIGHTPADDING", (0, 0), (-1, -1), 14),
            ("TOPPADDING", (0, 0), (-1, -1), 12),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LINEBELOW", (0, -1), (-1, -1), 2.5, GOLD),
        ]),
    )
    story.append(header)
    story.append(Spacer(1, 10))

    # ────────────────────────────────────────────────
    #  HEADLINE BLOCK
    # ────────────────────────────────────────────────
    story.append(Paragraph("LEFT BY VINCE LAWRENCE &mdash; FOUNDER", s["eyebrow"]))
    story.append(Paragraph(
        "Sorry we missed you.",
        s["title"],
    ))
    story.append(Paragraph(
        'I stopped by to introduce GigLine &mdash; a Carolina-built safety consulting practice for small '
        'manufacturing, warehouse, and contractor operations in the Triad. I walk your facility the way an '
        'OSHA inspector would and put what I find in writing within 48 hours. CFR-cited. Photo-documented. '
        'Prioritized corrective action plan. Yours to keep. One engagement, no retainer, everything stays private.',
        s["lede"],
    ))

    story.append(Spacer(1, 2))
    bullets = [
        "On the floor &mdash; not just in your inbox",
        "Findings ranked by penalty exposure, not opinion",
        "25+ years inside manufacturing and warehousing",
    ]
    for b in bullets:
        story.append(Paragraph(f'<font color="#C5A059">&#9632;</font>&nbsp;&nbsp;{b}', s["bullet"]))

    story.append(Spacer(1, 4))

    # ────────────────────────────────────────────────
    #  SERVICES + PRICING TABLE
    # ────────────────────────────────────────────────
    story.append(Paragraph("SERVICES &amp; STARTING PRICES", s["section"]))

    svc_rows = [
        ("Safety Walkthrough", "Starting at $1,200",
         "Floor walkthrough, written report in 48 hours. Best when you want fresh eyes on the floor."),
        ("Compliance Readiness Visit", "Starting at $2,000",
         "Floor + files. Reviews written programs, training records, OSHA 300 log, and HazCom binder. Includes the Supervisor Safety Starter System."),
        ("Supervisor Safety Starter System", "$600 digital · $675 physical",
         "11 CFR-cited documents. Written HazCom program, SDS index, training log, inspection checklist, \"If OSHA Shows Up\" protocol. Standalone product."),
        ("Incident Review &amp; Corrective Action", "Starting at $1,500",
         "After an event. Documents what happened, what caused it, and what to do next. Filed correctly."),
    ]
    table_data = []
    for label, price, desc in svc_rows:
        table_data.append([
            Paragraph(label, s["service_label"]),
            Paragraph(price, s["service_price"]),
        ])
        table_data.append([
            Paragraph(desc, s["service_desc"]),
            "",
        ])

    svc_table = Table(
        table_data,
        colWidths=[4.6 * inch, 2.8 * inch],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            # row separators after each service (every 2 rows)
            ("LINEBELOW", (0, 1), (-1, 1), 0.5, BORDER),
            ("LINEBELOW", (0, 3), (-1, 3), 0.5, BORDER),
            ("LINEBELOW", (0, 5), (-1, 5), 0.5, BORDER),
        ]),
    )
    story.append(svc_table)
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Fixed quote before scheduling. No hourly billing. No estimate ranges.",
        ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=9, leading=12,
                       textColor=MID_GRAY, alignment=TA_LEFT, spaceAfter=8),
    ))

    story.append(Spacer(1, 10))

    # ────────────────────────────────────────────────
    #  QR + CALL-TO-ACTION ROW — single panel
    # ────────────────────────────────────────────────
    qr_img = make_qr_image_flowable(QR_TARGET, size_inches=1.35)
    qr_cell = [
        qr_img,
        Spacer(1, 4),
        Paragraph("SCAN TO REQUEST A VISIT", s["qr_label"]),
        Paragraph("giglinecompliance.com/walkthrough", s["qr_url"]),
    ]

    cta_text = Paragraph(
        '<font color="#0A1628"><b>Three ways to start the conversation:</b></font><br/><br/>'
        '<font color="#1C2B2B"><b>1.</b> Scan the QR &rarr; request a walkthrough online (60 seconds, no obligation)</font><br/>'
        '<font color="#1C2B2B"><b>2.</b> Call or text <b>(336) 329-8899</b> &mdash; Vince picks up</font><br/>'
        '<font color="#1C2B2B"><b>3.</b> Email <b>vince@giglinecompliance.com</b> with what you want a fresh set of eyes on</font><br/><br/>'
        '<font color="#6B7280" size="9"><i>I&rsquo;ll respond same day. Quote before scheduling. Everything stays private.</i></font>',
        ParagraphStyle("cta", fontName="Helvetica", fontSize=10.5, leading=14.5,
                       textColor=CHARCOAL, alignment=TA_LEFT),
    )

    cta_table = Table(
        [[qr_cell, cta_text]],
        colWidths=[1.9 * inch, 5.5 * inch],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PANEL),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 16),
            ("RIGHTPADDING", (0, 0), (-1, -1), 16),
            ("TOPPADDING", (0, 0), (-1, -1), 14),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ("BOX", (0, 0), (-1, -1), 0.75, BORDER),
            ("LINEBEFORE", (0, 0), (0, -1), 3, GOLD),
        ]),
    )
    story.append(KeepTogether(cta_table))

    story.append(Spacer(1, 6))

    # ────────────────────────────────────────────────
    #  FOOTER — credentials byline + fine print (contact info in header + CTA panel)
    # ────────────────────────────────────────────────
    story.append(Paragraph(
        '<b>Vince Lawrence</b> &middot; Founder, GigLine Safety &amp; Compliance &middot; '
        'OSHA 30-Hour Certified &middot; U.S. Navy Veteran &middot; '
        '25+ years in MFG / WHSE / Transportation',
        ParagraphStyle("creds", fontName="Helvetica", fontSize=9, leading=11,
                       textColor=CHARCOAL, alignment=TA_CENTER, spaceAfter=4),
    ))
    story.append(Paragraph(
        "Pricing reflects 2026 standard engagement rates. Fixed quote provided after scoping. "
        "GigLine Safety &amp; Compliance is an independent consulting practice and does not represent OSHA. "
        "&copy; 2026 GigLine Safety &amp; Compliance LLC.",
        s["footer_fine"],
    ))

    doc.build(story)
    print(f"PDF written: {OUT_PATH}")
    print(f"Pages: 1 (letter)")
    print(f"QR target: {QR_TARGET}")


if __name__ == "__main__":
    build()
