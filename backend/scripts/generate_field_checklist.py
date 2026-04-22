"""
Generates the GigLine Field Checklist PDF — a printable pre-visit / on-site / post-visit
checklist that Vince can print and keep in the truck.

Run once:  python3 /app/backend/scripts/generate_field_checklist.py
Output:    /app/backend/internal_docs/GigLine_Field_Checklist.pdf
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
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── Colors (match the site palette) ──
NAVY = HexColor("#0B1F33")
BLUE = HexColor("#1F6FEB")
CHARCOAL = HexColor("#1C2B2B")
MID_GRAY = HexColor("#6B7280")
LIGHT_GRAY = HexColor("#D1D5DB")
BG_GRAY = HexColor("#F4F6F8")

OUT_DIR = "/app/backend/internal_docs"
OUT_PATH = os.path.join(OUT_DIR, "GigLine_Field_Checklist.pdf")

os.makedirs(OUT_DIR, exist_ok=True)

# ── Styles ──
styles = {
    "title": ParagraphStyle(
        "title", fontName="Helvetica-Bold", fontSize=20, leading=24,
        textColor=NAVY, spaceAfter=4,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Helvetica", fontSize=10, leading=14,
        textColor=MID_GRAY, spaceAfter=12,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=12, leading=16,
        textColor=BLUE, spaceBefore=14, spaceAfter=6,
        borderPadding=0,
    ),
    "subsection": ParagraphStyle(
        "subsection", fontName="Helvetica-Bold", fontSize=10, leading=13,
        textColor=CHARCOAL, spaceBefore=8, spaceAfter=3,
    ),
    "item": ParagraphStyle(
        "item", fontName="Helvetica", fontSize=11.5, leading=16,
        textColor=CHARCOAL, leftIndent=18, spaceAfter=3,
    ),
    "note": ParagraphStyle(
        "note", fontName="Helvetica-Oblique", fontSize=9.5, leading=13,
        textColor=MID_GRAY, leftIndent=18, spaceAfter=8,
    ),
    "footer": ParagraphStyle(
        "footer", fontName="Helvetica", fontSize=8, leading=10,
        textColor=MID_GRAY, alignment=TA_CENTER,
    ),
    "priority_box": ParagraphStyle(
        "priority_box", fontName="Helvetica-Bold", fontSize=10, leading=14,
        textColor=CHARCOAL, alignment=TA_LEFT,
    ),
}


def checkbox_item(text):
    """Render a checklist item with an empty checkbox glyph."""
    return Paragraph(f'<font color="#1F6FEB">\u25A1</font>  {text}', styles["item"])


def note(text):
    return Paragraph(text, styles["note"])


def section(title):
    return Paragraph(title.upper(), styles["section"])


def subsection(title):
    return Paragraph(title, styles["subsection"])


def hr():
    return HRFlowable(width="100%", thickness=0.75, color=LIGHT_GRAY, spaceBefore=2, spaceAfter=2)


def header_block():
    """Top banner — title + subtitle + contact line."""
    return [
        Paragraph("GigLine Field Checklist", styles["title"]),
        Paragraph(
            "Pre-visit &middot; On-site &middot; Post-visit &nbsp;&bull;&nbsp; "
            "Vince Lawrence &nbsp;&bull;&nbsp; (336) 329-8899 &nbsp;&bull;&nbsp; vince@giglinecompliance.com",
            styles["subtitle"]
        ),
        HRFlowable(width="100%", thickness=1.25, color=BLUE, spaceAfter=4),
    ]


def build():
    doc = SimpleDocTemplate(
        OUT_PATH, pagesize=letter,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        topMargin=0.55 * inch, bottomMargin=0.55 * inch,
        title="GigLine Field Checklist",
        author="Vince Lawrence",
    )

    story = []

    # ── HEADER ──
    story.extend(header_block())

    # ── SECTION 1 — BEFORE YOU LEAVE ──
    story.append(section("1 — Before You Leave"))

    story.append(subsection("Prep (30 min night before)"))
    for item in [
        "Re-read intake submission — flag 2–3 things to see firsthand",
        "Google the business — owner, tenure, any recent news",
        "Check Google Maps satellite view — buildings, storage, docks",
        "Confirm signed agreement matches tier you're walking",
        "Check weather — adjust outdoor portions if 95°F+ or rain",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Documents to bring"))
    for item in [
        "Signed service agreement (one copy to leave with client)",
        "Certificate of Insurance (COI) — some facilities require",
        "Walkthrough checklist / field template",
        "Business cards (2–3 minimum)",
        "Blank NDA (optional — for guarded clients)",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Gear (non-negotiable)"))

    # Two-column gear list
    gear_left = [
        "Hard hat",
        "Safety glasses + spare pair",
        "High-vis vest",
        "Steel-toe boots",
        "Hearing protection (foam plugs)",
        "N95 / disposable dust masks",
    ]
    gear_right = [
        "Phone — full battery + portable charger",
        "25-ft tape measure",
        "Small flashlight",
        "Clipboard or iPad",
        "Black pens (3+)",
        "Notebook",
    ]

    gear_rows = []
    max_len = max(len(gear_left), len(gear_right))
    for i in range(max_len):
        left = checkbox_item(gear_left[i]) if i < len(gear_left) else ""
        right = checkbox_item(gear_right[i]) if i < len(gear_right) else ""
        gear_rows.append([left, right])

    gear_table = Table(gear_rows, colWidths=[3.6 * inch, 3.6 * inch])
    gear_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(gear_table)

    story.append(note("Don't bring: laptop, marketing handouts, opinions before you've seen the floor."))

    # ── SECTION 2 — ARRIVING ON SITE ──
    story.append(section("2 — Arriving on Site"))

    story.append(subsection("First 5 minutes"))
    for item in [
        "Park where they tell you — not the closest spot",
        "Sign in at front desk or guard shack (always)",
        "Ask for site-specific safety briefing before walking",
        "Put PPE on outside or in lobby, not on the floor",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("First conversation with owner / manager"))
    for item in [
        "\"Walk me through what you want me to look at.\"",
        "\"Any specific concerns that prompted the call?\"",
        "\"Anything you want me to stay out of?\"",
        "\"Who should I not pull aside for questions?\"",
        "Listen 10 min. Don't pitch. Don't reassure.",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Set expectations"))
    for item in [
        "\"I'll be here ~2 hours. I'll take photos. Report goes to you — nobody else.\"",
        "\"If I see something urgent, I'll tell you before I leave.\"",
        "\"I won't interrupt production. I'll clear it with you before pulling operators aside.\"",
    ]:
        story.append(checkbox_item(item))

    # Page break before on-site walk
    story.append(PageBreak())

    # ── SECTION 3 — DURING THE WALKTHROUGH ──
    story.extend(header_block())
    story.append(section("3 — During the Walkthrough"))

    story.append(subsection("Mental model"))
    story.append(note(
        "You're not auditing. You're pattern-matching — this floor vs. 25 years of floors. "
        "Find the 6–10 findings that matter. Don't flinch at what you see. Owner is watching your face."
    ))

    story.append(subsection("Photos to capture"))
    for item in [
        "Every cited issue — wide shot + close-up (2 photos min per finding)",
        "5–10 context photos (aisles, storage zones, general layout)",
        "Positives too — clean LOTO stations, good eyewash, etc.",
        "Never photograph employees' faces (waist-down or from behind)",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Document every finding"))
    for item in [
        "1-line description (e.g., \"EP-3 panel ~50% blocked by cardboard\")",
        "OSHA citation reference (clean up at office if uncertain)",
        "Severity: High / Medium / Low",
        "Recommended fix in plain language",
        "Owner's response if present (\"Owner said temporary — verify 30 days\")",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Questions to ask operators (with owner's permission)"))
    for item in [
        "\"How long have you worked here?\"",
        "\"What's the most dangerous thing you do in a day?\"",
        "\"When was your last forklift refresher?\"",
        "\"Do you know where the SDS binder is?\"",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Areas commonly missed on first pass"))
    for item in [
        "Electrical rooms / panels (90% of small ops have something blocking)",
        "Mezzanines and rooftop access",
        "Parking lot / loading dock (forklift-pedestrian interactions)",
        "Outdoor chemical storage",
        "Bathrooms (eyewash, PPE signage)",
        "Break rooms (food storage, blocked exits)",
    ]:
        story.append(checkbox_item(item))

    # ── SECTION 4 — WRAPPING UP ON SITE ──
    story.append(section("4 — Wrapping Up on Site (10 min)"))
    for item in [
        "\"Here's what I saw. Top 3 before I leave so you're not waiting on the full report.\"",
        "Share 3 findings verbally, most urgent first. Specific. No jargon.",
        "\"Anything I should know that I missed?\"",
        "\"Full written report to you within 48 hours.\"",
        "Hand business card. Shake hands. Leave.",
    ]:
        story.append(checkbox_item(item))

    story.append(note(
        "Don't pitch additional services. Don't write the report at their kitchen table. "
        "Don't promise turnaround times you can't hit."
    ))

    # ── SECTION 5 — POST-VISIT (24–48 HOURS) ──
    story.append(section("5 — After the Visit (24–48 hrs)"))

    story.append(subsection("Within 2 hours of leaving"))
    for item in [
        "Back up photos to 2 places (phone + cloud)",
        "Type up handwritten notes while fresh (20 min now saves 2 hours later)",
        "Flag uncertain OSHA cites — look up before report lands",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Report writing"))
    for item in [
        "Lead with top 3–5 findings — prioritize by severity, not order observed",
        "Each finding: photo + 1-line desc + CFR ref + plain-language fix + priority",
        "End with 1-page \"quick wins\" (fix-by-Friday under $500)",
        "Proofread twice. Then once more. Typos kill credibility.",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("Delivery"))
    for item in [
        "Upload PDF via Admin Dashboard — auto-triggers client \"Report Ready\" email",
        "Do NOT email the PDF as attachment — use /report/{token} secure link",
    ]:
        story.append(checkbox_item(item))

    story.append(subsection("48 hours after delivery — send a text"))
    text_box_data = [[Paragraph(
        '"Hey [Name] — circling back on the GigLine report. Any questions as you read through it? '
        'Happy to jump on a 10-min call. — Vince"',
        styles["priority_box"]
    )]]
    text_box = Table(text_box_data, colWidths=[7.2 * inch])
    text_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_GRAY),
        ("BOX", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(text_box)
    story.append(note("Converts 15–20% of one-time walkthroughs into repeat engagements or referrals. Nobody else does it."))

    # ── THE THREE RULES ──
    story.append(section("The Three Rules"))
    rules_data = [
        ["1", Paragraph(
            "<b>Silence on the floor.</b> Walk. Look. Note. Owners interpret silence as expertise.",
            styles["item"]
        )],
        ["2", Paragraph(
            "<b>Plain language in the report.</b> \"Move the cardboard\" beats any OSHA citation verbatim.",
            styles["item"]
        )],
        ["3", Paragraph(
            "<b>Show up when you said you would.</b> On time. In uniform. COI in hand.",
            styles["item"]
        )],
    ]
    rules_table = Table(rules_data, colWidths=[0.4 * inch, 6.8 * inch])
    rules_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (0, -1), 12),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(rules_table)

    # ── FOOTER ──
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY, spaceAfter=6))
    story.append(Paragraph(
        "GigLine Safety &amp; Compliance &nbsp;&bull;&nbsp; giglinecompliance.com &nbsp;&bull;&nbsp; "
        "Internal field reference — not a client deliverable",
        styles["footer"]
    ))

    doc.build(story)
    print(f"\u2713 Generated: {OUT_PATH}")
    size_kb = os.path.getsize(OUT_PATH) / 1024
    print(f"  Size: {size_kb:.1f} KB")


if __name__ == "__main__":
    build()
