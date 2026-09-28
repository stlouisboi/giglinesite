"""
Generates the GigLine Machine Guarding Checklist PDF — a printable
walkthrough checklist that visitors receive after submitting the
lead-magnet form on the /blog/osha-machine-guarding-checklist-small-manufacturers
article.

Content mirrors the on-site interactive checklist (33 items across 6
categories) so the printed artifact and the web page stay in lockstep.

Run once (or re-run whenever the on-site checklist changes):
    python3 /app/backend/scripts/generate_machine_guarding_checklist.py
Output:
    /app/backend/machine_guarding_files/GigLine_Machine_Guarding_Checklist.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether, PageBreak,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# GigLine palette
NAVY = HexColor("#0B1F33")
GOLD = HexColor("#C9A24A")
CHARCOAL = HexColor("#1C2B2B")
MID_GRAY = HexColor("#6B7280")
LIGHT_GRAY = HexColor("#D1D5DB")
BG_GRAY = HexColor("#F4F6F8")

OUT_DIR = "/app/backend/machine_guarding_files"
OUT_PATH = os.path.join(OUT_DIR, "GigLine_Machine_Guarding_Checklist.pdf")
os.makedirs(OUT_DIR, exist_ok=True)

styles = {
    "title": ParagraphStyle(
        "title", fontName="Helvetica-Bold", fontSize=20, leading=24,
        textColor=NAVY, spaceAfter=4,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Helvetica", fontSize=10, leading=14,
        textColor=MID_GRAY, spaceAfter=8,
    ),
    "kicker": ParagraphStyle(
        "kicker", fontName="Helvetica-Bold", fontSize=8, leading=12,
        textColor=GOLD, spaceAfter=2,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=12, leading=15,
        textColor=NAVY, spaceBefore=12, spaceAfter=2,
    ),
    "cite": ParagraphStyle(
        "cite", fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
        textColor=MID_GRAY, spaceAfter=6,
    ),
    "item": ParagraphStyle(
        "item", fontName="Helvetica", fontSize=10.5, leading=14,
        textColor=CHARCOAL, leftIndent=0, spaceAfter=0,
    ),
    "small": ParagraphStyle(
        "small", fontName="Helvetica", fontSize=9, leading=12,
        textColor=MID_GRAY, spaceAfter=6,
    ),
    "footer": ParagraphStyle(
        "footer", fontName="Helvetica", fontSize=8.5, leading=11,
        textColor=MID_GRAY, alignment=TA_CENTER,
    ),
}

CHECKLIST = [
    {
        "title": "Point of Operation Guards",
        "citation": "29 CFR 1910.212(a)(1) and 1910.212(a)(3)(ii)",
        "items": [
            "Every machine has a guard preventing operator body parts from entering the point of operation.",
            "Guards are anchored, not held on by tape, zip ties, wire, or magnets.",
            "Guards are the correct type for the hazard (barrier, interlock, presence-sensing, or two-hand control).",
            "Guards are in place and functional at the moment of the walkthrough, not just at inspection time.",
            "Openings in the guard meet the OSHA maximum reach distances by aperture size.",
            "Guards themselves do not create a new hazard (pinch point, shear, projectile).",
        ],
    },
    {
        "title": "Rotating and Reciprocating Parts",
        "citation": "29 CFR 1910.219 — Mechanical power-transmission apparatus",
        "items": [
            "All belts, pulleys, gears, chains, sprockets, shafts, and couplings within 7 feet of the floor or working level are guarded.",
            "Set screws, keys, bolts, and shaft ends are countersunk or covered.",
            "Guards fully enclose the transmission side — no top, side, or bottom access to moving parts.",
            "Fan blades below 7 feet have guarding with openings no larger than 1/2 inch.",
            "Chip-shields or barrier guards on lathes, mills, and drill presses are present and used.",
            "Coupling and shaft covers are in place after any recent maintenance.",
        ],
    },
    {
        "title": "Abrasive Wheels and Grinders",
        "citation": "29 CFR 1910.215 — Abrasive wheel machinery",
        "items": [
            "Bench and pedestal grinders have a work rest adjusted within 1/8 inch of the wheel.",
            "Tongue guard is adjusted within 1/4 inch of the wheel.",
            "Wheel guards enclose at least the required arc — safety guards cover the wheel spindle end, nut, and flange projections.",
            "Ring test performed on new wheels before mounting.",
            "Wheel RPM rating equals or exceeds the machine's maximum spindle RPM (visible on the wheel and the machine).",
            "Flanges are matched pairs, at least 1/3 the wheel diameter, and use blotters.",
        ],
    },
    {
        "title": "Saws, Presses, and Cutters",
        "citation": "29 CFR 1910.213, 1910.212, 1910.217",
        "items": [
            "Table saws have blade guards, spreaders (riving knives), and anti-kickback fingers installed.",
            "Radial arm saws return to the back of the table when released and have upper blade guards.",
            "Mechanical power presses have point-of-operation guarding (barrier, presence-sensing, two-hand trip, or pull-back).",
            "Foot pedals are guarded against accidental activation.",
            "Shears, brakes, and iron workers have point-of-operation guards or presence-sensing devices.",
            "Bandsaw blades are enclosed except at the point of operation.",
        ],
    },
    {
        "title": "Guard Integrity and Bypass Prevention",
        "citation": "29 CFR 1910.212 — general requirements",
        "items": [
            "No guards found removed, disabled, defeated, or bypassed on the shop floor.",
            "Interlocked guards actually stop the hazardous motion when opened — verified, not just assumed.",
            "Presence-sensing devices (light curtains, mats) are functional and tested.",
            "Damaged, cracked, or missing guards are logged for immediate replacement.",
            "Any temporary guard removal for maintenance follows a documented lockout/tagout procedure.",
        ],
    },
    {
        "title": "Documentation and Training",
        "citation": "29 CFR 1910.212 and 1910.147",
        "items": [
            "Every machine has a hazard assessment on file identifying the specific point-of-operation hazards.",
            "Operator training records exist for every worker running a guarded machine.",
            "Machine-specific lockout/tagout procedures are posted at the machine or accessible in a binder.",
            "Guard inspection cadence is documented (typically part of monthly safety inspection).",
        ],
    },
]

TOTAL_ITEMS = sum(len(c["items"]) for c in CHECKLIST)


def draw_header_footer(canvas, doc):
    canvas.saveState()
    # Top gold rule
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)
    canvas.line(0.6 * inch, letter[1] - 0.5 * inch, letter[0] - 0.6 * inch, letter[1] - 0.5 * inch)
    # Brand
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.6 * inch, letter[1] - 0.7 * inch, "GIGLINE SAFETY & COMPLIANCE")
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawRightString(
        letter[0] - 0.6 * inch,
        letter[1] - 0.7 * inch,
        "Machine Guarding Walkthrough Checklist  |  33 items  |  6 categories",
    )
    # Footer
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.6 * inch, 0.4 * inch, "giglinecompliance.com  |  (336) 329-8899")
    canvas.drawRightString(letter[0] - 0.6 * inch, 0.4 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = []
    # Header block
    story.append(Paragraph("PRINTABLE WALKTHROUGH CHECKLIST", styles["kicker"]))
    story.append(Paragraph("OSHA Machine Guarding Checklist for Small Manufacturers", styles["title"]))
    story.append(Paragraph(
        "Walk your shop with this list. Tick items you have already handled and route the rest for correction. "
        f"Total items: {TOTAL_ITEMS}, across {len(CHECKLIST)} categories, tied to 29 CFR 1910.212, 1910.215, 1910.217, and 1910.219.",
        styles["subtitle"],
    ))

    # Facility header table
    header_data = [
        ["Facility / site", "Walked by", "Date"],
        ["", "", ""],
    ]
    header_tbl = Table(header_data, colWidths=[3.0 * inch, 2.2 * inch, 1.6 * inch], rowHeights=[0.20 * inch, 0.42 * inch])
    header_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BG_GRAY),
        ("TEXTCOLOR", (0, 0), (-1, 0), NAVY),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("ALIGN", (0, 0), (-1, 0), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, LIGHT_GRAY),
        ("LINEAFTER", (0, 0), (-2, -1), 0.5, LIGHT_GRAY),
    ]))
    story.append(header_tbl)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))

    # Sections
    for cat in CHECKLIST:
        section_block = [
            Paragraph(cat["title"], styles["section"]),
            Paragraph(cat["citation"], styles["cite"]),
        ]
        rows = []
        for text in cat["items"]:
            rows.append(["\u2610", Paragraph(text, styles["item"])])
        tbl = Table(rows, colWidths=[0.35 * inch, 6.5 * inch])
        tbl.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (0, -1), 14),
            ("TEXTCOLOR", (0, 0), (0, -1), NAVY),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ]))
        section_block.append(tbl)
        story.append(KeepTogether(section_block))

    # Sign-off block on a new page for clarity
    story.append(PageBreak())
    story.append(Paragraph("Supervisor sign-off", styles["section"]))
    story.append(Paragraph(
        "Complete after the walkthrough. Findings that could not be corrected on the spot should route to a "
        "corrective-action log with an owner and a due date.",
        styles["small"],
    ))

    signoff_rows = [
        ["Supervisor name", ""],
        ["Signature", ""],
        ["Date completed", ""],
        ["Findings routed to (corrective-action log / responsible party)", ""],
    ]
    signoff_tbl = Table(signoff_rows, colWidths=[2.5 * inch, 4.35 * inch], rowHeights=[0.42 * inch] * 4)
    signoff_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), BG_GRAY),
        ("TEXTCOLOR", (0, 0), (0, -1), NAVY),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (0, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
    ]))
    story.append(signoff_tbl)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Need a second set of eyes walking your shop? A GigLine Safety Walkthrough delivers a written "
        "citation-risk report with the specific machines, guards, and corrective actions that need attention. "
        "Visit giglinecompliance.com/services or call (336) 329-8899.",
        styles["small"],
    ))
    story.append(Paragraph(
        "Prepared by Vince Lawrence, GigLine Safety & Compliance. OSHA 30-Hour General Industry Trained. "
        "Kernersville, NC.",
        styles["small"],
    ))
    return story


def main():
    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.7 * inch,
        title="OSHA Machine Guarding Checklist for Small Manufacturers",
        author="GigLine Safety & Compliance",
    )
    doc.build(build_story(), onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
