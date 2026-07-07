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
    # ─── Section 1 — Company & Contact (GL-INTAKE-002) ───
    companyName: str = ""
    facilityCityState: str = ""        # "City, State" — replaces full address
    contactName: str = ""
    contactTitle: str = ""             # required per spec
    phone: str = ""
    email: str = ""
    operationType: str = ""
    operationTypeOther: str = ""
    employeeCountBucket: str = ""      # under_10 | 10_25 | 26_50 | 51_100 | 100_plus
    referralSource: str = ""           # search | referral | linkedin | repeat | other
    referralSourceOther: str = ""

    # ─── Section 2 — Service Selection ───
    serviceSelected: str = ""          # walkthrough | doc_review | incident_review | doc_creation | not_sure

    # ─── Section 3 — Urgency & Context ───
    promptingReason: str = ""          # dropdown
    promptingReasonOther: str = ""
    hasDeadline: str = ""              # yes | no
    deadlineDate: str = ""             # YYYY-MM-DD if hasDeadline = yes
    deadlineDriver: str = ""           # osha | insurance | customer | internal | other (if hasDeadline = yes)
    hadInjuryOrClaim: str = ""         # yes | no | not_sure
    injuryClaimDescription: str = ""   # if hadInjuryOrClaim = yes

    # ─── Section 4 — Core Safety Setup ───
    q_safety_program: str = ""         # yes | no | not_sure
    q_osha_logs: str = ""              # yes | no | not_sure
    q_osha_inspection_ever: str = ""   # yes | no | not_sure
    oshaInspectionYear: str = ""       # if q_osha_inspection_ever = yes
    oshaInspectionCitations: str = ""  # if q_osha_inspection_ever = yes

    # ─── Section 4 — Lane: OSHA Documentation Readiness Review ───
    docReviewConcerns: List[str] = []  # multi-select
    docReviewApproach: str = ""        # review_existing | start_scratch | not_sure

    # ─── Section 4 — Lane: Incident Review ───
    incidentDescription: str = ""
    incidentOshaNotified: str = ""     # yes | no | not_sure
    incidentWcFiled: str = ""          # yes | no | in_process
    incidentInternalReportStarted: str = ""  # yes | no
    incidentNeededOutcomes: List[str] = []

    # ─── Section 4 — Lane: Doc Creation (hybrid pricing) ───
    docCreationItems: List[str] = []    # selected docs/programs
    docCreationApproach: str = ""       # scratch | revising | mix
    docCreationFacilities: str = ""     # one | multiple
    docCreationScopeType: str = ""      # review | updates | full_creation
    docCreationHasDeadline: str = ""    # yes | no
    docCreationDeadlineDetails: str = ""
    docCreationPricingDisplayed: str = ""  # bundle_399 | individual_sum | phone_quote (logged for analytics)

    # ─── Section 5 — Hazards & Facility Profile (Walkthrough OR Doc Creation only) ───
    hazardsPresent: List[str] = []
    safetyBoardPosted: str = ""        # yes | no | not_sure
    facilityAdditionalNotes: str = ""

    # ─── Section 6 — Scheduling & Logistics ───
    contactMethod: str = ""            # phone | text | email
    bestTime: str = ""                 # morning | midday | afternoon | after_4pm
    preferredDays: List[str] = []
    preferredStartDate: str = ""
    blockers: str = ""

    # ─── Section 7 — Acknowledgments ───
    engagementAcknowledged: bool = False
    privacyAccepted: bool = False

    # ─── System fields ───
    uploadedFileUrls: list = []
    attribution: Optional[dict] = None

    # ─── Legacy field aliases kept for backward compatibility ───
    facilityAddress: str = ""
    shiftPattern: str = ""
    reasonForContact: str = ""
    upcomingAudit: str = ""
    auditDetails: str = ""
    urgencyTimeline: str = ""
    serviceRequested: str = ""
    remoteOrOnsite: str = ""
    q_new_hire: str = ""
    q_training: str = ""
    q_eap: str = ""
    q_hazcom: str = ""
    q_inspections: str = ""
    q_prior_osha: str = ""
    q_known_gaps: str = ""
    equipment: List[str] = []
    otherHazards: str = ""
    docPrepReadiness: str = ""
    preferredTime: str = ""
    accessNotes: str = ""
    acknowledgmentChecked: bool = False
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
    GL-INTAKE-002 — Master Service Intake submit handler.
    Stores submission, fires two emails, routes to correct MailerLite lane
    with priority flags.
    """
    if not data.engagementAcknowledged or not data.privacyAccepted:
        raise HTTPException(status_code=400, detail="Both acknowledgments required")

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

    # ─── Determine priority flags for MailerLite ───
    priority_flags = []
    # Urgent flag: prompting reason = OSHA visit/inspection OR has near-term deadline
    if data.promptingReason in ("upcoming_osha_inspection", "upcoming_osha_visit") or (
        data.hasDeadline == "yes" and data.deadlineDate
    ):
        priority_flags.append("urgent")
    # Injury flag: hadInjuryOrClaim = yes OR service = incident_review
    if data.hadInjuryOrClaim == "yes" or data.serviceSelected == "incident_review":
        priority_flags.append("injury")

    # ─── MailerLite — route to service lane + apply priority flags ───
    if data.email:
        from integrations.mailerlite import add_to_intake_lane
        attribution_dict = data.attribution if isinstance(data.attribution, dict) else None
        asyncio.create_task(add_to_intake_lane(
            email=data.email,
            lane=data.serviceSelected or "not_sure",
            priority_flags=priority_flags or None,
            name=data.contactName or "",
            company=data.companyName or "",
            attribution=attribution_dict,
        ))
        # Active engagement → pause Lead Nurture so they don't get prospect drip
        if data.serviceSelected and data.serviceSelected != "not_sure":
            asyncio.create_task(pause_engagement(data.email))

    # ─── Label dictionaries for human-readable email rendering ───
    OP_TYPES = {
        "steel_supply": "Steel supply / fabrication",
        "manufacturing": "Manufacturing", "warehouse": "Warehouse / distribution",
        "contractor": "Contractor / construction", "fleet": "Fleet operations",
        "mixed": "Mixed use", "other": "Other",
    }
    EMP_COUNTS = {
        "under_10": "Under 10", "10_25": "10–25", "26_50": "26–50",
        "51_100": "51–100", "100_plus": "100+",
    }
    SERVICES = {
        "walkthrough": "Safety Walkthrough & Top 10 Fixes Report",
        "doc_review": "OSHA Documentation Readiness Review",
        "incident_review": "Incident Review & Corrective Action Support",
        "doc_creation": "Safety Documents / Program Creation",
        "not_sure": "Not sure — needs guidance",
    }
    PROMPT_REASONS = {
        "upcoming_osha_inspection": "Upcoming OSHA inspection",
        "upcoming_osha_visit": "Upcoming OSHA visit",
        "recent_incident": "Recent incident or injury",
        "insurance_request": "Insurance carrier request",
        "customer_request": "Customer / client request",
        "internal_concern": "Internal concern",
        "growth_expansion": "Growth / expansion",
        "general_review": "General safety review",
        "other": "Other",
    }
    YNS = {"yes": "YES", "no": "NO", "not_sure": "NOT SURE", "prefer_not_to_say": "PREFER NOT TO SAY"}
    CONTACT_M = {"phone": "Phone call", "text": "Text message", "email": "Email"}
    TIMES = {"morning": "Morning", "midday": "Midday", "afternoon": "Afternoon", "after_4pm": "After 4 PM"}

    def L(d, k):
        return d.get(k, k) if k else "—"

    first_name = (data.contactName or "").split(" ")[0] if data.contactName else ""
    status_url = f"https://giglinecompliance.com/status/{client_token}"
    service_display = L(SERVICES, data.serviceSelected)

    # ─────────────────────────────────────────────────────────
    # CLIENT CONFIRMATION EMAIL — lane-aware variant
    # ─────────────────────────────────────────────────────────
    client_subject = f"GigLine received your request — {service_display}"

    # Service-lane-specific opening line
    lane_opener = {
        "walkthrough": "Thanks for requesting a Safety Walkthrough. Vince will be in touch within 1 business day to confirm scope and schedule.",
        "doc_review": "Thanks for requesting an OSHA Documentation Readiness Review. Your prep checklist is attached — personalized for your company. Vince will follow up within 1 business day with a fixed quote.",
        "incident_review": "Thanks for reaching out about an incident review. These move fast — Vince will be in touch shortly, often same day.",
        "doc_creation": "Thanks for the program creation request. Vince will review your selections and follow up within 1 business day with a quote.",
        "not_sure": "Thanks for reaching out. Vince will review what you submitted and follow up within 1 business day to figure out the right fit.",
    }.get(data.serviceSelected, "Thanks for reaching out. Vince will follow up within 1 business day.")

    client_html = f"""
<div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1C2B2B;line-height:1.55;padding:0 18px;">
  <p style="font-size:15px;">Hi {first_name or 'there'},</p>
  <p style="font-size:15px;">{lane_opener}</p>
  <p style="font-size:15px;">Here&rsquo;s what happens next:</p>
  <ol style="font-size:15px;padding-left:22px;margin:8px 0 18px;">
    <li style="margin-bottom:4px;">Vince reviews your intake.</li>
    <li style="margin-bottom:4px;">You receive a proposed scope and fixed quote within 1 business day.</li>
    <li style="margin-bottom:4px;">Once confirmed, the engagement is scheduled at a time that works for your operation.</li>
  </ol>
  <p style="font-size:15px;">While you&rsquo;re waiting, here&rsquo;s something worth keeping:</p>
  <p style="font-size:15px;">The <strong>2026 Triad OSHA Field Manual</strong>. 12 pages. The 7 violations OSHA cites Piedmont Triad operations for most often &mdash; CFR codes, penalty ranges, and the fix for each one.</p>
  <p style="font-size:15px;margin:14px 0;">
    <a href="https://www.giglinecompliance.com/assets/gl-fm-2026.pdf"
       style="background:#0A1628;color:#FFFFFF;text-decoration:none;padding:11px 22px;font-weight:bold;font-family:Arial,sans-serif;display:inline-block;">
      Download the 2026 Field Manual (PDF)
    </a>
  </p>
  <p style="font-size:13px;color:#777;margin-top:0;">No forms. No opt-in. Yours to keep.</p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #E5E5E5;" />
  <p style="font-size:15px;"><strong>Your engagement status page:</strong></p>
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
  <p style="margin-top:14px;">
    <img src="https://www.giglinecompliance.com/assets/veteran-owned-badge-sm.png"
         alt="Veteran-Owned Company"
         width="120" height="77"
         style="display:block;max-width:120px;height:auto;border:0;" />
  </p>
</div>"""

    client_send_payload = {
        "from": f"Vince Lawrence <{SENDER_EMAIL}>",
        "to": [data.email],
        "subject": client_subject,
        "html": client_html,
        "reply_to": VINCE_EMAIL,
    }
    # Attach personalized prep checklist for Doc Review lane only.
    # Uses the same GigLine Cover v3 template as the admin "Personalize PDF" tab —
    # header slug becomes "PREPARED FOR {COMPANY} | {year}".
    if data.serviceSelected == "doc_review":
        src_prep_path = "/app/frontend/public/assets/gl-doc-review-prep-checklist.pdf"
        try:
            import base64
            import tempfile
            from lib.pdf_cover import prepend_cover_to_pdf
            from lib.pdf_cover_metadata import COVERS

            meta = COVERS["gl-doc-review-prep-checklist.pdf"]
            # The on-disk PDF already carries a v3 cover as page 1, so we
            # swap it (rather than prepend) with the personalized version.
            kwargs = {k: v for k, v in meta.items() if k != "replace_page_1"}
            personalize_for = (data.companyName or data.contactName or "").strip()
            if personalize_for:
                kwargs["client_name"] = personalize_for

            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False, prefix="gl_intake_prep_") as _tmp:
                tmp_prep_path = _tmp.name
            prepend_cover_to_pdf(
                src_prep_path, tmp_prep_path,
                replace_page_1=True,
                **kwargs,
            )

            with open(tmp_prep_path, "rb") as fp:
                pdf_bytes = fp.read()
            try:
                os.unlink(tmp_prep_path)
            except OSError:
                pass

            slug = (personalize_for or "gigline").lower()
            slug = "".join(ch if ch.isalnum() else "-" for ch in slug).strip("-")[:40] or "gigline"
            filename = f"GigLine_DocReview_PrepChecklist__{slug}.pdf"
            client_send_payload["attachments"] = [{
                "filename": filename,
                "content": base64.b64encode(pdf_bytes).decode("ascii"),
            }]
        except Exception as e:
            logger.warning(f"Personalized prep checklist skipped, falling back to static PDF: {e}")
            try:
                import base64
                with open(src_prep_path, "rb") as fp:
                    client_send_payload["attachments"] = [{
                        "filename": "GigLine_DocReview_PrepChecklist.pdf",
                        "content": base64.b64encode(fp.read()).decode("ascii"),
                    }]
            except Exception as e2:
                logger.warning(f"Static prep checklist attachment also skipped: {e2}")

    # ─────────────────────────────────────────────────────────
    # VINCE NOTIFICATION EMAIL — monospaced, structured, includes priority flags
    # ─────────────────────────────────────────────────────────
    op_type_display = L(OP_TYPES, data.operationType)
    if data.operationType in ("mixed", "other") and data.operationTypeOther:
        op_type_display += f" — {data.operationTypeOther}"
    emp_count_display = L(EMP_COUNTS, data.employeeCountBucket)

    priority_banner = ""
    if priority_flags:
        flag_labels = ", ".join(f.upper() for f in priority_flags)
        priority_banner = (
            f"\n┌─────────────────────────────────────────────────────┐\n"
            f"│  *** PRIORITY: {flag_labels.ljust(36)} ***  │\n"
            f"└─────────────────────────────────────────────────────┘\n"
        )

    vince_subject = (
        f"{'[PRIORITY] ' if priority_flags else ''}New intake — {data.companyName or 'Unknown'} "
        f"· {service_display}"
    )

    def pad(label):
        return label.ljust(26)

    # Build lane-specific block
    lane_block = ""
    if data.serviceSelected == "doc_review":
        concerns = "\n".join(f"  • {item}" for item in (data.docReviewConcerns or [])) or "  (none specified)"
        lane_block = f"""

───────────────────────────────────────────────────────
LANE: DOCUMENTATION & GAP CHECK
───────────────────────────────────────────────────────
{pad('Concerned documents:')}
{concerns}
{pad('Approach:')}{data.docReviewApproach or '—'}"""
    elif data.serviceSelected == "incident_review":
        outcomes = "\n".join(f"  • {item}" for item in (data.incidentNeededOutcomes or [])) or "  (none specified)"
        lane_block = f"""

───────────────────────────────────────────────────────
LANE: INCIDENT REVIEW
───────────────────────────────────────────────────────
{pad('Description:')}{data.incidentDescription or '—'}
{pad('OSHA notified:')}{L(YNS, data.incidentOshaNotified)}
{pad('WC filed:')}{data.incidentWcFiled or '—'}
{pad('Internal report started:')}{L(YNS, data.incidentInternalReportStarted)}
{pad('Needed outcomes:')}
{outcomes}"""
    elif data.serviceSelected == "doc_creation":
        items = "\n".join(f"  • {item}" for item in (data.docCreationItems or [])) or "  (none specified)"
        lane_block = f"""

───────────────────────────────────────────────────────
LANE: DOCUMENT / PROGRAM CREATION
───────────────────────────────────────────────────────
{pad('Items requested:')}
{items}
{pad('Approach:')}{data.docCreationApproach or '—'}
{pad('Facilities:')}{data.docCreationFacilities or '—'}
{pad('Scope type:')}{data.docCreationScopeType or '—'}
{pad('Has deadline:')}{data.docCreationHasDeadline or '—'} {f'({data.docCreationDeadlineDetails})' if data.docCreationDeadlineDetails else ''}
{pad('Pricing displayed:')}{data.docCreationPricingDisplayed or '—'}"""
    elif data.serviceSelected == "walkthrough" or data.serviceSelected == "doc_creation":
        hazards = "\n".join(f"  • {item}" for item in (data.hazardsPresent or [])) or "  (none flagged)"
        lane_block = f"""

───────────────────────────────────────────────────────
HAZARDS & FACILITY PROFILE
───────────────────────────────────────────────────────
{pad('Hazards present:')}
{hazards}
{pad('Safety board posted:')}{L(YNS, data.safetyBoardPosted)}
{pad('Additional notes:')}{data.facilityAdditionalNotes or '—'}"""

    # Section 5 hazards block also for walkthrough/doc_creation
    s5_block = ""
    if data.serviceSelected in ("walkthrough", "doc_creation") and data.hazardsPresent:
        hazards = "\n".join(f"  • {item}" for item in data.hazardsPresent)
        s5_block = f"""

───────────────────────────────────────────────────────
FACILITY HAZARDS PROFILE
───────────────────────────────────────────────────────
{hazards}
{pad('Safety board posted:')}{L(YNS, data.safetyBoardPosted)}
{pad('Other facility notes:')}{data.facilityAdditionalNotes or '—'}"""

    vince_plaintext = f"""\
NEW MASTER INTAKE — {service_display.upper()}
═══════════════════════════════════════════════════════
{priority_banner}
Submitted: {submitted_ts}

───────────────────────────────────────────────────────
COMPANY & CONTACT
───────────────────────────────────────────────────────
{pad('Company:')}{data.companyName or '—'}
{pad('Facility (city, state):')}{data.facilityCityState or '—'}
{pad('Contact:')}{data.contactName or '—'}, {data.contactTitle or '—'}
{pad('Phone:')}{data.phone or '—'}
{pad('Email:')}{data.email or '—'}
{pad('Operation type:')}{op_type_display}
{pad('Employee count:')}{emp_count_display}
{pad('Heard about GigLine:')}{data.referralSource or '—'} {f'({data.referralSourceOther})' if data.referralSourceOther else ''}

───────────────────────────────────────────────────────
SERVICE & URGENCY
───────────────────────────────────────────────────────
{pad('Service requested:')}{service_display}
{pad('Prompting reason:')}{L(PROMPT_REASONS, data.promptingReason)} {f'({data.promptingReasonOther})' if data.promptingReasonOther else ''}
{pad('Has deadline:')}{data.hasDeadline or '—'} {f'(by {data.deadlineDate}, driven by {data.deadlineDriver})' if data.hasDeadline == 'yes' else ''}
{pad('Recent injury/claim:')}{L(YNS, data.hadInjuryOrClaim)}
{(pad('Injury detail:') + (data.injuryClaimDescription or '')) if data.hadInjuryOrClaim == 'yes' else ''}

───────────────────────────────────────────────────────
CORE SAFETY SETUP
───────────────────────────────────────────────────────
{pad('Written safety program:')}{L(YNS, data.q_safety_program)}
{pad('OSHA 300 log kept:')}{L(YNS, data.q_osha_logs)}
{pad('Prior OSHA inspection:')}{L(YNS, data.q_osha_inspection_ever)} {f'({data.oshaInspectionYear}, citations: {data.oshaInspectionCitations})' if data.q_osha_inspection_ever == 'yes' else ''}
{lane_block}{s5_block}

───────────────────────────────────────────────────────
SCHEDULING & LOGISTICS
───────────────────────────────────────────────────────
{pad('Contact method:')}{L(CONTACT_M, data.contactMethod)}
{pad('Best time:')}{L(TIMES, data.bestTime)}
{pad('Preferred days:')}{', '.join(data.preferredDays) if data.preferredDays else '—'}
{pad('Preferred start date:')}{data.preferredStartDate or '—'}
{pad('Blockers:')}{data.blockers or '—'}

───────────────────────────────────────────────────────
PRICING REFERENCE  (current public floor pricing)
───────────────────────────────────────────────────────
Safety Walkthrough : From $1,200 (small ops typically $1,200–$2,000) + travel fee outside primary area
Compliance Readiness Visit : From $2,000 (Walkthrough + Doc Review in a single visit; saves up to $500 vs separate)
Incident Review    : From $1,500 (root cause, OSHA recordability, corrective action plan)
Doc Development    : single program from $350 | LOTO + up to 5 machines from $650 | LOTO + 6–15 machines from $1,200 | full suite (5+ programs) from $2,000
Supervisor Kit     : $600 digital / $675 physical (included free with every CRV)

───────────────────────────────────────────────────────
STATUS PAGE: {status_url}
REPLY TO:    {data.email}
CALL:        {data.phone}
"""

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
