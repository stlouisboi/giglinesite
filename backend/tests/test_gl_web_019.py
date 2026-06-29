"""GL-WEB-019 — OSHA Inspection Guide email-capture backend tests + page regressions."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to frontend .env if not exported
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                    break
    except FileNotFoundError:
        pass

ENDPOINT = f"{BASE_URL}/api/osha-inspection-guide/submit"


@pytest.fixture
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# === OSHA Inspection Guide submit endpoint ===

class TestOshaInspectionGuideSubmit:
    def test_full_payload_success(self, session):
        payload = {
            "email": "TEST_oig_full@example.com",
            "first_name": "Vince",
            "company": "TEST_OIG_Co",
        }
        r = session.post(ENDPOINT, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert data.get("message") == "Check your inbox. Your guide is on the way."

    def test_email_only_success(self, session):
        payload = {"email": "TEST_oig_emailonly@example.com"}
        r = session.post(ENDPOINT, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "Check your inbox" in data["message"]

    def test_empty_strings_optional(self, session):
        payload = {
            "email": "TEST_oig_blanks@example.com",
            "first_name": "",
            "company": "",
        }
        r = session.post(ENDPOINT, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json()["success"] is True

    def test_invalid_email_rejected(self, session):
        r = session.post(ENDPOINT, json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422

    def test_missing_email_rejected(self, session):
        r = session.post(ENDPOINT, json={"first_name": "X"}, timeout=15)
        assert r.status_code == 422


# === Regression: key pages return 200 ===

REG_PATHS = [
    "/",
    "/services",
    "/resources",
    "/sample-report",
    "/field-notes",
    "/intake",
    "/admin",
    "/osha-inspection-guide",
]


@pytest.mark.parametrize("path", REG_PATHS)
def test_page_returns_200(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=20, allow_redirects=True)
    assert r.status_code == 200, f"{path} -> {r.status_code}"
