"""GL-WEB-018 — Tests for QuickContact route + frontend regression smoke."""

import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fallback: read frontend .env
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ── ITEM C — Backend route /api/quick-contact/submit ──
class TestQuickContact:
    def test_submit_full_payload(self, api_client):
        r = api_client.post(f"{API}/quick-contact/submit", json={
            "name": "TEST_QC Vince",
            "contact": "qc-test@example.com",
            "message": "Just want to talk about a walkthrough.",
        }, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert "Vince" in data.get("message", "")

    def test_submit_without_message(self, api_client):
        r = api_client.post(f"{API}/quick-contact/submit", json={
            "name": "TEST_QC NoMsg",
            "contact": "336-555-0101",
        }, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json().get("success") is True

    def test_submit_with_phone(self, api_client):
        r = api_client.post(f"{API}/quick-contact/submit", json={
            "name": "TEST_QC Phone",
            "contact": "(336) 329-8899",
            "message": "",
        }, timeout=15)
        assert r.status_code == 200
        assert r.json().get("success") is True

    def test_empty_payload_responds_cleanly(self, api_client):
        # Pydantic will reject missing required fields; verify clean 422 (not 500)
        r = api_client.post(f"{API}/quick-contact/submit", json={}, timeout=15)
        assert r.status_code in (200, 422), f"Got {r.status_code}: {r.text}"
        # Must be valid JSON, not a crashed 500
        assert r.headers.get("content-type", "").startswith("application/json")

    def test_invalid_payload_responds_cleanly(self, api_client):
        r = api_client.post(f"{API}/quick-contact/submit", json={
            "name": "",
            "contact": "",
        }, timeout=15)
        # Backend accepts empty strings (no validator), so 200 is expected
        assert r.status_code in (200, 422)
        assert r.headers.get("content-type", "").startswith("application/json")


# ── REGRESSION — verify all pages still return 200 ──
class TestRegression:
    @pytest.mark.parametrize("path", [
        "/",
        "/services",
        "/sample-report",
        "/resources",
        "/field-notes",
        "/case-study/metals-fabrication-statesville",
        "/intake",
        "/field-notes/forklift-safety",
        "/field-notes/silica-respirable-crystalline",
        "/field-notes/abrasive-wheels",
    ])
    def test_page_returns_200(self, api_client, path):
        r = api_client.get(f"{BASE_URL}{path}", timeout=15)
        assert r.status_code == 200, f"{path} → {r.status_code}"

    def test_api_health(self, api_client):
        # Common health pattern — try /api/ first
        r = api_client.get(f"{API}/", timeout=10)
        assert r.status_code in (200, 404)  # router may not have root


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
