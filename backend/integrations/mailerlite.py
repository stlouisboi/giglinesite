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
# GL-WEB-RET-001 — Past-client 4-touch retention (Day 30/60/90/180)
LIST_RETENTION_4_TOUCH = "Retention - 4 Touch"
# GL-WEB-015 — Supervisor Safety Starter System purchases
LIST_KIT_DIGITAL = "supervisor-kit-digital"
LIST_KIT_PHYSICAL = "supervisor-kit-physical"

# GL-WEB-013 — service-specific groups (one single-email confirmation automation per service)
SERVICE_GROUP_NAMES = {
    "Safety Walkthrough": "Service - Safety Walkthrough",
    "Documentation Review": "Service - Documentation Review",
    "Incident Review": "Service - Incident Review",
}

# GL-INTAKE-002 — service lane → MailerLite group routing
# Maps the intake form's serviceSelected value to its destination group.
INTAKE_LANE_GROUPS = {
    "walkthrough": "Service - Safety Walkthrough",
    "doc_review": "Service - Documentation Review",
    "incident_review": "Service - Incident Review",
    "doc_creation": "Service - Doc Creation",
    "not_sure": "Lead Nurture",
}

# GL-INTAKE-002 — priority flag groups for same-day Vince notification
PRIORITY_GROUPS = {
    "urgent": "Priority - Urgent",
    "injury": "Priority - Injury Reported",
}


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

            # GL-WEB-RET-001 — also enroll in 4-touch Retention sequence
            retention_gid = await _ensure_group(LIST_RETENTION_4_TOUCH)
            if retention_gid:
                await client.post(
                    f"{ML_BASE}/subscribers/{email}/groups/{retention_gid}",
                    headers=_headers(),
                )

            logger.info(f"MailerLite: {email} moved to Past Client + Retention - 4 Touch")
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


async def add_to_service_request(
    email: str,
    service: str,
    name: str = "",
    company: str = "",
    attribution: Optional[Dict[str, Any]] = None,
) -> bool:
    """
    GL-WEB-013 — Service request routing.

    Walkthrough request form submissions route to one of three service-specific
    MailerLite groups based on the selected service. Each group has its own
    single-email confirmation automation in MailerLite ('I received your
    request for X...'). Service requesters do NOT enter the Lead Nurture
    7-touch sequence — they are hot leads expecting a real call within one
    business day, not a 6-week marketing drip.

    Falls back to Lead Nurture only when the visitor picked 'Not sure' or
    left the service field blank.
    """
    if not ML_TOKEN or not email:
        return False

    group_name = SERVICE_GROUP_NAMES.get(service)
    if not group_name:
        # Unknown / "Not sure" / empty — default to Lead Nurture cold-lead drip
        return await add_to_lead_nurture(
            email=email,
            name=name,
            company=company,
            source_form="walkthrough_request_other",
            attribution=attribution,
        )

    group_id = await _ensure_group(group_name)
    if not group_id:
        logger.error(f"MailerLite: service group '{group_name}' could not be resolved")
        return False

    first_name = (name.split(" ")[0] if name else "").strip()

    fields: Dict[str, Any] = {
        "name": first_name,
        "company": company or "",
        "source_form": "walkthrough_request",
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
                logger.info(f"MailerLite: added {email} to {group_name}")
                return True
            logger.warning(f"MailerLite service-request add failed {r.status_code}: {r.text[:200]}")
    except Exception as e:
        logger.error(f"MailerLite service-request error: {e}")
    return False


async def add_to_intake_lane(
    email: str,
    lane: str,
    priority_flags: Optional[list] = None,
    name: str = "",
    company: str = "",
    attribution: Optional[Dict[str, Any]] = None,
) -> bool:
    """
    GL-INTAKE-002 — Master intake form routing.

    Adds the prospect to the appropriate service-lane group AND any active
    priority-flag groups (urgent / injury reported). One subscriber can be
    in multiple groups simultaneously; each group can carry its own
    welcome / notification automation.

    Args:
        email: prospect email (required)
        lane: one of walkthrough | doc_review | incident_review | doc_creation | not_sure
        priority_flags: optional list of 'urgent' | 'injury' to add same-day flags
        name, company, attribution: subscriber metadata

    Returns:
        True if at least the lane group write succeeded.
    """
    if not ML_TOKEN or not email:
        return False

    lane_group_name = INTAKE_LANE_GROUPS.get(lane, "Lead Nurture")
    lane_gid = await _ensure_group(lane_group_name)

    # Resolve priority group IDs (skip silently if flag not recognized)
    priority_gids = []
    for flag in (priority_flags or []):
        gname = PRIORITY_GROUPS.get(flag)
        if gname:
            gid = await _ensure_group(gname)
            if gid:
                priority_gids.append(gid)

    if not lane_gid:
        logger.error(f"MailerLite: intake lane group '{lane_group_name}' could not be resolved")
        return False

    first_name = (name.split(" ")[0] if name else "").strip()
    fields: Dict[str, Any] = {
        "name": first_name,
        "company": company or "",
        "source_form": "master_intake",
        "service_lane": lane,
    }
    if attribution and isinstance(attribution, dict):
        first = attribution.get("firstTouch") or {}
        if first.get("utm_source"):
            fields["first_touch_source"] = first.get("utm_source", "")
        if first.get("utm_campaign"):
            fields["first_touch_campaign"] = first.get("utm_campaign", "")

    all_groups = [lane_gid] + priority_gids
    payload = {
        "email": email,
        "fields": fields,
        "groups": all_groups,
        "status": "active",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{ML_BASE}/subscribers", headers=_headers(), json=payload
            )
            if r.status_code in (200, 201):
                logger.info(
                    f"MailerLite: intake {email} → {lane_group_name} "
                    f"+ {len(priority_gids)} priority flag(s): {priority_flags or []}"
                )
                return True
            logger.warning(f"MailerLite intake-lane add failed {r.status_code}: {r.text[:200]}")
    except Exception as e:
        logger.error(f"MailerLite intake-lane error: {e}")
    return False



async def add_to_kit_buyer(
    email: str,
    variant: str,
    name: str = "",
    company: str = "",
) -> bool:
    """
    GL-WEB-015 — Tag Supervisor Safety Starter System buyer in MailerLite.

    `variant` must be 'digital' or 'physical'. Adds the contact to the
    matching kit group (a no-op if the group does not exist).
    """
    if not ML_TOKEN or not email or variant not in ("digital", "physical"):
        return False

    group_name = LIST_KIT_DIGITAL if variant == "digital" else LIST_KIT_PHYSICAL
    gid = await _ensure_group(group_name)
    if not gid:
        return False

    first_name = (name.split(" ")[0] if name else "").strip()
    payload = {
        "email": email,
        "fields": {
            "name": first_name,
            "company": company or "",
            "source_form": f"supervisor-kit-{variant}",
        },
        "groups": [gid],
        "status": "active",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{ML_BASE}/subscribers", headers=_headers(), json=payload
            )
            if r.status_code in (200, 201):
                logger.info(f"MailerLite: kit buyer {email} → {group_name}")
                return True
            logger.warning(f"MailerLite kit-buyer add failed {r.status_code}: {r.text[:200]}")
    except Exception as e:
        logger.error(f"MailerLite kit-buyer error: {e}")
    return False
