"""Server-side agreement PDF generator — GL-PORT-001 Section B."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO


AGREEMENT_SECTIONS = [
    ("Scope", "One on-site safety walkthrough at the address provided by the Client. The walkthrough covers a visual assessment of workplace safety conditions, compliance gaps, and hazard exposures."),
    ("Deliverable", "A written Safety Check PDF report delivered within 48-72 hours of the on-site walkthrough. The report includes findings, photographs, and a prioritized corrective action list."),
    ("Exclusions", "This engagement does not include: program rewrites, incident investigation, new safety program development, engineering assessments, or industrial hygiene sampling. These services are available as separate engagements."),
    ("Payment", "Payment is collected via Stripe at the time of booking and is non-refundable after the walkthrough has been conducted. If the walkthrough is cancelled by the Client more than 48 hours before the scheduled date, a full refund will be issued."),
    ("Relationship", "GigLine Safety & Compliance operates as an independent contractor. Nothing in this agreement creates an employer-employee, agency, or joint venture relationship between GigLine and the Client."),
    ("Governing Law", "This agreement is governed by the laws of the State of North Carolina."),
]

RETAINER_SECTION = ("Retainer Terms", "If a compliance retainer is selected: the retainer operates on a month-to-month basis after an initial 6-month minimum commitment. Either party may cancel with 30 days written notice after the minimum term. The retainer includes scheduled walkthroughs, remote support hours, and micro-project capacity as described in the selected tier. Full program builds and new program development are always quoted separately.")


def generate_agreement_pdf(typed_name, company, tier, add_retainer, timestamp):
    """Generate a signed service agreement PDF. Server-side only."""
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch, leftMargin=0.75*inch, rightMargin=0.75*inch)

    styles = getSampleStyleSheet()
    gold = HexColor("#B8972C")
    dark = HexColor("#1C2B2B")

    title_style = ParagraphStyle('AgreementTitle', parent=styles['Heading1'], fontSize=18, textColor=dark, spaceAfter=6)
    sub_style = ParagraphStyle('AgreementSub', parent=styles['Normal'], fontSize=10, textColor=HexColor("#888888"), spaceAfter=20)
    heading_style = ParagraphStyle('SectionHead', parent=styles['Heading2'], fontSize=12, textColor=gold, spaceBefore=16, spaceAfter=6)
    body_style = ParagraphStyle('SectionBody', parent=styles['Normal'], fontSize=10, textColor=dark, leading=14, spaceAfter=8)
    sig_style = ParagraphStyle('Signature', parent=styles['Normal'], fontSize=12, textColor=dark, leading=16)
    stamp_style = ParagraphStyle('Stamp', parent=styles['Normal'], fontSize=9, textColor=HexColor("#888888"), leading=12)

    elements = []

    elements.append(Paragraph("GigLine Safety &amp; Compliance", title_style))
    elements.append(Paragraph("Service Agreement", sub_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=gold, spaceAfter=16))

    elements.append(Paragraph(f"<b>Client:</b> {company}", body_style))
    elements.append(Paragraph(f"<b>Service Tier:</b> {tier.capitalize()}", body_style))
    elements.append(Paragraph(f"<b>Date:</b> {timestamp.strftime('%B %d, %Y')}", body_style))
    elements.append(Spacer(1, 12))

    for title, body in AGREEMENT_SECTIONS:
        elements.append(Paragraph(title, heading_style))
        elements.append(Paragraph(body, body_style))

    if add_retainer:
        elements.append(Paragraph(RETAINER_SECTION[0], heading_style))
        elements.append(Paragraph(RETAINER_SECTION[1], body_style))

    elements.append(Spacer(1, 24))
    elements.append(HRFlowable(width="100%", thickness=1, color=HexColor("#DDDDDD"), spaceAfter=16))

    elements.append(Paragraph("Signed electronically:", stamp_style))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(f"<b><i>{typed_name}</i></b>", sig_style))
    elements.append(Paragraph(f"on behalf of {company}", stamp_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Date &amp; time: {timestamp.strftime('%B %d, %Y at %I:%M %p UTC')}", stamp_style))
    elements.append(Paragraph("Method: Typed signature via giglinecompliance.com", stamp_style))

    elements.append(Spacer(1, 24))
    elements.append(HRFlowable(width="100%", thickness=1, color=HexColor("#DDDDDD"), spaceAfter=8))
    elements.append(Paragraph("GigLine Safety &amp; Compliance | Vince Lawrence | (336) 329-8899 | vince@giglinecompliance.com", stamp_style))

    doc.build(elements)
    return buf.getvalue()
