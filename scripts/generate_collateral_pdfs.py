"""
Generates 3 client-facing PDFs for GigLine Safety & Compliance (Feb 2026):

  1. gl-faq-2026.pdf                    — Curated 26 FAQ deck
  2. gl-pricing-2026.pdf                — 2026 Pricing Schedule
  3. gl-osha-inspection-guide-2026.pdf  — Full OSHA Inspection Guide

Brand palette is strict:
  #102A43  — deep navy (hero / cover)
  #2A52A0  — bright navy (section headers, dividers, CTAs)
  #C9A84C  — gold (eyebrow rules, accents)

Outputs land in /app/frontend/public/assets/ so they can be linked or
auto-served by Resend / MailerLite automations.
"""

import os
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ─────────────────────────────────────────────────────────────────────────
# Brand
# ─────────────────────────────────────────────────────────────────────────
NAVY_DEEP   = colors.HexColor('#102A43')
NAVY_BRIGHT = colors.HexColor('#2A52A0')
GOLD        = colors.HexColor('#C9A84C')
PAPER       = colors.HexColor('#F9F8F6')
INK         = colors.HexColor('#1C2B2B')
MUTED       = colors.HexColor('#5A6671')
RULE        = colors.HexColor('#DDE3EA')
WHITE       = colors.white

ASSET_DIR = '/app/frontend/public/assets'
os.makedirs(ASSET_DIR, exist_ok=True)

YEAR_STAMP = 'February 2026'

# ─────────────────────────────────────────────────────────────────────────
# Styles
# ─────────────────────────────────────────────────────────────────────────
def styles():
    return {
        'cover_eyebrow': ParagraphStyle(
            'cover_eyebrow', fontName='Helvetica-Bold', fontSize=9,
            leading=12, textColor=GOLD, alignment=TA_LEFT,
            spaceAfter=18,
        ),
        'cover_title': ParagraphStyle(
            'cover_title', fontName='Times-Bold', fontSize=34,
            leading=40, textColor=WHITE, alignment=TA_LEFT,
            spaceAfter=18,
        ),
        'cover_sub': ParagraphStyle(
            'cover_sub', fontName='Helvetica', fontSize=13,
            leading=19, textColor=colors.HexColor('#B8C5D6'),
            alignment=TA_LEFT, spaceAfter=28,
        ),
        'cover_meta': ParagraphStyle(
            'cover_meta', fontName='Helvetica', fontSize=9,
            leading=14, textColor=colors.HexColor('#8FA0B6'),
            alignment=TA_LEFT,
        ),
        'h1': ParagraphStyle(
            'h1', fontName='Times-Bold', fontSize=22, leading=27,
            textColor=NAVY_DEEP, spaceBefore=0, spaceAfter=10,
        ),
        'h2': ParagraphStyle(
            'h2', fontName='Times-Bold', fontSize=15, leading=20,
            textColor=NAVY_DEEP, spaceBefore=14, spaceAfter=6,
        ),
        'eyebrow': ParagraphStyle(
            'eyebrow', fontName='Helvetica-Bold', fontSize=8,
            leading=11, textColor=NAVY_BRIGHT, spaceAfter=4,
        ),
        'body': ParagraphStyle(
            'body', fontName='Helvetica', fontSize=10.5, leading=15.5,
            textColor=INK, spaceAfter=6, alignment=TA_LEFT,
        ),
        'body_tight': ParagraphStyle(
            'body_tight', fontName='Helvetica', fontSize=10, leading=14,
            textColor=INK, spaceAfter=2, alignment=TA_LEFT,
        ),
        'body_muted': ParagraphStyle(
            'body_muted', fontName='Helvetica-Oblique', fontSize=9.5,
            leading=13, textColor=MUTED, spaceAfter=4,
        ),
        'faq_q': ParagraphStyle(
            'faq_q', fontName='Times-Bold', fontSize=12, leading=16,
            textColor=NAVY_DEEP, spaceBefore=10, spaceAfter=5,
            keepWithNext=1,
        ),
        'faq_a': ParagraphStyle(
            'faq_a', fontName='Helvetica', fontSize=10, leading=14.5,
            textColor=INK, spaceAfter=8, alignment=TA_LEFT,
        ),
        'callout': ParagraphStyle(
            'callout', fontName='Helvetica-Bold', fontSize=10.5,
            leading=15, textColor=NAVY_DEEP, spaceAfter=6,
        ),
        'footer': ParagraphStyle(
            'footer', fontName='Helvetica', fontSize=8, leading=10,
            textColor=MUTED, alignment=TA_CENTER,
        ),
        'price_big': ParagraphStyle(
            'price_big', fontName='Times-Bold', fontSize=18, leading=22,
            textColor=NAVY_BRIGHT, spaceAfter=2,
        ),
        'price_label': ParagraphStyle(
            'price_label', fontName='Helvetica-Bold', fontSize=10,
            leading=14, textColor=NAVY_DEEP, spaceAfter=2,
        ),
    }


S = styles()


# ─────────────────────────────────────────────────────────────────────────
# Page chrome
# ─────────────────────────────────────────────────────────────────────────
def draw_cover_chrome(canvas, doc, title_lines, eyebrow_text, subtitle):
    """Solid navy hero on page 1. The Frame holds the title/eyebrow text."""
    canvas.saveState()
    w, h = LETTER
    canvas.setFillColor(NAVY_DEEP)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    # Gold accent rule near the top
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)
    canvas.line(0.75 * inch, h - 0.9 * inch, 1.4 * inch, h - 0.9 * inch)
    # Wordmark bottom-left
    canvas.setFillColor(WHITE)
    canvas.setFont('Times-Bold', 11)
    canvas.drawString(0.75 * inch, 0.85 * inch, 'GigLine Safety & Compliance')
    canvas.setFillColor(colors.HexColor('#8FA0B6'))
    canvas.setFont('Helvetica', 8)
    canvas.drawString(0.75 * inch, 0.65 * inch,
                      'Kernersville, NC  ·  (336) 329-8899  ·  giglinecompliance.com')
    # Issue date bottom-right
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#8FA0B6'))
    canvas.drawRightString(w - 0.75 * inch, 0.65 * inch, f'Issued {YEAR_STAMP}')
    canvas.restoreState()


def draw_content_chrome(canvas, doc, running_title):
    """Header + footer for content pages."""
    canvas.saveState()
    w, h = LETTER
    # Header rule
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, h - 0.75 * inch, w - 0.75 * inch, h - 0.75 * inch)
    # Header text
    canvas.setFont('Helvetica-Bold', 8)
    canvas.setFillColor(NAVY_DEEP)
    canvas.drawString(0.75 * inch, h - 0.6 * inch, 'GIGLINE SAFETY & COMPLIANCE')
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(w - 0.75 * inch, h - 0.6 * inch, running_title)
    # Footer rule
    canvas.setStrokeColor(RULE)
    canvas.line(0.75 * inch, 0.75 * inch, w - 0.75 * inch, 0.75 * inch)
    # Footer
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.75 * inch, 0.55 * inch,
                      'Vince Lawrence  ·  OSHA 30-Hour Certified  ·  Kernersville, NC')
    canvas.drawRightString(w - 0.75 * inch, 0.55 * inch, f'Page {canvas.getPageNumber()}')
    canvas.restoreState()


def build_doc(path, running_title, cover_eyebrow, cover_title, cover_sub, story):
    """Wires up a two-template document: navy cover + standard content pages."""
    doc = BaseDocTemplate(
        path,
        pagesize=LETTER,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.9 * inch,
        title=running_title,
        author='GigLine Safety & Compliance',
    )

    cover_frame = Frame(
        0.9 * inch, 1.5 * inch,
        LETTER[0] - 1.8 * inch, LETTER[1] - 3.6 * inch,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        id='cover',
    )
    content_frame = Frame(
        0.75 * inch, 0.85 * inch,
        LETTER[0] - 1.5 * inch, LETTER[1] - 1.7 * inch,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        id='content',
    )

    doc.addPageTemplates([
        PageTemplate(
            id='Cover', frames=[cover_frame],
            onPage=lambda c, d: draw_cover_chrome(c, d, cover_title, cover_eyebrow, cover_sub),
        ),
        PageTemplate(
            id='Content', frames=[content_frame],
            onPage=lambda c, d: draw_content_chrome(c, d, running_title),
        ),
    ])

    # Inject cover content as the first story flowables
    cover_flow = [
        Spacer(1, 1.4 * inch),
        Paragraph(cover_eyebrow, S['cover_eyebrow']),
        Paragraph(cover_title, S['cover_title']),
        Paragraph(cover_sub, S['cover_sub']),
        Paragraph(
            'Vince Lawrence &nbsp;·&nbsp; OSHA 30-Hour Certified &nbsp;·&nbsp; '
            '25+ Years in Manufacturing, Fleet &amp; Warehouse Safety',
            S['cover_meta']
        ),
    ]
    from reportlab.platypus import NextPageTemplate
    full_story = cover_flow + [NextPageTemplate('Content'), PageBreak()] + story
    doc.build(full_story)


# ═════════════════════════════════════════════════════════════════════════
# Document 1 — 26 FAQ
# ═════════════════════════════════════════════════════════════════════════
FAQ_26 = [
    ('How much does an OSHA safety walkthrough cost in North Carolina?',
     "GigLine safety walkthroughs start at $1,200. Price is scoped based on square footage, machine count, employee count, and hazard complexity. Fixed quote before scheduling. No hourly billing, no retainer, no surprise invoice. For context: a single OSHA serious violation can cost up to $16,550 per citation (2026 adjusted rate). The walkthrough identifies what may be reviewed before an inspector does."),
    ('What does an OSHA safety consultant do on-site?',
     "During a GigLine Safety Walkthrough, Vince Lawrence — OSHA 30-Hour Certified safety compliance consultant based in Kernersville, NC — walks every area of your facility. He photographs findings, documents each one against the applicable CFR standard, and provides an estimated penalty exposure based on OSHA published maximums. Within 48 hours you receive a written report with photo documentation, CFR citations, and a prioritized list of corrective actions. The engagement is private — findings are not shared, published, or referenced without written permission."),
    ('How do I prepare for an OSHA inspection in a small manufacturing plant?',
     "The most effective preparation is a third-party walkthrough before OSHA arrives. OSHA inspections are triggered by employee complaints, referrals, fatalities, or programmed inspections — they do not announce in advance. A GigLine Safety Walkthrough gives you a written report of the conditions an inspector may review, documented against the same standards OSHA uses. The walkthrough starts at $1,200."),
    ('What is a Compliance Readiness Visit?',
     "GigLine's most complete single engagement. Combines the Safety Walkthrough and Documentation Review in one on-site visit. One consolidated written report covers both physical findings and documentation gaps, with a prioritized corrective action plan. Starts at $2,000. Booking the two services separately starts at $2,500."),
    ('What is the difference between a Safety Walkthrough and a Compliance Readiness Visit?',
     "The Safety Walkthrough covers the physical floor — starts at $1,200, report within 48 hours. The CRV adds a full documentation review to the same visit — written programs, training records, HazCom binder, OSHA 300 log — starts at $2,000. If unsure, the walkthrough is the lower-barrier starting point."),
    ("What's included in a GigLine safety walkthrough?",
     'A GigLine safety walkthrough includes a 1–3-hour on-site review, photo-documented safety observations, OSHA-related references where applicable, and a written "Top 10 Fixes" report delivered within 48 hours. Findings are color-coded: RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well.'),
    ('How long does a safety walkthrough take on-site?',
     'Most walkthroughs take 1 to 3 hours on-site. A small shop under 10,000 sq ft may take less than an hour. Larger warehouses, production floors, or multi-area operations may take 2 to 3 hours or require a larger scoped visit. You will receive a time estimate before the visit.'),
    ("What's the difference between a safety walkthrough and an OSHA inspection?",
     'An OSHA inspection is performed by a federal or state compliance officer and may result in citations, penalties, and required abatement. A GigLine safety walkthrough is a private, voluntary review performed by an independent consultant. Findings are delivered only to you — nothing is reported to OSHA, your insurance carrier, or any third party.'),
    ('Do I need a written HazCom program if I have fewer than 10 employees?',
     'In most cases, yes. Under OSHA 29 CFR 1910.1200, employers with hazardous chemicals in the workplace must maintain a written Hazard Communication program, regardless of headcount. Exceptions are limited and generally apply only to sealed consumer-packaged products used in the same way a household consumer would use them.'),
    ('What areas of North Carolina does GigLine serve?',
     'GigLine is based in Kernersville, NC and serves the Piedmont Triad, including Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, and surrounding communities. Most on-site work is scheduled within roughly 60 miles of Winston-Salem. Charlotte and Raleigh metro engagements may be considered based on scope and travel.'),
    ('Will GigLine report findings to OSHA?',
     'No. GigLine engagements are private. The written report is delivered to the client only. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency as part of a standard walkthrough or documentation review.'),
    ('How fast do I get my walkthrough report?',
     'Reports are typically delivered within 48 hours of the on-site visit. The report is provided as a PDF and may include photos, OSHA-related references where applicable, and prioritized corrective action recommendations. Many clients receive the report by the next business day.'),
    ('What is a "Top 10 Fixes" report?',
     'The GigLine deliverable for a safety walkthrough. It ranks the ten most important findings from your on-site visit — RED for urgent, AMBER for near-term, GREEN for what your team is doing well. Each item includes what was observed, why it matters, the OSHA-related reference, and a recommended corrective action.'),
    ('Can I see a sample safety walkthrough report before I book?',
     'Yes. Email vince@giglinecompliance.com or call (336) 329-8899 and request a sanitized sample. Sensitive client details are redacted, but the structure, depth, and OSHA references are identical to what you will receive.'),
    ('What industries does GigLine typically work with?',
     'Small manufacturers, warehouses, distribution centers, fleet operations, general contractors, and specialty trades. Most clients have 5 to 100 employees. The common thread is operations that do not have a full-time safety manager.'),
    ('Is Vince Lawrence OSHA certified?',
     'Vince Lawrence is OSHA 30-Hour Certified in General Industry and has 25+ years of hands-on experience in manufacturing, fleet, and warehouse safety. He is also a U.S. Navy veteran. GigLine is owner-operated — every walkthrough and report is performed personally by Vince.'),
    ('What happens if OSHA shows up after my walkthrough?',
     'You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. A documented corrective-action log may help show good-faith effort, which can matter during an OSHA inspection. Documentation is the single biggest factor in how an OSHA visit goes.'),
    ('Do you offer follow-up walkthroughs for past clients?',
     'Yes. Follow-up walkthroughs for past clients are offered at a reduced rate. Ongoing support is also available through Quarterly Compliance Maintenance ($950/quarter) and the Annual Compliance Control Partner program ($12,000/year — $1,000/month equivalent), which includes two walkthroughs, four documentation reviews, quarterly review calls, and direct on-call access between visits.'),
    ('How should I prepare for a safety walkthrough?',
     'Nothing special. Do not stage, clean up, or hide anything — the walkthrough is most valuable when the floor looks the way it normally does. Have your written safety programs, SDS binder, and training records accessible. A brief floor manager or supervisor introduction at the start helps.'),
    ('How do I book a safety walkthrough with GigLine?',
     "Visit giglinecompliance.com/intake and fill the four-field form, or call (336) 329-8899 directly. You'll hear back within one business day with scheduling options and a confirmed price."),
    ("What's actually delivered in a Compliance Readiness Visit?",
     "The Compliance Readiness Visit (from $2,000) is GigLine's most-requested engagement. You receive: (1) a full on-site walkthrough of production floor, storage, chemical areas, and egress routes — 2 to 4 hours depending on facility size; (2) a structured review of written safety programs, training records, OSHA 300/300A/301 logs, inspection records, and SDS inventory using a 53-item checklist across 7 OSHA categories; (3) an 18-page CFR-cited audit report within 48 hours; (4) a single compliance percentage score for floor and files combined; (5) a 90-day remediation tracker pre-populated and ready to assign to supervisors; (6) a 'What to Say If OSHA Calls' guidance sheet; and (7) a 30-day check-in call. Fixed quote. Private engagement. No retainer."),
    ('Who is the Annual Compliance Control Partner program designed for?',
     "The Annual Compliance Control Partner ($12,000/year — $1,000/month equivalent) is designed for operations that want a compliance partner they can call — not just a one-time report. Best fit: facilities with 25+ employees, multiple shifts, or recurring customer-audit requirements where OSHA exposure is ongoing. Includes two full Safety Walkthroughs per year, four Documentation Reviews per year, four Quarterly Review Calls (30 minutes each), OSHA 300A posting reminders, a pre-inspection readiness review, on-call access between visits, and an annual written management safety review."),
    ('Can GigLine write the safety programs we are missing?',
     'Yes. The Document Development service writes the written programs your operation is missing or that the OSHA Documentation Readiness Review flagged as insufficient. Most-requested programs: Lockout/Tagout (LOTO) with machine-specific procedures, Hazard Communication (HazCom), PPE Hazard Assessment, and Emergency Action Plan (EAP). Pricing is fixed-quote, scoped to your actual gap list. A single program starts at $350, LOTO with up to five machine-specific procedures starts at $650, and a full written program suite (5+ programs) starts at $2,000.'),
    ('How does Quarterly Compliance Maintenance work?',
     'Quarterly Compliance Maintenance ($950/quarter) keeps the safety system current between annual walkthroughs. Each quarter GigLine performs a documentation review (training records, OSHA 300 log, written program review, SDS inventory check), a corrective action tracker review, and a brief site visit if any changes warrant one. The quarterly cadence keeps small documentation gaps from becoming citation-level exposures.'),
    ('Should I fix everything before you come?',
     'No. Showing GigLine a sanitized version of the operation defeats the purpose. The walkthrough is built to surface what your team has stopped seeing — the pallet in the pedestrian lane, the unlabeled spray bottle, the SDS that nobody can find under pressure. Cleaning up beforehand hides exactly the issues you are paying to identify. If something is unsafe enough to be an immediate injury risk, fix it first — otherwise let the floor speak for itself.'),
    ('Can you help after an incident but before OSHA contacts us?',
     'Yes. Post-incident, pre-inspection support is one of the most time-sensitive engagements GigLine handles. After a recordable injury, near-miss, or employee complaint, there is typically a window before OSHA, the insurance carrier, or a customer auditor follows up. A walkthrough during that window helps document the corrective action path, identify any related exposures the incident surfaced, and produce a written record showing the operation took the issue seriously. Call (336) 329-8899 directly if the situation is time-critical — same-week scheduling can usually be accommodated.'),
]


def build_faq_pdf():
    out = os.path.join(ASSET_DIR, 'gl-faq-2026.pdf')

    story = []
    story.append(Paragraph('THE 26 QUESTIONS WE GET MOST', S['eyebrow']))
    story.append(Paragraph('Frequently Asked Questions', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10, spaceBefore=2))
    story.append(Paragraph(
        'A curated 26-question deck for HR managers, plant managers, and operations '
        'leaders evaluating a GigLine engagement. Every answer is current as of February '
        '2026 and mirrors the language used on giglinecompliance.com.',
        S['body']
    ))
    story.append(Spacer(1, 12))

    for i, (q, a) in enumerate(FAQ_26, start=1):
        block = [
            Paragraph(f'{i:02d}.  {q}', S['faq_q']),
            Paragraph(a, S['faq_a']),
            HRFlowable(width='100%', thickness=0.3, color=RULE, spaceAfter=2),
        ]
        story.append(KeepTogether(block))

    # Closing CTA
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width='100%', thickness=1.2, color=NAVY_BRIGHT, spaceAfter=10))
    story.append(Paragraph('Ready to schedule a walkthrough?', S['h2']))
    story.append(Paragraph(
        'One on-site visit. A written report within 48 hours. Starting at $1,200. '
        'Call (336) 329-8899 or visit <b>giglinecompliance.com/intake</b>.',
        S['body']
    ))

    build_doc(
        path=out,
        running_title='2026 FAQ',
        cover_eyebrow='THE 26 QUESTIONS WE GET MOST  ·  EDITION 2026',
        cover_title='Straight answers about OSHA safety walkthroughs.',
        cover_sub='What HR managers, plant managers, and small-operation owners ask before they book — answered without consultant fluff.',
        story=story,
    )
    print('✓', out)


# ═════════════════════════════════════════════════════════════════════════
# Document 2 — 2026 Pricing Schedule
# ═════════════════════════════════════════════════════════════════════════
SERVICES = [
    {
        'name': 'Safety Walkthrough',
        'price': 'From $1,200',
        'duration': '1–3 hours on-site · Report within 48 hours',
        'desc': 'Photo-documented walkthrough of the physical floor. CFR-cited "Top 10 Fixes" report (RED / AMBER / GREEN) with estimated penalty exposure based on OSHA published maximums.',
        'inc': [
            'On-site walkthrough (1–3 hours)',
            'Photo-documented hazard findings',
            'CFR citations + estimated penalty exposure',
            'Top 10 priority findings, RED / AMBER / GREEN',
            'Delivered within 24–48 hours',
            'Fixed quote before scheduling',
        ],
        'best': 'Operations that want to know where they stand on the floor before OSHA, an insurer, or a customer auditor arrives.',
    },
    {
        'name': 'OSHA Documentation Readiness Review',
        'price': 'From $1,300',
        'duration': 'Same-day on-site review · Audit report within 48 hours',
        'desc': 'Structured review of written programs, training records, OSHA logs, and SDS compliance using a 53-item checklist across 7 OSHA categories.',
        'inc': [
            'Written safety programs (LOTO, HazCom, PPE, EAP)',
            'Training records by employee and role',
            'OSHA 300 / 300A / 301 logs',
            'Inspection and maintenance records',
            'SDS inventory and compliance',
            'Compliance percentage score + prioritized corrective action sequence',
        ],
        'best': 'Operations preparing for an audit, insurance review, or customer pre-qualification.',
    },
    {
        'name': 'Compliance Readiness Visit (CRV)',
        'price': 'From $2,000',
        'duration': 'Combined walkthrough + documentation review · Report within 48 hours',
        'desc': "GigLine's most-requested engagement. One on-site visit covering both the floor and the files. 18-page CFR-cited audit report. 90-day remediation tracker. 30-day check-in call.",
        'inc': [
            'Full on-site walkthrough (2–4 hours)',
            '53-item documentation audit across 7 OSHA categories',
            '18-page CFR-cited audit report',
            'Single compliance percentage score (floor + files)',
            '90-day remediation tracker, pre-populated',
            '"What to Say If OSHA Calls" guidance sheet',
            '30-day check-in call',
            'Supervisor Safety Starter System (11 documents) included',
        ],
        'best': 'Operations wanting one consolidated picture of both physical hazards and documentation gaps before they decide what to fix first.',
    },
    {
        'name': 'Incident Review & Corrective Action Support',
        'price': 'From $1,500',
        'duration': 'Same-week response · Time-sensitive',
        'desc': 'Post-injury or post-near-miss response. Root cause analysis, OSHA recordability determination, and a documented corrective action plan — reviewed before paperwork or outside conversations begin.',
        'inc': [
            'Root cause analysis on-site',
            'OSHA recordability determination',
            'OSHA 301 completion',
            'Corrective action plan with documented closure',
            'Same-week scheduling',
            'Private engagement',
        ],
        'best': 'Operations responding to a recordable injury, near-miss, or OSHA inquiry that need expert review before paperwork is filed.',
    },
    {
        'name': 'OSHA-Ready Control System',
        'price': 'From $4,500',
        'duration': '60–90 days · Built to your operation',
        'desc': 'A defensible, organized safety control system: written programs, training matrix, OSHA log infrastructure, supervisor station cards, and a 12-month compliance calendar — built so the system survives turnover.',
        'inc': [
            'CRV included as baseline',
            'All gap-flagged written programs built',
            'Training matrix by role',
            '12-month compliance calendar',
            'Supervisor station cards installed',
            'Handoff training for the assigned safety lead',
        ],
        'best': 'Operations that have already done a walkthrough or CRV and want the documentation organized into a system, not a binder.',
    },
    {
        'name': 'Document Development',
        'price': 'Quoted after Documentation Readiness Review',
        'duration': '2–6 weeks per program suite',
        'desc': 'Written programs scoped to your actual gaps and operation. Not a generic template pack.',
        'inc': [
            ['Single written program', 'From $350'],
            ['LOTO program + up to 5 machine procedures', 'From $650'],
            ['LOTO program + 6–15 machine procedures', 'From $1,200'],
            ['Full written program suite (5+ programs)', 'From $2,000'],
        ],
        'best': 'Operations whose Documentation Readiness Review surfaced missing or insufficient written programs.',
        'inc_as_table': True,
    },
    {
        'name': 'Quarterly Compliance Maintenance',
        'price': '$950 / quarter',
        'duration': 'Recurring · Cancel any quarter',
        'desc': 'Keep the safety system current between annual walkthroughs. Light cadence — designed for small operations that do not generate a month of compliance work between visits.',
        'inc': [
            'Documentation review',
            'Training record audit',
            'SDS inventory check',
            'Corrective action tracker review',
            'Brief site visit if changes warrant one',
        ],
        'best': 'Operations that want the system kept alive after the Control System is built.',
    },
    {
        'name': 'Annual Compliance Control Partner',
        'price': '$12,000 / year  ($1,000 / month equivalent)',
        'duration': '12 months · Highest-value engagement',
        'desc': 'An active compliance relationship — not a retainer that sits in a drawer. Standalone value of scheduled services exceeds $7,600 alone; the additional $4,400 covers the on-call relationship.',
        'inc': [
            'Two Safety Walkthroughs per year (value $2,400)',
            'Four Documentation Reviews per year (value $5,200)',
            'Four Quarterly Review Calls (30 minutes each)',
            'OSHA 300A posting reminders',
            'Pre-inspection readiness review',
            'On-call access to Vince between visits',
            'Annual written management safety review',
        ],
        'best': 'Operations with 25+ employees, multiple shifts, or recurring customer-audit requirements that want a consultant they can call.',
    },
]

INDUSTRY_PACKAGES = [
    {
        'industry': 'Small Manufacturing',
        'profile': '5–100 employees · single shift · 5,000–60,000 sq ft · machine guarding, LOTO, HazCom, PPE-driven.',
        'starter': ('Walkthrough + HazCom Refresh', '$1,400'),
        'best':    ('Compliance Readiness Visit',   '$2,400'),
        'premium': ('Annual Compliance Partner',    '$12,000 / yr'),
        'notes':   'Most-requested package. Pricing assumes ≤60,000 sq ft and ≤25 machines.',
    },
    {
        'industry': 'Warehousing & Distribution',
        'profile': '10–150 employees · forklift-heavy · racking, dock, pedestrian-traffic exposure.',
        'starter': ('Walkthrough + Forklift Records Audit', '$1,500'),
        'best':    ('CRV + Forklift Program Buildout',      '$2,800'),
        'premium': ('Annual Compliance Partner',            '$12,000 / yr'),
        'notes':   'Forklift recertification calendar maintained inside the Annual Partner program.',
    },
    {
        'industry': 'General Contracting & Trades',
        'profile': 'Field crews · multi-site · OSHA 1926 construction standards apply in addition to 1910 on the yard.',
        'starter': ('Yard Walkthrough + Doc Review',       '$1,600'),
        'best':    ('CRV + 1926 Written Program Buildout', '$3,200'),
        'premium': ('Annual Compliance Partner (multi-site)', '$15,000 / yr'),
        'notes':   'Multi-site engagements scoped per site; jobsite-trailer documentation included.',
    },
    {
        'industry': 'Fleet & Transportation Yards',
        'profile': 'DOT-adjacent · OSHA general industry rules apply to the yard, shop, and fueling areas.',
        'starter': ('Yard + Shop Walkthrough',           '$1,400'),
        'best':    ('CRV (yard + shop + driver-room files)', '$2,600'),
        'premium': ('Annual Compliance Partner',          '$12,000 / yr'),
        'notes':   'DOT compliance is separate; GigLine focuses on the OSHA-1910 surface area only.',
    },
    {
        'industry': 'Metal Fabrication & Welding',
        'profile': 'Hot work, hex chrome, respiratory, eye/face PPE, machine guarding-intensive.',
        'starter': ('Walkthrough + Hex Chrome / Respiratory Screen', '$1,600'),
        'best':    ('CRV + Respiratory Protection Program Buildout', '$3,000'),
        'premium': ('Annual Compliance Partner',                    '$12,000 / yr'),
        'notes':   'Includes fit-test record audit when respiratory program is in scope.',
    },
    {
        'industry': 'Food Manufacturing & Beverage',
        'profile': 'Wet floors, ammonia / refrigeration, sanitation chemicals, machine guarding around lines.',
        'starter': ('Walkthrough + HazCom Refresh',     '$1,400'),
        'best':    ('CRV + PSM Readiness Screen',       '$3,000'),
        'premium': ('Annual Compliance Partner',        '$12,000 / yr'),
        'notes':   'Process Safety Management (PSM) deep-dive scoped separately for ammonia > threshold quantities.',
    },
    {
        'industry': 'Healthcare & Long-Term Care',
        'profile': 'Bloodborne pathogens, hazardous drugs, ergonomic / patient-handling, workplace violence.',
        'starter': ('Walkthrough + Bloodborne Pathogens Audit', '$1,500'),
        'best':    ('CRV + Workplace Violence Plan Buildout',   '$2,800'),
        'premium': ('Annual Compliance Partner',                '$12,000 / yr'),
        'notes':   'GigLine focuses on OSHA general industry — not state DHHS clinical licensure.',
    },
    {
        'industry': 'Auto / Diesel Repair & Body Shops',
        'profile': 'Flammable storage, isocyanates in paint booths, lifts, compressed gas, waste handling.',
        'starter': ('Walkthrough + Paint Booth Review', '$1,500'),
        'best':    ('CRV + Respiratory + Flammables Buildout', '$3,000'),
        'premium': ('Annual Compliance Partner',        '$12,000 / yr'),
        'notes':   'Booth ventilation and respiratory fit-testing reviewed inside the CRV.',
    },
]

PRODUCTS = [
    ('Supervisor Safety Starter System — Digital', '$600',
     '11 print-ready CFR-cited documents: written HazCom program, chemical and SDS indexes, training records, monthly inspection checklist, "If OSHA Shows Up" protocol, and supervisor station cards.'),
    ('Supervisor Safety Starter System — Physical Kit', '$675',
     'Adds the GigLine 2026 Triad OSHA Field Manual + direct contact card. Shipped to the operation.'),
    ('2026 Triad OSHA Field Manual — Digital', '$49',
     'Printable 60-page field manual covering the citations most often issued in the Piedmont Triad.'),
]

POLICIES = [
    ('Fixed-quote pricing',
     'Every engagement is scoped and confirmed in writing before scheduling. No hourly billing. No surprise invoices.'),
    ('Travel',
     'No travel charge within 60 miles of Winston-Salem, NC. Engagements beyond that radius are quoted with travel disclosed in advance.'),
    ('Scheduling',
     'Most walkthroughs are scheduled within 5–7 business days of the confirmed quote. Time-sensitive incident reviews can usually be scheduled same week.'),
    ('Confidentiality',
     'All engagements are private. Findings are not shared with OSHA, insurance carriers, or any third party without written client permission.'),
    ('Returning clients',
     'Follow-up walkthroughs for past clients are offered at a reduced rate. Ask when you book.'),
    ('Payment',
     'Invoice on completion. Net 15. Major card payments accepted via Stripe.'),
]


def build_pricing_pdf():
    out = os.path.join(ASSET_DIR, 'gl-pricing-2026.pdf')
    story = []

    story.append(Paragraph('2026 PRICING SCHEDULE', S['eyebrow']))
    story.append(Paragraph('Services, Recurring Engagements, and Products', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'Every price below is a published starting point. The final number is confirmed '
        'in writing after a short scoping call — fixed-quote, no hourly billing, no retainer. '
        'Effective February 2026.',
        S['body']
    ))
    story.append(Spacer(1, 14))

    # Quick-reference price table
    story.append(Paragraph('AT A GLANCE', S['eyebrow']))
    table_data = [['Engagement', 'Starting Price']]
    for s in SERVICES:
        table_data.append([s['name'], s['price']])
    table_data.append(['Industry Packages (Manufacturing, Warehouse, Trades, Fleet, Metal Fab,',
                       'From $1,400'])
    table_data.append(['  Food & Bev, Healthcare, Auto/Diesel — see Section 02)', ''])
    for p in PRODUCTS:
        table_data.append([p[0], p[1]])
    t = Table(table_data, colWidths=[4.4 * inch, 2.0 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_DEEP),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9.5),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('TEXTCOLOR', (1, 1), (1, -1), NAVY_BRIGHT),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, PAPER]),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, GOLD),
        ('LINEBELOW', (0, 1), (-1, -1), 0.25, RULE),
    ]))
    story.append(t)
    story.append(PageBreak())

    # Detailed cards
    story.append(Paragraph('CORE ENGAGEMENTS', S['eyebrow']))
    story.append(Paragraph('Service Details', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))

    for s in SERVICES:
        block = []
        block.append(Paragraph(s['name'], S['h2']))
        # Price + duration row
        price_row = Table(
            [[Paragraph(s['price'], S['price_big']),
              Paragraph(s['duration'], S['body_muted'])]],
            colWidths=[2.4 * inch, 4.0 * inch]
        )
        price_row.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        block.append(price_row)
        block.append(Paragraph(s['desc'], S['body']))

        # Includes
        if s.get('inc_as_table'):
            sub = [[Paragraph(f"<b>{row[0]}</b>", S['body_tight']),
                    Paragraph(row[1], S['body_tight'])] for row in s['inc']]
            sub_t = Table(sub, colWidths=[4.0 * inch, 2.4 * inch])
            sub_t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PAPER),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LINEBELOW', (0, 0), (-1, -2), 0.25, RULE),
                ('TEXTCOLOR', (1, 0), (1, -1), NAVY_BRIGHT),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
            ]))
            block.append(sub_t)
        else:
            for item in s['inc']:
                block.append(Paragraph(f'•&nbsp;&nbsp;{item}', S['body_tight']))

        block.append(Spacer(1, 6))
        block.append(Paragraph(f'<b>Best for:</b> {s["best"]}', S['body_muted']))
        block.append(HRFlowable(width='100%', thickness=0.3, color=RULE,
                                spaceBefore=10, spaceAfter=4))
        story.append(KeepTogether(block))

    # Products
    story.append(PageBreak())
    story.append(Paragraph('INDUSTRY-SPECIFIC PACKAGES', S['eyebrow']))
    story.append(Paragraph('Bundled Pricing by Operation Type', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'Each package below is a starting point bundled around the citations and program gaps '
        'most common in that industry. Final scope and pricing are confirmed in writing after a '
        'short call. Operations outside these categories are scoped à la carte using the '
        '"Core Engagements" section above.',
        S['body']
    ))
    story.append(Spacer(1, 8))

    for pkg in INDUSTRY_PACKAGES:
        block = []
        block.append(Paragraph(pkg['industry'], S['h2']))
        block.append(Paragraph(pkg['profile'], S['body_muted']))
        block.append(Spacer(1, 4))

        tier_data = [
            ['Tier', 'Package', 'Starting Price'],
            ['Starter',  pkg['starter'][0], pkg['starter'][1]],
            ['Best Fit', pkg['best'][0],    pkg['best'][1]],
            ['Premium',  pkg['premium'][0], pkg['premium'][1]],
        ]
        tier_t = Table(tier_data, colWidths=[0.9 * inch, 4.0 * inch, 1.5 * inch])
        tier_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), NAVY_BRIGHT),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8.5),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9.5),
            ('TEXTCOLOR', (0, 1), (-1, -1), INK),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (2, 1), (2, -1), NAVY_BRIGHT),
            ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, PAPER]),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LINEBELOW', (0, 0), (-1, 0), 1.5, GOLD),
            ('LINEBELOW', (0, 1), (-1, -1), 0.25, RULE),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        block.append(tier_t)
        block.append(Spacer(1, 4))
        block.append(Paragraph(f'<b>Scope notes:</b> {pkg["notes"]}', S['body_muted']))
        block.append(HRFlowable(width='100%', thickness=0.3, color=RULE,
                                spaceBefore=8, spaceAfter=6))
        story.append(KeepTogether(block))

    # Products
    story.append(PageBreak())
    story.append(Paragraph('PRODUCTS  ·  STANDALONE DOWNLOADS', S['eyebrow']))
    story.append(Paragraph('Self-Serve Resources', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'Products are standalone — they are not service engagements. They are '
        'designed for operations that want documentation in place before scheduling a walkthrough.',
        S['body']
    ))
    story.append(Spacer(1, 8))
    for name, price, desc in PRODUCTS:
        block = [
            Paragraph(name, S['h2']),
            Paragraph(price, S['price_big']),
            Paragraph(desc, S['body']),
            HRFlowable(width='100%', thickness=0.3, color=RULE,
                       spaceBefore=4, spaceAfter=6),
        ]
        story.append(KeepTogether(block))

    # Policies
    story.append(Spacer(1, 10))
    story.append(Paragraph('POLICIES', S['eyebrow']))
    story.append(Paragraph('How GigLine Bills & Schedules', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    for label, body in POLICIES:
        story.append(Paragraph(label, S['callout']))
        story.append(Paragraph(body, S['body']))

    # Closing CTA
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width='100%', thickness=1.2, color=NAVY_BRIGHT, spaceAfter=8))
    story.append(Paragraph('Ready to scope your engagement?', S['h2']))
    story.append(Paragraph(
        'Email <b>vince@giglinecompliance.com</b> · Call <b>(336) 329-8899</b> · '
        'Visit <b>giglinecompliance.com/intake</b>. Reply within 48 hours.',
        S['body']
    ))

    build_doc(
        path=out,
        running_title='2026 Pricing Schedule',
        cover_eyebrow='2026 PRICING SCHEDULE  ·  EDITION FEB 2026',
        cover_title='Fixed-quote pricing for OSHA compliance work in NC.',
        cover_sub='Every engagement is scoped and confirmed in writing before scheduling. No hourly billing. No retainer.',
        story=story,
    )
    print('✓', out)


# ═════════════════════════════════════════════════════════════════════════
# Document 3 — Full OSHA Inspection Guide
# ═════════════════════════════════════════════════════════════════════════
def build_osha_guide_pdf():
    out = os.path.join(ASSET_DIR, 'gl-osha-inspection-guide-2026.pdf')
    story = []

    # ── Section 1: Before the inspection
    story.append(Paragraph('SECTION 01', S['eyebrow']))
    story.append(Paragraph('Before the Inspection — What OSHA Expects Already Done',
                           S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'OSHA inspections are unannounced. By the time a compliance officer is at the front desk, '
        'every program, training record, and physical control either exists or it does not. '
        'This section is the readiness checklist every NC manufacturing, warehouse, and fleet '
        'operation should be able to clear before that morning ever happens.',
        S['body']
    ))

    pre = [
        ('Written Programs — the documents OSHA asks for first',
         'Hazard Communication (29 CFR 1910.1200), Lockout/Tagout (1910.147), Emergency Action Plan '
         '(1910.38), PPE Hazard Assessment (1910.132), Bloodborne Pathogens where applicable (1910.1030), '
         'and Respiratory Protection where applicable (1910.134). Each must be written, site-specific, '
         'reviewed annually, and signed.'),
        ('OSHA Recordkeeping — 300, 300A, 301',
         'OSHA 300 log current through last work-related injury. 300A annual summary posted in a visible '
         'employee area February 1 through April 30. 301 incident reports retained for five years '
         '(29 CFR 1904).'),
        ('Training Records — by employee, by role',
         'Forklift operator certification with three-year recertification cycle (1910.178(l)). '
         'LOTO authorized-employee training. HazCom training at hire and at chemical change. '
         'PPE training before assignment. Training must be documented with employee name, date, '
         'topic, and trainer signature.'),
        ('SDS — accessible without delay',
         'Safety Data Sheets for every hazardous chemical on site, organized so any employee on any '
         'shift can locate the sheet for a chemical they are using within seconds (1910.1200(g)). '
         'Binder or digital system both acceptable — speed and findability are the test.'),
        ('Physical readiness — the floor itself',
         'Machine guards in place and not bypassed (1910.212). Damaged ladders removed from service '
         '(1910.23). Exit routes unobstructed and marked (1910.37). Eyewash stations within 10 seconds '
         'of corrosive chemical exposure points (1910.151). Emergency lighting tested. Fire extinguishers '
         'inspected monthly and serviced annually.'),
        ('OSHA Poster — required by law',
         'The current "Job Safety and Health: It\'s the Law" poster (OSHA 3165) must be posted in a '
         'visible employee area. Free download at osha.gov.'),
    ]
    for h, body in pre:
        story.append(Paragraph(h, S['callout']))
        story.append(Paragraph(body, S['body']))

    story.append(PageBreak())

    # ── Section 2: During the inspection
    story.append(Paragraph('SECTION 02', S['eyebrow']))
    story.append(Paragraph('During the Inspection — The Five Phases', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'OSHA inspections follow a structured five-phase sequence. Knowing what is happening, '
        'what is being asked, and what your team should and should not say at each phase is the '
        'difference between a clean inspection and a six-figure penalty bill.',
        S['body']
    ))

    phases = [
        ('1. Opening Conference',
         'The compliance officer presents credentials and explains the scope of the inspection — '
         'programmed, complaint-driven, referral, or fatality/catastrophe. <b>What to do:</b> '
         'identify the inspection scope in writing, request a copy of any complaint, designate a '
         'single management escort, and notify the employee representative if applicable. '
         '<b>What not to do:</b> consent to a scope broader than what was presented, or allow '
         'the inspection to begin before a management representative is on-site.'),
        ('2. Walkaround',
         'The officer walks the facility, photographs hazards, takes notes, and may interview '
         'employees in the work area. <b>What to do:</b> escort the officer through the area '
         'identified in the opening conference, photograph everything the officer photographs '
         '(parallel record), and document each finding in real time. <b>What not to do:</b> '
         'volunteer access to areas outside the inspection scope, hide or modify conditions, '
         'or interrupt employee interviews.'),
        ('3. Employee Interviews',
         'Hourly employees may be interviewed privately. Management cannot attend. Interview '
         'content is confidential to OSHA. <b>What to do:</b> remind employees that they may have '
         'representation if they request it, and that they have the right to refuse the interview '
         'or end it at any time. <b>What not to do:</b> coach, instruct, or pressure employees '
         'before or after the interview.'),
        ('4. Closing Conference',
         'The compliance officer summarizes findings, identifies likely citations, and explains the '
         'citation process. <b>What to do:</b> request that all findings be put in writing, take '
         'detailed notes, ask which CFR standards apply to each finding, and clarify the abatement '
         'timeline being proposed. <b>What not to do:</b> admit fault, agree to penalties on the '
         'spot, or commit to corrective actions that have not been engineered.'),
        ('5. Citation Issuance',
         'Citations are mailed within six months of the inspection. Each citation lists the CFR '
         'standard, the proposed penalty, and the abatement deadline. The penalty may be reduced '
         'for good-faith effort, size of the business, and history. <b>What to do:</b> log the '
         'receipt date, calendar the 15-business-day contest deadline, and begin abatement '
         'documentation immediately. <b>What not to do:</b> ignore the certified mail envelope, '
         'or assume an informal conference will resolve it.'),
    ]
    for h, body in phases:
        story.append(Paragraph(h, S['callout']))
        story.append(Paragraph(body, S['body']))

    story.append(PageBreak())

    # ── Section 3: After the inspection
    story.append(Paragraph('SECTION 03', S['eyebrow']))
    story.append(Paragraph('After the Inspection — The 24-Hour and 15-Day Windows',
                           S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))

    after = [
        ('Within 24 hours of the closing conference',
         'Write the inspection summary while it is fresh: which areas were walked, which findings '
         'were verbally identified, which employees were interviewed, and which CFR standards were '
         'cited. Photograph every flagged condition. This internal record is your most important '
         'document if a citation is later contested.'),
        ('Within 7 days',
         'Brief leadership in writing on the verbal findings. Begin abatement on findings that '
         'present immediate injury risk regardless of citation status. Notify your insurance '
         'carrier only if your policy specifically requires it.'),
        ('When the citation arrives — usually within 30 to 60 days',
         'Read every line. Each citation includes the CFR standard, the description of the '
         'alleged violation, the proposed penalty, and the abatement deadline. Verify that the '
         'cited condition matches what was actually observed.'),
        ('Within 15 business days of citation receipt',
         'You have three options: (1) pay the penalty and abate, (2) request an informal '
         'conference with the OSHA Area Director to negotiate the penalty and abatement, or '
         '(3) file a Notice of Contest with the Occupational Safety and Health Review Commission. '
         'Missing the 15-business-day deadline waives the right to contest.'),
        ('Throughout abatement',
         'Document every corrective action with photos, receipts, training records, and signed '
         'employee acknowledgments. Submit a written abatement certification by the deadline '
         'stated in the citation. Failure to certify abatement is itself a citable offense.'),
    ]
    for h, body in after:
        story.append(Paragraph(h, S['callout']))
        story.append(Paragraph(body, S['body']))

    story.append(PageBreak())

    # ── Section 4: Most common HR-facing citations
    story.append(Paragraph('SECTION 04', S['eyebrow']))
    story.append(Paragraph('The Citations HR Sees Most Often', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'These are the documentation-driven citations that surface most often in general industry '
        'inspections in the Piedmont Triad. They are almost always preventable with a 90-minute '
        'documentation review before OSHA arrives. Penalty figures shown are 2026 OSHA-adjusted '
        'maximums (29 CFR Part 1903), not GigLine projections.',
        S['body']
    ))

    cite_data = [
        ['Standard', 'Common Gap', 'Max Penalty (2026)'],
        ['1904.4 / 1904.32', 'OSHA 300 log incomplete or 300A not posted Feb 1–Apr 30', 'Up to $16,550'],
        ['1910.1200(e)(1)', 'No written HazCom program or chemical inventory', 'Up to $16,550'],
        ['1910.147(c)(4)', 'No written LOTO procedures for energized equipment', 'Up to $16,550'],
        ['1910.178(l)(4)(iii)', 'Forklift operator recertification past 3-year cycle', 'Up to $16,550'],
        ['1910.132(d)', 'No documented PPE hazard assessment', 'Up to $16,550'],
        ['1910.38(a)', 'No written Emergency Action Plan (11+ employees)', 'Up to $16,550'],
        ['1910.37(a)(3)', 'Exit routes blocked, unmarked, or unlit', 'Up to $16,550'],
        ['1910.212(a)', 'Machine guards missing or bypassed', 'Up to $16,550'],
    ]
    t = Table(cite_data, colWidths=[1.4 * inch, 3.5 * inch, 1.5 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_DEEP),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2, 1), (2, -1), NAVY_BRIGHT),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, PAPER]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, GOLD),
        ('LINEBELOW', (0, 1), (-1, -1), 0.25, RULE),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        'Source: OSHA Annual Civil Penalty Adjustments — 29 CFR Part 1903.15(d). '
        'Figures shown are maximums for "Serious" and "Other-Than-Serious" violations. '
        'Willful or repeated violations carry significantly higher maximums.',
        S['body_muted']
    ))

    story.append(PageBreak())

    # ── Section 5: If OSHA shows up
    story.append(Paragraph('SECTION 05', S['eyebrow']))
    story.append(Paragraph('If OSHA Shows Up — A Front-Desk Protocol', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    story.append(Paragraph(
        'Print this page. Post it where the front desk, security desk, or shipping office can '
        'see it. Walk through it once with whoever opens the building.',
        S['body']
    ))

    steps = [
        '1. <b>Verify the credential.</b> Ask for the OSHA compliance officer\'s photo ID and '
        'business card. Record name, badge number, and area office.',
        '2. <b>Page management immediately.</b> Do not begin the inspection until an authorized '
        'management representative is on-site.',
        '3. <b>Identify the scope.</b> Ask why OSHA is here today — programmed, complaint, '
        'referral, fatality. If complaint-driven, request a copy of the complaint.',
        '4. <b>Do not refuse entry without counsel.</b> Refusing entry typically requires a '
        'warrant — call the GigLine on-call line or legal counsel before that conversation.',
        '5. <b>Designate one management escort.</b> The same person walks with the officer the '
        'entire visit and documents everything in parallel.',
        '6. <b>Limit the inspection to the stated scope.</b> Do not volunteer access to areas '
        'outside the original scope.',
        '7. <b>Photograph what they photograph.</b> Build a parallel record of every condition '
        'they document.',
    ]
    for s in steps:
        story.append(Paragraph(s, S['body']))

    # ── Glossary
    story.append(Spacer(1, 14))
    story.append(Paragraph('GLOSSARY', S['eyebrow']))
    story.append(Paragraph('Terms Used in This Guide', S['h1']))
    story.append(HRFlowable(width='100%', thickness=1, color=GOLD, spaceAfter=10))
    glossary = [
        ('CFR', 'Code of Federal Regulations. OSHA general industry standards live in 29 CFR Part 1910.'),
        ('Abatement', 'The corrective action that resolves a cited hazard. OSHA requires written certification of abatement by the deadline.'),
        ('Informal Conference', 'A negotiation between the employer and the OSHA Area Director, held inside the 15-business-day citation contest window.'),
        ('Notice of Contest', 'The formal filing that moves a citation into the OSHRC review process. Filed in writing within 15 business days of citation receipt.'),
        ('Serious Violation', 'A condition with a substantial probability of death or serious physical harm. 2026 maximum penalty: $16,550 per citation.'),
        ('Willful Violation', 'A violation committed with intentional disregard for, or plain indifference to, OSHA requirements. 2026 maximum penalty: $165,514 per citation.'),
    ]
    for term, defn in glossary:
        story.append(Paragraph(f'<b>{term}.</b> {defn}', S['body_tight']))
        story.append(Spacer(1, 3))

    # Closing
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width='100%', thickness=1.2, color=NAVY_BRIGHT, spaceAfter=8))
    story.append(Paragraph('Want this checked against your operation?', S['h2']))
    story.append(Paragraph(
        'A GigLine Safety Walkthrough ($1,200+) or Compliance Readiness Visit ($2,000+) puts '
        'this guide into practice against your floor and your files. Call '
        '<b>(336) 329-8899</b> or visit <b>giglinecompliance.com/intake</b>.',
        S['body']
    ))

    build_doc(
        path=out,
        running_title='OSHA Inspection Guide',
        cover_eyebrow='OSHA INSPECTION GUIDE FOR HR & SAFETY LEADERS  ·  EDITION 2026',
        cover_title='What OSHA looks for when they walk in.',
        cover_sub='A practical guide for HR managers, safety coordinators, and plant managers in the Piedmont Triad — what to have ready before, what happens during, what to do in the 15-day window after.',
        story=story,
    )
    print('✓', out)


if __name__ == '__main__':
    build_faq_pdf()
    build_pricing_pdf()
    build_osha_guide_pdf()
    print('\nAll three PDFs generated in', ASSET_DIR)
