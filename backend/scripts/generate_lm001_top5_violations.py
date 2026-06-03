"""
GL-LM-001 — Top 5 OSHA Violations Lead Magnet PDF generator.

Produces a single-page letter-size PDF (8.5x11), branded, print-ready.

Run:    python3 /app/backend/scripts/generate_lm001_top5_violations.py
Output:
    /app/frontend/public/assets/gl-lm-001-digital.pdf   (RGB, hyperlinked)
    /app/backend/internal_docs/GL-LM-001-print.pdf      (RGB; convertible to CMYK in Acrobat)

Brand: GigLine gold accent + dark navy. Content per spec GL-LM-001 v1.0 (June 3, 2026).
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ── Brand colors (per spec — gold #B8963E) ──
NAVY = HexColor("#0A1628")
SOFT_NAVY = HexColor("#15233D")
GOLD = HexColor("#B8963E")
GOLD_SOFT = HexColor("#E8D7A1")
INK = HexColor("#0A1628")
INK_MUTED = HexColor("#3A4960")
INK_SUBTLE = HexColor("#6B7280")
CREAM = HexColor("#FAF7F1")
BORDER = HexColor("#D9CFB8")
WHITE = white

DIGITAL_OUT = "/app/frontend/public/assets/gl-lm-001-digital.pdf"
PRINT_OUT = "/app/backend/internal_docs/GL-LM-001-print.pdf"

os.makedirs(os.path.dirname(DIGITAL_OUT), exist_ok=True)
os.makedirs(os.path.dirname(PRINT_OUT), exist_ok=True)

# ── Typography ──
S = {
    "brandwordmark": ParagraphStyle(
        "brandwordmark", fontName="Helvetica-Bold", fontSize=15, leading=18,
        textColor=WHITE, spaceAfter=0,
    ),
    "brandtagline": ParagraphStyle(
        "brandtagline", fontName="Helvetica-Oblique", fontSize=8, leading=10,
        textColor=GOLD, spaceAfter=0, letterSpacing=0.6,
    ),
    "title_kicker": ParagraphStyle(
        "title_kicker", fontName="Helvetica-Bold", fontSize=8, leading=10,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=6,
    ),
    "title": ParagraphStyle(
        "title", fontName="Helvetica-Bold", fontSize=15, leading=18,
        textColor=INK, alignment=TA_CENTER, spaceAfter=4,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Helvetica-Oblique", fontSize=9.5, leading=12,
        textColor=INK_MUTED, alignment=TA_CENTER, spaceAfter=10,
    ),
    "intro": ParagraphStyle(
        "intro", fontName="Helvetica", fontSize=8.5, leading=11.5,
        textColor=INK_MUTED, alignment=TA_LEFT, spaceAfter=0,
    ),
    "v_label": ParagraphStyle(
        "v_label", fontName="Helvetica-Bold", fontSize=7, leading=9,
        textColor=GOLD, spaceAfter=2,
    ),
    "v_title": ParagraphStyle(
        "v_title", fontName="Helvetica-Bold", fontSize=10, leading=12,
        textColor=INK, spaceAfter=2,
    ),
    "v_meta_label": ParagraphStyle(
        "v_meta_label", fontName="Helvetica-Bold", fontSize=6.6, leading=8,
        textColor=INK_SUBTLE, spaceAfter=0,
    ),
    "v_meta": ParagraphStyle(
        "v_meta", fontName="Helvetica", fontSize=7.4, leading=9,
        textColor=INK, spaceAfter=2,
    ),
    "v_body_label": ParagraphStyle(
        "v_body_label", fontName="Helvetica-Bold", fontSize=6.8, leading=8,
        textColor=GOLD, spaceAfter=1,
    ),
    "v_body": ParagraphStyle(
        "v_body", fontName="Helvetica", fontSize=7.6, leading=10,
        textColor=INK_MUTED, spaceAfter=3,
    ),
    "footer_cta": ParagraphStyle(
        "footer_cta", fontName="Helvetica", fontSize=8.5, leading=11,
        textColor=WHITE, alignment=TA_CENTER, spaceAfter=4,
    ),
    "footer_cta_link": ParagraphStyle(
        "footer_cta_link", fontName="Helvetica-Bold", fontSize=10, leading=12,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=2,
    ),
    "footer_contact": ParagraphStyle(
        "footer_contact", fontName="Helvetica", fontSize=7.5, leading=10,
        textColor=WHITE, alignment=TA_CENTER, spaceAfter=2,
    ),
    "footer_promise": ParagraphStyle(
        "footer_promise", fontName="Helvetica-Bold", fontSize=8, leading=10,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=4,
    ),
    "disclaimer": ParagraphStyle(
        "disclaimer", fontName="Helvetica-Oblique", fontSize=6.4, leading=8,
        textColor=HexColor("#9BA3B0"), alignment=TA_CENTER, spaceAfter=0,
    ),
    "copyright": ParagraphStyle(
        "copyright", fontName="Helvetica", fontSize=6.2, leading=7,
        textColor=HexColor("#9BA3B0"), alignment=TA_CENTER, spaceAfter=0,
    ),
}

# ── Spec content (verbatim per GL-LM-001 v1.0) ──
VIOLATIONS = [
    {
        "n": "01",
        "name": "Hazard Communication",
        "subtitle": "Lack of Written Program or Incomplete SDS Access",
        "citation": "29 CFR 1910.1200 (General Industry) / 29 CFR 1926.59 (Construction)",
        "penalty": "$1,190–$16,131 per violation (serious); up to $161,323 per instance (willful/repeat)",
        "looks": "No written HazCom program on file, chemical containers missing labels, or Safety Data Sheets not accessible to employees at the point of use.",
        "fix": "Written HazCom program, complete SDS binder or digital access at each work area, labeled containers.",
    },
    {
        "n": "02",
        "name": "Lockout/Tagout",
        "subtitle": "Inadequate Energy Control Program",
        "citation": "29 CFR 1910.147",
        "penalty": "$1,190–$16,131 per violation (serious); up to $161,323 (willful/repeat)",
        "looks": "No written LOTO program, missing machine-specific procedures, employees not trained, or LOTO hardware not provided.",
        "fix": "Written energy control program with machine-specific procedures, annual inspections documented, employees trained and records on file.",
    },
    {
        "n": "03",
        "name": "Forklift / Powered Industrial Truck",
        "subtitle": "Operator Training Not Documented",
        "citation": "29 CFR 1910.178(l)",
        "penalty": "$1,190–$16,131 per operator per violation",
        "looks": "Operators running forklifts or pallet jacks with no training certification on file, no documented evaluation, or training records older than 3 years without refresher documentation.",
        "fix": "Formal operator training with written evaluation records, refresher training triggered by observed unsafe operation or near-miss incidents.",
    },
    {
        "n": "04",
        "name": "Walking & Working Surfaces",
        "subtitle": "Floor Hazards and Housekeeping Deficiencies",
        "citation": "29 CFR 1910.22 / 29 CFR 1910.23",
        "penalty": "$1,190–$16,131 per citation",
        "looks": "Cluttered aisles, unguarded floor openings or elevated work areas, slip hazards not addressed, or floor marking absent in pedestrian/vehicle shared zones.",
        "fix": "Written housekeeping program, defined aisle markings, guarding on floor openings, regular documented inspections.",
    },
    {
        "n": "05",
        "name": "Recordkeeping",
        "subtitle": "OSHA 300 Log Not Maintained or Incomplete",
        "citation": "29 CFR 1904.7 / 29 CFR 1904.29",
        "penalty": "$1,190–$16,131 per violation; each missing record can be cited separately",
        "looks": "OSHA 300 Log not started, incidents not recorded within 7 days, 300A Summary not posted February 1–April 30, or records not retained for 5 years.",
        "fix": "Active OSHA 300 Log, 301 incident reports for each recordable, annual 300A Summary posted and signed by company executive, 5-year retention file.",
    },
]


# ── Building blocks ──
def _violation_row(v):
    """Render one violation as a Table row (compact, scannable)."""
    # Numeral cell
    numeral = Paragraph(f'<font color="#B8963E" size="22"><b>{v["n"]}</b></font>', S["v_title"])

    # Right content stack
    content = [
        [Paragraph(f"<b>{v['name']}</b> &mdash; {v['subtitle']}", S["v_title"])],
        [Paragraph(f"<b>Citation:</b> {v['citation']}", S["v_meta"])],
        [Paragraph(f"<b>Penalty Range:</b> {v['penalty']}", S["v_meta"])],
        [Paragraph(f"<font color='#B8963E'><b>WHAT IT LOOKS LIKE</b></font> &nbsp; {v['looks']}", S["v_body"])],
        [Paragraph(f"<font color='#B8963E'><b>FIX</b></font> &nbsp; {v['fix']}", S["v_body"])],
    ]
    content_tbl = Table(content, colWidths=[6.6 * inch])
    content_tbl.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))

    row = Table(
        [[numeral, content_tbl]],
        colWidths=[0.6 * inch, 6.6 * inch],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEABOVE", (0, 0), (-1, 0), 0.4, BORDER),
    ]))
    return row


def _header_block():
    """Dark navy header band — brand identity."""
    wm = Paragraph("GigLine Safety &amp; Compliance", S["brandwordmark"])
    tag = Paragraph("FIND IT BEFORE OSHA DOES.", S["brandtagline"])

    # Shield mark (vector-y) — simple gold rectangle stand-in (we don't embed PNG to keep PDF small + print-clean)
    mark = Paragraph(
        '<font color="#B8963E" size="22"><b>GL</b></font>',
        ParagraphStyle("mark", fontName="Helvetica-Bold", fontSize=22, leading=24, textColor=GOLD),
    )

    inner = Table(
        [[mark, [wm, tag]]],
        colWidths=[0.6 * inch, 6.6 * inch],
    )
    inner.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    wrap = Table([[inner]], colWidths=[7.2 * inch], rowHeights=[0.55 * inch])
    wrap.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("LINEBELOW", (0, 0), (-1, -1), 3, GOLD),
    ]))
    return wrap


def _title_block():
    return [
        Paragraph("FREE GIGLINE FIELD REPORT &nbsp;·&nbsp; ISSUE 01", S["title_kicker"]),
        Paragraph(
            "The Top 5 OSHA Violations Found in Triad<br/>Manufacturing &amp; Warehouse Operations",
            S["title"],
        ),
        Paragraph("And what they cost when an inspector finds them first.", S["subtitle"]),
    ]


def _intro_callout():
    p = Paragraph(
        "These are the five violations GigLine identifies most consistently during walkthroughs of "
        "small-to-mid-size manufacturing, warehouse, and distribution operations across the Piedmont "
        "Triad. Each one is <b>citable, penalizable, and fixable.</b>",
        S["intro"],
    )
    tbl = Table([[p]], colWidths=[7.2 * inch])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBEFORE", (0, 0), (0, -1), 2, GOLD),
    ]))
    return tbl


def _footer_block(digital=True):
    """Dark CTA footer."""
    cta_intro = Paragraph(
        "If any of these apply to your operation, GigLine can walk your facility and<br/>"
        "give you a written report &mdash; ranked by risk &mdash; within one visit.",
        S["footer_cta"],
    )
    cta_label = Paragraph("BOOK A FREE 15-MINUTE PHONE ASSESSMENT", S["title_kicker"])

    if digital:
        url_line = Paragraph(
            '<link href="https://www.giglinecompliance.com/walkthrough" color="#B8963E">'
            'giglinecompliance.com/walkthrough</link>',
            S["footer_cta_link"],
        )
    else:
        url_line = Paragraph("giglinecompliance.com/walkthrough", S["footer_cta_link"])

    contact = Paragraph(
        "(336) 329-8899 &nbsp;&middot;&nbsp; vince@giglinecompliance.com",
        S["footer_contact"],
    )
    promise = Paragraph("No retainer.&nbsp;&nbsp;No contract.&nbsp;&nbsp;One engagement at a time.", S["footer_promise"])

    inner = [cta_label, cta_intro, url_line, contact, Spacer(1, 4), promise]
    wrap_tbl = Table([[inner]], colWidths=[7.2 * inch])
    wrap_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LINEABOVE", (0, 0), (-1, -1), 3, GOLD),
    ]))
    return wrap_tbl


def _bottom_legal():
    return KeepTogether([
        Spacer(1, 4),
        Paragraph(
            "This report is for informational purposes only and does not constitute a formal "
            "compliance audit or legal opinion.",
            S["disclaimer"],
        ),
        Spacer(1, 2),
        Paragraph(
            "&copy; 2026 GigLine Safety &amp; Compliance &nbsp;&middot;&nbsp; giglinecompliance.com &nbsp;&middot;&nbsp; "
            "Penalty figures reflect 2024&ndash;2025 federal schedule; verify current maximums at osha.gov.",
            S["copyright"],
        ),
    ])


def build(output_path, digital=True):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.45 * inch,
        bottomMargin=0.4 * inch,
        title="Top 5 OSHA Violations in Triad Manufacturing & Warehousing — GigLine Safety & Compliance",
        author="Vince Lawrence",
        subject="Lead Magnet GL-LM-001",
        creator="GigLine Safety & Compliance",
    )

    story = []
    story.append(_header_block())
    story.append(Spacer(1, 8))
    story.extend(_title_block())
    story.append(Spacer(1, 4))
    story.append(_intro_callout())
    story.append(Spacer(1, 8))

    for v in VIOLATIONS:
        story.append(_violation_row(v))

    story.append(Spacer(1, 8))
    story.append(_footer_block(digital=digital))
    story.append(_bottom_legal())

    doc.build(story)
    print(f"✓ Generated: {output_path}")


if __name__ == "__main__":
    build(DIGITAL_OUT, digital=True)
    build(PRINT_OUT, digital=False)
    print("\nGL-LM-001 generated. Place to verify:")
    print(f"  Digital (served): {DIGITAL_OUT}")
    print(f"  Print:            {PRINT_OUT}")
