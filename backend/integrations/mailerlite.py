"""
MailerLite integration — list management for marketing email automation.

Two lists/groups:
  - Lead Nurture: prospects (Safety Check, HazCom, Heat Guide, Intake form sign-ups)
  - Past Client: completed engagements (status = report_delivered in gl_bookings)

Resend remains the transactional provider. This module only handles marketing.
"""

import os
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger("gigline")

ML_BASE = "https://connect.mailerlite.com/api"
ML_TOKEN = os.environ.get("MAILERLITE_API_TOKEN", "")

# Group IDs are looked up at runtime by name; cached in module memory after first call
_GROUP_CACHE: Dict[str, str] = {}

LIST_LEAD_NURTURE = "Lead Nurture"
LIST_PAST_CLIENT = "Past Client"
LIST_PAUSED = "Paused — Active Engagement"


def _headers() -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {ML_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


async def _get_group_id(name: str) -> Optional[str]:
    """Resolve a MailerLite group name to its ID, with caching."""
    if not ML_TOKEN:
        return None
    if name in _GROUP_CACHE:
        return _GROUP_CACHE[name]
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{ML_BASE}/groups", headers=_headers(), params={"limit": 100})
            if r.status_code != 200:
                logger.warning(f"MailerLite groups fetch failed: {r.status_code}")
                return None
            for group in r.json().get("data", []):
                _GROUP_CACHE[group["name"]] = group["id"]
            return _GROUP_CACHE.get(name)
    except Exception as e:
        logger.error(f"MailerLite group lookup error: {e}")
        return None


async def _ensure_group(name: str) -> Optional[str]:
    """Get group ID, creating the group if it doesn't exist."""
    gid = await _get_group_id(name)
    if gid:
        return gid
    if not ML_TOKEN:
        return None
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(f"{ML_BASE}/groups", headers=_headers(), json={"name": name})
            if r.status_code in (200, 201):
                gid = r.json()["data"]["id"]
                _GROUP_CACHE[name] = gid
                logger.info(f"Created MailerLite group: {name} ({gid})")
                return gid
    except Exception as e:
        logger.error(f"MailerLite group create error: {e}")
    return None


async def add_to_lead_nurture(
    email: str,
    name: str = "",
    company: str = "",
    source_form: str = "",
    attribution: Optional[Dict[str, Any]] = None,
) -> bool:
    """
    Add a contact to the Lead Nurture list.
    First-touch wins: if subscriber already exists in any GigLine list, do not re-add.
    """
    if not ML_TOKEN or not email:
        return False

    # Check for existing subscriber to enforce first-touch-wins
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            existing = await client.get(
                f"{ML_BASE}/subscribers/{email}", headers=_headers()
            )
            if existing.status_code == 200:
                groups = existing.json().get("data", {}).get("groups", []) or []
                # Already in Past Client or Lead Nurture → don't re-trigger nurture
                if any(g.get("name") in (LIST_LEAD_NURTURE, LIST_PAST_CLIENT) for g in groups):
                    logger.info(f"MailerLite: {email} already in a GigLine list — skipping re-add")
                    return True
    except Exception as e:
        logger.warning(f"MailerLite existing-subscriber check failed (non-fatal): {e}")

    group_id = await _ensure_group(LIST_LEAD_NURTURE)
    if not group_id:
        logger.error("MailerLite: Lead Nurture group could not be resolved")
        return False

    first_name = (name.split(" ")[0] if name else "").strip()

    fields: Dict[str, Any] = {
        "name": first_name,
        "company": company or "",
        "source_form": source_form or "",
    }
    if attribution and isinstance(attribution, dict):
        first = attribution.get("firstTouch") or {}
        if first.get("utm_source"):
            fields["first_touch_source"] = first.get("utm_source", "")
        if first.get("utm_campaign"):
            fields["first_touch_campaign"] = first.get("utm_campaign", "")

    payload = {
        "email": email,
        "fields": fields,
        "groups": [group_id],
        "status": "active",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{ML_BASE}/subscribers", headers=_headers(), json=payload
            )
            if r.status_code in (200, 201):
                logger.info(f"MailerLite: added {email} to Lead Nurture")
                return True
            logger.warning(f"MailerLite add failed {r.status_code}: {r.text[:200]}")
    except Exception as e:
        logger.error(f"MailerLite add error: {e}")
    return False


async def move_to_past_client(email: str) -> bool:
    """
    Move subscriber from Lead Nurture (or any list) to Past Client.
    Triggered when engagement status hits report_delivered.
    """
    if not ML_TOKEN or not email:
        return False

    past_client_gid = await _ensure_group(LIST_PAST_CLIENT)
    lead_nurture_gid = await _get_group_id(LIST_LEAD_NURTURE)
    paused_gid = await _get_group_id(LIST_PAUSED)
    if not past_client_gid:
        return False

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # Add to Past Client
            r = await client.post(
                f"{ML_BASE}/subscribers/{email}/groups/{past_client_gid}",
                headers=_headers(),
            )
            if r.status_code not in (200, 201):
                # Subscriber may not exist yet — create them
                await client.post(
                    f"{ML_BASE}/subscribers",
                    headers=_headers(),
                    json={"email": email, "groups": [past_client_gid], "status": "active"},
                )

            # Remove from Lead Nurture and Paused if present
            for gid in (lead_nurture_gid, paused_gid):
                if gid:
                    await client.delete(
                        f"{ML_BASE}/subscribers/{email}/groups/{gid}",
                        headers=_headers(),
                    )

            logger.info(f"MailerLite: {email} moved to Past Client")
            return True
    except Exception as e:
        logger.error(f"MailerLite move-to-past-client error: {e}")
    return False


async def pause_engagement(email: str) -> bool:
    """
    Pause Lead Nurture for a contact whose engagement is active.
    Moves them from Lead Nurture → Paused list (no automation runs there).
    """
    if not ML_TOKEN or not email:
        return False

    paused_gid = await _ensure_group(LIST_PAUSED)
    lead_nurture_gid = await _get_group_id(LIST_LEAD_NURTURE)
    if not paused_gid:
        return False

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(
                f"{ML_BASE}/subscribers/{email}/groups/{paused_gid}",
                headers=_headers(),
            )
            if lead_nurture_gid:
                await client.delete(
                    f"{ML_BASE}/subscribers/{email}/groups/{lead_nurture_gid}",
                    headers=_headers(),
                )
            logger.info(f"MailerLite: paused {email}")
            return True
    except Exception as e:
        logger.error(f"MailerLite pause error: {e}")
    return False
