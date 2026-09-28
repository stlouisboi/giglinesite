"""First-Pull checklist series live-send routes (Feb 2026).

Wires the per-slug First-Pull checklists (LOTO, Forklift/PIT, HazCom,
Incident, New-Hire) to real Resend delivery. The checklist body is
rendered inline in the HTML email from the server-side content mirror
in `first_pull_content.py` — the caller only supplies a slug and their
own email, never the body.

Endpoint gated behind FIRST_PULL_CHECKLISTS_ENABLED at the frontend
route level; this backend route stays available so preview-bypass
review works from the private host, but every submission is validated
against the known-slug allow-list here.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from html import escape
import asyncio
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from first_pull_content import FIRST_PULL_CONTENT
from integrations.mailerlite import add_to_lead_nurture
from models import FirstPullLeadRequest

router = APIRouter()
logger = logging.getLogger('gigline')

KIND_LABEL = {"required": "Required", "applicability": "Applicability", "gigline": "GigLine"}
KIND_COLOR = {"required": "#0A5C36", "applicability": "#1B4A78", "gigline": "#8E6D1F"}


def _render_items_html(items):
    """Return the HTML for the checklist item block. Server-side only —
    the caller never supplies HTML."""
    rows = []
    for it in items:
        kind = it.get("kind", "gigline")
        rows.append(
            f'<li style="margin-bottom:14px;padding-left:0;list-style:none;">'
            f'<span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;'
            f'text-transform:uppercase;color:{KIND_COLOR.get(kind, "#8E6D1F")};margin-bottom:4px;">'
            f'{escape(KIND_LABEL.get(kind, "GigLine"))}</span><br/>'
            f'<span style="color:#1C2B2B;font-size:14px;line-height:1.55;">{escape(it["text"])}</span><br/>'
            f'<span style="color:#8B95A7;font-size:11.5px;font-style:italic;">{escape(it["cite"])}</span>'
            f'</li>'
        )
    return "\n".join(rows)


@router.post("/first-pull/submit")
async def submit_first_pull_lead(request: FirstPullLeadRequest):
    """Capture the lead and email the requested First-Pull checklist via Resend."""
    slug = (request.slug or "").strip().lower()
    checklist = FIRST_PULL_CONTENT.get(slug)
    if not checklist:
        raise HTTPException(status_code=400, detail="Unknown checklist slug.")

    # Honeypot — silent drop
    if request.website and request.website.strip():
        logger.info("First-Pull honeypot triggered — dropping submission silently")
        return {"success": True, "message": "Checklist sent to your email"}

    email = request.email.strip().lower()
    first_name = (request.first_name or "").strip()[:80]
    company = (request.company or "").strip()[:120]

    await db.first_pull_leads.insert_one({
        "slug": slug,
        "program": checklist["program"],
        "email": email,
        "first_name": first_name,
        "company": company,
        "marketing_consent": bool(request.marketing_consent),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "first_pull_checklist",
        "slug": slug,
        "program": checklist["program"],
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    if request.marketing_consent:
        asyncio.create_task(add_to_lead_nurture(email=email, source_form=f"first_pull_{slug}"))

    display_name = first_name or "there"
    items_html = _render_items_html(checklist["items"])

    kit_cta = ""
    if checklist.get("kit_url"):
        cta_style = (
            "background:#102A43;color:white;" if checklist.get("kit_live")
            else "background:transparent;color:#102A43;border:1px solid #102A43;"
        )
        kit_cta = (
            f'<p style="margin-top:24px;"><a href="{checklist["kit_url"]}" '
            f'style="{cta_style}display:inline-block;padding:10px 18px;font-weight:bold;text-decoration:none;'
            f'font-size:13px;">{escape(checklist["kit_label"])}</a></p>'
        )

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"Your {checklist['program']} First-Pull Checklist",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 6px; color:#102A43;">{escape(checklist['title'])}</h1>
                <p style="font-size:11px;color:#8E6D1F;letter-spacing:0.24em;text-transform:uppercase;font-weight:bold;margin-top:0;margin-bottom:16px;">FIRST-PULL CHECKLIST</p>
                <p>Hi {escape(display_name)},</p>
                <p style="color:#4A5568;">{escape(checklist['intro'])}</p>
                <p style="font-size:12.5px;color:#8B95A7;font-style:italic;margin-top:16px;">Every item is labeled Required (specific CFR requirement), Applicability (required only when conditions apply), or GigLine (readiness practice, not a specific federal OSHA requirement). Not a legal opinion, not a compliance evaluation.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
                <ul style="padding-left:0;">
                    {items_html}
                </ul>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
                <h3 style="margin-top:20px;color:#102A43;">If several items are gaps</h3>
                <p style="color:#4A5568;">If gaps are primarily documentation, a Documentation Readiness Review is a fixed-quote engagement starting at $1,700. If gaps span both the floor and the paper, a Compliance Readiness Visit combines both starting at $2,500 (a $500 saving versus the two scopes purchased separately).</p>
                {kit_cta}
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    — Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    OSHA 30-Hour General Industry Trained<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
            "reply_to": VINCE_EMAIL,
        })

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"First-Pull ({checklist['program']}) download — {email}",
            "html": (
                f"<p>New First-Pull Checklist download.</p>"
                f"<p><strong>Program:</strong> {escape(checklist['program'])}<br/>"
                f"<strong>Email:</strong> {email}<br/>"
                f"<strong>First name:</strong> {escape(display_name or '(not provided)')}<br/>"
                f"<strong>Company:</strong> {escape(company or '(not provided)')}<br/>"
                f"<strong>Marketing consent:</strong> {'YES' if request.marketing_consent else 'no'}</p>"
                f"<p>Consider a personal follow-up — this visitor is actively researching "
                f"{escape(checklist['program'])} readiness.</p>"
            ),
            "reply_to": email,
        })

        logger.info(f"First-Pull ({slug}) sent to {email}")
    except Exception as e:
        logger.error(f"First-Pull email error: {str(e)}")

    return {"success": True, "message": "Checklist sent to your email"}
