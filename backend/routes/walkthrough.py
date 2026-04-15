"""Walkthrough intake routes."""

from fastapi import APIRouter
from datetime import datetime, timezone
import uuid
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from models import WalkthroughRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/walkthrough/request")
async def submit_walkthrough_request(request: WalkthroughRequest):
    """Accept walkthrough intake form and notify Vince via email."""
    doc = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "company": request.company,
        "operation_type": request.operation_type,
        "location": request.location,
        "description": request.description,
        "status": "new",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "utm_source": request.utm_source,
        "utm_medium": request.utm_medium,
        "utm_campaign": request.utm_campaign,
        "utm_term": request.utm_term,
        "utm_content": request.utm_content,
    }
    await db.walkthrough_requests.insert_one(doc)

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"New Walkthrough Request: {request.company}",
            "html": (
                f"<h2>New Walkthrough Request</h2>"
                f"<p><strong>Name:</strong> {request.name}</p>"
                f"<p><strong>Company:</strong> {request.company}</p>"
                f"<p><strong>Operation Type:</strong> {request.operation_type}</p>"
                f"<p><strong>Location:</strong> {request.location}</p>"
                f"<p><strong>Description:</strong> {request.description or 'N/A'}</p>"
                f"{'<p><strong>Source:</strong> ' + request.utm_source + ' / ' + request.utm_medium + ' / ' + request.utm_campaign + '</p>' if request.utm_source else ''}"
                f"<p><em>Submitted at {doc['timestamp']}</em></p>"
            ),
        })
    except Exception as e:
        logger.error(f"Failed to send walkthrough notification email: {e}")

    return {"status": "ok", "id": doc["id"]}
