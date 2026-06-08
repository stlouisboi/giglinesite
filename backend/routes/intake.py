"""Client Safety Intake Form routes — GL-PORT-001."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel
import uuid
import os
import logging
import secrets

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger('gigline')

import asyncio
from integrations.mailerlite import add_to_lead_nurture, pause_engagement

UPLOAD_DIR = "/app/backend/intake_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _format_attribution_html(attribution: Optional[dict]) -> str:
    """Render the UTM + referrer attribution block for the Vince notification email."""
    if not attribution or not isinstance(attribution, dict):
        return ""
    first = attribution.get("firstTouch") or {}
    last = attribution.get("lastTouch") or {}
    if not first and not last:
        return ""

    def row(label, value):
        if not value:
            return ""
        return (
            f"<tr><td style='padding:3px 8px;color:#999;font-size:12px;'>{label}</td>"
            f"<td style='padding:3px 8px;color:#E8B84B;font-size:12px;font-weight:bold;'>{value}</td></tr>"
        )

    first_rows = (
        row("Source", first.get("utm_source"))
        + row("Medium", first.get("utm_medium"))
        + row("Campaign", first.get("utm_campaign"))
        + row("Term", first.get("utm_term"))
        + row("Content", first.get("utm_content"))
        + row("Google Click ID", first.get("gclid"))
        + row("Facebook Click ID", first.get("fbclid"))
        + row("First landing", first.get("first_landing_path"))
        + row("Captured at", first.get("captured_at"))
    )
    same_as_first = (
        last
        and first
        and last.get("utm_source") == first.get("utm_source")
        and last.get("utm_campaign") == first.get("utm_campaign")
    )
    last_rows = ""
    if last and not same_as_first:
        last_rows = (
            row("Last source", last.get("utm_source"))
            + row("Last medium", last.get("utm_medium"))
            + row("Last campaign", last.get("utm_campaign"))
        )

    if not first_rows and not last_rows:
        return ""

    return (
        "<h3 style='color:#E8B84B;font-size:14px;margin:16px 0 8px;'>ATTRIBUTION</h3>"
        "<table style='border-collapse:collapse;width:100%;'>"
        f"{first_rows}"
        + (f"<tr><td colspan='2' style='padding:6px 8px 2px;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;'>Last touch (different)</td></tr>{last_rows}" if last_rows else "")
        + "</table>"
    )


# ── Human-readable label maps for matrix keys ──
PROGRAM_LABELS = {
    'hazcom': 'Hazard Communication (SDS, labels, training)',
    'loto': 'Lockout/Tagout',
    'ppe': 'Personal Protective Equipment (PPE)',
    'forklift': 'Forklift / PIT safety',
    'eap': 'Emergency Action Plan',
    'respiratory': 'Respiratory protection',
    'hearing': 'Hearing conservation',
}

DOC_LABELS = {
    'safety_manual': 'Written safety manual',
    'hazcom_program': 'Written HazCom program',
    'loto_procedures': 'Written LOTO procedures',
    'forklift_training': 'Forklift training docs',
    'new_hire_checklist': 'New-hire safety orientation',
    'toolbox_talks': 'Toolbox talk / training records',
    'osha_logs': 'OSHA 300/300A logs',
}


def calculate_proposed_scope(data):
    """Server-side only. Never exposed to client."""
    # Base price from employee count
    emp = data.totalEmployees or 0
    if emp <= 75:
        tier, base = "Small", 650
    elif emp <= 250:
        tier, base = "Medium", 750
    else:
        tier, base = "Large", 900

    adjustments = []
    flags = []
    custom_quote = False
    total_adjustment = 0

    # 1. Schedule complexity
    sched = data.schedule or ""
    detail = data.scheduleDetail or {}
    shifts_to_include = detail.get('shiftsToInclude', [])
    rotations_to_include = detail.get('rotationsToInclude', [])
    same_ops = detail.get('sameOps', '')

    if sched in ('1_shift', 'weekends_seasonal', ''):
        pass  # no adjustment
    elif sched in ('2_shifts', '3_shifts'):
        if same_ops in ('no', 'varies', 'No', 'Varies') and 'All shifts (may require multiple visits)' in shifts_to_include:
            adjustments.append({"reason": f"Multi-visit ({sched.replace('_', ' ')}, operations vary)", "amount": base})
            total_adjustment += base
            flags.append("Multi-visit likely")
        elif 'One representative shift is fine' in shifts_to_include:
            pass  # single visit confirmed
    elif sched == '12hr_rotating':
        if 'All rotations (multiple visits)' in rotations_to_include:
            adjustments.append({"reason": "Multi-visit (all rotations requested)", "amount": base})
            total_adjustment += base
            flags.append("Multi-visit likely")
        elif 'One representative rotation is fine' in rotations_to_include:
            pass  # single visit confirmed

    # 2. Additional locations
    loc = data.additionalLocations or ""
    if loc == '2-3':
        adjustments.append({"reason": "Additional locations (2-3)", "amount": base})
        total_adjustment += base
        flags.append("Multiple locations")
    elif loc == '4+':
        custom_quote = True
        flags.append("4+ locations — custom quote required")

    # 3. Urgency
    if data.urgency == 'asap':
        flags.append("Rush — confirm availability")

    # 4. Written programs requested
    if 'Build or clean up written safety programs' in (data.helpNeeded or []):
        flags.append("Written programs requested — quote separately")

    # Section 3 gaps (programs marked No or Not sure)
    section3_gaps = []
    if data.requiredPrograms:
        for key, val in data.requiredPrograms.items():
            if val in ('no', 'not_sure'):
                section3_gaps.append(PROGRAM_LABELS.get(key, key))

    # Section 4 gaps (docs marked No or Not sure)
    section4_gaps = []
    if data.existingDocs:
        for key, val in data.existingDocs.items():
            if val in ('no', 'not_sure'):
                section4_gaps.append(DOC_LABELS.get(key, key))

    total_low = base + total_adjustment
    total_high = int(total_low * 1.2)  # 20% range buffer

    return {
        "tier": tier,
        "employeeCount": emp,
        "basePrice": base,
        "adjustments": adjustments,
        "totalLow": total_low,
        "totalHigh": total_high,
        "flags": flags,
        "section3Gaps": section3_gaps,
        "section4Gaps": section4_gaps,
        "customQuoteRequired": custom_quote,
    }


def build_pricing_block_html(scope):
    """Build the HTML pricing block for the Vince email."""
    if scope["customQuoteRequired"]:
        price_line = '<p style="color:#f87171;font-weight:bold;font-size:16px;margin:8px 0;">Custom quote required — do not use calculated price.</p>'
    else:
        adj_rows = ""
        for a in scope["adjustments"]:
            adj_rows += f'<tr><td style="padding:3px 0;color:#ccc;">+ {a["reason"]}</td><td style="padding:3px 0;color:#E8B84B;text-align:right;font-weight:bold;">+${a["amount"]:,}</td></tr>'

        price_line = f"""
        <table style="width:100%;margin:8px 0;border-collapse:collapse;">
          <tr><td style="padding:3px 0;color:#ccc;">Base price</td><td style="padding:3px 0;color:#fff;text-align:right;font-weight:bold;">${scope["basePrice"]:,}</td></tr>
          {adj_rows}
          <tr><td colspan="2" style="border-top:1px solid #444;padding-top:8px;"></td></tr>
          <tr><td style="padding:3px 0;color:#fff;font-weight:bold;font-size:15px;">Starting range</td><td style="padding:3px 0;color:#E8B84B;text-align:right;font-weight:bold;font-size:15px;">${scope["totalLow"]:,}–${scope["totalHigh"]:,}</td></tr>
        </table>
        """
        if scope["adjustments"]:
            price_line += '<p style="color:#999;font-size:12px;margin:4px 0;">(Confirm visit count before sending proposal)</p>'

    flags_html = ""
    if scope["flags"]:
        flags_html = '<div style="margin:12px 0;">'
        for fl in scope["flags"]:
            flags_html += f'<p style="color:#E8B84B;margin:2px 0;font-size:13px;">&#9888; {fl}</p>'
        flags_html += '</div>'

    gaps3_html = ""
    if scope["section3Gaps"]:
        gaps3_html = '<div style="margin:10px 0;"><p style="color:#E8B84B;font-size:12px;font-weight:bold;margin:0 0 4px;">Section 3 gaps (programs marked No or Not sure):</p>'
        for g in scope["section3Gaps"]:
            gaps3_html += f'<p style="color:#ccc;font-size:12px;margin:1px 0 1px 8px;">&middot; {g}</p>'
        gaps3_html += '</div>'

    gaps4_html = ""
    if scope["section4Gaps"]:
        gaps4_html = '<div style="margin:10px 0;"><p style="color:#E8B84B;font-size:12px;font-weight:bold;margin:0 0 4px;">Section 4 gaps (docs marked No or Not sure):</p>'
        for g in scope["section4Gaps"]:
            gaps4_html += f'<p style="color:#ccc;font-size:12px;margin:1px 0 1px 8px;">&middot; {g}</p>'
        gaps4_html += '</div>'

    return f"""
    <div style="background:#111;border:2px solid #E8B84B;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#E8B84B;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 12px;">PROPOSED SCOPE &amp; STARTING PRICE</p>
      <p style="color:#fff;margin:4px 0;"><strong>Tier:</strong> {scope["tier"]} ({scope["employeeCount"]} employees)</p>
      {price_line}
      {flags_html}
      {gaps3_html}
      {gaps4_html}
    </div>
    """


class IntakeSubmission(BaseModel):
    # ─── Section 1 — Company & Contact (per GL-WEB-013) ───
    companyName: str = ""
    facilityAddress: str = ""
    contactName: str = ""
    contactTitle: str = ""
    phone: str = ""
    email: str = ""
    operationType: str = ""           # steel_supply | manufacturing | warehouse | contractor | fleet | mixed | other
    operationTypeOther: str = ""
    employeeCountBucket: str = ""     # under_10 | 10_24 | 25_74 | 75_149 | 150_plus
    shiftPattern: str = ""            # days_only | days_nights | 24_7 | variable

    # ─── Section 2 — Why You Called & Urgency ───
    reasonForContact: str = ""
    upcomingAudit: str = ""           # yes | no | not_sure
    auditDetails: str = ""
    urgencyTimeline: str = ""         # asap | 2_4_weeks | flexible
    serviceRequested: str = ""        # walkthrough | doc_review | incident_review | not_sure
    remoteOrOnsite: str = ""          # onsite | remote | no_preference

    # ─── Section 3 — Current Safety Setup ───
    q_safety_program: str = ""
    q_osha_logs: str = ""
    q_new_hire: str = ""
    q_training: str = ""
    q_eap: str = ""
    q_hazcom: str = ""
    q_inspections: str = ""
    q_prior_osha: str = ""            # yes | no | prefer_not_to_say
    q_known_gaps: str = ""

    # ─── Section 4 — Equipment & Hazards ───
    equipment: List[str] = []
    otherHazards: str = ""

    # ─── Section 5 — Documentation & Logistics ───
    docPrepReadiness: str = ""        # yes | mostly | need_help
    preferredDays: List[str] = []
    preferredTime: str = ""           # morning | afternoon | either
    contactMethod: str = ""           # phone | text | email
    accessNotes: str = ""

    # ─── Section 6 — Acknowledgment ───
    acknowledgmentChecked: bool = False

    # ─── System fields ───
    uploadedFileUrls: list = []
    attribution: Optional[dict] = None

    # ─── Legacy fields (kept for backward compatibility — never used by new form) ───
    company: str = ""
    dba: str = ""
    address: str = ""
    additionalLocations: str = ""
    jobTitle: str = ""
    totalEmployees: int = 0
    siteEmployees: int = 0
    schedule: str = ""
    scheduleDetail: Optional[dict] = None
    industry: str = ""
    industryOther: str = ""
    dayToDay: str = ""
    operations: list = []
    topHazards: str = ""
    safetyProgram: str = ""
    safetyOwner: str = ""
    requiredPrograms: Optional[dict] = None
    oshaLogs: str = ""
    oshaInspections: str = ""
    recordableInjuries: str = ""
    existingDocs: Optional[dict] = None
    helpNeeded: list = []
    helpOther: str = ""
    ninetyDayProblem: str = ""
    urgency: str = ""
    budget: str = ""
    approver: str = ""
    referralSource: str = ""
    consentGiven: bool = False


@router.post("/intake/upload")
async def upload_intake_file(file: UploadFile = File(...)):
    """Upload a document for the intake form."""
    allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="File type not allowed")

    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (10MB max)")

    submission_id = str(uuid.uuid4())
    sub_dir = os.path.join(UPLOAD_DIR, submission_id)
    os.makedirs(sub_dir, exist_ok=True)
    filepath = os.path.join(sub_dir, file.filename)

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (10MB max)")

    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "filename": file.filename,
        "uploadId": submission_id,
        "size": len(content),
    }


@router.post("/intake/submit")
async def submit_intake(data: IntakeSubmission):
    """
    GL-WEB-013 — Intake form rebuild.
    Stores submission, fires two emails:
      1. Client confirmation (plain-styled HTML with Field Manual link + status page)
      2. Vince notification (plain-text monospaced summary, sized for phone scan)
    Conditionally attaches the Doc Review prep checklist when service = doc_review.
    """
    if not data.acknowledgmentChecked:
        raise HTTPException(status_code=400, detail="Acknowledgment required")

    submission_id = str(uuid.uuid4())
    client_token = secrets.token_urlsafe(9)
    timestamp = datetime.now(timezone.utc)
    submitted_ts = timestamp.strftime("%B %d, %Y at %I:%M %p UTC")

    doc = {
        "id": submission_id,
        "clientToken": client_token,
        "submittedAt": timestamp.isoformat(),
        "status": "intake_received",
        "statusUpdatedAt": timestamp.isoformat(),
        "reportUrl": None,
        "reportDeliveredAt": None,
        "reportAccessedAt": None,
        **data.model_dump(),
    }
    await db.gl_intake_submissions.insert_one(doc)

    # ── MailerLite ── intake = active engagement → Paused group, no automation runs
    if data.email:
        attribution_dict = data.attribution if isinstance(data.attribution, dict) else None
        asyncio.create_task(add_to_lead_nurture(
            email=data.email,
            name=data.contactName or "",
            company=data.companyName or "",
            source_form="intake",
            attribution=attribution_dict,
        ))
        asyncio.create_task(pause_engagement(data.email))

    # ── Label dictionaries for human-readable email rendering ──
    OP_TYPES = {
        "steel_supply": "Steel supply / fabrication", "manufacturing": "Manufacturing",
        "warehouse": "Warehouse / distribution", "contractor": "Contractor / construction",
        "fleet": "Fleet operations", "mixed": "Mixed use", "other": "Other",
    }
    EMP_COUNTS = {
        "under_10": "Under 10", "10_24": "10–24", "25_74": "25–74",
        "75_149": "75–149", "150_plus": "150+",
    }
    SHIFTS = {
        "days_only": "Days only", "days_nights": "Days + nights",
        "24_7": "24/7 operation", "variable": "Variable",
    }
    UPCOMING_AUDIT = {"yes": "Yes", "no": "No", "not_sure": "Not sure"}
    URGENCY = {"asap": "As soon as possible", "2_4_weeks": "Next 2–4 weeks", "flexible": "Flexible — no specific deadline"}
    SERVICES = {
        "walkthrough": "Safety Walkthrough & Top 10 Fixes Report",
        "doc_review": "Documentation & Gap Check",
        "incident_review": "Incident Review & Corrective Action Support",
        "not_sure": "Not sure — let Vince recommend",
    }
    REMOTE = {"onsite": "On-site", "remote": "Remote", "no_preference": "No preference"}
    YNS = {"yes": "YES", "no": "NO", "not_sure": "NOT SURE", "prefer_not_to_say": "PREFER NOT TO SAY"}
    DOC_PREP = {
        "yes": "Yes — can pull most of it",
        "mostly": "Mostly — some items may be missing",
        "need_help": "Need help knowing where to start",
    }
    TIMES = {"morning": "Morning (before noon)", "afternoon": "Afternoon", "either": "Either"}
    CONTACT_M = {"phone": "Phone call", "text": "Text message", "email": "Email"}

    def L(d, k):
        return d.get(k, k) if k else "—"

    first_name = (data.contactName or "").split(" ")[0] if data.contactName else ""
    status_url = f"https://giglinecompliance.com/status/{client_token}"

    # ─────────────────────────────────────────────────────────
    # CLIENT CONFIRMATION EMAIL (per spec — Section 5)
    # ─────────────────────────────────────────────────────────
    client_subject = "GigLine received your intake — here's what happens next"
    client_html = f"""
<div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1C2B2B;line-height:1.55;padding:0 18px;">
  <p style="font-size:15px;">Hi {first_name or 'there'},</p>
  <p style="font-size:15px;">Got it — your intake has been received. Here&rsquo;s what happens next:</p>
  <ol style="font-size:15px;padding-left:22px;margin:8px 0 18px;">
    <li style="margin-bottom:4px;">Vince will review your answers and confirm a fixed quote within 1 business day.</li>
    <li style="margin-bottom:4px;">You&rsquo;ll receive a proposed scope of work and price by email.</li>
    <li style="margin-bottom:4px;">Once you confirm, Vince will schedule the walkthrough or review at a time that works for your operation.</li>
  </ol>
  <p style="font-size:15px;">In the meantime &mdash; here&rsquo;s something worth keeping regardless of what you decide:</p>
  <p style="font-size:15px;">The <strong>2026 Triad OSHA Field Manual</strong>. 12 pages. The 7 violations OSHA cites Piedmont Triad operations for most often &mdash; CFR citations, penalty ranges, and the fix for each one.</p>
  <p style="font-size:15px;margin:14px 0;">
    <a href="https://www.giglinecompliance.com/assets/gl-fm-2026.pdf"
       style="background:#0A1628;color:#FFFFFF;text-decoration:none;padding:11px 22px;font-weight:bold;font-family:Arial,sans-serif;display:inline-block;">
      Download the 2026 Field Manual (PDF)
    </a>
  </p>
  <p style="font-size:13px;color:#777;margin-top:0;">No forms. No opt-in. Yours to keep.</p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #E5E5E5;" />
  <p style="font-size:15px;"><strong>You can check the status of your engagement anytime at:</strong></p>
  <p style="font-size:15px;margin:8px 0 20px;">
    <a href="{status_url}"
       style="background:#1F6FEB;color:#FFFFFF;text-decoration:none;padding:11px 22px;font-weight:bold;font-family:Arial,sans-serif;display:inline-block;">
      View your engagement status &rarr;
    </a>
  </p>
  <p style="font-size:13px;color:#777;">This link is private to you. Bookmark it to track your engagement at any time.</p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #E5E5E5;" />
  <p style="font-size:15px;">Questions before then? Call or text <a href="tel:+13363298899" style="color:#0A1628;font-weight:bold;text-decoration:none;">(336) 329-8899</a>.</p>
  <p style="font-size:15px;margin-top:18px;">
    &mdash; Vince Lawrence<br />
    GigLine Safety &amp; Compliance<br />
    <span style="color:#777;font-size:13px;">(336) 329-8899 &middot; giglinecompliance.com</span>
  </p>
</div>"""

    # Conditional attachment: prep checklist only when service = doc_review
    client_send_payload = {
        "from": f"Vince Lawrence <{SENDER_EMAIL}>",
        "to": [data.email],
        "subject": client_subject,
        "html": client_html,
        "reply_to": VINCE_EMAIL,
    }
    if data.serviceRequested == "doc_review":
        prep_path = "/app/frontend/public/assets/gl-doc-review-prep-checklist.pdf"
        try:
            with open(prep_path, "rb") as fp:
                import base64
                client_send_payload["attachments"] = [{
                    "filename": "GigLine_DocReview_PrepChecklist.pdf",
                    "content": base64.b64encode(fp.read()).decode("ascii"),
                }]
        except Exception as e:
            logger.warning(f"Prep checklist attachment skipped: {e}")

    # ─────────────────────────────────────────────────────────
    # VINCE NOTIFICATION EMAIL (per spec — Section 6, plain-text monospaced)
    # ─────────────────────────────────────────────────────────
    op_type_display = L(OP_TYPES, data.operationType)
    if data.operationType in ("mixed", "other") and data.operationTypeOther:
        op_type_display += f" — {data.operationTypeOther}"

    emp_count_display = L(EMP_COUNTS, data.employeeCountBucket)
    vince_subject = (
        f"New intake — {data.companyName or 'Unknown company'} "
        f"· {op_type_display} · {emp_count_display} employees"
    )

    equipment_lines = "\n".join(f"  • {item}" for item in (data.equipment or [])) or "  • (none selected)"
    audit_line = L(UPCOMING_AUDIT, data.upcomingAudit)
    if data.upcomingAudit == "yes" and data.auditDetails:
        audit_line += f"  ({data.auditDetails})"
    preferred_days_line = ", ".join(data.preferredDays) if data.preferredDays else "—"

    def pad(label):
        return label.ljust(26)

    vince_plaintext = f"""\
NEW INTAKE SUBMISSION
═══════════════════════════════════════════════════════

Submitted: {submitted_ts}

───────────────────────────────────────────────────────
COMPANY & CONTACT
───────────────────────────────────────────────────────
{pad('Company:')}{data.companyName or '—'}
{pad('Facility:')}{data.facilityAddress or '—'}
{pad('Contact:')}{data.contactName or '—'}{(', ' + data.contactTitle) if data.contactTitle else ''}
{pad('Phone:')}{data.phone or '—'}
{pad('Email:')}{data.email or '—'}
{pad('Operation type:')}{op_type_display}
{pad('Employees:')}{emp_count_display}
{pad('Shifts:')}{L(SHIFTS, data.shiftPattern)}

───────────────────────────────────────────────────────
WHY THEY CALLED
───────────────────────────────────────────────────────
{pad('Prompt:')}{data.reasonForContact or '—'}
{pad('Upcoming audit:')}{audit_line}
{pad('Urgency:')}{L(URGENCY, data.urgencyTimeline)}
{pad('Service:')}{L(SERVICES, data.serviceRequested)}
{pad('Preference:')}{L(REMOTE, data.remoteOrOnsite)}

───────────────────────────────────────────────────────
CURRENT SAFETY SETUP
───────────────────────────────────────────────────────
{pad('Written safety program:')}{L(YNS, data.q_safety_program)}
{pad('OSHA 300/300A logs:')}{L(YNS, data.q_osha_logs)}
{pad('New-hire orientation:')}{L(YNS, data.q_new_hire)}
{pad('Regular safety training:')}{L(YNS, data.q_training)}
{pad('Emergency action plan:')}{L(YNS, data.q_eap)}
{pad('HazCom program + SDS:')}{L(YNS, data.q_hazcom)}
{pad('Regular inspections:')}{L(YNS, data.q_inspections)}
{pad('Prior OSHA citation:')}{L(YNS, data.q_prior_osha)}
{pad('Known gaps / concerns:')}{(data.q_known_gaps or '—')}

───────────────────────────────────────────────────────
EQUIPMENT & HAZARDS
───────────────────────────────────────────────────────
{equipment_lines}
{pad('Other hazards:')}{data.otherHazards or '—'}

───────────────────────────────────────────────────────
LOGISTICS
───────────────────────────────────────────────────────
{pad('Doc prep readiness:')}{L(DOC_PREP, data.docPrepReadiness)}
{pad('Preferred days:')}{preferred_days_line}
{pad('Preferred time:')}{L(TIMES, data.preferredTime)}
{pad('Contact method:')}{L(CONTACT_M, data.contactMethod)}
{pad('Access notes:')}{data.accessNotes or '—'}

───────────────────────────────────────────────────────
PRICING REFERENCE
───────────────────────────────────────────────────────
Under 25 employees → $550 base
25–74            → $650
75–149           → $800
150+             → custom
On-site add $100–150  |  High complexity → adjust up

───────────────────────────────────────────────────────
STATUS PAGE: {status_url}
REPLY TO:    {data.email}
CALL:        {data.phone}
"""

    # Wrap plain text in monospaced HTML for browser-safe rendering
    vince_html = (
        f"<pre style=\"font-family:'JetBrains Mono','Courier New',monospace;"
        f"font-size:12.5px;line-height:1.5;color:#1C2B2B;white-space:pre-wrap;"
        f"margin:0;padding:18px;\">{vince_plaintext}</pre>"
    )

    try:
        resend.Emails.send({
            "from": f"GigLine Intake <{SENDER_EMAIL}>",
            "to": [VINCE_EMAIL],
            "reply_to": data.email or VINCE_EMAIL,
            "subject": vince_subject,
            "html": vince_html,
            "text": vince_plaintext,
        })
    except Exception as e:
        logger.error(f"Intake Vince email error: {e}")

    if data.email:
        try:
            resend.Emails.send(client_send_payload)
        except Exception as e:
            logger.error(f"Intake client email error: {e}")

    return {"status": "success", "submissionId": submission_id, "clientToken": client_token}
