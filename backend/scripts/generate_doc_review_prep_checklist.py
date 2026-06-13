"""
GL-DOC-REVIEW-PREP-CHECKLIST — Documentation Review Prep Checklist PDF generator.

A one-page actionable checklist Vince attaches to the client confirmation email
when the submitted service is 'OSHA Documentation Readiness Review'. Lists every program,
log, and record Vince typically needs to review before the engagement, with
brief context on where each item is usually found.

Run:    python3 /app/backend/scripts/generate_doc_review_prep_checklist.py
Output: /app/frontend/public/assets/gl-doc-review-prep-checklist.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── Brand colors (consistent with Field Manual + LM-001) ──
NAVY = HexColor("#0A1628")
GOLD = HexColor("#B8963E")
INK = HexColor("#0A1628")
INK_MUTED = HexColor("#3A4960")
INK_SUBTLE = HexColor("#6B7280")
CREAM = HexColor("#FAF7F1")
BORDER = HexColor("#D9CFB8")
ROW_ALT = HexColor("#F7F4EB")

OUT = "/app/frontend/public/assets/gl-doc-review-prep-checklist.pdf"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# ── Typography ──
S = {
    "brand_wordmark": ParagraphStyle(
        "brand_wordmark", fontName="Helvetica-Bold", fontSize=12, leading=14,
        textColor=white, spaceAfter=0,
    ),
    "brand_tag": ParagraphStyle(
        "brand_tag", fontName="Helvetica-Oblique", fontSize=7.5, leading=9,
        textColor=GOLD, spaceAfter=0,
    ),
    "doc_label": ParagraphStyle(
        "doc_label", fontName="Helvetica-Bold", fontSize=7, leading=9,
        textColor=GOLD, alignment=TA_RIGHT, letterSpacing=1,
    ),
    "title": ParagraphStyle(
        "title", fontName="Helvetica-Bold", fontSize=16, leading=19,
        textColor=INK, alignment=TA_LEFT, spaceAfter=4,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Helvetica", fontSize=9, leading=12,
        textColor=INK_MUTED, alignment=TA_LEFT, spaceAfter=8,
    ),
    "section_label": ParagraphStyle(
        "section_label", fontName="Helvetica-Bold", fontSize=7.5, leading=9,
        textColor=GOLD, letterSpacing=1.4, spaceAfter=2,
    ),
    "section_title": ParagraphStyle(
        "section_title", fontName="Helvetica-Bold", fontSize=10.5, leading=12,
        textColor=INK, spaceAfter=4,
    ),
    "item_name": ParagraphStyle(
        "item_name", fontName="Helvetica-Bold", fontSize=8.5, leading=10.5,
        textColor=INK, spaceAfter=0,
    ),
    "item_desc": ParagraphStyle(
        "item_desc", fontName="Helvetica", fontSize=7.5, leading=9.5,
        textColor=INK_MUTED, spaceAfter=0,
    ),
    "footer": ParagraphStyle(
        "footer", fontName="Helvetica", fontSize=7.5, leading=10,
        textColor=INK_SUBTLE, alignment=TA_CENTER, spaceAfter=0,
    ),
    "note_block": ParagraphStyle(
        "note_block", fontName="Helvetica-Oblique", fontSize=8, leading=11,
        textColor=INK_MUTED, alignment=TA_LEFT, spaceAfter=0,
    ),
}


# ── Checklist content ──
SECTIONS = [
    {
        "label": "01",
        "title": "Core Written Programs",
        "items": [
            ("Written safety / health program",
             "Master safety policy or company-wide program manual."),
            ("Hazard Communication (HazCom) program",
             "Written program + SDS binder or electronic SDS access."),
            ("Emergency Action Plan",
             "Evacuation routes, alarm system, accountability."),
            ("Fire Prevention Plan",
             "Required if you have flammable storage, hot work, or 10+ employees."),
            ("Lockout / Tagout (LOTO) procedures",
             "Written program + machine-specific procedures."),
            ("Personal Protective Equipment (PPE) hazard assessment",
             "Written assessment + selection rationale per area."),
        ],
    },
    {
        "label": "02",
        "title": "Records & Logs",
        "items": [
            ("OSHA 300 / 300A injury & illness logs (last 3 years)",
             "Annual summary signed by company executive."),
            ("Inspection / walkthrough records (last 12 months)",
             "Internal audits, checklists, corrective action notes."),
            ("Incident / injury investigation reports (last 3 years)",
             "Root cause findings, corrective actions, sign-offs."),
            ("Equipment maintenance / inspection logs",
             "Forklift daily checklists, crane / hoist inspections."),
            ("Any recent OSHA correspondence",
             "Citations, complaints, abatement documents — if any."),
        ],
    },
    {
        "label": "03",
        "title": "Training Documentation",
        "items": [
            ("New-hire safety orientation records",
             "Sign-in sheets, content outline, evaluation forms."),
            ("Toolbox talks / annual training records (last 2–3 years)",
             "Sign-in sheets, dates, topics covered."),
            ("Forklift operator training & certifications",
             "Initial training, refresher dates, observed evaluations."),
            ("Specialized training records (LOTO, confined space, hot work)",
             "By job role and exposure type."),
        ],
    },
    {
        "label": "04",
        "title": "Specialty Programs (if applicable)",
        "items": [
            ("Bloodborne Pathogens program",
             "First-aid responders, designated incumbents."),
            ("Hearing Conservation program",
             "Required where 8-hour noise exposure ≥ 85 dB."),
            ("Respiratory Protection program",
             "Required for any respirator use, including N95s in some cases."),
            ("Confined Space program",
             "Written program + permits for permit-required spaces."),
            ("Permit forms — hot work, confined space, LOTO",
             "Active permits + recent completed permits."),
        ],
    },
]


# ─────────────────────────────────────────────────────────
#  PAGE BUILDERS
# ─────────────────────────────────────────────────────────

def header_band(width):
    """Dark navy band with GigLine wordmark + doc label."""
    inner = Table([[
        Paragraph("GigLine Safety &amp; Compliance", S["brand_wordmark"]),
        Paragraph("DOC REVIEW &middot; PREP CHECKLIST", S["doc_label"]),
    ]], colWidths=[width * 0.62, width * 0.38])
    inner.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
    ]))
    return inner


def checklist_section(section, col_width):
    """One section: label + title, then table of [☐ | name + desc]."""
    rows = []
    for name, desc in section["items"]:
        item_cell = [
            Paragraph(name, S["item_name"]),
            Paragraph(desc, S["item_desc"]),
        ]
        rows.append(["☐", item_cell])

    t = Table(rows, colWidths=[0.32 * inch, col_width - 0.32 * inch])
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (0, -1), 13),
        ("TEXTCOLOR", (0, 0), (0, -1), GOLD),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, BORDER),
    ]
    for i in range(len(rows)):
        if i % 2 == 1:
            style.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(style))

    return [
        Paragraph(f"{section['label']} &middot; {section['title'].upper()}", S["section_label"]),
        Paragraph(section["title"], S["section_title"]),
        Spacer(1, 3),
        t,
        Spacer(1, 10),
    ]


def build_pdf():
    page_w, page_h = letter
    margin = 0.45 * inch
    content_w = page_w - (2 * margin)

    doc = SimpleDocTemplate(
        OUT, pagesize=letter,
        leftMargin=margin, rightMargin=margin,
        topMargin=margin, bottomMargin=margin,
        title="GigLine — Documentation Review Prep Checklist",
        author="Vince Lawrence, GigLine Safety & Compliance",
        subject="Pre-engagement documentation checklist for clients",
    )

    story = []

    # Header band
    story.append(header_band(content_w))
    story.append(Spacer(1, 12))

    # Title block
    story.append(Paragraph("Documentation Review &mdash; Prep Checklist", S["title"]))
    story.append(Paragraph(
        "Gather what you can before our review. If something on this list doesn&rsquo;t apply, "
        "leave it blank. The more we have in front of us, the faster the findings report comes back.",
        S["subtitle"],
    ))

    # Two-column layout (two sections side-by-side)
    col_w = (content_w - 0.25 * inch) / 2

    # Build each section's flowables
    s1_flow = checklist_section(SECTIONS[0], col_w)
    s2_flow = checklist_section(SECTIONS[1], col_w)
    s3_flow = checklist_section(SECTIONS[2], col_w)
    s4_flow = checklist_section(SECTIONS[3], col_w)

    # Wrap each column's flowables into a single cell (use mini-tables to embed)
    def wrap_col(flows):
        t = Table([[f] for f in flows], colWidths=[col_w])
        t.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        return t

    two_col_top = Table(
        [[wrap_col(s1_flow), wrap_col(s2_flow)]], colWidths=[col_w, col_w],
    )
    two_col_top.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(two_col_top)
    story.append(Spacer(1, 6))

    two_col_bottom = Table(
        [[wrap_col(s3_flow), wrap_col(s4_flow)]], colWidths=[col_w, col_w],
    )
    two_col_bottom.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(two_col_bottom)

    # Notes block
    story.append(Spacer(1, 6))
    note_table = Table([[
        Paragraph(
            "<b>Not sure about an item?</b> &nbsp; Note it in your intake and Vince will follow up. "
            "Missing documents aren&rsquo;t a failure &mdash; that&rsquo;s the point of the review.",
            S["note_block"],
        )
    ]], colWidths=[content_w])
    note_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("LINEABOVE", (0, 0), (-1, 0), 1, GOLD),
        ("LINEBELOW", (0, -1), (-1, -1), 0.5, BORDER),
    ]))
    story.append(note_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph(
        "GigLine Safety &amp; Compliance &middot; Vince Lawrence &middot; (336) 329-8899 &middot; "
        "vince@giglinecompliance.com &middot; giglinecompliance.com",
        S["footer"],
    ))

    doc.build(story)
    print(f"✓ Generated: {OUT}")
    print(f"  Size: {os.path.getsize(OUT) / 1024:.1f} KB")


if __name__ == "__main__":
    build_pdf()
