"""Field Notes monthly newsletter subscription endpoint."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import uuid
import logging

from config import db
from integrations.mailerlite import add_to_lead_nurture

router = APIRouter()
logger = logging.getLogger("gigline")


class NewsletterSubscription(BaseModel):
    email: EmailStr
    source: str = "field-notes"
    website: str = ""  # honeypot


@router.post("/newsletter/subscribe")
async def subscribe_to_newsletter(payload: NewsletterSubscription):
    """Capture an email for the monthly Field Notes newsletter."""
    # Honeypot — silently drop bots
    if payload.website:
        return {"status": "ok"}

    email = payload.email.strip().lower()

    # Deduplicate in our local collection
    existing = await db.newsletter_subscribers.find_one({"email": email})
    if existing:
        return {"status": "already_subscribed"}

    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "source": payload.source,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "status": "active",
    }
    await db.newsletter_subscribers.insert_one(doc)

    # Best-effort push to MailerLite Lead Nurture list (non-fatal if it fails)
    try:
        await add_to_lead_nurture(
            email=email,
            source_form=f"newsletter-{payload.source}",
        )
    except Exception as e:
        logger.warning(f"MailerLite newsletter sync failed (non-fatal): {e}")

    return {"status": "ok"}
