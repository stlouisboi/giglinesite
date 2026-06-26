"""
GigLine Safety Check — PDF Report Generator

Generates a professional Safety Check Report PDF matching the GL brand standard.
Matches GL-SafetyCheck-GO/WAIT/NOGO sample PDFs exactly.
"""

import io
from datetime import datetime, timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

try:
    from config import GIGLINE_GOOGLE_REVIEW_URL
except Exception:
    GIGLINE_GOOGLE_REVIEW_URL = 'https://www.google.com/search?q=GigLine+Safety+%26+Compliance+Kernersville+NC'

# Brand colors
CHARCOAL = colors.HexColor("#1C2B2B")
GOLD = colors.HexColor("#B8972C")
RED_BG = colors.HexColor("#8B2500")
GREEN_OK = colors.HexColor("#2D6A4F")
LIGHT_GRAY = colors.HexColor("#F5F5F3")
MID_GRAY = colors.HexColor("#666666")
BORDER_GRAY = colors.HexColor("#DDDDDD")
WHITE = colors.white
YELLOW_BG = colors.HexColor("#FFFDE7")


def get_styles():
    return {
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=18, leading=22,
            textColor=CHARCOAL, spaceAfter=4
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Helvetica", fontSize=11, leading=14,
            textColor=MID_GRAY, spaceAfter=8
        ),
        "section_header": ParagraphStyle(
            "section_header", fontName="Helvetica-Bold", fontSize=9, leading=12,
            textColor=CHARCOAL, spaceBefore=16, spaceAfter=8,
            tracking=1.5
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=10, leading=14,
            textColor=CHARCOAL, spaceAfter=6
        ),
        "body_gray": ParagraphStyle(
            "body_gray", fontName="Helvetica", fontSize=10, leading=14,
            textColor=MID_GRAY, spaceAfter=6
        ),
        "question_text": ParagraphStyle(
            "question_text", fontName="Helvetica", fontSize=10, leading=14,
            textColor=CHARCOAL
        ),
        "citation": ParagraphStyle(
            "citation", fontName="Helvetica", fontSize=8, leading=10,
            textColor=MID_GRAY
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName="Helvetica", fontSize=10, leading=14,
            textColor=CHARCOAL, leftIndent=12, spaceAfter=3
        ),
        "footer": ParagraphStyle(
            "footer", fontName="Helvetica", fontSize=8, leading=10,
            textColor=MID_GRAY
        ),
    }


QUESTIONS = [
    {
        "id": "1",
        "text": "Do you have a written Hazard Communication program and can your team locate the SDS for every chemical on site without delay?",
        "citation": "29 CFR 1910.1200"
    },
    {
        "id": "2",
        "text": "Are forklift operators currently certified and are daily pre-shift inspections consistently documented?",
        "citation": "29 CFR 1910.178"
    },
    {
        "id": "3",
        "text": "Do you have a written Lockout/Tagout program with documented annual inspections for each energy control procedure?",
        "citation": "29 CFR 1910.147"
    },
    {
        "id": "4",
        "text": "Are machine guards in place on all equipment and have none been removed, bypassed, or modified?",
        "citation": "29 CFR 1910.212"
    },
    {
        "id": "5",
        "text": "Are damaged ladders removed from service and tagged before they are used again?",
        "citation": "29 CFR 1910.23"
    },
    {
        "id": "6",
        "text": "Are safety training sessions documented and can you produce records for the past 12 months for required PPE and equipment training?",
        "citation": "29 CFR 1910.132(f), 1910.178(l)"
    },
]


def generate_safety_check_pdf(submission_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.6*inch, bottomMargin=0.8*inch
    )

    styles = get_styles()
    story = []

    gaps = submission_data.get("score_gaps", 0)
    if gaps <= 1:
        flow = "GO"
    elif gaps <= 3:
        flow = "WAIT"
    else:
        flow = "NOGO"

    ref_id = submission_data.get("id", "")[:8].upper()
    ts = submission_data.get("timestamp", "")
    try:
        dt = datetime.fromisoformat(ts)
        date_str = dt.strftime("%B %d, %Y")
        ref_code = dt.strftime("%Y%m%d") + "-" + ref_id[:4]
    except Exception:
        date_str = "N/A"
        ref_code = ref_id

    company = submission_data.get("company", "[Operator Name]")
    name = submission_data.get("name", "")
    operation_type = submission_data.get("operation_type", "")

    # ── HEADER ──
    header_data = [
        [
            Paragraph("GigLine Safety &amp; Compliance", ParagraphStyle(
                "brand", fontName="Helvetica-Bold", fontSize=14, textColor=CHARCOAL
            )),
            Paragraph(f"Ref: {ref_code}", ParagraphStyle(
                "ref", fontName="Helvetica", fontSize=9, textColor=MID_GRAY, alignment=TA_RIGHT
            ))
        ],
        [
            Paragraph("SAFETY &amp; COMPLIANCE", ParagraphStyle(
                "sub", fontName="Helvetica", fontSize=8, textColor=GOLD, tracking=3
            )),
            ""
        ]
    ]
    header_table = Table(header_data, colWidths=[4*inch, 3*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=12))

    # Title block
    story.append(Paragraph("Safety Check Report", styles["title"]))
    story.append(Paragraph("Initial Exposure Snapshot", styles["subtitle"]))
    story.append(Paragraph(
        "This reflects responses to six OSHA-critical areas commonly cited in small general-industry operations. "
        "It is not a full safety audit; it is a signal.",
        styles["body_gray"]
    ))
    story.append(Spacer(1, 8))

    # Company / Date / Completed by
    info_data = [
        [
            Paragraph("Company", ParagraphStyle("lbl", fontName="Helvetica", fontSize=8, textColor=MID_GRAY)),
            Paragraph("Date Completed", ParagraphStyle("lbl", fontName="Helvetica", fontSize=8, textColor=MID_GRAY)),
            Paragraph("Completed by", ParagraphStyle("lbl", fontName="Helvetica", fontSize=8, textColor=MID_GRAY))
        ],
        [
            Paragraph(company, ParagraphStyle("val", fontName="Helvetica-Bold", fontSize=11, textColor=CHARCOAL)),
            Paragraph(date_str, ParagraphStyle("val", fontName="Helvetica-Bold", fontSize=11, textColor=CHARCOAL)),
            Paragraph(name, ParagraphStyle("val", fontName="Helvetica-Bold", fontSize=11, textColor=CHARCOAL))
        ]
    ]
    info_table = Table(info_data, colWidths=[2.6*inch, 2.2*inch, 2.2*inch])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 6))

    # ── SECTION 1: RESULT STATUS ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=4))
    story.append(Paragraph("SECTION 1 \u2014 RESULT STATUS", styles["section_header"]))

    if flow == "GO":
        status_label = "GO \u2014 Foundational Controls Present"
        status_color = GREEN_OK
        status_bg = colors.HexColor("#E8F5E9")
        status_body = (
            "Your responses indicate that basic safety controls are in place across the areas reviewed. "
            "This suggests your operation has structure where many do not."
        )
        status_extra = (
            "However, this result does not confirm full compliance or audit readiness. "
            "It indicates a starting position, not a final condition."
        )
    elif flow == "WAIT":
        status_label = "WAIT \u2014 Partial Control, Gaps Present"
        status_color = GOLD
        status_bg = colors.HexColor("#FFF8E1")
        status_body = (
            "Your responses indicate that some areas are controlled, while others likely require attention. "
            "This is the most common position."
        )
        status_extra = (
            "The operation is functional, but exposed in specific areas that may not be visible until reviewed."
        )
    else:
        status_label = "NO-GO \u2014 Exposure Likely"
        status_color = RED_BG
        status_bg = colors.HexColor("#FFEBEE")
        status_body = (
            "Your responses indicate gaps in areas that are frequently cited. "
            "This does not mean failure. It means the system is not fully in place."
        )
        status_extra = (
            "At this stage, clarity is more important than assumption."
        )

    status_data = [
        [Paragraph(status_label, ParagraphStyle(
            "st", fontName="Helvetica-Bold", fontSize=13, textColor=status_color
        ))],
        [Paragraph(status_body, ParagraphStyle(
            "stb", fontName="Helvetica", fontSize=10, leading=14, textColor=CHARCOAL, spaceBefore=4
        ))],
        [Paragraph(status_extra, ParagraphStyle(
            "stc", fontName="Helvetica", fontSize=10, leading=14, textColor=CHARCOAL, spaceBefore=4
        ))]
    ]
    status_table = Table(status_data, colWidths=[6.5*inch])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), status_bg),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (0, 0), 12),
        ('BOTTOMPADDING', (-1, -1), (-1, -1), 12),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(status_table)
    story.append(Spacer(1, 16))

    # ── SECTION 2: QUESTION BREAKDOWN ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=4))
    story.append(Paragraph("SECTION 2 \u2014 QUESTION BREAKDOWN", styles["section_header"]))

    answers = submission_data.get("answers", {})

    for q in QUESTIONS:
        answer = answers.get(str(q["id"]), answers.get(q["id"], "no"))
        is_yes = answer.lower() == "yes"

        answer_text = "Yes \u2014 Confirmed" if is_yes else "No \u2014 Not in Place"
        answer_color = GREEN_OK if is_yes else RED_BG

        q_data = [
            [
                Paragraph(f"<b>{q['id'].zfill(2)}</b>", ParagraphStyle(
                    "qn", fontName="Helvetica-Bold", fontSize=14, textColor=CHARCOAL
                )),
                Paragraph(q["text"], styles["question_text"]),
                Paragraph(answer_text, ParagraphStyle(
                    "ans", fontName="Helvetica-Bold", fontSize=10, textColor=answer_color, alignment=TA_RIGHT
                ))
            ],
            [
                "",
                Paragraph(q["citation"], styles["citation"]),
                ""
            ]
        ]
        q_table = Table(q_data, colWidths=[0.5*inch, 4.5*inch, 2*inch])
        q_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
            ('BOTTOMPADDING', (0, 1), (-1, 1), 8),
            ('LINEBELOW', (0, 1), (-1, 1), 0.5, BORDER_GRAY),
        ]))
        story.append(q_table)

    story.append(Spacer(1, 8))

    # ── SECTION 3: WHAT THIS SUGGESTS ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=4))
    story.append(Paragraph("SECTION 3 \u2014 WHAT THIS SUGGESTS", styles["section_header"]))

    if flow == "GO":
        story.append(Paragraph("Even strong operations typically show gaps in:", styles["body"]))
        for item in [
            "documentation consistency",
            "training record completeness",
            "inspection documentation",
            "real-world execution vs. written program",
        ]:
            story.append(Paragraph(f"\u2014  {item}", styles["bullet"]))
    elif flow == "WAIT":
        story.append(Paragraph("This result usually indicates:", styles["body"]))
        for item in [
            "partial systems in place",
            "inconsistent execution",
            "documentation gaps",
            "overlooked exposure areas",
        ]:
            story.append(Paragraph(f"\u2014  {item}", styles["bullet"]))
    else:
        story.append(Paragraph("This result usually indicates:", styles["body"]))
        for item in [
            "missing or incomplete programs",
            "lack of documentation",
            "unverified training",
            "exposure that has not yet been reviewed",
        ]:
            story.append(Paragraph(f"\u2014  {item}", styles["bullet"]))

    story.append(Spacer(1, 8))

    # ── SECTION 4: WHAT THIS DOES NOT SHOW ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=4))
    story.append(Paragraph("SECTION 4 \u2014 WHAT THIS DOES NOT SHOW", styles["section_header"]))
    story.append(Paragraph("This check does not evaluate:", styles["body"]))
    for item in [
        "full OSHA compliance",
        "condition of equipment",
        "quality of training",
        "actual behavior on the floor",
        "depth of documentation",
    ]:
        story.append(Paragraph(f"\u2014  {item}", styles["bullet"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph("It identifies where to look first.", ParagraphStyle(
        "bold", fontName="Helvetica-Bold", fontSize=10, textColor=CHARCOAL
    )))
    story.append(Spacer(1, 8))

    # ── SECTION 5: RECOMMENDED NEXT STEP ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=4))
    story.append(Paragraph("SECTION 5 \u2014 RECOMMENDED NEXT STEP", styles["section_header"]))
    story.append(Paragraph("<b>What Comes Next</b>", styles["body"]))
    story.append(Paragraph("A walkthrough or documentation review provides:", styles["body"]))
    for item in [
        "a clear picture of what is exposed",
        "a written report of findings",
        "a prioritized list of what to fix first",
        "documentation that holds under review",
    ]:
        story.append(Paragraph(f"\u2014  {item}", styles["bullet"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Pricing is straightforward and quoted up front; there are no retainers or long-term contracts.",
        styles["body_gray"]
    ))
    story.append(Spacer(1, 12))

    # CTA Box
    cta_data = [
        [Paragraph(
            "<b>Request a Walkthrough or Review</b>",
            ParagraphStyle("cta", fontName="Helvetica-Bold", fontSize=12, textColor=CHARCOAL, alignment=TA_CENTER)
        )],
        [Paragraph(
            "giglinecompliance.com &nbsp;&nbsp;&bull;&nbsp;&nbsp; vince@giglinecompliance.com &nbsp;&nbsp;&bull;&nbsp;&nbsp; 336-329-8899",
            ParagraphStyle("ctasub", fontName="Helvetica", fontSize=9, textColor=MID_GRAY, alignment=TA_CENTER)
        )]
    ]
    cta_table = Table(cta_data, colWidths=[6.5*inch])
    cta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), YELLOW_BG),
        ('TOPPADDING', (0, 0), (0, 0), 14),
        ('BOTTOMPADDING', (-1, -1), (-1, -1), 14),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(cta_table)
    story.append(Spacer(1, 14))

    # ── Google Review Ask ──
    review_para = Paragraph(
        f'<font color="#666666">Found this helpful? A short Google review keeps the lights on for small operations.</font>'
        f' &nbsp;<a href="{GIGLINE_GOOGLE_REVIEW_URL}"><font color="#B8972C"><b>Leave a Google review &rarr;</b></font></a>',
        ParagraphStyle(
            "review", fontName="Helvetica", fontSize=9, leading=12,
            textColor=MID_GRAY, alignment=TA_CENTER
        )
    )
    story.append(review_para)
    story.append(Spacer(1, 18))

    # ── FOOTER ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY, spaceAfter=8))
    footer_data = [
        [
            Paragraph(
                "<b>GigLine Safety &amp; Compliance</b><br/>"
                "Vince Lawrence &nbsp;&bull;&nbsp; Winston-Salem, NC<br/>"
                "vince@giglinecompliance.com &nbsp;&bull;&nbsp; 336-329-8899",
                styles["footer"]
            ),
            Paragraph(
                f"Safety Check Report &nbsp;&bull;&nbsp; Ref: {ref_code}<br/>"
                f"Generated: {date_str}",
                ParagraphStyle("fr", fontName="Helvetica", fontSize=8, textColor=MID_GRAY, alignment=TA_RIGHT)
            )
        ]
    ]
    footer_table = Table(footer_data, colWidths=[3.5*inch, 3.5*inch])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(footer_table)

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
