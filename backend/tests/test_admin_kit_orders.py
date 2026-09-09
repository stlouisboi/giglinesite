"""Admin Kit Orders view — auth, filters, and mark-shipped regression tests."""

import os
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
ADMIN_PASSWORD = "gigline2026"


@pytest.fixture
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ── /api/admin/kit-orders ─────────────────────────────────────────────────────

def test_kit_orders_requires_auth(s):
    r = s.get(f"{API}/admin/kit-orders")
    assert r.status_code == 401


def test_kit_orders_rejects_wrong_password(s):
    r = s.get(f"{API}/admin/kit-orders?token=wrong")
    assert r.status_code == 401


def test_kit_orders_returns_shape(s):
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}")
    assert r.status_code == 200
    body = r.json()
    # Response contract
    assert "orders" in body and isinstance(body["orders"], list)
    assert "counts" in body and isinstance(body["counts"], dict)
    assert "filter" in body
    # Counts shape
    for k in ("total_paid", "needs_shipping", "citation_proof_kit_paid", "supervisor_kit_paid"):
        assert k in body["counts"], f"missing count '{k}'"
        assert isinstance(body["counts"][k], int)


def test_kit_orders_default_filter_is_all(s):
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}")
    assert r.json()["filter"] == "all"


@pytest.mark.parametrize("f", ["all", "needs_shipping", "auto_delivered", "pending_manual", "shipped"])
def test_kit_orders_valid_filters(s, f):
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}&filter={f}")
    assert r.status_code == 200
    assert r.json()["filter"] == f


def test_kit_orders_rejects_invalid_filter(s):
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}&filter=bogus")
    assert r.status_code == 400


def test_kit_orders_normalized_shape(s):
    """Every returned order (across both sources) must expose the same normalized keys."""
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}")
    orders = r.json()["orders"]
    if not orders:
        pytest.skip("No paid orders in DB to validate shape against")
    required = {
        "source", "session_id", "product_slug", "tier", "label", "amount_cents",
        "physical", "customer_email", "customer_name", "customer_phone",
        "company_name", "shipping_details", "fulfillment_status", "paid_at",
    }
    for o in orders:
        missing = required - set(o.keys())
        assert not missing, f"order missing keys: {missing}"
        assert o["source"] in ("citation_proof_kit", "supervisor_kit")


def test_kit_orders_needs_shipping_only_physical(s):
    """`filter=needs_shipping` must only return orders with physical=True."""
    r = s.get(f"{API}/admin/kit-orders?token={ADMIN_PASSWORD}&filter=needs_shipping")
    for o in r.json()["orders"]:
        assert o["physical"] is True, f"non-physical order returned under needs_shipping: {o['session_id']}"


# ── /api/admin/kit-orders/{session_id}/mark-shipped ───────────────────────────

def test_mark_shipped_requires_auth(s):
    r = s.post(f"{API}/admin/kit-orders/abc-123/mark-shipped", json={})
    assert r.status_code == 401


def test_mark_shipped_wrong_password(s):
    r = s.post(f"{API}/admin/kit-orders/abc-123/mark-shipped", json={"token": "wrong"})
    assert r.status_code == 401


def test_mark_shipped_unknown_session_returns_404(s):
    r = s.post(
        f"{API}/admin/kit-orders/does-not-exist-xyz/mark-shipped",
        json={"token": ADMIN_PASSWORD, "tracking_number": "1Z999", "carrier": "USPS"},
    )
    assert r.status_code == 404
