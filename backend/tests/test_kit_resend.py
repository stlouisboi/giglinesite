"""Self-serve kit resend endpoint — validation, rate limit, and audit regression."""

import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture
def unique_email():
    """Fresh email per test → rate-limit collections don't collide."""
    return f"resend-test-{uuid.uuid4().hex[:10]}@example.com"


def test_resend_rejects_invalid_email(s):
    r = s.post(f"{API}/kit-orders/resend", json={"email": "notanemail"})
    assert r.status_code in (400, 422)


def test_resend_rejects_missing_email(s):
    r = s.post(f"{API}/kit-orders/resend", json={})
    assert r.status_code == 422


def test_resend_unknown_email_returns_generic_success(s, unique_email):
    """Never reveal whether an email is in the DB — always return 200 + generic msg."""
    r = s.post(f"{API}/kit-orders/resend", json={"email": unique_email})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["orders_resent"] == 0
    # Response must be generic, not "no order found"
    assert "if a paid" in body["message"].lower()


def test_resend_response_shape(s, unique_email):
    r = s.post(f"{API}/kit-orders/resend", json={"email": unique_email})
    body = r.json()
    for k in ("ok", "message", "orders_resent"):
        assert k in body


def test_resend_rate_limit_enforced(s, unique_email):
    """4th call within the window returns 429."""
    for i in range(3):
        r = s.post(f"{API}/kit-orders/resend", json={"email": unique_email})
        assert r.status_code == 200, f"call {i+1} unexpectedly rejected: {r.status_code}"
    r4 = s.post(f"{API}/kit-orders/resend", json={"email": unique_email})
    assert r4.status_code == 429
    assert "too many" in r4.json()["detail"].lower()


def test_resend_email_case_insensitive(s):
    """Same email, different casing, must share rate-limit bucket."""
    e_lower = f"case-{uuid.uuid4().hex[:8]}@example.com"
    e_upper = e_lower.upper()
    # 3 attempts under mixed casing should exhaust the bucket
    s.post(f"{API}/kit-orders/resend", json={"email": e_lower})
    s.post(f"{API}/kit-orders/resend", json={"email": e_upper})
    s.post(f"{API}/kit-orders/resend", json={"email": e_lower})
    r4 = s.post(f"{API}/kit-orders/resend", json={"email": e_upper})
    assert r4.status_code == 429, "case-insensitive rate limit failed"
