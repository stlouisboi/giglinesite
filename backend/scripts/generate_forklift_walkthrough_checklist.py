"""
Generates the GigLine Forklift / PIT Walkthrough Checklist PDF — a FREE
printable walkthrough delivered as an optional upsell on the Machine
Guarding lead-magnet form.

Distinct from the PAID $150 Forklift/PIT Readiness Kit product. This is a
short walkthrough checklist that mirrors the format of the Machine Guarding
checklist so plant managers get the same on-shop-floor experience.

Run once (or re-run when 29 CFR 1910.178 references change):
    python3 /app/backend/scripts/generate_forklift_walkthrough_checklist.py
Output:
    /app/backend/machine_guarding_files/GigLine_Forklift_PIT_Walkthrough_Checklist.pdf
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
from reportlab.lib.enums import TA_CENTER

NAVY = HexColor("#0B1F33")
GOLD = HexColor("#C9A24A")
CHARCOAL = HexColor("#1C2B2B")
MID_GRAY = HexColor("#6B7280")
LIGHT_GRAY = HexColor("#D1D5DB")
BG_GRAY = HexColor("#F4F6F8")

OUT_DIR = "/app/backend/machine_guarding_files"
OUT_PATH = os.path.join(OUT_DIR, "GigLine_Forklift_PIT_Walkthrough_Checklist.pdf")
os.makedirs(OUT_DIR, exist_ok=True)

styles = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=20, leading=24,
                            textColor=NAVY, spaceAfter=4),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=10, leading=14,
                               textColor=MID_GRAY, spaceAfter=8),
    "kicker": ParagraphStyle("kicker", fontName="Helvetica-Bold", fontSize=8, leading=12,
                             textColor=GOLD, spaceAfter=2),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=12, leading=15,
                              textColor=NAVY, spaceBefore=12, spaceAfter=2),
    "cite": ParagraphStyle("cite", fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
                           textColor=MID_GRAY, spaceAfter=6),
    "item": ParagraphStyle("item", fontName="Helvetica", fontSize=10.5, leading=14,
                           textColor=CHARCOAL, spaceAfter=0),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=9, leading=12,
                            textColor=MID_GRAY, spaceAfter=6),
    "footer": ParagraphStyle("footer", fontName="Helvetica", fontSize=8.5, leading=11,
                             textColor=MID_GRAY, alignment=TA_CENTER),
}

CHECKLIST = [
    {
        "title": "Operator Qualification and Training",
        "citation": "29 CFR 1910.178(l) — Operator training",
        "items": [
            "Every operator has a certificate on file naming them, the truck type, the trainer, and the date.",
            "Refresher training is documented every three years, or after any accident, near-miss, or unsafe operation.",
            "Operator evaluations were performed by a competent person, not self-signed.",
            "Truck-type coverage on the certificate matches the truck the operator is actually using.",
            "Non-certified operators are physically prevented from operating trucks (key control or lockout).",
        ],
    },
    {
        "title": "Pre-Shift Inspection",
        "citation": "29 CFR 1910.178(q)(7) — daily examinations",
        "items": [
            "A written pre-shift inspection is completed for every truck, every shift it is used.",
            "Inspection checklist covers brakes, steering, controls, warning devices, mast, tires, forks, backup alarm, and horn.",
            "Trucks found unsafe are tagged out and removed from service until repaired.",
            "Completed pre-shift forms are retained (recommend 12 months) and available for OSHA on request.",
            "Propane, electric, and diesel trucks each have their fuel-specific checks documented.",
        ],
    },
    {
        "title": "Traveling and Load Handling",
        "citation": "29 CFR 1910.178(n) — traveling",
        "items": [
            "Load capacity plate is legible on every truck and matches the attachment installed.",
            "Loads are tilted back and carried as low as possible when traveling.",
            "Operators sound the horn at intersections and blind corners; mirrors are installed at the worst spots.",
            "No riders on trucks not equipped and rated for a second operator.",
            "Speed limits are posted and enforced in pedestrian zones (typical 5 mph interior, walking pace near people).",
            "Pedestrian separation exists at the highest-risk crossings (barriers, striped walkways, or 'stop for forklifts' signage).",
        ],
    },
    {
        "title": "Charging and Refueling",
        "citation": "29 CFR 1910.178(g) — battery, and 1910.178(f) — fuel handling",
        "items": [
            "Battery charging area is well-ventilated, no smoking, with an eye-wash station and PPE (face shield, apron, gloves) within reach.",
            "Propane cylinders are stored upright, secured, and away from ignition sources.",
            "Diesel and gasoline refueling occurs outdoors or in a designated ventilated area with the engine off.",
            "Spill containment is available and the response procedure is posted.",
        ],
    },
    {
        "title": "Rack, Aisle, and Storage",
        "citation": "29 CFR 1910.176 — Materials handling, general",
        "items": [
            "Aisles are marked, unobstructed, and wide enough for the truck plus a pedestrian buffer.",
            "Racking is undamaged — no bent uprights, no missing footplates or beam locks.",
            "Damaged racking has a written removal-from-service and repair schedule.",
            "Overhead loads are secured or shrink-wrapped so nothing can fall on operators.",
        ],
    },
    {
        "title": "Documentation on the Wall",
        "citation": "29 CFR 1910.178 subparts (l) and (q)",
        "items": [
            "Written PIT program is on file and available.",
            "Operator certificates and evaluation forms are kept for the term of employment plus three years.",
            "Pre-shift inspection forms are filed by truck and date.",
            "Maintenance / repair records are tied to the truck's serial number.",
        ],
    },
]

TOTAL_ITEMS = sum(len(c["items"]) for c in CHECKLIST)


def draw_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)
    canvas.line(0.6 * inch, letter[1] - 0.5 * inch, letter[0] - 0.6 * inch, letter[1] - 0.5 * inch)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.6 * inch, letter[1] - 0.7 * inch, "GIGLINE SAFETY & COMPLIANCE")
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawRightString(
        letter[0] - 0.6 * inch,
        letter[1] - 0.7 * inch,
        f"Forklift / PIT Walkthrough Checklist  |  {TOTAL_ITEMS} items  |  {len(CHECKLIST)} categories",
    )
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.6 * inch, 0.4 * inch, "giglinecompliance.com  |  (336) 329-8899")
    canvas.drawRightString(letter[0] - 0.6 * inch, 0.4 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = []
    story.append(Paragraph("PRINTABLE WALKTHROUGH CHECKLIST", styles["kicker"]))
    story.append(Paragraph("OSHA Forklift / Powered Industrial Truck Walkthrough Checklist", styles["title"]))
    story.append(Paragraph(
        f"Walk your shop with this list. Total items: {TOTAL_ITEMS}, across {len(CHECKLIST)} categories, "
        f"tied to 29 CFR 1910.176 and 1910.178. This is the free walkthrough companion — for the complete "
        f"11-document Forklift/PIT Readiness Kit (written program, operator evaluation forms, inspection binders), "
        f"visit giglinecompliance.com/kits/forklift-pit-readiness-kit.",
        styles["subtitle"],
    ))

    header_data = [["Facility / site", "Walked by", "Date"], ["", "", ""]]
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

    story.append(PageBreak())
    story.append(Paragraph("Supervisor sign-off", styles["section"]))
    story.append(Paragraph(
        "Complete after the walkthrough. Anything unchecked should route to a corrective-action log with an "
        "owner and a due date. Damaged racking or unqualified operators are stop-work items.",
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
        "Ready for the full program? The GigLine Forklift/PIT Readiness Kit at $150 delivers the written PIT "
        "program, operator training curriculum, pre-shift inspection forms in binder-ready format, and citation-proof "
        "records for OSHA inspections. Visit giglinecompliance.com/kits/forklift-pit-readiness-kit.",
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
        title="OSHA Forklift / PIT Walkthrough Checklist",
        author="GigLine Safety & Compliance",
    )
    doc.build(build_story(), onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
