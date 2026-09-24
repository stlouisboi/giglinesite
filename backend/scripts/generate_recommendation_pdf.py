"""Runtime generator for a per-visitor GigLine Recommendation PDF.

Called from `routes/recommendation_email.py` on every submit — no static
file is written to disk. Returns the PDF bytes so the route can attach
them inline to the Resend send.

Design intent matches the Machine Guarding and Forklift walkthrough PDFs:
navy + gold GigLine brand rule, kicker + title, left-aligned body,
supervisor-friendly typography, contact footer with the OSHA 30-Hour
General Industry Trained credential.
"""

from io import BytesIO
from typing import Optional, List, Dict

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle

NAVY = HexColor("#0B1F33")
GOLD = HexColor("#C9A24A")
CHARCOAL = HexColor("#1C2B2B")
MID_GRAY = HexColor("#6B7280")
LIGHT_GRAY = HexColor("#D1D5DB")
BG_GRAY = HexColor("#F4F6F8")

_STYLES = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=20, leading=24,
                            textColor=NAVY, spaceAfter=4),
    "kicker": ParagraphStyle("kicker", fontName="Helvetica-Bold", fontSize=8, leading=12,
                             textColor=GOLD, spaceAfter=2),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=9.5, leading=13,
                           textColor=MID_GRAY, spaceAfter=6),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=12, leading=15,
                              textColor=NAVY, spaceBefore=12, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15,
                           textColor=CHARCOAL, spaceAfter=6),
    "price": ParagraphStyle("price", fontName="Helvetica-Bold", fontSize=15, leading=18,
                            textColor=NAVY, spaceAfter=4),
    "item": ParagraphStyle("item", fontName="Helvetica", fontSize=10.5, leading=14,
                           textColor=CHARCOAL, spaceAfter=0),
    "muted_item": ParagraphStyle("muted_item", fontName="Helvetica", fontSize=10.5, leading=14,
                                 textColor=MID_GRAY, spaceAfter=0),
    "cite": ParagraphStyle("cite", fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
                           textColor=MID_GRAY, spaceAfter=6),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=9, leading=12,
                            textColor=MID_GRAY, spaceAfter=6),
}


def _header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)
    canvas.line(0.6 * inch, letter[1] - 0.5 * inch, letter[0] - 0.6 * inch, letter[1] - 0.5 * inch)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.6 * inch, letter[1] - 0.7 * inch, "GIGLINE SAFETY & COMPLIANCE")
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawRightString(letter[0] - 0.6 * inch, letter[1] - 0.7 * inch, "GigLine Recommendation Summary")
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.6 * inch, 0.4 * inch, "giglinecompliance.com  |  (336) 329-8899")
    canvas.drawRightString(letter[0] - 0.6 * inch, 0.4 * inch, f"Page {doc.page}")
    canvas.restoreState()


def _bullet_table(items: List[str], muted: bool = False) -> Table:
    style_name = "muted_item" if muted else "item"
    rows = [["\u2022", Paragraph(text, _STYLES[style_name])] for text in items]
    tbl = Table(rows, colWidths=[0.25 * inch, 6.6 * inch])
    tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTSIZE", (0, 0), (0, -1), 12),
        ("TEXTCOLOR", (0, 0), (0, -1), NAVY if not muted else MID_GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    return tbl


def build_recommendation_pdf(
    content: Dict,
    first_name: str = "",
    company: str = "",
    answers_summary: Optional[List[Dict[str, str]]] = None,
) -> bytes:
    """Render the recommendation PDF and return the file bytes.

    `content` must be a value from RECOMMENDATION_CONTENT (server-side
    allow-list); the caller is responsible for slug validation.
    `answers_summary` is an optional list of {key, value} dicts capturing
    which answers led to this recommendation.
    """
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.7 * inch,
        title=f"GigLine Recommendation — {content['name']}",
        author="GigLine Safety & Compliance",
    )

    story = []
    story.append(Paragraph("YOUR GIGLINE RECOMMENDATION", _STYLES["kicker"]))
    story.append(Paragraph(content["name"], _STYLES["title"]))

    meta_parts = []
    if first_name:
        meta_parts.append(f"Prepared for {first_name}")
    if company:
        meta_parts.append(company)
    meta_parts.append("giglinecompliance.com")
    story.append(Paragraph("  |  ".join(meta_parts), _STYLES["meta"]))

    story.append(Paragraph(content["price"], _STYLES["price"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))

    story.append(Paragraph("Why this recommendation", _STYLES["section"]))
    story.append(Paragraph(content["why"], _STYLES["body"]))

    story.append(KeepTogether([
        Paragraph("What is included", _STYLES["section"]),
        _bullet_table(content["included"]),
    ]))
    story.append(KeepTogether([
        Paragraph("What is not included", _STYLES["section"]),
        _bullet_table(content["not_included"], muted=True),
    ]))

    story.append(Paragraph("Expected next step", _STYLES["section"]))
    story.append(Paragraph(content["next_step"], _STYLES["body"]))

    if answers_summary:
        clean_rows = []
        for a in answers_summary[:12]:
            key = str(a.get("key", "")).strip()[:40]
            value = str(a.get("value", "")).strip()[:120]
            if key and value:
                clean_rows.append([Paragraph(key, _STYLES["cite"]), Paragraph(value, _STYLES["item"])])
        if clean_rows:
            story.append(Paragraph("Answers used to reach this recommendation", _STYLES["section"]))
            tbl = Table(clean_rows, colWidths=[2.0 * inch, 4.85 * inch])
            tbl.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.3, LIGHT_GRAY),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, LIGHT_GRAY),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(tbl)

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))
    story.append(Spacer(1, 6))
    story.append(Paragraph(content["disclaimer"], _STYLES["small"]))
    story.append(Paragraph(
        f"See this service on giglinecompliance.com: {content['route']}",
        _STYLES["small"],
    ))
    story.append(Paragraph(
        "Prepared by Vince Lawrence, GigLine Safety & Compliance. OSHA 30-Hour General Industry Trained. "
        "Kernersville, NC. (336) 329-8899.",
        _STYLES["small"],
    ))

    doc.build(story, onFirstPage=_header_footer, onLaterPages=_header_footer)
    return buf.getvalue()
