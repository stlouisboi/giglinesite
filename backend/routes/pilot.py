"""3-Client Pilot control room, admin endpoints.

Collections:
    gl_pilot_clients          One doc per pilot client
    gl_pilot_service_months   One doc per client per calendar month

The 8-metric scorecard is computed on demand from the raw month logs.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from statistics import mean
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from config import ADMIN_PASSWORD, db

router = APIRouter()
logger = logging.getLogger("gigline")

CLIENTS = "gl_pilot_clients"
MONTHS = "gl_pilot_service_months"
BUDGET_HOURS = 8.0


def _require_admin(token: str) -> None:
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ── Models ─────────────────────────────────────────────────────────────
class ClientPayload(BaseModel):
    token: str
    code: str = Field(..., min_length=2, max_length=8, pattern=r"^[A-Z0-9]+$")
    name: str
    location: str
    industry: str = ""
    start_date: str          # ISO YYYY-MM-DD
    crv_completed: bool = False
    agreement_signed: bool = False
    first_cycle_completed: bool = False
    notes: str = ""


class MonthPayload(BaseModel):
    token: str
    client_code: str
    month: str               # YYYY-MM
    hours_onsite: float = 0
    hours_prep: float = 0
    hours_remote: float = 0
    hours_meeting: float = 0
    hours_admin: float = 0
    findings_opened: int = 0
    findings_closed: int = 0
    findings_open_at_month_end: int = 0
    satisfaction_score: Optional[int] = None      # 1..5, only at months 3/6/9/12
    summary_delivered_on_time: bool = True
    scope_creep_absorption: int = 0
    overage_change_order: bool = False
    notes: str = ""


# ── Client endpoints ───────────────────────────────────────────────────
@router.post("/admin/pilot/client")
async def upsert_client(payload: ClientPayload):
    _require_admin(payload.token)
    doc = payload.model_dump(exclude={"token"})
    doc["updatedAt"] = datetime.now(timezone.utc).isoformat()
    await db[CLIENTS].update_one({"code": payload.code}, {"$set": doc, "$setOnInsert": {"createdAt": doc["updatedAt"]}}, upsert=True)
    return {"status": "ok", "code": payload.code}


@router.get("/admin/pilot/clients")
async def list_clients(token: str = ""):
    _require_admin(token)
    cur = db[CLIENTS].find({}, {"_id": 0}).sort("code", 1)
    return {"items": await cur.to_list(length=100)}


# ── Month endpoints ────────────────────────────────────────────────────
@router.post("/admin/pilot/month")
async def upsert_month(payload: MonthPayload):
    _require_admin(payload.token)
    doc = payload.model_dump(exclude={"token"})
    hours = doc["hours_onsite"] + doc["hours_prep"] + doc["hours_remote"] + doc["hours_meeting"] + doc["hours_admin"]
    doc["total_hours"] = round(hours, 2)
    doc["over_budget"] = hours > BUDGET_HOURS
    doc["updatedAt"] = datetime.now(timezone.utc).isoformat()
    await db[MONTHS].update_one(
        {"client_code": payload.client_code, "month": payload.month},
        {"$set": doc, "$setOnInsert": {"createdAt": doc["updatedAt"]}},
        upsert=True,
    )
    return {"status": "ok", "total_hours": doc["total_hours"], "over_budget": doc["over_budget"]}


@router.get("/admin/pilot/months")
async def list_months(token: str = "", client_code: str = ""):
    _require_admin(token)
    q = {"client_code": client_code} if client_code else {}
    cur = db[MONTHS].find(q, {"_id": 0}).sort("month", 1)
    return {"items": await cur.to_list(length=500)}


# ── Scorecard ──────────────────────────────────────────────────────────
@router.get("/admin/pilot/scorecard")
async def scorecard(token: str = ""):
    _require_admin(token)
    clients = await db[CLIENTS].find({}, {"_id": 0}).sort("code", 1).to_list(length=100)
    all_months = await db[MONTHS].find({}, {"_id": 0}).sort("month", 1).to_list(length=1000)

    per_client = []
    aggregate_months = len(all_months)
    aggregate_in_budget = sum(1 for m in all_months if not m.get("over_budget"))
    aggregate_hours_used = sum(m.get("total_hours", 0) for m in all_months)
    aggregate_hours_budgeted = aggregate_months * BUDGET_HOURS

    for c in clients:
        code = c["code"]
        cm = [m for m in all_months if m["client_code"] == code]
        cm_sorted = sorted(cm, key=lambda x: x["month"])
        n = len(cm_sorted)

        # Metric 1: within budget rate
        in_budget = sum(1 for m in cm_sorted if not m.get("over_budget"))
        # Metric 2: scope creep absorptions
        creep_total = sum(m.get("scope_creep_absorption", 0) for m in cm_sorted)
        # Metric 3: latest satisfaction
        satis_scores = [m.get("satisfaction_score") for m in cm_sorted if m.get("satisfaction_score") is not None]
        latest_satis = satis_scores[-1] if satis_scores else None
        # Metric 4: open-findings trend
        trend = None
        if n >= 2:
            first = cm_sorted[0].get("findings_open_at_month_end", 0)
            last = cm_sorted[-1].get("findings_open_at_month_end", 0)
            trend = "declining" if last < first else ("flat" if last == first else "growing")
        # Metric 5: on-time delivery rate
        on_time = sum(1 for m in cm_sorted if m.get("summary_delivered_on_time"))
        # Metric 6: prerequisites complete
        prereqs_ok = bool(c.get("crv_completed") and c.get("agreement_signed") and c.get("first_cycle_completed"))
        # Metric 7: any overage handled via written change order
        any_overage_co = any(m.get("overage_change_order") for m in cm_sorted)
        # Metric 8: hours logged vs budgeted ratio
        hours_used = sum(m.get("total_hours", 0) for m in cm_sorted)
        hours_budgeted = n * BUDGET_HOURS
        ratio = round(hours_used / hours_budgeted, 2) if hours_budgeted else None

        per_client.append({
            "code": code,
            "name": c.get("name"),
            "month_count": n,
            "within_budget_pct": round(100 * in_budget / n, 1) if n else None,
            "scope_creep_absorptions": creep_total,
            "latest_satisfaction": latest_satis,
            "findings_trend": trend,
            "on_time_pct": round(100 * on_time / n, 1) if n else None,
            "prerequisites_complete": prereqs_ok,
            "any_overage_change_order": any_overage_co,
            "hours_used": round(hours_used, 2),
            "hours_budgeted": hours_budgeted,
            "hours_ratio": ratio,
        })

    return {
        "clients_count": len(clients),
        "aggregate": {
            "months_logged": aggregate_months,
            "within_budget_pct": round(100 * aggregate_in_budget / aggregate_months, 1) if aggregate_months else None,
            "hours_used": round(aggregate_hours_used, 2),
            "hours_budgeted": aggregate_hours_budgeted,
            "hours_ratio": round(aggregate_hours_used / aggregate_hours_budgeted, 2) if aggregate_hours_budgeted else None,
        },
        "thresholds": {
            "within_budget_target": 80,
            "within_budget_floor": 60,
            "max_scope_creep_per_client": 1,
            "min_satisfaction": 4,
        },
        "clients": per_client,
    }
