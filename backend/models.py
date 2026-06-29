"""Pydantic models shared across route modules."""

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional, Dict
from datetime import datetime, timezone
import uuid


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    service_type: str
    service_name: str
    amount: float
    currency: str = "usd"
    payment_status: str = "pending"
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CheckoutRequest(BaseModel):
    service_type: str
    origin_url: str
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None


class SafetyCheckSubmission(BaseModel):
    name: str
    company: str
    phone: str = ""
    email: str
    role: str = ""
    operation_type: str = ""
    employee_count: str = ""
    score_display: str
    score_gaps: int
    concerned_question: str = ""
    what_pushed: str = ""
    answers: Dict[str, str]


class WalkthroughRequest(BaseModel):
    name: str
    company: str
    phone: str
    service: str
    email: EmailStr
    city: str
    utm_source: str = ""
    utm_medium: str = ""
    utm_campaign: str = ""
    utm_term: str = ""
    utm_content: str = ""


class HazComCheckoutRequest(BaseModel):
    origin_url: str


class HeatGuideRequest(BaseModel):
    email: str


class SampleReportRequest(BaseModel):
    first_name: str
    email: EmailStr
    company: Optional[str] = ""
