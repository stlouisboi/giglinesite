"""
Admin CRM endpoints — full CRUD for walkthrough_requests (lead inbox).

Lets Vince update lead status, edit fields, add timestamped notes, delete spam,
and manually add a phone-in lead.

All endpoints require ?token=ADMIN_PASSWORD.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import logging

from config import db, ADMIN_PASSWORD

router = APIRouter()
logger = logging.getLogger("gigline")


# ── Models ────────────────────────────────────────────────────────────
VALID_STATUSES = {"new", "contacted", "qualified", "booked", "won", "lost"}


class LeadCreate(BaseModel):
    name: str
    company: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    service: Optional[str] = "Safety Walkthrough"
    status: Optional[str] = "new"


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    service: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str


class NoteCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


# ── Helpers ───────────────────────────────────────────────────────────
def _require_auth(token: str):
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")


def _normalize(doc: dict) -> dict:
    """Strip Mongo _id and ensure notes list exists."""
    doc.pop("_id", None)
    doc.setdefault("notes", [])
    doc.setdefault("status", "new")
    return doc


# ── Endpoints ─────────────────────────────────────────────────────────
@router.get("/admin/walkthrough-leads")
async def list_leads(token: str = "", status: str = "", limit: int = 200):
    """List all walkthrough leads, optionally filtered by status, newest first."""
    _require_auth(token)
    query = {}
    if status:
        if status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")
        query["status"] = status
    cursor = db.walkthrough_requests.find(query, {"_id": 0}).sort("timestamp", -1)
    leads = await cursor.to_list(limit)
    # Ensure every lead has the new fields (back-compat for older records)
    for lead in leads:
        lead.setdefault("notes", [])
        lead.setdefault("status", "new")
    return {"leads": leads, "count": len(leads)}


@router.post("/admin/walkthrough-leads")
async def create_lead(payload: LeadCreate, token: str = ""):
    """Manually add a lead (phone-in, in-person referral, etc.)."""
    _require_auth(token)
    status = payload.status or "new"
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "company": payload.company or "",
        "phone": payload.phone or "",
        "email": payload.email or "",
        "service": payload.service or "Safety Walkthrough",
        "status": status,
        "notes": [],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "manual",  # distinguishes from web-form leads
        "utm_source": "manual",
        "utm_medium": "",
        "utm_campaign": "",
        "utm_term": "",
        "utm_content": "",
    }
    await db.walkthrough_requests.insert_one(doc)
    return _normalize(doc)


@router.patch("/admin/walkthrough-leads/{lead_id}")
async def update_lead(lead_id: str, payload: LeadUpdate, token: str = ""):
    """Edit one or more lead fields (name, company, phone, email, service)."""
    _require_auth(token)
    updates = {k: v for k, v in payload.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.walkthrough_requests.update_one({"id": lead_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = await db.walkthrough_requests.find_one({"id": lead_id}, {"_id": 0})
    return _normalize(lead) if lead else {"status": "ok"}


@router.patch("/admin/walkthrough-leads/{lead_id}/status")
async def update_lead_status(lead_id: str, payload: StatusUpdate, token: str = ""):
    """Change lead status (new → contacted → qualified → booked → won/lost)."""
    _require_auth(token)
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {sorted(VALID_STATUSES)}",
        )

    result = await db.walkthrough_requests.update_one(
        {"id": lead_id},
        {"$set": {"status": payload.status, "status_updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "ok", "new_status": payload.status}


@router.post("/admin/walkthrough-leads/{lead_id}/notes")
async def add_note(lead_id: str, payload: NoteCreate, token: str = ""):
    """Append a timestamped note to a lead."""
    _require_auth(token)
    note = {
        "id": str(uuid.uuid4()),
        "text": payload.text.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "author": "Vince",
    }
    result = await db.walkthrough_requests.update_one(
        {"id": lead_id}, {"$push": {"notes": note}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return note


@router.delete("/admin/walkthrough-leads/{lead_id}/notes/{note_id}")
async def delete_note(lead_id: str, note_id: str, token: str = ""):
    """Remove a single note from a lead."""
    _require_auth(token)
    result = await db.walkthrough_requests.update_one(
        {"id": lead_id}, {"$pull": {"notes": {"id": note_id}}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "ok"}


@router.delete("/admin/walkthrough-leads/{lead_id}")
async def delete_lead(lead_id: str, token: str = ""):
    """Permanently delete a lead (e.g., spam/test entries)."""
    _require_auth(token)
    result = await db.walkthrough_requests.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "ok"}
