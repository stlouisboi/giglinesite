"""Health & root routes."""

from fastapi import APIRouter
from typing import List
from datetime import datetime
from config import db
from models import StatusCheck, StatusCheckCreate

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "gigline-backend"}


@router.get("/")
async def root():
    return {"message": "GigLine Safety & Compliance API"}


@router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks
