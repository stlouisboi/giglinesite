"""Recommendation-as-PDF live-send route (Feb 2026, Batch 2B.1).

When a visitor completes the /recommendation router and asks to have
their recommendation emailed, the frontend POSTs to
`/api/recommendation/email` with the slug of the recommended service,
the visitor's contact info, and (optionally) the shallow answer summary
that led to the recommendation. The backend:

    1. Validates the slug against a strict server-side allow-list so no
       caller can direct arbitrary content through the domain.
    2. Silently drops honeypot hits.
    3. Stores the lead in `db.recommendation_email_leads` and records a
       download event.
    4. Renders a per-visitor branded PDF at request time via
       `scripts.generate_recommendation_pdf.build_recommendation_pdf`
       (no static file on disk — the caller cannot exfiltrate anyone
       else's PDF).
    5. Sends the visitor an HTML email with the PDF attached, and Vince
       a lead alert with the slug so he can follow up.
    6. Enrols the visitor in the MailerLite lead-nurture ONLY when
       marketing consent is on.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from html import escape
import asyncio
import base64
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from recommendation_content import RECOMMENDATION_CONTENT, FIELD_NOTES_BY_SLUG, FIELD_NOTES_BASE_URL
from scripts.generate_recommendation_pdf import build_recommendation_pdf, build_field_notes_companion_pdf
from integrations.mailerlite import add_to_lead_nurture
from models import RecommendationEmailRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/recommendation/email")
async def email_recommendation(request: RecommendationEmailRequest):
    slug = (request.slug or "").strip().lower()
    content = RECOMMENDATION_CONTENT.get(slug)
    if not content:
        raise HTTPException(status_code=400, detail="Unknown recommendation slug.")

    if request.website and request.website.strip():
        logger.info("Recommendation-email honeypot triggered — dropping submission silently")
        return {"success": True, "message": "Recommendation sent to your email"}

    email = request.email.strip().lower()
    first_name = (request.first_name or "").strip()[:80]
    company = (request.company or "").strip()[:120]

    # Sanitize + cap answers so the PDF and the lead record stay bounded.
    raw_answers = request.answers or {}
    answers_summary = []
    for k, v in list(raw_answers.items())[:12]:
        answers_summary.append({"key": str(k)[:40], "value": str(v)[:120]})

    await db.recommendation_email_leads.insert_one({
        "slug": slug,
        "service_name": content["name"],
        "email": email,
        "first_name": first_name,
        "company": company,
        "marketing_consent": bool(request.marketing_consent),
        "include_field_notes": bool(request.include_field_notes),
        "answers": answers_summary,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "recommendation_email",
        "slug": slug,
        "service_name": content["name"],
        "email": email,
        "with_field_notes": bool(request.include_field_notes),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    if request.marketing_consent:
        asyncio.create_task(add_to_lead_nurture(email=email, source_form=f"recommendation_{slug}"))

    display_name = first_name or "there"
    with_field_notes = bool(request.include_field_notes)

    try:
        pdf_bytes = build_recommendation_pdf(
            content=content,
            first_name=first_name,
            company=company,
            answers_summary=answers_summary,
        )
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
        pdf_filename = f"GigLine_Recommendation_{content['slug']}.pdf"

        attachments = [{"filename": pdf_filename, "content": pdf_b64}]

        # Optional second attachment: curated field-notes companion PDF
        field_notes = FIELD_NOTES_BY_SLUG.get(slug) or []
        field_notes_html_block = ""
        if with_field_notes and field_notes:
            companion_bytes = build_field_notes_companion_pdf(
                content=content,
                field_notes=field_notes,
                first_name=first_name,
                base_url=FIELD_NOTES_BASE_URL,
            )
            attachments.append({
                "filename": f"GigLine_Field_Notes_Companion_{content['slug']}.pdf",
                "content": base64.b64encode(companion_bytes).decode("utf-8"),
            })
            note_bullets = "".join(
                f'<li style="margin-bottom:8px;"><strong>{escape(n["title"])}</strong> — {escape(n["why"])} '
                f'<a href="{FIELD_NOTES_BASE_URL}/{escape(n["slug"])}" style="color:#102A43;">Read online</a></li>'
                for n in field_notes
            )
            field_notes_html_block = (
                '<h3 style="margin-top:24px;margin-bottom:8px;color:#102A43;">Also attached — Field Notes companion</h3>'
                '<p style="color:#4A5568;">You also asked for a curated field-note reading list for this '
                f'engagement. The four notes below pair with the {escape(content["name"])} recommendation:</p>'
                f'<ul style="color:#4A5568;padding-left:18px;margin-top:8px;">{note_bullets}</ul>'
            )

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": (
                f"Your GigLine recommendation + Field Notes companion, {content['name']}"
                if with_field_notes and field_notes
                else f"Your GigLine recommendation, {content['name']}"
            ),
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1C2B2B;">
                <p style="font-size:11px;color:#8E6D1F;letter-spacing:0.24em;text-transform:uppercase;font-weight:bold;margin:0 0 8px 0;">YOUR GIGLINE RECOMMENDATION</p>
                <h1 style="font-size: 24px; margin: 0 0 6px 0; color:#102A43;">{escape(content['name'])}</h1>
                <p style="font-size:16px;font-weight:bold;color:#102A43;margin:0 0 20px 0;">{escape(content['price'])}</p>
                <p>Hi {escape(display_name)},</p>
                <p style="color:#4A5568;">Here is your GigLine recommendation. The one-page summary is attached as a PDF you can print, forward to a supervisor, or drop into a compliance binder.</p>
                <p style="color:#4A5568;">{escape(content['why'])}</p>
                {field_notes_html_block}
                <p style="margin-top:22px;">
                    <a href="{escape(content['route'])}"
                       style="background:#102A43;color:white;display:inline-block;padding:12px 20px;font-weight:bold;text-decoration:none;font-size:14px;">
                        See the {escape(content['name'])} service page
                    </a>
                </p>
                <p style="color:#4A5568;font-size:14px;">If the fit is right, reply to this email and I will schedule the visit or send a fixed quote.</p>
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
            "attachments": attachments,
            "reply_to": VINCE_EMAIL,
        })

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": (
                f"Recommendation ({content['name']}) + Field Notes emailed — {email}"
                if with_field_notes and field_notes
                else f"Recommendation ({content['name']}) emailed — {email}"
            ),
            "html": (
                f"<p>New recommendation-email download from the /recommendation router.</p>"
                f"<p><strong>Service:</strong> {escape(content['name'])} ({escape(content['price'])})<br/>"
                f"<strong>Email:</strong> {email}<br/>"
                f"<strong>First name:</strong> {escape(display_name or '(not provided)')}<br/>"
                f"<strong>Company:</strong> {escape(company or '(not provided)')}<br/>"
                f"<strong>Marketing consent:</strong> {'YES' if request.marketing_consent else 'no'}<br/>"
                f"<strong>Also took Field Notes companion:</strong> {'YES' if with_field_notes and field_notes else 'no'}</p>"
                f"<p>The visitor is warm — they just chose to receive their recommendation in writing. "
                f"Personal follow-up within 24 hours converts these quickly"
                f"{' — bonus signal: they also asked for the field-note reading list, so they are actively researching.' if with_field_notes and field_notes else '.'}"
                f"</p>"
            ),
            "reply_to": email,
        })

        logger.info(
            f"Recommendation ({slug}) sent to {email}"
            + (" (+ Field Notes companion)" if with_field_notes and field_notes else "")
        )
    except Exception as e:
        logger.error(f"Recommendation email error: {str(e)}")

    return {"success": True, "message": "Recommendation sent to your email"}
